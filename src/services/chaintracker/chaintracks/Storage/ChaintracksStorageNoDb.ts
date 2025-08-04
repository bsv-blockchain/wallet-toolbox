import { InsertHeaderResult, ChaintracksStorageBaseOptions } from '../Api/ChaintracksStorageApi'
import { ChaintracksStorageBase } from '../Base/ChaintracksStorageBase'
import { Chain, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import { addWork, convertBitsToWork, isMoreWork, serializeBaseBlockHeader } from '../util/blockHeaderUtilities'
import { BulkHeaderFileInfo } from '../util/BulkHeaderFile'
import { HeightRange } from '../util/HeightRange'
import { BulkFilesReaderStorage } from '../util/BulkFilesReader'
import { ChaintracksFetch } from '../util/ChaintracksFetch'

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

  async getData(): Promise<ChaintracksNoDbData> {
    if (this.chain === 'main') {
      return ChaintracksStorageNoDb.mainData
    } else if (this.chain === 'test') {
      return ChaintracksStorageNoDb.testData
    } else {
      throw new WERR_INVALID_PARAMETER('chain', `either 'main' or 'test. '${this.chain}' is unsupported.`)
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

  override async findLiveHeightRange(): Promise<{ minHeight: number; maxHeight: number }> {
    const data = await this.getData()
    const activeHeaders = Array.from(data.liveHeaders.values()).filter(h => h.isActive)
    if (activeHeaders.length === 0) {
      return { minHeight: 0, maxHeight: -1 }
    }
    const minHeight = Math.min(...activeHeaders.map(h => h.height))
    const maxHeight = Math.max(...activeHeaders.map(h => h.height))
    return { minHeight, maxHeight }
  }

  override async findMaxHeaderId(): Promise<number> {
    const data = await this.getData()
    return data.maxHeaderId
  }

  override async getLiveHeightRange(): Promise<HeightRange> {
    const data = await this.getData()
    const activeHeaders = Array.from(data.liveHeaders.values()).filter(h => h.isActive)
    if (activeHeaders.length === 0) {
      return new HeightRange(0, -1)
    }
    const minHeight = Math.min(...activeHeaders.map(h => h.height))
    const maxHeight = Math.max(...activeHeaders.map(h => h.height))
    return new HeightRange(minHeight, maxHeight)
  }

  override async liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]> {
    const data = await this.getData()
    return Array.from(data.liveHeaders.values())
      .filter(h => h.isActive)
      .sort((a, b) => a.height - b.height)
      .slice(0, count)
  }

  override async getHeaders(height: number, count: number): Promise<number[]> {
    if (count <= 0) return []

    const data = await this.getData()
    const headers = Array.from(data.liveHeaders.values())
      .filter(h => h.isActive && h.height >= height && h.height < height + count)
      .sort((a, b) => a.height - b.height)
      .slice(0, count)

    const bufs: Uint8Array[] = []

    if (headers.length === 0 || headers[0].height > height) {
      const bulkCount = headers.length === 0 ? count : headers[0].height - height
      const range = new HeightRange(height, height + bulkCount - 1)
      const reader = await BulkFilesReaderStorage.fromStorage(this, new ChaintracksFetch(), range, bulkCount * 80)
      const bulkData = await reader.read()
      if (bulkData) {
        bufs.push(bulkData)
      }
    }

    if (headers.length > 0) {
      let buf = new Uint8Array(headers.length * 80)
      for (let i = 0; i < headers.length; i++) {
        const h = headers[i]
        const ha = serializeBaseBlockHeader(h)
        buf.set(ha, i * 80)
      }
      bufs.push(buf)
    }

    const r: number[] = []
    for (const bh of bufs) {
      for (const b of bh) {
        r.push(b)
      }
    }
    return r
  }

  override async insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult> {
    const data = await this.getData()

    let ok = true
    let dupe = false
    let noPrev = false
    let badPrev = false
    let noActiveAncestor = false
    let noTip = false
    let setActiveChainTip = false
    let reorgDepth = 0
    let priorTip: LiveBlockHeader | undefined

    // Check for duplicate
    if (data.hashToHeaderId.has(header.hash)) {
      dupe = true
      return { added: false, dupe, isActiveTip: false, reorgDepth, priorTip, noPrev, badPrev, noActiveAncestor, noTip }
    }

    // Find previous header
    let oneBack = Array.from(data.liveHeaders.values()).find(h => h.hash === header.previousHash)
    if (!oneBack && prev && prev.hash === header.previousHash && prev.height + 1 === header.height) {
      oneBack = prev
    }

    if (!oneBack) {
      // Check if this is first live header
      if (data.liveHeaders.size === 0) {
        const lbf = await this.bulkManager.getLastFile()
        if (lbf && header.previousHash === lbf.lastHash && header.height === lbf.firstHeight + lbf.count) {
          const chainWork = addWork(lbf.lastChainWork, convertBitsToWork(header.bits))
          const newHeader = {
            ...header,
            headerId: ++data.maxHeaderId,
            previousHeaderId: null,
            chainWork,
            isChainTip: true,
            isActive: true
          }
          data.liveHeaders.set(newHeader.headerId, newHeader)
          data.hashToHeaderId.set(header.hash, newHeader.headerId)
          data.tipHeaderId = newHeader.headerId
          return {
            added: true,
            dupe,
            isActiveTip: true,
            reorgDepth,
            priorTip,
            noPrev,
            badPrev,
            noActiveAncestor,
            noTip
          }
        }
        noPrev = true
        return {
          added: false,
          dupe,
          isActiveTip: false,
          reorgDepth,
          priorTip,
          noPrev,
          badPrev,
          noActiveAncestor,
          noTip
        }
      }
      noPrev = true
      return { added: false, dupe, isActiveTip: false, reorgDepth, priorTip, noPrev, badPrev, noActiveAncestor, noTip }
    }

    if (oneBack.height + 1 !== header.height) {
      badPrev = true
      return { added: false, dupe, isActiveTip: false, reorgDepth, priorTip, noPrev, badPrev, noActiveAncestor, noTip }
    }

    const chainWork = addWork(oneBack.chainWork, convertBitsToWork(header.bits))
    let tip =
      oneBack.isActive && oneBack.isChainTip
        ? oneBack
        : Array.from(data.liveHeaders.values()).find(h => h.isActive && h.isChainTip)

    if (!tip) {
      noTip = true
      return { added: false, dupe, isActiveTip: false, reorgDepth, priorTip, noPrev, badPrev, noActiveAncestor, noTip }
    }

    priorTip = tip
    setActiveChainTip = isMoreWork(chainWork, tip.chainWork)

    const newHeader = {
      ...header,
      headerId: ++data.maxHeaderId,
      previousHeaderId: oneBack === prev ? null : oneBack.headerId,
      chainWork,
      isChainTip: setActiveChainTip,
      isActive: setActiveChainTip
    }

    if (setActiveChainTip) {
      let activeAncestor = oneBack
      while (!activeAncestor.isActive) {
        const previousHeader = data.liveHeaders.get(activeAncestor.previousHeaderId!)
        if (!previousHeader) {
          noActiveAncestor = true
          return {
            added: false,
            dupe,
            isActiveTip: false,
            reorgDepth,
            priorTip,
            noPrev,
            badPrev,
            noActiveAncestor,
            noTip
          }
        }
        activeAncestor = previousHeader
      }

      if (!(oneBack.isActive && oneBack.isChainTip)) {
        reorgDepth = Math.min(priorTip.height, header.height) - activeAncestor.height
      }

      if (activeAncestor.headerId !== oneBack.headerId) {
        let headerToDeactivate = Array.from(data.liveHeaders.values()).find(h => h.isChainTip && h.isActive)
        while (headerToDeactivate && headerToDeactivate.headerId !== activeAncestor.headerId) {
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

    if (oneBack.isChainTip && oneBack !== prev) {
      data.liveHeaders.set(oneBack.headerId, { ...oneBack, isChainTip: false })
    }

    data.liveHeaders.set(newHeader.headerId, newHeader)
    data.hashToHeaderId.set(newHeader.hash, newHeader.headerId)
    if (setActiveChainTip) {
      data.tipHeaderId = newHeader.headerId
      this.pruneLiveBlockHeaders(newHeader.height)
    }

    return {
      added: ok,
      dupe,
      isActiveTip: setActiveChainTip,
      reorgDepth,
      priorTip,
      noPrev,
      badPrev,
      noActiveAncestor,
      noTip
    }
  }
}
