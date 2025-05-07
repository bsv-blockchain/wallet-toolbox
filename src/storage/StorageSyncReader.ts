import * as sdk from '../sdk/index'
import { TableSettings } from '../storage/schema/tables/TableSettings'
import { StorageReader } from './StorageReader'

/**
 * The `StorageSyncReader` non-abstract class must be used when authentication checking access to the methods of a `StorageBaseReader` is required.
 *
 * Constructed from an `auth` object that must minimally include the authenticated user's identityKey,
 * and the `StorageBaseReader` to be protected.
 */
export class StorageSyncReader implements sdk.WalletStorageSyncReader {
  constructor(
    public auth: sdk.AuthId,
    public storage: StorageReader
  ) {}

  async makeAvailable(): Promise<TableSettings> {
    await this.storage.makeAvailable()
    if (this.auth.userId === undefined) {
      const user = await this.storage.findUserByIdentityKey(this.auth.identityKey)
      if (!user) throw new sdk.WERR_UNAUTHORIZED()
      this.auth.userId = user.userId
    }
    return this.storage.getSettings()
  }
  destroy(): Promise<void> {
    return this.storage.destroy()
  }
  async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> {
    if (!this.auth.userId) await this.makeAvailable()
    if (args.identityKey !== this.auth.identityKey) throw new sdk.WERR_UNAUTHORIZED()
    return await this.storage.getSyncChunk(args)
  }
}
