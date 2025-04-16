import { EntitySyncState, sdk } from '../../../src'
import { _tu } from '../../utils/TestUtilsWalletStorage'
import { specOpInvalidChange } from '../../../src/sdk'
import { createOneSatTestOutput, createSetup, LocalWalletTestOptions } from '../../utils/localWalletMethods'

const chain: sdk.Chain = 'test'

const options: LocalWalletTestOptions = {
  setActiveClient: true,
  useMySQLConnectionForClient: true,
  useTestIdentityKey: true,
  useIdentityKey2: false
}

describe('localWallet tests', () => {
  jest.setTimeout(99999999)

  //  test('00', () => {})
  //  if (_tu.noTestEnv(chain)) return

  test('0 monitor runOnce', async () => {
    const setup = await createSetup(chain, options)
    const key = await setup.wallet.getPublicKey({ identityKey: true })
    expect(key.publicKey.toString()).toBe(setup.identityKey)
    await setup.monitor.runOnce()
    await setup.wallet.destroy()
  })

  test('2 create 1 sat delayed', async () => {
    const setup = await createSetup(chain, options)
    const car = await createOneSatTestOutput(setup, {}, 1)
    //await trackReqByTxid(setup, car.txid!)
    await setup.wallet.destroy()
  })

  test('2a create 1 sat immediate', async () => {
    const setup = await createSetup(chain, options)
    const car = await createOneSatTestOutput(setup, { acceptDelayedBroadcast: false }, 1)
    // await trackReqByTxid(setup, car.txid!)
    await setup.wallet.destroy()
  })

  test('2b create 2 nosend and sendWith', async () => {
    const setup = await createSetup(chain, options)
    const car = await createOneSatTestOutput(setup, { noSend: true }, 2)
    //await trackReqByTxid(setup, car.txid!)
    await setup.wallet.destroy()
  })

  test('3 return active to cloud client', async () => {
    const setup = await createSetup(chain, options)
    const localBalance = await setup.wallet.balance()
    const log = await setup.storage.setActive(setup.clientStorageIdentityKey!)
    console.log(log)
    console.log(`ACTIVE STORAGE: ${setup.storage.getActiveStoreName()}`)
    const clientBalance = await setup.wallet.balance()
    expect(localBalance).toBe(clientBalance)
    await setup.wallet.destroy()
  })

  test('4 review change utxos', async () => {
    const setup = await createSetup(chain, options)
    const lor = await setup.wallet.listOutputs({
      basket: specOpInvalidChange
    })
    if (lor.totalOutputs > 0) {
      debugger
      const lor = await setup.wallet.listOutputs({
        basket: specOpInvalidChange,
        tags: ['release']
      })
    }
    await setup.wallet.destroy()
  })

  test('5 review synchunk', async () => {
    const setup = await createSetup(chain, options)
    const identityKey = setup.identityKey
    const reader = setup.activeStorage
    const readerSettings = reader.getSettings()
    const writer = setup.storage._backups![0].storage
    const writerSettings = writer.getSettings()
    const ss = await EntitySyncState.fromStorage(writer, identityKey, readerSettings)
    const args = ss.makeRequestSyncChunkArgs(identityKey, writerSettings.storageIdentityKey)
    const chunk = await reader.getSyncChunk(args)
    await setup.wallet.destroy()
  })

  test('6 backup', async () => {
    const setup = await createSetup(chain, options)
    const log = await setup.storage.updateBackups()
    console.log(log)
    await setup.wallet.destroy()
  })
})
