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
    const ok = beef.verify(await setup.services.getChainTracker())
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
    1, 1, 1, 1, 196, 222, 98, 76, 119, 112, 138, 49, 125, 79, 3, 8, 17, 96, 88, 134, 18, 94, 233, 6, 43, 58, 55, 200, 53, 21, 225, 58, 243, 130, 114, 64, 2, 0, 190, 239, 0, 1, 0, 1, 0, 0, 0, 1, 157, 193, 59, 124, 10, 214, 21, 108, 182, 51, 203, 122, 124, 52, 230, 65, 248, 166, 3, 136, 224, 45, 213, 116, 91, 81, 101, 168, 142, 252, 196, 20, 110, 0, 0, 0, 107, 72, 48, 69, 2, 33, 0, 144, 86, 132, 240, 56, 253, 101, 20, 254, 1, 184, 144, 98, 236, 225, 242, 239, 88, 99, 196, 58, 33, 141, 79, 234, 140, 7, 22, 254, 140, 65, 83, 2, 32, 113, 198, 86, 176, 19, 16, 165, 168, 5, 227, 70, 44, 5, 22, 144, 179, 172, 170, 13, 148, 3, 236, 35, 2, 74, 238, 235, 84, 148, 192, 102, 138, 65, 33, 3, 15, 101, 106, 207, 42, 192, 187, 51, 59, 128, 27, 240, 244, 240, 4, 224, 230, 41, 166, 89, 216, 46, 7, 24, 242, 180, 20, 90, 12, 57, 59, 144, 255, 255, 255, 255, 2, 136, 19, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 240, 178, 178, 204, 51, 126, 211, 251, 43, 177, 154, 94, 189, 29, 53, 41, 220, 136, 142, 80, 136, 172, 208, 140, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 217, 48, 110, 108, 236, 100, 116, 90, 181, 114, 45, 176, 198, 216, 150, 134, 16, 251, 10, 177, 136, 172, 0, 0, 0, 0]
