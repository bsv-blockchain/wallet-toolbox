import { Chain } from '../../../../sdk/types'
import { BulkIngestorApi } from './BulkIngestorApi'
import { BulkStorageApi } from './BulkStorageApi'
import { ChaintracksApi } from './ChaintracksClientApi'
import { LiveIngestorApi } from './LiveIngestorApi'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'

export interface ChaintracksOptions {
  chain: Chain
  storageEngine: ChaintracksStorageApi | undefined
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
}

export interface ChaintracksManagementApi extends ChaintracksApi {
  /**
   * close and release all resources
   */
  shutdown(): Promise<void>

  /**
   * Stops listening for new headers.
   * Ends notifications to subscribed listeners.
   *
   * May have to `synchronize` before again calling `startListening` if more than
   * `addLiveRecursionLimit` have been found while not listening.
   */
  stopListening(): Promise<void>

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
   * @param rootFolder Where the json and headers files will be written
   * @param jsonFilename The name of the json file. Default is 'mainNet.json' or 'testNet.json'
   * @param maxPerFile The maximum headers per file. Default is 400,000 (32MB)
   */
  exportBulkHeaders(rootFolder: string, jsonFilename?: string, maxPerFile?: number): Promise<void>
}
