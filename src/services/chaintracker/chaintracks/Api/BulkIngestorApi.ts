/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Chain } from '../../../../sdk/types'
import { BlockHeader } from './BlockHeaderApi'
import { ChaintracksFsApi } from './ChaintracksFsApi'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'

export interface BulkIngestorBaseOptions {
  /**
   * The target chain: "main" or "test"
   */
  chain: Chain

  /**
   * Required.
   *
   * The name of the JSON resource to request from CDN which describes currently
   * available bulk block header resources.
   */
  jsonFilename: string | undefined

  /**
   * If true, and the bulk ingestor supports it, bypass the live database
   * up to `liveHeightThreshold` of available headers remaining.
   */
  bypassLiveEnabled: boolean
}

export interface BulkIngestorApi {
  /**
   * Close and release all resources.
   */
  shutdown(): Promise<void>

  /**
   * If the bulk ingestor is capable, return the approximate
   * present height of the actual chain being tracked.
   * Otherwise, return undefined
   */
  getPresentHeight(): Promise<number | undefined>

  /**
   * Synchronize stored headers with availble bulk header storage from this ingestor
   *
   * The definition of bulk storage is headers of sufficient age that there is exactly one
   * header at each height, each header follows the header with its previousHash.
   *
   * All bulk ingestors are required to enforce these conditions on the headers they make avaible to ingest.
   *
   * As a corollary, a bulk ingestor must never offer headers for ingest that are within the `` of the present.
   *
   * The base class implementation takes care of much of the required logic, relying on override of updateLocalCache
   * to provide access to the block headers sourced by this ingestor through a BulkFilesReader.
   *
   * Ingesters that also acquire more recent block headers than the `` can return these headers in the order
   * retrieved with no additional processing.
   *
   * @param presentHeight approximate current height of public chain tip, if known
   * @param priorLiveHeaders any liveHeaders already obtained from a bulk ingestor
   * @returns optional array of live block headers
   */
  synchronize(presentHeight: number, priorLiveHeaders?: BlockHeader[]): Promise<BlockHeader[] | undefined>

  /**
   * Called before first Synchronize with reference to storage.
   * Components requiring asynchronous setup can override base class implementation.
   * @param storage
   */
  setStorage(storage: ChaintracksStorageApi): Promise<void>

  storage(): ChaintracksStorageApi
}
