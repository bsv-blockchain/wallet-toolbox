import { BlockHeader, Chain } from '../../../../sdk'
import { LiveIngestorBase, LiveIngestorBaseOptions } from '../Base/LiveIngestorBase'
import { StopListenerToken, WocHeadersLiveListener } from './WhatsOnChainIngestorWs'
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

export class LiveIngestorWhatsOnChainWs extends LiveIngestorBase {
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
  stopNewListenersToken: StopListenerToken = { stop: undefined }

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
    const errors: { code: number; message: string; count: number }[] = []
    const enqueue: EnqueueHandler = header => {
      liveHeaders.push(header)
    }
    const error: ErrorHandler = (code, message) => {
      errors.push({ code, message, count: errors.length })
      return false
    }

    for (;;) {
      const ok = await WocHeadersLiveListener(enqueue, error, this.stopNewListenersToken, this.chain, this.idleWait)

      if (!ok || errors.length > 0) {
        console.log(`WhatsOnChain live ingestor ok=${ok} error count=${errors.length}`)
        for (const e of errors) console.log(`WhatsOnChain error code=${e.code} count=${e.count} message=${e.message}`)
      }

      if (ok) break

      errors.length = 0
    }
  }

  stopListening(): void {
    this.stopNewListenersToken.stop?.()
  }
}
