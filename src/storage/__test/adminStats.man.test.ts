import { _tu, TestWalletOnly } from '../../../test/utils/TestUtilsWalletStorage'
import { Setup } from '../../Setup'
import { StorageKnex } from '../StorageKnex'
import { AuthFetch } from '@bsv/sdk'
import { StorageAdminStats } from '../index.client'
import { Format } from '../../utility/Format'

describe('storage adminStats tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('main')
  const knex = Setup.createMySQLKnex(process.env.MAIN_CLOUD_MYSQL_CONNECTION!)
  const storage = new StorageKnex({
    chain: env.chain,
    knex: knex,
    commissionSatoshis: 0,
    commissionPubKeyHex: undefined,
    feeModel: { model: 'sat/kb', value: 1 }
  })

  let setup: TestWalletOnly
  let nextId = 0

  beforeAll(async () => {
    await storage.makeAvailable()

    setup = await _tu.createTestWalletWithStorageClient({
      chain: 'main',
      rootKeyHex: env.devKeys[env.identityKey]
    })
  })
  afterAll(async () => {
    await storage.destroy()
    await setup.wallet.destroy()
  })

  test('0 adminStats StorageKnex', async () => {
    storage.setServices(setup.services)
    const r = await storage.adminStats(env.identityKey)
    console.log(Format.toLogStringAdminStats(r))
    expect(r.requestedBy).toBe(env.identityKey)
    expect(r.usersTotal).toBeGreaterThan(0)
    await storage.destroy()
  })

  test('1 adminStats StorageServer via RPC', async () => {
    const authFetch = new AuthFetch(setup.wallet)
    const endpointUrl =
      setup.chain === 'main' ? 'https://storage.babbage.systems' : 'https://staging-storage.babbage.systems'

    const id = nextId++
    const body = {
      jsonrpc: '2.0',
      method: 'adminStats',
      params: [env.identityKey],
      id
    }

    let response: Response
    try {
      response = await authFetch.fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    } catch (eu: unknown) {
      throw eu
    }

    if (!response.ok) {
      throw new Error(`WalletStorageClient rpcCall: network error ${response.status} ${response.statusText}`)
    }

    const json = await response.json()
    if (json.error) {
      const { code, message, data } = json.error
      const err = new Error(`RPC Error: ${message}`)
      // You could attach more info here if you like:
      ;(err as any).code = code
      ;(err as any).data = data
      throw err
    }

    const r = json.result as StorageAdminStats
    console.log(Format.toLogStringAdminStats(r))
    expect(r.requestedBy).toBe(env.identityKey)
    expect(r.usersTotal).toBeGreaterThan(0)
  })
})
