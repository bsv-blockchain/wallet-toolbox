import { mockUnderlyingWallet, MockedBSV_SDK } from './WalletPermissionsManager.fixtures'
import { WalletPermissionsManager, PermissionToken } from '../WalletPermissionsManager'

jest.mock('@bsv/sdk', () => MockedBSV_SDK)

describe('WalletPermissionsManager - Permission Checks', () => {
  let underlying: jest.Mocked<any>
  let manager: WalletPermissionsManager

  beforeEach(() => {
    // Fresh mock wallet before each test
    underlying = mockUnderlyingWallet() as jest.Mocked<any>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  /* ------------------------------------------------------
   *  5) PROTOCOL USAGE (DPACP) TESTS
   * ------------------------------------------------------ */
  describe('Protocol Usage (DPACP)', () => {
    it('should skip permission prompt if secLevel=0 (open usage)', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekProtocolPermissionsForSigning: true // Typically enforced
      })

      // Attempt createSignature with protocolID=[0, "someProtocol"]
      // Because securityLevel=0, the manager should skip checks
      await expect(
        manager.createSignature(
          {
            protocolID: [0, 'open-protocol'],
            data: [0x01, 0x02],
            keyID: '1'
          },
          'some-user.com'
        )
      ).resolves.not.toThrow()

      // No permission request
      const activeRequests = (manager as any).activeRequests as Map<string, any>
      expect(activeRequests.size).toBe(0)

      // Underlying createSignature called once
      expect(underlying.createSignature).toHaveBeenCalledTimes(1)
    })

    it('should prompt for protocol usage if securityLevel=1 and no existing token', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekProtocolPermissionsForSigning: true
      })

      // We'll bind a callback that grants ephemeral permission automatically
      manager.bindCallback('onProtocolPermissionRequested', async request => {
        // For tests, automatically grant ephemeral permission
        await manager.grantPermission({
          requestID: request.requestID,
          ephemeral: true
        })
      })

      // Because secLevel=1, we need a valid DPACP token
      // We have no token => manager triggers a request => callback grants ephemeral => passes
      await expect(
        manager.createSignature(
          {
            protocolID: [1, 'test-protocol'],
            data: [0x99, 0xaa],
            keyID: '1'
          },
          'some-nonadmin.com'
        )
      ).resolves.not.toThrow()

      // The underlying signature should succeed
      expect(underlying.createSignature).toHaveBeenCalledTimes(1)
    })

    it('should deny protocol usage if user denies permission', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {})

      // The callback denies the request
      manager.bindCallback('onProtocolPermissionRequested', request => {
        manager.denyPermission(request.requestID)
      })

      // Attempt an operation that requires protocol permission
      await expect(
        manager.encrypt(
          {
            protocolID: [1, 'needs-perm'],
            plaintext: [1, 2, 3],
            keyID: 'xyz'
          },
          'external-app.com'
        )
      ).rejects.toThrow(/Permission denied/)

      // Underlying encrypt was never called
      expect(underlying.encrypt).toHaveBeenCalledTimes(0)
    })

    it('should enforce privileged token if differentiatePrivilegedOperations=true', async () => {
      // By default, differentiatePrivilegedOperations is true.
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekProtocolPermissionsForSigning: true
      })

      manager.bindCallback('onProtocolPermissionRequested', async req => {
        // The request has `privileged=true`, so the resulting token must also be privileged.
        // We'll grant ephemeral to simulate success quickly.
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      // Attempt a privileged signature
      await expect(
        manager.createSignature(
          {
            protocolID: [1, 'high-level-crypto'],
            privileged: true,
            data: [0xc0, 0xff, 0xee],
            keyID: '1'
          },
          'nonadmin.app'
        )
      ).resolves.not.toThrow()

      // Confirm underlying was ultimately called
      expect(underlying.createSignature).toHaveBeenCalledTimes(1)
    })

    it('should ignore `privileged=true` if differentiatePrivilegedOperations=false', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        differentiatePrivilegedOperations: false, // Forces privileged usage to be treated as non-privileged
        seekProtocolPermissionsForSigning: true
      })

      // Because we treat privileged as false, the permission request does not need privileged credentials.
      manager.bindCallback('onProtocolPermissionRequested', async req => {
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await expect(
        manager.createSignature(
          {
            protocolID: [1, 'some-protocol'],
            privileged: true, // This flag will be ignored
            data: [0x99],
            keyID: 'keyXYZ'
          },
          'nonadmin.com'
        )
      ).resolves.not.toThrow()
    })

    it('should fail if protocol name is admin-reserved and caller is not admin', async () => {
      // admin-reserved means protocol name starts with "admin" or "p ".
      manager = new WalletPermissionsManager(underlying, 'secure.admin.com')

      // Non-admin tries to do e.g. `createHmac` with protocol name "admin super-secret"
      await expect(
        manager.createHmac(
          {
            protocolID: [1, 'admin super-secret'],
            data: [0x01, 0x02],
            keyID: '1'
          },
          'not-an-admin.com'
        )
      ).rejects.toThrow(/admin-only/i)

      // Underlying call never invoked
      expect(underlying.createHmac).toHaveBeenCalledTimes(0)
    })

    it('should prompt for renewal if token is found but expired', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {})

      // Suppose the user already had a token but it’s expired. We mock `findProtocolToken` so that
      // it returns an expired token, forcing a renewal request.
      const expiredToken: PermissionToken = {
        tx: [],
        txid: 'oldtxid123',
        outputIndex: 0,
        outputScript: 'deadbeef',
        satoshis: 1,
        originator: 'some-nonadmin.com',
        expiry: 1, // definitely in the past
        privileged: false,
        securityLevel: 1,
        protocol: 'test-protocol',
        counterparty: 'self'
      }
      jest.spyOn(manager as any, 'findProtocolToken').mockResolvedValue(expiredToken)

      // We'll bind a callback that grants a renewal ephemeral
      manager.bindCallback('onProtocolPermissionRequested', async req => {
        expect(req.renewal).toBe(true)
        expect(req.previousToken).toEqual(expiredToken)
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      // Now call an operation that requires protocol usage
      await manager.createSignature(
        {
          protocolID: [1, 'test-protocol'],
          data: [0xfe],
          keyID: '1'
        },
        'some-nonadmin.com'
      )
      // Should succeed after renewal
      expect(underlying.createSignature).toHaveBeenCalledTimes(1)
    })
  })

  /* ------------------------------------------------------
   *  6) BASKET USAGE (DBAP) TESTS
   * ------------------------------------------------------ */
  describe('Basket Usage (DBAP)', () => {
    it('should fail immediately if using an admin-only basket as non-admin', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com')
      // Attempt to createAction to insert into "admin secret-basket" from a non-admin origin
      await expect(
        manager.createAction(
          {
            description: 'Insert into admin basket',
            outputs: [
              {
                lockingScript: 'abcd',
                satoshis: 100,
                basket: 'admin secret-basket',
                outputDescription: 'Nothing to see  here'
              }
            ]
          },
          'non-admin.com'
        )
      ).rejects.toThrow(/admin-only/i)

      // Underlying createAction never called
      expect(underlying.createAction).toHaveBeenCalledTimes(0)
    })

    it('should fail immediately if using the reserved basket "default" as non-admin', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com')
      await expect(
        manager.createAction(
          {
            description: 'Insert to default basket',
            outputs: [
              {
                lockingScript: '0x1234',
                satoshis: 1,
                basket: 'default',
                outputDescription: 'Nothing to see here'
              }
            ]
          },
          'some-nonadmin.com'
        )
      ).rejects.toThrow(/admin-only/i)
    })

    it('should prompt for insertion permission if seekBasketInsertionPermissions=true', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekBasketInsertionPermissions: true
      })

      // auto-grant ephemeral
      manager.bindCallback('onBasketAccessRequested', async req => {
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      // Also auto-grant unrelated spending authorization (since this is createAction)
      manager.bindCallback('onSpendingAuthorizationRequested', async req => {
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await expect(
        manager.createAction(
          {
            description: 'Insert to user-basket',
            outputs: [
              {
                lockingScript: '7812',
                satoshis: 1,
                basket: 'user-basket',
                outputDescription: 'Nothing to see here'
              }
            ]
          },
          'some-nonadmin.com'
        )
      ).resolves.not.toThrow()

      // Confirm underlying createAction was eventually invoked
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
    })

    it('should skip insertion permission if seekBasketInsertionPermissions=false', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekBasketInsertionPermissions: false
      })

      // Auto-grant unrelated spending authorization (since this is createAction)
      manager.bindCallback('onSpendingAuthorizationRequested', async req => {
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await manager.createAction(
        {
          description: 'Insert to user-basket',
          outputs: [
            {
              lockingScript: '1234',
              satoshis: 1,
              basket: 'some-basket',
              outputDescription: 'Nothing to see here'
            }
          ]
        },
        'nonadmin.com'
      )
      // No requests queued, underlying is called
      const activeRequests = (manager as any).activeRequests as Map<string, any>
      expect(activeRequests.size).toBe(0)
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
    })

    it('should require listing permission if seekBasketListingPermissions=true and no token', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekBasketListingPermissions: true
      })

      manager.bindCallback('onBasketAccessRequested', async req => {
        // Deny for test
        manager.denyPermission(req.requestID)
      })

      // Attempt to list a user basket
      await expect(manager.listOutputs({ basket: 'user-basket' }, 'some-user.com')).rejects.toThrow(/Permission denied/)

      // There is one underlying call: internally, we called listOutputs to check if we had permission
      // (we did not, we sought it, and the user denied). So we see this call here, but we DO NOT see
      // the actual proxied call (for listing outputs in user-basket), since it was denied.
      expect(underlying.listOutputs).toHaveBeenCalledTimes(1)
      expect(underlying.listOutputs).toHaveBeenLastCalledWith(
        {
          basket: 'admin basket-access',
          include: 'entire transactions',
          tagQueryMode: 'all',
          tags: ['originator some-user.com', 'basket user-basket']
        },
        'admin.com'
      )
    })

    it('should prompt for removal permission if seekBasketRemovalPermissions=true', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekBasketRemovalPermissions: true
      })
      manager.bindCallback('onBasketAccessRequested', async req => {
        // auto-grant ephemeral
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await expect(
        manager.relinquishOutput(
          {
            output: 'someTxid.1',
            basket: 'user-basket'
          },
          'some-user.com'
        )
      ).resolves.not.toThrow()

      expect(underlying.relinquishOutput).toHaveBeenCalledTimes(1)
    })
  })

  /* ------------------------------------------------------
   *  7) CERTIFICATE USAGE (DCAP) TESTS
   * ------------------------------------------------------ */
  describe('Certificate Usage (DCAP)', () => {
    it('should skip certificate disclosure permission if config.seekCertificateDisclosurePermissions=false', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekCertificateDisclosurePermissions: false
      })
      // Directly call proveCertificate with no token => no prompt => immediate success
      await expect(
        manager.proveCertificate(
          {
            certificate: {
              type: 'KYC',
              subject: '02abcdef...',
              serialNumber: '123',
              certifier: '02ccc...',
              fields: { name: 'Alice', dob: '2000-01-01' }
            },
            fieldsToReveal: ['name'],
            verifier: '02xyz...',
            privileged: false
          },
          'nonadmin.com'
        )
      ).resolves.not.toThrow()

      expect(underlying.proveCertificate).toHaveBeenCalledTimes(1)
    })

    it('should require permission if seekCertificateDisclosurePermissions=true, no valid token', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekCertificateDisclosurePermissions: true
      })

      // Auto-grant ephemeral for test
      manager.bindCallback('onCertificateAccessRequested', async req => {
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      // Because we don't have a stored token, it triggers request -> ephemeral granted -> success
      await manager.proveCertificate(
        {
          certificate: {
            type: 'KYC',
            subject: '02abc..',
            serialNumber: 'xyz',
            certifier: '02dddd...',
            fields: { name: 'Bob', nationality: 'Mars' }
          },
          fieldsToReveal: ['name'],
          verifier: '02xxxx..',
          privileged: false
        },
        'some-user.com'
      )

      expect(underlying.proveCertificate).toHaveBeenCalledTimes(1)
    })

    it('should check that requested fields are a subset of the token’s fields', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekCertificateDisclosurePermissions: true
      })

      // Suppose we find an existing token that covers fields: ['name', 'dob', 'nationality']
      const existingToken: PermissionToken = {
        tx: [],
        txid: 'aabbcc',
        outputIndex: 0,
        outputScript: 'scriptHex',
        satoshis: 1,
        originator: 'some-user.com',
        expiry: 9999999999, // not expired
        privileged: false,
        certType: 'KYC',
        certFields: ['name', 'dob', 'nationality'],
        verifier: '02eeee...'
      }
      jest
        .spyOn(manager as any, 'findCertificateToken')
        .mockImplementation(async (orig, priv, verif, ct, requestedFields) => {
          // if requestedFields includes "someMissingField", return undefined
          // else return the existingToken
          if ((requestedFields as string[]).includes('someMissingField')) {
            return undefined // forces a request
          }
          return existingToken // forces immediate success
        })

      // Attempt to prove certificate revealing only 'name' -> Should pass without prompt
      await manager.proveCertificate(
        {
          certificate: {
            type: 'KYC',
            certifier: '02eeee...',
            subject: '02some...',
            serialNumber: '',
            fields: { name: 'Charlie', dob: '1999-01-01', nationality: 'EU' }
          },
          fieldsToReveal: ['name'],
          verifier: '02eeee...',
          privileged: false
        },
        'some-user.com'
      )
      expect(underlying.proveCertificate).toHaveBeenCalledTimes(1)

      // Attempt to reveal a field the token does NOT cover -> triggers request
      // Since the existing token does not cover 'someMissingField', we expect a prompt. Let’s deny it:
      manager.bindCallback('onCertificateAccessRequested', async req => {
        manager.denyPermission(req.requestID)
      })
      const secondAttempt = manager.proveCertificate(
        {
          certificate: {
            type: 'KYC',
            certifier: '02eeee...',
            fields: { name: 'Charlie', dob: '1999-01-01', nationality: 'EU' }
          },
          fieldsToReveal: ['dob', 'someMissingField'],
          verifier: '02eeee...',
          privileged: false
        },
        'some-user.com'
      )
      await expect(secondAttempt).rejects.toThrow(/Permission denied/)

      // Underlying proveCertificate not called for second attempt
      expect(underlying.proveCertificate).toHaveBeenCalledTimes(1)
    })

    it('should prompt for renewal if token is expired', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekCertificateDisclosurePermissions: true
      })

      // Mock an expired token
      const expiredCertToken: PermissionToken = {
        tx: [],
        txid: 'old-expired',
        outputIndex: 0,
        outputScript: 'deadbeef',
        satoshis: 1,
        originator: 'app.com',
        expiry: 1,
        privileged: false,
        certType: 'KYC',
        certFields: ['name', 'dob'],
        verifier: '02verifier'
      }
      jest.spyOn(manager as any, 'findCertificateToken').mockResolvedValue(expiredCertToken)

      // Callback that grants renewal ephemeral
      manager.bindCallback('onCertificateAccessRequested', async req => {
        expect(req.renewal).toBe(true)
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await manager.proveCertificate(
        {
          certificate: {
            type: 'KYC',
            fields: { name: 'Bob', dob: '1970' },
            certifier: '02verifier'
          },
          fieldsToReveal: ['name'],
          verifier: '02verifier',
          privileged: false
        },
        'app.com'
      )
      // Succeeds after ephemeral renewal
      expect(underlying.proveCertificate).toHaveBeenCalledTimes(1)
    })
  })

  /* ------------------------------------------------------
   *  8) SPENDING AUTHORIZATION (DSAP) TESTS
   * ------------------------------------------------------ */
  describe('Spending Authorization (DSAP)', () => {
    it('should skip if seekSpendingPermissions=false', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekSpendingPermissions: false
      })

      // createAction that tries to net spend 200 sats
      const result = await manager.createAction(
        {
          description: 'Some spend transaction',
          outputs: [
            {
              lockingScript: '1321',
              satoshis: 200,
              outputDescription: 'Nothing to see here'
            }
          ]
        },
        'user.com'
      )

      // No prompt triggered
      const activeRequests = (manager as any).activeRequests as Map<string, any>
      expect(activeRequests.size).toBe(0)

      // Underlying createAction definitely called
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
      // If seekSpendingPermissions=false, the result should NOT? contain the signableTransaction
      expect(result.signableTransaction).not.toBeDefined()
    })

    it('should require spending token if netSpent > 0 and seekSpendingPermissions=true', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekSpendingPermissions: true
      })

      // We’ll also mock the signableTransaction return to help manager compute netSpent
      underlying.createAction.mockResolvedValueOnce({
        signableTransaction: {
          tx: [0x00], // minimal
          reference: 'ref1'
        }
      })
      // The manager tries to parse the transaction to find netSpent.
      // By default, netSpent = totalOutput + fee - totalExplicitInputs
      // We haven't provided any explicit inputs in the createAction call, so netSpent = 200 + fee

      // Auto-grant ephemeral for test
      manager.bindCallback('onSpendingAuthorizationRequested', async req => {
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true,
          amount: 1000
        })
      })

      await expect(
        manager.createAction(
          {
            description: 'Spend 200 sats with no input from user',
            outputs: [
              {
                outputDescription: 'Nothing to see here',
                lockingScript: '1abc',
                satoshis: 200
              }
            ]
          },
          'some-user.com'
        )
      ).resolves.not.toThrow()

      // underlying createAction called
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
    })

    it('should check monthly limit usage and prompt renewal if insufficient', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com')

      // Suppose we find an existing DSAP token with authorizedAmount=500
      // manager.findSpendingToken() is used internally, so let's mock it
      const existingSpendingToken: PermissionToken = {
        tx: [],
        txid: 'dsap-old',
        outputIndex: 0,
        outputScript: 'scriptHex',
        satoshis: 1,
        originator: 'shopper.com',
        authorizedAmount: 500,
        expiry: 0 // indefinite
      }
      jest.spyOn(manager as any, 'findSpendingToken').mockResolvedValue(existingSpendingToken)

      // Next, manager.querySpentSince(token) sums the user’s monthly spending from labeled actions
      // Let’s stub that to say they've already spent 400.
      jest.spyOn(manager as any, 'querySpentSince').mockResolvedValue(400)

      // Attempt spending 200 => total usage would be 600 which exceeds 500 => prompt renewal
      // We'll auto-deny for test
      manager.bindCallback('onSpendingAuthorizationRequested', req => {
        manager.denyPermission(req.requestID)
      })

      await expect(
        manager.createAction(
          {
            description: 'Buy something for 200 sats',
            outputs: [
              {
                outputDescription: 'Nothing to see here',
                lockingScript: 'op_return',
                satoshis: 200
              }
            ]
          },
          'shopper.com'
        )
      ).rejects.toThrow(/Permission denied/)

      // The underlying createAction call was started but the manager calls abortAction upon denial
      expect(underlying.abortAction).toHaveBeenCalledTimes(1)
    })

    it('should pass if usage plus new spend is within the monthly limit', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {})

      // existing DSAP token with authorizedAmount=1000
      const dsapToken: PermissionToken = {
        tx: [],
        txid: 'dsap123',
        outputIndex: 0,
        outputScript: '9218',
        satoshis: 1,
        originator: 'shopper.com',
        authorizedAmount: 1000,
        expiry: 0
      }
      jest.spyOn(manager as any, 'findSpendingToken').mockResolvedValue(dsapToken)

      // Suppose they've spent 200 so far
      jest.spyOn(manager as any, 'querySpentSince').mockResolvedValue(200)

      // Attempt new spending of 500 => total=700 which is <= 1000 => no prompt
      await manager.createAction(
        {
          description: 'Spend 500 sats',
          outputs: [
            {
              outputDescription: 'Nothing to see here',
              lockingScript: '0abc',
              satoshis: 500
            }
          ]
        },
        'shopper.com'
      )
      // Success, no new permission requested
      const activeRequests = (manager as any).activeRequests as Map<string, any>
      expect(activeRequests.size).toBe(0)

      expect(underlying.createAction).toHaveBeenCalledTimes(1)
    })
  })

  /* ------------------------------------------------------
   *  9) LABEL USAGE PERMISSION TESTS
   * ------------------------------------------------------ */
  describe('Label Usage Permission', () => {
    it('should fail if label starts with "admin" and caller is not admin', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com')

      // Attempt to createAction with a label "admin secret-stuff"
      await expect(
        manager.createAction(
          {
            description: 'Applying admin label?',
            labels: ['admin secret-stuff']
          },
          'nonadmin.com'
        )
      ).rejects.toThrow(/admin-only/)

      // Underlying createAction never called
      expect(underlying.createAction).toHaveBeenCalledTimes(0)
    })

    it('should skip label permission if seekPermissionWhenApplyingActionLabels=false', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekPermissionWhenApplyingActionLabels: false
      })

      // Non-admin applies label "my-app-label"
      await expect(
        manager.createAction({ description: 'Add label', labels: ['my-app-label'] }, 'some-app.com')
      ).resolves.not.toThrow()

      // No prompt
      const activeRequests = (manager as any).activeRequests as Map<string, any>
      expect(activeRequests.size).toBe(0)

      // Called underlying
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
    })

    it('should prompt for label usage if seekPermissionWhenApplyingActionLabels=true', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekPermissionWhenApplyingActionLabels: true
      })

      manager.bindCallback('onProtocolPermissionRequested', async req => {
        // This request will have protocolID=[1, "action label <label>"], etc.
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await manager.createAction(
        {
          description: 'Add label "user-label-123"',
          labels: ['user-label-123']
        },
        'nonadmin.com'
      )

      // Underlying is called
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
    })

    it('should also prompt for listing actions by label if seekPermissionWhenListingActionsByLabel=true', async () => {
      manager = new WalletPermissionsManager(underlying, 'admin.com', {
        seekPermissionWhenListingActionsByLabel: true
      })

      manager.bindCallback('onProtocolPermissionRequested', async req => {
        // auto-grant ephemeral
        await manager.grantPermission({
          requestID: req.requestID,
          ephemeral: true
        })
      })

      await expect(
        manager.listActions(
          {
            labels: ['search-this-label']
          },
          'external-app.com'
        )
      ).resolves.not.toThrow()

      expect(underlying.listActions).toHaveBeenCalledTimes(1)
    })
  })
})
