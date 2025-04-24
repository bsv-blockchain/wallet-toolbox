import { sdk } from '../../../index.client'

export interface TableTxLabelMap extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  txLabelId: number
  transactionId: number
  isDeleted: boolean
}
