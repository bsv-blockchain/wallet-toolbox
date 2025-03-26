import { EntitySyncState, sdk } from '../../../src'
import { _tu } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange, WERR_REVIEW_ACTIONS } from '../../../src/sdk'
import {
  burnOneSatTestOutput,
  createOneSatTestOutput,
  createSetup,
  doubleSpendOldChange,
  LocalWalletTestOptions,
  recoverOneSatTestOutputs
} from './localWalletMethods'
import { abort } from 'process'

const chain: sdk.Chain = 'main'

const options: LocalWalletTestOptions = {
  setActiveClient: true,
  useMySQLConnectionForClient: true,
  useTestIdentityKey: false,
  useIdentityKey2: false
}

describe('localWallet2 tests', () => {
  jest.setTimeout(99999999)

  test('0 monitor runOnce', async () => {
    const setup = await createSetup(chain, options)
    await setup.monitor.runOnce()
    await setup.wallet.destroy()
  })

  test('0a abort nosend', async () => {
    const setup = await createSetup(chain, options)
    await setup.wallet.listNoSendActions({ labels: [] }, true)
    await setup.wallet.destroy()
  })

  test('1 recover 1 sat outputs', async () => {
    const setup = await createSetup(chain, options)
    await recoverOneSatTestOutputs(setup)
    await setup.wallet.destroy()
  })

  test('2 create 1 sat delayed', async () => {
    const setup = await createSetup(chain, options)
    const car = await createOneSatTestOutput(setup, {}, 1)
    //await trackReqByTxid(setup, car.txid!)
    await setup.wallet.destroy()
  })

  test('2a create 1 sat immediate', async () => {
    const setup = await createSetup(chain, options)
    const car = await createOneSatTestOutput(setup, { acceptDelayedBroadcast: false }, 1)
    await setup.wallet.destroy()
  })

  test('2c burn 1 sat output', async () => {
    const setup = await createSetup(chain, options)
    await burnOneSatTestOutput(setup, {}, 1)
    await setup.wallet.destroy()
  })

  test('2d doubleSpend old change', async () => {
    const setup = await createSetup(chain, options)
    try {
      await doubleSpendOldChange(setup, {
        acceptDelayedBroadcast: false
      })
    } catch (eu: unknown) {
      const e = sdk.WalletError.fromUnknown(eu) as WERR_REVIEW_ACTIONS
      expect(e.code).toBe('WERR_REVIEW_ACTIONS')
      expect(e.reviewActionResults?.length === 1).toBe(true)
      const rar = e.reviewActionResults![0]!
      expect(rar.status).toBe('doubleSpend')
      expect(rar.competingTxs?.length).toBe(1)
      expect(rar.spentInputs?.length).toBe(1)
    }
    await setup.wallet.destroy()
  })

  test('4 review change utxos', async () => {
    const setup = await createSetup(chain, options)
    const lor = await setup.wallet.listOutputs({
      basket: specOpInvalidChange,
      tags: ['all']
    })
    if (lor.totalOutputs > 0) {
      debugger
      const lor = await setup.wallet.listOutputs({
        basket: specOpInvalidChange,
        tags: ['all', 'release']
      })
    }
    await setup.wallet.destroy()
  })
})
