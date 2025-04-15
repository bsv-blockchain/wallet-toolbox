import { WalletInterface, Random, Hash, Utils, PrivateKey, SymmetricKey } from '@bsv/sdk'
import { PrivilegedKeyManager } from '../sdk'
import { CWIStyleWalletManager, PBKDF2_NUM_ROUNDS, UMPToken, UMPTokenInteractor } from '../CWIStyleWalletManager'
import { jest } from '@jest/globals'

jest.useFakeTimers()

// ------------------------------------------------------------------------------------------
// Mocks and Utilities
// ------------------------------------------------------------------------------------------

/** A utility to create an Outpoint string for test usage. */
function makeOutpoint(txid: string, vout: number): string {
  return `${txid}:${vout}`
}

/**
 * A mock underlying WalletInterface to verify that proxy methods:
 *  1. Are not callable if not authenticated
 *  2. Are disallowed if originator is admin
 *  3. Forward to the real method if conditions pass
 */
const mockUnderlyingWallet = {
  getPublicKey: jest.fn(),
  revealCounterpartyKeyLinkage: jest.fn(),
  revealSpecificKeyLinkage: jest.fn(),
  encrypt: jest.fn(),
  decrypt: jest.fn(),
  createHmac: jest.fn(),
  verifyHmac: jest.fn(),
  createSignature: jest.fn(),
  verifySignature: jest.fn(),
  createAction: jest.fn(),
  signAction: jest.fn(),
  abortAction: jest.fn(),
  listActions: jest.fn(),
  internalizeAction: jest.fn(),
  listOutputs: jest.fn(),
  relinquishOutput: jest.fn(),
  acquireCertificate: jest.fn(),
  listCertificates: jest.fn(),
  proveCertificate: jest.fn(),
  relinquishCertificate: jest.fn(),
  discoverByIdentityKey: jest.fn(),
  discoverByAttributes: jest.fn(),
  isAuthenticated: jest.fn(),
  waitForAuthentication: jest.fn(),
  getHeight: jest.fn(),
  getHeaderForHeight: jest.fn(),
  getNetwork: jest.fn(),
  getVersion: jest.fn()
} as unknown as WalletInterface

/**
 * A mock function that simulates building an underlying wallet.
 */
const mockWalletBuilder = jest.fn(async (primaryKey, privilegedKeyManager) => {
  // Return our mock underlying wallet object.
  return mockUnderlyingWallet
})

/**
 * A mock UMPTokenInteractor implementation.
 * We can track whether buildAndSend is called with the right arguments, etc.
 */
const mockUMPTokenInteractor: UMPTokenInteractor = {
  findByPresentationKeyHash: jest.fn(async (hash: number[]) => undefined),
  findByRecoveryKeyHash: jest.fn(async (hash: number[]) => undefined),
  buildAndSend: jest.fn(
    async (wallet: WalletInterface, admin: string, token: UMPToken, oldToken?: UMPToken) => 'abcd.0'
  )
}

/**
 * A mock "recoveryKeySaver" that claims it always saved the key successfully.
 */
const mockRecoveryKeySaver = jest.fn(async (key: number[]) => true as true)

/**
 * A mock "passwordRetriever" that we can customize to return a specific password
 * or throw if needed.
 */
const mockPasswordRetriever = jest.fn(async () => 'test-password')

const XOR = (n1: number[], n2: number[]): number[] => {
  if (n1.length !== n2.length) {
    throw new Error('lengths mismatch')
  }
  const r = new Array<number>(n1.length)
  for (let i = 0; i < n1.length; i++) {
    r[i] = n1[i] ^ n2[i]
  }
  return r
}

// Generate some globals
const presentationKey = Random(32)
const recoveryKey = Random(32)
const passwordSalt = Random(32)
const passwordKey = Hash.pbkdf2(Utils.toArray('test-password', 'utf8'), passwordSalt, PBKDF2_NUM_ROUNDS, 32, 'sha512')
const primaryKey = Random(32)
const privilegedKey = Random(32)

