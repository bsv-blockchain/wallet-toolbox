import { LocalKVStore, WalletClient } from '@bsv/sdk'
import { Chain } from '../../src/sdk/types'
import { createSetup, LocalWalletTestOptions } from '../utils/localWalletMethods'

const chain: Chain = 'main'

const options: LocalWalletTestOptions = {
  setActiveClient: true,
  useMySQLConnectionForClient: true,
  useTestIdentityKey: false,
  useIdentityKey2: false
}

describe('LocalKVStore tests', () => {
  jest.setTimeout(99999999)

  test('0 unencrypted Wallet', async () => {
    const originator = 'wallet-toolbox.tests'
    const setup = await createSetup(chain, options)
    const { wallet } = setup

    const basket = 'kvstoretest5'
    const kv = new LocalKVStore(wallet, basket, false, originator)

    const r1 = await kv.set('a', 'apple')
    expect(r1).toBeTruthy() // the outpoint of the new stored value
    const r1a = await kv.set('a', 'apple')
    expect(r1a).toBe(r1) // same value must return same outpoint
    const r2 = await kv.get('a')
    expect(r2).toBe('apple')
    const r3 = await kv.get('b', 'banana')
    expect(r3).toBe('banana')
    const r4 = await kv.remove('b')
    expect(r4.length).toBe(0)
    const r5 = await kv.remove('a')
    expect(r5.length).toBe(1)
    const lor = await wallet.listOutputs({ basket })
    expect(lor.totalOutputs).toBe(0)

    await wallet.destroy()
  })

  test('1 unencrypted Wallet', async () => {
    const originator = 'wallet-toolbox.tests'
    const setup = await createSetup(chain, options)
    const { wallet } = setup

    const basket = 'kvstoretest6'
    const kv = new LocalKVStore(wallet, basket, true, originator)

    const r1 = await kv.set('a', 'apple')
    expect(r1).toBeTruthy() // the outpoint of the new stored value
    const r1a = await kv.set('a', 'apple')
    expect(r1a).toBe(r1) // same value must return same outpoint
    const r2 = await kv.get('a')
    expect(r2).toBe('apple')
    const r3 = await kv.get('b', 'banana')
    expect(r3).toBe('banana')
    const r4 = await kv.remove('b')
    expect(r4.length).toBe(0)
    const r5 = await kv.remove('a')
    expect(r5.length).toBe(1)
    const lor = await wallet.listOutputs({ basket })
    expect(lor.totalOutputs).toBe(0)

    await wallet.destroy()
  })

  test('0a unencrypted WalletClient', async () => {
    const originator = 'wallet-toolbox.tests'
    const wallet = new WalletClient(undefined, originator)

    const basket = 'kvstoretest7'
    const kv = new LocalKVStore(wallet, basket, false, originator)

    const r1 = await kv.set('a', 'apple')
    expect(r1).toBeTruthy() // the outpoint of the new stored value
    const r1a = await kv.set('a', 'apple')
    expect(r1a).toBe(r1) // same value must return same outpoint
    const r2 = await kv.get('a')
    expect(r2).toBe('apple')
    const r3 = await kv.get('b', 'banana')
    expect(r3).toBe('banana')
    const r4 = await kv.remove('b')
    expect(r4.length).toBe(0)
    const r5 = await kv.remove('a')
    expect(r5.length).toBe(1)
    const lor = await wallet.listOutputs({ basket })
    expect(lor.totalOutputs).toBe(0)
  })

  test('1a unencrypted WalletClient', async () => {
    const originator = 'wallet-toolbox.tests'
    const wallet = new WalletClient(undefined, originator)

    const basket = 'kvstoretest8'
    const kv = new LocalKVStore(wallet, basket, true, originator)

    const r1 = await kv.set('a', 'apple')
    expect(r1).toBeTruthy() // the outpoint of the new stored value
    const r1a = await kv.set('a', 'apple')
    expect(r1a).toBe(r1) // same value must return same outpoint
    const r2 = await kv.get('a')
    expect(r2).toBe('apple')
    const r3 = await kv.get('b', 'banana')
    expect(r3).toBe('banana')
    const r4 = await kv.remove('b')
    expect(r4.length).toBe(0)
    const r5 = await kv.remove('a')
    expect(r5.length).toBe(1)
    const lor = await wallet.listOutputs({ basket })
    expect(lor.totalOutputs).toBe(0)
  })
})
