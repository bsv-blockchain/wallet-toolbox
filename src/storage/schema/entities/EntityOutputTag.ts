import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableOutputTag } from '../tables/TableOutputTag'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityOutputTag extends EntityBase<TableOutputTag> {
  constructor(api?: TableOutputTag) {
    const now = new Date()
    super(
      api || {
        outputTagId: 0,
        created_at: now,
        updated_at: now,
        tag: '',
        userId: 0,
        isDeleted: false
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
  }

  get outputTagId() {
    return this.api.outputTagId
  }
  set outputTagId(v: number) {
    this.api.outputTagId = v
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
  get tag() {
    return this.api.tag
  }
  set tag(v: string) {
    this.api.tag = v
  }
  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get isDeleted() {
    return this.api.isDeleted
  }
  set isDeleted(v: boolean) {
    this.api.isDeleted = v
  }

  override get id(): number {
    return this.api.outputTagId
  }
  override set id(v: number) {
    this.api.outputTagId = v
  }
  override get entityName(): string {
    return 'outputTag'
  }
  override get entityTable(): string {
    return 'output_tags'
  }

  override equals(ei: TableOutputTag, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()
    if (eo.tag != ei.tag || eo.isDeleted != ei.isDeleted) return false
    if (!syncMap) {
      if (eo.userId !== ei.userId) return false
    }
    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableOutputTag,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityOutputTag; eiId: number }> {
    const ef = verifyOneOrNone(await storage.findOutputTags({ partial: { tag: ei.tag, userId }, trx }))
    return {
      found: !!ef,
      eo: new EntityOutputTag(ef || { ...ei }),
      eiId: verifyId(ei.outputTagId)
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.userId = userId
    this.outputTagId = 0
    this.outputTagId = await storage.insertOutputTag(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableOutputTag,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.isDeleted = ei.isDeleted
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateOutputTag(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
