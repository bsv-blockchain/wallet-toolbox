import WebSocket from 'ws'
import { convertWocToBlockHeaderHex, WhatsOnChain } from '../../../providers/WhatsOnChain'
import { wait } from '../../../../utility/utilityHelpers'
import { Chain } from '../../../../sdk/types'
import { BlockHeader } from '../../../../sdk/WalletServices.interfaces'

const logger = console.log.bind(console)

export type StopListenerToken = { stop: (() => void) | undefined }

async function getWhatsOnChainTipHeight(chain: Chain = 'main', apiKey?: string): Promise<number> {
  const config = apiKey ? { apiKey } : {}
  const woc = new WhatsOnChain(chain, config)
  const chainInfo = await woc.getChainInfo()
  return chainInfo.blocks
}

/**
 * High speed WebSocket based based old block header listener
 * @param fromHeight
 * @param enqueue returns headers received from WebSocket service
 * @param error notifies of abnormal events, return false to close websocket, true to ignore the error.
 * @param stop an object with a stop property which gets set to a method to stop listener
 * @param chain 'test' | 'main'
 * @param idleWait how many milliseconds to timeout between completion checks.
 * @returns true on normal completion, false if should restart if no error received.
 */
export async function WocHeadersBulkListener(
  fromHeight: number,
  toHeight: number,
  enqueue: (header: BlockHeader) => void,
  error: (code: number, message: string) => boolean,
  stop: StopListenerToken,
  chain: Chain = 'main',
  idleWait = 5000
): Promise<boolean> {
  //logger(`WocHeadersBulkListener from ${fromHeight} to ${toHeight} on ${chain} chain`)

  let done = false
  let count = 0
  let ping = 0
  let ok = false
  let wsIsOpen = false

  function stopNow(): void {
    ok = true
    if (wsIsOpen) {
      wsIsOpen = false
      ws.close()
    } else done = true
  }

  stop.stop = stopNow

  const webSocketUrl =
    chain === 'test'
      ? `wss://socket-v2-testnet.whatsonchain.com/websocket/blockheaders/history?from=${fromHeight}&to=${toHeight}`
      : `wss://socket-v2.whatsonchain.com/websocket/blockheaders/history?from=${fromHeight}&to=${toHeight}`

  function processData(rawData) {
    if (rawData.length === 0) {
      ping++
      return
    }

    const typicalrawDataAsOf20250710BufferThatParsesTo = `{
      "channel": "blockHeaders",
      "pub": {
        "data": {
          "version": 635068416,
          "previousblockhash": "000000000000000005f5778823b824dedf49a503aac60ae153471a3e737d1b1b",
          "merkleroot": "617e2ce2c1348ec1b35ac727cad8bdec33b1b4b983bb00ba2583af4fe1e25ef7",
          "time": 1752133908,
          "bits": 403904562,
          "nonce": 1932754962,
          "hash": "00000000000000000670c88b898aadf911ecf4bc6ba4b71f9b319df47f022b8a",
          "height": 904889
        }
      }
    }`
    // Earlier data formats...
    // "{\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{\"data\":{\"hash\":\"00000000000000000ce16106e2100b893f3da5989ef23cbac52eb568cf803dc1\",\"confirmations\":8,\"size\":3345869,\"height\":779890,\"version\":939515904,\"versionHex\":\"37ffe000\",\"merkleroot\":\"92e3d1d72d432c9216d296839eaa675b6ffb40ccf6e1a02229caf3d769dc0a5f\",\"txcount\":10757,\"time\":1676851109,\"mediantime\":1676849009,\"nonce\":4216995243,\"bits\":\"180e38cb\",\"difficulty\":77310268438.5808,\"chainwork\":\"00000000000000000000000000000000000000000142d5cf97c0ed497eae1066\",\"previousblockhash\":\"0000000000000000053d26b7b35a76bf2b672428bae591bc033ae99f9873697a\",\"nextblockhash\":\"000000000000000000e1a110376966033507953d50ade86eadef7226843f3349\"}}}"

    // Returned rawData may be a Buffer...
    const data = JSON.parse(rawData)
    switch (data.type || 0) {
      case 0:
        // last wocHeader has empty string for nextBlockHash
        // eslint-disable-next-line no-case-declarations
        if (!done) {
          const json = JSON.stringify(data)
          if (json === '{}') {
            ws.send('ping')
          } else if (data.connect) {
            logger(json)
          } else if (data.pub) {
            //logger(json)
            const wocHeader = data.pub.data
            if (wocHeader) {
              const header = convertWocToBlockHeaderHex(wocHeader)
              enqueue(header)
              count++
              if (header.height >= toHeight) {
                ok = true
                done = true
                ws.close()
              }
            }
          } else {
            error(42, `unknown data ${json}`)
          }
        }
        break
      case 3:
        break // Unsubscribe "{\"type\":3,\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{}}"
      case 5:
        break // console.log('subscribed to a channel ' + data.channel)
      case 6:
        break // subscribe "{\"type\":6,\"data\":{\"client\":\"c91c044b-66f5-4172-b509-82c11a41d7fc\",\"subs\":{\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\":{}},\"session\":\"d8693511-5bc8-4815-beb6-8ae1bdaaf3a6\"}}"
      case 7:
        // If you don't close after unsubscribe or end of headers, after a delay, this is received.
        // "{\"type\":7,\"data\":{\"code\":200,\"reason\":\"Data Delivered\"}}"
        error(data.data.code, JSON.stringify(data.data))
        ws.close()
        break
      default:
        error(42, `unknown rawData ${rawData}`)
        ws.close()
    }
  }

  const ws = new WebSocket(webSocketUrl)

  ws.onopen = function (this, evt) {
    //logger(`WoC ${new Date().toISOString()} addHeaders from ${fromHeight} on ${chain}`)
    // This is required to trigger connect on server side.
    ws.send(JSON.stringify({}))
    wsIsOpen = true
  }

  ws.onerror = function (this, evt) {
    // if (evt.message.startsWith('getaddrinfo ENOTFOUND')) {
    let code = -1
    switch (evt.message) {
      case 'Unexpected server response: 403':
        code = 403
        break
      case 'Unexpected server response: 404':
        code = 404
        break
      default:
        break
    }
    const ignoreError = error(code, evt.message)
    if (!ignoreError) ws.close()
  }

  ws.onclose = function (this, ev) {
    // ok should be true if we got the last header, false otherwise.
    // error will have been called with anything abnormal...
    //logger(`WoC ${new Date().toISOString()} addHeaders input service closed`)
    done = true
  }

  ws.onmessage = function (this, ev) {
    // console.log("onmessage:", JSON.stringify(ev.data));
    processData(ev.data)
  }

  // Allow this many wait repetitions for first header, then expect the headers to keep coming
  const firstHeaderCycles = 12
  let waitCycles = 0

  while (!done) {
    const qlPreWait = count
    await wait(idleWait)
    const qlPostWait = count

    if (waitCycles > firstHeaderCycles && !done && qlPreWait === 0 && (qlPreWait === qlPostWait || ping > 0)) {
      // Web socket didn't close normally but we aren't getting any new headers
      // Assume a broken connection
      error(-2, 'unexpectedly went idle')
      done = true
    }

    ping = 0
    waitCycles++
  }

  //logger(`WoC ${new Date().toISOString()} ${count} headers added`)

  return ok
}
/* v1
onmessage: "{\"type\":6,\"data\":{\"client\":\"c91c044b-66f5-4172-b509-82c11a41d7fc\",\"subs\":{\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\":{}},\"session\":\"d8693511-5bc8-4815-beb6-8ae1bdaaf3a6\"}}"
onmessage: "{\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{\"data\":{\"hash\":\"00000000000000000ce16106e2100b893f3da5989ef23cbac52eb568cf803dc1\",\"confirmations\":8,\"size\":3345869,\"height\":779890,\"version\":939515904,\"versionHex\":\"37ffe000\",\"merkleroot\":\"92e3d1d72d432c9216d296839eaa675b6ffb40ccf6e1a02229caf3d769dc0a5f\",\"txcount\":10757,\"time\":1676851109,\"mediantime\":1676849009,\"nonce\":4216995243,\"bits\":\"180e38cb\",\"difficulty\":77310268438.5808,\"chainwork\":\"00000000000000000000000000000000000000000142d5cf97c0ed497eae1066\",\"previousblockhash\":\"0000000000000000053d26b7b35a76bf2b672428bae591bc033ae99f9873697a\",\"nextblockhash\":\"000000000000000000e1a110376966033507953d50ade86eadef7226843f3349\"}}}"
onmessage: "{\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{\"data\":{\"hash\":\"000000000000000000e1a110376966033507953d50ade86eadef7226843f3349\",\"confirmations\":7,\"size\":615786,\"height\":779891,\"version\":809197568,\"versionHex\":\"303b6000\",\"merkleroot\":\"8f5df85a6fafe2d28c679ff1221c3ba331af8f361ba70752e700d2d6382e194e\",\"txcount\":1967,\"time\":1676851242,\"mediantime\":1676849070,\"nonce\":4059160917,\"bits\":\"180e4320\",\"difficulty\":77091494195.17546,\"chainwork\":\"00000000000000000000000000000000000000000142d5e18ad5b99177e0f584\",\"previousblockhash\":\"00000000000000000ce16106e2100b893f3da5989ef23cbac52eb568cf803dc1\",\"nextblockhash\":\"000000000000000002630b7972c23795326392d9c8b4b19aa1ca4753a3fb9ccd\"}}}"
...
onmessage: "{\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{\"data\":{\"hash\":\"00000000000000000af46a48dec514ff3a4ad9eb6710590ee0385778698241e7\",\"confirmations\":1,\"size\":5119462,\"height\":779897,\"version\":805298176,\"versionHex\":\"2fffe000\",\"merkleroot\":\"3f9b260f6802a3e218366dba3b478dd01703b1b71b12861f838409fbe47fcfba\",\"txcount\":11625,\"time\":1676856449,\"mediantime\":1676852429,\"nonce\":755767059,\"bits\":\"180e6ac7\",\"difficulty\":76263251756.43698,\"chainwork\":\"00000000000000000000000000000000000000000142d64c49fecded8e8be674\",\"previousblockhash\":\"000000000000000000f5b8d6cf1ec6632fd365427600d5acc4c558ce858a8b5a\",\"nextblockhash\":\"\"}}}"
onmessage: "{\"type\":3,\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{}}"
onmessage: "{\"type\":7,\"data\":{\"code\":200,\"reason\":\"Data Delivered\"}}"
*/

