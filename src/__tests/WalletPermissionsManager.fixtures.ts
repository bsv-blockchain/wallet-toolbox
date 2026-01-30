const { Validation } = jest.requireActual('@bsv/sdk')

const existingFetch = (globalThis as any).fetch
if (!existingFetch || !(existingFetch as any)._isMockFunction) {
  ;(globalThis as any).fetch = jest.fn(async () => ({
    ok: false,
    status: 404,
    json: async () => ({})
  }))
}

/**
 * A permissions manager testing mock/stub file for:
 *  1) The `@bsv/sdk` library: Transaction, LockingScript, PushDrop, Utils, Random, etc.
 *  2) A BRC-100 `WalletInterface` (the underlying wallet).
 *
 * This file bypasses real validation/logic in `@bsv/sdk`, returning placeholders and
 * stubs to prevent test-time errors such as "Invalid Atomic BEEF prefix."
 */

/* ---------------------------------------------------------------------------
 * 1) Partial Mocks for @bsv/sdk
 * -------------------------------------------------------------------------*/

/**
 * A minimal mock for `Transaction` that won't throw "Invalid Atomic BEEF prefix."
 * We override the static methods so they do not do real parsing/validation.
 */
export class MockTransaction {
  public inputs: any[] = [{}]
  public outputs: any[] = []
  public fee: number = 0

  constructor() {}
  static fromAtomicBEEF() {
    // Mocked below
  }

  static fromBEEF(beef: number[]): MockTransaction {
    // Same approach as above
    return new MockTransaction()
  }

  getFee(): number {
    return this.fee
  }

  toBEEF(): number[] {
    // Return an empty array for the BEEF representation
    return []
  }
}

;(MockTransaction as any).fromAtomicBEEF = jest.fn(() => {
  // We skip real validation, returning a MockTransaction with minimal structure.
  const tx = new MockTransaction()
  return tx
})

/**
 * Mocks for `LockingScript`. If your code calls e.g. LockingScript.fromHex, we can just
 * store the hex and do nothing else.
 */
export class MockLockingScript {
  hex: string
  constructor(hex: string) {
    this.hex = hex
  }
  public toHex(): string {
    return this.hex
  }
  static fromHex(hex: string): MockLockingScript {
    return new MockLockingScript(hex)
  }
}

/**
 * We stub out all methods: `decode()`, `lock()`, `unlock()`.
 */
export class MockPushDrop {
  // Typically we might store the wallet reference, but we can skip for now.
  constructor() {
    //
  }

  // Decodes a LockingScript into some {fields: number[][], protocol...} or undefined
  static decode(script: MockLockingScript): { fields: number[][] } | undefined {
    // If you rely on a real format, parse or store a pattern.
    // For now, returning a minimal stub: empty fields
    if (!script || !script.hex) return undefined
    if (script.hex.includes('some script')) {
      // When needed, return some fields
      return {
        fields: [
          [],
          [],
          [],
          [],
          [],
          [],
          [] // 7 fields should always be enough...
        ]
      }
    }
    // Just pretend we always decode to a single empty field array
    return { fields: [] }
  }

  lock(
    fields: number[][],
    protocolID: [number, string],
    keyID: string,
    counterparty: string,
    singleSignature: boolean,
    anyoneCanPay: boolean
  ): MockLockingScript {
    return new MockLockingScript('deadbeef')
  }

  unlock(
    protocolID: [number, string],
    keyID: string,
    counterparty: string,
    sighashType: string,
    enforceReplayProtection: boolean,
    sigSize: number,
    lockingScript: MockLockingScript
  ): {
    sign: (tx: MockTransaction, vin: number) => Promise<MockLockingScript>
  } {
    // In real usage, it would handle signature logic. We'll return a minimal stub.
    return {
      sign: async (tx: MockTransaction, vin: number) => {
        // produce a minimal unlocking script
        return new MockLockingScript('mockUnlockingScript')
      }
    }
  }
}

/**
 * Mocks for Utils, e.g. toHex, toUTF8, fromUTF8, etc.
 * We can provide minimal stubs that won't break your code.
 */
export const MockUtils = {
  toHex: (data: number[]) => {
    // Converts an array of numbers to a hexadecimal string.
    return data.map(num => num.toString(16).padStart(2, '0')).join('')
  },

  toArray: (str: string, encoding = 'utf8') => {
    // Converts a string to an array of numbers based on the encoding.
    if (encoding === 'hex') {
      const arr: number[] = []
      for (let i = 0; i < str.length; i += 2) {
        arr.push(parseInt(str.substr(i, 2), 16))
      }
      return arr
    } else if (encoding === 'base64') {
      const binaryStr = atob(str)
      return Array.from(binaryStr, char => char.charCodeAt(0))
    } else if (encoding === 'utf8') {
      return Array.from(str, char => char.charCodeAt(0))
    } else {
      throw new Error('Unsupported encoding: ' + encoding)
    }
  },

  toUTF8: (arr: number[]) => {
    // Converts an array of numbers to a UTF-8 string.
    return String.fromCharCode(...arr)
  },

  toBase64: (arr: number[]) => {
    // Converts an array of numbers to a Base64 string.
    const binaryStr = String.fromCharCode(...arr)
    return btoa(binaryStr)
  }
}
/*
export const MockValidation = {
  validateCreateActionArgs: (args: object) => {
    return {
      isSignAction: false
    }
  }
}
*/

