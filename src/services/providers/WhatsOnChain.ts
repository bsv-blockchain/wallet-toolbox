import { Beef, HexString, Utils, WhatsOnChainConfig } from '@bsv/sdk'
import { asArray, asString, doubleSha256BE, sdk, Services, validateScriptHash, wait } from '../../index.client'
import { convertProofToMerklePath } from '../../utility/tscProofToMerklePath'
import SdkWhatsOnChain from './SdkWhatsOnChain'
import { parseWalletOutpoint, ReqHistoryNote } from '../../sdk'
import { convertWocToBlockHeaderHex, WocChainInfo, WocHeader } from '../chaintracker/chaintracks/Ingest/WhatsOnChainIngestorBase'
import { BlockHeader } from '../chaintracker/chaintracks/Api/BlockHeaderApi'

export class WhatsOnChainNoServices extends SdkWhatsOnChain {

  constructor(chain: sdk.Chain = 'main', config: WhatsOnChainConfig = {}) {
    super(chain, config)
  }

  /**
   * POST
   * https://api.whatsonchain.com/v1/bsv/main/txs/status
   * Content-Type: application/json
   * data: "{\"txids\":[\"6815f8014db74eab8b7f75925c68929597f1d97efa970109d990824c25e5e62b\"]}"
   *
   * result for a mined txid:
   *     [{
   *        "txid":"294cd1ebd5689fdee03509f92c32184c0f52f037d4046af250229b97e0c8f1aa",
   *        "blockhash":"000000000000000004b5ce6670f2ff27354a1e87d0a01bf61f3307f4ccd358b5",
   *        "blockheight":612251,
   *        "blocktime":1575841517,
   *        "confirmations":278272
   *      }]
   *
   * result for a valid recent txid:
   *     [{"txid":"6815f8014db74eab8b7f75925c68929597f1d97efa970109d990824c25e5e62b"}]
   *
   * result for an unknown txid:
   *     [{"txid":"6815f8014db74eab8b7f75925c68929597f1d97efa970109d990824c25e5e62c","error":"unknown"}]
   */
  async getStatusForTxids(txids: string[]): Promise<sdk.GetStatusForTxidsResult> {
    const r: sdk.GetStatusForTxidsResult = {
      name: 'WoC',
      status: 'error',
      error: undefined,
      results: []
    }

    const requestOptions = {
      method: 'POST',
      headers: this.getHttpHeaders(),
      data: { txids }
    }

    const url = `${this.URL}/txs/status`

    try {
      const response = await this.httpClient.request<WhatsOnChainTxsStatusData[]>(url, requestOptions)

      if (!response.data || !response.ok || response.status !== 200)
        throw new sdk.WERR_INVALID_OPERATION(`Unable to get status for txids at this timei.`)

      const data = response.data
      for (const txid of txids) {
        const d = data.find(d => d.txid === txid)
        if (!d || d.error === 'unknown') r.results.push({ txid, status: 'unknown', depth: undefined })
        else if (d.error !== undefined) {
          console.log(`WhatsOnChain getStatusForTxids unexpected error ${d.error} ${txid}`)
          r.results.push({ txid, status: 'unknown', depth: undefined })
        } else if (d.confirmations === undefined) r.results.push({ txid, status: 'known', depth: 0 })
        else r.results.push({ txid, status: 'mined', depth: d.confirmations })
      }
      r.status = 'success'
    } catch (eu: unknown) {
      const e = sdk.WalletError.fromUnknown(eu)
      r.error = e
    }

    return r
  }

  /**
   * 2025-02-16 throwing internal server error 500.
   * @param txid
   * @returns
   */
  async getTxPropagation(txid: string): Promise<number> {
    const requestOptions = {
      method: 'GET',
      headers: this.getHttpHeaders()
    }

    const response = await this.httpClient.request<string>(`${this.URL}/tx/hash/${txid}/propagation`, requestOptions)

    // response.statusText is often, but not always 'OK' on success...
    if (!response.data || !response.ok || response.status !== 200)
      throw new sdk.WERR_INVALID_PARAMETER('txid', `valid transaction. '${txid}' response ${response.statusText}`)

    return 0
  }

