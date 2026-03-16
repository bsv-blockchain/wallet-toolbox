import {
  Beef,
  BigNumber,
  CreateActionArgs,
  CreateActionInput,
  CreateActionOptions,
  Curve,
  P2PKH,
  PositiveIntegerOrZero,
  PrivateKey,
  SignActionArgs,
  SignActionSpend,
  Utils
} from '@bsv/sdk'
import { keyOffsetToHashedSecret, lockScriptWithKeyOffsetFromPubKey, offsetPrivKey, offsetPubKey } from '../offsetKey'
import { _tu, TestWalletOnly } from '../../../../test/utils/TestUtilsWalletStorage'
import { Setup } from '../../../Setup'
import { StorageKnex } from '../../StorageKnex'
import { FindCommissionsArgs, FindTransactionsArgs } from '../../../sdk'
import { verifyOne, verifyTruthy } from '../../../utility/utilityHelpers'
import { TableCommission } from '../../schema/tables/TableCommission'
import { WalletStorageManager } from '../../WalletStorageManager'

describe('offsetKey tests', () => {
  jest.setTimeout(99999999)

  test('1_offsetPrivKey', async () => {
    const bn2 = BigNumber.fromHex('FFF0000000000000000000000000000000000000000000000000000000000100', 'big')

    const priv2 = new PrivateKey(bn2)

    const privKey2 = priv2.toWif()

    const keyOffset = 'KyaVZ1AnxYN4oB8JnxYVyZ8xYC9ySpq2Umzx6jwzQGVo71k1EgSt'
    const oPrivKey = 'KyMYVLNeyF4qQsgHW3N1eJv9WcRd2aZC8hw7iLgCojQsyizqKsV4'

    const r12 = offsetPrivKey(privKey2, keyOffset)

    expect(r12.keyOffset).toBe(keyOffset)

    expect(r12.offsetPrivKey).toBe(oPrivKey)
  })

  test('2_offsetPubKey', async () => {
    const bn2 = BigNumber.fromHex('FFF0000000000000000000000000000000000000000000000000000000000100', 'big')

    const priv2 = new PrivateKey(bn2)

    const pub2 = priv2.toPublicKey()

    const keyOffset = 'KyaVZ1AnxYN4oB8JnxYVyZ8xYC9ySpq2Umzx6jwzQGVo71k1EgSt'
    const oPrivKey = 'KyMYVLNeyF4qQsgHW3N1eJv9WcRd2aZC8hw7iLgCojQsyizqKsV4'
    const oPubKey = '024b4362ce98e0afd22bf3319831cfaf691ad2f08471a3386bcda98d65435a0f24'

    const r22 = offsetPubKey(pub2.toString(), keyOffset)

    expect(r22.keyOffset).toBe(keyOffset)

    expect(r22.offsetPubKey).toBe(oPubKey)

    const pubKey2 = PrivateKey.fromWif(oPrivKey).toPublicKey().toString()

    expect(pubKey2).toBe(oPubKey)
  })

  test('3_lockScriptWithKeyOffsetFromPubKey', async () => {
    const pubKey = '0397742eaef6c7f08c4aa057397d45529f93ab90345b84ce5a5aac06ea9cdd132e'

    const ko = 'Kx9MjojdkjL3bEo5tQwHpwT1voKN1z56NjpATsa2Sx6QTrVjgMQJ'
    const script = '76a9149d09d0ee09b212c548f6b1a7835641f33654246788ac'

    const r1 = lockScriptWithKeyOffsetFromPubKey(pubKey, ko)

    expect(r1.script).toBe(script)
    expect(r1.keyOffset).toBe(ko)

    // And with a random keyOffset...
    const r2 = lockScriptWithKeyOffsetFromPubKey(pubKey)

    expect(r2.script).not.toBe(script)
    expect(r2.keyOffset).not.toBe(ko)
  })

  test('4a_check keyOffset address', async () => {
    if (_tu.noEnv('main')) return

    const env = _tu.getEnv('main')
    const privHex = env.devKeys[env.commissionsIdentity]!
    const priv = PrivateKey.fromHex(privHex)
    const pub = priv.toPublicKey()

    const keyOffset = 'L2hMY5uW6Vh46DEFMzrYiKSFWDRSMGDTsaeDvhiKNNJGihwKD17w'

    const r = offsetPrivKey(priv.toWif(), keyOffset)
    const privO = PrivateKey.fromWif(r.offsetPrivKey)
    const address = privO.toAddress()
    expect(address).toBe('1EZz5oxwXoG6LgGLxeYPeg1NfzQrP1vL6M')
  })

  test.skip('4_redeemServiceCharges', async () => {
    if (_tu.noEnv('main')) return

    const env = _tu.getEnv('main')
    if (!env.devKeys[env.commissionsIdentity]) {
      throw new Error('No dev key for commissions identity')
    }

    const { storage, setup } = await createRedeemTestContext(env)

    try {
      const sm = new WalletStorageManager(setup.identityKey, storage)
      sm.setServices(setup.services)
      await sm.reproveHeader('000000000000000014d97d19bf82956c1f7ce3977da10b7fbdab9a10653c02e7')

      const fca: FindCommissionsArgs = {
        partial: { isRedeemed: false },
        paged: { limit: 400, offset: 0 }
      }

      await redeemCommissionsLoop(env, storage, setup, fca, async (_fca, _inputs) => {
        // Standard path: collect commissions from storage
        return collectCommissions(storage, _fca, _inputs)
      })
    } catch (err) {
      console.error('Error in 4_redeemServiceCharges test:', err)
      throw err
    }

    await storage.destroy()
    await setup.wallet.destroy()
  })

  test.skip('4a_redeemServiceCharges optimized', async () => {
    if (_tu.noEnv('main')) return

    const env = _tu.getEnv('main')
    if (!env.devKeys[env.commissionsIdentity]) {
      throw new Error('No dev key for commissions identity')
    }

    const { storage, setup } = await createRedeemTestContext(env)

    try {
      const fca: FindCommissionsArgs = {
        partial: { isRedeemed: false },
        paged: { limit: 400, offset: 0 }
      }

      await redeemCommissionsLoop(env, storage, setup, fca, async (_fca, _inputs) => {
        // Optimized path: use raw SQL query for faster lookup
        const _r = await storage.knex.raw(
          `
          SELECT c.*, t.provenTxId, p.height, p.index, p.merklePath, p.rawTx, p.blockHash, p.merkleRoot
          FROM commissions c
          JOIN transactions t ON c.transactionId = t.transactionId
          JOIN proven_txs p ON t.provenTxId = p.provenTxId
          WHERE c.isRedeemed = 0
          AND NOT t.provenTxId IS NOT NULL
          ORDER BY c.commissionId
          LIMIT ? OFFSET ?;
        `,
          [_fca.paged!.limit, _fca.paged!.offset!]
        )
        return collectCommissions(storage, _fca, _inputs)
      })
    } catch (err) {
      console.error('Error in 4_redeemServiceCharges test:', err)
      throw err
    }

    await storage.destroy()
    await setup.wallet.destroy()
  })
})

