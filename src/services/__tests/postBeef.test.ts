import { Beef, BeefTx } from '@bsv/sdk'
import { Services } from '../../index.client'
import { _tu, logger } from '../../../test/utils/TestUtilsWalletStorage'
import { sdk, Setup } from '../../index.all'

describe.skip('postBeef service tests', () => {
  jest.setTimeout(99999999)

  test('0 postBeef mainnet', async () => {
    if (Setup.noEnv('main')) return
    const services = createServices('main')
    await postBeefTest(services)
  })

  test('1 postBeef testnet', async () => {
    if (Setup.noEnv('test')) return
    const services = createServices('test')
    await postBeefTest(services)
  })

  /**
   * Test to verify deprioritization of a postBeef service that times out.
   */
  test.skip('2 postBeef mainnet timeout', async () => {
    if (Setup.noEnv('main')) return
    const services = createServices('main')
    const beef = Beef.fromString(beefTimeout)
    const txid = beef.txs.slice(-1)[0].txid
    const svcs0 = [...services.postBeefServices.services]
    const r = await services.postBeef(beef, [txid])
    const svcs1 = [...services.postBeefServices.services]
    expect(svcs0[1].name).toBe('TaalArcBeef')
    expect(svcs1.slice(-1)[0].name).toBe('TaalArcBeef')
  })
})

const beefTimeout =
  '0100beef01fe9fd10d000d02fdfe0300724e96684b24c87532f99023087423b97ffdff2d2f5ef0297a7d6ea954e48964fdff03026bafadb339fe2bf651958e94235251d68ca0784e45209265a0b2f1928e6f48ef01fdfe0100202bf5ecef0fb931ce451e514443c2026f58889c5a630a5d87c02f3eaca080e601fdfe000008ef522990bf4cb377cd013214b50689424b2031bd2c8fb758668aba3a007011017e0016924511d5773ce8030fc54595e4a1028fc9c071e5624205cb53faa5fb286680013e004c3dfbf8f8dd000521fc7121cc03c2cd2007a4424d8d3018671bc0fc32f5e1ba011e007c676e284227ecf36dac58506ebb0fc5833212860832d4d826803bffd74a2b21010e000b0f8c43e4beab689c14cb59b3f1cf93efe33905c22f40a9579c6b6e46cbd573010600f7734085b02e93f104d66d3fa5d864f4a1cc26cdb95fdfc450e34a3d8f13b5f201020041fe0c3fd297e1d83da186868cd92d374ddb3902d7d1054705df5165c0c93e8a0100007ed98d26a6f0d8d2043301cc9bfb255497c22566a59b83dade97240fa406a525010100a0561fe617c0ae0f34ee659a0d714c5b0a97e8c7cf1198edd56bfe8e8b15b7540101007bf537219f147fdedb4a5b8e0bb8a9b9c61a7bca3d05fe4ec84f85b11e21098d0101000198f7ae218e00137045252fb5f0d02c0c1a77e1ef686035dc22329b85f3e5c5020100000001b5db5dbd327c692ca8c9d5fdf7cc967f46769bfc0f481ea594a07fc60b8e9246010000006a4730440220537dcf526cf749d95c322e5daaf4479c15dbbbffa008a25560cbf833e6713fb902203f114c021d768ce9c5ea2094de296593b00926b59f64e37a6a39159607e4d05e412103852907f4bce12316784ea0ef7ac2b6a9d853a066d005ea5961750902025982a4ffffffff0214000000000000001976a914226cdae741a5e1258272bf2532669b54e7a813f988ac0100000000000000fdc5012102e01ef1e893d1164d05595f3979721d09e7dc8b971172df4bbceb56e72b7ed544ac3e314fc657a97ff276becda888ede531346172571a61491128c34c7df7ed5856e83db22843c1501de00fe93cddb47403e532f2492d4551bd974f0c7136ea533adb8d21e38f01080ce0c3fdbcbbb243b73ec0856836a423d368d100f97dafc690c0aa55534a632c612a1a0023886ac8dd2ba704d396b60894a11835eb13a01199d83bc1d19780186959f04d5408849d997fc07d99a58f9f0110b1e5ee52fe87606578c0cc33886597cca074d19b777de331fac609dea2b4108e5b95ec5b58529e5736101e54b537dc76eb3e5c9bfc4d793af8e8caa0550ce2b6ca9c1c10cedfe8f8e63c109f26aab8f9cb5f9e3456d9351d33fadd57e6a5a8973ad0ec148c27a0d1fecc720d222cedb8fbbd30af317298fd8347f7845f3edc4883ddfcd2a0c93665cff964a816f1c3a89b1c5dca7d6eb22326c023f316534299b93e836a49569a885c7ebe416fad632a1a0a4d506806d11c133bc2e8364730450221008975ecf19934195f972fbe7b4d1e6993d2186985aee919810bfaaf439ddf6cb802201946afd710f044e36932bb6d59d6191daaf044905e4b24a9f9ded193c4ac6d236d6d6d7500000000010001000000016bafadb339fe2bf651958e94235251d68ca0784e45209265a0b2f1928e6f48ef000000006b48304502210082b15b0e46da56060c3e508dbbe20c53a6282cc2c3ef2c8f7bd90c9e1748a86a02200e052abe131fb1aea3fdccf2f9ddbb59230aa99ebd7b55655388dbc6710fd15541210349c86999cb3a992c78e3cf72835071e3ca49d16c41e7c0a89d678c1a3cdc8bc8ffffffff0201000000000000001976a914554a6bf9c0203d0c2c75264786d7e8b05f143e0888ac12000000000000001976a914365fb266360071280a82ed90e6a9a85d8d35f74888ac0000000000'

