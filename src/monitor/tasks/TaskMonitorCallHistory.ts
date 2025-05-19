import { TableMonitorEvent } from '../../storage/index.client'
import { Monitor } from '../Monitor'
import { WalletMonitorTask } from './WalletMonitorTask'

export class TaskMonitorCallHistory extends WalletMonitorTask {
  static taskName = 'MonitorCallHistory'

  constructor(
    monitor: Monitor,
    public triggerMsecs = monitor.oneMinute * 12
  ) {
    super(monitor, TaskMonitorCallHistory.taskName)
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
