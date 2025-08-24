import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'
import { TableUser } from '../tables/TableUser'
import { WERR_INTERNAL } from '../../../sdk/WERR_errors'

export class EntityUser extends EntityBase<TableUser> {
  constructor(api?: TableUser) {
    const now = new Date()
    super(
      api || {
        userId: 0,
        created_at: now,
        updated_at: now,
        identityKey: '',
        activeStorage: ''
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
  }

  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get created_at() {
    return this.api.created_at
  }
  set created_at(v: Date) {
    this.api.created_at = v
  }
  get updated_at() {
    return this.api.updated_at
  }
  set updated_at(v: Date) {
    this.api.updated_at = v
  }
  get identityKey() {
    return this.api.identityKey
  }
  set identityKey(v: string) {
    this.api.identityKey = v
  }
  get activeStorage() {
    return this.api.activeStorage
  }
  set activeStorage(v: string) {
    this.api.activeStorage = v
  }

  override get id(): number {
    return this.api.userId
  }
  override set id(v: number) {
    this.api.userId = v
  }
  override get entityName(): string {
    return 'user'
  }
  override get entityTable(): string {
    return 'users'
  }

  override equals(ei: TableUser, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()
    if (eo.identityKey != ei.identityKey || eo.activeStorage != ei.activeStorage) return false
    if (!syncMap) {
      /** */
    }
    return true
  }
  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableUser,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityUser; eiId: number }> {
    const ef = verifyOneOrNone(await storage.findUsers({ partial: { identityKey: ei.identityKey }, trx }))
    if (ef && ef.userId != userId) throw new WERR_INTERNAL('logic error, userIds don not match.')
    return {
      found: !!ef,
      eo: new EntityUser(ef || { ...ei }),
      eiId: verifyId(ei.userId)
    }
  }
  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    throw new WERR_INTERNAL('a sync chunk merge must never create a new user')
  }
  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableUser,
    syncMap?: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    // The condition on activeStorage here is critical as a new user record may have just been created
    // in a backup store to which a backup is being pushed.
    if (ei.updated_at > this.updated_at || (this.activeStorage === undefined && ei.activeStorage !== undefined)) {
      this.activeStorage = ei.activeStorage
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateUser(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
