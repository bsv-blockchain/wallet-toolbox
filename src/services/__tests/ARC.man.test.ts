import { _tu } from '../../../test/utils/TestUtilsWalletStorage'
import { sdk, wait } from '../../index.client'
import { ARC } from '../providers/ARC'
import { Beef, BeefTx } from '@bsv/sdk'
import { arcDefaultUrl } from '../createDefaultWalletServicesOptions'
import { Setup } from '../../index.all'

describe('ARC tests', () => {
  jest.setTimeout(99999999)

  const envTest = _tu.getEnv('test')
  const arcTest = new ARC(arcDefaultUrl(envTest.chain), {
    apiKey: envTest.taalApiKey
  })

  const envMain = _tu.getEnv('main')
  const arcMain = new ARC(arcDefaultUrl(envMain.chain), {
    apiKey: envMain.taalApiKey
  })

  test.skip('0 double spend', async () => {
    const arc = arcTest

    const beef = Beef.fromString(testnetDoubleSpendBeef)
    const txids = [beef.txs.slice(-1)[0].txid]
    const r = await arc.postBeef(beef, txids)
    expect(r.status === 'error').toBe(true)
    expect(r.txidResults[0].doubleSpend).toBe(true)
  })

  test.skip('7 postRawTx testnet', async () => {
    await postRawTxTest('test', arcTest)
  })

  test.skip('8 postRawTx mainnet', async () => {
    await postRawTxTest('main', arcMain)
  })

  test.skip('9 postBeef testnet', async () => {
    const r = await postBeefTest('test', arcTest)
    console.log(`9 postBeef testnet done ${r}`)
  })

  test.skip('10 postBeef mainnet', async () => {
    const r = await postBeefTest('main', arcMain)
    console.log(`10 postBeef mainnet done ${r}`)
  })
})

async function postBeefTest(chain: sdk.Chain, arc: ARC): Promise<string> {
  if (Setup.noEnv(chain)) return 'skipped'
  const c = await _tu.createNoSendTxPair(chain)

  const txids = [c.txidDo, c.txidUndo]

  const r = await arc.postBeef(c.beef, txids)
  expect(r.status).toBe('success')
  for (const txid of txids) {
    const tr = r.txidResults.find(tx => tx.txid === txid)
    expect(tr).not.toBeUndefined()
    expect(tr!.status).toBe('success')
  }

  // replace Undo transaction with double spend transaction and send again.
  const beef2 = c.beef.clone()
  beef2.txs[beef2.txs.length - 1] = BeefTx.fromTx(c.doubleSpendTx)
  const txids2 = [c.txidDo, c.doubleSpendTx.id('hex')]

  const r2 = await arc.postBeef(beef2, txids2)
  expect(r2.status).toBe('error')
  for (const txid of txids2) {
    const tr = r2.txidResults.find(tx => tx.txid === txid)
    expect(tr).not.toBeUndefined()
    if (txid === c.txidDo) {
      expect(tr!.status).toBe('success')
    } else {
      expect(tr!.status).toBe('error')
      expect(tr!.doubleSpend).toBe(true)
      expect(tr!.competingTxs).toEqual([c.txidUndo])
    }
  }
  return 'passed'
}

async function postRawTxTest(chain: sdk.Chain, arc: ARC): Promise<void> {
  if (Setup.noEnv(chain)) return
  const c = await _tu.createNoSendTxPair(chain)

  const rawTxDo = c.beef.findTxid(c.txidDo)!.tx!.toHex()
  const rawTxUndo = c.beef.findTxid(c.txidUndo)!.tx!.toHex()

  const rDo = await arc.postRawTx(rawTxDo)
  expect(rDo.status).toBe('success')
  expect(rDo.txid).toBe(c.txidDo)

  await wait(1000)

  const rUndo = await arc.postRawTx(rawTxUndo)
  expect(rUndo.status).toBe('success')
  expect(rUndo.txid).toBe(c.txidUndo)
  expect(rUndo.doubleSpend).not.toBe(true)

  await wait(1000)

  {
    // Send same transaction again...
    const rUndo = await arc.postRawTx(rawTxUndo)
    expect(rUndo.status).toBe('success')
    expect(rUndo.txid).toBe(c.txidUndo)
    expect(rUndo.doubleSpend).not.toBe(true)
  }

  await wait(1000)

  // Confirm double spend detection.
  const rDouble = await arc.postRawTx(c.doubleSpendTx.toHex())
  expect(rDouble.status).toBe('error')
  expect(rDouble.doubleSpend).toBe(true)
  expect(rDouble.competingTxs![0]).toBe(c.txidUndo)
}

const testnetDoubleSpendBeef =
  '0100beef01fe65631900020200009df812619ae232d2363d91516ab3e811211192933526bbc2aee71b54ccb236d10102462876eec65d9aa26d957421c5cc8dd9119b61177242b9dd814fb190fd0a361801010076a3297928f6841bcb656e91225540e87c65f67d8ec12bc768d7656eb7561b3d02010000000159617a9d17562f7c9765e5dfa6a9a393aa2809ca6166a3d7a31c09efcc5070141f0000006a47304402200a528145a67ba1879b88a093cb711f79f04413a81d5678f314302e36a7f59e43022010bc4bb3c2574052c50bbdc8a05c31fb39e69280656b34f5dc22e2ceadc3bb4a412102fd4200bf389d16479b3d06f97fee0752f2c3b9dc29fb3ddce2b327d851b8902bffffffff0204000000000000001976a9140df1a69c834bb7d9bb5b2b7d6a34e5a401db3e1688ac01000000000000001976a91423f2562a8092ed24eddc77c74387b44c561692a188ac0000000001000100000001462876eec65d9aa26d957421c5cc8dd9119b61177242b9dd814fb190fd0a3618000000006a47304402204183bbfdcf11d50907b91f5e70ea8f81228501ce84e24af75c8d984682d094dc022029caa8f7e5acb4990bbeafee523a3c4a99b78e98b9e5c41349147b099679d4ae412103b76389eea6494c2c30443cba9d59b9dba05fb04e467bc94272629615b87a429fffffffff0202000000000000001976a91476d851e59fcb4ee0ebe6947496db3a393b08e49c88ac01000000000000001976a91423f2562a8092ed24eddc77c74387b44c561692a188ac0000000000'
