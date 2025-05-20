import { Transaction as BsvTransaction, Beef, ChainTracker, Utils } from '@bsv/sdk'
import { asArray, asString, doubleSha256BE, sdk, sha256Hash, TableOutput, wait } from '../index.client'
import { ServiceCollection, ServiceToCall } from './ServiceCollection'
import { createDefaultWalletServicesOptions } from './createDefaultWalletServicesOptions'
import { ChaintracksChainTracker } from './chaintracker'
import { WhatsOnChain } from './providers/WhatsOnChain'
import { updateChaintracksFiatExchangeRates, updateExchangeratesapi } from './providers/echangeRates'
import { ARC } from './providers/ARC'
import { Bitails } from './providers/Bitails'
import { getBeefForTxid } from './providers/getBeefForTxid'
import { ServicesCallHistory } from '../sdk/WalletServices.interfaces'

export class Services implements sdk.WalletServices {
  static createDefaultOptions(chain: sdk.Chain): sdk.WalletServicesOptions {
    return createDefaultWalletServicesOptions(chain)
  }

  options: sdk.WalletServicesOptions
  whatsonchain: WhatsOnChain
  arcTaal: ARC
  arcGorillaPool?: ARC
  bitails: Bitails

  getMerklePathServices: ServiceCollection<sdk.GetMerklePathService>
  getRawTxServices: ServiceCollection<sdk.GetRawTxService>
  postBeefServices: ServiceCollection<sdk.PostBeefService>
  getUtxoStatusServices: ServiceCollection<sdk.GetUtxoStatusService>
  getStatusForTxidsServices: ServiceCollection<sdk.GetStatusForTxidsService>
  getScriptHashHistoryServices: ServiceCollection<sdk.GetScriptHashHistoryService>
  updateFiatExchangeRateServices: ServiceCollection<sdk.UpdateFiatExchangeRateService>

  chain: sdk.Chain

