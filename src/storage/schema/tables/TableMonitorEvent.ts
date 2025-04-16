import { sdk } from '../../../index.client'

export interface TableMonitorEvent extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  id: number
  event: string
  details?: string
}