/**
 * A helper function to create a minimal valid UMP token.
 * This can be used to mock a stored token for existing users.
 */
async function createMockUMPToken(): Promise<UMPToken> {
  const presentationPassword = new SymmetricKey(XOR(presentationKey, passwordKey))
  const presentationRecovery = new SymmetricKey(XOR(presentationKey, recoveryKey))
  const recoveryPassword = new SymmetricKey(XOR(recoveryKey, passwordKey))
  const primaryPassword = new SymmetricKey(XOR(primaryKey, passwordKey))
  const tempPrivilegedKeyManager = new PrivilegedKeyManager(async () => new PrivateKey(privilegedKey))
  return {
    passwordSalt,
    passwordPresentationPrimary: presentationPassword.encrypt(primaryKey) as number[],
    passwordRecoveryPrimary: recoveryPassword.encrypt(primaryKey) as number[],
    presentationRecoveryPrimary: presentationRecovery.encrypt(primaryKey) as number[],
    passwordPrimaryPrivileged: primaryPassword.encrypt(privilegedKey) as number[],
    presentationRecoveryPrivileged: presentationRecovery.encrypt(privilegedKey) as number[],
    presentationHash: Hash.sha256(presentationKey),
    recoveryHash: Hash.sha256(recoveryKey),
    presentationKeyEncrypted: (
      await tempPrivilegedKeyManager.encrypt({
        plaintext: presentationKey,
        protocolID: [2, 'admin key wrapping'],
        keyID: '1'
      })
    ).ciphertext,
    passwordKeyEncrypted: (
      await tempPrivilegedKeyManager.encrypt({
        plaintext: passwordKey,
        protocolID: [2, 'admin key wrapping'],
        keyID: '1'
      })
    ).ciphertext,
    recoveryKeyEncrypted: (
      await tempPrivilegedKeyManager.encrypt({
        plaintext: recoveryKey,
        protocolID: [2, 'admin key wrapping'],
        keyID: '1'
      })
    ).ciphertext,
    currentOutpoint: 'abcd:0'
  }
}

