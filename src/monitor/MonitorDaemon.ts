import {
  Monitor,
  sdk,
  Services,
  StorageKnex,
  StorageKnexOptions,
  StorageProvider,
  wait,
  WalletStorageManager
} from '../index.all'

// This task is not "client" compatible as it imports StorageKnex
import { TaskUnFail } from './tasks/TaskUnFail'

import { Knex, knex as makeKnex } from 'knex'

import dotenv from 'dotenv'
dotenv.config()

const mainDojoConnection = process.env.MAIN_DOJO_CONNECTION || ''
const testDojoConnection = process.env.TEST_DOJO_CONNECTION || ''

export interface MonitorDaemonSetup {
  chain?: sdk.Chain
  sqliteFilename?: string
  mySQLConnection?: string
  knexConfig?: Knex.Config
  knex?: Knex<any, any[]>
  storageKnexOptions?: StorageKnexOptions
  storageProvider?: StorageProvider
  storageManager?: WalletStorageManager
  servicesOptions?: sdk.WalletServicesOptions
  services?: Services
  monitor?: Monitor
}

export class MonitorDaemon {
  setup?: MonitorDaemonSetup
  doneListening?: Promise<void>
  doneTasks?: Promise<void>
  stopDaemon: boolean = false

  constructor(
    public args: MonitorDaemonSetup,
    public noRunTasks?: boolean
  ) {
    /* */
  }

  async createSetup(): Promise<void> {
    this.setup = { ...this.args }
    const a = this.setup

    if (!a.monitor) {
      a.chain ||= 'test'

      if (a.sqliteFilename) {
        a.knexConfig = {
          client: 'sqlite3',
          connection: { filename: a.sqliteFilename },
          useNullAsDefault: true
        }
      }

      if (a.mySQLConnection) {
        a.knexConfig = {
          client: 'mysql2',
          connection: JSON.parse(a.mySQLConnection),
          useNullAsDefault: true,
          pool: { min: 0, max: 7, idleTimeoutMillis: 15000 }
        }
      }

      if (a.knexConfig) {
        a.knex = makeKnex(a.knexConfig)
      }

      if (a.knex) {
        a.storageKnexOptions = {
          knex: a.knex,
          chain: a.chain,
          feeModel: { model: 'sat/kb', value: 1 },
          commissionSatoshis: 0
        }
      }

      if (a.storageKnexOptions) {
        a.storageProvider = new StorageKnex(a.storageKnexOptions)
      }

      if (a.storageProvider) {
        await a.storageProvider.makeAvailable()
        const settings = await a.storageProvider.getSettings()
        a.storageManager = new WalletStorageManager(settings.storageIdentityKey, a.storageProvider)
        await a.storageManager.makeAvailable()
      } else if (!a.storageManager) {
        throw new sdk.WERR_INVALID_PARAMETER(
          'storageManager',
          'valid or one of mySQLConnection, knexConfig, knex, storageKnexOptions, or storageProvider'
        )
      }

      if (a.servicesOptions) {
        if (a.servicesOptions.chain != a.chain)
          throw new sdk.WERR_INVALID_PARAMETER('serviceOptions.chain', 'same as args.chain')
        a.services = new Services(a.servicesOptions)
      }

      if (!a.services) {
        a.services = new Services(a.chain)
      }

      a.storageManager.setServices(a.services)

      const monitorOptions = Monitor.createDefaultWalletMonitorOptions(a.chain, a.storageManager, a.services)
      a.monitor = new Monitor(monitorOptions)
    }

    if (a.monitor._tasks.length === 0) {
      a.monitor.addMultiUserTasks()
      a.monitor.addTask(new TaskUnFail(a.monitor))
    }
  }

  async start(): Promise<void> {
    if (!this.setup) await this.createSetup()
    if (!this.setup?.monitor) throw new sdk.WERR_INTERNAL('createSetup failed to initialize setup')

    const { monitor } = this.setup

    if (!this.noRunTasks) {
      console.log('\n\nRunning startTasks\n\n')
      this.doneTasks = monitor.startTasks()
    }
  }

  async stop(): Promise<void> {
    console.log('start of stop')

    if (!this.setup || (!this.doneTasks && !this.noRunTasks) || !this.doneListening)
      throw new sdk.WERR_INTERNAL('call start or createSetup first')

    const { monitor } = this.setup

    monitor!.stopTasks()

    if (this.doneTasks) await this.doneTasks
    this.doneTasks = undefined
    await this.doneListening
    this.doneListening = undefined
  }

  async destroy(): Promise<void> {
    if (!this.setup) return
    if (this.doneTasks || this.doneListening) await this.stop()
    if (this.setup.storageProvider) this.setup.storageProvider.destroy()
    this.setup = undefined
  }

  async runDaemon(): Promise<void> {
    this.stopDaemon = false
    for (;;) {
      try {
        await this.start()

        while (!this.stopDaemon) {
          await wait(10 * 1000)
        }

        console.log('stopping')

        await this.stop()

        console.log('cleanup')

        await this.destroy()

        console.log('done')
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        console.log(`\n\nrunWatchman Main Error Handler\n\ncode: ${e.code}\nDescription: ${e.description}\n\n\n`)
      }
    }
  }
}
