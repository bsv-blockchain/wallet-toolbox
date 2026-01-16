# Security Issue: WalletPermissionsManager Token/Ordinal Theft Vulnerability

## Summary

A malicious dApp can transfer tokens and ordinals out of a user's wallet without triggering the `onSpendingAuthorizationRequested` callback, bypassing the spending permission prompt entirely.

## Severity

**HIGH** - This vulnerability allows unauthorized transfer of tokenized assets (ordinals, BSV21 tokens) without user consent.

## Affected Component

`WalletPermissionsManager.createAction()` in [src/WalletPermissionsManager.ts](src/WalletPermissionsManager.ts#L2598-L2832)

## Vulnerability Details

### Root Cause

The spending authorization check in `createAction` only triggers when `netSpent > 0`:

```typescript
// Line 2798-2813
netSpent = totalOutputSatoshis + tx.getFee() - totalInputSatoshis

if (netSpent > 0) {
  try {
    await this.ensureSpendingAuthorization({
      originator: originator!,
      satoshis: netSpent,
      lineItems,
      reason: originalDescription
    })
  } catch (err) {
    await this.underlying.abortAction({ reference })
    throw err
  }
}
```

The `netSpent` calculation is based purely on satoshi value:
- `totalOutputSatoshis` = sum of dApp-requested outputs
- `totalInputSatoshis` = sum of dApp-requested inputs
- `netSpent` = outputs + fee - inputs

### The Problem

This logic only considers satoshi flow, ignoring that UTXOs may carry tokenized assets:

1. **1Sat Ordinals** - NFTs stored in 1 satoshi outputs
2. **BSV21 Tokens** - Fungible tokens in minimal satoshi outputs
3. **Any protocol using data-carrying outputs**

Users should be prompted whenever their assets are being spent, regardless of the net satoshi flow.

### Attack Scenario

1. User has an ordinal (1 sat UTXO)
2. Malicious dApp calls `createAction` with:
   - Input: User's ordinal UTXO (1 sat) - dApp knows the outpoint
   - Input: dApp's own 2 sat UTXO (with provided unlockingScript)
   - Output: 2 sats to user's address
3. Calculation: `netSpent = 2 + fee - (1 + 2) = -1 + fee`
4. If `fee < 1 sat` (possible for small transactions), `netSpent <= 0`
5. **No spending prompt fires**
6. The ordinal is transferred without user approval

### Why This Works

The dApp provides its own inputs with `unlockingScript` already specified - those don't require the wallet to sign them. The wallet only needs to sign the user's ordinal input. Since `netSpent <= 0`, no authorization is requested, and the wallet automatically signs and broadcasts the transaction.

## Impact

- **Unauthorized transfer of ordinals** without user knowledge
- **Unauthorized transfer of BSV21 tokens** without user knowledge
- **Any wallet-owned UTXO** can be transferred if the attacker provides offsetting satoshi value
- Users lose control over their tokenized assets

## Proof of Concept

```typescript
// Malicious dApp code
async function transferOrdinalWithoutConsent(walletClient, targetOrdinalOutpoint: string) {
  const result = await walletClient.createAction({
    description: "Legitimate-looking transaction",
    inputs: [
      {
        // User's ordinal - wallet will sign this
        outpoint: targetOrdinalOutpoint, // e.g., "abc123...def.0"
        unlockingScriptLength: 107
      },
      {
        // Attacker's funding input - already unlocked
        outpoint: "attacker-utxo-txid.0",
        unlockingScript: "3044..." // Pre-signed by attacker
      }
    ],
    outputs: [
      {
        // Return some sats to user (to make netSpent <= 0)
        satoshis: 2,
        lockingScript: "76a914..." // user's address
      },
      {
        // Take the ordinal
        satoshis: 1,
        lockingScript: "76a914..." // attacker's address
      }
    ]
  });
  // Ordinal transferred without any user prompt
}
```

## Proposed Fix

### Option 1: Always Prompt for Wallet-Owned Inputs (Recommended)

Trigger `onSpendingAuthorizationRequested` whenever any wallet-owned input is being consumed, regardless of `netSpent` value:

```typescript
// Check if any wallet-owned inputs are being consumed
const hasWalletOwnedInputs = args.inputs?.some(input => {
  // An input is wallet-owned if it doesn't have a pre-provided unlockingScript
  return !input.unlockingScript;
});

if (netSpent > 0 || hasWalletOwnedInputs) {
  await this.ensureSpendingAuthorization({...});
}
```

### Option 2: Protected Baskets Configuration

Add a configuration option to specify baskets that always require spending authorization:

```typescript
interface PermissionsManagerConfig {
  // ... existing config

  /**
   * Baskets that always require spending authorization when consumed as inputs,
   * regardless of netSpent value. Use this for tokenized assets.
   */
  alwaysPromptForBasketInputs?: string[];
}
```

Then in `createAction`:

```typescript
// Check if any inputs belong to protected baskets
const protectedBaskets = this.config.alwaysPromptForBasketInputs || [];
let consumesProtectedAsset = false;

if (protectedBaskets.length > 0) {
  for (const input of args.inputs || []) {
    // Query the output's basket membership
    const outputInfo = await this.underlying.listOutputs({
      outpoint: input.outpoint,
      include: 'locking scripts'
    });
    if (outputInfo.outputs.length > 0) {
      const basket = outputInfo.outputs[0].basket;
      if (basket && protectedBaskets.includes(basket)) {
        consumesProtectedAsset = true;
        break;
      }
    }
  }
}

if (netSpent > 0 || consumesProtectedAsset) {
  await this.ensureSpendingAuthorization({...});
}
```

### Option 3: Hybrid Approach

Combine both options - always prompt for wallet-owned inputs, but provide extra context when protected baskets are involved:

```typescript
if (netSpent > 0 || hasWalletOwnedInputs) {
  const lineItemsWithAssetInfo = await this.enrichLineItemsWithAssetInfo(lineItems, args.inputs);
  await this.ensureSpendingAuthorization({
    satoshis: Math.max(netSpent, 0),
    lineItems: lineItemsWithAssetInfo,
    // New field to indicate asset consumption
    consumesAssets: consumesProtectedAsset,
    assetBaskets: consumedBaskets
  });
}
```

## Application-Level Mitigation (Interim)

Until a fix is implemented, applications can protect tokenized assets by:

1. **Derived key locking scripts**: Store ordinals/tokens with locking scripts that require `customInstructions` for signing. The wallet cannot auto-sign without derivation info, so malicious dApps can't spend them.

2. **Custom permission modules**: Implement a `PermissionsModule` for token baskets that enforces additional checks.

## Related Files

- [src/WalletPermissionsManager.ts](src/WalletPermissionsManager.ts) - Main implementation
- [src/__tests/WalletPermissionsManager.proxying.test.ts](src/__tests/WalletPermissionsManager.proxying.test.ts) - Existing tests
- [src/__tests/WalletPermissionsManager.tokens.test.ts](src/__tests/WalletPermissionsManager.tokens.test.ts) - Token tests

## Test Cases to Add

1. Should trigger spending authorization when consuming wallet-owned inputs with netSpent <= 0
2. Should trigger spending authorization when consuming inputs from protected baskets
3. Should include asset information in spending authorization request
4. Should not be bypassable by providing offsetting external inputs

## References

- BRC-98: Wallet Protocol Permissions
- BRC-99: Spending Authorizations
