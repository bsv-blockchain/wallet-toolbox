/* eslint-disable @typescript-eslint/no-unused-vars */
import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableCertificate } from '../tables/TableCertificate'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityCertificate extends EntityBase<TableCertificate> {
  constructor(api?: TableCertificate) {
    const now = new Date()
    super(
      api || {
        certificateId: 0,
        created_at: now,
        updated_at: now,
        userId: 0,
        type: '',
        subject: '',
        verifier: undefined,
        serialNumber: '',
        certifier: '',
        revocationOutpoint: '',
        signature: '',
        isDeleted: false
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
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
  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get type() {
    return this.api.type
  }
  set type(v: string) {
    this.api.type = v
  }
  get subject() {
    return this.api.subject
  }
  set subject(v: string) {
    this.api.subject = v
  }
  get verifier() {
    return this.api.verifier
  }
  set verifier(v: string | undefined) {
    this.api.verifier = v
  }
  get serialNumber() {
    return this.api.serialNumber
  }
  set serialNumber(v: string) {
    this.api.serialNumber = v
  }
  get certifier() {
    return this.api.certifier
  }
  set certifier(v: string) {
    this.api.certifier = v
  }
  get revocationOutpoint() {
    return this.api.revocationOutpoint
  }
  set revocationOutpoint(v: string) {
    this.api.revocationOutpoint = v
  }
  get signature() {
    return this.api.signature
  }
  set signature(v: string) {
    this.api.signature = v
  }
  get isDeleted() {
    return this.api.isDeleted
  }
  set isDeleted(v: boolean) {
    this.api.isDeleted = v
  }

  //get fields() { return this.api.fields }
  //set fields(v: Record<string, string> | undefined) { this.api.fields = v }

  override get id(): number {
    return this.api.certificateId
  }
  override set id(v: number) {
    this.api.certificateId = v
  }
  override get entityName(): string {
    return 'certificate'
  }
  override get entityTable(): string {
    return 'certificates'
  }

  override equals(ei: TableCertificate, syncMap?: SyncMap): boolean {
    if (
      this.type !== ei.type ||
      this.subject !== ei.subject ||
      this.serialNumber !== ei.serialNumber ||
      this.revocationOutpoint !== ei.revocationOutpoint ||
      this.signature !== ei.signature ||
      this.verifier !== ei.verifier ||
      this.isDeleted !== ei.isDeleted
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableCertificate,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityCertificate; eiId: number }> {
    const ef = verifyOneOrNone(
      await storage.findCertificates({
        partial: {
          serialNumber: ei.serialNumber,
          certifier: ei.certifier,
          userId
        },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityCertificate(ef || { ...ei }),
      eiId: verifyId(ei.certificateId)
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.userId = userId
    this.certificateId = 0
    this.certificateId = await storage.insertCertificate(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableCertificate,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.type = ei.type
      this.subject = ei.subject
      this.serialNumber = ei.serialNumber
      this.revocationOutpoint = ei.revocationOutpoint
      this.signature = ei.signature
      this.verifier = ei.verifier
      this.isDeleted = ei.isDeleted
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateCertificate(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
