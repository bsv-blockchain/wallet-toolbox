import { Beef, Transaction } from '@bsv/sdk'
import { sdk, StorageProvider, TableTransaction } from '../index.client'

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
          const satoshis = input.sourceTransaction?.outputs[input.sourceOutputIndex].satoshis || 'missing'
          if (typeof satoshis === 'number') totalIn += satoshis
          ilog = `${al(`${am(input.sourceTXID || '', 12)}.${input.sourceOutputIndex}`, 17)} ${ar('' + satoshis, 9)}`
        }
        if (i < tx.outputs.length) {
          const output = tx.outputs[i]
          totalOut += output.satoshis || 0
          const script = output.lockingScript.toHex()
          olog = `${ar('' + (output.satoshis || 'missing'), 9)} (${script.length})${am(script, 13)}`
        }
        log += `${al(ilog, 27)} ${ar('' + i, 5)} ${olog}\n`
      }
      let h = `txid ${txid}\n`
      h += `total in:${totalIn} out:${totalOut} fee:${totalIn - totalOut}\n`
      h += `${al('Inputs', 27)} ${ar('Vin/', 5)} ${'Outputs'}\n`
      h += `${al('Outpoint', 17)} ${ar('Satoshis', 9)} ${ar('Vout', 5)} ${ar('Satoshis', 9)} ${al('Lock Script', 23)}\n`
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
      const h = `transactionId:${tx.transactionId} userId:${tx.userId} ${tx.status} satoshis:${tx.satoshis}\n`
      return h + log
    } catch (eu: unknown) {
      const e = sdk.WalletError.fromUnknown(eu)
      return `Transaction ${tx.transactionId} with txid ${tx.txid} is invalid`
    }
  }
}

const al = Format.alignLeft
const ar = Format.alignRight
const am = Format.alignMiddle
