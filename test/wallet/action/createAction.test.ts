/* eslint-disable @typescript-eslint/no-unused-vars */
import { AtomicBEEF, Beef, CreateActionArgs, SignActionArgs } from '@bsv/sdk'
import { sdk, StorageKnex } from '../../../src/index.all'
import { _tu, expectToThrowWERR, TestWalletNoSetup } from '../../utils/TestUtilsWalletStorage'

const includeTestChaintracks = false
const noLog = true

describe('createAction test', () => {
  jest.setTimeout(99999999)

  const amount = 1319
  const env = _tu.getEnv('test')
  const testName = () => expect.getState().currentTestName || 'test'

  let ctxs: TestWalletNoSetup[]

  beforeEach(async () => {
    ctxs = []
    if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('createActionTests'))
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy(`${testName()}`))
    _tu.mockPostServicesAsSuccess(ctxs)
  })

  afterEach(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0_invalid_params', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: CreateActionArgs[] = [
          // description is too short...
          { description: '' },
          // no outputs, inputs or sendWith, now legal as isRemixChange transaction
          //{ description: '12345' },
          // lockingScript must be hexadecimal
          {
            description: '12345',
            outputs: [
              {
                satoshis: 42,
                lockingScript: 'fred',
                outputDescription: 'pay fred'
              }
            ]
          },
          // lockingScript must be even length
          {
            description: '12345',
            outputs: [
              {
                satoshis: 42,
                lockingScript: 'abc',
                outputDescription: 'pay fred'
              }
            ]
          }
        ]

        for (const a of args) {
          await expectToThrowWERR(sdk.WERR_INVALID_PARAMETER, () => wallet.createAction(a))
        }
      }
    }
  })

  test('1_repeatable txid', async () => {
    for (const { wallet } of ctxs) {
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const root = '02135476'
      const kp = _tu.getKeyPair(root.repeat(8))
      const createArgs: CreateActionArgs = {
        description: `repeatable`,
        outputs: [
          {
            satoshis: 45,
            lockingScript: _tu.getLockP2PKH(kp.address).toHex(),
            outputDescription: 'pay echo'
          }
        ],
        options: {
          randomizeOutputs: false,
          signAndProcess: true,
          noSend: true
        }
      }

      const cr = await wallet.createAction(createArgs)
      expect(cr.txid === '4f428a93c43c2d120204ecdc06f7916be8a5f4542cc8839a0fd79bd1b44582f3')
    }
  })

  test('2_signableTransaction', async () => {
    if (!includeTestChaintracks) return
    for (const { wallet } of ctxs) {
      const root = '02135476'
      const kp = _tu.getKeyPair(root.repeat(8))

      let txid1: string
      let txid2: string
      const outputSatoshis = 42
      let noSendChange: string[] | undefined
      let inputBEEF: AtomicBEEF | undefined

      {
        const createArgs: CreateActionArgs = {
          description: `${kp.address} of ${root}`,
          outputs: [
            {
              satoshis: outputSatoshis,
              lockingScript: _tu.getLockP2PKH(kp.address).toHex(),
              outputDescription: 'pay fred'
            }
          ],
          options: {
            randomizeOutputs: false,
            signAndProcess: false,
            noSend: true
          }
        }

        const cr = await wallet.createAction(createArgs)

        noSendChange = cr.noSendChange

        expect(cr.noSendChange).toBeTruthy()
        expect(cr.sendWithResults).toBeUndefined()
        expect(cr.tx).toBeUndefined()
        expect(cr.txid).toBeUndefined()

        expect(cr.signableTransaction).toBeTruthy()
        const st = cr.signableTransaction!
        expect(st.reference).toBeTruthy()
        // const tx = Transaction.fromAtomicBEEF(st.tx) // Transaction doesn't support V2 Beef yet.
        const atomicBeef = Beef.fromBinary(st.tx)
        const tx = atomicBeef.txs[atomicBeef.txs.length - 1].tx!
        for (const input of tx.inputs) {
          expect(atomicBeef.findTxid(input.sourceTXID!)).toBeTruthy()
        }

        // Spending authorization check happens here...
        //expect(st.amount > 242 && st.amount < 300).toBe(true)

        // sign and complete
        const signArgs: SignActionArgs = {
          reference: st.reference,
          spends: {},
          options: {
            returnTXIDOnly: false,
            noSend: true
          }
        }

        const sr = await wallet.signAction(signArgs)
        inputBEEF = sr.tx

        txid1 = sr.txid!
        // Update the noSendChange txid to final signed value.
        noSendChange = noSendChange!.map(op => `${txid1}.${op.split('.')[1]}`)
      }

      {
        const unlock = _tu.getUnlockP2PKH(kp.privateKey, outputSatoshis)
        const unlockingScriptLength = await unlock.estimateLength()

        const createArgs: CreateActionArgs = {
          description: `${kp.address} of ${root}`,
          inputs: [
            {
              outpoint: `${txid1}.0`,
              inputDescription: 'spend ${kp.address} of ${root}',
              unlockingScriptLength
            }
          ],
          inputBEEF,
          options: {
            noSendChange,
            // signAndProcess: false, // Not required as an input lacks unlock script...
            noSend: true
          }
        }

        const cr = await wallet.createAction(createArgs)

        expect(cr.noSendChange).toBeTruthy()
        expect(cr.sendWithResults).toBeUndefined()
        expect(cr.tx).toBeUndefined()
        expect(cr.txid).toBeUndefined()
        expect(cr.signableTransaction).toBeTruthy()
        const st = cr.signableTransaction!
        expect(st.reference).toBeTruthy()
        const atomicBeef = Beef.fromBinary(st.tx)
        const tx = atomicBeef.txs[atomicBeef.txs.length - 1].tx!

        tx.inputs[0].unlockingScriptTemplate = unlock
        await tx.sign()
        const unlockingScript = tx.inputs[0].unlockingScript!.toHex()

        const signArgs: SignActionArgs = {
          reference: st.reference,
          spends: { 0: { unlockingScript } },
          options: {
            returnTXIDOnly: true,
            noSend: true
          }
        }

        const sr = await wallet.signAction(signArgs)

        txid2 = sr.txid!
      }
      {
        const createArgs: CreateActionArgs = {
          description: `${kp.address} of ${root}`,
          options: {
            acceptDelayedBroadcast: false,
            sendWith: [txid1, txid2]
          }
        }

        const cr = await wallet.createAction(createArgs)

        expect(cr.noSendChange).not.toBeTruthy()
        expect(cr.sendWithResults?.length).toBe(2)
        const [swr1, swr2] = cr.sendWithResults!
        expect(swr1.status !== 'failed').toBe(true)
        expect(swr2.status !== 'failed').toBe(true)
        expect(swr1.txid).toBe(txid1)
        expect(swr2.txid).toBe(txid2)
      }
    }
  })

  test('3_Transaction with multiple outputs()', async () => {
    const root = '02135476'
    const kp = _tu.getKeyPair(root.repeat(8))
    for (const { wallet } of ctxs) {
      const args: CreateActionArgs = {
        description: 'Multiple outputs',
        outputs: [
          {
            satoshis: 10,
            lockingScript: _tu.getLockP2PKH(kp.address).toHex(),
            outputDescription: 'Output 1'
          },
          {
            satoshis: 20,
            lockingScript: _tu.getLockP2PKH(kp.address).toHex(),
            outputDescription: 'Output 2'
          }
        ],
        options: {
          signAndProcess: false,
          noSend: true
        }
      }
      const r = await wallet.createAction(args)
      expect(r.signableTransaction?.reference).toBeTruthy()
      expect(r.noSendChange?.length).toBe(1)
      expect(r.signableTransaction?.reference).toBeTruthy()
      expect(Array.isArray(r.signableTransaction?.tx)).toBe(true)
    }
  })

  test('4_Transaction with large number of outputs(50) and randomized', async () => {
    const root = '02135476'
    const kp = _tu.getKeyPair(root.repeat(8))

    for (const { wallet } of ctxs) {
      const outputs = Array.from({ length: 50 }, (_, i) => ({
        satoshis: i + 1, // Increment amounts
        lockingScript: _tu.getLockP2PKH(kp.address).toHex(),
        outputDescription: `Output ${i}`
      }))

      const args: CreateActionArgs = {
        description: 'Randomized Outputs',
        lockTime: 500000,
        outputs,
        options: {
          signAndProcess: false,
          noSend: true,
          randomizeOutputs: true
        }
      }
      const r = await wallet.createAction(args)
      expect(r.signableTransaction?.reference).toBeTruthy()
      expect(r.noSendChange?.length).toBe(1)
      expect(r.signableTransaction?.reference).toBeTruthy()
      expect(Array.isArray(r.signableTransaction?.tx)).toBe(true)
    }
  })
})
