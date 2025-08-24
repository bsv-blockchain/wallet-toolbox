import { Chain } from '../../../../sdk/types'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { BulkIngestorCDN, BulkIngestorCDNOptions } from './BulkIngestorCDN'

export class BulkIngestorCDNBabbage extends BulkIngestorCDN {
  /**
   *
   * @param chain
   * @param rootFolder defaults to './data/bulk_cdn_babbage_headers/'
   * @returns
   */
  static createBulkIngestorCDNBabbageOptions(chain: Chain, fetch: ChaintracksFetchApi): BulkIngestorCDNOptions {
    const options: BulkIngestorCDNOptions = {
      ...BulkIngestorCDN.createBulkIngestorCDNOptions(chain, 'https://cdn.projectbabbage.com/blockheaders/', fetch)
    }
    return options
  }
}
