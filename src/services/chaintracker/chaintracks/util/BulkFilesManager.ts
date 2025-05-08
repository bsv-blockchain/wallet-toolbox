import { BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkFilesReader'
import { BulkFilesReader } from './BulkFilesReader'
import { HeightRange } from './HeightRange'

import { promises as fs } from 'fs'

/**
 * Breaks available bulk headers stored in multiple files into a sequence of buffers with
 * limited maximum size.
 */
export class BulkFilesManager extends BulkFilesReader {
  constructor(files: BulkHeaderFilesInfo, range?: HeightRange, maxBufferSize?: number) {
    super(files, range, maxBufferSize)
  }

  static override async fromJsonFile(
    rootFolder: string,
    jsonFilename: string,
    range?: HeightRange
  ): Promise<BulkFilesManager> {
    const info = await this.readJsonFile(rootFolder, jsonFilename)
    return new BulkFilesManager(info, range)
  }

  async clearBulkHeaders(): Promise<void> {
    // Delete any existing files...
    for (const file of this.files) await fs.unlink(this.rootFolder + file.fileName)
    this.files = []
    await this.writeJsonFile()
  }

  async writeJsonFile(): Promise<void> {
    await fs.mkdir(this.rootFolder, { recursive: true })
    const info: BulkHeaderFilesInfo = {
      rootFolder: this.rootFolder,
      jsonFilename: this.jsonFilename,
      files: this.files
    }
    const json = JSON.stringify(info)
    await fs.writeFile(this.rootFolder + this.jsonFilename, json, 'utf8')
  }

  async appendHeaders(headers: number[], firstHeight: number, previousHash: string): Promise<void> {
    let file: BulkHeaderFileInfo = {
      fileName: this.jsonFilename.replace('.json', `_${this.files.length}.headers`),
      firstHeight,
      prevHash: previousHash,
      count: headers.length / 80,
      lastHash: null,
      fileHash: null
    }
    await fs.writeFile(this.rootFolder + file.fileName, Buffer.from(headers))
    file = await BulkFilesReader.validateHeaderFile(this.rootFolder, file)
    this.files.push(file)
    await this.writeJsonFile()
    this.setRange()
  }
}
