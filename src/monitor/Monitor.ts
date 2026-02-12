import { wait } from '../utility/utilityHelpers'

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
import { TaskReorg } from './tasks/TaskReorg'

import { TaskSendWaiting } from './tasks/TaskSendWaiting'
import { TaskCheckNoSends } from './tasks/TaskCheckNoSends'
import { TaskUnFail } from './tasks/TaskUnFail'
import { TaskMineBlock } from './tasks/TaskMineBlock'
import { Chain, ProvenTransactionStatus } from '../sdk/types'
import { ReviewActionResult } from '../sdk/WalletStorage.interfaces'
import { WERR_BAD_REQUEST, WERR_INVALID_PARAMETER } from '../sdk/WERR_errors'
import { WalletError } from '../sdk/WalletError'
import { BlockHeader, WalletServices } from '../sdk/WalletServices.interfaces'
import { Services } from '../services/Services'
import { ChaintracksClientApi, ReorgListener } from '../services/chaintracker/chaintracks/Api/ChaintracksClientApi'
import { Chaintracks } from '../services/chaintracker/chaintracks/Chaintracks'

export type MonitorStorage = WalletStorageManager

export interface MonitorOptions {
  chain: Chain

  services: Services | WalletServices

  storage: MonitorStorage

  chaintracks: ChaintracksClientApi

  chaintracksWithEvents?: Chaintracks

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
  onTransactionBroadcasted?: (broadcastResult: ReviewActionResult) => Promise<void>
  onTransactionProven?: (txStatus: ProvenTransactionStatus) => Promise<void>
}

/**
 * Background task to make sure transactions are processed, transaction proofs are received and propagated,
 * and potentially that reorgs update proofs that were already received.
 */
export class Monitor {
  static createDefaultWalletMonitorOptions(
    chain: Chain,
    storage: MonitorStorage,
    services?: Services,
    chaintracks?: Chaintracks
  ): MonitorOptions {
    services ||= new Services(chain)
    if (!services.options.chaintracks) throw new WERR_INVALID_PARAMETER('services.options.chaintracks', 'valid')
    const o: MonitorOptions = {
      chain,
      services,
      storage,
      msecsWaitPerMerkleProofServiceReq: 500,
      taskRunWaitMsecs: 5000,
      abandonedMsecs: 1000 * 60 * 5,
      unprovenAttemptsLimitTest: 10,
      unprovenAttemptsLimitMain: 144,
      chaintracks: services.options.chaintracks,
      chaintracksWithEvents: chaintracks
    }
    return o
  }

  options: MonitorOptions
  services: Services | WalletServices
  chain: Chain
  storage: MonitorStorage
  chaintracks: ChaintracksClientApi
  chaintracksWithEvents?: Chaintracks
  reorgSubscriptionPromise?: Promise<string>
  headersSubscriptionPromise?: Promise<string>
  onTransactionBroadcasted?: (broadcastResult: ReviewActionResult) => Promise<void>
  onTransactionProven?: (txStatus: ProvenTransactionStatus) => Promise<void>

  constructor(options: MonitorOptions) {
    this.options = { ...options }
    this.services = options.services
    this.chain = this.services.chain
    this.storage = options.storage
    this.chaintracks = options.chaintracks
    this.chaintracksWithEvents = options.chaintracksWithEvents
    this.onTransactionProven = options.onTransactionProven
    this.onTransactionBroadcasted = options.onTransactionBroadcasted

    if (this.chaintracksWithEvents) {
      const c = this.chaintracksWithEvents
      this.reorgSubscriptionPromise = c.subscribeReorgs(this.processReorg.bind(this))
      this.headersSubscriptionPromise = c.subscribeHeaders(this.processHeader.bind(this))
    }
  }

  async destroy(): Promise<void> {
    if (this.chaintracksWithEvents) {
      const c = this.chaintracksWithEvents
      if (this.reorgSubscriptionPromise) await c.unsubscribe(await this.reorgSubscriptionPromise)
      if (this.headersSubscriptionPromise) await c.unsubscribe(await this.headersSubscriptionPromise)
    }
  }

  static readonly oneSecond = 1000
  static readonly oneMinute = 60 * Monitor.oneSecond
  static readonly oneHour = 60 * Monitor.oneMinute
  static readonly oneDay = 24 * Monitor.oneHour
  static readonly oneWeek = 7 * Monitor.oneDay

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
    purgeSpentAge: 2 * Monitor.oneWeek,
    purgeCompletedAge: 2 * Monitor.oneWeek,
    purgeFailedAge: 5 * Monitor.oneDay
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

