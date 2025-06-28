import { HttpClient } from "@bsv/sdk"

export interface ChaintracksFetchApi {
  httpClient: HttpClient
  download(url: string): Promise<number[]>
}
