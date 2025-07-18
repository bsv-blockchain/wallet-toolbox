import { Beef, ReviewActionResult, SendWithResult } from '@bsv/sdk'
import { PostReqsToNetworkResult } from '../storage/methods/attemptToPostReqsToNetwork'
import { StorageGetBeefOptions, WERR_INTERNAL } from '../sdk'
import { StorageProvider } from '../index.client'

export const aggregateActionResults = async (
  storage: StorageProvider,
  sendWithResultReqs: SendWithResult[],
  postToNetworkResult: PostReqsToNetworkResult
): Promise<{
  swr: SendWithResult[]
  rar: ReviewActionResult[]
}> => {
  const swr: SendWithResult[] = []
  const rar: ReviewActionResult[] = []

  for (const ar of sendWithResultReqs) {
    const txid = ar.txid

    const d = postToNetworkResult.details.find(d => d.txid === txid)
    if (!d) throw new WERR_INTERNAL(`missing details for ${txid}`)

    const arNdr: ReviewActionResult = { txid: d.txid, status: 'success', competingTxs: d.competingTxs }
    switch (d.status) {
      case 'success':
        // processing network has accepted this transaction
        ar.status = 'unproven'
        break
      case 'doubleSpend':
        // confirmed double spend.
        ar.status = 'failed'
        arNdr.status = 'doubleSpend'
        if (d.competingTxs) arNdr.competingBeef = await createMergedBeefOfTxids(d.competingTxs, storage)
        break
      case 'serviceError':
        // services might improve
        ar.status = 'sending'
        arNdr.status = 'serviceError'
        break
      case 'invalidTx':
        // nothing will fix this transaction
        ar.status = 'failed'
        arNdr.status = 'invalidTx'
        break
      case 'unknown':
      case 'invalid':
      default:
        throw new WERR_INTERNAL(`processAction with notDelayed status ${d.status} should not occur.`)
    }

    swr.push({ txid, status: ar.status })
    rar.push(arNdr)
  }

  return { swr, rar }
}

async function createMergedBeefOfTxids(txids: string[], storage: StorageProvider): Promise<number[]> {
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
