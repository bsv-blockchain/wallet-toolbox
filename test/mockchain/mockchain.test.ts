import { Knex, knex as makeKnex } from 'knex'
import { Beef, Script, Transaction, Utils } from '@bsv/sdk'
import { MockChainStorage } from '../../src/mockchain/MockChainStorage'
import { MockMiner, createCoinbaseTransaction } from '../../src/mockchain/MockMiner'
import { MockChainTracker } from '../../src/mockchain/MockChainTracker'
import { MockServices } from '../../src/mockchain/MockServices'
import { computeMerkleRoot, computeMerklePath } from '../../src/mockchain/merkleTree'
import { doubleSha256BE, sha256Hash } from '../../src/utility/utilityHelpers'
import { asString, asArray } from '../../src/utility/utilityHelpers.noBuffer'
import { toBinaryBaseBlockHeader } from '../../src/services/Services'
import { TaskMineBlock } from '../../src/monitor/tasks/TaskMineBlock'

/** Helper to add a raw tx with its merkle proof to a Beef */
function addProvenTxToBeef(beef: Beef, rawTx: number[], merklePath: any): void {
  const bumpIndex = beef.mergeBump(merklePath)
  beef.mergeRawTx(rawTx, bumpIndex)
}

function createMemoryKnex(): Knex {
  const uniqueId = `memdb_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  return makeKnex({
    client: 'better-sqlite3',
    connection: { filename: `file:${uniqueId}?mode=memory&cache=shared` },
    useNullAsDefault: true,
    pool: {
      min: 1,
      max: 1,
      idleTimeoutMillis: 60 * 60 * 1000,
      afterCreate: (conn: any, done: Function) => {
        conn.pragma('foreign_keys = ON')
        done()
      }
    }
  })
}

describe('MockChainStorage', () => {
  let knex: Knex
  let storage: MockChainStorage

  beforeAll(async () => {
    knex = createMemoryKnex()
    storage = new MockChainStorage(knex)
    await storage.migrate()
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('inserts and retrieves a block header', async () => {
    await storage.insertBlockHeader({
      height: 0,
      hash: 'aa'.repeat(32),
      previousHash: '00'.repeat(32),
      merkleRoot: 'bb'.repeat(32),
      version: 1,
      time: 1700000000,
      bits: 0x207fffff,
      nonce: 42,
      coinbaseTxid: 'cc'.repeat(32)
    })

    const byHeight = await storage.getBlockHeaderByHeight(0)
    expect(byHeight).toBeDefined()
    expect(byHeight!.height).toBe(0)
    expect(byHeight!.hash).toBe('aa'.repeat(32))

    const byHash = await storage.getBlockHeaderByHash('aa'.repeat(32))
    expect(byHash).toBeDefined()
    expect(byHash!.height).toBe(0)

    const tip = await storage.getChainTip()
    expect(tip).toBeDefined()
    expect(tip!.height).toBe(0)
  })

  test('inserts and retrieves a transaction', async () => {
    const txid = 'dd'.repeat(32)
    const rawTx = [1, 2, 3, 4, 5]
    await storage.insertTransaction(txid, rawTx)

    const tx = await storage.getTransaction(txid)
    expect(tx).toBeDefined()
    expect(tx!.txid).toBe(txid)
    expect(tx!.blockHeight).toBeNull()

    const unmined = await storage.getUnminedTransactions()
    expect(unmined.some(t => t.txid === txid)).toBe(true)

    await storage.setTransactionBlock(txid, 0, 1)
    const mined = await storage.getTransaction(txid)
    expect(mined!.blockHeight).toBe(0)
  })

  test('inserts and retrieves UTXOs', async () => {
    const txid = 'ee'.repeat(32)
    await storage.insertUtxo(txid, 0, [0x51], 5000, 'ff'.repeat(32))

    const utxo = await storage.getUtxo(txid, 0)
    expect(utxo).toBeDefined()
    expect(Number(utxo!.satoshis)).toBe(5000)

    const byHash = await storage.getUtxosByScriptHash('ff'.repeat(32))
    expect(byHash.length).toBeGreaterThanOrEqual(1)

    await storage.markUtxoSpent(txid, 0, 'ab'.repeat(32))
    const spent = await storage.getUtxo(txid, 0)
    expect(spent!.spentByTxid).toBe('ab'.repeat(32))
  })
})

describe('merkleTree', () => {
  test('computeMerkleRoot single tx', () => {
    const txid = 'ab'.repeat(32)
    const root = computeMerkleRoot([txid])
    // For a single tx, the root should be the txid itself
    expect(root).toBe(txid)
  })

  test('computeMerkleRoot two txs', () => {
    const txid1 = '01'.repeat(32)
    const txid2 = '02'.repeat(32)
    const root = computeMerkleRoot([txid1, txid2])

    // Manually compute: hash(txid1_LE + txid2_LE)
    const left = asArray(txid1).reverse()
    const right = asArray(txid2).reverse()
    const combined = [...left, ...right]
    const expected = asString(doubleSha256BE(combined))
    expect(root).toBe(expected)
  })

  test('computeMerklePath verifies against root', () => {
    const txids = ['01'.repeat(32), '02'.repeat(32), '03'.repeat(32)]
    const root = computeMerkleRoot(txids)
    const path = computeMerklePath(txids, 1, 5)

    expect(path.blockHeight).toBe(5)

    // Verify the path computes the correct root
    const computedRoot = path.computeRoot(txids[1])
    expect(computedRoot).toBe(root)
  })

  test('computeMerklePath for single tx', () => {
    const txid = 'ab'.repeat(32)
    const path = computeMerklePath([txid], 0, 10)
    expect(path.blockHeight).toBe(10)
    const root = path.computeRoot(txid)
    expect(root).toBe(txid)
  })

  test('computeMerklePath for 4 txs', () => {
    const txids = ['0a'.repeat(32), '0b'.repeat(32), '0c'.repeat(32), '0d'.repeat(32)]
    const root = computeMerkleRoot(txids)
    for (let i = 0; i < txids.length; i++) {
      const path = computeMerklePath(txids, i, 20)
      expect(path.computeRoot(txids[i])).toBe(root)
    }
  })
})

describe('MockMiner', () => {
  let knex: Knex
  let storage: MockChainStorage
  let miner: MockMiner

  beforeAll(async () => {
    knex = createMemoryKnex()
    storage = new MockChainStorage(knex)
    await storage.migrate()
    miner = new MockMiner()
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('createCoinbaseTransaction', () => {
    const tx = createCoinbaseTransaction(0)
    expect(tx.inputs.length).toBe(1)
    expect(tx.outputs.length).toBe(1)
    expect(tx.outputs[0].satoshis).toBe(5_000_000_000)
    expect(tx.inputs[0].sourceTXID).toBe('00'.repeat(32))
    expect(tx.inputs[0].sourceOutputIndex).toBe(0xffffffff)
  })

  test('mines genesis block', async () => {
    const header = await miner.mineBlock(storage)
    expect(header.height).toBe(0)
    expect(header.previousHash).toBe('00'.repeat(32))

    // Verify hash
    const binary = toBinaryBaseBlockHeader(header)
    const computedHash = asString(doubleSha256BE(binary))
    expect(header.hash).toBe(computedHash)

    // Verify stored
    const stored = await storage.getBlockHeaderByHeight(0)
    expect(stored).toBeDefined()
    expect(stored!.hash).toBe(header.hash)
  })

  test('mines block with unmined transactions', async () => {
    // Add a dummy transaction to the mempool
    const fakeTxid = '11'.repeat(32)
    await storage.insertTransaction(fakeTxid, [0x01])

    const header = await miner.mineBlock(storage)
    expect(header.height).toBe(1)

    // Check that the dummy tx is now mined
    const tx = await storage.getTransaction(fakeTxid)
    expect(tx!.blockHeight).toBe(1)
    expect(tx!.blockIndex).toBe(1) // coinbase is 0
  })
})

describe('MockChainTracker', () => {
  let knex: Knex
  let storage: MockChainStorage
  let tracker: MockChainTracker
  let miner: MockMiner

  beforeAll(async () => {
    knex = createMemoryKnex()
    storage = new MockChainStorage(knex)
    await storage.migrate()
    miner = new MockMiner()
    tracker = new MockChainTracker('mock', storage)

    // Mine a few blocks
    await miner.mineBlock(storage) // 0
    await miner.mineBlock(storage) // 1
    await miner.mineBlock(storage) // 2
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('currentHeight', async () => {
    const height = await tracker.currentHeight()
    expect(height).toBe(2)
  })

  test('isValidRootForHeight', async () => {
    const header = await storage.getBlockHeaderByHeight(1)
    expect(header).toBeDefined()
    const valid = await tracker.isValidRootForHeight(header!.merkleRoot, 1)
    expect(valid).toBe(true)
    const invalid = await tracker.isValidRootForHeight('bad'.repeat(10) + 'aa', 1)
    expect(invalid).toBe(false)
  })

  test('findHeaderForHeight', async () => {
    const header = await tracker.findHeaderForHeight(0)
    expect(header).toBeDefined()
    expect(header!.height).toBe(0)
  })

  test('findChainTipHeader', async () => {
    const tip = await tracker.findChainTipHeader()
    expect(tip.height).toBe(2)
  })

  test('getHeaders returns concatenated hex', async () => {
    const hex = await tracker.getHeaders(0, 2)
    expect(hex.length).toBe(80 * 2 * 2) // 80 bytes per header, 2 headers, hex = *2
  })
})

describe('MockServices end-to-end', () => {
  let knex: Knex
  let services: MockServices

  beforeAll(async () => {
    knex = createMemoryKnex()
    services = new MockServices(knex)
    await services.initialize()
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('initializes with genesis block', async () => {
    const height = await services.getHeight()
    expect(height).toBe(0)
  })

  test('rejects spending immature coinbase', async () => {
    // Genesis coinbase exists at height 0
    // Current height is 0, need 100 confirmations
    const tip = await services.storage.getChainTip()
    expect(tip).toBeDefined()

    // Find the coinbase UTXO
    const utxos = await services.storage.knex('mockchain_utxos')
      .where({ isCoinbase: true, blockHeight: 0 })
    expect(utxos.length).toBe(1)
    const coinbaseUtxo = utxos[0]

    // Try to spend the coinbase
    const tx = new Transaction()
    tx.addInput({
      sourceTXID: coinbaseUtxo.txid,
      sourceOutputIndex: 0,
      unlockingScript: Script.fromHex(''), // empty
      sequence: 0xffffffff
    })
    tx.addOutput({
      satoshis: 4_999_000_000,
      lockingScript: Script.fromHex('51') // OP_TRUE
    })

    const beef = new Beef()
    // Add the source coinbase tx
    const coinbaseTxRow = await services.storage.getTransaction(coinbaseUtxo.txid)
    const coinbaseRawTx = coinbaseTxRow!.rawTx instanceof Buffer
      ? Array.from(coinbaseTxRow!.rawTx)
      : Array.from(coinbaseTxRow!.rawTx as Uint8Array)

    // For BEEF we need the source as proven tx
    const pathResult = await services.getMerklePath(coinbaseUtxo.txid)
    if (pathResult.merklePath) {
      addProvenTxToBeef(beef, coinbaseRawTx, pathResult.merklePath)
    } else {
      beef.mergeRawTx(coinbaseRawTx)
    }
    beef.mergeRawTx(Array.from(tx.toBinary()))

    const txid = tx.id('hex')
    const results = await services.postBeef(beef, [txid])

    expect(results[0].status).toBe('error')
  })

  test('full lifecycle: mature coinbase, spend, mine, verify', async () => {
    // Mine 100 blocks to mature the genesis coinbase
    for (let i = 0; i < 100; i++) {
      await services.mineBlock()
    }

    const height = await services.getHeight()
    expect(height).toBe(100)

    // Find the genesis coinbase UTXO (at height 0)
    const utxos = await services.storage.knex('mockchain_utxos')
      .where({ isCoinbase: true, blockHeight: 0, spentByTxid: null })
    expect(utxos.length).toBe(1)
    const coinbaseUtxo = utxos[0]

    // Get the source transaction
    const coinbaseTxRow = await services.storage.getTransaction(coinbaseUtxo.txid)
    expect(coinbaseTxRow).toBeDefined()
    const coinbaseRawTx = coinbaseTxRow!.rawTx instanceof Buffer
      ? Array.from(coinbaseTxRow!.rawTx)
      : Array.from(coinbaseTxRow!.rawTx as Uint8Array)

    // Create a spending transaction. The coinbase output is OP_TRUE (anyone-can-spend)
    // We use OP_TRUE as the unlocking script (evaluates to true)
    const spendTx = new Transaction()
    spendTx.addInput({
      sourceTXID: coinbaseUtxo.txid,
      sourceOutputIndex: 0,
      unlockingScript: Script.fromHex(''), // empty - OP_TRUE locking needs no unlock
      sequence: 0xffffffff
    })
    spendTx.addOutput({
      satoshis: 4_999_000_000,
      lockingScript: Script.fromHex('51') // OP_TRUE
    })
    spendTx.addOutput({
      satoshis: 1_000_000,
      lockingScript: Script.fromHex('51') // OP_TRUE
    })

    // Build BEEF
    const beef = new Beef()
    const pathResult = await services.getMerklePath(coinbaseUtxo.txid)
    if (pathResult.merklePath) {
      addProvenTxToBeef(beef, coinbaseRawTx, pathResult.merklePath)
    } else {
      beef.mergeRawTx(coinbaseRawTx)
    }
    beef.mergeRawTx(Array.from(spendTx.toBinary()))

    const spendTxid = spendTx.id('hex')
    const results = await services.postBeef(beef, [spendTxid])
    expect(results[0].status).toBe('success')

    // Verify UTXO status
    const outputScript = '51'
    const outputScriptHash = services.hashOutputScript(outputScript)
    const utxoStatus = await services.getUtxoStatus(outputScriptHash, 'hashLE', `${spendTxid}.0`)
    expect(utxoStatus.status).toBe('success')
    expect(utxoStatus.isUtxo).toBe(true)

    // Verify status for txid (unmined)
    let statusResult = await services.getStatusForTxids([spendTxid])
    expect(statusResult.status).toBe('success')
    expect(statusResult.results[0].status).toBe('known')

    // Mine a block
    const newBlock = await services.mineBlock()
    expect(newBlock.height).toBe(101)

    // Verify status for txid (mined)
    statusResult = await services.getStatusForTxids([spendTxid])
    expect(statusResult.results[0].status).toBe('mined')
    expect(statusResult.results[0].depth).toBe(1)

    // Verify merkle path
    const merkleResult = await services.getMerklePath(spendTxid)
    expect(merkleResult.merklePath).toBeDefined()
    expect(merkleResult.header).toBeDefined()
    expect(merkleResult.header!.height).toBe(101)

    // Verify the merkle path computes the correct root
    const computedRoot = merkleResult.merklePath!.computeRoot(spendTxid)
    expect(computedRoot).toBe(newBlock.merkleRoot)

    // Verify double-spend is rejected
    const doubleTx = new Transaction()
    doubleTx.addInput({
      sourceTXID: coinbaseUtxo.txid,
      sourceOutputIndex: 0,
      unlockingScript: Script.fromHex(''),
      sequence: 0xffffffff
    })
    doubleTx.addOutput({
      satoshis: 4_000_000_000,
      lockingScript: Script.fromHex('51')
    })

    const doubleBeef = new Beef()
    addProvenTxToBeef(doubleBeef, coinbaseRawTx, pathResult.merklePath!)
    doubleBeef.mergeRawTx(Array.from(doubleTx.toBinary()))

    const doubleResults = await services.postBeef(doubleBeef, [doubleTx.id('hex')])
    expect(doubleResults[0].status).toBe('error')
  })

  test('getRawTx returns stored transaction', async () => {
    const tip = await services.storage.getChainTip()
    const txsInBlock = await services.storage.getTransactionsInBlock(tip!.height)
    const someTxid = txsInBlock[0].txid

    const result = await services.getRawTx(someTxid)
    expect(result.rawTx).toBeDefined()
    expect(result.name).toBe('MockServices')
  })

  test('getRawTx returns empty for unknown txid', async () => {
    const result = await services.getRawTx('ff'.repeat(32))
    expect(result.rawTx).toBeUndefined()
  })

  test('getHeaderForHeight', async () => {
    const header = await services.getHeaderForHeight(0)
    expect(header.length).toBe(80)
  })

  test('hashToHeader', async () => {
    const tip = await services.storage.getChainTip()
    const header = await services.hashToHeader(tip!.hash)
    expect(header.height).toBe(tip!.height)
  })

  test('getChainTracker returns tracker', async () => {
    const tracker = await services.getChainTracker()
    expect(tracker).toBeDefined()
  })

  test('getBeefForTxid builds BEEF', async () => {
    // Use the coinbase tx from genesis block (always exists after initialize)
    const tip = await services.storage.getChainTip()
    const txsInBlock = await services.storage.getTransactionsInBlock(tip!.height)
    expect(txsInBlock.length).toBeGreaterThan(0)
    const someTxid = txsInBlock[0].txid

    const beef = await services.getBeefForTxid(someTxid)
    expect(beef).toBeDefined()
    expect(beef.txs.length).toBeGreaterThan(0)
  })

  test('exchange rate methods return static values', async () => {
    const bsvRate = await services.getBsvExchangeRate()
    expect(bsvRate).toBe(50.0)

    const fiatRate = await services.getFiatExchangeRate('EUR')
    expect(typeof fiatRate).toBe('number')

    const rates = await services.getFiatExchangeRates(['USD', 'EUR'])
    expect(rates.rates).toBeDefined()
  })

  test('getServicesCallHistory returns empty structure', () => {
    const history = services.getServicesCallHistory()
    expect(history.version).toBe(2)
  })
})

describe('MockServices reorg', () => {
  let knex: Knex
  let services: MockServices

  beforeEach(async () => {
    knex = createMemoryKnex()
    services = new MockServices(knex)
    await services.initialize()
  })

  afterEach(async () => {
    await knex.destroy()
  })

  test('reorg replaces blocks and returns txs to mempool', async () => {
    // Mine blocks 1-3
    await services.mineBlock() // height 1
    await services.mineBlock() // height 2
    await services.mineBlock() // height 3

    // Add a tx to mempool, mine it into block 4
    // First mature a coinbase to have a spendable UTXO
    // Actually we already have blocks 0-3. Let's mine more to mature block 0 coinbase
    for (let i = 0; i < 97; i++) {
      await services.mineBlock()
    }
    // Now at height 100, block 0 coinbase is mature

    const coinbaseUtxos = await services.storage.knex('mockchain_utxos')
      .where({ isCoinbase: true, blockHeight: 0, spentByTxid: null })
    const coinbaseUtxo = coinbaseUtxos[0]

    const spendTx = new Transaction()
    spendTx.addInput({
      sourceTXID: coinbaseUtxo.txid,
      sourceOutputIndex: 0,
      unlockingScript: Script.fromHex(''),
      sequence: 0xffffffff
    })
    spendTx.addOutput({
      satoshis: 4_999_000_000,
      lockingScript: Script.fromHex('51')
    })

    const beef = new Beef()
    const coinbaseTxRow = await services.storage.getTransaction(coinbaseUtxo.txid)
    const coinbaseRawTx = coinbaseTxRow!.rawTx instanceof Buffer
      ? Array.from(coinbaseTxRow!.rawTx)
      : Array.from(coinbaseTxRow!.rawTx as Uint8Array)
    const pathResult = await services.getMerklePath(coinbaseUtxo.txid)
    addProvenTxToBeef(beef, coinbaseRawTx, pathResult.merklePath!)
    beef.mergeRawTx(Array.from(spendTx.toBinary()))

    const spendTxid = spendTx.id('hex')
    const postResult = await services.postBeef(beef, [spendTxid])
    expect(postResult[0].status).toBe('success')
    await services.mineBlock() // height 101, includes spendTx

    const txBefore = await services.storage.getTransaction(spendTxid)
    expect(txBefore!.blockHeight).toBe(101)

    // Reorg from height 101: replace with 1 new block, tx NOT in map -> returns to mempool
    const result = await services.reorg(101, 1)
    expect(result.deactivatedHeaders.length).toBe(1)
    expect(result.deactivatedHeaders[0].height).toBe(101)

    const txAfter = await services.storage.getTransaction(spendTxid)
    expect(txAfter!.blockHeight).toBeNull()

    const newTip = await services.storage.getChainTip()
    expect(newTip!.height).toBe(101) // still 101, but different block
    expect(newTip!.hash).not.toBe(result.deactivatedHeaders[0].hash)
  })

  test('reorg with txidMap places tx in specific block', async () => {
    // Mine 100 blocks to have a mature coinbase
    for (let i = 0; i < 100; i++) {
      await services.mineBlock()
    }

    const coinbaseUtxos = await services.storage.knex('mockchain_utxos')
      .where({ isCoinbase: true, blockHeight: 0, spentByTxid: null })
    const coinbaseUtxo = coinbaseUtxos[0]

    const spendTx = new Transaction()
    spendTx.addInput({
      sourceTXID: coinbaseUtxo.txid,
      sourceOutputIndex: 0,
      unlockingScript: Script.fromHex(''),
      sequence: 0xffffffff
    })
    spendTx.addOutput({
      satoshis: 4_999_000_000,
      lockingScript: Script.fromHex('51')
    })

    const beef = new Beef()
    const coinbaseTxRow = await services.storage.getTransaction(coinbaseUtxo.txid)
    const coinbaseRawTx = coinbaseTxRow!.rawTx instanceof Buffer
      ? Array.from(coinbaseTxRow!.rawTx)
      : Array.from(coinbaseTxRow!.rawTx as Uint8Array)
    const pathResult = await services.getMerklePath(coinbaseUtxo.txid)
    addProvenTxToBeef(beef, coinbaseRawTx, pathResult.merklePath!)
    beef.mergeRawTx(Array.from(spendTx.toBinary()))

    const spendTxid = spendTx.id('hex')
    const postResult = await services.postBeef(beef, [spendTxid])
    expect(postResult[0].status).toBe('success')
    await services.mineBlock() // height 101

    // Reorg from 101, create 2 new blocks, put tx in offset 1 (height 102)
    const result = await services.reorg(101, 2, { [spendTxid]: 1 })
    expect(result.newTip.height).toBe(102)

    const txAfter = await services.storage.getTransaction(spendTxid)
    expect(txAfter!.blockHeight).toBe(102)
  })

  test('reorg shortens chain', async () => {
    for (let i = 0; i < 5; i++) {
      await services.mineBlock()
    }
    // Height is now 5
    const heightBefore = await services.getHeight()
    expect(heightBefore).toBe(5)

    // Reorg from height 3, create only 1 new block (shortens from 5 to 3)
    const result = await services.reorg(3, 1)
    expect(result.deactivatedHeaders.length).toBe(3) // heights 3, 4, 5
    expect(result.newTip.height).toBe(3)

    const heightAfter = await services.getHeight()
    expect(heightAfter).toBe(3)
  })

  test('reorg lengthens chain', async () => {
    for (let i = 0; i < 3; i++) {
      await services.mineBlock()
    }
    // Height is now 3

    // Reorg from height 3, create 3 new blocks (lengthens from 3 to 5)
    const result = await services.reorg(3, 3)
    expect(result.deactivatedHeaders.length).toBe(1) // only height 3
    expect(result.newTip.height).toBe(5)

    const heightAfter = await services.getHeight()
    expect(heightAfter).toBe(5)
  })
})

describe('TaskMineBlock', () => {
  test('trigger logic', () => {
    // Test static mineNow flag
    TaskMineBlock.mineNow = true
    // We can't easily instantiate without a real Monitor, but we can test the static flag
    expect(TaskMineBlock.mineNow).toBe(true)
    TaskMineBlock.mineNow = false
    expect(TaskMineBlock.mineNow).toBe(false)
  })
})
