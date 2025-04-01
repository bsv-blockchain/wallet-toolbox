import { Transaction, UnlockingScript } from '@bsv/sdk'

/**
 * Identifies a unique transaction output by its `txid` and index `vout`
 */
export interface OutPoint {
  /**
   * Transaction double sha256 hash as big endian hex string
   */
  txid: string
  /**
   * zero based output index within the transaction
   */
  vout: number
}

export type Chain = 'main' | 'test'

/**
 * Initial status (attempts === 0):
 *
 * nosend: transaction was marked 'noSend'. It is complete and signed. It may be sent by an external party. Proof should be sought as if 'unmined'. No error if it remains unknown by network.
 *
 * unprocessed: indicates req is about to be posted to network by non-acceptDelayedBroadcast application code, after posting status is normally advanced to 'sending'
 *
 * unsent: rawTx has not yet been sent to the network for processing. req is queued for delayed processing.
 *
 * sending: At least one attempt to send rawTx to transaction processors has occured without confirmation of acceptance.
 *
 * unknown: rawTx status is unknown but is believed to have been previously sent to the network.
 *
 * Attempts > 0 status, processing:
 *
 * unknown: Last status update received did not recognize txid or wasn't understood.
 *
 * nonfinal: rawTx has an un-expired nLockTime and is eligible for continuous updating by new transactions with additional outputs and incrementing sequence numbers.
 *
 * unmined: Last attempt has txid waiting to be mined, possibly just sent without callback
 *
 * callback: Waiting for proof confirmation callback from transaction processor.
 *
 * unconfirmed: Potential proof has not been confirmed by chaintracks
 *
 * Terminal status:
 *
 * doubleSpend: Transaction spends same input as another transaction.
 *
 * invalid: rawTx is structuraly invalid or was rejected by the network. Will never be re-attempted or completed.
 *
 * completed: proven_txs record added, and notifications are complete.
 *
 * unfail: asigned to force review of a currently invalid ProvenTxReq.
 */
export type ProvenTxReqStatus =
  | 'sending'
  | 'unsent'
  | 'nosend'
  | 'unknown'
  | 'nonfinal'
  | 'unprocessed'
  | 'unmined'
  | 'callback'
  | 'unconfirmed'
  | 'completed'
  | 'invalid'
  | 'doubleSpend'
  | 'unfail'

export const ProvenTxReqTerminalStatus: ProvenTxReqStatus[] = ['completed', 'invalid', 'doubleSpend']

export const ProvenTxReqNonTerminalStatus: ProvenTxReqStatus[] = [
  'sending',
  'unsent',
  'nosend',
  'unknown',
  'nonfinal',
  'unprocessed',
  'unmined',
  'callback',
  'unconfirmed'
]

export type TransactionStatus =
  | 'completed'
  | 'failed'
  | 'unprocessed'
  | 'sending'
  | 'unproven'
  | 'unsigned'
  | 'nosend'
  | 'nonfinal'
  | 'unfail'

export interface Paged {
  limit: number
  offset?: number
}

export interface KeyPair {
  privateKey: string
  publicKey: string
}

export interface StorageIdentity {
  /**
   * The identity key (public key) assigned to this storage
   */
  storageIdentityKey: string
  /**
   * The human readable name assigned to this storage.
   */
  storageName: string
}

export interface EntityTimeStamp {
  created_at: Date
  updated_at: Date
}

export interface ScriptTemplateUnlock {
  sign: (tx: Transaction, inputIndex: number) => Promise<UnlockingScript>
  estimateLength: (tx: Transaction, inputIndex: number) => Promise<number>
}

export interface WalletBalance {
  total: number
  utxos: { satoshis: number; outpoint: string }[]
}

export type ReqHistoryNote = {
  when?: string
  what: string
  [key: string]: boolean | string | number | undefined
}

/**
 * `listOutputs` special operation basket name value.
 *
 * Returns wallet's current change balance in the `totalOutputs` result property.
 * The `outputs` result property will always be an empty array.
 */
export const specOpWalletBalance = '893b7646de0e1c9f741bd6e9169b76a8847ae34adef7bef1e6a285371206d2e8'

/**
 * `listOutputs` special operation basket name value.
 *
 * Returns currently spendable wallet change outputs that fail to validate as unspent transaction outputs.
 *
 * Optional tag value 'release'. If present, updates invalid change outputs to not spendable.
 *
 * Optional tag value 'all'. If present, processes all spendable true outputs, independent of baskets.
 */
export const specOpInvalidChange = '5a76fd430a311f8bc0553859061710a4475c19fed46e2ff95969aa918e612e57'

/**
 * `listOutputs` special operation basket name value.
 *
 * Updates the wallet's automatic change management parameters.
 *
 * Tag at index 0 is the new desired number of spendable change outputs to maintain.
 *
 * Tag at index 1 is the new target for minimum satoshis when creating new change outputs.
 */
export const specOpSetWalletChangeParams = 'a4979d28ced8581e9c1c92f1001cc7cb3aabf8ea32e10888ad898f0a509a3929'

/**
 * @param basket Output basket name value.
 * @returns true iff the `basket` name is a reserved `listOutputs` special operation identifier.
 */
export function isListOutputsSpecOp(basket: string): boolean {
  return [specOpWalletBalance, specOpInvalidChange, specOpSetWalletChangeParams].indexOf(basket) >= 0
}

/**
 * `listActions` special operation label name value.
 *
 * Processes only actions currently with status 'nosend'
 *
 * Optional label value 'abort'. If present, runs abortAction on all the actions returned.
 */
export const specOpNoSendActions = 'ac6b20a3bb320adafecd637b25c84b792ad828d3aa510d05dc841481f664277d'

/**
 * `listActions` special operation label name value.
 *
 * Processes only actions currently with status 'failed'
 *
 * Optional label value 'unfail'. If present, sets status to 'unfail', which queues them for attempted recovery by the Monitor.
 */
export const specOpFailedActions = '97d4eb1e49215e3374cc2c1939a7c43a55e95c7427bf2d45ed63e3b4e0c88153'

/**
 * @param label Action / Transaction label name value.
 * @returns true iff the `label` name is a reserved `listActions` special operation identifier.
 */
export function isListActionsSpecOp(label: string): boolean {
  return [specOpNoSendActions, specOpFailedActions].indexOf(label) >= 0
}

/**
 * `createAction` special operation label name value.
 *
 * Causes WERR_REVIEW_ACTIONS throw with dummy properties.
 *
 */
export const specOpThrowReviewActions = 'a496e747fc3ad5fabdd4ae8f91184e71f87539bd3d962aa2548942faaaf0047a'

/**
 * @param label Action / Transaction label name value.
 * @returns true iff the `label` name is a reserved `createAction` special operation identifier.
 */
export function isCreateActionSpecOp(label: string): boolean {
  return [specOpThrowReviewActions].indexOf(label) >= 0
}
