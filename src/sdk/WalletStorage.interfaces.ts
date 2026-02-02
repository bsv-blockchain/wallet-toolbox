import {
  AbortActionArgs,
  AbortActionResult,
  Beef,
  ChainTracker,
  InternalizeActionArgs,
  InternalizeActionResult,
  ListActionsArgs,
  ListActionsResult,
  ListCertificatesResult,
  ListOutputsArgs,
  ListOutputsResult,
  RelinquishCertificateArgs,
  RelinquishOutputArgs,
  SendWithResult,
  TXIDHexString,
  Validation,
  WalletLoggerInterface
} from '@bsv/sdk'
import {
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
} from '../storage/schema/tables'
import { WalletServices } from './WalletServices.interfaces'
import { Chain, Paged, ProvenTxReqStatus, TransactionStatus } from './types'
import { WalletError } from './WalletError'

/**
 * This is the `WalletStorage` interface implemented by a class such as `WalletStorageManager`,
 * which manges an active and set of backup storage providers.
 *
 * Access and conrol is not directly managed. Typically each request is made with an associated identityKey
 * and it is left to the providers: physical access or remote channel authentication.
 */
export interface WalletStorage {
  /**
   * @returns false
   */
  isStorageProvider(): boolean

  isAvailable(): boolean
  makeAvailable(): Promise<TableSettings>
  migrate(storageName: string, storageIdentityKey: string): Promise<string>
  destroy(): Promise<void>

  setServices(v: WalletServices): void
  getServices(): WalletServices
  getSettings(): TableSettings

  getAuth(): Promise<AuthId>

  findOrInsertUser(identityKey: string): Promise<{ user: TableUser; isNew: boolean }>

  abortAction(args: AbortActionArgs): Promise<AbortActionResult>
  createAction(args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult>
  processAction(args: StorageProcessActionArgs): Promise<StorageProcessActionResults>
  internalizeAction(args: InternalizeActionArgs): Promise<InternalizeActionResult>

  findCertificates(args: FindCertificatesArgs): Promise<TableCertificateX[]>
  findOutputBaskets(args: FindOutputBasketsArgs): Promise<TableOutputBasket[]>
  findOutputs(args: FindOutputsArgs): Promise<TableOutput[]>
  findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>

  listActions(args: ListActionsArgs): Promise<ListActionsResult>
  listCertificates(args: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult>
  listOutputs(args: ListOutputsArgs): Promise<ListOutputsResult>

  insertCertificate(certificate: TableCertificateX): Promise<number>

  relinquishCertificate(args: RelinquishCertificateArgs): Promise<number>
  relinquishOutput(args: RelinquishOutputArgs): Promise<number>

  getStores(): WalletStorageInfo[]
}

/**
 * Snapshot of the current state of a storage provider configured for an `WalletStorageManager`.
 */
export interface WalletStorageInfo {
  isActive: boolean
  isEnabled: boolean
  isBackup: boolean
  isConflicting: boolean
  userId: number
  storageIdentityKey: string
  storageName: string
  storageClass: string
  endpointURL?: string
}

/**
 * This is the `WalletStorage` interface implemented with authentication checking and
 * is the actual minimal interface implemented by storage and remoted storage providers.
 */
export interface WalletStorageProvider extends WalletStorageSync {
  /**
   * @returns true if this object's interface can be extended to the full `StorageProvider` interface
   */
  isStorageProvider(): boolean
  setServices(v: WalletServices): void
}

export interface WalletStorageSync extends WalletStorageWriter {
  findOrInsertSyncStateAuth(
    auth: AuthId,
    storageIdentityKey: string,
    storageName: string
  ): Promise<{ syncState: TableSyncState; isNew: boolean }>

  /**
   * Updagte the `activeStorage` property of the authenticated user by their `userId`.
   * @param auth
   * @param newActiveStorageIdentityKey
   */
  setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number>

  getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk>
  processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult>
}

/**
 * This is the minimal interface required for a WalletStorageProvider to export data to another provider.
 */
export interface WalletStorageSyncReader {
  makeAvailable(): Promise<TableSettings>
  getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk>
}

export interface WalletStorageWriter extends WalletStorageReader {
  makeAvailable(): Promise<TableSettings>
  migrate(storageName: string, storageIdentityKey: string): Promise<string>
  destroy(): Promise<void>

  findOrInsertUser(identityKey: string): Promise<{ user: TableUser; isNew: boolean }>

  abortAction(auth: AuthId, args: AbortActionArgs): Promise<AbortActionResult>
  createAction(auth: AuthId, args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult>
  processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults>
  internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult>

  insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number>

  relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number>
  relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number>
}

export interface WalletStorageReader {
  isAvailable(): boolean

  getServices(): WalletServices
  getSettings(): TableSettings

  findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]>
  findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]>
  findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]>
  findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>

