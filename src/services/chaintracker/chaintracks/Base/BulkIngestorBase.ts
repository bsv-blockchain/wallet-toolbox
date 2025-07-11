/* eslint-disable @typescript-eslint/no-empty-function */
import { BulkIngestorApi, BulkIngestorBaseOptions } from '../Api/BulkIngestorApi'
import { ChaintracksStorageApi } from '../Api/ChaintracksStorageApi'

import { BulkFilesReader, BulkHeaderFilesInfo } from '../util/BulkFilesReader'
import { HeightRange } from '../util/HeightRange'
import { BulkFilesManager } from '../util/BulkFilesManager'
import { deserializeBaseBlockHeaders, deserializeBlockHeaders, genesisBuffer } from '../util/blockHeaderUtilities'
import { Chain } from '../../../../sdk/types'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { asString } from '../../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { logger } from '../../../../../test/utils/TestUtilsWalletStorage'

export abstract class BulkIngestorBase implements BulkIngestorApi {
  /**
   *
   * @param chain
   * @param localCachePath defaults to './data/ingest_headers/'
   * @returns
   */
  static createBulkIngestorBaseOptions(chain: Chain, fs: ChaintracksFsApi, localCachePath?: string) {
    const options: BulkIngestorBaseOptions = {
      chain,
      fs,
      jsonFilename: `${chain}NetBlockHeaders.json`,
      localCachePath: localCachePath || './data/ingest_headers/',
      bypassLiveEnabled: true
    }
    return options
  }

  chain: Chain
  fs: ChaintracksFsApi
  jsonFilename: string
  localCachePath: string
  bypassLiveEnabled: boolean

  constructor(options: BulkIngestorBaseOptions) {
    if (!options.jsonFilename) throw new Error('The jsonFilename options property is required.')
    if (!options.localCachePath) throw new Error('The localCachePath options property is required.')
    this.chain = options.chain
    this.fs = options.fs
    this.jsonFilename = options.jsonFilename
    this.localCachePath = options.localCachePath
    this.bypassLiveEnabled = options.bypassLiveEnabled
  }

  private storageEngine: ChaintracksStorageApi | undefined

  async setStorage(storage: ChaintracksStorageApi): Promise<void> {
    this.storageEngine = storage
  }

  storageOrUndefined(): ChaintracksStorageApi | undefined {
    return this.storageEngine
  }
  
  storage(): ChaintracksStorageApi {
    if (!this.storageEngine) throw new Error('storageEngine must be set.')
    return this.storageEngine
  }

  /**
   * information about locally cached bulk header files managed by this bulk ingestor
   */
  filesInfo: BulkHeaderFilesInfo | undefined

  async getBulkFilesManager(neededRange?: HeightRange, maxBufferSize?: number): Promise<BulkFilesManager> {
    if (!this.localCachePath) throw new Error('localCachePath options property is undefined.')
    if (!this.jsonFilename) throw new Error('jsonFilename options property is undefined.')

    const manager = await BulkFilesManager.fromJsonFile(
      this.fs,
      this.localCachePath,
      this.jsonFilename,
      neededRange,
      maxBufferSize
    )

    return manager
  }

  async clearLocalCache(): Promise<BulkFilesManager> {
    const manager = await this.getBulkFilesManager()
    await manager.clearBulkHeaders()
    return manager
  }

  /**
   * If this bulk ingestor has a remote source of block headers that
   * it can cache locally, update that cache.
   *
   * Ingesters that also acquire more recent block headers than the `` can return these headers in the order
   * retrieved with no additional processing in the `liveHeaders` return property.
   *
   * @param neededRange block header height range of interest, may be empty, maxHeight + 1 is always first liveHeader of interest.
   * @param presentHeight if known, approximate present height of actual chain tip
   * @returns `BulkFileReader` to access available bulk block headers in neededRange and optionally, the available live block headers
   */
  abstract updateLocalCache(
    neededRange: HeightRange,
    presentHeight: number,
    priorLiveHeaders?: BlockHeader[]
  ): Promise<{ reader: BulkFilesReader; liveHeaders?: BlockHeader[] }>

  abstract getPresentHeight(): Promise<number | undefined>

