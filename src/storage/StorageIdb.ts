import { deleteDB, IDBPCursorWithValue, IDBPDatabase, IDBPTransaction, openDB } from 'idb'
import { ListActionsResult, ListOutputsResult } from '@bsv/sdk'
import {
  sdk,
  TableCertificate,
  TableCertificateField,
  TableCertificateX,
  TableCommission,
  TableMonitorEvent,
  TableOutput,
  TableOutputBasket,
  TableOutputTag,
  TableOutputTagMap,
  TableOutputX,
  TableProvenTx,
  TableProvenTxReq,
  TableSettings,
  TableSyncState,
  TableTransaction,
  TableTxLabel,
  TableTxLabelMap,
  TableUser,
  verifyOne,
  verifyOneOrNone,
  verifyTruthy
} from '../index.client'
import { StorageProvider, StorageProviderOptions } from './StorageProvider'
import { StorageIdbSchema } from './schema/StorageIdbSchema'
import { DBType } from './StorageReader'
import { TransactionStatus } from '../sdk'
import { listActionsIdb } from './methods/listActionsIdb'

export interface StorageIdbOptions extends StorageProviderOptions {}

export class StorageIdb extends StorageProvider implements sdk.WalletStorageProvider {
  dbName: string
  db?: IDBPDatabase<StorageIdbSchema>

  constructor(options: StorageIdbOptions) {
    super(options)
    this.dbName = `wallet-toolbox-${this.chain}net`
  }

  /**
   * This method must be called at least once before any other method accesses the database,
   * and each time the schema may have updated.
   *
   * If the database has already been created in this context, `storageName` and `storageIdentityKey`
   * are ignored.
   *
   * @param storageName
   * @param storageIdentityKey
   * @returns
   */
  async migrate(storageName: string, storageIdentityKey: string): Promise<string> {
    const db = await this.verifyDB(storageName, storageIdentityKey)
    return db.version.toString()
  }

  /**
   * Following initial database initialization, this method verfies that db is ready for use.
   *
   * @throws `WERR_INVALID_OPERATION` if the database has not been initialized by a call to `migrate`.
   *
   * @param storageName
   * @param storageIdentityKey
   *
   * @returns
   */
  async verifyDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> {
    if (this.db) return this.db
    this.db = await this.initDB(storageName, storageIdentityKey)
    this._settings = (await this.db.getAll('settings'))[0]
    this.whenLastAccess = new Date()
    return this.db
  }

  /**
   * Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
   * or a Knex.Transaction as appropriate.
   */
  toDbTrx(
    stores: string[],
    mode: 'readonly' | 'readwrite',
    trx?: sdk.TrxToken
  ): IDBPTransaction<StorageIdbSchema, string[], 'readwrite' | 'readonly'> {
    if (trx) {
      const t = trx as IDBPTransaction<StorageIdbSchema, string[], 'readwrite' | 'readonly'>
      return t
    } else {
      if (!this.db) throw new Error('not initialized')
      const db = this.db
      const trx = db.transaction(stores || this.allStores, mode || 'readwrite')
      this.whenLastAccess = new Date()
      return trx
    }
  }

  /**
   * Called by `makeAvailable` to return storage `TableSettings`.
   * Since this is the first async method that must be called by all clients,
   * it is where async initialization occurs.
   *
   * After initialization, cached settings are returned.
   *
   * @param trx
   */
  async readSettings(trx?: sdk.TrxToken): Promise<TableSettings> {
    await this.verifyDB()
    return this._settings!
  }

