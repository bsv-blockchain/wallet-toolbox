# WAB Shamir 2-of-3 Key Recovery

This guide covers the Shamir Secret Sharing key recovery system, which provides secure wallet backup and recovery using a 2-of-3 threshold scheme.

## Overview

The Shamir system splits your wallet's root private key into 3 shares. Any 2 shares can reconstruct the key:

- **Share A**: User saves as printed backup and/or file
- **Share B**: Stored on WAB server, released only after OTP verification
- **Share C**: User saves to password manager

This design ensures:
- The WAB server alone cannot access your funds (only holds 1 share)
- Loss of any single share doesn't lock you out
- Multiple recovery paths exist (A+B, A+C, or B+C)

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
    walletBuilder: async (privateKey, privilegedKeyManager) => {
        // Build your wallet using the recovered key
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
```

### Creating a New Wallet

```ts
// 1. Collect entropy (show user a "move your mouse" UI)
await manager.collectEntropyFromBrowser(document, (progress) => {
    document.getElementById('progress').textContent = `${progress.percent}%`
})

// 2. Start OTP verification (user receives SMS)
// Note: OTP start happens via /auth/start before calling createNewWallet
const wabClient = new WABClient('https://your-wab-server.com')
await wabClient.startShareAuth('TwilioPhone', userIdHash, {
    phoneNumber: '+1234567890'
})

// 3. User enters OTP code, then create wallet
const result = await manager.createNewWallet(
    { phoneNumber: '+1234567890', otp: '123456' },
    {
        onShareAReady: async (shareA) => {
            // Display Share A for user to save
            showPrintableBackup(shareA)
            return await confirmUserSaved('Share A')
        },
        onShareCReady: async (shareC) => {
            // Display Share C for password manager
            showCopyableText(shareC)
            return await confirmUserSaved('Share C')
        }
    }
)

console.log('User ID Hash:', result.userIdHash) // Save for future recovery
console.log('Share A:', result.shareA) // User's printed backup
console.log('Share C:', result.shareC) // User's password manager backup

// 4. Build and use the wallet
const wallet = await manager.buildWallet()
```

### Recovery with Shares A + B (Printed Backup + Server)

```ts
const manager = new ShamirWalletManager({ /* config */ })

// User provides their userIdHash (or derive from Share A)
manager.setUserIdHash(savedUserIdHash)

// Start OTP to retrieve Share B
await manager.startOTPVerification({ phoneNumber: '+1234567890' })

// User enters OTP, recover with Share A
const privateKey = await manager.recoverWithSharesAB(
    shareA,
    { phoneNumber: '+1234567890', otp: '123456' }
)

const wallet = await manager.buildWallet()
```

### Recovery with Shares A + C (Offline Recovery)

This method requires no server interaction:

```ts
const manager = new ShamirWalletManager({ /* config */ })

// Recover using both user-held shares
const privateKey = await manager.recoverWithSharesAC(shareA, shareC)

const wallet = await manager.buildWallet()
```

### Recovery with Shares B + C (Lost Printed Backup)

```ts
const manager = new ShamirWalletManager({ /* config */ })

manager.setUserIdHash(savedUserIdHash)

// Start OTP to retrieve Share B
await manager.startOTPVerification({ phoneNumber: '+1234567890' })

// Recover with Share C from password manager
const privateKey = await manager.recoverWithSharesBC(
    shareC,
    { phoneNumber: '+1234567890', otp: '123456' }
)

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

// Store a share (after OTP verification)
const storeResult = await client.storeShare(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '123456' },
    shareB, // The share to store (format: x.y.threshold.integrity)
    userIdHash
)

// Retrieve a share (requires OTP)
const retrieveResult = await client.retrieveShare(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '654321' },
    userIdHash
)
console.log('Retrieved Share B:', retrieveResult.shareB)

// Update share (for key rotation)
await client.updateShare(
    'TwilioPhone',
    { phoneNumber: '+1234567890', otp: '111222' },
    userIdHash,
    newShareB
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
    {
        onShareAReady: async (shareA) => {
            showPrintableBackup(shareA)
            return await confirmUserSaved('New Share A')
        },
        onShareCReady: async (shareC) => {
            showCopyableText(shareC)
            return await confirmUserSaved('New Share C')
        }
    }
)

// User must save new Share A and Share C
// Share B is automatically updated on server
```

## Account Deletion

To delete a Shamir account and its stored share:

```ts
// Requires OTP verification
await manager.deleteAccount({
    phoneNumber: '+1234567890',
    otp: '123456'
})
// WARNING: Share B is permanently deleted
// User needs Share A + Share C to recover after this
```

## Share Format

Shamir shares use the format: `x.y.threshold.integrity`

- **x**: Share index (1, 2, or 3)
- **y**: Share data (Base58 encoded)
- **threshold**: Number of shares required (always 2)
- **integrity**: Checksum for validation

Example share:
```
1.7KvWLhJ3rQ9FnBZxYmUdNpTsR6CwEiAoH8bVfGjDkM2.2.5XyZ
```

## Security Considerations

1. **Share A**: Store in a secure physical location (safe, safety deposit box)
2. **Share C**: Use a reputable password manager with strong master password
3. **User ID Hash**: Store separately - it identifies your account but cannot recover keys
4. **OTP Security**: Consider SIM-swap risks with SMS; email may be safer for some users
5. **Entropy Quality**: Always collect full entropy before key generation

## Error Handling

```ts
try {
    await manager.recoverWithSharesAB(shareA, authPayload)
} catch (error) {
    if (error.message.includes('Rate limited')) {
        // Too many attempts - wait and retry
    } else if (error.message.includes('OTP verification failed')) {
        // Wrong code - let user retry
    } else if (error.message.includes('integrity check failed')) {
        // Shares don't match - wrong share or corrupted
    }
}
```

[Return to Documentation](./README.md)
