import { Beef, SignActionResult, SignActionSpend, Spend, Transaction } from '@bsv/sdk'
import { PendingSignAction, Wallet } from '../../Wallet'
import { WERR_INVALID_PARAMETER } from '../../sdk/WERR_errors'
import { asBsvSdkScript } from '../../utility/utilityHelpers'
import { ScriptTemplateBRC29 } from '../../utility/ScriptTemplateBRC29'
import { WalletError } from '../../sdk/WalletError'

export async function completeSignedTransaction(
  prior: PendingSignAction,
  spends: Record<number, SignActionSpend>,
  wallet: Wallet
): Promise<Transaction> {
  /////////////////////
  // Insert the user provided unlocking scripts from "spends" arg
  /////////////////////
  for (const [key, spend] of Object.entries(spends)) {
    const vin = Number(key)
    const createInput = prior.args.inputs[vin]
    const input = prior.tx.inputs[vin]
    if (!createInput || !input || createInput.unlockingScript || !Number.isInteger(createInput.unlockingScriptLength))
      throw new WERR_INVALID_PARAMETER(
        'args',
        `spend does not correspond to prior input with valid unlockingScriptLength.`
      )
    if (spend.unlockingScript.length / 2 > createInput.unlockingScriptLength!)
      throw new WERR_INVALID_PARAMETER(
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

/**
 * @param txid The TXID of a transaction in the beef for which all unlocking scripts must be valid.
 * @param beef Must contain transactions for txid and all its inputs.
 * @throws WERR_INVALID_PARAMETER if any unlocking script is invalid, if sourceTXID is invalid, if beef doesn't contain required transactions.
 */
export function verifyUnlockScripts(txid: string, beef: Beef): void {
  const tx = beef.findTxid(txid)?.tx
  if (!tx) throw new WERR_INVALID_PARAMETER(`txid`, `contained in beef, txid ${txid}`)

  for (let i = 0; i < tx.inputs.length; i++) {
    const input = tx.inputs[i]
    if (!input.sourceTXID) throw new WERR_INVALID_PARAMETER(`inputs[${i}].sourceTXID`, `valid`)
    if (!input.unlockingScript) throw new WERR_INVALID_PARAMETER(`inputs[${i}].unlockingScript`, `valid`)
    input.sourceTransaction = beef.findTxid(input.sourceTXID)?.tx
    if (!input.sourceTransaction) {
      // The beef doesn't contain all the source transactions only if advanced features
      // such as knownTxids are used.
      // Skip unlock script checks.
      return
      // throw new WERR_INVALID_PARAMETER(`inputs[${i}].sourceTXID`, `contained in beef`)
    }
  }

  for (let i = 0; i < tx.inputs.length; i++) {
    const input = tx.inputs[i]
    const sourceOutput = input.sourceTransaction!.outputs[input.sourceOutputIndex]

    const otherInputs = tx.inputs.filter((_, idx) => idx !== i)

    const spend = new Spend({
      sourceTXID: input.sourceTXID!,
      sourceOutputIndex: input.sourceOutputIndex,
      lockingScript: sourceOutput.lockingScript,
      sourceSatoshis: sourceOutput.satoshis ?? 0,
      transactionVersion: tx.version,
      otherInputs,
      unlockingScript: input.unlockingScript!,
      inputSequence: input.sequence ?? 0,
      inputIndex: i,
      outputs: tx.outputs,
      lockTime: tx.lockTime
    })

    try {
      const spendValid = spend.validate()

      if (!spendValid) throw new WERR_INVALID_PARAMETER(`inputs[${i}].unlockScript`, `valid`)
    } catch (eu: unknown) {
      const e = WalletError.fromUnknown(eu)
      throw new WERR_INVALID_PARAMETER(`inputs[${i}].unlockScript`, `valid. ${e.message}`)
    }
  }
}
