// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Beef, Transaction as BsvTransaction, SendWithResult, SendWithResultStatus } from '@bsv/sdk'
import {
  asArray,
  asString,
  EntityProvenTxReq,
  parseTxScriptOffsets,
  randomBytesBase64,
  sdk,
  sha256Hash,
  stampLog,
  stampLogFormat,
  StorageProvider,
  TableCommission,
  TableOutput,
  TableProvenTx,
  TableProvenTxReq,
  TableTransaction,
  TxScriptOffsets,
  validateStorageFeeModel,
  verifyId,
  verifyInteger,
  verifyNumber,
  verifyOne,
  verifyOneOrNone,
  verifyTruthy
} from '../../index.client'
import { ReviewActionResult, ProvenTxReqNonTerminalStatus, StorageGetBeefOptions } from '../../sdk'
import { PostReqsToNetworkDetails } from './attemptToPostReqsToNetwork'
import { createMergedBeefOfTxids } from '../../utility/mergedBeefOfTxids'

export async function processAction(
  storage: StorageProvider,
  auth: sdk.AuthId,
  args: sdk.StorageProcessActionArgs
): Promise<sdk.StorageProcessActionResults> {
  stampLog(args.log, `start storage processActionSdk`)

  const userId = verifyId(auth.userId)
  const r: sdk.StorageProcessActionResults = {
    sendWithResults: undefined
  }

  let req: EntityProvenTxReq | undefined
  const txidsOfReqsToShareWithWorld: string[] = [...args.sendWith]

  if (args.isNewTx) {
    const vargs = await validateCommitNewTxToStorageArgs(storage, userId, args)
    ;({ req, log: args.log } = await commitNewTxToStorage(storage, userId, vargs))
    if (!req) throw new sdk.WERR_INTERNAL()
    // Add the new txid to sendWith unless there are no others to send and the noSend option is set.
    if (args.isNoSend && !args.isSendWith) stampLog(args.log, `... storage processActionSdk newTx committed noSend`)
    else {
      txidsOfReqsToShareWithWorld.push(req.txid)
      stampLog(args.log, `... storage processActionSdk newTx committed sendWith ${req.txid}`)
    }
  }

  const { swr, ndr } = await shareReqsWithWorld(storage, userId, txidsOfReqsToShareWithWorld, args.isDelayed)

  r.sendWithResults = swr
  r.notDelayedResults = ndr

  stampLog(args.log, `end storage processActionSdk`)

  return r
}

export interface GetReqsAndBeefDetail {
  txid: string
  req?: TableProvenTxReq
  proven?: TableProvenTx
  status: 'readyToSend' | 'alreadySent' | 'error' | 'unknown'
  error?: string
}

export interface GetReqsAndBeefResult {
  beef: Beef
  details: GetReqsAndBeefDetail[]
}

export interface PostBeefResultForTxidApi {
  txid: string

  /**
   * 'success' - The transaction was accepted for processing
   */
  status: 'success' | 'error'

  /**
   * if true, the transaction was already known to this service. Usually treat as a success.
   *
   * Potentially stop posting to additional transaction processors.
   */
  alreadyKnown?: boolean

  blockHash?: string
  blockHeight?: number
  merklePath?: string
}

/**
 * Verifies that all the txids are known reqs with ready-to-share status.
 * Assigns a batch identifier and updates all the provenTxReqs.
 * If not isDelayed, triggers an initial attempt to broadcast the batch and returns the results.
 *
 * @param storage
 * @param userId
 * @param txids
 * @param isDelayed
 */
