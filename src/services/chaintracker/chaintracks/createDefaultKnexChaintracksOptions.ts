import { Knex, knex as makeKnex } from 'knex'
import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { ChaintracksFs } from './util/ChaintracksFs'
import { ChaintracksStorageKnex, ChaintracksStorageKnexOptions } from './Storage/ChaintracksStorageKnex'
import { BulkIngestorCDNBabbage } from './Ingest/BulkIngestorCDNBabbage'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { LiveIngestorWhatsOnChainOptions, LiveIngestorWhatsOnChainPoll } from './Ingest/LiveIngestorWhatsOnChainPoll'
import { BulkIngestorWhatsOnChainCdn, BulkIngestorWhatsOnChainOptions } from './Ingest/BulkIngestorWhatsOnChainCdn'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { BulkFileDataManager, BulkFileDataManagerOptions } from './util/BulkFileDataManager'
import { BulkIngestorCDNOptions } from './Ingest/BulkIngestorCDN'
import { WhatsOnChainServicesOptions } from './Ingest/WhatsOnChainServices'

/**
 *
 * @param chain
 * @param rootFolder defaults to "./data/"
 * @returns
 */
export function createDefaultKnexChaintracksOptions(
  chain: Chain,
  rootFolder: string = './data/',
  knexConfig?: Knex.Config,
  whatsonchainApiKey: string = '',
  maxPerFile: number = 100000,
  maxRetained: number = 2,
  fetch?: ChaintracksFetchApi,
  cdnUrl: string = 'https://cdn.projectbabbage.com/blockheaders/',
  liveHeightThreshold: number = 2000,
  reorgHeightThreshold: number = 400,
  bulkMigrationChunkSize: number = 500,
  batchInsertLimit: number = 400,
  addLiveRecursionLimit: number = 36
): ChaintracksOptions {
  fetch ||= new ChaintracksFetch()

  const bfo: BulkFileDataManagerOptions = {
    chain,
    fetch,
    maxPerFile,
    maxRetained,
    fromKnownSourceUrl: cdnUrl
  }
  const bulkFileDataManager = new BulkFileDataManager(bfo)

  if (!knexConfig) {
    knexConfig = {
      client: 'better-sqlite3',
      connection: { filename: ChaintracksFs.pathJoin(rootFolder, `${chain}Net_chaintracks.sqlite`) },
      useNullAsDefault: true
    }
  }
  const knexInstance = makeKnex(knexConfig)

  const so: ChaintracksStorageKnexOptions = {
    chain,
    knex: knexInstance,
    bulkFileDataManager,
    liveHeightThreshold,
    reorgHeightThreshold,
    bulkMigrationChunkSize,
    batchInsertLimit
  }
  const storage = new ChaintracksStorageKnex(so)

  const co: ChaintracksOptions = {
    chain,
    storage,
    bulkIngestors: [],
    liveIngestors: [],
    addLiveRecursionLimit,
    logging: (...args) => console.log(new Date().toISOString(), ...args),
    readonly: false
  }

  const jsonResource = `${chain}NetBlockHeaders.json`

  const bulkCdnOptions: BulkIngestorCDNOptions = {
    chain,
    jsonResource,
    fetch,
    cdnUrl,
    maxPerFile
  }
  co.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCdnOptions))

  const wocOptions: WhatsOnChainServicesOptions = {
    chain,
    apiKey: whatsonchainApiKey,
    timeout: 30000,
    userAgent: 'BabbageWhatsOnChainServices',
    enableCache: true,
    chainInfoMsecs: 5000
  }

  const bulkOptions: BulkIngestorWhatsOnChainOptions = {
    ...wocOptions,
    jsonResource,
    idleWait: 5000
  }
  co.bulkIngestors.push(new BulkIngestorWhatsOnChainCdn(bulkOptions))

  const liveOptions: LiveIngestorWhatsOnChainOptions = {
    ...wocOptions,
    idleWait: 100000
  }
  co.liveIngestors.push(new LiveIngestorWhatsOnChainPoll(liveOptions))

  return co
}
