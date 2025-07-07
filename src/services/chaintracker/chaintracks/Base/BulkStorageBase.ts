// /* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BulkStorageApi, BulkStorageBaseOptions } from '../Api/BulkStorageApi'

import { StorageEngineBase } from './StorageEngineBase'

import { HeightRange } from '../util/HeightRange'
import { BulkFilesReader, BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkFilesReader'

import { addWork, convertBitsToWork, deserializeBlockHeaders, genesisBuffer } from '../util/blockHeaderUtilities'
import { Chain } from '../../../../sdk/types'
import { BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { Utils } from '@bsv/sdk'
import { asUint8Array } from '../../../../utility/utilityHelpers.noBuffer'

export abstract class BulkStorageBase implements BulkStorageApi {
  static createBulkStorageBaseOptions(chain: Chain, fs: ChaintracksFsApi): BulkStorageBaseOptions {
    const options: BulkStorageBaseOptions = {
      chain,
      fs
    }
    return options
  }

  chain: Chain
  fs: ChaintracksFsApi

  constructor(options: BulkStorageBaseOptions) {
    this.chain = options.chain
    this.fs = options.fs
  }

  async shutdown(): Promise<void> {}

  abstract appendHeaders(minHeight: number, count: number, newBulkHeaders: Uint8Array): Promise<void>
  abstract getMaxHeight(): Promise<number>
  abstract headersToBuffer(height: number, count: number): Promise<Uint8Array>
  abstract findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined>

  async findHeaderForHeight(height: number): Promise<BlockHeader> {
    const header = await this.findHeaderForHeightOrUndefined(height)
    if (!header) throw new Error(`No header found for height ${height}`)
    return header
  }

  async getHeightRange(): Promise<HeightRange> {
    return new HeightRange(0, await this.getMaxHeight())
  }

  async setStorage(storage: StorageEngineBase): Promise<void> {}

  async validateHeaders(): Promise<LiveBlockHeader | undefined> {
    const countPerChunk = 200000
    let height = 0
    let chainWork = '00'.repeat(32)
    let prevHash = '00'.repeat(32)
    let lastHeader: BlockHeader | undefined
    for (;;) {
      const buffer = await this.headersToBuffer(height, countPerChunk)
      if (!buffer) break
      const count = buffer.length / 80
      if (count === 0) break
      if (height === 0) {
        if (!genesisBuffer(this.chain).every((v, i) => v === buffer[i]))
          throw new Error('Bulk storage validation failure: genesis header')
      }
      const headers = deserializeBlockHeaders(height, buffer)
      for (const h of headers) {
        if (h.previousHash !== prevHash) throw new Error('Bulk storage validation failure: previous hash')
        chainWork = addWork(chainWork, convertBitsToWork(h.bits))
        prevHash = h.hash
        lastHeader = h
      }
      height += count
    }
    if (!lastHeader) return undefined
    const liveHeader: LiveBlockHeader = {
      ...lastHeader,
      chainWork,
      isChainTip: true,
      isActive: true,
      headerId: -1,
      previousHeaderId: null
    }
    return liveHeader
  }

  async exportBulkHeaders(rootFolder: string, jsonFilename: string, maxPerFile: number): Promise<void> {
    const info: BulkHeaderFilesInfo = {
      rootFolder: rootFolder,
      jsonFilename: jsonFilename,
      files: [],
      headersPerFile: maxPerFile
    }
    const maxHeight = await this.getMaxHeight()
    const baseFilename = jsonFilename.slice(0, -5) // remove ".json"
    let prevHash = '00'.repeat(32)
    let prevChainWork = '00'.repeat(32)
    for (let height = 0; height <= maxHeight; height += maxPerFile) {
      const count = Math.min(maxPerFile, maxHeight - height + 1)
      let file: BulkHeaderFileInfo = {
        fileName: `${baseFilename}_${info.files.length}.headers`,
        firstHeight: height,
        prevHash: prevHash,
        prevChainWork: prevChainWork,
        count: count,
        lastHash: null,
        fileHash: null,
        lastChainWork: ''
      }
      const buffer = await this.headersToBuffer(height, count)
      await this.fs.writeFile(this.fs.pathJoin(rootFolder, file.fileName), buffer)
      file = await BulkFilesReader.validateHeaderFile(this.fs, rootFolder, file)
      if (!file.lastHash) throw new Error('Unexpected result.');
      prevHash = file.lastHash
      prevChainWork = file.lastChainWork
      info.files.push(file)
    }
    const bytes = asUint8Array(JSON.stringify(info), 'utf8')
    await this.fs.writeFile(this.fs.pathJoin(rootFolder, jsonFilename), bytes)
  }
}