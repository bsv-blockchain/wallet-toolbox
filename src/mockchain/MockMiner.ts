import { Transaction, Script, Utils } from '@bsv/sdk'
import { MockChainStorage, MockChainBlockHeaderRow } from './MockChainStorage'
import { computeMerkleRoot } from './merkleTree'
import { toBinaryBaseBlockHeader } from '../services/Services'
import { doubleSha256BE, sha256Hash } from '../utility/utilityHelpers'
import { asString } from '../utility/utilityHelpers.noBuffer'
import { BlockHeader } from '../sdk/WalletServices.interfaces'

/**
 * Creates a coinbase transaction for the given block height.
 * Uses OP_TRUE (0x51) as the output script so anyone can spend it.
 */
export function createCoinbaseTransaction(height: number): Transaction {
  const tx = new Transaction()

  // BIP34: height in scriptSig
  // Encode height as a minimally-encoded script number pushed in the unlocking script
  const heightBytes: number[] = []
  let h = height
  if (h === 0) {
    heightBytes.push(0)
  } else {
    while (h > 0) {
      heightBytes.push(h & 0xff)
      h >>= 8
    }
    // If the high bit is set, add a 0x00 byte to keep it positive
    if (heightBytes[heightBytes.length - 1] & 0x80) {
      heightBytes.push(0)
    }
  }

  const scriptSigBytes = [heightBytes.length, ...heightBytes]
  const unlockingScript = Script.fromBinary(scriptSigBytes)

  tx.addInput({
    sourceTXID: '00'.repeat(32),
    sourceOutputIndex: 0xffffffff,
    unlockingScript,
    sequence: 0xffffffff
  })

  tx.addOutput({
    satoshis: 5_000_000_000,
    lockingScript: Script.fromHex('51') // OP_TRUE
  })

  return tx
}

export class MockMiner {
  /**
   * Mine a new block containing all unmined transactions.
   * Returns the new block header.
   */
  async mineBlock(storage: MockChainStorage): Promise<BlockHeader> {
    const tip = await storage.getChainTip()
    const newHeight = tip ? tip.height + 1 : 0
    const previousHash = tip ? tip.hash : '00'.repeat(32)

    const unminedTxs = await storage.getUnminedTransactions()

    const coinbaseTx = createCoinbaseTransaction(newHeight)
    const coinbaseTxid = coinbaseTx.id('hex')
    const coinbaseRawTx = Array.from(coinbaseTx.toBinary())

    const txids = [coinbaseTxid, ...unminedTxs.map(t => t.txid)]
    const merkleRoot = computeMerkleRoot(txids)

    const time = Math.floor(Date.now() / 1000)
    const bits = 0x207fffff
    const nonce = Math.floor(Math.random() * 0xffffffff)

    const headerObj = {
      version: 1,
      previousHash,
      merkleRoot,
      time,
      bits,
      nonce
    }

    const headerBinary = toBinaryBaseBlockHeader(headerObj)
    const hash = asString(doubleSha256BE(headerBinary))

    // Compute script hash for the coinbase output (OP_TRUE = 0x51)
    const coinbaseOutputScript = [0x51]
    const coinbaseScriptHash = asString(sha256Hash(coinbaseOutputScript))

    // Wrap in a knex transaction for atomicity
    await storage.knex.transaction(async trx => {
      const trxStorage = new MockChainStorage(trx as unknown as typeof storage.knex)

      // Insert coinbase tx
      await trxStorage.knex('mockchain_transactions').insert({
        txid: coinbaseTxid,
        rawTx: Buffer.from(coinbaseRawTx),
        blockHeight: newHeight,
        blockIndex: 0
      })

      // Insert coinbase UTXO
      await trxStorage.knex('mockchain_utxos').insert({
        txid: coinbaseTxid,
        vout: 0,
        lockingScript: Buffer.from(coinbaseOutputScript),
        satoshis: 5_000_000_000,
        scriptHash: coinbaseScriptHash,
        spentByTxid: null,
        isCoinbase: true,
        blockHeight: newHeight
      })

      // Update unmined txs with block height and sequential block index
      for (let i = 0; i < unminedTxs.length; i++) {
        await trxStorage.knex('mockchain_transactions')
          .where({ txid: unminedTxs[i].txid })
          .update({ blockHeight: newHeight, blockIndex: i + 1 })

        // Update blockHeight on UTXOs belonging to these transactions
        await trxStorage.knex('mockchain_utxos')
          .where({ txid: unminedTxs[i].txid })
          .update({ blockHeight: newHeight })
      }

      // Insert block header
      const headerRow: MockChainBlockHeaderRow = {
        height: newHeight,
        hash,
        previousHash,
        merkleRoot,
        version: 1,
        time,
        bits,
        nonce,
        coinbaseTxid
      }
      await trxStorage.knex('mockchain_block_headers').insert(headerRow)
    })

    return {
      height: newHeight,
      hash,
      previousHash,
      merkleRoot,
      version: 1,
      time,
      bits,
      nonce
    }
  }
}
