import {
  AbortActionArgs,
  AbortActionResult,
  Beef,
  InternalizeActionArgs,
  ListActionsResult,
  ListCertificatesResult,
  ListOutputsResult,
  RelinquishCertificateArgs,
  RelinquishOutputArgs,
  Validation
} from '@bsv/sdk'
import { EntitySyncState } from '../storage/schema/entities'
import * as sdk from '../sdk'
import {
  TableCertificate,
  TableCertificateX,
  TableOutput,
  TableOutputBasket,
  TableProvenTx,
  TableProvenTxReq,
  TableSettings,
  TableUser
} from '../storage/schema/tables'
import { StorageProvider } from './StorageProvider'
import { StorageClient } from './remoting/StorageClient'

class ManagedStorage {
  isAvailable: boolean
  isStorageProvider: boolean
  settings?: TableSettings
  user?: TableUser

  constructor(public storage: sdk.WalletStorageProvider) {
    this.isStorageProvider = storage.isStorageProvider()
    this.isAvailable = false
  }
}

/**
 * The `WalletStorageManager` class delivers authentication checking storage access to the wallet.
 *
 * If manages multiple `StorageBase` derived storage services: one actice, the rest as backups.
 *
 * Of the storage services, one is 'active' at any one time.
 * On startup, and whenever triggered by the wallet, `WalletStorageManager` runs a syncrhonization sequence:
 *
 * 1. While synchronizing, all other access to storage is blocked waiting.
 * 2. The active service is confirmed, potentially triggering a resolution process if there is disagreement.
 * 3. Changes are pushed from the active storage service to each inactive, backup service.
 *
 * Some storage services do not support multiple writers. `WalletStorageManager` manages wait-blocking write requests
 * for these services.
 */
export class WalletStorageManager implements sdk.WalletStorage {
  /**
   * All configured stores including current active, backups, and conflicting actives.
   */
  _stores: ManagedStorage[] = []
  /**
   * True if makeAvailable has been run and access to managed stores (active) is allowed
   */
  _isAvailable: boolean = false
  /**
   * The current active store which is only enabled if the store's user record activeStorage property matches its settings record storageIdentityKey property
   */
  _active?: ManagedStorage
  /**
   * Stores to which state is pushed by updateBackups.
   */
  _backups?: ManagedStorage[]
  /**
   * Stores whose user record activeStorage property disagrees with the active store's user record activeStorage property.
   */
  _conflictingActives?: ManagedStorage[]
  /**
   * identityKey is always valid, userId and isActive are valid only if _isAvailable
   */
  _authId: sdk.AuthId
  /**
   * Configured services if any. If valid, shared with stores (which may ignore it).
   */
  _services?: sdk.WalletServices

  /**
   * Creates a new WalletStorageManager with the given identityKey and optional active and backup storage providers.
   *
   * @param identityKey The identity key of the user for whom this wallet is being managed.
   * @param active An optional active storage provider. If not provided, no active storage will be set.
   * @param backups An optional array of backup storage providers. If not provided, no backups will be set.
   */
  constructor(identityKey: string, active?: sdk.WalletStorageProvider, backups?: sdk.WalletStorageProvider[]) {
    const stores = [...(backups || [])]
    if (active) stores.unshift(active)
    this._stores = stores.map(s => new ManagedStorage(s))
    this._authId = { identityKey }
  }

  isStorageProvider(): boolean {
    return false
  }

  isAvailable(): boolean {
    return this._isAvailable
  }

  /**
   * The active storage is "enabled" only if its `storageIdentityKey` matches the user's currently selected `activeStorage`,
   * and only if there are no stores with conflicting `activeStorage` selections.
   *
   * A wallet may be created without including the user's currently selected active storage. This allows readonly access to their wallet data.
   *
   * In addition, if there are conflicting `activeStorage` selections among backup storage providers then the active remains disabled.
   */
  get isActiveEnabled(): boolean {
    return (
      this._active !== undefined &&
      this._active.settings!.storageIdentityKey === this._active.user!.activeStorage &&
      this._conflictingActives !== undefined &&
      this._conflictingActives.length === 0
    )
  }

  /**
   * @returns true if at least one WalletStorageProvider has been added.
   */
  canMakeAvailable(): boolean {
    return this._stores.length > 0
  }

