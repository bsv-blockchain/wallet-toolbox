// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Beef, Transaction as BsvTransaction, SendWithResult, SendWithResultStatus } from '@bsv/sdk'
import { aggregateActionResults } from '../../utility/aggregateResults'
import { StorageProvider } from '../StorageProvider'
import { AuthId, ReviewActionResult, StorageProcessActionArgs, StorageProcessActionResults } from '../../sdk/WalletStorage.interfaces'
import { stampLog } from '../../utility/stampLog'
import { randomBytesBase64, verifyId, verifyInteger, verifyOne, verifyOneOrNone, verifyTruthy } from '../../utility/utilityHelpers'
import { EntityProvenTxReq } from '../schema/entities/EntityProvenTxReq'
import { WERR_INTERNAL, WERR_INVALID_OPERATION } from '../../sdk/WERR_errors'
import { TableProvenTxReq } from '../schema/tables/TableProvenTxReq'
import { TableProvenTx } from '../schema/tables/TableProvenTx'
import { ProvenTxReqStatus, TransactionStatus } from '../../sdk/types'
import { parseTxScriptOffsets, TxScriptOffsets } from '../../utility/parseTxScriptOffsets'
import { TableTransaction } from '../schema/tables/TableTransaction'
import { TableOutput } from '../schema/tables/TableOutput'
import { TableCommission } from '../schema/tables/TableCommission'
import { asArray, asString } from '../../utility/utilityHelpers.noBuffer'

export async function processAction(
  storage: StorageProvider,
  auth: AuthId,
  args: StorageProcessActionArgs
): Promise<StorageProcessActionResults> {
  stampLog(args.log, `start storage processActionSdk`)

  const userId = verifyId(auth.userId)
  const r: StorageProcessActionResults = {
    sendWithResults: undefined
  }

  let req: EntityProvenTxReq | undefined
  const txidsOfReqsToShareWithWorld: string[] = [...args.sendWith]

  if (args.isNewTx) {
    const vargs = await validateCommitNewTxToStorageArgs(storage, userId, args)
    ;({ req, log: args.log } = await commitNewTxToStorage(storage, userId, vargs))
    if (!req) throw new WERR_INTERNAL()
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

  const readyToSendReqs: EntityProvenTxReq[] = []
  for (const getReq of r.details) {
    let status: SendWithResultStatus = 'failed'
    if (getReq.status === 'alreadySent') status = 'unproven'
    else if (getReq.status === 'readyToSend') {
      status = 'sending'
      readyToSendReqs.push(new EntityProvenTxReq(getReq.req!))
    }
    swr.push({
      txid: getReq.txid,
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
      throw new WERR_INTERNAL(`merged Beef failed validation.`)
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
    return { swr, ndr }
  }

  if (readyToSendReqIds.length < 1) {
    return { swr, ndr }
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

  const { swr: swrRes, rar } = await aggregateActionResults(storage, swr, prtn)
  return { swr: swrRes, ndr: rar }
}

interface ReqTxStatus {
  req: ProvenTxReqStatus
  tx: TransactionStatus
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
  params: StorageProcessActionArgs
): Promise<ValidCommitNewTxToStorageArgs> {
  if (!params.reference || !params.txid || !params.rawTx)
    throw new WERR_INVALID_OPERATION('One or more expected params are undefined.')
  let tx: BsvTransaction
  try {
    tx = BsvTransaction.fromBinary(params.rawTx)
  } catch (e: unknown) {
    throw new WERR_INVALID_OPERATION('Parsing serialized transaction failed.')
  }
  if (params.txid !== tx.id('hex'))
    throw new WERR_INVALID_OPERATION(`Hash of serialized transaction doesn't match expected txid`)
  if (!(await storage.getServices()).nLockTimeIsFinal(tx)) {
    throw new WERR_INVALID_OPERATION(`This transaction is not final.
         Ensure that the transaction meets the rules for being a finalized
         which can be found at https://wiki.bitcoinsv.io/index.php/NLocktime_and_nSequence`)
  }
  const txScriptOffsets = parseTxScriptOffsets(params.rawTx)
  const transaction = verifyOne(
    await storage.findTransactions({
      partial: { userId, reference: params.reference }
    })
  )
  if (!transaction.isOutgoing) throw new WERR_INVALID_OPERATION('isOutgoing is not true')
  if (!transaction.inputBEEF) throw new WERR_INVALID_OPERATION()
  const beef = Beef.fromBinary(asArray(transaction.inputBEEF))
  // TODO: Could check beef validates transaction inputs...
  // Transaction must have unsigned or unprocessed status
  if (transaction.status !== 'unsigned' && transaction.status !== 'unprocessed')
    throw new WERR_INVALID_OPERATION(`invalid transaction status ${transaction.status}`)
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
    if (!commission) throw new WERR_INTERNAL()
    const commissionValid = tx.outputs.some(
      x => x.satoshis === commission.satoshis && x.lockingScript.toHex() === asString(commission.lockingScript!)
    )
    if (!commissionValid)
      throw new WERR_INVALID_OPERATION('Transaction did not include an output to cover service fee.')
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
  } else throw new WERR_INTERNAL('logic error')

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
      throw new WERR_INVALID_OPERATION(
        `rawTx output locking script for vout ${vout} not equal to expected output script.`
      )
    if (tx.outputs[vout].lockingScript.toHex() !== rawTxScript)
      throw new WERR_INVALID_OPERATION(
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
