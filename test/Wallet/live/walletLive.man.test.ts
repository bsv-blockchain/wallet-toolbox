/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Beef,
  CachedKeyDeriver,
  CreateActionArgs,
  InternalizeActionArgs,
  KeyDeriver,
  KeyDeriverApi,
  PrivateKey,
  Utils,
  WalletInterface
} from '@bsv/sdk'
import {
  Services,
  asString,
  StorageKnex,
  sdk,
  verifyOne,
  verifyId,
  ScriptTemplateBRC29,
  randomBytesBase64,
  randomBytes,
  EntityProvenTxReq,
  TableOutput
} from '../../../src/index.all'
import { _tu, TestWalletNoSetup, TestWalletOnly } from '../../utils/TestUtilsWalletStorage'

import dotenv from 'dotenv'
dotenv.config()

describe('walletLive test', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('test')
  const myIdentityKey = env.identityKey
  const myRootKeyHex = env.devKeys[myIdentityKey]
  if (!myIdentityKey || !myRootKeyHex)
    throw new sdk.WERR_INVALID_OPERATION(
      `Requires a .env file with MY_${env.chain.toUpperCase()}_IDENTITY and corresponding DEV_KEYS entries.`
    )
  const myIdentityKey2 = env.identityKey2
  if (!myIdentityKey2)
    throw new sdk.WERR_INVALID_OPERATION(
      `Requires a .env file with MY_${env.chain.toUpperCase()}_IDENTITY2 and corresponding DEV_KEYS entries.`
    )
  const myRootKeyHex2 = env.devKeys[myIdentityKey2!]
  if (!myRootKeyHex2)
    throw new sdk.WERR_INVALID_OPERATION(
      `Requires a .env file with MY_${env.chain.toUpperCase()}_IDENTITY2 and corresponding DEV_KEYS entries.`
    )

  let myCtx: TestWalletOnly
  let myCtx2: TestWalletOnly
  const ctxs: TestWalletNoSetup[] = []
  let stagingStorage: StorageKnex

  beforeAll(async () => {
    myCtx = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: myRootKeyHex,
      chain: env.chain
    })
    myCtx2 = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: myRootKeyHex2,
      chain: env.chain
    })

    const connection = JSON.parse(process.env.TEST_CLOUD_MYSQL_CONNECTION || '')
    const knex = _tu.createMySQLFromConnection(connection)
    stagingStorage = (
      await _tu.createKnexTestWallet({
        knex,
        chain: 'test',
        databaseName: 'staging_wallet_storage',
        rootKeyHex: myRootKeyHex
      })
    ).activeStorage
  })

  afterAll(async () => {
    await stagingStorage.destroy()
    await myCtx.storage.destroy()
    for (const ctx of ctxs) await ctx.storage.destroy()
  })

  test('1 set change outputs spendable false if not valid utxos', async () => {
    // Check the list of outputs first using the debugger breakpoint, before updating spendable flags.
    for (const { wallet, activeStorage: storage, services } of ctxs) {
      const { invalidSpendableOutputs: notUtxos } = await confirmSpendableOutputs(storage, services)
      const outputsToUpdate = notUtxos.map(o => ({
        id: o.outputId,
        satoshis: o.satoshis
      }))

      const total: number = outputsToUpdate.reduce((t, o) => t + o.satoshis, 0)

      debugger
      // *** About set spendable = false for outputs ***/
      for (const o of outputsToUpdate) {
        await storage.updateOutput(o.id, { spendable: false })
      }
    }
  })

  test('2 review available change', async () => {
    for (const { wallet, activeStorage: storage, services, userId } of ctxs) {
      const { basketId } = verifyOne(
        await storage.findOutputBaskets({
          partial: { userId, name: 'default' }
        })
      )

      const r: object = {}
      for (const { name, txStatus } of [
        { name: 'completed', txStatus: <sdk.TransactionStatus[]>['completed'] },
        { name: 'nosend', txStatus: <sdk.TransactionStatus[]>['nosend'] },
        { name: 'unproven', txStatus: <sdk.TransactionStatus[]>['unproven'] },
        { name: 'failed', txStatus: <sdk.TransactionStatus[]>['failed'] },
        { name: 'sending', txStatus: <sdk.TransactionStatus[]>['sending'] },
        {
          name: 'unprocessed',
          txStatus: <sdk.TransactionStatus[]>['unprocessed']
        },
        { name: 'unsigned', txStatus: <sdk.TransactionStatus[]>['unsigned'] }
      ]) {
        const or = {
          txStatus,
          outputs: await storage.findOutputs({
            partial: { basketId, spendable: true },
            txStatus
          }),
          outputCount: 0,
          total: <number>0
        }
        or.total = or.outputs.reduce((t, o) => t + o.satoshis, 0)
        or.outputCount = or.outputs.length
        or.outputs = []
        r[name] = or
      }

      expect(r).toBeTruthy()
      let log = ''
      for (const [k, v] of Object.entries(r)) {
        if (v.outputCount > 0) log += `${k} count=${v.outputCount} total=${v.total}\n`
      }
      console.log(log)
    }
  })

  test.skip('3 abort incomplete transactions', async () => {
    for (const { wallet, activeStorage: storage, services, userId } of ctxs) {
      const txs = await storage.findTransactions({
        partial: { userId },
        status: ['unsigned']
      })
      const total = txs.reduce((s, t) => s + t.satoshis, 0)
      debugger
      for (const tx of txs) {
        await wallet.abortAction({ reference: tx.reference })
      }
    }
  })

  test.skip('4 create a wallet payment output', async () => {
    const r = await createWalletPaymentAction({
      toIdentityKey: '02bec52b12b8575f981cf38f3739ffbbfe4f6c6dbe4310d6384b6e97b122f0d087',
      outputSatoshis: 100 * 1000,
      keyDeriver: myCtx.keyDeriver,
      wallet: myCtx.wallet,
      logResult: true
    })
  })

  test('5 pull out txid from BEEF', async () => {
    const beefHex =
      '010101015c574f48257202b9bff1b14baaa31cea24b9132555216900c277566d440250c50200beef01fee100190003020602f1fdbfa55c7227d2d9f93b7c2b83596a8e336ced483c1616dd98e8a32054dc6307010102009602f0b0959d085cbfda1a0958f65882b1a2829d66853582c0a530586dd00e930100002a7f27bd83b7d490f6641bbd3a8bdeff31490c14430597302ba579392be33f730201000100000001faba5977e9d7894778490ad3d3cf3ff0144da2920f6b31869dbcc026b693061b000000006a473044022050b2a300cad0e4b4c5ecaf93445937f21f6ec61d0c1726ac46bfb5bc2419af2102205d53e70fbdb0d1181a3cb1ef437ae27a73320367fdb78e8cadbfcbf82054e696412102480166f272ee9b639317c16ee60a2254ece67d0c7190fedbd26d57ac30f69d65ffffffff1da861000000000000c421029b09fdddfae493e309d3d97b919f6ab2902a789158f6f78489ad903b7a14baeaac2131546f446f44744b7265457a6248594b466a6d6f42756475466d53585855475a4735840423b7e26b5fd304a88f2ea28c9cf04d6c0a6c52a3174b69ea097039a355dbc6d95e702ac325c3f07518c9b4370796f90ad74e1c46304402206cd8228dd5102f7d8bd781e71dbf60df6559e90df9b79ed1c2b51d0316432f5502207a8713e899232190322dd4fdac6384f6b416ffa10b4196cdc7edbaf751b4a1156d7502000000000000001976a914ee8f77d351270123065a30a13e30394cbb4a6a2b88ace8030000000000001976a9147c8d0d51b07812872049e60e65a28d1041affc1f88ace8030000000000001976a914494c42ae91ebb8d4df662b0c2c98acfcbf14aff388ac93070000000000001976a9149619d3a2c3669335175d6fbd1d785719418cd69588acef030000000000001976a91435aabdafdc475012b7e2b7ab42e8f0fd9e8b665588ac59da0000000000001976a914c05b882ce290b3c19fbb0fca21e416f204d855a188acf3030000000000001976a9146ccff9f5e40844b784f1a68269afe30f5ec84c5d88accb340d00000000001976a914baf2186a8228a9581e0af744e28424343c6a464d88ace9030000000000001976a914a9c3b08f698df167c352f56aad483c907a0e64f488ac61140000000000001976a914f391b03543456ca68f3953b5ef4883f1299b4a2c88ac44c10500000000001976a914e6631bf6d96f93db48fb51daeace803ad805c09788ace9030000000000001976a9148cac2669fc696f5fb39aa59360a2cd20a6daffac88ac49b00400000000001976a9142c16b8a63604c66aa51f47f499024e327657ab5388acd7d50100000000001976a914ca5b56f03f796f55583c7cdd612c02f8d232669388ac42050000000000001976a914175a6812dbf2a550b1bf0d21594b96f9daf60d7988ac15040000000000001976a9147422a7237bb0fa77691047abf930e0274d193fe788ace9030000000000001976a9141a32c1c07dd4f9c632ce6b43dd28c8b27a37d81588ace8030000000000001976a914d9433de1883950578e9a29013aedb1e66d900bdc88ac39190000000000001976a9149fcdbc118b0114d2cc086a75eb14d880e3e25a9e88ac55390200000000001976a914cccf036ec7ae05690461c9d1be10193b6427055588ac1d010000000000001976a9148578396af7a6783824ff680315cc0a1375d9586e88acb3090000000000001976a9147c63cace8600f5400c8678cb2c843400c0c8ac2788acc55d0000000000001976a9148bf6991866b525f36dda54f7ca393c3a56cfff7188acc9100b00000000001976a914af41bf9bbf9d345f6b7cb37958d4cf43e88b17ef88acda040000000000001976a914ad818fcb671cc5b85dc22056d97a9b31aede4f3288ace8030000000000001976a91403ae9f7e41baee27ab7e66a323e73ee6801b5e1688ac59040000000000001976a9149f19356274a53ffdfb755bd81d40a97fe79b5e9b88ac10340000000000001976a914504dff507fccce4005f2d374cbdb6d5d493ceda288ac00000000000100000001f1fdbfa55c7227d2d9f93b7c2b83596a8e336ced483c1616dd98e8a32054dc63060000006b4830450221009bb61b5ec65cbcee0705cf757eba43e1716bfebf3ef976a09ffc926edee9ce6c022060606f5b5e59a6210067633a1263c23156d426feb1912cea480789beef62568741210208132e357b0d061848e779700eae5d69e5240a2503dd753a00e6cb3a8a920255ffffffff06e8030000000000001976a9149cedb88029c24f8bb9824628dfa0a023c1db5edc88acb40a0000000000001976a914da9b117c6880799eb3a0d0ccca252d7f11be240588ac35290000000000001976a914a8f814d3e2a2112bfe2f158f0596314a4379d45088ac54600000000000001976a91476f6f9a9ede3b7e496c921e6730be0af8d3fdfda88ac0e040000000000001976a91419a4615e24931e0e3b25e150fb362b56c5f4e89688ac253e0000000000001976a91435f0dcc5f8c47821a9d24d456b09995981cdb03f88ac00000000'
    const beef = Beef.fromString(beefHex)
    const btx = beef.findTxid('5c574f48257202b9bff1b14baaa31cea24b9132555216900c277566d440250c5')
    console.log(`
  tx: '${Utils.toHex(btx?.rawTx!)}'

  ${beef.toLogString()}

`)
  })

  test('5z send a wallet payment from myCtx to second wallet', async () => {
    const tauriRootKey = '1363ef9b14531a52648e1e7e7f430a10ceda1df8d514a2a75d8404094f14a649'
    const tauriIdentityKey = PrivateKey.fromHex(tauriRootKey).toPublicKey().toString()

    const r = await createWalletPaymentAction({
      toIdentityKey: tauriIdentityKey,
      outputSatoshis: 1000 * 1000,
      keyDeriver: myCtx.keyDeriver,
      wallet: myCtx.wallet,
      logResult: true
    })

    const toCtx = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: tauriRootKey,
      chain: env.chain
    })

    const args: InternalizeActionArgs = {
      tx: Utils.toArray(r.atomicBEEF, 'hex'),
      outputs: [
        {
          outputIndex: r.vout,
          protocol: 'wallet payment',
          paymentRemittance: {
            derivationPrefix: r.derivationPrefix,
            derivationSuffix: r.derivationSuffix,
            senderIdentityKey: r.senderIdentityKey
          }
        }
      ],
      description: 'from tone wallet'
    }

    const rw = await toCtx.wallet.internalizeAction(args)
    expect(rw.accepted).toBe(true)
  })

  test('6 send a wallet payment from myCtx to second wallet', async () => {
    const r = await createWalletPaymentAction({
      toIdentityKey: myIdentityKey2,
      outputSatoshis: randomBytes(1)[0] + 10,
      keyDeriver: myCtx.keyDeriver,
      wallet: myCtx.wallet,
      logResult: true
    })

    const toCtx = myCtx2

    const args: InternalizeActionArgs = {
      tx: Utils.toArray(r.atomicBEEF, 'hex'),
      outputs: [
        {
          outputIndex: r.vout,
          protocol: 'wallet payment',
          paymentRemittance: {
            derivationPrefix: r.derivationPrefix,
            derivationSuffix: r.derivationSuffix,
            senderIdentityKey: r.senderIdentityKey
          }
        }
      ],
      description: 'from live wallet'
    }

    const rw = await toCtx.wallet.internalizeAction(args)

    expect(rw.accepted).toBe(true)
    const beef = Beef.fromString(r.atomicBEEF)
    const btx = beef.txs.slice(-1)[0]
    const txid = btx.txid
    const req = await EntityProvenTxReq.fromStorageTxid(stagingStorage, txid)
    expect(req?.notify.transactionIds?.length).toBe(2)
  })

  test('6a help setup my own wallet', async () => {
    const privKey = PrivateKey.fromRandom()
    const identityKey = privKey.toPublicKey().toString()

    const log = `
    // Add the following to .env file:
    MY_TEST_IDENTITY = '${identityKey}'
    DEV_KEYS = '{
        "${identityKey}": "${privKey.toString()}"
    }'
    `
    console.log(log)
  })

  test('6b run liveWallet Monitor once', async () => {
    const liveCtx = ctxs[0]
    await liveCtx.monitor.runOnce()
    expect(1 === 1)
  })

  test('6c send a wallet payment from live to your own wallet', async () => {
    const myIdentityKey = env.identityKey
    const myRootKeyHex = env.devKeys[myIdentityKey]
    if (!myIdentityKey || !myRootKeyHex)
      throw new sdk.WERR_INVALID_OPERATION(
        `Requires a .env file with MY_${env.chain.toUpperCase()}_IDENTITY and corresponding DEV_KEYS entries.`
      )

    const toIdentityKey: string = '02947542cf31c8d91c303bba8f981ee9595c414e63c185d495a97c558aa7b2e522'
    const r = createWalletPaymentOutput({
      toIdentityKey,
      fromRootKeyHex: myRootKeyHex,
      logResult: true
    })
    console.log(`\n${JSON.stringify(r)}\n`)
  })

  test('6d make atomicBEEF for known txid', async () => {
    const txid = '6b9e8ed767ed6e6366527ddf8707637f3aaee1093085985c1dd04f347a3c25be'
    const beef = new Beef()
    beef.mergeTxidOnly(txid)
    console.log(`
BEEF for known txid ${txid}

${Utils.toHex(beef.toBinaryAtomic(txid))}

`)
  })

  test('6e make atomicBEEF for txid from staging-dojo', async () => {
    const myIdentityKey = env.identityKey
    const myRootKeyHex = env.devKeys[myIdentityKey]
    const txid = '6b9e8ed767ed6e6366527ddf8707637f3aaee1093085985c1dd04f347a3c25be'

    const beef = await stagingStorage.getBeefForTransaction(txid, {})
    console.log(`
${beef.toLogString()}

AtomicBEEF for known txid ${txid}

${Utils.toHex(beef.toBinaryAtomic(txid))}

`)
  })

  test('7 test two client wallets', async () => {
    if (!myIdentityKey2) return
    if (myCtx) await myCtx.storage.destroy()
    myCtx = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: myRootKeyHex,
      chain: env.chain
    })

    {
      const u1 = await myCtx.storage.findOrInsertUser(myIdentityKey)
    }

    if (myCtx) await myCtx.storage.destroy()
    if (myCtx2) await myCtx2.storage.destroy()
    myCtx2 = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: myRootKeyHex2,
      chain: env.chain
    })

    {
      const u2 = await myCtx2.storage.findOrInsertUser(myIdentityKey2)
    }

    if (myCtx) await myCtx.storage.destroy()
    if (myCtx2) await myCtx2.storage.destroy()
    myCtx = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: myRootKeyHex,
      chain: env.chain
    })
    myCtx2 = await _tu.createTestWalletWithStorageClient({
      rootKeyHex: myRootKeyHex2,
      chain: env.chain
    })

    {
      const u1 = await myCtx.storage.findOrInsertUser(myIdentityKey)
      const u2 = await myCtx2.storage.findOrInsertUser(myIdentityKey2)

      expect(u1.user.userId).not.toBe(u2.user.userId)
    }
  })

  // End of describe
})

