/**
 * These are fields of 80 byte serialized header in order whose double sha256 hash is a block's hash value
 * and the next block's previousHash value.
 *
 * All block hash values and merkleRoot values are 32 byte hex string values with the byte order reversed from the serialized byte order.
 */
export interface BaseBlockHeader {
  /**
   * Block header version value. Serialized length is 4 bytes.
   */
  version: number
  /**
   * Hash of previous block's block header. Serialized length is 32 bytes.
   */
  previousHash: string
  /**
   * Root hash of the merkle tree of all transactions in this block. Serialized length is 32 bytes.
   */
  merkleRoot: string
  /**
   * Block header time value. Serialized length is 4 bytes.
   */
  time: number
  /**
   * Block header bits value. Serialized length is 4 bytes.
   */
  bits: number
  /**
   * Block header nonce value. Serialized length is 4 bytes.
   */
  nonce: number
}

/**
 * A `BaseBlockHeader` extended with its computed hash and height in its chain.
 */
export interface BlockHeader extends BaseBlockHeader {
  /**
   * Height of the header, starting from zero.
   */
  height: number
  /**
   * The double sha256 hash of the serialized `BaseBlockHeader` fields.
   */
  hash: string
}

/**
 * The "live" portion of the block chain is recent history that can conceivably be subject to reorganizations.
 * The additional fields support tracking orphan blocks, chain forks, and chain reorgs.
 */
export interface LiveBlockHeader extends BlockHeader {
  /**
   * The cummulative chainwork achieved by the addition of this block to the chain.
   * Chainwork only matters in selecting the active chain.
   */
  chainWork: string
  /**
   * True only if this header is currently a chain tip. e.g. There is no header that follows it by previousHash or previousHeaderId.
   */
  isChainTip: boolean
  /**
   * True only if this header is currently on the active chain.
   */
  isActive: boolean
  /**
   * As there may be more than one header with identical height values due to orphan tracking,
   * headers are assigned a unique headerId while part of the "live" portion of the block chain.
   */
  headerId: number
  /**
   * Every header in the "live" portion of the block chain is linked to an ancestor header through
   * both its previousHash and previousHeaderId properties.
   *
   * Due to forks, there may be multiple headers with identical `previousHash` and `previousHeaderId` values.
   * Of these, only one (the header on the active chain) will have `isActive` === true.
   */
  previousHeaderId: number | null
}

//
// TYPE GUARDS
//

/**
 * Type guard function.
 * @publicbody
 */
export function isLive(header: BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
  return (header as LiveBlockHeader).headerId !== undefined
}

/**
 * Type guard function.
 * @publicbody
 */
export function isBaseBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is BaseBlockHeader {
  return typeof header.previousHash === 'string'
}

/**
 * Type guard function.
 * @publicbody
 */
export function isBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
  return 'height' in header && typeof header.previousHash === 'string'
}

/**
 * Type guard function.
 * @publicbody
 */
export function isLiveBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
  return 'chainwork' in header && typeof header.previousHash === 'string'
}
