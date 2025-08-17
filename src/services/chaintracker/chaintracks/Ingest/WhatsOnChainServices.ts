import {
  StopListenerToken,
  WocHeadersBulkListener,
  WocHeadersLiveListener
} from './WhatsOnChainIngestorWs'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { Chain } from '../../../../sdk'
import { WhatsOnChain, WocChainInfo } from '../../../providers/WhatsOnChain'

/**
 * return true to ignore error, false to close service connection
 */
export type ErrorHandler = (code: number, message: string) => boolean
export type EnqueueHandler = (header: BlockHeader) => void

export interface WhatsOnChainServicesOptions {
  /**
   * Which chain is being tracked: main, test, or stn.
   */
  chain: Chain
  /**
   * WhatsOnChain.com API Key
   * https://docs.taal.com/introduction/get-an-api-key
   * If unknown or empty, maximum request rate is limited.
   * https://developers.whatsonchain.com/#rate-limits
   */
  apiKey?: string
  /**
   * Request timeout for GETs to https://api.whatsonchain.com/v1/bsv
   */
  timeout: number
  /**
   * User-Agent header value for requests to https://api.whatsonchain.com/v1/bsv
   */
  userAgent: string
  /**
   * Enable WhatsOnChain client cache option.
   */
  enableCache: boolean
  /**
   * How long chainInfo is considered still valid before updating (msecs).
   */
  chainInfoMsecs: number
}

export class WhatsOnChainServices {
  static createWhatsOnChainServicesOptions(chain: Chain): WhatsOnChainServicesOptions {
    const options: WhatsOnChainServicesOptions = {
      chain,
      apiKey: '',
      timeout: 30000,
      userAgent: 'BabbageWhatsOnChainServices',
      enableCache: true,
      chainInfoMsecs: 5000
    }
    return options
  }

  static chainInfo: (WocChainInfo | undefined)[] = []
  static chainInfoTime: (Date | undefined)[] = []
  static chainInfoMsecs: number[] = []

  chain: Chain
  woc: WhatsOnChain

  constructor(public options: WhatsOnChainServicesOptions) {
    const config = {
      apiKey: this.options.apiKey,
      timeout: this.options.timeout,
      userAgent: this.options.userAgent,
      enableCache: this.options.enableCache
    }
    this.chain = options.chain
    WhatsOnChainServices.chainInfoMsecs[this.chain] = options.chainInfoMsecs
    this.woc = new WhatsOnChain(this.chain, config)
  }

  async getHeaderByHash(hash: string): Promise<BlockHeader | undefined> {
    const header = await this.woc.getBlockHeaderByHash(hash)
    return header
  }

  async getChainInfo(): Promise<WocChainInfo> {
    const now = new Date()
    let update = WhatsOnChainServices.chainInfo[this.chain] === undefined
    if (!update && WhatsOnChainServices.chainInfoTime[this.chain] !== undefined) {
      const elapsed = now.getTime() - WhatsOnChainServices.chainInfoTime[this.chain].getTime()
      update = elapsed > WhatsOnChainServices.chainInfoMsecs[this.chain]
    }
    if (update) {
      WhatsOnChainServices.chainInfo[this.chain] = await this.woc.getChainInfo()
      WhatsOnChainServices.chainInfoTime[this.chain] = now
    }
    if (!WhatsOnChainServices.chainInfo[this.chain]) throw new Error('Unexpected failure to update chainInfo.')
    return WhatsOnChainServices.chainInfo[this.chain]
  }

  async getChainTipHeight(): Promise<number> {
    return (await this.getChainInfo()).blocks
  }

  async getChainTipHash(): Promise<string> {
    return (await this.getChainInfo()).bestblockhash
  }

  private stopOldListenersToken: StopListenerToken = { stop: undefined }
  private stopNewListenersToken: StopListenerToken = { stop: undefined }

  stopOldListener() {
    this.stopOldListenersToken.stop?.()
  }

  stopNewListener() {
    this.stopNewListenersToken.stop?.()
  }

  async listenForOldBlockHeaders(
    fromHeight: number,
    toHeight: number,
    enqueue: EnqueueHandler,
    error: ErrorHandler,
    idleWait = 5000
  ): Promise<boolean> {
    return await WocHeadersBulkListener(
      fromHeight,
      toHeight,
      enqueue,
      error,
      this.stopOldListenersToken,
      this.chain,
      idleWait
    )
  }

  async listenForNewBlockHeaders(enqueue: EnqueueHandler, error: ErrorHandler, idleWait = 100000): Promise<boolean> {
    return await WocHeadersLiveListener(enqueue, error, this.stopNewListenersToken, this.chain, idleWait)
  }
}
