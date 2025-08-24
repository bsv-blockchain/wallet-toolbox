import { Chain } from '../../../../sdk'
import { ChaintracksStorageKnex, ChaintracksStorageKnexOptions } from './ChaintracksStorageKnex'
import knex from 'knex'

export interface ChaintracksStorageMemoryOptions extends ChaintracksStorageKnexOptions {
  sqliteClient: 'sqlite3' | 'better-sqlite3' | undefined
}

/*
export class ChaintracksStorageMemory extends ChaintracksStorageKnex {
  static createStorageMemoryOptions(chain: Chain) {
    const options: ChaintracksStorageMemoryOptions = {
      ...ChaintracksStorageKnex.createStorageKnexOptions(chain),
      sqliteClient: 'sqlite3'
    }
    return options
  }

  constructor(options: ChaintracksStorageMemoryOptions) {
    if (options.knex)
      throw new Error(
        'knex will be automatically configured from the sqliteClient property setting. Must be undefined.'
      )
    options.knex = knex({ client: options.sqliteClient || 'sqlite3', connection: ':memory:', useNullAsDefault: true })

    super(options)
  }
}
*/
