import { GetMerklePathResult, WalletServices } from '../../../sdk/WalletServices.interfaces'
import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { arraysEqual, verifyId, verifyOneOrNone } from '../../../utility/utilityHelpers'
import { TableProvenTx } from '../tables/TableProvenTx'
import { EntityBase, EntityStorage, SyncMap } from './EntityBase'
import { MerklePath } from '@bsv/sdk'
import { EntityProvenTxReq } from './EntityProvenTxReq'
import { WERR_INTERNAL, WERR_MISSING_PARAMETER } from '../../../sdk/WERR_errors'
import { WalletError } from '../../../sdk/WalletError'

export class EntityProvenTx extends EntityBase<TableProvenTx> {
  /**
   * Given a txid and optionally its rawTx, create a new ProvenTx object.
   *
   * rawTx is fetched if not provided.
   *
   * Only succeeds (proven is not undefined) if a proof is confirmed for rawTx,
   * and hash of rawTx is confirmed to match txid
   *
   * The returned ProvenTx and ProvenTxReq objects have not been added to the storage database,
   * this is optional and can be done by the caller if appropriate.
   *
   * @param txid
   * @param services
   * @param rawTx
   * @returns
   */
  static async fromTxid(txid: string, services: WalletServices, rawTx?: number[]): Promise<ProvenTxFromTxidResult> {
    const r: ProvenTxFromTxidResult = { proven: undefined, rawTx }

    const chain = services.chain

    if (!r.rawTx) {
      const gr = await services.getRawTx(txid)
      if (!gr?.rawTx)
        // Failing to find anything...
        return r
      r.rawTx = gr.rawTx!
    }

    const gmpr = await services.getMerklePath(txid)

    if (gmpr.merklePath && gmpr.header) {
      const index = gmpr.merklePath.path[0].find(l => l.hash === txid)?.offset
      if (index !== undefined) {
        const api: TableProvenTx = {
          created_at: new Date(),
          updated_at: new Date(),
          provenTxId: 0,
          txid,
          height: gmpr.header.height,
          index,
          merklePath: gmpr.merklePath.toBinary(),
          rawTx: r.rawTx,
          blockHash: gmpr.header.hash,
          merkleRoot: gmpr.header.merkleRoot
        }
        r.proven = new EntityProvenTx(api)
      }
    }

    return r
  }

  constructor(api?: TableProvenTx) {
    const now = new Date()
    super(
      api || {
        provenTxId: 0,
        created_at: now,
        updated_at: now,
        txid: '',
        height: 0,
        index: 0,
        merklePath: [],
        rawTx: [],
        blockHash: '',
        merkleRoot: ''
      }
    )
  }
  override updateApi(): void {
    /* nothing needed yet... */
  }

  /**
   * @returns desirialized `MerklePath` object, value is cached.
   */
  getMerklePath(): MerklePath {
    if (!this._mp) this._mp = MerklePath.fromBinary(this.api.merklePath)
    return this._mp
  }
  _mp?: MerklePath

