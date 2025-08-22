import { createDefaultChaintracksOptions, createNoDbChaintracksOptions } from '../createDefaultChaintracksOptions'
import { Chaintracks } from '../Chaintracks'
import { wait } from '../../../../utility/utilityHelpers'
import { ChaintracksStorageNoDb } from '../Storage/ChaintracksStorageNoDb'
import { ChaintracksFs } from '../util/ChaintracksFs'
import { Chain } from '../../../../sdk'

const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'

describe('Chaintracks tests', () => {
  jest.setTimeout(99999999)

  test.skip('0 basic operation mainnet', async () => {
    const o = createDefaultChaintracksOptions('main', rootFolder)
    const c = new Chaintracks(o)
    await c.makeAvailable()

    let done = false
    for (; !done; ) {
      await wait(10000)
    }

    await c.destroy()
  })

  test('1 NoDb mainnet', async () => {
    await NoDbBody('main')
  })

  test('2 NoDb testnet', async () => {
    await NoDbBody('test')
  })

  async function NoDbBody(chain: Chain) {
    const o = createNoDbChaintracksOptions(chain)
    const c = new Chaintracks(o)
    await c.makeAvailable()

    c.subscribeHeaders(header => {
      console.log(`Header received: ${header.height} ${header.hash}`)
    })

    //let done = false
    //for (; !done; ) {
    await wait(1000)
    //}

    await c.destroy()
  }
})
