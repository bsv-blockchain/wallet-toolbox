import { ProvenTxReqStatus, ProvenTxReqTerminalStatus, ReqHistoryNote } from '../../../sdk/types'
import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { WERR_INTERNAL, WERR_INVALID_PARAMETER } from '../../../sdk/WERR_errors'
import { arraysEqual, verifyId, verifyOne, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { StorageProvider } from '../../StorageProvider'
import { WalletStorageManager } from '../../WalletStorageManager'
import { TableProvenTxReq, TableProvenTxReqDynamics } from '../tables/TableProvenTxReq'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'

export class EntityProvenTxReq extends EntityBase<TableProvenTxReq> {
  static async fromStorageTxid(
    storage: EntityStorage,
    txid: string,
    trx?: TrxToken
  ): Promise<EntityProvenTxReq | undefined> {
    const reqApi = verifyOneOrNone(await storage.findProvenTxReqs({ partial: { txid }, trx }))
    if (!reqApi) return undefined
    return new EntityProvenTxReq(reqApi)
  }

  static async fromStorageId(storage: EntityStorage, id: number, trx?: TrxToken): Promise<EntityProvenTxReq> {
    const reqApi = verifyOneOrNone(await storage.findProvenTxReqs({ partial: { provenTxReqId: id }, trx }))
    if (!reqApi) throw new WERR_INTERNAL(`proven_tx_reqs with id ${id} is missing.`)
    return new EntityProvenTxReq(reqApi)
  }

  static fromTxid(txid: string, rawTx: number[], inputBEEF?: number[]): EntityProvenTxReq {
    const now = new Date()
    return new EntityProvenTxReq({
      provenTxReqId: 0,
      created_at: now,
      updated_at: now,
      txid,
      inputBEEF,
      rawTx,
      status: 'unknown',
      history: '{}',
      notify: '{}',
      attempts: 0,
      notified: false
    })
  }

  history: ProvenTxReqHistory
  notify: ProvenTxReqNotify

  packApiHistory() {
    this.api.history = JSON.stringify(this.history)
  }
  packApiNotify() {
    this.api.notify = JSON.stringify(this.notify)
  }

  unpackApiHistory() {
    this.history = JSON.parse(this.api.history)
  }
  unpackApiNotify() {
    this.notify = JSON.parse(this.api.notify)
  }

  get apiHistory(): string {
    this.packApiHistory()
    return this.api.history
  }
  get apiNotify(): string {
    this.packApiNotify()
    return this.api.notify
  }

  set apiHistory(v: string) {
    this.api.history = v
    this.unpackApiHistory()
  }
  set apiNotify(v: string) {
    this.api.notify = v
    this.unpackApiNotify()
  }

  updateApi(): void {
    this.packApiHistory()
    this.packApiNotify()
  }

  unpackApi(): void {
    this.unpackApiHistory()
    this.unpackApiNotify()
    if (this.notify.transactionIds) {
      // Cleanup null values and duplicates.
      const transactionIds: number[] = []
      for (const id of this.notify.transactionIds) {
        if (Number.isInteger(id) && !transactionIds.some(txid => txid === id)) transactionIds.push(id)
      }
      this.notify.transactionIds = transactionIds
    }
  }

  async refreshFromStorage(storage: EntityStorage | WalletStorageManager, trx?: TrxToken): Promise<void> {
    const newApi = verifyOne(await storage.findProvenTxReqs({ partial: { provenTxReqId: this.id }, trx }))
    this.api = newApi
    this.unpackApi()
  }

  constructor(api?: TableProvenTxReq) {
    const now = new Date()
    super(
      api || {
        provenTxReqId: 0,
        created_at: now,
        updated_at: now,
        txid: '',
        rawTx: [],
        history: '',
        notify: '',
        attempts: 0,
        status: 'unknown',
        notified: false
      }
    )
    this.history = {}
    this.notify = {}
    this.unpackApi()
  }

  /**
   * Returns history to only what followed since date.
   */
  historySince(since: Date): ProvenTxReqHistory {
    const fh: ProvenTxReqHistory = { notes: [] }
    const filter = since.toISOString()
    const notes = this.history.notes
    if (notes && fh.notes) {
      for (const note of notes) if (note.when && note.when > filter) fh.notes.push(note)
    }
    return fh
  }

  historyPretty(since?: Date, indent = 0): string {
    const h = since ? this.historySince(since) : { ...this.history }
    if (!h.notes) return ''
    const whenLimit = since ? since.toISOString() : undefined
    let log = ''
    for (const note of h.notes) {
      if (whenLimit && note.when && note.when < whenLimit) continue
      log += this.prettyNote(note) + '\n'
    }
    return log
  }

  prettyNote(note: ReqHistoryNote): string {
    let log = `${note.when}: ${note.what}`
    for (const [key, val] of Object.entries(note)) {
      if (key !== 'when' && key !== 'what') {
        if (typeof val === 'string') log += ' ' + key + ':`' + val + '`'
        else log += ' ' + key + ':' + val
      }
    }
    return log
  }

  getHistorySummary(): ProvenTxReqHistorySummaryApi {
    const summary: ProvenTxReqHistorySummaryApi = {
      setToCompleted: false,
      setToUnmined: false,
      setToCallback: false,
      setToDoubleSpend: false,
      setToSending: false,
      setToUnconfirmed: false
    }
    const h = this.history
    if (h.notes) {
      for (const note of h.notes) {
        this.parseHistoryNote(note, summary)
      }
    }
    return summary
  }

  parseHistoryNote(note: ReqHistoryNote, summary?: ProvenTxReqHistorySummaryApi): string {
    const c = summary || {
      setToCompleted: false,
      setToUnmined: false,
      setToCallback: false,
      setToDoubleSpend: false,
      setToSending: false,
      setToUnconfirmed: false
    }
    let n = this.prettyNote(note)
    try {
      switch (note.what) {
        case 'status':
          {
            const status = <ProvenTxReqStatus>note.status_now
            switch (status) {
              case 'completed':
                c.setToCompleted = true
                break
              case 'unmined':
                c.setToUnmined = true
                break
              case 'callback':
                c.setToCallback = true
                break
              case 'doubleSpend':
                c.setToDoubleSpend = true
                break
              case 'sending':
                c.setToSending = true
                break
              case 'unconfirmed':
                c.setToUnconfirmed = true
                break
              default:
                break
            }
          }
          break
        default:
          break
      }
    } catch {
      /** */
    }
    return n
  }

  addNotifyTransactionId(id: number) {
    if (!Number.isInteger(id)) throw new WERR_INVALID_PARAMETER('id', 'integer')
    const s = new Set(this.notify.transactionIds || [])
    s.add(id)
    this.notify.transactionIds = [...s].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
    this.notified = false
  }

  /**
   * Adds a note to history.
   * Notes with identical property values to an existing note are ignored.
   * @param note Note to add
   * @param noDupes if true, only newest note with same `what` value is retained.
   */
  addHistoryNote(note: ReqHistoryNote, noDupes?: boolean) {
    if (!this.history.notes) this.history.notes = []
    if (!note.when) note.when = new Date().toISOString()
    if (noDupes) {
      // Remove any existing notes with same 'what' value and either no 'when' or an earlier 'when'
      this.history.notes = this.history.notes!.filter(n => n.what !== note.what || (n.when && n.when > note.when!))
    }
    let addNote = true
    for (const n of this.history.notes) {
      let isEqual = true
      for (const [k, v] of Object.entries(n)) {
        if (v !== note[k]) {
          isEqual = false
          break
        }
      }
      if (isEqual) addNote = false
      if (!addNote) break
    }
    if (addNote) {
      this.history.notes.push(note as ReqHistoryNote)
      const k = (n: ReqHistoryNote): string => {
        return `${n.when} ${n.what}`
      }
      this.history.notes.sort((a, b) => (k(a) < k(b) ? -1 : k(a) > k(b) ? 1 : 0))
    }
  }

  /**
     * Updates database record with current state of this EntityUser

     * @param storage 
     * @param trx 
     */
  async updateStorage(storage: EntityStorage, trx?: TrxToken) {
    this.updated_at = new Date()
    this.updateApi()
    if (this.id === 0) {
      await storage.insertProvenTxReq(this.api)
    }
    const update: Partial<TableProvenTxReq> = { ...this.api }
    await storage.updateProvenTxReq(this.id, update, trx)
  }

  /**
   * Update storage with changes to non-static properties:
   *   updated_at
   *   provenTxId
   *   status
   *   history
   *   notify
   *   notified
   *   attempts
   *   batch
   *
   * @param storage
   * @param trx
   */
  async updateStorageDynamicProperties(storage: WalletStorageManager | StorageProvider, trx?: TrxToken) {
    this.updated_at = new Date()
    this.updateApi()
    const update: Partial<TableProvenTxReqDynamics> = {
      updated_at: this.api.updated_at,
      provenTxId: this.api.provenTxId,
      status: this.api.status,
      history: this.api.history,
      notify: this.api.notify,
      notified: this.api.notified,
      attempts: this.api.attempts,
      batch: this.api.batch
    }
    if (storage.isStorageProvider()) {
      const sp = storage as StorageProvider
      await sp.updateProvenTxReqDynamics(this.id, update, trx)
    } else {
      const wsm = storage as WalletStorageManager
      await wsm.runAsStorageProvider(async sp => {
        await sp.updateProvenTxReqDynamics(this.id, update, trx)
      })
    }
  }

  async insertOrMerge(storage: EntityStorage, trx?: TrxToken): Promise<EntityProvenTxReq> {
    const req = await storage.transaction<EntityProvenTxReq>(async trx => {
      let reqApi0 = this.toApi()
      const { req: reqApi1, isNew } = await storage.findOrInsertProvenTxReq(reqApi0, trx)
      if (isNew) {
        return new EntityProvenTxReq(reqApi1)
      } else {
        const req = new EntityProvenTxReq(reqApi1)
        req.mergeNotifyTransactionIds(reqApi0)
        req.mergeHistory(reqApi0, undefined, true)
        await req.updateStorage(storage, trx)
        return req
      }
    }, trx)
    return req
  }

  /**
   * See `ProvenTxReqStatusApi`
   */
  get status() {
    return this.api.status
  }
  set status(v: ProvenTxReqStatus) {
    if (v !== this.api.status) {
      this.addHistoryNote({ what: 'status', status_was: this.api.status, status_now: v })
      this.api.status = v
    }
  }
  get provenTxReqId() {
    return this.api.provenTxReqId
  }
  set provenTxReqId(v: number) {
    this.api.provenTxReqId = v
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
  get txid() {
    return this.api.txid
  }
  set txid(v: string) {
    this.api.txid = v
  }
  get inputBEEF() {
    return this.api.inputBEEF
  }
  set inputBEEF(v: number[] | undefined) {
    this.api.inputBEEF = v
  }
  get rawTx() {
    return this.api.rawTx
  }
  set rawTx(v: number[]) {
    this.api.rawTx = v
  }
  get attempts() {
    return this.api.attempts
  }
  set attempts(v: number) {
    this.api.attempts = v
  }
  get provenTxId() {
    return this.api.provenTxId
  }
  set provenTxId(v: number | undefined) {
    this.api.provenTxId = v
  }
  get notified() {
    return this.api.notified
  }
  set notified(v: boolean) {
    this.api.notified = v
  }
  get batch() {
    return this.api.batch
  }
  set batch(v: string | undefined) {
    this.api.batch = v
  }

  override get id() {
    return this.api.provenTxReqId
  }
  override set id(v: number) {
    this.api.provenTxReqId = v
  }
  override get entityName(): string {
    return 'provenTxReq'
  }
  override get entityTable(): string {
    return 'proven_tx_reqs'
  }

  /**
   * 'convergent' equality must satisfy (A sync B) equals (B sync A)
   */
  override equals(ei: TableProvenTxReq, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()
    if (
      eo.txid != ei.txid ||
      !arraysEqual(eo.rawTx, ei.rawTx) ||
      (!eo.inputBEEF && ei.inputBEEF) ||
      (eo.inputBEEF && !ei.inputBEEF) ||
      (eo.inputBEEF && ei.inputBEEF && !arraysEqual(eo.inputBEEF, ei.inputBEEF)) ||
      eo.batch != ei.batch
    )
      return false
    if (syncMap) {
      if (
        // attempts doesn't matter for convergent equality
        // history doesn't matter for convergent equality
        // only local transactionIds matter, that cared about this txid in sorted order
        eo.provenTxReqId !== syncMap.provenTxReq.idMap[verifyId(ei.provenTxReqId)] ||
        (!eo.provenTxId && ei.provenTxId) ||
        (eo.provenTxId && !ei.provenTxId) ||
        (ei.provenTxId && eo.provenTxId !== syncMap.provenTx.idMap[ei.provenTxId])
        // || eo.created_at !== minDate(ei.created_at, eo.created_at)
        // || eo.updated_at !== maxDate(ei.updated_at, eo.updated_at)
      )
        return false
    } else {
      if (
        eo.attempts != ei.attempts ||
        eo.history != ei.history ||
        eo.notify != ei.notify ||
        eo.provenTxReqId !== ei.provenTxReqId ||
        eo.provenTxId !== ei.provenTxId
        // || eo.created_at !== ei.created_at
        // || eo.updated_at !== ei.updated_at
      )
        return false
    }
    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableProvenTxReq,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityProvenTxReq; eiId: number }> {
    const ef = verifyOneOrNone(await storage.findProvenTxReqs({ partial: { txid: ei.txid }, trx }))
    return {
      found: !!ef,
      eo: new EntityProvenTxReq(ef || { ...ei }),
      eiId: verifyId(ei.provenTxReqId)
    }
  }

  mapNotifyTransactionIds(syncMap: SyncMap): void {
    // Map external notification transaction ids to local ids
    const externalIds = this.notify.transactionIds || []
    this.notify.transactionIds = []
    for (const transactionId of externalIds) {
      const localTxId: number | undefined = syncMap.transaction.idMap[transactionId]
      if (localTxId) {
        this.addNotifyTransactionId(localTxId)
      }
    }
  }

  mergeNotifyTransactionIds(ei: TableProvenTxReq, syncMap?: SyncMap): void {
    // Map external notification transaction ids to local ids and merge them if they exist.
    const eie = new EntityProvenTxReq(ei)
    if (eie.notify.transactionIds) {
      this.notify.transactionIds ||= []
      for (const transactionId of eie.notify.transactionIds) {
        const localTxId: number | undefined = syncMap ? syncMap.transaction.idMap[transactionId] : transactionId
        if (localTxId) {
          this.addNotifyTransactionId(localTxId)
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mergeHistory(ei: TableProvenTxReq, syncMap?: SyncMap, noDupes?: boolean): void {
    const eie = new EntityProvenTxReq(ei)
    if (eie.history.notes) {
      for (const note of eie.history.notes) {
        this.addHistoryNote(note)
      }
    }
  }

  static isTerminalStatus(status: ProvenTxReqStatus): boolean {
    return ProvenTxReqTerminalStatus.some(s => s === status)
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    if (this.provenTxId) this.provenTxId = syncMap.provenTx.idMap[this.provenTxId]
    this.mapNotifyTransactionIds(syncMap)
    this.provenTxReqId = 0
    this.provenTxReqId = await storage.insertProvenTxReq(this.toApi(), trx)
  }

  /**
   * When merging `ProvenTxReq`, care is taken to avoid short-cirtuiting notification: `status` must not transition to `completed` without
   * passing through `notifying`. Thus a full convergent merge passes through these sequence steps:
   * 1. Remote storage completes before local storage.
   * 2. The remotely completed req and ProvenTx sync to local storage.
   * 3. The local storage transitions to `notifying`, after merging the remote attempts and history.
   * 4. The local storage notifies, transitioning to `completed`.
   * 5. Having been updated, the local req, but not ProvenTx sync to remote storage, but do not merge because the earlier `completed` wins.
   * 6. Convergent equality is achieved (completing work - history and attempts are equal)
   *
   * On terminal failure: `doubleSpend` trumps `invalid` as it contains more data.
   */
  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableProvenTxReq,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    if (!this.batch && ei.batch) this.batch = ei.batch
    else if (this.batch && ei.batch && this.batch !== ei.batch)
      throw new WERR_INTERNAL('ProvenTxReq merge batch not equal.')

    this.mergeHistory(ei, syncMap, true)
    this.mergeNotifyTransactionIds(ei, syncMap)

    this.updated_at = new Date(Math.max(ei.updated_at.getTime(), this.updated_at.getTime()))
    await storage.updateProvenTxReq(this.id, this.toApi(), trx)
    return false
  }
}

export interface ProvenTxReqHistorySummaryApi {
  setToCompleted: boolean
  setToCallback: boolean
  setToUnmined: boolean
  setToDoubleSpend: boolean
  setToSending: boolean
  setToUnconfirmed: boolean
}

export interface ProvenTxReqHistory {
  /**
   * Keys are Date().toISOString()
   * Values are a description of what happened.
   */
  notes?: ReqHistoryNote[]
}

export interface ProvenTxReqNotify {
  transactionIds?: number[]
}
