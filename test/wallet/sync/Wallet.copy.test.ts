import { Setup } from '../../../src'
import { _tu } from '../../utils/TestUtilsWalletStorage'

describe('Wallet copy tests', () => {
  jest.setTimeout(99999999)

  test('Backup examples DB 1', async () => {
    const env = Setup.getEnv('test')
    console.log('setup1.identityKey:', env.identityKey)
    const rootKeyHex = env.devKeys![env.identityKey]
    const ctx = await _tu.createTestWalletWithStorageClient({
      rootKeyHex
    })
    const { activeStorage: backup } = await _tu.createSQLiteTestWallet({
      databaseName: 'examplesBackup1'
    })
    ctx.storage.addWalletStorageProvider(backup)
    const { storage: storageManager } = ctx
    await storageManager.updateBackups()
    await backup.destroy()
    await ctx.wallet.destroy()
  }, 120000)

  test('TODOTONE Backup examples DB 2', async () => {
    const env = Setup.getEnv('test')
    console.log('setup2.identityKey:', env.identityKey2)
    const rootKeyHex = env.devKeys![env.identityKey2]
    const ctx = await _tu.createTestWalletWithStorageClient({
      rootKeyHex
    })

    console.log(
      `totalActions:${(await ctx.wallet.listActions({ labels: [] })).totalActions})`
    )

    const { activeStorage: backup } = await _tu.createSQLiteTestWallet({
      databaseName: 'examplesBackup2'
    })
    ctx.storage.addWalletStorageProvider(backup)
    const { storage: storageManager } = ctx
    await storageManager.updateBackups()
    await backup.destroy()
    await ctx.wallet.destroy()
  }, 120000)
})
