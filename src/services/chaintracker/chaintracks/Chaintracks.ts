import { InsertHeaderResult } from './Api/ChaintracksStorageApi'
import { BulkIngestorApi } from './Api/BulkIngestorApi'
import { LiveIngestorApi } from './Api/LiveIngestorApi'

import { validateAgainstDirtyHashes } from './util/dirtyHashes'

import { ChaintracksOptions, ChaintracksManagementApi } from './Api/ChaintracksApi'
import { blockHash, validateHeaderFormat } from './util/blockHeaderUtilities'
import { Chain } from '../../../sdk/types'
import { ChaintracksInfoApi, HeaderListener, ReorgListener } from './Api/ChaintracksClientApi'
import { BaseBlockHeader, BlockHeader, LiveBlockHeader } from './Api/BlockHeaderApi'
import { asString } from '../../../utility/utilityHelpers.noBuffer'
import { randomBytesBase64, wait } from '../../../index.client'
import { HeightRange, HeightRanges } from './util/HeightRange'
import { SingleWriterMultiReaderLock } from './util/SingleWriterMultiReaderLock'
import { ChaintracksStorageBase } from './Base/ChaintracksStorageBase'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { ChaintracksFs } from './util/ChaintracksFs'
import { WERR_INVALID_OPERATION } from '../../../sdk'
import { skip } from 'node:test'

