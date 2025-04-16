import { sdk } from '../../../index.client'

export interface TableUser extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  userId: number
  /**
   * PubKeyHex uniquely identifying user.
   * Typically 66 hex digits.
   */
  identityKey: string
  /**
   * The storageIdentityKey value of the active wallet storage.
   */
  activeStorage: string
}
