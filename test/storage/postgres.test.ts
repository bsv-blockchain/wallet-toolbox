import { sdk, StorageProvider } from '../../src/index.client'
import { Setup } from '../../src/Setup'
import { KnexMigrations } from '../../src/storage/schema/KnexMigrations'
import { StorageKnex } from '../../src/storage/StorageKnex'
import { _tu, TestSetup1 } from '../utils/TestUtilsWalletStorage'

describe('PostgreSQL storage tests', () => {
  jest.setTimeout(99999999)

  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)
  const postgresConnection = env.postgresConnection || ''
  const shouldRunTests = env.runPostgres && postgresConnection

  const storage: StorageProvider[] = []
  const setups: { setup: TestSetup1; storage: StorageProvider }[] = []

  test('00 skipped', () => {})
  if (!shouldRunTests) return

  beforeAll(async () => {
    if (!shouldRunTests) return
    // Clean up any existing data before running tests
    try {
      const cleanupKnex = Setup.createPostgreSQLKnex(postgresConnection, 'postgres_storage_test')
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
    const knexPostgres = Setup.createPostgreSQLKnex(postgresConnection, 'postgres_storage_test')
    storage.push(
      new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain,
        knex: knexPostgres
      })
    )

    for (const s of storage) {
      await s.migrate('postgres tests', '1'.repeat(64))
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

  test('PostgreSQL dbtype detection', async () => {
    for (const { storage } of setups) {
      const settings = await storage.getSettings()
      expect(settings.dbtype).toBe('PostgreSQL')
    }

    // Direct detection test using KnexMigrations
    const knexPostgres = Setup.createPostgreSQLKnex(postgresConnection, 'wallet_storage')
    try {
      const dbtype = await KnexMigrations.dbtype(knexPostgres)
      expect(dbtype).toBe('PostgreSQL')
    } finally {
      await knexPostgres.destroy()
    }
  })

  test('PostgreSQL date handling', async () => {
    for (const { storage, setup } of setups) {
      // The date fields should be actual Date objects in PostgreSQL
      const user = await storage.findUserByIdentityKey(setup.u1.identityKey)
      expect(user).toBeDefined()
      expect(user!.created_at).toBeInstanceOf(Date)
      expect(user!.updated_at).toBeInstanceOf(Date)
    }
  })

  test('PostgreSQL CRUD operations', async () => {
    for (const { storage, setup } of setups) {
      // Test count operations
      expect(await storage.countUsers({ partial: {} })).toBe(2)
      expect(await storage.countOutputBaskets({ partial: {} })).toBe(3)
      expect(await storage.countTransactions({ partial: {} })).toBe(3)
      expect(await storage.countOutputs({ partial: {} })).toBe(3)

      // Test find operations
      const users = await storage.findUsers({ partial: {} })
      expect(users.length).toBe(2)

      const baskets = await storage.findOutputBaskets({ partial: { userId: setup.u1.userId } })
      expect(baskets.length).toBe(2)

      // Test insert operation
      const now = new Date()
      const newBasket = {
        created_at: now,
        updated_at: now,
        basketId: 0,
        userId: setup.u1.userId,
        name: 'postgres-test-basket',
        numberOfDesiredUTXOs: 42,
        minimumDesiredUTXOValue: 1642,
        isDeleted: false
      }

      const basketId = await storage.insertOutputBasket(newBasket)
      expect(basketId).toBeGreaterThan(0)

      // Test update operation
      const updateResult = await storage.updateOutputBasket(basketId, {
        numberOfDesiredUTXOs: 99,
        minimumDesiredUTXOValue: 999
      })
      expect(updateResult).toBe(1)

      // Verify the update
      const updatedBasket = await storage.findOutputBaskets({ partial: { basketId } })
      expect(updatedBasket.length).toBe(1)
      expect(updatedBasket[0].numberOfDesiredUTXOs).toBe(99)
      expect(updatedBasket[0].minimumDesiredUTXOValue).toBe(999)
    }
  })

  test('PostgreSQL transaction support', async () => {
    for (const { storage, setup } of setups) {
      // Test transaction rollback
      try {
        await storage.transaction(async trx => {
          const now = new Date()
          const newBasket = {
            created_at: now,
            updated_at: now,
            basketId: 0,
            userId: setup.u1.userId,
            name: 'postgres-transaction-test',
            numberOfDesiredUTXOs: 42,
            minimumDesiredUTXOValue: 1642,
            isDeleted: false
          }

          await storage.insertOutputBasket(newBasket, trx)

          // Force a failure to trigger rollback
          throw new Error('Intentional failure to test transaction rollback')
        })
      } catch (e) {
        // Expected error, continue
      }

      // Verify that the basket was not inserted (rollback worked)
      const basketsAfterRollback = await storage.findOutputBaskets({
        partial: {
          userId: setup.u1.userId,
          name: 'postgres-transaction-test'
        }
      })
      expect(basketsAfterRollback.length).toBe(0)

      // Test transaction commit
      await storage.transaction(async trx => {
        const now = new Date()
        const newBasket = {
          created_at: now,
          updated_at: now,
          basketId: 0,
          userId: setup.u1.userId,
          name: 'postgres-transaction-commit',
          numberOfDesiredUTXOs: 42,
          minimumDesiredUTXOValue: 1642,
          isDeleted: false
        }

        await storage.insertOutputBasket(newBasket, trx)
        // Let transaction complete normally (commit)
      })

      // Verify that the basket was inserted (commit worked)
      const basketsAfterCommit = await storage.findOutputBaskets({
        partial: {
          userId: setup.u1.userId,
          name: 'postgres-transaction-commit'
        }
      })
      expect(basketsAfterCommit.length).toBe(1)
    }
  })

  test('PostgreSQL binary data handling', async () => {
    for (const { storage, setup } of setups) {
      // Test insert with binary data
      const now = new Date()
      const mockData = new Array(1000).fill(42) // Create binary data array

      const { tx } = await _tu.insertTestTransaction(storage, setup.u1, false, {
        txid: 'postgres-binary-test-txid',
        rawTx: mockData,
        inputBEEF: mockData
      })

      // Verify that binary data was stored and retrieved correctly
      const transactions = await storage.findTransactions({
        partial: {
          txid: 'postgres-binary-test-txid'
        },
        noRawTx: false
      })

      expect(transactions.length).toBe(1)
      expect(transactions[0].rawTx).toEqual(mockData)
      expect(transactions[0].inputBEEF).toEqual(mockData)
    }
  })
})
