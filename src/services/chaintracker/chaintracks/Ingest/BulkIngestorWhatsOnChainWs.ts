import { Chain } from '../../../../sdk'
import { logger } from '../../../../utility/utilityHelpers'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { BulkIngestorBase } from './BulkIngestorBase'
import { HeightRange, HeightRanges } from '../util/HeightRange'
import { BulkIngestorWhatsOnChainOptions } from './BulkIngestorWhatsOnChainCdn'
import { StopListenerToken, WocHeadersBulkListener } from './WhatsOnChainIngestorWs'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices } from './WhatsOnChainServices'

export class BulkIngestorWhatsOnChainWs extends BulkIngestorBase {
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
  stopOldListenersToken: StopListenerToken = { stop: undefined }

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

  async fetchHeaders(
    before: HeightRanges,
    fetchRange: HeightRange,
    bulkRange: HeightRange,
    priorLiveHeaders: BlockHeader[]
  ): Promise<BlockHeader[]> {
    const oldHeaders: BlockHeader[] = []
    const errors: { code: number; message: string; count: number }[] = []
    const enqueue: EnqueueHandler = header => {
      oldHeaders.push(header)
    }
    const error: ErrorHandler = (code, message) => {
      errors.push({ code, message, count: errors.length })
      return false
    }

    const ok = await WocHeadersBulkListener(
      fetchRange.minHeight,
      fetchRange.maxHeight,
      enqueue,
      error,
      this.stopOldListenersToken,
      this.chain,
      this.idleWait
    )

    let liveHeaders: BlockHeader[] = []
    if (ok) {
      liveHeaders = await this.storage().addBulkHeaders(oldHeaders, bulkRange, priorLiveHeaders)
    }

    if (errors.length > 0) {
      const errorMessages = errors.map(e => `(${e.code}) ${e.message} (${e.count})`).join('\n')
      logger(`Errors during WhatsOnChain ingestion:\n${errorMessages}`)
    }

    return liveHeaders
  }
}