async function confirmSpendableOutputs(
  storage: StorageKnex,
  services: Services
): Promise<{ invalidSpendableOutputs: TableOutput[] }> {
  const invalidSpendableOutputs: TableOutput[] = []
  const users = await storage.findUsers({ partial: {} })

  for (const { userId } of users) {
    const defaultBasket = verifyOne(await storage.findOutputBaskets({ partial: { userId, name: 'default' } }))
    const where: Partial<TableOutput> = {
      userId,
      basketId: defaultBasket.basketId,
      spendable: true
    }

    const outputs = await storage.findOutputs({ partial: where })

    for (let i = outputs.length - 1; i >= 0; i--) {
      const o = outputs[i]
      const oid = verifyId(o.outputId)

      if (o.spendable) {
        let ok = false
        if (o.lockingScript && o.lockingScript.length > 0) {
          const r = await services.getUtxoStatus(asString(o.lockingScript), 'script')
          if (r.status === 'success' && r.isUtxo && r.details?.length > 0) {
            const tx = await storage.findTransactionById(o.transactionId)
            if (
              tx &&
              tx.txid &&
              r.details.some(d => d.txid === tx.txid && d.satoshis === o.satoshis && d.index === o.vout)
            ) {
              ok = true
            }
          }
        }

        if (!ok) {
          invalidSpendableOutputs.push(o)
        }
      }
    }
  }

  return { invalidSpendableOutputs }
}

