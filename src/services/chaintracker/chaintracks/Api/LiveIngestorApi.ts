import { BlockHeader } from './BlockHeaderApi'
import { StorageEngineApi } from './StorageEngineApi'

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
  setStorage(storage: StorageEngineApi): Promise<void>

  storage(): StorageEngineApi

  startListening(liveHeaders: BlockHeader[]): Promise<void>

  stopListening(): void
}