export class Chaintracks implements ChaintracksManagementApi {
  static createOptions(chain: Chain): ChaintracksOptions {
    return {
      chain,
      storageEngine: undefined,
      bulkIngestors: [],
      liveIngestors: [],
      addLiveRecursionLimit: 36,
      logging: 'all',
      readonly: false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...args: any[]) => void = () => {}

  readonly chain: Chain
  readonly readonly: boolean

  // Collection of all long running "threads": main thread (liveHeaders consumer / monitor) and each live header ingestor.
  private promises: Promise<void>[] = []

  private callbacks: { header: (HeaderListener | null)[]; reorg: (ReorgListener | null)[] } = { header: [], reorg: [] }
  private storageEngine: ChaintracksStorageBase
  private bulkIngestors: BulkIngestorApi[]
  private liveIngestors: LiveIngestorApi[]

  private baseHeaders: BaseBlockHeader[] = []
  private liveHeaders: BlockHeader[] = []
  private addLiveRecursionLimit = 11

  private available = false

  private subscriberCallbacksEnabled = false
  private stopMainThread = true

  private lastPresentHeight = 0
  private lastPresentHeightMsecs = 0
  private lastPresentHeightMaxAge = 60 * 1000 // 1 minute, in milliseconds

  private lock = new SingleWriterMultiReaderLock()

  constructor(public options: ChaintracksOptions) {
    if (!options.storageEngine) throw new Error('storageEngine is required.')
    if (!options.bulkIngestors || options.bulkIngestors.length < 1)
      throw new Error('At least one bulk ingestor is required.')
    if (!options.liveIngestors || options.liveIngestors.length < 1)
      throw new Error('At least one live ingestor is required.')
    this.chain = options.chain
    this.readonly = options.readonly
    this.storageEngine = options.storageEngine
    this.bulkIngestors = options.bulkIngestors
    this.liveIngestors = options.liveIngestors

    this.addLiveRecursionLimit = options.addLiveRecursionLimit

    if (options.logging === 'all') this.log = (...args) => console.log(new Date().toISOString(), ...args)
    this.log(`New ChaintracksBase Instance Constructed ${options.chain}Net`)
  }

  async getChain(): Promise<Chain> {
    return this.chain
  }

  /**
   * Caches and returns most recently sourced value if less than one minute old.
   * @returns the current externally available chain height (via bulk ingestors).
   */
  async getPresentHeight(): Promise<number> {
    const now = Date.now()
    if (this.lastPresentHeight && now - this.lastPresentHeightMsecs < this.lastPresentHeightMaxAge) {
      return this.lastPresentHeight
    }
    const presentHeights: number[] = []
    for (const bulk of this.bulkIngestors) {
      try {
        const presentHeight = await bulk.getPresentHeight()
        if (presentHeight) presentHeights.push(presentHeight)
      } catch (uerr: unknown) {
        console.log(uerr)
      }
    }
    const presentHeight = presentHeights.length ? Math.max(...presentHeights) : undefined
    if (!presentHeight) throw new Error('At least one bulk ingestor must implement getPresentHeight.');
    this.lastPresentHeight = presentHeight
    this.lastPresentHeightMsecs = now
    return presentHeight
  }

  async currentHeight(): Promise<number> {
    return await this.getPresentHeight()
  }

  async subscribeHeaders(listener: HeaderListener): Promise<string> {
    const ID = randomBytesBase64(8)
    this.callbacks.header[ID] = listener
    return ID
  }

  async subscribeReorgs(listener: ReorgListener): Promise<string> {
    const ID = randomBytesBase64(8)
    this.callbacks.reorg[ID] = listener
    return ID
  }

  async unsubscribe(subscriptionId: string): Promise<boolean> {
    let success = true
    if (this.callbacks.header[subscriptionId]) delete this.callbacks.header[subscriptionId]
    else if (this.callbacks.reorg[subscriptionId]) delete this.callbacks.reorg[subscriptionId]
    else success = false
    return success
  }

  /**
   * Queues a potentially new, unknown header for consideration as an addition to the chain.
   * When the header is considered, if the prior header is unknown, recursive calls to the
   * bulk ingestors will be attempted to resolve the linkage up to a depth of `addLiveRecursionLimit`.
   * 
   * Headers are considered in the order they were added.
   * 
   * @param header 
   */
  async addHeader(header: BaseBlockHeader): Promise<void> {
    this.baseHeaders.push(header)
  }

  async makeAvailable(): Promise<void> {
    if (this.available) return
    await this.lock.withWriteLock(async () => { await this.makeAvailableNoLock() })
  }

  private async makeAvailableNoLock(): Promise<void> {
    // Make sure database schema exists and is updated...
    await this.storageEngine.migrateLatest()
    for (const bulkIn of this.bulkIngestors) await bulkIn.setStorage(this.storageEngine)
    for (const liveIn of this.liveIngestors) await liveIn.setStorage(this.storageEngine)
    await this.startPromises()
    this.available = true
  }

  async destroy(): Promise<void> {
    if (!this.available) return
    await this.lock.withWriteLock(async () => {
      this.log('Shutting Down')
      this.stopMainThread = true
      for (const liveIn of this.liveIngestors) liveIn.stopListening()
      for (const liveIn of this.liveIngestors) await liveIn.shutdown()
      for (const bulkIn of this.bulkIngestors) await bulkIn.shutdown()
      await Promise.all(this.promises)
      await this.storageEngine.destroy()
      this.log('Shutdown')
      this.available = false
    })
  }

  async listening(): Promise<void> {
    return this.makeAvailable()
  }

  async isListening(): Promise<boolean> {
    return this.available
  }

  async isSynchronized(): Promise<boolean> {
    await this.makeAvailable()
    // TODO add synchronized flag... false while bulksyncing...
    return true
  }

  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    await this.makeAvailable()
    return this.lock.withReadLock(async () => this.findHeaderForHeightNoLock(height))
  }

  private async findHeaderForHeightNoLock(height: number): Promise<BlockHeader | undefined> {
    return await this.storageEngine.findHeaderForHeightOrUndefined(height)
  }

  async isValidRootForHeight(root: string, height: number): Promise<boolean> {
    const r = await this.findHeaderForHeight(height)
    if (!r) return false
    const isValid = root === r.merkleRoot
    return isValid
  }

  async getInfo(): Promise<ChaintracksInfoApi> {
    await this.makeAvailable()
    return this.lock.withReadLock(async () => this.getInfoNoLock())
  }

