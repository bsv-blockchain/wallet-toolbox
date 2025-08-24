import { Chain } from '../../../sdk'
import { ChaintracksOptions } from './Api/ChaintracksApi'
import { Chaintracks } from './Chaintracks'
import { BulkIngestorCDNBabbage } from './Ingest/BulkIngestorCDNBabbage'
import { ChaintracksFetch } from './util/ChaintracksFetch'
import { LiveIngestorWhatsOnChainPoll } from './Ingest/LiveIngestorWhatsOnChainPoll'
import { BulkIngestorWhatsOnChainCdn } from './Ingest/BulkIngestorWhatsOnChainCdn'
import { ChaintracksStorageNoDb } from './Storage/ChaintracksStorageNoDb'

export function createNoDbChaintracksOptions(chain: Chain): ChaintracksOptions {
  const options = Chaintracks.createOptions(chain)

  const so = ChaintracksStorageNoDb.createStorageBaseOptions(chain)
  const s = new ChaintracksStorageNoDb(so)
  options.storage = s

  const fetch = new ChaintracksFetch()

  const bulkCDNOptions = BulkIngestorCDNBabbage.createBulkIngestorCDNBabbageOptions(chain, fetch)
  options.bulkIngestors.push(new BulkIngestorCDNBabbage(bulkCDNOptions))

  const bulkWhatsOnChainOptions = BulkIngestorWhatsOnChainCdn.createBulkIngestorWhatsOnChainOptions(chain)
  options.bulkIngestors.push(new BulkIngestorWhatsOnChainCdn(bulkWhatsOnChainOptions))

  const liveWhatsOnChainOptions = LiveIngestorWhatsOnChainPoll.createLiveIngestorWhatsOnChainOptions(chain)
  options.liveIngestors.push(new LiveIngestorWhatsOnChainPoll(liveWhatsOnChainOptions))

  return options
}
