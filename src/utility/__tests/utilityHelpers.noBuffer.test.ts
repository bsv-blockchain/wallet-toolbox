import { asString, asUint8Array } from '../utilityHelpers.noBuffer'

describe('utilityHelpers.noBuffer tests', () => {
  jest.setTimeout(99999999)

  test('0 convert from Uint8Array', async () => {
    const a = new Uint8Array([1, 2, 3, 4])
    {
      const r = asUint8Array(a)
      expect(r.length).toBe(4)
      expect(r.every((v, i) => v === a[i])).toBe(true)
    }
    {
      const r = asString(a)
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'hex')
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'utf8')
      expect(r).toBe('\x01\x02\x03\x04')
    }
    {
      const r = asString(a, 'base64')
      expect(r).toBe('AQIDBA==')
    }
  })

  test('1 convert from number[]', async () => {
    const a = [1, 2, 3, 4]
    {
      const r = asUint8Array(a)
      expect(r.length).toBe(4)
      expect(r.every((v, i) => v === a[i])).toBe(true)
    }
    {
      const r = asString(a)
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'hex')
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'utf8')
      expect(r).toBe('\x01\x02\x03\x04')
    }
    {
      const r = asString(a, 'base64')
      expect(r).toBe('AQIDBA==')
    }
  })

  test('2 convert from hex string', async () => {
    const a = '01020304'
    {
      const r = asUint8Array(a)
      expect(r.length).toBe(4)
      expect(r.every((v, i) => v === parseInt(a.slice(i * 2, i * 2 + 2), 16))).toBe(true)
    }
    {
      const r = asString(a)
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'hex')
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'hex', 'hex')
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'hex', 'utf8')
      expect(r).toBe('\x01\x02\x03\x04')
    }
    {
      const r = asString(a, 'hex', 'base64')
      expect(r).toBe('AQIDBA==')
    }
  })

  test('3 convert from utf8 string', async () => {
    const a = '\x01\x02\x03\x04'
    {
      const r = asUint8Array(a, 'utf8')
      expect(r.length).toBe(4)
      expect(r.every((v, i) => v === i + 1)).toBe(true)
    }
    {
      const r = asString(a, 'utf8', 'hex')
      expect(r).toBe('01020304')
    }
    {
      const r = asString(a, 'utf8')
      expect(r).toBe('\x01\x02\x03\x04')
    }
    {
      const r = asString(a, 'utf8', 'utf8')
      expect(r).toBe('\x01\x02\x03\x04')
    }
    {
      const r = asString(a, 'utf8', 'base64')
      expect(r).toBe('AQIDBA==')
    }
  })
})
