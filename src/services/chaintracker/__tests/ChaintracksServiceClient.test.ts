import { sdk } from '../../../index.client'
import { ChaintracksServiceClient } from '../chaintracks/index.client'

const includeTestChaintracks = false

describe('ChaintracksServiceClient tests', () => {
  jest.setTimeout(99999999)

  test('0 mainNet findHeaderForHeight', async () => {
    const client = makeClient('main')
    const r = await client.findHeaderForHeight(877595)
    expect(r?.hash).toBe('00000000000000000b010edee7422c59ec9131742e35f3e0d5837d710b961406')
    expect(await client.findHeaderForHeight(999999999)).toBe(undefined)
  })

  test('1 testNet findHeaderForHeight', async () => {
    if (!includeTestChaintracks) return
    const client = makeClient('test')
    const r = await client.findHeaderForHeight(1651723)
    expect(r?.hash).toBe('0000000049686fe721f70614c89df146e410240f838b8f3ef8e6471c6dfdd153')
    expect(await client.findHeaderForHeight(999999999)).toBe(undefined)
  })
})

function makeClient(chain: sdk.Chain) {
  //const chaintracksUrl = `https://npm-registry.babbage.systems:${chain === 'main' ? 8084 : 8083}`
  const chaintracksUrl = `https://${chain}net-chaintracks.babbage.systems`
  return new ChaintracksServiceClient(chain, chaintracksUrl)
}
