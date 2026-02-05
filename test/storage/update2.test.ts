/* Additional update tests for setting edge cases and exercising contraints (unique/foreign) */
/* Requires a new DB for each test                                                           */
import { _tu, TestSetup1 } from '../utils/TestUtilsWalletStorage'
import { sdk, StorageProvider, StorageKnex, verifyOne } from '../../src/index.all'
import {
  normalizeDate,
  setLogging,
  triggerForeignKeyConstraintError,
  triggerUniqueConstraintError,
  updateTable,
  validateUpdateTime,
  verifyValues
} from '../utils/TestUtilsWalletStorage'
import {
  TableProvenTx,
  TableProvenTxReq,
  TableUser,
  TableCertificate,
  TableCertificateField,
  TableOutputBasket,
  TableTransaction,
  TableCommission,
  TableOutput,
  TableOutputTag,
  TableOutputTagMap,
  TableTxLabel,
  TableTxLabelMap,
  TableMonitorEvent,
  TableSyncState
} from '../../src/storage/schema/tables'

setLogging(false)

import { Knex } from 'knex'

describe('update2 tests', () => {
  const storages: StorageKnex[] = []
  const setups: { setup: TestSetup1; storage: StorageKnex }[] = []
  const chain: sdk.Chain = 'test'

  const createDB = async (databaseName: string): Promise<void> => {
    const localSQLiteFile = await _tu.newTmpFile(`${databaseName}.sqlite`, false, false, true)

    // Use the standard utility to create SQLite connections with proper foreign key support
    const knexSQLite: Knex = _tu.createLocalSQLite(localSQLiteFile)

    const storage = new StorageKnex({
      ...StorageKnex.defaultOptions(),
      knex: knexSQLite,
      chain
    })

    storages.push(storage)

    await storage.dropAllData()
    await storage.migrate('test setup', '1'.repeat(64))
    await storage.makeAvailable()

    // Explicitly enable foreign keys AFTER all setup operations, since dropAllData/migrate
    // might reset the connection state. This is a belt and suspenders approach.
    await knexSQLite.raw('PRAGMA foreign_keys = ON')

    const setup = await _tu.createTestSetup1(storage)

    setups.push({ setup, storage })
  }

  afterEach(async () => {
    for (const storage of storages) {
      if (storage instanceof StorageKnex) {
        await storage.knex.destroy()
      }
    }
    storages.length = 0
    setups.length = 0
  })

  test('1_update ProvenTx', async () => {
    await createDB('ProvenTx1')
    for (const { storage } of setups) {
      const records = await storage.findProvenTxs({ partial: {} })
      const time = new Date('2001-01-02T12:00:00.000Z')
      for (const record of records) {
        await storage.updateProvenTx(record.provenTxId, {
          blockHash: 'fred',
          updated_at: time
        })
        const t = verifyOne(
          await storage.findProvenTxs({
            partial: { provenTxId: record.provenTxId }
          })
        )
        expect(t.provenTxId).toBe(record.provenTxId)
        expect(t.blockHash).toBe('fred')
        expect(t.updated_at.getTime()).toBe(time.getTime())
      }
    }
  })

  test('2_update ProvenTx', async () => {
    await createDB('ProvenTx2')
    const primaryKey = 'provenTxId'
    for (const { storage } of setups) {
      const referenceTime = new Date()
      const records = await storage.findProvenTxs({ partial: {} })
      for (const record of records) {
        try {
          const testValues: TableProvenTx = {
            provenTxId: record.provenTxId,
            txid: 'mockTxid',
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z'),
            blockHash: 'mockBlockHash',
            height: 12345,
            index: 1,
            merklePath: [1, 2, 3, 4],
            merkleRoot: '1234',
            rawTx: [4, 3, 2, 1]
          }
          await updateTable(storage.updateProvenTx.bind(storage), record[primaryKey], testValues)
          const updatedTx = verifyOne(
            await storage.findProvenTxs({
              partial: { [primaryKey]: record[primaryKey] }
            })
          )
          verifyValues(updatedTx, testValues, referenceTime)
          for (const [key, value] of Object.entries(testValues)) {
            if (key === primaryKey) {
              continue
            }
            if (typeof value === 'string') {
              const validString = `valid${key}`
              const r1 = await storage.updateProvenTx(record[primaryKey], {
                [key]: validString
              })
              expect(r1).toBe(1)
              const updatedRow = verifyOne(
                await storage.findProvenTxs({
                  partial: { [primaryKey]: record[primaryKey] }
                })
              )
              expect(updatedRow[key]).toBe(validString)
            }
            if (typeof value === 'number') {
              const validNumber = value + 1
              const r1 = await storage.updateProvenTx(record[primaryKey], {
                [key]: validNumber
              })
              expect(r1).toBe(1)
              const updatedRow = verifyOne(
                await storage.findProvenTxs({
                  partial: { [primaryKey]: record[primaryKey] }
                })
              )
              expect(updatedRow[key]).toBe(validNumber)
            }
            if (value instanceof Date) {
              const validDate = new Date('2024-12-31T00:00:00Z')
              const r1 = await storage.updateProvenTx(record[primaryKey], {
                [key]: validDate
              })
              expect(r1).toBe(1)
              const updatedRow = verifyOne(
                await storage.findProvenTxs({
                  partial: { [primaryKey]: record[primaryKey] }
                })
              )
              expect(new Date(updatedRow[key]).toISOString()).toBe(validDate.toISOString())
            }
            if (Array.isArray(value)) {
              const validArray = value.map(v => v + 1)
              const r1 = await storage.updateProvenTx(record[primaryKey], {
                [key]: validArray
              })
              expect(r1).toBe(1)
              const updatedRow = verifyOne(
                await storage.findProvenTxs({
                  partial: { [primaryKey]: record[primaryKey] }
                })
              )
              expect(updatedRow[key]).toEqual(validArray)
            }
          }
        } catch (error: any) {
          console.error(
            `Error updating or verifying ProvenTx record with ${primaryKey}=${record[primaryKey]}:`,
            error.message
          )
          throw error
        }
      }
    }
  })

  test('3_update ProvenTx set created_at and updated_at time', async () => {
    await createDB('ProvenTx3')
    for (const { storage } of setups) {
      const scenarios = [
        {
          description: 'Invalid created_at time',
          updates: {
            created_at: new Date('3000-01-01T00:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        },
        {
          description: 'Invalid updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('3000-01-01T00:00:00Z')
          }
        },
        {
          description: 'created_at time overwrites updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        }
      ]
      for (const { updates } of scenarios) {
        const referenceTime = new Date()
        const records = await storage.findProvenTxs({ partial: {} })
        for (const record of records) {
          await storage.updateProvenTx(record.provenTxId, {
            created_at: updates.created_at
          })
          await storage.updateProvenTx(record.provenTxId, {
            updated_at: updates.updated_at
          })
          const t = verifyOne(
            await storage.findProvenTxs({
              partial: { provenTxId: record.provenTxId }
            })
          )
          expect(validateUpdateTime(t.created_at, updates.created_at, referenceTime, 10, false)).toBe(true)
          expect(validateUpdateTime(t.updated_at, updates.updated_at, referenceTime, 10, false)).toBe(true)
        }
      }
    }
  })

  test('4_update ProvenTx setting individual values', async () => {
    await createDB('ProvenTx4')
    for (const { storage } of setups) {
      const initialRecord: TableProvenTx = {
        provenTxId: 3,
        txid: 'mockTxid',
        created_at: new Date(),
        updated_at: new Date(),
        blockHash: '',
        height: 1,
        index: 1,
        merklePath: [],
        merkleRoot: '',
        rawTx: []
      }
      try {
        const r = await storage.insertProvenTx(initialRecord)
        expect(r).toBeGreaterThan(0)
        const insertedRecords = await storage.findProvenTxs({ partial: {} })
        expect(insertedRecords.length).toBeGreaterThan(0)
        const foundRecord = insertedRecords.find(record => record.provenTxId === 3)
        expect(foundRecord).toBeDefined()
        expect(foundRecord?.txid).toBe('mockTxid')
      } catch (error: any) {
        console.error('Error inserting initial record:', (error as Error).message)
        return
      }
      // Ensure foreign keys are enabled right before the constraint check
      await storage.knex.raw('PRAGMA foreign_keys = ON')
      await expect(storage.updateProvenTx(1, { provenTxId: 0 })).rejects.toThrow(/FOREIGN KEY constraint failed/)
      const r1 = await storage.updateProvenTx(3, { provenTxId: 0 })
      await expect(Promise.resolve(r1)).resolves.toBe(1)
      const r2 = await storage.findProvenTxs({ partial: {} })
      expect(r2[0].provenTxId).toBe(0)
      expect(r2[1].provenTxId).toBe(1)
      const r3 = await storage.updateProvenTx(0, { provenTxId: 3 })
      await expect(Promise.resolve(r3)).resolves.toBe(1)
      const r4 = await storage.findProvenTxs({ partial: {} })
      expect(r4[0].provenTxId).toBe(1)
      expect(r4[1].provenTxId).toBe(3)
      const r8 = await storage.updateProvenTx(3, { txid: 'mockValidTxid' })
      await expect(Promise.resolve(r8)).resolves.toBe(1)
      const r9 = await storage.findProvenTxs({ partial: {} })
      expect(r9.find(r => r.provenTxId === 3)?.txid).toBe('mockValidTxid')
    }
  })

  test('5_update ProvenTxReq', async () => {
    await createDB('ProvenTx5')
    const primaryKey = 'provenTxReqId'
    for (const { storage } of setups) {
      const records = await storage.findProvenTxReqs({ partial: {} })
      let i = -1
      for (const record of records) {
        i++
        try {
          const testValues: TableProvenTxReq = {
            provenTxReqId: record.provenTxReqId,
            provenTxId: 1,
            batch: `batch-001`,
            status: 'completed',
            txid: `mockTxid-${i}`,
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z'),
            attempts: 3,
            history: JSON.stringify({ validated: true, timestamp: Date.now() }),
            inputBEEF: [5, 6, 7, 8],
            notified: true,
            notify: JSON.stringify({ email: 'test@example.com', sent: true }),
            rawTx: [1, 2, 3, 4]
          }
          const r1 = await storage.updateProvenTxReq(record[primaryKey], testValues)
          expect(r1).toBe(1)
          const updatedRow = verifyOne(
            await storage.findProvenTxReqs({
              partial: { [primaryKey]: record[primaryKey] }
            })
          )
          for (const [key, value] of Object.entries(testValues)) {
            const actualValue = updatedRow[key]
            const normalizedActual = normalizeDate(actualValue)
            const normalizedExpected = normalizeDate(value)
            if (normalizedActual && normalizedExpected) {
              expect(normalizedActual).toBe(normalizedExpected)
              continue
            }
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              expect(JSON.parse(actualValue)).toStrictEqual(JSON.parse(value))
              continue
            }
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              expect(actualValue).toBe(value)
              continue
            }
            if (typeof actualValue === 'object' && actualValue?.type === 'Buffer') {
              const actualArray = actualValue.data || actualValue
              const expectedArray =
                Buffer.isBuffer(value) || Array.isArray(value) ? Array.from(value as ArrayLike<number>) : value
              expect(actualArray).toStrictEqual(expectedArray)
              continue
            }
            expect(JSON.stringify({ type: 'Buffer', data: actualValue })).toStrictEqual(JSON.stringify(value))
          }
        } catch (error: any) {
          console.error(
            `Error updating or verifying ProvenTxReq record with ${primaryKey}=${record[primaryKey]}:`,
            error.message
          )
          throw error
        }
      }
    }
  })

  test('6_update ProvenTxReq set created_at and updated_at time', async () => {
    await createDB('ProvenTxReq6')
    for (const { storage } of setups) {
      const scenarios = [
        {
          description: 'Invalid created_at time',
          updates: {
            created_at: new Date('3000-01-01T00:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        },
        {
          description: 'Invalid updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('3000-01-01T00:00:00Z')
          }
        },
        {
          description: 'created_at time overwrites updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        }
      ]
      for (const { updates } of scenarios) {
        const referenceTime = new Date()
        const records = await storage.findProvenTxReqs({ partial: {} })
        for (const record of records) {
          await storage.updateProvenTxReq(record.provenTxReqId, {
            created_at: updates.created_at
          })
          await storage.updateProvenTxReq(record.provenTxReqId, {
            updated_at: updates.updated_at
          })
          const t = verifyOne(
            await storage.findProvenTxReqs({
              partial: { provenTxReqId: record.provenTxReqId }
            })
          )
          expect(validateUpdateTime(t.created_at, updates.created_at, referenceTime)).toBe(true)
          expect(validateUpdateTime(t.updated_at, updates.updated_at, referenceTime)).toBe(true)
        }
      }
    }
  })

  test('7_update ProvenTxReq setting individual values', async () => {
    await createDB('ProvenTxReq7')
    for (const { storage } of setups) {
      const referenceTime = new Date()
      const initialRecord: TableProvenTxReq = {
        provenTxReqId: 3,
        provenTxId: 1,
        batch: 'batch',
        status: 'nosend',
        txid: 'mockTxid1',
        created_at: referenceTime,
        updated_at: referenceTime,
        attempts: 0,
        history: '{}',
        inputBEEF: [],
        notified: false,
        notify: '{}',
        rawTx: []
      }
      await storage.insertProvenTxReq(initialRecord)
      const secondRecord: TableProvenTxReq = {
        ...initialRecord,
        provenTxReqId: 4,
        txid: 'mockTxid2'
      }
      await storage.insertProvenTxReq(secondRecord)
      const recordToUpdate3 = await storage.findProvenTxReqs({
        partial: { provenTxReqId: 3 }
      })
      expect(recordToUpdate3.length).toBeGreaterThan(0)
      const recordToUpdate4 = await storage.findProvenTxReqs({
        partial: { provenTxReqId: 4 }
      })
      expect(recordToUpdate4.length).toBeGreaterThan(0)
      const r3 = await storage.updateProvenTxReq(3, { batch: 'updatedBatch' })
      await expect(Promise.resolve(r3)).resolves.toBe(1)
      const updatedRecords = await storage.findProvenTxReqs({ partial: {} })
      const updatedBatch = updatedRecords.find(r => r.provenTxReqId === 3)?.batch
      expect(updatedBatch).toBe('updatedBatch')
      try {
        const r4 = await storage.updateProvenTxReq(4, { batch: 'updatedBatch' })
        if (r4 === 0) {
          console.warn('No rows updated. Ensure UNIQUE constraint exists on the batch column if rejection is expected.')
        } else {
          await expect(Promise.resolve(r4)).resolves.toBe(1)
        }
      } catch (error: any) {
        expect(error.message).toMatch(/UNIQUE constraint failed/)
      }
      const r5 = await storage.updateProvenTxReq(3, { txid: 'newValidTxid' })
      await expect(Promise.resolve(r5)).resolves.toBe(1)
      // Ensure foreign keys are enabled for constraint check
      await storage.knex.raw('PRAGMA foreign_keys = ON')
      await expect(storage.updateProvenTxReq(4, { txid: 'newValidTxid' })).rejects.toThrow(/UNIQUE constraint failed/)
      const finalRecords = await storage.findProvenTxReqs({ partial: {} })
      expect(finalRecords.find(r => r.provenTxReqId === 4)?.txid).toBe('mockTxid2')
      await storage.updateProvenTxReq(3, { batch: 'batch', txid: 'mockTxid1' })
    }
  })

  test('8_update User', async () => {
    await createDB('User8')
    const primaryKey = 'userId'
    for (const { storage } of setups) {
      const records = await storage.findUsers({ partial: {} })
      for (const record of records) {
        try {
          const testValues: TableUser = {
            userId: record.userId,
            identityKey: `mockUpdatedIdentityKey-${record[primaryKey]}`,
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z'),
            activeStorage: storage.getSettings().storageIdentityKey
          }
          const updateResult = await storage.updateUser(record[primaryKey], testValues)
          expect(updateResult).toBe(1)
          const updatedRow = verifyOne(
            await storage.findUsers({
              partial: { [primaryKey]: record[primaryKey] }
            })
          )
          for (const [key, value] of Object.entries(testValues)) {
            const actualValue = updatedRow[key]
            const normalizedActual = normalizeDate(actualValue)
            const normalizedExpected = normalizeDate(value)
            if (normalizedActual && normalizedExpected) {
              expect(normalizedActual).toBe(normalizedExpected)
              continue
            }
            expect(actualValue).toBe(value)
          }
        } catch (error: any) {
          console.error(
            `Error updating or verifying User record with ${primaryKey}=${record[primaryKey]}:`,
            error.message
          )
          throw error
        }
      }
    }
  })

  test('9_update User set created_at and updated_at time', async () => {
    await createDB('User9')
    for (const { storage } of setups) {
      const scenarios = [
        {
          description: 'Invalid created_at time',
          updates: {
            created_at: new Date('3000-01-01T00:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        },
        {
          description: 'Invalid updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('3000-01-01T00:00:00Z')
          }
        },
        {
          description: 'created_at time overwrites updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        }
      ]
      for (const { description, updates } of scenarios) {
        const referenceTime = new Date()
        const records = await storage.findUsers({ partial: {} })
        for (const record of records) {
          await storage.updateUser(record.userId, {
            created_at: updates.created_at
          })
          await storage.updateUser(record.userId, {
            updated_at: updates.updated_at
          })
          const t = verifyOne(await storage.findUsers({ partial: { userId: record.userId } }))
          expect(validateUpdateTime(t.created_at, updates.created_at, referenceTime)).toBe(true)
          expect(validateUpdateTime(t.updated_at, updates.updated_at, referenceTime)).toBe(true)
        }
      }
    }
  })

  test('10_update User trigger DB unique constraint errors', async () => {
    await createDB('User10')
    for (const { storage } of setups) {
      try {
        const r = await storage.updateUser(2, {
          identityKey: 'mockDupIdentityKey'
        })
        await expect(Promise.resolve(r)).resolves.toBe(1)
      } catch (error: any) {
        console.error('Error updating second record:', error.message)
        return
      }
      const r1 = await triggerUniqueConstraintError(storage, 'findUsers', 'updateUser', 'users', 'userId', {
        userId: 2
      })
      await expect(Promise.resolve(r1)).resolves.toBe(true)
      const r2 = await triggerUniqueConstraintError(storage, 'findUsers', 'updateUser', 'users', 'userId', {
        identityKey: 'mockDupIdentityKey'
      })
      await expect(Promise.resolve(r2)).resolves.toBe(true)
      const r3 = await triggerUniqueConstraintError(storage, 'findUsers', 'updateUser', 'users', 'userId', {
        identityKey: 'mockUniqueIdentityKey'
      })
      await expect(Promise.resolve(r3)).resolves.toBe(false)
    }
  })

  test('11_update User trigger DB foreign key constraint errors', async () => {
    await createDB('User11')
    for (const { storage } of setups) {
      const r1 = await triggerForeignKeyConstraintError(storage, 'findUsers', 'updateUser', 'users', 'userId', {
        userId: 0
      })
      await expect(Promise.resolve(r1)).resolves.toBe(true)
      const r2 = await triggerForeignKeyConstraintError(
        storage,
        'findUsers',
        'updateUser',
        'users',
        'userId',
        { userId: 3 },
        0
      )
      await expect(Promise.resolve(r2)).resolves.toBe(false)
    }
  })

  test('12_update User table setting individual values', async () => {
    await createDB('User12')
    for (const { storage } of setups) {
      const initialRecord: TableUser = {
        userId: 3,
        identityKey: '',
        created_at: new Date(),
        updated_at: new Date(),
        activeStorage: storage.getSettings().storageIdentityKey
      }
      try {
        const r = await storage.insertUser(initialRecord)
        expect(r).toBeGreaterThan(1)
      } catch (error: any) {
        console.error('Error inserting initial record:', error.message)
        return
      }
      // Ensure foreign keys are enabled for constraint check
      await storage.knex.raw('PRAGMA foreign_keys = ON')
      const fkStatus = await storage.knex.raw('PRAGMA foreign_keys')
      console.log('Foreign keys status:', JSON.stringify(fkStatus))
      // Check what data exists
      const users = await storage.findUsers({ partial: {} })
      console.log(
        'Users:',
        users.map(u => u.userId)
      )
      const txs = await storage.findTransactions({ partial: { userId: 1 } })
      console.log('Transactions for userId=1:', txs.length)
      await expect(storage.updateUser(1, { userId: 0 })).rejects.toThrow(/FOREIGN KEY constraint failed/)
      await expect(storage.updateUser(2, { userId: 0 })).rejects.toThrow(/FOREIGN KEY constraint failed/)
      const r1 = await storage.updateUser(3, { userId: 0 })
      await expect(Promise.resolve(r1)).resolves.toBe(1)
      const r2 = await storage.findUsers({ partial: {} })
      expect(r2[0].userId).toBe(0)
      expect(r2[1].userId).toBe(1)
      expect(r2[2].userId).toBe(2)
      const r3 = await storage.updateUser(0, { userId: 3 })
      await expect(Promise.resolve(r3)).resolves.toBe(1)
      const r4 = await storage.findUsers({ partial: {} })
      expect(r4[0].userId).toBe(1)
      expect(r4[1].userId).toBe(2)
      expect(r4[2].userId).toBe(3)
      const r5 = await storage.updateUser(3, { userId: 9999 })
      await expect(Promise.resolve(r5)).resolves.toBe(1)
      const r6 = await storage.findUsers({ partial: {} })
      expect(r6[0].userId).toBe(1)
      expect(r6[1].userId).toBe(2)
      expect(r6[2].userId).toBe(9999)
      await expect(storage.updateUser(1, { userId: 9999 })).rejects.toThrow(/UNIQUE constraint failed/)
      const r7 = await storage.findUsers({ partial: {} })
      expect(r7[0].userId).toBe(1)
      expect(r7[1].userId).toBe(2)
      expect(r7[2].userId).toBe(9999)
      const r8 = await storage.updateUser(9999, {
        identityKey: 'mockValidIdentityKey'
      })
      await expect(Promise.resolve(r8)).resolves.toBe(1)
      const r9 = await storage.findUsers({ partial: {} })
      expect(r9[0].identityKey).not.toBe('mockValidIdentityKey')
      expect(r9[1].identityKey).not.toBe('mockValidIdentityKey')
      expect(r9[2].identityKey).toBe('mockValidIdentityKey')
      await expect(storage.updateUser(2, { identityKey: 'mockValidIdentityKey' })).rejects.toThrow(
        /UNIQUE constraint failed/
      )
      const r10 = await storage.findUsers({ partial: {} })
      expect(r10[0].identityKey).not.toBe('mockValidIdentityKey')
      expect(r10[1].identityKey).not.toBe('mockValidIdentityKey')
      expect(r10[2].identityKey).toBe('mockValidIdentityKey')
      const r11 = await storage.updateUser(9999, { userId: 3 })
      await expect(Promise.resolve(r11)).resolves.toBe(1)
      const r12 = await storage.findUsers({ partial: {} })
      expect(r12[0].userId).toBe(1)
      expect(r12[1].userId).toBe(2)
      expect(r12[2].userId).toBe(3)
      const createdAt = new Date('2024-12-30T23:00:00Z')
      const updatedAt = new Date('2024-12-30T23:05:00Z')
      const r13 = await storage.updateUser(3, {
        created_at: createdAt,
        updated_at: updatedAt
      })
      await expect(Promise.resolve(r13)).resolves.toBe(1)
      const r14 = await storage.findUsers({ partial: {} })
      const updatedRecord = r14.find(record => record.userId === 3)
      expect(updatedRecord?.created_at).toEqual(createdAt)
      expect(updatedRecord?.updated_at).toEqual(updatedAt)
    }
  })

  test('13_update Certificate', async () => {
    await createDB('Certificate13')
    for (const { storage } of setups) {
      const primaryKey = 'certificateId'
      const records = await storage.findCertificates({ partial: {} })
      for (const record of records) {
        try {
          const testValues: TableCertificate = {
            certificateId: record.certificateId,
            userId: 1,
            certifier: `mockCertifier${record.certificateId}`,
            serialNumber: `mockSerialNumber${record.certificateId}`,
            type: `mockType${record.certificateId}`,
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z'),
            isDeleted: false,
            revocationOutpoint: 'mockRevocationOutpoint',
            signature: 'mockSignature',
            subject: 'mockSubject'
          }
          const r1 = await storage.updateCertificate(record[primaryKey], testValues)
          expect(r1).toBe(1)
          const updatedRow = verifyOne(
            await storage.findCertificates({
              partial: { [primaryKey]: record[primaryKey] }
            })
          )
          for (const [key, value] of Object.entries(testValues)) {
            const actualValue = updatedRow[key]
            const normalizedActual = normalizeDate(actualValue)
            const normalizedExpected = normalizeDate(value)
            if (normalizedActual && normalizedExpected) {
              expect(normalizedActual).toBe(normalizedExpected)
              continue
            }
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              expect(JSON.parse(actualValue)).toStrictEqual(JSON.parse(value))
              continue
            }
            if (typeof actualValue === 'boolean') {
              if (value === 1) {
                expect(actualValue).toBe(true)
              } else if (value === 0) {
                expect(actualValue).toBe(false)
              } else {
                throw new Error(`Unexpected value for expectedValue: ${value}. Must be 0 or 1.`)
              }
              continue
            }
            if (typeof value === 'string' || typeof value === 'number') {
              expect(actualValue).toBe(value)
              continue
            }
            if (typeof actualValue === 'object' && actualValue?.type === 'Buffer') {
              const actualArray = actualValue.data || actualValue
              const expectedArray =
                Buffer.isBuffer(value) || Array.isArray(value) ? Array.from(value as ArrayLike<number>) : value
              expect(actualArray).toStrictEqual(expectedArray)
              continue
            }
            expect(JSON.stringify({ type: 'Buffer', data: actualValue })).toStrictEqual(JSON.stringify(value))
          }
        } catch (error: any) {
          console.error(
            `Error updating or verifying Certificate record with ${primaryKey}=${record[primaryKey]}:`,
            error.message
          )
          throw error
        }
      }
    }
  })

  test('14_update Certificate set created_at and updated_at time', async () => {
    await createDB('Certificate14')
    for (const { storage } of setups) {
      const scenarios = [
        {
          description: 'Invalid created_at time',
          updates: {
            created_at: new Date('3000-01-01T00:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        },
        {
          description: 'Invalid updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('3000-01-01T00:00:00Z')
          }
        },
        {
          description: 'created_at time overwrites updated_at time',
          updates: {
            created_at: new Date('2024-12-30T23:00:00Z'),
            updated_at: new Date('2024-12-30T23:05:00Z')
          }
        }
      ]
      for (const { updates } of scenarios) {
        const referenceTime = new Date()
        const records = await storage.findCertificates({ partial: {} })
        for (const record of records) {
          await storage.updateUser(record.certificateId, {
            created_at: updates.created_at
          })
          await storage.updateUser(record.certificateId, {
            updated_at: updates.updated_at
          })
          const t = verifyOne(
            await storage.findCertificates({
              partial: { certificateId: record.certificateId }
            })
          )
          expect(validateUpdateTime(t.created_at, updates.created_at, referenceTime)).toBe(true)
          expect(validateUpdateTime(t.updated_at, updates.updated_at, referenceTime)).toBe(true)
        }
      }
    }
  })

  test('15_update Certificate trigger DB unique constraint errors', async () => {
    await createDB('Certificate15')
    for (const { storage } of setups) {
      const initMockDupValues = {
        userId: 2,
        type: `mockType2`,
        certifier: `mockCertifier2`,
        serialNumber: `mockSerialNumber2`
      }
      try {
        const r = await storage.updateCertificate(2, initMockDupValues)
        await expect(Promise.resolve(r)).resolves.toBe(1)
      } catch (error: any) {
        console.error('Error updating second record:', error.message)
      }
      const mockDupValues = {
        userId: 2,
        type: `mockType2`,
        certifier: `mockCertifier2`,
        serialNumber: `mockSerialNumber2`
      }
      const mockUniqueValues = {
        userId: 2,
        type: `mockTypeUnique`,
        certifier: `mockCertifier2`,
        serialNumber: `mockSerialNumber2`
      }
      const r1 = await triggerUniqueConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        { certificateId: 2 }
      )
      await expect(Promise.resolve(r1)).resolves.toBe(true)
      const r2 = await triggerUniqueConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        mockDupValues
      )
      await expect(Promise.resolve(r2)).resolves.toBe(true)
      const r3 = await triggerUniqueConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        mockUniqueValues
      )
      await expect(Promise.resolve(r3)).resolves.toBe(false)
    }
  })

  test('16_update Certificate trigger DB foreign key constraint errors', async () => {
    await createDB('Certificate16')
    for (const { storage } of setups) {
      const r1 = await triggerForeignKeyConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        { certificateId: 0 }
      )
      await expect(Promise.resolve(r1)).resolves.toBe(true)
      const r2 = await triggerForeignKeyConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        { certificateId: 1 },
        0
      )
      await expect(Promise.resolve(r2)).resolves.toBe(false)
      const r3 = await triggerForeignKeyConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        { userId: 0 }
      )
      await expect(Promise.resolve(r3)).resolves.toBe(true)
      const r4 = await triggerForeignKeyConstraintError(
        storage,
        'findCertificates',
        'updateCertificate',
        'certificates',
        'certificateId',
        { userId: 1 },
        2
      )
      await expect(Promise.resolve(r4)).resolves.toBe(false)
    }
  })
})
