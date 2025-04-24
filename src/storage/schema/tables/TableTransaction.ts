import { Base64String } from '@bsv/sdk'
import { sdk } from '../../../index.client'

export interface TableTransaction extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  transactionId: number
  userId: number
  provenTxId?: number
  status: sdk.TransactionStatus
  /**
   * max length of 64, hex encoded
   */
  reference: Base64String
  /**
   * true if transaction originated in this wallet, change returns to it.
   * false for a transaction created externally and handed in to this wallet.
   */
  isOutgoing: boolean
  satoshis: number
  description: string
  /**
   * If not undefined, must match value in associated rawTransaction.
   */
  version?: number
  /**
   * Optional. Default is zero.
   * When the transaction can be processed into a block:
   * >= 500,000,000 values are interpreted as minimum required unix time stamps in seconds
   * < 500,000,000 values are interpreted as minimum required block height
   */
  lockTime?: number
  txid?: string
  inputBEEF?: number[]
  rawTx?: number[]
}

export const transactionColumnsWithoutRawTx = [
  'created_at',
  'updated_at',
  'transactionId',
  'userId',
  'provenTxId',
  'status',
  'reference',
  'isOutgoing',
  'satoshis',
  'version',
  'lockTime',
  'description',
  'txid'
  //   'inputBEEF',
  //   'rawTx',
]
