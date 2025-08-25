import { Beef, Transaction } from '@bsv/sdk'
import * as sdk from '../sdk'
import { TableTransaction } from '../storage/schema/tables'
import { StorageAdminStats, StorageProvider } from '../storage/StorageProvider'

export abstract class Format {
  static alignLeft(v: string | number, fixedWidth: number): string {
    v = v.toString()
    if (v.length > fixedWidth) {
      return v.slice(0, fixedWidth - 1) + '…'
    }
    return v.toString().padEnd(fixedWidth)
  }

  static alignRight(v: string | number, fixedWidth: number): string {
    v = v.toString()
    if (v.length > fixedWidth) {
      return '…' + v.slice(-fixedWidth + 1)
    }
    return v.toString().padStart(fixedWidth)
  }

  static alignMiddle(v: string | number, fixedWidth: number): string {
    v = v.toString()
    if (v.length === fixedWidth) return v
    const l = Math.ceil(fixedWidth / 2)
    const r = Math.floor(fixedWidth / 2)
    if (v.length > fixedWidth) {
      return `${al(v, l)}${ar(v, r)}`
    }
    const pl = Math.ceil(v.length / 2)
    const pr = Math.floor(v.length / 2)
    return `${ar(v.slice(0, pl), l)}${al(v.slice(-pr), r)}`
  }

  static satoshis(s: number): string {
    const minus = s < 0 ? '-' : ''
    s = Math.abs(s)
    let a = s.toString().split('')
    if (a.length > 2) a.splice(-2, 0, '_')
    if (a.length > 6) a.splice(-6, 0, '_')
    if (a.length > 10) a.splice(-10, 0, '.')
    if (a.length > 14) a.splice(-14, 0, '_')
    if (a.length > 18) a.splice(-18, 0, '_')
    let v = a.join('')
    return minus + v
  }

  static toLogStringTransaction(tx: Transaction): string {
    const txid = tx.id('hex')
    try {
      let log = ''
      let totalIn = 0,
        totalOut = 0
      for (let i = 0; i < Math.max(tx.inputs.length, tx.outputs.length); i++) {
        let ilog: string = ''
        let olog: string = ''
        if (i < tx.inputs.length) {
          const input = tx.inputs[i]
          const satoshis = input.sourceTransaction?.outputs[input.sourceOutputIndex].satoshis || 0
          totalIn += satoshis
          ilog = `${al(`${am(input.sourceTXID || '', 12)}.${input.sourceOutputIndex}`, 17)} ${ar(sa(satoshis), 12)}`
        }
        if (i < tx.outputs.length) {
          const output = tx.outputs[i]
          totalOut += output.satoshis || 0
          const script = output.lockingScript.toHex()
          olog = `${ar(sa(output.satoshis || 0), 12)} (${script.length})${am(script, 13)}`
        }
        log += `${al(ilog, 30)} ${ar('' + i, 5)} ${olog}\n`
      }
      let h = `txid ${txid}\n`
      h += `total in:${sa(totalIn)} out:${sa(totalOut)} fee:${sa(totalIn - totalOut)}\n`
      h += `${al('Inputs', 30)} ${ar('Vin/', 5)} ${'Outputs'}\n`
      h += `${al('Outpoint', 17)} ${ar('Satoshis', 12)} ${ar('Vout', 5)} ${ar('Satoshis', 12)} ${al('Lock Script', 23)}\n`
      return h + log
    } catch (eu: unknown) {
      const e = sdk.WalletError.fromUnknown(eu)
      return `Transaction with txid ${txid} is invalid`
    }
  }

  static toLogStringBeefTxid(beef: Beef, txid: string): string {
    const tx = beef.findAtomicTransaction(txid)
    if (!tx) return `Transaction ${txid} not found in beef`
    return Format.toLogStringTransaction(tx)
  }

  static async toLogStringTableTransaction(tx: TableTransaction, storage: StorageProvider): Promise<string> {
    if (!tx.txid) return `Transaction ${tx.transactionId} has no txid`
    try {
      const beef = await storage.getBeefForTransaction(tx.txid, { minProofLevel: 1 })
      const log = Format.toLogStringBeefTxid(beef, tx.txid)
      const h = `transactionId:${tx.transactionId} userId:${tx.userId} ${tx.status} satoshis:${sa(tx.satoshis)}\n`
      return h + log
    } catch (eu: unknown) {
      const e = sdk.WalletError.fromUnknown(eu)
      return `Transaction ${tx.transactionId} with txid ${tx.txid} is invalid`
    }
  }

  static toLogStringAdminStats(s: StorageAdminStats): string {
    let log = `StorageAdminStats: ${s.when} ${s.requestedBy}\n`
    log += `  ${al('', 13)} ${ar('Day', 18)} ${ar('Month', 18)} ${ar('Total', 18)}\n`
    log += dmt('users', s.usersDay, s.usersMonth, s.usersTotal)
    log += dmt('change sats', sa(s.satoshisDefaultDay), sa(s.satoshisDefaultMonth), sa(s.satoshisDefaultTotal))
    log += dmt('other sats', sa(s.satoshisOtherDay), sa(s.satoshisOtherMonth), sa(s.satoshisOtherTotal))
    log += dmt('labels', s.labelsDay, s.labelsMonth, s.labelsTotal)
    log += dmt('tags', s.tagsDay, s.tagsMonth, s.tagsTotal)
    log += dmt('baskets', s.basketsDay, s.basketsMonth, s.basketsTotal)
    log += dmt('transactions', s.transactionsDay, s.transactionsMonth, s.transactionsTotal)
    log += dmt('  completed', s.txCompletedDay, s.txCompletedMonth, s.txCompletedTotal)
    log += dmt('  failed', s.txFailedDay, s.txFailedMonth, s.txFailedTotal)
    log += dmt('  nosend', s.txNosendDay, s.txNosendMonth, s.txNosendTotal)
    log += dmt('  unproven', s.txUnprovenDay, s.txUnprovenMonth, s.txUnprovenTotal)
    log += dmt('  sending', s.txSendingDay, s.txSendingMonth, s.txSendingTotal)
    log += dmt('  unprocessed', s.txUnprocessedDay, s.txUnprocessedMonth, s.txUnprocessedTotal)
    log += dmt('  unsigned', s.txUnsignedDay, s.txUnsignedMonth, s.txUnsignedTotal)
    log += dmt('  nonfinal', s.txNonfinalDay, s.txNonfinalMonth, s.txNonfinalTotal)
    log += dmt('  unfail', s.txUnfailDay, s.txUnfailMonth, s.txUnfailTotal)

    return log

    function dmt(l: string, d: number | string, m: number | string, t: number | string): string {
      return `  ${al(l, 13)} ${ar(d, 18)} ${ar(m, 18)} ${ar(t, 18)}\n`
    }
  }
}

const al = Format.alignLeft
const ar = Format.alignRight
const am = Format.alignMiddle
const sa = Format.satoshis
