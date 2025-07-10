import { Chain } from '../../../../sdk'
import { BulkIngestorCDNBabbage } from '../BulkIngestorCDNBabbage'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { ChaintracksFs } from '../util/ChaintracksFs'
import { HeightRange } from '../util/HeightRange'

const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'
const fs = ChaintracksFs
const fetch = new ChaintracksFetch()

describe('BulkIngestorCDNBabbage tests', () => {
  jest.setTimeout(99999999)

  test('0 mainNet', async () => {
    const { cdn, r } = await testUpdateLocalCache('main')
    expect(cdn.bulkFiles?.files.length).toBeGreaterThan(8)
    expect(r.liveHeaders).toBeUndefined()
    expect(r.reader.range.minHeight).toBe(0)
    expect(r.reader.range.maxHeight).toBeGreaterThan(800000)
  })

  test('1 testNet', async () => {
    const { cdn, r } = await testUpdateLocalCache('test')
    expect(cdn.bulkFiles?.files.length).toBeGreaterThan(15)
    expect(r.liveHeaders).toBeUndefined()
    expect(r.reader.range.minHeight).toBe(0)
    expect(r.reader.range.maxHeight).toBeGreaterThan(1500000)
  })
})

async function testUpdateLocalCache(chain: Chain) {
  const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(
    chain,
    fs,
    fetch,
    `${rootFolder}/bulk_cdn`
  )

  const cdn = new BulkIngestorCDNBabbage(bulkCDNOptions)
  const r = await cdn.updateLocalCache(new HeightRange(0, 9900000), 900000)
  return { cdn, r }
}
