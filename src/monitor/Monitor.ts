import * as sdk from '../sdk'
import { Services } from '../services'
import { wait } from '../utility/utilityHelpers'
import { BlockHeader, ChaintracksServiceClient } from '../services/chaintracker'

import { WalletMonitorTask } from './tasks/WalletMonitorTask'
import { WalletStorageManager } from '../storage/WalletStorageManager'

import { TaskPurge, TaskPurgeParams } from './tasks/TaskPurge'
import { TaskReviewStatus } from './tasks/TaskReviewStatus'
import { TaskSyncWhenIdle } from './tasks/TaskSyncWhenIdle'
import { TaskFailAbandoned } from './tasks/TaskFailAbandoned'
import { TaskCheckForProofs } from './tasks/TaskCheckForProofs'
import { TaskClock } from './tasks/TaskClock'
import { TaskNewHeader } from './tasks/TaskNewHeader'
import { TaskMonitorCallHistory } from './tasks/TaskMonitorCallHistory'

import { TaskSendWaiting } from './tasks/TaskSendWaiting'
import { TaskCheckNoSends } from './tasks/TaskCheckNoSends'
import { TaskUnFail } from './tasks/TaskUnFail'

export type MonitorStorage = WalletStorageManager

export interface MonitorOptions {
  chain: sdk.Chain

  services: Services

  storage: MonitorStorage

  chaintracks: ChaintracksServiceClient

  /**
   * How many msecs to wait after each getMerkleProof service request.
   */
  msecsWaitPerMerkleProofServiceReq: number

  taskRunWaitMsecs: number

  abandonedMsecs: number

  unprovenAttemptsLimitTest: number

  unprovenAttemptsLimitMain: number

  /**
   * These are hooks for a wallet-toolbox client to get transaction updates.
   */
  onTransactionBroadcasted?: (broadcastResult: sdk.ReviewActionResult) => Promise<void>
  onTransactionProven?: (txStatus: sdk.ProvenTransactionStatus) => Promise<void>
}

/**
 * Background task to make sure transactions are processed, transaction proofs are received and propagated,
 * and potentially that reorgs update proofs that were already received.
 */
export class Monitor {
  static createDefaultWalletMonitorOptions(
    chain: sdk.Chain,
    storage: MonitorStorage,
    services?: Services
  ): MonitorOptions {
    services ||= new Services(chain)
    if (!services.options.chaintracks) throw new sdk.WERR_INVALID_PARAMETER('services.options.chaintracks', 'valid')
    const o: MonitorOptions = {
      chain,
      services,
      storage,
      msecsWaitPerMerkleProofServiceReq: 500,
      taskRunWaitMsecs: 5000,
      abandonedMsecs: 1000 * 60 * 5,
      unprovenAttemptsLimitTest: 10,
      unprovenAttemptsLimitMain: 144,
      chaintracks: services.options.chaintracks
    }
    return o
  }

  options: MonitorOptions
  services: Services
  chain: sdk.Chain
  storage: MonitorStorage
  chaintracks: ChaintracksServiceClient
  onTransactionBroadcasted?: (broadcastResult: sdk.ReviewActionResult) => Promise<void>
  onTransactionProven?: (txStatus: sdk.ProvenTransactionStatus) => Promise<void>

  constructor(options: MonitorOptions) {
    this.options = { ...options }
    this.services = options.services
    this.chain = this.services.chain
    this.storage = options.storage
    this.chaintracks = options.chaintracks
    this.onTransactionProven = options.onTransactionProven
    this.onTransactionBroadcasted = options.onTransactionBroadcasted
  }

  oneSecond = 1000
  oneMinute = 60 * this.oneSecond
  oneHour = 60 * this.oneMinute
  oneDay = 24 * this.oneHour
  oneWeek = 7 * this.oneDay
  /**
   * _tasks are typically run by the scheduler but may also be run by runTask.
   */
  _tasks: WalletMonitorTask[] = []
  /**
   * _otherTasks can be run by runTask but not by scheduler.
   */
  _otherTasks: WalletMonitorTask[] = []
  _tasksRunning = false

