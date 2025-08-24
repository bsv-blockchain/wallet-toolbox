import { BlockHeader, Chain } from '../../../../sdk'
import { LiveIngestorBase } from './LiveIngestorBase'
import { LiveIngestorWhatsOnChainOptions } from './LiveIngestorWhatsOnChainPoll'
import { StopListenerToken, WocHeadersLiveListener } from './WhatsOnChainIngestorWs'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices } from './WhatsOnChainServices'

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
