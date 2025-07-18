# STORAGE: BSV Wallet Toolbox API Documentation

The documentation is split into various pages, this page covers the persistent storage of wallet data: transactions, outputs and metadata.

The [WalletStorageManager](#class-walletstoragemanager) class manages a collection of storage providers of which one is the "active" storage
at any one time, and the rest are backups. It manages access to wallet data, pushing incremental updates to backups, and switching the active
to what was previously a backup.

The [StorageClient](#class-storageclient) implements a cloud based storage provider via JSON-RPC. The [StorageServer](#class-storageserver) class
and `@bsv/wallet-infra` package can be used to host such a JSON-RPC server.

The [StorageKnex](#class-storageknex) class implements `Knex` based database storage with explicit support for both MySQL and SQLite.

[Return To Top](./README.md)

<!--#region ts2md-api-merged-here-->
### API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

#### Interfaces

| | | |
| --- | --- | --- |
| [AdminStatsResult](#interface-adminstatsresult) | [ProvenTxReqHistory](#interface-proventxreqhistory) | [TableOutputBasket](#interface-tableoutputbasket) |
| [CommitNewTxResults](#interface-commitnewtxresults) | [ProvenTxReqHistorySummaryApi](#interface-proventxreqhistorysummaryapi) | [TableOutputTag](#interface-tableoutputtag) |
| [EntitySyncMap](#interface-entitysyncmap) | [ProvenTxReqNotify](#interface-proventxreqnotify) | [TableOutputTagMap](#interface-tableoutputtagmap) |
| [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput) | [StorageAdminStats](#interface-storageadminstats) | [TableOutputX](#interface-tableoutputx) |
| [GenerateChangeSdkChangeOutput](#interface-generatechangesdkchangeoutput) | [StorageIdbOptions](#interface-storageidboptions) | [TableProvenTx](#interface-tableproventx) |
| [GenerateChangeSdkInput](#interface-generatechangesdkinput) | [StorageIdbSchema](#interface-storageidbschema) | [TableProvenTxReq](#interface-tableproventxreq) |
| [GenerateChangeSdkOutput](#interface-generatechangesdkoutput) | [StorageKnexOptions](#interface-storageknexoptions) | [TableProvenTxReqDynamics](#interface-tableproventxreqdynamics) |
| [GenerateChangeSdkParams](#interface-generatechangesdkparams) | [StorageProviderOptions](#interface-storageprovideroptions) | [TableSettings](#interface-tablesettings) |
| [GenerateChangeSdkResult](#interface-generatechangesdkresult) | [StorageReaderOptions](#interface-storagereaderoptions) | [TableSyncState](#interface-tablesyncstate) |
| [GenerateChangeSdkStorageChange](#interface-generatechangesdkstoragechange) | [StorageReaderWriterOptions](#interface-storagereaderwriteroptions) | [TableTransaction](#interface-tabletransaction) |
| [GetReqsAndBeefDetail](#interface-getreqsandbeefdetail) | [SyncError](#interface-syncerror) | [TableTxLabel](#interface-tabletxlabel) |
| [GetReqsAndBeefResult](#interface-getreqsandbeefresult) | [SyncMap](#interface-syncmap) | [TableTxLabelMap](#interface-tabletxlabelmap) |
| [ListActionsSpecOp](#interface-listactionsspecop) | [TableCertificate](#interface-tablecertificate) | [TableUser](#interface-tableuser) |
| [ListOutputsSpecOp](#interface-listoutputsspecop) | [TableCertificateField](#interface-tablecertificatefield) | [ValidateGenerateChangeSdkParamsResult](#interface-validategeneratechangesdkparamsresult) |
| [PostBeefResultForTxidApi](#interface-postbeefresultfortxidapi) | [TableCertificateX](#interface-tablecertificatex) | [WalletStorageServerOptions](#interface-walletstorageserveroptions) |
| [PostReqsToNetworkDetails](#interface-postreqstonetworkdetails) | [TableCommission](#interface-tablecommission) | [XValidCreateActionOutput](#interface-xvalidcreateactionoutput) |
| [PostReqsToNetworkResult](#interface-postreqstonetworkresult) | [TableMonitorEvent](#interface-tablemonitorevent) |  |
| [ProvenTxFromTxidResult](#interface-proventxfromtxidresult) | [TableOutput](#interface-tableoutput) |  |

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
##### Interface: StorageKnexOptions

```ts
export interface StorageKnexOptions extends StorageProviderOptions {
    knex: Knex;
}
```

See also: [StorageProviderOptions](./storage.md#interface-storageprovideroptions)

###### Property knex

Knex database interface initialized with valid connection configuration.

```ts
knex: Knex
```

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
##### Interface: ValidateGenerateChangeSdkParamsResult

```ts
export interface ValidateGenerateChangeSdkParamsResult {
    hasMaxPossibleOutput?: number;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: WalletStorageServerOptions

```ts
export interface WalletStorageServerOptions {
    port: number;
    wallet: Wallet;
    monetize: boolean;
    calculateRequestPrice?: (req: Request) => number | Promise<number>;
    adminIdentityKeys?: string[];
}
```

See also: [Wallet](./client.md#class-wallet)

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
| [EntityBase](#class-entitybase) | [EntityProvenTxReq](#class-entityproventxreq) | [StorageIdb](#class-storageidb) |
| [EntityCertificate](#class-entitycertificate) | [EntitySyncState](#class-entitysyncstate) | [StorageKnex](#class-storageknex) |
| [EntityCertificateField](#class-entitycertificatefield) | [EntityTransaction](#class-entitytransaction) | [StorageProvider](#class-storageprovider) |
| [EntityCommission](#class-entitycommission) | [EntityTxLabel](#class-entitytxlabel) | [StorageReader](#class-storagereader) |
| [EntityOutput](#class-entityoutput) | [EntityTxLabelMap](#class-entitytxlabelmap) | [StorageReaderWriter](#class-storagereaderwriter) |
| [EntityOutputBasket](#class-entityoutputbasket) | [EntityUser](#class-entityuser) | [StorageServer](#class-storageserver) |
| [EntityOutputTag](#class-entityoutputtag) | [KnexMigrations](#class-knexmigrations) | [StorageSyncReader](#class-storagesyncreader) |
| [EntityOutputTagMap](#class-entityoutputtagmap) | [MergeEntity](#class-mergeentity) | [WalletStorageManager](#class-walletstoragemanager) |
| [EntityProvenTx](#class-entityproventx) | [StorageClient](#class-storageclient) |  |

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
##### Class: KnexMigrations

```ts
export class KnexMigrations implements MigrationSource<string> {
    migrations: Record<string, Migration> = {};
    constructor(public chain: sdk.Chain, public storageName: string, public storageIdentityKey: string, public maxOutputScriptLength: number) 
    async getMigrations(): Promise<string[]> 
    getMigrationName(migration: string) 
    async getMigration(migration: string): Promise<Migration> 
    async getLatestMigration(): Promise<string> 
    static async latestMigration(): Promise<string> 
    setupMigrations(chain: string, storageName: string, storageIdentityKey: string, maxOutputScriptLength: number): Record<string, Migration> 
}
```

See also: [Chain](./client.md#type-chain)

###### Constructor

```ts
constructor(public chain: sdk.Chain, public storageName: string, public storageIdentityKey: string, public maxOutputScriptLength: number) 
```
See also: [Chain](./client.md#type-chain)

Argument Details

+ **storageName**
  + human readable name for this storage instance
+ **maxOutputScriptLength**
  + limit for scripts kept in outputs table, longer scripts will be pulled from rawTx

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
##### Class: StorageKnex

```ts
export class StorageKnex extends StorageProvider implements sdk.WalletStorageProvider {
    knex: Knex;
    constructor(options: StorageKnexOptions) 
    async readSettings(): Promise<TableSettings> 
    override async getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx> 
    dbTypeSubstring(source: string, fromOffset: number, forLength?: number) 
    override async getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: sdk.TrxToken): Promise<number[] | undefined> 
    getProvenTxsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]> 
    getProvenTxReqsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> 
    getTxLabelMapsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> 
    getOutputTagMapsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> 
    override async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    override async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    override async insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number> 
    override async insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number> 
    override async insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number> 
    override async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> 
    override async insertCertificate(certificate: TableCertificateX, trx?: sdk.TrxToken): Promise<number> 
    override async insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void> 
    override async insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number> 
    override async insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number> 
    override async insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number> 
    override async insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number> 
    override async insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number> 
    override async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void> 
    override async insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number> 
    override async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void> 
    override async insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number> 
    override async insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number> 
    override async updateCertificateField(certificateId: number, fieldName: string, update: Partial<TableCertificateField>, trx?: sdk.TrxToken): Promise<number> 
    override async updateCertificate(id: number, update: Partial<TableCertificate>, trx?: sdk.TrxToken): Promise<number> 
    override async updateCommission(id: number, update: Partial<TableCommission>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutput(id: number, update: Partial<TableOutput>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutputTagMap(outputId: number, tagId: number, update: Partial<TableOutputTagMap>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: sdk.TrxToken): Promise<number> 
    override async updateProvenTxReq(id: number | number[], update: Partial<TableProvenTxReq>, trx?: sdk.TrxToken): Promise<number> 
    override async updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: sdk.TrxToken): Promise<number> 
    override async updateSyncState(id: number, update: Partial<TableSyncState>, trx?: sdk.TrxToken): Promise<number> 
    override async updateTransaction(id: number | number[], update: Partial<TableTransaction>, trx?: sdk.TrxToken): Promise<number> 
    override async updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<TableTxLabelMap>, trx?: sdk.TrxToken): Promise<number> 
    override async updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: sdk.TrxToken): Promise<number> 
    override async updateUser(id: number, update: Partial<TableUser>, trx?: sdk.TrxToken): Promise<number> 
    override async updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: sdk.TrxToken): Promise<number> 
    setupQuery<T extends object>(table: string, args: sdk.FindPartialSincePagedArgs<T>): Knex.QueryBuilder 
    findCertificateFieldsQuery(args: sdk.FindCertificateFieldsArgs): Knex.QueryBuilder 
    findCertificatesQuery(args: sdk.FindCertificatesArgs): Knex.QueryBuilder 
    findCommissionsQuery(args: sdk.FindCommissionsArgs): Knex.QueryBuilder 
    findOutputBasketsQuery(args: sdk.FindOutputBasketsArgs): Knex.QueryBuilder 
    findOutputsQuery(args: sdk.FindOutputsArgs, count?: boolean): Knex.QueryBuilder 
    findOutputTagMapsQuery(args: sdk.FindOutputTagMapsArgs): Knex.QueryBuilder 
    findOutputTagsQuery(args: sdk.FindOutputTagsArgs): Knex.QueryBuilder 
    findProvenTxReqsQuery(args: sdk.FindProvenTxReqsArgs): Knex.QueryBuilder 
    findProvenTxsQuery(args: sdk.FindProvenTxsArgs): Knex.QueryBuilder 
    findSyncStatesQuery(args: sdk.FindSyncStatesArgs): Knex.QueryBuilder 
    findTransactionsQuery(args: sdk.FindTransactionsArgs, count?: boolean): Knex.QueryBuilder 
    findTxLabelMapsQuery(args: sdk.FindTxLabelMapsArgs): Knex.QueryBuilder 
    findTxLabelsQuery(args: sdk.FindTxLabelsArgs): Knex.QueryBuilder 
    findUsersQuery(args: sdk.FindUsersArgs): Knex.QueryBuilder 
    findMonitorEventsQuery(args: sdk.FindMonitorEventsArgs): Knex.QueryBuilder 
    override async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    override async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    override async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
    override async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]> 
    override async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> 
    override async findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]> 
    override async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> 
    override async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> 
    override async findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> 
    override async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]> 
    override async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> 
    override async findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<TableProvenTx[]> 
    override async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]> 
    override async findTransactions(args: sdk.FindTransactionsArgs): Promise<TableTransaction[]> 
    override async findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> 
    override async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]> 
    override async findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]> 
    override async findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]> 
    async getCount<T extends object>(q: Knex.QueryBuilder<T, T[]>): Promise<number> 
    override async countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number> 
    override async countCertificates(args: sdk.FindCertificatesArgs): Promise<number> 
    override async countCommissions(args: sdk.FindCommissionsArgs): Promise<number> 
    override async countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number> 
    override async countOutputs(args: sdk.FindOutputsArgs): Promise<number> 
    override async countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number> 
    override async countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number> 
    override async countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number> 
    override async countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number> 
    override async countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number> 
    override async countTransactions(args: sdk.FindTransactionsArgs): Promise<number> 
    override async countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number> 
    override async countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number> 
    override async countUsers(args: sdk.FindUsersArgs): Promise<number> 
    override async countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number> 
    override async destroy(): Promise<void> 
    override async migrate(storageName: string, storageIdentityKey: string): Promise<string> 
    override async dropAllData(): Promise<void> 
    override async transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T> 
    toDb(trx?: sdk.TrxToken) 
    async validateRawTransaction(t: TableTransaction, trx?: sdk.TrxToken): Promise<void> 
    _verifiedReadyForDatabaseAccess: boolean = false;
    async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> 
    validatePartialForUpdate<T extends sdk.EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
    async validateEntityForInsert<T extends sdk.EntityTimeStamp>(entity: T, trx?: sdk.TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
    override async getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<TableTxLabel[]> 
    override async getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<TableOutputTag[]> 
    override async purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
    override async reviewStatus(args: {
        agedLimit: Date;
        trx?: sdk.TrxToken;
    }): Promise<{
        log: string;
    }> 
    async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> 
    async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined> {
        const status: sdk.TransactionStatus[] = ["completed", "unproven"];
        if (!excludeSending)
            status.push("sending");
        const statusText = status.map(s => `'${s}'`).join(",");
        const r: TableOutput | undefined = await this.knex.transaction(async (trx) => {
            const txStatusCondition = `AND (SELECT status FROM transactions WHERE outputs.transactionId = transactions.transactionId) in (${statusText})`;
            let outputId: number | undefined;
            const setOutputId = async (rawQuery: string): Promise<void> => {
                let oidr = await trx.raw(rawQuery);
                outputId = undefined;
                if (!oidr["outputId"] && oidr.length > 0)
                    oidr = oidr[0];
                if (!oidr["outputId"] && oidr.length > 0)
                    oidr = oidr[0];
                if (oidr["outputId"])
                    outputId = Number(oidr["outputId"]);
            };
            if (exactSatoshis !== undefined) {
                await setOutputId(`
                SELECT outputId 
                FROM outputs
                WHERE userId = ${userId} 
                    AND spendable = 1 
                    AND basketId = ${basketId}
                    ${txStatusCondition}
                    AND satoshis = ${exactSatoshis}
                LIMIT 1;
                `);
            }
            if (outputId === undefined) {
                await setOutputId(`
                    SELECT outputId 
                    FROM outputs
                    WHERE userId = ${userId} 
                        AND spendable = 1 
                        AND basketId = ${basketId}
                        ${txStatusCondition}
                        AND satoshis - ${targetSatoshis} = (
                            SELECT MIN(satoshis - ${targetSatoshis}) 
                            FROM outputs 
                            WHERE userId = ${userId} 
                            AND spendable = 1 
                            AND basketId = ${basketId}
                            ${txStatusCondition}
                            AND satoshis - ${targetSatoshis} >= 0
                        )
                    LIMIT 1;
                    `);
            }
            if (outputId === undefined) {
                await setOutputId(`
                    SELECT outputId 
                    FROM outputs
                    WHERE userId = ${userId} 
                        AND spendable = 1 
                        AND basketId = ${basketId}
                        ${txStatusCondition}
                        AND satoshis - ${targetSatoshis} = (
                            SELECT MAX(satoshis - ${targetSatoshis}) 
                            FROM outputs 
                            WHERE userId = ${userId} 
                            AND spendable = 1 
                            AND basketId = ${basketId}
                            ${txStatusCondition}
                            AND satoshis - ${targetSatoshis} < 0
                        )
                    LIMIT 1;
                    `);
            }
            if (outputId === undefined)
                return undefined;
            await this.updateOutput(outputId, {
                spendable: false,
                spentBy: transactionId
            }, trx);
            const r = verifyTruthy(await this.findOutputById(outputId, trx));
            return r;
        });
        return r;
    }
    validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T 
    validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] 
    async adminStats(adminIdentityKey: string): Promise<AdminStatsResult> {
        if (this.dbtype !== "MySQL")
            throw new sdk.WERR_NOT_IMPLEMENTED("adminStats, only MySQL is supported");
        const monitorEvent = verifyOneOrNone(await this.findMonitorEvents({
            partial: { event: "MonitorCallHistory" },
            orderDescending: true,
            paged: { limit: 1 }
        }));
        const monitorStats: ServicesCallHistory | undefined = monitorEvent ? JSON.parse(monitorEvent.details!) : undefined;
        const servicesStats = this.getServices().getServicesCallHistory(true);
        await this.insertMonitorEvent({
            event: "ServicesCallHistory",
            details: JSON.stringify(servicesStats),
            created_at: new Date(),
            updated_at: new Date(),
            id: 0
        });
        const one_day_ago = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const one_week_ago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const one_month_ago = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const [[{ usersDay, usersMonth, usersWeek, usersTotal, transactionsDay, transactionsMonth, transactionsWeek, transactionsTotal, txCompletedDay, txCompletedMonth, txCompletedWeek, txCompletedTotal, txFailedDay, txFailedMonth, txFailedWeek, txFailedTotal, txUnprocessedDay, txUnprocessedMonth, txUnprocessedWeek, txUnprocessedTotal, txSendingDay, txSendingMonth, txSendingWeek, txSendingTotal, txUnprovenDay, txUnprovenMonth, txUnprovenWeek, txUnprovenTotal, txUnsignedDay, txUnsignedMonth, txUnsignedWeek, txUnsignedTotal, txNosendDay, txNosendMonth, txNosendWeek, txNosendTotal, txNonfinalDay, txNonfinalMonth, txNonfinalWeek, txNonfinalTotal, txUnfailDay, txUnfailMonth, txUnfailWeek, txUnfailTotal, satoshisDefaultDay, satoshisDefaultMonth, satoshisDefaultWeek, satoshisDefaultTotal, satoshisOtherDay, satoshisOtherMonth, satoshisOtherWeek, satoshisOtherTotal, basketsDay, basketsMonth, basketsWeek, basketsTotal, labelsDay, labelsMonth, labelsWeek, labelsTotal, tagsDay, tagsMonth, tagsWeek, tagsTotal }]] = await this.knex.raw(`
select
    (select count(*) from users where created_at > '${one_day_ago}') as usersDay,
    (select count(*) from users where created_at > '${one_week_ago}') as usersWeek,
    (select count(*) from users where created_at > '${one_month_ago}') as usersMonth,
	  (select count(*) from users) as usersTotal,
    (select count(*) from transactions where created_at > '${one_day_ago}') as transactionsDay,
    (select count(*) from transactions where created_at > '${one_week_ago}') as transactionsWeek,
    (select count(*) from transactions where created_at > '${one_month_ago}') as transactionsMonth,
	  (select count(*) from transactions) as transactionsTotal,
    (select count(*) from transactions where status = 'completed' and created_at > '${one_day_ago}') as txCompletedDay,
    (select count(*) from transactions where status = 'completed' and created_at > '${one_week_ago}') as txCompletedWeek,
    (select count(*) from transactions where status = 'completed' and created_at > '${one_month_ago}') as txCompletedMonth,
	  (select count(*) from transactions where status = 'completed') as txCompletedTotal,
    (select count(*) from transactions where status = 'failed' and created_at > '${one_day_ago}') as txFailedDay,
    (select count(*) from transactions where status = 'failed' and created_at > '${one_week_ago}') as txFailedWeek,
    (select count(*) from transactions where status = 'failed' and created_at > '${one_month_ago}') as txFailedMonth,
	  (select count(*) from transactions where status = 'failed') as txFailedTotal,
    (select count(*) from transactions where status = 'unprocessed' and created_at > '${one_day_ago}') as txUnprocessedDay,
    (select count(*) from transactions where status = 'unprocessed' and created_at > '${one_week_ago}') as txUnprocessedWeek,
    (select count(*) from transactions where status = 'unprocessed' and created_at > '${one_month_ago}') as txUnprocessedMonth,
	  (select count(*) from transactions where status = 'unprocessed') as txUnprocessedTotal,
    (select count(*) from transactions where status = 'sending' and created_at > '${one_day_ago}') as txSendingDay,
    (select count(*) from transactions where status = 'sending' and created_at > '${one_week_ago}') as txSendingWeek,
    (select count(*) from transactions where status = 'sending' and created_at > '${one_month_ago}') as txSendingMonth,
	  (select count(*) from transactions where status = 'sending') as txSendingTotal,
    (select count(*) from transactions where status = 'unproven' and created_at > '${one_day_ago}') as txUnprovenDay,
    (select count(*) from transactions where status = 'unproven' and created_at > '${one_week_ago}') as txUnprovenWeek,
    (select count(*) from transactions where status = 'unproven' and created_at > '${one_month_ago}') as txUnprovenMonth,
	  (select count(*) from transactions where status = 'unproven') as txUnprovenTotal,
    (select count(*) from transactions where status = 'unsigned' and created_at > '${one_day_ago}') as txUnsignedDay,
    (select count(*) from transactions where status = 'unsigned' and created_at > '${one_week_ago}') as txUnsignedWeek,
    (select count(*) from transactions where status = 'unsigned' and created_at > '${one_month_ago}') as txUnsignedMonth,
	  (select count(*) from transactions where status = 'unsigned') as txUnsignedTotal,
    (select count(*) from transactions where status = 'nosend' and created_at > '${one_day_ago}') as txNosendDay,
    (select count(*) from transactions where status = 'nosend' and created_at > '${one_week_ago}') as txNosendWeek,
    (select count(*) from transactions where status = 'nosend' and created_at > '${one_month_ago}') as txNosendMonth,
	  (select count(*) from transactions where status = 'nosend') as txNosendTotal,
    (select count(*) from transactions where status = 'nonfinal' and created_at > '${one_day_ago}') as txNonfinalDay,
    (select count(*) from transactions where status = 'nonfinal' and created_at > '${one_week_ago}') as txNonfinalWeek,
    (select count(*) from transactions where status = 'nonfinal' and created_at > '${one_month_ago}') as txNonfinalMonth,
	  (select count(*) from transactions where status = 'nonfinal') as txNonfinalTotal,
    (select count(*) from transactions where status = 'unfail' and created_at > '${one_day_ago}') as txUnfailDay,
    (select count(*) from transactions where status = 'unfail' and created_at > '${one_week_ago}') as txUnfailWeek,
    (select count(*) from transactions where status = 'unfail' and created_at > '${one_month_ago}') as txUnfailMonth,
	  (select count(*) from transactions where status = 'unfail') as txUnfailTotal,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1 and created_at > '${one_day_ago}') as satoshisDefaultDay,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1 and created_at > '${one_week_ago}') as satoshisDefaultWeek,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1 and created_at > '${one_month_ago}') as satoshisDefaultMonth,
	  (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1) as satoshisDefaultTotal,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null and created_at > '${one_day_ago}') as satoshisOtherDay,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null and created_at > '${one_week_ago}') as satoshisOtherWeek,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null and created_at > '${one_month_ago}') as satoshisOtherMonth,
	  (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null) as satoshisOtherTotal,
    (select count(*) from output_baskets where created_at > '${one_day_ago}') as basketsDay,
    (select count(*) from output_baskets where created_at > '${one_week_ago}') as basketsWeek,
    (select count(*) from output_baskets where created_at > '${one_month_ago}') as basketsMonth,
	  (select count(*) from output_baskets) as basketsTotal,
    (select count(*) from tx_labels where created_at > '${one_day_ago}') as labelsDay,
    (select count(*) from tx_labels where created_at > '${one_week_ago}') as labelsWeek,
    (select count(*) from tx_labels where created_at > '${one_month_ago}') as labelsMonth,
	  (select count(*) from tx_labels) as labelsTotal,
    (select count(*) from output_tags where created_at > '${one_day_ago}') as tagsDay,
    (select count(*) from output_tags where created_at > '${one_week_ago}') as tagsWeek,
    (select count(*) from output_tags where created_at > '${one_month_ago}') as tagsMonth,
	  (select count(*) from output_tags) as tagsTotal
      `);
        const r: AdminStatsResult = {
            monitorStats,
            servicesStats,
            requestedBy: adminIdentityKey,
            when: new Date().toISOString(),
            usersDay,
            usersWeek,
            usersMonth,
            usersTotal,
            transactionsDay,
            transactionsWeek,
            transactionsMonth,
            transactionsTotal,
            txCompletedDay,
            txCompletedWeek,
            txCompletedMonth,
            txCompletedTotal,
            txFailedDay,
            txFailedWeek,
            txFailedMonth,
            txFailedTotal,
            txUnprocessedDay,
            txUnprocessedWeek,
            txUnprocessedMonth,
            txUnprocessedTotal,
            txSendingDay,
            txSendingWeek,
            txSendingMonth,
            txSendingTotal,
            txUnprovenDay,
            txUnprovenWeek,
            txUnprovenMonth,
            txUnprovenTotal,
            txUnsignedDay,
            txUnsignedWeek,
            txUnsignedMonth,
            txUnsignedTotal,
            txNosendDay,
            txNosendWeek,
            txNosendMonth,
            txNosendTotal,
            txNonfinalDay,
            txNonfinalWeek,
            txNonfinalMonth,
            txNonfinalTotal,
            txUnfailDay,
            txUnfailWeek,
            txUnfailMonth,
            txUnfailTotal,
            satoshisDefaultDay: Number(satoshisDefaultDay),
            satoshisDefaultWeek: Number(satoshisDefaultWeek),
            satoshisDefaultMonth: Number(satoshisDefaultMonth),
            satoshisDefaultTotal: Number(satoshisDefaultTotal),
            satoshisOtherDay: Number(satoshisOtherDay),
            satoshisOtherWeek: Number(satoshisOtherWeek),
            satoshisOtherMonth: Number(satoshisOtherMonth),
            satoshisOtherTotal: Number(satoshisOtherTotal),
            basketsDay,
            basketsWeek,
            basketsMonth,
            basketsTotal,
            labelsDay,
            labelsWeek,
            labelsMonth,
            labelsTotal,
            tagsDay,
            tagsWeek,
            tagsMonth,
            tagsTotal
        };
        return r;
    }
}
```

See also: [AdminStatsResult](./storage.md#interface-adminstatsresult), [AuthId](./client.md#interface-authid), [DBType](./storage.md#type-dbtype), [EntityTimeStamp](./client.md#interface-entitytimestamp), [FindCertificateFieldsArgs](./client.md#interface-findcertificatefieldsargs), [FindCertificatesArgs](./client.md#interface-findcertificatesargs), [FindCommissionsArgs](./client.md#interface-findcommissionsargs), [FindForUserSincePagedArgs](./client.md#interface-findforusersincepagedargs), [FindMonitorEventsArgs](./client.md#interface-findmonitoreventsargs), [FindOutputBasketsArgs](./client.md#interface-findoutputbasketsargs), [FindOutputTagMapsArgs](./client.md#interface-findoutputtagmapsargs), [FindOutputTagsArgs](./client.md#interface-findoutputtagsargs), [FindOutputsArgs](./client.md#interface-findoutputsargs), [FindPartialSincePagedArgs](./client.md#interface-findpartialsincepagedargs), [FindProvenTxReqsArgs](./client.md#interface-findproventxreqsargs), [FindProvenTxsArgs](./client.md#interface-findproventxsargs), [FindSyncStatesArgs](./client.md#interface-findsyncstatesargs), [FindTransactionsArgs](./client.md#interface-findtransactionsargs), [FindTxLabelMapsArgs](./client.md#interface-findtxlabelmapsargs), [FindTxLabelsArgs](./client.md#interface-findtxlabelsargs), [FindUsersArgs](./client.md#interface-findusersargs), [ProvenOrRawTx](./client.md#interface-provenorrawtx), [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [ServicesCallHistory](./client.md#type-servicescallhistory), [StorageKnexOptions](./storage.md#interface-storageknexoptions), [StorageProvider](./storage.md#class-storageprovider), [TableCertificate](./storage.md#interface-tablecertificate), [TableCertificateField](./storage.md#interface-tablecertificatefield), [TableCertificateX](./storage.md#interface-tablecertificatex), [TableCommission](./storage.md#interface-tablecommission), [TableMonitorEvent](./storage.md#interface-tablemonitorevent), [TableOutput](./storage.md#interface-tableoutput), [TableOutputBasket](./storage.md#interface-tableoutputbasket), [TableOutputTag](./storage.md#interface-tableoutputtag), [TableOutputTagMap](./storage.md#interface-tableoutputtagmap), [TableProvenTx](./storage.md#interface-tableproventx), [TableProvenTxReq](./storage.md#interface-tableproventxreq), [TableSettings](./storage.md#interface-tablesettings), [TableSyncState](./storage.md#interface-tablesyncstate), [TableTransaction](./storage.md#interface-tabletransaction), [TableTxLabel](./storage.md#interface-tabletxlabel), [TableTxLabelMap](./storage.md#interface-tabletxlabelmap), [TableUser](./storage.md#interface-tableuser), [TransactionStatus](./client.md#type-transactionstatus), [TrxToken](./client.md#interface-trxtoken), [ValidListActionsArgs](./client.md#interface-validlistactionsargs), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs), [WERR_NOT_IMPLEMENTED](./client.md#class-werr_not_implemented), [WalletStorageProvider](./client.md#interface-walletstorageprovider), [listActions](./storage.md#function-listactions), [listOutputs](./storage.md#function-listoutputs), [purgeData](./storage.md#function-purgedata), [reviewStatus](./storage.md#function-reviewstatus), [verifyOneOrNone](./client.md#function-verifyoneornone), [verifyTruthy](./client.md#function-verifytruthy)

###### Method allocateChangeInput

Finds closest matching available change output to use as input for new transaction.

Transactionally allocate the output such that

```ts
async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<TableOutput | undefined> 
```
See also: [TableOutput](./storage.md#interface-tableoutput)

###### Method countChangeInputs

Counts the outputs for userId in basketId that are spendable: true
AND whose transaction status is one of:
- completed
- unproven
- sending (if excludeSending is false)

```ts
async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> 
```

###### Method toDb

Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
or a Knex.Transaction as appropriate.

```ts
toDb(trx?: sdk.TrxToken) 
```
See also: [TrxToken](./client.md#interface-trxtoken)

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
Use to process all individual records with time stamps retreived from database.

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

###### Method verifyReadyForDatabaseAccess

Make sure database is ready for access:

- dateScheme is known
- foreign key constraints are enabled

```ts
async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> 
```
See also: [DBType](./storage.md#type-dbtype), [TrxToken](./client.md#interface-trxtoken)

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
##### Class: StorageServer

```ts
export class StorageServer {
    constructor(storage: StorageProvider, options: WalletStorageServerOptions) 
    public start(): void 
    validateDate(date: Date | string | number): Date 
    validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[]): T 
    validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[]): T[] 
}
```

See also: [EntityTimeStamp](./client.md#interface-entitytimestamp), [StorageProvider](./storage.md#class-storageprovider), [WalletStorageServerOptions](./storage.md#interface-walletstorageserveroptions)

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
#### Functions

| | | |
| --- | --- | --- |
| [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork) | [listActionsIdb](#function-listactionsidb) | [setDisableDoubleSpendCheckForTest](#function-setdisabledoublespendcheckfortest) |
| [createAction](#function-createaction) | [listCertificates](#function-listcertificates) | [shareReqsWithWorld](#function-sharereqswithworld) |
| [createStorageServiceChargeScript](#function-createstorageservicechargescript) | [listOutputs](#function-listoutputs) | [transactionInputSize](#function-transactioninputsize) |
| [createSyncMap](#function-createsyncmap) | [listOutputsIdb](#function-listoutputsidb) | [transactionOutputSize](#function-transactionoutputsize) |
| [determineDBType](#function-determinedbtype) | [lockScriptWithKeyOffsetFromPubKey](#function-lockscriptwithkeyoffsetfrompubkey) | [transactionSize](#function-transactionsize) |
| [generateChangeSdk](#function-generatechangesdk) | [offsetPubKey](#function-offsetpubkey) | [validateGenerateChangeSdkParams](#function-validategeneratechangesdkparams) |
| [generateChangeSdkMakeStorage](#function-generatechangesdkmakestorage) | [processAction](#function-processaction) | [validateGenerateChangeSdkResult](#function-validategeneratechangesdkresult) |
| [getBeefForTransaction](#function-getbeeffortransaction) | [purgeData](#function-purgedata) | [validateStorageFeeModel](#function-validatestoragefeemodel) |
| [getSyncChunk](#function-getsyncchunk) | [purgeDataIdb](#function-purgedataidb) | [varUintSize](#function-varuintsize) |
| [internalizeAction](#function-internalizeaction) | [reviewStatus](#function-reviewstatus) |  |
| [listActions](#function-listactions) | [reviewStatusIdb](#function-reviewstatusidb) |  |

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
##### Function: createAction

```ts
export async function createAction(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidCreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<sdk.StorageCreateActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageCreateActionResult](./client.md#interface-storagecreateactionresult), [StorageProvider](./storage.md#class-storageprovider), [ValidCreateActionArgs](./client.md#interface-validcreateactionargs)

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
##### Function: determineDBType

```ts
export async function determineDBType(knex: Knex<any, any[]>): Promise<DBType> 
```

See also: [DBType](./storage.md#type-dbtype)

Returns

connected database engine variant

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
2. Targetting a previously "custom" non-change output converts it into a change output. This alters the transaction's `satoshis`, and the wallet balance.

```ts
export async function internalizeAction(storage: StorageProvider, auth: sdk.AuthId, args: InternalizeActionArgs): Promise<sdk.StorageInternalizeActionResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageInternalizeActionResult](./client.md#interface-storageinternalizeactionresult), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: listActions

```ts
export async function listActions(storage: StorageKnex, auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageKnex](./storage.md#class-storageknex), [ValidListActionsArgs](./client.md#interface-validlistactionsargs)

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
##### Function: listOutputs

```ts
export async function listOutputs(dsk: StorageKnex, auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
```

See also: [AuthId](./client.md#interface-authid), [StorageKnex](./storage.md#class-storageknex), [ValidListOutputsArgs](./client.md#interface-validlistoutputsargs)

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
##### Function: offsetPubKey

```ts
export function offsetPubKey(pubKey: string, keyOffset?: string): {
    offsetPubKey: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: processAction

```ts
export async function processAction(storage: StorageProvider, auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
```

See also: [AuthId](./client.md#interface-authid), [StorageProcessActionArgs](./client.md#interface-storageprocessactionargs), [StorageProcessActionResults](./client.md#interface-storageprocessactionresults), [StorageProvider](./storage.md#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: purgeData

```ts
export async function purgeData(storage: StorageKnex, params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
```

See also: [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [StorageKnex](./storage.md#class-storageknex), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: purgeDataIdb

```ts
export async function purgeDataIdb(storage: StorageIdb, params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
```

See also: [PurgeParams](./client.md#interface-purgeparams), [PurgeResults](./client.md#interface-purgeresults), [StorageIdb](./storage.md#class-storageidb), [TrxToken](./client.md#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Function: reviewStatus

Looks for unpropagated state:

1. set transactions to 'failed' if not already failed and provenTxReq with matching txid has status of 'invalid'.
2. sets outputs to spendable true, spentBy undefined if spentBy is a transaction with status 'failed'.
3. sets transactions to 'completed' if provenTx with matching txid exists and current provenTxId is null.

```ts
export async function reviewStatus(storage: StorageKnex, args: {
    agedLimit: Date;
    trx?: sdk.TrxToken;
}): Promise<{
    log: string;
}> 
```

See also: [StorageKnex](./storage.md#class-storageknex), [TrxToken](./client.md#interface-trxtoken)

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
##### Function: validateStorageFeeModel

```ts
export function validateStorageFeeModel(v?: sdk.StorageFeeModel): sdk.StorageFeeModel 
```

See also: [StorageFeeModel](./client.md#interface-storagefeemodel)

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
#### Types

| |
| --- |
| [DBType](#type-dbtype) |
| [EntityStorage](#type-entitystorage) |
| [PostReqsToNetworkDetailsStatus](#type-postreqstonetworkdetailsstatus) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Type: DBType

```ts
export type DBType = "SQLite" | "MySQL" | "IndexedDB"
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
#### Variables

| |
| --- |
| [getBasketToSpecOp](#variable-getbaskettospecop) |
| [getLabelToSpecOp](#variable-getlabeltospecop) |
| [maxPossibleSatoshis](#variable-maxpossiblesatoshis) |
| [outputColumnsWithoutLockingScript](#variable-outputcolumnswithoutlockingscript) |
| [transactionColumnsWithoutRawTx](#variable-transactioncolumnswithoutrawtx) |

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

<!--#endregion ts2md-api-merged-here-->