/** v2
{
  "message": {
    "data": {
      "version": 872415232,
      "previousblockhash": "00000000000000000ea1f9ba0817a0f922ee227be306fd9097a4e76caf5ff411",
      "merkleroot": "dcd7efb3c39e8e2d597e4757b9a49c98f52f77a6df39d1d5936ac3abb2559944",
      "time": 1750182239,
      "bits": 403926191,
      "nonce": 1043732575,
      "hash": "0000000000000000032d09ca772ca5b3bc5b90a79a5bbcc4a05c99fb6d3b23d8",
      "height": 901658
    }
  }
}
 */

export async function WocHeadersBulkListener_test(): Promise<void> {
  try {
    const chains: Chain[] = ['main', 'test']
    // eslint-disable-next-line prefer-const
    const stop: StopListenerToken = { stop: undefined }

    for (const chain of chains) {
      const apiKey: string | undefined = undefined

      const tipHeight = await getWhatsOnChainTipHeight(chain, apiKey)

      let errors = 0
      while (
        errors === 0 &&
        !(await WocHeadersBulkListener(
          tipHeight - 3,
          tipHeight,
          header => console.log(JSON.stringify(header)),
          (code, message) => {
            errors++
            console.log(`code ${code} message ${message}`)
            return true
          },
          stop,
          chain,
          5000
        ))
      ) {
        console.log('restarting WoC addHeaders')
      }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * High speed WebSocket based based new block header listener
 * @param enqueue returns headers received from WebSocket service
 * @param error notifies of abnormal events, return false to close websocket, true to ignore the error.
 * @param stop an object with a stop property which gets set to a method to stop listener
 * @param chain 'test' | 'main'
 * @param idleWait without any input, after this many milliseconds, assume dead service and exit.
 * @returns true only if exit caused by `stop`
 */
export async function WocHeadersLiveListener(
  enqueue: (header: BlockHeader) => void,
  error: (code: number, message: string) => boolean,
  stop: StopListenerToken,
  chain: Chain = 'main',
  idleWait = 100000
): Promise<boolean> {
  let count = 0
  let ok = false
  let done = false
  let wsIsOpen = false

  let msecsWithoutPing = 0

  function stopNow(): void {
    ok = true
    if (wsIsOpen) {
      wsIsOpen = false
      ws.close()
    } else done = true
  }

  stop.stop = stopNow

  const webSocketUrl =
    chain === 'test'
      ? 'wss://socket-v2-testnet.whatsonchain.com/websocket/blockHeaders'
      : 'wss://socket-v2.whatsonchain.com/websocket/blockHeaders'

  function processData(rawData) {
    if (rawData.length === 0) {
      // Ping
      return
    }
    // rawData may be a Buffer...
    const data = JSON.parse(rawData)
    const json = JSON.stringify(data)
    switch (data.type || 0) {
      case 0:
        // "{\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{\"data\":{\"hash\":\"00000000000000000ce16106e2100b893f3da5989ef23cbac52eb568cf803dc1\",\"confirmations\":8,\"size\":3345869,\"height\":779890,\"version\":939515904,\"versionHex\":\"37ffe000\",\"merkleroot\":\"92e3d1d72d432c9216d296839eaa675b6ffb40ccf6e1a02229caf3d769dc0a5f\",\"txcount\":10757,\"time\":1676851109,\"mediantime\":1676849009,\"nonce\":4216995243,\"bits\":\"180e38cb\",\"difficulty\":77310268438.5808,\"chainwork\":\"00000000000000000000000000000000000000000142d5cf97c0ed497eae1066\",\"previousblockhash\":\"0000000000000000053d26b7b35a76bf2b672428bae591bc033ae99f9873697a\",\"nextblockhash\":\"000000000000000000e1a110376966033507953d50ade86eadef7226843f3349\"}}}"
        // last wocHeader has empty string for nextBlockHash
        // eslint-disable-next-line no-case-declarations
        if (!done) {
          if (json === '{}') {
            ws.send('ping')
          } else {
            //logger(JSON.stringify(data))
            const wocHeader = data.pub?.data || data.data?.data
            if (wocHeader) {
              const header = convertWocToBlockHeaderHex(wocHeader)
              enqueue(header)
              count++
            } else {
              error(42, `unknown data ${json}`)
            }
          }
        }
        break
      case 3:
        break // Unsubscribe "{\"type\":3,\"channel\":\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\",\"data\":{}}"
      case 5:
        break // console.log('subscribed to a channel ' + data.channel)
      case 6:
        break // subscribe "{\"type\":6,\"data\":{\"client\":\"c91c044b-66f5-4172-b509-82c11a41d7fc\",\"subs\":{\"woc#c91c044b-66f5-4172-b509-82c11a41d7fc\":{}},\"session\":\"d8693511-5bc8-4815-beb6-8ae1bdaaf3a6\"}}"
      case 7:
        // If you don't close after unsubscribe or end of headers, after a delay, this is received.
        // "{\"type\":7,\"data\":{\"code\":200,\"reason\":\"Data Delivered\"}}"
        error(data.data.code, JSON.stringify(data.data))
        ws.close()
        break
      default:
        error(42, `unknown data ${json}`)
        ws.close()
    }
  }

  const ws = new WebSocket(webSocketUrl)

  /*
    function startPing() {
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('ping');
            }
        }, 30000); // Ping every 30 seconds
    }
    */

  ws.onopen = function (this, evt) {
    //logger(`WoC ${new Date().toISOString()} listening for new headers`)
    // This is required to trigger connect on server side.
    ws.send(JSON.stringify({}))
    wsIsOpen = true
  }

  ws.onerror = function (this, evt) {
    // if (evt.message.startsWith('getaddrinfo ENOTFOUND')) {
    let code = -1
    switch (evt.message) {
      case 'Unexpected server response: 403':
        code = 403
        break
      case 'Unexpected server response: 404':
        code = 404
        break
      default:
        break
    }
    const ignoreError = error(code, evt.message)
    if (!ignoreError) ws.close()
  }

  ws.onclose = function (this, ev) {
    // ok should be true if we got the last header, false otherwise.
    // error will have been called with anything abnormal...
    //logger(`WoC ${new Date().toISOString()} listening for new headers service closed`)
    done = true
  }

  ws.onmessage = function (this, ev) {
    // console.log("onmessage:", JSON.stringify(ev.data));
    processData(ev.data)
    msecsWithoutPing = 0
  }

  //startPing()

  const waitMsecs = 1000
  let sinceLastSentPing = 0

  while (!done) {
    await wait(waitMsecs)

    msecsWithoutPing += waitMsecs
    sinceLastSentPing += waitMsecs

    if (sinceLastSentPing > 10000) {
      ws.send('ping')
      sinceLastSentPing = 0
    }
  }

  return ok
}

export async function WocHeadersLiveListener_test(): Promise<void> {
  try {
    const chain = 'main'
    const stop: StopListenerToken = { stop: undefined }

    let errors = 0
    while (
      errors === 0 &&
      !(await WocHeadersLiveListener(
        header => console.log(JSON.stringify(header)),
        (code, message) => {
          errors++
          console.log(`code ${code} message ${message}`)
          return true
        },
        stop,
        chain,
        100000
      ))
    ) {
      console.log('restarting WoC addHeaders')
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * v1 json data format:
 * 
{
  "hash": "0000000000000000010cb155a44577ff3541940ec4355c026dc2706fb7e261d6",
  "confirmations": 4,
  "size": 1229956,
  "height": 676421,
  "version": 541065216,
  "versionHex": "20400000",
  "merkleroot": "e2f64e87c0362314b65dc28b4367c41d904c22b891b652951779336ef735386b",
  "txcount": 654,
  "time": 1614534798,
  "mediantime": 1614527058,
  "nonce": 610133701,
  "bits": "180d359d",
  "difficulty": 83235621087.7299,
  "chainwork": "00000000000000000000000000000000000000000127d3854a414d8ec8f53190",
  "previousblockhash": "00000000000000000428ca33597675bd85f5a2ef464ba25e4db7b4a74d898d33",
  "nextblockhash": "00000000000000000cb40c1d850dece5cd3747e08a1e4066ef887251388c4ae6",
  "coinbaseTx": {
    "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff410345520a2f7461616c2e636f6d2f506c656173652070617920302e3520736174732f627974652c20696e666f407461616c2e636f6d6eead6b0ad91f2ce86be0400ffffffff0176674325000000001976a9148e9170be3f733a9773c907517fb9b786f1c884c688ac00000000",
    "txid": "13686a10870d23b4c94642bf0b78d6630e2640fc0de83bc30af835d96bb17482",
    "hash": "13686a10870d23b4c94642bf0b78d6630e2640fc0de83bc30af835d96bb17482",
    "size": 150,
    "version": 1,
    "locktime": 0,
    "vin": [
      {
        "coinbase": "0345520a2f7461616c2e636f6d2f506c656173652070617920302e3520736174732f627974652c20696e666f407461616c2e636f6d6eead6b0ad91f2ce86be0400",
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "value": 6.2517439,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 8e9170be3f733a9773c907517fb9b786f1c884c6 OP_EQUALVERIFY OP_CHECKSIG",
          "hex": "76a9148e9170be3f733a9773c907517fb9b786f1c884c688ac",
          "reqSigs": 1,
          "type": "pubkeyhash",
          "addresses": [
            "1DzqBck9oyCBzxJbbje2s15deZis6BeATi"
          ],
          "isTruncated": false
        }
      }
    ],
    "blockhash": "0000000000000000010cb155a44577ff3541940ec4355c026dc2706fb7e261d6",
    "confirmations": 4,
    "time": 1614534798,
    "blocktime": 1614534798
  }
}
 */

/**
 * v2 json data format:
{
  "channel": "woc:blockHeader",
  "pub": {
    "data": {

      "hash": "000000000000000007405fd882e9d4bf3d7b2388010081fe443ee1e323d8a668",
      "confirmations": 1,
      "size": 368170789,
      "height": 892466,
      "version": 939524096,
      "versionHex": "38000000",
      "merkleroot": "b0ac43a40a42775d8f533a8eda00bed3257e12a5fca3c8cade47188e6b7aa382",
      "txcount": 9230,
      "time": 1744648860,
      "mediantime": 1744645401,
      "nonce": 2893086732,
      "bits": "181246e3",
      "difficulty": 60157618395.71893,
      "chainwork": "00000000000000000000000000000000000000000164d487adbc2b84d47d2831",
      "previousblockhash": "0000000000000000090fa4de4c971b0b3609acc1061b2020d22dc8d8bf72746a",
      "nextblockhash": "",
      "coinbaseTx": {
        "hex": "...",
        "txid": "1932aa0229b6b44be4b749b9e7279c02136374e2e77b4e890db761f8e74d2111",
        "hash": "1932aa0229b6b44be4b749b9e7279c02136374e2e77b4e890db761f8e74d2111",
        "size": 111,
        "version": 1,
        "locktime": 0,
        "vin": [
          {
            "n": 0,
            "coinbase": "03329e0d2f7461616c2e636f6d2fb9df41e723a18d95e09d0200",
            "sequence": 4294967295
          }
        ],
        "vout": [
          {
            "value": 3.13276008,
            "n": 0,
            "scriptPubKey": {
              "asm": "OP_DUP OP_HASH160 522cf9e7626d9bd8729e5a1398ece40dad1b6a2f OP_EQUALVERIFY OP_CHECKSIG",
              "hex": "...",
              "reqSigs": 1,
              "type": "pubkeyhash",
              "addresses": [
                "18VWHjMt4ixHddPPbs6righWTs3Sg2QNcn"
              ],
              "isTruncated": false
            },
            "scripthash": "1981f116576960fab6ac9a71ba3c12e4f98c2d9b34532bdb40f2e8cc03337fa2"
          }
        ],
        "blockhash": "000000000000000007405fd882e9d4bf3d7b2388010081fe443ee1e323d8a668",
        "confirmations": 1,
        "time": 1744648860,
        "blocktime": 1744648860,

        // New properties in v2
        "blockheight": 892466,
        "vincount": 1,
        "voutcount": 1,
        "voutvalue": 3.13276008
      },
      "totalFees": 0.007760080000000169
    }
  }
}
 */
