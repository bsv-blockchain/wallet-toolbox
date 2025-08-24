import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableOutputBasket } from '../tables/TableOutputBasket'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityOutputBasket extends EntityBase<TableOutputBasket> {
  constructor(api?: TableOutputBasket) {
    const now = new Date()
    super(
      api || {
        basketId: 0,
        created_at: now,
        updated_at: now,
        userId: 0,
        name: '',
        numberOfDesiredUTXOs: 0,
        minimumDesiredUTXOValue: 0,
        isDeleted: false
      }
    )
  }

  get basketId() {
    return this.api.basketId
  }
  set basketId(v: number) {
    this.api.basketId = v
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
  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get name() {
    return this.api.name
  }
  set name(v: string) {
    this.api.name = v
  }
  get numberOfDesiredUTXOs() {
    return this.api.numberOfDesiredUTXOs
  }
  set numberOfDesiredUTXOs(v: number) {
    this.api.numberOfDesiredUTXOs = v
  }
  get minimumDesiredUTXOValue() {
    return this.api.minimumDesiredUTXOValue
  }
  set minimumDesiredUTXOValue(v: number) {
    this.api.minimumDesiredUTXOValue = v
  }
  get isDeleted() {
    return this.api.isDeleted
  }
  set isDeleted(v: boolean) {
    this.api.isDeleted = v
  }

  override get id() {
    return this.api.basketId
  }
  override set id(v: number) {
    this.api.basketId = v
  }
  override get entityName(): string {
    return 'outputBasket'
  }
  override get entityTable(): string {
    return 'output_baskets'
  }

  override updateApi(): void {
    /* nothing needed yet... */
  }

  override equals(ei: TableOutputBasket, syncMap?: SyncMap): boolean {
    const eo = this.api
    if (
      eo.name != ei.name ||
      eo.numberOfDesiredUTXOs != ei.numberOfDesiredUTXOs ||
      eo.minimumDesiredUTXOValue != ei.minimumDesiredUTXOValue
    )
      return false
    if (syncMap) {
      if (eo.basketId !== syncMap.outputBasket.idMap[verifyId(ei.basketId)]) return false
    } else {
      if (eo.basketId !== ei.basketId || eo.userId !== ei.userId) return false
    }
    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableOutputBasket,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityOutputBasket; eiId: number }> {
    const ef = verifyOneOrNone(
      await storage.findOutputBaskets({
        partial: { name: ei.name, userId },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityOutputBasket(ef || { ...ei }),
      eiId: verifyId(ei.basketId)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.userId = userId
    this.name ||= 'default'
    this.basketId = 0
    this.basketId = await storage.insertOutputBasket(this.toApi(), trx)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableOutputBasket,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      // basket name is its identity, should not change
      this.minimumDesiredUTXOValue = ei.minimumDesiredUTXOValue
      this.numberOfDesiredUTXOs = ei.numberOfDesiredUTXOs
      this.isDeleted = ei.isDeleted
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateOutputBasket(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
