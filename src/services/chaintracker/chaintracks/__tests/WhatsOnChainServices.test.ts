import { BlockHeader } from '../Api/BlockHeaderApi'
import { EnqueueHandler, ErrorHandler, WhatsOnChainServices } from '../Ingest/WhatsOnChainServices'

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

  test('listenForOldBlockHeaders', async () => {
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

  test('listenForNewBlockHeaders', async () => {
    const height = await woc.getChainTipHeight()
    expect(height > 600000).toBe(true)

    // Comment out this line to just wait for next new header...
    setTimeout(() => woc.stopNewListener(), 5000)
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
})
