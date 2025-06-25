# CLIENT: BSV Wallet Toolbox API Documentation

The documentation is split into various pages, this page is the API of the `@bsv/wallet-toolbox-client` package;
which is the subset of the `@bsv/wallet-toolbox` that is compatible with browser deployment contexts.

[Return To Top](./README.md)

<!--#region ts2md-api-merged-here-->
### API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

#### Interfaces

| | | |
| --- | --- | --- |
| [AdminStatsResult](#interface-adminstatsresult) | [PendingSignAction](#interface-pendingsignaction) | [TableOutputBasket](#interface-tableoutputbasket) |
| [ArcConfig](#interface-arcconfig) | [PendingStorageInput](#interface-pendingstorageinput) | [TableOutputTag](#interface-tableoutputtag) |
| [ArcMinerGetTxData](#interface-arcminergettxdata) | [PermissionRequest](#interface-permissionrequest) | [TableOutputTagMap](#interface-tableoutputtagmap) |
| [AuthId](#interface-authid) | [PermissionToken](#interface-permissiontoken) | [TableOutputX](#interface-tableoutputx) |
| [AuthPayload](#interface-authpayload) | [PermissionsManagerConfig](#interface-permissionsmanagerconfig) | [TableProvenTx](#interface-tableproventx) |
| [BaseBlockHeader](#interface-baseblockheader) | [PostBeefResult](#interface-postbeefresult) | [TableProvenTxReq](#interface-tableproventxreq) |
| [BaseBlockHeader](#interface-baseblockheader) | [PostBeefResultForTxidApi](#interface-postbeefresultfortxidapi) | [TableProvenTxReqDynamics](#interface-tableproventxreqdynamics) |
| [BitailsConfig](#interface-bitailsconfig) | [PostReqsToNetworkDetails](#interface-postreqstonetworkdetails) | [TableSettings](#interface-tablesettings) |
| [BitailsMerkleProof](#interface-bitailsmerkleproof) | [PostReqsToNetworkResult](#interface-postreqstonetworkresult) | [TableSyncState](#interface-tablesyncstate) |
| [BlockHeader](#interface-blockheader) | [PostTxResultForTxid](#interface-posttxresultfortxid) | [TableTransaction](#interface-tabletransaction) |
| [BlockHeader](#interface-blockheader) | [PostTxResultForTxidError](#interface-posttxresultfortxiderror) | [TableTxLabel](#interface-tabletxlabel) |
| [BsvExchangeRate](#interface-bsvexchangerate) | [PostTxsResult](#interface-posttxsresult) | [TableTxLabelMap](#interface-tabletxlabelmap) |
| [CertOpsWallet](#interface-certopswallet) | [ProcessSyncChunkResult](#interface-processsyncchunkresult) | [TableUser](#interface-tableuser) |
| [Certifier](#interface-certifier) | [Profile](#interface-profile) | [TaskPurgeParams](#interface-taskpurgeparams) |
| [CommitNewTxResults](#interface-commitnewtxresults) | [ProvenOrRawTx](#interface-provenorrawtx) | [TrustSettings](#interface-trustsettings) |
| [CompleteAuthResponse](#interface-completeauthresponse) | [ProvenTxFromTxidResult](#interface-proventxfromtxidresult) | [TrxToken](#interface-trxtoken) |
| [CreateActionResultX](#interface-createactionresultx) | [ProvenTxReqHistory](#interface-proventxreqhistory) | [TscMerkleProofApi](#interface-tscmerkleproofapi) |
| [EntitySyncMap](#interface-entitysyncmap) | [ProvenTxReqHistorySummaryApi](#interface-proventxreqhistorysummaryapi) | [TxScriptOffsets](#interface-txscriptoffsets) |
| [EntityTimeStamp](#interface-entitytimestamp) | [ProvenTxReqNotify](#interface-proventxreqnotify) | [UMPToken](#interface-umptoken) |
| [ExchangeRatesIoApi](#interface-exchangeratesioapi) | [ProviderCallHistory](#interface-providercallhistory) | [UMPTokenInteractor](#interface-umptokeninteractor) |
| [ExtendedVerifiableCertificate](#interface-extendedverifiablecertificate) | [PurgeParams](#interface-purgeparams) | [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs) |
| [FiatExchangeRates](#interface-fiatexchangerates) | [PurgeResults](#interface-purgeresults) | [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult) |
| [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs) | [RequestSyncChunkArgs](#interface-requestsyncchunkargs) | [ValidAbortActionArgs](#interface-validabortactionargs) |
| [FindCertificatesArgs](#interface-findcertificatesargs) | [ReviewActionResult](#interface-reviewactionresult) | [ValidAcquireCertificateArgs](#interface-validacquirecertificateargs) |
| [FindCommissionsArgs](#interface-findcommissionsargs) | [ScriptTemplateParamsBRC29](#interface-scripttemplateparamsbrc29) | [ValidAcquireDirectCertificateArgs](#interface-validacquiredirectcertificateargs) |
| [FindForUserSincePagedArgs](#interface-findforusersincepagedargs) | [ScriptTemplateUnlock](#interface-scripttemplateunlock) | [ValidAcquireIssuanceCertificateArgs](#interface-validacquireissuancecertificateargs) |
| [FindMonitorEventsArgs](#interface-findmonitoreventsargs) | [ServiceCall](#interface-servicecall) | [ValidBasketInsertion](#interface-validbasketinsertion) |
| [FindOutputBasketsArgs](#interface-findoutputbasketsargs) | [ServiceCall](#interface-servicecall) | [ValidCreateActionArgs](#interface-validcreateactionargs) |
| [FindOutputTagMapsArgs](#interface-findoutputtagmapsargs) | [ServiceCallHistory](#interface-servicecallhistory) | [ValidCreateActionInput](#interface-validcreateactioninput) |
| [FindOutputTagsArgs](#interface-findoutputtagsargs) | [ServiceCallHistoryCounts](#interface-servicecallhistorycounts) | [ValidCreateActionOptions](#interface-validcreateactionoptions) |
| [FindOutputsArgs](#interface-findoutputsargs) | [ServiceToCall](#interface-servicetocall) | [ValidCreateActionOutput](#interface-validcreateactionoutput) |
| [FindPartialSincePagedArgs](#interface-findpartialsincepagedargs) | [SetupClientWalletArgs](#interface-setupclientwalletargs) | [ValidDiscoverByAttributesArgs](#interface-validdiscoverbyattributesargs) |
| [FindProvenTxReqsArgs](#interface-findproventxreqsargs) | [SetupClientWalletClientArgs](#interface-setupclientwalletclientargs) | [ValidDiscoverByIdentityKeyArgs](#interface-validdiscoverbyidentitykeyargs) |
| [FindProvenTxsArgs](#interface-findproventxsargs) | [SetupWallet](#interface-setupwallet) | [ValidInternalizeActionArgs](#interface-validinternalizeactionargs) |
| [FindSincePagedArgs](#interface-findsincepagedargs) | [SetupWalletClient](#interface-setupwalletclient) | [ValidInternalizeOutput](#interface-validinternalizeoutput) |
| [FindSyncStatesArgs](#interface-findsyncstatesargs) | [SetupWalletIdb](#interface-setupwalletidb) | [ValidListActionsArgs](#interface-validlistactionsargs) |
| [FindTransactionsArgs](#interface-findtransactionsargs) | [SetupWalletIdbArgs](#interface-setupwalletidbargs) | [ValidListCertificatesArgs](#interface-validlistcertificatesargs) |
| [FindTxLabelMapsArgs](#interface-findtxlabelmapsargs) | [SignActionResultX](#interface-signactionresultx) | [ValidListOutputsArgs](#interface-validlistoutputsargs) |
| [FindTxLabelsArgs](#interface-findtxlabelsargs) | [StartAuthResponse](#interface-startauthresponse) | [ValidProcessActionArgs](#interface-validprocessactionargs) |
| [FindUsersArgs](#interface-findusersargs) | [StatusForTxidResult](#interface-statusfortxidresult) | [ValidProcessActionOptions](#interface-validprocessactionoptions) |
| [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput) | [StorageAdminStats](#interface-storageadminstats) | [ValidProveCertificateArgs](#interface-validprovecertificateargs) |
| [GenerateChangeSdkChangeOutput](#interface-generatechangesdkchangeoutput) | [StorageCreateActionResult](#interface-storagecreateactionresult) | [ValidRelinquishCertificateArgs](#interface-validrelinquishcertificateargs) |
| [GenerateChangeSdkInput](#interface-generatechangesdkinput) | [StorageCreateTransactionSdkInput](#interface-storagecreatetransactionsdkinput) | [ValidRelinquishOutputArgs](#interface-validrelinquishoutputargs) |
| [GenerateChangeSdkOutput](#interface-generatechangesdkoutput) | [StorageCreateTransactionSdkOutput](#interface-storagecreatetransactionsdkoutput) | [ValidSignActionArgs](#interface-validsignactionargs) |
| [GenerateChangeSdkParams](#interface-generatechangesdkparams) | [StorageFeeModel](#interface-storagefeemodel) | [ValidSignActionOptions](#interface-validsignactionoptions) |
| [GenerateChangeSdkResult](#interface-generatechangesdkresult) | [StorageGetBeefOptions](#interface-storagegetbeefoptions) | [ValidWalletPayment](#interface-validwalletpayment) |
| [GenerateChangeSdkStorageChange](#interface-generatechangesdkstoragechange) | [StorageIdbOptions](#interface-storageidboptions) | [ValidWalletSignerArgs](#interface-validwalletsignerargs) |
| [GetMerklePathResult](#interface-getmerklepathresult) | [StorageIdbSchema](#interface-storageidbschema) | [ValidateGenerateChangeSdkParamsResult](#interface-validategeneratechangesdkparamsresult) |
| [GetRawTxResult](#interface-getrawtxresult) | [StorageIdentity](#interface-storageidentity) | [WalletArgs](#interface-walletargs) |
| [GetReqsAndBeefDetail](#interface-getreqsandbeefdetail) | [StorageInternalizeActionResult](#interface-storageinternalizeactionresult) | [WalletBalance](#interface-walletbalance) |
| [GetReqsAndBeefResult](#interface-getreqsandbeefresult) | [StorageProcessActionArgs](#interface-storageprocessactionargs) | [WalletPermissionsManagerCallbacks](#interface-walletpermissionsmanagercallbacks) |
| [GetScriptHashHistory](#interface-getscripthashhistory) | [StorageProcessActionResults](#interface-storageprocessactionresults) | [WalletServices](#interface-walletservices) |
| [GetScriptHashHistoryResult](#interface-getscripthashhistoryresult) | [StorageProvenOrReq](#interface-storageprovenorreq) | [WalletServicesOptions](#interface-walletservicesoptions) |
| [GetStatusForTxidsResult](#interface-getstatusfortxidsresult) | [StorageProviderOptions](#interface-storageprovideroptions) | [WalletSettings](#interface-walletsettings) |
| [GetUtxoStatusDetails](#interface-getutxostatusdetails) | [StorageReaderOptions](#interface-storagereaderoptions) | [WalletSettingsManagerConfig](#interface-walletsettingsmanagerconfig) |
| [GetUtxoStatusResult](#interface-getutxostatusresult) | [StorageReaderWriterOptions](#interface-storagereaderwriteroptions) | [WalletSigner](#interface-walletsigner) |
| [GroupedPermissionRequest](#interface-groupedpermissionrequest) | [StorageSyncReaderOptions](#interface-storagesyncreaderoptions) | [WalletStorage](#interface-walletstorage) |
| [GroupedPermissions](#interface-groupedpermissions) | [SyncChunk](#interface-syncchunk) | [WalletStorageInfo](#interface-walletstorageinfo) |
| [KeyPair](#interface-keypair) | [SyncError](#interface-syncerror) | [WalletStorageProvider](#interface-walletstorageprovider) |
| [KeyPairAddress](#interface-keypairaddress) | [SyncMap](#interface-syncmap) | [WalletStorageReader](#interface-walletstoragereader) |
| [ListActionsSpecOp](#interface-listactionsspecop) | [TableCertificate](#interface-tablecertificate) | [WalletStorageSync](#interface-walletstoragesync) |
| [ListOutputsSpecOp](#interface-listoutputsspecop) | [TableCertificateField](#interface-tablecertificatefield) | [WalletStorageSyncReader](#interface-walletstoragesyncreader) |
| [LiveBlockHeader](#interface-liveblockheader) | [TableCertificateX](#interface-tablecertificatex) | [WalletStorageWriter](#interface-walletstoragewriter) |
| [MonitorOptions](#interface-monitoroptions) | [TableCommission](#interface-tablecommission) | [WalletTheme](#interface-wallettheme) |
| [OutPoint](#interface-outpoint) | [TableMonitorEvent](#interface-tablemonitorevent) | [XValidCreateActionOutput](#interface-xvalidcreateactionoutput) |
| [Paged](#interface-paged) | [TableOutput](#interface-tableoutput) |  |

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
    feeModel: sdk.StorageFeeModel;
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

See also: [BlockHeader](./services.md#interface-blockheader), [ReqHistoryNote](./client.md#type-reqhistorynote), [WalletError](./client.md#class-walleterror)

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
    setStatusFilter?: () => sdk.TransactionStatus[];
    postProcess?: (s: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs, specOpLabels: string[], txs: Partial<TableTransaction>[]) => Promise<void>;
}
```

See also: [AuthId](./client.md#interface-authid), [StorageProvider](./storage.md#class-storageprovider), [TableTransaction](./storage.md#interface-tabletransaction), [TransactionStatus](./client.md#type-transactionstatus), [ValidListActionsArgs](./client.md#interface-validlistactionsargs)

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
    resultFromTags?: (s: StorageProvider, auth: sdk.AuthId, vargs: ValidListOutputsArgs, specOpTags: string[]) => Promise<ListOutputsResult>;
    resultFromOutputs?: (s: StorageProvider, auth: sdk.AuthId, vargs: ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]) => Promise<ListOutputsResult>;
    filterOutputs?: (s: StorageProvider, auth: sdk.AuthId, vargs: ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]) => Promise<TableOutput[]>;
    tagsToIntercept?: string[];
    tagsParamsCount?: number;
}
```

See also: [AuthId](./client.md#interface-authid), [StorageProvider](./storage.md#class-storageprovider), [TableOutput](./storage.md#interface-tableoutput), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs)

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
##### Interface: MonitorOptions

```ts
export interface MonitorOptions {
    chain: sdk.Chain;
    services: Services;
    storage: MonitorStorage;
    chaintracks: ChaintracksServiceClient;
    msecsWaitPerMerkleProofServiceReq: number;
    taskRunWaitMsecs: number;
    abandonedMsecs: number;
    unprovenAttemptsLimitTest: number;
    unprovenAttemptsLimitMain: number;
}
```

See also: [Chain](./client.md#type-chain), [MonitorStorage](./monitor.md#type-monitorstorage), [Services](./services.md#class-services)

###### Property msecsWaitPerMerkleProofServiceReq

How many msecs to wait after each getMerkleProof service request.

```ts
msecsWaitPerMerkleProofServiceReq: number
```

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
    dcr: sdk.StorageCreateActionResult;
    args: sdk.ValidCreateActionArgs;
    tx: BsvTransaction;
    amount: number;
    pdi: PendingStorageInput[];
}
```

See also: [PendingStorageInput](./client.md#interface-pendingstorageinput), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs)

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

See also: [PostTxResultForTxidError](./client.md#interface-posttxresultfortxiderror), [ReqHistoryNote](./client.md#type-reqhistorynote)

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
    notes?: sdk.ReqHistoryNote[];
}
```

See also: [ReqHistoryNote](./client.md#type-reqhistorynote)

###### Property notes

Keys are Date().toISOString()
Values are a description of what happened.

```ts
notes?: sdk.ReqHistoryNote[]
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
    chain: sdk.Chain;
    rootKeyHex: string;
    privilegedKeyGetter?: () => Promise<PrivateKey>;
    active?: sdk.WalletStorageProvider;
    backups?: sdk.WalletStorageProvider[];
    taalApiKey?: string;
}
```

See also: [Chain](./client.md#type-chain), [WalletStorageProvider](./client.md#interface-walletstorageprovider)

###### Property active

Optional. Active wallet storage. Can be added later.

```ts
active?: sdk.WalletStorageProvider
```
See also: [WalletStorageProvider](./client.md#interface-walletstorageprovider)

###### Property backups

Optional. One or more storage providers managed as backup destinations. Can be added later.

```ts
backups?: sdk.WalletStorageProvider[]
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
    keyDeriver: KeyDeriver;
    chain: sdk.Chain;
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
chain: sdk.Chain
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
keyDeriver: KeyDeriver
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
    keyDeriver: KeyDeriver;
    chain: sdk.Chain;
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
export interface StorageCreateTransactionSdkOutput extends ValidCreateActionOutput {
    vout: number;
    providedBy: StorageProvidedBy;
    purpose?: string;
    derivationSuffix?: string;
}
```

See also: [StorageProvidedBy](./client.md#type-storageprovidedby), [ValidCreateActionOutput](./client.md#interface-validcreateactionoutput)

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
}
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
    log?: string;
}
```

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
    chain: sdk.Chain;
    feeModel: sdk.StorageFeeModel;
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

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

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

See also: [ProvenTxReqStatus](./client.md#type-proventxreqstatus)

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
##### Interface: ValidAbortActionArgs

```ts
export interface ValidAbortActionArgs extends ValidWalletSignerArgs {
    reference: Base64String;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidAcquireCertificateArgs

```ts
export interface ValidAcquireCertificateArgs extends ValidWalletSignerArgs {
    acquisitionProtocol: AcquisitionProtocol;
    type: Base64String;
    serialNumber?: Base64String;
    certifier: PubKeyHex;
    revocationOutpoint?: OutpointString;
    fields: Record<CertificateFieldNameUnder50Bytes, string>;
    signature?: HexString;
    certifierUrl?: string;
    keyringRevealer?: KeyringRevealer;
    keyringForSubject?: Record<CertificateFieldNameUnder50Bytes, Base64String>;
    privileged: boolean;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidAcquireDirectCertificateArgs

```ts
export interface ValidAcquireDirectCertificateArgs extends ValidWalletSignerArgs {
    type: Base64String;
    serialNumber: Base64String;
    certifier: PubKeyHex;
    revocationOutpoint: OutpointString;
    fields: Record<CertificateFieldNameUnder50Bytes, string>;
    signature: HexString;
    subject: PubKeyHex;
    keyringRevealer: KeyringRevealer;
    keyringForSubject: Record<CertificateFieldNameUnder50Bytes, Base64String>;
    privileged: boolean;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

###### Property subject

validated to an empty string, must be provided by wallet and must
match expectations of keyringForSubject

```ts
subject: PubKeyHex
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidAcquireIssuanceCertificateArgs

```ts
export interface ValidAcquireIssuanceCertificateArgs extends ValidWalletSignerArgs {
    type: Base64String;
    certifier: PubKeyHex;
    certifierUrl: string;
    fields: Record<CertificateFieldNameUnder50Bytes, string>;
    subject: PubKeyHex;
    privileged: boolean;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

###### Property subject

validated to an empty string, must be provided by wallet and must
match expectations of keyringForSubject

```ts
subject: PubKeyHex
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidBasketInsertion

```ts
export interface ValidBasketInsertion {
    basket: BasketStringUnder300Bytes;
    customInstructions?: string;
    tags: BasketStringUnder300Bytes[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidCreateActionArgs

```ts
export interface ValidCreateActionArgs extends ValidProcessActionArgs {
    description: DescriptionString5to2000Bytes;
    inputBEEF?: BEEF;
    inputs: sdk.ValidCreateActionInput[];
    outputs: sdk.ValidCreateActionOutput[];
    lockTime: number;
    version: number;
    labels: string[];
    options: ValidCreateActionOptions;
    isSignAction: boolean;
    randomVals?: number[];
    includeAllSourceTransactions: boolean;
}
```

See also: [DescriptionString5to2000Bytes](./client.md#type-descriptionstring5to2000bytes), [ValidCreateActionInput](./client.md#interface-validcreateactioninput), [ValidCreateActionOptions](./client.md#interface-validcreateactionoptions), [ValidCreateActionOutput](./client.md#interface-validcreateactionoutput), [ValidProcessActionArgs](./client.md#interface-validprocessactionargs)

###### Property includeAllSourceTransactions

If true, signableTransactions will include sourceTransaction for each input,
including those that do not require signature and those that were also contained
in the inputBEEF.

```ts
includeAllSourceTransactions: boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidCreateActionInput

```ts
export interface ValidCreateActionInput {
    outpoint: OutPoint;
    inputDescription: DescriptionString5to2000Bytes;
    sequenceNumber: PositiveIntegerOrZero;
    unlockingScript?: HexString;
    unlockingScriptLength: PositiveInteger;
}
```

See also: [DescriptionString5to2000Bytes](./client.md#type-descriptionstring5to2000bytes), [OutPoint](./client.md#interface-outpoint)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidCreateActionOptions

```ts
export interface ValidCreateActionOptions extends ValidProcessActionOptions {
    signAndProcess: boolean;
    trustSelf?: TrustSelf;
    knownTxids: TXIDHexString[];
    noSendChange: OutPoint[];
    randomizeOutputs: boolean;
}
```

See also: [OutPoint](./client.md#interface-outpoint), [ValidProcessActionOptions](./client.md#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidCreateActionOutput

```ts
export interface ValidCreateActionOutput {
    lockingScript: HexString;
    satoshis: SatoshiValue;
    outputDescription: DescriptionString5to2000Bytes;
    basket?: BasketStringUnder300Bytes;
    customInstructions?: string;
    tags: BasketStringUnder300Bytes[];
}
```

See also: [DescriptionString5to2000Bytes](./client.md#type-descriptionstring5to2000bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidDiscoverByAttributesArgs

```ts
export interface ValidDiscoverByAttributesArgs extends ValidWalletSignerArgs {
    attributes: Record<CertificateFieldNameUnder50Bytes, string>;
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    seekPermission: boolean;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidDiscoverByIdentityKeyArgs

```ts
export interface ValidDiscoverByIdentityKeyArgs extends ValidWalletSignerArgs {
    identityKey: PubKeyHex;
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    seekPermission: boolean;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidInternalizeActionArgs

```ts
export interface ValidInternalizeActionArgs extends ValidWalletSignerArgs {
    tx: AtomicBEEF;
    outputs: InternalizeOutput[];
    description: DescriptionString5to2000Bytes;
    labels: LabelStringUnder300Bytes[];
    seekPermission: BooleanDefaultTrue;
}
```

See also: [DescriptionString5to2000Bytes](./client.md#type-descriptionstring5to2000bytes), [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidInternalizeOutput

```ts
export interface ValidInternalizeOutput {
    outputIndex: PositiveIntegerOrZero;
    protocol: "wallet payment" | "basket insertion";
    paymentRemittance?: ValidWalletPayment;
    insertionRemittance?: ValidBasketInsertion;
}
```

See also: [ValidBasketInsertion](./client.md#interface-validbasketinsertion), [ValidWalletPayment](./client.md#interface-validwalletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidListActionsArgs

```ts
export interface ValidListActionsArgs extends ValidWalletSignerArgs {
    labels: LabelStringUnder300Bytes[];
    labelQueryMode: "any" | "all";
    includeLabels: BooleanDefaultFalse;
    includeInputs: BooleanDefaultFalse;
    includeInputSourceLockingScripts: BooleanDefaultFalse;
    includeInputUnlockingScripts: BooleanDefaultFalse;
    includeOutputs: BooleanDefaultFalse;
    includeOutputLockingScripts: BooleanDefaultFalse;
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    seekPermission: BooleanDefaultTrue;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidListCertificatesArgs

```ts
export interface ValidListCertificatesArgs extends ValidWalletSignerArgs {
    partial?: {
        type?: Base64String;
        serialNumber?: Base64String;
        certifier?: PubKeyHex;
        subject?: PubKeyHex;
        revocationOutpoint?: OutpointString;
        signature?: HexString;
    };
    certifiers: PubKeyHex[];
    types: Base64String[];
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    privileged: BooleanDefaultFalse;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidListOutputsArgs

```ts
export interface ValidListOutputsArgs extends ValidWalletSignerArgs {
    basket: BasketStringUnder300Bytes;
    tags: OutputTagStringUnder300Bytes[];
    tagQueryMode: "all" | "any";
    includeLockingScripts: boolean;
    includeTransactions: boolean;
    includeCustomInstructions: BooleanDefaultFalse;
    includeTags: BooleanDefaultFalse;
    includeLabels: BooleanDefaultFalse;
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    seekPermission: BooleanDefaultTrue;
    knownTxids: string[];
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidProcessActionArgs

```ts
export interface ValidProcessActionArgs extends ValidWalletSignerArgs {
    options: sdk.ValidProcessActionOptions;
    isSendWith: boolean;
    isNewTx: boolean;
    isRemixChange: boolean;
    isNoSend: boolean;
    isDelayed: boolean;
}
```

See also: [ValidProcessActionOptions](./client.md#interface-validprocessactionoptions), [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidProcessActionOptions

```ts
export interface ValidProcessActionOptions {
    acceptDelayedBroadcast: BooleanDefaultTrue;
    returnTXIDOnly: BooleanDefaultFalse;
    noSend: BooleanDefaultFalse;
    sendWith: TXIDHexString[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidProveCertificateArgs

```ts
export interface ValidProveCertificateArgs extends ValidWalletSignerArgs {
    type?: Base64String;
    serialNumber?: Base64String;
    certifier?: PubKeyHex;
    subject?: PubKeyHex;
    revocationOutpoint?: OutpointString;
    signature?: HexString;
    fieldsToReveal: CertificateFieldNameUnder50Bytes[];
    verifier: PubKeyHex;
    privileged: boolean;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidRelinquishCertificateArgs

```ts
export interface ValidRelinquishCertificateArgs extends ValidWalletSignerArgs {
    type: Base64String;
    serialNumber: Base64String;
    certifier: PubKeyHex;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidRelinquishOutputArgs

```ts
export interface ValidRelinquishOutputArgs extends ValidWalletSignerArgs {
    basket: BasketStringUnder300Bytes;
    output: OutpointString;
}
```

See also: [ValidWalletSignerArgs](./client.md#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidSignActionArgs

```ts
export interface ValidSignActionArgs extends ValidProcessActionArgs {
    spends: Record<PositiveIntegerOrZero, SignActionSpend>;
    reference: Base64String;
    options: sdk.ValidSignActionOptions;
}
```

See also: [ValidProcessActionArgs](./client.md#interface-validprocessactionargs), [ValidSignActionOptions](./client.md#interface-validsignactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidSignActionOptions

```ts
export interface ValidSignActionOptions extends ValidProcessActionOptions {
    acceptDelayedBroadcast: boolean;
    returnTXIDOnly: boolean;
    noSend: boolean;
    sendWith: TXIDHexString[];
}
```

See also: [ValidProcessActionOptions](./client.md#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidWalletPayment

```ts
export interface ValidWalletPayment {
    derivationPrefix: Base64String;
    derivationSuffix: Base64String;
    senderIdentityKey: PubKeyHex;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: ValidWalletSignerArgs

```ts
export interface ValidWalletSignerArgs {
}
```

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
##### Interface: WalletArgs

```ts
export interface WalletArgs {
    chain: sdk.Chain;
    keyDeriver: KeyDeriver;
    storage: WalletStorageManager;
    services?: sdk.WalletServices;
    monitor?: Monitor;
    privilegedKeyManager?: sdk.PrivilegedKeyManager;
    settingsManager?: WalletSettingsManager;
    lookupResolver?: LookupResolver;
}
```

See also: [Chain](./client.md#type-chain), [Monitor](./monitor.md#class-monitor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [WalletServices](./client.md#interface-walletservices), [WalletSettingsManager](./client.md#class-walletsettingsmanager), [WalletStorageManager](./storage.md#class-walletstoragemanager)

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
}
```

See also: [GroupedPermissionEventHandler](./client.md#type-groupedpermissioneventhandler), [PermissionEventHandler](./client.md#type-permissioneventhandler)

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
    postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult[]>;
    hashOutputScript(script: string): string;
    getStatusForTxids(txids: string[], useNext?: boolean): Promise<GetStatusForTxidsResult>;
    isUtxo(output: TableOutput): Promise<boolean>;
    getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, outpoint?: string, useNext?: boolean): Promise<GetUtxoStatusResult>;
    getScriptHashHistory(hash: string, useNext?: boolean): Promise<GetScriptHashHistoryResult>;
    hashToHeader(hash: string): Promise<BlockHeader>;
    nLockTimeIsFinal(txOrLockTime: string | number[] | BsvTransaction | number): Promise<boolean>;
    getBeefForTxid(txid: string): Promise<Beef>;
    getServicesCallHistory(reset?: boolean): ServicesCallHistory;
}
```

See also: [BlockHeader](./services.md#interface-blockheader), [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [PostBeefResult](./client.md#interface-postbeefresult), [ServicesCallHistory](./client.md#type-servicescallhistory), [TableOutput](./storage.md#interface-tableoutput), [getBeefForTxid](./services.md#function-getbeeffortxid)

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
See also: [BlockHeader](./services.md#interface-blockheader)

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
    chaintracks?: ChaintracksServiceClient;
    arcUrl: string;
    arcConfig: ArcConfig;
    arcGorillaPoolUrl?: string;
    arcGorillaPoolConfig?: ArcConfig;
}
```

See also: [ArcConfig](./services.md#interface-arcconfig), [BsvExchangeRate](./client.md#interface-bsvexchangerate), [Chain](./client.md#type-chain), [FiatExchangeRates](./client.md#interface-fiatexchangerates), [arcGorillaPoolUrl](./services.md#function-arcgorillapoolurl)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletSettings

```ts
export interface WalletSettings {
    trustSettings: TrustSettings;
    theme?: WalletTheme;
    currency?: string;
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
    createAction(args: ValidCreateActionArgs): Promise<StorageCreateActionResult>;
    processAction(args: StorageProcessActionArgs): Promise<StorageProcessActionResults>;
    internalizeAction(args: InternalizeActionArgs): Promise<InternalizeActionResult>;
    findCertificates(args: FindCertificatesArgs): Promise<TableCertificateX[]>;
    findOutputBaskets(args: FindOutputBasketsArgs): Promise<TableOutputBasket[]>;
    findOutputs(args: FindOutputsArgs): Promise<TableOutput[]>;
    findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>;
    listActions(args: ListActionsArgs): Promise<ListActionsResult>;
    listCertificates(args: ValidListCertificatesArgs): Promise<ListCertificatesResult>;
    listOutputs(args: ListOutputsArgs): Promise<ListOutputsResult>;
    insertCertificate(certificate: TableCertificateX): Promise<number>;
    relinquishCertificate(args: RelinquishCertificateArgs): Promise<number>;
    relinquishOutput(args: RelinquishOutputArgs): Promise<number>;
    getStores(): WalletStorageInfo[];
}
```

See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableUser](./storage.md#interface-tableuser), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs), [WalletServices](./client.md#interface-walletservices), [WalletStorageInfo](./client.md#interface-walletstorageinfo), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction)

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
    listActions(auth: AuthId, vargs: ValidListActionsArgs): Promise<ListActionsResult>;
    listCertificates(auth: AuthId, vargs: ValidListCertificatesArgs): Promise<ListCertificatesResult>;
    listOutputs(auth: AuthId, vargs: ValidListOutputsArgs): Promise<ListOutputsResult>;
}
```

See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WalletServices](./client.md#interface-walletservices), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs)

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
    createAction(auth: AuthId, args: ValidCreateActionArgs): Promise<StorageCreateActionResult>;
    processAction(auth: AuthId, args: StorageProcessActionArgs): Promise<StorageProcessActionResults>;
    internalizeAction(auth: AuthId, args: InternalizeActionArgs): Promise<StorageInternalizeActionResult>;
    insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number>;
    relinquishCertificate(auth: AuthId, args: RelinquishCertificateArgs): Promise<number>;
    relinquishOutput(auth: AuthId, args: RelinquishOutputArgs): Promise<number>;
}
```

See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableSettings](./storage.md#interface-tablesettings), [TableUser](./storage.md#interface-tableuser), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [WalletStorageReader](./client.md#interface-walletstoragereader), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [processAction](./storage.md#function-processaction)

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
##### Interface: XValidCreateActionOutput

```ts
export interface XValidCreateActionOutput extends sdk.ValidCreateActionOutput {
    vout: number;
    providedBy: sdk.StorageProvidedBy;
    purpose?: string;
    derivationSuffix?: string;
    keyOffset?: string;
}
```

See also: [StorageProvidedBy](./client.md#type-storageprovidedby), [ValidCreateActionOutput](./client.md#interface-validcreateactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Classes

| | | |
| --- | --- | --- |
| [ARC](#class-arc) | [ScriptTemplateBRC29](#class-scripttemplatebrc29) | [WABClient](#class-wabclient) |
| [AuthMethodInteractor](#class-authmethodinteractor) | [SdkWhatsOnChain](#class-sdkwhatsonchain) | [WERR_BAD_REQUEST](#class-werr_bad_request) |
| [Bitails](#class-bitails) | [ServiceCollection](#class-servicecollection) | [WERR_BROADCAST_UNAVAILABLE](#class-werr_broadcast_unavailable) |
| [CWIStyleWalletManager](#class-cwistylewalletmanager) | [Services](#class-services) | [WERR_INSUFFICIENT_FUNDS](#class-werr_insufficient_funds) |
| [EntityBase](#class-entitybase) | [SetupClient](#class-setupclient) | [WERR_INTERNAL](#class-werr_internal) |
| [EntityCertificate](#class-entitycertificate) | [SimpleWalletManager](#class-simplewalletmanager) | [WERR_INVALID_OPERATION](#class-werr_invalid_operation) |
| [EntityCertificateField](#class-entitycertificatefield) | [StorageClient](#class-storageclient) | [WERR_INVALID_PARAMETER](#class-werr_invalid_parameter) |
| [EntityCommission](#class-entitycommission) | [StorageIdb](#class-storageidb) | [WERR_INVALID_PUBLIC_KEY](#class-werr_invalid_public_key) |
| [EntityOutput](#class-entityoutput) | [StorageProvider](#class-storageprovider) | [WERR_MISSING_PARAMETER](#class-werr_missing_parameter) |
| [EntityOutputBasket](#class-entityoutputbasket) | [StorageReader](#class-storagereader) | [WERR_NETWORK_CHAIN](#class-werr_network_chain) |
| [EntityOutputTag](#class-entityoutputtag) | [StorageReaderWriter](#class-storagereaderwriter) | [WERR_NOT_ACTIVE](#class-werr_not_active) |
| [EntityOutputTagMap](#class-entityoutputtagmap) | [StorageSyncReader](#class-storagesyncreader) | [WERR_NOT_IMPLEMENTED](#class-werr_not_implemented) |
| [EntityProvenTx](#class-entityproventx) | [TaskCheckForProofs](#class-taskcheckforproofs) | [WERR_REVIEW_ACTIONS](#class-werr_review_actions) |
| [EntityProvenTxReq](#class-entityproventxreq) | [TaskCheckNoSends](#class-taskchecknosends) | [WERR_UNAUTHORIZED](#class-werr_unauthorized) |
| [EntitySyncState](#class-entitysyncstate) | [TaskClock](#class-taskclock) | [Wallet](#class-wallet) |
| [EntityTransaction](#class-entitytransaction) | [TaskFailAbandoned](#class-taskfailabandoned) | [WalletAuthenticationManager](#class-walletauthenticationmanager) |
| [EntityTxLabel](#class-entitytxlabel) | [TaskMonitorCallHistory](#class-taskmonitorcallhistory) | [WalletError](#class-walleterror) |
| [EntityTxLabelMap](#class-entitytxlabelmap) | [TaskNewHeader](#class-tasknewheader) | [WalletMonitorTask](#class-walletmonitortask) |
| [EntityUser](#class-entityuser) | [TaskPurge](#class-taskpurge) | [WalletPermissionsManager](#class-walletpermissionsmanager) |
| [MergeEntity](#class-mergeentity) | [TaskReviewStatus](#class-taskreviewstatus) | [WalletSettingsManager](#class-walletsettingsmanager) |
| [Monitor](#class-monitor) | [TaskSendWaiting](#class-tasksendwaiting) | [WalletSigner](#class-walletsigner) |
| [OverlayUMPTokenInteractor](#class-overlayumptokeninteractor) | [TaskSyncWhenIdle](#class-tasksyncwhenidle) | [WalletStorageManager](#class-walletstoragemanager) |
| [PersonaIDInteractor](#class-personaidinteractor) | [TaskUnFail](#class-taskunfail) | [WhatsOnChain](#class-whatsonchain) |
| [PrivilegedKeyManager](#class-privilegedkeymanager) | [TwilioPhoneInteractor](#class-twiliophoneinteractor) |  |

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
    destroy(): void 
    listProfiles(): Array<{
        id: number[];
        name: string;
        createdAt: number | null;
        active: boolean;
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
    abstract mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void>;
    abstract mergeExisting(storage: EntityStorage, since: Date | undefined, ei: T, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean>;
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
abstract mergeExisting(storage: EntityStorage, since: Date | undefined, ei: T, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean>
```
See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

Returns

true iff entity state changed and was updated to storage

###### Method mergeNew

Perform a 'merge' / 'convergent' equality migration of state
to this new local entity which was constructed
as a copy of the external object.

```ts
abstract mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void>
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableCertificate, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityCertificate;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableCertificate, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableCertificateField, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityCertificateField;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableCertificateField, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableCommission, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityCommission;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableCommission, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    set providedBy(v: sdk.StorageProvidedBy) 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutput, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityOutput;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutput, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutputBasket, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityOutputBasket;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutputBasket, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutputTag, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityOutputTag;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutputTag, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableOutputTagMap, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityOutputTagMap;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableOutputTagMap, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntityProvenTx

```ts
export class EntityProvenTx extends EntityBase<TableProvenTx> {
    static async fromTxid(txid: string, services: sdk.WalletServices, rawTx?: number[]): Promise<ProvenTxFromTxidResult> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableProvenTx, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityProvenTx;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableProvenTx, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
    static getProofAttemptsLimit = 8;
    static getProofMinutes = 60;
    static async fromReq(req: EntityProvenTxReq, gmpResult: sdk.GetMerklePathResult, countsAsAttempt: boolean): Promise<EntityProvenTx | undefined> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityProvenTxReq](./storage.md#class-entityproventxreq), [EntityStorage](./storage.md#type-entitystorage), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [ProvenTxFromTxidResult](./storage.md#interface-proventxfromtxidresult), [SyncMap](./storage.md#interface-syncmap), [TableProvenTx](./storage.md#interface-tableproventx), [TrxToken](./client.md#interface-trxtoken), [WalletServices](./client.md#interface-walletservices)

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
static async fromReq(req: EntityProvenTxReq, gmpResult: sdk.GetMerklePathResult, countsAsAttempt: boolean): Promise<EntityProvenTx | undefined> 
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
static async fromTxid(txid: string, services: sdk.WalletServices, rawTx?: number[]): Promise<ProvenTxFromTxidResult> 
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
    static async fromStorageTxid(storage: EntityStorage, txid: string, trx?: sdk.TrxToken): Promise<EntityProvenTxReq | undefined> 
    static async fromStorageId(storage: EntityStorage, id: number, trx?: sdk.TrxToken): Promise<EntityProvenTxReq> 
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
    async refreshFromStorage(storage: EntityStorage | WalletStorageManager, trx?: sdk.TrxToken): Promise<void> 
    constructor(api?: TableProvenTxReq) 
    historySince(since: Date): ProvenTxReqHistory 
    historyPretty(since?: Date, indent = 0): string 
    prettyNote(note: sdk.ReqHistoryNote): string 
    getHistorySummary(): ProvenTxReqHistorySummaryApi 
    parseHistoryNote(note: sdk.ReqHistoryNote, summary?: ProvenTxReqHistorySummaryApi): string 
    addNotifyTransactionId(id: number) 
    addHistoryNote(note: sdk.ReqHistoryNote, noDupes?: boolean) 
    async updateStorage(storage: EntityStorage, trx?: sdk.TrxToken) 
    async updateStorageDynamicProperties(storage: WalletStorageManager | StorageProvider, trx?: sdk.TrxToken) 
    async insertOrMerge(storage: EntityStorage, trx?: sdk.TrxToken): Promise<EntityProvenTxReq> 
    get status() 
    set status(v: sdk.ProvenTxReqStatus) 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableProvenTxReq, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityProvenTxReq;
        eiId: number;
    }> 
    mapNotifyTransactionIds(syncMap: SyncMap): void 
    mergeNotifyTransactionIds(ei: TableProvenTxReq, syncMap?: SyncMap): void 
    mergeHistory(ei: TableProvenTxReq, syncMap?: SyncMap, noDupes?: boolean): void 
    static isTerminalStatus(status: sdk.ProvenTxReqStatus): boolean 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableProvenTxReq, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [ProvenTxReqHistory](./storage.md#interface-proventxreqhistory), [ProvenTxReqHistorySummaryApi](./storage.md#interface-proventxreqhistorysummaryapi), [ProvenTxReqNotify](./storage.md#interface-proventxreqnotify), [ProvenTxReqStatus](./client.md#type-proventxreqstatus), [ReqHistoryNote](./client.md#type-reqhistorynote), [StorageProvider](./storage.md#class-storageprovider), [SyncMap](./storage.md#interface-syncmap), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TrxToken](./client.md#interface-trxtoken), [WalletStorageManager](./storage.md#class-walletstoragemanager)

###### Method addHistoryNote

Adds a note to history.
Notes with identical property values to an existing note are ignored.

```ts
addHistoryNote(note: sdk.ReqHistoryNote, noDupes?: boolean) 
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
override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableProvenTxReq, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
```
See also: [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TrxToken](./client.md#interface-trxtoken)

###### Method updateStorage

Updates database record with current state of this EntityUser

```ts
async updateStorage(storage: EntityStorage, trx?: sdk.TrxToken) 
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
async updateStorageDynamicProperties(storage: WalletStorageManager | StorageProvider, trx?: sdk.TrxToken) 
```
See also: [StorageProvider](./storage.md#class-storageprovider), [TrxToken](./client.md#interface-trxtoken), [WalletStorageManager](./storage.md#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: EntitySyncState

```ts
export class EntitySyncState extends EntityBase<TableSyncState> {
    constructor(api?: TableSyncState) 
    validateSyncMap(sm: SyncMap) 
    static async fromStorage(storage: sdk.WalletStorageSync, userIdentityKey: string, remoteSettings: TableSettings): Promise<EntitySyncState> 
    async updateStorage(storage: EntityStorage, notSyncMap?: boolean, trx?: sdk.TrxToken) 
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
    set status(v: sdk.SyncStatus) 
    get status(): sdk.SyncStatus 
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
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableSyncState, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
    makeRequestSyncChunkArgs(forIdentityKey: string, forStorageIdentityKey: string, maxRoughSize?: number, maxItems?: number): sdk.RequestSyncChunkArgs 
    static syncChunkSummary(c: sdk.SyncChunk): string {
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
    async processSyncChunk(writer: EntityStorage, args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<{
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
async updateStorage(storage: EntityStorage, notSyncMap?: boolean, trx?: sdk.TrxToken) 
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
    async getInputs(storage: EntityStorage, trx?: sdk.TrxToken): Promise<TableOutput[]> 
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
    set status(v: sdk.TransactionStatus) 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableTransaction, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityTransaction;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableTransaction, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
    async getProvenTx(storage: EntityStorage, trx?: sdk.TrxToken): Promise<EntityProvenTx | undefined> 
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
async getInputs(storage: EntityStorage, trx?: sdk.TrxToken): Promise<TableOutput[]> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableTxLabel, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityTxLabel;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableTxLabel, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableTxLabelMap, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityTxLabelMap;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableTxLabelMap, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
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
    static async mergeFind(storage: EntityStorage, userId: number, ei: TableUser, trx?: sdk.TrxToken): Promise<{
        found: boolean;
        eo: EntityUser;
        eiId: number;
    }> 
    override async mergeNew(storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<void> 
    override async mergeExisting(storage: EntityStorage, since: Date | undefined, ei: TableUser, syncMap?: SyncMap, trx?: sdk.TrxToken): Promise<boolean> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [SyncMap](./storage.md#interface-syncmap), [TableUser](./storage.md#interface-tableuser), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: MergeEntity

```ts
export class MergeEntity<API extends sdk.EntityTimeStamp, DE extends EntityBase<API>> {
    idMap: Record<number, number>;
    constructor(public stateArray: API[] | undefined, public find: (storage: EntityStorage, userId: number, ei: API, syncMap: SyncMap, trx?: sdk.TrxToken) => Promise<{
        found: boolean;
        eo: DE;
        eiId: number;
    }>, public esm: EntitySyncMap) 
    updateSyncMap(map: Record<number, number>, inId: number, outId: number) 
    async merge(since: Date | undefined, storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
        inserts: number;
        updates: number;
    }> 
}
```

See also: [EntityBase](./storage.md#class-entitybase), [EntityStorage](./storage.md#type-entitystorage), [EntitySyncMap](./storage.md#interface-entitysyncmap), [EntityTimeStamp](./client.md#interface-entitytimestamp), [SyncMap](./storage.md#interface-syncmap), [TrxToken](./client.md#interface-trxtoken)

###### Method merge

```ts
async merge(since: Date | undefined, storage: EntityStorage, userId: number, syncMap: SyncMap, trx?: sdk.TrxToken): Promise<{
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
    static createDefaultWalletMonitorOptions(chain: sdk.Chain, storage: MonitorStorage, services?: Services): MonitorOptions 
    options: MonitorOptions;
    services: Services;
    chain: sdk.Chain;
    storage: MonitorStorage;
    chaintracks: ChaintracksServiceClient;
    constructor(options: MonitorOptions) 
    oneSecond = 1000;
    oneMinute = 60 * this.oneSecond;
    oneHour = 60 * this.oneMinute;
    oneDay = 24 * this.oneHour;
    oneWeek = 7 * this.oneDay;
    _tasks: WalletMonitorTask[] = [];
    _otherTasks: WalletMonitorTask[] = [];
    _tasksRunning = false;
    defaultPurgeParams: TaskPurgeParams = {
        purgeSpent: false,
        purgeCompleted: false,
        purgeFailed: true,
        purgeSpentAge: 2 * this.oneWeek,
        purgeCompletedAge: 2 * this.oneWeek,
        purgeFailedAge: 5 * this.oneDay
    };
    addAllTasksToOther(): void 
    addDefaultTasks(): void 
    addMultiUserTasks(): void 
    addTask(task: WalletMonitorTask): void 
    removeTask(name: string): void 
    async setupChaintracksListeners(): Promise<void> 
    async runTask(name: string): Promise<string> 
    async runOnce(): Promise<void> 
    _runAsyncSetup: boolean = true;
    async startTasks(): Promise<void> 
    async logEvent(event: string, details?: string): Promise<void> 
    stopTasks(): void 
    lastNewHeader: BlockHeader | undefined;
    lastNewHeaderWhen: Date | undefined;
    processNewBlockHeader(header: BlockHeader): void 
    processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader): void 
}
```

See also: [BlockHeader](./services.md#interface-blockheader), [Chain](./client.md#type-chain), [MonitorOptions](./monitor.md#interface-monitoroptions), [MonitorStorage](./monitor.md#type-monitorstorage), [Services](./services.md#class-services), [TaskPurgeParams](./monitor.md#interface-taskpurgeparams), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

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

###### Method processNewBlockHeader

Process new chain header event received from Chaintracks

Kicks processing 'unconfirmed' and 'unmined' request processing.

```ts
processNewBlockHeader(header: BlockHeader): void 
```
See also: [BlockHeader](./services.md#interface-blockheader)

###### Method processReorg

Process reorg event received from Chaintracks

Reorgs can move recent transactions to new blocks at new index positions.
Affected transaction proofs become invalid and must be updated.

It is possible for a transaction to become invalid.

Coinbase transactions always become invalid.

```ts
processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader): void 
```
See also: [BlockHeader](./services.md#interface-blockheader)

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
        const keyDeriver = new KeyDeriver(rootKey);
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
            ? new sdk.PrivilegedKeyManager(args.privilegedKeyGetter)
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
        chain: sdk.Chain;
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
    static getUnlockP2PKH(priv: PrivateKey, satoshis: number): sdk.ScriptTemplateUnlock {
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
    const keyDeriver = new KeyDeriver(rootKey);
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
        ? new sdk.PrivilegedKeyManager(args.privilegedKeyGetter)
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
    chain: sdk.Chain;
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
export class StorageClient implements sdk.WalletStorageProvider {
    readonly endpointUrl: string;
    public settings?: TableSettings;
    constructor(wallet: WalletInterface, endpointUrl: string) 
    isStorageProvider(): boolean 
    isAvailable(): boolean 
    getSettings(): TableSettings 
    async makeAvailable(): Promise<TableSettings> 
    async destroy(): Promise<void> 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    getServices(): sdk.WalletServices 
    setServices(v: sdk.WalletServices): void 
    async internalizeAction(auth: sdk.AuthId, args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
    async createAction(auth: sdk.AuthId, args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async processAction(auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async abortAction(auth: sdk.AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
    async findOrInsertUser(identityKey): Promise<{
        user: TableUser;
        isNew: boolean;
    }> 
    async findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: TableSyncState;
        isNew: boolean;
    }> 
    async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> 
    async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async listCertificates(auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
    async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
    async relinquishCertificate(auth: sdk.AuthId, args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(auth: sdk.AuthId, args: RelinquishOutputArgs): Promise<number> 
    async processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult> 
    async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
    async updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult> 
    async setActive(auth: sdk.AuthId, newActiveStorageIdentityKey: string): Promise<number> 
    validateDate(date: Date | string | number): Date 
    validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[]): T 
    validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[]): T[] 
}
```

See also: [AuthId](./client.md#interface-authid), [EntityTimeStamp](./client.md#interface-entitytimestamp), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [SyncChunk](./client.md#interface-syncchunk), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableUser](./storage.md#interface-tableuser), [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WalletServices](./client.md#interface-walletservices), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [createAction](./storage.md#function-createaction), [getSyncChunk](./storage.md#function-getsyncchunk), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction)

###### Method abortAction

Aborts an action by `reference` string.

```ts
async abortAction(auth: sdk.AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
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
async createAction(auth: sdk.AuthId, args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
```
See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs)

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
async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
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
async findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
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
async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
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
async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
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
async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
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
getServices(): sdk.WalletServices 
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
async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
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
async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> 
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
async internalizeAction(auth: sdk.AuthId, args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
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
async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
```
See also: [AuthId](./client.md#interface-authid), [ValidListActionsArgs](./client.md#interface-validlistactionsargs)

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
async listCertificates(auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
```
See also: [AuthId](./client.md#interface-authid), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs)

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
async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
```
See also: [AuthId](./client.md#interface-authid), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs)

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
async processAction(auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
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
async processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult> 
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
async relinquishCertificate(auth: sdk.AuthId, args: RelinquishCertificateArgs): Promise<number> 
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
async relinquishOutput(auth: sdk.AuthId, args: RelinquishOutputArgs): Promise<number> 
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
async setActive(auth: sdk.AuthId, newActiveStorageIdentityKey: string): Promise<number> 
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
setServices(v: sdk.WalletServices): void 
```
See also: [WalletServices](./client.md#interface-walletservices)

###### Method updateProvenTxReqWithNewProvenTx

Handles the data received when a new transaction proof is found in response to an outstanding request for proof data:

  - Creates a new `TableProvenTx` record.
  - Notifies all user transaction records of the new status.
  - Updates the proof request record to 'completed' status which enables delayed deletion.

```ts
async updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult> 
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
validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[]): T[] 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Returns

input `entities` array with contained values validated.

###### Method validateEntity

Helper to force uniform behavior across database engines.
Use to process all individual records with time stamps retreived from database.

```ts
validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[]): T 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: StorageIdb

This class implements the `StorageProvider` interface using IndexedDB,
via the promises wrapper package `idb`.

```ts
export class StorageIdb extends StorageProvider implements sdk.WalletStorageProvider {
    dbName: string;
    db?: IDBPDatabase<StorageIdbSchema>;
    constructor(options: StorageIdbOptions) 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    async verifyDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> 
    toDbTrx(stores: string[], mode: "readonly" | "readwrite", trx?: sdk.TrxToken): IDBPTransaction<StorageIdbSchema, string[], "readwrite" | "readonly"> 
    async readSettings(trx?: sdk.TrxToken): Promise<TableSettings> 
    async initDB(storageName?: string, storageIdentityKey?: string): Promise<IDBPDatabase<StorageIdbSchema>> 
    async reviewStatus(args: {
        agedLimit: Date;
        trx?: sdk.TrxToken;
    }): Promise<{
        log: string;
    }> 
    async purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
    async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined> 
    async getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx> 
    async getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: sdk.TrxToken): Promise<number[] | undefined> 
    async getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<TableTxLabel[]> 
    async getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<TableOutputTag[]> 
    async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> 
    async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
    async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> 
    async dropAllData(): Promise<void> 
    async filterOutputTagMaps(args: sdk.FindOutputTagMapsArgs, filtered: (v: TableOutputTagMap) => void, userId?: number): Promise<void> 
    async findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> 
    async filterProvenTxReqs(args: sdk.FindProvenTxReqsArgs, filtered: (v: TableProvenTxReq) => void, userId?: number): Promise<void> 
    async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
    async filterProvenTxs(args: sdk.FindProvenTxsArgs, filtered: (v: TableProvenTx) => void, userId?: number): Promise<void> 
    async findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<TableProvenTx[]> 
    async filterTxLabelMaps(args: sdk.FindTxLabelMapsArgs, filtered: (v: TableTxLabelMap) => void, userId?: number): Promise<void> 
    async findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> 
    async countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number> 
    async countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number> 
    async countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number> 
    async countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number> 
    async insertCertificate(certificate: TableCertificateX, trx?: sdk.TrxToken): Promise<number> 
    async insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void> 
    async insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number> 
    async insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number> 
    async insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number> 
    async insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number> 
    async insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number> 
    async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void> 
    async insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number> 
    async insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number> 
    async insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number> 
    async insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number> 
    async insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number> 
    async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void> 
    async insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number> 
    async updateIdb<T>(id: number | number[], update: Partial<T>, keyProp: string, storeName: string, trx?: sdk.TrxToken): Promise<number> 
    async updateIdbKey<T>(key: (number | string)[], update: Partial<T>, keyProps: string[], storeName: string, trx?: sdk.TrxToken): Promise<number> 
    async updateCertificate(id: number, update: Partial<TableCertificate>, trx?: sdk.TrxToken): Promise<number> 
    async updateCertificateField(certificateId: number, fieldName: string, update: Partial<TableCertificateField>, trx?: sdk.TrxToken): Promise<number> 
    async updateCommission(id: number, update: Partial<TableCommission>, trx?: sdk.TrxToken): Promise<number> 
    async updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: sdk.TrxToken): Promise<number> 
    async updateOutput(id: number, update: Partial<TableOutput>, trx?: sdk.TrxToken): Promise<number> 
    async updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: sdk.TrxToken): Promise<number> 
    async updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: sdk.TrxToken): Promise<number> 
    async updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: sdk.TrxToken): Promise<number> 
    async updateProvenTxReq(id: number | number[], update: Partial<TableProvenTxReq>, trx?: sdk.TrxToken): Promise<number> 
    async updateSyncState(id: number, update: Partial<TableSyncState>, trx?: sdk.TrxToken): Promise<number> 
    async updateTransaction(id: number | number[], update: Partial<TableTransaction>, trx?: sdk.TrxToken): Promise<number> 
    async updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: sdk.TrxToken): Promise<number> 
    async updateUser(id: number, update: Partial<TableUser>, trx?: sdk.TrxToken): Promise<number> 
    async updateOutputTagMap(outputId: number, tagId: number, update: Partial<TableOutputTagMap>, trx?: sdk.TrxToken): Promise<number> 
    async updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<TableTxLabelMap>, trx?: sdk.TrxToken): Promise<number> 
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
    async transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T> 
    async filterCertificateFields(args: sdk.FindCertificateFieldsArgs, filtered: (v: TableCertificateField) => void): Promise<void> 
    async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]> 
    async filterCertificates(args: sdk.FindCertificatesArgs, filtered: (v: TableCertificateX) => void): Promise<void> 
    async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    async filterCommissions(args: sdk.FindCommissionsArgs, filtered: (v: TableCommission) => void): Promise<void> 
    async findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]> 
    async filterMonitorEvents(args: sdk.FindMonitorEventsArgs, filtered: (v: TableMonitorEvent) => void): Promise<void> 
    async findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]> 
    async filterOutputBaskets(args: sdk.FindOutputBasketsArgs, filtered: (v: TableOutputBasket) => void): Promise<void> 
    async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async filterOutputs(args: sdk.FindOutputsArgs, filtered: (v: TableOutput) => void, tagIds?: number[], isQueryModeAll?: boolean): Promise<void> 
    async findOutputs(args: sdk.FindOutputsArgs, tagIds?: number[], isQueryModeAll?: boolean): Promise<TableOutput[]> 
    async filterOutputTags(args: sdk.FindOutputTagsArgs, filtered: (v: TableOutputTag) => void): Promise<void> 
    async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]> 
    async filterSyncStates(args: sdk.FindSyncStatesArgs, filtered: (v: TableSyncState) => void): Promise<void> 
    async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]> 
    async filterTransactions(args: sdk.FindTransactionsArgs, filtered: (v: TableTransaction) => void, labelIds?: number[], isQueryModeAll?: boolean): Promise<void> 
    async findTransactions(args: sdk.FindTransactionsArgs, labelIds?: number[], isQueryModeAll?: boolean): Promise<TableTransaction[]> 
    async filterTxLabels(args: sdk.FindTxLabelsArgs, filtered: (v: TableTxLabel) => void): Promise<void> 
    async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]> 
    async filterUsers(args: sdk.FindUsersArgs, filtered: (v: TableUser) => void): Promise<void> 
    async findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]> 
    async countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number> 
    async countCertificates(args: sdk.FindCertificatesArgs): Promise<number> 
    async countCommissions(args: sdk.FindCommissionsArgs): Promise<number> 
    async countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number> 
    async countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number> 
    async countOutputs(args: sdk.FindOutputsArgs, tagIds?: number[], isQueryModeAll?: boolean): Promise<number> 
    async countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number> 
    async countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number> 
    async countTransactions(args: sdk.FindTransactionsArgs, labelIds?: number[], isQueryModeAll?: boolean): Promise<number> 
    async countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number> 
    async countUsers(args: sdk.FindUsersArgs): Promise<number> 
    async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]> 
    async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> 
    async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> 
    async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> 
    async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> 
    validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T 
    validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] 
    validatePartialForUpdate<T extends sdk.EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
    async validateEntityForInsert<T extends sdk.EntityTimeStamp>(entity: T, trx?: sdk.TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
    async validateRawTransaction(t: TableTransaction, trx?: sdk.TrxToken): Promise<void> 
    async adminStats(adminIdentityKey: string): Promise<StorageAdminStats> 
}
```

See also: [AuthId](./client.md#interface-authid), [DBType](./storage.md#type-dbtype), [EntityTimeStamp](./client.md#interface-entitytimestamp), [FindCertificateFieldsArgs](./client.md#interface-findcertificatefieldsargs), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindCommissionsArgs](./client.md#interface-findcommissionsargs), [FindForUserSincePagedArgs](./client.md#interface-findforusersincepagedargs), [FindMonitorEventsArgs](./client.md#interface-findmonitoreventsargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputTagMapsArgs](./client.md#interface-findoutputtagmapsargs), [FindOutputTagsArgs](./client.md#interface-findoutputtagsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [FindProvenTxsArgs](./client.md#interface-findproventxsargs), [FindSyncStatesArgs](./client.md#interface-findsyncstatesargs), [FindTransactionsArgs](./client.md#interface-findtransactionsargs), [FindTxLabelMapsArgs](./client.md#interface-findtxlabelmapsargs), [FindTxLabelsArgs](./client.md#interface-findtxlabelsargs), [FindUsersArgs](./client.md#interface-findusersargs), [ProvenOrRawTx](./client.md#interface-provenorrawtx), [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [StorageAdminStats](./storage.md#interface-storageadminstats), [StorageIdbOptions](./storage.md#interface-storageidboptions), [StorageIdbSchema](./storage.md#interface-storageidbschema), [StorageProvider](./storage.md#class-storageprovider), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableCommission](./storage.md#interface-tablecommission), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser), [TrxToken](./client.md#interface-trxtoken), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [listActions](./storage.md#function-listactions), [listOutputs](./storage.md#function-listoutputs), [purgeData](./storage.md#function-purgedata), [reviewStatus](./storage.md#function-reviewstatus)

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
async readSettings(trx?: sdk.TrxToken): Promise<TableSettings> 
```
See also: [TableSettings](./storage.md#interface-tablesettings), [TrxToken](./client.md#interface-trxtoken)

###### Method toDbTrx

Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
or a Knex.Transaction as appropriate.

```ts
toDbTrx(stores: string[], mode: "readonly" | "readwrite", trx?: sdk.TrxToken): IDBPTransaction<StorageIdbSchema, string[], "readwrite" | "readonly"> 
```
See also: [StorageIdbSchema](./storage.md#interface-storageidbschema), [TrxToken](./client.md#interface-trxtoken)

###### Method validateEntities

Helper to force uniform behavior across database engines.
Use to process all arrays of records with time stamps retreived from database.

```ts
validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

Returns

input `entities` array with contained values validated.

###### Method validateEntity

Helper to force uniform behavior across database engines.
Use to process all individual records with time stamps or number[] retreived from database.

```ts
validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp)

###### Method validateEntityForInsert

Helper to force uniform behavior across database engines.
Use to process new entities being inserted into the database.

```ts
async validateEntityForInsert<T extends sdk.EntityTimeStamp>(entity: T, trx?: sdk.TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
```
See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [TrxToken](./client.md#interface-trxtoken)

###### Method validatePartialForUpdate

Helper to force uniform behavior across database engines.
Use to process the update template for entities being updated.

```ts
validatePartialForUpdate<T extends sdk.EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
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
export abstract class StorageProvider extends StorageReaderWriter implements sdk.WalletStorageProvider {
    isDirty = false;
    _services?: sdk.WalletServices;
    feeModel: sdk.StorageFeeModel;
    commissionSatoshis: number;
    commissionPubKeyHex?: PubKeyHex;
    maxRecursionDepth?: number;
    static defaultOptions() 
    static createStorageBaseOptions(chain: sdk.Chain): StorageProviderOptions 
    constructor(options: StorageProviderOptions) 
    abstract reviewStatus(args: {
        agedLimit: Date;
        trx?: sdk.TrxToken;
    }): Promise<{
        log: string;
    }>;
    abstract purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults>;
    abstract allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined>;
    abstract getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx>;
    abstract getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: sdk.TrxToken): Promise<number[] | undefined>;
    abstract getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<TableTxLabel[]>;
    abstract getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<TableOutputTag[]>;
    abstract listActions(auth: sdk.AuthId, args: sdk.ValidListActionsArgs): Promise<ListActionsResult>;
    abstract listOutputs(auth: sdk.AuthId, args: sdk.ValidListOutputsArgs): Promise<ListOutputsResult>;
    abstract countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number>;
    abstract findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]>;
    abstract findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]>;
    abstract findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]>;
    abstract insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number>;
    abstract adminStats(adminIdentityKey: string): Promise<AdminStatsResult>;
    override isStorageProvider(): boolean 
    setServices(v: sdk.WalletServices) 
    getServices(): sdk.WalletServices 
    async abortAction(auth: sdk.AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
    async internalizeAction(auth: sdk.AuthId, args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
    async getReqsAndBeefToShareWithWorld(txids: string[], knownTxids: string[], trx?: sdk.TrxToken): Promise<GetReqsAndBeefResult> 
    async mergeReqToBeefToShareExternally(req: TableProvenTxReq, mergeToBeef: Beef, knownTxids: string[], trx?: sdk.TrxToken): Promise<void> 
    async getProvenOrReq(txid: string, newReq?: TableProvenTxReq, trx?: sdk.TrxToken): Promise<sdk.StorageProvenOrReq> 
    async updateTransactionsStatus(transactionIds: number[], status: sdk.TransactionStatus, trx?: sdk.TrxToken): Promise<void> 
    async updateTransactionStatus(status: sdk.TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: sdk.TrxToken): Promise<void> 
    async createAction(auth: sdk.AuthId, args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async processAction(auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async attemptToPostReqsToNetwork(reqs: EntityProvenTxReq[], trx?: sdk.TrxToken): Promise<PostReqsToNetworkResult> 
    async listCertificates(auth: sdk.AuthId, args: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async verifyKnownValidTransaction(txid: string, trx?: sdk.TrxToken): Promise<boolean> 
    async getValidBeefForKnownTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: sdk.TrxToken, requiredLevels?: number): Promise<Beef> 
    async getValidBeefForTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: sdk.TrxToken, requiredLevels?: number): Promise<Beef | undefined> 
    async getBeefForTransaction(txid: string, options: sdk.StorageGetBeefOptions): Promise<Beef> 
    async findMonitorEventById(id: number, trx?: sdk.TrxToken): Promise<TableMonitorEvent | undefined> 
    async relinquishCertificate(auth: sdk.AuthId, args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(auth: sdk.AuthId, args: RelinquishOutputArgs): Promise<number> 
    async processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult> 
    async updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult> 
    async confirmSpendableOutputs(): Promise<{
        invalidSpendableOutputs: TableOutput[];
    }> 
    async updateProvenTxReqDynamics(id: number, update: Partial<TableProvenTxReqDynamics>, trx?: sdk.TrxToken): Promise<number> 
    async extendOutput(o: TableOutput, includeBasket = false, includeTags = false, trx?: sdk.TrxToken): Promise<TableOutputX> 
    async validateOutputScript(o: TableOutput, trx?: sdk.TrxToken): Promise<void> 
}
```

See also: [AdminStatsResult](./storage.md#interface-adminstatsresult), [AuthId](./client.md#interface-authid), [Chain](./client.md#type-chain), [EntityProvenTxReq](./storage.md#class-entityproventxreq), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [GetReqsAndBeefResult](./storage.md#interface-getreqsandbeefresult), [PostReqsToNetworkResult](./storage.md#interface-postreqstonetworkresult), [ProcessSyncChunkResult](./client.md#interface-processsyncchunkresult), [ProvenOrRawTx](./client.md#interface-provenorrawtx), [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageFeeModel](./client.md#interface-storagefeemodel), [StorageGetBeefOptions](./client.md#interface-storagegetbeefoptions), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvenOrReq](./client.md#interface-storageprovenorreq), [StorageProviderOptions](./storage.md#interface-storageprovideroptions), [StorageReaderWriter](./storage.md#class-storagereaderwriter), [SyncChunk](./client.md#interface-syncchunk), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputX](./storage.md#interface-tableoutputx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableProvenTxReqDynamics](./storage.md#interface-tableproventxreqdynamics), [TableTxLabel](./storage.md#interface-tabletxlabel), [TransactionStatus](./client.md#type-transactionstatus), [TrxToken](./client.md#interface-trxtoken), [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WalletServices](./client.md#interface-walletservices), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [attemptToPostReqsToNetwork](./storage.md#function-attempttopostreqstonetwork), [createAction](./storage.md#function-createaction), [getBeefForTransaction](./storage.md#function-getbeeffortransaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction), [purgeData](./storage.md#function-purgedata), [reviewStatus](./storage.md#function-reviewstatus)

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
async getProvenOrReq(txid: string, newReq?: TableProvenTxReq, trx?: sdk.TrxToken): Promise<sdk.StorageProvenOrReq> 
```
See also: [StorageProvenOrReq](./client.md#interface-storageprovenorreq), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TrxToken](./client.md#interface-trxtoken)

###### Method getReqsAndBeefToShareWithWorld

Given an array of transaction txids with current ProvenTxReq ready-to-share status,
lookup their ProvenTxReqApi req records.
For the txids with reqs and status still ready to send construct a single merged beef.

```ts
async getReqsAndBeefToShareWithWorld(txids: string[], knownTxids: string[], trx?: sdk.TrxToken): Promise<GetReqsAndBeefResult> 
```
See also: [GetReqsAndBeefResult](./storage.md#interface-getreqsandbeefresult), [TrxToken](./client.md#interface-trxtoken)

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
async updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult> 
```
See also: [UpdateProvenTxReqWithNewProvenTxArgs](./client.md#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](./client.md#interface-updateproventxreqwithnewproventxresult)

###### Method updateTransactionStatus

For all `status` values besides 'failed', just updates the transaction records status property.

For 'status' of 'failed', attempts to make outputs previously allocated as inputs to this transaction usable again.

```ts
async updateTransactionStatus(status: sdk.TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: sdk.TrxToken): Promise<void> 
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
    abstract findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<TableOutputTagMap[]>;
    abstract findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>;
    abstract findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<TableProvenTx[]>;
    abstract findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<TableTxLabelMap[]>;
    abstract countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number>;
    abstract countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number>;
    abstract countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number>;
    abstract countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number>;
    abstract insertCertificate(certificate: TableCertificate, trx?: sdk.TrxToken): Promise<number>;
    abstract insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void>;
    abstract insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number>;
    abstract insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void>;
    abstract insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number>;
    abstract insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number>;
    abstract insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number>;
    abstract insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number>;
    abstract insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number>;
    abstract insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void>;
    abstract insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number>;
    abstract updateCertificate(id: number, update: Partial<TableCertificate>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateCertificateField(certificateId: number, fieldName: string, update: Partial<TableCertificateField>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateCommission(id: number, update: Partial<TableCommission>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutput(id: number, update: Partial<TableOutput>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutputTagMap(outputId: number, tagId: number, update: Partial<TableOutputTagMap>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateProvenTxReq(id: number | number[], update: Partial<TableProvenTxReq>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateSyncState(id: number, update: Partial<TableSyncState>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateTransaction(id: number | number[], update: Partial<TableTransaction>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<TableTxLabelMap>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateUser(id: number, update: Partial<TableUser>, trx?: sdk.TrxToken): Promise<number>;
    async setActive(auth: sdk.AuthId, newActiveStorageIdentityKey: string): Promise<number> 
    async findCertificateById(id: number, trx?: sdk.TrxToken): Promise<TableCertificate | undefined> 
    async findCommissionById(id: number, trx?: sdk.TrxToken): Promise<TableCommission | undefined> 
    async findOutputById(id: number, trx?: sdk.TrxToken, noScript?: boolean): Promise<TableOutput | undefined> 
    async findOutputBasketById(id: number, trx?: sdk.TrxToken): Promise<TableOutputBasket | undefined> 
    async findProvenTxById(id: number, trx?: sdk.TrxToken | undefined): Promise<TableProvenTx | undefined> 
    async findProvenTxReqById(id: number, trx?: sdk.TrxToken | undefined): Promise<TableProvenTxReq | undefined> 
    async findSyncStateById(id: number, trx?: sdk.TrxToken): Promise<TableSyncState | undefined> 
    async findTransactionById(id: number, trx?: sdk.TrxToken, noRawTx?: boolean): Promise<TableTransaction | undefined> 
    async findTxLabelById(id: number, trx?: sdk.TrxToken): Promise<TableTxLabel | undefined> 
    async findOutputTagById(id: number, trx?: sdk.TrxToken): Promise<TableOutputTag | undefined> 
    async findUserById(id: number, trx?: sdk.TrxToken): Promise<TableUser | undefined> 
    async findOrInsertUser(identityKey: string, trx?: sdk.TrxToken): Promise<{
        user: TableUser;
        isNew: boolean;
    }> 
    async findOrInsertTransaction(newTx: TableTransaction, trx?: sdk.TrxToken): Promise<{
        tx: TableTransaction;
        isNew: boolean;
    }> 
    async findOrInsertOutputBasket(userId: number, name: string, trx?: sdk.TrxToken): Promise<TableOutputBasket> 
    async findOrInsertTxLabel(userId: number, label: string, trx?: sdk.TrxToken): Promise<TableTxLabel> 
    async findOrInsertTxLabelMap(transactionId: number, txLabelId: number, trx?: sdk.TrxToken): Promise<TableTxLabelMap> 
    async findOrInsertOutputTag(userId: number, tag: string, trx?: sdk.TrxToken): Promise<TableOutputTag> 
    async findOrInsertOutputTagMap(outputId: number, outputTagId: number, trx?: sdk.TrxToken): Promise<TableOutputTagMap> 
    async findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: TableSyncState;
        isNew: boolean;
    }> 
    async findOrInsertProvenTxReq(newReq: TableProvenTxReq, trx?: sdk.TrxToken): Promise<{
        req: TableProvenTxReq;
        isNew: boolean;
    }> 
    async findOrInsertProvenTx(newProven: TableProvenTx, trx?: sdk.TrxToken): Promise<{
        proven: TableProvenTx;
        isNew: boolean;
    }> 
    abstract processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult>;
    async tagOutput(partial: Partial<TableOutput>, tag: string, trx?: sdk.TrxToken): Promise<void> 
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
    constructor(monitor: Monitor, public triggerMsecs = monitor.oneDay * 1) 
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
    constructor(monitor: Monitor, public triggerMsecs = 1 * monitor.oneSecond) 
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
    constructor(monitor: Monitor, public triggerMsecs = monitor.oneMinute * 12) 
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
    constructor(monitor: Monitor, public triggerMsecs = 1 * monitor.oneMinute) 
    async getHeader(): Promise<BlockHeader> 
    override async asyncSetup(): Promise<void> 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [BlockHeader](./services.md#interface-blockheader), [Monitor](./monitor.md#class-monitor), [WalletMonitorTask](./monitor.md#class-walletmonitortask)

###### Property header

This is always the most recent chain tip header returned from the chaintracker.

```ts
header?: BlockHeader
```
See also: [BlockHeader](./services.md#interface-blockheader)

###### Property queuedHeader

Tracks the value of `header` except that it is set to undefined
when a cycle without a new header occurs and `processNewBlockHeader` is called.

```ts
queuedHeader?: BlockHeader
```
See also: [BlockHeader](./services.md#interface-blockheader)

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
##### Class: TaskReviewStatus

Notify Transaction records of changes in ProvenTxReq records they may have missed.

The `notified` property flags reqs that do not need to be checked.

Looks for aged Transactions with provenTxId with status != 'completed', sets status to 'completed'.

Looks for reqs with 'invalid' status that

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
    constructor(monitor: Monitor, public triggerMsecs = monitor.oneSecond * 8, public agedMsecs = monitor.oneSecond * 7, public sendingMsecs = monitor.oneMinute * 5) 
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
    constructor(monitor: Monitor, public triggerMsecs = monitor.oneMinute * 10) 
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
}
```

See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

###### Method completeAuthMethod

Complete an Auth Method flow

```ts
public async completeAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) 
```
See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

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

###### Method startAuthMethod

Start an Auth Method flow

```ts
public async startAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) 
```
See also: [AuthMethodInteractor](./client.md#class-authmethodinteractor)

###### Method unlinkMethod

Unlink a given Auth Method by ID

```ts
public async unlinkMethod(presentationKey: string, authMethodId: number) 
```

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
}
```

See also: [WalletError](./client.md#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WERR_INVALID_PUBLIC_KEY

```ts
export class WERR_INVALID_PUBLIC_KEY extends WalletError {
    constructor(public key: string, network: WalletNetwork = "mainnet") 
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
    chain: sdk.Chain;
    keyDeriver: KeyDeriver;
    storage: WalletStorageManager;
    settingsManager: WalletSettingsManager;
    lookupResolver: LookupResolver;
    services?: sdk.WalletServices;
    monitor?: Monitor;
    identityKey: string;
    beef: BeefParty;
    includeAllSourceTransactions: boolean = true;
    autoKnownTxids: boolean = false;
    returnTxidOnly: boolean = false;
    trustSelf?: TrustSelf;
    userParty: string;
    proto: ProtoWallet;
    privilegedKeyManager?: sdk.PrivilegedKeyManager;
    pendingSignActions: Record<string, PendingSignAction>;
    randomVals?: number[] = undefined;
    constructor(argsOrSigner: WalletArgs | WalletSigner, services?: sdk.WalletServices, monitor?: Monitor, privilegedKeyManager?: sdk.PrivilegedKeyManager) 
    async destroy(): Promise<void> 
    getClientChangeKeyPair(): sdk.KeyPair 
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
    getServices(): sdk.WalletServices 
    getKnownTxids(newKnownTxids?: string[]): string[] 
    getStorageIdentity(): sdk.StorageIdentity 
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
    async balanceAndUtxos(basket: string = "default"): Promise<sdk.WalletBalance> 
    async balance(): Promise<number> 
    async reviewSpendableOutputs(all = false, release = false, optionalArgs?: Partial<ListOutputsArgs>): Promise<ListOutputsResult> 
    async setWalletChangeParams(count: number, satoshis: number): Promise<void> 
    async listNoSendActions(args: ListActionsArgs, abort = false): Promise<ListActionsResult> 
    async listFailedActions(args: ListActionsArgs, unfail = false): Promise<ListActionsResult> 
}
```

See also: [Chain](./client.md#type-chain), [KeyPair](./client.md#interface-keypair), [Monitor](./monitor.md#class-monitor), [PendingSignAction](./client.md#interface-pendingsignaction), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [StorageIdentity](./client.md#interface-storageidentity), [WalletArgs](./client.md#interface-walletargs), [WalletBalance](./client.md#interface-walletbalance), [WalletServices](./client.md#interface-walletservices), [WalletSettingsManager](./client.md#class-walletsettingsmanager), [WalletSigner](./client.md#class-walletsigner), [WalletStorageManager](./storage.md#class-walletstoragemanager), [createAction](./storage.md#function-createaction), [getIdentityKey](./client.md#function-getidentitykey), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [proveCertificate](./client.md#function-provecertificate), [signAction](./client.md#function-signaction)

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
async balanceAndUtxos(basket: string = "default"): Promise<sdk.WalletBalance> 
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
    public bindCallback(eventName: keyof WalletPermissionsManagerCallbacks, handler: PermissionEventHandler | GroupedPermissionEventHandler): number 
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

See also: [GroupedPermissionEventHandler](./client.md#type-groupedpermissioneventhandler), [GroupedPermissions](./client.md#interface-groupedpermissions), [PermissionEventHandler](./client.md#type-permissioneventhandler), [PermissionToken](./client.md#interface-permissiontoken), [PermissionsManagerConfig](./client.md#interface-permissionsmanagerconfig), [WalletPermissionsManagerCallbacks](./client.md#interface-walletpermissionsmanagercallbacks), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [proveCertificate](./client.md#function-provecertificate), [signAction](./client.md#function-signaction)

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
public bindCallback(eventName: keyof WalletPermissionsManagerCallbacks, handler: PermissionEventHandler | GroupedPermissionEventHandler): number 
```
See also: [GroupedPermissionEventHandler](./client.md#type-groupedpermissioneventhandler), [PermissionEventHandler](./client.md#type-permissioneventhandler), [WalletPermissionsManagerCallbacks](./client.md#interface-walletpermissionsmanagercallbacks)

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
    chain: sdk.Chain;
    keyDeriver: KeyDeriver;
    storage: WalletStorageManager;
    constructor(chain: sdk.Chain, keyDeriver: KeyDeriver, storage: WalletStorageManager) 
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
    _readerCount: number = 0;
    _writerCount: number = 0;
    _isSingleWriter: boolean = true;
    _syncLocked: boolean = false;
    _storageProviderLocked: boolean = false;
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
    async getActiveForWriter(): Promise<sdk.WalletStorageWriter> 
    async getActiveForReader(): Promise<sdk.WalletStorageReader> 
    async getActiveForSync(): Promise<sdk.WalletStorageSync> 
    async getActiveForStorageProvider(): Promise<StorageProvider> 
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
    async createAction(vargs: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async internalizeAction(args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
    async relinquishCertificate(args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(args: RelinquishOutputArgs): Promise<number> 
    async processAction(args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async insertCertificate(certificate: TableCertificate): Promise<number> 
    async listActions(vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    async listCertificates(args: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async listOutputs(vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
    async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
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

See also: [AuthId](./client.md#interface-authid), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvider](./storage.md#class-storageprovider), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableUser](./storage.md#interface-tableuser), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WalletServices](./client.md#interface-walletservices), [WalletStorage](./client.md#interface-walletstorage), [WalletStorageInfo](./client.md#interface-walletstorageinfo), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [WalletStorageReader](./client.md#interface-walletstoragereader), [WalletStorageSync](./client.md#interface-walletstoragesync), [WalletStorageSyncReader](./client.md#interface-walletstoragesyncreader), [WalletStorageWriter](./client.md#interface-walletstoragewriter), [createAction](./storage.md#function-createaction), [internalizeAction](./storage.md#function-internalizeaction), [listActions](./storage.md#function-listactions), [listCertificates](./storage.md#function-listcertificates), [listOutputs](./storage.md#function-listoutputs), [processAction](./storage.md#function-processaction)

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

###### Property _isSingleWriter

if true, allow only a single writer to proceed at a time.
queue the blocked requests so they get executed in order when released.

```ts
_isSingleWriter: boolean = true
```

###### Property _readerCount

How many read access operations are pending

```ts
_readerCount: number = 0
```

###### Property _services

Configured services if any. If valid, shared with stores (which may ignore it).

```ts
_services?: sdk.WalletServices
```
See also: [WalletServices](./client.md#interface-walletservices)

###### Property _storageProviderLocked

if true, allow no new reader or writers or sync to proceed.
queue the blocked requests so they get executed in order when released.

```ts
_storageProviderLocked: boolean = false
```

###### Property _stores

All configured stores including current active, backups, and conflicting actives.

```ts
_stores: ManagedStorage[] = []
```

###### Property _syncLocked

if true, allow no new reader or writers to proceed.
queue the blocked requests so they get executed in order when released.

```ts
_syncLocked: boolean = false
```

###### Property _writerCount

How many write access operations are pending

```ts
_writerCount: number = 0
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

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Class: WhatsOnChain

```ts
export class WhatsOnChain extends SdkWhatsOnChain {
    services: Services;
    constructor(chain: sdk.Chain = "main", config: WhatsOnChainConfig = {}, services?: Services) 
    async getStatusForTxids(txids: string[]): Promise<sdk.GetStatusForTxidsResult> 
    async getTxPropagation(txid: string): Promise<number> 
    async getRawTx(txid: string): Promise<string | undefined> 
    async getRawTxResult(txid: string): Promise<sdk.GetRawTxResult> 
    async postBeef(beef: Beef, txids: string[]): Promise<sdk.PostBeefResult> 
    async postRawTx(rawTx: HexString): Promise<sdk.PostTxResultForTxid> 
    async getMerklePath(txid: string, services: sdk.WalletServices): Promise<sdk.GetMerklePathResult> 
    async updateBsvExchangeRate(rate?: sdk.BsvExchangeRate, updateMsecs?: number): Promise<sdk.BsvExchangeRate> 
    async getUtxoStatus(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat, outpoint?: string): Promise<sdk.GetUtxoStatusResult> 
    async getScriptHashConfirmedHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> 
    async getScriptHashUnconfirmedHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> 
    async getScriptHashHistory(hash: string): Promise<sdk.GetScriptHashHistoryResult> 
}
```

See also: [BsvExchangeRate](./client.md#interface-bsvexchangerate), [Chain](./client.md#type-chain), [GetMerklePathResult](./client.md#interface-getmerklepathresult), [GetRawTxResult](./client.md#interface-getrawtxresult), [GetScriptHashHistoryResult](./client.md#interface-getscripthashhistoryresult), [GetStatusForTxidsResult](./client.md#interface-getstatusfortxidsresult), [GetUtxoStatusOutputFormat](./client.md#type-getutxostatusoutputformat), [GetUtxoStatusResult](./client.md#interface-getutxostatusresult), [PostBeefResult](./client.md#interface-postbeefresult), [PostTxResultForTxid](./client.md#interface-posttxresultfortxid), [SdkWhatsOnChain](./services.md#class-sdkwhatsonchain), [Services](./services.md#class-services), [WalletServices](./client.md#interface-walletservices)

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

| | | |
| --- | --- | --- |
| [acquireDirectCertificate](#function-acquiredirectcertificate) | [listActionsIdb](#function-listactionsidb) | [validateCreateActionOptions](#function-validatecreateactionoptions) |
| [arcDefaultUrl](#function-arcdefaulturl) | [listCertificates](#function-listcertificates) | [validateCreateActionOutput](#function-validatecreateactionoutput) |
| [arcGorillaPoolUrl](#function-arcgorillapoolurl) | [listOutputsIdb](#function-listoutputsidb) | [validateDiscoverByAttributesArgs](#function-validatediscoverbyattributesargs) |
| [arraysEqual](#function-arraysequal) | [lockScriptWithKeyOffsetFromPubKey](#function-lockscriptwithkeyoffsetfrompubkey) | [validateDiscoverByIdentityKeyArgs](#function-validatediscoverbyidentitykeyargs) |
| [asArray](#function-asarray) | [makeAtomicBeef](#function-makeatomicbeef) | [validateGenerateChangeSdkParams](#function-validategeneratechangesdkparams) |
| [asBsvSdkPrivateKey](#function-asbsvsdkprivatekey) | [makeChangeLock](#function-makechangelock) | [validateGenerateChangeSdkResult](#function-validategeneratechangesdkresult) |
| [asBsvSdkPublickKey](#function-asbsvsdkpublickkey) | [maxDate](#function-maxdate) | [validateInteger](#function-validateinteger) |
| [asBsvSdkScript](#function-asbsvsdkscript) | [offsetPubKey](#function-offsetpubkey) | [validateInternalizeActionArgs](#function-validateinternalizeactionargs) |
| [asBsvSdkTx](#function-asbsvsdktx) | [optionalArraysEqual](#function-optionalarraysequal) | [validateInternalizeOutput](#function-validateinternalizeoutput) |
| [asString](#function-asstring) | [parseTxScriptOffsets](#function-parsetxscriptoffsets) | [validateListActionsArgs](#function-validatelistactionsargs) |
| [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork) | [parseWalletOutpoint](#function-parsewalletoutpoint) | [validateListCertificatesArgs](#function-validatelistcertificatesargs) |
| [buildSignableTransaction](#function-buildsignabletransaction) | [processAction](#function-processaction) | [validateListOutputsArgs](#function-validatelistoutputsargs) |
| [completeSignedTransaction](#function-completesignedtransaction) | [processAction](#function-processaction) | [validateOptionalInteger](#function-validateoptionalinteger) |
| [convertProofToMerklePath](#function-convertprooftomerklepath) | [proveCertificate](#function-provecertificate) | [validateOptionalOutpointString](#function-validateoptionaloutpointstring) |
| [createAction](#function-createaction) | [purgeDataIdb](#function-purgedataidb) | [validateOriginator](#function-validateoriginator) |
| [createAction](#function-createaction) | [randomBytes](#function-randombytes) | [validateOutpointString](#function-validateoutpointstring) |
| [createDefaultWalletServicesOptions](#function-createdefaultwalletservicesoptions) | [randomBytesBase64](#function-randombytesbase64) | [validatePositiveIntegerOrZero](#function-validatepositiveintegerorzero) |
| [createStorageServiceChargeScript](#function-createstorageservicechargescript) | [randomBytesHex](#function-randombyteshex) | [validateProveCertificateArgs](#function-validateprovecertificateargs) |
| [createSyncMap](#function-createsyncmap) | [reviewStatusIdb](#function-reviewstatusidb) | [validateRelinquishCertificateArgs](#function-validaterelinquishcertificateargs) |
| [doubleSha256BE](#function-doublesha256be) | [setDisableDoubleSpendCheckForTest](#function-setdisabledoublespendcheckfortest) | [validateRelinquishOutputArgs](#function-validaterelinquishoutputargs) |
| [doubleSha256LE](#function-doublesha256le) | [sha256Hash](#function-sha256hash) | [validateSatoshis](#function-validatesatoshis) |
| [generateChangeSdk](#function-generatechangesdk) | [shareReqsWithWorld](#function-sharereqswithworld) | [validateScriptHash](#function-validatescripthash) |
| [generateChangeSdkMakeStorage](#function-generatechangesdkmakestorage) | [signAction](#function-signaction) | [validateSecondsSinceEpoch](#function-validatesecondssinceepoch) |
| [getBeefForTransaction](#function-getbeeffortransaction) | [stampLog](#function-stamplog) | [validateSignActionArgs](#function-validatesignactionargs) |
| [getBeefForTxid](#function-getbeeffortxid) | [stampLogFormat](#function-stamplogformat) | [validateSignActionOptions](#function-validatesignactionoptions) |
| [getExchangeRatesIo](#function-getexchangeratesio) | [toBinaryBaseBlockHeader](#function-tobinarybaseblockheader) | [validateStorageFeeModel](#function-validatestoragefeemodel) |
| [getIdentityKey](#function-getidentitykey) | [toWalletNetwork](#function-towalletnetwork) | [validateStringLength](#function-validatestringlength) |
| [getProofs](#function-getproofs) | [transactionInputSize](#function-transactioninputsize) | [validateWalletPayment](#function-validatewalletpayment) |
| [getSyncChunk](#function-getsyncchunk) | [transactionOutputSize](#function-transactionoutputsize) | [varUintSize](#function-varuintsize) |
| [internalizeAction](#function-internalizeaction) | [transactionSize](#function-transactionsize) | [verifyHexString](#function-verifyhexstring) |
| [internalizeAction](#function-internalizeaction) | [updateChaintracksFiatExchangeRates](#function-updatechaintracksfiatexchangerates) | [verifyId](#function-verifyid) |
| [isBaseBlockHeader](#function-isbaseblockheader) | [updateExchangeratesapi](#function-updateexchangeratesapi) | [verifyInteger](#function-verifyinteger) |
| [isBlockHeader](#function-isblockheader) | [validateAbortActionArgs](#function-validateabortactionargs) | [verifyNumber](#function-verifynumber) |
| [isCreateActionSpecOp](#function-iscreateactionspecop) | [validateAcquireCertificateArgs](#function-validateacquirecertificateargs) | [verifyOne](#function-verifyone) |
| [isHexString](#function-ishexstring) | [validateAcquireDirectCertificateArgs](#function-validateacquiredirectcertificateargs) | [verifyOneOrNone](#function-verifyoneornone) |
| [isListActionsSpecOp](#function-islistactionsspecop) | [validateAcquireIssuanceCertificateArgs](#function-validateacquireissuancecertificateargs) | [verifyOptionalHexString](#function-verifyoptionalhexstring) |
| [isListOutputsSpecOp](#function-islistoutputsspecop) | [validateBasketInsertion](#function-validatebasketinsertion) | [verifyTruthy](#function-verifytruthy) |
| [isLive](#function-islive) | [validateCreateActionArgs](#function-validatecreateactionargs) | [verifyUnlockScripts](#function-verifyunlockscripts) |
| [isLiveBlockHeader](#function-isliveblockheader) | [validateCreateActionInput](#function-validatecreateactioninput) | [wait](#function-wait) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Function: acquireDirectCertificate

```ts
export async function acquireDirectCertificate(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidAcquireDirectCertificateArgs): Promise<AcquireCertificateResult> 
```

See also: [AuthId](./client.md#interface-authid), [ValidAcquireDirectCertificateArgs](./client.md#interface-validacquiredirectcertificateargs), [Wallet](./client.md#class-wallet)

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
##### Function: arraysEqual

Compares lengths and direct equality of values.

```ts
export function arraysEqual(arr1: Number[], arr2: Number[]) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: asArray

```ts
export function asArray(val: string | number[]): number[] 
```

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

Coerce a value to a hex encoded string if currently a hex encoded string or number[]

```ts
export function asString(val: string | number[]): string {
    if (typeof val === "string")
        return val;
    return Utils.toHex(val);
}
```

Returns

input val if it is a string; or if number[], converts byte values to hex

Argument Details

+ **val**
  + string or number[]. If string, encoding must be hex. If number[], each value must be 0..255.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: attemptToPostReqsToNetwork

Attempt to post one or more `ProvenTxReq` with status 'unsent'
to the bitcoin network.

```ts
export async function attemptToPostReqsToNetwork(storage: StorageProvider, reqs: EntityProvenTxReq[], trx?: sdk.TrxToken): Promise<PostReqsToNetworkResult> 
```

See also: [EntityProvenTxReq](./storage.md#class-entityproventxreq), [PostReqsToNetworkResult](./storage.md#interface-postreqstonetworkresult), [StorageProvider](./storage.md#class-storageprovider), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: buildSignableTransaction

```ts
export function buildSignableTransaction(dctr: sdk.StorageCreateActionResult, args: sdk.ValidCreateActionArgs, wallet: Wallet): {
    tx: Transaction;
    amount: number;
    pdi: PendingStorageInput[];
    log: string;
} 
```

See also: [PendingStorageInput](./client.md#interface-pendingstorageinput), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: completeSignedTransaction

```ts
export async function completeSignedTransaction(prior: PendingSignAction, spends: Record<number, SignActionSpend>, wallet: Wallet): Promise<Transaction> 
```

See also: [PendingSignAction](./client.md#interface-pendingsignaction), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: convertProofToMerklePath

```ts
export function convertProofToMerklePath(txid: string, proof: TscMerkleProofApi): MerklePath 
```

See also: [TscMerkleProofApi](./client.md#interface-tscmerkleproofapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createAction

```ts
export async function createAction(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidCreateActionArgs): Promise<CreateActionResultX> 
```

See also: [AuthId](./client.md#interface-authid), [CreateActionResultX](./client.md#interface-createactionresultx), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createAction

```ts
export async function createAction(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidCreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<sdk.StorageCreateActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageProvider](./storage.md#class-storageprovider), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: createDefaultWalletServicesOptions

```ts
export function createDefaultWalletServicesOptions(chain: sdk.Chain): sdk.WalletServicesOptions 
```

See also: [Chain](./client.md#type-chain), [WalletServicesOptions](./client.md#interface-walletservicesoptions)

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
##### Function: doubleSha256BE

Calculate the SHA256 hash of the SHA256 hash of an array of bytes.

```ts
export function doubleSha256BE(data: number[]): number[] {
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
export function doubleSha256LE(data: number[]): number[] {
    const first = new Hash.SHA256().update(data).digest();
    const second = new Hash.SHA256().update(first).digest();
    return second;
}
```

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
export async function generateChangeSdk(params: GenerateChangeSdkParams, allocateChangeInput: (targetSatoshis: number, exactSatoshis?: number) => Promise<GenerateChangeSdkChangeInput | undefined>, releaseChangeInput: (outputId: number) => Promise<void>): Promise<GenerateChangeSdkResult> 
```

See also: [GenerateChangeSdkChangeInput](./storage.md#interface-generatechangesdkchangeinput), [GenerateChangeSdkParams](./storage.md#interface-generatechangesdkparams), [GenerateChangeSdkResult](./storage.md#interface-generatechangesdkresult)

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
export async function getBeefForTransaction(storage: StorageProvider, txid: string, options: sdk.StorageGetBeefOptions): Promise<Beef> 
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
export async function getSyncChunk(storage: StorageReader, args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
```

See also: [RequestSyncChunkArgs](./client.md#interface-requestsyncchunkargs), [StorageReader](./storage.md#class-storagereader), [SyncChunk](./client.md#interface-syncchunk)

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
export async function internalizeAction(wallet: Wallet, auth: sdk.AuthId, args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [Wallet](./client.md#class-wallet)

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
export async function internalizeAction(storage: StorageProvider, auth: sdk.AuthId, args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProvider](./storage.md#class-storageprovider)

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
##### Function: isHexString

```ts
export function isHexString(s: string): boolean 
```

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
##### Function: listActionsIdb

```ts
export async function listActionsIdb(storage: StorageIdb, auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageIdb](./storage.md#class-storageidb), [ValidListActionsArgs](./client.md#interface-validlistactionsargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: listCertificates

```ts
export async function listCertificates(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageProvider](./storage.md#class-storageprovider), [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: listOutputsIdb

```ts
export async function listOutputsIdb(storage: StorageIdb, auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageIdb](./storage.md#class-storageidb), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs)

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
##### Function: makeAtomicBeef

```ts
export function makeAtomicBeef(tx: Transaction, beef: number[] | Beef): number[] 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: makeChangeLock

Derive a change output locking script

```ts
export function makeChangeLock(out: sdk.StorageCreateTransactionSdkOutput, dctr: sdk.StorageCreateActionResult, args: sdk.ValidCreateActionArgs, changeKeys: sdk.KeyPair, wallet: Wallet): Script 
```

See also: [KeyPair](./client.md#interface-keypair), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageCreateTransactionSdkOutput](./client.md#interface-storagecreatetransactionsdkoutput), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: maxDate

```ts
export function maxDate(d1?: Date, d2?: Date): Date | undefined 
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
##### Function: parseWalletOutpoint

```ts
export function parseWalletOutpoint(outpoint: string): {
    txid: string;
    vout: number;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: processAction

```ts
export async function processAction(prior: PendingSignAction | undefined, wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
```

See also: [AuthId](./client.md#interface-authid), [PendingSignAction](./client.md#interface-pendingsignaction), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [ValidProcessActionArgs](./client.md#interface-validprocessactionargs), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: processAction

```ts
export async function processAction(storage: StorageProvider, auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
```

See also: [AuthId](./client.md#interface-authid), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: proveCertificate

```ts
export async function proveCertificate(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidProveCertificateArgs): Promise<ProveCertificateResult> 
```

See also: [AuthId](./client.md#interface-authid), [ValidProveCertificateArgs](./client.md#interface-validprovecertificateargs), [Wallet](./client.md#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: purgeDataIdb

```ts
export async function purgeDataIdb(storage: StorageIdb, params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
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
##### Function: setDisableDoubleSpendCheckForTest

```ts
export function setDisableDoubleSpendCheckForTest(v: boolean) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: sha256Hash

Calculate the SHA256 hash of an array of bytes

```ts
export function sha256Hash(data: number[]): number[] {
    const first = new Hash.SHA256().update(data).digest();
    return first;
}
```

Returns

sha256 hash of buffer contents.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: shareReqsWithWorld

Verifies that all the txids are known reqs with ready-to-share status.
Assigns a batch identifier and updates all the provenTxReqs.
If not isDelayed, triggers an initial attempt to broadcast the batch and returns the results.

```ts
export async function shareReqsWithWorld(storage: StorageProvider, userId: number, txids: string[], isDelayed: boolean): Promise<{
    swr: SendWithResult[];
    ndr: ReviewActionResult[] | undefined;
}> 
```

See also: [ReviewActionResult](./client.md#interface-reviewactionresult), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: signAction

```ts
export async function signAction(wallet: Wallet, auth: sdk.AuthId, args: SignActionArgs): Promise<SignActionResultX> 
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
##### Function: validateAbortActionArgs

```ts
export function validateAbortActionArgs(args: AbortActionArgs): ValidAbortActionArgs 
```

See also: [ValidAbortActionArgs](./client.md#interface-validabortactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateAcquireCertificateArgs

```ts
export async function validateAcquireCertificateArgs(args: AcquireCertificateArgs): Promise<ValidAcquireCertificateArgs> 
```

See also: [ValidAcquireCertificateArgs](./client.md#interface-validacquirecertificateargs)

Argument Details

+ **subject**
  + Must be valid for "direct" `acquisitionProtocol`. public key of the certificate subject.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateAcquireDirectCertificateArgs

```ts
export function validateAcquireDirectCertificateArgs(args: AcquireCertificateArgs): ValidAcquireDirectCertificateArgs 
```

See also: [ValidAcquireDirectCertificateArgs](./client.md#interface-validacquiredirectcertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateAcquireIssuanceCertificateArgs

```ts
export function validateAcquireIssuanceCertificateArgs(args: AcquireCertificateArgs): ValidAcquireIssuanceCertificateArgs 
```

See also: [ValidAcquireIssuanceCertificateArgs](./client.md#interface-validacquireissuancecertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateBasketInsertion

```ts
export function validateBasketInsertion(args?: BasketInsertion): ValidBasketInsertion | undefined 
```

See also: [ValidBasketInsertion](./client.md#interface-validbasketinsertion)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateCreateActionArgs

```ts
export function validateCreateActionArgs(args: CreateActionArgs): ValidCreateActionArgs 
```

See also: [ValidCreateActionArgs](./client.md#interface-validcreateactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateCreateActionInput

```ts
export function validateCreateActionInput(i: CreateActionInput): ValidCreateActionInput 
```

See also: [ValidCreateActionInput](./client.md#interface-validcreateactioninput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateCreateActionOptions

Set all default true/false booleans to true or false if undefined.
Set all possibly undefined numbers to their default values.
Set all possibly undefined arrays to empty arrays.
Convert string outpoints to `{ txid: string, vout: number }`

```ts
export function validateCreateActionOptions(options?: CreateActionOptions): ValidCreateActionOptions 
```

See also: [ValidCreateActionOptions](./client.md#interface-validcreateactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateCreateActionOutput

```ts
export function validateCreateActionOutput(o: CreateActionOutput): ValidCreateActionOutput 
```

See also: [ValidCreateActionOutput](./client.md#interface-validcreateactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateDiscoverByAttributesArgs

```ts
export function validateDiscoverByAttributesArgs(args: DiscoverByAttributesArgs): ValidDiscoverByAttributesArgs 
```

See also: [ValidDiscoverByAttributesArgs](./client.md#interface-validdiscoverbyattributesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateDiscoverByIdentityKeyArgs

```ts
export function validateDiscoverByIdentityKeyArgs(args: DiscoverByIdentityKeyArgs): ValidDiscoverByIdentityKeyArgs 
```

See also: [ValidDiscoverByIdentityKeyArgs](./client.md#interface-validdiscoverbyidentitykeyargs)

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
##### Function: validateInteger

```ts
export function validateInteger(v: number | undefined, name: string, defaultValue?: number, min?: number, max?: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateInternalizeActionArgs

```ts
export function validateInternalizeActionArgs(args: InternalizeActionArgs): ValidInternalizeActionArgs 
```

See also: [ValidInternalizeActionArgs](./client.md#interface-validinternalizeactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateInternalizeOutput

```ts
export function validateInternalizeOutput(args: InternalizeOutput): ValidInternalizeOutput 
```

See also: [ValidInternalizeOutput](./client.md#interface-validinternalizeoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateListActionsArgs

```ts
export function validateListActionsArgs(args: ListActionsArgs): ValidListActionsArgs 
```

See also: [ValidListActionsArgs](./client.md#interface-validlistactionsargs)

Argument Details

+ **args.labels**
  + An array of labels used to filter actions.
+ **args.labelQueryMode**
  + Optional. Specifies how to match labels (default is any which matches any of the labels).
+ **args.includeLabels**
  + Optional. Whether to include transaction labels in the result set.
+ **args.includeInputs**
  + Optional. Whether to include input details in the result set.
+ **args.includeInputSourceLockingScripts**
  + Optional. Whether to include input source locking scripts in the result set.
+ **args.includeInputUnlockingScripts**
  + Optional. Whether to include input unlocking scripts in the result set.
+ **args.includeOutputs**
  + Optional. Whether to include output details in the result set.
+ **args.includeOutputLockingScripts**
  + Optional. Whether to include output locking scripts in the result set.
+ **args.limit**
  + Optional. The maximum number of transactions to retrieve.
+ **args.offset**
  + Optional. Number of transactions to skip before starting to return the results.
+ **args.seekPermission**
  + — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateListCertificatesArgs

```ts
export function validateListCertificatesArgs(args: ListCertificatesArgs): ValidListCertificatesArgs 
```

See also: [ValidListCertificatesArgs](./client.md#interface-validlistcertificatesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateListOutputsArgs

```ts
export function validateListOutputsArgs(args: ListOutputsArgs): ValidListOutputsArgs 
```

See also: [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs)

Argument Details

+ **args.basket**
  + Required. The associated basket name whose outputs should be listed.
+ **args.tags**
  + Optional. Filter outputs based on these tags.
+ **args.tagQueryMode**
  + Optional. Filter mode, defining whether all or any of the tags must match. By default, any tag can match.
+ **args.include**
  + Optional. Whether to include locking scripts (with each output) or entire transactions (as aggregated BEEF, at the top level) in the result. By default, unless specified, neither are returned.
+ **args.includeEntireTransactions**
  + Optional. Whether to include the entire transaction(s) in the result.
+ **args.includeCustomInstructions**
  + Optional. Whether custom instructions should be returned in the result.
+ **args.includeTags**
  + Optional. Whether the tags associated with the output should be returned.
+ **args.includeLabels**
  + Optional. Whether the labels associated with the transaction containing the output should be returned.
+ **args.limit**
  + Optional limit on the number of outputs to return.
+ **args.offset**
  + Optional. Number of outputs to skip before starting to return results.
+ **args.seekPermission**
  + — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateOptionalInteger

```ts
export function validateOptionalInteger(v: number | undefined, name: string, min?: number, max?: number): number | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateOptionalOutpointString

```ts
export function validateOptionalOutpointString(outpoint: string | undefined, name: string): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateOriginator

```ts
export function validateOriginator(s?: string): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateOutpointString

```ts
export function validateOutpointString(outpoint: string, name: string): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validatePositiveIntegerOrZero

```ts
export function validatePositiveIntegerOrZero(v: number, name: string): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateProveCertificateArgs

```ts
export function validateProveCertificateArgs(args: ProveCertificateArgs): ValidProveCertificateArgs 
```

See also: [ValidProveCertificateArgs](./client.md#interface-validprovecertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateRelinquishCertificateArgs

```ts
export function validateRelinquishCertificateArgs(args: RelinquishCertificateArgs): ValidRelinquishCertificateArgs 
```

See also: [ValidRelinquishCertificateArgs](./client.md#interface-validrelinquishcertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateRelinquishOutputArgs

```ts
export function validateRelinquishOutputArgs(args: RelinquishOutputArgs): ValidRelinquishOutputArgs 
```

See also: [ValidRelinquishOutputArgs](./client.md#interface-validrelinquishoutputargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateSatoshis

```ts
export function validateSatoshis(v: number | undefined, name: string, min?: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateScriptHash

```ts
export function validateScriptHash(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat): string 
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
##### Function: validateSignActionArgs

```ts
export function validateSignActionArgs(args: SignActionArgs): ValidSignActionArgs 
```

See also: [ValidSignActionArgs](./client.md#interface-validsignactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateSignActionOptions

Set all default true/false booleans to true or false if undefined.
Set all possibly undefined numbers to their default values.
Set all possibly undefined arrays to empty arrays.
Convert string outpoints to `{ txid: string, vout: number }`

```ts
export function validateSignActionOptions(options?: SignActionOptions): ValidSignActionOptions 
```

See also: [ValidSignActionOptions](./client.md#interface-validsignactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateStorageFeeModel

```ts
export function validateStorageFeeModel(v?: sdk.StorageFeeModel): sdk.StorageFeeModel 
```

See also: [StorageFeeModel](./client.md#interface-storagefeemodel)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateStringLength

```ts
export function validateStringLength(s: string, name: string, min?: number, max?: number): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: validateWalletPayment

```ts
export function validateWalletPayment(args?: WalletPayment): ValidWalletPayment | undefined 
```

See also: [ValidWalletPayment](./client.md#interface-validwalletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: varUintSize

Returns the byte size required to encode number as Bitcoin VarUint

```ts
export function varUintSize(val: number): 1 | 3 | 5 | 9 {
    if (val < 0)
        throw new sdk.WERR_INVALID_PARAMETER("varUint", "non-negative");
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
    return new Promise(resolve => setTimeout(resolve, msecs));
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Types

| | | |
| --- | --- | --- |
| [Chain](#type-chain) | [GetUtxoStatusService](#type-getutxostatusservice) | [ReviewActionResultStatus](#type-reviewactionresultstatus) |
| [DBType](#type-dbtype) | [GroupedPermissionEventHandler](#type-groupedpermissioneventhandler) | [ScriptHashFormat](#type-scripthashformat) |
| [DescriptionString5to2000Bytes](#type-descriptionstring5to2000bytes) | [MonitorStorage](#type-monitorstorage) | [ServicesCallHistory](#type-servicescallhistory) |
| [EntityStorage](#type-entitystorage) | [PermissionEventHandler](#type-permissioneventhandler) | [StorageProvidedBy](#type-storageprovidedby) |
| [GetMerklePathService](#type-getmerklepathservice) | [PostBeefService](#type-postbeefservice) | [SyncProtocolVersion](#type-syncprotocolversion) |
| [GetRawTxService](#type-getrawtxservice) | [PostReqsToNetworkDetailsStatus](#type-postreqstonetworkdetailsstatus) | [SyncStatus](#type-syncstatus) |
| [GetScriptHashHistoryService](#type-getscripthashhistoryservice) | [PostTxsService](#type-posttxsservice) | [TransactionStatus](#type-transactionstatus) |
| [GetStatusForTxidsService](#type-getstatusfortxidsservice) | [ProvenTxReqStatus](#type-proventxreqstatus) | [UpdateFiatExchangeRateService](#type-updatefiatexchangerateservice) |
| [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat) | [ReqHistoryNote](#type-reqhistorynote) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Type: Chain

```ts
export type Chain = "main" | "test"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: DBType

```ts
export type DBType = "SQLite" | "MySQL" | "IndexedDB"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: DescriptionString5to2000Bytes

```ts
export type DescriptionString5to2000Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Type: EntityStorage

```ts
export type EntityStorage = StorageProvider
```

See also: [StorageProvider](./storage.md#class-storageprovider)

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
#### Variables

| | |
| --- | --- |
| [DEFAULT_PROFILE_ID](#variable-default_profile_id) | [parseResults](#variable-parseresults) |
| [DEFAULT_SETTINGS](#variable-default_settings) | [queryOverlay](#variable-queryoverlay) |
| [PBKDF2_NUM_ROUNDS](#variable-pbkdf2_num_rounds) | [specOpFailedActions](#variable-specopfailedactions) |
| [ProvenTxReqNonTerminalStatus](#variable-proventxreqnonterminalstatus) | [specOpInvalidChange](#variable-specopinvalidchange) |
| [ProvenTxReqTerminalStatus](#variable-proventxreqterminalstatus) | [specOpNoSendActions](#variable-specopnosendactions) |
| [TESTNET_DEFAULT_SETTINGS](#variable-testnet_default_settings) | [specOpSetWalletChangeParams](#variable-specopsetwalletchangeparams) |
| [brc29ProtocolID](#variable-brc29protocolid) | [specOpThrowReviewActions](#variable-specopthrowreviewactions) |
| [getBasketToSpecOp](#variable-getbaskettospecop) | [specOpWalletBalance](#variable-specopwalletbalance) |
| [getLabelToSpecOp](#variable-getlabeltospecop) | [transactionColumnsWithoutRawTx](#variable-transactioncolumnswithoutrawtx) |
| [maxPossibleSatoshis](#variable-maxpossiblesatoshis) | [transformVerifiableCertificatesWithTrust](#variable-transformverifiablecertificateswithtrust) |
| [outputColumnsWithoutLockingScript](#variable-outputcolumnswithoutlockingscript) |  |

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
    theme: { mode: "dark" }
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
##### Variable: brc29ProtocolID

```ts
brc29ProtocolID: WalletProtocol = [2, "3241645161d8"]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: getBasketToSpecOp

```ts
getBasketToSpecOp: () => Record<string, ListOutputsSpecOp> = () => {
    return {
        [sdk.specOpWalletBalance]: {
            name: "totalOutputsIsWalletBalance",
            useBasket: "default",
            ignoreLimit: true,
            resultFromOutputs: async (s: StorageProvider, auth: sdk.AuthId, vargs: ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]): Promise<ListOutputsResult> => {
                let totalOutputs = 0;
                for (const o of outputs)
                    totalOutputs += o.satoshis;
                return { totalOutputs, outputs: [] };
            }
        },
        [sdk.specOpInvalidChange]: {
            name: "invalidChangeOutputs",
            useBasket: "default",
            ignoreLimit: true,
            includeOutputScripts: true,
            includeSpent: false,
            tagsToIntercept: ["release", "all"],
            filterOutputs: async (s: StorageProvider, auth: sdk.AuthId, vargs: ValidListOutputsArgs, specOpTags: string[], outputs: TableOutput[]): Promise<TableOutput[]> => {
                const filteredOutputs: TableOutput[] = [];
                const services = s.getServices();
                for (const o of outputs) {
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
        [sdk.specOpSetWalletChangeParams]: {
            name: "setWalletChangeParams",
            tagsParamsCount: 2,
            resultFromTags: async (s: StorageProvider, auth: sdk.AuthId, vargs: ValidListOutputsArgs, specOpTags: string[]): Promise<ListOutputsResult> => {
                if (specOpTags.length !== 2)
                    throw new sdk.WERR_INVALID_PARAMETER("numberOfDesiredUTXOs and minimumDesiredUTXOValue", "valid");
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

See also: [AuthId](./client.md#interface-authid), [ListOutputsSpecOp](./storage.md#interface-listoutputsspecop), [StorageProvider](./storage.md#class-storageprovider), [TableOutput](./storage.md#interface-tableoutput), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WERR_INVALID_PARAMETER](./client.md#class-werr_invalid_parameter), [specOpInvalidChange](./client.md#variable-specopinvalidchange), [specOpSetWalletChangeParams](./client.md#variable-specopsetwalletchangeparams), [specOpWalletBalance](./client.md#variable-specopwalletbalance), [verifyId](./client.md#function-verifyid), [verifyInteger](./client.md#function-verifyinteger), [verifyOne](./client.md#function-verifyone)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Variable: getLabelToSpecOp

```ts
getLabelToSpecOp: () => Record<string, ListActionsSpecOp> = () => {
    return {
        [sdk.specOpNoSendActions]: {
            name: "noSendActions",
            labelsToIntercept: ["abort"],
            setStatusFilter: () => ["nosend"],
            postProcess: async (s: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs, specOpLabels: string[], txs: Partial<TableTransaction>[]): Promise<void> => {
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
        [sdk.specOpFailedActions]: {
            name: "failedActions",
            labelsToIntercept: ["unfail"],
            setStatusFilter: () => ["failed"],
            postProcess: async (s: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs, specOpLabels: string[], txs: Partial<TableTransaction>[]): Promise<void> => {
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

See also: [AuthId](./client.md#interface-authid), [ListActionsSpecOp](./storage.md#interface-listactionsspecop), [StorageProvider](./storage.md#class-storageprovider), [TableTransaction](./storage.md#interface-tabletransaction), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [specOpFailedActions](./client.md#variable-specopfailedactions), [specOpNoSendActions](./client.md#variable-specopnosendactions)

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

<!--#endregion ts2md-api-merged-here-->