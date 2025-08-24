import { Beef, PrivateKey, SignActionArgs, WalletOutput } from '@bsv/sdk'
import { sdk, Services, Setup, StorageKnex, TableUser } from '../../../src'
import { _tu, TuEnv } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange, ValidListOutputsArgs, WERR_REVIEW_ACTIONS } from '../../../src/sdk'
import {
  burnOneSatTestOutput,
  createMainReviewSetup,
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
    //const log = await setup.monitor.runTask('UnFail')
    //if (log) console.log(log)
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

  test('8 Beef verifier', async () => {
    const setup = await createSetup(chain, options)
    // replace bb with beef to test
    const bb = new Beef().toBinary()
    const beef = Beef.fromBinary(bb)
    console.log(beef.toLogString())
    const ok = await beef.verify(await setup.services.getChainTracker())
    await setup.wallet.destroy()
  })

  test.skip('9 received payment from wif and outpoint', async () => {
    const setup = await createSetup(chain, options)
    console.log(`active store ${setup.wallet.storage.getActiveStore()}`)
    if (!setup.wallet.storage.isActiveEnabled) throw new Error('Active storage is not enabled.')

    const pk = PrivateKey.fromWif('L4ZRWA...Nw4Brt8rvJLRZegPF2oiBKJaxUgr4e')
    const outpoint = { txid: '5e2965a50618425af21bebddb9aa60c3e12f64c8e1eb44b6589273455a9760e9', vout: 0 }
    const address = pk.toAddress()
    console.log(`address: ${address.toString()}`)

    const inputBEEF = await setup.activeStorage.getBeefForTransaction(outpoint.txid, { ignoreStorage: true })
    const btx = inputBEEF.findTxid(outpoint.txid)
    const satoshis = btx!.tx!.outputs[0]!.satoshis!

    const unlock = Setup.getUnlockP2PKH(pk, satoshis)

    const label = 'inputBrayden257'

    const car = await setup.wallet.createAction({
      inputBEEF: inputBEEF.toBinary(),
      inputs: [
        {
          outpoint: `${outpoint.txid}.${outpoint.vout}`,
          unlockingScriptLength: 108,
          inputDescription: label
        }
      ],
      labels: [label],
      description: label
    })

    const st = car.signableTransaction!
    const beef = Beef.fromBinary(st.tx)
    const tx = beef.findAtomicTransaction(beef.txs.slice(-1)[0].txid)!
    tx.inputs[0].unlockingScriptTemplate = unlock
    await tx.sign()
    const unlockingScript = tx.inputs[0].unlockingScript!.toHex()

    const signArgs: SignActionArgs = {
      reference: st.reference,
      spends: { 0: { unlockingScript } },
      options: {
        acceptDelayedBroadcast: false
      }
    }

    const sar = await setup.wallet.signAction(signArgs)

    {
      const beef = Beef.fromBinary(sar.tx!)
      const txid = sar.txid!

      console.log(`
BEEF
${beef.toHex()}
${beef.toLogString()}
`)
    }
    await setup.wallet.destroy()
  })
})
