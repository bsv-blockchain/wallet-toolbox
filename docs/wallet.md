# WALLET: BSV Wallet Toolbox API Documentation

The documentation is split into various pages, this page focuses on the [Wallet](#class-wallet) class and top level structure of a functioning BRC-100 wallet.

[Return To Top](./README.md)

<!--#region ts2md-api-merged-here-->
### API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

#### Interfaces

| | | |
| --- | --- | --- |
| [AdminStatsResult](#interface-adminstatsresult) | [GenerateChangeSdkChangeOutput](#interface-generatechangesdkchangeoutput) | [StatusForTxidResult](#interface-statusfortxidresult) |
| [ArcConfig](#interface-arcconfig) | [GenerateChangeSdkInput](#interface-generatechangesdkinput) | [StorageAdminStats](#interface-storageadminstats) |
| [ArcMinerGetTxData](#interface-arcminergettxdata) | [GenerateChangeSdkOutput](#interface-generatechangesdkoutput) | [StorageCreateActionResult](#interface-storagecreateactionresult) |
| [AuthId](#interface-authid) | [GenerateChangeSdkParams](#interface-generatechangesdkparams) | [StorageCreateTransactionSdkInput](#interface-storagecreatetransactionsdkinput) |
| [AuthPayload](#interface-authpayload) | [GenerateChangeSdkResult](#interface-generatechangesdkresult) | [StorageCreateTransactionSdkOutput](#interface-storagecreatetransactionsdkoutput) |
| [BaseBlockHeader](#interface-baseblockheader) | [GenerateChangeSdkStorageChange](#interface-generatechangesdkstoragechange) | [StorageFeeModel](#interface-storagefeemodel) |
| [BitailsConfig](#interface-bitailsconfig) | [GetHeaderByteFileLinksResult](#interface-getheaderbytefilelinksresult) | [StorageGetBeefOptions](#interface-storagegetbeefoptions) |
| [BitailsMerkleProof](#interface-bitailsmerkleproof) | [GetMerklePathResult](#interface-getmerklepathresult) | [StorageIdbOptions](#interface-storageidboptions) |
| [BlockHeader](#interface-blockheader) | [GetRawTxResult](#interface-getrawtxresult) | [StorageIdbSchema](#interface-storageidbschema) |
| [BsvExchangeRate](#interface-bsvexchangerate) | [GetReqsAndBeefDetail](#interface-getreqsandbeefdetail) | [StorageIdentity](#interface-storageidentity) |
| [BulkFileDataManagerMergeResult](#interface-bulkfiledatamanagermergeresult) | [GetReqsAndBeefResult](#interface-getreqsandbeefresult) | [StorageInternalizeActionResult](#interface-storageinternalizeactionresult) |
| [BulkFileDataManagerOptions](#interface-bulkfiledatamanageroptions) | [GetScriptHashHistory](#interface-getscripthashhistory) | [StorageProcessActionArgs](#interface-storageprocessactionargs) |
| [BulkHeaderFileInfo](#interface-bulkheaderfileinfo) | [GetScriptHashHistoryResult](#interface-getscripthashhistoryresult) | [StorageProcessActionResults](#interface-storageprocessactionresults) |
| [BulkHeaderFilesInfo](#interface-bulkheaderfilesinfo) | [GetStatusForTxidsResult](#interface-getstatusfortxidsresult) | [StorageProvenOrReq](#interface-storageprovenorreq) |
| [BulkIngestorApi](#interface-bulkingestorapi) | [GetUtxoStatusDetails](#interface-getutxostatusdetails) | [StorageProviderOptions](#interface-storageprovideroptions) |
| [BulkIngestorBaseOptions](#interface-bulkingestorbaseoptions) | [GetUtxoStatusResult](#interface-getutxostatusresult) | [StorageReaderOptions](#interface-storagereaderoptions) |
| [BulkIngestorCDNOptions](#interface-bulkingestorcdnoptions) | [GroupedPermissionRequest](#interface-groupedpermissionrequest) | [StorageReaderWriterOptions](#interface-storagereaderwriteroptions) |
| [BulkIngestorWhatsOnChainOptions](#interface-bulkingestorwhatsonchainoptions) | [GroupedPermissions](#interface-groupedpermissions) | [StorageSyncReaderOptions](#interface-storagesyncreaderoptions) |
| [BulkStorageApi](#interface-bulkstorageapi) | [HeightRangeApi](#interface-heightrangeapi) | [SyncChunk](#interface-syncchunk) |
| [BulkStorageBaseOptions](#interface-bulkstoragebaseoptions) | [HeightRanges](#interface-heightranges) | [SyncError](#interface-syncerror) |
| [BulkSyncResult](#interface-bulksyncresult) | [KeyPair](#interface-keypair) | [SyncMap](#interface-syncmap) |
| [CertOpsWallet](#interface-certopswallet) | [KeyPairAddress](#interface-keypairaddress) | [TableCertificate](#interface-tablecertificate) |
| [Certifier](#interface-certifier) | [ListActionsSpecOp](#interface-listactionsspecop) | [TableCertificateField](#interface-tablecertificatefield) |
| [ChaintracksApi](#interface-chaintracksapi) | [ListOutputsSpecOp](#interface-listoutputsspecop) | [TableCertificateX](#interface-tablecertificatex) |
| [ChaintracksAppendableFileApi](#interface-chaintracksappendablefileapi) | [LiveBlockHeader](#interface-liveblockheader) | [TableCommission](#interface-tablecommission) |
| [ChaintracksChainTrackerOptions](#interface-chaintrackschaintrackeroptions) | [LiveIngestorApi](#interface-liveingestorapi) | [TableMonitorEvent](#interface-tablemonitorevent) |
| [ChaintracksClientApi](#interface-chaintracksclientapi) | [LiveIngestorBaseOptions](#interface-liveingestorbaseoptions) | [TableOutput](#interface-tableoutput) |
| [ChaintracksFetchApi](#interface-chaintracksfetchapi) | [LiveIngestorWhatsOnChainOptions](#interface-liveingestorwhatsonchainoptions) | [TableOutputBasket](#interface-tableoutputbasket) |
| [ChaintracksFsApi](#interface-chaintracksfsapi) | [MonitorOptions](#interface-monitoroptions) | [TableOutputTag](#interface-tableoutputtag) |
| [ChaintracksInfoApi](#interface-chaintracksinfoapi) | [OutPoint](#interface-outpoint) | [TableOutputTagMap](#interface-tableoutputtagmap) |
| [ChaintracksManagementApi](#interface-chaintracksmanagementapi) | [Paged](#interface-paged) | [TableOutputX](#interface-tableoutputx) |
| [ChaintracksOptions](#interface-chaintracksoptions) | [PendingSignAction](#interface-pendingsignaction) | [TableProvenTx](#interface-tableproventx) |
| [ChaintracksPackageInfoApi](#interface-chaintrackspackageinfoapi) | [PendingStorageInput](#interface-pendingstorageinput) | [TableProvenTxReq](#interface-tableproventxreq) |
| [ChaintracksReadableFileApi](#interface-chaintracksreadablefileapi) | [PermissionRequest](#interface-permissionrequest) | [TableProvenTxReqDynamics](#interface-tableproventxreqdynamics) |
| [ChaintracksServiceClientOptions](#interface-chaintracksserviceclientoptions) | [PermissionToken](#interface-permissiontoken) | [TableSettings](#interface-tablesettings) |
| [ChaintracksStorageApi](#interface-chaintracksstorageapi) | [PermissionsManagerConfig](#interface-permissionsmanagerconfig) | [TableSyncState](#interface-tablesyncstate) |
| [ChaintracksStorageBaseOptions](#interface-chaintracksstoragebaseoptions) | [PermissionsModule](#interface-permissionsmodule) | [TableTransaction](#interface-tabletransaction) |
| [ChaintracksStorageBulkFileApi](#interface-chaintracksstoragebulkfileapi) | [PostBeefResult](#interface-postbeefresult) | [TableTxLabel](#interface-tabletxlabel) |
| [ChaintracksStorageIdbOptions](#interface-chaintracksstorageidboptions) | [PostBeefResultForTxidApi](#interface-postbeefresultfortxidapi) | [TableTxLabelMap](#interface-tabletxlabelmap) |
| [ChaintracksStorageIdbSchema](#interface-chaintracksstorageidbschema) | [PostReqsToNetworkDetails](#interface-postreqstonetworkdetails) | [TableUser](#interface-tableuser) |
| [ChaintracksStorageIngestApi](#interface-chaintracksstorageingestapi) | [PostReqsToNetworkResult](#interface-postreqstonetworkresult) | [TaskPurgeParams](#interface-taskpurgeparams) |
| [ChaintracksStorageNoDbOptions](#interface-chaintracksstoragenodboptions) | [PostTxResultForTxid](#interface-posttxresultfortxid) | [TrustSettings](#interface-trustsettings) |
| [ChaintracksStorageQueryApi](#interface-chaintracksstoragequeryapi) | [PostTxResultForTxidError](#interface-posttxresultfortxiderror) | [TrxToken](#interface-trxtoken) |
| [ChaintracksWritableFileApi](#interface-chaintrackswritablefileapi) | [PostTxsResult](#interface-posttxsresult) | [TscMerkleProofApi](#interface-tscmerkleproofapi) |
| [CommitNewTxResults](#interface-commitnewtxresults) | [ProcessSyncChunkResult](#interface-processsyncchunkresult) | [TxScriptOffsets](#interface-txscriptoffsets) |
| [CompleteAuthResponse](#interface-completeauthresponse) | [Profile](#interface-profile) | [UMPToken](#interface-umptoken) |
| [CounterpartyPermissionRequest](#interface-counterpartypermissionrequest) | [ProvenOrRawTx](#interface-provenorrawtx) | [UMPTokenInteractor](#interface-umptokeninteractor) |
| [CounterpartyPermissions](#interface-counterpartypermissions) | [ProvenTransactionStatus](#interface-proventransactionstatus) | [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs) |
| [CreateActionResultX](#interface-createactionresultx) | [ProvenTxFromTxidResult](#interface-proventxfromtxidresult) | [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult) |
| [DeactivedHeader](#interface-deactivedheader) | [ProvenTxReqHistory](#interface-proventxreqhistory) | [ValidateGenerateChangeSdkParamsResult](#interface-validategeneratechangesdkparamsresult) |
| [EntitySyncMap](#interface-entitysyncmap) | [ProvenTxReqHistorySummaryApi](#interface-proventxreqhistorysummaryapi) | [VerifyAndRepairBeefResult](#interface-verifyandrepairbeefresult) |
| [EntityTimeStamp](#interface-entitytimestamp) | [ProvenTxReqNotify](#interface-proventxreqnotify) | [WalletArgs](#interface-walletargs) |
| [ExchangeRatesIoApi](#interface-exchangeratesioapi) | [ProviderCallHistory](#interface-providercallhistory) | [WalletBalance](#interface-walletbalance) |
| [ExtendedVerifiableCertificate](#interface-extendedverifiablecertificate) | [PurgeParams](#interface-purgeparams) | [WalletLoggerArgs](#interface-walletloggerargs) |
| [FiatExchangeRates](#interface-fiatexchangerates) | [PurgeResults](#interface-purgeresults) | [WalletPermissionsManagerCallbacks](#interface-walletpermissionsmanagercallbacks) |
| [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs) | [ReproveHeaderResult](#interface-reproveheaderresult) | [WalletServices](#interface-walletservices) |
| [FindCertificatesArgs](#interface-findcertificatesargs) | [ReproveProvenResult](#interface-reproveprovenresult) | [WalletServicesOptions](#interface-walletservicesoptions) |
| [FindCommissionsArgs](#interface-findcommissionsargs) | [RequestSyncChunkArgs](#interface-requestsyncchunkargs) | [WalletSettings](#interface-walletsettings) |
| [FindForUserSincePagedArgs](#interface-findforusersincepagedargs) | [ReviewActionResult](#interface-reviewactionresult) | [WalletSettingsManagerConfig](#interface-walletsettingsmanagerconfig) |
| [FindMonitorEventsArgs](#interface-findmonitoreventsargs) | [ScriptTemplateParamsBRC29](#interface-scripttemplateparamsbrc29) | [WalletSigner](#interface-walletsigner) |
| [FindOutputBasketsArgs](#interface-findoutputbasketsargs) | [ScriptTemplateUnlock](#interface-scripttemplateunlock) | [WalletStorage](#interface-walletstorage) |
| [FindOutputTagMapsArgs](#interface-findoutputtagmapsargs) | [ServiceCall](#interface-servicecall) | [WalletStorageInfo](#interface-walletstorageinfo) |
| [FindOutputTagsArgs](#interface-findoutputtagsargs) | [ServiceCall](#interface-servicecall) | [WalletStorageProvider](#interface-walletstorageprovider) |
| [FindOutputsArgs](#interface-findoutputsargs) | [ServiceCallHistory](#interface-servicecallhistory) | [WalletStorageReader](#interface-walletstoragereader) |
| [FindPartialSincePagedArgs](#interface-findpartialsincepagedargs) | [ServiceCallHistoryCounts](#interface-servicecallhistorycounts) | [WalletStorageSync](#interface-walletstoragesync) |
| [FindProvenTxReqsArgs](#interface-findproventxreqsargs) | [ServiceToCall](#interface-servicetocall) | [WalletStorageSyncReader](#interface-walletstoragesyncreader) |
| [FindProvenTxsArgs](#interface-findproventxsargs) | [SetupClientWalletArgs](#interface-setupclientwalletargs) | [WalletStorageWriter](#interface-walletstoragewriter) |
| [FindSincePagedArgs](#interface-findsincepagedargs) | [SetupClientWalletClientArgs](#interface-setupclientwalletclientargs) | [WalletTheme](#interface-wallettheme) |
| [FindSyncStatesArgs](#interface-findsyncstatesargs) | [SetupWallet](#interface-setupwallet) | [WhatsOnChainServicesOptions](#interface-whatsonchainservicesoptions) |
| [FindTransactionsArgs](#interface-findtransactionsargs) | [SetupWalletClient](#interface-setupwalletclient) | [WocChainInfo](#interface-wocchaininfo) |
| [FindTxLabelMapsArgs](#interface-findtxlabelmapsargs) | [SetupWalletIdb](#interface-setupwalletidb) | [WocGetHeaderByteFileLinks](#interface-wocgetheaderbytefilelinks) |
| [FindTxLabelsArgs](#interface-findtxlabelsargs) | [SetupWalletIdbArgs](#interface-setupwalletidbargs) | [WocGetHeadersHeader](#interface-wocgetheadersheader) |
| [FindUsersArgs](#interface-findusersargs) | [SignActionResultX](#interface-signactionresultx) | [WocHeader](#interface-wocheader) |
| [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput) | [StartAuthResponse](#interface-startauthresponse) | [XValidCreateActionOutput](#interface-xvalidcreateactionoutput) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Interface: AdminStatsResult

```ts
export interface AdminStatsResult extends StorageAdminStats {
    servicesStats?: ServicesCallHistory;
    monitorStats?: ServicesCallHistory;
}
```

See also: [ServicesCallHistory](./client.md#type-servicescallhistory), [StorageAdminStats](./storage.md#interface-storageadminstats)

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
##### Interface: AuthId

```ts
export interface AuthId {
    identityKey: string;
    userId?: number;
    isActive?: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: AuthPayload

AuthMethodInteractor

A base interface/class for client-side logic to interact with a server
for a specific Auth Method's flow (start, complete).

```ts
export interface AuthPayload {
    [key: string]: any;
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

See also: [BaseBlockHeader](./client.md#interface-baseblockheader)

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
##### Interface: BsvExchangeRate

```ts
export interface BsvExchangeRate {
    timestamp: Date;
    base: "USD";
    rate: number;
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
##### Interface: CertOpsWallet

```ts
export interface CertOpsWallet {
    getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetPublicKeyResult>;
    encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult>;
    decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: Certifier

```ts
export interface Certifier {
    name: string;
    description: string;
    identityKey: PubKeyHex;
    trust: number;
    iconUrl?: string;
    baseURL?: string;
}
```

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
##### Interface: CommitNewTxResults

```ts
export interface CommitNewTxResults {
    req: EntityProvenTxReq;
    log?: string;
}
```

See also: [EntityProvenTxReq](./storage.md#class-entityproventxreq)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: CompleteAuthResponse

```ts
export interface CompleteAuthResponse {
    success: boolean;
    message?: string;
    presentationKey?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: CounterpartyPermissionRequest

```ts
export interface CounterpartyPermissionRequest {
    originator: string;
    requestID: string;
    counterparty: PubKeyHex;
    counterpartyLabel?: string;
    permissions: CounterpartyPermissions;
}
```

See also: [CounterpartyPermissions](./client.md#interface-counterpartypermissions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: CounterpartyPermissions

```ts
export interface CounterpartyPermissions {
    description?: string;
    protocols: Array<{
        protocolID: WalletProtocol;
        description: string;
    }>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: CreateActionResultX

```ts
export interface CreateActionResultX extends CreateActionResult {
    txid?: TXIDHexString;
    tx?: AtomicBEEF;
    noSendChange?: OutpointString[];
    sendWithResults?: SendWithResult[];
    signableTransaction?: SignableTransaction;
    notDelayedResults?: ReviewActionResult[];
}
```

See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: DeactivedHeader

```ts
export interface DeactivedHeader {
    whenMsecs: number;
    tries: number;
    header: BlockHeader;
}
```

See also: [BlockHeader](./client.md#interface-blockheader)

###### Property header

The deactivated block header.

```ts
header: BlockHeader
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Property tries

Number of attempts made to process the header.
Supports returning deactivation notification to the queue if proof data is not yet available.

```ts
tries: number
```

###### Property whenMsecs

To control aging of notification before pursuing updated proof data.

```ts
whenMsecs: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: EntitySyncMap

```ts
export interface EntitySyncMap {
    entityName: string;
    idMap: Record<number, number>;
    maxUpdated_at?: Date;
    count: number;
}
```

###### Property count

The cummulative count of items of this entity type received over all the `SyncChunk`s
since the `since` was last updated.

This is the `offset` value to use for the next SyncChunk request.

```ts
count: number
```

###### Property idMap

Maps foreign ids to local ids
Some entities don't have idMaps (CertificateField, TxLabelMap and OutputTagMap)

```ts
idMap: Record<number, number>
```

###### Property maxUpdated_at

the maximum updated_at value seen for this entity over chunks received
during this udpate cycle.

```ts
maxUpdated_at?: Date
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: EntityTimeStamp

```ts
export interface EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
}
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
##### Interface: ExtendedVerifiableCertificate

```ts
export interface ExtendedVerifiableCertificate extends IdentityCertificate {
    certifierInfo: IdentityCertifier;
    publiclyRevealedKeyring: Record<string, Base64String>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FiatExchangeRates

```ts
export interface FiatExchangeRates {
    timestamp: Date;
    base: "USD";
    rates: Record<string, number>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindCertificateFieldsArgs

```ts
export interface FindCertificateFieldsArgs extends FindSincePagedArgs {
    partial: Partial<TableCertificateField>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableCertificateField](./storage.md#interface-tablecertificatefield)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindCertificatesArgs

```ts
export interface FindCertificatesArgs extends FindSincePagedArgs {
    partial: Partial<TableCertificate>;
    certifiers?: string[];
    types?: string[];
    includeFields?: boolean;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableCertificate](./storage.md#interface-tablecertificate)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindCommissionsArgs

```ts
export interface FindCommissionsArgs extends FindSincePagedArgs {
    partial: Partial<TableCommission>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableCommission](./storage.md#interface-tablecommission)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindForUserSincePagedArgs

```ts
export interface FindForUserSincePagedArgs extends FindSincePagedArgs {
    userId: number;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindMonitorEventsArgs

```ts
export interface FindMonitorEventsArgs extends FindSincePagedArgs {
    partial: Partial<TableMonitorEvent>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableMonitorEvent](./storage.md#interface-tablemonitorevent)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindOutputBasketsArgs

```ts
export interface FindOutputBasketsArgs extends FindSincePagedArgs {
    partial: Partial<TableOutputBasket>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableOutputBasket](./storage.md#interface-tableoutputbasket)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindOutputTagMapsArgs

```ts
export interface FindOutputTagMapsArgs extends FindSincePagedArgs {
    partial: Partial<TableOutputTagMap>;
    tagIds?: number[];
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindOutputTagsArgs

```ts
export interface FindOutputTagsArgs extends FindSincePagedArgs {
    partial: Partial<TableOutputTag>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableOutputTag](./storage.md#interface-tableoutputtag)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindOutputsArgs

```ts
export interface FindOutputsArgs extends FindSincePagedArgs {
    partial: Partial<TableOutput>;
    noScript?: boolean;
    txStatus?: TransactionStatus[];
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableOutput](./storage.md#interface-tableoutput), [TransactionStatus](./client.md#type-transactionstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindPartialSincePagedArgs

```ts
export interface FindPartialSincePagedArgs<T extends object> extends FindSincePagedArgs {
    partial: Partial<T>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindProvenTxReqsArgs

```ts
export interface FindProvenTxReqsArgs extends FindSincePagedArgs {
    partial: Partial<TableProvenTxReq>;
    status?: ProvenTxReqStatus[];
    txids?: string[];
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [ProvenTxReqStatus](./client.md#type-proventxreqstatus), [TableProvenTxReq](./storage.md#interface-tableproventxreq)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindProvenTxsArgs

```ts
export interface FindProvenTxsArgs extends FindSincePagedArgs {
    partial: Partial<TableProvenTx>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableProvenTx](./storage.md#interface-tableproventx)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindSincePagedArgs

```ts
export interface FindSincePagedArgs {
    since?: Date;
    paged?: Paged;
    trx?: TrxToken;
    orderDescending?: boolean;
}
```

See also: [Paged](./client.md#interface-paged), [TrxToken](./client.md#interface-trxtoken)

###### Property orderDescending

Support for orderDescending is implemented in StorageKnex for basic table find methods,
excluding certificate_fields table, map tables, and settings (singleton row table).

```ts
orderDescending?: boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindSyncStatesArgs

```ts
export interface FindSyncStatesArgs extends FindSincePagedArgs {
    partial: Partial<TableSyncState>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableSyncState](./storage.md#interface-tablesyncstate)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindTransactionsArgs

```ts
export interface FindTransactionsArgs extends FindSincePagedArgs {
    partial: Partial<TableTransaction>;
    status?: TransactionStatus[];
    noRawTx?: boolean;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableTransaction](./storage.md#interface-tabletransaction), [TransactionStatus](./client.md#type-transactionstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindTxLabelMapsArgs

```ts
export interface FindTxLabelMapsArgs extends FindSincePagedArgs {
    partial: Partial<TableTxLabelMap>;
    labelIds?: number[];
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindTxLabelsArgs

```ts
export interface FindTxLabelsArgs extends FindSincePagedArgs {
    partial: Partial<TableTxLabel>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableTxLabel](./storage.md#interface-tabletxlabel)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: FindUsersArgs

```ts
export interface FindUsersArgs extends FindSincePagedArgs {
    partial: Partial<TableUser>;
}
```

See also: [FindSincePagedArgs](./client.md#interface-findsincepagedargs), [TableUser](./storage.md#interface-tableuser)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkChangeInput

```ts
export interface GenerateChangeSdkChangeInput {
    outputId: number;
    satoshis: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkChangeOutput

```ts
export interface GenerateChangeSdkChangeOutput {
    satoshis: number;
    lockingScriptLength: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkInput

```ts
export interface GenerateChangeSdkInput {
    satoshis: number;
    unlockingScriptLength: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkOutput

```ts
export interface GenerateChangeSdkOutput {
    satoshis: number;
    lockingScriptLength: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkParams

```ts
export interface GenerateChangeSdkParams {
    fixedInputs: GenerateChangeSdkInput[];
    fixedOutputs: GenerateChangeSdkOutput[];
    feeModel: StorageFeeModel;
    targetNetCount?: number;
    changeInitialSatoshis: number;
    changeFirstSatoshis: number;
    changeLockingScriptLength: number;
    changeUnlockingScriptLength: number;
    randomVals?: number[];
    noLogging?: boolean;
    log?: string;
}
```

See also: [GenerateChangeSdkInput](./storage.md#interface-generatechangesdkinput), [GenerateChangeSdkOutput](./storage.md#interface-generatechangesdkoutput), [StorageFeeModel](./client.md#interface-storagefeemodel)

###### Property changeFirstSatoshis

Lowest amount value to assign to a change output.
Drop the output if unable to satisfy.
default 285

```ts
changeFirstSatoshis: number
```

###### Property changeInitialSatoshis

Satoshi amount to initialize optional new change outputs.

```ts
changeInitialSatoshis: number
```

###### Property changeLockingScriptLength

Fixed change locking script length.

For P2PKH template, 25 bytes

```ts
changeLockingScriptLength: number
```

###### Property changeUnlockingScriptLength

Fixed change unlocking script length.

For P2PKH template, 107 bytes

```ts
changeUnlockingScriptLength: number
```

###### Property targetNetCount

Target for number of new change outputs added minus number of funding change outputs consumed.
If undefined, only a single change output will be added if excess fees must be recaptured.

```ts
targetNetCount?: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkResult

```ts
export interface GenerateChangeSdkResult {
    allocatedChangeInputs: GenerateChangeSdkChangeInput[];
    changeOutputs: GenerateChangeSdkChangeOutput[];
    size: number;
    fee: number;
    satsPerKb: number;
    maxPossibleSatoshisAdjustment?: {
        fixedOutputIndex: number;
        satoshis: number;
    };
}
```

See also: [GenerateChangeSdkChangeInput](./storage.md#interface-generatechangesdkchangeinput), [GenerateChangeSdkChangeOutput](./storage.md#interface-generatechangesdkchangeoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GenerateChangeSdkStorageChange

```ts
export interface GenerateChangeSdkStorageChange extends GenerateChangeSdkChangeInput {
    spendable: boolean;
}
```

See also: [GenerateChangeSdkChangeInput](./storage.md#interface-generatechangesdkchangeinput)

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
##### Interface: GetMerklePathResult

Properties on result returned from `WalletServices` function `getMerkleProof`.

```ts
export interface GetMerklePathResult {
    name?: string;
    merklePath?: MerklePath;
    header?: BlockHeader;
    error?: WalletError;
    notes?: ReqHistoryNote[];
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [ReqHistoryNote](./client.md#type-reqhistorynote), [WalletError](./client.md#class-walleterror)

###### Property error

The first exception error that occurred during processing, if any.

```ts
error?: WalletError
```
See also: [WalletError](./client.md#class-walleterror)

###### Property merklePath

Multiple proofs may be returned when a transaction also appears in
one or more orphaned blocks

```ts
merklePath?: MerklePath
```

###### Property name

The name of the service returning the proof, or undefined if no proof

```ts
name?: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetRawTxResult

Properties on result returned from `WalletServices` function `getRawTx`.

```ts
export interface GetRawTxResult {
    txid: string;
    name?: string;
    rawTx?: number[];
    error?: WalletError;
}
```

See also: [WalletError](./client.md#class-walleterror)

###### Property error

The first exception error that occurred during processing, if any.

```ts
error?: WalletError
```
See also: [WalletError](./client.md#class-walleterror)

###### Property name

The name of the service returning the rawTx, or undefined if no rawTx

```ts
name?: string
```

###### Property rawTx

Multiple proofs may be returned when a transaction also appears in
one or more orphaned blocks

```ts
rawTx?: number[]
```

###### Property txid

Transaction hash or rawTx (and of initial request)

```ts
txid: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetReqsAndBeefDetail

```ts
export interface GetReqsAndBeefDetail {
    txid: string;
    req?: TableProvenTxReq;
    proven?: TableProvenTx;
    status: "readyToSend" | "alreadySent" | "error" | "unknown";
    error?: string;
}
```

See also: [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetReqsAndBeefResult

```ts
export interface GetReqsAndBeefResult {
    beef: Beef;
    details: GetReqsAndBeefDetail[];
}
```

See also: [GetReqsAndBeefDetail](./storage.md#interface-getreqsandbeefdetail)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetScriptHashHistory

```ts
export interface GetScriptHashHistory {
    txid: string;
    height?: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetScriptHashHistoryResult

```ts
export interface GetScriptHashHistoryResult {
    name: string;
    status: "success" | "error";
    error?: WalletError;
    history: GetScriptHashHistory[];
}
```

See also: [GetScriptHashHistory](./client.md#interface-getscripthashhistory), [WalletError](./client.md#class-walleterror)

###### Property error

When status is 'error', provides code and description

```ts
error?: WalletError
```
See also: [WalletError](./client.md#class-walleterror)

###### Property history

Transaction txid (and height if mined) that consumes the script hash. May not be a complete history.

```ts
history: GetScriptHashHistory[]
```
See also: [GetScriptHashHistory](./client.md#interface-getscripthashhistory)

###### Property name

The name of the service to which the transaction was submitted for processing

```ts
name: string
```

###### Property status

'success' - the operation was successful, non-error results are valid.
'error' - the operation failed, error may have relevant information.

```ts
status: "success" | "error"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetStatusForTxidsResult

```ts
export interface GetStatusForTxidsResult {
    name: string;
    status: "success" | "error";
    error?: WalletError;
    results: StatusForTxidResult[];
}
```

See also: [StatusForTxidResult](./client.md#interface-statusfortxidresult), [WalletError](./client.md#class-walleterror)

###### Property error

The first exception error that occurred during processing, if any.

```ts
error?: WalletError
```
See also: [WalletError](./client.md#class-walleterror)

###### Property name

The name of the service returning these results.

```ts
name: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetUtxoStatusDetails

```ts
export interface GetUtxoStatusDetails {
    height?: number;
    txid?: string;
    index?: number;
    satoshis?: number;
}
```

###### Property height

if isUtxo, the block height containing the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
height?: number
```

###### Property index

if isUtxo, the output index in the transaction containing of the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
index?: number
```

###### Property satoshis

if isUtxo, the amount of the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
satoshis?: number
```

###### Property txid

if isUtxo, the transaction hash (txid) of the transaction containing the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
txid?: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GetUtxoStatusResult

```ts
export interface GetUtxoStatusResult {
    name: string;
    status: "success" | "error";
    error?: WalletError;
    isUtxo?: boolean;
    details: GetUtxoStatusDetails[];
}
```

See also: [GetUtxoStatusDetails](./client.md#interface-getutxostatusdetails), [WalletError](./client.md#class-walleterror)

###### Property details

Additional details about occurances of this output script as a utxo.

Normally there will be one item in the array but due to the possibility of orphan races
there could be more than one block in which it is a valid utxo.

```ts
details: GetUtxoStatusDetails[]
```
See also: [GetUtxoStatusDetails](./client.md#interface-getutxostatusdetails)

###### Property error

When status is 'error', provides code and description

```ts
error?: WalletError
```
See also: [WalletError](./client.md#class-walleterror)

###### Property isUtxo

true if the output is associated with at least one unspent transaction output

```ts
isUtxo?: boolean
```

###### Property name

The name of the service to which the transaction was submitted for processing

```ts
name: string
```

###### Property status

'success' - the operation was successful, non-error results are valid.
'error' - the operation failed, error may have relevant information.

```ts
status: "success" | "error"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GroupedPermissionRequest

The object passed to the UI when a grouped permission is requested.

```ts
export interface GroupedPermissionRequest {
    originator: string;
    requestID: string;
    permissions: GroupedPermissions;
}
```

See also: [GroupedPermissions](./client.md#interface-groupedpermissions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: GroupedPermissions

Describes a group of permissions that can be requested together.
This structure is based on BRC-73.

```ts
export interface GroupedPermissions {
    description?: string;
    spendingAuthorization?: {
        amount: number;
        description: string;
    };
    protocolPermissions?: Array<{
        protocolID: WalletProtocol;
        counterparty?: string;
        description: string;
    }>;
    basketAccess?: Array<{
        basket: string;
        description: string;
    }>;
    certificateAccess?: Array<{
        type: string;
        fields: string[];
        verifierPublicKey: string;
        description: string;
    }>;
}
```

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
##### Interface: KeyPair

```ts
export interface KeyPair {
    privateKey: string;
    publicKey: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: KeyPairAddress

```ts
export interface KeyPairAddress {
    privateKey: PrivateKey;
    publicKey: PublicKey;
    address: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ListActionsSpecOp

```ts
export interface ListActionsSpecOp {
    name: string;
    labelsToIntercept?: string[];
    setStatusFilter?: () => TransactionStatus[];
    postProcess?: (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListActionsArgs, specOpLabels: string[], txs: Partial<TableTransaction>[]) => Promise<void>;
}
```

See also: [AuthId](./client.md#interface-authid), [StorageProvider](./storage.md#class-storageprovider), [TableTransaction](./storage.md#interface-tabletransaction), [TransactionStatus](./client.md#type-transactionstatus)

###### Property labelsToIntercept

undefined to intercept no labels from vargs,
empty array to intercept all labels,
or an explicit array of labels to intercept.

```ts
labelsToIntercept?: string[]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ListOutputsSpecOp

```ts
export interface ListOutputsSpecOp {
    name: string;
    useBasket?: string;
    ignoreLimit?: boolean;
    includeOutputScripts?: boolean;
    includeSpent?: boolean;
    resultFromTags?: (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListOutputsArgs, specOpTags: string[]) => Promise<ListOutputsResult>;
    resultFromOutputs?: (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]) => Promise<ListOutputsResult>;
    filterOutputs?: (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]) => Promise<TableOutput[]>;
    tagsToIntercept?: string[];
    tagsParamsCount?: number;
}
```

See also: [AuthId](./client.md#interface-authid), [StorageProvider](./storage.md#class-storageprovider), [TableOutput](./storage.md#interface-tableoutput)

###### Property tagsParamsCount

How many positional tags to intercept.

```ts
tagsParamsCount?: number
```

###### Property tagsToIntercept

undefined to intercept no tags from vargs,
empty array to intercept all tags,
or an explicit array of tags to intercept.

```ts
tagsToIntercept?: string[]
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
##### Interface: MonitorOptions

```ts
export interface MonitorOptions {
    chain: Chain;
    services: Services;
    storage: MonitorStorage;
    chaintracks: ChaintracksClientApi;
    chaintracksWithEvents?: Chaintracks;
    msecsWaitPerMerkleProofServiceReq: number;
    taskRunWaitMsecs: number;
    abandonedMsecs: number;
    unprovenAttemptsLimitTest: number;
    unprovenAttemptsLimitMain: number;
    onTransactionBroadcasted?: (broadcastResult: ReviewActionResult) => Promise<void>;
    onTransactionProven?: (txStatus: ProvenTransactionStatus) => Promise<void>;
}
```

See also: [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [ChaintracksClientApi](./services.md#interface-chaintracksclientapi), [MonitorStorage](./monitor.md#type-monitorstorage), [ProvenTransactionStatus](./client.md#interface-proventransactionstatus), [ReviewActionResult](./client.md#interface-reviewactionresult), [Services](./services.md#class-services)

###### Property msecsWaitPerMerkleProofServiceReq

How many msecs to wait after each getMerkleProof service request.

```ts
msecsWaitPerMerkleProofServiceReq: number
```

###### Property onTransactionBroadcasted

These are hooks for a wallet-toolbox client to get transaction updates.

```ts
onTransactionBroadcasted?: (broadcastResult: ReviewActionResult) => Promise<void>
```
See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: OutPoint

Identifies a unique transaction output by its `txid` and index `vout`

```ts
export interface OutPoint {
    txid: string;
    vout: number;
}
```

###### Property txid

Transaction double sha256 hash as big endian hex string

```ts
txid: string
```

###### Property vout

zero based output index within the transaction

```ts
vout: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: Paged

```ts
export interface Paged {
    limit: number;
    offset?: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PendingSignAction

```ts
export interface PendingSignAction {
    reference: string;
    dcr: StorageCreateActionResult;
    args: Validation.ValidCreateActionArgs;
    tx: BsvTransaction;
    amount: number;
    pdi: PendingStorageInput[];
}
```

See also: [PendingStorageInput](./client.md#interface-pendingstorageinput), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PendingStorageInput

```ts
export interface PendingStorageInput {
    vin: number;
    derivationPrefix: string;
    derivationSuffix: string;
    unlockerPubKey?: string;
    sourceSatoshis: number;
    lockingScript: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PermissionRequest

Describes a single requested permission that the user must either grant or deny.

Four categories of permission are supported, each with a unique protocol:
 1) protocol - "DPACP" (Domain Protocol Access Control Protocol)
 2) basket   - "DBAP"  (Domain Basket Access Protocol)
 3) certificate - "DCAP" (Domain Certificate Access Protocol)
 4) spending - "DSAP"  (Domain Spending Authorization Protocol)

This model underpins "requests" made to the user for permission, which the user can
either grant or deny. The manager can then create on-chain tokens (PushDrop outputs)
if permission is granted. Denying requests cause the underlying operation to throw,
and no token is created. An "ephemeral" grant is also possible, denoting a one-time
authorization without an associated persistent on-chain token.

```ts
export interface PermissionRequest {
    type: "protocol" | "basket" | "certificate" | "spending";
    originator: string;
    displayOriginator?: string;
    privileged?: boolean;
    protocolID?: WalletProtocol;
    counterparty?: string;
    basket?: string;
    certificate?: {
        verifier: string;
        certType: string;
        fields: string[];
    };
    spending?: {
        satoshis: number;
        lineItems?: Array<{
            type: "input" | "output" | "fee";
            description: string;
            satoshis: number;
        }>;
    };
    reason?: string;
    renewal?: boolean;
    previousToken?: PermissionToken;
}
```

See also: [PermissionToken](./client.md#interface-permissiontoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PermissionToken

Data structure representing an on-chain permission token.
It is typically stored as a single unspent PushDrop output in a special "internal" admin basket belonging to
the user, held in their underlying wallet.

It can represent any of the four permission categories by having the relevant fields:
 - DPACP: originator, privileged, protocol, securityLevel, counterparty
 - DBAP:  originator, basketName
 - DCAP:  originator, privileged, verifier, certType, certFields
 - DSAP:  originator, authorizedAmount

```ts
export interface PermissionToken {
    txid: string;
    tx: number[];
    outputIndex: number;
    outputScript: string;
    satoshis: number;
    originator: string;
    rawOriginator?: string;
    expiry: number;
    privileged?: boolean;
    protocol?: string;
    securityLevel?: 0 | 1 | 2;
    counterparty?: string;
    basketName?: string;
    certType?: string;
    certFields?: string[];
    verifier?: string;
    authorizedAmount?: number;
}
```

###### Property authorizedAmount

For DSAP, the maximum authorized spending for the month.

```ts
authorizedAmount?: number
```

###### Property basketName

The name of a basket, if this is a DBAP token.

```ts
basketName?: string
```

###### Property certFields

The certificate fields that this token covers, if DCAP token.

```ts
certFields?: string[]
```

###### Property certType

The certificate type, if this is a DCAP token.

```ts
certType?: string
```

###### Property counterparty

The counterparty, for DPACP.

```ts
counterparty?: string
```

###### Property expiry

The expiration time for this token in UNIX epoch seconds. (0 or omitted for spending authorizations, which are indefinite)

```ts
expiry: number
```

###### Property originator

The originator domain or FQDN that is allowed to use this permission.

```ts
originator: string
```

###### Property outputIndex

The output index within that transaction.

```ts
outputIndex: number
```

###### Property outputScript

The exact script hex for the locking script.

```ts
outputScript: string
```

###### Property privileged

Whether this token grants privileged usage (for protocol or certificate).

```ts
privileged?: boolean
```

###### Property protocol

The protocol name, if this is a DPACP token.

```ts
protocol?: string
```

###### Property rawOriginator

The raw, unnormalized originator string captured at the time the permission
token was created. This is preserved so we can continue to recognize legacy
permissions that were stored with different casing or explicit default ports.

```ts
rawOriginator?: string
```

###### Property satoshis

The amount of satoshis assigned to the permission output (often 1).

```ts
satoshis: number
```

###### Property securityLevel

The security level (0,1,2) for DPACP.

```ts
securityLevel?: 0 | 1 | 2
```

###### Property tx

The current transaction encapsulating the token.

```ts
tx: number[]
```

###### Property txid

The transaction ID where this token resides.

```ts
txid: string
```

###### Property verifier

The "verifier" public key string, if DCAP.

```ts
verifier?: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PermissionsManagerConfig

Configuration object for the WalletPermissionsManager. If a given option is `false`,
the manager will skip or alter certain permission checks or behaviors.

By default, all of these are `true` unless specified otherwise. This is the most secure configuration.

```ts
export interface PermissionsManagerConfig {
    permissionModules?: Record<string, PermissionsModule>;
    seekProtocolPermissionsForSigning?: boolean;
    seekProtocolPermissionsForEncrypting?: boolean;
    seekProtocolPermissionsForHMAC?: boolean;
    seekPermissionsForKeyLinkageRevelation?: boolean;
    seekPermissionsForPublicKeyRevelation?: boolean;
    seekPermissionsForIdentityKeyRevelation?: boolean;
    seekPermissionsForIdentityResolution?: boolean;
    seekBasketInsertionPermissions?: boolean;
    seekBasketRemovalPermissions?: boolean;
    seekBasketListingPermissions?: boolean;
    seekPermissionWhenApplyingActionLabels?: boolean;
    seekPermissionWhenListingActionsByLabel?: boolean;
    seekCertificateDisclosurePermissions?: boolean;
    seekCertificateAcquisitionPermissions?: boolean;
    seekCertificateRelinquishmentPermissions?: boolean;
    seekCertificateListingPermissions?: boolean;
    encryptWalletMetadata?: boolean;
    seekSpendingPermissions?: boolean;
    seekGroupedPermission?: boolean;
    differentiatePrivilegedOperations?: boolean;
}
```

See also: [PermissionsModule](./client.md#interface-permissionsmodule)

###### Property differentiatePrivilegedOperations

If false, permissions are checked without regard for whether we are in
privileged mode. Privileged status is ignored with respect to whether
permissions are granted. Internally, they are always sought and checked
with privileged=false, regardless of the actual value.

```ts
differentiatePrivilegedOperations?: boolean
```

###### Property encryptWalletMetadata

Should transaction descriptions, input descriptions, and output descriptions be encrypted
when before they are passed to the underlying wallet, and transparently decrypted when retrieved?

```ts
encryptWalletMetadata?: boolean
```

###### Property permissionModules

A map of P-basket/protocol permission scheme modules.

Keys are scheme IDs (e.g., "btms"), values are PermissionsModule instances.

Each module handles basket/protocol names of the form: `p <schemeID> <rest...>`

The WalletPermissionManager detects P-prefix baskets/protocols and delegates
request/response transformation to the corresponding module.

If no module exists for a given schemeID, the wallet will reject access.

```ts
permissionModules?: Record<string, PermissionsModule>
```
See also: [PermissionsModule](./client.md#interface-permissionsmodule)

###### Property seekBasketInsertionPermissions

When we do internalizeAction with `basket insertion`, or include outputs in baskets
with `createAction, do we ask for basket permission?

```ts
seekBasketInsertionPermissions?: boolean
```

###### Property seekBasketListingPermissions

When listOutputs is called, do we ask for basket permission?

```ts
seekBasketListingPermissions?: boolean
```

###### Property seekBasketRemovalPermissions

When relinquishOutput is called, do we ask for basket permission?

```ts
seekBasketRemovalPermissions?: boolean
```

###### Property seekCertificateAcquisitionPermissions

If acquiring a certificate (acquireCertificate), do we require a permission check?

```ts
seekCertificateAcquisitionPermissions?: boolean
```

###### Property seekCertificateDisclosurePermissions

If proving a certificate (proveCertificate) or revealing certificate fields,
do we require a "certificate access" permission?

```ts
seekCertificateDisclosurePermissions?: boolean
```

###### Property seekCertificateListingPermissions

If listing a user's certificates (listCertificates), do we require a permission check?

```ts
seekCertificateListingPermissions?: boolean
```

###### Property seekCertificateRelinquishmentPermissions

If relinquishing a certificate (relinquishCertificate), do we require a permission check?

```ts
seekCertificateRelinquishmentPermissions?: boolean
```

###### Property seekGroupedPermission

If true, triggers a grouped permission request flow based on the originator's `manifest.json`.

```ts
seekGroupedPermission?: boolean
```

###### Property seekPermissionWhenApplyingActionLabels

When createAction is called with labels, do we ask for "label usage" permission?

```ts
seekPermissionWhenApplyingActionLabels?: boolean
```

###### Property seekPermissionWhenListingActionsByLabel

When listActions is called with labels, do we ask for "label usage" permission?

```ts
seekPermissionWhenListingActionsByLabel?: boolean
```

###### Property seekPermissionsForIdentityKeyRevelation

If getPublicKey is requested with `identityKey=true`, do we require permission?

```ts
seekPermissionsForIdentityKeyRevelation?: boolean
```

###### Property seekPermissionsForIdentityResolution

If discoverByIdentityKey / discoverByAttributes are called, do we require permission
for "identity resolution" usage?

```ts
seekPermissionsForIdentityResolution?: boolean
```

###### Property seekPermissionsForKeyLinkageRevelation

For revealing counterparty-level or specific key linkage revelation information,
should we require permission?

```ts
seekPermissionsForKeyLinkageRevelation?: boolean
```

###### Property seekPermissionsForPublicKeyRevelation

For revealing any user public key (getPublicKey) **other** than the identity key,
should we require permission?

```ts
seekPermissionsForPublicKeyRevelation?: boolean
```

###### Property seekProtocolPermissionsForEncrypting

For methods that perform encryption (encrypt/decrypt), require
a "protocol usage" permission check?

```ts
seekProtocolPermissionsForEncrypting?: boolean
```

###### Property seekProtocolPermissionsForHMAC

For methods that perform HMAC creation or verification (createHmac, verifyHmac),
require a "protocol usage" permission check?

```ts
seekProtocolPermissionsForHMAC?: boolean
```

###### Property seekProtocolPermissionsForSigning

For `createSignature` and `verifySignature`,
require a "protocol usage" permission check?

```ts
seekProtocolPermissionsForSigning?: boolean
```

###### Property seekSpendingPermissions

If the originator tries to spend wallet funds (netSpent > 0 in createAction),
do we seek spending authorization?

```ts
seekSpendingPermissions?: boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PermissionsModule

A permissions module handles request/response transformation for a specific P-protocol or P-basket scheme under BRC-98/99.
Modules are registered in the config mapped by their scheme ID.

```ts
export interface PermissionsModule {
    onRequest(req: {
        method: string;
        args: object;
        originator: string;
    }): Promise<{
        args: object;
    }>;
    onResponse(res: any, context: {
        method: string;
        originator: string;
    }): Promise<any>;
}
```

###### Method onRequest

Transforms the request before it's passed to the underlying wallet.
Can check and enforce permissions, throw errors, or modify any arguments as needed prior to invocation.

```ts
onRequest(req: {
    method: string;
    args: object;
    originator: string;
}): Promise<{
    args: object;
}>
```

Returns

Transformed arguments that will be passed to the underlying wallet

Argument Details

+ **req**
  + The incoming request with method, args, and originator

###### Method onResponse

Transforms the response from the underlying wallet before returning to caller.

```ts
onResponse(res: any, context: {
    method: string;
    originator: string;
}): Promise<any>
```

Returns

Transformed response to return to the caller

Argument Details

+ **res**
  + The response from the underlying wallet
+ **context**
  + Metadata about the original request (method, originator)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostBeefResult

```ts
export interface PostBeefResult extends PostTxsResult {
}
```

See also: [PostTxsResult](./client.md#interface-posttxsresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostBeefResultForTxidApi

```ts
export interface PostBeefResultForTxidApi {
    txid: string;
    status: "success" | "error";
    alreadyKnown?: boolean;
    blockHash?: string;
    blockHeight?: number;
    merklePath?: string;
}
```

See also: [blockHash](./services.md#function-blockhash)

###### Property alreadyKnown

if true, the transaction was already known to this service. Usually treat as a success.

Potentially stop posting to additional transaction processors.

```ts
alreadyKnown?: boolean
```

###### Property status

'success' - The transaction was accepted for processing

```ts
status: "success" | "error"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostReqsToNetworkDetails

```ts
export interface PostReqsToNetworkDetails {
    txid: string;
    req: EntityProvenTxReq;
    status: PostReqsToNetworkDetailsStatus;
    competingTxs?: string[];
}
```

See also: [EntityProvenTxReq](./storage.md#class-entityproventxreq), [PostReqsToNetworkDetailsStatus](./storage.md#type-postreqstonetworkdetailsstatus)

###### Property competingTxs

Any competing double spend txids reported for this txid

```ts
competingTxs?: string[]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostReqsToNetworkResult

```ts
export interface PostReqsToNetworkResult {
    status: "success" | "error";
    beef: Beef;
    details: PostReqsToNetworkDetails[];
    log: string;
}
```

See also: [PostReqsToNetworkDetails](./storage.md#interface-postreqstonetworkdetails)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostTxResultForTxid

```ts
export interface PostTxResultForTxid {
    txid: string;
    status: "success" | "error";
    alreadyKnown?: boolean;
    doubleSpend?: boolean;
    blockHash?: string;
    blockHeight?: number;
    merklePath?: MerklePath;
    competingTxs?: string[];
    data?: object | string | PostTxResultForTxidError;
    notes?: ReqHistoryNote[];
    serviceError?: boolean;
}
```

See also: [PostTxResultForTxidError](./client.md#interface-posttxresultfortxiderror), [ReqHistoryNote](./client.md#type-reqhistorynote), [blockHash](./services.md#function-blockhash)

###### Property alreadyKnown

if true, the transaction was already known to this service. Usually treat as a success.

Potentially stop posting to additional transaction processors.

```ts
alreadyKnown?: boolean
```

###### Property doubleSpend

service indicated this broadcast double spends at least one input
`competingTxs` may be an array of txids that were first seen spends of at least one input.

```ts
doubleSpend?: boolean
```

###### Property serviceError

true iff service was unable to process a potentially valid transaction

```ts
serviceError?: boolean
```

###### Property status

'success' - The transaction was accepted for processing

```ts
status: "success" | "error"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostTxResultForTxidError

```ts
export interface PostTxResultForTxidError {
    status?: string;
    detail?: string;
    more?: object;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PostTxsResult

Properties on array items of result returned from `WalletServices` function `postBeef`.

```ts
export interface PostTxsResult {
    name: string;
    status: "success" | "error";
    error?: WalletError;
    txidResults: PostTxResultForTxid[];
    data?: object;
    notes?: ReqHistoryNote[];
}
```

See also: [PostTxResultForTxid](./client.md#interface-posttxresultfortxid), [ReqHistoryNote](./client.md#type-reqhistorynote), [WalletError](./client.md#class-walleterror)

###### Property data

Service response object. Use service name and status to infer type of object.

```ts
data?: object
```

###### Property name

The name of the service to which the transaction was submitted for processing

```ts
name: string
```

###### Property status

'success' all txids returned status of 'success'
'error' one or more txids returned status of 'error'. See txidResults for details.

```ts
status: "success" | "error"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProcessSyncChunkResult

```ts
export interface ProcessSyncChunkResult {
    done: boolean;
    maxUpdated_at: Date | undefined;
    updates: number;
    inserts: number;
    error?: WalletError;
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: Profile

Describes the structure of a user profile within the wallet.

```ts
export interface Profile {
    name: string;
    id: number[];
    primaryPad: number[];
    privilegedPad: number[];
    createdAt: number;
}
```

###### Property createdAt

Timestamp (seconds since epoch) when the profile was created.

```ts
createdAt: number
```

###### Property id

Unique 16-byte identifier for the profile.

```ts
id: number[]
```

###### Property name

User-defined name for the profile.

```ts
name: string
```

###### Property primaryPad

32-byte random pad XOR'd with the root primary key to derive the profile's primary key.

```ts
primaryPad: number[]
```

###### Property privilegedPad

32-byte random pad XOR'd with the root privileged key to derive the profile's privileged key.

```ts
privilegedPad: number[]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProvenOrRawTx

```ts
export interface ProvenOrRawTx {
    proven?: TableProvenTx;
    rawTx?: number[];
    inputBEEF?: number[];
}
```

See also: [TableProvenTx](./storage.md#interface-tableproventx)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProvenTransactionStatus

The transaction status that a client will receive when subscribing to transaction updates in the Monitor.

```ts
export interface ProvenTransactionStatus {
    txid: string;
    txIndex: number;
    blockHeight: number;
    blockHash: string;
    merklePath: number[];
    merkleRoot: string;
}
```

See also: [blockHash](./services.md#function-blockhash)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProvenTxFromTxidResult

```ts
export interface ProvenTxFromTxidResult {
    proven?: EntityProvenTx;
    rawTx?: number[];
}
```

See also: [EntityProvenTx](./storage.md#class-entityproventx)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProvenTxReqHistory

```ts
export interface ProvenTxReqHistory {
    notes?: ReqHistoryNote[];
}
```

See also: [ReqHistoryNote](./client.md#type-reqhistorynote)

###### Property notes

Keys are Date().toISOString()
Values are a description of what happened.

```ts
notes?: ReqHistoryNote[]
```
See also: [ReqHistoryNote](./client.md#type-reqhistorynote)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProvenTxReqHistorySummaryApi

```ts
export interface ProvenTxReqHistorySummaryApi {
    setToCompleted: boolean;
    setToCallback: boolean;
    setToUnmined: boolean;
    setToDoubleSpend: boolean;
    setToSending: boolean;
    setToUnconfirmed: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProvenTxReqNotify

```ts
export interface ProvenTxReqNotify {
    transactionIds?: number[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ProviderCallHistory

History of service calls for a single service, single provider.

```ts
export interface ProviderCallHistory {
    providerName: string;
    serviceName: string;
    calls: ServiceCall[];
    totalCounts: ServiceCallHistoryCounts;
    resetCounts: ServiceCallHistoryCounts[];
}
```

See also: [ServiceCall](./services.md#interface-servicecall), [ServiceCallHistoryCounts](./client.md#interface-servicecallhistorycounts)

###### Property calls

Most recent service calls.
Array length is limited by Services configuration.

```ts
calls: ServiceCall[]
```
See also: [ServiceCall](./services.md#interface-servicecall)

###### Property resetCounts

Entry [0] is always the current interval being extended by new calls.
when `getServiceCallHistory` with `reset` true is called, a new interval with zero counts is added to the start of array.
Array length is limited by Services configuration.

```ts
resetCounts: ServiceCallHistoryCounts[]
```
See also: [ServiceCallHistoryCounts](./client.md#interface-servicecallhistorycounts)

###### Property totalCounts

Counts since creation of Services instance.

```ts
totalCounts: ServiceCallHistoryCounts
```
See also: [ServiceCallHistoryCounts](./client.md#interface-servicecallhistorycounts)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PurgeParams

```ts
export interface PurgeParams {
    purgeCompleted: boolean;
    purgeFailed: boolean;
    purgeSpent: boolean;
    purgeCompletedAge?: number;
    purgeFailedAge?: number;
    purgeSpentAge?: number;
}
```

###### Property purgeCompletedAge

Minimum age in msecs for transient completed transaction data purge.
Default is 14 days.

```ts
purgeCompletedAge?: number
```

###### Property purgeFailedAge

Minimum age in msecs for failed transaction data purge.
Default is 14 days.

```ts
purgeFailedAge?: number
```

###### Property purgeSpentAge

Minimum age in msecs for failed transaction data purge.
Default is 14 days.

```ts
purgeSpentAge?: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: PurgeResults

```ts
export interface PurgeResults {
    count: number;
    log: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ReproveHeaderResult

Returned results from WalletStorageManager reproveHeader method.

```ts
export interface ReproveHeaderResult {
    log: string;
    updated: {
        was: TableProvenTx;
        update: Partial<TableProvenTx>;
        logUpdate: string;
    }[];
    unchanged: TableProvenTx[];
    unavailable: TableProvenTx[];
}
```

See also: [TableProvenTx](./storage.md#interface-tableproventx)

###### Property log

Human readable log of the reproveHeader process.

```ts
log: string
```

###### Property unavailable

List of proven_txs records that were checked but currently proof data is unavailable.

```ts
unavailable: TableProvenTx[]
```
See also: [TableProvenTx](./storage.md#interface-tableproventx)

###### Property unchanged

List of proven_txs records that were checked but currently available proof is unchanged.

```ts
unchanged: TableProvenTx[]
```
See also: [TableProvenTx](./storage.md#interface-tableproventx)

###### Property updated

List of proven_txs records that were updated with new proof data.

```ts
updated: {
    was: TableProvenTx;
    update: Partial<TableProvenTx>;
    logUpdate: string;
}[]
```
See also: [TableProvenTx](./storage.md#interface-tableproventx)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ReproveProvenResult

Returned results from WalletStorageManager reproveProven method.

```ts
export interface ReproveProvenResult {
    log: string;
    updated?: {
        update: Partial<TableProvenTx>;
        logUpdate: string;
    };
    unchanged: boolean;
    unavailable: boolean;
}
```

See also: [TableProvenTx](./storage.md#interface-tableproventx)

###### Property log

Human readable log of the reproveProven process.

```ts
log: string
```

###### Property unavailable

True if proof data for proven_txs record is currently unavailable.

```ts
unavailable: boolean
```

###### Property unchanged

True if proof data for proven_txs record was found to be unchanged.

```ts
unchanged: boolean
```

###### Property updated

Valid if proof data for proven_txs record is available and has changed.

```ts
updated?: {
    update: Partial<TableProvenTx>;
    logUpdate: string;
}
```
See also: [TableProvenTx](./storage.md#interface-tableproventx)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: RequestSyncChunkArgs

```ts
export interface RequestSyncChunkArgs {
    fromStorageIdentityKey: string;
    toStorageIdentityKey: string;
    identityKey: string;
    since?: Date;
    maxRoughSize: number;
    maxItems: number;
    offsets: {
        name: string;
        offset: number;
    }[];
}
```

###### Property fromStorageIdentityKey

The storageIdentityKey of the storage supplying the update SyncChunk data.

```ts
fromStorageIdentityKey: string
```

###### Property identityKey

The identity of whose data is being requested

```ts
identityKey: string
```

###### Property maxItems

The maximum number of items (records) to be returned.

```ts
maxItems: number
```

###### Property maxRoughSize

A rough limit on how large the response should be.
The item that exceeds the limit is included and ends adding more items.

```ts
maxRoughSize: number
```

###### Property offsets

For each entity in dependency order, the offset at which to start returning items
from `since`.

The entity order is:
0 ProvenTxs
1 ProvenTxReqs
2 OutputBaskets
3 TxLabels
4 OutputTags
5 Transactions
6 TxLabelMaps
7 Commissions
8 Outputs
9 OutputTagMaps
10 Certificates
11 CertificateFields

```ts
offsets: {
    name: string;
    offset: number;
}[]
```

###### Property since

The max updated_at time received from the storage service receiving the request.
Will be undefiend if this is the first request or if no data was previously sync'ed.

`since` must include items if 'updated_at' is greater or equal. Thus, when not undefined, a sync request should always return at least one item already seen.

```ts
since?: Date
```

###### Property toStorageIdentityKey

The storageIdentityKey of the storage consuming the update SyncChunk data.

```ts
toStorageIdentityKey: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ReviewActionResult

```ts
export interface ReviewActionResult {
    txid: TXIDHexString;
    status: ReviewActionResultStatus;
    competingTxs?: string[];
    competingBeef?: number[];
}
```

See also: [ReviewActionResultStatus](./client.md#type-reviewactionresultstatus)

###### Property competingBeef

Merged beef of competingTxs, valid when status is 'doubleSpend'.

```ts
competingBeef?: number[]
```

###### Property competingTxs

Any competing txids reported for this txid, valid when status is 'doubleSpend'.

```ts
competingTxs?: string[]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ScriptTemplateParamsBRC29

```ts
export interface ScriptTemplateParamsBRC29 {
    derivationPrefix?: string;
    derivationSuffix?: string;
    keyDeriver: KeyDeriverApi;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ScriptTemplateUnlock

```ts
export interface ScriptTemplateUnlock {
    sign: (tx: Transaction, inputIndex: number) => Promise<UnlockingScript>;
    estimateLength: (tx: Transaction, inputIndex: number) => Promise<number>;
}
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
##### Interface: ServiceCall

Minimum data tracked for each service call.

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
##### Interface: ServiceCallHistory

History of service calls for a single service, all providers.

```ts
export interface ServiceCallHistory {
    serviceName: string;
    historyByProvider: Record<string, ProviderCallHistory>;
}
```

See also: [ProviderCallHistory](./client.md#interface-providercallhistory)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ServiceCallHistoryCounts

Counts of service calls over a time interval.

```ts
export interface ServiceCallHistoryCounts {
    success: number;
    failure: number;
    error: number;
    since: Date | string;
    until: Date | string;
}
```

###### Property error

of failures (success false), count of calls with valid error code and message.

```ts
error: number
```

###### Property failure

count of calls returning success false.

```ts
failure: number
```

###### Property since

Counts are of calls over interval `since` to `until`.
string value must be Date's toISOString format.

```ts
since: Date | string
```

###### Property success

count of calls returning success true.

```ts
success: number
```

###### Property until

Counts are of calls over interval `since` to `until`.
string value must be Date's toISOString format.

```ts
until: Date | string
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
##### Interface: SetupClientWalletArgs

Arguments used by `createWallet` to construct a `SetupWallet`.

Extension `SetupWalletClientArgs` used by `createWalletClient` to construct a `SetupWalletClient`.

Extension `SetupWalletIdbArgs` used by `createWalletIdb` to construct a `SetupWalletIdb`.

```ts
export interface SetupClientWalletArgs {
    chain: Chain;
    rootKeyHex: string;
    privilegedKeyGetter?: () => Promise<PrivateKey>;
    active?: WalletStorageProvider;
    backups?: WalletStorageProvider[];
    taalApiKey?: string;
}
```

See also: [Chain](./client.md#type-chain), [WalletStorageProvider](./client.md#interface-walletstorageprovider)

###### Property active

Optional. Active wallet storage. Can be added later.

```ts
active?: WalletStorageProvider
```
See also: [WalletStorageProvider](./client.md#interface-walletstorageprovider)

###### Property backups

Optional. One or more storage providers managed as backup destinations. Can be added later.

```ts
backups?: WalletStorageProvider[]
```
See also: [WalletStorageProvider](./client.md#interface-walletstorageprovider)

###### Property privilegedKeyGetter

Optional. The privileged private key getter used to initialize the `PrivilegedKeyManager`.
Defaults to undefined.

```ts
privilegedKeyGetter?: () => Promise<PrivateKey>
```

###### Property rootKeyHex

The non-privileged private key used to initialize the `KeyDeriver` and determine the `identityKey`.

```ts
rootKeyHex: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupClientWalletClientArgs

Extension `SetupWalletClientArgs` of `SetupWalletArgs` is used by `createWalletClient`
to construct a `SetupWalletClient`.

```ts
export interface SetupClientWalletClientArgs extends SetupClientWalletArgs {
    endpointUrl?: string;
}
```

See also: [SetupClientWalletArgs](./setup.md#interface-setupclientwalletargs)

###### Property endpointUrl

The endpoint URL of a service hosting the `StorageServer` JSON-RPC service to
which a `StorageClient` instance should connect to function as
the active storage provider of the newly created wallet.

```ts
endpointUrl?: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWallet

When creating a BRC-100 compatible `Wallet`, many components come into play.

All of the `createWallet` functions in the `Setup` and `SetupClient` classes return
an object with direct access to each component to facilitate experimentation, testing
and customization.

```ts
export interface SetupWallet {
    rootKey: PrivateKey;
    identityKey: string;
    keyDeriver: KeyDeriverApi;
    chain: Chain;
    storage: WalletStorageManager;
    services: Services;
    monitor: Monitor;
    wallet: Wallet;
}
```

See also: [Chain](./client.md#type-chain), [Monitor](./monitor.md#class-monitor), [Services](./services.md#class-services), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager)

###### Property chain

The chain ('main' or 'test') which the wallet accesses.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property identityKey

The pubilc key associated with the `rootKey` which also serves as the wallet's identity.

```ts
identityKey: string
```

###### Property keyDeriver

The `KeyDeriver` component used by the wallet for key derivation and cryptographic functions.

```ts
keyDeriver: KeyDeriverApi
```

###### Property monitor

The background task `Monitor` component available to the wallet to offload tasks
that speed up wallet operations and maintain data integrity.

```ts
monitor: Monitor
```
See also: [Monitor](./monitor.md#class-monitor)

###### Property rootKey

The rootKey of the `KeyDeriver`. The private key from which other keys are derived.

```ts
rootKey: PrivateKey
```

###### Property services

The network `Services` component which provides the wallet with access to external services hosted
on the public network.

```ts
services: Services
```
See also: [Services](./services.md#class-services)

###### Property storage

The `WalletStorageManager` that manages all the configured storage providers (active and backups)
accessed by the wallet.

```ts
storage: WalletStorageManager
```
See also: [WalletStorageManager](./storage.md#class-walletstoragemanager)

###### Property wallet

The actual BRC-100 `Wallet` to which all the other properties and components contribute.

Note that internally, the wallet is itself linked to all these properties and components.
They are included in this interface to facilitate access after wallet construction for
experimentation, testing and customization. Any changes made to the configuration of these
components after construction may disrupt the normal operation of the wallet.

```ts
wallet: Wallet
```
See also: [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWalletClient

Extension `SetupWalletClient` of `SetupWallet` is returned by `createWalletClient`

```ts
export interface SetupWalletClient extends SetupWallet {
    endpointUrl: string;
}
```

See also: [SetupWallet](./setup.md#interface-setupwallet)

###### Property endpointUrl

The endpoint URL of the service hosting the `StorageServer` JSON-RPC service to
which a `StorageClient` instance is connected to function as
the active storage provider of the wallet.

```ts
endpointUrl: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWalletIdb

```ts
export interface SetupWalletIdb extends SetupWallet {
    activeStorage: StorageIdb;
    userId: number;
    rootKey: PrivateKey;
    identityKey: string;
    keyDeriver: KeyDeriverApi;
    chain: Chain;
    storage: WalletStorageManager;
    services: Services;
    monitor: Monitor;
    wallet: Wallet;
}
```

See also: [Chain](./client.md#type-chain), [Monitor](./monitor.md#class-monitor), [Services](./services.md#class-services), [SetupWallet](./setup.md#interface-setupwallet), [StorageIdb](./storage.md#class-storageidb), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWalletIdbArgs

```ts
export interface SetupWalletIdbArgs extends SetupClientWalletArgs {
    databaseName: string;
}
```

See also: [SetupClientWalletArgs](./setup.md#interface-setupclientwalletargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SignActionResultX

```ts
export interface SignActionResultX extends SignActionResult {
    txid?: TXIDHexString;
    tx?: AtomicBEEF;
    sendWithResults?: SendWithResult[];
    notDelayedResults?: ReviewActionResult[];
}
```

See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StartAuthResponse

```ts
export interface StartAuthResponse {
    success: boolean;
    message?: string;
    data?: any;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StatusForTxidResult

```ts
export interface StatusForTxidResult {
    txid: string;
    depth: number | undefined;
    status: "mined" | "known" | "unknown";
}
```

###### Property depth

roughly depth of block containing txid from chain tip.

```ts
depth: number | undefined
```

###### Property status

'mined' if depth > 0
'known' if depth === 0
'unknown' if depth === undefined, txid may be old an purged or never processed.

```ts
status: "mined" | "known" | "unknown"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageAdminStats

```ts
export interface StorageAdminStats {
    requestedBy: string;
    when: string;
    usersDay: number;
    usersWeek: number;
    usersMonth: number;
    usersTotal: number;
    transactionsDay: number;
    transactionsWeek: number;
    transactionsMonth: number;
    transactionsTotal: number;
    txCompletedDay: number;
    txCompletedWeek: number;
    txCompletedMonth: number;
    txCompletedTotal: number;
    txFailedDay: number;
    txFailedWeek: number;
    txFailedMonth: number;
    txFailedTotal: number;
    txUnprocessedDay: number;
    txUnprocessedWeek: number;
    txUnprocessedMonth: number;
    txUnprocessedTotal: number;
    txSendingDay: number;
    txSendingWeek: number;
    txSendingMonth: number;
    txSendingTotal: number;
    txUnprovenDay: number;
    txUnprovenWeek: number;
    txUnprovenMonth: number;
    txUnprovenTotal: number;
    txUnsignedDay: number;
    txUnsignedWeek: number;
    txUnsignedMonth: number;
    txUnsignedTotal: number;
    txNosendDay: number;
    txNosendWeek: number;
    txNosendMonth: number;
    txNosendTotal: number;
    txNonfinalDay: number;
    txNonfinalWeek: number;
    txNonfinalMonth: number;
    txNonfinalTotal: number;
    txUnfailDay: number;
    txUnfailWeek: number;
    txUnfailMonth: number;
    txUnfailTotal: number;
    satoshisDefaultDay: number;
    satoshisDefaultWeek: number;
    satoshisDefaultMonth: number;
    satoshisDefaultTotal: number;
    satoshisOtherDay: number;
    satoshisOtherWeek: number;
    satoshisOtherMonth: number;
    satoshisOtherTotal: number;
    basketsDay: number;
    basketsWeek: number;
    basketsMonth: number;
    basketsTotal: number;
    labelsDay: number;
    labelsWeek: number;
    labelsMonth: number;
    labelsTotal: number;
    tagsDay: number;
    tagsWeek: number;
    tagsMonth: number;
    tagsTotal: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageCreateActionResult

```ts
export interface StorageCreateActionResult {
    inputBeef?: number[];
    inputs: StorageCreateTransactionSdkInput[];
    outputs: StorageCreateTransactionSdkOutput[];
    noSendChangeOutputVouts?: number[];
    derivationPrefix: string;
    version: number;
    lockTime: number;
    reference: string;
}
```

See also: [StorageCreateTransactionSdkInput](./client.md#interface-storagecreatetransactionsdkinput), [StorageCreateTransactionSdkOutput](./client.md#interface-storagecreatetransactionsdkoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageCreateTransactionSdkInput

```ts
export interface StorageCreateTransactionSdkInput {
    vin: number;
    sourceTxid: string;
    sourceVout: number;
    sourceSatoshis: number;
    sourceLockingScript: string;
    sourceTransaction?: number[];
    unlockingScriptLength: number;
    providedBy: StorageProvidedBy;
    type: string;
    spendingDescription?: string;
    derivationPrefix?: string;
    derivationSuffix?: string;
    senderIdentityKey?: string;
}
```

See also: [StorageProvidedBy](./client.md#type-storageprovidedby)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageCreateTransactionSdkOutput

```ts
export interface StorageCreateTransactionSdkOutput extends Validation.ValidCreateActionOutput {
    vout: number;
    providedBy: StorageProvidedBy;
    purpose?: string;
    derivationSuffix?: string;
}
```

See also: [StorageProvidedBy](./client.md#type-storageprovidedby)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageFeeModel

Specifies the available options for computing transaction fees.

```ts
export interface StorageFeeModel {
    model: "sat/kb";
    value?: number;
}
```

###### Property model

Available models. Currently only "sat/kb" is supported.

```ts
model: "sat/kb"
```

###### Property value

When "fee.model" is "sat/kb", this is an integer representing the number of satoshis per kb of block space
the transaction will pay in fees.

If undefined, the default value is used.

```ts
value?: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageGetBeefOptions

```ts
export interface StorageGetBeefOptions {
    trustSelf?: "known";
    knownTxids?: string[];
    mergeToBeef?: Beef | number[];
    ignoreStorage?: boolean;
    ignoreServices?: boolean;
    ignoreNewProven?: boolean;
    minProofLevel?: number;
    chainTracker?: ChainTracker;
    skipInvalidProofs?: boolean;
}
```

###### Property chainTracker

optional. If valid, any merkleRoot that fails to validate will result in an exception without merging to `mergeToBeef`.

```ts
chainTracker?: ChainTracker
```

###### Property ignoreNewProven

optional. Default is false. If true, raw transactions with proofs missing from `storage` and obtained from `getServices` are not inserted to `storage`.

```ts
ignoreNewProven?: boolean
```

###### Property ignoreServices

optional. Default is false. `getServices` is used for raw transaction and merkle proof lookup

```ts
ignoreServices?: boolean
```

###### Property ignoreStorage

optional. Default is false. `storage` is used for raw transaction and merkle proof lookup

```ts
ignoreStorage?: boolean
```

###### Property knownTxids

list of txids to be included as txidOnly if referenced. Validity is known to caller.

```ts
knownTxids?: string[]
```

###### Property mergeToBeef

optional. If defined, raw transactions and merkle paths required by txid are merged to this instance and returned. Otherwise a new Beef is constructed and returned.

```ts
mergeToBeef?: Beef | number[]
```

###### Property minProofLevel

optional. Default is zero. Ignores available merkle paths until recursion detpth equals or exceeds value

```ts
minProofLevel?: number
```

###### Property skipInvalidProofs

optional. Default is false. If chainTracker is valid and an invalid proof is found: if true, pursues deeper beef. If false, throws WERR_INVALID_MERKLE_ROOT.

```ts
skipInvalidProofs?: boolean
```

###### Property trustSelf

if 'known', txids known to local storage as valid are included as txidOnly

```ts
trustSelf?: "known"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageIdbOptions

```ts
export interface StorageIdbOptions extends StorageProviderOptions {
}
```

See also: [StorageProviderOptions](./storage.md#interface-storageprovideroptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageIdbSchema

```ts
export interface StorageIdbSchema {
    certificates: {
        key: number;
        value: TableCertificate;
        indexes: {
            userId: number;
            userId_type_certifier_serialNumber: [
                number,
                Base64String,
                PubKeyHex,
                Base64String
            ];
        };
    };
    certificateFields: {
        key: number;
        value: TableCertificateField;
        indexes: {
            userId: number;
            certificateId: number;
        };
    };
    commissions: {
        key: number;
        value: TableCommission;
        indexes: {
            userId: number;
            transactionId: number;
        };
    };
    monitorEvents: {
        key: number;
        value: TableMonitorEvent;
    };
    outputs: {
        key: number;
        value: TableOutput;
        indexes: {
            userId: number;
            transactionId: number;
            basketId: number;
            spentBy: string;
            transactionId_vout_userId: [
                number,
                number,
                number
            ];
        };
    };
    outputBaskets: {
        key: number;
        value: TableOutputBasket;
        indexes: {
            userId: number;
            name_userId: [
                string,
                number
            ];
        };
    };
    outputTags: {
        key: number;
        value: TableOutputTag;
        indexes: {
            userId: number;
            tag_userId: [
                string,
                number
            ];
        };
    };
    outputTagMaps: {
        key: number;
        value: TableOutputTagMap;
        indexes: {
            outputTagId: number;
            outputId: number;
        };
    };
    provenTxs: {
        key: number;
        value: TableProvenTx;
        indexes: {
            txid: HexString;
        };
    };
    provenTxReqs: {
        key: number;
        value: TableProvenTxReq;
        indexes: {
            provenTxId: number;
            txid: HexString;
            status: ProvenTxReqStatus;
            batch: string;
        };
    };
    syncStates: {
        key: number;
        value: TableSyncState;
        indexes: {
            userId: number;
            refNum: string;
            status: SyncStatus;
        };
    };
    settings: {
        key: number;
        value: TableSettings;
        indexes: Record<string, never>;
    };
    transactions: {
        key: number;
        value: TableTransaction;
        indexes: {
            userId: number;
            provenTxId: number;
            reference: string;
            status: TransactionStatus;
        };
    };
    txLabels: {
        key: number;
        value: TableTxLabel;
        indexes: {
            userId: number;
            label_userId: [
                string,
                number
            ];
        };
    };
    txLabelMaps: {
        key: number;
        value: TableTxLabelMap;
        indexes: {
            transactionId: number;
            txLabelId: number;
        };
    };
    users: {
        key: number;
        value: TableUser;
        indexes: {
            identityKey: string;
        };
    };
}
```

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus), [SyncStatus](./client.md#type-syncstatus), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCommission](./storage.md#interface-tablecommission), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser), [TransactionStatus](./client.md#type-transactionstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageIdentity

```ts
export interface StorageIdentity {
    storageIdentityKey: string;
    storageName: string;
}
```

###### Property storageIdentityKey

The identity key (public key) assigned to this storage

```ts
storageIdentityKey: string
```

###### Property storageName

The human readable name assigned to this storage.

```ts
storageName: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageInternalizeActionResult

```ts
export interface StorageInternalizeActionResult extends InternalizeActionResult {
    isMerge: boolean;
    txid: string;
    satoshis: number;
    sendWithResults?: SendWithResult[];
    notDelayedResults?: ReviewActionResult[];
}
```

See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

###### Property isMerge

true if internalizing outputs on an existing storage transaction

```ts
isMerge: boolean
```

###### Property notDelayedResults

valid iff not isMerge and txid was unknown to storage and non-delayed broadcast was not success

```ts
notDelayedResults?: ReviewActionResult[]
```
See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

###### Property satoshis

net change in change balance for user due to this internalization

```ts
satoshis: number
```

###### Property sendWithResults

valid iff not isMerge and txid was unknown to storage and non-delayed broadcast was not success

```ts
sendWithResults?: SendWithResult[]
```

###### Property txid

txid of transaction being internalized

```ts
txid: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageProcessActionArgs

```ts
export interface StorageProcessActionArgs {
    isNewTx: boolean;
    isSendWith: boolean;
    isNoSend: boolean;
    isDelayed: boolean;
    reference?: string;
    txid?: string;
    rawTx?: number[];
    sendWith: string[];
    logger?: WalletLoggerInterface;
}
```

See also: [logger](./client.md#variable-logger)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageProcessActionResults

```ts
export interface StorageProcessActionResults {
    sendWithResults?: SendWithResult[];
    notDelayedResults?: ReviewActionResult[];
    log?: string;
}
```

See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageProvenOrReq

```ts
export interface StorageProvenOrReq {
    proven?: TableProvenTx;
    req?: TableProvenTxReq;
    isNew?: boolean;
}
```

See also: [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageProviderOptions

```ts
export interface StorageProviderOptions extends StorageReaderWriterOptions {
    chain: Chain;
    feeModel: StorageFeeModel;
    commissionSatoshis: number;
    commissionPubKeyHex?: PubKeyHex;
}
```

See also: [Chain](./client.md#type-chain), [StorageFeeModel](./client.md#interface-storagefeemodel), [StorageReaderWriterOptions](./storage.md#interface-storagereaderwriteroptions)

###### Property commissionPubKeyHex

If commissionSatoshis is greater than zero, must be a valid public key hex string.
The actual locking script for each commission will use a public key derived
from this key by information stored in the commissions table.

```ts
commissionPubKeyHex?: PubKeyHex
```

###### Property commissionSatoshis

Transactions created by this Storage can charge a fee per transaction.
A value of zero disables commission fees.

```ts
commissionSatoshis: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageReaderOptions

```ts
export interface StorageReaderOptions {
    chain: sdk.Chain;
}
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageReaderWriterOptions

```ts
export interface StorageReaderWriterOptions extends StorageReaderOptions {
}
```

See also: [StorageReaderOptions](./storage.md#interface-storagereaderoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: StorageSyncReaderOptions

```ts
export interface StorageSyncReaderOptions {
    chain: Chain;
}
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SyncChunk

Result received from remote `WalletStorage` in response to a `RequestSyncChunkArgs` request.

Each property is undefined if there was no attempt to update it. Typically this is caused by size and count limits on this result.

If all properties are empty arrays the sync process has received all available new and updated items.

```ts
export interface SyncChunk {
    fromStorageIdentityKey: string;
    toStorageIdentityKey: string;
    userIdentityKey: string;
    user?: TableUser;
    provenTxs?: TableProvenTx[];
    provenTxReqs?: TableProvenTxReq[];
    outputBaskets?: TableOutputBasket[];
    txLabels?: TableTxLabel[];
    outputTags?: TableOutputTag[];
    transactions?: TableTransaction[];
    txLabelMaps?: TableTxLabelMap[];
    commissions?: TableCommission[];
    outputs?: TableOutput[];
    outputTagMaps?: TableOutputTagMap[];
    certificates?: TableCertificate[];
    certificateFields?: TableCertificateField[];
}
```

See also: [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCommission](./storage.md#interface-tablecommission), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SyncError

```ts
export interface SyncError {
    code: string;
    description: string;
    stack?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SyncMap

```ts
export interface SyncMap {
    provenTx: EntitySyncMap;
    outputBasket: EntitySyncMap;
    transaction: EntitySyncMap;
    provenTxReq: EntitySyncMap;
    txLabel: EntitySyncMap;
    txLabelMap: EntitySyncMap;
    output: EntitySyncMap;
    outputTag: EntitySyncMap;
    outputTagMap: EntitySyncMap;
    certificate: EntitySyncMap;
    certificateField: EntitySyncMap;
    commission: EntitySyncMap;
}
```

See also: [EntitySyncMap](./storage.md#interface-entitysyncmap)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableCertificate

```ts
export interface TableCertificate extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    certificateId: number;
    userId: number;
    type: Base64String;
    serialNumber: Base64String;
    certifier: PubKeyHex;
    subject: PubKeyHex;
    verifier?: PubKeyHex;
    revocationOutpoint: OutpointString;
    signature: HexString;
    isDeleted: boolean;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableCertificateField

```ts
export interface TableCertificateField extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    userId: number;
    certificateId: number;
    fieldName: string;
    fieldValue: string;
    masterKey: Base64String;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableCertificateX

```ts
export interface TableCertificateX extends TableCertificate {
    fields?: TableCertificateField[];
}
```

See also: [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableCommission

```ts
export interface TableCommission extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    commissionId: number;
    userId: number;
    transactionId: number;
    satoshis: number;
    keyOffset: string;
    isRedeemed: boolean;
    lockingScript: number[];
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableMonitorEvent

```ts
export interface TableMonitorEvent extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    id: number;
    event: string;
    details?: string;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableOutput

```ts
export interface TableOutput extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    outputId: number;
    userId: number;
    transactionId: number;
    basketId?: number;
    spendable: boolean;
    change: boolean;
    outputDescription: DescriptionString5to50Bytes;
    vout: number;
    satoshis: number;
    providedBy: sdk.StorageProvidedBy;
    purpose: string;
    type: string;
    txid?: string;
    senderIdentityKey?: PubKeyHex;
    derivationPrefix?: Base64String;
    derivationSuffix?: Base64String;
    customInstructions?: string;
    spentBy?: number;
    sequenceNumber?: number;
    spendingDescription?: string;
    scriptLength?: number;
    scriptOffset?: number;
    lockingScript?: number[];
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [StorageProvidedBy](./client.md#type-storageprovidedby)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableOutputBasket

```ts
export interface TableOutputBasket extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    basketId: number;
    userId: number;
    name: string;
    numberOfDesiredUTXOs: number;
    minimumDesiredUTXOValue: number;
    isDeleted: boolean;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableOutputTag

```ts
export interface TableOutputTag extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    outputTagId: number;
    userId: number;
    tag: string;
    isDeleted: boolean;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableOutputTagMap

```ts
export interface TableOutputTagMap extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    outputTagId: number;
    outputId: number;
    isDeleted: boolean;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableOutputX

```ts
export interface TableOutputX extends TableOutput {
    basket?: TableOutputBasket;
    tags?: TableOutputTag[];
}
```

See also: [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableProvenTx

```ts
export interface TableProvenTx extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    provenTxId: number;
    txid: string;
    height: number;
    index: number;
    merklePath: number[];
    rawTx: number[];
    blockHash: string;
    merkleRoot: string;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [blockHash](./services.md#function-blockhash)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableProvenTxReq

```ts
export interface TableProvenTxReq extends TableProvenTxReqDynamics {
    created_at: Date;
    updated_at: Date;
    provenTxReqId: number;
    provenTxId?: number;
    status: sdk.ProvenTxReqStatus;
    attempts: number;
    notified: boolean;
    txid: string;
    batch?: string;
    history: string;
    notify: string;
    rawTx: number[];
    inputBEEF?: number[];
}
```

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus), [TableProvenTxReqDynamics](./storage.md#interface-tableproventxreqdynamics)

###### Property attempts

Count of how many times a service has been asked about this txid

```ts
attempts: number
```

###### Property batch

If valid, a unique string identifying a batch of transactions to be sent together for processing.

```ts
batch?: string
```

###### Property history

JSON string of processing history.
Parses to `ProvenTxReqHistoryApi`.

```ts
history: string
```

###### Property notified

Set to true when a terminal status has been set and notification has occurred.

```ts
notified: boolean
```

###### Property notify

JSON string of data to drive notifications when this request completes.
Parses to `ProvenTxReqNotifyApi`.

```ts
notify: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableProvenTxReqDynamics

Table properties that may change after initial record insertion.

```ts
export interface TableProvenTxReqDynamics extends sdk.EntityTimeStamp {
    updated_at: Date;
    provenTxId?: number;
    status: sdk.ProvenTxReqStatus;
    attempts: number;
    notified: boolean;
    batch?: string;
    history: string;
    notify: string;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [ProvenTxReqStatus](./client.md#type-proventxreqstatus)

###### Property attempts

Count of how many times a service has been asked about this txid

```ts
attempts: number
```

###### Property batch

If valid, a unique string identifying a batch of transactions to be sent together for processing.

```ts
batch?: string
```

###### Property history

JSON string of processing history.
Parses to `ProvenTxReqHistoryApi`.

```ts
history: string
```

###### Property notified

Set to true when a terminal status has been set and notification has occurred.

```ts
notified: boolean
```

###### Property notify

JSON string of data to drive notifications when this request completes.
Parses to `ProvenTxReqNotifyApi`.

```ts
notify: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableSettings

```ts
export interface TableSettings extends sdk.StorageIdentity, sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    storageIdentityKey: string;
    storageName: string;
    chain: sdk.Chain;
    dbtype: "SQLite" | "MySQL" | "IndexedDB";
    maxOutputScript: number;
}
```

See also: [Chain](./client.md#type-chain), [EntityTimeStamp](./client.md#interface-entitytimestamp), [StorageIdentity](./client.md#interface-storageidentity)

###### Property storageIdentityKey

The identity key (public key) assigned to this storage

```ts
storageIdentityKey: string
```

###### Property storageName

The human readable name assigned to this storage.

```ts
storageName: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableSyncState

```ts
export interface TableSyncState extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    syncStateId: number;
    userId: number;
    storageIdentityKey: string;
    storageName: string;
    status: sdk.SyncStatus;
    init: boolean;
    refNum: string;
    syncMap: string;
    when?: Date;
    satoshis?: number;
    errorLocal?: string;
    errorOther?: string;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [SyncStatus](./client.md#type-syncstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableTransaction

```ts
export interface TableTransaction extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    transactionId: number;
    userId: number;
    provenTxId?: number;
    status: sdk.TransactionStatus;
    reference: Base64String;
    isOutgoing: boolean;
    satoshis: number;
    description: string;
    version?: number;
    lockTime?: number;
    txid?: string;
    inputBEEF?: number[];
    rawTx?: number[];
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [TransactionStatus](./client.md#type-transactionstatus)

###### Property isOutgoing

true if transaction originated in this wallet, change returns to it.
false for a transaction created externally and handed in to this wallet.

```ts
isOutgoing: boolean
```

###### Property lockTime

Optional. Default is zero.
When the transaction can be processed into a block:
>= 500,000,000 values are interpreted as minimum required unix time stamps in seconds
< 500,000,000 values are interpreted as minimum required block height

```ts
lockTime?: number
```

###### Property reference

max length of 64, hex encoded

```ts
reference: Base64String
```

###### Property version

If not undefined, must match value in associated rawTransaction.

```ts
version?: number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableTxLabel

```ts
export interface TableTxLabel extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    txLabelId: number;
    userId: number;
    label: string;
    isDeleted: boolean;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableTxLabelMap

```ts
export interface TableTxLabelMap extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    txLabelId: number;
    transactionId: number;
    isDeleted: boolean;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TableUser

```ts
export interface TableUser extends sdk.EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
    userId: number;
    identityKey: string;
    activeStorage: string;
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

###### Property activeStorage

The storageIdentityKey value of the active wallet storage.

```ts
activeStorage: string
```

###### Property identityKey

PubKeyHex uniquely identifying user.
Typically 66 hex digits.

```ts
identityKey: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TaskPurgeParams

The database stores a variety of data that may be considered transient.

At one extreme, the data that must be preserved:
  - unspent outputs (UTXOs)
  - in-use metadata (labels, baskets, tags...)

At the other extreme, everything can be preserved to fully log all transaction creation and processing actions.

The following purge actions are available to support sustained operation:
  - Failed transactions, delete all associated data including:
      + Delete tag and label mapping records
      + Delete output records
      + Delete transaction records
      + Delete mapi_responses records
      + Delete proven_tx_reqs records
      + Delete commissions records
      + Update output records marked spentBy failed transactions
  - Completed transactions, delete transient data including:
      + transactions table set truncatedExternalInputs = null
      + transactions table set beef = null
      + transactions table set rawTx = null
      + Delete mapi_responses records
      + proven_tx_reqs table delete records

```ts
export interface TaskPurgeParams extends PurgeParams {
}
```

See also: [PurgeParams](./client.md#interface-purgeparams)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TrustSettings

```ts
export interface TrustSettings {
    trustLevel: number;
    trustedCertifiers: Certifier[];
}
```

See also: [Certifier](./client.md#interface-certifier)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TrxToken

Place holder for the transaction control object used by actual storage provider implementation.

```ts
export interface TrxToken {
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TscMerkleProofApi

```ts
export interface TscMerkleProofApi {
    height: number;
    index: number;
    nodes: string[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: TxScriptOffsets

```ts
export interface TxScriptOffsets {
    inputs: {
        vin: number;
        offset: number;
        length: number;
    }[];
    outputs: {
        vout: number;
        offset: number;
        length: number;
    }[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: UMPToken

Describes the structure of a User Management Protocol (UMP) token.

```ts
export interface UMPToken {
    passwordPresentationPrimary: number[];
    passwordRecoveryPrimary: number[];
    presentationRecoveryPrimary: number[];
    passwordPrimaryPrivileged: number[];
    presentationRecoveryPrivileged: number[];
    presentationHash: number[];
    passwordSalt: number[];
    recoveryHash: number[];
    presentationKeyEncrypted: number[];
    recoveryKeyEncrypted: number[];
    passwordKeyEncrypted: number[];
    profilesEncrypted?: number[];
    currentOutpoint?: OutpointString;
}
```

###### Property currentOutpoint

Describes the token's location on-chain, if it's already been published.

```ts
currentOutpoint?: OutpointString
```

###### Property passwordKeyEncrypted

A copy of the password key encrypted with the root privileged key.

```ts
passwordKeyEncrypted: number[]
```

###### Property passwordPresentationPrimary

Root Primary key encrypted by the XOR of the password and presentation keys.

```ts
passwordPresentationPrimary: number[]
```

###### Property passwordPrimaryPrivileged

Root Privileged key encrypted by the XOR of the password and primary keys.

```ts
passwordPrimaryPrivileged: number[]
```

###### Property passwordRecoveryPrimary

Root Primary key encrypted by the XOR of the password and recovery keys.

```ts
passwordRecoveryPrimary: number[]
```

###### Property passwordSalt

PBKDF2 salt used in conjunction with the password to derive the password key.

```ts
passwordSalt: number[]
```

###### Property presentationHash

Hash of the presentation key.

```ts
presentationHash: number[]
```

###### Property presentationKeyEncrypted

A copy of the presentation key encrypted with the root privileged key.

```ts
presentationKeyEncrypted: number[]
```

###### Property presentationRecoveryPrimary

Root Primary key encrypted by the XOR of the presentation and recovery keys.

```ts
presentationRecoveryPrimary: number[]
```

###### Property presentationRecoveryPrivileged

Root Privileged key encrypted by the XOR of the presentation and recovery keys.

```ts
presentationRecoveryPrivileged: number[]
```

###### Property profilesEncrypted

Optional field containing the encrypted profile data.
JSON string -> Encrypted Bytes using root privileged key.

```ts
profilesEncrypted?: number[]
```

###### Property recoveryHash

Hash of the recovery key.

```ts
recoveryHash: number[]
```

###### Property recoveryKeyEncrypted

A copy of the recovery key encrypted with the root privileged key.

```ts
recoveryKeyEncrypted: number[]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: UMPTokenInteractor

Describes a system capable of finding and updating UMP tokens on the blockchain.

```ts
export interface UMPTokenInteractor {
    findByPresentationKeyHash: (hash: number[]) => Promise<UMPToken | undefined>;
    findByRecoveryKeyHash: (hash: number[]) => Promise<UMPToken | undefined>;
    buildAndSend: (wallet: WalletInterface, adminOriginator: OriginatorDomainNameStringUnder250Bytes, token: UMPToken, oldTokenToConsume?: UMPToken) => Promise<OutpointString>;
}
```

See also: [UMPToken](./client.md#interface-umptoken)

###### Property buildAndSend

Creates (and optionally consumes the previous version of) a UMP token on-chain.

```ts
buildAndSend: (wallet: WalletInterface, adminOriginator: OriginatorDomainNameStringUnder250Bytes, token: UMPToken, oldTokenToConsume?: UMPToken) => Promise<OutpointString>
```
See also: [UMPToken](./client.md#interface-umptoken)

###### Property findByPresentationKeyHash

Locates the latest valid copy of a UMP token (including its outpoint)
based on the presentation key hash.

```ts
findByPresentationKeyHash: (hash: number[]) => Promise<UMPToken | undefined>
```
See also: [UMPToken](./client.md#interface-umptoken)

###### Property findByRecoveryKeyHash

Locates the latest valid copy of a UMP token (including its outpoint)
based on the recovery key hash.

```ts
findByRecoveryKeyHash: (hash: number[]) => Promise<UMPToken | undefined>
```
See also: [UMPToken](./client.md#interface-umptoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: UpdateProvenTxReqWithNewProvenTxArgs

```ts
export interface UpdateProvenTxReqWithNewProvenTxArgs {
    provenTxReqId: number;
    txid: string;
    attempts: number;
    status: ProvenTxReqStatus;
    history: string;
    height: number;
    index: number;
    blockHash: string;
    merkleRoot: string;
    merklePath: number[];
}
```

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus), [blockHash](./services.md#function-blockhash)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: UpdateProvenTxReqWithNewProvenTxResult

```ts
export interface UpdateProvenTxReqWithNewProvenTxResult {
    status: ProvenTxReqStatus;
    history: string;
    provenTxId: number;
    log?: string;
}
```

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidateGenerateChangeSdkParamsResult

```ts
export interface ValidateGenerateChangeSdkParamsResult {
    hasMaxPossibleOutput?: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: VerifyAndRepairBeefResult

```ts
export interface VerifyAndRepairBeefResult {
    isStructurallyValid: boolean;
    originalRoots: Record<number, string>;
    invalidRoots: Record<number, {
        root: string;
        reproveResults: sdk.ReproveHeaderResult;
    }>;
}
```

See also: [ReproveHeaderResult](./client.md#interface-reproveheaderresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletArgs

The preferred means of constructing a `Wallet` is with a `WalletArgs` instance.

```ts
export interface WalletArgs {
    chain: Chain;
    keyDeriver: KeyDeriverApi;
    storage: WalletStorageManager;
    services?: WalletServices;
    monitor?: Monitor;
    privilegedKeyManager?: PrivilegedKeyManager;
    settingsManager?: WalletSettingsManager;
    lookupResolver?: LookupResolver;
    makeLogger?: MakeWalletLogger;
}
```

See also: [Chain](./client.md#type-chain), [Monitor](./monitor.md#class-monitor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [WalletServices](./client.md#interface-walletservices), [WalletSettingsManager](./client.md#class-walletsettingsmanager), [WalletStorageManager](./storage.md#class-walletstoragemanager)

###### Property makeLogger

Optional. Provide a function conforming to the `MakeWalletLogger` type to enable wallet request logging.

For simple requests using `Console` may be adequate, initialize with
`() => Console`

Aggregate tracing and control over capturing all logged output in one place:
`(log?: string | WalletLoggerInterface) => new WalletLogger(log)`

```ts
makeLogger?: MakeWalletLogger
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletBalance

```ts
export interface WalletBalance {
    total: number;
    utxos: {
        satoshis: number;
        outpoint: string;
    }[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletLoggerArgs

Constructor properties available to `WalletLogger`

```ts
export interface WalletLoggerArgs {
    level?: "error" | "warn" | "info" | "debug" | "trace";
    indent?: number;
    isOrigin?: boolean;
    isError?: boolean;
    logs?: WalletLoggerLog[];
}
```

###### Property indent

Valid if an accumulating logger. Count of `group` calls without matching `groupEnd`.

```ts
indent?: number
```

###### Property isError

True if this is an accumulating logger and an error was logged.

```ts
isError?: boolean
```

###### Property isOrigin

True if this is an accumulating logger and the logger belongs to the object servicing the initial request.

```ts
isOrigin?: boolean
```

###### Property level

Optional. Logging levels that may influence what is logged.

'error' Only requests resulting in an exception should be logged.
'warn' Also log requests that succeed but with an abnormal condition.
'info' Also log normal successful requests.
'debug' Add input parm and result details where possible.
'trace' Instead of adding debug details, focus on execution path and timing.

```ts
level?: "error" | "warn" | "info" | "debug" | "trace"
```

###### Property logs

Optional array of accumulated logged data and errors.

```ts
logs?: WalletLoggerLog[]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletPermissionsManagerCallbacks

The set of callbacks that external code can bind to, e.g. to display UI prompts or logs
when a permission is requested.

```ts
export interface WalletPermissionsManagerCallbacks {
    onProtocolPermissionRequested?: PermissionEventHandler[];
    onBasketAccessRequested?: PermissionEventHandler[];
    onCertificateAccessRequested?: PermissionEventHandler[];
    onSpendingAuthorizationRequested?: PermissionEventHandler[];
    onGroupedPermissionRequested?: GroupedPermissionEventHandler[];
    onCounterpartyPermissionRequested?: CounterpartyPermissionEventHandler[];
}
```

See also: [CounterpartyPermissionEventHandler](./client.md#type-counterpartypermissioneventhandler), [GroupedPermissionEventHandler](./client.md#type-groupedpermissioneventhandler), [PermissionEventHandler](./client.md#type-permissioneventhandler)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletServices

Defines standard interfaces to access functionality implemented by external transaction processing services.

```ts
export interface WalletServices {
    chain: Chain;
    getChainTracker(): Promise<ChainTracker>;
    getHeaderForHeight(height: number): Promise<number[]>;
    getHeight(): Promise<number>;
    getBsvExchangeRate(): Promise<number>;
    getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number>;
    getRawTx(txid: string, useNext?: boolean): Promise<GetRawTxResult>;
    getMerklePath(txid: string, useNext?: boolean): Promise<GetMerklePathResult>;
    postBeef(beef: Beef, txids: string[], logger?: WalletLoggerInterface): Promise<PostBeefResult[]>;
    hashOutputScript(script: string): string;
    getStatusForTxids(txids: string[], useNext?: boolean): Promise<GetStatusForTxidsResult>;
    isUtxo(output: TableOutput): Promise<boolean>;
    getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, outpoint?: string, useNext?: boolean): Promise<GetUtxoStatusResult>;
    getScriptHashHistory(hash: string, useNext?: boolean, logger?: WalletLoggerInterface): Promise<GetScriptHashHistoryResult>;
    hashToHeader(hash: string): Promise<BlockHeader>;
    nLockTimeIsFinal(txOrLockTime: string | number[] | BsvTransaction | number): Promise<boolean>;
    getBeefForTxid(txid: string): Promise<Beef>;
    getServicesCallHistory(reset?: boolean): ServicesCallHistory;
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [PostBeefResult](./client.md#interface-postbeefresult), [ServicesCallHistory](./client.md#type-servicescallhistory), [TableOutput](./storage.md#interface-tableoutput), [getBeefForTxid](./services.md#function-getbeeffortxid), [logger](./client.md#variable-logger)

###### Property chain

The chain being serviced.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Method getBeefForTxid

Constructs a `Beef` for the given `txid` using only external data retrieval services.

In most cases, the `getBeefForTransaction` method of the `StorageProvider` class should be
used instead to avoid redundantly retrieving data.

```ts
getBeefForTxid(txid: string): Promise<Beef>
```

Throws

errors if txid does not correspond to a valid transaction as determined by the
configured services.

###### Method getBsvExchangeRate

Approximate exchange rate US Dollar / BSV, USD / BSV

This is the US Dollar price of one BSV

```ts
getBsvExchangeRate(): Promise<number>
```

###### Method getChainTracker

```ts
getChainTracker(): Promise<ChainTracker>
```

Returns

standard `ChainTracker` service which requires `options.chaintracks` be valid.

###### Method getFiatExchangeRate

Approximate exchange rate currency per base.

```ts
getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number>
```

###### Method getHeaderForHeight

```ts
getHeaderForHeight(height: number): Promise<number[]>
```

Returns

serialized block header for height on active chain

###### Method getHeight

```ts
getHeight(): Promise<number>
```

Returns

the height of the active chain

###### Method getMerklePath

Attempts to obtain the merkle proof associated with a 32 byte transaction hash (txid).

Cycles through configured transaction processing services attempting to get a valid response.

On success:
Result txid is the requested transaction hash
Result proof will be the merkle proof.
Result name will be the responding service's identifying name.
Returns result without incrementing active service.

On failure:
Result txid is the requested transaction hash
Result mapi will be the first mapi response obtained (service name and response), or null
Result error will be the first error thrown (service name and CwiError), or null
Increments to next configured service and tries again until all services have been tried.

```ts
getMerklePath(txid: string, useNext?: boolean): Promise<GetMerklePathResult>
```
See also: [GetMerklePathResult](./client.md#interface-getmerklepathresult)

Argument Details

+ **txid**
  + transaction hash for which proof is requested
+ **useNext**
  + optional, forces skip to next service before starting service requests cycle.

###### Method getRawTx

Attempts to obtain the raw transaction bytes associated with a 32 byte transaction hash (txid).

Cycles through configured transaction processing services attempting to get a valid response.

On success:
Result txid is the requested transaction hash
Result rawTx will be an array containing raw transaction bytes.
Result name will be the responding service's identifying name.
Returns result without incrementing active service.

On failure:
Result txid is the requested transaction hash
Result mapi will be the first mapi response obtained (service name and response), or null
Result error will be the first error thrown (service name and CwiError), or null
Increments to next configured service and tries again until all services have been tried.

```ts
getRawTx(txid: string, useNext?: boolean): Promise<GetRawTxResult>
```
See also: [GetRawTxResult](./client.md#interface-getrawtxresult)

Argument Details

+ **txid**
  + transaction hash for which raw transaction bytes are requested
+ **useNext**
  + optional, forces skip to next service before starting service requests cycle.

###### Method getServicesCallHistory

```ts
getServicesCallHistory(reset?: boolean): ServicesCallHistory
```
See also: [ServicesCallHistory](./client.md#type-servicescallhistory)

Returns

a history of service calls made to the configured services.

Argument Details

+ **reset**
  + if true, ends current interval and starts a new one.

###### Method getStatusForTxids

For an array of one or more txids, returns for each wether it is a 'known', 'mined', or 'unknown' transaction.

Primarily useful for determining if a recently broadcast transaction is known to the processing network.

Also returns the current depth from chain tip if 'mined'.

```ts
getStatusForTxids(txids: string[], useNext?: boolean): Promise<GetStatusForTxidsResult>
```
See also: [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult)

###### Method getUtxoStatus

Attempts to determine the UTXO status of a transaction output.

Cycles through configured transaction processing services attempting to get a valid response.

```ts
getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, outpoint?: string, useNext?: boolean): Promise<GetUtxoStatusResult>
```
See also: [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult)

Argument Details

+ **output**
  + transaction output identifier in format determined by `outputFormat`.
+ **chain**
  + which chain to post to, all of rawTx's inputs must be unspent on this chain.
+ **outputFormat**
  + optional, supported values:
'hashLE' little-endian sha256 hash of output script
'hashBE' big-endian sha256 hash of output script
'script' entire transaction output script
undefined if length of `output` is 32 hex bytes then 'hashBE`, otherwise 'script'.
+ **outpoint**
  + if valid, result isUtxo is true only if this txid and vout match an unspent occurance of output script. `${txid}.${vout}` format.
+ **useNext**
  + optional, forces skip to next service before starting service requests cycle.

###### Method hashOutputScript

```ts
hashOutputScript(script: string): string
```

Returns

script hash in 'hashLE' format, which is the default.

Argument Details

+ **script**
  + Output script to be hashed for `getUtxoStatus` default `outputFormat`

###### Method hashToHeader

```ts
hashToHeader(hash: string): Promise<BlockHeader>
```
See also: [BlockHeader](./client.md#interface-blockheader)

Returns

a block header

Argument Details

+ **hash**
  + block hash

###### Method isUtxo

Calls getUtxoStatus with the hash of the output's lockingScript,
and ensures that the output's outpoint matches an unspent use of that script.

```ts
isUtxo(output: TableOutput): Promise<boolean>
```
See also: [TableOutput](./storage.md#interface-tableoutput)

Returns

true if the output appears to currently be spendable.

###### Method nLockTimeIsFinal

```ts
nLockTimeIsFinal(txOrLockTime: string | number[] | BsvTransaction | number): Promise<boolean>
```

Returns

whether the locktime value allows the transaction to be mined at the current chain height

Argument Details

+ **txOrLockTime**
  + either a bitcoin locktime value or hex, binary, un-encoded Transaction

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletServicesOptions

```ts
export interface WalletServicesOptions {
    chain: Chain;
    taalApiKey?: string;
    bitailsApiKey?: string;
    whatsOnChainApiKey?: string;
    bsvExchangeRate: BsvExchangeRate;
    bsvUpdateMsecs: number;
    fiatExchangeRates: FiatExchangeRates;
    fiatUpdateMsecs: number;
    disableMapiCallback?: boolean;
    exchangeratesapiKey?: string;
    chaintracksFiatExchangeRatesUrl?: string;
    chaintracks?: ChaintracksClientApi;
    arcUrl: string;
    arcConfig: ArcConfig;
    arcGorillaPoolUrl?: string;
    arcGorillaPoolConfig?: ArcConfig;
}
```

See also: [ArcConfig](./services.md#interface-arcconfig), [BsvExchangeRate](./client.md#interface-bsvexchangerate), [Chain](./client.md#type-chain), [ChaintracksClientApi](./services.md#interface-chaintracksclientapi), [FiatExchangeRates](./client.md#interface-fiatexchangerates), [arcGorillaPoolUrl](./services.md#function-arcgorillapoolurl)

###### Property arcConfig

TAAL ARC service configuration options.

apiKey Default value is undefined.

deploymentId Default value: `wallet-toolbox-${randomBytesHex(16)}`.

callbackUrl Default is undefined.
callbackToken Default is undefined.

```ts
arcConfig: ArcConfig
```
See also: [ArcConfig](./services.md#interface-arcconfig)

###### Property arcGorillaPoolConfig

GorillaPool ARC service configuration options.

apiKey Default is undefined.

deploymentId Default value: `wallet-toolbox-${randomBytesHex(16)}`.

callbackUrl Default is undefined.
callbackToken Default is undefined.

```ts
arcGorillaPoolConfig?: ArcConfig
```
See also: [ArcConfig](./services.md#interface-arcconfig)

###### Property arcGorillaPoolUrl

GorillaPool ARC service provider endpoit to use
Default is:
mainnet: `https://arc.gorillapool.io`
testnet: undefined

```ts
arcGorillaPoolUrl?: string
```

###### Property arcUrl

TAAL ARC service provider endpoit to use
Default is:
mainnet: `https://arc.taal.com`
testnet: `https://arc-test.taal.com`

```ts
arcUrl: string
```

###### Property bitailsApiKey

Api key for use accessing Bitails API at
mainnet: `https://api.bitails.io/`
testnet: `https://test-api.bitails.io/`

```ts
bitailsApiKey?: string
```

###### Property bsvExchangeRate

The initial approximate BSV/USD exchange rate.

```ts
bsvExchangeRate: BsvExchangeRate
```
See also: [BsvExchangeRate](./client.md#interface-bsvexchangerate)

###### Property bsvUpdateMsecs

Update interval for BSV/USD exchange rate.
Default is 15 minutes.

```ts
bsvUpdateMsecs: number
```

###### Property chain

'main' or 'test': which BSV chain to use

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property chaintracks

Optional Chaintracks client API instance.
Default is a new instance of ChaintracksServiceClient configured to use:
mainnet: `https://mainnet-chaintracks.babbage.systems`
testnet: `https://testnet-chaintracks.babbage.systems`

```ts
chaintracks?: ChaintracksClientApi
```
See also: [ChaintracksClientApi](./services.md#interface-chaintracksclientapi)

###### Property chaintracksFiatExchangeRatesUrl

Due to the default use of a free exchangeratesapiKey with low usage limits,
the `ChaintracksService` can act as a request rate multiplier.

By default the following endpoint is used:
`https://mainnet-chaintracks.babbage.systems/getFiatExchangeRates`

```ts
chaintracksFiatExchangeRatesUrl?: string
```

###### Property disableMapiCallback

MAPI callbacks are deprecated at this time.

```ts
disableMapiCallback?: boolean
```

###### Property exchangeratesapiKey

API key for use accessing fiat exchange rates API at
`http://api.exchangeratesapi.io/v1/latest?access_key=${key}`

Obtain your own api key here:
https://manage.exchangeratesapi.io/signup/free

```ts
exchangeratesapiKey?: string
```

###### Property fiatExchangeRates

The initial approximate fiat exchange rates with USD as base.

```ts
fiatExchangeRates: FiatExchangeRates
```
See also: [FiatExchangeRates](./client.md#interface-fiatexchangerates)

###### Property fiatUpdateMsecs

Update interval for Fiat exchange rates.
Default is 24 hours.

```ts
fiatUpdateMsecs: number
```

###### Property taalApiKey

As of 2025-08-31 the `taalApiKey` is unused for default configured services.
See `arcConfig` instead.

```ts
taalApiKey?: string
```

###### Property whatsOnChainApiKey

Api key for use accessing WhatsOnChain API at
mainnet: `https://api.whatsonchain.com/v1/bsv/main`
testnet: `https://api.whatsonchain.com/v1/bsv/test`

```ts
whatsOnChainApiKey?: string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletSettings

```ts
export interface WalletSettings {
    trustSettings: TrustSettings;
    theme?: WalletTheme;
    currency?: string;
    permissionMode?: string;
}
```

See also: [TrustSettings](./client.md#interface-trustsettings), [WalletTheme](./client.md#interface-wallettheme)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletSettingsManagerConfig

```ts
export interface WalletSettingsManagerConfig {
    defaultSettings: WalletSettings;
}
```

See also: [WalletSettings](./client.md#interface-walletsettings)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletSigner

```ts
export interface WalletSigner {
    isWalletSigner: true;
    chain: Chain;
    keyDeriver: KeyDeriverApi;
}
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorage

This is the `WalletStorage` interface implemented by a class such as `WalletStorageManager`,
which manges an active and set of backup storage providers.

Access and conrol is not directly managed. Typically each request is made with an associated identityKey
and it is left to the providers: physical access or remote channel authentication.

```ts
export interface WalletStorage {
    isStorageProvider(): boolean;
    isAvailable(): boolean;
    makeAvailable(): Promise<TableSettings>;
    migrate(storageName: string, storageIdentityKey: string): Promise<string>;
    destroy(): Promise<void>;
    setServices(v: WalletServices): void;
    getServices(): WalletServices;
    getSettings(): TableSettings;
    getAuth(): Promise<AuthId>;
    findOrInsertUser(identityKey: string): Promise<{
        user: TableUser;
        isNew: boolean;
    }>;
    abortAction(args: AbortActionArgs): Promise<AbortActionResult>;
    createAction(args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult>;
    processAction(args: StorageProcessActionArgs): Promise<StorageProcessActionResults>;
    internalizeAction(args: InternalizeActionArgs): Promise<InternalizeActionResult>;
    findCertificates(args: FindCertificatesArgs): Promise<TableCertificateX[]>;
    findOutputBaskets(args: FindOutputBasketsArgs): Promise<TableOutputBasket[]>;
    findOutputs(args: FindOutputsArgs): Promise<TableOutput[]>;
    findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>;
    listActions(args: ListActionsArgs): Promise<ListActionsResult>;
    listCertificates(args: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult>;
    listOutputs(args: ListOutputsArgs): Promise<ListOutputsResult>;
    insertCertificate(certificate: TableCertificateX): Promise<number>;
    relinquishCertificate(args: RelinquishCertificateArgs): Promise<number>;
    relinquishOutput(args: RelinquishOutputArgs): Promise<number>;
    getStores(): WalletStorageInfo[];
}
```

See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableUser](./storage.md#interface-tableuser), [WalletServices](./client.md#interface-walletservices), [WalletStorageInfo](./client.md#interface-walletstorageinfo), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction)

###### Method isStorageProvider

```ts
isStorageProvider(): boolean
```

Returns

false

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageInfo

Snapshot of the current state of a storage provider configured for an `WalletStorageManager`.

```ts
export interface WalletStorageInfo {
    isActive: boolean;
    isEnabled: boolean;
    isBackup: boolean;
    isConflicting: boolean;
    userId: number;
    storageIdentityKey: string;
    storageName: string;
    storageClass: string;
    endpointURL?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageProvider

This is the `WalletStorage` interface implemented with authentication checking and
is the actual minimal interface implemented by storage and remoted storage providers.

```ts
export interface WalletStorageProvider extends WalletStorageSync {
    isStorageProvider(): boolean;
    setServices(v: WalletServices): void;
}
```

See also: [WalletServices](./client.md#interface-walletservices), [WalletStorageSync](./client.md#interface-walletstoragesync)

###### Method isStorageProvider

```ts
isStorageProvider(): boolean
```

Returns

true if this object's interface can be extended to the full `StorageProvider` interface

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageReader

```ts
export interface WalletStorageReader {
    isAvailable(): boolean;
    getServices(): WalletServices;
    getSettings(): TableSettings;
    findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]>;
    findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]>;
    findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]>;
    findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>;
    listActions(auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult>;
    listCertificates(auth: AuthId, vargs: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult>;
    listOutputs(auth: AuthId, vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult>;
}
```

See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [WalletServices](./client.md#interface-walletservices), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageSync

```ts
export interface WalletStorageSync extends WalletStorageWriter {
    findOrInsertSyncStateAuth(auth: AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: TableSyncState;
        isNew: boolean;
    }>;
    setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number>;
    getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk>;
    processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult>;
}
```

See also: [AuthId](./client.md#interface-authid), [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [SyncChunk](./client.md#interface-syncchunk), [TableSyncState](./storage.md#interface-tablesyncstate), [WalletStorageWriter](./client.md#interface-walletstoragewriter), [getSyncChunk](./storage.md#function-getsyncchunk)

###### Method setActive

Updagte the `activeStorage` property of the authenticated user by their `userId`.

```ts
setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number>
```
See also: [AuthId](./client.md#interface-authid)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageSyncReader

This is the minimal interface required for a WalletStorageProvider to export data to another provider.

```ts
export interface WalletStorageSyncReader {
    makeAvailable(): Promise<TableSettings>;
    getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk>;
}
```

See also: [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [SyncChunk](./client.md#interface-syncchunk), [TableSettings](./storage.md#interface-tablesettings), [getSyncChunk](./storage.md#function-getsyncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageWriter

```ts
export interface WalletStorageWriter extends WalletStorageReader {
    makeAvailable(): Promise<TableSettings>;
    migrate(storageName: string, storageIdentityKey: string): Promise<string>;
    destroy(): Promise<void>;
    findOrInsertUser(identityKey: string): Promise<{
        user: TableUser;
        isNew: boolean;
    }>;
    abortAction(auth: AuthId, args: AbortActionArgs): Promise<AbortActionResult>;
    createAction(auth: AuthId, args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult>;
    processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults>;
    internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult>;
    insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number>;
    relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number>;
    relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number>;
}
```

See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableSettings](./storage.md#interface-tablesettings), [TableUser](./storage.md#interface-tableuser), [WalletStorageReader](./client.md#interface-walletstoragereader), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [processAction](./storage.md#function-processaction)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletTheme

```ts
export interface WalletTheme {
    mode: string;
}
```

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
##### Interface: XValidCreateActionOutput

```ts
export interface XValidCreateActionOutput extends Validation.ValidCreateActionOutput {
    vout: number;
    providedBy: StorageProvidedBy;
    purpose?: string;
    derivationSuffix?: string;
    keyOffset?: string;
}
```

See also: [StorageProvidedBy](./client.md#type-storageprovidedby)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Classes

| | | |
| --- | --- | --- |
| [ARC](#class-arc) | [EntityProvenTx](#class-entityproventx) | [TaskPurge](#class-taskpurge) |
| [AuthMethodInteractor](#class-authmethodinteractor) | [EntityProvenTxReq](#class-entityproventxreq) | [TaskReorg](#class-taskreorg) |
| [BHServiceClient](#class-bhserviceclient) | [EntitySyncState](#class-entitysyncstate) | [TaskReviewStatus](#class-taskreviewstatus) |
| [Bitails](#class-bitails) | [EntityTransaction](#class-entitytransaction) | [TaskSendWaiting](#class-tasksendwaiting) |
| [BulkFileDataManager](#class-bulkfiledatamanager) | [EntityTxLabel](#class-entitytxlabel) | [TaskSyncWhenIdle](#class-tasksyncwhenidle) |
| [BulkFileDataReader](#class-bulkfiledatareader) | [EntityTxLabelMap](#class-entitytxlabelmap) | [TaskUnFail](#class-taskunfail) |
| [BulkFilesReader](#class-bulkfilesreader) | [EntityUser](#class-entityuser) | [TwilioPhoneInteractor](#class-twiliophoneinteractor) |
| [BulkFilesReaderFs](#class-bulkfilesreaderfs) | [HeightRange](#class-heightrange) | [WABClient](#class-wabclient) |
| [BulkFilesReaderStorage](#class-bulkfilesreaderstorage) | [LiveIngestorBase](#class-liveingestorbase) | [WERR_BAD_REQUEST](#class-werr_bad_request) |
| [BulkHeaderFile](#class-bulkheaderfile) | [LiveIngestorWhatsOnChainPoll](#class-liveingestorwhatsonchainpoll) | [WERR_BROADCAST_UNAVAILABLE](#class-werr_broadcast_unavailable) |
| [BulkHeaderFileFs](#class-bulkheaderfilefs) | [MergeEntity](#class-mergeentity) | [WERR_INSUFFICIENT_FUNDS](#class-werr_insufficient_funds) |
| [BulkHeaderFileStorage](#class-bulkheaderfilestorage) | [Monitor](#class-monitor) | [WERR_INTERNAL](#class-werr_internal) |
| [BulkHeaderFiles](#class-bulkheaderfiles) | [OverlayUMPTokenInteractor](#class-overlayumptokeninteractor) | [WERR_INVALID_MERKLE_ROOT](#class-werr_invalid_merkle_root) |
| [BulkIngestorBase](#class-bulkingestorbase) | [PersonaIDInteractor](#class-personaidinteractor) | [WERR_INVALID_OPERATION](#class-werr_invalid_operation) |
| [BulkIngestorCDN](#class-bulkingestorcdn) | [PrivilegedKeyManager](#class-privilegedkeymanager) | [WERR_INVALID_PARAMETER](#class-werr_invalid_parameter) |
| [BulkIngestorCDNBabbage](#class-bulkingestorcdnbabbage) | [ReaderUint8Array](#class-readeruint8array) | [WERR_INVALID_PUBLIC_KEY](#class-werr_invalid_public_key) |
| [BulkIngestorWhatsOnChainCdn](#class-bulkingestorwhatsonchaincdn) | [ScriptTemplateBRC29](#class-scripttemplatebrc29) | [WERR_MISSING_PARAMETER](#class-werr_missing_parameter) |
| [BulkStorageBase](#class-bulkstoragebase) | [SdkWhatsOnChain](#class-sdkwhatsonchain) | [WERR_NETWORK_CHAIN](#class-werr_network_chain) |
| [CWIStyleWalletManager](#class-cwistylewalletmanager) | [ServiceCollection](#class-servicecollection) | [WERR_NOT_ACTIVE](#class-werr_not_active) |
| [Chaintracks](#class-chaintracks) | [Services](#class-services) | [WERR_NOT_IMPLEMENTED](#class-werr_not_implemented) |
| [ChaintracksChainTracker](#class-chaintrackschaintracker) | [SetupClient](#class-setupclient) | [WERR_REVIEW_ACTIONS](#class-werr_review_actions) |
| [ChaintracksFetch](#class-chaintracksfetch) | [SimpleWalletManager](#class-simplewalletmanager) | [WERR_UNAUTHORIZED](#class-werr_unauthorized) |
| [ChaintracksServiceClient](#class-chaintracksserviceclient) | [SingleWriterMultiReaderLock](#class-singlewritermultireaderlock) | [Wallet](#class-wallet) |
| [ChaintracksStorageBase](#class-chaintracksstoragebase) | [StorageClient](#class-storageclient) | [WalletAuthenticationManager](#class-walletauthenticationmanager) |
| [ChaintracksStorageIdb](#class-chaintracksstorageidb) | [StorageIdb](#class-storageidb) | [WalletError](#class-walleterror) |
| [ChaintracksStorageNoDb](#class-chaintracksstoragenodb) | [StorageProvider](#class-storageprovider) | [WalletLogger](#class-walletlogger) |
| [DevConsoleInteractor](#class-devconsoleinteractor) | [StorageReader](#class-storagereader) | [WalletMonitorTask](#class-walletmonitortask) |
| [EntityBase](#class-entitybase) | [StorageReaderWriter](#class-storagereaderwriter) | [WalletPermissionsManager](#class-walletpermissionsmanager) |
| [EntityCertificate](#class-entitycertificate) | [StorageSyncReader](#class-storagesyncreader) | [WalletSettingsManager](#class-walletsettingsmanager) |
| [EntityCertificateField](#class-entitycertificatefield) | [TaskCheckForProofs](#class-taskcheckforproofs) | [WalletSigner](#class-walletsigner) |
| [EntityCommission](#class-entitycommission) | [TaskCheckNoSends](#class-taskchecknosends) | [WalletStorageManager](#class-walletstoragemanager) |
| [EntityOutput](#class-entityoutput) | [TaskClock](#class-taskclock) | [WhatsOnChain](#class-whatsonchain) |
| [EntityOutputBasket](#class-entityoutputbasket) | [TaskFailAbandoned](#class-taskfailabandoned) | [WhatsOnChainNoServices](#class-whatsonchainnoservices) |
| [EntityOutputTag](#class-entityoutputtag) | [TaskMonitorCallHistory](#class-taskmonitorcallhistory) | [WhatsOnChainServices](#class-whatsonchainservices) |
| [EntityOutputTagMap](#class-entityoutputtagmap) | [TaskNewHeader](#class-tasknewheader) |  |

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
##### Class: AuthMethodInteractor

Abstract client-side interactor for an Auth Method

```ts
export abstract class AuthMethodInteractor {
    public abstract methodType: string;
    public abstract startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse>;
    public abstract completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse>;
}
```

See also: [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse), [StartAuthResponse](./client.md#interface-startauthresponse)

###### Method completeAuth

Complete the flow (e.g. confirm OTP).

```ts
public abstract completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse>
```
See also: [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse)

###### Method startAuth

Start the flow (e.g. request an OTP or create a session).

```ts
public abstract startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse>
```
See also: [AuthPayload](./client.md#interface-authpayload), [StartAuthResponse](./client.md#interface-startauthresponse)

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
##### Class: CWIStyleWalletManager

Manages a "CWI-style" wallet that uses a UMP token and a
multi-key authentication scheme (password, presentation key, and recovery key),
supporting multiple user profiles under a single account.

```ts
export class CWIStyleWalletManager implements WalletInterface {
    authenticated: boolean;
    authenticationMode: "presentation-key-and-password" | "presentation-key-and-recovery-key" | "recovery-key-and-password" = "presentation-key-and-password";
    authenticationFlow: "new-user" | "existing-user" = "new-user";
    constructor(adminOriginator: OriginatorDomainNameStringUnder250Bytes, walletBuilder: (profilePrimaryKey: number[], profilePrivilegedKeyManager: PrivilegedKeyManager, profileId: number[]) => Promise<WalletInterface>, interactor: UMPTokenInteractor = new OverlayUMPTokenInteractor(), recoveryKeySaver: (key: number[]) => Promise<true>, passwordRetriever: (reason: string, test: (passwordCandidate: string) => boolean) => Promise<string>, newWalletFunder?: (presentationKey: number[], wallet: WalletInterface, adminOriginator: OriginatorDomainNameStringUnder250Bytes) => Promise<void>, stateSnapshot?: number[]) 
    async providePresentationKey(key: number[]): Promise<void> 
    async providePassword(password: string): Promise<void> 
    async provideRecoveryKey(recoveryKey: number[]): Promise<void> 
    saveSnapshot(): number[] 
    async loadSnapshot(snapshot: number[]): Promise<void> 
    async syncUMPToken(): Promise<boolean> 
    destroy(): void 
    listProfiles(): Array<{
        id: number[];
        name: string;
        createdAt: number | null;
        active: boolean;
        identityKey: string;
    }> 
    async addProfile(name: string): Promise<number[]> 
    async deleteProfile(profileId: number[]): Promise<void> 
    async switchProfile(profileId: number[]): Promise<void> 
    async changePassword(newPassword: string): Promise<void> 
    async getRecoveryKey(): Promise<number[]> 
    async changeRecoveryKey(): Promise<void> 
    async changePresentationKey(newPresentationKey: number[]): Promise<void> 
    async getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetPublicKeyResult> 
    async revealCounterpartyKeyLinkage(args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealCounterpartyKeyLinkageResult> 
    async revealSpecificKeyLinkage(args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealSpecificKeyLinkageResult> 
    async encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult> 
    async decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult> 
    async createHmac(args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateHmacResult> 
    async verifyHmac(args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifyHmacResult> 
    async createSignature(args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateSignatureResult> 
    async verifySignature(args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifySignatureResult> 
    async createAction(args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateActionResult> 
    async signAction(args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<SignActionResult> 
    async abortAction(args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AbortActionResult> 
    async listActions(args: ListActionsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListActionsResult> 
    async internalizeAction(args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<InternalizeActionResult> 
    async listOutputs(args: ListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
    async relinquishOutput(args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishOutputResult> 
    async acquireCertificate(args: AcquireCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AcquireCertificateResult> 
    async listCertificates(args: ListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
    async proveCertificate(args: ProveCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ProveCertificateResult> 
    async relinquishCertificate(args: RelinquishCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishCertificateResult> 
    async discoverByIdentityKey(args: DiscoverByIdentityKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<DiscoverCertificatesResult> 
    async discoverByAttributes(args: DiscoverByAttributesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<DiscoverCertificatesResult> 
    async isAuthenticated(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async waitForAuthentication(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async getHeight(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> 
    async getHeaderForHeight(args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeaderResult> 
    async getNetwork(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> 
    async getVersion(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> 
}
```

See also: [OverlayUMPTokenInteractor](./client.md#class-overlayumptokeninteractor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [UMPTokenInteractor](./client.md#interface-umptokeninteractor), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [proveCertificate](./client.md#function-provecertificate), [signAction](./client.md#function-signaction)

###### Constructor

Constructs a new CWIStyleWalletManager.

```ts
constructor(adminOriginator: OriginatorDomainNameStringUnder250Bytes, walletBuilder: (profilePrimaryKey: number[], profilePrivilegedKeyManager: PrivilegedKeyManager, profileId: number[]) => Promise<WalletInterface>, interactor: UMPTokenInteractor = new OverlayUMPTokenInteractor(), recoveryKeySaver: (key: number[]) => Promise<true>, passwordRetriever: (reason: string, test: (passwordCandidate: string) => boolean) => Promise<string>, newWalletFunder?: (presentationKey: number[], wallet: WalletInterface, adminOriginator: OriginatorDomainNameStringUnder250Bytes) => Promise<void>, stateSnapshot?: number[]) 
```
See also: [OverlayUMPTokenInteractor](./client.md#class-overlayumptokeninteractor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [UMPTokenInteractor](./client.md#interface-umptokeninteractor)

Argument Details

+ **adminOriginator**
  + The domain name of the administrative originator.
+ **walletBuilder**
  + A function that can build an underlying wallet instance for a profile.
+ **interactor**
  + An instance of UMPTokenInteractor.
+ **recoveryKeySaver**
  + A function to persist a new recovery key.
+ **passwordRetriever**
  + A function to request the user's password.
+ **newWalletFunder**
  + Optional function to fund a new wallet.
+ **stateSnapshot**
  + Optional previously saved state snapshot.

###### Property authenticated

Whether the user is currently authenticated (i.e., root keys are available).

```ts
authenticated: boolean
```

###### Property authenticationFlow

Indicates new user or existing user flow.

```ts
authenticationFlow: "new-user" | "existing-user" = "new-user"
```

###### Property authenticationMode

Current mode of authentication.

```ts
authenticationMode: "presentation-key-and-password" | "presentation-key-and-recovery-key" | "recovery-key-and-password" = "presentation-key-and-password"
```

###### Method addProfile

Adds a new profile with the given name.
Generates necessary pads and updates the UMP token.
Does not switch to the new profile automatically.

```ts
async addProfile(name: string): Promise<number[]> 
```

Returns

The ID of the newly created profile.

Argument Details

+ **name**
  + The desired name for the new profile.

###### Method changePassword

Changes the user's password. Re-wraps keys and updates the UMP token.

```ts
async changePassword(newPassword: string): Promise<void> 
```

###### Method changePresentationKey

Changes the user's presentation key.

```ts
async changePresentationKey(newPresentationKey: number[]): Promise<void> 
```

###### Method changeRecoveryKey

Changes the user's recovery key. Prompts user to save the new key.

```ts
async changeRecoveryKey(): Promise<void> 
```

###### Method deleteProfile

Deletes a profile by its ID.
Cannot delete the default profile. If the active profile is deleted,
it switches back to the default profile.

```ts
async deleteProfile(profileId: number[]): Promise<void> 
```

Argument Details

+ **profileId**
  + The 16-byte ID of the profile to delete.

###### Method destroy

Destroys the wallet state, clearing keys, tokens, and profiles.

```ts
destroy(): void 
```

###### Method getRecoveryKey

Retrieves the current recovery key. Requires privileged access.

```ts
async getRecoveryKey(): Promise<number[]> 
```

###### Method listProfiles

Lists all available profiles, including the default profile.

```ts
listProfiles(): Array<{
    id: number[];
    name: string;
    createdAt: number | null;
    active: boolean;
    identityKey: string;
}> 
```

Returns

Array of profile info objects, including an 'active' flag.

###### Method loadSnapshot

Loads a previously saved state snapshot. Restores root key, UMP token, profiles, and active profile.
Handles Version 1 (legacy) and Version 2 formats.

```ts
async loadSnapshot(snapshot: number[]): Promise<void> 
```

Argument Details

+ **snapshot**
  + Encrypted snapshot bytes.

###### Method providePassword

Provides the password.

```ts
async providePassword(password: string): Promise<void> 
```

###### Method providePresentationKey

Provides the presentation key.

```ts
async providePresentationKey(key: number[]): Promise<void> 
```

###### Method provideRecoveryKey

Provides the recovery key.

```ts
async provideRecoveryKey(recoveryKey: number[]): Promise<void> 
```

###### Method saveSnapshot

Saves the current wallet state (root key, UMP token, active profile) into an encrypted snapshot.
Version 2 format: [1 byte version=2] + [32 byte snapshot key] + [16 byte activeProfileId] + [encrypted payload]
Encrypted Payload: [32 byte rootPrimaryKey] + [varint token length + serialized UMP token]

```ts
saveSnapshot(): number[] 
```

Returns

Encrypted snapshot bytes.

###### Method switchProfile

Switches the active profile. This re-derives keys and rebuilds the underlying wallet.

```ts
async switchProfile(profileId: number[]): Promise<void> 
```

Argument Details

+ **profileId**
  + The 16-byte ID of the profile to switch to (use DEFAULT_PROFILE_ID for default).

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
##### Class: DevConsoleInteractor

DevConsoleInteractor

A client-side class that knows how to call the WAB server for DevConsole-based authentication.
This is a development-only auth method that generates OTP codes and logs them to the console.

```ts
export class DevConsoleInteractor extends AuthMethodInteractor {
    public methodType = "DevConsole";
    public async startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse> 
    public async completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse> 
}
```

See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor), [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse), [StartAuthResponse](./client.md#interface-startauthresponse)

###### Method completeAuth

Complete the DevConsole authentication on the server.
- The server will verify the OTP code that was generated and logged to the console.

```ts
public async completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse> 
```
See also: [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse)

Returns

- { success, message, presentationKey }

Argument Details

+ **serverUrl**
  + The base URL of the WAB server
+ **presentationKey**
  + The 256-bit key
+ **payload**
  + { phoneNumber: string, otp: string } (the identifier and OTP code from console)

###### Method startAuth

Start the DevConsole authentication on the server.
- The server will generate an OTP code and log it to the console for development use.

```ts
public async startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse> 
```
See also: [AuthPayload](./client.md#interface-authpayload), [StartAuthResponse](./client.md#interface-startauthresponse)

Returns

- { success, message, data }

Argument Details

+ **serverUrl**
  + The base URL of the WAB server (e.g. http://localhost:3000)
+ **presentationKey**
  + The 256-bit key the client is attempting to authenticate with
+ **payload**
  + { phoneNumber: string } (identifier for the authentication)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityBase

```ts
export abstract class EntityBase<T> {
    api: T;
    constructor(api: T) 
    abstract get id(): number;
    abstract get entityName(): string;
    abstract get entityTable(): string;
    abstract updateApi(): void;
    abstract equals(ei: T, syncMap?: SyncMap): boolean;
    abstract mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void>;
    abstract mergeExisting(storage: EntityStorage, since: Date | undefined, ei: T, syncMap: SyncMap, trx?: TrxToken): Promise<boolean>;
    toApi(): T 
}
```

See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

###### Method equals

Tests for equality or 'merge' / 'convergent' equality if syncMap is provided.

'convergent' equality must satisfy (A sync B) equals (B sync A)

```ts
abstract equals(ei: T, syncMap?: SyncMap): boolean
```
See also: [SyncMap](./storage.md#interface-syncmap)

###### Method mergeExisting

Perform a 'merge' / 'convergent' equality migration of state
from external `ei` to this existing local EntityUser

```ts
abstract mergeExisting(storage: EntityStorage, since: Date | undefined, ei: T, syncMap: SyncMap, trx?: TrxToken): Promise<boolean>
```
See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

Returns

true iff entity state changed and was updated to storage

###### Method mergeNew

Perform a 'merge' / 'convergent' equality migration of state
to this new local entity which was constructed
as a copy of the external object.

```ts
abstract mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void>
```
See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

Argument Details

+ **userId**
  + local userId

###### Method toApi

An entity may decode properties of the underlying Api object on construction.

The `toApi` method forces an `updateApi` before returning the underlying,
now updated, Api object.

```ts
toApi(): T 
```

Returns

The underlying Api object with any entity decoded properties updated.

###### Method updateApi

On construction, an entity may decode properties of the `api` object,
such as JSON stringified objects.

The `updateApi` method must re-encode the current state of those decoded properties
into the `api` object.

Used by the `toApi` method to return an updated `api` object.

```ts
abstract updateApi(): void
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityCertificate

```ts
export class EntityCertificate extends EntityBase<TableCertificate> {
    constructor(api?: TableCertificate) 
    override updateApi(): void 
    get certificateId() 
    set certificateId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get userId() 
    set userId(v: number) 
    get type() 
    set type(v: string) 
    get subject() 
    set subject(v: string) 
    get verifier() 
    set verifier(v: string | undefined) 
    get serialNumber() 
    set serialNumber(v: string) 
    get certifier() 
    set certifier(v: string) 
    get revocationOutpoint() 
    set revocationOutpoint(v: string) 
    get signature() 
    set signature(v: string) 
    get isDeleted() 
    set isDeleted(v: boolean) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableCertificate, syncMap?: SyncMap): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableCertificate, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityCertificate;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableCertificate, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableCertificate](./storage.md#interface-tablecertificate), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityCertificateField

```ts
export class EntityCertificateField extends EntityBase<TableCertificateField> {
    constructor(api?: TableCertificateField) 
    override updateApi(): void 
    get userId() 
    set userId(v: number) 
    get certificateId() 
    set certificateId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get fieldName() 
    set fieldName(v: string) 
    get fieldValue() 
    set fieldValue(v: string) 
    get masterKey() 
    set masterKey(v: string) 
    override get id(): number 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableCertificateField, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableCertificateField, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityCertificateField;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableCertificateField, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityCommission

```ts
export class EntityCommission extends EntityBase<TableCommission> {
    constructor(api?: TableCommission) 
    override updateApi(): void 
    get commissionId() 
    set commissionId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get transactionId() 
    set transactionId(v: number) 
    get userId() 
    set userId(v: number) 
    get isRedeemed() 
    set isRedeemed(v: boolean) 
    get keyOffset() 
    set keyOffset(v: string) 
    get lockingScript() 
    set lockingScript(v: number[]) 
    get satoshis() 
    set satoshis(v: number) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableCommission, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableCommission, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityCommission;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableCommission, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableCommission](./storage.md#interface-tablecommission), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityOutput

```ts
export class EntityOutput extends EntityBase<TableOutput> {
    constructor(api?: TableOutput) 
    override updateApi(): void 
    get outputId() 
    set outputId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get userId() 
    set userId(v: number) 
    get transactionId() 
    set transactionId(v: number) 
    get basketId() 
    set basketId(v: number | undefined) 
    get spentBy() 
    set spentBy(v: number | undefined) 
    get vout() 
    set vout(v: number) 
    get satoshis() 
    set satoshis(v: number) 
    get outputDescription() 
    set outputDescription(v: string) 
    get spendable() 
    set spendable(v: boolean) 
    get change() 
    set change(v: boolean) 
    get txid() 
    set txid(v: string | undefined) 
    get type() 
    set type(v: string) 
    get providedBy() 
    set providedBy(v: StorageProvidedBy) 
    get purpose() 
    set purpose(v: string) 
    get spendingDescription() 
    set spendingDescription(v: string | undefined) 
    get derivationPrefix() 
    set derivationPrefix(v: string | undefined) 
    get derivationSuffix() 
    set derivationSuffix(v: string | undefined) 
    get senderIdentityKey() 
    set senderIdentityKey(v: string | undefined) 
    get customInstructions() 
    set customInstructions(v: string | undefined) 
    get lockingScript() 
    set lockingScript(v: number[] | undefined) 
    get scriptLength() 
    set scriptLength(v: number | undefined) 
    get scriptOffset() 
    set scriptOffset(v: number | undefined) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableOutput, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutput, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityOutput;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutput, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [StorageProvidedBy](./client.md#type-storageprovidedby), [SyncMap](./storage.md#interface-syncmap), [TableOutput](./storage.md#interface-tableoutput), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityOutputBasket

```ts
export class EntityOutputBasket extends EntityBase<TableOutputBasket> {
    constructor(api?: TableOutputBasket) 
    get basketId() 
    set basketId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get userId() 
    set userId(v: number) 
    get name() 
    set name(v: string) 
    get numberOfDesiredUTXOs() 
    set numberOfDesiredUTXOs(v: number) 
    get minimumDesiredUTXOValue() 
    set minimumDesiredUTXOValue(v: number) 
    get isDeleted() 
    set isDeleted(v: boolean) 
    override get id() 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override updateApi(): void 
    override equals(ei: TableOutputBasket, syncMap?: SyncMap): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutputBasket, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityOutputBasket;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutputBasket, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityOutputTag

```ts
export class EntityOutputTag extends EntityBase<TableOutputTag> {
    constructor(api?: TableOutputTag) 
    override updateApi(): void 
    get outputTagId() 
    set outputTagId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get tag() 
    set tag(v: string) 
    get userId() 
    set userId(v: number) 
    get isDeleted() 
    set isDeleted(v: boolean) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableOutputTag, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutputTag, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityOutputTag;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutputTag, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableOutputTag](./storage.md#interface-tableoutputtag), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityOutputTagMap

```ts
export class EntityOutputTagMap extends EntityBase<TableOutputTagMap> {
    constructor(api?: TableOutputTagMap) 
    override updateApi(): void 
    get outputTagId() 
    set outputTagId(v: number) 
    get outputId() 
    set outputId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get isDeleted() 
    set isDeleted(v: boolean) 
    override get id(): number 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableOutputTagMap, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutputTagMap, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityOutputTagMap;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutputTagMap, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityProvenTx

```ts
export class EntityProvenTx extends EntityBase<TableProvenTx> {
    static async fromTxid(txid: string, services: WalletServices, rawTx?: number[]): Promise<ProvenTxFromTxidResult> 
    constructor(api?: TableProvenTx) 
    override updateApi(): void 
    getMerklePath(): MerklePath 
    _mp?: MerklePath;
    get provenTxId() 
    set provenTxId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get txid() 
    set txid(v: string) 
    get height() 
    set height(v: number) 
    get index() 
    set index(v: number) 
    get merklePath() 
    set merklePath(v: number[]) 
    get rawTx() 
    set rawTx(v: number[]) 
    get blockHash() 
    set blockHash(v: string) 
    get merkleRoot() 
    set merkleRoot(v: string) 
    override get id() 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableProvenTx, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableProvenTx, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityProvenTx;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableProvenTx, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
    static getProofAttemptsLimit = 8;
    static getProofMinutes = 60;
    static async fromReq(req: EntityProvenTxReq, gmpResult: GetMerklePathResult, countsAsAttempt: boolean): Promise<EntityProvenTx | undefined> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityProvenTxReq](./storage.md#class-entityproventxreq), [EntityStorage](./storage.md#type-entitystorage), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [ProvenTxFromTxidResult](./storage.md#interface-proventxfromtxidresult), [SyncMap](./storage.md#interface-syncmap), [TableProvenTx](./storage.md#interface-tableproventx), [TrxToken](./client.md#interface-trxtoken), [WalletServices](./client.md#interface-walletservices), [blockHash](./services.md#function-blockhash)

###### Property getProofAttemptsLimit

How high attempts can go before status is forced to invalid

```ts
static getProofAttemptsLimit = 8
```

###### Property getProofMinutes

How many hours we have to try for a poof

```ts
static getProofMinutes = 60
```

###### Method fromReq

Try to create a new ProvenTx from a ProvenTxReq and GetMerkleProofResultApi

Otherwise it returns undefined and updates req.status to either 'unknown', 'invalid', or 'unconfirmed'

```ts
static async fromReq(req: EntityProvenTxReq, gmpResult: GetMerklePathResult, countsAsAttempt: boolean): Promise<EntityProvenTx | undefined> 
```
See also: [EntityProvenTx](./storage.md#class-entityproventx), [EntityProvenTxReq](./storage.md#class-entityproventxreq), [GetMerklePathResult](./client.md#interface-getmerklepathresult)

###### Method fromTxid

Given a txid and optionally its rawTx, create a new ProvenTx object.

rawTx is fetched if not provided.

Only succeeds (proven is not undefined) if a proof is confirmed for rawTx,
and hash of rawTx is confirmed to match txid

The returned ProvenTx and ProvenTxReq objects have not been added to the storage database,
this is optional and can be done by the caller if appropriate.

```ts
static async fromTxid(txid: string, services: WalletServices, rawTx?: number[]): Promise<ProvenTxFromTxidResult> 
```
See also: [ProvenTxFromTxidResult](./storage.md#interface-proventxfromtxidresult), [WalletServices](./client.md#interface-walletservices)

###### Method getMerklePath

```ts
getMerklePath(): MerklePath 
```

Returns

desirialized `MerklePath` object, value is cached.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityProvenTxReq

```ts
export class EntityProvenTxReq extends EntityBase<TableProvenTxReq> {
    static async fromStorageTxid(storage: EntityStorage, txid: string, trx?: TrxToken): Promise<EntityProvenTxReq | undefined> 
    static async fromStorageId(storage: EntityStorage, id: number, trx?: TrxToken): Promise<EntityProvenTxReq> 
    static fromTxid(txid: string, rawTx: number[], inputBEEF?: number[]): EntityProvenTxReq 
    history: ProvenTxReqHistory;
    notify: ProvenTxReqNotify;
    packApiHistory() 
    packApiNotify() 
    unpackApiHistory() 
    unpackApiNotify() 
    get apiHistory(): string 
    get apiNotify(): string 
    set apiHistory(v: string) 
    set apiNotify(v: string) 
    updateApi(): void 
    unpackApi(): void 
    async refreshFromStorage(storage: EntityStorage | WalletStorageManager, trx?: TrxToken): Promise<void> 
    constructor(api?: TableProvenTxReq) 
    historySince(since: Date): ProvenTxReqHistory 
    historyPretty(since?: Date, indent = 0): string 
    prettyNote(note: ReqHistoryNote): string 
    getHistorySummary(): ProvenTxReqHistorySummaryApi 
    parseHistoryNote(note: ReqHistoryNote, summary?: ProvenTxReqHistorySummaryApi): string 
    addNotifyTransactionId(id: number) 
    addHistoryNote(note: ReqHistoryNote, noDupes?: boolean) 
    async updateStorage(storage: EntityStorage, trx?: TrxToken) 
    async updateStorageDynamicProperties(storage: WalletStorageManager | StorageProvider, trx?: TrxToken) 
    async insertOrMerge(storage: EntityStorage, trx?: TrxToken): Promise<EntityProvenTxReq> 
    get status() 
    set status(v: ProvenTxReqStatus) 
    get provenTxReqId() 
    set provenTxReqId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get txid() 
    set txid(v: string) 
    get inputBEEF() 
    set inputBEEF(v: number[] | undefined) 
    get rawTx() 
    set rawTx(v: number[]) 
    get attempts() 
    set attempts(v: number) 
    get provenTxId() 
    set provenTxId(v: number | undefined) 
    get notified() 
    set notified(v: boolean) 
    get batch() 
    set batch(v: string | undefined) 
    override get id() 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableProvenTxReq, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableProvenTxReq, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityProvenTxReq;
        eiId: number;
    }> 
    mapNotifyTransactionIds(syncMap: SyncMap): void 
    mergeNotifyTransactionIds(ei: TableProvenTxReq, syncMap?: SyncMap): void 
    mergeHistory(ei: TableProvenTxReq, syncMap?: SyncMap, noDupes?: boolean): void 
    static isTerminalStatus(status: ProvenTxReqStatus): boolean 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableProvenTxReq, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [ProvenTxReqHistory](./storage.md#interface-proventxreqhistory), [ProvenTxReqHistorySummaryApi](./storage.md#interface-proventxreqhistorysummaryapi), [ProvenTxReqNotify](./storage.md#interface-proventxreqnotify), [ProvenTxReqStatus](./client.md#type-proventxreqstatus), [ReqHistoryNote](./client.md#type-reqhistorynote), [StorageProvider](./storage.md#class-storageprovider), [SyncMap](./storage.md#interface-syncmap), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TrxToken](./client.md#interface-trxtoken), [WalletStorageManager](./storage.md#class-walletstoragemanager)

###### Method addHistoryNote

Adds a note to history.
Notes with identical property values to an existing note are ignored.

```ts
addHistoryNote(note: ReqHistoryNote, noDupes?: boolean) 
```
See also: [ReqHistoryNote](./client.md#type-reqhistorynote)

Argument Details

+ **note**
  + Note to add
+ **noDupes**
  + if true, only newest note with same `what` value is retained.

###### Method equals

'convergent' equality must satisfy (A sync B) equals (B sync A)

```ts
override equals(ei: TableProvenTxReq, syncMap?: SyncMap | undefined): boolean 
```
See also: [SyncMap](./storage.md#interface-syncmap), [TableProvenTxReq](./storage.md#interface-tableproventxreq)

###### Method historySince

Returns history to only what followed since date.

```ts
historySince(since: Date): ProvenTxReqHistory 
```
See also: [ProvenTxReqHistory](./storage.md#interface-proventxreqhistory)

###### Method mergeExisting

When merging `ProvenTxReq`, care is taken to avoid short-cirtuiting notification: `status` must not transition to `completed` without
passing through `notifying`. Thus a full convergent merge passes through these sequence steps:
1. Remote storage completes before local storage.
2. The remotely completed req and ProvenTx sync to local storage.
3. The local storage transitions to `notifying`, after merging the remote attempts and history.
4. The local storage notifies, transitioning to `completed`.
5. Having been updated, the local req, but not ProvenTx sync to remote storage, but do not merge because the earlier `completed` wins.
6. Convergent equality is achieved (completing work - history and attempts are equal)

On terminal failure: `doubleSpend` trumps `invalid` as it contains more data.

```ts
override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableProvenTxReq, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
```
See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TrxToken](./client.md#interface-trxtoken)

###### Method updateStorage

Updates database record with current state of this EntityUser

```ts
async updateStorage(storage: EntityStorage, trx?: TrxToken) 
```
See also: [EntityStorage](./storage.md#type-entitystorage), [TrxToken](./client.md#interface-trxtoken)

###### Method updateStorageDynamicProperties

Update storage with changes to non-static properties:
  updated_at
  provenTxId
  status
  history
  notify
  notified
  attempts
  batch

```ts
async updateStorageDynamicProperties(storage: WalletStorageManager | StorageProvider, trx?: TrxToken) 
```
See also: [StorageProvider](./storage.md#class-storageprovider), [TrxToken](./client.md#interface-trxtoken), [WalletStorageManager](./storage.md#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntitySyncState

```ts
export class EntitySyncState extends EntityBase<TableSyncState> {
    constructor(api?: TableSyncState) 
    validateSyncMap(sm: SyncMap) 
    static async fromStorage(storage: WalletStorageSync, userIdentityKey: string, remoteSettings: TableSettings): Promise<EntitySyncState> 
    async updateStorage(storage: EntityStorage, notSyncMap?: boolean, trx?: TrxToken) 
    override updateApi(notSyncMap?: boolean): void 
    set created_at(v: Date) 
    get created_at() 
    set updated_at(v: Date) 
    get updated_at() 
    set userId(v: number) 
    get userId() 
    set storageIdentityKey(v: string) 
    get storageIdentityKey() 
    set storageName(v: string) 
    get storageName() 
    set init(v: boolean) 
    get init() 
    set refNum(v: string) 
    get refNum() 
    set status(v: SyncStatus) 
    get status(): SyncStatus 
    set when(v: Date | undefined) 
    get when() 
    set satoshis(v: number | undefined) 
    get satoshis() 
    get apiErrorLocal() 
    get apiErrorOther() 
    get apiSyncMap() 
    override get id(): number 
    set id(id: number) 
    override get entityName(): string 
    override get entityTable(): string 
    static mergeIdMap(fromMap: Record<number, number>, toMap: Record<number, number>) 
    mergeSyncMap(iSyncMap: SyncMap) 
    errorLocal: SyncError | undefined;
    errorOther: SyncError | undefined;
    syncMap: SyncMap;
    override equals(ei: TableSyncState, syncMap?: SyncMap | undefined): boolean 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableSyncState, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
    makeRequestSyncChunkArgs(forIdentityKey: string, forStorageIdentityKey: string, maxRoughSize?: number, maxItems?: number): RequestSyncChunkArgs 
    static syncChunkSummary(c: SyncChunk): string {
        let log = "";
        log += `SYNC CHUNK SUMMARY
  from storage: ${c.fromStorageIdentityKey}
  to storage: ${c.toStorageIdentityKey}
  for user: ${c.userIdentityKey}
`;
        if (c.user)
            log += `  USER activeStorage ${c.user.activeStorage}\n`;
        if (!!c.provenTxs) {
            log += `  PROVEN_TXS\n`;
            for (const r of c.provenTxs) {
                log += `    ${r.provenTxId} ${r.txid}\n`;
            }
        }
        if (!!c.provenTxReqs) {
            log += `  PROVEN_TX_REQS\n`;
            for (const r of c.provenTxReqs) {
                log += `    ${r.provenTxReqId} ${r.txid} ${r.status} ${r.provenTxId || ""}\n`;
            }
        }
        if (!!c.transactions) {
            log += `  TRANSACTIONS\n`;
            for (const r of c.transactions) {
                log += `    ${r.transactionId} ${r.txid} ${r.status} ${r.provenTxId || ""} sats:${r.satoshis}\n`;
            }
        }
        if (!!c.outputs) {
            log += `  OUTPUTS\n`;
            for (const r of c.outputs) {
                log += `    ${r.outputId} ${r.txid}.${r.vout} ${r.transactionId} ${r.spendable ? "spendable" : ""} sats:${r.satoshis}\n`;
            }
        }
        return log;
    }
    async processSyncChunk(writer: EntityStorage, args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<{
        done: boolean;
        maxUpdated_at: Date | undefined;
        updates: number;
        inserts: number;
    }> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [SyncChunk](./client.md#interface-syncchunk), [SyncError](./storage.md#interface-syncerror), [SyncMap](./storage.md#interface-syncmap), [SyncStatus](./client.md#type-syncstatus), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TrxToken](./client.md#interface-trxtoken), [WalletStorageSync](./client.md#interface-walletstoragesync)

###### Method mergeSyncMap

Merge additions to the syncMap

```ts
mergeSyncMap(iSyncMap: SyncMap) 
```
See also: [SyncMap](./storage.md#interface-syncmap)

###### Method updateStorage

Handles both insert and update based on id value: zero indicates insert.

```ts
async updateStorage(storage: EntityStorage, notSyncMap?: boolean, trx?: TrxToken) 
```
See also: [EntityStorage](./storage.md#type-entitystorage), [TrxToken](./client.md#interface-trxtoken)

Argument Details

+ **notSyncMap**
  + if not new and true, excludes updating syncMap in storage.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityTransaction

```ts
export class EntityTransaction extends EntityBase<TableTransaction> {
    getBsvTx(): BsvTransaction | undefined 
    getBsvTxIns(): TransactionInput[] 
    async getInputs(storage: EntityStorage, trx?: TrxToken): Promise<TableOutput[]> 
    constructor(api?: TableTransaction) 
    override updateApi(): void 
    get transactionId() 
    set transactionId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get version() 
    set version(v: number | undefined) 
    get lockTime() 
    set lockTime(v: number | undefined) 
    get isOutgoing() 
    set isOutgoing(v: boolean) 
    get status() 
    set status(v: TransactionStatus) 
    get userId() 
    set userId(v: number) 
    get provenTxId() 
    set provenTxId(v: number | undefined) 
    get satoshis() 
    set satoshis(v: number) 
    get txid() 
    set txid(v: string | undefined) 
    get reference() 
    set reference(v: string) 
    get inputBEEF() 
    set inputBEEF(v: number[] | undefined) 
    get description() 
    set description(v: string) 
    get rawTx() 
    set rawTx(v: number[] | undefined) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableTransaction, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableTransaction, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityTransaction;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableTransaction, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
    async getProvenTx(storage: EntityStorage, trx?: TrxToken): Promise<EntityProvenTx | undefined> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityProvenTx](./storage.md#class-entityproventx), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableOutput](./storage.md#interface-tableoutput), [TableTransaction](./storage.md#interface-tabletransaction), [TransactionStatus](./client.md#type-transactionstatus), [TrxToken](./client.md#interface-trxtoken)

###### Method getBsvTxIns

```ts
getBsvTxIns(): TransactionInput[] 
```

Returns

array of

###### Method getInputs

Returns an array of "known" inputs to this transaction which belong to the same userId.
Uses both spentBy and rawTx inputs (if available) to locate inputs from among user's outputs.
Not all transaction inputs correspond to prior storage outputs.

```ts
async getInputs(storage: EntityStorage, trx?: TrxToken): Promise<TableOutput[]> 
```
See also: [EntityStorage](./storage.md#type-entitystorage), [TableOutput](./storage.md#interface-tableoutput), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityTxLabel

```ts
export class EntityTxLabel extends EntityBase<TableTxLabel> {
    constructor(api?: TableTxLabel) 
    override updateApi(): void 
    get txLabelId() 
    set txLabelId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get label() 
    set label(v: string) 
    get userId() 
    set userId(v: number) 
    get isDeleted() 
    set isDeleted(v: boolean) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableTxLabel, syncMap?: SyncMap): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableTxLabel, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityTxLabel;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableTxLabel, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableTxLabel](./storage.md#interface-tabletxlabel), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityTxLabelMap

```ts
export class EntityTxLabelMap extends EntityBase<TableTxLabelMap> {
    constructor(api?: TableTxLabelMap) 
    override updateApi(): void 
    get txLabelId() 
    set txLabelId(v: number) 
    get transactionId() 
    set transactionId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get isDeleted() 
    set isDeleted(v: boolean) 
    override get id(): number 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableTxLabelMap, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableTxLabelMap, syncMap: SyncMap, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityTxLabelMap;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableTxLabelMap, syncMap: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityUser

```ts
export class EntityUser extends EntityBase<TableUser> {
    constructor(api?: TableUser) 
    override updateApi(): void 
    get userId() 
    set userId(v: number) 
    get created_at() 
    set created_at(v: Date) 
    get updated_at() 
    set updated_at(v: Date) 
    get identityKey() 
    set identityKey(v: string) 
    get activeStorage() 
    set activeStorage(v: string) 
    override get id(): number 
    override set id(v: number) 
    override get entityName(): string 
    override get entityTable(): string 
    override equals(ei: TableUser, syncMap?: SyncMap | undefined): boolean 
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableUser, trx?: TrxToken): Promise<{
        found: boolean;
        eo: EntityUser;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableUser, syncMap?: SyncMap, trx?: TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableUser](./storage.md#interface-tableuser), [TrxToken](./client.md#interface-trxtoken)

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
##### Class: MergeEntity

```ts
export class MergeEntity<API extends EntityTimeStamp, DE extends EntityBase<API>> {
    idMap: Record<number, number>;
    constructor(public stateArray: API[] | undefined, public find: (storage: EntityStorage, userId: number, ei: API, syncMap: SyncMap, trx?: TrxToken) => Promise<{
        found: boolean;
        eo: DE;
        eiId: number;
    }>, public esm: EntitySyncMap) 
    updateSyncMap(map: Record<number, number>, inId: number, outId: number) 
    async merge(since: Date | undefined, storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<{
        inserts: number;
        updates: number;
    }> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [EntitySyncMap](./storage.md#interface-entitysyncmap), [EntityTimeStamp](./client.md#interface-entitytimestamp), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

###### Method merge

```ts
async merge(since: Date | undefined, storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: TrxToken): Promise<{
    inserts: number;
    updates: number;
}> 
```
See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

Argument Details

+ **since**
  + date of current sync chunk

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: Monitor

Background task to make sure transactions are processed, transaction proofs are received and propagated,
and potentially that reorgs update proofs that were already received.

```ts
export class Monitor {
    static createDefaultWalletMonitorOptions(chain: Chain, storage: MonitorStorage, services?: Services, chaintracks?: Chaintracks): MonitorOptions 
    options: MonitorOptions;
    services: Services;
    chain: Chain;
    storage: MonitorStorage;
    chaintracks: ChaintracksClientApi;
    chaintracksWithEvents?: Chaintracks;
    reorgSubscriptionPromise?: Promise<string>;
    headersSubscriptionPromise?: Promise<string>;
    onTransactionBroadcasted?: (broadcastResult: ReviewActionResult) => Promise<void>;
    onTransactionProven?: (txStatus: ProvenTransactionStatus) => Promise<void>;
    constructor(options: MonitorOptions) 
    async destroy(): Promise<void> 
    static readonly oneSecond = 1000;
    static readonly oneMinute = 60 * Monitor.oneSecond;
    static readonly oneHour = 60 * Monitor.oneMinute;
    static readonly oneDay = 24 * Monitor.oneHour;
    static readonly oneWeek = 7 * Monitor.oneDay;
    _tasks: WalletMonitorTask[] = [];
    _otherTasks: WalletMonitorTask[] = [];
    _tasksRunning = false;
    defaultPurgeParams: TaskPurgeParams = {
        purgeSpent: false,
        purgeCompleted: false,
        purgeFailed: true,
        purgeSpentAge: 2 * Monitor.oneWeek,
        purgeCompletedAge: 2 * Monitor.oneWeek,
        purgeFailedAge: 5 * Monitor.oneDay
    };
    addAllTasksToOther(): void 
    addDefaultTasks(): void 
    addMultiUserTasks(): void 
    addTask(task: WalletMonitorTask): void 
    removeTask(name: string): void 
    async runTask(name: string): Promise<string> 
    async runOnce(): Promise<void> 
    _runAsyncSetup: boolean = true;
    _tasksRunningPromise?: PromiseLike<void>;
    resolveCompletion: ((value: void | PromiseLike<void>) => void) | undefined = undefined;
    async startTasks(): Promise<void> 
    async logEvent(event: string, details?: string): Promise<void> 
    stopTasks(): void 
    lastNewHeader: BlockHeader | undefined;
    lastNewHeaderWhen: Date | undefined;
    processNewBlockHeader(header: BlockHeader): void 
    callOnBroadcastedTransaction(broadcastResult: ReviewActionResult): void 
    callOnProvenTransaction(txStatus: ProvenTransactionStatus): void 
    deactivatedHeaders: DeactivedHeader[] = [];
    processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader, deactivatedHeaders?: BlockHeader[]): void 
    processHeader(header: BlockHeader): void 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain), [Chaintracks](./services.md#class-chaintracks), [ChaintracksClientApi](./services.md#interface-chaintracksclientapi), [DeactivedHeader](./monitor.md#interface-deactivedheader), [MonitorOptions](./monitor.md#interface-monitoroptions), [MonitorStorage](./monitor.md#type-monitorstorage), [ProvenTransactionStatus](./client.md#interface-proventransactionstatus), [ReviewActionResult](./client.md#interface-reviewactionresult), [Services](./services.md#class-services), [TaskPurgeParams](./monitor.md#interface-taskpurgeparams), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property _otherTasks

_otherTasks can be run by runTask but not by scheduler.

```ts
_otherTasks: WalletMonitorTask[] = []
```
See also: [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property _tasks

_tasks are typically run by the scheduler but may also be run by runTask.

```ts
_tasks: WalletMonitorTask[] = []
```
See also: [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Method addDefaultTasks

Default tasks with settings appropriate for a single user storage
possibly with sync'ing enabled

```ts
addDefaultTasks(): void 
```

###### Method addMultiUserTasks

Tasks appropriate for multi-user storage
without sync'ing enabled.

```ts
addMultiUserTasks(): void 
```

###### Method callOnBroadcastedTransaction

This is a function run from a TaskSendWaiting Monitor task.

This allows the user of wallet-toolbox to 'subscribe' for transaction broadcast updates.

```ts
callOnBroadcastedTransaction(broadcastResult: ReviewActionResult): void 
```
See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

###### Method callOnProvenTransaction

This is a function run from a TaskCheckForProofs Monitor task.

This allows the user of wallet-toolbox to 'subscribe' for transaction updates.

```ts
callOnProvenTransaction(txStatus: ProvenTransactionStatus): void 
```
See also: [ProvenTransactionStatus](./client.md#interface-proventransactionstatus)

###### Method processHeader

Handler for new header events from Chaintracks.

To minimize reorg processing, new headers are aged before processing via TaskNewHeader.
Therefore this handler is intentionally a no-op.

```ts
processHeader(header: BlockHeader): void 
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method processNewBlockHeader

Process new chain header event received from Chaintracks

Kicks processing 'unconfirmed' and 'unmined' request processing.

```ts
processNewBlockHeader(header: BlockHeader): void 
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method processReorg

Process reorg event received from Chaintracks

Reorgs can move recent transactions to new blocks at new index positions.
Affected transaction proofs become invalid and must be updated.

It is possible for a transaction to become invalid.

Coinbase transactions always become invalid.

```ts
processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader, deactivatedHeaders?: BlockHeader[]): void 
```
See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: OverlayUMPTokenInteractor

```ts
export class OverlayUMPTokenInteractor implements UMPTokenInteractor {
    constructor(resolver: LookupResolver = new LookupResolver(), broadcaster: SHIPBroadcaster = new SHIPBroadcaster(["tm_users"])) 
    public async findByPresentationKeyHash(hash: number[]): Promise<UMPToken | undefined> 
    public async findByRecoveryKeyHash(hash: number[]): Promise<UMPToken | undefined> 
    public async buildAndSend(wallet: WalletInterface, adminOriginator: OriginatorDomainNameStringUnder250Bytes, token: UMPToken, oldTokenToConsume?: UMPToken): Promise<OutpointString> 
}
```

See also: [UMPToken](./client.md#interface-umptoken), [UMPTokenInteractor](./client.md#interface-umptokeninteractor)

###### Constructor

Construct a new OverlayUMPTokenInteractor.

```ts
constructor(resolver: LookupResolver = new LookupResolver(), broadcaster: SHIPBroadcaster = new SHIPBroadcaster(["tm_users"])) 
```

Argument Details

+ **resolver**
  + A LookupResolver instance for performing overlay queries (ls_users).
+ **broadcaster**
  + A SHIPBroadcaster instance for sharing new or updated tokens across the `tm_users` overlay.

###### Method buildAndSend

Creates or updates (replaces) a UMP token on-chain. If `oldTokenToConsume` is provided,
it is spent in the same transaction that creates the new token output. The new token is
then broadcast and published under the `tm_users` topic using a SHIP broadcast, ensuring
overlay participants see the updated token.

```ts
public async buildAndSend(wallet: WalletInterface, adminOriginator: OriginatorDomainNameStringUnder250Bytes, token: UMPToken, oldTokenToConsume?: UMPToken): Promise<OutpointString> 
```
See also: [UMPToken](./client.md#interface-umptoken)

Returns

The outpoint of the newly created UMP token (e.g. "abcd1234...ef.0").

Argument Details

+ **wallet**
  + The wallet used to build and sign the transaction (MUST be operating under the DEFAULT profile).
+ **adminOriginator**
  + The domain/FQDN of the administrative originator (wallet operator).
+ **token**
  + The new UMPToken to create on-chain.
+ **oldTokenToConsume**
  + Optionally, an existing token to consume/spend in the same transaction.

###### Method findByPresentationKeyHash

Finds a UMP token on-chain by the given presentation key hash, if it exists.
Uses the ls_users overlay service to perform the lookup.

```ts
public async findByPresentationKeyHash(hash: number[]): Promise<UMPToken | undefined> 
```
See also: [UMPToken](./client.md#interface-umptoken)

Returns

A UMPToken object (including currentOutpoint) if found, otherwise undefined.

Argument Details

+ **hash**
  + The 32-byte SHA-256 hash of the presentation key.

###### Method findByRecoveryKeyHash

Finds a UMP token on-chain by the given recovery key hash, if it exists.
Uses the ls_users overlay service to perform the lookup.

```ts
public async findByRecoveryKeyHash(hash: number[]): Promise<UMPToken | undefined> 
```
See also: [UMPToken](./client.md#interface-umptoken)

Returns

A UMPToken object (including currentOutpoint) if found, otherwise undefined.

Argument Details

+ **hash**
  + The 32-byte SHA-256 hash of the recovery key.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: PersonaIDInteractor

```ts
export class PersonaIDInteractor extends AuthMethodInteractor {
    public methodType = "PersonaID";
    public async startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse> 
    public async completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse> 
}
```

See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor), [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse), [StartAuthResponse](./client.md#interface-startauthresponse)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: PrivilegedKeyManager

PrivilegedKeyManager

This class manages a privileged (i.e., very sensitive) private key, obtained from
an external function (`keyGetter`), which might be backed by HSMs, secure enclaves,
or other secure storage. The manager retains the key in memory only for a limited
duration (`retentionPeriod`), uses XOR-based chunk-splitting obfuscation, and
includes decoy data to raise the difficulty of discovering the real key in memory.

IMPORTANT: While these measures raise the bar for attackers, JavaScript environments
do not provide perfect in-memory secrecy.

```ts
export class PrivilegedKeyManager implements ProtoWallet {
    constructor(keyGetter: (reason: string) => Promise<PrivateKey>, retentionPeriod = 120000) 
    destroyKey(): void 
    async getPublicKey(args: GetPublicKeyArgs): Promise<{
        publicKey: PubKeyHex;
    }> 
    async revealCounterpartyKeyLinkage(args: RevealCounterpartyKeyLinkageArgs): Promise<RevealCounterpartyKeyLinkageResult> 
    async revealSpecificKeyLinkage(args: RevealSpecificKeyLinkageArgs): Promise<RevealSpecificKeyLinkageResult> 
    async encrypt(args: WalletEncryptArgs): Promise<WalletEncryptResult> 
    async decrypt(args: WalletDecryptArgs): Promise<WalletDecryptResult> 
    async createHmac(args: CreateHmacArgs): Promise<CreateHmacResult> 
    async verifyHmac(args: VerifyHmacArgs): Promise<VerifyHmacResult> 
    async createSignature(args: CreateSignatureArgs): Promise<CreateSignatureResult> 
    async verifySignature(args: VerifySignatureArgs): Promise<VerifySignatureResult> 
}
```

###### Constructor

```ts
constructor(keyGetter: (reason: string) => Promise<PrivateKey>, retentionPeriod = 120000) 
```

Argument Details

+ **keyGetter**
  + Asynchronous function that retrieves the PrivateKey from a secure environment.
+ **retentionPeriod**
  + Time in milliseconds to retain the obfuscated key in memory before zeroizing.

###### Method destroyKey

Safely destroys the in-memory obfuscated key material by zeroizing
and deleting related fields. Also destroys some (but not all) decoy
properties to further confuse an attacker.

```ts
destroyKey(): void 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ReaderUint8Array

```ts
export class ReaderUint8Array {
    public bin: Uint8Array;
    public pos: number;
    static makeReader(bin: Uint8Array | number[], pos: number = 0): ReaderUint8Array | Utils.Reader 
    constructor(bin: Uint8Array = new Uint8Array(0), pos: number = 0) 
    public eof(): boolean 
    public read(len = this.length): Uint8Array 
    public readReverse(len = this.length): Uint8Array 
    public readUInt8(): number 
    public readInt8(): number 
    public readUInt16BE(): number 
    public readInt16BE(): number 
    public readUInt16LE(): number 
    public readInt16LE(): number 
    public readUInt32BE(): number 
    public readInt32BE(): number 
    public readUInt32LE(): number 
    public readInt32LE(): number 
    public readUInt64BEBn(): BigNumber 
    public readUInt64LEBn(): BigNumber 
    public readInt64LEBn(): BigNumber 
    public readVarIntNum(signed: boolean = true): number 
    public readVarInt(): Uint8Array 
    public readVarIntBn(): BigNumber 
}
```

See also: [readUInt32BE](./services.md#function-readuint32be), [readUInt32LE](./services.md#function-readuint32le)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: ScriptTemplateBRC29

Simple Authenticated BSV P2PKH Payment Protocol
https://brc.dev/29

```ts
export class ScriptTemplateBRC29 implements ScriptTemplate {
    p2pkh: P2PKH;
    constructor(public params: ScriptTemplateParamsBRC29) 
    getKeyID() 
    getKeyDeriver(privKey: PrivateKey | HexString): KeyDeriverApi 
    lock(lockerPrivKey: string, unlockerPubKey: string): LockingScript 
    unlock(unlockerPrivKey: string, lockerPubKey: string, sourceSatoshis?: number, lockingScript?: Script): ScriptTemplateUnlock 
    unlockLength = 108;
}
```

See also: [ScriptTemplateParamsBRC29](./client.md#interface-scripttemplateparamsbrc29), [ScriptTemplateUnlock](./client.md#interface-scripttemplateunlock)

###### Property unlockLength

P2PKH unlock estimateLength is a constant

```ts
unlockLength = 108
```

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
##### Class: SetupClient

The 'Setup` class provides static setup functions to construct BRC-100 compatible
wallets in a variety of configurations.

It serves as a starting point for experimentation and customization.

```ts
export abstract class SetupClient {
    static async createWallet(args: SetupClientWalletArgs): Promise<SetupWallet> {
        const chain = args.chain;
        const rootKey = PrivateKey.fromHex(args.rootKeyHex);
        const identityKey = rootKey.toPublicKey().toString();
        const keyDeriver = new CachedKeyDeriver(rootKey);
        const storage = new WalletStorageManager(identityKey, args.active, args.backups);
        if (storage.canMakeAvailable())
            await storage.makeAvailable();
        const serviceOptions = Services.createDefaultOptions(chain);
        serviceOptions.taalApiKey = args.taalApiKey;
        const services = new Services(serviceOptions);
        const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services);
        const monitor = new Monitor(monopts);
        monitor.addDefaultTasks();
        const privilegedKeyManager = args.privilegedKeyGetter
            ? new PrivilegedKeyManager(args.privilegedKeyGetter)
            : undefined;
        const wallet = new Wallet({
            chain,
            keyDeriver,
            storage,
            services,
            monitor,
            privilegedKeyManager
        });
        const r: SetupWallet = {
            rootKey,
            identityKey,
            keyDeriver,
            chain,
            storage,
            services,
            monitor,
            wallet
        };
        return r;
    }
    static async createWalletClientNoEnv(args: {
        chain: Chain;
        rootKeyHex: string;
        storageUrl?: string;
        privilegedKeyGetter?: () => Promise<PrivateKey>;
    }): Promise<Wallet> 
    static async createWalletClient(args: SetupClientWalletClientArgs): Promise<SetupWalletClient> {
        const wo = await SetupClient.createWallet(args);
        const endpointUrl = args.endpointUrl || `https://${args.chain !== "main" ? "staging-" : ""}storage.babbage.systems`;
        const client = new StorageClient(wo.wallet, endpointUrl);
        await wo.storage.addWalletStorageProvider(client);
        await wo.storage.makeAvailable();
        return {
            ...wo,
            endpointUrl
        };
    }
    static getKeyPair(priv?: string | PrivateKey): KeyPairAddress {
        if (priv === undefined)
            priv = PrivateKey.fromRandom();
        else if (typeof priv === "string")
            priv = new PrivateKey(priv, "hex");
        const pub = PublicKey.fromPrivateKey(priv);
        const address = pub.toAddress();
        return { privateKey: priv, publicKey: pub, address };
    }
    static getLockP2PKH(address: string): LockingScript {
        const p2pkh = new P2PKH();
        const lock = p2pkh.lock(address);
        return lock;
    }
    static getUnlockP2PKH(priv: PrivateKey, satoshis: number): ScriptTemplateUnlock {
        const p2pkh = new P2PKH();
        const lock = SetupClient.getLockP2PKH(SetupClient.getKeyPair(priv).address);
        const unlock = p2pkh.unlock(priv, "all", false, satoshis, lock);
        return unlock;
    }
    static createP2PKHOutputs(outputs: {
        address: string;
        satoshis: number;
        outputDescription?: string;
        basket?: string;
        tags?: string[];
    }[]): CreateActionOutput[] {
        const os: CreateActionOutput[] = [];
        const count = outputs.length;
        for (let i = 0; i < count; i++) {
            const o = outputs[i];
            os.push({
                basket: o.basket,
                tags: o.tags,
                satoshis: o.satoshis,
                lockingScript: SetupClient.getLockP2PKH(o.address).toHex(),
                outputDescription: o.outputDescription || `p2pkh ${i}`
            });
        }
        return os;
    }
    static async createP2PKHOutputsAction(wallet: WalletInterface, outputs: {
        address: string;
        satoshis: number;
        outputDescription?: string;
        basket?: string;
        tags?: string[];
    }[], options?: CreateActionOptions): Promise<{
        cr: CreateActionResult;
        outpoints: string[] | undefined;
    }> {
        const os = SetupClient.createP2PKHOutputs(outputs);
        const createArgs: CreateActionArgs = {
            description: `createP2PKHOutputs`,
            outputs: os,
            options: {
                ...options,
                randomizeOutputs: false
            }
        };
        const cr = await wallet.createAction(createArgs);
        let outpoints: string[] | undefined;
        if (cr.txid) {
            outpoints = os.map((o, i) => `${cr.txid}.${i}`);
        }
        return { cr, outpoints };
    }
    static async fundWalletFromP2PKHOutpoints(wallet: WalletInterface, outpoints: string[], p2pkhKey: KeyPairAddress, inputBEEF?: BEEF) {
    }
    static async createWalletIdb(args: SetupWalletIdbArgs): Promise<SetupWalletIdb> {
        const wo = await SetupClient.createWallet(args);
        const activeStorage = await SetupClient.createStorageIdb(args);
        await wo.storage.addWalletStorageProvider(activeStorage);
        const { user, isNew } = await activeStorage.findOrInsertUser(wo.identityKey);
        const userId = user.userId;
        const r: SetupWalletIdb = {
            ...wo,
            activeStorage,
            userId
        };
        return r;
    }
    static async createStorageIdb(args: SetupWalletIdbArgs): Promise<StorageIdb> 
}
```

See also: [Chain](./client.md#type-chain), [KeyPairAddress](./setup.md#interface-keypairaddress), [Monitor](./monitor.md#class-monitor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [ScriptTemplateUnlock](./client.md#interface-scripttemplateunlock), [Services](./services.md#class-services), [SetupClientWalletArgs](./setup.md#interface-setupclientwalletargs), [SetupClientWalletClientArgs](./setup.md#interface-setupclientwalletclientargs), [SetupWallet](./setup.md#interface-setupwallet), [SetupWalletClient](./setup.md#interface-setupwalletclient), [SetupWalletIdb](./setup.md#interface-setupwalletidb), [SetupWalletIdbArgs](./setup.md#interface-setupwalletidbargs), [StorageClient](./storage.md#class-storageclient), [StorageIdb](./storage.md#class-storageidb), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager), [createAction](./storage.md#function-createaction)

###### Method createStorageIdb

```ts
static async createStorageIdb(args: SetupWalletIdbArgs): Promise<StorageIdb> 
```
See also: [SetupWalletIdbArgs](./setup.md#interface-setupwalletidbargs), [StorageIdb](./storage.md#class-storageidb)

Returns

- `Knex` based storage provider for a wallet. May be used for either active storage or backup storage.

###### Method createWallet

Create a `Wallet`. Storage can optionally be provided or configured later.

The following components are configured: KeyDeriver, WalletStorageManager, WalletService, WalletStorage.
Optionally, PrivilegedKeyManager is also configured.

```ts
static async createWallet(args: SetupClientWalletArgs): Promise<SetupWallet> {
    const chain = args.chain;
    const rootKey = PrivateKey.fromHex(args.rootKeyHex);
    const identityKey = rootKey.toPublicKey().toString();
    const keyDeriver = new CachedKeyDeriver(rootKey);
    const storage = new WalletStorageManager(identityKey, args.active, args.backups);
    if (storage.canMakeAvailable())
        await storage.makeAvailable();
    const serviceOptions = Services.createDefaultOptions(chain);
    serviceOptions.taalApiKey = args.taalApiKey;
    const services = new Services(serviceOptions);
    const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services);
    const monitor = new Monitor(monopts);
    monitor.addDefaultTasks();
    const privilegedKeyManager = args.privilegedKeyGetter
        ? new PrivilegedKeyManager(args.privilegedKeyGetter)
        : undefined;
    const wallet = new Wallet({
        chain,
        keyDeriver,
        storage,
        services,
        monitor,
        privilegedKeyManager
    });
    const r: SetupWallet = {
        rootKey,
        identityKey,
        keyDeriver,
        chain,
        storage,
        services,
        monitor,
        wallet
    };
    return r;
}
```
See also: [Monitor](./monitor.md#class-monitor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [Services](./services.md#class-services), [SetupClientWalletArgs](./setup.md#interface-setupclientwalletargs), [SetupWallet](./setup.md#interface-setupwallet), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager)

###### Method createWalletClientNoEnv

Setup a new `Wallet` without requiring a .env file.

```ts
static async createWalletClientNoEnv(args: {
    chain: Chain;
    rootKeyHex: string;
    storageUrl?: string;
    privilegedKeyGetter?: () => Promise<PrivateKey>;
}): Promise<Wallet> 
```
See also: [Chain](./client.md#type-chain), [Wallet](./client.md#class-wallet)

Argument Details

+ **args.chain**
  + 'main' or 'test'
+ **args.rootKeyHex**
  + Root private key for wallet's key deriver.
+ **args.storageUrl**
  + Optional. `StorageClient` and `chain` compatible endpoint URL.
+ **args.privilegedKeyGetter**
  + Optional. Method that will return the privileged `PrivateKey`, on demand.

###### Method createWalletIdb

Adds `indexedDB` based storage to a `Wallet` configured by `SetupClient.createWalletOnly`

```ts
static async createWalletIdb(args: SetupWalletIdbArgs): Promise<SetupWalletIdb> {
    const wo = await SetupClient.createWallet(args);
    const activeStorage = await SetupClient.createStorageIdb(args);
    await wo.storage.addWalletStorageProvider(activeStorage);
    const { user, isNew } = await activeStorage.findOrInsertUser(wo.identityKey);
    const userId = user.userId;
    const r: SetupWalletIdb = {
        ...wo,
        activeStorage,
        userId
    };
    return r;
}
```
See also: [SetupClient](./setup.md#class-setupclient), [SetupWalletIdb](./setup.md#interface-setupwalletidb), [SetupWalletIdbArgs](./setup.md#interface-setupwalletidbargs)

Argument Details

+ **args.databaseName**
  + Name for this storage. For MySQL, the schema name within the MySQL instance.
+ **args.chain**
  + Which chain this wallet is on: 'main' or 'test'. Defaults to 'test'.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: SimpleWalletManager

SimpleWalletManager is a slimmed-down wallet manager that only requires two things to authenticate:
 1. A primary key (32 bytes), which represents the core secret for the wallet.
 2. A privileged key manager (an instance of `PrivilegedKeyManager`), responsible for
    more sensitive operations.

Once both pieces are provided (or if a snapshot containing the primary key is loaded,
and the privileged key manager is provided separately), the wallet becomes authenticated.

After authentication, calls to the standard wallet methods (`createAction`, `signAction`, etc.)
are proxied to an underlying `WalletInterface` instance returned by a user-supplied `walletBuilder`.

**Important**: This manager does not handle user password flows, recovery, or on-chain
token management. It is a straightforward wrapper that ensures the user has provided
both their main secret (primary key) and a privileged key manager before allowing usage.

It also prevents calls from the special "admin originator" from being used externally.
(Any call that tries to use the admin originator as its originator, other than the manager itself,
will result in an error, ensuring that only internal operations can use that originator.)

The manager can also save and load snapshots of its state. In this simplified version,
the snapshot only contains the primary key. If you load a snapshot, you still need to
re-provide the privileged key manager to complete authentication.

```ts
export class SimpleWalletManager implements WalletInterface {
    authenticated: boolean;
    constructor(adminOriginator: OriginatorDomainNameStringUnder250Bytes, walletBuilder: (primaryKey: number[], privilegedKeyManager: PrivilegedKeyManager) => Promise<WalletInterface>, stateSnapshot?: number[]) 
    async providePrimaryKey(key: number[]): Promise<void> 
    async providePrivilegedKeyManager(manager: PrivilegedKeyManager): Promise<void> 
    destroy(): void 
    saveSnapshot(): number[] 
    async loadSnapshot(snapshot: number[]): Promise<void> 
    async isAuthenticated(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async waitForAuthentication(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetPublicKeyResult> 
    async revealCounterpartyKeyLinkage(args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealCounterpartyKeyLinkageResult> 
    async revealSpecificKeyLinkage(args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealSpecificKeyLinkageResult> 
    async encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult> 
    async decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult> 
    async createHmac(args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateHmacResult> 
    async verifyHmac(args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifyHmacResult> 
    async createSignature(args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateSignatureResult> 
    async verifySignature(args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifySignatureResult> 
    async createAction(args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateActionResult> 
    async signAction(args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<SignActionResult> 
    async abortAction(args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AbortActionResult> 
    async listActions(args: ListActionsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListActionsResult> 
    async internalizeAction(args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<InternalizeActionResult> 
    async listOutputs(args: ListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
    async relinquishOutput(args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishOutputResult> 
    async acquireCertificate(args: AcquireCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AcquireCertificateResult> 
    async listCertificates(args: ListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
    async proveCertificate(args: ProveCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ProveCertificateResult> 
    async relinquishCertificate(args: RelinquishCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishCertificateResult> 
    async discoverByIdentityKey(args: DiscoverByIdentityKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<DiscoverCertificatesResult> 
    async discoverByAttributes(args: DiscoverByAttributesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<DiscoverCertificatesResult> 
    async getHeight(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> 
    async getHeaderForHeight(args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeaderResult> 
    async getNetwork(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> 
    async getVersion(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> 
}
```

See also: [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [proveCertificate](./client.md#function-provecertificate), [signAction](./client.md#function-signaction)

###### Constructor

Constructs a new `SimpleWalletManager`.

```ts
constructor(adminOriginator: OriginatorDomainNameStringUnder250Bytes, walletBuilder: (primaryKey: number[], privilegedKeyManager: PrivilegedKeyManager) => Promise<WalletInterface>, stateSnapshot?: number[]) 
```
See also: [PrivilegedKeyManager](./client.md#class-privilegedkeymanager)

Argument Details

+ **adminOriginator**
  + The domain name of the administrative originator.
+ **walletBuilder**
  + A function that, given a primary key and privileged key manager,
returns a fully functional `WalletInterface`.
+ **stateSnapshot**
  + If provided, a previously saved snapshot of the wallet's state.
If the snapshot contains a primary key, it will be loaded immediately
(though you will still need to provide a privileged key manager to authenticate).

###### Property authenticated

Whether the user is currently authenticated (meaning both the primary key
and privileged key manager have been provided).

```ts
authenticated: boolean
```

###### Method destroy

Destroys the underlying wallet, returning to a default (unauthenticated) state.

This clears the primary key, the privileged key manager, and the `authenticated` flag.

```ts
destroy(): void 
```

###### Method isAuthenticated

Returns whether the user is currently authenticated (the wallet has a primary key
and a privileged key manager). If not authenticated, an error is thrown.

```ts
async isAuthenticated(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
```

Argument Details

+ **_**
  + Not used in this manager.
+ **originator**
  + The originator domain, which must not be the admin originator.

Throws

If not authenticated, or if the originator is the admin.

###### Method loadSnapshot

Loads a previously saved state snapshot (produced by `saveSnapshot`).
This will restore the primary key but will **not** restore the privileged key manager
(that must be provided separately to complete authentication).

```ts
async loadSnapshot(snapshot: number[]): Promise<void> 
```

Argument Details

+ **snapshot**
  + A byte array that was previously returned by `saveSnapshot`.

Throws

If the snapshot format is invalid or decryption fails.

###### Method providePrimaryKey

Provides the primary key (32 bytes) needed for authentication.
If a privileged key manager has already been provided, we attempt to build
the underlying wallet. Otherwise, we wait until the manager is also provided.

```ts
async providePrimaryKey(key: number[]): Promise<void> 
```

Argument Details

+ **key**
  + A 32-byte primary key.

###### Method providePrivilegedKeyManager

Provides the privileged key manager needed for sensitive tasks.
If a primary key has already been provided (or loaded from a snapshot),
we attempt to build the underlying wallet. Otherwise, we wait until the key is provided.

```ts
async providePrivilegedKeyManager(manager: PrivilegedKeyManager): Promise<void> 
```
See also: [PrivilegedKeyManager](./client.md#class-privilegedkeymanager)

Argument Details

+ **manager**
  + An instance of `PrivilegedKeyManager`.

###### Method saveSnapshot

Saves the current wallet state (including just the primary key)
into an encrypted snapshot. This snapshot can be stored and later
passed to `loadSnapshot` to restore the primary key (and partially authenticate).

**Note**: The snapshot does NOT include the privileged key manager.
You must still provide that separately after loading the snapshot
in order to complete authentication.

```ts
saveSnapshot(): number[] 
```

Returns

A byte array representing the encrypted snapshot.

Throws

if no primary key is currently set.

###### Method waitForAuthentication

Blocks until the user is authenticated (by providing primaryKey and privileged manager).
If not authenticated yet, it waits until that occurs.

```ts
async waitForAuthentication(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
```

Argument Details

+ **_**
  + Not used in this manager.
+ **originator**
  + The originator domain, which must not be the admin originator.

Throws

If the originator is the admin.

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
##### Class: StorageClient

`StorageClient` implements the `WalletStorageProvider` interface which allows it to
serve as a BRC-100 wallet's active storage.

Internally, it uses JSON-RPC over HTTPS to make requests of a remote server.
Typically this server uses the `StorageServer` class to implement the service.

The `AuthFetch` component is used to secure and authenticate the requests to the remote server.

`AuthFetch` is initialized with a BRC-100 wallet which establishes the identity of
the party making requests of the remote service.

For details of the API implemented, follow the "See also" link for the `WalletStorageProvider` interface.

```ts
export class StorageClient implements WalletStorageProvider {
    readonly endpointUrl: string;
    public settings?: TableSettings;
    constructor(wallet: WalletInterface, endpointUrl: string) 
    isStorageProvider(): boolean 
    isAvailable(): boolean 
    getSettings(): TableSettings 
    async makeAvailable(): Promise<TableSettings> 
    async destroy(): Promise<void> 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    getServices(): WalletServices 
    setServices(v: WalletServices): void 
    async internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult> 
    async createAction(auth: AuthId, args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult> 
    async processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults> 
    async abortAction(auth: AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
    async findOrInsertUser(identityKey): Promise<{
        user: TableUser;
        isNew: boolean;
    }> 
    async findOrInsertSyncStateAuth(auth: AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: TableSyncState;
        isNew: boolean;
    }> 
    async insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number> 
    async listActions(auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> 
    async listOutputs(auth: AuthId, vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async listCertificates(auth: AuthId, vargs: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]> 
    async findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]> 
    async findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
    async relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number> 
    async processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult> 
    async getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk> 
    async updateProvenTxReqWithNewProvenTx(args: UpdateProvenTxReqWithNewProvenTxArgs): Promise<UpdateProvenTxReqWithNewProvenTxResult> 
    async setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number> 
    validateDate(date: Date | string | number): Date 
    validateEntity<T extends EntityTimeStamp>(entity: T, dateFields?: string[]): T 
    validateEntities<T extends EntityTimeStamp>(entities: T[], dateFields?: string[]): T[] 
}
```

See also: [AuthId](./client.md#interface-authid), [EntityTimeStamp](./client.md#interface-entitytimestamp), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [SyncChunk](./client.md#interface-syncchunk), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableUser](./storage.md#interface-tableuser), [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult), [WalletServices](./client.md#interface-walletservices), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [createAction](./storage.md#function-createaction), [getSyncChunk](./storage.md#function-getsyncchunk), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction)

###### Method abortAction

Aborts an action by `reference` string.

```ts
async abortAction(auth: AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
```
See also: [AuthId](./client.md#interface-authid)

Returns

`abortAction` result.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + original wallet `abortAction` args.

###### Method createAction

Storage level processing for wallet `createAction`.

```ts
async createAction(auth: AuthId, args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult> 
```
See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult)

Returns

`StorageCreateActionResults` supporting additional wallet processing to yield `createAction` results.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + Validated extension of original wallet `createAction` arguments.

###### Method destroy

Called to cleanup resources when no further use of this object will occur.

```ts
async destroy(): Promise<void> 
```

###### Method findCertificatesAuth

Find user certificates, optionally with fields.

This certificate retrieval method supports internal wallet operations.
Field values are stored and retrieved encrypted.

```ts
async findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]> 
```
See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [TableCertificateX](./storage.md#interface-tablecertificatex)

Returns

array of certificates matching args.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + `FindCertificatesArgs` determines which certificates to retrieve and whether to include fields.

###### Method findOrInsertSyncStateAuth

Used to both find and insert a `TableSyncState` record for the user to track wallet data replication across storage providers.

```ts
async findOrInsertSyncStateAuth(auth: AuthId, storageIdentityKey: string, storageName: string): Promise<{
    syncState: TableSyncState;
    isNew: boolean;
}> 
```
See also: [AuthId](./client.md#interface-authid), [TableSyncState](./storage.md#interface-tablesyncstate)

Returns

`TableSyncState` and whether a new record was created.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **storageName**
  + the name of the remote storage being sync'd
+ **storageIdentityKey**
  + the identity key of the remote storage being sync'd

###### Method findOrInsertUser

Used to both find and initialize a new user by identity key.
It is up to the remote storage whether to allow creation of new users by this method.

```ts
async findOrInsertUser(identityKey): Promise<{
    user: TableUser;
    isNew: boolean;
}> 
```
See also: [TableUser](./storage.md#interface-tableuser)

Returns

`TableUser` for the user and whether a new user was created.

Argument Details

+ **identityKey**
  + of the user.

###### Method findOutputBasketsAuth

Find output baskets.

This retrieval method supports internal wallet operations.

```ts
async findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
```
See also: [AuthId](./client.md#interface-authid), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [TableOutputBasket](./storage.md#interface-tableoutputbasket)

Returns

array of output baskets matching args.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + `FindOutputBasketsArgs` determines which baskets to retrieve.

###### Method findOutputsAuth

Find outputs.

This retrieval method supports internal wallet operations.

```ts
async findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]> 
```
See also: [AuthId](./client.md#interface-authid), [FindOutputsArgs](./client.md#interface-findoutputsargs), [TableOutput](./storage.md#interface-tableoutput)

Returns

array of outputs matching args.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + `FindOutputsArgs` determines which outputs to retrieve.

###### Method findProvenTxReqs

Find requests for transaction proofs.

This retrieval method supports internal wallet operations.

```ts
async findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
```
See also: [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [TableProvenTxReq](./storage.md#interface-tableproventxreq)

Returns

array of proof requests matching args.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + `FindProvenTxReqsArgs` determines which proof requests to retrieve.

###### Method getServices

Remote storage does not offer `Services` to remote clients.

```ts
getServices(): WalletServices 
```
See also: [WalletServices](./client.md#interface-walletservices)

Throws

WERR_INVALID_OPERATION

###### Method getSettings

```ts
getSettings(): TableSettings 
```
See also: [TableSettings](./storage.md#interface-tablesettings)

Returns

remote storage `TableSettings` if they have been retreived by `makeAvailable`.

Throws

WERR_INVALID_OPERATION if `makeAvailable` has not yet been called.

###### Method getSyncChunk

Request a "chunk" of replication data for a specific user and storage provider.

The normal data flow is for the active storage to push backups as a sequence of data chunks to backup storage providers.
Also supports recovery where non-active storage can attempt to merge available data prior to becoming active.

```ts
async getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk> 
```
See also: [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [SyncChunk](./client.md#interface-syncchunk)

Returns

the next "chunk" of replication data

Argument Details

+ **args**
  + that identify the non-active storage which will receive replication data and constrains the replication process.

###### Method insertCertificateAuth

Inserts a new certificate with fields and keyring into remote storage.

```ts
async insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number> 
```
See also: [AuthId](./client.md#interface-authid), [TableCertificateX](./storage.md#interface-tablecertificatex)

Returns

record Id of the inserted `TableCertificate` record.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **certificate**
  + the certificate to insert.

###### Method internalizeAction

Storage level processing for wallet `internalizeAction`.
Updates internalized outputs in remote storage.
Triggers proof validation of containing transaction.

```ts
async internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult> 
```
See also: [AuthId](./client.md#interface-authid), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult)

Returns

`internalizeAction` results

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + Original wallet `internalizeAction` arguments.

###### Method isAvailable

```ts
isAvailable(): boolean 
```

Returns

true once storage `TableSettings` have been retreived from remote storage.

###### Method isStorageProvider

The `StorageClient` implements the `WalletStorageProvider` interface.
It does not implement the lower level `StorageProvider` interface.

```ts
isStorageProvider(): boolean 
```

Returns

false

###### Method listActions

Storage level processing for wallet `listActions`.

```ts
async listActions(auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> 
```
See also: [AuthId](./client.md#interface-authid)

Returns

`listActions` results.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + Validated extension of original wallet `listActions` arguments.

###### Method listCertificates

Storage level processing for wallet `listCertificates`.

```ts
async listCertificates(auth: AuthId, vargs: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
```
See also: [AuthId](./client.md#interface-authid)

Returns

`listCertificates` results.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + Validated extension of original wallet `listCertificates` arguments.

###### Method listOutputs

Storage level processing for wallet `listOutputs`.

```ts
async listOutputs(auth: AuthId, vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult> 
```
See also: [AuthId](./client.md#interface-authid)

Returns

`listOutputs` results.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + Validated extension of original wallet `listOutputs` arguments.

###### Method makeAvailable

Must be called prior to making use of storage.
Retreives `TableSettings` from remote storage provider.

```ts
async makeAvailable(): Promise<TableSettings> 
```
See also: [TableSettings](./storage.md#interface-tablesettings)

Returns

remote storage `TableSettings`

###### Method migrate

Requests schema migration to latest.
Typically remote storage will ignore this request.

```ts
async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
```

Returns

current schema migration identifier

Argument Details

+ **storageName**
  + Unique human readable name for remote storage if it does not yet exist.
+ **storageIdentityKey**
  + Unique identity key for remote storage if it does not yet exist.

###### Method processAction

Storage level processing for wallet `createAction` and `signAction`.

Handles remaining storage tasks once a fully signed transaction has been completed. This is common to both `createAction` and `signAction`.

```ts
async processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults> 
```
See also: [AuthId](./client.md#interface-authid), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults)

Returns

`StorageProcessActionResults` supporting final wallet processing to yield `createAction` or `signAction` results.

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + `StorageProcessActionArgs` convey completed signed transaction to storage.

###### Method processSyncChunk

Process a "chunk" of replication data for the user.

The normal data flow is for the active storage to push backups as a sequence of data chunks to backup storage providers.

```ts
async processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult> 
```
See also: [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [SyncChunk](./client.md#interface-syncchunk)

Returns

whether processing is done, counts of inserts and udpates, and related progress tracking properties.

Argument Details

+ **args**
  + a copy of the replication request args that initiated the sequence of data chunks.
+ **chunk**
  + the current data chunk to process.

###### Method relinquishCertificate

Relinquish a certificate.

For storage supporting replication records must be kept of deletions. Therefore certificates are marked as deleted
when relinquished, and no longer returned by `listCertificates`, but are still retained by storage.

```ts
async relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number> 
```
See also: [AuthId](./client.md#interface-authid)

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + original wallet `relinquishCertificate` args.

###### Method relinquishOutput

Relinquish an output.

Relinquishing an output removes the output from whatever basket was tracking it.

```ts
async relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number> 
```
See also: [AuthId](./client.md#interface-authid)

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **args**
  + original wallet `relinquishOutput` args.

###### Method setActive

Ensures up-to-date wallet data replication to all configured backup storage providers,
then promotes one of the configured backups to active,
demoting the current active to new backup.

```ts
async setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number> 
```
See also: [AuthId](./client.md#interface-authid)

Argument Details

+ **auth**
  + Identifies client by identity key and the storage identity key of their currently active storage.
This must match the `AuthFetch` identity securing the remote conneciton.
+ **newActiveStorageIdentityKey**
  + which must be a currently configured backup storage provider.

###### Method setServices

Ignored. Remote storage cannot share `Services` with remote clients.

```ts
setServices(v: WalletServices): void 
```
See also: [WalletServices](./client.md#interface-walletservices)

###### Method updateProvenTxReqWithNewProvenTx

Handles the data received when a new transaction proof is found in response to an outstanding request for proof data:

  - Creates a new `TableProvenTx` record.
  - Notifies all user transaction records of the new status.
  - Updates the proof request record to 'completed' status which enables delayed deletion.

```ts
async updateProvenTxReqWithNewProvenTx(args: UpdateProvenTxReqWithNewProvenTxArgs): Promise<UpdateProvenTxReqWithNewProvenTxResult> 
```
See also: [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult)

Returns

results of updates

Argument Details

+ **args**
  + proof request and new transaction proof data

###### Method validateEntities

Helper to force uniform behavior across database engines.
Use to process all arrays of records with time stamps retreived from database.

```ts
validateEntities<T extends EntityTimeStamp>(entities: T[], dateFields?: string[]): T[] 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Returns

input `entities` array with contained values validated.

###### Method validateEntity

Helper to force uniform behavior across database engines.
Use to process all individual records with time stamps retreived from database.

```ts
validateEntity<T extends EntityTimeStamp>(entity: T, dateFields?: string[]): T 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: StorageIdb

This class implements the `StorageProvider` interface using IndexedDB,
via the promises wrapper package `idb`.

```ts
export class StorageIdb extends StorageProvider implements WalletStorageProvider {
    dbName: string;
    db?: IDBPDatabase<StorageIdbSchema>;
    constructor(options: StorageIdbOptions) 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    async verifyDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> 
    toDbTrx(stores: string[], mode: "readonly" | "readwrite", trx?: TrxToken): IDBPTransaction<StorageIdbSchema, string[], "readwrite" | "readonly"> 
    async readSettings(trx?: TrxToken): Promise<TableSettings> 
    async initDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> 
    async reviewStatus(args: {
        agedLimit: Date;
        trx?: TrxToken;
    }): Promise<{
        log: string;
    }> 
    async purgeData(params: PurgeParams, trx?: TrxToken): Promise<PurgeResults> 
    async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined> 
    async getProvenOrRawTx(txid: string, trx?: TrxToken): Promise<ProvenOrRawTx> 
    async getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: TrxToken): Promise<number[] | undefined> 
    async getLabelsForTransactionId(transactionId?: number, trx?: TrxToken): Promise<TableTxLabel[]> 
    async getTagsForOutputId(outputId: number, trx?: TrxToken): Promise<TableOutputTag[]> 
    async listActions(auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> 
    async listOutputs(auth: AuthId, vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> 
    async findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]> 
    async findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]> 
    async insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number> 
    async dropAllData(): Promise<void> 
    async filterOutputTagMaps(args: FindOutputTagMapsArgs, filtered: (v: TableOutputTagMap) => void, userId?: number): Promise<void> 
    async findOutputTagMaps(args: FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> 
    async filterProvenTxReqs(args: FindProvenTxReqsArgs, filtered: (v: TableProvenTxReq) => void, userId?: number): Promise<void> 
    async findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
    async filterProvenTxs(args: FindProvenTxsArgs, filtered: (v: TableProvenTx) => void, userId?: number): Promise<void> 
    async findProvenTxs(args: FindProvenTxsArgs): Promise<TableProvenTx[]> 
    async filterTxLabelMaps(args: FindTxLabelMapsArgs, filtered: (v: TableTxLabelMap) => void, userId?: number): Promise<void> 
    async findTxLabelMaps(args: FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> 
    async countOutputTagMaps(args: FindOutputTagMapsArgs): Promise<number> 
    async countProvenTxReqs(args: FindProvenTxReqsArgs): Promise<number> 
    async countProvenTxs(args: FindProvenTxsArgs): Promise<number> 
    async countTxLabelMaps(args: FindTxLabelMapsArgs): Promise<number> 
    async insertCertificate(certificate: TableCertificateX, trx?: TrxToken): Promise<number> 
    async insertCertificateField(certificateField: TableCertificateField, trx?: TrxToken): Promise<void> 
    async insertCommission(commission: TableCommission, trx?: TrxToken): Promise<number> 
    async insertMonitorEvent(event: TableMonitorEvent, trx?: TrxToken): Promise<number> 
    async insertOutput(output: TableOutput, trx?: TrxToken): Promise<number> 
    async insertOutputBasket(basket: TableOutputBasket, trx?: TrxToken): Promise<number> 
    async insertOutputTag(tag: TableOutputTag, trx?: TrxToken): Promise<number> 
    async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: TrxToken): Promise<void> 
    async insertProvenTx(tx: TableProvenTx, trx?: TrxToken): Promise<number> 
    async insertProvenTxReq(tx: TableProvenTxReq, trx?: TrxToken): Promise<number> 
    async insertSyncState(syncState: TableSyncState, trx?: TrxToken): Promise<number> 
    async insertTransaction(tx: TableTransaction, trx?: TrxToken): Promise<number> 
    async insertTxLabel(label: TableTxLabel, trx?: TrxToken): Promise<number> 
    async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: TrxToken): Promise<void> 
    async insertUser(user: TableUser, trx?: TrxToken): Promise<number> 
    async updateIdb<T>(id: number | number[], update: Partial<T>, keyProp: string, storeName: string, trx?: TrxToken): Promise<number> 
    async updateIdbKey<T>(key: (number | string)[], update: Partial<T>, keyProps: string[], storeName: string, trx?: TrxToken): Promise<number> 
    async updateCertificate(id: number, update: Partial<TableCertificate>, trx?: TrxToken): Promise<number> 
    async updateCertificateField(certificateId: number, fieldName: string, update: Partial<TableCertificateField>, trx?: TrxToken): Promise<number> 
    async updateCommission(id: number, update: Partial<TableCommission>, trx?: TrxToken): Promise<number> 
    async updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: TrxToken): Promise<number> 
    async updateOutput(id: number, update: Partial<TableOutput>, trx?: TrxToken): Promise<number> 
    async updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: TrxToken): Promise<number> 
    async updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: TrxToken): Promise<number> 
    async updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: TrxToken): Promise<number> 
    async updateProvenTxReq(id: number | number[], update: Partial<TableProvenTxReq>, trx?: TrxToken): Promise<number> 
    async updateSyncState(id: number, update: Partial<TableSyncState>, trx?: TrxToken): Promise<number> 
    async updateTransaction(id: number | number[], update: Partial<TableTransaction>, trx?: TrxToken): Promise<number> 
    async updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: TrxToken): Promise<number> 
    async updateUser(id: number, update: Partial<TableUser>, trx?: TrxToken): Promise<number> 
    async updateOutputTagMap(outputId: number, tagId: number, update: Partial<TableOutputTagMap>, trx?: TrxToken): Promise<number> 
    async updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<TableTxLabelMap>, trx?: TrxToken): Promise<number> 
    async destroy(): Promise<void> 
    allStores: string[] = [
        "certificates",
        "certificate_fields",
        "commissions",
        "monitor_events",
        "outputs",
        "output_baskets",
        "output_tags",
        "output_tags_map",
        "proven_txs",
        "proven_tx_reqs",
        "sync_states",
        "transactions",
        "tx_labels",
        "tx_labels_map",
        "users"
    ];
    async transaction<T>(scope: (trx: TrxToken) => Promise<T>, trx?: TrxToken): Promise<T> 
    async filterCertificateFields(args: FindCertificateFieldsArgs, filtered: (v: TableCertificateField) => void): Promise<void> 
    async findCertificateFields(args: FindCertificateFieldsArgs): Promise<TableCertificateField[]> 
    async filterCertificates(args: FindCertificatesArgs, filtered: (v: TableCertificateX) => void): Promise<void> 
    async findCertificates(args: FindCertificatesArgs): Promise<TableCertificateX[]> 
    async filterCommissions(args: FindCommissionsArgs, filtered: (v: TableCommission) => void): Promise<void> 
    async findCommissions(args: FindCommissionsArgs): Promise<TableCommission[]> 
    async filterMonitorEvents(args: FindMonitorEventsArgs, filtered: (v: TableMonitorEvent) => void): Promise<void> 
    async findMonitorEvents(args: FindMonitorEventsArgs): Promise<TableMonitorEvent[]> 
    async filterOutputBaskets(args: FindOutputBasketsArgs, filtered: (v: TableOutputBasket) => void): Promise<void> 
    async findOutputBaskets(args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async filterOutputs(args: FindOutputsArgs, filtered: (v: TableOutput) => void, tagIds?: number[], isQueryModeAll?: boolean): Promise<void> 
    async findOutputs(args: FindOutputsArgs, tagIds?: number[], isQueryModeAll?: boolean): Promise<TableOutput[]> 
    async filterOutputTags(args: FindOutputTagsArgs, filtered: (v: TableOutputTag) => void): Promise<void> 
    async findOutputTags(args: FindOutputTagsArgs): Promise<TableOutputTag[]> 
    async filterSyncStates(args: FindSyncStatesArgs, filtered: (v: TableSyncState) => void): Promise<void> 
    async findSyncStates(args: FindSyncStatesArgs): Promise<TableSyncState[]> 
    async filterTransactions(args: FindTransactionsArgs, filtered: (v: TableTransaction) => void, labelIds?: number[], isQueryModeAll?: boolean): Promise<void> 
    async findTransactions(args: FindTransactionsArgs, labelIds?: number[], isQueryModeAll?: boolean): Promise<TableTransaction[]> 
    async filterTxLabels(args: FindTxLabelsArgs, filtered: (v: TableTxLabel) => void): Promise<void> 
    async findTxLabels(args: FindTxLabelsArgs): Promise<TableTxLabel[]> 
    async filterUsers(args: FindUsersArgs, filtered: (v: TableUser) => void): Promise<void> 
    async findUsers(args: FindUsersArgs): Promise<TableUser[]> 
    async countCertificateFields(args: FindCertificateFieldsArgs): Promise<number> 
    async countCertificates(args: FindCertificatesArgs): Promise<number> 
    async countCommissions(args: FindCommissionsArgs): Promise<number> 
    async countMonitorEvents(args: FindMonitorEventsArgs): Promise<number> 
    async countOutputBaskets(args: FindOutputBasketsArgs): Promise<number> 
    async countOutputs(args: FindOutputsArgs, tagIds?: number[], isQueryModeAll?: boolean): Promise<number> 
    async countOutputTags(args: FindOutputTagsArgs): Promise<number> 
    async countSyncStates(args: FindSyncStatesArgs): Promise<number> 
    async countTransactions(args: FindTransactionsArgs, labelIds?: number[], isQueryModeAll?: boolean): Promise<number> 
    async countTxLabels(args: FindTxLabelsArgs): Promise<number> 
    async countUsers(args: FindUsersArgs): Promise<number> 
    async getProvenTxsForUser(args: FindForUserSincePagedArgs): Promise<TableProvenTx[]> 
    async getProvenTxReqsForUser(args: FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> 
    async getTxLabelMapsForUser(args: FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> 
    async getOutputTagMapsForUser(args: FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> 
    async verifyReadyForDatabaseAccess(trx?: TrxToken): Promise<DBType> 
    validateEntity<T extends EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T 
    validateEntities<T extends EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] 
    validatePartialForUpdate<T extends EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
    async validateEntityForInsert<T extends EntityTimeStamp>(entity: T, trx?: TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
    async validateRawTransaction(t: TableTransaction, trx?: TrxToken): Promise<void> 
    async adminStats(adminIdentityKey: string): Promise<StorageAdminStats> 
}
```

See also: [AuthId](./client.md#interface-authid), [DBType](./storage.md#type-dbtype), [EntityTimeStamp](./client.md#interface-entitytimestamp), [FindCertificateFieldsArgs](./client.md#interface-findcertificatefieldsargs), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindCommissionsArgs](./client.md#interface-findcommissionsargs), [FindForUserSincePagedArgs](./client.md#interface-findforusersincepagedargs), [FindMonitorEventsArgs](./client.md#interface-findmonitoreventsargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputTagMapsArgs](./client.md#interface-findoutputtagmapsargs), [FindOutputTagsArgs](./client.md#interface-findoutputtagsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [FindProvenTxsArgs](./client.md#interface-findproventxsargs), [FindSyncStatesArgs](./client.md#interface-findsyncstatesargs), [FindTransactionsArgs](./client.md#interface-findtransactionsargs), [FindTxLabelMapsArgs](./client.md#interface-findtxlabelmapsargs), [FindTxLabelsArgs](./client.md#interface-findtxlabelsargs), [FindUsersArgs](./client.md#interface-findusersargs), [ProvenOrRawTx](./client.md#interface-provenorrawtx), [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [StorageAdminStats](./storage.md#interface-storageadminstats), [StorageIdbOptions](./storage.md#interface-storageidboptions), [StorageIdbSchema](./storage.md#interface-storageidbschema), [StorageProvider](./storage.md#class-storageprovider), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableCommission](./storage.md#interface-tablecommission), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser), [TrxToken](./client.md#interface-trxtoken), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [listActions](./storage.md#function-listactions), [listOutputs](./storage.md#function-listoutputs), [purgeData](./storage.md#function-purgedata), [reviewStatus](./storage.md#function-reviewstatus)

###### Method allocateChangeInput

Proceeds in three stages:
1. Find an output that exactly funds the transaction (if exactSatoshis is not undefined).
2. Find an output that overfunds by the least amount (targetSatoshis).
3. Find an output that comes as close to funding as possible (targetSatoshis).
4. Return undefined if no output is found.

Outputs must belong to userId and basketId and have spendable true.
Their corresponding transaction must have status of 'completed', 'unproven', or 'sending' (if excludeSending is false).

```ts
async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined> 
```
See also: [TableOutput](./storage.md#interface-tableoutput)

Returns

next funding output to add to transaction or undefined if there are none.

###### Method migrate

This method must be called at least once before any other method accesses the database,
and each time the schema may have updated.

If the database has already been created in this context, `storageName` and `storageIdentityKey`
are ignored.

```ts
async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
```

###### Method readSettings

Called by `makeAvailable` to return storage `TableSettings`.
Since this is the first async method that must be called by all clients,
it is where async initialization occurs.

After initialization, cached settings are returned.

```ts
async readSettings(trx?: TrxToken): Promise<TableSettings> 
```
See also: [TableSettings](./storage.md#interface-tablesettings), [TrxToken](./client.md#interface-trxtoken)

###### Method toDbTrx

Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
or a Knex.Transaction as appropriate.

```ts
toDbTrx(stores: string[], mode: "readonly" | "readwrite", trx?: TrxToken): IDBPTransaction<StorageIdbSchema, string[], "readwrite" | "readonly"> 
```
See also: [StorageIdbSchema](./storage.md#interface-storageidbschema), [TrxToken](./client.md#interface-trxtoken)

###### Method validateEntities

Helper to force uniform behavior across database engines.
Use to process all arrays of records with time stamps retreived from database.

```ts
validateEntities<T extends EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Returns

input `entities` array with contained values validated.

###### Method validateEntity

Helper to force uniform behavior across database engines.
Use to process all individual records with time stamps or number[] retreived from database.

```ts
validateEntity<T extends EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

###### Method validateEntityForInsert

Helper to force uniform behavior across database engines.
Use to process new entities being inserted into the database.

```ts
async validateEntityForInsert<T extends EntityTimeStamp>(entity: T, trx?: TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [TrxToken](./client.md#interface-trxtoken)

###### Method validatePartialForUpdate

Helper to force uniform behavior across database engines.
Use to process the update template for entities being updated.

```ts
validatePartialForUpdate<T extends EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

###### Method verifyDB

Following initial database initialization, this method verfies that db is ready for use.

```ts
async verifyDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> 
```
See also: [StorageIdbSchema](./storage.md#interface-storageidbschema)

Throws

`WERR_INVALID_OPERATION` if the database has not been initialized by a call to `migrate`.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: StorageProvider

```ts
export abstract class StorageProvider extends StorageReaderWriter implements WalletStorageProvider {
    isDirty = false;
    _services?: WalletServices;
    feeModel: StorageFeeModel;
    commissionSatoshis: number;
    commissionPubKeyHex?: PubKeyHex;
    maxRecursionDepth?: number;
    static defaultOptions() 
    static createStorageBaseOptions(chain: Chain): StorageProviderOptions 
    constructor(options: StorageProviderOptions) 
    abstract reviewStatus(args: {
        agedLimit: Date;
        trx?: TrxToken;
    }): Promise<{
        log: string;
    }>;
    abstract purgeData(params: PurgeParams, trx?: TrxToken): Promise<PurgeResults>;
    abstract allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined>;
    abstract getProvenOrRawTx(txid: string, trx?: TrxToken): Promise<ProvenOrRawTx>;
    abstract getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: TrxToken): Promise<number[] | undefined>;
    abstract getLabelsForTransactionId(transactionId?: number, trx?: TrxToken): Promise<TableTxLabel[]>;
    abstract getTagsForOutputId(outputId: number, trx?: TrxToken): Promise<TableOutputTag[]>;
    abstract listActions(auth: AuthId, args: Validation.ValidListActionsArgs): Promise<ListActionsResult>;
    abstract listOutputs(auth: AuthId, args: Validation.ValidListOutputsArgs): Promise<ListOutputsResult>;
    abstract countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number>;
    abstract findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]>;
    abstract findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]>;
    abstract findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]>;
    abstract insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number>;
    abstract adminStats(adminIdentityKey: string): Promise<AdminStatsResult>;
    override isStorageProvider(): boolean 
    setServices(v: WalletServices) 
    getServices(): WalletServices 
    async abortAction(auth: AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
    async internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult> 
    async getReqsAndBeefToShareWithWorld(txids: string[], knownTxids: string[], trx?: TrxToken): Promise<GetReqsAndBeefResult> 
    async mergeReqToBeefToShareExternally(req: TableProvenTxReq, mergeToBeef: Beef, knownTxids: string[], trx?: TrxToken): Promise<void> 
    async getProvenOrReq(txid: string, newReq?: TableProvenTxReq, trx?: TrxToken): Promise<StorageProvenOrReq> 
    async updateTransactionsStatus(transactionIds: number[], status: TransactionStatus, trx?: TrxToken): Promise<void> 
    async updateTransactionStatus(status: TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: TrxToken): Promise<void> 
    async createAction(auth: AuthId, args: Validation.ValidCreateActionArgs): Promise<StorageCreateActionResult> 
    async processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults> 
    async attemptToPostReqsToNetwork(reqs: EntityProvenTxReq[], trx?: TrxToken, logger?: WalletLoggerInterface): Promise<PostReqsToNetworkResult> 
    async listCertificates(auth: AuthId, args: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async verifyKnownValidTransaction(txid: string, trx?: TrxToken): Promise<boolean> 
    async getValidBeefForKnownTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: TrxToken, requiredLevels?: number): Promise<Beef> 
    async getValidBeefForTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: TrxToken, requiredLevels?: number, chainTracker?: ChainTracker, skipInvalidProofs?: boolean): Promise<Beef | undefined> 
    async getBeefForTransaction(txid: string, options: StorageGetBeefOptions): Promise<Beef> 
    async findMonitorEventById(id: number, trx?: TrxToken): Promise<TableMonitorEvent | undefined> 
    async relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number> 
    async processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult> 
    async updateProvenTxReqWithNewProvenTx(args: UpdateProvenTxReqWithNewProvenTxArgs): Promise<UpdateProvenTxReqWithNewProvenTxResult> 
    async confirmSpendableOutputs(): Promise<{
        invalidSpendableOutputs: TableOutput[];
    }> 
    async updateProvenTxReqDynamics(id: number, update: Partial<TableProvenTxReqDynamics>, trx?: TrxToken): Promise<number> 
    async extendOutput(o: TableOutput, includeBasket = false, includeTags = false, trx?: TrxToken): Promise<TableOutputX> 
    async validateOutputScript(o: TableOutput, trx?: TrxToken): Promise<void> 
}
```

See also: [AdminStatsResult](./storage.md#interface-adminstatsresult), [AuthId](./client.md#interface-authid), [Chain](./client.md#type-chain), [EntityProvenTxReq](./storage.md#class-entityproventxreq), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [GetReqsAndBeefResult](./storage.md#interface-getreqsandbeefresult), [PostReqsToNetworkResult](./storage.md#interface-postreqstonetworkresult), [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [ProvenOrRawTx](./client.md#interface-provenorrawtx), [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageFeeModel](./client.md#interface-storagefeemodel), [StorageGetBeefOptions](./client.md#interface-storagegetbeefoptions), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvenOrReq](./client.md#interface-storageprovenorreq), [StorageProviderOptions](./storage.md#interface-storageprovideroptions), [StorageReaderWriter](./storage.md#class-storagereaderwriter), [SyncChunk](./client.md#interface-syncchunk), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputX](./storage.md#interface-tableoutputx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableProvenTxReqDynamics](./storage.md#interface-tableproventxreqdynamics), [TableTxLabel](./storage.md#interface-tabletxlabel), [TransactionStatus](./client.md#type-transactionstatus), [TrxToken](./client.md#interface-trxtoken), [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult), [WalletServices](./client.md#interface-walletservices), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [attemptToPostReqsToNetwork](./storage.md#function-attempttopostreqstonetwork), [createAction](./storage.md#function-createaction), [getBeefForTransaction](./storage.md#function-getbeeffortransaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [logger](./client.md#variable-logger), [processAction](./storage.md#function-processaction), [purgeData](./storage.md#function-purgedata), [reviewStatus](./storage.md#function-reviewstatus)

###### Method confirmSpendableOutputs

For each spendable output in the 'default' basket of the authenticated user,
verify that the output script, satoshis, vout and txid match that of an output
still in the mempool of at least one service provider.

```ts
async confirmSpendableOutputs(): Promise<{
    invalidSpendableOutputs: TableOutput[];
}> 
```
See also: [TableOutput](./storage.md#interface-tableoutput)

Returns

object with invalidSpendableOutputs array. A good result is an empty array.

###### Method getProvenOrReq

Checks if txid is a known valid ProvenTx and returns it if found.
Next checks if txid is a current ProvenTxReq and returns that if found.
If `newReq` is provided and an existing ProvenTxReq isn't found,
use `newReq` to create a new ProvenTxReq.

This is safe "findOrInsert" operation using retry if unique index constraint
is violated by a race condition insert.

```ts
async getProvenOrReq(txid: string, newReq?: TableProvenTxReq, trx?: TrxToken): Promise<StorageProvenOrReq> 
```
See also: [StorageProvenOrReq](./client.md#interface-storageprovenorreq), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TrxToken](./client.md#interface-trxtoken)

###### Method getReqsAndBeefToShareWithWorld

Given an array of transaction txids with current ProvenTxReq ready-to-share status,
lookup their ProvenTxReqApi req records.
For the txids with reqs and status still ready to send construct a single merged beef.

```ts
async getReqsAndBeefToShareWithWorld(txids: string[], knownTxids: string[], trx?: TrxToken): Promise<GetReqsAndBeefResult> 
```
See also: [GetReqsAndBeefResult](./storage.md#interface-getreqsandbeefresult), [TrxToken](./client.md#interface-trxtoken)

###### Method getValidBeefForKnownTxid

Pulls data from storage to build a valid beef for a txid.

Optionally merges the data into an existing beef.
Optionally requires a minimum number of proof levels.

```ts
async getValidBeefForKnownTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: TrxToken, requiredLevels?: number): Promise<Beef> 
```
See also: [TrxToken](./client.md#interface-trxtoken)

###### Method updateProvenTxReqWithNewProvenTx

Handles storage changes when a valid MerklePath and mined block header are found for a ProvenTxReq txid.

Performs the following storage updates (typically):
1. Lookup the exising `ProvenTxReq` record for its rawTx
2. Insert a new ProvenTx record using properties from `args` and rawTx, yielding a new provenTxId
3. Update ProvenTxReq record with status 'completed' and new provenTxId value (and history of status changed)
4. Unpack notify transactionIds from req and update each transaction's status to 'completed', provenTxId value.
5. Update ProvenTxReq history again to record that transactions have been notified.
6. Return results...

Alterations of "typically" to handle:

```ts
async updateProvenTxReqWithNewProvenTx(args: UpdateProvenTxReqWithNewProvenTxArgs): Promise<UpdateProvenTxReqWithNewProvenTxResult> 
```
See also: [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult)

###### Method updateTransactionStatus

For all `status` values besides 'failed', just updates the transaction records status property.

For 'status' of 'failed', attempts to make outputs previously allocated as inputs to this transaction usable again.

```ts
async updateTransactionStatus(status: TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: TrxToken): Promise<void> 
```
See also: [TransactionStatus](./client.md#type-transactionstatus), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: StorageReader

The `StorageReader` abstract class is the base of the concrete wallet storage provider classes.

It is the minimal interface required to read all wallet state records and is the base class for sync readers.

The next class in the heirarchy is the `StorageReaderWriter` which supports sync readers and writers.

The last class in the heirarchy is the `Storage` class which supports all active wallet operations.

The ability to construct a properly configured instance of this class implies authentication.
As such there are no user specific authenticated access checks implied in the implementation of any of these methods.

```ts
export abstract class StorageReader implements sdk.WalletStorageSyncReader {
    chain: sdk.Chain;
    _settings?: TableSettings;
    whenLastAccess?: Date;
    get dbtype(): DBType | undefined 
    constructor(options: StorageReaderOptions) 
    isAvailable(): boolean 
    async makeAvailable(): Promise<TableSettings> 
    getSettings(): TableSettings 
    isStorageProvider(): boolean 
    abstract destroy(): Promise<void>;
    abstract transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T>;
    abstract readSettings(trx?: sdk.TrxToken): Promise<TableSettings>;
    abstract findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]>;
    abstract findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]>;
    abstract findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]>;
    abstract findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]>;
    abstract findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]>;
    abstract findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]>;
    abstract findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]>;
    abstract findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]>;
    abstract findTransactions(args: sdk.FindTransactionsArgs): Promise<TableTransaction[]>;
    abstract findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]>;
    abstract findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]>;
    abstract countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number>;
    abstract countCertificates(args: sdk.FindCertificatesArgs): Promise<number>;
    abstract countCommissions(args: sdk.FindCommissionsArgs): Promise<number>;
    abstract countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number>;
    abstract countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number>;
    abstract countOutputs(args: sdk.FindOutputsArgs): Promise<number>;
    abstract countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number>;
    abstract countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number>;
    abstract countTransactions(args: sdk.FindTransactionsArgs): Promise<number>;
    abstract countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number>;
    abstract countUsers(args: sdk.FindUsersArgs): Promise<number>;
    abstract getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]>;
    abstract getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]>;
    abstract getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]>;
    abstract getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]>;
    async findUserByIdentityKey(key: string): Promise<TableUser | undefined> 
    async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
    validateEntityDate(date: Date | string | number): Date | string 
    validateOptionalEntityDate(date: Date | string | number | null | undefined, useNowAsDefault?: boolean): Date | string | undefined 
    validateDate(date: Date | string | number): Date 
    validateOptionalDate(date: Date | string | number | null | undefined): Date | undefined 
    validateDateForWhere(date: Date | string | number): Date | string | number 
}
```

See also: [Chain](./client.md#type-chain), [DBType](./storage.md#type-dbtype), [FindCertificateFieldsArgs](./client.md#interface-findcertificatefieldsargs), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindCommissionsArgs](./client.md#interface-findcommissionsargs), [FindForUserSincePagedArgs](./client.md#interface-findforusersincepagedargs), [FindMonitorEventsArgs](./client.md#interface-findmonitoreventsargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputTagsArgs](./client.md#interface-findoutputtagsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindSyncStatesArgs](./client.md#interface-findsyncstatesargs), [FindTransactionsArgs](./client.md#interface-findtransactionsargs), [FindTxLabelsArgs](./client.md#interface-findtxlabelsargs), [FindUsersArgs](./client.md#interface-findusersargs), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageReaderOptions](./storage.md#interface-storagereaderoptions), [SyncChunk](./client.md#interface-syncchunk), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableCommission](./storage.md#interface-tablecommission), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser), [TrxToken](./client.md#interface-trxtoken), [WalletStorageSyncReader](./client.md#interface-walletstoragesyncreader), [getSyncChunk](./storage.md#function-getsyncchunk)

###### Method validateEntityDate

Force dates to strings on SQLite and Date objects on MySQL

```ts
validateEntityDate(date: Date | string | number): Date | string 
```

###### Method validateOptionalEntityDate

```ts
validateOptionalEntityDate(date: Date | string | number | null | undefined, useNowAsDefault?: boolean): Date | string | undefined 
```

Argument Details

+ **useNowAsDefault**
  + if true and date is null or undefiend, set to current time.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: StorageReaderWriter

```ts
export abstract class StorageReaderWriter extends StorageReader {
    constructor(options: StorageReaderWriterOptions) 
    abstract dropAllData(): Promise<void>;
    abstract migrate(storageName: string, storageIdentityKey: string): Promise<string>;
    abstract findOutputTagMaps(args: FindOutputTagMapsArgs): Promise<TableOutputTagMap[]>;
    abstract findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>;
    abstract findProvenTxs(args: FindProvenTxsArgs): Promise<TableProvenTx[]>;
    abstract findTxLabelMaps(args: FindTxLabelMapsArgs): Promise<TableTxLabelMap[]>;
    abstract countOutputTagMaps(args: FindOutputTagMapsArgs): Promise<number>;
    abstract countProvenTxReqs(args: FindProvenTxReqsArgs): Promise<number>;
    abstract countProvenTxs(args: FindProvenTxsArgs): Promise<number>;
    abstract countTxLabelMaps(args: FindTxLabelMapsArgs): Promise<number>;
    abstract insertCertificate(certificate: TableCertificate, trx?: TrxToken): Promise<number>;
    abstract insertCertificateField(certificateField: TableCertificateField, trx?: TrxToken): Promise<void>;
    abstract insertCommission(commission: TableCommission, trx?: TrxToken): Promise<number>;
    abstract insertMonitorEvent(event: TableMonitorEvent, trx?: TrxToken): Promise<number>;
    abstract insertOutput(output: TableOutput, trx?: TrxToken): Promise<number>;
    abstract insertOutputBasket(basket: TableOutputBasket, trx?: TrxToken): Promise<number>;
    abstract insertOutputTag(tag: TableOutputTag, trx?: TrxToken): Promise<number>;
    abstract insertOutputTagMap(tagMap: TableOutputTagMap, trx?: TrxToken): Promise<void>;
    abstract insertProvenTx(tx: TableProvenTx, trx?: TrxToken): Promise<number>;
    abstract insertProvenTxReq(tx: TableProvenTxReq, trx?: TrxToken): Promise<number>;
    abstract insertSyncState(syncState: TableSyncState, trx?: TrxToken): Promise<number>;
    abstract insertTransaction(tx: TableTransaction, trx?: TrxToken): Promise<number>;
    abstract insertTxLabel(label: TableTxLabel, trx?: TrxToken): Promise<number>;
    abstract insertTxLabelMap(labelMap: TableTxLabelMap, trx?: TrxToken): Promise<void>;
    abstract insertUser(user: TableUser, trx?: TrxToken): Promise<number>;
    abstract updateCertificate(id: number, update: Partial<TableCertificate>, trx?: TrxToken): Promise<number>;
    abstract updateCertificateField(certificateId: number, fieldName: string, update: Partial<TableCertificateField>, trx?: TrxToken): Promise<number>;
    abstract updateCommission(id: number, update: Partial<TableCommission>, trx?: TrxToken): Promise<number>;
    abstract updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: TrxToken): Promise<number>;
    abstract updateOutput(id: number, update: Partial<TableOutput>, trx?: TrxToken): Promise<number>;
    abstract updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: TrxToken): Promise<number>;
    abstract updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: TrxToken): Promise<number>;
    abstract updateOutputTagMap(outputId: number, tagId: number, update: Partial<TableOutputTagMap>, trx?: TrxToken): Promise<number>;
    abstract updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: TrxToken): Promise<number>;
    abstract updateProvenTxReq(id: number | number[], update: Partial<TableProvenTxReq>, trx?: TrxToken): Promise<number>;
    abstract updateSyncState(id: number, update: Partial<TableSyncState>, trx?: TrxToken): Promise<number>;
    abstract updateTransaction(id: number | number[], update: Partial<TableTransaction>, trx?: TrxToken): Promise<number>;
    abstract updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: TrxToken): Promise<number>;
    abstract updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<TableTxLabelMap>, trx?: TrxToken): Promise<number>;
    abstract updateUser(id: number, update: Partial<TableUser>, trx?: TrxToken): Promise<number>;
    async setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number> 
    async findCertificateById(id: number, trx?: TrxToken): Promise<TableCertificate | undefined> 
    async findCommissionById(id: number, trx?: TrxToken): Promise<TableCommission | undefined> 
    async findOutputById(id: number, trx?: TrxToken, noScript?: boolean): Promise<TableOutput | undefined> 
    async findOutputBasketById(id: number, trx?: TrxToken): Promise<TableOutputBasket | undefined> 
    async findProvenTxById(id: number, trx?: TrxToken | undefined): Promise<TableProvenTx | undefined> 
    async findProvenTxReqById(id: number, trx?: TrxToken | undefined): Promise<TableProvenTxReq | undefined> 
    async findSyncStateById(id: number, trx?: TrxToken): Promise<TableSyncState | undefined> 
    async findTransactionById(id: number, trx?: TrxToken, noRawTx?: boolean): Promise<TableTransaction | undefined> 
    async findTxLabelById(id: number, trx?: TrxToken): Promise<TableTxLabel | undefined> 
    async findOutputTagById(id: number, trx?: TrxToken): Promise<TableOutputTag | undefined> 
    async findUserById(id: number, trx?: TrxToken): Promise<TableUser | undefined> 
    async findOrInsertUser(identityKey: string, trx?: TrxToken): Promise<{
        user: TableUser;
        isNew: boolean;
    }> 
    async findOrInsertTransaction(newTx: TableTransaction, trx?: TrxToken): Promise<{
        tx: TableTransaction;
        isNew: boolean;
    }> 
    async findOrInsertOutputBasket(userId: number, name: string, trx?: TrxToken): Promise<TableOutputBasket> 
    async findOrInsertTxLabel(userId: number, label: string, trx?: TrxToken): Promise<TableTxLabel> 
    async findOrInsertTxLabelMap(transactionId: number, txLabelId: number, trx?: TrxToken): Promise<TableTxLabelMap> 
    async findOrInsertOutputTag(userId: number, tag: string, trx?: TrxToken): Promise<TableOutputTag> 
    async findOrInsertOutputTagMap(outputId: number, outputTagId: number, trx?: TrxToken): Promise<TableOutputTagMap> 
    async findOrInsertSyncStateAuth(auth: AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: TableSyncState;
        isNew: boolean;
    }> 
    async findOrInsertProvenTxReq(newReq: TableProvenTxReq, trx?: TrxToken): Promise<{
        req: TableProvenTxReq;
        isNew: boolean;
    }> 
    async findOrInsertProvenTx(newProven: TableProvenTx, trx?: TrxToken): Promise<{
        proven: TableProvenTx;
        isNew: boolean;
    }> 
    abstract processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult>;
    async tagOutput(partial: Partial<TableOutput>, tag: string, trx?: TrxToken): Promise<void> 
}
```

See also: [AuthId](./client.md#interface-authid), [FindOutputTagMapsArgs](./client.md#interface-findoutputtagmapsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [FindProvenTxsArgs](./client.md#interface-findproventxsargs), [FindTxLabelMapsArgs](./client.md#interface-findtxlabelmapsargs), [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageReader](./storage.md#class-storagereader), [StorageReaderWriterOptions](./storage.md#interface-storagereaderwriteroptions), [SyncChunk](./client.md#interface-syncchunk), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCommission](./storage.md#interface-tablecommission), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSyncState](./storage.md#interface-tablesyncstate), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: StorageSyncReader

The `StorageSyncReader` non-abstract class must be used when authentication checking access to the methods of a `StorageBaseReader` is required.

Constructed from an `auth` object that must minimally include the authenticated user's identityKey,
and the `StorageBaseReader` to be protected.

```ts
export class StorageSyncReader implements sdk.WalletStorageSyncReader {
    constructor(public auth: sdk.AuthId, public storage: StorageReader) 
    async makeAvailable(): Promise<TableSettings> 
    destroy(): Promise<void> 
    async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
}
```

See also: [AuthId](./client.md#interface-authid), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageReader](./storage.md#class-storagereader), [SyncChunk](./client.md#interface-syncchunk), [TableSettings](./storage.md#interface-tablesettings), [WalletStorageSyncReader](./client.md#interface-walletstoragesyncreader), [getSyncChunk](./storage.md#function-getsyncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskCheckForProofs

`TaskCheckForProofs` is a WalletMonitor task that retreives merkle proofs for
transactions.

It is normally triggered by the Chaintracks new block header event.

When a new block is found, cwi-external-services are used to obtain proofs for
any transactions that are currently in the 'unmined' or 'unknown' state.

If a proof is obtained and validated, a new ProvenTx record is created and
the original ProvenTxReq status is advanced to 'notifying'.

```ts
export class TaskCheckForProofs extends WalletMonitorTask {
    static taskName = "CheckForProofs";
    static checkNow = false;
    constructor(monitor: Monitor, public triggerMsecs = 0) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property checkNow

An external service such as the chaintracks new block header
listener can set this true to cause

```ts
static checkNow = false
```

###### Method trigger

Normally triggered by checkNow getting set by new block header found event from chaintracks

```ts
trigger(nowMsecsSinceEpoch: number): {
    run: boolean;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskCheckNoSends

`TaskCheckNoSends` is a WalletMonitor task that retreives merkle proofs for
'nosend' transactions that MAY have been shared externally.

Unlike intentionally processed transactions, 'nosend' transactions are fully valid
transactions which have not been processed by the wallet.

By default, this task runs once a day to check if any 'nosend' transaction has
managed to get mined by some external process.

If a proof is obtained and validated, a new ProvenTx record is created and
the original ProvenTxReq status is advanced to 'notifying'.

```ts
export class TaskCheckNoSends extends WalletMonitorTask {
    static taskName = "CheckNoSends";
    static checkNow = false;
    constructor(monitor: Monitor, public triggerMsecs = Monitor.oneDay * 1) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property checkNow

An external service such as the chaintracks new block header
listener can set this true to cause

```ts
static checkNow = false
```

###### Method trigger

Normally triggered by checkNow getting set by new block header found event from chaintracks

```ts
trigger(nowMsecsSinceEpoch: number): {
    run: boolean;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskClock

```ts
export class TaskClock extends WalletMonitorTask {
    static taskName = "Clock";
    nextMinute: number;
    constructor(monitor: Monitor, public triggerMsecs = 1 * Monitor.oneSecond) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
    getNextMinute(): number 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskFailAbandoned

Handles transactions which do not have terminal status and have not been
updated for an extended time period.

Calls `updateTransactionStatus` to set `status` to `failed`.
This returns inputs to spendable status and verifies that any
outputs are not spendable.

```ts
export class TaskFailAbandoned extends WalletMonitorTask {
    static taskName = "FailAbandoned";
    constructor(monitor: Monitor, public triggerMsecs = 1000 * 60 * 5) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskMonitorCallHistory

```ts
export class TaskMonitorCallHistory extends WalletMonitorTask {
    static taskName = "MonitorCallHistory";
    constructor(monitor: Monitor, public triggerMsecs = Monitor.oneMinute * 12) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskNewHeader

This task polls for new block headers performing two essential functions:
1. The arrival of a new block is the right time to check for proofs for recently broadcast transactions.
2. The height of the block is used to limit which proofs are accepted with the aim of avoiding re-orged proofs.

The most common new block orphan is one which is almost immediately orphaned.
Waiting a minute before pursuing proof requests avoids almost all the re-org work that could be done.
Thus this task queues new headers for one cycle.
If a new header arrives during that cycle, it replaces the queued header and delays again.
Only when there is an elapsed cycle without a new header does proof solicitation get triggered,
with that header height as the limit for which proofs are accepted.

```ts
export class TaskNewHeader extends WalletMonitorTask {
    static taskName = "NewHeader";
    header?: BlockHeader;
    queuedHeader?: BlockHeader;
    queuedHeaderWhen?: Date;
    constructor(monitor: Monitor, public triggerMsecs = 1 * Monitor.oneMinute) 
    async getHeader(): Promise<BlockHeader> 
    override async asyncSetup(): Promise<void> 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [BlockHeader](./client.md#interface-blockheader), [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property header

This is always the most recent chain tip header returned from the chaintracker.

```ts
header?: BlockHeader
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Property queuedHeader

Tracks the value of `header` except that it is set to undefined
when a cycle without a new header occurs and `processNewBlockHeader` is called.

```ts
queuedHeader?: BlockHeader
```
See also: [BlockHeader](./client.md#interface-blockheader)

###### Method asyncSetup

TODO: This is a temporary incomplete solution for which a full chaintracker
with new header and reorg event notification is required.

New header events drive retrieving merklePaths for newly mined transactions.
This implementation performs this function.

Reorg events are needed to know when previously retrieved mekrlePaths need to be
updated in the proven_txs table (and ideally notifications delivered to users).
Note that in-general, a reorg only shifts where in the block a transaction is mined,
and sometimes which block. In the case of coinbase transactions, a transaction may
also fail after a reorg.

```ts
override async asyncSetup(): Promise<void> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskPurge

```ts
export class TaskPurge extends WalletMonitorTask {
    static taskName = "Purge";
    static checkNow = false;
    constructor(monitor: Monitor, public params: TaskPurgeParams, public triggerMsecs = 0) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [TaskPurgeParams](./monitor.md#interface-taskpurgeparams), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property checkNow

Set to true to trigger running this task

```ts
static checkNow = false
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskReorg

Check the `monitor.deactivatedHeaders` for any headers that have been deactivated.

When headers are found, review matching ProvenTx records and update proof data as appropriate.

New deactivated headers are pushed onto the `deactivatedHeaders` array.
They must be shifted out as they are processed.

The current implementation ages deactivation notifications by 10 minutes with each retry.
If a successful proof update confirms original proof data after 3 retries, the original is retained.

In normal operation there should rarely be any work for this task to perform.
The most common result is that there are no matching proven_txs records because
generating new proven_txs records intentionally lags new block generation to
minimize this disruption.

It is very disruptive to update a proven_txs record because:
- Sync'ed storage is impacted.
- Generated beefs are impacted.
- Updated proof data may be unavailable at the time a reorg is first reported.

Proper reorg handling also requires repairing invalid beefs for new transactions when
createAction fails to verify a generated beef against the chaintracker.

```ts
export class TaskReorg extends WalletMonitorTask {
    static taskName = "Reorg";
    process: DeactivedHeader[] = [];
    constructor(monitor: Monitor, public agedMsecs = Monitor.oneMinute * 10, public maxRetries = 3) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [DeactivedHeader](./monitor.md#interface-deactivedheader), [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Method trigger

Shift aged deactivated headers onto `process` array.

```ts
trigger(nowMsecsSinceEpoch: number): {
    run: boolean;
} 
```

Returns

`run` true iff there are aged deactivated headers to process.

Argument Details

+ **nowMsecsSinceEpoch**
  + current time in milliseconds since epoch.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskReviewStatus

Notify Transaction records of changes in ProvenTxReq records they may have missed.

The `notified` property flags reqs that do not need to be checked.

Looks for aged Transactions with provenTxId with status != 'completed', sets status to 'completed'.

Looks for reqs with 'invalid' status that have corresonding transactions with status other than 'failed'.

```ts
export class TaskReviewStatus extends WalletMonitorTask {
    static taskName = "ReviewStatus";
    static checkNow = false;
    constructor(monitor: Monitor, public triggerMsecs = 1000 * 60 * 15, public agedMsecs = 1000 * 60 * 5) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property checkNow

Set to true to trigger running this task

```ts
static checkNow = false
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskSendWaiting

```ts
export class TaskSendWaiting extends WalletMonitorTask {
    static taskName = "SendWaiting";
    lastSendingRunMsecsSinceEpoch: number | undefined;
    includeSending: boolean = true;
    constructor(monitor: Monitor, public triggerMsecs = Monitor.oneSecond * 8, public agedMsecs = Monitor.oneSecond * 7, public sendingMsecs = Monitor.oneMinute * 5) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
    async processUnsent(reqApis: TableProvenTxReq[], indent = 0): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Method processUnsent

Process an array of 'unsent' status table.ProvenTxReq

Send rawTx to transaction processor(s), requesting proof callbacks when possible.

Set status 'invalid' if req is invalid.

Set status to 'callback' on successful network submission with callback service.

Set status to 'unmined' on successful network submission without callback service.

Add mapi responses to database table if received.

Increments attempts if sending was attempted.

```ts
async processUnsent(reqApis: TableProvenTxReq[], indent = 0): Promise<string> 
```
See also: [TableProvenTxReq](./storage.md#interface-tableproventxreq)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskSyncWhenIdle

```ts
export class TaskSyncWhenIdle extends WalletMonitorTask {
    static taskName = "SyncWhenIdle";
    constructor(monitor: Monitor, public triggerMsecs = 1000 * 60 * 1) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TaskUnFail

Setting provenTxReq status to 'unfail' when 'invalid' will attempt to find a merklePath, and if successful:

1. set the req status to 'unmined'
2. set the referenced txs to 'unproven'
3. determine if any inputs match user's existing outputs and if so update spentBy and spendable of those outputs.
4. set the txs outputs to spendable

If it fails (to find a merklePath), returns the req status to 'invalid'.

```ts
export class TaskUnFail extends WalletMonitorTask {
    static taskName = "UnFail";
    static checkNow = false;
    constructor(monitor: Monitor, public triggerMsecs = Monitor.oneMinute * 10) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
    async unfail(reqs: TableProvenTxReq[], indent = 0): Promise<{
        log: string;
    }> 
    async unfailReq(req: EntityProvenTxReq, indent: number): Promise<string> 
}
```

See also: [EntityProvenTxReq](./storage.md#class-entityproventxreq), [Monitor](./monitor.md#class-monitor), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property checkNow

Set to true to trigger running this task

```ts
static checkNow = false
```

###### Method unfailReq

2. set the referenced txs to 'unproven'
3. determine if any inputs match user's existing outputs and if so update spentBy and spendable of those outputs.
4. set the txs outputs to spendable

```ts
async unfailReq(req: EntityProvenTxReq, indent: number): Promise<string> 
```
See also: [EntityProvenTxReq](./storage.md#class-entityproventxreq)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: TwilioPhoneInteractor

TwilioPhoneInteractor

A client-side class that knows how to call the WAB server for Twilio-based phone verification.

```ts
export class TwilioPhoneInteractor extends AuthMethodInteractor {
    public methodType = "TwilioPhone";
    public async startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse> 
    public async completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse> 
}
```

See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor), [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse), [StartAuthResponse](./client.md#interface-startauthresponse)

###### Method completeAuth

Complete the Twilio phone verification on the server.
- The server will verify the code with Twilio Verify’s verificationChecks endpoint.

```ts
public async completeAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<CompleteAuthResponse> 
```
See also: [AuthPayload](./client.md#interface-authpayload), [CompleteAuthResponse](./client.md#interface-completeauthresponse)

Returns

- { success, message, presentationKey }

Argument Details

+ **serverUrl**
  + The base URL of the WAB server
+ **presentationKey**
  + The 256-bit key
+ **payload**
  + { phoneNumber: string, otp: string } (the code that was received via SMS)

###### Method startAuth

Start the Twilio phone verification on the server.
- The server will send an SMS code to the user’s phone, using Twilio Verify.

```ts
public async startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse> 
```
See also: [AuthPayload](./client.md#interface-authpayload), [StartAuthResponse](./client.md#interface-startauthresponse)

Returns

- { success, message, data }

Argument Details

+ **serverUrl**
  + The base URL of the WAB server (e.g. http://localhost:3000)
+ **presentationKey**
  + The 256-bit key the client is attempting to authenticate with
+ **payload**
  + { phoneNumber: string } (the phone number to verify)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WABClient

```ts
export class WABClient {
    constructor(private serverUrl: string) 
    public async getInfo() 
    public generateRandomPresentationKey(): string 
    public async startAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) 
    public async completeAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) 
    public async listLinkedMethods(presentationKey: string) 
    public async unlinkMethod(presentationKey: string, authMethodId: number) 
    public async requestFaucet(presentationKey: string) 
    public async deleteUser(presentationKey: string) 
    public async startShareAuth(methodType: string, userIdHash: string, payload: any): Promise<{
        success: boolean;
        message: string;
    }> 
    public async storeShare(methodType: string, payload: any, shareB: string, userIdHash: string): Promise<{
        success: boolean;
        message: string;
        userId?: number;
    }> 
    public async retrieveShare(methodType: string, payload: any, userIdHash: string): Promise<{
        success: boolean;
        shareB?: string;
        message: string;
    }> 
    public async updateShare(methodType: string, payload: any, userIdHash: string, newShareB: string): Promise<{
        success: boolean;
        message: string;
        shareVersion?: number;
    }> 
    public async deleteShamirUser(methodType: string, payload: any, userIdHash: string): Promise<{
        success: boolean;
        message: string;
    }> 
}
```

See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

###### Method completeAuthMethod

Complete an Auth Method flow

```ts
public async completeAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) 
```
See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

###### Method deleteShamirUser

Delete a Shamir user's account and stored share
Requires OTP verification

```ts
public async deleteShamirUser(methodType: string, payload: any, userIdHash: string): Promise<{
    success: boolean;
    message: string;
}> 
```

Argument Details

+ **methodType**
  + The auth method type used for verification
+ **payload**
  + Contains the OTP code and auth method specific data
+ **userIdHash**
  + SHA256 hash of the user's identity key

###### Method deleteUser

Delete user

```ts
public async deleteUser(presentationKey: string) 
```

###### Method generateRandomPresentationKey

Generate a random 256-bit presentation key as a hex string (client side).

```ts
public generateRandomPresentationKey(): string 
```

###### Method getInfo

Return the WAB server info

```ts
public async getInfo() 
```

###### Method listLinkedMethods

List user-linked methods

```ts
public async listLinkedMethods(presentationKey: string) 
```

###### Method requestFaucet

Request faucet

```ts
public async requestFaucet(presentationKey: string) 
```

###### Method retrieveShare

Retrieve a Shamir share (Share B) from the server
Requires OTP verification

```ts
public async retrieveShare(methodType: string, payload: any, userIdHash: string): Promise<{
    success: boolean;
    shareB?: string;
    message: string;
}> 
```

Argument Details

+ **methodType**
  + The auth method type used for verification
+ **payload**
  + Contains the OTP code and auth method specific data
+ **userIdHash**
  + SHA256 hash of the user's identity key

###### Method startAuthMethod

Start an Auth Method flow

```ts
public async startAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) 
```
See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

###### Method startShareAuth

Start OTP verification for share operations
This initiates the auth flow (e.g., sends SMS code via Twilio)

```ts
public async startShareAuth(methodType: string, userIdHash: string, payload: any): Promise<{
    success: boolean;
    message: string;
}> 
```

Argument Details

+ **methodType**
  + The auth method type (e.g., "TwilioPhone", "DevConsole")
+ **userIdHash**
  + SHA256 hash of the user's identity key
+ **payload**
  + Auth method specific data (e.g., { phoneNumber: "+1..." })

###### Method storeShare

Store a Shamir share (Share B) on the server
Requires prior OTP verification via startShareAuth

```ts
public async storeShare(methodType: string, payload: any, shareB: string, userIdHash: string): Promise<{
    success: boolean;
    message: string;
    userId?: number;
}> 
```

Argument Details

+ **methodType**
  + The auth method type used for verification
+ **payload**
  + Contains the OTP code and auth method specific data
+ **shareB**
  + The Shamir share to store (format: x.y.threshold.integrity)
+ **userIdHash**
  + SHA256 hash of the user's identity key

###### Method unlinkMethod

Unlink a given Auth Method by ID

```ts
public async unlinkMethod(presentationKey: string, authMethodId: number) 
```

###### Method updateShare

Update a Shamir share (for key rotation)
Requires OTP verification

```ts
public async updateShare(methodType: string, payload: any, userIdHash: string, newShareB: string): Promise<{
    success: boolean;
    message: string;
    shareVersion?: number;
}> 
```

Argument Details

+ **methodType**
  + The auth method type used for verification
+ **payload**
  + Contains the OTP code and auth method specific data
+ **userIdHash**
  + SHA256 hash of the user's identity key
+ **newShareB**
  + The new Shamir share to store

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_BAD_REQUEST

The request is invalid.

```ts
export class WERR_BAD_REQUEST extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_BROADCAST_UNAVAILABLE

Unable to broadcast transaction at this time.

```ts
export class WERR_BROADCAST_UNAVAILABLE extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INSUFFICIENT_FUNDS

Insufficient funds in the available inputs to cover the cost of the required outputs
and the transaction fee (${moreSatoshisNeeded} more satoshis are needed,
for a total of ${totalSatoshisNeeded}), plus whatever would be required in order
to pay the fee to unlock and spend the outputs used to provide the additional satoshis.

```ts
export class WERR_INSUFFICIENT_FUNDS extends WalletError {
    constructor(public totalSatoshisNeeded: number, public moreSatoshisNeeded: number) 
    override toJson(): string 
}
```

See also: [WalletError](./client.md#class-walleterror)

###### Constructor

```ts
constructor(public totalSatoshisNeeded: number, public moreSatoshisNeeded: number) 
```

Argument Details

+ **totalSatoshisNeeded**
  + Total satoshis required to fund transactions after net of required inputs and outputs.
+ **moreSatoshisNeeded**
  + Shortfall on total satoshis required to fund transactions after net of required inputs and outputs.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INTERNAL

An internal error has occurred.

This is an example of an error with an optional custom `message`.

```ts
export class WERR_INTERNAL extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INVALID_MERKLE_ROOT

Invalid merkleRoot ${merkleRoot} for block ${blockHash} at height ${blockHeight}${txid ? ` for txid ${txid}` : ''}.

Typically thrown when a chain tracker fails to validate a merkle root.

```ts
export class WERR_INVALID_MERKLE_ROOT extends WalletError {
    constructor(public blockHash: string, public blockHeight: number, public merkleRoot: string, public txid?: string) 
    override toJson(): string 
}
```

See also: [WalletError](./client.md#class-walleterror), [blockHash](./services.md#function-blockhash)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INVALID_OPERATION

The ${parameter} parameter is invalid.

This is an example of an error object with a custom property `parameter` and templated `message`.

```ts
export class WERR_INVALID_OPERATION extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INVALID_PARAMETER

The ${parameter} parameter is invalid.

This is an example of an error object with a custom property `parameter` and templated `message`.

```ts
export class WERR_INVALID_PARAMETER extends WalletError {
    constructor(public parameter: string, mustBe?: string) 
    override toJson(): string 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INVALID_PUBLIC_KEY

```ts
export class WERR_INVALID_PUBLIC_KEY extends WalletError {
    constructor(public key: string, network: WalletNetwork = "mainnet") 
    protected override toJson(): string 
}
```

See also: [WalletError](./client.md#class-walleterror)

###### Constructor

```ts
constructor(public key: string, network: WalletNetwork = "mainnet") 
```

Argument Details

+ **key**
  + The invalid public key that caused the error.
+ **environment**
  + Optional environment flag to control whether the key is included in the message.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_MISSING_PARAMETER

The required ${parameter} parameter is missing.

This is an example of an error object with a custom property `parameter`

```ts
export class WERR_MISSING_PARAMETER extends WalletError {
    constructor(public parameter: string) 
    override toJson(): string 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_NETWORK_CHAIN

Configured network chain is invalid or does not match across services.

```ts
export class WERR_NETWORK_CHAIN extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_NOT_ACTIVE

WalletStorageManager is not accessing user's active storage or there are conflicting active stores configured.

```ts
export class WERR_NOT_ACTIVE extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_NOT_IMPLEMENTED

Not implemented.

```ts
export class WERR_NOT_IMPLEMENTED extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_REVIEW_ACTIONS

When a `createAction` or `signAction` is completed in undelayed mode (`acceptDelayedBroadcast`: false),
any unsucccessful result will return the results by way of this exception to ensure attention is
paid to processing errors.

```ts
export class WERR_REVIEW_ACTIONS extends WalletError {
    constructor(public reviewActionResults: ReviewActionResult[], public sendWithResults: SendWithResult[], public txid?: TXIDHexString, public tx?: AtomicBEEF, public noSendChange?: OutpointString[]) 
    override toJson(): string 
}
```

See also: [ReviewActionResult](./client.md#interface-reviewactionresult), [WalletError](./client.md#class-walleterror)

###### Constructor

All parameters correspond to their comparable `createAction` or `signSction` results
with the exception of `reviewActionResults`;
which contains more details, particularly for double spend results.

```ts
constructor(public reviewActionResults: ReviewActionResult[], public sendWithResults: SendWithResult[], public txid?: TXIDHexString, public tx?: AtomicBEEF, public noSendChange?: OutpointString[]) 
```
See also: [ReviewActionResult](./client.md#interface-reviewactionresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_UNAUTHORIZED

Access is denied due to an authorization error.

```ts
export class WERR_UNAUTHORIZED extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: Wallet

```ts
export class Wallet implements WalletInterface, ProtoWallet {
    chain: Chain;
    keyDeriver: KeyDeriverApi;
    storage: WalletStorageManager;
    settingsManager: WalletSettingsManager;
    lookupResolver: LookupResolver;
    services?: WalletServices;
    monitor?: Monitor;
    identityKey: string;
    beef: BeefParty;
    includeAllSourceTransactions: boolean = true;
    autoKnownTxids: boolean = false;
    returnTxidOnly: boolean = false;
    trustSelf?: TrustSelf;
    userParty: string;
    proto: ProtoWallet;
    privilegedKeyManager?: PrivilegedKeyManager;
    makeLogger?: MakeWalletLogger;
    pendingSignActions: Record<string, PendingSignAction>;
    randomVals?: number[] = undefined;
    constructor(argsOrSigner: WalletArgs | WalletSigner, services?: WalletServices, monitor?: Monitor, privilegedKeyManager?: PrivilegedKeyManager, makeLogger?: MakeWalletLogger) 
    async destroy(): Promise<void> 
    getClientChangeKeyPair(): KeyPair 
    async getIdentityKey(): Promise<PubKeyHex> 
    getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetPublicKeyResult> 
    revealCounterpartyKeyLinkage(args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealCounterpartyKeyLinkageResult> 
    revealSpecificKeyLinkage(args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealSpecificKeyLinkageResult> 
    encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult> 
    decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult> 
    createHmac(args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateHmacResult> 
    verifyHmac(args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifyHmacResult> 
    createSignature(args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateSignatureResult> 
    verifySignature(args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifySignatureResult> 
    getServices(): WalletServices 
    getKnownTxids(newKnownTxids?: string[]): string[] 
    getStorageIdentity(): StorageIdentity 
    async listActions(args: ListActionsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListActionsResult> 
    get storageParty(): string 
    async listOutputs(args: ListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
    async listCertificates(args: ListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
    async acquireCertificate(args: AcquireCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AcquireCertificateResult> 
    async relinquishCertificate(args: RelinquishCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishCertificateResult> 
    async proveCertificate(args: ProveCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ProveCertificateResult> 
    async discoverByIdentityKey(args: DiscoverByIdentityKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<DiscoverCertificatesResult> 
    async discoverByAttributes(args: DiscoverByAttributesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<DiscoverCertificatesResult> 
    verifyReturnedTxidOnly(beef: Beef, knownTxids?: string[]): Beef 
    verifyReturnedTxidOnlyAtomicBEEF(beef: AtomicBEEF, knownTxids?: string[]): AtomicBEEF 
    verifyReturnedTxidOnlyBEEF(beef: BEEF): BEEF 
    logMakeLogger(method: string, args: any): WalletLoggerInterface | undefined 
    logMethodStart(method: string, logger?: WalletLoggerInterface): void 
    logResult(r: any, logger?: WalletLoggerInterface): void 
    logWalletError(eu: unknown, logger?: WalletLoggerInterface): void 
    async createAction(args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateActionResult> 
    async signAction(args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<SignActionResult> 
    async internalizeAction(args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<InternalizeActionResult> 
    async abortAction(args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AbortActionResult> 
    async relinquishOutput(args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishOutputResult> 
    async isAuthenticated(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async waitForAuthentication(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async getHeight(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> 
    async getHeaderForHeight(args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeaderResult> 
    async getNetwork(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> 
    async getVersion(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> 
    async sweepTo(toWallet: Wallet): Promise<void> 
    async balanceAndUtxos(basket: string = "default"): Promise<WalletBalance> 
    async balance(): Promise<number> 
    async reviewSpendableOutputs(all = false, release = false, optionalArgs?: Partial<ListOutputsArgs>): Promise<ListOutputsResult> 
    async setWalletChangeParams(count: number, satoshis: number): Promise<void> 
    async listNoSendActions(args: ListActionsArgs, abort = false): Promise<ListActionsResult> 
    async listFailedActions(args: ListActionsArgs, unfail = false): Promise<ListActionsResult> 
}
```

See also: [Chain](./client.md#type-chain), [KeyPair](./client.md#interface-keypair), [Monitor](./monitor.md#class-monitor), [PendingSignAction](./client.md#interface-pendingsignaction), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [StorageIdentity](./client.md#interface-storageidentity), [WalletArgs](./client.md#interface-walletargs), [WalletBalance](./client.md#interface-walletbalance), [WalletServices](./client.md#interface-walletservices), [WalletSettingsManager](./client.md#class-walletsettingsmanager), [WalletSigner](./client.md#class-walletsigner), [WalletStorageManager](./storage.md#class-walletstoragemanager), [createAction](./storage.md#function-createaction), [getIdentityKey](./client.md#function-getidentitykey), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [logWalletError](./client.md#function-logwalleterror), [logger](./client.md#variable-logger), [proveCertificate](./client.md#function-provecertificate), [signAction](./client.md#function-signaction)

###### Property autoKnownTxids

If true, txids that are known to the wallet's party beef do not need to be returned from storage.

```ts
autoKnownTxids: boolean = false
```

###### Property beef

The wallet creates a `BeefParty` when it is created.
All the Beefs that pass through the wallet are merged into this beef.
Thus what it contains at any time is the union of all transactions and proof data processed.
The class `BeefParty` derives from `Beef`, adding the ability to track the source of merged data.

This allows it to generate beefs to send to a particular “party” (storage or the user)
that includes “txid only proofs” for transactions they already know about.
Over time, this allows an active wallet to drastically reduce the amount of data transmitted.

```ts
beef: BeefParty
```

###### Property includeAllSourceTransactions

If true, signableTransactions will include sourceTransaction for each input,
including those that do not require signature and those that were also contained
in the inputBEEF.

```ts
includeAllSourceTransactions: boolean = true
```

###### Property randomVals

For repeatability testing, set to an array of random numbers from [0..1).

```ts
randomVals?: number[] = undefined
```

###### Property returnTxidOnly

If true, beefs returned to the user may contain txidOnly transactions.

```ts
returnTxidOnly: boolean = false
```

###### Method balance

Uses `listOutputs` special operation to compute the total value (of satoshis) for
all spendable outputs in the 'default' basket.

```ts
async balance(): Promise<number> 
```

Returns

sum of output satoshis

###### Method balanceAndUtxos

Uses `listOutputs` to iterate over chunks of up to 1000 outputs to
compute the sum of output satoshis.

```ts
async balanceAndUtxos(basket: string = "default"): Promise<WalletBalance> 
```
See also: [WalletBalance](./client.md#interface-walletbalance)

Returns

total sum of output satoshis and utxo details (satoshis and outpoints)

Argument Details

+ **basket**
  + Optional. Defaults to 'default', the wallet change basket.

###### Method getKnownTxids

```ts
getKnownTxids(newKnownTxids?: string[]): string[] 
```

Returns

the full list of txids whose validity this wallet claims to know.

Argument Details

+ **newKnownTxids**
  + Optional. Additional new txids known to be valid by the caller to be merged.

###### Method listFailedActions

Uses `listActions` special operation to return only actions with status 'failed'.

```ts
async listFailedActions(args: ListActionsArgs, unfail = false): Promise<ListActionsResult> 
```

Returns

start `listActions` result restricted to 'failed' status actions.

Argument Details

+ **unfail**
  + Defaults to false. If true, queues the action for attempted recovery.

###### Method listNoSendActions

Uses `listActions` special operation to return only actions with status 'nosend'.

```ts
async listNoSendActions(args: ListActionsArgs, abort = false): Promise<ListActionsResult> 
```

Returns

start `listActions` result restricted to 'nosend' (or 'failed' if aborted) actions.

Argument Details

+ **abort**
  + Defaults to false. If true, runs `abortAction` on each 'nosend' action.

###### Method reviewSpendableOutputs

Uses `listOutputs` special operation to review the spendability via `Services` of
outputs currently considered spendable. Returns the outputs that fail to verify.

Ignores the `limit` and `offset` properties.

```ts
async reviewSpendableOutputs(all = false, release = false, optionalArgs?: Partial<ListOutputsArgs>): Promise<ListOutputsResult> 
```

Returns

outputs which are/where considered spendable but currently fail to verify as spendable.

Argument Details

+ **all**
  + Defaults to false. If false, only change outputs ('default' basket) are reviewed. If true, all spendable outputs are reviewed.
+ **release**
  + Defaults to false. If true, sets outputs that fail to verify to un-spendable (spendable: false)
+ **optionalArgs**
  + Optional. Additional tags will constrain the outputs processed.

###### Method setWalletChangeParams

Uses `listOutputs` special operation to update the 'default' basket's automatic
change generation parameters.

```ts
async setWalletChangeParams(count: number, satoshis: number): Promise<void> 
```

Argument Details

+ **count**
  + target number of change UTXOs to maintain.
+ **satoshis**
  + target value for new change outputs.

###### Method sweepTo

Transfer all possible satoshis held by this wallet to `toWallet`.

```ts
async sweepTo(toWallet: Wallet): Promise<void> 
```
See also: [Wallet](./client.md#class-wallet)

Argument Details

+ **toWallet**
  + wallet which will receive this wallet's satoshis.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletAuthenticationManager

WalletAuthenticationManager

A wallet manager that integrates
with a WABClient for user authentication flows (e.g. Twilio phone).

```ts
export class WalletAuthenticationManager extends CWIStyleWalletManager {
    constructor(adminOriginator: string, walletBuilder: (primaryKey: number[], privilegedKeyManager: PrivilegedKeyManager) => Promise<WalletInterface>, interactor: UMPTokenInteractor = new OverlayUMPTokenInteractor(), recoveryKeySaver: (key: number[]) => Promise<true>, passwordRetriever: (reason: string, test: (passwordCandidate: string) => boolean) => Promise<string>, wabClient: WABClient, authMethod?: AuthMethodInteractor, stateSnapshot?: number[]) 
    public setAuthMethod(method: AuthMethodInteractor) 
    public async startAuth(payload: any): Promise<void> 
    public async completeAuth(payload: any): Promise<void> 
}
```

See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor), [CWIStyleWalletManager](./client.md#class-cwistylewalletmanager), [OverlayUMPTokenInteractor](./client.md#class-overlayumptokeninteractor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [UMPTokenInteractor](./client.md#interface-umptokeninteractor), [WABClient](./client.md#class-wabclient)

###### Method completeAuth

Completes the WAB-based flow, retrieving the final presentationKey from WAB if successful.

```ts
public async completeAuth(payload: any): Promise<void> 
```

###### Method setAuthMethod

Sets (or switches) the chosen AuthMethodInteractor at runtime,
in case the user changes their mind or picks a new method in the UI.

```ts
public setAuthMethod(method: AuthMethodInteractor) 
```
See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

###### Method startAuth

Initiate the WAB-based flow, e.g. sending an SMS code or starting an ID check,
using the chosen AuthMethodInteractor.

```ts
public async startAuth(payload: any): Promise<void> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletError

Derived class constructors should use the derived class name as the value for `name`,
and an internationalizable constant string for `message`.

If a derived class intends to wrap another WalletError, the public property should
be named `walletError` and will be recovered by `fromUnknown`.

Optionaly, the derived class `message` can include template parameters passed in
to the constructor. See WERR_MISSING_PARAMETER for an example.

To avoid derived class name colisions, packages should include a package specific
identifier after the 'WERR_' prefix. e.g. 'WERR_FOO_' as the prefix for Foo package error
classes.

```ts
export class WalletError extends Error implements WalletErrorObject {
    isError: true = true;
    constructor(name: string, message: string, stack?: string, public details?: Record<string, string>) 
    get code(): ErrorCodeString10To40Bytes 
    set code(v: ErrorCodeString10To40Bytes) 
    get description(): ErrorDescriptionString20To200Bytes 
    set description(v: ErrorDescriptionString20To200Bytes) 
    static fromUnknown(err: unknown): WalletError 
    asStatus(): {
        status: string;
        code: string;
        description: string;
    } 
    protected toJson(): string 
    static unknownToJson(error: unknown | WalletError): string 
}
```

###### Method asStatus

```ts
asStatus(): {
    status: string;
    code: string;
    description: string;
} 
```

Returns

standard HTTP error status object with status property set to 'error'.

###### Method fromUnknown

Recovers all public fields from WalletError derived error classes and relevant Error derived errors.

```ts
static fromUnknown(err: unknown): WalletError 
```
See also: [WalletError](./client.md#class-walleterror)

###### Method toJson

Base class default JSON serialization.
Captures just the name and message properties.

Override this method to safely (avoid deep, large, circular issues) serialize
derived class properties.

```ts
protected toJson(): string 
```

Returns

stringified JSON representation of the WalletError.

###### Method unknownToJson

Safely serializes a WalletError derived, WERR_REVIEW_ACTIONS (special case), Error or unknown error to JSON.

Safely means avoiding deep, large, circular issues.

```ts
static unknownToJson(error: unknown | WalletError): string 
```
See also: [WalletError](./client.md#class-walleterror)

Returns

stringified JSON representation of the error such that it can be desirialized to a WalletError.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletLogger

```ts
export class WalletLogger implements WalletLoggerInterface {
    indent: number = 0;
    logs: WalletLoggerLog[] = [];
    isOrigin: boolean = true;
    isError: boolean = false;
    level?: WalletLoggerLevel;
    flushFormat?: "json";
    constructor(log?: string | WalletLoggerInterface) 
    group(...label: any[]): void 
    groupEnd(): void 
    log(message?: any, ...optionalParams: any[]): void 
    error(message?: any, ...optionalParams: any[]): void 
    toWalletLoggerJson(): object 
    toLogString(): string 
    flush(): object | undefined 
    merge(log: WalletLoggerInterface): void 
}
```

See also: [WalletLoggerLevel](./client.md#type-walletloggerlevel)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletMonitorTask

A monitor task performs some periodic or state triggered maintenance function
on the data managed by a wallet (Bitcoin UTXO manager, aka wallet)

The monitor maintains a collection of tasks.

It runs each task's non-asynchronous trigger to determine if the runTask method needs to run.

Tasks that need to be run are run consecutively by awaiting their async runTask override method.

The monitor then waits a fixed interval before repeating...

Tasks may use the monitor_events table to persist their execution history.
This is done by accessing the wathman.storage object.

```ts
export abstract class WalletMonitorTask {
    lastRunMsecsSinceEpoch = 0;
    storage: MonitorStorage;
    constructor(public monitor: Monitor, public name: string) 
    async asyncSetup(): Promise<void> 
    abstract trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    };
    abstract runTask(): Promise<string>;
}
```

See also: [Monitor](./monitor.md#class-monitor), [MonitorStorage](./monitor.md#type-monitorstorage)

###### Property lastRunMsecsSinceEpoch

Set by monitor each time runTask completes

```ts
lastRunMsecsSinceEpoch = 0
```

###### Method asyncSetup

Override to handle async task setup configuration.

Called before first call to `trigger`

```ts
async asyncSetup(): Promise<void> 
```

###### Method trigger

Return true if `runTask` needs to be called now.

```ts
abstract trigger(nowMsecsSinceEpoch: number): {
    run: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletPermissionsManager

```ts
export class WalletPermissionsManager implements WalletInterface {
    constructor(underlyingWallet: WalletInterface, adminOriginator: string, config: PermissionsManagerConfig = {}) 
    public bindCallback(eventName: keyof WalletPermissionsManagerCallbacks, handler: PermissionEventHandler | GroupedPermissionEventHandler | CounterpartyPermissionEventHandler): number 
    public unbindCallback(eventName: keyof WalletPermissionsManagerCallbacks, reference: number | Function): boolean 
    public async grantPermission(params: {
        requestID: string;
        expiry?: number;
        ephemeral?: boolean;
        amount?: number;
    }): Promise<void> 
    public async denyPermission(requestID: string): Promise<void> 
    public async grantGroupedPermission(params: {
        requestID: string;
        granted: Partial<GroupedPermissions>;
        expiry?: number;
    }): Promise<void> 
    public async denyGroupedPermission(requestID: string): Promise<void> 
    public async dismissGroupedPermission(requestID: string): Promise<void> 
    public async grantCounterpartyPermission(params: {
        requestID: string;
        granted: Partial<CounterpartyPermissions>;
        expiry?: number;
    }): Promise<void> 
    public async denyCounterpartyPermission(requestID: string): Promise<void> 
    public async ensureProtocolPermission({ originator, privileged, protocolID, counterparty, reason, seekPermission = true, usageType }: {
        originator: string;
        privileged: boolean;
        protocolID: WalletProtocol;
        counterparty: string;
        reason?: string;
        seekPermission?: boolean;
        usageType: "signing" | "encrypting" | "hmac" | "publicKey" | "identityKey" | "linkageRevelation" | "generic";
    }): Promise<boolean> 
    public async ensureBasketAccess({ originator, basket, reason, seekPermission = true, usageType }: {
        originator: string;
        basket: string;
        reason?: string;
        seekPermission?: boolean;
        usageType: "insertion" | "removal" | "listing";
    }): Promise<boolean> 
    public async ensureCertificateAccess({ originator, privileged, verifier, certType, fields, reason, seekPermission = true, usageType }: {
        originator: string;
        privileged: boolean;
        verifier: string;
        certType: string;
        fields: string[];
        reason?: string;
        seekPermission?: boolean;
        usageType: "disclosure";
    }): Promise<boolean> 
    public async ensureSpendingAuthorization({ originator, satoshis, lineItems, reason, seekPermission = true }: {
        originator: string;
        satoshis: number;
        lineItems?: Array<{
            type: "input" | "output" | "fee";
            description: string;
            satoshis: number;
        }>;
        reason?: string;
        seekPermission?: boolean;
    }): Promise<boolean> 
    public async ensureLabelAccess({ originator, label, reason, seekPermission = true, usageType }: {
        originator: string;
        label: string;
        reason?: string;
        seekPermission?: boolean;
        usageType: "apply" | "list";
    }): Promise<boolean> 
    public async querySpentSince(token: PermissionToken): Promise<number> 
    public async listProtocolPermissions({ originator, privileged, protocolName, protocolSecurityLevel, counterparty }: {
        originator?: string;
        privileged?: boolean;
        protocolName?: string;
        protocolSecurityLevel?: number;
        counterparty?: string;
    } = {}): Promise<PermissionToken[]> 
    public async hasProtocolPermission(params: {
        originator: string;
        privileged: boolean;
        protocolID: WalletProtocol;
        counterparty: string;
    }): Promise<boolean> 
    public async listBasketAccess(params: {
        originator?: string;
        basket?: string;
    } = {}): Promise<PermissionToken[]> 
    public async hasBasketAccess(params: {
        originator: string;
        basket: string;
    }): Promise<boolean> 
    public async listSpendingAuthorizations(params: {
        originator?: string;
    }): Promise<PermissionToken[]> 
    public async hasSpendingAuthorization(params: {
        originator: string;
        satoshis: number;
    }): Promise<boolean> 
    public async listCertificateAccess(params: {
        originator?: string;
        privileged?: boolean;
        certType?: Base64String;
        verifier?: PubKeyHex;
    } = {}): Promise<PermissionToken[]> 
    public async hasCertificateAccess(params: {
        originator: string;
        privileged: boolean;
        verifier: string;
        certType: string;
        fields: string[];
    }): Promise<boolean> 
    public async revokePermission(oldToken: PermissionToken): Promise<void> 
    public async createAction(args: Parameters<WalletInterface["createAction"]>[0], originator?: string): ReturnType<WalletInterface["createAction"]> 
    public async signAction(...args: Parameters<WalletInterface["signAction"]>): ReturnType<WalletInterface["signAction"]> 
    public async abortAction(...args: Parameters<WalletInterface["abortAction"]>): ReturnType<WalletInterface["abortAction"]> 
    public async listActions(...args: Parameters<WalletInterface["listActions"]>): ReturnType<WalletInterface["listActions"]> 
    public async internalizeAction(...args: Parameters<WalletInterface["internalizeAction"]>): ReturnType<WalletInterface["internalizeAction"]> 
    public async listOutputs(...args: Parameters<WalletInterface["listOutputs"]>): ReturnType<WalletInterface["listOutputs"]> 
    public async relinquishOutput(...args: Parameters<WalletInterface["relinquishOutput"]>): ReturnType<WalletInterface["relinquishOutput"]> 
    public async getPublicKey(...args: Parameters<WalletInterface["getPublicKey"]>): ReturnType<WalletInterface["getPublicKey"]> 
    public async revealCounterpartyKeyLinkage(...args: Parameters<WalletInterface["revealCounterpartyKeyLinkage"]>): ReturnType<WalletInterface["revealCounterpartyKeyLinkage"]> 
    public async revealSpecificKeyLinkage(...args: Parameters<WalletInterface["revealSpecificKeyLinkage"]>): ReturnType<WalletInterface["revealSpecificKeyLinkage"]> 
    public async encrypt(...args: Parameters<WalletInterface["encrypt"]>): ReturnType<WalletInterface["encrypt"]> 
    public async decrypt(...args: Parameters<WalletInterface["decrypt"]>): ReturnType<WalletInterface["decrypt"]> 
    public async createHmac(...args: Parameters<WalletInterface["createHmac"]>): ReturnType<WalletInterface["createHmac"]> 
    public async verifyHmac(...args: Parameters<WalletInterface["verifyHmac"]>): ReturnType<WalletInterface["verifyHmac"]> 
    public async createSignature(...args: Parameters<WalletInterface["createSignature"]>): ReturnType<WalletInterface["createSignature"]> 
    public async verifySignature(...args: Parameters<WalletInterface["verifySignature"]>): ReturnType<WalletInterface["verifySignature"]> 
    public async acquireCertificate(...args: Parameters<WalletInterface["acquireCertificate"]>): ReturnType<WalletInterface["acquireCertificate"]> 
    public async listCertificates(...args: Parameters<WalletInterface["listCertificates"]>): ReturnType<WalletInterface["listCertificates"]> 
    public async proveCertificate(...args: Parameters<WalletInterface["proveCertificate"]>): ReturnType<WalletInterface["proveCertificate"]> 
    public async relinquishCertificate(...args: Parameters<WalletInterface["relinquishCertificate"]>): ReturnType<WalletInterface["relinquishCertificate"]> 
    public async discoverByIdentityKey(...args: Parameters<WalletInterface["discoverByIdentityKey"]>): ReturnType<WalletInterface["discoverByIdentityKey"]> 
    public async discoverByAttributes(...args: Parameters<WalletInterface["discoverByAttributes"]>): ReturnType<WalletInterface["discoverByAttributes"]> 
    public async isAuthenticated(...args: Parameters<WalletInterface["isAuthenticated"]>): ReturnType<WalletInterface["isAuthenticated"]> 
    public async waitForAuthentication(...args: Parameters<WalletInterface["waitForAuthentication"]>): ReturnType<WalletInterface["waitForAuthentication"]> 
    public async getHeight(...args: Parameters<WalletInterface["getHeight"]>): ReturnType<WalletInterface["getHeight"]> 
    public async getHeaderForHeight(...args: Parameters<WalletInterface["getHeaderForHeight"]>): ReturnType<WalletInterface["getHeaderForHeight"]> 
    public async getNetwork(...args: Parameters<WalletInterface["getNetwork"]>): ReturnType<WalletInterface["getNetwork"]> 
    public async getVersion(...args: Parameters<WalletInterface["getVersion"]>): ReturnType<WalletInterface["getVersion"]> 
}
```

See also: [CounterpartyPermissionEventHandler](./client.md#type-counterpartypermissioneventhandler), [CounterpartyPermissions](./client.md#interface-counterpartypermissions), [GroupedPermissionEventHandler](./client.md#type-groupedpermissioneventhandler), [GroupedPermissions](./client.md#interface-groupedpermissions), [PermissionEventHandler](./client.md#type-permissioneventhandler), [PermissionToken](./client.md#interface-permissiontoken), [PermissionsManagerConfig](./client.md#interface-permissionsmanagerconfig), [WalletPermissionsManagerCallbacks](./client.md#interface-walletpermissionsmanagercallbacks), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [proveCertificate](./client.md#function-provecertificate), [signAction](./client.md#function-signaction)

###### Constructor

Constructs a new Permissions Manager instance.

```ts
constructor(underlyingWallet: WalletInterface, adminOriginator: string, config: PermissionsManagerConfig = {}) 
```
See also: [PermissionsManagerConfig](./client.md#interface-permissionsmanagerconfig)

Argument Details

+ **underlyingWallet**
  + The underlying BRC-100 wallet, where requests are forwarded after permission is granted
+ **adminOriginator**
  + The domain or FQDN that is automatically allowed everything
+ **config**
  + A set of boolean flags controlling how strictly permissions are enforced

###### Method bindCallback

Binds a callback function to a named event, such as `onProtocolPermissionRequested`.

```ts
public bindCallback(eventName: keyof WalletPermissionsManagerCallbacks, handler: PermissionEventHandler | GroupedPermissionEventHandler | CounterpartyPermissionEventHandler): number 
```
See also: [CounterpartyPermissionEventHandler](./client.md#type-counterpartypermissioneventhandler), [GroupedPermissionEventHandler](./client.md#type-groupedpermissioneventhandler), [PermissionEventHandler](./client.md#type-permissioneventhandler), [WalletPermissionsManagerCallbacks](./client.md#interface-walletpermissionsmanagercallbacks)

Returns

A numeric ID you can use to unbind later

Argument Details

+ **eventName**
  + The name of the event to listen to
+ **handler**
  + A function that handles the event

###### Method denyGroupedPermission

Denies a previously requested grouped permission.

```ts
public async denyGroupedPermission(requestID: string): Promise<void> 
```

Argument Details

+ **requestID**
  + The ID of the request being denied.

###### Method denyPermission

Denies a previously requested permission.
This method rejects all pending promise calls waiting on that request

```ts
public async denyPermission(requestID: string): Promise<void> 
```

Argument Details

+ **requestID**
  + requestID identifying which request to deny

###### Method ensureBasketAccess

Ensures the originator has basket usage permission for the specified basket.
If not, triggers a permission request flow.

```ts
public async ensureBasketAccess({ originator, basket, reason, seekPermission = true, usageType }: {
    originator: string;
    basket: string;
    reason?: string;
    seekPermission?: boolean;
    usageType: "insertion" | "removal" | "listing";
}): Promise<boolean> 
```

###### Method ensureCertificateAccess

Ensures the originator has a valid certificate permission.
This is relevant when revealing certificate fields in DCAP contexts.

```ts
public async ensureCertificateAccess({ originator, privileged, verifier, certType, fields, reason, seekPermission = true, usageType }: {
    originator: string;
    privileged: boolean;
    verifier: string;
    certType: string;
    fields: string[];
    reason?: string;
    seekPermission?: boolean;
    usageType: "disclosure";
}): Promise<boolean> 
```

###### Method ensureLabelAccess

Ensures the originator has label usage permission.
If no valid (unexpired) permission token is found, triggers a permission request flow.

```ts
public async ensureLabelAccess({ originator, label, reason, seekPermission = true, usageType }: {
    originator: string;
    label: string;
    reason?: string;
    seekPermission?: boolean;
    usageType: "apply" | "list";
}): Promise<boolean> 
```

###### Method ensureProtocolPermission

Ensures the originator has protocol usage permission.
If no valid (unexpired) permission token is found, triggers a permission request flow.

```ts
public async ensureProtocolPermission({ originator, privileged, protocolID, counterparty, reason, seekPermission = true, usageType }: {
    originator: string;
    privileged: boolean;
    protocolID: WalletProtocol;
    counterparty: string;
    reason?: string;
    seekPermission?: boolean;
    usageType: "signing" | "encrypting" | "hmac" | "publicKey" | "identityKey" | "linkageRevelation" | "generic";
}): Promise<boolean> 
```

###### Method ensureSpendingAuthorization

Ensures the originator has spending authorization (DSAP) for a certain satoshi amount.
If the existing token limit is insufficient, attempts to renew. If no token, attempts to create one.

```ts
public async ensureSpendingAuthorization({ originator, satoshis, lineItems, reason, seekPermission = true }: {
    originator: string;
    satoshis: number;
    lineItems?: Array<{
        type: "input" | "output" | "fee";
        description: string;
        satoshis: number;
    }>;
    reason?: string;
    seekPermission?: boolean;
}): Promise<boolean> 
```

###### Method grantGroupedPermission

Grants a previously requested grouped permission.

```ts
public async grantGroupedPermission(params: {
    requestID: string;
    granted: Partial<GroupedPermissions>;
    expiry?: number;
}): Promise<void> 
```
See also: [GroupedPermissions](./client.md#interface-groupedpermissions)

Argument Details

+ **params.requestID**
  + The ID of the request being granted.
+ **params.granted**
  + A subset of the originally requested permissions that the user has granted.
+ **params.expiry**
  + An optional expiry time (in seconds) for the new permission tokens.

###### Method grantPermission

Grants a previously requested permission.
This method:
 1) Resolves all pending promise calls waiting on this request
 2) Optionally creates or renews an on-chain PushDrop token (unless `ephemeral===true`)

```ts
public async grantPermission(params: {
    requestID: string;
    expiry?: number;
    ephemeral?: boolean;
    amount?: number;
}): Promise<void> 
```

Argument Details

+ **params**
  + requestID to identify which request is granted, plus optional expiry
or `ephemeral` usage, etc.

###### Method hasBasketAccess

Returns `true` if the originator already holds a valid unexpired basket permission for `basket`.

```ts
public async hasBasketAccess(params: {
    originator: string;
    basket: string;
}): Promise<boolean> 
```

###### Method hasCertificateAccess

Returns `true` if the originator already holds a valid unexpired certificate access
for the given certType/fields. Does not prompt the user.

```ts
public async hasCertificateAccess(params: {
    originator: string;
    privileged: boolean;
    verifier: string;
    certType: string;
    fields: string[];
}): Promise<boolean> 
```

###### Method hasProtocolPermission

Returns true if the originator already holds a valid unexpired protocol permission.
This calls `ensureProtocolPermission` with `seekPermission=false`, so it won't prompt.

```ts
public async hasProtocolPermission(params: {
    originator: string;
    privileged: boolean;
    protocolID: WalletProtocol;
    counterparty: string;
}): Promise<boolean> 
```

###### Method hasSpendingAuthorization

Returns `true` if the originator already holds a valid spending authorization token
with enough available monthly spend. We do not prompt (seekPermission=false).

```ts
public async hasSpendingAuthorization(params: {
    originator: string;
    satoshis: number;
}): Promise<boolean> 
```

###### Method listBasketAccess

Lists basket permission tokens (DBAP) for a given originator or basket (or for all if not specified).

```ts
public async listBasketAccess(params: {
    originator?: string;
    basket?: string;
} = {}): Promise<PermissionToken[]> 
```
See also: [PermissionToken](./client.md#interface-permissiontoken)

Returns

Array of permission tokens that match the filter criteria

Argument Details

+ **params.originator**
  + Optional originator to filter by
+ **params.basket**
  + Optional basket name to filter by

###### Method listCertificateAccess

Lists certificate permission tokens (DCAP) with optional filters.

```ts
public async listCertificateAccess(params: {
    originator?: string;
    privileged?: boolean;
    certType?: Base64String;
    verifier?: PubKeyHex;
} = {}): Promise<PermissionToken[]> 
```
See also: [PermissionToken](./client.md#interface-permissiontoken)

Returns

Array of permission tokens that match the filter criteria

Argument Details

+ **originator**
  + Optional originator domain to filter by
+ **privileged**
  + Optional boolean to filter by privileged status
+ **certType**
  + Optional certificate type to filter by
+ **verifier**
  + Optional verifier to filter by

###### Method listProtocolPermissions

Lists all protocol permission tokens (DPACP) with optional filters.

```ts
public async listProtocolPermissions({ originator, privileged, protocolName, protocolSecurityLevel, counterparty }: {
    originator?: string;
    privileged?: boolean;
    protocolName?: string;
    protocolSecurityLevel?: number;
    counterparty?: string;
} = {}): Promise<PermissionToken[]> 
```
See also: [PermissionToken](./client.md#interface-permissiontoken)

Returns

Array of permission tokens that match the filter criteria

Argument Details

+ **originator**
  + Optional originator domain to filter by
+ **privileged**
  + Optional boolean to filter by privileged status
+ **protocolName**
  + Optional protocol name to filter by
+ **protocolSecurityLevel**
  + Optional protocol security level to filter by
+ **counterparty**
  + Optional counterparty to filter by

###### Method listSpendingAuthorizations

Lists spending authorization tokens (DSAP) for a given originator (or all).

```ts
public async listSpendingAuthorizations(params: {
    originator?: string;
}): Promise<PermissionToken[]> 
```
See also: [PermissionToken](./client.md#interface-permissiontoken)

###### Method querySpentSince

Returns spending for an originator in the current calendar month.

```ts
public async querySpentSince(token: PermissionToken): Promise<number> 
```
See also: [PermissionToken](./client.md#interface-permissiontoken)

###### Method revokePermission

Revokes a permission token by spending it with no replacement output.
The manager builds a BRC-100 transaction that consumes the token, effectively invalidating it.

```ts
public async revokePermission(oldToken: PermissionToken): Promise<void> 
```
See also: [PermissionToken](./client.md#interface-permissiontoken)

###### Method unbindCallback

Unbinds a previously registered callback by either its numeric ID (returned by `bindCallback`)
or by exact function reference.

```ts
public unbindCallback(eventName: keyof WalletPermissionsManagerCallbacks, reference: number | Function): boolean 
```
See also: [WalletPermissionsManagerCallbacks](./client.md#interface-walletpermissionsmanagercallbacks)

Returns

True if successfully unbound, false otherwise

Argument Details

+ **eventName**
  + The event name, e.g. "onProtocolPermissionRequested"
+ **reference**
  + Either the numeric ID or the function reference

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletSettingsManager

Manages wallet settings

```ts
export class WalletSettingsManager {
    kv: LocalKVStore;
    constructor(private wallet: WalletInterface, private config: WalletSettingsManagerConfig = {
        defaultSettings: DEFAULT_SETTINGS
    }) 
    async get(): Promise<WalletSettings> 
    async set(settings: WalletSettings): Promise<void> 
    async delete(): Promise<void> 
}
```

See also: [DEFAULT_SETTINGS](./client.md#variable-default_settings), [WalletSettings](./client.md#interface-walletsettings), [WalletSettingsManagerConfig](./client.md#interface-walletsettingsmanagerconfig)

###### Method delete

Deletes the user's settings token.

```ts
async delete(): Promise<void> 
```

###### Method get

Returns a user's wallet settings

```ts
async get(): Promise<WalletSettings> 
```
See also: [WalletSettings](./client.md#interface-walletsettings)

Returns

- Wallet settings object

###### Method set

Creates (or updates) the user's settings token.

```ts
async set(settings: WalletSettings): Promise<void> 
```
See also: [WalletSettings](./client.md#interface-walletsettings)

Argument Details

+ **settings**
  + The wallet settings to be stored.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletSigner

```ts
export class WalletSigner {
    isWalletSigner: true = true;
    chain: Chain;
    keyDeriver: KeyDeriverApi;
    storage: WalletStorageManager;
    constructor(chain: Chain, keyDeriver: KeyDeriverApi, storage: WalletStorageManager) 
}
```

See also: [Chain](./client.md#type-chain), [WalletStorageManager](./storage.md#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WalletStorageManager

The `WalletStorageManager` class delivers authentication checking storage access to the wallet.

If manages multiple `StorageBase` derived storage services: one actice, the rest as backups.

Of the storage services, one is 'active' at any one time.
On startup, and whenever triggered by the wallet, `WalletStorageManager` runs a syncrhonization sequence:

1. While synchronizing, all other access to storage is blocked waiting.
2. The active service is confirmed, potentially triggering a resolution process if there is disagreement.
3. Changes are pushed from the active storage service to each inactive, backup service.

Some storage services do not support multiple writers. `WalletStorageManager` manages wait-blocking write requests
for these services.

```ts
export class WalletStorageManager implements sdk.WalletStorage {
    _stores: ManagedStorage[] = [];
    _isAvailable: boolean = false;
    _active?: ManagedStorage;
    _backups?: ManagedStorage[];
    _conflictingActives?: ManagedStorage[];
    _authId: sdk.AuthId;
    _services?: sdk.WalletServices;
    constructor(identityKey: string, active?: sdk.WalletStorageProvider, backups?: sdk.WalletStorageProvider[]) 
    isStorageProvider(): boolean 
    isAvailable(): boolean 
    get isActiveEnabled(): boolean 
    canMakeAvailable(): boolean 
    async makeAvailable(): Promise<TableSettings> 
    async getAuth(mustBeActive?: boolean): Promise<sdk.AuthId> 
    async getUserId(): Promise<number> 
    getActive(): sdk.WalletStorageProvider 
    getActiveSettings(): TableSettings 
    getActiveUser(): TableUser 
    getActiveStore(): string 
    getActiveStoreName(): string 
    getBackupStores(): string[] 
    getConflictingStores(): string[] 
    getAllStores(): string[] 
    async runAsWriter<R>(writer: (active: sdk.WalletStorageWriter) => Promise<R>): Promise<R> 
    async runAsReader<R>(reader: (active: sdk.WalletStorageReader) => Promise<R>): Promise<R> 
    async runAsSync<R>(sync: (active: sdk.WalletStorageSync) => Promise<R>, activeSync?: sdk.WalletStorageSync): Promise<R> 
    async runAsStorageProvider<R>(sync: (active: StorageProvider) => Promise<R>): Promise<R> 
    isActiveStorageProvider(): boolean 
    async addWalletStorageProvider(provider: sdk.WalletStorageProvider): Promise<void> 
    setServices(v: sdk.WalletServices) 
    getServices(): sdk.WalletServices 
    getSettings(): TableSettings 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    async destroy(): Promise<void> 
    async findOrInsertUser(identityKey: string): Promise<{
        user: TableUser;
        isNew: boolean;
    }> 
    async abortAction(args: AbortActionArgs): Promise<AbortActionResult> 
    async createAction(vargs: Validation.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async internalizeAction(args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
    async relinquishCertificate(args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(args: RelinquishOutputArgs): Promise<number> 
    async processAction(args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async insertCertificate(certificate: TableCertificate): Promise<number> 
    async listActions(vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> 
    async listCertificates(args: Validation.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async listOutputs(vargs: Validation.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
    async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
    async reproveHeader(deactivatedHash: string): Promise<sdk.ReproveHeaderResult> 
    async verifyAndRepairBeef(beef: Beef, allowTxidOnly?: boolean): Promise<VerifyAndRepairBeefResult> 
    async reproveProven(ptx: TableProvenTx, noUpdate?: boolean): Promise<sdk.ReproveProvenResult> 
    async syncFromReader(identityKey: string, reader: sdk.WalletStorageSyncReader, activeSync?: sdk.WalletStorageSync, log: string = ""): Promise<{
        inserts: number;
        updates: number;
        log: string;
    }> 
    async syncToWriter(auth: sdk.AuthId, writer: sdk.WalletStorageProvider, activeSync?: sdk.WalletStorageSync, log: string = "", progLog?: (s: string) => string): Promise<{
        inserts: number;
        updates: number;
        log: string;
    }> 
    async updateBackups(activeSync?: sdk.WalletStorageSync, progLog?: (s: string) => string): Promise<string> 
    async setActive(storageIdentityKey: string, progLog?: (s: string) => string): Promise<string> 
    getStoreEndpointURL(store: ManagedStorage): string | undefined 
    getStores(): sdk.WalletStorageInfo[] 
}
```

See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [ReproveHeaderResult](./client.md#interface-reproveheaderresult), [ReproveProvenResult](./client.md#interface-reproveprovenresult), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvider](./storage.md#class-storageprovider), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableUser](./storage.md#interface-tableuser), [VerifyAndRepairBeefResult](./storage.md#interface-verifyandrepairbeefresult), [WalletServices](./client.md#interface-walletservices), [WalletStorage](./client.md#interface-walletstorage), [WalletStorageInfo](./client.md#interface-walletstorageinfo), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [WalletStorageReader](./client.md#interface-walletstoragereader), [WalletStorageSync](./client.md#interface-walletstoragesync), [WalletStorageSyncReader](./client.md#interface-walletstoragesyncreader), [WalletStorageWriter](./client.md#interface-walletstoragewriter), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction)

###### Constructor

Creates a new WalletStorageManager with the given identityKey and optional active and backup storage providers.

```ts
constructor(identityKey: string, active?: sdk.WalletStorageProvider, backups?: sdk.WalletStorageProvider[]) 
```
See also: [WalletStorageProvider](./client.md#interface-walletstorageprovider)

Argument Details

+ **identityKey**
  + The identity key of the user for whom this wallet is being managed.
+ **active**
  + An optional active storage provider. If not provided, no active storage will be set.
+ **backups**
  + An optional array of backup storage providers. If not provided, no backups will be set.

###### Property _active

The current active store which is only enabled if the store's user record activeStorage property matches its settings record storageIdentityKey property

```ts
_active?: ManagedStorage
```

###### Property _authId

identityKey is always valid, userId and isActive are valid only if _isAvailable

```ts
_authId: sdk.AuthId
```
See also: [AuthId](./client.md#interface-authid)

###### Property _backups

Stores to which state is pushed by updateBackups.

```ts
_backups?: ManagedStorage[]
```

###### Property _conflictingActives

Stores whose user record activeStorage property disagrees with the active store's user record activeStorage property.

```ts
_conflictingActives?: ManagedStorage[]
```

###### Property _isAvailable

True if makeAvailable has been run and access to managed stores (active) is allowed

```ts
_isAvailable: boolean = false
```

###### Property _services

Configured services if any. If valid, shared with stores (which may ignore it).

```ts
_services?: sdk.WalletServices
```
See also: [WalletServices](./client.md#interface-walletservices)

###### Property _stores

All configured stores including current active, backups, and conflicting actives.

```ts
_stores: ManagedStorage[] = []
```

###### Method canMakeAvailable

```ts
canMakeAvailable(): boolean 
```

Returns

true if at least one WalletStorageProvider has been added.

###### Method isActiveStorageProvider

```ts
isActiveStorageProvider(): boolean 
```

Returns

true if the active `WalletStorageProvider` also implements `StorageProvider`

###### Method makeAvailable

This async function must be called after construction and before
any other async function can proceed.

Runs through `_stores` validating all properties and partitioning across `_active`, `_backups`, `_conflictingActives`.

```ts
async makeAvailable(): Promise<TableSettings> 
```
See also: [TableSettings](./storage.md#interface-tablesettings)

Returns

from the active storage.

Throws

WERR_INVALID_PARAMETER if canMakeAvailable returns false.

###### Method reproveHeader

For each proven_txs record currently sourcing its transaction merkle proof from the given deactivated header,
attempt to reprove the transaction against the current chain,
updating the proven_txs record if a new valid proof is found.

```ts
async reproveHeader(deactivatedHash: string): Promise<sdk.ReproveHeaderResult> 
```
See also: [ReproveHeaderResult](./client.md#interface-reproveheaderresult)

Argument Details

+ **deactivatedHash**
  + An orphaned header than may have served as a proof source for proven_txs records.

###### Method reproveProven

Attempt to reprove the transaction against the current chain,
If a new valid proof is found and noUpdate is not true,
update the proven_txs record with new block and merkle proof data.
If noUpdate is true, the update to be applied is available in the returned result.

```ts
async reproveProven(ptx: TableProvenTx, noUpdate?: boolean): Promise<sdk.ReproveProvenResult> 
```
See also: [ReproveProvenResult](./client.md#interface-reproveprovenresult), [TableProvenTx](./storage.md#interface-tableproventx)

Argument Details

+ **ptx**
  + proven_txs record to reprove

###### Method runAsSync

```ts
async runAsSync<R>(sync: (active: sdk.WalletStorageSync) => Promise<R>, activeSync?: sdk.WalletStorageSync): Promise<R> 
```
See also: [WalletStorageSync](./client.md#interface-walletstoragesync)

Argument Details

+ **sync**
  + the function to run with sync access lock
+ **activeSync**
  + from chained sync functions, active storage already held under sync access lock.

###### Method setActive

Updates backups and switches to new active storage provider from among current backup providers.

Also resolves conflicting actives.

```ts
async setActive(storageIdentityKey: string, progLog?: (s: string) => string): Promise<string> 
```

Argument Details

+ **storageIdentityKey**
  + of current backup storage provider that is to become the new active provider.

###### Method verifyAndRepairBeef

Extends the Beef `verify` function to handle BUMPs that have become invalid due to a chain reorg,
and originated from proven_txs records tracked by this storage.

This method is optimized for making sure outgoing beefs are valid before sharing them externally.
In particular, it only "repairs" proofs previously tracked by this storage.

Any merkle root that fails `isValidRootForHeight` triggers a reprove attempt for that block header.
This results in proven_txs with invalid proofs being updated with new valid proofs where possible.

```ts
async verifyAndRepairBeef(beef: Beef, allowTxidOnly?: boolean): Promise<VerifyAndRepairBeefResult> 
```
See also: [VerifyAndRepairBeefResult](./storage.md#interface-verifyandrepairbeefresult)

Returns

VerifyAndRepairBeefResult, in particular `verifiedBeef` is valid only verify and repair succeeded fully.

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
| [WalletErrorFromJson](#function-walleterrorfromjson) | [getBeefForTransaction](#function-getbeeffortransaction) | [setDisableDoubleSpendCheckForTest](#function-setdisabledoublespendcheckfortest) |
| [WocHeadersBulkListener](#function-wocheadersbulklistener) | [getBeefForTxid](#function-getbeeffortxid) | [sha256Hash](#function-sha256hash) |
| [WocHeadersBulkListener_test](#function-wocheadersbulklistener_test) | [getExchangeRatesIo](#function-getexchangeratesio) | [sha256HashOfBinaryFile](#function-sha256hashofbinaryfile) |
| [WocHeadersLiveListener](#function-wocheaderslivelistener) | [getIdentityKey](#function-getidentitykey) | [shareReqsWithWorld](#function-sharereqswithworld) |
| [WocHeadersLiveListener_test](#function-wocheaderslivelistener_test) | [getProofs](#function-getproofs) | [signAction](#function-signaction) |
| [acquireDirectCertificate](#function-acquiredirectcertificate) | [getSyncChunk](#function-getsyncchunk) | [stampLog](#function-stamplog) |
| [addWork](#function-addwork) | [getWhatsOnChainBlockHeaderByHash](#function-getwhatsonchainblockheaderbyhash) | [stampLogFormat](#function-stamplogformat) |
| [arcDefaultUrl](#function-arcdefaulturl) | [internalizeAction](#function-internalizeaction) | [subWork](#function-subwork) |
| [arcGorillaPoolUrl](#function-arcgorillapoolurl) | [internalizeAction](#function-internalizeaction) | [swapByteOrder](#function-swapbyteorder) |
| [arraysEqual](#function-arraysequal) | [isBaseBlockHeader](#function-isbaseblockheader) | [throwDummyReviewActions](#function-throwdummyreviewactions) |
| [asArray](#function-asarray) | [isBlockHeader](#function-isblockheader) | [toBinaryBaseBlockHeader](#function-tobinarybaseblockheader) |
| [asBsvSdkPrivateKey](#function-asbsvsdkprivatekey) | [isCreateActionSpecOp](#function-iscreateactionspecop) | [toWalletNetwork](#function-towalletnetwork) |
| [asBsvSdkPublickKey](#function-asbsvsdkpublickkey) | [isKnownValidBulkHeaderFile](#function-isknownvalidbulkheaderfile) | [transactionInputSize](#function-transactioninputsize) |
| [asBsvSdkScript](#function-asbsvsdkscript) | [isListActionsSpecOp](#function-islistactionsspecop) | [transactionOutputSize](#function-transactionoutputsize) |
| [asBsvSdkTx](#function-asbsvsdktx) | [isListOutputsSpecOp](#function-islistoutputsspecop) | [transactionSize](#function-transactionsize) |
| [asString](#function-asstring) | [isLive](#function-islive) | [updateChaintracksFiatExchangeRates](#function-updatechaintracksfiatexchangerates) |
| [asUint8Array](#function-asuint8array) | [isLiveBlockHeader](#function-isliveblockheader) | [updateExchangeratesapi](#function-updateexchangeratesapi) |
| [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork) | [isMoreWork](#function-ismorework) | [validBulkHeaderFilesByFileHash](#function-validbulkheaderfilesbyfilehash) |
| [blockHash](#function-blockhash) | [keyOffsetToHashedSecret](#function-keyoffsettohashedsecret) | [validateAgainstDirtyHashes](#function-validateagainstdirtyhashes) |
| [buildSignableTransaction](#function-buildsignabletransaction) | [listActionsIdb](#function-listactionsidb) | [validateBufferOfHeaders](#function-validatebufferofheaders) |
| [completeSignedTransaction](#function-completesignedtransaction) | [listCertificates](#function-listcertificates) | [validateBulkFileData](#function-validatebulkfiledata) |
| [convertBitsToTarget](#function-convertbitstotarget) | [listOutputsIdb](#function-listoutputsidb) | [validateGenerateChangeSdkParams](#function-validategeneratechangesdkparams) |
| [convertBitsToWork](#function-convertbitstowork) | [lockScriptWithKeyOffsetFromPubKey](#function-lockscriptwithkeyoffsetfrompubkey) | [validateGenerateChangeSdkResult](#function-validategeneratechangesdkresult) |
| [convertBufferToUint32](#function-convertbuffertouint32) | [logCreateActionArgs](#function-logcreateactionargs) | [validateGenesisHeader](#function-validategenesisheader) |
| [convertProofToMerklePath](#function-convertprooftomerklepath) | [logWalletError](#function-logwalleterror) | [validateHeaderDifficulty](#function-validateheaderdifficulty) |
| [convertUint32ToBuffer](#function-convertuint32tobuffer) | [makeAtomicBeef](#function-makeatomicbeef) | [validateHeaderFormat](#function-validateheaderformat) |
| [convertWocToBlockHeaderHex](#function-convertwoctoblockheaderhex) | [makeChangeLock](#function-makechangelock) | [validateScriptHash](#function-validatescripthash) |
| [createAction](#function-createaction) | [maxDate](#function-maxdate) | [validateSecondsSinceEpoch](#function-validatesecondssinceepoch) |
| [createAction](#function-createaction) | [offsetPrivKey](#function-offsetprivkey) | [validateStorageFeeModel](#function-validatestoragefeemodel) |
| [createDefaultIdbChaintracksOptions](#function-createdefaultidbchaintracksoptions) | [offsetPubKey](#function-offsetpubkey) | [varUintSize](#function-varuintsize) |
| [createDefaultNoDbChaintracksOptions](#function-createdefaultnodbchaintracksoptions) | [optionalArraysEqual](#function-optionalarraysequal) | [verifyHexString](#function-verifyhexstring) |
| [createDefaultWalletServicesOptions](#function-createdefaultwalletservicesoptions) | [parseTxScriptOffsets](#function-parsetxscriptoffsets) | [verifyId](#function-verifyid) |
| [createIdbChaintracks](#function-createidbchaintracks) | [processAction](#function-processaction) | [verifyInteger](#function-verifyinteger) |
| [createNoDbChaintracks](#function-createnodbchaintracks) | [processAction](#function-processaction) | [verifyNumber](#function-verifynumber) |
| [createStorageServiceChargeScript](#function-createstorageservicechargescript) | [proveCertificate](#function-provecertificate) | [verifyOne](#function-verifyone) |
| [createSyncMap](#function-createsyncmap) | [purgeDataIdb](#function-purgedataidb) | [verifyOneOrNone](#function-verifyoneornone) |
| [deserializeBaseBlockHeader](#function-deserializebaseblockheader) | [randomBytes](#function-randombytes) | [verifyOptionalHexString](#function-verifyoptionalhexstring) |
| [deserializeBaseBlockHeaders](#function-deserializebaseblockheaders) | [randomBytesBase64](#function-randombytesbase64) | [verifyTruthy](#function-verifytruthy) |
| [deserializeBlockHeader](#function-deserializeblockheader) | [randomBytesHex](#function-randombyteshex) | [verifyUnlockScripts](#function-verifyunlockscripts) |
| [deserializeBlockHeaders](#function-deserializeblockheaders) | [readUInt32BE](#function-readuint32be) | [wait](#function-wait) |
| [doubleSha256BE](#function-doublesha256be) | [readUInt32LE](#function-readuint32le) | [wocGetHeadersHeaderToBlockHeader](#function-wocgetheadersheadertoblockheader) |
| [doubleSha256LE](#function-doublesha256le) | [redeemServiceCharges](#function-redeemservicecharges) | [workBNtoBuffer](#function-workbntobuffer) |
| [generateChangeSdk](#function-generatechangesdk) | [reviewStatusIdb](#function-reviewstatusidb) | [writeUInt32BE](#function-writeuint32be) |
| [generateChangeSdkMakeStorage](#function-generatechangesdkmakestorage) | [selectBulkHeaderFiles](#function-selectbulkheaderfiles) | [writeUInt32LE](#function-writeuint32le) |
| [genesisBuffer](#function-genesisbuffer) | [serializeBaseBlockHeader](#function-serializebaseblockheader) |  |
| [genesisHeader](#function-genesisheader) | [serializeBaseBlockHeaders](#function-serializebaseblockheaders) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Function: WalletErrorFromJson

Reconstruct the correct derived WalletError from a JSON object created by `WalletError.unknownToJson`.

This function is implemented as a separate function instead of a WalletError class static
to avoid circular dependencies.

```ts
export function WalletErrorFromJson(json: object): WalletError 
```

See also: [WalletError](./client.md#class-walleterror)

Returns

a WalletError derived error object, typically for re-throw.

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
##### Function: acquireDirectCertificate

```ts
export async function acquireDirectCertificate(wallet: Wallet, auth: AuthId, vargs: Validation.ValidAcquireDirectCertificateArgs): Promise<AcquireCertificateResult> 
```

See also: [AuthId](./client.md#interface-authid), [Wallet](./client.md#class-wallet)

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
##### Function: arraysEqual

Compares lengths and direct equality of values.

```ts
export function arraysEqual(arr1: Number[], arr2: Number[]) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asArray

Convert a value to number[] if currently an encoded string or number[] or Uint8Array.

```ts
export function asArray(val: string | number[] | Uint8Array, enc?: "hex" | "utf8" | "base64"): number[] {
    if (Array.isArray(val))
        return val;
    if (typeof val !== "string")
        return Array.from(val);
    enc ||= "hex";
    let a: number[] = Utils.toArray(val, enc);
    return a;
}
```

Returns

number[] array of byte values representation of val.

Argument Details

+ **val**
  + string or number[] or Uint8Array. If string, encoding must be hex. If number[], each value must be 0..255.
+ **enc**
  + optional encoding type if val is string, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asBsvSdkPrivateKey

```ts
export function asBsvSdkPrivateKey(privKey: string): PrivateKey 
```

Argument Details

+ **privKey**
  + bitcoin private key in 32 byte hex string form

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asBsvSdkPublickKey

```ts
export function asBsvSdkPublickKey(pubKey: string): PublicKey 
```

Argument Details

+ **pubKey**
  + bitcoin public key in standard compressed key hex string form

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asBsvSdkScript

Coerce a bsv script encoded as a hex string, serialized array, or Script to Script
If script is already a Script, just return it.

```ts
export function asBsvSdkScript(script: HexString | number[] | Script): Script {
    if (Array.isArray(script)) {
        script = Script.fromBinary(script);
    }
    else if (typeof script === "string") {
        script = Script.fromHex(script);
    }
    return script;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asBsvSdkTx

Coerce a bsv transaction encoded as a hex string, serialized array, or Transaction to Transaction
If tx is already a Transaction, just return it.

```ts
export function asBsvSdkTx(tx: HexString | number[] | Transaction): Transaction {
    if (Array.isArray(tx)) {
        tx = Transaction.fromBinary(tx);
    }
    else if (typeof tx === "string") {
        tx = Transaction.fromHex(tx);
    }
    return tx;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asString

Convert a value to an encoded string if currently an encoded string or number[] or Uint8Array.

```ts
export function asString(val: string | number[] | Uint8Array, enc?: "hex" | "utf8" | "base64", returnEnc?: "hex" | "utf8" | "base64"): string {
    enc ||= "hex";
    returnEnc ||= enc;
    if (typeof val === "string") {
        if (enc === returnEnc)
            return val;
        val = asUint8Array(val, enc);
    }
    let v = Array.isArray(val) ? val : Array.from(val);
    switch (returnEnc) {
        case "utf8":
            return Utils.toUTF8(v);
        case "base64":
            return Utils.toBase64(v);
    }
    return Utils.toHex(v);
}
```

See also: [asUint8Array](./client.md#function-asuint8array)

Returns

hex encoded string representation of val.

Argument Details

+ **val**
  + string or number[] or Uint8Array. If string, encoding must be hex. If number[], each value must be 0..255.
+ **enc**
  + optional encoding type if val is string, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.
+ **returnEnc**
  + optional encoding type for returned string if different from `enc`, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asUint8Array

Convert a value to Uint8Array if currently an encoded string or number[] or Uint8Array.

```ts
export function asUint8Array(val: string | number[] | Uint8Array, enc?: "hex" | "utf8" | "base64"): Uint8Array {
    if (Array.isArray(val))
        return Uint8Array.from(val);
    if (typeof val !== "string")
        return val;
    enc ||= "hex";
    let a: number[] = Utils.toArray(val, enc);
    return Uint8Array.from(a);
}
```

Returns

Uint8Array representation of val.

Argument Details

+ **val**
  + string or number[] or Uint8Array. If string, encoding must be hex. If number[], each value must be 0..255.
+ **enc**
  + optional encoding type if val is string, defaults to 'hex'. Can be 'hex', 'utf8', or 'base64'.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: attemptToPostReqsToNetwork

Attempt to post one or more `ProvenTxReq` with status 'unsent'
to the bitcoin network.

```ts
export async function attemptToPostReqsToNetwork(storage: StorageProvider, reqs: EntityProvenTxReq[], trx?: sdk.TrxToken, logger?: WalletLoggerInterface): Promise<PostReqsToNetworkResult> 
```

See also: [EntityProvenTxReq](./storage.md#class-entityproventxreq), [PostReqsToNetworkResult](./storage.md#interface-postreqstonetworkresult), [StorageProvider](./storage.md#class-storageprovider), [TrxToken](./client.md#interface-trxtoken), [logger](./client.md#variable-logger)

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
##### Function: buildSignableTransaction

```ts
export function buildSignableTransaction(dctr: StorageCreateActionResult, args: Validation.ValidCreateActionArgs, wallet: Wallet): {
    tx: Transaction;
    amount: number;
    pdi: PendingStorageInput[];
    log: string;
} 
```

See also: [PendingStorageInput](./client.md#interface-pendingstorageinput), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: completeSignedTransaction

```ts
export async function completeSignedTransaction(prior: PendingSignAction, spends: Record<number, SignActionSpend>, wallet: Wallet): Promise<Transaction> 
```

See also: [PendingSignAction](./client.md#interface-pendingsignaction), [Wallet](./client.md#class-wallet)

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
##### Function: convertProofToMerklePath

```ts
export function convertProofToMerklePath(txid: string, proof: TscMerkleProofApi): MerklePath 
```

See also: [TscMerkleProofApi](./client.md#interface-tscmerkleproofapi)

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
##### Function: createAction

```ts
export async function createAction(storage: StorageProvider, auth: AuthId, vargs: Validation.ValidCreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<StorageCreateActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createAction

```ts
export async function createAction(wallet: Wallet, auth: AuthId, vargs: Validation.ValidCreateActionArgs): Promise<CreateActionResultX> 
```

See also: [AuthId](./client.md#interface-authid), [CreateActionResultX](./client.md#interface-createactionresultx), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultIdbChaintracksOptions

```ts
export function createDefaultIdbChaintracksOptions(chain: Chain, whatsonchainApiKey: string = "", maxPerFile: number = 100000, maxRetained: number = 2, fetch?: ChaintracksFetchApi, cdnUrl: string = "https://cdn.projectbabbage.com/blockheaders/", liveHeightThreshold: number = 2000, reorgHeightThreshold: number = 400, bulkMigrationChunkSize: number = 500, batchInsertLimit: number = 400, addLiveRecursionLimit: number = 36): ChaintracksOptions 
```

See also: [Chain](./client.md#type-chain), [ChaintracksFetchApi](./services.md#interface-chaintracksfetchapi), [ChaintracksOptions](./services.md#interface-chaintracksoptions)

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
##### Function: createStorageServiceChargeScript

```ts
export function createStorageServiceChargeScript(pubKeyHex: PubKeyHex): {
    script: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createSyncMap

```ts
export function createSyncMap(): SyncMap 
```

See also: [SyncMap](./storage.md#interface-syncmap)

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
##### Function: doubleSha256BE

Calculate the SHA256 hash of the SHA256 hash of an array of bytes.

```ts
export function doubleSha256BE(data: number[] | Uint8Array): number[] {
    return doubleSha256LE(data).reverse();
}
```

See also: [doubleSha256LE](./client.md#function-doublesha256le)

Returns

reversed (big-endian) double sha256 hash of data, byte 31 of hash first.

Argument Details

+ **data**
  + is an array of bytes.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: doubleSha256LE

Calculate the SHA256 hash of the SHA256 hash of an array of bytes.

```ts
export function doubleSha256LE(data: number[] | Uint8Array): number[] {
    if (!Array.isArray(data)) {
        data = asArray(data);
    }
    const first = new Hash.SHA256().update(data).digest();
    const second = new Hash.SHA256().update(first).digest();
    return second;
}
```

See also: [asArray](./client.md#function-asarray)

Returns

double sha256 hash of data, byte 0 of hash first.

Argument Details

+ **data**
  + an array of bytes

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: generateChangeSdk

Simplifications:
 - only support one change type with fixed length scripts.
 - only support satsPerKb fee model.

Confirms for each availbleChange output that it remains available as they are allocated and selects alternate if not.

```ts
export async function generateChangeSdk(params: GenerateChangeSdkParams, allocateChangeInput: (targetSatoshis: number, exactSatoshis?: number) => Promise<GenerateChangeSdkChangeInput | undefined>, releaseChangeInput: (outputId: number) => Promise<void>, logger?: WalletLoggerInterface): Promise<GenerateChangeSdkResult> 
```

See also: [GenerateChangeSdkChangeInput](./storage.md#interface-generatechangesdkchangeinput), [GenerateChangeSdkParams](./storage.md#interface-generatechangesdkparams), [GenerateChangeSdkResult](./storage.md#interface-generatechangesdkresult), [logger](./client.md#variable-logger)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: generateChangeSdkMakeStorage

```ts
export function generateChangeSdkMakeStorage(availableChange: GenerateChangeSdkChangeInput[]): {
    allocateChangeInput: (targetSatoshis: number, exactSatoshis?: number) => Promise<GenerateChangeSdkChangeInput | undefined>;
    releaseChangeInput: (outputId: number) => Promise<void>;
    getLog: () => string;
} 
```

See also: [GenerateChangeSdkChangeInput](./storage.md#interface-generatechangesdkchangeinput)

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
##### Function: getBeefForTransaction

Creates a `Beef` to support the validity of a transaction identified by its `txid`.

`storage` is used to retrieve proven transactions and their merkle paths,
or proven_tx_req record with beef of external inputs (internal inputs meged by recursion).
Otherwise external services are used.

`options.maxRecursionDepth` can be set to prevent overly deep chained dependencies. Will throw ERR_EXTSVS_ENVELOPE_DEPTH if exceeded.

If `trustSelf` is true, a partial `Beef` will be returned where transactions known by `storage` to
be valid by verified proof are represented solely by 'txid'.

If `knownTxids` is defined, any 'txid' required by the `Beef` that appears in the array is represented solely as a 'known' txid.

```ts
export async function getBeefForTransaction(storage: StorageProvider, txid: string, options: StorageGetBeefOptions): Promise<Beef> 
```

See also: [StorageGetBeefOptions](./client.md#interface-storagegetbeefoptions), [StorageProvider](./storage.md#class-storageprovider)

Argument Details

+ **storage**
  + the chain on which txid exists.
+ **txid**
  + the transaction hash for which an envelope is requested.

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
##### Function: getIdentityKey

```ts
export async function getIdentityKey(wallet: CertOpsWallet): Promise<PubKeyHex> 
```

See also: [CertOpsWallet](./client.md#interface-certopswallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getProofs

Process an array of table.ProvenTxReq (typically with status 'unmined' or 'unknown')

If req is invalid, set status 'invalid'

Verify the requests are valid, lookup proofs or updated transaction status using the array of getProofServices,

When proofs are found, create new ProvenTxApi records and transition the requests' status to 'unconfirmed' or 'notifying',
depending on chaintracks succeeding on proof verification.

Increments attempts if proofs where requested.

```ts
export async function getProofs(task: WalletMonitorTask, reqs: TableProvenTxReq[], indent = 0, countsAsAttempt = false, ignoreStatus = false, maxAcceptableHeight: number): Promise<{
    proven: TableProvenTxReq[];
    invalid: TableProvenTxReq[];
    log: string;
}> 
```

See also: [TableProvenTxReq](./storage.md#interface-tableproventxreq), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

Returns

reqs partitioned by status

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getSyncChunk

Gets the next sync chunk of updated data from un-remoted storage (could be using a remote DB connection).

```ts
export async function getSyncChunk(storage: StorageReader, args: RequestSyncChunkArgs): Promise<SyncChunk> 
```

See also: [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageReader](./storage.md#class-storagereader), [SyncChunk](./client.md#interface-syncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: getWhatsOnChainBlockHeaderByHash

```ts
export async function getWhatsOnChainBlockHeaderByHash(hash: string, chain: Chain = "main", apiKey?: string): Promise<BlockHeader | undefined> 
```

See also: [BlockHeader](./client.md#interface-blockheader), [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: internalizeAction

Internalize Action allows a wallet to take ownership of outputs in a pre-existing transaction.
The transaction may, or may not already be known to both the storage and user.

Two types of outputs are handled: "wallet payments" and "basket insertions".

A "basket insertion" output is considered a custom output and has no effect on the wallet's "balance".

A "wallet payment" adds an outputs value to the wallet's change "balance". These outputs are assigned to the "default" basket.

Processing starts with simple validation and then checks for a pre-existing transaction.
If the transaction is already known to the user, then the outputs are reviewed against the existing outputs treatment,
and merge rules are added to the arguments passed to the storage layer.
The existing transaction must be in the 'unproven' or 'completed' status. Any other status is an error.

When the transaction already exists, the description is updated. The isOutgoing sense is not changed.

"basket insertion" Merge Rules:
1. The "default" basket may not be specified as the insertion basket.
2. A change output in the "default" basket may not be target of an insertion into a different basket.
3. These baskets do not affect the wallet's balance and are typed "custom".

"wallet payment" Merge Rules:
1. Targetting an existing change "default" basket output results in a no-op. No error. No alterations made.
2. Targetting a previously "custom" non-change output converts it into a change output. This alters the transaction's `satoshis`, and the wallet balance.

```ts
export async function internalizeAction(storage: StorageProvider, auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: internalizeAction

Internalize Action allows a wallet to take ownership of outputs in a pre-existing transaction.
The transaction may, or may not already be known to both the storage and user.

Two types of outputs are handled: "wallet payments" and "basket insertions".

A "basket insertion" output is considered a custom output and has no effect on the wallet's "balance".

A "wallet payment" adds an outputs value to the wallet's change "balance". These outputs are assigned to the "default" basket.

Processing starts with simple validation and then checks for a pre-existing transaction.
If the transaction is already known to the user, then the outputs are reviewed against the existing outputs treatment,
and merge rules are added to the arguments passed to the storage layer.
The existing transaction must be in the 'unproven' or 'completed' status. Any other status is an error.

When the transaction already exists, the description is updated. The isOutgoing sense is not changed.

"basket insertion" Merge Rules:
1. The "default" basket may not be specified as the insertion basket.
2. A change output in the "default" basket may not be target of an insertion into a different basket.
3. These baskets do not affect the wallet's balance and are typed "custom".

"wallet payment" Merge Rules:
1. Targetting an existing change "default" basket output results in a no-op. No error. No alterations made.
2. Targetting a previously "custom" non-change output converts it into a change output. This alters the transaction's `amount`, and the wallet balance.

```ts
export async function internalizeAction(wallet: Wallet, auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [Wallet](./client.md#class-wallet)

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
##### Function: isCreateActionSpecOp

```ts
export function isCreateActionSpecOp(label: string): boolean 
```

Returns

true iff the `label` name is a reserved `createAction` special operation identifier.

Argument Details

+ **label**
  + Action / Transaction label name value.

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
##### Function: isListActionsSpecOp

```ts
export function isListActionsSpecOp(label: string): boolean 
```

Returns

true iff the `label` name is a reserved `listActions` special operation identifier.

Argument Details

+ **label**
  + Action / Transaction label name value.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: isListOutputsSpecOp

```ts
export function isListOutputsSpecOp(basket: string): boolean 
```

Returns

true iff the `basket` name is a reserved `listOutputs` special operation identifier.

Argument Details

+ **basket**
  + Output basket name value.

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
##### Function: keyOffsetToHashedSecret

```ts
export function keyOffsetToHashedSecret(pub: PublicKey, keyOffset?: string): {
    hashedSecret: BigNumber;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: listActionsIdb

```ts
export async function listActionsIdb(storage: StorageIdb, auth: AuthId, vargs: Validation.ValidListActionsArgs): Promise<ListActionsResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageIdb](./storage.md#class-storageidb)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: listCertificates

```ts
export async function listCertificates(storage: StorageProvider, auth: AuthId, vargs: Validation.ValidListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: listOutputsIdb

```ts
export async function listOutputsIdb(storage: StorageIdb, auth: AuthId, vargs: Validation.ValidListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageIdb](./storage.md#class-storageidb)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: lockScriptWithKeyOffsetFromPubKey

```ts
export function lockScriptWithKeyOffsetFromPubKey(pubKey: string, keyOffset?: string): {
    script: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: logCreateActionArgs

```ts
export function logCreateActionArgs(args: CreateActionArgs): object 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: logWalletError

```ts
export function logWalletError(eu: unknown, logger?: WalletLoggerInterface, label?: string): void 
```

See also: [logger](./client.md#variable-logger)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: makeAtomicBeef

```ts
export function makeAtomicBeef(tx: Transaction, beef: number[] | Beef): number[] 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: makeChangeLock

Derive a change output locking script

```ts
export function makeChangeLock(out: StorageCreateTransactionSdkOutput, dctr: StorageCreateActionResult, args: Validation.ValidCreateActionArgs, changeKeys: KeyPair, wallet: Wallet): Script 
```

See also: [KeyPair](./client.md#interface-keypair), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageCreateTransactionSdkOutput](./client.md#interface-storagecreatetransactionsdkoutput), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: maxDate

```ts
export function maxDate(d1?: Date, d2?: Date): Date | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: offsetPrivKey

```ts
export function offsetPrivKey(privKey: string, keyOffset?: string): {
    offsetPrivKey: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: offsetPubKey

```ts
export function offsetPubKey(pubKey: string, keyOffset?: string): {
    offsetPubKey: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: optionalArraysEqual

```ts
export function optionalArraysEqual(arr1?: Number[], arr2?: Number[]) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: parseTxScriptOffsets

```ts
export function parseTxScriptOffsets(rawTx: number[]): TxScriptOffsets 
```

See also: [TxScriptOffsets](./client.md#interface-txscriptoffsets)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: processAction

```ts
export async function processAction(storage: StorageProvider, auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults> 
```

See also: [AuthId](./client.md#interface-authid), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: processAction

```ts
export async function processAction(prior: PendingSignAction | undefined, wallet: Wallet, auth: AuthId, vargs: Validation.ValidProcessActionArgs): Promise<StorageProcessActionResults> 
```

See also: [AuthId](./client.md#interface-authid), [PendingSignAction](./client.md#interface-pendingsignaction), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: proveCertificate

```ts
export async function proveCertificate(wallet: Wallet, auth: AuthId, vargs: Validation.ValidProveCertificateArgs): Promise<ProveCertificateResult> 
```

See also: [AuthId](./client.md#interface-authid), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: purgeDataIdb

```ts
export async function purgeDataIdb(storage: StorageIdb, params: PurgeParams, trx?: TrxToken): Promise<PurgeResults> 
```

See also: [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [StorageIdb](./storage.md#class-storageidb), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: randomBytes

```ts
export function randomBytes(count: number): number[] 
```

Returns

count cryptographically secure random bytes as array of bytes

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: randomBytesBase64

```ts
export function randomBytesBase64(count: number): string 
```

Returns

count cryptographically secure random bytes as base64 encoded string

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: randomBytesHex

```ts
export function randomBytesHex(count: number): string 
```

Returns

count cryptographically secure random bytes as hex encoded string

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
##### Function: redeemServiceCharges

```ts
export function redeemServiceCharges(privateKeyWif: string, charges: TableCommission[]): {}[] 
```

See also: [TableCommission](./storage.md#interface-tablecommission)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: reviewStatusIdb

Looks for unpropagated state:

1. set transactions to 'failed' if not already failed and provenTxReq with matching txid has status of 'invalid'.
2. sets transactions to 'completed' if provenTx with matching txid exists and current provenTxId is null.
3. sets outputs to spendable true, spentBy undefined if spentBy is a transaction with status 'failed'.

```ts
export async function reviewStatusIdb(storage: StorageIdb, args: {
    agedLimit: Date;
    trx?: sdk.TrxToken;
}): Promise<{
    log: string;
}> 
```

See also: [StorageIdb](./storage.md#class-storageidb), [TrxToken](./client.md#interface-trxtoken)

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
##### Function: setDisableDoubleSpendCheckForTest

```ts
export function setDisableDoubleSpendCheckForTest(v: boolean) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: sha256Hash

Calculate the SHA256 hash of an array of bytes

```ts
export function sha256Hash(data: number[] | Uint8Array): number[] {
    if (!Array.isArray(data)) {
        data = asArray(data);
    }
    const first = new Hash.SHA256().update(data).digest();
    return first;
}
```

See also: [asArray](./client.md#function-asarray)

Returns

sha256 hash of buffer contents.

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
##### Function: shareReqsWithWorld

Verifies that all the txids are known reqs with ready-to-share status.
Assigns a batch identifier and updates all the provenTxReqs.
If not isDelayed, triggers an initial attempt to broadcast the batch and returns the results.

```ts
export async function shareReqsWithWorld(storage: StorageProvider, userId: number, txids: string[], isDelayed: boolean, r?: GetReqsAndBeefResult, logger?: WalletLoggerInterface): Promise<{
    swr: SendWithResult[];
    ndr: ReviewActionResult[] | undefined;
}> 
```

See also: [GetReqsAndBeefResult](./storage.md#interface-getreqsandbeefresult), [ReviewActionResult](./client.md#interface-reviewactionresult), [StorageProvider](./storage.md#class-storageprovider), [logger](./client.md#variable-logger)

Argument Details

+ **r**
  + Optional. Ignores txids and allows ProvenTxReqs and merged beef to be passed in.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: signAction

```ts
export async function signAction(wallet: Wallet, auth: AuthId, args: SignActionArgs): Promise<SignActionResultX> 
```

See also: [AuthId](./client.md#interface-authid), [SignActionResultX](./client.md#interface-signactionresultx), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: stampLog

If a log is being kept, add a time stamped line.

```ts
export function stampLog(log: string | undefined | {
    log?: string;
}, lineToAdd: string): string | undefined 
```

Returns

undefined or log extended by time stamped `lineToAdd` and new line.

Argument Details

+ **log**
  + Optional time stamped log to extend, or an object with a log property to update
+ **lineToAdd**
  + Content to add to line.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: stampLogFormat

Replaces individual timestamps with delta msecs.
Looks for two network crossings and adjusts clock for clock skew if found.
Assumes log built by repeated calls to `stampLog`

```ts
export function stampLogFormat(log?: string): string 
```

Returns

reformated multi-line event log

Argument Details

+ **log**
  + Each logged event starts with ISO time stamp, space, rest of line, terminated by `\n`.

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
##### Function: throwDummyReviewActions

Throws a WERR_REVIEW_ACTIONS with a full set of properties to test data formats and propagation.

```ts
export function throwDummyReviewActions() 
```

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
##### Function: toWalletNetwork

```ts
export function toWalletNetwork(chain: Chain): WalletNetwork 
```

See also: [Chain](./client.md#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: transactionInputSize

```ts
export function transactionInputSize(scriptSize: number): number 
```

Returns

serialized byte length a transaction input

Argument Details

+ **scriptSize**
  + byte length of input script

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: transactionOutputSize

```ts
export function transactionOutputSize(scriptSize: number): number 
```

Returns

serialized byte length a transaction output

Argument Details

+ **scriptSize**
  + byte length of output script

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: transactionSize

Compute the serialized binary transaction size in bytes
given the number of inputs and outputs,
and the size of each script.

```ts
export function transactionSize(inputs: number[], outputs: number[]): number 
```

Returns

total transaction size in bytes

Argument Details

+ **inputs**
  + array of input script lengths, in bytes
+ **outputs**
  + array of output script lengths, in bytes

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
##### Function: validateGenerateChangeSdkParams

```ts
export function validateGenerateChangeSdkParams(params: GenerateChangeSdkParams): ValidateGenerateChangeSdkParamsResult 
```

See also: [GenerateChangeSdkParams](./storage.md#interface-generatechangesdkparams), [ValidateGenerateChangeSdkParamsResult](./storage.md#interface-validategeneratechangesdkparamsresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateGenerateChangeSdkResult

```ts
export function validateGenerateChangeSdkResult(params: GenerateChangeSdkParams, r: GenerateChangeSdkResult): {
    ok: boolean;
    log: string;
} 
```

See also: [GenerateChangeSdkParams](./storage.md#interface-generatechangesdkparams), [GenerateChangeSdkResult](./storage.md#interface-generatechangesdkresult)

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
##### Function: validateSecondsSinceEpoch

```ts
export function validateSecondsSinceEpoch(time: number): Date 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateStorageFeeModel

```ts
export function validateStorageFeeModel(v?: StorageFeeModel): StorageFeeModel 
```

See also: [StorageFeeModel](./client.md#interface-storagefeemodel)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: varUintSize

Returns the byte size required to encode number as Bitcoin VarUint

```ts
export function varUintSize(val: number): 1 | 3 | 5 | 9 {
    if (val < 0)
        throw new WERR_INVALID_PARAMETER("varUint", "non-negative");
    return val <= 252 ? 1 : val <= 65535 ? 3 : val <= 4294967295 ? 5 : 9;
}
```

See also: [WERR_INVALID_PARAMETER](./client.md#class-werr_invalid_parameter)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyHexString

Helper function.

Verifies that a hex string is trimmed and lower case.

```ts
export function verifyHexString(v: string): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyId

Helper function.

Verifies that a database record identifier is an integer greater than zero.

```ts
export function verifyId(id: number | undefined | null): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyInteger

Helper function.

Verifies that an optional or null number has a numeric value.

```ts
export function verifyInteger(v: number | null | undefined): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyNumber

Helper function.

Verifies that an optional or null number has a numeric value.

```ts
export function verifyNumber(v: number | null | undefined): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyOne

Helper function.

```ts
export function verifyOne<T>(results: T[], errorDescrition?: string): T 
```

Returns

results[0].

Throws

WERR_BAD_REQUEST if results has length other than one.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyOneOrNone

Helper function.

```ts
export function verifyOneOrNone<T>(results: T[]): T | undefined 
```

Returns

results[0] or undefined if length is zero.

Throws

WERR_BAD_REQUEST if results has length greater than one.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyOptionalHexString

Helper function.

Verifies that an optional or null hex string is undefined or a trimmed lowercase string.

```ts
export function verifyOptionalHexString(v?: string | null): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyTruthy

Helper function.

Verifies that a possibly optional value has a value.

```ts
export function verifyTruthy<T>(v: T | null | undefined, description?: string): T 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: verifyUnlockScripts

```ts
export function verifyUnlockScripts(txid: string, beef: Beef): void 
```

Argument Details

+ **txid**
  + The TXID of a transaction in the beef for which all unlocking scripts must be valid.
+ **beef**
  + Must contain transactions for txid and all its inputs.

Throws

WERR_INVALID_PARAMETER if any unlocking script is invalid, if sourceTXID is invalid, if beef doesn't contain required transactions.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: wait

Returns an await'able Promise that resolves in the given number of msecs.

```ts
export function wait(msecs: number): Promise<void> {
    const MIN_WAIT = 0;
    const MAX_WAIT = 2 * 60 * 1000;
    if (typeof msecs !== "number" || !Number.isFinite(msecs) || isNaN(msecs) || msecs < MIN_WAIT || msecs > MAX_WAIT) {
        throw new WERR_INVALID_PARAMETER("msecs", `a number between ${MIN_WAIT} and ${MAX_WAIT} msecs, not ${msecs}.`);
    }
    return new Promise(resolve => setTimeout(resolve, msecs));
}
```

See also: [WERR_INVALID_PARAMETER](./client.md#class-werr_invalid_parameter)

Argument Details

+ **msecs**
  + number of milliseconds to wait before resolving the promise.
Must be greater than zero and less than 2 minutes (120,000 msecs)

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

| | | |
| --- | --- | --- |
| [Chain](#type-chain) | [GetUtxoStatusService](#type-getutxostatusservice) | [ReqHistoryNote](#type-reqhistorynote) |
| [CounterpartyPermissionEventHandler](#type-counterpartypermissioneventhandler) | [GroupedPermissionEventHandler](#type-groupedpermissioneventhandler) | [ReviewActionResultStatus](#type-reviewactionresultstatus) |
| [DBType](#type-dbtype) | [HeaderListener](#type-headerlistener) | [ScriptHashFormat](#type-scripthashformat) |
| [EnqueueHandler](#type-enqueuehandler) | [InsertHeaderResult](#type-insertheaderresult) | [ServicesCallHistory](#type-servicescallhistory) |
| [EntityStorage](#type-entitystorage) | [MonitorStorage](#type-monitorstorage) | [StopListenerToken](#type-stoplistenertoken) |
| [ErrorHandler](#type-errorhandler) | [PermissionEventHandler](#type-permissioneventhandler) | [StorageProvidedBy](#type-storageprovidedby) |
| [GetMerklePathService](#type-getmerklepathservice) | [PostBeefService](#type-postbeefservice) | [SyncProtocolVersion](#type-syncprotocolversion) |
| [GetRawTxService](#type-getrawtxservice) | [PostReqsToNetworkDetailsStatus](#type-postreqstonetworkdetailsstatus) | [SyncStatus](#type-syncstatus) |
| [GetScriptHashHistoryService](#type-getscripthashhistoryservice) | [PostTxsService](#type-posttxsservice) | [TransactionStatus](#type-transactionstatus) |
| [GetStatusForTxidsService](#type-getstatusfortxidsservice) | [ProvenTxReqStatus](#type-proventxreqstatus) | [UpdateFiatExchangeRateService](#type-updatefiatexchangerateservice) |
| [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat) | [ReorgListener](#type-reorglistener) | [WalletLoggerLevel](#type-walletloggerlevel) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Type: Chain

```ts
export type Chain = "main" | "test"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: CounterpartyPermissionEventHandler

```ts
export type CounterpartyPermissionEventHandler = (request: CounterpartyPermissionRequest) => void | Promise<void>
```

See also: [CounterpartyPermissionRequest](./client.md#interface-counterpartypermissionrequest)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: DBType

```ts
export type DBType = "SQLite" | "MySQL" | "IndexedDB"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: EnqueueHandler

```ts
export type EnqueueHandler = (header: BlockHeader) => void
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: EntityStorage

```ts
export type EntityStorage = StorageProvider
```

See also: [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ErrorHandler

return true to ignore error, false to close service connection

```ts
export type ErrorHandler = (code: number, message: string) => boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GetMerklePathService

```ts
export type GetMerklePathService = (txid: string, services: WalletServices) => Promise<GetMerklePathResult>
```

See also: [GetMerklePathResult](./client.md#interface-getmerklepathresult), [WalletServices](./client.md#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GetRawTxService

```ts
export type GetRawTxService = (txid: string, chain: Chain) => Promise<GetRawTxResult>
```

See also: [Chain](./client.md#type-chain), [GetRawTxResult](./client.md#interface-getrawtxresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GetScriptHashHistoryService

```ts
export type GetScriptHashHistoryService = (hash: string) => Promise<GetScriptHashHistoryResult>
```

See also: [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GetStatusForTxidsService

```ts
export type GetStatusForTxidsService = (txids: string[]) => Promise<GetStatusForTxidsResult>
```

See also: [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GetUtxoStatusOutputFormat

```ts
export type GetUtxoStatusOutputFormat = "hashLE" | "hashBE" | "script"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GetUtxoStatusService

```ts
export type GetUtxoStatusService = (output: string, outputFormat?: GetUtxoStatusOutputFormat, outpoint?: string) => Promise<GetUtxoStatusResult>
```

See also: [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: GroupedPermissionEventHandler

Signature for functions that handle a grouped permission request event.

```ts
export type GroupedPermissionEventHandler = (request: GroupedPermissionRequest) => void | Promise<void>
```

See also: [GroupedPermissionRequest](./client.md#interface-groupedpermissionrequest)

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
##### Type: MonitorStorage

```ts
export type MonitorStorage = WalletStorageManager
```

See also: [WalletStorageManager](./storage.md#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: PermissionEventHandler

Signature for functions that handle a permission request event, e.g. "Please ask the user to allow basket X".

```ts
export type PermissionEventHandler = (request: PermissionRequest & {
    requestID: string;
}) => void | Promise<void>
```

See also: [PermissionRequest](./client.md#interface-permissionrequest)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: PostBeefService

```ts
export type PostBeefService = (beef: Beef, txids: string[]) => Promise<PostBeefResult>
```

See also: [PostBeefResult](./client.md#interface-postbeefresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: PostReqsToNetworkDetailsStatus

Indicates status of a new Action following a `createAction` or `signAction` in immediate mode:
When `acceptDelayedBroadcast` is falses.

'success': The action has been broadcast and accepted by the bitcoin processing network.
'doulbeSpend': The action has been confirmed to double spend one or more inputs, and by the "first-seen-rule" is the loosing transaction.
'invalidTx': The action was rejected by the processing network as an invalid bitcoin transaction.
'serviceError': The broadcast services are currently unable to reach the bitcoin network. The action is now queued for delayed retries.

'invalid': The action was in an invalid state for processing, this status should never be seen by user code.
'unknown': An internal processing error has occured, this status should never be seen by user code.

```ts
export type PostReqsToNetworkDetailsStatus = "success" | "doubleSpend" | "unknown" | "invalid" | "serviceError" | "invalidTx"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: PostTxsService

```ts
export type PostTxsService = (beef: Beef, txids: string[], services: WalletServices) => Promise<PostTxsResult>
```

See also: [PostTxsResult](./client.md#interface-posttxsresult), [WalletServices](./client.md#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ProvenTxReqStatus

Initial status (attempts === 0):

nosend: transaction was marked 'noSend'. It is complete and signed. It may be sent by an external party. Proof should be sought as if 'unmined'. No error if it remains unknown by network.

unprocessed: indicates req is about to be posted to network by non-acceptDelayedBroadcast application code, after posting status is normally advanced to 'sending'

unsent: rawTx has not yet been sent to the network for processing. req is queued for delayed processing.

sending: At least one attempt to send rawTx to transaction processors has occured without confirmation of acceptance.

unknown: rawTx status is unknown but is believed to have been previously sent to the network.

Attempts > 0 status, processing:

unknown: Last status update received did not recognize txid or wasn't understood.

nonfinal: rawTx has an un-expired nLockTime and is eligible for continuous updating by new transactions with additional outputs and incrementing sequence numbers.

unmined: Last attempt has txid waiting to be mined, possibly just sent without callback

callback: Waiting for proof confirmation callback from transaction processor.

unconfirmed: Potential proof has not been confirmed by chaintracks

Terminal status:

doubleSpend: Transaction spends same input as another transaction.

invalid: rawTx is structuraly invalid or was rejected by the network. Will never be re-attempted or completed.

completed: proven_txs record added, and notifications are complete.

unfail: asigned to force review of a currently invalid ProvenTxReq.

```ts
export type ProvenTxReqStatus = "sending" | "unsent" | "nosend" | "unknown" | "nonfinal" | "unprocessed" | "unmined" | "callback" | "unconfirmed" | "completed" | "invalid" | "doubleSpend" | "unfail"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ReorgListener

```ts
export type ReorgListener = (depth: number, oldTip: BlockHeader, newTip: BlockHeader, deactivatedHeaders?: BlockHeader[]) => void
```

See also: [BlockHeader](./client.md#interface-blockheader)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ReqHistoryNote

```ts
export type ReqHistoryNote = {
    when?: string;
    what: string;
    [key: string]: boolean | string | number | undefined;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ReviewActionResultStatus

Indicates status of a new Action following a `createAction` or `signAction` in immediate mode:
When `acceptDelayedBroadcast` is falses.

'success': The action has been broadcast and accepted by the bitcoin processing network.
'doulbeSpend': The action has been confirmed to double spend one or more inputs, and by the "first-seen-rule" is the loosing transaction.
'invalidTx': The action was rejected by the processing network as an invalid bitcoin transaction.
'serviceError': The broadcast services are currently unable to reach the bitcoin network. The action is now queued for delayed retries.

```ts
export type ReviewActionResultStatus = "success" | "doubleSpend" | "serviceError" | "invalidTx"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ScriptHashFormat

```ts
export type ScriptHashFormat = "hashLE" | "hashBE" | "script"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: ServicesCallHistory

Type for the service call history returned by Services.getServicesCallHistory.

```ts
export type ServicesCallHistory = {
    version: number;
    getMerklePath: ServiceCallHistory;
    getRawTx: ServiceCallHistory;
    postBeef: ServiceCallHistory;
    getUtxoStatus: ServiceCallHistory;
    getStatusForTxids: ServiceCallHistory;
    getScriptHashHistory: ServiceCallHistory;
    updateFiatExchangeRates: ServiceCallHistory;
}
```

See also: [ServiceCallHistory](./client.md#interface-servicecallhistory)

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
##### Type: StorageProvidedBy

```ts
export type StorageProvidedBy = "you" | "storage" | "you-and-storage"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: SyncProtocolVersion

```ts
export type SyncProtocolVersion = "0.1.0"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: SyncStatus

success: Last sync of this user from this storage was successful.

error: Last sync protocol operation for this user to this storage threw and error.

identified: Configured sync storage has been identified but not sync'ed.

unknown: Sync protocol state is unknown.

```ts
export type SyncStatus = "success" | "error" | "identified" | "updated" | "unknown"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: TransactionStatus

```ts
export type TransactionStatus = "completed" | "failed" | "unprocessed" | "sending" | "unproven" | "unsigned" | "nosend" | "nonfinal" | "unfail"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: UpdateFiatExchangeRateService

```ts
export type UpdateFiatExchangeRateService = (targetCurrencies: string[], options: WalletServicesOptions) => Promise<FiatExchangeRates>
```

See also: [FiatExchangeRates](./client.md#interface-fiatexchangerates), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: WalletLoggerLevel

Optional. Logging levels that may influence what is logged.

'error' Only requests resulting in an exception should be logged.
'warn' Also log requests that succeed but with an abnormal condition.
'info' Also log normal successful requests.
'debug' Add input parm and result details where possible.
'trace' Instead of adding debug details, focus on execution path and timing.

```ts
export type WalletLoggerLevel = "error" | "warn" | "info" | "debug" | "trace"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Variables

| | | |
| --- | --- | --- |
| [DEFAULT_PROFILE_ID](#variable-default_profile_id) | [getBasketToSpecOp](#variable-getbaskettospecop) | [specOpNoSendActions](#variable-specopnosendactions) |
| [DEFAULT_SETTINGS](#variable-default_settings) | [getLabelToSpecOp](#variable-getlabeltospecop) | [specOpSetWalletChangeParams](#variable-specopsetwalletchangeparams) |
| [PBKDF2_NUM_ROUNDS](#variable-pbkdf2_num_rounds) | [logger](#variable-logger) | [specOpThrowReviewActions](#variable-specopthrowreviewactions) |
| [ProvenTxReqNonTerminalStatus](#variable-proventxreqnonterminalstatus) | [maxPossibleSatoshis](#variable-maxpossiblesatoshis) | [specOpWalletBalance](#variable-specopwalletbalance) |
| [ProvenTxReqTerminalStatus](#variable-proventxreqterminalstatus) | [outputColumnsWithoutLockingScript](#variable-outputcolumnswithoutlockingscript) | [transactionColumnsWithoutRawTx](#variable-transactioncolumnswithoutrawtx) |
| [TESTNET_DEFAULT_SETTINGS](#variable-testnet_default_settings) | [parseResults](#variable-parseresults) | [transformVerifiableCertificatesWithTrust](#variable-transformverifiablecertificateswithtrust) |
| [aggregateActionResults](#variable-aggregateactionresults) | [queryOverlay](#variable-queryoverlay) | [validBulkHeaderFiles](#variable-validbulkheaderfiles) |
| [brc29ProtocolID](#variable-brc29protocolid) | [specOpFailedActions](#variable-specopfailedactions) |  |
| [dirtyHashes](#variable-dirtyhashes) | [specOpInvalidChange](#variable-specopinvalidchange) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Variable: DEFAULT_PROFILE_ID

```ts
DEFAULT_PROFILE_ID = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: DEFAULT_SETTINGS

```ts
DEFAULT_SETTINGS = {
    trustSettings: {
        trustLevel: 2,
        trustedCertifiers: [
            {
                name: "Metanet Trust Services",
                description: "Registry for protocols, baskets, and certificates types",
                iconUrl: "https://bsvblockchain.org/favicon.ico",
                identityKey: "03daf815fe38f83da0ad83b5bedc520aa488aef5cbc93a93c67a7fe60406cbffe8",
                trust: 4
            },
            {
                name: "SocialCert",
                description: "Certifies social media handles, phone numbers and emails",
                iconUrl: "https://socialcert.net/favicon.ico",
                trust: 3,
                identityKey: "02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17"
            }
        ]
    },
    theme: { mode: "dark" },
    permissionMode: "simple"
} as WalletSettings
```

See also: [WalletSettings](./client.md#interface-walletsettings)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: PBKDF2_NUM_ROUNDS

```ts
PBKDF2_NUM_ROUNDS = 7777
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: ProvenTxReqNonTerminalStatus

```ts
ProvenTxReqNonTerminalStatus: ProvenTxReqStatus[] = [
    "sending",
    "unsent",
    "nosend",
    "unknown",
    "nonfinal",
    "unprocessed",
    "unmined",
    "callback",
    "unconfirmed"
]
```

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: ProvenTxReqTerminalStatus

```ts
ProvenTxReqTerminalStatus: ProvenTxReqStatus[] = ["completed", "invalid", "doubleSpend"]
```

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: TESTNET_DEFAULT_SETTINGS

```ts
TESTNET_DEFAULT_SETTINGS: WalletSettings = {
    ...DEFAULT_SETTINGS,
    trustSettings: {
        ...DEFAULT_SETTINGS.trustSettings,
        trustedCertifiers: DEFAULT_SETTINGS.trustSettings.trustedCertifiers.map(certifier => ({
            ...certifier,
            identityKey: TESTNET_IDENTITY_KEYS[certifier.name] || certifier.identityKey
        }))
    }
}
```

See also: [DEFAULT_SETTINGS](./client.md#variable-default_settings), [WalletSettings](./client.md#interface-walletsettings)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: aggregateActionResults

```ts
aggregateActionResults = async (storage: StorageProvider, sendWithResultReqs: SendWithResult[], postToNetworkResult: PostReqsToNetworkResult): Promise<{
    swr: SendWithResult[];
    rar: ReviewActionResult[];
}> => {
    const swr: SendWithResult[] = [];
    const rar: ReviewActionResult[] = [];
    for (const ar of sendWithResultReqs) {
        const txid = ar.txid;
        const d = postToNetworkResult.details.find(d => d.txid === txid);
        if (!d)
            throw new WERR_INTERNAL(`missing details for ${txid}`);
        const arNdr: ReviewActionResult = { txid: d.txid, status: "success", competingTxs: d.competingTxs };
        switch (d.status) {
            case "success":
                ar.status = "unproven";
                break;
            case "doubleSpend":
                ar.status = "failed";
                arNdr.status = "doubleSpend";
                if (d.competingTxs)
                    arNdr.competingBeef = await createMergedBeefOfTxids(d.competingTxs, storage);
                break;
            case "serviceError":
                ar.status = "sending";
                arNdr.status = "serviceError";
                break;
            case "invalidTx":
                ar.status = "failed";
                arNdr.status = "invalidTx";
                break;
            case "unknown":
            case "invalid":
            default:
                throw new WERR_INTERNAL(`processAction with notDelayed status ${d.status} should not occur.`);
        }
        swr.push({ txid, status: ar.status });
        rar.push(arNdr);
    }
    return { swr, rar };
}
```

See also: [PostReqsToNetworkResult](./storage.md#interface-postreqstonetworkresult), [ReviewActionResult](./client.md#interface-reviewactionresult), [StorageProvider](./storage.md#class-storageprovider), [WERR_INTERNAL](./client.md#class-werr_internal), [processAction](./storage.md#function-processaction)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: brc29ProtocolID

```ts
brc29ProtocolID: WalletProtocol = [2, "3241645161d8"]
```

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
##### Variable: getBasketToSpecOp

```ts
getBasketToSpecOp: () => Record<string, ListOutputsSpecOp> = () => {
    return {
        [specOpWalletBalance]: {
            name: "totalOutputsIsWalletBalance",
            useBasket: "default",
            ignoreLimit: true,
            resultFromOutputs: async (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]): Promise<ListOutputsResult> => {
                let totalOutputs = 0;
                for (const o of outputs)
                    totalOutputs += o.satoshis;
                return { totalOutputs, outputs: [] };
            }
        },
        [specOpInvalidChange]: {
            name: "invalidChangeOutputs",
            useBasket: "default",
            ignoreLimit: true,
            includeOutputScripts: true,
            includeSpent: false,
            tagsToIntercept: ["release", "all"],
            filterOutputs: async (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]): Promise<TableOutput[]> => {
                const filteredOutputs: TableOutput[] = [];
                const services = s.getServices();
                for (const o of outputs) {
                    if (!o.basketId)
                        continue;
                    await s.validateOutputScript(o);
                    let ok: boolean | undefined = false;
                    if (o.lockingScript && o.lockingScript.length > 0) {
                        ok = await services.isUtxo(o);
                    }
                    else {
                        ok = undefined;
                    }
                    if (ok === false) {
                        filteredOutputs.push(o);
                    }
                }
                if (specOpTags.indexOf("release") >= 0) {
                    for (const o of filteredOutputs) {
                        await s.updateOutput(o.outputId, { spendable: false });
                        o.spendable = false;
                    }
                }
                return filteredOutputs;
            }
        },
        [specOpSetWalletChangeParams]: {
            name: "setWalletChangeParams",
            tagsParamsCount: 2,
            resultFromTags: async (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListOutputsArgs, specOpTags: string[]): Promise<ListOutputsResult> => {
                if (specOpTags.length !== 2)
                    throw new WERR_INVALID_PARAMETER("numberOfDesiredUTXOs and minimumDesiredUTXOValue", "valid");
                const numberOfDesiredUTXOs: number = verifyInteger(Number(specOpTags[0]));
                const minimumDesiredUTXOValue: number = verifyInteger(Number(specOpTags[1]));
                const basket = verifyOne(await s.findOutputBaskets({
                    partial: { userId: verifyId(auth.userId), name: "default" }
                }));
                await s.updateOutputBasket(basket.basketId, {
                    numberOfDesiredUTXOs,
                    minimumDesiredUTXOValue
                });
                return { totalOutputs: 0, outputs: [] };
            }
        }
    };
}
```

See also: [AuthId](./client.md#interface-authid), [ListOutputsSpecOp](./storage.md#interface-listoutputsspecop), [StorageProvider](./storage.md#class-storageprovider), [TableOutput](./storage.md#interface-tableoutput), [WERR_INVALID_PARAMETER](./client.md#class-werr_invalid_parameter), [specOpInvalidChange](./client.md#variable-specopinvalidchange), [specOpSetWalletChangeParams](./client.md#variable-specopsetwalletchangeparams), [specOpWalletBalance](./client.md#variable-specopwalletbalance), [verifyId](./client.md#function-verifyid), [verifyInteger](./client.md#function-verifyinteger), [verifyOne](./client.md#function-verifyone)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: getLabelToSpecOp

```ts
getLabelToSpecOp: () => Record<string, ListActionsSpecOp> = () => {
    return {
        [specOpNoSendActions]: {
            name: "noSendActions",
            labelsToIntercept: ["abort"],
            setStatusFilter: () => ["nosend"],
            postProcess: async (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListActionsArgs, specOpLabels: string[], txs: Partial<TableTransaction>[]): Promise<void> => {
                if (specOpLabels.indexOf("abort") >= 0) {
                    for (const tx of txs) {
                        if (tx.status === "nosend") {
                            await s.abortAction(auth, { reference: tx.reference! });
                            tx.status = "failed";
                        }
                    }
                }
            }
        },
        [specOpFailedActions]: {
            name: "failedActions",
            labelsToIntercept: ["unfail"],
            setStatusFilter: () => ["failed"],
            postProcess: async (s: StorageProvider, auth: AuthId, vargs: Validation.ValidListActionsArgs, specOpLabels: string[], txs: Partial<TableTransaction>[]): Promise<void> => {
                if (specOpLabels.indexOf("unfail") >= 0) {
                    for (const tx of txs) {
                        if (tx.status === "failed") {
                            await s.updateTransaction(tx.transactionId!, { status: "unfail" });
                        }
                    }
                }
            }
        }
    };
}
```

See also: [AuthId](./client.md#interface-authid), [ListActionsSpecOp](./storage.md#interface-listactionsspecop), [StorageProvider](./storage.md#class-storageprovider), [TableTransaction](./storage.md#interface-tabletransaction), [specOpFailedActions](./client.md#variable-specopfailedactions), [specOpNoSendActions](./client.md#variable-specopnosendactions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: logger

```ts
logger = (message: string, ...optionalParams: any[]): void => {
    const isSingleTest = process.argv.some(arg => arg === "--testNamePattern" || arg === "-t");
    if (isSingleTest) {
        console.log(message, ...optionalParams);
    }
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: maxPossibleSatoshis

```ts
maxPossibleSatoshis = 2099999999999999
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: outputColumnsWithoutLockingScript

```ts
outputColumnsWithoutLockingScript = [
    "created_at",
    "updated_at",
    "outputId",
    "userId",
    "transactionId",
    "basketId",
    "spendable",
    "change",
    "vout",
    "satoshis",
    "providedBy",
    "purpose",
    "type",
    "outputDescription",
    "txid",
    "senderIdentityKey",
    "derivationPrefix",
    "derivationSuffix",
    "customInstructions",
    "spentBy",
    "sequenceNumber",
    "spendingDescription",
    "scriptLength",
    "scriptOffset"
]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: parseResults

```ts
parseResults = async (lookupResult: LookupAnswer): Promise<VerifiableCertificate[]> => {
    if (lookupResult.type === "output-list") {
        const parsedResults: VerifiableCertificate[] = [];
        for (const output of lookupResult.outputs) {
            try {
                const tx = Transaction.fromBEEF(output.beef);
                const decodedOutput = PushDrop.decode(tx.outputs[output.outputIndex].lockingScript);
                const certificate: VerifiableCertificate = JSON.parse(Utils.toUTF8(decodedOutput.fields[0]));
                const verifiableCert = new VerifiableCertificate(certificate.type, certificate.serialNumber, certificate.subject, certificate.certifier, certificate.revocationOutpoint, certificate.fields, certificate.keyring, certificate.signature);
                const decryptedFields = await verifiableCert.decryptFields(new ProtoWallet("anyone"));
                await verifiableCert.verify();
                verifiableCert.decryptedFields = decryptedFields;
                parsedResults.push(verifiableCert);
            }
            catch (error) {
                console.error(error);
            }
        }
        return parsedResults;
    }
    return [];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: queryOverlay

```ts
queryOverlay = async (query: unknown, resolver: LookupResolver): Promise<VerifiableCertificate[]> => {
    const results = await resolver.query({
        service: "ls_identity",
        query
    });
    return await parseResults(results);
}
```

See also: [parseResults](./client.md#variable-parseresults)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: specOpFailedActions

```ts
specOpFailedActions = "97d4eb1e49215e3374cc2c1939a7c43a55e95c7427bf2d45ed63e3b4e0c88153"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: specOpInvalidChange

```ts
specOpInvalidChange = "5a76fd430a311f8bc0553859061710a4475c19fed46e2ff95969aa918e612e57"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: specOpNoSendActions

```ts
specOpNoSendActions = "ac6b20a3bb320adafecd637b25c84b792ad828d3aa510d05dc841481f664277d"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: specOpSetWalletChangeParams

```ts
specOpSetWalletChangeParams = "a4979d28ced8581e9c1c92f1001cc7cb3aabf8ea32e10888ad898f0a509a3929"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: specOpThrowReviewActions

```ts
specOpThrowReviewActions = "a496e747fc3ad5fabdd4ae8f91184e71f87539bd3d962aa2548942faaaf0047a"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: specOpWalletBalance

```ts
specOpWalletBalance = "893b7646de0e1c9f741bd6e9169b76a8847ae34adef7bef1e6a285371206d2e8"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: transactionColumnsWithoutRawTx

```ts
transactionColumnsWithoutRawTx = [
    "created_at",
    "updated_at",
    "transactionId",
    "userId",
    "provenTxId",
    "status",
    "reference",
    "isOutgoing",
    "satoshis",
    "version",
    "lockTime",
    "description",
    "txid"
]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: transformVerifiableCertificatesWithTrust

```ts
transformVerifiableCertificatesWithTrust = (trustSettings: TrustSettings, certificates: VerifiableCertificate[]): DiscoverCertificatesResult => {
    const identityGroups: Record<string, IdentityGroup> = {};
    const certifierCache: Record<string, Certifier> = {};
    certificates.forEach(cert => {
        const { subject, certifier } = cert;
        if (!subject || !certifier)
            return;
        if (!certifierCache[certifier]) {
            const found = trustSettings.trustedCertifiers.find(x => x.identityKey === certifier);
            if (!found)
                return;
            certifierCache[certifier] = found;
        }
        const certifierInfo: IdentityCertifier = {
            name: certifierCache[certifier].name,
            iconUrl: certifierCache[certifier].iconUrl || "",
            description: certifierCache[certifier].description,
            trust: certifierCache[certifier].trust
        };
        const extendedCert: IdentityCertificate = {
            ...cert,
            signature: cert.signature!,
            decryptedFields: cert.decryptedFields as Record<string, string>,
            publiclyRevealedKeyring: cert.keyring,
            certifierInfo
        };
        if (!identityGroups[subject]) {
            identityGroups[subject] = { totalTrust: 0, members: [] };
        }
        identityGroups[subject].totalTrust += certifierInfo.trust;
        identityGroups[subject].members.push(extendedCert);
    });
    const finalResults: ExtendedVerifiableCertificate[] = [];
    Object.values(identityGroups).forEach(group => {
        if (group.totalTrust >= trustSettings.trustLevel) {
            finalResults.push(...group.members);
        }
    });
    finalResults.sort((a, b) => b.certifierInfo.trust - a.certifierInfo.trust);
    return {
        totalCertificates: finalResults.length,
        certificates: finalResults
    };
}
```

See also: [Certifier](./client.md#interface-certifier), [ExtendedVerifiableCertificate](./client.md#interface-extendedverifiablecertificate), [TrustSettings](./client.md#interface-trustsettings)

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