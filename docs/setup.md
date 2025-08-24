# SETUP: BSV Wallet Toolbox API Documentation

The documentation is split into various pages, this page covers the [Setup](#class-setup) and [SetupClient](#class-setupclient) classes and interfaces.

Unless you are targetting the browser deployment context, focus on [Setup](#class-setup) as it extends the [SetupClient](#class-setupclient) class.

The purpose of this API is to simplify and demonstrate the construction of wallets in various configurations.

[Return To Top](./README.md)

<!--#region ts2md-api-merged-here-->
### API

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

#### Interfaces

| | |
| --- | --- |
| [KeyPairAddress](#interface-keypairaddress) | [SetupWalletClientArgs](#interface-setupwalletclientargs) |
| [SetupClientWalletArgs](#interface-setupclientwalletargs) | [SetupWalletIdb](#interface-setupwalletidb) |
| [SetupClientWalletClientArgs](#interface-setupclientwalletclientargs) | [SetupWalletIdbArgs](#interface-setupwalletidbargs) |
| [SetupEnv](#interface-setupenv) | [SetupWalletKnex](#interface-setupwalletknex) |
| [SetupWallet](#interface-setupwallet) | [SetupWalletKnexArgs](#interface-setupwalletknexargs) |
| [SetupWalletArgs](#interface-setupwalletargs) | [SetupWalletMySQLArgs](#interface-setupwalletmysqlargs) |
| [SetupWalletClient](#interface-setupwalletclient) | [SetupWalletSQLiteArgs](#interface-setupwalletsqliteargs) |

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
##### Interface: SetupEnv

`SetupEnv` provides a starting point for managing secrets that
must not appear in source code.

The `makeEnv` and `getEnv` functions of the `Setup` and `SetupClient` classes
provide an easy way to create and import these secrets and related properties.

```ts
export interface SetupEnv {
    chain: Chain;
    identityKey: string;
    identityKey2: string;
    filePath: string | undefined;
    taalApiKey: string;
    devKeys: Record<string, string>;
    mySQLConnection: string;
}
```

See also: [Chain](./client.md#type-chain)

###### Property chain

The chan being accessed: 'main' for mainnet, 'test' for 'testnet'.

```ts
chain: Chain
```
See also: [Chain](./client.md#type-chain)

###### Property devKeys

A map of public keys (identity keys, hex strings) to private keys (hex strings).

```ts
devKeys: Record<string, string>
```

###### Property filePath

Filepath to sqlite file to be used for identityKey wallet.

```ts
filePath: string | undefined
```

###### Property identityKey

The user's primary identity key (public key).

```ts
identityKey: string
```

###### Property identityKey2

A secondary identity key (public key), used to test exchanges with other users.

```ts
identityKey2: string
```

###### Property mySQLConnection

A MySQL connection string including user and password properties.
Must be valid to make use of MySQL `Setup` class support.

```ts
mySQLConnection: string
```

###### Property taalApiKey

A vaild TAAL API key for use by `Services`

```ts
taalApiKey: string
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
##### Interface: SetupWalletArgs

Arguments used by `createWallet` to construct a `SetupWallet`.

Extension `SetupWalletClientArgs` used by `createWalletClient` to construct a `SetupWalletClient`.

Extension `SetupWalletKnexArgs` used by `createWalletKnex` to construct a `SetupWalletKnex`.

Extension `SetupWalletMySQLArgs` used by `createWalletMySQL` to construct a `SetupWalletKnex`.

Extension `SetupWalletSQLiteArgs` used by `createWalletSQLite` to construct a `SetupWalletKnex`.

```ts
export interface SetupWalletArgs {
    env: SetupEnv;
    rootKeyHex?: string;
    privilegedKeyGetter?: () => Promise<PrivateKey>;
    active?: WalletStorageProvider;
    backups?: WalletStorageProvider[];
}
```

See also: [SetupEnv](./setup.md#interface-setupenv), [WalletStorageProvider](./client.md#interface-walletstorageprovider)

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

###### Property env

Configuration "secrets" typically obtained by `Setup.makeEnv` and `Setup.getEnv` functions.

```ts
env: SetupEnv
```
See also: [SetupEnv](./setup.md#interface-setupenv)

###### Property privilegedKeyGetter

Optional. The privileged private key getter used to initialize the `PrivilegedKeyManager`.
Defaults to undefined.

```ts
privilegedKeyGetter?: () => Promise<PrivateKey>
```

###### Property rootKeyHex

Optional. The non-privileged private key used to initialize the `KeyDeriver` and determine the `identityKey`.
Defaults to `env.devKeys[env.identityKey]

```ts
rootKeyHex?: string
```

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
##### Interface: SetupWalletClientArgs

Extension `SetupWalletClientArgs` of `SetupWalletArgs` is used by `createWalletClient`
to construct a `SetupWalletClient`.

```ts
export interface SetupWalletClientArgs extends SetupWalletArgs {
    endpointUrl?: string;
}
```

See also: [SetupWalletArgs](./setup.md#interface-setupwalletargs)

###### Property endpointUrl

The endpoint URL of a service hosting the `StorageServer` JSON-RPC service to
which a `StorageClient` instance should connect to function as
the active storage provider of the newly created wallet.

```ts
endpointUrl?: string
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
##### Interface: SetupWalletKnex

```ts
export interface SetupWalletKnex extends SetupWallet {
    activeStorage: StorageKnex;
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

See also: [Chain](./client.md#type-chain), [Monitor](./monitor.md#class-monitor), [Services](./services.md#class-services), [SetupWallet](./setup.md#interface-setupwallet), [StorageKnex](./storage.md#class-storageknex), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWalletKnexArgs

```ts
export interface SetupWalletKnexArgs extends SetupWalletArgs {
    knex: Knex<any, any[]>;
    databaseName: string;
}
```

See also: [SetupWalletArgs](./setup.md#interface-setupwalletargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWalletMySQLArgs

```ts
export interface SetupWalletMySQLArgs extends SetupWalletArgs {
    databaseName: string;
}
```

See also: [SetupWalletArgs](./setup.md#interface-setupwalletargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
##### Interface: SetupWalletSQLiteArgs

```ts
export interface SetupWalletSQLiteArgs extends SetupWalletArgs {
    filePath: string;
    databaseName: string;
}
```

See also: [SetupWalletArgs](./setup.md#interface-setupwalletargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Classes

| |
| --- |
| [Setup](#class-setup) |
| [SetupClient](#class-setupclient) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

##### Class: Setup

The 'Setup` class provides static setup functions to construct BRC-100 compatible
wallets in a variety of configurations.

It serves as a starting point for experimentation and customization.

```ts
export abstract class Setup {
    static noEnv(chain: Chain): boolean 
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
# .env file template for working with wallet-toolbox Setup functions.
MY_TEST_IDENTITY = '${testIdentityKey1}'
MY_TEST_IDENTITY2 = '${testIdentityKey2}'
MY_MAIN_IDENTITY = '${mainIdentityKey1}'
MY_MAIN_IDENTITY2 = '${mainIdentityKey2}'
MAIN_TAAL_API_KEY='mainnet_9596de07e92300c6287e4393594ae39c'
TEST_TAAL_API_KEY='testnet_0e6cf72133b43ea2d7861da2a38684e3'
MYSQL_CONNECTION='{"port":3306,"host":"127.0.0.1","user":"root","password":"your_password","database":"your_database", "timezone": "Z"}'
DEV_KEYS = '{
    "${testIdentityKey1}": "${testPrivKey1.toString()}",
    "${testIdentityKey2}": "${testPrivKey2.toString()}",
    "${mainIdentityKey1}": "${mainPrivKey1.toString()}",
    "${mainIdentityKey2}": "${mainPrivKey2.toString()}"
}'
`;
        console.log(log);
        return log;
    }
    static getEnv(chain: Chain): SetupEnv {
        const identityKey = chain === "main" ? process.env.MY_MAIN_IDENTITY : process.env.MY_TEST_IDENTITY;
        const identityKey2 = chain === "main" ? process.env.MY_MAIN_IDENTITY2 : process.env.MY_TEST_IDENTITY2;
        const filePath = chain === "main" ? process.env.MY_MAIN_FILEPATH : process.env.MY_TEST_FILEPATH;
        const DEV_KEYS = process.env.DEV_KEYS || "{}";
        const mySQLConnection = process.env.MYSQL_CONNECTION || "{}";
        const taalApiKey = verifyTruthy(chain === "main" ? process.env.MAIN_TAAL_API_KEY : process.env.TEST_TAAL_API_KEY, `.env value for '${chain.toUpperCase()}_TAAL_API_KEY' is required.`);
        if (!identityKey || !identityKey2)
            throw new WERR_INVALID_OPERATION(".env is not a valid SetupEnv configuration.");
        return {
            chain,
            identityKey,
            identityKey2,
            filePath,
            taalApiKey,
            devKeys: JSON.parse(DEV_KEYS) as Record<string, string>,
            mySQLConnection
        };
    }
    static async createWallet(args: SetupWalletArgs): Promise<SetupWallet> {
        const chain = args.env.chain;
        args.rootKeyHex ||= args.env.devKeys[args.env.identityKey];
        const rootKey = PrivateKey.fromHex(args.rootKeyHex);
        const identityKey = rootKey.toPublicKey().toString();
        const keyDeriver = new CachedKeyDeriver(rootKey);
        const storage = new WalletStorageManager(identityKey, args.active, args.backups);
        if (storage.canMakeAvailable())
            await storage.makeAvailable();
        const serviceOptions = Services.createDefaultOptions(chain);
        serviceOptions.taalApiKey = args.env.taalApiKey;
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
    static async createWalletClient(args: SetupWalletClientArgs): Promise<SetupWalletClient> {
        const wo = await Setup.createWallet(args);
        const endpointUrl = args.endpointUrl || `https://${args.env.chain !== "main" ? "staging-" : ""}storage.babbage.systems`;
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
        const lock = Setup.getLockP2PKH(Setup.getKeyPair(priv).address);
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
                lockingScript: Setup.getLockP2PKH(o.address).toHex(),
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
        const os = Setup.createP2PKHOutputs(outputs);
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
    static async createWalletKnex(args: SetupWalletKnexArgs): Promise<SetupWalletKnex> {
        const wo = await Setup.createWallet(args);
        const activeStorage = await Setup.createStorageKnex(args);
        await wo.storage.addWalletStorageProvider(activeStorage);
        const { user, isNew } = await activeStorage.findOrInsertUser(wo.identityKey);
        const userId = user.userId;
        const r: SetupWalletKnex = {
            ...wo,
            activeStorage,
            userId
        };
        return r;
    }
    static async createStorageKnex(args: SetupWalletKnexArgs): Promise<StorageKnex> 
    static createSQLiteKnex(filename: string): Knex {
        const config: Knex.Config = {
            client: "sqlite3",
            connection: { filename },
            useNullAsDefault: true
        };
        const knex = makeKnex(config);
        return knex;
    }
    static createMySQLKnex(connection: string, database?: string): Knex {
        const c: Knex.MySql2ConnectionConfig = JSON.parse(connection);
        if (database) {
            c.database = database;
        }
        const config: Knex.Config = {
            client: "mysql2",
            connection: c,
            useNullAsDefault: true,
            pool: { min: 0, max: 7, idleTimeoutMillis: 15000 }
        };
        const knex = makeKnex(config);
        return knex;
    }
    static async createWalletMySQL(args: SetupWalletMySQLArgs): Promise<SetupWalletKnex> {
        return await this.createWalletKnex({
            ...args,
            knex: Setup.createMySQLKnex(args.env.mySQLConnection, args.databaseName)
        });
    }
    static async createWalletSQLite(args: SetupWalletSQLiteArgs): Promise<SetupWalletKnex> {
        return await this.createWalletKnex({
            ...args,
            knex: Setup.createSQLiteKnex(args.filePath)
        });
    }
}
```

See also: [Chain](./client.md#type-chain), [KeyPairAddress](./setup.md#interface-keypairaddress), [Monitor](./monitor.md#class-monitor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [ScriptTemplateUnlock](./client.md#interface-scripttemplateunlock), [Services](./services.md#class-services), [SetupEnv](./setup.md#interface-setupenv), [SetupWallet](./setup.md#interface-setupwallet), [SetupWalletArgs](./setup.md#interface-setupwalletargs), [SetupWalletClient](./setup.md#interface-setupwalletclient), [SetupWalletClientArgs](./setup.md#interface-setupwalletclientargs), [SetupWalletKnex](./setup.md#interface-setupwalletknex), [SetupWalletKnexArgs](./setup.md#interface-setupwalletknexargs), [SetupWalletMySQLArgs](./setup.md#interface-setupwalletmysqlargs), [SetupWalletSQLiteArgs](./setup.md#interface-setupwalletsqliteargs), [StorageClient](./storage.md#class-storageclient), [StorageKnex](./storage.md#class-storageknex), [WERR_INVALID_OPERATION](./client.md#class-werr_invalid_operation), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager), [createAction](./storage.md#function-createaction), [verifyTruthy](./client.md#function-verifytruthy)

###### Method createStorageKnex

```ts
static async createStorageKnex(args: SetupWalletKnexArgs): Promise<StorageKnex> 
```
See also: [SetupWalletKnexArgs](./setup.md#interface-setupwalletknexargs), [StorageKnex](./storage.md#class-storageknex)

Returns

- `Knex` based storage provider for a wallet. May be used for either active storage or backup storage.

###### Method createWallet

Create a `Wallet`. Storage can optionally be provided or configured later.

The following components are configured: KeyDeriver, WalletStorageManager, WalletService, WalletStorage.
Optionally, PrivilegedKeyManager is also configured.

```ts
static async createWallet(args: SetupWalletArgs): Promise<SetupWallet> {
    const chain = args.env.chain;
    args.rootKeyHex ||= args.env.devKeys[args.env.identityKey];
    const rootKey = PrivateKey.fromHex(args.rootKeyHex);
    const identityKey = rootKey.toPublicKey().toString();
    const keyDeriver = new CachedKeyDeriver(rootKey);
    const storage = new WalletStorageManager(identityKey, args.active, args.backups);
    if (storage.canMakeAvailable())
        await storage.makeAvailable();
    const serviceOptions = Services.createDefaultOptions(chain);
    serviceOptions.taalApiKey = args.env.taalApiKey;
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
See also: [Monitor](./monitor.md#class-monitor), [PrivilegedKeyManager](./client.md#class-privilegedkeymanager), [Services](./services.md#class-services), [SetupWallet](./setup.md#interface-setupwallet), [SetupWalletArgs](./setup.md#interface-setupwalletargs), [Wallet](./client.md#class-wallet), [WalletStorageManager](./storage.md#class-walletstoragemanager)

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

###### Method createWalletKnex

Adds `Knex` based storage to a `Wallet` configured by `Setup.createWalletOnly`

```ts
static async createWalletKnex(args: SetupWalletKnexArgs): Promise<SetupWalletKnex> {
    const wo = await Setup.createWallet(args);
    const activeStorage = await Setup.createStorageKnex(args);
    await wo.storage.addWalletStorageProvider(activeStorage);
    const { user, isNew } = await activeStorage.findOrInsertUser(wo.identityKey);
    const userId = user.userId;
    const r: SetupWalletKnex = {
        ...wo,
        activeStorage,
        userId
    };
    return r;
}
```
See also: [Setup](./setup.md#class-setup), [SetupWalletKnex](./setup.md#interface-setupwalletknex), [SetupWalletKnexArgs](./setup.md#interface-setupwalletknexargs)

Argument Details

+ **args.knex**
  + `Knex` object configured for either MySQL or SQLite database access.
Schema will be created and migrated as needed.
For MySQL, a schema corresponding to databaseName must exist with full access permissions.
+ **args.databaseName**
  + Name for this storage. For MySQL, the schema name within the MySQL instance.
+ **args.chain**
  + Which chain this wallet is on: 'main' or 'test'. Defaults to 'test'.

###### Method getEnv

Reads a .env file of the format created by `makeEnv`.

Returns values for designated `chain`.

Access private keys through the `devKeys` object: `devKeys[identityKey]`

```ts
static getEnv(chain: Chain): SetupEnv {
    const identityKey = chain === "main" ? process.env.MY_MAIN_IDENTITY : process.env.MY_TEST_IDENTITY;
    const identityKey2 = chain === "main" ? process.env.MY_MAIN_IDENTITY2 : process.env.MY_TEST_IDENTITY2;
    const filePath = chain === "main" ? process.env.MY_MAIN_FILEPATH : process.env.MY_TEST_FILEPATH;
    const DEV_KEYS = process.env.DEV_KEYS || "{}";
    const mySQLConnection = process.env.MYSQL_CONNECTION || "{}";
    const taalApiKey = verifyTruthy(chain === "main" ? process.env.MAIN_TAAL_API_KEY : process.env.TEST_TAAL_API_KEY, `.env value for '${chain.toUpperCase()}_TAAL_API_KEY' is required.`);
    if (!identityKey || !identityKey2)
        throw new WERR_INVALID_OPERATION(".env is not a valid SetupEnv configuration.");
    return {
        chain,
        identityKey,
        identityKey2,
        filePath,
        taalApiKey,
        devKeys: JSON.parse(DEV_KEYS) as Record<string, string>,
        mySQLConnection
    };
}
```
See also: [Chain](./client.md#type-chain), [SetupEnv](./setup.md#interface-setupenv), [WERR_INVALID_OPERATION](./client.md#class-werr_invalid_operation), [verifyTruthy](./client.md#function-verifytruthy)

Returns

with configuration environment secrets used by `Setup` functions.

Argument Details

+ **chain**
  + Which chain to use: 'test' or 'main'

###### Method makeEnv

Creates content for .env file with some private keys, identity keys, sample API keys, and sample MySQL connection string.

Two new, random private keys are generated each time, with their associated public identity keys.

Loading secrets from a .env file is intended only for experimentation and getting started.
Private keys should never be included directly in your source code.

```ts
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
# .env file template for working with wallet-toolbox Setup functions.
MY_TEST_IDENTITY = '${testIdentityKey1}'
MY_TEST_IDENTITY2 = '${testIdentityKey2}'
MY_MAIN_IDENTITY = '${mainIdentityKey1}'
MY_MAIN_IDENTITY2 = '${mainIdentityKey2}'
MAIN_TAAL_API_KEY='mainnet_9596de07e92300c6287e4393594ae39c'
TEST_TAAL_API_KEY='testnet_0e6cf72133b43ea2d7861da2a38684e3'
MYSQL_CONNECTION='{"port":3306,"host":"127.0.0.1","user":"root","password":"your_password","database":"your_database", "timezone": "Z"}'
DEV_KEYS = '{
    "${testIdentityKey1}": "${testPrivKey1.toString()}",
    "${testIdentityKey2}": "${testPrivKey2.toString()}",
    "${mainIdentityKey1}": "${mainPrivKey1.toString()}",
    "${mainIdentityKey2}": "${mainPrivKey2.toString()}"
}'
`;
    console.log(log);
    return log;
}
```
See also: [Setup](./setup.md#class-setup)

###### Method noEnv

```ts
static noEnv(chain: Chain): boolean 
```
See also: [Chain](./client.md#type-chain)

Returns

true if .env is not valid for chain

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
#### Functions

#### Types

#### Variables


<!--#endregion ts2md-api-merged-here-->
