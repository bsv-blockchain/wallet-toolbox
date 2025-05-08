/**
 * These hashes are for blocks that are to known to have violated the Bitcoin
 * protocol. Regardless of the amount of proof-of-work that chains built on top
 * of them may have accumulated, they cannot be considered valid Bitcoin blocks.
 *
 * In the first instance, segregating witness data from transactions is not
 * part of the design of Bitcoin.
 *
 * In the second instance, adding new opcodes to be used when evaluating
 * scripts is also not allowed.
 */
export const dirtyHashes = {
  // Block 478,558 with hash of 0000000000000000011865af4122fe3b144e2cbeea86142e8ff2fb4107352d43 was the last block shared by BSV, BCH and BTC
  // Block 478,559 with hash of 00000000000000000019f112ec0a9982926f1258cdcc558dd7c3b7e5dc7fa148 was the first block of the BTC Segwit chain.
  // Block 478,559 with hash of 000000000000000000651ef99cb9fcbe0dadde1d424bd9f15ff20136191a5eec was the valid Bitcoin block shared by BSV and BCH.
  '00000000000000000019f112ec0a9982926f1258cdcc558dd7c3b7e5dc7fa148':
    'This is the first header of the invalid SegWit chain.',
  '0000000000000000004626ff6e3b936941d341c5932ece4357eeccac44e6d56c':
    'This is the first header of the invalid ABC chain.'
}

/**
 * Throws Error if blockHash is in the dirtyHashes list.
 */
export function validateAgainstDirtyHashes(blockHash: string): void {
  if (dirtyHashes[blockHash]) {
    throw new Error(`Not adding a header with a dirty hash: ${dirtyHashes[blockHash]}`)
  }
}
