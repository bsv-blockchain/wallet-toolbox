import { ChainTracker } from '@bsv/sdk'
import { BaseBlockHeader, BlockHeader } from './BlockHeaderApi'
import { Chain } from '../../../../sdk/types'

/**
 * @public
 */
export type HeaderListener = (header: BlockHeader) => void

/**
 * @public
 */
export type ReorgListener = (depth: number, oldTip: BlockHeader, newTip: BlockHeader) => void

/**
 * @public
 */
export interface ChaintracksPackageInfoApi {
  name: string
  version: string
}

/**
 * @public
 */
export interface ChaintracksInfoApi {
  chain: Chain
  heightBulk: number
  heightLive: number
  storageEngine: string
  bulkIngestors: string[]
  liveIngestors: string[]
  packages: ChaintracksPackageInfoApi[]
}

/**
 * Chaintracks client API excluding events and callbacks
 * @public
 */
export interface ChaintracksClientApi extends ChainTracker {
  /**
   * Confirms the chain
   */
  getChain(): Promise<Chain>

  /**
   * @returns Summary of configuration and state.
   */
  getInfo(): Promise<ChaintracksInfoApi>

  /**
   * Return the latest chain height from configured bulk ingestors.
   */
  getPresentHeight(): Promise<number>

  /**
   * Adds headers in 80 byte serialized format to an array.
   * Only adds active headers.
   * array length divided by 80 is the actual number returned.
   *
   * @param height of first header
   * @param count of headers, maximum
   * @returns array of headers as serialized hex string
   */
  getHeaders(height: number, count: number): Promise<string>

  /**
   * Returns the active chain tip header
   */
  findChainTipHeader(): Promise<BlockHeader>

  /**
   * Returns the block hash of the active chain tip.
   */
  findChainTipHash(): Promise<string>

  /**
   * Returns block header for a given block height on active chain.
   */
  findHeaderForHeight(height: number): Promise<BlockHeader | undefined>

  /**
   * Returns block header for a given recent block hash or undefined.
   * @param hash
   */
  findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined>

  /**
   * Submit a possibly new header for adding
   *
   * If the header is invalid or a duplicate it will not be added.
   *
   * This header will be ignored if the previous header has not already been inserted when this header
   * is considered for insertion.
   *
   * @param header
   * @returns immediately
   */
  addHeader(header: BaseBlockHeader): Promise<void>

  /**
   * Start or resume listening for new headers.
   *
   * Calls `synchronize` to catch up on headers that were found while not listening.
   *
   * Begins listening to any number of configured new header notification services.
   *
   * Begins sending notifications to subscribed listeners only after processing any
   * previously found headers.
   *
   * May be called if already listening or synchronizing to listen.
   *
   * The `listening` API function which returns a Promise can be awaited.
   */
  startListening(): Promise<void>

  /**
   * Returns a Promise that will resolve when the previous call to startListening
   * enters the listening-for-new-headers state.
   */
  listening(): Promise<void>

  /**
   * Returns true if actively listening for new headers and client api is enabled.
   */
  isListening(): Promise<boolean>

  /**
   * Returns true if `synchronize` has completed at least once.
   */
  isSynchronized(): Promise<boolean>

  /**
   * Subscribe to "header" events.
   * @param listener
   * @returns identifier for this subscription
   * @throws ERR_NOT_IMPLEMENTED if callback events are not supported
   */
  subscribeHeaders(listener: HeaderListener): Promise<string>

  /**
   * Subscribe to "reorganization" events.
   * @param listener
   * @returns identifier for this subscription
   * @throws ERR_NOT_IMPLEMENTED if callback events are not supported
   */
  subscribeReorgs(listener: ReorgListener): Promise<string>

  /**
   * Cancels all subscriptions with the given `subscriptionId` which was previously returned
   * by a `subscribe` method.
   * @param subscriptionId value previously returned by subscribeToHeaders or subscribeToReorgs
   * @returns true if a subscription was canceled
   * @throws ERR_NOT_IMPLEMENTED if callback events are not supported
   */
  unsubscribe(subscriptionId: string): Promise<boolean>

  isValidRootForHeight(root: string, height: number): Promise<boolean>
  currentHeight: () => Promise<number>
}

/**
 * Full Chaintracks API including startListening with callbacks
 */
export interface ChaintracksApi extends ChaintracksClientApi {
  /**
   * Start or resume listening for new headers.
   *
   * Calls `synchronize` to catch up on headers that were found while not listening.
   *
   * Begins listening to any number of configured new header notification services.
   *
   * Begins sending notifications to subscribed listeners only after processing any
   * previously found headers.
   *
   * May be called if already listening or synchronizing to listen.
   *
   * `listening` callback will be called after listening for new live headers has begun.
   * Alternatively, the `listening` API function which returns a Promise can be awaited.
   *
   * @param listening callback indicates when listening for new headers has started.
   */
  startListening(listening?: () => void): Promise<void>
}
