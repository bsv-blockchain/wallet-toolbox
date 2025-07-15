import { HeightRange } from './HeightRange'
import { addWork, deserializeBaseBlockHeader, validateBufferOfHeaders } from './blockHeaderUtilities'

import { BaseBlockHeader } from '../Api/BlockHeaderApi'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { Hash, Utils } from '@bsv/sdk'
import { asUint8Array } from '../../../../index.client'
import { Chain, WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { validBulkHeaderFilesByFileHash } from './validBulkHeaderFilesByFileHash'
import { ChaintracksStorageBase } from '../Base/ChaintracksStorageBase'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'

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
    if (!this.data) throw new WERR_INVALID_OPERATION(`data is undefined and no ensureData() override`);
    return this.data;
  }

  /**
   * Whenever reloading data from a backing store, validated fileHash must be re-verified
   * @returns the sha256 hash of the file's data as base64 string.
   */
  async computeFileHash(): Promise<string> {
    if (!this.data) throw new WERR_INVALID_OPERATION(`requires defined data`);
    return asString(Hash.sha256(asArray(this.data)), 'base64');
  }

  async releaseData(): Promise<void> {
    this.data = undefined;
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
      prevHash: this.prevHash,
    };
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
      fileId: this.fileId,
    }
  }
}

export class BulkHeaderFileFs extends BulkHeaderFile {
  constructor(info: BulkHeaderFileInfo, public fs: ChaintracksFsApi, public rootFolder: string) {
    super(info);
  }

  override async readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined> {
    if (this.data) {
      return this.data.slice(offset, offset + length);
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
    if (this.data) return this.data;
    this.data = await this.readDataFromFile(this.count * 80, 0);
    if (!this.data) throw new WERR_INVALID_OPERATION(`failed to read data for ${this.fileName}`);
    if (this.validated) {
      const hash = await this.computeFileHash();
      if (hash !== this.fileHash) throw new WERR_INVALID_OPERATION(`BACKING FILE DATA CORRUPTION: invalid fileHash for ${this.fileName}`);
    }
    return this.data
  }
}

export class BulkHeaderFileFetchBackedStorage extends BulkHeaderFile {
  constructor(info: BulkHeaderFileInfo, public storage: ChaintracksStorageBase, public fetch: ChaintracksFetchApi) {
    super(info);
    if (!this.sourceUrl) {
      throw new WERR_INVALID_PARAMETER('sourceUrl', 'defined');
    }
  }

  override async readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined> {
    return (await this.ensureData()).slice(offset, offset + length);
  }

  override async ensureData(): Promise<Uint8Array> {
    if (this.data) return this.data;
    const url = this.fetch.pathJoin(this.sourceUrl!, this.fileName)
    this.data = await this.fetch.download(url)
    if (!this.data) throw new WERR_INVALID_OPERATION(`failed to download data from ${url}`);
    if (this.validated) {
      const hash = await this.computeFileHash();
      if (hash !== this.fileHash) throw new WERR_INVALID_OPERATION(`BACKING DOWNLOAD DATA CORRUPTION: invalid fileHash for ${this.fileName}`);
    }
    return this.data
  }
}

/**
 * Describes a collection of bulk block header files.
 */
export interface BulkHeaderFilesInfo {
  /**
   * Full path to folder containing files.
   */
  rootFolder: string
  /**
   * Filename in `rootFolder` to/from which to serialize this Info as stringified JSON.
   */
  jsonFilename: string
  /**
   * How many headers each file contains.
   */
  headersPerFile: number
  /**
   * Array of information about each bulk block header file.
   */
  files: BulkHeaderFileInfo[]
}

/**
 * Breaks available bulk headers stored in multiple files into a sequence of buffers with
 * limited maximum size.
 */
export class BulkFilesReader<T extends BulkHeaderFile> {
  /**
   * Previously validated bulk header files which may pull data from backing storage on demand.
   */
  files: T[]
  /**
   * Subset of headers currently being "read".
  */
  range: HeightRange
  /**
   * Maximum buffer size returned from `read()` in bytes.
   */
  maxBufferSize = 400 * 80
  /**
   * "Read pointer", the next height to be "read".
   */
  nextHeight: number | undefined

