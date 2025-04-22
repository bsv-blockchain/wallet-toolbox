/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AtomicBEEF,
  Beef,
  Transaction as BsvTransaction,
  SendWithResult,
  SignActionArgs,
  SignActionOptions,
  SignActionResult,
  SignActionSpend,
  TXIDHexString
} from '@bsv/sdk'
import { asBsvSdkScript, PendingSignAction, ScriptTemplateBRC29, sdk, Wallet } from '../../index.client'
import { processAction } from './createAction'
import { ReviewActionResult } from '../../sdk/WalletStorage.interfaces'
import { validateSignActionArgs } from '../../sdk'

export interface SignActionResultX extends SignActionResult {
  txid?: TXIDHexString
  tx?: AtomicBEEF
  sendWithResults?: SendWithResult[]
  notDelayedResults?: ReviewActionResult[]
}

export async function signAction(
  wallet: Wallet,
  auth: sdk.AuthId,
  args: SignActionArgs
): Promise<SignActionResultX> {
  const prior = wallet.pendingSignActions[args.reference]
  if (!prior)
    throw new sdk.WERR_NOT_IMPLEMENTED('recovery of out-of-session signAction reference data is not yet implemented.')
  if (!prior.dcr.inputBeef) throw new sdk.WERR_INTERNAL('prior.dcr.inputBeef must be valid')
  
  const vargs = mergePriorOptions(prior.args, args)

  prior.tx = await completeSignedTransaction(prior, vargs.spends, wallet)

  const { sendWithResults, notDelayedResults } = await processAction(prior, wallet, auth, vargs)

  const r: SignActionResultX = {
    txid: prior.tx.id('hex'),
    tx: vargs.options.returnTXIDOnly ? undefined : makeAtomicBeef(prior.tx, prior.dcr.inputBeef),
    sendWithResults,
    notDelayedResults
  }

  return r
}

export function makeAtomicBeef(tx: BsvTransaction, beef: number[] | Beef): number[] {
  if (Array.isArray(beef)) beef = Beef.fromBinary(beef)
  beef.mergeTransaction(tx)
  return beef.toBinaryAtomic(tx.id('hex'))
}

export async function completeSignedTransaction(
  prior: PendingSignAction,
  spends: Record<number, SignActionSpend>,
  wallet: Wallet
): Promise<BsvTransaction> {
  /////////////////////
  // Insert the user provided unlocking scripts from "spends" arg
  /////////////////////
  for (const [key, spend] of Object.entries(spends)) {
    const vin = Number(key)
    const createInput = prior.args.inputs[vin]
    const input = prior.tx.inputs[vin]
    if (!createInput || !input || createInput.unlockingScript || !Number.isInteger(createInput.unlockingScriptLength))
      throw new sdk.WERR_INVALID_PARAMETER(
        'args',
        `spend does not correspond to prior input with valid unlockingScriptLength.`
      )
    if (spend.unlockingScript.length / 2 > createInput.unlockingScriptLength!)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args',
        `spend unlockingScript length ${spend.unlockingScript.length} exceeds expected length ${createInput.unlockingScriptLength}`
      )
    input.unlockingScript = asBsvSdkScript(spend.unlockingScript)
    if (spend.sequenceNumber !== undefined) input.sequence = spend.sequenceNumber
  }

  const results = {
    sdk: <SignActionResult>{}
  }

  /////////////////////
  // Insert SABPPP unlock templates for wallet signed inputs
  /////////////////////
  for (const pdi of prior.pdi) {
    const sabppp = new ScriptTemplateBRC29({
      derivationPrefix: pdi.derivationPrefix,
      derivationSuffix: pdi.derivationSuffix,
      keyDeriver: wallet.keyDeriver
    })
    const keys = wallet.getClientChangeKeyPair()
    const lockerPrivKey = keys.privateKey
    const unlockerPubKey = pdi.unlockerPubKey || keys.publicKey
    const sourceSatoshis = pdi.sourceSatoshis
    const lockingScript = asBsvSdkScript(pdi.lockingScript)
    const unlockTemplate = sabppp.unlock(lockerPrivKey, unlockerPubKey, sourceSatoshis, lockingScript)
    const input = prior.tx.inputs[pdi.vin]
    input.unlockingScriptTemplate = unlockTemplate
  }

  /////////////////////
  // Sign wallet signed inputs making transaction fully valid.
  /////////////////////
  await prior.tx.sign()

  return prior.tx
}

function mergePriorOptions(caVargs: sdk.ValidCreateActionArgs, saArgs: SignActionArgs) : sdk.ValidSignActionArgs {
  const saOptions = saArgs.options || {}
  if (saOptions.acceptDelayedBroadcast === undefined) saOptions.acceptDelayedBroadcast = caVargs.options.acceptDelayedBroadcast
  if (saOptions.returnTXIDOnly === undefined) saOptions.returnTXIDOnly = caVargs.options.returnTXIDOnly
  if (saOptions.noSend === undefined) saOptions.noSend = caVargs.options.noSend
  if (saOptions.sendWith === undefined) saOptions.sendWith = caVargs.options.sendWith
  return validateSignActionArgs(saArgs)
}
