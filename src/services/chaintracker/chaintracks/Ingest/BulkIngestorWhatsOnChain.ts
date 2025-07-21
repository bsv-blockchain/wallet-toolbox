import { logger } from '../../../../../test/utils/TestUtilsWalletStorage'
import { Chain } from '../../../../sdk'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from '../Api/BulkIngestorApi'
import { BulkIngestorBase } from '../Base/BulkIngestorBase'
import { HeightRange } from '../util/HeightRange'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices, WhatsOnChainServicesOptions } from './WhatsOnChainServices'

export interface BulkIngestorWhatsOnChainOptions extends BulkIngestorBaseOptions, WhatsOnChainServicesOptions {
  /**
   * Maximum msces of "normal" pause with no new data arriving.
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

export class BulkIngestorWhatsOnChain extends BulkIngestorBase {
  /**
   *
   * @param chain
   * @param localCachePath defaults to './data/ingest_whatsonchain_headers'
   * @returns
   */
  static createBulkIngestorWhatsOnChainOptions(chain: Chain): BulkIngestorWhatsOnChainOptions {
    const options: BulkIngestorWhatsOnChainOptions = {
      ...WhatsOnChainServices.createWhatsOnChainServicesOptions(chain),
      ...BulkIngestorBase.createBulkIngestorBaseOptions(chain),
      idleWait: 5000
    }
    return options
  }

  idleWait: number
  woc: WhatsOnChainServices

  constructor(options: BulkIngestorWhatsOnChainOptions) {
    super(options)
    this.idleWait = options.idleWait || 5000
    this.woc = new WhatsOnChainServices(options)
  }

  override async getPresentHeight(): Promise<number | undefined> {
    const presentHeight = await this.woc.getChainTipHeight()
    logger(`presentHeight=${presentHeight}`)
    return presentHeight
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateLocalCache(
    /**
     * Range of heights that may be added to bulk storage.
     */
    neededRange: HeightRange,
    /**
     * Best guess at current height of active chain tip.
     */
    presentHeight: number,
    /**
     * Any live headers accumulated thus far which will be forwarded to live header storage.
     */
    priorLiveHeaders?: BlockHeader[]
  ): Promise<{ liveHeaders: BlockHeader[] }> {
    let fromHeight: number

    if (!neededRange.isEmpty) {
      fromHeight = neededRange.minHeight
    } else if (priorLiveHeaders && priorLiveHeaders.length > 0) {
      // If we have prior live headers, start from the last one with a small overlap.
      fromHeight = priorLiveHeaders.slice(-1)[0].height + 1 - 10
    } else {
      fromHeight = presentHeight - 10
    }

    const oldHeaders: BlockHeader[] = []
    const errors: { code: number; message: string; count: number }[] = []
    const enqueue: EnqueueHandler = header => {
      oldHeaders.push(header)
    }
    const error: ErrorHandler = (code, message) => {
      errors.push({ code, message, count: errors.length })
      return false
    }
    const ok = await this.woc.listenForOldBlockHeaders(fromHeight, presentHeight, enqueue, error, this.idleWait)

    let liveHeaders: BlockHeader[] = []
    if (ok) {
      const r = await this.storage().addOldBlockHeaders(oldHeaders, presentHeight, priorLiveHeaders)
      liveHeaders = r.liveHeaders
    }

    if (errors.length > 0) {
      const errorMessages = errors.map(e => `(${e.code}) ${e.message} (${e.count})`).join('\n')
      logger(`Errors during WhatsOnChain ingestion:\n${errorMessages}`)
    }

    return { liveHeaders }
  }
}
