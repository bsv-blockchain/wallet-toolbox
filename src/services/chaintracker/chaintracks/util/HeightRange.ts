import { BlockHeader } from '../Api/BlockHeaderApi'

export interface HeightRangeApi {
  minHeight: number
  maxHeight: number
}

export interface HeightRanges {
  bulk: HeightRange
  live: HeightRange
}

export class HeightRange implements HeightRangeApi {
  constructor(
    public minHeight: number,
    public maxHeight: number
  ) {}

  static readonly empty = new HeightRange(0, -1)

  /**
   * @param headers
   * @returns range of height values from the given headers, or the empty range if there are no headers.
   */
  static from(headers: BlockHeader[]): HeightRange {
    if (headers.length === 0) return HeightRange.empty
    const minHeight = headers.reduce((min, h) => Math.min(min, h.height), headers[0].height)
    const maxHeight = headers.reduce((max, h) => Math.max(max, h.height), headers[0].height)
    return new HeightRange(minHeight, maxHeight)
  }

  get length() {
    return Math.max(0, this.maxHeight - this.minHeight + 1)
  }

  get isEmpty() {
    return this.minHeight > this.maxHeight
  }

  toString(): string {
    return this.isEmpty ? '<empty>' : `${this.minHeight}-${this.maxHeight}`
  }

  /**
   * @param range HeightRange or single height value.
   * @returns true if `range` is entirely within this range.
   */
  contains(range: HeightRange | number) {
    if (typeof range === 'number') {
      return this.minHeight <= range && this.maxHeight >= range
    }
    return this.minHeight <= range.minHeight && this.maxHeight >= range.maxHeight
  }

  /**
   * Return the intersection with another height range.
   *
   * Intersection with an empty range is always empty.
   *
   * The result is always a single, possibly empty, range.
   * @param range
   * @returns
   */
  intersect(range: HeightRange) {
    return new HeightRange(Math.max(this.minHeight, range.minHeight), Math.min(this.maxHeight, range.maxHeight))
  }

  /**
   * Return the union with another height range.
   *
   * Only valid if the two ranges overlap or touch, or one is empty.
   *
   * Throws an error if the union would create two disjoint ranges.
   *
   * @param range
   * @returns
   */
  union(range: HeightRange) {
    if (this.isEmpty) return range.copy()
    if (range.isEmpty) return this.copy()
    if (this.maxHeight + 1 < range.minHeight || range.maxHeight + 1 < this.minHeight)
      throw new Error('Union of ranges with a gap between them is not supported.')
    return new HeightRange(Math.min(this.minHeight, range.minHeight), Math.max(this.maxHeight, range.maxHeight))
  }

  /**
   * Returns `range` subtracted from this range.
   *
   * Throws an error if the subtraction would create two disjoint ranges.
   *
   * @param range
   * @returns
   */
  subtract(range: HeightRange) {
    if (this.isEmpty || range.isEmpty) return this.copy()
    if (this.minHeight < range.minHeight && this.maxHeight > range.maxHeight)
      throw new Error('Subtraction of range that creates two disjoint ranges is not supported.')
    if (range.maxHeight < this.minHeight || range.minHeight > this.maxHeight)
      // Leave untouched. Subtracted is either all lower or all higher.
      return this.copy()
    if (range.minHeight <= this.minHeight && range.maxHeight < this.maxHeight)
      // Remove a chunk on the low side.
      return new HeightRange(range.maxHeight + 1, this.maxHeight)
    if (range.minHeight <= this.minHeight && range.maxHeight >= this.maxHeight)
      // Remove the whole thing
      return new HeightRange(this.minHeight, this.minHeight - 1) // empty
    if (range.minHeight <= this.maxHeight && range.maxHeight >= this.maxHeight)
      // Remove a chunk on the high side.
      return new HeightRange(this.minHeight, range.minHeight - 1)
    throw new Error('All cases should have been handled :-) .')
  }

  /**
   * If `range` is not empty and this is not empty, returns a new range minHeight
   * replaced by to range.maxHeight + 1.
   *
   * Otherwise returns a copy of this range.
   *
   * This returns the portion of this range that is strictly above `range`.
   */
  above(range: HeightRange) {
    if (range.isEmpty || this.isEmpty) return this.copy()
    return new HeightRange(range.maxHeight + 1, this.maxHeight)
  }

  /**
   * Return a copy of this range.
   */
  copy(): HeightRange {
    return new HeightRange(this.minHeight, this.maxHeight)
  }
}
