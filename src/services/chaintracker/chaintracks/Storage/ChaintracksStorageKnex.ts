import { Knex } from 'knex'
import { ChaintracksKnexMigrations } from './ChaintracksKnexMigrations'
import { InsertHeaderResult, ChaintracksStorageBaseOptions } from '../Api/ChaintracksStorageApi'
import { ChaintracksStorageBase } from '../Base/ChaintracksStorageBase'
import { Chain, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../../../sdk'
import { BaseBlockHeader, BlockHeader, LiveBlockHeader } from '../Api/BlockHeaderApi'
import {
  addWork,
  blockHash,
  convertBitsToWork,
  isMoreWork,
  serializeBaseBlockHeader
} from '../util/blockHeaderUtilities'
import { verifyOneOrNone } from '../../../../utility/utilityHelpers'
import { DBType } from '../../../../storage/StorageReader'
import { determineDBType } from '../../../../index.all'
import { BulkHeaderFileInfo, BulkHeaderFilesInfo } from '../util/BulkHeaderFile'
import { HeightRange } from '../util/HeightRange'
import { BulkFilesReaderStorage } from '../util/BulkFilesReader'
import { ChaintracksFetch } from '../util/ChaintracksFetch'
import { ChaintracksStorageBulkFileApi } from '../Api/ChaintracksStorageApi'

export interface ChaintracksStorageKnexOptions extends ChaintracksStorageBaseOptions {
  /**
   * Required.
   *
   * Knex.js database interface initialized with valid connection configuration.
   */
  knex: Knex | undefined
  /**
   * Required.
   *
   * The table name for live block headers.
   */
  headerTableName: string
  /**
   * Required.
   *
   * The table name for the block header hash to height index.
   */
  bulkBlockHashTableName: string
  /**
   * Required.
   *
   * The table name for the block header merkleRoot to height index.
   */
  bulkMerkleRootTableName: string
}

/**
 * Implements the ChaintracksStorageApi using Knex.js for both MySql and Sqlite support.
 * Also see `chaintracksStorageMemory` which leverages Knex support for an in memory database.
 */
export class ChaintracksStorageKnex extends ChaintracksStorageBase implements ChaintracksStorageBulkFileApi {
  static createStorageKnexOptions(chain: Chain, knex?: Knex): ChaintracksStorageKnexOptions {
    const options: ChaintracksStorageKnexOptions = {
      ...ChaintracksStorageBase.createStorageBaseOptions(chain),
      knex,
      headerTableName: `live_headers`,
      bulkBlockHashTableName: `bulk_hash`,
      bulkMerkleRootTableName: `bulk_merkle`
    }
    return options
  }

  knex: Knex
  _dbtype?: DBType
  headerTableName: string
  bulkFilesTableName: string = 'bulk_files'
  bulkBlockHashTableName: string
  bulkMerkleRootTableName: string

  constructor(options: ChaintracksStorageKnexOptions) {
    super(options)
    if (!options.knex) throw new Error('The knex options property is required.')
    this.knex = options.knex
    this.headerTableName = options.headerTableName
    this.bulkBlockHashTableName = options.bulkBlockHashTableName
    this.bulkMerkleRootTableName = options.bulkMerkleRootTableName
  }

  get dbtype(): DBType {
    if (!this._dbtype) throw new WERR_INVALID_OPERATION('must call makeAvailable first')
    return this._dbtype
  }

  override async shutdown(): Promise<void> {
    try {
      await this.knex.destroy()
    } catch {
      /* ignore */
    }
  }

  override async makeAvailable(): Promise<void> {
    if (this.isAvailable && this.hasMigrated) return
    // Not a base class policy, but we want to ensure migrations are run before getting to business.
    if (!this.hasMigrated) {
      await this.migrateLatest()
    }
    if (!this.isAvailable) {
      this._dbtype = await determineDBType(this.knex)
      await super.makeAvailable()
    }
  }

  override async migrateLatest(): Promise<void> {
    if (this.hasMigrated) return
    await this.knex.migrate.latest({ migrationSource: new ChaintracksKnexMigrations(this.chain) })
    await super.migrateLatest()
  }

  override async dropAllData(): Promise<void> {
    // Only using migrations to migrate down, don't need valid properties for settings table.
    const config = {
      migrationSource: new ChaintracksKnexMigrations('test')
    }
    const count = Object.keys(config.migrationSource.migrations).length
    for (let i = 0; i < count; i++) {
      try {
        const r = await this.knex.migrate.down(config)
        if (!r) {
          console.error(`Migration returned falsy result await this.knex.migrate.down(config)`)
          break
        }
      } catch (eu: unknown) {
        break
      }
    }
    this.hasMigrated = false
    await super.dropAllData()
  }

  override async destroy(): Promise<void> {
    await this.knex.destroy()
  }

  async findLiveHeightRange(): Promise<{ minHeight: number; maxHeight: number }> {
    const maxHeight = (await this.findChainTipHeader()).height

    const [resultrow] = await this.knex(this.headerTableName).min('height as minHeight')
    return { minHeight: resultrow.minHeight, maxHeight }
  }

  async findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader> {
    const [header] = await this.knex<LiveBlockHeader>(this.headerTableName).where({ headerId: headerId })
    if (!header) throw new Error(`HeaderId ${headerId} not found in live header database.`)
    return header
  }

  async findChainTipHeader(): Promise<LiveBlockHeader> {
    const [tip] = await this.knex<LiveBlockHeader>(this.headerTableName).where({ isActive: true, isChainTip: true })
    if (!tip) throw new Error('Database contains no active chain tip header.')
    return tip
  }

  async findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined> {
    const [tip] = await this.knex<LiveBlockHeader>(this.headerTableName).where({ isActive: true, isChainTip: true })
    return tip
  }

  async findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null> {
    const [header] = await this.knex<LiveBlockHeader>(this.headerTableName).where({ height: height, isActive: true })
    return header ? header : null
  }

  async findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null> {
    const [header] = await this.knex<LiveBlockHeader>(this.headerTableName).where({ hash: hash })
    const result = header ? header : null
    return result
  }

  async findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null> {
    const [header] = await this.knex<LiveBlockHeader>(this.headerTableName).where({ merkleRoot: merkleRoot })
    return header
  }

  async deleteBulkFile(fileId: number): Promise<number> {
    const count = await this.knex(this.bulkFilesTableName).where({ fileId: fileId }).del()
    return count
  }

  async insertBulkFile(file: BulkHeaderFileInfo): Promise<number> {
    if (!file.fileId) delete file.fileId
    const [id] = await this.knex(this.bulkFilesTableName).insert(file)
    file.fileId = id
    return id
  }
  async updateBulkFile(fileId: number, file: BulkHeaderFileInfo): Promise<number> {
    const n = await this.knex(this.bulkFilesTableName).where({ fileId: fileId }).update(file)
    return n
  }
  async getBulkFiles(): Promise<BulkHeaderFileInfo[]> {
    const files = await this.knex<BulkHeaderFileInfo>(this.bulkFilesTableName)
      .select(
        'fileId',
        'chain',
        'fileName',
        'firstHeight',
        'count',
        'prevHash',
        'lastHash',
        'fileHash',
        'prevChainWork',
        'lastChainWork',
        'validated',
        'sourceUrl'
      )
      .orderBy('firstHeight', 'asc')
    return files
  }

  dbTypeSubstring(source: string, fromOffset: number, forLength?: number) {
    if (this.dbtype === 'MySQL') return `substring(${source} from ${fromOffset} for ${forLength!})`
    return `substr(${source}, ${fromOffset}, ${forLength})`
  }

  async getBulkFileData(fileId: number, offset?: number, length?: number): Promise<Uint8Array | undefined> {
    await this.makeAvailable()
    if (!Number.isInteger(fileId)) throw new WERR_INVALID_PARAMETER('fileId', 'a valid, integer bulk_files fileId')
    let data: Uint8Array | undefined = undefined
    if (Number.isInteger(offset) && Number.isInteger(length)) {
      let rs: { data: Buffer | null }[] = await this.knex.raw(
        `select ${this.dbTypeSubstring('data', offset! + 1, length)} as data from ${this.bulkFilesTableName} where fileId = '${fileId}'`
      )
      if (this.dbtype === 'MySQL') rs = (rs as unknown as { data: Buffer | null }[][])[0]
      const r = verifyOneOrNone(rs)
      if (r && r.data) {
        data = Uint8Array.from(r.data)
      }
    } else {
      const r = verifyOneOrNone(await this.knex(this.bulkFilesTableName).where({ fileId: fileId }).select('data'))
      if (r.data) data = Uint8Array.from(r.data)
    }
    return data
  }

  /**
   * @param header Header to attempt to add to live storage.
   * @returns details of conditions found attempting to insert header
   */
  async insertHeader(header: BlockHeader): Promise<InsertHeaderResult> {
    const table = this.headerTableName

    let ok = true
    let dupe = false
    let noPrev = false
    let badPrev = false
    let noActiveAncestor = false
    let noTip = false
    let setActiveChainTip = false
    let reorgDepth = 0
    let priorTip: LiveBlockHeader | undefined

    ok = await this.knex.transaction(async trx => {
      /*
              We ensure the header does not already exist. This needs to be done
              inside the transaction to avoid inserting multiple headers. If an
              identical header is found, there is no need to insert a new header.
            */
      const [dupeCheck] = await trx(table).where({ hash: header.hash }).count()
      if (dupeCheck['count(*)']) {
        dupe = true
        return false
      }

      // This is the existing previous header to the one being inserted...
      let [oneBack] = await trx<LiveBlockHeader>(table).where({ hash: header.previousHash })

      if (!oneBack) {
        // Check if this is first live header...
        const r = await trx(table).count()
        const count = Number(r[0]['count(*)'])
        if (count === 0) {
          const lbf = await this.bulkManager.getLastFile()
          if (!lbf) throw new WERR_INVALID_OPERATION('bulk headers must exist before first live header can be added')
          if (header.previousHash === lbf.lastHash && header.height === lbf.firstHeight + lbf.count) {
            const chainWork = addWork(lbf.lastChainWork, convertBitsToWork(header.bits))
            const newHeader = {
              ...header,
              previousHeaderId: null,
              chainWork,
              isChainTip: true,
              isActive: true
            }
            await trx<LiveBlockHeader>(table).insert(newHeader)
            return true
          }
        }
        // Never add a header that doesn't extend existing headers.
        // Or one that's confused about its height.
        noPrev = true
        return false
      }
      if (oneBack.height + 1 != header.height) {
        badPrev = true
        return false
      }

      const chainWork = addWork(oneBack.chainWork, convertBitsToWork(header.bits))

      let tip: LiveBlockHeader | undefined
      if (oneBack.isActive && oneBack.isChainTip) {
        tip = oneBack
      } else {
        ;[tip] = await trx<LiveBlockHeader>(table).where({ isActive: true, isChainTip: true })
      }

      if (!tip) {
        noTip = true
        return false
      }

      priorTip = tip

      setActiveChainTip = isMoreWork(chainWork, tip.chainWork)

      const newHeader = {
        ...header,
        previousHeaderId: oneBack.headerId,
        chainWork,
        isChainTip: setActiveChainTip,
        isActive: setActiveChainTip
      }

      if (setActiveChainTip) {
        // Find newHeader's first active ancestor
        let activeAncestor = oneBack
        while (!activeAncestor.isActive) {
          const [previousHeader] = await trx<LiveBlockHeader>(table).where({
            headerId: activeAncestor.previousHeaderId || -1
          })
          if (!previousHeader) {
            noActiveAncestor = true
            return false
          }
          activeAncestor = previousHeader
        }

        if (!(oneBack.isActive && oneBack.isChainTip))
          // If this is the new active chain tip, and oneBack was not, this is a reorg.
          reorgDepth = Math.min(priorTip.height, header.height) - activeAncestor.height

        if (activeAncestor.headerId !== oneBack.headerId) {
          // Deactivate headers from the current active chain tip up to but excluding our activeAncestor:
          let [headerToDeactivate] = await trx<LiveBlockHeader>(table).where({ isChainTip: true, isActive: true })
          while (headerToDeactivate.headerId !== activeAncestor.headerId) {
            // Headers are deactivated until we reach the activeAncestor
            await trx<LiveBlockHeader>(table)
              .where({ headerId: headerToDeactivate.headerId })
              .update({ isActive: false })
            const [previousHeader] = await trx<LiveBlockHeader>(table).where({
              headerId: headerToDeactivate.previousHeaderId || -1
            })
            headerToDeactivate = previousHeader
          }

          // The first header to activate is one before the one we are about to insert
          let headerToActivate = oneBack
          while (headerToActivate.headerId !== activeAncestor.headerId) {
            // Headers are activated until we reach the active ancestor
            await trx<LiveBlockHeader>(table).where({ headerId: headerToActivate.headerId }).update({ isActive: true })
            const [previousHeader] = await trx<LiveBlockHeader>(table).where({
              headerId: headerToActivate.previousHeaderId || -1
            })
            headerToActivate = previousHeader
          }
        }
      }

      if (oneBack.isChainTip) {
        await trx<LiveBlockHeader>(table).where({ headerId: oneBack.headerId }).update({ isChainTip: false })
      }

      await trx<LiveBlockHeader>(table).insert(newHeader)

      return true
    })

    if (ok && setActiveChainTip) this.pruneLiveBlockHeaders(header.height)

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

  async findMaxHeaderId(): Promise<number> {
    return ((await this.knex(this.headerTableName).max('headerId as v')).pop()?.v as number) || -1
    //const [resultrow] = await this.knex(this.headerTableName).max('headerId as maxHeaderId')
    //return resultrow?.maxHeaderId || 0
  }

  async getLiveHeightRange(): Promise<HeightRange> {
    return new HeightRange(
      ((await this.knex(this.headerTableName).where({ isActive: true }).min('height as v')).pop()?.v as number) || 0,
      ((await this.knex(this.headerTableName).where({ isActive: true }).max('height as v')).pop()?.v as number) || -1
    )
  }

  async appendToIndexTable(table: string, index: string, buffers: string[], minHeight: number): Promise<void> {
    const newRows: { height: number }[] = []
    for (let i = 0; i < buffers.length; i++) {
      const row = { height: minHeight + i }
      row[index] = buffers[i]
      newRows.push(row)
    }
    try {
      await this.knex.batchInsert(table, newRows, newRows.length)
      return
    } catch (err: unknown) {
      if ((err as { code: string })?.code !== 'ER_DUP_ENTRY') throw err
    }

    // If the batchInsert failed, we may be recovering from an earlier failure. Try inserting one at a time and ignore duplicate hash values.
    for (let i = 0; i < newRows.length; i++) {
      await this.knex(this.bulkBlockHashTableName).insert(newRows[i]).onConflict(index).ignore()
    }
  }

  async appendToIndexTableChunked(
    table: string,
    index: string,
    buffers: string[],
    minHeight: number,
    chunkSize: number
  ): Promise<void> {
    let remaining = buffers.length
    while (remaining > 0) {
      const size = Math.min(remaining, chunkSize)
      const chunk = buffers.slice(0, size)
      buffers = buffers.slice(size)
      await this.appendToIndexTable(table, index, chunk, minHeight)
      console.log(`Appended ${size} index records to ${index} table`)
      remaining -= size
      minHeight += size
    }
  }

  override async deleteLiveBlockHeaders(): Promise<void> {
    const table = this.headerTableName
    await this.knex.transaction(async trx => {
      await trx<LiveBlockHeader>(table).update({ previousHeaderId: null })
      await trx<LiveBlockHeader>(table).del()
    })
  }

  override async deleteBulkBlockHeaders(): Promise<void> {
    const table = this.bulkFilesTableName
    await this.knex.transaction(async trx => {
      await trx<BulkHeaderFileInfo>(table).del()
    })
  }

  async deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number> {
    return this.knex.transaction(async trx => {
      try {
        const tableName = this.headerTableName
        await trx(tableName)
          .whereIn('previousHeaderId', function () {
            this.select('headerId').from(tableName).where('height', '<=', maxHeight)
          })
          .update({ previousHeaderId: null })

        const deletedCount = await trx(tableName).where('height', '<=', maxHeight).del()

        // Commit transaction
        await trx.commit()
        return deletedCount
      } catch (error) {
        // Rollback on error
        await trx.rollback()
        throw error
      }
    })
  }

  async getHeaders(height: number, count: number): Promise<number[]> {
    if (count <= 0) return []

    const headers = await this.knex<LiveBlockHeader>(this.headerTableName)
      .where({ isActive: true })
      .andWhere('height', '>=', height)
      .andWhere('height', '<', height + count)
      .limit(count)
      .orderBy('height')

    const bufs: Uint8Array[] = []

    if (headers.length === 0 || headers[0].height > height) {
      // Some or all headers requested are in bulk storage...
      // There may be some overlap between bulk and live, headers are only
      // deleted from live after they have been added to bulk.
      // Only get what is needed.
      const bulkCount = headers.length === 0 ? count : headers[0].height - height
      const range = new HeightRange(height, height + bulkCount - 1)
      const reader = await BulkFilesReaderStorage.fromStorage(this, new ChaintracksFetch(), range, bulkCount * 80)
      const bulkData = await reader.read()
      if (bulkData) bufs.push(bulkData)
    }

    if (headers.length > 0) {
      // Some or all headers requested were in live storage...
      let buf = new Uint8Array(headers.length * 80)
      for (let i = 0; i < headers.length; i++) {
        const h = headers[i]
        const ha = serializeBaseBlockHeader(h)
        buf.set(ha, i * 80)
      }
      bufs.push(buf)
    }

    const r = [bufs.length * 80]
    let i = 0
    for (const bh of bufs) {
      for (const b of bh) {
        r[i++] = b
      }
    }
    return r
  }

  concatSerializedHeaders(bufs: number[][]): number[] {
    const r: number[] = [bufs.length * 80]
    for (const bh of bufs) {
      for (const b of bh) {
        r.push(b)
      }
    }
    return r
  }

  async liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]> {
    const headers = await this.knex<LiveBlockHeader>(this.headerTableName)
      .where({ isActive: true })
      .limit(count)
      .orderBy('height')
    return headers
  }
}
