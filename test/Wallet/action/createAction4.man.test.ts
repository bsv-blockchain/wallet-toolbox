import { CreateActionArgs, CreateActionResult, PushDrop, Utils } from '@bsv/sdk'
import { _tu, TestWalletNoSetup } from '../../utils/TestUtilsWalletStorage'
import { toLogString } from './createAction2.test'

const TODO_PROTO_ADDR = '1ToDoDtKreEzbHYKFjmoBuduFmSXXUGZG'

describe('createAction4 todo list transactions', () => {
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

      const testTask = 'An example TODO task.'

      const pushdrop = new PushDrop(wallet)
      const bitcoinOutputScript = await pushdrop.lock(
        [
          Utils.toArray(TODO_PROTO_ADDR, 'utf8') as number[],
          Utils.toArray(testTask, 'utf8')
        ],
        [0, 'todo list'],
        '1',
        'self'
      )

      const newToDoToken = await wallet.createAction({
        outputs: [{
          lockingScript: bitcoinOutputScript.toHex(),
          satoshis: Number(500),
          basket: 'todo tokens',
          outputDescription: 'New ToDo list item'
        }],
        options: {
          randomizeOutputs: false
        },
        description: `Create a TODO task: ${testTask}`
      })

      expect(newToDoToken.tx).toBeDefined()

      // fine up to this point, not sure what to do next

  //     const actionResult = await wallet.listActions({

  //     })

  //     const fundingResult: CreateActionResult =
  //       await wallet.createAction(fundingArgs)
  //     expect(fundingResult.tx).toBeDefined()
  //     const actionsResult = await wallet.listActions({
  //       labels: [fundingLabel],
  //       includeInputs: true,
  //       includeOutputs: true,
  //       includeInputSourceLockingScripts: true,
  //       includeInputUnlockingScripts: true,
  //       includeOutputLockingScripts: true,
  //       includeLabels: true
  //     })
  //     const rl1 = toLogString(fundingResult.tx!, actionsResult)
  //     expect(rl1.log).toBe(`transactions:3
  // txid:30bdac0f5c6491f130820517802ff57e20e5a50c08b5c65e6976627fb82ae930 version:1 lockTime:0 sats:-4 status:nosend 
  //    outgoing:true desc:'Funding transaction' labels:['funding transaction for createaction','this is an extra long test 
  //    label that should be truncated at 80 chars when it is...']
  // inputs: 1
  //   0: sourceTXID:a3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26.2 sats:913 
  //      lock:(50)76a914f7238871139f4926cbd592a03a737981e558245d88ac 
  //      unlock:(214)483045022100cfef1f6d781af99a1de14efd6f24f2a14234a26097012f27121eb36f4e330c1d0220... seq:4294967295
  // outputs: 2
  //   0: sats:3 lock:(48)76a914abcdef0123456789abcdef0123456789abcdef88ac index:0 spendable:true basket:'funding basket' 
  //      desc:'Funding Output' tags:['funding transaction output','test tag']
  //   1: sats:909 lock:(50)76a9145947e66cdd43c70fb1780116b79e6f7d96e30e0888ac index:1 spendable:true basket:'default'`)
    }
  })
})