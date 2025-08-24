import { PrivateKey } from '@bsv/sdk'
import { Setup } from '../../Setup'
import { SetupClient } from '../../SetupClient'
import { StorageIdb } from '../StorageIdb'
import { StorageProvider, StorageProviderOptions } from '../StorageProvider'
import 'fake-indexeddb/auto'

describe('StorageIdb tests', () => {
  jest.setTimeout(99999999)

  test('0', async () => {
    const options: StorageProviderOptions = StorageProvider.createStorageBaseOptions('main')
    const storage = new StorageIdb(options)
    const r = await storage.migrate('storageIdbTest', `42`.repeat(32))
    const db = storage.db!
    expect(db).toBeTruthy()
  })

  test.skip('1', async () => {
    // TODO: THIS TEST PASSES WHEN Describe is run alone, but fails to exit cleanly when run with `npm run test`
    if (Setup.noEnv('test')) return
    const env = Setup.getEnv('test')
    const wallet = await SetupClient.createWalletClientNoEnv({
      chain: env.chain,
      rootKeyHex: env.devKeys[env.identityKey]
    })
    const stores = wallet.storage.getStores()
    const options = StorageIdb.createStorageBaseOptions(wallet.chain)
    const store = new StorageIdb(options)
    await store.migrate(store.dbName, PrivateKey.fromRandom().toHex())
    await store.makeAvailable()
    await wallet.storage.addWalletStorageProvider(store)
    await wallet.storage.setActive(stores[0].storageIdentityKey, s => {
      console.log(s)
      return s
    })
    await wallet.storage.updateBackups(undefined, s => {
      console.log(s)
      return s
    })
    await wallet.destroy()
  })
})
