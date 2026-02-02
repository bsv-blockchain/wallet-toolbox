import {
  AbortActionArgs,
  AbortActionResult,
  InternalizeActionArgs,
  ListActionsResult,
  ListCertificatesResult,
  ListOutputsResult,
  RelinquishCertificateArgs,
  RelinquishOutputArgs,
  WalletInterface,
  AuthFetch,
  Validation,
  WalletLoggerInterface
} from '@bsv/sdk'
import {
  AuthId,
  FindCertificatesArgs,
  FindOutputBasketsArgs,
  FindOutputsArgs,
  FindProvenTxReqsArgs,
  ProcessSyncChunkResult,
  RequestSyncChunkArgs,
  StorageCreateActionResult,
  StorageInternalizeActionResult,
  StorageProcessActionArgs,
  StorageProcessActionResults,
  SyncChunk,
  UpdateProvenTxReqWithNewProvenTxArgs,
  UpdateProvenTxReqWithNewProvenTxResult,
  WalletStorageProvider
} from '../../sdk/WalletStorage.interfaces'
import { TableSettings } from '../schema/tables/TableSettings'
import { WERR_INVALID_OPERATION } from '../../sdk/WERR_errors'
import { WalletServices } from '../../sdk/WalletServices.interfaces'
import { TableUser } from '../schema/tables/TableUser'
import { TableSyncState } from '../schema/tables/TableSyncState'
import { TableCertificateX } from '../schema/tables/TableCertificate'
import { TableOutputBasket } from '../schema/tables/TableOutputBasket'
import { TableOutput } from '../schema/tables/TableOutput'
import { TableProvenTxReq } from '../schema/tables/TableProvenTxReq'
import { EntityTimeStamp } from '../../sdk/types'
import { WalletError } from '../../sdk/WalletError'
import { WalletErrorFromJson } from '../../sdk/WalletErrorFromJson'
import { logWalletError } from '../../WalletLogger'

/**
 * `StorageClient` implements the `WalletStorageProvider` interface which allows it to
 * serve as a BRC-100 wallet's active storage.
 *
 * Internally, it uses JSON-RPC over HTTPS to make requests of a remote server.
 * Typically this server uses the `StorageServer` class to implement the service.
 *
 * The `AuthFetch` component is used to secure and authenticate the requests to the remote server.
 *
 * `AuthFetch` is initialized with a BRC-100 wallet which establishes the identity of
 * the party making requests of the remote service.
 *
 * For details of the API implemented, follow the "See also" link for the `WalletStorageProvider` interface.
 */
export class StorageClient implements WalletStorageProvider {
  readonly endpointUrl: string
  private readonly authClient: AuthFetch
  private nextId = 1

  // Track ephemeral (in-memory) "settings" if you wish to align with isAvailable() checks
  public settings?: TableSettings

  constructor(wallet: WalletInterface, endpointUrl: string) {
    this.authClient = new AuthFetch(wallet)
    this.endpointUrl = endpointUrl
  }

  /**
   * The `StorageClient` implements the `WalletStorageProvider` interface.
   * It does not implement the lower level `StorageProvider` interface.
   *
   * @returns false
   */
  isStorageProvider(): boolean {
    return false
  }

  //////////////////////////////////////////////////////////////////////////////
  // JSON-RPC helper
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Make a JSON-RPC call to the remote server.
   * @param method The WalletStorage method name to call.
   * @param params The array of parameters to pass to the method in order.
   */
  private async rpcCall<T>(method: string, params: unknown[]): Promise<T> {
    let logger: WalletLoggerInterface | undefined = params[1]?.['logger']

    try {
      const id = this.nextId++

      if (logger) {
        // Replace logger object with seed json object to continue logging on request server.
        logger.group(`StorageClient ${method}`)
        params[1]!['logger'] = { indent: logger.indent || 0 }
      }

      const body = {
        jsonrpc: '2.0',
        method,
        params,
        id
      }

      let response: Response
      try {
        response = await this.authClient.fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      } catch (eu: unknown) {
        logWalletError(eu, logger, 'error requesting remote service')
        throw eu
      }

      if (!response.ok) {
        throw new Error(`WalletStorageClient rpcCall: network error ${response.status} ${response.statusText}`)
      }

      const json = await response.json()
      if (json.error) {
        logWalletError(json.error, logger, 'error from remote service')
        const werr = WalletErrorFromJson(json.error)
        throw werr
      }

      if (logger) {
        // merge log data from request processing
        logger.merge?.(json.result?.['log'])
        logger.groupEnd()
      }

      return json.result
    } catch (eu: unknown) {
      logWalletError(eu, logger, 'error setting up request to remote service')
      throw eu
    } finally {
      if (logger) {
        // Restore original logger in params
        params[1]!['logger'] = logger
      }
    }
  }

