import { _tu } from '../../utils/TestUtilsWalletStorage'

import 'fake-indexeddb/auto'

describe('idbSpeed tests', () => {
    jest.setTimeout(99999999)

    const testName = () => expect.getState().currentTestName || 'test'

    /**
     * Starting speed 2025-04-18 07:58 was 66+ seconds
     */
    test('0 copy legacy wallet', async () => {
        const databaseName = testName()
        const setup = await _tu.createIdbLegacyWalletCopy(databaseName)
        expect(setup.activeStorage).toBeTruthy()
    })
})
