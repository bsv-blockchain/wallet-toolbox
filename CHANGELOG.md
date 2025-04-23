# wallet-toolbox Significant Changes History

This document captures the history of significant changes to the wallet-toolbox repository. The git commit history contains the details but is unable to draw
attention to changes that materially alter behavior or extend functionality.

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