    this._otherTasks.push(new TaskReorg(this))

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
    this._tasks.push(new TaskSendWaiting(this, 8 * Monitor.oneSecond, 7 * Monitor.oneSecond)) // Check every 8 seconds but must be 7 seconds old
    this._tasks.push(new TaskCheckForProofs(this, 2 * Monitor.oneHour)) // Every two hours if no block found
    this._tasks.push(new TaskCheckNoSends(this))
    this._tasks.push(new TaskFailAbandoned(this, 8 * Monitor.oneMinute))
    this._tasks.push(new TaskUnFail(this))
    //this._tasks.push(new TaskPurge(this, this.defaultPurgeParams, 6 * Monitor.oneHour))
    this._tasks.push(new TaskReviewStatus(this))
    this._tasks.push(new TaskReorg(this))
    if (this.chain === 'mock') {
      this._tasks.push(new TaskMineBlock(this))
    }
  }

  /**
   * Tasks appropriate for multi-user storage
   * without sync'ing enabled.
   */
  addMultiUserTasks(): void {
    this._tasks.push(new TaskClock(this))
    this._tasks.push(new TaskNewHeader(this))
    this._tasks.push(new TaskMonitorCallHistory(this))
    this._tasks.push(new TaskSendWaiting(this, 8 * Monitor.oneSecond, 7 * Monitor.oneSecond)) // Check every 8 seconds but must be 7 seconds old
    this._tasks.push(new TaskCheckForProofs(this, 2 * Monitor.oneHour)) // Every two hours if no block found
    this._tasks.push(new TaskCheckNoSends(this))
    this._tasks.push(new TaskFailAbandoned(this, 8 * Monitor.oneMinute))
    this._tasks.push(new TaskUnFail(this))
    //this._tasks.push(new TaskPurge(this, this.defaultPurgeParams, 6 * Monitor.oneHour))
    this._tasks.push(new TaskReviewStatus(this))
    this._tasks.push(new TaskReorg(this))
    if (this.chain === 'mock') {
      this._tasks.push(new TaskMineBlock(this))
    }
  }

  addTask(task: WalletMonitorTask): void {
    if (this._tasks.some(t => t.name === task.name))
      throw new WERR_BAD_REQUEST(`task ${task.name} has already been added.`)
    this._tasks.push(task)
  }

  removeTask(name: string): void {
    this._tasks = this._tasks.filter(t => t.name !== name)
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
          const e = WalletError.fromUnknown(eu)
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
          const e = WalletError.fromUnknown(eu)
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
          const e = WalletError.fromUnknown(eu)
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
  _tasksRunningPromise?: PromiseLike<void>
  resolveCompletion: ((value: void | PromiseLike<void>) => void) | undefined = undefined

  async startTasks(): Promise<void> {
    if (this._tasksRunning) throw new WERR_BAD_REQUEST('monitor tasks are already runnining.')

    this._tasksRunning = true
    this._tasksRunningPromise = new Promise(resolve => {
      this.resolveCompletion = resolve
    })

    for (; this._tasksRunning; ) {
      await this.runOnce()

      // console.log(`${new Date().toISOString()} tasks run, waiting...`)
      await wait(this.options.taskRunWaitMsecs)
    }

    if (this.resolveCompletion) {
      this.resolveCompletion()
      this.resolveCompletion = undefined
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
    // console.log(`WalletMonitor notified of new block header ${h.height}`)
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
  callOnBroadcastedTransaction(broadcastResult: ReviewActionResult): void {
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
  callOnProvenTransaction(txStatus: ProvenTransactionStatus): void {
    if (this.onTransactionProven) {
      this.onTransactionProven(txStatus)
    }
  }

  deactivatedHeaders: DeactivedHeader[] = []

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
  processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader, deactivatedHeaders?: BlockHeader[]): void {
    if (deactivatedHeaders) {
      for (const header of deactivatedHeaders) {
        this.deactivatedHeaders.push({
          whenMsecs: Date.now(),
          tries: 0,
          header
        })
      }
    }
  }

  /**
   * Handler for new header events from Chaintracks.
   *
   * To minimize reorg processing, new headers are aged before processing via TaskNewHeader.
   * Therefore this handler is intentionally a no-op.
   *
   * @param header
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  processHeader(header: BlockHeader): void {}
}

export interface DeactivedHeader {
  /**
   * To control aging of notification before pursuing updated proof data.
   */
  whenMsecs: number
  /**
   * Number of attempts made to process the header.
   * Supports returning deactivation notification to the queue if proof data is not yet available.
   */
  tries: number
  /**
   * The deactivated block header.
   */
  header: BlockHeader
}