  /**
   * May return undefined for unmined transactions that are in the mempool.
   * @param txid
   * @returns raw transaction as hex string or undefined if txid not found in mined block.
   */
  async getRawTx(txid: string): Promise<string | undefined> {
    const headers = this.getHttpHeaders()
    headers['Cache-Control'] = 'no-cache'

    const requestOptions = {
      method: 'GET',
      headers
    }

    const url = `${this.URL}/tx/${txid}/hex`

    for (let retry = 0; retry < 2; retry++) {
      const response = await this.httpClient.request<string>(url, requestOptions)
      if (response.statusText === 'Too Many Requests' && retry < 2) {
        await wait(2000)
        continue
      }

      if (response.status === 404 && response.statusText === 'Not Found') return undefined

      // response.statusText is often, but not always 'OK' on success...
      if (!response.data || !response.ok || response.status !== 200)
        throw new sdk.WERR_INVALID_PARAMETER('txid', `valid transaction. '${txid}' response ${response.statusText}`)

      return response.data
    }
    throw new sdk.WERR_INTERNAL()
  }

  async getRawTxResult(txid: string): Promise<sdk.GetRawTxResult> {
    const r: sdk.GetRawTxResult = { name: 'WoC', txid: asString(txid) }

    try {
      const rawTxHex = await this.getRawTx(txid)
      if (rawTxHex) r.rawTx = asArray(rawTxHex)
    } catch (err: unknown) {
      r.error = sdk.WalletError.fromUnknown(err)
    }

    return r
  }

  /**
   * WhatsOnChain does not natively support a postBeef end-point aware of multiple txids of interest in the Beef.
   *
   * Send rawTx in `txids` order from beef.
   *
   * @param beef
   * @param txids
   * @returns
   */
  async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> {
    const r: sdk.PostBeefResult = {
      name: 'WoC',
      status: 'success',
      txidResults: [],
      notes: []
    }

    let delay = false

    const nn = () => ({ name: 'WoCpostBeef', when: new Date().toISOString() })
    const nne = () => ({ ...nn(), beef: beef.toHex(), txids: txids.join(',') })

    for (const txid of txids) {
      const rawTx = Utils.toHex(beef.findTxid(txid)!.rawTx!)

      if (delay) {
        // For multiple txids, give WoC time to propagate each one.
        await wait(3000)
      }
      delay = true

      const tr = await this.postRawTx(rawTx)
      if (txid !== tr.txid) {
        tr.notes!.push({ ...nne(), what: 'postRawTxTxidChanged', txid, trTxid: tr.txid })
      }

      r.txidResults.push(tr)
      if (r.status === 'success' && tr.status !== 'success') r.status = 'error'
    }

    if (r.status === 'success') {
      r.notes!.push({ ...nn(), what: 'postBeefSuccess' })
    } else {
      r.notes!.push({ ...nne(), what: 'postBeefError' })
    }

    return r
  }

