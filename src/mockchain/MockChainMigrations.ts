import { Knex } from 'knex'

interface Migration {
  up: (knex: Knex) => Promise<void>
  down?: (knex: Knex) => Promise<void>
}

interface MigrationSource<TMigrationSpec> {
  getMigrations(loadExtensions: readonly string[]): Promise<TMigrationSpec[]>
  getMigrationName(migration: TMigrationSpec): string
  getMigration(migration: TMigrationSpec): Promise<Migration>
}

export class MockChainMigrations implements MigrationSource<string> {
  migrations: Record<string, Migration> = {}

  constructor() {
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

  setupMigrations(): Record<string, Migration> {
    const migrations: Record<string, Migration> = {}

    migrations['2026-01-01-001 initial mockchain tables'] = {
      async up(knex) {
        await knex.schema.createTable('mockchain_block_headers', table => {
          table.integer('height').primary()
          table.string('hash', 64).notNullable().unique()
          table.string('previousHash', 64).notNullable()
          table.string('merkleRoot', 64).notNullable()
          table.integer('version').notNullable().defaultTo(1)
          table.integer('time').notNullable()
          table.integer('bits').notNullable()
          table.integer('nonce').notNullable()
          table.string('coinbaseTxid', 64).notNullable()
          table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        })

        await knex.schema.createTable('mockchain_transactions', table => {
          table.string('txid', 64).primary()
          table.binary('rawTx').notNullable()
          table.integer('blockHeight').nullable()
          table.integer('blockIndex').nullable()
          table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        })

        await knex.schema.createTable('mockchain_utxos', table => {
          table.increments('id').primary()
          table.string('txid', 64).notNullable()
          table.integer('vout').notNullable()
          table.binary('lockingScript').notNullable()
          table.bigInteger('satoshis').notNullable()
          table.string('scriptHash', 64).notNullable()
          table.string('spentByTxid', 64).nullable()
          table.boolean('isCoinbase').notNullable().defaultTo(false)
          table.integer('blockHeight').nullable()
          table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
          table.unique(['txid', 'vout'])
          table.index('scriptHash')
          table.index('spentByTxid')
        })
      },
      async down(knex) {
        await knex.schema.dropTableIfExists('mockchain_utxos')
        await knex.schema.dropTableIfExists('mockchain_transactions')
        await knex.schema.dropTableIfExists('mockchain_block_headers')
      }
    }

    return migrations
  }
}
