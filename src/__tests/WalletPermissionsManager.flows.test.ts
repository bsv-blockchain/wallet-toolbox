import { mockUnderlyingWallet, MockedBSV_SDK } from './WalletPermissionsManager.fixtures'
import { WalletPermissionsManager, PermissionToken } from '../WalletPermissionsManager'

import { jest } from '@jest/globals'

// We mock the underlying @bsv/sdk references with our test fixtures:
jest.mock('@bsv/sdk', () => MockedBSV_SDK)

/**
 * A lightweight helper that forces the manager to never find any on-chain token.
 * We do this so we can reliably test the request flow (i.e., that it truly initiates
 * a new permission request if no token is found).
 */
function mockNoTokensFound(manager: WalletPermissionsManager) {
  jest.spyOn(manager as any, 'findProtocolToken').mockResolvedValue(undefined)
  jest.spyOn(manager as any, 'findBasketToken').mockResolvedValue(undefined)
  jest.spyOn(manager as any, 'findCertificateToken').mockResolvedValue(undefined)
  jest.spyOn(manager as any, 'findSpendingToken').mockResolvedValue(undefined)
}

describe('WalletPermissionsManager - Permission Request Flow & Active Requests', () => {
  let underlying: ReturnType<typeof mockUnderlyingWallet>
  let manager: WalletPermissionsManager

  beforeEach(() => {
    underlying = mockUnderlyingWallet()
    manager = new WalletPermissionsManager(underlying, 'admin.test.com')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  /**
   * UNIT TESTS
   */
  describe('Unit Tests: requestPermissionFlow & activeRequests map', () => {
    it('should coalesce level-2 protocol requests for the same counterparty into a single grouped permission prompt based on manifest.json', async () => {
      mockNoTokensFound(manager)

      jest.spyOn(manager as any, 'fetchManifestGroupPermissions').mockResolvedValue({
        protocolPermissions: [
          {
            protocolID: [2, 'l2-proto-A'],
            counterparty: '',
            description: 'A'
          },
          {
            protocolID: [2, 'l2-proto-B'],
            counterparty: 'peer-123',
            description: 'B'
          },
          {
            protocolID: [2, 'l2-proto-C'],
            counterparty: 'peer-999',
            description: 'C'
          },
          {
            protocolID: [1, 'l1-proto-D'],
            counterparty: 'peer-123',
            description: 'D'
          }
        ]
      })

      const groupRequestCallback = jest.fn(() => {})
      manager.bindCallback('onGroupedPermissionRequested', groupRequestCallback)

      const callA = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [2, 'l2-proto-A'],
        counterparty: 'peer-123',
        reason: 'UnitTest - L2 A',
        seekPermission: true,
        usageType: 'signing'
      })

      const callB = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [2, 'l2-proto-B'],
        counterparty: 'peer-123',
        reason: 'UnitTest - L2 B',
        seekPermission: true,
        usageType: 'signing'
      })

      await new Promise(res => setTimeout(res, 5))

      expect(groupRequestCallback).toHaveBeenCalledTimes(1)
      const callbackArg = (groupRequestCallback.mock as any).calls[0][0]
      const requestID = callbackArg.requestID
      expect(typeof requestID).toBe('string')
      expect(requestID).toMatch(/^group-peer:/)

      const activeRequests = (manager as any).activeRequests as Map<string, any>
      const queued = activeRequests.get(requestID)
      expect(queued.request.permissions.protocolPermissions.length).toBe(2)
      expect(queued.request.permissions.protocolPermissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ protocolID: [2, 'l2-proto-A'], counterparty: 'peer-123' }),
          expect.objectContaining({ protocolID: [2, 'l2-proto-B'], counterparty: 'peer-123' })
        ])
      )

      await manager.denyGroupedPermission(requestID)

      await expect(callA).rejects.toThrow(/denied/i)
      await expect(callB).rejects.toThrow(/denied/i)

      expect(activeRequests.size).toBe(0)
    })

    it('should create separate grouped permission requests for different peers (no cross-peer grouping)', async () => {
      mockNoTokensFound(manager)

      jest.spyOn(manager as any, 'fetchManifestGroupPermissions').mockResolvedValue({
        protocolPermissions: [
          {
            protocolID: [2, 'l2-proto-B'],
            counterparty: 'peer-123',
            description: 'B'
          },
          {
            protocolID: [2, 'l2-proto-C'],
            counterparty: 'peer-999',
            description: 'C'
          }
        ]
      })

      const groupRequestCallback = jest.fn(() => {})
      manager.bindCallback('onGroupedPermissionRequested', groupRequestCallback)

      const callB = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [2, 'l2-proto-B'],
        counterparty: 'peer-123',
        reason: 'UnitTest - L2 B peer-123',
        seekPermission: true,
        usageType: 'signing'
      })

      const callC = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [2, 'l2-proto-C'],
        counterparty: 'peer-999',
        reason: 'UnitTest - L2 C peer-999',
        seekPermission: true,
        usageType: 'signing'
      })

      await new Promise(res => setTimeout(res, 5))

      expect(groupRequestCallback).toHaveBeenCalledTimes(2)
      const requestID1 = (groupRequestCallback.mock as any).calls[0][0].requestID
      const requestID2 = (groupRequestCallback.mock as any).calls[1][0].requestID

      expect(requestID1).not.toBe(requestID2)
      expect(requestID1).toMatch(/^group-peer:/)
      expect(requestID2).toMatch(/^group-peer:/)

      const activeRequests = (manager as any).activeRequests as Map<string, any>
      expect(activeRequests.size).toBe(2)

      const queued1 = activeRequests.get(requestID1)
      const queued2 = activeRequests.get(requestID2)

      expect(queued1.request.permissions.protocolPermissions).toEqual(
        expect.arrayContaining([expect.objectContaining({ protocolID: [2, 'l2-proto-B'], counterparty: 'peer-123' })])
      )
      expect(queued1.request.permissions.protocolPermissions).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ protocolID: [2, 'l2-proto-C'], counterparty: 'peer-999' })])
      )

      expect(queued2.request.permissions.protocolPermissions).toEqual(
        expect.arrayContaining([expect.objectContaining({ protocolID: [2, 'l2-proto-C'], counterparty: 'peer-999' })])
      )
      expect(queued2.request.permissions.protocolPermissions).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ protocolID: [2, 'l2-proto-B'], counterparty: 'peer-123' })])
      )

      await manager.denyGroupedPermission(requestID1)
      await manager.denyGroupedPermission(requestID2)

      await expect(callB).rejects.toThrow(/denied/i)
      await expect(callC).rejects.toThrow(/denied/i)

      expect(activeRequests.size).toBe(0)
    })

    it('should coalesce parallel requests for the same resource into a single user prompt', async () => {
      // We want to test the underlying private method "requestPermissionFlow" indirectly
      // or we can test it via a public method that calls it. We'll do so via ensureProtocolPermission.

      // Force no token found => triggers a request flow
      mockNoTokensFound(manager)

      // Spy on the manager's "onProtocolPermissionRequested" callbacks
      const requestCallback = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', requestCallback)

      // Make two parallel calls for the same resource
      const callA = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [1, 'someproto'],
        counterparty: 'self',
        reason: 'UnitTest - same resource A',
        seekPermission: true,
        usageType: 'signing'
      })

      const callB = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [1, 'someproto'],
        counterparty: 'self',
        reason: 'UnitTest - same resource B',
        seekPermission: true,
        usageType: 'signing'
      })

      // Wait a short moment for the async request flow to trigger
      await new Promise(res => setTimeout(res, 5))

      // We expect only one "onProtocolPermissionRequested" event for both calls
      expect(requestCallback).toHaveBeenCalledTimes(1)

      // Now let's deny the request:
      // Grab the requestID that the manager gave us from the callback param
      const callbackArg = (requestCallback.mock as any).calls[0][0]
      const requestID = callbackArg.requestID
      expect(typeof requestID).toBe('string') // manager-generated

      // Deny the request
      await manager.denyPermission(requestID)

      // Both calls should reject
      await expect(callA).rejects.toThrow(/Permission denied/)
      await expect(callB).rejects.toThrow(/Permission denied/)

      // Confirm activeRequests map is empty after denial
      const activeRequests = (manager as any).activeRequests as Map<string, any[]>
      expect(activeRequests.size).toBe(0)
    })

    it('should generate two distinct user prompts for two different permission requests', async () => {
      // Force no tokens
      mockNoTokensFound(manager)

      // Spy on basket & protocol request callbacks
      const protocolRequestCb = jest.fn(() => {})
      const basketRequestCb = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', protocolRequestCb)
      manager.bindCallback('onBasketAccessRequested', basketRequestCb)

      // Make one call for protocol usage
      const pCall = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [1, 'proto-A'],
        counterparty: 'self',
        reason: 'Different request A',
        seekPermission: true,
        usageType: 'signing'
      })

      // Make a second call for basket usage
      const bCall = manager.ensureBasketAccess({
        originator: 'example.com',
        basket: 'some-basket',
        reason: 'Different request B',
        seekPermission: true,
        usageType: 'insertion'
      })

      // Wait a moment for them to trigger
      await new Promise(res => setTimeout(res, 5))

      // We expect one protocol request AND one basket request
      expect(protocolRequestCb).toHaveBeenCalledTimes(1)
      expect(basketRequestCb).toHaveBeenCalledTimes(1)

      // Deny protocol request
      const pReqID = (protocolRequestCb.mock as any).calls[0][0].requestID
      await manager.denyPermission(pReqID)

      // Deny basket request
      const bReqID = (basketRequestCb.mock as any).calls[0][0].requestID
      await manager.denyPermission(bReqID)

      // Both calls should have rejected
      await expect(pCall).rejects.toThrow(/Permission denied/)
      await expect(bCall).rejects.toThrow(/Permission denied/)

      // activeRequests is empty
      const activeRequests = (manager as any).activeRequests as Map<string, any[]>
      expect(activeRequests.size).toBe(0)
    })

    it('should resolve all parallel requests when permission is granted, referencing the same requestID', async () => {
      // No tokens => triggers request flow
      mockNoTokensFound(manager)

      const requestCb = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', requestCb)

      // Parallel calls
      const promiseA = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [1, 'proto-X'],
        counterparty: 'anyone',
        reason: 'Test parallel grant A',
        seekPermission: true,
        usageType: 'encrypting'
      })

      const promiseB = manager.ensureProtocolPermission({
        originator: 'example.com',
        privileged: false,
        protocolID: [1, 'proto-X'],
        counterparty: 'anyone',
        reason: 'Test parallel grant B',
        seekPermission: true,
        usageType: 'encrypting'
      })

      // Let the request event fire
      await new Promise(res => setTimeout(res, 5))
      expect(requestCb).toHaveBeenCalledTimes(1)

      // Extract the requestID from the callback
      const { requestID } = (requestCb.mock as any).calls[0][0]
      // Now we grant permission for that same requestID
      // Because ephemeral is false by default, the manager will attempt to create on-chain tokens
      // We'll mock the internal createPermissionOnChain so it doesn't blow up
      const createOnChainSpy = jest.spyOn(manager as any, 'createPermissionOnChain').mockResolvedValue(undefined)

      await manager.grantPermission({ requestID })

      // Both calls should resolve with `true` (the manager returns a boolean)
      await expect(promiseA).resolves.toBe(true)
      await expect(promiseB).resolves.toBe(true)

      // activeRequests map is empty
      const activeRequests = (manager as any).activeRequests as Map<string, any[]>
      expect(activeRequests.size).toBe(0)

      // The manager tried to create an on-chain permission token once
      expect(createOnChainSpy).toHaveBeenCalledTimes(1)
    })

    it('should reject only the matching request queue on deny if requestID is specified', async () => {
      // This scenario tests the manager's partial denial logic where we pass { requestID }
      // to only reject the queued requests with that ID, leaving others (with a different requestID)
      // in the queue.

      mockNoTokensFound(manager)

      // We do two separate calls for the same resource but at different times, resulting in separate queues.
      // Actually, the manager normally merges them into one queue if the resource is the same.
      // So let's do two different resources to ensure we get two separate keys.
      const protoCb = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', protoCb)

      // Resource 1
      const p1Promise = manager.ensureProtocolPermission({
        originator: 'siteA.com',
        privileged: false,
        protocolID: [1, 'proto-siteA'],
        counterparty: 'self',
        usageType: 'encrypting'
      })
      await new Promise(res => setTimeout(res, 5))
      const p1ReqID = (protoCb.mock as any).calls[0][0].requestID
      // At this point, resource 1 is pending in activeRequests. We'll not resolve it yet.

      // Resource 2
      const p2Promise = manager.ensureProtocolPermission({
        originator: 'siteB.com',
        privileged: false,
        protocolID: [1, 'proto-siteB'],
        counterparty: 'self',
        usageType: 'encrypting'
      })
      await new Promise(res => setTimeout(res, 5))
      // the second call triggers a second onProtocolPermissionRequested callback
      expect(protoCb).toHaveBeenCalledTimes(2)
      const p2ReqID = (protoCb.mock as any).calls[1][0].requestID

      // Deny the second request only
      await manager.denyPermission(p2ReqID)
      await expect(p2Promise).rejects.toThrow(/Permission denied/)

      // But the first request is still waiting
      const activeRequests = (manager as any).activeRequests as Map<string, any[]>
      expect(activeRequests.size).toBe(1)

      // Now let's deny the first request too
      await manager.denyPermission(p1ReqID)
      await expect(p1Promise).rejects.toThrow(/Permission denied/)

      // The queue is empty now
      expect(activeRequests.size).toBe(0)
    })
  })

  /**
   * INTEGRATION TESTS
   */
  describe('Integration Tests: ephemeral vs. persistent tokens', () => {
    it('should not create a token if ephemeral=true, so subsequent calls re-trigger the request', async () => {
      // We'll do a "protocol" permission scenario:
      mockNoTokensFound(manager)

      // Bind the request callback
      const requestCb = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', requestCb)

      // Force any on-chain creation attempt to be spied on
      const createTokenSpy = jest.spyOn(manager as any, 'createPermissionOnChain')

      // 1) Call ensureProtocolPermission => triggers request
      const pCall1 = manager.ensureProtocolPermission({
        originator: 'appdomain.com',
        privileged: false,
        protocolID: [1, 'ephemeral-proto'],
        counterparty: 'self',
        reason: 'test ephemeral #1',
        usageType: 'signing'
      })

      // Wait for request callback
      await new Promise(res => setTimeout(res, 5))
      expect(requestCb).toHaveBeenCalledTimes(1)
      const reqID1 = (requestCb.mock as any).calls[0][0].requestID

      // Grant ephemeral
      await manager.grantPermission({
        requestID: reqID1,
        ephemeral: true
      })

      // pCall1 is resolved
      await expect(pCall1).resolves.toBe(true)

      // Because ephemeral=true, we do NOT create an on-chain token
      expect(createTokenSpy).not.toHaveBeenCalled()

      // Clear cache to actually run again
      ;(manager as any).permissionCache = new Map()

      // 2) Immediately call ensureProtocolPermission again for the same resource
      // Because ephemeral usage didn't store a token, it should re-prompt.
      const pCall2 = manager.ensureProtocolPermission({
        originator: 'appdomain.com',
        privileged: false,
        protocolID: [1, 'ephemeral-proto'],
        counterparty: 'self',
        reason: 'test ephemeral #2',
        usageType: 'signing'
      })

      await new Promise(res => setTimeout(res, 5))
      // We expect a new request callback
      expect(requestCb).toHaveBeenCalledTimes(2)

      // We'll deny the second request
      const reqID2 = (requestCb.mock as any).calls[1][0].requestID
      await manager.denyPermission(reqID2)

      await expect(pCall2).rejects.toThrow(/Permission denied/)
    })

    it('should create a token if ephemeral=false, so subsequent calls do not re-trigger if unexpired', async () => {
      // We want the manager to truly create a token. We'll confirm that
      // subsequent calls for the same resource skip user prompt.

      mockNoTokensFound(manager)
      // We'll also ensure no token is found "the first time."
      // But on subsequent calls, we can mock that the manager sees the newly created token.

      // Let's spy on "createPermissionOnChain" so we can intercept the new token
      const createTokenSpy = jest.spyOn(manager as any, 'createPermissionOnChain').mockResolvedValue(undefined) // no real on-chain creation

      // Spy on "findProtocolToken" so we can simulate that the second time it's called,
      // there's a valid token. We'll do this by setting the mock to return undefined the first time,
      // and a valid token the second time (or we can just rely on the manager's logic).
      let firstFindCall = true
      jest.spyOn(manager as any, 'findProtocolToken').mockImplementation(async () => {
        if (firstFindCall) {
          firstFindCall = false
          return undefined // first time triggers request
        }
        // second time => pretend we found a valid token
        const mockToken: PermissionToken = {
          tx: [],
          txid: 'abcdef',
          outputIndex: 0,
          outputScript: '00',
          satoshis: 1,
          originator: 'persistentdomain.com',
          expiry: Math.floor(Date.now() / 1000) + 3600, // unexpired
          privileged: false,
          protocol: 'persist-proto',
          securityLevel: 1,
          counterparty: 'self'
        }
        return mockToken
      })

      // We'll observe the request callback
      const requestCb = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', requestCb)

      // 1) First call => no token => triggers request
      const call1 = manager.ensureProtocolPermission({
        originator: 'persistentdomain.com',
        privileged: false,
        protocolID: [1, 'persist-proto'],
        counterparty: 'self',
        reason: 'test persistent #1',
        usageType: 'signing'
      })
      await new Promise(res => setTimeout(res, 5))
      expect(requestCb).toHaveBeenCalledTimes(1)

      // Grant ephemeral=false => triggers createPermissionOnChain
      const reqID = (requestCb.mock as any).calls[0][0].requestID
      await manager.grantPermission({ requestID: reqID, ephemeral: false })
      await expect(call1).resolves.toBe(true)

      expect(createTokenSpy).toHaveBeenCalledTimes(1)

      // 2) Second call => the manager should find the token we just "created" => no request prompt
      const call2 = manager.ensureProtocolPermission({
        originator: 'persistentdomain.com',
        privileged: false,
        protocolID: [1, 'persist-proto'],
        counterparty: 'self',
        reason: 'test persistent #2',
        usageType: 'signing'
      })

      // We do not expect a new user prompt => requestCb remains at 1
      await new Promise(res => setTimeout(res, 5))
      expect(requestCb).toHaveBeenCalledTimes(1)

      // The second call should resolve immediately, no prompt
      await expect(call2).resolves.toBe(true)
    })

    it('should handle renewal if the found token is expired, passing previousToken in the request', async () => {
      // We'll test the "renewal" flow:
      // If the manager finds a token but it's expired, it sets { renewal: true, previousToken } in the request.

      // We'll mock findProtocolToken to return an expired token
      const expiredToken: PermissionToken = {
        tx: [],
        txid: 'expiredTxid123',
        outputIndex: 0,
        outputScript: '76a914xxxx...88ac',
        satoshis: 1,
        originator: 'renewme.com',
        expiry: Math.floor(Date.now() / 1000) - 100, // in the past
        privileged: false,
        protocol: 'renew-proto',
        securityLevel: 1,
        counterparty: 'self'
      }
      jest.spyOn(manager as any, 'findProtocolToken').mockResolvedValue(expiredToken)

      // Spy on request callback
      const requestCb = jest.fn(() => {})
      manager.bindCallback('onProtocolPermissionRequested', requestCb)

      // We'll also spy on "renewPermissionOnChain" to see if it's called
      const renewSpy = jest.spyOn(manager as any, 'renewPermissionOnChain').mockResolvedValue(undefined)

      // Call ensureProtocolPermission => sees expired token => triggers request with renewal
      const promise = manager.ensureProtocolPermission({
        originator: 'renewme.com',
        privileged: false,
        protocolID: [1, 'renew-proto'],
        counterparty: 'self',
        reason: 'test renewal',
        usageType: 'encrypting'
      })

      // Wait for request callback
      await new Promise(res => setTimeout(res, 10))
      expect(requestCb).toHaveBeenCalledTimes(1)

      // Confirm the callback param includes `renewal=true` and `previousToken=expiredToken`
      const { renewal, previousToken } = (requestCb.mock as any).calls[0][0]
      expect(renewal).toBe(true)
      expect(previousToken.txid).toBe('expiredTxid123')

      // Grant ephemeral=false => manager calls renewPermissionOnChain
      const { requestID } = (requestCb.mock as any).calls[0][0]
      await manager.grantPermission({ requestID, ephemeral: false })

      await expect(promise).resolves.toBe(true)
      expect(renewSpy).toHaveBeenCalledTimes(1)
      // The first arg is the old token, second is request, etc.
      expect(renewSpy).toHaveBeenCalledWith(
        expiredToken,
        expect.objectContaining({ originator: 'renewme.com' }),
        expect.any(Number),
        undefined
      )
    })
  })
})
