import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from './Api/BulkIngestorApi'

import { BulkIngestorBase } from './Base/BulkIngestorBase'

import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from './util/BulkFilesReader'
import { HeightRange } from './util/HeightRange'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { asUint8Array } from '../../../utility/utilityHelpers.noBuffer'
import { logger } from '../../../../test/utils/TestUtilsWalletStorage'

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

  fs: ChaintracksFsApi
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
    fs: ChaintracksFsApi,
    fetch: ChaintracksFetchApi,
    localCachePath?: string
  ): BulkIngestorCDNOptions {
    const options: BulkIngestorCDNOptions = {
      ...BulkIngestorBase.createBulkIngestorBaseOptions(chain, fs),
      fetch,
      localCachePath: localCachePath || './data/bulk_cdn_headers/',
      jsonResource: `${chain}NetBlockHeaders.json`,
      cdnUrl: undefined
    }
    return options
  }

  fetch: ChaintracksFetchApi
  jsonResource: string
  cdnUrl: string

  constructor(options: BulkIngestorCDNOptions) {
    super(options)
    if (!options.jsonResource) throw new Error('The jsonResource options property is required.')
    if (!options.cdnUrl) throw new Error('The cdnUrl options property is required.')

    this.fetch = options.fetch
    this.fs = options.fs
    this.jsonResource = options.jsonResource
    this.cdnUrl = options.cdnUrl
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateLocalCache(
    neededRange: HeightRange,
    presentHeight: number
  ): Promise<{ reader: BulkFilesReader; liveHeaders?: BlockHeader[] }> {
    const reader = await this.getBulkFilesManager(neededRange)

    const toUrl = (file: string) => `${this.cdnUrl}${file}`
    const filePath = (file: string) => this.localCachePath + file

    const url = toUrl(this.jsonResource)
    const bulkFiles: BulkHeaderFilesInfo = await this.fetch.fetchJson(url)

    let log = 'updateLocalCache log:\n'

    try {

      let filesUpdated = false
      for (let i = 0; i < bulkFiles.files.length; i++) {
        const file = bulkFiles.files[i]
        const path = filePath(file.fileName)

        log += JSON.stringify(file) + '\n'

        if (i < reader.files.length) {
          log += `${i} exists\n`
          const lf = reader.files[i]
          if (
            lf.fileHash === file.fileHash &&
            lf.fileName === file.fileName &&
            lf.firstHeight === file.firstHeight &&
            lf.count === file.count &&
            lf.prevHash === file.prevHash &&
            lf.lastHash === file.lastHash &&
            lf.lastChainWork === file.lastChainWork &&
            lf.prevChainWork === file.prevChainWork
          ) {
            log += `${i} unchanged ${bulkFiles.files[i].fileName}\n`
            continue
          }
          log += `${i} updated, deleting cached ${filePath(lf.fileName)}\n`
          await this.fs.delete(filePath(lf.fileName))
        } else {
          log += `${i} new ${bulkFiles.files[i].fileName}\n`
        }

        try {
          filesUpdated = true
          const url = toUrl(file.fileName)

          log += `${new Date().toISOString()} downloading ${url} expected size ${file.count * 80}\n`

          const data = await this.fetch.download(url)
          await this.fs.writeFile(path, data)

          log += `${new Date().toISOString()} downloaded ${url} actual size    ${data.length}\n`
        } catch (err) {
          log += `${new Date().toISOString()} error downloading ${url}: ${JSON.stringify(err)}\n`
          throw err
        }

        bulkFiles.files[i] = await BulkFilesReader.validateHeaderFile(this.fs, reader.rootFolder, file)
      }

      bulkFiles.rootFolder = this.localCachePath
      bulkFiles.jsonFilename = this.jsonFilename

      if (filesUpdated) {
        const bytes = asUint8Array(JSON.stringify(bulkFiles), 'utf8')
        await this.fs.writeFile(this.localCachePath + this.jsonFilename, bytes)
      }
    } finally {
      logger(log)
    }

    return {
      reader: await BulkFilesReader.fromJsonFile(this.fs, this.localCachePath, this.jsonFilename, neededRange),
      liveHeaders: undefined
    }
  }
}
