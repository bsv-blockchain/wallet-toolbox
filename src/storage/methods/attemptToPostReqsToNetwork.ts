import { Beef, Transaction } from '@bsv/sdk'
import { StorageProvider } from '../StorageProvider'
import { EntityProvenTxReq } from '../schema/entities'
import { sdk } from '../../index.client'
import { ReqHistoryNote } from '../../sdk'

/**
 * Attempt to post one or more `ProvenTxReq` with status 'unsent'
 * to the bitcoin network.
 *
 * @param reqs
 */
export async function attemptToPostReqsToNetwork(
  storage: StorageProvider,
  reqs: EntityProvenTxReq[],
  trx?: sdk.TrxToken
): Promise<PostReqsToNetworkResult> {
  // initialize results, validate reqs ready to post, txids are of the transactions in the beef that we care about.

  const { r, vreqs, txids } = await validateReqsAndMergeBeefs(storage, reqs, trx)

  const services = storage.getServices()

  const pbrs = await services.postBeef(r.beef, txids)

  // post beef results (pbrs) is an array by service provider
  // for each service provider, there's an aggregate result and individual results by txid.

  await transferNotesToReqHistories(txids, vreqs, pbrs, storage, trx)

  const apbrs = aggregatePostBeefResultsByTxid(txids, vreqs, pbrs)

  await updateReqsFromAggregateResults(txids, r, apbrs, storage, services, trx)

  return r
}

async function validateReqsAndMergeBeefs(
  storage: StorageProvider,
  reqs: EntityProvenTxReq[],
  trx?: sdk.TrxToken
): Promise<{ r: PostReqsToNetworkResult; vreqs: PostReqsToNetworkDetails[]; txids: string[] }> {
  const r: PostReqsToNetworkResult = {
    status: 'success',
    beef: new Beef(),
    details: [],
    log: ''
  }

  const vreqs: PostReqsToNetworkDetails[] = []

  for (const req of reqs) {
    try {
      const noRawTx = !req.rawTx
      const noTxIds = !req.notify.transactionIds || req.notify.transactionIds.length < 1
      const noInputBEEF = !req.inputBEEF
      if (noRawTx || noTxIds || noInputBEEF) {
        // This should have happened earlier...
        req.addHistoryNote({ when: new Date().toISOString(), what: 'validateReqFailed', noRawTx, noTxIds, noInputBEEF })
        req.status = 'invalid'
        await req.updateStorageDynamicProperties(storage, trx)
        r.details.push({ txid: req.txid, req, status: 'invalid' })
      } else {
        const vreq: PostReqsToNetworkDetails = { txid: req.txid, req, status: 'unknown' }
        await storage.mergeReqToBeefToShareExternally(req.api, r.beef, [], trx)
        vreqs.push(vreq)
        r.details.push(vreq)
      }
    } catch (eu: unknown) {
      const { code, message } = sdk.WalletError.fromUnknown(eu)
      req.addHistoryNote({ when: new Date().toISOString(), what: 'validateReqError', txid: req.txid, code, message })
      req.attempts++
      if (req.attempts > 6) {
        req.status = 'invalid'
        r.details.push({ txid: req.txid, req, status: 'invalid' })
      }
      await req.updateStorageDynamicProperties(storage, trx)
    }
  }
  return { r, vreqs, txids: vreqs.map(r => r.txid) }
}

async function transferNotesToReqHistories(
  txids: string[],
  vreqs: PostReqsToNetworkDetails[],
  pbrs: sdk.PostBeefResult[],
  storage: StorageProvider,
  trx?: sdk.TrxToken
): Promise<void> {
  for (const txid of txids) {
    const vreq = vreqs.find(r => r.txid === txid)
    if (!vreq) throw new sdk.WERR_INTERNAL()
    const notes: sdk.ReqHistoryNote[] = []
    for (const pbr of pbrs) {
      notes.push(...(pbr.notes || []))
      const r = pbr.txidResults.find(tr => tr.txid === txid)
      if (r) notes.push(...(r.notes || []))
    }
    for (const n of notes) {
      vreq.req.addHistoryNote(n)
    }
    await vreq.req.updateStorageDynamicProperties(storage, trx)
  }
}

/**
 * For each txid, decide on the aggregate success or failure of attempting to broadcast it to the bitcoin processing network.
 *
 * Possible results:
 * 1. Success: At least one success, no double spends.
 * 2. DoubleSpend: One or more double spends.
 * 3. InvalidTransaction: No success, no double spend, one or more non-exception errors.
 * 4. Service Failure: No results or all results are exception errors.
 *
 * @param txids
 * @param reqs
 * @param pbrs
 * @param storage
 * @returns
 */
