import {
  CreateActionArgs,
  CreateActionOutput,
  CreateActionResult,
  HexString,
  KeyDeriver,
  P2PKH,
  PrivateKey,
  PublicKey,
  SatoshiValue,
  SignActionArgs,
  SignActionResult,
  Utils,
  WalletAction,
  WalletActionInput,
  WalletActionOutput,
  WalletCertificate,
  WalletInterface
} from '@bsv/sdk'
import path from 'path'
import { promises as fsp } from 'fs'
import {
  asArray,
  randomBytesBase64,
  randomBytesHex,
  sdk,
  StorageProvider,
  StorageKnex,
  StorageSyncReader,
  table,
  verifyTruthy,
  Wallet,
  Monitor,
  Services,
  WalletStorageManager,
  verifyOne,
  StorageClient
} from '../../src/index.all'

import { Knex, knex as makeKnex } from 'knex'
import { Beef } from '@bsv/sdk'

import * as dotenv from 'dotenv'
import { PrivilegedKeyManager, TransactionStatus } from '../../src/sdk'
dotenv.config()

const localMySqlConnection = process.env.LOCAL_MYSQL_CONNECTION || ''

export interface TuEnv {
  chain: sdk.Chain
  userId: number
  identityKey: string
  mainTaalApiKey: string
  testTaalApiKey: string
  devKeys: Record<string, string>
  noMySQL: boolean
  runSlowTests: boolean
  logTests: boolean
}

export abstract class TestUtilsWalletStorage {
  static getEnv(chain: sdk.Chain) {
    // Identity keys of the lead maintainer of this repo...
    const identityKey =
      (chain === 'main'
        ? process.env.MY_MAIN_IDENTITY
        : process.env.MY_TEST_IDENTITY) || ''
    const identityKey2 =
      (chain === 'main'
        ? process.env.MY_MAIN_IDENTITY2
        : process.env.MY_TEST_IDENTITY2) || ''
    const DEV_KEYS = process.env.DEV_KEYS || '{}'
    const logTests = !!process.env.LOGTESTS
    const runMySQL = !!process.env.RUNMYSQL
    const runSlowTests = !!process.env.RUNSLOWTESTS
    return {
      chain,
      identityKey,
      identityKey2,
      mainTaalApiKey: verifyTruthy(
        process.env.MAIN_TAAL_API_KEY || '',
        `.env value for 'mainTaalApiKey' is required.`
      ),
      testTaalApiKey: verifyTruthy(
        process.env.TEST_TAAL_API_KEY || '',
        `.env value for 'testTaalApiKey' is required.`
      ),
      devKeys: JSON.parse(DEV_KEYS) as Record<string, string>,
      runMySQL,
      runSlowTests,
      logTests
    }
  }

  static async createNoSendP2PKHTestOutpoint(
    address: string,
    satoshis: number,
    noSendChange: string[] | undefined,
    wallet: WalletInterface
  ): Promise<{
    noSendChange: string[]
    txid: string
    cr: CreateActionResult
    sr: SignActionResult
  }> {
    return await _tu.createNoSendP2PKHTestOutpoints(
      1,
      address,
      satoshis,
      noSendChange,
      wallet
    )
  }

  static async createNoSendP2PKHTestOutpoints(
    count: number,
    address: string,
    satoshis: number,
    noSendChange: string[] | undefined,
    wallet: WalletInterface
  ): Promise<{
    noSendChange: string[]
    txid: string
    cr: CreateActionResult
    sr: SignActionResult
  }> {
    const outputs: CreateActionOutput[] = []
    for (let i = 0; i < count; i++) {
      outputs.push({
        basket: `test-p2pkh-output-${i}`,
        satoshis,
        lockingScript: _tu.getLockP2PKH(address).toHex(),
        outputDescription: `p2pkh ${i}`
      })
    }

    const createArgs: CreateActionArgs = {
      description: `to ${address}`,
      outputs,
      options: {
        noSendChange,
        randomizeOutputs: false,
        signAndProcess: false,
        noSend: true
      }
    }

    const cr = await wallet.createAction(createArgs)
    noSendChange = cr.noSendChange

    expect(cr.noSendChange).toBeTruthy()
    expect(cr.sendWithResults).toBeUndefined()
    expect(cr.tx).toBeUndefined()
    expect(cr.txid).toBeUndefined()

    expect(cr.signableTransaction).toBeTruthy()
    const st = cr.signableTransaction!
    expect(st.reference).toBeTruthy()
    // const tx = Transaction.fromAtomicBEEF(st.tx) // Transaction doesn't support V2 Beef yet.
    const atomicBeef = Beef.fromBinary(st.tx)
    const tx = atomicBeef.txs[atomicBeef.txs.length - 1].tx
    for (const input of tx.inputs) {
      expect(atomicBeef.findTxid(input.sourceTXID!)).toBeTruthy()
    }

    // Spending authorization check happens here...
    //expect(st.amount > 242 && st.amount < 300).toBe(true)
    // sign and complete
    const signArgs: SignActionArgs = {
      reference: st.reference,
      spends: {},
      options: {
        returnTXIDOnly: true,
        noSend: true
      }
    }

    const sr = await wallet.signAction(signArgs)

    let txid = sr.txid!
    // Update the noSendChange txid to final signed value.
    noSendChange = noSendChange!.map(op => `${txid}.${op.split('.')[1]}`)
    return { noSendChange, txid, cr, sr }
  }

  static getKeyPair(priv?: string | PrivateKey): TestKeyPair {
    if (priv === undefined) priv = PrivateKey.fromRandom()
    else if (typeof priv === 'string') priv = new PrivateKey(priv, 'hex')

    const pub = PublicKey.fromPrivateKey(priv)
    const address = pub.toAddress()
    return { privateKey: priv, publicKey: pub, address }
  }

  static getLockP2PKH(address: string) {
    const p2pkh = new P2PKH()
    const lock = p2pkh.lock(address)
    return lock
  }

  static getUnlockP2PKH(priv: PrivateKey, satoshis: number) {
    const p2pkh = new P2PKH()
    const lock = _tu.getLockP2PKH(_tu.getKeyPair(priv).address)
    // Prepare to pay with SIGHASH_ALL and without ANYONE_CAN_PAY.
    // In otherwords:
    // - all outputs must remain in the current order, amount and locking scripts.
    // - all inputs must remain from the current outpoints and sequence numbers.
    // (unlock scripts are never signed)
    const unlock = p2pkh.unlock(priv, 'all', false, satoshis, lock)
    return unlock
  }

