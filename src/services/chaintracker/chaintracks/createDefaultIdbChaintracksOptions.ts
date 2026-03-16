import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { ChaintracksStorageIdb, ChaintracksStorageIdbOptions } from './Storage/ChaintracksStorageIdb'
import { BulkFileDataManager, BulkFileDataManagerOptions } from './util/BulkFileDataManager'
import { configureDefaultIngestors } from './createDefaultChaintracksIngestors'

export function createDefaultIdbChaintracksOptions(
  chain: Chain,
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

  const so: ChaintracksStorageIdbOptions = {
    chain,
    bulkFileDataManager,
    liveHeightThreshold,
    reorgHeightThreshold,
    bulkMigrationChunkSize,
    batchInsertLimit
  }
  const storage = new ChaintracksStorageIdb(so)

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
