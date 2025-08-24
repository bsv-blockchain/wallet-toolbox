import { HttpClient } from '@bsv/sdk'

export interface ChaintracksFetchApi {
  httpClient: HttpClient
  download(url: string): Promise<Uint8Array>
  fetchJson<R>(url: string): Promise<R>
  pathJoin(baseUrl: string, subpath: string): string
}
