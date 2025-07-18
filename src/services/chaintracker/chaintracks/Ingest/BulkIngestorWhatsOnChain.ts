import { logger } from '../../../../../test/utils/TestUtilsWalletStorage'
import { Chain, WERR_INVALID_OPERATION } from '../../../../sdk'
import { asUint8Array } from '../../../../utility/utilityHelpers.noBuffer'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from '../Api/BulkIngestorApi'
import { BulkIngestorBase } from '../Base/BulkIngestorBase'
import { blockHash, serializeBlockHeader } from '../util/blockHeaderUtilities'
import { BulkFilesReader } from '../util/BulkFilesReader'
import { ChaintracksFs } from '../util/ChaintracksFs'
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
  ): Promise<{ reader: BulkFilesReader; liveHeaders: BlockHeader[] }> {
    let fromHeight: number

    if (!neededRange.isEmpty) {
      fromHeight = neededRange.minHeight
    } else if (priorLiveHeaders && priorLiveHeaders.length > 0) {
      // If we have prior live headers, start from the last one with a small overlap.
      fromHeight = priorLiveHeaders.slice(-1)[0].height + 1 - 10
    } else {
      fromHeight = presentHeight - 10
    }

    const liveHeaders: BlockHeader[] = []
    const bulkHeaders: BlockHeader[] = []
    const errors: { code: number; message: string; count: number }[] = []
    const enqueue: EnqueueHandler = header => {
      const height = header.height
      if (!neededRange.isEmpty && header.height <= neededRange.maxHeight) {
        bulkHeaders.push(header)
      } else {
        liveHeaders.push(header)
      }
    }
    const error: ErrorHandler = (code, message) => {
      errors.push({ code, message, count: errors.length })
      return false
    }
    const ok = await this.woc.listenForOldBlockHeaders(fromHeight, presentHeight, enqueue, error, this.idleWait)

    if (ok) await this.storage().addOldBlockHeaders(bulkHeaders, liveHeaders, presentHeight)

    if (bulkHeaders.length) fromHeight = bulkHeaders[bulkHeaders.length - 1].height + 1
    if (!ok || errors.length > 0) {
      console.log(`WhatsOnChain bulk ingestor ok=${ok} error count=${errors.length}`)
      for (const e of errors) console.log(`WhatsOnChain error code=${e.code} count=${e.count} message=${e.message}`)
    }

    if (bulkHeaders.length > 0) {
      // Sanitize headers received...
      // Oldest header's height must equal neededRange.minHeight
      // From newest header, previousHash must equal hash of previous header.
      let sanitized = new Array<number>(0)
      let lastPreviousHash: string | undefined
      let lastHeight: number | undefined
      const j = bulkHeaders.length
      for (let i = j - 1; i >= 0; i--) {
        const header = bulkHeaders[i]
        if (lastHeight !== undefined && lastHeight - 1 !== header.height) {
          console.log(
            `WhatsOnChain bulk ingestor skipping header at height ${lastHeight - 1}, found ${header.height} ${header.hash}`
          )
          continue
        }
        const buffer = serializeBlockHeader(header)
        const hash = blockHash(buffer)
        if (lastPreviousHash && hash !== lastPreviousHash) {
          console.log(
            `WhatsOnChain bulk ingestor skipping header at height ${header.height}, hash ${header.hash} is not expected previous hash ${lastPreviousHash}`
          )
          continue
        }
        sanitized = buffer.concat(sanitized)
        lastPreviousHash = header.previousHash
        lastHeight = header.height
      }

      if (lastHeight && (manager.range.isEmpty || lastHeight === manager.range.maxHeight + 1) && lastPreviousHash) {
        const newBulkHeaders = sanitized
        const firstHeight = lastHeight
        const previousHash = lastPreviousHash
        await manager.appendHeaders(asUint8Array(newBulkHeaders), firstHeight, previousHash)
        manager.nextHeight = firstHeight
      }
    }

    manager.resetRange(neededRange)
    return { reader: manager, liveHeaders }
  }
}
