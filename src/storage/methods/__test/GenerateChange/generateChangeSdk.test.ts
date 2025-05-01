/* eslint-disable @typescript-eslint/no-unused-vars */

import { Transaction as BsvTransaction, Script } from '@bsv/sdk'
import { randomValsUsed1 } from './randomValsUsed1'
import { sdk } from '../../../../index.client'
import {
  generateChangeSdk,
  GenerateChangeSdkChangeInput,
  generateChangeSdkMakeStorage,
  GenerateChangeSdkParams,
  GenerateChangeSdkResult
} from '../../generateChange'

describe('generateChange tests', () => {
  jest.setTimeout(99999999)

  test('0 two outputs', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ]
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":6323,"outputId":15005,"spendable":false}],"changeOutputs":[{"satoshis":1608,"lockingScriptLength":25}],"size":1739330,"fee":3479,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('0a two outputs exact input', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ]
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]
    availableChange[5].satoshis = 4715

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":4715,"outputId":15027,"spendable":false}],"changeOutputs":[],"size":1739296,"fee":3479,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('0b two outputs 666666 200 ', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 666666, lockingScriptLength: 197 },
        { satoshis: 200, lockingScriptLength: 25 }
      ]
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]
    availableChange[5].satoshis = 4715

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":1575097,"outputId":15101,"spendable":false}],"changeOutputs":[{"satoshis":908230,"lockingScriptLength":25}],"size":432,"fee":1,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('0c two outputs 666666 200 two change inputs ', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 666666, lockingScriptLength: 197 },
        { satoshis: 200, lockingScriptLength: 25 }
      ]
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [
      { satoshis: 191051, outputId: 14101 },
      { satoshis: 129470, outputId: 14106 },
      { satoshis: 273356, outputId: 14110 },
      { satoshis: 65612, outputId: 14120 },
      { satoshis: 44778, outputId: 14126 },
      { satoshis: 58732, outputId: 14141 },
      { satoshis: 160865, outputId: 14142 },
      { satoshis: 535280, outputId: 14146 },
      { satoshis: 1006, outputId: 14177 },
      { satoshis: 1000, outputId: 14178 }
    ]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":535280,"outputId":14146,"spendable":false},{"satoshis":160865,"outputId":14142,"spendable":false}],"changeOutputs":[{"satoshis":29277,"lockingScriptLength":25}],"size":580,"fee":2,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('1 two outputs four change outputs', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":10735,"outputId":15106,"spendable":false}],"changeOutputs":[{"satoshis":1237,"lockingScriptLength":25},{"satoshis":1334,"lockingScriptLength":25},{"satoshis":1369,"lockingScriptLength":25},{"satoshis":1008,"lockingScriptLength":25},{"satoshis":1072,"lockingScriptLength":25}],"size":1739466,"fee":3479,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('2 WERR_INSUFFICIENT_FUNDS', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = defAvailableChange().slice(1, 4)

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    expectToThrowWERR(sdk.WERR_INSUFFICIENT_FUNDS, () =>
      generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    )
  })

  test('2a WERR_INSUFFICIENT_FUNDS no inputs', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = []

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    expectToThrowWERR(sdk.WERR_INSUFFICIENT_FUNDS, () =>
      generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    )
  })

  test('3 allocate all', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 39091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = defAvailableChange().slice(1, 4)

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":1004,"outputId":15011,"spendable":false},{"satoshis":1000,"outputId":15017,"spendable":false}],"changeOutputs":[{"satoshis":689,"lockingScriptLength":25}],"size":39476,"fee":79,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('4 feeModel 5 sat per kb', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 39091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      feeModel: { value: 5, model: 'sat/kb' },
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = defAvailableChange().slice(1, 4)

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":1004,"outputId":15011,"spendable":false},{"satoshis":1000,"outputId":15017,"spendable":false}],"changeOutputs":[{"satoshis":570,"lockingScriptLength":25}],"size":39476,"fee":198,"satsPerKb":5}'
    )
    expectTransactionSize(params, r)
  })

  test('4a feeModel 1 sat per kb', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 39091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      feeModel: { value: 1, model: 'sat/kb' },
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = defAvailableChange().slice(1, 4)

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":1004,"outputId":15011,"spendable":false},{"satoshis":1000,"outputId":15017,"spendable":false}],"changeOutputs":[{"satoshis":728,"lockingScriptLength":25}],"size":39476,"fee":40,"satsPerKb":1}'
    )
    expectTransactionSize(params, r)
  })

  test('5 one fixedInput', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedInputs: [{ satoshis: 1234, unlockingScriptLength: 42 }],
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":10735,"outputId":15106,"spendable":false}],"changeOutputs":[{"satoshis":1526,"lockingScriptLength":25},{"satoshis":1738,"lockingScriptLength":25},{"satoshis":1816,"lockingScriptLength":25},{"satoshis":1016,"lockingScriptLength":25},{"satoshis":1157,"lockingScriptLength":25}],"size":1739549,"fee":3480,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('5a one larger fixedInput', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedInputs: [{ satoshis: 1234, unlockingScriptLength: 242 }],
      fixedOutputs: [
        { satoshis: 1234, lockingScriptLength: 1739091 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":10735,"outputId":15106,"spendable":false}],"changeOutputs":[{"satoshis":1526,"lockingScriptLength":25},{"satoshis":1738,"lockingScriptLength":25},{"satoshis":1816,"lockingScriptLength":25},{"satoshis":1016,"lockingScriptLength":25},{"satoshis":1157,"lockingScriptLength":25}],"size":1739749,"fee":3480,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('5b one fixedInput 1001 73', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedInputs: [{ satoshis: 1001, unlockingScriptLength: 73 }]
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[],"changeOutputs":[{"satoshis":1000,"lockingScriptLength":25}],"size":158,"fee":1,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('6 no fixedOutputs one fixedInput', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedInputs: [{ satoshis: 1234, unlockingScriptLength: 42 }],
      fixedOutputs: [],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput, getLog } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    //console.log(getLog())
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":6323,"outputId":15005,"spendable":false}],"changeOutputs":[{"satoshis":1597,"lockingScriptLength":25},{"satoshis":1837,"lockingScriptLength":25},{"satoshis":1925,"lockingScriptLength":25},{"satoshis":1019,"lockingScriptLength":25},{"satoshis":1178,"lockingScriptLength":25}],"size":411,"fee":1,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('6a no fixedOutputs no fixedInput', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedInputs: [],
      fixedOutputs: [],
      targetNetCount: 4
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [...defAvailableChange()]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":6323,"outputId":15005,"spendable":false}],"changeOutputs":[{"satoshis":1309,"lockingScriptLength":25},{"satoshis":1433,"lockingScriptLength":25},{"satoshis":1478,"lockingScriptLength":25},{"satoshis":1009,"lockingScriptLength":25},{"satoshis":1093,"lockingScriptLength":25}],"size":328,"fee":1,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  test('7 paramsText4 d4', async () => {
    const params: GenerateChangeSdkParams = {
      ...defParams,
      fixedOutputs: [
        { satoshis: 309000, lockingScriptLength: 198 },
        { satoshis: 2, lockingScriptLength: 25 }
      ]
    }
    const availableChange: GenerateChangeSdkChangeInput[] = [
      { satoshis: 7130, outputId: 15142 },
      { satoshis: 474866, outputId: 15332 },
      { satoshis: 16411, outputId: 15355 },
      { satoshis: 763632, outputId: 15368 },
      { satoshis: 18894, outputId: 15371 },
      { satoshis: 1574590, outputId: 15420 },
      { satoshis: 43207, outputId: 15480 },
      { satoshis: 12342, outputId: 15541 },
      { satoshis: 123453, outputId: 15548 },
      { satoshis: 7890, outputId: 16020 },
      { satoshis: 1073, outputId: 16026 }
    ]

    const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

    const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
    expect(JSON.stringify(r)).toBe(
      '{"allocatedChangeInputs":[{"satoshis":474866,"outputId":15332,"spendable":false}],"changeOutputs":[{"satoshis":165863,"lockingScriptLength":25}],"size":433,"fee":1,"satsPerKb":2}'
    )
    expectTransactionSize(params, r)
  })

  interface TestCase {
    p: GenerateChangeSdkParams
    availableChange: GenerateChangeSdkChangeInput[]
  }

  const d5: TestCase = {
    p: {
      fixedInputs: [{ satoshis: 1000, unlockingScriptLength: 72 }],
      fixedOutputs: [{ satoshis: 200, lockingScriptLength: 25 }],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 191051, outputId: 14101 },
      { satoshis: 273356, outputId: 14110 },
      { satoshis: 65612, outputId: 14120 },
      { satoshis: 44778, outputId: 14126 },
      { satoshis: 58732, outputId: 14141 },
      { satoshis: 160865, outputId: 14142 },
      { satoshis: 1006, outputId: 14177 },
      { satoshis: 1000, outputId: 14178 },
      { satoshis: 1000, outputId: 14180 },
      { satoshis: 1000, outputId: 14181 },
      { satoshis: 1000, outputId: 14183 },
      { satoshis: 1000, outputId: 14185 },
      { satoshis: 1000, outputId: 14186 },
      { satoshis: 1001, outputId: 14188 },
      { satoshis: 1000, outputId: 14189 },
      { satoshis: 1000, outputId: 14190 },
      { satoshis: 1001, outputId: 14192 },
      { satoshis: 1000, outputId: 14195 },
      { satoshis: 1000, outputId: 14196 },
      { satoshis: 1000, outputId: 14197 },
      { satoshis: 1000, outputId: 14198 },
      { satoshis: 1000, outputId: 14199 },
      { satoshis: 1000, outputId: 14200 },
      { satoshis: 1000, outputId: 14201 },
      { satoshis: 1000, outputId: 14202 },
      { satoshis: 1000, outputId: 14203 },
      { satoshis: 1000, outputId: 14204 },
      { satoshis: 1000, outputId: 14205 },
      { satoshis: 1000, outputId: 14206 },
      { satoshis: 1003, outputId: 14207 },
      { satoshis: 1001, outputId: 14208 },
      { satoshis: 1000, outputId: 14209 },
      { satoshis: 1000, outputId: 14210 },
      { satoshis: 1006, outputId: 14211 },
      { satoshis: 1020, outputId: 14212 },
      { satoshis: 1000, outputId: 14213 },
      { satoshis: 1000, outputId: 14214 },
      { satoshis: 1000, outputId: 14215 },
      { satoshis: 1000, outputId: 14216 },
      { satoshis: 1002, outputId: 14217 },
      { satoshis: 1046, outputId: 14218 },
      { satoshis: 1103, outputId: 14219 },
      { satoshis: 1001, outputId: 14221 },
      { satoshis: 1000, outputId: 14222 },
      { satoshis: 1000, outputId: 14223 },
      { satoshis: 1000, outputId: 14224 },
      { satoshis: 31311, outputId: 14321 },
      { satoshis: 1042, outputId: 14656 },
      { satoshis: 1099, outputId: 14661 },
      { satoshis: 1100, outputId: 14675 },
      { satoshis: 1019, outputId: 14676 },
      { satoshis: 1040, outputId: 14677 },
      { satoshis: 1000, outputId: 14679 },
      { satoshis: 1000, outputId: 14680 },
      { satoshis: 1001, outputId: 14681 },
      { satoshis: 1000, outputId: 14682 },
      { satoshis: 1001, outputId: 14683 },
      { satoshis: 1002, outputId: 14684 },
      { satoshis: 1005, outputId: 14685 },
      { satoshis: 1000, outputId: 14686 },
      { satoshis: 1007, outputId: 14687 },
      { satoshis: 1000, outputId: 14802 },
      { satoshis: 1069, outputId: 14803 },
      { satoshis: 1231, outputId: 15465 },
      { satoshis: 2386, outputId: 15468 },
      { satoshis: 1267, outputId: 15471 },
      { satoshis: 1283, outputId: 15472 },
      { satoshis: 1054, outputId: 15473 },
      { satoshis: 2031, outputId: 15475 },
      { satoshis: 1065, outputId: 15478 },
      { satoshis: 1268, outputId: 15479 },
      { satoshis: 1066, outputId: 15480 },
      { satoshis: 1065, outputId: 15481 },
      { satoshis: 1006, outputId: 15482 },
      { satoshis: 999799, outputId: 16338 },
      { satoshis: 2021, outputId: 16339 },
      { satoshis: 666465, outputId: 16340 },
      { satoshis: 5354, outputId: 16341 },
      { satoshis: 3132, outputId: 16342 }
    ]
  }
  const d6: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 500, lockingScriptLength: 436 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 1040, outputId: 16345 },
      { satoshis: 1000, outputId: 16346 },
      { satoshis: 1023, outputId: 16348 },
      { satoshis: 1054, outputId: 16350 },
      { satoshis: 1118, outputId: 16353 },
      { satoshis: 1000, outputId: 16354 },
      { satoshis: 1001, outputId: 16355 },
      { satoshis: 1000, outputId: 16356 },
      { satoshis: 1005, outputId: 16360 },
      { satoshis: 1000, outputId: 16361 },
      { satoshis: 375235, outputId: 16362 },
      { satoshis: 1000, outputId: 16363 },
      { satoshis: 1000, outputId: 16364 },
      { satoshis: 45658, outputId: 16365 },
      { satoshis: 286834, outputId: 16367 },
      { satoshis: 1001, outputId: 16368 },
      { satoshis: 1001, outputId: 16369 },
      { satoshis: 57051, outputId: 16370 },
      { satoshis: 1036, outputId: 16371 },
      { satoshis: 16508, outputId: 16372 },
      { satoshis: 1000, outputId: 16373 },
      { satoshis: 64213, outputId: 16374 },
      { satoshis: 1000, outputId: 16376 },
      { satoshis: 1000, outputId: 16377 },
      { satoshis: 1154, outputId: 16378 },
      { satoshis: 1000, outputId: 16380 },
      { satoshis: 1008, outputId: 16381 },
      { satoshis: 1064, outputId: 16382 },
      { satoshis: 1234, outputId: 16383 },
      { satoshis: 119205, outputId: 16395 },
      { satoshis: 582, outputId: 16397 },
      { satoshis: 2384, outputId: 16399 },
      { satoshis: 4391, outputId: 16401 },
      { satoshis: 600, outputId: 16406 },
      { satoshis: 2599799, outputId: 16407 }
    ]
  }
  const d7: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 1570, lockingScriptLength: 25 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 23082, outputId: 14734 },
      { satoshis: 16496, outputId: 14742 },
      { satoshis: 270789, outputId: 14744 },
      { satoshis: 81520, outputId: 14763 },
      { satoshis: 14759, outputId: 14770 },
      { satoshis: 390625, outputId: 14774 },
      { satoshis: 674234, outputId: 14790 },
      { satoshis: 999799, outputId: 14794 },
      { satoshis: 1000, outputId: 15583 },
      { satoshis: 1000, outputId: 15584 },
      { satoshis: 1000, outputId: 15585 },
      { satoshis: 1000, outputId: 15586 },
      { satoshis: 1000, outputId: 15587 },
      { satoshis: 1000, outputId: 15588 },
      { satoshis: 1025, outputId: 15589 },
      { satoshis: 1000, outputId: 15590 },
      { satoshis: 1000, outputId: 15591 },
      { satoshis: 1000, outputId: 15593 },
      { satoshis: 1000, outputId: 15594 },
      { satoshis: 1000, outputId: 15595 },
      { satoshis: 1000, outputId: 15596 },
      { satoshis: 1000, outputId: 15597 },
      { satoshis: 1316, outputId: 15598 },
      { satoshis: 1000, outputId: 15599 },
      { satoshis: 1000, outputId: 15600 },
      { satoshis: 1000, outputId: 15601 },
      { satoshis: 1426, outputId: 15602 },
      { satoshis: 1000, outputId: 15603 },
      { satoshis: 1000, outputId: 15604 },
      { satoshis: 1000, outputId: 15605 },
      { satoshis: 1000, outputId: 15606 },
      { satoshis: 1000, outputId: 15607 },
      { satoshis: 1000, outputId: 15608 },
      { satoshis: 1000, outputId: 15609 },
      { satoshis: 1004, outputId: 15610 },
      { satoshis: 1000, outputId: 15611 },
      { satoshis: 1013, outputId: 15612 },
      { satoshis: 1001, outputId: 15614 },
      { satoshis: 1000, outputId: 15615 },
      { satoshis: 1000, outputId: 15616 },
      { satoshis: 1000, outputId: 15617 },
      { satoshis: 1000, outputId: 15618 },
      { satoshis: 1000, outputId: 15619 },
      { satoshis: 1006, outputId: 15620 },
      { satoshis: 1000, outputId: 15621 },
      { satoshis: 1000, outputId: 15622 },
      { satoshis: 1000, outputId: 15623 },
      { satoshis: 1000, outputId: 15624 },
      { satoshis: 1032, outputId: 15625 },
      { satoshis: 4571, outputId: 15626 },
      { satoshis: 1000, outputId: 15628 },
      { satoshis: 1000, outputId: 15629 },
      { satoshis: 1087, outputId: 15630 },
      { satoshis: 1000, outputId: 15631 },
      { satoshis: 1000, outputId: 15632 },
      { satoshis: 1001, outputId: 15633 },
      { satoshis: 1001, outputId: 15634 },
      { satoshis: 1000, outputId: 15635 },
      { satoshis: 1000, outputId: 15637 },
      { satoshis: 1001, outputId: 15638 },
      { satoshis: 1000, outputId: 15639 },
      { satoshis: 1000, outputId: 15640 },
      { satoshis: 1000, outputId: 15641 },
      { satoshis: 1000, outputId: 15642 },
      { satoshis: 1000, outputId: 15643 },
      { satoshis: 1036, outputId: 15644 },
      { satoshis: 1000, outputId: 15645 },
      { satoshis: 1000, outputId: 15646 },
      { satoshis: 1000, outputId: 15647 },
      { satoshis: 1000, outputId: 15648 },
      { satoshis: 1001, outputId: 15649 },
      { satoshis: 1000, outputId: 15650 },
      { satoshis: 1050, outputId: 15651 },
      { satoshis: 1273, outputId: 15653 },
      { satoshis: 1029, outputId: 15654 },
      { satoshis: 1524, outputId: 15655 },
      { satoshis: 1817, outputId: 15658 },
      { satoshis: 1041, outputId: 16409 }
    ]
  }
  const d8: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 1564, lockingScriptLength: 25 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 23082, outputId: 14734 },
      { satoshis: 16496, outputId: 14742 },
      { satoshis: 270789, outputId: 14744 },
      { satoshis: 81520, outputId: 14763 },
      { satoshis: 14759, outputId: 14770 },
      { satoshis: 390625, outputId: 14774 },
      { satoshis: 674234, outputId: 14790 },
      { satoshis: 999799, outputId: 14794 },
      { satoshis: 1000, outputId: 15583 },
      { satoshis: 1000, outputId: 15584 },
      { satoshis: 1000, outputId: 15585 },
      { satoshis: 1000, outputId: 15586 },
      { satoshis: 1000, outputId: 15587 },
      { satoshis: 1000, outputId: 15588 },
      { satoshis: 1025, outputId: 15589 },
      { satoshis: 1000, outputId: 15590 },
      { satoshis: 1000, outputId: 15591 },
      { satoshis: 1000, outputId: 15593 },
      { satoshis: 1000, outputId: 15594 },
      { satoshis: 1000, outputId: 15595 },
      { satoshis: 1000, outputId: 15596 },
      { satoshis: 1000, outputId: 15597 },
      { satoshis: 1316, outputId: 15598 },
      { satoshis: 1000, outputId: 15599 },
      { satoshis: 1000, outputId: 15600 },
      { satoshis: 1000, outputId: 15601 },
      { satoshis: 1426, outputId: 15602 },
      { satoshis: 1000, outputId: 15603 },
      { satoshis: 1000, outputId: 15604 },
      { satoshis: 1000, outputId: 15605 },
      { satoshis: 1000, outputId: 15606 },
      { satoshis: 1000, outputId: 15607 },
      { satoshis: 1000, outputId: 15608 },
      { satoshis: 1000, outputId: 15609 },
      { satoshis: 1004, outputId: 15610 },
      { satoshis: 1000, outputId: 15611 },
      { satoshis: 1013, outputId: 15612 },
      { satoshis: 1001, outputId: 15614 },
      { satoshis: 1000, outputId: 15615 },
      { satoshis: 1000, outputId: 15616 },
      { satoshis: 1000, outputId: 15617 },
      { satoshis: 1000, outputId: 15618 },
      { satoshis: 1000, outputId: 15619 },
      { satoshis: 1006, outputId: 15620 },
      { satoshis: 1000, outputId: 15621 },
      { satoshis: 1000, outputId: 15622 },
      { satoshis: 1000, outputId: 15623 },
      { satoshis: 1000, outputId: 15624 },
      { satoshis: 1032, outputId: 15625 },
      { satoshis: 4571, outputId: 15626 },
      { satoshis: 1000, outputId: 15628 },
      { satoshis: 1000, outputId: 15629 },
      { satoshis: 1087, outputId: 15630 },
      { satoshis: 1000, outputId: 15631 },
      { satoshis: 1000, outputId: 15632 },
      { satoshis: 1001, outputId: 15633 },
      { satoshis: 1001, outputId: 15634 },
      { satoshis: 1000, outputId: 15635 },
      { satoshis: 1000, outputId: 15637 },
      { satoshis: 1001, outputId: 15638 },
      { satoshis: 1000, outputId: 15639 },
      { satoshis: 1000, outputId: 15640 },
      { satoshis: 1000, outputId: 15641 },
      { satoshis: 1000, outputId: 15642 },
      { satoshis: 1000, outputId: 15643 },
      { satoshis: 1036, outputId: 15644 },
      { satoshis: 1000, outputId: 15645 },
      { satoshis: 1000, outputId: 15646 },
      { satoshis: 1000, outputId: 15647 },
      { satoshis: 1000, outputId: 15648 },
      { satoshis: 1001, outputId: 15649 },
      { satoshis: 1000, outputId: 15650 },
      { satoshis: 1050, outputId: 15651 },
      { satoshis: 1273, outputId: 15653 },
      { satoshis: 1029, outputId: 15654 },
      { satoshis: 1524, outputId: 15655 },
      { satoshis: 1817, outputId: 15658 },
      { satoshis: 1041, outputId: 16409 }
    ]
  }
  const d9: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 1000, lockingScriptLength: 1136 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 23082, outputId: 14734 },
      { satoshis: 270789, outputId: 14744 },
      { satoshis: 81520, outputId: 14763 },
      { satoshis: 14759, outputId: 14770 },
      { satoshis: 390625, outputId: 14774 },
      { satoshis: 674234, outputId: 14790 },
      { satoshis: 999799, outputId: 14794 },
      { satoshis: 1000, outputId: 15583 },
      { satoshis: 1000, outputId: 15584 },
      { satoshis: 1000, outputId: 15585 },
      { satoshis: 1000, outputId: 15586 },
      { satoshis: 1000, outputId: 15587 },
      { satoshis: 1000, outputId: 15588 },
      { satoshis: 1000, outputId: 15590 },
      { satoshis: 1000, outputId: 15591 },
      { satoshis: 1000, outputId: 15593 },
      { satoshis: 1000, outputId: 15594 },
      { satoshis: 1000, outputId: 15595 },
      { satoshis: 1000, outputId: 15596 },
      { satoshis: 1000, outputId: 15597 },
      { satoshis: 1000, outputId: 15599 },
      { satoshis: 1000, outputId: 15600 },
      { satoshis: 1000, outputId: 15601 },
      { satoshis: 1000, outputId: 15603 },
      { satoshis: 1000, outputId: 15604 },
      { satoshis: 1000, outputId: 15605 },
      { satoshis: 1000, outputId: 15606 },
      { satoshis: 1000, outputId: 15607 },
      { satoshis: 1000, outputId: 15608 },
      { satoshis: 1000, outputId: 15609 },
      { satoshis: 1004, outputId: 15610 },
      { satoshis: 1000, outputId: 15611 },
      { satoshis: 1001, outputId: 15614 },
      { satoshis: 1000, outputId: 15615 },
      { satoshis: 1000, outputId: 15616 },
      { satoshis: 1000, outputId: 15617 },
      { satoshis: 1000, outputId: 15618 },
      { satoshis: 1000, outputId: 15619 },
      { satoshis: 1006, outputId: 15620 },
      { satoshis: 1000, outputId: 15621 },
      { satoshis: 1000, outputId: 15622 },
      { satoshis: 1000, outputId: 15623 },
      { satoshis: 1000, outputId: 15624 },
      { satoshis: 4571, outputId: 15626 },
      { satoshis: 1000, outputId: 15628 },
      { satoshis: 1000, outputId: 15629 },
      { satoshis: 1000, outputId: 15631 },
      { satoshis: 1000, outputId: 15632 },
      { satoshis: 1001, outputId: 15633 },
      { satoshis: 1001, outputId: 15634 },
      { satoshis: 1000, outputId: 15635 },
      { satoshis: 1000, outputId: 15637 },
      { satoshis: 1001, outputId: 15638 },
      { satoshis: 1000, outputId: 15639 },
      { satoshis: 1000, outputId: 15640 },
      { satoshis: 1000, outputId: 15641 },
      { satoshis: 1000, outputId: 15642 },
      { satoshis: 1000, outputId: 15643 },
      { satoshis: 1000, outputId: 15645 },
      { satoshis: 1000, outputId: 15646 },
      { satoshis: 1000, outputId: 15647 },
      { satoshis: 1000, outputId: 15648 },
      { satoshis: 1001, outputId: 15649 },
      { satoshis: 1000, outputId: 15650 },
      { satoshis: 604, outputId: 16421 },
      { satoshis: 958, outputId: 16429 },
      { satoshis: 724, outputId: 16431 },
      { satoshis: 413, outputId: 16433 },
      { satoshis: 915, outputId: 16439 },
      { satoshis: 842, outputId: 16441 },
      { satoshis: 348, outputId: 16451 },
      { satoshis: 339, outputId: 16453 },
      { satoshis: 334, outputId: 16455 },
      { satoshis: 331, outputId: 16457 },
      { satoshis: 330, outputId: 16459 },
      { satoshis: 327, outputId: 16461 },
      { satoshis: 323, outputId: 16463 },
      { satoshis: 311, outputId: 16465 }
    ]
  }
  const d10: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 1, lockingScriptLength: 25 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 110 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 268076, outputId: 16671 },
      { satoshis: 2999799, outputId: 16677 },
      { satoshis: 14030, outputId: 21194 },
      { satoshis: 100925, outputId: 21224 }
    ]
  }
  const d11: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 1, lockingScriptLength: 25 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 110 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 268076, outputId: 16671 },
      { satoshis: 2999799, outputId: 16677 },
      { satoshis: 1396, outputId: 21307 },
      { satoshis: 1023, outputId: 21308 },
      { satoshis: 1000, outputId: 21309 },
      { satoshis: 1000, outputId: 21310 },
      { satoshis: 1000, outputId: 21311 },
      { satoshis: 1220, outputId: 21312 },
      { satoshis: 5573, outputId: 21313 },
      { satoshis: 1000, outputId: 21314 },
      { satoshis: 1000, outputId: 21315 },
      { satoshis: 5926, outputId: 21316 },
      { satoshis: 30814, outputId: 21317 },
      { satoshis: 24441, outputId: 21318 },
      { satoshis: 285, outputId: 21319 },
      { satoshis: 1325, outputId: 21320 },
      { satoshis: 1000, outputId: 21321 },
      { satoshis: 1002, outputId: 21322 },
      { satoshis: 1000, outputId: 21324 },
      { satoshis: 1057, outputId: 21325 },
      { satoshis: 1000, outputId: 21326 },
      { satoshis: 1159, outputId: 21327 },
      { satoshis: 1061, outputId: 21328 },
      { satoshis: 1000, outputId: 21329 },
      { satoshis: 1000, outputId: 21330 },
      { satoshis: 1000, outputId: 21331 },
      { satoshis: 8873, outputId: 21332 },
      { satoshis: 1001, outputId: 21333 },
      { satoshis: 1011, outputId: 21334 },
      { satoshis: 1000, outputId: 21335 },
      { satoshis: 13699, outputId: 21336 }
    ]
  }
  const d12: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 1, lockingScriptLength: 25 },
        { satoshis: 200, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 110 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 268076, outputId: 16671 },
      { satoshis: 2999799, outputId: 16677 },
      { satoshis: 14030, outputId: 21194 },
      { satoshis: 100925, outputId: 21224 }
    ]
  }
  const d13: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [
        { satoshis: 500, lockingScriptLength: 194 },
        { satoshis: 2, lockingScriptLength: 25 }
      ],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107
    },
    availableChange: [
      { satoshis: 285, outputId: 16190 },
      { satoshis: 1012, outputId: 18487 },
      { satoshis: 1013, outputId: 18488 },
      { satoshis: 1000, outputId: 18489 },
      { satoshis: 1087, outputId: 18490 },
      { satoshis: 290, outputId: 18491 },
      { satoshis: 1034, outputId: 18492 }
    ]
  }
  const d14: TestCase = {
    p: {
      fixedInputs: [],
      fixedOutputs: [{ satoshis: 3, lockingScriptLength: 141 }],
      feeModel: { model: 'sat/kb', value: 2 },
      changeInitialSatoshis: 1000,
      changeFirstSatoshis: 285,
      changeLockingScriptLength: 25,
      changeUnlockingScriptLength: 107,
      targetNetCount: 22
    },
    availableChange: [
      { satoshis: 995, outputId: 16190 },
      { satoshis: 1000, outputId: 18487 },
      { satoshis: 1000, outputId: 18488 },
      { satoshis: 1000, outputId: 18489 },
      { satoshis: 1000, outputId: 18490 },
      { satoshis: 1000, outputId: 18491 },
      { satoshis: 1000, outputId: 18492 },
      { satoshis: 1000, outputId: 18493 },
      { satoshis: 1000, outputId: 18494 },
      { satoshis: 1000, outputId: 18495 },
      { satoshis: 100, outputId: 18496 }
    ]
  }

  const test8Cases = [
    {
      n: 14,
      d: d14,
      er: '{"allocatedChangeInputs":[{"satoshis":1000,"outputId":18495,"spendable":false}],"changeOutputs":[{"satoshis":996,"lockingScriptLength":25}],"size":342,"fee":1,"satsPerKb":2}'
    },
    {
      n: 13,
      d: d13,
      er: '{"allocatedChangeInputs":[{"satoshis":1000,"outputId":18489,"spendable":false}],"changeOutputs":[{"satoshis":497,"lockingScriptLength":25}],"size":429,"fee":1,"satsPerKb":2}'
    },
    {
      n: 12,
      d: d12,
      er: '{"allocatedChangeInputs":[{"satoshis":14030,"outputId":21194,"spendable":false}],"changeOutputs":[{"satoshis":13800,"lockingScriptLength":25}],"size":260,"fee":29,"satsPerKb":110}'
    },
    {
      n: 11,
      d: d11,
      er: '{"allocatedChangeInputs":[{"satoshis":285,"outputId":21319,"spendable":false},{"satoshis":1000,"outputId":21309,"spendable":false}],"changeOutputs":[{"satoshis":1039,"lockingScriptLength":25}],"size":408,"fee":45,"satsPerKb":110}'
    },
    {
      n: 10,
      d: d10,
      er: '{"allocatedChangeInputs":[{"satoshis":14030,"outputId":21194,"spendable":false}],"changeOutputs":[{"satoshis":13800,"lockingScriptLength":25}],"size":260,"fee":29,"satsPerKb":110}'
    },
    {
      n: 9,
      d: d9,
      er: '{"allocatedChangeInputs":[{"satoshis":4571,"outputId":15626,"spendable":false}],"changeOutputs":[{"satoshis":3368,"lockingScriptLength":25}],"size":1373,"fee":3,"satsPerKb":2}'
    },
    {
      n: 8,
      d: d8,
      er: '{"allocatedChangeInputs":[{"satoshis":1817,"outputId":15658,"spendable":false}],"changeOutputs":[{"satoshis":52,"lockingScriptLength":25}],"size":260,"fee":1,"satsPerKb":2}'
    },
    {
      n: 7,
      d: d7,
      er: '{"allocatedChangeInputs":[{"satoshis":1817,"outputId":15658,"spendable":false}],"changeOutputs":[{"satoshis":46,"lockingScriptLength":25}],"size":260,"fee":1,"satsPerKb":2}'
    },
    {
      n: 6,
      d: d6,
      er: '{"allocatedChangeInputs":[{"satoshis":1000,"outputId":16346,"spendable":false}],"changeOutputs":[{"satoshis":298,"lockingScriptLength":25}],"size":673,"fee":2,"satsPerKb":2}'
    },
    {
      n: 5,
      d: d5,
      er: '{"allocatedChangeInputs":[],"changeOutputs":[{"satoshis":799,"lockingScriptLength":25}],"size":191,"fee":1,"satsPerKb":2}'
    }
  ]

  test('8 paramsText d5 d6 d7 d8 d9 d10 d11 d12 d13 d14', async () => {
    for (const { n, d, er } of test8Cases) {
      const params: GenerateChangeSdkParams = { ...d.p }
      const availableChange: GenerateChangeSdkChangeInput[] = [...d.availableChange]

      const { allocateChangeInput, releaseChangeInput } = generateChangeSdkMakeStorage(availableChange)

      const r = await generateChangeSdk(params, allocateChangeInput, releaseChangeInput)
      expect(JSON.stringify(r)).toBe(er)
      expectTransactionSize(params, r)
    }
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function expectToThrowWERR<R>(expectedClass: new (...args: any[]) => any, fn: () => Promise<R>): Promise<void> {
  try {
    await fn()
  } catch (eu: unknown) {
    const e = sdk.WalletError.fromUnknown(eu)
    expect(e.name).toBe(expectedClass.name)
    expect(e.isError).toBe(true)
    return
  }
  throw new Error(`${expectedClass.name} was not thrown`)
}

function makeTransaction(params: GenerateChangeSdkParams, results: GenerateChangeSdkResult): BsvTransaction {
  const tx = new BsvTransaction()
  for (const i of params.fixedInputs) {
    tx.inputs.push({
      unlockingScript: Script.fromBinary(Array(i.unlockingScriptLength).fill(0)),
      sourceOutputIndex: 0,
      sourceTXID: '00'.repeat(32)
    })
  }
  for (const i of results.allocatedChangeInputs) {
    tx.inputs.push({
      unlockingScript: Script.fromBinary(Array(params.changeUnlockingScriptLength).fill(0)),
      sourceOutputIndex: 0,
      sourceTXID: '00'.repeat(32)
    })
  }
  for (const o of params.fixedOutputs) {
    tx.outputs.push({
      lockingScript: Script.fromBinary(Array(o.lockingScriptLength).fill(0)),
      satoshis: o.satoshis
    })
  }
  for (const o of results.changeOutputs) {
    tx.outputs.push({
      lockingScript: Script.fromBinary(Array(o.lockingScriptLength).fill(0)),
      satoshis: o.satoshis
    })
  }
  return tx
}

function expectTransactionSize(params: GenerateChangeSdkParams, results: GenerateChangeSdkResult) {
  const tx = makeTransaction(params, results)
  const size = tx.toBinary().length
  if (size !== results.size) throw new sdk.WERR_INTERNAL(`expectTransaction actual ${size} expected ${results.size}`)
}

const defParams: GenerateChangeSdkParams = {
  fixedInputs: [],
  fixedOutputs: [],
  feeModel: { model: 'sat/kb', value: 2 },
  changeInitialSatoshis: 1000,
  changeFirstSatoshis: 285,
  changeLockingScriptLength: 25,
  changeUnlockingScriptLength: 107,
  randomVals: [...randomValsUsed1]
}

const _defAvailableChange: GenerateChangeSdkChangeInput[] = [
  { satoshis: 6323, outputId: 15005 },
  { satoshis: 1004, outputId: 15011 },
  { satoshis: 1000, outputId: 15013 },
  { satoshis: 1000, outputId: 15017 },
  { satoshis: 1000, outputId: 15023 },
  { satoshis: 1000, outputId: 15027 },
  { satoshis: 1000, outputId: 15034 },
  { satoshis: 1575097, outputId: 15101 },
  { satoshis: 16417, outputId: 15103 },
  { satoshis: 3377, outputId: 15104 },
  { satoshis: 10735, outputId: 15106 }
]
const defAvailableChange = (): GenerateChangeSdkChangeInput[] => JSON.parse(JSON.stringify(_defAvailableChange))
