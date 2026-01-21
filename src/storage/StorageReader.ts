import {
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
} from './schema/tables'
import * as sdk from '../sdk/index'
import { validateSecondsSinceEpoch, verifyOneOrNone, verifyTruthy } from '../utility/utilityHelpers'
import { getSyncChunk } from './methods/getSyncChunk'

/**
 * The `StorageReader` abstract class is the base of the concrete wallet storage provider classes.
 *
 * It is the minimal interface required to read all wallet state records and is the base class for sync readers.
 *
 * The next class in the heirarchy is the `StorageReaderWriter` which supports sync readers and writers.
 *
 * The last class in the heirarchy is the `Storage` class which supports all active wallet operations.
 *
 * The ability to construct a properly configured instance of this class implies authentication.
 * As such there are no user specific authenticated access checks implied in the implementation of any of these methods.
 */
export abstract class StorageReader implements sdk.WalletStorageSyncReader {
  chain: sdk.Chain
  _settings?: TableSettings
  whenLastAccess?: Date
  get dbtype(): DBType | undefined {
    return this._settings?.dbtype
  }

  constructor(options: StorageReaderOptions) {
    this.chain = options.chain
  }

  isAvailable(): boolean {
    return !!this._settings
  }
  async makeAvailable(): Promise<TableSettings> {
    if (this._settings) return this._settings
    return (this._settings = await this.readSettings())
  }

  getSettings(): TableSettings {
    if (!this._settings) throw new sdk.WERR_INVALID_OPERATION('must call "makeAvailable" before accessing "settings"')
    return this._settings
  }

  isStorageProvider(): boolean {
    return false
  }

  abstract destroy(): Promise<void>

  abstract transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T>

  abstract readSettings(trx?: sdk.TrxToken): Promise<TableSettings>

  abstract findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]>
  abstract findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]>
  abstract findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]>
  abstract findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]>
  abstract findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]>
  abstract findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]>
  abstract findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]>
  abstract findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]>
  abstract findTransactions(args: sdk.FindTransactionsArgs): Promise<TableTransaction[]>
  abstract findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]>
  abstract findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]>

  abstract countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number>
  abstract countCertificates(args: sdk.FindCertificatesArgs): Promise<number>
  abstract countCommissions(args: sdk.FindCommissionsArgs): Promise<number>
  abstract countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number>
  abstract countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number>
  abstract countOutputs(args: sdk.FindOutputsArgs): Promise<number>
  abstract countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number>
  abstract countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number>
  abstract countTransactions(args: sdk.FindTransactionsArgs): Promise<number>
  abstract countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number>
  abstract countUsers(args: sdk.FindUsersArgs): Promise<number>

  abstract getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]>
  abstract getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]>
  abstract getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]>
  abstract getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]>

  async findUserByIdentityKey(key: string): Promise<TableUser | undefined> {
    return verifyOneOrNone(await this.findUsers({ partial: { identityKey: key } }))
  }

  async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> {
    return getSyncChunk(this, args)
  }

  /**
   * Force dates to strings on SQLite and Date objects on MySQL
   * @param date
   * @returns
   */
  validateEntityDate(date: Date | string | number): Date | string {
    if (!this.dbtype) throw new sdk.WERR_INTERNAL('must call verifyReadyForDatabaseAccess first')
    let r: Date | string = this.validateDate(date)
    switch (this.dbtype) {
      case 'IndexedDB':
      case 'MySQL':
        break
      case 'SQLite':
        r = r.toISOString()
        break
      default:
        throw new sdk.WERR_INTERNAL(`Invalid dateScheme ${this.dbtype}`)
    }
    return r
  }

  /**
   *
   * @param date
   * @param useNowAsDefault if true and date is null or undefiend, set to current time.
   * @returns
   */
  validateOptionalEntityDate(
    date: Date | string | number | null | undefined,
    useNowAsDefault?: boolean
  ): Date | string | undefined {
    if (!this.dbtype) throw new sdk.WERR_INTERNAL('must call verifyReadyForDatabaseAccess first')
    let r: Date | string | undefined = this.validateOptionalDate(date)
    if (!r && useNowAsDefault) r = new Date()
    switch (this.dbtype) {
      case 'IndexedDB':
      case 'MySQL':
        break
      case 'SQLite':
        if (r) r = r.toISOString()
        break
      default:
        throw new sdk.WERR_INTERNAL(`Invalid dateScheme ${this.dbtype}`)
    }
    return r
  }

  validateDate(date: Date | string | number): Date {
    let r: Date
    if (date instanceof Date) r = date
    else r = new Date(date)
    return r
  }

  validateOptionalDate(date: Date | string | number | null | undefined): Date | undefined {
    if (date === null || date === undefined) return undefined
    return this.validateDate(date)
  }

  validateDateForWhere(date: Date | string | number): Date | string | number {
    if (!this.dbtype) throw new sdk.WERR_INTERNAL('must call verifyReadyForDatabaseAccess first')
    if (typeof date === 'number') date = validateSecondsSinceEpoch(date)
    const vdate = verifyTruthy(this.validateDate(date))
    let r: Date | string | number
    switch (this.dbtype) {
      case 'IndexedDB':
      case 'MySQL':
        r = vdate
        break
      case 'SQLite':
        r = vdate.toISOString()
        break
      default:
        throw new sdk.WERR_INTERNAL(`Invalid dateScheme ${this.dbtype}`)
    }
    return r
  }
}

export interface StorageReaderOptions {
  chain: sdk.Chain
}

export type DBType = 'SQLite' | 'MySQL' | 'IndexedDB'

type DbEntityTimeStamp<T extends sdk.EntityTimeStamp> = {
  [K in keyof T]: T[K] extends Date ? Date | string : T[K]
}
