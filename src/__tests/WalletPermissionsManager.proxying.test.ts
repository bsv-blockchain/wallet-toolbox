import { mockUnderlyingWallet, MockedBSV_SDK, MockTransaction } from './WalletPermissionsManager.fixtures'
import { WalletPermissionsManager, PermissionsManagerConfig } from '../WalletPermissionsManager'

jest.mock('@bsv/sdk', () => MockedBSV_SDK)

describe('WalletPermissionsManager - Regression & Integration with Underlying Wallet', () => {
  let underlying: jest.Mocked<any>
  let manager: WalletPermissionsManager

  beforeEach(() => {
    // Create a fresh underlying mock wallet
    underlying = mockUnderlyingWallet()
    // Default config: everything enforced for maximum coverage
    const defaultConfig: PermissionsManagerConfig = {
      seekProtocolPermissionsForSigning: true,
      seekProtocolPermissionsForEncrypting: true,
      seekProtocolPermissionsForHMAC: true,
      seekPermissionsForKeyLinkageRevelation: true,
      seekPermissionsForPublicKeyRevelation: true,
      seekPermissionsForIdentityKeyRevelation: true,
      seekPermissionsForIdentityResolution: true,
      seekBasketInsertionPermissions: true,
      seekBasketRemovalPermissions: true,
      seekBasketListingPermissions: true,
      seekPermissionWhenApplyingActionLabels: true,
      seekPermissionWhenListingActionsByLabel: true,
      seekCertificateDisclosurePermissions: true,
      seekCertificateAcquisitionPermissions: true,
      seekCertificateRelinquishmentPermissions: true,
      seekCertificateListingPermissions: true,
      encryptWalletMetadata: true,
      seekSpendingPermissions: true,
      differentiatePrivilegedOperations: true
    }
    // We pass "admin.test" as the admin origin
    manager = new WalletPermissionsManager(underlying, 'admin.test', defaultConfig)

    // For these tests, we don't want to deal with UI prompts or real user interactions.
    // We stub out any permission requests by auto-granting ephemeral in all cases
    manager.bindCallback('onProtocolPermissionRequested', async req => {
      await manager.grantPermission({
        requestID: req.requestID,
        ephemeral: true
      })
    })
    manager.bindCallback('onBasketAccessRequested', async req => {
      await manager.grantPermission({
        requestID: req.requestID,
        ephemeral: true
      })
    })
    manager.bindCallback('onCertificateAccessRequested', async req => {
      await manager.grantPermission({
        requestID: req.requestID,
        ephemeral: true
      })
    })
    manager.bindCallback('onSpendingAuthorizationRequested', async req => {
      // If the request is for a netSpent above some threshold, let's simulate a denial for one test scenario
      // By default, we'll just ephemeral-grant.
      await manager.grantPermission({
        requestID: req.requestID,
        ephemeral: true
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  /* -------------------------------------------------------------------------
   * createAction / signAction / abortAction
   * ----------------------------------------------------------------------- */

  it('should pass createAction calls through, label them, handle metadata encryption, and check spending authorization', async () => {
    // We'll mock the "netSpent" scenario to be >0 by returning some mock input & output satoshis from the signableTransaction.
    // The underlying mock createAction returns a signableTransaction with tx = []
    // We can stub out the mock so that the manager sees inputs/outputs with certain sat amounts.
    // But we have to remember the manager is parsing the signableTransaction via fromAtomicBEEF(…).
    // We'll control that by adjusting the mock signableTransaction in the underlying.

    // let's set a custom signableTransaction that returns 500 sat in inputs, 1000 in outputs, and 100 in fee
    underlying.createAction.mockResolvedValueOnce({
      signableTransaction: {
        // The manager calls Transaction.fromAtomicBEEF() on this
        tx: [0xde, 0xad], // not used in detail, but let's just pass some array
        reference: 'test-ref'
      }
    })

    // We also need to configure the fromAtomicBEEF mock so it returns a transaction with the specified inputs/outputs
    const mockTx = new MockTransaction()
    mockTx.fee = 100
    // We'll define exactly one input we consider "originator-provided" with 500 sat
    mockTx.inputs = [
      {
        sourceTXID: 'aaa',
        sourceOutputIndex: 0,
        sourceTransaction: {
          outputs: [{ satoshis: 500 }]
        }
      }
    ]
    // We'll define 2 outputs. The manager will read the output amounts from the createAction call's "args.outputs" too,
    // but we also set them here in case it cross-references them. We'll keep it consistent (2 outputs with total 1000).
    mockTx.outputs = [{ satoshis: 600 }, { satoshis: 400 }]

    // Now override fromAtomicBEEF to return our mockTx:
    ;(MockedBSV_SDK.Transaction.fromAtomicBEEF as jest.Mock).mockReturnValue(mockTx)

    // Attempt to create an action from a non-admin origin
    await manager.createAction(
      {
        description: 'User purchase',
        inputs: [
          {
            outpoint: 'aaa.0',
            unlockingScriptLength: 73,
            inputDescription: 'My input'
          }
        ],
        outputs: [
          {
            lockingScript: '00abcd',
            satoshis: 1000,
            outputDescription: 'Purchase output',
            basket: 'my-basket'
          }
        ],
        labels: ['user-label', 'something-else']
      },
      'shop.example.com'
    )

    // The manager should have:
    // 1) Called underlying.createAction
    // 2) Inserted "admin originator shop.example.com" & "admin month YYYY-MM" into labels
    // 3) Encrypted the metadata fields (description, inputDescription, outputDescription)
    // 4) Ensured we needed spending permission for netSpent= (1000 + fee100) - 500 = 600
    //    The onSpendingAuthorizationRequested callback ephemeral-granted it.
    expect(underlying.createAction).toHaveBeenCalledTimes(1)
    const callArgs = underlying.createAction.mock.calls[0][0]
    expect(callArgs.labels).toContain('admin originator shop.example.com')
    expect(callArgs.labels).toEqual(
      expect.arrayContaining([
        expect.stringContaining('admin month'),
        'user-label',
        'something-else',
        'admin originator shop.example.com'
      ])
    )
    // Confirm the metadata was replaced with some ciphertext array in createAction call
    expect(callArgs.description).not.toBe('User purchase') // manager encrypts it
    if (callArgs.inputs[0].inputDescription) {
      expect(callArgs.inputs[0].inputDescription).not.toBe('My input')
    }
    if (callArgs.outputs[0].outputDescription) {
      expect(callArgs.outputs[0].outputDescription).not.toBe('Purchase output')
    }

    // Also confirm we set signAndProcess to false if origin is non-admin
    expect(callArgs.options.signAndProcess).toBe(false)

    // The manager will parse the resulting signableTransaction, see netSpent=600, and request spending permission.
    // Our callback ephemeral-granted.  So everything should proceed with no error.
    // The manager returns the partial result from underlying
    // We don't have a final sign call from the manager because signAndProcess is forcibly false.
  })

  it('should abort the action if spending permission is denied', async () => {
    // This time let's forcibly DENY the onSpendingAuthorizationRequested callback
    manager.unbindCallback('onSpendingAuthorizationRequested', 0) // Unbind the ephemeral-grant
    manager.bindCallback('onSpendingAuthorizationRequested', async req => {
      await manager.denyPermission(req.requestID)
    })

    // We'll use the same approach: netSpent > 0 triggers the spending authorization check.
    underlying.createAction.mockResolvedValueOnce({
      signableTransaction: {
        tx: [0xde],
        reference: 'test-ref-2'
      }
    })

    // Mock parse tx for netSpent
    const mockTx = new MockTransaction()
    mockTx.fee = 100
    mockTx.inputs = [
      {
        sourceTXID: 'bbb',
        sourceOutputIndex: 0,
        sourceTransaction: {
          outputs: [{ satoshis: 0 }]
        }
      }
    ]
    mockTx.outputs = [{ satoshis: 100 }]
    ;(MockedBSV_SDK.Transaction.fromAtomicBEEF as jest.Mock).mockReturnValue(mockTx)

    await expect(
      manager.createAction(
        {
          description: 'User tries to spend 100 + fee=100 from 0 input => netSpent=200',
          outputs: [
            {
              lockingScript: 'abc123',
              satoshis: 100,
              outputDescription: 'some out desc',
              basket: 'some-basket'
            }
          ]
        },
        'user.example.com'
      )
    ).rejects.toThrow(/Permission denied/)

    // We expect the manager to call underlying.abortAction with reference 'test-ref-2'
    expect(underlying.abortAction).toHaveBeenCalledTimes(1)
    expect(underlying.abortAction).toHaveBeenCalledWith({
      reference: 'test-ref-2'
    })
  })

  it('should throw an error if a non-admin tries signAndProcess=true', async () => {
    // Non-admin tries signAndProcess=true => manager throws
    await expect(
      manager.createAction(
        {
          description: 'Trying signAndProcess from non-admin',
          outputs: [
            {
              lockingScript: '1234',
              satoshis: 50,
              basket: 'user-basket',
              outputDescription: 'Description'
            }
          ],
          options: {
            signAndProcess: true
          }
        },
        'someuser.com'
      )
    ).rejects.toThrow(/Only the admin originator can set signAndProcess=true/)
  })

  it('should proxy signAction calls directly if invoked by the user', async () => {
    // Typically, signAction is used after createAction returns a partial signableTransaction
    // We'll confirm it passes arguments verbatim to underlying
    const result = await manager.signAction(
      {
        reference: 'my-ref',
        spends: {
          0: {
            unlockingScript: 'my-script'
          }
        }
      },
      'nonadmin.com'
    )
    expect(underlying.signAction).toHaveBeenCalledTimes(1)
    expect(underlying.signAction).toHaveBeenCalledWith(
      {
        reference: 'my-ref',
        spends: {
          0: {
            unlockingScript: 'my-script'
          }
        }
      },
      'nonadmin.com'
    )
    // returns the underlying result
    expect(result.txid).toBe('fake-txid')
  })

  it('should proxy abortAction calls directly', async () => {
    const result = await manager.abortAction({ reference: 'abort-me' }, 'someuser.com')
    expect(underlying.abortAction).toHaveBeenCalledTimes(1)
    expect(underlying.abortAction).toHaveBeenCalledWith({ reference: 'abort-me' }, 'someuser.com')
    expect(result).toEqual({ aborted: true })
  })

  /* -------------------------------------------------------------------------
   * listActions / internalizeAction
   * ----------------------------------------------------------------------- */

  it('should call listActions on the underlying wallet and decrypt metadata fields if encryptWalletMetadata=true', async () => {
    // Underlying returns some encrypted metadata
    underlying.listActions.mockResolvedValueOnce({
      totalActions: 1,
      actions: [
        {
          actionTXID: 'aaa',
          description: 'EncryptedStuff',
          inputs: [
            {
              outpoint: 'xxx.0',
              inputDescription: 'EncryptedIn'
            }
          ],
          outputs: [
            {
              lockingScript: 'deadbeef',
              outputDescription: 'EncryptedOut',
              customInstructions: 'EncryptedCustom'
            }
          ],
          labels: ['user-label']
        }
      ]
    })
    // We'll have the manager attempt to decrypt. The manager calls `underlying.decrypt`
    // which is mocked to return plaintext [42, 42, 42, 42, 42, 42, 42]. That is "asterisk-asterisk" in ASCII
    // So let's see how the manager transforms it back to a string: fromCharCode(42,42) => "**"
    // However, note that the manager's "maybeDecryptMetadata()" tries to decrypt the field
    // If it works, it returns the decrypted string. Our underlying mock decrypt => "[42,42]" => "**"
    // So let's expect the final returned fields to be "**".

    const result = await manager.listActions({ labels: ['some-label'] }, 'nonadmin.com')

    expect(underlying.listActions).toHaveBeenCalledTimes(1)
    // The manager calls ensureLabelAccess first, which triggers a protocol permission request
    // we ephemeral-grant. Then it calls underlying.listActions.
    expect(result.actions[0].description).toBe('*****') // Decrypted from [42, 42, 42, 42, 42, 42, 42]
    expect(result.actions[0].inputs![0].inputDescription).toBe('*****')
    expect(result.actions[0].outputs![0].outputDescription).toBe('*****')
    expect(result.actions[0].outputs![0].customInstructions).toBe('*****')
  })

  it('should pass internalizeAction calls to underlying, after ensuring basket permissions and encrypting customInstructions if config=on', async () => {
    await manager.internalizeAction(
      {
        tx: [],
        description: 'Internalizing outputs with basket insertion',
        outputs: [
          {
            outputIndex: 0,
            protocol: 'basket insertion',
            insertionRemittance: {
              basket: 'some-basket',
              customInstructions: 'plaintext instructions'
            }
          }
        ]
      },
      'someuser.com'
    )

    // The manager ensures basket insertion => ephemeral permission granted
    // Then it encrypts 'plaintext instructions' before passing it to underlying
    expect(underlying.internalizeAction).toHaveBeenCalledTimes(1)
    const callArgs = underlying.internalizeAction.mock.calls[0][0]
    expect(callArgs.outputs[0].insertionRemittance.customInstructions).not.toBe('plaintext instructions')
    // There's no direct check that the string is "**" or something, because it's encrypted.
    // We just confirm it was changed from the original plaintext.
  })

  /* -------------------------------------------------------------------------
   * listOutputs / relinquishOutput
   * ----------------------------------------------------------------------- */

  it('should ensure basket listing permission then call listOutputs, decrypting customInstructions', async () => {
    jest.spyOn(MockedBSV_SDK.Transaction, 'fromBEEF').mockImplementation(() => {
      const mockTx = new MockTransaction()
      // Add outputs with lockingScript
      mockTx.outputs = [
        {
          lockingScript: {
            // Ensure this matches what PushDrop.decode expects to work with
            toHex: () => 'mockLockingScriptHex'
          }
        }
      ]
      return mockTx
    })

    underlying.listOutputs.mockResolvedValue({
      totalOutputs: 1,
      outputs: [
        {
          outpoint: 'zzz.0',
          satoshis: 100,
          lockingScript: 'mockscript',
          customInstructions: 'EncryptedWeird'
        }
      ]
    })

    const result = await manager.listOutputs({ basket: 'user-basket' }, 'app.example.com')
    // manager ephemeral-grants basket permission
    expect(underlying.listOutputs).toHaveBeenCalledTimes(2)
    expect(underlying.listOutputs.mock.calls).toEqual([
      [
        {
          basket: 'admin basket-access',
          include: 'entire transactions',
          tagQueryMode: 'all',
          tags: ['originator app.example.com', 'basket user-basket']
        },
        'admin.test' // querying to see if we have permission
      ],
      [
        {
          basket: 'user-basket'
        },
        'app.example.com' // the actual underlying call
      ]
    ])
    expect(result.outputs[0].customInstructions).toBe('*****') // from [42,42] decryption
  })

  it('should ensure basket removal permission then call relinquishOutput', async () => {
    await manager.relinquishOutput(
      {
        output: 'xxx.0',
        basket: 'some-basket'
      },
      'nonadmin.com'
    )
    expect(underlying.relinquishOutput).toHaveBeenCalledTimes(1)
    expect(underlying.relinquishOutput).toHaveBeenCalledWith({ output: 'xxx.0', basket: 'some-basket' }, 'nonadmin.com')
  })

  /* -------------------------------------------------------------------------
   * getPublicKey / revealCounterpartyKeyLinkage / revealSpecificKeyLinkage
   * ----------------------------------------------------------------------- */

  it('should call getPublicKey on underlying after ensuring protocol permission', async () => {
    const result = await manager.getPublicKey(
      {
        protocolID: [1, 'test-pubkey'],
        keyID: 'my-key'
      },
      'user.example.com'
    )

    expect(underlying.getPublicKey).toHaveBeenCalledTimes(1)
    expect(underlying.getPublicKey).toHaveBeenCalledWith(
      {
        protocolID: [1, 'test-pubkey'],
        keyID: 'my-key'
      },
      'user.example.com'
    )
    expect(result.publicKey).toBe('029999...')
  })

  it('should call revealCounterpartyKeyLinkage with permission check, pass result', async () => {
    const result = await manager.revealCounterpartyKeyLinkage(
      {
        privileged: true,
        verifier: '0222aaa',
        counterparty: '02bbbccc',
        privilegedReason: 'test reason'
      },
      'user.example.com'
    )

    expect(underlying.revealCounterpartyKeyLinkage).toHaveBeenCalledTimes(1)
    expect(underlying.revealCounterpartyKeyLinkage).toHaveBeenCalledWith(
      {
        privileged: true,
        verifier: '0222aaa',
        counterparty: '02bbbccc',
        privilegedReason: 'test reason'
      },
      'user.example.com'
    )
    expect(result.prover).toBe('02abcdef...')
  })

  it('should call revealSpecificKeyLinkage with permission check, pass result', async () => {
    const result = await manager.revealSpecificKeyLinkage(
      {
        privileged: false,
        verifier: '0222ddd',
        protocolID: [2, 'special'],
        keyID: '5',
        counterparty: '022222',
        privilegedReason: 'need to check link'
      },
      'user.example.com'
    )

    expect(underlying.revealSpecificKeyLinkage).toHaveBeenCalledTimes(1)
    expect(underlying.revealSpecificKeyLinkage).toHaveBeenCalledWith(
      {
        privileged: false,
        verifier: '0222ddd',
        protocolID: [2, 'special'],
        keyID: '5',
        counterparty: '022222',
        privilegedReason: 'need to check link'
      },
      'user.example.com'
    )
    expect(result.prover).toBe('02abcdef...')
  })

  /* -------------------------------------------------------------------------
   * encrypt / decrypt / createHmac / verifyHmac / createSignature / verifySignature
   * ----------------------------------------------------------------------- */

  it('should proxy encrypt() calls after checking protocol permission', async () => {
    const result = await manager.encrypt(
      {
        protocolID: [1, 'secret-proto'],
        plaintext: [1, 2, 3],
        keyID: 'mykey'
      },
      'user.example.com'
    )

    expect(underlying.encrypt).toHaveBeenCalledTimes(1)
    expect(result.ciphertext).toEqual([42, 42, 42, 42, 42, 42, 42]) // from the mock
  })

  it('should proxy decrypt() calls after checking protocol permission', async () => {
    const result = await manager.decrypt(
      {
        protocolID: [1, 'secret-proto'],
        ciphertext: [99, 99],
        keyID: 'somekey'
      },
      'user.example.com'
    )
    expect(underlying.decrypt).toHaveBeenCalledTimes(1)
    expect(result.plaintext).toEqual([42, 42, 42, 42, 42])
  })

  it('should proxy createHmac() calls', async () => {
    const result = await manager.createHmac(
      {
        protocolID: [2, 'hmac-proto'],
        data: [11, 22],
        keyID: 'hmacKey'
      },
      'someone.com'
    )
    expect(underlying.createHmac).toHaveBeenCalledTimes(1)
    expect(result.hmac).toEqual([0xaa])
  })

  it('should proxy verifyHmac() calls', async () => {
    const result = await manager.verifyHmac(
      {
        protocolID: [2, 'hmac-proto'],
        data: [11, 22],
        hmac: [0xaa],
        keyID: 'hmacKey'
      },
      'someone.com'
    )
    expect(underlying.verifyHmac).toHaveBeenCalledTimes(1)
    expect(result.valid).toBe(true)
  })

  it('should proxy createSignature() calls (already tested the netSpent logic in createAction, but let’s double-check)', async () => {
    // We tested permission checks for signing in earlier tests, but let's confirm pass-through
    const result = await manager.createSignature(
      {
        protocolID: [1, 'sign-proto'],
        data: [10, 20],
        keyID: '1'
      },
      'user.com'
    )
    expect(underlying.createSignature).toHaveBeenCalledTimes(1)
    expect(result.signature).toEqual([0x30, 0x44])
  })

  it('should proxy verifySignature() calls', async () => {
    const result = await manager.verifySignature(
      {
        protocolID: [1, 'verify-proto'],
        data: [3, 4],
        signature: [0x30, 0x44],
        keyID: '2'
      },
      'user.com'
    )
    expect(underlying.verifySignature).toHaveBeenCalledTimes(1)
    expect(result.valid).toBe(true)
  })

  /* -------------------------------------------------------------------------
   * acquireCertificate / listCertificates / proveCertificate / relinquishCertificate
   * ----------------------------------------------------------------------- */

  it('should call acquireCertificate, verifying permission if config.seekCertificateAcquisitionPermissions=true', async () => {
    const result = await manager.acquireCertificate(
      {
        type: 'my-cert',
        certifier: '02aaaa...',
        acquisitionProtocol: 'direct',
        fields: { hello: 'world' }
      },
      'user.cert.com'
    )
    expect(underlying.acquireCertificate).toHaveBeenCalledTimes(1)
    expect(result.type).toBe('some-cert-type')
  })

  it('should call listCertificates, verifying permission if config.seekCertificateListingPermissions=true', async () => {
    const result = await manager.listCertificates(
      {
        privileged: false,
        certifiers: [],
        types: []
      },
      'some.corp'
    )
    expect(underlying.listCertificates).toHaveBeenCalledTimes(1)
    expect(result.totalCertificates).toBe(0)
  })

  it('should call proveCertificate after ensuring certificate permission', async () => {
    const result = await manager.proveCertificate(
      {
        privileged: true,
        verifier: '02vvvv',
        certificate: {
          type: 'kyc',
          subject: '02aaaa...',
          certifier: '02cccc...',
          fields: { name: 'Alice' }
        },
        fieldsToReveal: ['name']
      },
      'user.corp'
    )
    expect(underlying.proveCertificate).toHaveBeenCalledTimes(1)
    expect(result.keyringForVerifier).toBeDefined()
  })

  it('should call relinquishCertificate if config.seekCertificateRelinquishmentPermissions=true', async () => {
    const result = await manager.relinquishCertificate(
      {
        type: 'some-cert',
        serialNumber: 'raisin bran',
        certifier: '023333'
      },
      'user-abc.com'
    )
    expect(underlying.relinquishCertificate).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ relinquished: true })
  })

  /* -------------------------------------------------------------------------
   * discoverByIdentityKey / discoverByAttributes
   * ----------------------------------------------------------------------- */

  it('should call discoverByIdentityKey after ensuring identity resolution permission', async () => {
    const result = await manager.discoverByIdentityKey({ identityKey: '0222fff...' }, 'someone-trying-lookup.com')
    expect(underlying.discoverByIdentityKey).toHaveBeenCalledTimes(1)
    expect(result.certificates.length).toBe(0)
  })

  it('should call discoverByAttributes after ensuring identity resolution permission', async () => {
    const result = await manager.discoverByAttributes({ attributes: { name: 'Bob' } }, 'someone-trying-lookup.com')
    expect(underlying.discoverByAttributes).toHaveBeenCalledTimes(1)
    expect(result.certificates.length).toBe(0)
  })

  /* -------------------------------------------------------------------------
   * isAuthenticated / waitForAuthentication / getHeight / getHeaderForHeight
   * getNetwork / getVersion
   * ----------------------------------------------------------------------- */

  it('should proxy isAuthenticated without any special permission checks', async () => {
    const result = await manager.isAuthenticated({}, 'someone.com')
    expect(result.authenticated).toBe(true)
    expect(underlying.isAuthenticated).toHaveBeenCalledTimes(1)
  })

  it('should proxy waitForAuthentication without any special permission checks', async () => {
    const result = await manager.waitForAuthentication({}, 'someone.com')
    expect(result.authenticated).toBe(true)
    expect(underlying.waitForAuthentication).toHaveBeenCalledTimes(1)
  }, 30000)

  it('should proxy getHeight', async () => {
    const result = await manager.getHeight({}, 'someone.com')
    expect(result.height).toBe(777777)
    expect(underlying.getHeight).toHaveBeenCalledTimes(1)
  })

  it('should proxy getHeaderForHeight', async () => {
    const result = await manager.getHeaderForHeight({ height: 100000 }, 'someone.com')
    expect(result.header).toMatch(/000000000000abc/)
    expect(underlying.getHeaderForHeight).toHaveBeenCalledTimes(1)
  })

  it('should proxy getNetwork', async () => {
    const result = await manager.getNetwork({}, 'someone.com')
    expect(result.network).toBe('testnet')
    expect(underlying.getNetwork).toHaveBeenCalledTimes(1)
  })

  it('should proxy getVersion', async () => {
    const result = await manager.getVersion({}, 'someone.com')
    expect(result.version).toBe('vendor-1.0.0')
    expect(underlying.getVersion).toHaveBeenCalledTimes(1)
  })

  /* -------------------------------------------------------------------------
   * Error propagation from underlying
   * ----------------------------------------------------------------------- */

  it('should propagate errors from the underlying wallet calls', async () => {
    // Let's have underlying.createAction throw
    underlying.createAction.mockRejectedValueOnce(new Error('Under-wallet failure'))

    await expect(manager.createAction({ description: 'test error', outputs: [] }, 'someuser.com')).rejects.toThrow(
      /Under-wallet failure/
    )
  })
})
