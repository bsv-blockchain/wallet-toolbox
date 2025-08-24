import { ListActionsArgs } from '@bsv/sdk'
import { sdk, StorageProvider } from '../../../src/index.client'
import { _tu, expectToThrowWERR, TestSetup1, TestWalletProviderNoSetup } from '../../utils/TestUtilsWalletStorage'
import path from 'path'

import 'fake-indexeddb/auto'

describe('listActions tests', () => {
  jest.setTimeout(99999999)

  const storages: StorageProvider[] = []
  const chain: sdk.Chain = 'test'
  const setups: { setup: TestSetup1; storage: StorageProvider }[] = []

  const env = _tu.getEnv('test')
  const ctxs: TestWalletProviderNoSetup[] = []
  const testName = () => expect.getState().currentTestName || 'test'
  const databaseName = path.parse(expect.getState().testPath!).name

  beforeAll(async () => {
    if (env.runMySQL) {
      ctxs.push(await _tu.createLegacyWalletMySQLCopy(databaseName))
    }
    ctxs.push(await _tu.createIdbLegacyWalletCopy(databaseName))
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy(databaseName))
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 invalid params', async () => {
    for (const { wallet } of ctxs) {
      const invalidArgs: ListActionsArgs[] = [
        { labels: ['toolong890'.repeat(31)] }
        // Oh so many things to test...
      ]

      for (const args of invalidArgs) {
        await expectToThrowWERR(sdk.WERR_INVALID_PARAMETER, () => wallet.listActions(args))
      }
    }
  })

  test('1 all actions', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeLabels: true,
          labels: []
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBe(191)
        expect(r.actions.length).toBe(10)
        let i = 0
        for (const a of r.actions) {
          expect(a.inputs).toBeUndefined()
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.labels)).toBe(true)
        }
      }
    }
  })

  test('2 non-existing label with any', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeLabels: true,
          labels: ['xyzzy'],
          labelQueryMode: 'any'
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBe(0)
        expect(r.actions.length).toBe(0)
      }
    }
  })

  test('3_label babbage_protocol_perm', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeLabels: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBeGreaterThanOrEqual(r.actions.length)
        expect(r.actions.length).toBe(args.limit || 10)
        let i = 0
        for (const a of r.actions) {
          expect(a.inputs).toBeUndefined()
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.labels)).toBe(true)
          expect(a.labels?.indexOf('babbage_protocol_perm')).toBeGreaterThan(-1)
        }
      }
    }
  })

  test('4_label babbage_protocol_perm', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeLabels: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBeGreaterThanOrEqual(r.actions.length)
        expect(r.actions.length).toBe(args.limit || 10)
        let i = 0
        for (const a of r.actions) {
          expect(a.inputs).toBeUndefined()
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.labels)).toBe(true)
          for (const label of args.labels) {
            expect(a.labels?.indexOf(label)).toBeGreaterThan(-1)
          }
        }
      }
    }
  })

  test('5_label babbage_protocol_perm or babbage_basket_access', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeLabels: true,
          labels: ['babbage_protocol_perm', 'babbage_basket_access']
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBeGreaterThanOrEqual(r.actions.length)
        expect(r.actions.length).toBe(args.limit || 10)
        let i = 0
        for (const a of r.actions) {
          expect(a.inputs).toBeUndefined()
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.labels)).toBe(true)
          let count = 0
          for (const label of args.labels) {
            if (a.labels!.indexOf(label) > -1) count++
          }
          expect(count).toBeGreaterThan(0)
        }
      }
    }
  })

  test('6_label babbage_protocol_perm and babbage_basket_access', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeLabels: true,
          labels: ['babbage_protocol_perm', 'babbage_basket_access'],
          labelQueryMode: 'all'
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBe(0)
      }
    }
  })

  test('7_includeOutputs', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeOutputs: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        expect(r.totalActions).toBeGreaterThanOrEqual(r.actions.length)
        expect(r.actions.length).toBe(args.limit || 10)
        let i = 0
        for (const a of r.actions) {
          expect(a.isOutgoing === true || a.isOutgoing === false).toBe(true)
          expect(a.inputs).toBeUndefined()
          expect(Array.isArray(a.outputs)).toBe(true)
          expect(a.labels).toBeUndefined()
          for (const o of a.outputs!) {
            expect(o.outputIndex).toBeGreaterThanOrEqual(0)
            expect(o.lockingScript).toBeUndefined()
          }
        }
      }
    }
  })

  test('8_includeOutputs and script', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeOutputs: true,
          includeOutputLockingScripts: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        let i = 0
        for (const a of r.actions) {
          for (const o of a.outputs!) {
            expect(o.lockingScript?.length).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  test('9_includeInputs', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeInputs: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        let i = 0
        for (const a of r.actions) {
          expect(a.isOutgoing === true || a.isOutgoing === false).toBe(true)
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.inputs)).toBe(true)
          expect(a.labels).toBeUndefined()
          for (const i of a.inputs!) {
            expect(i.sourceLockingScript).toBeUndefined()
            expect(i.unlockingScript).toBeUndefined()
          }
        }
      }
    }
  })

  test('10_includeInputs and unlock', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeInputs: true,
          includeInputUnlockingScripts: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        let i = 0
        for (const a of r.actions) {
          expect(a.isOutgoing === true || a.isOutgoing === false).toBe(true)
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.inputs)).toBe(true)
          expect(a.labels).toBeUndefined()
          for (const i of a.inputs!) {
            expect(i.sourceLockingScript).toBeUndefined()
            expect(i.unlockingScript?.length).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  test('11_includeInputs and lock', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListActionsArgs = {
          includeInputs: true,
          includeInputSourceLockingScripts: true,
          labels: ['babbage_protocol_perm']
        }
        const r = await wallet.listActions(args)
        let i = 0
        for (const a of r.actions) {
          expect(a.isOutgoing === true || a.isOutgoing === false).toBe(true)
          expect(a.outputs).toBeUndefined()
          expect(Array.isArray(a.inputs)).toBe(true)
          expect(a.labels).toBeUndefined()
          for (const i of a.inputs!) {
            expect(i.sourceLockingScript?.length).toBeGreaterThan(0)
            expect(i.unlockingScript).toBeUndefined()
          }
        }
      }
    }
  })
})
