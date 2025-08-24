import { Knex } from 'knex'
import { StorageKnex } from '../StorageKnex'
import { TrxToken } from '../../sdk/WalletStorage.interfaces'
import { WalletError } from '../../sdk/WalletError'
import { TableTransaction } from '../schema/tables/TableTransaction'
import { TableOutput } from '../schema/tables/TableOutput'

/**
 * Looks for unpropagated state:
 *
 * 1. set transactions to 'failed' if not already failed and provenTxReq with matching txid has status of 'invalid'.
 * 2. sets outputs to spendable true, spentBy undefined if spentBy is a transaction with status 'failed'.
 * 3. sets transactions to 'completed' if provenTx with matching txid exists and current provenTxId is null.
 *
 * @param storage
 * @param args
 * @returns
 */
export async function reviewStatus(
  storage: StorageKnex,
  args: { agedLimit: Date; trx?: TrxToken }
): Promise<{ log: string }> {
  const r: { log: string } = { log: '' }

  const runReviewStatusQuery = async <T extends object>(pq: ReviewStatusQuery): Promise<void> => {
    try {
      pq.sql = pq.q.toString()
      const count = await pq.q
      if (count > 0) {
        r.log += `${count} ${pq.log}\n`
      }
    } catch (eu: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const e = WalletError.fromUnknown(eu)
      throw eu
    }
  }

  const k = storage.toDb(args.trx)

  const qs: ReviewStatusQuery[] = []

  qs.push({
    log: `transactions updated to status of 'failed' where provenTxReq with matching txid is 'invalid'`,
    /*
        UPDATE transactions SET status = 'failed'
        WHERE exists(select 1 from proven_tx_reqs as r where transactions.txid = r.txid and r.status = 'invalid')
        */
    q: k<TableTransaction>('transactions')
      .update({ status: 'failed' })
      .whereNot({ status: 'failed' })
      .whereExists(function () {
        this.select(k.raw(1))
          .from('proven_tx_reqs as r')
          .whereRaw(`transactions.txid = r.txid and r.status = 'invalid'`)
      })
  })

  qs.push({
    log: `outputs updated to spendable where spentBy is a transaction with status 'failed'`,
    /*
        UPDATE outputs SET spentBy = null, spendable = 1
        where exists(select 1 from transactions as t where outputs.spentBy = t.transactionId and t.status = 'failed')
        */
    q: k<TableOutput>('outputs')
      .update({ spentBy: null as unknown as undefined, spendable: true })
      .whereExists(function () {
        this.select(k.raw(1))
          .from('transactions as t')
          .whereRaw(`outputs.spentBy = t.transactionId and t.status = 'failed'`)
      })
  })

  qs.push({
    log: `transactions updated with provenTxId and status of 'completed' where provenTx with matching txid exists`,
    /*
        UPDATE transactions SET status = 'completed', provenTxId = p.provenTxId
        FROM proven_txs p
        WHERE transactions.txid = p.txid AND transactions.provenTxId IS NULL
        */
    q: k<TableTransaction>('transactions')
      .update({
        status: 'completed',
        provenTxId: k.raw('(SELECT provenTxId FROM proven_txs AS p WHERE transactions.txid = p.txid)')
      })
      .whereNull('provenTxId')
      .whereExists(function () {
        this.select(k.raw(1)).from('proven_txs as p').whereRaw('transactions.txid = p.txid')
      })
  })

  for (const q of qs) await runReviewStatusQuery(q)

  return r
}

interface ReviewStatusQuery {
  q: Knex.QueryBuilder<any, number>
  sql?: string
  log: string
}
