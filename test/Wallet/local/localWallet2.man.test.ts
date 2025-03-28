import { EntitySyncState, sdk, Services, Setup, StorageKnex } from '../../../src'
import { _tu } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange, ValidListOutputsArgs, WERR_REVIEW_ACTIONS } from '../../../src/sdk'
import {
  burnOneSatTestOutput,
  createOneSatTestOutput,
  createSetup,
  doubleSpendOldChange,
  LocalWalletTestOptions,
  recoverOneSatTestOutputs
} from './localWalletMethods'
import { abort } from 'process'

import * as dotenv from 'dotenv'
dotenv.config()

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

  test('5 cleanup change for userId', async () => {
    const env = _tu.getEnv('main')
    const knex = Setup.createMySQLKnex(process.env.MAIN_CLOUD_MYSQL_CONNECTION!)
    const storage = new StorageKnex({
      chain: env.chain,
      knex: knex,
      commissionSatoshis: 0,
      commissionPubKeyHex: undefined,
      feeModel: { model: 'sat/kb', value: 1 }
    })
    const servicesOptions = Services.createDefaultOptions(env.chain)
    if (env.whatsonchainApiKey) servicesOptions.whatsOnChainApiKey = env.whatsonchainApiKey;
    storage.setServices(new Services(servicesOptions))
    await storage.makeAvailable()
    for (const userId of [76,48,166,94,110,111,81]) {
      const auth = { userId, identityKey: '' }
      const vargs: ValidListOutputsArgs = {
        basket: specOpInvalidChange,
        tags: [],
        tagQueryMode: 'all',
        includeLockingScripts: false,
        includeTransactions: false,
        includeCustomInstructions: false,
        includeTags: false,
        includeLabels: false,
        limit: 0,
        offset: 0,
        seekPermission: false,
        knownTxids: []
      }
      let r = await storage.listOutputs(auth, vargs)
      if (r.totalOutputs > 0) {
        console.log(`userId ${userId} releasing ${r.totalOutputs} unspendable utxos`)
        r = await storage.listOutputs(auth, { ...vargs, tags: ['release'] })
        r = await storage.listOutputs(auth, vargs)
      }
      expect(r.totalOutputs).toBe(0)
    }
    await storage.destroy()
  })
})
