import { BlockHeader } from './BlockHeaderApi'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface LiveIngestorApi {
  /**
   * Close and release all resources.
   */
  shutdown(): Promise<void>

  getHeaderByHash(hash: string): Promise<BlockHeader | undefined>

  /**
   * Called before first Synchronize with reference to storage.
   * Components requiring asynchronous setup can override base class implementation.
   * @param storage
   */
  setStorage(storage: ChaintracksStorageApi): Promise<void>

  storage(): ChaintracksStorageApi

  startListening(liveHeaders: BlockHeader[]): Promise<void>

  stopListening(): void
}
