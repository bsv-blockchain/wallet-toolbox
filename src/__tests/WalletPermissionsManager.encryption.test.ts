import { mockUnderlyingWallet, MockedBSV_SDK, MockTransaction } from './WalletPermissionsManager.fixtures'
import { WalletPermissionsManager } from '../WalletPermissionsManager'
import { jest } from '@jest/globals'
import { Utils } from '@bsv/sdk'

jest.mock('@bsv/sdk', () => MockedBSV_SDK)

describe('WalletPermissionsManager - Metadata Encryption & Decryption', () => {
  let underlying: ReturnType<typeof mockUnderlyingWallet>

  beforeEach(() => {
    // Create a fresh underlying mock wallet before each test
    underlying = mockUnderlyingWallet()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Unit Tests for metadata encryption helpers', () => {
    it('should call underlying.encrypt() with the correct protocol and key when encryptWalletMetadata=true', async () => {
      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: true
      })

      const plaintext = 'Hello, world!'
      await manager['maybeEncryptMetadata'](plaintext)

      // We expect underlying.encrypt() to have been called exactly once
      expect(underlying.encrypt).toHaveBeenCalledTimes(1)

      // Check that the call was with the correct protocol ID and key
      expect(underlying.encrypt).toHaveBeenCalledWith(
        {
          plaintext: expect.any(Array), // byte array version of 'Hello, world!'
          protocolID: [2, 'admin metadata encryption'],
          keyID: '1'
        },
        'admin.domain.com'
      )
    })

    it('should NOT call underlying.encrypt() if encryptWalletMetadata=false', async () => {
      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: false
      })

      const plaintext = 'No encryption needed!'
      const result = await manager['maybeEncryptMetadata'](plaintext)

      expect(result).toBe(plaintext)
      expect(underlying.encrypt).not.toHaveBeenCalled()
    })

    it('should call underlying.decrypt() with correct protocol and key, returning plaintext on success', async () => {
      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: true
      })

      // Underlying decrypt mock returns { plaintext: [42, 42] } by default
      // which would become "**" if using our ASCII interpretation
      ;(underlying.decrypt as any).mockResolvedValueOnce({
        plaintext: [72, 105] // 'Hi'
      })

      const ciphertext = Utils.toBase64(Utils.toArray('random-string-representing-ciphertext'))
      const result = await manager['maybeDecryptMetadata'](ciphertext)

      // We expect underlying.decrypt() to have been called
      expect(underlying.decrypt).toHaveBeenCalledTimes(1)
      expect(underlying.decrypt).toHaveBeenCalledWith(
        {
          ciphertext: expect.any(Array), // byte array version of ciphertext
          protocolID: [2, 'admin metadata encryption'],
          keyID: '1'
        },
        'admin.domain.com'
      )

      // The manager returns the decrypted UTF-8 string
      expect(result).toBe('Hi')
    })

    it('should fallback to original string if underlying.decrypt() fails', async () => {
      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: true
      })

      // Make underlying.decrypt() throw an error to simulate failure
      ;(underlying.decrypt as any).mockImplementationOnce(() => {
        throw new Error('Decryption error')
      })

      const ciphertext = 'this-was-not-valid-for-decryption'
      const result = await manager['maybeDecryptMetadata'](ciphertext)

      // The manager should return the original ciphertext if decryption throws
      expect(result).toBe(ciphertext)
    })
  })

  describe('Integration Tests for createAction + listActions (round-trip encryption)', () => {
    it('should encrypt metadata fields in createAction when encryptWalletMetadata=true, then decrypt them in listActions', async () => {
      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: true
      })
      manager.bindCallback('onSpendingAuthorizationRequested', x => {
        manager.grantPermission({ requestID: x.requestID, ephemeral: true })
      })

      // We prepare an action with multiple metadata fields
      const actionDescription = 'User Action #1: Doing something important'
      const inputDesc = 'Some input desc'
      const outputDesc = 'Some output desc'
      const customInstr = 'Some custom instructions'

      // Our createAction call
      await manager.createAction(
        {
          description: actionDescription,
          inputs: [
            {
              outpoint: '0231.0',
              unlockingScriptLength: 73,
              inputDescription: inputDesc
            }
          ],
          outputs: [
            {
              lockingScript: '561234',
              satoshis: 500,
              outputDescription: outputDesc,
              customInstructions: customInstr
            }
          ]
        },
        'nonadmin.com'
      )

      // 1) Confirm underlying.encrypt() was called for each field that is non-empty:
      //    - description
      //    - inputDescription
      //    - outputDescription
      //    - customInstructions
      // (We can't be certain how many times exactly, but we can check that it was at least 4.)
      expect(underlying.encrypt).toHaveBeenCalledTimes(4)

      // 2) Now we simulate listing actions. We'll have the manager call underlying.listActions.
      //    Our mock underlying wallet returns an empty array by default, so let's override it
      //    to return the "encrypted" data that the manager gave it.
      //    But the manager doesn't store that data in the underlying wallet mock automatically.
      //    We'll just pretend that the wallet returns some data, and ensure the manager tries to decrypt it.
      ;(underlying.listActions as any).mockResolvedValueOnce({
        totalActions: 1,
        actions: [
          {
            description: Utils.toBase64(Utils.toArray('fake-encrypted-string-for-description')),
            inputs: [
              {
                outpoint: 'txid1.0',
                inputDescription: Utils.toBase64(Utils.toArray('fake-encrypted-string-for-inputDesc'))
              }
            ],
            outputs: [
              {
                lockingScript: 'OP_RETURN 1234',
                satoshis: 500,
                outputDescription: Utils.toBase64(Utils.toArray('fake-encrypted-string-for-outputDesc')),
                customInstructions: Utils.toBase64(Utils.toArray('fake-encrypted-string-for-customInstr'))
              }
            ]
          }
        ]
      })

      // Also mock decrypt calls to simulate a correct round-trip
      const decryptMock = underlying.decrypt as any
      decryptMock.mockResolvedValueOnce({
        plaintext: Array.from(actionDescription).map(c => c.charCodeAt(0))
      })
      decryptMock.mockResolvedValueOnce({
        plaintext: Array.from(inputDesc).map(c => c.charCodeAt(0))
      })
      decryptMock.mockResolvedValueOnce({
        plaintext: Array.from(outputDesc).map(c => c.charCodeAt(0))
      })
      decryptMock.mockResolvedValueOnce({
        plaintext: Array.from(customInstr).map(c => c.charCodeAt(0))
      })

      const result = await (manager as any).listActions({}, 'nonadmin.com')

      // We should get exactly 1 action
      expect(result.actions.length).toBe(1)
      const action = result.actions[0]

      // The manager is expected to have decrypted each field
      expect(action.description).toBe(actionDescription)
      expect(action.inputs[0].inputDescription).toBe(inputDesc)
      expect(action.outputs[0].outputDescription).toBe(outputDesc)
      expect(action.outputs[0].customInstructions).toBe(customInstr)
    })

    it('should not encrypt metadata if encryptWalletMetadata=false, storing and retrieving plaintext', async () => {
      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: false
      })
      manager.bindCallback('onSpendingAuthorizationRequested', x => {
        manager.grantPermission({ requestID: x.requestID, ephemeral: true })
      })

      const actionDescription = 'Plaintext action description'
      const inputDesc = 'Plaintext input desc'
      const outputDesc = 'Plaintext output desc'
      const customInstr = 'Plaintext instructions'
      await manager.createAction(
        {
          description: actionDescription,
          inputs: [
            {
              outpoint: '9876.0',
              unlockingScriptLength: 73,
              inputDescription: inputDesc
            }
          ],
          outputs: [
            {
              lockingScript: 'ABCD',
              satoshis: 123,
              outputDescription: outputDesc,
              customInstructions: customInstr
            }
          ]
        },
        'nonadmin.com'
      )

      // Because encryption is disabled, underlying.encrypt() is not called
      expect(underlying.encrypt).not.toHaveBeenCalled()

      // Simulate that the wallet actually stored them in plaintext and is returning them as-is
      ;(underlying.listActions as any).mockResolvedValue({
        totalActions: 1,
        actions: [
          {
            description: actionDescription,
            inputs: [
              {
                outpoint: '0123.0',
                inputDescription: inputDesc
              }
            ],
            outputs: [
              {
                lockingScript: 'ABCD',
                satoshis: 123,
                outputDescription: outputDesc,
                customInstructions: customInstr
              }
            ]
          }
        ]
      })

      // Decrypt is still called, because we try to decrypt regardless of whether encryption is enabled.
      // This allows us to disable it on a wallet that had it in the past. The result is that when not encrypted,
      // the plaintext is returned if decryption fails. If it was encrypted from metadata encryption being enabled in
      // the past (even when not enabled now), we will still decrypt and see the correct plaintext rather than garbage.
      // To simulate, we make decryption pass through.
      underlying.decrypt.mockImplementation(x => x)
      const listResult = await (manager as any).listActions({}, 'nonadmin.com')
      expect(underlying.decrypt).toHaveBeenCalledTimes(3)

      // Confirm the returned data is the same as originally provided (plaintext)
      const [first] = listResult.actions
      expect(first.description).toBe(actionDescription)
      expect(first.inputs[0].inputDescription).toBe(inputDesc)
      expect(first.outputs[0].outputDescription).toBe(outputDesc)
      expect(first.outputs[0].customInstructions).toBe(customInstr)
    })
  })

  describe('Integration Test for listOutputs decryption', () => {
    it('should decrypt customInstructions in listOutputs if encryptWalletMetadata=true', async () => {
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

      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: true
      })
      manager.bindCallback('onBasketAccessRequested', x => {
        manager.grantPermission({ requestID: x.requestID, ephemeral: true })
      })

      // Suppose we have an output with custom instructions that was stored encrypted
      ;(underlying.listOutputs as any).mockResolvedValue({
        totalOutputs: 1,
        outputs: [
          {
            outpoint: 'fakeTxid.0',
            satoshis: 999,
            lockingScript: 'OP_RETURN something',
            basket: 'some-basket',
            customInstructions: Utils.toBase64(Utils.toArray('fake-encrypted-instructions-string'))
          }
        ]
      })

      const originalInstr = 'Please do not reveal this data.'
      // We'll mock decrypt() to interpret 'fake-encrypted-instructions-string' as a success
      ;(underlying.decrypt as any).mockResolvedValueOnce({
        plaintext: Array.from(originalInstr).map(ch => ch.charCodeAt(0))
      })

      const outputsResult = await manager.listOutputs(
        {
          basket: 'some-basket'
        },
        'some-origin.com'
      )

      expect(outputsResult.outputs.length).toBe(1)
      expect(outputsResult.outputs[0].customInstructions).toBe(originalInstr)

      // Confirm we tried to decrypt
      expect(underlying.decrypt).toHaveBeenCalledTimes(1)
      expect(underlying.decrypt).toHaveBeenCalledWith(
        {
          ciphertext: expect.any(Array),
          protocolID: [2, 'admin metadata encryption'],
          keyID: '1'
        },
        'admin.domain.com'
      )
    })

    it('should fallback to the original ciphertext if decrypt fails in listOutputs', async () => {
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

      const manager = new WalletPermissionsManager(underlying, 'admin.domain.com', {
        encryptWalletMetadata: true
      })
      manager.bindCallback('onBasketAccessRequested', x => {
        manager.grantPermission({ requestID: x.requestID, ephemeral: true })
      })
      ;(underlying.listOutputs as any).mockResolvedValue({
        totalOutputs: 1,
        outputs: [
          {
            outpoint: 'fakeTxid.0',
            satoshis: 500,
            lockingScript: 'OP_RETURN something',
            basket: 'some-basket',
            customInstructions: 'bad-ciphertext-of-some-kind'
          }
        ]
      })

      // Force an error from decrypt
      ;(underlying.decrypt as any).mockImplementationOnce(() => {
        throw new Error('Failed to decrypt')
      })

      const outputsResult = await manager.listOutputs(
        {
          basket: 'some-basket'
        },
        'some-origin.com'
      )

      expect(outputsResult.outputs.length).toBe(1)
      // Should fall back to the original 'bad-ciphertext-of-some-kind'
      expect(outputsResult.outputs[0].customInstructions).toBe('bad-ciphertext-of-some-kind')
    })
  })
})
