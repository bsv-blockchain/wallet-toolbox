import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from './Api/BulkIngestorApi'

import { BulkIngestorBase } from './Base/BulkIngestorBase'

import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from './util/BulkFilesReader'
import { HeightRange } from './util/HeightRange'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { asArray, asString, asUint8Array } from '../../../utility/utilityHelpers.noBuffer'
import { logger } from '../../../../test/utils/TestUtilsWalletStorage'
import { WalletError, WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../sdk'
import { deserializeBlockHeader, genesisBuffer, genesisHeader, validateBufferOfHeaders, validateBulkFileData } from './util/blockHeaderUtilities'
import { Hash } from '@bsv/sdk'
import { BulkFilesManager } from './util/BulkFilesManager'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'

import Path from 'path'

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
    fetch: ChaintracksFetchApi,
    localCachePath?: string
  ): BulkIngestorCDNOptions {
    const options: BulkIngestorCDNOptions = {
      ...BulkIngestorBase.createBulkIngestorBaseOptions(chain),
      fetch,
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
    this.jsonResource = options.jsonResource
    this.cdnUrl = options.cdnUrl
  }

  override async getPresentHeight(): Promise<number | undefined> {
    return undefined
  }

  override async getBulkFilesManager(neededRange?: HeightRange, maxBufferSize?: number): Promise<BulkFilesManager> {
    throw new Error('getBulkFilesManager not implemented for BulkIngestorCDN')
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
    const storage = this.storage()

    const toUrl = (file: string) => Path.join(this.cdnUrl, file)

    const url = toUrl(this.jsonResource)
    this.bulkFiles = await this.fetch.fetchJson(url)
    if (!this.bulkFiles) {
      throw new WERR_INVALID_PARAMETER(`${this.jsonResource}`, `a valid JSON resource available from ${url}`)
    }
    for (const bf of this.bulkFiles.files) {
      if (!bf.chain) bf.chain = this.chain
      if (!bf.sourceUrl) bf.sourceUrl = this.cdnUrl
    }

    let log = 'updateLocalCache log:\n'
    let heightRange = HeightRange.empty
    let localBulkFiles = storage.bulkFiles

    try {
      let filesUpdated = false
      for (let i = 0; i < this.bulkFiles.files.length; i++) {
        const bf = this.bulkFiles.files[i]
        let updateLf = false
        let insertAfterLf = false

        heightRange = heightRange.union(new HeightRange(bf.firstHeight, bf.firstHeight + bf.count - 1))

        // log += JSON.stringify(file) + '\n'

        let lf = localBulkFiles.find(lf => lf.firstHeight === bf.firstHeight)
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
              lf.firstHeight + lf.count !== bf.firstHeight || lf.lastHash !== bf.prevHash || lf.lastChainWork !== bf.prevChainWork
            ) {
              log += `${bf.fileName} adding new file that does not follow local files is NOT SUPPORTED\n`
              break
            }
          } else {
            if (bf.firstHeight !== 0 || bf.prevHash !== '00'.repeat(32) || bf.prevChainWork !== '00'.repeat(32)) {
              log += `${bf.fileName} adding initial file that does not start at height zero is NOT SUPPORTED\n`
              break
            }
            const gh = genesisHeader(this.chain)
            const bgh = deserializeBlockHeader(bf.data!, 0, 0)
            if (gh.hash !== bgh.hash) {
              log += `${bf.fileName} adding initial file with incorrect genesis block hash is INVALID\n`
              break
            }
          }
          insertAfterLf = true
        }

        let vbf
        if (updateLf && lf && lf.fileId) {
          try {
            vbf = await validateBulkFileData(bf, lf.prevHash, lf.prevChainWork, this.fetch)
            vbf.fileId = lf.fileId
          } catch (eu: unknown) {
            const e = WalletError.fromUnknown(eu)
            log += `${bf.fileName} update failed validity check: ${e.message}\n`
            continue
          }
          await storage.updateBulkFile(vbf.fileId!, vbf)
          log += `${lf.fileName} updated. Now with ${vbf.count} (+${vbf.count - lf.count}) headers\n`
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
          vbf.fileId = await storage.insertBulkFile(vbf)
          log += `${bf.fileName} added\n`
        }

        this.bulkFiles.files[i] = await BulkFilesReader.validateHeaderFile(this.fs, reader.rootFolder, bf, data)

      }

      this.bulkFiles.rootFolder = this.localCachePath
      this.bulkFiles.jsonFilename = this.jsonFilename

    } finally {
      logger(log)
    }

    this.currentRange = heightRange

    return {
      reader: await BulkFilesReader.fromJsonFile(this.fs, this.localCachePath, this.jsonFilename, neededRange),
      // This ingestor never returns live headers.
      liveHeaders: undefined
    }
  }
}
