import { sdk, verifyOne } from '../../../src'
import { specOpInvalidChange, specOpSetWalletChangeParams, specOpThrowReviewActions, specOpWalletBalance } from '../../../src/sdk'
import { _tu, TestWalletNoSetup } from '../../utils/TestUtilsWalletStorage'

describe('specOps tests', () => {
  jest.setTimeout(99999999)

  test('00', () => {})
  if (_tu.noTestEnv('test')) return
  if (_tu.noTestEnv('main')) return

  test('0 wallet balance specOp', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.listOutputs({ basket: specOpWalletBalance })

    expect(r.totalOutputs > 0).toBe(true)
    expect(r.outputs.length === 0).toBe(true)

    await setup.wallet.destroy()
  })

  test('0a wallet balance method', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.balance()

    expect(r > 0).toBe(true)

    await setup.wallet.destroy()
  })

  test('0b wallet balanceAndUtxos method', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.balanceAndUtxos('default')

    expect(r.total > 0).toBe(true)
    expect(r.utxos.length === 0).toBe(true)

    await setup.wallet.destroy()
  })

  test('1 wallet invalid change outputs specOp', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.listOutputs({
      basket: specOpInvalidChange
      //tags: ['release', 'all']
    })

    expect(r.totalOutputs).toBe(0)
    expect(r.outputs.length).toBe(0)

    await setup.wallet.destroy()
  })

  test('1a wallet reviewSpendableOutputs method', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.reviewSpendableOutputs(false, false, {})

    expect(r.totalOutputs).toBe(0)
    expect(r.outputs.length).toBe(0)

    await setup.wallet.destroy()
  })

  test('2 update default basket params specOp', async () => {
    const setup = await createSetup('test')

    const before = verifyOne(
      await setup.activeStorage.findOutputBaskets({
        partial: { userId: setup.userId, name: 'default' }
      })
    )

    const r = await setup.wallet.listOutputs({
      basket: specOpSetWalletChangeParams,
      tags: ['33', '6']
    })

    const after = verifyOne(
      await setup.activeStorage.findOutputBaskets({
        partial: { userId: setup.userId, name: 'default' }
      })
    )

    expect(r.totalOutputs).toBe(0)
    expect(r.outputs.length).toBe(0)
    expect(after.minimumDesiredUTXOValue).toBe(6)
    expect(after.numberOfDesiredUTXOs).toBe(33)

    // Restore original values...
    await setup.wallet.listOutputs({
      basket: specOpSetWalletChangeParams,
      tags: [before.numberOfDesiredUTXOs.toString(), before.minimumDesiredUTXOValue.toString()]
    })

    await setup.wallet.destroy()
  })

  test('2a update default basket params specOp', async () => {
    const setup = await createSetup('test')

    const before = verifyOne(
      await setup.activeStorage.findOutputBaskets({
        partial: { userId: setup.userId, name: 'default' }
      })
    )

    await setup.wallet.setWalletChangeParams(33, 6)

    const after = verifyOne(
      await setup.activeStorage.findOutputBaskets({
        partial: { userId: setup.userId, name: 'default' }
      })
    )

    expect(after.minimumDesiredUTXOValue).toBe(6)
    expect(after.numberOfDesiredUTXOs).toBe(33)

    // Restore original values...
    await setup.wallet.setWalletChangeParams(before.numberOfDesiredUTXOs, before.minimumDesiredUTXOValue)

    await setup.wallet.destroy()
  })

  test('3 wallet listNoSendActions method', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.listNoSendActions({
      labels: [
        // 'abort'
      ]
    })

    expect(r.totalActions).toBeGreaterThanOrEqual(0)
    expect(r.actions.length).toBe(r.totalActions)

    await setup.wallet.destroy()
  })

  test('4 wallet listFailedActions method', async () => {
    const setup = await createSetup('test')

    const r = await setup.wallet.listFailedActions({
      labels: [
        // 'unfail'
      ],
      limit: 1000
    })

    expect(r.totalActions).toBeGreaterThanOrEqual(0)
    expect(r.actions.length).toBe(r.totalActions)

    await setup.wallet.destroy()
  })

  test('5 specOpThrowReviewActions', async () => {
    const setup = await createSetup('test')

    try {
      const r = await setup.wallet.createAction({
        labels: [
          specOpThrowReviewActions
        ],
        description: 'must throw'
      })
      expect(true).toBe(false)
    } catch (eu: unknown) {
      const e = sdk.WalletError.fromUnknown(eu) as sdk.WERR_REVIEW_ACTIONS
      expect(e.code).toBe('WERR_REVIEW_ACTIONS')
      expect(e.reviewActionResults).toBeTruthy()
    }

    await setup.wallet.destroy()
  })
})

async function createSetup(chain: sdk.Chain): Promise<TestWalletNoSetup> {
  const env = _tu.getEnv(chain)
  if (!env.testIdentityKey) throw new sdk.WERR_INVALID_PARAMETER('env.testIdentityKey', 'valid')
  if (!env.testFilePath) throw new sdk.WERR_INVALID_PARAMETER('env.testFilePath', 'valid')

  const setup = await _tu.createTestWallet({
    chain,
    rootKeyHex: env.devKeys[env.testIdentityKey],
    filePath: env.testFilePath,
    setActiveClient: false,
    addLocalBackup: false,
    useMySQLConnectionForClient: false
  })

  console.log(`ACTIVE STORAGE: ${setup.storage.getActiveStoreName()}`)

  return setup
}
