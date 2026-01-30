import { Beef } from '@bsv/sdk'
import { StorageProvider } from '../StorageProvider'
import { ProvenOrRawTx, StorageGetBeefOptions } from '../../sdk/WalletStorage.interfaces'
import { EntityProvenTx } from '../schema/entities/EntityProvenTx'
import { WERR_INVALID_MERKLE_ROOT, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../sdk/WERR_errors'
import { asBsvSdkTx, verifyTruthy } from '../../utility/utilityHelpers'

/**
 * Creates a `Beef` to support the validity of a transaction identified by its `txid`.
 *
 * `storage` is used to retrieve proven transactions and their merkle paths,
 * or proven_tx_req record with beef of external inputs (internal inputs meged by recursion).
 * Otherwise external services are used.
 *
 * `options.maxRecursionDepth` can be set to prevent overly deep chained dependencies. Will throw ERR_EXTSVS_ENVELOPE_DEPTH if exceeded.
 *
 * If `trustSelf` is true, a partial `Beef` will be returned where transactions known by `storage` to
 * be valid by verified proof are represented solely by 'txid'.
 *
 * If `knownTxids` is defined, any 'txid' required by the `Beef` that appears in the array is represented solely as a 'known' txid.
 *
 * @param storage the chain on which txid exists.
 * @param txid the transaction hash for which an envelope is requested.
 * @param options
 */
export async function getBeefForTransaction(
  storage: StorageProvider,
  txid: string,
  options: StorageGetBeefOptions
): Promise<Beef> {
  const beef =
    // deserialize mergeToBeef if it is an array
    Array.isArray(options.mergeToBeef)
      ? Beef.fromBinary(options.mergeToBeef)
      : // otherwise if undefined create a new Beef
        options.mergeToBeef || new Beef()

  await mergeBeefForTransactionRecurse(beef, storage, txid, options, 0)

  return beef
}

/**
 * @returns rawTx if txid known to network, if merkle proof available then also proven result is valid.
 */
async function getProvenOrRawTxFromServices(
  storage: StorageProvider,
  txid: string,
  options: StorageGetBeefOptions
): Promise<ProvenOrRawTx> {
  const services = storage.getServices()
  const por = await EntityProvenTx.fromTxid(txid, await storage.getServices())
  if (por.proven && !options.ignoreStorage && !options.ignoreNewProven) {
    por.proven.provenTxId = await storage.insertProvenTx(por.proven.toApi())
  }
  return { proven: por.proven?.toApi(), rawTx: por.rawTx }
}

async function mergeBeefForTransactionRecurse(
  beef: Beef,
  storage: StorageProvider,
  txid: string,
  options: StorageGetBeefOptions,
  recursionDepth: number
): Promise<Beef> {
  const maxDepth = storage.maxRecursionDepth
  if (maxDepth && maxDepth <= recursionDepth)
    throw new WERR_INVALID_OPERATION(`Maximum BEEF depth exceeded. Limit is ${storage.maxRecursionDepth}`)

  if (options.knownTxids && options.knownTxids.indexOf(txid) > -1) {
    // This txid is one of the txids the caller claims to already know are valid...
    beef.mergeTxidOnly(txid)
    return beef
  }

  if (!options.ignoreStorage) {
    // if we can use storage, ask storage if it has the txid
    const requiredLevels = options.minProofLevel === undefined ? undefined : options.minProofLevel + recursionDepth
    const knownBeef = await storage.getValidBeefForTxid(
      txid,
      beef,
      options.trustSelf,
      options.knownTxids,
      undefined,
      requiredLevels,
      options.chainTracker,
      options.skipInvalidProofs
    )
    if (knownBeef) return knownBeef
  }

  if (options.ignoreServices)
    throw new WERR_INVALID_PARAMETER(`txid ${txid}`, `valid transaction on chain ${storage.chain}`)

  // if storage doesn't know about txid, use services
  // to find it and if it has a proof, remember it.
  const r = await getProvenOrRawTxFromServices(storage, txid, options)

  if (r.proven && options.minProofLevel !== undefined && options.minProofLevel > recursionDepth) {
    // ignore proof at this recursion depth
    r.proven = undefined
  }

  if (r.proven) {
    // storage has proven this txid,
    // merge both the raw transaction and its merkle path
    const mp = new EntityProvenTx(r.proven).getMerklePath()
    if (options.chainTracker) {
      const root = mp.computeRoot()
      const isValid = await options.chainTracker.isValidRootForHeight(root, r.proven.height)
      if (!isValid) {
        if (!options.skipInvalidProofs) {
          throw new WERR_INVALID_MERKLE_ROOT(r.proven.blockHash, r.proven.height, root, txid)
        }
        // ignore this currently invalid proof and try to recurse deeper
        r.proven = undefined
      }
    }
    if (r.proven) {
      beef.mergeRawTx(r.proven.rawTx)
      beef.mergeBump(mp)
      return beef
    }
  }

  if (!r.rawTx) throw new WERR_INVALID_PARAMETER(`txid ${txid}`, `valid transaction on chain ${storage.chain}`)

  // merge the raw transaction and recurse over its inputs.
  beef.mergeRawTx(r.rawTx!)
  // recurse inputs
  const tx = asBsvSdkTx(r.rawTx!)
  for (const input of tx.inputs) {
    const inputTxid = verifyTruthy(input.sourceTXID)
    if (!beef.findTxid(inputTxid)) {
      // Only if the txid is not already in the list of beef transactions.
      await mergeBeefForTransactionRecurse(beef, storage, inputTxid, options, recursionDepth + 1)
    }
  }

  return beef
}
