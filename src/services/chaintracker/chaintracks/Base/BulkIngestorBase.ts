import { BulkIngestorApi, BulkIngestorBaseOptions, BulkSyncResult } from '../Api/BulkIngestorApi'
import { ChaintracksStorageApi } from '../Api/ChaintracksStorageApi'

import { BulkHeaderFilesInfo } from '../util/BulkHeaderFile'
import { HeightRange, HeightRanges } from '../util/HeightRange'
import { Chain } from '../../../../sdk/types'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { ChaintracksStorageBase } from './ChaintracksStorageBase'

export abstract class BulkIngestorBase implements BulkIngestorApi {
  /**
   *
   * @param chain
   * @param localCachePath defaults to './data/ingest_headers/'
   * @returns
   */
  static createBulkIngestorBaseOptions(chain: Chain) {
    const options: BulkIngestorBaseOptions = {
      chain,
      jsonFilename: `${chain}NetBlockHeaders.json`,
      bypassLiveEnabled: true
    }
    return options
  }

  chain: Chain
  jsonFilename: string
  bypassLiveEnabled: boolean

  constructor(options: BulkIngestorBaseOptions) {
    if (!options.jsonFilename) throw new Error('The jsonFilename options property is required.')
    this.chain = options.chain
    this.jsonFilename = options.jsonFilename
    this.bypassLiveEnabled = options.bypassLiveEnabled
  }

  private storageEngine: ChaintracksStorageBase | undefined

  async setStorage(storage: ChaintracksStorageBase): Promise<void> {
    this.storageEngine = storage
  }

  async shutdown(): Promise<void> {}

  storageOrUndefined(): ChaintracksStorageApi | undefined {
    return this.storageEngine
  }

  storage(): ChaintracksStorageBase {
    if (!this.storageEngine) throw new Error('storageEngine must be set.')
    return this.storageEngine
  }

  /**
   * information about locally cached bulk header files managed by this bulk ingestor
   */
  filesInfo: BulkHeaderFilesInfo | undefined

  /**
   * At least one derived BulkIngestor must override this method to provide the current height of the active chain tip.
   * @returns undefined unless overridden
   */
  async getPresentHeight(): Promise<number | undefined> {
    return undefined
  }

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
  abstract fetchHeaders(
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
  async synchronize(
    presentHeight: number,
    before: HeightRanges,
    priorLiveHeaders: BlockHeader[]
  ): Promise<BulkSyncResult> {
    const storage = this.storage()

    const r: BulkSyncResult = {
      liveHeaders: priorLiveHeaders,
      liveRange: HeightRange.from(priorLiveHeaders),
      done: false,
      log: ''
    }

    // Decisions to be made:
    // Q1. Are we already done?
    // Q2. Are there live headers that should be migrated to bulk?
    // Q3. What range of headers do we still need to retrieve?

    // Q1: We are done if we have enough live headers and they include presentHeight.
    const currentFullRange = before.bulk.union(before.live)
    if (currentFullRange.maxHeight >= presentHeight) {
      r.done = true
      return r
    }

    const targetBulkRange = new HeightRange(0, Math.max(0, presentHeight - storage.liveHeightThreshold))
    let missingBulkRange = targetBulkRange.subtract(before.bulk)

    const updateMissingBulkRange = async () => {
      before = await storage.getAvailableHeightRanges()
      missingBulkRange = targetBulkRange.subtract(before.bulk)
    }

    // Q2: If missingBulkRange isn't empty and there are live headers in storage,
    // migrate from existing live headers in excess of reorgHeightThreshold.
    if (!missingBulkRange.isEmpty && !before.live.isEmpty) {
      const countToMigrate = Math.min(
        missingBulkRange.length,
        Math.max(0, before.live.length - storage.reorgHeightThreshold)
      )
      r.log += `Migrating ${countToMigrate} live headers to bulk storage.\n`
      await storage.migrateLiveToBulk(countToMigrate)
      await updateMissingBulkRange()
      if (!missingBulkRange.isEmpty) {
        // If there are still missing bulk headers, MUST flush live storage.
        const countToFlush = before.live.length
        r.log += `Flushing ${countToFlush} live headers from live storage.\n`
        await storage.deleteLiveBlockHeaders()
        await updateMissingBulkRange()
      }
    }

    const targetFullRange = new HeightRange(0, presentHeight)
    // Q3: What to fetch...
    let rangeToFetch: HeightRange
    if (missingBulkRange.isEmpty) {
      // If there are no missing bulk headers, we don't need existing bulk range.
      rangeToFetch = targetFullRange.subtract(before.bulk)
      // And if there are live headers in excess of reorgHeightThreshold, they can be skipped as well.
      if (before.live.length > storage.reorgHeightThreshold) {
        rangeToFetch = rangeToFetch.subtract(
          new HeightRange(before.live.minHeight, before.live.maxHeight - storage.reorgHeightThreshold)
        )
      }
    } else {
      // If there are missing bulk headers, ingest from start of missing through present height.
      rangeToFetch = new HeightRange(missingBulkRange.minHeight, presentHeight)
    }

    const newLiveHeaders = await this.fetchHeaders(before, rangeToFetch, missingBulkRange, priorLiveHeaders)

    await updateMissingBulkRange()

    r.liveHeaders = newLiveHeaders
    r.liveRange = HeightRange.from(r.liveHeaders)
    r.done = missingBulkRange.isEmpty && r.liveRange.maxHeight >= presentHeight

    return r
  }
}