  /**
   * This async function must be called after construction and before
   * any other async function can proceed.
   *
   * Runs through `_stores` validating all properties and partitioning across `_active`, `_backups`, `_conflictingActives`.
   *
   * @throws WERR_INVALID_PARAMETER if canMakeAvailable returns false.
   *
   * @returns {TableSettings} from the active storage.
   */
  async makeAvailable(): Promise<TableSettings> {
    if (this._isAvailable) return this._active!.settings!

    this._active = undefined
    this._backups = []
    this._conflictingActives = []

    if (this._stores.length < 1)
      throw new sdk.WERR_INVALID_PARAMETER('active', 'valid. Must add active storage provider to wallet.')

    // Initial backups. conflictingActives will be removed.
    const backups: ManagedStorage[] = []
    let i = -1
    for (const store of this._stores) {
      i++
      if (!store.isAvailable || !store.settings || !store.user) {
        // Validate all ManagedStorage properties.
        store.settings = await store.storage.makeAvailable()
        const r = await store.storage.findOrInsertUser(this._authId.identityKey)
        store.user = r.user
        store.isAvailable = true
      }
      if (!this._active)
        // _stores[0] becomes the default active store. It may be replaced if it is not the user's "enabled" activeStorage and that store is found among the remainder (backups).
        this._active = store
      else {
        const ua = store.user!.activeStorage
        const si = store.settings!.storageIdentityKey
        if (ua === si && !this.isActiveEnabled) {
          // This store's user record selects it as an enabled active storage...
          // swap the current not-enabled active for this storeage.
          backups.push(this._active!)
          this._active = store
        } else {
          // This store is a backup: Its user record selects some other storage as active.
          backups.push(store)
        }
      }
    }

    // Review backups, partition out conflicting actives.
    const si = this._active!.settings?.storageIdentityKey
    for (const store of backups) {
      if (store.user!.activeStorage !== si) this._conflictingActives.push(store)
      else this._backups.push(store)
    }

    this._isAvailable = true
    this._authId.userId = this._active!.user!.userId
    this._authId.isActive = this.isActiveEnabled

    return this._active!.settings!
  }

  private verifyActive(): ManagedStorage {
    if (!this._active || !this._isAvailable)
      throw new sdk.WERR_INVALID_OPERATION(
        'An active WalletStorageProvider must be added to this WalletStorageManager and makeAvailable must be called.'
      )
    return this._active
  }

  async getAuth(mustBeActive?: boolean): Promise<sdk.AuthId> {
    if (!this.isAvailable()) await this.makeAvailable()
    if (mustBeActive && !this._authId.isActive) throw new sdk.WERR_NOT_ACTIVE()
    return this._authId
  }

  async getUserId(): Promise<number> {
    return (await this.getAuth()).userId!
  }

  getActive(): sdk.WalletStorageProvider {
    return this.verifyActive().storage
  }

  getActiveSettings(): TableSettings {
    return this.verifyActive().settings!
  }

  getActiveUser(): TableUser {
    return this.verifyActive().user!
  }

  getActiveStore(): string {
    return this.verifyActive().settings!.storageIdentityKey
  }

  getActiveStoreName(): string {
    return this.verifyActive().settings!.storageName
  }

  getBackupStores(): string[] {
    this.verifyActive()
    return this._backups!.map(b => b.settings!.storageIdentityKey)
  }

  getConflictingStores(): string[] {
    this.verifyActive()
    return this._conflictingActives!.map(b => b.settings!.storageIdentityKey)
  }

  getAllStores(): string[] {
    this.verifyActive()
    return this._stores.map(b => b.settings!.storageIdentityKey)
  }

  private readonly readerLocks: Array<(value: void | PromiseLike<void>) => void> = []
  private readonly writerLocks: Array<(value: void | PromiseLike<void>) => void> = []
  private readonly syncLocks: Array<(value: void | PromiseLike<void>) => void> = []
  private readonly spLocks: Array<(value: void | PromiseLike<void>) => void> = []