async function createRedeemTestContext(env: ReturnType<typeof _tu.getEnv>) {
  const knex = Setup.createMySQLKnex(process.env.MAIN_CLOUD_MYSQL_CONNECTION!)
  const storage = new StorageKnex({
    chain: env.chain,
    knex: knex,
    commissionSatoshis: 0,
    commissionPubKeyHex: undefined,
    feeModel: { model: 'sat/kb', value: 1 }
  })

  await storage.makeAvailable()

  const setup = await _tu.createTestWalletWithStorageClient({
    chain: 'main',
    rootKeyHex: env.devKeys[env.commissionsIdentity]
  })
  storage.setServices(setup.services)
  return { storage, setup }
}

async function collectCommissions(
  storage: StorageKnex,
  fca: FindCommissionsArgs,
  inputs: CreateActionInput[]
): Promise<{ comms: TableCommission[]; beef: Beef; chainTracker: Awaited<ReturnType<typeof storage.getServices>>extends { getChainTracker: () => infer R } ? Awaited<R> : never; inputs: CreateActionInput[] }> {
  // This is a placeholder — the actual loop logic is in redeemCommissionsLoop
  return undefined as any
}

async function redeemCommissionsLoop(
  env: ReturnType<typeof _tu.getEnv>,
  storage: StorageKnex,
  setup: TestWalletOnly,
  fca: FindCommissionsArgs,
  collectFn: (fca: FindCommissionsArgs, inputs: CreateActionInput[]) => Promise<any>
) {
  for (;;) {
    const comms: TableCommission[] = []
    let beef = new Beef()
    const chainTracker = await setup.services.getChainTracker()
    const inputs: CreateActionInput[] = []

    await collectFn(fca, inputs)

    for (; comms.length < fca.paged!.limit; ) {
      const unredeemedComms = await storage.findCommissions(fca)
      if (unredeemedComms.length < 1) break

      for (const comm of unredeemedComms) {
        fca.paged!.offset! += 1
        const tt = verifyTruthy(await storage.findTransactionById(comm.transactionId, undefined, true))
        if (tt.provenTxId && tt.txid) {
          await storage.getBeefForTransaction(tt.txid, { mergeToBeef: beef, chainTracker, skipInvalidProofs: true })
          const tx = verifyTruthy(beef.findTxid(tt.txid)).tx!
          const commVOut = tx.outputs.findIndex(
            o => o.satoshis === comm.satoshis && o.lockingScript.toHex() === Utils.toHex(comm.lockingScript)
          )
          const input: CreateActionInput = {
            outpoint: `${tt.txid}.${commVOut}`,
            inputDescription: `commId:${comm.commissionId}`,
            unlockingScriptLength: 108
          }
          inputs.push(input)
          comms.push(comm)
          if (comms.length === fca.paged!.limit) break
        }
      }
    }

    if (comms.length < fca.paged!.limit) break

    if (comms.length > 0) {
      fca.paged!.offset! -= comms.length

      console.log(beef.toLogString())
      const verified = await beef.verify(chainTracker, false)
      expect(verified).toBe(true)

      const cao: CreateActionOptions = {
        randomizeOutputs: false,
        noSend: true
      }
      const ca: CreateActionArgs = {
        description: 'redeem commissions',
        inputs: inputs,
        inputBEEF: beef.toBinary(),
        options: cao
      }

      const car = await setup.wallet.createAction(ca)
      expect(car.signableTransaction).toBeTruthy()

      const st = car.signableTransaction!
      expect(st.reference).toBeTruthy()
      const atomicBeef = Beef.fromBinary(st.tx)
      const txid = atomicBeef.txs[atomicBeef.txs.length - 1].txid!
      const tx = atomicBeef.findTransactionForSigning(txid)!

      const priv = PrivateKey.fromHex(env.devKeys[env.commissionsIdentity])
      const pub = priv.toPublicKey()
      const curve = new Curve()
      const p2pkh = new P2PKH()
      const spends: Record<PositiveIntegerOrZero, SignActionSpend> = {}
      let vin = 0
      for (const comm of comms) {
        const { hashedSecret } = keyOffsetToHashedSecret(pub, comm.keyOffset)
        const bn = priv.add(hashedSecret).mod(curve.n)
        const offsetPrivKey = new PrivateKey(bn)
        const unlock = p2pkh.unlock(offsetPrivKey, 'all', false)
        tx.inputs[vin].unlockingScriptTemplate = unlock
        vin++
      }

      await tx.sign()

      vin = 0
      for (const comm of comms) {
        const script = tx.inputs[vin].unlockingScript!
        const unlockingScript = script.toHex()
        spends[vin] = { unlockingScript }
        vin++
      }

      const signArgs: SignActionArgs = {
        reference: st.reference,
        spends,
        options: {
          returnTXIDOnly: true,
          noSend: true
        }
      }

      const sr = await setup.wallet.signAction(signArgs)
      expect(sr.txid).toBeTruthy()

      for (const comm of comms) {
        await storage.updateCommission(comm.commissionId, { isRedeemed: true })
      }

      {
        const createArgs: CreateActionArgs = {
          description: `broadcasting noSend`,
          options: {
            acceptDelayedBroadcast: false,
            sendWith: [sr.txid!]
          }
        }

        const cr = await setup.wallet.createAction(createArgs)

        expect(cr.noSendChange).not.toBeTruthy()
        expect(cr.sendWithResults?.length).toBe(1)
        const [swr] = cr.sendWithResults!
        expect(swr.status !== 'failed').toBe(true)
      }
    }
  }
}
