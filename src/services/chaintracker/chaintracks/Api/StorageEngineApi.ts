import { BulkIndexApi } from './BulkIndexApi'
import { BulkStorageApi } from './BulkStorageApi'
import { HeightRange } from '../util/HeightRange'
import { BaseBlockHeader, BlockHeader, LiveBlockHeader } from './BlockHeaderApi'
import { Chain } from '../../../../sdk/types'

/// StorageEngine Interface

export interface StorageEngineBaseOptions {
  /**
   * Which chain is being tracked: main, test, or stn.
   */
  chain: Chain

  /**
   * How much of recent history is required to be kept in "live" block header storage.
   *
   * Headers with height less than active chain tip height minus `liveHeightThreshold`
   * are not required to be kept in "live" storage and may be migrated to "bulk" storage.
   *
   * As no forks, orphans, or reorgs can affect "bulk" block header storage, an
   * aggressively high number is recommended: At least an order of magnitude more than
   * the deepest actual reorg you can imagine.
   */
  liveHeightThreshold: number

  /**
   * How much of recent history must be processed with full validation and reorg support.
   *
   * Must be less than or equal to `liveHeightThreshold`.
   *
   * Headers with height older than active chain tip height minus `reorgHeightThreshold`
   * may use batch processing when ingesting headers.
   */
  reorgHeightThreshold: number

  /**
   * How many excess "live" headers to accumulate before migrating them as a chunk to the
   * `bulkStorageEngine`.
   */
  bulkMigrationChunkSize: number

  /**
   * Batch insert chunk size for bulk index tables (BlockHash or MerkleRoot).
   * Must be less than or equal to `bulkmigrationChunkSize`.
   */
  bulkIndexTableChunkSize: number

  /**
   * Maintain a merkleRoot to block header height lookup index for all headers.
   * Enables the `findHeightForMerkleRoot` and `findHeaderForMerkleRoot` lookup methods.
   */
  hasMerkleRootToHeightIndex: boolean

  /**
   * Maintain a block hash to block header height lookup index for all headers.
   * Enables the `findHeightForBlockHash` and `findHeaderForBlockHash` lookup methods.
   */
  hasBlockHashToHeightIndex: boolean

  /**
   * Maximum number of headers per call to batchInsert
   */
  batchInsertLimit: number
}

export interface StorageEngineQueryApi {
  /**
   * Returns the active chain tip header
   * Throws an error if there is no tip.
   */
  findChainTipHeader(): Promise<LiveBlockHeader>

  /**
   * Returns the block hash of the active chain tip.
   */
  findChainTipHash(): Promise<string>

  /**
   * Returns the active chain tip header or undefined if there is no tip.
   */
  findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined>

  /**
   * Returns the chainWork value of the active chain tip
   */
  findChainTipWork(): Promise<string>

  /**
   * Given the hash of a block, returns 32 byte hex string with the chainWork value for that block.
   * @param hash block hash
   */
  findChainWorkForBlockHash(hash: string): Promise<string>

  /**
   * Returns block header for a given block hash
   * @param hash block hash
   */
  findHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | BlockHeader>

  /**
   * Returns block header for a given block hash
   * @param hash block hash
   */
  findHeaderForBlockHashOrUndefined(hash: string): Promise<LiveBlockHeader | BlockHeader | undefined>

  /**
   * Returns block header for a given block height on active chain.
   * @param hash block hash
   */
  findHeaderForHeight(height: number): Promise<LiveBlockHeader | BlockHeader>

  /**
   * Returns block header for a given block height on active chain.
   * @param hash block hash
   */
  findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined>

  /**
   * Returns the height of the block with the given hash.
   * May not be on the active chain.
   * @param hash block hash
   */
  findHeightForBlockHash(hash: string): Promise<number>

  /**
   * Returns the height of the block with the given merkleRoot.
   * May not be on the active chain.
   * @param hash block hash
   */
  findHeightForMerkleRoot(merkleRoot: string): Promise<number>

  /**
   * Returns block header for a given merkleRoot
   * Throws if not found.
   * @param merkleRoot
   */
  findHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | BlockHeader>