  private async getActiveLock(lockQueue: Array<(value: void | PromiseLike<void>) => void>): Promise<void> {
    if (!this.isAvailable()) await this.makeAvailable()

    let resolveNewLock: () => void = () => {}
    const newLock = new Promise<void>(resolve => {
      resolveNewLock = resolve
      lockQueue.push(resolve)
    })
    if (lockQueue.length === 1) {
      resolveNewLock()
    }
    await newLock
  }

  private releaseActiveLock(queue: Array<(value: void | PromiseLike<void>) => void>): void {
    queue.shift() // Remove the current lock from the queue
    if (queue.length > 0) {
      queue[0]()
    }
  }

  private async getActiveForReader(): Promise<sdk.WalletStorageReader> {
    await this.getActiveLock(this.readerLocks)
    return this.getActive()
  }
  private releaseActiveForReader(): void {
    this.releaseActiveLock(this.readerLocks)
  }

  private async getActiveForWriter(): Promise<sdk.WalletStorageWriter> {
    await this.getActiveLock(this.readerLocks)
    await this.getActiveLock(this.writerLocks)
    return this.getActive()
  }
  private releaseActiveForWriter(): void {
    this.releaseActiveLock(this.writerLocks)
    this.releaseActiveLock(this.readerLocks)
  }

  private async getActiveForSync(): Promise<sdk.WalletStorageSync> {
    await this.getActiveLock(this.readerLocks)
    await this.getActiveLock(this.writerLocks)
    await this.getActiveLock(this.syncLocks)
    return this.getActive()
  }
  private releaseActiveForSync(): void {
    this.releaseActiveLock(this.syncLocks)
    this.releaseActiveLock(this.writerLocks)
    this.releaseActiveLock(this.readerLocks)
  }

  private async getActiveForStorageProvider(): Promise<StorageProvider> {
    await this.getActiveLock(this.readerLocks)
    await this.getActiveLock(this.writerLocks)
    await this.getActiveLock(this.syncLocks)
    await this.getActiveLock(this.spLocks)

    const active = this.getActive()
    // We can finally confirm that active storage is still able to support `StorageProvider`
    if (!active.isStorageProvider())
      throw new sdk.WERR_INVALID_OPERATION(
        'Active "WalletStorageProvider" does not support "StorageProvider" interface.'
      )
    // Allow the sync to proceed on the active store.
    return active as unknown as StorageProvider
  }
  private releaseActiveForStorageProvider(): void {
    this.releaseActiveLock(this.spLocks)
    this.releaseActiveLock(this.syncLocks)
    this.releaseActiveLock(this.writerLocks)
    this.releaseActiveLock(this.readerLocks)
  }

  async runAsWriter<R>(writer: (active: sdk.WalletStorageWriter) => Promise<R>): Promise<R> {
    try {
      const active = await this.getActiveForWriter()
      const r = await writer(active)
      return r
    } finally {
      this.releaseActiveForWriter()
    }
  }

  async runAsReader<R>(reader: (active: sdk.WalletStorageReader) => Promise<R>): Promise<R> {
    try {
      const active = await this.getActiveForReader()
      const r = await reader(active)
      return r
    } finally {
      this.releaseActiveForReader()
    }
  }

  /**
   *
   * @param sync the function to run with sync access lock
   * @param activeSync from chained sync functions, active storage already held under sync access lock.
   * @returns
   */
  async runAsSync<R>(
    sync: (active: sdk.WalletStorageSync) => Promise<R>,
    activeSync?: sdk.WalletStorageSync
  ): Promise<R> {
    try {
      const active = activeSync || (await this.getActiveForSync())
      const r = await sync(active)
      return r
    } finally {
      if (!activeSync) this.releaseActiveForSync()
    }
  }

  async runAsStorageProvider<R>(sync: (active: StorageProvider) => Promise<R>): Promise<R> {
    try {
      const active = await this.getActiveForStorageProvider()
      const r = await sync(active)
      return r
    } finally {
      this.releaseActiveForStorageProvider()
    }
  }

  /**
   *
   * @returns true if the active `WalletStorageProvider` also implements `StorageProvider`
   */
  isActiveStorageProvider(): boolean {
    return this.getActive().isStorageProvider()
  }

