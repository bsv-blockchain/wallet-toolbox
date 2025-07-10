/* eslint-disable @typescript-eslint/no-explicit-any */
import { Knex } from 'knex'
import { Chain } from '../../../../sdk'

interface Migration {
  up: (knex: Knex) => PromiseLike<any>
  down?: (knex: Knex) => PromiseLike<any>
}

interface MigrationSource<TMigrationSpec> {
  getMigrations(loadExtensions: readonly string[]): Promise<TMigrationSpec[]>
  getMigrationName(migration: TMigrationSpec): string
  getMigration(migration: TMigrationSpec): Promise<Migration>
}

export class KnexMigrations implements MigrationSource<string> {
  migrations: Record<string, Migration> = {}

  constructor(public chain: Chain) {
    this.migrations = this.setupMigrations()
  }

  async getMigrations(): Promise<string[]> {
    return Object.keys(this.migrations).sort()
  }

  getMigrationName(migration: string) {
    return migration
  }

  async getMigration(migration: string): Promise<Migration> {
    return this.migrations[migration]
  }

  async getLatestMigration(): Promise<string> {
    const ms = await this.getMigrations()
    return ms[ms.length - 1]
  }

  static async latestMigration(): Promise<string> {
    const km = new KnexMigrations('test')
    return await km.getLatestMigration()
  }

  setupMigrations(): Record<string, Migration> {
    const migrations: Record<string, Migration> = {}

    const liveHeadersTableName = `live_headers`
    const bulkFilesTableName = `bulk_files`

    migrations['2025-06-28-001 initial migration'] = {
      async up(knex) {
        await knex.schema.createTable(liveHeadersTableName, table => {
          table.increments('headerId')
          table.integer('previousHeaderId').unsigned().references('headerId').inTable(liveHeadersTableName)
          table.binary('previousHash', 32)
          table.integer('height').unsigned().notNullable
          table.boolean('isActive').notNullable
          table.boolean('isChainTip').notNullable
          table.binary('hash', 32).notNullable
          table.binary('chainWork', 32).notNullable
          table.integer('version').unsigned().notNullable
          table.binary('merkleRoot', 32).notNullable
          table.integer('time').unsigned().notNullable
          table.integer('bits').unsigned().notNullable
          table.integer('nonce').unsigned().notNullable

          table.index(['hash'])
          table.index(['previousHash'])
          table.index(['isChainTip'])
          table.index(['previousHeaderId'])
          table.index(['isActive'])
          table.index(['isActive', 'isChainTip'])
          table.index(['height'])
        })

        await knex.schema.createTable(bulkFilesTableName, table => {
          table.increments('fileId')
          table.string('chain').notNullable()
          table.string('fileName').notNullable()
          table.integer('firstHeight').unsigned().notNullable()
          table.integer('count').unsigned().notNullable()
          table.string('prevHash', 64).notNullable() // hex encoded
          table.string('lastHash', 64).notNullable() // hex encoded
          table.string('prevChainWork', 64).notNullable() // hex encoded
          table.string('lastChainWork', 64).notNullable() // hex encoded
          table.string('fileHash').notNullable() // base64 encoded
          table.boolean('validated').defaultTo(false).notNullable()
          table.binary('data', 32000000) // 32MB max size
        })
      },
      async down(knex) {
        await knex.schema.dropTable(liveHeadersTableName)
        await knex.schema.dropTable(bulkFilesTableName)
      }
    }

    return migrations
  }
}
