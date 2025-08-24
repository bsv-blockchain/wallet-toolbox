import { Utils } from '@bsv/sdk'

/**
 * Convert a value to an encoded string if currently an encoded string or number[] or Uint8Array.
 * @param val string or number[] or Uint8Array. If string, encoding must be hex. If number[], each value must be 0..255.
 * @param enc optional encoding type if val is string, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.
 * @param returnEnc optional encoding type for returned string if different from `enc`, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.
 * @returns hex encoded string representation of val.
 * @publicbody
 */
export function asString(
  val: string | number[] | Uint8Array,
  enc?: 'hex' | 'utf8' | 'base64',
  returnEnc?: 'hex' | 'utf8' | 'base64'
): string {
  enc ||= 'hex'
  returnEnc ||= enc
  if (typeof val === 'string') {
    if (enc === returnEnc) return val
    val = asUint8Array(val, enc)
  }
  let v = Array.isArray(val) ? val : Array.from(val)
  switch (returnEnc) {
    case 'utf8':
      return Utils.toUTF8(v)
    case 'base64':
      return Utils.toBase64(v)
  }
  return Utils.toHex(v)
}

/**
 * Convert a value to number[] if currently an encoded string or number[] or Uint8Array.
 * @param val string or number[] or Uint8Array. If string, encoding must be hex. If number[], each value must be 0..255.
 * @param enc optional encoding type if val is string, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.
 * @returns number[] array of byte values representation of val.
 * @publicbody
 */
export function asArray(val: string | number[] | Uint8Array, enc?: 'hex' | 'utf8' | 'base64'): number[] {
  if (Array.isArray(val)) return val
  if (typeof val !== 'string') return Array.from(val)
  enc ||= 'hex'
  let a: number[] = Utils.toArray(val, enc)
  return a
}

/**
 * Convert a value to Uint8Array if currently an encoded string or number[] or Uint8Array.
 * @param val string or number[] or Uint8Array. If string, encoding must be hex. If number[], each value must be 0..255.
 * @param enc optional encoding type if val is string, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.
 * @returns Uint8Array representation of val.
 * @publicbody
 */
export function asUint8Array(val: string | number[] | Uint8Array, enc?: 'hex' | 'utf8' | 'base64'): Uint8Array {
  if (Array.isArray(val)) return Uint8Array.from(val)
  if (typeof val !== 'string') return val
  enc ||= 'hex'
  let a: number[] = Utils.toArray(val, enc)
  return Uint8Array.from(a)
}
