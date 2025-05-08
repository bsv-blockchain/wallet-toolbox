/**
 * Returns a copy of a Buffer with byte order reversed.
 * @returns new buffer with byte order reversed.
 * @publicbody
 */
export function swapByteOrder(buffer: Buffer): Buffer {
  return Buffer.from(buffer).reverse()
}

/**
 * @param num a number value in the Uint32 value range
 * @param littleEndian true for little-endian byte order in Buffer
 * @returns four byte buffer with Uint32 number encoded
 * @publicbody
 */
export function convertUint32ToBuffer(num: number, littleEndian = true): Buffer {
  const arr = new ArrayBuffer(4)
  const view = new DataView(arr)
  view.setUint32(0, num, littleEndian) // byteOffset = 0
  return Buffer.from(arr)
}

/**
 * @param buffer four byte buffer with Uint32 number encoded
 * @param littleEndian true for little-endian byte order in Buffer
 * @returns a number value in the Uint32 value range
 * @publicbody
 */
export function convertBufferToUint32(buffer: Buffer, littleEndian = true): number {
  const arr = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  const view = new DataView(arr)
  return view.getUint32(0, littleEndian)
}
