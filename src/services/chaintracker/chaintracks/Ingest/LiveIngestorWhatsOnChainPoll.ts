import { BlockHeader, Chain } from '../../../../sdk'
import { wait } from '../../../../utility/utilityHelpers'
import { LiveIngestorBase, LiveIngestorBaseOptions } from '../Base/LiveIngestorBase'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices, WhatsOnChainServicesOptions } from './WhatsOnChainServices'

export interface LiveIngestorWhatsOnChainOptions extends LiveIngestorBaseOptions, WhatsOnChainServicesOptions {
  /**
   * Maximum msces of "normal" time with no ping received from connected WoC service.
   */
  idleWait: number | undefined
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

/**
 * Reports new headers by polling periodically.
 */
export class LiveIngestorWhatsOnChainPoll extends LiveIngestorBase {
  static createLiveIngestorWhatsOnChainOptions(chain: Chain): LiveIngestorWhatsOnChainOptions {
    const options: LiveIngestorWhatsOnChainOptions = {
      ...WhatsOnChainServices.createWhatsOnChainServicesOptions(chain),
      ...LiveIngestorBase.createLiveIngestorBaseOptions(chain),
      idleWait: 100000
    }
    return options
  }

  idleWait: number
  woc: WhatsOnChainServices
  done: boolean = false

  constructor(options: LiveIngestorWhatsOnChainOptions) {
    super(options)
    this.idleWait = options.idleWait || 100000
    this.woc = new WhatsOnChainServices(options)
  }

  async getHeaderByHash(hash: string): Promise<BlockHeader | undefined> {
    const header = await this.woc.getHeaderByHash(hash)
    return header
  }

  async startListening(liveHeaders: BlockHeader[]): Promise<void> {
    this.done = false
    let nextHeight = (await this.woc.getChainTipHeight()) + 1

    const errors: { code: number; message: string; count: number }[] = []
    const enqueue: EnqueueHandler = header => {
      liveHeaders.push(header)
      nextHeight = Math.max(nextHeight, header.height + 1)
    }
    const error: ErrorHandler = (code, message) => {
      errors.push({ code, message, count: errors.length })
      return false
    }

    for (; !this.done; ) {
      const ok = await this.woc.listenForOldBlockHeaders(nextHeight, nextHeight + 10, enqueue, error, this.idleWait)

      if (!ok || errors.length > 0) {
        console.log(`WhatsOnChain polled live ingestor ok=${ok} error count=${errors.length}`)
        for (const e of errors)
          console.log(`WhatsOnChain polled error code=${e.code} count=${e.count} message=${e.message}`)
      }

      await wait(60 * 1000)

      errors.length = 0
    }
  }

  stopListening(): void {
    this.done = true
  }
}
