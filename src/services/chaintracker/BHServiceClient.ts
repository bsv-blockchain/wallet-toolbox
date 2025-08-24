import { BlockHeadersService, Utils } from '@bsv/sdk'
import { ChaintracksServiceClient, ChaintracksServiceClientOptions } from './chaintracks/ChaintracksServiceClient'
import { serializeBaseBlockHeader } from './chaintracks/util/blockHeaderUtilities'
import { HeaderListener, ReorgListener, ChaintracksInfoApi } from './chaintracks/Api/ChaintracksClientApi'
import { Chain } from '../../sdk/types'
import { BaseBlockHeader, BlockHeader } from '../../sdk/WalletServices.interfaces'

interface BHSHeader {
  hash: string
  version: number
  prevBlockHash: string
  merkleRoot: string
  creationTimestamp: number
  difficultyTarget: number
  nonce: number
  work: string
}

interface BHSHeaderState {
  header: BHSHeader
  state: string
  chainWork: string
  height: number
}

export class BHServiceClient implements ChaintracksServiceClient {
  bhs: BlockHeadersService
  cache: Record<number, string>
  chain: Chain
  serviceUrl: string
  options: ChaintracksServiceClientOptions
  apiKey: string

  constructor(chain: Chain, url: string, apiKey: string) {
    this.bhs = new BlockHeadersService(url, { apiKey })
    this.cache = {}
    this.chain = chain
    this.serviceUrl = url
    this.options = ChaintracksServiceClient.createChaintracksServiceClientOptions()
    this.apiKey = apiKey
  }

  async currentHeight(): Promise<number> {
    return await this.bhs.currentHeight()
  }

  async isValidRootForHeight(root: string, height: number): Promise<boolean> {
    const cachedRoot = this.cache[height]
    if (cachedRoot) {
      return cachedRoot === root
    }
    const isValid = await this.bhs.isValidRootForHeight(root, height)
    this.cache[height] = root
    return isValid
  }

  async getPresentHeight(): Promise<number> {
    return await this.bhs.currentHeight()
  }

  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    const response = await this.getJsonOrUndefined<BHSHeader[]>(`/api/v1/chain/header/byHeight?height=${height}`)
    const header = response?.[0]
    if (!header) return undefined
    const formatted: BlockHeader = {
      version: header.version,
      previousHash: header.prevBlockHash,
      merkleRoot: header.merkleRoot,
      time: header.creationTimestamp,
      bits: header.difficultyTarget,
      nonce: header.nonce,
      height,
      hash: header.hash
    }
    return formatted
  }

  async findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined> {
    const response = await this.getJsonOrUndefined<BHSHeaderState>(`/api/v1/chain/header/state/${hash}`)
    if (!response?.header) return undefined
    const formatted: BlockHeader = {
      version: response.header.version,
      previousHash: response.header.prevBlockHash,
      merkleRoot: response.header.merkleRoot,
      time: response.header.creationTimestamp,
      bits: response.header.difficultyTarget,
      nonce: response.header.nonce,
      height: response.height,
      hash: response.header.hash
    }
    return formatted
  }

  async getHeaders(height: number, count: number): Promise<string> {
    const response = await this.getJsonOrUndefined<BHSHeader[]>(
      `/api/v1/chain/header/byHeight?height=${height}&count=${count}`
    )
    if (!response) return ''
    if (response.length < count) throw new Error('Cannot retrieve enough headers')
    const headers = response.map(response => {
      const header: BaseBlockHeader = {
        version: response.version,
        previousHash: response.prevBlockHash,
        merkleRoot: response.merkleRoot,
        time: response.creationTimestamp,
        bits: response.difficultyTarget,
        nonce: response.nonce
      }
      return serializeBaseBlockHeader(header)
    })
    return headers.reduce((str: string, arr: number[]) => str + Utils.toHex(arr), '')
  }

  async findChainWorkForBlockHash(hash: string): Promise<string | undefined> {
    throw new Error('Not implemented')
  }

  async findChainTipHeader(): Promise<BlockHeader> {
    const response = await this.getJson<BHSHeaderState>('/api/v1/chain/tip/longest')
    const formatted: BlockHeader = {
      version: response.header.version,
      previousHash: response.header.prevBlockHash,
      merkleRoot: response.header.merkleRoot,
      time: response.header.creationTimestamp,
      bits: response.header.difficultyTarget,
      nonce: response.header.nonce,
      height: response.height,
      hash: response.header.hash
    }
    return formatted
  }

  async getJsonOrUndefined<T>(path: string): Promise<T | undefined> {
    let e: Error | undefined = undefined
    for (let retry = 0; retry < 3; retry++) {
      try {
        const r = await fetch(`${this.serviceUrl}${path}`, { headers: { Authorization: `Bearer ${this.apiKey}` } })
        if (r.status !== 200) throw new Error(JSON.stringify(r))
        const v = <T>await r.json()
        if (!v) return undefined
        return v
      } catch (eu: unknown) {
        e = eu as Error
      }
      if (e && e.name !== 'ECONNRESET') break
    }
    if (e) throw e
  }

  async getJson<T>(path: string): Promise<T> {
    const r = await this.getJsonOrUndefined<T>(path)
    if (r === undefined) throw new Error('Value was undefined. Requested object may not exist.')
    return r
  }

  /*
    Please note that all methods hereafter are included only to match the interface of ChaintracksServiceClient.
  */

  async postJsonVoid<T>(path: string, params: T): Promise<void> {
    throw new Error('Not implemented')
  }

  async addHeader(header: any): Promise<void> {
    throw new Error('Not implemented')
  }

  async findHeaderForMerkleRoot(merkleRoot: string, height?: number): Promise<undefined> {
    throw new Error('Not implemented')
  }

  async startListening(): Promise<void> {
    throw new Error('Not implemented')
  }

  async listening(): Promise<void> {
    throw new Error('Not implemented')
  }

  async isSynchronized(): Promise<boolean> {
    throw new Error('Not implemented')
  }

  async getChain(): Promise<Chain> {
    return this.chain
  }

  async isListening(): Promise<boolean> {
    throw new Error('Not implemented')
  }

  async getChainTipHeader(): Promise<BlockHeader> {
    throw new Error('Not implemented')
  }

  async findChainTipHash(): Promise<string> {
    throw new Error('Not implemented')
  }

  async subscribeHeaders(listener: HeaderListener): Promise<string> {
    throw new Error('Method not implemented.')
  }
  async subscribeReorgs(listener: ReorgListener): Promise<string> {
    throw new Error('Method not implemented.')
  }
  async unsubscribe(subscriptionId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async getInfo(): Promise<ChaintracksInfoApi> {
    throw new Error('Method not implemented.')
  }
}
