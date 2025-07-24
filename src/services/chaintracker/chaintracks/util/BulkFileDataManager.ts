import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { Chain, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { Hash } from '@bsv/sdk'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { BulkHeaderFileInfo } from './BulkHeaderFile'
import { validBulkHeaderFilesByFileHash } from './validBulkHeaderFilesByFileHash'

export interface BulkFileDataManagerOptions {
  maxRetained?: number
  fetch?: ChaintracksFetchApi
  find?: (fileId: number) => Promise<Uint8Array | undefined>
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
  private bfds: Map<string, BulkFileData> = new Map()
  fetch?: ChaintracksFetchApi
  find?: (fileId: number) => Promise<Uint8Array | undefined>
  maxRetained?: number

  constructor(options: BulkFileDataManagerOptions) {
    this.maxRetained = options.maxRetained
    this.fetch = options.fetch
    this.find = options.find
  }

  async getData(fileHash: string): Promise<Uint8Array | undefined>
  {
    const bfd = this.bfds.get(fileHash)
    if (!bfd)
      throw new WERR_INVALID_PARAMETER('fileHash', `known to the BulkFileDataManager. ${fileHash} is unknown.`);
    const data = await this.ensureData(bfd)
    return data
  }

  add(files: BulkHeaderFileInfo[]) : void {
    for (const file of files) {
      if (!file.fileHash)
        throw new WERR_INVALID_PARAMETER('fileHash', `defined`);
      if (!file.sourceUrl && !file.fileId && !file.data)
        throw new WERR_INVALID_PARAMETER('data', `defined when sourceUrl and fileId are undefined`);
      const bfd: BulkFileData = {
        ...file,
        mru: Date.now(),
      }
      this.bfds.set(file.fileHash, bfd)
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
  }

  private ensureMaxRetained() : void {
    if (this.maxRetained === undefined) return
    let withData =
      Array.from(this.bfds.values()).filter(bfd => bfd.data && (bfd.fileId || bfd.sourceUrl))
    let countToRelease = withData.length - this.maxRetained
    if (countToRelease <= 0) return
    const sorted = withData.sort((a, b) => a.mru - b.mru)
    while (countToRelease-- > 0 && sorted.length > 0) {
      const oldest = sorted.splice(0, 1)[0]
      // Release the least recently used data
      oldest.data = undefined // Release the data
    }
  }

  static fromKnownCDN(chain: Chain, cdnUrl: string, maxPerFile: number, options: BulkFileDataManagerOptions): BulkFileDataManager {
    const files = Object.values(validBulkHeaderFilesByFileHash).filter(f => f.chain === chain && f.sourceUrl === cdnUrl)
    const r = new BulkFileDataManager(options)
    r.add(files)
    return r
  }
}

interface BulkFileData extends BulkHeaderFileInfo {
  mru: number
}
