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
    const log = await setup.monitor.runTask('UnFail')
    if (log) console.log(log)
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
    await recoverOneSatTestOutputs(setup, 1)
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

  test('8 Beef', async () => {
    const setup = await createSetup(chain, options)
    const beef = Beef.fromBinary(deggen1)
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

const deggen1 = [
  2, 0, 190, 239, 1, 254, 61, 164, 13, 0, 9, 4, 18, 0, 25, 233, 123, 59, 2, 93, 207, 54, 99, 91, 69, 64, 83, 210, 227,
  229, 130, 77, 217, 18, 14, 236, 143, 122, 254, 10, 250, 126, 58, 110, 238, 144, 19, 2, 77, 46, 100, 182, 154, 241,
  164, 76, 47, 98, 205, 29, 160, 92, 177, 126, 92, 14, 145, 35, 91, 165, 0, 42, 124, 199, 62, 233, 121, 154, 7, 24, 50,
  2, 33, 171, 215, 183, 158, 221, 38, 243, 70, 211, 131, 58, 170, 44, 3, 231, 237, 152, 13, 155, 150, 30, 199, 126, 229,
  176, 189, 102, 63, 10, 111, 24, 51, 0, 96, 207, 90, 32, 230, 218, 160, 51, 4, 135, 244, 191, 12, 159, 31, 19, 41, 249,
  30, 104, 83, 57, 244, 44, 9, 107, 188, 7, 248, 1, 196, 223, 2, 8, 0, 12, 7, 218, 35, 194, 27, 189, 224, 87, 232, 37,
  94, 137, 221, 163, 111, 238, 214, 218, 189, 232, 184, 7, 64, 230, 178, 185, 212, 26, 9, 164, 150, 24, 0, 147, 228, 31,
  186, 126, 234, 39, 157, 58, 249, 202, 105, 111, 115, 131, 48, 88, 19, 18, 87, 119, 96, 75, 56, 114, 143, 230, 59, 152,
  76, 202, 170, 2, 5, 0, 202, 155, 78, 246, 86, 202, 171, 73, 239, 29, 13, 204, 22, 12, 123, 194, 142, 166, 210, 45,
  130, 52, 74, 184, 201, 152, 12, 255, 181, 67, 215, 168, 13, 0, 115, 189, 166, 59, 177, 77, 241, 159, 94, 189, 50, 110,
  17, 154, 28, 185, 202, 97, 234, 155, 78, 115, 189, 69, 79, 71, 188, 113, 122, 109, 16, 181, 2, 3, 0, 194, 45, 225,
  166, 175, 104, 161, 184, 190, 254, 229, 125, 27, 127, 137, 161, 232, 68, 193, 96, 253, 87, 62, 253, 3, 223, 229, 24,
  94, 129, 214, 116, 7, 0, 181, 135, 252, 247, 5, 39, 49, 52, 191, 156, 240, 250, 221, 25, 129, 225, 237, 152, 31, 145,
  108, 42, 93, 6, 103, 69, 76, 160, 165, 23, 70, 83, 2, 0, 0, 209, 193, 9, 113, 33, 134, 63, 48, 32, 212, 87, 35, 34,
  83, 161, 246, 84, 183, 72, 110, 90, 1, 64, 118, 21, 131, 61, 196, 29, 111, 119, 191, 2, 0, 123, 95, 31, 84, 230, 82,
  82, 24, 53, 216, 218, 40, 117, 2, 63, 219, 61, 238, 105, 161, 46, 181, 243, 167, 97, 64, 228, 114, 220, 71, 73, 140,
  0, 1, 1, 0, 196, 184, 184, 52, 65, 192, 137, 200, 207, 243, 174, 77, 2, 118, 237, 202, 138, 161, 243, 35, 91, 198, 65,
  64, 163, 246, 38, 208, 76, 180, 145, 244, 1, 1, 0, 18, 245, 205, 109, 82, 79, 229, 218, 95, 101, 184, 218, 130, 175,
  143, 244, 107, 175, 141, 157, 173, 206, 99, 11, 227, 77, 101, 98, 6, 48, 136, 67, 1, 1, 0, 91, 191, 231, 205, 39, 100,
  227, 219, 93, 238, 93, 109, 242, 165, 180, 233, 198, 96, 25, 89, 170, 169, 130, 162, 244, 10, 239, 202, 107, 0, 21,
  60, 8, 1, 0, 1, 0, 0, 0, 2, 174, 169, 208, 19, 216, 192, 152, 143, 113, 93, 23, 171, 156, 150, 82, 10, 181, 224, 21,
  166, 66, 108, 87, 213, 157, 118, 189, 68, 8, 80, 85, 181, 0, 0, 0, 0, 73, 72, 48, 69, 2, 33, 0, 141, 211, 248, 207,
  116, 130, 57, 74, 242, 121, 113, 29, 181, 208, 168, 177, 105, 53, 97, 162, 117, 208, 25, 83, 188, 63, 236, 184, 116,
  248, 239, 158, 2, 32, 78, 38, 144, 22, 189, 219, 72, 21, 96, 81, 150, 158, 150, 251, 191, 28, 30, 97, 50, 202, 194,
  130, 117, 219, 33, 208, 178, 157, 115, 173, 81, 199, 195, 255, 255, 255, 255, 174, 169, 208, 19, 216, 192, 152, 143,
  113, 93, 23, 171, 156, 150, 82, 10, 181, 224, 21, 166, 66, 108, 87, 213, 157, 118, 189, 68, 8, 80, 85, 181, 1, 0, 0,
  0, 107, 72, 48, 69, 2, 33, 0, 129, 237, 226, 184, 32, 219, 112, 119, 111, 96, 139, 17, 128, 214, 18, 246, 118, 49,
  234, 205, 130, 80, 251, 91, 215, 226, 131, 197, 172, 55, 85, 67, 2, 32, 1, 147, 136, 115, 154, 3, 77, 227, 64, 103,
  97, 69, 96, 201, 156, 173, 48, 205, 4, 12, 85, 29, 64, 218, 43, 8, 158, 132, 54, 195, 1, 28, 65, 33, 3, 9, 132, 53,
  213, 219, 57, 216, 49, 210, 201, 1, 84, 163, 19, 164, 71, 155, 46, 81, 50, 172, 220, 0, 61, 108, 92, 81, 215, 134,
  128, 78, 177, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 151, 9, 71, 97, 116, 104, 101, 114, 105, 110, 103, 32,
  39, 173, 197, 23, 67, 75, 226, 149, 105, 196, 79, 37, 95, 8, 142, 152, 104, 192, 124, 172, 221, 185, 144, 166, 21, 52,
  13, 153, 161, 102, 134, 101, 70, 48, 68, 2, 32, 85, 71, 178, 181, 183, 117, 60, 128, 153, 106, 239, 213, 51, 77, 151,
  16, 94, 206, 255, 149, 172, 153, 197, 32, 48, 100, 101, 135, 10, 217, 12, 43, 2, 32, 47, 244, 154, 103, 103, 183, 30,
  101, 56, 44, 244, 186, 9, 179, 63, 97, 56, 106, 79, 222, 90, 197, 215, 223, 107, 150, 192, 240, 30, 72, 246, 230, 109,
  117, 33, 3, 128, 163, 55, 102, 184, 146, 119, 46, 138, 201, 110, 52, 156, 243, 238, 211, 69, 98, 164, 7, 119, 132,
  125, 162, 236, 116, 84, 135, 113, 55, 14, 230, 172, 16, 9, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 42, 8, 235, 102, 174,
  91, 200, 11, 11, 113, 207, 48, 100, 10, 23, 125, 207, 144, 193, 238, 136, 172, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 33, 171,
  215, 183, 158, 221, 38, 243, 70, 211, 131, 58, 170, 44, 3, 231, 237, 152, 13, 155, 150, 30, 199, 126, 229, 176, 189,
  102, 63, 10, 111, 24, 1, 0, 0, 0, 106, 71, 48, 68, 2, 32, 73, 193, 5, 83, 88, 47, 239, 215, 186, 74, 226, 105, 255,
  62, 248, 158, 77, 178, 73, 5, 170, 203, 54, 97, 56, 76, 27, 110, 211, 57, 78, 123, 2, 32, 61, 50, 245, 195, 142, 41,
  61, 240, 217, 58, 153, 24, 18, 52, 254, 128, 88, 171, 135, 166, 171, 126, 1, 16, 251, 75, 67, 79, 119, 2, 105, 19, 65,
  33, 2, 186, 190, 181, 128, 51, 144, 194, 251, 161, 195, 193, 141, 70, 118, 26, 195, 177, 196, 167, 18, 192, 55, 102,
  128, 84, 171, 136, 76, 70, 204, 201, 94, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 152, 9, 71, 97, 116, 104, 101,
  114, 105, 110, 103, 32, 187, 218, 84, 226, 225, 67, 59, 112, 246, 171, 151, 41, 205, 105, 181, 25, 239, 195, 238, 172,
  15, 195, 250, 246, 135, 86, 35, 246, 162, 69, 159, 208, 71, 48, 69, 2, 33, 0, 222, 18, 181, 125, 90, 189, 225, 109,
  77, 5, 227, 48, 138, 33, 126, 69, 254, 55, 95, 116, 184, 5, 253, 91, 123, 205, 9, 46, 31, 130, 179, 56, 2, 32, 3, 44,
  204, 163, 37, 130, 249, 162, 96, 173, 145, 154, 156, 205, 105, 47, 222, 169, 196, 224, 216, 145, 151, 105, 220, 42,
  111, 161, 92, 207, 181, 86, 109, 117, 33, 2, 95, 158, 31, 234, 171, 32, 250, 80, 221, 138, 66, 17, 81, 194, 87, 121,
  50, 192, 118, 86, 184, 242, 176, 140, 53, 225, 199, 18, 152, 28, 249, 21, 172, 14, 9, 0, 0, 0, 0, 0, 0, 25, 118, 169,
  20, 242, 208, 125, 210, 1, 114, 233, 153, 238, 255, 190, 23, 23, 171, 83, 92, 138, 54, 246, 76, 136, 172, 0, 0, 0, 0,
  0, 1, 0, 0, 0, 2, 110, 221, 142, 211, 113, 133, 121, 175, 242, 206, 24, 221, 74, 47, 164, 184, 213, 46, 158, 130, 180,
  114, 118, 22, 60, 20, 19, 146, 84, 64, 185, 171, 0, 0, 0, 0, 73, 72, 48, 69, 2, 33, 0, 170, 226, 110, 180, 64, 146,
  173, 123, 109, 61, 183, 222, 149, 151, 204, 229, 156, 126, 120, 0, 112, 234, 21, 99, 19, 239, 80, 31, 122, 84, 94,
  243, 2, 32, 100, 237, 67, 136, 3, 67, 211, 181, 63, 84, 241, 71, 44, 204, 218, 51, 154, 177, 145, 208, 141, 114, 146,
  47, 174, 255, 107, 103, 113, 245, 105, 229, 195, 255, 255, 255, 255, 110, 221, 142, 211, 113, 133, 121, 175, 242, 206,
  24, 221, 74, 47, 164, 184, 213, 46, 158, 130, 180, 114, 118, 22, 60, 20, 19, 146, 84, 64, 185, 171, 1, 0, 0, 0, 107,
  72, 48, 69, 2, 33, 0, 187, 50, 145, 237, 80, 150, 54, 194, 24, 101, 222, 3, 215, 233, 161, 237, 163, 4, 253, 195, 212,
  30, 10, 220, 90, 139, 149, 100, 214, 114, 39, 56, 2, 32, 108, 100, 194, 156, 35, 15, 198, 235, 158, 234, 9, 149, 98,
  171, 79, 121, 26, 230, 231, 70, 59, 78, 243, 196, 233, 12, 54, 191, 186, 145, 121, 99, 65, 33, 2, 244, 42, 37, 120,
  18, 252, 23, 187, 89, 35, 215, 21, 142, 253, 172, 34, 235, 125, 161, 252, 221, 210, 135, 224, 13, 178, 143, 158, 187,
  193, 116, 46, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 153, 10, 80, 114, 111, 99, 101, 115, 115, 105, 110, 103,
  32, 122, 208, 37, 32, 117, 3, 217, 179, 192, 88, 140, 57, 68, 225, 40, 140, 220, 51, 201, 253, 245, 146, 134, 84, 135,
  177, 143, 9, 179, 71, 102, 105, 71, 48, 69, 2, 33, 0, 166, 15, 9, 148, 241, 149, 73, 41, 191, 253, 141, 170, 9, 55,
  50, 39, 154, 99, 7, 156, 86, 227, 152, 189, 3, 229, 1, 218, 58, 242, 141, 204, 2, 32, 34, 153, 168, 7, 25, 174, 186,
  179, 90, 139, 251, 248, 92, 214, 88, 21, 41, 21, 94, 220, 236, 206, 132, 36, 189, 232, 167, 223, 229, 93, 210, 26,
  109, 117, 33, 3, 122, 224, 16, 236, 137, 42, 108, 33, 209, 28, 5, 129, 16, 135, 219, 155, 74, 99, 240, 128, 136, 27,
  75, 167, 114, 39, 46, 154, 233, 163, 53, 37, 172, 13, 9, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 117, 49, 253, 23, 174,
  17, 143, 55, 238, 78, 231, 124, 223, 17, 109, 176, 169, 203, 63, 163, 136, 172, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 164, 69,
  84, 219, 142, 94, 189, 212, 94, 127, 216, 186, 235, 68, 218, 200, 29, 93, 85, 143, 239, 7, 20, 19, 227, 37, 123, 39,
  34, 157, 158, 121, 1, 0, 0, 0, 107, 72, 48, 69, 2, 33, 0, 207, 62, 176, 67, 139, 118, 234, 171, 8, 5, 55, 65, 133,
  234, 17, 106, 163, 58, 185, 224, 131, 57, 35, 30, 212, 132, 105, 57, 155, 128, 139, 70, 2, 32, 84, 0, 232, 58, 122,
  76, 172, 2, 74, 1, 203, 100, 28, 236, 116, 48, 145, 193, 70, 159, 19, 174, 218, 108, 221, 71, 5, 175, 198, 152, 2, 9,
  65, 33, 2, 212, 74, 192, 116, 103, 39, 76, 243, 222, 56, 153, 200, 126, 45, 244, 247, 80, 93, 151, 151, 121, 45, 145,
  36, 239, 155, 173, 73, 209, 130, 130, 100, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 153, 10, 80, 114, 111, 99,
  101, 115, 115, 105, 110, 103, 32, 71, 113, 135, 159, 61, 244, 11, 78, 150, 218, 207, 111, 183, 0, 67, 22, 36, 225,
  216, 12, 209, 241, 216, 121, 172, 21, 190, 117, 163, 112, 13, 218, 71, 48, 69, 2, 33, 0, 239, 232, 140, 151, 234, 155,
  250, 70, 85, 231, 13, 90, 208, 11, 194, 157, 53, 131, 225, 252, 212, 116, 242, 83, 210, 183, 255, 140, 105, 202, 61,
  1, 2, 32, 89, 170, 64, 202, 194, 152, 39, 106, 12, 161, 59, 142, 71, 79, 223, 215, 253, 63, 23, 58, 252, 192, 33, 226,
  179, 21, 80, 172, 163, 220, 250, 229, 109, 117, 33, 3, 11, 121, 157, 203, 68, 133, 28, 66, 255, 168, 249, 201, 212,
  169, 247, 204, 192, 94, 35, 48, 82, 33, 229, 207, 134, 121, 152, 190, 147, 140, 36, 241, 172, 11, 9, 0, 0, 0, 0, 0, 0,
  25, 118, 169, 20, 170, 167, 118, 0, 236, 22, 117, 40, 249, 214, 221, 71, 235, 187, 141, 164, 126, 11, 236, 42, 136,
  172, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 108, 189, 191, 127, 12, 61, 166, 205, 45, 250, 97, 24, 178, 238, 29, 79, 98, 81,
  145, 56, 44, 21, 66, 220, 187, 29, 150, 82, 234, 98, 115, 168, 0, 0, 0, 0, 73, 72, 48, 69, 2, 33, 0, 156, 8, 26, 112,
  125, 153, 201, 216, 48, 164, 148, 57, 186, 40, 133, 134, 235, 176, 2, 70, 0, 1, 248, 133, 148, 137, 224, 247, 207, 72,
  74, 101, 2, 32, 72, 56, 194, 80, 82, 141, 214, 12, 97, 91, 118, 204, 113, 146, 4, 25, 127, 113, 219, 143, 141, 173,
  135, 238, 110, 155, 231, 138, 136, 172, 20, 10, 195, 255, 255, 255, 255, 108, 189, 191, 127, 12, 61, 166, 205, 45,
  250, 97, 24, 178, 238, 29, 79, 98, 81, 145, 56, 44, 21, 66, 220, 187, 29, 150, 82, 234, 98, 115, 168, 1, 0, 0, 0, 106,
  71, 48, 68, 2, 32, 82, 74, 50, 73, 133, 215, 96, 65, 54, 65, 198, 22, 113, 22, 150, 24, 138, 220, 20, 185, 130, 18,
  96, 45, 90, 100, 73, 6, 142, 197, 134, 181, 2, 32, 16, 205, 220, 155, 21, 253, 187, 165, 51, 115, 200, 57, 154, 202,
  11, 135, 23, 31, 207, 231, 78, 210, 179, 254, 89, 183, 213, 255, 67, 29, 154, 162, 65, 33, 2, 36, 240, 26, 152, 94,
  79, 15, 11, 159, 5, 120, 200, 241, 133, 239, 215, 128, 181, 119, 147, 107, 235, 82, 231, 104, 199, 26, 63, 199, 211,
  44, 143, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 155, 12, 84, 114, 97, 110, 115, 109, 105, 115, 115, 105, 111,
  110, 32, 39, 72, 24, 103, 122, 170, 132, 55, 133, 166, 8, 111, 191, 18, 136, 196, 75, 222, 47, 170, 73, 187, 47, 161,
  88, 186, 246, 16, 180, 12, 18, 137, 71, 48, 69, 2, 33, 0, 151, 119, 215, 109, 118, 191, 61, 231, 180, 56, 47, 108,
  121, 81, 118, 179, 31, 64, 159, 167, 252, 142, 14, 21, 202, 89, 163, 69, 143, 155, 6, 63, 2, 32, 27, 97, 101, 78, 222,
  56, 60, 219, 37, 85, 231, 130, 241, 11, 150, 35, 191, 192, 105, 133, 116, 153, 140, 12, 73, 226, 201, 208, 180, 251,
  157, 225, 109, 117, 33, 2, 202, 118, 230, 138, 174, 249, 137, 179, 223, 58, 35, 149, 140, 234, 19, 114, 121, 82, 238,
  10, 59, 96, 155, 83, 99, 226, 53, 178, 86, 185, 95, 118, 172, 10, 9, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 62, 12, 143,
  167, 140, 99, 113, 76, 205, 84, 139, 160, 111, 210, 223, 94, 191, 74, 103, 122, 136, 172, 0, 0, 0, 0, 0, 1, 0, 0, 0,
  1, 57, 30, 128, 160, 9, 188, 224, 146, 5, 78, 39, 211, 80, 114, 215, 111, 14, 206, 116, 121, 108, 237, 186, 76, 152,
  44, 108, 38, 65, 112, 204, 178, 1, 0, 0, 0, 106, 71, 48, 68, 2, 32, 32, 93, 60, 191, 3, 190, 86, 247, 230, 0, 224, 55,
  179, 43, 180, 183, 172, 159, 200, 142, 52, 57, 193, 75, 32, 103, 63, 96, 3, 139, 228, 31, 2, 32, 24, 2, 189, 98, 36,
  155, 73, 67, 3, 10, 117, 16, 31, 175, 163, 253, 104, 213, 193, 179, 171, 49, 162, 135, 251, 19, 188, 146, 39, 223, 1,
  53, 65, 33, 2, 46, 239, 224, 107, 21, 193, 103, 21, 189, 184, 117, 78, 198, 91, 234, 146, 183, 187, 177, 21, 27, 189,
  243, 156, 148, 107, 7, 37, 77, 234, 203, 128, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 155, 12, 84, 114, 97,
  110, 115, 109, 105, 115, 115, 105, 111, 110, 32, 24, 4, 9, 80, 213, 90, 127, 116, 1, 132, 27, 48, 41, 89, 243, 171,
  57, 154, 254, 98, 68, 107, 226, 53, 154, 44, 60, 86, 182, 46, 86, 175, 71, 48, 69, 2, 33, 0, 206, 65, 237, 205, 65,
  19, 117, 141, 149, 21, 158, 113, 83, 142, 137, 171, 86, 113, 221, 228, 59, 159, 130, 114, 123, 46, 145, 37, 192, 36,
  106, 25, 2, 32, 2, 174, 184, 123, 134, 25, 164, 12, 2, 99, 64, 195, 240, 26, 134, 43, 12, 174, 63, 84, 252, 96, 164,
  0, 130, 66, 190, 136, 93, 173, 15, 71, 109, 117, 33, 3, 10, 249, 217, 51, 79, 225, 253, 0, 56, 2, 251, 155, 232, 113,
  124, 220, 53, 107, 196, 5, 27, 173, 169, 183, 141, 117, 92, 239, 14, 136, 194, 64, 172, 8, 9, 0, 0, 0, 0, 0, 0, 25,
  118, 169, 20, 254, 31, 126, 151, 156, 186, 112, 154, 50, 33, 68, 190, 203, 53, 55, 142, 125, 170, 84, 163, 136, 172,
  0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 157, 118, 108, 211, 205, 92, 183, 182, 223, 31, 229, 107, 18, 221, 194, 143, 196, 232,
  66, 135, 32, 241, 26, 154, 254, 199, 71, 186, 158, 133, 144, 83, 0, 0, 0, 0, 73, 72, 48, 69, 2, 33, 0, 200, 255, 217,
  164, 8, 172, 183, 217, 32, 111, 201, 37, 27, 5, 121, 163, 216, 49, 109, 168, 114, 169, 18, 78, 187, 149, 218, 194,
  242, 72, 243, 96, 2, 32, 74, 15, 52, 137, 45, 125, 73, 246, 208, 90, 75, 243, 12, 234, 180, 150, 65, 147, 251, 249,
  167, 158, 56, 65, 147, 128, 9, 42, 27, 113, 146, 248, 195, 255, 255, 255, 255, 157, 118, 108, 211, 205, 92, 183, 182,
  223, 31, 229, 107, 18, 221, 194, 143, 196, 232, 66, 135, 32, 241, 26, 154, 254, 199, 71, 186, 158, 133, 144, 83, 1, 0,
  0, 0, 107, 72, 48, 69, 2, 33, 0, 252, 253, 4, 122, 108, 219, 95, 93, 196, 108, 235, 116, 142, 36, 129, 112, 36, 138,
  69, 45, 142, 222, 153, 187, 206, 14, 181, 74, 136, 50, 170, 180, 2, 32, 122, 44, 140, 93, 178, 219, 210, 150, 102,
  203, 23, 233, 34, 144, 76, 92, 30, 30, 240, 46, 186, 163, 172, 188, 254, 242, 69, 139, 196, 77, 43, 133, 65, 33, 2,
  60, 108, 207, 193, 164, 205, 221, 248, 63, 79, 70, 56, 91, 243, 218, 216, 175, 248, 156, 22, 49, 154, 69, 48, 221,
  185, 47, 56, 20, 167, 173, 197, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 149, 7, 83, 116, 111, 114, 97, 103,
  101, 32, 18, 34, 41, 1, 160, 80, 87, 153, 194, 150, 74, 208, 60, 95, 84, 74, 93, 255, 230, 127, 209, 72, 99, 95, 15,
  235, 11, 21, 21, 149, 206, 5, 70, 48, 68, 2, 32, 83, 227, 201, 244, 10, 34, 207, 92, 43, 72, 106, 52, 113, 129, 117,
  23, 6, 170, 138, 52, 245, 14, 26, 105, 139, 81, 3, 245, 61, 75, 190, 165, 2, 32, 44, 120, 95, 239, 1, 49, 249, 68,
  232, 237, 141, 154, 254, 105, 121, 0, 99, 229, 250, 227, 62, 233, 85, 78, 223, 57, 218, 106, 244, 22, 166, 138, 109,
  117, 33, 2, 207, 49, 92, 246, 195, 118, 225, 143, 14, 94, 216, 160, 194, 76, 31, 224, 2, 16, 170, 185, 153, 122, 95,
  158, 65, 127, 11, 109, 43, 196, 39, 92, 172, 7, 9, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 161, 15, 57, 228, 131, 131,
  209, 129, 72, 139, 4, 22, 163, 167, 179, 4, 48, 206, 27, 236, 136, 172, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 104, 44, 157,
  24, 249, 145, 17, 163, 126, 215, 214, 223, 177, 252, 247, 241, 103, 133, 197, 236, 225, 236, 85, 84, 116, 189, 252,
  116, 230, 109, 117, 189, 1, 0, 0, 0, 106, 71, 48, 68, 2, 32, 5, 132, 53, 232, 42, 60, 87, 114, 248, 1, 126, 65, 34, 4,
  171, 6, 5, 234, 245, 166, 95, 203, 174, 138, 208, 106, 212, 206, 1, 105, 25, 255, 2, 32, 114, 99, 233, 178, 238, 114,
  164, 217, 11, 182, 136, 194, 44, 83, 169, 228, 54, 60, 171, 18, 192, 45, 251, 46, 95, 137, 21, 105, 92, 224, 225, 35,
  65, 33, 2, 94, 44, 59, 108, 91, 20, 133, 192, 202, 205, 49, 115, 123, 50, 190, 188, 106, 77, 79, 45, 245, 152, 14, 40,
  248, 96, 123, 183, 252, 122, 181, 51, 255, 255, 255, 255, 2, 1, 0, 0, 0, 0, 0, 0, 0, 149, 7, 83, 116, 111, 114, 97,
  103, 101, 32, 16, 168, 221, 86, 196, 182, 201, 99, 251, 243, 115, 140, 86, 184, 42, 62, 169, 34, 48, 168, 69, 163,
  187, 160, 243, 112, 227, 146, 92, 65, 129, 118, 70, 48, 68, 2, 32, 70, 185, 46, 41, 230, 210, 20, 101, 234, 177, 72,
  8, 96, 5, 129, 100, 35, 218, 148, 84, 79, 119, 219, 232, 217, 14, 21, 202, 194, 43, 181, 222, 2, 32, 11, 229, 172,
  229, 35, 174, 155, 56, 111, 127, 99, 165, 246, 161, 128, 7, 130, 125, 107, 198, 190, 200, 159, 196, 171, 202, 215,
  179, 67, 154, 249, 42, 109, 117, 33, 3, 52, 226, 220, 30, 124, 57, 198, 195, 217, 109, 83, 95, 4, 202, 207, 189, 197,
  156, 234, 23, 39, 227, 249, 138, 47, 148, 9, 5, 244, 137, 148, 182, 172, 5, 9, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 8,
  135, 188, 68, 196, 118, 17, 233, 131, 37, 13, 43, 71, 88, 16, 162, 182, 176, 158, 2, 136, 172, 0, 0, 0, 0
]
