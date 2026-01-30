import * as bsv from '@bsv/sdk'
import { createSyncMap, sdk, sha256Hash, SyncMap } from '../../../../../src'
import { TestUtilsWalletStorage as _tu, TestWalletNoSetup } from '../../../../../test/utils/TestUtilsWalletStorage'
import { EntityProvenTx } from '../EntityProvenTx'

describe('ProvenTx class method tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('test')
  const ctxs: TestWalletNoSetup[] = []
  const ctxs2: TestWalletNoSetup[] = []

  beforeAll(async () => {
    if (env.runMySQL) {
      ctxs.push(await _tu.createLegacyWalletMySQLCopy('ProvenTxTests'))
      ctxs2.push(await _tu.createLegacyWalletMySQLCopy('ProvenTxTests2'))
    }
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy('ProvenTxTests'))
    ctxs2.push(await _tu.createLegacyWalletSQLiteCopy('ProvenTxTests2'))
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
    for (const ctx of ctxs2) {
      await ctx.storage.destroy()
    }
  })

  test('0_fromTxid: valid txid with rawTx and Merkle proof (real database)', async () => {
    const ctx = ctxs[0]
    const txid = '2795b293c698b2244147aaba745db887a632d21990c474df46d842ec3e52f122' // Using a valid txid from the table

    // Fetch the rawTx and Merkle proof data directly from the database
    const provenTxRecord = await ctx.activeStorage.findProvenTxs({
      partial: { txid }
    })
    expect(provenTxRecord.length).toBeGreaterThan(0) // Ensure the record exists in the database

    const rawTx = provenTxRecord[0]?.rawTx
    const height = provenTxRecord[0]?.height
    const blockHash = provenTxRecord[0]?.blockHash
    const merkleRoot = provenTxRecord[0]?.merkleRoot
    const merklePathBinary = provenTxRecord[0]?.merklePath || []

    const services: sdk.WalletServices = {
      chain: 'test',

      hashOutputScript: (script: string): string => {
        const hash = bsv.Utils.toHex(sha256Hash(bsv.Utils.toArray(script, 'hex')))
        return hash
      },

      getRawTx: async (requestedTxid: string) => {
        if (requestedTxid === txid) {
          return { txid: requestedTxid, rawTx }
        }
        throw new Error('Unexpected txid')
      },

      getMerklePath: async (requestedTxid: string) => {
        if (requestedTxid === txid) {
          return {
            merklePath: {
              path: [[{ hash: txid, offset: 0 }]],
              blockHeight: height,
              toBinary: () => merklePathBinary,
              computeRoot: () => merkleRoot,
              verifyProof: () => true,
              toHex: () => Buffer.from(merklePathBinary).toString('hex'),
              indexOf: () => 0,
              findOrComputeLeaf: () => ({ hash: txid, offset: 0 }),
              verify: () => true,
              combine: () => ({}) as bsv.MerklePath,
              trim: () => ({}) as bsv.MerklePath
            } as unknown as bsv.MerklePath,
            header: {
              version: 1,
              previousHash: 'prev-hash',
              merkleRoot: merkleRoot,
              time: 1610000000,
              bits: 123456,
              nonce: 78910,
              height: height,
              hash: blockHash
            },
            name: 'mock-service'
          }
        }
        throw new Error('Unexpected txid')
      },

      getChainTracker: () =>
        Promise.resolve({
          isValidRootForHeight: async (root: string, height: number) => true,
          currentHeight: async () => height
        }),

      getHeaderForHeight: async () => Promise.resolve([1, 2, 3, 4]),
      getHeight: async () => height,
      getBsvExchangeRate: async () => 0,
      getFiatExchangeRate: async () => 1,
      postBeef: async () => [],

      getStatusForTxids: async () => ({
        name: 'mock-service',
        status: 'success',
        results: []
      }),

      isUtxo: async () => true,

      getUtxoStatus: async () => ({
        name: 'mock-service',
        status: 'success',
        isUtxo: true,
        details: []
      }),

      getScriptHashHistory: async () => ({
        name: 'mock-service',
        status: 'success',
        history: []
      }),

      hashToHeader: async () => ({
        version: 1,
        previousHash: 'prev-hash',
        merkleRoot: merkleRoot,
        time: 1610000000,
        bits: 123456,
        nonce: 78910,
        height: height,
        hash: blockHash
      }),
      nLockTimeIsFinal: async () => true,

      getBeefForTxid: async () => new bsv.Beef(),

      getServicesCallHistory: () => ({
        version: 1,
        getMerklePath: { serviceName: '', historyByProvider: {} },
        getRawTx: { serviceName: '', historyByProvider: {} },
        postBeef: { serviceName: '', historyByProvider: {} },
        getStatusForTxids: { serviceName: '', historyByProvider: {} },
        getUtxoStatus: { serviceName: '', historyByProvider: {} },
        getScriptHashHistory: { serviceName: '', historyByProvider: {} },
        updateFiatExchangeRates: { serviceName: '', historyByProvider: {} }
      })
    }

    // Call the method under test
    const result = await EntityProvenTx.fromTxid(txid, services)

    // Validate the ProvenTx result
    expect(result.proven).toBeDefined()
    expect(result.proven!.txid).toBe(txid)

    // Validate Merkle proof details
    expect(result.proven!.height).toBe(height)
    expect(Buffer.from(result.proven!.merklePath).toString('hex')).toEqual(
      Buffer.from(merklePathBinary).toString('hex')
    )
    expect(result.proven!.blockHash).toBe(blockHash)
    expect(result.proven!.merkleRoot).toBe(merkleRoot)
    expect(result.rawTx).toEqual(rawTx)
  })

  test('1_fromTxid: txid with no rawTx available', async () => {
    if (_tu.noEnv('test')) return
    const ctx = ctxs[0]
    const txid = 'missing-txid'

    const services: sdk.WalletServices = ctx.services

    // Call the method under test
    const result = await EntityProvenTx.fromTxid(txid, services)

    // Validate that ProvenTx could not be created
    expect(result.proven).toBeUndefined()
    expect(result.rawTx).toBeUndefined()
  })

  test('2_fromTxid: txid with no Merkle proof available', async () => {
    if (_tu.noEnv('test')) return
    const ctx = ctxs[0]
    const txid = 'no-merkle-proof-txid'
    const services: sdk.WalletServices = ctx.services

    // Verify the rawTx and Merkle proof
    const rawTx = await services.getRawTx(txid)
    const merkleProof = await services.getMerklePath(txid)

    // Call the method under test
    const result = await EntityProvenTx.fromTxid(txid, services)

    // Validate the ProvenTx result
    expect(result.proven).toBeUndefined()
    expect(result.rawTx).toEqual(rawTx.rawTx)
  })

  test('3_ProvenTx getters and setters', () => {
    // Mock data to initialize the ProvenTx entity
    const mockData = {
      provenTxId: 1,
      created_at: new Date('2025-01-01T00:00:00Z'),
      updated_at: new Date('2025-01-02T00:00:00Z'),
      txid: '2795b293c698b2244147aaba745db887a632d21990c474df46d842ec3e52f122',
      height: 123,
      index: 0,
      merklePath: [0x04, 0x05, 0x06],
      rawTx: [0x01, 0x02, 0x03],
      blockHash: 'mock-block-hash',
      merkleRoot: 'mock-merkle-root'
    }

    // Initialize the ProvenTx entity with mock data
    const provenTx = new EntityProvenTx(mockData)

    // Validate getters
    expect(provenTx.provenTxId).toBe(mockData.provenTxId)
    expect(provenTx.created_at).toEqual(mockData.created_at)
    expect(provenTx.updated_at).toEqual(mockData.updated_at)
    expect(provenTx.txid).toBe(mockData.txid)
    expect(provenTx.height).toBe(mockData.height)
    expect(provenTx.index).toBe(mockData.index)
    expect(provenTx.merklePath).toEqual(mockData.merklePath)
    expect(provenTx.rawTx).toEqual(mockData.rawTx)
    expect(provenTx.blockHash).toBe(mockData.blockHash)
    expect(provenTx.merkleRoot).toBe(mockData.merkleRoot)

    // Validate setters
    provenTx.provenTxId = 2
    provenTx.created_at = new Date('2025-02-01T00:00:00Z')
    provenTx.updated_at = new Date('2025-02-02T00:00:00Z')
    provenTx.txid = 'a3b2f0935c7b5bb7a841a09e535c13be86f4df0e7a91cebdc33812bfcc0eb9d7'
    provenTx.height = 456
    provenTx.index = 1
    provenTx.merklePath = [0x07, 0x08, 0x09]
    provenTx.rawTx = [0x0a, 0x0b, 0x0c]
    provenTx.blockHash = 'new-block-hash'
    provenTx.merkleRoot = 'new-merkle-root'

    // Validate updated values
    expect(provenTx.provenTxId).toBe(2)
    expect(provenTx.created_at).toEqual(new Date('2025-02-01T00:00:00Z'))
    expect(provenTx.updated_at).toEqual(new Date('2025-02-02T00:00:00Z'))
    expect(provenTx.txid).toBe('a3b2f0935c7b5bb7a841a09e535c13be86f4df0e7a91cebdc33812bfcc0eb9d7')
    expect(provenTx.height).toBe(456)
    expect(provenTx.index).toBe(1)
    expect(provenTx.merklePath).toEqual([0x07, 0x08, 0x09])
    expect(provenTx.rawTx).toEqual([0x0a, 0x0b, 0x0c])
    expect(provenTx.blockHash).toBe('new-block-hash')
    expect(provenTx.merkleRoot).toBe('new-merkle-root')

    // Validate overridden methods
    expect(provenTx.id).toBe(2)
    expect(provenTx.entityName).toBe('provenTx')
    expect(provenTx.entityTable).toBe('proven_txs')

    // Update id via overridden setter
    provenTx.id = 3
    expect(provenTx.provenTxId).toBe(3)
  })

  // Test: equals identifies matching ProvenTx entities
  test('4_equals: identifies matching ProvenTx entities', async () => {
    const ctx1 = ctxs[0]
    const ctx2 = ctxs2[0]

    // Insert a ProvenTx into the first database
    const provenTx1 = new EntityProvenTx({
      provenTxId: 401,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    await ctx1.activeStorage.insertProvenTx(provenTx1.toApi())

    // Insert a matching ProvenTx into the second database
    const provenTx2 = new EntityProvenTx({
      provenTxId: 401,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    await ctx2.activeStorage.insertProvenTx(provenTx2.toApi())

    const syncMap = createSyncMap()
    syncMap.provenTx.idMap = { [provenTx1.provenTxId]: provenTx2.provenTxId }

    // Verify the ProvenTx entities match
    expect(provenTx1.equals(provenTx2.toApi(), syncMap)).toBe(true)
  })

  // Test: equals identifies non-matching txid
  test('5_equals: identifies non-matching txid', async () => {
    const provenTx1 = new EntityProvenTx({
      provenTxId: 102,
      txid: 'txid1',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    const provenTx2 = new EntityProvenTx({
      provenTxId: 103,
      txid: 'txid2',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    expect(provenTx1.equals(provenTx2.toApi())).toBe(false)
  })

  // Test: equals identifies non-matching height
  test('6_equals: identifies non-matching height', async () => {
    const provenTx1 = new EntityProvenTx({
      provenTxId: 104,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    const provenTx2 = new EntityProvenTx({
      provenTxId: 105,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588741,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    expect(provenTx1.equals(provenTx2.toApi())).toBe(false)
  })

  // Test: equals identifies non-matching merklePath
  test('7_equals: identifies non-matching merklePath', async () => {
    const provenTx1 = new EntityProvenTx({
      provenTxId: 106,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    const provenTx2 = new EntityProvenTx({
      provenTxId: 107,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 4],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    expect(provenTx1.equals(provenTx2.toApi())).toBe(false)
  })

  // Test: equals identifies non-matching syncMap
  test('8_equals: identifies non-matching syncMap', async () => {
    const provenTx1 = new EntityProvenTx({
      provenTxId: 108,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    const provenTx2 = new EntityProvenTx({
      provenTxId: 109,
      txid: 'valid-txid',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 1588740,
      index: 0,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash',
      merkleRoot: 'merkle-root'
    })

    const syncMap = createSyncMap()
    syncMap.provenTx.idMap = { 108: 999 }

    expect(provenTx1.equals(provenTx2.toApi(), syncMap)).toBe(false)
  })

  test('9_equals: provenTxId mismatch without syncMap', async () => {
    const ctx1 = ctxs[0]
    const ctx2 = ctxs2[0]

    // Insert a ProvenTx record into the first database
    const tx1 = new EntityProvenTx({
      provenTxId: 405,
      txid: 'txid1',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 100,
      index: 1,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash-1',
      merkleRoot: 'merkle-root-1'
    })
    await ctx1.activeStorage.insertProvenTx(tx1.toApi())

    // Insert a different ProvenTx record into the second database with a mismatched provenTxId
    const tx2 = new EntityProvenTx({
      provenTxId: 406,
      txid: 'txid1',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 100,
      index: 1,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash-1',
      merkleRoot: 'merkle-root-1'
    })
    await ctx2.activeStorage.insertProvenTx(tx2.toApi())

    // Verify that `equals` returns false because provenTxId mismatch without a syncMap
    expect(tx1.equals(tx2.toApi())).toBe(false)
  })

  test('10_mergeExisting: always returns false', async () => {
    const ctx = ctxs[0]

    // Create a ProvenTx entity
    const provenTx = new EntityProvenTx({
      provenTxId: 101,
      txid: 'txid1',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      height: 100,
      index: 1,
      merklePath: [1, 2, 3],
      rawTx: [4, 5, 6],
      blockHash: 'block-hash-1',
      merkleRoot: 'merkle-root-1'
    })

    const mockSyncMap = createSyncMap()
    mockSyncMap.provenTx.idMap = { [provenTx.provenTxId]: provenTx.provenTxId }

    // Create mock storage, syncMap, and trx token
    const mockStorage = ctx.activeStorage
    const mockTrx: sdk.TrxToken = {}

    // Call the mergeExisting method
    const result = await provenTx.mergeExisting(mockStorage, new Date(), provenTx.toApi(), mockSyncMap, mockTrx)

    // Assert that it always returns false
    expect(result).toBe(false)
  })
})
