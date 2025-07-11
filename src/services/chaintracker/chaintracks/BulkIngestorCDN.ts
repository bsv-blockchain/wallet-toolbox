import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from './Api/BulkIngestorApi'

import { BulkIngestorBase } from './Base/BulkIngestorBase'

import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from './util/BulkFilesReader'
import { HeightRange } from './util/HeightRange'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { asArray, asString, asUint8Array } from '../../../utility/utilityHelpers.noBuffer'
import { logger } from '../../../../test/utils/TestUtilsWalletStorage'
import { WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../sdk'
import { validateBufferOfHeaders } from './util/blockHeaderUtilities'
import { Hash } from '@bsv/sdk'

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

  bulkFiles: BulkHeaderFilesInfo | undefined
  currentRange: HeightRange | undefined

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

  async exportHeadersToFs(toFs: ChaintracksFsApi, toHeadersPerFile: number, toFolder: string): Promise<void> {
    if (!this.bulkFiles || !this.currentRange || this.currentRange.isEmpty) {
      throw new WERR_INVALID_OPERATION('updateLocalCache must be called before exportHeadersToFs')
    }

    const toFileName = (i: number) => `${this.chain}Net_${i}.headers`
    const toPath = (i: number) => toFs.pathJoin(toFolder, toFileName(i))
    const toJsonPath = () => toFs.pathJoin(toFolder, `${this.chain}NetBlockHeaders.json`)

    const toBulkFiles: BulkHeaderFilesInfo = {
      rootFolder: toFolder,
      jsonFilename: `${this.chain}NetBlockHeaders.json`,
      headersPerFile: toHeadersPerFile,
      files: []
    }

    const bf0 = this.bulkFiles.files[0]
    if (!bf0 || bf0.firstHeight !== this.currentRange.minHeight) {
      throw new WERR_INTERNAL(
        `file 0 firstHeight ${bf0.firstHeight} must equal currentRange minHeight ${this.currentRange.minHeight}`
      )
    }

    let firstHeight = this.currentRange.minHeight
    let prevHash = bf0.prevHash
    let prevChainWork = bf0.prevChainWork

    let i = -1
    for (;;) {
      i++
      const neededRange = new HeightRange(firstHeight, firstHeight + toHeadersPerFile - 1)
      const reader = await this.getBulkFilesManager(neededRange, toHeadersPerFile * 80)
      const data = await reader.read()
      if (!data || data.length === 0) {
        break
      }
      const last = validateBufferOfHeaders(data, prevHash, 0, undefined, prevChainWork)

      await toFs.writeFile(toPath(i), data)

      const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
      const file: BulkHeaderFileInfo = {
        fileName: toFileName(i),
        firstHeight,
        prevHash,
        count: data.length / 80,
        lastHash: last.lastHeaderHash,
        fileHash,
        lastChainWork: last.lastChainWork!,
        prevChainWork: prevChainWork,
        chain: this.chain
      }
      toBulkFiles.files.push(file)
      firstHeight += file.count
      prevHash = file.lastHash!
      prevChainWork = file.lastChainWork!
    }

    await toFs.writeFile(toJsonPath(), asUint8Array(JSON.stringify(toBulkFiles), 'utf8'))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateLocalCache(
    neededRange: HeightRange,
    presentHeight: number
  ): Promise<{ reader: BulkFilesReader; liveHeaders?: BlockHeader[] }> {
    const reader = await this.getBulkFilesManager(neededRange)

    const toUrl = (file: string) => this.fs.pathJoin(this.cdnUrl, file)
    const filePath = (file: string) => this.fs.pathJoin(this.localCachePath, file)

    const url = toUrl(this.jsonResource)
    this.bulkFiles = await this.fetch.fetchJson(url)
    if (!this.bulkFiles) {
      throw new WERR_INVALID_PARAMETER(`${this.jsonResource}`, `a valid JSON resource available from ${url}`)
    }

    let log = 'updateLocalCache log:\n'
    let heightRange = HeightRange.empty

    try {
      let filesUpdated = false
      for (let i = 0; i < this.bulkFiles.files.length; i++) {
        const file = this.bulkFiles.files[i]
        const path = filePath(file.fileName)

        heightRange = heightRange.union(new HeightRange(file.firstHeight, file.firstHeight + file.count - 1))

        // log += JSON.stringify(file) + '\n'

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
            log += `${i} unchanged ${this.bulkFiles.files[i].fileName}\n`
            continue
          }
          log += `${i} updated, deleting cached ${filePath(lf.fileName)}\n`
          await this.fs.delete(filePath(lf.fileName))
        } else {
          log += `${i} new ${this.bulkFiles.files[i].fileName}\n`
        }

        let data: Uint8Array | undefined

        try {
          filesUpdated = true
          const url = toUrl(file.fileName)

          log += `${new Date().toISOString()} downloading ${url} expected size ${file.count * 80}\n`

          data = await this.fetch.download(url)
          await this.fs.writeFile(path, data)

          log += `${new Date().toISOString()} downloaded ${url} actual size    ${data.length}\n`
        } catch (err) {
          log += `${new Date().toISOString()} error downloading ${url}: ${JSON.stringify(err)}\n`
          throw err
        }

        file.chain = this.chain
        this.bulkFiles.files[i] = await BulkFilesReader.validateHeaderFile(this.fs, reader.rootFolder, file, data)

        const newFile = { ...this.bulkFiles.files[i] }
        newFile.data = data
        newFile.validated = true

        const fileId = await this.storageOrUndefined()?.insertBulkFile(newFile)
        logger(`insertBulkFile ${fileId}`)
      }

      this.bulkFiles.rootFolder = this.localCachePath
      this.bulkFiles.jsonFilename = this.jsonFilename

      if (filesUpdated) {
        const bytes = asUint8Array(JSON.stringify(this.bulkFiles), 'utf8')
        await this.fs.writeFile(this.fs.pathJoin(this.localCachePath, this.jsonFilename), bytes)
      }
    } finally {
      logger(log)
    }

    this.currentRange = heightRange

    return {
      reader: await BulkFilesReader.fromJsonFile(this.fs, this.localCachePath, this.jsonFilename, neededRange),
      liveHeaders: undefined
    }
  }
}
