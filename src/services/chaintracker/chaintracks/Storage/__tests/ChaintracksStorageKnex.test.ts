import { Knex, knex as makeKnex } from 'knex'
import { ChaintracksFs } from '../../util/ChaintracksFs'
import { Chain } from '../../../../../sdk'
import { ChaintracksStorageKnex } from '../ChaintracksStorageKnex'
import { deserializeBaseBlockHeader, genesisHeader } from '../../util/blockHeaderUtilities'

describe('ChaintracksStorageKnex tests', () => {
  jest.setTimeout(99999999)

  test('0', async () => {
    const chain: Chain = 'main'
    const fs = ChaintracksFs
    const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'
    const localSqlite: Knex.Config = {
      client: 'sqlite3',
      connection: { filename: fs.pathJoin(rootFolder, `${chain}Net_chaintracks.sqlite`) },
      useNullAsDefault: true
    }

    const knexInstance = makeKnex(localSqlite)

    const knexOptions = ChaintracksStorageKnex.createStorageKnexOptions(chain)
    knexOptions.knex = knexInstance
    const storage = new ChaintracksStorageKnex(knexOptions)
    await storage.makeAvailable()

    const bfs = await storage.bulkManager.getBulkFiles()
    // Test assumes synchronization has occurred and bulk files are available.
    if (bfs?.length === 0) return

    expect(bfs.length).toBeGreaterThan(7)

    const gh = await storage.getBulkFileData(bfs[0].fileId!, 0, 80)
    const dgh = deserializeBaseBlockHeader(gh!)
    const rgh = genesisHeader(chain)
    expect(dgh.merkleRoot).toEqual(rgh.merkleRoot)
    expect(dgh.bits).toEqual(rgh.bits)
    expect(dgh.nonce).toEqual(rgh.nonce)

    const header = await storage.findHeaderForHeight(101010)
    expect(header.hash).toEqual('000000000001af33247fff33aae7c31baee4148d5a189e7353bf13bcee618202')

    await storage.shutdown()
  })
})