  get provenTxId() {
    return this.api.provenTxId
  }
  set provenTxId(v: number) {
    this.api.provenTxId = v
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
  get height() {
    return this.api.height
  }
  set height(v: number) {
    this.api.height = v
  }
  get index() {
    return this.api.index
  }
  set index(v: number) {
    this.api.index = v
  }
  get merklePath() {
    return this.api.merklePath
  }
  set merklePath(v: number[]) {
    this.api.merklePath = v
  }
  get rawTx() {
    return this.api.rawTx
  }
  set rawTx(v: number[]) {
    this.api.rawTx = v
  }
  get blockHash() {
    return this.api.blockHash
  }
  set blockHash(v: string) {
    this.api.blockHash = v
  }
  get merkleRoot() {
    return this.api.merkleRoot
  }
  set merkleRoot(v: string) {
    this.api.merkleRoot = v
  }

  override get id() {
    return this.api.provenTxId
  }
  override set id(v: number) {
    this.api.provenTxId = v
  }
  override get entityName(): string {
    return 'provenTx'
  }
  override get entityTable(): string {
    return 'proven_txs'
  }

  override equals(ei: TableProvenTx, syncMap?: SyncMap | undefined): boolean {
    const eo = this.toApi()
    if (
      eo.txid != ei.txid ||
      eo.height != ei.height ||
      eo.index != ei.index ||
      !arraysEqual(eo.merklePath, ei.merklePath) ||
      !arraysEqual(eo.rawTx, ei.rawTx) ||
      eo.blockHash !== ei.blockHash ||
      eo.merkleRoot !== ei.merkleRoot
      // equality does not depend on timestamps.
      // || eo.created_at !== ei.created_at
      // || eo.updated_at !== ei.updated_at
    )
      return false
    if (syncMap) {
      if (eo.provenTxId !== syncMap.provenTx.idMap[ei.provenTxId]) return false
    } else {
      if (eo.provenTxId !== ei.provenTxId) return false
    }
    return true
  }

  static async mergeFind(
    storage: EntityStorage,
    userId: number,
    ei: TableProvenTx,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<{ found: boolean; eo: EntityProvenTx; eiId: number }> {
    const ef = verifyOneOrNone(await storage.findProvenTxs({ partial: { txid: ei.txid }, trx }))
    return {
      found: !!ef,
      eo: new EntityProvenTx(ef || { ...ei }),
      eiId: verifyId(ei.provenTxId)
    }
  }

  override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> {
    this.provenTxId = 0
    // TODO: Since these records are a shared resource, the record must be validated before accepting it...
    this.provenTxId = await storage.insertProvenTx(this.toApi(), trx)
  }

  override async mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: TableProvenTx,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean> {
    // ProvenTxs are never updated.
    return false
  }

  /**
   * How high attempts can go before status is forced to invalid
   */
  static getProofAttemptsLimit = 8

  /**
   * How many hours we have to try for a poof
   */
  static getProofMinutes = 60

  /**
   * Try to create a new ProvenTx from a ProvenTxReq and GetMerkleProofResultApi
   *
   * Otherwise it returns undefined and updates req.status to either 'unknown', 'invalid', or 'unconfirmed'
   *
   * @param req
   * @param gmpResult
   * @returns
   */
  static async fromReq(
    req: EntityProvenTxReq,
    gmpResult: GetMerklePathResult,
    countsAsAttempt: boolean
  ): Promise<EntityProvenTx | undefined> {
    if (!req.txid) throw new WERR_MISSING_PARAMETER('req.txid')
    if (!req.rawTx) throw new WERR_MISSING_PARAMETER('req.rawTx')

    if (!req.rawTx) throw new WERR_INTERNAL('rawTx must be valid')

    for (const note of gmpResult.notes || []) {
      req.addHistoryNote(note, true)
    }

    if (!gmpResult.name && !gmpResult.merklePath && !gmpResult.error) {
      // Most likely offline or now services configured.
      // Does not count as a proof attempt.
      return undefined
    }

    if (!gmpResult.merklePath) {
      if (req.created_at) {
        const ageInMsecs = Date.now() - req.created_at.getTime()
        const ageInMinutes = Math.ceil(ageInMsecs < 1 ? 0 : ageInMsecs / (1000 * 60))

        if (req.attempts > EntityProvenTx.getProofAttemptsLimit && ageInMinutes > EntityProvenTx.getProofMinutes) {
          // Start the process of setting transactions to 'failed'
          const limit = EntityProvenTx.getProofAttemptsLimit
          const { attempts } = req
          req.addHistoryNote({ what: 'getMerklePathGiveUp', attempts, limit, ageInMinutes }, true)
          req.notified = false
          req.status = 'invalid'
        }
      }
      return undefined
    }

    if (countsAsAttempt) req.attempts++

    const merklePaths = Array.isArray(gmpResult.merklePath) ? gmpResult.merklePath : [gmpResult.merklePath]

    for (const proof of merklePaths) {
      try {
        const now = new Date()
        const leaf = proof.path[0].find(leaf => leaf.txid === true && leaf.hash === req.txid)
        if (!leaf) {
          req.addHistoryNote({ what: 'getMerklePathTxidNotFound' }, true)
          throw new WERR_INTERNAL('merkle path does not contain leaf for txid')
        }

        const proven = new EntityProvenTx({
          created_at: now,
          updated_at: now,
          provenTxId: 0,
          txid: req.txid,
          height: proof.blockHeight,
          index: leaf.offset,
          merklePath: proof.toBinary(),
          rawTx: req.rawTx,
          merkleRoot: gmpResult.header!.merkleRoot,
          blockHash: gmpResult.header!.hash
        })

        return proven
      } catch (eu: unknown) {
        const { code, description } = WalletError.fromUnknown(eu)
        const { attempts } = req
        req.addHistoryNote({ what: 'getMerklePathProvenError', attempts, code, description }, true)
      }
    }
  }
}

export interface ProvenTxFromTxidResult {
  proven?: EntityProvenTx
  rawTx?: number[]
}
