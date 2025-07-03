import { createDefaultChaintracksOptions } from '../createDefaultChaintracksOptions'
import { Chaintracks } from '../Chaintracks'

describe('Chaintracks tests', () => {
  jest.setTimeout(99999999)

  test('0 basic operation testnet', async () => {
    const o = createDefaultChaintracksOptions('test')
    const c = new Chaintracks(o)
    const listening = c.startListening()
    await c.listening()

    await c.stopListening()
    await listening
    await c.shutdown()
  })
})
