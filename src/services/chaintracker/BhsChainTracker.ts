import { BlockHeadersService } from '@bsv/sdk'
import { ChaintracksServiceClient, ChaintracksServiceClientOptions } from './chaintracks/ChaintracksServiceClient'
import { sdk } from '../../index.client'
import { BlockHeader } from './chaintracks'

export class BHServiceClient implements ChaintracksServiceClient {
  bhs: BlockHeadersService
  cache: Record<number, string>
  chain: sdk.Chain
  serviceUrl: string
  options: ChaintracksServiceClientOptions

  constructor(chain: sdk.Chain, url: string, apiKey: string) {
    this.bhs = new BlockHeadersService(url, { apiKey })
    this.cache = {}
    this.chain = chain
    this.serviceUrl = url
    this.options = ChaintracksServiceClient.createChaintracksServiceClientOptions()
    this.options.useAuthrite = true
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

  /*
    Please note that all methods hereafter are included only to match the interface of ChaintracksServiceClient.
    You can implement them if you need them by fetching api endpoints described in the BlockHeadersService documentation.
  */

  async getPresentHeight(): Promise<number> {
    return await this.bhs.currentHeight()
  }

  async findHeaderForHeight(height: number): Promise<undefined> {
    return undefined
  }

  async findHeaderForBlockHash(hash: string): Promise<undefined> {
    return undefined
  }

  async findHeaderForMerkleRoot(merkleRoot: string, height?: number): Promise<undefined> {
    return undefined
  }

  async getHeaders(height: number, count: number): Promise<string> {
    return ''
  }

  async startListening(): Promise<void> {
    return
  }

  async listening(): Promise<void> {
    return
  }

  async isSynchronized(): Promise<boolean> {
    return true
  }

  async getChain(): Promise<sdk.Chain> {
    return this.chain
  }

  async isListening(): Promise<boolean> {
    return true
  }

  async getChainTipHeader(): Promise<BlockHeader> {
    return undefined as unknown as BlockHeader
  }

  async findChainTipHashHex(): Promise<string> {
    return ''
  }

  async findChainWorkForBlockHash(hash: string): Promise<string | undefined> {
    return undefined
  }

  async findChainTipHeader(): Promise<BlockHeader> {
    return undefined as unknown as BlockHeader
  }

  async getJsonOrUndefined<T>(path: string): Promise<T | undefined> {
    return undefined
  }

  async getJson<T>(path: string): Promise<T> {
    return {} as T
  }

  async postJsonVoid<T>(path: string, params: T): Promise<void> {
    return
  }

  async addHeader(header: any): Promise<void> {
    return
  }
}
