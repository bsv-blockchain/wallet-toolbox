import { _tu, TestSetup1 } from '../../utils/TestUtilsWalletStorage'
import { sdk, StorageProvider, StorageProviderOptions } from '../../../src/index.client'

import { StorageIdb } from '../../../src/storage/StorageIdb'

import 'fake-indexeddb/auto'

describe('idb find tests', () => {
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

  test('0 find ProvenTx', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findProvenTxs({ partial: {} })).length).toBe(1)
    }
  })

  test('1 find ProvenTxReq', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findProvenTxReqs({ partial: {} })).length).toBe(2)
    }
  })

  test('2 find User', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findUsers({ partial: {} })).length).toBe(2)
    }
  })

  test('3 find Certificate', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findCertificates({ partial: {} })).length).toBe(3)
      expect(
        (
          await storage.findCertificates({
            partial: {},
            certifiers: [setup.u1cert1.certifier]
          })
        ).length
      ).toBe(1)
      expect((await storage.findCertificates({ partial: {}, certifiers: ['none'] })).length).toBe(0)
      expect(
        (
          await storage.findCertificates({
            partial: {},
            types: [setup.u1cert2.type]
          })
        ).length
      ).toBe(1)
      expect((await storage.findCertificates({ partial: {}, types: ['oblongata'] })).length).toBe(0)
    }
  })

  test('4 find CertificateField', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findCertificateFields({ partial: {} })).length).toBe(3)
      expect(
        (
          await storage.findCertificateFields({
            partial: { userId: setup.u1.userId }
          })
        ).length
      ).toBe(3)
      expect(
        (
          await storage.findCertificateFields({
            partial: { userId: setup.u2.userId }
          })
        ).length
      ).toBe(0)
      expect((await storage.findCertificateFields({ partial: { userId: 99 } })).length).toBe(0)
      expect(
        (
          await storage.findCertificateFields({
            partial: { fieldName: 'name' }
          })
        ).length
      ).toBe(2)
      expect((await storage.findCertificateFields({ partial: { fieldName: 'bob' } })).length).toBe(1)
      expect(
        (
          await storage.findCertificateFields({
            partial: { fieldName: 'bob42' }
          })
        ).length
      ).toBe(0)
    }
  })

  test('5 find OutputBasket', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findOutputBaskets({ partial: {} })).length).toBe(3)
      expect(
        (
          await storage.findOutputBaskets({
            partial: {},
            since: setup.u1.created_at
          })
        ).length
      ).toBe(3)
      expect((await storage.findOutputBaskets({ partial: {}, since: new Date() })).length).toBe(0)
    }
  })

  test('6 find Transaction', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findTransactions({ partial: {} })).length).toBe(3)
    }
  })

  test('7 find Commission', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findCommissions({ partial: {} })).length).toBe(3)
    }
  })

  test('8 find Output', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findOutputs({ partial: {} })).length).toBe(3)
    }
  })

  test('9 find OutputTag', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findOutputTags({ partial: {} })).length).toBe(2)
    }
  })

  test('10 find OutputTagMap', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findOutputTagMaps({ partial: {} })).length).toBe(3)
    }
  })

  test('11 find TxLabel', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findTxLabels({ partial: {} })).length).toBe(3)
    }
  })

  test('12 find TxLabelMap', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findTxLabelMaps({ partial: {} })).length).toBe(3)
    }
  })

  test('13 find MonitorEvent', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findMonitorEvents({ partial: {} })).length).toBe(1)
    }
  })

  test('14 find SyncState', async () => {
    for (const { storage, setup } of setups) {
      expect((await storage.findSyncStates({ partial: {} })).length).toBe(1)
    }
  })
})
