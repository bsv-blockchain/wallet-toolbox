import { TableMonitorEvent } from '../../storage/index.client'
import { Monitor } from '../Monitor'
import { WalletMonitorTask } from './WalletMonitorTask'

export class TaskServiceCallHistory extends WalletMonitorTask {
  static taskName = 'ServiceCallHistory'

  constructor(
    monitor: Monitor,
    public triggerMsecs = monitor.oneMinute * 12
  ) {
    super(monitor, TaskServiceCallHistory.taskName)
  }

  trigger(nowMsecsSinceEpoch: number): { run: boolean } {
    return {
      run: nowMsecsSinceEpoch > this.lastRunMsecsSinceEpoch + this.triggerMsecs
    }
  }

  async runTask(): Promise<string> {
    const r = await this.monitor.services.getServicesCallHistory(true)
    const log = JSON.stringify(r)
    return log
  }
}