function aggregatePostBeefResultsByTxid(
  txids: string[],
  vreqs: PostReqsToNetworkDetails[],
  pbrs: sdk.PostBeefResult[]
): Record<string, AggregatePostBeefTxResult> {
  const r: Record<string, AggregatePostBeefTxResult> = {}

  for (const txid of txids) {
    const vreq = vreqs.find(r => r.txid === txid)!
    const ar: AggregatePostBeefTxResult = {
      txid,
      vreq,
      txidResults: [],
      status: 'success',
      successCount: 0,
      doubleSpendCount: 0,
      statusErrorCount: 0,
      serviceErrorCount: 0,
      competingTxs: [],
      spentInputs: []
    }
    r[txid] = ar
    for (const pbr of pbrs) {
      const tr = pbr.txidResults.find(tr => tr.txid === txid)
      if (tr) {
        ar.txidResults.push(tr)
        if (tr.status === 'success') ar.successCount++
        else if (tr.doubleSpend) {
          ar.doubleSpendCount++
          if (tr.competingTxs) {
            ar.competingTxs = [...tr.competingTxs]
          }
        } else if (tr.serviceError) ar.serviceErrorCount++
        else ar.statusErrorCount++
      }
      if (ar.competingTxs.length > 1) ar.competingTxs = [...new Set(ar.competingTxs)] // Remove duplicates
    }

    if (ar.successCount > 0 && ar.doubleSpendCount === 0) ar.status = 'success'
    else if (ar.doubleSpendCount > 0) ar.status = 'doubleSpend'
    else if (ar.statusErrorCount > 0) ar.status = 'invalidTx'
    else ar.status = 'serviceError'
  }

  return r
}

/**
 * For each txid in submitted `txids`:
 *
 *   Based on its aggregate status, and whether broadcast happening in background (isDelayed) or immediately (!isDelayed),
 *   and iff current req.status is not 'unproven' or 'completed':
 *
 *     'success':
 *       req.status => 'unmined', tx.status => 'unproven'
 *     'doubleSpend':
 *       req.status => 'doubleSpend', tx.status => 'failed'
 *     'invalidTx':
 *       req.status => 'invalid', tx.status => 'failed'
 *     'serviceError':
 *       increment req.attempts
 *
 * @param txids
 * @param apbrs
 * @param storage
 * @param services if valid, doubleSpend results will be verified (but only if not within a trx. e.g. trx must be undefined)
 * @param trx
 */
async function updateReqsFromAggregateResults(
  txids: string[],
  r: PostReqsToNetworkResult,
  apbrs: Record<string, AggregatePostBeefTxResult>,
  storage: StorageProvider,
  services?: sdk.WalletServices,
  trx?: sdk.TrxToken
): Promise<void> {
  for (const txid of txids) {
    const ar = apbrs[txid]!
    const req = ar.vreq.req
    await req.refreshFromStorage(storage, trx)

    const { successCount, doubleSpendCount, statusErrorCount, serviceErrorCount } = ar
    const note: ReqHistoryNote = {
      when: new Date().toISOString(),
      what: 'aggregateResults',
      reqStatus: req.status,
      aggStatus: ar.status,
      attempts: req.attempts,
      successCount,
      doubleSpendCount,
      statusErrorCount,
      serviceErrorCount
    }

    if (['completed', 'unmined'].indexOf(req.status) >= 0)
      // However it happened, don't degrade status if it is somehow already beyond broadcast stage
      continue

    if (ar.status === 'doubleSpend' && services && !trx) await confirmDoubleSpend(ar, r.beef, storage, services)

    let newReqStatus: sdk.ProvenTxReqStatus | undefined = undefined
    let newTxStatus: sdk.TransactionStatus | undefined = undefined
    switch (ar.status) {
      case 'success':
        newReqStatus = 'unmined'
        newTxStatus = 'unproven'
        break
      case 'doubleSpend':
        newReqStatus = 'doubleSpend'
        newTxStatus = 'failed'
        break
      case 'invalidTx':
        newReqStatus = 'invalid'
        newTxStatus = 'failed'
        break
      case 'serviceError':
        newReqStatus = 'sending'
        newTxStatus = 'sending'
        req.attempts++
        break
      default:
        throw new sdk.WERR_INTERNAL(`unimplemented AggregateStatus ${ar.status}`)
    }

    note.newReqStatus = newReqStatus
    note.newTxStatus = newTxStatus
    note.newAttempts = req.attempts

    if (newReqStatus) req.status = newReqStatus

    req.addHistoryNote(note)
    await req.updateStorageDynamicProperties(storage, trx)

    if (newTxStatus) {
      const ids = req.notify.transactionIds
      if (ids) {
        // Also set generated outputs to spendable false and consumed input outputs to spendable true (and clears their spentBy).
        await storage.updateTransactionsStatus(ids, newTxStatus, trx)
      }
    }

    // Transfer critical results to details going back to the user
    const details = r.details.find(d => d.txid === txid)!
    details.status = ar.status
    details.competingTxs = ar.competingTxs
    details.spentInputs = ar.spentInputs
  }
}

