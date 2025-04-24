import { sdk } from '../../../index.client'

export interface TableSettings extends sdk.StorageIdentity, sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  /**
   * The identity key (public key) assigned to this storage
   */
  storageIdentityKey: string
  /**
   * The human readable name assigned to this storage.
   */
  storageName: string
  chain: sdk.Chain
  dbtype: 'SQLite' | 'MySQL' | 'IndexedDB'
  maxOutputScript: number
}
