/* eslint-disable @typescript-eslint/no-empty-function */
import { Chain } from '../../../../sdk/types'
import { LiveIngestorApi } from '../Api/LiveIngestorApi'
import { ChaintracksStorageApi } from '../Api/ChaintracksStorageApi'
import { BlockHeader } from '../Api/BlockHeaderApi'

export interface LiveIngestorBaseOptions {
  /**
   * The target chain: "main" or "test"
   */
  chain: Chain
}

/**
 *
 */
export abstract class LiveIngestorBase implements LiveIngestorApi {
  static createLiveIngestorBaseOptions(chain: Chain) {
    const options: LiveIngestorBaseOptions = {
      chain
    }
    return options
  }

  chain: Chain

  constructor(options: LiveIngestorBaseOptions) {
    this.chain = options.chain
  }

  /**
   * Release resources.
   * Override if required.
   */
  async shutdown(): Promise<void> {}

  private storageEngine?: ChaintracksStorageApi

  /**
   * Allocate resources.
   * @param storage coordinating storage engine.
   */
  async setStorage(storage: ChaintracksStorageApi): Promise<void> {
    this.storageEngine = storage
  }

  /**
   *
   * @returns coordinating storage engine.
   */
  storage(): ChaintracksStorageApi {
    if (!this.storageEngine) throw new Error('storageEngine must be set.')
    return this.storageEngine
  }

  /**
   * Called to retrieve a missing block header,
   * when the previousHash of a new header is unknown.
   *
   * @param hash block hash of missing header
   */
  abstract getHeaderByHash(hash: string): Promise<BlockHeader | undefined>

  /**
   * Begin retrieving new block headers.
   *
   * New headers are pushed onto the liveHeaders array.
   *
   * Continue waiting for new headers.
   *
   * Return only when either `stopListening` or `shutdown` are called.
   *
   * Be prepared to resume listening after `stopListening` but not
   * after `shutdown`.
   *
   * @param liveHeaders
   */
  abstract startListening(liveHeaders: BlockHeader[]): Promise<void>

  /**
   * Causes `startListening` to stop listening for new block headers and return.
   */
  abstract stopListening(): void
}
