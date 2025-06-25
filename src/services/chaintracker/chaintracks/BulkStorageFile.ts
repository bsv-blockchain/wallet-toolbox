/* eslint-disable @typescript-eslint/no-unused-vars */
import { BulkStorageBaseOptions } from './Api/BulkStorageApi'

import { BulkStorageBase } from './Base/BulkStorageBase'

import { deserializeBlockHeader, validateBufferOfHeaders } from './util/blockHeaderUtilities'
import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { doubleSha256BE, doubleSha256LE } from '../../../utility/utilityHelpers'
import { asArray, asBuffer } from '../../../utility/utilityHelpers.buffer'
import { asString } from '../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'

export interface BulkStorageFileOptions extends BulkStorageBaseOptions {
  rootFolder: string | undefined
  filename: string | undefined
  fs: ChaintracksFsApi
}

export class BulkStorageFile extends BulkStorageBase {
  static createBulkStorageFileOptions(chain: Chain, fs: ChaintracksFsApi, rootFolder?: string): BulkStorageFileOptions {
    const options: BulkStorageFileOptions = {
      ...BulkStorageBase.createBulkStorageBaseOptions(chain),
      fs,
      rootFolder: rootFolder || './data/',
      filename: `${chain}Net_bulk_storage_file.headers`
    }
    return options
  }

  rootFolder: string
  filename: string
  file: fs.FileHandle | undefined
  fileLength = 0
  fileOpenForRead = false

  constructor(options: BulkStorageFileOptions) {
    super(options)
    if (!options.rootFolder) throw new Error('The rootFolder options property is required.')
    if (!options.filename) throw new Error('The filename options property is required.')

    this.rootFolder = options.rootFolder
    this.filename = options.filename

    this.openFileForReading()
  }

  override async shutdown(): Promise<void> {
    try {
      await this.file?.close()
    } catch {
      /* ignore */
    }
  }

  openFileForReading() {
    this.fileOpenForRead = false
    fs.mkdir(this.rootFolder, { recursive: true }).then(() => {
      fs.open(this.rootFolder + this.filename, 'a+').then(
        value => {
          this.file = value
          fs.stat(this.rootFolder + this.filename).then(value => {
            this.fileLength = value.size
            this.fileOpenForRead = true
          })
        },
        reason => {
          console.log(`open BulkStorageFile ${this.rootFolder}${this.filename} failed with reason ${reason}`)
          this.fileLength = 0
          this.fileOpenForRead = false
        }
      )
    })
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async waitForOpen(): Promise<void> {
    while (!this.fileOpenForRead) this.sleep(1000)
  }

  async getMaxHeight(): Promise<number> {
    await this.waitForOpen()
    return this.fileLength / 80 - 1
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> {
    const maxHeight = await this.getMaxHeight()
    if (!this.file) throw new Error('File should be open...')
    if (height < 0) throw new Error(`Invalid height ${height}.`)
    if (height > maxHeight) return undefined

    const position = height * 80
    const buffer = Buffer.alloc(80)
    await this.file.read(buffer, 0, 80, position)
    const a = asArray(buffer)
    const header: BlockHeader = {
      ...deserializeBlockHeader(asArray(a)),
      height: height,
      hash: asString(doubleSha256BE(a))
    }

    return header
  }

  async appendHeaders(minHeight: number, count: number, newBulkHeaders: number[]): Promise<void> {
    await this.waitForOpen()
    if (!this.file) throw new Error('File should be open...')
    const maxHeight = await this.getMaxHeight()
    const previousHash = maxHeight < 0 ? '00'.repeat(32) : (await this.findHeaderForHeight(maxHeight)).hash
    if (minHeight !== maxHeight + 1)
      throw new Error(`block headers with minHeight ${minHeight} can't follow current maxHeight ${maxHeight}.`)
    validateBufferOfHeaders(newBulkHeaders, previousHash, 0, count)
    await this.file.appendFile(asBuffer(newBulkHeaders))
    this.fileLength += newBulkHeaders.length
    console.log(`bulk header count after append ${this.fileLength / 80}`)
  }

  async headersToBuffer(height: number, count: number): Promise<number[]> {
    await this.waitForOpen()
    if (!this.file) throw new Error('File should be open...')
    const position = height * 80
    const buffer = Buffer.alloc(80 * count)
    const result = await this.file.read(buffer, 0, buffer.length, position)
    return asArray(result.buffer.subarray(0, result.bytesRead))
  }
}
