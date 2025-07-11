/* eslint-disable @typescript-eslint/no-unused-vars */
import { BulkStorageBaseOptions } from './Api/BulkStorageApi'
import { BulkStorageBase } from './Base/BulkStorageBase'
import { deserializeBaseBlockHeader, validateBufferOfHeaders } from './util/blockHeaderUtilities'
import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { doubleSha256BE } from '../../../utility/utilityHelpers'
import { asString } from '../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi, ChaintracksAppendableFileApi } from './Api/ChaintracksFsApi'

export interface BulkStorageFileOptions extends BulkStorageBaseOptions {
  rootFolder: string | undefined
  filename: string | undefined
  fs: ChaintracksFsApi
}

export class BulkStorageFile extends BulkStorageBase {
  static createBulkStorageFileOptions(chain: Chain, fs: ChaintracksFsApi, rootFolder?: string): BulkStorageFileOptions {
    const options: BulkStorageFileOptions = {
      ...BulkStorageBase.createBulkStorageBaseOptions(chain, fs),
      rootFolder: rootFolder || './data/',
      filename: `${chain}Net_bulk_storage_file.headers`
    }
    return options
  }

  rootFolder: string
  filename: string
  file?: ChaintracksAppendableFileApi
  fileLength = 0

  constructor(options: BulkStorageFileOptions) {
    super(options)
    if (!options.rootFolder) throw new Error('The rootFolder options property is required.')
    if (!options.filename) throw new Error('The filename options property is required.')

    this.rootFolder = options.rootFolder
    this.filename = options.filename
  }

  override async shutdown(): Promise<void> {
    try {
      await this.file?.close()
    } catch {
      /* ignore */
    }
  }

  async makeAvailable(): Promise<void> {
    if (this.file) return
    this.file = await this.fs.openAppendableFile(this.fs.pathJoin(this.rootFolder, this.filename))
    this.fileLength = await this.file.getLength()
  }

  /*
  openFileForReading() {
    this.fileOpenForRead = false
    fs.mkdir(this.rootFolder, { recursive: true }).then(() => {
      fs.open(this.rootFolder  + this.filename, 'a+').then(
        value => {
          this.file = value
          fs.stat(this.rootFolder  + this.filename).then(value => {
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
  */

  async getMaxHeight(): Promise<number> {
    await this.makeAvailable()
    return this.fileLength / 80 - 1
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> {
    await this.makeAvailable()
    const maxHeight = await this.getMaxHeight()
    if (!this.file) throw new Error('File should be open...')
    if (height < 0) throw new Error(`Invalid height ${height}.`)
    if (height > maxHeight) return undefined

    const position = height * 80
    const a = await this.file.read(80, position)
    const header: BlockHeader = {
      ...deserializeBaseBlockHeader(a),
      height: height,
      hash: asString(doubleSha256BE(a))
    }

    return header
  }

  async appendHeaders(minHeight: number, count: number, newBulkHeaders: Uint8Array): Promise<void> {
    await this.makeAvailable()
    if (!this.file) throw new Error('File should be open...')
    const maxHeight = await this.getMaxHeight()
    const previousHash = maxHeight < 0 ? '00'.repeat(32) : (await this.findHeaderForHeight(maxHeight)).hash
    if (minHeight !== maxHeight + 1)
      throw new Error(`block headers with minHeight ${minHeight} can't follow current maxHeight ${maxHeight}.`)
    validateBufferOfHeaders(newBulkHeaders, previousHash, 0, count)
    await this.file.append(newBulkHeaders)
    this.fileLength += newBulkHeaders.length
    console.log(`bulk header count after append ${this.fileLength / 80}`)
  }

  async headersToBuffer(height: number, count: number): Promise<Uint8Array> {
    await this.makeAvailable()
    if (!this.file) throw new Error('File should be open...')
    const position = height * 80
    const length = 80 * count
    const bytes = await this.file.read(length, position)
    return bytes
  }
}
