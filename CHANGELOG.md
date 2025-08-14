# wallet-toolbox Significant Changes History

This document captures the history of significant changes to the wallet-toolbox repository. The git commit history contains the details but is unable to draw
attention to changes that materially alter behavior or extend functionality.

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