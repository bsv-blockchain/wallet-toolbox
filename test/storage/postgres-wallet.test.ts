import { sdk } from '../../src/index.client'
import { Setup } from '../../src/Setup'
import { StorageKnex } from '../../src/storage/StorageKnex'
import { _tu } from '../utils/TestUtilsWalletStorage'

const postgresConnection = process.env.POSTGRES_CONNECTION || ''
const shouldRunTests = !process.env.NOPOSTGRES && !!postgresConnection

// Conditionally define the test suite
const describeOrSkip = shouldRunTests ? describe : describe.skip

/**
 * This test file verifies the wallet setup functions for PostgreSQL
 */
describeOrSkip('PostgreSQL wallet setup tests', () => {
  jest.setTimeout(99999999)

  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)

  // Skip the entire test suite if PostgreSQL connection isn't configured

  // Clean up databases before each test
  beforeEach(async () => {
    // Clean up the wallet_storage_test database
    let knex = Setup.createPostgreSQLKnex(postgresConnection, 'wallet_storage_test')
    try {
      // Drop all tables to ensure clean state
      const storage = new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain,
        knex
      })
      await storage.dropAllData()
    } catch (e) {
      // Ignore errors, might be first run
    } finally {
      await knex.destroy()
    }

    // Clean up the wallet_storage_test database
    knex = Setup.createPostgreSQLKnex(postgresConnection, 'wallet_storage_test')
    try {
      const storage = new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain,
        knex
      })
      await storage.dropAllData()
    } catch (e) {
      // Ignore errors, might be first run
    } finally {
      await knex.destroy()
    }
  })

  test('Create wallet with PostgreSQL storage', async () => {
    let wallet
    try {
      // Test the createWalletPostgreSQL function
      const dbName = `wallet_storage_test`

      // Create a compatible env object for Setup.createWalletPostgreSQL
      const walletEnv = {
        chain: env.chain,
        identityKey: env.identityKey,
        identityKey2: env.identityKey2,
        filePath: env.filePath || '',
        taalApiKey: env.taalApiKey,
        devKeys: env.devKeys,
        mySQLConnection: '{}',
        postgresConnection
      }

      wallet = await Setup.createWalletPostgreSQL({
        env: walletEnv,
        databaseName: dbName
      })

      // Verify the wallet was created correctly
      expect(wallet).toBeDefined()
      expect(wallet.wallet).toBeDefined()
      expect(wallet.activeStorage).toBeDefined()

      // Verify the storage is PostgreSQL
      const settings = await wallet.activeStorage.getSettings()
      expect(settings.dbtype).toBe('PostgreSQL')

      // Try basic wallet operation
      const balance = await wallet.wallet.balance()
      expect(balance).toBe(0)

      // Create a basket
      const basketId = await wallet.activeStorage.insertOutputBasket({
        created_at: new Date(),
        updated_at: new Date(),
        basketId: 0,
        userId: wallet.userId,
        name: 'postgres-test-basket',
        numberOfDesiredUTXOs: 10,
        minimumDesiredUTXOValue: 1000,
        isDeleted: false
      })

      expect(basketId).toBeGreaterThan(0)

      // Verify basket was created
      const baskets = await wallet.activeStorage.findOutputBaskets({
        partial: { basketId }
      })

      expect(baskets.length).toBe(1)
      expect(baskets[0].name).toBe('postgres-test-basket')
    } finally {
      // Clean up
      if (wallet) {
        await wallet.wallet.destroy()
      }
    }
  })

  test('Test binary data with wallet transaction operations', async () => {
    let wallet
    try {
      // Generate unique database name to avoid collisions
      const dbName = `wallet_storage_test`

      // Create a compatible env object for Setup.createWalletPostgreSQL
      const walletEnv = {
        chain: env.chain,
        identityKey: env.identityKey,
        identityKey2: env.identityKey2,
        filePath: env.filePath || '',
        taalApiKey: env.taalApiKey,
        devKeys: env.devKeys,
        mySQLConnection: '{}',
        postgresConnection
      }

      wallet = await Setup.createWalletPostgreSQL({
        env: walletEnv,
        databaseName: dbName
      })

      // Create test transaction with binary data
      const now = new Date()
      const testBinaryData = new Array(1000).fill(0).map((_, i) => i % 256)

      const transaction = {
        created_at: now,
        updated_at: now,
        transactionId: 0,
        userId: wallet.userId,
        status: 'nosend' as sdk.TransactionStatus,
        reference: `postgres-binary-ref-${Date.now()}`, // Use unique reference
        isOutgoing: true,
        satoshis: 1000,
        description: 'PostgreSQL binary data test',
        version: 1,
        lockTime: 0,
        txid: `postgres-binary-txid-${Date.now()}`, // Use unique txid
        rawTx: testBinaryData,
        inputBEEF: testBinaryData
      }

      // Insert using transaction
      const transactionId = await wallet.activeStorage.transaction(async trx => {
        return await wallet.activeStorage.insertTransaction(transaction, trx)
      })

      expect(transactionId).toBeGreaterThan(0)

      // Retrieve and verify
      const transactions = await wallet.activeStorage.findTransactions({
        partial: { reference: transaction.reference }
      })

      expect(transactions.length).toBe(1)
      expect(Array.from(transactions[0].rawTx!)).toEqual(testBinaryData)
      expect(Array.from(transactions[0].inputBEEF!)).toEqual(testBinaryData)
    } finally {
      // Clean up
      if (wallet) {
        await wallet.wallet.destroy()
      }
    }
  })
})