function createServices(chain: sdk.Chain): Services {
  const env = _tu.getEnv(chain)
  const options = Services.createDefaultOptions(chain)

  if (env.taalApiKey) {
    options.taalApiKey = env.taalApiKey
    options.arcConfig.apiKey = env.taalApiKey
  }
  if (env.whatsonchainApiKey) options.whatsOnChainApiKey = env.whatsonchainApiKey
  if (env.bitailsApiKey) options.bitailsApiKey = env.bitailsApiKey
  logger(`
API Keys:
TAAL ${options.taalApiKey!.slice(0, 20)}
WHATSONCHAIN ${options.whatsOnChainApiKey!.slice(0, 20)}
BITAILS ${options.bitailsApiKey!.slice(0, 20)}
`)

  const services = new Services(options)
  return services
}

async function postBeefTest(services: Services) {
  const chain = services.chain
  if (Setup.noEnv(chain)) return
  const c = await _tu.createNoSendTxPair(chain)

  const txids = [c.txidDo, c.txidUndo]

  const rs = await services.postBeef(c.beef, txids)
  for (const r of rs) {
    const log = r.status === 'success' ? logger : console.log
    log(`r.notes = ${JSON.stringify(r.notes)}`)
    log(`r.txidResults = ${JSON.stringify(r.txidResults)}`)
    expect(r.status).toBe('success')
    for (const txid of txids) {
      const tr = r.txidResults.find(tx => tx.txid === txid)
      expect(tr).not.toBeUndefined()
      expect(tr!.status).toBe('success')
    }
  }

  // replace Undo transaction with double spend transaction and send again.
  const beef2 = c.beef.clone()
  beef2.txs[beef2.txs.length - 1] = BeefTx.fromTx(c.doubleSpendTx)
  const txids2 = [c.txidDo, c.doubleSpendTx.id('hex')]

  const r2s = await services.postBeef(beef2, txids2)
  for (const r2 of r2s) {
    const log = r2.status === 'error' ? logger : console.log
    log(`r2.notes = ${JSON.stringify(r2.notes)}`)
    log(`r2.txidResults = ${JSON.stringify(r2.txidResults)}`)
    expect(r2.status).toBe('error')
    for (const txid of txids2) {
      const tr = r2.txidResults.find(tx => tx.txid === txid)
      expect(tr).not.toBeUndefined()
      if (txid === c.txidDo) {
        expect(tr!.status).toBe('success')
      } else {
        expect(tr!.status).toBe('error')
        expect(tr!.doubleSpend).toBe(true)
        if (tr!.competingTxs !== undefined) expect(tr!.competingTxs).toEqual([c.txidUndo])
      }
    }
  }
}
