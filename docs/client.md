# API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

## Interfaces

| | | |
| --- | --- | --- |
| [ArcMinerGetTxData](#interface-arcminergettxdata) | [GetUtxoStatusDetails](#interface-getutxostatusdetails) | [SyncChunk](#interface-syncchunk) |
| [ArcMinerPostBeefDataApi](#interface-arcminerpostbeefdataapi) | [GetUtxoStatusResult](#interface-getutxostatusresult) | [TaskPurgeParams](#interface-taskpurgeparams) |
| [ArcMinerPostTxsData](#interface-arcminerposttxsdata) | [KeyPair](#interface-keypair) | [TrxToken](#interface-trxtoken) |
| [ArcServiceConfig](#interface-arcserviceconfig) | [MonitorOptions](#interface-monitoroptions) | [TscMerkleProofApi](#interface-tscmerkleproofapi) |
| [AuthId](#interface-authid) | [OutPoint](#interface-outpoint) | [TxScriptOffsets](#interface-txscriptoffsets) |
| [BaseBlockHeader](#interface-baseblockheader) | [Paged](#interface-paged) | [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs) |
| [BlockHeader](#interface-blockheader) | [PendingSignAction](#interface-pendingsignaction) | [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult) |
| [BsvExchangeRate](#interface-bsvexchangerate) | [PendingStorageInput](#interface-pendingstorageinput) | [ValidAbortActionArgs](#interface-validabortactionargs) |
| [CertOpsWallet](#interface-certopswallet) | [PostBeefResult](#interface-postbeefresult) | [ValidAcquireCertificateArgs](#interface-validacquirecertificateargs) |
| [CommitNewTxResults](#interface-commitnewtxresults) | [PostBeefResultForTxidApi](#interface-postbeefresultfortxidapi) | [ValidAcquireDirectCertificateArgs](#interface-validacquiredirectcertificateargs) |
| [EntityTimeStamp](#interface-entitytimestamp) | [PostReqsToNetworkDetails](#interface-postreqstonetworkdetails) | [ValidAcquireIssuanceCertificateArgs](#interface-validacquireissuancecertificateargs) |
| [ExchangeRatesIoApi](#interface-exchangeratesioapi) | [PostReqsToNetworkResult](#interface-postreqstonetworkresult) | [ValidBasketInsertion](#interface-validbasketinsertion) |
| [FiatExchangeRates](#interface-fiatexchangerates) | [PostTxResultForTxid](#interface-posttxresultfortxid) | [ValidCreateActionArgs](#interface-validcreateactionargs) |
| [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs) | [PostTxsResult](#interface-posttxsresult) | [ValidCreateActionInput](#interface-validcreateactioninput) |
| [FindCertificatesArgs](#interface-findcertificatesargs) | [ProcessSyncChunkResult](#interface-processsyncchunkresult) | [ValidCreateActionOptions](#interface-validcreateactionoptions) |
| [FindCommissionsArgs](#interface-findcommissionsargs) | [ProvenOrRawTx](#interface-provenorrawtx) | [ValidCreateActionOutput](#interface-validcreateactionoutput) |
| [FindForUserSincePagedArgs](#interface-findforusersincepagedargs) | [PurgeParams](#interface-purgeparams) | [ValidDiscoverByAttributesArgs](#interface-validdiscoverbyattributesargs) |
| [FindMonitorEventsArgs](#interface-findmonitoreventsargs) | [PurgeResults](#interface-purgeresults) | [ValidDiscoverByIdentityKeyArgs](#interface-validdiscoverbyidentitykeyargs) |
| [FindOutputBasketsArgs](#interface-findoutputbasketsargs) | [RequestSyncChunkArgs](#interface-requestsyncchunkargs) | [ValidInternalizeActionArgs](#interface-validinternalizeactionargs) |
| [FindOutputTagMapsArgs](#interface-findoutputtagmapsargs) | [ScriptTemplateParamsSABPPP](#interface-scripttemplateparamssabppp) | [ValidInternalizeOutput](#interface-validinternalizeoutput) |
| [FindOutputTagsArgs](#interface-findoutputtagsargs) | [ScriptTemplateUnlock](#interface-scripttemplateunlock) | [ValidListActionsArgs](#interface-validlistactionsargs) |
| [FindOutputsArgs](#interface-findoutputsargs) | [SetupEnv](#interface-setupenv) | [ValidListCertificatesArgs](#interface-validlistcertificatesargs) |
| [FindPartialSincePagedArgs](#interface-findpartialsincepagedargs) | [SetupWallet](#interface-setupwallet) | [ValidListOutputsArgs](#interface-validlistoutputsargs) |
| [FindProvenTxReqsArgs](#interface-findproventxreqsargs) | [SetupWalletArgs](#interface-setupwalletargs) | [ValidProcessActionArgs](#interface-validprocessactionargs) |
| [FindProvenTxsArgs](#interface-findproventxsargs) | [SetupWalletClient](#interface-setupwalletclient) | [ValidProcessActionOptions](#interface-validprocessactionoptions) |
| [FindSincePagedArgs](#interface-findsincepagedargs) | [SetupWalletClientArgs](#interface-setupwalletclientargs) | [ValidProveCertificateArgs](#interface-validprovecertificateargs) |
| [FindSyncStatesArgs](#interface-findsyncstatesargs) | [StorageCreateActionResult](#interface-storagecreateactionresult) | [ValidRelinquishCertificateArgs](#interface-validrelinquishcertificateargs) |
| [FindTransactionsArgs](#interface-findtransactionsargs) | [StorageCreateTransactionSdkInput](#interface-storagecreatetransactionsdkinput) | [ValidRelinquishOutputArgs](#interface-validrelinquishoutputargs) |
| [FindTxLabelMapsArgs](#interface-findtxlabelmapsargs) | [StorageCreateTransactionSdkOutput](#interface-storagecreatetransactionsdkoutput) | [ValidSignActionArgs](#interface-validsignactionargs) |
| [FindTxLabelsArgs](#interface-findtxlabelsargs) | [StorageFeeModel](#interface-storagefeemodel) | [ValidSignActionOptions](#interface-validsignactionoptions) |
| [FindUsersArgs](#interface-findusersargs) | [StorageGetBeefOptions](#interface-storagegetbeefoptions) | [ValidWalletPayment](#interface-validwalletpayment) |
| [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput) | [StorageIdentity](#interface-storageidentity) | [ValidWalletSignerArgs](#interface-validwalletsignerargs) |
| [GenerateChangeSdkChangeOutput](#interface-generatechangesdkchangeoutput) | [StorageInternalizeActionResult](#interface-storageinternalizeactionresult) | [WalletArgs](#interface-walletargs) |
| [GenerateChangeSdkInput](#interface-generatechangesdkinput) | [StorageProcessActionArgs](#interface-storageprocessactionargs) | [WalletServices](#interface-walletservices) |
| [GenerateChangeSdkOutput](#interface-generatechangesdkoutput) | [StorageProcessActionResults](#interface-storageprocessactionresults) | [WalletServicesOptions](#interface-walletservicesoptions) |
| [GenerateChangeSdkParams](#interface-generatechangesdkparams) | [StorageProvenOrReq](#interface-storageprovenorreq) | [WalletSigner](#interface-walletsigner) |
| [GenerateChangeSdkResult](#interface-generatechangesdkresult) | [StorageProviderOptions](#interface-storageprovideroptions) | [WalletStorage](#interface-walletstorage) |
| [GenerateChangeSdkStorageChange](#interface-generatechangesdkstoragechange) | [StorageReaderOptions](#interface-storagereaderoptions) | [WalletStorageProvider](#interface-walletstorageprovider) |
| [GetMerklePathResult](#interface-getmerklepathresult) | [StorageReaderWriterOptions](#interface-storagereaderwriteroptions) | [WalletStorageReader](#interface-walletstoragereader) |
| [GetRawTxResult](#interface-getrawtxresult) | [StorageSyncReader](#interface-storagesyncreader) | [WalletStorageSync](#interface-walletstoragesync) |
| [GetReqsAndBeefDetail](#interface-getreqsandbeefdetail) | [StorageSyncReaderOptions](#interface-storagesyncreaderoptions) | [WalletStorageWriter](#interface-walletstoragewriter) |
| [GetReqsAndBeefResult](#interface-getreqsandbeefresult) | [StorageSyncReaderWriter](#interface-storagesyncreaderwriter) | [XValidCreateActionOutput](#interface-xvalidcreateactionoutput) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Interface: ArcMinerGetTxData

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
### Interface: ArcMinerPostBeefDataApi

```ts
export interface ArcMinerPostBeefDataApi {
    status: number;
    title: string;
    blockHash?: string;
    blockHeight?: number;
    competingTxs?: null;
    extraInfo: string;
    merklePath?: string;
    timestamp?: string;
    txid?: string;
    txStatus?: string;
    type?: string;
    detail?: string;
    instance?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ArcMinerPostTxsData

```ts
export interface ArcMinerPostTxsData {
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
### Interface: ArcServiceConfig

```ts
export interface ArcServiceConfig {
    name: string;
    url: string;
    arcConfig: ArcConfig;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: AuthId

```ts
export interface AuthId {
    identityKey: string;
    userId?: number;
    isActive?: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: BaseBlockHeader

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

<details>

<summary>Interface BaseBlockHeader Details</summary>

#### Property bits

Block header bits value. Serialized length is 4 bytes.

```ts
bits: number
```

#### Property merkleRoot

Root hash of the merkle tree of all transactions in this block. Serialized length is 32 bytes.

```ts
merkleRoot: string
```

#### Property nonce

Block header nonce value. Serialized length is 4 bytes.

```ts
nonce: number
```

#### Property previousHash

Hash of previous block's block header. Serialized length is 32 bytes.

```ts
previousHash: string
```

#### Property time

Block header time value. Serialized length is 4 bytes.

```ts
time: number
```

#### Property version

Block header version value. Serialized length is 4 bytes.

```ts
version: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: BlockHeader

A `BaseBlockHeader` extended with its computed hash and height in its chain.

```ts
export interface BlockHeader extends BaseBlockHeader {
    height: number;
    hash: string;
}
```

See also: [BaseBlockHeader](#interface-baseblockheader)

<details>

<summary>Interface BlockHeader Details</summary>

#### Property hash

The double sha256 hash of the serialized `BaseBlockHeader` fields.

```ts
hash: string
```

#### Property height

Height of the header, starting from zero.

```ts
height: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: BsvExchangeRate

```ts
export interface BsvExchangeRate {
    timestamp: Date;
    base: "USD";
    rate: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: CertOpsWallet

```ts
export interface CertOpsWallet {
    getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetPublicKeyResult>;
    encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult>;
    decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: CommitNewTxResults

```ts
export interface CommitNewTxResults {
    req: entity.ProvenTxReq;
    log?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: EntityTimeStamp

```ts
export interface EntityTimeStamp {
    created_at: Date;
    updated_at: Date;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ExchangeRatesIoApi

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
### Interface: FiatExchangeRates

```ts
export interface FiatExchangeRates {
    timestamp: Date;
    base: "USD";
    rates: Record<string, number>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindCertificateFieldsArgs

```ts
export interface FindCertificateFieldsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.CertificateField>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindCertificatesArgs

```ts
export interface FindCertificatesArgs extends FindSincePagedArgs {
    partial: Partial<table.Certificate>;
    certifiers?: string[];
    types?: string[];
    includeFields?: boolean;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindCommissionsArgs

```ts
export interface FindCommissionsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.Commission>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindForUserSincePagedArgs

```ts
export interface FindForUserSincePagedArgs extends FindSincePagedArgs {
    userId: number;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindMonitorEventsArgs

```ts
export interface FindMonitorEventsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.MonitorEvent>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindOutputBasketsArgs

```ts
export interface FindOutputBasketsArgs extends FindSincePagedArgs {
    partial: Partial<table.OutputBasket>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindOutputTagMapsArgs

```ts
export interface FindOutputTagMapsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.OutputTagMap>;
    tagIds?: number[];
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindOutputTagsArgs

```ts
export interface FindOutputTagsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.OutputTag>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindOutputsArgs

```ts
export interface FindOutputsArgs extends FindSincePagedArgs {
    partial: Partial<table.Output>;
    noScript?: boolean;
    txStatus?: sdk.TransactionStatus[];
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs), [TransactionStatus](#type-transactionstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindPartialSincePagedArgs

```ts
export interface FindPartialSincePagedArgs<T extends object> extends FindSincePagedArgs {
    partial: Partial<T>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindProvenTxReqsArgs

```ts
export interface FindProvenTxReqsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.ProvenTxReq>;
    status?: sdk.ProvenTxReqStatus[];
    txids?: string[];
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs), [ProvenTxReqStatus](#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindProvenTxsArgs

```ts
export interface FindProvenTxsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.ProvenTx>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindSincePagedArgs

```ts
export interface FindSincePagedArgs {
    since?: Date;
    paged?: sdk.Paged;
    trx?: sdk.TrxToken;
}
```

See also: [Paged](#interface-paged), [TrxToken](#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindSyncStatesArgs

```ts
export interface FindSyncStatesArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.SyncState>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindTransactionsArgs

```ts
export interface FindTransactionsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.Transaction>;
    status?: sdk.TransactionStatus[];
    noRawTx?: boolean;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs), [TransactionStatus](#type-transactionstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindTxLabelMapsArgs

```ts
export interface FindTxLabelMapsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.TxLabelMap>;
    labelIds?: number[];
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindTxLabelsArgs

```ts
export interface FindTxLabelsArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.TxLabel>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: FindUsersArgs

```ts
export interface FindUsersArgs extends sdk.FindSincePagedArgs {
    partial: Partial<table.User>;
}
```

See also: [FindSincePagedArgs](#interface-findsincepagedargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkChangeInput

```ts
export interface GenerateChangeSdkChangeInput {
    outputId: number;
    satoshis: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkChangeOutput

```ts
export interface GenerateChangeSdkChangeOutput {
    satoshis: number;
    lockingScriptLength: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkInput

```ts
export interface GenerateChangeSdkInput {
    satoshis: number;
    unlockingScriptLength: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkOutput

```ts
export interface GenerateChangeSdkOutput {
    satoshis: number;
    lockingScriptLength: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkParams

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

See also: [GenerateChangeSdkInput](#interface-generatechangesdkinput), [GenerateChangeSdkOutput](#interface-generatechangesdkoutput), [StorageFeeModel](#interface-storagefeemodel)

<details>

<summary>Interface GenerateChangeSdkParams Details</summary>

#### Property changeFirstSatoshis

Lowest amount value to assign to a change output.
Drop the output if unable to satisfy.
default 285

```ts
changeFirstSatoshis: number
```

#### Property changeInitialSatoshis

Satoshi amount to initialize optional new change outputs.

```ts
changeInitialSatoshis: number
```

#### Property changeLockingScriptLength

Fixed change locking script length.

For P2PKH template, 25 bytes

```ts
changeLockingScriptLength: number
```

#### Property changeUnlockingScriptLength

Fixed change unlocking script length.

For P2PKH template, 107 bytes

```ts
changeUnlockingScriptLength: number
```

#### Property targetNetCount

Target for number of new change outputs added minus number of funding change outputs consumed.
If undefined, only a single change output will be added if excess fees must be recaptured.

```ts
targetNetCount?: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkResult

```ts
export interface GenerateChangeSdkResult {
    allocatedChangeInputs: GenerateChangeSdkChangeInput[];
    changeOutputs: GenerateChangeSdkChangeOutput[];
    size: number;
    fee: number;
    satsPerKb: number;
}
```

See also: [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput), [GenerateChangeSdkChangeOutput](#interface-generatechangesdkchangeoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GenerateChangeSdkStorageChange

```ts
export interface GenerateChangeSdkStorageChange extends GenerateChangeSdkChangeInput {
    spendable: boolean;
}
```

See also: [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GetMerklePathResult

Properties on result returned from `WalletServices` function `getMerkleProof`.

```ts
export interface GetMerklePathResult {
    name?: string;
    merklePath?: MerklePath;
    header?: BlockHeader;
    error?: sdk.WalletError;
}
```

See also: [BlockHeader](#interface-blockheader), [WalletError](#class-walleterror)

<details>

<summary>Interface GetMerklePathResult Details</summary>

#### Property error

The first exception error that occurred during processing, if any.

```ts
error?: sdk.WalletError
```
See also: [WalletError](#class-walleterror)

#### Property merklePath

Multiple proofs may be returned when a transaction also appears in
one or more orphaned blocks

```ts
merklePath?: MerklePath
```

#### Property name

The name of the service returning the proof, or undefined if no proof

```ts
name?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GetRawTxResult

Properties on result returned from `WalletServices` function `getRawTx`.

```ts
export interface GetRawTxResult {
    txid: string;
    name?: string;
    rawTx?: number[];
    error?: sdk.WalletError;
}
```

See also: [WalletError](#class-walleterror)

<details>

<summary>Interface GetRawTxResult Details</summary>

#### Property error

The first exception error that occurred during processing, if any.

```ts
error?: sdk.WalletError
```
See also: [WalletError](#class-walleterror)

#### Property name

The name of the service returning the rawTx, or undefined if no rawTx

```ts
name?: string
```

#### Property rawTx

Multiple proofs may be returned when a transaction also appears in
one or more orphaned blocks

```ts
rawTx?: number[]
```

#### Property txid

Transaction hash or rawTx (and of initial request)

```ts
txid: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GetReqsAndBeefDetail

```ts
export interface GetReqsAndBeefDetail {
    txid: string;
    req?: table.ProvenTxReq;
    proven?: table.ProvenTx;
    status: "readyToSend" | "alreadySent" | "error" | "unknown";
    error?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GetReqsAndBeefResult

```ts
export interface GetReqsAndBeefResult {
    beef: Beef;
    details: GetReqsAndBeefDetail[];
}
```

See also: [GetReqsAndBeefDetail](#interface-getreqsandbeefdetail)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GetUtxoStatusDetails

```ts
export interface GetUtxoStatusDetails {
    height?: number;
    txid?: string;
    index?: number;
    satoshis?: number;
}
```

<details>

<summary>Interface GetUtxoStatusDetails Details</summary>

#### Property height

if isUtxo, the block height containing the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
height?: number
```

#### Property index

if isUtxo, the output index in the transaction containing of the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
index?: number
```

#### Property satoshis

if isUtxo, the amount of the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
satoshis?: number
```

#### Property txid

if isUtxo, the transaction hash (txid) of the transaction containing the matching unspent transaction output

typically there will be only one, but future orphans can result in multiple values

```ts
txid?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: GetUtxoStatusResult

```ts
export interface GetUtxoStatusResult {
    name: string;
    status: "success" | "error";
    error?: sdk.WalletError;
    isUtxo?: boolean;
    details: GetUtxoStatusDetails[];
}
```

See also: [GetUtxoStatusDetails](#interface-getutxostatusdetails), [WalletError](#class-walleterror)

<details>

<summary>Interface GetUtxoStatusResult Details</summary>

#### Property details

Additional details about occurances of this output script as a utxo.

Normally there will be one item in the array but due to the possibility of orphan races
there could be more than one block in which it is a valid utxo.

```ts
details: GetUtxoStatusDetails[]
```
See also: [GetUtxoStatusDetails](#interface-getutxostatusdetails)

#### Property error

When status is 'error', provides code and description

```ts
error?: sdk.WalletError
```
See also: [WalletError](#class-walleterror)

#### Property isUtxo

true if the output is associated with at least one unspent transaction output

```ts
isUtxo?: boolean
```

#### Property name

The name of the service to which the transaction was submitted for processing

```ts
name: string
```

#### Property status

'success' - the operation was successful, non-error results are valid.
'error' - the operation failed, error may have relevant information.

```ts
status: "success" | "error"
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: KeyPair

```ts
export interface KeyPair {
    privateKey: string;
    publicKey: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: MonitorOptions

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

See also: [Chain](#type-chain), [MonitorStorage](#type-monitorstorage), [Services](#class-services)

<details>

<summary>Interface MonitorOptions Details</summary>

#### Property msecsWaitPerMerkleProofServiceReq

How many msecs to wait after each getMerkleProof service request.

```ts
msecsWaitPerMerkleProofServiceReq: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: OutPoint

Identifies a unique transaction output by its `txid` and index `vout`

```ts
export interface OutPoint {
    txid: string;
    vout: number;
}
```

<details>

<summary>Interface OutPoint Details</summary>

#### Property txid

Transaction double sha256 hash as big endian hex string

```ts
txid: string
```

#### Property vout

zero based output index within the transaction

```ts
vout: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: Paged

```ts
export interface Paged {
    limit: number;
    offset?: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PendingSignAction

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

See also: [PendingStorageInput](#interface-pendingstorageinput), [StorageCreateActionResult](#interface-storagecreateactionresult), [ValidCreateActionArgs](#interface-validcreateactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PendingStorageInput

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
### Interface: PostBeefResult

```ts
export interface PostBeefResult extends PostTxsResult {
}
```

See also: [PostTxsResult](#interface-posttxsresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PostBeefResultForTxidApi

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

<details>

<summary>Interface PostBeefResultForTxidApi Details</summary>

#### Property alreadyKnown

if true, the transaction was already known to this service. Usually treat as a success.

Potentially stop posting to additional transaction processors.

```ts
alreadyKnown?: boolean
```

#### Property status

'success' - The transaction was accepted for processing

```ts
status: "success" | "error"
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PostReqsToNetworkDetails

```ts
export interface PostReqsToNetworkDetails {
    txid: string;
    req: entity.ProvenTxReq;
    status: PostReqsToNetworkDetailsStatus;
    pbrft: sdk.PostTxResultForTxid;
    data?: string;
    error?: string;
}
```

See also: [PostReqsToNetworkDetailsStatus](#type-postreqstonetworkdetailsstatus), [PostTxResultForTxid](#interface-posttxresultfortxid)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PostReqsToNetworkResult

```ts
export interface PostReqsToNetworkResult {
    status: "success" | "error";
    beef: Beef;
    details: PostReqsToNetworkDetails[];
    pbr?: sdk.PostBeefResult;
    log: string;
}
```

See also: [PostBeefResult](#interface-postbeefresult), [PostReqsToNetworkDetails](#interface-postreqstonetworkdetails)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PostTxResultForTxid

```ts
export interface PostTxResultForTxid {
    txid: string;
    status: "success" | "error";
    alreadyKnown?: boolean;
    blockHash?: string;
    blockHeight?: number;
    merklePath?: MerklePath;
    data?: object;
}
```

<details>

<summary>Interface PostTxResultForTxid Details</summary>

#### Property alreadyKnown

if true, the transaction was already known to this service. Usually treat as a success.

Potentially stop posting to additional transaction processors.

```ts
alreadyKnown?: boolean
```

#### Property status

'success' - The transaction was accepted for processing

```ts
status: "success" | "error"
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PostTxsResult

Properties on array items of result returned from `WalletServices` function `postBeef`.

```ts
export interface PostTxsResult {
    name: string;
    status: "success" | "error";
    error?: sdk.WalletError;
    txidResults: PostTxResultForTxid[];
    data?: object;
}
```

See also: [PostTxResultForTxid](#interface-posttxresultfortxid), [WalletError](#class-walleterror)

<details>

<summary>Interface PostTxsResult Details</summary>

#### Property data

Service response object. Use service name and status to infer type of object.

```ts
data?: object
```

#### Property name

The name of the service to which the transaction was submitted for processing

```ts
name: string
```

#### Property status

'success' all txids returned status of 'success'
'error' one or more txids returned status of 'error'. See txidResults for details.

```ts
status: "success" | "error"
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ProcessSyncChunkResult

```ts
export interface ProcessSyncChunkResult {
    done: boolean;
    maxUpdated_at: Date | undefined;
    updates: number;
    inserts: number;
    error?: sdk.WalletError;
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ProvenOrRawTx

```ts
export interface ProvenOrRawTx {
    proven?: table.ProvenTx;
    rawTx?: number[];
    inputBEEF?: number[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PurgeParams

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

<details>

<summary>Interface PurgeParams Details</summary>

#### Property purgeCompletedAge

Minimum age in msecs for transient completed transaction data purge.
Default is 14 days.

```ts
purgeCompletedAge?: number
```

#### Property purgeFailedAge

Minimum age in msecs for failed transaction data purge.
Default is 14 days.

```ts
purgeFailedAge?: number
```

#### Property purgeSpentAge

Minimum age in msecs for failed transaction data purge.
Default is 14 days.

```ts
purgeSpentAge?: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: PurgeResults

```ts
export interface PurgeResults {
    count: number;
    log: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: RequestSyncChunkArgs

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

<details>

<summary>Interface RequestSyncChunkArgs Details</summary>

#### Property fromStorageIdentityKey

The storageIdentityKey of the storage supplying the update SyncChunk data.

```ts
fromStorageIdentityKey: string
```

#### Property identityKey

The identity of whose data is being requested

```ts
identityKey: string
```

#### Property maxItems

The maximum number of items (records) to be returned.

```ts
maxItems: number
```

#### Property maxRoughSize

A rough limit on how large the response should be.
The item that exceeds the limit is included and ends adding more items.

```ts
maxRoughSize: number
```

#### Property offsets

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

#### Property since

The max updated_at time received from the storage service receiving the request.
Will be undefiend if this is the first request or if no data was previously sync'ed.

`since` must include items if 'updated_at' is greater or equal. Thus, when not undefined, a sync request should always return at least one item already seen.

```ts
since?: Date
```

#### Property toStorageIdentityKey

The storageIdentityKey of the storage consuming the update SyncChunk data.

```ts
toStorageIdentityKey: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ScriptTemplateParamsSABPPP

```ts
export interface ScriptTemplateParamsSABPPP {
    derivationPrefix?: string;
    derivationSuffix?: string;
    keyDeriver: KeyDeriverApi;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ScriptTemplateUnlock

```ts
export interface ScriptTemplateUnlock {
    sign: (tx: Transaction, inputIndex: number) => Promise<UnlockingScript>;
    estimateLength: (tx: Transaction, inputIndex: number) => Promise<number>;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: SetupEnv

```ts
export interface SetupEnv {
    chain: sdk.Chain;
    identityKey: string;
    identityKey2: string;
    taalApiKey: string;
    devKeys: Record<string, string>;
    mySQLConnection: string;
}
```

See also: [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: SetupWallet

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

See also: [Chain](#type-chain), [Monitor](#class-monitor), [Services](#class-services), [Wallet](#class-wallet), [WalletStorageManager](#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: SetupWalletArgs

Arguments used to construct a `Wallet`

```ts
export interface SetupWalletArgs {
    env: SetupEnv;
    chain?: sdk.Chain;
    rootKeyHex?: string;
    privKeyHex?: string;
    active?: sdk.WalletStorageProvider;
    backups?: sdk.WalletStorageProvider[];
}
```

See also: [Chain](#type-chain), [SetupEnv](#interface-setupenv), [WalletStorageProvider](#interface-walletstorageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: SetupWalletClient

```ts
export interface SetupWalletClient extends SetupWallet {
    endpointUrl: string;
}
```

See also: [SetupWallet](#interface-setupwallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: SetupWalletClientArgs

```ts
export interface SetupWalletClientArgs extends SetupWalletArgs {
    endpointUrl?: string;
}
```

See also: [SetupWalletArgs](#interface-setupwalletargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageCreateActionResult

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

See also: [StorageCreateTransactionSdkInput](#interface-storagecreatetransactionsdkinput), [StorageCreateTransactionSdkOutput](#interface-storagecreatetransactionsdkoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageCreateTransactionSdkInput

```ts
export interface StorageCreateTransactionSdkInput {
    vin: number;
    sourceTxid: string;
    sourceVout: number;
    sourceSatoshis: number;
    sourceLockingScript: string;
    unlockingScriptLength: number;
    providedBy: StorageProvidedBy;
    type: string;
    spendingDescription?: string;
    derivationPrefix?: string;
    derivationSuffix?: string;
    senderIdentityKey?: string;
}
```

See also: [StorageProvidedBy](#type-storageprovidedby)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageCreateTransactionSdkOutput

```ts
export interface StorageCreateTransactionSdkOutput extends sdk.ValidCreateActionOutput {
    vout: number;
    providedBy: StorageProvidedBy;
    purpose?: string;
    derivationSuffix?: string;
}
```

See also: [StorageProvidedBy](#type-storageprovidedby), [ValidCreateActionOutput](#interface-validcreateactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageFeeModel

Specifies the available options for computing transaction fees.

```ts
export interface StorageFeeModel {
    model: "sat/kb";
    value?: number;
}
```

<details>

<summary>Interface StorageFeeModel Details</summary>

#### Property model

Available models. Currently only "sat/kb" is supported.

```ts
model: "sat/kb"
```

#### Property value

When "fee.model" is "sat/kb", this is an integer representing the number of satoshis per kb of block space
the transaction will pay in fees.

If undefined, the default value is used.

```ts
value?: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageGetBeefOptions

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

<details>

<summary>Interface StorageGetBeefOptions Details</summary>

#### Property ignoreNewProven

optional. Default is false. If true, raw transactions with proofs missing from `storage` and obtained from `getServices` are not inserted to `storage`.

```ts
ignoreNewProven?: boolean
```

#### Property ignoreServices

optional. Default is false. `getServices` is used for raw transaction and merkle proof lookup

```ts
ignoreServices?: boolean
```

#### Property ignoreStorage

optional. Default is false. `storage` is used for raw transaction and merkle proof lookup

```ts
ignoreStorage?: boolean
```

#### Property knownTxids

list of txids to be included as txidOnly if referenced. Validity is known to caller.

```ts
knownTxids?: string[]
```

#### Property mergeToBeef

optional. If defined, raw transactions and merkle paths required by txid are merged to this instance and returned. Otherwise a new Beef is constructed and returned.

```ts
mergeToBeef?: Beef | number[]
```

#### Property minProofLevel

optional. Default is zero. Ignores available merkle paths until recursion detpth equals or exceeds value

```ts
minProofLevel?: number
```

#### Property trustSelf

if 'known', txids known to local storage as valid are included as txidOnly

```ts
trustSelf?: "known"
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageIdentity

```ts
export interface StorageIdentity {
    storageIdentityKey: string;
    storageName: string;
}
```

<details>

<summary>Interface StorageIdentity Details</summary>

#### Property storageIdentityKey

The identity key (public key) assigned to this storage

```ts
storageIdentityKey: string
```

#### Property storageName

The human readable name assigned to this storage.

```ts
storageName: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageInternalizeActionResult

```ts
export interface StorageInternalizeActionResult extends InternalizeActionResult {
    isMerge: boolean;
    txid: string;
    satoshis: number;
}
```

<details>

<summary>Interface StorageInternalizeActionResult Details</summary>

#### Property isMerge

true if internalizing outputs on an existing storage transaction

```ts
isMerge: boolean
```

#### Property satoshis

net change in change balance for user due to this internalization

```ts
satoshis: number
```

#### Property txid

txid of transaction being internalized

```ts
txid: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageProcessActionArgs

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
### Interface: StorageProcessActionResults

```ts
export interface StorageProcessActionResults {
    sendWithResults?: SendWithResult[];
    log?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageProvenOrReq

```ts
export interface StorageProvenOrReq {
    proven?: table.ProvenTx;
    req?: table.ProvenTxReq;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageProviderOptions

```ts
export interface StorageProviderOptions extends StorageReaderWriterOptions {
    chain: sdk.Chain;
    feeModel: sdk.StorageFeeModel;
    commissionSatoshis: number;
    commissionPubKeyHex?: PubKeyHex;
}
```

See also: [Chain](#type-chain), [StorageFeeModel](#interface-storagefeemodel), [StorageReaderWriterOptions](#interface-storagereaderwriteroptions)

<details>

<summary>Interface StorageProviderOptions Details</summary>

#### Property commissionPubKeyHex

If commissionSatoshis is greater than zero, must be a valid public key hex string.
The actual locking script for each commission will use a public key derived
from this key by information stored in the commissions table.

```ts
commissionPubKeyHex?: PubKeyHex
```

#### Property commissionSatoshis

Transactions created by this Storage can charge a fee per transaction.
A value of zero disables commission fees.

```ts
commissionSatoshis: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageReaderOptions

```ts
export interface StorageReaderOptions {
    chain: sdk.Chain;
}
```

See also: [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageReaderWriterOptions

```ts
export interface StorageReaderWriterOptions extends StorageReaderOptions {
}
```

See also: [StorageReaderOptions](#interface-storagereaderoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageSyncReader

This is the minimal interface required for a WalletStorageProvider to export data to another provider.

```ts
export interface StorageSyncReader {
    isAvailable(): boolean;
    makeAvailable(): Promise<table.Settings>;
    destroy(): Promise<void>;
    getSettings(): table.Settings;
    findUserByIdentityKey(key: string): Promise<table.User | undefined>;
    findSyncStates(args: sdk.FindSyncStatesArgs): Promise<table.SyncState[]>;
    findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<table.CertificateField[]>;
    findCertificates(args: sdk.FindCertificatesArgs): Promise<table.Certificate[]>;
    findCommissions(args: sdk.FindCommissionsArgs): Promise<table.Commission[]>;
    findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]>;
    findOutputs(args: sdk.FindOutputsArgs): Promise<table.Output[]>;
    findOutputTags(args: sdk.FindOutputTagsArgs): Promise<table.OutputTag[]>;
    findTransactions(args: sdk.FindTransactionsArgs): Promise<table.Transaction[]>;
    findTxLabels(args: sdk.FindTxLabelsArgs): Promise<table.TxLabel[]>;
    getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTx[]>;
    getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTxReq[]>;
    getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.TxLabelMap[]>;
    getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.OutputTagMap[]>;
    getSyncChunk(args: RequestSyncChunkArgs): Promise<SyncChunk>;
}
```

See also: [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs), [FindCertificatesArgs](#interface-findcertificatesargs), [FindCommissionsArgs](#interface-findcommissionsargs), [FindForUserSincePagedArgs](#interface-findforusersincepagedargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputTagsArgs](#interface-findoutputtagsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindSyncStatesArgs](#interface-findsyncstatesargs), [FindTransactionsArgs](#interface-findtransactionsargs), [FindTxLabelsArgs](#interface-findtxlabelsargs), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [SyncChunk](#interface-syncchunk), [getSyncChunk](#function-getsyncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageSyncReaderOptions

```ts
export interface StorageSyncReaderOptions {
    chain: sdk.Chain;
}
```

See also: [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: StorageSyncReaderWriter

This is the minimal interface required for a WalletStorageProvider to import and export data to another provider.

```ts
export interface StorageSyncReaderWriter extends sdk.StorageSyncReader {
    getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx>;
    purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults>;
    transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T>;
    findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<table.OutputTagMap[]>;
    findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]>;
    findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<table.ProvenTx[]>;
    findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<table.TxLabelMap[]>;
    countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number>;
    countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number>;
    countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number>;
    countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number>;
    insertProvenTx(tx: table.ProvenTx, trx?: sdk.TrxToken): Promise<number>;
    insertProvenTxReq(tx: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<number>;
    insertUser(user: table.User, trx?: sdk.TrxToken): Promise<number>;
    insertCertificate(certificate: table.Certificate, trx?: sdk.TrxToken): Promise<number>;
    insertCertificateField(certificateField: table.CertificateField, trx?: sdk.TrxToken): Promise<void>;
    insertOutputBasket(basket: table.OutputBasket, trx?: sdk.TrxToken): Promise<number>;
    insertTransaction(tx: table.Transaction, trx?: sdk.TrxToken): Promise<number>;
    insertCommission(commission: table.Commission, trx?: sdk.TrxToken): Promise<number>;
    insertOutput(output: table.Output, trx?: sdk.TrxToken): Promise<number>;
    insertOutputTag(tag: table.OutputTag, trx?: sdk.TrxToken): Promise<number>;
    insertOutputTagMap(tagMap: table.OutputTagMap, trx?: sdk.TrxToken): Promise<void>;
    insertTxLabel(label: table.TxLabel, trx?: sdk.TrxToken): Promise<number>;
    insertTxLabelMap(labelMap: table.TxLabelMap, trx?: sdk.TrxToken): Promise<void>;
    insertSyncState(syncState: table.SyncState, trx?: sdk.TrxToken): Promise<number>;
    updateCertificateField(certificateId: number, fieldName: string, update: Partial<table.CertificateField>, trx?: sdk.TrxToken): Promise<number>;
    updateCertificate(id: number, update: Partial<table.Certificate>, trx?: sdk.TrxToken): Promise<number>;
    updateCommission(id: number, update: Partial<table.Commission>, trx?: sdk.TrxToken): Promise<number>;
    updateOutputBasket(id: number, update: Partial<table.OutputBasket>, trx?: sdk.TrxToken): Promise<number>;
    updateOutput(id: number, update: Partial<table.Output>, trx?: sdk.TrxToken): Promise<number>;
    updateOutputTagMap(outputId: number, tagId: number, update: Partial<table.OutputTagMap>, trx?: sdk.TrxToken): Promise<number>;
    updateOutputTag(id: number, update: Partial<table.OutputTag>, trx?: sdk.TrxToken): Promise<number>;
    updateProvenTxReq(id: number | number[], update: Partial<table.ProvenTxReq>, trx?: sdk.TrxToken): Promise<number>;
    updateProvenTxReqDynamics(id: number, update: Partial<table.ProvenTxReqDynamics>, trx?: sdk.TrxToken): Promise<number>;
    updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult>;
    updateProvenTx(id: number, update: Partial<table.ProvenTx>, trx?: sdk.TrxToken): Promise<number>;
    updateSyncState(id: number, update: Partial<table.SyncState>, trx?: sdk.TrxToken): Promise<number>;
    updateTransaction(id: number | number[], update: Partial<table.Transaction>, trx?: sdk.TrxToken): Promise<number>;
    updateTransactionStatus(status: sdk.TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: sdk.TrxToken): Promise<void>;
    updateTransactionsStatus(transactionIds: number[], status: sdk.TransactionStatus): Promise<void>;
    updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<table.TxLabelMap>, trx?: sdk.TrxToken): Promise<number>;
    updateTxLabel(id: number, update: Partial<table.TxLabel>, trx?: sdk.TrxToken): Promise<number>;
    updateUser(id: number, update: Partial<table.User>, trx?: sdk.TrxToken): Promise<number>;
    findCertificateById(id: number, trx?: sdk.TrxToken): Promise<table.Certificate | undefined>;
    findCommissionById(id: number, trx?: sdk.TrxToken): Promise<table.Commission | undefined>;
    findOutputById(id: number, trx?: sdk.TrxToken, noScript?: boolean): Promise<table.Output | undefined>;
    findOutputBasketById(id: number, trx?: sdk.TrxToken): Promise<table.OutputBasket | undefined>;
    findProvenTxById(id: number, trx?: sdk.TrxToken | undefined): Promise<table.ProvenTx | undefined>;
    findProvenTxReqById(id: number, trx?: sdk.TrxToken | undefined): Promise<table.ProvenTxReq | undefined>;
    findSyncStateById(id: number, trx?: sdk.TrxToken): Promise<table.SyncState | undefined>;
    findTransactionById(id: number, trx?: sdk.TrxToken, noRawTx?: boolean): Promise<table.Transaction | undefined>;
    findTxLabelById(id: number, trx?: sdk.TrxToken): Promise<table.TxLabel | undefined>;
    findOutputTagById(id: number, trx?: sdk.TrxToken): Promise<table.OutputTag | undefined>;
    findUserById(id: number, trx?: sdk.TrxToken): Promise<table.User | undefined>;
    findOrInsertUser(identityKey: string, trx?: sdk.TrxToken): Promise<{
        user: table.User;
        isNew: boolean;
    }>;
    findOrInsertTransaction(newTx: table.Transaction, trx?: sdk.TrxToken): Promise<{
        tx: table.Transaction;
        isNew: boolean;
    }>;
    findOrInsertOutputBasket(userId: number, name: string, trx?: sdk.TrxToken): Promise<table.OutputBasket>;
    findOrInsertTxLabel(userId: number, label: string, trx?: sdk.TrxToken): Promise<table.TxLabel>;
    findOrInsertTxLabelMap(transactionId: number, txLabelId: number, trx?: sdk.TrxToken): Promise<table.TxLabelMap>;
    findOrInsertOutputTag(userId: number, tag: string, trx?: sdk.TrxToken): Promise<table.OutputTag>;
    findOrInsertOutputTagMap(outputId: number, outputTagId: number, trx?: sdk.TrxToken): Promise<table.OutputTagMap>;
    findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: table.SyncState;
        isNew: boolean;
    }>;
    findOrInsertProvenTxReq(newReq: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<{
        req: table.ProvenTxReq;
        isNew: boolean;
    }>;
    findOrInsertProvenTx(newProven: table.ProvenTx, trx?: sdk.TrxToken): Promise<{
        proven: table.ProvenTx;
        isNew: boolean;
    }>;
    findUsers(args: sdk.FindUsersArgs): Promise<table.User[]>;
    tagOutput(partial: Partial<table.Output>, tag: string, trx?: sdk.TrxToken): Promise<void>;
    processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult>;
}
```

See also: [AuthId](#interface-authid), [FindOutputTagMapsArgs](#interface-findoutputtagmapsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [FindProvenTxsArgs](#interface-findproventxsargs), [FindTxLabelMapsArgs](#interface-findtxlabelmapsargs), [FindUsersArgs](#interface-findusersargs), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [ProvenOrRawTx](#interface-provenorrawtx), [PurgeParams](#interface-purgeparams), [PurgeResults](#interface-purgeresults), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageSyncReader](#class-storagesyncreader), [SyncChunk](#interface-syncchunk), [TransactionStatus](#type-transactionstatus), [TrxToken](#interface-trxtoken), [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: SyncChunk

Result received from remote `WalletStorage` in response to a `RequestSyncChunkArgs` request.

Each property is undefined if there was no attempt to update it. Typically this is caused by size and count limits on this result.

If all properties are empty arrays the sync process has received all available new and updated items.

```ts
export interface SyncChunk {
    fromStorageIdentityKey: string;
    toStorageIdentityKey: string;
    userIdentityKey: string;
    user?: table.User;
    provenTxs?: table.ProvenTx[];
    provenTxReqs?: table.ProvenTxReq[];
    outputBaskets?: table.OutputBasket[];
    txLabels?: table.TxLabel[];
    outputTags?: table.OutputTag[];
    transactions?: table.Transaction[];
    txLabelMaps?: table.TxLabelMap[];
    commissions?: table.Commission[];
    outputs?: table.Output[];
    outputTagMaps?: table.OutputTagMap[];
    certificates?: table.Certificate[];
    certificateFields?: table.CertificateField[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: TaskPurgeParams

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
export interface TaskPurgeParams extends sdk.PurgeParams {
}
```

See also: [PurgeParams](#interface-purgeparams)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: TrxToken

Place holder for the transaction control object used by actual storage provider implementation.

```ts
export interface TrxToken {
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: TscMerkleProofApi

```ts
export interface TscMerkleProofApi {
    height: number;
    index: number;
    nodes: string[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: TxScriptOffsets

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
### Interface: UpdateProvenTxReqWithNewProvenTxArgs

```ts
export interface UpdateProvenTxReqWithNewProvenTxArgs {
    provenTxReqId: number;
    txid: string;
    attempts: number;
    status: sdk.ProvenTxReqStatus;
    history: string;
    height: number;
    index: number;
    blockHash: string;
    merkleRoot: string;
    merklePath: number[];
}
```

See also: [ProvenTxReqStatus](#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: UpdateProvenTxReqWithNewProvenTxResult

```ts
export interface UpdateProvenTxReqWithNewProvenTxResult {
    status: sdk.ProvenTxReqStatus;
    history: string;
    provenTxId: number;
    log?: string;
}
```

See also: [ProvenTxReqStatus](#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidAbortActionArgs

```ts
export interface ValidAbortActionArgs extends ValidWalletSignerArgs {
    reference: Base64String;
}
```

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidAcquireCertificateArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidAcquireDirectCertificateArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

<details>

<summary>Interface ValidAcquireDirectCertificateArgs Details</summary>

#### Property subject

validated to an empty string, must be provided by wallet and must
match expectations of keyringForSubject

```ts
subject: PubKeyHex
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidAcquireIssuanceCertificateArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

<details>

<summary>Interface ValidAcquireIssuanceCertificateArgs Details</summary>

#### Property subject

validated to an empty string, must be provided by wallet and must
match expectations of keyringForSubject

```ts
subject: PubKeyHex
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidBasketInsertion

```ts
export interface ValidBasketInsertion {
    basket: BasketStringUnder300Bytes;
    customInstructions?: string;
    tags: BasketStringUnder300Bytes[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidCreateActionArgs

```ts
export interface ValidCreateActionArgs extends ValidProcessActionArgs {
    description: DescriptionString5to50Bytes;
    inputBEEF?: BEEF;
    inputs: sdk.ValidCreateActionInput[];
    outputs: sdk.ValidCreateActionOutput[];
    lockTime: number;
    version: number;
    labels: string[];
    options: ValidCreateActionOptions;
    isSignAction: boolean;
    randomVals?: number[];
}
```

See also: [ValidCreateActionInput](#interface-validcreateactioninput), [ValidCreateActionOptions](#interface-validcreateactionoptions), [ValidCreateActionOutput](#interface-validcreateactionoutput), [ValidProcessActionArgs](#interface-validprocessactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidCreateActionInput

```ts
export interface ValidCreateActionInput {
    outpoint: OutPoint;
    inputDescription: DescriptionString5to50Bytes;
    sequenceNumber: PositiveIntegerOrZero;
    unlockingScript?: HexString;
    unlockingScriptLength: PositiveInteger;
}
```

See also: [OutPoint](#interface-outpoint)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidCreateActionOptions

```ts
export interface ValidCreateActionOptions extends ValidProcessActionOptions {
    signAndProcess: boolean;
    trustSelf?: TrustSelf;
    knownTxids: TXIDHexString[];
    noSendChange: OutPoint[];
    randomizeOutputs: boolean;
}
```

See also: [OutPoint](#interface-outpoint), [ValidProcessActionOptions](#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidCreateActionOutput

```ts
export interface ValidCreateActionOutput {
    lockingScript: HexString;
    satoshis: SatoshiValue;
    outputDescription: DescriptionString5to50Bytes;
    basket?: BasketStringUnder300Bytes;
    customInstructions?: string;
    tags: BasketStringUnder300Bytes[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidDiscoverByAttributesArgs

```ts
export interface ValidDiscoverByAttributesArgs extends ValidWalletSignerArgs {
    attributes: Record<CertificateFieldNameUnder50Bytes, string>;
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    seekPermission: boolean;
}
```

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidDiscoverByIdentityKeyArgs

```ts
export interface ValidDiscoverByIdentityKeyArgs extends ValidWalletSignerArgs {
    identityKey: PubKeyHex;
    limit: PositiveIntegerDefault10Max10000;
    offset: PositiveIntegerOrZero;
    seekPermission: boolean;
}
```

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidInternalizeActionArgs

```ts
export interface ValidInternalizeActionArgs extends ValidWalletSignerArgs {
    tx: AtomicBEEF;
    outputs: InternalizeOutput[];
    description: DescriptionString5to50Bytes;
    labels: LabelStringUnder300Bytes[];
    seekPermission: BooleanDefaultTrue;
}
```

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidInternalizeOutput

```ts
export interface ValidInternalizeOutput {
    outputIndex: PositiveIntegerOrZero;
    protocol: "wallet payment" | "basket insertion";
    paymentRemittance?: ValidWalletPayment;
    insertionRemittance?: ValidBasketInsertion;
}
```

See also: [ValidBasketInsertion](#interface-validbasketinsertion), [ValidWalletPayment](#interface-validwalletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidListActionsArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidListCertificatesArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidListOutputsArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidProcessActionArgs

```ts
export interface ValidProcessActionArgs extends ValidWalletSignerArgs {
    options: sdk.ValidProcessActionOptions;
    isSendWith: boolean;
    isNewTx: boolean;
    isNoSend: boolean;
    isDelayed: boolean;
}
```

See also: [ValidProcessActionOptions](#interface-validprocessactionoptions), [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidProcessActionOptions

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
### Interface: ValidProveCertificateArgs

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

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidRelinquishCertificateArgs

```ts
export interface ValidRelinquishCertificateArgs extends ValidWalletSignerArgs {
    type: Base64String;
    serialNumber: Base64String;
    certifier: PubKeyHex;
}
```

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidRelinquishOutputArgs

```ts
export interface ValidRelinquishOutputArgs extends ValidWalletSignerArgs {
    basket: BasketStringUnder300Bytes;
    output: OutpointString;
}
```

See also: [ValidWalletSignerArgs](#interface-validwalletsignerargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidSignActionArgs

```ts
export interface ValidSignActionArgs extends ValidProcessActionArgs {
    spends: Record<PositiveIntegerOrZero, SignActionSpend>;
    reference: Base64String;
    options: sdk.ValidSignActionOptions;
}
```

See also: [ValidProcessActionArgs](#interface-validprocessactionargs), [ValidSignActionOptions](#interface-validsignactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidSignActionOptions

```ts
export interface ValidSignActionOptions extends ValidProcessActionOptions {
    acceptDelayedBroadcast: boolean;
    returnTXIDOnly: boolean;
    noSend: boolean;
    sendWith: TXIDHexString[];
}
```

See also: [ValidProcessActionOptions](#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidWalletPayment

```ts
export interface ValidWalletPayment {
    derivationPrefix: Base64String;
    derivationSuffix: Base64String;
    senderIdentityKey: PubKeyHex;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: ValidWalletSignerArgs

```ts
export interface ValidWalletSignerArgs {
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletArgs

```ts
export interface WalletArgs {
    chain: sdk.Chain;
    keyDeriver: KeyDeriver;
    storage: WalletStorageManager;
    services?: sdk.WalletServices;
    monitor?: Monitor;
    privilegedKeyManager?: sdk.PrivilegedKeyManager;
}
```

See also: [Chain](#type-chain), [Monitor](#class-monitor), [PrivilegedKeyManager](#class-privilegedkeymanager), [WalletServices](#interface-walletservices), [WalletStorageManager](#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletServices

Defines standard interfaces to access functionality implemented by external transaction processing services.

```ts
export interface WalletServices {
    chain: sdk.Chain;
    getChainTracker(): Promise<ChainTracker>;
    getHeaderForHeight(height: number): Promise<number[]>;
    getHeight(): Promise<number>;
    getBsvExchangeRate(): Promise<number>;
    getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number>;
    getRawTx(txid: string, useNext?: boolean): Promise<GetRawTxResult>;
    getMerklePath(txid: string, useNext?: boolean): Promise<GetMerklePathResult>;
    postTxs(beef: Beef, txids: string[]): Promise<PostTxsResult[]>;
    postBeef(beef: Beef, txids: string[]): Promise<PostBeefResult[]>;
    getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, useNext?: boolean): Promise<GetUtxoStatusResult>;
    hashToHeader(hash: string): Promise<sdk.BlockHeader>;
    nLockTimeIsFinal(txOrLockTime: string | number[] | BsvTransaction | number): Promise<boolean>;
}
```

See also: [BlockHeader](#interface-blockheader), [Chain](#type-chain), [GetMerklePathResult](#interface-getmerklepathresult), [GetRawTxResult](#interface-getrawtxresult), [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat), [GetUtxoStatusResult](#interface-getutxostatusresult), [PostBeefResult](#interface-postbeefresult), [PostTxsResult](#interface-posttxsresult)

<details>

<summary>Interface WalletServices Details</summary>

#### Property chain

The chain being serviced.

```ts
chain: sdk.Chain
```
See also: [Chain](#type-chain)

#### Method getBsvExchangeRate

Approximate exchange rate US Dollar / BSV, USD / BSV

This is the US Dollar price of one BSV

```ts
getBsvExchangeRate(): Promise<number>
```

#### Method getChainTracker

```ts
getChainTracker(): Promise<ChainTracker>
```

Returns

standard `ChainTracker` service which requires `options.chaintracks` be valid.

#### Method getFiatExchangeRate

Approximate exchange rate currency per base.

```ts
getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number>
```

#### Method getHeaderForHeight

```ts
getHeaderForHeight(height: number): Promise<number[]>
```

Returns

serialized block header for height on active chain

#### Method getHeight

```ts
getHeight(): Promise<number>
```

Returns

the height of the active chain

#### Method getMerklePath

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
See also: [GetMerklePathResult](#interface-getmerklepathresult)

Argument Details

+ **txid**
  + transaction hash for which proof is requested
+ **useNext**
  + optional, forces skip to next service before starting service requests cycle.

#### Method getRawTx

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
See also: [GetRawTxResult](#interface-getrawtxresult)

Argument Details

+ **txid**
  + transaction hash for which raw transaction bytes are requested
+ **useNext**
  + optional, forces skip to next service before starting service requests cycle.

#### Method getUtxoStatus

Attempts to determine the UTXO status of a transaction output.

Cycles through configured transaction processing services attempting to get a valid response.

```ts
getUtxoStatus(output: string, outputFormat?: GetUtxoStatusOutputFormat, useNext?: boolean): Promise<GetUtxoStatusResult>
```
See also: [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat), [GetUtxoStatusResult](#interface-getutxostatusresult)

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
undefined if length of `output` is 32 then 'hashBE`, otherwise 'script'.
+ **useNext**
  + optional, forces skip to next service before starting service requests cycle.

#### Method hashToHeader

```ts
hashToHeader(hash: string): Promise<sdk.BlockHeader>
```
See also: [BlockHeader](#interface-blockheader)

Returns

a block header

Argument Details

+ **hash**
  + block hash

#### Method nLockTimeIsFinal

```ts
nLockTimeIsFinal(txOrLockTime: string | number[] | BsvTransaction | number): Promise<boolean>
```

Returns

whether the locktime value allows the transaction to be mined at the current chain height

Argument Details

+ **txOrLockTime**
  + either a bitcoin locktime value or hex, binary, un-encoded Transaction

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletServicesOptions

```ts
export interface WalletServicesOptions {
    chain: sdk.Chain;
    taalApiKey?: string;
    bsvExchangeRate: BsvExchangeRate;
    bsvUpdateMsecs: number;
    fiatExchangeRates: FiatExchangeRates;
    fiatUpdateMsecs: number;
    disableMapiCallback?: boolean;
    exchangeratesapiKey?: string;
    chaintracksFiatExchangeRatesUrl?: string;
    chaintracks?: ChaintracksServiceClient;
}
```

See also: [BsvExchangeRate](#interface-bsvexchangerate), [Chain](#type-chain), [FiatExchangeRates](#interface-fiatexchangerates)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletSigner

```ts
export interface WalletSigner {
    isWalletSigner: true;
    chain: sdk.Chain;
    keyDeriver: KeyDeriverApi;
}
```

See also: [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletStorage

This is the `WalletStorage` interface implemented by a class such as `WalletStorageManager`,
which manges an active and set of backup storage providers.

Access and conrol is not directly managed. Typically each request is made with an associated identityKey
and it is left to the providers: physical access or remote channel authentication.

```ts
export interface WalletStorage {
    isStorageProvider(): boolean;
    isAvailable(): boolean;
    makeAvailable(): Promise<table.Settings>;
    migrate(storageName: string, storageIdentityKey: string): Promise<string>;
    destroy(): Promise<void>;
    setServices(v: sdk.WalletServices): void;
    getServices(): sdk.WalletServices;
    getSettings(): table.Settings;
    getAuth(): Promise<sdk.AuthId>;
    findOrInsertUser(identityKey: string): Promise<{
        user: table.User;
        isNew: boolean;
    }>;
    abortAction(args: AbortActionArgs): Promise<AbortActionResult>;
    createAction(args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult>;
    processAction(args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults>;
    internalizeAction(args: InternalizeActionArgs): Promise<InternalizeActionResult>;
    findCertificates(args: sdk.FindCertificatesArgs): Promise<table.Certificate[]>;
    findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]>;
    findOutputs(args: sdk.FindOutputsArgs): Promise<table.Output[]>;
    findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]>;
    listActions(args: ListActionsArgs): Promise<ListActionsResult>;
    listCertificates(args: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult>;
    listOutputs(args: ListOutputsArgs): Promise<ListOutputsResult>;
    insertCertificate(certificate: table.CertificateX): Promise<number>;
    relinquishCertificate(args: RelinquishCertificateArgs): Promise<number>;
    relinquishOutput(args: RelinquishOutputArgs): Promise<number>;
}
```

See also: [AuthId](#interface-authid), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [WalletServices](#interface-walletservices), [createAction](#function-createaction), [internalizeAction](#function-internalizeaction), [listCertificates](#function-listcertificates), [processAction](#function-processaction)

<details>

<summary>Interface WalletStorage Details</summary>

#### Method isStorageProvider

```ts
isStorageProvider(): boolean
```

Returns

false

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletStorageProvider

This is the `WalletStorage` interface implemented with authentication checking and
is the actual minimal interface implemented by storage and remoted storage providers.

```ts
export interface WalletStorageProvider extends WalletStorageSync {
    isStorageProvider(): boolean;
    setServices(v: sdk.WalletServices): void;
}
```

See also: [WalletServices](#interface-walletservices), [WalletStorageSync](#interface-walletstoragesync)

<details>

<summary>Interface WalletStorageProvider Details</summary>

#### Method isStorageProvider

```ts
isStorageProvider(): boolean
```

Returns

true if this object's interface can be extended to the full `StorageProvider` interface

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletStorageReader

```ts
export interface WalletStorageReader {
    isAvailable(): boolean;
    getServices(): sdk.WalletServices;
    getSettings(): table.Settings;
    findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<table.Certificate[]>;
    findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]>;
    findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<table.Output[]>;
    findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]>;
    listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult>;
    listCertificates(auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult>;
    listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult>;
}
```

See also: [AuthId](#interface-authid), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [listCertificates](#function-listcertificates)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletStorageSync

```ts
export interface WalletStorageSync extends WalletStorageWriter {
    findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: table.SyncState;
        isNew: boolean;
    }>;
    setActive(auth: sdk.AuthId, newActiveStorageIdentityKey: string): Promise<number>;
    getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk>;
    processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult>;
}
```

See also: [AuthId](#interface-authid), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [SyncChunk](#interface-syncchunk), [WalletStorageWriter](#interface-walletstoragewriter), [getSyncChunk](#function-getsyncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: WalletStorageWriter

```ts
export interface WalletStorageWriter extends WalletStorageReader {
    makeAvailable(): Promise<table.Settings>;
    migrate(storageName: string, storageIdentityKey: string): Promise<string>;
    destroy(): Promise<void>;
    findOrInsertUser(identityKey: string): Promise<{
        user: table.User;
        isNew: boolean;
    }>;
    abortAction(auth: sdk.AuthId, args: AbortActionArgs): Promise<AbortActionResult>;
    createAction(auth: sdk.AuthId, args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult>;
    processAction(auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults>;
    internalizeAction(auth: sdk.AuthId, args: InternalizeActionArgs): Promise<InternalizeActionResult>;
    insertCertificateAuth(auth: sdk.AuthId, certificate: table.CertificateX): Promise<number>;
    relinquishCertificate(auth: sdk.AuthId, args: RelinquishCertificateArgs): Promise<number>;
    relinquishOutput(auth: sdk.AuthId, args: RelinquishOutputArgs): Promise<number>;
}
```

See also: [AuthId](#interface-authid), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [ValidCreateActionArgs](#interface-validcreateactionargs), [WalletStorageReader](#interface-walletstoragereader), [createAction](#function-createaction), [internalizeAction](#function-internalizeaction), [processAction](#function-processaction)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Interface: XValidCreateActionOutput

```ts
export interface XValidCreateActionOutput extends sdk.ValidCreateActionOutput {
    vout: number;
    providedBy: sdk.StorageProvidedBy;
    purpose?: string;
    derivationSuffix?: string;
    keyOffset?: string;
}
```

See also: [StorageProvidedBy](#type-storageprovidedby), [ValidCreateActionOutput](#interface-validcreateactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
## Classes

| | | |
| --- | --- | --- |
| [CertOps](#class-certops) | [TaskCheckForProofs](#class-taskcheckforproofs) | [WERR_INVALID_PARAMETER](#class-werr_invalid_parameter) |
| [Monitor](#class-monitor) | [TaskClock](#class-taskclock) | [WERR_INVALID_PUBLIC_KEY](#class-werr_invalid_public_key) |
| [PrivilegedKeyManager](#class-privilegedkeymanager) | [TaskFailAbandoned](#class-taskfailabandoned) | [WERR_MISSING_PARAMETER](#class-werr_missing_parameter) |
| [ScriptTemplateSABPPP](#class-scripttemplatesabppp) | [TaskNewHeader](#class-tasknewheader) | [WERR_NETWORK_CHAIN](#class-werr_network_chain) |
| [ServiceCollection](#class-servicecollection) | [TaskPurge](#class-taskpurge) | [WERR_NOT_ACTIVE](#class-werr_not_active) |
| [Services](#class-services) | [TaskReviewStatus](#class-taskreviewstatus) | [WERR_NOT_IMPLEMENTED](#class-werr_not_implemented) |
| [SetupClient](#class-setupclient) | [TaskSendWaiting](#class-tasksendwaiting) | [WERR_UNAUTHORIZED](#class-werr_unauthorized) |
| [StorageClient](#class-storageclient) | [TaskSyncWhenIdle](#class-tasksyncwhenidle) | [Wallet](#class-wallet) |
| [StorageProvider](#class-storageprovider) | [WERR_BAD_REQUEST](#class-werr_bad_request) | [WalletError](#class-walleterror) |
| [StorageReader](#class-storagereader) | [WERR_INSUFFICIENT_FUNDS](#class-werr_insufficient_funds) | [WalletMonitorTask](#class-walletmonitortask) |
| [StorageReaderWriter](#class-storagereaderwriter) | [WERR_INTERNAL](#class-werr_internal) | [WalletSigner](#class-walletsigner) |
| [StorageSyncReader](#class-storagesyncreader) | [WERR_INVALID_OPERATION](#class-werr_invalid_operation) | [WalletStorageManager](#class-walletstoragemanager) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Class: CertOps

```ts
export class CertOps extends BsvCertificate {
    _keyring?: Record<CertificateFieldNameUnder50Bytes, string>;
    _encryptedFields?: Record<CertificateFieldNameUnder50Bytes, Base64String>;
    _decryptedFields?: Record<CertificateFieldNameUnder50Bytes, string>;
    constructor(public wallet: CertOpsWallet, wc: WalletCertificate) 
    static async fromCounterparty(wallet: CertOpsWallet, e: {
        certificate: WalletCertificate;
        keyring: Record<CertificateFieldNameUnder50Bytes, string>;
        counterparty: PubKeyHex;
    }): Promise<CertOps> 
    static async fromCertifier(wallet: CertOpsWallet, e: {
        certificate: WalletCertificate;
        keyring: Record<CertificateFieldNameUnder50Bytes, string>;
    }): Promise<CertOps> 
    static async fromEncrypted(wallet: CertOpsWallet, wc: WalletCertificate, keyring: Record<CertificateFieldNameUnder50Bytes, string>): Promise<CertOps> 
    static async fromDecrypted(wallet: CertOpsWallet, wc: WalletCertificate): Promise<CertOps> 
    static copyFields<T>(fields: Record<CertificateFieldNameUnder50Bytes, T>): Record<CertificateFieldNameUnder50Bytes, T> 
    static getProtocolForCertificateFieldEncryption(serialNumber: string, fieldName: string): {
        protocolID: WalletProtocol;
        keyID: string;
    } 
    exportForSubject(): {
        certificate: WalletCertificate;
        keyring: Record<CertificateFieldNameUnder50Bytes, string>;
    } 
    toWalletCertificate(): WalletCertificate 
    async encryptFields(counterparty: "self" | PubKeyHex = "self"): Promise<{
        fields: Record<CertificateFieldNameUnder50Bytes, string>;
        keyring: Record<CertificateFieldNameUnder50Bytes, string>;
    }> 
    async decryptFields(counterparty?: PubKeyHex, keyring?: Record<CertificateFieldNameUnder50Bytes, string>): Promise<Record<CertificateFieldNameUnder50Bytes, string>> 
    async exportForCounterparty(counterparty: PubKeyHex, fieldsToReveal: CertificateFieldNameUnder50Bytes[]): Promise<{
        certificate: WalletCertificate;
        keyring: Record<CertificateFieldNameUnder50Bytes, string>;
        counterparty: PubKeyHex;
    }> 
    async createKeyringForVerifier(verifierIdentityKey: PubKeyHex, fieldsToReveal: CertificateFieldNameUnder50Bytes[]): Promise<Record<CertificateFieldNameUnder50Bytes, Base64String>> 
    async encryptAndSignNewCertificate(): Promise<void> 
}
```

See also: [CertOpsWallet](#interface-certopswallet)

<details>

<summary>Class CertOps Details</summary>

#### Method createKeyringForVerifier

Creates a verifiable certificate structure for a specific verifier, allowing them access to specified fields.
This method decrypts the master field keys for each field specified in `fieldsToReveal` and re-encrypts them
for the verifier's identity key. The resulting certificate structure includes only the fields intended to be
revealed and a verifier-specific keyring for field decryption.

```ts
async createKeyringForVerifier(verifierIdentityKey: PubKeyHex, fieldsToReveal: CertificateFieldNameUnder50Bytes[]): Promise<Record<CertificateFieldNameUnder50Bytes, Base64String>> 
```

Returns

- A new certificate structure containing the original encrypted fields, the verifier-specific field decryption keyring, and essential certificate metadata.

Argument Details

+ **verifierIdentityKey**
  + The public identity key of the verifier who will receive access to the specified fields.
+ **fieldsToReveal**
  + An array of field names to be revealed to the verifier. Must be a subset of the certificate's fields.

Throws

Throws an error if:
- fieldsToReveal is empty or a field in `fieldsToReveal` does not exist in the certificate.
- The decrypted master field key fails to decrypt the corresponding field (indicating an invalid key).

#### Method encryptAndSignNewCertificate

encrypt plaintext field values for the subject
update the signature using the certifier's private key.

```ts
async encryptAndSignNewCertificate(): Promise<void> 
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: Monitor

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

See also: [BlockHeader](#interface-blockheader), [Chain](#type-chain), [MonitorOptions](#interface-monitoroptions), [MonitorStorage](#type-monitorstorage), [Services](#class-services), [TaskPurgeParams](#interface-taskpurgeparams), [WalletMonitorTask](#class-walletmonitortask)

<details>

<summary>Class Monitor Details</summary>

#### Property _otherTasks

_otherTasks can be run by runTask but not by scheduler.

```ts
_otherTasks: WalletMonitorTask[] = []
```
See also: [WalletMonitorTask](#class-walletmonitortask)

#### Property _tasks

_tasks are typically run by the scheduler but may also be run by runTask.

```ts
_tasks: WalletMonitorTask[] = []
```
See also: [WalletMonitorTask](#class-walletmonitortask)

#### Method addDefaultTasks

Default tasks with settings appropriate for a single user storage
possibly with sync'ing enabled

```ts
addDefaultTasks(): void 
```

#### Method addMultiUserTasks

Tasks appropriate for multi-user storage
without sync'ing enabled.

```ts
addMultiUserTasks(): void 
```

#### Method processNewBlockHeader

Process new chain header event received from Chaintracks

Kicks processing 'unconfirmed' and 'unmined' request processing.

```ts
processNewBlockHeader(header: BlockHeader): void 
```
See also: [BlockHeader](#interface-blockheader)

#### Method processReorg

Process reorg event received from Chaintracks

Reorgs can move recent transactions to new blocks at new index positions.
Affected transaction proofs become invalid and must be updated.

It is possible for a transaction to become invalid.

Coinbase transactions always become invalid.

```ts
processReorg(depth: number, oldTip: BlockHeader, newTip: BlockHeader): void 
```
See also: [BlockHeader](#interface-blockheader)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: PrivilegedKeyManager

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

<details>

<summary>Class PrivilegedKeyManager Details</summary>

#### Constructor

```ts
constructor(keyGetter: (reason: string) => Promise<PrivateKey>, retentionPeriod = 120000) 
```

Argument Details

+ **keyGetter**
  + Asynchronous function that retrieves the PrivateKey from a secure environment.
+ **retentionPeriod**
  + Time in milliseconds to retain the obfuscated key in memory before zeroizing.

#### Method destroyKey

Safely destroys the in-memory obfuscated key material by zeroizing
and deleting related fields. Also destroys some (but not all) decoy
properties to further confuse an attacker.

```ts
destroyKey(): void 
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: ScriptTemplateSABPPP

Simple Authenticated BSV P2PKH Payment Protocol
https://brc.dev/29

```ts
export class ScriptTemplateSABPPP implements ScriptTemplate {
    p2pkh: P2PKH;
    constructor(public params: ScriptTemplateParamsSABPPP) 
    getKeyID() 
    getKeyDeriver(privKey: PrivateKey | HexString): KeyDeriverApi 
    lock(lockerPrivKey: string, unlockerPubKey: string): LockingScript 
    unlock(unlockerPrivKey: string, lockerPubKey: string, sourceSatoshis?: number, lockingScript?: Script): {
        sign: (tx: Transaction, inputIndex: number) => Promise<UnlockingScript>;
        estimateLength: (tx?: Transaction, inputIndex?: number) => Promise<number>;
    } 
    unlockLength = 108;
}
```

See also: [ScriptTemplateParamsSABPPP](#interface-scripttemplateparamssabppp)

<details>

<summary>Class ScriptTemplateSABPPP Details</summary>

#### Property unlockLength

P2PKH unlock estimateLength is a constant

```ts
unlockLength = 108
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: ServiceCollection

```ts
export class ServiceCollection<T> {
    services: {
        name: string;
        service: T;
    }[];
    _index: number;
    constructor(services?: {
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
    get allServices() 
    get count() 
    get index() 
    reset() 
    next(): number 
    clone(): ServiceCollection<T> 
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: Services

```ts
export class Services implements sdk.WalletServices {
    static createDefaultOptions(chain: sdk.Chain): sdk.WalletServicesOptions 
    options: sdk.WalletServicesOptions;
    getMerklePathServices: ServiceCollection<sdk.GetMerklePathService>;
    getRawTxServices: ServiceCollection<sdk.GetRawTxService>;
    postTxsServices: ServiceCollection<sdk.PostTxsService>;
    postBeefServices: ServiceCollection<sdk.PostBeefService>;
    getUtxoStatusServices: ServiceCollection<sdk.GetUtxoStatusService>;
    updateFiatExchangeRateServices: ServiceCollection<sdk.UpdateFiatExchangeRateService>;
    chain: sdk.Chain;
    constructor(optionsOrChain: sdk.Chain | sdk.WalletServicesOptions) 
    async getChainTracker(): Promise<ChainTracker> 
    async getBsvExchangeRate(): Promise<number> 
    async getFiatExchangeRate(currency: "USD" | "GBP" | "EUR", base?: "USD" | "GBP" | "EUR"): Promise<number> 
    get getProofsCount() 
    get getRawTxsCount() 
    get postTxsServicesCount() 
    get postBeefServicesCount() 
    get getUtxoStatsCount() 
    async getUtxoStatus(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat, useNext?: boolean): Promise<sdk.GetUtxoStatusResult> 
    async postTxs(beef: Beef, txids: string[]): Promise<sdk.PostTxsResult[]> 
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
}
```

See also: [BlockHeader](#interface-blockheader), [Chain](#type-chain), [FiatExchangeRates](#interface-fiatexchangerates), [GetMerklePathResult](#interface-getmerklepathresult), [GetMerklePathService](#type-getmerklepathservice), [GetRawTxResult](#interface-getrawtxresult), [GetRawTxService](#type-getrawtxservice), [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat), [GetUtxoStatusResult](#interface-getutxostatusresult), [GetUtxoStatusService](#type-getutxostatusservice), [PostBeefResult](#interface-postbeefresult), [PostBeefService](#type-postbeefservice), [PostTxsResult](#interface-posttxsresult), [PostTxsService](#type-posttxsservice), [ServiceCollection](#class-servicecollection), [UpdateFiatExchangeRateService](#type-updatefiatexchangerateservice), [WalletServices](#interface-walletservices), [WalletServicesOptions](#interface-walletservicesoptions)

<details>

<summary>Class Services Details</summary>

#### Method postTxs

The beef must contain at least each rawTx for each txid.
Some services may require input transactions as well.
These will be fetched if missing, greatly extending the service response time.

```ts
async postTxs(beef: Beef, txids: string[]): Promise<sdk.PostTxsResult[]> 
```
See also: [PostTxsResult](#interface-posttxsresult)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: SetupClient

The `SetupClient` class provides static setup functions to construct BRC-100 compatible
wallets in a variety of configurations.

It serves as a starting point for experimentation and customization.

`SetupClient` references only browser compatible code including storage via `StorageClient`.
`Setup` extends `SetupClient` adding database storage via `Knex` and `StorageKnex`.

```ts
export abstract class SetupClient {
    static makeEnv(): string {
        const testPrivKey1 = PrivateKey.fromRandom();
        const testIdentityKey1 = testPrivKey1.toPublicKey().toString();
        const testPrivKey2 = PrivateKey.fromRandom();
        const testIdentityKey2 = testPrivKey2.toPublicKey().toString();
        const mainPrivKey1 = PrivateKey.fromRandom();
        const mainIdentityKey1 = mainPrivKey1.toPublicKey().toString();
        const mainPrivKey2 = PrivateKey.fromRandom();
        const mainIdentityKey2 = mainPrivKey2.toPublicKey().toString();
        const log = `
    # Add the following to .env file:
    MAIN_TAAL_API_KEY='mainnet_9596de07e92300c6287e4393594ae39c'
    TEST_TAAL_API_KEY='testnet_0e6cf72133b43ea2d7861da2a38684e3'
    MY_TEST_IDENTITY = '${testIdentityKey1}'
    MY_TEST_IDENTITY2 = '${testIdentityKey2}'
    MY_MAIN_IDENTITY = '${mainIdentityKey1}'
    MY_MAIN_IDENTITY2 = '${mainIdentityKey2}'
    DEV_KEYS = '{
        "${testIdentityKey1}": "${testPrivKey1.toString()}",
        "${testIdentityKey2}": "${testPrivKey2.toString()}"
        "${mainIdentityKey1}": "${mainPrivKey1.toString()}",
        "${mainIdentityKey2}": "${mainPrivKey2.toString()}"
    }'
    MYSQL_CONNECTION='{"port":3306,"host":"127.0.0.1","user":"root","password":"<your_password>","database":"<your_database>", "timezone": "Z"}'
    `;
        console.log(log);
        return log;
    }
    static getEnv(chain: sdk.Chain): SetupEnv 
    static async createWallet(args: SetupWalletArgs): Promise<SetupWallet> {
        args.chain ||= args.env.chain;
        args.rootKeyHex ||= args.env.devKeys[args.env.identityKey];
        const rootKey = PrivateKey.fromHex(args.rootKeyHex);
        const identityKey = rootKey.toPublicKey().toString();
        const keyDeriver = new KeyDeriver(rootKey);
        const chain = args.chain;
        const storage = new WalletStorageManager(identityKey, args.active, args.backups);
        if (storage.stores.length > 0)
            await storage.makeAvailable();
        const serviceOptions = Services.createDefaultOptions(chain);
        serviceOptions.taalApiKey = args.env.taalApiKey;
        const services = new Services(args.chain);
        const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services);
        const monitor = new Monitor(monopts);
        monitor.addDefaultTasks();
        let privilegedKeyManager: sdk.PrivilegedKeyManager | undefined = undefined;
        if (args.privKeyHex) {
            const privKey = PrivateKey.fromString(args.privKeyHex);
            privilegedKeyManager = new sdk.PrivilegedKeyManager(async () => privKey);
        }
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
    static async createWalletWithStorageClient(args: SetupWalletClientArgs): Promise<SetupWalletClient> 
    static getKeyPair(priv?: string | PrivateKey): KeyPairAddress 
    static getLockP2PKH(address: string) 
    static getUnlockP2PKH(priv: PrivateKey, satoshis: number): sdk.ScriptTemplateUnlock 
    static createP2PKHOutputs(outputs: {
        address: string;
        satoshis: number;
        outputDescription?: string;
        basket?: string;
        tags?: string[];
    }[]): CreateActionOutput[] 
    static async createP2PKHOutputsAction(wallet: WalletInterface, outputs: {
        address: string;
        satoshis: number;
        outputDescription?: string;
        basket?: string;
        tags?: string[];
    }[], options?: CreateActionOptions): Promise<{
        cr: CreateActionResult;
        outpoints: string[] | undefined;
    }> 
    static async fundWalletFromP2PKHOutpoints(wallet: WalletInterface, outpoints: string[], p2pkhKey: KeyPairAddress, inputBEEF?: BEEF) 
}
```

See also: [Chain](#type-chain), [KeyPairAddress](#type-keypairaddress), [Monitor](#class-monitor), [PrivilegedKeyManager](#class-privilegedkeymanager), [ScriptTemplateUnlock](#interface-scripttemplateunlock), [Services](#class-services), [SetupEnv](#interface-setupenv), [SetupWallet](#interface-setupwallet), [SetupWalletArgs](#interface-setupwalletargs), [SetupWalletClient](#interface-setupwalletclient), [SetupWalletClientArgs](#interface-setupwalletclientargs), [Wallet](#class-wallet), [WalletStorageManager](#class-walletstoragemanager)

<details>

<summary>Class SetupClient Details</summary>

#### Method createWallet

Create a `Wallet`. Storage can optionally be provided or configured later.

The following components are configured: KeyDeriver, WalletStorageManager, WalletService, WalletStorage.
Optionally, PrivilegedKeyManager is also configured.

```ts
static async createWallet(args: SetupWalletArgs): Promise<SetupWallet> {
    args.chain ||= args.env.chain;
    args.rootKeyHex ||= args.env.devKeys[args.env.identityKey];
    const rootKey = PrivateKey.fromHex(args.rootKeyHex);
    const identityKey = rootKey.toPublicKey().toString();
    const keyDeriver = new KeyDeriver(rootKey);
    const chain = args.chain;
    const storage = new WalletStorageManager(identityKey, args.active, args.backups);
    if (storage.stores.length > 0)
        await storage.makeAvailable();
    const serviceOptions = Services.createDefaultOptions(chain);
    serviceOptions.taalApiKey = args.env.taalApiKey;
    const services = new Services(args.chain);
    const monopts = Monitor.createDefaultWalletMonitorOptions(chain, storage, services);
    const monitor = new Monitor(monopts);
    monitor.addDefaultTasks();
    let privilegedKeyManager: sdk.PrivilegedKeyManager | undefined = undefined;
    if (args.privKeyHex) {
        const privKey = PrivateKey.fromString(args.privKeyHex);
        privilegedKeyManager = new sdk.PrivilegedKeyManager(async () => privKey);
    }
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
See also: [Monitor](#class-monitor), [PrivilegedKeyManager](#class-privilegedkeymanager), [Services](#class-services), [SetupWallet](#interface-setupwallet), [SetupWalletArgs](#interface-setupwalletargs), [Wallet](#class-wallet), [WalletStorageManager](#class-walletstoragemanager)

#### Method getEnv

Reads a .env file of the format created by `makeEnv`.

Returns values for designated `chain`.

Access private keys through the `devKeys` object: `devKeys[identityKey]`

```ts
static getEnv(chain: sdk.Chain): SetupEnv 
```
See also: [Chain](#type-chain), [SetupEnv](#interface-setupenv)

Returns

with configuration environment secrets used by `Setup` functions.

Argument Details

+ **chain**
  + Which chain to use: 'test' or 'main'

#### Method makeEnv

Creates content for .env file with some private keys, identity keys, sample API keys, and sample MySQL connection string.

Two new, random private keys are generated each time, with their associated public identity keys.

Loading secrets from a .env file is intended only for experimentation and getting started.
Private keys should never be included directly in your source code.

```ts
static makeEnv(): string 
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: StorageClient

```ts
export class StorageClient implements sdk.WalletStorageProvider {
    public settings?: table.Settings;
    constructor(wallet: WalletInterface, endpointUrl: string) 
    isStorageProvider(): boolean 
    isAvailable(): boolean 
    getSettings(): table.Settings 
    async makeAvailable(): Promise<table.Settings> 
    async destroy(): Promise<void> 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    getServices(): sdk.WalletServices 
    setServices(v: sdk.WalletServices): void 
    async internalizeAction(auth: sdk.AuthId, args: InternalizeActionArgs): Promise<InternalizeActionResult> 
    async createAction(auth: sdk.AuthId, args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async processAction(auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async abortAction(auth: sdk.AuthId, args: AbortActionArgs): Promise<AbortActionResult> 
    async findOrInsertUser(identityKey): Promise<{
        user: table.User;
        isNew: boolean;
    }> 
    async findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: table.SyncState;
        isNew: boolean;
    }> 
    async insertCertificateAuth(auth: sdk.AuthId, certificate: table.CertificateX): Promise<number> 
    async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async listCertificates(auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<table.Certificate[]> 
    async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]> 
    async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<table.Output[]> 
    findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]> 
    async relinquishCertificate(auth: sdk.AuthId, args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(auth: sdk.AuthId, args: RelinquishOutputArgs): Promise<number> 
    async processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult> 
    async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
    async updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult> 
    async setActive(auth: sdk.AuthId, newActiveStorageIdentityKey: string): Promise<number> 
}
```

See also: [AuthId](#interface-authid), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [SyncChunk](#interface-syncchunk), [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [WalletStorageProvider](#interface-walletstorageprovider), [createAction](#function-createaction), [getSyncChunk](#function-getsyncchunk), [internalizeAction](#function-internalizeaction), [listCertificates](#function-listcertificates), [processAction](#function-processaction)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: StorageProvider

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
    abstract allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<table.Output | undefined>;
    abstract getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx>;
    abstract getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: sdk.TrxToken): Promise<number[] | undefined>;
    abstract getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<table.TxLabel[]>;
    abstract getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<table.OutputTag[]>;
    abstract listActions(auth: sdk.AuthId, args: sdk.ValidListActionsArgs): Promise<ListActionsResult>;
    abstract listOutputs(auth: sdk.AuthId, args: sdk.ValidListOutputsArgs): Promise<ListOutputsResult>;
    abstract countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number>;
    abstract findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<table.Certificate[]>;
    abstract findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]>;
    abstract findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<table.Output[]>;
    abstract insertCertificateAuth(auth: sdk.AuthId, certificate: table.CertificateX): Promise<number>;
    override isStorageProvider(): boolean 
    setServices(v: sdk.WalletServices) 
    getServices(): sdk.WalletServices 
    async abortAction(auth: sdk.AuthId, args: Partial<table.Transaction>): Promise<AbortActionResult> 
    async internalizeAction(auth: sdk.AuthId, args: InternalizeActionArgs): Promise<InternalizeActionResult> 
    async getReqsAndBeefToShareWithWorld(txids: string[], knownTxids: string[], trx?: sdk.TrxToken): Promise<GetReqsAndBeefResult> 
    async mergeReqToBeefToShareExternally(req: table.ProvenTxReq, mergeToBeef: Beef, knownTxids: string[], trx?: sdk.TrxToken): Promise<void> 
    async getProvenOrReq(txid: string, newReq?: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<sdk.StorageProvenOrReq> 
    async updateTransactionsStatus(transactionIds: number[], status: sdk.TransactionStatus): Promise<void> 
    async updateTransactionStatus(status: sdk.TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: sdk.TrxToken): Promise<void> 
    async createAction(auth: sdk.AuthId, args: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async processAction(auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async attemptToPostReqsToNetwork(reqs: entity.ProvenTxReq[], trx?: sdk.TrxToken): Promise<PostReqsToNetworkResult> 
    async listCertificates(auth: sdk.AuthId, args: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async verifyKnownValidTransaction(txid: string, trx?: sdk.TrxToken): Promise<boolean> 
    async getValidBeefForKnownTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: sdk.TrxToken): Promise<Beef> 
    async getValidBeefForTxid(txid: string, mergeToBeef?: Beef, trustSelf?: TrustSelf, knownTxids?: string[], trx?: sdk.TrxToken): Promise<Beef | undefined> 
    async getBeefForTransaction(txid: string, options: sdk.StorageGetBeefOptions): Promise<Beef> 
    async findMonitorEventById(id: number, trx?: sdk.TrxToken): Promise<table.MonitorEvent | undefined> 
    async relinquishCertificate(auth: sdk.AuthId, args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(auth: sdk.AuthId, args: RelinquishOutputArgs): Promise<number> 
    async processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult> 
    async updateProvenTxReqWithNewProvenTx(args: sdk.UpdateProvenTxReqWithNewProvenTxArgs): Promise<sdk.UpdateProvenTxReqWithNewProvenTxResult> 
    async confirmSpendableOutputs(): Promise<{
        invalidSpendableOutputs: table.Output[];
    }> 
    async updateProvenTxReqDynamics(id: number, update: Partial<table.ProvenTxReqDynamics>, trx?: sdk.TrxToken): Promise<number> 
}
```

See also: [AuthId](#interface-authid), [Chain](#type-chain), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [GetReqsAndBeefResult](#interface-getreqsandbeefresult), [PostReqsToNetworkResult](#interface-postreqstonetworkresult), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [ProvenOrRawTx](#interface-provenorrawtx), [PurgeParams](#interface-purgeparams), [PurgeResults](#interface-purgeresults), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageFeeModel](#interface-storagefeemodel), [StorageGetBeefOptions](#interface-storagegetbeefoptions), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [StorageProvenOrReq](#interface-storageprovenorreq), [StorageProviderOptions](#interface-storageprovideroptions), [StorageReaderWriter](#class-storagereaderwriter), [SyncChunk](#interface-syncchunk), [TransactionStatus](#type-transactionstatus), [TrxToken](#interface-trxtoken), [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [WalletStorageProvider](#interface-walletstorageprovider), [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork), [createAction](#function-createaction), [getBeefForTransaction](#function-getbeeffortransaction), [internalizeAction](#function-internalizeaction), [listCertificates](#function-listcertificates), [processAction](#function-processaction)

<details>

<summary>Class StorageProvider Details</summary>

#### Method confirmSpendableOutputs

For each spendable output in the 'default' basket of the authenticated user,
verify that the output script, satoshis, vout and txid match that of an output
still in the mempool of at least one service provider.

```ts
async confirmSpendableOutputs(): Promise<{
    invalidSpendableOutputs: table.Output[];
}> 
```

Returns

object with invalidSpendableOutputs array. A good result is an empty array.

#### Method getProvenOrReq

Checks if txid is a known valid ProvenTx and returns it if found.
Next checks if txid is a current ProvenTxReq and returns that if found.
If `newReq` is provided and an existing ProvenTxReq isn't found,
use `newReq` to create a new ProvenTxReq.

This is safe "findOrInsert" operation using retry if unique index constraint
is violated by a race condition insert.

```ts
async getProvenOrReq(txid: string, newReq?: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<sdk.StorageProvenOrReq> 
```
See also: [StorageProvenOrReq](#interface-storageprovenorreq), [TrxToken](#interface-trxtoken)

#### Method getReqsAndBeefToShareWithWorld

Given an array of transaction txids with current ProvenTxReq ready-to-share status,
lookup their ProvenTxReqApi req records.
For the txids with reqs and status still ready to send construct a single merged beef.

```ts
async getReqsAndBeefToShareWithWorld(txids: string[], knownTxids: string[], trx?: sdk.TrxToken): Promise<GetReqsAndBeefResult> 
```
See also: [GetReqsAndBeefResult](#interface-getreqsandbeefresult), [TrxToken](#interface-trxtoken)

#### Method updateProvenTxReqWithNewProvenTx

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
See also: [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult)

#### Method updateTransactionStatus

For all `status` values besides 'failed', just updates the transaction records status property.

For 'status' of 'failed', attempts to make outputs previously allocated as inputs to this transaction usable again.

```ts
async updateTransactionStatus(status: sdk.TransactionStatus, transactionId?: number, userId?: number, reference?: string, trx?: sdk.TrxToken): Promise<void> 
```
See also: [TransactionStatus](#type-transactionstatus), [TrxToken](#interface-trxtoken)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: StorageReader

The `StorageReader` abstract class is the base of the concrete wallet storage provider classes.

It is the minimal interface required to read all wallet state records and is the base class for sync readers.

The next class in the heirarchy is the `StorageReaderWriter` which supports sync readers and writers.

The last class in the heirarchy is the `Storage` class which supports all active wallet operations.

The ability to construct a properly configured instance of this class implies authentication.
As such there are no user specific authenticated access checks implied in the implementation of any of these methods.

```ts
export abstract class StorageReader implements sdk.StorageSyncReader {
    chain: sdk.Chain;
    _settings?: table.Settings;
    whenLastAccess?: Date;
    get dbtype(): DBType | undefined 
    constructor(options: StorageReaderOptions) 
    isAvailable(): boolean 
    async makeAvailable(): Promise<table.Settings> 
    getSettings(): table.Settings 
    isStorageProvider(): boolean 
    abstract destroy(): Promise<void>;
    abstract transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T>;
    abstract readSettings(trx?: sdk.TrxToken): Promise<table.Settings>;
    abstract findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<table.CertificateField[]>;
    abstract findCertificates(args: sdk.FindCertificatesArgs): Promise<table.Certificate[]>;
    abstract findCommissions(args: sdk.FindCommissionsArgs): Promise<table.Commission[]>;
    abstract findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<table.MonitorEvent[]>;
    abstract findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]>;
    abstract findOutputs(args: sdk.FindOutputsArgs): Promise<table.Output[]>;
    abstract findOutputTags(args: sdk.FindOutputTagsArgs): Promise<table.OutputTag[]>;
    abstract findSyncStates(args: sdk.FindSyncStatesArgs): Promise<table.SyncState[]>;
    abstract findTransactions(args: sdk.FindTransactionsArgs): Promise<table.Transaction[]>;
    abstract findTxLabels(args: sdk.FindTxLabelsArgs): Promise<table.TxLabel[]>;
    abstract findUsers(args: sdk.FindUsersArgs): Promise<table.User[]>;
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
    abstract getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTx[]>;
    abstract getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTxReq[]>;
    abstract getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.TxLabelMap[]>;
    abstract getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.OutputTagMap[]>;
    async findUserByIdentityKey(key: string): Promise<table.User | undefined> 
    async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
    validateEntityDate(date: Date | string | number): Date | string 
    validateOptionalEntityDate(date: Date | string | number | null | undefined, useNowAsDefault?: boolean): Date | string | undefined 
    validateDate(date: Date | string | number): Date 
    validateOptionalDate(date: Date | string | number | null | undefined): Date | undefined 
    validateDateForWhere(date: Date | string | number): Date | string | number 
}
```

See also: [Chain](#type-chain), [DBType](#type-dbtype), [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs), [FindCertificatesArgs](#interface-findcertificatesargs), [FindCommissionsArgs](#interface-findcommissionsargs), [FindForUserSincePagedArgs](#interface-findforusersincepagedargs), [FindMonitorEventsArgs](#interface-findmonitoreventsargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputTagsArgs](#interface-findoutputtagsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindSyncStatesArgs](#interface-findsyncstatesargs), [FindTransactionsArgs](#interface-findtransactionsargs), [FindTxLabelsArgs](#interface-findtxlabelsargs), [FindUsersArgs](#interface-findusersargs), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageReaderOptions](#interface-storagereaderoptions), [StorageSyncReader](#class-storagesyncreader), [SyncChunk](#interface-syncchunk), [TrxToken](#interface-trxtoken), [getSyncChunk](#function-getsyncchunk)

<details>

<summary>Class StorageReader Details</summary>

#### Method validateEntityDate

Force dates to strings on SQLite and Date objects on MySQL

```ts
validateEntityDate(date: Date | string | number): Date | string 
```

#### Method validateOptionalEntityDate

```ts
validateOptionalEntityDate(date: Date | string | number | null | undefined, useNowAsDefault?: boolean): Date | string | undefined 
```

Argument Details

+ **useNowAsDefault**
  + if true and date is null or undefiend, set to current time.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: StorageReaderWriter

```ts
export abstract class StorageReaderWriter extends StorageReader {
    constructor(options: StorageReaderWriterOptions) 
    abstract dropAllData(): Promise<void>;
    abstract migrate(storageName: string, storageIdentityKey: string): Promise<string>;
    abstract findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<table.OutputTagMap[]>;
    abstract findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]>;
    abstract findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<table.ProvenTx[]>;
    abstract findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<table.TxLabelMap[]>;
    abstract countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number>;
    abstract countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number>;
    abstract countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number>;
    abstract countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number>;
    abstract insertCertificate(certificate: table.Certificate, trx?: sdk.TrxToken): Promise<number>;
    abstract insertCertificateField(certificateField: table.CertificateField, trx?: sdk.TrxToken): Promise<void>;
    abstract insertCommission(commission: table.Commission, trx?: sdk.TrxToken): Promise<number>;
    abstract insertMonitorEvent(event: table.MonitorEvent, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutput(output: table.Output, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutputBasket(basket: table.OutputBasket, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutputTag(tag: table.OutputTag, trx?: sdk.TrxToken): Promise<number>;
    abstract insertOutputTagMap(tagMap: table.OutputTagMap, trx?: sdk.TrxToken): Promise<void>;
    abstract insertProvenTx(tx: table.ProvenTx, trx?: sdk.TrxToken): Promise<number>;
    abstract insertProvenTxReq(tx: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<number>;
    abstract insertSyncState(syncState: table.SyncState, trx?: sdk.TrxToken): Promise<number>;
    abstract insertTransaction(tx: table.Transaction, trx?: sdk.TrxToken): Promise<number>;
    abstract insertTxLabel(label: table.TxLabel, trx?: sdk.TrxToken): Promise<number>;
    abstract insertTxLabelMap(labelMap: table.TxLabelMap, trx?: sdk.TrxToken): Promise<void>;
    abstract insertUser(user: table.User, trx?: sdk.TrxToken): Promise<number>;
    abstract updateCertificate(id: number, update: Partial<table.Certificate>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateCertificateField(certificateId: number, fieldName: string, update: Partial<table.CertificateField>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateCommission(id: number, update: Partial<table.Commission>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateMonitorEvent(id: number, update: Partial<table.MonitorEvent>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutput(id: number, update: Partial<table.Output>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutputBasket(id: number, update: Partial<table.OutputBasket>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutputTag(id: number, update: Partial<table.OutputTag>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateOutputTagMap(outputId: number, tagId: number, update: Partial<table.OutputTagMap>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateProvenTx(id: number, update: Partial<table.ProvenTx>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateProvenTxReq(id: number | number[], update: Partial<table.ProvenTxReq>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateSyncState(id: number, update: Partial<table.SyncState>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateTransaction(id: number | number[], update: Partial<table.Transaction>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateTxLabel(id: number, update: Partial<table.TxLabel>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<table.TxLabelMap>, trx?: sdk.TrxToken): Promise<number>;
    abstract updateUser(id: number, update: Partial<table.User>, trx?: sdk.TrxToken): Promise<number>;
    async setActive(auth: sdk.AuthId, newActiveStorageIdentityKey: string): Promise<number> 
    async findCertificateById(id: number, trx?: sdk.TrxToken): Promise<table.Certificate | undefined> 
    async findCommissionById(id: number, trx?: sdk.TrxToken): Promise<table.Commission | undefined> 
    async findOutputById(id: number, trx?: sdk.TrxToken, noScript?: boolean): Promise<table.Output | undefined> 
    async findOutputBasketById(id: number, trx?: sdk.TrxToken): Promise<table.OutputBasket | undefined> 
    async findProvenTxById(id: number, trx?: sdk.TrxToken | undefined): Promise<table.ProvenTx | undefined> 
    async findProvenTxReqById(id: number, trx?: sdk.TrxToken | undefined): Promise<table.ProvenTxReq | undefined> 
    async findSyncStateById(id: number, trx?: sdk.TrxToken): Promise<table.SyncState | undefined> 
    async findTransactionById(id: number, trx?: sdk.TrxToken, noRawTx?: boolean): Promise<table.Transaction | undefined> 
    async findTxLabelById(id: number, trx?: sdk.TrxToken): Promise<table.TxLabel | undefined> 
    async findOutputTagById(id: number, trx?: sdk.TrxToken): Promise<table.OutputTag | undefined> 
    async findUserById(id: number, trx?: sdk.TrxToken): Promise<table.User | undefined> 
    async findOrInsertUser(identityKey: string, trx?: sdk.TrxToken): Promise<{
        user: table.User;
        isNew: boolean;
    }> 
    async findOrInsertTransaction(newTx: table.Transaction, trx?: sdk.TrxToken): Promise<{
        tx: table.Transaction;
        isNew: boolean;
    }> 
    async findOrInsertOutputBasket(userId: number, name: string, trx?: sdk.TrxToken): Promise<table.OutputBasket> 
    async findOrInsertTxLabel(userId: number, label: string, trx?: sdk.TrxToken): Promise<table.TxLabel> 
    async findOrInsertTxLabelMap(transactionId: number, txLabelId: number, trx?: sdk.TrxToken): Promise<table.TxLabelMap> 
    async findOrInsertOutputTag(userId: number, tag: string, trx?: sdk.TrxToken): Promise<table.OutputTag> 
    async findOrInsertOutputTagMap(outputId: number, outputTagId: number, trx?: sdk.TrxToken): Promise<table.OutputTagMap> 
    async findOrInsertSyncStateAuth(auth: sdk.AuthId, storageIdentityKey: string, storageName: string): Promise<{
        syncState: table.SyncState;
        isNew: boolean;
    }> 
    async findOrInsertProvenTxReq(newReq: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<{
        req: table.ProvenTxReq;
        isNew: boolean;
    }> 
    async findOrInsertProvenTx(newProven: table.ProvenTx, trx?: sdk.TrxToken): Promise<{
        proven: table.ProvenTx;
        isNew: boolean;
    }> 
    abstract processSyncChunk(args: sdk.RequestSyncChunkArgs, chunk: sdk.SyncChunk): Promise<sdk.ProcessSyncChunkResult>;
    async tagOutput(partial: Partial<table.Output>, tag: string, trx?: sdk.TrxToken): Promise<void> 
}
```

See also: [AuthId](#interface-authid), [FindOutputTagMapsArgs](#interface-findoutputtagmapsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [FindProvenTxsArgs](#interface-findproventxsargs), [FindTxLabelMapsArgs](#interface-findtxlabelmapsargs), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageReader](#class-storagereader), [StorageReaderWriterOptions](#interface-storagereaderwriteroptions), [SyncChunk](#interface-syncchunk), [TrxToken](#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: StorageSyncReader

The `StorageSyncReader` non-abstract class must be used when authentication checking access to the methods of a `StorageBaseReader` is required.

Constructed from an `auth` object that must minimally include the authenticated user's identityKey,
and the `StorageBaseReader` to be protected.

```ts
export class StorageSyncReader implements sdk.StorageSyncReader {
    constructor(public auth: sdk.AuthId, public storage: StorageReader) 
    isAvailable(): boolean 
    async makeAvailable(): Promise<table.Settings> 
    destroy(): Promise<void> 
    getSettings(): table.Settings 
    async getSyncChunk(args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
    async findUserByIdentityKey(key: string): Promise<table.User | undefined> 
    async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<table.SyncState[]> 
    async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<table.CertificateField[]> 
    async findCertificates(args: sdk.FindCertificatesArgs): Promise<table.Certificate[]> 
    async findCommissions(args: sdk.FindCommissionsArgs): Promise<table.Commission[]> 
    async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]> 
    async findOutputs(args: sdk.FindOutputsArgs): Promise<table.Output[]> 
    async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<table.OutputTag[]> 
    async findTransactions(args: sdk.FindTransactionsArgs): Promise<table.Transaction[]> 
    async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<table.TxLabel[]> 
    async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTx[]> 
    async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTxReq[]> 
    async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.TxLabelMap[]> 
    async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.OutputTagMap[]> 
}
```

See also: [AuthId](#interface-authid), [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs), [FindCertificatesArgs](#interface-findcertificatesargs), [FindCommissionsArgs](#interface-findcommissionsargs), [FindForUserSincePagedArgs](#interface-findforusersincepagedargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputTagsArgs](#interface-findoutputtagsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindSyncStatesArgs](#interface-findsyncstatesargs), [FindTransactionsArgs](#interface-findtransactionsargs), [FindTxLabelsArgs](#interface-findtxlabelsargs), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageReader](#class-storagereader), [SyncChunk](#interface-syncchunk), [getSyncChunk](#function-getsyncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskCheckForProofs

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
    async getProofs(reqs: table.ProvenTxReq[], indent = 0, countsAsAttempt = false, ignoreStatus = false): Promise<{
        proven: table.ProvenTxReq[];
        invalid: table.ProvenTxReq[];
        log: string;
    }> 
}
```

See also: [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

<details>

<summary>Class TaskCheckForProofs Details</summary>

#### Property checkNow

An external service such as the chaintracks new block header
listener can set this true to cause

```ts
static checkNow = false
```

#### Method getProofs

Process an array of table.ProvenTxReq (typically with status 'unmined' or 'unknown')

If req is invalid, set status 'invalid'

Verify the requests are valid, lookup proofs or updated transaction status using the array of getProofServices,

When proofs are found, create new ProvenTxApi records and transition the requests' status to 'unconfirmed' or 'notifying',
depending on chaintracks succeeding on proof verification.

Increments attempts if proofs where requested.

```ts
async getProofs(reqs: table.ProvenTxReq[], indent = 0, countsAsAttempt = false, ignoreStatus = false): Promise<{
    proven: table.ProvenTxReq[];
    invalid: table.ProvenTxReq[];
    log: string;
}> 
```

Returns

reqs partitioned by status

#### Method trigger

Normally triggered by checkNow getting set by new block header found event from chaintracks

```ts
trigger(nowMsecsSinceEpoch: number): {
    run: boolean;
} 
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskClock

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

See also: [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskFailAbandoned

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

See also: [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskNewHeader

```ts
export class TaskNewHeader extends WalletMonitorTask {
    static taskName = "NewHeader";
    header?: sdk.BlockHeader;
    constructor(monitor: Monitor, public triggerMsecs = 1 * monitor.oneMinute) 
    async getHeader(): Promise<sdk.BlockHeader> 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
}
```

See also: [BlockHeader](#interface-blockheader), [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskPurge

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

See also: [Monitor](#class-monitor), [TaskPurgeParams](#interface-taskpurgeparams), [WalletMonitorTask](#class-walletmonitortask)

<details>

<summary>Class TaskPurge Details</summary>

#### Property checkNow

Set to true to trigger running this task

```ts
static checkNow = false
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskReviewStatus

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

See also: [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

<details>

<summary>Class TaskReviewStatus Details</summary>

#### Property checkNow

Set to true to trigger running this task

```ts
static checkNow = false
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskSendWaiting

```ts
export class TaskSendWaiting extends WalletMonitorTask {
    static taskName = "SendWaiting";
    constructor(monitor: Monitor, public triggerMsecs = 1000 * 60 * 5, public agedMsecs = 0) 
    trigger(nowMsecsSinceEpoch: number): {
        run: boolean;
    } 
    async runTask(): Promise<string> 
    async processUnsent(reqApis: table.ProvenTxReq[], indent = 0): Promise<string> 
}
```

See also: [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

<details>

<summary>Class TaskSendWaiting Details</summary>

#### Method processUnsent

Process an array of 'unsent' status table.ProvenTxReq

Send rawTx to transaction processor(s), requesting proof callbacks when possible.

Set status 'invalid' if req is invalid.

Set status to 'callback' on successful network submission with callback service.

Set status to 'unmined' on successful network submission without callback service.

Add mapi responses to database table if received.

Increments attempts if sending was attempted.

```ts
async processUnsent(reqApis: table.ProvenTxReq[], indent = 0): Promise<string> 
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: TaskSyncWhenIdle

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

See also: [Monitor](#class-monitor), [WalletMonitorTask](#class-walletmonitortask)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_BAD_REQUEST

The request is invalid.

```ts
export class WERR_BAD_REQUEST extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_INSUFFICIENT_FUNDS

Insufficient funds in the available inputs to cover the cost of the required outputs
and the transaction fee (${moreSatoshisNeeded} more satoshis are needed,
for a total of ${totalSatoshisNeeded}), plus whatever would be required in order
to pay the fee to unlock and spend the outputs used to provide the additional satoshis.

```ts
export class WERR_INSUFFICIENT_FUNDS extends WalletError {
    constructor(public totalSatoshisNeeded: number, public moreSatoshisNeeded: number) 
}
```

See also: [WalletError](#class-walleterror)

<details>

<summary>Class WERR_INSUFFICIENT_FUNDS Details</summary>

#### Constructor

```ts
constructor(public totalSatoshisNeeded: number, public moreSatoshisNeeded: number) 
```

Argument Details

+ **totalSatoshisNeeded**
  + Total satoshis required to fund transactions after net of required inputs and outputs.
+ **moreSatoshisNeeded**
  + Shortfall on total satoshis required to fund transactions after net of required inputs and outputs.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_INTERNAL

An internal error has occurred.

This is an example of an error with an optional custom `message`.

```ts
export class WERR_INTERNAL extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_INVALID_OPERATION

The ${parameter} parameter is invalid.

This is an example of an error object with a custom property `parameter` and templated `message`.

```ts
export class WERR_INVALID_OPERATION extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_INVALID_PARAMETER

The ${parameter} parameter is invalid.

This is an example of an error object with a custom property `parameter` and templated `message`.

```ts
export class WERR_INVALID_PARAMETER extends WalletError {
    constructor(public parameter: string, mustBe?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_INVALID_PUBLIC_KEY

```ts
export class WERR_INVALID_PUBLIC_KEY extends WalletError {
    constructor(public key: string, network: WalletNetwork = "mainnet") 
}
```

See also: [WalletError](#class-walleterror)

<details>

<summary>Class WERR_INVALID_PUBLIC_KEY Details</summary>

#### Constructor

```ts
constructor(public key: string, network: WalletNetwork = "mainnet") 
```

Argument Details

+ **key**
  + The invalid public key that caused the error.
+ **environment**
  + Optional environment flag to control whether the key is included in the message.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_MISSING_PARAMETER

The required ${parameter} parameter is missing.

This is an example of an error object with a custom property `parameter`

```ts
export class WERR_MISSING_PARAMETER extends WalletError {
    constructor(public parameter: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_NETWORK_CHAIN

Configured network chain is invalid or does not match across services.

```ts
export class WERR_NETWORK_CHAIN extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_NOT_ACTIVE

WalletStorageManager is not accessing user's active storage.

```ts
export class WERR_NOT_ACTIVE extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_NOT_IMPLEMENTED

Not implemented.

```ts
export class WERR_NOT_IMPLEMENTED extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WERR_UNAUTHORIZED

Access is denied due to an authorization error.

```ts
export class WERR_UNAUTHORIZED extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: Wallet

```ts
export class Wallet implements WalletInterface, ProtoWallet {
    chain: sdk.Chain;
    keyDeriver: KeyDeriver;
    storage: WalletStorageManager;
    services?: sdk.WalletServices;
    monitor?: Monitor;
    identityKey: string;
    beef: BeefParty;
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
    async createAction(args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateActionResult> 
    async signAction(args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<SignActionResult> 
    async abortAction(args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AbortActionResult> 
    async internalizeAction(args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<InternalizeActionResult> 
    async relinquishOutput(args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RelinquishOutputResult> 
    async isAuthenticated(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async waitForAuthentication(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> 
    async getHeight(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> 
    async getHeaderForHeight(args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeaderResult> 
    async getNetwork(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> 
    async getVersion(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> 
}
```

See also: [Chain](#type-chain), [KeyPair](#interface-keypair), [Monitor](#class-monitor), [PendingSignAction](#interface-pendingsignaction), [PrivilegedKeyManager](#class-privilegedkeymanager), [StorageIdentity](#interface-storageidentity), [WalletArgs](#interface-walletargs), [WalletServices](#interface-walletservices), [WalletSigner](#class-walletsigner), [WalletStorageManager](#class-walletstoragemanager), [createAction](#function-createaction), [getIdentityKey](#function-getidentitykey), [internalizeAction](#function-internalizeaction), [listCertificates](#function-listcertificates), [proveCertificate](#function-provecertificate), [signAction](#function-signaction)

<details>

<summary>Class Wallet Details</summary>

#### Property beef

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

#### Property randomVals

For repeatability testing, set to an array of random numbers from [0..1).

```ts
randomVals?: number[] = undefined
```

#### Method getKnownTxids

```ts
getKnownTxids(newKnownTxids?: string[]): string[] 
```

Returns

the full list of txids whose validity this wallet claims to know.

Argument Details

+ **newKnownTxids**
  + Optional. Additional new txids known to be valid by the caller to be merged.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WalletError

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

<details>

<summary>Class WalletError Details</summary>

#### Method asStatus

```ts
asStatus(): {
    status: string;
    code: string;
    description: string;
} 
```

Returns

standard HTTP error status object with status property set to 'error'.

#### Method fromUnknown

Recovers all public fields from WalletError derived error classes and relevant Error derived errors.

```ts
static fromUnknown(err: unknown): WalletError 
```
See also: [WalletError](#class-walleterror)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WalletMonitorTask

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

See also: [Monitor](#class-monitor), [MonitorStorage](#type-monitorstorage)

<details>

<summary>Class WalletMonitorTask Details</summary>

#### Property lastRunMsecsSinceEpoch

Set by monitor each time runTask completes

```ts
lastRunMsecsSinceEpoch = 0
```

#### Method asyncSetup

Override to handle async task setup configuration.

Called before first call to `trigger`

```ts
async asyncSetup(): Promise<void> 
```

#### Method trigger

Return true if `runTask` needs to be called now.

```ts
abstract trigger(nowMsecsSinceEpoch: number): {
    run: boolean;
}
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WalletSigner

```ts
export class WalletSigner {
    isWalletSigner: true = true;
    chain: sdk.Chain;
    keyDeriver: KeyDeriver;
    storage: WalletStorageManager;
    constructor(chain: sdk.Chain, keyDeriver: KeyDeriver, storage: WalletStorageManager) 
}
```

See also: [Chain](#type-chain), [WalletStorageManager](#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: WalletStorageManager

The `WalletStorageManager` class delivers authentication checking storage access to the wallet.

If manages multiple `StorageBase` derived storage services: one actice, the rest as backups.

Of the storage services, one is 'active' at any one time.
On startup, and whenever triggered by the wallet, `SignerStorage` runs a syncrhonization sequence:

1. While synchronizing, all other access to storage is blocked waiting.
2. The active service is confirmed, potentially triggering a resolution process if there is disagreement.
3. Changes are pushed from the active storage service to each inactive, backup service.

Some storage services do not support multiple writers. `SignerStorage` manages wait-blocking write requests
for these services.

```ts
export class WalletStorageManager implements sdk.WalletStorage {
    stores: sdk.WalletStorageProvider[] = [];
    _authId: sdk.AuthId;
    _services?: sdk.WalletServices;
    _userIdentityKeyToId: Record<string, number> = {};
    _readerCount: number = 0;
    _writerCount: number = 0;
    _isSingleWriter: boolean = true;
    _syncLocked: boolean = false;
    _storageProviderLocked: boolean = false;
    constructor(identityKey: string, active?: sdk.WalletStorageProvider, backups?: sdk.WalletStorageProvider[]) 
    isStorageProvider(): boolean 
    async getUserId(): Promise<number> 
    async getAuth(mustBeActive?: boolean): Promise<sdk.AuthId> 
    getActive(): sdk.WalletStorageProvider 
    async getActiveForWriter(): Promise<sdk.WalletStorageWriter> 
    async getActiveForReader(): Promise<sdk.WalletStorageReader> 
    async getActiveForSync(): Promise<sdk.WalletStorageSync> 
    async getActiveForStorageProvider(): Promise<StorageProvider> 
    async runAsWriter<R>(writer: (active: sdk.WalletStorageWriter) => Promise<R>): Promise<R> 
    async runAsReader<R>(reader: (active: sdk.WalletStorageReader) => Promise<R>): Promise<R> 
    async runAsSync<R>(sync: (active: sdk.WalletStorageSync) => Promise<R>, activeSync?: sdk.WalletStorageSync): Promise<R> 
    async runAsStorageProvider<R>(sync: (active: StorageProvider) => Promise<R>): Promise<R> 
    isActiveStorageProvider(): boolean 
    isAvailable(): boolean 
    async addWalletStorageProvider(provider: sdk.WalletStorageProvider): Promise<void> 
    setServices(v: sdk.WalletServices) 
    getServices(): sdk.WalletServices 
    getSettings(): table.Settings 
    async makeAvailable(): Promise<table.Settings> 
    async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    async destroy(): Promise<void> 
    async findOrInsertUser(identityKey: string): Promise<{
        user: table.User;
        isNew: boolean;
    }> 
    async abortAction(args: AbortActionArgs): Promise<AbortActionResult> 
    async createAction(vargs: sdk.ValidCreateActionArgs): Promise<sdk.StorageCreateActionResult> 
    async internalizeAction(args: InternalizeActionArgs): Promise<InternalizeActionResult> 
    async relinquishCertificate(args: RelinquishCertificateArgs): Promise<number> 
    async relinquishOutput(args: RelinquishOutputArgs): Promise<number> 
    async processAction(args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
    async insertCertificate(certificate: table.Certificate): Promise<number> 
    async listActions(vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    async listCertificates(args: sdk.ValidListCertificatesArgs): Promise<ListCertificatesResult> 
    async listOutputs(vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    async findCertificates(args: sdk.FindCertificatesArgs): Promise<table.Certificate[]> 
    async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]> 
    async findOutputs(args: sdk.FindOutputsArgs): Promise<table.Output[]> 
    async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]> 
    async syncFromReader(identityKey: string, reader: StorageSyncReader): Promise<void> 
    async updateBackups(activeSync?: sdk.WalletStorageSync) 
    async syncToWriter(auth: sdk.AuthId, writer: sdk.WalletStorageProvider, activeSync?: sdk.WalletStorageSync): Promise<{
        inserts: number;
        updates: number;
    }> 
    async setActive(storageIdentityKey: string): Promise<void> 
}
```

See also: [AuthId](#interface-authid), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [StorageProvider](#class-storageprovider), [StorageSyncReader](#class-storagesyncreader), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [WalletStorage](#interface-walletstorage), [WalletStorageProvider](#interface-walletstorageprovider), [WalletStorageReader](#interface-walletstoragereader), [WalletStorageSync](#interface-walletstoragesync), [WalletStorageWriter](#interface-walletstoragewriter), [createAction](#function-createaction), [internalizeAction](#function-internalizeaction), [listCertificates](#function-listcertificates), [processAction](#function-processaction)

<details>

<summary>Class WalletStorageManager Details</summary>

#### Property _isSingleWriter

if true, allow only a single writer to proceed at a time.
queue the blocked requests so they get executed in order when released.

```ts
_isSingleWriter: boolean = true
```

#### Property _storageProviderLocked

if true, allow no new reader or writers or sync to proceed.
queue the blocked requests so they get executed in order when released.

```ts
_storageProviderLocked: boolean = false
```

#### Property _syncLocked

if true, allow no new reader or writers to proceed.
queue the blocked requests so they get executed in order when released.

```ts
_syncLocked: boolean = false
```

#### Method isActiveStorageProvider

```ts
isActiveStorageProvider(): boolean 
```

Returns

true if the active `WalletStorageProvider` also implements `StorageProvider`

#### Method runAsSync

```ts
async runAsSync<R>(sync: (active: sdk.WalletStorageSync) => Promise<R>, activeSync?: sdk.WalletStorageSync): Promise<R> 
```
See also: [WalletStorageSync](#interface-walletstoragesync)

Argument Details

+ **sync**
  + the function to run with sync access lock
+ **activeSync**
  + from chained sync functions, active storage already held under sync access lock.

#### Method setActive

Updates backups and switches to new active storage provider from among current backup providers.

```ts
async setActive(storageIdentityKey: string): Promise<void> 
```

Argument Details

+ **storageIdentityKey**
  + of current backup storage provider that is to become the new active provider.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
## Functions

| | | |
| --- | --- | --- |
| [acquireDirectCertificate](#function-acquiredirectcertificate) | [makePostBeefResult](#function-makepostbeefresult) | [validateDiscoverByAttributesArgs](#function-validatediscoverbyattributesargs) |
| [arraysEqual](#function-arraysequal) | [makePostBeefToTaalARC](#function-makepostbeeftotaalarc) | [validateDiscoverByIdentityKeyArgs](#function-validatediscoverbyidentitykeyargs) |
| [asArray](#function-asarray) | [makePostTxsToTaalARC](#function-makeposttxstotaalarc) | [validateGenerateChangeSdkParams](#function-validategeneratechangesdkparams) |
| [asBsvSdkPrivateKey](#function-asbsvsdkprivatekey) | [maxDate](#function-maxdate) | [validateGenerateChangeSdkResult](#function-validategeneratechangesdkresult) |
| [asBsvSdkPublickKey](#function-asbsvsdkpublickkey) | [offsetPubKey](#function-offsetpubkey) | [validateInteger](#function-validateinteger) |
| [asBsvSdkScript](#function-asbsvsdkscript) | [optionalArraysEqual](#function-optionalarraysequal) | [validateInternalizeActionArgs](#function-validateinternalizeactionargs) |
| [asBsvSdkTx](#function-asbsvsdktx) | [parseTxScriptOffsets](#function-parsetxscriptoffsets) | [validateInternalizeOutput](#function-validateinternalizeoutput) |
| [asString](#function-asstring) | [parseWalletOutpoint](#function-parsewalletoutpoint) | [validateListActionsArgs](#function-validatelistactionsargs) |
| [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork) | [postBeefToArcMiner](#function-postbeeftoarcminer) | [validateListCertificatesArgs](#function-validatelistcertificatesargs) |
| [completeSignedTransaction](#function-completesignedtransaction) | [postBeefToTaalArcMiner](#function-postbeeftotaalarcminer) | [validateListOutputsArgs](#function-validatelistoutputsargs) |
| [completeSignedTransaction](#function-completesignedtransaction) | [postTxsToTaalArcMiner](#function-posttxstotaalarcminer) | [validateOptionalInteger](#function-validateoptionalinteger) |
| [convertProofToMerklePath](#function-convertprooftomerklepath) | [processAction](#function-processaction) | [validateOptionalOutpointString](#function-validateoptionaloutpointstring) |
| [createAction](#function-createaction) | [processAction](#function-processaction) | [validateOriginator](#function-validateoriginator) |
| [createAction](#function-createaction) | [proveCertificate](#function-provecertificate) | [validateOutpointString](#function-validateoutpointstring) |
| [createDefaultWalletServicesOptions](#function-createdefaultwalletservicesoptions) | [randomBytes](#function-randombytes) | [validatePositiveIntegerOrZero](#function-validatepositiveintegerorzero) |
| [createStorageServiceChargeScript](#function-createstorageservicechargescript) | [randomBytesBase64](#function-randombytesbase64) | [validateProveCertificateArgs](#function-validateprovecertificateargs) |
| [doubleSha256BE](#function-doublesha256be) | [randomBytesHex](#function-randombyteshex) | [validateRelinquishCertificateArgs](#function-validaterelinquishcertificateargs) |
| [doubleSha256HashLE](#function-doublesha256hashle) | [sha256Hash](#function-sha256hash) | [validateRelinquishOutputArgs](#function-validaterelinquishoutputargs) |
| [generateChangeSdk](#function-generatechangesdk) | [signAction](#function-signaction) | [validateSatoshis](#function-validatesatoshis) |
| [generateChangeSdkMakeStorage](#function-generatechangesdkmakestorage) | [stampLog](#function-stamplog) | [validateScriptHash](#function-validatescripthash) |
| [getBeefForTransaction](#function-getbeeffortransaction) | [stampLogFormat](#function-stamplogformat) | [validateSecondsSinceEpoch](#function-validatesecondssinceepoch) |
| [getExchangeRatesIo](#function-getexchangeratesio) | [toBinaryBaseBlockHeader](#function-tobinarybaseblockheader) | [validateSignActionArgs](#function-validatesignactionargs) |
| [getIdentityKey](#function-getidentitykey) | [toWalletNetwork](#function-towalletnetwork) | [validateSignActionOptions](#function-validatesignactionoptions) |
| [getMerklePathFromTaalARC](#function-getmerklepathfromtaalarc) | [transactionInputSize](#function-transactioninputsize) | [validateStorageFeeModel](#function-validatestoragefeemodel) |
| [getMerklePathFromWhatsOnChainTsc](#function-getmerklepathfromwhatsonchaintsc) | [transactionOutputSize](#function-transactionoutputsize) | [validateStringLength](#function-validatestringlength) |
| [getRawTxFromWhatsOnChain](#function-getrawtxfromwhatsonchain) | [transactionSize](#function-transactionsize) | [validateWalletPayment](#function-validatewalletpayment) |
| [getSyncChunk](#function-getsyncchunk) | [updateBsvExchangeRate](#function-updatebsvexchangerate) | [varUintSize](#function-varuintsize) |
| [getTaalArcServiceConfig](#function-gettaalarcserviceconfig) | [updateChaintracksFiatExchangeRates](#function-updatechaintracksfiatexchangerates) | [verifyHexString](#function-verifyhexstring) |
| [getUtxoStatusFromWhatsOnChain](#function-getutxostatusfromwhatsonchain) | [updateExchangeratesapi](#function-updateexchangeratesapi) | [verifyId](#function-verifyid) |
| [internalizeAction](#function-internalizeaction) | [validateAbortActionArgs](#function-validateabortactionargs) | [verifyInteger](#function-verifyinteger) |
| [internalizeAction](#function-internalizeaction) | [validateAcquireCertificateArgs](#function-validateacquirecertificateargs) | [verifyNumber](#function-verifynumber) |
| [isHexString](#function-ishexstring) | [validateAcquireDirectCertificateArgs](#function-validateacquiredirectcertificateargs) | [verifyOne](#function-verifyone) |
| [listCertificates](#function-listcertificates) | [validateAcquireIssuanceCertificateArgs](#function-validateacquireissuancecertificateargs) | [verifyOneOrNone](#function-verifyoneornone) |
| [lockScriptWithKeyOffsetFromPubKey](#function-lockscriptwithkeyoffsetfrompubkey) | [validateBasketInsertion](#function-validatebasketinsertion) | [verifyOptionalHexString](#function-verifyoptionalhexstring) |
| [makeAtomicBeef](#function-makeatomicbeef) | [validateCreateActionArgs](#function-validatecreateactionargs) | [verifyTruthy](#function-verifytruthy) |
| [makeAtomicBeef](#function-makeatomicbeef) | [validateCreateActionInput](#function-validatecreateactioninput) | [wait](#function-wait) |
| [makeErrorResult](#function-makeerrorresult) | [validateCreateActionOptions](#function-validatecreateactionoptions) |  |
| [makeGetMerklePathFromTaalARC](#function-makegetmerklepathfromtaalarc) | [validateCreateActionOutput](#function-validatecreateactionoutput) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Function: acquireDirectCertificate

```ts
export async function acquireDirectCertificate(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidAcquireDirectCertificateArgs): Promise<AcquireCertificateResult> 
```

See also: [AuthId](#interface-authid), [ValidAcquireDirectCertificateArgs](#interface-validacquiredirectcertificateargs), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: arraysEqual

Compares lengths and direct equality of values.

```ts
export function arraysEqual(arr1: Number[], arr2: Number[]) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: asArray

```ts
export function asArray(val: string | number[]): number[] 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: asBsvSdkPrivateKey

```ts
export function asBsvSdkPrivateKey(privKey: string): PrivateKey 
```

<details>

<summary>Function asBsvSdkPrivateKey Details</summary>

Argument Details

+ **privKey**
  + bitcoin private key in 32 byte hex string form

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: asBsvSdkPublickKey

```ts
export function asBsvSdkPublickKey(pubKey: string): PublicKey 
```

<details>

<summary>Function asBsvSdkPublickKey Details</summary>

Argument Details

+ **pubKey**
  + bitcoin public key in standard compressed key hex string form

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: asBsvSdkScript

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
### Function: asBsvSdkTx

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
### Function: asString

Coerce a value to a hex encoded string if currently a hex encoded string or number[]

```ts
export function asString(val: string | number[]): string {
    if (typeof val === "string")
        return val;
    return Utils.toHex(val);
}
```

<details>

<summary>Function asString Details</summary>

Returns

input val if it is a string; or if number[], converts byte values to hex

Argument Details

+ **val**
  + string or number[]. If string, encoding must be hex. If number[], each value must be 0..255.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: attemptToPostReqsToNetwork

Attempt to post one or more `ProvenTxReq` with status 'unsent'
to the bitcoin network.

```ts
export async function attemptToPostReqsToNetwork(storage: StorageProvider, reqs: entity.ProvenTxReq[], trx?: sdk.TrxToken): Promise<PostReqsToNetworkResult> 
```

See also: [PostReqsToNetworkResult](#interface-postreqstonetworkresult), [StorageProvider](#class-storageprovider), [TrxToken](#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: completeSignedTransaction

```ts
export async function completeSignedTransaction(prior: PendingSignAction, spends: Record<number, SignActionSpend>, wallet: Wallet): Promise<Transaction> 
```

See also: [PendingSignAction](#interface-pendingsignaction), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: completeSignedTransaction

```ts
export async function completeSignedTransaction(prior: PendingSignAction, spends: Record<number, SignActionSpend>, wallet: Wallet): Promise<BsvTransaction> 
```

See also: [PendingSignAction](#interface-pendingsignaction), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: convertProofToMerklePath

```ts
export function convertProofToMerklePath(txid: string, proof: TscMerkleProofApi): MerklePath 
```

See also: [TscMerkleProofApi](#interface-tscmerkleproofapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: createAction

```ts
export async function createAction(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidCreateActionArgs): Promise<CreateActionResult> 
```

See also: [AuthId](#interface-authid), [ValidCreateActionArgs](#interface-validcreateactionargs), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: createAction

```ts
export async function createAction(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidCreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<sdk.StorageCreateActionResult> 
```

See also: [AuthId](#interface-authid), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProvider](#class-storageprovider), [ValidCreateActionArgs](#interface-validcreateactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: createDefaultWalletServicesOptions

```ts
export function createDefaultWalletServicesOptions(chain: sdk.Chain): sdk.WalletServicesOptions 
```

See also: [Chain](#type-chain), [WalletServicesOptions](#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: createStorageServiceChargeScript

```ts
export function createStorageServiceChargeScript(pubKeyHex: PubKeyHex): {
    script: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: doubleSha256BE

Calculate the SHA256 hash of the SHA256 hash of an array of bytes.

```ts
export function doubleSha256BE(data: number[]): number[] {
    return doubleSha256HashLE(data).reverse();
}
```

See also: [doubleSha256HashLE](#function-doublesha256hashle)

<details>

<summary>Function doubleSha256BE Details</summary>

Returns

reversed (big-endian) double sha256 hash of data, byte 31 of hash first.

Argument Details

+ **data**
  + is an array of bytes.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: doubleSha256HashLE

Calculate the SHA256 hash of the SHA256 hash of an array of bytes.

```ts
export function doubleSha256HashLE(data: number[]): number[] {
    const first = new Hash.SHA256().update(data).digest();
    const second = new Hash.SHA256().update(first).digest();
    return second;
}
```

<details>

<summary>Function doubleSha256HashLE Details</summary>

Returns

double sha256 hash of data, byte 0 of hash first.

Argument Details

+ **data**
  + an array of bytes

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: generateChangeSdk

Simplifications:
 - only support one change type with fixed length scripts.
 - only support satsPerKb fee model.

Confirms for each availbleChange output that it remains available as they are allocated and selects alternate if not.

```ts
export async function generateChangeSdk(params: GenerateChangeSdkParams, allocateChangeInput: (targetSatoshis: number, exactSatoshis?: number) => Promise<GenerateChangeSdkChangeInput | undefined>, releaseChangeInput: (outputId: number) => Promise<void>): Promise<GenerateChangeSdkResult> 
```

See also: [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput), [GenerateChangeSdkParams](#interface-generatechangesdkparams), [GenerateChangeSdkResult](#interface-generatechangesdkresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: generateChangeSdkMakeStorage

```ts
export function generateChangeSdkMakeStorage(availableChange: GenerateChangeSdkChangeInput[]): {
    allocateChangeInput: (targetSatoshis: number, exactSatoshis?: number) => Promise<GenerateChangeSdkChangeInput | undefined>;
    releaseChangeInput: (outputId: number) => Promise<void>;
    getLog: () => string;
} 
```

See also: [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getBeefForTransaction

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

See also: [StorageGetBeefOptions](#interface-storagegetbeefoptions), [StorageProvider](#class-storageprovider)

<details>

<summary>Function getBeefForTransaction Details</summary>

Argument Details

+ **storage**
  + the chain on which txid exists.
+ **txid**
  + the transaction hash for which an envelope is requested.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getExchangeRatesIo

```ts
export async function getExchangeRatesIo(key: string): Promise<ExchangeRatesIoApi> 
```

See also: [ExchangeRatesIoApi](#interface-exchangeratesioapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getIdentityKey

```ts
export async function getIdentityKey(wallet: CertOpsWallet): Promise<PubKeyHex> 
```

See also: [CertOpsWallet](#interface-certopswallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getMerklePathFromTaalARC

```ts
export async function getMerklePathFromTaalARC(txid: string, config: ArcServiceConfig, services: sdk.WalletServices): Promise<sdk.GetMerklePathResult> 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [GetMerklePathResult](#interface-getmerklepathresult), [WalletServices](#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getMerklePathFromWhatsOnChainTsc

WhatOnChain.com has their own "hash/pos/R/L" proof format and a more TSC compliant proof format.

The "/proof/tsc" endpoint is much closer to the TSC specification. It provides "index" directly and each node is just the provided hash value.
The "targetType" is unspecified and thus defaults to block header hash, requiring a Chaintracks lookup to get the merkleRoot...
Duplicate hash values are provided in full instead of being replaced by "*".

```ts
export async function getMerklePathFromWhatsOnChainTsc(txid: string, chain: sdk.Chain, services: sdk.WalletServices): Promise<sdk.GetMerklePathResult> 
```

See also: [Chain](#type-chain), [GetMerklePathResult](#interface-getmerklepathresult), [WalletServices](#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getRawTxFromWhatsOnChain

```ts
export async function getRawTxFromWhatsOnChain(txid: string, chain: sdk.Chain): Promise<sdk.GetRawTxResult> 
```

See also: [Chain](#type-chain), [GetRawTxResult](#interface-getrawtxresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getSyncChunk

Gets the next sync chunk of updated data from un-remoted storage (could be using a remote DB connection).

```ts
export async function getSyncChunk(storage: StorageReader, args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
```

See also: [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageReader](#class-storagereader), [SyncChunk](#interface-syncchunk)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getTaalArcServiceConfig

```ts
export function getTaalArcServiceConfig(chain: sdk.Chain, apiKey: string): ArcServiceConfig 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: getUtxoStatusFromWhatsOnChain

```ts
export async function getUtxoStatusFromWhatsOnChain(output: string, chain: sdk.Chain, outputFormat?: sdk.GetUtxoStatusOutputFormat): Promise<sdk.GetUtxoStatusResult> 
```

See also: [Chain](#type-chain), [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat), [GetUtxoStatusResult](#interface-getutxostatusresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: internalizeAction

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
export async function internalizeAction(wallet: Wallet, auth: sdk.AuthId, args: InternalizeActionArgs): Promise<InternalizeActionResult> 
```

See also: [AuthId](#interface-authid), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: internalizeAction

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
export async function internalizeAction(storage: StorageProvider, auth: sdk.AuthId, args: InternalizeActionArgs): Promise<InternalizeActionResult> 
```

See also: [AuthId](#interface-authid), [StorageProvider](#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: isHexString

```ts
export function isHexString(s: string): boolean 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: listCertificates

```ts
export async function listCertificates(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
```

See also: [AuthId](#interface-authid), [StorageProvider](#class-storageprovider), [ValidListCertificatesArgs](#interface-validlistcertificatesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: lockScriptWithKeyOffsetFromPubKey

```ts
export function lockScriptWithKeyOffsetFromPubKey(pubKey: string, keyOffset?: string): {
    script: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makeAtomicBeef

```ts
export function makeAtomicBeef(tx: Transaction, beef: number[] | Beef): number[] 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makeAtomicBeef

```ts
export function makeAtomicBeef(tx: BsvTransaction, beef: number[] | Beef): number[] 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makeErrorResult

```ts
export function makeErrorResult(error: sdk.WalletError, miner: ArcServiceConfig, beef: number[], txids: string[], dd?: ArcMinerPostBeefDataApi): sdk.PostBeefResult 
```

See also: [ArcMinerPostBeefDataApi](#interface-arcminerpostbeefdataapi), [ArcServiceConfig](#interface-arcserviceconfig), [PostBeefResult](#interface-postbeefresult), [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makeGetMerklePathFromTaalARC

```ts
export function makeGetMerklePathFromTaalARC(config: ArcServiceConfig): sdk.GetMerklePathService 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [GetMerklePathService](#type-getmerklepathservice)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makePostBeefResult

```ts
export function makePostBeefResult(dd: ArcMinerPostBeefDataApi, miner: ArcServiceConfig, beef: number[], txids: string[]): sdk.PostBeefResult 
```

See also: [ArcMinerPostBeefDataApi](#interface-arcminerpostbeefdataapi), [ArcServiceConfig](#interface-arcserviceconfig), [PostBeefResult](#interface-postbeefresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makePostBeefToTaalARC

```ts
export function makePostBeefToTaalARC(config: ArcServiceConfig): sdk.PostBeefService 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [PostBeefService](#type-postbeefservice)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: makePostTxsToTaalARC

```ts
export function makePostTxsToTaalARC(config: ArcServiceConfig): sdk.PostTxsService 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [PostTxsService](#type-posttxsservice)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: maxDate

```ts
export function maxDate(d1?: Date, d2?: Date): Date | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: offsetPubKey

```ts
export function offsetPubKey(pubKey: string, keyOffset?: string): {
    offsetPubKey: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: optionalArraysEqual

```ts
export function optionalArraysEqual(arr1?: Number[], arr2?: Number[]) 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: parseTxScriptOffsets

```ts
export function parseTxScriptOffsets(rawTx: number[]): TxScriptOffsets 
```

See also: [TxScriptOffsets](#interface-txscriptoffsets)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: parseWalletOutpoint

```ts
export function parseWalletOutpoint(outpoint: string): {
    txid: string;
    vout: number;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: postBeefToArcMiner

```ts
export async function postBeefToArcMiner(beef: Beef | number[], txids: string[], config: ArcServiceConfig): Promise<sdk.PostBeefResult> 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [PostBeefResult](#interface-postbeefresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: postBeefToTaalArcMiner

```ts
export async function postBeefToTaalArcMiner(beef: Beef, txids: string[], config: ArcServiceConfig, services: sdk.WalletServices): Promise<sdk.PostBeefResult> 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [PostBeefResult](#interface-postbeefresult), [WalletServices](#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: postTxsToTaalArcMiner

```ts
export async function postTxsToTaalArcMiner(beef: Beef, txids: string[], config: ArcServiceConfig, services: sdk.WalletServices): Promise<sdk.PostTxsResult> 
```

See also: [ArcServiceConfig](#interface-arcserviceconfig), [PostTxsResult](#interface-posttxsresult), [WalletServices](#interface-walletservices)

<details>

<summary>Function postTxsToTaalArcMiner Details</summary>

Argument Details

+ **txs**
  + All transactions must have source transactions. Will just source locking scripts and satoshis do?? toHexEF() is used.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: processAction

```ts
export async function processAction(prior: PendingSignAction | undefined, wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidProcessActionArgs): Promise<SendWithResult[] | undefined> 
```

See also: [AuthId](#interface-authid), [PendingSignAction](#interface-pendingsignaction), [ValidProcessActionArgs](#interface-validprocessactionargs), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: processAction

```ts
export async function processAction(storage: StorageProvider, auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
```

See also: [AuthId](#interface-authid), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [StorageProvider](#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: proveCertificate

```ts
export async function proveCertificate(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidProveCertificateArgs): Promise<ProveCertificateResult> 
```

See also: [AuthId](#interface-authid), [ValidProveCertificateArgs](#interface-validprovecertificateargs), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: randomBytes

```ts
export function randomBytes(count: number): number[] 
```

<details>

<summary>Function randomBytes Details</summary>

Returns

count cryptographically secure random bytes as array of bytes

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: randomBytesBase64

```ts
export function randomBytesBase64(count: number): string 
```

<details>

<summary>Function randomBytesBase64 Details</summary>

Returns

count cryptographically secure random bytes as base64 encoded string

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: randomBytesHex

```ts
export function randomBytesHex(count: number): string 
```

<details>

<summary>Function randomBytesHex Details</summary>

Returns

count cryptographically secure random bytes as hex encoded string

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: sha256Hash

Calculate the SHA256 hash of an array of bytes

```ts
export function sha256Hash(data: number[]): number[] {
    const first = new Hash.SHA256().update(data).digest();
    return first;
}
```

<details>

<summary>Function sha256Hash Details</summary>

Returns

sha256 hash of buffer contents.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: signAction

```ts
export async function signAction(wallet: Wallet, auth: sdk.AuthId, vargs: sdk.ValidSignActionArgs): Promise<SignActionResult> 
```

See also: [AuthId](#interface-authid), [ValidSignActionArgs](#interface-validsignactionargs), [Wallet](#class-wallet)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: stampLog

If a log is being kept, add a time stamped line.

```ts
export function stampLog(log: string | undefined | {
    log?: string;
}, lineToAdd: string): string | undefined 
```

<details>

<summary>Function stampLog Details</summary>

Returns

undefined or log extended by time stamped `lineToAdd` and new line.

Argument Details

+ **log**
  + Optional time stamped log to extend, or an object with a log property to update
+ **lineToAdd**
  + Content to add to line.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: stampLogFormat

Replaces individual timestamps with delta msecs.
Looks for two network crossings and adjusts clock for clock skew if found.
Assumes log built by repeated calls to `stampLog`

```ts
export function stampLogFormat(log?: string): string 
```

<details>

<summary>Function stampLogFormat Details</summary>

Returns

reformated multi-line event log

Argument Details

+ **log**
  + Each logged event starts with ISO time stamp, space, rest of line, terminated by `\n`.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: toBinaryBaseBlockHeader

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

See also: [BaseBlockHeader](#interface-baseblockheader), [asArray](#function-asarray)

<details>

<summary>Function toBinaryBaseBlockHeader Details</summary>

Returns

80 byte array

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: toWalletNetwork

```ts
export function toWalletNetwork(chain: Chain): WalletNetwork 
```

See also: [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: transactionInputSize

```ts
export function transactionInputSize(scriptSize: number): number 
```

<details>

<summary>Function transactionInputSize Details</summary>

Returns

serialized byte length a transaction input

Argument Details

+ **scriptSize**
  + byte length of input script

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: transactionOutputSize

```ts
export function transactionOutputSize(scriptSize: number): number 
```

<details>

<summary>Function transactionOutputSize Details</summary>

Returns

serialized byte length a transaction output

Argument Details

+ **scriptSize**
  + byte length of output script

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: transactionSize

Compute the serialized binary transaction size in bytes
given the number of inputs and outputs,
and the size of each script.

```ts
export function transactionSize(inputs: number[], outputs: number[]): number 
```

<details>

<summary>Function transactionSize Details</summary>

Returns

total transaction size in bytes

Argument Details

+ **inputs**
  + array of input script lengths, in bytes
+ **outputs**
  + array of output script lengths, in bytes

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: updateBsvExchangeRate

```ts
export async function updateBsvExchangeRate(rate?: sdk.BsvExchangeRate, updateMsecs?: number): Promise<sdk.BsvExchangeRate> 
```

See also: [BsvExchangeRate](#interface-bsvexchangerate)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: updateChaintracksFiatExchangeRates

```ts
export async function updateChaintracksFiatExchangeRates(targetCurrencies: string[], options: sdk.WalletServicesOptions): Promise<sdk.FiatExchangeRates> 
```

See also: [FiatExchangeRates](#interface-fiatexchangerates), [WalletServicesOptions](#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: updateExchangeratesapi

```ts
export async function updateExchangeratesapi(targetCurrencies: string[], options: sdk.WalletServicesOptions): Promise<sdk.FiatExchangeRates> 
```

See also: [FiatExchangeRates](#interface-fiatexchangerates), [WalletServicesOptions](#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateAbortActionArgs

```ts
export function validateAbortActionArgs(args: AbortActionArgs): ValidAbortActionArgs 
```

See also: [ValidAbortActionArgs](#interface-validabortactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateAcquireCertificateArgs

```ts
export async function validateAcquireCertificateArgs(args: AcquireCertificateArgs): Promise<ValidAcquireCertificateArgs> 
```

See also: [ValidAcquireCertificateArgs](#interface-validacquirecertificateargs)

<details>

<summary>Function validateAcquireCertificateArgs Details</summary>

Argument Details

+ **subject**
  + Must be valid for "direct" `acquisitionProtocol`. public key of the certificate subject.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateAcquireDirectCertificateArgs

```ts
export function validateAcquireDirectCertificateArgs(args: AcquireCertificateArgs): ValidAcquireDirectCertificateArgs 
```

See also: [ValidAcquireDirectCertificateArgs](#interface-validacquiredirectcertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateAcquireIssuanceCertificateArgs

```ts
export function validateAcquireIssuanceCertificateArgs(args: AcquireCertificateArgs): ValidAcquireIssuanceCertificateArgs 
```

See also: [ValidAcquireIssuanceCertificateArgs](#interface-validacquireissuancecertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateBasketInsertion

```ts
export function validateBasketInsertion(args?: BasketInsertion): ValidBasketInsertion | undefined 
```

See also: [ValidBasketInsertion](#interface-validbasketinsertion)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateCreateActionArgs

```ts
export function validateCreateActionArgs(args: CreateActionArgs): ValidCreateActionArgs 
```

See also: [ValidCreateActionArgs](#interface-validcreateactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateCreateActionInput

```ts
export function validateCreateActionInput(i: CreateActionInput): ValidCreateActionInput 
```

See also: [ValidCreateActionInput](#interface-validcreateactioninput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateCreateActionOptions

Set all default true/false booleans to true or false if undefined.
Set all possibly undefined numbers to their default values.
Set all possibly undefined arrays to empty arrays.
Convert string outpoints to `{ txid: string, vout: number }`

```ts
export function validateCreateActionOptions(options?: CreateActionOptions): ValidCreateActionOptions 
```

See also: [ValidCreateActionOptions](#interface-validcreateactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateCreateActionOutput

```ts
export function validateCreateActionOutput(o: CreateActionOutput): ValidCreateActionOutput 
```

See also: [ValidCreateActionOutput](#interface-validcreateactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateDiscoverByAttributesArgs

```ts
export function validateDiscoverByAttributesArgs(args: DiscoverByAttributesArgs): ValidDiscoverByAttributesArgs 
```

See also: [ValidDiscoverByAttributesArgs](#interface-validdiscoverbyattributesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateDiscoverByIdentityKeyArgs

```ts
export function validateDiscoverByIdentityKeyArgs(args: DiscoverByIdentityKeyArgs): ValidDiscoverByIdentityKeyArgs 
```

See also: [ValidDiscoverByIdentityKeyArgs](#interface-validdiscoverbyidentitykeyargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateGenerateChangeSdkParams

```ts
export function validateGenerateChangeSdkParams(params: GenerateChangeSdkParams) 
```

See also: [GenerateChangeSdkParams](#interface-generatechangesdkparams)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateGenerateChangeSdkResult

```ts
export function validateGenerateChangeSdkResult(params: GenerateChangeSdkParams, r: GenerateChangeSdkResult): {
    ok: boolean;
    log: string;
} 
```

See also: [GenerateChangeSdkParams](#interface-generatechangesdkparams), [GenerateChangeSdkResult](#interface-generatechangesdkresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateInteger

```ts
export function validateInteger(v: number | undefined, name: string, defaultValue?: number, min?: number, max?: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateInternalizeActionArgs

```ts
export function validateInternalizeActionArgs(args: InternalizeActionArgs): ValidInternalizeActionArgs 
```

See also: [ValidInternalizeActionArgs](#interface-validinternalizeactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateInternalizeOutput

```ts
export function validateInternalizeOutput(args: InternalizeOutput): ValidInternalizeOutput 
```

See also: [ValidInternalizeOutput](#interface-validinternalizeoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateListActionsArgs

```ts
export function validateListActionsArgs(args: ListActionsArgs): ValidListActionsArgs 
```

See also: [ValidListActionsArgs](#interface-validlistactionsargs)

<details>

<summary>Function validateListActionsArgs Details</summary>

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

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateListCertificatesArgs

```ts
export function validateListCertificatesArgs(args: ListCertificatesArgs): ValidListCertificatesArgs 
```

See also: [ValidListCertificatesArgs](#interface-validlistcertificatesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateListOutputsArgs

```ts
export function validateListOutputsArgs(args: ListOutputsArgs): ValidListOutputsArgs 
```

See also: [ValidListOutputsArgs](#interface-validlistoutputsargs)

<details>

<summary>Function validateListOutputsArgs Details</summary>

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

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateOptionalInteger

```ts
export function validateOptionalInteger(v: number | undefined, name: string, min?: number, max?: number): number | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateOptionalOutpointString

```ts
export function validateOptionalOutpointString(outpoint: string | undefined, name: string): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateOriginator

```ts
export function validateOriginator(s?: string): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateOutpointString

```ts
export function validateOutpointString(outpoint: string, name: string): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validatePositiveIntegerOrZero

```ts
export function validatePositiveIntegerOrZero(v: number, name: string): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateProveCertificateArgs

```ts
export function validateProveCertificateArgs(args: ProveCertificateArgs): ValidProveCertificateArgs 
```

See also: [ValidProveCertificateArgs](#interface-validprovecertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateRelinquishCertificateArgs

```ts
export function validateRelinquishCertificateArgs(args: RelinquishCertificateArgs): ValidRelinquishCertificateArgs 
```

See also: [ValidRelinquishCertificateArgs](#interface-validrelinquishcertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateRelinquishOutputArgs

```ts
export function validateRelinquishOutputArgs(args: RelinquishOutputArgs): ValidRelinquishOutputArgs 
```

See also: [ValidRelinquishOutputArgs](#interface-validrelinquishoutputargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateSatoshis

```ts
export function validateSatoshis(v: number | undefined, name: string, min?: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateScriptHash

```ts
export function validateScriptHash(output: string, outputFormat?: sdk.GetUtxoStatusOutputFormat): string 
```

See also: [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateSecondsSinceEpoch

```ts
export function validateSecondsSinceEpoch(time: number): Date 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateSignActionArgs

```ts
export function validateSignActionArgs(args: SignActionArgs): ValidSignActionArgs 
```

See also: [ValidSignActionArgs](#interface-validsignactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateSignActionOptions

Set all default true/false booleans to true or false if undefined.
Set all possibly undefined numbers to their default values.
Set all possibly undefined arrays to empty arrays.
Convert string outpoints to `{ txid: string, vout: number }`

```ts
export function validateSignActionOptions(options?: SignActionOptions): ValidSignActionOptions 
```

See also: [ValidSignActionOptions](#interface-validsignactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateStorageFeeModel

```ts
export function validateStorageFeeModel(v?: sdk.StorageFeeModel): sdk.StorageFeeModel 
```

See also: [StorageFeeModel](#interface-storagefeemodel)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateStringLength

```ts
export function validateStringLength(s: string, name: string, min?: number, max?: number): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: validateWalletPayment

```ts
export function validateWalletPayment(args?: WalletPayment): ValidWalletPayment | undefined 
```

See also: [ValidWalletPayment](#interface-validwalletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: varUintSize

Returns the byte size required to encode number as Bitcoin VarUint

```ts
export function varUintSize(val: number): 1 | 3 | 5 | 9 {
    if (val < 0)
        throw new sdk.WERR_INVALID_PARAMETER("varUint", "non-negative");
    return val <= 252 ? 1 : val <= 65535 ? 3 : val <= 4294967295 ? 5 : 9;
}
```

See also: [WERR_INVALID_PARAMETER](#class-werr_invalid_parameter)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyHexString

Helper function.

Verifies that a hex string is trimmed and lower case.

```ts
export function verifyHexString(v: string): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyId

Helper function.

Verifies that a database record identifier is an integer greater than zero.

```ts
export function verifyId(id: number | undefined | null): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyInteger

Helper function.

Verifies that an optional or null number has a numeric value.

```ts
export function verifyInteger(v: number | null | undefined): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyNumber

Helper function.

Verifies that an optional or null number has a numeric value.

```ts
export function verifyNumber(v: number | null | undefined): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyOne

Helper function.

```ts
export function verifyOne<T>(results: T[], errorDescrition?: string): T 
```

<details>

<summary>Function verifyOne Details</summary>

Returns

results[0].

Throws

WERR_BAD_REQUEST if results has length other than one.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyOneOrNone

Helper function.

```ts
export function verifyOneOrNone<T>(results: T[]): T | undefined 
```

<details>

<summary>Function verifyOneOrNone Details</summary>

Returns

results[0] or undefined if length is zero.

Throws

WERR_BAD_REQUEST if results has length greater than one.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyOptionalHexString

Helper function.

Verifies that an optional or null hex string is undefined or a trimmed lowercase string.

```ts
export function verifyOptionalHexString(v?: string | null): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: verifyTruthy

Helper function.

Verifies that a possibly optional value has a value.

```ts
export function verifyTruthy<T>(v: T | null | undefined, description?: string): T 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: wait

Returns an await'able Promise that resolves in the given number of msecs.

```ts
export function wait(msecs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msecs));
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
## Types

| | |
| --- | --- |
| [Chain](#type-chain) | [PostReqsToNetworkDetailsStatus](#type-postreqstonetworkdetailsstatus) |
| [DBType](#type-dbtype) | [PostTxsService](#type-posttxsservice) |
| [GetMerklePathService](#type-getmerklepathservice) | [ProvenTxReqStatus](#type-proventxreqstatus) |
| [GetRawTxService](#type-getrawtxservice) | [StorageProvidedBy](#type-storageprovidedby) |
| [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat) | [SyncProtocolVersion](#type-syncprotocolversion) |
| [GetUtxoStatusService](#type-getutxostatusservice) | [SyncStatus](#type-syncstatus) |
| [KeyPairAddress](#type-keypairaddress) | [TransactionStatus](#type-transactionstatus) |
| [MonitorStorage](#type-monitorstorage) | [UpdateFiatExchangeRateService](#type-updatefiatexchangerateservice) |
| [PostBeefService](#type-postbeefservice) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Type: Chain

```ts
export type Chain = "main" | "test"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: DBType

```ts
export type DBType = "SQLite" | "MySQL"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: GetMerklePathService

```ts
export type GetMerklePathService = (txid: string, chain: sdk.Chain, services: WalletServices) => Promise<GetMerklePathResult>
```

See also: [Chain](#type-chain), [GetMerklePathResult](#interface-getmerklepathresult), [WalletServices](#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: GetRawTxService

```ts
export type GetRawTxService = (txid: string, chain: sdk.Chain) => Promise<GetRawTxResult>
```

See also: [Chain](#type-chain), [GetRawTxResult](#interface-getrawtxresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: GetUtxoStatusOutputFormat

```ts
export type GetUtxoStatusOutputFormat = "hashLE" | "hashBE" | "script"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: GetUtxoStatusService

```ts
export type GetUtxoStatusService = (output: string, chain: sdk.Chain, outputFormat?: GetUtxoStatusOutputFormat) => Promise<GetUtxoStatusResult>
```

See also: [Chain](#type-chain), [GetUtxoStatusOutputFormat](#type-getutxostatusoutputformat), [GetUtxoStatusResult](#interface-getutxostatusresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: KeyPairAddress

```ts
export type KeyPairAddress = {
    privateKey: PrivateKey;
    publicKey: PublicKey;
    address: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: MonitorStorage

```ts
export type MonitorStorage = WalletStorageManager
```

See also: [WalletStorageManager](#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: PostBeefService

```ts
export type PostBeefService = (beef: Beef, txids: string[], services: WalletServices) => Promise<PostBeefResult>
```

See also: [PostBeefResult](#interface-postbeefresult), [WalletServices](#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: PostReqsToNetworkDetailsStatus

```ts
export type PostReqsToNetworkDetailsStatus = "success" | "doubleSpend" | "unknown"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: PostTxsService

```ts
export type PostTxsService = (beef: Beef, txids: string[], services: WalletServices) => Promise<PostTxsResult>
```

See also: [PostTxsResult](#interface-posttxsresult), [WalletServices](#interface-walletservices)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: ProvenTxReqStatus

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

```ts
export type ProvenTxReqStatus = "sending" | "unsent" | "nosend" | "unknown" | "nonfinal" | "unprocessed" | "unmined" | "callback" | "unconfirmed" | "completed" | "invalid" | "doubleSpend"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: StorageProvidedBy

```ts
export type StorageProvidedBy = "you" | "storage" | "you-and-storage"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: SyncProtocolVersion

```ts
export type SyncProtocolVersion = "0.1.0"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: SyncStatus

success: Last sync of this user from this storage was successful.

error: Last sync protocol operation for this user to this storage threw and error.

identified: Configured sync storage has been identified but not sync'ed.

unknown: Sync protocol state is unknown.

```ts
export type SyncStatus = "success" | "error" | "identified" | "updated" | "unknown"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: TransactionStatus

```ts
export type TransactionStatus = "completed" | "failed" | "unprocessed" | "sending" | "unproven" | "unsigned" | "nosend"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: UpdateFiatExchangeRateService

```ts
export type UpdateFiatExchangeRateService = (targetCurrencies: string[], options: WalletServicesOptions) => Promise<FiatExchangeRates>
```

See also: [FiatExchangeRates](#interface-fiatexchangerates), [WalletServicesOptions](#interface-walletservicesoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
## Variables

| |
| --- |
| [ProvenTxReqNonTerminalStatus](#variable-proventxreqnonterminalstatus) |
| [ProvenTxReqTerminalStatus](#variable-proventxreqterminalstatus) |
| [brc29ProtocolID](#variable-brc29protocolid) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Variable: ProvenTxReqNonTerminalStatus

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

See also: [ProvenTxReqStatus](#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Variable: ProvenTxReqTerminalStatus

```ts
ProvenTxReqTerminalStatus: ProvenTxReqStatus[] = [
    "completed",
    "invalid",
    "doubleSpend"
]
```

See also: [ProvenTxReqStatus](#type-proventxreqstatus)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Variable: brc29ProtocolID

```ts
brc29ProtocolID: WalletProtocol = [2, "3241645161d8"]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
