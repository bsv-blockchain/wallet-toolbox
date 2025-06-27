export interface ChaintracksFetchApi {
  download(url: string): Promise<number[]>
}
