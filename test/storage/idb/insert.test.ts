import { _tu } from '../../utils/TestUtilsWalletStorage'
import {
  randomBytesBase64,
  randomBytesHex,
  sdk,
  StorageProvider,
  StorageProviderOptions,
  TableCommission
} from '../../../src/index.client'
import { StorageIdb } from '../../../src/storage/StorageIdb'

import 'fake-indexeddb/auto'
import { openDB } from 'idb'

describe('idb insert tests', () => {
  jest.setTimeout(99999999)

  let storages: StorageProvider[] = []
  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)

  beforeEach(async () => {
    storages = []
    const options: StorageProviderOptions = StorageProvider.createStorageBaseOptions(chain)
    storages.push(new StorageIdb(options))

    for (const storage of storages) {
      await storage.dropAllData()
      await storage.migrate('insert tests', '1'.repeat(64))
    }
  })

  afterEach(async () => {
    for (const storage of storages) {
      await storage.destroy()
      await new Promise(resolve => setTimeout(resolve, 0)) // Allow fake-indexeddb to clean up
    }
  })

  test('0 insert ProvenTx', async () => {
    for (const storage of storages) {
      const ptx = await _tu.insertTestProvenTx(storage)
      expect(ptx.provenTxId).toBe(1)
      ptx.provenTxId = 0
      // duplicate must throw
      await expect(storage.insertProvenTx(ptx)).rejects.toThrow()
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
      await expect(storage.insertProvenTxReq(ptxreq)).rejects.toThrow()
      ptxreq.provenTxReqId = 0
      ptxreq.txid = '4'.repeat(64)
      const id = await storage.insertProvenTxReq(ptxreq)
      expect(id).toBe(2)
    }
  })

  test('2 insert User', async () => {
    for (const storage of storages) {
      const e = await _tu.insertTestUser(storage)
      const id = e.userId
      expect(id).toBeGreaterThan(0)
      e.userId = 0
      // duplicate must throw
      await expect(storage.insertUser(e)).rejects.toThrow()
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
      // duplicate must throw
      await expect(storage.insertCertificate(e)).rejects.toThrow()
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
      await expect(storage.insertCertificateField(e)).rejects.toThrow()
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
      await expect(storage.insertOutputBasket(e)).rejects.toThrow()
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
      await expect(storage.insertTransaction(e)).rejects.toThrow()
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
      await expect(storage.insertCommission(e)).rejects.toThrow()
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
      e.outputId = 0
      // duplicate must throw
      await expect(storage.insertOutput(e)).rejects.toThrow()
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
      e.outputTagId = 0
      // duplicate must throw
      await expect(storage.insertOutputTag(e)).rejects.toThrow()
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
      await expect(storage.insertOutputTagMap(e)).rejects.toThrow()
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
      e.txLabelId = 0
      // duplicate must throw
      await expect(storage.insertTxLabel(e)).rejects.toThrow()
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
      await expect(storage.insertTxLabelMap(e)).rejects.toThrow()
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
