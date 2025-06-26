import { _tu, logger, TestWalletNoSetup } from '../utils/TestUtilsWalletStorage'
import { LocalKVStore } from '@bsv/sdk'

describe('LocalKVStore tests', () => {
  jest.setTimeout(99999999)

  const testName = () => expect.getState().currentTestName || 'test'
  let ctxs: TestWalletNoSetup[] = []
  const context = 'test kv store'
  const key1 = 'key1'
  const key2 = 'key2'

  beforeEach(async () => {
    ctxs = [await _tu.createLegacyWalletSQLiteCopy(`${testName()}`)]
  })

  afterEach(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 get non-existent', async () => {
    for (const { storage, wallet } of ctxs) {
      const kvStore = new LocalKVStore(wallet, context, false, undefined, true)
      const value = await kvStore.get(key1)
      expect(value).toBeUndefined()
    }
  })

  test('1 set get', async () => {
    for (const { storage, wallet } of ctxs) {
      const kvStore = new LocalKVStore(wallet, context, false, undefined, true)
      await kvStore.set(key1, 'value1')
      const value = await kvStore.get(key1)
      expect(value).toBe('value1')
    }
  })

  test('3 set x 4 get', async () => {
    for (const { storage, wallet } of ctxs) {
      const kvStore = new LocalKVStore(wallet, context, false, undefined, true)
      const promises = [
        kvStore.set(key1, 'value1'),
        kvStore.set(key1, 'value2'),
        kvStore.set(key1, 'value3'),
        kvStore.set(key1, 'value4')
      ]
      await Promise.all(promises)
      const value = await kvStore.get(key1)
      expect(value).toBe('value4')
    }
  })
})