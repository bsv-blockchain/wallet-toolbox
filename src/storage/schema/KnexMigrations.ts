/* eslint-disable @typescript-eslint/no-unused-vars */
import { Knex } from 'knex'
import { DBType } from '../StorageReader'
import { Chain } from '../../sdk/types'
import { StorageKnex } from '../StorageKnex'
import { WalletError } from '../../sdk/WalletError'
import { WERR_NOT_IMPLEMENTED } from '../../sdk/WERR_errors'

interface Migration {
  up: (knex: Knex) => Promise<void>
  down?: (knex: Knex) => Promise<void>
  config?: object
}

interface MigrationSource<TMigrationSpec> {
  getMigrations(loadExtensions: readonly string[]): Promise<TMigrationSpec[]>
  getMigrationName(migration: TMigrationSpec): string
  getMigration(migration: TMigrationSpec): Promise<Migration>
}

export class KnexMigrations implements MigrationSource<string> {
  migrations: Record<string, Migration> = {}

  /**
   * @param chain
   * @param storageName human readable name for this storage instance
   * @param maxOutputScriptLength limit for scripts kept in outputs table, longer scripts will be pulled from rawTx
   */
  constructor(
    public chain: Chain,
    public storageName: string,
    public storageIdentityKey: string,
    public maxOutputScriptLength: number
  ) {
    this.migrations = this.setupMigrations(chain, storageName, storageIdentityKey, maxOutputScriptLength)
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
    const km = new KnexMigrations('test', 'dummy', '1'.repeat(64), 100)
    return await km.getLatestMigration()
  }

