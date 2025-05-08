import { Beef, Transaction, WalletOutput } from '@bsv/sdk'
import {
  EntityProvenTxReq,
  sdk,
  Services,
  Setup,
  StorageKnex,
  TableOutput,
  TableProvenTxReq,
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

describe('reqErrorReview.2025.05.06.man tests', () => {
  jest.setTimeout(99999999)

  // OVERWRITES EXISTING FILE CONTENTS!!!!
  test.skip('0 grab reqs history as local sqlite file', async () => {
    const { env, storage, services } = await _tu.createMainReviewSetup()
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

  test('1 review reqs history and final outcome', async () => {
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
    //const { env, storage, services } = await _tu.createMainReviewSetup()
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

  test('2 review deunmined reqs', async () => {
    const { env, storage, services } = await _tu.createMainReviewSetup()

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
      let ilog = ''
      for (const input of tx.inputs) {
        if (beef.findTxid(input.sourceTXID!)) continue
        try {
          const ib = await storage.getBeefForTransaction(input.sourceTXID!, {})
          if (ib) beef.mergeBeef(ib)
        } catch (e) {
          if (input.sourceTXID) {
            const r2 = verifyOneOrNone(await storage.findProvenTxReqs({ partial: { txid: input.sourceTXID } }))
            if (r2 && r2.rawTx) {
              const itx = Transaction.fromBinary(r2.rawTx)
              ilog += 'missing input ' + Format.toLogStringTransaction(itx)
            }
          }
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
      } else {
        log += `${reqApi.provenTxReqId} FAILED `
        log += Format.toLogStringBeefTxid(beef, reqApi.txid)
        log += ilog
      }
    }
    console.log(log)

    await storage.destroy()
  })
})

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
