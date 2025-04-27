import { ListActionsArgs } from '@bsv/sdk'
import { _tu, logger } from '../../utils/TestUtilsWalletStorage'

import 'fake-indexeddb/auto'

describe('idbSpeed tests', () => {
  jest.setTimeout(99999999)

  const testName = () => expect.getState().currentTestName || 'test'

  /**
   * Starting speed 2025-04-18 07:58 was 66+ seconds
   */
  test('0 copy legacy wallet', async () => {
    const databaseName = testName()
    const setup = await _tu.createIdbLegacyWalletCopy(databaseName)
    expect(setup.activeStorage).toBeTruthy()

    const stats = _tu.wrapProfiling(setup.activeStorage, 'StorageIdb')

    const args: ListActionsArgs = {
      includeLabels: true,
      labels: ['babbage_protocol_perm']
    }
    const r = await setup.wallet.listActions(args)
    expect(r.actions.length).toBe(args.limit || 10)

    let log = 'function,count,totalMsecs,avgMsecs\n'
    for (const [key, value] of Object.entries(stats)) {
      log += `${key},${value.count},${value.totalMsecs},${value.totalMsecs / value.count}\n`
    }
    logger(log)

    await setup.wallet.destroy()
  })
})
