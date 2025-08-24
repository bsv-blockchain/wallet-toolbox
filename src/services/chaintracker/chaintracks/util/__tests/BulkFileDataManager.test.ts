import { Knex, knex as makeKnex } from 'knex'
import { ChaintracksStorageKnex } from '../../Storage/ChaintracksStorageKnex'
import { deserializeBlockHeaders } from '../blockHeaderUtilities'
import { BulkFileDataManager } from '../BulkFileDataManager'
import { BulkHeaderFileInfo } from '../BulkHeaderFile'
import { ChaintracksFs } from '../ChaintracksFs'
import { LocalCdnServer } from '../../__tests/LocalCdnServer'
import { Chain } from '../../../../../sdk/types'
import { BlockHeader } from '../../../../../sdk/WalletServices.interfaces'

const runSlowTests = false

describe('BulkFileDataManager tests', () => {
  jest.setTimeout(99999999)

  const chain: Chain = 'main'
  const fs = ChaintracksFs
  const rootFolder = './src/services/chaintracker/chaintracks/__tests/data'
  let headers300_399: BlockHeader[] = []
  let headers400_499: BlockHeader[] = []
  let server349: LocalCdnServer | undefined
  let server379: LocalCdnServer | undefined
  let server399: LocalCdnServer | undefined
  let server402: LocalCdnServer | undefined
  let server499: LocalCdnServer | undefined

  beforeAll(async () => {
    const data300_399 = await ChaintracksFs.readFile(fs.pathJoin(rootFolder, 'cdnTest499/mainNet_3.headers'))
    const data400_499 = await ChaintracksFs.readFile(fs.pathJoin(rootFolder, 'cdnTest499/mainNet_4.headers'))
    headers300_399 = deserializeBlockHeaders(300, data300_399)
    headers400_499 = deserializeBlockHeaders(400, data400_499)

    // Start the local CDN servers
    server349 = new LocalCdnServer(8349, fs.pathJoin(rootFolder, 'cdnTest349'))
    await server349.start()
    server379 = new LocalCdnServer(8379, fs.pathJoin(rootFolder, 'cdnTest379'))
    await server379.start()
    server399 = new LocalCdnServer(8399, fs.pathJoin(rootFolder, 'cdnTest399'))
    await server399.start()
    server402 = new LocalCdnServer(8402, fs.pathJoin(rootFolder, 'cdnTest402'))
    await server402.start()
    server499 = new LocalCdnServer(8499, fs.pathJoin(rootFolder, 'cdnTest499'))
    await server499.start()
  })

  afterAll(async () => {
    if (server349) {
      await server349.stop()
    }
    if (server379) {
      await server379.stop()
    }
    if (server399) {
      await server399.stop()
    }
    if (server402) {
      await server402.stop()
    }
    if (server499) {
      await server499.stop()
    }
  })

  async function test0Body(manager: BulkFileDataManager) {
    // Verify the default options and minimum expected files from default CDN
    expect(manager.chain).toBe(chain)
    expect(manager.maxPerFile).toBe(100000)
    expect(manager.maxRetained).toBe(2)
    expect(manager.fromKnownSourceUrl).toBe('https://cdn.projectbabbage.com/blockheaders')
    const files = await manager.getBulkFiles()
    expect(files.length).toBeGreaterThan(7)
    const range = await manager.getHeightRange()
    expect(range.minHeight).toBe(0)
    expect(range.maxHeight).toBeGreaterThan(800000)
  }

  test('0 default options CDN files', async () => {
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)

    await test0Body(manager)
  })

  test('0a default options CDN files noDropAll', async () => {
    if (!runSlowTests) return
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)
    const storage = await setupStorageKnex(manager, `BulkFileDataManager.test_0a`, false)

    await test0Body(manager)

    await storage.destroy()
  })

  test('0b default options CDN files dropAll', async () => {
    if (!runSlowTests) return
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)
    const storage = await setupStorageKnex(manager, `BulkFileDataManager.test_0b`, true)

    await test0Body(manager)

    await storage.destroy()
  })

  async function test1Body(manager: BulkFileDataManager, minCount: number) {
    // Verify header retrieval from different heights and data caching
    expect(countDatas(manager)).toBe(minCount)
    let h0 = await manager.findHeaderForHeightOrUndefined(0)
    expect(h0?.hash).toBe('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
    expect(countDatas(manager)).toBe(minCount === 0 ? 1 : minCount)
    const h101010 = await manager.findHeaderForHeightOrUndefined(101010)
    expect(h101010?.hash).toBe('000000000001af33247fff33aae7c31baee4148d5a189e7353bf13bcee618202')
    expect(countDatas(manager)).toBe(2)

    h0 = await manager.findHeaderForHeightOrUndefined(0)
    expect(h0?.hash).toBe('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
    expect(countDatas(manager)).toBe(2)

    const h202020 = await manager.findHeaderForHeightOrUndefined(202020)
    expect(h202020?.hash).toBe('00000000000003a40858736f3788edcbca3aa89ac5723a8c6b42f0227084f949')
    expect(countDatas(manager)).toBe(2)
    const h303030 = await manager.findHeaderForHeightOrUndefined(303030)
    expect(h303030?.hash).toBe('00000000000000002f66589be500afbf212eabf7b10e12fe4639684df808c83b')
    expect(countDatas(manager)).toBe(2)

    h0 = await manager.findHeaderForHeightOrUndefined(0)
    expect(h0?.hash).toBe('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
    expect(countDatas(manager)).toBe(2)

    const h808080 = await manager.findHeaderForHeightOrUndefined(808080)
    expect(h808080?.hash).toBe('00000000000000000a7287950fae52dac3098ba43011fd1e1315974a419b0110')
    expect(countDatas(manager)).toBe(2)

    // Verify a height request that is out of range returns undefined and does not affect cached data
    const h909090 = await manager.findHeaderForHeightOrUndefined(909090)
    expect(h909090?.hash).toBeUndefined()
    expect(countDatas(manager)).toBe(2)

    // Verify retrieval from cached data.
    h0 = await manager.findHeaderForHeightOrUndefined(0)
    expect(h0?.hash).toBe('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
  }

  test('1 headers from heights maxRetained 2', async () => {
    if (!runSlowTests) return
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)

    await test1Body(manager, 0)
  })

  test('1a headers from heights maxRetained 2', async () => {
    if (!runSlowTests) return
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)
    const storage = await setupStorageKnex(manager, `BulkFileDataManager.test_1a`, true)

    await test1Body(manager, 2)

    await storage.destroy()
  })

  test('2 ReValidate', async () => {
    if (!runSlowTests) return
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)

    // Verify full data re-validation
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(2)
  })

  test('3 exportHeadersToFs', async () => {
    if (!runSlowTests) return
    const options = BulkFileDataManager.createDefaultOptions(chain)
    const manager = new BulkFileDataManager(options)

    for (const i of [349, 379, 399, 402, 499]) {
      const folder = fs.pathJoin(rootFolder, `cdnTest${i}`)
      await manager.exportHeadersToFs(ChaintracksFs, 100, folder, `http://localhost:8${i}/blockheaders`, i)
    }
  })

  async function test4Body(manager: BulkFileDataManager, maxCount: number) {
    expect(countDatas(manager)).toBe(2)
    const range = await manager.getHeightRange()
    expect(range.maxHeight).toBe(349)

    await manager.mergeIncrementalBlockHeaders(headers300_399.slice(50))
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(maxCount)
    await manager.mergeIncrementalBlockHeaders(headers400_499)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(maxCount)

    await updateFromLocalServer(manager, server379!)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(maxCount)
    await updateFromLocalServer(manager, server399!)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(maxCount)
    await updateFromLocalServer(manager, server402!)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(maxCount)
    await updateFromLocalServer(manager, server499!)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(2)
  }

  test('4 add two incremental chunks overwrite by CDN', async () => {
    const manager = await setupManagerOnLocalServer(server349!)

    await test4Body(manager, 3)
  })

  test('4a add two incremental chunks overwrite by CDN', async () => {
    const manager = await setupManagerOnLocalServer(server349!)
    const storage = await setupStorageKnex(manager, `BulkFileDataManager.test_4a`, true)

    await test4Body(manager, 2)

    await storage.destroy()
  })

  async function test5Body(manager: BulkFileDataManager, maxCount: number) {
    expect(countDatas(manager)).toBe(2)
    await updateFromLocalServer(manager, server379!)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(2)

    await manager.mergeIncrementalBlockHeaders(headers300_399.slice(50))
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(maxCount)

    await updateFromLocalServer(manager, server499!)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(2)

    await manager.mergeIncrementalBlockHeaders(headers400_499)
    await manager.ReValidate()
    expect(countDatas(manager)).toBe(2)
  }

  test('5 add CDN incremental CDN incremental', async () => {
    const manager = await setupManagerOnLocalServer(server349!)

    await test5Body(manager, 3)
  })

  test('5a add CDN incremental CDN incremental', async () => {
    const manager = await setupManagerOnLocalServer(server349!)
    const storage = await setupStorageKnex(manager, `BulkFileDataManager.test_5a`, true)

    await test5Body(manager, 2)

    await storage.destroy()
  })

  async function setupStorageKnex(
    manager: BulkFileDataManager,
    filename: string,
    deleteSqliteFile: boolean
  ): Promise<ChaintracksStorageKnex> {
    const path = fs.pathJoin(rootFolder, `${filename}.sqlite`)
    const localSqlite: Knex.Config = {
      client: 'sqlite3',
      connection: { filename: path },
      useNullAsDefault: true
    }
    if (deleteSqliteFile) {
      const fs = ChaintracksFs
      try {
        await fs.delete(path)
      } catch {}
    }
    const knexOptions = ChaintracksStorageKnex.createStorageKnexOptions(chain, makeKnex(localSqlite))
    knexOptions.bulkFileDataManager = manager
    const storage = new ChaintracksStorageKnex(knexOptions)
    await storage.makeAvailable()

    return storage
  }

  async function setupManagerOnLocalServer(server: LocalCdnServer) {
    const options = BulkFileDataManager.createDefaultOptions(chain)
    options.fromKnownSourceUrl = undefined
    const manager = new BulkFileDataManager(options)
    await updateFromLocalServer(manager, server)
    return manager
  }
})

async function updateFromLocalServer(manager: BulkFileDataManager, server: LocalCdnServer) {
  await manager.updateFromUrl(`http://localhost:${server.port}/blockheaders`)
}

function countDatas(manager: BulkFileDataManager): number {
  let count = 0
  for (const file of manager['bfds'] as BulkHeaderFileInfo[]) {
    if (file.data) count += 1
  }
  return count
}