export async function shareReqsWithWorld(
  storage: StorageProvider,
  userId: number,
  txids: string[],
  isDelayed: boolean
): Promise<{ swr: SendWithResult[]; ndr: ReviewActionResult[] | undefined }> {
  let swr: SendWithResult[] = []
  let ndr: ReviewActionResult[] | undefined = undefined

  if (txids.length < 1) return { swr, ndr }

  // Collect what we know about these sendWith transaction txids from storage.
  const r = await storage.getReqsAndBeefToShareWithWorld(txids, [])

  // Initialize aggregate results for each txid
  const ars: {
    txid: string
    status: SendWithResultStatus
    getReq: GetReqsAndBeefDetail
    postReq?: PostReqsToNetworkDetails
    ndr?: ReviewActionResult
  }[] = []

  const readyToSendReqs: EntityProvenTxReq[] = []
  for (const getReq of r.details) {
    let status: SendWithResultStatus = 'failed'
    if (getReq.status === 'alreadySent') status = 'unproven'
    else if (getReq.status === 'readyToSend') {
      status = 'sending'
      readyToSendReqs.push(new EntityProvenTxReq(getReq.req!))
    }
    ars.push({
      txid: getReq.txid,
      getReq,
      status
    })
  }

  // Filter original txids down to reqIds that are available and need sending
  const readyToSendReqIds = readyToSendReqs.map(r => r.id)
  const transactionIds = readyToSendReqs.map(r => r.notify.transactionIds || []).flat()

  // If there are reqs to send, verify that we have a valid aggregate beef for them.
  // If isDelayed, this (or a different beef) will have to be rebuilt at the time of sending.
  if (readyToSendReqs.length > 0) {
    const beefIsValid = await r.beef.verify(await storage.getServices().getChainTracker())
    if (!beefIsValid) {
      console.log(`VERIFY FALSE BEEF: ${r.beef.toLogString()}`)
      throw new sdk.WERR_INTERNAL(`merged Beef failed validation.`)
    }
  }

  // Set req batch property for the reqs being sent
  // If delayed, also bump status to 'unsent' and we're done here
  const batch = txids.length > 1 ? randomBytesBase64(16) : undefined
  if (isDelayed) {
    // Just bump the req status to 'unsent' to enable background sending...
    if (readyToSendReqIds.length > 0) {
      await storage.transaction(async trx => {
        await storage.updateProvenTxReq(readyToSendReqIds, { status: 'unsent', batch }, trx)
        await storage.updateTransaction(transactionIds, { status: 'sending' }, trx)
      })
    }
    return createResults()
  }

  if (readyToSendReqIds.length < 1) {
    return createResults()
  }

  if (batch) {
    // Keep batch values in sync...
    for (const req of readyToSendReqs) req.batch = batch
    await storage.updateProvenTxReq(readyToSendReqIds, { batch })
  }

  //
  // Handle the NON-DELAYED-SEND-NOW case
  //
  const prtn = await storage.attemptToPostReqsToNetwork(readyToSendReqs)

  // merge the individual PostBeefResultForTxid results to postBeef in aggregate results.
  for (const ar of ars) {
    const txid = ar.txid
    const d = prtn.details.find(d => d.txid === txid)
    if (!d) throw new sdk.WERR_INTERNAL(`missing details for ${txid}`)
    ar.ndr = { txid: d.txid, status: 'success', competingTxs: d.competingTxs }
    switch (d.status) {
      case 'success':
        // processing network has accepted this transaction
        ar.status = 'unproven'
        break
      case 'doubleSpend':
        // confirmed double spend.
        ar.status = 'failed'
        ar.ndr.status = 'doubleSpend'
        if (d.competingTxs) ar.ndr.competingBeef = await createMergedBeefOfTxids(d.competingTxs, storage)
        break
      case 'serviceError':
        // services might improve
        ar.status = 'sending'
        ar.ndr.status = 'serviceError'
        break
      case 'invalidTx':
        // nothing will fix this transaction
        ar.status = 'failed'
        ar.ndr.status = 'invalidTx'
        break
      case 'unknown':
      case 'invalid':
      default:
        throw new sdk.WERR_INTERNAL(`processAction with notDelayed status ${d.status} should not occur.`)
    }
  }

  return createResults()

  function createResults(): { swr: SendWithResult[]; ndr: ReviewActionResult[] | undefined } {
    swr = []
    ndr = isDelayed ? undefined : []
    for (const ar of ars) {
      swr.push({ txid: ar.txid, status: ar.status })
      if (ar.ndr && ndr) {
        ndr.push(ar.ndr)
      }
    }
    return { swr, ndr }
  }
}

interface ReqTxStatus {
  req: sdk.ProvenTxReqStatus
  tx: sdk.TransactionStatus
}

interface ValidCommitNewTxToStorageArgs {
  // validated input args

