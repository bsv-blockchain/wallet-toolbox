import { sdk, StorageProvider } from '../../src/index.client'
import { Setup } from '../../src/Setup'
import { StorageKnex } from '../../src/storage/StorageKnex'
import { _tu, TestSetup1 } from '../utils/TestUtilsWalletStorage'

const env = _tu.getEnv('main')

/**
 * This test file is similar to all the existing tests (count.test.ts, find.test.ts, etc)
 * but runs a selection of tests on PostgreSQL to verify complete compatibility
 */
describe('PostgreSQL extended storage tests', () => {
  jest.setTimeout(99999999)

  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)
  const postgresConnection = env.postgresConnection || ''
  const shouldRunTests = env.runPostgres && postgresConnection

  const storage: StorageProvider[] = []
  const setups: { setup: TestSetup1; storage: StorageProvider }[] = []

  test('00 skipped', () => {})
  // Skip the entire test suite if PostgreSQL connection isn't configured
  if (!shouldRunTests) return


  beforeAll(async () => {
    if (!shouldRunTests) return
    // Clean up any existing data before running tests
    try {
      const cleanupKnex = Setup.createPostgreSQLKnex(postgresConnection, 'wallet_storage_test_extended')
      const cleanupStorage = new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain,
        knex: cleanupKnex
      })
      await cleanupStorage.dropAllData()
      await cleanupKnex.destroy()
    } catch (e: any) {
      // Ignore errors - database might not exist yet
      console.log('Cleanup error (can be ignored):', e.message)
    }

    // Create fresh connection for tests
    const knexPostgres = Setup.createPostgreSQLKnex(postgresConnection, 'wallet_storage_test_extended')
    storage.push(
      new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain,
        knex: knexPostgres
      })
    )

    for (const s of storage) {
      await s.migrate('postgres extended tests', '1'.repeat(64))
      await s.makeAvailable()
      setups.push({ storage: s, setup: await _tu.createTestSetup1(s) })
    }
  })

  afterAll(async () => {
    if (!shouldRunTests) return
    for (const s of storage) {
      await s.destroy()
    }
  })

  // The following tests verify the same functionality that is tested in count.test.ts
  describe('count operations', () => {
    test('count ProvenTx', async () => {
      for (const { storage } of setups) {
        expect(await storage.countProvenTxs({ partial: {} })).toBe(1)
      }
    })

    test('count ProvenTxReq', async () => {
      for (const { storage } of setups) {
        expect(await storage.countProvenTxReqs({ partial: {} })).toBe(2)
      }
    })

    test('count User', async () => {
      for (const { storage } of setups) {
        expect(await storage.countUsers({ partial: {} })).toBe(2)
      }
    })

    test('count Certificate with filters', async () => {
      for (const { storage, setup } of setups) {
        expect(await storage.countCertificates({ partial: {} })).toBe(3)
        expect(
          await storage.countCertificates({
            partial: {},
            certifiers: [setup.u1cert1.certifier]
          })
        ).toBe(1)
        expect(await storage.countCertificates({ partial: {}, certifiers: ['none'] })).toBe(0)
        expect(
          await storage.countCertificates({
            partial: {},
            types: [setup.u1cert2.type]
          })
        ).toBe(1)
        expect(await storage.countCertificates({ partial: {}, types: ['oblongata'] })).toBe(0)
      }
    })
  })

  // The following tests verify the same functionality that is tested in find.test.ts
  describe('find operations', () => {
    test('find User by identity key', async () => {
      for (const { storage, setup } of setups) {
        const r = await storage.findUserByIdentityKey(setup.u1.identityKey)
        expect(r).not.toBeUndefined()
        if (r) {
          expect(r.userId).toBe(setup.u1.userId)
          expect(r.identityKey).toBe(setup.u1.identityKey)
        }
      }
    })

    test('find Certificate fields by certificateId', async () => {
      for (const { storage, setup } of setups) {
        const r = await storage.findCertificateFields({
          partial: { certificateId: setup.u1cert1.certificateId }
        })
        expect(r.length).toBe(2)
        expect(r.some(f => f.fieldName === 'bob')).toBe(true)
        expect(r.some(f => f.fieldName === 'name')).toBe(true)
      }
    })
  })

  // The following tests verify binary data handling in PostgreSQL
  describe('binary data operations', () => {
    test('insert and retrieve transaction with binary data', async () => {
      for (const { storage, setup } of setups) {
        // Create binary data arrays with different values to test binary handling
        const testRawTx = new Array(1000).fill(0).map((_, i) => i % 256)
        const testInputBEEF = new Array(1000).fill(0).map((_, i) => (i + 128) % 256)

        // Insert transaction with binary data
        const { tx } = await _tu.insertTestTransaction(storage, setup.u1, false, {
          txid: 'postgres-binary-test-data',
          rawTx: testRawTx,
          inputBEEF: testInputBEEF
        })

        // Retrieve and verify binary data
        const transactions = await storage.findTransactions({
          partial: { txid: 'postgres-binary-test-data' }
        })

        expect(transactions.length).toBe(1)
        const retrievedTx = transactions[0]
        expect(Array.from(retrievedTx.rawTx!)).toEqual(testRawTx)
        expect(Array.from(retrievedTx.inputBEEF!)).toEqual(testInputBEEF)
      }
    })

    test('insert and retrieve output with binary lockingScript', async () => {
      for (const { storage, setup } of setups) {
        // Create a test transaction
        const { tx } = await _tu.insertTestTransaction(storage, setup.u1, false, {
          txid: 'postgres-output-binary-test',
          status: 'completed' as sdk.TransactionStatus
        })

        // Create binary data for lockingScript
        const testLockingScript = new Array(500).fill(0).map((_, i) => i % 256)

        // Insert output with binary lockingScript
        const output = await _tu.insertTestOutput(storage, tx, 0, 1000, setup.u1basket1, false, {
          lockingScript: testLockingScript
        })

        // Retrieve and verify binary data
        const outputs = await storage.findOutputs({
          partial: { outputId: output.outputId }
        })

        expect(outputs.length).toBe(1)
        const retrievedOutput = outputs[0]
        expect(Array.from(retrievedOutput.lockingScript!)).toEqual(testLockingScript)
      }
    })

    test('update transaction with new binary data', async () => {
      for (const { storage, setup } of setups) {
        // Create transaction with initial binary data
        const initialRawTx = new Array(100).fill(1)
        const initialInputBEEF = new Array(100).fill(2)

        const { tx } = await _tu.insertTestTransaction(storage, setup.u1, false, {
          txid: 'postgres-update-binary-test',
          rawTx: initialRawTx,
          inputBEEF: initialInputBEEF
        })

        // New binary data for update
        const updatedRawTx = new Array(200).fill(3)
        const updatedInputBEEF = new Array(200).fill(4)

        // Update transaction with new binary data
        await storage.updateTransaction(tx.transactionId, {
          rawTx: updatedRawTx,
          inputBEEF: updatedInputBEEF
        })

        // Retrieve and verify updated binary data
        const transactions = await storage.findTransactions({
          partial: { transactionId: tx.transactionId }
        })

        expect(transactions.length).toBe(1)
        const retrievedTx = transactions[0]
        expect(Array.from(retrievedTx.rawTx!)).toEqual(updatedRawTx)
        expect(Array.from(retrievedTx.inputBEEF!)).toEqual(updatedInputBEEF)
        expect(Array.from(retrievedTx.rawTx!).length).toBe(200) // Verify length changed
      }
    })
  })

  // Tests for transaction support in PostgreSQL
  describe('transaction operations', () => {
    test('transaction commit', async () => {
      for (const { storage, setup } of setups) {
        // Use transaction to create a new record
        await storage.transaction(async trx => {
          const now = new Date()
          const newTag = {
            created_at: now,
            updated_at: now,
            outputTagId: 0,
            userId: setup.u1.userId,
            tag: 'postgres-transaction-test',
            isDeleted: false
          }

          await storage.insertOutputTag(newTag, trx)
        })

        // Verify record was committed
        const tags = await storage.findOutputTags({
          partial: {
            userId: setup.u1.userId,
            tag: 'postgres-transaction-test'
          }
        })

        expect(tags.length).toBe(1)
      }
    })

    test('transaction rollback', async () => {
      for (const { storage, setup } of setups) {
        try {
          // Transaction that will be rolled back
          await storage.transaction(async trx => {
            const now = new Date()
            const newTag = {
              created_at: now,
              updated_at: now,
              outputTagId: 0,
              userId: setup.u1.userId,
              tag: 'postgres-rollback-test',
              isDeleted: false
            }

            await storage.insertOutputTag(newTag, trx)

            // Force an error
            throw new Error('Intentional error to test transaction rollback')
          })

          // Transaction should have failed
          fail('Transaction should have failed')
        } catch (e) {
          // Expected error
        }

        // Verify record was not committed
        const tags = await storage.findOutputTags({
          partial: {
            userId: setup.u1.userId,
            tag: 'postgres-rollback-test'
          }
        })

        expect(tags.length).toBe(0)
      }
    })

    test('nested transactions', async () => {
      for (const { storage, setup } of setups) {
        // Use nested transactions
        await storage.transaction(async outerTrx => {
          // Create first record
          const now = new Date()
          const firstTag = {
            created_at: now,
            updated_at: now,
            outputTagId: 0,
            userId: setup.u1.userId,
            tag: 'postgres-nested-outer',
            isDeleted: false
          }

          await storage.insertOutputTag(firstTag, outerTrx)

          // Nested transaction
          await storage.transaction(async innerTrx => {
            // In PostgreSQL, this is the same transaction
            const secondTag = {
              created_at: now,
              updated_at: now,
              outputTagId: 0,
              userId: setup.u1.userId,
              tag: 'postgres-nested-inner',
              isDeleted: false
            }

            await storage.insertOutputTag(secondTag, innerTrx)
          }, outerTrx) // Pass the outer transaction
        })

        // Verify both records were committed
        const outerTags = await storage.findOutputTags({
          partial: {
            userId: setup.u1.userId,
            tag: 'postgres-nested-outer'
          }
        })

        const innerTags = await storage.findOutputTags({
          partial: {
            userId: setup.u1.userId,
            tag: 'postgres-nested-inner'
          }
        })

        expect(outerTags.length).toBe(1)
        expect(innerTags.length).toBe(1)
      }
    })
  })
})