  async synchronize(presentHeight: number, priorLiveHeaders?: BlockHeader[]): Promise<BlockHeader[] | undefined> {
    const storage = this.storage()

    // What bulk storage and live database have...
    const { bulk: bulkRange, live: liveRange } = await storage.getAvailableHeightRanges()
    const storageRange = bulkRange.union(liveRange)

    if (presentHeight === storageRange.maxHeight)
      // Already up-to-date...
      return []

    if (!storage.bulkStorage) throw new Error('Insoncistent storage state.')

    if (!storageRange.isEmpty && storageRange.minHeight > 0)
      throw new Error('Between bulk and live storage, the genesis header (height zero) is required.')

    if (storage.reorgHeightThreshold > storage.liveHeightThreshold)
      throw new Error(
        `reorgHeightThreshold ${storage.reorgHeightThreshold} must not be greater than liveHeightThreshold ${storage.liveHeightThreshold}`
      )

    // Bulk storage only applies to headers at least liveHeightThreshold old...
    let newBulkRange = new HeightRange(0, presentHeight - storage.liveHeightThreshold).subtract(bulkRange)

    // newBulkRange may be empty, we still need bulk ingestor to retrieve missing liveHeaders efficiently
    const { reader, liveHeaders } = await this.updateLocalCache(newBulkRange, presentHeight, priorLiveHeaders)

    logger(
      `${this.constructor.name} bulk ${bulkRange}, live ${liveRange}, reader ${reader.range} liveHeaders count ${liveHeaders?.length}`
    )

    if (reader.range.isEmpty) return liveHeaders // There are no new bulk headers to worry about...

    if (reader.range.minHeight != newBulkRange.minHeight)
      throw new Error(`Bulk ingestor minHeight error: need ${newBulkRange} offered ${reader.range}`)

    if (reader.range.maxHeight > newBulkRange.maxHeight)
      throw new Error(`Bulk ingestor maxHeight error: need ${newBulkRange} offered ${reader.range}`)

    newBulkRange = reader.range.copy()

    // Genesis Block check...
    if (storageRange.isEmpty) {
      const h0 = asString(await reader.readBufferForHeight(0))
      if (reader.nextHeight !== 0 || h0 !== asString(genesisBuffer(storage.chain)))
        throw new Error('First bulk header in chain must be genesis header.')
    }

    // OPTIMIZATION ON SAFE PROCESSING STEPS:
    // If fewer new bulk headers are being added than would be flushed from live storage...
    // Prepend the new bulk headers to the live headers and let the live ingestor flow them through into bulk storage.

    if (reader.range.length < storage.liveHeightThreshold / 2) {
      if (!reader.nextHeight) throw new Error('Inconsistent reader state.')
      const firstHeight = reader.nextHeight
      reader.setMaxBufferSize(reader.range.length * 80) // Enable reading all headers into one buffer.
      const buffer = await reader.read()
      if (!buffer) throw new Error('Failure to read expected locally cached block headers.')
      let newHeaders = deserializeBlockHeaders(firstHeight, buffer)
      if (liveHeaders) newHeaders = newHeaders.concat(liveHeaders)
      return newHeaders
    }

    if (!this.bypassLiveEnabled) {
      // Must do things the hard way... all bulk headers must flow through live storage and rely on migration from there to end up in bulk storage...

      // Batch mode bulk header processing adds chunks of height/previousHash consecutive headers to the "live" storage database.
      // As "live" storage fills and exceeds the liveHeightThreshold in size, headers are migrated to bulk storage and pruned,
      // if bulk storage is configured.
      const batchRange = new HeightRange(newBulkRange.minHeight, newBulkRange.maxHeight)
      reader.resetRange(batchRange, storage.batchInsertLimit * 80)
      for (;;) {
        const nextHeight = reader.nextHeight
        if (nextHeight === undefined) throw new Error('Unexpected error.')
        const buffer = await reader.read()
        if (!buffer) break
        const headers = deserializeBaseBlockHeaders(buffer)
        await storage.batchInsertHeaders(headers, nextHeight)
      }

      return liveHeaders
    }

    // BYPASS MODE
    //
    // Major performance boost from bypassing live database when adding all but last liveHeightThreshold available headers.
    // This does take a bit of memory...
    // 1. The CDN data is downloaded to disk (one copy of most of the headers)
    // 2. A consolidated copy is made for the storage engine on disk (second copy)
    // 3. This code starts by reading it all into memory (third copy)
    // 4. It is then fed into two hash to height indexes, writing each index takes (fourth copy and half a copy):
    //    4.1 Aggregated copy (half a copy)
    //    4.2 Organized copy to write (half a copy)
    //    4.3 Index written to disk (half a copy per index, aggregate one copy for both)
    //    4.4 at this point 4.1 and 4.2 are released.
    // 5. The copy from step 3 is released.
    // Optimizations:
    // a. After handing the data to `bulkStorage`, purge it from the CDN ingestor and prevent its regeneration unless needed.
    // b. Transfer the data from bulkStorage to index creation in smaller buffers (e.g. 32MB), settle for reading it twice, once
    //    per index.
    // c. When writing indexes to disk, it could be done in fixed sized buffers instead of one big buffer. Just keep track of
    //    aggregate offsets as you append buffers.
    // d. All of these changes reduce memory required to 2.5 copies (~300MB for testnet).
    // e. Without them the memory required is (120MB * 4.5 => ~540MB)

    // SAFE PROCESSING STEPS:
    // STEP 1. Flush (delete) all live headers
    // STEP 2. Add new bulk headers to bulk storage
    // STEP 3. Forward live headers to live ingestor to repopulate live storage.

    // STEP 1. Flush (delete) all live headers
    await storage.deleteOlderLiveBlockHeaders((await storage.findMaxHeaderId()) + 1)

    // STEP 2. Add new bulk headers to bulk storage
    reader.setMaxBufferSize(reader.range.length * 80) // enable reading all headers into one buffer
    const buffer = await reader.read()
    if (!buffer) throw new Error('Failure to read expected locally cached block headers.')
    await storage.bulkStorage.appendHeaders(newBulkRange.minHeight, newBulkRange.length, buffer)

    // STEP 3. Forward live headers to live ingestor to repopulate live storage.
    return liveHeaders
  }

  async shutdown(): Promise<void> {}
}
