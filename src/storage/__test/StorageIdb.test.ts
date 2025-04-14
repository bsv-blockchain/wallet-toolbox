import { StorageIdb } from "../StorageIdb";
import { StorageProvider, StorageProviderOptions } from "../StorageProvider"
import 'fake-indexeddb/auto';

describe('StorageIdb tests', () => {
    jest.setTimeout(99999999)

    test('0', async () => {
       const options: StorageProviderOptions = StorageProvider.createStorageBaseOptions('main');
       const storage = new StorageIdb(options)
       const r = await storage.migrate('storageIdbTest', `42`.repeat(32))
       const db = storage.db!
       expect(db).toBeTruthy()
    })
})