/**
 * Mocks for Random
 */
export const MockRandom = (size: number): number[] => {
  return [...require('crypto').randomBytes(size)]
}

/**
 * Overriding the real classes with our mocks.
 */
export const MockedBSV_SDK = {
  Transaction: MockTransaction,
  LockingScript: MockLockingScript,
  PushDrop: MockPushDrop,
  Utils: MockUtils,
  Random: MockRandom,
  Certificate: null,
  Validation: Validation
}

/* ---------------------------------------------------------------------------
 * 2) A full mock for the BRC-100 WalletInterface
 * -------------------------------------------------------------------------*/

/**
 * A helper function returning a Jest-mocked `WalletInterface`.
 * This ensures all required methods exist and return plausible values.
 *
 * - By default, `createAction` returns a signableTransaction with empty arrays,
 *   so that the manager can call `Transaction.fromAtomicBEEF([])` without throwing.
 * - You can override or chain .mockResolvedValueOnce(...) inside individual tests
 *   if you want more specific behavior in certain test steps.
 */
export function mockUnderlyingWallet(): jest.Mocked<any> {
  return {
    getPublicKey: jest.fn().mockResolvedValue({ publicKey: '029999...' }),
    revealCounterpartyKeyLinkage: jest.fn().mockResolvedValue({
      encryptedLinkage: [1, 2, 3],
      encryptedLinkageProof: [4, 5, 6],
      prover: '02abcdef...',
      verifier: '02cccccc...',
      counterparty: '02bbbbbb...',
      revelationTime: new Date().toISOString()
    }),
    revealSpecificKeyLinkage: jest.fn().mockResolvedValue({
      encryptedLinkage: [1, 2, 3],
      encryptedLinkageProof: [4, 5, 6],
      prover: '02abcdef...',
      verifier: '02cccccc...',
      counterparty: '02bbbbbb...',
      protocolID: [1, 'test-protocol'],
      keyID: 'testKey',
      proofType: 1
    }),
    encrypt: jest.fn().mockResolvedValue({ ciphertext: [42, 42, 42, 42, 42, 42, 42] }),
    decrypt: jest.fn().mockResolvedValue({ plaintext: [42, 42, 42, 42, 42] }),
    createHmac: jest.fn().mockResolvedValue({ hmac: [0xaa] }),
    verifyHmac: jest.fn().mockResolvedValue({ valid: true }),
    createSignature: jest.fn().mockResolvedValue({ signature: [0x30, 0x44] }),
    verifySignature: jest.fn().mockResolvedValue({ valid: true }),

    createAction: jest.fn(async x => {
      if (x.options && x.options.signAndProcess === true) {
        return {
          tx: []
        }
      }
      return {
        signableTransaction: {
          tx: [],
          reference: 'mockReference'
        }
      }
    }),
    signAction: jest.fn().mockResolvedValue({
      txid: 'fake-txid',
      tx: []
    }),
    abortAction: jest.fn().mockResolvedValue({ aborted: true }),
    listActions: jest.fn().mockResolvedValue({
      totalActions: 0,
      actions: []
    }),
    internalizeAction: jest.fn().mockResolvedValue({ accepted: true }),
    listOutputs: jest.fn().mockResolvedValue({
      totalOutputs: 0,
      outputs: []
    }),
    relinquishOutput: jest.fn().mockResolvedValue({ relinquished: true }),

    acquireCertificate: jest.fn().mockResolvedValue({
      type: 'some-cert-type',
      subject: '02aaaaaaaaaa...',
      serialNumber: 'serial123',
      certifier: '02ccccccccccc...',
      revocationOutpoint: 'sometxid.1',
      signature: 'deadbeef',
      fields: { name: 'Alice', dob: '1990-01-01' }
    }),
    listCertificates: jest.fn().mockResolvedValue({
      totalCertificates: 0,
      certificates: []
    }),
    proveCertificate: jest.fn().mockResolvedValue({
      keyringForVerifier: {},
      certificate: undefined,
      verifier: undefined
    }),
    relinquishCertificate: jest.fn().mockResolvedValue({ relinquished: true }),
    discoverByIdentityKey: jest.fn().mockResolvedValue({
      totalCertificates: 0,
      certificates: []
    }),
    discoverByAttributes: jest.fn().mockResolvedValue({
      totalCertificates: 0,
      certificates: []
    }),
    isAuthenticated: jest.fn().mockResolvedValue({ authenticated: true }),
    waitForAuthentication: jest.fn().mockResolvedValue({ authenticated: true }),
    getHeight: jest.fn().mockResolvedValue({ height: 777777 }),
    getHeaderForHeight: jest.fn().mockResolvedValue({
      header: '000000000000abc...'
    }),
    getNetwork: jest.fn().mockResolvedValue({ network: 'testnet' }),
    getVersion: jest.fn().mockResolvedValue({ version: 'vendor-1.0.0' })
  }
}
