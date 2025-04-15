import { deleteDB, IDBPDatabase, openDB } from 'idb'
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
  TableProvenTx,
  TableProvenTxReq,
  TableSettings,
  TableSyncState,
  TableTransaction,
  TableTxLabel,
  TableTxLabelMap,
  TableUser
} from '../index.client'
import { StorageProvider, StorageProviderOptions } from './StorageProvider'
import { StorageIdbSchema } from './schema/StorageIdbSchema'
import { DBType } from './StorageReader'

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
    if (this.db) return this.db;
    this.db = await this.initDB(storageName, storageIdentityKey)
    this._settings = (await this.db.getAll('settings'))[0]
    this.whenLastAccess = new Date()
    return this.db
  }

  /**
   * Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
   * or a Knex.Transaction as appropriate.
   */
  toDb(trx?: sdk.TrxToken) : IDBPDatabase<StorageIdbSchema> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (trx) throw new Error('not implemented');
    if (!this.db) throw new Error('not initialized');
    const db = this.db
    this.whenLastAccess = new Date()
    return db
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
            autoIncrement: true,
          });
          provenTxsStore.createIndex('txid', 'txid', { unique: true });
        }

        if (!db.objectStoreNames.contains('proven_tx_reqs')) {
          // proven_tx_reqs object store
          const provenTxReqsStore = db.createObjectStore('proven_tx_reqs', {
            keyPath: 'provenTxReqId',
            autoIncrement: true,
          });
          provenTxReqsStore.createIndex('provenTxId', 'provenTxId');
          provenTxReqsStore.createIndex('txid', 'txid', { unique: true });
          provenTxReqsStore.createIndex('status', 'status');
          provenTxReqsStore.createIndex('batch', 'batch');
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
            autoIncrement: true,
          });
          certificatesStore.createIndex('userId', 'userId');
          certificatesStore.createIndex('userId_type_certifier_serialNumber', ['userId', 'type', 'certifier', 'serialNumber'], { unique: true });
        }

        if (!db.objectStoreNames.contains('certificate_fields')) {
          // certificate_fields object store
          const certificateFieldsStore = db.createObjectStore('certificate_fields', {
            keyPath: ['certificateId', 'fieldName'], // Composite key
          });
          certificateFieldsStore.createIndex('userId', 'userId');
          certificateFieldsStore.createIndex('certificateId', 'certificateId');
        }

        if (!db.objectStoreNames.contains('output_baskets')) {
          // output_baskets object store
          const outputBasketsStore = db.createObjectStore('output_baskets', {
            keyPath: 'basketId',
            autoIncrement: true,
          });
          outputBasketsStore.createIndex('userId', 'userId');
          outputBasketsStore.createIndex('name_userId', ['name', 'userId'], { unique: true });
        }

        if (!db.objectStoreNames.contains('transactions')) {
          // transactions object store
          const transactionsStore = db.createObjectStore('transactions', {
            keyPath: 'transactionId',
            autoIncrement: true,
          });
          transactionsStore.createIndex('userId', 'userId');
          transactionsStore.createIndex('provenTxId', 'provenTxId');
          transactionsStore.createIndex('reference', 'reference', { unique: true });
          transactionsStore.createIndex('status', 'status');
        }

        if (!db.objectStoreNames.contains('commissions')) {
          // commissions object store
          const commissionsStore = db.createObjectStore('commissions', {
            keyPath: 'commissionId',
            autoIncrement: true,
          });
          commissionsStore.createIndex('userId', 'userId');
          commissionsStore.createIndex('transactionId', 'transactionId', { unique: true });
        }

        if (!db.objectStoreNames.contains('outputs')) {
          // outputs object store
          const outputsStore = db.createObjectStore('outputs', {
            keyPath: 'outputId',
            autoIncrement: true,
          });
          outputsStore.createIndex('userId', 'userId');
          outputsStore.createIndex('transactionId', 'transactionId');
          outputsStore.createIndex('basketId', 'basketId');
          outputsStore.createIndex('spentBy', 'spentBy');
          outputsStore.createIndex('transactionId_vout_userId', ['transactionId', 'vout', 'userId'], { unique: true });
        }

        if (!db.objectStoreNames.contains('output_tags')) {
          // output_tags object store
          const outputTagsStore = db.createObjectStore('output_tags', {
            keyPath: 'outputTagId',
            autoIncrement: true,
          });
          outputTagsStore.createIndex('userId', 'userId');
          outputTagsStore.createIndex('tag_userId', ['tag', 'userId'], { unique: true });
        }

        if (!db.objectStoreNames.contains('output_tags_map')) {
          // output_tags_map object store
          const outputTagsMapStore = db.createObjectStore('output_tags_map', {
            keyPath: ['outputTagId', 'outputId'],
          });
          outputTagsMapStore.createIndex('outputTagId', 'outputTagId');
          outputTagsMapStore.createIndex('outputId', 'outputId');
        }

        if (!db.objectStoreNames.contains('tx_labels')) {
          // tx_labels object store
          const txLabelsStore = db.createObjectStore('tx_labels', {
            keyPath: 'txLabelId',
            autoIncrement: true,
          });
          txLabelsStore.createIndex('userId', 'userId');
          txLabelsStore.createIndex('label_userId', ['label', 'userId'], { unique: true });
        }

        if (!db.objectStoreNames.contains('tx_labels_map')) {
          // tx_labels_map object store
          const txLabelsMapStore = db.createObjectStore('tx_labels_map', {
            keyPath: ['txLabelId', 'transactionId'],
          });
          txLabelsMapStore.createIndex('txLabelId', 'txLabelId');
          txLabelsMapStore.createIndex('transactionId', 'transactionId');
        }

        if (!db.objectStoreNames.contains('monitor_events')) {
          // monitor_events object store
          const monitorEventsStore = db.createObjectStore('monitor_events', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }

        if (!db.objectStoreNames.contains('sync_states')) {
          // sync_states object store
          const syncStatesStore = db.createObjectStore('sync_states', {
            keyPath: 'syncStateId',
            autoIncrement: true,
          });
          syncStatesStore.createIndex('userId', 'userId');
          syncStatesStore.createIndex('refNum', 'refNum', { unique: true });
          syncStatesStore.createIndex('status', 'status');
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

  async allocateChangeInput(
    userId: number,
    basketId: number,
    targetSatoshis: number,
    exactSatoshis: number | undefined,
    excludeSending: boolean,
    transactionId: number
  ): Promise<TableOutput | undefined> {
    throw new Error('Method not implemented.')
  }

  async getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx> {
    throw new Error('Method not implemented.')
  }
  async getRawTxOfKnownValidTransaction(
    txid?: string,
    offset?: number,
    length?: number,
    trx?: sdk.TrxToken
  ): Promise<number[] | undefined> {
    throw new Error('Method not implemented.')
  }

  async getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<TableTxLabel[]> {
    throw new Error('Method not implemented.')
  }
  async getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<TableOutputTag[]> {
    throw new Error('Method not implemented.')
  }

  async listActions(auth: sdk.AuthId, args: sdk.ValidListActionsArgs): Promise<ListActionsResult> {
    throw new Error('Method not implemented.')
  }
  async listOutputs(auth: sdk.AuthId, args: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> {
    throw new Error('Method not implemented.')
  }

  async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    throw new Error('Method not implemented.')
  }
  async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    throw new Error('Method not implemented.')
  }
  async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    throw new Error('Method not implemented.')
  }
  async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> {
    throw new Error('Method not implemented.')
  }

  //
  // StorageReaderWriter abstract methods
  //

  async dropAllData(): Promise<void> {
    await deleteDB(this.dbName);
  }
  async findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> {
    throw new Error('Method not implemented.')
  }
  async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> {
    throw new Error('Method not implemented.')
  }
  async findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<TableProvenTx[]> {
    throw new Error('Method not implemented.')
  }
  async findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> {
    throw new Error('Method not implemented.')
  }

  async countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async insertCertificate(certificate: TableCertificateX, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(certificate, trx, undefined, ['isDeleted'])
    const fields = e.fields
    if (e.fields) delete e.fields
    if (e.certificateId === 0) delete e.certificateId
    const db = await this.verifyDB()
    const id = Number(await this.toDb(trx).add('certificates', e))
    certificate.certificateId = id

    if (fields) {
      for (const field of fields) {
        field.certificateId = id
        field.userId = certificate.userId
        await this.insertCertificateField(field, trx)
      }
    }

    return certificate.certificateId
  }
  async insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(certificateField, trx)
    await this.toDb(trx).add('certificate_fields', e)
  }
  async insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(commission, trx)
    if (e.commissionId === 0) delete e.commissionId
    const id = Number(await this.toDb(trx).add('commissions', e))
    commission.commissionId = id
    return commission.commissionId
  }
  async insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(event, trx)
    if (e.id === 0) delete e.id
    const id = Number(await this.toDb(trx).add('monitor_events', e))
    event.id = id
    return event.id
  }
  async insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number> {
      const e = await this.validateEntityForInsert(output, trx)
      if (e.outputId === 0) delete e.outputId
      const id = Number(await this.toDb(trx).add('outputs', e))
      output.outputId = id
      return output.outputId
  }
  async insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(basket, trx, undefined, ['isDeleted'])
    if (e.basketId === 0) delete e.basketId
    const id = Number(await this.toDb(trx).add('output_baskets', e))
    basket.basketId = id
    return basket.basketId
  }
  async insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tag, trx, undefined, ['isDeleted'])
    if (e.outputTagId === 0) delete e.outputTagId
    const id = Number(await this.toDb(trx).add('output_tags', e))
    tag.outputTagId = id
    return tag.outputTagId
  }
  async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(tagMap, trx, undefined, ['isDeleted'])
    const id = await this.toDb(trx).add('output_tags_map', e)
  }
  async insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.provenTxId === 0) delete e.provenTxId
    const id = Number(await this.toDb(trx).add('proven_txs', e))
    tx.provenTxId = id
    return tx.provenTxId
  }
  async insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.provenTxReqId === 0) delete e.provenTxReqId
    const id = Number(await this.toDb(trx).add('proven_tx_reqs', e))
    tx.provenTxReqId = id
    return tx.provenTxReqId
  }
  async insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(syncState, trx, ['when'], ['init'])
    if (e.syncStateId === 0) delete e.syncStateId
    const id = Number(await this.toDb(trx).add('sync_states', e))
    syncState.syncStateId = id
    return syncState.syncStateId
  }
  async insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.transactionId === 0) delete e.transactionId
    const id = Number(await this.toDb(trx).add('transactions', e))
    tx.transactionId = id
    return tx.transactionId
  }
  async insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(label, trx, undefined, ['isDeleted'])
    if (e.txLabelId === 0) delete e.txLabelId
    const id = Number(await this.toDb(trx).add('tx_labels', e))
    label.txLabelId = id
    return label.txLabelId
  }
  async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(labelMap, trx, undefined, ['isDeleted'])
    const id = await this.toDb(trx).add('tx_labels_map', e)
  }
  async insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(user, trx)
    if (e.userId === 0) delete e.userId
    const id = Number(await this.toDb(trx).add('users', e))
    user.userId = id
    return user.userId
  }

  async updateCertificate(id: number, update: Partial<TableCertificate>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateCertificateField(
    certificateId: number,
    fieldName: string,
    update: Partial<TableCertificateField>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async updateCommission(id: number, update: Partial<TableCommission>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateOutput(id: number, update: Partial<TableOutput>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateOutputTagMap(
    outputId: number,
    tagId: number,
    update: Partial<TableOutputTagMap>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateProvenTxReq(
    id: number | number[],
    update: Partial<TableProvenTxReq>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateSyncState(id: number, update: Partial<TableSyncState>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateTransaction(
    id: number | number[],
    update: Partial<TableTransaction>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateTxLabelMap(
    transactionId: number,
    txLabelId: number,
    update: Partial<TableTxLabelMap>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async updateUser(id: number, update: Partial<TableUser>, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
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

  async transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T> {
    throw new Error('Method not implemented.')
  }

  async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]> {
    // args.partial
    // args.since
    // args.paged limit / offset
    const result: TableCertificateField[] = []
    const offset = args.paged?.offset || 0
    let skipped = 0
    const db = await this.verifyDB()
    const trx = db.transaction(['certificate_fields'], 'readonly')
    let cursor = await trx.objectStore('certificate_fields').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue();
      if (!cursor) break;
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
      if (skipped < offset) { skipped++; continue }
      result.push(r)
      if (args.paged?.limit && result.length >= args.paged.limit) break
    }
    return result
  }

  async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    // args.partial
    // args.since
    // args.paged limit / offset
    // args.certifiers
    // args.types
    // args.includeFields
    const result: TableCertificateX[] = []
    const offset = args.paged?.offset || 0
    let skipped = 0
    const db = await this.verifyDB()
    const trx = db.transaction(['certificates'], 'readonly')
    let cursor = await trx.objectStore('certificates').openCursor()
    let firstTime = true
    while (cursor) {
      if (!firstTime) cursor = await cursor.continue();
      if (!cursor) break;
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
      if (skipped < offset) { skipped++; continue }
      result.push(r)
      if (args.paged?.limit && result.length >= args.paged.limit) break
    }
    if (args.includeFields) {
      for (const c of result) {
        const fields = await this.findCertificateFields({ partial: { certificateId: c.certificateId } })
        c.fields = fields
      }
    }
    return result
  }
  async findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]> {
    throw new Error('Method not implemented.')
  }
  async findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]> {
    throw new Error('Method not implemented.')
  }
  async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    throw new Error('Method not implemented.')
  }
  async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    throw new Error('Method not implemented.')
  }
  async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]> {
    throw new Error('Method not implemented.')
  }
  async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]> {
    throw new Error('Method not implemented.')
  }
  async findTransactions(args: sdk.FindTransactionsArgs): Promise<TableTransaction[]> {
    throw new Error('Method not implemented.')
  }
  async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]> {
    throw new Error('Method not implemented.')
  }
  async findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]> {
    throw new Error('Method not implemented.')
  }

  async countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countCertificates(args: sdk.FindCertificatesArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countCommissions(args: sdk.FindCommissionsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countOutputs(args: sdk.FindOutputsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countTransactions(args: sdk.FindTransactionsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async countUsers(args: sdk.FindUsersArgs): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]> {
    throw new Error('Method not implemented.')
  }
  async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> {
    throw new Error('Method not implemented.')
  }
  async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> {
    throw new Error('Method not implemented.')
  }
  async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> {
    throw new Error('Method not implemented.')
  }

  async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> {
    if (!this._settings) {
      this._settings = await this.readSettings()
    }

    return this._settings.dbtype
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

}
