import { wait } from '../../../../../utility/utilityHelpers'
import { BlockHeader } from '../../Api/BlockHeaderApi'
import { deserializeBaseBlockHeader, deserializeBlockHeader } from '../../util/blockHeaderUtilities'
import { ChaintracksFetch } from '../../util/ChaintracksFetch'
import { ChaintracksFs } from '../../util/ChaintracksFs'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices, WocGetHeadersHeader } from '../WhatsOnChainServices'
import { StopListenerToken, WocHeadersBulkListener, WocHeadersLiveListener } from '../WhatsOnChainIngestorWs'
import { Chain } from '../../../../../sdk'
import { URL } from 'url'
import { HeightRange } from '../../util/HeightRange'

describe('WhatsOnChainServices tests', () => {
  jest.setTimeout(999999999)

  const chain: Chain = 'main'
  const options = WhatsOnChainServices.createWhatsOnChainServicesOptions(chain)
  const woc = new WhatsOnChainServices(options)

  test('getHeaderByHash', async () => {
    const header = await woc.getHeaderByHash('000000000000000001b3e99847d57ff3e0bfc4222cea5c29f10bf24387a250a2')
    expect(header?.height === 781348).toBe(true)
  })

  test('getChainTipHeight', async () => {
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)
  })

  const stopOldListenersToken: StopListenerToken = { stop: undefined }
  function stopOldListener() {
    stopOldListenersToken.stop?.()
  }

  test.skip('0 listenForOldBlockHeaders', async () => {
    // The service this depends on appears to be deprecated...
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)

    const headersOld: BlockHeader[] = []
    const errorsOld: { code: number; message: string }[] = []
    const okOld = await WocHeadersBulkListener(
      height - 4,
      height,
      h => headersOld.push(h),
      (code, message) => {
        errorsOld.push({ code, message })
        return true
      },
      stopOldListenersToken,
      chain
    )
    expect(okOld).toBe(true)
    expect(errorsOld.length).toBe(0)
    expect(headersOld.length >= 4).toBe(true)
  })

  const stopNewListenersToken: StopListenerToken = { stop: undefined }

  test.skip('1 listenForNewBlockHeaders', async () => {
    // The service this depends on appears to be deprecated...
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)

    // Comment out this line to just wait for next new header...
    //setTimeout(() => woc.stopNewListener(), 5000)
    const headersNew: BlockHeader[] = []
    const errorsNew: { code: number; message: string }[] = []
    const eh: EnqueueHandler = h => {
      headersNew.push(h)
      if (headersNew.length >= 1) stopNewListenersToken.stop?.()
    }
    const errh: ErrorHandler = (code, message) => {
      errorsNew.push({ code, message })
      return true
    }
    const okNew = await WocHeadersLiveListener(eh, errh, stopNewListenersToken, chain)
    if (errorsNew.length > 0) console.log(JSON.stringify(errorsNew))
    expect(errorsNew.length).toBe(0)
    expect(okNew).toBe(true)
    expect(headersNew.length >= 0).toBe(true)
  })

  test('2 get latest header bytes', async () => {
    const fetch = new ChaintracksFetch()

    //for (;;) {
    const bytes = await fetch.download(`https://api.whatsonchain.com/v1/bsv/main/block/headers/latest`)
    console.log(`headers: ${bytes.length / 80}`)
    const latest = await fetch.download(`https://api.whatsonchain.com/v1/bsv/main/block/headers/latest?count=1`)
    const bh = deserializeBlockHeader(latest, 0, 0)
    console.log(`latest hash: ${bh.hash} at ${new Date().toISOString()}`)
    //  await wait(60 * 1000)
    //}
  })

  test('3 get headers', async () => {
    const fetch = new ChaintracksFetch()

    //for (;;) {
    const headers = await fetch.fetchJson<WocGetHeadersHeader[]>(
      `https://api.whatsonchain.com/v1/bsv/main/block/headers`
    )
    let log = ''
    for (const h of headers) {
      log += `${h.height} ${h.hash} ${h.confirmations} ${h.nTx}\n`
    }
    console.log(`${new Date().toISOString()}\n${log}`)
    //await wait(60 * 1000)
    //}
  })

  test('4 get header byte file links', async () => {
    const fetch = new ChaintracksFetch()
    const woc = new WhatsOnChainServices(WhatsOnChainServices.createWhatsOnChainServicesOptions('main'))
    const files = await woc.getHeaderByteFileLinks(new HeightRange(907123, 911000))
    expect(files.length).toBe(3)
    expect(files[0].range.minHeight).toBe(906001)
    expect(files[0].range.maxHeight).toBe(908000)
    expect(files[1].range.minHeight).toBe(908001)
    expect(files[1].range.maxHeight).toBe(910000)
    expect(files[2].range.minHeight).toBe(910001)
    expect(files[2].range.maxHeight).toBeGreaterThan(910001)
  })
})
