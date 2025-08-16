import { createDefaultChaintracksOptions } from '../createDefaultChaintracksOptions'
import { Chaintracks } from '../Chaintracks'
import { wait } from '../../../../utility/utilityHelpers'
import { ChaintracksStorageNoDb } from '../Storage/ChaintracksStorageNoDb'
import { ChaintracksFs } from '../util/ChaintracksFs'

const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'

describe('Chaintracks tests', () => {
  jest.setTimeout(99999999)

  test('0 basic operation mainnet', async () => {
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
    const o = createDefaultChaintracksOptions('main', rootFolder)
    const so = ChaintracksStorageNoDb.createStorageBaseOptions(o.chain)
    const s = new ChaintracksStorageNoDb(so)
    o.storageEngine = s
    const c = new Chaintracks(o)
    await c.makeAvailable()

    c.subscribeHeaders(header => {
      console.log(`Header received: ${header.height} ${header.hash}`)
    })

    //const fs = ChaintracksFs
    //await s.bulkManager.exportHeadersToFs(fs, 100000, fs.pathJoin(rootFolder, 'export_1'), 'https://cdn.projectbabbage.com/blockheaders')

    let done = false
    for (; !done; ) {
      const range = await s.getAvailableHeightRanges()
      await wait(10000)
    }

    await c.destroy()
  })
})