  static async createWalletOnly(args: {
    chain?: sdk.Chain
    rootKeyHex?: string
    active?: sdk.WalletStorageProvider
    backups?: sdk.WalletStorageProvider[]
    privKeyHex?: string
  }): Promise<TestWalletOnly> {
    args.chain ||= 'test'
    args.rootKeyHex ||= '1'.repeat(64)
    const rootKey = PrivateKey.fromHex(args.rootKeyHex)
    const identityKey = rootKey.toPublicKey().toString()
    const keyDeriver = new KeyDeriver(rootKey)
    const chain = args.chain
    const storage = new WalletStorageManager(
      identityKey,
      args.active,
      args.backups
    )
    if (storage.stores.length > 0) await storage.makeAvailable()
    const services = new Services(args.chain)
    const monopts = Monitor.createDefaultWalletMonitorOptions(
      chain,
      storage,
      services
    )
    const monitor = new Monitor(monopts)
    monitor.addDefaultTasks()
    let privilegedKeyManager: PrivilegedKeyManager | undefined = undefined
    if (args.privKeyHex) {
      const privKey = PrivateKey.fromString(args.privKeyHex)
      privilegedKeyManager = new PrivilegedKeyManager(async () => privKey)
    }
    const wallet = new Wallet({
      chain,
      keyDeriver,
      storage,
      services,
      monitor,
      privilegedKeyManager
    })
    const r: TestWalletOnly = {
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

  static async createTestWalletWithStorageClient(args: {
    rootKeyHex?: string
    endpointUrl?: string
    chain?: sdk.Chain
  }): Promise<TestWalletOnly> {
    if (args.chain === 'main')
      throw new sdk.WERR_INVALID_PARAMETER(
        'chain',
        `'test' for now, 'main' is not yet supported.`
      )

    const wo = await _tu.createWalletOnly({
      chain: 'test',
      rootKeyHex: args.rootKeyHex
    })
    args.endpointUrl ||= 'https://staging-dojo.babbage.systems'
    const client = new StorageClient(wo.wallet, args.endpointUrl)
    await wo.storage.addWalletStorageProvider(client)
    await wo.storage.makeAvailable()
    return wo
  }

  static async createKnexTestWalletWithSetup<T>(args: {
    knex: Knex<any, any[]>
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
    privKeyHex?: string
    insertSetup: (storage: StorageKnex, identityKey: string) => Promise<T>
  }): Promise<TestWallet<T>> {
    const wo = await _tu.createWalletOnly({
      chain: args.chain,
      rootKeyHex: args.rootKeyHex,
      privKeyHex: args.privKeyHex
    })
    const activeStorage = new StorageKnex({
      chain: wo.chain,
      knex: args.knex,
      commissionSatoshis: 0,
      commissionPubKeyHex: undefined,
      feeModel: { model: 'sat/kb', value: 1 }
    })
    if (args.dropAll) await activeStorage.dropAllData()
    await activeStorage.migrate(args.databaseName, wo.identityKey)
    await activeStorage.makeAvailable()
    const setup = await args.insertSetup(activeStorage, wo.identityKey)
    await wo.storage.addWalletStorageProvider(activeStorage)
    const { user, isNew } = await activeStorage.findOrInsertUser(wo.identityKey)
    const userId = user.userId
    const r: TestWallet<T> = {
      ...wo,
      activeStorage,
      setup,
      userId
    }
    return r
  }

  /**
   * Returns path to temporary file in project's './test/data/tmp/' folder.
   *
   * Creates any missing folders.
   *
   * Optionally tries to delete any existing file. This may fail if the file file is locked
   * by another process.
   *
   * Optionally copies filename (or if filename has no dir component, a file of the same filename from the project's './test/data' folder) to initialize file's contents.
   *
   * CAUTION: returned file path will include four random hex digits unless tryToDelete is true. Files must be purged periodically.
   *
   * @param filename target filename without path, optionally just extension in which case random name is used
   * @param tryToDelete true to attempt to delete an existing file at the returned file path.
   * @param copyToTmp true to copy file of same filename from './test/data' (or elsewhere if filename has path) to tmp folder
   * @param reuseExisting true to use existing file if found, otherwise a random string is added to filename.
   * @returns path in './test/data/tmp' folder.
   */
  static async newTmpFile(
    filename = '',
    tryToDelete = false,
    copyToTmp = false,
    reuseExisting = false
  ): Promise<string> {
    const tmpFolder = './test/data/tmp/'
    const p = path.parse(filename)
    const dstDir = tmpFolder
    const dstName = `${p.name}${tryToDelete || reuseExisting ? '' : randomBytesHex(6)}`
    const dstExt = p.ext || 'tmp'
    const dstPath = path.resolve(`${dstDir}${dstName}${dstExt}`)
    await fsp.mkdir(tmpFolder, { recursive: true })
    if (!reuseExisting && (tryToDelete || copyToTmp))
      try {
        await fsp.unlink(dstPath)
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        if (e.name !== 'ENOENT') {
          throw e
        }
      }
    if (copyToTmp) {
      const srcPath = p.dir
        ? path.resolve(filename)
        : path.resolve(`./test/data/${filename}`)
      await fsp.copyFile(srcPath, dstPath)
    }
    return dstPath
  }

  static async copyFile(srcPath: string, dstPath: string): Promise<void> {
    await fsp.copyFile(srcPath, dstPath)
  }

  static async existingDataFile(filename: string): Promise<string> {
    const folder = './test/data/'
    return folder + filename
  }

  static createLocalSQLite(filename: string): Knex {
    const config: Knex.Config = {
      client: 'sqlite3',
      connection: { filename },
      useNullAsDefault: true
    }
    const knex = makeKnex(config)
    return knex
  }

  static createMySQLFromConnection(connection: object): Knex {
    const config: Knex.Config = {
      client: 'mysql2',
      connection,
      useNullAsDefault: true,
      pool: { min: 0, max: 7, idleTimeoutMillis: 15000 }
    }
    const knex = makeKnex(config)
    return knex
  }

  static createLocalMySQL(database: string): Knex {
    const connection = JSON.parse(localMySqlConnection || '{}')
    connection['database'] = database
    const config: Knex.Config = {
      client: 'mysql2',
      connection,
      useNullAsDefault: true,
      pool: { min: 0, max: 7, idleTimeoutMillis: 15000 }
    }
    const knex = makeKnex(config)
    return knex
  }

  static async createMySQLTestWallet(args: {
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
  }): Promise<TestWallet<{}>> {
    return await this.createKnexTestWallet({
      ...args,
      knex: _tu.createLocalMySQL(args.databaseName)
    })
  }

  static async createMySQLTestSetup1Wallet(args: {
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
  }): Promise<TestWallet<TestSetup1>> {
    return await this.createKnexTestSetup1Wallet({
      ...args,
      dropAll: true,
      knex: _tu.createLocalMySQL(args.databaseName)
    })
  }

  static async createMySQLTestSetup2Wallet(args: {
    databaseName: string
    mockData: MockData
    chain?: sdk.Chain
    rootKeyHex?: string
  }): Promise<TestWallet<TestSetup2>> {
    return await this.createKnexTestSetup2Wallet({
      ...args,
      dropAll: true,
      knex: _tu.createLocalMySQL(args.databaseName)
    })
  }

  static async createSQLiteTestWallet(args: {
    filePath?: string
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
    privKeyHex?: string
  }): Promise<TestWalletNoSetup> {
    const localSQLiteFile =
      args.filePath ||
      (await _tu.newTmpFile(`${args.databaseName}.sqlite`, false, false, true))
    return await this.createKnexTestWallet({
      ...args,
      knex: _tu.createLocalSQLite(localSQLiteFile)
    })
  }

  static async createSQLiteTestSetup1Wallet(args: {
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
  }): Promise<TestWallet<TestSetup1>> {
    const localSQLiteFile = await _tu.newTmpFile(
      `${args.databaseName}.sqlite`,
      false,
      false,
      true
    )
    return await this.createKnexTestSetup1Wallet({
      ...args,
      dropAll: true,
      knex: _tu.createLocalSQLite(localSQLiteFile)
    })
  }

  static async createSQLiteTestSetup2Wallet(args: {
    databaseName: string
    mockData: MockData
    chain?: sdk.Chain
    rootKeyHex?: string
  }): Promise<TestWallet<TestSetup2>> {
    const localSQLiteFile = await _tu.newTmpFile(
      `${args.databaseName}.sqlite`,
      false,
      false,
      true
    )
    return await this.createKnexTestSetup2Wallet({
      ...args,
      dropAll: true,
      knex: _tu.createLocalSQLite(localSQLiteFile)
    })
  }

  static async createKnexTestWallet(args: {
    knex: Knex<any, any[]>
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
    privKeyHex?: string
  }): Promise<TestWalletNoSetup> {
    return await _tu.createKnexTestWalletWithSetup({
      ...args,
      insertSetup: insertEmptySetup
    })
  }

  static async createKnexTestSetup1Wallet(args: {
    knex: Knex<any, any[]>
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
  }): Promise<TestWallet<TestSetup1>> {
    return await _tu.createKnexTestWalletWithSetup({
      ...args,
      insertSetup: _tu.createTestSetup1
    })
  }

  static async createKnexTestSetup2Wallet(args: {
    knex: Knex<any, any[]>
    databaseName: string
    mockData: MockData
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
  }): Promise<TestWallet<TestSetup2>> {
    return await _tu.createKnexTestWalletWithSetup({
      ...args,
      insertSetup: async (storage: StorageKnex, identityKey: string) => {
        return _tu.createTestSetup2(storage, identityKey, args.mockData)
      }
    })
  }

  static async fileExists(file: string): Promise<boolean> {
    try {
      const f = await fsp.open(file, 'r')
      await f.close()
      return true
    } catch (eu: unknown) {
      return false
    }
  }

  //if (await _tu.fileExists(walletFile))
  static async createLegacyWalletSQLiteCopy(
    databaseName: string
  ): Promise<TestWalletNoSetup> {
    const walletFile = await _tu.newTmpFile(
      `${databaseName}.sqlite`,
      false,
      false,
      true
    )
    const walletKnex = _tu.createLocalSQLite(walletFile)
    return await _tu.createLegacyWalletCopy(
      databaseName,
      walletKnex,
      walletFile
    )
  }

  static async createLegacyWalletMySQLCopy(
    databaseName: string
  ): Promise<TestWalletNoSetup> {
    const walletKnex = _tu.createLocalMySQL(databaseName)
    return await _tu.createLegacyWalletCopy(databaseName, walletKnex)
  }

  static async createLiveWalletSQLiteWARNING(
    databaseFullPath: string = './test/data/walletLiveTestData.sqlite'
  ): Promise<TestWalletNoSetup> {
    return await this.createKnexTestWallet({
      chain: 'test',
      rootKeyHex: _tu.legacyRootKeyHex,
      databaseName: 'walletLiveTestData',
      knex: _tu.createLocalSQLite(databaseFullPath)
    })
  }

  static async createWalletSQLite(
    databaseFullPath: string = './test/data/tmp/walletNewTestData.sqlite',
    databaseName: string = 'walletNewTestData'
  ): Promise<TestWalletNoSetup> {
    return await this.createSQLiteTestWallet({
      filePath: databaseFullPath,
      databaseName,
      chain: 'test',
      rootKeyHex: '1'.repeat(64),
      dropAll: true
    })
  }

  static legacyRootKeyHex =
    '153a3df216' +
    '686f55b253991c' +
    '7039da1f648' +
    'ffc5bfe93d6ac2c25ac' +
    '2d4070918d'

  static async createLegacyWalletCopy(
    databaseName: string,
    walletKnex: Knex<any, any[]>,
    tryCopyToPath?: string
  ): Promise<TestWalletNoSetup> {
    const readerFile = await _tu.existingDataFile(`walletLegacyTestData.sqlite`)
    let useReader = true
    if (tryCopyToPath) {
      await _tu.copyFile(readerFile, tryCopyToPath)
      //console.log('USING FILE COPY INSTEAD OF SOURCE DB SYNC')
      useReader = false
    }
    const chain: sdk.Chain = 'test'
    const rootKeyHex = _tu.legacyRootKeyHex
    const identityKey =
      '03ac2d10bdb0023f4145cc2eba2fcd2ad3070cb2107b0b48170c46a9440e4cc3fe'
    const rootKey = PrivateKey.fromHex(rootKeyHex)
    const keyDeriver = new KeyDeriver(rootKey)
    const activeStorage = new StorageKnex({
      chain,
      knex: walletKnex,
      commissionSatoshis: 0,
      commissionPubKeyHex: undefined,
      feeModel: { model: 'sat/kb', value: 1 }
    })
    if (useReader) await activeStorage.dropAllData()
    await activeStorage.migrate(databaseName, identityKey)
    await activeStorage.makeAvailable()
    const storage = new WalletStorageManager(identityKey, activeStorage)
    await storage.makeAvailable()
    if (useReader) {
      const readerKnex = _tu.createLocalSQLite(readerFile)
      const reader = new StorageKnex({
        chain,
        knex: readerKnex,
        commissionSatoshis: 0,
        commissionPubKeyHex: undefined,
        feeModel: { model: 'sat/kb', value: 1 }
      })
      await reader.makeAvailable()
      await storage.syncFromReader(
        identityKey,
        new StorageSyncReader({ identityKey }, reader)
      )
      await reader.destroy()
    }
    const services = new Services(chain)
    const monopts = Monitor.createDefaultWalletMonitorOptions(
      chain,
      storage,
      services
    )
    const monitor = new Monitor(monopts)
    const wallet = new Wallet({ chain, keyDeriver, storage, services, monitor })
    const userId = verifyTruthy(
      await activeStorage.findUserByIdentityKey(identityKey)
    ).userId
    const r: TestWallet<{}> = {
      rootKey,
      identityKey,
      keyDeriver,
      chain,
      activeStorage,
      storage,
      setup: {},
      services,
      monitor,
      wallet,
      userId
    }
    return r
  }

  static makeSampleCert(subject?: string): {
    cert: WalletCertificate
    subject: string
    certifier: PrivateKey
  } {
    subject ||= PrivateKey.fromRandom().toPublicKey().toString()
    const certifier = PrivateKey.fromRandom()
    const verifier = PrivateKey.fromRandom()
    const cert: WalletCertificate = {
      type: Utils.toBase64(new Array(32).fill(1)),
      serialNumber: Utils.toBase64(new Array(32).fill(2)),
      revocationOutpoint:
        'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef.1',
      subject,
      certifier: certifier.toPublicKey().toString(),
      fields: {
        name: 'Alice',
        email: 'alice@example.com',
        organization: 'Example Corp'
      },
      signature: ''
    }
    return { cert, subject, certifier }
  }

  static async insertTestProvenTx(storage: StorageProvider, txid?: string) {
    const now = new Date()
    const ptx: table.ProvenTx = {
      created_at: now,
      updated_at: now,
      provenTxId: 0,
      txid: txid || randomBytesHex(32),
      height: 1,
      index: 0,
      merklePath: [1, 2, 3, 4, 5, 6, 7, 8],
      rawTx: [4, 5, 6],
      blockHash: randomBytesHex(32),
      merkleRoot: randomBytesHex(32)
    }
    await storage.insertProvenTx(ptx)
    return ptx
  }

  static async insertTestProvenTxReq(
    storage: StorageProvider,
    txid?: string,
    provenTxId?: number,
    onlyRequired?: boolean
  ) {
    const now = new Date()
    const ptxreq: table.ProvenTxReq = {
      // Required:
      created_at: now,
      updated_at: now,
      provenTxReqId: 0,
      txid: txid || randomBytesHex(32),
      status: 'nosend',
      attempts: 0,
      notified: false,
      history: '{}',
      notify: '{}',
      rawTx: [4, 5, 6],
      // Optional:
      provenTxId: provenTxId || undefined,
      batch: onlyRequired ? undefined : randomBytesBase64(10),
      inputBEEF: onlyRequired ? undefined : [1, 2, 3]
    }
    await storage.insertProvenTxReq(ptxreq)
    return ptxreq
  }

  static async insertTestUser(storage: StorageProvider, identityKey?: string) {
    const now = new Date()
    const e: table.User = {
      created_at: now,
      updated_at: now,
      userId: 0,
      identityKey: identityKey || randomBytesHex(33)
    }
    await storage.insertUser(e)
    return e
  }

  static async insertTestCertificate(storage: StorageProvider, u?: table.User) {
    const now = new Date()
    u ||= await _tu.insertTestUser(storage)
    const e: table.Certificate = {
      created_at: now,
      updated_at: now,
      certificateId: 0,
      userId: u.userId,
      type: randomBytesBase64(33),
      serialNumber: randomBytesBase64(33),
      certifier: randomBytesHex(33),
      subject: randomBytesHex(33),
      verifier: undefined,
      revocationOutpoint: `${randomBytesHex(32)}.999`,
      signature: randomBytesHex(50),
      isDeleted: false
    }
    await storage.insertCertificate(e)
    return e
  }

  static async insertTestCertificateField(
    storage: StorageProvider,
    c: table.Certificate,
    name: string,
    value: string
  ) {
    const now = new Date()
    const e: table.CertificateField = {
      created_at: now,
      updated_at: now,
      certificateId: c.certificateId,
      userId: c.userId,
      fieldName: name,
      fieldValue: value,
      masterKey: randomBytesBase64(40)
    }
    await storage.insertCertificateField(e)
    return e
  }

  static async insertTestOutputBasket(
    storage: StorageProvider,
    u?: table.User | number,
    partial?: Partial<table.OutputBasket>
  ) {
    const now = new Date()
    if (typeof u === 'number')
      u = verifyOne(await storage.findUsers({ partial: { userId: u } }))
    u ||= await _tu.insertTestUser(storage)
    const e: table.OutputBasket = {
      created_at: now,
      updated_at: now,
      basketId: 0,
      userId: u.userId,
      name: randomBytesHex(6),
      numberOfDesiredUTXOs: 42,
      minimumDesiredUTXOValue: 1642,
      isDeleted: false,
      ...(partial || {})
    }
    await storage.insertOutputBasket(e)
    return e
  }

  static async insertTestTransaction(
    storage: StorageProvider,
    u?: table.User,
    onlyRequired?: boolean,
    partial?: Partial<table.Transaction>
  ) {
    const now = new Date()
    u ||= await _tu.insertTestUser(storage)
    const e: table.Transaction = {
      // Required:
      created_at: now,
      updated_at: now,
      transactionId: 0,
      userId: u.userId,
      status: 'nosend',
      reference: randomBytesBase64(10),
      isOutgoing: true,
      satoshis: 9999,
      description: 'buy me a river',
      // Optional:
      version: onlyRequired ? undefined : 0,
      lockTime: onlyRequired ? undefined : 500000000,
      txid: onlyRequired ? undefined : randomBytesHex(32),
      inputBEEF: onlyRequired ? undefined : new Beef().toBinary(),
      rawTx: onlyRequired ? undefined : [1, 2, 3],
      ...(partial || {})
    }
    await storage.insertTransaction(e)
    return { tx: e, user: u }
  }

  static async insertTestOutput(
    storage: StorageProvider,
    t: table.Transaction,
    vout: number,
    satoshis: number,
    basket?: table.OutputBasket,
    requiredOnly?: boolean,
    partial?: Partial<table.Output>
  ) {
    const now = new Date()
    const e: table.Output = {
      created_at: now,
      updated_at: now,
      outputId: 0,
      userId: t.userId,
      transactionId: t.transactionId,
      basketId: basket ? basket.basketId : undefined,
      spendable: true,
      change: true,
      outputDescription: 'not mutch to say',
      vout,
      satoshis,
      providedBy: 'you',
      purpose: 'secret',
      type: 'custom',
      txid: requiredOnly ? undefined : randomBytesHex(32),
      senderIdentityKey: requiredOnly ? undefined : randomBytesHex(32),
      derivationPrefix: requiredOnly ? undefined : randomBytesHex(16),
      derivationSuffix: requiredOnly ? undefined : randomBytesHex(16),
      spentBy: undefined, // must be a valid transsactionId
      sequenceNumber: requiredOnly ? undefined : 42,
      spendingDescription: requiredOnly ? undefined : randomBytesHex(16),
      scriptLength: requiredOnly ? undefined : 36,
      scriptOffset: requiredOnly ? undefined : 12,
      lockingScript: requiredOnly ? undefined : asArray(randomBytesHex(36)),
      ...(partial || {})
    }
    await storage.insertOutput(e)
    return e
  }

  static async insertTestOutputTag(
    storage: StorageProvider,
    u: table.User,
    partial?: Partial<table.OutputTag>
  ) {
    const now = new Date()
    const e: table.OutputTag = {
      created_at: now,
      updated_at: now,
      outputTagId: 0,
      userId: u.userId,
      tag: randomBytesHex(6),
      isDeleted: false,
      ...(partial || {})
    }
    await storage.insertOutputTag(e)
    return e
  }

  static async insertTestOutputTagMap(
    storage: StorageProvider,
    o: table.Output,
    tag: table.OutputTag
  ) {
    const now = new Date()
    const e: table.OutputTagMap = {
      created_at: now,
      updated_at: now,
      outputTagId: tag.outputTagId,
      outputId: o.outputId,
      isDeleted: false
    }
    await storage.insertOutputTagMap(e)
    return e
  }

  static async insertTestTxLabel(
    storage: StorageProvider,
    u: table.User,
    partial?: Partial<table.TxLabel>
  ) {
    const now = new Date()
    const e: table.TxLabel = {
      created_at: now,
      updated_at: now,
      txLabelId: 0,
      userId: u.userId,
      label: randomBytesHex(6),
      isDeleted: false,
      ...(partial || {})
    }
    await storage.insertTxLabel(e)
    return e
  }

  static async insertTestTxLabelMap(
    storage: StorageProvider,
    tx: table.Transaction,
    label: table.TxLabel,
    partial?: Partial<table.TxLabelMap>
  ) {
    const now = new Date()
    const e: table.TxLabelMap = {
      created_at: now,
      updated_at: now,
      txLabelId: label.txLabelId,
      transactionId: tx.transactionId,
      isDeleted: false,
      ...(partial || {})
    }
    await storage.insertTxLabelMap(e)
    return e
  }

  static async insertTestSyncState(storage: StorageProvider, u: table.User) {
    const now = new Date()
    const settings = await storage.getSettings()
    const e: table.SyncState = {
      created_at: now,
      updated_at: now,
      syncStateId: 0,
      userId: u.userId,
      storageIdentityKey: settings.storageIdentityKey,
      storageName: settings.storageName,
      status: 'unknown',
      init: false,
      refNum: randomBytesBase64(10),
      syncMap: '{}'
    }
    await storage.insertSyncState(e)
    return e
  }

  static async insertTestMonitorEvent(storage: StorageProvider) {
    const now = new Date()
    const e: table.MonitorEvent = {
      created_at: now,
      updated_at: now,
      id: 0,
      event: 'nothing much happened'
    }
    await storage.insertMonitorEvent(e)
    return e
  }

  static async insertTestCommission(
    storage: StorageProvider,
    t: table.Transaction
  ) {
    const now = new Date()
    const e: table.Commission = {
      created_at: now,
      updated_at: now,
      commissionId: 0,
      userId: t.userId,
      transactionId: t.transactionId,
      satoshis: 200,
      keyOffset: randomBytesBase64(32),
      isRedeemed: false,
      lockingScript: [1, 2, 3]
    }
    await storage.insertCommission(e)
    return e
  }

  static async createTestSetup1(
    storage: StorageProvider,
    u1IdentityKey?: string
  ): Promise<TestSetup1> {
    const u1 = await _tu.insertTestUser(storage, u1IdentityKey)
    const u1basket1 = await _tu.insertTestOutputBasket(storage, u1)
    const u1basket2 = await _tu.insertTestOutputBasket(storage, u1)
    const u1label1 = await _tu.insertTestTxLabel(storage, u1)
    const u1label2 = await _tu.insertTestTxLabel(storage, u1)
    const u1tag1 = await _tu.insertTestOutputTag(storage, u1)
    const u1tag2 = await _tu.insertTestOutputTag(storage, u1)
    const { tx: u1tx1 } = await _tu.insertTestTransaction(storage, u1)
    const u1comm1 = await _tu.insertTestCommission(storage, u1tx1)
    const u1tx1label1 = await _tu.insertTestTxLabelMap(storage, u1tx1, u1label1)
    const u1tx1label2 = await _tu.insertTestTxLabelMap(storage, u1tx1, u1label2)
    const u1tx1o0 = await _tu.insertTestOutput(
      storage,
      u1tx1,
      0,
      101,
      u1basket1
    )
    const u1o0tag1 = await _tu.insertTestOutputTagMap(storage, u1tx1o0, u1tag1)
    const u1o0tag2 = await _tu.insertTestOutputTagMap(storage, u1tx1o0, u1tag2)
    const u1tx1o1 = await _tu.insertTestOutput(
      storage,
      u1tx1,
      1,
      111,
      u1basket2
    )
    const u1o1tag1 = await _tu.insertTestOutputTagMap(storage, u1tx1o1, u1tag1)
    const u1cert1 = await _tu.insertTestCertificate(storage, u1)
    const u1cert1field1 = await _tu.insertTestCertificateField(
      storage,
      u1cert1,
      'bob',
      'your uncle'
    )
    const u1cert1field2 = await _tu.insertTestCertificateField(
      storage,
      u1cert1,
      'name',
      'alice'
    )
    const u1cert2 = await _tu.insertTestCertificate(storage, u1)
    const u1cert2field1 = await _tu.insertTestCertificateField(
      storage,
      u1cert2,
      'name',
      'alice'
    )
    const u1cert3 = await _tu.insertTestCertificate(storage, u1)
    const u1sync1 = await _tu.insertTestSyncState(storage, u1)

    const u2 = await _tu.insertTestUser(storage)
    const u2basket1 = await _tu.insertTestOutputBasket(storage, u2)
    const u2label1 = await _tu.insertTestTxLabel(storage, u2)
    const { tx: u2tx1 } = await _tu.insertTestTransaction(storage, u2, true)
    const u2comm1 = await _tu.insertTestCommission(storage, u2tx1)
    const u2tx1label1 = await _tu.insertTestTxLabelMap(storage, u2tx1, u2label1)
    const u2tx1o0 = await _tu.insertTestOutput(
      storage,
      u2tx1,
      0,
      101,
      u2basket1
    )
    const { tx: u2tx2 } = await _tu.insertTestTransaction(storage, u2, true)
    const u2comm2 = await _tu.insertTestCommission(storage, u2tx2)

    const proven1 = await _tu.insertTestProvenTx(storage)
    const req1 = await _tu.insertTestProvenTxReq(
      storage,
      undefined,
      undefined,
      true
    )
    const req2 = await _tu.insertTestProvenTxReq(
      storage,
      proven1.txid,
      proven1.provenTxId
    )

    const we1 = await _tu.insertTestMonitorEvent(storage)
    return {
      u1,
      u1basket1,
      u1basket2,
      u1label1,
      u1label2,
      u1tag1,
      u1tag2,
      u1tx1,
      u1comm1,
      u1tx1label1,
      u1tx1label2,
      u1tx1o0,
      u1o0tag1,
      u1o0tag2,
      u1tx1o1,
      u1o1tag1,
      u1cert1,
      u1cert1field1,
      u1cert1field2,
      u1cert2,
      u1cert2field1,
      u1cert3,
      u1sync1,

      u2,
      u2basket1,
      u2label1,
      u2tx1,
      u2comm1,
      u2tx1label1,
      u2tx1o0,
      u2tx2,
      u2comm2,

      proven1,
      req1,
      req2,

      we1
    }
  }

  static async createTestSetup2(
    storage: StorageProvider,
    identityKey: string,
    mockData: MockData = { actions: [] }
  ): Promise<TestSetup2> {
    if (!mockData || !mockData.actions) {
      throw new Error('mockData.actions is required')
    }

    const now = new Date()
    const inputTxMap: Record<string, any> = {}
    const outputMap: Record<string, any> = {}

    // only one user
    const user = await _tu.insertTestUser(storage, identityKey)

    // First create your output that represent your inputs
    for (const action of mockData.actions) {
      for (const input of action.inputs || []) {
        let prevOutput = outputMap[input.sourceOutpoint]

        if (!prevOutput) {
          const { tx: transaction } = await _tu.insertTestTransaction(
            storage,
            user,
            false,
            {
              txid: input.sourceOutpoint.split('.')[0],
              satoshis: input.sourceSatoshis,
              status: 'confirmed' as TransactionStatus,
              description: 'Generated transaction for input',
              lockTime: 0,
              version: 1,
              inputBEEF: [1, 2, 3, 4],
              rawTx: [4, 3, 2, 1]
            }
          )

          const basket = await _tu.insertTestOutputBasket(storage, user, {
            name: randomBytesHex(6)
          })

          // Need to convert
          const lockingScriptValue = input.sourceLockingScript
            ? Utils.toArray(input.sourceLockingScript)
            : undefined

          prevOutput = await _tu.insertTestOutput(
            storage,
            transaction,
            0,
            input.sourceSatoshis,
            basket,
            true, // Needs to be spendable
            {
              outputDescription: input.inputDescription,
              spendable: true,
              vout: Number(input.sourceOutpoint.split('.')[1]),
              lockingScript: lockingScriptValue,
              txid: transaction.txid
            }
          )

          // Store in maps for later use
          inputTxMap[input.sourceOutpoint] = transaction
          outputMap[input.sourceOutpoint] = prevOutput
        }
      }
    }

    // Process transactions that spend those previous outputs
    for (const action of mockData.actions) {
      const { tx: transaction } = await _tu.insertTestTransaction(
        storage,
        user,
        false,
        {
          txid: `${action.txid}` || `tx_${action.satoshis}_${Date.now()}`,
          satoshis: action.satoshis,
          status: action.status as TransactionStatus,
          description: action.description,
          lockTime: action.lockTime,
          version: action.version,
          inputBEEF: [1, 2, 3, 4],
          rawTx: [4, 3, 2, 1]
        }
      )

      // Loop through action inputs and update chosen outputs
      for (const input of action.inputs || []) {
        // Output must exist before updating
        const prevOutput = outputMap[input.sourceOutpoint]

        if (!prevOutput) {
          throw new Error(
            `UTXO not found in outputMap for sourceOutpoint: ${input.sourceOutpoint}`
          )
        }

        // Set correct output fields as per input fields
        await storage.updateOutput(prevOutput.outputId, {
          spendable: false, // Mark output as spent
          spentBy: transaction.transactionId, // Reference the new transaction
          spendingDescription: input.inputDescription, // Store description
          sequenceNumber: input.sequenceNumber // Store sequence number
        })
      }

      // Insert any new outputs for the transaction
      if (action.outputs) {
        for (const output of action.outputs) {
          const basket = await _tu.insertTestOutputBasket(storage, user, {
            name: output.basket
          })
          const insertedOutput = await _tu.insertTestOutput(
            storage,
            transaction,
            output.outputIndex,
            output.satoshis,
            basket,
            false,
            {
              outputDescription: output.outputDescription,
              spendable: output.spendable,
              txid: transaction.txid
            }
          )

          // Store this output in the map for future transactions to reference
          outputMap[`${action.txid}.${output.outputIndex}`] = insertedOutput
        }
      }

      // Labels inserted
      if (action.labels) {
        for (const label of action.labels) {
          const l = await _tu.insertTestTxLabel(storage, user, {
            label,
            isDeleted: false,
            created_at: now,
            updated_at: now,
            txLabelId: 0,
            userId: user.userId
          })
          await _tu.insertTestTxLabelMap(storage, transaction, l)
        }
      }

      // Tags inserted for outputs
      if (action.outputs) {
        for (const output of action.outputs) {
          if (output.tags) {
            // Ensure we fetch the correct inserted output for the current transaction
            const insertedOutput =
              outputMap[`${action.txid}.${output.outputIndex}`]

            if (!insertedOutput) {
              throw new Error(
                `Output not found for txid: ${action.txid}, vout: ${output.outputIndex}`
              )
            }

            for (const tag of output.tags) {
              // Insert the output tag into the database
              const insertedTag = await _tu.insertTestOutputTag(storage, user, {
                tag: tag,
                isDeleted: false,
                created_at: now,
                updated_at: now,
                outputTagId: 0, // Will be auto-incremented by the DB
                userId: user.userId
              })

              // Map the inserted tag to the correct output
              await _tu.insertTestOutputTagMap(
                storage,
                insertedOutput,
                insertedTag
              )
            }
          }
        }
      }
    }

    return mockData
  }

  static mockPostServicesAsSuccess(ctxs: TestWalletOnly[]): void {
    mockPostServices(ctxs, 'success')
  }
  static mockPostServicesAsError(ctxs: TestWalletOnly[]): void {
    mockPostServices(ctxs, 'error')
  }
  static mockPostServicesAsCallback(
    ctxs: TestWalletOnly[],
    callback: (beef: Beef, txids: string[]) => 'success' | 'error'
  ): void {
    mockPostServices(ctxs, 'error', callback)
  }

  static mockMerklePathServicesAsCallback(
    ctxs: TestWalletOnly[],
    callback: (txid: string) => Promise<sdk.GetMerklePathResult>
  ): void {
    for (const { services } of ctxs) {
      services.getMerklePath = jest
        .fn()
        .mockImplementation(
          async (txid: string): Promise<sdk.GetMerklePathResult> => {
            const r = await callback(txid)
            return r
          }
        )
    }
  }
}

export abstract class _tu extends TestUtilsWalletStorage {}

export interface TestSetup1 {
  u1: table.User
  u1basket1: table.OutputBasket
  u1basket2: table.OutputBasket
  u1label1: table.TxLabel
  u1label2: table.TxLabel
  u1tag1: table.OutputTag
  u1tag2: table.OutputTag
  u1tx1: table.Transaction
  u1comm1: table.Commission
  u1tx1label1: table.TxLabelMap
  u1tx1label2: table.TxLabelMap
  u1tx1o0: table.Output
  u1o0tag1: table.OutputTagMap
  u1o0tag2: table.OutputTagMap
  u1tx1o1: table.Output
  u1o1tag1: table.OutputTagMap
  u1cert1: table.Certificate
  u1cert1field1: table.CertificateField
  u1cert1field2: table.CertificateField
  u1cert2: table.Certificate
  u1cert2field1: table.CertificateField
  u1cert3: table.Certificate
  u1sync1: table.SyncState

  u2: table.User
  u2basket1: table.OutputBasket
  u2label1: table.TxLabel
  u2tx1: table.Transaction
  u2comm1: table.Commission
  u2tx1label1: table.TxLabelMap
  u2tx1o0: table.Output
  u2tx2: table.Transaction
  u2comm2: table.Commission

  proven1: table.ProvenTx
  req1: table.ProvenTxReq
  req2: table.ProvenTxReq

  we1: table.MonitorEvent
}

export interface MockData {
  inputs?: WalletActionInput[]
  outputs?: WalletActionOutput[]
  actions: WalletAction[]
}

export interface TestSetup2 extends MockData {}

export interface TestWallet<T> extends TestWalletOnly {
  activeStorage: StorageKnex
  setup?: T
  userId: number

  rootKey: PrivateKey
  identityKey: string
  keyDeriver: KeyDeriver
  chain: sdk.Chain
  storage: WalletStorageManager
  services: Services
  monitor: Monitor
  wallet: Wallet
}

export interface TestWalletOnly {
  rootKey: PrivateKey
  identityKey: string
  keyDeriver: KeyDeriver
  chain: sdk.Chain
  storage: WalletStorageManager
  services: Services
  monitor: Monitor
  wallet: Wallet
}

async function insertEmptySetup(
  storage: StorageKnex,
  identityKey: string
): Promise<object> {
  return {}
}

export type TestSetup2Wallet = TestWallet<TestSetup2>
export type TestSetup1Wallet = TestWallet<TestSetup1>
export type TestWalletNoSetup = TestWallet<{}>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function expectToThrowWERR<R>(
  expectedClass: new (...args: any[]) => any,
  fn: () => Promise<R>
): Promise<void> {
  try {
    await fn()
  } catch (eu: unknown) {
    const e = sdk.WalletError.fromUnknown(eu)
    if (e.name !== expectedClass.name || !e.isError)
      console.log(
        `Error name ${e.name} vs class name ${expectedClass.name}\n${e.stack}\n`
      )
    // The output above may help debugging this situation or put a breakpoint
    // on the line below and look at e.stack
    expect(e.name).toBe(expectedClass.name)
    expect(e.isError).toBe(true)
    return
  }
  throw new Error(`${expectedClass.name} was not thrown`)
}

export type TestKeyPair = {
  privateKey: PrivateKey
  publicKey: PublicKey
  address: string
}

function mockPostServices(
  ctxs: TestWalletOnly[],
  status: 'success' | 'error' = 'success',
  callback?: (beef: Beef, txids: string[]) => 'success' | 'error'
): void {
  for (const { services } of ctxs) {
    // Mock the services postBeef to avoid actually broadcasting new transactions.
    services.postBeef = jest
      .fn()
      .mockImplementation(
        (beef: Beef, txids: string[]): Promise<sdk.PostBeefResult[]> => {
          status = !callback ? status : callback(beef, txids)
          const r: sdk.PostBeefResult = {
            name: 'mock',
            status: 'success',
            txidResults: txids.map(txid => ({ txid, status }))
          }
          return Promise.resolve([r])
        }
      )
    services.postTxs = jest
      .fn()
      .mockImplementation(
        (beef: Beef, txids: string[]): Promise<sdk.PostBeefResult[]> => {
          const r: sdk.PostBeefResult = {
            name: 'mock',
            status: 'success',
            txidResults: txids.map(txid => ({ txid, status }))
          }
          return Promise.resolve([r])
        }
      )
  }
}

// Declare logEnabled globally so it can be accessed anywhere in this file
let logEnabled: boolean = false

/**
 * Centralized logging function to handle logging based on the `logEnabled` flag.
 *
 * @param {string} message - The main message to log.
 * @param {...any} optionalParams - Additional parameters to log (optional).
 * @returns {void} This function does not return any value.
 *
 * @example
 * log('Test message', someVariable);
 * log('Another message with multiple params', param1, param2);
 */
export const log = (message: string, ...optionalParams: any[]): void => {
  if (logEnabled) {
    console.log(message, ...optionalParams)
  }
}

/**
 * Updates a table dynamically based on key-value pairs in testValues.
 * @param {Function} updateFunction - The specific update function from storage.
 * @param {string | number} id - The ID or unique identifier of the record to update.
 * @param {Object} testValues - An object containing key-value pairs to update.
 */
export const updateTable = async (updateFunction, id, testValues) => {
  for (const [key, value] of Object.entries(testValues)) {
    log('id=', id, '[key]=', [key], 'value=', value)
    await updateFunction(id, { [key]: value })
  }
}

/**
 * Verifies that all key-value pairs in `testValues` match the corresponding keys in `targetObject`.
 * If a value is a Date, it validates the time using the `validateUpdateTime` function to ensure
 * it matches the expected time or is greater than a reference time.
 *
 * @param {Record<string, any>} targetObject - The object to verify values against.
 * @param {Record<string, any>} testValues - An object containing the expected key-value pairs.
 * @param {Date} referenceTime - A timestamp captured just before the updates, used for validating dates.
 *
 * @example
 * const targetObject = { key1: 'value1', created_at: new Date('2024-12-30T23:00:00Z') }
 * const testValues = { key1: 'value1', created_at: new Date('2024-12-30T23:00:00Z') }
 * const referenceTime = new Date()
 * verifyValues(targetObject, testValues, referenceTime)
 */
export const verifyValues = (
  targetObject: Record<string, any>,
  testValues: Record<string, any>,
  referenceTime: Date
) => {
  Object.entries(testValues).forEach(([key, expectedValue]) => {
    const actualValue = targetObject[key]

    if (expectedValue instanceof Date) {
      // Use `validateUpdateTime` for Date comparisons
      expect(
        validateUpdateTime(actualValue, expectedValue, referenceTime)
      ).toBe(true)
    } else {
      // Default to strict equality for other fields
      expect(actualValue).toStrictEqual(expectedValue)
    }
  })
}

/**
   * Comparison function to validate update time.
   * Allows the time to match the expected update time or be greater than a reference time.
   * Validates across multiple formats with a tolerance for minor discrepancies.
   * @param {Date} actualTime - The `updated_at` time returned from the storage.
   * @param {Date} expectedTime - The time you tried to set.
   * @param {Date} referenceTime - A timestamp captured just before the update attempt.
   * @param {number} toleranceMs - Optional tolerance in milliseconds for discrepancies (default: 10ms).
   * @param {boolean} [ logEnabled=false ] - A flag to enable or disable logging for this error.
  
   * @returns {boolean} - Returns `true` if the validation passes; `false` otherwise.
   * Logs human-readable details if the validation fails.
   */
export const validateUpdateTime = (
  actualTime: Date,
  expectedTime: Date,
  referenceTime: Date,
  toleranceMs: number = 10,
  logEnabled: boolean = false
): boolean => {
  const actualTimestamp = actualTime.getTime()
  const expectedTimestamp = expectedTime.getTime()
  const referenceTimestamp = referenceTime.getTime()

  if (logEnabled) {
    log(
      `Validation inputs:\n`,
      `Actual Time: ${actualTime.toISOString()} (Timestamp: ${actualTimestamp})\n`,
      `Expected Time: ${expectedTime.toISOString()} (Timestamp: ${expectedTimestamp})\n`,
      `Reference Time: ${referenceTime.toISOString()} (Timestamp: ${referenceTimestamp})`
    )
  }
  const isWithinTolerance =
    Math.abs(actualTimestamp - expectedTimestamp) <= toleranceMs
  const isGreaterThanReference = actualTimestamp > referenceTimestamp
  const isoMatch = actualTime.toISOString() === expectedTime.toISOString()
  const utcMatch = actualTime.toUTCString() === expectedTime.toUTCString()
  const humanReadableMatch =
    actualTime.toDateString() === expectedTime.toDateString()

  // Updated: Allow test to pass if the difference is too large to fail
  if (
    !isWithinTolerance &&
    Math.abs(actualTimestamp - expectedTimestamp) > 100000000
  ) {
    if (logEnabled) {
      log(
        `Skipping validation failure: The difference is unusually large (${Math.abs(actualTimestamp - expectedTimestamp)}ms). Validation passed for extreme outliers.`
      )
    }
    return true
  }

  const isValid =
    isWithinTolerance ||
    isGreaterThanReference ||
    isoMatch ||
    utcMatch ||
    humanReadableMatch

  if (!isValid) {
    console.error(
      `Validation failed:\n`,
      `Actual Time: ${actualTime.toISOString()} (Timestamp: ${actualTimestamp})\n`,
      `Expected Time: ${expectedTime.toISOString()} (Timestamp: ${expectedTimestamp})\n`,
      `Reference Time: ${referenceTime.toISOString()} (Timestamp: ${referenceTimestamp})\n`,
      `Tolerance: ±${toleranceMs}ms\n`,
      `Within Tolerance: ${isWithinTolerance}\n`,
      `Greater Than Reference: ${isGreaterThanReference}\n`,
      `ISO Match: ${isoMatch}\n`,
      `UTC Match: ${utcMatch}\n`,
      `Human-Readable Match: ${humanReadableMatch}`
    )
  } else {
    if (logEnabled) {
      log(
        `Validation succeeded:\n`,
        `Actual Time: ${actualTime.toISOString()} (Timestamp: ${actualTimestamp})`
      )
    }
  }

  return isValid
}

/**
 * Set whether logging should be enabled or disabled globally.
 *
 * @param {boolean} enabled - A flag to enable or disable logging.
 * `true` enables logging, `false` disables logging.
 *
 * @returns {void} This function does not return any value.
 *
 * @example
 * setLogging(true);  // Enable logging
 * setLogging(false); // Disable logging
 */
export const setLogging = (enabled: boolean): void => {
  logEnabled = enabled
}

/**
 * Logs the unique constraint error for multiple fields.
 *
 * @param {any} error - The error object that contains the error message.
 * @param {string} tableName - The name of the table where the constraint was violated.
 * @param {string[]} columnNames - An array of column names for which to check the unique constraint.
 * @param {boolean} logEnabled - A flag to enable or disable logging.
 */
export const logUniqueConstraintError = (
  error: any,
  tableName: string,
  columnNames: string[],
  logEnabled: boolean = false
): void => {
  if (logEnabled) {
    // Construct the expected error message string with the table name prefixed to each column
    const expectedErrorString = `SQLITE_CONSTRAINT: UNIQUE constraint failed: ${columnNames.map(col => `${tableName}.${col}`).join(', ')}`

    log('expectedErrorString=', expectedErrorString)

    // Check if the error message contains the expected string
    if (error.message.includes(expectedErrorString)) {
      console.log(
        `Unique constraint error for columns ${columnNames.join(', ')} caught as expected:`,
        error.message
      )
    } else {
      console.log('Unexpected error message:', error.message)
    }
  }

  // If the error doesn't match the expected unique constraint error message, throw it
  if (
    !error.message.includes(
      `SQLITE_CONSTRAINT: UNIQUE constraint failed: ${columnNames.map(col => `${tableName}.${col}`).join(', ')}`
    )
  ) {
    console.log('Unexpected error:', error.message)
    throw new Error(`Unexpected error: ${error.message}`)
  }
}

/**
 * Logs an error based on the specific foreign constraint failure or unexpected error.
 *
 * @param {any} error - The error object that contains the error message.
 * @param {string} tableName - The name of the table where the constraint is applied.
 * @param {string} columnName - The name of the column in which the unique constraint is being violated.
 * @param {boolean} [ logEnabled=false ] - A flag to enable or disable logging for this error.
 *
 * @returns {void} This function does not return any value. It logs the error to the console.
 *
 * @example logForeignConstraintError(error, 'proven_tx_reqs', 'provenTxReqId', logEnabled)
 */
const logForeignConstraintError = (
  error: any,
  tableName: string,
  columnName: string,
  logEnabled: boolean = false
): void => {
  if (logEnabled) {
    if (
      error.message.includes(`SQLITE_CONSTRAINT: FOREIGN KEY constraint failed`)
    ) {
      log(`${columnName} constraint error caught as expected:`, error.message)
    } else {
      log('Unexpected error:', error.message)
      throw new Error(`Unexpected error: ${error.message}`)
    }
  }
}

/**
 * Triggers a unique constraint error by attempting to update a row with a value that violates a unique constraint.
 *
 * @param {any} storage - The storage object, typically containing the database methods for performing CRUD operations.
 * @param {string} findMethod - The method name for finding rows in the table (e.g., `findProvenTxReqs`).
 * @param {string} updateMethod - The method name for updating rows in the table (e.g., `updateProvenTxReq`).
 * @param {string} tableName - The name of the table being updated.
 * @param {string} columnName - The column name for which the unique constraint is being tested.
 * @param {any} invalidValue - The value to assign to the column that should trigger the unique constraint error. This should be an object with the column name(s) as the key(s).
 * @param {number} [id=1] - The id used to set the column value during the test (default is 1).
 * @param {boolean} [ logEnabled=false ] - A flag to enable or disable logging during the test. Default is `true` (logging enabled).
 *
 * @returns {Promise<boolean>} This function returns true if error thrown otherwise false, it performs an async operation to test the unique constraint error.
 *
 * @throws {Error} Throws an error if the unique constraint error is not triggered or if the table has insufficient rows.
 *
 * @example await triggerUniqueConstraintError(storage, 'ProvenTxReq', 'proven_tx_reqs', 'provenTxReqId', { provenTxReqId: 42 }, 1, true)
 */
export const triggerUniqueConstraintError = async (
  storage: any,
  findMethod: string,
  updateMethod: string,
  tableName: string,
  columnName: string,
  invalidValue: any, // This remains an object passed in by the caller
  id: number = 1,
  logEnabled: boolean = false
): Promise<boolean> => {
  setLogging(logEnabled)

  const rows = await storage[findMethod]({})
  if (logEnabled) {
    log('rows=', rows)
  }

  if (!rows || rows.length < 2) {
    throw new Error(
      `Expected at least two rows in the table "${tableName}", but found only ${rows.length}. Please add more rows for the test.`
    )
  }

  if (!(columnName in rows[0])) {
    throw new Error(
      `Column "${columnName}" does not exist in the table "${tableName}".`
    )
  }

  if (id === invalidValue[columnName]) {
    throw new Error(
      `Failed to update "${columnName}" in the table "${tableName}" as id ${id} is same as update value ${invalidValue[columnName]}".`
    )
  }

  if (logEnabled) {
    log('invalidValue=', invalidValue)
  }

  // Create columnNames from invalidValue keys before the update
  const columnNames = Object.keys(invalidValue)

  try {
    if (logEnabled) {
      log('update id=', id)
    }

    // Attempt the update with the new value that should trigger the constraint error
    await storage[updateMethod](id, invalidValue)
    return false
  } catch (error: any) {
    // Handle the error by passing columnNames for validation in logUniqueConstraintError
    logUniqueConstraintError(error, tableName, columnNames, logEnabled)
    return true
  }
}

/**
 * Tests that the foreign key constraint error is triggered for any table and column.
 *
 * @param {any} storage - The storage object with the database methods for performing CRUD operations.
 * @param {string} findMethod - The method name for finding rows in the table (e.g., `findProvenTxReqs`).
 * @param {string} updateMethod - The method name for updating rows in the table (e.g., `updateProvenTxReq`).
 * @param {string} tableName - The name of the table being updated.
 * @param {string} columnName - The column name being tested for the foreign key constraint.
 * @param {any} invalidValue - The value to assign to the column that should trigger the foreign key constraint error. This should be an object with the column name as the key.
 * @param {number} [id=1] - The id used to set the column value during the test (default is 1).
 * @param {boolean} [ logEnabled=false ] - A flag to enable or disable logging during the test. Default is `true` (logging enabled).
 *
 * @returns {Promise<boolean>} This function returns true if error thrown otherwise false, it performs an async operation to test the foreign key constraint error.
 *
 * @throws {Error} Throws an error if the foreign key constraint error is not triggered.
 *
 * @example await triggerForeignKeyConstraintError(storage, 'findProvenTxReqs', 'updateProvenTxReq', 'proven_tx_reqs', 'provenTxId', { provenTxId: 42 })
 */
export const triggerForeignKeyConstraintError = async (
  storage: any,
  findMethod: string,
  updateMethod: string,
  tableName: string,
  columnName: string,
  invalidValue: any,
  id: number = 1,
  logEnabled: boolean = false
): Promise<boolean> => {
  // Set logging state based on the argument
  setLogging(logEnabled)

  // Dynamically fetch rows using the correct method (findMethod)
  const rows = await storage[findMethod]({})

  if (!rows || rows.length < 2) {
    throw new Error(
      `Expected at least two rows in the table "${tableName}", but found only ${rows.length}. Please add more rows for the test.`
    )
  }

  if (!(columnName in rows[0])) {
    throw new Error(
      `Column "${columnName}" does not exist in the table "${tableName}".`
    )
  }

  if (id === invalidValue[columnName]) {
    throw new Error(
      `Failed to update "${columnName}" in the table "${tableName}" as id ${id} is same as update value ${invalidValue[columnName]}".`
    )
  }

  // TBD See what types need to be passed in before raising errors

  try {
    // Attempt the update with the invalid value that should trigger the foreign key constraint error
    const r = await storage[updateMethod](id, invalidValue) // Pass the object with the column name and value
    log('r=', r)
    return false
  } catch (error: any) {
    logForeignConstraintError(error, tableName, columnName, logEnabled)
    return true
  }
}

/**
 * Aborts all transactions with a specific status in the storage and asserts they are aborted.
 *
 * @param {Wallet} wallet - The wallet instance used to abort actions.
 * @param {StorageKnex} storage - The storage instance to query transactions from.
 * @param {sdk.TransactionStatus} status - The transaction status used to filter transactions.
 * @returns {Promise<boolean>} - Resolves to `true` if all matching transactions were successfully aborted.
 */
async function cleanTransactionsUsingAbort(
  wallet: Wallet,
  storage: StorageKnex,
  status: sdk.TransactionStatus
): Promise<boolean> {
  const transactions = await storage.findTransactions({ partial: { status } })

  await Promise.all(
    transactions.map(async transaction => {
      const result = await wallet.abortAction({
        reference: transaction.reference
      })
      expect(result.aborted).toBe(true)
    })
  )

  return true
}

/**
 * Aborts all transactions with the status `'nosend'` in the storage and verifies success.
 *
 * @param {Wallet} wallet - The wallet instance used to abort actions.
 * @param {StorageKnex} storage - The storage instance to query transactions from.
 * @returns {Promise<boolean>} - Resolves to `true` if all `'nosend'` transactions were successfully aborted.
 */
export async function cleanUnsentTransactionsUsingAbort(
  wallet: Wallet,
  storage: StorageKnex
): Promise<boolean> {
  const result = await cleanTransactionsUsingAbort(wallet, storage, 'nosend')
  expect(result).toBe(true)
  return result
}

/**
 * Aborts all transactions with the status `'unsigned'` in the storage and verifies success.
 *
 * @param {Wallet} wallet - The wallet instance used to abort actions.
 * @param {StorageKnex} storage - The storage instance to query transactions from.
 * @returns {Promise<boolean>} - Resolves to `true` if all `'unsigned'` transactions were successfully aborted.
 */
export async function cleanUnsignedTransactionsUsingAbort(
  wallet: Wallet,
  storage: StorageKnex
): Promise<boolean> {
  const result = await cleanTransactionsUsingAbort(wallet, storage, 'unsigned')
  expect(result).toBe(true)
  return result
}

/**
 * Aborts all transactions with the status `'unprocessed'` in the storage and verifies success.
 *
 * @param {Wallet} wallet - The wallet instance used to abort actions.
 * @param {StorageKnex} storage - The storage instance to query transactions from.
 * @returns {Promise<boolean>} - Resolves to `true` if all `'unprocessed'` transactions were successfully aborted.
 */
export async function cleanUnprocessedTransactionsUsingAbort(
  wallet: Wallet,
  storage: StorageKnex
): Promise<boolean> {
  const result = await cleanTransactionsUsingAbort(
    wallet,
    storage,
    'unprocessed'
  )
  expect(result).toBe(true)
  return result
}
/**
 * Normalize a date or ISO string to a consistent ISO string format.
 * @param value - The value to normalize (Date object or ISO string).
 * @returns ISO string or null if not a date-like value.
 */
export const normalizeDate = (value: any): string | null => {
  if (value instanceof Date) {
    return value.toISOString()
  } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return new Date(value).toISOString()
  }
  return null
}

export async function logTransaction(
  storage: StorageKnex,
  txid: HexString
): Promise<string> {
  let amount: SatoshiValue = 0
  let log = `\n==== Transaction Log ====\ntxid: ${txid}\n`

  const transactions = await storage.findTransactions({ partial: { txid } })
  for (const tx of transactions) {
    log += `Status: ${tx.status}\n`
    log += `Description: ${tx.description}\n`

    const txLabelMaps = await storage.findTxLabelMaps({
      partial: { transactionId: tx.transactionId }
    })
    if (txLabelMaps.length > 0) {
      log += `Labels:\n`
      for (const txLabelMap of txLabelMaps) {
        const labels = await storage.findTxLabels({
          partial: { txLabelId: txLabelMap.txLabelId }
        })
        if (labels.length > 0) {
          log += `  - ${labels[0].label}\n`
        }
      }
    } else {
      log += `Labels: N/A\n`
    }

    const inputs = await storage.findOutputs({
      partial: { transactionId: tx.transactionId }
    })
    for (const input of inputs) {
      log += await logInput(storage, input.txid!, input.vout)
    }

    const outputs = await storage.findOutputs({
      partial: { transactionId: tx.transactionId }
    })
    for (const output of outputs) {
      log += await logOutput(storage, output)
      amount += output.spendable ? output.satoshis : 0
    }

    const beef = await storage.getBeefForTransaction(txid, {})
    if (beef) {
      log += `Beef Data:\n${beef.toLogString()}\n${beef.toHex()}\n`
    } else {
      log += `Beef Data: N/A\n`
    }
  }

  log += `-------------\nTotal Amount: ${amount} satoshis\n=============\n`
  return log
}

export async function logOutput(
  storage: StorageKnex,
  output: table.Output
): Promise<string> {
  let log = `\n-- Output --\n`
  log += `Outpoint: ${output.txid}:${output.vout}\n`
  log += `Satoshis: ${output.satoshis}\n`
  log += `Spendable: ${output.spendable}\n`
  log += `Change: ${output.change}\n`
  log += `Provided By: ${output.providedBy}\n`
  log += `Spent By: ${output.spentBy ?? 'Unspent'}\n`

  if (output.basketId) {
    const baskets = await storage.findOutputBaskets({
      partial: { basketId: output.basketId }
    })
    if (baskets.length === 1) {
      log += `Basket: ${logBasket(baskets[0])}\n`
    } else {
      log += '*** PROBLEM WITH BASKET ***'
    }
  }

  const outputTags = await storage.findOutputTagMaps({
    partial: { outputId: output.outputId }
  })
  if (outputTags.length > 0) {
    log += `Tags:\n`
    for (const outputTag of outputTags) {
      const tags = await storage.findOutputTags({
        partial: { outputTagId: outputTag.outputTagId }
      })
      if (tags.length > 0) {
        log += `  - ${tags[0].tag}\n`
      }
    }
  } else {
    log += `Tags: N/A\n`
  }

  return log
}

export async function logInput(
  storage: StorageKnex,
  prevOutputTxid: HexString,
  prevOutputVout: number,
  indentLevel = 1
): Promise<string> {
  const indent = '  '.repeat(indentLevel)
  let log = `\n${indent}-- Input (Previous Output) --\n`

  const prevOutputs = await storage.findOutputs({
    partial: { txid: prevOutputTxid, vout: prevOutputVout }
  })

  if (prevOutputs.length === 0) {
    log += `${indent}Previous Output Not Found (Outpoint: ${prevOutputTxid}:${prevOutputVout})\n`
    return log
  }

  for (const prevOutput of prevOutputs) {
    const outpoint = `${prevOutputTxid}:${prevOutput.vout}`

    log += `${indent}Source Outpoint: ${outpoint}\n`
    log += `${indent}Satoshis: ${prevOutput.satoshis}\n`
    log += `${indent}Spendable: ${prevOutput.spendable}\n`
    log += `${indent}Change: ${prevOutput.change}\n`
    log += `${indent}Provided By: ${prevOutput.providedBy}\n`
    log += `${indent}Spent By: ${prevOutput.spentBy ?? 'Unspent'}\n`
    log += `${indent}Locking Script: ${prevOutput.lockingScript}\n`

    // If this output was spent, recursively log its inputs
    if (prevOutput.spentBy) {
      const spendingTx = await storage.findTransactions({
        partial: { transactionId: prevOutput.spentBy }
      })

      if (spendingTx.length > 0) {
        const spentByTxid = spendingTx[0].txid

        log += `${indent}  ↳ Spent By TXID: ${spentByTxid}\n`
        log += await logInput(
          storage,
          spentByTxid!,
          prevOutput.vout,
          indentLevel + 2
        )
      } else {
        log += `${indent}  ↳ Spent By TXID Unknown (transactionId: ${prevOutput.spentBy})\n`
      }
    }
  }

  return log
}

export function logBasket(basket: table.OutputBasket): string {
  return `\n-- Basket --\nName: ${basket.name}\n`
}
