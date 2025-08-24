import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import {
  AtomicBEEF,
  Beef,
  CreateActionArgs,
  CreateActionResult,
  ListActionsResult,
  MerklePath,
  Transaction,
  TransactionInput,
  TransactionOutput,
  WalletActionInput,
  WalletActionOutput
} from '@bsv/sdk'
import { _tu, TestWalletNoSetup } from '../../utils/TestUtilsWalletStorage'

const includeTestChaintracks = false
const noLog = true
const logFilePath = path.resolve(__dirname, 'createAction2.test.ts')

function sanitizeTestName(testName: string): string {
  const cleanTestName = testName.replace(/[^a-zA-Z0-9_]/g, '_')
  return cleanTestName.startsWith('LOG_') ? cleanTestName : `LOG_${cleanTestName}`
}

describe('createAction2 nosend transactions', () => {
  jest.setTimeout(99999999)

  let ctxs: TestWalletNoSetup[] = []
  const env = _tu.getEnv('test')
  const testName = () => expect.getState().currentTestName ?? 'test'

  beforeEach(async () => {
    ctxs = []

    if (env.runMySQL) {
      ctxs.push(await _tu.createLegacyWalletMySQLCopy(testName()))
    }

    ctxs.push(await _tu.createLegacyWalletSQLiteCopy(testName()))
  })

  afterEach(async () => {
    for (const { wallet } of ctxs) await wallet.destroy()
  })

  test('1_transaction with single output checked using toLogString', async () => {
    for (const { wallet } of ctxs) {
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingLabel = 'funding transaction for createAction'
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            basket: 'funding basket',
            tags: ['funding transaction output', 'test tag'],
            satoshis: 3,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding Output'
          }
        ],
        labels: [
          fundingLabel,
          'this is an extra long test label that should be truncated at 80 chars when it is displayed'
        ],
        description: 'Funding transaction',
        options: { noSend: true, randomizeOutputs: false }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      const actionsResult = await wallet.listActions({
        labels: [fundingLabel],
        includeInputs: true,
        includeOutputs: true,
        includeInputSourceLockingScripts: true,
        includeInputUnlockingScripts: true,
        includeOutputLockingScripts: true,
        includeLabels: true
      })
      const rl1 = toLogString(fundingResult.tx!, actionsResult)
      expect(rl1.log).toBe(`transactions:3
  txid:30bdac0f5c6491f130820517802ff57e20e5a50c08b5c65e6976627fb82ae930 version:1 lockTime:0 sats:-4 status:nosend 
     outgoing:true desc:'Funding transaction' labels:['funding transaction for createaction','this is an extra long test 
     label that should be truncated at 80 chars when it is...']
  inputs: 1
    0: sourceTXID:a3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2 sats:913 
       lock:(50)76a914f7238871139f4926cbd592a03a737981e558245d88ac 
       unlock:(214)483045022100cfef1f6d781af99a1de14efd6f24f2a14234a26097012f27121eb36f4e330c1d0220... seq:4294967295
  outputs: 2
    0: sats:3 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true basket:'funding basket' 
       desc:'Funding Output' tags:['funding transaction output','test tag']
    1: sats:909 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`)
    }
  })

  test('2_transaction with multiple outputs checked using toLogString', async () => {
    for (const { wallet } of ctxs) {
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingLabel = 'funding transaction for createAction'
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            basket: 'funding basket',
            tags: ['funding transaction for createAction', 'test tag'],
            satoshis: 5,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding output'
          },
          {
            basket: 'extra basket',
            tags: ['extra transaction output', 'extra test tag'],
            satoshis: 6,
            lockingScript: '76a914fedcba9876543210fedcba9876543210fedcba88ac',
            outputDescription: 'Extra Output'
          }
        ],
        labels: [fundingLabel, 'this is the extra label'],
        description: 'Funding transaction with multiple outputs',
        options: { noSend: true, randomizeOutputs: false }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      const actionsResult = await wallet.listActions({
        labels: [fundingLabel],
        includeInputs: true,
        includeOutputs: true,
        includeInputSourceLockingScripts: true,
        includeInputUnlockingScripts: true,
        includeOutputLockingScripts: true,
        includeLabels: true
      })
      const rl1 = toLogString(fundingResult.tx!, actionsResult)
      expect(rl1.log).toBe(`transactions:3
  txid:b3848f2cabf5887ec679ca60347a29f6ecad425fda738700265c2f9d22c18ab5 version:1 lockTime:0 sats:-12 status:nosend 
     outgoing:true desc:'Funding transaction with multiple outputs' labels:['funding transaction for createaction','this 
     is the extra label']
  inputs: 1
    0: sourceTXID:a3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2 sats:913 
       lock:(50)76a914f7238871139f4926cbd592a03a737981e558245d88ac 
       unlock:(212)473044022079020cc8ea5ee6b3610806286e41567147d4b4b07d16bc1341311e00ce7647b0022034... seq:4294967295
  outputs: 3
    0: sats:5 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true basket:'funding basket' 
       desc:'Funding output' tags:['funding transaction for createaction','test tag']
    1: sats:6 lock:(48)76a914fedcba9876543210fedcba9876543210fedcba88ac index:1 spendable:true basket:'extra basket' 
       desc:'Extra Output' tags:['extra transaction output','extra test tag']
    2: sats:901 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:2 spendable:true basket:'default'`)
    }
  })

  test('3_transaction with explicit change check also uses toLogString on the spend', async () => {
    if (!includeTestChaintracks) return
    for (const { wallet } of ctxs) {
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            satoshis: 4,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding output'
          }
        ],
        description: 'Funding transaction',
        options: { noSend: true, randomizeOutputs: false }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      expect(fundingResult.noSendChange).toBeDefined()
      expect(fundingResult.noSendChange!.length).toBe(1)
      log(`noSendChange returned:${JSON.stringify(fundingResult.noSendChange, null, 2)}`)
      const outputSatoshis = 2
      const estimatedFee = 1
      const fundingBeef = Beef.fromBinary(fundingResult.tx!)
      expect(fundingBeef).toBeDefined()
      const spendingArgs: CreateActionArgs = {
        inputs: [
          {
            outpoint: `${fundingResult.txid}.0`,
            unlockingScript: '47304402207f2e9a',
            inputDescription: 'desc3'
          }
        ],
        inputBEEF: fundingBeef.toBinary(),
        outputs: [
          {
            satoshis: outputSatoshis,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'First spending Output for check on change '
          }
        ],
        labels: ['spending transaction test'],
        description: 'Explicit check on returned change',
        options: {
          knownTxids: [fundingResult.txid!],
          noSend: true,
          randomizeOutputs: false,
          noSendChange: []
        }
      }
      const spendingResult: CreateActionResult = await wallet.createAction(spendingArgs)
      expect(spendingResult.tx).toBeDefined()
      log(`Spending transaction created:${JSON.stringify(spendingResult, null, 2)}`)
      const spendingActionsResult = await wallet.listActions({
        labels: ['spending transaction test'],
        includeInputs: true,
        includeOutputs: true,
        includeInputSourceLockingScripts: true,
        includeInputUnlockingScripts: true,
        includeOutputLockingScripts: true,
        includeLabels: true
      })
      const totalInputSatoshis = spendingActionsResult.actions[0]?.inputs?.reduce(
        (sum, input) => sum + input.sourceSatoshis,
        0
      )
      const expectedChange = totalInputSatoshis! - outputSatoshis - estimatedFee
      const outputs = spendingActionsResult.actions[0]?.outputs || []
      const changeOutput = outputs.find(output => output.basket === 'default')
      expect(changeOutput!.satoshis).toBe(expectedChange)
      const actualFee = totalInputSatoshis! - outputSatoshis - expectedChange
      expect(actualFee).toBe(estimatedFee)
      const rl1 = toLogString(spendingResult.tx!, spendingActionsResult)
      expect(rl1.log).toBe(`transactions:5
  txid:afa6713aab0957cf5bb00dee532ad7b895e919a99564ec2016b51cb3d472d87f version:1 lockTime:0 sats:1 status:nosend 
     outgoing:true desc:'Explicit check on returned change' labels:['spending transaction test']
  inputs: 2
    0: sourceTXID:527ffe88f70d5b7de2b8b5ba9966b9c755e7da4de749d4fcd27140a03145a11d.0 sats:995 
       lock:(50)76a914ab2b66432503a3681fc5af1502207ca458c8752d88ac 
       unlock:(214)483045022100973a84555fa864e08313bda5c88e1991094db7b8d82586c899276155dabcbc9a0220... seq:4294967295
    1: sourceTXID:70afdc54187a1cdb8e35f7d00e5e111cbf5c43c4dc3f1da2cc44479133c75f9e.0 sats:4 desc:'Funding output' 
       lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac unlock:(16)47304402207f2e9a seq:4294967295
  outputs: 2
    0: sats:2 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true desc:'First spending 
       Output for check on change '
    1: sats:996 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`)
    }
  })

  test('4_transaction with custom options knownTxids and returnTXIDOnly false uses toLogString', async () => {
    for (const { wallet } of ctxs) {
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingOutputSatoshis = 4
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            satoshis: fundingOutputSatoshis,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding output'
          }
        ],
        description: 'Funding transaction',
        options: { noSend: true, randomizeOutputs: false }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      const spendingArgs: CreateActionArgs = {
        description: 'Check knownTxids and returnTXIDOnly',
        outputs: [
          {
            satoshis: 4,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'returnTXIDOnly false test'
          }
        ],
        labels: ['custom options test'],
        options: {
          knownTxids: ['tx123', 'tx456'],
          returnTXIDOnly: false,
          noSend: true,
          randomizeOutputs: false
        }
      }
      const spendingResult: CreateActionResult = await wallet.createAction(spendingArgs)
      expect(spendingArgs.options!.knownTxids).toEqual(expect.arrayContaining(['tx123', 'tx456']))
      const spendingActionsResult = await wallet.listActions({
        labels: ['custom options test'],
        includeInputs: true,
        includeOutputs: true,
        includeInputSourceLockingScripts: true,
        includeInputUnlockingScripts: true,
        includeOutputLockingScripts: true,
        includeLabels: true
      })
      const rl1 = toLogString(spendingResult.tx!, spendingActionsResult)
      expect(rl1.log).toBe(`transactions:2
  txid:38ded69627603b30bd1f55eb3f88098dbf74f2ef0ff5e3cfe6a34f97ce2db9c2 version:1 lockTime:0 sats:-5 status:nosend 
     outgoing:true desc:'Check knownTxids and returnTXIDOnly' labels:['custom options test']
  inputs: 1
    0: sourceTXID:527ffe88f70d5b7de2b8b5ba9966b9c755e7da4de749d4fcd27140a03145a11d.0 sats:995 
       lock:(50)76a914ab2b66432503a3681fc5af1502207ca458c8752d88ac 
       unlock:(212)4730440220113a6f72035a6ddcd6930db7e3f3d5c70486f9aaefb095e6fa3557afa916ec37022054... seq:4294967295
  outputs: 2
    0: sats:4 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true desc:'returnTXIDOnly 
       false test'
    1: sats:990 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`)
    }
  })

  test('5_transaction with custom options knownTxids and returnTXIDOnly true', async () => {
    for (const { wallet } of ctxs) {
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingOutputSatoshis = 4
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            satoshis: fundingOutputSatoshis,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding output'
          }
        ],
        description: 'Funding transaction',
        options: { noSend: true }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      const spendingArgs: CreateActionArgs = {
        description: 'Check knownTxids and returnTXIDOnly',
        outputs: [
          {
            satoshis: 4,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'returnTXIDOnly true test'
          }
        ],
        labels: ['custom options test'],
        options: {
          knownTxids: ['tx123', 'tx456'],
          returnTXIDOnly: true,
          noSend: true
        }
      }
      const spendingResult: CreateActionResult = await wallet.createAction(spendingArgs)
      expect(spendingResult.tx).not.toBeDefined()
      expect(spendingArgs.options!.knownTxids).toEqual(expect.arrayContaining(['tx123', 'tx456']))
    }
  })

  test('6_transaction with custom options knownTxids check returned BeefParty txids', async () => {
    for (const { wallet } of ctxs) {
      wallet.autoKnownTxids = true
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingOutputSatoshis = 4
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            satoshis: fundingOutputSatoshis,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding Output'
          }
        ],
        description: 'Funding transaction',
        options: { noSend: true }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      const spendingArgs: CreateActionArgs = {
        description: 'Check knownTxids txids',
        outputs: [
          {
            satoshis: 4,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Output for check txids'
          }
        ],
        labels: ['custom options test'],
        options: {
          knownTxids: ['tx123', 'tx456'],
          returnTXIDOnly: true,
          noSend: true
        }
      }
      const spendingResult: CreateActionResult = await wallet.createAction(spendingArgs)
      expect(spendingResult).toBeDefined()
      expect(spendingArgs.options!.knownTxids).toEqual(expect.arrayContaining(['tx123', 'tx456']))
      const fundingBeef = Beef.fromBinary(fundingResult.tx!)
      expect(fundingBeef).toBeDefined()
      const BeefPartyTxids = fundingBeef.txs.map(tx => tx.txid)
      const expectedTxids = ['tx123', 'tx456']
      if (spendingArgs.options?.knownTxids) {
        expect(spendingArgs.options!.knownTxids?.sort()).toEqual(expectedTxids.sort())
      }
    }
  })

  test('7_transaction with custom options knownTxids check returned BeefParty txids with additional spend', async () => {
    for (const { wallet } of ctxs) {
      wallet.autoKnownTxids = true
      wallet.randomVals = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const fundingOutputSatoshis = 4
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            satoshis: fundingOutputSatoshis,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding Output'
          }
        ],
        description: 'Funding transaction',
        options: { noSend: true }
      }
      const fundingResult: CreateActionResult = await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      const spendingArgs: CreateActionArgs = {
        description: 'Check knownTxids txids extra',
        outputs: [
          {
            satoshis: 4,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Output for check txids extra'
          }
        ],
        options: {
          knownTxids: ['tx123', 'tx456'],
          returnTXIDOnly: false,
          noSend: true
        }
      }
      const spendingResult: CreateActionResult = await wallet.createAction(spendingArgs)
      expect(spendingResult).toBeDefined()
      expect(spendingArgs.options!.knownTxids).toEqual(expect.arrayContaining(['tx123', 'tx456']))
      const fundingBeef = Beef.fromBinary(fundingResult.tx!)
      expect(fundingBeef).toBeDefined()
      const partyBeefTxids = fundingBeef.txs.map(tx => tx.txid)
      const expectedTxids = ['tx123', 'tx456']
      expect(spendingArgs.options!.knownTxids?.sort()).toEqual(expectedTxids.sort())
      const additionalSpendArgs: CreateActionArgs = {
        description: 'Extra spend transaction',
        outputs: [
          {
            satoshis: 4,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Extra spend output'
          }
        ],
        labels: ['extra spend test'],
        options: {
          knownTxids: spendingArgs.options!.knownTxids,
          returnTXIDOnly: true,
          noSend: true
        }
      }
      const additionalSpendResult: CreateActionResult = await wallet.createAction(additionalSpendArgs)
      expect(additionalSpendResult).toBeDefined()
      const finalBeef = Beef.fromBinary(spendingResult.tx!)
      expect(finalBeef).toBeDefined()
      const finalPartyBeefTxids = finalBeef.txs.map(tx => tx.txid)
      const finalExpectedTxids = [...expectedTxids]
      expect(additionalSpendArgs.options!.knownTxids?.sort()).toEqual(finalExpectedTxids.sort())
    }
  })

  /*  WIP

  test('8_no-send transaction with zero satoshis output', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        outputs: [
          {
            satoshis: 0,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Invalid output'
          }
        ],
        description: 'Valid transaction',
        options: {
          returnTXIDOnly: false,
          randomizeOutputs: false,
          noSend: true
        }
      }
      const result: CreateActionResult = await wallet.createAction(args)
      expect(result.tx).toBeDefined()
      expect(result.signableTransaction).toBeUndefined()
    }
  })

  test('9_no-send transaction without auth (should fail)', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        outputs: [
          {
            satoshis: 5,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Valid output'
          }
        ],
        description: 'Valid transaction',
        options: {
          returnTXIDOnly: false,
          randomizeOutputs: false,
          noSend: true
        }
      }
      await expect(wallet.createAction(args, undefined)).rejects.toThrow()
    }
  })

  test('10_no-send transaction with malformed args (invalid destination)', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        outputs: [
          {
            satoshis: 6,
            lockingScript: 'invalid_script',
            outputDescription: 'Valid output'
          }
        ],
        description: 'Valid transaction',
        options: {
          noSend: true
        }
      }
      await expect(wallet.createAction(args)).rejects.toThrow()
    }
  })

  test('11_transaction with OP_RETURN', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        outputs: [
          {
            satoshis: 0,
            lockingScript: '6a0c48656c6c6f20576f726c64',
            outputDescription: 'OP_RETURN data'
          }
        ],
        description: 'Transaction embedding OP_RETURN data',
        options: { noSend: true }
      }
      const result: CreateActionResult = await wallet.createAction(args)
      expect(result.tx).toBeDefined()
      expect(result.signableTransaction).toBeUndefined()
    }
  })

  test('12_high fee transaction', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        inputs: [
          {
            outpoint: 'tx4.0',
            unlockingScript: '47304402207f2e9a',
            inputDescription: 'desc4'
          }
        ],
        outputs: [
          {
            satoshis: 950,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Output D'
          }
        ],
        description:
          'Transaction that results in high fees (insufficient change)',
        options: { noSend: true }
      }
      await expect(wallet.createAction(args)).rejects.toThrow(
        /WERR_INSUFFICIENT_FUNDS/
      )
    }
  })

  test('13_zero fee transaction', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        inputs: [
          {
            outpoint: 'tx5.0',
            unlockingScript: '47304402207f2e9a',
            inputDescription: 'desc5'
          }
        ],
        outputs: [
          {
            satoshis: 500,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Output E'
          }
        ],
        description: 'Zero-fee transaction attempt',
        options: { noSend: true }
      }
      await expect(wallet.createAction(args)).rejects.toThrow(
        /WERR_INSUFFICIENT_FUNDS/
      )
    }
  })

  test('14_dust transaction', async () => {
    for (const { wallet, activeStorage: storage } of ctxs) {
      const args: CreateActionArgs = {
        outputs: [
          {
            satoshis: 1,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Dust output'
          }
        ],
        description: 'Transaction with dust output',
        options: { noSend: true }
      }
      await expect(wallet.createAction(args)).rejects.toThrow(
        /WERR_INVALID_PARAMETER/
      )
    }
  })
  */
})

