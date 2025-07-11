import { Chain } from '../../../../sdk/types'
import { BulkIngestorApi } from './BulkIngestorApi'
import { BulkStorageApi } from './BulkStorageApi'
import { ChaintracksApi } from './ChaintracksClientApi'
import { LiveIngestorApi } from './LiveIngestorApi'
import { ChaintracksStorageApi } from './ChaintracksStorageApi'

export interface ChaintracksOptions {
  chain: Chain
  storageEngine: ChaintracksStorageApi | undefined
  bulkStorage: BulkStorageApi | undefined
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
   * `synchronize` is always called automatically at the start of `startListening`
   *
   * It may be called directly to control when bulk synchronization happens in
   * situations where a significant number of headers need to be ingested before
   * new headers can be processed.
   *
   * Call this when you've been offline for a while, otherwise just call `startListening`.
   *
   * Returns when all bulk headers available at the time of the call have been integrated
   * with the local storage engine and any recent live headers are made available to
   * `startListening`.
   *
   * May be called if already synchronized or synchronizing in which case the request is ignored.
   */
  synchronize(): Promise<void>

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
