import { Knex, knex as makeKnex } from 'knex'
import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { Chaintracks } from './Chaintracks'
import { ChaintracksFs } from './util/ChaintracksFs'
import { ChaintracksStorageKnex } from './Storage'
import { BulkIngestorCDNBabbage } from './BulkIngestorCDNBabbage'
import { BulkIngestorWhatsOnChain } from './Ingest/BulkIngestorWhatsOnChain'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { LiveIngestorWhatsOnChain } from './Ingest'

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

  const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(
    chain,
    fetch,
  )
  options.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCDNOptions))

  const bulkWhatsOnChainOptions = BulkIngestorWhatsOnChain.createBulkIngestorWhatsOnChainOptions(
    chain,
  )
  options.bulkIngestors.push(new BulkIngestorWhatsOnChain(bulkWhatsOnChainOptions))

  const liveWhatsOnChainOptions = LiveIngestorWhatsOnChain.createLiveIngestorWhatsOnChainOptions(chain)
  options.liveIngestors.push(new LiveIngestorWhatsOnChain(liveWhatsOnChainOptions))

  return options
}