  /**
   * @param rawTx raw transaction to broadcast as hex string
   * @returns txid returned by transaction processor of transaction broadcast
   */
  async postRawTx(rawTx: HexString): Promise<sdk.PostTxResultForTxid> {
    let txid = Utils.toHex(doubleSha256BE(Utils.toArray(rawTx, 'hex')))

    const r: sdk.PostTxResultForTxid = {
      txid,
      status: 'success',
      notes: []
    }

    const headers = this.getHttpHeaders()
    headers['Content-Type'] = 'application/json'
    headers['Accept'] = 'text/plain'

    const requestOptions = {
      method: 'POST',
      headers,
      data: { txhex: rawTx }
    }

    const url = `${this.URL}/tx/raw`
    const nn = () => ({ name: 'WoCpostRawTx', when: new Date().toISOString() })
    const nne = () => ({ ...nn(), rawTx, txid, url })

    const retryLimit = 5
    for (let retry = 0; retry < retryLimit; retry++) {
      try {
        const response = await this.httpClient.request<string>(url, requestOptions)
        if (response.statusText === 'Too Many Requests' && retry < 2) {
          r.notes!.push({ ...nn(), what: 'postRawTxRateLimit' })
          await wait(2000)
          continue
        }
        if (response.ok) {
          const txid = response.data
          r.notes!.push({ ...nn(), what: 'postRawTxSuccess' })
        } else if (response.data === 'unexpected response code 500: Transaction already in the mempool') {
          r.notes!.push({ ...nne(), what: 'postRawTxSuccessAlreadyInMempool' })
        } else {
          r.status = 'error'
          if (response.data === 'unexpected response code 500: 258: txn-mempool-conflict') {
            r.doubleSpend = true // this is a possible double spend attempt
            r.competingTxs = undefined // not provided with any data for this.
            r.notes!.push({ ...nne(), what: 'postRawTxErrorMempoolConflict' })
          } else if (response.data === 'unexpected response code 500: Missing inputs') {
            r.doubleSpend = true // this is a possible double spend attempt
            r.competingTxs = undefined // not provided with any data for this.
            r.notes!.push({ ...nne(), what: 'postRawTxErrorMissingInputs' })
          } else {
            const n: ReqHistoryNote = {
              ...nne(),
              what: 'postRawTxError'
            }
            if (typeof response.data === 'string') {
              n.data = response.data.slice(0, 128)
              r.data = response.data
            } else {
              r.data = ''
            }
            if (typeof response.statusText === 'string') {
              n.statusText = response.statusText.slice(0, 128)
              r.data += `,${response.statusText}`
            }
            if (typeof response.status === 'string') {
              n.status = (response.status as string).slice(0, 128)
              r.data += `,${response.status}`
            }
            if (typeof response.status === 'number') {
              n.status = response.status
              r.data += `,${response.status}`
            }
            r.notes!.push(n)
          }
        }
      } catch (eu: unknown) {
        r.status = 'error'
        const e = sdk.WalletError.fromUnknown(eu)
        r.notes!.push({
          ...nne(),
          what: 'postRawTxCatch',
          code: e.code,
          description: e.description
        })
        r.serviceError = true
        r.data = `${e.code} ${e.description}`
      }
      return r
    }
    r.status = 'error'
    r.serviceError = true
    r.notes!.push({
      ...nne(),
      what: 'postRawTxRetryLimit',
      retryLimit
    })
    return r
  }

  async updateBsvExchangeRate(rate?: sdk.BsvExchangeRate, updateMsecs?: number): Promise<sdk.BsvExchangeRate> {
    if (rate) {
      // Check if the rate we know is stale enough to update.
      updateMsecs ||= 1000 * 60 * 15
      if (new Date(Date.now() - updateMsecs) < rate.timestamp) return rate
    }

    const requestOptions = {
      method: 'GET',
      headers: this.getHttpHeaders()
    }

    for (let retry = 0; retry < 2; retry++) {
      const response = await this.httpClient.request<{
        rate: number
        time: number
        currency: string
      }>(`${this.URL}/exchangerate`, requestOptions)
      if (response.statusText === 'Too Many Requests' && retry < 2) {
        await wait(2000)
        continue
      }

      // response.statusText is often, but not always 'OK' on success...
      if (!response.data || !response.ok || response.status !== 200)
        throw new sdk.WERR_INVALID_OPERATION(`WoC exchangerate response ${response.statusText}`)

      const wocrate = response.data
      if (wocrate.currency !== 'USD') wocrate.rate = NaN

      const newRate: sdk.BsvExchangeRate = {
        timestamp: new Date(),
        base: 'USD',
        rate: wocrate.rate
      }

      return newRate
    }
    throw new sdk.WERR_INTERNAL()
  }

