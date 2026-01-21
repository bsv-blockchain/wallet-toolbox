import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'
import { TableTxLabelMap } from '../tables/TableTxLabelMap'
import { WERR_INVALID_OPERATION } from '../../../sdk/WERR_errors'

export class EntityTxLabelMap extends EntityBase<TableTxLabelMap> {
  constructor(api?: TableTxLabelMap) {
    const now = new Date()
    super(
      api || {
        created_at: now,
        updated_at: now,
        transactionId: 0,
        txLabelId: 0,
        isDeleted: false
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
  }

  get txLabelId() {
    return this.api.txLabelId
  }
  set txLabelId(v: number) {
    this.api.txLabelId = v
  }
  get transactionId() {
    return this.api.transactionId
  }
  set transactionId(v: number) {
    this.api.transactionId = v
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
  } // entity does not have its own id.
  override get entityName(): string {
    return 'txLabelMap'
  }
  override get entityTable(): string {
    return 'tx_labels_map'
  }

  override equals(ei: TableTxLabelMap, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()

    if (
      eo.transactionId !== (syncMap ? syncMap.transaction.idMap[verifyId(ei.transactionId)] : ei.transactionId) ||
      eo.txLabelId !== (syncMap ? syncMap.txLabel.idMap[verifyId(ei.txLabelId)] : ei.txLabelId) ||
      eo.isDeleted !== ei.isDeleted
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableTxLabelMap,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityTxLabelMap; eiId: number }> {
    const transactionId = syncMap.transaction.idMap[ei.transactionId]
    const txLabelId = syncMap.txLabel.idMap[ei.txLabelId]
    const ef = verifyOneOrNone(
      await storage.findTxLabelMaps({
        partial: { transactionId, txLabelId },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityTxLabelMap(ef || { ...ei }),
      eiId: -1
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.transactionId = syncMap.transaction.idMap[this.transactionId]
    this.txLabelId = syncMap.txLabel.idMap[this.txLabelId]
    await storage.insertTxLabelMap(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableTxLabelMap,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.isDeleted = ei.isDeleted
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateTxLabelMap(this.transactionId, this.txLabelId, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
