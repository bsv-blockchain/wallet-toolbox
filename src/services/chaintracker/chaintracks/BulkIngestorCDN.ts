import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from './Api/BulkIngestorApi'
import { BulkIngestorBase } from './Base/BulkIngestorBase'
import { BulkHeaderFileInfo } from './util/BulkHeaderFile'
import { BulkHeaderFilesInfo } from './util/BulkHeaderFile'
import { HeightRange, HeightRanges } from './util/HeightRange'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { logger } from '../../../../test/utils/TestUtilsWalletStorage'
import { WalletError, WERR_INVALID_PARAMETER } from '../../../sdk'
import { validateBulkFileData } from './util/blockHeaderUtilities'
import { selectBulkHeaderFiles } from './util/BulkFileDataManager'

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
  static createBulkIngestorCDNOptions(chain: Chain, cdnUrl: string, fetch: ChaintracksFetchApi, maxPerFile?: number): BulkIngestorCDNOptions {
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
  async fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]> {
    const storage = this.storage()

    const toUrl = (file: string) => this.fetch.pathJoin(this.cdnUrl, file)

    const url = toUrl(this.jsonResource)
    this.availableBulkFiles = await this.fetch.fetchJson(url)
    if (!this.availableBulkFiles) {
      throw new WERR_INVALID_PARAMETER(`${this.jsonResource}`, `a valid BulkHeaderFilesInfo JSON resource available from ${url}`)
    }
    this.selectedFiles = selectBulkHeaderFiles(this.availableBulkFiles.files, this.chain, this.maxPerFile || this.availableBulkFiles.headersPerFile)
    for (const bf of this.selectedFiles) {
      if (!bf.fileHash) {
        throw new WERR_INVALID_PARAMETER(`fileHash`, `valid for alll files in ${this.jsonResource} from ${url}`)
      }
      if (!bf.chain || bf.chain !== this.chain) {
        throw new WERR_INVALID_PARAMETER(`chain`, `"${this.chain}" for all files in ${this.jsonResource} from ${url}`)
      }
      if (!bf.sourceUrl || bf.sourceUrl !== this.cdnUrl) bf.sourceUrl = this.cdnUrl;
    }
    const lsf = this.selectedFiles.slice(-1)[0]
    this.currentRange = new HeightRange(0, lsf.firstHeight + lsf.count - 1)

    let log = 'updateLocalCache log:\n'
    let heightRange = HeightRange.empty
    let localBulkFiles = storage.bulkFiles

    try {
      let filesUpdated = false
      for (let i = 0; i < this.availableBulkFiles.files.length; i++) {
        const bf = this.availableBulkFiles.files[i]
        let updateLf = false
        let insertAfterLf = false

        heightRange = heightRange.union(new HeightRange(bf.firstHeight, bf.firstHeight + bf.count - 1))

        // log += JSON.stringify(file) + '\n'

        let lfIndex: number | undefined = localBulkFiles.findIndex(lf => lf.firstHeight === bf.firstHeight)
        let lf: BulkHeaderFileInfo | undefined = localBulkFiles[lfIndex]
        if (lf) {
          if (lf.prevChainWork !== bf.prevChainWork || lf.prevHash !== bf.prevHash) {
            log += `${bf.fileName} is not a valid update file\n`
            continue
          }
          // This bulk file matches start of one previously downloaded, but may now have more data either locally or remotely.
          if (lf.count >= bf.count) {
            log += `${lf.fileName} exists, ignoring remote file, local file has at least as many headers\n`
            continue
          }
          // Replace existing local file with updated remote file, but only if it is last file...
          if (i !== localBulkFiles.length - 1) {
            log += `${lf.fileName} exists, mid range remote file with more headers is NOT SUPPORTED\n`
            break
          }
          updateLf = true
        } else {
          lf = localBulkFiles.slice(-1)[0]
          if (lf) {
            if (
              lf.firstHeight + lf.count !== bf.firstHeight ||
              lf.lastHash !== bf.prevHash ||
              lf.lastChainWork !== bf.prevChainWork
            ) {
              log += `${bf.fileName} adding new file that does not follow local files is NOT SUPPORTED\n`
              break
            }
          } else {
            if (bf.firstHeight !== 0 || bf.prevHash !== '00'.repeat(32) || bf.prevChainWork !== '00'.repeat(32)) {
              log += `${bf.fileName} adding initial file that does not start at height zero is NOT SUPPORTED\n`
              break
            }
          }
          insertAfterLf = true
        }

        let vbf: BulkHeaderFileInfo | undefined
        if (updateLf && lf && lf.fileId) {
          try {
            vbf = await validateBulkFileData(bf, lf.prevHash, lf.prevChainWork, this.fetch)
            vbf.fileId = lf.fileId
          } catch (eu: unknown) {
            const e = WalletError.fromUnknown(eu)
            log += `${bf.fileName} update failed validity check: ${e.message}\n`
            continue
          }

          // Update current last bulk file with more headers.
          await storage.updateBulkFile(vbf.fileId!, vbf)

          localBulkFiles[lfIndex!] = vbf
          log += `${lf.fileName} updated. Now with ${vbf.count} (+${vbf.count - lf.count}) headers\n`
          filesUpdated = true
        } else if (insertAfterLf) {
          // lf will be undefined if this is the first file
          try {
            const prevHash = lf && lf.lastHash ? lf.lastHash : '00'.repeat(32)
            const prevChainWork = lf ? lf.lastChainWork : '00'.repeat(32)
            vbf = await validateBulkFileData(bf, prevHash, prevChainWork, this.fetch)
          } catch (eu: unknown) {
            const e = WalletError.fromUnknown(eu)
            log += `${bf.fileName} insert failed validity check: ${e.message}\n`
            continue
          }

          // Append a new bulk file following existing files.
          vbf.fileId = await storage.insertBulkFile(vbf)

          localBulkFiles.push(vbf)
          log += `${bf.fileName} added\n`
          filesUpdated = true
        }

        if (vbf && filesUpdated) {
          heightRange = heightRange.union(new HeightRange(vbf.firstHeight, vbf.firstHeight + vbf.count - 1))
        }
      }
    } finally {
      logger(log)
    }

    this.currentRange = heightRange

    return priorLiveHeaders
  }
}
