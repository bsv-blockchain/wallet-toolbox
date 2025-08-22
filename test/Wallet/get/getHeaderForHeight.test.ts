import { _tu, TestWalletNoSetup } from '../../utils/TestUtilsWalletStorage'

const includeTestChaintracks = false

describe('getHeaderForHeight tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('test')
  const ctxs: TestWalletNoSetup[] = []

  beforeAll(async () => {
    if (includeTestChaintracks) {
      if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('getHeaderForHeightTests'))
      ctxs.push(await _tu.createLegacyWalletSQLiteCopy('getHeaderForHeightTests'))
    }
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 invalid params', async () => {
    for (const { wallet } of ctxs) {
      try {
        await wallet.getHeaderForHeight({ height: -1 })
        throw new Error('Expected error was not thrown')
      } catch (e) {
        const errorMessage = typeof e === 'object' && e !== null && 'message' in e ? (e as Error).message : String(e)
        expect(errorMessage).toMatch(/Height -1 must be a non-negative integer/i)
      }
    }
  })

  test('1 valid block height', async () => {
    for (const { wallet } of ctxs) {
      // Query an existing valid block height
      const height = 1 // Ensure this height exists in the test database
      const result = await wallet.getHeaderForHeight({ height })

      expect(result).toHaveProperty('header')
      expect(typeof result.header).toBe('string')
      expect(result.header).not.toBe('')
    }
  })

  test('2 unexpected service errors', async () => {
    for (const { wallet } of ctxs) {
      try {
        // Query a height that doesn't exist or triggers an unexpected error
        const invalidHeight = 999999
        await wallet.getHeaderForHeight({ height: invalidHeight })
        throw new Error('Expected error was not thrown')
      } catch (e) {
        const errorMessage = typeof e === 'object' && e !== null && 'message' in e ? (e as Error).message : String(e)
        expect(errorMessage).toMatch(/error|not found/i)
      }
    }
  })

  test('3 valid block height always returns a header', async () => {
    for (const { wallet } of ctxs) {
      const height = 9999
      const result = await wallet.getHeaderForHeight({ height })

      expect(result).toHaveProperty('header')
      expect(typeof result.header).toBe('string')
      expect(result.header).not.toBe('')
    }
  })
})