export function createWalletPaymentOutput(args: {
  toIdentityKey: string
  fromRootKeyHex: string
  logResult?: boolean
}): {
  senderIdentityKey: string
  derivationPrefix: string
  derivationSuffix: string
  lockingScript: string
} {
  const t = new ScriptTemplateBRC29({
    derivationPrefix: randomBytesBase64(8),
    derivationSuffix: randomBytesBase64(8),
    keyDeriver: new CachedKeyDeriver(PrivateKey.fromString(args.fromRootKeyHex))
  })

  const lockingScript = t.lock(args.fromRootKeyHex, args.toIdentityKey)

  const r = {
    senderIdentityKey: t.params.keyDeriver.identityKey,
    derivationPrefix: t.params.derivationPrefix!,
    derivationSuffix: t.params.derivationSuffix!,
    lockingScript: lockingScript.toHex()
  }
  if (args.logResult) {
    console.log(`
// createWalletPaymentOutput
const r = {
  senderIdentityKey: '${r.senderIdentityKey}',
  derivationPrefix: '${r.derivationPrefix}',
  derivationSuffix: '${r.derivationSuffix}'
  lockingScript: '${r.lockingScript}'
}`)
  }

  return r
}

export async function createWalletPaymentAction(args: {
  toIdentityKey: string
  outputSatoshis: number
  keyDeriver: KeyDeriverApi
  wallet: WalletInterface
  logResult?: boolean
}): Promise<{
  senderIdentityKey: string
  vout: number
  txid: string
  derivationPrefix: string
  derivationSuffix: string
  atomicBEEF: string
}> {
  const { toIdentityKey, outputSatoshis, keyDeriver, wallet } = args

  const t = new ScriptTemplateBRC29({
    derivationPrefix: randomBytesBase64(8),
    derivationSuffix: randomBytesBase64(8),
    keyDeriver
  })

  const createArgs: CreateActionArgs = {
    description: `pay ${args.toIdentityKey}`.slice(0, 50),
    labels: ['wallet-payment'],
    outputs: [
      {
        satoshis: outputSatoshis,
        lockingScript: t.lock(keyDeriver.rootKey.toString(), toIdentityKey).toHex(),
        outputDescription: `for ${args.toIdentityKey}`.slice(0, 50),
        basket: 'wallet-paymnet',
        tags: ['wp-out']
      }
    ],
    options: {
      //acceptDelayedBroadcast: false,
      randomizeOutputs: false,
      signAndProcess: true
    }
  }

  const cr = await wallet.createAction(createArgs)

  const r = {
    senderIdentityKey: keyDeriver.identityKey,
    vout: 0,
    txid: cr.txid!,
    derivationPrefix: t.params.derivationPrefix!,
    derivationSuffix: t.params.derivationSuffix!,
    atomicBEEF: Utils.toHex(cr.tx!)
  }

  if (args.logResult) {
    console.log(`
// createWalletPaymentAction
const r = {
  senderIdentityKey: '${r.senderIdentityKey}',
  vout: 0,
  txid: '${r.txid}',
  derivationPrefix: '${r.derivationPrefix}',
  derivationSuffix: '${r.derivationSuffix}'
  atomicBEEF: '${r.atomicBEEF}'
}`)
  }

  return r
}
