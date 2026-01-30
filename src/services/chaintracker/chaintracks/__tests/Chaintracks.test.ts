import { createDefaultKnexChaintracksOptions } from '../createDefaultKnexChaintracksOptions'
import { Chaintracks } from '../Chaintracks'
import { wait } from '../../../../utility/utilityHelpers'
import { Chain } from '../../../../sdk'
import { createDefaultNoDbChaintracksOptions } from '../createDefaultNoDbChaintracksOptions'
import { ChaintracksFs } from '../util/ChaintracksFs'
import { LocalCdnServer } from './LocalCdnServer'
import { _tu } from '../../../../../test/utils/TestUtilsWalletStorage'

const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'

describe('Chaintracks tests', () => {
  jest.setTimeout(99999999)

  test.skip('0 basic operation mainnet', async () => {
    const o = createDefaultKnexChaintracksOptions('main', rootFolder)
    const c = new Chaintracks(o)
    await c.makeAvailable()

    let done = false
    for (; !done; ) {
      await wait(10000)
    }

    await c.destroy()
  })

  test('1 NoDb mainnet', async () => {
    if (_tu.noEnv('main')) return
    await NoDbBody('main')
  })

  test('2 NoDb testnet', async () => {
    if (_tu.noEnv('main')) return
    await NoDbBody('test')
  })

  test('3 NoDb export mainnet', async () => {
    if (_tu.noEnv('main')) return
    await NoDbBody('main', true)
  })

  test.skip('4 NoDb export testnet', async () => {
    await NoDbBody('test', true)
  })

  test.skip('5 run local CDN on port 8300', async () => {
    const fs = ChaintracksFs
    const server = new LocalCdnServer(8300, fs.pathJoin(rootFolder, 'export'))
    await server.start()
    let done = false
    for (; !done; ) {
      await wait(10000)
    }
    await server.stop()
  })

  async function NoDbBody(chain: Chain, exportHeaders?: boolean) {
    const o = createDefaultNoDbChaintracksOptions(chain)
    const c = new Chaintracks(o)
    await c.makeAvailable()

    c.subscribeHeaders(header => {
      console.log(`Header received: ${header.height} ${header.hash}`)
    })

    if (exportHeaders) {
      const rootFolder = './src/services/chaintracker/chaintracks/__tests/data/export'
      await c.exportBulkHeaders(rootFolder, ChaintracksFs, `https://cdn.projectbabbage.com/blockheaders`, 100000)
    }
    //let done = false
    //for (; !done; ) {
    await wait(1000)
    //}

    await c.destroy()
  }
})
