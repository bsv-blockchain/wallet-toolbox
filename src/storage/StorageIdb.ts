import { IDBPDatabase, openDB } from 'idb'
import { Base64String, HexString, ListActionsResult, ListOutputsResult, PubKeyHex } from '@bsv/sdk'
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
import { ProvenTxReqStatus, SyncStatus, TransactionStatus } from '../sdk'

export interface StorageIdbOptions extends StorageProviderOptions {}

export interface StorageIdbSchema {
  certificates: {
    key: number
    value: TableCertificate
    indexes: {
      userId: number
      userId_type_certifier_serialNumber: [number, Base64String, PubKeyHex, Base64String]
    }
  }
  certificateFields: {
    key: number
    value: TableCertificateField
    indexes: {
      userId: number
      certificateId: number
    }
  }
  commissions: {
    key: number
    value: TableCommission
    indexes: {
      userId: number
      transactionId: number
    }
  }
  monitorEvents: {
    key: number
    value: TableMonitorEvent
  }
  outputs: {
    key: number
    value: TableOutput
    indexes: {
      userId: number
      transactionId: number
      basketId: number
      spentBy: string
      transactionId_vout_userId: [number, number, number]
    }
  }
  outputBaskets: {
    key: number
    value: TableOutputBasket
    indexes: {
      userId: number
      name_userId: [string, number]
    }
  }
  outputTags: {
    key: number
    value: TableOutputTag
    indexes: {
      userId: number
      tag_userId: [string, number]
    }
  }
  outputTagMaps: {
    key: number
    value: TableOutputTagMap
    indexes: {
      outputTagId: number
      outputId: number
    }
  }
  provenTxs: {
    key: number
    value: TableProvenTx
    indexes: {
      txid: HexString
    }
  }
  provenTxReqs: {
    key: number
    value: TableProvenTxReq
    indexes: {
      provenTxId: number
      txid: HexString
      status: ProvenTxReqStatus
      batch: string
    }
  }
  syncStates: {
    key: number
    value: TableSyncState
    indexes: {
      userId: number
      refNum: string
      status: SyncStatus
    }
  }
  settings: {
    key: number
    value: TableSettings
    indexes: Record<string, never>
  }
  transactions: {
    key: number
    value: TableTransaction
    indexes: {
      userId: number
      provenTxId: number
      reference: string
      status: TransactionStatus
    }
  }
  txLabels: {
    key: number
    value: TableTxLabel
    indexes: {
      userId: number
      label_userId: [string, number]
    }
  }
  txLabelMaps: {
    key: number
    value: TableTxLabelMap
    indexes: {
      transactionId: number
      txLabelId: number
    }
  }
  users: {
    key: number
    value: TableUser
    indexes: {
      identityKey: string
    }
  }
}

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
    this._settings = await this.db.get('settings', 'settings')
    this.whenLastAccess = new Date()
    return this.db
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
    throw new Error('Method not implemented.')
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

  async insertCertificate(certificate: TableCertificate, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }

  async transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T> {
    throw new Error('Method not implemented.')
  }

  async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]> {
    throw new Error('Method not implemented.')
  }
  async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    throw new Error('Method not implemented.')
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
}