  setupMigrations(
    chain: string,
    storageName: string,
    storageIdentityKey: string,
    maxOutputScriptLength: number
  ): Record<string, Migration> {
    const migrations: Record<string, Migration> = {}

    const addTimeStamps = (knex: Knex<any, any[]>, table: Knex.CreateTableBuilder, dbtype: DBType) => {
      if (dbtype === 'MySQL') {
        table.timestamp('created_at', { precision: 3 }).defaultTo(knex.fn.now(3)).notNullable()
        table.timestamp('updated_at', { precision: 3 }).defaultTo(knex.fn.now(3)).notNullable()
      } else {
        table.timestamp('created_at', { precision: 3 }).defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at', { precision: 3 }).defaultTo(knex.fn.now()).notNullable()
      }
    }

    migrations['2025-10-13-001 add outputs spendable index'] = {
      async up(knex) {
        await knex.schema.alterTable('outputs', table => {
          table.index('spendable')
        })
      },
      async down(knex) {
        await knex.schema.alterTable('outputs', table => {
          table.dropIndex('spendable')
        })
      }
    }

    migrations['2025-10-18-002 add proven_tx_reqs txid index'] = {
      async up(knex) {
        await knex.schema.alterTable('proven_tx_reqs', table => {
          table.index('txid')
        })
      },
      async down(knex) {
        await knex.schema.alterTable('proven_tx_reqs', table => {
          table.dropIndex('txid')
        })
      }
    }

    migrations['2025-10-18-001 add transactions txid index'] = {
      async up(knex) {
        await knex.schema.alterTable('transactions', table => {
          table.index('txid')
        })
      },
      async down(knex) {
        await knex.schema.alterTable('transactions', table => {
          table.dropIndex('txid')
        })
      }
    }

    migrations['2025-09-06-001 add proven txs blockHash index'] = {
      async up(knex) {
        await knex.schema.alterTable('proven_txs', table => {
          table.index('blockHash')
        })
      },
      async down(knex) {
        await knex.schema.alterTable('proven_txs', table => {
          table.dropIndex('blockHash')
        })
      }
    }

    migrations['2025-05-13-001 add monitor events event index'] = {
      async up(knex) {
        await knex.schema.alterTable('monitor_events', table => {
          table.index('event')
        })
      },
      async down(knex) {
        await knex.schema.alterTable('monitor_events', table => {
          table.dropIndex('event')
        })
      }
    }

    migrations['2025-03-03-001 descriptions to 2000'] = {
      async up(knex) {
        await knex.schema.alterTable('transactions', table => {
          table.string('description', 2048).alter()
        })
        await knex.schema.alterTable('outputs', table => {
          table.string('outputDescription', 2048).alter()
          table.string('spendingDescription', 2048).alter()
        })
      },
      async down(knex) {}
    }

    migrations['2025-03-01-001 reset req history'] = {
      async up(knex) {
        const storage = new StorageKnex({
          ...StorageKnex.defaultOptions(),
          chain: <Chain>chain,
          knex
        })
        const settings = await storage.makeAvailable()
        await knex.raw(`update proven_tx_reqs set history = '{}'`)
      },
      async down(knex) {
        // No way back...
      }
    }

    migrations['2025-02-28-001 derivations to 200'] = {
      async up(knex) {
        await knex.schema.alterTable('outputs', table => {
          table.string('derivationPrefix', 200).alter()
          table.string('derivationSuffix', 200).alter()
        })
      },
      async down(knex) {
        await knex.schema.alterTable('outputs', table => {
          table.string('derivationPrefix', 32).alter()
          table.string('derivationSuffix', 32).alter()
        })
      }
    }

    migrations['2025-02-22-001 nonNULL activeStorage'] = {
      async up(knex) {
        const storage = new StorageKnex({
          ...StorageKnex.defaultOptions(),
          chain: <Chain>chain,
          knex
        })
        const settings = await storage.makeAvailable()
        await knex.raw(`update users set activeStorage = '${settings.storageIdentityKey}' where activeStorage is NULL`)
        await knex.schema.alterTable('users', table => {
          table.string('activeStorage').notNullable().alter()
        })
      },
      async down(knex) {
        await knex.schema.alterTable('users', table => {
          table.string('activeStorage').nullable().alter()
        })
      }
    }

    migrations['2025-01-21-001 add activeStorage to users'] = {
      async up(knex) {
        await knex.schema.alterTable('users', table => {
          table.string('activeStorage', 130).nullable().defaultTo(null)
        })
      },
      async down(knex) {
        await knex.schema.alterTable('users', table => {
          table.dropColumn('activeStorage')
        })
      }
    }

    migrations['2024-12-26-001 initial migration'] = {
      async up(knex) {
        const dbtype = await determineDBType(knex)

        await knex.schema.createTable('proven_txs', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('provenTxId').notNullable()
          table.string('txid', 64).notNullable().unique()
          table.integer('height').unsigned().notNullable()
          table.integer('index').unsigned().notNullable()
          table.binary('merklePath').notNullable()
          table.binary('rawTx').notNullable()
          table.string('blockHash', 64).notNullable()
          table.string('merkleRoot', 64).notNullable()
        })
        await knex.schema.createTable('proven_tx_reqs', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('provenTxReqId')
          table.integer('provenTxId').unsigned().references('provenTxId').inTable('proven_txs')
          table.string('status', 16).notNullable().defaultTo('unknown')
          table.integer('attempts').unsigned().defaultTo(0).notNullable()
          table.boolean('notified').notNullable().defaultTo(false)
          table.string('txid', 64).notNullable().unique()
          table.string('batch', 64).nullable()
          table.text('history', 'longtext').notNullable().defaultTo('{}')
          table.text('notify', 'longtext').notNullable().defaultTo('{}')
          table.binary('rawTx').notNullable()
          table.binary('inputBEEF')
          table.index('status')
          table.index('batch')
        })
        await knex.schema.createTable('users', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('userId')
          table.string('identityKey', 130).notNullable().unique()
        })
        await knex.schema.createTable('certificates', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('certificateId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.string('serialNumber', 100).notNullable()
          table.string('type', 100).notNullable()
          table.string('certifier', 100).notNullable()
          table.string('subject', 100).notNullable()
          table.string('verifier', 100).nullable()
          table.string('revocationOutpoint', 100).notNullable()
          table.string('signature', 255).notNullable()
          table.boolean('isDeleted').notNullable().defaultTo(false)
          table.unique(['userId', 'type', 'certifier', 'serialNumber'])
        })
        await knex.schema.createTable('certificate_fields', table => {
          addTimeStamps(knex, table, dbtype)
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.integer('certificateId').unsigned().references('certificateId').inTable('certificates').notNullable()
          table.string('fieldName', 100).notNullable()
          table.string('fieldValue').notNullable()
          table.string('masterKey', 255).defaultTo('').notNullable()
          table.unique(['fieldName', 'certificateId'])
        })
        await knex.schema.createTable('output_baskets', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('basketId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.string('name', 300).notNullable()
          table.integer('numberOfDesiredUTXOs', 6).defaultTo(6).notNullable()
          table.integer('minimumDesiredUTXOValue', 15).defaultTo(10000).notNullable()
          table.boolean('isDeleted').notNullable().defaultTo(false)
          table.unique(['name', 'userId'])
        })
        await knex.schema.createTable('transactions', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('transactionId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.integer('provenTxId').unsigned().references('provenTxId').inTable('proven_txs')
          table.string('status', 64).notNullable()
          table.string('reference', 64).notNullable().unique()
          table.boolean('isOutgoing').notNullable()
          table.bigint('satoshis').defaultTo(0).notNullable()
          table.integer('version').unsigned().nullable()
          table.integer('lockTime').unsigned().nullable()
          table.string('description', 500).notNullable()
          table.string('txid', 64)
          table.binary('inputBEEF')
          table.binary('rawTx')
          table.index('status')
        })
        await knex.schema.createTable('commissions', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('commissionId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table
            .integer('transactionId')
            .unsigned()
            .references('transactionId')
            .inTable('transactions')
            .notNullable()
            .unique()
          table.integer('satoshis', 15).notNullable()
          table.string('keyOffset', 130).notNullable()
          table.boolean('isRedeemed').defaultTo(false).notNullable()
          table.binary('lockingScript').notNullable()
          table.index('transactionId')
        })
        await knex.schema.createTable('outputs', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('outputId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.integer('transactionId').unsigned().references('transactionId').inTable('transactions').notNullable()
          table.integer('basketId').unsigned().references('basketId').inTable('output_baskets')
          table.boolean('spendable').defaultTo(false).notNullable()
          table.boolean('change').defaultTo(false).notNullable()
          table.integer('vout', 10).notNullable()
          table.bigint('satoshis').notNullable()
          table.string('providedBy', 130).notNullable()
          table.string('purpose', 20).notNullable()
          table.string('type', 50).notNullable()
          table.string('outputDescription', 300) // allow extra room for encryption and imports
          table.string('txid', 64)
          table.string('senderIdentityKey', 130)
          table.string('derivationPrefix', 32)
          table.string('derivationSuffix', 32)
          table.string('customInstructions', 2500)
          table.integer('spentBy').unsigned().references('transactionId').inTable('transactions')
          table.integer('sequenceNumber').unsigned().nullable()
          table.string('spendingDescription')
          table.bigint('scriptLength').unsigned().nullable()
          table.bigint('scriptOffset').unsigned().nullable()
          table.binary('lockingScript')
          table.unique(['transactionId', 'vout', 'userId'])
        })
        await knex.schema.createTable('output_tags', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('outputTagId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.string('tag', 150).notNullable()
          table.boolean('isDeleted').notNullable().defaultTo(false)
          table.unique(['tag', 'userId'])
        })
        await knex.schema.createTable('output_tags_map', table => {
          addTimeStamps(knex, table, dbtype)
          table.integer('outputTagId').unsigned().references('outputTagId').inTable('output_tags').notNullable()
          table.integer('outputId').unsigned().references('outputId').inTable('outputs').notNullable()
          table.boolean('isDeleted').notNullable().defaultTo(false)
          table.unique(['outputTagId', 'outputId'])
          table.index('outputId')
        })
        await knex.schema.createTable('tx_labels', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('txLabelId')
          table.integer('userId').unsigned().references('userId').inTable('users').notNullable()
          table.string('label', 300).notNullable()
          table.boolean('isDeleted').notNullable().defaultTo(false)
          table.unique(['label', 'userId'])
        })
        await knex.schema.createTable('tx_labels_map', table => {
          addTimeStamps(knex, table, dbtype)
          table.integer('txLabelId').unsigned().references('txLabelId').inTable('tx_labels').notNullable()
          table.integer('transactionId').unsigned().references('transactionId').inTable('transactions').notNullable()
          table.boolean('isDeleted').notNullable().defaultTo(false)
          table.unique(['txLabelId', 'transactionId'])
          table.index('transactionId')
        })
        await knex.schema.createTable('monitor_events', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('id')
          table.string('event', 64).notNullable()
          table.text('details', 'longtext').nullable()
        })
        await knex.schema.createTable('settings', table => {
          addTimeStamps(knex, table, dbtype)
          table.string('storageIdentityKey', 130).notNullable()
          table.string('storageName', 128).notNullable()
          table.string('chain', 10).notNullable()
          table.string('dbtype', 10).notNullable()
          table.integer('maxOutputScript', 15).notNullable()
        })
        await knex.schema.createTable('sync_states', table => {
          addTimeStamps(knex, table, dbtype)
          table.increments('syncStateId')
          table.integer('userId').unsigned().notNullable().references('userId').inTable('users')
          table.string('storageIdentityKey', 130).notNullable().defaultTo('')
          table.string('storageName').notNullable()
          table.string('status').notNullable().defaultTo('unknown')
          table.boolean('init').notNullable().defaultTo(false)
          table.string('refNum', 100).notNullable().unique()
          table.text('syncMap', 'longtext').notNullable()
          table.dateTime('when')
          table.bigint('satoshis')
          table.text('errorLocal', 'longtext')
          table.text('errorOther', 'longtext')
          table.index('status')
          table.index('refNum')
        })

        if (dbtype === 'MySQL') {
          await knex.raw('ALTER TABLE proven_tx_reqs MODIFY COLUMN rawTx LONGBLOB')
          await knex.raw('ALTER TABLE proven_tx_reqs MODIFY COLUMN inputBEEF LONGBLOB')
          await knex.raw('ALTER TABLE proven_txs MODIFY COLUMN rawTx LONGBLOB')
          await knex.raw('ALTER TABLE transactions MODIFY COLUMN rawTx LONGBLOB')
          await knex.raw('ALTER TABLE transactions MODIFY COLUMN inputBEEF LONGBLOB')
          await knex.raw('ALTER TABLE outputs MODIFY COLUMN lockingScript LONGBLOB')
        } else {
          await knex.schema.alterTable('proven_tx_reqs', table => {
            table.binary('rawTx', 10000000).alter()
            table.binary('beef', 10000000).alter()
          })
          await knex.schema.alterTable('outputs', table => {
            table.binary('lockingScript', 10000000).alter()
          })
          await knex.schema.alterTable('proven_txs', table => {
            table.binary('rawTx', 10000000).alter()
          })
          await knex.schema.alterTable('transactions', table => {
            table.binary('rawTx', 10000000).alter()
            table.binary('beef', 10000000).alter()
          })
        }

        await knex('settings').insert({
          storageIdentityKey,
          storageName,
          chain,
          dbtype,
          maxOutputScript: maxOutputScriptLength
        })
      },
      async down(knex) {
        await knex.schema.dropTable('sync_states')
        await knex.schema.dropTable('settings')
        await knex.schema.dropTable('monitor_events')
        await knex.schema.dropTable('certificate_fields')
        await knex.schema.dropTable('certificates')
        await knex.schema.dropTable('commissions')
        await knex.schema.dropTable('output_tags_map')
        await knex.schema.dropTable('output_tags')
        await knex.schema.dropTable('outputs')
        await knex.schema.dropTable('output_baskets')
        await knex.schema.dropTable('tx_labels_map')
        await knex.schema.dropTable('tx_labels')
        await knex.schema.dropTable('transactions')
        await knex.schema.dropTable('users')
        await knex.schema.dropTable('proven_tx_reqs')
        await knex.schema.dropTable('proven_txs')
      }
    }
    return migrations
  }
}

/**
 * @param knex
 * @returns {DBType} connected database engine variant
 */
export async function determineDBType(knex: Knex<any, any[]>): Promise<DBType> {
  try {
    const q = `SELECT 
  CASE 
      WHEN (SELECT VERSION() LIKE '%MariaDB%') = 1 THEN 'Unknown'
      WHEN (SELECT VERSION()) IS NOT NULL THEN 'MySQL'
      ELSE 'Unknown'
  END AS database_type;`
    let r = await knex.raw(q)
    if (!r[0]['database_type']) r = r[0]
    if (r['rows']) r = r.rows
    const dbtype: 'SQLite' | 'MySQL' | 'Unknown' = r[0].database_type
    if (dbtype === 'Unknown') throw new WERR_NOT_IMPLEMENTED(`Attempting to create database on unsuported engine.`)
    return dbtype
  } catch (eu: unknown) {
    const e = WalletError.fromUnknown(eu)
    if (e.code === 'SQLITE_ERROR') return 'SQLite'
    throw new WERR_NOT_IMPLEMENTED(`Attempting to create database on unsuported engine.`)
  }
}
