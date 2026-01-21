import {
  RequestSyncChunkArgs,
  SyncChunk,
  SyncStatus,
  TrxToken,
  WalletStorageSync
} from '../../../sdk/WalletStorage.interfaces'
import { WERR_INVALID_PARAMETER } from '../../../sdk/WERR_errors'
import { maxDate, verifyId, verifyTruthy } from '../../../utility/utilityHelpers'
import { TableSettings } from '../tables/TableSettings'
import { TableSyncState } from '../tables/TableSyncState'
import { createSyncMap, EntityBase, EntityStorage, EntitySyncMap, SyncError, SyncMap } from './EntityBase'
import { EntityCertificate } from './EntityCertificate'
import { EntityCertificateField } from './EntityCertificateField'
import { EntityCommission } from './EntityCommission'
import { EntityOutput } from './EntityOutput'
import { EntityOutputBasket } from './EntityOutputBasket'
import { EntityOutputTag } from './EntityOutputTag'
import { EntityOutputTagMap } from './EntityOutputTagMap'
import { EntityProvenTx } from './EntityProvenTx'
import { EntityProvenTxReq } from './EntityProvenTxReq'
import { EntityTransaction } from './EntityTransaction'
import { EntityTxLabel } from './EntityTxLabel'
import { EntityTxLabelMap } from './EntityTxLabelMap'
import { EntityUser } from './EntityUser'
import { MergeEntity } from './MergeEntity'

export class EntitySyncState extends EntityBase<TableSyncState> {
  constructor(api?: TableSyncState) {
    const now = new Date()
    super(
      api || {
        syncStateId: 0,
        created_at: now,
        updated_at: now,
        userId: 0,
        storageIdentityKey: '',
        storageName: '',
        init: false,
        refNum: '',
        status: 'unknown',
        when: undefined,
        errorLocal: undefined,
        errorOther: undefined,
        satoshis: undefined,
        syncMap: JSON.stringify(createSyncMap())
      }
    )
    this.errorLocal = this.api.errorLocal ? <SyncError>JSON.parse(this.api.errorLocal) : undefined
    this.errorOther = this.api.errorOther ? <SyncError>JSON.parse(this.api.errorOther) : undefined
    this.syncMap = <SyncMap>JSON.parse(this.api.syncMap)
    this.validateSyncMap(this.syncMap)
  }

  validateSyncMap(sm: SyncMap) {
    for (const key of Object.keys(sm)) {
      const esm: EntitySyncMap = sm[key]
      if (typeof esm.maxUpdated_at === 'string') esm.maxUpdated_at = new Date(esm.maxUpdated_at)
    }
  }

  static async fromStorage(
    storage: WalletStorageSync,
    userIdentityKey: string,
    remoteSettings: TableSettings
  ): Promise<EntitySyncState> {
    const { user } = verifyTruthy(await storage.findOrInsertUser(userIdentityKey))
    let { syncState: api } = verifyTruthy(
      await storage.findOrInsertSyncStateAuth(
        { userId: user.userId, identityKey: userIdentityKey },
        remoteSettings.storageIdentityKey,
        remoteSettings.storageName
      )
    )
    if (!api.syncMap || api.syncMap === '{}') api.syncMap = JSON.stringify(createSyncMap())
    const ss = new EntitySyncState(api)
    return ss
  }

  /**
   * Handles both insert and update based on id value: zero indicates insert.
   * @param storage
   * @param notSyncMap if not new and true, excludes updating syncMap in storage.
   * @param trx
   */
  async updateStorage(storage: EntityStorage, notSyncMap?: boolean, trx?: TrxToken) {
    this.updated_at = new Date()
    this.updateApi(notSyncMap && this.id > 0)
    if (this.id === 0) {
      await storage.insertSyncState(this.api)
    } else {
      const update: Partial<TableSyncState> = { ...this.api }
      if (notSyncMap) delete update.syncMap
      delete update.created_at
      await storage.updateSyncState(verifyId(this.id), update, trx)
    }
  }

  override updateApi(notSyncMap?: boolean): void {
    this.api.errorLocal = this.apiErrorLocal
    this.api.errorOther = this.apiErrorOther
    if (!notSyncMap) this.api.syncMap = this.apiSyncMap
  }

