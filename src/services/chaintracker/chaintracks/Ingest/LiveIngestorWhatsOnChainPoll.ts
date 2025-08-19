import { BlockHeader, Chain } from '../../../../sdk'
import { wait } from '../../../../utility/utilityHelpers'
import { LiveIngestorBase, LiveIngestorBaseOptions } from '../Base/LiveIngestorBase'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices, WhatsOnChainServicesOptions, WocGetHeadersHeader } from './WhatsOnChainServices'

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
    let lastHeaders: WocGetHeadersHeader[] = []

    for (; !this.done; ) {
      const headers = await this.woc.getHeaders()

      const newHeaders = headers.filter(h => !lastHeaders.some(lh => lh.hash === h.hash))

      for (const h of newHeaders) {
        const bits: number = typeof h.bits === 'string' ? parseInt(h.bits, 16) : h.bits
        if (!h.previousblockhash) {
          h.previousblockhash = '0000000000000000000000000000000000000000000000000000000000000000' // genesis
        }
        const bh: BlockHeader = {
          height: h.height,
          hash: h.hash,
          version: h.version,
          previousHash: h.previousblockhash,
          merkleRoot: h.merkleroot,
          time: h.time,
          bits,
          nonce: h.nonce
        }
        liveHeaders.unshift(bh)
      }

      lastHeaders = headers

      await wait(1000 * 60)
    }
    console.log(`LiveIngestorWhatsOnChainPoll stopped`)
  }

  stopListening(): void {
    this.done = true
  }
}
