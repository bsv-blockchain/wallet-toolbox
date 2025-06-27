import { Chain } from '../../../sdk/types'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { BulkIngestorCDN, BulkIngestorCDNOptions } from './BulkIngestorCDN'

export class BulkIngestorCDNBabbage extends BulkIngestorCDN {
  /**
   *
   * @param chain
   * @param rootFolder defaults to './data/bulk_cdn_babbage_headers/'
   * @returns
   */
  static createBulkIngestorCDNBabbageOptions(chain: Chain, fs: ChaintracksFsApi, fetch: ChaintracksFetchApi, localCachePath?: string): BulkIngestorCDNOptions {
    const options: BulkIngestorCDNOptions = {
      ...BulkIngestorCDN.createBulkIngestorCDNOptions(chain, fs, fetch, localCachePath || './data/bulk_cdn_babbage_headers/'),
      cdnUrl: 'https://cdn.projectbabbage.com/blockheaders/'
    }
    return options
  }
}