  async initDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> {
    const chain = this.chain
    const maxOutputScript = 1024
    const db = await openDB<StorageIdbSchema>(this.dbName, 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains('proven_txs')) {
          // proven_txs object store
          const provenTxsStore = db.createObjectStore('proven_txs', {
            keyPath: 'provenTxId',
            autoIncrement: true
          })
          provenTxsStore.createIndex('txid', 'txid', { unique: true })
        }

        if (!db.objectStoreNames.contains('proven_tx_reqs')) {
          // proven_tx_reqs object store
          const provenTxReqsStore = db.createObjectStore('proven_tx_reqs', {
            keyPath: 'provenTxReqId',
            autoIncrement: true
          })
          provenTxReqsStore.createIndex('provenTxId', 'provenTxId')
          provenTxReqsStore.createIndex('txid', 'txid', { unique: true })
          provenTxReqsStore.createIndex('status', 'status')
          provenTxReqsStore.createIndex('batch', 'batch')
        }
        if (!db.objectStoreNames.contains('users')) {
          const users = db.createObjectStore('users', {
            keyPath: 'userId',
            autoIncrement: true
          })
          users.createIndex('identityKey', 'identityKey', { unique: true })
        }
        if (!db.objectStoreNames.contains('certificates')) {
          // certificates object store
          const certificatesStore = db.createObjectStore('certificates', {
            keyPath: 'certificateId',
            autoIncrement: true
          })
          certificatesStore.createIndex('userId', 'userId')
          certificatesStore.createIndex(
            'userId_type_certifier_serialNumber',
            ['userId', 'type', 'certifier', 'serialNumber'],
            { unique: true }
          )
        }

        if (!db.objectStoreNames.contains('certificate_fields')) {
          // certificate_fields object store
          const certificateFieldsStore = db.createObjectStore('certificate_fields', {
            keyPath: ['certificateId', 'fieldName'] // Composite key
          })
          certificateFieldsStore.createIndex('userId', 'userId')
          certificateFieldsStore.createIndex('certificateId', 'certificateId')
        }

        if (!db.objectStoreNames.contains('output_baskets')) {
          // output_baskets object store
          const outputBasketsStore = db.createObjectStore('output_baskets', {
            keyPath: 'basketId',
            autoIncrement: true
          })
          outputBasketsStore.createIndex('userId', 'userId')
          outputBasketsStore.createIndex('name_userId', ['name', 'userId'], { unique: true })
        }

        if (!db.objectStoreNames.contains('transactions')) {
          // transactions object store
          const transactionsStore = db.createObjectStore('transactions', {
            keyPath: 'transactionId',
            autoIncrement: true
          })
          transactionsStore.createIndex('userId', 'userId')
          transactionsStore.createIndex('status', 'status'),
            transactionsStore.createIndex('status_userId', ['status', 'userId'])
          transactionsStore.createIndex('provenTxId', 'provenTxId')
          transactionsStore.createIndex('reference', 'reference', { unique: true })
        }

        if (!db.objectStoreNames.contains('commissions')) {
          // commissions object store
          const commissionsStore = db.createObjectStore('commissions', {
            keyPath: 'commissionId',
            autoIncrement: true
          })
          commissionsStore.createIndex('userId', 'userId')
          commissionsStore.createIndex('transactionId', 'transactionId', { unique: true })
        }

        if (!db.objectStoreNames.contains('outputs')) {
          // outputs object store
          const outputsStore = db.createObjectStore('outputs', {
            keyPath: 'outputId',
            autoIncrement: true
          })
          outputsStore.createIndex('userId', 'userId')
          outputsStore.createIndex('transactionId', 'transactionId')
          outputsStore.createIndex('basketId', 'basketId')
          outputsStore.createIndex('spentBy', 'spentBy')
          outputsStore.createIndex('transactionId_vout_userId', ['transactionId', 'vout', 'userId'], { unique: true })
        }

        if (!db.objectStoreNames.contains('output_tags')) {
          // output_tags object store
          const outputTagsStore = db.createObjectStore('output_tags', {
            keyPath: 'outputTagId',
            autoIncrement: true
          })
          outputTagsStore.createIndex('userId', 'userId')
          outputTagsStore.createIndex('tag_userId', ['tag', 'userId'], { unique: true })
        }

        if (!db.objectStoreNames.contains('output_tags_map')) {
          // output_tags_map object store
          const outputTagsMapStore = db.createObjectStore('output_tags_map', {
            keyPath: ['outputTagId', 'outputId']
          })
          outputTagsMapStore.createIndex('outputTagId', 'outputTagId')
          outputTagsMapStore.createIndex('outputId', 'outputId')
        }

        if (!db.objectStoreNames.contains('tx_labels')) {
          // tx_labels object store
          const txLabelsStore = db.createObjectStore('tx_labels', {
            keyPath: 'txLabelId',
            autoIncrement: true
          })
          txLabelsStore.createIndex('userId', 'userId')
          txLabelsStore.createIndex('label_userId', ['label', 'userId'], { unique: true })
        }

        if (!db.objectStoreNames.contains('tx_labels_map')) {
          // tx_labels_map object store
          const txLabelsMapStore = db.createObjectStore('tx_labels_map', {
            keyPath: ['txLabelId', 'transactionId']
          })
          txLabelsMapStore.createIndex('txLabelId', 'txLabelId')
          txLabelsMapStore.createIndex('transactionId', 'transactionId')
        }

        if (!db.objectStoreNames.contains('monitor_events')) {
          // monitor_events object store
          const monitorEventsStore = db.createObjectStore('monitor_events', {
            keyPath: 'id',
            autoIncrement: true
          })
        }

        if (!db.objectStoreNames.contains('sync_states')) {
          // sync_states object store
          const syncStatesStore = db.createObjectStore('sync_states', {
            keyPath: 'syncStateId',
            autoIncrement: true
          })
          syncStatesStore.createIndex('userId', 'userId')
          syncStatesStore.createIndex('refNum', 'refNum', { unique: true })
          syncStatesStore.createIndex('status', 'status')
        }

        if (!db.objectStoreNames.contains('settings')) {
          if (!storageName || !storageIdentityKey) {
            throw new sdk.WERR_INVALID_OPERATION('migrate must be called before first access')
          }
          const settings = db.createObjectStore('settings', {
            keyPath: 'storageIdentityKey'
          })
          const s: TableSettings = {
            created_at: new Date(),
            updated_at: new Date(),
            storageIdentityKey,
            storageName,
            chain,
            dbtype: 'IndexedDB',
            maxOutputScript
          }
          settings.put(s)
        }
      }
    })
    return db
  }

  //
  // StorageProvider abstract methods
  //

  async reviewStatus(args: { agedLimit: Date; trx?: sdk.TrxToken }): Promise<{ log: string }> {
    throw new Error('Method not implemented.')
  }

  async purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> {
    throw new Error('Method not implemented.')
  }

  /**
   * Proceeds in three stages:
   * 1. Find an output that exactly funds the transaction (if exactSatoshis is not undefined).
   * 2. Find an output that overfunds by the least amount (targetSatoshis).
   * 3. Find an output that comes as close to funding as possible (targetSatoshis).
   * 4. Return undefined if no output is found.
   *
   * Outputs must belong to userId and basketId and have spendable true.
   * Their corresponding transaction must have status of 'completed', 'unproven', or 'sending' (if excludeSending is false).
   *
   * @param userId
   * @param basketId
   * @param targetSatoshis
   * @param exactSatoshis
   * @param excludeSending
   * @param transactionId
   * @returns next funding output to add to transaction or undefined if there are none.
   */
  async allocateChangeInput(
    userId: number,
    basketId: number,
    targetSatoshis: number,
    exactSatoshis: number | undefined,
    excludeSending: boolean,
    transactionId: number
  ): Promise<TableOutput | undefined> {
    const dbTrx = this.toDbTrx(['outputs', 'transactions'], 'readwrite')
    try {
      const txStatus: TransactionStatus[] = ['completed', 'unproven']
      if (!excludeSending) txStatus.push('sending')
      const args: sdk.FindOutputsArgs = {
        partial: { userId, basketId, spendable: true },
        txStatus,
        trx: dbTrx
      }
      const outputs = await this.findOutputs(args)
      let output: TableOutput | undefined
      let scores: { output: TableOutput; score: number }[] = []
      for (const o of outputs) {
        if (exactSatoshis && o.satoshis === exactSatoshis) {
          output = o
          break
        }
        const score = o.satoshis - targetSatoshis
        scores.push({ output: o, score })
      }
      if (!output) {
        // sort scores increasing by score property
        scores = scores.sort((a, b) => a.score - b.score)
        // find the first score that is greater than or equal to 0
        const o = scores.find(s => s.score >= 0)
        if (o) {
          // stage 2 satisfied (minimally funded)
          output = o.output
        } else if (scores.length > 0) {
          // stage 3 satisfied (minimally under-funded)
          output = scores.slice(-1)[0].output
        } else {
          // no available funding outputs
          output = undefined
        }
      }
      if (output) {
        // mark output as spent by transactionId
        await this.updateOutput(output.outputId, { spendable: false, spentBy: transactionId }, dbTrx)
      }
      return output
    } finally {
      await dbTrx.done
    }
  }

  async getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx> {
    const r: sdk.ProvenOrRawTx = {
      proven: undefined,
      rawTx: undefined,
      inputBEEF: undefined
    }

    r.proven = verifyOneOrNone(await this.findProvenTxs({ partial: { txid: txid }, trx }))
    if (!r.proven) {
      const req = verifyOneOrNone(await this.findProvenTxReqs({ partial: { txid: txid }, trx }))
      if (req && ['unsent', 'unmined', 'unconfirmed', 'sending', 'nosend', 'completed'].includes(req.status)) {
        r.rawTx = req.rawTx
        r.inputBEEF = req.inputBEEF
      }
    }

    return r
  }

  async getRawTxOfKnownValidTransaction(
    txid?: string,
    offset?: number,
    length?: number,
    trx?: sdk.TrxToken
  ): Promise<number[] | undefined> {
    if (!txid) return undefined
    if (!this.isAvailable()) await this.makeAvailable()

    let rawTx: number[] | undefined = undefined
    const r = await this.getProvenOrRawTx(txid, trx)
    if (r.proven) rawTx = r.proven.rawTx
    else rawTx = r.rawTx
    if (rawTx && offset !== undefined && length !== undefined && Number.isInteger(offset) && Number.isInteger(length)) {
      rawTx = rawTx.slice(offset, offset + length)
    }
    return rawTx
  }

  async getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<TableTxLabel[]> {
    const maps = await this.findTxLabelMaps({ partial: { transactionId, isDeleted: false }, trx })
    const labelIds = maps.map(m => m.txLabelId)
    const labels: TableTxLabel[] = []
    for (const txLabelId of labelIds) {
      const label = verifyOne(await this.findTxLabels({ partial: { txLabelId, isDeleted: false }, trx }))
      labels.push(label)
    }
    return labels
  }

  async getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<TableOutputTag[]> {
    const maps = await this.findOutputTagMaps({ partial: { outputId, isDeleted: false }, trx })
    const tagIds = maps.map(m => m.outputTagId)
    const tags: TableOutputTag[] = []
    for (const outputTagId of tagIds) {
      const tag = verifyOne(await this.findOutputTags({ partial: { outputTagId, isDeleted: false }, trx }))
      tags.push(tag)
    }
    return tags
  }

  async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> {
    if (!auth.userId) throw new sdk.WERR_UNAUTHORIZED()
    return await listActionsIdb(this, auth, vargs)
  }

  async listOutputs(auth: sdk.AuthId, args: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> {
    throw new Error('Method not implemented.')
  }

  async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> {
    const txStatus: sdk.TransactionStatus[] = ['completed', 'unproven']
    if (!excludeSending) txStatus.push('sending')
    const args: sdk.FindOutputsArgs = { partial: { userId, basketId }, txStatus }
    let count = 0
    await this.filterOutputs(args, r => {
      count++
    })
    return count
  }

  async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    if (!auth.userId || (args.partial.userId && args.partial.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    args.partial.userId = auth.userId
    return await this.findCertificates(args)
  }
  async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    if (!auth.userId || (args.partial.userId && args.partial.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    args.partial.userId = auth.userId
    return await this.findOutputBaskets(args)
  }
  async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    if (!auth.userId || (args.partial.userId && args.partial.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    args.partial.userId = auth.userId
    return await this.findOutputs(args)
  }

  async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> {
    if (!auth.userId || (certificate.userId && certificate.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    certificate.userId = auth.userId
    return await this.insertCertificate(certificate)
  }

  //
  // StorageReaderWriter abstract methods
  //

  async dropAllData(): Promise<void> {
    await deleteDB(this.dbName)
  }

  async filterOutputTagMaps(
    args: sdk.FindOutputTagMapsArgs,
    filtered: (v: TableOutputTagMap) => void,
    userId?: number
  ): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['output_tags_map'], 'readonly', args.trx)
    let cursor:
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'output_tags_map', unknown, 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'output_tags_map', 'outputTagId', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'output_tags_map', 'outputId', 'readwrite' | 'readonly'>
      | null
    if (args.partial?.outputTagId !== undefined) {
      cursor = await dbTrx.objectStore('output_tags_map').index('outputTagId').openCursor(args.partial.outputTagId)
    } else if (args.partial?.outputId !== undefined) {
      cursor = await dbTrx.objectStore('output_tags_map').index('outputId').openCursor(args.partial.outputId)
    } else {
      cursor = await dbTrx.objectStore('output_tags_map').openCursor()
    }
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.tagIds && !args.tagIds.includes(r.outputTagId)) continue
      if (args.partial) {
        if (args.partial.outputTagId && r.outputTagId !== args.partial.outputTagId) continue
        if (args.partial.outputId && r.outputId !== args.partial.outputId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.isDeleted !== undefined && r.isDeleted !== args.partial.isDeleted) continue
      }
      if (userId !== undefined && r.txid) {
        const count = await this.countOutputTags({ partial: { userId, outputTagId: r.outputTagId }, trx: args.trx })
        if (count === 0) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> {
    const results: TableOutputTagMap[] = []
    await this.filterOutputTagMaps(args, r => {
      results.push(this.validateEntity(r))
    })
    return results
  }

  async filterProvenTxReqs(
    args: sdk.FindProvenTxReqsArgs,
    filtered: (v: TableProvenTxReq) => void,
    userId?: number
  ): Promise<void> {
    if (args.partial.rawTx)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.rawTx',
        `undefined. ProvenTxReqs may not be found by rawTx value.`
      )
    if (args.partial.inputBEEF)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.inputBEEF',
        `undefined. ProvenTxReqs may not be found by inputBEEF value.`
      )
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['proven_tx_reqs'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('proven_tx_reqs').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.provenTxReqId && r.provenTxReqId !== args.partial.provenTxReqId) continue
        if (args.partial.provenTxId && r.provenTxId !== args.partial.provenTxId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.status && r.status !== args.partial.status) continue
        if (args.partial.attempts !== undefined && r.attempts !== args.partial.attempts) continue
        if (args.partial.notified !== undefined && r.notified !== args.partial.notified) continue
        if (args.partial.txid && r.txid !== args.partial.txid) continue
        if (args.partial.batch && r.batch !== args.partial.batch) continue
        if (args.partial.history && r.history !== args.partial.history) continue
        if (args.partial.notify && r.notify !== args.partial.notify) continue
      }
      if (userId !== undefined && r.txid) {
        const count = await this.countTransactions({ partial: { userId, txid: r.txid }, trx: args.trx })
        if (count === 0) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> {
    const results: TableProvenTxReq[] = []
    await this.filterProvenTxReqs(args, r => {
      results.push(this.validateEntity(r))
    })
    return results
  }

  async filterProvenTxs(
    args: sdk.FindProvenTxsArgs,
    filtered: (v: TableProvenTx) => void,
    userId?: number
  ): Promise<void> {
    if (args.partial.rawTx)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.rawTx',
        `undefined. ProvenTxs may not be found by rawTx value.`
      )
    if (args.partial.merklePath)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.merklePath',
        `undefined. ProvenTxs may not be found by merklePath value.`
      )
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['proven_txs'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('proven_txs').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.provenTxId && r.provenTxId !== args.partial.provenTxId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.txid && r.txid !== args.partial.txid) continue
        if (args.partial.height !== undefined && r.height !== args.partial.height) continue
        if (args.partial.index !== undefined && r.index !== args.partial.index) continue
        if (args.partial.blockHash && r.blockHash !== args.partial.blockHash) continue
        if (args.partial.merkleRoot && r.merkleRoot !== args.partial.merkleRoot) continue
      }
      if (userId !== undefined) {
        const count = await this.countTransactions({ partial: { userId, provenTxId: r.provenTxId }, trx: args.trx })
        if (count === 0) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<TableProvenTx[]> {
    const results: TableProvenTx[] = []
    await this.filterProvenTxs(args, r => {
      results.push(this.validateEntity(r))
    })
    return results
  }

  async filterTxLabelMaps(
    args: sdk.FindTxLabelMapsArgs,
    filtered: (v: TableTxLabelMap) => void,
    userId?: number
  ): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['tx_labels_map'], 'readonly', args.trx)
    let cursor:
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'tx_labels_map', unknown, 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'tx_labels_map', 'transactionId', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'tx_labels_map', 'txLabelId', 'readwrite' | 'readonly'>
      | null
    if (args.partial?.transactionId !== undefined) {
      cursor = await dbTrx.objectStore('tx_labels_map').index('transactionId').openCursor(args.partial.transactionId)
    } else if (args.partial?.txLabelId !== undefined) {
      cursor = await dbTrx.objectStore('tx_labels_map').index('txLabelId').openCursor(args.partial.txLabelId)
    } else {
      cursor = await dbTrx.objectStore('tx_labels_map').openCursor()
    }
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.txLabelId && r.txLabelId !== args.partial.txLabelId) continue
        if (args.partial.transactionId && r.transactionId !== args.partial.transactionId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.isDeleted !== undefined && r.isDeleted !== args.partial.isDeleted) continue
      }
      if (userId !== undefined) {
        const count = await this.countTxLabels({ partial: { userId, txLabelId: r.txLabelId }, trx: args.trx })
        if (count === 0) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> {
    const results: TableTxLabelMap[] = []
    await this.filterTxLabelMaps(args, r => {
      results.push(this.validateEntity(r))
    })
    return results
  }

  async countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number> {
    let count = 0
    await this.filterOutputTagMaps(args, () => {
      count++
    })
    return count
  }
  async countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number> {
    let count = 0
    await this.filterProvenTxReqs(args, () => {
      count++
    })
    return count
  }
  async countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number> {
    let count = 0
    await this.filterProvenTxs(args, () => {
      count++
    })
    return count
  }
  async countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number> {
    let count = 0
    await this.filterTxLabelMaps(args, () => {
      count++
    })
    return count
  }

  async insertCertificate(certificate: TableCertificateX, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(certificate, trx, undefined, ['isDeleted'])
    const fields = e.fields
    if (e.fields) delete e.fields
    if (e.certificateId === 0) delete e.certificateId

    const dbTrx = this.toDbTrx(['certificates', 'certificate_fields'], 'readwrite', trx)
    const store = dbTrx.objectStore('certificates')
    try {
      const id = Number(await store.add!(e))
      certificate.certificateId = id

      if (fields) {
        for (const field of fields) {
          field.certificateId = certificate.certificateId
          field.userId = certificate.userId
          await this.insertCertificateField(field, dbTrx)
        }
      }
    } finally {
      if (!trx) await dbTrx.done
    }
    return certificate.certificateId
  }

  async insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(certificateField, trx)
    const dbTrx = this.toDbTrx(['certificate_fields'], 'readwrite', trx)
    const store = dbTrx.objectStore('certificate_fields')
    try {
      await store.add!(e)
    } finally {
      if (!trx) await dbTrx.done
    }
  }

  async insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(commission, trx)
    if (e.commissionId === 0) delete e.commissionId
    const dbTrx = this.toDbTrx(['commissions'], 'readwrite', trx)
    const store = dbTrx.objectStore('commissions')
    try {
      const id = Number(await store.add!(e))
      commission.commissionId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return commission.commissionId
  }
  async insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(event, trx)
    if (e.id === 0) delete e.id
    const dbTrx = this.toDbTrx(['monitor_events'], 'readwrite', trx)
    const store = dbTrx.objectStore('monitor_events')
    try {
      const id = Number(await store.add!(e))
      event.id = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return event.id
  }
  async insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(output, trx)
    if (e.outputId === 0) delete e.outputId
    const dbTrx = this.toDbTrx(['outputs'], 'readwrite', trx)
    const store = dbTrx.objectStore('outputs')
    try {
      const id = Number(await store.add!(e))
      output.outputId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return output.outputId
  }
  async insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(basket, trx, undefined, ['isDeleted'])
    if (e.basketId === 0) delete e.basketId
    const dbTrx = this.toDbTrx(['output_baskets'], 'readwrite', trx)
    const store = dbTrx.objectStore('output_baskets')
    try {
      const id = Number(await store.add!(e))
      basket.basketId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return basket.basketId
  }
  async insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tag, trx, undefined, ['isDeleted'])
    if (e.outputTagId === 0) delete e.outputTagId
    const dbTrx = this.toDbTrx(['output_tags'], 'readwrite', trx)
    const store = dbTrx.objectStore('output_tags')
    try {
      const id = Number(await store.add!(e))
      tag.outputTagId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return tag.outputTagId
  }
  async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(tagMap, trx, undefined, ['isDeleted'])
    const dbTrx = this.toDbTrx(['output_tags_map'], 'readwrite', trx)
    const store = dbTrx.objectStore('output_tags_map')
    try {
      await store.add!(e)
    } finally {
      if (!trx) await dbTrx.done
    }
  }
  async insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.provenTxId === 0) delete e.provenTxId
    const dbTrx = this.toDbTrx(['proven_txs'], 'readwrite', trx)
    const store = dbTrx.objectStore('proven_txs')
    try {
      const id = Number(await store.add!(e))
      tx.provenTxId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return tx.provenTxId
  }
  async insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.provenTxReqId === 0) delete e.provenTxReqId
    const dbTrx = this.toDbTrx(['proven_tx_reqs'], 'readwrite', trx)
    const store = dbTrx.objectStore('proven_tx_reqs')
    try {
      const id = Number(await store.add!(e))
      tx.provenTxReqId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return tx.provenTxReqId
  }
  async insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(syncState, trx, ['when'], ['init'])
    if (e.syncStateId === 0) delete e.syncStateId
    const dbTrx = this.toDbTrx(['sync_states'], 'readwrite', trx)
    const store = dbTrx.objectStore('sync_states')
    try {
      const id = Number(await store.add!(e))
      syncState.syncStateId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return syncState.syncStateId
  }
  async insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.transactionId === 0) delete e.transactionId
    const dbTrx = this.toDbTrx(['transactions'], 'readwrite', trx)
    const store = dbTrx.objectStore('transactions')
    try {
      const id = Number(await store.add!(e))
      tx.transactionId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return tx.transactionId
  }
  async insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(label, trx, undefined, ['isDeleted'])
    if (e.txLabelId === 0) delete e.txLabelId
    const dbTrx = this.toDbTrx(['tx_labels'], 'readwrite', trx)
    const store = dbTrx.objectStore('tx_labels')
    try {
      const id = Number(await store.add!(e))
      label.txLabelId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return label.txLabelId
  }
  async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(labelMap, trx, undefined, ['isDeleted'])
    const dbTrx = this.toDbTrx(['tx_labels_map'], 'readwrite', trx)
    const store = dbTrx.objectStore('tx_labels_map')
    try {
      await store.add!(e)
    } finally {
      if (!trx) await dbTrx.done
    }
  }
  async insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(user, trx)
    if (e.userId === 0) delete e.userId
    const dbTrx = this.toDbTrx(['users'], 'readwrite', trx)
    const store = dbTrx.objectStore('users')
    try {
      const id = Number(await store.add!(e))
      user.userId = id
    } finally {
      if (!trx) await dbTrx.done
    }
    return user.userId
  }

  async updateIdb<T>(
    id: number | number[],
    update: Partial<T>,
    keyProp: string,
    storeName: string,
    trx?: sdk.TrxToken
  ): Promise<number> {
    if (update[keyProp] !== undefined && (Array.isArray(id) || update[keyProp] !== id)) {
      throw new sdk.WERR_INVALID_PARAMETER(`update.${keyProp}`, `undefined`)
    }
    const u = this.validatePartialForUpdate(update)
    const dbTrx = this.toDbTrx([storeName], 'readwrite', trx)
    const store = dbTrx.objectStore(storeName)
    const ids = Array.isArray(id) ? id : [id]
    try {
      for (const i of ids) {
        const e = await store.get(i)
        if (!e) throw new sdk.WERR_INVALID_PARAMETER('id', `an existing record to update ${keyProp} ${i} not found`)
        const v: T = {
          ...e,
          ...u
        }
        const uid = await store.put!(v)
        if (uid !== i) throw new sdk.WERR_INTERNAL(`updated id ${uid} does not match original ${id}`)
      }
    } finally {
      if (!trx) await dbTrx.done
    }
    return 1
  }

  async updateIdbKey<T>(
    key: (number | string)[],
    update: Partial<T>,
    keyProps: string[],
    storeName: string,
    trx?: sdk.TrxToken
  ): Promise<number> {
    if (key.length !== keyProps.length)
      throw new sdk.WERR_INTERNAL(`key.length ${key.length} !== keyProps.length ${keyProps.length}`)
    for (let i = 0; i < key.length; i++) {
      if (update[keyProps[i]] !== undefined && update[keyProps[i]] !== key[i]) {
        throw new sdk.WERR_INVALID_PARAMETER(`update.${keyProps[i]}`, `undefined`)
      }
    }
    const u = this.validatePartialForUpdate(update)
    const dbTrx = this.toDbTrx([storeName], 'readwrite', trx)
    const store = dbTrx.objectStore(storeName)
    try {
      const e = await store.get(key)
      if (!e)
        throw new sdk.WERR_INVALID_PARAMETER(
          'key',
          `an existing record to update ${keyProps.join(',')} ${key.join(',')} not found`
        )
      const v: T = {
        ...e,
        ...u
      }
      const uid = await store.put!(v)
      for (let i = 0; i < key.length; i++) {
        if (uid[i] !== key[i]) throw new sdk.WERR_INTERNAL(`updated key ${uid[i]} does not match original ${key[i]}`)
      }
    } finally {
      if (!trx) await dbTrx.done
    }

    return 1
  }

  async updateCertificate(id: number, update: Partial<TableCertificate>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'certificateId', 'certificates', trx)
  }

  async updateCertificateField(
    certificateId: number,
    fieldName: string,
    update: Partial<TableCertificateField>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    return this.updateIdbKey(
      [certificateId, fieldName],
      update,
      ['certificateId', 'fieldName'],
      'certificate_fields',
      trx
    )
  }

  async updateCommission(id: number, update: Partial<TableCommission>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'commissionId', 'commissions', trx)
  }
  async updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'id', 'monitor_events', trx)
  }
  async updateOutput(id: number, update: Partial<TableOutput>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'outputId', 'outputs', trx)
  }
  async updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'basketId', 'output_baskets', trx)
  }
  async updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'outputTagId', 'output_tags', trx)
  }
  async updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'provenTxId', 'proven_txs', trx)
  }
  async updateProvenTxReq(
    id: number | number[],
    update: Partial<TableProvenTxReq>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    return this.updateIdb(id, update, 'provenTxReqId', 'proven_tx_reqs', trx)
  }
  async updateSyncState(id: number, update: Partial<TableSyncState>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'syncStateId', 'sync_states', trx)
  }
  async updateTransaction(
    id: number | number[],
    update: Partial<TableTransaction>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    return this.updateIdb(id, update, 'transactionId', 'transactions', trx)
  }
  async updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'txLabelId', 'tx_labels', trx)
  }
  async updateUser(id: number, update: Partial<TableUser>, trx?: sdk.TrxToken): Promise<number> {
    return this.updateIdb(id, update, 'userId', 'users', trx)
  }
  async updateOutputTagMap(
    outputId: number,
    tagId: number,
    update: Partial<TableOutputTagMap>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    return this.updateIdbKey([tagId, outputId], update, ['outputTagId', 'outputId'], 'output_tags_map', trx)
  }
  async updateTxLabelMap(
    transactionId: number,
    txLabelId: number,
    update: Partial<TableTxLabelMap>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    return this.updateIdbKey([txLabelId, transactionId], update, ['txLabelId', 'transactionId'], 'tx_labels_map', trx)
  }

  //
  // StorageReader abstract methods
  //

  async destroy(): Promise<void> {
    if (this.db) {
      this.db.close()
    }
    this.db = undefined
    this._settings = undefined
  }

  allStores: string[] = [
    'certificates',
    'certificate_fields',
    'commissions',
    'monitor_events',
    'outputs',
    'output_baskets',
    'output_tags',
    'output_tags_map',
    'proven_txs',
    'proven_tx_reqs',
    'sync_states',
    'transactions',
    'tx_labels',
    'tx_labels_map',
    'users'
  ]

  /**
   * @param scope
   * @param trx
   * @returns
   */
  async transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T> {
    if (trx) return await scope(trx)

    const stores = this.allStores

    const db = await this.verifyDB()
    const tx = db.transaction(stores, 'readwrite')

    try {
      const r = await scope(tx as sdk.TrxToken)
      await tx.done
      return r
    } catch (err) {
      tx.abort()
      await tx.done
      throw err
    }
  }

  async filterCertificateFields(
    args: sdk.FindCertificateFieldsArgs,
    filtered: (v: TableCertificateField) => void
  ): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['certificate_fields'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('certificate_fields').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.certificateId && r.certificateId !== args.partial.certificateId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.fieldName && r.fieldName !== args.partial.fieldName) continue
        if (args.partial.fieldValue && r.fieldValue !== args.partial.fieldValue) continue
        if (args.partial.masterKey && r.masterKey !== args.partial.masterKey) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]> {
    const result: TableCertificateField[] = []
    await this.filterCertificateFields(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterCertificates(args: sdk.FindCertificatesArgs, filtered: (v: TableCertificateX) => void): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['certificates'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('certificates').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.certifiers && !args.certifiers.includes(r.certifier)) continue
      if (args.types && !args.types.includes(r.type)) continue
      if (args.partial) {
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.certificateId && r.certificateId !== args.partial.certificateId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.type && r.type !== args.partial.type) continue
        if (args.partial.serialNumber && r.serialNumber !== args.partial.serialNumber) continue
        if (args.partial.certifier && r.certifier !== args.partial.certifier) continue
        if (args.partial.subject && r.subject !== args.partial.subject) continue
        if (args.partial.verifier && r.verifier !== args.partial.verifier) continue
        if (args.partial.revocationOutpoint && r.revocationOutpoint !== args.partial.revocationOutpoint) continue
        if (args.partial.signature && r.signature !== args.partial.signature) continue
        if (args.partial.isDeleted && r.isDeleted !== args.partial.isDeleted) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    const result: TableCertificateX[] = []
    await this.filterCertificates(args, r => {
      result.push(this.validateEntity(r))
    })
    if (args.includeFields) {
      for (const c of result) {
        const fields = await this.findCertificateFields({ partial: { certificateId: c.certificateId }, trx: args.trx })
        c.fields = fields
      }
    }
    return result
  }

  async filterCommissions(args: sdk.FindCommissionsArgs, filtered: (v: TableCommission) => void): Promise<void> {
    if (args.partial.lockingScript)
      throw new sdk.WERR_INVALID_PARAMETER(
        'partial.lockingScript',
        `undefined. Commissions may not be found by lockingScript value.`
      )
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['commissions'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('commissions').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.commissionId && r.commissionId !== args.partial.commissionId) continue
        if (args.partial.transactionId && r.transactionId !== args.partial.transactionId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.satoshis !== undefined && r.satoshis !== args.partial.satoshis) continue
        if (args.partial.keyOffset && r.keyOffset !== args.partial.keyOffset) continue
        if (args.partial.isRedeemed !== undefined && r.isRedeemed !== args.partial.isRedeemed) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]> {
    const result: TableCommission[] = []
    await this.filterCommissions(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterMonitorEvents(args: sdk.FindMonitorEventsArgs, filtered: (v: TableMonitorEvent) => void): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['monitor_events'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('monitor_events').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.id && r.id !== args.partial.id) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.event && r.event !== args.partial.event) continue
        if (args.partial.details && r.details !== args.partial.details) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]> {
    const result: TableMonitorEvent[] = []
    await this.filterMonitorEvents(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterOutputBaskets(args: sdk.FindOutputBasketsArgs, filtered: (v: TableOutputBasket) => void): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['output_baskets'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('output_baskets').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.basketId && r.basketId !== args.partial.basketId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.name && r.name !== args.partial.name) continue
        if (
          args.partial.numberOfDesiredUTXOs !== undefined &&
          r.numberOfDesiredUTXOs !== args.partial.numberOfDesiredUTXOs
        )
          continue
        if (
          args.partial.minimumDesiredUTXOValue !== undefined &&
          r.numberOfDesiredSatoshis !== args.partial.minimumDesiredUTXOValue
        )
          continue
        if (args.partial.isDeleted !== undefined && r.isDeleted !== args.partial.isDeleted) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    const result: TableOutputBasket[] = []
    await this.filterOutputBaskets(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterOutputs(args: sdk.FindOutputsArgs, filtered: (v: TableOutput) => void): Promise<void> {
    // args.txStatus
    // args.noScript
    if (args.partial.lockingScript)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.lockingScript',
        `undefined. Outputs may not be found by lockingScript value.`
      )
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['outputs'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('outputs').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.outputId && r.outputId !== args.partial.outputId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.transactionId && r.transactionId !== args.partial.transactionId) continue
        if (args.partial.basketId && r.basketId !== args.partial.basketId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.spendable !== undefined && r.spendable !== args.partial.spendable) continue
        if (args.partial.change !== undefined && r.change !== args.partial.change) continue
        if (args.partial.outputDescription && r.outputDescription !== args.partial.outputDescription) continue
        if (args.partial.vout !== undefined && r.vout !== args.partial.vout) continue
        if (args.partial.satoshis !== undefined && r.satoshis !== args.partial.satoshis) continue
        if (args.partial.providedBy && r.providedBy !== args.partial.providedBy) continue
        if (args.partial.purpose && r.purpose !== args.partial.purpose) continue
        if (args.partial.type && r.type !== args.partial.type) continue
        if (args.partial.txid && r.txid !== args.partial.txid) continue
        if (args.partial.senderIdentityKey && r.senderIdentityKey !== args.partial.senderIdentityKey) continue
        if (args.partial.derivationPrefix && r.derivationPrefix !== args.partial.derivationPrefix) continue
        if (args.partial.derivationSuffix && r.derivationSuffix !== args.partial.derivationSuffix) continue
        if (args.partial.customInstructions && r.customInstructions !== args.partial.customInstructions) continue
        if (args.partial.spentBy && r.spentBy !== args.partial.spentBy) continue
        if (args.partial.sequenceNumber !== undefined && r.sequenceNumber !== args.partial.sequenceNumber) continue
        if (args.partial.scriptLength !== undefined && r.scriptLength !== args.partial.scriptLength) continue
        if (args.partial.scriptOffset !== undefined && r.scriptOffset !== args.partial.scriptOffset) continue
      }
      if (args.txStatus !== undefined) {
        const count = await this.countTransactions({
          partial: { transactionId: r.transactionId },
          status: args.txStatus,
          trx: args.trx
        })
        if (count === 0) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      if (args.noScript === true) {
        r.script = undefined
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    const results: TableOutput[] = []
    await this.filterOutputs(args, r => {
      results.push(this.validateEntity(r))
    })
    for (const o of results) {
      if (!args.noScript) {
        await this.validateOutputScript(o)
      } else {
        o.lockingScript = undefined
      }
    }
    return results
  }

  async filterOutputTags(args: sdk.FindOutputTagsArgs, filtered: (v: TableOutputTag) => void): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['output_tags'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('output_tags').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.outputTagId && r.outputTagId !== args.partial.outputTagId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.tag && r.tag !== args.partial.tag) continue
        if (args.partial.isDeleted !== undefined && r.isDeleted !== args.partial.isDeleted) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]> {
    const result: TableOutputTag[] = []
    await this.filterOutputTags(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterSyncStates(args: sdk.FindSyncStatesArgs, filtered: (v: TableSyncState) => void): Promise<void> {
    if (args.partial.syncMap)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.syncMap',
        `undefined. SyncStates may not be found by syncMap value.`
      )
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['sync_states'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('sync_states').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.syncStateId && r.syncStateId !== args.partial.syncStateId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.storageIdentityKey && r.storageIdentityKey !== args.partial.storageIdentityKey) continue
        if (args.partial.storageName && r.storageName !== args.partial.storageName) continue
        if (args.partial.status && r.status !== args.partial.status) continue
        if (args.partial.init !== undefined && r.init !== args.partial.init) continue
        if (args.partial.refNum !== undefined && r.refNum !== args.partial.refNum) continue
        if (args.partial.when && r.when?.getTime() !== args.partial.when.getTime()) continue
        if (args.partial.satoshis !== undefined && r.satoshis !== args.partial.satoshis) continue
        if (args.partial.errorLocal && r.errorLocale !== args.partial.errorLocal) continue
        if (args.partial.errorOther && r.errorOther !== args.partial.errorOther) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]> {
    const result: TableSyncState[] = []
    await this.filterSyncStates(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterTransactions(
    args: sdk.FindTransactionsArgs,
    filtered: (v: TableTransaction) => void,
    labelIds?: number[],
    isQueryModeAll?: boolean
  ): Promise<void> {
    if (args.partial.rawTx)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.rawTx',
        `undefined. Transactions may not be found by rawTx value.`
      )
    if (args.partial.inputBEEF)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.inputBEEF',
        `undefined. Transactions may not be found by inputBEEF value.`
      )
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const stores = ['transactions']
    if (labelIds && labelIds.length > 0) {
      stores.push('tx_labels_map')
    }
    const dbTrx = this.toDbTrx(stores, 'readonly', args.trx)
    let cursor:
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'transactions', unknown, 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'transactions', 'userId', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'transactions', 'status', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'transactions', 'status_userId', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'transactions', 'provenTxId', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'transactions', 'reference', 'readwrite' | 'readonly'>
      | null
    if (args.partial?.userId !== undefined) {
      if (args.partial?.status !== undefined) {
        cursor = await dbTrx
          .objectStore('transactions')
          .index('status_userId')
          .openCursor([args.partial.status, args.partial.userId])
      } else {
        cursor = await dbTrx.objectStore('transactions').index('userId').openCursor(args.partial.userId)
      }
    } else if (args.partial?.status !== undefined) {
      cursor = await dbTrx.objectStore('transactions').index('status').openCursor(args.partial.status)
    } else if (args.partial?.provenTxId !== undefined) {
      cursor = await dbTrx.objectStore('transactions').index('provenTxId').openCursor(args.partial.provenTxId)
    } else if (args.partial?.reference !== undefined) {
      cursor = await dbTrx.objectStore('transactions').index('reference').openCursor(args.partial.reference)
    } else {
      cursor = await dbTrx.objectStore('transactions').openCursor(args.partial?.transactionId || undefined)
    }
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.status && !args.status.includes(r.status)) continue
      if (args.partial) {
        if (args.partial.transactionId && r.transactionId !== args.partial.transactionId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.provenTxId && r.provenTxId !== args.partial.provenTxId) continue
        if (args.partial.status && r.status !== args.partial.status) continue
        if (args.partial.reference && r.reference !== args.partial.reference) continue
        if (args.partial.isOutgoing !== undefined && r.isOutgoing !== args.partial.isOutgoing) continue
        if (args.partial.satoshis !== undefined && r.satoshis !== args.partial.satoshis) continue
        if (args.partial.description && r.description !== args.partial.description) continue
        if (args.partial.version !== undefined && r.version !== args.partial.version) continue
        if (args.partial.lockTime !== undefined && r.lockTime !== args.partial.lockTime) continue
        if (args.partial.txid && r.txid !== args.partial.txid) continue
      }
      if (labelIds && labelIds.length > 0) {
        let ids = [...labelIds]
        await this.filterTxLabelMaps({ partial: { transactionId: r.transactionId }, trx: dbTrx }, lm => {
          if (ids.length > 0) {
            const i = ids.indexOf(lm.txLabelId)
            if (i >= 0) {
              if (isQueryModeAll) {
                ids.splice(i, 1)
              } else {
                ids = []
              }
            }
          }
        })
        if (ids.length > 0) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findTransactions(
    args: sdk.FindTransactionsArgs,
    labelIds?: number[],
    isQueryModeAll?: boolean
  ): Promise<TableTransaction[]> {
    const results: TableTransaction[] = []
    await this.filterTransactions(
      args,
      r => {
        results.push(this.validateEntity(r))
      },
      labelIds,
      isQueryModeAll
    )
    for (const t of results) {
      if (!args.noRawTx) {
        await this.validateRawTransaction(t, args.trx)
      } else {
        t.rawTx = undefined
        t.inputBEEF = undefined
      }
    }
    return results
  }

  async filterTxLabels(args: sdk.FindTxLabelsArgs, filtered: (v: TableTxLabel) => void): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['tx_labels'], 'readonly', args.trx)
    let cursor:
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'tx_labels', unknown, 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'tx_labels', 'userId', 'readwrite' | 'readonly'>
      | IDBPCursorWithValue<StorageIdbSchema, string[], 'tx_labels', 'label_userId', 'readwrite' | 'readonly'>
      | null
    if (args.partial?.userId !== undefined) {
      if (args.partial?.label !== undefined) {
        cursor = await dbTrx
          .objectStore('tx_labels')
          .index('label_userId')
          .openCursor([args.partial.label, args.partial.userId])
      } else {
        cursor = await dbTrx.objectStore('tx_labels').index('userId').openCursor(args.partial.userId)
      }
    } else {
      cursor = await dbTrx.objectStore('tx_labels').openCursor()
    }
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.txLabelId && r.txLabelId !== args.partial.txLabelId) continue
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.label && r.label !== args.partial.label) continue
        if (args.partial.isDeleted !== undefined && r.isDeleted !== args.partial.isDeleted) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]> {
    const result: TableTxLabel[] = []
    await this.filterTxLabels(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async filterUsers(args: sdk.FindUsersArgs, filtered: (v: TableUser) => void): Promise<void> {
    const offset = args.paged?.offset || 0
    let skipped = 0
    let count = 0
    const dbTrx = this.toDbTrx(['users'], 'readonly', args.trx)
    let cursor = await dbTrx.objectStore('users').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue()
      if (!cursor) break
      firstTime = false
      const r = cursor.value
      if (args.since && args.since > r.updated_at) continue
      if (args.partial) {
        if (args.partial.userId && r.userId !== args.partial.userId) continue
        if (args.partial.created_at && r.created_at.getTime() !== args.partial.created_at.getTime()) continue
        if (args.partial.updated_at && r.updated_at.getTime() !== args.partial.updated_at.getTime()) continue
        if (args.partial.identityKey && r.identityKey !== args.partial.identityKey) continue
        if (args.partial.activeStorage && r.activeStorage !== args.partial.activeStorage) continue
      }
      if (skipped < offset) {
        skipped++
        continue
      }
      filtered(r)
      count++
      if (args.paged?.limit && count >= args.paged.limit) break
    }
    if (!args.trx) await dbTrx.done
  }

  async findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]> {
    const result: TableUser[] = []
    await this.filterUsers(args, r => {
      result.push(this.validateEntity(r))
    })
    return result
  }

  async countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number> {
    let count = 0
    await this.filterCertificateFields(args, () => {
      count++
    })
    return count
  }
  async countCertificates(args: sdk.FindCertificatesArgs): Promise<number> {
    let count = 0
    await this.filterCertificates(args, () => {
      count++
    })
    return count
  }
  async countCommissions(args: sdk.FindCommissionsArgs): Promise<number> {
    let count = 0
    await this.filterCommissions(args, () => {
      count++
    })
    return count
  }
  async countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number> {
    let count = 0
    await this.filterMonitorEvents(args, () => {
      count++
    })
    return count
  }
  async countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number> {
    let count = 0
    await this.filterOutputBaskets(args, () => {
      count++
    })
    return count
  }
  async countOutputs(args: sdk.FindOutputsArgs): Promise<number> {
    let count = 0
    await this.filterOutputs({ ...args, noScript: true }, () => {
      count++
    })
    return count
  }
  async countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number> {
    let count = 0
    await this.filterOutputTags(args, () => {
      count++
    })
    return count
  }
  async countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number> {
    let count = 0
    await this.filterSyncStates(args, () => {
      count++
    })
    return count
  }
  async countTransactions(
    args: sdk.FindTransactionsArgs,
    labelIds?: number[],
    isQueryModeAll?: boolean
  ): Promise<number> {
    let count = 0
    await this.filterTransactions(
      { ...args, noRawTx: true },
      () => {
        count++
      },
      labelIds,
      isQueryModeAll
    )
    return count
  }
  async countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number> {
    let count = 0
    await this.filterTxLabels(args, () => {
      count++
    })
    return count
  }
  async countUsers(args: sdk.FindUsersArgs): Promise<number> {
    let count = 0
    await this.filterUsers(args, () => {
      count++
    })
    return count
  }

  async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]> {
    const results: TableProvenTx[] = []
    const fargs: sdk.FindProvenTxsArgs = {
      partial: {},
      since: args.since,
      paged: args.paged,
      trx: args.trx
    }
    await this.filterProvenTxs(
      fargs,
      r => {
        results.push(this.validateEntity(r))
      },
      args.userId
    )
    return results
  }

  async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> {
    const results: TableProvenTxReq[] = []
    const fargs: sdk.FindProvenTxReqsArgs = {
      partial: {},
      since: args.since,
      paged: args.paged,
      trx: args.trx
    }
    await this.filterProvenTxReqs(
      fargs,
      r => {
        results.push(this.validateEntity(r))
      },
      args.userId
    )
    return results
  }

  async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> {
    const results: TableTxLabelMap[] = []
    const fargs: sdk.FindTxLabelMapsArgs = {
      partial: {},
      since: args.since,
      paged: args.paged,
      trx: args.trx
    }
    await this.filterTxLabelMaps(
      fargs,
      r => {
        results.push(this.validateEntity(r))
      },
      args.userId
    )
    return results
  }

  async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> {
    const results: TableOutputTagMap[] = []
    const fargs: sdk.FindOutputTagMapsArgs = {
      partial: {},
      since: args.since,
      paged: args.paged,
      trx: args.trx
    }
    await this.filterOutputTagMaps(
      fargs,
      r => {
        results.push(this.validateEntity(r))
      },
      args.userId
    )
    return results
  }

  async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> {
    if (!this._settings) {
      this._settings = await this.readSettings()
    }

    return this._settings.dbtype
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process all individual records with time stamps or number[] retreived from database.
   */
  validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T {
    entity.created_at = this.validateDate(entity.created_at)
    entity.updated_at = this.validateDate(entity.updated_at)
    if (dateFields) {
      for (const df of dateFields) {
        if (entity[df]) entity[df] = this.validateDate(entity[df])
      }
    }
    if (booleanFields) {
      for (const df of booleanFields) {
        if (entity[df] !== undefined) entity[df] = !!entity[df]
      }
    }
    for (const key of Object.keys(entity)) {
      const val = entity[key]
      if (val === null) {
        entity[key] = undefined
      } else if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
        entity[key] = Array.from(val)
      }
    }
    return entity
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process all arrays of records with time stamps retreived from database.
   * @returns input `entities` array with contained values validated.
   */
  validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] {
    for (let i = 0; i < entities.length; i++) {
      entities[i] = this.validateEntity(entities[i], dateFields, booleanFields)
    }
    return entities
  }
  /**
   * Helper to force uniform behavior across database engines.
   * Use to process the update template for entities being updated.
   */
  validatePartialForUpdate<T extends sdk.EntityTimeStamp>(
    update: Partial<T>,
    dateFields?: string[],
    booleanFields?: string[]
  ): Partial<T> {
    if (!this.dbtype) throw new sdk.WERR_INTERNAL('must call verifyReadyForDatabaseAccess first')
    const v: any = update
    if (v.created_at) v.created_at = this.validateEntityDate(v.created_at)
    if (v.updated_at) v.updated_at = this.validateEntityDate(v.updated_at)
    if (!v.created_at) delete v.created_at
    if (!v.updated_at) v.updated_at = this.validateEntityDate(new Date())

    if (dateFields) {
      for (const df of dateFields) {
        if (v[df]) v[df] = this.validateOptionalEntityDate(v[df])
      }
    }
    if (booleanFields) {
      for (const df of booleanFields) {
        if (update[df] !== undefined) update[df] = !!update[df] ? 1 : 0
      }
    }
    for (const key of Object.keys(v)) {
      const val = v[key]
      if (Array.isArray(val) && (val.length === 0 || typeof val[0] === 'number')) {
        v[key] = Buffer.from(val)
      } else if (val === undefined) {
        v[key] = null
      }
    }
    this.isDirty = true
    return v
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process new entities being inserted into the database.
   */
  async validateEntityForInsert<T extends sdk.EntityTimeStamp>(
    entity: T,
    trx?: sdk.TrxToken,
    dateFields?: string[],
    booleanFields?: string[]
  ): Promise<any> {
    await this.verifyReadyForDatabaseAccess(trx)
    const v: any = { ...entity }
    v.created_at = this.validateOptionalEntityDate(v.created_at, true)!
    v.updated_at = this.validateOptionalEntityDate(v.updated_at, true)!
    if (!v.created_at) delete v.created_at
    if (!v.updated_at) delete v.updated_at
    if (dateFields) {
      for (const df of dateFields) {
        if (v[df]) v[df] = this.validateOptionalEntityDate(v[df])
      }
    }
    if (booleanFields) {
      for (const df of booleanFields) {
        if (entity[df] !== undefined) entity[df] = !!entity[df] ? 1 : 0
      }
    }
    for (const key of Object.keys(v)) {
      const val = v[key]
      if (Array.isArray(val) && (val.length === 0 || typeof val[0] === 'number')) {
        v[key] = Buffer.from(val)
      } else if (val === undefined) {
        v[key] = null
      }
    }
    this.isDirty = true
    return v
  }

  async validateRawTransaction(t: TableTransaction, trx?: sdk.TrxToken): Promise<void> {
    // if there is no txid or there is a rawTransaction return what we have.
    if (t.rawTx || !t.txid) return

    // rawTransaction is missing, see if we moved it ...

    const rawTx = await this.getRawTxOfKnownValidTransaction(t.txid, undefined, undefined, trx)
    if (!rawTx) return
    t.rawTx = rawTx
  }

  async validateOutputScript(o: TableOutput, trx?: sdk.TrxToken): Promise<void> {
    // without offset and length values return what we have (make no changes)
    if (!o.scriptLength || !o.scriptOffset || !o.txid) return
    // if there is an outputScript and its length is the expected length return what we have.
    if (o.lockingScript && o.lockingScript.length === o.scriptLength) return

    // outputScript is missing or has incorrect length...

    const script = await this.getRawTxOfKnownValidTransaction(o.txid, o.scriptOffset, o.scriptLength, trx)
    if (!script) return
    o.lockingScript = script
  }
}
