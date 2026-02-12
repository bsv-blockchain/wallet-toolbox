import { ChainTracker, defaultHttpClient, HttpClient, WhatsOnChainConfig } from '@bsv/sdk'

interface WhatsOnChainBlockHeader {
  merkleroot: string
}

/**
 * Represents a chain tracker based on What's On Chain .
 */
export default class SdkWhatsOnChain implements ChainTracker {
  readonly network: string
  readonly apiKey: string
  protected readonly URL: string
  protected readonly httpClient: HttpClient

  /**
   * Constructs an instance of the WhatsOnChain ChainTracker.
   *
   * @param {'main' | 'test' | 'stn'} network - The BSV network to use when calling the WhatsOnChain API.
   * @param {WhatsOnChainConfig} config - Configuration options for the WhatsOnChain ChainTracker.
   */
  constructor(network: 'main' | 'test' | 'stn' | 'teratest' = 'main', config: WhatsOnChainConfig = {}) {
    const { apiKey, httpClient } = config
    this.network = network
    this.URL = `https://api.whatsonchain.com/v1/bsv/${network}`
    this.httpClient = httpClient ?? defaultHttpClient()
    this.apiKey = apiKey ?? ''
  }

  async isValidRootForHeight(root: string, height: number): Promise<boolean> {
    const requestOptions = {
      method: 'GET',
      headers: this.getHttpHeaders()
    }

    const response = await this.httpClient.request<WhatsOnChainBlockHeader>(
      `${this.URL}/block/${height}/header`,
      requestOptions
    )
    if (response.ok) {
      const { merkleroot } = response.data
      return merkleroot === root
    } else if (response.status === 404) {
      return false
    } else {
      throw new Error(
        `Failed to verify merkleroot for height ${height} because of an error: ${JSON.stringify(response.data)} `
      )
    }
  }

  async currentHeight(): Promise<number> {
    try {
      const requestOptions = {
        method: 'GET',
        headers: this.getHttpHeaders()
      }

      const response = await this.httpClient.request<{ height: number }>(`${this.URL}/block/headers`, requestOptions)
      if (response.ok) {
        return response.data[0].height
      } else {
        throw new Error(`Failed to get current height because of an error: ${JSON.stringify(response.data)} `)
      }
    } catch (error) {
      throw new Error(
        `Failed to get current height because of an error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  protected getHttpHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }

    if (typeof this.apiKey === 'string' && this.apiKey.trim() !== '') {
      headers.Authorization = this.apiKey
    }

    return headers
  }
}
