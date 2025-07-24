import {
  InsertHeaderResult,
  ChaintracksStorageBaseOptions,
  ChaintracksStorageIngestApi,
  ChaintracksStorageQueryApi as ChaintracksStorageQueryApi
} from '../Api/ChaintracksStorageApi'
import { BulkHeaderFileInfo } from '../util/BulkHeaderFile'
import { HeightRange } from '../util/HeightRange'
import {
  addWork,
  convertBitsToWork,
  deserializeBlockHeader,
  deserializeBlockHeaders,
  isMoreWork,
  serializeBaseBlockHeader,
  subWork,
} from '../util/blockHeaderUtilities'

import { Chain } from '../../../../sdk/types'
import { BaseBlockHeader, BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import { Hash } from '@bsv/sdk'
import { WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
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
  bulkFileMaxCount: number = 100000 // 1.9 years per file

  isAvailable: boolean = false
  hasMigrated: boolean = false
  bulkFiles: BulkFileDataManager

  constructor(options: ChaintracksStorageBaseOptions) {
    this.chain = options.chain
    this.liveHeightThreshold = options.liveHeightThreshold
    this.reorgHeightThreshold = options.reorgHeightThreshold
    this.bulkMigrationChunkSize = options.bulkMigrationChunkSize
    this.batchInsertLimit = options.batchInsertLimit
    this.bulkFiles = options.bulkFileDataManager
  }

  async shutdown(): Promise<void> {
    /* base class does notning */
  }

  async makeAvailable(): Promise<void> {
    if (this.isAvailable) return
    this.isAvailable = true
    this.bulkFiles = await this.getBulkFiles()
  }

  async migrateLatest(): Promise<void> {
    this.hasMigrated = true
  }

  // Abstract functions to be defined by implementation classes

  abstract deleteLiveBlockHeaders(): Promise<void>
  abstract deleteBulkBlockHeaders(): Promise<void>
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
  abstract insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult>

  abstract insertBulkFile(file: BulkHeaderFileInfo): Promise<number>
  abstract updateBulkFile(fileId: number, file: BulkHeaderFileInfo): Promise<number>
  abstract getBulkFiles(): Promise<BulkHeaderFileInfo[]>
  abstract getBulkFileData(fileId: number, offset?: number, length?: number): Promise<Uint8Array | undefined>

  // BASE CLASS IMPLEMENTATIONS - MAY BE OVERRIDEN

  async getAvailableHeightRanges(): Promise<{ bulk: HeightRange; live: HeightRange }> {
    await this.makeAvailable()
    let bulk = HeightRange.empty
    if (this.bulkFiles && this.bulkFiles.length > 0) {
      const firstFile = this.bulkFiles[0]
      const lastFile = this.bulkFiles[this.bulkFiles.length - 1]
      bulk = new HeightRange(firstFile.firstHeight, lastFile.firstHeight + lastFile.count - 1)
    }
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
    const file = this.bulkFiles.find(f => f.firstHeight <= height && f.firstHeight + f.count > height)
    if (!file) return undefined
    if (!file.fileId) throw new WERR_INVALID_OPERATION(`Bulk file doesn't have a fileId: ${file.fileName}`)
    const offset = (height - file.firstHeight) * 80
    const data = await this.getBulkFileData(file.fileId, offset, 80)
    if (!data) throw new WERR_INVALID_OPERATION(`Bulk file data for ${file.fileId}, ${offset} is not available.`)
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
    headers: BlockHeader[], bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]
  )
  : Promise<BlockHeader[]>
  {
    await this.makeAvailable()

    if (!headers || headers.length === 0) return priorLiveHeaders

    // Get the current extent of validated bulk and live block headers.
    const before = await this.getAvailableHeightRanges()
    const bulkFiles = this.bulkFiles

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
      if (dupe) continue;
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
    const bestChain = chains.reduce((best, c) => isMoreWork(c.chainWork, best.chainWork) ? c : best, chains[0])

    const newBulkHeaders = bestChain.headers.slice(0, bulkRange.maxHeight - bestChain.headers[0].height + 1)

    await this.addBulkHeadersFromBestChain(newBulkHeaders, bestChain)

    return liveHeaders
  }

  private async addBulkHeadersFromBestChain(newBulkHeaders: BlockHeader[], bestChain: AddBulkHeadersChain) {
    const lbf = this.bulkFiles.slice(-1)[0]
    if (!lbf || lbf.firstHeight + lbf.count !== newBulkHeaders[0].height) {
      throw new WERR_INVALID_PARAMETER('headers', 'an extension of existing bulk headers')
    }
    if (!bestChain.bulkChainWork) {
      throw new WERR_INTERNAL(`bulkChainWork is not defined for the best chain with height ${bestChain.headers[0].height}`)
    }
    if (!lbf.lastHash) {
      throw new WERR_INTERNAL(`lastHash is not defined for the last bulk file ${lbf.fileName}`)
    }

    const fbh = newBulkHeaders[0]
    const lbh = newBulkHeaders.slice(-1)[0]
    const data = serializeBaseBlockHeaders(newBulkHeaders)

    if (lbf.sourceUrl) {
      // So far we only have CDN bulk files, add one for incremental bulk headers.
      const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
      const bf: BulkHeaderFileInfo = {
        fileId: 0,
        chain: this.chain,
        sourceUrl: undefined,
        fileName: 'incremental',
        firstHeight: fbh.height,
        count: newBulkHeaders.length,
        prevChainWork: lbf.lastChainWork,
        lastChainWork: addWork(lbf.lastChainWork, bestChain.bulkChainWork),
        prevHash: lbf.lastHash,
        lastHash: lbh.hash,
        fileHash,
        data
      }
      bf.fileId = await this.insertBulkFile(bf)
      this.bulkFiles.push(bf)
    } else {
      // Extend existing incremental bulk header file.
      if (!lbf.fileId) {
        throw new WERR_INTERNAL(`fileId is not defined for the last bulk file ${lbf.fileName}`)
      }
      if (!lbf.data) {
        lbf.data = await this.getBulkFileData(lbf.fileId)
        if (!lbf.data) {
          throw new WERR_INTERNAL(`data is not defined for the last bulk file ${lbf.fileName}`)
        }
      }
      const combinedData = new Uint8Array(lbf.data.length + data.length)
      combinedData.set(lbf.data, 0)
      combinedData.set(data, lbf.data.length)
      lbf.data = combinedData
      lbf.fileHash = asString(Hash.sha256(asArray(combinedData)), 'base64')
      lbf.count += newBulkHeaders.length
      lbf.lastChainWork = addWork(lbf.lastChainWork, bestChain.bulkChainWork),
        lbf.lastHash = lbh.hash
      await this.updateBulkFile(lbf.fileId, lbf)
    }
  }

  private async addLiveHeadersToBulk(liveHeaders: LiveBlockHeader[]) {
    const lbf = this.bulkFiles.slice(-1)[0]
    if (!lbf || lbf.firstHeight + lbf.count !== liveHeaders[0].height) {
      throw new WERR_INVALID_PARAMETER('headers', 'an extension of existing bulk headers')
    }
    if (!lbf.lastHash) {
      throw new WERR_INTERNAL(`lastHash is not defined for the last bulk file ${lbf.fileName}`)
    }

    const fbh = liveHeaders[0]
    const lbh = liveHeaders.slice(-1)[0]
    const data = serializeBaseBlockHeaders(liveHeaders)

    if (lbf.sourceUrl) {
      // So far we only have CDN bulk files, add one for incremental bulk headers.
      const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
      const bf: BulkHeaderFileInfo = {
        fileId: 0,
        chain: this.chain,
        sourceUrl: undefined,
        fileName: 'incremental',
        firstHeight: fbh.height,
        count: liveHeaders.length,
        prevChainWork: lbf.lastChainWork,
        lastChainWork: lbh.chainWork!,
        prevHash: lbf.lastHash,
        lastHash: lbh.hash,
        fileHash,
        data
      }
      bf.fileId = await this.insertBulkFile(bf)
      this.bulkFiles.push(bf)
    } else {
      // Extend existing incremental bulk header file.
      if (!lbf.fileId) {
        throw new WERR_INTERNAL(`fileId is not defined for the last bulk file ${lbf.fileName}`)
      }
      if (!lbf.data) {
        lbf.data = await this.getBulkFileData(lbf.fileId)
        if (!lbf.data) {
          throw new WERR_INTERNAL(`data is not defined for the last bulk file ${lbf.fileName}`)
        }
      }
      const combinedData = new Uint8Array(lbf.data.length + data.length)
      combinedData.set(lbf.data, 0)
      combinedData.set(data, lbf.data.length)
      lbf.data = combinedData
      lbf.fileHash = asString(Hash.sha256(asArray(combinedData)), 'base64')
      lbf.count += liveHeaders.length
      lbf.lastChainWork = lbh.chainWork!
      lbf.lastHash = lbh.hash
      await this.updateBulkFile(lbf.fileId, lbf)
    }
  }
}

export function serializeBaseBlockHeaders(headers: BlockHeader[]): Uint8Array {
  const data = new Uint8Array(headers.length * 80)
  let i = -1
  for (const header of headers) {
    i++
    const d = serializeBaseBlockHeader(header)
    data.set(d, i * 80)
  }
  return data
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
