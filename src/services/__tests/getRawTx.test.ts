import { _tu } from '../../../test/utils/TestUtilsWalletStorage'
import { Services } from '../../index.client'

describe('getRawTx service tests', () => {
  jest.setTimeout(99999999)

  test('0', async () => {
    if (_tu.noEnv('test')) return
    const options = Services.createDefaultOptions('test')
    const services = new Services(options)

    const r = await services.getRawTx('c3b6ee8b83a4261771ede9b0d2590d2f65853239ee34f84cdda36524ce317d76')
    expect(r).toBeTruthy()
  })
})
