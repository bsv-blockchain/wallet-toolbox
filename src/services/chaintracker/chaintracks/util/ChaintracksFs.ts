import {
  ChaintracksAppendableFileApi,
  ChaintracksFsApi,
  ChaintracksReadableFileApi,
  ChaintracksWritableFileApi
} from '../Api/ChaintracksFsApi'
import { promises as fs } from 'fs'
import Path from 'path'

export abstract class ChaintracksFsStatics {
  static async delete(path: string): Promise<void> {
    await fs.unlink(path)
  }
  static async writeFile(path: string, data: Uint8Array): Promise<void> {
    await this.ensureFoldersExist(path)
    await fs.writeFile(path, Buffer.from(data))
  }
  static async readFile(path: string): Promise<Uint8Array> {
    const buffer = await fs.readFile(path)
    return Uint8Array.from(buffer)
  }
  static async openReadableFile(path: string): Promise<ChaintracksReadableFileApi> {
    return await ChaintracksReadableFile.openAsReadable(path)
  }
  static async openWritableFile(path: string): Promise<ChaintracksWritableFileApi> {
    return await ChaintracksWritableFile.openAsWritable(path)
  }

  static async openAppendableFile(path: string): Promise<ChaintracksAppendableFileApi> {
    return await ChaintracksAppendableFile.openAsAppendable(path)
  }
  static async ensureFoldersExist(path: string): Promise<void> {
    const parsedPath = Path.parse(path)
    await fs.mkdir(parsedPath.dir, { recursive: true })
  }
  static pathJoin(...parts: string[]): string {
    return Path.join(...parts)
  }
}

export const ChaintracksFs: ChaintracksFsApi = ChaintracksFsStatics

export class ChaintracksReadableFile implements ChaintracksReadableFileApi {
  path: string
  parsedPath: Path.ParsedPath
  f: fs.FileHandle

  protected constructor(path: string, f: fs.FileHandle) {
    this.path = path
    this.f = f
    this.parsedPath = Path.parse(path)
  }

  async close(): Promise<void> {
    await this.f.close()
  }

  async getLength(): Promise<number> {
    const stats = await this.f.stat()
    return stats.size
  }

  async read(length?: number, offset?: number): Promise<Uint8Array> {
    length ||= 80 * 1024 // Default to 80KB if no length is specified
    const buffer = Buffer.alloc(length)
    const rr = await this.f.read(buffer, 0, length, offset || 0)
    const rb = rr.bytesRead < length ? buffer.subarray(0, rr.bytesRead) : buffer
    return Uint8Array.from(rb)
  }

  static async openAsReadable(path: string): Promise<ChaintracksReadableFile> {
    const f = await fs.open(path, 'r')
    const file = new ChaintracksReadableFile(path, f)
    return file
  }
}

export class ChaintracksWritableFile implements ChaintracksWritableFileApi {
  path: string
  parsedPath: Path.ParsedPath
  f: fs.FileHandle
  foldersEnsured: boolean = false

  private constructor(path: string, f: fs.FileHandle) {
    this.path = path
    this.f = f
    this.parsedPath = Path.parse(path)
  }

  static async openAsWritable(path: string): Promise<ChaintracksWritableFile> {
    const f = await fs.open(path, 'w')
    const file = new ChaintracksWritableFile(path, f)
    return file
  }

  async close(): Promise<void> {
    await this.f.close()
  }

  async ensureFoldersExist(): Promise<void> {
    if (!this.foldersEnsured) {
      await ChaintracksFsStatics.ensureFoldersExist(this.path)
      this.foldersEnsured = true
    }
  }

  async append(data: Uint8Array): Promise<void> {
    await this.ensureFoldersExist()
    throw new Error('Method not implemented.')
  }
}

export class ChaintracksAppendableFile extends ChaintracksReadableFile implements ChaintracksAppendableFileApi {
  foldersEnsured: boolean = false

  private constructor(path: string, f: fs.FileHandle) {
    super(path, f)
  }

  static async openAsAppendable(path: string): Promise<ChaintracksAppendableFile> {
    const f = await fs.open(path, 'a+')
    const file = new ChaintracksAppendableFile(path, f)
    return file
  }

  async ensureFoldersExist(): Promise<void> {
    if (!this.foldersEnsured) {
      await ChaintracksFsStatics.ensureFoldersExist(this.path)
      this.foldersEnsured = true
    }
  }

  async append(data: Uint8Array): Promise<void> {
    await this.ensureFoldersExist()
    throw new Error('Method not implemented.')
  }
}
