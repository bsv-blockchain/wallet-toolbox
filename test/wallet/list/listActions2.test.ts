import { ListActionsArgs, Utils } from '@bsv/sdk'
import { sdk } from '../../../src/index.client'
import {
  _tu,
  expectToThrowWERR,
  MockData,
  TestWalletNoSetup
} from '../../utils/TestUtilsWalletStorage'

const env = _tu.getEnv('test')
const testName = () => expect.getState().currentTestName || 'test'

describe('listActions2 single action tests', () => {
  jest.setTimeout(99999999)

  let ctxs: TestWalletNoSetup[]

  const mockData: MockData = {
    actions: [
      {
        txid: 'tx',
        satoshis: 1,
        status: 'completed',
        isOutgoing: true,
        description: 'Transaction',
        version: 1,
        lockTime: 0,
        labels: ['label', 'label2'],
        inputs: [
          {
            sourceOutpoint: 'tx.0',
            sourceSatoshis: 1,
            sourceLockingScript: '0123456789abcdef',
            unlockingScript: '0123456789abcdef',
            inputDescription: 'description',
            sequenceNumber: 0
          }
        ],
        outputs: [
          {
            satoshis: 1,
            spendable: false,
            tags: ['tag', 'tag2'],
            outputIndex: 2,
            outputDescription: 'description',
            basket: 'basket',
            lockingScript: '0123456789abcdef'
          }
        ]
      }
    ]
  }

  beforeEach(async () => {
    ctxs = []
    const args = {
      mockData,
      databaseName: testName(),
      rootKeyHex: '2'.repeat(64),
      dropAll: true
    }
    if (env.runMySQL) {
      ctxs.push(await _tu.createMySQLTestSetup2Wallet(args))
    }
    ctxs.push(await _tu.createSQLiteTestSetup2Wallet(args))
  })

  afterEach(async () => {
    for (const { wallet } of ctxs) await wallet.destroy()
  })

  test('12_no labels default any', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: []
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('13_no labels any', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: [],
        labelQueryMode: 'any'
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('14_no labels all', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: [],
        labelQueryMode: 'all'
      }
      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('15_empty label default any', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: ['']
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  test('16_label is space character default any', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: [' ']
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  test('17_label does not exist default any', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: ['nonexistantlabel'] // Testing with a non-existent label
      }

      const expectedResult = JSON.parse('{"totalActions":0,"actions":[]}')

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('18_label min 1 character default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const minLengthLabel = 'a'
      await storage.updateTxLabel(1, { label: minLengthLabel })
      const args: ListActionsArgs = {
        labels: [minLengthLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('19_label max 300 spaces default any', async () => {
    for (const { wallet } of ctxs) {
      const maxLengthSpacesLabel = ' '.repeat(300)
      const args: ListActionsArgs = {
        labels: [maxLengthSpacesLabel]
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  test('20_label max 300 normal characters default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const maxLengthNormalLabel = 'a'.repeat(300)
      await storage.updateTxLabel(1, { label: maxLengthNormalLabel })
      const args: ListActionsArgs = {
        labels: [maxLengthNormalLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('21_label min 1 emoji default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const minimumEmojiLabel = generateRandomEmojiString(4)
      await storage.updateTxLabel(1, { label: minimumEmojiLabel })
      const args: ListActionsArgs = {
        labels: [minimumEmojiLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('22_label max length 75 emojis default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const maximumEmojisLabel = generateRandomEmojiString(300)
      await storage.updateTxLabel(1, { label: maximumEmojisLabel })
      const args: ListActionsArgs = {
        labels: [maximumEmojisLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('23_label exceeding max length 76 emojis default any', async () => {
    for (const { wallet } of ctxs) {
      const exceedingMaximumEmojisLabel = generateRandomEmojiString(304)
      const args: ListActionsArgs = {
        labels: [exceedingMaximumEmojisLabel]
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  test('24_normal label default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label'
      await storage.updateTxLabel(1, { label })
      const args: ListActionsArgs = {
        labels: [label]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('25_normal label any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label'
      await storage.updateTxLabel(1, { label })
      const args: ListActionsArgs = {
        labels: [label],
        labelQueryMode: 'any'
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('26_normal label all', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label'
      await storage.updateTxLabel(1, { label })
      const args: ListActionsArgs = {
        labels: [label],
        labelQueryMode: 'all'
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  // Can't test mixed case at storage level
  // test('27_label mixed case default any', async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     const mixedCaseLabel = 'LAbEL'
  //     await storage.updateTxLabel(1, { label: mixedCaseLabel })
  //     const args: ListActionsArgs = {
  //       labels: [mixedCaseLabel]
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test('28_label special characters default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const specialCharsLabel = '@special#label!'
      await storage.updateTxLabel(1, { label: specialCharsLabel })
      const args: ListActionsArgs = {
        labels: [specialCharsLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  // Can't test external whitespace at storage level
  // test('29_label leading and trailing whitespace default any', async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     const leadTrailSpacesLabel = '  label  '
  //     await storage.updateTxLabel(1, { label: leadTrailSpacesLabel })
  //     const args: ListActionsArgs = {
  //       labels: [leadTrailSpacesLabel]
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test('30_label numeric default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const numericLabel = '12345'
      await storage.updateTxLabel(1, { label: numericLabel })
      const args: ListActionsArgs = {
        labels: [numericLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('31_label alphanumeric default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const alphaumericLabel = 'abcde12345'
      await storage.updateTxLabel(1, { label: alphaumericLabel })
      const args: ListActionsArgs = {
        labels: [alphaumericLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('32_label contains default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const containsLabel = 'label'
      await storage.updateTxLabel(1, { label: containsLabel })
      const args: ListActionsArgs = {
        labels: ['labelone']
      }

      const expectedResult = JSON.parse('{"totalActions":0,"actions":[]}')

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  // Can't test mixed case at storage level
  // test('33_label different case lower any', async () => {
  //   for (const { wallet } of ctxs) {
  //     const args: ListActionsArgs = {
  //       labels: ['label'],
  //       labelQueryMode: 'any'
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test('34_label different case upper any', async () => {
  //   for (const { wallet } of ctxs) {
  //     const args: ListActionsArgs = {
  //       labels: ['LABEL'],
  //       labelQueryMode: 'any'
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test('35_label with whitespace default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const spacedLabel = 'lab  el'
      await storage.updateTxLabel(1, { label: spacedLabel })
      const args: ListActionsArgs = {
        labels: [spacedLabel]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  // Can't test mixed case at storage level
  // test('36_label different case lower all', async () => {
  //   for (const { wallet } of ctxs) {
  //     const args: ListActionsArgs = {
  //       labels: ['label'],
  //       labelQueryMode: 'all'
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test('37_label different case upper all', async () => {
  //   for (const { wallet } of ctxs) {
  //     const args: ListActionsArgs = {
  //       labels: ['LABEL'],
  //       labelQueryMode: 'all'
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test('38_label duplicated default any', async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     const pairSameLabels = ['label', 'label']
  //     await storage.updateTxLabel(1, { label: pairSameLabels[0] })
  //     await storage.updateTxLabel(2, { label: pairSameLabels[1] })
  //     const args: ListActionsArgs = {
  //       labels: pairSameLabels
  //     }

  //     const expectedResult = JSON.parse('{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}')

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test('39_label requested default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label'
      await storage.updateTxLabel(1, { label })
      await storage.updateTxLabel(2, { label: 'label2' })
      const args: ListActionsArgs = {
        labels: [label],
        includeLabels: true
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"labels":["label","label2"],"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('40_label not requested default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label'
      await storage.updateTxLabel(1, { label })
      const args: ListActionsArgs = {
        labels: [label],
        includeLabels: false
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('41_label partial match default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'labels' })
      await storage.updateTxLabel(2, { label: 'label2' })
      const args: ListActionsArgs = {
        labels: ['label'],
        includeLabels: true
      }

      const expectedResult = JSON.parse('{"totalActions":0,"actions":[]}')

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('42_label only one match default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'labels' })
      await storage.updateTxLabel(2, { label: 'label' })
      const args: ListActionsArgs = {
        labels: ['label']
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`43_inputs requested`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      const args: ListActionsArgs = {
        labels: ['label2'],
        includeInputs: true
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","inputs":[{"inputDescription":"description","sequenceNumber":0,"sourceOutpoint":"tx.0","sourceSatoshis":1}],"isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`44_inputs not requested`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      const args: ListActionsArgs = {
        labels: ['label2'],
        includeInputs: false
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`45_inputs requested locking script`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      const args: ListActionsArgs = {
        labels: ['label2'],
        includeInputs: true,
        includeInputSourceLockingScripts: true
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","inputs":[{"inputDescription":"description","sequenceNumber":0,"sourceLockingScript":"0123456789abcdef","sourceOutpoint":"tx.0","sourceSatoshis":1}],"isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`46_inputs no locking script`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      const args: ListActionsArgs = {
        labels: ['label2'],
        includeInputs: true,
        includeInputSourceLockingScripts: false
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","inputs":[{"inputDescription":"description","sequenceNumber":0,"sourceOutpoint":"tx.0","sourceSatoshis":1}],"isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`47_inputs empty locking script`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      await storage.updateOutput(1, { lockingScript: [] })
      const args: ListActionsArgs = {
        labels: ['label2'],
        includeInputs: true,
        includeInputSourceLockingScripts: true
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","inputs":[{"inputDescription":"description","sequenceNumber":0,"sourceLockingScript":"","sourceOutpoint":"tx.0","sourceSatoshis":1}],"isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  // This requires genuine rawTx
  // test(`48_inputs request unlocking script`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutput(1, {
  //       lockingScript: Utils.toArray(
  //         '76a91489abcdefabbaabbaabbaabbaabbaabbaabbaabba88ac'
  //       )
  //     })
  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeInputs: true,
  //       includeInputSourceLockingScripts: true,
  //       includeInputUnlockingScripts: true
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","inputs":[{"inputDescription":"description","sequenceNumber":0,"unlockingScript":"47304402207f2e9a6a6d8a5cf3f9d54b4e5fdfbb7a9c75c7e7a22be59d202c4baf1681c6140220219b1c07338fdfc60e949d0b426ce7b8f95de7a9d2e78f587db13fa7a6eb582301 0411db93e1dcdb8a016b49840f8c53bc1eb68a382fd70c81b7c4eeb4c1aab0eedda7e4a3c88ad097448a687ea1f90337e62c23f8cbb4cd7a7b20c54d7e0ceda220","sourceOutpoint":"tx.0","sourceSatoshis":1}],"isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test(`49_outputs requested`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      await storage.updateOutputBasket(1, { name: 'new basket' })
      await storage.updateOutput(2, {
        satoshis: 1,
        spendable: false,
        vout: 2,
        outputDescription: 'new description',
        basketId: 1
      })
      await storage.updateOutputTag(2, { tag: 'new tag' })
      await storage.updateOutputTagMap(1, 2, {})

      const args: ListActionsArgs = {
        labels: ['label2'],
        includeOutputs: true
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`50_outputs requested`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      await storage.updateOutputBasket(1, { name: 'new basket' })
      await storage.updateOutput(2, {
        satoshis: 1,
        spendable: false,
        vout: 2,
        outputDescription: 'new description',
        basketId: 1
      })
      await storage.updateOutputTag(2, { tag: 'new tag' })
      await storage.updateOutputTagMap(1, 2, {})

      const args: ListActionsArgs = {
        labels: ['label2'],
        includeOutputs: false
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  // Cannot empty outputs at storage level
  // test(`51_outputs empty requested`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {})
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test(`52_outputs locking script requested`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      await storage.updateOutputBasket(1, { name: 'new basket' })
      await storage.updateOutput(2, {
        satoshis: 1,
        spendable: false,
        vout: 2,
        outputDescription: 'new description',
        basketId: 1,
        lockingScript: Utils.toArray('0123456789abcdef')
      })
      await storage.updateOutputTag(2, { tag: 'new tag' })
      await storage.updateOutputTagMap(1, 2, {})

      const args: ListActionsArgs = {
        labels: ['label2'],
        includeOutputs: true,
        includeOutputLockingScripts: true
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"lockingScript":"0123456789abcdef","tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`53_outputs locking script not requested`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      await storage.updateOutputBasket(1, { name: 'new basket' })
      await storage.updateOutput(2, {
        satoshis: 1,
        spendable: false,
        vout: 2,
        outputDescription: 'new description',
        basketId: 1,
        lockingScript: Utils.toArray('0123456789abcdef')
      })
      await storage.updateOutputTag(2, { tag: 'new tag' })
      await storage.updateOutputTagMap(1, 2, {})

      const args: ListActionsArgs = {
        labels: ['label2'],
        includeOutputs: true,
        includeOutputLockingScripts: false
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test(`54_outputs locking script undefined`, async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label' })
      await storage.updateTxLabel(2, { label: 'label2' })
      await storage.updateOutputBasket(1, { name: 'new basket' })
      await storage.updateOutput(2, {
        satoshis: 1,
        spendable: false,
        vout: 2,
        outputDescription: 'new description',
        basketId: 1,
        lockingScript: undefined
      })
      await storage.updateOutputTag(2, { tag: 'new tag' })
      await storage.updateOutputTagMap(1, 2, {})

      const args: ListActionsArgs = {
        labels: ['label2'],
        includeOutputs: true,
        includeOutputLockingScripts: false
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  //TBD requires many mock actions to be performed
  // test(`55_limit is default`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`56_limit 1`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test('57_limit 0', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: ['label'],
        limit: 0
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  test('58_limit 10001', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: ['label'],
        limit: 10001
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  // TBD requires many mock actions to be performed
  // test(`59_offset less than number of actions`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`60_offset equal to number of actions`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`61_offset above number of actions`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  test('62_offset is invalid', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: ['label'],
        offset: -1
      }

      await expectToThrowWERR(
        sdk.WERR_INVALID_PARAMETER,
        async () => await wallet.listActions(args)
      )
    }
  })

  //TBD requires many mock actions to be performed
  // test(`63_offset below limit with same number of actions`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`64_offset below limit greater than number of actions`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`65_offset skips all actions with limit set`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`66_limit exceeds remaining actions after offset`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })

  // test(`67_limit exceeds remaining actions after offset`, async () => {
  //   for (const { activeStorage: storage, wallet } of ctxs) {
  //     await storage.updateTxLabel(1, { label: 'label' })
  //     await storage.updateTxLabel(2, { label: 'label2' })
  //     await storage.updateOutputBasket(1, { name: 'new basket' })
  //     await storage.updateOutput(2, {
  //       satoshis: 1,
  //       spendable: false,
  //       vout: 2,
  //       outputDescription: 'new description',
  //       basketId: 1,
  //       lockingScript: undefined
  //     })
  //     await storage.updateOutputTag(2, { tag: 'new tag' })
  //     await storage.updateOutputTagMap(1, 2, {})

  //     const args: ListActionsArgs = {
  //       labels: ['label2'],
  //       includeOutputs: true,
  //       includeOutputLockingScripts: false
  //     }

  //     const expectedResult = JSON.parse(
  //       '{"totalActions":1,"actions":[{"txid":"tx","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction","version":1,"lockTime":0,"outputs":[{"satoshis":1,"spendable":false,"tags":["tag","new tag"],"outputIndex":2,"outputDescription":"new description","basket":"new basket"}]}]}'
  //     )

  //     expect(await wallet.listActions(args)).toEqual(expectedResult)
  //   }
  // })
})

describe('listActions2 two action tests', () => {
  jest.setTimeout(99999999)

  let ctxs: TestWalletNoSetup[]

  const mockData: MockData = {
    actions: [
      {
        txid: 'tx1',
        satoshis: 1,
        status: 'completed',
        isOutgoing: true,
        description: 'Transaction 1',
        version: 1,
        lockTime: 0,
        labels: ['label 1', 'label a'],
        inputs: [
          {
            sourceOutpoint: 'tx1.1',
            sourceSatoshis: 1,
            //sourceLockingScript: '0123456789abcdef',
            //unlockingScript: '0123456789abcdef',
            inputDescription: 'description 1',
            sequenceNumber: 1
          }
        ],
        outputs: [
          {
            satoshis: 1,
            spendable: false,
            tags: ['tag1'],
            outputIndex: 1,
            outputDescription: 'description 1',
            basket: 'basket'
            //lockingScript: '0123456789abcdef'
          }
        ]
      },
      {
        txid: 'tx2',
        satoshis: 2,
        status: 'completed',
        isOutgoing: true,
        description: 'Transaction 2',
        version: 1,
        lockTime: 0,
        labels: ['label2', 'label b'],
        inputs: [
          {
            sourceOutpoint: 'tx2.2',
            sourceSatoshis: 2,
            //sourceLockingScript: '0123456789abcdef',
            //unlockingScript: '0123456789abcdef',
            inputDescription: 'description 2',
            sequenceNumber: 2
          }
        ],
        outputs: [
          {
            satoshis: 2,
            spendable: false,
            tags: ['tag2'],
            outputIndex: 2,
            outputDescription: 'description 2',
            basket: 'basket 2'
            //lockingScript: '0123456789abcdef'
          }
        ]
      }
    ]
  }

  beforeEach(async () => {
    ctxs = []
    const args = {
      mockData,
      databaseName: testName(),
      rootKeyHex: '2'.repeat(64),
      dropAll: true
    }
    if (env.runMySQL) {
      ctxs.push(await _tu.createMySQLTestSetup2Wallet(args))
    }
    ctxs.push(await _tu.createSQLiteTestSetup2Wallet(args))
  })

  afterEach(async () => {
    for (const { wallet } of ctxs) await wallet.destroy()
  })

  test('100_no labels (default) matched default any', async () => {
    for (const { wallet } of ctxs) {
      const args: ListActionsArgs = {
        labels: []
      }

      const expectedResult = JSON.parse(
        '{"totalActions":2,"actions":[{"txid":"tx1","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction 1","version":1,"lockTime":0},{"txid":"tx2","satoshis":2,"status":"completed","isOutgoing":true,"description":"Transaction 2","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('101_label 1 matched default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label 1'
      await storage.updateTxLabel(1, { label })
      await storage.updateTxLabel(2, { label: 'label a' })
      await storage.updateTxLabel(3, { label: 'label 2' })
      await storage.updateTxLabel(4, { label: 'label b' })
      const args: ListActionsArgs = {
        labels: [label]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx1","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction 1","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('102_label 2 matched default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      const label = 'label 2'
      await storage.updateTxLabel(1, { label: 'label 1' })
      await storage.updateTxLabel(2, { label: 'label a' })
      await storage.updateTxLabel(3, { label })
      await storage.updateTxLabel(4, { label: 'label b' })
      const args: ListActionsArgs = {
        labels: [label]
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx2","satoshis":2,"status":"completed","isOutgoing":true,"description":"Transaction 2","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('103_no label matched default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label 1' })
      await storage.updateTxLabel(2, { label: 'label a' })
      await storage.updateTxLabel(3, { label: 'label 2' })
      await storage.updateTxLabel(4, { label: 'label b' })
      const args: ListActionsArgs = {
        labels: ['label']
      }

      const expectedResult = JSON.parse('{"totalActions":0,"actions":[]}')

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('104_both labels matched default any', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label 1' })
      await storage.updateTxLabel(2, { label: 'label a' })
      await storage.updateTxLabel(3, { label: 'label 2' })
      await storage.updateTxLabel(4, { label: 'label b' })
      const args: ListActionsArgs = {
        labels: ['label 1', 'label 2']
      }

      const expectedResult = JSON.parse(
        '{"totalActions":2,"actions":[{"txid":"tx1","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction 1","version":1,"lockTime":0},{"txid":"tx2","satoshis":2,"status":"completed","isOutgoing":true,"description":"Transaction 2","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('105_first label pair matches mode all', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label 1' })
      await storage.updateTxLabel(2, { label: 'label a' })
      await storage.updateTxLabel(3, { label: 'label 2' })
      await storage.updateTxLabel(4, { label: 'label b' })
      const args: ListActionsArgs = {
        labels: ['label 1', 'label a'],
        labelQueryMode: 'all'
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx1","satoshis":1,"status":"completed","isOutgoing":true,"description":"Transaction 1","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })

  test('106_second label pair matches mode all', async () => {
    for (const { activeStorage: storage, wallet } of ctxs) {
      await storage.updateTxLabel(1, { label: 'label 1' })
      await storage.updateTxLabel(2, { label: 'label a' })
      await storage.updateTxLabel(3, { label: 'label 2' })
      await storage.updateTxLabel(4, { label: 'label b' })
      const args: ListActionsArgs = {
        labels: ['label 2', 'label b'],
        labelQueryMode: 'all'
      }

      const expectedResult = JSON.parse(
        '{"totalActions":1,"actions":[{"txid":"tx2","satoshis":2,"status":"completed","isOutgoing":true,"description":"Transaction 2","version":1,"lockTime":0}]}'
      )

      expect(await wallet.listActions(args)).toEqual(expectedResult)
    }
  })
})

const generateRandomEmojiString = (bytes: number): string => {
  const emojiRange = [
    '\u{1F600}',
    '\u{1F603}',
    '\u{1F604}',
    '\u{1F609}',
    '\u{1F60A}',
    '\u{1F60D}',
    '\u{1F618}',
    '\u{1F61C}',
    '\u{1F923}',
    '\u{1F44D}'
  ]

  const bytesPerEmoji = 4 // Each emoji is 4 bytes in UTF-8
  const numEmojis = Math.floor(bytes / bytesPerEmoji)

  let result = ''
  for (let i = 0; i < numEmojis; i++) {
    result += emojiRange[Math.floor(Math.random() * emojiRange.length)]
  }

  return result
}
