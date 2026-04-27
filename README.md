# BSV Wallet Toolbox

[![Build Status](https://img.shields.io/github/actions/workflow/status/bsv-blockchain/wallet-toolbox/push.yaml?branch=master&label=build)](https://github.com/bsv-blockchain/wallet-toolbox/actions)
[![npm version](https://img.shields.io/npm/v/@bsv/wallet-toolbox)](https://www.npmjs.com/package/@bsv/wallet-toolbox)
[![npm downloads](https://img.shields.io/npm/dm/@bsv/wallet-toolbox)](https://www.npmjs.com/package/@bsv/wallet-toolbox)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=bugs)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![CodeQL](https://github.com/bsv-blockchain/wallet-toolbox/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/bsv-blockchain/wallet-toolbox/actions/workflows/github-code-scanning/codeql)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=bsv-blockchain_wallet-toolbox&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=bsv-blockchain_wallet-toolbox)
[![License](https://img.shields.io/github/license/bsv-blockchain/wallet-toolbox)](./LICENSE.txt)

A [BRC-100](https://github.com/bitcoin-sv/BRCs/blob/master/wallet/0100.md) conforming wallet implementation for the BSV blockchain, built on the [BSV SDK](https://bsv-blockchain.github.io/ts-sdk). Provides persistent storage, protocol-based key derivation, transaction monitoring, chain tracking, and signing — everything needed to build wallet-powered applications on BSV.

## Overview

The Wallet Toolbox is the reference implementation of the BRC-100 wallet interface. It connects the BSV SDK's cryptographic primitives to real storage backends, network services, and signing flows so that application developers don't have to wire these layers together themselves.

BSV Desktop and BSV Browser are the BSV Association reference wallet applications built around this interface. Vendor distributions, including Babbage's Metanet Desktop / Metanet Explorer and Hudos Browser, can implement the same BRC-100 interface against their own product packaging and service defaults.

### What's Inside

| Module | Description |
|--------|-------------|
| **Wallet** | Full BRC-100 wallet — action creation, signing, certificate management, identity discovery, output tracking |
| **Storage** | Pluggable persistence with three backends: **SQLite/MySQL** (via Knex), **IndexedDB** (browser/mobile), and **remote** (client/server over HTTP) |
| **Services** | Network layer — ARC transaction broadcasting, chain tracking (Chaintracks), merkle proof verification, UTXO lookups via WhatsOnChain |
| **Monitor** | Background daemon that watches pending transactions, rebroadcasts failures, handles chain reorganizations, and manages proof acquisition |
| **Signer** | `WalletSigner` bridges any BRC-100 wallet to the SDK's `Transaction` signing interface |
| **Key Management** | `PrivilegedKeyManager` for secure key storage with Shamir secret sharing and obfuscation; protocol-based key derivation per BRC-42/43 |
| **Permissions** | `WalletPermissionsManager` for fine-grained per-app, per-protocol permission control with grouped approval flows |
| **MockChain** | In-memory blockchain for testing — mock mining, UTXO tracking, and merkle proof generation without a network |
| **Entropy** | `EntropyCollector` gathers mouse/touch entropy for high-quality randomness in browser environments |

### Packages

The toolbox publishes three npm packages from this repo:

- **[`@bsv/wallet-toolbox`](https://www.npmjs.com/package/@bsv/wallet-toolbox)** — Full package with all storage backends (SQLite, MySQL, IndexedDB, remote)
- **[`@bsv/wallet-toolbox-client`](https://www.npmjs.com/package/@bsv/wallet-toolbox-client)** — Browser build; excludes Node-only backends (Knex/SQLite/MySQL)
- **[`@bsv/wallet-toolbox-mobile`](https://www.npmjs.com/package/@bsv/wallet-toolbox-mobile)** — Mobile build; IndexedDB and remote storage only

## Getting Started

### Installation

```bash
# Full (Node.js servers, CLIs)
npm install @bsv/wallet-toolbox

# Browser apps
npm install @bsv/wallet-toolbox-client

# React Native / mobile
npm install @bsv/wallet-toolbox-mobile
```

### Quick Example

```typescript
import { SetupWallet } from '@bsv/wallet-toolbox'

// Create a wallet with SQLite storage and default mainnet services
const wallet = await SetupWallet({
  env: 'main',
  endpointUrl: 'https://your-storage-server.example.com'
})

// Create a transaction
const result = await wallet.createAction({
  description: 'Send payment',
  outputs: [{
    lockingScript: '76a914...88ac',
    satoshis: 1000,
    outputDescription: 'payment'
  }]
})
```

## Documentation

[Full API documentation](https://bsv-blockchain.github.io/wallet-toolbox) is available on GitHub Pages.

The codebase has detailed JSDoc annotations throughout — these will surface inline in editors like VS Code.

## Development

```bash
git clone https://github.com/bsv-blockchain/wallet-toolbox.git
cd wallet-toolbox
npm install
npm run build
npm test
```

Tests use Jest. Files named `*.man.test.ts` are manual/integration tests excluded from CI — they require network access or long runtimes and are run locally by developers.

## Contributing

We welcome bug reports, feature requests, and pull requests.

1. Fork and clone the repository
2. `npm install`
3. Create a feature branch
4. Make your changes and ensure `npm test` passes
5. Open a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

## Contributors

| | Name | GitHub | Role |
|---|------|--------|------|
| | Tone Engel | [@tonesnotes](https://github.com/tonesnotes) | Lead developer, maintainer |
| | Darren Kellenschwiler | [@sirdeggen](https://github.com/sirdeggen) | Core contributor |
| | Brayden Langley | [@BraydenLangley](https://github.com/BraydenLangley) | Core contributor |
| | Ty Everett | [@ty-everett](https://github.com/ty-everett) | Core contributor, reviewer |
| | Jackie Lu | [@jackielu3](https://github.com/jackielu3) | Contributor |
| | David Case | [@shruggr](https://github.com/shruggr) | Contributor |
| | Stephen Thomson | [@Stephen-Thomson](https://github.com/Stephen-Thomson) | Contributor |
| | Chance Barimbao | [@ChanceBarimbao](https://github.com/ChanceBarimbao) | Contributor |

## License

Released under the [Open BSV License](./LICENSE.txt).
