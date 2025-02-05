# API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

## Interfaces

| | |
| --- | --- |
| [CommitNewTxResults](#interface-commitnewtxresults) | [PostBeefResultForTxidApi](#interface-postbeefresultfortxidapi) |
| [GenerateChangeSdkChangeInput](#interface-generatechangesdkchangeinput) | [PostReqsToNetworkDetails](#interface-postreqstonetworkdetails) |
| [GenerateChangeSdkChangeOutput](#interface-generatechangesdkchangeoutput) | [PostReqsToNetworkResult](#interface-postreqstonetworkresult) |
| [GenerateChangeSdkInput](#interface-generatechangesdkinput) | [StorageInternalizeActionResult](#interface-storageinternalizeactionresult) |
| [GenerateChangeSdkOutput](#interface-generatechangesdkoutput) | [StorageKnexOptions](#interface-storageknexoptions) |
| [GenerateChangeSdkParams](#interface-generatechangesdkparams) | [StorageProviderOptions](#interface-storageprovideroptions) |
| [GenerateChangeSdkResult](#interface-generatechangesdkresult) | [StorageReaderOptions](#interface-storagereaderoptions) |
| [GenerateChangeSdkStorageChange](#interface-generatechangesdkstoragechange) | [StorageReaderWriterOptions](#interface-storagereaderwriteroptions) |
| [GetReqsAndBeefDetail](#interface-getreqsandbeefdetail) | [WalletStorageServerOptions](#interface-walletstorageserveroptions) |
| [GetReqsAndBeefResult](#interface-getreqsandbeefresult) | [XValidCreateActionOutput](#interface-xvalidcreateactionoutput) |

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
### Interface: StorageKnexOptions

```ts
export interface StorageKnexOptions extends StorageProviderOptions {
    knex: Knex;
}
```

See also: [StorageProviderOptions](#interface-storageprovideroptions)

<details>

<summary>Interface StorageKnexOptions Details</summary>

#### Property knex

Knex database interface initialized with valid connection configuration.

```ts
knex: Knex
```

</details>

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
### Interface: WalletStorageServerOptions

```ts
export interface WalletStorageServerOptions {
    port: number;
    wallet: Wallet;
    monetize: boolean;
    calculateRequestPrice?: (req: Request) => number | Promise<number>;
}
```

See also: [Wallet](#class-wallet)

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

| |
| --- |
| [KnexMigrations](#class-knexmigrations) |
| [StorageClient](#class-storageclient) |
| [StorageKnex](#class-storageknex) |
| [StorageProvider](#class-storageprovider) |
| [StorageReader](#class-storagereader) |
| [StorageReaderWriter](#class-storagereaderwriter) |
| [StorageServer](#class-storageserver) |
| [StorageSyncReader](#class-storagesyncreader) |
| [WalletStorageManager](#class-walletstoragemanager) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Class: KnexMigrations

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
    static async dbtype(knex: Knex<any, any[]>): Promise<DBType> {
        try {
            const q = `SELECT 
    CASE 
        WHEN (SELECT VERSION() LIKE '%MariaDB%') = 1 THEN 'Unknown'
        WHEN (SELECT VERSION()) IS NOT NULL THEN 'MySQL'
        ELSE 'Unknown'
    END AS database_type;`;
            let r = await knex.raw(q);
            if (!r[0]["database_type"])
                r = r[0];
            if (r["rows"])
                r = r.rows;
            const dbtype: "SQLite" | "MySQL" | "Unknown" = r[0].database_type;
            if (dbtype === "Unknown")
                throw new sdk.WERR_NOT_IMPLEMENTED(`Attempting to create database on unsuported engine.`);
            return dbtype;
        }
        catch (eu: unknown) {
            const e = sdk.WalletError.fromUnknown(eu);
            if (e.code === "SQLITE_ERROR")
                return "SQLite";
            throw new sdk.WERR_NOT_IMPLEMENTED(`Attempting to create database on unsuported engine.`);
        }
    }
}
```

See also: [Chain](#type-chain), [DBType](#type-dbtype), [WERR_NOT_IMPLEMENTED](#class-werr_not_implemented), [WalletError](#class-walleterror)

<details>

<summary>Class KnexMigrations Details</summary>

#### Constructor

```ts
constructor(public chain: sdk.Chain, public storageName: string, public storageIdentityKey: string, public maxOutputScriptLength: number) 
```
See also: [Chain](#type-chain)

Argument Details

+ **storageName**
  + human readable name for this storage instance
+ **maxOutputScriptLength**
  + limit for scripts kept in outputs table, longer scripts will be pulled from rawTx

#### Method dbtype

```ts
static async dbtype(knex: Knex<any, any[]>): Promise<DBType> 
```
See also: [DBType](#type-dbtype)

Returns

connected database engine variant

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

See also: [AuthId](#interface-authid), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [SyncChunk](#interface-syncchunk), [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [WalletStorageProvider](#interface-walletstorageprovider), [createAction](#function-createaction), [getSyncChunk](#function-getsyncchunk), [internalizeAction](#function-internalizeaction), [listActions](#function-listactions), [listCertificates](#function-listcertificates), [listOutputs](#function-listoutputs), [processAction](#function-processaction)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Class: StorageKnex

```ts
export class StorageKnex extends StorageProvider implements sdk.WalletStorageProvider {
    knex: Knex;
    constructor(options: StorageKnexOptions) 
    async readSettings(): Promise<table.Settings> 
    override async getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx> 
    dbTypeSubstring(source: string, fromOffset: number, forLength?: number) 
    override async getRawTxOfKnownValidTransaction(txid?: string, offset?: number, length?: number, trx?: sdk.TrxToken): Promise<number[] | undefined> 
    getProvenTxsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTx[]> 
    getProvenTxReqsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.ProvenTxReq[]> 
    getTxLabelMapsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.TxLabelMap[]> 
    getOutputTagMapsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder 
    override async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<table.OutputTagMap[]> 
    override async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
    override async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> 
    override async insertProvenTx(tx: table.ProvenTx, trx?: sdk.TrxToken): Promise<number> 
    override async insertProvenTxReq(tx: table.ProvenTxReq, trx?: sdk.TrxToken): Promise<number> 
    override async insertUser(user: table.User, trx?: sdk.TrxToken): Promise<number> 
    override async insertCertificateAuth(auth: sdk.AuthId, certificate: table.CertificateX): Promise<number> 
    override async insertCertificate(certificate: table.CertificateX, trx?: sdk.TrxToken): Promise<number> 
    override async insertCertificateField(certificateField: table.CertificateField, trx?: sdk.TrxToken): Promise<void> 
    override async insertOutputBasket(basket: table.OutputBasket, trx?: sdk.TrxToken): Promise<number> 
    override async insertTransaction(tx: table.Transaction, trx?: sdk.TrxToken): Promise<number> 
    override async insertCommission(commission: table.Commission, trx?: sdk.TrxToken): Promise<number> 
    override async insertOutput(output: table.Output, trx?: sdk.TrxToken): Promise<number> 
    override async insertOutputTag(tag: table.OutputTag, trx?: sdk.TrxToken): Promise<number> 
    override async insertOutputTagMap(tagMap: table.OutputTagMap, trx?: sdk.TrxToken): Promise<void> 
    override async insertTxLabel(label: table.TxLabel, trx?: sdk.TrxToken): Promise<number> 
    override async insertTxLabelMap(labelMap: table.TxLabelMap, trx?: sdk.TrxToken): Promise<void> 
    override async insertMonitorEvent(event: table.MonitorEvent, trx?: sdk.TrxToken): Promise<number> 
    override async insertSyncState(syncState: table.SyncState, trx?: sdk.TrxToken): Promise<number> 
    override async updateCertificateField(certificateId: number, fieldName: string, update: Partial<table.CertificateField>, trx?: sdk.TrxToken): Promise<number> 
    override async updateCertificate(id: number, update: Partial<table.Certificate>, trx?: sdk.TrxToken): Promise<number> 
    override async updateCommission(id: number, update: Partial<table.Commission>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutputBasket(id: number, update: Partial<table.OutputBasket>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutput(id: number, update: Partial<table.Output>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutputTagMap(outputId: number, tagId: number, update: Partial<table.OutputTagMap>, trx?: sdk.TrxToken): Promise<number> 
    override async updateOutputTag(id: number, update: Partial<table.OutputTag>, trx?: sdk.TrxToken): Promise<number> 
    override async updateProvenTxReq(id: number | number[], update: Partial<table.ProvenTxReq>, trx?: sdk.TrxToken): Promise<number> 
    override async updateProvenTx(id: number, update: Partial<table.ProvenTx>, trx?: sdk.TrxToken): Promise<number> 
    override async updateSyncState(id: number, update: Partial<table.SyncState>, trx?: sdk.TrxToken): Promise<number> 
    override async updateTransaction(id: number | number[], update: Partial<table.Transaction>, trx?: sdk.TrxToken): Promise<number> 
    override async updateTxLabelMap(transactionId: number, txLabelId: number, update: Partial<table.TxLabelMap>, trx?: sdk.TrxToken): Promise<number> 
    override async updateTxLabel(id: number, update: Partial<table.TxLabel>, trx?: sdk.TrxToken): Promise<number> 
    override async updateUser(id: number, update: Partial<table.User>, trx?: sdk.TrxToken): Promise<number> 
    override async updateMonitorEvent(id: number, update: Partial<table.MonitorEvent>, trx?: sdk.TrxToken): Promise<number> 
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
    override async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<table.Certificate[]> 
    override async findOutputBasketsAuth(auth: sdk.AuthId, args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]> 
    override async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<table.Output[]> 
    override async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<table.CertificateField[]> 
    override async findCertificates(args: sdk.FindCertificatesArgs): Promise<table.Certificate[]> 
    override async findCommissions(args: sdk.FindCommissionsArgs): Promise<table.Commission[]> 
    override async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<table.OutputBasket[]> 
    override async findOutputs(args: sdk.FindOutputsArgs): Promise<table.Output[]> 
    override async findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<table.OutputTagMap[]> 
    override async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<table.OutputTag[]> 
    override async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<table.ProvenTxReq[]> 
    override async findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<table.ProvenTx[]> 
    override async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<table.SyncState[]> 
    override async findTransactions(args: sdk.FindTransactionsArgs): Promise<table.Transaction[]> 
    override async findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<table.TxLabelMap[]> 
    override async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<table.TxLabel[]> 
    override async findUsers(args: sdk.FindUsersArgs): Promise<table.User[]> 
    override async findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<table.MonitorEvent[]> 
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
    async validateRawTransaction(t: table.Transaction, trx?: sdk.TrxToken): Promise<void> 
    async validateOutputScript(o: table.Output, trx?: sdk.TrxToken): Promise<void> 
    _verifiedReadyForDatabaseAccess: boolean = false;
    async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> 
    validatePartialForUpdate<T extends sdk.EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
    async validateEntityForInsert<T extends sdk.EntityTimeStamp>(entity: T, trx?: sdk.TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
    override async getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<table.TxLabel[]> 
    async extendOutput(o: table.Output, includeBasket = false, includeTags = false, trx?: sdk.TrxToken): Promise<table.OutputX> 
    override async getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<table.OutputTag[]> 
    override async purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
    override async reviewStatus(args: {
        agedLimit: Date;
        trx?: sdk.TrxToken;
    }): Promise<{
        log: string;
    }> 
    async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> 
    async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<table.Output | undefined> {
        const status: sdk.TransactionStatus[] = ["completed", "unproven"];
        if (!excludeSending)
            status.push("sending");
        const statusText = status.map(s => `'${s}'`).join(",");
        const r: table.Output | undefined = await this.knex.transaction(async (trx) => {
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
}
```

See also: [AuthId](#interface-authid), [DBType](#type-dbtype), [EntityTimeStamp](#interface-entitytimestamp), [FindCertificateFieldsArgs](#interface-findcertificatefieldsargs), [FindCertificatesArgs](#interface-findcertificatesargs), [FindCommissionsArgs](#interface-findcommissionsargs), [FindForUserSincePagedArgs](#interface-findforusersincepagedargs), [FindMonitorEventsArgs](#interface-findmonitoreventsargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputTagMapsArgs](#interface-findoutputtagmapsargs), [FindOutputTagsArgs](#interface-findoutputtagsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindPartialSincePagedArgs](#interface-findpartialsincepagedargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [FindProvenTxsArgs](#interface-findproventxsargs), [FindSyncStatesArgs](#interface-findsyncstatesargs), [FindTransactionsArgs](#interface-findtransactionsargs), [FindTxLabelMapsArgs](#interface-findtxlabelmapsargs), [FindTxLabelsArgs](#interface-findtxlabelsargs), [FindUsersArgs](#interface-findusersargs), [ProvenOrRawTx](#interface-provenorrawtx), [PurgeParams](#interface-purgeparams), [PurgeResults](#interface-purgeresults), [StorageKnexOptions](#interface-storageknexoptions), [StorageProvider](#class-storageprovider), [TransactionStatus](#type-transactionstatus), [TrxToken](#interface-trxtoken), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletStorageProvider](#interface-walletstorageprovider), [listActions](#function-listactions), [listOutputs](#function-listoutputs), [purgeData](#function-purgedata), [reviewStatus](#function-reviewstatus), [verifyTruthy](#function-verifytruthy)

<details>

<summary>Class StorageKnex Details</summary>

#### Method allocateChangeInput

Finds closest matching available change output to use as input for new transaction.

Transactionally allocate the output such that

```ts
async allocateChangeInput(userId: number, basketId: number, targetSatoshis: number, exactSatoshis: number | undefined, excludeSending: boolean, transactionId: number): Promise<table.Output | undefined> 
```

#### Method countChangeInputs

Finds closest matching available change output to use as input for new transaction.

Transactionally allocate the output such that

```ts
async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> 
```

#### Method toDb

Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
or a Knex.Transaction as appropriate.

```ts
toDb(trx?: sdk.TrxToken) 
```
See also: [TrxToken](#interface-trxtoken)

#### Method validateEntities

Helper to force uniform behavior across database engines.
Use to process all arrays of records with time stamps retreived from database.

```ts
validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] 
```
See also: [EntityTimeStamp](#interface-entitytimestamp)

Returns

input `entities` array with contained values validated.

#### Method validateEntity

Helper to force uniform behavior across database engines.
Use to process all individual records with time stamps retreived from database.

```ts
validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T 
```
See also: [EntityTimeStamp](#interface-entitytimestamp)

#### Method validateEntityForInsert

Helper to force uniform behavior across database engines.
Use to process new entities being inserted into the database.

```ts
async validateEntityForInsert<T extends sdk.EntityTimeStamp>(entity: T, trx?: sdk.TrxToken, dateFields?: string[], booleanFields?: string[]): Promise<any> 
```
See also: [EntityTimeStamp](#interface-entitytimestamp), [TrxToken](#interface-trxtoken)

#### Method validatePartialForUpdate

Helper to force uniform behavior across database engines.
Use to process the update template for entities being updated.

```ts
validatePartialForUpdate<T extends sdk.EntityTimeStamp>(update: Partial<T>, dateFields?: string[], booleanFields?: string[]): Partial<T> 
```
See also: [EntityTimeStamp](#interface-entitytimestamp)

#### Method verifyReadyForDatabaseAccess

Make sure database is ready for access:

- dateScheme is known
- foreign key constraints are enabled

```ts
async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> 
```
See also: [DBType](#type-dbtype), [TrxToken](#interface-trxtoken)

</details>

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

See also: [AuthId](#interface-authid), [Chain](#type-chain), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [GetReqsAndBeefResult](#interface-getreqsandbeefresult), [PostReqsToNetworkResult](#interface-postreqstonetworkresult), [ProcessSyncChunkResult](#interface-processsyncchunkresult), [ProvenOrRawTx](#interface-provenorrawtx), [PurgeParams](#interface-purgeparams), [PurgeResults](#interface-purgeresults), [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageFeeModel](#interface-storagefeemodel), [StorageGetBeefOptions](#interface-storagegetbeefoptions), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [StorageProvenOrReq](#interface-storageprovenorreq), [StorageProviderOptions](#interface-storageprovideroptions), [StorageReaderWriter](#class-storagereaderwriter), [SyncChunk](#interface-syncchunk), [TransactionStatus](#type-transactionstatus), [TrxToken](#interface-trxtoken), [UpdateProvenTxReqWithNewProvenTxArgs](#interface-updateproventxreqwithnewproventxargs), [UpdateProvenTxReqWithNewProvenTxResult](#interface-updateproventxreqwithnewproventxresult), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [WalletStorageProvider](#interface-walletstorageprovider), [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork), [createAction](#function-createaction), [getBeefForTransaction](#function-getbeeffortransaction), [internalizeAction](#function-internalizeaction), [listActions](#function-listactions), [listCertificates](#function-listcertificates), [listOutputs](#function-listoutputs), [processAction](#function-processaction), [purgeData](#function-purgedata), [reviewStatus](#function-reviewstatus)

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
### Class: StorageServer

```ts
export class StorageServer {
    constructor(storage: StorageProvider, options: WalletStorageServerOptions) 
    public start(): void 
}
```

See also: [StorageProvider](#class-storageprovider), [WalletStorageServerOptions](#interface-walletstorageserveroptions)

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

See also: [AuthId](#interface-authid), [FindCertificatesArgs](#interface-findcertificatesargs), [FindOutputBasketsArgs](#interface-findoutputbasketsargs), [FindOutputsArgs](#interface-findoutputsargs), [FindProvenTxReqsArgs](#interface-findproventxreqsargs), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [StorageProvider](#class-storageprovider), [StorageSyncReader](#class-storagesyncreader), [ValidCreateActionArgs](#interface-validcreateactionargs), [ValidListActionsArgs](#interface-validlistactionsargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs), [ValidListOutputsArgs](#interface-validlistoutputsargs), [WalletServices](#interface-walletservices), [WalletStorage](#interface-walletstorage), [WalletStorageProvider](#interface-walletstorageprovider), [WalletStorageReader](#interface-walletstoragereader), [WalletStorageSync](#interface-walletstoragesync), [WalletStorageWriter](#interface-walletstoragewriter), [createAction](#function-createaction), [internalizeAction](#function-internalizeaction), [listActions](#function-listactions), [listCertificates](#function-listcertificates), [listOutputs](#function-listoutputs), [processAction](#function-processaction)

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

| | |
| --- | --- |
| [attemptToPostReqsToNetwork](#function-attempttopostreqstonetwork) | [offsetPubKey](#function-offsetpubkey) |
| [createAction](#function-createaction) | [processAction](#function-processaction) |
| [createStorageServiceChargeScript](#function-createstorageservicechargescript) | [purgeData](#function-purgedata) |
| [generateChangeSdk](#function-generatechangesdk) | [reviewStatus](#function-reviewstatus) |
| [generateChangeSdkMakeStorage](#function-generatechangesdkmakestorage) | [transactionInputSize](#function-transactioninputsize) |
| [getBeefForTransaction](#function-getbeeffortransaction) | [transactionOutputSize](#function-transactionoutputsize) |
| [getSyncChunk](#function-getsyncchunk) | [transactionSize](#function-transactionsize) |
| [internalizeAction](#function-internalizeaction) | [validateGenerateChangeSdkParams](#function-validategeneratechangesdkparams) |
| [listActions](#function-listactions) | [validateGenerateChangeSdkResult](#function-validategeneratechangesdkresult) |
| [listCertificates](#function-listcertificates) | [validateStorageFeeModel](#function-validatestoragefeemodel) |
| [listOutputs](#function-listoutputs) | [varUintSize](#function-varuintsize) |
| [lockScriptWithKeyOffsetFromPubKey](#function-lockscriptwithkeyoffsetfrompubkey) |  |

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
### Function: createAction

```ts
export async function createAction(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidCreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<sdk.StorageCreateActionResult> 
```

See also: [AuthId](#interface-authid), [StorageCreateActionResult](#interface-storagecreateactionresult), [StorageProvider](#class-storageprovider), [ValidCreateActionArgs](#interface-validcreateactionargs)

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
### Function: getSyncChunk

Gets the next sync chunk of updated data from un-remoted storage (could be using a remote DB connection).

```ts
export async function getSyncChunk(storage: StorageReader, args: sdk.RequestSyncChunkArgs): Promise<sdk.SyncChunk> 
```

See also: [RequestSyncChunkArgs](#interface-requestsyncchunkargs), [StorageReader](#class-storagereader), [SyncChunk](#interface-syncchunk)

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
### Function: listActions

```ts
export async function listActions(storage: StorageKnex, auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> 
```

See also: [AuthId](#interface-authid), [StorageKnex](#class-storageknex), [ValidListActionsArgs](#interface-validlistactionsargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: listCertificates

```ts
export async function listCertificates(storage: StorageProvider, auth: sdk.AuthId, vargs: sdk.ValidListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListCertificatesResult> 
```

See also: [AuthId](#interface-authid), [StorageProvider](#class-storageprovider), [ValidListCertificatesArgs](#interface-validlistcertificatesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: listOutputs

```ts
export async function listOutputs(dsk: StorageKnex, auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<ListOutputsResult> 
```

See also: [AuthId](#interface-authid), [StorageKnex](#class-storageknex), [ValidListOutputsArgs](#interface-validlistoutputsargs)

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
### Function: offsetPubKey

```ts
export function offsetPubKey(pubKey: string, keyOffset?: string): {
    offsetPubKey: string;
    keyOffset: string;
} 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: processAction

```ts
export async function processAction(storage: StorageProvider, auth: sdk.AuthId, args: sdk.StorageProcessActionArgs): Promise<sdk.StorageProcessActionResults> 
```

See also: [AuthId](#interface-authid), [StorageProcessActionArgs](#interface-storageprocessactionargs), [StorageProcessActionResults](#interface-storageprocessactionresults), [StorageProvider](#class-storageprovider)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: purgeData

```ts
export async function purgeData(storage: StorageKnex, params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> 
```

See also: [PurgeParams](#interface-purgeparams), [PurgeResults](#interface-purgeresults), [StorageKnex](#class-storageknex), [TrxToken](#interface-trxtoken)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Function: reviewStatus

```ts
export async function reviewStatus(storage: StorageKnex, args: {
    agedLimit: Date;
    trx?: sdk.TrxToken;
}): Promise<{
    log: string;
}> 
```

See also: [StorageKnex](#class-storageknex), [TrxToken](#interface-trxtoken)

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
### Function: validateStorageFeeModel

```ts
export function validateStorageFeeModel(v?: sdk.StorageFeeModel): sdk.StorageFeeModel 
```

See also: [StorageFeeModel](#interface-storagefeemodel)

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
## Types

| |
| --- |
| [DBType](#type-dbtype) |
| [PostReqsToNetworkDetailsStatus](#type-postreqstonetworkdetailsstatus) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

### Type: DBType

```ts
export type DBType = "SQLite" | "MySQL"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Type: PostReqsToNetworkDetailsStatus

```ts
export type PostReqsToNetworkDetailsStatus = "success" | "doubleSpend" | "unknown"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
## Variables

