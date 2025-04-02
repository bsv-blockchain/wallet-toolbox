import { BlockHeader } from '../../services/chaintracker/chaintracks/BlockHeaderApi'
import { Monitor } from '../Monitor'
import { WalletMonitorTask } from './WalletMonitorTask'

export class TaskNewHeader extends WalletMonitorTask {
  static taskName = 'NewHeader'
  header?: BlockHeader

  constructor(
    monitor: Monitor,
    public triggerMsecs = 1 * monitor.oneMinute
  ) {
    super(monitor, TaskNewHeader.taskName)
  }

  async getHeader(): Promise<BlockHeader> {
    return await this.monitor.chaintracks.findChainTipHeader()
  }

  trigger(nowMsecsSinceEpoch: number): { run: boolean } {
    const run = true
    return { run }
  }

  async runTask(): Promise<string> {
    let log = ''
    const oldHeader = this.header
    this.header = await this.getHeader()
    let isNew = true
    if (!oldHeader) {
      log = `first header: ${this.header.height} ${this.header.hash}`
    } else if (oldHeader.height < this.header.height) {
      const skip = this.header.height - oldHeader.height - 1
      const skipped = skip > 0 ? ` SKIPPED ${skip}` : ''
      log = `new header: ${this.header.height} ${this.header.hash}${skipped}`
    } else if (oldHeader.height === this.header.height && oldHeader.hash != this.header.hash) {
      log = `reorg header: ${this.header.height} ${this.header.hash}`
    } else {
      isNew = false
    }
    if (isNew) this.monitor.processNewBlockHeader(this.header)
    return log
  }
}
