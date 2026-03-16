import { Knex, knex as makeKnex } from 'knex'
import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { ChaintracksFs } from './util/ChaintracksFs'
import { ChaintracksStorageKnex, ChaintracksStorageKnexOptions } from './Storage/ChaintracksStorageKnex'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { BulkFileDataManager, BulkFileDataManagerOptions } from './util/BulkFileDataManager'
import { configureDefaultIngestors } from './createDefaultChaintracksIngestors'

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

  configureDefaultIngestors(co, chain, fetch, whatsonchainApiKey, cdnUrl, maxPerFile)

  return co
}
