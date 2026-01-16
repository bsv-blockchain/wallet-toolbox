# wallet-toolbox Significant Changes History

This document captures the history of significant changes to the wallet-toolbox repository.
The git commit history contains the details but is unable to draw
attention to changes that materially alter behavior or extend functionality.

## wallet-toolbox 1.7.19

- Fix: Include build artifacts (d.ts, js) in published packages

## wallet-toolbox 1.7.18

- Fork published under @bopen-io scope as @bopen-io/wallet-toolbox
- Also publishes @bopen-io/wallet-toolbox-client and @bopen-io/wallet-toolbox-mobile

## wallet-toolbox 1.7.17

- Fix push.yaml to sync versions, correct root package contents (no mobile), and publish client and mobile

## wallet-toolbox 1.7.15

- Fix specOpInvalidChange to always ignore unbasketted outputs.
- Update dependency to bsv/sdk 1.9.24

## wallet-toolbox 1.7.13

- Fix moreSatoshisNeeded amount in WERR_INSUFFICIENT_FUNDS (was releasing allocated change before saving value).

## wallet-toolbox 1.7.12

- Add pluggable permissions module system (`PermissionsModule` interface) for custom P-basket and P-protocol handlers
- Add `permissionModules` config option to `WalletPermissionsManager` for registering scheme-specific modules
- Support request/response transformation chaining across multiple modules
- Add comprehensive test suite covering P-module delegation, chaining, and error handling

## wallet-toolbox 1.7.11

- Change logging tweaks.

## wallet-toolbox 1.7.6

- Change `WalletLogger` json name from logs[0]

## wallet-toolbox 1.7.5

- Add `WalletLogger` flushFormat property.

## wallet-toolbox 1.7.4

- Really Add `WalletLogger` to package exports (client, and complete).

(Still have to update top level index.all importing index.client importing index.mobile).

## wallet-toolbox 1.7.3

- Add `WalletLogger` to package exports (mobile, client, and complete).

## wallet-toolbox 1.7.2

- Add `WalletLogger` aggregate logger class for use by `Wallet`, `StorageClient` and `StorageServer`,
  implementing the `WalletLoggerInterface` released in latest `@bsv/sdk`.
- Delete `validationHelpers.ts` from `sdk` folder and update code to reference functions and types moved to
  `Validation` namespace exported from `@bsv/sdk`.

## wallet-toolbox 1.7.1

- Add optional skipInvalidProofs to StorageGetBeefOptions

## wallet-toolbox 1.7.0

- Update dependency to @bsv/sdk 1.9.3, makinig this new version a minor bump as well
- Add optional chaintracker to StorageGetBeefOptions
- Add WERR_INVALID_MERKLE_ROOT exception (code 8).
- Change add spendable value to WERR_INVALID_PARAMETER message thrown by createAction

## wallet-toolbox 1.6.43

- Change WERR toJson methods to add code property for HTTPWalletJSON rethrow support.

## wallet-toolbox 1.6.42

- Change WalletPermissionsManager changes

## wallet-toolbox 1.6.41

- Change WalletPermissionsManager changes

## wallet-toolbox 1.6.40

- Change correct import of WERR_REVIEW_ACTIONS in createActions.ts to wallet-toolbox package.

## wallet-toolbox 1.6.39

- Change WalletError unknownToJson error to resolve unknown toJson error.

## wallet-toolbox 1.6.38

- Update to @bsv/sdk 1.8.10

## wallet-toolbox 1.6.37

- Change validationHelpers validateBase64String now polynomial time, sync changes on bsv/sdk
- Change log throw of dummy WERR_REVIEW_ACTIONS.

## wallet-toolbox 1.6.35

- Change specOp WERR_REVIEW_ACTIONS throw to storage layer.

## wallet-toolbox 1.6.34

- Change StorageServer / StorageClient to rethrow WERR errors including WERR_REVIEW_ACTIONS
- Change ChaintracksChainTracker to default to new public services.
- Add WalletError.test.ts and resolve issues related to WERR_errors
- Add retry support to ChaintracksFetch download method to handle WoC rate limits.

## wallet-toolbox 1.6.33

- Add schema migration: outputs spendable index.

## wallet-toolbox 1.6.31

- Change throw WERR_REVIEW_ACTIONS if an input's spentBy is valid

## wallet-toolbox 1.6.30

- Add txid index to proven_tx_reqs table in storage knex schema

## wallet-toolbox 1.6.29

- Add txid index to transactions table in storage knex schema

## wallet-toolbox 1.6.28

- Fix The method `Services`.`getHeaderForHeight` must serialize four byte values LE

## wallet-toolbox 1.6.27

- Change internalizeAction Improve handling of atomic beefs containing transactions unknown to storage.

## wallet-toolbox 1.6.26

- Update to @bsv/sdk 1.8.2

## wallet-toolbox 1.6.25

- Change `WalletPermissionsManager` coalescePermissionTokens logic

## wallet-toolbox 1.6.24

