import { defaultHttpClient, HttpClient, Utils } from '@bsv/sdk'
import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from './Api/BulkIngestorApi'

import { BulkIngestorBase } from './Base/BulkIngestorBase'

import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from './util/BulkFilesReader'
import { HeightRange } from './util/HeightRange'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'

const enableConsoleLog = true

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
      jsonResource: `${chain}Net.json`,
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

    const requestJsonOptions = {
      method: 'GET',
      headers: this.getJsonHttpHeaders()
    }

    const response = await this.fetch.httpClient.request<BulkHeaderFilesInfo>(toUrl(this.jsonResource), requestJsonOptions)
    const bulkFiles = response.data

    let filesUpdated = false
    for (let i = 0; i < bulkFiles.files.length; i++) {
      const file = bulkFiles.files[i]
      const path = filePath(file.fileName)
      if (enableConsoleLog) console.log(JSON.stringify(file))
      if (i < reader.files.length) {
        if (enableConsoleLog) console.log('exists')
        const lf = reader.files[i]
        if (
          lf.fileName === file.fileName &&
          lf.count === file.count &&
          lf.fileHash === file.fileHash &&
          lf.lastHash === file.lastHash
        ) {
          if (enableConsoleLog) console.log('unchanged')
          continue
        }
        if (enableConsoleLog) console.log('updated')
        await this.fs.delete(filePath(lf.fileName))
      } else {
        if (enableConsoleLog) console.log('new')
      }

      try {
        filesUpdated = true
        const url = toUrl(file.fileName)

        console.log(`${new Date().toISOString()} downloading ${url} expected size ${file.count * 80}`)

        const data = await this.fetch.download(url)
        await this.fs.writeFile(path, data)

        console.log(`${new Date().toISOString()} downloaded ${url} actual size    ${data.length}`)
      } catch (err) {
        console.log(JSON.stringify(err))
        throw err
      }

      bulkFiles.files[i] = await BulkFilesReader.validateHeaderFile(this.fs, reader.rootFolder, file)
    }

    bulkFiles.rootFolder = this.localCachePath
    bulkFiles.jsonFilename = this.jsonFilename

    if (filesUpdated) {
      const bytes = Utils.toArray(JSON.stringify(bulkFiles), 'utf8')
      await this.fs.writeFile(this.localCachePath + this.jsonFilename, bytes)
    }

    return {
      reader: await BulkFilesReader.fromJsonFile(this.fs, this.localCachePath, this.jsonFilename, neededRange),
      liveHeaders: undefined
    }
  }
}
