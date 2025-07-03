// @ts-nocheck
import { Chain } from '@cwi/chaintracks-base'
import { StorageEngineKnex, StorageEngineKnexOptions } from './ChaintracksStorageKnex'
import knex from 'knex'

export interface StorageEngineMemoryOptions extends StorageEngineKnexOptions {
  sqliteClient: 'sqlite3' | 'better-sqlite3' | undefined
}

export class StorageEngineMemory extends StorageEngineKnex {
  static createStorageEngineMemoryOptions(chain: Chain) {
    const options: StorageEngineMemoryOptions = {
      ...StorageEngineKnex.createStorageEngineKnexOptions(chain),
      sqliteClient: 'sqlite3'
    }
    return options
  }

  constructor(options: StorageEngineMemoryOptions) {
    if (options.knex)
      throw new Error(
        'knex will be automatically configured from the sqliteClient property setting. Must be undefined.'
      )
    options.knex = knex({ client: options.sqliteClient || 'sqlite3', connection: ':memory:', useNullAsDefault: true })

    super(options)
  }
}
