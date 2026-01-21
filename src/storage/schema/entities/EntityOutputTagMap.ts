import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { WERR_INVALID_OPERATION } from '../../../sdk/WERR_errors'
import { verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableOutputTagMap } from '../tables/TableOutputTagMap'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityOutputTagMap extends EntityBase<TableOutputTagMap> {
  constructor(api?: TableOutputTagMap) {
    const now = new Date()
    super(
      api || {
        created_at: now,
        updated_at: now,
        outputId: 0,
        outputTagId: 0,
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
  get outputId() {
    return this.api.outputId
  }
  set outputId(v: number) {
    this.api.outputId = v
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
  get isDeleted() {
    return this.api.isDeleted
  }
  set isDeleted(v: boolean) {
    this.api.isDeleted = v
  }

  override get id(): number {
    throw new WERR_INVALID_OPERATION('entity has no "id" value')
  }
  override get entityName(): string {
    return 'outputTagMap'
  }
  override get entityTable(): string {
    return 'output_tags_map'
  }

  override equals(ei: TableOutputTagMap, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()

    if (
      eo.outputId !== (syncMap ? syncMap.output.idMap[verifyId(ei.outputId)] : ei.outputId) ||
      eo.outputTagId !== (syncMap ? syncMap.outputTag.idMap[verifyId(ei.outputTagId)] : ei.outputTagId) ||
      eo.isDeleted !== ei.isDeleted
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableOutputTagMap,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityOutputTagMap; eiId: number }> {
    const outputId = syncMap.output.idMap[ei.outputId]
    const outputTagId = syncMap.outputTag.idMap[ei.outputTagId]
    const ef = verifyOneOrNone(
      await storage.findOutputTagMaps({
        partial: { outputId, outputTagId },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityOutputTagMap(ef || { ...ei }),
      eiId: -1
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.outputId = syncMap.output.idMap[this.outputId]
    this.outputTagId = syncMap.outputTag.idMap[this.outputTagId]
    await storage.insertOutputTagMap(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableOutputTagMap,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.isDeleted = ei.isDeleted
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateOutputTagMap(this.outputId, this.outputTagId, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
