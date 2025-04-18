import {
  Transaction as BsvTransaction,
  ActionStatus,
  ListActionsResult,
  WalletAction,
  WalletActionOutput,
  WalletActionInput
} from '@bsv/sdk'
import { TableOutputX, TableTransaction, TableTxLabel } from '../index.client'
import { asString, sdk, verifyOne } from '../../index.client'
import { isListActionsSpecOp, TransactionStatus } from '../../sdk'
import { StorageIdb } from '../StorageIdb'
import { labelToSpecOp, ListActionsSpecOp } from './ListActionsSpecOp'

export async function listActionsIdb(
  storage: StorageIdb,
  auth: sdk.AuthId,
  vargs: sdk.ValidListActionsArgs
): Promise<ListActionsResult> {
  const limit = vargs.limit
  const offset = vargs.offset

  const r: ListActionsResult = {
    totalActions: 0,
    actions: []
  }

  let specOp: ListActionsSpecOp | undefined = undefined
  let specOpLabels: string[] = []
  let labels: string[] = []
  for (const label of vargs.labels) {
    if (isListActionsSpecOp(label)) {
      specOp = labelToSpecOp[label]
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
    await storage.filterTxLabels({ partial: { userId: auth.userId, isDeleted: false } }, tl => {
      if (labels.includes(tl.label)) {
        labelIds.push(tl.txLabelId)
      }
    })
  }

  const isQueryModeAll = vargs.labelQueryMode === 'all'
  if (isQueryModeAll && labelIds.length < labels.length)
    // all the required labels don't exist, impossible to satisfy.
    return r

  if (!isQueryModeAll && labelIds.length === 0 && labels.length > 0)
    // any and only non-existing labels, impossible to satisfy.
    return r

  const stati: TransactionStatus[] = specOp?.setStatusFilter
    ? specOp.setStatusFilter()
    : ['completed', 'unprocessed', 'sending', 'unproven', 'unsigned', 'nosend', 'nonfinal']

  const noLabels = labelIds.length === 0

  const txs = await storage.findTransactions({ partial: { userId: auth.userId }, status: stati, paged: { limit: vargs.limit, offset: vargs.offset }, noRawTx: true }, labelIds, isQueryModeAll)
  if (txs.length === vargs.limit) {
    r.totalActions = await storage.countTransactions({ partial: { userId: auth.userId }, status: stati }, labelIds, isQueryModeAll)
  } else {
    r.totalActions = txs.length
  }

  if (specOp?.postProcess) {
    await specOp.postProcess(storage, auth, vargs, specOpLabels, txs)
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