  constructor(files: T[], range?: HeightRange, maxBufferSize?: number) {
    this.files = files
    this.range = HeightRange.empty
    this.setRange(range)
    this.setMaxBufferSize(maxBufferSize || 400 * 80)
  }

  protected setRange(range?: HeightRange) {
    this.range = this.heightRange
    if (range) {
      this.range = this.range.intersect(range)
    }
    this.nextHeight = this.range.isEmpty ? undefined : this.range.minHeight
  }

  setMaxBufferSize(maxBufferSize: number | undefined) {
    this.maxBufferSize = maxBufferSize || 400 * 80
    if (this.maxBufferSize % 80 !== 0) throw new Error('maxBufferSize must be a multiple of 80 bytes.')
  }

  private getLastFile(): BulkHeaderFileInfo | undefined {
    return this.files[this.files.length - 1]
  }

  get heightRange(): HeightRange {
    const last = this.getLastFile()
    if (!last || !this.files) return HeightRange.empty
    const first = this.files[0]
    return new HeightRange(first.firstHeight, last.firstHeight + last.count - 1)
  }

  private getFileForHeight(height: number): T | undefined {
    if (!this.files) return undefined
    return this.files.find(file => file.firstHeight <= height && file.firstHeight + file.count > height)
  }

  async readBufferForHeightOrUndefined(height: number): Promise<Uint8Array | undefined> {
    const file = this.getFileForHeight(height)
    if (!file) return undefined
    const buffer = await file.readDataFromFile(80, (height - file.firstHeight) * 80)
    return buffer
  }

  async readBufferForHeight(height: number): Promise<Uint8Array> {
    const header = await this.readBufferForHeightOrUndefined(height)
    if (!header) throw new Error(`Failed to read bulk header buffer at height=${height}`)
    return header
  }

  async readHeaderForHeight(height: number): Promise<BaseBlockHeader> {
    const buffer = await this.readBufferForHeight(height)
    return deserializeBaseBlockHeader(buffer, 0)
  }

  async readHeaderForHeightOrUndefined(height: number): Promise<BaseBlockHeader | undefined> {
    const buffer = await this.readBufferForHeightOrUndefined(height)
    return buffer ? deserializeBaseBlockHeader(buffer, 0) : undefined
  }

  /**
   * Returns the Buffer of block headers from the given `file` for the given `range`.
   * If `range` is undefined, the file's full height range is read.
   * The returned Buffer will only contain headers in `file` and in `range`
   * @param file
   * @param range
   */
  private async readBufferFromFile(file: T, range?: HeightRange): Promise<Uint8Array | undefined> {
    // Constrain the range to the file's contents...
    let fileRange = file.heightRange
    if (range) fileRange = fileRange.intersect(range)
    if (fileRange.isEmpty) return undefined
    const position = (fileRange.minHeight - file.firstHeight) * 80
    const length = fileRange.length * 80
    return await file.readDataFromFile(length, position)
  }

  private nextFile(file: T | undefined): T | undefined {
    if (!file) return this.files[0]
    const i = this.files.indexOf(file)
    if (i < 0) throw new WERR_INVALID_PARAMETER(`file`, `a valid file from this.files`)
    return this.files[i + 1]
  }

