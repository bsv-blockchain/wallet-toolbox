import { sdk } from '../../index.client'
import { TableTransaction } from '../index.client'
import { StorageProvider } from '../StorageProvider'

export interface ListActionsSpecOp {
  name: string
  /**
   * undefined to intercept no labels from vargs,
   * empty array to intercept all labels,
   * or an explicit array of labels to intercept.
   */
  labelsToIntercept?: string[]
  setStatusFilter?: () => sdk.TransactionStatus[]
  postProcess?: (
    s: StorageProvider,
    auth: sdk.AuthId,
    vargs: sdk.ValidListActionsArgs,
    specOpLabels: string[],
    txs: Partial<TableTransaction>[]
  ) => Promise<void>
}

export const labelToSpecOp: Record<string, ListActionsSpecOp> = {
  [sdk.specOpNoSendActions]: {
    name: 'noSendActions',
    labelsToIntercept: ['abort'],
    setStatusFilter: () => ['nosend'],
    postProcess: async (
      s: StorageProvider,
      auth: sdk.AuthId,
      vargs: sdk.ValidListActionsArgs,
      specOpLabels: string[],
      txs: Partial<TableTransaction>[]
    ): Promise<void> => {
      if (specOpLabels.indexOf('abort') >= 0) {
        for (const tx of txs) {
          if (tx.status === 'nosend') {
            await s.abortAction(auth, { reference: tx.reference! })
            tx.status = 'failed'
          }
        }
      }
    }
  },
  [sdk.specOpFailedActions]: {
    name: 'failedActions',
    labelsToIntercept: ['unfail'],
    setStatusFilter: () => ['failed'],
    postProcess: async (
      s: StorageProvider,
      auth: sdk.AuthId,
      vargs: sdk.ValidListActionsArgs,
      specOpLabels: string[],
      txs: Partial<TableTransaction>[]
    ): Promise<void> => {
      if (specOpLabels.indexOf('unfail') >= 0) {
        for (const tx of txs) {
          if (tx.status === 'failed') {
            await s.updateTransaction(tx.transactionId!, { status: 'unfail' })
            // wallet wire does not support 'unfail' status, return as 'failed'.
          }
        }
      }
    }
  }
}
