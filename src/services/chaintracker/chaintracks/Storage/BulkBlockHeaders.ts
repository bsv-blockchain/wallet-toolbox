import { Hash } from '@bsv/sdk'
import { Chain, WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { ReaderUint8Array } from '../../../../utility/ReaderUint8Array'
import { asArray, asString } from '../../../../utility/utilityHelpers.noBuffer'
import { BlockHeader } from '../Api/BlockHeaderApi'
import {
  addWork,
  convertBitsToWork,
} from '../util/blockHeaderUtilities'
import { BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkFilesReader'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { doubleSha256BE } from '../../../../utility/utilityHelpers'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'

export interface BulkBlockHeadersOptions {
  chain: Chain
  verifyChainWork: boolean
  verifyBlockHash: boolean
  fetch: ChaintracksFetchApi
  cdnUrl: string
  preLoadFromHeight?: number
  fs?: ChaintracksFsApi
  cacheFolder?: string
}

/**
 * BulkBlockHeaders class manages retrieval, storage / caching, and access to bulk block headers.
 *
 * Bulk block headers have aged such that the probability of a reorg can be treated as being zero.
 *
 * Data is downloaded on demand from a suitable CDN source.
 *
 * Downloaded data can be cached or stored locally.
 *
 * As new headers are found, new chunks of bulk headers can be transferred from live header storage to bulk header storage.
 */
export class BulkBlockHeaders {
  static createDefaultOptions(
    chain: Chain,
    fetch?: ChaintracksFetchApi,
    fs?: ChaintracksFsApi
  ): BulkBlockHeadersOptions {
    const options: BulkBlockHeadersOptions = {
      chain,
      verifyChainWork: false,
      verifyBlockHash: false,
      fetch: fetch || new ChaintracksFetch(),
      cdnUrl: 'https://cdn.projectbabbage.com/blockheaders/',
      preLoadFromHeight: undefined,
      fs,
      cacheFolder: './data/cdn_cache/'
    }
    return options
  }

  chain: Chain = 'main'
  verifyChainwork: boolean
  verifyBlockHash: boolean
  fetch: ChaintracksFetchApi
  cdnUrl: string
  preLoadFromHeight?: number
  fs?: ChaintracksFsApi
  cacheFolder?: string

  info: BulkHeaderFilesInfo | undefined

  headersPerFile: number = 0
  madeAvailable: boolean = false
  files: Record<number, BulkHeaderFile> = {}

  constructor(options: BulkBlockHeadersOptions) {
    this.chain = options.chain
    this.verifyBlockHash = options.verifyBlockHash
    this.verifyChainwork = options.verifyChainWork
    this.fetch = options.fetch
    this.cdnUrl = options.cdnUrl
    this.preLoadFromHeight = options.preLoadFromHeight
    this.fs = options.fs
    this.cacheFolder = options.cacheFolder
  }

  async makeAvailable(): Promise<void> {
    if (this.madeAvailable) return
    const jsonResource = `${this.cdnUrl}/${this.chain}BlockHeadersNet.json`
    let info: BulkHeaderFilesInfo = await this.fetch.fetchJson(jsonResource)
    if (info.files[0].prevChainWork !== '00'.repeat(32)) {
      info = JSON.parse(this.chain === 'main' ? mainNetHeadersJson : testNetHeadersJson) as BulkHeaderFilesInfo
    }
    if (!info || !info.files || info.files.length === 0) {
      throw new WERR_INTERNAL('No bulk header files found in CDN JSON resource.')
    }
    this.info = info
    this.headersPerFile = info.headersPerFile
    for (const fileInfo of info.files) {
      const file = new BulkHeaderFile({ info: fileInfo })
      const fileIndex = Math.floor(file.firstHeight / this.headersPerFile)
      this.files[fileIndex] = file
      if (this.preLoadFromHeight !== undefined && fileInfo.firstHeight <= this.preLoadFromHeight) {
        this.downloadFile(file)
      }
    }
    this.madeAvailable = true
  }

  async downloadFile(file: BulkHeaderFile): Promise<void> {
    let downloaded = false
    if (!file.data) {
      // Load data from CDN
      const url = `${this.cdnUrl}/${file.fileName}`
      file.data = await this.fetch.download(url)
      downloaded = true
    }
    await file.validate({
      verifyChainWork: this.verifyChainwork,
      verifyBlockHash: this.verifyBlockHash
    })
    if (downloaded && this.cacheFolder && this.fs && file.data) {
      // Save to cache folder
      const filePath = `${this.cacheFolder}/${file.fileName}`
      await this.fs.writeFile(filePath, file.data)
    }
  }

  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    await this.makeAvailable()
    if (height < 0 || !Number.isInteger(height))
      throw new WERR_INVALID_PARAMETER('height', `a non-negative integer expected. ${height} is invalid.`)
    const fileIndex = Math.floor(height / this.headersPerFile)
    const headerIndex = height % this.headersPerFile
    const file = this.files[fileIndex]
    if (!file) throw new WERR_INVALID_OPERATION(`no bulk header file found for index ${fileIndex}`)
    if (!file.data) {
      await this.downloadFile(file)
    }
    return await file.findHeaderForHeight(height)
  }

  async exportHeadersToFs(toFs: ChaintracksFsApi, toHeadersPerFile: number, toFolder: string): Promise<void> {
    if (!this.fs || !this.cacheFolder) {
      throw new WERR_INVALID_OPERATION('No fs or cacheFolder defined for exporting headers to file system.')
    }
  }
}

export class BulkHeaderFile {
  /**
   * Source of this data.
   */
  fileName: string
  /**
   * chain height of first header in file
   */
  firstHeight: number
  /**
   * count of how many headers the file contains. File data size is 80 * count.
   */
  count: number
  /**
   * previousHash is hash of last header before the first in this file. In standard hex string block hash encoding
   */
  prevHash: string
  /**
   * block hash of last header in this file's data. In standard hex string block hash encoding
   */
  lastHash: string
  /**
   * prevChainWork is the cummulative chain work up to the first header in this file's data, as a hex string.
   */
  prevChainWork: string
  /**
   * lastChainWork is the cummulative chain work including the last header in this file's data, as a hex string.
   */
  lastChainWork: string
  /**
   * single sha256 hash, as base64 string, of this file's data.
   */
  fileHash: string

  data?: Uint8Array

  validated: boolean = false

  constructor(params: { info: BulkHeaderFileInfo; data?: Uint8Array }) {
    const { info } = params
    this.fileName = info.fileName
    this.firstHeight = info.firstHeight
    this.count = info.count
    this.prevHash = info.prevHash
    this.lastHash = info.lastHash!
    this.prevChainWork = info.prevChainWork
    this.lastChainWork = info.lastChainWork
    this.fileHash = info.fileHash!
    this.data = params.data
  }

  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    if (height < this.firstHeight || height >= this.firstHeight + this.count || !Number.isInteger(height))
      throw new WERR_INVALID_PARAMETER(
        'height',
        `a non-negative integer range [${this.firstHeight}, ${this.firstHeight + this.count}). ${height} is invalid.`
      )
    const headerIndex = height - this.firstHeight
    const header = deserializeAsBlockHeader(this.data!, headerIndex * 80, height)
    return header
  }

  async validate(options: { verifyChainWork: boolean; verifyBlockHash: boolean }): Promise<void> {
    const fileHash = asString(Hash.sha256(asArray(this.data!)), 'base64')
    if (fileHash !== this.fileHash) {
      throw new WERR_INTERNAL(`BulkHeaderFile: invalid fileHash. Expected ${this.fileHash} vs ${fileHash}.`)
    }
    if (options.verifyBlockHash || options.verifyChainWork) {
      let chainWork = this.prevChainWork
      let prevHash = this.prevHash
      for (let height = this.firstHeight; height < this.firstHeight + this.count; height++) {
        const h = await this.findHeaderForHeight(height)
        if (!h) throw new WERR_INTERNAL(`Bulk headers are invalid. No header found for height ${height}.`)
        if (h.height !== height) throw new WERR_INTERNAL(`Bulk storage validation failure: header height`)
        if (h.previousHash !== prevHash) throw new Error('Bulk storage validation failure: previous hash')
        prevHash = h.hash
        if (options.verifyChainWork) chainWork = addWork(chainWork, convertBitsToWork(h.bits))
      }
      if (options.verifyChainWork) {
        if (this.lastChainWork !== chainWork) {
          throw new WERR_INTERNAL(
            `Bulk storage validation failure: last chainwork mismatch. Expected ${this.lastChainWork}, got ${chainWork}.`
          )
        }
      }
    }
    this.validated = true
  }
}