  private async getInfoNoLock(): Promise<ChaintracksInfoApi> {
    const liveRange = await this.storageEngine.getLiveHeightRange()
    const info: ChaintracksInfoApi = {
      chain: this.chain,
      heightBulk: liveRange.minHeight - 1,
      heightLive: liveRange.maxHeight,
      storageEngine: this.storageEngine.constructor.name,
      bulkIngestors: this.bulkIngestors.map(bulkIngestor => bulkIngestor.constructor.name),
      liveIngestors: this.liveIngestors.map(liveIngestor => liveIngestor.constructor.name),
      packages: []
    }
    return info
  }

  async getHeaders(height: number, count: number): Promise<number[]> {
    await this.makeAvailable()
    return this.lock.withReadLock(async () => await this.storageEngine.getHeaders(height, count))
  }

  async getHeadersHex(height: number, count: number): Promise<string> {
    return asString(await this.getHeaders(height, count))
  }

  async findChainTipHeader(): Promise<BlockHeader> {
    await this.makeAvailable()
    return this.lock.withReadLock(async () => await this.storageEngine.findChainTipHeader())
  }

  async findChainTipHash(): Promise<string> {
    await this.makeAvailable()
    return this.lock.withReadLock(async () => await this.storageEngine.findChainTipHash())
  }

  async findChainWorkForBlockHash(hash: string): Promise<string | undefined> {
    await this.makeAvailable()
    const header = await this.lock.withReadLock(async () => await this.storageEngine.findLiveHeaderForBlockHash(hash))
    if (!header) return undefined
    return header.chainWork
  }

  /**
   * @returns true iff all headers from height zero through current chainTipHeader height can be retreived and form a valid chain.
   */
  async validate(): Promise<boolean> {
    let h = await this.findChainTipHeader()
    while (h.height > 0) {
      const hp = await this.findHeaderForHeight(h.height - 1)
      if (!hp || hp.hash !== h.previousHash) throw new Error(`validation fails at height ${h.height}`)
      h = hp
      if (10000 * Math.floor(h.height / 10000) === h.height) this.log(`height ${h.height}`)
    }
    this.log('validated')
    return true
  }

  async exportBulkHeaders(toFolder: string, sourceUrl?: string, toHeadersPerFile?: number, maxHeight?: number, toFs?: ChaintracksFsApi): Promise<void> {
    toHeadersPerFile ||= 100000
    toFs ||= ChaintracksFs
    const bulk = this.storageEngine.bulkManager
    await bulk.exportHeadersToFs(toFs, toHeadersPerFile, toFolder, sourceUrl, maxHeight)
  }

  async startListening(): Promise<void> {
    await this.makeAvailable()
  }

  async startPromises(): Promise<void> {
    if (this.promises.length > 0 || this.stopMainThread !== true) return

    // Start all live ingestors to push new headers onto liveHeaders... each long running.
    for (const liveIngestor of this.liveIngestors) this.promises.push(liveIngestor.startListening(this.liveHeaders))

    // Start mai loop to shift out liveHeaders...
    this.promises.push(this.mainThreadShiftLiveHeaders())
  }



  private async syncBulkStorage(presentHeight: number, initialRanges: HeightRanges): Promise<void> {
    await this.lock.withWriteLock(async () => await this.syncBulkStorageNoLock(presentHeight, initialRanges))
  }

  private async syncBulkStorageNoLock(presentHeight: number, initialRanges: HeightRanges): Promise<void> {
      await this.makeAvailable()

      let liveHeaders: BlockHeader[] = []

      let bulkDone = false
      let before = initialRanges
      let after = before
      let added = HeightRange.empty

      let done = false
      for (; !done; ) {
        for (const bulk of this.bulkIngestors) {
          try {
            const r = await bulk.synchronize(presentHeight, before, liveHeaders)

            liveHeaders = r.liveHeaders
            after = await this.storageEngine.getAvailableHeightRanges()
            added = after.bulk.above(before.bulk)
            before = after
            this.log(
              `Bulk Ingestor ${bulk.constructor.name} synchronized: ${added.length} bulk added, ${liveHeaders.length} live headers.`
            )

            if (r.done) {
              done = true
              break
            }
          } catch (uerr: unknown) {
            console.log(uerr)
          }
        }
        if (bulkDone) break
      }
      this.liveHeaders = liveHeaders

      added = after.bulk.above(initialRanges.bulk)

      this.log(`syncBulkStorage done
  Before sync: bulk ${initialRanges.bulk}, live ${initialRanges.live}
   After sync: bulk ${after.bulk}, live ${after.live}
  ${added.length} headers added to bulk storage
  ${this.liveHeaders.length} headers forwarded to live header storage
`)
  }

