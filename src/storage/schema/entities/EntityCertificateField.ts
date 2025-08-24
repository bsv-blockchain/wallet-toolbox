import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { WERR_INVALID_OPERATION } from '../../../sdk/WERR_errors'
import { verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableCertificateField } from '../tables/TableCertificateField'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityCertificateField extends EntityBase<TableCertificateField> {
  constructor(api?: TableCertificateField) {
    const now = new Date()
    super(
      api || {
        created_at: now,
        updated_at: now,
        userId: 0,
        certificateId: 0,
        fieldName: '',
        fieldValue: '',
        masterKey: ''
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
  get certificateId() {
    return this.api.certificateId
  }
  set certificateId(v: number) {
    this.api.certificateId = v
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
  get fieldName() {
    return this.api.fieldName
  }
  set fieldName(v: string) {
    this.api.fieldName = v
  }
  get fieldValue() {
    return this.api.fieldValue
  }
  set fieldValue(v: string) {
    this.api.fieldValue = v
  }
  get masterKey() {
    return this.api.masterKey
  }
  set masterKey(v: string) {
    this.api.masterKey = v
  }

  override get id(): number {
    throw new WERR_INVALID_OPERATION('entity has no "id" value')
  }
  override get entityName(): string {
    return 'certificateField'
  }
  override get entityTable(): string {
    return 'certificate_fields'
  }

  override equals(ei: TableCertificateField, syncMap?: SyncMap | undefined): boolean {
    if (
      this.certificateId !== (syncMap ? syncMap.certificate.idMap[ei.certificateId] : ei.certificateId) ||
      this.fieldName !== ei.fieldName ||
      this.fieldValue !== ei.fieldValue ||
      this.masterKey !== ei.masterKey
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableCertificateField,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityCertificateField; eiId: number }> {
    const certificateId = syncMap.certificate.idMap[ei.certificateId]
    const ef = verifyOneOrNone(
      await storage.findCertificateFields({
        partial: { certificateId, userId, fieldName: ei.fieldName },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityCertificateField(ef || { ...ei }),
      eiId: -1
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.certificateId = syncMap.certificate.idMap[this.certificateId]
    this.userId = userId
    await storage.insertCertificateField(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableCertificateField,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.fieldValue = ei.fieldValue
      this.masterKey = ei.masterKey
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateCertificateField(this.certificateId, this.fieldName, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
