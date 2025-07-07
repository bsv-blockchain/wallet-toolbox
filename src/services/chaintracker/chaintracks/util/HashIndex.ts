import { doubleSha256BE, doubleSha256LE } from '../../../../utility/utilityHelpers'
import { asArray, asUint8Array } from '../../../../utility/utilityHelpers.noBuffer'
import { asString } from '../../../../utility/utilityHelpers.noBuffer'
import { ChaintracksFsApi } from '../Api/ChaintracksFsApi'
import { readUInt32BE } from './blockHeaderUtilities'
import { IndexLevel, IndexLevelMakeVal } from './IndexLevel'

export interface HashIndexInfo {
  version: number
  firstHeight: number
  count: number
  maxVals: number
  levels: number
  shifts: number[]
  levelIndex: number[]
  countBins: number
  offset0: number
}

export class HashIndex {
  info: HashIndexInfo
  levelSize: number[]

  constructor(public buffer: Uint8Array) {
    this.info = IndexLevel.parseBuffer(buffer)
    this.levelSize = new Array(this.info.levels).fill(0)
    for (let i = this.info.levels - 1; i >= 0; i--) {
      this.levelSize[i] = i === this.info.levels - 1 ? 4 : (256 >> this.info.shifts[i + 1]) * this.levelSize[i + 1]
    }
  }

  static makeBlockHashIndex(bufferOfHeaders: Uint8Array, firstHeight: number) {
    const makeVal: IndexLevelMakeVal = (header, height) => ({ buffer: doubleSha256BE(header), height })
    return this.fromBufferOfHeaders(bufferOfHeaders, firstHeight, makeVal)
  }

  static makeMerkleRootIndex(bufferOfHeaders: Uint8Array, firstHeight: number) {
    const makeVal: IndexLevelMakeVal = (header, height) => ({ buffer: header.slice(36, 68).reverse(), height })
    return this.fromBufferOfHeaders(bufferOfHeaders, firstHeight, makeVal)
  }

  static fromBufferOfHeaders(bufferOfHeaders: Uint8Array, firstHeight: number, makeVal: IndexLevelMakeVal): HashIndex {
    let count = bufferOfHeaders.length / 80
    const shifts: number[] = []
    while (count / 256 > 4) {
      shifts.push(0)
      count /= 256
    }
    let bits = 0
    while (count / 2 > 2) {
      bits++
      count /= 2
    }
    if (bits > 0) shifts.push(8 - bits)
    const levelIndex: number[] = []
    for (let i = 0; i < shifts.length; i++) levelIndex.push(30 - i)

    const index = new IndexLevel(makeVal, shifts, levelIndex)

    index.load(bufferOfHeaders, firstHeight)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stats = index.getStats()

    const buffer = index.toBuffer()

    const hashIndex = new HashIndex(buffer)
    return hashIndex
  }

  static async loadFromFile(fs: ChaintracksFsApi, rootFolder: string, filename: string): Promise<HashIndex> {
    const path = fs.pathJoin(rootFolder, filename)
    let buffer: Uint8Array | undefined
    try {
      buffer = await fs.readFile(path)
    } catch (uerr) {
      if ((uerr as { code: string })?.code !== 'ENOENT') throw uerr
    }
    if (!buffer) {
      buffer = IndexLevel.makeEmptyIndex()
      await fs.writeFile(path, asUint8Array(buffer))
      buffer = await fs.readFile(path)
    }
    return new HashIndex(buffer)
  }

  async findHeight(hash: string): Promise<number | undefined> {
    const ha = asArray(hash)
    let offset = this.info.offset0
    for (let i = 0; i < this.info.levels; i++) {
      const index = this.info.levelIndex[i]
      const key = ha[index] >> this.info.shifts[i]
      offset += key * this.levelSize[i]
    }
    let binOffset = readUInt32BE(this.buffer, offset)
    const valcount = readUInt32BE(this.buffer, binOffset)
    binOffset += 4
    for (let v = 0; v < valcount; v++) {
      const valHash = asString(this.buffer.slice(binOffset, binOffset + 32))
      binOffset += 36
      if (valHash === hash) {
        const height = readUInt32BE(this.buffer, binOffset - 4)
        return height
      }
    }
    return undefined
  }
}
