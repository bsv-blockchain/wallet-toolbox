import {
  Transaction as BsvTransaction,
  ActionStatus,
  ListActionsResult,
  WalletAction,
  WalletActionOutput,
  WalletActionInput
} from '@bsv/sdk'
import { StorageKnex } from '../StorageKnex'
import { getLabelToSpecOp, ListActionsSpecOp } from './ListActionsSpecOp'
import { AuthId } from '../../sdk/WalletStorage.interfaces'
import { ValidListActionsArgs } from '../../sdk/validationHelpers'
import { isListActionsSpecOp } from '../../sdk/types'
import { TableTxLabel } from '../schema/tables/TableTxLabel'
import { TableTransaction } from '../schema/tables/TableTransaction'
import { verifyOne } from '../../utility/utilityHelpers'
import { TableOutputX } from '../schema/tables/TableOutput'
import { asString } from '../../utility/utilityHelpers.noBuffer'

export async function listActions(
  storage: StorageKnex,
  auth: AuthId,
  vargs: ValidListActionsArgs
): Promise<ListActionsResult> {
  const limit = vargs.limit
  const offset = vargs.offset

  const k = storage.toDb(undefined)

  const r: ListActionsResult = {
    totalActions: 0,
    actions: []
  }

  let specOp: ListActionsSpecOp | undefined = undefined
  let specOpLabels: string[] = []
  let labels: string[] = []
  for (const label of vargs.labels) {
    if (isListActionsSpecOp(label)) {
      specOp = getLabelToSpecOp()[label]
    } else {
      labels.push(label)
    }
  }
  if (specOp?.labelsToIntercept !== undefined) {
    const intercept = specOp.labelsToIntercept!
    const labels2 = labels
    labels = []
    if (intercept.length === 0) {
      specOpLabels = labels2
    }
    for (const label of labels2) {
      if (intercept.indexOf(label) >= 0) {
        specOpLabels.push(label)
      } else {
        labels.push(label)
      }
    }
  }

  let labelIds: number[] = []
  if (labels.length > 0) {
    const q = k<TableTxLabel>('tx_labels')
      .where({
        userId: auth.userId,
        isDeleted: false
      })
      .whereNotNull('txLabelId')
      .whereIn('label', labels)
      .select('txLabelId')
    const r = await q
    labelIds = r.map(r => r.txLabelId!)
  }

  const isQueryModeAll = vargs.labelQueryMode === 'all'
  if (isQueryModeAll && labelIds.length < labels.length)
    // all the required labels don't exist, impossible to satisfy.
    return r

  if (!isQueryModeAll && labelIds.length === 0 && labels.length > 0)
    // any and only non-existing labels, impossible to satisfy.
    return r

  const columns: string[] = [
    'transactionId',
    'reference',
    'txid',
    'satoshis',
    'status',
    'isOutgoing',
    'description',
    'version',
    'lockTime'
  ]

  const stati: string[] = specOp?.setStatusFilter
    ? specOp.setStatusFilter()
    : ['completed', 'unprocessed', 'sending', 'unproven', 'unsigned', 'nosend', 'nonfinal']

  const noLabels = labelIds.length === 0

  const makeWithLabelsQueries = () => {
    const cteq = k.raw(`
            SELECT ${columns.map(c => 't.' + c).join(',')}, 
                    (SELECT COUNT(*) 
                    FROM tx_labels_map AS m 
                    WHERE m.transactionId = t.transactionId 
                    AND m.txLabelId IN (${labelIds.join(',')}) 
                    ) AS lc
            FROM transactions AS t
            WHERE t.userId = ${auth.userId}
            AND t.status in (${stati.map(s => `'${s}'`).join(',')})
            `)

    const q = k.with('tlc', cteq)
    q.from('tlc')
    if (isQueryModeAll) q.where('lc', labelIds.length)
    else q.where('lc', '>', 0)
    const qcount = q.clone()
    q.select(columns)
    qcount.count('transactionId as total')
    return { q, qcount }
  }

  const makeWithoutLabelsQueries = () => {
    const q = k('transactions').where('userId', auth.userId).whereIn('status', stati)
    const qcount = q.clone().count('transactionId as total')
    return { q, qcount }
  }

  const { q, qcount } = noLabels ? makeWithoutLabelsQueries() : makeWithLabelsQueries()

  q.limit(limit).offset(offset).orderBy('transactionId', 'asc')

  const txs: Partial<TableTransaction>[] = await q

  if (specOp?.postProcess) {
    await specOp.postProcess(storage, auth, vargs, specOpLabels, txs)
  }

  if (!limit || txs.length < limit) r.totalActions = txs.length
  else {
    const total = verifyOne(await qcount)['total']
    r.totalActions = Number(total)
  }

  for (const tx of txs) {
    const wtx: WalletAction = {
      txid: tx.txid || '',
      satoshis: tx.satoshis || 0,
      status: <ActionStatus>tx.status!,
      isOutgoing: !!tx.isOutgoing,
      description: tx.description || '',
      version: tx.version || 0,
      lockTime: tx.lockTime || 0
    }
    r.actions.push(wtx)
  }

  if (vargs.includeLabels || vargs.includeInputs || vargs.includeOutputs) {
    await Promise.all(
      txs.map(async (tx, i) => {
        //let i = -1
        //for (const tx of txs) {
        //    i++
        const action = r.actions[i]
        if (vargs.includeLabels) {
          action.labels = (await storage.getLabelsForTransactionId(tx.transactionId)).map(l => l.label)
        }
        if (vargs.includeOutputs) {
          const outputs: TableOutputX[] = await storage.findOutputs({
            partial: { transactionId: tx.transactionId },
            noScript: !vargs.includeOutputLockingScripts
          })
          action.outputs = []
          for (const o of outputs) {
            await storage.extendOutput(o, true, true)
            const wo: WalletActionOutput = {
              satoshis: o.satoshis || 0,
              spendable: !!o.spendable,
              tags: o.tags?.map(t => t.tag) || [],
              outputIndex: Number(o.vout),
              outputDescription: o.outputDescription || '',
              basket: o.basket?.name || ''
            }
            if (vargs.includeOutputLockingScripts) wo.lockingScript = asString(o.lockingScript || [])
            action.outputs.push(wo)
          }
        }
        if (vargs.includeInputs) {
          const inputs: TableOutputX[] = await storage.findOutputs({
            partial: { spentBy: tx.transactionId },
            noScript: !vargs.includeInputSourceLockingScripts
          })
          action.inputs = []
          if (inputs.length > 0) {
            const rawTx = await storage.getRawTxOfKnownValidTransaction(tx.txid)
            let bsvTx: BsvTransaction | undefined = undefined
            if (rawTx) {
              bsvTx = BsvTransaction.fromBinary(rawTx)
            }
            for (const o of inputs) {
              await storage.extendOutput(o, true, true)
              const input = bsvTx?.inputs.find(v => v.sourceTXID === o.txid && v.sourceOutputIndex === o.vout)
              const wo: WalletActionInput = {
                sourceOutpoint: `${o.txid}.${o.vout}`,
                sourceSatoshis: o.satoshis || 0,
                inputDescription: o.outputDescription || '',
                sequenceNumber: input?.sequence || 0
              }
              action.inputs.push(wo)
              if (vargs.includeInputSourceLockingScripts) {
                wo.sourceLockingScript = asString(o.lockingScript || [])
              }
              if (vargs.includeInputUnlockingScripts) {
                wo.unlockingScript = input?.unlockingScript?.toHex()
              }
            }
          }
        }
        //}
      })
    )
  }
  return r
}