  async addWalletStorageProvider(provider: sdk.WalletStorageProvider): Promise<void> {
    await provider.makeAvailable()
    if (this._services) provider.setServices(this._services)
    this._stores.push(new ManagedStorage(provider))
    this._isAvailable = false
    await this.makeAvailable()
  }

  setServices(v: sdk.WalletServices) {
    this._services = v
    for (const store of this._stores) store.storage.setServices(v)
  }
  getServices(): sdk.WalletServices {
    if (!this._services) throw new sdk.WERR_INVALID_OPERATION('Must setServices first.')
    return this._services
  }

  getSettings(): TableSettings {
    return this.getActive().getSettings()
  }

  async migrate(storageName: string, storageIdentityKey: string): Promise<string> {
    return await this.runAsWriter(async writer => {
      return writer.migrate(storageName, storageIdentityKey)
    })
  }

  async destroy(): Promise<void> {
    if (this._stores.length < 1) return
    return await this.runAsWriter(async writer => {
      for (const store of this._stores) await store.storage.destroy()
    })
  }

  async findOrInsertUser(identityKey: string): Promise<{ user: TableUser; isNew: boolean }> {
    const auth = await this.getAuth()
    if (identityKey != auth.identityKey) throw new sdk.WERR_UNAUTHORIZED()

    return await this.runAsWriter(async writer => {
      const r = await writer.findOrInsertUser(identityKey)

      if (auth.userId && auth.userId !== r.user.userId)
        throw new sdk.WERR_INTERNAL('userId may not change for given identityKey')
      this._authId.userId = r.user.userId
      return r
    })
  }

