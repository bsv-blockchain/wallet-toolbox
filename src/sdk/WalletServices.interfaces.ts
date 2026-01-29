import {
  ArcConfig,
  Beef,
  Transaction as BsvTransaction,
  ChainTracker,
  MerklePath,
  WalletLoggerInterface
} from '@bsv/sdk'
import { Chain, ReqHistoryNote } from './types'
import { WalletError } from './WalletError'
import { TableOutput } from '../storage/schema/tables/TableOutput'
import { ChaintracksClientApi } from '../services/chaintracker/chaintracks/Api/ChaintracksClientApi'
/**
 * Defines standard interfaces to access functionality implemented by external transaction processing services.
 */
export interface WalletServices {
  /**
   * The chain being serviced.
   */
  chain: Chain

  /**
   * @returns standard `ChainTracker` service which requires `options.chaintracks` be valid.
   */
  getChainTracker(): Promise<ChainTracker>

  /**
   * @returns serialized block header for height on active chain
   * @param height
   */
  getHeaderForHeight(height: number): Promise<number[]>

  /**
   * @returns the height of the active chain
   */
  getHeight(): Promise<number>

  /**
   * Approximate exchange rate US Dollar / BSV, USD / BSV
   *
   * This is the US Dollar price of one BSV
   */
  getBsvExchangeRate(): Promise<number>

  /**
   * Approximate exchange rate currency per base.
   */
  getFiatExchangeRate(currency: 'USD' | 'GBP' | 'EUR', base?: 'USD' | 'GBP' | 'EUR'): Promise<number>

  /**
   * Attempts to obtain the raw transaction bytes associated with a 32 byte transaction hash (txid).
   *
   * Cycles through configured transaction processing services attempting to get a valid response.
   *
   * On success:
   * Result txid is the requested transaction hash
   * Result rawTx will be an array containing raw transaction bytes.
   * Result name will be the responding service's identifying name.
   * Returns result without incrementing active service.
   *
   * On failure:
   * Result txid is the requested transaction hash
   * Result mapi will be the first mapi response obtained (service name and response), or null
   * Result error will be the first error thrown (service name and CwiError), or null
   * Increments to next configured service and tries again until all services have been tried.
   *
   * @param txid transaction hash for which raw transaction bytes are requested
   * @param useNext optional, forces skip to next service before starting service requests cycle.
   */
  getRawTx(txid: string, useNext?: boolean): Promise<GetRawTxResult>

  /**
   * Attempts to obtain the merkle proof associated with a 32 byte transaction hash (txid).
   *
   * Cycles through configured transaction processing services attempting to get a valid response.
   *
   * On success:
   * Result txid is the requested transaction hash
   * Result proof will be the merkle proof.
   * Result name will be the responding service's identifying name.
   * Returns result without incrementing active service.
   *
   * On failure:
   * Result txid is the requested transaction hash
   * Result mapi will be the first mapi response obtained (service name and response), or null
   * Result error will be the first error thrown (service name and CwiError), or null
   * Increments to next configured service and tries again until all services have been tried.
   *
   * @param txid transaction hash for which proof is requested
   * @param useNext optional, forces skip to next service before starting service requests cycle.
   */
  getMerklePath(txid: string, useNext?: boolean): Promise<GetMerklePathResult>

  /**
   *
   * @param beef
   * @param txids
   * @param chain
   * @returns
   */
  postBeef(beef: Beef, txids: string[], logger?: WalletLoggerInterface): Promise<PostBeefResult[]>

  /**
   * @param script Output script to be hashed for `getUtxoStatus` default `outputFormat`
   * @returns script hash in 'hashLE' format, which is the default.
   */
  hashOutputScript(script: string): string

  /**
   * For an array of one or more txids, returns for each wether it is a 'known', 'mined', or 'unknown' transaction.
   *
   * Primarily useful for determining if a recently broadcast transaction is known to the processing network.
   *
   * Also returns the current depth from chain tip if 'mined'.
   *
   * @param txids
   * @param useNext
   */
  getStatusForTxids(txids: string[], useNext?: boolean): Promise<GetStatusForTxidsResult>

