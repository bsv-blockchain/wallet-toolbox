import { EntityProvenTxReq, TableProvenTxReq } from '../../storage/index.client'
import { verifyTruthy } from '../../utility/index.client'
import { Monitor } from '../Monitor'
import { WalletMonitorTask } from './WalletMonitorTask'
import { attemptToPostReqsToNetwork } from '../../storage/methods/attemptToPostReqsToNetwork'
import { ProvenTxReqStatus, WERR_INTERNAL } from '../../sdk'
import { ReviewActionResult } from '@bsv/sdk'
import { createMergedBeefOfTxids } from '../../utility/mergedBeefOfTxids'

export class TaskSendWaiting extends WalletMonitorTask {
  static taskName = 'SendWaiting'

  lastSendingRunMsecsSinceEpoch: number | undefined
  includeSending: boolean = true

  constructor(
    monitor: Monitor,
    public triggerMsecs = monitor.oneSecond * 8,
    public agedMsecs = monitor.oneSecond * 7,
    public sendingMsecs = monitor.oneMinute * 5
  ) {
    super(monitor, TaskSendWaiting.taskName)
  }

  trigger(nowMsecsSinceEpoch: number): { run: boolean } {
    this.includeSending =
      !this.lastSendingRunMsecsSinceEpoch || nowMsecsSinceEpoch > this.lastSendingRunMsecsSinceEpoch + this.sendingMsecs
    if (this.includeSending) this.lastSendingRunMsecsSinceEpoch = nowMsecsSinceEpoch
    return {
      run: nowMsecsSinceEpoch > this.lastRunMsecsSinceEpoch + this.triggerMsecs
    }
  }

  async runTask(): Promise<string> {
    let log = ''
    const limit = 100
    let offset = 0
    const agedLimit = new Date(Date.now() - this.agedMsecs)
    const status: ProvenTxReqStatus[] = this.includeSending ? ['unsent', 'sending'] : ['unsent']
    for (;;) {
      let reqs = await this.storage.findProvenTxReqs({
        partial: {},
        status,
        paged: { limit, offset }
      })
      const count = reqs.length
      if (reqs.length === 0) break
      log += `${reqs.length} reqs with status ${status.join(' or ')}\n`
      const agedReqs = reqs.filter(req => verifyTruthy(req.updated_at) < agedLimit)
      log += `  Of those reqs, ${agedReqs.length} where last updated before ${agedLimit.toISOString()}.\n`
      log += await this.processUnsent(agedReqs, 2)
      if (count < limit) break
      offset += limit
    }
    return log
  }

  /**
   * Process an array of 'unsent' status table.ProvenTxReq
   *
   * Send rawTx to transaction processor(s), requesting proof callbacks when possible.
   *
   * Set status 'invalid' if req is invalid.
   *
   * Set status to 'callback' on successful network submission with callback service.
   *
   * Set status to 'unmined' on successful network submission without callback service.
   *
   * Add mapi responses to database table if received.
   *
   * Increments attempts if sending was attempted.
   *
   * @param reqApis
   */
  async processUnsent(reqApis: TableProvenTxReq[], indent = 0): Promise<string> {
    let log = ''
    for (let i = 0; i < reqApis.length; i++) {
      const reqApi = reqApis[i]
      log += ' '.repeat(indent)
      log += `${i} reqId=${reqApi.provenTxReqId} attempts=${reqApi.attempts} txid=${reqApi.txid}: \n`
      if (reqApi.status !== 'unsent' && reqApi.status !== 'sending') {
        log += `  status now ${reqApi.status}\n`
        continue
      }
      const req = new EntityProvenTxReq(reqApi)
      const reqs: EntityProvenTxReq[] = []
      if (req.batch) {
        // Make sure wew process entire batch together for efficient beef generation
        const batchReqApis = await this.storage.findProvenTxReqs({
          partial: { batch: req.batch, status: 'unsent' }
        })
        for (const bra of batchReqApis) {
          // Remove any matching batchReqApis from reqApis
          const index = reqApis.findIndex(ra => ra.provenTxReqId === bra.provenTxReqId)
          if (index > -1) reqApis.slice(index, index + 1)
          // And add to reqs being processed now:
          reqs.push(new EntityProvenTxReq(bra))
        }
      } else {
        // Just a single non-batched req...
        reqs.push(req)
      }

      const r = await this.storage.runAsStorageProvider(async sp => {
        return attemptToPostReqsToNetwork(sp, reqs)
      })

      const d = r.details.find(d => d.txid === req.txid)
      if (!d) throw new WERR_INTERNAL(`missing details for ${req.txid}`)
      const rar: ReviewActionResult = {
        txid: d.txid,
        status: 'success',
        competingTxs: d.competingTxs
      }
      switch (d.status) {
        case 'success':
          // processing network has accepted this transaction
          rar.status = 'success'
          break
        case 'doubleSpend':
          // confirmed double spend.
          rar.status = 'doubleSpend'
          if (d.competingTxs) {
            await this.storage.runAsStorageProvider(async sp => {
              rar.competingBeef = await createMergedBeefOfTxids(d.competingTxs!, sp)
            })
          }
          break
        case 'serviceError':
          rar.status = 'serviceError'
          break
        case 'invalidTx':
          // nothing will fix this transaction
          rar.status = 'invalidTx'
          break
        case 'unknown':
        case 'invalid':
        default:
          throw new WERR_INTERNAL(`broadcasting status ${d.status} should not occur.`)
      }
      this.monitor.processBroadcastedTransaction(rar)

      log += r.log
    }
    return log
  }
}
