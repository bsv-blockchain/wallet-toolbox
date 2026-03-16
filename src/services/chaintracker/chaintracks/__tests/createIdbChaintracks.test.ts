import { _tu } from '../../../../../test/utils/TestUtilsWalletStorage'
import { wait } from '../../../../utility/utilityHelpers'
import { createIdbChaintracks } from '../createIdbChaintracks'
import { BulkFileDataManager } from '../util/BulkFileDataManager'
import { BulkHeaderFileInfo } from '../util/BulkHeaderFile'
import { HeaderListener } from '../Api/ChaintracksClientApi'
import { Chain } from '../../../../sdk/types'
import { BlockHeader } from '../Api/BlockHeaderApi'

import 'fake-indexeddb/auto'

describe('createIdbChaintracks tests', () => {
  jest.setTimeout(99999999)

  let logSpy: jest.SpyInstance,
    capturedLogs: string[] = []
  beforeAll(async () => {
    logSpy = jest.spyOn(console, 'log').mockImplementation((...args: any[]) => {
      capturedLogs.push(args.map(String).join(' '))
    })
  })

  test.skip('0 - manual test, runs over two minutes', async () => {
    const target: Chain = 'main'
    if (_tu.noEnv(target)) return

    const env = _tu.getEnv(target)
    const { chain, chaintracks, storage, available } = await createIdbChaintracks(env.chain, env.whatsonchainApiKey)
    await available
    const headerListener: HeaderListener = (header: BlockHeader) => {
      console.log(`headerListener: height: ${header.height} hash: ${header.hash} ${new Date().toISOString()}`)
    }
    chaintracks.subscribeHeaders(headerListener)
    expect(countDatas(storage.bulkManager)).toBeLessThanOrEqual(3)

    const tipHash = await chaintracks.findChainTipHash()
    const tip = await chaintracks.findChainTipHeader()
    chaintracks.log(`tip: height: ${tip.height} hash: ${tip.hash}`)
    expect(tip.hash).toBe(tipHash)

    const forHash = await chaintracks.findHeaderForBlockHash(tip.hash)
    expect(forHash?.hash).toBe(tip.hash)

    const forHashLive = await chaintracks.findLiveHeaderForBlockHash(tip.hash)
    expect(forHashLive?.hash).toBe(tip.hash)

    const chainwork = await chaintracks.findChainWorkForBlockHash(tip.hash)
    expect(forHashLive?.chainWork).toBe(chainwork)

    const forHeight = await chaintracks.findHeaderForHeight(tip.height)
    expect(forHeight?.hash).toBe(tip.hash)

    const listening = await chaintracks.isListening()
    expect(listening).toBe(true)

    //    console.log('validating...')
    //    const validated = await chaintracks.validate()
    //    expect(validated).toBe(true)
    //    console.log('validated')

    for (;;) await wait(120000)
  })
})

function countDatas(manager: BulkFileDataManager): number {
  let count = 0
  for (const file of manager['bfds'] as BulkHeaderFileInfo[]) {
    if (file.data) count += 1
  }
  return count
}