  private async getMissingBlockHeader(hash: string): Promise<BlockHeader | undefined> {
    for (const live of this.liveIngestors) {
      const header = await live.getHeaderByHash(hash)
      if (header) return header
    }
    return undefined
  }

  private liveHeaderDupes = 0

  private invalidInsertHeaderResult(ihr: InsertHeaderResult): boolean {
    return ihr.noActiveAncestor || ihr.noTip || ihr.badPrev
  }

  private async addLiveHeader(header: BlockHeader): Promise<InsertHeaderResult> {
    validateHeaderFormat(header)
    validateAgainstDirtyHashes(header.hash)

    const ihr = await this.lock.withWriteLock(async () => {
      const ihr = await this.storageEngine.insertHeader(header)

      if (ihr.dupe) this.liveHeaderDupes++;
      else {
        // First non-dupe logs how many dupes there where in this update sequence.
        if (this.liveHeaderDupes) this.log(`addLiveHeader ignored ${this.liveHeaderDupes} dupes`)
        this.liveHeaderDupes = 0
        if (this.subscriberCallbacksEnabled)
          this.log(
            `addLiveHeader ${header.height}${ihr.added ? ' added' : ''}${ihr.dupe ? ' dupe' : ''}${ihr.isActiveTip ? ' isActiveTip' : ''}${ihr.reorgDepth ? ' reorg depth ' + ihr.reorgDepth : ''}${ihr.noPrev ? ' noPrev' : ''}${ihr.noActiveAncestor || ihr.noTip || ihr.badPrev ? ' error' : ''}`
          )
      }

      return ihr
    })

    if (this.invalidInsertHeaderResult(ihr)) return ihr;

    if (this.subscriberCallbacksEnabled && ihr.added && ihr.isActiveTip) {
      // If a new active chaintip has been added, notify subscribed event listeners...
      for (const id in this.callbacks.header) {
        const addListener = this.callbacks.header[id]
        if (addListener) {
          try {
            addListener(header)
          } catch {
            /* ignore all errors thrown */
          }
        }
      }

      if (ihr.reorgDepth > 0 && ihr.priorTip) {
        // If the new header was also a reorg, notify subscribed event listeners...
        for (const id in this.callbacks.reorg) {
          const reorgListener = this.callbacks.reorg[id]
          if (reorgListener) {
            try {
              reorgListener(ihr.reorgDepth, ihr.priorTip, header)
            } catch {
              /* ignore all errors thrown */
            }
          }
        }
      }
    }

    return ihr
  }