  /**
   * Calls getUtxoStatus with the hash of the output's lockingScript,
   * and ensures that the output's outpoint matches an unspent use of that script.
   *
   * @param output
   * @returns true if the output appears to currently be spendable.
   */
  isUtxo(output: TableOutput): Promise<boolean>

  /**
   * Attempts to determine the UTXO status of a transaction output.
   *
   * Cycles through configured transaction processing services attempting to get a valid response.
   *
   * @param output transaction output identifier in format determined by `outputFormat`.
   * @param chain which chain to post to, all of rawTx's inputs must be unspent on this chain.
   * @param outputFormat optional, supported values:
   *      'hashLE' little-endian sha256 hash of output script
   *      'hashBE' big-endian sha256 hash of output script
   *      'script' entire transaction output script
   *      undefined if length of `output` is 32 hex bytes then 'hashBE`, otherwise 'script'.
   * @param outpoint if valid, result isUtxo is true only if this txid and vout match an unspent occurance of output script. `${txid}.${vout}` format.
   * @param useNext optional, forces skip to next service before starting service requests cycle.
   */
  getUtxoStatus(
    output: string,
    outputFormat?: GetUtxoStatusOutputFormat,
    outpoint?: string,
    useNext?: boolean
  ): Promise<GetUtxoStatusResult>

  getScriptHashHistory(
    hash: string,
    useNext?: boolean,
    logger?: WalletLoggerInterface
  ): Promise<GetScriptHashHistoryResult>

  /**
   * @returns a block header
   * @param hash block hash
   */
  hashToHeader(hash: string): Promise<BlockHeader>

  /**
   * @returns whether the locktime value allows the transaction to be mined at the current chain height
   * @param txOrLockTime either a bitcoin locktime value or hex, binary, un-encoded Transaction
   */
  nLockTimeIsFinal(txOrLockTime: string | number[] | BsvTransaction | number): Promise<boolean>

  /**
   * Constructs a `Beef` for the given `txid` using only external data retrieval services.
   *
   * In most cases, the `getBeefForTransaction` method of the `StorageProvider` class should be
   * used instead to avoid redundantly retrieving data.
   *
   * @throws errors if txid does not correspond to a valid transaction as determined by the
   * configured services.
   *
   * @param txid
   */
  getBeefForTxid(txid: string): Promise<Beef>

  /**
   * @param reset if true, ends current interval and starts a new one.
   * @returns a history of service calls made to the configured services.
   */
  getServicesCallHistory(reset?: boolean): ServicesCallHistory
}

export type ScriptHashFormat = 'hashLE' | 'hashBE' | 'script'
export type GetUtxoStatusOutputFormat = 'hashLE' | 'hashBE' | 'script'

export interface BsvExchangeRate {
  timestamp: Date
  base: 'USD'
  rate: number
}

export interface FiatExchangeRates {
  timestamp: Date
  base: 'USD'
  rates: Record<string, number>
}

