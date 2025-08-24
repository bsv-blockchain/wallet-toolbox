import { Hash } from '@bsv/sdk'
import { BulkHeaderFilesInfo } from '../BulkHeaderFile'
import { ChaintracksFetch } from '../ChaintracksFetch'
import { asArray, asString } from '../../../../../utility/utilityHelpers.noBuffer'
import { validBulkHeaderFilesByFileHash } from '../validBulkHeaderFilesByFileHash'

describe('ChaintracksFetch tests', () => {
  jest.setTimeout(99999999)

  test('0 fetchJson', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    //const jsonResource = `${cdnUrl}/testNetV2.json`
    const jsonResource = `${cdnUrl}/testNetBlockHeaders.json`
    const info: BulkHeaderFilesInfo = await fetch.fetchJson(jsonResource)
    expect(info).toBeDefined()
    expect(info.files.length).toBeGreaterThan(4)
  })

  test('1 download', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/testNet_0.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(8000000)
    const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
    expect(validBulkHeaderFilesByFileHash()[fileHash]).toBeDefined()
  })

  test.skip('2 download faster crypto.subtle sha256', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/testNet_0.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(8000000)
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', Uint8Array.from(data)))
    const fileHash = asString(hash, 'base64')
    expect(validBulkHeaderFilesByFileHash()[fileHash]).toBeDefined()
  })

  test('3 download', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/testNet_4.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(80 * 100000)
    const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
    expect(validBulkHeaderFilesByFileHash()[fileHash]).toBeDefined()
  })

  test('4 download', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/mainNet_2.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(80 * 100000)
    const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
    expect(validBulkHeaderFilesByFileHash()[fileHash]).toBeDefined()
  })
})
