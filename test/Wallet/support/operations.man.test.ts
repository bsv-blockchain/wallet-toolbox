import { MerklePath, WalletOutput } from '@bsv/sdk'
import { sdk, TableOutput, TableUser, verifyOne, verifyOneOrNone } from '../../../src'
import { _tu } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange, ValidListOutputsArgs } from '../../../src/sdk'
import { LocalWalletTestOptions } from '../../utils/localWalletMethods'
import { Format } from '../../../src/utility/Format'
import { asString } from '../../../src/utility/utilityHelpers.noBuffer'

describe('operations.man tests', () => {
  jest.setTimeout(99999999)

  test('0 review and release all production invalid change utxos', async () => {
    const { env, storage } = await _tu.createMainReviewSetup()
    const users = await storage.findUsers({ partial: {} })
    const withInvalid: Record<number, { user: TableUser; outputs: WalletOutput[]; total: number }> = {}
    const vargs: ValidListOutputsArgs = {
      basket: specOpInvalidChange,
      tags: ['release'],
      tagQueryMode: 'all',
      includeLockingScripts: false,
      includeTransactions: false,
      includeCustomInstructions: false,
      includeTags: false,
      includeLabels: false,
      limit: 0,
      offset: 0,
      seekPermission: false,
      knownTxids: []
    }
    let log = ''
    for (const user of users) {
      const { userId } = user
      const auth = { userId, identityKey: '' }
      let r = await storage.listOutputs(auth, vargs)
      if (r.totalOutputs > 0) {
        const total: number = r.outputs.reduce((s, o) => (s += o.satoshis), 0)
        let l = `userId ${userId}: ${r.totalOutputs} utxos updated, total ${total}, ${user.identityKey}\n`
        for (const o of r.outputs) {
          l += `  ${o.outpoint} ${o.satoshis} now ${o.spendable ? 'spendable' : 'spent'}\n`
        }
        console.log(l)
        log += l
        withInvalid[userId] = { user, outputs: r.outputs, total }
      }
    }
    console.log(log || 'Found zero invalid change outputs.')
    await storage.destroy()
  })

  test('1 review and unfail false doubleSpends', async () => {
    const { env, storage, services } = await _tu.createMainReviewSetup()
    let offset = 2700
    const limit = 100
    let allUnfails: number[] = []
    for (;;) {
      let log = ''
      const unfails: number[] = []
      const reqs = await storage.findProvenTxReqs({ partial: { status: 'doubleSpend' }, paged: { limit, offset } })
      for (const req of reqs) {
        const gsr = await services.getStatusForTxids([req.txid])
        if (gsr.results[0].status !== 'unknown') {
          log += `unfail ${req.provenTxReqId} ${req.txid}\n`
          unfails.push(req.provenTxReqId)
        }
      }
      console.log(`DoubleSpends OFFSET: ${offset} ${unfails.length} unfails\n${log}`)
      allUnfails = allUnfails.concat(unfails)
      if (reqs.length < limit) break
      offset += reqs.length
    }
    for (const id of allUnfails) {
      await storage.updateProvenTxReq(id, { status: 'unfail' })
    }
    await storage.destroy()
  })

  test('2 review and unfail false invalids', async () => {
    const { env, storage, services } = await _tu.createMainReviewSetup()
    let offset = 800
    const limit = 100
    let allUnfails: number[] = []
    for (;;) {
      let log = ''
      const unfails: number[] = []
      const reqs = await storage.findProvenTxReqs({ partial: { status: 'invalid' }, paged: { limit, offset } })
      for (const req of reqs) {
        if (!req.txid || !req.rawTx) continue
        const gsr = await services.getStatusForTxids([req.txid])
        if (gsr.results[0].status !== 'unknown') {
          log += `unfail ${req.provenTxReqId} ${req.txid}\n`
          unfails.push(req.provenTxReqId)
        }
      }
      console.log(`Failed OFFSET: ${offset} ${unfails.length} unfails\n${log}`)
      allUnfails = allUnfails.concat(unfails)
      if (reqs.length < limit) break
      offset += reqs.length
    }
    for (const id of allUnfails) {
      await storage.updateProvenTxReq(id, { status: 'unfail' })
    }
    await storage.destroy()
  })

  test.skip('3 review proven_txs', async () => {
    const { env, storage, services } = await _tu.createMainReviewSetup()
    let offset = 0
    const limit = 100
    let allUnfails: number[] = []
    //for (const provenTxId of  [3064, 3065, 11268, 11269, 11270, 11271] ) {
    for (let height = 895000; height < 895026; height++) {
      let log = ''
      const unfails: number[] = []
      const txs = await storage.findProvenTxs({ partial: { height }, paged: { limit, offset } })
      for (const tx of txs) {
        const gmpr = await services.getMerklePath(tx.txid)
        if (gmpr && gmpr.header && gmpr.merklePath) {
          const mp = gmpr.merklePath
          const h = gmpr.header
          const mr = mp.computeRoot(tx.txid)
          const index = mp.path[0].find(leaf => leaf.hash === tx.txid)?.offset!

          const mp2 = MerklePath.fromBinary(tx.merklePath)
          const mr2 = mp2.computeRoot()

          if (h.height !== mp.blockHeight || h.merkleRoot !== mr) {
            console.log(`Merkle root mismatch for ${tx.txid} ${h.merkleRoot} != ${mr}`)
          } else {
            if (tx.merkleRoot !== mr || tx.height !== mp.blockHeight || tx.blockHash !== h.hash || tx.index !== index || mp2.blockHeight !== tx.height || mr2 !== tx.merkleRoot || asString(tx.merklePath) !== asString(mp.toBinary())) {
              debugger;
              await storage.updateProvenTx(tx.provenTxId, {
                merklePath: mp.toBinary(),
                merkleRoot: mr,
                height: mp.blockHeight,
                blockHash: h.hash,
                index
              })
              log += `updated ${tx.provenTxId}\n`
            }
          }
        }
      }
      //console.log(`${offset} ${log}`)
      //if (txs.length < limit) break
      //offset += txs.length
    }
    await storage.destroy()
  })

  test.skip('10 re-internalize failed WUI exports', async () => {
    const { env, storage, services } = await _tu.createMainReviewSetup()
    // From this user
    const user0 = verifyOne(await storage.findUsers({ partial: { userId: 2 } }))
    // To these users
    const users = await storage.findUsers({ partial: { userId: 141 } }) // 111, 141
    for (const user of users) {
      const { userId, identityKey } = user
      const [outputs] = await storage.knex.raw<TableOutput[][]>(`
        SELECT f.* FROM outputs as f where f.userId = 2 and not f.customInstructions is null
        and JSON_EXTRACT(f.customInstructions, '$.payee') = '${identityKey}'
        and not exists(select * from outputs as r where r.userId = ${userId} and r.txid = f.txid)
        `)
      if (outputs.length > 0) console.log(`userId ${userId} ${identityKey} ${outputs.length} outputs`)
      for (const output of outputs) {
        const req = verifyOneOrNone(
          await storage.findProvenTxReqs({ partial: { txid: output.txid, status: 'completed' } })
        )
        const { type, derivationPrefix, derivationSuffix, payee } = JSON.parse(output.customInstructions!)
        if (req && type === 'BRC29' && derivationPrefix && derivationSuffix) {
          const beef = await storage.getBeefForTransaction(req.txid, {})
          // {"type":"BRC29","derivationPrefix":"LDFooHSsXzw=","derivationSuffix":"4f4ixKv+6SY=","payee":"0352caa755d5b6279e15e47e096db908e7c4a73a31775e7e8720bdd4cf2d44873a"}
          await storage.internalizeAction(
            { userId, identityKey: user.identityKey },
            {
              tx: beef.toBinaryAtomic(req.txid),
              outputs: [
                {
                  outputIndex: 0,
                  protocol: 'wallet payment',
                  paymentRemittance: {
                    derivationPrefix: derivationPrefix,
                    derivationSuffix: derivationSuffix,
                    senderIdentityKey: user0.identityKey
                  }
                }
              ],
              description: 'Internalizing export funds tx into foreign wallet'
            }
          )
          console.log('internalize', userId, output.txid)
        }
      }
    }
    /*
     */
    await storage.destroy()
  })

  test.skip('11 review recent transaction change use for specific userId', async () => {
    const userId = 311
    const { env, storage, services } = await _tu.createMainReviewSetup()
    const countTxs = await storage.countTransactions({
      partial: { userId },
      status: ['completed', 'unproven', 'failed']
    })
    const txs = await storage.findTransactions({
      partial: { userId },
      status: ['unproven', 'completed', 'failed'],
      paged: { limit: 100, offset: Math.max(0, countTxs - 100) }
    })
    for (const tx of txs) {
      const ls = await Format.toLogStringTableTransaction(tx, storage)
      console.log(ls)
    }
    const countReqs = await storage.countProvenTxReqs({ partial: {}, status: ['completed', 'unmined'] })
    const reqs = await storage.findProvenTxReqs({
      partial: {},
      status: ['unmined', 'completed'],
      paged: { limit: 100, offset: countReqs - 100 }
    })
    await storage.destroy()
  })

  test.skip('12 check storage merged BEEF', async () => {
    const userId = 127
    const txid = 'efba8b92a22c3308f432b292b5ec7efb3869ecd50c62cb3ddfb83871bc7be194'
    const vout = 1
    const { env, storage, services } = await _tu.createMainReviewSetup()

    const ptx = verifyOne(await storage.findProvenTxs({ partial: { txid } }))

    const mp = MerklePath.fromBinary(ptx.merklePath)
    expect(mp.blockHeight).toBe(ptx.height)

    const txids = ['24b19a5179c1f146e825643df4c6dc2ba21674828c20fc2948e105cb1ca91eae']

    const r = await storage.getReqsAndBeefToShareWithWorld(txids, [])

    await storage.destroy()
  })

})
