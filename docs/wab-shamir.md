# WAB Shamir Key Recovery

This guide covers the Shamir Secret Sharing key recovery system, which provides secure wallet backup and recovery using a configurable threshold scheme.

## Overview

The Shamir system splits your wallet's root private key into multiple shares. A configurable threshold of shares can reconstruct the key:

- **Server share**: Stored on WAB server, released only after OTP verification
- **User shares**: Application decides how to store (print, password manager, hardware device, etc.)

**Default configuration (2-of-3):**
- 3 total shares, 2 required to reconstruct
- Server holds 1 share, user receives 2 shares
- Any 2 shares can recover the key

**Example configurations:**

| Threshold | Total | Server | User Shares | Use Case |
|-----------|-------|--------|-------------|----------|
| 2 | 3 | 1 | 2 | Standard (default) |
| 2 | 4 | 1 | 3 | Extra redundancy |
| 3 | 5 | 1 | 4 | High security |
| 3 | 4 | 1 | 3 | Balanced security |

**Important constraint:** User must always have at least `threshold` shares so they can recover independently without the server. This prevents the WAB from becoming a custodian of user funds. For example, 2-of-2 is not allowed because the user would only have 1 share and could not recover without server cooperation.

The WAB server always stores exactly one share and cannot reconstruct the key alone.

## Generating a Secure Key with Entropy Collection

For maximum security, keys are generated using mouse movement entropy mixed with the system's cryptographically secure random number generator (CSPRNG).

```ts
import { EntropyCollector } from '@bsv/wallet-toolbox'

// Create collector (default: 256 samples)
const collector = new EntropyCollector({
    targetSamples: 256,
    minSampleInterval: 10 // ms between samples
})

// Option 1: Manual collection from mousemove events
document.addEventListener('mousemove', (event) => {
    const progress = collector.addMouseSample(event.clientX, event.clientY)
    if (progress) {
        console.log(`Entropy: ${progress.percent}% (${progress.collected}/${progress.target})`)
    }
})

// Check when complete
if (collector.isComplete()) {
    const entropy = collector.generateEntropy() // 32 bytes
}

// Option 2: Automatic browser collection with progress callback
const entropy = await collector.collectFromBrowser(document, (progress) => {
    updateProgressBar(progress.percent)
})
```

The `generateEntropy()` method:
1. Extracts raw entropy from mouse positions and timing
2. Hashes it with SHA-256 to whiten the data
3. XORs with `crypto.getRandomValues()` output
4. Final SHA-256 hash ensures uniform distribution

## Using ShamirWalletManager

The `ShamirWalletManager` class handles the complete wallet lifecycle with Shamir shares.

### Configuration

```ts
import { ShamirWalletManager, Setup, PrivateKey, PrivilegedKeyManager } from '@bsv/wallet-toolbox'

const manager = new ShamirWalletManager({
    wabServerUrl: 'https://your-wab-server.com',
    authMethodType: 'TwilioPhone', // or 'DevConsole' for development

    // Optional: customize threshold scheme (defaults to 2-of-3)
    threshold: 2,    // shares needed to reconstruct (min: 2)
    totalShares: 3,  // total shares generated (min: 3, must be >= threshold + 1)

    walletBuilder: async (privateKey, privilegedKeyManager) => {
        const { wallet } = await Setup.createWalletSQLite({
            filePath: './wallet.sqlite',
            databaseName: 'myWallet',
            chain: 'main',
            rootKeyHex: privateKey.toHex(),
            privilegedKeyManager
        })
        return wallet
    }
})

// Check configuration
console.log(`Using ${manager.getThreshold()}-of-${manager.getTotalShares()} scheme`)
```

### Creating a New Wallet

```ts
// 1. Collect entropy (show user a "move your mouse" UI)
await manager.collectEntropyFromBrowser(document, (progress) => {
    document.getElementById('progress').textContent = `${progress.percent}%`
})

// 2. Start OTP verification (user receives SMS)
const wabClient = new WABClient('https://your-wab-server.com')
await wabClient.startShareAuth('TwilioPhone', userIdHash, {
    phoneNumber: '+1234567890'
})

// 3. User enters OTP code, then create wallet
const result = await manager.createNewWallet(
    { phoneNumber: '+1234567890', otp: '123456' },
    async (userShares, threshold, totalShares) => {
        // Application decides how to handle user shares
        // For 2-of-3: userShares has 2 shares
        console.log(`Save these ${userShares.length} shares (${threshold}-of-${totalShares} scheme)`)

        // Example: first share for printing, second for password manager
        await showPrintableBackup(userShares[0])
        await showCopyableText(userShares[1])

        return await confirmUserSavedShares()
    }
)

console.log('User ID Hash:', result.userIdHash)
console.log('User Shares:', result.userShares)
console.log(`Scheme: ${result.threshold}-of-${result.totalShares}`)

// 4. Build and use the wallet
const wallet = await manager.buildWallet()
```

