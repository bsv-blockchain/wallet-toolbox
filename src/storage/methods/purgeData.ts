import { Beef } from '@bsv/sdk'
import { Knex } from 'knex'
import { StorageKnex } from '../StorageKnex'
import { PurgeParams, PurgeResults, StorageGetBeefOptions, TrxToken } from '../../sdk/WalletStorage.interfaces'
import { WalletError } from '../../sdk/WalletError'
import { TableTransaction } from '../schema/tables/TableTransaction'
import { TableOutput } from '../schema/tables/TableOutput'
import { TableOutputTagMap } from '../schema/tables/TableOutputTagMap'
import { TableTxLabelMap } from '../schema/tables/TableTxLabelMap'
import { TableCommission } from '../schema/tables/TableCommission'

export async function purgeData(storage: StorageKnex, params: PurgeParams, trx?: TrxToken): Promise<PurgeResults> {
  const r: PurgeResults = { count: 0, log: '' }
  const defaultAge = 1000 * 60 * 60 * 24 * 14

  const runPurgeQuery = async <T extends object>(pq: PurgeQuery): Promise<void> => {
    try {
      pq.sql = pq.q.toString()
      const count = await pq.q
      if (count > 0) {
        r.count += count
        r.log += `${count} ${pq.log}\n`
      }
    } catch (eu: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const e = WalletError.fromUnknown(eu)
      throw eu
    }
  }

  if (params.purgeCompleted) {
    const age = params.purgeCompletedAge || defaultAge
    const before = toSqlWhereDate(new Date(Date.now() - age))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qs: PurgeQuery[] = []

    // select * from transactions where updated_at < '2024-08-20' and status = 'completed' and not provenTxId is null and (not truncatedExternalInputs is null or not beef is null or not rawTx is null)
    qs.push({
      log: 'conpleted transactions purged of transient data',
      q: storage
        .toDb(trx)('transactions')
        .update({
          inputBEEF: null,
          rawTx: null
        })
        .where('updated_at', '<', before)
        .where('status', 'completed')
        .whereNotNull('provenTxId')
        .where(function () {
          this.orWhereNotNull('inputBEEF')
          this.orWhereNotNull('rawTx')
        })
    })

    const completedReqs = await storage
      .toDb(trx)<{ provenTxReqId: number }>('proven_tx_reqs')
      .select('provenTxReqId')
      .where('updated_at', '<', before)
      .where('status', 'completed')
      .whereNotNull('provenTxId')
      .where('notified', 1)
    const completedReqIds = completedReqs.map(o => o.provenTxReqId)

    if (completedReqIds.length > 0) {
      qs.push({
        log: 'completed proven_tx_reqs deleted',
        q: storage.toDb(trx)('proven_tx_reqs').whereIn('provenTxReqId', completedReqIds).delete()
      })
    }

    for (const q of qs) await runPurgeQuery(q)
  }

  if (params.purgeFailed) {
    const age = params.purgeFailedAge || defaultAge
    const before = toSqlWhereDate(new Date(Date.now() - age))

    const qs: PurgeQuery[] = []

    const failedTxsQ = storage
      .toDb(trx)<{ transactionId: number }>('transactions')
      .select('transactionId')
      .where('updated_at', '<', before)
      .where('status', 'failed')
    const txs = await failedTxsQ
    const failedTxIds = txs.map(tx => tx.transactionId)

    await deleteTransactions(failedTxIds, qs, 'failed', true)

    const invalidReqs = await storage
      .toDb(trx)<{ provenTxReqId: number }>('proven_tx_reqs')
      .select('provenTxReqId')
      .where('updated_at', '<', before)
      .where('status', 'invalid')
    const invalidReqIds = invalidReqs.map(o => o.provenTxReqId)
    if (invalidReqIds.length > 0)
      qs.push({
        log: 'invalid proven_tx_reqs deleted',
        q: storage.toDb(trx)('proven_tx_reqs').whereIn('provenTxReqId', invalidReqIds).delete()
      })

    const doubleSpendReqs = await storage
      .toDb(trx)<{ provenTxReqId: number }>('proven_tx_reqs')
      .select('provenTxReqId')
      .where('updated_at', '<', before)
      .where('status', 'doubleSpend')
    const doubleSpendReqIds = doubleSpendReqs.map(o => o.provenTxReqId)
    if (doubleSpendReqIds.length > 0)
      qs.push({
        log: 'doubleSpend proven_tx_reqs deleted',
        q: storage.toDb(trx)('proven_tx_reqs').whereIn('provenTxReqId', doubleSpendReqIds).delete()
      })

    for (const q of qs) await runPurgeQuery(q)
  }

  if (params.purgeSpent) {
    const age = params.purgeSpentAge || defaultAge
    const before = toSqlWhereDate(new Date(Date.now() - age))

    const beef = new Beef()
    const utxos = await storage.findOutputs({
      partial: { spendable: true },
      txStatus: ['sending', 'unproven', 'completed', 'nosend']
    })
    for (const utxo of utxos) {
      // Figure out all the txids required to prove the validity of this utxo and merge proofs into beef.
      const options: StorageGetBeefOptions = {
        mergeToBeef: beef,
        ignoreServices: true
      }
      if (utxo.txid) await storage.getBeefForTransaction(utxo.txid, options)
    }
    const proofTxids: Record<string, boolean> = {}
    for (const btx of beef.txs) proofTxids[btx.txid] = true

    let qs: PurgeQuery[] = []

    const spentTxsQ = storage
      .toDb(trx)<TableTransaction>('transactions')
      .where('updated_at', '<', before)
      .where('status', 'completed')
      .whereRaw(
        `not exists(select outputId from outputs as o where o.transactionId = transactions.transactionId and o.spendable = 1)`
      )
    const txs: TableTransaction[] = await spentTxsQ
    // Save any spent txid still needed to prove a utxo:
    const nptxs = txs.filter(t => !proofTxids[t.txid || ''])
    let spentTxIds = nptxs.map(tx => tx.transactionId)

    if (spentTxIds.length > 0) {
      const update: Partial<TableOutput> = {
        spentBy: null as unknown as undefined
      }
      qs.push({
        log: 'spent outputs no longer tracked by spentBy',
        q: storage
          .toDb(trx)<TableOutput>('outputs')
          .update(storage.validatePartialForUpdate(update, undefined, ['spendable']))
          .where('spendable', false)
          .whereIn('spentBy', spentTxIds)
      })

      await deleteTransactions(spentTxIds, qs, 'spent', false)

      for (const q of qs) await runPurgeQuery(q)
    }
  }

  // Delete proven_txs no longer referenced by remaining transactions.
  const qs: PurgeQuery[] = []
  qs.push({
    log: 'orphan proven_txs deleted',
    q: storage
      .toDb(trx)('proven_txs')
      .whereRaw(
        `not exists(select * from transactions as t where t.txid = proven_txs.txid or t.provenTxId = proven_txs.provenTxId)`
      )
      .whereRaw(
        `not exists(select * from proven_tx_reqs as r where r.txid = proven_txs.txid or r.provenTxId = proven_txs.provenTxId)`
      )
      .delete()
  })
  for (const q of qs) await runPurgeQuery(q)

  return r

  async function deleteTransactions(
    transactionIds: number[],
    qs: PurgeQuery[],
    reason: string,
    markNotSpentBy: boolean
  ) {
    if (transactionIds.length > 0) {
      const outputs = await storage
        .toDb(trx)<{ outputId: number }>('outputs')
        .select('outputId')
        .whereIn('transactionId', transactionIds)
      const outputIds = outputs.map(o => o.outputId)
      if (outputIds.length > 0) {
        qs.push({
          log: `${reason} output_tags_map deleted`,
          q: storage.toDb(trx)<TableOutputTagMap>('output_tags_map').whereIn('outputId', outputIds).delete()
        })
        qs.push({
          log: `${reason} outputs deleted`,
          q: storage.toDb(trx)<TableOutput>('outputs').whereIn('outputId', outputIds).delete()
        })
      }

      qs.push({
        log: `${reason} tx_labels_map deleted`,
        q: storage.toDb(trx)<TableTxLabelMap>('tx_labels_map').whereIn('transactionId', transactionIds).delete()
      })

      qs.push({
        log: `${reason} commissions deleted`,
        q: storage.toDb(trx)<TableCommission>('commissions').whereIn('transactionId', transactionIds).delete()
      })

      if (markNotSpentBy) {
        qs.push({
          log: 'unspent outputs updated to spendable',
          q: storage
            .toDb(trx)<TableOutput>('outputs')
            .update({ spendable: true, spentBy: null as unknown as undefined })
            .whereIn('spentBy', transactionIds)
        })
      }

      qs.push({
        log: `${reason} transactions deleted`,
        q: storage.toDb(trx)<TableTransaction>('transactions').whereIn('transactionId', transactionIds).delete()
      })
    }
  }
}

interface PurgeQuery {
  q: Knex.QueryBuilder<any, number>
  sql?: string
  log: string
}

function toSqlWhereDate(d: Date): string {
  let s = d.toISOString()
  s = s.replace('T', ' ')
  s = s.replace('Z', '')
  return s
}
