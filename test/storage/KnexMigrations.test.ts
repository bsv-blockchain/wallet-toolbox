import { _tu } from '../utils/TestUtilsWalletStorage'
import { KnexMigrations, StorageKnex, wait } from '../../src/index.all'
import { Knex } from 'knex'

describe('KnexMigrations tests', () => {
  jest.setTimeout(99999999)

  const knexs: Knex[] = []
  const env = _tu.getEnvFlags('test')

  beforeAll(async () => {
    const localSQLiteFile = await _tu.newTmpFile('migratetest.sqlite', true, false, true)
    const knexSQLite = _tu.createLocalSQLite(localSQLiteFile)
    knexs.push(knexSQLite)

    if (env.runMySQL) {
      const knexMySQL = _tu.createLocalMySQL('migratetest')
      knexs.push(knexMySQL)
    }
  })

  afterAll(async () => {
    for (const knex of knexs) {
      await knex.destroy()
    }
  })

  let done0 = false
  const waitFor0 = async () => {
    while (!done0) await wait(100)
  }
  let done1 = false
  const waitFor1 = async () => {
    while (!done1) await wait(100)
  }

  test('0 migragte down', async () => {
    for (const knex of knexs) {
      const config = {
        migrationSource: new KnexMigrations('test', '0 migration test', '1'.repeat(64), 1000)
      }
      const count = Object.keys(config.migrationSource.migrations).length
      for (let i = 0; i < count; i++) {
        try {
          const r = await knex.migrate.down(config)
          expect(r).toBeTruthy()
        } catch (eu: unknown) {
          break
        }
      }
    }
    done0 = true
  })

  test('1 migragte to latest', async () => {
    await waitFor0()
    for (const knex of knexs) {
      const config = {
        migrationSource: new KnexMigrations('test', '0 migration test', '1'.repeat(64), 1000)
      }
      const latest = await KnexMigrations.latestMigration()
      await knex.migrate.latest(config)
      const version = await knex.migrate.currentVersion(config)
      expect(version).toBe(latest)
    }
    done1 = true
  })

  test('2 getSettings', async () => {
    await waitFor1()
    for (const knex of knexs) {
      const storage = new StorageKnex({
        ...StorageKnex.defaultOptions(),
        chain: 'test',
        knex
      })
      await storage.makeAvailable()
      const r = await storage.getSettings()
      expect(r.created_at instanceof Date).toBe(true)
      expect(r.updated_at instanceof Date).toBe(true)
      expect(r.chain).toBe('test')
      expect(r.maxOutputScript).toBe(1000)
    }
  })
})
