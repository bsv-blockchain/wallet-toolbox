import { TransactionStatus } from '../../../sdk/types'
import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { optionalArraysEqual, verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableOutput } from '../tables/TableOutput'
import { TableTransaction } from '../tables/TableTransaction'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'
import { EntityProvenTx } from './EntityProvenTx'
import { Transaction as BsvTransaction, TransactionInput } from '@bsv/sdk'

export class EntityTransaction extends EntityBase<TableTransaction> {
  /**
   * @returns @bsv/sdk Transaction object from parsed rawTx.
   * If rawTx is undefined, returns undefined.
   */
  getBsvTx(): BsvTransaction | undefined {
    if (!this.rawTx) return undefined
    return BsvTransaction.fromBinary(this.rawTx)
  }

  /**
   * @returns array of @bsv/sdk TransactionInput objects from parsed rawTx.
   * If rawTx is undefined, an empty array is returned.
   */
  getBsvTxIns(): TransactionInput[] {
    const tx = this.getBsvTx()
    if (!tx) return []
    return tx.inputs
  }

  /**
   * Returns an array of "known" inputs to this transaction which belong to the same userId.
   * Uses both spentBy and rawTx inputs (if available) to locate inputs from among user's outputs.
   * Not all transaction inputs correspond to prior storage outputs.
   */
  async getInputs(storage: EntityStorage, trx?: TrxToken): Promise<TableOutput[]> {
    const inputs = await storage.findOutputs({
      partial: { userId: this.userId, spentBy: this.id },
      trx
    })
    // Merge "inputs" by spentBy and userId
    for (const input of this.getBsvTxIns()) {
      //console.log(`getInputs of ${this.id}: ${input.txid()} ${input.txOutNum}`)
      const pso = verifyOneOrNone(
        await storage.findOutputs({
          partial: {
            userId: this.userId,
            txid: input.sourceTXID,
            vout: input.sourceOutputIndex
          },
          trx
        })
      )
      if (pso && !inputs.some(i => i.outputId === pso.outputId)) inputs.push(pso)
    }
    return inputs
  }

  constructor(api?: TableTransaction) {
    const now = new Date()
    super(
      api || {
        transactionId: 0,
        created_at: now,
        updated_at: now,
        userId: 0,
        txid: '',
        status: 'unprocessed',
        reference: '',
        satoshis: 0,
        description: '',
        isOutgoing: false,
        rawTx: undefined,
        inputBEEF: undefined
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
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

  get version() {
    return this.api.version
  }
  set version(v: number | undefined) {
    this.api.version = v
  }

  get lockTime() {
    return this.api.lockTime
  }
  set lockTime(v: number | undefined) {
    this.api.lockTime = v
  }

  get isOutgoing() {
    return this.api.isOutgoing
  }
  set isOutgoing(v: boolean) {
    this.api.isOutgoing = v
  }

  get status() {
    return this.api.status
  }
  set status(v: TransactionStatus) {
    this.api.status = v
  }

  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }

  get provenTxId() {
    return this.api.provenTxId
  }
  set provenTxId(v: number | undefined) {
    this.api.provenTxId = v
  }

  get satoshis() {
    return this.api.satoshis
  }
  set satoshis(v: number) {
    this.api.satoshis = v
  }

  get txid() {
    return this.api.txid
  }
  set txid(v: string | undefined) {
    this.api.txid = v
  }

  get reference() {
    return this.api.reference
  }
  set reference(v: string) {
    this.api.reference = v
  }

  get inputBEEF() {
    return this.api.inputBEEF
  }
  set inputBEEF(v: number[] | undefined) {
    this.api.inputBEEF = v
  }

  get description() {
    return this.api.description
  }
  set description(v: string) {
    this.api.description = v
  }

  get rawTx() {
    return this.api.rawTx
  }
  set rawTx(v: number[] | undefined) {
    this.api.rawTx = v
  }

  // Extended (computed / dependent entity) Properties
  //get labels() { return this.api.labels }
  //set labels(v: string[] | undefined) { this.api.labels = v }

  override get id(): number {
    return this.api.transactionId
  }
  override set id(v: number) {
    this.api.transactionId = v
  }
  override get entityName(): string {
    return 'transaction'
  }
  override get entityTable(): string {
    return 'transactions'
  }

  override equals(ei: TableTransaction, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()

    // Properties that are never updated
    if (
      eo.transactionId !== (syncMap ? syncMap.transaction.idMap[verifyId(ei.transactionId)] : ei.transactionId) ||
      eo.reference !== ei.reference
    )
      return false

    if (
      eo.version !== ei.version ||
      eo.lockTime !== ei.lockTime ||
      eo.isOutgoing !== ei.isOutgoing ||
      eo.status !== ei.status ||
      eo.satoshis !== ei.satoshis ||
      eo.txid !== ei.txid ||
      eo.description !== ei.description ||
      !optionalArraysEqual(eo.rawTx, ei.rawTx) ||
      !optionalArraysEqual(eo.inputBEEF, ei.inputBEEF)
    )
      return false

    if (
      !eo.provenTxId !== !ei.provenTxId ||
      (ei.provenTxId && eo.provenTxId !== (syncMap ? syncMap.provenTx.idMap[verifyId(ei.provenTxId)] : ei.provenTxId))
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableTransaction,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityTransaction; eiId: number }> {
    const ef = verifyOneOrNone(
      await storage.findTransactions({
        partial: { reference: ei.reference, userId },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityTransaction(ef || { ...ei }),
      eiId: verifyId(ei.transactionId)
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    if (this.provenTxId) this.provenTxId = syncMap.provenTx.idMap[this.provenTxId]
    this.userId = userId
    this.transactionId = 0
    this.transactionId = await storage.insertTransaction(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableTransaction,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      // Properties that are never updated:
      // transactionId
      // userId
      // reference

      // Merged properties
      this.version = ei.version
      this.lockTime = ei.lockTime
      this.isOutgoing = ei.isOutgoing
      this.status = ei.status
      this.provenTxId = ei.provenTxId ? syncMap.provenTx.idMap[ei.provenTxId] : undefined
      this.satoshis = ei.satoshis
      this.txid = ei.txid
      this.description = ei.description
      this.rawTx = ei.rawTx
      this.inputBEEF = ei.inputBEEF
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateTransaction(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }

  async getProvenTx(storage: EntityStorage, trx?: TrxToken): Promise<EntityProvenTx | undefined> {
    if (!this.provenTxId) return undefined
    const p = verifyOneOrNone(
      await storage.findProvenTxs({
        partial: { provenTxId: this.provenTxId },
        trx
      })
    )
    if (!p) return undefined
    return new EntityProvenTx(p)
  }
}