  reference: string
  txid: string
  rawTx: number[]
  isNoSend: boolean
  isDelayed: boolean
  isSendWith: boolean
  log?: string

  // validated dependent args

  tx: BsvTransaction
  txScriptOffsets: TxScriptOffsets
  transactionId: number
  transaction: TableTransaction
  inputOutputs: TableOutput[]
  outputOutputs: TableOutput[]
  commission: TableCommission | undefined
  beef: Beef

  req: EntityProvenTxReq
  outputUpdates: { id: number; update: Partial<TableOutput> }[]
  transactionUpdate: Partial<TableTransaction>
  postStatus?: ReqTxStatus
}

async function validateCommitNewTxToStorageArgs(
  storage: StorageProvider,
  userId: number,
  params: sdk.StorageProcessActionArgs
): Promise<ValidCommitNewTxToStorageArgs> {
  if (!params.reference || !params.txid || !params.rawTx)
    throw new sdk.WERR_INVALID_OPERATION('One or more expected params are undefined.')
  let tx: BsvTransaction
  try {
    tx = BsvTransaction.fromBinary(params.rawTx)
  } catch (e: unknown) {
    throw new sdk.WERR_INVALID_OPERATION('Parsing serialized transaction failed.')
  }
  if (params.txid !== tx.id('hex'))
    throw new sdk.WERR_INVALID_OPERATION(`Hash of serialized transaction doesn't match expected txid`)
  if (!(await storage.getServices()).nLockTimeIsFinal(tx)) {
    throw new sdk.WERR_INVALID_OPERATION(`This transaction is not final.
         Ensure that the transaction meets the rules for being a finalized
         which can be found at https://wiki.bitcoinsv.io/index.php/NLocktime_and_nSequence`)
  }
  const txScriptOffsets = parseTxScriptOffsets(params.rawTx)
  const transaction = verifyOne(
    await storage.findTransactions({
      partial: { userId, reference: params.reference }
    })
  )
  if (!transaction.isOutgoing) throw new sdk.WERR_INVALID_OPERATION('isOutgoing is not true')
  if (!transaction.inputBEEF) throw new sdk.WERR_INVALID_OPERATION()
  const beef = Beef.fromBinary(asArray(transaction.inputBEEF))
  // TODO: Could check beef validates transaction inputs...
  // Transaction must have unsigned or unprocessed status
  if (transaction.status !== 'unsigned' && transaction.status !== 'unprocessed')
    throw new sdk.WERR_INVALID_OPERATION(`invalid transaction status ${transaction.status}`)
  const transactionId = verifyId(transaction.transactionId)
  const outputOutputs = await storage.findOutputs({
    partial: { userId, transactionId }
  })
  const inputOutputs = await storage.findOutputs({
    partial: { userId, spentBy: transactionId }
  })

  const commission = verifyOneOrNone(await storage.findCommissions({ partial: { transactionId, userId } }))
  if (storage.commissionSatoshis > 0) {
    // A commission is required...
    if (!commission) throw new sdk.WERR_INTERNAL()
    const commissionValid = tx.outputs.some(
      x => x.satoshis === commission.satoshis && x.lockingScript.toHex() === asString(commission.lockingScript!)
    )
    if (!commissionValid)
      throw new sdk.WERR_INVALID_OPERATION('Transaction did not include an output to cover service fee.')
  }

  const req = EntityProvenTxReq.fromTxid(params.txid, params.rawTx, transaction.inputBEEF)
  req.addNotifyTransactionId(transactionId)

  // "Processing" a transaction is the final step of creating a new one.
  // If it is to be sent to the network directly (prior to return from processAction),
  // then there is status pre-send and post-send.
  // Otherwise there is no post-send status.
  // Note that isSendWith trumps isNoSend, e.g. isNoSend && !isSendWith
  //
  // Determine what status the req and transaction should have pre- at the end of processing.
  //                           Pre-Status (to newReq/newTx)     Post-Status (to all sent reqs/txs)
  //                           req         tx                   req                 tx
  // isNoSend                  noSend      noSend
  // !isNoSend && isDelayed    unsent      unprocessed
  // !isNoSend && !isDelayed   unprocessed unprocessed          sending/unmined     sending/unproven      This is the only case that sends immediately.
  let postStatus: ReqTxStatus | undefined = undefined
  let status: ReqTxStatus
  if (params.isNoSend && !params.isSendWith) status = { req: 'nosend', tx: 'nosend' }
  else if (!params.isNoSend && params.isDelayed) status = { req: 'unsent', tx: 'unprocessed' }
  else if (!params.isNoSend && !params.isDelayed) {
    status = { req: 'unprocessed', tx: 'unprocessed' }
    postStatus = { req: 'unmined', tx: 'unproven' }
  } else throw new sdk.WERR_INTERNAL('logic error')

  req.status = status.req
  const vargs: ValidCommitNewTxToStorageArgs = {
    reference: params.reference,
    txid: params.txid,
    rawTx: params.rawTx,
    isSendWith: !!params.sendWith && params.sendWith.length > 0,
    isDelayed: params.isDelayed,
    isNoSend: params.isNoSend,
    // Properties with values added during validation.
    tx,
    txScriptOffsets,
    transactionId,
    transaction,
    inputOutputs,
    outputOutputs,
    commission,
    beef,
    req,
    outputUpdates: [],
    // update txid, status in transactions table and drop rawTransaction value
    transactionUpdate: {
      txid: params.txid,
      rawTx: undefined,
      inputBEEF: undefined,
      status: status.tx
    },
    postStatus
  }

  // update outputs with txid, script offsets and lengths, drop long output scripts from outputs table
  // outputs spendable will be updated for change to true and all others to !!o.tracked when tx has been broadcast
  // MAX_OUTPUTSCRIPT_LENGTH is limit for scripts left in outputs table
  for (const o of vargs.outputOutputs) {
    const vout = verifyInteger(o.vout)
    const offset = vargs.txScriptOffsets.outputs[vout]
    const rawTxScript = asString(vargs.rawTx.slice(offset.offset, offset.offset + offset.length))
    if (o.lockingScript && rawTxScript !== asString(o.lockingScript))
      throw new sdk.WERR_INVALID_OPERATION(
        `rawTx output locking script for vout ${vout} not equal to expected output script.`
      )
    if (tx.outputs[vout].lockingScript.toHex() !== rawTxScript)
      throw new sdk.WERR_INVALID_OPERATION(
        `parsed transaction output locking script for vout ${vout} not equal to expected output script.`
      )
    const update: Partial<TableOutput> = {
      txid: vargs.txid,
      spendable: true, // spendability is gated by transaction status. Remains true until the output is spent.
      scriptLength: offset.length,
      scriptOffset: offset.offset
    }
    if (offset.length > (await storage.getSettings()).maxOutputScript)
      // Remove long lockingScript data from outputs table, will be read from rawTx in proven_tx or proven_tx_reqs tables.
      update.lockingScript = undefined
    vargs.outputUpdates.push({ id: o.outputId!, update })
  }

  return vargs
}