  /**
   * @returns true once storage `TableSettings` have been retreived from remote storage.
   */
  isAvailable(): boolean {
    // We'll just say "yes" if we have settings
    return !!this.settings
  }

  /**
   * @returns remote storage `TableSettings` if they have been retreived by `makeAvailable`.
   * @throws WERR_INVALID_OPERATION if `makeAvailable` has not yet been called.
   */
  getSettings(): TableSettings {
    if (!this.settings) {
      throw new WERR_INVALID_OPERATION('call makeAvailable at least once before getSettings')
    }
    return this.settings
  }

  /**
   * Must be called prior to making use of storage.
   * Retreives `TableSettings` from remote storage provider.
   * @returns remote storage `TableSettings`
   */
  async makeAvailable(): Promise<TableSettings> {
    if (!this.settings) {
      this.settings = await this.rpcCall<TableSettings>('makeAvailable', [])
    }
    return this.settings
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Implementation of all WalletStorage interface methods
  // They are simple pass-thrus to rpcCall
  //
  // IMPORTANT: The parameter ordering must match exactly as in your interface.
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Called to cleanup resources when no further use of this object will occur.
   */
  async destroy(): Promise<void> {
    return this.rpcCall<void>('destroy', [])
  }

  /**
   * Requests schema migration to latest.
   * Typically remote storage will ignore this request.
   * @param storageName Unique human readable name for remote storage if it does not yet exist.
   * @param storageIdentityKey Unique identity key for remote storage if it does not yet exist.
   * @returns current schema migration identifier
   */
  async migrate(storageName: string, storageIdentityKey: string): Promise<string> {
    return this.rpcCall<string>('migrate', [storageName])
  }

  /**
   * Remote storage does not offer `Services` to remote clients.
   * @throws WERR_INVALID_OPERATION
   */
  getServices(): WalletServices {
    // Typically, the client would not store or retrieve "Services" from a remote server.
    // The "services" in local in-memory usage is a no-op or your own approach:
    throw new WERR_INVALID_OPERATION(
      'getServices() not implemented in remote client. This method typically is not used remotely.'
    )
  }

  /**
   * Ignored. Remote storage cannot share `Services` with remote clients.
   */
  setServices(v: WalletServices): void {
    // Typically no-op for remote client
    // Because "services" are usually local definitions to the Storage.
  }

  /**
   * Storage level processing for wallet `internalizeAction`.
   * Updates internalized outputs in remote storage.
   * Triggers proof validation of containing transaction.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args Original wallet `internalizeAction` arguments.
   * @returns `internalizeAction` results
   */
  async internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult> {
    return this.rpcCall<StorageInternalizeActionResult>('internalizeAction', [auth, args])
  }

  /**
   * Storage level processing for wallet `createAction`.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args Validated extension of original wallet `createAction` arguments.
   * @returns `StorageCreateActionResults` supporting additional wallet processing to yield `createAction` results.
   */
  async createAction(auth: AuthId, args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult> {
    return this.rpcCall<StorageCreateActionResult>('createAction', [auth, args])
  }

  /**
   * Storage level processing for wallet `createAction` and `signAction`.
   *
   * Handles remaining storage tasks once a fully signed transaction has been completed. This is common to both `createAction` and `signAction`.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args `StorageProcessActionArgs` convey completed signed transaction to storage.
   * @returns `StorageProcessActionResults` supporting final wallet processing to yield `createAction` or `signAction` results.
   */
  async processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults> {
    return this.rpcCall<StorageProcessActionResults>('processAction', [auth, args])
  }

  /**
   * Aborts an action by `reference` string.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args original wallet `abortAction` args.
   * @returns `abortAction` result.
   */
  async abortAction(auth: AuthId, args: AbortActionArgs): Promise<AbortActionResult> {
    return this.rpcCall<AbortActionResult>('abortAction', [auth, args])
  }

  /**
   * Used to both find and initialize a new user by identity key.
   * It is up to the remote storage whether to allow creation of new users by this method.
   * @param identityKey of the user.
   * @returns `TableUser` for the user and whether a new user was created.
   */
  async findOrInsertUser(identityKey): Promise<{ user: TableUser; isNew: boolean }> {
    return this.rpcCall<{ user: TableUser; isNew: boolean }>('findOrInsertUser', [identityKey])
  }

  /**
   * Used to both find and insert a `TableSyncState` record for the user to track wallet data replication across storage providers.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param storageName the name of the remote storage being sync'd
   * @param storageIdentityKey the identity key of the remote storage being sync'd
   * @returns `TableSyncState` and whether a new record was created.
   */
  async findOrInsertSyncStateAuth(
    auth: AuthId,
    storageIdentityKey: string,
    storageName: string
  ): Promise<{ syncState: TableSyncState; isNew: boolean }> {
    const r = await this.rpcCall<{ syncState: TableSyncState; isNew: boolean }>('findOrInsertSyncStateAuth', [
      auth,
      storageIdentityKey,
      storageName
    ])
    r.syncState = this.validateEntity(r.syncState, ['when'])
    return r
  }

  /**
   * Inserts a new certificate with fields and keyring into remote storage.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param certificate the certificate to insert.
   * @returns record Id of the inserted `TableCertificate` record.
   */
  async insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number> {
    const r = await this.rpcCall<number>('insertCertificateAuth', [auth, certificate])
    return r
  }

  /**
   * Storage level processing for wallet `listActions`.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args Validated extension of original wallet `listActions` arguments.
   * @returns `listActions` results.
   */
  async listActions(auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> {
    const r = await this.rpcCall<ListActionsResult>('listActions', [auth, vargs])
    return r
  }

  /**
   * Storage level processing for wallet `listOutputs`.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args Validated extension of original wallet `listOutputs` arguments.
   * @returns `listOutputs` results.
   */
  async listOutputs(auth: AuthId, vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult> {
    const r = await this.rpcCall<ListOutputsResult>('listOutputs', [auth, vargs])
    return r
  }

  /**
   * Storage level processing for wallet `listCertificates`.
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args Validated extension of original wallet `listCertificates` arguments.
   * @returns `listCertificates` results.
   */
  async listCertificates(auth: AuthId, vargs: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult> {
    const r = await this.rpcCall<ListCertificatesResult>('listCertificates', [auth, vargs])
    return r
  }

  /**
   * Find user certificates, optionally with fields.
   *
   * This certificate retrieval method supports internal wallet operations.
   * Field values are stored and retrieved encrypted.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args `FindCertificatesArgs` determines which certificates to retrieve and whether to include fields.
   * @returns array of certificates matching args.
   */
  async findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]> {
    const r = await this.rpcCall<TableCertificateX[]>('findCertificatesAuth', [auth, args])
    this.validateEntities(r)
    if (args.includeFields) {
      for (const c of r) {
        if (c.fields) this.validateEntities(c.fields)
      }
    }
    return r
  }

  /**
   * Find output baskets.
   *
   * This retrieval method supports internal wallet operations.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args `FindOutputBasketsArgs` determines which baskets to retrieve.
   * @returns array of output baskets matching args.
   */
  async findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    const r = await this.rpcCall<TableOutputBasket[]>('findOutputBaskets', [auth, args])
    this.validateEntities(r)
    return r
  }

  /**
   * Find outputs.
   *
   * This retrieval method supports internal wallet operations.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args `FindOutputsArgs` determines which outputs to retrieve.
   * @returns array of outputs matching args.
   */
  async findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]> {
    const r = await this.rpcCall<TableOutput[]>('findOutputsAuth', [auth, args])
    this.validateEntities(r)
    return r
  }

  /**
   * Find requests for transaction proofs.
   *
   * This retrieval method supports internal wallet operations.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args `FindProvenTxReqsArgs` determines which proof requests to retrieve.
   * @returns array of proof requests matching args.
   */
  async findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> {
    const r = await this.rpcCall<TableProvenTxReq[]>('findProvenTxReqs', [args])
    this.validateEntities(r)
    return r
  }

  /**
   * Relinquish a certificate.
   *
   * For storage supporting replication records must be kept of deletions. Therefore certificates are marked as deleted
   * when relinquished, and no longer returned by `listCertificates`, but are still retained by storage.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args original wallet `relinquishCertificate` args.
   */
  async relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number> {
    return this.rpcCall<number>('relinquishCertificate', [auth, args])
  }

  /**
   * Relinquish an output.
   *
   * Relinquishing an output removes the output from whatever basket was tracking it.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param args original wallet `relinquishOutput` args.
   */
  async relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number> {
    return this.rpcCall<number>('relinquishOutput', [auth, args])
  }

  /**
   * Process a "chunk" of replication data for the user.
   *
   * The normal data flow is for the active storage to push backups as a sequence of data chunks to backup storage providers.
   *
   * @param args a copy of the replication request args that initiated the sequence of data chunks.
   * @param chunk the current data chunk to process.
   * @returns whether processing is done, counts of inserts and udpates, and related progress tracking properties.
   */
  async processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult> {
    const r = await this.rpcCall<ProcessSyncChunkResult>('processSyncChunk', [args, chunk])
    return r
  }

  /**
   * Request a "chunk" of replication data for a specific user and storage provider.
   *
   * The normal data flow is for the active storage to push backups as a sequence of data chunks to backup storage providers.
   * Also supports recovery where non-active storage can attempt to merge available data prior to becoming active.
   *
   * @param args that identify the non-active storage which will receive replication data and constrains the replication process.
   * @returns the next "chunk" of replication data
   */
  async getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk> {
    const r = await this.rpcCall<SyncChunk>('getSyncChunk', [args])
    if (r.certificateFields) r.certificateFields = this.validateEntities(r.certificateFields)
    if (r.certificates) r.certificates = this.validateEntities(r.certificates)
    if (r.commissions) r.commissions = this.validateEntities(r.commissions)
    if (r.outputBaskets) r.outputBaskets = this.validateEntities(r.outputBaskets)
    if (r.outputTagMaps) r.outputTagMaps = this.validateEntities(r.outputTagMaps)
    if (r.outputTags) r.outputTags = this.validateEntities(r.outputTags)
    if (r.outputs) r.outputs = this.validateEntities(r.outputs)
    if (r.provenTxReqs) r.provenTxReqs = this.validateEntities(r.provenTxReqs)
    if (r.provenTxs) r.provenTxs = this.validateEntities(r.provenTxs)
    if (r.transactions) r.transactions = this.validateEntities(r.transactions)
    if (r.txLabelMaps) r.txLabelMaps = this.validateEntities(r.txLabelMaps)
    if (r.txLabels) r.txLabels = this.validateEntities(r.txLabels)
    if (r.user) r.user = this.validateEntity(r.user)
    return r
  }

  /**
   * Handles the data received when a new transaction proof is found in response to an outstanding request for proof data:
   *
   *   - Creates a new `TableProvenTx` record.
   *   - Notifies all user transaction records of the new status.
   *   - Updates the proof request record to 'completed' status which enables delayed deletion.
   *
   * @param args proof request and new transaction proof data
   * @returns results of updates
   */
  async updateProvenTxReqWithNewProvenTx(
    args: UpdateProvenTxReqWithNewProvenTxArgs
  ): Promise<UpdateProvenTxReqWithNewProvenTxResult> {
    const r = await this.rpcCall<UpdateProvenTxReqWithNewProvenTxResult>('updateProvenTxReqWithNewProvenTx', [args])
    return r
  }

  /**
   * Ensures up-to-date wallet data replication to all configured backup storage providers,
   * then promotes one of the configured backups to active,
   * demoting the current active to new backup.
   *
   * @param auth Identifies client by identity key and the storage identity key of their currently active storage.
   * This must match the `AuthFetch` identity securing the remote conneciton.
   * @param newActiveStorageIdentityKey which must be a currently configured backup storage provider.
   */
  async setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number> {
    return this.rpcCall<number>('setActive', [auth, newActiveStorageIdentityKey])
  }

  validateDate(date: Date | string | number): Date {
    let r: Date
    if (date instanceof Date) r = date
    else r = new Date(date)
    return r
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process all individual records with time stamps retreived from database.
   */
  validateEntity<T extends EntityTimeStamp>(entity: T, dateFields?: string[]): T {
    entity.created_at = this.validateDate(entity.created_at)
    entity.updated_at = this.validateDate(entity.updated_at)
    if (dateFields) {
      for (const df of dateFields) {
        if (entity[df]) entity[df] = this.validateDate(entity[df])
      }
    }
    for (const key of Object.keys(entity)) {
      const val = entity[key]
      if (val === null) {
        entity[key] = undefined
      } else if (val instanceof Uint8Array) {
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
  validateEntities<T extends EntityTimeStamp>(entities: T[], dateFields?: string[]): T[] {
    for (let i = 0; i < entities.length; i++) {
      entities[i] = this.validateEntity(entities[i], dateFields)
    }
    return entities
  }
}