### Recovery with Server Share

When the user has enough shares but needs the server share to meet threshold:

```ts
const manager = new ShamirWalletManager({ /* config */ })

// User provides their userIdHash
manager.setUserIdHash(savedUserIdHash)

// Start OTP to retrieve server share
await manager.startOTPVerification({ phoneNumber: '+1234567890' })

// Recover with user shares (need threshold-1 shares)
// For 2-of-3: need 1 user share + server share
const privateKey = await manager.recoverWithServerShare(
    [userShare1], // Array of user-held shares
    { phoneNumber: '+1234567890', otp: '123456' }
)

const wallet = await manager.buildWallet()
```

### Recovery with User Shares Only (Offline)

When the user has enough shares to meet threshold without the server:

```ts
const manager = new ShamirWalletManager({ /* config */ })

// Recover using user-held shares (need at least threshold shares)
// For 2-of-3: need 2 user shares
const privateKey = await manager.recoverWithUserShares([userShare1, userShare2])

const wallet = await manager.buildWallet()
```

## Using WABClient Directly

For lower-level control, use `WABClient` directly:

```ts
import { WABClient } from '@bsv/wallet-toolbox'

const client = new WABClient('https://your-wab-server.com')

// Start OTP verification
await client.startShareAuth('TwilioPhone', userIdHash, {
    phoneNumber: '+1234567890'
})

// Store the server share (after OTP verification)
const storeResult = await client.storeShare(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '123456' },
    serverShare, // The share to store (format: x.y.threshold.integrity)
    userIdHash
)

// Retrieve the server share (requires OTP)
const retrieveResult = await client.retrieveShare(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '654321' },
    userIdHash
)
console.log('Retrieved server share:', retrieveResult.shareB)

// Update share (for key rotation)
await client.updateShare(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '111222' },
    userIdHash,
    newServerShare
)

// Delete account and stored share
await client.deleteShamirUser(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '333444' },
    userIdHash
)
```

## Key Rotation

To rotate keys (generate new shares while maintaining access):

```ts
// Collect fresh entropy
manager.resetEntropy()
await manager.collectEntropyFromBrowser(document, onProgress)

// Rotate keys (requires OTP verification)
const newResult = await manager.rotateKeys(
    { phoneNumber: '+1234567890', otp: '123456' },
    async (userShares, threshold, totalShares) => {
        console.log(`Save these ${userShares.length} NEW shares`)
        // User must save all new shares
        return await confirmUserSavedShares()
    }
)

// Server share is automatically updated
// User must save new user shares
```

## Account Deletion

To delete a Shamir account and its stored share:

```ts
// Requires OTP verification
await manager.deleteAccount({
    phoneNumber: '+1234567890',
    otp: '123456'
})
// WARNING: Server share is permanently deleted
// User needs enough remaining shares to meet threshold
```

## Share Format

Shamir shares use the format: `x.y.threshold.integrity`

- **x**: Share index (1, 2, 3, ...)
- **y**: Share data (Base58 encoded)
- **threshold**: Number of shares required (e.g., 2)
- **integrity**: Checksum for validation

Example share:
```
1.7KvWLhJ3rQ9FnBZxYmUdNpTsR6CwEiAoH8bVfGjDkM2.2.5XyZ
```

## Security Considerations

1. **Share Storage**: Store user shares in separate, secure locations
2. **Threshold Selection**: Higher threshold = more security but less convenience
3. **OTP Security**: Consider SIM-swap risks with SMS; email may be safer for some users
4. **Entropy Quality**: Always collect full entropy before key generation
5. **User ID Hash**: Store separately - it identifies your account but cannot recover keys

### Recommended Share Storage by Scheme

**2-of-3 (default):**
- Share 1: Print and store in safe/safety deposit box
- Share 2: Save in password manager

**3-of-5 (high security):**
- Share 1: Print and store in safe
- Share 2: Save in password manager
- Share 3: Store on hardware device (USB)
- Share 4: Give to trusted family member

## Error Handling

```ts
try {
    await manager.recoverWithServerShare(userShares, authPayload)
} catch (error) {
    if (error.message.includes('Rate limited')) {
        // Too many attempts - wait and retry
    } else if (error.message.includes('OTP verification failed')) {
        // Wrong code - let user retry
    } else if (error.message.includes('integrity check failed')) {
        // Shares don't match - wrong share or corrupted
    } else if (error.message.includes('Need at least')) {
        // Not enough shares provided
    }
}
```

[Return to Documentation](./README.md)
