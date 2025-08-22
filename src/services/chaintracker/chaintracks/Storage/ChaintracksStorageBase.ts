import {
  InsertHeaderResult,
  ChaintracksStorageBaseOptions,
  ChaintracksStorageIngestApi,
  ChaintracksStorageQueryApi as ChaintracksStorageQueryApi
} from '../Api/ChaintracksStorageApi'
import { HeightRange } from '../util/HeightRange'
import { addWork, convertBitsToWork, isMoreWork, subWork } from '../util/blockHeaderUtilities'

import { Chain } from '../../../../sdk/types'
import { BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import { WERR_INTERNAL, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { BulkFileDataManager } from '../util/BulkFileDataManager'

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
      batchInsertLimit: 400,
      bulkFileDataManager: undefined
    }
    return options
  }

  chain: Chain
  liveHeightThreshold: number
  reorgHeightThreshold: number
  bulkMigrationChunkSize: number
  batchInsertLimit: number

  isAvailable: boolean = false
  hasMigrated: boolean = false
  bulkManager: BulkFileDataManager

  constructor(options: ChaintracksStorageBaseOptions) {
    this.chain = options.chain
    this.liveHeightThreshold = options.liveHeightThreshold
    this.reorgHeightThreshold = options.reorgHeightThreshold
    this.bulkMigrationChunkSize = options.bulkMigrationChunkSize
    this.batchInsertLimit = options.batchInsertLimit
    this.bulkManager =
      options.bulkFileDataManager || new BulkFileDataManager(BulkFileDataManager.createDefaultOptions(this.chain))
  }

  async shutdown(): Promise<void> {
    /* base class does notning */
  }

  async makeAvailable(): Promise<void> {
    if (this.isAvailable) return
    this.isAvailable = true
  }

  async migrateLatest(): Promise<void> {
    this.hasMigrated = true
  }

  async dropAllData(): Promise<void> {
    await this.bulkManager.deleteBulkFiles()
    await this.makeAvailable()
  }

  // Abstract functions to be defined by implementation classes

  abstract deleteLiveBlockHeaders(): Promise<void>
  abstract deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number>
  abstract findChainTipHeader(): Promise<LiveBlockHeader>
  abstract findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined>
  abstract findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null>
  abstract findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader>
  abstract findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null>
  abstract findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null>
  abstract findLiveHeightRange(): Promise<{ minHeight: number; maxHeight: number }>
  abstract findMaxHeaderId(): Promise<number>
  abstract getLiveHeightRange(): Promise<HeightRange>
  abstract liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]>
  abstract getHeaders(height: number, count: number): Promise<number[]>
  /**
   * @param header Header to attempt to add to live storage.
   * @returns details of conditions found attempting to insert header
   */
  abstract insertHeader(header: BlockHeader): Promise<InsertHeaderResult>
  abstract destroy(): Promise<void>

  // BASE CLASS IMPLEMENTATIONS - MAY BE OVERRIDEN

  async deleteBulkBlockHeaders(): Promise<void> {
    await this.bulkManager.deleteBulkFiles()
  }

  async getAvailableHeightRanges(): Promise<{ bulk: HeightRange; live: HeightRange }> {
    await this.makeAvailable()
    const bulk = await this.bulkManager.getHeightRange()
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
    return this.bulkManager.findHeaderForHeightOrUndefined(height)
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined> {
    await this.makeAvailable()
    if (isNaN(height) || height < 0 || Math.ceil(height) !== height)
      throw new WERR_INVALID_PARAMETER('height', `a non-negative integer (${height}).`)
    const liveHeader = await this.findLiveHeaderForHeight(height)
    if (liveHeader !== null) return liveHeader
    const header = await this.findBulkFilesHeaderForHeightOrUndefined(height)
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

  private nowMigratingLiveToBulk = false

  async migrateLiveToBulk(count: number, ignoreLimits = false): Promise<void> {
    await this.makeAvailable()
    if (!ignoreLimits && count > this.bulkMigrationChunkSize) return

    if (this.nowMigratingLiveToBulk) {
      console.log('Already migrating live to bulk.')
      return
    }

    try {
      this.nowMigratingLiveToBulk = true

      const headers = await this.liveHeadersForBulk(count)

      await this.addLiveHeadersToBulk(headers)

      await this.deleteOlderLiveBlockHeaders(headers.slice(-1)[0].height)
    } finally {
      this.nowMigratingLiveToBulk = false
    }
  }

  async addBulkHeaders(
    headers: BlockHeader[],
    bulkRange: HeightRange,
    priorLiveHeaders: BlockHeader[]
  ): Promise<BlockHeader[]> {
    await this.makeAvailable()

    if (!headers || headers.length === 0) return priorLiveHeaders

    // Get the current extent of validated bulk and live block headers.
    const before = await this.getAvailableHeightRanges()
    const bulkFiles = this.bulkManager

    // Review `headers`, applying the following rules:
    // 1. Height must be outside the current bulk HeightRange.
    // 2. Height must not exceed presentHeight - liveHeightThreshold. If presentHeight is unknown, use maximum height across all headers.
    // 3. Compute chainWork for each header.
    // 4. Verify chain of header hash and previousHash values. One header at each height. Retain chain with most chainWork.

    const minHeight = !bulkRange.isEmpty ? bulkRange.minHeight : before.bulk.isEmpty ? 0 : before.bulk.maxHeight + 1
    const filteredHeaders = headers.concat(priorLiveHeaders || []).filter(h => h.height >= minHeight)
    const sortedHeaders = filteredHeaders.sort((a, b) => a.height - b.height)
    const liveHeaders = sortedHeaders.filter(h => bulkRange.isEmpty || !bulkRange.contains(h.height))

    if (liveHeaders.length === sortedHeaders.length) {
      // All headers are live, no bulk headers to add.
      return liveHeaders
    }

    const chains: AddBulkHeadersChain[] = []

    for (const h of sortedHeaders) {
      const dupe = chains.find(c => {
        const lh = c.headers[c.headers.length - 1]
        return lh.hash === h.hash
      })
      if (dupe) continue
      const chainWork = convertBitsToWork(h.bits)
      let chain = chains.find(c => {
        const lh = c.headers[c.headers.length - 1]
        return lh.height + 1 === h.height && lh.hash === h.previousHash
      })
      if (chain) {
        chain.headers.push(h)
        chain.chainWork = addWork(chain.chainWork, chainWork)
        if (h.height <= bulkRange.maxHeight) {
          chain.bulkChainWork = chain.chainWork
        }
        continue
      }
      // Since headers are assumed to be sorted by height,
      // if this header doesn't extend an existing chain,
      // it may be a branch from the previous header.
      chain = chains.find(c => {
        const lh = c.headers[c.headers.length - 2]
        return lh.height + 1 === h.height && lh.hash === h.previousHash
      })
      if (chain) {
        // This header competes with tip of `chain`.
        // Create a new chain with this header as the tip.
        const headers = chain.headers.slice(0, -1)
        headers.push(h)
        const otherHeaderChainWork = convertBitsToWork(chain.headers[chain.headers.length - 1].bits)
        const newChainWork = addWork(subWork(chain.chainWork, otherHeaderChainWork), chainWork)
        const newChain = {
          headers,
          chainWork: newChainWork,
          bulkChainWork: h.height <= bulkRange.maxHeight ? newChainWork : undefined
        }
        chains.push(newChain)
        continue
      }
      // Starting a new chain
      chains.push({ headers: [h], chainWork, bulkChainWork: h.height <= bulkRange.maxHeight ? chainWork : undefined })
    }

    // Find the chain with the most chainWork.
    const bestChain = chains.reduce((best, c) => (isMoreWork(c.chainWork, best.chainWork) ? c : best), chains[0])

    const newBulkHeaders = bestChain.headers.slice(0, bulkRange.maxHeight - bestChain.headers[0].height + 1)

    await this.addBulkHeadersFromBestChain(newBulkHeaders, bestChain)

    return liveHeaders
  }

  private async addBulkHeadersFromBestChain(newBulkHeaders: BlockHeader[], bestChain: AddBulkHeadersChain) {
    if (!bestChain.bulkChainWork) {
      throw new WERR_INTERNAL(
        `bulkChainWork is not defined for the best chain with height ${bestChain.headers[0].height}`
      )
    }
    await this.bulkManager.mergeIncrementalBlockHeaders(newBulkHeaders, bestChain.bulkChainWork)
  }

  private async addLiveHeadersToBulk(liveHeaders: LiveBlockHeader[]) {
    if (liveHeaders.length === 0) return
    const lastChainWork = liveHeaders.slice(-1)[0].chainWork
    await this.bulkManager.mergeIncrementalBlockHeaders(liveHeaders, lastChainWork)
  }
}

interface AddBulkHeadersChain {
  headers: BlockHeader[]
  /**
   * Total chainwork of headers.
   */
  chainWork: string
  /**
   * Total chainwork of headers with height not greater than maxBulkHeight.
   */
  bulkChainWork?: string
}