export function deserializeAsBlockHeader(buffer: Uint8Array, offset: number, height: number): BlockHeader {
  const reader = new ReaderUint8Array(buffer, offset)
  const hashedData = asArray(buffer.slice(offset, offset + 80))
  const hash = asString(doubleSha256BE(hashedData), 'hex')
  const header: BlockHeader = {
    version: reader.readUInt32LE(),
    previousHash: asString(reader.read(32).reverse()),
    merkleRoot: asString(reader.read(32).reverse()),
    time: reader.readUInt32LE(),
    bits: reader.readUInt32LE(),
    nonce: reader.readUInt32LE(),
    height,
    hash
  }
  return header
}

const mainNetHeadersJson = `
{
  "rootFolder": "https://cdn.projectbabbage.com/blockheaders/",
  "jsonFilename": "mainNetBlockHeaders.json",
  "headersPerFile": 400000,
  "files": [
    {
      "fileName": "mainNet_0.headers",
      "firstHeight": 0,
      "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "count": 400000,
      "prevChainWork": "0000000000000000000000000000000000000000000000000000000000000000",
      "lastChainWork": "0000000000000000000000000000000000000000001229fea679a4cdc26e7460",
      "lastHash": "0000000000000000030034b661aed920a9bdf6bbfa6d2e7a021f78481882fa39",
      "fileHash": "fEIn/c5df66x6y7RiTUfxSagVeRNahx+znwghIwRkCM="
    },
    {
      "fileName": "mainNet_1.headers",
      "firstHeight": 400000,
      "prevHash": "0000000000000000030034b661aed920a9bdf6bbfa6d2e7a021f78481882fa39",
      "count": 400000,
      "prevChainWork": "0000000000000000000000000000000000000000001229fea679a4cdc26e7460",
      "lastChainWork": "000000000000000000000000000000000000000001483b2995af390c20b58320",
      "lastHash": "00000000000000000b6ae23bbe9f549844c20943d8c20b8ceedbae8aa1dde8e0",
      "fileHash": "BTKQ54IMLeQhGxxiPXu/A58VrudxKlO0Zhh+xmUV02M="
    },
    {
      "fileName": "mainNet_2.headers",
      "firstHeight": 800000,
      "prevHash": "00000000000000000b6ae23bbe9f549844c20943d8c20b8ceedbae8aa1dde8e0",
      "count": 99705,
      "prevChainWork": "000000000000000000000000000000000000000001483b2995af390c20b58320",
      "lastChainWork": "000000000000000000000000000000000000000001663e6351740f954973bc7e",
      "lastHash": "00000000000000000452f47e1c9203092a05d381643a5b08595a1b8494aaf5d9",
      "fileHash": "ebnNDDlfPU2zpwhhcnx5gs5p7fBbmrGqfjreRxcmmAU="
    }
  ]
}
`