  /**
   * Long running method terminated by setting `stopMainThread` false.
   *
   * The promise returned by this method is held in the `promises` array.
   * 
   * When synchronized (bulk and live storage is valid up to most recent presentHeight),
   * this method will process headers from `baseHeaders` and `liveHeaders` arrays to extend the chain of headers.
   * 
   * If a significant gap is detected between bulk+live and presentHeight, `syncBulkStorage` is called to re-establish sync.
   * 
   * Periodically CDN bulk ingestor is invoked to check if incremental headers can be migrated to CDN backed files.
   */
  private async mainThreadShiftLiveHeaders(): Promise<void> {
    this.stopMainThread = false
    let lastSyncCheck = Date.now()
    let lastBulkSync = Date.now()
    const cdnSyncRepeatMsecs = 24 * 60 * 60 * 1000 // 24 hours
    const syncCheckRepeatMsecs = 30 * 60 * 1000 // 30 minutes

    while (!this.stopMainThread) {

      // Review the need for bulk sync...
      const now = Date.now()
      lastSyncCheck = now

      const presentHeight = await this.getPresentHeight()
      const before = await this.storageEngine.getAvailableHeightRanges()

      // Skip bulk sync if within less than half the recursion limit of present height
      let skipBulkSync = !before.live.isEmpty && before.live.maxHeight >= presentHeight - this.addLiveRecursionLimit / 2

      if (skipBulkSync && now - lastSyncCheck > cdnSyncRepeatMsecs) {
        // If we haven't re-synced in a long time, do it just to check for a CDN update.
        skipBulkSync = false
      }

      this.log(`Chaintracks Update Services: Bulk Header Sync Review
  presentHeight=${presentHeight}   addLiveRecursionLimit=${this.addLiveRecursionLimit}
  Before synchronize: bulk ${before.bulk}, live ${before.live}
  ${skipBulkSync ? 'Skipping' : 'Starting'} syncBulkStorage.
`)

      if (!skipBulkSync) {
        // Bring bulk storage up-to-date and (re-)initialize liveHeaders
        lastBulkSync = now
        await this.syncBulkStorage(presentHeight, before)
      }

      let count = 0
      let needSyncCheck = false

      for (; !needSyncCheck;) {
        let header = this.liveHeaders.shift()
        if (header) {
          // Process a "live" block header...
          let recursions = this.options.addLiveRecursionLimit
          for (; !needSyncCheck ;) {
            const ihr = await this.addLiveHeader(header)
            if (this.invalidInsertHeaderResult(ihr)) {
              this.log(`Ignoring liveHeader ${header.height} ${header.hash} due to invalid insert result.`)
              needSyncCheck = true
            } else if (ihr.noPrev) {
              // Previous header is unknown, request it by hash from the network and try adding it first...
              if (recursions-- <= 0) {
                // Ignore this header...
                this.log(`Ignoring liveHeader ${header.height} ${header.hash} addLiveRecursionLimit=${this.addLiveRecursionLimit} exceeded.`)
                needSyncCheck = true
              } else {
                const hash = header.previousHash
                const prevHeader = await this.getMissingBlockHeader(hash)
                if (!prevHeader) {
                  this.log(`Ignoring liveHeader ${header.height} ${header.hash} failed to find previous header by hash ${asString(hash)}`)
                  needSyncCheck = true
                } else {
                  // Switch to trying to add prevHeader, unshifting current header to try it again after prevHeader exists.
                  this.liveHeaders.unshift(header)
                  header = prevHeader
                }
              }
            } else {
              // Header wasn't invalid and previous header is known. If it was successfully added, count it as a win.
              if (ihr.added) count++;
              break;
            }
          }
        } else {
          // There are no liveHeaders currently to process, check the out-of-band baseHeaders channel (`addHeader` method called by a client).
          const bheader = this.baseHeaders.shift()
          if (bheader) {
            const ihr: InsertHeaderResult = await this.lock.withWriteLock(async () => {
              const prev = await this.storageEngine.findLiveHeaderForBlockHash(bheader.previousHash)
              if (!prev) return { added: false, badPrev: true, dupe: false, isActiveTip: false, reorgDepth: 0, priorTip: undefined, noPrev: true, noActiveAncestor: false, noTip: false }
              const header: BlockHeader = {
                ...bheader,
                height: prev.height + 1,
                hash: blockHash(bheader)
              }
              // Process a client provided block header...
              return await this.addLiveHeader(header)
            })
            if (!this.invalidInsertHeaderResult(ihr) && ihr.added) {
              // baseHeader was successfully added.
              count++;
            } else {
              // Ignoring attempt to add a baseHeader with unknown previous hash, no attempt made to find previous header(s).
              this.log(`Ignoring base header with unknown previous hash ${bheader.previousHash}`)
              // Does not trigger a re-sync.
            }
          } else {
            if (count > 0) {
              this.log(`${count} live headers added`)
              count = 0
            }
            // There are no liveHeaders and no baseHeaders to add,
            needSyncCheck = Date.now() - lastSyncCheck > syncCheckRepeatMsecs
            if (!needSyncCheck)
              await wait(1000)
          }
        }
      }
    }
  }
}