  /**
   * @returns an array containing the next `maxBufferSize` bytes of headers from the files.
   */
  async read(): Promise<Uint8Array | undefined> {
    if (this.nextHeight === undefined || !this.range || this.nextHeight > this.range.maxHeight) return undefined
    let lastHeight = this.nextHeight + this.maxBufferSize / 80 - 1
    lastHeight = Math.min(lastHeight, this.range.maxHeight)
    let file = this.getFileForHeight(this.nextHeight)
    if (!file) throw new WERR_INTERNAL(`logic error`)
    const readRange = new HeightRange(this.nextHeight, lastHeight)
    let buffers = new Uint8Array(readRange.length * 80)
    let offset = 0
    while (file) {
      const buffer = await this.readBufferFromFile(file, readRange)
      if (!buffer) break
      buffers.set(buffer, offset)
      offset += buffer.length
      file = this.nextFile(file)
    }
    if (!buffers.length || offset !== readRange.length * 80) return undefined
    this.nextHeight = lastHeight + 1
    return buffers
  }

  /**
   * Reset the reading process and adjust the range to be read to a new subset of what's available...
   * @param range new range for subsequent `read` calls to return.
   * @param maxBufferSize optionally update largest buffer size for `read` to return
   */
  resetRange(range: HeightRange, maxBufferSize?: number) {
    this.setRange(range)
    this.setMaxBufferSize(maxBufferSize || 400 * 80)
  }

  async validateFiles(): Promise<void> {
    let lastChainWork: string | undefined = '00'.repeat(32)
    let lastHeaderHash = '00'.repeat(32)
    for (const file of this.files) {
      if (file.prevChainWork !== lastChainWork)
        throw new WERR_INVALID_OPERATION(`prevChainWork mismatch for file ${file.fileName}: expected ${file.prevChainWork}, got ${lastChainWork}`);
      if (file.prevHash !== lastHeaderHash)
        throw new WERR_INVALID_OPERATION(`prevHash mismatch for file ${file.fileName}: expected ${file.prevHash}, got ${lastHeaderHash}`);
      const data = await file.ensureData()
      if (data.length !== file.count * 80)
        throw new WERR_INVALID_OPERATION(`data length mismatch for file ${file.fileName}: expected ${file.count * 80} bytes, got ${data.length} bytes`);
      const fileHash = await file.computeFileHash()
      if (!file.fileHash)
        throw new WERR_INVALID_OPERATION(`fileHash missing for file ${file.fileName}`);
      if (file.fileHash !== fileHash)
        throw new WERR_INVALID_OPERATION(`fileHash mismatch for file ${file.fileName}: expected ${file.fileHash}, got ${fileHash}`);

      ({ lastHeaderHash, lastChainWork } = validateBufferOfHeaders(data, lastHeaderHash, 0, file.count, lastChainWork))

      if (file.lastHash !== lastHeaderHash)
        throw new WERR_INVALID_OPERATION(`lastHash mismatch for file ${file.fileName}: expected ${file.lastHash}, got ${lastHeaderHash}`);
      if (file.lastChainWork !== lastChainWork)
        throw new WERR_INVALID_OPERATION(`lastChainWork mismatch for file ${file.fileName}: expected ${file.lastChainWork}, got ${lastChainWork}`);

      file.validated = true
    }
  }

  async exportHeadersToFs(toFs: ChaintracksFsApi, toHeadersPerFile: number, toFolder: string): Promise<void> {
    if (!this.files || this.files.length === 0 || this.files[0].count === 0) throw new WERR_INVALID_OPERATION('no headers currently available to export');
    if (!this.files[0].chain) throw new WERR_INVALID_OPERATION('chain is not defined for the first file');

    const chain = this.files[0].chain
    const toFileName = (i: number) => `${chain}Net_${i}.headers`
    const toPath = (i: number) => toFs.pathJoin(toFolder, toFileName(i))
    const toJsonPath = () => toFs.pathJoin(toFolder, `${chain}NetBlockHeaders.json`)

    const toBulkFiles: BulkHeaderFilesInfo = {
      rootFolder: toFolder,
      jsonFilename: `${chain}NetBlockHeaders.json`,
      headersPerFile: toHeadersPerFile,
      files: []
    }

    const bf0 = this.files[0]

    let firstHeight = bf0.firstHeight
    let lastHeaderHash = bf0.prevHash
    let lastChainWork = bf0.prevChainWork!

    const reader = new BulkFilesReader(this.files, this.heightRange, toHeadersPerFile * 80)

    let i = -1
    for (;;) {
      i++;
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
        prevHash: lastHeaderHash
      }
      toBulkFiles.files.push(file)
      firstHeight += file.count
      lastHeaderHash = file.lastHash!
      lastChainWork = file.lastChainWork!
    }

