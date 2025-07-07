import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkFilesReader'
import { BulkFilesReader } from './BulkFilesReader'
import { HeightRange } from './HeightRange'
import { asArray, asUint8Array } from '../../../../utility/utilityHelpers.noBuffer'

/**
 * Breaks available bulk headers stored in multiple files into a sequence of buffers with
 * limited maximum size.
 */
export class BulkFilesManager extends BulkFilesReader {
  constructor(fs: ChaintracksFsApi, files: BulkHeaderFilesInfo, range?: HeightRange, maxBufferSize?: number) {
    super(fs, files, range, maxBufferSize)
  }

  static override async fromJsonFile(
    fs: ChaintracksFsApi,
    rootFolder: string,
    jsonFilename: string,
    range?: HeightRange,
    maxBufferSize?: number
  ): Promise<BulkFilesManager> {
    const info = await BulkFilesReader.readJsonFile(fs, rootFolder, jsonFilename)
    return new BulkFilesManager(fs, info, range, maxBufferSize)
  }

  async clearBulkHeaders(): Promise<void> {
    // Delete any existing files...
    for (const file of this.files) await this.fs.delete(this.fs.pathJoin(this.rootFolder, file.fileName))
    this.files = []
    await this.writeJsonFile()
  }

  async writeJsonFile(): Promise<void> {
    const info: BulkHeaderFilesInfo = {
      rootFolder: this.rootFolder,
      jsonFilename: this.jsonFilename,
      files: this.files,
      headersPerFile: this.files.length > 0 ? this.files[0].count : 0
    }
    const json = JSON.stringify(info)
    await this.fs.writeFile(this.fs.pathJoin(this.rootFolder, this.jsonFilename), asUint8Array(json, 'utf8'))
  }

  async appendHeaders(headers: Uint8Array, firstHeight: number, previousHash: string): Promise<void> {
    if (!this.files || this.files.length === 0) {
      throw new Error('At least one existing bulk header file is required to append headers.')
    }
    const lf = this.files[this.files.length - 1]
    let file: BulkHeaderFileInfo = {
      fileName: this.jsonFilename.replace('.json', `_${this.files.length}.headers`),
      firstHeight,
      prevHash: previousHash,
      count: headers.length / 80,
      lastHash: null,
      fileHash: null,
      prevChainWork: lf.lastChainWork,
      lastChainWork: ''
    }
    await this.fs.writeFile(this.fs.pathJoin(this.rootFolder, file.fileName), headers)
    file = await BulkFilesReader.validateHeaderFile(this.fs, this.rootFolder, file)
    this.files.push(file)
    await this.writeJsonFile()
    this.setRange()
  }
}