- Add Monitor TaskReorg to handle Chaintracks reorg events, updating ProvenTxs with new merkle proofs.
- Add deactivatedHeaders as optional 4th param to `ReorgListener` in `ChaintracksClientApi`
- Add `ChaintracksStorageApi` `InsertHeaderResult` now includes deactivatedHeaders
- Add `createKnexChaintracks` exported function.
- Add `createNoDbChaintracks` exported function.
- Add `index.mobile.ts` to Chaintracks

- Change `validBulkHeaderFilesByFileHash` updated for 2025-10-06 Babbage CDN update.

## wallet-toolbox 1.6.22

- Change verifyTruthy => validateSatoshis during input validation for createAction.

## wallet-toolbox 1.6.20

- Add DevConsoleInteractor

## wallet-toolbox 1.6.6

- Add robots.txt to StorageServer

## wallet-toolbox 1.6.5

- Add ChaintracksStorageIdb to support in browser header storage.
- Cleanup createDefaultWalletServicesOptions, add comments.
- Some breaking API changes to Chaintracks storage and ingestors.

## wallet-toolbox 1.6.4

- Resolve client dependencies for metanet-desktop, exclude ChaintracksService and Ws ingestors.

## wallet-toolbox 1.6.3

- Resolve client dependencies for metanet-desktop

## wallet-toolbox 1.6.2

- Change defaul chaintracksUrl from npm-registry.babbage.systems to ${chain}net-chaintracks.babbage.systems

## wallet-toolbox 1.6.1

- Add initial port/re-implementation of Chaintracks

## wallet-toolbox 1.5.21

- Add support for listOutputs with negative offsets. (Sorts newest first, offset -1 is newest output).

## wallet-toolbox 1.5.10

- Add automatic request timeouts and deprioritization of postBeef services.

## wallet-toolbox 1.5.7

- One-off authorizations are no longer cached, ensuring they can only be used once.

## wallet-toolbox 1.5.0

- update to @bsv/sdk 1.6.8 and @bsv/auth-express-middleware 1.2.0 (Which include VarInt support for negative numbers, making it a breaking change)

## wallet-toolbox 1.4.10

- when spending non-change outputs, atomically tests spendable before setting to spent.
- change unbasketted new outputs to spendable
- updated WalletStorageManager to use lockQueues for read/write/sync/sp scheduling

## wallet-toolbox 1.4.7

- update to bsv/sdk 1.6.5
- add BHSServiceClient which allows for leaning on BlockHeadersService for chain tracking.
- add ARC callbackURL and callbackToken to createDefaultWalletServiceOptions

## wallet-toolbox 1.4.?

- Only check for proofs when TaskNewHeader sets checkNow, tightens up control of required delay.

## wallet-toolbox 1.4.3

- update monitor logging

## wallet-toolbox 1.4.2

- update monitor TaskNewHeader, TaskCheckForProofs to ignore bleeding edge new blocks and proofs.

## wallet-toolbox 1.4.1

- update to bsv/sdk 1.6.0 with reworked bignum and memory / performance improvements.

## wallet-toolbox 1.3.32

- add permissions caching (5 minutes)

## wallet-toolbox 1.3.30

- Enable gorillaPoolArc for postBeef Services
- Switch Services postBeef multi-service mode from 'PromiseAll' to 'UntilSuccess'

## wallet-toolbox 1.3.29

- add verifyUnlockScripts to both createAction and signAction flows
  
## wallet-toolbox 1.3.28

- adminStats now includes monitorStats and servicesStats of type ServicesCallHistory (wallet-toolbox/src/sdk/WalletServices.interfaces.ts)
- both sets of stats break down service calls by providers including both recent calls and interval based statistics.
- monitorStats correspond to service requests made by the active Monitor daemon. This includes “delayed” createActions. Intervals are currently 12 minutes.
- servicesStats corresponds to the service requests made by the StorageProvider service. This includes “non-delayed” createActions. Intervals are determined by rate of calls to adminStats, each call starts a new interval.

## wallet-toolbox 1.3.25

- throws INVALID_PARAMETER if a createAction input is a change output.
- logging and potential fix for internalizeAction bug.
- adds gorillaPool to Services but leaves it disabled for now.
- adds service call history logging to Monitor Events table, but not yet tied in to adminStats return value.
- StorageProvider level “find” entity methods now support additional optional orderDescending boolean.

## wallet-toolbox v1.3.4, 2025-04-24

### Add StorageIdb

Adds support for `indexedDB` based wallet storage via the new `StorageIdb` `StorageProvider` class and a new `SetupClient` class.

## wallet-toolbox v1.3.0, 2025-04-23

### Change in Handling of New Outputs NOT Assigned to a Basket

New outputs created by `createAction` / `signAction` that are NOT assigned to a basket are considered immediately SPENT.

Implications:

- Outputs transferred to a second party, either through internalizeAction or custom means, MUST NOT be assigned to a basket
as this allows them to be spent without your wallet being notified that they are no longer spendable. This is a usage guideline, it is not enforced.
- These outputs will NOT be returned by `listOutputs`, as it only returns spendable outputs.
- These outputs WILL be returned by `listActions` with the includeOutputs option set to true.
- Your wallet will mark any output you include as inputs in your own transactions as spent at the time of transaction creation.
- If a created transaction subsequently fails to be broadcast (abandoned or invalid), the outputs are reset to spendable. This may not happen immediately.
