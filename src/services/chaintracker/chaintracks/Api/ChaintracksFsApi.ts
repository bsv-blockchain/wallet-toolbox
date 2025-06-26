export interface ChaintracksReadableFileApi {
  path: string;
  close(): Promise<void>;
  getLength(): Promise<number>;
  read(length?: number, offset?: number): Promise<number[]>;
}

export interface ChaintracksWritableFileApi extends ChaintracksReadableFileApi {
  write(data: number[], offset?: number): Promise<void>;
  append(data: number[]): Promise<void>;
}

export interface ChaintracksFsApi {
  delete(path: string): Promise<void>;
  writeFile(path: string, data: number[]): Promise<void>;
  readFile(path: string): Promise<number[]>;
  openReadableFile(path: string): Promise<ChaintracksReadableFileApi>;
  openWritableFile(path: string): Promise<ChaintracksWritableFileApi>;
}
