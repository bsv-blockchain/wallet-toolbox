import { before } from "node:test"
import { _tu } from "../../../test/utils/TestUtilsWalletStorage"
import { Setup } from "../../Setup"
import { StorageKnex } from "../StorageKnex"

describe('storage adminStats tests', () => {
    jest.setTimeout(99999999)

    const env = _tu.getEnv('main')
    const knex = Setup.createMySQLKnex(process.env.MAIN_CLOUD_MYSQL_CONNECTION!)
    const storage = new StorageKnex({
        chain: env.chain,
        knex: knex,
        commissionSatoshis: 0,
        commissionPubKeyHex: undefined,
        feeModel: { model: 'sat/kb', value: 1 }
    })

    beforeAll(async () => {
        await storage.makeAvailable()
    })
    afterAll(async () => {
        await storage.destroy()
    })

    test('0 adminStats', async () => {
       const r = await storage.adminStats(env.identityKey)
       expect(r.requestedBy).toBe(env.identityKey)
       expect(r.usersTotal).toBeGreaterThan(0)
    })
})