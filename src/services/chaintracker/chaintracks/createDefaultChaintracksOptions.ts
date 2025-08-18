import { Knex, knex as makeKnex } from 'knex'
import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { Chaintracks } from './Chaintracks'
import { ChaintracksFs } from './util/ChaintracksFs'
import { ChaintracksStorageKnex } from './Storage'
import { BulkIngestorCDNBabbage } from './BulkIngestorCDNBabbage'
import { BulkIngestorWhatsOnChainWs } from './Ingest/BulkIngestorWhatsOnChainWs'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { LiveIngestorWhatsOnChainWs } from './Ingest'
import { LiveIngestorWhatsOnChainPoll } from './Ingest/LiveIngestorWhatsOnChainPoll'

/**
 *
 * @param chain
 * @param rootFolder defaults to "./data/"
 * @returns
 */
export function createDefaultChaintracksOptions(
  chain: Chain,
  rootFolder?: string,
  knexConfig?: Knex.Config
): ChaintracksOptions {
  if (!rootFolder) rootFolder = './data/'

  const options = Chaintracks.createOptions(chain)

  const fs = ChaintracksFs
  const fetch = new ChaintracksFetch()

  const localSqlite: Knex.Config = {
    client: 'sqlite3',
    connection: { filename: fs.pathJoin(rootFolder, `${chain}Net_chaintracks.sqlite`) },
    useNullAsDefault: true
  }

  const knexInstance = makeKnex(knexConfig || localSqlite)

  const knexOptions = ChaintracksStorageKnex.createStorageKnexOptions(chain)
  knexOptions.knex = knexInstance
  options.storageEngine = new ChaintracksStorageKnex(knexOptions)

  const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(chain, fetch)
  options.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCDNOptions))

  const bulkWhatsOnChainOptions = BulkIngestorWhatsOnChainWs.createBulkIngestorWhatsOnChainOptions(chain)
  options.bulkIngestors.push(new BulkIngestorWhatsOnChainWs(bulkWhatsOnChainOptions))

  const liveWhatsOnChainOptions = LiveIngestorWhatsOnChainWs.createLiveIngestorWhatsOnChainOptions(chain)
  options.liveIngestors.push(new LiveIngestorWhatsOnChainWs(liveWhatsOnChainOptions))
  options.liveIngestors.push(new LiveIngestorWhatsOnChainPoll(liveWhatsOnChainOptions))

  return options
}
