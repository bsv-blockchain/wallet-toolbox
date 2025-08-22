import { _tu } from '../../../../test/utils/TestUtilsWalletStorage'
import { WhatsOnChain } from '../WhatsOnChain'
import { Services } from '../../Services'
import { Setup } from '../../../Setup'
import { wait } from '../../../utility/utilityHelpers'
import { WalletError } from '../../../sdk/WalletError'
import { StorageKnex } from '../../../storage/StorageKnex'
import { StorageClient } from '../../../storage/remoting/StorageClient'

describe('whatsonchain tests', () => {
  jest.setTimeout(99999999)

  test('00', () => {})
  if (_tu.noTestEnv('test')) return

  const envTest = _tu.getEnv('test')
  const wocTest = new WhatsOnChain(envTest.chain, {
    apiKey: envTest.taalApiKey
  })
  const envMain = _tu.getEnv('main')
  const wocMain = new WhatsOnChain(envMain.chain, {
    apiKey: envMain.taalApiKey
  })

  test('0 getRawTx testnet', async () => {
    const rawTx = await wocTest.getRawTx('7e5b797b86abd31a654bf296900d6cb14d04ef0811568ff4675494af2d92166b')
    expect(
      rawTx ===
        '010000000158EED5DBBB7E2F7D70C79A11B9B61AABEECFA5A7CEC679BEDD00F42C48A4BD45010000006B483045022100AE8BB45498A40E2AC797775C405C108168804CD84E8C09A9D42D280D18EDDB6D022024863BFAAC5FF3C24CA65E2F3677EDA092BC3CC5D2EFABA73264B8FF55CF416B412102094AAF520E14E1C4D68496822800BCC7D3B3B26CA368E004A2CB70B398D82FACFFFFFFFF0203000000000000007421020A624B72B34BC192851C5D8890926BBB70B31BC10FDD4E3BC6534E41B1C81B93AC03010203030405064630440220013B4984F4054C2FBCD2F448AB896CCA5C4E234BF765B0C7FB27EDE572A7F7DA02201A5C8D0D023F94C209046B9A2B96B2882C5E43B72D8115561DF8C07442010EEA6D7592090000000000001976A9146511FCE2F7EF785A2102142FBF381AD1291C918688AC00000000'
    )

    expect(await wocTest.getRawTx('1'.repeat(64))).toBeUndefined()
  })

  test('1 getRawTx mainnet', async () => {
    const rawTx = await wocMain.getRawTx('d9978ffc6676523208f7b33bebf1b176388bbeace2c7ef67ce35c2eababa1805')
    expect(
      rawTx ===
        '0100000001026A66A5F724EB490A55E0E08553286F08AD57E92C4BF34B5C44EA6BC0A49828020000006B483045022100C3D9A5ACA30C1F2E1A54532162E7AFE5AA69150E4C06D760414A16D1EA1BABD602205E0D9191838B0911A1E7328554A2B22EFAA80CF52B15FBA37C3046A0996C7AAD412103FA3CF488CA98D9F2DB91843F36BAF6BE39F6C947976C02394602D09FBC5F4CF4FFFFFFFF0210270000000000001976A91444C04354E88975C4BEF30CFE89D300CC7659F7E588AC96BC0000000000001976A9149A53E5CF5F1876924D98A8B35CA0BC693618682488AC00000000'
    )

    expect(await wocMain.getRawTx('1'.repeat(64))).toBeUndefined()
  })

  test('2 getMerklePath testnet', async () => {
    const services = new Services(envTest.chain)
    {
      const r = await wocTest.getMerklePath(
        '7e5b797b86abd31a654bf296900d6cb14d04ef0811568ff4675494af2d92166b',
        services
      )
      const s = JSON.stringify(r)
      expect(s).toBe(
        '{"name":"WoCTsc","notes":[{"what":"getMerklePathSuccess","name":"WoCTsc","status":200,"statusText":"OK"}],"merklePath":{"blockHeight":1661398,"path":[[{"offset":6,"hash":"7e5b797b86abd31a654bf296900d6cb14d04ef0811568ff4675494af2d92166b","txid":true},{"offset":7,"hash":"97dd9d9080394d52338588732d9f84e1debca93f171f674ac3beac1e75495568"}],[{"offset":2,"hash":"81beedcd219d9e03255bde2ee479db34b9fed04d30373ba8bc264a64af2515b9"}],[{"offset":0,"hash":"9965f9aaeea33f6878335e6f7e6bdb544c3a8550c84e2f0daca54e9cd912111c"}]]},"header":{"version":536870912,"previousHash":"000000000688340a14b77e49bb0fca5ac7b624f7f79a5517583d1aae61c4e658","merkleRoot":"edbc07082ca0a31d5ec89d1f503a9cd41112c0d8f3221a96acfb8a9d16f8e82b","time":1739624725,"bits":486604799,"nonce":1437884974,"height":1661398,"hash":"00000000d8a73bf9a37272a71886ea92a25376bed1c1916f2b5cfbec4d6f6a25"}}'
      )
    }

    {
      const r = await wocTest.getMerklePath('1'.repeat(64), services)
      const s = JSON.stringify(r)
      expect(s).toBe(
        '{"name":"WoCTsc","notes":[{"what":"getMerklePathNoData","name":"WoCTsc","status":200,"statusText":"OK"}]}'
      )
    }
  })

  test('3 getMerklePath mainnet', async () => {
    const services = new Services(envMain.chain)
    {
      const r = await wocMain.getMerklePath(
        'd9978ffc6676523208f7b33bebf1b176388bbeace2c7ef67ce35c2eababa1805',
        services
      )
      const s = JSON.stringify(r)
      expect(s).toBe(
        '{"name":"WoCTsc","notes":[{"what":"getMerklePathSuccess","name":"WoCTsc","status":200,"statusText":"OK"}],"merklePath":{"blockHeight":883637,"path":[[{"offset":46,"hash":"d9978ffc6676523208f7b33bebf1b176388bbeace2c7ef67ce35c2eababa1805","txid":true},{"offset":47,"hash":"066f6fa6fa988f2e3a9d6fe35fa0d3666c652dac35cabaeebff3738a4e67f68f"}],[{"offset":22,"hash":"232089a6f77c566151bc4701fda394b5cc5bf17073140d46a73c4c3ed0a7b911"}],[{"offset":10,"hash":"c639b3a6ce127f67dbd01c7331a6fca62a4b429830387bd68ac6ac05e162116d"}],[{"offset":4,"hash":"730cec44be97881530947d782bb328d25f1122fdae206296937fffb03e936d48"}],[{"offset":3,"hash":"28b681f8ab8db0fa4d5d20cb1532b95184a155346b0b8447bde580b2406d51e6"}],[{"offset":0,"hash":"c49a18028e230dd1439b26794c08c339506f24a450f067c4facd4e0d5a346490"}],[{"offset":1,"hash":"0ba57d1b1fad6874de3640c01088e3dedad3507e5b3a3102b9a8a8055f3df88b"}],[{"offset":1,"hash":"c830edebe5565c19ba584ec73d49129344d17539f322509b7c314ae641c2fcdb"}],[{"offset":1,"hash":"ff62d5ed2a94eb93a2b7d084b8f15b12083573896b6a58cf871507e3352c75f5"}]]},"header":{"version":1040187392,"previousHash":"00000000000000000d9f6889dd6743500adee204ea25d8a57225ecd48b111769","merkleRoot":"59c1efd79fae0d9c29dd8da63f8eeec0aadde048f4491c6bfa324fcfd537156d","time":1739329877,"bits":403818359,"nonce":596827153,"height":883637,"hash":"0000000000000000060ac8d63b78d41f58c9aba0b09f81db7d51fa4905a47263"}}'
      )
    }

    {
      const r = await wocMain.getMerklePath('1'.repeat(64), services)
      const s = JSON.stringify(r)
      expect(s).toBe(
        '{"name":"WoCTsc","notes":[{"what":"getMerklePathNoData","name":"WoCTsc","status":200,"statusText":"OK"}]}'
      )
    }
  })

  test('4 updateBsvExchangeRate', async () => {
    {
      const r = await wocMain.updateBsvExchangeRate()
      expect(r.base).toBe('USD')
      expect(r.rate).toBeGreaterThan(0)
      expect(r.timestamp).toBeTruthy()
    }
  })

  test('5 getTxPropagation testnet', async () => {
    return
    // throwing internal server error 500 when tested.
    const count = await wocTest.getTxPropagation('7e5b797b86abd31a654bf296900d6cb14d04ef0811568ff4675494af2d92166b')
    expect(count > 0)

    expect((await wocTest.getTxPropagation('1'.repeat(64))) === 0)
  })

  test('6 getTxPropagation mainnet', async () => {})

  test.skip('7 postRawTx testnet', async () => {
    if (Setup.noEnv('test')) return
    const woc = wocTest
    const c = await _tu.createNoSendTxPair('test')

    const rawTxDo = c.beef.findTxid(c.txidDo)!.tx!.toHex()
    const rawTxUndo = c.beef.findTxid(c.txidUndo)!.tx!.toHex()

    const txidDo = await woc.postRawTx(rawTxDo)
    expect(txidDo).toBe(c.txidDo)

    await wait(1000)

    const txidUndo = await woc.postRawTx(rawTxUndo)
    expect(txidUndo).toBe(c.txidUndo)
  })

  test.skip('7a nosend cleanup testnet', async () => {
    const c = await _tu.createWalletSetupEnv('test')

    const actions = await c.wallet.listActions({ labels: [], limit: 1000 })
    const nosends = actions.actions.filter(a => a.status === 'nosend')

    const refs = ['yUfgNVaFcBNyP2Xv']
    for (const ref of refs) {
      try {
        await c.wallet.abortAction({ reference: ref })
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
      }
    }
  })

  test.skip('8 postRawTx mainnet', async () => {
    if (Setup.noEnv('main')) return
    const woc = wocMain
    const c = await _tu.createNoSendTxPair('main')

    const rawTxDo = c.beef.findTxid(c.txidDo)!.tx!.toHex()
    const rawTxUndo = c.beef.findTxid(c.txidUndo)!.tx!.toHex()

    const txidDo = await woc.postRawTx(rawTxDo)
    expect(txidDo).toBe(c.txidDo)

    /*
        try {
            // This method is broken as of 2025-02-16
            const count = await woc.getTxPropagation(txidDo)
        } catch {}
        // getRawTx returns undefined for unmined transactions, sometimes.
        let rawTx = await woc.getRawTx(txidDo)
        let i = 0
        while (!rawTx) {
            console.log(`${i++} waiting for WhatsOnChain to acknowledge new transaction exists.`)
            await wait(5000)
            rawTx = await woc.getRawTx(txidDo)
        }
        expect(rawTx).toBe(rawTxDo)
        */

    // allow for propagation...
    await wait(1000)

    const txidUndo = await woc.postRawTx(rawTxUndo)
    expect(txidUndo).toBe(c.txidUndo)

    await wait(1000)

    // Confirm double spend detection.
    // 'The rawTx parameter must be valid. unexpected response code 500: 258: txn-mempool-conflict'
    // 'The rawTx parameter must be valid. unexpected response code 500: Missing inputs'
    try {
      await woc.postRawTx(c.doubleSpendTx.toHex())
      expect(false)
    } catch (eu: unknown) {
      const e = WalletError.fromUnknown(eu)
      expect(
        e.message === 'The rawTx parameter must be valid. unexpected response code 500: 258: txn-mempool-conflict' ||
          'The rawTx parameter must be valid. unexpected response code 500: Missing inputs'
      )
    }
  })

  test.skip('8a nosend cleanup mainnet', async () => {
    const c = await _tu.createWalletSetupEnv('main')

    const actions = await c.wallet.listActions({ labels: [], limit: 1000 })
    const nosends = actions.actions.filter(a => a.status === 'nosend')
    // No way to get from actions to reference string values for use with abortAction...

    if (c['activeStorage']) {
      const s = c['activeStorage'] as StorageKnex
      const userId = c['userId'] as number
      const txs = await s.findTransactions({
        partial: { userId, status: 'nosend' }
      })
      const refs = txs.map(tx => tx.reference)
      for (const ref of refs) {
        try {
          await c.wallet.abortAction({ reference: ref })
        } catch (eu: unknown) {
          const e = WalletError.fromUnknown(eu)
        }
      }
    }

    await c.wallet.destroy()
  })

  test.skip('8b run monitor mainnet', async () => {
    if (Setup.noEnv('main')) return
    if (!Setup.getEnv('main').filePath) return

    // Only run if `Setup` style .env is present with a sqlite filePath...

    const c = await _tu.createWalletSetupEnv('main')

    await c.monitor.runOnce()

    await c.wallet.destroy()
  })

  test.skip('8c backup to cloud', async () => {
    if (Setup.noEnv('main')) return
    if (!Setup.getEnv('main').filePath) return

    const c = await _tu.createWalletSetupEnv('main')
    const client = new StorageClient(c.wallet, 'https://storage.babbage.systems')
    await c.storage.addWalletStorageProvider(client)
    await c.storage.updateBackups()

    await c.wallet.destroy()
  })
})