/**
 * Requires ar.status === 'doubleSpend'
 *
 * Parse the rawTx and review each input as a possible double spend.
 *
 * If all inputs appear to be unspent, update aggregate status to 'success' if successCount > 0, otherwise 'serviceError'.
 *
 * @param ar
 * @param storage
 * @param services
 */
async function confirmDoubleSpend(
  ar: AggregatePostBeefTxResult,
  beef: Beef,
  storage: StorageProvider,
  services: sdk.WalletServices
): Promise<void> {
  const req = ar.vreq.req
  const note: ReqHistoryNote = { when: new Date().toISOString(), what: 'confirmDoubleSpend' }
  const tx = Transaction.fromBinary(req.rawTx)
  ar.spentInputs = []
  let vin = -1
  for (const input of tx.inputs) {
    vin++
    const sourceTx = beef.findTxid(input.sourceTXID!)?.tx
    if (!sourceTx) throw new sdk.WERR_INTERNAL(`beef lacks tx for ${input.sourceTXID}`)
    const lockingScript = sourceTx.outputs[input.sourceOutputIndex].lockingScript.toHex()
    const hash = services.hashOutputScript(lockingScript)
    const usr = await services.getUtxoStatus(hash, undefined, `${input.sourceTXID}.${input.sourceOutputIndex}`)
    if (usr.isUtxo === false) {
      ar.spentInputs.push({
        vin,
        scriptHash: hash,
        sourceTXID: input.sourceTXID!,
        sourceIndex: input.sourceOutputIndex
      })
    }
  }
  note.vins = ar.spentInputs.map(si => si.vin.toString()).join(',')
  if (ar.spentInputs.length === 0) {
    // Possibly NOT a double spend...
    if (ar.successCount > 0) ar.status = 'success'
    else ar.status = 'serviceError'
    note.newStatus = ar.status
  } else {
    // Confirmed double spend.
    const competingTxids = new Set(ar.competingTxs)
    for (const si of ar.spentInputs) {
      const shhrs = await services.getScriptHashHistory(si.scriptHash)
      if (shhrs.status === 'success') {
        for (const h of shhrs.history) {
          if (h.txid !== si.sourceTXID) competingTxids.add(h.txid)
        }
      }
    }
    ar.competingTxs = [...competingTxids].slice(0, 24) // keep at most 24, if they were sorted by time, keep oldest
    note.competingTxs = ar.competingTxs.join(',')
  }
  req.addHistoryNote(note)
}

type AggregateStatus = 'success' | 'doubleSpend' | 'invalidTx' | 'serviceError'

interface AggregatePostBeefTxResult {
  txid: string
  txidResults: sdk.PostTxResultForTxid[]
  status: AggregateStatus
  vreq: PostReqsToNetworkDetails
  successCount: number
  doubleSpendCount: number
  statusErrorCount: number
  serviceErrorCount: number
  /**
   * Any competing double spend txids reported for this txid
   */
  competingTxs: string[]
  /**
   * Input indices that have been spent, valid when status is 'doubleSpend'
   */
  spentInputs: { vin: number; scriptHash: string; sourceTXID: string; sourceIndex: number }[]
}

/**
 * Indicates status of a new Action following a `createAction` or `signAction` in immediate mode:
 * When `acceptDelayedBroadcast` is falses.
 *
 * 'success': The action has been broadcast and accepted by the bitcoin processing network.
 * 'doulbeSpend': The action has been confirmed to double spend one or more inputs, and by the "first-seen-rule" is the loosing transaction.
 * 'invalidTx': The action was rejected by the processing network as an invalid bitcoin transaction.
 * 'serviceError': The broadcast services are currently unable to reach the bitcoin network. The action is now queued for delayed retries.
 *
 * 'invalid': The action was in an invalid state for processing, this status should never be seen by user code.
 * 'unknown': An internal processing error has occured, this status should never be seen by user code.
 *
 */
export type PostReqsToNetworkDetailsStatus =
  | 'success'
  | 'doubleSpend'
  | 'unknown'
  | 'invalid'
  | 'serviceError'
  | 'invalidTx'

export interface PostReqsToNetworkDetails {
  txid: string
  req: EntityProvenTxReq
  status: PostReqsToNetworkDetailsStatus
  /**
   * Any competing double spend txids reported for this txid
   */
  competingTxs?: string[]
  /**
   * Input indices that have been spent, valid when status is 'doubleSpend'
   */
  spentInputs?: { vin: number; scriptHash: string }[]
}

export interface PostReqsToNetworkResult {
  status: 'success' | 'error'
  beef: Beef
  details: PostReqsToNetworkDetails[]
  log: string
}
