import { StorageEngineApi } from './StorageEngineApi'
import { HeightRange } from '../util/HeightRange'
import { Chain } from '../../../../sdk/types'

export interface BulkIndexBaseOptions {
  chain: Chain
  hasBlockHashToHeightIndex: boolean
  hasMerkleRootToHeightIndex: boolean
  onlyAppendFromHeightZero: boolean
}

export interface BulkIndexApi {
  /**
   * Close and release all resources.
   */
  shutdown(): Promise<void>

  /**
   * Called during bulk header synchronizing after any new bulk headers have been added.
   *
   * Merge new headers or rewrite indices, then validate that indices cover
   * current bulk header storage.
   * @param added: range of new bulk headers added during synchronize
   */
  validate(added: HeightRange): Promise<void>

  /**
   * Append new Block Headers to BulkStorage.
   * Requires that these headers directly extend existing headers.
   * maxHeight of existing plus one equals minHeight of `headers`.
   * hash of last existing equals previousHash of first in `headers`.
   * Checks that all `headers` are valid (hash, previousHash)
   *
   * Duplicate headers must be ignored.
   *
   * @param minHeight must match height of first header in buffer
   * @param count times 80 must equal headers.length
   * @param headers encoded as packed array of 80 byte serialized block headers
   */
  appendHeaders(minHeight: number, count: number, headers: number[]): Promise<void>

  /**
   * Returns the height of the block with the given hash.
   * May not be on the active chain.
   * @param hash block hash
   */
  findHeightForBlockHash(hash: string): Promise<number | undefined>

  /**
   * Returns the height of the block with the given merkleRoot.
   * May not be on the active chain.
   * @param hash block hash
   */
  findHeightForMerkleRoot(merkleRoot: string): Promise<number | undefined>

  /**
   * Called before first Synchronize with reference to storage.
   * Components requiring asynchronous setup can override base class implementation.
   * @param storage
   */
  setStorage(storage: StorageEngineApi): Promise<void>
}
