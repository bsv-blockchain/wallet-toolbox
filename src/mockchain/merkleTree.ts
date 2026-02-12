import { MerklePath } from '@bsv/sdk'
import { doubleSha256BE } from '../utility/utilityHelpers'
import { asArray, asString } from '../utility/utilityHelpers.noBuffer'

/**
 * Compute the merkle root from an array of txids (big-endian hex strings).
 * Returns the root as a big-endian hex string (reversed byte order from the
 * natural double-SHA256 result, matching the standard block header format).
 */
export function computeMerkleRoot(txids: string[]): string {
  if (txids.length === 0) {
    throw new Error('Cannot compute merkle root of empty txid list')
  }

  // Convert txids to byte arrays (reverse to little-endian for hashing)
  let level: number[][] = txids.map(txid => asArray(txid).reverse())

  while (level.length > 1) {
    const next: number[][] = []
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]
      const right = i + 1 < level.length ? level[i + 1] : level[i] // duplicate last if odd
      const combined = [...left, ...right]
      const hash = doubleSha256BE(combined).reverse() // doubleSha256BE returns BE, reverse to LE for next level
      next.push(hash)
    }
    level = next
  }

  // Final root in LE, reverse to BE for return
  return asString(level[0].reverse())
}

/**
 * Compute the MerklePath for a target transaction at `targetIndex` within a block at `blockHeight`.
 * `txids` is the ordered list of all txids in the block (big-endian hex).
 */
export function computeMerklePath(txids: string[], targetIndex: number, blockHeight: number): MerklePath {
  if (txids.length === 0) {
    throw new Error('Cannot compute merkle path of empty txid list')
  }
  if (targetIndex < 0 || targetIndex >= txids.length) {
    throw new Error(`targetIndex ${targetIndex} out of range [0, ${txids.length})`)
  }

  type Leaf = {
    offset: number
    hash?: string
    txid?: boolean
    duplicate?: boolean
  }

  // For a single tx, the root IS the txid; path has one level with just the txid leaf
  if (txids.length === 1) {
    type Leaf = { offset: number; hash?: string; txid?: boolean; duplicate?: boolean }
    const path: Leaf[][] = [[{ offset: 0, hash: txids[0], txid: true }]]
    return new MerklePath(blockHeight, path)
  }

  // Calculate tree height
  let treeHeight = 0
  let n = txids.length
  while (n > 1) {
    treeHeight++
    n = Math.ceil(n / 2)
  }

  const path: Leaf[][] = Array(treeHeight)
    .fill(0)
    .map(() => [])

  let index = targetIndex
  // For each level, we need to provide the sibling
  let levelTxids = [...txids]
  for (let level = 0; level < treeHeight; level++) {
    const isOdd = index % 2 === 1
    const siblingIndex = isOdd ? index - 1 : index + 1

    if (level === 0) {
      // At level 0, we include the target txid leaf and the sibling
      const targetLeaf: Leaf = {
        offset: targetIndex,
        hash: txids[targetIndex],
        txid: true
      }

      if (siblingIndex >= levelTxids.length) {
        // Odd number of items, sibling is a duplicate
        const siblingLeaf: Leaf = { offset: siblingIndex, duplicate: true }
        path[0].push(targetLeaf)
        path[0].push(siblingLeaf)
      } else {
        const siblingLeaf: Leaf = { offset: siblingIndex, hash: levelTxids[siblingIndex] }
        if (isOdd) {
          path[0].push(siblingLeaf)
          path[0].push(targetLeaf)
        } else {
          path[0].push(targetLeaf)
          path[0].push(siblingLeaf)
        }
      }
    } else {
      // Higher levels: we only need the sibling hash
      if (siblingIndex >= levelTxids.length) {
        path[level].push({ offset: siblingIndex, duplicate: true })
      } else {
        path[level].push({ offset: siblingIndex, hash: levelTxids[siblingIndex] })
      }
    }

    // Compute next level hashes
    const nextLevel: string[] = []
    for (let i = 0; i < levelTxids.length; i += 2) {
      const left = asArray(levelTxids[i]).reverse()
      const right = i + 1 < levelTxids.length ? asArray(levelTxids[i + 1]).reverse() : left
      const combined = [...left, ...right]
      const hash = doubleSha256BE(combined) // returns BE
      nextLevel.push(asString(hash))
    }
    levelTxids = nextLevel
    index = Math.floor(index / 2)
  }

  return new MerklePath(blockHeight, path)
}
