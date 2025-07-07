/* eslint-disable @typescript-eslint/no-unused-vars */
import { Chain } from '../../../sdk/types'
import { BulkIndexBaseOptions } from './Api/BulkIndexApi'
import { StorageEngineApi } from './Api/StorageEngineApi'
import { BulkIndexBase } from './Base/BulkIndexBase'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { HashIndex } from './util/HashIndex'
import { HeightRange } from './util/HeightRange'
import { asUint8Array } from '../../../utility/utilityHelpers.noBuffer'

export interface BulkIndexFileOptions extends BulkIndexBaseOptions {
  rootFolder: string | undefined
  blockHashFilename: string | undefined
  merkleRootFilename: string | undefined
  fs: ChaintracksFsApi
}

export class BulkIndexFile extends BulkIndexBase {
  static createBulkIndexFileOptions(chain: Chain, fs: ChaintracksFsApi, rootFolder?: string): BulkIndexFileOptions {
    const options: BulkIndexFileOptions = {
      ...BulkIndexBase.createBulkIndexBaseOptions(chain),
      fs,
      rootFolder: rootFolder || './data/',
      blockHashFilename: `${chain}Net_bulk_index_file.blockhash`,
      merkleRootFilename: `${chain}Net_bulk_index_file.merkleroot`
    }
    return options
  }

  options: BulkIndexFileOptions
  fs: ChaintracksFsApi

  hashIndex: HashIndex | undefined
  rootIndex: HashIndex | undefined

  private storage: StorageEngineApi | undefined

  constructor(options: BulkIndexFileOptions) {
    super(options)
    if (!options.rootFolder) throw new Error('The rootFolder options property is required.')

    this.options = { ...options }
    this.fs = options.fs
  }

  override async setStorage(storage: StorageEngineApi): Promise<void> {
    this.storage = storage
    const o = this.options
    if (o.hasBlockHashToHeightIndex && o.blockHashFilename && o.rootFolder)
      this.hashIndex = await HashIndex.loadFromFile(this.fs, o.rootFolder, o.blockHashFilename)
    if (o.hasMerkleRootToHeightIndex && o.merkleRootFilename && o.rootFolder)
      this.rootIndex = await HashIndex.loadFromFile(this.fs, o.rootFolder, o.merkleRootFilename)
  }

  override async validate(added: HeightRange): Promise<void> {
    if (!this.storage?.bulkStorage) throw new Error('BulkIndex requires BulkStorage.')
    const bs = this.storage.bulkStorage
    const range = await bs.getHeightRange()
    let rebuild = !added.isEmpty
    if (!rebuild && !range.isEmpty) {
      /* Check that most recent bulk header is in the indices... */
      const h = await bs.findHeaderForHeight(range.maxHeight)
      const heightRoot = await this.findHeightForMerkleRoot(h.merkleRoot)
      const heightHash = await this.findHeightForBlockHash(h.hash)
      rebuild = h.height !== heightRoot || h.height !== heightHash
    }
    if (rebuild) {
      // Rebuild bulk storage indices.
      console.log('Rebuilding bulk header indices.')
      const buffer = await bs.headersToBuffer(range.minHeight, range.length)
      await this.appendHeaders(range.minHeight, range.length, buffer)
    }
    console.log('Bulk header indices are valid.')
  }

  override async appendHeaders(minHeight: number, count: number, newBulkHeaders: Uint8Array): Promise<void> {
    if (minHeight !== 0) throw new Error('Only appendHeaders from zero is supported.')
    if (count !== newBulkHeaders.length / 80) throw new Error('newBulkHeaders length must be 80 * count')
    const o = this.options
    if (o.hasBlockHashToHeightIndex && o.blockHashFilename && o.rootFolder) {
      this.hashIndex = HashIndex.makeBlockHashIndex(newBulkHeaders, minHeight)
      await this.fs.writeFile(this.fs.pathJoin(o.rootFolder, o.blockHashFilename), asUint8Array(this.hashIndex.buffer))
      console.log(`Wrote new hashIndex for ${newBulkHeaders.length / 80} headers.`)
    }
    if (o.hasMerkleRootToHeightIndex && o.merkleRootFilename && o.rootFolder) {
      this.rootIndex = HashIndex.makeMerkleRootIndex(newBulkHeaders, minHeight)
      await this.fs.writeFile(this.fs.pathJoin(o.rootFolder, o.merkleRootFilename), asUint8Array(this.rootIndex.buffer))
      console.log(`Wrote new rootIndex for ${newBulkHeaders.length / 80} headers.`)
    }
  }

  override async findHeightForBlockHash(hash: string): Promise<number | undefined> {
    const height = await this.hashIndex?.findHeight(hash)
    return height
  }

  override async findHeightForMerkleRoot(merkleRoot: string): Promise<number | undefined> {
    const height = await this.rootIndex?.findHeight(merkleRoot)
    return height
  }
}