export interface WalletServicesOptions {
  /**
   * 'main' or 'test': which BSV chain to use
   */
  chain: Chain
  /**
   * As of 2025-08-31 the `taalApiKey` is unused for default configured services.
   * See `arcConfig` instead.
   */
  taalApiKey?: string
  /**
   * Api key for use accessing Bitails API at
   * mainnet: `https://api.bitails.io/`
   * testnet: `https://test-api.bitails.io/`
   */
  bitailsApiKey?: string
  /**
   * Api key for use accessing WhatsOnChain API at
   * mainnet: `https://api.whatsonchain.com/v1/bsv/main`
   * testnet: `https://api.whatsonchain.com/v1/bsv/test`
   */
  whatsOnChainApiKey?: string
  /**
   * The initial approximate BSV/USD exchange rate.
   */
  bsvExchangeRate: BsvExchangeRate
  /**
   * Update interval for BSV/USD exchange rate.
   * Default is 15 minutes.
   */
  bsvUpdateMsecs: number
  /**
   * The initial approximate fiat exchange rates with USD as base.
   */
  fiatExchangeRates: FiatExchangeRates
  /**
   * Update interval for Fiat exchange rates.
   * Default is 24 hours.
   */
  fiatUpdateMsecs: number
  /**
   * MAPI callbacks are deprecated at this time.
   */
  disableMapiCallback?: boolean
  /**
   * API key for use accessing fiat exchange rates API at
   * `http://api.exchangeratesapi.io/v1/latest?access_key=${key}`
   *
   * Obtain your own api key here:
   * https://manage.exchangeratesapi.io/signup/free
   */
  exchangeratesapiKey?: string
  /**
   * Due to the default use of a free exchangeratesapiKey with low usage limits,
   * the `ChaintracksService` can act as a request rate multiplier.
   *
   * By default the following endpoint is used:
   * `https://mainnet-chaintracks.babbage.systems/getFiatExchangeRates`
   */
  chaintracksFiatExchangeRatesUrl?: string
  /**
   * Optional Chaintracks client API instance.
   * Default is a new instance of ChaintracksServiceClient configured to use:
   * mainnet: `https://mainnet-chaintracks.babbage.systems`
   * testnet: `https://testnet-chaintracks.babbage.systems`
   */
  chaintracks?: ChaintracksClientApi
  /**
   * TAAL ARC service provider endpoit to use
   * Default is:
   * mainnet: `https://arc.taal.com`
   * testnet: `https://arc-test.taal.com`
   */
  arcUrl: string
  /**
   * TAAL ARC service configuration options.
   *
   * apiKey Default value is undefined.
   *
   * deploymentId Default value: `wallet-toolbox-${randomBytesHex(16)}`.
   *
   * callbackUrl Default is undefined.
   * callbackToken Default is undefined.
   */
  arcConfig: ArcConfig
  /**
   * GorillaPool ARC service provider endpoit to use
   * Default is:
   * mainnet: `https://arc.gorillapool.io`
   * testnet: undefined
   */
  arcGorillaPoolUrl?: string
  /**
   * GorillaPool ARC service configuration options.
   *
   * apiKey Default is undefined.
   *
   * deploymentId Default value: `wallet-toolbox-${randomBytesHex(16)}`.
   *
   * callbackUrl Default is undefined.
   * callbackToken Default is undefined.
   */
  arcGorillaPoolConfig?: ArcConfig
}

export interface GetStatusForTxidsResult {
  /**
   * The name of the service returning these results.
   */
  name: string
  status: 'success' | 'error'
  /**
   * The first exception error that occurred during processing, if any.
   */
  error?: WalletError
  results: StatusForTxidResult[]
}

export interface StatusForTxidResult {
  txid: string
  /**
   * roughly depth of block containing txid from chain tip.
   */
  depth: number | undefined
  /**
   * 'mined' if depth > 0
   * 'known' if depth === 0
   * 'unknown' if depth === undefined, txid may be old an purged or never processed.
   */
  status: 'mined' | 'known' | 'unknown'
}

/**
 * Properties on result returned from `WalletServices` function `getRawTx`.
 */
export interface GetRawTxResult {
  /**
   * Transaction hash or rawTx (and of initial request)
   */
  txid: string
  /**
   * The name of the service returning the rawTx, or undefined if no rawTx
   */
  name?: string
  /**
   * Multiple proofs may be returned when a transaction also appears in
   * one or more orphaned blocks
   */
  rawTx?: number[]
  /**
   * The first exception error that occurred during processing, if any.
   */
  error?: WalletError
}

/**
 * Properties on result returned from `WalletServices` function `getMerkleProof`.
 */
export interface GetMerklePathResult {
  /**
   * The name of the service returning the proof, or undefined if no proof
   */
  name?: string
  /**
   * Multiple proofs may be returned when a transaction also appears in
   * one or more orphaned blocks
   */
  merklePath?: MerklePath

  header?: BlockHeader

  /**
   * The first exception error that occurred during processing, if any.
   */
  error?: WalletError

  notes?: ReqHistoryNote[]
}

export interface PostTxResultForTxid {
  txid: string