export interface CommitNewTxResults {
  req: EntityProvenTxReq
  log?: string
}

async function commitNewTxToStorage(
  storage: StorageProvider,
  userId: number,
  vargs: ValidCommitNewTxToStorageArgs
): Promise<CommitNewTxResults> {
  let log = vargs.log

  log = stampLog(log, `start storage commitNewTxToStorage`)

  let req: EntityProvenTxReq | undefined

  await storage.transaction(async trx => {
    log = stampLog(log, `... storage commitNewTxToStorage storage transaction start`)

    // Create initial 'nosend' proven_tx_req record to store signed, valid rawTx and input beef
    req = await vargs.req.insertOrMerge(storage, trx)

    log = stampLog(log, `... storage commitNewTxToStorage req inserted`)

    for (const ou of vargs.outputUpdates) {
      await storage.updateOutput(ou.id, ou.update, trx)
    }

    log = stampLog(log, `... storage commitNewTxToStorage outputs updated`)

    await storage.updateTransaction(vargs.transactionId, vargs.transactionUpdate, trx)

    log = stampLog(log, `... storage commitNewTxToStorage storage transaction end`)
  })

  log = stampLog(log, `... storage commitNewTxToStorage storage transaction await done`)

  const r: CommitNewTxResults = {
    req: verifyTruthy(req),
    log
  }

  log = stampLog(log, `end storage commitNewTxToStorage`)

  return r
}
