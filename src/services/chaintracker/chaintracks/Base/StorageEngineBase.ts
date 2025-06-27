import {
  InsertHeaderResult,
  StorageEngineBaseOptions,
  StorageEngineIngestApi,
  StorageEngineQueryApi
} from '../Api/StorageEngineApi'
import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkFilesReader'
import { HeightRange } from '../util/HeightRange'
import { BulkIndexApi } from '../Api/BulkIndexApi'
import { BulkStorageApi } from '../Api/BulkStorageApi'
import { validateBufferOfHeaders } from '../util/blockHeaderUtilities'

import { Chain } from '../../../../sdk/types'
import { BaseBlockHeader, BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import { Utils, Hash } from '@bsv/sdk'
import { ChaintracksAppendableFileApi, ChaintracksFsApi, ChaintracksWritableFileApi } from '../Api/ChaintracksFsApi'

/**
 * Support for block header hash to height index implementations
 * needed for queries on block headers migrated to "bulk" storage.
 */
export interface BlockHashHeight {
  hash: Buffer
  height: number
}

/**
 * Support for block header merkle root to height index implementations
 * needed for queries on block headers migrated to "bulk" storage.
 */
export interface MerkleRootHeight {
  merkleRoot: Buffer
  height: number
}

/**
 * Required interface methods of a Chaintracks Storage Engine implementation.
 */
export abstract class StorageEngineBase implements StorageEngineQueryApi, StorageEngineIngestApi {
  static createStorageEngineBaseOptions(chain: Chain): StorageEngineBaseOptions {
    const options: StorageEngineBaseOptions = {
      chain,
      liveHeightThreshold: 2000,
      reorgHeightThreshold: 400,
      bulkMigrationChunkSize: 500,
      bulkIndexTableChunkSize: 500,
      hasMerkleRootToHeightIndex: true,
      hasBlockHashToHeightIndex: true,
      batchInsertLimit: 400
    }
    return options
  }

  async shutdown(): Promise<void> {
    /* base class does notning */
  }

  chain: Chain
  liveHeightThreshold: number
  reorgHeightThreshold: number
  bulkMigrationChunkSize: number
  bulkIndexTableChunkSize: number
  hasMerkleRootToHeightIndex = false
  hasBlockHashToHeightIndex = false
  batchInsertLimit: number
  bulkStorage?: BulkStorageApi
  bulkIndex?: BulkIndexApi

  constructor(options: StorageEngineBaseOptions) {
    this.chain = options.chain
    this.liveHeightThreshold = options.liveHeightThreshold
    this.reorgHeightThreshold = options.reorgHeightThreshold
    this.bulkMigrationChunkSize = options.bulkMigrationChunkSize
    this.bulkIndexTableChunkSize = options.bulkIndexTableChunkSize
    this.batchInsertLimit = options.batchInsertLimit
    this.hasBlockHashToHeightIndex = options.hasBlockHashToHeightIndex
    this.hasMerkleRootToHeightIndex = options.hasMerkleRootToHeightIndex
  }

  async setBulkStorage(bulk?: BulkStorageApi): Promise<void> {
    this.bulkStorage = bulk
    if (this.bulkStorage) {
      await this.bulkStorage.setStorage(this)
    } else {
      this.hasBlockHashToHeightIndex = false
      this.hasMerkleRootToHeightIndex = false
    }
  }

  async setBulkIndex(bulkIndex?: BulkIndexApi): Promise<void> {
    this.bulkIndex = bulkIndex
    if (this.bulkIndex) {
      await this.bulkIndex.setStorage(this)
    }
  }

  // Abstract functions to be defined by implementation classes

  abstract appendBlockHashes(hashes: string[], minHeight: number): Promise<void>
  abstract appendMerkleRoots(merkleRoots: string[], minHeight: number): Promise<void>
  abstract batchInsertHeaders(headers: BaseBlockHeader[], firstHeight: number): Promise<void>
  abstract deleteOlderLiveBlockHeaders(headerId: number): Promise<void>
  abstract findBulkHeightForBlockHash(hash: string): Promise<number | null>
  abstract findBulkHeightForMerkleRoot(merkleRoot: string): Promise<number | null>
  abstract findChainTipHeader(): Promise<LiveBlockHeader>
  abstract findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined>
  abstract findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null>
  abstract findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader>
  abstract findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null>
  abstract findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null>
  abstract findLiveHeightRange(): Promise<{ minHeight: number; maxHeight: number }>
  abstract findMaxHeaderId(): Promise<number>
  abstract getLiveHeightRange(): Promise<HeightRange>
  abstract headersToBuffer(
    height: number,
    count: number
  ): Promise<{ buffer: number[]; headerId: number; hashes: string[]; merkleRoots: string[] }>
  abstract getHeaders(height: number, count: number): Promise<number[]>
  abstract insertGenesisHeader(header: BaseBlockHeader, chainWork: string): Promise<void>
  abstract insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult>

  /**
   * Use to throw a consistent error when bulk storage is not configured
   *  and a method is called that requires bulk storage.
   */
  confirmHasBulkStorageEngine() {
    if (!this.bulkStorage) throw new Error('Bulk storage is not configured in `StorageEngineBaseOptions`.')
  }

  /**
   * Use to throw a consistent error when bulk storage is not configured
   *  or `hasBlockHasthToHeightIndex` is false
   *  and a method is called that requires the index.
   */
  confirmHasBulkBlockHashToHeightIndex() {
    this.confirmHasBulkStorageEngine()
    if (this.hasBlockHashToHeightIndex === false)
      throw new Error('`hasBlockHashToHeightIndex` is false in `StorageEngineBaseOptions`.')
  }

  /**
   * Use to throw a consistent error when bulk storage is not configured
   *  or `hasMerkleRootToHeightIndex` is false
   *  and a method is called that requires the index.
   */
  confirmHasBulkMerkleRootToHeightIndex() {
    this.confirmHasBulkStorageEngine()
    if (this.hasMerkleRootToHeightIndex === false)
      throw new Error('`hasMerkleRootToHeightIndex` is false in `StorageEngineBaseOptions`.')
  }

  // BASE CLASS IMPLEMENTATIONS - MAY BE OVERRIDEN

  async getAvailableHeightRanges(): Promise<{ bulk: HeightRange; live: HeightRange }> {
    const bulk = (await this.bulkStorage?.getHeightRange()) || HeightRange.empty
    const live = await this.getLiveHeightRange()
    if (bulk.isEmpty) {
      if (!live.isEmpty && live.minHeight !== 0)
        throw new Error('With empty bulk storage, live storage must start with genesis header.')
    } else {
      if (bulk.minHeight != 0) throw new Error("Bulk storage doesn't start with genesis header.")
      if (!live.isEmpty && bulk.maxHeight + 1 !== live.minHeight)
        throw new Error('There is a gap or overlap between bulk and live header storage.')
    }
    return { bulk, live }
  }

  async migrateLatest(): Promise<void> {
    /* base class does nothing */
  }

  private lastActiveMinHeight: number | undefined

  async pruneLiveBlockHeaders(activeTipHeight: number): Promise<void> {
    try {
      if (!this.bulkStorage) return

      const minHeight = this.lastActiveMinHeight || (await this.findLiveHeightRange()).minHeight

      let totalCount = activeTipHeight - minHeight + 1 - this.liveHeightThreshold
      while (totalCount >= this.bulkMigrationChunkSize) {
        const count = Math.min(totalCount, this.bulkMigrationChunkSize)
        await this.migrateLiveToBulk(count)
        totalCount -= count
        this.lastActiveMinHeight = undefined
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  private nowMigratingLiveToBulk = false

  async migrateLiveToBulk(count: number): Promise<void> {
    if (!this.bulkStorage || count > this.bulkMigrationChunkSize) return

    if (this.nowMigratingLiveToBulk) {
      console.log('Already migrating live to bulk.')
      return
    }

    try {
      this.nowMigratingLiveToBulk = true

      // Copy count oldest active LiveBlockHeaders from live database to buffer.
      const minHeight = (await this.findLiveHeightRange()).minHeight
      const { buffer, headerId, hashes, merkleRoots } = await this.headersToBuffer(minHeight, count)

      // Append the buffer of headers to BulkStorage
      await this.bulkStorage.appendHeaders(minHeight, count, buffer)

      // Add the buffer's BlockHash, Height pairs to corresponding index table.
      if (this.hasBlockHashToHeightIndex) await this.appendBlockHashes(hashes, minHeight)

      // Add the buffer's MerkleRoot, Height pairs to corresponding index table.
      if (this.hasMerkleRootToHeightIndex) await this.appendMerkleRoots(merkleRoots, minHeight)

      // Delete the records from the live database.
      await this.deleteOlderLiveBlockHeaders(headerId)
    } finally {
      this.nowMigratingLiveToBulk = false
    }
  }

  async findHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | BlockHeader> {
    const header = await this.findHeaderForBlockHashOrUndefined(hash)
    if (!header) throw new Error(`Header with block hash of ${hash} was not found.`)
    return header
  }

  async findHeaderForMerkleRoot(merkleRoot: string, height?: number): Promise<LiveBlockHeader | BlockHeader> {
    const header = await this.findHeaderForMerkleRootOrUndefined(merkleRoot, height)
    if (!header) throw new Error(`Header with merkle root of ${merkleRoot} was not found.`)
    return header
  }

  async findHeaderForBlockHashOrUndefined(hash: string): Promise<LiveBlockHeader | BlockHeader | undefined> {
    const liveHeader = await this.findLiveHeaderForBlockHash(hash)
    if (liveHeader) return liveHeader
    this.confirmHasBulkBlockHashToHeightIndex()
    const height = (await this.findBulkHeightForBlockHash(hash)) || (await this.bulkIndex?.findHeightForBlockHash(hash))
    if (height === undefined) return undefined
    const header = await this.bulkStorage?.findHeaderForHeight(height)
    return header
  }

  async findHeaderForMerkleRootOrUndefined(
    merkleRoot: string,
    height?: number
  ): Promise<LiveBlockHeader | BlockHeader | undefined> {
    let header: LiveBlockHeader | BlockHeader | undefined | null
    if (height) {
      header = await this.findHeaderForHeightOrUndefined(height)
      if (header?.merkleRoot !== merkleRoot) header = undefined
    }
    if (!header) {
      header = await this.findLiveHeaderForMerkleRoot(merkleRoot)
      if (!header) {
        this.confirmHasBulkMerkleRootToHeightIndex()
        height =
          (await this.findBulkHeightForMerkleRoot(merkleRoot)) ||
          (await this.bulkIndex?.findHeightForMerkleRoot(merkleRoot))
        if (height !== undefined) header = await this.bulkStorage?.findHeaderForHeight(height)
      }
    }
    if (!header) header = undefined
    return header
  }

  async findChainTipHash(): Promise<string> {
    const tip = await this.findChainTipHeader()
    return tip.hash
  }

  async findChainTipWork(): Promise<string> {
    const tip = await this.findChainTipHeader()
    return tip.chainWork
  }

  async findChainWorkForBlockHash(hash: string): Promise<string> {
    const header = await this.findLiveHeaderForBlockHash(hash)
    if (header !== null) return header.chainWork
    throw new Error(`Header with hash of ${hash} was not found in the live headers database.`)
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined> {
    if (isNaN(height) || height < 0 || Math.ceil(height) !== height)
      throw new Error(`Height ${height} must be a non-negative integer.`)
    const liveHeader = await this.findLiveHeaderForHeight(height)
    if (liveHeader !== null) return liveHeader
    const header = (await this.bulkStorage?.findHeaderForHeightOrUndefined(height)) || null
    if (header !== null) return header
    return undefined
  }

  async findHeaderForHeight(height: number): Promise<LiveBlockHeader | BlockHeader> {
    const header = await this.findHeaderForHeightOrUndefined(height)
    if (header) return header
    throw new Error(`Header with height of ${height} was not found.`)
  }

  async findHeightForBlockHash(hash: string): Promise<number> {
    return (await this.findHeaderForBlockHash(hash)).height
  }

  async findHeightForMerkleRoot(merkleRoot: string): Promise<number> {
    return (await this.findHeaderForMerkleRoot(merkleRoot)).height
  }

  async isMerkleRootActive(merkleRoot: string): Promise<boolean> {
    const header = await this.findLiveHeaderForMerkleRoot(merkleRoot)
    return header ? header.isActive : false
  }

  async findCommonAncestor(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<LiveBlockHeader> {
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    while (true) {
      if (header1.previousHeaderId === null || header2.previousHeaderId === null)
        throw new Error('Reached start of live database without resolving the reorg.')
      if (header1.previousHeaderId === header2.previousHeaderId)
        return await this.findLiveHeaderForHeaderId(header1.previousHeaderId)
      const backupHeader1 = header1.height >= header2.height
      if (header2.height >= header1.height) header2 = await this.findLiveHeaderForHeaderId(header2.previousHeaderId)
      if (backupHeader1) header1 = await this.findLiveHeaderForHeaderId(header1.previousHeaderId)
    }
  }

  async findReorgDepth(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<number> {
    const ancestor = await this.findCommonAncestor(header1, header2)
    return Math.max(header1.height, header2.height) - ancestor.height
  }

  async exportBulkHeadersToFiles(params: {
    fs: ChaintracksFsApi
    rootFolder?: string
    maxPerFile?: number
    heightMin?: number
    heightMax?: number
  }): Promise<void> {
    const { fs, rootFolder = './data/', maxPerFile = 625000 } = params
    let { heightMin = 0, heightMax } = params

    try {
      const bulkAgeLimit = this.liveHeightThreshold
      const filenamePrefix = this.chain === 'main' ? 'mainNet' : this.chain === 'test' ? 'testNet' : 'stn'

      const tip = await this.findChainTipHeader()
      if (!tip) return

      heightMin = Math.max(0, heightMin)
      if (heightMax === undefined) heightMax = tip.height - bulkAgeLimit
      heightMax = Math.max(heightMin, Math.min(heightMax, tip.height - bulkAgeLimit))
      let countRemaining = heightMax - heightMin + 1

      const jsonFilename = `${filenamePrefix}.json`
      const bulkHeaders: BulkHeaderFilesInfo = { files: [], rootFolder, jsonFilename }

      const perFile = maxPerFile

      let fileNum = 0
      let nextHeight = heightMin
      let lastHeaderHash = (await this.findHeaderForHeight(heightMin)).previousHash
      while (countRemaining > 0) {
        const filename = `${filenamePrefix}_${fileNum}.headers`
        console.log(filename)

        const filepath = rootFolder + filename

        let hf: BulkHeaderFileInfo = {
          fileName: filename,
          firstHeight: nextHeight,
          count: Math.min(perFile, countRemaining),
          prevHash: lastHeaderHash,
          lastHash: null,
          fileHash: null
        }

        let file: ChaintracksAppendableFileApi | undefined = await fs.openAppendableFile(filepath)
        if (0 < (await file.getLength())) {
          // File existed with non-zero contents...
          await file.close()
          file = undefined
          const hfa = await BulkFilesReader.validateHeaderFile(fs, rootFolder, hf)
          if (hfa.count < hf.count) {
            // Truncate to empty file...
            const f2 = await fs.openWritableFile(filepath)
            await f2.close()
            // Re-open truncated file for appending.
            file = await fs.openAppendableFile(filepath)
          } else {
            // Existing file is valid and complete, leave it.
            hf = hfa
            nextHeight += hf.count
            lastHeaderHash = hf.lastHash ?? '00'.repeat(32)
          }
        }

        if (file) {
          // We have an empty file open for append...write it.

          const sha256 = new Hash.SHA256()

          let fileRemaining = hf.count
          while (fileRemaining > 0) {
            const chunkSize = Math.min(100, fileRemaining)

            const { buffer } = await this.headersToBuffer(nextHeight, chunkSize)

            lastHeaderHash = validateBufferOfHeaders(buffer, lastHeaderHash, 0, chunkSize)

            sha256.update(buffer)
            await file.append(buffer)
            fileRemaining -= chunkSize
            nextHeight += chunkSize
          }

          await file.close()

          hf.fileHash = Utils.toBase64(sha256.digest())
          hf.lastHash = lastHeaderHash
        }

        bulkHeaders.files.push(hf)

        countRemaining -= hf.count
        fileNum++
      }

      await fs.writeFile(`${rootFolder}${jsonFilename}`, Utils.toArray(JSON.stringify(bulkHeaders), 'utf8'))
    } catch (err) {
      console.log(err)
    }
  }
}
