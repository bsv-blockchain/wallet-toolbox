import { specOpFailedActions, specOpNoSendActions, TransactionStatus } from '../../sdk/types'
import { ValidListActionsArgs } from '../../sdk/validationHelpers'
import { AuthId } from '../../sdk/WalletStorage.interfaces'
import { TableTransaction } from '../schema/tables/TableTransaction'
import { StorageProvider } from '../StorageProvider'

export interface ListActionsSpecOp {
  name: string
  /**
   * undefined to intercept no labels from vargs,
   * empty array to intercept all labels,
   * or an explicit array of labels to intercept.
   */
  labelsToIntercept?: string[]
  setStatusFilter?: () => TransactionStatus[]
  postProcess?: (
    s: StorageProvider,
    auth: AuthId,
    vargs: ValidListActionsArgs,
    specOpLabels: string[],
    txs: Partial<TableTransaction>[]
  ) => Promise<void>
}

export const getLabelToSpecOp: () => Record<string, ListActionsSpecOp> = () => {
  return {
    [specOpNoSendActions]: {
      name: 'noSendActions',
      labelsToIntercept: ['abort'],
      setStatusFilter: () => ['nosend'],
      postProcess: async (
        s: StorageProvider,
        auth: AuthId,
        vargs: ValidListActionsArgs,
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
    [specOpFailedActions]: {
      name: 'failedActions',
      labelsToIntercept: ['unfail'],
      setStatusFilter: () => ['failed'],
      postProcess: async (
        s: StorageProvider,
        auth: AuthId,
        vargs: ValidListActionsArgs,
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
}