  defaultPurgeParams: TaskPurgeParams = {
    purgeSpent: false,
    purgeCompleted: false,
    purgeFailed: true,
    purgeSpentAge: 2 * this.oneWeek,
    purgeCompletedAge: 2 * this.oneWeek,
    purgeFailedAge: 5 * this.oneDay
  }

  addAllTasksToOther(): void {
    this._otherTasks.push(new TaskClock(this))
    this._otherTasks.push(new TaskNewHeader(this))
    this._otherTasks.push(new TaskMonitorCallHistory(this))
    this._otherTasks.push(new TaskPurge(this, this.defaultPurgeParams))
    this._otherTasks.push(new TaskReviewStatus(this))
    this._otherTasks.push(new TaskSendWaiting(this))
    this._otherTasks.push(new TaskCheckForProofs(this))
    this._otherTasks.push(new TaskCheckNoSends(this))
    this._otherTasks.push(new TaskUnFail(this))

    this._otherTasks.push(new TaskFailAbandoned(this))

    this._otherTasks.push(new TaskSyncWhenIdle(this))
  }
  /**
   * Default tasks with settings appropriate for a single user storage
   * possibly with sync'ing enabled
   */
  addDefaultTasks(): void {
    this._tasks.push(new TaskClock(this))
    this._tasks.push(new TaskNewHeader(this))
    this._tasks.push(new TaskMonitorCallHistory(this))
    this._tasks.push(new TaskSendWaiting(this, 8 * this.oneSecond, 7 * this.oneSecond)) // Check every 8 seconds but must be 7 seconds old
    this._tasks.push(new TaskCheckForProofs(this, 2 * this.oneHour)) // Every two hours if no block found
    this._tasks.push(new TaskCheckNoSends(this))
    this._tasks.push(new TaskFailAbandoned(this, 8 * this.oneMinute))
    this._tasks.push(new TaskUnFail(this))
    //this._tasks.push(new TaskPurge(this, this.defaultPurgeParams, 6 * this.oneHour))
    this._tasks.push(new TaskReviewStatus(this))
  }

  /**
   * Tasks appropriate for multi-user storage
   * without sync'ing enabled.
   */
  addMultiUserTasks(): void {
    this._tasks.push(new TaskClock(this))
    this._tasks.push(new TaskNewHeader(this))
    this._tasks.push(new TaskMonitorCallHistory(this))
    this._tasks.push(new TaskSendWaiting(this, 8 * this.oneSecond, 7 * this.oneSecond)) // Check every 8 seconds but must be 7 seconds old
    this._tasks.push(new TaskCheckForProofs(this, 2 * this.oneHour)) // Every two hours if no block found
    this._tasks.push(new TaskCheckNoSends(this))
    this._tasks.push(new TaskFailAbandoned(this, 8 * this.oneMinute))
    this._tasks.push(new TaskUnFail(this))
    //this._tasks.push(new TaskPurge(this, this.defaultPurgeParams, 6 * this.oneHour))
    this._tasks.push(new TaskReviewStatus(this))
  }

  addTask(task: WalletMonitorTask): void {
    if (this._tasks.some(t => t.name === task.name))
      throw new sdk.WERR_BAD_REQUEST(`task ${task.name} has already been added.`)
    this._tasks.push(task)
  }

  removeTask(name: string): void {
    this._tasks = this._tasks.filter(t => t.name !== name)
  }

  async setupChaintracksListeners(): Promise<void> {
    try {
      // TODO: Use a task monitoring the newest block headere to trigger processNewHeader and reorg handling.
    } catch (err) {
      /* this chaintracks doesn't support event subscriptions */
    }
  }

  async runTask(name: string): Promise<string> {
    let task = this._tasks.find(t => t.name === name)
    let log = ''
    if (!task) task = this._otherTasks.find(t => t.name === name)
    if (task) {
      await task.asyncSetup()
      log = await task.runTask()
    }
    return log
  }

