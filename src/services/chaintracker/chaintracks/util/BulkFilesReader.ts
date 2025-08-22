import { HeightRange } from './HeightRange'
import { deserializeBaseBlockHeader, validateBufferOfHeaders } from './blockHeaderUtilities'
import { BaseBlockHeader } from '../Api/BlockHeaderApi'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { Hash } from '@bsv/sdk'
import { asUint8Array } from '../../../../index.client'
import { WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { ChaintracksStorageBase } from '../Storage/ChaintracksStorageBase'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import {
  BulkHeaderFile,
  BulkHeaderFileFs,
  BulkHeaderFileInfo,
  BulkHeaderFilesInfo,
  BulkHeaderFileStorage
} from './BulkHeaderFile'

/**
 * Breaks available bulk headers stored in multiple files into a sequence of buffers with
 * limited maximum size.
 */
export class BulkFilesReader {
  /**
   * Previously validated bulk header files which may pull data from backing storage on demand.
   */
  files: BulkHeaderFile[]
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

  constructor(files: BulkHeaderFile[], range?: HeightRange, maxBufferSize?: number) {
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

  private getFileForHeight(height: number): BulkHeaderFile | undefined {
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
  private async readBufferFromFile(file: BulkHeaderFile, range?: HeightRange): Promise<Uint8Array | undefined> {
    // Constrain the range to the file's contents...
    let fileRange = file.heightRange
    if (range) fileRange = fileRange.intersect(range)
    if (fileRange.isEmpty) return undefined
    const position = (fileRange.minHeight - file.firstHeight) * 80
    const length = fileRange.length * 80
    return await file.readDataFromFile(length, position)
  }

  private nextFile(file: BulkHeaderFile | undefined): BulkHeaderFile | undefined {
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
        throw new WERR_INVALID_OPERATION(
          `prevChainWork mismatch for file ${file.fileName}: expected ${file.prevChainWork}, got ${lastChainWork}`
        )
      if (file.prevHash !== lastHeaderHash)
        throw new WERR_INVALID_OPERATION(
          `prevHash mismatch for file ${file.fileName}: expected ${file.prevHash}, got ${lastHeaderHash}`
        )
      const data = await file.ensureData()
      if (data.length !== file.count * 80)
        throw new WERR_INVALID_OPERATION(
          `data length mismatch for file ${file.fileName}: expected ${file.count * 80} bytes, got ${data.length} bytes`
        )
      const fileHash = await file.computeFileHash()
      if (!file.fileHash) throw new WERR_INVALID_OPERATION(`fileHash missing for file ${file.fileName}`)
      if (file.fileHash !== fileHash)
        throw new WERR_INVALID_OPERATION(
          `fileHash mismatch for file ${file.fileName}: expected ${file.fileHash}, got ${fileHash}`
        )
      ;({ lastHeaderHash, lastChainWork } = validateBufferOfHeaders(data, lastHeaderHash, 0, file.count, lastChainWork))

      if (file.lastHash !== lastHeaderHash)
        throw new WERR_INVALID_OPERATION(
          `lastHash mismatch for file ${file.fileName}: expected ${file.lastHash}, got ${lastHeaderHash}`
        )
      if (file.lastChainWork !== lastChainWork)
        throw new WERR_INVALID_OPERATION(
          `lastChainWork mismatch for file ${file.fileName}: expected ${file.lastChainWork}, got ${lastChainWork}`
        )

      file.validated = true
    }
  }

  async exportHeadersToFs(toFs: ChaintracksFsApi, toHeadersPerFile: number, toFolder: string): Promise<void> {
    if (!this.files || this.files.length === 0 || this.files[0].count === 0)
      throw new WERR_INVALID_OPERATION('no headers currently available to export')
    if (!this.files[0].chain) throw new WERR_INVALID_OPERATION('chain is not defined for the first file')

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

export class BulkFilesReaderFs extends BulkFilesReader {
  constructor(
    public fs: ChaintracksFsApi,
    files: BulkHeaderFileFs[],
    range?: HeightRange,
    maxBufferSize?: number
  ) {
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
    const readerFiles = filesInfo.files.map(file => new BulkHeaderFileFs(file, fs, rootFolder))
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

export class BulkFilesReaderStorage extends BulkFilesReader {
  constructor(
    storage: ChaintracksStorageBase,
    files: BulkHeaderFileStorage[],
    range?: HeightRange,
    maxBufferSize?: number
  ) {
    super(files, range, maxBufferSize)
  }

  static async fromStorage(
    storage: ChaintracksStorageBase,
    fetch: ChaintracksFetchApi,
    range?: HeightRange,
    maxBufferSize?: number
  ): Promise<BulkFilesReaderStorage> {
    const files = await storage.bulkManager.getBulkFiles(true)
    const readerFiles = files.map(file => new BulkHeaderFileStorage(file, storage, fetch))
    return new BulkFilesReaderStorage(storage, readerFiles, range, maxBufferSize)
  }
}
