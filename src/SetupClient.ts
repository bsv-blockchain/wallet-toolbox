import {
  BEEF,
  CachedKeyDeriver,
  CreateActionArgs,
  CreateActionOptions,
  CreateActionOutput,
  CreateActionResult,
  KeyDeriver,
  KeyDeriverApi,
  LockingScript,
  P2PKH,
  PrivateKey,
  PublicKey,
  ScriptTemplateUnlock,
  WalletInterface
} from '@bsv/sdk'
import { KeyPairAddress, SetupClientWalletArgs, SetupWallet, SetupWalletClient } from './SetupWallet'
import { StorageIdb } from './storage/StorageIdb'
import { WalletStorageManager } from './storage/WalletStorageManager'
import { Services } from './services/Services'
import { Monitor } from './monitor/Monitor'
import { PrivilegedKeyManager } from './sdk/PrivilegedKeyManager'
import { Wallet } from './Wallet'
import { Chain } from './sdk/types'
import { randomBytesHex } from './utility/utilityHelpers'
import { StorageClient } from './storage/remoting/StorageClient'

/**
 * The 'Setup` class provides static setup functions to construct BRC-100 compatible
 * wallets in a variety of configurations.
 *
 * It serves as a starting point for experimentation and customization.
 */
export abstract class SetupClient {
  /**
   * Create a `Wallet`. Storage can optionally be provided or configured later.
   *
   * The following components are configured: KeyDeriver, WalletStorageManager, WalletService, WalletStorage.
   * Optionally, PrivilegedKeyManager is also configured.
   *
   * @publicbody
   */
  static async createWallet(args: SetupClientWalletArgs): Promise<SetupWallet> {
    const chain = args.chain
    const rootKey = PrivateKey.fromHex(args.rootKeyHex)
    const identityKey = rootKey.toPublicKey().toString()
    const keyDeriver = new CachedKeyDeriver(rootKey)
    const storage = new WalletStorageManager(identityKey, args.active, args.backups)
    if (storage.canMakeAvailable()) await storage.makeAvailable()
    const serviceOptions = Services.createDefaultOptions(chain)
    serviceOptions.taalApiKey = args.taalApiKey
    const services = new Services(serviceOptions)
    const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services)
    const monitor = new Monitor(monopts)
    monitor.addDefaultTasks()
    const privilegedKeyManager = args.privilegedKeyGetter
      ? new PrivilegedKeyManager(args.privilegedKeyGetter)
      : undefined
    const wallet = new Wallet({
      chain,
      keyDeriver,
      storage,
      services,
      monitor,
      privilegedKeyManager
    })
    const r: SetupWallet = {
      rootKey,
      identityKey,
      keyDeriver,
      chain,
      storage,
      services,
      monitor,
      wallet
    }
    return r
  }

  /**
   * Setup a new `Wallet` without requiring a .env file.
   *
   * @param args.chain - 'main' or 'test'
   * @param args.rootKeyHex  - Root private key for wallet's key deriver.
   * @param args.storageUrl - Optional. `StorageClient` and `chain` compatible endpoint URL.
   * @param args.privilegedKeyGetter - Optional. Method that will return the privileged `PrivateKey`, on demand.
   */
  static async createWalletClientNoEnv(args: {
    chain: Chain
    rootKeyHex: string
    storageUrl?: string
    privilegedKeyGetter?: () => Promise<PrivateKey>
  }): Promise<Wallet> {
    const chain = args.chain
    const endpointUrl = args.storageUrl || `https://${args.chain !== 'main' ? 'staging-' : ''}storage.babbage.systems`
    const rootKey = PrivateKey.fromHex(args.rootKeyHex)
    const keyDeriver = new CachedKeyDeriver(rootKey)
    const storage = new WalletStorageManager(keyDeriver.identityKey)
    const services = new Services(chain)
    const privilegedKeyManager = args.privilegedKeyGetter
      ? new PrivilegedKeyManager(args.privilegedKeyGetter)
      : undefined
    const wallet = new Wallet({
      chain,
      keyDeriver,
      storage,
      services,
      privilegedKeyManager
    })
    const client = new StorageClient(wallet, endpointUrl)
    await storage.addWalletStorageProvider(client)
    await storage.makeAvailable()
    return wallet
  }

  /**
   * @publicbody
   */
  static async createWalletClient(args: SetupClientWalletClientArgs): Promise<SetupWalletClient> {
    const wo = await SetupClient.createWallet(args)

    const endpointUrl = args.endpointUrl || `https://${args.chain !== 'main' ? 'staging-' : ''}storage.babbage.systems`

    const client = new StorageClient(wo.wallet, endpointUrl)
    await wo.storage.addWalletStorageProvider(client)
    await wo.storage.makeAvailable()
    return {
      ...wo,
      endpointUrl
    }
  }

  /**
   * @publicbody
   */
  static getKeyPair(priv?: string | PrivateKey): KeyPairAddress {
    if (priv === undefined) priv = PrivateKey.fromRandom()
    else if (typeof priv === 'string') priv = new PrivateKey(priv, 'hex')

    const pub = PublicKey.fromPrivateKey(priv)
    const address = pub.toAddress()
    return { privateKey: priv, publicKey: pub, address }
  }

  /**
   * @publicbody
   */
  static getLockP2PKH(address: string): LockingScript {
    const p2pkh = new P2PKH()
    const lock = p2pkh.lock(address)
    return lock
  }

  /**
   * @publicbody
   */
  static getUnlockP2PKH(priv: PrivateKey, satoshis: number): ScriptTemplateUnlock {
    const p2pkh = new P2PKH()
    const lock = SetupClient.getLockP2PKH(SetupClient.getKeyPair(priv).address)
    // Prepare to pay with SIGHASH_ALL and without ANYONE_CAN_PAY.
    // In otherwords:
    // - all outputs must remain in the current order, amount and locking scripts.
    // - all inputs must remain from the current outpoints and sequence numbers.
    // (unlock scripts are never signed)
    const unlock = p2pkh.unlock(priv, 'all', false, satoshis, lock)
    return unlock
  }

  /**
   * @publicbody
   */
  static createP2PKHOutputs(
    outputs: {
      address: string
      satoshis: number
      outputDescription?: string
      basket?: string
      tags?: string[]
    }[]
  ): CreateActionOutput[] {
    const os: CreateActionOutput[] = []
    const count = outputs.length
    for (let i = 0; i < count; i++) {
      const o = outputs[i]
      os.push({
        basket: o.basket,
        tags: o.tags,
        satoshis: o.satoshis,
        lockingScript: SetupClient.getLockP2PKH(o.address).toHex(),
        outputDescription: o.outputDescription || `p2pkh ${i}`
      })
    }
    return os
  }

  /**
   * @publicbody
   */
  static async createP2PKHOutputsAction(
    wallet: WalletInterface,
    outputs: {
      address: string
      satoshis: number
      outputDescription?: string
      basket?: string
      tags?: string[]
    }[],
    options?: CreateActionOptions
  ): Promise<{
    cr: CreateActionResult
    outpoints: string[] | undefined
  }> {
    const os = SetupClient.createP2PKHOutputs(outputs)

    const createArgs: CreateActionArgs = {
      description: `createP2PKHOutputs`,
      outputs: os,
      options: {
        ...options,
        // Don't randomize so we can simplify outpoint creation
        randomizeOutputs: false
      }
    }

    const cr = await wallet.createAction(createArgs)

    let outpoints: string[] | undefined

    if (cr.txid) {
      outpoints = os.map((o, i) => `${cr.txid}.${i}`)
    }

    return { cr, outpoints }
  }

  /**
   * @publicbody
   */
  static async fundWalletFromP2PKHOutpoints(
    wallet: WalletInterface,
    outpoints: string[],
    p2pkhKey: KeyPairAddress,
    inputBEEF?: BEEF
  ) {
    // TODO
  }

  /**
   * Adds `indexedDB` based storage to a `Wallet` configured by `SetupClient.createWalletOnly`
   *
   * @param args.databaseName Name for this storage. For MySQL, the schema name within the MySQL instance.
   * @param args.chain Which chain this wallet is on: 'main' or 'test'. Defaults to 'test'.
   * @param args.rootKeyHex
   *
   * @publicbody
   */
  static async createWalletIdb(args: SetupWalletIdbArgs): Promise<SetupWalletIdb> {
    const wo = await SetupClient.createWallet(args)
    const activeStorage = await SetupClient.createStorageIdb(args)
    await wo.storage.addWalletStorageProvider(activeStorage)
    const { user, isNew } = await activeStorage.findOrInsertUser(wo.identityKey)
    const userId = user.userId
    const r: SetupWalletIdb = {
      ...wo,
      activeStorage,
      userId
    }
    return r
  }

  /**
   * @returns {StorageIdb} - `Knex` based storage provider for a wallet. May be used for either active storage or backup storage.
   */
  static async createStorageIdb(args: SetupWalletIdbArgs): Promise<StorageIdb> {
    const storage = new StorageIdb({
      chain: args.chain,
      commissionSatoshis: 0,
      commissionPubKeyHex: undefined,
      feeModel: { model: 'sat/kb', value: 1 }
    })
    await storage.migrate(args.databaseName, randomBytesHex(33))
    await storage.makeAvailable()
    return storage
  }
}

/**
 *
 */
export interface SetupWalletIdbArgs extends SetupClientWalletArgs {
  databaseName: string
}

/**
 *
 */
export interface SetupWalletIdb extends SetupWallet {
  activeStorage: StorageIdb
  userId: number

  rootKey: PrivateKey
  identityKey: string
  keyDeriver: KeyDeriverApi
  chain: Chain
  storage: WalletStorageManager
  services: Services
  monitor: Monitor
  wallet: Wallet
}

/**
 * Extension `SetupWalletClientArgs` of `SetupWalletArgs` is used by `createWalletClient`
 * to construct a `SetupWalletClient`.
 */
export interface SetupClientWalletClientArgs extends SetupClientWalletArgs {
  /**
   * The endpoint URL of a service hosting the `StorageServer` JSON-RPC service to
   * which a `StorageClient` instance should connect to function as
   * the active storage provider of the newly created wallet.
   */
  endpointUrl?: string
}
