# BSV Wallet Toolbox API Documentation

The documentation is split into various pages, each covering a set of related functionality. The pages are as follows:

- [Examples](https://bsv-blockchain.github.io/wallet-toolbox-examples/) - Getting started and specialized examples.
- [Setup](./setup.md) — Classes supporting wallet setup, experimentation and customization.
- [Wallet](./wallet.md) — Top level `Wallet` class and related APIs.
- [Client](./client.md) — Browser deployment friendly toolbox subset.
- [Storage](./storage.md) — Wallet data persistent storage classes and related APIs.
- [Services](./services.md) — Support for abstracted external network services.
- [Monitor](./monitor.md) — Background task manager for wallet action validation and processing.
- [WAB Shamir](./wab-shamir.md) — Shamir 2-of-3 key recovery system with entropy collection and WAB server integration.

## Open API

[BRC-100](https://brc.dev/100) defines a Unified, Vendor-Neutral, Unchanging, and Open BSV Blockchain Standard Wallet-to-Application Interface which is implemented in this library within the WalletClient class. The API is laid out here as a swagger openapi document to offer a fast-track to understanding the interface which is implemented across multiple substrates. The JSON api is generally considered a developer friendly introduction to the WalletClient, where an binary equivalent ABI may be preferred for production use cases.

- [Wallet API Swagger UI](https://bsv-blockchain.github.io/ts-sdk/swagger)

## Open RPC

StorageClient implements the WalletStorageProvider interface over https using a JSON-RPC api which can be explored using the JSight UI.

- [StorageClient JSight UI](https://bsv-blockchain.github.io/wallet-toolbox/open-rpc)

## Getting Started

### Installation

To install the toolbox, run:

```bash
npm install @bsv/wallet-toolbox
```

### Basic Usage

Here's a simple example of using the toolbox to create and fund a testnet wallet using SQLite for persistent storage:

```ts
import { InternalizeActionArgs, PrivateKey, Utils } from '@bsv/sdk'
import { Setup } from '@bsv/wallet-toolbox'

const rootKeyHex = PrivateKey.fromRandom().toString()
console.log(`MAKE A SECURE COPY OF YOUR WALLET PRIVATE ROOT KEY: ${rootKeyHex}`)

const { wallet } = await Setup.createWalletSQLite({
    filePath: './myTestWallet.sqlite',
    databaseName: 'myTestWallet',
    chain: 'test',
    rootKeyHex
})

// Obtain a Wallet Payment for your new wallet from a testnet funding faucet.
// Update or replace the values in the following example object with your actual funding payment.
// Note that the values below will not be accepted as they are not intended for your new wallet.
const r = {
    senderIdentityKey: '03ac2d10bdb0023f4145cc2eba2fcd2ad3070cb2107b0b48170c46a9440e4cc3fe',
    vout: 0,
    txid: '942f094cee517276182e5857369ea53d64763a327d433489312a9606db188dfb',
    derivationPrefix: 'jSlU588BWkw=',
    derivationSuffix: 'l37vv/Bn4Lw=',
    atomicBEEF: '01010101942f094cee517...a914b29d56273f6c1df90cd8f383c8117680f2bdd05188ac00000000'
}

const args: InternalizeActionArgs = {
    tx: Utils.toArray(r.atomicBEEF, 'hex'),
    outputs: [
        {
            outputIndex: r.vout,
            protocol: 'wallet payment',
            paymentRemittance: {
                derivationPrefix: r.derivationPrefix,
                derivationSuffix: r.derivationSuffix,
                senderIdentityKey: r.senderIdentityKey
            }
        }
    ],
    description: 'from faucet'
}

const rw = await wallet.internalizeAction(args)
console.log(rw.accepted)
```

[Return to Top](#bsv-wallet-toolbox-api-documentation)