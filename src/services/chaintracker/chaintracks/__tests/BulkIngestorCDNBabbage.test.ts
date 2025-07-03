import { Chain } from '../../../../sdk'
import { BulkIngestorCDNBabbage } from '../BulkIngestorCDNBabbage'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { ChaintracksFs } from '../util/ChaintracksFs'
import { HeightRange } from '../util/HeightRange'

describe('BulkIngestorCDNBabbage tests', () => {
  jest.setTimeout(99999999)

  test('0 ', async () => {
    const chain: Chain = 'test'
    const fs = ChaintracksFs
    const fetch = new ChaintracksFetch()
    const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'
    const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(
      chain,
      fs,
      fetch,
      `${rootFolder}/bulk_cdn/`
    )
    const cdn = new BulkIngestorCDNBabbage(bulkCDNOptions)
    const r = await cdn.updateLocalCache(new HeightRange(0, 900000), 900000)
    expect(true).toBe(true)
  })
})
