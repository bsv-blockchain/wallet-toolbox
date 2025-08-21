import { Chain } from "../../../../sdk/types"
import { asUint8Array } from "../../../../utility/utilityHelpers.noBuffer"
import { BaseBlockHeader, BlockHeader } from "../Api/BlockHeaderApi"
import { ChaintracksStorageApi } from "../Api/ChaintracksStorageApi"
import { ChaintracksService } from "../ChaintracksService"
import { ChaintracksServiceClient } from "../ChaintracksServiceClient"
import { blockHash, deserializeBaseBlockHeaders } from "../util/blockHeaderUtilities"

type ClientClass = "ChaintracksSingletonClient" | "Chaintracks" | "ChaintracksServiceClient" | undefined
let clientClass: ClientClass = undefined

clientClass = "Chaintracks"
//clientClass = "ChaintracksSingletonClient"
//clientClass = "ChaintracksServiceClient"

describe(`ChaintracksServiceClient tests`, () => {
  jest.setTimeout(999999999)

  const chain: Chain = "main"
  let service: ChaintracksService
  let storage: ChaintracksStorageApi
  let client: ChaintracksServiceClient
  let firstTip: BlockHeader

  beforeAll(async () => {
    service = new ChaintracksService(ChaintracksService.createChaintracksServiceOptions(chain))
    storage = service.chaintracks['storageEngine'] as ChaintracksStorageApi
    await service.startJsonRpcServer()
    const ft = await service.chaintracks.findChainTipHeader()
    if (!ft) throw new Error("No chain tip found");
    firstTip = ft
    client = new ChaintracksServiceClient(chain, `http://localhost:${service.port}`, {})
  })

  afterAll(async () => {
    await service?.stopJsonRpcServer()
  })

  test("getChain", async () => {
    const gotChain = await client.getChain()
    expect(gotChain).toBe(chain)
  })

  test("getHeaders", async () => {
    const liveHeightRange = await storage.getLiveHeightRange()
    const h0 = liveHeightRange?.minHeight || 10
    const h1 = liveHeightRange?.maxHeight || 10
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
  })
})
  
  /*
      let presentHeight: number | undefined
      let tipHeader: BlockHeader | undefined
      let tipHeaderHex: BlockHeaderHex | undefined
  
      test("getPresentHeight", async () => {
          presentHeight = await client.getPresentHeight()
          expect(presentHeight > 750000).toBe(true)
      })
  
      test("findChainTipHeader", async () => {
          tipHeader = await client.findChainTipHeader()
          expect(isBlockHeader(tipHeader)).toBe(true)
          expect(tipHeader.height > 750000).toBe(true)
          expect(tipHeader.height >= firstTip.height).toBe(true)
      })
  
      test("findChainTipHeaderHex", async () => {
          tipHeaderHex = await client.findChainTipHeaderHex()
          expect(tipHeaderHex.height > 750000).toBe(true)
          expect(tipHeaderHex.height >= firstTip.height).toBe(true)
      })
  
      test("findChainTipHash", async () => {
          const hash = await client.findChainTipHash()
          expect(Buffer.isBuffer(hash) && hash.length === 32).toBe(true)
      })
  
      test("findChainTipHashHex", async () => {
          const hash = await client.findChainTipHashHex()
          expect(typeof hash === "string" && hash.length === 2 * 32).toBe(true)
      })
  
      test("findHeaderForHeight", async () => {
          const header0 = await client.findHeaderForHeight(0)
          expect(header0 !== undefined && isBlockHeader(header0)).toBe(true)
          if (header0) {
              expect(genesisBuffer(chain).equals(serializeBlockHeader(header0))).toBe(true)
          }
  
          const header = await client.findHeaderForHeight(firstTip.height)
          expect(header && header.height === firstTip.height).toBe(true)
  
          const missing = await client.findHeaderForHeight(1000 + firstTip.height)
          expect(missing === undefined).toBe(true)
      }, 100000)
  
      test("findHeaderHexForHeight", async () => {
          const header0 = await client.findHeaderHexForHeight(0)
          expect(header0 !== undefined && isBlockHeaderHex(header0)).toBe(true)
          if (header0) {
              expect(genesisBuffer(chain).equals(serializeBlockHeader(toBlockHeader(header0)))).toBe(true)
          }
          const header = await client.findHeaderHexForHeight(firstTip.height)
          expect(header && header.height === firstTip.height).toBe(true)
  
          const missing = await client.findHeaderHexForHeight(1000 + firstTip.height)
          expect(missing === undefined).toBe(true)
      })
  
      test("findHeaderForBlockHash", async () => {
          const header0 = await client.findHeaderForBlockHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
          expect(header0 !== undefined && isBlockHeader(header0)).toBe(true)
          if (header0) {
              expect(genesisBuffer(chain).equals(serializeBlockHeader(header0))).toBe(true)
          }
          const header = await client.findHeaderForBlockHash(firstTip.hash)
          expect(header && header.height === firstTip.height).toBe(true)
  
          const missing = await client.findHeaderForBlockHash('0000000002000010000002000001000000020000000010000020000000000000')
          expect(missing === undefined).toBe(true)
      })
  
      test("findHeaderHexForBlockHash", async () => {
          const header0 = await client.findHeaderHexForBlockHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
          expect(header0 !== undefined && isBlockHeaderHex(header0)).toBe(true)
          if (header0) {
              expect(genesisBuffer(chain).equals(serializeBlockHeader(toBlockHeader(header0)))).toBe(true)
          }
          const header = await client.findHeaderHexForBlockHash(firstTip.hash)
          expect(header && header.height === firstTip.height).toBe(true)
  
          const missing = await client.findHeaderHexForBlockHash('0000000002000010000002000001000000020000000010000020000000000000')
          expect(missing === undefined).toBe(true)
      })
  
      test("findHeaderForMerkleRoot", async () => {
          const header0 = await client.findHeaderForMerkleRoot('4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b')
          expect(header0 !== undefined && isBlockHeader(header0)).toBe(true)
          if (header0) {
              expect(genesisBuffer(chain).equals(serializeBlockHeader(header0))).toBe(true)
          }
          const header = await client.findHeaderForMerkleRoot(firstTip.merkleRoot)
          expect(header && header.height === firstTip.height).toBe(true)
  
          const missing = await client.findHeaderForMerkleRoot('0000000002000010000002000001000000020000000010000020000000000000')
          expect(missing === undefined).toBe(true)
      })
  
      test("findHeaderHexForMerkleRoot", async () => {
          const header0 = await client.findHeaderHexForMerkleRoot('4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b')
          expect(header0 !== undefined && isBlockHeaderHex(header0)).toBe(true)
          if (header0) {
              expect(genesisBuffer(chain).equals(serializeBlockHeader(toBlockHeader(header0)))).toBe(true)
          }
          const header = await client.findHeaderHexForMerkleRoot(firstTip.merkleRoot)
          expect(header && header.height === firstTip.height).toBe(true)
  
          const missing = await client.findHeaderHexForMerkleRoot('0000000002000010000002000001000000020000000010000020000000000000')
          expect(missing === undefined).toBe(true)
      })
  
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