import {
  AtomicBEEF,
  Beef,
  CreateActionResult,
  OutpointString,
  SendWithResult,
  SignableTransaction,
  TXIDHexString,
  Script,
  Transaction
} from '@bsv/sdk'
import { buildSignableTransaction } from './buildSignableTransaction'
import {
  AuthId,
  ReviewActionResult,
  StorageCreateActionResult,
  StorageCreateTransactionSdkOutput,
  StorageProcessActionArgs,
  StorageProcessActionResults
} from '../../sdk/WalletStorage.interfaces'
import { completeSignedTransaction, verifyUnlockScripts } from './completeSignedTransaction'
import { PendingSignAction, Wallet } from '../../Wallet'
import { ValidCreateActionArgs, ValidCreateActionInput, ValidProcessActionArgs } from '../../sdk/validationHelpers'
import { WERR_INTERNAL } from '../../sdk/WERR_errors'
import { KeyPair } from '../../sdk/types'
import { verifyTruthy } from '../../utility/utilityHelpers'
import { ScriptTemplateBRC29 } from '../../utility/ScriptTemplateBRC29'

export interface CreateActionResultX extends CreateActionResult {
  txid?: TXIDHexString
  tx?: AtomicBEEF
  noSendChange?: OutpointString[]
  sendWithResults?: SendWithResult[]
  signableTransaction?: SignableTransaction
  notDelayedResults?: ReviewActionResult[]
}

export async function createAction(
  wallet: Wallet,
  auth: AuthId,
  vargs: ValidCreateActionArgs
): Promise<CreateActionResultX> {
  const r: CreateActionResultX = {}

  let prior: PendingSignAction | undefined = undefined

  if (vargs.isNewTx) {
    prior = await createNewTx(wallet, vargs)

    if (vargs.isSignAction) {
      return makeSignableTransactionResult(prior, wallet, vargs)
    }

    prior.tx = await completeSignedTransaction(prior, {}, wallet)

    r.txid = prior.tx.id('hex')
    const beef = new Beef()
    if (prior.dcr.inputBeef) beef.mergeBeef(prior.dcr.inputBeef)
    beef.mergeTransaction(prior.tx)

    verifyUnlockScripts(r.txid, beef)

    r.noSendChange = prior.dcr.noSendChangeOutputVouts?.map(vout => `${r.txid}.${vout}`)
    if (!vargs.options.returnTXIDOnly) r.tx = beef.toBinaryAtomic(r.txid)
  }

  const { sendWithResults, notDelayedResults } = await processAction(prior, wallet, auth, vargs)

  r.sendWithResults = sendWithResults
  r.notDelayedResults = notDelayedResults

  return r
}

async function createNewTx(wallet: Wallet, args: ValidCreateActionArgs): Promise<PendingSignAction> {
  const storageArgs = removeUnlockScripts(args)
  const dcr = await wallet.storage.createAction(storageArgs)

  const reference = dcr.reference

  const { tx, amount, pdi } = buildSignableTransaction(dcr, args, wallet)

  const prior: PendingSignAction = { reference, dcr, args, amount, tx, pdi }

  return prior
}

function makeSignableTransactionResult(
  prior: PendingSignAction,
  wallet: Wallet,
  args: ValidCreateActionArgs
): CreateActionResult {
  if (!prior.dcr.inputBeef) throw new WERR_INTERNAL('prior.dcr.inputBeef must be valid')

  const txid = prior.tx.id('hex')

  const r: CreateActionResult = {
    noSendChange: args.isNoSend ? prior.dcr.noSendChangeOutputVouts?.map(vout => `${txid}.${vout}`) : undefined,
    signableTransaction: {
      reference: prior.dcr.reference,
      tx: makeSignableTransactionBeef(prior.tx, prior.dcr.inputBeef)
    }
  }

  wallet.pendingSignActions[r.signableTransaction!.reference] = prior

  return r
}

function makeSignableTransactionBeef(tx: Transaction, inputBEEF: number[]): number[] {
  // This is a special case beef for transaction signing.
  // We only need the transaction being signed, and for each input, the raw source transaction.
  const beef = new Beef()
  for (const input of tx.inputs) {
    if (!input.sourceTransaction)
      throw new WERR_INTERNAL('Every signableTransaction input must have a sourceTransaction')
    beef.mergeRawTx(input.sourceTransaction!.toBinary())
  }
  beef.mergeRawTx(tx.toBinary())
  return beef.toBinaryAtomic(tx.id('hex'))
}

function removeUnlockScripts(args: ValidCreateActionArgs) {
  let storageArgs = args
  if (!storageArgs.inputs.every(i => i.unlockingScript === undefined)) {
    // Never send unlocking scripts to storage, all it needs is the script length.
    storageArgs = { ...args, inputs: [] }
    for (const i of args.inputs) {
      const di: ValidCreateActionInput = {
        ...i,
        unlockingScriptLength: i.unlockingScript !== undefined ? i.unlockingScript.length : i.unlockingScriptLength
      }
      delete di.unlockingScript
      storageArgs.inputs.push(di)
    }
  }
  return storageArgs
}

export async function processAction(
  prior: PendingSignAction | undefined,
  wallet: Wallet,
  auth: AuthId,
  vargs: ValidProcessActionArgs
): Promise<StorageProcessActionResults> {
  const args: StorageProcessActionArgs = {
    isNewTx: vargs.isNewTx,
    isSendWith: vargs.isSendWith,
    isNoSend: vargs.isNoSend,
    isDelayed: vargs.isDelayed,
    reference: prior ? prior.reference : undefined,
    txid: prior ? prior.tx.id('hex') : undefined,
    rawTx: prior ? prior.tx.toBinary() : undefined,
    sendWith: vargs.isSendWith ? vargs.options.sendWith : []
  }
  const r: StorageProcessActionResults = await wallet.storage.processAction(args)

  return r
}

function makeDummyTransactionForOutputSatoshis(vout: number, satoshis: number): Transaction {
  const tx = new Transaction()
  for (let i = 0; i < vout; i++) tx.addOutput({ lockingScript: new Script(), satoshis: 0 })
  tx.addOutput({ lockingScript: new Script(), satoshis })
  return tx
}
