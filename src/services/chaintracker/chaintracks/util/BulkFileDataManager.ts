import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { BlockHeader, Chain, WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { Hash } from '@bsv/sdk'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { BulkHeaderFile, BulkHeaderFileInfo } from './BulkHeaderFile'
import {
  isKnownValidBulkHeaderFile,
  validBulkHeaderFiles,
  validBulkHeaderFilesByFileHash
} from './validBulkHeaderFilesByFileHash'
import { HeightRange } from './HeightRange'
import {
  deserializeBlockHeader,
  serializeBaseBlockHeaders,
  subWork,
  validateBufferOfHeaders,
  validateBulkFileData,
  validateGenesisHeader
} from './blockHeaderUtilities'
import { wait } from '../../../../index.all'
import { ChaintracksStorageBulkFileApi } from '../Api/ChaintracksStorageApi'
import { logger } from '../../../../../test/utils/TestUtilsWalletStorage'
import { ChaintracksFetch } from './ChaintracksFetch'

export interface BulkFileDataManagerOptions {
  chain: Chain
  maxPerFile: number
  maxRetained?: number
  fetch?: ChaintracksFetchApi
  fromKnownSourceUrl?: string
}

export interface BulkFileDataManagerMergeResult {
  unchanged: BulkHeaderFileInfo[]
  inserted: BulkHeaderFileInfo[]
  updated: BulkHeaderFileInfo[]
  dropped: BulkHeaderFileInfo[]
}

/**
 * Manages bulk file data (typically 8MB chunks of 100,000 headers each).
 *
 * If not cached in memory,
 * optionally fetches data by `sourceUrl` from CDN on demand,
 * optionally finds data by `fileId` in a database on demand,
 * and retains a limited number of files in memory,
 * subject to the optional `maxRetained` limit.
 */
export class BulkFileDataManager {
  static createDefaultOptions(chain: Chain): BulkFileDataManagerOptions {
    return {
      chain,
      maxPerFile: 100000,
      maxRetained: 2,
      fetch: new ChaintracksFetch(),
      fromKnownSourceUrl: 'https://cdn.projectbabbage.com/blockheaders'
    }
  }

  private bfds: BulkFileData[] = []
  private fileHashToIndex: Record<string, number> = {}
  private lock: Lock = new Lock()
  private storage?: ChaintracksStorageBulkFileApi

  readonly chain: Chain
  readonly maxPerFile: number
  readonly fetch?: ChaintracksFetchApi
  readonly maxRetained?: number
  readonly fromKnownSourceUrl?: string

  constructor(options: BulkFileDataManagerOptions) {
    this.chain = options.chain
    this.maxPerFile = options.maxPerFile
    this.maxRetained = options.maxRetained
    this.fromKnownSourceUrl = options.fromKnownSourceUrl
    this.fetch = options.fetch

    this.deleteBulkFilesNoLock()
  }

  async setStorage(storage: ChaintracksStorageBulkFileApi): Promise<void> {
    return this.lock.withWriteLock(async () => this.setStorageNoLock(storage))
  }

  private async setStorageNoLock(storage: ChaintracksStorageBulkFileApi): Promise<void> {
    this.storage = storage
    // Sync bfds with storage. Two scenarios supported:
    const sfs = await this.storage.getBulkFiles()
    if (sfs.length === 0) {
      // 1. Storage has no files: Update storage to reflect bfds.
      for (const bfd of this.bfds) {
        await this.storage.insertBulkFile(bfd)
      }
    } else {
      // 2. bfds are a prefix of storage, including last bfd having same firstHeight but possibly fewer headers: Merge storage to bfds.
      const r = await this.mergeNoLock(sfs)
    }
  }

  async deleteBulkFiles() : Promise<void> {
    return this.lock.withWriteLock(async () => this.deleteBulkFilesNoLock())
  }

  private deleteBulkFilesNoLock() : void {
      this.bfds = []
      this.fileHashToIndex = {}

    if (this.fromKnownSourceUrl) {
      const files = selectBulkHeaderFiles(
        validBulkHeaderFiles.filter(f => f.sourceUrl === this.fromKnownSourceUrl),
        this.chain,
        this.maxPerFile
      )
      for (const file of files) {
        this.add({ ...file, fileHash: file.fileHash!, mru: Date.now() })
      }
    }
  }

  async merge(files: BulkHeaderFileInfo[]): Promise<BulkFileDataManagerMergeResult> {
    return this.lock.withWriteLock(async () => this.mergeNoLock(files))
  }

  private async mergeNoLock(files: BulkHeaderFileInfo[]): Promise<BulkFileDataManagerMergeResult> {
    const r: BulkFileDataManagerMergeResult = { inserted: [], updated: [], unchanged: [], dropped: [] }
    for (const file of files) {
      const vbf: BulkFileData = await this.validateFileInfo(file)
      const hbf = this.getBfdForHeight(vbf.firstHeight)
      if (hbf) {
        if (!vbf.fileId && hbf.fileId) vbf.fileId = hbf.fileId
        if (
          hbf.fileHash === vbf.fileHash &&
          hbf.count === vbf.count &&
          hbf.lastHash === vbf.lastHash &&
          hbf.lastChainWork === vbf.lastChainWork
        ) {
          if (vbf.fileId) hbf.fileId = vbf.fileId // Update fileId if provided
          r.unchanged.push(bfdToInfo(hbf))
        } else {
          await this.update(vbf, hbf, r)
        }
      } else {
        const added = this.add(vbf)
        r.inserted.push(added)
        if (this.storage) {
          added.fileId = await this.storage.insertBulkFile(added)
          vbf.fileId = added.fileId // Update vbf with the fileId
        }
      }
    }
    logger(`BulkFileDataManager.merge:\n${this.toLogString(r)}\n`)
    return r
  }

  toLogString(what?: BulkFileDataManagerMergeResult | BulkFileData[] | BulkHeaderFileInfo[]): string {
    let log = ''
    if (!what) {
      log += this.toLogString(this.bfds)
    } else if (what['updated']) {
      what = what as BulkFileDataManagerMergeResult
      for (const { category, bfds } of [
        { category: 'unchanged', bfds: what.unchanged },
        { category: 'dropped', bfds: what.dropped },
        { category: 'updated', bfds: what.updated },
        { category: 'inserted', bfds: what.inserted },
      ]) {
        if (bfds.length > 0) {
          log += `  ${category}:\n`
          log += this.toLogString(bfds)
        }
      }
    } else if (Array.isArray(what)) {
      what = what as BulkHeaderFileInfo[]
      let i = -1
      for (const bfd of what) {
        i++
        log += `  ${i}: ${bfd.fileName} fileId=${bfd.fileId} ${bfd.firstHeight}-${bfd.firstHeight + bfd.count - 1}\n`
      }
    }
    
    return log
  }

  async mergeIncrementalBlockHeaders(newBulkHeaders: BlockHeader[], lastChainWork: string): Promise<void> {
    return this.lock.withWriteLock(async () => {
      const lbf = this.getLastFileNoLock()
      if (!lbf || lbf.firstHeight + lbf.count !== newBulkHeaders[0].height) {
        throw new WERR_INVALID_PARAMETER('headers', 'an extension of existing bulk headers')
      }
      if (!lbf.lastHash) {
        throw new WERR_INTERNAL(`lastHash is not defined for the last bulk file ${lbf.fileName}`)
      }

      const fbh = newBulkHeaders[0]
      const lbh = newBulkHeaders.slice(-1)[0]
      const data = serializeBaseBlockHeaders(newBulkHeaders)

      const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
      const bf: BulkHeaderFileInfo = {
        fileId: undefined,
        chain: this.chain,
        sourceUrl: undefined,
        fileName: 'incremental',
        firstHeight: fbh.height,
        count: newBulkHeaders.length,
        prevChainWork: lbf.lastChainWork,
        lastChainWork: lastChainWork,
        prevHash: lbf.lastHash,
        lastHash: lbh.hash,
        fileHash,
        data
      }
      await this.mergeNoLock([bf])
    })
  }

  async getBulkFiles(): Promise<BulkHeaderFileInfo[]> {
    return this.lock.withReadLock(async () => {
      return this.bfds.map(bfd => bfdToInfo(bfd))
    })
  }

  async getHeightRange(): Promise<HeightRange> {
    return this.lock.withReadLock(async () => {
      if (this.bfds.length === 0) return HeightRange.empty
      const first = this.bfds[0]
      const last = this.bfds[this.bfds.length - 1]
      return new HeightRange(first.firstHeight, last.firstHeight + last.count - 1)
    })
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> {
    return this.lock.withReadLock(async () => {
      if (!Number.isInteger(height) || height < 0)
        throw new WERR_INVALID_PARAMETER('height', `a non-negative integer (${height}).`)
      const file = this.bfds.find(f => f.firstHeight <= height && f.firstHeight + f.count > height)
      if (!file) return undefined
      const offset = (height - file.firstHeight) * 80
      let data: Uint8Array | undefined
      if (file.data) {
        data = file.data.slice(offset, offset + 80)
      } else if (file.fileId && this.storage) {
        data = await this.storage.getBulkFileData(file.fileId, offset, 80)
      }
      if (!data) {
        await this.ensureData(file)
        if (file.data) data = file.data.slice(offset, offset + 80)
      }
      if (!data) return undefined
      const header = deserializeBlockHeader(data, 0, height)
      return header
    })
  }

  async getFileForHeight(height: number): Promise<BulkHeaderFileInfo | undefined> {
    return this.lock.withReadLock(async () => {
      const bfd = this.getBfdForHeight(height)
      if (!bfd) return undefined
      return bfdToInfo(bfd)
    })
  }

  private getBfdForHeight(height: number): BulkFileData | undefined {
    if (!Number.isInteger(height) || height < 0)
      throw new WERR_INVALID_PARAMETER('height', `a non-negative integer (${height}).`)
    const file = this.bfds.find(f => f.firstHeight <= height && f.firstHeight + f.count > height)
    return file
  }

  private getLastBfd(fromEnd = 1): BulkFileData | undefined {
    if (this.bfds.length < fromEnd) return undefined
    const bfd = this.bfds[this.bfds.length - fromEnd]
    return bfd
  }

  async getLastFile(fromEnd = 1): Promise<BulkHeaderFileInfo | undefined> {
    return this.lock.withReadLock(async () => this.getLastFile(fromEnd))
  }

  private getLastFileNoLock(fromEnd = 1): BulkHeaderFileInfo | undefined {
    const bfd = this.getLastBfd(fromEnd)
    if (!bfd) return undefined
    return bfdToInfo(bfd)
  }

  private async getDataByFileHash(fileHash: string): Promise<Uint8Array | undefined> {
    const index = this.fileHashToIndex[fileHash]
    if (index === undefined)
      throw new WERR_INVALID_PARAMETER('fileHash', `known to the BulkFileDataManager. ${fileHash} is unknown.`)
    const bfd = this.bfds[index]
    const data = await this.ensureData(bfd)
    return data
  }

  private async getDataByFileId(fileId: number): Promise<Uint8Array | undefined> {
    const bfd = this.bfds.find(f => f.fileId === fileId)
    if (bfd === undefined)
      throw new WERR_INVALID_PARAMETER('fileId', `known to the BulkFileDataManager. ${fileId} is unknown.`)
    const data = await this.ensureData(bfd)
    return data
  }

  private async validateFileInfo(file: BulkHeaderFileInfo): Promise<BulkFileData> {
    if (file.chain !== this.chain) throw new WERR_INVALID_PARAMETER('chain', `${this.chain}`)
    if (file.count <= 0)
      throw new WERR_INVALID_PARAMETER('bf.count', `expected count to be greater than 0, but got ${file.count}`)
    if (file.count > this.maxPerFile && file.fileName !== 'incremental')
      throw new WERR_INVALID_PARAMETER('count', `less than or equal to maxPerFile ${this.maxPerFile}`)
    if (!file.fileHash) throw new WERR_INVALID_PARAMETER('fileHash', `defined`)
    if (!file.sourceUrl && !file.fileId && !file.data)
      throw new WERR_INVALID_PARAMETER('data', `defined when sourceUrl and fileId are undefined`)

    let bfd: BulkFileData = {
      ...file,
      fileHash: file.fileHash,
      mru: Date.now()
    }

    if (!bfd.validated) {
      await this.ensureData(bfd)

      if (!bfd.data || bfd.data.length !== bfd.count * 80)
        throw new WERR_INVALID_PARAMETER(
          'file.data',
          `bulk file ${bfd.fileName} data length ${bfd.data?.length} does not match expected count ${bfd.count}`
        )

      bfd.fileHash = asString(Hash.sha256(asArray(bfd.data)), 'base64')
      if (file.fileHash && file.fileHash !== bfd.fileHash)
        throw new WERR_INVALID_PARAMETER('file.fileHash', `expected ${file.fileHash} but got ${bfd.fileHash}`)

      if (!isKnownValidBulkHeaderFile(bfd)) {
        const pbf = bfd.firstHeight > 0 ? this.getBfdForHeight(bfd.firstHeight - 1) : undefined
        const prevHash = pbf ? pbf.lastHash! : '00'.repeat(32)
        const prevChainWork = pbf ? pbf.lastChainWork : '00'.repeat(32)

        const { lastHeaderHash, lastChainWork } = validateBufferOfHeaders(
          bfd.data,
          prevHash,
          0,
          undefined,
          prevChainWork
        )

        if (bfd.lastHash && bfd.lastHash !== lastHeaderHash)
          throw new WERR_INVALID_PARAMETER('file.lastHash', `expected ${bfd.lastHash} but got ${lastHeaderHash}`)
        if (bfd.lastChainWork && bfd.lastChainWork !== lastChainWork)
          throw new WERR_INVALID_PARAMETER(
            'file.lastChainWork',
            `expected ${bfd.lastChainWork} but got ${lastChainWork}`
          )

        bfd.lastHash = lastHeaderHash
        bfd.lastChainWork = lastChainWork!

        if (bfd.firstHeight === 0) {
          validateGenesisHeader(bfd.data, bfd.chain!)
        }
      }
      bfd.validated = true
    }

    return bfd
  }

  private validateBfdForAdd(bfd: BulkFileData): void {
    if (this.bfds.length === 0 && bfd.firstHeight !== 0)
      throw new WERR_INVALID_PARAMETER('firstHeight', `0 for the first file`)
    if (this.bfds.length > 0) {
      const last = this.bfds[this.bfds.length - 1]
      if (bfd.firstHeight !== last.firstHeight + last.count)
        throw new WERR_INVALID_PARAMETER('firstHeight', `the last file's firstHeight + count`)
      if (bfd.prevHash !== last.lastHash || bfd.prevChainWork !== last.lastChainWork)
        throw new WERR_INVALID_PARAMETER('prevHash/prevChainWork', `the last file's lastHash/lastChainWork`)
    }
  }

  private add(bfd: BulkFileData): BulkHeaderFileInfo {
    this.validateBfdForAdd(bfd)
    const index = this.bfds.length
    this.bfds.push(bfd)
    this.fileHashToIndex[bfd.fileHash] = index
    this.ensureMaxRetained()
    return bfdToInfo(bfd)
  }

  private replaceBfdAtIndex(index: number, update: BulkFileData): void {
    const oldBfd = this.bfds[index]
    delete this.fileHashToIndex[oldBfd.fileHash]
    this.bfds[index] = update
    this.fileHashToIndex[update.fileHash] = index
  }

  /**
   * Updating an existing file occurs in two specific contexts:
   *
   * 1. CDN Update: CDN files of a specific `maxPerFile` series typically ends in a partial file
   * which may periodically add more headers until the next file is started.
   * If the CDN update is the second to last file (followed by an incremental file),
   * then the incremental file is updated or deleted and also returned as the result (with a count of zero if deleted).
   *
   * 2. Incremental Update: The last bulk file is almost always an "incremental" file
   * which is not limited by "maxPerFile" and holds all non-CDN bulk headers.
   * If is updated with new bulk headers which come either from non CDN ingestors or from live header migration to bulk.
   *
   * Updating preserves the following properties:
   *
   * - Any existing headers following this update are preserved and must form an unbroken chain.
   * - There can be at most one incremental file and it must be the last file.
   * - The update start conditions (height, prevHash, prevChainWork) must match an existing file which may be either CDN or internal.
   * - The update fileId must match, it may be undefind.
   * - The fileName does not need to match.
   * - The incremental file must always have fileName "incremental" and sourceUrl must be undefined.
   * - The update count must be greater than 0.
   * - The update count must be greater than current count for CDN to CDN update.
   *
   * @param update new validated BulkFileData to update.
   * @param hbf corresponding existing BulkFileData to update.
   */
  private async update(update: BulkFileData, hbf: BulkFileData, r: BulkFileDataManagerMergeResult): Promise<void> {
    if (
      !hbf ||
      hbf.firstHeight !== update.firstHeight ||
      hbf.prevChainWork !== update.prevChainWork ||
      hbf.prevHash !== update.prevHash
    )
      throw new WERR_INVALID_PARAMETER('file', `an existing file by height, prevChainWork and prevHash`)
    if (update.count <= hbf.count)
      throw new WERR_INVALID_PARAMETER('file.count', `greater than the current count ${hbf.count}`)

    const lbf = this.getLastBfd()!
    let index = this.bfds.length - 1
    let truncate: BulkFileData | undefined = undefined
    let replaced: BulkFileData | undefined = undefined
    let drop: BulkFileData | undefined = undefined

    if (hbf.firstHeight === lbf.firstHeight) {
      // If the update is for the last file, there are three cases:

      if (isBdfIncremental(update)) {
        // 1. Incremental file may only be extended with more incremental headers.
        if (!isBdfIncremental(lbf))
          throw new WERR_INVALID_PARAMETER('file', `an incremental file to update an existing incremental file`)
      } else {
        // The update is a CDN bulk file.
        if (isBdfCdn(lbf)) {
          // 2. An updated CDN file replaces a partial CDN file.
          if (update.count <= lbf.count)
            throw new WERR_INVALID_PARAMETER('update.count', `CDN update must have more headers. ${update.count} <= ${lbf.count}`)
        } else {
          // 3. A new CDN file replaces some or all of current incremental file.
          // Retain extra incremental headers if any.
          if (update.count < lbf.count) {
            // The new CDN partially replaces the last incremental file, prepare to shift work and re-add it.
            await this.ensureData(lbf)
            truncate = lbf
          }
        }
      }
    } else {
      // If the update is NOT for the last file, then it MUST be for the second to last file which MUST be a CDN file:
      // - it must be a CDN file update with more headers than the current CDN file.
      // - the last file must be an incremental file which is updated or deleted. The updated (or deleted) last file is returned.
      const lbf2 = this.getLastBfd(2)
      if (!lbf2 || hbf.firstHeight !== lbf2.firstHeight)
        throw new WERR_INVALID_PARAMETER('file', `an update to last or second to last file`)
      if (!isBdfCdn(update) || !isBdfCdn(lbf2) || update.count <= lbf2.count)
        throw new WERR_INVALID_PARAMETER('file', `a CDN file update with more headers than the current CDN file`)
      if (!isBdfIncremental(lbf))
        throw new WERR_INVALID_PARAMETER('file', `a CDN file update followed by an incremental file`)
      if (update.count >= lbf2.count + lbf.count) {
        // The current last file is fully replaced by the CDN update.
        drop = lbf
      } else {
        // If the update doesn't fully replace the last incremental file, make sure data is available to be truncated.
        await this.ensureData(lbf)
        truncate = lbf
        // The existing second to last file is fully replaced by the update.
        replaced = lbf2
      }

      index = index - 1 // The update replaces the second to last file.
    }

    // In all cases the bulk file at the current fileId if any is updated.
    this.replaceBfdAtIndex(index, update)
    if (truncate) {
      // If there is a bulk file to be truncated, it becomes the new (reduced) last file.
      await this.shiftWork(update, truncate, replaced)
    }
    if (drop) {
      this.dropLastBulkFile(drop)
    }

    const updateInfo = bfdToInfo(update)
    const truncateInfo = truncate ? bfdToInfo(truncate) : undefined

    if (this.storage) {
      // Keep storage in sync.
      if (update.fileId) {
        await this.storage.updateBulkFile(update.fileId, updateInfo)
      }
      if (truncate && truncateInfo) {
        if (replaced) {
          await this.storage.updateBulkFile(truncate.fileId!, truncateInfo)
        } else {
          truncateInfo.fileId = undefined // Make sure truncate is a new file.
          await this.storage.insertBulkFile(truncateInfo)
          truncate.fileId = truncateInfo.fileId // Update truncate with the new fileId.
        }
      }
      if (drop && drop.fileId) {
        await this.storage.deleteBulkFile(drop.fileId)
      }
    }

    if (r) {
      // Update results for logging...
      r.updated.push(updateInfo)
      if (truncateInfo) {
        if (replaced) {
          r.updated.push(truncateInfo)
        } else {
          r.inserted.push(truncateInfo)
        }
      }
      if (drop) {
        r.dropped.push(bfdToInfo(drop))
      }
    }

    this.ensureMaxRetained()
  }

  private dropLastBulkFile(lbf: BulkFileData): void {
    delete this.fileHashToIndex[lbf.fileHash]
    const index = this.bfds.indexOf(lbf)
    if (index !== this.bfds.length - 1)
      throw new WERR_INTERNAL(`dropLastBulkFile requires lbf is the current last file.`)
    this.bfds.pop()
  }

  /**
   * Remove work (and headers) from `truncate` that now exists in `update`.
   * @param update the new update file which has already replaced the truncate file.
   * @param truncate the file to truncate and add as a new file.
   */
  private async shiftWork(update: BulkFileData, truncate: BulkFileData, replaced?: BulkFileData): Promise<void> {
    const updateIndex = this.fileHashToIndex[update.fileHash]
    if (updateIndex === undefined || updateIndex != this.bfds.length - 1)
      throw new WERR_INTERNAL(`shiftWork requires update be the last file, already having replaced file to be truncated.`)
    // truncateIndex will be undefined if the update replaces it and it must become the new last file.
    // truncateIndex will be updateIndex + 1 if the existing last file is being truncated and update is second to last.
    const truncateIndex = this.fileHashToIndex[truncate.fileHash]
    if (truncateIndex !== undefined && truncateIndex !== updateIndex + 1)
      throw new WERR_INTERNAL(`shiftWork requires update to have replaced truncate or truncate to follow update`)
    if (truncateIndex !== undefined && !replaced)
      throw new WERR_INTERNAL(`shiftWork requires valid replaced when update hasn't replaced truncate`)

    let work = subWork(update.lastChainWork, update.prevChainWork)
    let count = update.count
    if (replaced) {
      const repWork = subWork(replaced.lastChainWork, replaced.prevChainWork)
      work = subWork(work, repWork)
      count += replaced.count
    } else {
      // The truncated file is itself being replaced by the update and must be inserted as a new file.
      truncate.fileId = undefined
      this.bfds.push(truncate) // Add the truncated file as a new entry.
    }

    truncate.prevChainWork = update.lastChainWork
    truncate.prevHash = update.lastHash!

    truncate.lastChainWork = subWork(truncate.lastChainWork, work)
    truncate.count -= count
    truncate.firstHeight += count

    truncate.data = truncate.data?.slice(count * 80)
    delete this.fileHashToIndex[truncate.fileHash]
    truncate.fileHash = asString(Hash.sha256(asArray(truncate.data!)), 'base64')
    this.fileHashToIndex[truncate.fileHash] = updateIndex + 1
  }

  /**
   * 
   * @param bfd 
   * @returns 
   */
  private async ensureData(bfd: BulkFileData): Promise<Uint8Array> {
    if (bfd.data) return bfd.data

    if (this.storage && bfd.fileId) {
      bfd.data = await this.storage.getBulkFileData(bfd.fileId)
      if (!bfd.data) throw new WERR_INVALID_PARAMETER('fileId', `data not found for fileId ${bfd.fileId}`)
    }

    if (!bfd.data && this.fetch && bfd.sourceUrl) {
      const url = this.fetch.pathJoin(bfd.sourceUrl, bfd.fileName)
      bfd.data = await this.fetch.download(url)
      if (!bfd.data) throw new WERR_INVALID_PARAMETER('sourceUrl', `data not found for sourceUrl ${url}`)
    }

    if (!bfd.data) throw new WERR_INVALID_PARAMETER('data', `defined. Unable to retrieve data for ${bfd.fileName}`)

    bfd.mru = Date.now()

    // Validate retrieved data.
    const fileHash = asString(Hash.sha256(asArray(bfd.data)), 'base64')
    if (fileHash !== bfd.fileHash)
      throw new WERR_INVALID_PARAMETER('fileHash', `does not match retrieved data for ${bfd.fileName}`)

    this.ensureMaxRetained()
    return bfd.data
  }

  private ensureMaxRetained(): void {
    if (this.maxRetained === undefined) return
    let withData = this.bfds.filter(bfd => bfd.data && (bfd.fileId || bfd.sourceUrl))
    let countToRelease = withData.length - this.maxRetained
    if (countToRelease <= 0) return
    const sorted = withData.sort((a, b) => a.mru - b.mru)
    while (countToRelease-- > 0 && sorted.length > 0) {
      const oldest = sorted.shift()!
      // Release the least recently used data
      oldest.data = undefined // Release the data
    }
  }
}

interface BulkFileData extends BulkHeaderFileInfo {
  mru: number
  fileHash: string
}

export function selectBulkHeaderFiles(
  files: BulkHeaderFileInfo[],
  chain: Chain,
  maxPerFile: number
): BulkHeaderFileInfo[] {
  const r: BulkHeaderFileInfo[] = []
  let height = 0
  for (;;) {
    const choices = files.filter(f => f.firstHeight === height && f.count <= maxPerFile && f.chain === chain)
    // Pick the file with the maximum count
    const choice = choices.reduce((a, b) => (a.count > b.count ? a : b), choices[0])
    if (!choice) break // no more files to select
    r.push(choice)
    height += choice.count
  }
  return r
}

function isBdfIncremental(bfd: BulkFileData | BulkHeaderFileInfo): boolean {
  return bfd.fileName === 'incremental' && !bfd.sourceUrl
}

function isBdfCdn(bfd: BulkFileData | BulkHeaderFileInfo): boolean {
  return !isBdfIncremental(bfd)
}

function bfdToInfo(bfd: BulkFileData): BulkHeaderFileInfo {
  return {
    chain: bfd.chain,
    fileHash: bfd.fileHash,
    fileName: bfd.fileName,
    sourceUrl: bfd.sourceUrl,
    fileId: bfd.fileId,
    count: bfd.count,
    prevChainWork: bfd.prevChainWork,
    lastChainWork: bfd.lastChainWork,
    firstHeight: bfd.firstHeight,
    prevHash: bfd.prevHash,
    lastHash: bfd.lastHash,
    data: undefined
  }
}

/**
 * A reader-writer lock to manage concurrent access.
 * Allows multiple readers or one writer at a time.
 */
class Lock {
  private readers: number = 0
  private writerActive: boolean = false
  private readerQueue: Array<() => void> = []
  private writerQueue: Array<() => void> = []

  private checkQueues(): void {
    if (this.writerActive || this.readers > 0) return
    if (this.writerQueue.length > 0) {
      // If there are waiting writers and no active readers or writers, start the next writer
      const resolve = this.writerQueue.shift()!
      resolve()
    } else if (this.readerQueue.length > 0) {
      // If there are waiting readers and no waiting writers, start all readers
      const readers = this.readerQueue.splice(0)
      for (const resolve of readers) {
        resolve()
      }
    }
  }

  async withReadLock<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.writerActive && this.writerQueue.length === 0) {
      // Fast path: no active writer or waiting writers, proceed immediately
      this.readers++
      try {
        return await fn()
      } finally {
        this.readers--
        this.checkQueues()
      }
    } else {
      // Queue the reader until writers are done
      const promise = new Promise<void>(resolve => {
        this.readerQueue.push(resolve)
      })
      await promise
      this.readers++
      try {
        return await fn()
      } finally {
        this.readers--
        this.checkQueues()
      }
    }
  }

  async withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
    const promise = new Promise<void>(resolve => {
      this.writerQueue.push(resolve)
    })
    await promise
    this.writerActive = true
    try {
      return await fn()
    } finally {
      this.writerActive = false
      this.checkQueues()
    }
  }
}
