import { BeefTx } from '@bsv/sdk'
import { Services } from '../../index.client'
import { _tu, logger } from '../../../test/utils/TestUtilsWalletStorage'
import { sdk, Setup } from '../../index.all'

describe('postBeef service tests', () => {
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
})

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
