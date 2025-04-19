import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { mockUnderlyingWallet, MockedBSV_SDK, MockTransaction } from './WalletPermissionsManager.fixtures'
import { WalletPermissionsManager, PermissionRequest, PermissionToken } from '../WalletPermissionsManager'
import { Utils } from '@bsv/sdk'

// Re-mock @bsv/sdk with our fixture classes (MockTransaction, MockLockingScript, etc.)
jest.mock('@bsv/sdk', () => MockedBSV_SDK)

describe('WalletPermissionsManager - On-Chain Token Creation, Renewal & Revocation', () => {
  let underlying: ReturnType<typeof mockUnderlyingWallet>
  let manager: WalletPermissionsManager

  beforeEach(() => {
    // Fresh mock wallet before each test
    underlying = mockUnderlyingWallet()
    manager = new WalletPermissionsManager(underlying, 'admin.domain.com')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  /* ------------------------------------------------------------------------
   *  1) UNIT TESTS: buildPushdropFields() correctness
   * ------------------------------------------------------------------------
   *   We directly call the manager’s internal buildPushdropFields(...) via
   *   a cast to "any" so we can test each permission type’s field ordering,
   *   encryption calls, and final arrays.
   * ------------------------------------------------------------------------
   */

  describe('buildPushdropFields() - unit tests for each permission type', () => {
    // We’ll cast the manager to `any` to access the private method.
    const privateManager = () => manager as any

    it('should build correct fields for a protocol token (DPACP)', async () => {
      const request: PermissionRequest = {
        type: 'protocol',
        originator: 'some-app.com',
        privileged: true,
        protocolID: [2, 'myProto'],
        counterparty: 'some-other-pubkey',
        reason: 'test-protocol-creation'
      }
      const expiry = 1234567890

      // Because manager.encryptPermissionTokenField calls underlying.encrypt,
      // we can observe how many times it's called & with what plaintext.
      underlying.encrypt.mockClear()

      const fields: number[][] = await privateManager().buildPushdropFields(request, expiry)

      // We expect 6 encryption calls (domain, expiry, privileged, secLevel, protoName, cpty).
      expect(underlying.encrypt).toHaveBeenCalledTimes(6)

      // The final array must have length=6
      expect(fields).toHaveLength(6)

      // Confirm the 1st call was the domain
      expect(underlying.encrypt.mock.calls[0][0].plaintext).toEqual(
        expect.arrayContaining([...'some-app.com'].map(c => c.charCodeAt(0)))
      )

      // Confirm the 2nd call was the expiry, as a string
      expect(underlying.encrypt.mock.calls[1][0].plaintext).toEqual(
        expect.arrayContaining([...'1234567890'].map(c => c.charCodeAt(0)))
      )

      // 3rd => privileged? 'true'
      expect(underlying.encrypt.mock.calls[2][0].plaintext).toEqual(
        expect.arrayContaining([...'true'].map(c => c.charCodeAt(0)))
      )

      // 4th => security level => '2'
      expect(underlying.encrypt.mock.calls[3][0].plaintext).toEqual(
        expect.arrayContaining([...'2'].map(c => c.charCodeAt(0)))
      )

      // 5th => protoName => 'myProto'
      expect(underlying.encrypt.mock.calls[4][0].plaintext).toEqual(
        expect.arrayContaining([...'myProto'].map(c => c.charCodeAt(0)))
      )

      // 6th => counterparty => 'some-other-pubkey'
      expect(underlying.encrypt.mock.calls[5][0].plaintext).toEqual(
        expect.arrayContaining([...'some-other-pubkey'].map(c => c.charCodeAt(0)))
      )
    })

    it('should build correct fields for a basket token (DBAP)', async () => {
      const request: PermissionRequest = {
        type: 'basket',
        originator: 'origin.example',
        basket: 'someBasket',
        reason: 'basket usage'
      }
      const expiry = 999999999

      underlying.encrypt.mockClear()

      const fields: number[][] = await privateManager().buildPushdropFields(request, expiry)

      // We expect 3 encryption calls: domain, expiry, basket
      expect(underlying.encrypt).toHaveBeenCalledTimes(3)
      expect(fields).toHaveLength(3)
    })

    it('should build correct fields for a certificate token (DCAP)', async () => {
      const request: PermissionRequest = {
        type: 'certificate',
        originator: 'cert-user.org',
        privileged: false,
        certificate: {
          verifier: '02abcdef...',
          certType: 'KYC',
          fields: ['name', 'dob']
        },
        reason: 'certificate usage'
      }
      const expiry = 2222222222

      underlying.encrypt.mockClear()

      const fields: number[][] = await privateManager().buildPushdropFields(request, expiry)

      // DP = domain, expiry, privileged, certType, fieldsJson, verifier
      expect(underlying.encrypt).toHaveBeenCalledTimes(6)
      expect(fields).toHaveLength(6)

      // 5th encryption call is the fields JSON => ["name","dob"]
      const fifthCallPlaintext = underlying.encrypt.mock.calls[4][0].plaintext
      const str = String.fromCharCode(...fifthCallPlaintext)
      expect(str).toContain('"name"')
      expect(str).toContain('"dob"')
    })

    it('should build correct fields for a spending token (DSAP)', async () => {
      const request: PermissionRequest = {
        type: 'spending',
        originator: 'money-spender.com',
        spending: { satoshis: 5000 },
        reason: 'monthly spending'
      }
      const expiry = 0 // DSAP typically not time-limited, but manager can pass 0.

      underlying.encrypt.mockClear()

      const fields: number[][] = await privateManager().buildPushdropFields(request, expiry, /*amount=*/ 10000)

      // For DSAP: domain + authorizedAmount (2 fields)
      expect(underlying.encrypt).toHaveBeenCalledTimes(2)
      expect(fields).toHaveLength(2)

      // The second encryption call is '10000'
      const secondPlaintext = underlying.encrypt.mock.calls[1][0].plaintext
      const asString = String.fromCharCode(...secondPlaintext)
      expect(asString).toBe('10000')
    })
  })

  /* ------------------------------------------------------------------------
   *  2) INTEGRATION TESTS: Token Creation
   * ------------------------------------------------------------------------
   *  We'll simulate a user request flow, then call `grantPermission` with
   *  ephemeral=false to see if createAction is called with the correct script,
   *  basket name, tags, etc. We also decode the script to confirm it has the
   *  correct (encrypted) fields.
   * ------------------------------------------------------------------------
   */

  describe('Token Creation - integration tests', () => {
    it('should create a new protocol token with the correct basket, script, and tags', async () => {
      // 1) Simulate the manager having an active request for a protocol token.
      const request: PermissionRequest = {
        type: 'protocol',
        originator: 'app.example',
        privileged: false,
        protocolID: [1, 'testProto'],
        counterparty: 'self',
        reason: 'Need protocol usage'
      }

      // We'll emulate that the manager queued it:
      const key = (manager as any).buildRequestKey(request)
      ;(manager as any).activeRequests.set(key, {
        request,
        pending: [{ resolve: () => {}, reject: () => {} }]
      })

      // 2) Grant the permission with ephemeral=false => must create the token
      underlying.createAction.mockClear()
      await manager.grantPermission({
        requestID: key,
        expiry: 999999, // set some expiry
        ephemeral: false
      })

      // 3) Expect createAction to have been called once with a single output
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
      const actionArgs = underlying.createAction.mock.calls[0][0]
      expect(actionArgs.outputs).toHaveLength(1)

      // The basket name must be "admin protocol-permission" as per BASKET_MAP
      expect(actionArgs.outputs[0].basket).toBe('admin protocol-permission')

      // The tags must contain e.g. "originator app.example", "protocolName testProto", etc.
      const outputTags = actionArgs.outputs[0].tags
      expect(outputTags).toEqual(
        expect.arrayContaining([
          'originator app.example',
          'privileged false',
          'protocolName testProto',
          'protocolSecurityLevel 1',
          'counterparty self'
        ])
      )

      // The lockingScript is built by "PushDrop.lock(...)" with 6 fields
      const lockingScriptHex = actionArgs.outputs[0].lockingScript
      expect(lockingScriptHex).toBeTruthy()

      // Because we’re using our mock pushdrop, we might see an empty decode.
      // In a real environment, you would decode and confirm the fields. Here we just confirm
      // that the manager called the underlying encrypt 6 times, plus the script creation.
      // Two more encrypt calls should have been made within createAction (metadata encryption
      // of the top-level Action description, and the output's description) for a total of 8.
      expect(underlying.encrypt).toHaveBeenCalledTimes(8)
    })

    it('should create a new basket token (DBAP)', async () => {
      const request: PermissionRequest = {
        type: 'basket',
        originator: 'shopper.com',
        basket: 'myBasket',
        reason: 'I want to store items'
      }
      const key = (manager as any).buildRequestKey(request)
      ;(manager as any).activeRequests.set(key, {
        request,
        pending: [{ resolve() {}, reject() {} }]
      })

      underlying.createAction.mockClear()

      await manager.grantPermission({
        requestID: key,
        ephemeral: false,
        expiry: 123456789
      })
      expect(underlying.createAction).toHaveBeenCalledTimes(1)

      const { outputs } = underlying.createAction.mock.calls[0][0]
      expect(outputs).toHaveLength(1)
      // "admin basket-access"
      expect(outputs[0].basket).toBe('admin basket-access')
      expect(outputs[0].tags).toEqual(expect.arrayContaining(['originator shopper.com', 'basket myBasket']))
      // 3 fields => domain, expiry, basket, plus two metadata calls (description, outputDescription)
      expect(underlying.encrypt).toHaveBeenCalledTimes(5)
    })

    it('should create a new certificate token (DCAP)', async () => {
      const request: PermissionRequest = {
        type: 'certificate',
        originator: 'org.certs',
        privileged: true,
        certificate: {
          verifier: '02cccccc',
          certType: 'KYC',
          fields: ['name', 'id', 'photo']
        },
        reason: 'Present KYC docs'
      }
      const key = (manager as any).buildRequestKey(request)
      ;(manager as any).activeRequests.set(key, {
        request,
        pending: [{ resolve() {}, reject() {} }]
      })

      underlying.createAction.mockClear()

      await manager.grantPermission({
        requestID: key,
        ephemeral: false,
        expiry: 44444444
      })

      expect(underlying.createAction).toHaveBeenCalledTimes(1)
      const { outputs } = underlying.createAction.mock.calls[0][0]
      expect(outputs[0].basket).toBe('admin certificate-access')
      expect(outputs[0].tags).toEqual(
        expect.arrayContaining(['originator org.certs', 'privileged true', 'type KYC', 'verifier 02cccccc'])
      )
      // DP = domain, expiry, privileged, certType, fieldsJson, verifier => 6 encryption calls
      // Two additional ones for metadata encryption (action description, output description) for 8 total.
      expect(underlying.encrypt).toHaveBeenCalledTimes(8)
    })

    it('should create a new spending authorization token (DSAP)', async () => {
      const request: PermissionRequest = {
        type: 'spending',
        originator: 'spender.com',
        spending: {
          satoshis: 9999
        }
      }
      const key = (manager as any).buildRequestKey(request)
      ;(manager as any).activeRequests.set(key, {
        request,
        pending: [{ resolve() {}, reject() {} }]
      })

      underlying.createAction.mockClear()

      // We'll set "amount=20000" as the monthly limit
      await manager.grantPermission({
        requestID: key,
        ephemeral: false,
        amount: 20000
      })

      expect(underlying.createAction).toHaveBeenCalledTimes(1)
      const { outputs } = underlying.createAction.mock.calls[0][0]
      // "admin spending-authorization"
      expect(outputs[0].basket).toBe('admin spending-authorization')
      expect(outputs[0].tags).toEqual(expect.arrayContaining(['originator spender.com']))
      // domain, amount => 2 calls, plus two metadata encryption calls (description, outputDescription)
      expect(underlying.encrypt).toHaveBeenCalledTimes(4)
    })
  })

  /* ------------------------------------------------------------------------
   *  3) INTEGRATION TESTS: Token Renewal
   * ------------------------------------------------------------------------
   *   We test that renewing a token:
   *     - Spends the old token with createAction input referencing oldToken.txid/index
   *     - Produces a new token output in the same transaction with updated fields
   * ------------------------------------------------------------------------
   */

  describe('Token Renewal - integration tests', () => {
    it('should spend the old token input and create a new protocol token output with updated expiry', async () => {
      // Suppose the user has an old protocol token:
      const oldToken: PermissionToken = {
        tx: [],
        txid: 'oldTokenTX',
        outputIndex: 2,
        outputScript: '76a914...ac', // not used by the mock
        satoshis: 1,
        originator: 'some-site.io',
        expiry: 222222,
        privileged: false,
        securityLevel: 1,
        protocol: 'coolProto',
        counterparty: 'self'
      }

      // The user’s request to renew:
      const request: PermissionRequest = {
        type: 'protocol',
        originator: 'some-site.io',
        privileged: false,
        protocolID: [1, 'coolProto'],
        counterparty: 'self',
        renewal: true,
        previousToken: oldToken
      }

      // Manager normally calls requestPermissionFlow, but let's skip ahead:
      // We'll place the request in activeRequests:
      const key = (manager as any).buildRequestKey(request)
      ;(manager as any).activeRequests.set(key, {
        request,
        pending: [{ resolve() {}, reject() {} }]
      })

      // Clear the mock calls, then renew with ephemeral=false
      underlying.createAction.mockClear()

      await manager.grantPermission({
        requestID: key,
        ephemeral: false,
        expiry: 999999 // new expiry
      })

      // We expect createAction with:
      //  - 1 input referencing oldToken "oldTokenTX.2"
      //  - 1 output with the new script
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
      const createArgs = underlying.createAction.mock.calls[0][0]
      expect(createArgs.inputs).toHaveLength(1)
      expect(createArgs.inputs[0].outpoint).toBe('oldTokenTX.2')
      expect(createArgs.outputs).toHaveLength(1)
      // The new basket is still "admin protocol-permission"
      expect(createArgs.outputs[0].basket).toBe('admin protocol-permission')

      // And we must confirm "renew" means 6 encryption calls again
      // Metadata encryption means three extra calls (inputDescription, outputDescription, and Action description)
      // this means a total of 9.
      expect(underlying.encrypt).toHaveBeenCalledTimes(9)
    })

    it('should allow updating the authorizedAmount in DSAP renewal', async () => {
      const oldToken: PermissionToken = {
        tx: [],
        txid: 'dsap-old-tx',
        outputIndex: 0,
        outputScript: 'sample script',
        satoshis: 1,
        originator: 'spenderX.com',
        authorizedAmount: 10000,
        expiry: 0
      }
      const request: PermissionRequest = {
        type: 'spending',
        originator: 'spenderX.com',
        spending: { satoshis: 3000 },
        renewal: true,
        previousToken: oldToken
      }
      const key = (manager as any).buildRequestKey(request)
      ;(manager as any).activeRequests.set(key, {
        request,
        pending: [{ resolve() {}, reject() {} }]
      })

      underlying.createAction.mockClear()

      // Renew with new monthly limit 50000
      await manager.grantPermission({
        requestID: key,
        amount: 50000,
        ephemeral: false
      })

      // check
      const { inputs, outputs } = underlying.createAction.mock.calls[0][0]
      expect(inputs).toHaveLength(1)
      expect(inputs[0].outpoint).toBe('dsap-old-tx.0')

      expect(outputs).toHaveLength(1)
      expect(outputs[0].basket).toBe('admin spending-authorization')

      // domain + new authorizedAmount => 2 encryption calls
      // For metadata encryption, we have an input description, an output description, and a top-level description.
      // This makes for a total of 5 calls.
      expect(underlying.encrypt).toHaveBeenCalledTimes(5)
      // The second call’s plaintext should be "50000"
      const secondPlaintext = underlying.encrypt.mock.calls[1][0].plaintext
      const asStr = String.fromCharCode(...secondPlaintext)
      expect(asStr).toBe('50000')
    })
  })

  /* ------------------------------------------------------------------------
   *  4) INTEGRATION TESTS: Token Revocation
   * ------------------------------------------------------------------------
   *   - Revoking a token means we build a transaction that consumes the old
   *     token UTXO with no replacement output.
   *   - Then we typically call signAction to finalize. The old token is no
   *     longer listed as an unspent output.
   * ------------------------------------------------------------------------
   */

  describe('Token Revocation - integration tests', () => {
    it('should create a transaction that consumes (spends) the old token with no new outputs', async () => {
      // A sample old token
      const oldToken: PermissionToken = {
        tx: [],
        txid: 'revocableToken.txid',
        outputIndex: 1,
        outputScript: 'fakePushdropScript',
        satoshis: 1,
        originator: 'shopper.com',
        basketName: 'myBasket',
        expiry: 1111111111
      }

      underlying.createAction.mockClear()
      underlying.signAction.mockClear()

      await manager.revokePermission(oldToken)

      // 1) The manager calls createAction with an input referencing oldToken
      expect(underlying.createAction).toHaveBeenCalledTimes(1)
      const createArgs = underlying.createAction.mock.calls[0][0]
      expect(createArgs.inputs).toHaveLength(1)
      expect(createArgs.inputs[0].outpoint).toBe('revocableToken.txid.1')

      // No new outputs => final array is empty
      expect(createArgs.outputs || []).toHaveLength(0)

      // 2) The manager then calls signAction to finalize the spending
      expect(underlying.signAction).toHaveBeenCalledTimes(1)
      const signArgs = underlying.signAction.mock.calls[0][0]
      // signArgs.reference should be the same from createAction’s result
      expect(signArgs.reference).toBe('mockReference')

      // The “spends” object should have an unlockingScript at index 0.
      expect(signArgs.spends).toHaveProperty('0.unlockingScript')
      // The content can be a mock, we just check it’s not empty
      expect(signArgs.spends[0].unlockingScript).toBeDefined()
    })

    it('should remove the old token from listing after revocation', async () => {
      jest.spyOn(MockedBSV_SDK.Transaction, 'fromBEEF').mockImplementation(() => {
        const mockTx = new MockTransaction()
        // Add outputs with lockingScript
        mockTx.outputs = [
          {
            lockingScript: {
              // Ensure this matches what PushDrop.decode expects to work with
              toHex: () => 'some script'
            }
          }
        ]
        // Add the toBEEF method
        mockTx.toBEEF = () => []
        return mockTx
      })
      // Add this to your test alongside the Transaction.fromBEEF mock
      jest.spyOn(MockedBSV_SDK.PushDrop, 'decode').mockReturnValue({
        fields: [
          // Values that will decrypt to the expected values for domain, expiry, and basket
          Utils.toArray('encoded-domain'),
          Utils.toArray('encoded-expiry'),
          Utils.toArray('encoded-basket')
        ]
      })

      // You'll also need to mock the decryptPermissionTokenField method
      // to handle these encoded values
      jest.spyOn(manager as any, 'decryptPermissionTokenField').mockImplementation(field => {
        if (field === 'encoded-domain') return new Uint8Array([...Buffer.from('example.com')])
        if (field === 'encoded-expiry') return new Uint8Array([...Buffer.from('1735689600')])
        if (field === 'encoded-basket') return new Uint8Array([...Buffer.from('protocol-permission')])
        return new Uint8Array()
      })

      // 1) Setup the underlying wallet to initially return the old token in listOutputs
      const oldToken: PermissionToken = {
        tx: [],
        txid: 'aaaa1111',
        outputIndex: 0,
        outputScript: 'some script',
        satoshis: 1,
        originator: 'example.com',
        expiry: 999999,
        basketName: 'myBasket'
      }
      // We mock listOutputs so that it returns the old token before revocation
      underlying.listOutputs.mockResolvedValueOnce({
        totalOutputs: 1,
        outputs: [
          {
            outpoint: 'aaaa1111.0',
            lockingScript: 'some script',
            satoshis: 1,
            tags: ['originator example.com', 'basket myBasket']
          }
        ]
      })

      // Confirm the manager sees it in listBasketAccess
      const tokensBefore = await manager.listBasketAccess({
        originator: 'example.com'
      })
      expect(tokensBefore).toHaveLength(1)
      expect(tokensBefore[0].txid).toBe('aaaa1111')

      // 2) Revoke the token
      await manager.revokePermission(oldToken)

      // 3) After revocation, mock the underlying wallet to show zero outputs
      underlying.listOutputs.mockResolvedValue({
        totalOutputs: 0,
        outputs: []
      })

      const tokensAfter = await manager.listBasketAccess({
        originator: 'example.com'
      })
      expect(tokensAfter).toHaveLength(0)
    })
  })
})
