import { Beef, CreateActionArgs, InternalizeActionArgs, P2PKH, WalletProtocol } from '@bsv/sdk'
import { sdk } from '../../../src/index.all'
import { _tu, expectToThrowWERR, TestWalletNoSetup } from '../../utils/TestUtilsWalletStorage'

const includeTestChaintracks = false

describe('internalizeAction tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnvFlags('test')

  const gctxs: TestWalletNoSetup[] = []
  const useSharedCtxs = true

  beforeAll(async () => {
    if (includeTestChaintracks) {
      if (env.runMySQL) gctxs.push(await _tu.createLegacyWalletMySQLCopy('actionInternalizeActionTests'))
      gctxs.push(await _tu.createLegacyWalletSQLiteCopy('actionInternalizeActionTests'))
    }
  })

  afterAll(async () => {
    for (const ctx of gctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 invalid params', async () => {
    for (const { wallet } of gctxs) {
      const beef0 = new Beef()
      const beef1 = new Beef()
      beef1.mergeTxidOnly('1'.repeat(64))

      const invalidArgs: InternalizeActionArgs[] = [
        { tx: [], outputs: [], description: '' },
        { tx: [], outputs: [], description: '12345' },
        { tx: beef0.toBinary(), outputs: [], description: '12345' },
        { tx: beef1.toBinary(), outputs: [], description: '12345' }
        // Oh so many things to test...
      ]

      for (const args of invalidArgs) {
        await expectToThrowWERR(sdk.WERR_INVALID_PARAMETER, () => wallet.internalizeAction(args))
      }
    }
  })

  test('1_internalize custom output in receiving wallet with checks', async () => {
    const ctxs: TestWalletNoSetup[] = []
    if (useSharedCtxs) ctxs.push(...gctxs)
    else {
      if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('actionInternalizeAction1Tests'))
      ctxs.push(await _tu.createLegacyWalletSQLiteCopy('actionInternalizeAction1Tests'))
    }
    for (const { wallet } of ctxs) {
      const root = '02135476'
      const kp = _tu.getKeyPair(root.repeat(8))
      const fredsAddress = kp.address

      const outputSatoshis = 4

      {
        const createArgs: CreateActionArgs = {
          description: `${kp.address} of ${root}`,
          outputs: [
            {
              satoshis: outputSatoshis,
              lockingScript: _tu.getLockP2PKH(fredsAddress).toHex(),
              outputDescription: 'pay fred'
            }
          ],
          options: {
            returnTXIDOnly: false,
            randomizeOutputs: false,
            signAndProcess: true,
            noSend: true
          }
        }
        // This createAction creates a new P2PKH output of 4 satoshis for Fred using his publish payment address... old school.
        const cr = await wallet.createAction(createArgs)
        expect(cr.tx).toBeTruthy()

        // Fred's new wallet (context)
        const fred = await _tu.createSQLiteTestWallet({
          chain: 'test',
          databaseName: 'internalizeAction1fred',
          rootKeyHex: '2'.repeat(64),
          dropAll: true
        })

        // Internalize args to add fred's new output to his own wallet
        const internalizeArgs: InternalizeActionArgs = {
          tx: cr.tx!,
          outputs: [
            {
              outputIndex: 0,
              protocol: 'basket insertion',
              insertionRemittance: {
                basket: 'payments',
                customInstructions: JSON.stringify({ root, repeat: 8 }),
                tags: ['test', 'again']
              }
            }
          ],
          description: 'got paid!'
        }
        // And do it...
        const ir = await fred.wallet.internalizeAction(internalizeArgs)
        expect(ir.accepted).toBe(true)

        const ro = await fred.activeStorage.findOutputs({
          partial: { outputId: 1 }
        })
        expect(ro[0].basketId).toBe(2) // Basket can't be default basket so basketId must be 2
        expect(ro[0].satoshis).toBe(outputSatoshis)

        // Validate custom instructions and tags
        expect(ro[0].customInstructions).toBe(JSON.stringify({ root, repeat: 8 }))
        const rtm = await fred.activeStorage.findOutputTagMaps({
          partial: { outputId: 1 }
        })
        const rt1 = await fred.activeStorage.findOutputTags({
          partial: { outputTagId: rtm[0].outputTagId }
        })
        expect(rt1[0].tag).toBe('test')
        const rt2 = await fred.activeStorage.findOutputTags({
          partial: { outputTagId: rtm[1].outputTagId }
        })
        expect(rt2[0].tag).toBe('again')

        // Check that calling again does not throw an error
        const r = await fred.wallet.internalizeAction(internalizeArgs)
        await expect(Promise.resolve(r)).resolves.toBeTruthy()

        // Cleanup Fred's storage
        await fred.activeStorage.destroy()
      }
    }
    if (!useSharedCtxs) {
      for (const ctx of ctxs) {
        await ctx.storage.destroy()
      }
    }
  })

  test('2_internalize 2 custom outputs in receiving wallet with checks', async () => {
    const ctxs: TestWalletNoSetup[] = []
    if (useSharedCtxs) ctxs.push(...gctxs)
    else {
      if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('actionInternalizeAction2Tests'))
      ctxs.push(await _tu.createLegacyWalletSQLiteCopy('actionInternalizeAction2Tests'))
    }
    for (const { wallet } of ctxs) {
      const root = '02135476'
      const kp = _tu.getKeyPair(root.repeat(8))
      const fredsAddress = kp.address

      const outputSatoshis1 = 4
      const outputSatoshis2 = 5

      {
        const createArgs: CreateActionArgs = {
          description: `${kp.address} of ${root}`,
          outputs: [
            {
              satoshis: outputSatoshis1,
              lockingScript: _tu.getLockP2PKH(fredsAddress).toHex(),
              outputDescription: 'pay fred 1st payment'
            },
            {
              satoshis: outputSatoshis2,
              lockingScript: _tu.getLockP2PKH(fredsAddress).toHex(),
              outputDescription: 'pay fred 2nd payment'
            }
          ],
          options: {
            returnTXIDOnly: false,
            randomizeOutputs: false,
            signAndProcess: true,
            noSend: true
          }
        }

        // This createAction creates a new P2PKH output of 4 and 5 satoshis for Fred using his publish payment address... old school.
        const cr = await wallet.createAction(createArgs)
        expect(cr.tx).toBeTruthy()

        // Fred's new wallet (context)
        const fred = await _tu.createSQLiteTestWallet({
          chain: 'test',
          databaseName: 'internalizeAction2fred',
          rootKeyHex: '2'.repeat(64),
          dropAll: true
        })

        // Internalize args to add fred's new output to his own wallet
        const internalizeArgs: InternalizeActionArgs = {
          tx: cr.tx!,
          outputs: [
            {
              outputIndex: 0,
              protocol: 'basket insertion',
              insertionRemittance: {
                basket: 'payments',
                customInstructions: JSON.stringify({ root, repeat: 8 }),
                tags: ['2 tests', 'test 1']
              }
            },
            {
              outputIndex: 1,
              protocol: 'basket insertion',
              insertionRemittance: {
                basket: 'payments',
                customInstructions: JSON.stringify({ root, repeat: 8 }),
                tags: ['2 tests', 'test 2']
              }
            }
          ],
          description: 'got paid twice!'
        }
        // And do it...
        const ir = await fred.wallet.internalizeAction(internalizeArgs)
        expect(ir.accepted).toBe(true)

        {
          const ro = await fred.activeStorage.findOutputs({
            partial: { outputId: 1 }
          })
          expect(ro[0].basketId).toBe(2)
          expect(ro[0].satoshis).toBe(outputSatoshis1)

          // Validate custom instructions and tags
          expect(ro[0].customInstructions).toBe(JSON.stringify({ root, repeat: 8 }))
          const rtm = await fred.activeStorage.findOutputTagMaps({
            partial: { outputId: 1 }
          })
          const rt1 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[0].outputTagId }
          })
          expect(rt1[0].tag).toBe('2 tests')
          const rt2 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[1].outputTagId }
          })
          expect(rt2[0].tag).toBe('test 1')
        }
        {
          const ro = await fred.activeStorage.findOutputs({
            partial: { outputId: 2 }
          })
          expect(ro[0].basketId).toBe(2)
          expect(ro[0].satoshis).toBe(outputSatoshis2)

          expect(ro[0].customInstructions).toBe(JSON.stringify({ root, repeat: 8 }))
          const rtm = await fred.activeStorage.findOutputTagMaps({
            partial: { outputId: 2 }
          })
          const rt1 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[0].outputTagId }
          })
          expect(rt1[0].tag).toBe('2 tests')
          const rt2 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[1].outputTagId }
          })
          expect(rt2[0].tag).toBe('test 2')
        }

        // Check that calling again does not throw an error
        const r = await fred.wallet.internalizeAction(internalizeArgs)
        await expect(Promise.resolve(r)).resolves.toBeTruthy()

        await fred.activeStorage.destroy()
      }
    }
    if (!useSharedCtxs) {
      for (const ctx of ctxs) {
        await ctx.storage.destroy()
      }
    }
  })

  test('3_internalize wallet payment in receiving wallet with checks', async () => {
    const ctxs: TestWalletNoSetup[] = []
    if (useSharedCtxs) ctxs.push(...gctxs)
    else {
      if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('actionInternalizeAction3Tests'))
      ctxs.push(await _tu.createLegacyWalletSQLiteCopy('actionInternalizeAction3Tests'))
    }
    for (const { wallet, identityKey: senderIdentityKey } of ctxs) {
      const fred = await _tu.createSQLiteTestWallet({
        chain: 'test',
        databaseName: 'internalizeAction3fred',
        rootKeyHex: '2'.repeat(64),
        dropAll: true
      })
      const outputSatoshis = 5
      const derivationPrefix = Buffer.from('invoice-12345').toString('base64')
      const derivationSuffix = Buffer.from('utxo-0').toString('base64')
      const brc29ProtocolID: WalletProtocol = [2, '3241645161d8']
      const derivedPublicKey = wallet.keyDeriver.derivePublicKey(
        brc29ProtocolID,
        `${derivationPrefix} ${derivationSuffix}`,
        fred.identityKey
      )
      const derivedAddress = derivedPublicKey.toAddress()

      {
        const createArgs: CreateActionArgs = {
          description: `description BRC-29`,
          outputs: [
            {
              satoshis: outputSatoshis,
              lockingScript: new P2PKH().lock(derivedAddress).toHex(),
              outputDescription: 'pay fred BRC-29'
            }
          ],
          options: {
            returnTXIDOnly: false,
            randomizeOutputs: false,
            signAndProcess: true,
            noSend: true
          }
        }

        const cr = await wallet.createAction(createArgs)
        expect(cr.tx).toBeTruthy()

        const internalizeArgs: InternalizeActionArgs = {
          tx: cr.tx!,
          outputs: [
            {
              outputIndex: 0,
              protocol: 'wallet payment',
              paymentRemittance: {
                derivationPrefix: derivationPrefix,
                derivationSuffix: derivationSuffix,
                senderIdentityKey: senderIdentityKey
              }
            }
          ],
          description: 'received BRC-29 payment!'
        }

        const ir = await fred.wallet.internalizeAction(internalizeArgs)
        expect(ir.accepted).toBe(true)

        const rfbs = await fred.activeStorage.findOutputBaskets({
          partial: { name: 'default' }
        })
        expect(rfbs.length).toBe(1)

        const rfos = await fred.activeStorage.findOutputs({
          partial: { basketId: rfbs[0].basketId }
        })
        expect(rfos.length).toBe(1)
        expect(rfos[0].satoshis).toBe(outputSatoshis)
        expect(rfos[0].type).toBe('P2PKH')
        expect(rfos[0].purpose).toBe('change')

        const r = await fred.wallet.internalizeAction(internalizeArgs)
        await expect(Promise.resolve(r)).resolves.toBeTruthy()

        await fred.activeStorage.destroy()
      }
    }
    if (!useSharedCtxs) {
      for (const ctx of ctxs) {
        await ctx.storage.destroy()
      }
    }
  })

  test('4_internalize 2 wallet payments in receiving wallet with checks', async () => {
    const ctxs: TestWalletNoSetup[] = []
    if (useSharedCtxs) ctxs.push(...gctxs)
    else {
      if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('actionInternalizeAction4Tests'))
      ctxs.push(await _tu.createLegacyWalletSQLiteCopy('actionInternalizeAction4Tests'))
    }
    for (const { wallet, identityKey: senderIdentityKey } of ctxs) {
      const fred = await _tu.createSQLiteTestWallet({
        chain: 'test',
        databaseName: 'internalizeAction4fred',
        rootKeyHex: '2'.repeat(64),
        dropAll: true
      })

      const brc29ProtocolID: WalletProtocol = [2, '3241645161d8']
      const outputSatoshis1 = 6
      const derivationPrefix = Buffer.from('invoice-12345').toString('base64')
      const derivationSuffix1 = Buffer.from('utxo-1').toString('base64')
      const derivedPublicKey1 = wallet.keyDeriver.derivePublicKey(
        brc29ProtocolID,
        `${derivationPrefix} ${derivationSuffix1}`,
        fred.identityKey
      )
      const derivedAddress1 = derivedPublicKey1.toAddress()

      const outputSatoshis2 = 7
      const derivationSuffix2 = Buffer.from('utxo-2').toString('base64')
      const derivedPublicKey2 = wallet.keyDeriver.derivePublicKey(
        brc29ProtocolID,
        `${derivationPrefix} ${derivationSuffix2}`,
        fred.identityKey
      )
      const derivedAddress2 = derivedPublicKey2.toAddress()

      {
        const createArgs: CreateActionArgs = {
          description: `BRC-29 payments from other wallet`,
          outputs: [
            {
              satoshis: outputSatoshis1,
              lockingScript: new P2PKH().lock(derivedAddress1).toHex(),
              outputDescription: 'pay fred 1st BRC-29 payment'
            },
            {
              satoshis: outputSatoshis2,
              lockingScript: new P2PKH().lock(derivedAddress2).toHex(),
              outputDescription: 'pay fred 2nd BRC-29 payment'
            }
          ],
          options: {
            returnTXIDOnly: false,
            randomizeOutputs: false,
            signAndProcess: true,
            noSend: true
          }
        }

        const cr = await wallet.createAction(createArgs)
        expect(cr.tx).toBeTruthy()

        const internalizeArgs: InternalizeActionArgs = {
          tx: cr.tx!,
          outputs: [
            {
              outputIndex: 0,
              protocol: 'wallet payment',
              paymentRemittance: {
                derivationPrefix: derivationPrefix,
                derivationSuffix: derivationSuffix1,
                senderIdentityKey: senderIdentityKey
              }
            },
            {
              outputIndex: 1,
              protocol: 'wallet payment',
              paymentRemittance: {
                derivationPrefix: derivationPrefix,
                derivationSuffix: derivationSuffix2,
                senderIdentityKey: senderIdentityKey
              }
            }
          ],
          description: 'received pair of BRC-29 payments!'
        }

        const ir = await fred.wallet.internalizeAction(internalizeArgs)
        expect(ir.accepted).toBe(true)

        const rfbs = await fred.activeStorage.findOutputBaskets({
          partial: { name: 'default' }
        })
        expect(rfbs.length).toBe(1)

        const rfos = await fred.activeStorage.findOutputs({
          partial: { basketId: rfbs[0].basketId }
        })
        expect(rfos.length).toBe(2)
        expect(rfos[0].satoshis).toBe(outputSatoshis1)
        expect(rfos[0].type).toBe('P2PKH')
        expect(rfos[0].purpose).toBe('change')

        expect(rfos[1].satoshis).toBe(outputSatoshis2)
        expect(rfos[1].type).toBe('P2PKH')
        expect(rfos[1].purpose).toBe('change')

        const r = await fred.wallet.internalizeAction(internalizeArgs)
        await expect(Promise.resolve(r)).resolves.toBeTruthy()

        await fred.activeStorage.destroy()
      }
    }
    if (!useSharedCtxs) {
      for (const ctx of ctxs) {
        await ctx.storage.destroy()
      }
    }
  })

  test('5_internalize 2 wallet payments and 2 basket insertions in receiving wallet with checks', async () => {
    if (!includeTestChaintracks) return
    const ctxs: TestWalletNoSetup[] = []
    if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('actionInternalizeAction5Tests'))
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy('actionInternalizeAction5Tests'))
    for (const { wallet, identityKey: senderIdentityKey } of ctxs) {
      const fred = await _tu.createSQLiteTestWallet({
        chain: 'test',
        databaseName: 'internalizeAction5fred',
        rootKeyHex: '2'.repeat(64),
        dropAll: true
      })

      const brc29ProtocolID: WalletProtocol = [2, '3241645161d8']
      const outputSatoshis1 = 8
      const derivationPrefix = Buffer.from('invoice-12345').toString('base64')
      const derivationSuffix1 = Buffer.from('utxo-1').toString('base64')
      const derivedPublicKey1 = wallet.keyDeriver.derivePublicKey(
        brc29ProtocolID,
        `${derivationPrefix} ${derivationSuffix1}`,
        fred.identityKey
      )
      const derivedAddress1 = derivedPublicKey1.toAddress()

      const outputSatoshis2 = 9
      const derivationSuffix2 = Buffer.from('utxo-2').toString('base64')
      const derivedPublicKey2 = wallet.keyDeriver.derivePublicKey(
        brc29ProtocolID,
        `${derivationPrefix} ${derivationSuffix2}`,
        fred.identityKey
      )
      const derivedAddress2 = derivedPublicKey2.toAddress()

      const root = '02135476'
      const kp = _tu.getKeyPair(root.repeat(8))
      const fredsAddress = kp.address

      const outputSatoshis3 = 10
      const outputSatoshis4 = 11

      {
        const createArgs: CreateActionArgs = {
          description: `BRC-29 payments from other wallet`,
          outputs: [
            {
              satoshis: outputSatoshis1,
              lockingScript: new P2PKH().lock(derivedAddress1).toHex(),
              outputDescription: 'pay fred 1st BRC-29 payment'
            },
            {
              satoshis: outputSatoshis2,
              lockingScript: new P2PKH().lock(derivedAddress2).toHex(),
              outputDescription: 'pay fred 2nd BRC-29 payment'
            },
            {
              satoshis: outputSatoshis3,
              lockingScript: _tu.getLockP2PKH(fredsAddress).toHex(),
              outputDescription: 'pay fred 3rd payment'
            },
            {
              satoshis: outputSatoshis4,
              lockingScript: _tu.getLockP2PKH(fredsAddress).toHex(),
              outputDescription: 'pay fred 4th payment'
            }
          ],
          options: {
            returnTXIDOnly: false,
            randomizeOutputs: false,
            signAndProcess: true,
            noSend: true
          }
        }

        const cr = await wallet.createAction(createArgs)
        expect(cr.tx).toBeTruthy()

        const internalizeArgs: InternalizeActionArgs = {
          tx: cr.tx!,

          outputs: [
            {
              outputIndex: 0,
              protocol: 'wallet payment',
              paymentRemittance: {
                derivationPrefix: derivationPrefix,
                derivationSuffix: derivationSuffix1,
                senderIdentityKey: senderIdentityKey
              }
            },
            {
              outputIndex: 1,
              protocol: 'wallet payment',
              paymentRemittance: {
                derivationPrefix: derivationPrefix,
                derivationSuffix: derivationSuffix2,
                senderIdentityKey: senderIdentityKey
              }
            },
            {
              outputIndex: 2,
              protocol: 'basket insertion',
              insertionRemittance: {
                basket: 'payments',
                customInstructions: `3rd payment ${JSON.stringify({ root, repeat: 8 })}`,
                tags: ['basket payments', '1st basket payment']
              }
            },
            {
              outputIndex: 3,
              protocol: 'basket insertion',
              insertionRemittance: {
                basket: 'payments',
                customInstructions: `4th payment ${JSON.stringify({ root, repeat: 8 })}`,
                tags: ['basket payments', '2nd basket payment']
              }
            }
          ],
          description: 'received 2 BRC-29 pay and 2 basket ins!'
        }

        const ir = await fred.wallet.internalizeAction(internalizeArgs)
        expect(ir.accepted).toBe(true)

        const rfbs = await fred.activeStorage.findOutputBaskets({
          partial: { name: 'default' }
        })
        expect(rfbs.length).toBe(1)

        const rfos = await fred.activeStorage.findOutputs({
          partial: { basketId: rfbs[0].basketId }
        })
        expect(rfos.length).toBe(2)
        expect(rfos[0].satoshis).toBe(outputSatoshis1)
        expect(rfos[0].type).toBe('P2PKH')
        expect(rfos[0].purpose).toBe('change')

        expect(rfos[1].satoshis).toBe(outputSatoshis2)
        expect(rfos[1].type).toBe('P2PKH')
        expect(rfos[1].purpose).toBe('change')

        {
          const ro = await fred.activeStorage.findOutputs({
            partial: { outputId: 3 }
          })
          expect(ro[0].basketId).toBe(2)
          expect(ro[0].satoshis).toBe(outputSatoshis3)

          expect(ro[0].customInstructions).toBe(`3rd payment ${JSON.stringify({ root, repeat: 8 })}`)
          const rtm = await fred.activeStorage.findOutputTagMaps({
            partial: { outputId: 3 }
          })
          const rt1 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[0].outputTagId }
          })
          expect(rt1[0].tag).toBe('basket payments')
          const rt2 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[1].outputTagId }
          })
          expect(rt2[0].tag).toBe('1st basket payment')
        }
        {
          const ro = await fred.activeStorage.findOutputs({
            partial: { outputId: 4 }
          })
          expect(ro[0].basketId).toBe(2)
          expect(ro[0].satoshis).toBe(outputSatoshis4)

          expect(ro[0].customInstructions).toBe(`4th payment ${JSON.stringify({ root, repeat: 8 })}`)
          const rtm = await fred.activeStorage.findOutputTagMaps({
            partial: { outputId: 4 }
          })
          const rt1 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[0].outputTagId }
          })
          expect(rt1[0].tag).toBe('basket payments')
          const rt2 = await fred.activeStorage.findOutputTags({
            partial: { outputTagId: rtm[1].outputTagId }
          })
          expect(rt2[0].tag).toBe('2nd basket payment')
        }

        const r = await fred.wallet.internalizeAction(internalizeArgs)
        await expect(Promise.resolve(r)).resolves.toBeTruthy()

        await fred.activeStorage.destroy()
      }
    }
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })
})
