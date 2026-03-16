import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { BulkIngestorCDNBabbage } from './Ingest/BulkIngestorCDNBabbage'
import { LiveIngestorWhatsOnChainOptions, LiveIngestorWhatsOnChainPoll } from './Ingest/LiveIngestorWhatsOnChainPoll'
import { BulkIngestorWhatsOnChainCdn, BulkIngestorWhatsOnChainOptions } from './Ingest/BulkIngestorWhatsOnChainCdn'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { BulkIngestorCDNOptions } from './Ingest/BulkIngestorCDN'
import { WhatsOnChainServicesOptions } from './Ingest/WhatsOnChainServices'
import { ChaintracksStorageApi } from './Api/ChaintracksStorageApi'

/**
 * Populates a ChaintracksOptions object with the standard set of bulk and live ingestors.
 * Shared by all createDefault*ChaintracksOptions factory functions.
 */
export function configureDefaultIngestors(
  co: ChaintracksOptions,
  chain: Chain,
  fetch: ChaintracksFetchApi,
  whatsonchainApiKey: string,
  cdnUrl: string,
  maxPerFile: number
): void {
  const jsonResource = `${chain}NetBlockHeaders.json`

  const bulkCdnOptions: BulkIngestorCDNOptions = {
    chain,
    jsonResource,
    fetch,
    cdnUrl,
    maxPerFile
  }
  co.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCdnOptions))

  const wocOptions: WhatsOnChainServicesOptions = {
    chain,
    apiKey: whatsonchainApiKey,
    timeout: 30000,
    userAgent: 'BabbageWhatsOnChainServices',
    enableCache: true,
    chainInfoMsecs: 5000
  }

  const bulkOptions: BulkIngestorWhatsOnChainOptions = {
    ...wocOptions,
    jsonResource,
    idleWait: 5000
  }
  co.bulkIngestors.push(new BulkIngestorWhatsOnChainCdn(bulkOptions))

  const liveOptions: LiveIngestorWhatsOnChainOptions = {
    ...wocOptions,
    idleWait: 100000
  }
  co.liveIngestors.push(new LiveIngestorWhatsOnChainPoll(liveOptions))
}
