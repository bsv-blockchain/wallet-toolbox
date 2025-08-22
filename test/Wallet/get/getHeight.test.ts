import { _tu, expectToThrowWERR } from '../../utils/TestUtilsWalletStorage'
import { sdk } from '../../../src/index.client'

const includeTestChaintracks = false

describe('getHeight tests', () => {
  jest.setTimeout(99999999)

  const ctxs: any[] = []
  const env = _tu.getEnv('test')

  beforeAll(async () => {
    if (includeTestChaintracks) {
      ctxs.push(await _tu.createSQLiteTestWallet({ databaseName: 'getHeightTestsSQLite' }))
      if (env.runMySQL) {
        ctxs.push(await _tu.createMySQLTestWallet({ databaseName: 'getHeightTestsMySQL' }))
      }
    }
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 valid height', async () => {
    for (const { wallet } of ctxs) {
      const result = await wallet.getHeight({})

      // Validate the height (assuming it's a positive integer)
      expect(result).toHaveProperty('height')
      expect(result.height).toBeGreaterThan(0)
    }
  })

  test('1 handles errors from services gracefully', async () => {
    for (const { wallet } of ctxs) {
      try {
        // Trigger an invalid scenario that should throw an error
        await wallet.getHeight({ invalidParam: true })
      } catch (e) {
        // Narrow the type of 'e' to 'Error'
        if (e instanceof Error) {
          expect(e.message).toContain('invalid')
        } else {
          throw new Error('Unexpected error type thrown')
        }
      }
    }
  })
})
