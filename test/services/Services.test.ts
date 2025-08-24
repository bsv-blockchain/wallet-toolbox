import { Beef, Utils } from '@bsv/sdk'
import { sdk, Services, sha256Hash, wait } from '../../src/index.all'
import { _tu, TestSetup1Wallet } from '../utils/TestUtilsWalletStorage'

const includeTestChaintracks = false

describe('Wallet services tests', () => {
  jest.setTimeout(99999999)

  const ctxs: TestSetup1Wallet[] = []

  beforeAll(async () => {
    ctxs.push(
      await _tu.createSQLiteTestSetup1Wallet({
        databaseName: 'walletServicesMain',
        chain: 'main',
        rootKeyHex: '3'.repeat(64)
      })
    )
    if (includeTestChaintracks) {
      ctxs.push(
        await _tu.createSQLiteTestSetup1Wallet({
          databaseName: 'walletServicesTest',
          chain: 'test',
          rootKeyHex: '3'.repeat(64)
        })
      )
    }
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 getUtxoStatus', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const us = await wallet.services.getUtxoStatus(
          '4104eca750b68551fb5aa893acb428b6a7d2d673498fd055cf2a8d402211b9500bdc27936846c2aa45cf82afe2f566b69cd7f7298154b0ffb25fbfa4fef8986191c4ac',
          'script'
        )
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(true)
        } else {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        }
      }
    }
  })

  test('0a getUtxoStatus hashLE', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const script =
          '4104eca750b68551fb5aa893acb428b6a7d2d673498fd055cf2a8d402211b9500bdc27936846c2aa45cf82afe2f566b69cd7f7298154b0ffb25fbfa4fef8986191c4ac'
        const hash = Utils.toHex(sha256Hash(Utils.toArray(script, 'hex')))
        const us = await wallet.services.getUtxoStatus(
          hash
          // 'hashLE'
        )
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(true)
        } else {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        }
      }
    }
  })

  test('0b getUtxoStatus hashBE', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const script =
          '4104eca750b68551fb5aa893acb428b6a7d2d673498fd055cf2a8d402211b9500bdc27936846c2aa45cf82afe2f566b69cd7f7298154b0ffb25fbfa4fef8986191c4ac'
        const hash = Utils.toHex(sha256Hash(Utils.toArray(script, 'hex')).reverse())
        const us = await wallet.services.getUtxoStatus(hash, 'hashBE')
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(true)
        } else {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        }
      }
    }
  })

  test('0c getUtxoStatus hashOutputScript method', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const script =
          '4104eca750b68551fb5aa893acb428b6a7d2d673498fd055cf2a8d402211b9500bdc27936846c2aa45cf82afe2f566b69cd7f7298154b0ffb25fbfa4fef8986191c4ac'
        const hash = wallet.services.hashOutputScript(script)
        const us = await wallet.services.getUtxoStatus(hash)
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(true)
        } else {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        }
      }
    }
  })

  test('0d getUtxoStatus outpoint', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const script =
          '4104eca750b68551fb5aa893acb428b6a7d2d673498fd055cf2a8d402211b9500bdc27936846c2aa45cf82afe2f566b69cd7f7298154b0ffb25fbfa4fef8986191c4ac'
        const hash = wallet.services.hashOutputScript(script)
        const us = await wallet.services.getUtxoStatus(
          hash,
          undefined,
          'e4154d8ab6993addc9b8705318cc8e971dfc0780e233038ecf44c601229d93ce.0'
        )
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(true)
        } else {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        }
      }
    }
  })

  test('0e getUtxoStatus invalid outpoint', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const script =
          '4104eca750b68551fb5aa893acb428b6a7d2d673498fd055cf2a8d402211b9500bdc27936846c2aa45cf82afe2f566b69cd7f7298154b0ffb25fbfa4fef8986191c4ac'
        const hash = wallet.services.hashOutputScript(script)
        const us = await wallet.services.getUtxoStatus(
          hash,
          undefined,
          'e4154d8ab6993addc9b8705318cc8e971dfc0780e233038ecf44c601229d93ce.1'
        )
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        } else {
          expect(us.status).toBe('success')
          expect(us.isUtxo).toBe(false)
        }
      }
    }
  })

  // Underlying WoC service is rate limited
  test.skip('1 getBsvExchangeRate', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')

      {
        const usdPerBsv = await wallet.services.getBsvExchangeRate()
        expect(usdPerBsv).toBeGreaterThan(0) // and really so much more...
      }
    }
  })

  test('2 getFiatExchangeRate', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const eurPerUsd = await wallet.services.getFiatExchangeRate('EUR', 'USD')
        expect(eurPerUsd).toBeGreaterThan(0)
      }
    }
  })

  test('3 getChainTracker', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')

      {
        const chaintracker = await wallet.services.getChainTracker()
        const height = await chaintracker.currentHeight()
        expect(height).toBeGreaterThan(800000)
      }
    }
  })

  test('4 getMerklePath', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')

      {
        const mp = await wallet.services.getMerklePath(
          '9cce99686bc8621db439b7150dd5b3b269e4b0628fd75160222c417d6f2b95e4'
        )
        if (chain === 'main') expect(mp.merklePath?.blockHeight).toBe(877599)
        else expect(mp.merklePath).not.toBeTruthy()
      }

      await wait(3000)
    }
  })

  test('5 getRawTx', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        const rawTx = await wallet.services.getRawTx('9cce99686bc8621db439b7150dd5b3b269e4b0628fd75160222c417d6f2b95e4')
        if (chain === 'main') expect(rawTx.rawTx!.length).toBe(176)
        else expect(rawTx.rawTx).not.toBeTruthy()
      }
    }
  })

  test('6 getScriptHashHistory', async () => {
    for (const { chain, wallet, services } of ctxs) {
      if (!wallet.services || !services) throw new sdk.WERR_INTERNAL('test requires setup with services')
      {
        let hash = '86e41f4725135ca0db59d074e7d60daae7c1a87699013498bae52dc95cae1a52'
        hash = Utils.toHex(Utils.toArray(hash, 'hex').reverse())
        const us = await wallet.services.getScriptHashHistory(hash)
        if (chain === 'main') {
          expect(us.status).toBe('success')
          expect(us.history.length).toBeGreaterThan(0)
        } else {
          expect(us.status).toBe('success')
          expect(us.history.length).toBe(0)
        }
      }
    }
  })

  // This test is failing from cloud deploy but passes when run locally...
  test.skip('7 getStatusForTxids', async () => {
    for (const { chain, services } of ctxs) {
      {
        const txids = ['32c691a077b0ce46051aa7a45fa3b131c71ff85950264575a32171086b02ad98']
        const r = await services.getStatusForTxids(txids)
        expect(r.results.length).toBe(1)
        expect(r.results[0].txid).toBe(txids[0])
        expect(r.name).toBeTruthy()
        expect(r.status).toBe('success')
        expect(r.error).toBe(undefined)
        if (chain === 'main') {
          expect(r.results[0].status).toBe('mined')
          expect(r.results[0].depth).toBeGreaterThan(146)
        } else {
          expect(r.results[0].status).toBe('unknown')
          expect(r.results[0].depth).toBe(undefined)
        }
        await wait(3000)
      }
    }
  })
})
