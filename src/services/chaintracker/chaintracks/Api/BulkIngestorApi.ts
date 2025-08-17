import { Chain } from '../../../../sdk/types'
import { HeightRange, HeightRanges } from '../util/HeightRange'
import { BlockHeader } from './BlockHeaderApi'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'

export interface BulkIngestorBaseOptions {
  /**
   * The target chain: "main" or "test"
   */
  chain: Chain

  /**
   * Required.
   *
   * The name of the JSON resource to request from CDN which describes currently
   * available bulk block header resources.
   */
  jsonFilename: string | undefined

  /**
   * If true, and the bulk ingestor supports it, bypass the live database
   * up to `liveHeightThreshold` of available headers remaining.
   */
  bypassLiveEnabled: boolean
}

export interface BulkIngestorApi {
  /**
   * Close and release all resources.
   */
  shutdown(): Promise<void>

  /**
   * If the bulk ingestor is capable, return the approximate
   * present height of the actual chain being tracked.
   * Otherwise, return undefined.
   *
   * May not assume that setStorage has been called.
   */
  getPresentHeight(): Promise<number | undefined>

  /**
   * A BulkIngestor fetches and updates storage with bulk headers in bulkRange.
   *
   * If it can, it must also fetch live headers in fetch range that are not in bulkRange and return them as an array.
   *
   * The storage methods `insertBulkFile`, `updateBulkFile`, and `addBulkHeaders` should be used to add bulk headers to storage.
   *
   * @param before bulk and live range of headers before ingesting any new headers.
   * @param fetchRange range of headers still needed, includes both missing bulk and live headers.
   * @param bulkRange range of bulk headers still needed
   * @param priorLiveHeaders any headers accumulated by prior bulk ingestor(s) that are too recent for bulk storage.
   * @returns new live headers: headers in fetchRange but not in bulkRange
   */
  fetchHeaders(
    before: HeightRanges,
    fetchRange: HeightRange,
    bulkRange: HeightRange,
    priorLiveHeaders: BlockHeader[]
  ): Promise<BlockHeader[]>

  /**
   * A BulkIngestor has two potential goals:
   * 1. To source missing bulk headers and include them in bulk storage.
   * 2. To source missing live headers to be forwarded to live storage.
   *
   * @param presentHeight current height of the active chain tip, may lag the true value.
   * @param before current bulk and live storage height ranges, either may be empty.
   * @param priorLiveHeaders any headers accumulated by prior bulk ingestor(s) that are too recent for bulk storage.
   * @returns updated priorLiveHeaders including any accumulated by this ingestor
   */
  synchronize(presentHeight: number, before: HeightRanges, priorLiveHeaders: BlockHeader[]): Promise<BulkSyncResult>

  /**
   * Called before first Synchronize with reference to storage.
   * Components requiring asynchronous setup can override base class implementation.
   * @param storage
   */
  setStorage(storage: ChaintracksStorageApi): Promise<void>

  storage(): ChaintracksStorageApi
}

export interface BulkSyncResult {
  liveHeaders: BlockHeader[]
  liveRange: HeightRange
  done: boolean
  log: string
}
