import { HeightRange } from './HeightRange'
import { deserializeBlockHeader, validateBufferOfHeaders } from './blockHeaderUtilities'

import { promises as fs } from 'fs'
import crypto from 'crypto'
import { BaseBlockHeader } from '../Api/BlockHeaderApi'
import { asArray } from '../../../../utility/utilityHelpers.buffer'

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
   * previousHash of first header in file in standard hex string block hash encoding
   */
  prevHash: string
  /**
   * count of how many headers the file contains. File size must be 80 * count.
   */
  count: number
  /**
   * block hash of last header in the file in standard hex string block hash encoding
   */
  lastHash: string | null
  /**
   * file contents single sha256 hash as base64 string
   */
  fileHash: string | null
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
   * Array of information about each bulk block header file.
   */
  files: BulkHeaderFileInfo[]
}

/**
 * Breaks available bulk headers stored in multiple files into a sequence of buffers with
 * limited maximum size.
 */
export class BulkFilesReader {
  rootFolder: string
  jsonFilename: string
  files: BulkHeaderFileInfo[]
  range: HeightRange
  maxBufferSize = 400 * 80
  nextHeight: number | undefined

  constructor(files: BulkHeaderFilesInfo, range?: HeightRange, maxBufferSize?: number) {
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

  async readBufferForHeight(height: number): Promise<number[]> {
    const header = await this.readBufferForHeightOrUndefined(height)
    if (!header) throw new Error(`Failed to read bulk header buffer at height=${height}`)
    return header
  }

  async readBufferForHeightOrUndefined(height: number): Promise<number[] | undefined> {
    const file = this.getFileForHeight(height)
    if (!file) return undefined
    const f = await fs.open(this.rootFolder + file.fileName, 'r')
    try {
      const buffer = Buffer.alloc(80)
      await f.read(buffer, 0, 80, (height - file.firstHeight) * 80)
      return asArray(buffer)
    } finally {
      await f.close()
    }
  }

  async readHeaderForHeight(height: number): Promise<BaseBlockHeader> {
    const buffer = await this.readBufferForHeight(height)
    return deserializeBlockHeader(buffer, 0)
  }

  async readHeaderForHeightOrUndefined(height: number): Promise<BaseBlockHeader | undefined> {
    const buffer = await this.readBufferForHeightOrUndefined(height)
    return buffer ? deserializeBlockHeader(buffer, 0) : undefined
  }

  /**
   * Returns the Buffer of block headers from the given `file` for the given `range`.
   * If `range` is undefined, the file's full height range is read.
   * The returned Buffer will only contain headers in `file` and in `range`
   * @param file
   * @param range
   */
  async readBufferFromFile(file: BulkHeaderFileInfo, range?: HeightRange): Promise<number[] | undefined> {
    // Constrain the range to the file's contents...
    let fileRange = this.getFileHeightRange(file)
    if (range) fileRange = fileRange.intersect(range)
    if (fileRange.isEmpty) return undefined
    const position = (fileRange.minHeight - file.firstHeight) * 80
    const length = fileRange.length * 80
    const f = await fs.open(this.rootFolder + file.fileName, 'r')
    try {
      const buffer = Buffer.alloc(length)
      await f.read(buffer, 0, length, position)
      return asArray(buffer)
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
  async read(): Promise<number[] | undefined> {
    if (this.nextHeight === undefined || !this.range || this.nextHeight > this.range.maxHeight) return undefined
    let lastHeight = this.nextHeight + this.maxBufferSize / 80 - 1
    lastHeight = Math.min(lastHeight, this.range.maxHeight)
    let file = this.getFileForHeight(this.nextHeight)
    const readRange = new HeightRange(this.nextHeight, lastHeight)
    let buffers: number[] = []
    while (file) {
      const buffer = await this.readBufferFromFile(file, readRange)
      if (!buffer) break
      buffers = buffers.concat(buffer)
      file = this.nextFile(file)
    }
    if (!buffers.length) return undefined
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
      await BulkFilesReader.validateHeaderFile(this.rootFolder, file)
    }
  }

  static async writeEmptyJsonFile(rootFolder: string, jsonFilename: string): Promise<string> {
    const json = JSON.stringify({ files: [], rootFolder })
    await fs.writeFile(rootFolder + jsonFilename, json, 'utf8')
    return json
  }

  static async readJsonFile(rootFolder: string, jsonFilename: string): Promise<BulkHeaderFilesInfo> {
    await fs.mkdir(rootFolder, { recursive: true })

    const filePath = (file: string) => rootFolder + file

    const jsonPath = filePath(jsonFilename)

    let json: string

    try {
      json = await fs.readFile(jsonPath, 'utf8')
    } catch (uerr: unknown) {
      if ((uerr as { code: string })?.code !== 'ENOENT') throw uerr
      json = await this.writeEmptyJsonFile(rootFolder, jsonFilename)
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
  static async fromJsonFile(rootFolder: string, jsonFilename: string, range?: HeightRange): Promise<BulkFilesReader> {
    const readerFiles = await this.readJsonFile(rootFolder, jsonFilename)
    return new BulkFilesReader(readerFiles, range)
  }

  /**
   * Validates the contents of an existing static header file against expected `BulkHeaderFileInfo`.
   * `hf.prevHash` must be valid on input. The previousHash value of the first header in this file.
   * `hf.firstHeight` is ignored by this function.
   * Remaining properties of `hf` are validated if non-null, assigned values from the file if null.
   * @param rootFolder + `hf.fileName` must be the full path to the file to be validated.
   * @param hf
   * @returns actual BulkHeaderFileInfo verified
   */
  static async validateHeaderFile(rootFolder: string, hf: BulkHeaderFileInfo): Promise<BulkHeaderFileInfo> {
    const filename = rootFolder + hf.fileName

    const file = await fs.open(filename, 'r')
    try {
      const sha256 = crypto.createHash('sha256')
      const bufferSize = 10000 * 80
      const readBuf = Buffer.alloc(bufferSize)

      let prevHash = hf.prevHash

      let fileCount = 0

      const hfa = { ...hf }

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const rr = await file.read(readBuf, 0, readBuf.length)
        if (!rr.bytesRead) break
        if (rr.bytesRead % 80 !== 0)
          throw { message: `File ${filename} file read returned ${rr.bytesRead} bytes which is not a multiple of 80.` }
        const count = rr.bytesRead / 80
        prevHash = validateBufferOfHeaders(asArray(readBuf), prevHash, 0, count)
        fileCount += count
        sha256.update(rr.buffer)
      }

      const lastHash = prevHash
      if (hf.lastHash !== null && lastHash !== hf.lastHash)
        throw { message: `File ${filename} lastHash of ${lastHash} doesn't match expected lastHash of ${hf.lastHash}` }

      hfa.lastHash = lastHash

      const fileHash = sha256.digest('base64')
      if (hf.fileHash !== null && fileHash !== hf.fileHash)
        throw { message: `File ${filename} hash of ${fileHash} doesn't match expected hash of ${hf.fileHash}` }

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