  async getUtxoStatus(
    output: string,
    outputFormat?: sdk.GetUtxoStatusOutputFormat,
    outpoint?: string
  ): Promise<sdk.GetUtxoStatusResult> {
    const r: sdk.GetUtxoStatusResult = {
      name: 'WoC',
      status: 'error',
      error: new sdk.WERR_INTERNAL(),
      details: []
    }

    for (let retry = 0; ; retry++) {
      let url: string = ''

      try {
        const scriptHash = validateScriptHash(output, outputFormat)

        const requestOptions = {
          method: 'GET',
          headers: this.getHttpHeaders()
        }

        const response = await this.httpClient.request<WhatsOnChainUtxoStatus>(
          `${this.URL}/script/${scriptHash}/unspent/all`,
          requestOptions
        )
        if (response.statusText === 'Too Many Requests' && retry < 2) {
          await wait(2000)
          continue
        }

        // response.statusText is often, but not always 'OK' on success...
        if (!response.data || !response.ok || response.status !== 200)
          throw new sdk.WERR_INVALID_OPERATION(`WoC getUtxoStatus response ${response.statusText}`)

        const data = response.data

        if (data.script !== scriptHash || !Array.isArray(data.result)) {
          throw new sdk.WERR_INTERNAL('data. is not an array')
        }

        if (data.result.length === 0) {
          r.status = 'success'
          r.error = undefined
          r.isUtxo = false
        } else {
          r.status = 'success'
          r.error = undefined
          for (const s of data.result) {
            r.details.push({
              txid: s.tx_hash,
              satoshis: s.value,
              height: s.height,
              index: s.tx_pos
            })
          }
          if (outpoint) {
            const { txid, vout } = parseWalletOutpoint(outpoint)
            r.isUtxo = r.details.find(d => d.txid === txid && d.index === vout) !== undefined
          } else r.isUtxo = r.details.length > 0
        }

        return r
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        if (e.code !== 'ECONNRESET' || retry > 2) {
          r.error = new sdk.WERR_INTERNAL(
            `service failure: ${url}, error: ${JSON.stringify(sdk.WalletError.fromUnknown(eu))}`
          )
          return r
        }
      }
    }
  }

  async getScriptHashConfirmedHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> {
    const r: sdk.GetScriptHashHistoryResult = {
      name: 'WoC',
      status: 'error',
      error: undefined,
      history: []
    }

    // reverse hash from LE to BE for Woc
    hash = Utils.toHex(Utils.toArray(hash, 'hex').reverse())

    const url = `${this.URL}/script/${hash}/confirmed/history`

    for (let retry = 0; ; retry++) {
      try {
        const requestOptions = {
          method: 'GET',
          headers: this.getHttpHeaders()
        }

        const response = await this.httpClient.request<WhatsOnChainScriptHashHistoryData>(url, requestOptions)
        if (response.statusText === 'Too Many Requests' && retry < 2) {
          await wait(2000)
          continue
        }

        if (!response.ok && response.status === 404) {
          // There is no history for this script hash...
          r.status = 'success'
          return r
        }

        // response.statusText is often, but not always 'OK' on success...
        if (!response.data || !response.ok || response.status !== 200) {
          r.error = new sdk.WERR_BAD_REQUEST(
            `WoC getScriptHashConfirmedHistory response ${response.ok} ${response.status} ${response.statusText}`
          )
          return r
        }

        if (response.data.error) {
          r.error = new sdk.WERR_BAD_REQUEST(`WoC getScriptHashConfirmedHistory error ${response.data.error}`)
          return r
        }

        r.history = response.data.result.map(d => ({ txid: d.tx_hash, height: d.height }))
        r.status = 'success'

        return r
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        if (e.code !== 'ECONNRESET' || retry > 2) {
          r.error = new sdk.WERR_INTERNAL(
            `WoC getScriptHashConfirmedHistory service failure: ${url}, error: ${JSON.stringify(sdk.WalletError.fromUnknown(eu))}`
          )
          return r
        }
      }
    }

    return r
  }

  async getScriptHashUnconfirmedHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> {
    const r: sdk.GetScriptHashHistoryResult = {
      name: 'WoC',
      status: 'error',
      error: undefined,
      history: []
    }

    // reverse hash from LE to BE for Woc
    hash = Utils.toHex(Utils.toArray(hash, 'hex').reverse())

    const url = `${this.URL}/script/${hash}/unconfirmed/history`

    for (let retry = 0; ; retry++) {
      try {
        const requestOptions = {
          method: 'GET',
          headers: this.getHttpHeaders()
        }

        const response = await this.httpClient.request<WhatsOnChainScriptHashHistoryData>(url, requestOptions)
        if (response.statusText === 'Too Many Requests' && retry < 2) {
          await wait(2000)
          continue
        }

        if (!response.ok && response.status === 404) {
          // There is no history for this script hash...
          r.status = 'success'
          return r
        }

        // response.statusText is often, but not always 'OK' on success...
        if (!response.data || !response.ok || response.status !== 200) {
          r.error = new sdk.WERR_BAD_REQUEST(
            `WoC getScriptHashUnconfirmedHistory response ${response.ok} ${response.status} ${response.statusText}`
          )
          return r
        }

        if (response.data.error) {
          r.error = new sdk.WERR_BAD_REQUEST(`WoC getScriptHashUnconfirmedHistory error ${response.data.error}`)
          return r
        }

        r.history = response.data.result.map(d => ({ txid: d.tx_hash, height: d.height }))
        r.status = 'success'

        return r
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        if (e.code !== 'ECONNRESET' || retry > 2) {
          r.error = new sdk.WERR_INTERNAL(
            `WoC getScriptHashUnconfirmedHistory service failure: ${url}, error: ${JSON.stringify(sdk.WalletError.fromUnknown(eu))}`
          )
          return r
        }
      }
    }

    return r
  }

