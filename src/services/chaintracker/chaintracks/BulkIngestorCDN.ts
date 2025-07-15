import { Chain } from '../../../sdk/types'
import { BlockHeader } from './Api/BlockHeaderApi'
import { BulkIngestorBaseOptions } from './Api/BulkIngestorApi'

import { BulkIngestorBase } from './Base/BulkIngestorBase'

import { BulkFilesReader, BulkFilesReaderFetchBackedStorage, BulkHeaderFileInfo, BulkHeaderFilesInfo } from './util/BulkFilesReader'
import { HeightRange } from './util/HeightRange'
import { ChaintracksFetchApi } from './Api/ChaintracksFetchApi'
import { asArray, asString, asUint8Array } from '../../../utility/utilityHelpers.noBuffer'
import { logger } from '../../../../test/utils/TestUtilsWalletStorage'
import { WalletError, WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../sdk'
import { deserializeBlockHeader, genesisBuffer, genesisHeader, validateBufferOfHeaders, validateBulkFileData } from './util/blockHeaderUtilities'
import { Hash } from '@bsv/sdk'
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
  ): Promise<{ reader: BulkFilesReaderFetchBackedStorage; liveHeaders?: BlockHeader[] }> {
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

    return {
      reader: await BulkFilesReaderFetchBackedStorage.fromStorage(storage, this.fetch, neededRange),
      // This ingestor never returns live headers.
      liveHeaders: undefined
    }
  }
}