  /**
   * 'success' - The transaction was accepted for processing
   */
  status: 'success' | 'error'

  /**
   * if true, the transaction was already known to this service. Usually treat as a success.
   *
   * Potentially stop posting to additional transaction processors.
   */
  alreadyKnown?: boolean

  /**
   * service indicated this broadcast double spends at least one input
   * `competingTxs` may be an array of txids that were first seen spends of at least one input.
   */
  doubleSpend?: boolean

  blockHash?: string
  blockHeight?: number
  merklePath?: MerklePath

  competingTxs?: string[]

  data?: object | string | PostTxResultForTxidError

  notes?: ReqHistoryNote[]

  /**
   * true iff service was unable to process a potentially valid transaction
   */
  serviceError?: boolean
}

export interface PostTxResultForTxidError {
  status?: string
  detail?: string
  more?: object
}

export interface PostBeefResult extends PostTxsResult {}

/**
 * Properties on array items of result returned from `WalletServices` function `postBeef`.
 */
export interface PostTxsResult {
  /**
   * The name of the service to which the transaction was submitted for processing
   */
  name: string
  /**
   * 'success' all txids returned status of 'success'
   * 'error' one or more txids returned status of 'error'. See txidResults for details.
   */
  status: 'success' | 'error'

  error?: WalletError

  txidResults: PostTxResultForTxid[]

  /**
   * Service response object. Use service name and status to infer type of object.
   */
  data?: object

  notes?: ReqHistoryNote[]
}

export interface GetUtxoStatusDetails {
  /**
   * if isUtxo, the block height containing the matching unspent transaction output
   *
   * typically there will be only one, but future orphans can result in multiple values
   */
  height?: number
  /**
   * if isUtxo, the transaction hash (txid) of the transaction containing the matching unspent transaction output
   *
   * typically there will be only one, but future orphans can result in multiple values
   */
  txid?: string
  /**
   * if isUtxo, the output index in the transaction containing of the matching unspent transaction output
   *
   * typically there will be only one, but future orphans can result in multiple values
   */
  index?: number
  /**
   * if isUtxo, the amount of the matching unspent transaction output
   *
   * typically there will be only one, but future orphans can result in multiple values
   */
  satoshis?: number
}

export interface GetUtxoStatusResult {
  /**
   * The name of the service to which the transaction was submitted for processing
   */
  name: string
  /**
   * 'success' - the operation was successful, non-error results are valid.
   * 'error' - the operation failed, error may have relevant information.
   */
  status: 'success' | 'error'
  /**
   * When status is 'error', provides code and description
   */
  error?: WalletError
  /**
   * true if the output is associated with at least one unspent transaction output
   */
  isUtxo?: boolean
  /**
   * Additional details about occurances of this output script as a utxo.
   *
   * Normally there will be one item in the array but due to the possibility of orphan races
   * there could be more than one block in which it is a valid utxo.
   */
  details: GetUtxoStatusDetails[]
}

export interface GetScriptHashHistory {
  txid: string
  height?: number
}

export interface GetScriptHashHistoryResult {
  /**
   * The name of the service to which the transaction was submitted for processing
   */
  name: string
  /**
   * 'success' - the operation was successful, non-error results are valid.
   * 'error' - the operation failed, error may have relevant information.
   */
  status: 'success' | 'error'
  /**
   * When status is 'error', provides code and description
   */
  error?: WalletError
  /**
   * Transaction txid (and height if mined) that consumes the script hash. May not be a complete history.
   */
  history: GetScriptHashHistory[]
}

/**
 * These are fields of 80 byte serialized header in order whose double sha256 hash is a block's hash value
 * and the next block's previousHash value.
 *
 * All block hash values and merkleRoot values are 32 byte hex string values with the byte order reversed from the serialized byte order.
 */
