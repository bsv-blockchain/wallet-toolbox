import { wait } from '../../../../../utility/utilityHelpers'
import { BlockHeader } from '../../Api/BlockHeaderApi'
import { LiveIngestorWhatsOnChainPoll } from '../LiveIngestorWhatsOnChainPoll'

describe('LiveIngestorWhatsOnChainPoll tests', () => {
  jest.setTimeout(99999999)

  test('0 listen for first new header', async () => {
    const liveHeaders: BlockHeader[] = []
    const options = LiveIngestorWhatsOnChainPoll.createLiveIngestorWhatsOnChainOptions('main')
    const ingestor = new LiveIngestorWhatsOnChainPoll(options)
    const p = ingestor.startListening(liveHeaders)
    let log = ''
    let count = 0
    for (;;) {
      const h = liveHeaders.shift()
      if (h) {
        log += `${h.height} ${h.hash}\n`
        count++
      } else {
        if (log) {
          console.log(`LiveIngestorWhatsOnChain received ${count} headers:\n${log}`)
          log = ''
          break
        }
        //if (count >= 11) break
        await wait(100)
      }
    }
    ingestor.stopListening()
    await p
  })
})
