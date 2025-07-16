# SERVICES: BSV Wallet Toolbox API Documentation

The documentation is split into various pages, this page covers the [Services](#class-services) and related API.

To function properly, a wallet makes use of a variety of services provided by the network:

1. Broadcast new transactions.
1. Verify the validity of unspent outputs.
1. Obtain mined transaction proofs.
2. Obtain block headers for proof validation.
3. Obtain exchange rates for UI and fee calculations.

These tasks are the responsibility of the [Services](#class-services) class.

[Return To Top](./README.md)

<!--#region ts2md-api-merged-here-->
### API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

#### Interfaces

| |
| --- |
| [ArcConfig](#interface-arcconfig) |
| [ArcMinerGetTxData](#interface-arcminergettxdata) |
| [BaseBlockHeader](#interface-baseblockheader) |
| [BitailsConfig](#interface-bitailsconfig) |
| [BitailsMerkleProof](#interface-bitailsmerkleproof) |
| [BlockHeader](#interface-blockheader) |
| [ExchangeRatesIoApi](#interface-exchangeratesioapi) |
| [LiveBlockHeader](#interface-liveblockheader) |
| [ServiceCall](#interface-servicecall) |
| [ServiceToCall](#interface-servicetocall) |
| [WocChainInfo](#interface-wocchaininfo) |
| [WocHeader](#interface-wocheader) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Interface: ArcConfig

Configuration options for the ARC broadcaster.

```ts
export interface ArcConfig {
    apiKey?: string;
    httpClient?: HttpClient;
    deploymentId?: string;
    callbackUrl?: string;
    callbackToken?: string;
    headers?: Record<string, string>;
}
```

###### Property apiKey

Authentication token for the ARC API

```ts
apiKey?: string
```

###### Property callbackToken

default access token for notification callback endpoint. It will be used as a Authorization header for the http callback

```ts
callbackToken?: string
```

###### Property callbackUrl

notification callback endpoint for proofs and double spend notification

```ts
callbackUrl?: string
```

###### Property deploymentId

Deployment id used annotating api calls in XDeployment-ID header - this value will be randomly generated if not set

```ts
deploymentId?: string
```

###### Property headers

additional headers to be attached to all tx submissions.

```ts
headers?: Record<string, string>
```

###### Property httpClient

The HTTP client used to make requests to the ARC API.

```ts
httpClient?: HttpClient
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ArcMinerGetTxData

```ts
export interface ArcMinerGetTxData {
    status: number;
    title: string;
    blockHash: string;
    blockHeight: number;
    competingTxs: null | string[];
    extraInfo: string;
    merklePath: string;
    timestamp: string;
    txid: string;
    txStatus: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BaseBlockHeader

These are fields of 80 byte serialized header in order whose double sha256 hash is a block's hash value
and the next block's previousHash value.

All block hash values and merkleRoot values are 32 byte hex string values with the byte order reversed from the serialized byte order.

```ts
export interface BaseBlockHeader {
    version: number;
    previousHash: string;
    merkleRoot: string;
    time: number;
    bits: number;
    nonce: number;
}
```

###### Property bits

Block header bits value. Serialized length is 4 bytes.

```ts
bits: number
```

###### Property merkleRoot

Root hash of the merkle tree of all transactions in this block. Serialized length is 32 bytes.

```ts
merkleRoot: string
```

###### Property nonce

Block header nonce value. Serialized length is 4 bytes.

```ts
nonce: number
```

###### Property previousHash

Hash of previous block's block header. Serialized length is 32 bytes.

```ts
previousHash: string
```

###### Property time

Block header time value. Serialized length is 4 bytes.

```ts
time: number
```

###### Property version

Block header version value. Serialized length is 4 bytes.

```ts
version: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BitailsConfig

```ts
export interface BitailsConfig {
    apiKey?: string;
    httpClient?: HttpClient;
}
```

###### Property apiKey

Authentication token for BitTails API

```ts
apiKey?: string
```

###### Property httpClient

The HTTP client used to make requests to the API.

```ts
httpClient?: HttpClient
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BitailsMerkleProof

```ts
export interface BitailsMerkleProof {
    index: number;
    txOrId: string;
    target: string;
    nodes: string[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BlockHeader

A `BaseBlockHeader` extended with its computed hash and height in its chain.

```ts
export interface BlockHeader extends BaseBlockHeader {
    height: number;
    hash: string;
}
```

See also: [BaseBlockHeader](./services.md#interface-baseblockheader)

###### Property hash

The double sha256 hash of the serialized `BaseBlockHeader` fields.

```ts
hash: string
```

###### Property height

Height of the header, starting from zero.

```ts
height: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ExchangeRatesIoApi

```ts
export interface ExchangeRatesIoApi {
    success: boolean;
    timestamp: number;
    base: "EUR" | "USD";
    date: string;
    rates: Record<string, number>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: LiveBlockHeader

The "live" portion of the block chain is recent history that can conceivably be subject to reorganizations.
The additional fields support tracking orphan blocks, chain forks, and chain reorgs.

```ts
export interface LiveBlockHeader extends BlockHeader {
    chainWork: string;
    isChainTip: boolean;
    isActive: boolean;
    headerId: number;
    previousHeaderId: number | null;
}
```

See also: [BlockHeader](./services.md#interface-blockheader)

###### Property chainWork

The cummulative chainwork achieved by the addition of this block to the chain.
Chainwork only matters in selecting the active chain.

```ts
chainWork: string
```

###### Property headerId

As there may be more than one header with identical height values due to orphan tracking,
headers are assigned a unique headerId while part of the "live" portion of the block chain.

```ts
headerId: number
```

###### Property isActive

True only if this header is currently on the active chain.

```ts
isActive: boolean
```

###### Property isChainTip

True only if this header is currently a chain tip. e.g. There is no header that follows it by previousHash or previousHeaderId.

```ts
isChainTip: boolean
```

###### Property previousHeaderId

Every header in the "live" portion of the block chain is linked to an ancestor header through
both its previousHash and previousHeaderId properties.

Due to forks, there may be multiple headers with identical `previousHash` and `previousHeaderId` values.
Of these, only one (the header on the active chain) will have `isActive` === true.

```ts
previousHeaderId: number | null
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ServiceCall

```ts
export interface ServiceCall {
    when: Date | string;
    msecs: number;
    success: boolean;
    result?: string;
    error?: {
        message: string;
        code: string;
    };
}
```

###### Property error

Error code and message iff success is false and a exception was thrown.

```ts
error?: {
    message: string;
    code: string;
}
```

###### Property result

Simple text summary of result. e.g. `not a valid utxo` or `valid utxo`

```ts
result?: string
```

###### Property success

true iff service provider successfully processed the request
false iff service provider failed to process the request which includes thrown errors.

```ts
success: boolean
```

###### Property when

string value must be Date's toISOString format.

```ts
when: Date | string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ServiceToCall

```ts
export interface ServiceToCall<T> {
    providerName: string;
    serviceName: string;
    service: T;
    call: ServiceCall;
}
```

See also: [ServiceCall](./services.md#interface-servicecall)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WocChainInfo

```ts
export interface WocChainInfo {
    chain: string;
    blocks: number;
    headers: number;
    bestblockhash: string;
    difficulty: number;
    mediantime: number;
    verificationprogress: number;
    pruned: boolean;
    chainwork: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WocHeader

```ts
export interface WocHeader {
    hash: string;
    size: number;
    height: number;
    version: number;
    versionHex: string;
    merkleroot: string;
    time: number;
    mediantime: number;
    nonce: number;
    bits: number | string;
    difficulty: number;
    chainwork: string;
    previousblockhash: string;
    confirmations: number;
    txcount: number;
    nextblockhash: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Classes

| |
| --- |
| [ARC](#class-arc) |
| [Bitails](#class-bitails) |
| [SdkWhatsOnChain](#class-sdkwhatsonchain) |
| [ServiceCollection](#class-servicecollection) |
| [Services](#class-services) |
| [WhatsOnChain](#class-whatsonchain) |
| [WhatsOnChainNoServices](#class-whatsonchainnoservices) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Class: ARC

Represents an ARC transaction broadcaster.

```ts
export class ARC {
    readonly name: string;
    readonly URL: string;
    readonly apiKey: string | undefined;
    readonly deploymentId: string;
    readonly callbackUrl: string | undefined;
    readonly callbackToken: string | undefined;
    readonly headers: Record<string, string> | undefined;
    constructor(URL: string, config?: ArcConfig, name?: string);
    constructor(URL: string, apiKey?: string, name?: string);
    constructor(URL: string, config?: string | ArcConfig, name?: string) 
    async postRawTx(rawTx: HexString, txids?: string[]): Promise<sdk.PostTxResultForTxid> 
    async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
    async getTxData(txid: string): Promise<ArcMinerGetTxData> 
}
```

See also: [ArcConfig](./services.md#interface-arcconfig), [ArcMinerGetTxData](./services.md#interface-arcminergettxdata), [PostBeefResult](./client.md#interface-postbeefresult), [PostTxResultForTxid](./client.md#interface-posttxresultfortxid)

###### Constructor

Constructs an instance of the ARC broadcaster.

```ts
constructor(URL: string, config?: ArcConfig, name?: string)
```
See also: [ArcConfig](./services.md#interface-arcconfig)

Argument Details

+ **URL**
  + The URL endpoint for the ARC API.
+ **config**
  + Configuration options for the ARC broadcaster.

###### Constructor

Constructs an instance of the ARC broadcaster.

```ts
constructor(URL: string, apiKey?: string, name?: string)
```

Argument Details

+ **URL**
  + The URL endpoint for the ARC API.
+ **apiKey**
  + The API key used for authorization with the ARC API.

###### Method getTxData

This seems to only work for recently submitted txids...but that's all we need to complete postBeef!

```ts
async getTxData(txid: string): Promise<ArcMinerGetTxData> 
```
See also: [ArcMinerGetTxData](./services.md#interface-arcminergettxdata)

###### Method postBeef

ARC does not natively support a postBeef end-point aware of multiple txids of interest in the Beef.

It does process multiple new transactions, however, which allows results for all txids of interest
to be collected by the `/v1/tx/${txid}` endpoint.

```ts
async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

###### Method postRawTx

The ARC '/v1/tx' endpoint, as of 2025-02-17 supports all of the following hex string formats:
  1. Single serialized raw transaction.
  2. Single EF serialized raw transaction (untested).
  3. V1 serialized Beef (results returned reflect only the last transaction in the beef)

The ARC '/v1/tx' endpoint, as of 2025-02-17 DOES NOT support the following hex string formats:
  1. V2 serialized Beef

```ts
async postRawTx(rawTx: HexString, txids?: string[]): Promise<sdk.PostTxResultForTxid> 
```
See also: [PostTxResultForTxid](./client.md#interface-posttxresultfortxid)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: Bitails

```ts
export class Bitails {
    readonly chain: sdk.Chain;
    readonly apiKey: string;
    readonly URL: string;
    readonly httpClient: HttpClient;
    constructor(chain: sdk.Chain = "main", config: BitailsConfig = {}) 
    getHttpHeaders(): Record<string, string> 
    async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
    async postRaws(raws: HexString[], txids?: string[]): Promise<sdk.PostBeefResult> 
    async getMerklePath(txid: string, services: sdk.WalletServices): Promise<sdk.GetMerklePathResult> 
}
```

See also: [BitailsConfig](./services.md#interface-bitailsconfig), [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [PostBeefResult](./client.md#interface-postbeefresult), [WalletServices](./client.md#interface-walletservices)

###### Method postBeef

Bitails does not natively support a postBeef end-point aware of multiple txids of interest in the Beef.

Send rawTx in `txids` order from beef.

```ts
async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

###### Method postRaws

```ts
async postRaws(raws: HexString[], txids?: string[]): Promise<sdk.PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

Argument Details

+ **raws**
  + Array of raw transactions to broadcast as hex strings
+ **txids**
  + Array of txids for transactions in raws for which results are requested, remaining raws are supporting only.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: SdkWhatsOnChain

Represents a chain tracker based on What's On Chain .

```ts
export default class SdkWhatsOnChain implements ChainTracker {
    readonly network: string;
    readonly apiKey: string;
    protected readonly URL: string;
    protected readonly httpClient: HttpClient;
    constructor(network: "main" | "test" | "stn" = "main", config: WhatsOnChainConfig = {}) 
    async isValidRootForHeight(root: string, height: number): Promise<boolean> 
    async currentHeight(): Promise<number> 
    protected getHttpHeaders(): Record<string, string> 
}
```

###### Constructor

Constructs an instance of the WhatsOnChain ChainTracker.

```ts
constructor(network: "main" | "test" | "stn" = "main", config: WhatsOnChainConfig = {}) 
```

Argument Details

+ **network**
  + The BSV network to use when calling the WhatsOnChain API.
+ **config**
  + Configuration options for the WhatsOnChain ChainTracker.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ServiceCollection

```ts
export class ServiceCollection<T> {
    services: {
        name: string;
        service: T;
    }[];
    _index: number;
    readonly since: Date;
    _historyByProvider: Record<string, ProviderCallHistory> = {};
    constructor(public serviceName: string, services?: {
        name: string;
        service: T;
    }[]) 
    add(s: {
        name: string;
        service: T;
    }): ServiceCollection<T> 
    remove(name: string): void 
    get name() 
    get service() 
    getServiceToCall(i: number): ServiceToCall<T> 
    get serviceToCall(): ServiceToCall<T> 
    get allServicesToCall(): ServiceToCall<T>[] 
    moveServiceToLast(stc: ServiceToCall<T>) 
    get allServices() 
    get count() 
    get index() 
    reset() 
    next(): number 
    clone(): ServiceCollection<T> 
    _addServiceCall(providerName: string, call: ServiceCall): ProviderCallHistory 
    getDuration(since: Date | string): number 
    addServiceCallSuccess(stc: ServiceToCall<T>, result?: string): void 
    addServiceCallFailure(stc: ServiceToCall<T>, result?: string): void 
    addServiceCallError(stc: ServiceToCall<T>, error: WalletError): void 
    getServiceCallHistory(reset?: boolean): ServiceCallHistory 
}
```

See also: [ProviderCallHistory](./client.md#interface-providercallhistory), [ServiceCall](./services.md#interface-servicecall), [ServiceCallHistory](./client.md#interface-servicecallhistory), [ServiceToCall](./services.md#interface-servicetocall), [WalletError](./client.md#class-walleterror)

###### Property since

Start of currentCounts interval. Initially instance construction time.

```ts
readonly since: Date
```

###### Method getServiceCallHistory

```ts
getServiceCallHistory(reset?: boolean): ServiceCallHistory 
```
See also: [ServiceCallHistory](./client.md#interface-servicecallhistory)

Returns

A copy of current service call history

###### Method moveServiceToLast

Used to de-prioritize a service call by moving it to the end of the list.

```ts
moveServiceToLast(stc: ServiceToCall<T>) 
```
See also: [ServiceToCall](./services.md#interface-servicetocall)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: Services

```ts
export class Services implements sdk.WalletServices {
    static createDefaultOptions(chain: sdk.Chain): sdk.WalletServicesOptions 
    options: sdk.WalletServicesOptions;
    whatsonchain: WhatsOnChain;
    arcTaal: ARC;
    arcGorillaPool?: ARC;
    bitails: Bitails;
    getMerklePathServices: ServiceCollection<sdk.GetMerklePathService>;
    getRawTxServices: ServiceCollection<sdk.GetRawTxService>;
    postBeefServices: ServiceCollection<sdk.PostBeefService>;
    getUtxoStatusServices: ServiceCollection<sdk.GetUtxoStatusService>;
    getStatusForTxidsServices: ServiceCollection<sdk.GetStatusForTxidsService>;
    getScriptHashHistoryServices: ServiceCollection<sdk.GetScriptHashHistoryService>;
    updateFiatExchangeRateServices: ServiceCollection<sdk.UpdateFiatExchangeRateService>;
    chain: sdk.Chain;
    constructor(optionsOrChain: sdk.Chain | sdk.WalletServicesOptions) 
    getServicesCallHistory(reset?: boolean): ServicesCallHistory 
    async getChainTracker(): Promise<ChainTracker> 
    async getBsvExchangeRate(): Promise<number> 
    async getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number> 
    get getProofsCount() 
    get getRawTxsCount() 
    get postBeefServicesCount() 
    get getUtxoStatsCount() 
    async getStatusForTxids(txids: string[], useNext?: boolean): Promise<sdk.GetStatusForTxidsResult> 
    hashOutputScript(script: string): string 
    async isUtxo(output: TableOutput): Promise<boolean> 
    async getUtxoStatus(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat, outpoint?: string, useNext?: boolean): Promise<sdk.GetUtxoStatusResult> 
    async getScriptHashHistory(hash: string, useNext?: boolean): Promise<sdk.GetScriptHashHistoryResult> 
    postBeefMode: "PromiseAll" | "UntilSuccess" = "UntilSuccess";
    async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult[]> 
    async getRawTx(txid: string, useNext?: boolean): Promise<sdk.GetRawTxResult> 
    async invokeChaintracksWithRetry<R>(method: () => Promise<R>): Promise<R> 
    async getHeaderForHeight(height: number): Promise<number[]> 
    async getHeight(): Promise<number> 
    async hashToHeader(hash: string): Promise<sdk.BlockHeader> 
    async getMerklePath(txid: string, useNext?: boolean): Promise<sdk.GetMerklePathResult> 
    targetCurrencies = ["USD", "GBP", "EUR"];
    async updateFiatExchangeRates(rates?: sdk.FiatExchangeRates, updateMsecs?: number): Promise<sdk.FiatExchangeRates> 
    async nLockTimeIsFinal(tx: string | number[] | BsvTransaction | number): Promise<boolean> 
    async getBeefForTxid(txid: string): Promise<Beef> 
}
```

See also: [ARC](./services.md#class-arc), [Bitails](./services.md#class-bitails), [BlockHeader](./services.md#interface-blockheader), [Chain](./client.md#type-chain), [FiatExchangeRates](./client.md#interface-fiatexchangerates), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [GetMerklePathService](./client.md#type-getmerklepathservice), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetRawTxService](./client.md#type-getrawtxservice), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetScriptHashHistoryService](./client.md#type-getscripthashhistoryservice), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetStatusForTxidsService](./client.md#type-getstatusfortxidsservice), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [GetUtxoStatusService](./client.md#type-getutxostatusservice), [PostBeefResult](./client.md#interface-postbeefresult), [PostBeefService](./client.md#type-postbeefservice), [ServiceCollection](./services.md#class-servicecollection), [ServicesCallHistory](./client.md#type-servicescallhistory), [TableOutput](./storage.md#interface-tableoutput), [UpdateFiatExchangeRateService](./client.md#type-updatefiatexchangerateservice), [WalletServices](./client.md#interface-walletservices), [WalletServicesOptions](./client.md#interface-walletservicesoptions), [WhatsOnChain](./services.md#class-whatsonchain), [getBeefForTxid](./services.md#function-getbeeffortxid)

###### Method hashOutputScript

```ts
hashOutputScript(script: string): string 
```

Returns

script hash in 'hashLE' format, which is the default.

Argument Details

+ **script**
  + Output script to be hashed for `getUtxoStatus` default `outputFormat`

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WhatsOnChain

```ts
export class WhatsOnChain extends WhatsOnChainNoServices {
    services: Services;
    constructor(chain: sdk.Chain = "main", config: WhatsOnChainConfig = {}, services?: Services) 
    async getMerklePath(txid: string, services: sdk.WalletServices): Promise<sdk.GetMerklePathResult> 
}
```

See also: [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [Services](./services.md#class-services), [WalletServices](./client.md#interface-walletservices), [WhatsOnChainNoServices](./services.md#class-whatsonchainnoservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WhatsOnChainNoServices

```ts
export class WhatsOnChainNoServices extends SdkWhatsOnChain {
    constructor(chain: sdk.Chain = "main", config: WhatsOnChainConfig = {}) 
    async getStatusForTxids(txids: string[]): Promise<sdk.GetStatusForTxidsResult> 
    async getTxPropagation(txid: string): Promise<number> 
    async getRawTx(txid: string): Promise<string | undefined> 
    async getRawTxResult(txid: string): Promise<sdk.GetRawTxResult> 
    async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
    async postRawTx(rawTx: HexString): Promise<sdk.PostTxResultForTxid> 
    async updateBsvExchangeRate(rate?: sdk.BsvExchangeRate, updateMsecs?: number): Promise<sdk.BsvExchangeRate> 
    async getUtxoStatus(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat, outpoint?: string): Promise<sdk.GetUtxoStatusResult> 
    async getScriptHashConfirmedHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> 
    async getScriptHashUnconfirmedHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> 
    async getScriptHashHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> 
    async getBlockHeaderByHash(hash: string): Promise<BlockHeader | undefined> 
    async getChainInfo(): Promise<WocChainInfo> 
}
```

See also: [BlockHeader](./services.md#interface-blockheader), [BsvExchangeRate](./client.md#interface-bsvexchangerate), [Chain](./client.md#type-chain), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [PostBeefResult](./client.md#interface-postbeefresult), [PostTxResultForTxid](./client.md#interface-posttxresultfortxid), [SdkWhatsOnChain](./services.md#class-sdkwhatsonchain), [WocChainInfo](./services.md#interface-wocchaininfo)

###### Method getBlockHeaderByHash

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

```ts
async getBlockHeaderByHash(hash: string): Promise<BlockHeader | undefined> 
```
See also: [BlockHeader](./services.md#interface-blockheader)

###### Method getRawTx

May return undefined for unmined transactions that are in the mempool.

```ts
async getRawTx(txid: string): Promise<string | undefined> 
```

Returns

raw transaction as hex string or undefined if txid not found in mined block.

###### Method getStatusForTxids

POST
https://api.whatsonchain.com/v1/bsv/main/txs/status
Content-Type: application/json
data: "{\"txids\":[\"6815f8014db74eab8b7f75925c68929597f1d97efa970109d990824c25e5e62b\"]}"

result for a mined txid:
    [{
       "txid":"294cd1ebd5689fdee03509f92c32184c0f52f037d4046af250229b97e0c8f1aa",
       "blockhash":"000000000000000004b5ce6670f2ff27354a1e87d0a01bf61f3307f4ccd358b5",
       "blockheight":612251,
       "blocktime":1575841517,
       "confirmations":278272
     }]

result for a valid recent txid:
    [{"txid":"6815f8014db74eab8b7f75925c68929597f1d97efa970109d990824c25e5e62b"}]

result for an unknown txid:
    [{"txid":"6815f8014db74eab8b7f75925c68929597f1d97efa970109d990824c25e5e62c","error":"unknown"}]

```ts
async getStatusForTxids(txids: string[]): Promise<sdk.GetStatusForTxidsResult> 
```
See also: [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult)

###### Method getTxPropagation

2025-02-16 throwing internal server error 500.

```ts
async getTxPropagation(txid: string): Promise<number> 
```

###### Method postBeef

WhatsOnChain does not natively support a postBeef end-point aware of multiple txids of interest in the Beef.

Send rawTx in `txids` order from beef.

```ts
async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

###### Method postRawTx

```ts
async postRawTx(rawTx: HexString): Promise<sdk.PostTxResultForTxid> 
```
See also: [PostTxResultForTxid](./client.md#interface-posttxresultfortxid)

Returns

txid returned by transaction processor of transaction broadcast

Argument Details

+ **rawTx**
  + raw transaction to broadcast as hex string

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Functions

| | |
| --- | --- |
| [WocHeadersBulkListener](#function-wocheadersbulklistener) | [getWhatsOnChainBlockHeaderByHash](#function-getwhatsonchainblockheaderbyhash) |
| [WocHeadersBulkListener_test](#function-wocheadersbulklistener_test) | [getWhatsOnChainTipHeight](#function-getwhatsonchaintipheight) |
| [WocHeadersLiveListener](#function-wocheaderslivelistener) | [isBaseBlockHeader](#function-isbaseblockheader) |
| [WocHeadersLiveListener_test](#function-wocheaderslivelistener_test) | [isBlockHeader](#function-isblockheader) |
| [arcDefaultUrl](#function-arcdefaulturl) | [isLive](#function-islive) |
| [arcGorillaPoolUrl](#function-arcgorillapoolurl) | [isLiveBlockHeader](#function-isliveblockheader) |
| [convertWocToBlockHeaderHex](#function-convertwoctoblockheaderhex) | [toBinaryBaseBlockHeader](#function-tobinarybaseblockheader) |
| [createDefaultWalletServicesOptions](#function-createdefaultwalletservicesoptions) | [updateChaintracksFiatExchangeRates](#function-updatechaintracksfiatexchangerates) |
| [getBeefForTxid](#function-getbeeffortxid) | [updateExchangeratesapi](#function-updateexchangeratesapi) |
| [getExchangeRatesIo](#function-getexchangeratesio) | [validateScriptHash](#function-validatescripthash) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Function: WocHeadersBulkListener

High speed WebSocket based based old block header listener

```ts
export async function WocHeadersBulkListener(fromHeight: number, toHeight: number, enqueue: (header: BlockHeader) => void, error: (code: number, message: string) => boolean, stop: StopListenerToken, chain: WocChain = "main", idleWait = 5000): Promise<boolean> 
```

See also: [BlockHeader](./services.md#interface-blockheader), [StopListenerToken](./services.md#type-stoplistenertoken), [WocChain](./services.md#type-wocchain)

Returns

true on normal completion, false if should restart if no error received.

Argument Details

+ **enqueue**
  + returns headers received from WebSocket service
+ **error**
  + notifies of abnormal events, return false to close websocket, true to ignore the error.
+ **stop**
  + an object with a stop property which gets set to a method to stop listener
+ **chain**
  + 'test' | 'main'
+ **idleWait**
  + how many milliseconds to timeout between completion checks.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: WocHeadersBulkListener_test

v2
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

```ts
export async function WocHeadersBulkListener_test(): Promise<void> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: WocHeadersLiveListener

High speed WebSocket based based new block header listener

```ts
export async function WocHeadersLiveListener(enqueue: (header: BlockHeader) => void, error: (code: number, message: string) => boolean, stop: StopListenerToken, chain: WocChain = "main", idleWait = 100000): Promise<boolean> 
```

See also: [BlockHeader](./services.md#interface-blockheader), [StopListenerToken](./services.md#type-stoplistenertoken), [WocChain](./services.md#type-wocchain)

Returns

true only if exit caused by `stop`

Argument Details

+ **enqueue**
  + returns headers received from WebSocket service
+ **error**
  + notifies of abnormal events, return false to close websocket, true to ignore the error.
+ **stop**
  + an object with a stop property which gets set to a method to stop listener
+ **chain**
  + 'test' | 'main'
+ **idleWait**
  + without any input, after this many milliseconds, assume dead service and exit.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: WocHeadersLiveListener_test

```ts
export async function WocHeadersLiveListener_test(): Promise<void> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: arcDefaultUrl

```ts
export function arcDefaultUrl(chain: sdk.Chain): string 
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: arcGorillaPoolUrl

```ts
export function arcGorillaPoolUrl(chain: sdk.Chain): string | undefined 
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertWocToBlockHeaderHex

```ts
export function convertWocToBlockHeaderHex(woc: WocHeader): BlockHeader 
```

See also: [BlockHeader](./services.md#interface-blockheader), [WocHeader](./services.md#interface-wocheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultWalletServicesOptions

```ts
export function createDefaultWalletServicesOptions(chain: sdk.Chain, arcCallbackUrl?: string, arcCallbackToken?: string, arcApiKey?: string): sdk.WalletServicesOptions 
```

See also: [Chain](./client.md#type-chain), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getBeefForTxid

```ts
export async function getBeefForTxid(services: Services, txid: string): Promise<Beef> 
```

See also: [Services](./services.md#class-services)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getExchangeRatesIo

```ts
export async function getExchangeRatesIo(key: string): Promise<ExchangeRatesIoApi> 
```

See also: [ExchangeRatesIoApi](./services.md#interface-exchangeratesioapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getWhatsOnChainBlockHeaderByHash

```ts
export async function getWhatsOnChainBlockHeaderByHash(hash: string, chain: WocChain = "main", apiKey?: string): Promise<BlockHeader | undefined> 
```

See also: [BlockHeader](./services.md#interface-blockheader), [WocChain](./services.md#type-wocchain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getWhatsOnChainTipHeight

```ts
export async function getWhatsOnChainTipHeight(chain: WocChain = "main", apiKey?: string): Promise<number> 
```

See also: [WocChain](./services.md#type-wocchain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isBaseBlockHeader

Type guard function.

```ts
export function isBaseBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is BaseBlockHeader {
    return typeof header.previousHash === "string";
}
```

See also: [BaseBlockHeader](./services.md#interface-baseblockheader), [BlockHeader](./services.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isBlockHeader

Type guard function.

```ts
export function isBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
    return "height" in header && typeof header.previousHash === "string";
}
```

See also: [BaseBlockHeader](./services.md#interface-baseblockheader), [BlockHeader](./services.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isLive

Type guard function.

```ts
export function isLive(header: BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
    return (header as LiveBlockHeader).headerId !== undefined;
}
```

See also: [BlockHeader](./services.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isLiveBlockHeader

Type guard function.

```ts
export function isLiveBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
    return "chainwork" in header && typeof header.previousHash === "string";
}
```

See also: [BaseBlockHeader](./services.md#interface-baseblockheader), [BlockHeader](./services.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: toBinaryBaseBlockHeader

Serializes a block header as an 80 byte array.
The exact serialized format is defined in the Bitcoin White Paper
such that computing a double sha256 hash of the array computes
the block hash for the header.

```ts
export function toBinaryBaseBlockHeader(header: sdk.BaseBlockHeader): number[] {
    const writer = new Utils.Writer();
    writer.writeUInt32BE(header.version);
    writer.writeReverse(asArray(header.previousHash));
    writer.writeReverse(asArray(header.merkleRoot));
    writer.writeUInt32BE(header.time);
    writer.writeUInt32BE(header.bits);
    writer.writeUInt32BE(header.nonce);
    const r = writer.toArray();
    return r;
}
```

See also: [BaseBlockHeader](./services.md#interface-baseblockheader), [asArray](./client.md#function-asarray)

Returns

80 byte array

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: updateChaintracksFiatExchangeRates

```ts
export async function updateChaintracksFiatExchangeRates(targetCurrencies: string[], options: sdk.WalletServicesOptions): Promise<sdk.FiatExchangeRates> 
```

See also: [FiatExchangeRates](./client.md#interface-fiatexchangerates), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: updateExchangeratesapi

```ts
export async function updateExchangeratesapi(targetCurrencies: string[], options: sdk.WalletServicesOptions): Promise<sdk.FiatExchangeRates> 
```

See also: [FiatExchangeRates](./client.md#interface-fiatexchangerates), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateScriptHash

```ts
export function validateScriptHash(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat): string 
```

See also: [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Types

| |
| --- |
| [StopListenerToken](#type-stoplistenertoken) |
| [WocChain](#type-wocchain) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Type: StopListenerToken

```ts
export type StopListenerToken = {
    stop: (() => void) | undefined;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: WocChain

```ts
export type WocChain = "main" | "test"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Variables


<!--#endregion ts2md-api-merged-here-->