export interface BaseBlockHeader {
  /**
   * Block header version value. Serialized length is 4 bytes.
   */
  version: number
  /**
   * Hash of previous block's block header. Serialized length is 32 bytes.
   */
  previousHash: string
  /**
   * Root hash of the merkle tree of all transactions in this block. Serialized length is 32 bytes.
   */
  merkleRoot: string
  /**
   * Block header time value. Serialized length is 4 bytes.
   */
  time: number
  /**
   * Block header bits value. Serialized length is 4 bytes.
   */
  bits: number
  /**
   * Block header nonce value. Serialized length is 4 bytes.
   */
  nonce: number
}

/**
 * A `BaseBlockHeader` extended with its computed hash and height in its chain.
 */
export interface BlockHeader extends BaseBlockHeader {
  /**
   * Height of the header, starting from zero.
   */
  height: number
  /**
   * The double sha256 hash of the serialized `BaseBlockHeader` fields.
   */
  hash: string
}

export type GetUtxoStatusService = (
  output: string,
  outputFormat?: GetUtxoStatusOutputFormat,
  outpoint?: string
) => Promise<GetUtxoStatusResult>

export type GetStatusForTxidsService = (txids: string[]) => Promise<GetStatusForTxidsResult>

export type GetScriptHashHistoryService = (hash: string) => Promise<GetScriptHashHistoryResult>

export type GetMerklePathService = (txid: string, services: WalletServices) => Promise<GetMerklePathResult>

export type GetRawTxService = (txid: string, chain: Chain) => Promise<GetRawTxResult>

export type PostTxsService = (beef: Beef, txids: string[], services: WalletServices) => Promise<PostTxsResult>

export type PostBeefService = (beef: Beef, txids: string[]) => Promise<PostBeefResult>

export type UpdateFiatExchangeRateService = (
  targetCurrencies: string[],
  options: WalletServicesOptions
) => Promise<FiatExchangeRates>

/**
 * Type for the service call history returned by Services.getServicesCallHistory.
 */
export type ServicesCallHistory = {
  version: number
  getMerklePath: ServiceCallHistory
  getRawTx: ServiceCallHistory
  postBeef: ServiceCallHistory
  getUtxoStatus: ServiceCallHistory
  getStatusForTxids: ServiceCallHistory
  getScriptHashHistory: ServiceCallHistory
  updateFiatExchangeRates: ServiceCallHistory
}

/**
 * Minimum data tracked for each service call.
 */
export interface ServiceCall {
  /**
   * string value must be Date's toISOString format.
   */
  when: Date | string
  msecs: number
  /**
   * true iff service provider successfully processed the request
   * false iff service provider failed to process the request which includes thrown errors.
   */
  success: boolean
  /**
   * Simple text summary of result. e.g. `not a valid utxo` or `valid utxo`
   */
  result?: string
  /**
   * Error code and message iff success is false and a exception was thrown.
   */
  error?: { message: string; code: string }
}

/**
 * Counts of service calls over a time interval.
 */
export interface ServiceCallHistoryCounts {
  /**
   * count of calls returning success true.
   */
  success: number
  /**
   * count of calls returning success false.
   */
  failure: number
  /**
   * of failures (success false), count of calls with valid error code and message.
   */
  error: number
  /**
   * Counts are of calls over interval `since` to `until`.
   * string value must be Date's toISOString format.
   */
  since: Date | string
  /**
   * Counts are of calls over interval `since` to `until`.
   * string value must be Date's toISOString format.
   */
  until: Date | string
}

/**
 * History of service calls for a single service, single provider.
 */
export interface ProviderCallHistory {
  providerName: string
  serviceName: string
  /**
   * Most recent service calls.
   * Array length is limited by Services configuration.
   */
  calls: ServiceCall[]
  /**
   * Counts since creation of Services instance.
   */
  totalCounts: ServiceCallHistoryCounts
  /**
   * Entry [0] is always the current interval being extended by new calls.
   * when `getServiceCallHistory` with `reset` true is called, a new interval with zero counts is added to the start of array.
   * Array length is limited by Services configuration.
   */
  resetCounts: ServiceCallHistoryCounts[]
}

/**
 * History of service calls for a single service, all providers.
 */
export interface ServiceCallHistory {
  serviceName: string
  historyByProvider: Record<string, ProviderCallHistory>
}
