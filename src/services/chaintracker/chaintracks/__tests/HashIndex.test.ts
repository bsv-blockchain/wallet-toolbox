import { IndexLevel, IndexLevelMakeVal, IndexLevelVal } from '../util/IndexLevel'
import { doubleSha256BE } from '../../../../utility/utilityHelpers'
import { HashIndex } from '../util/HashIndex'
import { asArray } from '../../../../utility/utilityHelpers.noBuffer'
import { BulkFilesReader } from '../util/BulkFilesReader'
import { ChaintracksFs } from '../util/ChaintracksFs'

const fs = ChaintracksFs

describe('testing makeHashIndex', () => {
  jest.setTimeout(100000)

  const fs = ChaintracksFs

  test('HashIndex', async () => {
    const bufferOfHeaders = await fs.readFile('./src/services/chaintracker/chaintracks/__tests/data/bulk_cdn/mainNet_0.headers')
    const makeVal: IndexLevelMakeVal = (header, height) => ({ buffer: doubleSha256BE(header), height })
    const index = HashIndex.fromBufferOfHeaders(bufferOfHeaders, 0, makeVal)
    const height = await index.findHeight('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f')
    expect(height).toBe(0)
  })

  jest.setTimeout(100000)
  test.skip('write mainNet hash index files', async () => {
    const reader = await BulkFilesReader.fromJsonFile(fs, './test/data/bulk_cdn/', 'mainNet.json')
    await reader.validateFiles()
    for (let i = 0; i < reader.files.length; i++) {
      const buffer = await reader.readBufferFromFile(reader.files[i])
      if (buffer === undefined) throw new Error('oops')
      let index = IndexLevel.makeBlockHashIndex([0, 0, 6], [27, 29, 30])
      index.load(buffer, 0)
      let indexBuffer = index.toBuffer()
      await fs.writeFile(`./src/_tests/data/bulk_headers/mainNet_blockhash_${i}.index`, indexBuffer)
      index = IndexLevel.makeMerkleRootIndex([0, 0, 6], [27, 29, 30])
      index.load(buffer, 0)
      indexBuffer = index.toBuffer()
      await fs.writeFile(`./src/_tests/data/bulk_headers/mainNet_merkleroot_${i}.index`, indexBuffer)
    }
  })

  jest.setTimeout(100000)
  test.skip('analyze mainNet hash index for heights 0-624,999', async () => {
    // shifts,levelIndex    size    maxLen  avgLen
    // [0,0],[27,29]        23M     25
    // [0,0,7][27,29,30]    23.5M   16
    // [0,0,6][27,29,30]    24.5M   11      2.6
    // [0,0,5][27,29,31]    27M     8       1.7
    // [0,0,4][27,29,20]    31M     7       1.3
    const reader = await BulkFilesReader.fromJsonFile(fs, './test/data/bulk_cdn/', 'mainNet.json')
    //await reader.validateFiles()
    const buffer = await reader.readBufferFromFile(reader.files[0])
    if (buffer === undefined) throw new Error('oops')

    let best = Infinity
    let bestB = 0
    for (let b = 20; b < 32; b++) {
      if (b === 27 || b == 29) continue
      const index = IndexLevel.makeBlockHashIndex([0, 0, 4], [27, 29, b])
      index.load(buffer, 0)
      let countEmpty = 0
      let maxLength = 0
      let countBins = 0
      let totalLengths = 0
      const evalFn = (binVals: IndexLevelVal[]) => {
        countBins++
        if (binVals.length === 0) countEmpty++
        else totalLengths += binVals.length
        maxLength = Math.max(binVals.length, maxLength)
      }
      index.evalBinVals(evalFn)
      const avg = totalLengths / (countBins - countEmpty)
      console.log('countEmpty', countEmpty, 'maxLength', maxLength, 'count', countBins, 'avg length', avg)
      if (best > maxLength) {
        best = maxLength
        bestB = b
      }
    }
    console.log('Best b', bestB, 'value', best)
  })
})
