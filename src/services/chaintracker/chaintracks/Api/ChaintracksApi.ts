import { Chain } from '../../../../sdk/types'
import { BulkIngestorApi } from './BulkIngestorApi'
import { ChaintracksApi } from './ChaintracksClientApi'
import { LiveIngestorApi } from './LiveIngestorApi'
import { ChaintracksFsApi } from './ChaintracksFsApi'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'

export interface ChaintracksOptions {
  chain: Chain
  storage?: ChaintracksStorageApi
  bulkIngestors: BulkIngestorApi[]
  liveIngestors: LiveIngestorApi[]

  /**
   * Maximum number of missing headers to pursue when listening for new headers.
   * Normally, large numbers of missing headers are handled by bulk ingestors.
   */
  addLiveRecursionLimit: number
  /**
   * Event logging level
   */
  logging: undefined | 'all'
  /**
   * If true, this chaintracks instance will only service read requests for existing data.
   * Shared storage only requires one readonly false instance to manage and update storage.
   */
  readonly: boolean
}

export interface ChaintracksManagementApi extends ChaintracksApi {
  /**
   * close and release all resources
   */
  destroy(): Promise<void>

  /**
   * Verifies that all headers from the tip back to genesis can be retrieved, in order,
   * by height, and that they obey previousHash constraint.
   *
   * Additional validations may be addeded.
   *
   * This is a slow operation.
   */
  validate(): Promise<boolean>

  /**
   * Exports current bulk headers, including all ingests, excluding live headers to static header files.
   *
   * Useful for bulk ingestors such as those derived from BulkIngestorCDN.
   *
   * @param toFolder Where the json and headers files will be written
   * @param toFs The ChaintracksFsApi to use for writing files. If not provided, the default file system will be used.
   * @param sourceUrl Optional source URL to include in the exported files. Set if exported files will be transferred to a CDN.
   * @param toHeadersPerFile The maximum headers per file. Default is 100,000 (8MB)
   * @param maxHeight The maximum height to export. Default is the current bulk storage max height.
   */
  exportBulkHeaders(
    toFolder: string,
    toFs: ChaintracksFsApi,
    sourceUrl?: string,
    toHeadersPerFile?: number,
    maxHeight?: number
  ): Promise<void>
}
