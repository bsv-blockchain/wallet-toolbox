import { Chain } from '../../../../sdk'
import { BulkBlockHeaders } from '../Storage/BulkBlockHeaders'

describe('BulkBlockHeaders tests', () => {
  jest.setTimeout(99999999)

  test('0 mainNet no preload', async () => {
    const options = BulkBlockHeaders.createDefaultOptions('main')
    const bulkBlockHeaders = new BulkBlockHeaders(options)
    const header = await bulkBlockHeaders.findHeaderForHeight(800000)
    expect(header!.height).toBe(800000)
  })

  test('1 testNet no preload', async () => {
    const options = BulkBlockHeaders.createDefaultOptions('test')
    const bulkBlockHeaders = new BulkBlockHeaders(options)
    const header = await bulkBlockHeaders.findHeaderForHeight(800000)
    expect(header!.height).toBe(800000)
  })

  test('2 mainNet preload 800000', async () => {
    const options = BulkBlockHeaders.createDefaultOptions('main')
    options.preLoadFromHeight = 800000
    const bulkBlockHeaders = new BulkBlockHeaders(options)
    const header = await bulkBlockHeaders.findHeaderForHeight(800000)
    expect(header!.height).toBe(800000)
  })

  test('3 testNet preload 1600000', async () => {
    const options = BulkBlockHeaders.createDefaultOptions('test')
    options.preLoadFromHeight = 1600000
    const bulkBlockHeaders = new BulkBlockHeaders(options)
    const header = await bulkBlockHeaders.findHeaderForHeight(1600000)
    expect(header!.height).toBe(1600000)
  })

  test('4 mainNet preload 0 validate', async () => {
    const options = BulkBlockHeaders.createDefaultOptions('main')
    options.preLoadFromHeight = 0
    options.verifyBlockHash = true
    options.verifyChainWork = true
    const bulkBlockHeaders = new BulkBlockHeaders(options)
    const header = await bulkBlockHeaders.findHeaderForHeight(800000)
    expect(header!.height).toBe(800000)
  })

  test('5 testNet preload 0', async () => {
    const options = BulkBlockHeaders.createDefaultOptions('test')
    options.preLoadFromHeight = 0
    const bulkBlockHeaders = new BulkBlockHeaders(options)
    const header = await bulkBlockHeaders.findHeaderForHeight(1600000)
    expect(header!.height).toBe(1600000)
  })
})
