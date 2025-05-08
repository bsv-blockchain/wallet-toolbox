import { Utils } from '@bsv/sdk'
import { doubleSha256BE } from '../../../../utility/utilityHelpers'
import { HashIndexInfo } from './HashIndex'
import { writeUInt32BE } from './blockHeaderUtilities'

export type IndexLevelVal = { buffer: number[]; height: number }
export type IndexLevelBin = IndexLevel | IndexLevelVal[] // e.g. BlockHashHeight, MerkleRootHeight
export type IndexLevelMakeVal = (header: number[], height: number) => IndexLevelVal

export class IndexLevel {
  bins: IndexLevelBin[] = []
  shift = 0
  level = 0
  index = 0

  firstHeight = 0
  count = 0

  constructor(
    public makeVal?: IndexLevelMakeVal,
    public shifts: number[] = [],
    public levelIndex: number[] = []
  ) {
    if (makeVal && shifts && levelIndex) {
      const remainingShifts = [...shifts]
      const remainingLevelIndex = [...levelIndex]
      this.shift = remainingShifts.shift() || 0
      this.index = remainingLevelIndex.shift() || 0
      this.level = remainingShifts.length
      if (this.shift < 0 || this.shift > 7) throw new Error('`shift` must be in 0..7')
      if (this.index < 0 || this.index > 31) throw new Error('`index` must be in 0..31')
      const size = 256 >> this.shift
      this.bins = []
      for (let i = 0; i < size; i++) {
        this.bins[i] = this.level ? new IndexLevel(makeVal, remainingShifts, remainingLevelIndex) : []
      }
      this.firstHeight = Infinity
      this.count = 0
    }
  }

  static makeBlockHashIndex(shifts: number[], levelIndex: number[]): IndexLevel {
    const makeVal: IndexLevelMakeVal = (header, height) => ({ buffer: doubleSha256BE(header), height })
    const index = new IndexLevel(makeVal, shifts, levelIndex)
    return index
  }

  static makeMerkleRootIndex(shifts: number[], levelIndex: number[]): IndexLevel {
    const makeVal: IndexLevelMakeVal = (header, height) => ({ buffer: header.slice(36, 68), height })
    const index = new IndexLevel(makeVal, shifts, levelIndex)
    return index
  }

  load(buffer: number[], firstHeight: number) {
    if (!this.makeVal) throw new Error('makeVal is required')
    for (let i = 0; i < buffer.length / 80; i++) {
      const header = buffer.slice(i * 80, i * 80 + 80)
      const height = i + firstHeight
      const v = this.makeVal(header, height)
      this.loadVal(v)
    }
  }

  loadVal(val: IndexLevelVal) {
    this.firstHeight = Math.min(val.height, this.firstHeight)
    this.count++
    const key = val.buffer[this.index] >> this.shift
    const bin = this.bins[key]
    if (Array.isArray(bin)) bin.push(val)
    else bin.loadVal(val)
  }

  evalBinVals(evalFn: (binVals: IndexLevelVal[]) => void) {
    for (let i = 0; i < this.bins.length; i++) {
      const bin = this.bins[i]
      if (Array.isArray(bin)) evalFn(bin)
      else bin.evalBinVals(evalFn)
    }
  }

  static makeEmptyIndex(): number[] {
    const index = new IndexLevel()
    return index.toBuffer()
  }

  toBuffer(): number[] {
    let countBins = 0
    let countVals = 0
    let maxVals = 0
    this.evalBinVals(vals => {
      countBins++
      countVals += vals.length
      maxVals = Math.max(maxVals, vals.length)
    })
    const levels = this.shifts.length
    // 01            One byte version field
    // <firstHeight> Four BE bytes. First height value indexed.
    // <count>       Four BE bytes. How many consecutive height values are indexed.
    // <maxVals>     Four BE bytes. Maximum number of values in one bin.
    // <levels>      One byte, # levels
    // <shift>       One byte per level 0..7
    // <index>       One byte per level 0..31
    // <bincount>    Four BE bytes. Count of how many bins.
    // <offset>      Four BE bytes each * bincount.
    // <valcount>    At each offset, one byte count of vals in bin.
    // <val>         32 BE bytes buffer 4 BE byte height
    const length = 1 + 4 + 4 + 4 + 1 + levels * 2 + 4 + countBins * (4 + 4) + countVals * (32 + 4)
    const buffer: number[] = new Array(length)
    let offset = 0
    buffer[offset++] = 1
    offset = writeUInt32BE(this.firstHeight, buffer, offset)
    offset = writeUInt32BE(this.count, buffer, offset)
    offset = writeUInt32BE(maxVals, buffer, offset)
    buffer[offset++] = levels
    for (let level = 0; level < levels; level++) buffer[offset++] = this.shifts[level]
    for (let level = 0; level < levels; level++) buffer[offset++] = this.levelIndex[level]
    offset = writeUInt32BE(countBins, buffer, offset)
    const binOffset0 = offset + countBins * 4 // offset to first bin
    let binOffset = binOffset0 // offset to next bin
    this.evalBinVals(vals => {
      offset = writeUInt32BE(binOffset, buffer, offset)
      binOffset = writeUInt32BE(vals.length, buffer, binOffset)
      for (let i = 0; i < vals.length; i++) {
        buffer.splice(binOffset, 32, ...vals[i].buffer)
        binOffset += 32
        binOffset = writeUInt32BE(vals[i].height, buffer, binOffset)
      }
    })
    if (offset !== binOffset0 || binOffset !== length) throw new Error('math error...')
    return buffer
  }

  static parseBuffer(buffer: number[]): HashIndexInfo {
    const reader = new Utils.Reader(buffer)
    const version = reader.read(1)[0]
    const firstHeight = reader.readUInt32BE()
    const count = reader.readUInt32BE()
    const maxVals = reader.readUInt32BE()
    const levels = reader.read(1)[0]
    const shifts: number[] = []
    const levelIndex: number[] = []
    for (let level = 0; level < levels; level++) shifts.push(reader.read(1)[0])
    for (let level = 0; level < levels; level++) levelIndex.push(reader.read(1)[0])
    const countBins = reader.readUInt32BE()
    const offset0 = reader.pos
    return {
      version,
      firstHeight,
      count,
      maxVals,
      levels,
      shifts,
      levelIndex,
      countBins,
      offset0
    }
  }

  getStats() {
    let countEmpty = 0
    let maxLength = 0
    let countBins = 0
    let totalLengths = 0
    const evalFn = (binVals: IndexLevelVal[]) => {
      countBins++
      if (binVals.length === 0) countEmpty++
      else totalLengths += binVals.length
      maxLength = Math.max(binVals.length, maxLength)
    }
    this.evalBinVals(evalFn)
    const avgLength = totalLengths / (countBins - countEmpty)
    return {
      countBins,
      countEmpty,
      maxLength,
      avgLength
    }
  }
}
