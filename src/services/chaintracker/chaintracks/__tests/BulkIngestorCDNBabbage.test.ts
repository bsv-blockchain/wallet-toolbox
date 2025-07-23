import { Knex, knex as makeKnex } from 'knex'
import { Chain } from '../../../../sdk'
import { BulkIngestorCDNBabbage } from '../BulkIngestorCDNBabbage'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { ChaintracksFs } from '../util/ChaintracksFs'
import { HeightRange } from '../util/HeightRange'
import { ChaintracksStorageKnex } from '../Storage'
import { BulkFilesReaderStorage } from '../util/BulkFilesReader'

const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'
const fs = ChaintracksFs
const fetch = new ChaintracksFetch()

describe('BulkIngestorCDNBabbage tests', () => {
  jest.setTimeout(99999999)

  test('0 mainNet', async () => {
    const { cdn, r } = await testUpdateLocalCache('main')
    expect(cdn.availableBulkFiles?.files.length).toBeGreaterThan(8)
    expect(r.liveHeaders.length).toBe(0)
    expect(r.reader.range.minHeight).toBe(0)
    expect(r.reader.range.maxHeight).toBeGreaterThan(800000)
  })

  test('1 testNet', async () => {
    const { cdn, r } = await testUpdateLocalCache('test')
    expect(cdn.availableBulkFiles?.files.length).toBeGreaterThan(15)
    expect(r.liveHeaders.length).toBe(0)
    expect(r.reader.range.minHeight).toBe(0)
    expect(r.reader.range.maxHeight).toBeGreaterThan(1500000)
  })
})

async function testUpdateLocalCache(chain: Chain) {
  const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(
    chain,
    fetch,
  )

  const cdn = new BulkIngestorCDNBabbage(bulkCDNOptions)

  const localSqlite: Knex.Config = {
    client: 'sqlite3',
    connection: { filename: fs.pathJoin(rootFolder, `${chain}Net_chaintracks.sqlite`) },
    useNullAsDefault: true
  }
  const knexOptions = ChaintracksStorageKnex.createStorageKnexOptions(chain, makeKnex(localSqlite))
  const storage = new ChaintracksStorageKnex(knexOptions)
  const before = await storage.getAvailableHeightRanges()
  await cdn.setStorage(storage)

  const range = new HeightRange(0, 9900000)
  const liveHeaders = await cdn.fetchHeaders(before, range, range, [])
  const reader = await BulkFilesReaderStorage.fromStorage(storage, fetch, range)
  await storage.knex.destroy()
  return { cdn, r: { reader, liveHeaders } }
}
