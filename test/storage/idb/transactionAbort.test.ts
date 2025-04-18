import { _tu, logger } from '../../utils/TestUtilsWalletStorage'
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

describe('idb transactionAbort tests', () => {
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

  test('0 unaborted case', async () => {
    for (const storage of storages) {
      let aborted = false
      let count = await storage.countProvenTxs({ partial: {} })
      expect(count).toBe(0)
      try {
        const r = await storage.transaction(async tx => {
          const r12 = await _tu.insertTestProvenTx(storage, '12'.repeat(32), tx)
          const r23 = await _tu.insertTestProvenTx(storage, '23'.repeat(32), tx)
          //tx['abort']()
          return [r12.provenTxId, r23.provenTxId]
        })
        expect(r).toEqual([1, 2])
      } catch (e) {
        aborted = true
        logger('Transaction aborted', e?.['name'])
      }
      expect(aborted).toBe(false)
      count = await storage.countProvenTxs({ partial: {} })
      expect(count).toBe(2)
    }
  })

  test('1 call abort case', async () => {
    for (const storage of storages) {
      let aborted = false
      let count = await storage.countProvenTxs({ partial: {} })
      expect(count).toBe(0)
      try {
        const r = await storage.transaction(async tx => {
          const r12 = await _tu.insertTestProvenTx(storage, '12'.repeat(32), tx)
          const r23 = await _tu.insertTestProvenTx(storage, '23'.repeat(32), tx)
          tx['abort']()
          return [r12.provenTxId, r23.provenTxId]
        })
        expect(r).toEqual([1, 2])
      } catch (e) {
        aborted = true
        logger('Transaction aborted', e?.['name'])
      }
      expect(aborted).toBe(true)
      count = await storage.countProvenTxs({ partial: {} })
      expect(count).toBe(0)
    }
  })

  test('2 throw error case', async () => {
    for (const storage of storages) {
      let aborted = false
      let count = await storage.countProvenTxs({ partial: {} })
      expect(count).toBe(0)
      try {
        const r = await storage.transaction(async tx => {
          const r12 = await _tu.insertTestProvenTx(storage, '12'.repeat(32), tx)
          const r23 = await _tu.insertTestProvenTx(storage, '23'.repeat(32), tx)
          throw new Error('Test error')
          return [r12.provenTxId, r23.provenTxId]
        })
        expect(r).toEqual([1, 2])
      } catch (e) {
        aborted = true
        logger('Transaction aborted', e?.['name'])
      }
      expect(aborted).toBe(true)
      count = await storage.countProvenTxs({ partial: {} })
      expect(count).toBe(0)
    }
  })
})
