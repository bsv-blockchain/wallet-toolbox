/**
 * Supports access to named data storage (file like).
 */
export interface ChaintracksReadableFileApi {
  path: string
  close(): Promise<void>
  /**
   * Returns the length of the data storage in bytes.
   */
  getLength(): Promise<number>
  /**
   *
   * @param length requested length to be returned, may return less than requested.
   * @param offset starting offset in the existing data storage to read from, defaults to 0.
   */
  read(length?: number, offset?: number): Promise<Uint8Array>
}

/**
 * Supports access and appending data to new or existing named data storage.
 * New data is always appended to the end of existing data.
 */
export interface ChaintracksAppendableFileApi extends ChaintracksReadableFileApi {
  /**
   * @param data data to add to the end of existing data.
   */
  append(data: Uint8Array): Promise<void>
}

/**
 * Supports creation or re-creation of named data storage from position 0.
 * Any pre-existing data is initially removed.
 * Does not support reading existing data.
 */
export interface ChaintracksWritableFileApi {
  path: string
  close(): Promise<void>
  /**
   * @param data data to add to the end of existing data.
   */
  append(data: Uint8Array): Promise<void>
}

/**
 * Supports file-like access to named data storage.
 *
 * Only minimal functionality required by Chaintracks is supported.
 */
export interface ChaintracksFsApi {
  delete(path: string): Promise<void>
  writeFile(path: string, data: Uint8Array): Promise<void>
  readFile(path: string): Promise<Uint8Array>
  openReadableFile(path: string): Promise<ChaintracksReadableFileApi>
  openWritableFile(path: string): Promise<ChaintracksWritableFileApi>
  openAppendableFile(path: string): Promise<ChaintracksAppendableFileApi>

  pathJoin(...parts: string[]): string
}