  listActions(auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult>
  listCertificates(auth: AuthId, vargs: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult>
  listOutputs(auth: AuthId, vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult>
}

export interface AuthId {
  identityKey: string
  userId?: number
  isActive?: boolean
}

export interface FindSincePagedArgs {
  since?: Date
  paged?: Paged
  trx?: TrxToken
  /**
   * Support for orderDescending is implemented in StorageKnex for basic table find methods,
   * excluding certificate_fields table, map tables, and settings (singleton row table).
   */
  orderDescending?: boolean
}

export interface FindForUserSincePagedArgs extends FindSincePagedArgs {
  userId: number
}

export interface FindPartialSincePagedArgs<T extends object> extends FindSincePagedArgs {
  partial: Partial<T>
}

export interface FindCertificatesArgs extends FindSincePagedArgs {
  partial: Partial<TableCertificate>
  certifiers?: string[]
  types?: string[]
  includeFields?: boolean
}

export interface FindOutputBasketsArgs extends FindSincePagedArgs {
  partial: Partial<TableOutputBasket>
}

export interface FindOutputsArgs extends FindSincePagedArgs {
  partial: Partial<TableOutput>
  noScript?: boolean
  txStatus?: TransactionStatus[]
}

export type StorageProvidedBy = 'you' | 'storage' | 'you-and-storage'

export interface StorageCreateTransactionSdkInput {
  vin: number
  sourceTxid: string
  sourceVout: number
  sourceSatoshis: number
  sourceLockingScript: string
  /**
   *
   */
  sourceTransaction?: number[]
  unlockingScriptLength: number
  providedBy: StorageProvidedBy
  type: string
  spendingDescription?: string
  derivationPrefix?: string
  derivationSuffix?: string
  senderIdentityKey?: string
}

export interface StorageCreateTransactionSdkOutput extends Validation.ValidCreateActionOutput {
  vout: number
  providedBy: StorageProvidedBy
  purpose?: string
  derivationSuffix?: string
}

export interface StorageCreateActionResult {
  inputBeef?: number[]
  inputs: StorageCreateTransactionSdkInput[]
  outputs: StorageCreateTransactionSdkOutput[]
  noSendChangeOutputVouts?: number[]
  derivationPrefix: string
  version: number
  lockTime: number
  reference: string
}

export interface StorageProcessActionArgs {
  isNewTx: boolean
  isSendWith: boolean
  isNoSend: boolean
  isDelayed: boolean
  reference?: string
  txid?: string
  rawTx?: number[]
  sendWith: string[]
  logger?: WalletLoggerInterface
}

export interface StorageInternalizeActionResult extends InternalizeActionResult {
  /** true if internalizing outputs on an existing storage transaction */
  isMerge: boolean
  /** txid of transaction being internalized */
  txid: string
  /** net change in change balance for user due to this internalization */
  satoshis: number

  /** valid iff not isMerge and txid was unknown to storage and non-delayed broadcast was not success */
  sendWithResults?: SendWithResult[]
  /** valid iff not isMerge and txid was unknown to storage and non-delayed broadcast was not success */
  notDelayedResults?: ReviewActionResult[]
}

/**
 * Indicates status of a new Action following a `createAction` or `signAction` in immediate mode:
 * When `acceptDelayedBroadcast` is falses.
 *
 * 'success': The action has been broadcast and accepted by the bitcoin processing network.
 * 'doulbeSpend': The action has been confirmed to double spend one or more inputs, and by the "first-seen-rule" is the loosing transaction.
 * 'invalidTx': The action was rejected by the processing network as an invalid bitcoin transaction.
 * 'serviceError': The broadcast services are currently unable to reach the bitcoin network. The action is now queued for delayed retries.
 */
export type ReviewActionResultStatus = 'success' | 'doubleSpend' | 'serviceError' | 'invalidTx'

export interface ReviewActionResult {
  txid: TXIDHexString
  status: ReviewActionResultStatus
  /**
   * Any competing txids reported for this txid, valid when status is 'doubleSpend'.
   */
  competingTxs?: string[]
  /**
   * Merged beef of competingTxs, valid when status is 'doubleSpend'.
   */
  competingBeef?: number[]
}

export interface StorageProcessActionResults {
  sendWithResults?: SendWithResult[]
  notDelayedResults?: ReviewActionResult[]
  log?: string
}

export interface ProvenOrRawTx {
  proven?: TableProvenTx
  rawTx?: number[]
  inputBEEF?: number[]
}

export interface PurgeParams {
  purgeCompleted: boolean
  purgeFailed: boolean
  purgeSpent: boolean

  /**
   * Minimum age in msecs for transient completed transaction data purge.
   * Default is 14 days.
   */
  purgeCompletedAge?: number
  /**
   * Minimum age in msecs for failed transaction data purge.
   * Default is 14 days.
   */
  purgeFailedAge?: number
  /**
   * Minimum age in msecs for failed transaction data purge.
   * Default is 14 days.
   */
  purgeSpentAge?: number
}

export interface PurgeResults {
  count: number
  log: string
}

export interface StorageProvenOrReq {
  proven?: TableProvenTx
  req?: TableProvenTxReq
  isNew?: boolean
}

/**
 * Specifies the available options for computing transaction fees.
 */
export interface StorageFeeModel {
  /**
   * Available models. Currently only "sat/kb" is supported.
   */
  model: 'sat/kb'
  /**
   * When "fee.model" is "sat/kb", this is an integer representing the number of satoshis per kb of block space
   * the transaction will pay in fees.
   *
   * If undefined, the default value is used.
   */
  value?: number
}

export interface StorageGetBeefOptions {
  /** if 'known', txids known to local storage as valid are included as txidOnly */
  trustSelf?: 'known'
  /** list of txids to be included as txidOnly if referenced. Validity is known to caller. */
  knownTxids?: string[]
  /** optional. If defined, raw transactions and merkle paths required by txid are merged to this instance and returned. Otherwise a new Beef is constructed and returned. */
  mergeToBeef?: Beef | number[]
  /** optional. Default is false. `storage` is used for raw transaction and merkle proof lookup */
  ignoreStorage?: boolean
  /** optional. Default is false. `getServices` is used for raw transaction and merkle proof lookup */
  ignoreServices?: boolean
  /** optional. Default is false. If true, raw transactions with proofs missing from `storage` and obtained from `getServices` are not inserted to `storage`. */
  ignoreNewProven?: boolean
  /** optional. Default is zero. Ignores available merkle paths until recursion detpth equals or exceeds value  */
  minProofLevel?: number
  /** optional. If valid, any merkleRoot that fails to validate will result in an exception without merging to `mergeToBeef`. */
  chainTracker?: ChainTracker
  /** optional. Default is false. If chainTracker is valid and an invalid proof is found: if true, pursues deeper beef. If false, throws WERR_INVALID_MERKLE_ROOT. */
  skipInvalidProofs?: boolean
}

export interface StorageSyncReaderOptions {
  chain: Chain
}

export interface FindCertificateFieldsArgs extends FindSincePagedArgs {
  partial: Partial<TableCertificateField>
}

export interface FindCommissionsArgs extends FindSincePagedArgs {
  partial: Partial<TableCommission>
}
export interface FindOutputTagMapsArgs extends FindSincePagedArgs {
  partial: Partial<TableOutputTagMap>
  tagIds?: number[]
}
export interface FindOutputTagsArgs extends FindSincePagedArgs {
  partial: Partial<TableOutputTag>
}
export interface FindProvenTxReqsArgs extends FindSincePagedArgs {
  partial: Partial<TableProvenTxReq>
  status?: ProvenTxReqStatus[]
  txids?: string[]
}
export interface FindProvenTxsArgs extends FindSincePagedArgs {
  partial: Partial<TableProvenTx>
}
export interface FindSyncStatesArgs extends FindSincePagedArgs {
  partial: Partial<TableSyncState>
}
export interface FindTransactionsArgs extends FindSincePagedArgs {
  partial: Partial<TableTransaction>
  status?: TransactionStatus[]
  noRawTx?: boolean
}
export interface FindTxLabelMapsArgs extends FindSincePagedArgs {
  partial: Partial<TableTxLabelMap>
  labelIds?: number[]
}
export interface FindTxLabelsArgs extends FindSincePagedArgs {
  partial: Partial<TableTxLabel>
}
export interface FindUsersArgs extends FindSincePagedArgs {
  partial: Partial<TableUser>
}
export interface FindMonitorEventsArgs extends FindSincePagedArgs {
  partial: Partial<TableMonitorEvent>
}
/**
 * Place holder for the transaction control object used by actual storage provider implementation.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrxToken {}

export interface UpdateProvenTxReqWithNewProvenTxArgs {
  provenTxReqId: number
  txid: string
  attempts: number
  status: ProvenTxReqStatus
  history: string
  height: number
  index: number
  blockHash: string
  merkleRoot: string
  merklePath: number[]
}

export interface UpdateProvenTxReqWithNewProvenTxResult {
  status: ProvenTxReqStatus
  history: string
  provenTxId: number
  log?: string
}

/**
 * success: Last sync of this user from this storage was successful.
 *
 * error: Last sync protocol operation for this user to this storage threw and error.
 *
 * identified: Configured sync storage has been identified but not sync'ed.
 *
 * unknown: Sync protocol state is unknown.
 */
export type SyncStatus = 'success' | 'error' | 'identified' | 'updated' | 'unknown'

export type SyncProtocolVersion = '0.1.0'

export interface RequestSyncChunkArgs {
  /**
   * The storageIdentityKey of the storage supplying the update SyncChunk data.
   */
  fromStorageIdentityKey: string
  /**
   * The storageIdentityKey of the storage consuming the update SyncChunk data.
   */
  toStorageIdentityKey: string

  /**
   * The identity of whose data is being requested
   */
  identityKey: string
  /**
   * The max updated_at time received from the storage service receiving the request.
   * Will be undefiend if this is the first request or if no data was previously sync'ed.
   *
   * `since` must include items if 'updated_at' is greater or equal. Thus, when not undefined, a sync request should always return at least one item already seen.
   */
  since?: Date
  /**
   * A rough limit on how large the response should be.
   * The item that exceeds the limit is included and ends adding more items.
   */
  maxRoughSize: number
  /**
   * The maximum number of items (records) to be returned.
   */
  maxItems: number
  /**
   * For each entity in dependency order, the offset at which to start returning items
   * from `since`.
   *
   * The entity order is:
   * 0 ProvenTxs
   * 1 ProvenTxReqs
   * 2 OutputBaskets
   * 3 TxLabels
   * 4 OutputTags
   * 5 Transactions
   * 6 TxLabelMaps
   * 7 Commissions
   * 8 Outputs
   * 9 OutputTagMaps
   * 10 Certificates
   * 11 CertificateFields
   */
  offsets: { name: string; offset: number }[]
}

/**
 * Result received from remote `WalletStorage` in response to a `RequestSyncChunkArgs` request.
 *
 * Each property is undefined if there was no attempt to update it. Typically this is caused by size and count limits on this result.
 *
 * If all properties are empty arrays the sync process has received all available new and updated items.
 */
export interface SyncChunk {
  fromStorageIdentityKey: string
  toStorageIdentityKey: string
  userIdentityKey: string

  user?: TableUser
  provenTxs?: TableProvenTx[]
  provenTxReqs?: TableProvenTxReq[]
  outputBaskets?: TableOutputBasket[]
  txLabels?: TableTxLabel[]
  outputTags?: TableOutputTag[]
  transactions?: TableTransaction[]
  txLabelMaps?: TableTxLabelMap[]
  commissions?: TableCommission[]
  outputs?: TableOutput[]
  outputTagMaps?: TableOutputTagMap[]
  certificates?: TableCertificate[]
  certificateFields?: TableCertificateField[]
}

export interface ProcessSyncChunkResult {
  done: boolean
  maxUpdated_at: Date | undefined
  updates: number
  inserts: number
  error?: WalletError
}

/**
 * Returned results from WalletStorageManager reproveHeader method.
 */
export interface ReproveHeaderResult {
  /**
   * Human readable log of the reproveHeader process.
   */
  log: string
  /**
   * List of proven_txs records that were updated with new proof data.
   */
  updated: { was: TableProvenTx; update: Partial<TableProvenTx>; logUpdate: string }[]
  /**
   * List of proven_txs records that were checked but currently available proof is unchanged.
   */
  unchanged: TableProvenTx[]
  /**
   * List of proven_txs records that were checked but currently proof data is unavailable.
   */
  unavailable: TableProvenTx[]
}

/**
 * Returned results from WalletStorageManager reproveProven method.
 */
export interface ReproveProvenResult {
  /**
   * Human readable log of the reproveProven process.
   */
  log: string
  /**
   * Valid if proof data for proven_txs record is available and has changed.
   */
  updated?: { update: Partial<TableProvenTx>; logUpdate: string }
  /**
   * True if proof data for proven_txs record was found to be unchanged.
   */
  unchanged: boolean
  /**
   * True if proof data for proven_txs record is currently unavailable.
   */
  unavailable: boolean
}