// Helper functions

function getExpectedLog(testName: string, logFilePath: string): { log: string; logColor: string } | null {
  if (!fs.existsSync(logFilePath)) {
    return null
  }

  const fileContent = fs.readFileSync(logFilePath, 'utf8')
  const sanitizedTestName = sanitizeTestName(testName)

  // Use regex to extract the correct log constant
  const logRegex = new RegExp(
    `const\\s+${sanitizedTestName}\\s*=\\s*\\{\\s*log:\\s*['\`]([\\s\\S]*?)['\`]\\s*,\\s*logColor:\\s*['\`]([\\s\\S]*?)['\`]\\s*\\}`,
    'm'
  )
  const match = fileContent.match(logRegex)

  if (match) {
    return { log: match[1], logColor: match[2] }
  }
  return null
}

const normalizeVariableParts = (log: string): string => {
  return log
    .replace(/txid:[a-f0-9]{64}/g, 'txid:PLACEHOLDER') // Replace txids
    .replace(/unlock:\(\d+\)(?:483045022100[a-f0-9]{64}0220|[a-f0-9]+)/g, 'unlock:PLACEHOLDER')
    .replace(/lock:\(\d+\)76a914[a-f0-9]{40}/g, 'lock:PLACEHOLDER') // Replace locking script
    .replace(/index:\d+ spendable:/g, 'index:PLACEHOLDER spendable:') // Normalize index
    .trim()
}