  /**
   * Returns block header for a given merkleRoot
   * @param merkleRoot
   * @param height
   */
  findHeaderForMerkleRootOrUndefined(
    merkleRoot: string,
    height?: number
  ): Promise<LiveBlockHeader | BlockHeader | undefined>

  /**
   * Given two chain tip headers in a chain reorg scenario,
   * return their common ancestor header.
   * @param header1 First header in live part of the chain.
   * @param header2 Second header in live part of the chain.
   */
  findCommonAncestor(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<LiveBlockHeader>

  /**
   * This is an original API. Proposed deprecation in favor of `findCommonAncestor`
   * Given two headers that are both chain tips in a reorg scenario, returns
   * the depth of the reorg (the greater of the heights of the two provided
   * headers, minus the height of their last common ancestor)
   */
  findReorgDepth(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<number>

  /**
   * Returns true if the given merkleRoot is found in a block header on the active chain.
   * @param merkleRoot of block header
   */
  isMerkleRootActive(merkleRoot: string): Promise<boolean>

  /**
   * Adds headers in 80 byte serialized format to a buffer.
   * Only adds active headers.
   * Buffer length divided by 80 is the actual number returned.
   *
   * Only returns headers from live storage, newer than reorgHeightThreshold
   *
   * This function supports the migration of live headers to bulk storage.
   *
   * Returns `{ buffer, headerId, hashes, merkleRoots }`
   *
   * @param height of first header, must be > presentHeight - reorgHeightThreshold
   * @param count of headers
   * @returns `buffer` of serialized headers
   * @returns `headerId` of last header
   * @returns `hashes` array of header hashes
   * @returns `merkleRoots` array of header merkleRoots
   */
  headersToBuffer(
    height: number,
    count: number
  ): Promise<{ buffer: number[]; headerId: number; hashes: string[]; merkleRoots: string[] }>

  /**
   * Adds headers in 80 byte serialized format to a buffer.
   * Only adds active headers.
   * Buffer length divided by 80 is the actual number returned.
   *
   * This function supports the ChaintracksClientApi
   *
   * @param height of first header, must be >= zero.
   * @param count of headers, maximum
   */
  getHeaders(height: number, count: number): Promise<number[]>

  /**
   * Returns block header for a given block height on active chain.
   * @param hash block hash
   */
  findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null>

  /**
     * Returns block header for a given headerId.
     
     * Only from the "live" portion of the chain.
     * @param headerId
     */
  findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader>

  /**
   * Returns block header for a given block hash.
   * Only from the "live" portion of the chain.
   * Returns null if not found.
   * @param hash block hash
   */
  findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null>

  /**
   * Returns block header for a given merkleRoot.
   * Only from the "live" portion of the chain.
   * @param merkleRoot
   */
  findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null>

  /**
   * Returns the height range of both bulk and live storage.
   * Verifies that the ranges meet these requirements:
   * - Both may be empty.
   * - If bulk is empty, live must be empty or start with height zero.
   * - If bulk is not empty it must start with height zero.
   * - If bulk is not empty and live is not empty, live must start with the height after bulk.
   */
  getAvailableHeightRanges(): Promise<{ bulk: HeightRange; live: HeightRange }>

  /**
   * @returns The current minimum and maximum height active LiveBlockHeaders in the "live" database.
   */
  findLiveHeightRange(): Promise<{ minHeight: number; maxHeight: number }>

  /**
   * @returns The maximum headerId value used by existing records or -1 if there are none.
   */
  findMaxHeaderId(): Promise<number>

  /**
   * Returns the height of the block in bulk storage with the given hash.
   * Returns null if hash is not found.
   * @param hash block hash
   */
  findBulkHeightForBlockHash(hash: string): Promise<number | null>

  /**
   * Returns the height of the block in bulk storage with the given merkleRoot.
   * Returns null if hash is not found.
   * @param merkleRoot
   */
  findBulkHeightForMerkleRoot(merkleRoot: string): Promise<number | null>

  //
  // Available Properties
  //

  /**
   * Which chain is being tracked: "main" or "test".
   */
  chain: Chain

  /**
   * How much of recent history is required to be kept in "live" block header storage.
   *
   * Headers with height older than active chain tip height minus `liveHeightThreshold`
   * are not required to be kept in "live" storage and may be migrated to "bulk" storage.
   */
  liveHeightThreshold: number

  /**
   * How much of recent history must be processed with full validation and reorg support.
   *
   * May be less than `liveHeightThreshold`.
   *
   * Headers with height older than active chain tip height minus ``
   * may use batch processing when ingesting headers.
   */
  reorgHeightThreshold: number

  /**
   * How many excess "live" headers to accumulate before migrating them as a chunk to the
   * `bulkStorageEngine`.
   */
  bulkMigrationChunkSize: number

  /**
   * Maximum batch insert chunk size for bulk index tables (BlockHash or MerkleRoot)
   */
  bulkIndexTableChunkSize: number

  /**
   * Maintain a merkleRoot to block header height lookup index for all headers.
   * Enables the `findHeightForMerkleRoot` and `findHeaderForMerkleRoot` lookup methods.
   */
  hasMerkleRootToHeightIndex: boolean

  /**
   * Maintain a block hash to block header height lookup index for all headers.
   * Enables the `findHeightForBlockHash` and `findHeaderForBlockHash` lookup methods.
   */
  hasBlockHashToHeightIndex: boolean

  /**
   * Maximum number of headers per call to batchInsert
   */
  batchInsertLimit: number

  /**
   * Optional "bulk" storage engine to which headers are migrated after exceeding the `liveHeightThreshold`
   */
  bulkStorage?: BulkStorageApi

  /**
   * Optional "bulk" index component to provide Block Hash and MerkleRoot to Height index serice.
   */
  bulkIndex?: BulkIndexApi
}

export type InsertHeaderResult = {
  /**
   * true only if the new header was inserted
   */
  added: boolean
  /**
   * true only if the header was not inserted because a matching hash already exists in the database.
   */
  dupe: boolean
  /**
   * true only if the new header became the active chain tip.
   */
  isActiveTip: boolean
  /**
   * zero if the insertion of the new header did not cause a reorg.
   * If isActiveTip is true, and priorTip is not the new headers previous header,
   * then the minimum height difference from the common active ancestor to this header (new tip) and priorTip.
   */
  reorgDepth: number
  /**
   * If `added` is true, this header was the active chain tip before the insert. It may or may not still be the active chain tip after the insert.
   */
  priorTip: LiveBlockHeader | undefined
  /**
   * header's previousHash was not found in database
   */
  noPrev: boolean
  /**
   * header matching previousHash does not have height - 1
   */
  badPrev: boolean
  /**
   * an active ancestor was not found in live storage or prev header.
   */
  noActiveAncestor: boolean
  /**
   * a current chain tip was not found in live storage or prev header.
   */
  noTip: boolean
}

export interface StorageEngineIngestApi {
  /**
   * Inserts a genesis block header into a new, empty chain.
   * Requires that the chain is empty.
   * `height` must be zero.
   * `chainWork` must be the initial chainWork of the genesis header.
   * @param header The initial genesis header for a new chain.
   * @param chainWork The initial chainWork of for the header.
   */
  insertGenesisHeader(header: BaseBlockHeader, chainWork: string): Promise<void>

  /**
   * Attempts to insert a block header into the chain.
   *
   * Returns 'added' false and 'dupe' true if header's hash already exists in the live database
   * Returns 'added' false and 'dupe' false if header's previousHash wasn't found in the live database, or height doesn't increment previous' height.
   *
   * Computes the header's chainWork from its bits and the previous header's chainWork.
   *
   * Returns 'added' true if the header was added to the live database.
   * Returns 'isActiveTip' true if header's chainWork is greater than current active chain tip's chainWork.
   *
   * If the addition of this header caused a reorg (did not directly extend old active chain tip):
   * Returns 'reorgDepth' the minimum height difference of the common ancestor to the two chain tips.
   * Returns 'priorTip' the old active chain tip.
   * If not a reorg:
   * Returns 'reorgDepth' of zero.
   * Returns 'priorTip' the active chain tip before this insert. May be unchanged.
   *
   * Implementation must call `pruneLiveBlockHeaders` after adding new header.
   *
   * @param header to insert
   * @param prev if not undefined, the last bulk storage header with total bulk chainWork
   */
  insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult>

  /**
   * Inserts an array of block headers which extend the active chain tip.
   * Implementation must call `pruneLiveBlockHeaders` after adding new header.
   * @param headers Array of headers to insert
   * @param firstHeight Height of first header in array
   */
  batchInsertHeaders(headers: BaseBlockHeader[], firstHeight: number): Promise<void>

  /**
   * Must be called after the addition of new LiveBlockHeaders.
   *
   * Checks the `StorageEngine` configuration options to see
   * if BulkStorage is configured and if there is at least one
   * `bulkMigrationChunkSize` woth of headers in excess of
   * `liveHeightThreshold` available.
   *
   * If yes, then calls `migrateLiveToBulk` one or more times.
   * @param activeTipHeight height of active tip after adds
   */
  pruneLiveBlockHeaders(activeTipHeight: number): Promise<void>

  /**
   * Migrates the oldest `count` LiveBlockHeaders to BulkStorage.
   * BulkStorage must be configured.
   * `count` must not exceed `bulkMigrationChunkSize`.
   * `count` must leave at least `liveHeightThreshold` LiveBlockHeaders.
   *
   * @param count
   *
   * Steps:
   * - Copy count oldest active LiveBlockHeaders from live database to buffer.
   * - Append the buffer of headers to BulkStorage
   * - Add the buffer's BlockHash, Height pairs to corresponding index table.
   * - Add the buffer's MerkleRoot, Height pairs to corresponding index table.
   * - Delete the records from the live database.
   */
  migrateLiveToBulk(count: number): Promise<void>

  /**
   * Add block `{hash, height}` pairs to index table controlled by
   * `hasBlockHashToHeightIndex` which enables queries for bulk storage headers
   * by block hash lookup.
   * The index converts block hash to height; which is the only native lookup option for
   * bulk storage.
   *
   * The implementation must handle duplicates by ignoring them.
   *
   * If an error occurs a some point while pruning live row headers, the
   * headers will be presented again for appending. The append must complete without error
   * even if all or the values are duplicates.
   *
   * @param hashes array of block hashes for newly appended bulk storage block headers.
   * @param minHeight height of first entry in `hashes`
   */
  appendBlockHashes(hashes: string[], minHeight: number): Promise<void>

  /**
   * Add `{merkleRoot, height} pairs to index table controlled by
   * `hasMerkleRootToHeightIndex` which enables queries for bulk storage headers
   * by merkleRoot lookup.
   * The index converts merkleRoot to height; which is the only native lookup option for
   * bulk storage.
   *
   * The implementation must handle duplicates by ignoring them.
   *
   * If an error occurs a some point while pruning live row headers, the
   * headers will be presented again for appending. The append must complete without error
   * even if all or the values are duplicates.
   *
   * @param merkleRoots array of merkleRoots for newly appended bulk storage block headers.
   * @param minHeight height of first entry in `hashes`
   */
  appendMerkleRoots(merkleRoots: string[], minHeight: number): Promise<void>

  /**
   * Used to prune live block header records from the live database.
   * Called after the headers have been appended to bulk storage
   * and after the block hash and merkleRoot to height indices have been
   * updated.
   *
   * All live database block header records with headerId less than or equal to `headerId` must be deleted.
   *
   * @param headerId delete all records with less or equal `headerId`
   */
  deleteOlderLiveBlockHeaders(headerId: number): Promise<void>

  /**
   * Invoke when database is idle and about to begin work.
   * Creates and/or updates schemas.
   */
  migrateLatest(): Promise<void>

  /**
   * @returns min, max height range in live database or empty (0, -1)
   */
  getLiveHeightRange(): Promise<HeightRange>
}

export interface StorageEngineApi extends StorageEngineQueryApi, StorageEngineIngestApi {
  /**
   * Close and release all resources.
   */
  shutdown(): Promise<void>

  /**
   * Configure the bulk storage service to be used, if not undefinedd.
   * Initialize any resources.
   * @param bulk
   */
  setBulkStorage(bulk?: BulkStorageApi): Promise<void>

  /**
   * Configure the bulk index service to be used, if not undefinedd.
   * Initialize any resources.
   * @param bulk
   */
  setBulkIndex(bulkIndex?: BulkIndexApi): Promise<void>
}
