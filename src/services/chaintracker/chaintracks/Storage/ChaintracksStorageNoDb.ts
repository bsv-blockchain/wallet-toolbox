import { ChaintracksStorageBaseOptions, InsertHeaderResult } from '../Api/ChaintracksStorageApi'
import { ChaintracksStorageBase } from '../Storage/ChaintracksStorageBase'
import { LiveBlockHeader } from '../Api/BlockHeaderApi'
import { addWork, convertBitsToWork, isMoreWork, serializeBaseBlockHeader } from '../util/blockHeaderUtilities'
import { HeightRange } from '../util/HeightRange'
import { BulkFilesReaderStorage } from '../util/BulkFilesReader'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { Chain } from '../../../../sdk/types'
import { WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk/WERR_errors'
import { BlockHeader } from '../../../../sdk/WalletServices.interfaces'

interface ChaintracksNoDbData {
  chain: Chain
  liveHeaders: Map<number, LiveBlockHeader>
  maxHeaderId: number
  tipHeaderId: number
  hashToHeaderId: Map<string, number>
}

export interface ChaintracksStorageNoDbOptions extends ChaintracksStorageBaseOptions {}

export class ChaintracksStorageNoDb extends ChaintracksStorageBase {
  static mainData: ChaintracksNoDbData = {
    chain: 'main',
    liveHeaders: new Map<number, LiveBlockHeader>(),
    maxHeaderId: 0,
    tipHeaderId: 0,
    hashToHeaderId: new Map<string, number>()
  }
  static testData: ChaintracksNoDbData = {
    chain: 'test',
    liveHeaders: new Map<number, LiveBlockHeader>(),
    maxHeaderId: 0,
    tipHeaderId: 0,
    hashToHeaderId: new Map<string, number>()
  }

  constructor(options: ChaintracksStorageNoDbOptions) {
    super(options)
  }

  override async destroy(): Promise<void> {}

  async getData(): Promise<ChaintracksNoDbData> {
    switch (this.chain) {
      case 'main':
        return ChaintracksStorageNoDb.mainData
      case 'test':
      case 'teratest':
        return ChaintracksStorageNoDb.testData
      default:
        throw new WERR_INVALID_PARAMETER('chain', `'main', 'test', or 'teratest'. '${this.chain}' is unsupported.`)
    }
  }

  override async deleteLiveBlockHeaders(): Promise<void> {
    const data = await this.getData()
    data.liveHeaders.clear()
    data.maxHeaderId = 0
    data.tipHeaderId = 0
    data.hashToHeaderId.clear()
  }

  override async deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number> {
    const data = await this.getData()
    let deletedCount = 0

    // Clear previousHeaderId references
    for (const [headerId, header] of data.liveHeaders) {
      if (header.previousHeaderId) {
        const prevHeader = data.liveHeaders.get(header.previousHeaderId)
        if (prevHeader && prevHeader.height <= maxHeight) {
          data.liveHeaders.set(headerId, { ...header, previousHeaderId: null })
        }
      }
    }

    // Delete headers up to maxHeight
    const headersToDelete = new Set<number>()
    for (const [headerId, header] of data.liveHeaders) {
      if (header.height <= maxHeight) {
        headersToDelete.add(headerId)
        data.hashToHeaderId.delete(header.hash)
      }
    }
    deletedCount = headersToDelete.size
    for (const headerId of headersToDelete) {
      data.liveHeaders.delete(headerId)
    }

    // Update tipHeaderId if necessary
    if (data.liveHeaders.size > 0) {
      const tip = Array.from(data.liveHeaders.values()).find(h => h.isActive && h.isChainTip)
      data.tipHeaderId = tip ? tip.headerId : 0
    } else {
      data.tipHeaderId = 0
    }

    return deletedCount
  }

  override async findChainTipHeader(): Promise<LiveBlockHeader> {
    const data = await this.getData()
    const tip = Array.from(data.liveHeaders.values()).find(h => h.isActive && h.isChainTip)
    if (!tip) throw new Error('Database contains no active chain tip header.')
    return tip
  }

  override async findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined> {
    const data = await this.getData()
    return Array.from(data.liveHeaders.values()).find(h => h.isActive && h.isChainTip)
  }

  override async findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null> {
    const data = await this.getData()
    const headerId = data.hashToHeaderId.get(hash)
    return headerId ? data.liveHeaders.get(headerId) || null : null
  }

  override async findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader> {
    const data = await this.getData()
    const header = data.liveHeaders.get(headerId)
    if (!header) throw new Error(`HeaderId ${headerId} not found in live header database.`)
    return header
  }

  override async findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null> {
    const data = await this.getData()
    return Array.from(data.liveHeaders.values()).find(h => h.height === height && h.isActive) || null
  }

  override async findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null> {
    const data = await this.getData()
    return Array.from(data.liveHeaders.values()).find(h => h.merkleRoot === merkleRoot) || null
  }

  override async findLiveHeightRange(): Promise<HeightRange> {
    const data = await this.getData()
    const activeHeaders = Array.from(data.liveHeaders.values()).filter(h => h.isActive)
    if (activeHeaders.length === 0) {
      return HeightRange.empty
    }
    const minHeight = Math.min(...activeHeaders.map(h => h.height))
    const maxHeight = Math.max(...activeHeaders.map(h => h.height))
    return new HeightRange(minHeight, maxHeight)
  }

  override async findMaxHeaderId(): Promise<number> {
    const data = await this.getData()
    return data.maxHeaderId
  }

  override async liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]> {
    const data = await this.getData()
    return Array.from(data.liveHeaders.values())
      .filter(h => h.isActive)
      .sort((a, b) => a.height - b.height)
      .slice(0, count)
  }

  override async getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]> {
    if (range.isEmpty) return []
    const data = await this.getData()
    const headers = Array.from(data.liveHeaders.values())
      .filter(h => h.isActive && h.height >= range.minHeight && h.height <= range.maxHeight)
      .sort((a, b) => a.height - b.height)
    return headers
  }

  override async insertHeader(header: BlockHeader): Promise<InsertHeaderResult> {
    const data = await this.getData()

    const r: InsertHeaderResult = {
      added: false,
      dupe: false,
      noPrev: false,
      badPrev: false,
      noActiveAncestor: false,
      isActiveTip: false,
      reorgDepth: 0,
      priorTip: undefined,
      noTip: false,
      deactivatedHeaders: []
    }

    // Check for duplicate
    if (data.hashToHeaderId.has(header.hash)) {
      r.dupe = true
      return r
    }

    // Find previous header
    let oneBack = Array.from(data.liveHeaders.values()).find(h => h.hash === header.previousHash)

    if (!oneBack) {
      // Check if this is first live header
      const count = data.liveHeaders.size
      if (count === 0) {
        // If this is the first live header, the last bulk header (if there is one) is the previous header.
        const lbf = await this.bulkManager.getLastFile()
        if (!lbf) throw new WERR_INVALID_OPERATION('bulk headers must exist before first live header can be added')
        if (header.previousHash === lbf.lastHash && header.height === lbf.firstHeight + lbf.count) {
          // Valid first live header. Add it.
          const chainWork = addWork(lbf.lastChainWork, convertBitsToWork(header.bits))
          r.isActiveTip = true
          const newHeader = {
            ...header,
            headerId: ++data.maxHeaderId,
            previousHeaderId: null,
            chainWork,
            isChainTip: r.isActiveTip,
            isActive: r.isActiveTip
          }
          data.liveHeaders.set(newHeader.headerId, newHeader)
          data.hashToHeaderId.set(header.hash, newHeader.headerId)
          data.tipHeaderId = newHeader.headerId
          r.added = true
          return r
        }
      }
      // Failure without a oneBack
      // First live header that does not follow last bulk header or
      // Not the first live header and live headers doesn't include a previousHash header.
      r.noPrev = true
      return r
    }

    // This header's previousHash matches an existing live header's hash, if height isn't +1, reject it.
    if (oneBack.height + 1 !== header.height) {
      r.badPrev = true
      return r
    }

    r.priorTip =
      oneBack.isActive && oneBack.isChainTip
        ? oneBack
        : Array.from(data.liveHeaders.values()).find(h => h.isActive && h.isChainTip)

    if (!r.priorTip) {
      // No active chain tip found. This is a logic error in state of live headers.
      r.noTip = true
      return r
    }

    // We have an acceptable new live header...and live headers has an active chain tip.

    const chainWork = addWork(oneBack.chainWork, convertBitsToWork(header.bits))

    r.isActiveTip = isMoreWork(chainWork, r.priorTip.chainWork)

    const newHeader = {
      ...header,
      headerId: ++data.maxHeaderId,
      previousHeaderId: oneBack.headerId,
      chainWork,
      isChainTip: r.isActiveTip,
      isActive: r.isActiveTip
    }

    if (r.isActiveTip) {
      let activeAncestor = oneBack
      while (!activeAncestor.isActive) {
        const previousHeader = data.liveHeaders.get(activeAncestor.previousHeaderId!)
        if (!previousHeader) {
          r.noActiveAncestor = true
          return r
        }
        activeAncestor = previousHeader
      }

      if (!(oneBack.isActive && oneBack.isChainTip)) {
        r.reorgDepth = Math.min(r.priorTip.height, header.height) - activeAncestor.height
      }

      if (activeAncestor.headerId !== oneBack.headerId) {
        let headerToDeactivate = Array.from(data.liveHeaders.values()).find(h => h.isChainTip && h.isActive)
        while (headerToDeactivate && headerToDeactivate.headerId !== activeAncestor.headerId) {
          r.deactivatedHeaders.push(headerToDeactivate)
          data.liveHeaders.set(headerToDeactivate.headerId, { ...headerToDeactivate, isActive: false })
          headerToDeactivate = data.liveHeaders.get(headerToDeactivate.previousHeaderId!)
        }

        let headerToActivate = oneBack
        while (headerToActivate.headerId !== activeAncestor.headerId) {
          data.liveHeaders.set(headerToActivate.headerId, { ...headerToActivate, isActive: true })
          headerToActivate = data.liveHeaders.get(headerToActivate.previousHeaderId!)!
        }
      }
    }

    if (oneBack.isChainTip) {
      data.liveHeaders.set(oneBack.headerId, { ...oneBack, isChainTip: false })
    }

    data.liveHeaders.set(newHeader.headerId, newHeader)
    data.hashToHeaderId.set(newHeader.hash, newHeader.headerId)
    r.added = true

    if (r.added && r.isActiveTip) {
      data.tipHeaderId = newHeader.headerId
      this.pruneLiveBlockHeaders(newHeader.height)
    }

    return r
  }
}