  async runOnce(): Promise<void> {
    if (this._runAsyncSetup) {
      for (const t of this._tasks) {
        try {
          await t.asyncSetup()
        } catch (eu: unknown) {
          const e = sdk.WalletError.fromUnknown(eu)
          const details = `monitor task ${t.name} asyncSetup error ${e.code} ${e.description}`
          console.log(details)
          await this.logEvent('error0', details)
        }
        if (!this._tasksRunning) break
      }
      this._runAsyncSetup = false
    }

    if (this.storage.getActive().isStorageProvider()) {
      const tasksToRun: WalletMonitorTask[] = []
      const now = new Date().getTime()
      for (const t of this._tasks) {
        try {
          if (t.trigger(now).run) tasksToRun.push(t)
        } catch (eu: unknown) {
          const e = sdk.WalletError.fromUnknown(eu)
          const details = `monitor task ${t.name} trigger error ${e.code} ${e.description}`
          console.log(details)
          await this.logEvent('error0', details)
        }
      }

      for (const ttr of tasksToRun) {
        try {
          if (this.storage.getActive().isStorageProvider()) {
            const log = await ttr.runTask()
            if (log && log.length > 0) {
              console.log(`Task${ttr.name} ${log.slice(0, 256)}`)
              await this.logEvent(ttr.name, log)
            }
          }
        } catch (eu: unknown) {
          const e = sdk.WalletError.fromUnknown(eu)
          const details = `monitor task ${ttr.name} runTask error ${e.code} ${e.description}\n${e.stack}`
          console.log(details)
          await this.logEvent('error1', details)
        } finally {
          ttr.lastRunMsecsSinceEpoch = new Date().getTime()
        }
      }
    }
  }

  _runAsyncSetup: boolean = true

  async startTasks(): Promise<void> {
    if (this._tasksRunning) throw new sdk.WERR_BAD_REQUEST('monitor tasks are already runnining.')

    this._tasksRunning = true
    for (; this._tasksRunning; ) {
      await this.runOnce()

      // console.log(`${new Date().toISOString()} tasks run, waiting...`)
      await wait(this.options.taskRunWaitMsecs)
    }
  }

  async logEvent(event: string, details?: string): Promise<void> {
    await this.storage.runAsStorageProvider(async sp => {
      await sp.insertMonitorEvent({
        created_at: new Date(),
        updated_at: new Date(),
        id: 0,
        event,
        details
      })
    })
  }

  stopTasks(): void {
    this._tasksRunning = false
  }

  lastNewHeader: BlockHeader | undefined
  lastNewHeaderWhen: Date | undefined

  /**
   * Process new chain header event received from Chaintracks
   *
   * Kicks processing 'unconfirmed' and 'unmined' request processing.
   *
   * @param reqs
   */
  processNewBlockHeader(header: BlockHeader): void {
    const h = header
    this.lastNewHeader = h
    this.lastNewHeaderWhen = new Date()
    console.log(`WalletMonitor notified of new block header ${h.height}`)
    // Nudge the proof checker to try again.
    TaskCheckForProofs.checkNow = true
  }

  /**
   * This is a function run from a TaskSendWaiting Monitor task.
   *
   * This allows the user of wallet-toolbox to 'subscribe' for transaction broadcast updates.
   *
   * @param broadcastResult
   */
  callOnBroadcastedTransaction(broadcastResult: sdk.ReviewActionResult): void {
    if (this.onTransactionBroadcasted) {
      this.onTransactionBroadcasted(broadcastResult)
    }
  }

  /**
   * This is a function run from a TaskCheckForProofs Monitor task.
   *
   * This allows the user of wallet-toolbox to 'subscribe' for transaction updates.
   *
   * @param txStatus
   */
  callOnProvenTransaction(txStatus: sdk.ProvenTransactionStatus): void {
    if (this.onTransactionProven) {
      this.onTransactionProven(txStatus)
    }
  }

  /**
   * Process reorg event received from Chaintracks
   *
   * Reorgs can move recent transactions to new blocks at new index positions.
   * Affected transaction proofs become invalid and must be updated.
   *
   * It is possible for a transaction to become invalid.
   *
   * Coinbase transactions always become invalid.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader): void {
    /* */
  }
}
