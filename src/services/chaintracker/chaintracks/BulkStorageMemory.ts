/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Chain } from '../../../sdk/types'
import { doubleSha256BE } from '../../../utility/utilityHelpers'
import { asString } from '../../../utility/utilityHelpers.noBuffer'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkStorageBaseOptions } from './Api/BulkStorageApi'

import { BulkStorageBase } from './Base/BulkStorageBase'
import { deserializeBlockHeader, validateBufferOfHeaders } from './util/blockHeaderUtilities'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BulkStorageMemoryOptions extends BulkStorageBaseOptions {}

export class BulkStorageMemory extends BulkStorageBase {
  static createBulkStorageMemoryOptions(chain: Chain): BulkStorageMemoryOptions {
    const options: BulkStorageMemoryOptions = {
      ...BulkStorageBase.createBulkStorageBaseOptions(chain)
    }
    return options
  }

  memory: number[] = []

  constructor(options: BulkStorageMemoryOptions) {
    super(options)
  }

  getMaxHeight(): Promise<number> {
    return Promise.resolve(this.memory.length / 80 - 1)
  }

  async findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> {
    const maxHeight = await this.getMaxHeight()
    if (height < 0) throw new Error(`Invalid height ${height}.`)
    if (height > maxHeight) undefined

    const offset = height * 80
    const buffer = this.memory.slice(offset, offset + 80)
    const header: BlockHeader = {
      ...deserializeBlockHeader(buffer),
      height: height,
      hash: asString(doubleSha256BE(buffer))
    }

    return header
  }

  async appendHeaders(minHeight: number, count: number, newBulkHeaders: number[]): Promise<void> {
    const maxHeight = await this.getMaxHeight()
    const previousHash = maxHeight < 0 ? '00'.repeat(32) : (await this.findHeaderForHeight(maxHeight)).hash
    if (minHeight !== maxHeight + 1)
      throw new Error(`block headers with minHeight ${minHeight} can't follow current maxHeight ${maxHeight}.`)
    validateBufferOfHeaders(newBulkHeaders, previousHash, 0, count)
    this.memory = this.memory.concat(newBulkHeaders)
    console.log(`bulk memory count after append ${this.memory.length / 80}`)
  }

  async headersToBuffer(height: number, count: number): Promise<number[]> {
    const maxHeight = await this.getMaxHeight()
    if (height < 0 || height > maxHeight || count < 0)
      throw new Error(`Requested height ${height} count ${count} is not valid with maxHeight ${maxHeight}`)
    return this.memory.slice(height * 80, Math.min(maxHeight + 1, height + count) * 80)
  }
}
