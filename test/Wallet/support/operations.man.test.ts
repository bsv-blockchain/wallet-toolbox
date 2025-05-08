import { Beef, Transaction, WalletOutput } from '@bsv/sdk'
import {
  EntityProvenTxReq,
  sdk,
  Services,
  Setup,
  StorageKnex,
  StorageProvider,
  TableOutput,
  TableProvenTxReq,
  TableTransaction,
  TableUser,
  verifyOne,
  verifyOneOrNone
} from '../../../src'
import { _tu, TuEnv } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange, ValidListOutputsArgs } from '../../../src/sdk'
import { LocalWalletTestOptions } from '../../utils/localWalletMethods'
import { Format } from '../../../src/utility/Format'

import * as dotenv from 'dotenv'
dotenv.config()

const chain: sdk.Chain = 'main'

const options: LocalWalletTestOptions = {
  setActiveClient: true,
  useMySQLConnectionForClient: true,
  useTestIdentityKey: false,
  useIdentityKey2: false
}

describe('operations.man tests', () => {
  jest.setTimeout(99999999)

  test('0 review and release all production invalid change utxos', async () => {
    const { env, storage } = await createMainReviewSetup()
    const users = await storage.findUsers({ partial: {} })
    const withInvalid: Record<number, { user: TableUser; outputs: WalletOutput[]; total: number }> = {}
    const vargs: ValidListOutputsArgs = {
      basket: specOpInvalidChange,
      tags: ['release'],
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
    let log = ''
    for (const user of users) {
      const { userId } = user
      const auth = { userId, identityKey: '' }
      let r = await storage.listOutputs(auth, vargs)
      if (r.totalOutputs > 0) {
        const total: number = r.outputs.reduce((s, o) => (s += o.satoshis), 0)
        let l = `userId ${userId}: ${r.totalOutputs} utxos updated, total ${total}, ${user.identityKey}\n`
        for (const o of r.outputs) {
          l += `  ${o.outpoint} ${o.satoshis} now ${o.spendable ? 'spendable' : 'spent'}\n`
        }
        console.log(l)
        log += l
        withInvalid[userId] = { user, outputs: r.outputs, total }
      }
    }
    console.log(log || 'Found zero invalid change outputs.')
    await storage.destroy()
  })

  test.skip('0a review all spendable outputs for userId', async () => {
    const { env, storage } = await createMainReviewSetup()
    const users = await storage.findUsers({ partial: {} })
    const withInvalid: Record<number, { user: TableUser; outputs: WalletOutput[]; total: number }> = {}
    const vargs: ValidListOutputsArgs = {
      basket: specOpInvalidChange,
      tags: ['release', 'all'],
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
    let log = ''
    for (const user of users) {
      const { userId } = user
      const auth = { userId, identityKey: '' }
      let r = await storage.listOutputs(auth, vargs)
      if (r.totalOutputs > 0) {
        const total: number = r.outputs.reduce((s, o) => (s += o.satoshis), 0)
        log += `userId ${userId}: ${r.totalOutputs} unspendable utxos, total ${total}, ${user.identityKey}\n`
        for (const o of r.outputs) {
          log += `  ${o.outpoint} ${o.satoshis}\n`
        }
        withInvalid[userId] = { user, outputs: r.outputs, total }
      }
    }
    console.log(log || 'Found zero invalid change outputs.')
    await storage.destroy()
  })

  test('1 review and unfail false doubleSpends', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    let offset = 2600
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
      console.log(`DoubleSpends OFFSET: ${offset} ${unfails.length} unfails\n${log}`)
      allUnfails = allUnfails.concat(unfails)
      if (reqs.length < limit) break
      offset += reqs.length
    }
    for (const id of allUnfails) {
      await storage.updateProvenTxReq(id, { status: 'unfail' })
    }
    await storage.destroy()
  })

  test('2 review and unfail false invalids', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    let offset = 800
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
      console.log(`Failed OFFSET: ${offset} ${unfails.length} unfails\n${log}`)
      allUnfails = allUnfails.concat(unfails)
      if (reqs.length < limit) break
      offset += reqs.length
    }
    for (const id of allUnfails) {
      await storage.updateProvenTxReq(id, { status: 'unfail' })
    }
    await storage.destroy()
  })

  test.skip('8 re-internalize failed WUI exports', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    const user0 = verifyOne(await storage.findUsers({ partial: { userId: 2 } }))
    const users = await storage.findUsers({ partial: { userId: 141 } }) // 111, 141
    for (const user of users) {
      const { userId, identityKey } = user
      const [outputs] = await storage.knex.raw<TableOutput[][]>(`
        SELECT f.* FROM outputs as f where f.userId = 2 and not f.customInstructions is null
        and JSON_EXTRACT(f.customInstructions, '$.payee') = '${identityKey}'
        and not exists(select * from outputs as r where r.userId = ${userId} and r.txid = f.txid)
        `)
      if (outputs.length > 0) console.log(`userId ${userId} ${identityKey} ${outputs.length} outputs`)
      for (const output of outputs) {
        const req = verifyOneOrNone(
          await storage.findProvenTxReqs({ partial: { txid: output.txid, status: 'completed' } })
        )
        const { type, derivationPrefix, derivationSuffix, payee } = JSON.parse(output.customInstructions!)
        if (req && type === 'BRC29' && derivationPrefix && derivationSuffix) {
          const beef = await storage.getBeefForTransaction(req.txid, {})
          // {"type":"BRC29","derivationPrefix":"LDFooHSsXzw=","derivationSuffix":"4f4ixKv+6SY=","payee":"0352caa755d5b6279e15e47e096db908e7c4a73a31775e7e8720bdd4cf2d44873a"}
          await storage.internalizeAction(
            { userId, identityKey: user.identityKey },
            {
              tx: beef.toBinaryAtomic(req.txid),
              outputs: [
                {
                  outputIndex: 0,
                  protocol: 'wallet payment',
                  paymentRemittance: {
                    derivationPrefix: derivationPrefix,
                    derivationSuffix: derivationSuffix,
                    senderIdentityKey: user0.identityKey
                  }
                }
              ],
              description: 'Internalizing export funds tx into foreign wallet'
            }
          )
          console.log('internalize', userId, output.txid)
        }
      }
    }
    /*
     */
    await storage.destroy()
  })

  test('9 review recent transaction change use', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    const countTxs = await storage.countTransactions({
      partial: { userId: 311 },
      status: ['completed', 'unproven', 'failed']
    })
    const txs = await storage.findTransactions({
      partial: { userId: 311 },
      status: ['unproven', 'completed', 'failed'],
      paged: { limit: 100, offset: Math.max(0, countTxs - 100) }
    })
    for (const tx of txs) {
      const ls = await Format.toLogStringTableTransaction(tx, storage)
      console.log(ls)
    }
    const countReqs = await storage.countProvenTxReqs({ partial: {}, status: ['completed', 'unmined'] })
    const reqs = await storage.findProvenTxReqs({
      partial: {},
      status: ['unmined', 'completed'],
      paged: { limit: 100, offset: countReqs - 100 }
    })
    await storage.destroy()
  })

  // OVERWRITES EXISTING FILE CONTENTS!!!!
  test.skip('10 grab reqs history as local sqlite file', async () => {
    const { env, storage, services } = await createMainReviewSetup()
    const { activeStorage: s2 } = await _tu.createSQLiteTestWallet({
      filePath: `${__dirname}/reqhistory.sqlite`,
      databaseName: 'reqhistory',
      chain: 'main',
      rootKeyHex: '1'.repeat(64),
      dropAll: true
    })
    await s2.makeAvailable()
    const limit = 100
    let offset = 0
    for (;;) {
      const r = await storage.knex.raw(`
        select provenTxReqId as id, txid, status, history
        from proven_tx_reqs
        where history is not null
        limit ${limit} offset ${offset}
      `)
      const reqs = r[0] as { id: number; txid: string; status: sdk.ProvenTxReqStatus; history: string }[]
      for (const req of reqs) {
        const { id, history, status, txid } = req
        await s2.insertProvenTxReq({
          created_at: new Date(),
          updated_at: new Date(),
          provenTxReqId: id,
          status,
          attempts: 0,
          notified: false,
          txid,
          history,
          notify: '',
          rawTx: []
        })
      }
      if (reqs.length < limit) break
      offset += limit
    }
    await s2.destroy()
    await storage.destroy()
  })

  test('11 review reqs history and final outcome', async () => {
    let undouble: number[] = []
    let uninvalid: number[] = []
    let uncompleted: number[] = []
    let deunmined: number[] = []
    let noSuccessCompleted: number[] = []
    let successDouble: number[] = []
    let internalizeDouble: number[] = []
    let successInvalid: number[] = []

    const { activeStorage: storage } = await _tu.createSQLiteTestWallet({
      filePath: `${__dirname}/reqhistory.sqlite`,
      databaseName: 'reqhistory',
      chain: 'main',
      rootKeyHex: '1'.repeat(64),
      dropAll: false
    })
    //const { env, storage, services } = await createMainReviewSetup()
    let limit = 100
    let offset = 0
    let aggSum = -1
    const partial: Partial<TableProvenTxReq> = {}
    let log = ''
    for (;;) {
      const reqs = await storage.findProvenTxReqs({ partial, status: undefined, paged: { limit, offset } })
      for (const reqApi of reqs) {
        if (reqApi.provenTxReqId < 11312) continue
        const r = reviewHistoryNotes(reqApi)
        if (!r) continue
        if (r.isCompleted && r.wasDoubleSpend) {
          undouble.push(reqApi.provenTxReqId)
          let review = ''
          if (r.doubleReview) {
            const rr = r.doubleReview
            review = `0:${rr.status0},1:${rr.status1},2:${rr.status2},Txs:${rr.competingTxs}`
          }
          //log += `undouble ${reqApi.provenTxReqId} arc:${r.brArc} woc:${r.brWoC} bit:${r.brBitails} ${review}\n`
        }
        if (r.isCompleted && r.wasInvalid) {
          uninvalid.push(reqApi.provenTxReqId)
          //log += `uninvalid ${reqApi.provenTxReqId} arc:${r.brArc} woc:${r.brWoC} bit:${r.brBitails}\n`
        }
        if ((r.isDoubleSpend || r.isInvalid) && r.wasCompleted) {
          uncompleted.push(reqApi.provenTxReqId)
        }
        if ((r.isDoubleSpend || r.isInvalid) && r.wasUnmined) {
          if (r.wasInternalize) internalizeDouble.push(reqApi.provenTxReqId)
          else {
            deunmined.push(reqApi.provenTxReqId)
            log += `deunmined ${reqApi.provenTxReqId} arc:${r.brArc} woc:${r.brWoC} bit:${r.brBitails}\n`
          }
        }
        if (r.aggregate && r.aggregate.successCount === 0 && r.isCompleted) {
          noSuccessCompleted.push(reqApi.provenTxReqId)
        }
        if (r.aggregate && r.aggregate.successCount > 0 && r.isDoubleSpend) {
          successDouble.push(reqApi.provenTxReqId)
        }
        if (r.aggregate && r.aggregate.successCount > 0 && r.isInvalid) {
          successInvalid.push(reqApi.provenTxReqId)
        }
        if (r.aggregate && r.aggSum !== aggSum) {
          log += `aggSum changed ${aggSum} to ${r.aggSum} reqId=${reqApi.provenTxReqId}\n`
          aggSum = r.aggSum
        }
      }
      if (reqs.length < limit) break
      offset += limit
    }
    if (undouble.length > 0) log += `undouble: ${JSON.stringify(undouble)}\n`
    if (uninvalid.length > 0) log += `uninvalid: ${JSON.stringify(uninvalid)}\n`
    if (uncompleted.length > 0) log += `uncompleted: ${JSON.stringify(uncompleted)}\n`
    if (deunmined.length > 0) log += `deunmined: ${JSON.stringify(deunmined)}\n`
    if (internalizeDouble.length > 0) log += `internalizeDouble: ${JSON.stringify(internalizeDouble)}\n`
    if (noSuccessCompleted.length > 0) log += `noSuccessCompleted: ${JSON.stringify(noSuccessCompleted)}\n`
    if (successDouble.length > 0) log += `successDouble: ${JSON.stringify(successDouble)}\n`
    if (successInvalid.length > 0) log += `successInvalid: ${JSON.stringify(successInvalid)}\n`
    console.log(log)
    await storage.destroy()
  })

  const uninvalid = [
    10822, 12228, 14884, 14948, 1654, 1649, 2654, 2655, 2656, 2658, 2659, 2660, 2661, 2662, 2663, 2664, 2665, 2666,
    2667, 2669, 2707, 2719, 2723, 2724, 2726
  ]

  const undouble = [
    10732, 12303, 12476, 14084, 14111, 14956, 14972, 14874, 14789, 14810, 14813, 14817, 14588, 14640, 14641, 14531,
    2753, 2653, 2657, 2670, 2671, 2681, 2684, 2691, 2732, 4343, 4222, 4124, 4148, 3873, 3735, 3514, 3537, 5074, 5125,
    4958, 4977, 4730, 4365
  ]

  const deunmined = [
    12304, 12305, 12306, 12307, 12480, 12483, 12484, 12488, 12489, 12490, 12497, 14085, 14086, 14087, 14814, 14816,
    14821, 14953, 15170
  ]

  test('12 review deunmined reqs', async () => {
    const { env, storage, services } = await createMainReviewSetup()

    const chaintracker = await services.getChainTracker()

    let log = ''
    for (const id of deunmined) {
      const reqApi = await storage.findProvenTxReqById(id)
      if (!reqApi) continue
      const beef = new Beef()
      beef.mergeRawTx(reqApi.rawTx!)
      if (reqApi.inputBEEF) beef.mergeBeef(reqApi.inputBEEF)
      let tx = beef.findTxid(reqApi.txid)!.tx!
      let allInputsFound = true
      for (const input of tx.inputs) {
        if (beef.findTxid(input.sourceTXID!)) continue
        try {
          const ib = await storage.getBeefForTransaction(input.sourceTXID!, {})
          if (ib) beef.mergeBeef(ib)
        } catch (e) {
          log += `${reqApi.provenTxReqId} input ${input.sourceTXID} missing from inputBEEF\n`
          allInputsFound = false
        }
      }
      if (allInputsFound) {
        tx = beef.findAtomicTransaction(reqApi.txid)!
        try {
          const ok = await tx.verify('scripts only')
          log += `${reqApi.provenTxReqId} ${reqApi.txid} ${ok ? 'OK' : 'FAIL'}\n`
        } catch (e: unknown) {
          log += `${reqApi.provenTxReqId} ${reqApi.txid} ${sdk.WalletError.fromUnknown(e).message}\n`
        }
      }
    }
    console.log(log)

    await storage.destroy()
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

function reviewHistoryNotes(reqApi: TableProvenTxReq): HistoryReviewInfo | undefined {
  const r: HistoryReviewInfo = {
    req: new EntityProvenTxReq(reqApi),
    wasDoubleSpend: false,
    wasInvalid: false,
    wasCompleted: false,
    wasUnmined: false,
    wasInternalize: false,
    isDoubleSpend: false,
    isInvalid: false,
    isCompleted: false,
    aggSum: 0,
    aggregate: undefined
  }
  if (!r.req.history?.notes) return undefined
  for (const note of r.req.history.notes) {
    if (note.what === 'status') {
      const statusWas = note.status_was as sdk.ProvenTxReqStatus
      const statusNow = note.status_now as sdk.ProvenTxReqStatus
      if (statusNow === 'doubleSpend') {
        r.isDoubleSpend = r.wasDoubleSpend = true
        r.isInvalid = false
        r.isCompleted = false
      } else if (statusNow === 'invalid') {
        r.isDoubleSpend = false
        r.isInvalid = r.wasInvalid = true
        r.isCompleted = false
      } else if (statusNow === 'completed') {
        r.isDoubleSpend = false
        r.isInvalid = false
        r.isCompleted = r.wasCompleted = true
      } else if (statusNow === 'unmined') {
        r.isDoubleSpend = false
        r.isInvalid = false
        r.wasUnmined = true
      }
    } else if (note.what === 'aggregateResults') {
      r.aggregate = {
        successCount: note.successCount as number,
        doubleSpendCount: note.doubleSpendCount as number,
        statusErrorCount: note.statusErrorCount as number,
        serviceErrorCount: note.serviceErrorCount as number,
        newReqStatus: note.newReqStatus as sdk.ProvenTxReqStatus
      }
      const a = r.aggregate
      r.aggSum = a.doubleSpendCount + a.statusErrorCount + a.serviceErrorCount + a.successCount
    } else if (note.what === 'confirmDoubleSpend') {
      r.doubleReview = {
        status0: note.getStatus0 as string,
        status1: note.getStatus1 as string,
        status2: note.getStatus2 as string,
        competingTxs: note.competingTxs as string
      }
    } else if (note.what === 'internalizeAction') {
      r.wasInternalize = true
    }

    if (note.name === 'WoCpostRawTx') {
      if (note.what === 'postRawTxErrorMissingInputs') {
        r.brWoC = 'missingInputs'
      } else if (note.what === 'postRawTxError') {
        if (note.status === 504) {
          r.brWoC = 'serviceError'
        }
      }
    } else if (note.name === 'WoCpostBeef') {
      if (note.what === 'postBeefSuccess') {
        r.brWoC = 'success'
      } else if (note.what === 'postBeefError' && r.brWoC === undefined) {
        r.brWoC = 'invalidTx'
      }
    } else if (note.name === 'ARCpostBeef') {
      if (note.what === 'postBeefGetTxDataSuccess') {
        if (note.txStatus === 'STORED') r.brArc = 'success'
      }
    } else if (note.name === 'ARCv1tx') {
      if (note.what === 'postRawTxDoubleSpend') {
        if (note.txStatus === 'DOUBLE_SPEND_ATTEMPTED') r.brArc = 'doubleSpend'
      } else if (note.what === 'postRawTxError') {
        if (note.status === 469) r.brArc = 'badRoots'
        else if (note.status === 463) r.brArc = 'badBump'
      } else if (note.what === 'postRawTxSuccess') {
        if (note.txStatus === 'ANNOUNCED_TO_NETWORK') r.brArc = 'success'
        else if (note.txStatus === 'SEEN_ON_NETWORK') r.brArc = 'success'
        else if (note.txStatus === 'REQUESTED_BY_NETWORK') r.brArc = 'success'
      }
    } else if (note.name === 'BitailsPostRawTx') {
      if (note.what === 'postRawsSuccess') {
        r.brBitails = 'success'
      } else if (note.what === 'postRawsSuccessAlreadyInMempool') {
        r.brBitails = 'success'
      } else if (note.what === 'postRawsErrorMissingInputs') {
        r.brBitails = 'invalidTx'
      } else if (note.what === 'postRawsError') {
        if (note.code === -26) {
          r.brBitails = 'invalidTx'
        } else if (note.code === -1) {
          r.brBitails = 'serviceError'
        } else if (note.code === 'ESOCKETTIMEDOUT') {
          r.brBitails = 'serviceError'
        }
      }
    }
  }
  return r
}

interface HistoryReviewInfo {
  brArc?: string
  brWoC?: string
  brBitails?: string
  req: EntityProvenTxReq
  wasDoubleSpend: boolean
  wasInvalid: boolean
  wasCompleted: boolean
  wasUnmined: boolean
  wasInternalize: boolean
  isDoubleSpend: boolean
  isInvalid: boolean
  isCompleted: boolean
  aggSum: number
  aggregate?: {
    successCount: number
    doubleSpendCount: number
    statusErrorCount: number
    serviceErrorCount: number
    newReqStatus: sdk.ProvenTxReqStatus
  }
  doubleReview?: {
    status0: string
    status1: string
    status2: string
    competingTxs: string
  }
}
