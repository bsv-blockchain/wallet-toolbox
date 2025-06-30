import { Knex, knex as makeKnex } from "knex"
import { Chain } from "../../../sdk"
import { ChaintracksOptions } from "./Api/ChaintracksApi"
import { Chaintracks } from "./Chaintracks"
import { BulkStorageFile } from "./BulkStorageFile"
import { BulkIndexFile } from "./BulkIndexFile"
import { ChaintracksFs } from "./util/ChaintracksFs"
import { StorageEngineKnex } from "./Storage"
import { BulkIngestorCDNBabbage } from "./BulkIngestorCDNBabbage"
import { BulkIngestorWhatsOnChain } from "./Ingest/BulkIngestorWhatsOnChain"
import { ChaintracksFetch } from "./util/ChaintracksFetch"
import { LiveIngestorWhatsOnChain } from "./Ingest"

/**
 * 
 * @param chain 
 * @param rootFolder defaults to "./data/"
 * @returns 
 */
export function createDefaultChaintracksOptions(chain: Chain, rootFolder?: string, knexConfig?: Knex.Config) : ChaintracksOptions {
    if (!rootFolder) rootFolder = "./data/"

    const options = Chaintracks.createOptions(chain)

    const fs = ChaintracksFs
    const fetch = new ChaintracksFetch()

    const bulkStorageOptions = BulkStorageFile.createBulkStorageFileOptions(chain, fs, rootFolder)
    options.bulkStorage = new BulkStorageFile(bulkStorageOptions)

    const bulkIndexOptions = BulkIndexFile.createBulkIndexFileOptions(chain, fs, rootFolder)
    options.bulkIndex = new BulkIndexFile(bulkIndexOptions)

    const localSqlite: Knex.Config = {
        client: 'sqlite3',
        connection: { filename: `${rootFolder}${chain}Net_chaintracks.sqlite` },
        useNullAsDefault: true
    }

    const knexInstance = makeKnex(knexConfig || localSqlite)

    const knexOptions = StorageEngineKnex.createStorageEngineKnexOptions(chain)
    knexOptions.knex = knexInstance
    options.storageEngine = new StorageEngineKnex(knexOptions)

    const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(chain, fs, fetch, `${rootFolder}/bulk_cdn/`)
    options.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCDNOptions))

    const bulkWhatsOnChainOptions = BulkIngestorWhatsOnChain.createBulkIngestorWhatsOnChainOptions(chain, `${rootFolder}/ingest_woc/`)
    options.bulkIngestors.push(new BulkIngestorWhatsOnChain(bulkWhatsOnChainOptions))

    const liveWhatsOnChainOptions = LiveIngestorWhatsOnChain.createLiveIngestorWhatsOnChainOptions(chain)
    options.liveIngestors.push(new LiveIngestorWhatsOnChain(liveWhatsOnChainOptions))

    return options
}

