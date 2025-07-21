import { BulkStorageApi } from './Api/BulkStorageApi'
import { InsertHeaderResult, ChaintracksStorageApi } from './Api/ChaintracksStorageApi'
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

export class Chaintracks implements ChaintracksManagementApi {
  static createOptions(chain: Chain): ChaintracksOptions {
    return {
      chain,
      storageEngine: undefined,
      bulkStorage: undefined,
      bulkIngestors: [],
      liveIngestors: [],
      addLiveRecursionLimit: 36,
      logging: 'all'
    }
  }

  callbacks: { header: (HeaderListener | null)[]; reorg: (ReorgListener | null)[] } = { header: [], reorg: [] }

  chain: Chain
  storageEngine: ChaintracksStorageApi
  bulkStorage?: BulkStorageApi
  bulkIngestors: BulkIngestorApi[]
  liveIngestors: LiveIngestorApi[]
  addLiveRecursionLimit = 11

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...args: any[]) => void = () => {}

  private baseHeaders: BaseBlockHeader[] = []
  private liveHeaders: BlockHeader[] = []
  private livePrevHeader: LiveBlockHeader | undefined
  private isClientApiEnabled = false

  private componentsInitialized = false

  private synchronizing = false
  private lastSynchronizePresentHeight: number | undefined

  private startListeningActive = false
  private listeningCallback = () => {}
  private subscriberCallbacksEnabled = false
  private stopShiftLiveHeaders = false

  constructor(public options: ChaintracksOptions) {
    if (!options.storageEngine) throw new Error('storageEngine is required.')
    if (!options.bulkIngestors || options.bulkIngestors.length < 1)
      throw new Error('At least one bulk ingestor is required.')
    if (!options.liveIngestors || options.liveIngestors.length < 1)
      throw new Error('At least one live ingestor is required.')
    this.chain = options.chain
    this.storageEngine = options.storageEngine
    this.bulkStorage = options.bulkStorage
    this.bulkIngestors = options.bulkIngestors
    this.liveIngestors = options.liveIngestors

    this.addLiveRecursionLimit = options.addLiveRecursionLimit

    if (options.logging === 'all') this.log = (...args) => console.log(new Date().toISOString(), ...args)
    this.log(`New ChaintracksBase Instance Constructed ${options.chain}Net`)
  }

  //
  // CLIENT API: Implemenation of ChaintracksClientApi
  //

  async currentHeight(): Promise<number> {
    return await this.getPresentHeight()
  }

  async isValidRootForHeight(root: string, height: number): Promise<boolean> {
    const r = await this.findHeaderForHeight(height)
    if (!r) return false
    const isValid = root === r.merkleRoot
    return isValid
  }

  async getChain(): Promise<Chain> {
    return this.chain
  }

  async getInfo(): Promise<ChaintracksInfoApi> {
    const liveRange = await this.storageEngine.getLiveHeightRange()
    const info: ChaintracksInfoApi = {
      chain: this.chain,
      heightBulk: liveRange.minHeight - 1,
      heightLive: liveRange.maxHeight,
      storageEngine: this.storageEngine.constructor.name,
      bulkStorage: this.bulkStorage?.constructor.name,
      bulkIngestors: this.bulkIngestors.map(bulkIngestor => bulkIngestor.constructor.name),
      liveIngestors: this.liveIngestors.map(liveIngestor => liveIngestor.constructor.name),
      packages: []
    }
    return info
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

  async getPresentHeight(): Promise<number> {
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
    if (!presentHeight) throw new Error('At least one bulk ingestor must implement getPresentHeight.')
    return presentHeight
  }

  async getHeaders(height: number, count: number): Promise<number[]> {
    return await this.storageEngine.getHeaders(height, count)
  }

  async getHeadersHex(height: number, count: number): Promise<string> {
    return asString(await this.getHeaders(height, count))
  }

  async findChainTipHeader(): Promise<BlockHeader> {
    this.checkIfClientApiIsEnabled()
    return await this.storageEngine.findChainTipHeader()
  }
  async findChainTipHash(): Promise<string> {
    this.checkIfClientApiIsEnabled()
    return await this.storageEngine.findChainTipHash()
  }
  async findChainWorkForBlockHash(hash: string): Promise<string | undefined> {
    this.checkIfClientApiIsEnabled()
    const header = await this.storageEngine.findLiveHeaderForBlockHash(hash)
    if (!header) return undefined
    return header.chainWork
  }
  async findChainWorkHexForBlockHash(hash: string): Promise<string | undefined> {
    const chainWork = await this.findChainWorkForBlockHash(hash)
    return chainWork ? asString(chainWork) : undefined
  }
  async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> {
    this.checkIfClientApiIsEnabled()
    return await this.storageEngine.findHeaderForHeightOrUndefined(height)
  }

  async addHeader(header: BaseBlockHeader): Promise<void> {
    this.checkIfClientApiIsEnabled()
    this.baseHeaders.push(header)
  }

  async syncBulkStorage(presentHeight: number, before: HeightRanges): Promise<void> {

    if (this.synchronizing) return

    try {
      this.synchronizing = true
      await this.initializeComponents()

      if (this.lastSynchronizePresentHeight && this.lastSynchronizePresentHeight >= presentHeight) return

      this.log('Synchronizing')

      // Iterate through configured bulk ingestors, each bulk ingestor must:
      // - examine the state of block headers known to the storage engine
      // - examine its available source of block headers

      let liveHeaders: BlockHeader[] = []

      let bulkDone = false

      for (const bulk of this.bulkIngestors) {
        for (; ;) {
          try {
            liveHeaders = await bulk.synchronize(presentHeight, before, liveHeaders)
            if (liveHeaders.length > 0) {
              const h = liveHeaders[liveHeaders.length - 1]
              if (h.height > presentHeight - 12) {
                // If bulk + liveHeaders is close enough to presentHeight, bulk ingesting is done.
                bulkDone = true
                break
              }
            }
          } catch (uerr: unknown) {
            console.log(uerr)
          }
        }
        if (bulkDone) break
      }
      this.liveHeaders = liveHeaders

      const after = await this.storageEngine.getAvailableHeightRanges()
      const added = after.bulk.above(before.bulk)

      console.log(`Before synchronize: bulk ${before.bulk}, live ${before.live}`)
      console.log(` After synchronize: bulk ${after.bulk}, live ${after.live}`)
      console.log(` ${added.length} headers added to bulk storage`)
      console.log(` ${this.liveHeaders.length} headers forwarded to live header storage`)

      if (this.storageEngine.bulkStorage && after.live.isEmpty && this.liveHeaders.length > 0) {
        console.log('validating bulk storage headers')
        this.livePrevHeader = await this.storageEngine.bulkStorage.validateHeaders()
        console.log('validated bulk storage headers')
      }

      this.lastSynchronizePresentHeight = presentHeight
    } finally {
      this.synchronizing = false
    }
  }

  async isSynchronized(): Promise<boolean> {
    return !!this.lastSynchronizePresentHeight
  }

  async isListening(): Promise<boolean> {
    return this.subscriberCallbacksEnabled
  }

  listening(): Promise<void> {
    if (this.subscriberCallbacksEnabled) return Promise.resolve()
    let resolve: () => void
    const promise = new Promise<void>(res => (resolve = res))
    const oldListening = this.listeningCallback
    this.listeningCallback = () => {
      oldListening()
      resolve()
    }
    return promise
  }

  async startListening(listening = () => {}): Promise<void> {
    //if (this.isClientApiEnabled) throw new Error("Client mode. Management functions are not allowed.")

    if (this.startListeningActive) {
      if (this.subscriberCallbacksEnabled) listening()
      else {
        const oldListening = this.listeningCallback
        this.listeningCallback = () => {
          oldListening()
          listening()
        }
      }
    } else
      try {
        this.startListeningActive = true
        this.listeningCallback = listening

        await this.initializeComponents()

        const presentHeight = await this.getPresentHeight()
        const before = await this.storageEngine.getAvailableHeightRanges()

        this.log(`Listening Start
  presentHeight=${presentHeight}
  Before synchronize: bulk ${before.bulk}, live ${before.live}
`)

        // Bring bulk storage up-to-date and initialize liveHeaders
        await this.syncBulkStorage(presentHeight, before)

        this.stopShiftLiveHeaders = false

        // Collection of all long running "threads": liveHeaders consumer and each live header ingestor.
        const promises: Promise<void>[] = []

        // Start loop to shift out liveHeaders...
        promises.push(this.shiftLiveHeaders(presentHeight))

        // Start all live ingestors to push new headers onto liveHeaders... each long running.
        for (const liveIngestor of this.liveIngestors) promises.push(liveIngestor.startListening(this.liveHeaders))

        try {
          await Promise.race(promises)
        } catch (uerr: unknown) {
          console.log(uerr)
        }

        this.stopListeningInternal()

        await Promise.all(promises)
      } catch (uerr) {
        this.log('Listening Error')
        throw uerr
      } finally {
        this.log('Listening Done')
        this.startListeningActive = false
      }
  }

  //
  // MANAGEMENT API: Implementation of ChaintracksManagementApi extensions to ChaintracksClientApi
  //

  async shutdown(): Promise<void> {
    //if (this.isClientApiEnabled)
    //    throw new Error("Client mode. Management functions are not allowed.")

    if (this.componentsInitialized) {
      this.log('Shutting Down')
      this.stopListeningInternal()
      for (const liveIn of this.liveIngestors) await liveIn.shutdown()
      for (const bulkIn of this.bulkIngestors) await bulkIn.shutdown()
      await this.storageEngine.shutdown()
      await this.bulkStorage?.shutdown()
      this.log('Shutdown')
    }
    this.componentsInitialized = false
    if (this.startListeningActive) {
      while (this.startListeningActive) await wait(10)
    }
  }

  async stopListening(): Promise<void> {
    this.log('stopListening')
    this.stopListeningInternal()
  }

  async enableClientApiWithoutListening(): Promise<void> {
    await this.initializeComponents()
    this.isClientApiEnabled = true
    this.log('enabledClientApi')
  }

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

  async exportBulkHeaders(rootFolder: string, jsonFilename?: string, maxPerFile?: number): Promise<void> {
    jsonFilename ||= `${this.chain}Net.json`
    maxPerFile ||= 400000
    if (this.bulkStorage) {
      this.log(`Exporting bulk headers to ${rootFolder}`)
      await this.bulkStorage.exportBulkHeaders(rootFolder, jsonFilename, maxPerFile)
      this.log(`Exporting bulk headers done.`)
    } else this.log(`bulkStorage is not configured in options.`)
  }

  //
  // PROTECTED FUNCTIONS
  //

  //
  // PRIVATE FUNCTIONS
  //

  private checkIfClientApiIsEnabled() {
    if (this.isClientApiEnabled) return
    if (!this.lastSynchronizePresentHeight) throw new Error('Chaintracks must be synchronized to enable the client API.')
    if (!this.subscriberCallbacksEnabled)
      throw new Error('Chaintracks must be listening for new headers to enable the client API.')
  }

  private async initializeComponents(): Promise<void> {
    if (!this.componentsInitialized) {
      // Make sure database schema exists and is updated...
      await this.storageEngine.migrateLatest()

      await this.storageEngine.setBulkStorage(this.bulkStorage)
      for (const bulkIn of this.bulkIngestors) await bulkIn.setStorage(this.storageEngine)
      for (const liveIn of this.liveIngestors) await liveIn.setStorage(this.storageEngine)
    }
    this.componentsInitialized = true
  }

  private stopListeningInternal(): void {
    if (this.startListeningActive) {
      this.subscriberCallbacksEnabled = false
      this.stopShiftLiveHeaders = true
      for (const liveIngestor of this.liveIngestors) liveIngestor.stopListening()
    }
  }

  private async getMissingBlockHeader(hash: string): Promise<BlockHeader | undefined> {
    for (const live of this.liveIngestors) {
      const header = await live.getHeaderByHash(hash)
      if (header) return header
    }
    return undefined
  }

  private liveHeaderDupes = 0

  private async addLiveHeader(header: BlockHeader): Promise<InsertHeaderResult> {
    validateHeaderFormat(header)
    validateAgainstDirtyHashes(header.hash)

    const ihr = await this.storageEngine.insertHeader(header, this.livePrevHeader)

    if (ihr.dupe) this.liveHeaderDupes++
    else {
      if (this.liveHeaderDupes) this.log(`try insert header ignored ${this.liveHeaderDupes} dupes`)
      this.liveHeaderDupes = 0
      if (this.subscriberCallbacksEnabled)
        this.log(
          `try insert header ${header.height}${ihr.added ? ' added' : ''}${ihr.dupe ? ' dupe' : ''}${ihr.isActiveTip ? ' isActiveTip' : ''}${ihr.reorgDepth ? ' reorg depth ' + ihr.reorgDepth : ''}${ihr.noPrev ? ' noPrev' : ''}${ihr.noActiveAncestor || ihr.noTip || ihr.badPrev ? ' error' : ''}`
        )
    }

    if (ihr.noActiveAncestor || ihr.noTip || ihr.badPrev) throw new Error('insertHeader inconsistent state')

    if (ihr.added && this.livePrevHeader && header.previousHash === this.livePrevHeader.hash)
      this.livePrevHeader = undefined

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

  private async shiftLiveHeaders(presentHeight: number): Promise<void> {
    try {
      let count = 0
      let notified = false

      while (!this.stopShiftLiveHeaders) {
        if (!notified && (this.liveHeaders.length === 0 || this.liveHeaders[0].height > presentHeight)) {
          // Notification that now listening for new block headers.
          this.subscriberCallbacksEnabled = true
          this.log(`Listening at height ${presentHeight}`)
          try {
            this.listeningCallback()
          } catch {
            /* eat any errors */
          }
          this.listeningCallback = () => {}
          notified = true
        }

        let header = this.liveHeaders.shift()

        if (header) {
          // Process a "live" block header...
          let recursions = this.options.addLiveRecursionLimit
          for (;;) {
            const ihr = await this.addLiveHeader(header)
            if (ihr.noPrev) {
              // Previous header is unknown
              if (recursions-- <= 0) throw new Error(`addLiveRecursionLimit=${this.addLiveRecursionLimit} exceeded.`)
              // Return this header for processing after fetching previous header(s)
              this.liveHeaders.unshift(header)
              const hash = header.previousHash
              console.log(`get previous header ${asString(hash)}`)
              header = await this.getMissingBlockHeader(hash)
              if (!header) throw new Error(`failed to get header ${asString(hash)} from live ingestors`)
            } else {
              if (ihr.added) count++
              // successfuly processed header
              break
            }
          }
        } else {
          const bheader = this.baseHeaders.shift()
          if (bheader) {
            const prev = await this.storageEngine.findLiveHeaderForBlockHash(bheader.previousHash)
            if (prev) {
              const header: BlockHeader = {
                ...bheader,
                height: prev.height + 1,
                hash: blockHash(bheader)
              }
              // Process a client provided block header...
              const ok = await this.addLiveHeader(header)
              if (ok) count++
            }
          } else {
            // No new headers available right now, chill for a bit.
            await wait(1000)
          }
        }
      }
    } finally {
      this.stopListeningInternal()
    }
  }
}