/**
 * Appends logs as a constant to a test file.
 * @param {string} testName - The name of the test.
 * @param {{ log: string; logColor: string }} rl - The log data.
 */
function appendLogsAsConst(testName: string, rl: { log: string; logColor: string }) {
  const normalizedTestName = testName
    .replace(/[^a-zA-Z0-9_ ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
  const sanitizedTestName = sanitizeTestName(normalizedTestName)
  const logFilePath = path.resolve(__dirname, 'createAction2.man.test.ts')
  const logConst = `
// Auto-generated test log - ${new Date().toISOString()}
const ${sanitizedTestName} = {
  log: \`${rl.log}\`,
  logColor: \`${rl.logColor}\`
};
  `.trim()

  fs.appendFileSync(logFilePath, `\n${logConst}\n`, 'utf8')
}

/**
 * Truncates a string to a maximum length of 80 characters.
 * @param {string} s - The string to truncate.
 * @returns {string} - The truncated string.
 */ const truncate = (s: string) => (s.length > 80 ? s.slice(0, 80) + '...' : s)

/**
 * Formats an optional field if it has a defined value.
 * @param {string} fieldName - The name of the field.
 * @param {any} value - The value of the field.
 * @returns {string} - The formatted field string.
 */
const formatOptionalField = (fieldName: string, value: any) =>
  value !== undefined && value !== null && value !== '' ? ` ${fieldName}:${value}` : ''

/**
 * Formats an optional field with quotes if it has a defined value.
 * @param {string} fieldName - The name of the field.
 * @param {any} value - The value of the field.
 * @returns {string} - The formatted field string with quotes.
 */
const formatOptionalFieldWithQuotes = (fieldName: string, value: any) =>
  value !== undefined && value !== null && value !== '' ? ` ${fieldName}:'${value}'` : ''

/**
 * Formats an optional field with color if it has a defined value.
 * @param {string} fieldName - The name of the field.
 * @param {any} value - The value of the field.
 * @param {(val: string) => string} colorFunc - The function to apply color formatting.
 * @returns {string} - The formatted field string with color.
 */
const formatOptionalFieldWithColor = (fieldName: string, value: any, colorFunc: (val: string) => string) =>
  value !== undefined && value !== null && value !== ''
    ? ` ${chalk.gray(fieldName + ':')}${colorFunc(typeof value === 'string' ? value : String(value))}`
    : ''

/**
 * Formats metadata if present.
 * @param {any} metadata - The metadata object.
 * @returns {string} - The formatted metadata string.
 */
const formatMetadata = (metadata?: any) =>
  metadata && !isEmptyObject(metadata) ? `metadata:${JSON.stringify(metadata)}` : ''

/**
 * Formats the Merkle path if present.
 * @param {MerklePath | string} [merklePath] - The Merkle path.
 * @returns {string} - The formatted Merkle path string.
 */
const formatMerklePath = (merklePath?: MerklePath | string) => (merklePath ? `merklePath:${String(merklePath)}` : '')

const MAX_LOG_LINE_LENGTH = 120 // Define in the test

/**
 * Wraps a log line to a specified max length.
 * @param {string} text - The text to wrap.
 * @param {number} indent - The indentation level.
 * @param {number} [maxLength=120] - The maximum length of a line.
 * @returns {string} - The wrapped log line.
 */
const wrapLogLine = (text: string, indent: number, maxLength: number = 120): string => {
  const words = text.trim().split(' ')
  let wrappedText = '  '.repeat(indent)
  let currentLineLength = indent * 2

  for (const word of words) {
    if (currentLineLength + word.length + 1 > maxLength) {
      wrappedText += '\n' + '  '.repeat(indent) + '   ' + word + ' '
      currentLineLength = indent * 2 + word.length + 1
    } else {
      wrappedText += word + ' '
      currentLineLength += word.length + 1
    }
  }

  return wrappedText.trimEnd()
}

/**
 * Formats an indented line.
 * @param {number} indent - The indentation level.
 * @param {string} content - The content of the line.
 * @returns {string} - The formatted indented line.
 */
const formatIndentedLineWithWrap = (indent: number, content: string, maxLength: number = 120) =>
  wrapLogLine(content.trim(), indent, maxLength)

/**
 * Formats a list of wallet action inputs for logging.
 * @param {WalletActionInput[]} [inputs] - The list of wallet action inputs.
 * @returns {{ log: string; logColor: string }[]} - An array of formatted log strings and their colorized versions.
 */
const formatInputs = (inputs: WalletActionInput[]) =>
  inputs && inputs.length > 0
    ? inputs
        .sort((a, b) => a.sourceOutpoint.localeCompare(b.sourceOutpoint))
        .map((input, i) => {
          let line = `${i}: sourceTXID:${input.sourceOutpoint} sats:${input.sourceSatoshis}`
          let color = `${chalk.gray(`${i}:`)} ${chalk.blue(input.sourceOutpoint)} ${chalk.green(`${input.sourceSatoshis} sats`)}`

          line += formatOptionalFieldWithQuotes('desc', input.inputDescription)
          color += formatOptionalFieldWithColor('desc', input.inputDescription, chalk.white)

          if (input.sourceLockingScript) {
            line += ` lock:(${input.sourceLockingScript.length})${truncate(input.sourceLockingScript)}`
            color += ` ${chalk.gray('lock:')}(${input.sourceLockingScript.length})${chalk.cyan(truncate(input.sourceLockingScript))}`
          }

          if (input.unlockingScript) {
            line += ` unlock:(${input.unlockingScript.length})${truncate(input.unlockingScript)}`
            color += ` ${chalk.gray('unlock:')}(${input.unlockingScript.length})${chalk.cyan(truncate(input.unlockingScript))}`
          }

          line += ` seq:${input.sequenceNumber}`
          color += ` ${chalk.gray('seq:')}${input.sequenceNumber}`

          return {
            log: formatIndentedLineWithWrap(2, line),
            logColor: formatIndentedLineWithWrap(2, color)
          }
        })
    : [
        {
          log: formatIndentedLineWithWrap(2, 'No inputs'),
          logColor: formatIndentedLineWithWrap(2, chalk.gray('No inputs'))
        }
      ]

/**
 * Formats a list of wallet action outputs for logging.
 * @param {WalletActionOutput[]} [outputs] - The list of wallet action outputs.
 * @returns {{ log: string; logColor: string }[]} - An array of formatted log strings and their colorized versions.
 */
const formatOutputs = (outputs: WalletActionOutput[]) =>
  outputs && outputs.length > 0
    ? outputs
        .sort((a, b) => a.satoshis - b.satoshis)
        .map((output, i) => {
          let line = `${i}: sats:${output.satoshis} lock:(${output.lockingScript?.length || ''})${truncate(output.lockingScript!) ?? 'N/A'}`
          let color = `${chalk.gray(`${i}:`)} ${chalk.green(`${output.satoshis} sats`)} ${chalk.gray('lock:')}(${output.lockingScript?.length || ''})${chalk.cyan(truncate(output.lockingScript!) ?? 'N/A')}`

          line += formatOptionalField('index', output.outputIndex)
          color += formatOptionalFieldWithColor('index', output.outputIndex, chalk.white)

          line += formatOptionalField('spendable', output.spendable)
          color += formatOptionalFieldWithColor('spendable', output.spendable, chalk.white)

          line += formatOptionalFieldWithQuotes('custinst', output.customInstructions)
          color += formatOptionalFieldWithColor('custinst', output.customInstructions, chalk.white)

          line += formatOptionalFieldWithQuotes('basket', output.basket)
          color += formatOptionalFieldWithColor('basket', output.basket, chalk.white)

          line += formatOptionalFieldWithQuotes('desc', output.outputDescription)
          color += formatOptionalFieldWithColor('desc', output.outputDescription, chalk.white)

          if (output.tags?.length) {
            const tagsString = `[${output.tags.map(tag => `'${truncate(tag)}'`).join(',')}]`
            line += ` tags:${tagsString}`
            color += ` ${chalk.gray('tags:')}${chalk.white(tagsString)}`
          }

          return {
            log: formatIndentedLineWithWrap(2, line),
            logColor: formatIndentedLineWithWrap(2, color)
          }
        })
    : [
        {
          log: formatIndentedLineWithWrap(2, 'No outputs'),
          logColor: formatIndentedLineWithWrap(2, chalk.gray('No outputs'))
        }
      ]

/**
 * Formats a list of labels into a string representation.
 * @param {string[]} [labels] - The list of labels.
 * @returns {string} - A formatted string of labels enclosed in brackets.
 */
const formatLabels = (labels?: string[]) =>
  labels && labels.length > 0 ? `[${labels.map(label => `'${truncate(label)}'`).join(',')}]` : ''

/**
 * Generates a formatted log string from an AtomicBEEF object.
 * @param {AtomicBEEF} atomicBeef - The AtomicBEEF object containing transaction data.
 * @param {ListActionsResult} [actionsResult] - The result of listing actions, used for additional transaction metadata.
 * @param {boolean} [showKey=true] - Whether to display key transaction details.
 * @returns {Promise<{ log: string; logColor: string }>} - An object containing the formatted log string and a colorized version.
 */
export function toLogString(
  atomicBeef: AtomicBEEF,
  actionsResult?: ListActionsResult,
  showKey: boolean = true
): { log: string; logColor: string } {
  const BEEF_V1 = 4022206465

  try {
    const beef = Beef.fromBinary(atomicBeef)
    beef.version = BEEF_V1

    let log = `transactions:${beef.txs.length}`
    let logColor = chalk.gray(`transactions:${beef.txs.length}`)

    if (showKey) {
      logColor += ` ${chalk.gray(`key:`)} (${chalk.blue('txid/outpoint')} ${chalk.cyan('script')} ${chalk.green('sats')})`
    }

    const mainTxid = beef.txs.slice(-1)[0].txid
    const mainTx: Transaction = beef.findAtomicTransaction(mainTxid)!

    const action = actionsResult?.actions.find(a => a.txid === mainTxid)

    const labelString = formatLabels(action?.labels)
    const metadataString = formatMetadata(mainTx.metadata)
    const merklePathString = formatMerklePath(mainTx.merklePath)

    log += `\n${formatIndentedLineWithWrap(1, `txid:${mainTxid} version:${mainTx.version} lockTime:${mainTx.lockTime}${formatOptionalField('sats', action?.satoshis)}${formatOptionalField('status', action?.status)}${formatOptionalField('outgoing', action?.isOutgoing)}${formatOptionalFieldWithQuotes('desc', action?.description)}${metadataString}${merklePathString} labels:${labelString}`)}`
    logColor += `\n${formatIndentedLineWithWrap(
      1,
      [
        chalk.blue(mainTxid),
        ` ${chalk.gray('version:')}${mainTx.version}`,
        ` ${chalk.gray('lockTime:')}${mainTx.lockTime}`,
        ` ${chalk.green(`${action?.satoshis} sats`)}`,
        formatOptionalFieldWithColor('status', action?.status, chalk.white),
        formatOptionalFieldWithColor('outgoing', action?.isOutgoing, chalk.white),
        formatOptionalFieldWithColor('desc', action?.description, chalk.white),
        metadataString ? chalk.gray(metadataString) : '',
        merklePathString ? chalk.gray(merklePathString) : '',
        ` ${chalk.gray('labels:')}${chalk.white(labelString)}`
      ]
        .filter(Boolean)
        .join('')
    )}`

    log += `\n${formatIndentedLine(1, `inputs: ${action?.inputs?.length ?? 0}`)}`
    logColor += `\n${formatIndentedLine(1, chalk.gray(`inputs: ${action?.inputs?.length ?? 0}`))}`

    const sortedInputs = (action?.inputs ?? []).sort((a, b) => a.sourceOutpoint.localeCompare(b.sourceOutpoint))
    const formattedInputs = formatInputs(sortedInputs)
    formattedInputs.forEach(({ log: inputLog, logColor: inputLogColor }) => {
      log += `\n${formatIndentedLine(2, inputLog)}`
      logColor += `\n${formatIndentedLine(2, inputLogColor)}`
    })

    log += `\n${formatIndentedLineWithWrap(1, `outputs: ${action?.outputs?.length ?? 0}`)}`
    logColor += `\n${formatIndentedLineWithWrap(1, chalk.gray(`outputs: ${action?.outputs?.length ?? 0}`))}`

    const sortedOutputs = action?.outputs?.slice().sort((a, b) => a.satoshis - b.satoshis)
    const formattedOutputs = formatOutputs(sortedOutputs!)
    formattedOutputs.forEach(({ log: outputLog, logColor: outputLogColor }) => {
      log += `\n${formatIndentedLine(2, outputLog)}`
      logColor += `\n${formatIndentedLine(2, outputLogColor)}`
    })

    return { log, logColor }
  } catch (error) {
    return {
      log: `Error parsing transaction: ${(error as Error).message}`,
      logColor: chalk.red(`Error parsing transaction: ${(error as Error).message}`)
    }
  }
}

export function createActionResultToTxLogString(
  createActionResult: CreateActionResult,
  actionsResult?: ListActionsResult,
  showKey: boolean = false
): { log: string; logColor: string } {
  const BEEF_V1 = 4022206465

  const beef = Beef.fromBinary(createActionResult?.tx!)
  beef.version = BEEF_V1
  const mainTxid = beef.txs.slice(-1)[0].txid

  return txToLogString(beef.findAtomicTransaction(mainTxid)!, 0, showKey, actionsResult)
}

const MAX_RECURSION_DEPTH = 3

/**
 * Truncates a TXID, replacing the middle 48 characters with '...'.
 * @param {string} txid - The original transaction ID.
 * @returns {string} - The truncated TXID.
 */
const truncateTxid = (txid: string): string => {
  if (txid.length <= 64) {
    return txid.slice(0, 8) + '...' + txid.slice(-8)
  }
  return txid
}

/**
 * Formats a list of transaction outputs for logging.
 * @param {TransactionOutput[]} [outputs] - The list of transaction outputs.
 * @param {number} indent - The current indentation level.
 * @returns {{ log: string; logColor: string }[]} - A formatted log string array.
 */
const formatTxOutputs = (outputs: TransactionOutput[], indent: number) =>
  outputs && outputs.length > 0
    ? outputs
        .sort((a, b) => a.satoshis! - b.satoshis!)
        .map((output, i) => {
          let line = formatIndentedLine(
            indent + 4,
            `${i}: lock:(${output.lockingScript.toHex().length || ''})${truncate(output.lockingScript.toHex())}`
          )
          let color = formatIndentedLine(
            indent + 4,
            `${chalk.gray(`${i}:`)} ${chalk.gray('lock:')}(${output.lockingScript.toHex().length || ''})${chalk.cyan(truncate(output.lockingScript.toHex()))}`
          )

          if (output.satoshis) {
            line += ` sats:${output.satoshis}`
            color += ` ${chalk.green(`${output.satoshis} sats`)}`
          }

          return { log: line, logColor: color }
        })
    : [
        {
          log: formatIndentedLine(indent + 4, 'No outputs'),
          logColor: formatIndentedLine(indent + 4, chalk.gray('No outputs'))
        }
      ]

/**
 * Formats transaction inputs with proper indentation.
 * @param {TransactionInput[]} inputs - The list of transaction inputs.
 * @param {number} indent - The current indentation level.
 * @returns {{ log: string; logColor: string }[]} - A formatted log string array.
 */
const formatTxInputs = (inputs: TransactionInput[], indent: number) =>
  inputs && inputs.length > 0
    ? inputs
        .sort((a, b) => a.sourceTXID!.localeCompare(b.sourceTXID!))
        .map((input, i) => {
          let line = formatIndentedLine(
            indent + 4,
            `${i}: sourceTXID:${truncateTxid(input.sourceTXID!)}.${input.sourceOutputIndex}`
          )
          let color = formatIndentedLine(
            indent + 4,
            `${chalk.gray(`${i}:`)} ${chalk.blue(truncateTxid(input.sourceTXID!))}.${chalk.blue(input.sourceOutputIndex)}`
          )

          if (input.unlockingScript) {
            line += `\n${formatIndentedLine(indent + 6, `unlock:(${input.unlockingScript.toHex().length})${truncate(input.unlockingScript.toHex())}`)}`
            color += `\n${formatIndentedLine(indent + 6, `${chalk.gray('unlock:')}(${input.unlockingScript.toHex().length})${chalk.cyan(truncate(input.unlockingScript.toHex()))}`)}`
          }

          if (input.sequence) {
            line += `\n${formatIndentedLine(indent + 6, `seq:${input.sequence}`)}`
            color += `\n${formatIndentedLine(indent + 6, `${chalk.gray('seq:')}${input.sequence}`)}`
          }

          if (input.sourceTransaction) {
            const { log: sourceTxLog, logColor: sourceTxLogColor } = txToLogString(input.sourceTransaction, indent + 6)
            const sourceTxLogTrimed = sourceTxLog.replace(/\s+Transaction/, 'Transaction')
            const sourceTxLogColorTrimed = sourceTxLogColor.replace(/\s+Transaction/, 'Transaction')
            line += `\n${formatIndentedLine(indent + 6, `sourceTx:`)}${sourceTxLogTrimed}`
            color += `\n${formatIndentedLine(indent + 6, `${chalk.gray('sourceTx:')}`)}${sourceTxLogColorTrimed}`
          } else {
            line += `\n${formatIndentedLine(indent + 6, `sourceTx:Transaction [Max Depth Reached]`)}`
            color += `\n${formatIndentedLine(indent + 6, chalk.gray(`sourceTx:Transaction [Max Depth Reached]`))}`
          }

          return { log: line, logColor: color }
        })
    : [
        {
          log: formatIndentedLine(indent + 4, 'No inputs'),
          logColor: formatIndentedLine(indent + 4, chalk.gray('No inputs'))
        }
      ]

/**
 * Generates a formatted log string from a Transaction object.
 * Ensures proper indentation and prevents recursion errors.
 * @param {Transaction} tx - The Transaction object containing transaction data.
 * @param {number} indent - The current indentation level.
 * @param {boolean} [showKey=true] - Whether to display key transaction details.
 * @param {ListActionsResult} [actionsResult] - The result of listing actions.
 * @returns {{ log: string; logColor: string }} - A formatted log string and colorized version.
 */
export function txToLogString(
  tx: Transaction,
  indent: number = 0,
  showKey: boolean = false,
  actionsResult?: ListActionsResult
): { log: string; logColor: string } {
  try {
    if (indent / 2 >= MAX_RECURSION_DEPTH) {
      return {
        log: formatIndentedLine(indent + 4, 'Transaction [Max Depth Reached]'),
        logColor: chalk.gray(formatIndentedLine(indent + 4, 'Transaction [Max Depth Reached]'))
      }
    }
    const beef = Beef.fromBinary(tx.toBEEF())
    const mainTxid = beef.txs.slice(-1)[0].txid
    const metadataString = formatMetadata(tx.metadata)
    const merklePathString = formatMerklePath(tx.merklePath)
    let log = formatIndentedLine(indent, `Transaction:${truncateTxid(mainTxid)}`)
    let logColor = formatIndentedLine(indent, `${chalk.gray('Transaction:')}${chalk.blue(truncateTxid(mainTxid))}`)

    if (showKey) {
      logColor += ` ${chalk.gray(`key:`)} (${chalk.blue('txid/outpoint')} ${chalk.cyan('script')} ${chalk.green('sats')})`
    }

    log += `\n${formatIndentedLine(indent + 2, `version:${tx.version} lockTime:${tx.lockTime}${metadataString}${merklePathString}`)}`
    logColor += `\n${formatIndentedLine(
      indent + 2,
      `${chalk.gray('version:')}${chalk.white(tx.version)} ${chalk.gray('lockTime:')}${chalk.white(tx.lockTime)}` +
        (metadataString ? chalk.gray(metadataString) : '') +
        (merklePathString ? chalk.gray(merklePathString) : '')
    )}`

    log += `\n${formatIndentedLine(indent + 2, `inputs: ${tx?.inputs?.length ?? 0}`)}`
    logColor += `\n${formatIndentedLine(indent + 2, chalk.gray(`inputs: ${tx?.inputs?.length ?? 0}`))}`

    const sortedInputs = (tx?.inputs ?? []).sort((a, b) => a.sourceTXID!.localeCompare(b.sourceTXID!))
    const formattedInputs = formatTxInputs(sortedInputs, indent)
    formattedInputs.forEach(({ log: inputLog, logColor: inputLogColor }) => {
      log += `\n${inputLog}`
      logColor += `\n${inputLogColor}`
    })

    log += `\n${formatIndentedLine(indent + 2, `outputs: ${tx?.outputs?.length ?? 0}`)}`
    logColor += `\n${formatIndentedLine(indent + 2, chalk.gray(`outputs: ${tx?.outputs?.length ?? 0}`))}`

    const sortedOutputs = tx?.outputs?.slice().sort((a, b) => a.satoshis! - b.satoshis!)
    const formattedTxOutputs = formatTxOutputs(sortedOutputs, indent)
    formattedTxOutputs.forEach(({ log: outputLog, logColor: outputLogColor }) => {
      log += `\n${outputLog}`
      logColor += `\n${outputLogColor}`
    })

    return { log, logColor }
  } catch (error) {
    return {
      log: `Error parsing transaction: ${(error as Error).message}`,
      logColor: chalk.red(`Error parsing transaction: ${(error as Error).message}`)
    }
  }
}

/**
 * Checks if an object is empty.
 * @param {unknown} obj - The object to check.
 * @returns {boolean} - Returns true if the object is empty, otherwise false.
 */
export const isEmptyObject = (obj: unknown): boolean => {
  return !!obj && typeof obj === 'object' && Object.keys(obj).length === 0
}

const formatIndentedLine = (indent: number, content: string) => ' '.repeat(indent * 2) + content.trim() // Trim ensures no accidental double spacing

function log(s: string) {
  if (!noLog) console.log(s)
  //if (!noLog) process.stdout.write(s)
}

function logWarn(s: string) {
  process.stdout.write(chalk.yellowBright(s))
}

export function numberArrayToHexString(numbers: number[]): string {
  return numbers.map(num => num.toString(16).padStart(2, '0')).join('')
}

/***Use these to generate the log string ***/
//const testName = expect.getState().currentTestName ?? 'Unknown_Test'
//appendLogsAsConst(testName, rl1)

// Auto-generated test log - 2025-02-05T13:04:29.906Z
const LOG_createAction_nosend_transactions_1_transaction_with_single_output_checked_using_toLogString = {
  log: `transactions:3
  txid:30bdac0f5c6491f130820517802ff57e20e5a50c08b5c65e6976627fb82ae930 version:1 lockTime:0 sats:-4 status:nosend 
     outgoing:true desc:'Funding transaction' labels:['funding transaction for createaction','this is an extra long test 
     label that should be truncated at 80 chars when it is...']
  inputs: 1
    0: sourceTXID:a3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2 sats:913 
       lock:(50)76a914f7238871139f4926cbd592a03a737981e558245d88ac 
       unlock:(214)483045022100cfef1f6d781af99a1de14efd6f24f2a14234a26097012f27121eb36f4e330c1d0220... seq:4294967295
  outputs: 2
    0: sats:3 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true basket:'funding basket' 
       desc:'Funding Output' tags:['funding transaction output','test tag']
    1: sats:909 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`,
  logColor: `[90mtransactions:3[39m [90mkey:[39m ([34mtxid/outpoint[39m [36mscript[39m [32msats[39m)
  [34m30bdac0f5c6491f130820517802ff57e20e5a50c08b5c65e6976627fb82ae930[39m [90mversion:[39m1 [90mlockTime:[39m0 
     [32m-4 sats[39m [90mstatus:[39m[37mnosend[39m [90moutgoing:[39m[37mtrue[39m [90mdesc:[39m[37mFunding 
     transaction[39m [90mlabels:[39m[37m['funding transaction for createaction','this is an extra long test label that 
     should be truncated at 80 chars when it is...'][39m
  [90minputs: 1[39m
    [90m0:[39m [34ma3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2[39m [32m913 sats[39m 
       [90mlock:[39m(50)[36m76a914f7238871139f4926cbd592a03a737981e558245d88ac[39m 
       [90munlock:[39m(214)[36m483045022100cfef1f6d781af99a1de14efd6f24f2a14234a26097012f27121eb36f4e330c1d0220...[39m 
       [90mseq:[39m4294967295
  [90moutputs: 2[39m
    [90m0:[39m [32m3 sats[39m [90mlock:[39m(48)[36m76a914abcdef0123456789abcdef0123456789abcdef88ac[39m 
       [90mindex:[39m[37m0[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mfunding basket[39m 
       [90mdesc:[39m[37mFunding Output[39m [90mtags:[39m[37m['funding transaction output','test tag'][39m
    [90m1:[39m [32m909 sats[39m [90mlock:[39m(50)[36m76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac[39m 
       [90mindex:[39m[37m1[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mdefault[39m`
}

// Auto-generated test log - 2025-02-05T13:46:12.091Z
const LOG_createAction_nosend_transactions_2_transaction_with_multiple_outputs_checked_using_toLogString = {
  log: `transactions:3
  txid:b3848f2cabf5887ec679ca60347a29f6ecad425fda738700265c2f9d22c18ab5 version:1 lockTime:0 sats:-12 status:nosend 
     outgoing:true desc:'Funding transaction with multiple outputs' labels:['funding transaction for createaction','this 
     is the extra label']
  inputs: 1
    0: sourceTXID:a3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2 sats:913 
       lock:(50)76a914f7238871139f4926cbd592a03a737981e558245d88ac 
       unlock:(212)473044022079020cc8ea5ee6b3610806286e41567147d4b4b07d16bc1341311e00ce7647b0022034... seq:4294967295
  outputs: 3
    0: sats:5 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true basket:'funding basket' 
       desc:'Funding output' tags:['funding transaction for createaction','test tag']
    1: sats:6 lock:(48)76a914fedcba9876543210fedcba9876543210fedcba88ac index:1 spendable:true basket:'extra basket' 
       desc:'Extra Output' tags:['extra transaction output','extra test tag']
    2: sats:901 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:2 spendable:true basket:'default'`,
  logColor: `[90mtransactions:3[39m [90mkey:[39m ([34mtxid/outpoint[39m [36mscript[39m [32msats[39m)
  [34mb3848f2cabf5887ec679ca60347a29f6ecad425fda738700265c2f9d22c18ab5[39m [90mversion:[39m1 [90mlockTime:[39m0 
     [32m-12 sats[39m [90mstatus:[39m[37mnosend[39m [90moutgoing:[39m[37mtrue[39m [90mdesc:[39m[37mFunding 
     transaction with multiple outputs[39m [90mlabels:[39m[37m['funding transaction for createaction','this is the 
     extra label'][39m
  [90minputs: 1[39m
    [90m0:[39m [34ma3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2[39m [32m913 sats[39m 
       [90mlock:[39m(50)[36m76a914f7238871139f4926cbd592a03a737981e558245d88ac[39m 
       [90munlock:[39m(212)[36m473044022079020cc8ea5ee6b3610806286e41567147d4b4b07d16bc1341311e00ce7647b0022034...[39m 
       [90mseq:[39m4294967295
  [90moutputs: 3[39m
    [90m0:[39m [32m5 sats[39m [90mlock:[39m(48)[36m76a914abcdef0123456789abcdef0123456789abcdef88ac[39m 
       [90mindex:[39m[37m0[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mfunding basket[39m 
       [90mdesc:[39m[37mFunding output[39m [90mtags:[39m[37m['funding transaction for createaction','test 
       tag'][39m
    [90m1:[39m [32m6 sats[39m [90mlock:[39m(48)[36m76a914fedcba9876543210fedcba9876543210fedcba88ac[39m 
       [90mindex:[39m[37m1[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mextra basket[39m 
       [90mdesc:[39m[37mExtra Output[39m [90mtags:[39m[37m['extra transaction output','extra test tag'][39m
    [90m2:[39m [32m901 sats[39m [90mlock:[39m(50)[36m76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac[39m 
       [90mindex:[39m[37m2[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mdefault[39m`
}

// Auto-generated test log - 2025-02-05T14:50:57.843Z
const LOG_createAction_nosend_transactions_3_transaction_with_explicit_change_check_also_uses_toLogString_on_the_spend =
  {
    log: `transactions:5
  txid:afa6713aab0957cf5bb00dee532ad7b895e919a99564ec2016b51cb3d472d87f version:1 lockTime:0 sats:1 status:nosend 
     outgoing:true desc:'Explicit check on returned change' labels:['spending transaction test']
  inputs: 2
    0: sourceTXID:527ffe88f70d5b7de2b8b5ba9966b9c755e7da4de749d4fcd27140a03145a11d.0 sats:995 
       lock:(50)76a914ab2b66432503a3681fc5af1502207ca458c8752d88ac 
       unlock:(214)483045022100973a84555fa864e08313bda5c88e1991094db7b8d82586c899276155dabcbc9a0220... seq:4294967295
    1: sourceTXID:70afdc54187a1cdb8e35f7d00e5e111cbf5c43c4dc3f1da2cc44479133c75f9e.0 sats:4 desc:'Funding output' 
       lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac unlock:(16)47304402207f2e9a seq:4294967295
  outputs: 2
    0: sats:2 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true desc:'First spending 
       Output for check on change '
    1: sats:996 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`,
    logColor: `[90mtransactions:5[39m [90mkey:[39m ([34mtxid/outpoint[39m [36mscript[39m [32msats[39m)
  [34mafa6713aab0957cf5bb00dee532ad7b895e919a99564ec2016b51cb3d472d87f[39m [90mversion:[39m1 [90mlockTime:[39m0 
     [32m1 sats[39m [90mstatus:[39m[37mnosend[39m [90moutgoing:[39m[37mtrue[39m [90mdesc:[39m[37mExplicit 
     check on returned change[39m [90mlabels:[39m[37m['spending transaction test'][39m
  [90minputs: 2[39m
    [90m0:[39m [34m527ffe88f70d5b7de2b8b5ba9966b9c755e7da4de749d4fcd27140a03145a11d.0[39m [32m995 sats[39m 
       [90mlock:[39m(50)[36m76a914ab2b66432503a3681fc5af1502207ca458c8752d88ac[39m 
       [90munlock:[39m(214)[36m483045022100973a84555fa864e08313bda5c88e1991094db7b8d82586c899276155dabcbc9a0220...[39m 
       [90mseq:[39m4294967295
    [90m1:[39m [34m70afdc54187a1cdb8e35f7d00e5e111cbf5c43c4dc3f1da2cc44479133c75f9e.0[39m [32m4 sats[39m 
       [90mdesc:[39m[37mFunding output[39m 
       [90mlock:[39m(48)[36m76a914abcdef0123456789abcdef0123456789abcdef88ac[39m 
       [90munlock:[39m(16)[36m47304402207f2e9a[39m [90mseq:[39m4294967295
  [90moutputs: 2[39m
    [90m0:[39m [32m2 sats[39m [90mlock:[39m(48)[36m76a914abcdef0123456789abcdef0123456789abcdef88ac[39m 
       [90mindex:[39m[37m0[39m [90mspendable:[39m[37mtrue[39m [90mdesc:[39m[37mFirst spending Output for check 
       on change [39m
    [90m1:[39m [32m996 sats[39m [90mlock:[39m(50)[36m76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac[39m 
       [90mindex:[39m[37m1[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mdefault[39m`
  }

// Auto-generated test log - 2025-02-05T15:22:24.388Z
const LOG_createAction_nosend_transactions_4_transaction_with_custom_options_knownTxids_and_returnTXIDOnly_false_uses_toLogString =
  {
    log: `transactions:2
  txid:38ded69627603b30bd1f55eb3f88098dbf74f2ef0ff5e3cfe6a34f97ce2db9c2 version:1 lockTime:0 sats:-5 status:nosend 
     outgoing:true desc:'Check knownTxids and returnTXIDOnly' labels:['custom options test']
  inputs: 1
    0: sourceTXID:527ffe88f70d5b7de2b8b5ba9966b9c755e7da4de749d4fcd27140a03145a11d.0 sats:995 
       lock:(50)76a914ab2b66432503a3681fc5af1502207ca458c8752d88ac 
       unlock:(212)4730440220113a6f72035a6ddcd6930db7e3f3d5c70486f9aaefb095e6fa3557afa916ec37022054... seq:4294967295
  outputs: 2
    0: sats:4 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true desc:'returnTXIDOnly 
       false test'
    1: sats:990 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`,
    logColor: `[90mtransactions:2[39m [90mkey:[39m ([34mtxid/outpoint[39m [36mscript[39m [32msats[39m)
  [34m38ded69627603b30bd1f55eb3f88098dbf74f2ef0ff5e3cfe6a34f97ce2db9c2[39m [90mversion:[39m1 [90mlockTime:[39m0 
     [32m-5 sats[39m [90mstatus:[39m[37mnosend[39m [90moutgoing:[39m[37mtrue[39m [90mdesc:[39m[37mCheck 
     knownTxids and returnTXIDOnly[39m [90mlabels:[39m[37m['custom options test'][39m
  [90minputs: 1[39m
    [90m0:[39m [34m527ffe88f70d5b7de2b8b5ba9966b9c755e7da4de749d4fcd27140a03145a11d.0[39m [32m995 sats[39m 
       [90mlock:[39m(50)[36m76a914ab2b66432503a3681fc5af1502207ca458c8752d88ac[39m 
       [90munlock:[39m(212)[36m4730440220113a6f72035a6ddcd6930db7e3f3d5c70486f9aaefb095e6fa3557afa916ec37022054...[39m 
       [90mseq:[39m4294967295
  [90moutputs: 2[39m
    [90m0:[39m [32m4 sats[39m [90mlock:[39m(48)[36m76a914abcdef0123456789abcdef0123456789abcdef88ac[39m 
       [90mindex:[39m[37m0[39m [90mspendable:[39m[37mtrue[39m [90mdesc:[39m[37mreturnTXIDOnly false test[39m
    [90m1:[39m [32m990 sats[39m [90mlock:[39m(50)[36m76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac[39m 
       [90mindex:[39m[37m1[39m [90mspendable:[39m[37mtrue[39m [90mbasket:[39m[37mdefault[39m`
  }
