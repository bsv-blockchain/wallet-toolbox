import { Beef } from '@bsv/sdk'
import { StorageGetBeefOptions } from '../sdk'
import { StorageProvider } from '../storage/StorageProvider'

export async function createMergedBeefOfTxids(txids: string[], storage: StorageProvider): Promise<number[]> {
  const beef = new Beef()
  const options: StorageGetBeefOptions = {
    mergeToBeef: beef,
    ignoreNewProven: true
  }
  for (const txid of txids) {
    await storage.getBeefForTransaction(txid, options)
  }
  return beef.toBinary()
}
