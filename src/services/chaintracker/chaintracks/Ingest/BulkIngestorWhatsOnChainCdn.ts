import { Chain } from '../../../../sdk'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from '../Api/BulkIngestorApi'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { BulkIngestorBase } from './BulkIngestorBase'
import { deserializeBlockHeader } from '../util/blockHeaderUtilities'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { HeightRange, HeightRanges } from '../util/HeightRange'
import { StopListenerToken } from './WhatsOnChainIngestorWs'
import { WhatsOnChainServices, WhatsOnChainServicesOptions } from './WhatsOnChainServices'

export interface BulkIngestorWhatsOnChainOptions extends BulkIngestorBaseOptions, WhatsOnChainServicesOptions {
  /**
   * Maximum msecs of "normal" pause with no new data arriving.
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
  /**
   *
   */
  fetch?: ChaintracksFetchApi
}

export class BulkIngestorWhatsOnChainCdn extends BulkIngestorBase {
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

  fetch: ChaintracksFetchApi
  idleWait: number
  woc: WhatsOnChainServices
  stopOldListenersToken: StopListenerToken = { stop: undefined }

  constructor(options: BulkIngestorWhatsOnChainOptions) {
    super(options)
    this.idleWait = options.idleWait || 5000
    this.woc = new WhatsOnChainServices(options)
    this.fetch = options.fetch || new ChaintracksFetch()
  }

  override async getPresentHeight(): Promise<number | undefined> {
    const presentHeight = await this.woc.getChainTipHeight()
    this.log(`presentHeight=${presentHeight}`)
    return presentHeight
  }

  async fetchHeaders(
    before: HeightRanges,
    fetchRange: HeightRange,
    bulkRange: HeightRange,
    priorLiveHeaders: BlockHeader[]
  ): Promise<BlockHeader[]> {
    const oldHeaders: BlockHeader[] = []

    try {
      const ranges = await this.woc.getHeaderByteFileLinks(fetchRange, this.fetch)
      const headers: BlockHeader[] = []
      for (const range of ranges) {
        for (let height = range.range.minHeight; height <= range.range.maxHeight; height++) {
          if (fetchRange.contains(height)) {
            if (!range.data)
              range.data = await this.fetch.download(this.fetch.pathJoin(range.sourceUrl, range.fileName))
            const h = deserializeBlockHeader(range.data, (height - range.range.minHeight) * 80, height)
            oldHeaders.push(h)
          }
        }
      }
    } catch (e) {
      this.log(`Errors during WhatsOnChain ingestion:\n${e}`)
    }

    const liveHeaders = await this.storage().addBulkHeaders(oldHeaders, bulkRange, priorLiveHeaders)

    return liveHeaders
  }
}
