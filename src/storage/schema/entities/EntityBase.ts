import { TrxToken } from '../../../sdk/WalletStorage.interfaces'
import { StorageProvider } from '../../StorageProvider'

export type EntityStorage = StorageProvider

export abstract class EntityBase<T> {
  api: T

  constructor(api: T) {
    this.api = api
  }

  /**
   * Standard property for entity database Id
   */
  abstract get id(): number

  /**
   * Name of derived entity class
   */
  abstract get entityName(): string

  /**
   * Schema table name of entity
   */
  abstract get entityTable(): string

  /**
   * On construction, an entity may decode properties of the `api` object,
   * such as JSON stringified objects.
   *
   * The `updateApi` method must re-encode the current state of those decoded properties
   * into the `api` object.
   *
   * Used by the `toApi` method to return an updated `api` object.
   */
  abstract updateApi(): void

  /**
   * Tests for equality or 'merge' / 'convergent' equality if syncMap is provided.
   *
   * 'convergent' equality must satisfy (A sync B) equals (B sync A)
   *
   * @param ei
   * @param syncMap
   */
  abstract equals(ei: T, syncMap?: SyncMap): boolean

  /**
   * Perform a 'merge' / 'convergent' equality migration of state
   * to this new local entity which was constructed
   * as a copy of the external object.
   *
   * @param userId local userId
   * @param syncMap
   */
  abstract mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void>

  /**
   * Perform a 'merge' / 'convergent' equality migration of state
   * from external `ei` to this existing local EntityUser
   *
   * @param ei
   * @param syncMap
   * @returns true iff entity state changed and was updated to storage
   */
  abstract mergeExisting(
    storage: EntityStorage,
    since: Date | undefined,
    ei: T,
    syncMap: SyncMap,
    trx?: TrxToken
  ): Promise<boolean>

  /**
   * An entity may decode properties of the underlying Api object on construction.
   *
   * The `toApi` method forces an `updateApi` before returning the underlying,
   * now updated, Api object.
   *
   * @returns The underlying Api object with any entity decoded properties updated.
   */
  toApi(): T {
    this.updateApi()
    return this.api
  }
}

export interface EntitySyncMap {
  entityName: string

  /**
   * Maps foreign ids to local ids
   * Some entities don't have idMaps (CertificateField, TxLabelMap and OutputTagMap)
   */
  idMap: Record<number, number>

  /**
   * the maximum updated_at value seen for this entity over chunks received
   * during this udpate cycle.
   */
  maxUpdated_at?: Date

  /**
   * The cummulative count of items of this entity type received over all the `SyncChunk`s
   * since the `since` was last updated.
   *
   * This is the `offset` value to use for the next SyncChunk request.
   */
  count: number
}

export interface SyncMap {
  provenTx: EntitySyncMap
  outputBasket: EntitySyncMap
  transaction: EntitySyncMap
  provenTxReq: EntitySyncMap
  txLabel: EntitySyncMap
  txLabelMap: EntitySyncMap
  output: EntitySyncMap
  outputTag: EntitySyncMap
  outputTagMap: EntitySyncMap
  certificate: EntitySyncMap
  certificateField: EntitySyncMap
  commission: EntitySyncMap
}

export function createSyncMap(): SyncMap {
  const r: SyncMap = {
    provenTx: {
      entityName: 'provenTx',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    outputBasket: {
      entityName: 'outputBasket',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    transaction: {
      entityName: 'transaction',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    provenTxReq: {
      entityName: 'provenTxReq',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    txLabel: {
      entityName: 'txLabel',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    txLabelMap: {
      entityName: 'txLabelMap',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    output: {
      entityName: 'output',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    outputTag: {
      entityName: 'outputTag',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    outputTagMap: {
      entityName: 'outputTagMap',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    certificate: {
      entityName: 'certificate',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    certificateField: {
      entityName: 'certificateField',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    },
    commission: {
      entityName: 'commission',
      idMap: {},
      maxUpdated_at: undefined,
      count: 0
    }
  }
  return r
}

export interface SyncError {
  code: string
  description: string
  stack?: string
}
