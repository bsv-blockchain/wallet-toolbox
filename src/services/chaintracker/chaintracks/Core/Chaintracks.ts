// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChaintracksBase, Chain, ChaintracksBaseOptions, BulkStorageFile, BulkIngestorCDNBabbage, BulkIndexFile } from "@cwi/chaintracks-base";
import { StorageEngineKnex } from "@cwi/chaintracks-knex";
import { BulkIngestorWhatsOnChain, LiveIngestorWhatsOnChain } from "@cwi/chaintracks-whatsonchain";
import { Knex, knex } from "knex";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChaintracksOptions extends ChaintracksBaseOptions {
}

export class Chaintracks extends ChaintracksBase {
    static createChaintracksOptions(chain: Chain) : ChaintracksOptions {
        const options: ChaintracksOptions = {
            ...ChaintracksBase.createChaintracksBaseOptions(chain),
        }
        return options
    }

    /**
     * 
     * @param chain 
     * @param rootFolder defaults to "./data/"
     * @returns 
     */
    static createDefaultChaintracksOptions(chain: Chain, rootFolder?: string, knexConfig?: Knex.Config) : ChaintracksOptions {
        if (!rootFolder) rootFolder = "./data/"

        const options = Chaintracks.createChaintracksOptions(chain)

        const bulkStorageOptions = BulkStorageFile.createBulkStorageFileOptions(chain, rootFolder)
        options.bulkStorage = new BulkStorageFile(bulkStorageOptions)

        const bulkIndexOptions = BulkIndexFile.createBulkIndexFileOptions(chain, rootFolder)
        options.bulkIndex = new BulkIndexFile(bulkIndexOptions)

        const localSqlite: Knex.Config = {
            client: 'sqlite3',
            connection: { filename: `${rootFolder}${chain}Net_chaintracks.sqlite` },
            useNullAsDefault: true
        }

        const knexInstance = knex(knexConfig || localSqlite)

        const knexOptions = StorageEngineKnex.createStorageEngineKnexOptions(chain)
        knexOptions.knex = knexInstance
        options.storageEngine = new StorageEngineKnex(knexOptions)

        const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(chain, `${rootFolder}/bulk_cdn/`)
        options.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCDNOptions))

        const bulkWhatsOnChainOptions = BulkIngestorWhatsOnChain.createBulkIngestorWhatsOnChainOptions(chain, `${rootFolder}/ingest_woc/`)
        options.bulkIngestors.push(new BulkIngestorWhatsOnChain(bulkWhatsOnChainOptions))

        const liveWhatsOnChainOptions = LiveIngestorWhatsOnChain.createLiveIngestorWhatsOnChainOptions(chain)
        options.liveIngestors.push(new LiveIngestorWhatsOnChain(liveWhatsOnChainOptions))

        return options
    }

    /**
     * 
     * @param options Can be either ChaintracksOptions or Chain selection for default configuration. 
     * @param rootFolder defaults to "./data/"
     * @returns 
     */
    constructor (options: ChaintracksOptions | "main" | "test", rootFolder?: string) {
        options = typeof options !== 'string' ? options : Chaintracks.createDefaultChaintracksOptions(options, rootFolder)
        super(options)
    }
}