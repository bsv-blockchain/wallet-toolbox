import {
  InsertHeaderResult,
  ChaintracksStorageBaseOptions,
  ChaintracksStorageIngestApi,
  ChaintracksStorageQueryApi as ChaintracksStorageQueryApi
} from '../Api/ChaintracksStorageApi'
import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkFilesReader'
import { HeightRange } from '../util/HeightRange'
import { BulkStorageApi } from '../Api/BulkStorageApi'
import { deserializeBaseBlockHeader, deserializeBlockHeader, validateBufferOfHeaders } from '../util/blockHeaderUtilities'

import { Chain } from '../../../../sdk/types'
import { BaseBlockHeader, BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import { Utils, Hash } from '@bsv/sdk'
import { ChaintracksAppendableFileApi, ChaintracksFsApi, ChaintracksWritableFileApi } from '../Api/ChaintracksFsApi'
import { BulkHeaderFile } from '../Storage/BulkBlockHeaders'
import { WERR_INVALID_OPERATION } from '../../../../sdk'
import { deserialize } from 'v8'

/**
 * Support for block header hash to height index implementations
 * needed for queries on block headers migrated to "bulk" storage.
 */
export interface BlockHashHeight {
  hash: string
  height: number
}

/**
 * Support for block header merkle root to height index implementations
 * needed for queries on block headers migrated to "bulk" storage.
 */
export interface MerkleRootHeight {
  merkleRoot: string
  height: number
}

/**
 * Required interface methods of a Chaintracks Storage Engine implementation.
 */
export abstract class ChaintracksStorageBase implements ChaintracksStorageQueryApi, ChaintracksStorageIngestApi {
  static createStorageBaseOptions(chain: Chain): ChaintracksStorageBaseOptions {
    const options: ChaintracksStorageBaseOptions = {
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

  chain: Chain
  liveHeightThreshold: number
  reorgHeightThreshold: number
  bulkMigrationChunkSize: number
  bulkIndexTableChunkSize: number
  hasMerkleRootToHeightIndex = false
  hasBlockHashToHeightIndex = false
  batchInsertLimit: number
  bulkStorage?: BulkStorageApi

  isAvailable: boolean = false
  hasMigrated: boolean = false
  bulkFiles: BulkHeaderFileInfo[] = []

  constructor(options: ChaintracksStorageBaseOptions) {
    this.chain = options.chain
    this.liveHeightThreshold = options.liveHeightThreshold
    this.reorgHeightThreshold = options.reorgHeightThreshold
    this.bulkMigrationChunkSize = options.bulkMigrationChunkSize
    this.bulkIndexTableChunkSize = options.bulkIndexTableChunkSize
    this.batchInsertLimit = options.batchInsertLimit
    this.hasBlockHashToHeightIndex = options.hasBlockHashToHeightIndex
    this.hasMerkleRootToHeightIndex = options.hasMerkleRootToHeightIndex
  }

  async shutdown(): Promise<void> {
    /* base class does notning */
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

  async makeAvailable(): Promise<void> {
    if (this.isAvailable) return;
    this.isAvailable = true
    this.bulkFiles = await this.getBulkFiles()
  }

  async migrateLatest(): Promise<void> {
    this.hasMigrated = true
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
  ): Promise<{ buffer: Uint8Array; headerId: number; hashes: string[]; merkleRoots: string[] }>
  abstract getHeaders(height: number, count: number): Promise<number[]>
  abstract insertGenesisHeader(header: BaseBlockHeader, chainWork: string): Promise<void>
  abstract insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult>

  abstract insertBulkFile(file: BulkHeaderFileInfo): Promise<number>
  abstract updateBulkFile(fileId: number, file: BulkHeaderFileInfo): Promise<number>
  abstract getBulkFiles(): Promise<BulkHeaderFileInfo[]>
  abstract getBulkFileData(fileId: number, offset?: number, length?: number): Promise<Uint8Array | undefined>

  /**
   * Use to throw a consistent error when bulk storage is not configured
   *  and a method is called that requires bulk storage.
   */
  confirmHasBulkStorage() {
    if (!this.bulkStorage) throw new Error('Bulk storage is not configured in `ChaintracksStorageBaseOptions`.')
  }

  /**
   * Use to throw a consistent error when bulk storage is not configured
   *  or `hasBlockHasthToHeightIndex` is false
   *  and a method is called that requires the index.
   */
  confirmHasBulkBlockHashToHeightIndex() {
    this.confirmHasBulkStorage()
    if (this.hasBlockHashToHeightIndex === false)
      throw new Error('`hasBlockHashToHeightIndex` is false in `ChaintracksStorageBaseOptions`.')
  }

  /**
   * Use to throw a consistent error when bulk storage is not configured
   *  or `hasMerkleRootToHeightIndex` is false
   *  and a method is called that requires the index.
   */
  confirmHasBulkMerkleRootToHeightIndex() {
    this.confirmHasBulkStorage()
    if (this.hasMerkleRootToHeightIndex === false)
      throw new Error('`hasMerkleRootToHeightIndex` is false in `ChaintracksStorageBaseOptions`.')
  }

  // BASE CLASS IMPLEMENTATIONS - MAY BE OVERRIDEN

  async getAvailableHeightRanges(): Promise<{ bulk: HeightRange; live: HeightRange }> {
    await this.makeAvailable()
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

  private lastActiveMinHeight: number | undefined

  async pruneLiveBlockHeaders(activeTipHeight: number): Promise<void> {
    await this.makeAvailable()
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
    await this.makeAvailable()
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

  async findChainTipHash(): Promise<string> {
    await this.makeAvailable()
    const tip = await this.findChainTipHeader()
    return tip.hash
  }

  async findChainTipWork(): Promise<string> {
    await this.makeAvailable()
    const tip = await this.findChainTipHeader()
    return tip.chainWork
  }

  async findChainWorkForBlockHash(hash: string): Promise<string> {
    await this.makeAvailable()
    const header = await this.findLiveHeaderForBlockHash(hash)
    if (header !== null) return header.chainWork
    throw new Error(`Header with hash of ${hash} was not found in the live headers database.`)
  }

  async findBulkFilesHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> {
    await this.makeAvailable()
    const file = this.bulkFiles.find((f) => f.firstHeight <= height && f.firstHeight + f.count > height)
    if (!file) return undefined
    if (!file.fileId) throw new WERR_INVALID_OPERATION(`Bulk file doesn't have a fileId: ${file.fileName}`);
    const offset = (height - file.firstHeight) * 80
    const data = await this.getBulkFileData(file.fileId, offset, 80)
    if (!data) throw new WERR_INVALID_OPERATION(`Bulk file data for ${file.fileId}, ${offset} is not available.`);
    const header = deserializeBlockHeader(data, 0, height) 
    return header
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined> {
    await this.makeAvailable()
    if (isNaN(height) || height < 0 || Math.ceil(height) !== height)
      throw new Error(`Height ${height} must be a non-negative integer.`)
    const liveHeader = await this.findLiveHeaderForHeight(height)
    if (liveHeader !== null) return liveHeader
    let header = await this.findBulkFilesHeaderForHeightOrUndefined(height)
    if (!header) header = await this.bulkStorage?.findHeaderForHeightOrUndefined(height)
    return header
  }

  async findHeaderForHeight(height: number): Promise<LiveBlockHeader | BlockHeader> {
    await this.makeAvailable()
    const header = await this.findHeaderForHeightOrUndefined(height)
    if (header) return header
    throw new Error(`Header with height of ${height} was not found.`)
  }

  async isMerkleRootActive(merkleRoot: string): Promise<boolean> {
    await this.makeAvailable()
    const header = await this.findLiveHeaderForMerkleRoot(merkleRoot)
    return header ? header.isActive : false
  }

  async findCommonAncestor(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<LiveBlockHeader> {
    await this.makeAvailable()
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
    await this.makeAvailable()
    const ancestor = await this.findCommonAncestor(header1, header2)
    return Math.max(header1.height, header2.height) - ancestor.height
  }
}
