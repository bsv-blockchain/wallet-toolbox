import { _tu } from '../utils/TestUtilsWalletStorage'
import { randomBytesBase64, randomBytesHex, sdk, StorageProvider, TableCommission } from '../../src/index.client'
import { StorageKnex } from '../../src/storage/StorageKnex'

/**
 * Helper to verify that an async operation throws an error.
 * This is more reliable than `expect(fn()).rejects.toThrow()` when using
 * better-sqlite3 with Jest workers, due to V8 context isolation issues.
 * See: https://github.com/JoshuaWise/better-sqlite3/issues/162
 */
async function expectToThrow(fn: () => Promise<any>): Promise<void> {
  let didThrow = false
  try {
    await fn()
  } catch (e) {
    didThrow = true
  }
  if (!didThrow) {
    throw new Error('Expected function to throw but it did not')
  }
}

describe('insert tests', () => {
  jest.setTimeout(99999999)

  const storages: StorageProvider[] = []
  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)

  beforeAll(async () => {
    // Use a unique filename with random suffix to avoid race conditions in parallel tests.
    // Setting reuseExisting=false (4th param) ensures each test run gets a fresh database.
    const localSQLiteFile = await _tu.newTmpFile('inserttest.sqlite', false, false, false)
    const knexSQLite = _tu.createLocalSQLite(localSQLiteFile)

    storages.push(
      new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain,
        knex: knexSQLite
      })
    )

    if (env.runMySQL) {
      const knexMySQL = _tu.createLocalMySQL('inserttest')
      storages.push(
        new StorageKnex({
          ...StorageKnex.defaultOptions(),
          chain,
          knex: knexMySQL
        })
      )
    }

    for (const storage of storages) {
      await storage.dropAllData()
      await storage.migrate('insert tests', '1'.repeat(64))
    }

    // Explicitly enable foreign keys AFTER all setup operations, since dropAllData/migrate
    // might reset the connection state. This is a belt and suspenders approach.
    await knexSQLite.raw('PRAGMA foreign_keys = ON')
  })

  // Re-enable foreign keys before each test to ensure constraint checking works
  // This is needed because the connection pool might reset the pragma
  beforeEach(async () => {
    for (const storage of storages) {
      // Cast to StorageKnex to access knex property
      const sk = storage as StorageKnex
      if (sk.knex) {
        try {
          await sk.knex.raw('PRAGMA foreign_keys = ON')
          const fkStatus = await sk.knex.raw('PRAGMA foreign_keys')
          if (fkStatus[0]?.foreign_keys !== 1) {
            console.error('WARNING: Foreign keys not enabled after PRAGMA:', fkStatus)
          }
        } catch (e) {
          // Ignore errors for non-SQLite databases
        }
      }
    }
  })

  afterAll(async () => {
    for (const storage of storages) {
      await storage.destroy()
    }
  })

  test('0 insert ProvenTx', async () => {
    for (const storage of storages) {
      const ptx = await _tu.insertTestProvenTx(storage)
      expect(ptx.provenTxId).toBe(1)
      ptx.provenTxId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertProvenTx(ptx))
      ptx.provenTxId = 0
      ptx.txid = '4'.repeat(64)
      ptx.provenTxId = await storage.insertProvenTx(ptx)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(ptx.provenTxId).toBeGreaterThan(1)
    }
  })

  test('1 insert ProvenTxReq', async () => {
    for (const storage of storages) {
      const ptxreq = await _tu.insertTestProvenTxReq(storage)
      expect(ptxreq.provenTxReqId).toBe(1)
      ptxreq.provenTxReqId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertProvenTxReq(ptxreq))
      ptxreq.provenTxReqId = 0
      ptxreq.txid = '4'.repeat(64)
      await storage.insertProvenTxReq(ptxreq)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(ptxreq.provenTxReqId).toBeGreaterThan(1)
      ptxreq.provenTxId = 9999 // non-existent
      await expectToThrow(() => storage.insertProvenTxReq(ptxreq))
    }
  })

  test('2 insert User', async () => {
    for (const storage of storages) {
      const e = await _tu.insertTestUser(storage)
      const id = e.userId
      expect(id).toBeGreaterThan(0)
      e.userId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertUser(e))
      e.userId = 0
      e.identityKey = randomBytesHex(33)
      await storage.insertUser(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.userId).toBeGreaterThan(id)
    }
  })

  test('3 insert Certificate', async () => {
    for (const storage of storages) {
      const e = await _tu.insertTestCertificate(storage)
      const id = e.certificateId
      expect(id).toBeGreaterThan(0)
      e.certificateId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertCertificate(e))
      e.certificateId = 0
      e.serialNumber = randomBytesBase64(33)
      await storage.insertCertificate(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.certificateId).toBeGreaterThan(id)
    }
  })

  test('4 insert CertificateField', async () => {
    for (const storage of storages) {
      const c = await _tu.insertTestCertificate(storage)
      const e = await _tu.insertTestCertificateField(storage, c, 'prize', 'starship')
      expect(e.certificateId).toBe(c.certificateId)
      expect(e.userId).toBe(c.userId)
      expect(e.fieldName).toBe('prize')
      // duplicate must throw
      await expectToThrow(() => storage.insertCertificateField(e))
      e.fieldName = 'address'
      await storage.insertCertificateField(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.fieldName).toBe('address')
    }
  })

  test('5 insert OutputBasket', async () => {
    for (const storage of storages) {
      const e = await _tu.insertTestOutputBasket(storage)
      const id = e.basketId
      expect(id).toBeGreaterThan(0)
      e.basketId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertOutputBasket(e))
      e.basketId = 0
      e.name = randomBytesHex(10)
      await storage.insertOutputBasket(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.basketId).toBeGreaterThan(id)
    }
  })

  test('6 insert Transaction', async () => {
    for (const storage of storages) {
      const { tx: e, user } = await _tu.insertTestTransaction(storage)
      const id = e.transactionId
      expect(id).toBeGreaterThan(0)
      e.transactionId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertTransaction(e))
      e.transactionId = 0
      e.reference = randomBytesBase64(10)
      await storage.insertTransaction(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.transactionId).toBeGreaterThan(id)
    }
  })

  test('7 insert Commission', async () => {
    for (const storage of storages) {
      const { tx: t, user } = await _tu.insertTestTransaction(storage)
      const e: TableCommission = await _tu.insertTestCommission(storage, t)
      const id = e.commissionId
      expect(id).toBeGreaterThan(0)
      e.commissionId = 0
      // duplicate must throw
      await expectToThrow(() => storage.insertCommission(e))
      e.commissionId = 0
      const { tx: t2 } = await _tu.insertTestTransaction(storage)
      e.transactionId = t2.transactionId
      e.userId = t2.userId
      await storage.insertCommission(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.commissionId).toBeGreaterThan(id)
    }
  })

  test('8 insert Output', async () => {
    for (const storage of storages) {
      const { tx: t, user } = await _tu.insertTestTransaction(storage)
      const e = await _tu.insertTestOutput(storage, t, 0, 101)
      const id = e.outputId
      expect(id).toBeGreaterThan(0)
      expect(e.userId).toBe(t.userId)
      expect(e.transactionId).toBe(t.transactionId)
      expect(e.vout).toBe(0)
      expect(e.satoshis).toBe(101)
      // duplicate must throw
      e.outputId = 0
      await expectToThrow(() => storage.insertOutput(e))
      e.vout = 1
      await storage.insertOutput(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.outputId).toBeGreaterThan(id)
    }
  })

  test('9 insert OutputTag', async () => {
    for (const storage of storages) {
      const u = await _tu.insertTestUser(storage)
      const e = await _tu.insertTestOutputTag(storage, u)
      const id = e.outputTagId
      expect(id).toBeGreaterThan(0)
      expect(e.userId).toBe(u.userId)
      expect(e.tag).toBeTruthy()
      // duplicate must throw
      e.outputTagId = 0
      await expectToThrow(() => storage.insertOutputTag(e))
      e.tag = randomBytesHex(6)
      await storage.insertOutputTag(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.outputTagId).toBeGreaterThan(id)
    }
  })

  test('10 insert OutputTagMap', async () => {
    for (const storage of storages) {
      const { tx, user } = await _tu.insertTestTransaction(storage)
      const o = await _tu.insertTestOutput(storage, tx, 0, 101)
      const tag = await _tu.insertTestOutputTag(storage, user)
      const e = await _tu.insertTestOutputTagMap(storage, o, tag)
      expect(e.outputId).toBe(o.outputId)
      expect(e.outputTagId).toBe(tag.outputTagId)
      // duplicate must throw
      await expectToThrow(() => storage.insertOutputTagMap(e))
      const tag2 = await _tu.insertTestOutputTag(storage, user)
      const e2 = await _tu.insertTestOutputTagMap(storage, o, tag2)
    }
  })

  test('11 insert TxLabel', async () => {
    for (const storage of storages) {
      const u = await _tu.insertTestUser(storage)
      const e = await _tu.insertTestTxLabel(storage, u)
      const id = e.txLabelId
      expect(id).toBeGreaterThan(0)
      expect(e.userId).toBe(u.userId)
      expect(e.label).toBeTruthy()
      // duplicate must throw
      e.txLabelId = 0
      await expectToThrow(() => storage.insertTxLabel(e))
      e.label = randomBytesHex(6)
      await storage.insertTxLabel(e)
      // MySQL counts the failed insertion as a used id, SQLite does not.
      expect(e.txLabelId).toBeGreaterThan(id)
    }
  })

  test('12 insert TxLabelMap', async () => {
    for (const storage of storages) {
      const { tx, user } = await _tu.insertTestTransaction(storage)
      const label = await _tu.insertTestTxLabel(storage, user)
      const e = await _tu.insertTestTxLabelMap(storage, tx, label)
      expect(e.transactionId).toBe(tx.transactionId)
      expect(e.txLabelId).toBe(label.txLabelId)
      // duplicate must throw
      await expectToThrow(() => storage.insertTxLabelMap(e))
      const label2 = await _tu.insertTestTxLabel(storage, user)
      const e2 = await _tu.insertTestTxLabelMap(storage, tx, label2)
    }
  })

  test('13 insert MonitorEvent', async () => {
    for (const storage of storages) {
      const e = await _tu.insertTestMonitorEvent(storage)
      const id = e.id
      expect(id).toBeGreaterThan(0)
    }
  })

  test('14 insert SyncState', async () => {
    for (const storage of storages) {
      const u = await _tu.insertTestUser(storage)
      const e = await _tu.insertTestSyncState(storage, u)
      const id = e.syncStateId
      expect(id).toBeGreaterThan(0)
    }
  })
})