const testNetHeadersJson = `
{
  "rootFolder": "https://cdn.projectbabbage.com/blockheaders/",
  "jsonFilename": "testNetBlockHeaders.json",
  "headersPerFile": 400000,
  "files": [
    {
      "fileName": "testNet_0.headers",
      "firstHeight": 0,
      "prevHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "count": 400000,
      "prevChainWork": "0000000000000000000000000000000000000000000000000000000000000000",
      "lastChainWork": "0000000000000000000000000000000000000000000000040da9d61d8e129a53",
      "lastHash": "0000000001127c76ac45f605f9300dfa96a8054533b96413883fdc4378aeb42d",
      "fileHash": "s22w9l/Mv4cUSu8LpHbiCfgpJmde72O/WVjia2fK1jI="
    },
    {
      "fileName": "testNet_1.headers",
      "firstHeight": 400000,
      "prevHash": "0000000001127c76ac45f605f9300dfa96a8054533b96413883fdc4378aeb42d",
      "count": 400000,
      "prevChainWork": "0000000000000000000000000000000000000000000000040da9d61d8e129a53",
      "lastChainWork": "00000000000000000000000000000000000000000000000a551ea869597d2a74",
      "lastHash": "0000000000068f8658ff71cbf8f5b31c837cc6df5bf53e40f05459d4267b53e6",
      "fileHash": "dK0Yz58kLxc18i0z6j8d0atIYadtj28SVFfwvRa292s="
    },
    {
      "fileName": "testNet_2.headers",
      "firstHeight": 800000,
      "prevHash": "0000000000068f8658ff71cbf8f5b31c837cc6df5bf53e40f05459d4267b53e6",
      "count": 400000,
      "prevChainWork": "00000000000000000000000000000000000000000000000a551ea869597d2a74",
      "lastChainWork": "0000000000000000000000000000000000000000000000288b285ca9b1bb8065",
      "lastHash": "00000000f8bf61018ddd77d23c112e874682704a290252f635e7df06c8a317b8",
      "fileHash": "arh1I91dFbPT9dWvhk9Yp5CmdaP5fXG18x/kZJ3mz7E="
    },
    {
      "fileName": "testNet_3.headers",
      "firstHeight": 1200000,
      "prevHash": "00000000f8bf61018ddd77d23c112e874682704a290252f635e7df06c8a317b8",
      "count": 400000,
      "prevChainWork": "0000000000000000000000000000000000000000000000288b285ca9b1bb8065",
      "lastChainWork": "000000000000000000000000000000000000000000000156c3b84396da4e60b9",
      "lastHash": "00000000000005504bfd1a3ce4688c30c86740390102b6cd464a2fb5e0e3fed1",
      "fileHash": "13fn+YSGcGtDpLIT+dvvmflBb9UwE339dmCxuZ87XL4="
    },
    {
      "fileName": "testNet_4.headers",
      "firstHeight": 1600000,
      "prevHash": "00000000000005504bfd1a3ce4688c30c86740390102b6cd464a2fb5e0e3fed1",
      "count": 77821,
      "prevChainWork": "000000000000000000000000000000000000000000000156c3b84396da4e60b9",
      "lastChainWork": "00000000000000000000000000000000000000000000015814b641eb5d72e2ef",
      "lastHash": "0000000065ef364929e71688b29320c5835fabd8a1c0b6d42b6726cb4afcc798",
      "fileHash": "AK1FlgOaPVFOeG2x+Tp7htOt15UaSpHXZjgx3F263x8="
    }
  ]
}
`
