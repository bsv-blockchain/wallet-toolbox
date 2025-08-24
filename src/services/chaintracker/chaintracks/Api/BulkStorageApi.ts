// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chain } from '../../../../sdk/types'
import { BlockHeader, LiveBlockHeader } from './BlockHeaderApi'
import { HeightRange } from '../util/HeightRange'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'
import { ChaintracksFsApi } from './ChaintracksFsApi'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BulkStorageBaseOptions {
  /**
   * The target chain: "main" or "test"
   */
  chain: Chain
  fs: ChaintracksFsApi
}

/**
 * Handles block header storage and retrieval older than the "live" portion of the chain.
 * Height is the primary and only indexing field required.
 * Only stores headers on the active chain; no orphans, no forks, no reorgs.
 */
export interface BulkStorageApi {
  /**
   * Close and release all resources.
   */
  shutdown(): Promise<void>

  /**
   * @returns the height of the most recent header in bulk storage or -1 if empty.
   */
  getMaxHeight(): Promise<number>

  /**
   * @returns available bulk block header height range: `(0, getMaxHeight())`
   */
  getHeightRange(): Promise<HeightRange>

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
  appendHeaders(minHeight: number, count: number, headers: Uint8Array): Promise<void>

  /**
   * Returns block header for a given block height on active chain.
   * @param hash block hash
   */
  findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined>

  /**
   * Returns block header for a given block height on active chain.
   * Throws if not found.
   * @param hash block hash
   */
  findHeaderForHeight(height: number): Promise<BlockHeader>

  /**
   * Adds headers in 80 byte serialized format to a buffer.
   * Only adds active headers.
   * returned array length divided by 80 is the actual number returned.
   *
   * Returns the buffer.
   *
   * @param height of first header
   * @param count of headers
   */
  headersToBuffer(height: number, count: number): Promise<Uint8Array>

  /**
   * Exports current bulk headers, including all ingests, excluding live headers to static header files.
   * @param rootFolder Where the json and headers files will be written
   * @param jsonFilename The name of the json file.
   * @param maxPerFile The maximum headers per file.
   */
  exportBulkHeaders(rootFolder: string, jsonFilename: string, maxPerFile: number): Promise<void>

  /**
   * Called before first Synchronize with reference to storage.
   * Components requiring asynchronous setup can override base class implementation.
   * @param storage
   */
  setStorage(storage: ChaintracksStorageApi): Promise<void>
}