  constructor(optionsOrChain: sdk.Chain | sdk.WalletServicesOptions) {
    this.chain = typeof optionsOrChain === 'string' ? optionsOrChain : optionsOrChain.chain

    this.options = typeof optionsOrChain === 'string' ? Services.createDefaultOptions(this.chain) : optionsOrChain

    this.whatsonchain = new WhatsOnChain(this.chain, { apiKey: this.options.whatsOnChainApiKey }, this)

    this.arcTaal = new ARC(this.options.arcUrl, this.options.arcConfig, 'arcTaal')
    if (this.options.arcGorillaPoolUrl) {
      this.arcGorillaPool = new ARC(this.options.arcGorillaPoolUrl, this.options.arcGorillaPoolConfig, 'arcGorillaPool')
    }

    this.bitails = new Bitails(this.chain)

    //prettier-ignore
    this.getMerklePathServices = new ServiceCollection<sdk.GetMerklePathService>('getMerklePath')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getMerklePath.bind(this.whatsonchain) })
      .add({ name: 'Bitails', service: this.bitails.getMerklePath.bind(this.bitails) })

    //prettier-ignore
    this.getRawTxServices = new ServiceCollection<sdk.GetRawTxService>('getRawTx')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getRawTxResult.bind(this.whatsonchain) })

    this.postBeefServices = new ServiceCollection<sdk.PostBeefService>('postBeef')
    if (this.arcGorillaPool) {
      //prettier-ignore
      this.postBeefServices.add({ name: 'GorillaPoolArcBeef', service: this.arcGorillaPool.postBeef.bind(this.arcGorillaPool) })
    }
    //prettier-ignore
    this.postBeefServices
      .add({ name: 'TaalArcBeef', service: this.arcTaal.postBeef.bind(this.arcTaal) })
      .add({ name: 'Bitails', service: this.bitails.postBeef.bind(this.bitails) })
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.postBeef.bind(this.whatsonchain) })
      ;

    //prettier-ignore
    this.getUtxoStatusServices = new ServiceCollection<sdk.GetUtxoStatusService>('getUtxoStatus')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getUtxoStatus.bind(this.whatsonchain) })

    //prettier-ignore
    this.getStatusForTxidsServices = new ServiceCollection<sdk.GetStatusForTxidsService>('getStatusForTxids')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getStatusForTxids.bind(this.whatsonchain) })

    //prettier-ignore
    this.getScriptHashHistoryServices = new ServiceCollection<sdk.GetScriptHashHistoryService>('getScriptHashHistory')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getScriptHashHistory.bind(this.whatsonchain) })

    //prettier-ignore
    this.updateFiatExchangeRateServices = new ServiceCollection<sdk.UpdateFiatExchangeRateService>('updateFiatExchangeRate')
      .add({ name: 'ChaintracksService', service: updateChaintracksFiatExchangeRates })
      .add({ name: 'exchangeratesapi', service: updateExchangeratesapi })
  }

  getServicesCallHistory(reset?: boolean): ServicesCallHistory {
    return {
      version: 2,
      getMerklePath: this.getMerklePathServices.getServiceCallHistory(reset),
      getRawTx: this.getRawTxServices.getServiceCallHistory(reset),
      postBeef: this.postBeefServices.getServiceCallHistory(reset),
      getUtxoStatus: this.getUtxoStatusServices.getServiceCallHistory(reset),
      getStatusForTxids: this.getStatusForTxidsServices.getServiceCallHistory(reset),
      getScriptHashHistory: this.getScriptHashHistoryServices.getServiceCallHistory(reset),
      updateFiatExchangeRates: this.updateFiatExchangeRateServices.getServiceCallHistory(reset)
    }
  }

  async getChainTracker(): Promise<ChainTracker> {
    if (!this.options.chaintracks)
      throw new sdk.WERR_INVALID_PARAMETER('options.chaintracks', `valid to enable 'getChainTracker' service.`)
    return new ChaintracksChainTracker(this.chain, this.options.chaintracks)
  }

  async getBsvExchangeRate(): Promise<number> {
    this.options.bsvExchangeRate = await this.whatsonchain.updateBsvExchangeRate(
      this.options.bsvExchangeRate,
      this.options.bsvUpdateMsecs
    )
    return this.options.bsvExchangeRate.rate
  }

  async getFiatExchangeRate(currency: 'USD' | 'GBP' | 'EUR', base?: 'USD' | 'GBP' | 'EUR'): Promise<number> {
    const rates = await this.updateFiatExchangeRates(this.options.fiatExchangeRates, this.options.fiatUpdateMsecs)

    this.options.fiatExchangeRates = rates

    base ||= 'USD'
    const rate = rates.rates[currency] / rates.rates[base]

    return rate
  }

  get getProofsCount() {
    return this.getMerklePathServices.count
  }
  get getRawTxsCount() {
    return this.getRawTxServices.count
  }
  get postBeefServicesCount() {
    return this.postBeefServices.count
  }
  get getUtxoStatsCount() {
    return this.getUtxoStatusServices.count
  }

  async getStatusForTxids(txids: string[], useNext?: boolean): Promise<sdk.GetStatusForTxidsResult> {
    const services = this.getStatusForTxidsServices
    if (useNext) services.next()

    let r0: sdk.GetStatusForTxidsResult = {
      name: '<noservices>',
      status: 'error',
      error: new sdk.WERR_INTERNAL('No services available.'),
      results: []
    }

    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(txids)
        if (r.status === 'success') {
          services.addServiceCallSuccess(stc)
          r0 = r
          break
        } else {
          if (r.error) services.addServiceCallError(stc, r.error)
          else services.addServiceCallFailure(stc)
        }
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }

    return r0
  }

  /**
   * @param script Output script to be hashed for `getUtxoStatus` default `outputFormat`
   * @returns script hash in 'hashLE' format, which is the default.
   */
  hashOutputScript(script: string): string {
    const hash = Utils.toHex(sha256Hash(Utils.toArray(script, 'hex')))
    return hash
  }

  async isUtxo(output: TableOutput): Promise<boolean> {
    if (!output.lockingScript) {
      throw new sdk.WERR_INVALID_PARAMETER(
        'output.lockingScript',
        'validated by storage provider validateOutputScript.'
      )
    }
    const hash = this.hashOutputScript(Utils.toHex(output.lockingScript))
    const or = await this.getUtxoStatus(hash, undefined, `${output.txid}.${output.vout}`)
    return or.isUtxo === true
  }

  async getUtxoStatus(
    output: string,
    outputFormat?: sdk.GetUtxoStatusOutputFormat,
    outpoint?: string,
    useNext?: boolean
  ): Promise<sdk.GetUtxoStatusResult> {
    const services = this.getUtxoStatusServices
    if (useNext) services.next()

    let r0: sdk.GetUtxoStatusResult = {
      name: '<noservices>',
      status: 'error',
      error: new sdk.WERR_INTERNAL('No services available.'),
      details: []
    }

    for (let retry = 0; retry < 2; retry++) {
      for (let tries = 0; tries < services.count; tries++) {
        const stc = services.serviceToCall
        try {
          const r = await stc.service(output, outputFormat, outpoint)
          if (r.status === 'success') {
            services.addServiceCallSuccess(stc)
            r0 = r
            break
          } else {
            if (r.error) services.addServiceCallError(stc, r.error)
            else services.addServiceCallFailure(stc)
          }
        } catch (eu: unknown) {
          const e = sdk.WalletError.fromUnknown(eu)
          services.addServiceCallError(stc, e)
        }
        services.next()
      }
      if (r0.status === 'success') break
      await wait(2000)
    }
    return r0
  }

  async getScriptHashHistory(hash: string, useNext?: boolean): Promise<sdk.GetScriptHashHistoryResult> {
    const services = this.getScriptHashHistoryServices
    if (useNext) services.next()

    let r0: sdk.GetScriptHashHistoryResult = {
      name: '<noservices>',
      status: 'error',
      error: new sdk.WERR_INTERNAL('No services available.'),
      history: []
    }

    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(hash)
        if (r.status === 'success') {
          r0 = r
          break
        } else {
          if (r.error) services.addServiceCallError(stc, r.error)
          else services.addServiceCallFailure(stc)
        }
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }
    return r0
  }

  postBeefMode: 'PromiseAll' | 'UntilSuccess' = 'UntilSuccess'

  /**
   *
   * @param beef
   * @param chain
   * @returns
   */
  async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult[]> {
    let rs: sdk.PostBeefResult[] = []
    const services = this.postBeefServices
    const stcs = services.allServicesToCall
    switch (this.postBeefMode) {
      case 'UntilSuccess': {
        for (const stc of stcs) {
          const r = await callService(stc)
          rs.push(r)
          if (r.status === 'success')
            break;
        }
      } break;
      case 'PromiseAll': {
        rs = await Promise.all(
          stcs.map(async stc => {
            const r = await callService(stc)
            return r
          })
        )
      } break;
    }
    return rs

    async function callService(stc: ServiceToCall<sdk.PostBeefService>) {
      const r = await stc.service(beef, txids)
      if (r.status === 'success') {
        services.addServiceCallSuccess(stc)
      } else {
        if (r.error) {
          services.addServiceCallError(stc, r.error)
        } else {
          services.addServiceCallFailure(stc)
        }
      }
      return r
    }
  }

  async getRawTx(txid: string, useNext?: boolean): Promise<sdk.GetRawTxResult> {
    const services = this.getRawTxServices
    if (useNext) services.next()

    const r0: sdk.GetRawTxResult = { txid }

    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(txid, this.chain)
        if (r.rawTx) {
          const hash = asString(doubleSha256BE(r.rawTx!))
          // Confirm transaction hash matches txid
          if (hash === asString(txid)) {
            // If we have a match, call it done.
            r0.rawTx = r.rawTx
            r0.name = r.name
            r0.error = undefined
            services.addServiceCallSuccess(stc)
            break
          }
          r.error = new sdk.WERR_INTERNAL(`computed txid ${hash} doesn't match requested value ${txid}`)
          r.rawTx = undefined
        }

        if (r.error) services.addServiceCallError(stc, r.error)
        else if (!r.rawTx) services.addServiceCallSuccess(stc, `not found`)
        else services.addServiceCallFailure(stc)

        if (r.error && !r0.error && !r0.rawTx)
          // If we have an error and didn't before...
          r0.error = r.error
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }
    return r0
  }

  async invokeChaintracksWithRetry<R>(method: () => Promise<R>): Promise<R> {
    if (!this.options.chaintracks)
      throw new sdk.WERR_INVALID_PARAMETER('options.chaintracks', 'valid for this service operation.')
    for (let retry = 0; retry < 3; retry++) {
      try {
        const r: R = await method()
        return r
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        if (e.code != 'ECONNRESET') throw eu
      }
    }
    throw new sdk.WERR_INVALID_OPERATION('hashToHeader service unavailable')
  }

  async getHeaderForHeight(height: number): Promise<number[]> {
    const method = async () => {
      const header = await this.options.chaintracks!.findHeaderForHeight(height)
      if (!header) throw new sdk.WERR_INVALID_PARAMETER('hash', `valid height '${height}' on mined chain ${this.chain}`)
      return toBinaryBaseBlockHeader(header)
    }
    return this.invokeChaintracksWithRetry(method)
  }

  async getHeight(): Promise<number> {
    const method = async () => {
      return await this.options.chaintracks!.currentHeight()
    }
    return this.invokeChaintracksWithRetry(method)
  }

  async hashToHeader(hash: string): Promise<sdk.BlockHeader> {
    const method = async () => {
      const header = await this.options.chaintracks!.findHeaderForBlockHash(hash)
      if (!header)
        throw new sdk.WERR_INVALID_PARAMETER('hash', `valid blockhash '${hash}' on mined chain ${this.chain}`)
      return header
    }
    return this.invokeChaintracksWithRetry(method)
  }

  async getMerklePath(txid: string, useNext?: boolean): Promise<sdk.GetMerklePathResult> {
    const services = this.getMerklePathServices
    if (useNext) services.next()

    const r0: sdk.GetMerklePathResult = { notes: [] }

    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(txid, this)
        if (r.notes) r0.notes!.push(...r.notes)
        if (!r0.name) r0.name = r.name
        if (r.merklePath) {
          // If we have a proof, call it done.
          r0.merklePath = r.merklePath
          r0.header = r.header
          r0.name = r.name
          r0.error = undefined
          services.addServiceCallSuccess(stc)
          break
        }

        if (r.error) services.addServiceCallError(stc, r.error)
        else services.addServiceCallFailure(stc)

        if (r.error && !r0.error) {
          // If we have an error and didn't before...
          r0.error = r.error
        }
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }
    return r0
  }

  targetCurrencies = ['USD', 'GBP', 'EUR']

  async updateFiatExchangeRates(rates?: sdk.FiatExchangeRates, updateMsecs?: number): Promise<sdk.FiatExchangeRates> {
    updateMsecs ||= 1000 * 60 * 15
    const freshnessDate = new Date(Date.now() - updateMsecs)
    if (rates) {
      // Check if the rate we know is stale enough to update.
      updateMsecs ||= 1000 * 60 * 15
      if (rates.timestamp > freshnessDate) return rates
    }

    // Make sure we always start with the first service listed (chaintracks aggregator)
    const services = this.updateFiatExchangeRateServices.clone()

    let r0: sdk.FiatExchangeRates | undefined

    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(this.targetCurrencies, this.options)
        if (this.targetCurrencies.every(c => typeof r.rates[c] === 'number')) {
          services.addServiceCallSuccess(stc)
          r0 = r
          break
        } else {
          services.addServiceCallFailure(stc)
        }
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }

    if (!r0) {
      console.error('Failed to update fiat exchange rates.')
      if (!rates) throw new sdk.WERR_INTERNAL()
      return rates
    }

    return r0
  }

  async nLockTimeIsFinal(tx: string | number[] | BsvTransaction | number): Promise<boolean> {
    const MAXINT = 0xffffffff
    const BLOCK_LIMIT = 500000000

    let nLockTime: number

    if (typeof tx === 'number') nLockTime = tx
    else {
      if (typeof tx === 'string') {
        tx = BsvTransaction.fromHex(tx)
      } else if (Array.isArray(tx)) {
        tx = BsvTransaction.fromBinary(tx)
      }

      if (tx instanceof BsvTransaction) {
        if (tx.inputs.every(i => i.sequence === MAXINT)) {
          return true
        }
        nLockTime = tx.lockTime
      } else {
        throw new sdk.WERR_INTERNAL('Should be either @bsv/sdk Transaction or babbage-bsv Transaction')
      }
    }

    if (nLockTime >= BLOCK_LIMIT) {
      const limit = Math.floor(Date.now() / 1000)
      return nLockTime < limit
    }

    const height = await this.getHeight()
    return nLockTime < height
  }

  async getBeefForTxid(txid: string): Promise<Beef> {
    const beef = await getBeefForTxid(this, txid)
    return beef
  }
}

export function validateScriptHash(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat): string {
  let b = asArray(output)
  if (!outputFormat) {
    if (b.length === 32) outputFormat = 'hashLE'
    else outputFormat = 'script'
  }
  switch (outputFormat) {
    case 'hashBE':
      break
    case 'hashLE':
      b = b.reverse()
      break
    case 'script':
      b = sha256Hash(b).reverse()
      break
    default:
      throw new sdk.WERR_INVALID_PARAMETER('outputFormat', `not be ${outputFormat}`)
  }
  return asString(b)
}

/**
 * Serializes a block header as an 80 byte array.
 * The exact serialized format is defined in the Bitcoin White Paper
 * such that computing a double sha256 hash of the array computes
 * the block hash for the header.
 * @returns 80 byte array
 * @publicbody
 */
export function toBinaryBaseBlockHeader(header: sdk.BaseBlockHeader): number[] {
  const writer = new Utils.Writer()
  writer.writeUInt32BE(header.version)
  writer.writeReverse(asArray(header.previousHash))
  writer.writeReverse(asArray(header.merkleRoot))
  writer.writeUInt32BE(header.time)
  writer.writeUInt32BE(header.bits)
  writer.writeUInt32BE(header.nonce)
  const r = writer.toArray()
  return r
}
