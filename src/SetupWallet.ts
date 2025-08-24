import { PrivateKey, KeyDeriver, PublicKey, KeyDeriverApi } from '@bsv/sdk'
import { Wallet } from './Wallet'
import { Chain } from './sdk/types'
import { WalletStorageManager } from './storage/WalletStorageManager'
import { Services } from './services/Services'
import { Monitor } from './monitor/Monitor'
import { WalletStorageProvider } from './sdk/WalletStorage.interfaces'

/**
 * When creating a BRC-100 compatible `Wallet`, many components come into play.
 *
 * All of the `createWallet` functions in the `Setup` and `SetupClient` classes return
 * an object with direct access to each component to facilitate experimentation, testing
 * and customization.
 */

export interface SetupWallet {
  /**
   * The rootKey of the `KeyDeriver`. The private key from which other keys are derived.
   */
  rootKey: PrivateKey
  /**
   * The pubilc key associated with the `rootKey` which also serves as the wallet's identity.
   */
  identityKey: string
  /**
   * The `KeyDeriver` component used by the wallet for key derivation and cryptographic functions.
   */
  keyDeriver: KeyDeriverApi
  /**
   * The chain ('main' or 'test') which the wallet accesses.
   */
  chain: Chain
  /**
   * The `WalletStorageManager` that manages all the configured storage providers (active and backups)
   * accessed by the wallet.
   */
  storage: WalletStorageManager
  /**
   * The network `Services` component which provides the wallet with access to external services hosted
   * on the public network.
   */
  services: Services
  /**
   * The background task `Monitor` component available to the wallet to offload tasks
   * that speed up wallet operations and maintain data integrity.
   */
  monitor: Monitor
  /**
   * The actual BRC-100 `Wallet` to which all the other properties and components contribute.
   *
   * Note that internally, the wallet is itself linked to all these properties and components.
   * They are included in this interface to facilitate access after wallet construction for
   * experimentation, testing and customization. Any changes made to the configuration of these
   * components after construction may disrupt the normal operation of the wallet.
   */
  wallet: Wallet
} /**
 * A private key and associated public key and address.
 */

export interface KeyPairAddress {
  privateKey: PrivateKey
  publicKey: PublicKey
  address: string
}
/**
 * Arguments used by `createWallet` to construct a `SetupWallet`.
 *
 * Extension `SetupWalletClientArgs` used by `createWalletClient` to construct a `SetupWalletClient`.
 *
 * Extension `SetupWalletIdbArgs` used by `createWalletIdb` to construct a `SetupWalletIdb`.
 */

export interface SetupClientWalletArgs {
  chain: Chain
  /**
   * The non-privileged private key used to initialize the `KeyDeriver` and determine the `identityKey`.
   */
  rootKeyHex: string
  /**
   * Optional. The privileged private key getter used to initialize the `PrivilegedKeyManager`.
   * Defaults to undefined.
   */
  privilegedKeyGetter?: () => Promise<PrivateKey>
  /**
   * Optional. Active wallet storage. Can be added later.
   */
  active?: WalletStorageProvider
  /**
   * Optional. One or more storage providers managed as backup destinations. Can be added later.
   */
  backups?: WalletStorageProvider[]

  taalApiKey?: string
}

/**
 * Extension `SetupWalletClient` of `SetupWallet` is returned by `createWalletClient`
 */
export interface SetupWalletClient extends SetupWallet {
  /**
   * The endpoint URL of the service hosting the `StorageServer` JSON-RPC service to
   * which a `StorageClient` instance is connected to function as
   * the active storage provider of the wallet.
   */
  endpointUrl: string
}