  async getScriptHashHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> {
    const r1 = await this.getScriptHashConfirmedHistory(hash)
    if (r1.error || r1.status !== 'success') return r1
    const r2 = await this.getScriptHashUnconfirmedHistory(hash)
    if (r2.error || r2.status !== 'success') return r2
    r1.history = r1.history.concat(r2.history)
    return r1
  }

  /**
    {
      "hash": "000000000000000004a288072ebb35e37233f419918f9783d499979cb6ac33eb",
      "confirmations": 328433,
      "size": 14421,
      "height": 575045,
      "version": 536928256,
      "versionHex": "2000e000",
      "merkleroot": "4ebcba09addd720991d03473f39dce4b9a72cc164e505cd446687a54df9b1585",
      "time": 1553416668,
      "mediantime": 1553414858,
      "nonce": 87914848,
      "bits": "180997ee",
      "difficulty": 114608607557.4425,
      "chainwork": "000000000000000000000000000000000000000000ddf5d385546872bab7dc01",
      "previousblockhash": "00000000000000000988156c7075dc9147a5b62922f1310862e8b9000d46dd9b",
      "nextblockhash": "00000000000000000112b36a37c10235fa0c991f680bc5482ba9692e0ae697db",
      "nTx": 0,
      "num_tx": 5
    }
   */
  async getBlockHeaderByHash(hash: string): Promise<BlockHeader | undefined> {
    const headers = this.getHttpHeaders()
    const requestOptions = {
      method: 'GET',
      headers
    }

    const url = `${this.URL}/block/${hash}/header`

    for (let retry = 0; retry < 2; retry++) {
      const response = await this.httpClient.request<WocHeader>(url, requestOptions)
      if (response.statusText === 'Too Many Requests' && retry < 2) {
        await wait(2000)
        continue
      }

      if (response.status === 404 && response.statusText === 'Not Found') return undefined

      // response.statusText is often, but not always 'OK' on success...
      if (!response.data || !response.ok || response.status !== 200)
        throw new sdk.WERR_INVALID_PARAMETER('hash', `valid block hash. '${hash}' response ${response.statusText}`)

      const header = convertWocToBlockHeaderHex(response.data)

      return header
    }
    throw new sdk.WERR_INTERNAL()
  }

  async getChainInfo(): Promise<WocChainInfo> {
    const headers = this.getHttpHeaders()
    const requestOptions = {
      method: 'GET',
      headers
    }

    const url = `${this.URL}/chain/info`

    for (let retry = 0; retry < 2; retry++) {
      const response = await this.httpClient.request<WocChainInfo>(url, requestOptions)
      if (response.statusText === 'Too Many Requests' && retry < 2) {
        await wait(2000)
        continue
      }

      // response.statusText is often, but not always 'OK' on success...
      if (!response.data || !response.ok || response.status !== 200)
        throw new sdk.WERR_INVALID_PARAMETER('hash', `valid block hash. '${url}' response ${response.statusText}`)

      return response.data
    }
    throw new sdk.WERR_INTERNAL()
  }
}

/**
 *
 */
export class WhatsOnChain extends WhatsOnChainNoServices {
  services: Services

  constructor(chain: sdk.Chain = 'main', config: WhatsOnChainConfig = {}, services?: Services) {
    super(chain, config)
    this.services = services || new Services(chain)
  }

