import { StorageProvidedBy, TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { optionalArraysEqual, verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableOutput } from '../tables/TableOutput'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityOutput extends EntityBase<TableOutput> {
  constructor(api?: TableOutput) {
    const now = new Date()
    super(
      api || {
        outputId: 0,
        created_at: now,
        updated_at: now,
        userId: 0,
        transactionId: 0,
        spendable: false,
        change: false,
        satoshis: 0,
        outputDescription: '',
        vout: 0,
        type: '',
        providedBy: 'you',
        purpose: '',

        txid: undefined,
        basketId: undefined,
        spentBy: undefined,
        derivationPrefix: undefined,
        derivationSuffix: undefined,
        senderIdentityKey: undefined,
        customInstructions: undefined,
        spendingDescription: undefined,
        scriptLength: undefined,
        scriptOffset: undefined,
        lockingScript: undefined
      }
    )
  }

  override updateApi(): void {
    /* nothing needed yet... */
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
  get userId() {
    return this.api.userId
  }
  set userId(v: number) {
    this.api.userId = v
  }
  get transactionId() {
    return this.api.transactionId
  }
  set transactionId(v: number) {
    this.api.transactionId = v
  }
  get basketId() {
    return this.api.basketId
  }
  set basketId(v: number | undefined) {
    this.api.basketId = v
  }
  get spentBy() {
    return this.api.spentBy
  }
  set spentBy(v: number | undefined) {
    this.api.spentBy = v
  }
  get vout() {
    return this.api.vout
  }
  set vout(v: number) {
    this.api.vout = v
  }
  get satoshis() {
    return this.api.satoshis
  }
  set satoshis(v: number) {
    this.api.satoshis = v
  }
  get outputDescription() {
    return this.api.outputDescription
  }
  set outputDescription(v: string) {
    this.api.outputDescription = v
  }
  get spendable() {
    return this.api.spendable
  }
  set spendable(v: boolean) {
    this.api.spendable = v
  }
  get change() {
    return this.api.change
  }
  set change(v: boolean) {
    this.api.change = v
  }

  get txid() {
    return this.api.txid
  }
  set txid(v: string | undefined) {
    this.api.txid = v
  }
  get type() {
    return this.api.type
  }
  set type(v: string) {
    this.api.type = v
  }
  get providedBy() {
    return this.api.providedBy
  }
  set providedBy(v: StorageProvidedBy) {
    this.api.providedBy = v
  }
  get purpose() {
    return this.api.purpose
  }
  set purpose(v: string) {
    this.api.purpose = v
  }
  get spendingDescription() {
    return this.api.spendingDescription
  }
  set spendingDescription(v: string | undefined) {
    this.api.spendingDescription = v
  }
  get derivationPrefix() {
    return this.api.derivationPrefix
  }
  set derivationPrefix(v: string | undefined) {
    this.api.derivationPrefix = v
  }
  get derivationSuffix() {
    return this.api.derivationSuffix
  }
  set derivationSuffix(v: string | undefined) {
    this.api.derivationSuffix = v
  }
  get senderIdentityKey() {
    return this.api.senderIdentityKey
  }
  set senderIdentityKey(v: string | undefined) {
    this.api.senderIdentityKey = v
  }
  get customInstructions() {
    return this.api.customInstructions
  }
  set customInstructions(v: string | undefined) {
    this.api.customInstructions = v
  }
  get lockingScript() {
    return this.api.lockingScript
  }
  set lockingScript(v: number[] | undefined) {
    this.api.lockingScript = v
  }
  get scriptLength() {
    return this.api.scriptLength
  }
  set scriptLength(v: number | undefined) {
    this.api.scriptLength = v
  }
  get scriptOffset() {
    return this.api.scriptOffset
  }
  set scriptOffset(v: number | undefined) {
    this.api.scriptOffset = v
  }

  override get id(): number {
    return this.api.outputId
  }
  override set id(v: number) {
    this.api.outputId = v
  }
  override get entityName(): string {
    return 'output'
  }
  override get entityTable(): string {
    return 'outputs'
  }

  override equals(ei: TableOutput, syncMap?: SyncMap | undefined): boolean {
    if (
      this.transactionId !== (syncMap ? syncMap.transaction.idMap[ei.transactionId] : ei.transactionId) ||
      this.basketId !== (syncMap && ei.basketId ? syncMap.outputBasket.idMap[ei.basketId] : ei.basketId) ||
      this.spentBy !== (syncMap && ei.spentBy ? syncMap.transaction.idMap[ei.spentBy] : ei.spentBy) ||
      this.vout !== ei.vout ||
      this.satoshis !== ei.satoshis ||
      this.spendable !== ei.spendable ||
      this.change !== ei.change ||
      this.txid !== ei.txid ||
      this.type !== ei.type ||
      this.providedBy !== ei.providedBy ||
      this.purpose !== ei.purpose ||
      this.outputDescription !== ei.outputDescription ||
      this.spendingDescription !== ei.spendingDescription ||
      this.derivationPrefix !== ei.derivationPrefix ||
      this.derivationSuffix !== ei.derivationSuffix ||
      this.senderIdentityKey !== ei.senderIdentityKey ||
      this.customInstructions !== ei.customInstructions ||
      !optionalArraysEqual(this.lockingScript, ei.lockingScript) ||
      this.scriptLength !== ei.scriptLength ||
      this.scriptOffset !== ei.scriptOffset
    )
      return false

    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableOutput,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityOutput; eiId: number }> {
    const transactionId = syncMap.transaction.idMap[ei.transactionId]
    const basketId = ei.basketId ? syncMap.outputBasket.idMap[ei.basketId] : null
    const ef = verifyOneOrNone(
      await storage.findOutputs({
        partial: { userId, transactionId, vout: ei.vout },
        trx
      })
    )
    return {
      found: !!ef,
      eo: new EntityOutput(ef || { ...ei }),
      eiId: verifyId(ei.outputId)
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.userId = userId
    this.basketId = this.basketId ? syncMap.outputBasket.idMap[this.basketId] : undefined
    this.transactionId = syncMap.transaction.idMap[this.transactionId]
    this.spentBy = this.spentBy ? syncMap.transaction.idMap[this.spentBy] : undefined
    this.outputId = 0
    this.outputId = await storage.insertOutput(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableOutput,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    let wasMerged = false
    if (ei.updated_at > this.updated_at) {
      this.spentBy = ei.spentBy ? syncMap.transaction.idMap[ei.spentBy] : undefined
      this.spendable = ei.spendable
      this.change = ei.change
      this.type = ei.type
      this.providedBy = ei.providedBy
      this.purpose = ei.purpose
      this.outputDescription = ei.outputDescription
      this.spendingDescription = ei.spendingDescription
      this.senderIdentityKey = ei.senderIdentityKey
      this.customInstructions = ei.customInstructions
      this.scriptLength = ei.scriptLength
      this.scriptOffset = ei.scriptOffset
      this.lockingScript = ei.lockingScript
      this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
      await storage.updateOutput(this.id, this.toApi(), trx)
      wasMerged = true
    }
    return wasMerged
  }
}
