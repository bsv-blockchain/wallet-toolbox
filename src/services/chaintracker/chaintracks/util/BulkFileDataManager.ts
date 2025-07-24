import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { Chain, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { Hash } from '@bsv/sdk'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { BulkHeaderFileInfo } from './BulkHeaderFile'
import { validBulkHeaderFiles, validBulkHeaderFilesByFileHash } from './validBulkHeaderFilesByFileHash'

export interface BulkFileDataManagerOptions {
  chain: Chain
  maxPerFile: number
  maxRetained?: number
  fetch?: ChaintracksFetchApi
  find?: (fileId: number) => Promise<Uint8Array | undefined>
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
  private bfds: BulkFileData[] = []
  private fileHashToIndex: Record<string, number> = {}
  chain: Chain
  maxPerFile: number
  fetch?: ChaintracksFetchApi
  find?: (fileId: number) => Promise<Uint8Array | undefined>
  maxRetained?: number

  constructor(options: BulkFileDataManagerOptions) {
    this.chain = options.chain
    this.maxPerFile = options.maxPerFile
    this.maxRetained = options.maxRetained
    this.fetch = options.fetch
    this.find = options.find

    if (options.fromKnownSourceUrl) {
      const files = selectBulkHeaderFiles(validBulkHeaderFiles.filter(f => f.sourceUrl === options.fromKnownSourceUrl), options.chain, options.maxPerFile)
      const r = new BulkFileDataManager(options)
      r.add(files)
    }
  }

  getBulkFiles(): BulkHeaderFileInfo[] {
    return this.bfds.map(bfd => ({
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
    }))
  }

  async getData(fileHash: string): Promise<Uint8Array | undefined>
  {
    const index = this.fileHashToIndex[fileHash]
    if (index === undefined)
      throw new WERR_INVALID_PARAMETER('fileHash', `known to the BulkFileDataManager. ${fileHash} is unknown.`);
    const bfd = this.bfds[index]
    const data = await this.ensureData(bfd)
    return data
  }

  add(files: BulkHeaderFileInfo[]) : void {
    for (const file of files) {
      if (file.chain !== this.chain)
        throw new WERR_INVALID_PARAMETER('chain', `${this.chain}`);
      if (file.count > this.maxPerFile && file.fileName !== 'incremental')
        throw new WERR_INVALID_PARAMETER('count', `less than or equal to maxPerFile ${this.maxPerFile}`);
      if (!file.fileHash)
        throw new WERR_INVALID_PARAMETER('fileHash', `defined`);
      if (!file.sourceUrl && !file.fileId && !file.data)
        throw new WERR_INVALID_PARAMETER('data', `defined when sourceUrl and fileId are undefined`);
      const bfd: BulkFileData = {
        ...file,
        mru: Date.now(),
      }
      const index = this.bfds.length
      this.bfds.push(bfd)
      this.fileHashToIndex[file.fileHash] = index
    }
    this.ensureMaxRetained()
  }

  private async ensureData(bfd: BulkFileData): Promise<Uint8Array | undefined>
  {
    if (bfd.data) return bfd.data

    if (this.find && bfd.fileId) {
      bfd.data = await this.find(bfd.fileId)
      if (!bfd.data) throw new WERR_INVALID_PARAMETER('fileId', `data not found for fileId ${bfd.fileId}`);
    }

    if (!bfd.data && this.fetch && bfd.sourceUrl) {
      const url = this.fetch.pathJoin(bfd.sourceUrl, bfd.fileName)
      bfd.data = await this.fetch.download(url)
      if (!bfd.data) throw new WERR_INVALID_PARAMETER('sourceUrl', `data not found for sourceUrl ${url}`);
    }

    if (!bfd.data)
      throw new WERR_INVALID_PARAMETER('data', `defined. Unable to retrieve data for ${bfd.fileName}`);

    bfd.mru = Date.now()

    // Validate retrieved data.
    const fileHash = asString(Hash.sha256(asArray(bfd.data)), 'base64')
    if (fileHash !== bfd.fileHash)
      throw new WERR_INVALID_PARAMETER('fileHash', `does not match retrieved data for ${bfd.fileName}`);

    this.ensureMaxRetained()
    return bfd.data
  }

  private ensureMaxRetained() : void {
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

  static fromKnownCDN(cdnUrl: string, options: BulkFileDataManagerOptions): BulkFileDataManager {
    const files = selectBulkHeaderFiles(validBulkHeaderFiles.filter(f => f.sourceUrl === cdnUrl), options.chain, options.maxPerFile)
    const r = new BulkFileDataManager(options)
    r.add(files)
    return r
  }
}

interface BulkFileData extends BulkHeaderFileInfo {
  mru: number
}

export function selectBulkHeaderFiles(files: BulkHeaderFileInfo[], chain: Chain, maxPerFile: number): BulkHeaderFileInfo[] {
  const r: BulkHeaderFileInfo[] = []
  let height = 0
  for (;;) {
    const choices = files.filter((f) => f.firstHeight === height && f.count <= maxPerFile && f.chain === chain)
    // Pick the file with the maximum count
    const choice = choices.reduce((a, b) => (a.count > b.count ? a : b), choices[0]);
    if (!choice) break; // no more files to select
    r.push(choice)
    height += choice.count
  }
  return r
}