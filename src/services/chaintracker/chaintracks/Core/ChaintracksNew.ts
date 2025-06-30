import { Chain } from "../../../../sdk"
import { BulkBlockHeaders } from "../Storage/BulkBlockHeaders"

export interface ChaintracksOptions {
  chain: Chain
  bulkBlockHeaders: BulkBlockHeaders
  //storageEngine: StorageEngineApi | undefined
  //bulkStorage: BulkStorageApi | undefined
  //bulkIndex: BulkIndexApi | undefined
  //bulkIngestors: BulkIngestorApi[]
  //liveIngestors: LiveIngestorApi[]
  logger?: (message: string, ...optionalParams: any[]) => void
}

export class ChaintracksNew {
    isAvailable: boolean = false

    bulkBlockHeaders: BulkBlockHeaders

    static createDefaultOptions(chain: Chain) : ChaintracksOptions {
        const options: ChaintracksOptions = {
            chain,
            bulkBlockHeaders: new BulkBlockHeaders(BulkBlockHeaders.createDefaultOptions(chain)),
            logger: () => {}
        }
        return options
    }

    constructor (options: ChaintracksOptions | "main" | "test") {
        options = typeof options !== 'string' ? options : ChaintracksNew.createDefaultOptions(options)
        this.bulkBlockHeaders = options.bulkBlockHeaders
    }

    /**
     * Steps to full availability:
     * 
     * 0. Start persistent live header websocket listener(s) feeding unprocessedLiveHeadersQueue.
     * 
     * 1. Obtain current chain tip header from services => tipHeight0
     * 
     * 2. From bulkBlockHeaders => lastBulkHeader + chainWork
     * 
     * 3. Start bulkBlockHeaders becoming available (preLoaded, validation, cacching).
     * 
     * 4. Start historic header retrieval from lastBulkHeader to tipHeight0 feeding unprocessedHistoricHeadersQueue.
     * 
     * 5. Make liveHeaderStorage available.
     * 
     * 6. Start draining unprocessedHistoricHeadersQueue to liveHeaderStorage, ends when tipHeight0 is reached.
     * 
     * 7. Migrate surplus live headers to bulkBlockHeaders, each migration adds a bulk "file", deletes from liveHeaderStorage.
     * 
     * 8. Start processing live headers.
     * 
     * 9. When unprocessedLiveHeadersQueue is next empty, Chaintracks is available, enable new header / reorg events.
     * 
     * @returns 
     */
    async makeAvailable(): Promise<void> {
        if (this.isAvailable) return

        await this.bulkBlockHeaders.makeAvailable()

        this.isAvailable = true
    }
}