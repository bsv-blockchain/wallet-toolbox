import * as bsv from '@bsv/sdk'
import path from 'path'
import { promises as fsp } from 'fs'
import { asArray, randomBytesBase64, randomBytesHex, sdk, StorageProvider, StorageKnex, StorageSyncReader, table, verifyTruthy, Wallet, Monitor, MonitorOptions, Services, WalletSigner, WalletStorageManager, verifyOne, StorageClient } from '../../src/index.all'

import { Knex, knex as makeKnex } from 'knex'
import { Beef } from '@bsv/sdk'

import * as dotenv from 'dotenv'
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
    const identityKey = chain === 'main' ? process.env.MY_MAIN_IDENTITY : process.env.MY_TEST_IDENTITY
    if (!identityKey) throw new sdk.WERR_INTERNAL('.env file configuration is missing or incomplete.')
    const userId = Number(chain === 'main' ? process.env.MY_MAIN_USERID : process.env.MY_TEST_USERID)
    const DEV_KEYS = process.env.DEV_KEYS || '{}'
    const logTests = !!process.env.LOGTESTS
    const noMySQL = !!process.env.NOMYSQL
    const runSlowTests = !!process.env.RUNSLOWTESTS
    return {
      chain,
      userId,
      identityKey,
      mainTaalApiKey: verifyTruthy(process.env.MAIN_TAAL_API_KEY || '', `.env value for 'mainTaalApiKey' is required.`),
      testTaalApiKey: verifyTruthy(process.env.TEST_TAAL_API_KEY || '', `.env value for 'testTaalApiKey' is required.`),
      devKeys: JSON.parse(DEV_KEYS) as Record<string, string>,
      noMySQL,
      runSlowTests,
      logTests
    }
  }

  static async createNoSendP2PKHTestOutpoint(
    address: string,
    satoshis: number,
    noSendChange: string[] | undefined,
    wallet: bsv.Wallet
  ): Promise<{
    noSendChange: string[]
    txid: string
    cr: bsv.CreateActionResult
    sr: bsv.SignActionResult
  }> {
    return await _tu.createNoSendP2PKHTestOutpoints(1, address, satoshis, noSendChange, wallet)
  }

  static async createNoSendP2PKHTestOutpoints(
    count: number,
    address: string,
    satoshis: number,
    noSendChange: string[] | undefined,
    wallet: bsv.Wallet
  ): Promise<{
    noSendChange: string[]
    txid: string
    cr: bsv.CreateActionResult
    sr: bsv.SignActionResult
  }> {
    const outputs: bsv.CreateActionOutput[] = []
    for (let i = 0; i < count; i++) {
      outputs.push({
        basket: `test-p2pkh-output-${i}`,
        satoshis,
        lockingScript: _tu.getLockP2PKH(address).toHex(),
        outputDescription: `p2pkh ${i}`
      })
    }

    const createArgs: bsv.CreateActionArgs = {
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
    const signArgs: bsv.SignActionArgs = {
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

  static getKeyPair(priv?: string | bsv.PrivateKey): TestKeyPair {
    if (priv === undefined) priv = bsv.PrivateKey.fromRandom()
    else if (typeof priv === 'string') priv = new bsv.PrivateKey(priv, 'hex')

    const pub = bsv.PublicKey.fromPrivateKey(priv)
    const address = pub.toAddress()
    return { privateKey: priv, publicKey: pub, address }
  }

  static getLockP2PKH(address: string) {
    const p2pkh = new bsv.P2PKH()
    const lock = p2pkh.lock(address)
    return lock
  }

  static getUnlockP2PKH(priv: bsv.PrivateKey, satoshis: number) {
    const p2pkh = new bsv.P2PKH()
    const lock = _tu.getLockP2PKH(_tu.getKeyPair(priv).address)
    // Prepare to pay with SIGHASH_ALL and without ANYONE_CAN_PAY.
    // In otherwords:
    // - all outputs must remain in the current order, amount and locking scripts.
    // - all inputs must remain from the current outpoints and sequence numbers.
    // (unlock scripts are never signed)
    const unlock = p2pkh.unlock(priv, 'all', false, satoshis, lock)
    return unlock
  }

  static async createWalletOnly(args: { chain?: sdk.Chain; rootKeyHex?: string; active?: sdk.WalletStorageProvider; backups?: sdk.WalletStorageProvider[] }): Promise<TestWalletOnly> {
    args.chain ||= 'test'
    args.rootKeyHex ||= '1'.repeat(64)
    const rootKey = bsv.PrivateKey.fromHex(args.rootKeyHex)
    const identityKey = rootKey.toPublicKey().toString()
    const keyDeriver = new bsv.KeyDeriver(rootKey)
    const chain = args.chain
    const storage = new WalletStorageManager(identityKey, args.active, args.backups)
    if (storage.stores.length > 0) await storage.makeAvailable()
    const signer = new WalletSigner(chain, keyDeriver, storage)
    const services = new Services(args.chain)
    const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services)
    const monitor = new Monitor(monopts)
    monitor.addDefaultTasks()
    const wallet = new Wallet(signer, keyDeriver, services, monitor)
    const r: TestWalletOnly = {
      rootKey,
      identityKey,
      keyDeriver,
      chain,
      storage,
      signer,
      services,
      monitor,
      wallet
    }
    return r
  }

  static async createTestWalletWithStorageClient(args: {
    rootKeyHex?: string,
    endpointUrl?: string,
    chain?: sdk.Chain
  }): Promise<TestWalletOnly> {
    if (args.chain === 'main')
      throw new sdk.WERR_INVALID_PARAMETER('chain', `'test' for now, 'main' is not yet supported.`)

    const wo = await _tu.createWalletOnly({ chain: 'test', rootKeyHex: args.rootKeyHex })
    args.endpointUrl ||= 'https://staging-dojo.babbage.systems'
    const client = new StorageClient(wo.wallet, args.endpointUrl)
    await wo.storage.addWalletStorageProvider(client)
    return wo
  }

  static async createKnexTestWalletWithSetup<T>(args: {
    knex: Knex<any, any[]>
    databaseName: string
    chain?: sdk.Chain
    rootKeyHex?: string
    dropAll?: boolean
    insertSetup: (storage: StorageKnex, identityKey: string) => Promise<T>
  }): Promise<TestWallet<T>> {
    const wo = await _tu.createWalletOnly({ chain: args.chain, rootKeyHex: args.rootKeyHex })
    const activeStorage = new StorageKnex({ chain: wo.chain, knex: args.knex, commissionSatoshis: 0, commissionPubKeyHex: undefined, feeModel: { model: 'sat/kb', value: 1 } })
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
  static async newTmpFile(filename = '', tryToDelete = false, copyToTmp = false, reuseExisting = false): Promise<string> {
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
      const srcPath = p.dir ? path.resolve(filename) : path.resolve(`./test/data/${filename}`)
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

  static async createMySQLTestWallet(args: { databaseName: string; chain?: sdk.Chain; rootKeyHex?: string; dropAll?: boolean }): Promise<TestWallet<{}>> {
    return await this.createKnexTestWallet({
      ...args,
      knex: _tu.createLocalMySQL(args.databaseName)
    })
  }

  static async createMySQLTestSetup1Wallet(args: { databaseName: string; chain?: sdk.Chain; rootKeyHex?: string }): Promise<TestWallet<TestSetup1>> {
    return await this.createKnexTestSetup1Wallet({
      ...args,
      dropAll: true,
      knex: _tu.createLocalMySQL(args.databaseName)
    })
  }

  static async createSQLiteTestWallet(args: { filePath?: string; databaseName: string; chain?: sdk.Chain; rootKeyHex?: string; dropAll?: boolean }): Promise<TestWalletNoSetup> {
    const localSQLiteFile = args.filePath || (await _tu.newTmpFile(`${args.databaseName}.sqlite`, false, false, true))
    return await this.createKnexTestWallet({
      ...args,
      knex: _tu.createLocalSQLite(localSQLiteFile)
    })
  }

  static async createSQLiteTestSetup1Wallet(args: { databaseName: string; chain?: sdk.Chain; rootKeyHex?: string }): Promise<TestWallet<TestSetup1>> {
    const localSQLiteFile = await _tu.newTmpFile(`${args.databaseName}.sqlite`, false, false, true)
    return await this.createKnexTestSetup1Wallet({
      ...args,
      dropAll: true,
      knex: _tu.createLocalSQLite(localSQLiteFile)
    })
  }

  static async createKnexTestWallet(args: { knex: Knex<any, any[]>; databaseName: string; chain?: sdk.Chain; rootKeyHex?: string; dropAll?: boolean }): Promise<TestWalletNoSetup> {
    return await _tu.createKnexTestWalletWithSetup({
      ...args,
      insertSetup: insertEmptySetup
    })
  }

  static async createKnexTestSetup1Wallet(args: { knex: Knex<any, any[]>; databaseName: string; chain?: sdk.Chain; rootKeyHex?: string; dropAll?: boolean }): Promise<TestWallet<TestSetup1>> {
    return await _tu.createKnexTestWalletWithSetup({
      ...args,
      insertSetup: _tu.createTestSetup1
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
  static async createLegacyWalletSQLiteCopy(databaseName: string): Promise<TestWalletNoSetup> {
    const walletFile = await _tu.newTmpFile(`${databaseName}.sqlite`, false, false, true)
    const walletKnex = _tu.createLocalSQLite(walletFile)
    return await _tu.createLegacyWalletCopy(databaseName, walletKnex, walletFile)
  }

  static async createLegacyWalletMySQLCopy(databaseName: string): Promise<TestWalletNoSetup> {
    const walletKnex = _tu.createLocalMySQL(databaseName)
    return await _tu.createLegacyWalletCopy(databaseName, walletKnex)
  }

  static async createLiveWalletSQLiteWARNING(databaseFullPath: string = './test/data/walletLiveTestData.sqlite'): Promise<TestWalletNoSetup> {
    return await this.createKnexTestWallet({
      chain: 'test',
      rootKeyHex: _tu.legacyRootKeyHex,
      databaseName: 'walletLiveTestData',
      knex: _tu.createLocalSQLite(databaseFullPath)
    })
  }

  static async createWalletSQLite(databaseFullPath: string = './test/data/tmp/walletNewTestData.sqlite', databaseName: string = 'walletNewTestData'): Promise<TestWalletNoSetup> {
    return await this.createSQLiteTestWallet({
      filePath: databaseFullPath,
      databaseName,
      chain: 'test',
      rootKeyHex: '1'.repeat(64),
      dropAll: true
    })
  }

  static legacyRootKeyHex = '153a3df216' + '686f55b253991c' + '7039da1f648' + 'ffc5bfe93d6ac2c25ac' + '2d4070918d'

  static async createLegacyWalletCopy(databaseName: string, walletKnex: Knex<any, any[]>, tryCopyToPath?: string): Promise<TestWalletNoSetup> {
    const readerFile = await _tu.existingDataFile(`walletLegacyTestData.sqlite`)
    let useReader = true
    if (tryCopyToPath) {
      await _tu.copyFile(readerFile, tryCopyToPath)
      //console.log('USING FILE COPY INSTEAD OF SOURCE DB SYNC')
      useReader = false
    }
    const chain: sdk.Chain = 'test'
    const rootKeyHex = _tu.legacyRootKeyHex
    const identityKey = '03ac2d10bdb0023f4145cc2eba2fcd2ad3070cb2107b0b48170c46a9440e4cc3fe'
    const rootKey = bsv.PrivateKey.fromHex(rootKeyHex)
    const keyDeriver = new bsv.KeyDeriver(rootKey)
    const activeStorage = new StorageKnex({ chain, knex: walletKnex, commissionSatoshis: 0, commissionPubKeyHex: undefined, feeModel: { model: 'sat/kb', value: 1 } })
    if (useReader) await activeStorage.dropAllData()
    await activeStorage.migrate(databaseName, identityKey)
    await activeStorage.makeAvailable()
    const storage = new WalletStorageManager(identityKey, activeStorage)
    await storage.makeAvailable()
    if (useReader) {
      const readerKnex = _tu.createLocalSQLite(readerFile)
      const reader = new StorageKnex({ chain, knex: readerKnex, commissionSatoshis: 0, commissionPubKeyHex: undefined, feeModel: { model: 'sat/kb', value: 1 } })
      await reader.makeAvailable()
      await storage.syncFromReader(identityKey, new StorageSyncReader({ identityKey }, reader))
      await reader.destroy()
    }
    const signer = new WalletSigner(chain, keyDeriver, storage)
    const services = new Services(chain)
    const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services)
    const monitor = new Monitor(monopts)
    const wallet = new Wallet(signer, keyDeriver, services, monitor)
    const userId = verifyTruthy(await activeStorage.findUserByIdentityKey(identityKey)).userId
    const r: TestWallet<{}> = {
      rootKey,
      identityKey,
      keyDeriver,
      chain,
      activeStorage,
      storage,
      setup: {},
      signer,
      services,
      monitor,
      wallet,
      userId
    }
    return r
  }

  static makeSampleCert(subject?: string): { cert: bsv.WalletCertificate, subject: string, certifier: bsv.PrivateKey } {
    subject ||= bsv.PrivateKey.fromRandom().toPublicKey().toString()
    const certifier = bsv.PrivateKey.fromRandom()
    const verifier = bsv.PrivateKey.fromRandom()
    const cert: bsv.WalletCertificate = {
      type: bsv.Utils.toBase64(new Array(32).fill(1)),
      serialNumber: bsv.Utils.toBase64(new Array(32).fill(2)),
      revocationOutpoint: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef.1',
      subject,
      certifier: certifier.toPublicKey().toString(),
      fields: {
        name: 'Alice',
        email: 'alice@example.com',
        organization: 'Example Corp'
      },
      signature: "",
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

  static async insertTestProvenTxReq(storage: StorageProvider, txid?: string, provenTxId?: number, onlyRequired?: boolean) {
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

  static async insertTestCertificateField(storage: StorageProvider, c: table.Certificate, name: string, value: string) {
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

  static async insertTestOutputBasket(storage: StorageProvider, u?: table.User | number) {
    const now = new Date()
    if (typeof u === 'number') u = verifyOne(await storage.findUsers({ partial: { userId: u } }))
    u ||= await _tu.insertTestUser(storage)
    const e: table.OutputBasket = {
      created_at: now,
      updated_at: now,
      basketId: 0,
      userId: u.userId,
      name: randomBytesHex(6),
      numberOfDesiredUTXOs: 42,
      minimumDesiredUTXOValue: 1642,
      isDeleted: false
    }
    await storage.insertOutputBasket(e)
    return e
  }

  static async insertTestTransaction(storage: StorageProvider, u?: table.User, onlyRequired?: boolean) {
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
      rawTx: onlyRequired ? undefined : [1, 2, 3]
    }
    await storage.insertTransaction(e)
    return { tx: e, user: u }
  }

  static async insertTestOutput(storage: StorageProvider, t: table.Transaction, vout: number, satoshis: number, basket?: table.OutputBasket, requiredOnly?: boolean) {
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
      lockingScript: requiredOnly ? undefined : asArray(randomBytesHex(36))
    }
    await storage.insertOutput(e)
    return e
  }

  static async insertTestOutputTag(storage: StorageProvider, u: table.User) {
    const now = new Date()
    const e: table.OutputTag = {
      created_at: now,
      updated_at: now,
      outputTagId: 0,
      userId: u.userId,
      tag: randomBytesHex(6),
      isDeleted: false
    }
    await storage.insertOutputTag(e)
    return e
  }

  static async insertTestOutputTagMap(storage: StorageProvider, o: table.Output, tag: table.OutputTag) {
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

  static async insertTestTxLabel(storage: StorageProvider, u: table.User) {
    const now = new Date()
    const e: table.TxLabel = {
      created_at: now,
      updated_at: now,
      txLabelId: 0,
      userId: u.userId,
      label: randomBytesHex(6),
      isDeleted: false
    }
    await storage.insertTxLabel(e)
    return e
  }

  static async insertTestTxLabelMap(storage: StorageProvider, tx: table.Transaction, label: table.TxLabel) {
    const now = new Date()
    const e: table.TxLabelMap = {
      created_at: now,
      updated_at: now,
      txLabelId: label.txLabelId,
      transactionId: tx.transactionId,
      isDeleted: false
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

  static async insertTestCommission(storage: StorageProvider, t: table.Transaction) {
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

  static async createTestSetup1(storage: StorageProvider, u1IdentityKey?: string): Promise<TestSetup1> {
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
    const u1tx1o0 = await _tu.insertTestOutput(storage, u1tx1, 0, 101, u1basket1)
    const u1o0tag1 = await _tu.insertTestOutputTagMap(storage, u1tx1o0, u1tag1)
    const u1o0tag2 = await _tu.insertTestOutputTagMap(storage, u1tx1o0, u1tag2)
    const u1tx1o1 = await _tu.insertTestOutput(storage, u1tx1, 1, 111, u1basket2)
    const u1o1tag1 = await _tu.insertTestOutputTagMap(storage, u1tx1o1, u1tag1)
    const u1cert1 = await _tu.insertTestCertificate(storage, u1)
    const u1cert1field1 = await _tu.insertTestCertificateField(storage, u1cert1, 'bob', 'your uncle')
    const u1cert1field2 = await _tu.insertTestCertificateField(storage, u1cert1, 'name', 'alice')
    const u1cert2 = await _tu.insertTestCertificate(storage, u1)
    const u1cert2field1 = await _tu.insertTestCertificateField(storage, u1cert2, 'name', 'alice')
    const u1cert3 = await _tu.insertTestCertificate(storage, u1)
    const u1sync1 = await _tu.insertTestSyncState(storage, u1)

    const u2 = await _tu.insertTestUser(storage)
    const u2basket1 = await _tu.insertTestOutputBasket(storage, u2)
    const u2label1 = await _tu.insertTestTxLabel(storage, u2)
    const { tx: u2tx1 } = await _tu.insertTestTransaction(storage, u2, true)
    const u2comm1 = await _tu.insertTestCommission(storage, u2tx1)
    const u2tx1label1 = await _tu.insertTestTxLabelMap(storage, u2tx1, u2label1)
    const u2tx1o0 = await _tu.insertTestOutput(storage, u2tx1, 0, 101, u2basket1)
    const { tx: u2tx2 } = await _tu.insertTestTransaction(storage, u2, true)
    const u2comm2 = await _tu.insertTestCommission(storage, u2tx2)

    const proven1 = await _tu.insertTestProvenTx(storage)
    const req1 = await _tu.insertTestProvenTxReq(storage, undefined, undefined, true)
    const req2 = await _tu.insertTestProvenTxReq(storage, proven1.txid, proven1.provenTxId)

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

  static mockPostServicesAsSuccess(ctxs: TestWalletOnly[]): void {
    mockPostServices(ctxs, 'success')
  }
  static mockPostServicesAsError(ctxs: TestWalletOnly[]): void {
    mockPostServices(ctxs, 'error')
  }
  static mockPostServicesAsCallback(ctxs: TestWalletOnly[], callback: (beef: bsv.Beef, txids: string[]) => 'success' | 'error'): void {
    mockPostServices(ctxs, 'error', callback)
  }

  static mockMerklePathServicesAsCallback(ctxs: TestWalletOnly[], callback: (txid: string) => Promise<sdk.GetMerklePathResult>): void {
    for (const { services } of ctxs) {
      services.getMerklePath = jest.fn().mockImplementation(async (txid: string): Promise<sdk.GetMerklePathResult> => {
        const r = await callback(txid)
        return r
      })
    }
  }
}

export abstract class _tu extends TestUtilsWalletStorage { }

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

export interface TestWallet<T> extends TestWalletOnly {
  activeStorage: StorageKnex
  setup?: T
  userId: number

  rootKey: bsv.PrivateKey
  identityKey: string
  keyDeriver: bsv.KeyDeriver
  chain: sdk.Chain
  storage: WalletStorageManager
  signer: WalletSigner
  services: Services
  monitor: Monitor
  wallet: Wallet
}

export interface TestWalletOnly {
  rootKey: bsv.PrivateKey
  identityKey: string
  keyDeriver: bsv.KeyDeriver
  chain: sdk.Chain
  storage: WalletStorageManager
  signer: WalletSigner
  services: Services
  monitor: Monitor
  wallet: Wallet
}

async function insertEmptySetup(storage: StorageKnex, identityKey: string): Promise<object> {
  return {}
}

export type TestSetup1Wallet = TestWallet<TestSetup1>
export type TestWalletNoSetup = TestWallet<{}>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function expectToThrowWERR<R>(expectedClass: new (...args: any[]) => any, fn: () => Promise<R>): Promise<void> {
  try {
    await fn()
  } catch (eu: unknown) {
    const e = sdk.WalletError.fromUnknown(eu)
    if (e.name !== expectedClass.name || !e.isError) console.log(`Error name ${e.name} vs class name ${expectedClass.name}\n${e.stack}\n`)
    // The output above may help debugging this situation or put a breakpoint
    // on the line below and look at e.stack
    expect(e.name).toBe(expectedClass.name)
    expect(e.isError).toBe(true)
    return
  }
  throw new Error(`${expectedClass.name} was not thrown`)
}

export type TestKeyPair = {
  privateKey: bsv.PrivateKey
  publicKey: bsv.PublicKey
  address: string
}

function mockPostServices(ctxs: TestWalletOnly[], status: 'success' | 'error' = 'success', callback?: (beef: bsv.Beef, txids: string[]) => 'success' | 'error'): void {
  for (const { services } of ctxs) {
    // Mock the services postBeef to avoid actually broadcasting new transactions.
    services.postBeef = jest.fn().mockImplementation((beef: bsv.Beef, txids: string[]): Promise<sdk.PostBeefResult[]> => {
      status = !callback ? status : callback(beef, txids)
      const r: sdk.PostBeefResult = {
        name: 'mock',
        status: 'success',
        txidResults: txids.map(txid => ({ txid, status }))
      }
      return Promise.resolve([r])
    })
    services.postTxs = jest.fn().mockImplementation((beef: bsv.Beef, txids: string[]): Promise<sdk.PostBeefResult[]> => {
      const r: sdk.PostBeefResult = {
        name: 'mock',
        status: 'success',
        txidResults: txids.map(txid => ({ txid, status }))
      }
      return Promise.resolve([r])
    })
  }
}
