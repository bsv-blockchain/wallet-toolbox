import { Monitor } from '../Monitor'
import { getProofs } from './TaskCheckForProofs'
import { WalletMonitorTask } from './WalletMonitorTask'

/**
 * `TaskCheckNoSends` is a WalletMonitor task that retreives merkle proofs for
 * 'nosend' transactions that MAY have been shared externally.
 *
 * Unlike intentionally processed transactions, 'nosend' transactions are fully valid
 * transactions which have not been processed by the wallet.
 *
 * By default, this task runs once a day to check if any 'nosend' transaction has
 * managed to get mined by some external process.
 *
 * If a proof is obtained and validated, a new ProvenTx record is created and
 * the original ProvenTxReq status is advanced to 'notifying'.
 */
export class TaskCheckNoSends extends WalletMonitorTask {
  static taskName = 'CheckNoSends'

  /**
   * An external service such as the chaintracks new block header
   * listener can set this true to cause
   */
  static checkNow = false

  constructor(
    monitor: Monitor,
    public triggerMsecs = monitor.oneDay * 1
  ) {
    super(monitor, TaskCheckNoSends.taskName)
  }

  /**
   * Normally triggered by checkNow getting set by new block header found event from chaintracks
   */
  trigger(nowMsecsSinceEpoch: number): { run: boolean } {
    return {
      run:
        TaskCheckNoSends.checkNow ||
        (this.triggerMsecs > 0 && nowMsecsSinceEpoch - this.lastRunMsecsSinceEpoch > this.triggerMsecs)
    }
  }

  async runTask(): Promise<string> {
    let log = ''
    const countsAsAttempt = TaskCheckNoSends.checkNow
    TaskCheckNoSends.checkNow = false

    const maxAcceptableHeight = this.monitor.lastNewHeader?.height
    if (maxAcceptableHeight === undefined) {
      return log
    }


    const limit = 100
    let offset = 0
    for (;;) {
      const reqs = await this.storage.findProvenTxReqs({
        partial: {},
        status: ['nosend'],
        paged: { limit, offset }
      })
      if (reqs.length === 0) break
      log += `${reqs.length} reqs with status 'nosend'\n`
      const r = await getProofs(this, reqs, 2, countsAsAttempt, false, maxAcceptableHeight)
      log += `${r.log}\n`
      //console.log(log);
      if (reqs.length < limit) break
      offset += limit
    }
    return log
  }
}