  /**
   * @param txid
   * @returns
   */
  async getMerklePath(txid: string, services: sdk.WalletServices): Promise<sdk.GetMerklePathResult> {
    const r: sdk.GetMerklePathResult = { name: 'WoCTsc', notes: [] }

    const headers = this.getHttpHeaders()
    const requestOptions = {
      method: 'GET',
      headers
    }

    for (let retry = 0; retry < 2; retry++) {
      try {
        const response = await this.httpClient.request<WhatsOnChainTscProof | WhatsOnChainTscProof[]>(
          `${this.URL}/tx/${txid}/proof/tsc`,
          requestOptions
        )
        if (response.statusText === 'Too Many Requests' && retry < 2) {
          r.notes!.push({
            what: 'getMerklePathRetry',
            name: r.name,
            status: response.status,
            statusText: response.statusText
          })
          await wait(2000)
          continue
        }

        if (response.status === 404 && response.statusText === 'Not Found') {
          r.notes!.push({
            what: 'getMerklePathNotFound',
            name: r.name,
            status: response.status,
            statusText: response.statusText
          })
          return r
        }

        // response.statusText is often, but not always 'OK' on success...
        if (!response.ok || response.status !== 200) {
          r.notes!.push({
            what: 'getMerklePathBadStatus',
            name: r.name,
            status: response.status,
            statusText: response.statusText
          })
          throw new sdk.WERR_INVALID_PARAMETER('txid', `valid transaction. '${txid}' response ${response.statusText}`)
        }

        if (!response.data) {
          // Unmined, proof not yet available.
          r.notes!.push({
            what: 'getMerklePathNoData',
            name: r.name,
            status: response.status,
            statusText: response.statusText
          })
          return r
        }

        if (!Array.isArray(response.data)) response.data = [response.data]

        if (response.data.length != 1) return r

        const p = response.data[0]
        const header = await services.hashToHeader(p.target)
        if (header) {
          const proof = {
            index: p.index,
            nodes: p.nodes,
            height: header.height
          }
          r.merklePath = convertProofToMerklePath(txid, proof)
          r.header = header
          r.notes!.push({
            what: 'getMerklePathSuccess',
            name: r.name,
            status: response.status,
            statusText: response.statusText
          })
        } else {
          r.notes!.push({
            what: 'getMerklePathNoHeader',
            target: p.target,
            name: r.name,
            status: response.status,
            statusText: response.statusText
          })
          throw new sdk.WERR_INVALID_PARAMETER('blockhash', 'a valid on-chain block hash')
        }
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        r.notes!.push({
          what: 'getMerklePathError',
          name: r.name,
          code: e.code,
          description: e.description
        })
        r.error = e
      }
      return r
    }
    r.notes!.push({ what: 'getMerklePathInternal', name: r.name })
    throw new sdk.WERR_INTERNAL()
  }

}

interface WhatsOnChainTscProof {
  index: number
  nodes: string[]
  target: string
  txOrId: string
}

interface WhatsOnChainScriptHashHistory {
  tx_hash: string
  height?: number
}

interface WhatsOnChainScriptHashHistoryData {
  script: string
  result: WhatsOnChainScriptHashHistory[]
  error?: string
  nextPageToken?: string
}

interface WhatsOnChainTxsStatusData {
  txid: string
  blockhash?: string
  blockheight?: number
  blocktime?: number
  confirmations?: number
  /**
   * 'unknown' if txid isn't known
   */
  error?: string
}

/**
 * GET https://api.whatsonchain.com/v1/bsv/<network>/script/<scriptHash>/unspent/all
 * 
 * Response
{
  "error":"",
  "status":200,
  "statusText":"OK",
  "ok":true,
  "data":{
    "script":"d3ef8eeb691e7405caca142bfcd6f499b142884d7883e6701a0ee76047b4af32",
    "result":[
      {
        "height":893652,
        "tx_pos":11,
        "tx_hash":"2178a1e93d46edda946d9069f9b157ddfacb451fee0278e657941f09bfdb5d8f",
        "value":1005,
        "isSpentInMempoolTx":false,
        "status":"confirmed"
      }
    ]
  }
}
 * 
 */
interface WhatsOnChainUtxoStatus {
  script: string
  result: {
    value: number
    height: number
    tx_pos: number
    tx_hash: string
    isSpentInMempoolTx: boolean
    status: string // 'confirmed'
  }[]
}
