import { Beef, InternalizeActionArgs, InternalizeOutput, P2PKH, WalletProtocol } from '@bsv/sdk'
import { Wallet } from '../../Wallet'
import { AuthId, StorageInternalizeActionResult } from '../../sdk/WalletStorage.interfaces'
import { validateInternalizeActionArgs, ValidInternalizeActionArgs } from '../../sdk/validationHelpers'
import { WERR_INTERNAL, WERR_INVALID_PARAMETER } from '../../sdk/WERR_errors'

/**
 * Internalize Action allows a wallet to take ownership of outputs in a pre-existing transaction.
 * The transaction may, or may not already be known to both the storage and user.
 *
 * Two types of outputs are handled: "wallet payments" and "basket insertions".
 *
 * A "basket insertion" output is considered a custom output and has no effect on the wallet's "balance".
 *
 * A "wallet payment" adds an outputs value to the wallet's change "balance". These outputs are assigned to the "default" basket.
 *
 * Processing starts with simple validation and then checks for a pre-existing transaction.
 * If the transaction is already known to the user, then the outputs are reviewed against the existing outputs treatment,
 * and merge rules are added to the arguments passed to the storage layer.
 * The existing transaction must be in the 'unproven' or 'completed' status. Any other status is an error.
 *
 * When the transaction already exists, the description is updated. The isOutgoing sense is not changed.
 *
 * "basket insertion" Merge Rules:
 * 1. The "default" basket may not be specified as the insertion basket.
 * 2. A change output in the "default" basket may not be target of an insertion into a different basket.
 * 3. These baskets do not affect the wallet's balance and are typed "custom".
 *
 * "wallet payment" Merge Rules:
 * 1. Targetting an existing change "default" basket output results in a no-op. No error. No alterations made.
 * 2. Targetting a previously "custom" non-change output converts it into a change output. This alters the transaction's `amount`, and the wallet balance.
 *
 */
export async function internalizeAction(
  wallet: Wallet,
  auth: AuthId,
  args: InternalizeActionArgs
): Promise<StorageInternalizeActionResult> {
  const vargs = validateInternalizeActionArgs(args)

  const { ab, tx, txid } = await validateAtomicBeef()
  const brc29ProtocolID: WalletProtocol = [2, '3241645161d8']

  for (const o of vargs.outputs) {
    if (o.outputIndex < 0 || o.outputIndex >= tx.outputs.length)
      throw new WERR_INVALID_PARAMETER('outputIndex', `a valid output index in range 0 to ${tx.outputs.length - 1}`)
    switch (o.protocol) {
      case 'basket insertion':
        setupBasketInsertionForOutput(o, vargs)
        break
      case 'wallet payment':
        setupWalletPaymentForOutput(o, vargs)
        break
      default:
        throw new WERR_INTERNAL(`unexpected protocol ${o.protocol}`)
    }
  }

  const r: StorageInternalizeActionResult = await wallet.storage.internalizeAction(args)

  return r

  function setupWalletPaymentForOutput(o: InternalizeOutput, dargs: ValidInternalizeActionArgs) {
    const p = o.paymentRemittance
    const output = tx.outputs[o.outputIndex]
    if (!p) throw new WERR_INVALID_PARAMETER('paymentRemitance', `valid for protocol ${o.protocol}`)

    const keyID = `${p.derivationPrefix} ${p.derivationSuffix}`

    const privKey = wallet.keyDeriver!.derivePrivateKey(brc29ProtocolID, keyID, p.senderIdentityKey)
    const expectedLockScript = new P2PKH().lock(privKey.toAddress())
    if (output.lockingScript.toHex() !== expectedLockScript.toHex())
      throw new WERR_INVALID_PARAMETER('paymentRemitance', `locked by script conforming to BRC-29`)
  }

  function setupBasketInsertionForOutput(o: InternalizeOutput, dargs: ValidInternalizeActionArgs) {
    /*
    No additional validations...
    */
  }

  async function validateAtomicBeef() {
    const ab = Beef.fromBinary(vargs.tx)

    // TODO: Add support for known txids...

    const txValid = await ab.verify(await wallet.getServices().getChainTracker(), false)
    if (!txValid || !ab.atomicTxid) {
      console.log(`internalizeAction beef is invalid: ${ab.toLogString()}`)
      throw new WERR_INVALID_PARAMETER('tx', 'valid AtomicBEEF')
    }
    const txid = ab.atomicTxid
    const btx = ab.findTxid(txid)
    if (!btx) throw new WERR_INVALID_PARAMETER('tx', `valid AtomicBEEF with newest txid of ${txid}`)
    const tx = btx.tx!

    return { ab, tx, txid }
  }
}