    await toFs.writeFile(toJsonPath(), asUint8Array(JSON.stringify(toBulkFiles), 'utf8'))
  }
}

export class BulkFilesReaderFs extends BulkFilesReader<BulkHeaderFileFs> {

  constructor(public fs: ChaintracksFsApi, files: BulkHeaderFileFs[], range?: HeightRange, maxBufferSize?: number) {
    super(files, range, maxBufferSize)
  }

  /**
   * Return a BulkFilesReader configured to access the intersection of `range` and available headers.
   * @param rootFolder
   * @param jsonFilename
   * @param range
   * @returns
   */
  static async fromFs(
    fs: ChaintracksFsApi,
    rootFolder: string,
    jsonFilename: string,
    range?: HeightRange,
    maxBufferSize?: number
  ): Promise<BulkFilesReaderFs> {
    const filesInfo = await this.readJsonFile(fs, rootFolder, jsonFilename)
    const readerFiles = filesInfo.files.map(
      (file) => new BulkHeaderFileFs(file, fs, rootFolder)
    )
    return new BulkFilesReaderFs(fs, readerFiles, range, maxBufferSize)
  }

  static async writeEmptyJsonFile(fs: ChaintracksFsApi, rootFolder: string, jsonFilename: string): Promise<string> {
    const json = JSON.stringify({ files: [], rootFolder })
    await fs.writeFile(fs.pathJoin(rootFolder, jsonFilename), asUint8Array(json, 'utf8'))
    return json
  }

  static async readJsonFile(
    fs: ChaintracksFsApi,
    rootFolder: string,
    jsonFilename: string,
    failToEmptyRange: boolean = true
  ): Promise<BulkHeaderFilesInfo> {
    const filePath = (file: string) => fs.pathJoin(rootFolder, file)

    const jsonPath = filePath(jsonFilename)

    let json: string

    try {
      json = asString(await fs.readFile(jsonPath), 'utf8')
    } catch (uerr: unknown) {
      if (!failToEmptyRange)
        throw new WERR_INVALID_PARAMETER(`${rootFolder}/${jsonFilename}`, `a valid, existing JSON file.`)
      json = await this.writeEmptyJsonFile(fs, rootFolder, jsonFilename)
    }

    const readerFiles = <BulkHeaderFilesInfo>JSON.parse(json)
    readerFiles.jsonFilename = jsonFilename
    readerFiles.rootFolder = rootFolder
    return readerFiles
  }
} 

export class BulkFilesReaderFetchBackedStorage extends BulkFilesReader<BulkHeaderFileFetchBackedStorage> {

  constructor(storage: ChaintracksStorageBase, files: BulkHeaderFileFetchBackedStorage[], range?: HeightRange, maxBufferSize?: number) {
    super(files, range, maxBufferSize)
  }

  static async fromStorage(
    storage: ChaintracksStorageBase,
    fetch: ChaintracksFetchApi,
    range?: HeightRange,
    maxBufferSize?: number
  ): Promise<BulkFilesReaderFetchBackedStorage> {
    const files = await storage.getBulkFiles()
    const readerFiles = files.map(
      (file) => new BulkHeaderFileFetchBackedStorage(file, storage, fetch)
    )
    return new BulkFilesReaderFetchBackedStorage(storage, readerFiles, range, maxBufferSize)
  }
} 