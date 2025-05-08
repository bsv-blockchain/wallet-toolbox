import { before } from 'node:test'
import { _tu, TestWalletOnly } from '../../../test/utils/TestUtilsWalletStorage'
import { Setup } from '../../Setup'
import { StorageKnex } from '../StorageKnex'
import { AuthFetch, WalletInterface } from '@bsv/sdk'
import { StorageAdminStats, StorageClient } from '../index.client'

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
    const r = await storage.adminStats(env.identityKey)
    console.log(toLogStringAdminStats(r))
    expect(r.requestedBy).toBe(env.identityKey)
    expect(r.usersTotal).toBeGreaterThan(0)
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
    expect(r.requestedBy).toBe(env.identityKey)
    expect(r.usersTotal).toBeGreaterThan(0)
  })
})

function toLogStringAdminStats(s: StorageAdminStats): string {
  let log = `StorageAdminStats: ${s.when} ${s.requestedBy}\n`
  log += `  ${al('', 13)} ${ar('Day', 15)} ${ar('Month', 15)} ${ar('Total', 15)}\n`
  log += dmt('users', s.usersDay, s.usersMonth, s.usersTotal)
  log += dmt('change sats', sa(s.satoshisDefaultDay), sa(s.satoshisDefaultMonth), sa(s.satoshisDefaultTotal))
  log += dmt('other sats', sa(s.satoshisOtherDay), sa(s.satoshisOtherMonth), sa(s.satoshisOtherTotal))
  log += dmt('labels', s.labelsDay, s.labelsMonth, s.labelsTotal)
  log += dmt('tags', s.tagsDay, s.tagsMonth, s.tagsTotal)
  log += dmt('baskets', s.basketsDay, s.basketsMonth, s.basketsTotal)
  log += dmt('transactions', s.transactionsDay, s.transactionsMonth, s.transactionsTotal)
  log += dmt('  completed', s.txCompletedDay, s.txCompletedMonth, s.txCompletedTotal)
  log += dmt('  failed', s.txFailedDay, s.txFailedMonth, s.txFailedTotal)
  log += dmt('  nosend', s.txNosendDay, s.txNosendMonth, s.txNosendTotal)
  log += dmt('  unproven', s.txUnprovenDay, s.txUnprovenMonth, s.txUnprovenTotal)
  log += dmt('  sending', s.txSendingDay, s.txSendingMonth, s.txSendingTotal)
  log += dmt('  unprocessed', s.txUnprocessedDay, s.txUnprocessedMonth, s.txUnprocessedTotal)
  log += dmt('  unsigned', s.txUnsignedDay, s.txUnsignedMonth, s.txUnsignedTotal)
  log += dmt('  nonfinal', s.txNonfinalDay, s.txNonfinalMonth, s.txNonfinalTotal)
  log += dmt('  unfail', s.txUnfailDay, s.txUnfailMonth, s.txUnfailTotal)

  return log

  function sa(s: number): string {
    let v = s.toString().split('')
    if (v.length > 2) v.splice(-2, 0, '_')
    if (v.length > 6) v.splice(-6, 0, '_')
    if (v.length > 10) v.splice(-10, 0, '.')
    if (v.length > 14) v.splice(-14, 0, '_')
    if (v.length > 18) v.splice(-18, 0, '_')
    return v.join('')
  }

  function dmt(l: string, d: number | string, m: number | string, t: number | string): string {
    return `  ${al(l, 13)} ${ar(d, 15)} ${ar(m, 15)} ${ar(t, 15)}\n`
  }

  function al(v: string | number, w: number): string {
    return v.toString().padEnd(w)
  }
  function ar(v: string | number, w: number): string {
    return v.toString().padStart(w)
  }
}
