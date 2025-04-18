import { Beef, WalletOutput } from '@bsv/sdk'
import { sdk, Services, Setup, StorageKnex, TableUser } from '../../../src'
import { _tu, TuEnv } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange, ValidListOutputsArgs, WERR_REVIEW_ACTIONS } from '../../../src/sdk'
import {
  burnOneSatTestOutput,
  createOneSatTestOutput,
  createSetup,
  doubleSpendOldChange,
  LocalWalletTestOptions,
  recoverOneSatTestOutputs
} from '../../utils/localWalletMethods'

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

  test('5 review and release all production invalid change utxos', async () => {
    const { env, storage } = await createMainReviewSetup()
    const users = await storage.findUsers({ partial: {} })
    const withInvalid: Record<number, { user: TableUser; outputs: WalletOutput[]; total: number }> = {}
    // [76, 48, 166, 94, 110, 111, 81]
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
    for (const user of users) {
      const { userId } = user
      const auth = { userId, identityKey: '' }
      let r = await storage.listOutputs(auth, vargs)
      if (r.totalOutputs > 0) {
        const total: number = r.outputs.reduce((s, o) => (s += o.satoshis), 0)
        console.log(`userId ${userId}: ${r.totalOutputs} unspendable utxos, total ${total}, ${user.identityKey}`)
        withInvalid[userId] = { user, outputs: r.outputs, total }
      }
    }
    if (Object.keys(withInvalid).length > 0) {
      debugger
      // Release invalids
      for (const { user, outputs } of Object.values(withInvalid)) {
        const { userId } = user
        const auth = { userId, identityKey: '' }
        await storage.listOutputs(auth, { ...vargs, tags: ['release'] })
      }
      // Verify
      for (const { user, outputs } of Object.values(withInvalid)) {
        const { userId } = user
        const auth = { userId, identityKey: '' }
        const r = await storage.listOutputs(auth, vargs)
        expect(r.totalOutputs).toBe(0)
      }
    }
    await storage.destroy()
  })

  test('6 review and unfail false doubleSpends', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    let offset = 1100
    const limit = 100
    let allUnfails: number[] = []
    for (;;) {
      let log = ''
      const unfails: number[] = []
      const reqs = await storage.findProvenTxReqs({ partial: { status: 'doubleSpend' }, paged: { limit, offset } })
      for (const req of reqs) {
        const gsr = await services.getStatusForTxids([req.txid])
        if (gsr.results[0].status !== 'unknown') {
          log += `unfail ${req.provenTxReqId} ${req.txid}\n`
          unfails.push(req.provenTxReqId)
        }
      }
      console.log(`OFFSET: ${offset} ${unfails.length} unfails\n${log}`)
      allUnfails = allUnfails.concat(unfails)
      if (reqs.length < limit) break
      offset += reqs.length
    }
    debugger
    for (const id of allUnfails) {
      await storage.updateProvenTxReq(id, { status: 'unfail' })
    }
    await storage.destroy()
  })

  test('7 review and unfail false invalids', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    let offset = 400
    const limit = 100
    let allUnfails: number[] = []
    for (;;) {
      let log = ''
      const unfails: number[] = []
      const reqs = await storage.findProvenTxReqs({ partial: { status: 'invalid' }, paged: { limit, offset } })
      for (const req of reqs) {
        if (!req.txid || !req.rawTx) continue
        const gsr = await services.getStatusForTxids([req.txid])
        if (gsr.results[0].status !== 'unknown') {
          log += `unfail ${req.provenTxReqId} ${req.txid}\n`
          unfails.push(req.provenTxReqId)
        }
      }
      console.log(`OFFSET: ${offset} ${unfails.length} unfails\n${log}`)
      allUnfails = allUnfails.concat(unfails)
      if (reqs.length < limit) break
      offset += reqs.length
    }
    debugger
    for (const id of allUnfails) {
      await storage.updateProvenTxReq(id, { status: 'unfail' })
    }
    await storage.destroy()
  })

  test('8 jackie Beef', async () => {
    const setup = await createSetup(chain, options)
    const beef = Beef.fromBinary(beefJackie)
    console.log(beef.toLogString())
    const ok = await beef.verify(await setup.services.getChainTracker())
    await setup.wallet.destroy()
  })

})

async function createMainReviewSetup(): Promise<{
  env: TuEnv
  storage: StorageKnex
  services: Services
}> {
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
  if (env.whatsonchainApiKey) servicesOptions.whatsOnChainApiKey = env.whatsonchainApiKey
  const services = new Services(servicesOptions)
  storage.setServices(services)
  await storage.makeAvailable()
  return { env, storage, services }
}

const beefJackie = [
  1, 1, 1, 1, 196, 222, 98, 76, 119, 112, 138, 49, 125, 79, 3, 8, 17, 96, 88, 134, 18, 94, 233, 6, 43, 58, 55, 200, 53,
  21, 225, 58, 243, 130, 114, 64, 2, 0, 190, 239, 0, 1, 0, 1, 0, 0, 0, 1, 157, 193, 59, 124, 10, 214, 21, 108, 182, 51,
  203, 122, 124, 52, 230, 65, 248, 166, 3, 136, 224, 45, 213, 116, 91, 81, 101, 168, 142, 252, 196, 20, 110, 0, 0, 0,
  107, 72, 48, 69, 2, 33, 0, 144, 86, 132, 240, 56, 253, 101, 20, 254, 1, 184, 144, 98, 236, 225, 242, 239, 88, 99, 196,
  58, 33, 141, 79, 234, 140, 7, 22, 254, 140, 65, 83, 2, 32, 113, 198, 86, 176, 19, 16, 165, 168, 5, 227, 70, 44, 5, 22,
  144, 179, 172, 170, 13, 148, 3, 236, 35, 2, 74, 238, 235, 84, 148, 192, 102, 138, 65, 33, 3, 15, 101, 106, 207, 42,
  192, 187, 51, 59, 128, 27, 240, 244, 240, 4, 224, 230, 41, 166, 89, 216, 46, 7, 24, 242, 180, 20, 90, 12, 57, 59, 144,
  255, 255, 255, 255, 2, 136, 19, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 240, 178, 178, 204, 51, 126, 211, 251, 43, 177,
  154, 94, 189, 29, 53, 41, 220, 136, 142, 80, 136, 172, 208, 140, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 217, 48, 110,
  108, 236, 100, 116, 90, 181, 114, 45, 176, 198, 216, 150, 134, 16, 251, 10, 177, 136, 172, 0, 0, 0, 0
]

const brayden1 =
  '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'
