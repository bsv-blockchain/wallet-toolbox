import { Chain } from '../../../../sdk/types'
import { BaseBlockHeader, BlockHeader } from '../../../../sdk/WalletServices.interfaces'
import { asUint8Array } from '../../../../utility/utilityHelpers.noBuffer'
import { ChaintracksClientApi } from '../Api/ChaintracksClientApi'
import { ChaintracksStorageApi } from '../Api/ChaintracksStorageApi'
import { Chaintracks } from '../Chaintracks'
import { ChaintracksService } from '../ChaintracksService'
import { ChaintracksServiceClient } from '../ChaintracksServiceClient'
import {
  blockHash,
  deserializeBaseBlockHeaders,
  genesisBuffer,
  serializeBaseBlockHeader
} from '../util/blockHeaderUtilities'

type ClientClass = 'ChaintracksSingletonClient' | 'Chaintracks' | 'ChaintracksServiceClient' | undefined
let clientClass: ClientClass = undefined

clientClass = 'Chaintracks'
//clientClass = "ChaintracksSingletonClient"
//clientClass = "ChaintracksServiceClient"
const includeLocalServiceClient = true
const includeLocalServiceChaintracks = true
const includeNpmRegistryClient = true
const includeGcrTestClient = true

describe(`ChaintracksClientApi tests`, () => {
  jest.setTimeout(999999999)

  const chain: Chain = 'main'

  const clients: { client: ChaintracksClientApi, chain: Chain }[] = []

  let localService: ChaintracksService
  let localServiceStorage: ChaintracksStorageApi
  let localServiceClient: ChaintracksClientApi
  let firstTip: BlockHeader

  beforeAll(async () => {
    if (includeLocalServiceChaintracks || includeLocalServiceClient) {
      localService = new ChaintracksService(ChaintracksService.createChaintracksServiceOptions(chain))
      localServiceStorage = localService.chaintracks['storageEngine'] as ChaintracksStorageApi
      await localService.startJsonRpcServer()

      if (includeLocalServiceClient) {
        localServiceClient = new ChaintracksServiceClient(chain, `http://localhost:${localService.port}`, {})
        clients.push({ client: localServiceClient, chain })
      }

      if (includeLocalServiceChaintracks) {
        clients.push({ client: localService.chaintracks, chain })
      }
    }

    if (includeGcrTestClient) {
      const gcr = new ChaintracksServiceClient('test', `https://staging-chaintracks-921101068003.us-west1.run.app`, {})
      clients.push({ client: gcr, chain: 'test' })
    }

    if (includeNpmRegistryClient) {
      clients.push({ client: makeNpmRegistryClient(chain), chain })
    }

    const ft = await clients[0].client.findChainTipHeader()
    if (!ft) throw new Error('No chain tip found')
    firstTip = ft
  })

  afterAll(async () => {
    await localService?.stopJsonRpcServer()
  })

  test('0 getChain', async () => {
    for (const {client, chain } of clients) {
      const gotChain = await client.getChain()
      expect(gotChain).toBe(chain)
    }
  })

  test('1 getInfo', async () => {
    for (const { client, chain } of clients) {
      const gotInfo = await client.getInfo()
      expect(gotInfo.chain).toBe(chain)
      expect(gotInfo.heightBulk).toBeGreaterThan(700000)
      expect(gotInfo.heightLive).toBeGreaterThanOrEqual(firstTip.height)
    }
  })

  test('2 getPresentHeight', async () => {
    for (const { client, chain } of clients) {
      const presentHeight = await client.getPresentHeight()
      expect(presentHeight).toBeGreaterThanOrEqual(firstTip.height)
    }
  })

  test('3 getHeaders', async () => {
    for (const { client, chain } of clients) {
      const info = await client.getInfo()
      const h0 = info.heightBulk + 1
      const h1 = info.heightLive || 10
      const bulkHeaders = await getHeaders(h0 - 2, 2)
      expect(bulkHeaders.length).toBe(2)
      expect(bulkHeaders[1].previousHash === blockHash(bulkHeaders[0])).toBe(true)
      const bothHeaders = await getHeaders(h0 - 1, 2)
      expect(bothHeaders.length).toBe(2)
      expect(bothHeaders[1].previousHash === blockHash(bothHeaders[0])).toBe(true)
      const liveHeaders = await getHeaders(h0 - 0, 2)
      expect(liveHeaders.length).toBe(2)
      expect(liveHeaders[1].previousHash === blockHash(liveHeaders[0])).toBe(true)
      const partHeaders = await getHeaders(h1, 2)
      expect(partHeaders.length).toBe(1)

      async function getHeaders(h: number, c: number): Promise<BaseBlockHeader[]> {
        const data = asUint8Array(await client.getHeaders(h, c))
        const headers = deserializeBaseBlockHeaders(data)
        return headers
      }
    }
  })

  test('4 findChainTipHeader', async () => {
    for (const { client, chain } of clients) {
      const tipHeader = await client.findChainTipHeader()
      expect(tipHeader.height >= firstTip.height).toBe(true)
    }
  })

  test('5 findChainTipHash', async () => {
    for (const { client, chain } of clients) {
      const hash = await client.findChainTipHash()
      expect(hash.length === 64).toBe(true)
    }
  })

  test('6 findHeaderForHeight', async () => {
    for (const { client, chain } of clients) {
      const header0 = await client.findHeaderForHeight(0)
      expect(header0 !== undefined).toBe(true)
      if (header0) {
        expect(genesisBuffer(chain)).toEqual(serializeBaseBlockHeader(header0))
      }

      const header = await client.findHeaderForHeight(firstTip.height)
      expect(header && header.height === firstTip.height).toBe(true)

      const missing = await client.findHeaderForHeight(99999999)
      expect(missing === undefined).toBe(true)
    }
  })

  test('7 addHeader', async () => {
    for (const { client, chain } of clients) {
      const t = await client.findChainTipHeader()
      const h: BaseBlockHeader = {
        version: t.version,
        previousHash: t.previousHash,
        merkleRoot: t.merkleRoot,
        time: t.time,
        bits: t.bits,
        nonce: t.nonce
      }
      await client.addHeader(h)
    }
  })

  /*
  const headers: BlockHeader[] = []
  const headerListener: HeaderListener = (header) => { headers.push(header) }

  test("subscribeHeaders", async () => {
      const id = await client.subscribeHeaders(headerListener)
      expect(typeof id === 'string').toBe(true)
      expect(await client.unsubscribe(id)).toBe(true)
  })

  const reorgs: ({ depth: number, oldTip: BlockHeader, newTip: BlockHeader })[] = []
  const reorgListener: ReorgListener = (depth, oldTip, newTip) => { reorgs.push({ depth, oldTip, newTip }) }

  test("subscribeReorgs", async () => {
      const id = await client.subscribeReorgs(reorgListener)
      expect(typeof id === 'string').toBe(true)
      expect(await client.unsubscribe(id)).toBe(true)
  })
  */
})

function makeNpmRegistryClient(chain: Chain) {
  return new ChaintracksServiceClient(chain, `https://npm-registry.babbage.systems:${chain === 'main' ? 8084 : 8083}`)
}
