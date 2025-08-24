import { Knex, knex as makeKnex } from 'knex'
import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { Chaintracks } from './Chaintracks'
import { ChaintracksFs } from './util/ChaintracksFs'
import { ChaintracksStorageKnex } from './Storage/ChaintracksStorageKnex'
import { BulkIngestorCDNBabbage } from './Ingest/BulkIngestorCDNBabbage'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { LiveIngestorWhatsOnChainPoll } from './Ingest/LiveIngestorWhatsOnChainPoll'
import { BulkIngestorWhatsOnChainCdn } from './Ingest/BulkIngestorWhatsOnChainCdn'

/**
 *
 * @param chain
 * @param rootFolder defaults to "./data/"
 * @returns
 */
export function createDefaultKnexChaintracksOptions(
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
  options.storage = new ChaintracksStorageKnex(knexOptions)

  const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(chain, fetch)
  options.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCDNOptions))

  const bulkWhatsOnChainOptions = BulkIngestorWhatsOnChainCdn.createBulkIngestorWhatsOnChainOptions(chain)
  options.bulkIngestors.push(new BulkIngestorWhatsOnChainCdn(bulkWhatsOnChainOptions))

  const liveWhatsOnChainOptions = LiveIngestorWhatsOnChainPoll.createLiveIngestorWhatsOnChainOptions(chain)
  options.liveIngestors.push(new LiveIngestorWhatsOnChainPoll(liveWhatsOnChainOptions))

  return options
}
