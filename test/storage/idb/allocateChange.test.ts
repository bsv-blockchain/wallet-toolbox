import { _tu, logger, TestSetup1 } from '../../utils/TestUtilsWalletStorage'
import {
  randomBytesBase64,
  randomBytesHex,
  sdk,
  StorageProvider,
  StorageProviderOptions,
  TableCommission,
  TableOutput,
  TableTransaction
} from '../../../src/index.client'
import { StorageIdb } from '../../../src/storage/StorageIdb'

import 'fake-indexeddb/auto'
import { openDB } from 'idb'

describe('idb transactionAbort tests', () => {
  jest.setTimeout(99999999)

  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)
  let setups: { setup: TestSetup2; storage: StorageProvider }[] = []

  beforeEach(async () => {
    const options: StorageProviderOptions = StorageProvider.createStorageBaseOptions(chain)
    const storage = new StorageIdb(options)
    await storage.dropAllData()
    await storage.migrate('idb find tests', '1'.repeat(64))
    await storage.makeAvailable()
    const setup1 = await _tu.createTestSetup1(storage)
    const u1tx2 = (await _tu.insertTestTransaction(storage, setup1.u1, false, { status: 'completed' })).tx
    const setup2: TestSetup2 = {
      ...setup1,
      u1tx2,
      u1tx2o0: await _tu.insertTestOutput(storage, u1tx2, 0, 3, setup1.u1basket1),
      u1tx2o1: await _tu.insertTestOutput(storage, u1tx2, 1, 13, setup1.u1basket1),
      u1tx2o2: await _tu.insertTestOutput(storage, u1tx2, 2, 113, setup1.u1basket1),
      u1tx2o3: await _tu.insertTestOutput(storage, u1tx2, 3, 1113, setup1.u1basket1),
      u1tx2o4: await _tu.insertTestOutput(storage, u1tx2, 4, 11113, setup1.u1basket1),
      u1tx2o5: await _tu.insertTestOutput(storage, u1tx2, 5, 111113, setup1.u1basket1),
      u1tx2o6: await _tu.insertTestOutput(storage, u1tx2, 6, 1111113, setup1.u1basket1),
      u1tx2o7: await _tu.insertTestOutput(storage, u1tx2, 7, 11111113, setup1.u1basket1),
      u1tx2o8: await _tu.insertTestOutput(storage, u1tx2, 8, 111111113, setup1.u1basket1),
      u1tx3: (await _tu.insertTestTransaction(storage, setup1.u1, false, { status: 'completed' })).tx,
      u1tx4: (await _tu.insertTestTransaction(storage, setup1.u1, false, { status: 'unproven' })).tx,
      u1tx5: (await _tu.insertTestTransaction(storage, setup1.u1, false, { status: 'sending' })).tx
    }
    setups = [{ setup: setup2, storage }]
  })

  afterEach(async () => {
    for (const { storage } of setups) {
      await storage.destroy()
    }
  })

  test('0 basket with no outputs', async () => {
    for (const { storage, setup } of setups) {
      const r = await storage.allocateChangeInput(setup.u1.userId, 42, 11113, 11113, true, setup.u1tx3.transactionId)
      expect(r).toBeUndefined()
    }
  })

  test('1 exactSatoshis', async () => {
    for (const { storage, setup } of setups) {
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        11113,
        true,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o4.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        11113,
        true,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o5.outputId)
    }
  })

  test('2 targetSatoshis exact', async () => {
    for (const { storage, setup } of setups) {
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o4.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o5.outputId)
    }
  })

  test('2a targetSatoshis exact unproven', async () => {
    for (const { storage, setup } of setups) {
      await storage.updateTransaction(setup.u1tx2.transactionId, { status: 'unproven' })
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o4.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o5.outputId)
    }
  })

  test('2b targetSatoshis exact sending', async () => {
    for (const { storage, setup } of setups) {
      await storage.updateTransaction(setup.u1tx2.transactionId, { status: 'sending' })
      const r3 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r3).toBeUndefined()
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        false,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o4.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11113,
        undefined,
        false,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o5.outputId)
    }
  })

  test('3 targetSatoshis high', async () => {
    for (const { storage, setup } of setups) {
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11114,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o5.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11114,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o6.outputId)
    }
  })

  test('4 targetSatoshis low', async () => {
    for (const { storage, setup } of setups) {
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11112,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o4.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        11112,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o5.outputId)
    }
  })

  test('5 targetSatoshis above max', async () => {
    for (const { storage, setup } of setups) {
      const r = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        111111114,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r?.outputId).toBe(setup.u1tx2o8.outputId)
      const r2 = await storage.allocateChangeInput(
        setup.u1.userId,
        setup.u1basket1.basketId,
        111111114,
        undefined,
        true,
        setup.u1tx3.transactionId
      )
      expect(r2?.outputId).toBe(setup.u1tx2o7.outputId)
    }
  })
})

interface TestSetup2 extends TestSetup1 {
  u1tx2: TableTransaction
  u1tx2o0: TableOutput
  u1tx2o1: TableOutput
  u1tx2o2: TableOutput
  u1tx2o3: TableOutput
  u1tx2o4: TableOutput
  u1tx2o5: TableOutput
  u1tx2o6: TableOutput
  u1tx2o7: TableOutput
  u1tx2o8: TableOutput
  u1tx3: TableTransaction
  u1tx4: TableTransaction
  u1tx5: TableTransaction
}
