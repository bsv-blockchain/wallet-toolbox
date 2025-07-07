/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { BulkIndexApi, BulkIndexBaseOptions } from '../Api/BulkIndexApi'
import { HeightRange } from '../util/HeightRange'
import { StorageEngineApi } from '../Api/StorageEngineApi'
import { Chain } from '../../../../sdk/types'

export abstract class BulkIndexBase implements BulkIndexApi {
  static createBulkIndexBaseOptions(chain: Chain): BulkIndexBaseOptions {
    const options: BulkIndexBaseOptions = {
      chain,
      hasBlockHashToHeightIndex: true,
      hasMerkleRootToHeightIndex: true,
      onlyAppendFromHeightZero: true
    }
    return options
  }

  chain: Chain
  hasBlockHashToHeightIndex: boolean
  hasMerkleRootToHeightIndex: boolean
  onlyAppendFromHeightZero: boolean

  constructor(options: BulkIndexBaseOptions) {
    this.chain = options.chain
    this.hasBlockHashToHeightIndex = options.hasBlockHashToHeightIndex
    this.hasMerkleRootToHeightIndex = options.hasMerkleRootToHeightIndex
    this.onlyAppendFromHeightZero = options.onlyAppendFromHeightZero
  }

  async shutdown(): Promise<void> {}

  abstract setStorage(storage: StorageEngineApi): Promise<void>
  abstract validate(added: HeightRange): Promise<void>
  abstract appendHeaders(minHeight: number, count: number, newBulkHeaders: Uint8Array): Promise<void>
  abstract findHeightForBlockHash(hash: string): Promise<number | undefined>
  abstract findHeightForMerkleRoot(merkleRoot: string): Promise<number | undefined>
}
