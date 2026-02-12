import { Knex } from 'knex'
import { MockChainMigrations } from './MockChainMigrations'
import { BlockHeader } from '../sdk/WalletServices.interfaces'

export interface MockChainBlockHeaderRow {
  height: number
  hash: string
  previousHash: string
  merkleRoot: string
  version: number
  time: number
  bits: number
  nonce: number
  coinbaseTxid: string
  created_at?: Date | string
}

export interface MockChainTransactionRow {
  txid: string
  rawTx: number[] | Buffer | Uint8Array
  blockHeight: number | null
  blockIndex: number | null
  created_at?: Date | string
}

export interface MockChainUtxoRow {
  id?: number
  txid: string
  vout: number
  lockingScript: number[] | Buffer | Uint8Array
  satoshis: number
  scriptHash: string
  spentByTxid: string | null
  isCoinbase: boolean
  blockHeight: number | null
  created_at?: Date | string
}

export class MockChainStorage {
  constructor(public knex: Knex) {}

  async migrate(): Promise<void> {
    const migrationSource = new MockChainMigrations()
    await this.knex.migrate.latest({
      migrationSource,
      tableName: 'knex_migrations_mockchain'
    })
  }

  async insertTransaction(txid: string, rawTx: number[]): Promise<void> {
    await this.knex('mockchain_transactions').insert({
      txid,
      rawTx: Buffer.from(rawTx),
      blockHeight: null,
      blockIndex: null
    })
  }

  async getTransaction(txid: string): Promise<MockChainTransactionRow | undefined> {
    return this.knex('mockchain_transactions').where({ txid }).first()
  }

  async getUnminedTransactions(): Promise<MockChainTransactionRow[]> {
    return this.knex('mockchain_transactions').whereNull('blockHeight')
  }

  async setTransactionBlock(txid: string, height: number, index: number): Promise<void> {
    await this.knex('mockchain_transactions').where({ txid }).update({ blockHeight: height, blockIndex: index })
  }

  async insertUtxo(
    txid: string,
    vout: number,
    lockingScript: number[],
    satoshis: number,
    scriptHash: string,
    isCoinbase = false,
    blockHeight: number | null = null
  ): Promise<void> {
    await this.knex('mockchain_utxos').insert({
      txid,
      vout,
      lockingScript: Buffer.from(lockingScript),
      satoshis,
      scriptHash,
      spentByTxid: null,
      isCoinbase,
      blockHeight
    })
  }

  async getUtxo(txid: string, vout: number): Promise<MockChainUtxoRow | undefined> {
    return this.knex('mockchain_utxos').where({ txid, vout }).first()
  }

  async getUtxosByScriptHash(scriptHash: string): Promise<MockChainUtxoRow[]> {
    return this.knex('mockchain_utxos').where({ scriptHash })
  }

  async markUtxoSpent(txid: string, vout: number, spentByTxid: string): Promise<void> {
    await this.knex('mockchain_utxos').where({ txid, vout }).update({ spentByTxid })
  }

  async insertBlockHeader(header: MockChainBlockHeaderRow): Promise<void> {
    await this.knex('mockchain_block_headers').insert(header)
  }

  async getBlockHeaderByHeight(height: number): Promise<BlockHeader | undefined> {
    const row = await this.knex('mockchain_block_headers').where({ height }).first()
    return row ? this.rowToBlockHeader(row) : undefined
  }

  async getBlockHeaderByHash(hash: string): Promise<BlockHeader | undefined> {
    const row = await this.knex('mockchain_block_headers').where({ hash }).first()
    return row ? this.rowToBlockHeader(row) : undefined
  }

  async getChainTip(): Promise<BlockHeader | undefined> {
    const row = await this.knex('mockchain_block_headers').orderBy('height', 'desc').first()
    return row ? this.rowToBlockHeader(row) : undefined
  }

  async getTransactionsInBlock(height: number): Promise<MockChainTransactionRow[]> {
    return this.knex('mockchain_transactions').where({ blockHeight: height }).orderBy('blockIndex', 'asc')
  }

  async deleteBlockHeader(height: number): Promise<void> {
    await this.knex('mockchain_block_headers').where({ height }).delete()
  }

  async deleteTransaction(txid: string): Promise<void> {
    await this.knex('mockchain_transactions').where({ txid }).delete()
  }

  async deleteUtxosByTxid(txid: string): Promise<void> {
    await this.knex('mockchain_utxos').where({ txid }).delete()
  }

  async setUtxoBlockHeight(txid: string, blockHeight: number | null): Promise<void> {
    await this.knex('mockchain_utxos').where({ txid }).update({ blockHeight })
  }

  async unspendUtxo(txid: string, vout: number): Promise<void> {
    await this.knex('mockchain_utxos').where({ txid, vout }).update({ spentByTxid: null })
  }

  private rowToBlockHeader(row: MockChainBlockHeaderRow): BlockHeader {
    return {
      height: row.height,
      hash: row.hash,
      previousHash: row.previousHash,
      merkleRoot: row.merkleRoot,
      version: row.version,
      time: row.time,
      bits: row.bits,
      nonce: row.nonce
    }
  }
}
