//import { TeranodeListener } from '../../../../services/providers/TeranodeListener'
import { wait } from '../../../../utility/utilityHelpers'

const datas: Uint8Array[] = []
const jsons: object[] = []

const startMsecs = Date.now()

describe('ts-p2p tests', () => {
  jest.setTimeout(99999999)

  test('0_', async () => {
    // Define callback functions for different topics
    const blockCallback = (data: Uint8Array, topic: string, from: string) => {
      console.log(`New block received from ${from}:`, data, topic)
      datas.push(data)
      const json = JSON.parse(new TextDecoder().decode(data))
      jsons.push({
        secs: (Date.now() - startMsecs) / 1000,
        topic,
        from,
        json
      })
    }

    const subtreeCallback = (data: Uint8Array, topic: string, from: string) => {
      console.log(`Subtree update from ${from}:`, data)
      // Process subtree data here
    }

    const { TeranodeListener } = await import('../../../../services/providers/TeranodeListener')

    // Create listener with topic callbacks
    const listener = new TeranodeListener({
      'bitcoin/mainnet-block': blockCallback
      //'bitcoin/mainnet-subtree': subtreeCallback
    })

    // The listener starts automatically and connects to Teranode mainnet
    console.log('Listener started and waiting for messages...')

    for (;;) {
      await wait(10000)
      if (datas.length > 10) break
    }

    debugger
    for (const data of datas) {
      console.log('Received data:', data)
    }
  })
})
