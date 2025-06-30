import { Hash } from "@bsv/sdk"
import { BulkHeaderFilesInfo } from "../util/BulkFilesReader"
import { ChaintracksFetch } from "../util/ChaintracksFetch"
import { asArray, asString } from "../../../../utility/utilityHelpers.noBuffer"

describe('ChaintracksFetch tests', () => {
    jest.setTimeout(99999999)

  test('0 fetchJson', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    //const jsonResource = `${cdnUrl}/testNetV2.json`
    const jsonResource = `${cdnUrl}/testNet.json`
    const info: BulkHeaderFilesInfo = await fetch.fetchJson(jsonResource)
    expect(info).toBeDefined()
    expect(info.files.length).toBeGreaterThan(4)
  })

  test('1 download', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/testNet_0.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(32000000)
    const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
    expect(fileHash).toBe('s22w9l/Mv4cUSu8LpHbiCfgpJmde72O/WVjia2fK1jI=')
  })

  test('2 download faster crypto.subtle sha256', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/testNet_0.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(32000000)
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data))
    const fileHash = asString(hash, 'base64')
    expect(fileHash).toBe('s22w9l/Mv4cUSu8LpHbiCfgpJmde72O/WVjia2fK1jI=')
  })

  test('3 download', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/testNet_4.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(80 * 77821)
    const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
    expect(fileHash).toBe("AK1FlgOaPVFOeG2x+Tp7htOt15UaSpHXZjgx3F263x8=")
  })

  test('4 download', async () => {
    const fetch = new ChaintracksFetch()
    const cdnUrl = 'https://cdn.projectbabbage.com/blockheaders/'
    const url = `${cdnUrl}/mainNet_2.headers`
    const data = await fetch.download(url)
    expect(data.length).toBe(80 * 99705)
    const fileHash = asString(Hash.sha256(asArray(data)), 'base64')
    expect(fileHash).toBe("ebnNDDlfPU2zpwhhcnx5gs5p7fBbmrGqfjreRxcmmAU=")
  })
})