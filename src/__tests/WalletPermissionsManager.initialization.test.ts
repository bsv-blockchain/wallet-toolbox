import { mockUnderlyingWallet, MockedBSV_SDK } from './WalletPermissionsManager.fixtures'
import { WalletPermissionsManager, PermissionsManagerConfig } from '../WalletPermissionsManager'

jest.mock('@bsv/sdk', () => MockedBSV_SDK)

describe('WalletPermissionsManager - Initialization & Configuration', () => {
  let underlying: jest.Mocked<any>

  beforeEach(() => {
    // Create a fresh underlying mock wallet before each test
    underlying = mockUnderlyingWallet()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default config if none is provided', () => {
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com')

    // The manager internally defaults all config flags to true.
    const internalConfig = (manager as any).config as PermissionsManagerConfig

    expect(internalConfig.seekProtocolPermissionsForSigning).toBe(true)
    expect(internalConfig.seekProtocolPermissionsForEncrypting).toBe(true)
    expect(internalConfig.seekPermissionsForIdentityKeyRevelation).toBe(true)
    expect(internalConfig.encryptWalletMetadata).toBe(true)

    // The manager should store the admin originator
    const admin = (manager as any).adminOriginator
    expect(admin).toBe('admin.domain.com')
  })

  it('should initialize with partial config overrides, merging with defaults', () => {
    const partialConfig: PermissionsManagerConfig = {
      seekProtocolPermissionsForSigning: false,
      encryptWalletMetadata: false
      // The rest remain default = true
    }

    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', partialConfig)
    const internalConfig = (manager as any).config

    // Overridden to false
    expect(internalConfig.seekProtocolPermissionsForSigning).toBe(false)
    expect(internalConfig.encryptWalletMetadata).toBe(false)

    // Remaining defaults still true
    expect(internalConfig.seekBasketInsertionPermissions).toBe(true)
    expect(internalConfig.seekSpendingPermissions).toBe(true)
  })

  it('should initialize with all config flags set to false', () => {
    const allFalse: PermissionsManagerConfig = {
      seekProtocolPermissionsForSigning: false,
      seekProtocolPermissionsForEncrypting: false,
      seekProtocolPermissionsForHMAC: false,
      seekPermissionsForKeyLinkageRevelation: false,
      seekPermissionsForPublicKeyRevelation: false,
      seekPermissionsForIdentityKeyRevelation: false,
      seekPermissionsForIdentityResolution: false,
      seekBasketInsertionPermissions: false,
      seekBasketRemovalPermissions: false,
      seekBasketListingPermissions: false,
      seekPermissionWhenApplyingActionLabels: false,
      seekPermissionWhenListingActionsByLabel: false,
      seekCertificateDisclosurePermissions: false,
      seekCertificateAcquisitionPermissions: false,
      seekCertificateRelinquishmentPermissions: false,
      seekCertificateListingPermissions: false,
      encryptWalletMetadata: false,
      seekSpendingPermissions: false,
      differentiatePrivilegedOperations: false
    }

    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', allFalse)
    const internalConfig = (manager as any).config

    for (const [k, v] of Object.entries(allFalse)) {
      expect(internalConfig[k]).toBe(v)
    }
  })

  it('should consider calls from the adminOriginator as admin, bypassing checks', async () => {
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com')

    // If we call a method that normally triggers permission checks (like createAction with a basket),
    // but pass in originator="admin.domain.com", we expect NO permission prompt or error.
    // We'll do a minimal createAction call.
    const result = await manager.createAction(
      {
        description: 'Insertion to user basket',
        outputs: [
          {
            lockingScript: 'abcd',
            satoshis: 1000,
            outputDescription: 'some out desc',
            basket: 'some-user-basket'
          }
        ]
      },
      'admin.domain.com'
    )

    // If the manager truly bypassed checks for the admin, it won't queue a request
    // nor throw an error. The call should just succeed.
    expect(result).toBeDefined()

    // Confirm the underlying createAction was actually called
    expect(underlying.createAction).toHaveBeenCalledTimes(1)

    // activeRequests map should be empty
    const activeRequests = (manager as any).activeRequests as Map<string, any[]>
    expect(activeRequests.size).toBe(0)
  })

  it('should skip protocol permission checks for signing if seekProtocolPermissionsForSigning=false', async () => {
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
      seekProtocolPermissionsForSigning: false
    })

    // Non-admin origin attempts "createSignature" with a protocolID
    // Normally, if config was true, we'd expect a request for permission.
    // But here we expect it to skip and proceed.
    await expect(
      manager.createSignature(
        {
          protocolID: [1, 'some-protocol'],
          privileged: false,
          data: [0x01, 0x02],
          keyID: '1'
        },
        'app.nonadmin.com'
      )
    ).resolves.not.toThrow()

    // underlying createSignature is invoked
    expect(underlying.createSignature).toHaveBeenCalledTimes(1)

    // The manager’s internal request queue should remain empty
    const activeRequests = (manager as any).activeRequests as Map<string, any[]>
    expect(activeRequests.size).toBe(0)
  })

  it('should enforce protocol permission checks for signing if seekProtocolPermissionsForSigning=true', async () => {
    // By default, or explicitly set to true, the manager enforces permission checks
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
      seekProtocolPermissionsForSigning: true
    })

    // Non-admin origin tries createSignature -> must prompt for protocol permission
    const createSigPromise = manager.createSignature(
      {
        protocolID: [1, 'test-protocol'],
        keyID: '1',
        data: [0x10, 0x20],
        privileged: false
      },
      'nonadmin.com'
    )

    // The manager triggers a request. Let's see if the request queue has an entry:
    const activeRequests = (manager as any).activeRequests as Map<string, any>
    // We may not see an entry synchronously because `ensureProtocolPermission()` is async,
    // but once the promise gets to that stage, it populates the queue.

    // Wait a short tick to let the async code run
    await new Promise(res => setTimeout(res, 10))
    expect(activeRequests.size).toBeGreaterThan(0)

    // We'll forcibly deny the request so the test can conclude:
    const firstRequestKey = Array.from(activeRequests.keys())[0]
    const firstRequestQueue = activeRequests.get(firstRequestKey)
    if (firstRequestQueue && firstRequestQueue.pending.length > 0) {
      manager.denyPermission(firstRequestKey)
    }

    // The promise eventually rejects with "Permission denied."
    await expect(createSigPromise).rejects.toThrow(/Permission denied/)
  })

  it('should skip basket insertion permission checks if seekBasketInsertionPermissions=false', async () => {
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
      seekBasketInsertionPermissions: false
    })
    // Spending authorization is still required, grant it.
    manager.bindCallback(
      'onSpendingAuthorizationRequested',
      jest.fn(x => {
        manager.grantPermission({ requestID: x.requestID, ephemeral: true })
      }) as any
    )

    // Non-admin origin tries to createAction specifying a basket
    await expect(
      manager.createAction(
        {
          description: 'Insert to user basket',
          outputs: [
            {
              lockingScript: '1234',
              satoshis: 888,
              basket: 'somebasket',
              outputDescription: 'some out desc'
            }
          ]
        },
        'some-user.com'
      )
    ).resolves.not.toThrow()

    // Because insertion checks are disabled, no permission request should be queued
    const activeRequests = (manager as any).activeRequests as Map<string, any>
    expect(activeRequests.size).toBe(0)
  })

  it('should skip all permission checks if all relevant config flags are false (except admin-only baskets, etc.)', async () => {
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
      // Only turning off relevant categories, i.e. we might set all false except we keep
      // differentiatePrivilegedOperations at default just to verify. Or set it to false as well.
      seekProtocolPermissionsForSigning: false,
      seekProtocolPermissionsForEncrypting: false,
      seekProtocolPermissionsForHMAC: false,
      seekPermissionsForKeyLinkageRevelation: false,
      seekPermissionsForPublicKeyRevelation: false,
      seekPermissionsForIdentityKeyRevelation: false,
      seekPermissionsForIdentityResolution: false,
      seekBasketInsertionPermissions: false,
      seekBasketRemovalPermissions: false,
      seekBasketListingPermissions: false,
      seekPermissionWhenApplyingActionLabels: false,
      seekPermissionWhenListingActionsByLabel: false,
      seekCertificateDisclosurePermissions: false,
      seekCertificateAcquisitionPermissions: false,
      seekCertificateRelinquishmentPermissions: false,
      seekCertificateListingPermissions: false,
      encryptWalletMetadata: false,
      seekSpendingPermissions: false,
      differentiatePrivilegedOperations: false
    })

    // We'll do a few calls that would normally require checks:

    // 1) createSignature from non-admin
    await expect(
      manager.createSignature({ protocolID: [1, 'some-protocol'], data: [0x01], keyID: '1' }, 'nonadmin.com')
    ).resolves.not.toThrow()

    // 2) createAction to insert in a basket
    await expect(
      manager.createAction(
        {
          description: 'Inserting stuff',
          outputs: [
            {
              lockingScript: '012345',
              satoshis: 1,
              basket: 'user-basket',
              outputDescription: 'some out desc'
            }
          ]
        },
        'nonadmin.com'
      )
    ).resolves.not.toThrow()

    // 3) Acquire certificate
    await expect(
      manager.acquireCertificate(
        {
          type: 'base64-cert-type',
          certifier: '02abc...',
          acquisitionProtocol: 'direct',
          fields: { name: 'Bob' }
        },
        'nonadmin.com'
      )
    ).resolves.not.toThrow()

    // Confirm no queued requests
    const activeRequests = (manager as any).activeRequests as Map<string, any[]>
    expect(activeRequests.size).toBe(0)
  })

  it('should block usage of an admin-only protocol name if not called by admin', async () => {
    const manager = new WalletPermissionsManager(underlying, 'admin.domain.com')
    // A protocol name that starts with "admin"
    await expect(
      manager.createSignature(
        {
          protocolID: [1, 'admin super-secret-protocol'],
          data: [1, 2, 3],
          keyID: '1',
          privileged: false
        },
        'nonadmin.com'
      )
    ).rejects.toThrow(/admin-only/i)
  })
})