describe('CWIStyleWalletManager Tests', () => {
  let manager: CWIStyleWalletManager

  beforeEach(() => {
    // Reset all mock calls
    jest.clearAllMocks()

    // We create a new manager for each test, with no initial snapshot
    manager = new CWIStyleWalletManager(
      'admin.walletvendor.com', // admin originator
      mockWalletBuilder,
      mockUMPTokenInteractor,
      mockRecoveryKeySaver,
      mockPasswordRetriever
      // no state snapshot
    )
  })

  // ----------------------------------------------------------------------------------------
  // Private method tests (just to ensure coverage).
  // We'll call them via (manager as any).somePrivateMethod(...) if needed.
  // ----------------------------------------------------------------------------------------

  test('XOR function: verifies correctness', () => {
    const fnXOR = (manager as any).XOR as (a: number[], b: number[]) => number[]

    const a = [0x00, 0xff, 0xaa]
    const b = [0xff, 0xff, 0x55]
    const result = fnXOR(a, b)

    // 0x00 ^ 0xFF = 0xFF
    // 0xFF ^ 0xFF = 0x00
    // 0xAA ^ 0x55 = 0xFF
    expect(result).toEqual([0xff, 0x00, 0xff])
  })

  // ----------------------------------------------------------------------------------------
  // Authentication flows
  // ----------------------------------------------------------------------------------------

  describe('New user flow: presentation + password', () => {
    test('Successfully creates a new token and calls buildAndSend', async () => {
      // New wallet funder is a mock function
      const newWalletFunder = jest.fn(() => {})
      ;(manager as any).newWalletFunder = newWalletFunder

      // Mock that no token is found by presentation key hash
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)

      // Provide a presentation key
      await manager.providePresentationKey(presentationKey)

      expect(manager.authenticationFlow).toBe('new-user')

      // Provide a password
      mockPasswordRetriever.mockResolvedValueOnce('dummy-password')
      await manager.providePassword('dummy-password')

      // The wallet should now be built, so manager is authenticated
      expect(manager.authenticated).toBe(true)

      // Recovery key saver should have been called
      expect(mockRecoveryKeySaver).toHaveBeenCalledTimes(1)

      // The underlying wallet builder should have been called exactly once
      expect(mockWalletBuilder).toHaveBeenCalledTimes(1)

      // The manager should have called buildAndSend on the interactor
      expect(mockUMPTokenInteractor.buildAndSend).toHaveBeenCalledTimes(1)
      const buildArgs = (mockUMPTokenInteractor.buildAndSend as any).mock.calls[0]
      // [0] => the wallet, [1] => adminOriginator, [2] => newToken, [3] => oldToken
      expect(buildArgs[1]).toBe('admin.walletvendor.com')
      expect(buildArgs[2]).toHaveProperty('presentationHash')
      expect(buildArgs[3]).toBeUndefined() // Because it's a new user (no old token)
      expect(newWalletFunder).toHaveBeenCalled() // New wallet funder should have been called
    })

    test('Throws if user tries to provide recovery key during new-user flow', async () => {
      // Mark it as new user flow by no token found
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      await manager.providePresentationKey(Array.from({ length: 32 }, () => 1))

      await expect(manager.provideRecoveryKey(Array.from({ length: 32 }, () => 2))).rejects.toThrow(
        'Do not submit recovery key in new-user flow'
      )
    })
  })

  describe('Existing user flow: presentation + password', () => {
    test('Decryption of primary key and building the wallet', async () => {
      // Provide a mock UMP token
      const mockToken = await createMockUMPToken()
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(mockToken)

      // Provide presentation
      await manager.providePresentationKey(presentationKey)
      expect(manager.authenticationFlow).toBe('existing-user')

      // Provide password
      // The manager's internal code will do PBKDF2 with the password + token.passwordSalt
      // Then XOR that with the presentation key for decryption.
      await manager.providePassword('test-password')

      // Check that manager is authenticated
      expect(manager.authenticated).toBe(true)

      // Underlying wallet is built
      expect(mockWalletBuilder).toHaveBeenCalledTimes(1)
    })
  })

  describe('Existing user flow: presentation + recovery key', () => {
    beforeEach(async () => {
      manager.authenticationMode = 'presentation-key-and-recovery-key'
      manager.authenticationFlow = 'existing-user'
    })

    test('Successfully decrypts with presentation+recovery', async () => {
      // Provide a mock UMP token
      const mockToken = await createMockUMPToken()
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(mockToken)

      await manager.providePresentationKey(presentationKey)

      // Provide the recovery key.
      // In "presentation-key-and-recovery-key" mode, the manager won't need the password at all.
      await manager.provideRecoveryKey(recoveryKey)

      expect(manager.authenticated).toBe(true)
      expect(mockWalletBuilder).toHaveBeenCalledTimes(1)
    })

    test('Throws if presentation key not provided first', async () => {
      const recoveryKey = Array.from({ length: 32 }, () => 8)
      await expect(manager.provideRecoveryKey(recoveryKey)).rejects.toThrow('Provide the presentation key first')
    })
  })

  describe('Existing user flow: recovery key + password', () => {
    beforeEach(async () => {
      manager.authenticationMode = 'recovery-key-and-password'
      manager.authenticationFlow = 'existing-user'
    })

    test('Works with correct keys, sets mode as existing-user', async () => {
      const mockToken = await createMockUMPToken()
      ;(mockUMPTokenInteractor.findByRecoveryKeyHash as any).mockResolvedValueOnce(mockToken)

      // Provide recovery key
      await manager.provideRecoveryKey(recoveryKey)

      // Provide password
      await manager.providePassword('test-password')

      expect(manager.authenticated).toBe(true)
      expect(mockWalletBuilder).toHaveBeenCalledTimes(1)
    })

    test('Throws if no token found by recovery key hash', async () => {
      ;(mockUMPTokenInteractor.findByRecoveryKeyHash as any).mockResolvedValueOnce(undefined)
      await expect(manager.provideRecoveryKey(recoveryKey)).rejects.toThrow('No user found with this recovery key')
    })
  })

  // ----------------------------------------------------------------------------------------
  // Snapshots
  // ----------------------------------------------------------------------------------------

  describe('saveSnapshot / loadSnapshot', () => {
    test('Saves a snapshot and can load it into a fresh manager instance', async () => {
      // We'll do a new user flow so that manager is authenticated with a real token.
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      const presKey = Array.from({ length: 32 }, () => 0xa1)
      await manager.providePresentationKey(presKey)
      await manager.providePassword('mypassword') // triggers creation of new user

      const snapshot = manager.saveSnapshot()
      expect(Array.isArray(snapshot)).toBe(true)
      expect(snapshot.length).toBeGreaterThan(64) // 32 bytes + encrypted data

      // Now create a fresh manager:
      const freshManager = new CWIStyleWalletManager(
        'admin.walletvendor.com',
        mockWalletBuilder,
        mockUMPTokenInteractor,
        mockRecoveryKeySaver,
        mockPasswordRetriever
      )

      // Not authenticated yet
      await expect(() => freshManager.getPublicKey({ identityKey: true })).rejects.toThrow('User is not authenticated')

      // Load the snapshot
      await freshManager.loadSnapshot(snapshot)

      // The fresh manager is now authenticated (underlying wallet will be built).
      await expect(freshManager.getPublicKey({ identityKey: true })).resolves.not.toThrow()

      // It calls walletBuilder again
      expect(mockWalletBuilder).toHaveBeenCalledTimes(2) // once for the old manager, once for the fresh
    })

    test('Throws error if saving snapshot while no primary key or token set', async () => {
      // Manager is not yet authenticated
      expect(() => manager.saveSnapshot()).toThrow('No root primary key or current UMP token set')
    })

    test('Throws if snapshot is corrupt or cannot be decrypted', async () => {
      // Attempt to load an invalid snapshot
      await expect(() => manager.loadSnapshot([1, 2, 3])).rejects.toThrow('Failed to load snapshot')
    })
  })

  // ----------------------------------------------------------------------------------------
  // Changing Keys
  // ----------------------------------------------------------------------------------------

  describe('Change Password', () => {
    test('Requires authentication and updates the UMP token on-chain', async () => {
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      manager = new CWIStyleWalletManager(
        'admin.walletvendor.com',
        mockWalletBuilder,
        mockUMPTokenInteractor,
        mockRecoveryKeySaver,
        async () => 'test-password'
      )
      await manager.providePresentationKey(presentationKey)
      await manager.providePassword('test-password')
      expect(manager.authenticated).toBe(true)
      await manager.changePassword('new-pass')
      expect(mockUMPTokenInteractor.buildAndSend).toHaveBeenCalledTimes(2)
    })

    test('Throws if not authenticated', async () => {
      await expect(manager.changePassword('test-password')).rejects.toThrow('Not authenticated or missing required data.')
    })
  })

  describe('Change Recovery Key', () => {
    test('Prompts to save the new key, updates the token', async () => {
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      manager = new CWIStyleWalletManager(
        'admin.walletvendor.com',
        mockWalletBuilder,
        mockUMPTokenInteractor,
        mockRecoveryKeySaver,
        async () => 'test-password'
      )
      await manager.providePresentationKey(presentationKey)
      await manager.providePassword('test-password')
      expect(manager.authenticated).toBe(true)
      ;(mockUMPTokenInteractor.buildAndSend as any).mockResolvedValueOnce(makeOutpoint('rcv1', 0))
      await manager.changeRecoveryKey()

      // The user is prompted to store the new key
      expect(mockRecoveryKeySaver).toHaveBeenCalledTimes(2) // once when user created, once after changed
      // The UMP token is updated
      expect(mockUMPTokenInteractor.buildAndSend).toHaveBeenCalledTimes(2)
    })

    test('Throws if not authenticated', async () => {
      await expect(manager.changeRecoveryKey()).rejects.toThrow('Not authenticated or missing required data.')
    })
  })

  describe('Change Presentation Key', () => {
    test('Requires authentication, re-publishes the token, old token consumed', async () => {
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      manager = new CWIStyleWalletManager(
        'admin.walletvendor.com',
        mockWalletBuilder,
        mockUMPTokenInteractor,
        mockRecoveryKeySaver,
        async () => 'test-password'
      )
      await manager.providePresentationKey(presentationKey)
      await manager.providePassword('test-password')
      expect(manager.authenticated).toBe(true)
      ;(mockUMPTokenInteractor.buildAndSend as any).mockResolvedValueOnce(makeOutpoint('rcv1', 0))
      const newPresKey = Array.from({ length: 32 }, () => 0xee)
      await manager.changePresentationKey(newPresKey)
      expect(mockUMPTokenInteractor.buildAndSend).toHaveBeenCalledTimes(2)
    })
  })

  test('Destroy callback clears sensitive data', async () => {
    // authenticate as new user
    ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
    await manager.providePresentationKey(Array.from({ length: 32 }, () => 12))
    await manager.providePassword('some-pass')

    // manager is authenticated
    expect(manager.authenticated).toBe(true)

    // Destroy
    manager.destroy()

    expect(manager.authenticated).toBe(false)
    // And we can confirm that manager won't allow calls
    await expect(() => manager.getPublicKey({ identityKey: true })).rejects.toThrow('User is not authenticated')
  })

  // ----------------------------------------------------------------------------------------
  // Proxies / originator checks
  // ----------------------------------------------------------------------------------------

  describe('Proxy method calls', () => {
    beforeEach(async () => {
      // authenticate
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      await manager.providePresentationKey(presentationKey)
      await manager.providePassword('test-password')
    })

    test('Throws if user is not authenticated', async () => {
      // force de-auth
      ;(manager as any).authenticated = false
      await expect(() => manager.getPublicKey({ identityKey: true })).rejects.toThrow('User is not authenticated.')
    })

    test('Throws if originator is adminOriginator', async () => {
      await expect(manager.getPublicKey({ identityKey: true }, 'admin.walletvendor.com')).rejects.toThrow(
        'External applications are not allowed to use the admin originator.'
      )
    })

    test('Passes if user is authenticated and originator is not admin', async () => {
      await manager.getPublicKey({ identityKey: true }, 'example.com')
      expect(mockUnderlyingWallet.getPublicKey).toHaveBeenCalledTimes(1)
    })

    test('All proxied methods call underlying with correct arguments', async () => {
      // We'll do a quick spot-check of a few methods:
      await manager.encrypt({ plaintext: [1, 2, 3], protocolID: [1, 'tests'], keyID: '1' }, 'mydomain.com')
      expect(mockUnderlyingWallet.encrypt).toHaveBeenCalledWith(
        { plaintext: [1, 2, 3], protocolID: [1, 'tests'], keyID: '1' },
        'mydomain.com'
      )

      // TODO: Test all other proxied methods
    })

    test('isAuthenticated() rejects if originator is admin, resolves otherwise', async () => {
      // If admin tries:
      await expect(manager.isAuthenticated({}, 'admin.walletvendor.com')).rejects.toThrow(
        'External applications are not allowed to use the admin originator.'
      )
      // If normal domain:
      const result = await manager.isAuthenticated({}, 'normal.com')
      expect(result).toEqual({ authenticated: true })
    })

    test('waitForAuthentication() eventually resolves', async () => {
      // Already authenticated from beforeEach. So it should immediately return.
      const result = await manager.waitForAuthentication({}, 'normal.com')
      expect(result).toEqual({ authenticated: true })
    })
  })
  describe('Additional Tests for Password Retriever Callback, Privileged Key Expiry, and UMP Token Serialization', () => {
    let manager: CWIStyleWalletManager

    beforeEach(() => {
      jest.clearAllMocks()
      manager = new CWIStyleWalletManager(
        'admin.walletvendor.com',
        mockWalletBuilder,
        mockUMPTokenInteractor,
        mockRecoveryKeySaver,
        mockPasswordRetriever
      )
    })

    test('serializeUMPToken and deserializeUMPToken correctly round-trip a UMP token', async () => {
      const token = await createMockUMPToken()
      // We need a token with a currentOutpoint for serialization.
      expect(token.currentOutpoint).toBeDefined()
      const serializeFn = (manager as any).serializeUMPToken as (token: UMPToken) => number[]
      const deserializeFn = (manager as any).deserializeUMPToken as (bin: number[]) => UMPToken

      const serialized = serializeFn(token)
      expect(Array.isArray(serialized)).toBe(true)
      expect(serialized.length).toBeGreaterThan(0)

      const deserialized = deserializeFn(serialized)
      expect(deserialized).toEqual(token)
    })

    test('Password retriever callback: the test function is passed and returns a boolean', async () => {
      let capturedTestFn: ((candidate: string) => boolean) | null = null
      const customPasswordRetriever = jest.fn(async (reason: string, testFn: (candidate: string) => boolean) => {
        capturedTestFn = testFn
        // In a real scenario the test function would validate a candidate.
        // For our test we simply return the correct password.
        return 'test-password'
      })
      ;(manager as any).passwordRetriever = customPasswordRetriever

      // Force a new-user flow by having no token found.
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      await manager.providePresentationKey(presentationKey)
      await manager.providePassword('test-password')
      expect(manager.authenticated).toBe(true)
      // Clear the privileged key so the callback gets ran
      jest.advanceTimersByTime(121_000)

      // Let's trigger a privileged operation
      await manager.changePassword('test-password') // trigger some privileged operation...
      expect(customPasswordRetriever).toHaveBeenCalled()
      expect(capturedTestFn).not.toBeNull()
      // Since the internal test function is defined inline, we simply check that its output is a boolean.
      // (Its logic uses the outer scope and may not use its argument correctly, but we verify that it at least returns a boolean.)
      const testResult = capturedTestFn!('any-input')
      expect(typeof testResult).toBe('boolean')
      expect(capturedTestFn!('any-input')).toBe(false)
      expect(capturedTestFn!('test-password')).toBe(true)
    })

    test('Privileged key expiry: each call to decrypt via the privileged manager invokes passwordRetriever', async () => {
      // In a new-user flow, buildUnderlying is called without a privilegedKey,
      // so any later use of the privileged manager will trigger a password prompt.
      const customPasswordRetriever = jest.fn(async (reason: string, testFn: (candidate: string) => boolean) => {
        return 'test-password'
      })
      ;(manager as any).passwordRetriever = customPasswordRetriever

      // New-user flow (no existing token)
      ;(mockUMPTokenInteractor.findByPresentationKeyHash as any).mockResolvedValueOnce(undefined)
      await manager.providePresentationKey(presentationKey)
      await manager.providePassword('test-password')

      // Clear any calls recorded during authentication.
      customPasswordRetriever.mockClear()

      // Call the underlying privileged key manager’s decrypt twice.
      // (For example, we use the ciphertext from one of the token’s encrypted fields.)
      await (manager as any).rootPrivilegedKeyManager.decrypt({
        ciphertext: (manager as any).currentUMPToken.passwordKeyEncrypted,
        protocolID: [2, 'admin key wrapping'],
        keyID: '1'
      })

      // Key expires after 2 minutes
      jest.advanceTimersByTime(121_000)

      await (manager as any).rootPrivilegedKeyManager.decrypt({
        ciphertext: (manager as any).currentUMPToken.passwordKeyEncrypted,
        protocolID: [2, 'admin key wrapping'],
        keyID: '1'
      })

      // Since no ephemeral privileged key was provided when building the underlying wallet,
      // each call to decrypt should have resulted in a call to passwordRetriever.
      expect(customPasswordRetriever).toHaveBeenCalledTimes(2)
    })
  })
})
