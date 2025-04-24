import { _tu, TestSetup1 } from '../../utils/TestUtilsWalletStorage'
import { sdk, StorageProvider, StorageProviderOptions } from '../../../src/index.client'
import { StorageIdb } from '../../../src/storage/StorageIdb'

import 'fake-indexeddb/auto'

describe('idb count tests', () => {
  jest.setTimeout(99999999)

  const chain: sdk.Chain = 'test'
  const env = _tu.getEnv(chain)
  let setups: { setup: TestSetup1; storage: StorageProvider }[] = []

  beforeEach(async () => {
    const options: StorageProviderOptions = StorageProvider.createStorageBaseOptions(chain)
    const storage = new StorageIdb(options)
    await storage.dropAllData()
    await storage.migrate('idb find tests', '1'.repeat(64))
    await storage.makeAvailable()
    const setup = await _tu.createTestSetup1(storage)
    setups = [{ setup, storage }]
  })

  afterEach(async () => {
    for (const { storage } of setups) {
      await storage.destroy()
    }
  })

  test('0 count ProvenTx', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countProvenTxs({ partial: {} })).toBe(1)
    }
  })

  test('1 count ProvenTxReq', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countProvenTxReqs({ partial: {} })).toBe(2)
    }
  })

  test('2 count User', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countUsers({ partial: {} })).toBe(2)
    }
  })

  test('3 count Certificate', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countCertificates({ partial: {} })).toBe(3)
      expect(
        await storage.countCertificates({
          partial: {},
          certifiers: [setup.u1cert1.certifier]
        })
      ).toBe(1)
      expect(await storage.countCertificates({ partial: {}, certifiers: ['none'] })).toBe(0)
      expect(
        await storage.countCertificates({
          partial: {},
          types: [setup.u1cert2.type]
        })
      ).toBe(1)
      expect(await storage.countCertificates({ partial: {}, types: ['oblongata'] })).toBe(0)
    }
  })

  test('4 count CertificateField', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countCertificateFields({ partial: {} })).toBe(3)
      expect(
        await storage.countCertificateFields({
          partial: { userId: setup.u1.userId }
        })
      ).toBe(3)
      expect(
        await storage.countCertificateFields({
          partial: { userId: setup.u2.userId }
        })
      ).toBe(0)
      expect(await storage.countCertificateFields({ partial: { userId: 99 } })).toBe(0)
      expect(await storage.countCertificateFields({ partial: { fieldName: 'name' } })).toBe(2)
      expect(await storage.countCertificateFields({ partial: { fieldName: 'bob' } })).toBe(1)
      expect(
        await storage.countCertificateFields({
          partial: { fieldName: 'bob42' }
        })
      ).toBe(0)
    }
  })

  test('5 count OutputBasket', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countOutputBaskets({ partial: {} })).toBe(3)
      expect(
        await storage.countOutputBaskets({
          partial: {},
          since: setup.u1.created_at
        })
      ).toBe(3)
      expect(await storage.countOutputBaskets({ partial: {}, since: new Date() })).toBe(0)
    }
  })

  test('6 count Transaction', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countTransactions({ partial: {} })).toBe(3)
    }
  })

  test('7 count Commission', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countCommissions({ partial: {} })).toBe(3)
    }
  })

  test('8 count Output', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countOutputs({ partial: {} })).toBe(3)
    }
  })

  test('9 count OutputTag', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countOutputTags({ partial: {} })).toBe(2)
    }
  })

  test('10 count OutputTagMap', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countOutputTagMaps({ partial: {} })).toBe(3)
    }
  })

  test('11 count TxLabel', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countTxLabels({ partial: {} })).toBe(3)
    }
  })

  test('12 count TxLabelMap', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countTxLabelMaps({ partial: {} })).toBe(3)
    }
  })

  test('13 count MonitorEvent', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countMonitorEvents({ partial: {} })).toBe(1)
    }
  })

  test('14 count SyncState', async () => {
    for (const { storage, setup } of setups) {
      expect(await storage.countSyncStates({ partial: {} })).toBe(1)
    }
  })
})
