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

| | | |
| --- | --- | --- |
| [ArcConfig](#interface-arcconfig) | [ChaintracksClientApi](#interface-chaintracksclientapi) | [ChaintracksStorageNoDbOptions](#interface-chaintracksstoragenodboptions) |
| [ArcMinerGetTxData](#interface-arcminergettxdata) | [ChaintracksFetchApi](#interface-chaintracksfetchapi) | [ChaintracksStorageQueryApi](#interface-chaintracksstoragequeryapi) |
| [BitailsConfig](#interface-bitailsconfig) | [ChaintracksFsApi](#interface-chaintracksfsapi) | [ChaintracksWritableFileApi](#interface-chaintrackswritablefileapi) |
| [BitailsMerkleProof](#interface-bitailsmerkleproof) | [ChaintracksInfoApi](#interface-chaintracksinfoapi) | [ExchangeRatesIoApi](#interface-exchangeratesioapi) |
| [BulkFileDataManagerMergeResult](#interface-bulkfiledatamanagermergeresult) | [ChaintracksManagementApi](#interface-chaintracksmanagementapi) | [GetHeaderByteFileLinksResult](#interface-getheaderbytefilelinksresult) |
| [BulkFileDataManagerOptions](#interface-bulkfiledatamanageroptions) | [ChaintracksOptions](#interface-chaintracksoptions) | [HeightRangeApi](#interface-heightrangeapi) |
| [BulkHeaderFileInfo](#interface-bulkheaderfileinfo) | [ChaintracksPackageInfoApi](#interface-chaintrackspackageinfoapi) | [HeightRanges](#interface-heightranges) |
| [BulkHeaderFilesInfo](#interface-bulkheaderfilesinfo) | [ChaintracksReadableFileApi](#interface-chaintracksreadablefileapi) | [LiveBlockHeader](#interface-liveblockheader) |
| [BulkIngestorApi](#interface-bulkingestorapi) | [ChaintracksServiceClientOptions](#interface-chaintracksserviceclientoptions) | [LiveIngestorApi](#interface-liveingestorapi) |
| [BulkIngestorBaseOptions](#interface-bulkingestorbaseoptions) | [ChaintracksServiceOptions](#interface-chaintracksserviceoptions) | [LiveIngestorBaseOptions](#interface-liveingestorbaseoptions) |
| [BulkIngestorCDNOptions](#interface-bulkingestorcdnoptions) | [ChaintracksStorageApi](#interface-chaintracksstorageapi) | [LiveIngestorWhatsOnChainOptions](#interface-liveingestorwhatsonchainoptions) |
| [BulkIngestorWhatsOnChainOptions](#interface-bulkingestorwhatsonchainoptions) | [ChaintracksStorageBaseOptions](#interface-chaintracksstoragebaseoptions) | [ServiceCall](#interface-servicecall) |
| [BulkStorageApi](#interface-bulkstorageapi) | [ChaintracksStorageBulkFileApi](#interface-chaintracksstoragebulkfileapi) | [ServiceToCall](#interface-servicetocall) |
| [BulkStorageBaseOptions](#interface-bulkstoragebaseoptions) | [ChaintracksStorageIdbOptions](#interface-chaintracksstorageidboptions) | [WhatsOnChainServicesOptions](#interface-whatsonchainservicesoptions) |
| [BulkSyncResult](#interface-bulksyncresult) | [ChaintracksStorageIdbSchema](#interface-chaintracksstorageidbschema) | [WocChainInfo](#interface-wocchaininfo) |
| [ChaintracksApi](#interface-chaintracksapi) | [ChaintracksStorageIngestApi](#interface-chaintracksstorageingestapi) | [WocGetHeaderByteFileLinks](#interface-wocgetheaderbytefilelinks) |
| [ChaintracksAppendableFileApi](#interface-chaintracksappendablefileapi) | [ChaintracksStorageKnexOptions](#interface-chaintracksstorageknexoptions) | [WocGetHeadersHeader](#interface-wocgetheadersheader) |
| [ChaintracksChainTrackerOptions](#interface-chaintrackschaintrackeroptions) | [ChaintracksStorageMemoryOptions](#interface-chaintracksstoragememoryoptions) | [WocHeader](#interface-wocheader) |

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

See also: [blockHash](./services.md#function-blockhash)

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
##### Interface: BulkFileDataManagerMergeResult

```ts
export interface BulkFileDataManagerMergeResult {
    unchanged: BulkHeaderFileInfo[];
    inserted: BulkHeaderFileInfo[];
    updated: BulkHeaderFileInfo[];
    dropped: BulkHeaderFileInfo[];
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkFileDataManagerOptions

```ts
export interface BulkFileDataManagerOptions {
    chain: Chain;
    maxPerFile: number;
    maxRetained?: number;
    fetch?: ChaintracksFetchApi;
    fromKnownSourceUrl?: string;
}
```

See also: [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkHeaderFileInfo

Descriptive information about a single bulk header file.

```ts
export interface BulkHeaderFileInfo {
    fileName: string;
    firstHeight: number;
    count: number;
    prevChainWork: string;
    lastChainWork: string;
    prevHash: string;
    lastHash: string | null;
    fileHash: string | null;
    chain?: Chain;
    data?: Uint8Array;
    validated?: boolean;
    fileId?: number;
    sourceUrl?: string;
}
```

See also: [Chain](./client.md#type-chain)

###### Property chain

Which chain: 'main' or 'test'

```ts
chain?: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property count

count of how many headers the file contains. File size must be 80 * count.

```ts
count: number
```

###### Property fileHash

file contents single sha256 hash as base64 string

```ts
fileHash: string | null
```

###### Property fileId

optional, used for database storage

```ts
fileId?: number
```

###### Property fileName

filename and extension, no path

```ts
fileName: string
```

###### Property firstHeight

chain height of first header in file

```ts
firstHeight: number
```

###### Property lastChainWork

lastChainWork is the cummulative chain work including the last header in this file's data, as a hex string.

```ts
lastChainWork: string
```

###### Property lastHash

block hash of last header in the file in standard hex string block hash encoding

```ts
lastHash: string | null
```

###### Property prevChainWork

prevChainWork is the cummulative chain work up to the first header in this file's data, as a hex string.

```ts
prevChainWork: string
```

###### Property prevHash

previousHash of first header in file in standard hex string block hash encoding

```ts
prevHash: string
```

###### Property sourceUrl

optional, if valid `${sourceUrl}/${fileName}` is the source of this data.

```ts
sourceUrl?: string
```

###### Property validated

true iff these properties should be considered pre-validated, including a valid required fileHash of data (when not undefined).

```ts
validated?: boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkHeaderFilesInfo

Describes a collection of bulk block header files.

```ts
export interface BulkHeaderFilesInfo {
    rootFolder: string;
    jsonFilename: string;
    files: BulkHeaderFileInfo[];
    headersPerFile: number;
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo)

###### Property files

Array of information about each bulk block header file.

```ts
files: BulkHeaderFileInfo[]
```
See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo)

###### Property headersPerFile

Maximum number of headers in a single file in this collection of files.

```ts
headersPerFile: number
```

###### Property jsonFilename

Sub-path to this resource on rootFolder

```ts
jsonFilename: string
```

###### Property rootFolder

Where this file was fetched or read from.

```ts
rootFolder: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkIngestorApi

```ts
export interface BulkIngestorApi {
    shutdown(): Promise<void>;
    getPresentHeight(): Promise<number | undefined>;
    fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]>;
    synchronize(presentHeight: number, before: HeightRanges, priorLiveHeaders: BlockHeader[]): Promise<BulkSyncResult>;
    setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void>;
    storage(): ChaintracksStorageApi;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkSyncResult](./services.md#interface-bulksyncresult), [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges)

###### Method fetchHeaders

A BulkIngestor fetches and updates storage with bulk headers in bulkRange.

If it can, it must also fetch live headers in fetch range that are not in bulkRange and return them as an array.

The storage methods `insertBulkFile`, `updateBulkFile`, and `addBulkHeaders` should be used to add bulk headers to storage.

```ts
fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]>
```
See also: [BlockHeader](./client.md#interface-blockheader), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges)

Returns

new live headers: headers in fetchRange but not in bulkRange

Argument Details

+ **before**
  + bulk and live range of headers before ingesting any new headers.
+ **fetchRange**
  + range of headers still needed, includes both missing bulk and live headers.
+ **bulkRange**
  + range of bulk headers still needed
+ **priorLiveHeaders**
  + any headers accumulated by prior bulk ingestor(s) that are too recent for bulk storage.

###### Method getPresentHeight

If the bulk ingestor is capable, return the approximate
present height of the actual chain being tracked.
Otherwise, return undefined.

May not assume that setStorage has been called.

```ts
getPresentHeight(): Promise<number | undefined>
```

###### Method setStorage

Called before first Synchronize with reference to storage.
Components requiring asynchronous setup can override base class implementation.

```ts
setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void>
```
See also: [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi)

###### Method shutdown

Close and release all resources.

```ts
shutdown(): Promise<void>
```

###### Method synchronize

A BulkIngestor has two potential goals:
1. To source missing bulk headers and include them in bulk storage.
2. To source missing live headers to be forwarded to live storage.

```ts
synchronize(presentHeight: number, before: HeightRanges, priorLiveHeaders: BlockHeader[]): Promise<BulkSyncResult>
```
See also: [BlockHeader](./client.md#interface-blockheader), [BulkSyncResult](./services.md#interface-bulksyncresult), [HeightRanges](./services.md#interface-heightranges)

Returns

updated priorLiveHeaders including any accumulated by this ingestor

Argument Details

+ **presentHeight**
  + current height of the active chain tip, may lag the true value.
+ **before**
  + current bulk and live storage height ranges, either may be empty.
+ **priorLiveHeaders**
  + any headers accumulated by prior bulk ingestor(s) that are too recent for bulk storage.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkIngestorBaseOptions

```ts
export interface BulkIngestorBaseOptions {
    chain: Chain;
    jsonResource: string | undefined;
}
```

See also: [Chain](./client.md#type-chain)

###### Property chain

The target chain: "main" or "test"

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property jsonResource

Required.

The name of the JSON resource to request from CDN which describes currently
available bulk block header resources.

```ts
jsonResource: string | undefined
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkIngestorCDNOptions

```ts
export interface BulkIngestorCDNOptions extends BulkIngestorBaseOptions {
    jsonResource: string | undefined;
    cdnUrl: string | undefined;
    maxPerFile: number | undefined;
    fetch: ChaintracksFetchApi;
}
```

See also: [BulkIngestorBaseOptions](./services.md#interface-bulkingestorbaseoptions), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

###### Property cdnUrl

Required.

URL to CDN implementing the bulk ingestor CDN service protocol

```ts
cdnUrl: string | undefined
```

###### Property jsonResource

Required.

The name of the JSON resource to request from CDN which describes currently
available bulk block header resources.

```ts
jsonResource: string | undefined
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkIngestorWhatsOnChainOptions

```ts
export interface BulkIngestorWhatsOnChainOptions extends BulkIngestorBaseOptions, WhatsOnChainServicesOptions {
    idleWait: number | undefined;
    chain: Chain;
    apiKey?: string;
    timeout: number;
    userAgent: string;
    enableCache: boolean;
    chainInfoMsecs: number;
    fetch?: ChaintracksFetchApi;
}
```

See also: [BulkIngestorBaseOptions](./services.md#interface-bulkingestorbaseoptions), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [WhatsOnChainServicesOptions](./services.md#interface-whatsonchainservicesoptions)

###### Property apiKey

WhatsOnChain.com API Key
https://docs.taal.com/introduction/get-an-api-key
If unknown or empty, maximum request rate is limited.
https://developers.whatsonchain.com/#rate-limits

```ts
apiKey?: string
```

###### Property chain

Which chain is being tracked: main, test, or stn.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property chainInfoMsecs

How long chainInfo is considered still valid before updating (msecs).

```ts
chainInfoMsecs: number
```

###### Property enableCache

Enable WhatsOnChain client cache option.

```ts
enableCache: boolean
```

###### Property idleWait

Maximum msecs of "normal" pause with no new data arriving.

```ts
idleWait: number | undefined
```

###### Property timeout

Request timeout for GETs to https://api.whatsonchain.com/v1/bsv

```ts
timeout: number
```

###### Property userAgent

User-Agent header value for requests to https://api.whatsonchain.com/v1/bsv

```ts
userAgent: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkStorageApi

Handles block header storage and retrieval older than the "live" portion of the chain.
Height is the primary and only indexing field required.
Only stores headers on the active chain; no orphans, no forks, no reorgs.

```ts
export interface BulkStorageApi {
    shutdown(): Promise<void>;
    getMaxHeight(): Promise<number>;
    getHeightRange(): Promise<HeightRange>;
    appendHeaders(minHeight: number, count: number, headers: Uint8Array): Promise<void>;
    findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined>;
    findHeaderForHeight(height: number): Promise<BlockHeader>;
    headersToBuffer(height: number, count: number): Promise<Uint8Array>;
    exportBulkHeaders(rootFolder: string, jsonFilename: string, maxPerFile: number): Promise<void>;
    setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void>;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi), [HeightRange](./services.md#class-heightrange)

###### Method appendHeaders

Append new Block Headers to BulkStorage.
Requires that these headers directly extend existing headers.
maxHeight of existing plus one equals minHeight of `headers`.
hash of last existing equals previousHash of first in `headers`.
Checks that all `headers` are valid (hash, previousHash)

Duplicate headers must be ignored.

```ts
appendHeaders(minHeight: number, count: number, headers: Uint8Array): Promise<void>
```

Argument Details

+ **minHeight**
  + must match height of first header in buffer
+ **count**
  + times 80 must equal headers.length
+ **headers**
  + encoded as packed array of 80 byte serialized block headers

###### Method exportBulkHeaders

Exports current bulk headers, including all ingests, excluding live headers to static header files.

```ts
exportBulkHeaders(rootFolder: string, jsonFilename: string, maxPerFile: number): Promise<void>
```

Argument Details

+ **rootFolder**
  + Where the json and headers files will be written
+ **jsonFilename**
  + The name of the json file.
+ **maxPerFile**
  + The maximum headers per file.

###### Method findHeaderForHeight

Returns block header for a given block height on active chain.
Throws if not found.

```ts
findHeaderForHeight(height: number): Promise<BlockHeader>
```
See also: [BlockHeader](./client.md#interface-blockheader)

Argument Details

+ **hash**
  + block hash

###### Method findHeaderForHeightOrUndefined

Returns block header for a given block height on active chain.

```ts
findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined>
```
See also: [BlockHeader](./client.md#interface-blockheader)

Argument Details

+ **hash**
  + block hash

###### Method getHeightRange

```ts
getHeightRange(): Promise<HeightRange>
```
See also: [HeightRange](./services.md#class-heightrange)

Returns

available bulk block header height range: `(0, getMaxHeight())`

###### Method getMaxHeight

```ts
getMaxHeight(): Promise<number>
```

Returns

the height of the most recent header in bulk storage or -1 if empty.

###### Method headersToBuffer

Adds headers in 80 byte serialized format to a buffer.
Only adds active headers.
returned array length divided by 80 is the actual number returned.

Returns the buffer.

```ts
headersToBuffer(height: number, count: number): Promise<Uint8Array>
```

Argument Details

+ **height**
  + of first header
+ **count**
  + of headers

###### Method setStorage

Called before first Synchronize with reference to storage.
Components requiring asynchronous setup can override base class implementation.

```ts
setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void>
```
See also: [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi)

###### Method shutdown

Close and release all resources.

```ts
shutdown(): Promise<void>
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkStorageBaseOptions

```ts
export interface BulkStorageBaseOptions {
    chain: Chain;
    fs: ChaintracksFsApi;
}
```

See also: [Chain](./client.md#type-chain), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi)

###### Property chain

The target chain: "main" or "test"

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: BulkSyncResult

```ts
export interface BulkSyncResult {
    liveHeaders: BlockHeader[];
    liveRange: HeightRange;
    done: boolean;
    log: string;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [HeightRange](./services.md#class-heightrange)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksApi

Full Chaintracks API including startListening with callbacks

```ts
export interface ChaintracksApi extends ChaintracksClientApi {
    startListening(listening?: () => void): Promise<void>;
}
```

See also: [ChaintracksClientApi](./services.md#interface-chaintracksclientapi)

###### Method startListening

Start or resume listening for new headers.

Calls `synchronize` to catch up on headers that were found while not listening.

Begins listening to any number of configured new header notification services.

Begins sending notifications to subscribed listeners only after processing any
previously found headers.

May be called if already listening or synchronizing to listen.

`listening` callback will be called after listening for new live headers has begun.
Alternatively, the `listening` API function which returns a Promise can be awaited.

```ts
startListening(listening?: () => void): Promise<void>
```

Argument Details

+ **listening**
  + callback indicates when listening for new headers has started.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksAppendableFileApi

Supports access and appending data to new or existing named data storage.
New data is always appended to the end of existing data.

```ts
export interface ChaintracksAppendableFileApi extends ChaintracksReadableFileApi {
    append(data: Uint8Array): Promise<void>;
}
```

See also: [ChaintracksReadableFileApi](./services.md#interface-chaintracksreadablefileapi)

###### Method append

```ts
append(data: Uint8Array): Promise<void>
```

Argument Details

+ **data**
  + data to add to the end of existing data.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksChainTrackerOptions

```ts
export interface ChaintracksChainTrackerOptions {
    maxRetries?: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksClientApi

Chaintracks client API excluding events and callbacks

```ts
export interface ChaintracksClientApi extends ChainTracker {
    getChain(): Promise<Chain>;
    getInfo(): Promise<ChaintracksInfoApi>;
    getPresentHeight(): Promise<number>;
    getHeaders(height: number, count: number): Promise<string>;
    findChainTipHeader(): Promise<BlockHeader>;
    findChainTipHash(): Promise<string>;
    findHeaderForHeight(height: number): Promise<BlockHeader | undefined>;
    findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined>;
    addHeader(header: BaseBlockHeader): Promise<void>;
    startListening(): Promise<void>;
    listening(): Promise<void>;
    isListening(): Promise<boolean>;
    isSynchronized(): Promise<boolean>;
    subscribeHeaders(listener: HeaderListener): Promise<string>;
    subscribeReorgs(listener: ReorgListener): Promise<string>;
    unsubscribe(subscriptionId: string): Promise<boolean>;
    isValidRootForHeight(root: string, height: number): Promise<boolean>;
    currentHeight: () => Promise<number>;
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [ChaintracksInfoApi](./services.md#interface-chaintracksinfoapi), [HeaderListener](./services.md#type-headerlistener), [ReorgListener](./services.md#type-reorglistener)

###### Method addHeader

Submit a possibly new header for adding

If the header is invalid or a duplicate it will not be added.

This header will be ignored if the previous header has not already been inserted when this header
is considered for insertion.

```ts
addHeader(header: BaseBlockHeader): Promise<void>
```
See also: [BaseBlockHeader](./client.md#interface-baseblockheader)

Returns

immediately

###### Method findChainTipHash

Returns the block hash of the active chain tip.

```ts
findChainTipHash(): Promise<string>
```

###### Method findChainTipHeader

Returns the active chain tip header

```ts
findChainTipHeader(): Promise<BlockHeader>
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method findHeaderForBlockHash

Returns block header for a given recent block hash or undefined.

```ts
findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined>
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method findHeaderForHeight

Returns block header for a given block height on active chain.

```ts
findHeaderForHeight(height: number): Promise<BlockHeader | undefined>
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method getChain

Confirms the chain

```ts
getChain(): Promise<Chain>
```
See also: [Chain](./client.md#type-chain)

###### Method getHeaders

Adds headers in 80 byte serialized format to an array.
Only adds active headers.
array length divided by 80 is the actual number returned.

```ts
getHeaders(height: number, count: number): Promise<string>
```

Returns

array of headers as serialized hex string

Argument Details

+ **height**
  + of first header
+ **count**
  + of headers, maximum

###### Method getInfo

```ts
getInfo(): Promise<ChaintracksInfoApi>
```
See also: [ChaintracksInfoApi](./services.md#interface-chaintracksinfoapi)

Returns

Summary of configuration and state.

###### Method getPresentHeight

Return the latest chain height from configured bulk ingestors.

```ts
getPresentHeight(): Promise<number>
```

###### Method isListening

Returns true if actively listening for new headers and client api is enabled.

```ts
isListening(): Promise<boolean>
```

###### Method isSynchronized

Returns true if `synchronize` has completed at least once.

```ts
isSynchronized(): Promise<boolean>
```

###### Method listening

Returns a Promise that will resolve when the previous call to startListening
enters the listening-for-new-headers state.

```ts
listening(): Promise<void>
```

###### Method startListening

Start or resume listening for new headers.

Calls `synchronize` to catch up on headers that were found while not listening.

Begins listening to any number of configured new header notification services.

Begins sending notifications to subscribed listeners only after processing any
previously found headers.

May be called if already listening or synchronizing to listen.

The `listening` API function which returns a Promise can be awaited.

```ts
startListening(): Promise<void>
```

###### Method subscribeHeaders

Subscribe to "header" events.

```ts
subscribeHeaders(listener: HeaderListener): Promise<string>
```
See also: [HeaderListener](./services.md#type-headerlistener)

Returns

identifier for this subscription

Throws

ERR_NOT_IMPLEMENTED if callback events are not supported

###### Method subscribeReorgs

Subscribe to "reorganization" events.

```ts
subscribeReorgs(listener: ReorgListener): Promise<string>
```
See also: [ReorgListener](./services.md#type-reorglistener)

Returns

identifier for this subscription

Throws

ERR_NOT_IMPLEMENTED if callback events are not supported

###### Method unsubscribe

Cancels all subscriptions with the given `subscriptionId` which was previously returned
by a `subscribe` method.

```ts
unsubscribe(subscriptionId: string): Promise<boolean>
```

Returns

true if a subscription was canceled

Argument Details

+ **subscriptionId**
  + value previously returned by subscribeToHeaders or subscribeToReorgs

Throws

ERR_NOT_IMPLEMENTED if callback events are not supported

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksFetchApi

Provides a simplified interface based on the

```ts
export interface ChaintracksFetchApi {
    httpClient: HttpClient;
    download(url: string): Promise<Uint8Array>;
    fetchJson<R>(url: string): Promise<R>;
    pathJoin(baseUrl: string, subpath: string): string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksFsApi

Supports file-like access to named data storage.

Only minimal functionality required by Chaintracks is supported.

```ts
export interface ChaintracksFsApi {
    delete(path: string): Promise<void>;
    writeFile(path: string, data: Uint8Array): Promise<void>;
    readFile(path: string): Promise<Uint8Array>;
    openReadableFile(path: string): Promise<ChaintracksReadableFileApi>;
    openWritableFile(path: string): Promise<ChaintracksWritableFileApi>;
    openAppendableFile(path: string): Promise<ChaintracksAppendableFileApi>;
    pathJoin(...parts: string[]): string;
}
```

See also: [ChaintracksAppendableFileApi](./services.md#interface-chaintracksappendablefileapi), [ChaintracksReadableFileApi](./services.md#interface-chaintracksreadablefileapi), [ChaintracksWritableFileApi](./services.md#interface-chaintrackswritablefileapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksInfoApi

```ts
export interface ChaintracksInfoApi {
    chain: Chain;
    heightBulk: number;
    heightLive: number;
    storage: string;
    bulkIngestors: string[];
    liveIngestors: string[];
    packages: ChaintracksPackageInfoApi[];
}
```

See also: [Chain](./client.md#type-chain), [ChaintracksPackageInfoApi](./services.md#interface-chaintrackspackageinfoapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksManagementApi

```ts
export interface ChaintracksManagementApi extends ChaintracksApi {
    destroy(): Promise<void>;
    validate(): Promise<boolean>;
    exportBulkHeaders(toFolder: string, toFs: ChaintracksFsApi, sourceUrl?: string, toHeadersPerFile?: number, maxHeight?: number): Promise<void>;
}
```

See also: [ChaintracksApi](./services.md#interface-chaintracksapi), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi)

###### Method destroy

close and release all resources

```ts
destroy(): Promise<void>
```

###### Method exportBulkHeaders

Exports current bulk headers, including all ingests, excluding live headers to static header files.

Useful for bulk ingestors such as those derived from BulkIngestorCDN.

```ts
exportBulkHeaders(toFolder: string, toFs: ChaintracksFsApi, sourceUrl?: string, toHeadersPerFile?: number, maxHeight?: number): Promise<void>
```
See also: [ChaintracksFsApi](./services.md#interface-chaintracksfsapi)

Argument Details

+ **toFolder**
  + Where the json and headers files will be written
+ **toFs**
  + The ChaintracksFsApi to use for writing files. If not provided, the default file system will be used.
+ **sourceUrl**
  + Optional source URL to include in the exported files. Set if exported files will be transferred to a CDN.
+ **toHeadersPerFile**
  + The maximum headers per file. Default is 100,000 (8MB)
+ **maxHeight**
  + The maximum height to export. Default is the current bulk storage max height.

###### Method validate

Verifies that all headers from the tip back to genesis can be retrieved, in order,
by height, and that they obey previousHash constraint.

Additional validations may be addeded.

This is a slow operation.

```ts
validate(): Promise<boolean>
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksOptions

```ts
export interface ChaintracksOptions {
    chain: Chain;
    storage?: ChaintracksStorageApi;
    bulkIngestors: BulkIngestorApi[];
    liveIngestors: LiveIngestorApi[];
    addLiveRecursionLimit: number;
    logging?: (...args: any[]) => void;
    readonly: boolean;
}
```

See also: [BulkIngestorApi](./services.md#interface-bulkingestorapi), [Chain](./client.md#type-chain), [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi), [LiveIngestorApi](./services.md#interface-liveingestorapi)

###### Property addLiveRecursionLimit

Maximum number of missing headers to pursue when listening for new headers.
Normally, large numbers of missing headers are handled by bulk ingestors.

```ts
addLiveRecursionLimit: number
```

###### Property logging

Optional logging method

```ts
logging?: (...args: any[]) => void
```

###### Property readonly

If true, this chaintracks instance will only service read requests for existing data.
Shared storage only requires one readonly false instance to manage and update storage.

```ts
readonly: boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksPackageInfoApi

```ts
export interface ChaintracksPackageInfoApi {
    name: string;
    version: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksReadableFileApi

Supports access to named data storage (file like).

```ts
export interface ChaintracksReadableFileApi {
    path: string;
    close(): Promise<void>;
    getLength(): Promise<number>;
    read(length?: number, offset?: number): Promise<Uint8Array>;
}
```

###### Method getLength

Returns the length of the data storage in bytes.

```ts
getLength(): Promise<number>
```

###### Method read

```ts
read(length?: number, offset?: number): Promise<Uint8Array>
```

Argument Details

+ **length**
  + requested length to be returned, may return less than requested.
+ **offset**
  + starting offset in the existing data storage to read from, defaults to 0.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksServiceClientOptions

```ts
export interface ChaintracksServiceClientOptions {
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksServiceOptions

```ts
export interface ChaintracksServiceOptions {
    chain: Chain;
    routingPrefix: string;
    chaintracks?: Chaintracks;
    services?: Services;
    port?: number;
}
```

See also: [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [Services](./services.md#class-services)

###### Property chaintracks

Defaults to default configured Chaintracks instance with NoDb storage.

```ts
chaintracks?: Chaintracks
```
See also: [Chaintracks](./services.md#class-chaintracks)

###### Property routingPrefix

prepended to the path of each registered service endpoint

```ts
routingPrefix: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageApi

```ts
export interface ChaintracksStorageApi extends ChaintracksStorageQueryApi, ChaintracksStorageIngestApi {
    log: (...args: any[]) => void;
    bulkManager: BulkFileDataManager;
    destroy(): Promise<void>;
}
```

See also: [BulkFileDataManager](./services.md#class-bulkfiledatamanager), [ChaintracksStorageIngestApi](./services.md#interface-chaintracksstorageingestapi), [ChaintracksStorageQueryApi](./services.md#interface-chaintracksstoragequeryapi)

###### Method destroy

Close and release all resources.

```ts
destroy(): Promise<void>
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageBaseOptions

```ts
export interface ChaintracksStorageBaseOptions {
    chain: Chain;
    liveHeightThreshold: number;
    reorgHeightThreshold: number;
    bulkMigrationChunkSize: number;
    batchInsertLimit: number;
    bulkFileDataManager: BulkFileDataManager | undefined;
}
```

See also: [BulkFileDataManager](./services.md#class-bulkfiledatamanager), [Chain](./client.md#type-chain)

###### Property batchInsertLimit

Maximum number of headers per call to batchInsert

```ts
batchInsertLimit: number
```

###### Property bulkFileDataManager

Controls in memory caching and retrieval of missing bulk header data.

```ts
bulkFileDataManager: BulkFileDataManager | undefined
```
See also: [BulkFileDataManager](./services.md#class-bulkfiledatamanager)

###### Property bulkMigrationChunkSize

How many excess "live" headers to accumulate before migrating them as a chunk to the
bulk header storage.

```ts
bulkMigrationChunkSize: number
```

###### Property chain

Which chain is being tracked: main, test, or stn.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property liveHeightThreshold

How much of recent history is required to be kept in "live" block header storage.

Headers with height less than active chain tip height minus `liveHeightThreshold`
are not required to be kept in "live" storage and may be migrated to "bulk" storage.

As no forks, orphans, or reorgs can affect "bulk" block header storage, an
aggressively high number is recommended: At least an order of magnitude more than
the deepest actual reorg you can imagine.

```ts
liveHeightThreshold: number
```

###### Property reorgHeightThreshold

How much of recent history must be processed with full validation and reorg support.

Must be less than or equal to `liveHeightThreshold`.

Headers with height older than active chain tip height minus `reorgHeightThreshold`
may use batch processing when ingesting headers.

```ts
reorgHeightThreshold: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageBulkFileApi

```ts
export interface ChaintracksStorageBulkFileApi {
    insertBulkFile(file: BulkHeaderFileInfo): Promise<number>;
    updateBulkFile(fileId: number, file: BulkHeaderFileInfo): Promise<number>;
    deleteBulkFile(fileId: number): Promise<number>;
    getBulkFiles(): Promise<BulkHeaderFileInfo[]>;
    getBulkFileData(fileId: number, offset?: number, length?: number): Promise<Uint8Array | undefined>;
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageIdbOptions

```ts
export interface ChaintracksStorageIdbOptions extends ChaintracksStorageBaseOptions {
}
```

See also: [ChaintracksStorageBaseOptions](./services.md#interface-chaintracksstoragebaseoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageIdbSchema

```ts
export interface ChaintracksStorageIdbSchema {
    liveHeaders: {
        key: number;
        value: LiveBlockHeader;
        indexes: {
            hash: string;
            previousHash: string;
            previousHeaderId: number | null;
            isActive: boolean;
            activeTip: [
                boolean,
                boolean
            ];
            height: number;
        };
    };
    bulkHeaders: {
        key: number;
        value: BulkHeaderFileInfo;
        indexes: {
            firstHeight: number;
        };
    };
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageIngestApi

```ts
export interface ChaintracksStorageIngestApi {
    log: (...args: any[]) => void;
    insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult>;
    pruneLiveBlockHeaders(activeTipHeight: number): Promise<void>;
    migrateLiveToBulk(count: number): Promise<void>;
    deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number>;
    makeAvailable(): Promise<void>;
    migrateLatest(): Promise<void>;
    dropAllData(): Promise<void>;
    destroy(): Promise<void>;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [InsertHeaderResult](./services.md#type-insertheaderresult), [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method deleteOlderLiveBlockHeaders

Delete live headers with height less or equal to `maxHeight`
after they have been migrated to bulk storage.

```ts
deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number>
```

Argument Details

+ **maxHeight**
  + delete all records with less or equal `height`

###### Method destroy

Release all resources. Makes the instance unusable.

```ts
destroy(): Promise<void>
```

###### Method insertHeader

Attempts to insert a block header into the chain.

Returns 'added' false and 'dupe' true if header's hash already exists in the live database
Returns 'added' false and 'dupe' false if header's previousHash wasn't found in the live database, or height doesn't increment previous' height.

Computes the header's chainWork from its bits and the previous header's chainWork.

Returns 'added' true if the header was added to the live database.
Returns 'isActiveTip' true if header's chainWork is greater than current active chain tip's chainWork.

If the addition of this header caused a reorg (did not directly extend old active chain tip):
Returns 'reorgDepth' the minimum height difference of the common ancestor to the two chain tips.
Returns 'priorTip' the old active chain tip.
If not a reorg:
Returns 'reorgDepth' of zero.
Returns 'priorTip' the active chain tip before this insert. May be unchanged.

Implementation must call `pruneLiveBlockHeaders` after adding new header.

```ts
insertHeader(header: BlockHeader, prev?: LiveBlockHeader): Promise<InsertHeaderResult>
```
See also: [BlockHeader](./client.md#interface-blockheader), [InsertHeaderResult](./services.md#type-insertheaderresult), [LiveBlockHeader](./services.md#interface-liveblockheader)

Argument Details

+ **header**
  + to insert
+ **prev**
  + if not undefined, the last bulk storage header with total bulk chainWork

###### Method makeAvailable

Async initialization method.

May be called prior to other async methods to control when initialization occurs.

```ts
makeAvailable(): Promise<void>
```

###### Method migrateLatest

Migrate storage schema to latest schema changes.

Typically invoked automatically by `makeAvailable`.

```ts
migrateLatest(): Promise<void>
```

###### Method migrateLiveToBulk

Migrates the oldest `count` LiveBlockHeaders to BulkStorage.
BulkStorage must be configured.
`count` must not exceed `bulkMigrationChunkSize`.
`count` must leave at least `liveHeightThreshold` LiveBlockHeaders.

```ts
migrateLiveToBulk(count: number): Promise<void>
```

Argument Details

+ **count**
  + Steps:
- Copy count oldest active LiveBlockHeaders from live database to buffer.
- Append the buffer of headers to BulkStorage
- Add the buffer's BlockHash, Height pairs to corresponding index table.
- Add the buffer's MerkleRoot, Height pairs to corresponding index table.
- Delete the records from the live database.

###### Method pruneLiveBlockHeaders

Must be called after the addition of new LiveBlockHeaders.

Checks the `StorageEngine` configuration options to see
if BulkStorage is configured and if there is at least one
`bulkMigrationChunkSize` woth of headers in excess of
`liveHeightThreshold` available.

If yes, then calls `migrateLiveToBulk` one or more times.

```ts
pruneLiveBlockHeaders(activeTipHeight: number): Promise<void>
```

Argument Details

+ **activeTipHeight**
  + height of active tip after adds

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageKnexOptions

```ts
export interface ChaintracksStorageKnexOptions extends ChaintracksStorageBaseOptions {
    knex: Knex | undefined;
}
```

See also: [ChaintracksStorageBaseOptions](./services.md#interface-chaintracksstoragebaseoptions)

###### Property knex

Required.

Knex.js database interface initialized with valid connection configuration.

```ts
knex: Knex | undefined
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageMemoryOptions

```ts
export interface ChaintracksStorageMemoryOptions extends ChaintracksStorageKnexOptions {
    sqliteClient: "sqlite3" | "better-sqlite3" | undefined;
}
```

See also: [ChaintracksStorageKnexOptions](./services.md#interface-chaintracksstorageknexoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageNoDbOptions

```ts
export interface ChaintracksStorageNoDbOptions extends ChaintracksStorageBaseOptions {
}
```

See also: [ChaintracksStorageBaseOptions](./services.md#interface-chaintracksstoragebaseoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksStorageQueryApi

```ts
export interface ChaintracksStorageQueryApi {
    log: (...args: any[]) => void;
    findChainTipHeader(): Promise<LiveBlockHeader>;
    findChainTipHash(): Promise<string>;
    findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined>;
    findChainTipWork(): Promise<string>;
    findHeaderForHeight(height: number): Promise<LiveBlockHeader | BlockHeader>;
    findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined>;
    findCommonAncestor(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<LiveBlockHeader>;
    findReorgDepth(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<number>;
    isMerkleRootActive(merkleRoot: string): Promise<boolean>;
    getHeadersUint8Array(height: number, count: number): Promise<Uint8Array>;
    getHeaders(height: number, count: number): Promise<BaseBlockHeader[]>;
    getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]>;
    getBulkHeaders(range: HeightRange): Promise<Uint8Array>;
    findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null>;
    findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader>;
    findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null>;
    findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null>;
    getAvailableHeightRanges(): Promise<{
        bulk: HeightRange;
        live: HeightRange;
    }>;
    findLiveHeightRange(): Promise<HeightRange>;
    findMaxHeaderId(): Promise<number>;
    chain: Chain;
    liveHeightThreshold: number;
    reorgHeightThreshold: number;
    bulkMigrationChunkSize: number;
    batchInsertLimit: number;
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [HeightRange](./services.md#class-heightrange), [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Property batchInsertLimit

Maximum number of headers per call to batchInsert

```ts
batchInsertLimit: number
```

###### Property bulkMigrationChunkSize

How many excess "live" headers to accumulate before migrating them as a chunk to the
bulk header storage.

```ts
bulkMigrationChunkSize: number
```

###### Property chain

Which chain is being tracked: "main" or "test".

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property liveHeightThreshold

How much of recent history is required to be kept in "live" block header storage.

Headers with height older than active chain tip height minus `liveHeightThreshold`
are not required to be kept in "live" storage and may be migrated to "bulk" storage.

```ts
liveHeightThreshold: number
```

###### Property reorgHeightThreshold

How much of recent history must be processed with full validation and reorg support.

May be less than `liveHeightThreshold`.

Headers with height older than active chain tip height minus ``
may use batch processing when ingesting headers.

```ts
reorgHeightThreshold: number
```

###### Method findChainTipHash

Returns the block hash of the active chain tip.

```ts
findChainTipHash(): Promise<string>
```

###### Method findChainTipHeader

Returns the active chain tip header
Throws an error if there is no tip.

```ts
findChainTipHeader(): Promise<LiveBlockHeader>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method findChainTipHeaderOrUndefined

Returns the active chain tip header or undefined if there is no tip.

```ts
findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method findChainTipWork

Returns the chainWork value of the active chain tip

```ts
findChainTipWork(): Promise<string>
```

###### Method findCommonAncestor

Given two chain tip headers in a chain reorg scenario,
return their common ancestor header.

```ts
findCommonAncestor(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<LiveBlockHeader>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

Argument Details

+ **header1**
  + First header in live part of the chain.
+ **header2**
  + Second header in live part of the chain.

###### Method findHeaderForHeight

Returns block header for a given block height on active chain.

```ts
findHeaderForHeight(height: number): Promise<LiveBlockHeader | BlockHeader>
```
See also: [BlockHeader](./client.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Argument Details

+ **hash**
  + block hash

###### Method findHeaderForHeightOrUndefined

Returns block header for a given block height on active chain.

```ts
findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined>
```
See also: [BlockHeader](./client.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Argument Details

+ **hash**
  + block hash

###### Method findLiveHeaderForBlockHash

Returns block header for a given block hash.
Only from the "live" portion of the chain.
Returns null if not found.

```ts
findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

Argument Details

+ **hash**
  + block hash

###### Method findLiveHeaderForHeaderId

Returns block header for a given headerId.

Only from the "live" portion of the chain.

```ts
findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method findLiveHeaderForHeight

Returns block header for a given block height on active chain.

```ts
findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

Argument Details

+ **hash**
  + block hash

###### Method findLiveHeaderForMerkleRoot

Returns block header for a given merkleRoot.
Only from the "live" portion of the chain.

```ts
findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method findLiveHeightRange

```ts
findLiveHeightRange(): Promise<HeightRange>
```
See also: [HeightRange](./services.md#class-heightrange)

Returns

The current minimum and maximum height active LiveBlockHeaders in the "live" database.

###### Method findMaxHeaderId

```ts
findMaxHeaderId(): Promise<number>
```

Returns

The maximum headerId value used by existing records or -1 if there are none.

###### Method findReorgDepth

This is an original API. Proposed deprecation in favor of `findCommonAncestor`
Given two headers that are both chain tips in a reorg scenario, returns
the depth of the reorg (the greater of the heights of the two provided
headers, minus the height of their last common ancestor)

```ts
findReorgDepth(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<number>
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method getAvailableHeightRanges

Returns the height range of both bulk and live storage.
Verifies that the ranges meet these requirements:
- Both may be empty.
- If bulk is empty, live must be empty or start with height zero.
- If bulk is not empty it must start with height zero.
- If bulk is not empty and live is not empty, live must start with the height after bulk.

```ts
getAvailableHeightRanges(): Promise<{
    bulk: HeightRange;
    live: HeightRange;
}>
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method getBulkHeaders

Returns serialized bulk headers in the given range.

```ts
getBulkHeaders(range: HeightRange): Promise<Uint8Array>
```
See also: [HeightRange](./services.md#class-heightrange)

Returns

serialized headers as a Uint8Array.

###### Method getHeaders

Returns an array of deserialized headers.
Only adds bulk and active live headers.

```ts
getHeaders(height: number, count: number): Promise<BaseBlockHeader[]>
```
See also: [BaseBlockHeader](./client.md#interface-baseblockheader)

Returns

array of deserialized headers

Argument Details

+ **height**
  + is the minimum header height to return, must be >= zero.
+ **count**
  + height + count - 1 is the maximum header height to return.

###### Method getHeadersUint8Array

Returns serialized headers as a Uint8Array.
Only adds bulk and active live headers.

```ts
getHeadersUint8Array(height: number, count: number): Promise<Uint8Array>
```

Returns

serialized headers as a Uint8Array.

Argument Details

+ **height**
  + is the minimum header height to return, must be >= zero.
+ **count**
  + height + count - 1 is the maximum header height to return.

###### Method getLiveHeaders

Returns active `LiveBlockHeaders` with height in the given range.

```ts
getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]>
```
See also: [HeightRange](./services.md#class-heightrange), [LiveBlockHeader](./services.md#interface-liveblockheader)

Returns

array of active `LiveBlockHeaders`

###### Method isMerkleRootActive

Returns true if the given merkleRoot is found in a block header on the active chain.

```ts
isMerkleRootActive(merkleRoot: string): Promise<boolean>
```

Argument Details

+ **merkleRoot**
  + of block header

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ChaintracksWritableFileApi

Supports creation or re-creation of named data storage from position 0.
Any pre-existing data is initially removed.
Does not support reading existing data.

```ts
export interface ChaintracksWritableFileApi {
    path: string;
    close(): Promise<void>;
    append(data: Uint8Array): Promise<void>;
}
```

###### Method append

```ts
append(data: Uint8Array): Promise<void>
```

Argument Details

+ **data**
  + data to add to the end of existing data.

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
##### Interface: GetHeaderByteFileLinksResult

```ts
export interface GetHeaderByteFileLinksResult {
    sourceUrl: string;
    fileName: string;
    range: HeightRange;
    data: Uint8Array | undefined;
}
```

See also: [HeightRange](./services.md#class-heightrange)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: HeightRangeApi

```ts
export interface HeightRangeApi {
    minHeight: number;
    maxHeight: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: HeightRanges

```ts
export interface HeightRanges {
    bulk: HeightRange;
    live: HeightRange;
}
```

See also: [HeightRange](./services.md#class-heightrange)

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

See also: [BlockHeader](./client.md#interface-blockheader)

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
##### Interface: LiveIngestorApi

```ts
export interface LiveIngestorApi {
    shutdown(): Promise<void>;
    getHeaderByHash(hash: string): Promise<BlockHeader | undefined>;
    setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void>;
    storage(): ChaintracksStorageApi;
    startListening(liveHeaders: BlockHeader[]): Promise<void>;
    stopListening(): void;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi)

###### Method setStorage

Called before first Synchronize with reference to storage.
Components requiring asynchronous setup can override base class implementation.

```ts
setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void>
```
See also: [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi)

###### Method shutdown

Close and release all resources.

```ts
shutdown(): Promise<void>
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: LiveIngestorBaseOptions

```ts
export interface LiveIngestorBaseOptions {
    chain: Chain;
}
```

See also: [Chain](./client.md#type-chain)

###### Property chain

The target chain: "main" or "test"

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: LiveIngestorWhatsOnChainOptions

```ts
export interface LiveIngestorWhatsOnChainOptions extends LiveIngestorBaseOptions, WhatsOnChainServicesOptions {
    idleWait: number | undefined;
    chain: Chain;
    apiKey?: string;
    timeout: number;
    userAgent: string;
    enableCache: boolean;
    chainInfoMsecs: number;
}
```

See also: [Chain](./client.md#type-chain), [LiveIngestorBaseOptions](./services.md#interface-liveingestorbaseoptions), [WhatsOnChainServicesOptions](./services.md#interface-whatsonchainservicesoptions)

###### Property apiKey

WhatsOnChain.com API Key
https://docs.taal.com/introduction/get-an-api-key
If unknown or empty, maximum request rate is limited.
https://developers.whatsonchain.com/#rate-limits

```ts
apiKey?: string
```

###### Property chain

Which chain is being tracked: main, test, or stn.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property chainInfoMsecs

How long chainInfo is considered still valid before updating (msecs).

```ts
chainInfoMsecs: number
```

###### Property enableCache

Enable WhatsOnChain client cache option.

```ts
enableCache: boolean
```

###### Property idleWait

Maximum msces of "normal" time with no ping received from connected WoC service.

```ts
idleWait: number | undefined
```

###### Property timeout

Request timeout for GETs to https://api.whatsonchain.com/v1/bsv

```ts
timeout: number
```

###### Property userAgent

User-Agent header value for requests to https://api.whatsonchain.com/v1/bsv

```ts
userAgent: string
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
##### Interface: WhatsOnChainServicesOptions

```ts
export interface WhatsOnChainServicesOptions {
    chain: Chain;
    apiKey?: string;
    timeout: number;
    userAgent: string;
    enableCache: boolean;
    chainInfoMsecs: number;
}
```

See also: [Chain](./client.md#type-chain)

###### Property apiKey

WhatsOnChain.com API Key
https://docs.taal.com/introduction/get-an-api-key
If unknown or empty, maximum request rate is limited.
https://developers.whatsonchain.com/#rate-limits

```ts
apiKey?: string
```

###### Property chain

Which chain is being tracked: main, test, or stn.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property chainInfoMsecs

How long chainInfo is considered still valid before updating (msecs).

```ts
chainInfoMsecs: number
```

###### Property enableCache

Enable WhatsOnChain client cache option.

```ts
enableCache: boolean
```

###### Property timeout

Request timeout for GETs to https://api.whatsonchain.com/v1/bsv

```ts
timeout: number
```

###### Property userAgent

User-Agent header value for requests to https://api.whatsonchain.com/v1/bsv

```ts
userAgent: string
```

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
##### Interface: WocGetHeaderByteFileLinks

```ts
export interface WocGetHeaderByteFileLinks {
    files: string[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WocGetHeadersHeader

```ts
export interface WocGetHeadersHeader {
    hash: string;
    confirmations: number;
    size: number;
    height: number;
    version: number;
    versionHex: string;
    merkleroot: string;
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty: number;
    chainwork: string;
    previousblockhash: string;
    nextblockhash: string;
    nTx: number;
    num_tx: number;
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

| | | |
| --- | --- | --- |
| [ARC](#class-arc) | [BulkIngestorWhatsOnChainCdn](#class-bulkingestorwhatsonchaincdn) | [ChaintracksStorageNoDb](#class-chaintracksstoragenodb) |
| [BHServiceClient](#class-bhserviceclient) | [BulkIngestorWhatsOnChainWs](#class-bulkingestorwhatsonchainws) | [ChaintracksWritableFile](#class-chaintrackswritablefile) |
| [Bitails](#class-bitails) | [BulkStorageBase](#class-bulkstoragebase) | [HeightRange](#class-heightrange) |
| [BulkFileDataManager](#class-bulkfiledatamanager) | [Chaintracks](#class-chaintracks) | [LiveIngestorBase](#class-liveingestorbase) |
| [BulkFileDataReader](#class-bulkfiledatareader) | [ChaintracksAppendableFile](#class-chaintracksappendablefile) | [LiveIngestorWhatsOnChainPoll](#class-liveingestorwhatsonchainpoll) |
| [BulkFilesReader](#class-bulkfilesreader) | [ChaintracksChainTracker](#class-chaintrackschaintracker) | [LiveIngestorWhatsOnChainWs](#class-liveingestorwhatsonchainws) |
| [BulkFilesReaderFs](#class-bulkfilesreaderfs) | [ChaintracksFetch](#class-chaintracksfetch) | [SdkWhatsOnChain](#class-sdkwhatsonchain) |
| [BulkFilesReaderStorage](#class-bulkfilesreaderstorage) | [ChaintracksFsStatics](#class-chaintracksfsstatics) | [ServiceCollection](#class-servicecollection) |
| [BulkHeaderFile](#class-bulkheaderfile) | [ChaintracksKnexMigrations](#class-chaintracksknexmigrations) | [Services](#class-services) |
| [BulkHeaderFileFs](#class-bulkheaderfilefs) | [ChaintracksReadableFile](#class-chaintracksreadablefile) | [SingleWriterMultiReaderLock](#class-singlewritermultireaderlock) |
| [BulkHeaderFileStorage](#class-bulkheaderfilestorage) | [ChaintracksService](#class-chaintracksservice) | [WhatsOnChain](#class-whatsonchain) |
| [BulkHeaderFiles](#class-bulkheaderfiles) | [ChaintracksServiceClient](#class-chaintracksserviceclient) | [WhatsOnChainNoServices](#class-whatsonchainnoservices) |
| [BulkIngestorBase](#class-bulkingestorbase) | [ChaintracksStorageBase](#class-chaintracksstoragebase) | [WhatsOnChainServices](#class-whatsonchainservices) |
| [BulkIngestorCDN](#class-bulkingestorcdn) | [ChaintracksStorageIdb](#class-chaintracksstorageidb) |  |
| [BulkIngestorCDNBabbage](#class-bulkingestorcdnbabbage) | [ChaintracksStorageKnex](#class-chaintracksstorageknex) |  |

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
    async postRawTx(rawTx: HexString, txids?: string[]): Promise<PostTxResultForTxid> 
    async postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult> 
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
async postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult> 
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
async postRawTx(rawTx: HexString, txids?: string[]): Promise<PostTxResultForTxid> 
```
See also: [PostTxResultForTxid](./client.md#interface-posttxresultfortxid)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BHServiceClient

```ts
export class BHServiceClient implements ChaintracksServiceClient {
    bhs: BlockHeadersService;
    cache: Record<number, string>;
    chain: Chain;
    serviceUrl: string;
    options: ChaintracksServiceClientOptions;
    apiKey: string;
    constructor(chain: Chain, url: string, apiKey: string) 
    async currentHeight(): Promise<number> 
    async isValidRootForHeight(root: string, height: number): Promise<boolean> 
    async getPresentHeight(): Promise<number> 
    async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> 
    async findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined> 
    async getHeaders(height: number, count: number): Promise<string> 
    async findChainWorkForBlockHash(hash: string): Promise<string | undefined> 
    async findChainTipHeader(): Promise<BlockHeader> 
    async getJsonOrUndefined<T>(path: string): Promise<T | undefined> 
    async getJson<T>(path: string): Promise<T> 
    async postJsonVoid<T>(path: string, params: T): Promise<void> 
    async addHeader(header: any): Promise<void> 
    async findHeaderForMerkleRoot(merkleRoot: string, height?: number): Promise<undefined> 
    async startListening(): Promise<void> 
    async listening(): Promise<void> 
    async isSynchronized(): Promise<boolean> 
    async getChain(): Promise<Chain> 
    async isListening(): Promise<boolean> 
    async getChainTipHeader(): Promise<BlockHeader> 
    async findChainTipHash(): Promise<string> 
    async subscribeHeaders(listener: HeaderListener): Promise<string> 
    async subscribeReorgs(listener: ReorgListener): Promise<string> 
    async unsubscribe(subscriptionId: string): Promise<boolean> 
    async getInfo(): Promise<ChaintracksInfoApi> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [ChaintracksInfoApi](./services.md#interface-chaintracksinfoapi), [ChaintracksServiceClient](./services.md#class-chaintracksserviceclient), [ChaintracksServiceClientOptions](./services.md#interface-chaintracksserviceclientoptions), [HeaderListener](./services.md#type-headerlistener), [ReorgListener](./services.md#type-reorglistener)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: Bitails

```ts
export class Bitails {
    readonly chain: Chain;
    readonly apiKey: string;
    readonly URL: string;
    readonly httpClient: HttpClient;
    constructor(chain: Chain = "main", config: BitailsConfig = {}) 
    getHttpHeaders(): Record<string, string> 
    async postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult> 
    async postRaws(raws: HexString[], txids?: string[]): Promise<PostBeefResult> 
    async getMerklePath(txid: string, services: WalletServices): Promise<GetMerklePathResult> 
}
```

See also: [BitailsConfig](./services.md#interface-bitailsconfig), [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [PostBeefResult](./client.md#interface-postbeefresult), [WalletServices](./client.md#interface-walletservices)

###### Method postBeef

Bitails does not natively support a postBeef end-point aware of multiple txids of interest in the Beef.

Send rawTx in `txids` order from beef.

```ts
async postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

###### Method postRaws

```ts
async postRaws(raws: HexString[], txids?: string[]): Promise<PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

Argument Details

+ **raws**
  + Array of raw transactions to broadcast as hex strings
+ **txids**
  + Array of txids for transactions in raws for which results are requested, remaining raws are supporting only.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkFileDataManager

Manages bulk file data (typically 8MB chunks of 100,000 headers each).

If not cached in memory,
optionally fetches data by `sourceUrl` from CDN on demand,
optionally finds data by `fileId` in a database on demand,
and retains a limited number of files in memory,
subject to the optional `maxRetained` limit.

```ts
export class BulkFileDataManager {
    static createDefaultOptions(chain: Chain): BulkFileDataManagerOptions 
    readonly chain: Chain;
    readonly maxPerFile: number;
    readonly fetch?: ChaintracksFetchApi;
    readonly maxRetained?: number;
    readonly fromKnownSourceUrl?: string;
    constructor(options: BulkFileDataManagerOptions | Chain) 
    async deleteBulkFiles(): Promise<void> 
    async setStorage(storage: ChaintracksStorageBulkFileApi, log: (...args: any[]) => void): Promise<void> 
    heightRangesFromBulkFiles(files: BulkHeaderFileInfo[]): {
        all: HeightRange;
        cdn: HeightRange;
        incremental: HeightRange;
    } 
    async createReader(range?: HeightRange, maxBufferSize?: number): Promise<BulkFileDataReader> 
    async updateFromUrl(cdnUrl: string): Promise<void> 
    async merge(files: BulkHeaderFileInfo[]): Promise<BulkFileDataManagerMergeResult> 
    toLogString(what?: BulkFileDataManagerMergeResult | BulkFileData[] | BulkHeaderFileInfo[]): string 
    async mergeIncrementalBlockHeaders(newBulkHeaders: BlockHeader[], incrementalChainWork?: string): Promise<void> 
    async getBulkFiles(keepData?: boolean): Promise<BulkHeaderFileInfo[]> 
    async getHeightRange(): Promise<HeightRange> 
    async getDataFromFile(file: BulkHeaderFileInfo, offset?: number, length?: number): Promise<Uint8Array | undefined> 
    async findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> 
    async getFileForHeight(height: number): Promise<BulkHeaderFileInfo | undefined> 
    async getLastFile(fromEnd = 1): Promise<BulkHeaderFileInfo | undefined> 
    async ReValidate(): Promise<void> 
    async exportHeadersToFs(toFs: ChaintracksFsApi, toHeadersPerFile: number, toFolder: string, sourceUrl?: string, maxHeight?: number): Promise<void> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkFileDataManagerMergeResult](./services.md#interface-bulkfiledatamanagermergeresult), [BulkFileDataManagerOptions](./services.md#interface-bulkfiledatamanageroptions), [BulkFileDataReader](./services.md#class-bulkfiledatareader), [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [ChaintracksStorageBulkFileApi](./services.md#interface-chaintracksstoragebulkfileapi), [HeightRange](./services.md#class-heightrange)

###### Method setStorage

If `bfds` are going to be backed by persistent storage,
must be called before making storage available.

Synchronizes bfds and storage files, after which this manager maintains sync.
There should be no changes to bulk files by direct access to storage bulk file methods.

```ts
async setStorage(storage: ChaintracksStorageBulkFileApi, log: (...args: any[]) => void): Promise<void> 
```
See also: [ChaintracksStorageBulkFileApi](./services.md#interface-chaintracksstoragebulkfileapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkFileDataReader

```ts
export class BulkFileDataReader {
    readonly manager: BulkFileDataManager;
    readonly range: HeightRange;
    readonly maxBufferSize: number;
    nextHeight: number;
    constructor(manager: BulkFileDataManager, range: HeightRange, maxBufferSize: number) 
    async read(): Promise<Uint8Array | undefined> 
}
```

See also: [BulkFileDataManager](./services.md#class-bulkfiledatamanager), [HeightRange](./services.md#class-heightrange)

###### Method read

```ts
async read(): Promise<Uint8Array | undefined> 
```

Returns

an array containing the next `maxBufferSize` bytes of headers from the files.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkFilesReader

Breaks available bulk headers stored in multiple files into a sequence of buffers with
limited maximum size.

```ts
export class BulkFilesReader {
    files: BulkHeaderFile[];
    range: HeightRange;
    maxBufferSize = 400 * 80;
    nextHeight: number | undefined;
    constructor(files: BulkHeaderFile[], range?: HeightRange, maxBufferSize?: number) 
    protected setRange(range?: HeightRange) 
    setMaxBufferSize(maxBufferSize: number | undefined) 
    get heightRange(): HeightRange 
    async readBufferForHeightOrUndefined(height: number): Promise<Uint8Array | undefined> 
    async readBufferForHeight(height: number): Promise<Uint8Array> 
    async readHeaderForHeight(height: number): Promise<BaseBlockHeader> 
    async readHeaderForHeightOrUndefined(height: number): Promise<BaseBlockHeader | undefined> 
    async read(): Promise<Uint8Array | undefined> 
    resetRange(range: HeightRange, maxBufferSize?: number) 
    async validateFiles(): Promise<void> 
    async exportHeadersToFs(toFs: ChaintracksFsApi, toHeadersPerFile: number, toFolder: string): Promise<void> 
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BulkHeaderFile](./services.md#class-bulkheaderfile), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [HeightRange](./services.md#class-heightrange)

###### Property files

Previously validated bulk header files which may pull data from backing storage on demand.

```ts
files: BulkHeaderFile[]
```
See also: [BulkHeaderFile](./services.md#class-bulkheaderfile)

###### Property maxBufferSize

Maximum buffer size returned from `read()` in bytes.

```ts
maxBufferSize = 400 * 80
```

###### Property nextHeight

"Read pointer", the next height to be "read".

```ts
nextHeight: number | undefined
```

###### Property range

Subset of headers currently being "read".

```ts
range: HeightRange
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method read

```ts
async read(): Promise<Uint8Array | undefined> 
```

Returns

an array containing the next `maxBufferSize` bytes of headers from the files.

###### Method resetRange

Reset the reading process and adjust the range to be read to a new subset of what's available...

```ts
resetRange(range: HeightRange, maxBufferSize?: number) 
```
See also: [HeightRange](./services.md#class-heightrange)

Argument Details

+ **range**
  + new range for subsequent `read` calls to return.
+ **maxBufferSize**
  + optionally update largest buffer size for `read` to return

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkFilesReaderFs

```ts
export class BulkFilesReaderFs extends BulkFilesReader {
    constructor(public fs: ChaintracksFsApi, files: BulkHeaderFileFs[], range?: HeightRange, maxBufferSize?: number) 
    static async fromFs(fs: ChaintracksFsApi, rootFolder: string, jsonFilename: string, range?: HeightRange, maxBufferSize?: number): Promise<BulkFilesReaderFs> 
    static async writeEmptyJsonFile(fs: ChaintracksFsApi, rootFolder: string, jsonFilename: string): Promise<string> 
    static async readJsonFile(fs: ChaintracksFsApi, rootFolder: string, jsonFilename: string, failToEmptyRange: boolean = true): Promise<BulkHeaderFilesInfo> 
}
```

See also: [BulkFilesReader](./services.md#class-bulkfilesreader), [BulkHeaderFileFs](./services.md#class-bulkheaderfilefs), [BulkHeaderFilesInfo](./services.md#interface-bulkheaderfilesinfo), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [HeightRange](./services.md#class-heightrange)

###### Method fromFs

Return a BulkFilesReader configured to access the intersection of `range` and available headers.

```ts
static async fromFs(fs: ChaintracksFsApi, rootFolder: string, jsonFilename: string, range?: HeightRange, maxBufferSize?: number): Promise<BulkFilesReaderFs> 
```
See also: [BulkFilesReaderFs](./services.md#class-bulkfilesreaderfs), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [HeightRange](./services.md#class-heightrange)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkFilesReaderStorage

```ts
export class BulkFilesReaderStorage extends BulkFilesReader {
    constructor(storage: ChaintracksStorageBase, files: BulkHeaderFileStorage[], range?: HeightRange, maxBufferSize?: number) 
    static async fromStorage(storage: ChaintracksStorageBase, fetch?: ChaintracksFetchApi, range?: HeightRange, maxBufferSize?: number): Promise<BulkFilesReaderStorage> 
}
```

See also: [BulkFilesReader](./services.md#class-bulkfilesreader), [BulkHeaderFileStorage](./services.md#class-bulkheaderfilestorage), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase), [HeightRange](./services.md#class-heightrange)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkHeaderFile

```ts
export abstract class BulkHeaderFile implements BulkHeaderFileInfo {
    chain?: Chain | undefined;
    count: number;
    data?: Uint8Array<ArrayBufferLike> | undefined;
    fileHash: string | null;
    fileId?: number | undefined;
    fileName: string;
    firstHeight: number;
    lastChainWork: string;
    lastHash: string | null;
    prevChainWork: string;
    prevHash: string;
    sourceUrl?: string | undefined;
    validated?: boolean | undefined;
    constructor(info: BulkHeaderFileInfo) 
    abstract readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined>;
    get heightRange(): HeightRange 
    async ensureData(): Promise<Uint8Array> 
    async computeFileHash(): Promise<string> 
    async releaseData(): Promise<void> 
    toCdnInfo(): BulkHeaderFileInfo 
    toStorageInfo(): BulkHeaderFileInfo 
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [Chain](./client.md#type-chain), [HeightRange](./services.md#class-heightrange)

###### Method computeFileHash

Whenever reloading data from a backing store, validated fileHash must be re-verified

```ts
async computeFileHash(): Promise<string> 
```

Returns

the sha256 hash of the file's data as base64 string.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkHeaderFileFs

```ts
export class BulkHeaderFileFs extends BulkHeaderFile {
    constructor(info: BulkHeaderFileInfo, public fs: ChaintracksFsApi, public rootFolder: string) 
    override async readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined> 
    override async ensureData(): Promise<Uint8Array> 
}
```

See also: [BulkHeaderFile](./services.md#class-bulkheaderfile), [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkHeaderFileStorage

```ts
export class BulkHeaderFileStorage extends BulkHeaderFile {
    constructor(info: BulkHeaderFileInfo, public storage: ChaintracksStorageBase, public fetch?: ChaintracksFetchApi) 
    override async readDataFromFile(length: number, offset: number): Promise<Uint8Array | undefined> 
    override async ensureData(): Promise<Uint8Array> 
}
```

See also: [BulkHeaderFile](./services.md#class-bulkheaderfile), [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkHeaderFiles

```ts
export abstract class BulkHeaderFiles implements BulkHeaderFilesInfo {
    constructor(public rootFolder: string, public jsonFilename: string, public files: BulkHeaderFileInfo[], public headersPerFile: number) 
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [BulkHeaderFilesInfo](./services.md#interface-bulkheaderfilesinfo)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkIngestorBase

```ts
export abstract class BulkIngestorBase implements BulkIngestorApi {
    static createBulkIngestorBaseOptions(chain: Chain) 
    chain: Chain;
    jsonFilename: string;
    log: (...args: any[]) => void = () => ;
    constructor(options: BulkIngestorBaseOptions) 
    async setStorage(storage: ChaintracksStorageBase, log: (...args: any[]) => void): Promise<void> 
    async shutdown(): Promise<void> { }
    storageOrUndefined(): ChaintracksStorageApi | undefined 
    storage(): ChaintracksStorageBase 
    filesInfo: BulkHeaderFilesInfo | undefined;
    async getPresentHeight(): Promise<number | undefined> 
    abstract fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]>;
    async synchronize(presentHeight: number, before: HeightRanges, priorLiveHeaders: BlockHeader[]): Promise<BulkSyncResult> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkHeaderFilesInfo](./services.md#interface-bulkheaderfilesinfo), [BulkIngestorApi](./services.md#interface-bulkingestorapi), [BulkIngestorBaseOptions](./services.md#interface-bulkingestorbaseoptions), [BulkSyncResult](./services.md#interface-bulksyncresult), [Chain](./client.md#type-chain), [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges)

###### Property filesInfo

information about locally cached bulk header files managed by this bulk ingestor

```ts
filesInfo: BulkHeaderFilesInfo | undefined
```
See also: [BulkHeaderFilesInfo](./services.md#interface-bulkheaderfilesinfo)

###### Method createBulkIngestorBaseOptions

```ts
static createBulkIngestorBaseOptions(chain: Chain) 
```
See also: [Chain](./client.md#type-chain)

Argument Details

+ **localCachePath**
  + defaults to './data/ingest_headers/'

###### Method fetchHeaders

A BulkIngestor fetches and updates storage with bulk headers in bulkRange.

If it can, it must also fetch live headers in fetch range that are not in bulkRange and return them as an array.

The storage methods `insertBulkFile`, `updateBulkFile`, and `addBulkHeaders` should be used to add bulk headers to storage.

```ts
abstract fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]>
```
See also: [BlockHeader](./client.md#interface-blockheader), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges)

Returns

new live headers: headers in fetchRange but not in bulkRange

Argument Details

+ **before**
  + bulk and live range of headers before ingesting any new headers.
+ **fetchRange**
  + range of headers still needed, includes both missing bulk and live headers.
+ **bulkRange**
  + range of bulk headers still needed
+ **priorLiveHeaders**
  + any headers accumulated by prior bulk ingestor(s) that are too recent for bulk storage.

###### Method getPresentHeight

At least one derived BulkIngestor must override this method to provide the current height of the active chain tip.

```ts
async getPresentHeight(): Promise<number | undefined> 
```

Returns

undefined unless overridden

###### Method synchronize

A BulkIngestor has two potential goals:
1. To source missing bulk headers and include them in bulk storage.
2. To source missing live headers to be forwarded to live storage.

```ts
async synchronize(presentHeight: number, before: HeightRanges, priorLiveHeaders: BlockHeader[]): Promise<BulkSyncResult> 
```
See also: [BlockHeader](./client.md#interface-blockheader), [BulkSyncResult](./services.md#interface-bulksyncresult), [HeightRanges](./services.md#interface-heightranges)

Returns

updated priorLiveHeaders including any accumulated by this ingestor

Argument Details

+ **presentHeight**
  + current height of the active chain tip, may lag the true value.
+ **before**
  + current bulk and live storage height ranges, either may be empty.
+ **priorLiveHeaders**
  + any headers accumulated by prior bulk ingestor(s) that are too recent for bulk storage.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkIngestorCDN

```ts
export class BulkIngestorCDN extends BulkIngestorBase {
    static createBulkIngestorCDNOptions(chain: Chain, cdnUrl: string, fetch: ChaintracksFetchApi, maxPerFile?: number): BulkIngestorCDNOptions 
    fetch: ChaintracksFetchApi;
    jsonResource: string;
    cdnUrl: string;
    maxPerFile: number | undefined;
    availableBulkFiles: BulkHeaderFilesInfo | undefined;
    selectedFiles: BulkHeaderFileInfo[] | undefined;
    currentRange: HeightRange | undefined;
    constructor(options: BulkIngestorCDNOptions) 
    override async getPresentHeight(): Promise<number | undefined> 
    getJsonHttpHeaders(): Record<string, string> 
    async fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [BulkHeaderFilesInfo](./services.md#interface-bulkheaderfilesinfo), [BulkIngestorBase](./services.md#class-bulkingestorbase), [BulkIngestorCDNOptions](./services.md#interface-bulkingestorcdnoptions), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges)

###### Method createBulkIngestorCDNOptions

```ts
static createBulkIngestorCDNOptions(chain: Chain, cdnUrl: string, fetch: ChaintracksFetchApi, maxPerFile?: number): BulkIngestorCDNOptions 
```
See also: [BulkIngestorCDNOptions](./services.md#interface-bulkingestorcdnoptions), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

Argument Details

+ **localCachePath**
  + defaults to './data/bulk_cdn_headers/'

###### Method fetchHeaders

A BulkFile CDN serves a JSON BulkHeaderFilesInfo resource which lists all the available binary bulk header files available and associated metadata.

The term "CDN file" is used for a local bulk file that has a sourceUrl. (Not undefined)
The term "incremental file" is used for the local bulk file that holds all the non-CDN bulk headers and must chain to the live headers if there are any.

Bulk ingesting from a CDN happens in one of three contexts:

1. Cold Start: No local bulk or live headers.
2. Incremental: Available CDN files extend into an existing incremental file but not into the live headers.
3. Replace: Available CDN files extend into live headers.

Context Cold Start:
- The CDN files are selected in height order, starting at zero, always choosing the largest count less than the local maximum (maxPerFile).

Context Incremental:
- Last existing CDN file is updated if CDN now has a higher count.
- Additional CDN files are added as in Cold Start.
- The existing incremental file is truncated or deleted.

Context Replace:
- Existing live headers are truncated or deleted.
- Proceed as context Incremental.

```ts
async fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]> 
```
See also: [BlockHeader](./client.md#interface-blockheader), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges)

Argument Details

+ **before**
  + bulk and live range of headers before ingesting any new headers.
+ **fetchRange**
  + total range of header heights needed including live headers
+ **bulkRange**
  + range of missing bulk header heights required.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkIngestorCDNBabbage

```ts
export class BulkIngestorCDNBabbage extends BulkIngestorCDN {
    static createBulkIngestorCDNBabbageOptions(chain: Chain, fetch: ChaintracksFetchApi): BulkIngestorCDNOptions 
}
```

See also: [BulkIngestorCDN](./services.md#class-bulkingestorcdn), [BulkIngestorCDNOptions](./services.md#interface-bulkingestorcdnoptions), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

###### Method createBulkIngestorCDNBabbageOptions

```ts
static createBulkIngestorCDNBabbageOptions(chain: Chain, fetch: ChaintracksFetchApi): BulkIngestorCDNOptions 
```
See also: [BulkIngestorCDNOptions](./services.md#interface-bulkingestorcdnoptions), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

Argument Details

+ **rootFolder**
  + defaults to './data/bulk_cdn_babbage_headers/'

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkIngestorWhatsOnChainCdn

```ts
export class BulkIngestorWhatsOnChainCdn extends BulkIngestorBase {
    static createBulkIngestorWhatsOnChainOptions(chain: Chain): BulkIngestorWhatsOnChainOptions 
    fetch: ChaintracksFetchApi;
    idleWait: number;
    woc: WhatsOnChainServices;
    stopOldListenersToken: StopListenerToken = { stop: undefined };
    constructor(options: BulkIngestorWhatsOnChainOptions) 
    override async getPresentHeight(): Promise<number | undefined> 
    async fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkIngestorBase](./services.md#class-bulkingestorbase), [BulkIngestorWhatsOnChainOptions](./services.md#interface-bulkingestorwhatsonchainoptions), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges), [StopListenerToken](./services.md#type-stoplistenertoken), [WhatsOnChainServices](./services.md#class-whatsonchainservices)

###### Method createBulkIngestorWhatsOnChainOptions

```ts
static createBulkIngestorWhatsOnChainOptions(chain: Chain): BulkIngestorWhatsOnChainOptions 
```
See also: [BulkIngestorWhatsOnChainOptions](./services.md#interface-bulkingestorwhatsonchainoptions), [Chain](./client.md#type-chain)

Argument Details

+ **localCachePath**
  + defaults to './data/ingest_whatsonchain_headers'

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkIngestorWhatsOnChainWs

```ts
export class BulkIngestorWhatsOnChainWs extends BulkIngestorBase {
    static createBulkIngestorWhatsOnChainOptions(chain: Chain): BulkIngestorWhatsOnChainOptions 
    idleWait: number;
    woc: WhatsOnChainServices;
    stopOldListenersToken: StopListenerToken = { stop: undefined };
    constructor(options: BulkIngestorWhatsOnChainOptions) 
    override async getPresentHeight(): Promise<number | undefined> 
    async fetchHeaders(before: HeightRanges, fetchRange: HeightRange, bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkIngestorBase](./services.md#class-bulkingestorbase), [BulkIngestorWhatsOnChainOptions](./services.md#interface-bulkingestorwhatsonchainoptions), [Chain](./client.md#type-chain), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges), [StopListenerToken](./services.md#type-stoplistenertoken), [WhatsOnChainServices](./services.md#class-whatsonchainservices)

###### Method createBulkIngestorWhatsOnChainOptions

```ts
static createBulkIngestorWhatsOnChainOptions(chain: Chain): BulkIngestorWhatsOnChainOptions 
```
See also: [BulkIngestorWhatsOnChainOptions](./services.md#interface-bulkingestorwhatsonchainoptions), [Chain](./client.md#type-chain)

Argument Details

+ **localCachePath**
  + defaults to './data/ingest_whatsonchain_headers'

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: BulkStorageBase

```ts
export abstract class BulkStorageBase implements BulkStorageApi {
    static createBulkStorageBaseOptions(chain: Chain, fs: ChaintracksFsApi): BulkStorageBaseOptions 
    chain: Chain;
    fs: ChaintracksFsApi;
    log: (...args: any[]) => void = () => ;
    constructor(options: BulkStorageBaseOptions) 
    async shutdown(): Promise<void> 
    abstract appendHeaders(minHeight: number, count: number, newBulkHeaders: Uint8Array): Promise<void>;
    abstract getMaxHeight(): Promise<number>;
    abstract headersToBuffer(height: number, count: number): Promise<Uint8Array>;
    abstract findHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined>;
    async findHeaderForHeight(height: number): Promise<BlockHeader> 
    async getHeightRange(): Promise<HeightRange> 
    async setStorage(storage: ChaintracksStorageBase, log: (...args: any[]) => void): Promise<void> { }
    async exportBulkHeaders(rootFolder: string, jsonFilename: string, maxPerFile: number): Promise<void> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkStorageApi](./services.md#interface-bulkstorageapi), [BulkStorageBaseOptions](./services.md#interface-bulkstoragebaseoptions), [Chain](./client.md#type-chain), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase), [HeightRange](./services.md#class-heightrange)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: Chaintracks

```ts
export class Chaintracks implements ChaintracksManagementApi {
    static createOptions(chain: Chain): ChaintracksOptions 
    log: (...args: any[]) => void = () => { };
    readonly chain: Chain;
    readonly readonly: boolean;
    constructor(public options: ChaintracksOptions) 
    async getChain(): Promise<Chain> 
    async getPresentHeight(): Promise<number> 
    async currentHeight(): Promise<number> 
    async subscribeHeaders(listener: HeaderListener): Promise<string> 
    async subscribeReorgs(listener: ReorgListener): Promise<string> 
    async unsubscribe(subscriptionId: string): Promise<boolean> 
    async addHeader(header: BaseBlockHeader): Promise<void> 
    async makeAvailable(): Promise<void> 
    async startPromises(): Promise<void> 
    async destroy(): Promise<void> 
    async listening(): Promise<void> 
    async isListening(): Promise<boolean> 
    async isSynchronized(): Promise<boolean> 
    async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> 
    async findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined> 
    async isValidRootForHeight(root: string, height: number): Promise<boolean> 
    async getInfo(): Promise<ChaintracksInfoApi> 
    async getHeaders(height: number, count: number): Promise<string> 
    async findChainTipHeader(): Promise<BlockHeader> 
    async findChainTipHash(): Promise<string> 
    async findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | undefined> 
    async findChainWorkForBlockHash(hash: string): Promise<string | undefined> 
    async validate(): Promise<boolean> 
    async exportBulkHeaders(toFolder: string, toFs: ChaintracksFsApi, sourceUrl?: string, toHeadersPerFile?: number, maxHeight?: number): Promise<void> 
    async startListening(): Promise<void> 
    private async syncBulkStorageNoLock(presentHeight: number, initialRanges: HeightRanges): Promise<void> {
        let newLiveHeaders: BlockHeader[] = [];
        let bulkDone = false;
        let before = initialRanges;
        let after = before;
        let added = HeightRange.empty;
        let done = false;
        for (; !done;) {
            let bulkSyncError: WalletError | undefined;
            for (const bulk of this.bulkIngestors) {
                try {
                    const r = await bulk.synchronize(presentHeight, before, newLiveHeaders);
                    newLiveHeaders = r.liveHeaders;
                    after = await this.storage.getAvailableHeightRanges();
                    added = after.bulk.above(before.bulk);
                    before = after;
                    this.log(`Bulk Ingestor: ${added.length} added with ${newLiveHeaders.length} live headers from ${bulk.constructor.name}`);
                    if (r.done) {
                        done = true;
                        break;
                    }
                }
                catch (eu: unknown) {
                    const e = (bulkSyncError = WalletError.fromUnknown(eu));
                    this.log(`bulk sync error: ${e.message}`);
                    if (!this.available)
                        break;
                }
            }
            if (!bulkDone && !this.available && bulkSyncError) {
                this.startupError = bulkSyncError;
                break;
            }
            if (bulkDone)
                break;
        }
        if (!this.startupError) {
            this.liveHeaders.unshift(...newLiveHeaders);
            added = after.bulk.above(initialRanges.bulk);
            this.log(`syncBulkStorage done
  Before sync: bulk ${initialRanges.bulk}, live ${initialRanges.live}
   After sync: bulk ${after.bulk}, live ${after.live}
  ${added.length} headers added to bulk storage
  ${this.liveHeaders.length} headers forwarded to live header storage
`);
        }
    }
    private async mainThreadShiftLiveHeaders(): Promise<void> {
        this.stopMainThread = false;
        let lastSyncCheck = Date.now();
        let lastBulkSync = Date.now();
        const cdnSyncRepeatMsecs = 24 * 60 * 60 * 1000;
        const syncCheckRepeatMsecs = 30 * 60 * 1000;
        while (!this.stopMainThread) {
            try {
                const now = Date.now();
                lastSyncCheck = now;
                const presentHeight = await this.getPresentHeight();
                const before = await this.storage.getAvailableHeightRanges();
                let skipBulkSync = !before.live.isEmpty && before.live.maxHeight >= presentHeight - this.addLiveRecursionLimit / 2;
                if (skipBulkSync && now - lastBulkSync > cdnSyncRepeatMsecs) {
                    skipBulkSync = false;
                }
                this.log(`Chaintracks Update Services: Bulk Header Sync Review
  presentHeight=${presentHeight}   addLiveRecursionLimit=${this.addLiveRecursionLimit}
  Before synchronize: bulk ${before.bulk}, live ${before.live}
  ${skipBulkSync ? "Skipping" : "Starting"} syncBulkStorage.
`);
                if (!skipBulkSync) {
                    lastBulkSync = now;
                    if (this.available)
                        await this.syncBulkStorage(presentHeight, before);
                    else
                        await this.syncBulkStorageNoLock(presentHeight, before);
                    if (this.startupError)
                        throw this.startupError;
                }
                let count = 0;
                let liveHeaderDupes = 0;
                let needSyncCheck = false;
                for (; !needSyncCheck && !this.stopMainThread;) {
                    let header = this.liveHeaders.shift();
                    if (header) {
                        let recursions = this.addLiveRecursionLimit;
                        for (; !needSyncCheck && !this.stopMainThread;) {
                            const ihr = await this.addLiveHeader(header);
                            if (this.invalidInsertHeaderResult(ihr)) {
                                this.log(`Ignoring liveHeader ${header.height} ${header.hash} due to invalid insert result.`);
                                needSyncCheck = true;
                            }
                            else if (ihr.noPrev) {
                                if (recursions-- <= 0) {
                                    this.log(`Ignoring liveHeader ${header.height} ${header.hash} addLiveRecursionLimit=${this.addLiveRecursionLimit} exceeded.`);
                                    needSyncCheck = true;
                                }
                                else {
                                    const hash = header.previousHash;
                                    const prevHeader = await this.getMissingBlockHeader(hash);
                                    if (!prevHeader) {
                                        this.log(`Ignoring liveHeader ${header.height} ${header.hash} failed to find previous header by hash ${asString(hash)}`);
                                        needSyncCheck = true;
                                    }
                                    else {
                                        this.liveHeaders.unshift(header);
                                        header = prevHeader;
                                    }
                                }
                            }
                            else {
                                if (this.subscriberCallbacksEnabled)
                                    this.log(`addLiveHeader ${header.height}${ihr.added ? " added" : ""}${ihr.dupe ? " dupe" : ""}${ihr.isActiveTip ? " isActiveTip" : ""}${ihr.reorgDepth ? " reorg depth " + ihr.reorgDepth : ""}${ihr.noPrev ? " noPrev" : ""}${ihr.noActiveAncestor || ihr.noTip || ihr.badPrev ? " error" : ""}`);
                                if (ihr.dupe) {
                                    liveHeaderDupes++;
                                }
                                if (ihr.added) {
                                    count++;
                                }
                                break;
                            }
                        }
                    }
                    else {
                        const bheader = this.baseHeaders.shift();
                        if (bheader) {
                            const prev = await this.storage.findLiveHeaderForBlockHash(bheader.previousHash);
                            if (!prev) {
                                this.log(`Ignoring header with unknown previousHash ${bheader.previousHash} in live storage.`);
                            }
                            else {
                                const header: BlockHeader = {
                                    ...bheader,
                                    height: prev.height + 1,
                                    hash: blockHash(bheader)
                                };
                                const ihr = await this.addLiveHeader(header);
                                if (this.invalidInsertHeaderResult(ihr)) {
                                    this.log(`Ignoring invalid baseHeader ${header.height} ${header.hash}.`);
                                }
                                else {
                                    if (this.subscriberCallbacksEnabled)
                                        this.log(`addBaseHeader ${header.height}${ihr.added ? " added" : ""}${ihr.dupe ? " dupe" : ""}${ihr.isActiveTip ? " isActiveTip" : ""}${ihr.reorgDepth ? " reorg depth " + ihr.reorgDepth : ""}${ihr.noPrev ? " noPrev" : ""}${ihr.noActiveAncestor || ihr.noTip || ihr.badPrev ? " error" : ""}`);
                                    if (ihr.added) {
                                        count++;
                                    }
                                }
                            }
                        }
                        else {
                            if (count > 0) {
                                if (liveHeaderDupes > 0) {
                                    this.log(`${liveHeaderDupes} duplicate headers ignored.`);
                                    liveHeaderDupes = 0;
                                }
                                const updated = await this.storage.getAvailableHeightRanges();
                                this.log(`After adding ${count} live headers
   After live: bulk ${updated.bulk}, live ${updated.live}
`);
                                count = 0;
                            }
                            if (!this.subscriberCallbacksEnabled) {
                                const live = await this.storage.findLiveHeightRange();
                                if (!live.isEmpty) {
                                    this.subscriberCallbacksEnabled = true;
                                    this.log(`listening at height of ${live.maxHeight}`);
                                }
                            }
                            if (!this.available) {
                                this.available = true;
                            }
                            needSyncCheck = Date.now() - lastSyncCheck > syncCheckRepeatMsecs;
                            if (!needSyncCheck)
                                await wait(1000);
                        }
                    }
                }
            }
            catch (eu: unknown) {
                const e = WalletError.fromUnknown(eu);
                if (!this.available) {
                    this.startupError = e;
                    this.stopMainThread = true;
                }
                else {
                    this.log(`Error occurred during chaintracks main thread processing: ${e.stack || e.message}`);
                }
            }
        }
    }
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [ChaintracksInfoApi](./services.md#interface-chaintracksinfoapi), [ChaintracksManagementApi](./services.md#interface-chaintracksmanagementapi), [ChaintracksOptions](./services.md#interface-chaintracksoptions), [HeaderListener](./services.md#type-headerlistener), [HeightRange](./services.md#class-heightrange), [HeightRanges](./services.md#interface-heightranges), [LiveBlockHeader](./services.md#interface-liveblockheader), [ReorgListener](./services.md#type-reorglistener), [Services](./services.md#class-services), [WalletError](./client.md#class-walleterror), [asString](./client.md#function-asstring), [blockHash](./services.md#function-blockhash), [wait](./client.md#function-wait)

###### Method addHeader

Queues a potentially new, unknown header for consideration as an addition to the chain.
When the header is considered, if the prior header is unknown, recursive calls to the
bulk ingestors will be attempted to resolve the linkage up to a depth of `addLiveRecursionLimit`.

Headers are considered in the order they were added.

```ts
async addHeader(header: BaseBlockHeader): Promise<void> 
```
See also: [BaseBlockHeader](./client.md#interface-baseblockheader)

###### Method getPresentHeight

Caches and returns most recently sourced value if less than one minute old.

```ts
async getPresentHeight(): Promise<number> 
```

Returns

the current externally available chain height (via bulk ingestors).

###### Method makeAvailable

If not already available, takes a writer lock to queue calls until available.
Becoming available starts by initializing ingestors and main thread,
and ends when main thread sets `available`.
Note that the main thread continues running and takes additional write locks
itself when already available.

```ts
async makeAvailable(): Promise<void> 
```

Returns

when available for client requests

###### Method validate

```ts
async validate(): Promise<boolean> 
```

Returns

true iff all headers from height zero through current chainTipHeader height can be retreived and form a valid chain.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksAppendableFile

```ts
export class ChaintracksAppendableFile extends ChaintracksReadableFile implements ChaintracksAppendableFileApi {
    foldersEnsured: boolean = false;
    static async openAsAppendable(path: string): Promise<ChaintracksAppendableFile> 
    async ensureFoldersExist(): Promise<void> 
    async append(data: Uint8Array): Promise<void> 
}
```

See also: [ChaintracksAppendableFileApi](./services.md#interface-chaintracksappendablefileapi), [ChaintracksReadableFile](./services.md#class-chaintracksreadablefile)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksChainTracker

```ts
export class ChaintracksChainTracker implements ChainTracker {
    chaintracks: ChaintracksClientApi;
    cache: Record<number, string>;
    options: ChaintracksChainTrackerOptions;
    constructor(chain?: Chain, chaintracks?: ChaintracksClientApi, options?: ChaintracksChainTrackerOptions) 
    async currentHeight(): Promise<number> 
    async isValidRootForHeight(root: string, height: number): Promise<boolean> 
}
```

See also: [Chain](./client.md#type-chain), [ChaintracksChainTrackerOptions](./services.md#interface-chaintrackschaintrackeroptions), [ChaintracksClientApi](./services.md#interface-chaintracksclientapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksFetch

This class implements the ChaintracksFetchApi
using the

```ts
export class ChaintracksFetch implements ChaintracksFetchApi {
    httpClient: HttpClient = defaultHttpClient();
    constructor() 
    async download(url: string): Promise<Uint8Array> 
    async fetchJson<R>(url: string): Promise<R> 
    pathJoin(baseUrl: string, subpath: string): string 
}
```

See also: [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksFsStatics

```ts
export abstract class ChaintracksFsStatics {
    static async delete(path: string): Promise<void> 
    static async writeFile(path: string, data: Uint8Array): Promise<void> 
    static async readFile(path: string): Promise<Uint8Array> 
    static async openReadableFile(path: string): Promise<ChaintracksReadableFileApi> 
    static async openWritableFile(path: string): Promise<ChaintracksWritableFileApi> 
    static async openAppendableFile(path: string): Promise<ChaintracksAppendableFileApi> 
    static async ensureFoldersExist(path: string): Promise<void> 
    static pathJoin(...parts: string[]): string 
}
```

See also: [ChaintracksAppendableFileApi](./services.md#interface-chaintracksappendablefileapi), [ChaintracksReadableFileApi](./services.md#interface-chaintracksreadablefileapi), [ChaintracksWritableFileApi](./services.md#interface-chaintrackswritablefileapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksKnexMigrations

```ts
export class ChaintracksKnexMigrations implements MigrationSource<string> {
    migrations: Record<string, Migration> = {};
    constructor(public chain: Chain) 
    async getMigrations(): Promise<string[]> 
    getMigrationName(migration: string) 
    async getMigration(migration: string): Promise<Migration> 
    async getLatestMigration(): Promise<string> 
    static async latestMigration(): Promise<string> 
    setupMigrations(): Record<string, Migration> 
}
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksReadableFile

```ts
export class ChaintracksReadableFile implements ChaintracksReadableFileApi {
    path: string;
    parsedPath: Path.ParsedPath;
    f: fs.FileHandle;
    protected constructor(path: string, f: fs.FileHandle) 
    async close(): Promise<void> 
    async getLength(): Promise<number> 
    async read(length?: number, offset?: number): Promise<Uint8Array> 
    static async openAsReadable(path: string): Promise<ChaintracksReadableFile> 
}
```

See also: [ChaintracksReadableFileApi](./services.md#interface-chaintracksreadablefileapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksService

```ts
export class ChaintracksService {
    static createChaintracksServiceOptions(chain: Chain): ChaintracksServiceOptions 
    chain: Chain;
    options: ChaintracksServiceOptions;
    port?: number;
    chaintracks: Chaintracks;
    services: Services;
    server?: Server<typeof IncomingMessage, typeof ServerResponse>;
    constructor(options: ChaintracksServiceOptions) 
    async stopJsonRpcServer(): Promise<void> 
    async startJsonRpcServer(port?: number): Promise<void> 
}
```

See also: [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [ChaintracksServiceOptions](./services.md#interface-chaintracksserviceoptions), [Services](./services.md#class-services)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksServiceClient

Connects to a ChaintracksService to implement 'ChaintracksClientApi'

```ts
export class ChaintracksServiceClient implements ChaintracksClientApi {
    static createChaintracksServiceClientOptions(): ChaintracksServiceClientOptions 
    options: ChaintracksServiceClientOptions;
    constructor(public chain: Chain, public serviceUrl: string, options?: ChaintracksServiceClientOptions) 
    subscribeHeaders(listener: HeaderListener): Promise<string> 
    subscribeReorgs(listener: ReorgListener): Promise<string> 
    unsubscribe(subscriptionId: string): Promise<boolean> 
    async currentHeight(): Promise<number> 
    async isValidRootForHeight(root: string, height: number): Promise<boolean> 
    async getJsonOrUndefined<T>(path: string): Promise<T | undefined> 
    async getJson<T>(path: string): Promise<T> 
    async postJsonVoid<T>(path: string, params: T): Promise<void> 
    async addHeader(header: BaseBlockHeader): Promise<void> 
    async startListening(): Promise<void> 
    async listening(): Promise<void> 
    async getChain(): Promise<Chain> 
    async isListening(): Promise<boolean> 
    async isSynchronized(): Promise<boolean> 
    async getPresentHeight(): Promise<number> 
    async getInfo(): Promise<ChaintracksInfoApi> 
    async findChainTipHeader(): Promise<BlockHeader> 
    async findChainTipHash(): Promise<string> 
    async getHeaders(height: number, count: number): Promise<string> 
    async findHeaderForHeight(height: number): Promise<BlockHeader | undefined> 
    async findHeaderForBlockHash(hash: string): Promise<BlockHeader | undefined> 
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [ChaintracksClientApi](./services.md#interface-chaintracksclientapi), [ChaintracksInfoApi](./services.md#interface-chaintracksinfoapi), [ChaintracksServiceClientOptions](./services.md#interface-chaintracksserviceclientoptions), [HeaderListener](./services.md#type-headerlistener), [ReorgListener](./services.md#type-reorglistener)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksStorageBase

Required interface methods of a Chaintracks Storage Engine implementation.

```ts
export abstract class ChaintracksStorageBase implements ChaintracksStorageQueryApi, ChaintracksStorageIngestApi {
    static createStorageBaseOptions(chain: Chain): ChaintracksStorageBaseOptions 
    log: (...args: any[]) => void = () => { };
    chain: Chain;
    liveHeightThreshold: number;
    reorgHeightThreshold: number;
    bulkMigrationChunkSize: number;
    batchInsertLimit: number;
    isAvailable: boolean = false;
    hasMigrated: boolean = false;
    bulkManager: BulkFileDataManager;
    constructor(options: ChaintracksStorageBaseOptions) 
    async shutdown(): Promise<void> 
    async makeAvailable(): Promise<void> 
    async migrateLatest(): Promise<void> 
    async dropAllData(): Promise<void> 
    abstract deleteLiveBlockHeaders(): Promise<void>;
    abstract deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number>;
    abstract findChainTipHeader(): Promise<LiveBlockHeader>;
    abstract findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined>;
    abstract findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null>;
    abstract findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader>;
    abstract findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null>;
    abstract findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null>;
    abstract findLiveHeightRange(): Promise<HeightRange>;
    abstract findMaxHeaderId(): Promise<number>;
    abstract liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]>;
    abstract getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]>;
    abstract insertHeader(header: BlockHeader): Promise<InsertHeaderResult>;
    abstract destroy(): Promise<void>;
    async getBulkHeaders(range: HeightRange): Promise<Uint8Array> 
    async getHeadersUint8Array(height: number, count: number): Promise<Uint8Array> 
    async getHeaders(height: number, count: number): Promise<BaseBlockHeader[]> 
    async deleteBulkBlockHeaders(): Promise<void> 
    async getAvailableHeightRanges(): Promise<{
        bulk: HeightRange;
        live: HeightRange;
    }> 
    async pruneLiveBlockHeaders(activeTipHeight: number): Promise<void> 
    async findChainTipHash(): Promise<string> 
    async findChainTipWork(): Promise<string> 
    async findChainWorkForBlockHash(hash: string): Promise<string> 
    async findBulkFilesHeaderForHeightOrUndefined(height: number): Promise<BlockHeader | undefined> 
    async findHeaderForHeightOrUndefined(height: number): Promise<LiveBlockHeader | BlockHeader | undefined> 
    async findHeaderForHeight(height: number): Promise<LiveBlockHeader | BlockHeader> 
    async isMerkleRootActive(merkleRoot: string): Promise<boolean> 
    async findCommonAncestor(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<LiveBlockHeader> 
    async findReorgDepth(header1: LiveBlockHeader, header2: LiveBlockHeader): Promise<number> 
    async migrateLiveToBulk(count: number, ignoreLimits = false): Promise<void> 
    async addBulkHeaders(headers: BlockHeader[], bulkRange: HeightRange, priorLiveHeaders: BlockHeader[]): Promise<BlockHeader[]> 
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [BulkFileDataManager](./services.md#class-bulkfiledatamanager), [Chain](./client.md#type-chain), [ChaintracksStorageBaseOptions](./services.md#interface-chaintracksstoragebaseoptions), [ChaintracksStorageIngestApi](./services.md#interface-chaintracksstorageingestapi), [ChaintracksStorageQueryApi](./services.md#interface-chaintracksstoragequeryapi), [HeightRange](./services.md#class-heightrange), [InsertHeaderResult](./services.md#type-insertheaderresult), [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method insertHeader

```ts
abstract insertHeader(header: BlockHeader): Promise<InsertHeaderResult>
```
See also: [BlockHeader](./client.md#interface-blockheader), [InsertHeaderResult](./services.md#type-insertheaderresult)

Returns

details of conditions found attempting to insert header

Argument Details

+ **header**
  + Header to attempt to add to live storage.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksStorageIdb

```ts
export class ChaintracksStorageIdb extends ChaintracksStorageBase implements ChaintracksStorageBulkFileApi {
    dbName: string;
    db?: IDBPDatabase<ChaintracksStorageIdbSchema>;
    whenLastAccess?: Date;
    allStores: string[] = ["live_headers", "bulk_headers"];
    constructor(options: ChaintracksStorageIdbOptions) 
    override async makeAvailable(): Promise<void> 
    override async migrateLatest(): Promise<void> 
    override async destroy(): Promise<void> 
    override async deleteLiveBlockHeaders(): Promise<void> 
    override async deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number> 
    override async findChainTipHeader(): Promise<LiveBlockHeader> 
    override async findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined> 
    override async findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null> 
    override async findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader> 
    override async findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null> 
    override async findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null> 
    override async findLiveHeightRange(): Promise<HeightRange> 
    override async findMaxHeaderId(): Promise<number> 
    override async liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]> 
    override async getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]> 
    override async insertHeader(header: BlockHeader): Promise<InsertHeaderResult> 
    async deleteBulkFile(fileId: number): Promise<number> 
    async insertBulkFile(file: BulkHeaderFileInfo): Promise<number> 
    async updateBulkFile(fileId: number, file: BulkHeaderFileInfo): Promise<number> 
    async getBulkFiles(): Promise<BulkHeaderFileInfo[]> 
    async getBulkFileData(fileId: number, offset?: number, length?: number): Promise<Uint8Array | undefined> 
    async insertLiveHeader(header: LiveBlockHeader): Promise<LiveBlockHeader> 
    async initDB(): Promise<IDBPDatabase<ChaintracksStorageIdbSchema>> 
    toDbTrxReadOnly(stores: string[]): IDBPTransaction<ChaintracksStorageIdbSchema, string[], "readonly"> 
    toDbTrxReadWrite(stores: string[]): IDBPTransaction<ChaintracksStorageIdbSchema, string[], "readwrite"> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase), [ChaintracksStorageBulkFileApi](./services.md#interface-chaintracksstoragebulkfileapi), [ChaintracksStorageIdbOptions](./services.md#interface-chaintracksstorageidboptions), [ChaintracksStorageIdbSchema](./services.md#interface-chaintracksstorageidbschema), [HeightRange](./services.md#class-heightrange), [InsertHeaderResult](./services.md#type-insertheaderresult), [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method deleteOlderLiveBlockHeaders

Delete live headers with height less or equal to `maxHeight`

Set existing headers with previousHeaderId value set to the headerId value of
a header which is to be deleted to null.

```ts
override async deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number> 
```

Returns

number of deleted records

Argument Details

+ **maxHeight**
  + delete all records with less or equal `height`

###### Method findChainTipHeader

```ts
override async findChainTipHeader(): Promise<LiveBlockHeader> 
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

Returns

the active chain tip header

Throws

an error if there is no tip.

###### Method findChainTipHeaderOrUndefined

```ts
override async findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined> 
```
See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

Returns

the active chain tip header

Throws

an error if there is no tip.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksStorageKnex

Implements the ChaintracksStorageApi using Knex.js for both MySql and Sqlite support.
Also see `chaintracksStorageMemory` which leverages Knex support for an in memory database.

```ts
export class ChaintracksStorageKnex extends ChaintracksStorageBase implements ChaintracksStorageBulkFileApi {
    static createStorageKnexOptions(chain: Chain, knex?: Knex): ChaintracksStorageKnexOptions 
    knex: Knex;
    _dbtype?: DBType;
    bulkFilesTableName: string = "bulk_files";
    headerTableName: string = `live_headers`;
    constructor(options: ChaintracksStorageKnexOptions) 
    get dbtype(): DBType 
    override async shutdown(): Promise<void> 
    override async makeAvailable(): Promise<void> 
    override async migrateLatest(): Promise<void> 
    override async dropAllData(): Promise<void> 
    override async destroy(): Promise<void> 
    override async findLiveHeightRange(): Promise<HeightRange> 
    override async findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader> 
    override async findChainTipHeader(): Promise<LiveBlockHeader> 
    override async findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined> 
    async findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null> 
    async findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null> 
    async findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null> 
    async deleteBulkFile(fileId: number): Promise<number> 
    async insertBulkFile(file: BulkHeaderFileInfo): Promise<number> 
    async updateBulkFile(fileId: number, file: BulkHeaderFileInfo): Promise<number> 
    async getBulkFiles(): Promise<BulkHeaderFileInfo[]> 
    dbTypeSubstring(source: string, fromOffset: number, forLength?: number) 
    async getBulkFileData(fileId: number, offset?: number, length?: number): Promise<Uint8Array | undefined> 
    async insertHeader(header: BlockHeader): Promise<InsertHeaderResult> 
    async findMaxHeaderId(): Promise<number> 
    override async deleteLiveBlockHeaders(): Promise<void> 
    override async deleteBulkBlockHeaders(): Promise<void> 
    async deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number> 
    async getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]> 
    concatSerializedHeaders(bufs: number[][]): number[] 
    async liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [Chain](./client.md#type-chain), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase), [ChaintracksStorageBulkFileApi](./services.md#interface-chaintracksstoragebulkfileapi), [ChaintracksStorageKnexOptions](./services.md#interface-chaintracksstorageknexoptions), [DBType](./storage.md#type-dbtype), [HeightRange](./services.md#class-heightrange), [InsertHeaderResult](./services.md#type-insertheaderresult), [LiveBlockHeader](./services.md#interface-liveblockheader)

###### Method insertHeader

```ts
async insertHeader(header: BlockHeader): Promise<InsertHeaderResult> 
```
See also: [BlockHeader](./client.md#interface-blockheader), [InsertHeaderResult](./services.md#type-insertheaderresult)

Returns

details of conditions found attempting to insert header

Argument Details

+ **header**
  + Header to attempt to add to live storage.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksStorageNoDb

```ts
export class ChaintracksStorageNoDb extends ChaintracksStorageBase {
    static mainData: ChaintracksNoDbData = {
        chain: "main",
        liveHeaders: new Map<number, LiveBlockHeader>(),
        maxHeaderId: 0,
        tipHeaderId: 0,
        hashToHeaderId: new Map<string, number>()
    };
    static testData: ChaintracksNoDbData = {
        chain: "test",
        liveHeaders: new Map<number, LiveBlockHeader>(),
        maxHeaderId: 0,
        tipHeaderId: 0,
        hashToHeaderId: new Map<string, number>()
    };
    constructor(options: ChaintracksStorageNoDbOptions) 
    override async destroy(): Promise<void> 
    async getData(): Promise<ChaintracksNoDbData> 
    override async deleteLiveBlockHeaders(): Promise<void> 
    override async deleteOlderLiveBlockHeaders(maxHeight: number): Promise<number> 
    override async findChainTipHeader(): Promise<LiveBlockHeader> 
    override async findChainTipHeaderOrUndefined(): Promise<LiveBlockHeader | undefined> 
    override async findLiveHeaderForBlockHash(hash: string): Promise<LiveBlockHeader | null> 
    override async findLiveHeaderForHeaderId(headerId: number): Promise<LiveBlockHeader> 
    override async findLiveHeaderForHeight(height: number): Promise<LiveBlockHeader | null> 
    override async findLiveHeaderForMerkleRoot(merkleRoot: string): Promise<LiveBlockHeader | null> 
    override async findLiveHeightRange(): Promise<HeightRange> 
    override async findMaxHeaderId(): Promise<number> 
    override async liveHeadersForBulk(count: number): Promise<LiveBlockHeader[]> 
    override async getLiveHeaders(range: HeightRange): Promise<LiveBlockHeader[]> 
    override async insertHeader(header: BlockHeader): Promise<InsertHeaderResult> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [ChaintracksStorageBase](./services.md#class-chaintracksstoragebase), [ChaintracksStorageNoDbOptions](./services.md#interface-chaintracksstoragenodboptions), [HeightRange](./services.md#class-heightrange), [InsertHeaderResult](./services.md#type-insertheaderresult), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ChaintracksWritableFile

```ts
export class ChaintracksWritableFile implements ChaintracksWritableFileApi {
    path: string;
    parsedPath: Path.ParsedPath;
    f: fs.FileHandle;
    foldersEnsured: boolean = false;
    static async openAsWritable(path: string): Promise<ChaintracksWritableFile> 
    async close(): Promise<void> 
    async ensureFoldersExist(): Promise<void> 
    async append(data: Uint8Array): Promise<void> 
}
```

See also: [ChaintracksWritableFileApi](./services.md#interface-chaintrackswritablefileapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: HeightRange

Represents a range of block heights.

Operations support integrating contiguous batches of headers,

```ts
export class HeightRange implements HeightRangeApi {
    constructor(public minHeight: number, public maxHeight: number) 
    static readonly empty = new HeightRange(0, -1);
    get isEmpty() 
    static from(headers: BlockHeader[]): HeightRange 
    get length() 
    toString(): string 
    contains(range: HeightRange | number) 
    intersect(range: HeightRange) 
    union(range: HeightRange) 
    subtract(range: HeightRange) 
    above(range: HeightRange) 
    copy(): HeightRange 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [HeightRangeApi](./services.md#interface-heightrangeapi)

###### Property empty

All ranges where maxHeight is less than minHeight are considered empty.
The canonical empty range is (0, -1).

```ts
static readonly empty = new HeightRange(0, -1)
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method above

If `range` is not empty and this is not empty, returns a new range minHeight
replaced by to range.maxHeight + 1.

Otherwise returns a copy of this range.

This returns the portion of this range that is strictly above `range`.

```ts
above(range: HeightRange) 
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method contains

```ts
contains(range: HeightRange | number) 
```
See also: [HeightRange](./services.md#class-heightrange)

Returns

true if `range` is entirely within this range.

Argument Details

+ **range**
  + HeightRange or single height value.

###### Method copy

Return a copy of this range.

```ts
copy(): HeightRange 
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method from

```ts
static from(headers: BlockHeader[]): HeightRange 
```
See also: [BlockHeader](./client.md#interface-blockheader), [HeightRange](./services.md#class-heightrange)

Returns

range of height values from the given headers, or the empty range if there are no headers.

Argument Details

+ **headers**
  + an array of objects with a non-negative integer `height` property.

###### Method intersect

Return the intersection with another height range.

Intersection with an empty range is always empty.

The result is always a single, possibly empty, range.

```ts
intersect(range: HeightRange) 
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method subtract

Returns `range` subtracted from this range.

Throws an error if the subtraction would create two disjoint ranges.

```ts
subtract(range: HeightRange) 
```
See also: [HeightRange](./services.md#class-heightrange)

###### Method toString

function toString() { [native code] }

```ts
toString(): string 
```

Returns

an easy to read string representation of the height range.

###### Method union

Return the union with another height range.

Only valid if the two ranges overlap or touch, or one is empty.

Throws an error if the union would create two disjoint ranges.

```ts
union(range: HeightRange) 
```
See also: [HeightRange](./services.md#class-heightrange)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: LiveIngestorBase

```ts
export abstract class LiveIngestorBase implements LiveIngestorApi {
    static createLiveIngestorBaseOptions(chain: Chain) 
    chain: Chain;
    log: (...args: any[]) => void = () => ;
    constructor(options: LiveIngestorBaseOptions) 
    async shutdown(): Promise<void> { }
    async setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void> 
    storage(): ChaintracksStorageApi 
    abstract getHeaderByHash(hash: string): Promise<BlockHeader | undefined>;
    abstract startListening(liveHeaders: BlockHeader[]): Promise<void>;
    abstract stopListening(): void;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi), [LiveIngestorApi](./services.md#interface-liveingestorapi), [LiveIngestorBaseOptions](./services.md#interface-liveingestorbaseoptions)

###### Method getHeaderByHash

Called to retrieve a missing block header,
when the previousHash of a new header is unknown.

```ts
abstract getHeaderByHash(hash: string): Promise<BlockHeader | undefined>
```
See also: [BlockHeader](./client.md#interface-blockheader)

Argument Details

+ **hash**
  + block hash of missing header

###### Method setStorage

Allocate resources.

```ts
async setStorage(storage: ChaintracksStorageApi, log: (...args: any[]) => void): Promise<void> 
```
See also: [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi)

Argument Details

+ **storage**
  + coordinating storage engine.

###### Method shutdown

Release resources.
Override if required.

```ts
async shutdown(): Promise<void> 
```

###### Method startListening

Begin retrieving new block headers.

New headers are pushed onto the liveHeaders array.

Continue waiting for new headers.

Return only when either `stopListening` or `shutdown` are called.

Be prepared to resume listening after `stopListening` but not
after `shutdown`.

```ts
abstract startListening(liveHeaders: BlockHeader[]): Promise<void>
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method stopListening

Causes `startListening` to stop listening for new block headers and return.

```ts
abstract stopListening(): void
```

###### Method storage

```ts
storage(): ChaintracksStorageApi 
```
See also: [ChaintracksStorageApi](./services.md#interface-chaintracksstorageapi)

Returns

coordinating storage engine.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: LiveIngestorWhatsOnChainPoll

Reports new headers by polling periodically.

```ts
export class LiveIngestorWhatsOnChainPoll extends LiveIngestorBase {
    static createLiveIngestorWhatsOnChainOptions(chain: Chain): LiveIngestorWhatsOnChainOptions 
    idleWait: number;
    woc: WhatsOnChainServices;
    done: boolean = false;
    constructor(options: LiveIngestorWhatsOnChainOptions) 
    async getHeaderByHash(hash: string): Promise<BlockHeader | undefined> 
    async startListening(liveHeaders: BlockHeader[]): Promise<void> 
    stopListening(): void 
    override async shutdown(): Promise<void> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [LiveIngestorBase](./services.md#class-liveingestorbase), [LiveIngestorWhatsOnChainOptions](./services.md#interface-liveingestorwhatsonchainoptions), [WhatsOnChainServices](./services.md#class-whatsonchainservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: LiveIngestorWhatsOnChainWs

```ts
export class LiveIngestorWhatsOnChainWs extends LiveIngestorBase {
    static createLiveIngestorWhatsOnChainOptions(chain: Chain): LiveIngestorWhatsOnChainOptions 
    idleWait: number;
    woc: WhatsOnChainServices;
    stopNewListenersToken: StopListenerToken = { stop: undefined };
    constructor(options: LiveIngestorWhatsOnChainOptions) 
    async getHeaderByHash(hash: string): Promise<BlockHeader | undefined> 
    async startListening(liveHeaders: BlockHeader[]): Promise<void> 
    stopListening(): void 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [LiveIngestorBase](./services.md#class-liveingestorbase), [LiveIngestorWhatsOnChainOptions](./services.md#interface-liveingestorwhatsonchainoptions), [StopListenerToken](./services.md#type-stoplistenertoken), [WhatsOnChainServices](./services.md#class-whatsonchainservices)

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
export class Services implements WalletServices {
    static createDefaultOptions(chain: Chain): WalletServicesOptions 
    options: WalletServicesOptions;
    whatsonchain: WhatsOnChain;
    arcTaal: ARC;
    arcGorillaPool?: ARC;
    bitails: Bitails;
    getMerklePathServices: ServiceCollection<GetMerklePathService>;
    getRawTxServices: ServiceCollection<GetRawTxService>;
    postBeefServices: ServiceCollection<PostBeefService>;
    getUtxoStatusServices: ServiceCollection<GetUtxoStatusService>;
    getStatusForTxidsServices: ServiceCollection<GetStatusForTxidsService>;
    getScriptHashHistoryServices: ServiceCollection<GetScriptHashHistoryService>;
    updateFiatExchangeRateServices: ServiceCollection<UpdateFiatExchangeRateService>;
    chain: Chain;
    constructor(optionsOrChain: Chain | WalletServicesOptions) 
    getServicesCallHistory(reset?: boolean): ServicesCallHistory 
    async getChainTracker(): Promise<ChainTracker> 
    async getBsvExchangeRate(): Promise<number> 
    async getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number> 
    get getProofsCount() 
    get getRawTxsCount() 
    get postBeefServicesCount() 
    get getUtxoStatsCount() 
    async getStatusForTxids(txids: string[], useNext?: boolean): Promise<GetStatusForTxidsResult> 
    hashOutputScript(script: string): string 
    async isUtxo(output: TableOutput): Promise<boolean> 
    async getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, outpoint?: string, useNext?: boolean, logger?: WalletLoggerInterface): Promise<GetUtxoStatusResult> 
    async getScriptHashHistory(hash: string, useNext?: boolean, logger?: WalletLoggerInterface): Promise<GetScriptHashHistoryResult> 
    postBeefMode: "PromiseAll" | "UntilSuccess" = "UntilSuccess";
    async postBeef(beef: Beef, txids: string[], logger?: WalletLoggerInterface): Promise<PostBeefResult[]> 
    async getRawTx(txid: string, useNext?: boolean): Promise<GetRawTxResult> 
    async invokeChaintracksWithRetry<R>(method: () => Promise<R>): Promise<R> 
    async getHeaderForHeight(height: number): Promise<number[]> 
    async getHeight(): Promise<number> 
    async hashToHeader(hash: string): Promise<BlockHeader> 
    async getMerklePath(txid: string, useNext?: boolean, logger?: WalletLoggerInterface): Promise<GetMerklePathResult> 
    targetCurrencies = ["USD", "GBP", "EUR"];
    async updateFiatExchangeRates(rates?: FiatExchangeRates, updateMsecs?: number): Promise<FiatExchangeRates> 
    async nLockTimeIsFinal(tx: string | number[] | BsvTransaction | number): Promise<boolean> 
    async getBeefForTxid(txid: string): Promise<Beef> 
}
```

See also: [ARC](./services.md#class-arc), [Bitails](./services.md#class-bitails), [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [FiatExchangeRates](./client.md#interface-fiatexchangerates), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [GetMerklePathService](./client.md#type-getmerklepathservice), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetRawTxService](./client.md#type-getrawtxservice), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetScriptHashHistoryService](./client.md#type-getscripthashhistoryservice), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetStatusForTxidsService](./client.md#type-getstatusfortxidsservice), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [GetUtxoStatusService](./client.md#type-getutxostatusservice), [PostBeefResult](./client.md#interface-postbeefresult), [PostBeefService](./client.md#type-postbeefservice), [ServiceCollection](./services.md#class-servicecollection), [ServicesCallHistory](./client.md#type-servicescallhistory), [TableOutput](./storage.md#interface-tableoutput), [UpdateFiatExchangeRateService](./client.md#type-updatefiatexchangerateservice), [WalletServices](./client.md#interface-walletservices), [WalletServicesOptions](./client.md#interface-walletservicesoptions), [WhatsOnChain](./services.md#class-whatsonchain), [getBeefForTxid](./services.md#function-getbeeffortxid), [logger](./client.md#variable-logger)

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
##### Class: SingleWriterMultiReaderLock

A reader-writer lock to manage concurrent access.
Allows multiple readers or one writer at a time.

```ts
export class SingleWriterMultiReaderLock {
    async withReadLock<T>(fn: () => Promise<T>): Promise<T> 
    async withWriteLock<T>(fn: () => Promise<T>): Promise<T> 
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WhatsOnChain

```ts
export class WhatsOnChain extends WhatsOnChainNoServices {
    services: Services;
    constructor(chain: Chain = "main", config: WhatsOnChainConfig = {}, services?: Services) 
    async getMerklePath(txid: string, services: WalletServices): Promise<GetMerklePathResult> 
}
```

See also: [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [Services](./services.md#class-services), [WalletServices](./client.md#interface-walletservices), [WhatsOnChainNoServices](./services.md#class-whatsonchainnoservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WhatsOnChainNoServices

```ts
export class WhatsOnChainNoServices extends SdkWhatsOnChain {
    constructor(chain: Chain = "main", config: WhatsOnChainConfig = {}) 
    async getStatusForTxids(txids: string[]): Promise<GetStatusForTxidsResult> 
    async getTxPropagation(txid: string): Promise<number> 
    async getRawTx(txid: string): Promise<string | undefined> 
    async getRawTxResult(txid: string): Promise<GetRawTxResult> 
    async postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult> 
    async postRawTx(rawTx: HexString): Promise<PostTxResultForTxid> 
    async updateBsvExchangeRate(rate?: BsvExchangeRate, updateMsecs?: number): Promise<BsvExchangeRate> 
    async getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, outpoint?: string): Promise<GetUtxoStatusResult> 
    async getScriptHashConfirmedHistory(hash: string): Promise<GetScriptHashHistoryResult> 
    async getScriptHashUnconfirmedHistory(hash: string): Promise<GetScriptHashHistoryResult> 
    async getScriptHashHistory(hash: string): Promise<GetScriptHashHistoryResult> 
    async getBlockHeaderByHash(hash: string): Promise<BlockHeader | undefined> 
    async getChainInfo(): Promise<WocChainInfo> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [BsvExchangeRate](./client.md#interface-bsvexchangerate), [Chain](./client.md#type-chain), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [PostBeefResult](./client.md#interface-postbeefresult), [PostTxResultForTxid](./client.md#interface-posttxresultfortxid), [SdkWhatsOnChain](./services.md#class-sdkwhatsonchain), [WocChainInfo](./services.md#interface-wocchaininfo)

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
See also: [BlockHeader](./client.md#interface-blockheader)

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
async getStatusForTxids(txids: string[]): Promise<GetStatusForTxidsResult> 
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
async postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult> 
```
See also: [PostBeefResult](./client.md#interface-postbeefresult)

###### Method postRawTx

```ts
async postRawTx(rawTx: HexString): Promise<PostTxResultForTxid> 
```
See also: [PostTxResultForTxid](./client.md#interface-posttxresultfortxid)

Returns

txid returned by transaction processor of transaction broadcast

Argument Details

+ **rawTx**
  + raw transaction to broadcast as hex string

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WhatsOnChainServices

```ts
export class WhatsOnChainServices {
    static createWhatsOnChainServicesOptions(chain: Chain): WhatsOnChainServicesOptions 
    static chainInfo: (WocChainInfo | undefined)[] = [];
    static chainInfoTime: (Date | undefined)[] = [];
    static chainInfoMsecs: number[] = [];
    chain: Chain;
    woc: WhatsOnChain;
    constructor(public options: WhatsOnChainServicesOptions) 
    async getHeaderByHash(hash: string): Promise<BlockHeader | undefined> 
    async getChainInfo(): Promise<WocChainInfo> 
    async getChainTipHeight(): Promise<number> 
    async getChainTipHash(): Promise<string> 
    async getHeaders(fetch?: ChaintracksFetchApi): Promise<WocGetHeadersHeader[]> 
    async getHeaderByteFileLinks(neededRange: HeightRange, fetch?: ChaintracksFetchApi): Promise<GetHeaderByteFileLinksResult[]> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [GetHeaderByteFileLinksResult](./services.md#interface-getheaderbytefilelinksresult), [HeightRange](./services.md#class-heightrange), [WhatsOnChain](./services.md#class-whatsonchain), [WhatsOnChainServicesOptions](./services.md#interface-whatsonchainservicesoptions), [WocChainInfo](./services.md#interface-wocchaininfo), [WocGetHeadersHeader](./services.md#interface-wocgetheadersheader)

###### Method getHeaders

```ts
async getHeaders(fetch?: ChaintracksFetchApi): Promise<WocGetHeadersHeader[]> 
```
See also: [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [WocGetHeadersHeader](./services.md#interface-wocgetheadersheader)

Returns

returns the last 10 block headers including height, size, chainwork...

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Functions

| | | |
| --- | --- | --- |
| [WocHeadersBulkListener](#function-wocheadersbulklistener) | [deserializeBaseBlockHeader](#function-deserializebaseblockheader) | [sha256HashOfBinaryFile](#function-sha256hashofbinaryfile) |
| [WocHeadersBulkListener_test](#function-wocheadersbulklistener_test) | [deserializeBaseBlockHeaders](#function-deserializebaseblockheaders) | [subWork](#function-subwork) |
| [WocHeadersLiveListener](#function-wocheaderslivelistener) | [deserializeBlockHeader](#function-deserializeblockheader) | [swapByteOrder](#function-swapbyteorder) |
| [WocHeadersLiveListener_test](#function-wocheaderslivelistener_test) | [deserializeBlockHeaders](#function-deserializeblockheaders) | [toBinaryBaseBlockHeader](#function-tobinarybaseblockheader) |
| [addWork](#function-addwork) | [genesisBuffer](#function-genesisbuffer) | [updateChaintracksFiatExchangeRates](#function-updatechaintracksfiatexchangerates) |
| [arcDefaultUrl](#function-arcdefaulturl) | [genesisHeader](#function-genesisheader) | [updateExchangeratesapi](#function-updateexchangeratesapi) |
| [arcGorillaPoolUrl](#function-arcgorillapoolurl) | [getBeefForTxid](#function-getbeeffortxid) | [validBulkHeaderFilesByFileHash](#function-validbulkheaderfilesbyfilehash) |
| [blockHash](#function-blockhash) | [getExchangeRatesIo](#function-getexchangeratesio) | [validateAgainstDirtyHashes](#function-validateagainstdirtyhashes) |
| [convertBitsToTarget](#function-convertbitstotarget) | [getWhatsOnChainBlockHeaderByHash](#function-getwhatsonchainblockheaderbyhash) | [validateBufferOfHeaders](#function-validatebufferofheaders) |
| [convertBitsToWork](#function-convertbitstowork) | [isBaseBlockHeader](#function-isbaseblockheader) | [validateBulkFileData](#function-validatebulkfiledata) |
| [convertBufferToUint32](#function-convertbuffertouint32) | [isBlockHeader](#function-isblockheader) | [validateGenesisHeader](#function-validategenesisheader) |
| [convertUint32ToBuffer](#function-convertuint32tobuffer) | [isKnownValidBulkHeaderFile](#function-isknownvalidbulkheaderfile) | [validateHeaderDifficulty](#function-validateheaderdifficulty) |
| [convertWocToBlockHeaderHex](#function-convertwoctoblockheaderhex) | [isLive](#function-islive) | [validateHeaderFormat](#function-validateheaderformat) |
| [createDefaultIdbChaintracksOptions](#function-createdefaultidbchaintracksoptions) | [isLiveBlockHeader](#function-isliveblockheader) | [validateScriptHash](#function-validatescripthash) |
| [createDefaultKnexChaintracksOptions](#function-createdefaultknexchaintracksoptions) | [isMoreWork](#function-ismorework) | [wocGetHeadersHeaderToBlockHeader](#function-wocgetheadersheadertoblockheader) |
| [createDefaultNoDbChaintracksOptions](#function-createdefaultnodbchaintracksoptions) | [readUInt32BE](#function-readuint32be) | [workBNtoBuffer](#function-workbntobuffer) |
| [createDefaultWalletServicesOptions](#function-createdefaultwalletservicesoptions) | [readUInt32LE](#function-readuint32le) | [writeUInt32BE](#function-writeuint32be) |
| [createIdbChaintracks](#function-createidbchaintracks) | [selectBulkHeaderFiles](#function-selectbulkheaderfiles) | [writeUInt32LE](#function-writeuint32le) |
| [createKnexChaintracks](#function-createknexchaintracks) | [serializeBaseBlockHeader](#function-serializebaseblockheader) |  |
| [createNoDbChaintracks](#function-createnodbchaintracks) | [serializeBaseBlockHeaders](#function-serializebaseblockheaders) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Function: WocHeadersBulkListener

High speed WebSocket based based old block header listener

```ts
export async function WocHeadersBulkListener(fromHeight: number, toHeight: number, enqueue: (header: BlockHeader) => void, error: (code: number, message: string) => boolean, stop: StopListenerToken, chain: Chain, logger: (...args: any[]) => void = () => { }, idleWait = 5000): Promise<boolean> 
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [StopListenerToken](./services.md#type-stoplistenertoken), [logger](./client.md#variable-logger)

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
export async function WocHeadersLiveListener(enqueue: (header: BlockHeader) => void, error: (code: number, message: string) => boolean, stop: StopListenerToken, chain: Chain, logger: (...args: any[]) => void, idleWait = 100000): Promise<boolean> 
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [StopListenerToken](./services.md#type-stoplistenertoken), [logger](./client.md#variable-logger)

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
##### Function: addWork

Add two Buffer encoded chainwork values

```ts
export function addWork(work1: string, work2: string): string 
```

Returns

Sum of work1 + work2 as Buffer encoded chainWork value

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: arcDefaultUrl

```ts
export function arcDefaultUrl(chain: Chain): string 
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: arcGorillaPoolUrl

```ts
export function arcGorillaPoolUrl(chain: Chain): string | undefined 
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: blockHash

Computes double sha256 hash of bitcoin block header
bytes are reversed to bigendian order

If header is a Buffer, it is required to 80 bytes long
and in standard block header serialized encoding.

```ts
export function blockHash(header: BaseBlockHeader | number[] | Uint8Array): string {
    const a = !Array.isArray(header) && !(header instanceof Uint8Array) ? serializeBaseBlockHeader(header) : header;
    if (a.length !== 80)
        throw new Error("Block header must be 80 bytes long.");
    return asString(doubleSha256BE(a));
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [asString](./client.md#function-asstring), [doubleSha256BE](./client.md#function-doublesha256be), [serializeBaseBlockHeader](./services.md#function-serializebaseblockheader)

Returns

doule sha256 hash of header bytes reversed

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertBitsToTarget

Computes "target" value for 4 byte Bitcoin block header "bits" value.

```ts
export function convertBitsToTarget(bits: number | number[]): BigNumber 
```

Returns

32 byte Buffer with "target" value

Argument Details

+ **bits**
  + number or converted from Buffer using `readUint32LE`

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertBitsToWork

Computes "chainWork" value for 4 byte Bitcoin block header "bits" value.

```ts
export function convertBitsToWork(bits: number | number[]): string 
```

Returns

32 byte Buffer with "chainWork" value

Argument Details

+ **bits**
  + number or converted from Buffer using `readUint32LE`

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertBufferToUint32

```ts
export function convertBufferToUint32(buffer: number[] | Uint8Array, littleEndian = true): number {
    const a = littleEndian ? buffer : buffer.slice().reverse();
    const n = a[0] | (a[1] << 8) | (a[2] << 16) | (a[3] << 24);
    return n;
}
```

Returns

a number value in the Uint32 value range

Argument Details

+ **buffer**
  + four byte buffer with Uint32 number encoded
+ **littleEndian**
  + true for little-endian byte order in Buffer

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertUint32ToBuffer

```ts
export function convertUint32ToBuffer(n: number, littleEndian = true): number[] {
    const a = [
        n & 255,
        (n >> 8) & 255,
        (n >> 16) & 255,
        (n >> 24) & 255
    ];
    return littleEndian ? a : a.reverse();
}
```

Returns

four byte buffer with Uint32 number encoded

Argument Details

+ **num**
  + a number value in the Uint32 value range
+ **littleEndian**
  + true for little-endian byte order in Buffer

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertWocToBlockHeaderHex

```ts
export function convertWocToBlockHeaderHex(woc: WocHeader): BlockHeader 
```

See also: [BlockHeader](./client.md#interface-blockheader), [WocHeader](./services.md#interface-wocheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultIdbChaintracksOptions

```ts
export function createDefaultIdbChaintracksOptions(chain: Chain, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): ChaintracksOptions 
```

See also: [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksOptions](./services.md#interface-chaintracksoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultKnexChaintracksOptions

```ts
export function createDefaultKnexChaintracksOptions(chain: Chain, rootFolder: string = "./data/", knexConfig?: Knex.Config, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): ChaintracksOptions 
```

See also: [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksOptions](./services.md#interface-chaintracksoptions)

Argument Details

+ **rootFolder**
  + defaults to "./data/"

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultNoDbChaintracksOptions

```ts
export function createDefaultNoDbChaintracksOptions(chain: Chain, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): ChaintracksOptions 
```

See also: [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksOptions](./services.md#interface-chaintracksoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultWalletServicesOptions

```ts
export function createDefaultWalletServicesOptions(chain: Chain, arcCallbackUrl?: string, arcCallbackToken?: string, taalArcApiKey?: string, gorillaPoolArcApiKey?: string, bitailsApiKey?: string, deploymentId?: string, chaintracks?: ChaintracksClientApi): WalletServicesOptions 
```

See also: [Chain](./client.md#type-chain), [ChaintracksClientApi](./services.md#interface-chaintracksclientapi), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createIdbChaintracks

```ts
export async function createIdbChaintracks(chain: Chain, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): Promise<{
    chain: Chain;
    maxPerFile: number;
    fetch: ChaintracksFetchApi;
    storage: ChaintracksStorageIdb;
    chaintracks: Chaintracks;
    available: Promise<void>;
}> 
```

See also: [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksStorageIdb](./services.md#class-chaintracksstorageidb)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createKnexChaintracks

```ts
export async function createKnexChaintracks(chain: Chain, rootFolder: string = "./data/", knexConfig?: Knex.Config, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): Promise<{
    chain: Chain;
    maxPerFile: number;
    fetch: ChaintracksFetchApi;
    storage: ChaintracksStorageKnex;
    chaintracks: Chaintracks;
    available: Promise<void>;
}> 
```

See also: [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksStorageKnex](./services.md#class-chaintracksstorageknex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createNoDbChaintracks

```ts
export async function createNoDbChaintracks(chain: Chain, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): Promise<{
    chain: Chain;
    maxPerFile: number;
    fetch: ChaintracksFetchApi;
    storage: ChaintracksStorageNoDb;
    chaintracks: Chaintracks;
    available: Promise<void>;
}> 
```

See also: [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksStorageNoDb](./services.md#class-chaintracksstoragenodb)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: deserializeBaseBlockHeader

Deserialize a BaseBlockHeader from an 80 byte buffer

```ts
export function deserializeBaseBlockHeader(buffer: number[] | Uint8Array, offset = 0): BaseBlockHeader {
    const reader = ReaderUint8Array.makeReader(buffer, offset);
    const header: BaseBlockHeader = {
        version: reader.readUInt32LE(),
        previousHash: asString(reader.read(32).reverse()),
        merkleRoot: asString(reader.read(32).reverse()),
        time: reader.readUInt32LE(),
        bits: reader.readUInt32LE(),
        nonce: reader.readUInt32LE()
    };
    return header;
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [ReaderUint8Array](./client.md#class-readeruint8array), [asString](./client.md#function-asstring), [readUInt32LE](./services.md#function-readuint32le)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: deserializeBaseBlockHeaders

```ts
export function deserializeBaseBlockHeaders(buffer: number[] | Uint8Array, offset = 0, count?: number | undefined): BaseBlockHeader[] 
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: deserializeBlockHeader

```ts
export function deserializeBlockHeader(buffer: number[] | Uint8Array, offset = 0, height: number): BlockHeader 
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: deserializeBlockHeaders

```ts
export function deserializeBlockHeaders(firstHeight: number, buffer: number[] | Uint8Array, offset = 0, count?: number | undefined): BlockHeader[] 
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: genesisBuffer

Returns the genesis block for the specified chain.

```ts
export function genesisBuffer(chain: Chain): number[] {
    return serializeBaseBlockHeader(genesisHeader(chain));
}
```

See also: [Chain](./client.md#type-chain), [genesisHeader](./services.md#function-genesisheader), [serializeBaseBlockHeader](./services.md#function-serializebaseblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: genesisHeader

Returns the genesis block for the specified chain.

```ts
export function genesisHeader(chain: Chain): BlockHeader {
    return chain === "main"
        ? {
            version: 1,
            previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
            merkleRoot: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
            time: 1231006505,
            bits: 486604799,
            nonce: 2083236893,
            height: 0,
            hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
        }
        : {
            version: 1,
            previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
            merkleRoot: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
            time: 1296688602,
            bits: 486604799,
            nonce: 414098458,
            height: 0,
            hash: "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943"
        };
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain)

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
export async function getWhatsOnChainBlockHeaderByHash(hash: string, chain: Chain = "main", apiKey?: string): Promise<BlockHeader | undefined> 
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isBaseBlockHeader

Type guard function.

```ts
export function isBaseBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is BaseBlockHeader {
    return typeof header.previousHash === "string";
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isBlockHeader

Type guard function.

```ts
export function isBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
    return "height" in header && typeof header.previousHash === "string";
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isKnownValidBulkHeaderFile

Compares meta data received for a bulk header file `vbf` to known
valid bulk header files based on their `fileHash`.

Short circuits both the retreival and validation of individual headers,
only a single SHA256 hash of the aggregate data needs to be compared.

The standard file size for historic block headers is 100,000 per file
which results in a many orders of magnitude initialization speedup.

The following properties must match:
- `firstHeight`
- `count`
- `prevChainWork`
- `prevHash`
- `lastChainWork`
- `lastHash`
- `chain`

```ts
export function isKnownValidBulkHeaderFile(vbf: BulkHeaderFileInfo): boolean {
    if (!vbf || !vbf.fileHash)
        return false;
    const bf = validBulkHeaderFilesByFileHash()[vbf.fileHash];
    if (!bf ||
        bf.firstHeight !== vbf.firstHeight ||
        bf.count !== vbf.count ||
        bf.prevChainWork !== vbf.prevChainWork ||
        bf.prevHash !== vbf.prevHash ||
        bf.lastChainWork !== vbf.lastChainWork ||
        bf.lastHash !== vbf.lastHash ||
        bf.chain !== vbf.chain) {
        return false;
    }
    return true;
}
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [validBulkHeaderFilesByFileHash](./services.md#function-validbulkheaderfilesbyfilehash)

Returns

true iff bulk file meta data (excluding its source) matches a known file.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isLive

Type guard function.

```ts
export function isLive(header: BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
    return (header as LiveBlockHeader).headerId !== undefined;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isLiveBlockHeader

Type guard function.

```ts
export function isLiveBlockHeader(header: BaseBlockHeader | BlockHeader | LiveBlockHeader): header is LiveBlockHeader {
    return "chainwork" in header && typeof header.previousHash === "string";
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [BlockHeader](./client.md#interface-blockheader), [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isMoreWork

Returns true if work1 is more work (greater than) work2

```ts
export function isMoreWork(work1: string, work2: string): boolean 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: readUInt32BE

```ts
export function readUInt32BE(a: number[] | Uint8Array, offset: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: readUInt32LE

```ts
export function readUInt32LE(a: number[] | Uint8Array, offset: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: selectBulkHeaderFiles

```ts
export function selectBulkHeaderFiles(files: BulkHeaderFileInfo[], chain: Chain, maxPerFile: number): BulkHeaderFileInfo[] 
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: serializeBaseBlockHeader

Serializes a block header as an 80 byte Buffer.
The exact serialized format is defined in the Bitcoin White Paper
such that computing a double sha256 hash of the buffer computes
the block hash for the header.

```ts
export function serializeBaseBlockHeader(header: BaseBlockHeader, buffer?: number[], offset?: number): number[] {
    const writer = new Utils.Writer();
    writer.writeUInt32LE(header.version);
    writer.write(asArray(header.previousHash).reverse());
    writer.write(asArray(header.merkleRoot).reverse());
    writer.writeUInt32LE(header.time);
    writer.writeUInt32LE(header.bits);
    writer.writeUInt32LE(header.nonce);
    const data = writer.toArray();
    if (buffer) {
        offset ||= 0;
        for (let i = 0; i < data.length; i++) {
            if (offset + i >= buffer.length) {
                throw new Error(`Buffer overflow at offset ${offset + i} for data length ${data.length}`);
            }
            buffer[offset + i] = data[i];
        }
    }
    return data;
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [asArray](./client.md#function-asarray), [writeUInt32LE](./services.md#function-writeuint32le)

Returns

80 byte Buffer

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: serializeBaseBlockHeaders

```ts
export function serializeBaseBlockHeaders(headers: BlockHeader[]): Uint8Array 
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: sha256HashOfBinaryFile

Computes sha256 hash of file contents read as bytes with no encoding.

```ts
export async function sha256HashOfBinaryFile(fs: ChaintracksFsApi, filepath: string, bufferSize = 80000): Promise<{
    hash: string;
    length: number;
}> 
```

See also: [ChaintracksFsApi](./services.md#interface-chaintracksfsapi)

Returns

`{hash, length}` where `hash` is base64 string form of file hash and `length` is file length in bytes.

Argument Details

+ **filepath**
  + Full filepath to file.
+ **bufferSize**
  + Optional read buffer size to use. Defaults to 80,000 bytes. Currently ignored.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: subWork

Subtract Buffer encoded chainwork values

```ts
export function subWork(work1: string, work2: string): string 
```

Returns

work1 - work2 as Buffer encoded chainWork value

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: swapByteOrder

Returns a copy of a Buffer with byte order reversed.

```ts
export function swapByteOrder(buffer: number[]): number[] {
    return buffer.slice().reverse();
}
```

Returns

new buffer with byte order reversed.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: toBinaryBaseBlockHeader

Serializes a block header as an 80 byte array.
The exact serialized format is defined in the Bitcoin White Paper
such that computing a double sha256 hash of the array computes
the block hash for the header.

```ts
export function toBinaryBaseBlockHeader(header: BaseBlockHeader): number[] {
    const writer = new Utils.Writer();
    writer.writeUInt32LE(header.version);
    writer.writeReverse(asArray(header.previousHash));
    writer.writeReverse(asArray(header.merkleRoot));
    writer.writeUInt32LE(header.time);
    writer.writeUInt32LE(header.bits);
    writer.writeUInt32LE(header.nonce);
    const r = writer.toArray();
    return r;
}
```

See also: [BaseBlockHeader](./client.md#interface-baseblockheader), [asArray](./client.md#function-asarray), [writeUInt32LE](./services.md#function-writeuint32le)

Returns

80 byte array

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: updateChaintracksFiatExchangeRates

```ts
export async function updateChaintracksFiatExchangeRates(targetCurrencies: string[], options: WalletServicesOptions): Promise<FiatExchangeRates> 
```

See also: [FiatExchangeRates](./client.md#interface-fiatexchangerates), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: updateExchangeratesapi

```ts
export async function updateExchangeratesapi(targetCurrencies: string[], options: WalletServicesOptions): Promise<FiatExchangeRates> 
```

See also: [FiatExchangeRates](./client.md#interface-fiatexchangerates), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validBulkHeaderFilesByFileHash

Hash map of known valid bulk header files by their `fileHash`.

```ts
export function validBulkHeaderFilesByFileHash(): Record<string, BulkHeaderFileInfo> 
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo)

Returns

object where keys are file hashes of known bulk header files.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateAgainstDirtyHashes

Throws Error if blockHash is in the dirtyHashes list.

```ts
export function validateAgainstDirtyHashes(blockHash: string): void 
```

See also: [blockHash](./services.md#function-blockhash)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateBufferOfHeaders

Validate headers contained in an array of bytes. The headers must be consecutive block headers, 80 bytes long,
 where the hash of each header equals the previousHash of the following header.

```ts
export function validateBufferOfHeaders(buffer: Uint8Array, previousHash: string, offset = 0, count = -1, previousChainWork?: string): {
    lastHeaderHash: string;
    lastChainWork: string | undefined;
} 
```

Returns

Header hash of last header validated or previousHash if there where none.

Argument Details

+ **buffer**
  + Buffer of headers to be validated.
+ **previousHash**
  + Expected previousHash of first header.
+ **offset**
  + Optional starting offset within `buffer`.
+ **count**
  + Optional number of headers to validate. Validates to end of buffer if missing.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateBulkFileData

Validates the contents of a bulk header file.

```ts
export async function validateBulkFileData(bf: BulkHeaderFileInfo, prevHash: string, prevChainWork: string, fetch?: ChaintracksFetchApi): Promise<BulkHeaderFileInfo> 
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi)

Returns

Validated BulkHeaderFileInfo with `validated` set to true.

Argument Details

+ **bf**
  + BulkHeaderFileInfo containing `data` to validate.
+ **prevHash**
  + Required previous header hash.
+ **prevChainWork**
  + Required previous chain work.
+ **fetch**
  + Optional ChaintracksFetchApi instance for fetching data.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateGenesisHeader

Verifies that buffer begins with valid genesis block header for the specified chain.

```ts
export function validateGenesisHeader(buffer: Uint8Array, chain: Chain): void 
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateHeaderDifficulty

Ensures that a header has a valid proof-of-work
Requires chain is 'main'

```ts
export function validateHeaderDifficulty(hash: Buffer, bits: number) 
```

Returns

true if the header is valid

Argument Details

+ **header**
  + The header to validate

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateHeaderFormat

Given a block header, ensures that its format is correct. This does not
check its difficulty or validity relative to the chain of headers.

Throws on format errors.

```ts
export function validateHeaderFormat(header: BlockHeader): void 
```

See also: [BlockHeader](./client.md#interface-blockheader)

Returns

true if the header is correctly formatted

Argument Details

+ **The**
  + header to validate

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateScriptHash

```ts
export function validateScriptHash(output: string, outputFormat?: GetUtxoStatusOutputFormat): string 
```

See also: [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: wocGetHeadersHeaderToBlockHeader

```ts
export function wocGetHeadersHeaderToBlockHeader(h: WocGetHeadersHeader): BlockHeader 
```

See also: [BlockHeader](./client.md#interface-blockheader), [WocGetHeadersHeader](./services.md#interface-wocgetheadersheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: workBNtoBuffer

```ts
export function workBNtoBuffer(work: BigNumber): string 
```

Returns

Converted chainWork value from BN to hex string of 32 bytes.

Argument Details

+ **work**
  + chainWork as a BigNumber

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: writeUInt32BE

```ts
export function writeUInt32BE(n: number, a: number[] | Uint8Array, offset: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: writeUInt32LE

```ts
export function writeUInt32LE(n: number, a: number[] | Uint8Array, offset: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Types

| |
| --- |
| [EnqueueHandler](#type-enqueuehandler) |
| [ErrorHandler](#type-errorhandler) |
| [HeaderListener](#type-headerlistener) |
| [InsertHeaderResult](#type-insertheaderresult) |
| [ReorgListener](#type-reorglistener) |
| [StopListenerToken](#type-stoplistenertoken) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Type: EnqueueHandler

```ts
export type EnqueueHandler = (header: BlockHeader) => void
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ErrorHandler

return true to ignore error, false to close service connection

```ts
export type ErrorHandler = (code: number, message: string) => boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: HeaderListener

```ts
export type HeaderListener = (header: BlockHeader) => void
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: InsertHeaderResult

```ts
export type InsertHeaderResult = {
    added: boolean;
    dupe: boolean;
    isActiveTip: boolean;
    reorgDepth: number;
    priorTip: LiveBlockHeader | undefined;
    deactivatedHeaders: LiveBlockHeader[];
    noPrev: boolean;
    badPrev: boolean;
    noActiveAncestor: boolean;
    noTip: boolean;
}
```

See also: [LiveBlockHeader](./services.md#interface-liveblockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ReorgListener

```ts
export type ReorgListener = (depth: number, oldTip: BlockHeader, newTip: BlockHeader, deactivatedHeaders?: BlockHeader[]) => void
```

See also: [BlockHeader](./client.md#interface-blockheader)

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
#### Variables

| |
| --- |
| [ChaintracksFs](#variable-chaintracksfs) |
| [dirtyHashes](#variable-dirtyhashes) |
| [validBulkHeaderFiles](#variable-validbulkheaderfiles) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Variable: ChaintracksFs

```ts
ChaintracksFs: ChaintracksFsApi = ChaintracksFsStatics
```

See also: [ChaintracksFsApi](./services.md#interface-chaintracksfsapi), [ChaintracksFsStatics](./services.md#class-chaintracksfsstatics)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: dirtyHashes

```ts
dirtyHashes = {
    "00000000000000000019f112ec0a9982926f1258cdcc558dd7c3b7e5dc7fa148": "This is the first header of the invalid SegWit chain.",
    "0000000000000000004626ff6e3b936941d341c5932ece4357eeccac44e6d56c": "This is the first header of the invalid ABC chain."
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: validBulkHeaderFiles

```ts
validBulkHeaderFiles: BulkHeaderFileInfo[] = [
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_0.headers",
        firstHeight: 0,
        prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
        count: 100000,
        lastHash: "000000004956cc2edd1a8caa05eacfa3c69f4c490bfc9ace820257834115ab35",
        fileHash: "gAJPUfI2DfAabJTOBxT1rwy1cS4/QULaQHaQWa1RWNk=",
        lastChainWork: "000000000000000000000000000000000000000000000000004143c00b3d47b8",
        prevChainWork: "0000000000000000000000000000000000000000000000000000000000000000",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_1.headers",
        firstHeight: 100000,
        prevHash: "000000004956cc2edd1a8caa05eacfa3c69f4c490bfc9ace820257834115ab35",
        count: 100000,
        lastHash: "0000000000c470c4a573272aa4a680c93fc4c2f5df8ce9546441796f73277334",
        fileHash: "OIJ010bnIbFobNppJzCNE9jFI1uANz0iNGvqpoG2xq4=",
        lastChainWork: "00000000000000000000000000000000000000000000000004504f3a4e71aa13",
        prevChainWork: "000000000000000000000000000000000000000000000000004143c00b3d47b8",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_2.headers",
        firstHeight: 200000,
        prevHash: "0000000000c470c4a573272aa4a680c93fc4c2f5df8ce9546441796f73277334",
        count: 100000,
        lastHash: "00000000dfe970844d1bf983d0745f709368b5c66224837a17ed633f0dabd300",
        fileHash: "hZXE3im7V4tE0oROWM2mGB9xPXEcpVLRIYUPaYT3VV0=",
        lastChainWork: "00000000000000000000000000000000000000000000000062378b066f9fba96",
        prevChainWork: "00000000000000000000000000000000000000000000000004504f3a4e71aa13",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_3.headers",
        firstHeight: 300000,
        prevHash: "00000000dfe970844d1bf983d0745f709368b5c66224837a17ed633f0dabd300",
        count: 100000,
        lastHash: "0000000001127c76ac45f605f9300dfa96a8054533b96413883fdc4378aeb42d",
        fileHash: "BGZxsk/Ooa4BOaoBEMOor+B8wL9ghW5A0We2G2fmyLE=",
        lastChainWork: "0000000000000000000000000000000000000000000000040da9d61d8e129a53",
        prevChainWork: "00000000000000000000000000000000000000000000000062378b066f9fba96",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_4.headers",
        firstHeight: 400000,
        prevHash: "0000000001127c76ac45f605f9300dfa96a8054533b96413883fdc4378aeb42d",
        count: 100000,
        lastHash: "0000000001965655a870175b510326e6393114d293896ddb237709eecb381ab8",
        fileHash: "3DjOpFnatZ0OKrpACATfAtBITX2s8JjfYTAnDHVkGuw=",
        lastChainWork: "00000000000000000000000000000000000000000000000461063a8389300d36",
        prevChainWork: "0000000000000000000000000000000000000000000000040da9d61d8e129a53",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_5.headers",
        firstHeight: 500000,
        prevHash: "0000000001965655a870175b510326e6393114d293896ddb237709eecb381ab8",
        count: 100000,
        lastHash: "000000000000bb1644b4d9a643b165a52b3ffba077f2a12b8bd1f0a6b6cc0fbc",
        fileHash: "wF008GqnZzAYsOwnmyFzIOmrJthHE3bq6oUg1FvHG1Y=",
        lastChainWork: "0000000000000000000000000000000000000000000000067a8291cfec0aa549",
        prevChainWork: "00000000000000000000000000000000000000000000000461063a8389300d36",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_6.headers",
        firstHeight: 600000,
        prevHash: "000000000000bb1644b4d9a643b165a52b3ffba077f2a12b8bd1f0a6b6cc0fbc",
        count: 100000,
        lastHash: "0000000000003e784511e93aca014ecaa6d4ba3637cf373f4b84dcac7c70cca0",
        fileHash: "uc7IW6NRXXtX3oGWwOYjtetTaZ+1zhvijNEwPbK+rAs=",
        lastChainWork: "0000000000000000000000000000000000000000000000078286c7f42f7ec693",
        prevChainWork: "0000000000000000000000000000000000000000000000067a8291cfec0aa549",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_7.headers",
        firstHeight: 700000,
        prevHash: "0000000000003e784511e93aca014ecaa6d4ba3637cf373f4b84dcac7c70cca0",
        count: 100000,
        lastHash: "0000000000068f8658ff71cbf8f5b31c837cc6df5bf53e40f05459d4267b53e6",
        fileHash: "yfomaIGZyoW/m7YdpZYNozeNrUmJBwaF0PpLdSADWJE=",
        lastChainWork: "00000000000000000000000000000000000000000000000a551ea869597d2a74",
        prevChainWork: "0000000000000000000000000000000000000000000000078286c7f42f7ec693",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_8.headers",
        firstHeight: 800000,
        prevHash: "0000000000068f8658ff71cbf8f5b31c837cc6df5bf53e40f05459d4267b53e6",
        count: 100000,
        lastHash: "0000000000214fbb71abe4695d935b8e089d306899c4a90124b1bc6806e6e299",
        fileHash: "/AIS2PYHdMJBmRF9ECsZmCphoqhDyFWs+aO+3GIpPhg=",
        lastChainWork: "00000000000000000000000000000000000000000000000eb93c12a85efec237",
        prevChainWork: "00000000000000000000000000000000000000000000000a551ea869597d2a74",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_9.headers",
        firstHeight: 900000,
        prevHash: "0000000000214fbb71abe4695d935b8e089d306899c4a90124b1bc6806e6e299",
        count: 100000,
        lastHash: "00000000002208a5fee5b9baa4b5519d2cd8ab405754fca13704dc667448f21a",
        fileHash: "lJtRGLYlMnHe6r0xuJJWauJA7DKL4ZYOqkYmUD2iwbM=",
        lastChainWork: "000000000000000000000000000000000000000000000017e96a5ada9f4a8bfb",
        prevChainWork: "00000000000000000000000000000000000000000000000eb93c12a85efec237",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_10.headers",
        firstHeight: 1000000,
        prevHash: "00000000002208a5fee5b9baa4b5519d2cd8ab405754fca13704dc667448f21a",
        count: 100000,
        lastHash: "000000000005bc8878ba47a47129c3e21f32f8c10b9658f9ee6db16a83870162",
        fileHash: "tfWVFoIp4A6yXd2c0YietQ7hYlmLf7O884baego+D4E=",
        lastChainWork: "000000000000000000000000000000000000000000000021bf46518c698a4bc8",
        prevChainWork: "000000000000000000000000000000000000000000000017e96a5ada9f4a8bfb",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_11.headers",
        firstHeight: 1100000,
        prevHash: "000000000005bc8878ba47a47129c3e21f32f8c10b9658f9ee6db16a83870162",
        count: 100000,
        lastHash: "00000000f8bf61018ddd77d23c112e874682704a290252f635e7df06c8a317b8",
        fileHash: "S0Y9WXGFFJLRsRkQRNvrtImOezjReEQ1eDdB2x5M6Mw=",
        lastChainWork: "0000000000000000000000000000000000000000000000288b285ca9b1bb8065",
        prevChainWork: "000000000000000000000000000000000000000000000021bf46518c698a4bc8",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_12.headers",
        firstHeight: 1200000,
        prevHash: "00000000f8bf61018ddd77d23c112e874682704a290252f635e7df06c8a317b8",
        count: 100000,
        lastHash: "0000000000000165e6678be46ec2b15c587611b86da7147f7069a0e7175d62da",
        fileHash: "eFHQB8EaSfs4EKZxVsLhX8UA79kpOI4dR6j/z9P8frI=",
        lastChainWork: "0000000000000000000000000000000000000000000000542144c6af6e9258ea",
        prevChainWork: "0000000000000000000000000000000000000000000000288b285ca9b1bb8065",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_13.headers",
        firstHeight: 1300000,
        prevHash: "0000000000000165e6678be46ec2b15c587611b86da7147f7069a0e7175d62da",
        count: 100000,
        lastHash: "00000000000002ef0a47d0f242ab280bded8f4780bad506c71f2e1d2771becd4",
        fileHash: "2MFJLBjHOBnuaDAICQFCL3y+6ejj0k92gbcmLWa1/Xc=",
        lastChainWork: "0000000000000000000000000000000000000000000000dcc85f546d353f7b08",
        prevChainWork: "0000000000000000000000000000000000000000000000542144c6af6e9258ea",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_14.headers",
        firstHeight: 1400000,
        prevHash: "00000000000002ef0a47d0f242ab280bded8f4780bad506c71f2e1d2771becd4",
        count: 100000,
        lastHash: "0000000000000168de8736c8a424fd5ebe1dcf0a030ed5fa0699b8c0fafc0b5e",
        fileHash: "lWmP/pOR5ciEnu5tjIrf7OTEaiaMcfqFZQQYT7QH6qg=",
        lastChainWork: "00000000000000000000000000000000000000000000011bed7ab81a56a65cbc",
        prevChainWork: "0000000000000000000000000000000000000000000000dcc85f546d353f7b08",
        chain: "test",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "testNet_15.headers",
        firstHeight: 1500000,
        prevHash: "0000000000000168de8736c8a424fd5ebe1dcf0a030ed5fa0699b8c0fafc0b5e",
        count: 100000,
        lastHash: "00000000000005504bfd1a3ce4688c30c86740390102b6cd464a2fb5e0e3fed1",
        fileHash: "1bCf0R0RsoadANX+6H4NH1b3jNuTPyTayoS1SpQXa2Q=",
        lastChainWork: "000000000000000000000000000000000000000000000156c3b84396da4e60b9",
        prevChainWork: "00000000000000000000000000000000000000000000011bed7ab81a56a65cbc",
        chain: "test",
        validated: true
    },
    {
        chain: "test",
        count: 95262,
        fileHash: "BvNO9eeMwCaN1Xsx8PQLMJ+YiqF9FrNe+9WnnEo9B44=",
        fileName: "testNet_16.headers",
        firstHeight: 1600000,
        lastChainWork: "00000000000000000000000000000000000000000000015814b84c3f9834ef93",
        lastHash: "000000000ca922c841cb7fedd8f012ebc27b17991c9b00a8fb7ca4b1b2b648d3",
        prevChainWork: "000000000000000000000000000000000000000000000156c3b84396da4e60b9",
        prevHash: "00000000000005504bfd1a3ce4688c30c86740390102b6cd464a2fb5e0e3fed1",
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_0.headers",
        firstHeight: 0,
        prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
        count: 100000,
        lastHash: "000000000002d01c1fccc21636b607dfd930d31d01c3a62104612a1719011250",
        fileHash: "DMXYETHMphmYRh5y0+qsJhj67ML5Ui4LE1eEZDYbnZE=",
        lastChainWork: "000000000000000000000000000000000000000000000000064492eaf00f2520",
        prevChainWork: "0000000000000000000000000000000000000000000000000000000000000000",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_1.headers",
        firstHeight: 100000,
        prevHash: "000000000002d01c1fccc21636b607dfd930d31d01c3a62104612a1719011250",
        count: 100000,
        lastHash: "00000000000003a20def7a05a77361b9657ff954b2f2080e135ea6f5970da215",
        fileHash: "IID8O84Uny22i10fWHTQr6f9+9eFZ8dhVyegYPGSg+Q=",
        lastChainWork: "00000000000000000000000000000000000000000000001ac0479f335782cb80",
        prevChainWork: "000000000000000000000000000000000000000000000000064492eaf00f2520",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_2.headers",
        firstHeight: 200000,
        prevHash: "00000000000003a20def7a05a77361b9657ff954b2f2080e135ea6f5970da215",
        count: 100000,
        lastHash: "000000000000000067ecc744b5ae34eebbde14d21ca4db51652e4d67e155f07e",
        fileHash: "wbfV/ZuPvLKHtRJN4QlHiKlpNncuqWA1dMJ6O9mhisc=",
        lastChainWork: "000000000000000000000000000000000000000000005a795f5d6ede10bc6d60",
        prevChainWork: "00000000000000000000000000000000000000000000001ac0479f335782cb80",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_3.headers",
        firstHeight: 300000,
        prevHash: "000000000000000067ecc744b5ae34eebbde14d21ca4db51652e4d67e155f07e",
        count: 100000,
        lastHash: "0000000000000000030034b661aed920a9bdf6bbfa6d2e7a021f78481882fa39",
        fileHash: "5pklz64as2MG6y9lQiiClZaA82f6xoK1xdzkSqOZLsA=",
        lastChainWork: "0000000000000000000000000000000000000000001229fea679a4cdc26e7460",
        prevChainWork: "000000000000000000000000000000000000000000005a795f5d6ede10bc6d60",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_4.headers",
        firstHeight: 400000,
        prevHash: "0000000000000000030034b661aed920a9bdf6bbfa6d2e7a021f78481882fa39",
        count: 100000,
        lastHash: "0000000000000000043831d6ebb013716f0580287ee5e5687e27d0ed72e6e523",
        fileHash: "2X78/S+Z/h5ELA63aC3xt6/o4G8JMcAOEiZ00ycKHsM=",
        lastChainWork: "0000000000000000000000000000000000000000007ae4707601d47bc6695487",
        prevChainWork: "0000000000000000000000000000000000000000001229fea679a4cdc26e7460",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_5.headers",
        firstHeight: 500000,
        prevHash: "0000000000000000043831d6ebb013716f0580287ee5e5687e27d0ed72e6e523",
        count: 100000,
        lastHash: "0000000000000000078f57b9a986b53b73f007c6b27b6f16409ca4eda83034e8",
        fileHash: "Tzm60n66tIuq7wNdP6M1BH77iFzGCPbOMIl6smJ/LRg=",
        lastChainWork: "000000000000000000000000000000000000000000e8f2ea21f069a214067ed7",
        prevChainWork: "0000000000000000000000000000000000000000007ae4707601d47bc6695487",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_6.headers",
        firstHeight: 600000,
        prevHash: "0000000000000000078f57b9a986b53b73f007c6b27b6f16409ca4eda83034e8",
        count: 100000,
        lastHash: "000000000000000013abf3ab026610ed70e023476db8ce96f68637acdcbcf3cb",
        fileHash: "O7SoyIDxhejB0Qs4rBO4OkfBK2yVZKhxra6YxZMhiIk=",
        lastChainWork: "0000000000000000000000000000000000000000012f32fb33b26aa239be0fc3",
        prevChainWork: "000000000000000000000000000000000000000000e8f2ea21f069a214067ed7",
        chain: "main",
        validated: true
    },
    {
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        fileName: "mainNet_7.headers",
        firstHeight: 700000,
        prevHash: "000000000000000013abf3ab026610ed70e023476db8ce96f68637acdcbcf3cb",
        count: 100000,
        lastHash: "00000000000000000b6ae23bbe9f549844c20943d8c20b8ceedbae8aa1dde8e0",
        fileHash: "+0Wu2GrKgCv4o1yZfdWl60aAgvBj6Rt3xlWj8TQprUw=",
        lastChainWork: "000000000000000000000000000000000000000001483b2995af390c20b58320",
        prevChainWork: "0000000000000000000000000000000000000000012f32fb33b26aa239be0fc3",
        chain: "main",
        validated: true
    },
    {
        chain: "main",
        count: 100000,
        fileHash: "xKYCsMzfbWdwq6RtEos4+4w7F3FroFMXb4tk4Z2gn5s=",
        fileName: "mainNet_8.headers",
        firstHeight: 800000,
        lastChainWork: "000000000000000000000000000000000000000001664db1f2d50327928007e0",
        lastHash: "00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087",
        prevChainWork: "000000000000000000000000000000000000000001483b2995af390c20b58320",
        prevHash: "00000000000000000b6ae23bbe9f549844c20943d8c20b8ceedbae8aa1dde8e0",
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        validated: true
    },
    {
        chain: "main",
        count: 7630,
        fileHash: "R3JNRSzpFPvKXH2myRL+m420ycjrxRTcSI3aiMOJmfo=",
        fileName: "mainNet_9.headers",
        firstHeight: 900000,
        lastChainWork: "00000000000000000000000000000000000000000167cca3f0721d58e023cf01",
        lastHash: "00000000000000000c119d65afcc66b640e98b839414c7e66d22b428ecb24a43",
        prevChainWork: "000000000000000000000000000000000000000001664db1f2d50327928007e0",
        prevHash: "00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087",
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        validated: true
    },
    {
        chain: "main",
        count: 15512,
        fileHash: "sbLY7ZiEWkdvgAbZlWxYJfd/CLxeYPtuwHrc4WZ0aL4=",
        fileName: "mainNet_9.headers",
        firstHeight: 900000,
        lastChainWork: "00000000000000000000000000000000000000000168d586f9048fd69f17e1ca",
        lastHash: "000000000000000004c5e39626c72e67d669135a7c004ee86f7191e3ed01cdee",
        prevChainWork: "000000000000000000000000000000000000000001664db1f2d50327928007e0",
        prevHash: "00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087",
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders",
        validated: true
    },
    {
        chain: "main",
        count: 31772,
        fileHash: "NuVsRUrI5QnjILbYy4LS3A/Udl6PH/m8Y9uVguEsekM=",
        fileName: "mainNet_9.headers",
        firstHeight: 900000,
        lastChainWork: "0000000000000000000000000000000000000000016ab16bb9b31430588788d3",
        lastHash: "0000000000000000024a2f1caef4b0ffdc1a036b09f9ed7f48b538f619f32ef2",
        prevChainWork: "000000000000000000000000000000000000000001664db1f2d50327928007e0",
        prevHash: "00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087",
        sourceUrl: "https://cdn.projectbabbage.com/blockheaders"
    }
]
```

See also: [BulkHeaderFileInfo](./services.md#interface-bulkheaderfileinfo)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

<!--#endregion ts2md-api-merged-here-->
