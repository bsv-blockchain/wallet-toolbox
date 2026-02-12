import { Monitor } from '../Monitor'
import { WalletMonitorTask } from './WalletMonitorTask'
import { MockServices } from '../../mockchain/MockServices'

export class TaskMineBlock extends WalletMonitorTask {
  static taskName = 'MineBlock'
  static mineNow = false

  constructor(
    monitor: Monitor,
    public triggerMsecs = 10 * Monitor.oneMinute
  ) {
    super(monitor, TaskMineBlock.taskName)
  }

  trigger(nowMsecsSinceEpoch: number): { run: boolean } {
    if (TaskMineBlock.mineNow) return { run: true }
    if (nowMsecsSinceEpoch - this.lastRunMsecsSinceEpoch >= this.triggerMsecs) return { run: true }
    return { run: false }
  }

  async runTask(): Promise<string> {
    TaskMineBlock.mineNow = false
    const mockServices = this.monitor.services as unknown as MockServices
    const header = await mockServices.mineBlock()
    this.monitor.processNewBlockHeader(header)
    return `Mined block ${header.height} hash ${header.hash}`
  }
}
