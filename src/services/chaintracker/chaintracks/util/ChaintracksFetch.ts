import { defaultHttpClient, HttpClient } from '@bsv/sdk'
import { ChaintracksFetchApi } from '../Api/ChaintracksFetchApi'

export class ChaintracksFetch implements ChaintracksFetchApi {
  httpClient: HttpClient = defaultHttpClient()

  constructor() {}

  async download(url: string): Promise<Uint8Array> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to download from ${url}: ${response.statusText}`)
    }

    const data = await response.arrayBuffer()

    return new Uint8Array(data)
  }

  async fetchJson<R>(url: string): Promise<R> {
    const requestJsonOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    const response = await fetch(url, requestJsonOptions)
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON from ${url}: ${response.statusText}`)
    }
    const json = (await response.json()) as R
    return json
  }

  pathJoin(baseUrl: string, subpath: string): string {
    // Ensure the subpath doesn't start with a slash to avoid issues
    const cleanSubpath = subpath.replace(/^\/+/, '')
    if (!baseUrl.endsWith('/')) baseUrl += '/'
    // Create a new URL object and append the subpath
    const url = new URL(cleanSubpath, baseUrl)
    return url.toString()
  }
}
