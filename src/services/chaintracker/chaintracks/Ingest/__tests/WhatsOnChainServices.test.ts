import { wait } from '../../../../../utility/utilityHelpers'
import { BlockHeader } from '../../Api/BlockHeaderApi'
import { deserializeBaseBlockHeader, deserializeBlockHeader } from '../../util/blockHeaderUtilities'
import { ChaintracksFetch } from '../../util/ChaintracksFetch'
import { ChaintracksFs } from '../../util/ChaintracksFs'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices } from '../WhatsOnChainServices'

describe('WhatsOnChainServices tests', () => {
  jest.setTimeout(999999999)

  const options = WhatsOnChainServices.createWhatsOnChainServicesOptions('main')
  const woc = new WhatsOnChainServices(options)

  test('getHeaderByHash', async () => {
    const header = await woc.getHeaderByHash('000000000000000001b3e99847d57ff3e0bfc4222cea5c29f10bf24387a250a2')
    expect(header?.height === 781348).toBe(true)
  })

  test('getChainTipHeight', async () => {
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)
  })

  test('0 listenForOldBlockHeaders', async () => {
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)

    const headersOld: BlockHeader[] = []
    const errorsOld: { code: number; message: string }[] = []
    const okOld = await woc.listenForOldBlockHeaders(
      height - 4,
      height,
      h => headersOld.push(h),
      (code, message) => {
        errorsOld.push({ code, message })
        return true
      }
    )
    expect(okOld).toBe(true)
    expect(errorsOld.length).toBe(0)
    expect(headersOld.length >= 4).toBe(true)
  })

  test('1 listenForNewBlockHeaders', async () => {
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)

    // Comment out this line to just wait for next new header...
    //setTimeout(() => woc.stopNewListener(), 5000)
    const headersNew: BlockHeader[] = []
    const errorsNew: { code: number; message: string }[] = []
    const eh: EnqueueHandler = h => {
      headersNew.push(h)
      if (headersNew.length >= 1) woc.stopNewListener()
    }
    const errh: ErrorHandler = (code, message) => {
      errorsNew.push({ code, message })
      return true
    }
    const okNew = await woc.listenForNewBlockHeaders(eh, errh)
    if (errorsNew.length > 0) console.log(JSON.stringify(errorsNew))
    expect(errorsNew.length).toBe(0)
    expect(okNew).toBe(true)
    expect(headersNew.length >= 0).toBe(true)
  })

  test('2 get latest header bytes', async () => {
    const fetch = new ChaintracksFetch()

    for (;;) {
      const bytes = await fetch.download(`https://api.whatsonchain.com/v1/bsv/main/block/headers/latest`)
      console.log(`headers: ${bytes.length / 80}`)
      const latest = await fetch.download(`https://api.whatsonchain.com/v1/bsv/main/block/headers/latest?count=1`)
      const bh = deserializeBlockHeader(latest, 0, 0)
      console.log(`latest hash: ${bh.hash} at ${new Date().toISOString()}`)
      await wait(60 * 1000)
    }
  })

  test('3 get headers', async () => {
    const fetch = new ChaintracksFetch()

    for (;;) {
      const headers = await fetch.fetchJson<WoCGetHeadersHeader[]>(`https://api.whatsonchain.com/v1/bsv/main/block/headers`)
      let log = ''
      for (const h of headers) {
        log += `${h.height} ${h.hash} ${h.confirmations} ${h.nTx}\n`
      }
      console.log(`${new Date().toISOString()}\n${log}`)
      await wait(60 * 1000)
    }
  })
})

export interface WoCGetHeadersHeader {
  hash: string
  confirmations: number
  size: number
  height: number
  version: number
  versionHex: string
  merkleroot: string
  time: number
  mediantime: number
  nonce: number
  bits: string
  difficulty: number
  chainwork: string
  previousblockhash: string
  nextblockhash: string
  nTx: number
  num_tx: number
}