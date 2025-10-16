import { Chain } from '../../../sdk/types'
import { asString } from '../../../utility/utilityHelpers.noBuffer'
import { BaseBlockHeader, BlockHeader } from './Api/BlockHeaderApi'
import { ChaintracksClientApi, ChaintracksInfoApi, HeaderListener, ReorgListener } from './Api/ChaintracksClientApi'

interface FetchStatus<T> {
  status: 'success' | 'error'
  code?: string
  description?: string
  value?: T
}

export interface ChaintracksServiceClientOptions {}

/**
 * Connects to a ChaintracksService to implement 'ChaintracksClientApi'
 *
 */
export class ChaintracksServiceClient implements ChaintracksClientApi {
  static createChaintracksServiceClientOptions(): ChaintracksServiceClientOptions {
    const options: ChaintracksServiceClientOptions = {
      // the Authrite support is not provided yet, is it?
      useAuthrite: false
    }
    return options
  }

  options: ChaintracksServiceClientOptions

  constructor(
    public chain: Chain,
    public serviceUrl: string,
    options?: ChaintracksServiceClientOptions
  ) {
    this.options = options || ChaintracksServiceClient.createChaintracksServiceClientOptions()
  }

  subscribeHeaders(listener: HeaderListener): Promise<string> {
    throw new Error('Method not implemented.')
  }
  subscribeReorgs(listener: ReorgListener): Promise<string> {
    throw new Error('Method not implemented.')
  }
  unsubscribe(subscriptionId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
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

  // I tried to request for some unexisting header
  // http://localhost:3011/findHeaderHexForHeight?height=91891000,
  // and the server returned:
  // {"status":"success"}
  // I'm not sure if "success" with no value is the intended behavior for "not found"
  // In standard rest API, "not found" should return 404 status code
  // and the client should handle that case
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
    await this.getPresentHeight()
  }
  async listening(): Promise<void> {
    await this.getPresentHeight()
  }
  async getChain(): Promise<Chain> {
    return this.chain
    //return await this.getJson('/getChain')
  }

  async isListening(): Promise<boolean> {
    try {
      await this.getPresentHeight()
      return true
    } catch {
      return false
    }
  }
  async isSynchronized(): Promise<boolean> {
    return await this.isListening()
  }
  async getPresentHeight(): Promise<number> {
    return await this.getJson('/getPresentHeight')
  }
  async getInfo(): Promise<ChaintracksInfoApi> {
    return await this.getJson('/getInfo')
  }
  async findChainTipHeader(): Promise<BlockHeader> {
    // When I tested it, the server responded with more fields than defined in the BlockHeader
    // I suppose the `BlockHeader` definition should be updated to include those fields
    /*
    {
      "status": "success",
      "value": {
        "height": 918934,
        "hash": "00000000000000000165924d2b7e41fd586d88e02f846ea6428d37c51f97db31",
        "version": 594616320,
        "previousHash": "000000000000000007dce4ee864f0569066bcded7a6a3eca9b977eebf9cb3926",
        "merkleRoot": "f4afaab11ec4921a59c9eb1e49435aeaaef6e4396ee9d4a77ef88fdd60057928",
        "time": 1760620895,
        "bits": 405131341,
        "nonce": 2411550733,

        // below are extra fields not defined in BlockHeader
        "headerId": 2025,
        "previousHeaderId": 2024,
        "chainWork": "0000000000000000000000000000000000000000016934b62084adb28c318e3c",
        "isChainTip": true,
        "isActive": true
      }
    }
     */
    return await this.getJson('/findChainTipHeaderHex')
  }
  async findChainTipHash(): Promise<string> {
    return await this.getJson('/findChainTipHashHex')
  }

  async getHeaders(height: number, count: number): Promise<string> {
    return await this.getJson<string>(`/getHeaders?height=${height}&count=${count}`)
  }

  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    return await this.getJsonOrUndefined(`/findHeaderHexForHeight?height=${height}`)
  }

  async findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined> {
    return await this.getJsonOrUndefined(`/findHeaderHexForBlockHash?hash=${hash}`)
  }
}
