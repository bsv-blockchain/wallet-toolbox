
export interface ChaintracksFsApi {
  delete(path: string): Promise<void>;
  writeFile(path: string, data: number[] | string): Promise<void>;
}
