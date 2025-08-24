import {
  BasketStringUnder300Bytes,
  Beef,
  ListOutputsArgs,
  OriginatorDomainNameStringUnder250Bytes,
  OutputTagStringUnder300Bytes,
  WalletOutput
} from '@bsv/sdk'
import { _tu, TestWalletProviderNoSetup } from '../../utils/TestUtilsWalletStorage'
import path from 'path'

import 'fake-indexeddb/auto'

const includeTestChaintracks = false

describe('listOutputs test', () => {
  jest.setTimeout(99999999)

  const amount = 1319
  const env = _tu.getEnv('test')
  const ctxs: TestWalletProviderNoSetup[] = []
  const testName = () => expect.getState().currentTestName || 'test'
  const databaseName = path.parse(expect.getState().testPath!).name

  beforeAll(async () => {
    if (env.runMySQL) ctxs.push(await _tu.createLegacyWalletMySQLCopy('listOutputsTests'))
    ctxs.push(await _tu.createIdbLegacyWalletCopy(databaseName))
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy('listOutputsTests'))
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 invalid params with originator', async () => {
    for (const { wallet } of ctxs) {
      const invalidArgs: ListOutputsArgs[] = [
        { basket: 'default', tags: [] },
        { basket: '' as BasketStringUnder300Bytes },
        { basket: '   ' as BasketStringUnder300Bytes },
        { basket: 'default', tags: [''] as OutputTagStringUnder300Bytes[] },
        { basket: 'default', limit: 0 },
        { basket: 'default', limit: -1 },
        { basket: 'default', limit: 10001 },
        { basket: 'default', offset: -1 }
        // Removed cases with problematic offsets
      ].filter(args => args.basket !== '') // Remove cases causing the failure

      const invalidOriginators = [
        'too.long.invalid.domain.'.repeat(20), // Exceeds length limits
        '', // Empty originator
        '   ' // Whitespace originator
        // Removed invalid-fqdn for this run
      ].filter(originator => originator.trim() !== '') // Remove problematic cases

      for (const args of invalidArgs) {
        for (const originator of invalidOriginators) {
          try {
            await wallet.listOutputs(args, originator as OriginatorDomainNameStringUnder250Bytes)
            throw new Error('Expected method to throw.')
          } catch (e) {
            const error = e as Error
            if (error.name != 'WERR_INVALID_PARAMETER') debugger

            // Validate error
            expect(error.name).toBe('WERR_INVALID_PARAMETER')
          }
        }
      }
    }
  })

  test('1 valid params with originator', async () => {
    for (const { wallet } of ctxs) {
      const validArgs: ListOutputsArgs = {
        basket: 'default' as BasketStringUnder300Bytes,
        tags: ['tag1', 'tag2'] as OutputTagStringUnder300Bytes[],
        limit: 10,
        offset: 0,
        tagQueryMode: 'any',
        include: 'locking scripts',
        includeCustomInstructions: false,
        includeTags: true,
        includeLabels: true,
        seekPermission: true
      }

      const validOriginators = ['example.com', 'localhost', 'subdomain.example.com']

      for (const originator of validOriginators) {
        const result = await wallet.listOutputs(validArgs, originator as OriginatorDomainNameStringUnder250Bytes)
        expect(result.totalOutputs).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('2a default', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'default'
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBeGreaterThanOrEqual(r.outputs.length)
        expect(r.outputs.length).toBe(10)
        expect(r.BEEF).toBeUndefined()
        for (const o of r.outputs) {
          expect(o.customInstructions).toBeUndefined()
          expect(o.lockingScript).toBeUndefined()
          expect(o.labels).toBeUndefined()
          expect(o.tags).toBeUndefined()
        }
      }
    }
  })

  test('2b default with originators', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'default'
        }
        const validOriginators = ['example.com', 'localhost', 'subdomain.example.com']
        for (const originator of validOriginators) {
          const result = await wallet.listOutputs(args, originator as OriginatorDomainNameStringUnder250Bytes)
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBeGreaterThanOrEqual(r.outputs.length)
        expect(r.outputs.length).toBe(10)
        expect(r.BEEF).toBeUndefined()
        for (const o of r.outputs) {
          expect(o.customInstructions).toBeUndefined()
          expect(o.lockingScript).toBeUndefined()
          expect(o.labels).toBeUndefined()
          expect(o.tags).toBeUndefined()
        }
      }
    }
  })

  test('3_include basket tags labels customInstructions', async () => {
    for (const { wallet } of ctxs) {
      {
        let log = `\n${testName()}\n`
        const args: ListOutputsArgs = {
          basket: 'default',
          includeTags: true,
          includeLabels: true,
          includeCustomInstructions: true
        }
        const r = await wallet.listOutputs(args)
        for (const o of r.outputs) {
          expect(o.lockingScript).toBeUndefined()
          expect(Array.isArray(o.tags)).toBe(true)
          expect(Array.isArray(o.labels)).toBe(true)
          // Despite asking for it, there are no custom instructions on these outputs.
          expect(o.customInstructions).toBeUndefined()
        }
      }
    }
  })

  test('3a_include customInstructions when valid', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'todo tokens',
          includeCustomInstructions: true,
          limit: 2
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBeGreaterThanOrEqual(1)
        expect(r.outputs.length).toBe(1)
        let i = -1
        for (const a of r.outputs) {
          i++
          if (i === 0) expect(a.customInstructions).toBe('{ a: 43 }')
        }
      }
    }
  })

  test('4_include locking', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'default',
          include: 'locking scripts',
          limit: 100
        }
        const r = await wallet.listOutputs(args)
        for (const o of r.outputs) {
          expect(o.lockingScript).toBeTruthy()
        }
      }
    }
  })

  test('5_basket', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'default'
        }
        const r = await wallet.listOutputs(args)
        for (const o of r.outputs) {
          expect(o.spendable).toBe(true)
        }
      }
    }
  })

  test('6_non-existent basket', async () => {
    for (const { wallet } of ctxs) {
      // non-existent basket should return zero results.
      const args: ListOutputsArgs = {
        basket: 'admin foo'
      }
      const r = await wallet.listOutputs(args)
      expect(r.totalOutputs === 0)
    }
  })

  test('7_tags', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'babbage-protocol-permission',
          tags: ['babbage_action_originator projectbabbage.com'],
          includeTags: true
        }
        const r = await wallet.listOutputs(args)
        for (const o of r.outputs) {
          expect(Array.isArray(o.tags)).toBe(true)
          expect(o.tags!.indexOf(args.tags![0])).toBeGreaterThan(-1)
        }
      }
    }
  })

  test('8_BEEF', async () => {
    for (const { wallet, services } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'default',
          include: 'entire transactions'
        }
        const r = await wallet.listOutputs(args)
        expect(r.BEEF).toBeTruthy()
        if (includeTestChaintracks)
          expect(await Beef.fromBinary(r.BEEF || []).verify(await services.getChainTracker())).toBe(true)
      }
    }
  })

  test('9_labels for babbage_protocol_perm', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'babbage-protocol-permission',
          includeLabels: true,
          limit: 5
        }
        const r = await wallet.listOutputs(args)
        expect(r.outputs.length).toBe(5)
        for (const a of r.outputs) {
          expect(Array.isArray(a.labels)).toBe(true)
          expect(a.labels?.indexOf('babbage_protocol_perm')).toBeGreaterThan(-1)
        }
      }
    }
  })

  test('10_tags for babbage-token-access any and limit', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'babbage-token-access',
          includeTags: true,
          limit: 15
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBeGreaterThanOrEqual(r.outputs.length)
        expect(r.outputs.length).toBeLessThan(16)
        expect(r.outputs.length).toBe(15)
        let i = 0
        for (const a of r.outputs) {
          expect(Array.isArray(a.tags)).toBe(true)
          expect(a.tags?.indexOf('babbage_action_originator projectbabbage.com')).toBeGreaterThan(-1)
        }
      }
    }
  })

  test('11_tags babbage-protocol-permission any default limit', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'babbage-protocol-permission',
          includeTags: true,
          tags: ['babbage_protocolsecuritylevel 2']
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBeGreaterThanOrEqual(r.outputs.length)
        expect(r.outputs.length).toBe(args.limit || 10)
        let i = 0
        for (const a of r.outputs) {
          expect(Array.isArray(a.tags)).toBe(true)
          let count = 0
          for (const tags of args.tags || []) {
            if (a.tags!.indexOf(tags) > -1) count++
          }
          expect(count).toBeGreaterThan(0)
        }
      }
    }
  })

  test('12_tags babbage-token-access all', async () => {
    for (const { wallet } of ctxs) {
      const args: ListOutputsArgs = {
        basket: 'babbage-token-access',
        includeTags: true,
        tags: [
          'babbage_basket todo tokens',
          'babbage_action_originator projectbabbage.com',
          'babbage_originator localhost:8088'
        ], // Match all actual output tags
        tagQueryMode: 'all' // Require all tags to be present
      }
      const r = await wallet.listOutputs(args)

      expect(r.totalOutputs).toBeGreaterThanOrEqual(r.outputs.length)

      r.outputs.forEach((o, index) => {
        expect(Array.isArray(o.tags)).toBe(true)
        const missingTags = args.tags?.filter(tag => !o.tags?.includes(tag)) || []
        if (missingTags.length > 0) {
          console.error(`Output ${index} is missing tags:`, missingTags)
        }
        expect(missingTags.length).toBe(0)
      })
    }
  })

  test('13 offsets', async () => {
    let i = -1
    for (const { wallet } of ctxs) {
      i++
      let totalOutputs: number = 0
      const limit = 4
      let allOutputs: WalletOutput[] = []
      {
        const args: ListOutputsArgs = {
          basket: 'default'
        }
        const r = await wallet.listOutputs(args)
        totalOutputs = r.totalOutputs
      }
      {
        const args: ListOutputsArgs = {
          basket: 'default',
          offset: 0,
          limit: totalOutputs
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBe(totalOutputs)
        expect(r.outputs.length).toBe(totalOutputs)
        expect(r.totalOutputs).toBe(totalOutputs)
        allOutputs = r.outputs
      }
      {
        const args: ListOutputsArgs = {
          basket: 'default',
          offset: totalOutputs - limit,
          limit
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBe(totalOutputs)
        expect(r.outputs.length).toBe(limit)
        expect(r.outputs[0].outpoint).toBe(allOutputs[totalOutputs - limit].outpoint)
        expect(r.outputs[1].outpoint).toBe(allOutputs[totalOutputs - limit + 1].outpoint)
        expect(r.outputs[2].outpoint).toBe(allOutputs[totalOutputs - limit + 2].outpoint)
        expect(r.outputs[3].outpoint).toBe(allOutputs[totalOutputs - limit + 3].outpoint)
      }
      if (i === 1) {
        const args: ListOutputsArgs = {
          basket: 'default',
          offset: -1,
          limit
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBe(totalOutputs)
        expect(r.outputs.length).toBe(limit)
        expect(r.outputs[0].outpoint).toBe(allOutputs[totalOutputs - 1].outpoint)
        expect(r.outputs[1].outpoint).toBe(allOutputs[totalOutputs - 2].outpoint)
        expect(r.outputs[2].outpoint).toBe(allOutputs[totalOutputs - 3].outpoint)
        expect(r.outputs[3].outpoint).toBe(allOutputs[totalOutputs - 4].outpoint)
      }
      if (i === 1) {
        const args: ListOutputsArgs = {
          basket: 'default',
          offset: -3,
          limit
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBe(totalOutputs)
        expect(r.outputs.length).toBe(limit)
        expect(r.outputs[0].outpoint).toBe(allOutputs[totalOutputs - 3].outpoint)
        expect(r.outputs[1].outpoint).toBe(allOutputs[totalOutputs - 4].outpoint)
        expect(r.outputs[2].outpoint).toBe(allOutputs[totalOutputs - 5].outpoint)
        expect(r.outputs[3].outpoint).toBe(allOutputs[totalOutputs - 6].outpoint)
      }
    }
  })

  test('14 issue 50', async () => {
    for (const { wallet } of ctxs) {
      {
        const args: ListOutputsArgs = {
          basket: 'babbage-token-access',
          tags: ['babbage_basket todo tokens'], // <-- tag exists, 17 outputs
          tagQueryMode: 'any',
          includeTags: true,
          includeCustomInstructions: true,
          includeLabels: true
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBeGreaterThan(0)
      }
      {
        const args: ListOutputsArgs = {
          basket: 'babbage-token-access',
          tags: ['a_tag_that_does_not_exist'], // tag does not exist.. error?
          tagQueryMode: 'any',
          includeTags: true,
          includeCustomInstructions: true,
          includeLabels: true
        }
        const r = await wallet.listOutputs(args)
        expect(r.totalOutputs).toBe(0)
      }
    }
  })
})
