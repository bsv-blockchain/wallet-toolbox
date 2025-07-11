import { HeightRange } from './HeightRange'
import { addWork, deserializeBaseBlockHeader, validateBufferOfHeaders } from './blockHeaderUtilities'

import { BaseBlockHeader } from '../Api/BlockHeaderApi'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { Hash, Utils } from '@bsv/sdk'
import { asUint8Array } from '../../../../index.client'
import { Chain, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { validBulkHeaderFilesByFileHash } from './validBulkHeaderFilesByFileHash'

/**
 * Descriptive information about a single bulk header file.
 */
export interface BulkHeaderFileInfo {
  fileId?: number // optional, used for database storage
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
export class BulkFilesReader {
  fs: ChaintracksFsApi
  rootFolder: string
  jsonFilename: string
  files: BulkHeaderFileInfo[]
  range: HeightRange
  maxBufferSize = 400 * 80
  nextHeight: number | undefined

  constructor(fs: ChaintracksFsApi, files: BulkHeaderFilesInfo, range?: HeightRange, maxBufferSize?: number) {
    this.fs = fs
    this.rootFolder = files.rootFolder
    this.jsonFilename = files.jsonFilename
    this.files = files.files
    this.range = HeightRange.empty
    this.setRange(range)
    this.setMaxBufferSize(maxBufferSize || 400 * 80)
  }

  protected setRange(range?: HeightRange) {
    this.range = this.getAvailableHeightRange()
    if (range) {
      this.range = this.range.intersect(range)
    }
    this.nextHeight = this.range.isEmpty ? undefined : this.range.minHeight
  }

  setMaxBufferSize(maxBufferSize: number | undefined) {
    this.maxBufferSize = maxBufferSize || 400 * 80
    if (this.maxBufferSize % 80 !== 0) throw new Error('maxBufferSize must be a multiple of 80 bytes.')
  }

  getFileHeightRange(file: BulkHeaderFileInfo): HeightRange {
    return new HeightRange(file.firstHeight, file.firstHeight + file.count - 1)
  }

  getLastFile(): BulkHeaderFileInfo | undefined {
    return this.files[this.files.length - 1]
  }

  getAvailableHeightRange(): HeightRange {
    const last = this.getLastFile()
    if (!last || !this.files) return HeightRange.empty
    const first = this.files[0]
    return new HeightRange(first.firstHeight, last.firstHeight + last.count - 1)
  }

  getFileForHeight(height: number): BulkHeaderFileInfo | undefined {
    if (!this.files) return undefined
    return this.files.find(file => file.firstHeight <= height && file.firstHeight + file.count > height)
  }

  async readBufferForHeight(height: number): Promise<Uint8Array> {
    const header = await this.readBufferForHeightOrUndefined(height)
    if (!header) throw new Error(`Failed to read bulk header buffer at height=${height}`)
    return header
  }

  async readBufferForHeightOrUndefined(height: number): Promise<Uint8Array | undefined> {
    const file = this.getFileForHeight(height)
    if (!file) return undefined
    const f = await this.fs.openReadableFile(this.fs.pathJoin(this.rootFolder, file.fileName))
    try {
      const buffer = await f.read(80, (height - file.firstHeight) * 80)
      return buffer
    } finally {
      await f.close()
    }
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
  async readBufferFromFile(file: BulkHeaderFileInfo, range?: HeightRange): Promise<Uint8Array | undefined> {
    // Constrain the range to the file's contents...
    let fileRange = this.getFileHeightRange(file)
    if (range) fileRange = fileRange.intersect(range)
    if (fileRange.isEmpty) return undefined
    const position = (fileRange.minHeight - file.firstHeight) * 80
    const length = fileRange.length * 80
    const f = await this.fs.openReadableFile(this.fs.pathJoin(this.rootFolder, file.fileName))
    try {
      const buffer = await f.read(length, position)
      return buffer
    } finally {
      await f.close()
    }
  }

  nextFile(file: BulkHeaderFileInfo): BulkHeaderFileInfo | undefined {
    const i = this.files.indexOf(file)
    return i === -1 || i === this.files.length - 1 ? undefined : this.files[i + 1]
  }

  /**
   * @returns an array containing the next `maxBufferSize` bytes of headers from the files.
   */
  async read(): Promise<Uint8Array | undefined> {
    if (this.nextHeight === undefined || !this.range || this.nextHeight > this.range.maxHeight) return undefined
    let lastHeight = this.nextHeight + this.maxBufferSize / 80 - 1
    lastHeight = Math.min(lastHeight, this.range.maxHeight)
    let file = this.getFileForHeight(this.nextHeight)
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
    for (const file of this.files) {
      await BulkFilesReader.validateHeaderFile(this.fs, this.rootFolder, file)
    }
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

  /**
   * Return a BulkFilesReader configured to access the intersection of `range` and available headers.
   * @param rootFolder
   * @param jsonFilename
   * @param range
   * @returns
   */
  static async fromJsonFile(
    fs: ChaintracksFsApi,
    rootFolder: string,
    jsonFilename: string,
    range?: HeightRange
  ): Promise<BulkFilesReader> {
    const readerFiles = await this.readJsonFile(fs, rootFolder, jsonFilename)
    return new BulkFilesReader(fs, readerFiles, range)
  }

  /**
   * Validates the contents of an existing static header file against expected `BulkHeaderFileInfo`.
   * `hf.prevHash` must be valid on input. The previousHash value of the first header in this file.
   * `hf.firstHeight` is ignored by this function.
   * Remaining properties of `hf` are validated if non-null, assigned values from the file if null.
   * @param rootFolder path joined to `hf.fileName` must be the full path to the file to be validated.
   * @param hf BulkHeaderFileInfo to be validated.
   * @param data optional data to be validated. If undefined, data is read from cached files.
   * @returns actual BulkHeaderFileInfo verified
   */
  static async validateHeaderFile(
    fs: ChaintracksFsApi,
    rootFolder: string,
    hf: BulkHeaderFileInfo,
    data?: Uint8Array
  ): Promise<BulkHeaderFileInfo> {
    if (data) {
      const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
      const vbhfi = validBulkHeaderFilesByFileHash[fileHash]
      if (
        vbhfi &&
        vbhfi.fileName === hf.fileName &&
        vbhfi.firstHeight === hf.firstHeight &&
        vbhfi.prevHash === hf.prevHash &&
        vbhfi.count === hf.count &&
        vbhfi.lastHash === hf.lastHash &&
        vbhfi.fileHash === hf.fileHash &&
        vbhfi.lastChainWork === hf.lastChainWork &&
        vbhfi.prevChainWork === hf.prevChainWork &&
        vbhfi.chain === hf.chain
      ) {
        return { ...hf }
      }
    }

    const filename = fs.pathJoin(rootFolder, hf.fileName)

    const file = await fs.openReadableFile(filename)
    try {
      const sha256 = new Hash.SHA256()
      const sha256Bug = new Hash.SHA256()
      const bufferSize = 10000 * 80
      let offset = 0

      let prevHash = hf.prevHash
      let prevChainWork = hf.prevChainWork
      if (!prevHash || prevHash.length !== 64) {
        throw new Error(`Invalid previous hash ${prevHash} for file ${filename}. Must be a 64 character hex string.`)
      }
      if (!prevChainWork || prevChainWork.length !== 64) {
        throw new Error(
          `Invalid previous chain work ${prevChainWork} for file ${filename}. Must be a 64 character hex string.`
        )
      }

      let fileCount = 0

      const hfa = { ...hf }

      let rrLast: number[] | undefined = undefined

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const rr = await file.read(bufferSize, offset)
        if (!rr.length) break
        if (rr.length % 80 !== 0)
          throw { message: `File ${filename} file read returned ${rr.length} bytes which is not a multiple of 80.` }
        const arr = asArray(rr)
        sha256.update(arr)
        sha256Bug.update(arr)
        if (rr.length === bufferSize) rrLast = arr
        if (rrLast && rr.length < bufferSize) {
          rrLast = rrLast.slice(rr.length)
          sha256Bug.update(rrLast)
        }
        offset += rr.length
        const count = rr.length / 80
        const { lastHeaderHash, lastChainWork } = validateBufferOfHeaders(rr, prevHash, 0, count, prevChainWork)
        prevChainWork = lastChainWork!
        prevHash = lastHeaderHash
        fileCount += count
      }

      const lastHash = prevHash
      if (hf.lastHash !== null && lastHash !== hf.lastHash)
        throw { message: `File ${filename} lastHash of ${lastHash} doesn't match expected lastHash of ${hf.lastHash}` }

      hfa.lastHash = lastHash
      hfa.lastChainWork = prevChainWork

      const fileHash = Utils.toBase64(sha256.digest())
      /**
       * The original code that calculated file hashes submitted a partially overwritten buffer for the last chunk of the last header file.
       * Once only valid file hashes are in use, this can be removed.
       */
      const fileHashBug = Utils.toBase64(sha256Bug.digest())
      if (hf.fileHash !== null && fileHash !== hf.fileHash && fileHashBug !== hf.fileHash) {
        throw { message: `File ${filename} hash of ${fileHash} doesn't match expected hash of ${hf.fileHash}` }
      }

      hfa.fileHash = fileHash

      if (hf.count !== null && fileCount !== hf.count)
        throw { message: `File ${filename} count of ${fileCount} doesn't match expected header count ${hf.count}` }

      hfa.count = fileCount

      return hfa
    } catch (err) {
      console.log('validateHeaderFile error', err)
      throw err
    } finally {
      await file.close()
    }
  }
}
