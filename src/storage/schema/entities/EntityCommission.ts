import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { arraysEqual, verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableCommission } from '../tables/TableCommission'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityCommission extends EntityBase<TableCommission> {
  constructor(api?: TableCommission) {
    const now = new Date()
    super(
      api || {
        commissionId: 0,
        created_at: now,
        updated_at: now,
        transactionId: 0,
        userId: 0,
        isRedeemed: false,
        keyOffset: '',
        lockingScript: [],
        satoshis: 0
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
  }

  get commissionId() {
    return this.api.commissionId
  }
  set commissionId(v: number) {
    this.api.commissionId = v
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
  get transactionId() {
    return this.api.transactionId
  }
  set transactionId(v: number) {
    this.api.transactionId = v
  }
  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get isRedeemed() {
    return this.api.isRedeemed
  }
  set isRedeemed(v: boolean) {
    this.api.isRedeemed = v
  }
  get keyOffset() {
    return this.api.keyOffset
  }
  set keyOffset(v: string) {
    this.api.keyOffset = v
  }
  get lockingScript() {
    return this.api.lockingScript
  }
  set lockingScript(v: number[]) {
    this.api.lockingScript = v
  }
  get satoshis() {
    return this.api.satoshis
  }
  set satoshis(v: number) {
    this.api.satoshis = v
  }

  override get id(): number {
    return this.api.commissionId
  }
  override set id(v: number) {
    this.api.commissionId = v
  }
  override get entityName(): string {
    return 'commission'
  }
  override get entityTable(): string {
    return 'commissions'
  }

  override equals(ei: TableCommission, syncMap?: SyncMap | undefined): boolean {
    if (
      this.isRedeemed !== ei.isRedeemed ||
      this.transactionId !== (syncMap ? syncMap.transaction.idMap[ei.transactionId] : ei.transactionId) ||
      this.keyOffset !== ei.keyOffset ||
      !arraysEqual(this.lockingScript, ei.lockingScript) ||
      this.satoshis !== ei.satoshis
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableCommission,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityCommission; eiId: number }> {
    const transactionId = syncMap.transaction.idMap[ei.transactionId]
    const ef = verifyOneOrNone(await storage.findCommissions({ partial: { transactionId, userId }, trx }))
    return {
      found: !!ef,
      eo: new EntityCommission(ef || { ...ei }),
      eiId: verifyId(ei.commissionId)
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    if (this.transactionId) this.transactionId = syncMap.transaction.idMap[this.transactionId]
    this.userId = userId
    this.commissionId = 0
    this.commissionId = await storage.insertCommission(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableCommission,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.isRedeemed = ei.isRedeemed
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateCommission(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
