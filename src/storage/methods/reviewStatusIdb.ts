import { Beef } from '@bsv/sdk'
import { Knex } from 'knex'
import { TableOutput, TableTransaction } from '../index.client'
import { sdk } from '../../index.client'
import { StorageIdb } from '../StorageIdb'

/**
 * Looks for unpropagated state:
 *
 * 1. set transactions to 'failed' if not already failed and provenTxReq with matching txid has status of 'invalid'.
 * 2. sets transactions to 'completed' if provenTx with matching txid exists and current provenTxId is null.
 * 3. sets outputs to spendable true, spentBy undefined if spentBy is a transaction with status 'failed'.
 *
 * @param storage
 * @param args
 * @returns
 */
export async function reviewStatusIdb(
  storage: StorageIdb,
  args: { agedLimit: Date; trx?: sdk.TrxToken }
): Promise<{ log: string }> {
  const r: { log: string } = { log: '' }

  // 1. set transactions to 'failed' if not already failed and provenTxReq with matching txid has status of 'invalid'.
  const invalidTxids: string[] = []
  await storage.filterProvenTxReqs({ partial: { status: 'invalid' } }, txReq => {
    invalidTxids.push(txReq.txid)
  })
  for (const txid of invalidTxids) {
    const txs = await storage.findTransactions({ partial: { txid } })
    for (const tx of txs) {
      if (tx.status !== 'failed') {
        r.log += `transaction ${tx.transactionId} updated to status of 'failed' was ${tx.status}\n`
        await storage.updateTransactionStatus('failed', tx.transactionId)
      }
    }
  }

  // 2. sets transactions to 'completed' if provenTx with matching txid exists and current provenTxId is null.
  // 3. sets outputs to spendable true, spentBy undefined if spentBy is a transaction with status 'failed'.

  return r
}
