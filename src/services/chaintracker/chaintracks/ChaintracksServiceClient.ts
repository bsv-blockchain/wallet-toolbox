/* eslint-disable @typescript-eslint/no-unused-vars */
import { asString, sdk } from '../../../index.client'

import { BaseBlockHeader, BlockHeader, isBaseBlockHeader } from './Api/BlockHeaderApi'

interface FetchStatus<T> {
  status: 'success' | 'error'
  code?: string
  description?: string
  value?: T
}

export interface ChaintracksServiceClientOptions {
  useAuthrite: boolean
}

/**
 * Connects to a ChaintracksService to implement 'ChaintracksClientApi'
 *
 */
export class ChaintracksServiceClient {
  static createChaintracksServiceClientOptions(): ChaintracksServiceClientOptions {
    const options: ChaintracksServiceClientOptions = {
      useAuthrite: false
    }
    return options
  }

  options: ChaintracksServiceClientOptions

  constructor(
    public chain: sdk.Chain,
    public serviceUrl: string,
    options?: ChaintracksServiceClientOptions
  ) {
    this.options = options || ChaintracksServiceClient.createChaintracksServiceClientOptions()
  }

  async currentHeight(): Promise<number> {
    return await this.getPresentHeight()
  }

  async isValidRootForHeight(root: string, height: number): Promise<boolean> {
    const r = await this.findHeaderForHeight(height)
    if (!r) return false
    const isValid = root === asString(r.merkleRoot)
    return isValid
  }

  async getJsonOrUndefined<T>(path: string): Promise<T | undefined> {
    let e: Error | undefined = undefined
    for (let retry = 0; retry < 3; retry++) {
      try {
        const r = await fetch(`${this.serviceUrl}${path}`)
        const v = <FetchStatus<T>>await r.json()
        if (v.status === 'success') return v.value
        else e = new Error(JSON.stringify(v))
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

  async postJsonVoid<T>(path: string, params: T): Promise<void> {
    const headers = {}
    headers['Content-Type'] = 'application/json'
    const r = await fetch(`${this.serviceUrl}${path}`, {
      body: JSON.stringify(params),
      method: 'POST',
      headers
      //cache: 'no-cache',
    })
    try {
      const s = <FetchStatus<void>>await r.json()
      if (s.status === 'success') return
      throw new Error(JSON.stringify(s))
    } catch (e) {
      console.log(`Exception: ${JSON.stringify(e)}`)
      throw new Error(JSON.stringify(e))
    }
  }

  //
  // HTTP API FUNCTIONS
  //

  async addHeader(header: BaseBlockHeader): Promise<void> {
    const r = await this.postJsonVoid('/addHeaderHex', header)
    if (typeof r === 'string') throw new Error(r)
  }

  async startListening(): Promise<void> {
    return await this.getJsonOrUndefined('/startListening')
  }
  async listening(): Promise<void> {
    return await this.getJsonOrUndefined('/listening')
  }
  async getChain(): Promise<sdk.Chain> {
    return this.chain
    //return await this.getJson('/getChain')
  }

  async isListening(): Promise<boolean> {
    return await this.getJson('/isListening')
  }
  async isSynchronized(): Promise<boolean> {
    return await this.getJson('/isSynchronized')
  }
  async getPresentHeight(): Promise<number> {
    return await this.getJson('/getPresentHeight')
  }
  async findChainTipHeader(): Promise<BlockHeader> {
    return await this.getJson('/findChainTipHeaderHex')
  }
  async findChainTipHashHex(): Promise<string> {
    return await this.getJson('/findChainTipHashHex')
  }

  async getHeaders(height: number, count: number): Promise<string> {
    return await this.getJson(`/getHeaders?height=${height}&count=${count}`)
  }
  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    return await this.getJsonOrUndefined(`/findHeaderHexForHeight?height=${height}`)
  }
  async findChainWorkForBlockHash(hash: string): Promise<string | undefined> {
    return await this.getJsonOrUndefined(`/findChainWorkHexForBlockHash?hash=${asString(hash)}`)
  }
  async findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined> {
    return await this.getJsonOrUndefined(`/findHeaderHexForBlockHash?hash=${asString(hash)}`)
  }
  async findHeaderForMerkleRoot(merkleRoot: string, height?: number): Promise<BlockHeader | undefined> {
    return await this.getJsonOrUndefined(`/findHeaderHexForMerkleRoot?root=${asString(merkleRoot)}&height=${height}`)
  }
}
