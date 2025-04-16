import { sdk } from '../../../index.client'

export interface TableOutputBasket extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  basketId: number
  userId: number
  name: string
  numberOfDesiredUTXOs: number
  minimumDesiredUTXOValue: number
  isDeleted: boolean
}