  // Pass through api properties
  set created_at(v: Date) {
    this.api.created_at = v
  }
  get created_at() {
    return this.api.created_at
  }
  set updated_at(v: Date) {
    this.api.updated_at = v
  }
  get updated_at() {
    return this.api.updated_at
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get userId() {
    return this.api.userId
  }
  set storageIdentityKey(v: string) {
    this.api.storageIdentityKey = v
  }
  get storageIdentityKey() {
    return this.api.storageIdentityKey
  }
  set storageName(v: string) {
    this.api.storageName = v
  }
  get storageName() {
    return this.api.storageName
  }
  set init(v: boolean) {
    this.api.init = v
  }
  get init() {
    return this.api.init
  }
  set refNum(v: string) {
    this.api.refNum = v
  }
  get refNum() {
    return this.api.refNum
  }
  set status(v: SyncStatus) {
    this.api.status = v
  }
  get status(): SyncStatus {
    return this.api.status
  }
  set when(v: Date | undefined) {
    this.api.when = v
  }
  get when() {
    return this.api.when
  }
  set satoshis(v: number | undefined) {
    this.api.satoshis = v
  }
  get satoshis() {
    return this.api.satoshis
  }

  get apiErrorLocal() {
    return this.errorToString(this.errorLocal)
  }
  get apiErrorOther() {
    return this.errorToString(this.errorOther)
  }
  get apiSyncMap() {
    return JSON.stringify(this.syncMap)
  }

  override get id(): number {
    return this.api.syncStateId
  }
  set id(id: number) {
    this.api.syncStateId = id
  }
  override get entityName(): string {
    return 'syncState'
  }
  override get entityTable(): string {
    return 'sync_states'
  }

  static mergeIdMap(fromMap: Record<number, number>, toMap: Record<number, number>) {
    for (const [key, value] of Object.entries(fromMap)) {
      const fromValue = fromMap[key]
      const toValue = toMap[key]
      if (toValue !== undefined && toValue !== fromValue)
        throw new WERR_INVALID_PARAMETER(
          'syncMap',
          `an unmapped id or the same mapped id. ${key} maps to ${toValue} not equal to ${fromValue}`
        )
      if (toValue === undefined) toMap[key] = value
    }
  }
  /**
   * Merge additions to the syncMap
   * @param iSyncMap
   */
  mergeSyncMap(iSyncMap: SyncMap) {
    EntitySyncState.mergeIdMap(iSyncMap.provenTx.idMap!, this.syncMap.provenTx.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.outputBasket.idMap!, this.syncMap.outputBasket.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.transaction.idMap!, this.syncMap.transaction.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.provenTxReq.idMap!, this.syncMap.provenTxReq.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.txLabel.idMap!, this.syncMap.txLabel.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.output.idMap!, this.syncMap.output.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.outputTag.idMap!, this.syncMap.outputTag.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.certificate.idMap!, this.syncMap.certificate.idMap!)
    EntitySyncState.mergeIdMap(iSyncMap.commission.idMap!, this.syncMap.commission.idMap!)
  }

  // stringified api properties

  errorLocal: SyncError | undefined
  errorOther: SyncError | undefined
  syncMap: SyncMap

  /**
   * Eliminate any properties besides code and description
   */
  private errorToString(e: SyncError | undefined): string | undefined {
    if (!e) return undefined
    const es: SyncError = {
      code: e.code,
      description: e.description,
      stack: e.stack
    }
    return JSON.stringify(es)
  }

  override equals(ei: TableSyncState, syncMap?: SyncMap | undefined): boolean {
    return false
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {}

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableSyncState,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    return false
  }

  makeRequestSyncChunkArgs(
    forIdentityKey: string,
    forStorageIdentityKey: string,
    maxRoughSize?: number,
    maxItems?: number
  ): RequestSyncChunkArgs {
    const a: RequestSyncChunkArgs = {
      identityKey: forIdentityKey,
      maxRoughSize: maxRoughSize || 10000000,
      maxItems: maxItems || 1000,
      offsets: [],
      since: this.when,
      fromStorageIdentityKey: this.storageIdentityKey,
      toStorageIdentityKey: forStorageIdentityKey
    }
    for (const ess of [
      this.syncMap.provenTx,
      this.syncMap.outputBasket,
      this.syncMap.outputTag,
      this.syncMap.txLabel,
      this.syncMap.transaction,
      this.syncMap.output,
      this.syncMap.txLabelMap,
      this.syncMap.outputTagMap,
      this.syncMap.certificate,
      this.syncMap.certificateField,
      this.syncMap.commission,
      this.syncMap.provenTxReq
    ]) {
      if (!ess || !ess.entityName) debugger
      a.offsets.push({ name: ess.entityName, offset: ess.count })
    }
    return a
  }

  static syncChunkSummary(c: SyncChunk): string {
    let log = ''
    log += `SYNC CHUNK SUMMARY
  from storage: ${c.fromStorageIdentityKey}
  to storage: ${c.toStorageIdentityKey}
  for user: ${c.userIdentityKey}
`
    if (c.user) log += `  USER activeStorage ${c.user.activeStorage}\n`
    if (!!c.provenTxs) {
      log += `  PROVEN_TXS\n`
      for (const r of c.provenTxs) {
        log += `    ${r.provenTxId} ${r.txid}\n`
      }
    }
    if (!!c.provenTxReqs) {
      log += `  PROVEN_TX_REQS\n`
      for (const r of c.provenTxReqs) {
        log += `    ${r.provenTxReqId} ${r.txid} ${r.status} ${r.provenTxId || ''}\n`
      }
    }
    if (!!c.transactions) {
      log += `  TRANSACTIONS\n`
      for (const r of c.transactions) {
        log += `    ${r.transactionId} ${r.txid} ${r.status} ${r.provenTxId || ''} sats:${r.satoshis}\n`
      }
    }
    if (!!c.outputs) {
      log += `  OUTPUTS\n`
      for (const r of c.outputs) {
        log += `    ${r.outputId} ${r.txid}.${r.vout} ${r.transactionId} ${r.spendable ? 'spendable' : ''} sats:${r.satoshis}\n`
      }
    }
    return log
  }

  async processSyncChunk(
    writer: EntityStorage,
    args: RequestSyncChunkArgs,
    chunk: SyncChunk
  ): Promise<{
    done: boolean
    maxUpdated_at: Date | undefined
    updates: number
    inserts: number
  }> {
    const mes = [
      new MergeEntity(chunk.provenTxs, EntityProvenTx.mergeFind, this.syncMap.provenTx),
      new MergeEntity(chunk.outputBaskets, EntityOutputBasket.mergeFind, this.syncMap.outputBasket),
      new MergeEntity(chunk.outputTags, EntityOutputTag.mergeFind, this.syncMap.outputTag),
      new MergeEntity(chunk.txLabels, EntityTxLabel.mergeFind, this.syncMap.txLabel),
      new MergeEntity(chunk.transactions, EntityTransaction.mergeFind, this.syncMap.transaction),
      new MergeEntity(chunk.outputs, EntityOutput.mergeFind, this.syncMap.output),
      new MergeEntity(chunk.txLabelMaps, EntityTxLabelMap.mergeFind, this.syncMap.txLabelMap),
      new MergeEntity(chunk.outputTagMaps, EntityOutputTagMap.mergeFind, this.syncMap.outputTagMap),
      new MergeEntity(chunk.certificates, EntityCertificate.mergeFind, this.syncMap.certificate),
      new MergeEntity(chunk.certificateFields, EntityCertificateField.mergeFind, this.syncMap.certificateField),
      new MergeEntity(chunk.commissions, EntityCommission.mergeFind, this.syncMap.commission),
      new MergeEntity(chunk.provenTxReqs, EntityProvenTxReq.mergeFind, this.syncMap.provenTxReq)
    ]

    let updates = 0
    let inserts = 0
    let maxUpdated_at: Date | undefined = undefined
    let done = true

    // Merge User
    if (chunk.user) {
      const ei = chunk.user
      const { found, eo } = await EntityUser.mergeFind(writer, this.userId, ei)
      if (found) {
        if (await eo.mergeExisting(writer, args.since, ei)) {
          maxUpdated_at = maxDate(maxUpdated_at, ei.updated_at)
          updates++
        }
      }
    }

    // Merge everything else...
    for (const me of mes) {
      const r = await me.merge(args.since, writer, this.userId, this.syncMap)
      // The counts become the offsets for the next chunk.
      me.esm.count += me.stateArray?.length || 0
      updates += r.updates
      inserts += r.inserts
      maxUpdated_at = maxDate(maxUpdated_at, me.esm.maxUpdated_at)
      // If any entity type either did not report results or if there were at least one, then we aren't done.
      if (me.stateArray === undefined || me.stateArray.length > 0) done = false
      //if (me.stateArray !== undefined && me.stateArray.length > 0)
      //    console.log(`merged ${me.stateArray?.length} ${me.esm.entityName} ${r.inserts} inserted, ${r.updates} updated`);
    }

    if (done) {
      // Next batch starts further in the future with offsets of zero.
      this.when = maxUpdated_at
      for (const me of mes) me.esm.count = 0
    }

    await this.updateStorage(writer, false)

    return { done, maxUpdated_at, updates, inserts }
  }
}
