import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { BlockHeader, Chain, WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { Hash } from '@bsv/sdk'
import { asArray, asString, asUint8Array } from '../../../../utility/utilityHelpers.noBuffer'
import { BulkHeaderFileInfo, BulkHeaderFilesInfo } from './BulkHeaderFile'
import { isKnownValidBulkHeaderFile, validBulkHeaderFiles } from './validBulkHeaderFilesByFileHash'
import { HeightRange } from './HeightRange'
import {
  addWork,
  convertBitsToWork,
  deserializeBlockHeader,
  serializeBaseBlockHeaders,
  subWork,
  validateBufferOfHeaders,
  validateGenesisHeader
} from './blockHeaderUtilities'
import { ChaintracksStorageBulkFileApi } from '../Api/ChaintracksStorageApi'
import { ChaintracksFetch } from './ChaintracksFetch'
import { logger } from '../../../../../test/utils/TestUtilsWalletStorage'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { SingleWriterMultiReaderLock } from './SingleWriterMultiReaderLock'

export interface BulkFileDataManagerOptions {
  chain: Chain
  maxPerFile: number
  maxRetained?: number
  fetch?: ChaintracksFetchApi
  fromKnownSourceUrl?: string
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
  private lock: SingleWriterMultiReaderLock = new SingleWriterMultiReaderLock()
  private storage?: ChaintracksStorageBulkFileApi

  readonly chain: Chain
  readonly maxPerFile: number
  readonly fetch?: ChaintracksFetchApi
  readonly maxRetained?: number
  readonly fromKnownSourceUrl?: string

  constructor(options: BulkFileDataManagerOptions | Chain) {
    if (typeof options === 'object') options = options as BulkFileDataManagerOptions
    else options = BulkFileDataManager.createDefaultOptions(options as Chain)
    this.chain = options.chain
    this.maxPerFile = options.maxPerFile
    this.maxRetained = options.maxRetained
    this.fromKnownSourceUrl = options.fromKnownSourceUrl
    this.fetch = options.fetch

    this.deleteBulkFilesNoLock()
  }

  async createReader(range?: HeightRange, maxBufferSize?: number): Promise<BulkFileDataReader> {
    range = range || (await this.getHeightRange())
    maxBufferSize = maxBufferSize || 1000000 * 80 // 100,000 headers, 8MB
    return new BulkFileDataReader(this, range, maxBufferSize)
  }

  async updateFromUrl(cdnUrl: string): Promise<void> {
    if (!this.fetch) throw new WERR_INVALID_OPERATION('fetch is not defined in the BulkFileDataManager.')

    const toUrl = (file: string) => this.fetch!.pathJoin(cdnUrl, file)
    const url = toUrl(`${this.chain}NetBlockHeaders.json`)

    const availableBulkFiles = (await this.fetch.fetchJson(url)) as BulkHeaderFilesInfo
    if (!availableBulkFiles)
      throw new WERR_INVALID_PARAMETER(`cdnUrl`, `a valid BulkHeaderFilesInfo JSON resource available from ${url}`)

    const selectedFiles = selectBulkHeaderFiles(
      availableBulkFiles.files,
      this.chain,
      this.maxPerFile || availableBulkFiles.headersPerFile
    )
    for (const bf of selectedFiles) {
      if (!bf.fileHash) {
        throw new WERR_INVALID_PARAMETER(`fileHash`, `valid for all files in json downloaded from ${url}`)
      }
      if (!bf.chain || bf.chain !== this.chain) {
        throw new WERR_INVALID_PARAMETER(`chain`, `"${this.chain}" for all files in json downloaded from ${url}`)
      }
      if (!bf.sourceUrl || bf.sourceUrl !== cdnUrl) bf.sourceUrl = cdnUrl
    }

    const rangeBefore = await this.getHeightRange()
    const r = await this.merge(selectedFiles)
    const rangeAfter = await this.getHeightRange()

    let log = 'BulkDataFileManager.updateFromUrl\n'
    log += `  url: ${url}\n`
    log += `  bulk range before: ${rangeBefore}\n`
    log += `  bulk range after:  ${rangeAfter}\n`
    logger(log)
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
        await this.ensureData(bfd)
        bfd.fileId = await this.storage.insertBulkFile(bfdToInfo(bfd, true))
      }
    } else {
      // 2. bfds are a prefix of storage, including last bfd having same firstHeight but possibly fewer headers: Merge storage to bfds.
      const r = await this.mergeNoLock(sfs)
    }
  }

  async deleteBulkFiles(): Promise<void> {
    return this.lock.withWriteLock(async () => this.deleteBulkFilesNoLock())
  }

  private deleteBulkFilesNoLock(): void {
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
      const hbf = this.getBfdForHeight(file.firstHeight)
      if (hbf && file.fileId) hbf.fileId = file.fileId // Always update fileId if provided
      const lbf = this.getLastBfd()
      if (
        hbf &&
        hbf.fileHash === file.fileHash &&
        hbf.count === file.count &&
        hbf.lastHash === file.lastHash &&
        hbf.lastChainWork === file.lastChainWork
      ) {
        // We already have an identical matching file...
        r.unchanged.push(bfdToInfo(hbf))
        continue
      }
      const vbf: BulkFileData = await this.validateFileInfo(file)
      if (hbf) {
        // We have a matching file by firstHeight but count and fileHash differ
        await this.update(vbf, hbf, r)
      } else if (isBdfIncremental(vbf) && lbf && isBdfIncremental(lbf)) {
        await this.mergeIncremental(lbf, vbf, r)
      } else {
        const added = this.add(vbf)
        r.inserted.push(added)
        if (this.storage) {
          vbf.fileId = await this.storage.insertBulkFile(added)
        }
      }
    }
    logger(`BulkFileDataManager.merge:\n${this.toLogString(r)}\n`)
    return r
  }

  private async mergeIncremental(lbf: BulkFileData, vbf: BulkFileData, r: BulkFileDataManagerMergeResult) {
    lbf.count += vbf.count
    lbf.lastHash = vbf.lastHash
    lbf.lastChainWork = vbf.lastChainWork
    await this.ensureData(lbf)
    const newData = new Uint8Array(lbf.data!.length + vbf.data!.length)
    newData.set(lbf.data!)
    newData.set(vbf.data!, lbf.data!.length)
    lbf.data = newData
    delete this.fileHashToIndex[lbf.fileHash!]
    lbf.fileHash = asString(Hash.sha256(asArray(newData)), 'base64')
    this.fileHashToIndex[lbf.fileHash] = this.bfds.length - 1
    lbf.mru = Date.now()
    const lbfInfo = bfdToInfo(lbf, true)
    r.updated.push(lbfInfo)
    if (this.storage && lbf.fileId) {
      await this.storage.updateBulkFile(lbf.fileId, lbfInfo)
    }
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
        { category: 'inserted', bfds: what.inserted }
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

  async mergeIncrementalBlockHeaders(newBulkHeaders: BlockHeader[], incrementalChainWork?: string): Promise<void> {
    if (newBulkHeaders.length === 0) return
    return this.lock.withWriteLock(async () => {
      const lbf = this.getLastFileNoLock()
      const nextHeight = lbf ? lbf.firstHeight + lbf.count : 0
      if (nextHeight > 0 && newBulkHeaders.length > 0 && newBulkHeaders[0].height < nextHeight) {
        // Don't modify the incoming array...
        newBulkHeaders = [...newBulkHeaders]
        // If we have more headers than we need, drop the incoming headers.
        while (newBulkHeaders.length > 0 && newBulkHeaders[0].height < nextHeight) {
          const h = newBulkHeaders.shift()
          if (h && incrementalChainWork) {
            incrementalChainWork = subWork(incrementalChainWork, convertBitsToWork(h.bits))
          }
        }
      }
      if (newBulkHeaders.length === 0) return
      if (!lbf || nextHeight !== newBulkHeaders[0].height)
        throw new WERR_INVALID_PARAMETER('newBulkHeaders', 'an extension of existing bulk headers')
      if (!lbf.lastHash) throw new WERR_INTERNAL(`lastHash is not defined for the last bulk file ${lbf.fileName}`)

      const fbh = newBulkHeaders[0]
      const lbh = newBulkHeaders.slice(-1)[0]
      let lastChainWork = lbf.lastChainWork
      if (incrementalChainWork) {
        lastChainWork = addWork(incrementalChainWork, lastChainWork)
      } else {
        // If lastChainWork is not provided, calculate it from the last file with basic validation.
        let lastHeight = lbf.firstHeight + lbf.count - 1
        let lastHash = lbf.lastHash
        for (const h of newBulkHeaders) {
          if (h.height !== lastHeight + 1 || h.previousHash !== lastHash) {
            throw new WERR_INVALID_PARAMETER(
              'headers',
              `an extension of existing bulk headers, header with height ${h.height} is non-sequential`
            )
          }
          lastChainWork = addWork(lastChainWork, convertBitsToWork(h.bits))
          lastHeight = h.height
          lastHash = h.hash
        }
      }
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
        lastChainWork,
        prevHash: lbf.lastHash,
        lastHash: lbh.hash,
        fileHash,
        data
      }
      await this.mergeNoLock([bf])
    })
  }

  async getBulkFiles(keepData?: boolean): Promise<BulkHeaderFileInfo[]> {
    return this.lock.withReadLock(async () => {
      return this.bfds.map(bfd => bfdToInfo(bfd, keepData))
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

  async getDataFromFile(file: BulkHeaderFileInfo, offset?: number, length?: number): Promise<Uint8Array | undefined> {
    const bfd = await this.getBfdForHeight(file.firstHeight)
    if (!bfd || bfd.count < file.count)
      throw new WERR_INVALID_PARAMETER(
        'file',
        `a match for ${file.firstHeight}, ${file.count} in the BulkFileDataManager.`
      )
    return this.lock.withReadLock(async () => this.getDataFromFileNoLock(bfd, offset, length))
  }

  private async getDataFromFileNoLock(
    bfd: BulkFileData,
    offset?: number,
    length?: number
  ): Promise<Uint8Array | undefined> {
    const fileLength = bfd.count * 80
    offset = offset || 0
    if (offset > fileLength - 1) return undefined
    length = length || bfd.count * 80 - offset
    length = Math.min(length, fileLength - offset)
    let data: Uint8Array | undefined
    if (bfd.data) {
      data = bfd.data.slice(offset, offset + length)
    } else if (bfd.fileId && this.storage) {
      data = await this.storage.getBulkFileData(bfd.fileId, offset, length)
    }
    if (!data) {
      await this.ensureData(bfd)
      if (bfd.data) data = bfd.data.slice(offset, offset + length)
    }
    if (!data) return undefined
    return data
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> {
    return this.lock.withReadLock(async () => {
      if (!Number.isInteger(height) || height < 0)
        throw new WERR_INVALID_PARAMETER('height', `a non-negative integer (${height}).`)
      const file = this.bfds.find(f => f.firstHeight <= height && f.firstHeight + f.count > height)
      if (!file) return undefined
      const offset = (height - file.firstHeight) * 80
      const data = await this.getDataFromFileNoLock(file, offset, 80)
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
    return this.lock.withReadLock(async () => this.getLastFileNoLock(fromEnd))
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

  async ReValidate(): Promise<void> {
    return this.lock.withReadLock(async () => this.ReValidateNoLock())
  }

  private async ReValidateNoLock(): Promise<void> {
    for (const file of this.bfds) {
      await this.ensureData(file)
      file.validated = false // Reset validation to re-validate on next access
      const bfd = await this.validateFileInfo(file)
      if (!bfd.validated) throw new WERR_INTERNAL(`BulkFileDataManager.ReValidate failed for file ${bfd.fileName}`)
      file.validated = true
    }
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
    return bfdToInfo(bfd, true)
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
    if (isBdfCdn(update) === isBdfCdn(hbf) && update.count <= hbf.count)
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
            throw new WERR_INVALID_PARAMETER(
              'update.count',
              `CDN update must have more headers. ${update.count} <= ${lbf.count}`
            )
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
      if (!update.fileId) update.fileId = lbf2.fileId // Update fileId if not provided
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

    const updateInfo = bfdToInfo(update, true)
    const truncateInfo = truncate ? bfdToInfo(truncate, true) : undefined

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
          truncate.fileId = await this.storage.insertBulkFile(truncateInfo)
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
   * There are two scenarios:
   * 1. `replaced` is undefined: update is a CDN file that splits an incremental file that must be truncated.
   * 2. `replaced` is valid: update is a CDN update that replaced an existing CDN file and splits an incremental file that must be truncated.
   * @param update the new CDN update file.
   * @param truncate the incremental file to be truncated (losing work which now exists in `update`).
   * @param replaced the existing CDN file that was replaced by `update` (if any).
   */
  private async shiftWork(update: BulkFileData, truncate: BulkFileData, replaced?: BulkFileData): Promise<void> {
    const updateIndex = this.fileHashToIndex[update.fileHash]
    // replaced will be valid if the update replaced it and it must become the new last file.
    // truncateIndex will be updateIndex + 1 if the existing last file is being truncated and update is second to last.
    const truncateIndex = this.fileHashToIndex[truncate.fileHash]
    if (truncateIndex !== undefined && truncateIndex !== updateIndex + 1)
      throw new WERR_INTERNAL(`shiftWork requires update to have replaced truncate or truncate to follow update`)
    if (truncateIndex !== undefined && !replaced)
      throw new WERR_INTERNAL(`shiftWork requires valid replaced when update hasn't replaced truncate`)

    truncate.prevHash = update.lastHash!
    truncate.prevChainWork = update.lastChainWork
    // truncate.lastChainWork, truncate.lastHash remain unchanged
    let count = update.count
    if (replaced) {
      count -= replaced.count
    } else {
      // The truncated file is itself being replaced by the update and must be inserted as a new file.
      truncate.fileId = undefined
      this.bfds.push(truncate) // Add the truncated file as a new entry.
    }
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
      if (!bfd.data) throw new WERR_INVALID_PARAMETER('fileId', `valid, data not found for fileId ${bfd.fileId}`)
    }

    if (!bfd.data && this.fetch && bfd.sourceUrl) {
      // TODO - restore this change
      const url = this.fetch.pathJoin(bfd.sourceUrl, bfd.fileName)
      //const url = this.fetch.pathJoin('http://localhost:8842/blockheaders', bfd.fileName)

      try {
        bfd.data = await this.fetch.download(url)
      } catch (err) {
        bfd.data = await this.fetch.download(url)
      }
      if (!bfd.data) throw new WERR_INVALID_PARAMETER('sourceUrl', `data not found for sourceUrl ${url}`)
    }

    if (!bfd.data) throw new WERR_INVALID_PARAMETER('data', `defined. Unable to retrieve data for ${bfd.fileName}`)

    bfd.mru = Date.now()

    // Validate retrieved data.
    const fileHash = asString(Hash.sha256(asArray(bfd.data)), 'base64')
    if (fileHash !== bfd.fileHash)
      throw new WERR_INVALID_PARAMETER('fileHash', `a match for retrieved data for ${bfd.fileName}`)

    // To avoid having read lock access having to worry about data being dropped, only ensureMaxRetained
    // on inherently write operations (add, update).
    // This means there should be a method to call to force the count back down periodically (more often than add/update only): TODO.
    //this.ensureMaxRetained()
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

  async exportHeadersToFs(
    toFs: ChaintracksFsApi,
    toHeadersPerFile: number,
    toFolder: string,
    sourceUrl?: string,
    maxHeight?: number
  ): Promise<void> {
    const chain = this.chain
    const toFileName = (i: number) => `${chain}Net_${i}.headers`
    const toPath = (i: number) => toFs.pathJoin(toFolder, toFileName(i))
    const toJsonPath = () => toFs.pathJoin(toFolder, `${chain}NetBlockHeaders.json`)

    const toBulkFiles: BulkHeaderFilesInfo = {
      rootFolder: sourceUrl || toFolder,
      jsonFilename: `${chain}NetBlockHeaders.json`,
      headersPerFile: toHeadersPerFile,
      files: []
    }

    let range = await this.getHeightRange()
    if (maxHeight) range = range.intersect(new HeightRange(0, maxHeight))
    const reader = await this.createReader(range, toHeadersPerFile * 80)

    let firstHeight = 0
    let lastHeaderHash = '00'.repeat(32)
    let lastChainWork = '00'.repeat(32)

    let i = -1
    for (;;) {
      i++
      const data = await reader.read()
      if (!data || data.length === 0) {
        break
      }

      const last = validateBufferOfHeaders(data, lastHeaderHash, 0, undefined, lastChainWork)

      await toFs.writeFile(toPath(i), data)

      const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
      const file: BulkHeaderFileInfo = {
        chain,
        count: data.length / 80,
        fileHash,
        fileName: toFileName(i),
        firstHeight,
        lastChainWork: last.lastChainWork!,
        lastHash: last.lastHeaderHash,
        prevChainWork: lastChainWork,
        prevHash: lastHeaderHash,
        sourceUrl
      }
      toBulkFiles.files.push(file)
      firstHeight += file.count
      lastHeaderHash = file.lastHash!
      lastChainWork = file.lastChainWork!
    }

    await toFs.writeFile(toJsonPath(), asUint8Array(JSON.stringify(toBulkFiles), 'utf8'))
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

function bfdToInfo(bfd: BulkFileData, keepData?: boolean): BulkHeaderFileInfo {
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
    validated: bfd.validated || false,
    data: keepData ? bfd.data : undefined
  }
}

export interface BulkFileDataManagerMergeResult {
  unchanged: BulkHeaderFileInfo[]
  inserted: BulkHeaderFileInfo[]
  updated: BulkHeaderFileInfo[]
  dropped: BulkHeaderFileInfo[]
}

export class BulkFileDataReader {
  readonly manager: BulkFileDataManager
  readonly range: HeightRange
  readonly maxBufferSize: number
  nextHeight: number

  constructor(manager: BulkFileDataManager, range: HeightRange, maxBufferSize: number) {
    this.manager = manager
    this.range = range
    this.maxBufferSize = maxBufferSize
    this.nextHeight = range.minHeight
  }

  /**
   * Returns the Buffer of block headers from the given `file` for the given `range`.
   * If `range` is undefined, the file's full height range is read.
   * The returned Buffer will only contain headers in `file` and in `range`
   * @param file
   * @param range
   */
  private async readBufferFromFile(file: BulkHeaderFileInfo, range?: HeightRange): Promise<Uint8Array | undefined> {
    // Constrain the range to the file's contents...
    let fileRange = new HeightRange(file.firstHeight, file.firstHeight + file.count - 1)
    if (range) fileRange = fileRange.intersect(range)
    if (fileRange.isEmpty) return undefined
    const offset = (fileRange.minHeight - file.firstHeight) * 80
    const length = fileRange.length * 80
    return await this.manager.getDataFromFile(file, offset, length)
  }

  /**
   * @returns an array containing the next `maxBufferSize` bytes of headers from the files.
   */
  async read(): Promise<Uint8Array | undefined> {
    if (this.nextHeight === undefined || !this.range || this.range.isEmpty || this.nextHeight > this.range.maxHeight)
      return undefined
    let lastHeight = this.nextHeight + this.maxBufferSize / 80 - 1
    lastHeight = Math.min(lastHeight, this.range.maxHeight)
    let file = await this.manager.getFileForHeight(this.nextHeight)
    if (!file) throw new WERR_INTERNAL(`logic error`)
    const readRange = new HeightRange(this.nextHeight, lastHeight)
    let buffers = new Uint8Array(readRange.length * 80)
    let offset = 0
    while (file) {
      const buffer = await this.readBufferFromFile(file, readRange)
      if (!buffer) break
      buffers.set(buffer, offset)
      offset += buffer.length
      file = await this.manager.getFileForHeight(file.firstHeight + file.count)
    }
    if (!buffers.length || offset !== readRange.length * 80) return undefined
    this.nextHeight = lastHeight + 1
    return buffers
  }
}
