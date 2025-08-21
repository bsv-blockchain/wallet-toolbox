import { Chain } from '../../../../sdk/types'
import { BlockHeader } from '../Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from '../Api/BulkIngestorApi'
import { BulkIngestorBase } from '../Base/BulkIngestorBase'
import { BulkHeaderFileInfo } from '../util/BulkHeaderFile'
import { BulkHeaderFilesInfo } from '../util/BulkHeaderFile'
import { HeightRange, HeightRanges } from '../util/HeightRange'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { logger } from '../../../../../test/utils/TestUtilsWalletStorage'
import { WalletError, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { validateBulkFileData } from '../util/blockHeaderUtilities'
import { selectBulkHeaderFiles } from '../util/BulkFileDataManager'

export interface BulkIngestorCDNOptions extends BulkIngestorBaseOptions {
  /**
   * Required.
   *
   * The name of the JSON resource to request from CDN which describes currently
   * available bulk block header resources.
   */
  jsonResource: string | undefined

  /**
   * Required.
   *
   * URL to CDN implementing the bulk ingestor CDN service protocol
   */
  cdnUrl: string | undefined

  maxPerFile: number | undefined

  fetch: ChaintracksFetchApi
}

export class BulkIngestorCDN extends BulkIngestorBase {
  /**
   *
   * @param chain
   * @param localCachePath defaults to './data/bulk_cdn_headers/'
   * @returns
   */
  static createBulkIngestorCDNOptions(
    chain: Chain,
    cdnUrl: string,
    fetch: ChaintracksFetchApi,
    maxPerFile?: number
  ): BulkIngestorCDNOptions {
    const options: BulkIngestorCDNOptions = {
      ...BulkIngestorBase.createBulkIngestorBaseOptions(chain),
      fetch,
      jsonResource: `${chain}NetBlockHeaders.json`,
      cdnUrl,
      maxPerFile
    }
    return options
  }

  fetch: ChaintracksFetchApi
  jsonResource: string
  cdnUrl: string
  maxPerFile: number | undefined

  availableBulkFiles: BulkHeaderFilesInfo | undefined
  selectedFiles: BulkHeaderFileInfo[] | undefined
  currentRange: HeightRange | undefined

  constructor(options: BulkIngestorCDNOptions) {
    super(options)
    if (!options.jsonResource) throw new Error('The jsonResource options property is required.')
    if (!options.cdnUrl) throw new Error('The cdnUrl options property is required.')

    this.fetch = options.fetch
    this.jsonResource = options.jsonResource
    this.cdnUrl = options.cdnUrl
    this.maxPerFile = options.maxPerFile
  }

  override async getPresentHeight(): Promise<number | undefined> {
    return undefined
  }

  getJsonHttpHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }
    return headers
  }

  /**
   * A BulkFile CDN serves a JSON BulkHeaderFilesInfo resource which lists all the available binary bulk header files available and associated metadata.
   *
   * The term "CDN file" is used for a local bulk file that has a sourceUrl. (Not undefined)
   * The term "incremental file" is used for the local bulk file that holds all the non-CDN bulk headers and must chain to the live headers if there are any.
   *
   * Bulk ingesting from a CDN happens in one of three contexts:
   *
   * 1. Cold Start: No local bulk or live headers.
   * 2. Incremental: Available CDN files extend into an existing incremental file but not into the live headers.
   * 3. Replace: Available CDN files extend into live headers.
   *
   * Context Cold Start:
   * - The CDN files are selected in height order, starting at zero, always choosing the largest count less than the local maximum (maxPerFile).
   *
   * Context Incremental:
   * - Last existing CDN file is updated if CDN now has a higher count.
   * - Additional CDN files are added as in Cold Start.
   * - The existing incremental file is truncated or deleted.
   *
   * Context Replace:
   * - Existing live headers are truncated or deleted.
   * - Proceed as context Incremental.
   *
   * @param before bulk and live range of headers before ingesting any new headers.
   * @param fetchRange total range of header heights needed including live headers
   * @param bulkRange range of missing bulk header heights required.
   * @param priorLiveHeaders
   * @returns
   */
  async fetchHeaders(
    before: HeightRanges,
    fetchRange: HeightRange,
    bulkRange: HeightRange,
    priorLiveHeaders: BlockHeader[]
  ): Promise<BlockHeader[]> {
    const storage = this.storage()

    const toUrl = (file: string) => this.fetch.pathJoin(this.cdnUrl, file)

    const url = toUrl(this.jsonResource)
    this.availableBulkFiles = await this.fetch.fetchJson(url)
    if (!this.availableBulkFiles) {
      throw new WERR_INVALID_PARAMETER(
        `${this.jsonResource}`,
        `a valid BulkHeaderFilesInfo JSON resource available from ${url}`
      )
    }
    this.selectedFiles = selectBulkHeaderFiles(
      this.availableBulkFiles.files,
      this.chain,
      this.maxPerFile || this.availableBulkFiles.headersPerFile
    )
    for (const bf of this.selectedFiles) {
      if (!bf.fileHash) {
        throw new WERR_INVALID_PARAMETER(`fileHash`, `valid for alll files in ${this.jsonResource} from ${url}`)
      }
      if (!bf.chain || bf.chain !== this.chain) {
        throw new WERR_INVALID_PARAMETER(`chain`, `"${this.chain}" for all files in ${this.jsonResource} from ${url}`)
      }
      if (!bf.sourceUrl || bf.sourceUrl !== this.cdnUrl) bf.sourceUrl = this.cdnUrl
    }

    let log = 'BulkIngestorCDN fetchHeaders log:\n'
    log += `  url: ${url}\n`

    this.currentRange = await storage.bulkManager.getHeightRange()
    log += `  bulk range before: ${this.currentRange}\n`

    const r = await storage.bulkManager.merge(this.selectedFiles)

    this.currentRange = await storage.bulkManager.getHeightRange()
    log += `  bulk range after:  ${this.currentRange}\n`
    for (const u of r.unchanged) {
      log += `  unchanged: ${u.fileName}, fileId=${u.fileId}\n`
    }
    for (const i of r.inserted) {
      log += `  inserted: ${i.fileName}, fileId=${i.fileId}\n`
    }
    for (const u of r.updated) {
      log += `  updated: ${u.fileName}, fileId=${u.fileId}\n`
    }
    logger(log)

    return priorLiveHeaders
  }
}
