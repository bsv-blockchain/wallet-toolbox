import { Transaction, Utils } from '@bsv/sdk'
import { Monitor } from '../Monitor'
import { WalletMonitorTask } from './WalletMonitorTask'
import { StorageKnex } from '../../storage/StorageKnex'
import { TableProvenTxReq } from '../../storage/schema/tables'
import { EntityProvenTxReq } from '../../storage/schema/entities'

/**
 * Setting provenTxReq status to 'unfail' when 'invalid' will attempt to find a merklePath, and if successful:
 *
 * 1. set the req status to 'unmined'
 * 2. set the referenced txs to 'unproven'
 * 3. determine if any inputs match user's existing outputs and if so update spentBy and spendable of those outputs.
 * 4. set the txs outputs to spendable
 *
 * If it fails (to find a merklePath), returns the req status to 'invalid'.
 */
export class TaskUnFail extends WalletMonitorTask {
  static taskName = 'UnFail'

  /**
   * Set to true to trigger running this task
   */
  static checkNow = false

  constructor(
    monitor: Monitor,
    public triggerMsecs = monitor.oneMinute * 10
  ) {
    super(monitor, TaskUnFail.taskName)
  }

  trigger(nowMsecsSinceEpoch: number): { run: boolean } {
    return {
      run:
        TaskUnFail.checkNow ||
        (this.triggerMsecs > 0 && nowMsecsSinceEpoch - this.lastRunMsecsSinceEpoch > this.triggerMsecs)
    }
  }

  async runTask(): Promise<string> {
    let log = ''
    TaskUnFail.checkNow = false

    const limit = 100
    let offset = 0
    for (;;) {
      const reqs = await this.storage.findProvenTxReqs({
        partial: {},
        status: ['unfail'],
        paged: { limit, offset }
      })
      if (reqs.length === 0) break
      log += `${reqs.length} reqs with status 'unfail'\n`
      const r = await this.unfail(reqs, 2)
      log += `${r.log}\n`
      //console.log(log);
      if (reqs.length < limit) break
      offset += limit
    }

    return log
  }

  async unfail(reqs: TableProvenTxReq[], indent = 0): Promise<{ log: string }> {
    let log = ''
    for (const reqApi of reqs) {
      const req = new EntityProvenTxReq(reqApi)
      log += ' '.repeat(indent)
      log += `reqId ${reqApi.provenTxReqId} txid ${reqApi.txid}: `
      const r = await this.monitor.services.getMerklePath(req.txid)
      if (r.merklePath) {
        // 1. set the req status to 'unmined'
        req.status = 'unmined'
        req.attempts = 0
        log += `unfailed. status is now 'unmined'\n`
        log += await this.unfailReq(req, indent + 2)
      } else {
        req.status = 'invalid'
        log += `returned to status 'invalid'\n`
      }
      await req.updateStorageDynamicProperties(this.storage)
    }
    return { log }
  }

  /**
   * 2. set the referenced txs to 'unproven'
   * 3. determine if any inputs match user's existing outputs and if so update spentBy and spendable of those outputs.
   * 4. set the txs outputs to spendable
   *
   * @param req
   * @param indent
   * @returns
   */
  async unfailReq(req: EntityProvenTxReq, indent: number): Promise<string> {
    let log = ''

    const storage = this.storage
    const services = this.monitor.services

    const txIds = req.notify.transactionIds || []
    for (const id of txIds) {
      const bsvtx = Transaction.fromBinary(req.rawTx)
      await this.storage.runAsStorageProvider(async sp => {
        const spk = sp as StorageKnex
        const tx = await sp.findTransactionById(id, undefined, true)
        if (!tx) {
          log += ' '.repeat(indent) + `transaction ${id} was not found\n`
          return
        }
        await sp.updateTransaction(tx.transactionId, { status: 'unproven' })
        tx.status = 'unproven'
        log += ' '.repeat(indent) + `transaction ${id} status is now 'unproven'\n`
        let vin = -1
        for (const bi of bsvtx.inputs) {
          vin++
          const is = await sp.findOutputs({
            partial: { userId: tx.userId, txid: bi.sourceTXID!, vout: bi.sourceOutputIndex }
          })
          if (is.length !== 1) {
            log += ' '.repeat(indent + 2) + `input ${vin} not matched to user's outputs\n`
          } else {
            const oi = is[0]
            log +=
              ' '.repeat(indent + 2) +
              `input ${vin} matched to output ${oi.outputId} updated spentBy ${tx.transactionId}\n`
            await sp.updateOutput(oi.outputId, { spendable: false, spentBy: tx.transactionId })
          }
        }
        const outputs = await sp.findOutputs({ partial: { userId: tx.userId, transactionId: tx.transactionId } })
        for (const o of outputs) {
          await spk.validateOutputScript(o)
          if (!o.lockingScript) {
            log += ' '.repeat(indent + 2) + `output ${o.outputId} does not have a valid locking script\n`
          } else {
            const or = await services.getUtxoStatus(Utils.toHex(o.lockingScript!))
            const isUtxo = or.isUtxo === true
            if (isUtxo !== o.spendable) {
              log += ' '.repeat(indent + 2) + `output ${o.outputId} set to ${isUtxo ? 'spendable' : 'spent'}\n`
              await sp.updateOutput(o.outputId, { spendable: isUtxo })
            } else {
              log += ' '.repeat(indent + 2) + `output ${o.outputId} unchanged\n`
            }
          }
        }
      })
    }

    return log
  }
}
