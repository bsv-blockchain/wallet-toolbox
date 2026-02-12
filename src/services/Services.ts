import { Transaction as BsvTransaction, Beef, ChainTracker, Utils, WalletLoggerInterface } from '@bsv/sdk'
import { ServiceCollection, ServiceToCall } from './ServiceCollection'
import { createDefaultWalletServicesOptions } from './createDefaultWalletServicesOptions'
import { WhatsOnChain } from './providers/WhatsOnChain'
import { updateExchangeratesapi } from './providers/exchangeRates'
import { ARC } from './providers/ARC'
import { Bitails } from './providers/Bitails'
import { getBeefForTxid } from './providers/getBeefForTxid'
import {
  BaseBlockHeader,
  BlockHeader,
  FiatExchangeRates,
  GetMerklePathResult,
  GetMerklePathService,
  GetRawTxResult,
  GetRawTxService,
  GetScriptHashHistoryResult,
  GetScriptHashHistoryService,
  GetStatusForTxidsResult,
  GetStatusForTxidsService,
  GetUtxoStatusOutputFormat,
  GetUtxoStatusResult,
  GetUtxoStatusService,
  PostBeefResult,
  PostBeefService,
  ServicesCallHistory,
  UpdateFiatExchangeRateService,
  WalletServices,
  WalletServicesOptions
} from '../sdk/WalletServices.interfaces'
import type { FiatCurrencyCode } from '../sdk/WalletServices.interfaces'
import { Chain } from '../sdk/types'
import { WERR_INTERNAL, WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../sdk/WERR_errors'
import { ChaintracksChainTracker } from './chaintracker/ChaintracksChainTracker'
import { WalletError } from '../sdk/WalletError'
import { doubleSha256BE, sha256Hash, wait } from '../utility/utilityHelpers'
import { TableOutput } from '../storage/schema/tables/TableOutput'
import { asArray, asString } from '../utility/utilityHelpers.noBuffer'

export class Services implements WalletServices {
  static createDefaultOptions(chain: Chain): WalletServicesOptions {
    return createDefaultWalletServicesOptions(chain)
  }

  options: WalletServicesOptions
  whatsonchain: WhatsOnChain
  arcTaal: ARC
  arcGorillaPool?: ARC
  bitails: Bitails

  getMerklePathServices: ServiceCollection<GetMerklePathService>
  getRawTxServices: ServiceCollection<GetRawTxService>
  postBeefServices: ServiceCollection<PostBeefService>
  getUtxoStatusServices: ServiceCollection<GetUtxoStatusService>
  getStatusForTxidsServices: ServiceCollection<GetStatusForTxidsService>
  getScriptHashHistoryServices: ServiceCollection<GetScriptHashHistoryService>
  updateFiatExchangeRateServices: ServiceCollection<UpdateFiatExchangeRateService>

  chain: Chain

  constructor(optionsOrChain: Chain | WalletServicesOptions) {
    this.chain = typeof optionsOrChain === 'string' ? optionsOrChain : optionsOrChain.chain

    if (this.chain === 'mock') {
      throw new WERR_INVALID_PARAMETER('chain', `'main', 'test', or 'teratest'. Use MockServices for 'mock' chain.`)
    }

    this.options = typeof optionsOrChain === 'string' ? Services.createDefaultOptions(this.chain) : optionsOrChain

    this.whatsonchain = new WhatsOnChain(this.chain, { apiKey: this.options.whatsOnChainApiKey }, this)

    this.arcTaal = new ARC(this.options.arcUrl, this.options.arcConfig, 'arcTaal')
    if (this.options.arcGorillaPoolUrl) {
      this.arcGorillaPool = new ARC(this.options.arcGorillaPoolUrl, this.options.arcGorillaPoolConfig, 'arcGorillaPool')
    }

    this.bitails = new Bitails(this.chain, { apiKey: this.options.bitailsApiKey })

    const hasBitails = this.chain === 'main' || this.chain === 'test'

    //prettier-ignore
    this.getMerklePathServices = new ServiceCollection<GetMerklePathService>('getMerklePath')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getMerklePath.bind(this.whatsonchain) })
    if (hasBitails) {
      this.getMerklePathServices.add({ name: 'Bitails', service: this.bitails.getMerklePath.bind(this.bitails) })
    }

    //prettier-ignore
    this.getRawTxServices = new ServiceCollection<GetRawTxService>('getRawTx')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getRawTxResult.bind(this.whatsonchain) })

    this.postBeefServices = new ServiceCollection<PostBeefService>('postBeef')
    if (this.arcGorillaPool) {
      //prettier-ignore
      this.postBeefServices.add({ name: 'GorillaPoolArcBeef', service: this.arcGorillaPool.postBeef.bind(this.arcGorillaPool) })
    }
    //prettier-ignore
    this.postBeefServices
      .add({ name: 'TaalArcBeef', service: this.arcTaal.postBeef.bind(this.arcTaal) })
    if (hasBitails) {
      this.postBeefServices.add({ name: 'Bitails', service: this.bitails.postBeef.bind(this.bitails) })
    }
    //prettier-ignore
    this.postBeefServices
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.postBeef.bind(this.whatsonchain) })
      ;

    //prettier-ignore
    this.getUtxoStatusServices = new ServiceCollection<GetUtxoStatusService>('getUtxoStatus')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getUtxoStatus.bind(this.whatsonchain) })

    //prettier-ignore
    this.getStatusForTxidsServices = new ServiceCollection<GetStatusForTxidsService>('getStatusForTxids')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getStatusForTxids.bind(this.whatsonchain) })

    //prettier-ignore
    this.getScriptHashHistoryServices = new ServiceCollection<GetScriptHashHistoryService>('getScriptHashHistory')
      .add({ name: 'WhatsOnChain', service: this.whatsonchain.getScriptHashHistory.bind(this.whatsonchain) })

    //prettier-ignore
    this.updateFiatExchangeRateServices = new ServiceCollection<UpdateFiatExchangeRateService>('updateFiatExchangeRate')
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
      throw new WERR_INVALID_PARAMETER('options.chaintracks', `valid to enable 'getChainTracker' service.`)
    return new ChaintracksChainTracker(this.chain, this.options.chaintracks)
  }

  async getBsvExchangeRate(): Promise<number> {
    this.options.bsvExchangeRate = await this.whatsonchain.updateBsvExchangeRate(
      this.options.bsvExchangeRate,
      this.options.bsvUpdateMsecs
    )
    return this.options.bsvExchangeRate.rate
  }

  async getFiatExchangeRate(currency: FiatCurrencyCode, base?: FiatCurrencyCode): Promise<number> {
    base ||= 'USD'
    if (currency === base) return 1

    const required: FiatCurrencyCode[] = base === 'USD' ? [currency] : [currency, base]
    await this.updateFiatExchangeRates(required, this.options.fiatUpdateMsecs)

    const rates = this.options.fiatExchangeRates
    const c = rates.rates?.[currency]
    const b = rates.rates?.[base]
    if (typeof c !== 'number') {
      throw new WERR_INVALID_PARAMETER('currency', `valid fiat currency '${currency}' with an exchange rate.`)
    }
    if (typeof b !== 'number') {
      throw new WERR_INVALID_PARAMETER('base', `valid fiat currency '${base}' with an exchange rate.`)
    }
    return c / b
  }

  async getFiatExchangeRates(targetCurrencies: FiatCurrencyCode[]): Promise<FiatExchangeRates> {
    await this.updateFiatExchangeRates(targetCurrencies, this.options.fiatUpdateMsecs)

    const stored = this.options.fiatExchangeRates
    const rates: Record<string, number> = {}
    for (const c of targetCurrencies) {
      const v = stored.rates?.[c]
      if (typeof v === 'number') {
        rates[c] = v
      }
    }

    return {
      timestamp: stored.timestamp,
      base: 'USD',
      rates,
      rateTimestamps: stored.rateTimestamps
    }
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

  async getStatusForTxids(txids: string[], useNext?: boolean): Promise<GetStatusForTxidsResult> {
    const services = this.getStatusForTxidsServices
    if (useNext) services.next()

    let r0: GetStatusForTxidsResult = {
      name: '<noservices>',
      status: 'error',
      error: new WERR_INTERNAL('No services available.'),
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
        const e = WalletError.fromUnknown(eu)
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
      throw new WERR_INVALID_PARAMETER('output.lockingScript', 'validated by storage provider validateOutputScript.')
    }
    const hash = this.hashOutputScript(Utils.toHex(output.lockingScript))
    const or = await this.getUtxoStatus(hash, undefined, `${output.txid}.${output.vout}`)
    return or.isUtxo === true
  }

  async getUtxoStatus(
    output: string,
    outputFormat?: GetUtxoStatusOutputFormat,
    outpoint?: string,
    useNext?: boolean,
    logger?: WalletLoggerInterface
  ): Promise<GetUtxoStatusResult> {
    const services = this.getUtxoStatusServices
    if (useNext) services.next()

    let r0: GetUtxoStatusResult = {
      name: '<noservices>',
      status: 'error',
      error: new WERR_INTERNAL('No services available.'),
      details: []
    }

    logger?.group(`services getUtxoStatus`)
    for (let retry = 0; retry < 2; retry++) {
      for (let tries = 0; tries < services.count; tries++) {
        const stc = services.serviceToCall
        try {
          const r = await stc.service(output, outputFormat, outpoint)
          logger?.log(`${stc.providerName} status ${r.status}`)
          if (r.status === 'success') {
            services.addServiceCallSuccess(stc)
            r0 = r
            break
          } else {
            if (r.error) services.addServiceCallError(stc, r.error)
            else services.addServiceCallFailure(stc)
          }
        } catch (eu: unknown) {
          const e = WalletError.fromUnknown(eu)
          services.addServiceCallError(stc, e)
        }
        services.next()
      }
      if (r0.status === 'success') break
      await wait(2000)
    }
    logger?.groupEnd()
    return r0
  }

  async getScriptHashHistory(
    hash: string,
    useNext?: boolean,
    logger?: WalletLoggerInterface
  ): Promise<GetScriptHashHistoryResult> {
    const services = this.getScriptHashHistoryServices
    if (useNext) services.next()

    let r0: GetScriptHashHistoryResult = {
      name: '<noservices>',
      status: 'error',
      error: new WERR_INTERNAL('No services available.'),
      history: []
    }

    logger?.group(`services getScriptHashHistory`)
    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(hash)
        logger?.log(`${stc.providerName} status ${r.status}`)
        if (r.status === 'success') {
          r0 = r
          break
        } else {
          if (r.error) services.addServiceCallError(stc, r.error)
          else services.addServiceCallFailure(stc)
        }
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }
    logger?.groupEnd()
    return r0
  }

  postBeefMode: 'PromiseAll' | 'UntilSuccess' = 'UntilSuccess'

  /**
   *
   * @param beef
   * @param chain
   * @returns
   */
  async postBeef(beef: Beef, txids: string[], logger?: WalletLoggerInterface): Promise<PostBeefResult[]> {
    let rs: PostBeefResult[] = []
    const services = this.postBeefServices
    const stcs = services.allServicesToCall
    logger?.group(`services postBeef`)
    switch (this.postBeefMode) {
      case 'UntilSuccess':
        {
          for (const stc of stcs) {
            const r = await callService(stc)
            logger?.log(`${stc.providerName} status ${r.status}`)
            rs.push(r)
            if (r.status === 'success') break
            if (r.txidResults && r.txidResults.every(txr => txr.serviceError)) {
              // move this service to the end of the list
              this.postBeefServices.moveServiceToLast(stc)
            }
          }
        }
        break
      case 'PromiseAll':
        {
          rs = await Promise.all(
            stcs.map(async stc => {
              const r = await callService(stc)
              return r
            })
          )
        }
        break
    }
    logger?.groupEnd()
    return rs

    async function callService(stc: ServiceToCall<PostBeefService>) {
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

  async getRawTx(txid: string, useNext?: boolean): Promise<GetRawTxResult> {
    const services = this.getRawTxServices
    if (useNext) services.next()

    const r0: GetRawTxResult = { txid }

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
          r.error = new WERR_INTERNAL(`computed txid ${hash} doesn't match requested value ${txid}`)
          r.rawTx = undefined
        }

        if (r.error) services.addServiceCallError(stc, r.error)
        else if (!r.rawTx) services.addServiceCallSuccess(stc, `not found`)
        else services.addServiceCallFailure(stc)

        if (r.error && !r0.error && !r0.rawTx)
          // If we have an error and didn't before...
          r0.error = r.error
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }
    return r0
  }

  async invokeChaintracksWithRetry<R>(method: () => Promise<R>): Promise<R> {
    if (!this.options.chaintracks)
      throw new WERR_INVALID_PARAMETER('options.chaintracks', 'valid for this service operation.')
    for (let retry = 0; retry < 3; retry++) {
      try {
        const r: R = await method()
        return r
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
        if (e.code != 'ECONNRESET') throw eu
      }
    }
    throw new WERR_INVALID_OPERATION('hashToHeader service unavailable')
  }

  async getHeaderForHeight(height: number): Promise<number[]> {
    const method = async () => {
      const header = await this.options.chaintracks!.findHeaderForHeight(height)
      if (!header) throw new WERR_INVALID_PARAMETER('hash', `valid height '${height}' on mined chain ${this.chain}`)
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

  async hashToHeader(hash: string): Promise<BlockHeader> {
    const method = async () => {
      const header = await this.options.chaintracks!.findHeaderForBlockHash(hash)
      return header
    }
    let header = await this.invokeChaintracksWithRetry(method)
    if (!header) {
      header = await this.whatsonchain.getBlockHeaderByHash(hash)
    }
    if (!header) throw new WERR_INVALID_PARAMETER('hash', `valid blockhash '${hash}' on mined chain ${this.chain}`)
    return header
  }

  async getMerklePath(txid: string, useNext?: boolean, logger?: WalletLoggerInterface): Promise<GetMerklePathResult> {
    const services = this.getMerklePathServices
    if (useNext) services.next()

    const r0: GetMerklePathResult = { notes: [] }

    logger?.group(`services getMerklePath`)
    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(txid, this)
        if (r.notes) r0.notes!.push(...r.notes)
        if (!r0.name) r0.name = r.name
        if (r.merklePath) {
          logger?.log(`${stc.providerName} has merklePath`)
          // If we have a proof, call it done.
          r0.merklePath = r.merklePath
          r0.header = r.header
          r0.name = r.name
          r0.error = undefined
          services.addServiceCallSuccess(stc)
          break
        } else {
          logger?.log(`${stc.providerName} no merklePath`)
        }

        if (r.error) services.addServiceCallError(stc, r.error)
        else services.addServiceCallFailure(stc)

        if (r.error && !r0.error) {
          // If we have an error and didn't before...
          r0.error = r.error
        }
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }
    return r0
  }

  async updateFiatExchangeRates(
    targetCurrencies: FiatCurrencyCode[],
    updateMsecs?: number
  ): Promise<FiatExchangeRates> {
    updateMsecs ||= 1000 * 60 * 60 * 24
    const freshnessDate = new Date(Date.now() - updateMsecs)

    const stored = this.options.fiatExchangeRates
    const storedRates = stored.rates ?? {}

    const toFetch: FiatCurrencyCode[] = []
    for (const c of targetCurrencies) {
      if (c === 'USD') {
        if (typeof storedRates.USD !== 'number') {
          storedRates.USD = 1
        }
        continue
      }

      const v = storedRates[c]
      const ts = stored.rateTimestamps?.[c] ?? stored.timestamp
      const fresh = typeof v === 'number' && ts instanceof Date && ts > freshnessDate
      if (!fresh) {
        toFetch.push(c)
      }
    }

    if (toFetch.length === 0) {
      this.options.fiatExchangeRates = {
        timestamp: stored.timestamp,
        base: stored.base,
        rates: storedRates,
        rateTimestamps: stored.rateTimestamps
      }
      return this.options.fiatExchangeRates
    }

    const services = this.updateFiatExchangeRateServices.clone()
    let fetched: FiatExchangeRates | undefined

    for (let tries = 0; tries < services.count; tries++) {
      const stc = services.serviceToCall
      try {
        const r = await stc.service(toFetch as string[], this.options)
        if (toFetch.every(c => c === 'USD' || typeof r.rates?.[c] === 'number')) {
          services.addServiceCallSuccess(stc)
          fetched = r
          break
        } else {
          services.addServiceCallFailure(stc)
        }
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
        services.addServiceCallError(stc, e)
      }
      services.next()
    }

    if (!fetched) {
      if (stored && Object.keys(storedRates).length > 0) {
        return stored
      }
      throw new WERR_INTERNAL()
    }

    const nextRates: Record<string, number> = { ...storedRates }
    const nextTimestamps: Record<string, Date> = { ...(stored.rateTimestamps ?? {}) }

    for (const c of toFetch) {
      const v = fetched.rates?.[c]
      if (typeof v === 'number') {
        nextRates[c] = v
        nextTimestamps[c] = fetched.timestamp
      }
    }

    const nextTimestamp = new Date(
      Math.max(
        stored.timestamp instanceof Date ? stored.timestamp.getTime() : new Date(stored.timestamp).getTime(),
        fetched.timestamp.getTime()
      )
    )

    this.options.fiatExchangeRates = {
      timestamp: nextTimestamp,
      base: stored.base,
      rates: nextRates,
      rateTimestamps: nextTimestamps
    }

    return this.options.fiatExchangeRates
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
        throw new WERR_INTERNAL('Should be either @bsv/sdk Transaction or babbage-bsv Transaction')
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

export function validateScriptHash(output: string, outputFormat?: GetUtxoStatusOutputFormat): string {
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
      throw new WERR_INVALID_PARAMETER('outputFormat', `not be ${outputFormat}`)
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
export function toBinaryBaseBlockHeader(header: BaseBlockHeader): number[] {
  const writer = new Utils.Writer()
  writer.writeUInt32LE(header.version)
  writer.writeReverse(asArray(header.previousHash))
  writer.writeReverse(asArray(header.merkleRoot))
  writer.writeUInt32LE(header.time)
  writer.writeUInt32LE(header.bits)
  writer.writeUInt32LE(header.nonce)
  const r = writer.toArray()
  return r
}
