import { sdk } from '../../../index.client'

export interface TableCommission extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  commissionId: number
  userId: number
  transactionId: number
  satoshis: number
  keyOffset: string
  isRedeemed: boolean
  lockingScript: number[]
}
