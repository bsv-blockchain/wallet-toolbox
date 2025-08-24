import { HeightRange } from './HeightRange'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { ChaintracksStorageBase } from '../Storage/ChaintracksStorageBase'
import { Hash } from '@bsv/sdk'
import { Chain } from '../../../../sdk/types'
import { WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk/WERR_errors'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'

/**
 * Descriptive information about a single bulk header file.
 */
export interface BulkHeaderFileInfo {
  /**
   * filename and extension, no path
   */
  fileName: string
  /**
   * chain height of first header in file
   */
  firstHeight: number
  /**
   * count of how many headers the file contains. File size must be 80 * count.
   */
  count: number
  /**
   * prevChainWork is the cummulative chain work up to the first header in this file's data, as a hex string.
   */
  prevChainWork: string
  /**
   * lastChainWork is the cummulative chain work including the last header in this file's data, as a hex string.
   */
  lastChainWork: string
  /**
   * previousHash of first header in file in standard hex string block hash encoding
   */
  prevHash: string
  /**
   * block hash of last header in the file in standard hex string block hash encoding
   */
  lastHash: string | null
  /**
   * file contents single sha256 hash as base64 string
   */
  fileHash: string | null
  /**
   * Which chain: 'main' or 'test'
   */
  chain?: Chain

  data?: Uint8Array // optional, used for validation

  /**
   * true iff these properties should be considered pre-validated, including a valid required fileHash of data (when not undefined).
   */
  validated?: boolean
  /**
   * optional, used for database storage
   */
  fileId?: number
  /**
   * optional, if valid `${sourceUrl}/${fileName}` is the source of this data.
   */
  sourceUrl?: string
}

export abstract class BulkHeaderFile implements BulkHeaderFileInfo {
  chain?: Chain | undefined
  count: number
  data?: Uint8Array<ArrayBufferLike> | undefined
  fileHash: string | null
  fileId?: number | undefined
  fileName: string
  firstHeight: number
  lastChainWork: string
  lastHash: string | null
  prevChainWork: string
  prevHash: string
  sourceUrl?: string | undefined
  validated?: boolean | undefined

  constructor(info: BulkHeaderFileInfo) {
    this.chain = info.chain
    this.count = info.count
    this.data = info.data
    this.fileHash = info.fileHash
    this.fileId = info.fileId
    this.fileName = info.fileName
    this.firstHeight = info.firstHeight
    this.lastChainWork = info.lastChainWork
    this.lastHash = info.lastHash
    this.prevChainWork = info.prevChainWork
    this.prevHash = info.prevHash
    this.sourceUrl = info.sourceUrl
    this.validated = info.validated
  }

  abstract readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined>

  get heightRange(): HeightRange {
    return new HeightRange(this.firstHeight, this.firstHeight + this.count - 1)
  }

  async ensureData(): Promise<Uint8Array> {
    if (!this.data) throw new WERR_INVALID_OPERATION(`data is undefined and no ensureData() override`)
    return this.data
  }

  /**
   * Whenever reloading data from a backing store, validated fileHash must be re-verified
   * @returns the sha256 hash of the file's data as base64 string.
   */
  async computeFileHash(): Promise<string> {
    if (!this.data) throw new WERR_INVALID_OPERATION(`requires defined data`)
    return asString(Hash.sha256(asArray(this.data)), 'base64')
  }

  async releaseData(): Promise<void> {
    this.data = undefined
  }

  toCdnInfo(): BulkHeaderFileInfo {
    return {
      count: this.count,
      fileHash: this.fileHash,
      fileName: this.fileName,
      firstHeight: this.firstHeight,
      lastChainWork: this.lastChainWork,
      lastHash: this.lastHash,
      prevChainWork: this.prevChainWork,
      prevHash: this.prevHash
    }
  }

  toStorageInfo(): BulkHeaderFileInfo {
    return {
      count: this.count,
      fileHash: this.fileHash,
      fileName: this.fileName,
      firstHeight: this.firstHeight,
      lastChainWork: this.lastChainWork,
      lastHash: this.lastHash,
      prevChainWork: this.prevChainWork,
      prevHash: this.prevHash,
      chain: this.chain,
      validated: this.validated,
      sourceUrl: this.sourceUrl,
      fileId: this.fileId
    }
  }
}

export class BulkHeaderFileFs extends BulkHeaderFile {
  constructor(
    info: BulkHeaderFileInfo,
    public fs: ChaintracksFsApi,
    public rootFolder: string
  ) {
    super(info)
  }

  override async readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined> {
    if (this.data) {
      return this.data.slice(offset, offset + length)
    }
    const f = await this.fs.openReadableFile(this.fs.pathJoin(this.rootFolder, this.fileName))
    try {
      const buffer = await f.read(length, offset)
      return buffer
    } finally {
      await f.close()
    }
  }

  override async ensureData(): Promise<Uint8Array> {
    if (this.data) return this.data
    this.data = await this.readDataFromFile(this.count * 80, 0)
    if (!this.data) throw new WERR_INVALID_OPERATION(`failed to read data for ${this.fileName}`)
    if (this.validated) {
      const hash = await this.computeFileHash()
      if (hash !== this.fileHash)
        throw new WERR_INVALID_OPERATION(`BACKING FILE DATA CORRUPTION: invalid fileHash for ${this.fileName}`)
    }
    return this.data
  }
}

export class BulkHeaderFileStorage extends BulkHeaderFile {
  constructor(
    info: BulkHeaderFileInfo,
    public storage: ChaintracksStorageBase,
    public fetch: ChaintracksFetchApi
  ) {
    super(info)
  }

  override async readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined> {
    return (await this.ensureData()).slice(offset, offset + length)
  }

  override async ensureData(): Promise<Uint8Array> {
    if (this.data) return this.data
    if (!this.sourceUrl) {
      throw new WERR_INVALID_PARAMETER('sourceUrl', 'defined. Or data must be defined.')
    }
    const url = this.fetch.pathJoin(this.sourceUrl!, this.fileName)
    this.data = await this.fetch.download(url)
    if (!this.data) throw new WERR_INVALID_OPERATION(`failed to download data from ${url}`)
    if (this.validated) {
      const hash = await this.computeFileHash()
      if (hash !== this.fileHash)
        throw new WERR_INVALID_OPERATION(`BACKING DOWNLOAD DATA CORRUPTION: invalid fileHash for ${this.fileName}`)
    }
    return this.data
  }
}

/**
 * Describes a collection of bulk block header files.
 */
export interface BulkHeaderFilesInfo {
  /**
   * Where this file was fetched or read from.
   */
  rootFolder: string
  /**
   * Sub-path to this resource on rootFolder
   */
  jsonFilename: string
  /**
   * Array of information about each bulk block header file.
   */
  files: BulkHeaderFileInfo[]
  /**
   * Maximum number of headers in a single file in this collection of files.
   */
  headersPerFile: number
}

export abstract class BulkHeaderFiles implements BulkHeaderFilesInfo {
  constructor(
    public rootFolder: string,
    public jsonFilename: string,
    public files: BulkHeaderFileInfo[],
    public headersPerFile: number
  ) {}
}
