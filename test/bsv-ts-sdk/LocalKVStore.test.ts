import { _tu, logger, TestWalletNoSetup } from '../utils/TestUtilsWalletStorage'
import { LocalKVStore } from '@bsv/sdk'

const includeTestChaintracks = false

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
    if (!includeTestChaintracks) return
    for (const { storage, wallet } of ctxs) {
      const kvStore = new LocalKVStore(wallet, context, false, undefined, true)
      await kvStore.set(key1, 'value1')
      const value = await kvStore.get(key1)
      expect(value).toBe('value1')
    }
  })

  test('3 set x 4 get', async () => {
    if (!includeTestChaintracks) return
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

  test('4 promise test', async () => {
    jest.useFakeTimers()
    let resolveNewLock: () => void = () => {}
    const newLock = new Promise<void>(resolve => {
      resolveNewLock = resolve
    })
    const t = Date.now()
    setTimeout(() => {
      resolveNewLock()
    }, 1000)
    jest.advanceTimersByTime(1000)
    await newLock
    const elapsed = Date.now() - t
    logger(`Elapsed time: ${elapsed} ms`)
    expect(elapsed).toBeGreaterThanOrEqual(1000)
    jest.useRealTimers()
  })

  test('5 set x 4 get set x 4 get', async () => {
    if (!includeTestChaintracks) return
    for (const { storage, wallet } of ctxs) {
      const kvStore = new LocalKVStore(wallet, context, false, undefined, true)
      let v4: string | undefined
      async function captureValue(): Promise<void> {
        v4 = await kvStore.get(key1)
      }
      const promises = [
        kvStore.set(key1, 'value1'),
        kvStore.set(key1, 'value2'),
        kvStore.set(key1, 'value3'),
        kvStore.set(key1, 'value4'),
        captureValue(),
        kvStore.set(key1, 'value5'),
        kvStore.set(key1, 'value6'),
        kvStore.set(key1, 'value7'),
        kvStore.set(key1, 'value8')
      ]
      await Promise.all(promises)
      const v8 = await kvStore.get(key1)
      expect(v4).toBe('value4')
      expect(v8).toBe('value8')
    }
  })
})