  async abortAction(args: AbortActionArgs): Promise<AbortActionResult> {
    Validation.validateAbortActionArgs(args)
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.abortAction(auth, args)
    })
  }
  async createAction(vargs: Validation.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> {
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.createAction(auth, vargs)
    })
  }
  async internalizeAction(args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> {
    Validation.validateInternalizeActionArgs(args)
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.internalizeAction(auth, args)
    })
  }

  async relinquishCertificate(args: RelinquishCertificateArgs): Promise<number> {
    Validation.validateRelinquishCertificateArgs(args)
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.relinquishCertificate(auth, args)
    })
  }
  async relinquishOutput(args: RelinquishOutputArgs): Promise<number> {
    Validation.validateRelinquishOutputArgs(args)
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.relinquishOutput(auth, args)
    })
  }

  async processAction(args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> {
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.processAction(auth, args)
    })
  }
  async insertCertificate(certificate: TableCertificate): Promise<number> {
    return await this.runAsWriter(async writer => {
      const auth = await this.getAuth(true)
      return await writer.insertCertificateAuth(auth, certificate)
    })
  }

  async listActions(vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> {
    const auth = await this.getAuth()
    return await this.runAsReader(async reader => {
      return await reader.listActions(auth, vargs)
    })
  }
  async listCertificates(args: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult> {
    const auth = await this.getAuth()
    return await this.runAsReader(async reader => {
      return await reader.listCertificates(auth, args)
    })
  }
  async listOutputs(vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult> {
    const auth = await this.getAuth()
    return await this.runAsReader(async reader => {
      return await reader.listOutputs(auth, vargs)
    })
  }
  async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    const auth = await this.getAuth()
    return await this.runAsReader(async reader => {
      return await reader.findCertificatesAuth(auth, args)
    })
  }
  async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    const auth = await this.getAuth()
    return await this.runAsReader(async reader => {
      return await reader.findOutputBasketsAuth(auth, args)
    })
  }
  async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    const auth = await this.getAuth()
    return await this.runAsReader(async reader => {
      return await reader.findOutputsAuth(auth, args)
    })
  }

  async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> {
    return await this.runAsReader(async reader => {
      return await reader.findProvenTxReqs(args)
    })
  }

  /**
   * For each proven_txs record currently sourcing its transaction merkle proof from the given deactivated header,
   * attempt to reprove the transaction against the current chain,
   * updating the proven_txs record if a new valid proof is found.
   *
   * @param deactivatedHash An orphaned header than may have served as a proof source for proven_txs records.
   * @returns
   */
  async reproveHeader(deactivatedHash: string): Promise<sdk.ReproveHeaderResult> {
    const r: sdk.ReproveHeaderResult = { log: '', updated: [], unchanged: [], unavailable: [] }
    const services = this.getServices()
    const chaintracker = await services.getChainTracker()

    // Lookup all the proven_txs records matching the deactivated headers
    let ptxs: TableProvenTx[] = []
    await this.runAsStorageProvider(async sp => {
      ptxs = await sp.findProvenTxs({ partial: { blockHash: deactivatedHash } })
    })

    r.log += `  block ${deactivatedHash} orphaned with ${ptxs.length} impacted transactions\n`

    for (const ptx of ptxs) {
      // Loop over proven_txs records matching the deactivated header
      const rp = await this.reproveProven(ptx, true)

      r.log += rp.log
      if (rp.unavailable) r.unavailable.push(ptx)
      if (rp.unchanged) r.unchanged.push(ptx)
      if (rp.updated) r.updated.push({ was: ptx, update: rp.updated.update, logUpdate: rp.updated.logUpdate })
    }

    if (r.updated.length > 0) {
      await this.runAsStorageProvider(async sp => {
        for (const u of r.updated) {
          await sp.updateProvenTx(u.was.provenTxId, u.update)
          r.log += `    txid ${u.was.txid} proof data updated\n` + u.logUpdate
        }
      })
    }

    return r
  }

  /**
   * Extends the Beef `verify` function to handle BUMPs that have become invalid due to a chain reorg,
   * and originated from proven_txs records tracked by this storage.
   *
   * This method is optimized for making sure outgoing beefs are valid before sharing them externally.
   * In particular, it only "repairs" proofs previously tracked by this storage.
   *
   * Any merkle root that fails `isValidRootForHeight` triggers a reprove attempt for that block header.
   * This results in proven_txs with invalid proofs being updated with new valid proofs where possible.
   *
   * @param beef
   * @param allowTxidOnly
   * @returns VerifyAndRepairBeefResult, in particular `verifiedBeef` is valid only verify and repair succeeded fully.
   */
  async verifyAndRepairBeef(beef: Beef, allowTxidOnly?: boolean): Promise<VerifyAndRepairBeefResult> {
    throw new sdk.WERR_NOT_IMPLEMENTED()

    const r: VerifyAndRepairBeefResult = {
      isStructurallyValid: false,
      originalRoots: {},
      invalidRoots: {}
    }
    const services = this.getServices()
    const chaintracker = await services.getChainTracker()

    ;({ valid: r.isStructurallyValid, roots: r.originalRoots } = beef.verifyValid(allowTxidOnly))

    if (!r.isStructurallyValid) return r

    for (const [heightStr, root] of Object.entries(r.originalRoots)) {
      const height = Number(heightStr)
      const isValid = await chaintracker.isValidRootForHeight(root, height)
      if (!isValid) {
        // root is not currently the valid hash for this height according to the chaintracker.
        // What beef txids depended on this root:
        const txids = beef.txs
          .filter(tx => tx.bumpIndex !== undefined && beef.bumps[tx.bumpIndex].blockHeight === height)
          .map(tx => tx.txid)
        const reproveResults = await this.reproveHeader(root)
        r.invalidRoots[height] = { root, reproveResults }
      }
    }

    if (Object.keys(r.invalidRoots).length === 0) {
      // There are no invalid merkle roots and the beef is structurally valid.
      // The beef is fully verified.
      return r
    }

    // beef is structurally valid but has invalid merkle roots.
    // Attempt to repair the invalid roots by reproving all txids in this beef that relied on them.

    // All invalid BUMPs must be removed from the beef
    // and all txid's that were proven by those BUMPs need
    // new beefs merged into the beef.
    // In most cases, this will be a replacement BUMP,
    // but it may also require a deeper proof.

    return r
  }

  /**
   * Attempt to reprove the transaction against the current chain,
   * If a new valid proof is found and noUpdate is not true,
   * update the proven_txs record with new block and merkle proof data.
   * If noUpdate is true, the update to be applied is available in the returned result.
   *
   * @param ptx proven_txs record to reprove
   * @param noUpdate
   * @returns
   */
  async reproveProven(ptx: TableProvenTx, noUpdate?: boolean): Promise<sdk.ReproveProvenResult> {
    const r: sdk.ReproveProvenResult = { log: '', updated: undefined, unchanged: false, unavailable: false }
    const services = this.getServices()
    const chaintracker = await services.getChainTracker()

    const mpr = await services.getMerklePath(ptx.txid)
    if (mpr.merklePath && mpr.header) {
      const mp = mpr.merklePath
      const h = mpr.header
      const leaf = mp.path[0].find(leaf => leaf.txid === true && leaf.hash === ptx.txid)
      if (leaf) {
        const update: Partial<TableProvenTx> = {
          height: mp.blockHeight,
          index: leaf.offset,
          merklePath: mp.toBinary(),
          merkleRoot: h.merkleRoot,
          blockHash: h.hash
        }
        if (update.blockHash === ptx.blockHash) {
          r.log += `    txid ${ptx.txid} merkle path update still based on deactivated header ${ptx.blockHash}\n`
          r.unchanged = true
        } else {
          // Verify the new proof's validity.
          const merkleRoot = mp.computeRoot(ptx.txid)
          const isValid = await chaintracker.isValidRootForHeight(merkleRoot, update.height!)
          const logUpdate = `      height ${ptx.height} ${ptx.height === update.height ? 'unchanged' : `-> ${update.height}`}\n`
          r.log += `      blockHash ${ptx.blockHash} -> ${update.blockHash}\n`
          r.log += `      merkleRoot ${ptx.merkleRoot} -> ${update.merkleRoot}\n`
          r.log += `      index ${ptx.index} -> ${update.index}\n`
          if (isValid) {
            r.updated = { update, logUpdate }
          } else {
            r.log +=
              `    txid ${ptx.txid} chaintracker fails to confirm updated merkle path update invalid\n` + logUpdate
            r.unavailable = true
          }
        }
      } else {
        r.log += `    txid ${ptx.txid} merkle path update doesn't include txid\n`
        r.unavailable = true
      }
    } else {
      r.log += `    txid ${ptx.txid} merkle path update unavailable\n`
      r.unavailable = true
    }

    if (r.updated && !noUpdate) {
      await this.runAsStorageProvider(async sp => {
        await sp.updateProvenTx(ptx.provenTxId, r.updated!.update)
        r.log += `    txid ${ptx.txid} proof data updated\n` + r.updated!.logUpdate
      })
    }

    return r
  }

  async syncFromReader(
    identityKey: string,
    reader: sdk.WalletStorageSyncReader,
    activeSync?: sdk.WalletStorageSync,
    log: string = ''
  ): Promise<{ inserts: number; updates: number; log: string }> {
    const auth = await this.getAuth()
    if (identityKey !== auth.identityKey) throw new sdk.WERR_UNAUTHORIZED()

    const readerSettings = await reader.makeAvailable()

    let inserts = 0,
      updates = 0

    log = await this.runAsSync(async sync => {
      const writer = sync
      const writerSettings = this.getSettings()

      log += `syncFromReader from ${readerSettings.storageName} to ${writerSettings.storageName}\n`

      let i = -1
      for (;;) {
        i++
        const ss = await EntitySyncState.fromStorage(writer, identityKey, readerSettings)
        const args = ss.makeRequestSyncChunkArgs(identityKey, writerSettings.storageIdentityKey)
        const chunk = await reader.getSyncChunk(args)
        if (chunk.user) {
          // Merging state from a reader cannot update activeStorage
          chunk.user.activeStorage = this._active!.user!.activeStorage
        }
        const r = await writer.processSyncChunk(args, chunk)
        inserts += r.inserts
        updates += r.updates
        log += `chunk ${i} inserted ${r.inserts} updated ${r.updates} ${r.maxUpdated_at}\n`
        if (r.done) break
      }
      log += `syncFromReader complete: ${inserts} inserts, ${updates} updates\n`
      return log
    }, activeSync)

    return { inserts, updates, log }
  }

  async syncToWriter(
    auth: sdk.AuthId,
    writer: sdk.WalletStorageProvider,
    activeSync?: sdk.WalletStorageSync,
    log: string = '',
    progLog?: (s: string) => string
  ): Promise<{ inserts: number; updates: number; log: string }> {
    progLog ||= s => s
    const identityKey = auth.identityKey

    const writerSettings = await writer.makeAvailable()
    const isRemoteWriter = writer instanceof StorageClient

    let inserts = 0,
      updates = 0

    // If writer is remote (StorageClient), we must NOT hold a local IDB transaction
    // across network calls. Instead, do fresh reads for each chunk iteration.
    if (isRemoteWriter && !activeSync) {
      const readerSettings = this.getSettings()
      log += progLog(`syncToWriter from ${readerSettings.storageName} to ${writerSettings.storageName}\n`)

      let i = -1
      for (;;) {
        i++
        // Network call to remote writer - OK, no local transaction held
        const ss = await EntitySyncState.fromStorage(writer, identityKey, readerSettings)
        const args = ss.makeRequestSyncChunkArgs(identityKey, writerSettings.storageIdentityKey)
        // Fresh local read - brief transaction that completes before network call
        const chunk = await this.runAsSync(async sync => sync.getSyncChunk(args))
        log += EntitySyncState.syncChunkSummary(chunk)
        // Network call to remote writer - OK, no local transaction held
        const r = await writer.processSyncChunk(args, chunk)
        inserts += r.inserts
        updates += r.updates
        log += progLog(`chunk ${i} inserted ${r.inserts} updated ${r.updates} ${r.maxUpdated_at}\n`)
        if (r.done) break
      }
      log += progLog(`syncToWriter complete: ${inserts} inserts, ${updates} updates\n`)
    } else {
      // Writer is local or we have an active sync context - use original approach
      log = await this.runAsSync(async sync => {
        const reader = sync
        const readerSettings = reader.getSettings()

        log += progLog(`syncToWriter from ${readerSettings.storageName} to ${writerSettings.storageName}\n`)

        let i = -1
        for (;;) {
          i++
          const ss = await EntitySyncState.fromStorage(writer, identityKey, readerSettings)
          const args = ss.makeRequestSyncChunkArgs(identityKey, writerSettings.storageIdentityKey)
          const chunk = await reader.getSyncChunk(args)
          log += EntitySyncState.syncChunkSummary(chunk)
          const r = await writer.processSyncChunk(args, chunk)
          inserts += r.inserts
          updates += r.updates
          log += progLog(`chunk ${i} inserted ${r.inserts} updated ${r.updates} ${r.maxUpdated_at}\n`)
          if (r.done) break
        }
        log += progLog(`syncToWriter complete: ${inserts} inserts, ${updates} updates\n`)
        return log
      }, activeSync)
    }

    return { inserts, updates, log }
  }

  async updateBackups(activeSync?: sdk.WalletStorageSync, progLog?: (s: string) => string): Promise<string> {
    progLog ||= s => s
    const auth = await this.getAuth(true)
    return await this.runAsSync(async sync => {
      let log = progLog(`BACKUP CURRENT ACTIVE TO ${this._backups!.length} STORES\n`)
      for (const backup of this._backups!) {
        const stwr = await this.syncToWriter(auth, backup.storage, sync, undefined, progLog)
        log += stwr.log
      }
      return log
    }, activeSync)
  }

  /**
   * Updates backups and switches to new active storage provider from among current backup providers.
   *
   * Also resolves conflicting actives.
   *
   * @param storageIdentityKey of current backup storage provider that is to become the new active provider.
   */
  async setActive(storageIdentityKey: string, progLog?: (s: string) => string): Promise<string> {
    progLog ||= s => s
    if (!this.isAvailable()) await this.makeAvailable()

    // Confirm a valid storageIdentityKey: must match one of the _stores.
    const newActiveIndex = this._stores.findIndex(s => s.settings!.storageIdentityKey === storageIdentityKey)
    if (newActiveIndex < 0)
      throw new sdk.WERR_INVALID_PARAMETER(
        'storageIdentityKey',
        `registered with this "WalletStorageManager". ${storageIdentityKey} does not match any managed store.`
      )

    const identityKey = (await this.getAuth()).identityKey
    const newActive = this._stores[newActiveIndex]

    let log = progLog(`setActive to ${newActive.settings!.storageName}`)

    if (storageIdentityKey === this.getActiveStore() && this.isActiveEnabled)
      /** Setting the current active as the new active is a permitted no-op. */
      return log + progLog(` unchanged\n`)

    log += progLog('\n')

    log += await this.runAsSync(async sync => {
      let log = ''

      if (this._conflictingActives!.length > 0) {
        // Merge state from conflicting actives into `newActive`.

        // Handle case where new active is current active to resolve conflicts.
        // And where new active is one of the current conflict actives.
        this._conflictingActives!.push(this._active!)
        // Remove the new active from conflicting actives and
        // set new active as the conflicting active that matches the target `storageIdentityKey`
        this._conflictingActives = this._conflictingActives!.filter(ca => {
          const isNewActive = ca.settings!.storageIdentityKey === storageIdentityKey
          return !isNewActive
        })

        // Merge state from conflicting actives into `newActive`.
        for (const conflict of this._conflictingActives) {
          log += progLog('MERGING STATE FROM CONFLICTING ACTIVES:\n')
          const sfr = await this.syncToWriter(
            { identityKey, userId: newActive.user!.userId, isActive: false },
            newActive.storage,
            conflict.storage,
            undefined,
            progLog
          )
          log += sfr.log
        }
        log += progLog('PROPAGATE MERGED ACTIVE STATE TO NON-ACTIVES\n')
      } else {
        log += progLog('BACKUP CURRENT ACTIVE STATE THEN SET NEW ACTIVE\n')
      }

      // If there were conflicting actives,
      // Push state merged from all merged actives into newActive to all stores other than the now single active.
      // Otherwise,
      // Push state from current active to all other stores.
      const backupSource = this._conflictingActives!.length > 0 ? newActive : this._active!

      // Update the backupSource's user record with the new activeStorage
      // which will propagate to all other stores in the following backup loop.
      await backupSource.storage.setActive({ identityKey, userId: backupSource.user!.userId }, storageIdentityKey)

      for (const store of this._stores) {
        // Update cached user.activeStorage of all stores
        store.user!.activeStorage = storageIdentityKey

        if (store.settings!.storageIdentityKey !== backupSource.settings!.storageIdentityKey) {
          // If this store is not the backupSource store push state from backupSource to this store.
          const stwr = await this.syncToWriter(
            { identityKey, userId: store.user!.userId, isActive: false },
            store.storage,
            backupSource.storage,
            undefined,
            progLog
          )
          log += stwr.log
        }
      }

      this._isAvailable = false
      await this.makeAvailable()

      return log
    })

    return log
  }

  getStoreEndpointURL(store: ManagedStorage): string | undefined {
    if (store.storage.constructor.name === 'StorageClient') return (store.storage as StorageClient).endpointUrl
    return undefined
  }

  getStores(): sdk.WalletStorageInfo[] {
    const stores: sdk.WalletStorageInfo[] = []
    if (this._active) {
      stores.push({
        isActive: true,
        isEnabled: this.isActiveEnabled,
        isBackup: false,
        isConflicting: false,
        userId: this._active.user!.userId,
        storageIdentityKey: this._active.settings!.storageIdentityKey,
        storageName: this._active.settings!.storageName,
        storageClass: this._active.storage.constructor.name,
        endpointURL: this.getStoreEndpointURL(this._active)
      })
    }
    for (const store of this._conflictingActives || []) {
      stores.push({
        isActive: true,
        isEnabled: false,
        isBackup: false,
        isConflicting: true,
        userId: store.user!.userId,
        storageIdentityKey: store.settings!.storageIdentityKey,
        storageName: store.settings!.storageName,
        storageClass: store.storage.constructor.name,
        endpointURL: this.getStoreEndpointURL(store)
      })
    }
    for (const store of this._backups || []) {
      stores.push({
        isActive: false,
        isEnabled: false,
        isBackup: true,
        isConflicting: false,
        userId: store.user!.userId,
        storageIdentityKey: store.settings!.storageIdentityKey,
        storageName: store.settings!.storageName,
        storageClass: store.storage.constructor.name,
        endpointURL: this.getStoreEndpointURL(store)
      })
    }
    return stores
  }
}

export interface VerifyAndRepairBeefResult {
  isStructurallyValid: boolean
  originalRoots: Record<number, string>
  invalidRoots: Record<number, { root: string; reproveResults: sdk.ReproveHeaderResult }>
}
