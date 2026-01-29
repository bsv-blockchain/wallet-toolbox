/**
 * ShamirWalletManager
 *
 * A wallet manager that uses Shamir Secret Sharing (2-of-3) for key recovery
 * instead of password-derived keys and on-chain UMP tokens.
 *
 * Security improvements over CWIStyleWalletManager:
 * - No password enumeration attacks possible (no password-derived keys)
 * - No encrypted key material stored on-chain
 * - Server only holds 1 of 3 shares (cannot reconstruct alone)
 * - Defense-in-depth with mouse entropy + CSPRNG for key generation
 *
 * Share distribution:
 * - Share A: User saves as printed backup AND file
 * - Share B: Stored on WAB server, released only after OTP verification
 * - Share C: User saves to password manager
 */

import { PrivateKey, WalletInterface, Hash, Utils } from '@bsv/sdk'
import { PrivilegedKeyManager } from './sdk/PrivilegedKeyManager'
import { WABClient } from './wab-client/WABClient'
import { EntropyCollector, EntropyProgressCallback } from './entropy/EntropyCollector'

/**
 * Result from creating a new Shamir-based wallet
 */
export interface CreateShamirWalletResult {
    /** Share A - for user to print and save as file */
    shareA: string
    /** Share C - for user to save in password manager */
    shareC: string
    /** Hash of the user's identity key (used for server lookup) */
    userIdHash: string
    /** The generated private key (for immediate wallet use) */
    privateKey: PrivateKey
}

/**
 * Configuration for ShamirWalletManager
 */
export interface ShamirWalletManagerConfig {
    /** WAB server URL */
    wabServerUrl: string
    /** Auth method type for OTP verification (e.g., "TwilioPhone") */
    authMethodType: string
    /** Function to build the underlying wallet from a private key */
    walletBuilder: (
        privateKey: PrivateKey,
        privilegedKeyManager: PrivilegedKeyManager
    ) => Promise<WalletInterface>
}

/**
 * Callbacks for share storage during wallet creation
 */
export interface ShareStorageCallbacks {
    /** Called when Share A is ready - user should print/save this */
    onShareAReady: (share: string) => Promise<boolean>
    /** Called when Share C is ready - user should save to password manager */
    onShareCReady: (share: string) => Promise<boolean>
}

export class ShamirWalletManager {
    private config: ShamirWalletManagerConfig
    private wabClient: WABClient
    private entropyCollector: EntropyCollector
    private privateKey?: PrivateKey
    private underlying?: WalletInterface
    private userIdHash?: string

    constructor(config: ShamirWalletManagerConfig) {
        this.config = config
        this.wabClient = new WABClient(config.wabServerUrl)
        this.entropyCollector = new EntropyCollector()
    }

    /**
     * Reset the entropy collector (e.g., if user wants to start over)
     */
    resetEntropy(): void {
        this.entropyCollector.reset()
    }

    /**
     * Add a mouse movement sample for entropy collection
     * Call this from your UI's mousemove handler
     */
    addMouseEntropy(x: number, y: number) {
        return this.entropyCollector.addMouseSample(x, y)
    }

    /**
     * Check if enough entropy has been collected
     */
    hasEnoughEntropy(): boolean {
        return this.entropyCollector.isComplete()
    }

    /**
     * Get entropy collection progress
     */
    getEntropyProgress() {
        return this.entropyCollector.getProgress()
    }

    /**
     * Collect entropy from browser mouse movements
     * Convenience method that sets up event listeners automatically
     */
    async collectEntropyFromBrowser(
        element?: EventTarget,
        onProgress?: EntropyProgressCallback
    ): Promise<void> {
        await this.entropyCollector.collectFromBrowser(element, onProgress)
    }

    /**
     * Generate a user ID hash from a private key
     * This is used to identify the user on the WAB server without revealing the key
     */
    private generateUserIdHash(privateKey: PrivateKey): string {
        const publicKey = privateKey.toPublicKey().toString()
        const hash = Hash.sha256(Utils.toArray(publicKey, 'utf8'))
        return Utils.toHex(hash)
    }

    /**
     * Create a new wallet with Shamir 2-of-3 key split
     *
     * Flow:
     * 1. Generate private key from entropy
     * 2. Split into 3 Shamir shares (2-of-3 threshold)
     * 3. Start OTP verification with WAB server
     * 4. After OTP verified, store Share B on server
     * 5. Return Share A and C for user to save
     *
     * @param authPayload Auth method specific payload (e.g., { phoneNumber: "+1...", otp: "123456" })
     * @param callbacks Callbacks for share storage
     * @returns Result containing shares A and C for user to save
     */
    async createNewWallet(
        authPayload: { phoneNumber?: string; email?: string; otp: string },
        callbacks: ShareStorageCallbacks
    ): Promise<CreateShamirWalletResult> {
        // 1. Generate private key from entropy (mixed with CSPRNG)
        const entropy = this.entropyCollector.generateEntropy()
        const privateKey = new PrivateKey(Array.from(entropy))

        // 2. Split into Shamir shares (2-of-3)
        const shares = privateKey.toBackupShares(2, 3)
        const [shareA, shareB, shareC] = shares

        // 3. Generate user ID hash for server identification
        const userIdHash = this.generateUserIdHash(privateKey)

        // 4. Present Share A to user for saving
        const shareASaved = await callbacks.onShareAReady(shareA)
        if (!shareASaved) {
            throw new Error('User did not confirm Share A was saved')
        }

        // 5. Store Share B on WAB server (requires OTP verification)
        const storeResult = await this.wabClient.storeShare(
            this.config.authMethodType,
            authPayload,
            shareB,
            userIdHash
        )

        if (!storeResult.success) {
            throw new Error(storeResult.message || 'Failed to store share on server')
        }

        // 6. Present Share C to user for saving
        const shareCSaved = await callbacks.onShareCReady(shareC)
        if (!shareCSaved) {
            // Note: Share B is already stored, so we just warn but don't fail
            console.warn('User did not confirm Share C was saved. Recovery may be limited.')
        }

        // Store state
        this.privateKey = privateKey
        this.userIdHash = userIdHash

        return {
            shareA,
            shareC,
            userIdHash,
            privateKey
        }
    }

    /**
     * Start OTP verification for share retrieval
     * Call this before recoverWithSharesBC
     */
    async startOTPVerification(payload: { phoneNumber?: string; email?: string }): Promise<void> {
        if (!this.userIdHash) {
            throw new Error('User ID hash not set. Call setUserIdHash first for recovery.')
        }

        const result = await this.wabClient.startShareAuth(
            this.config.authMethodType,
            this.userIdHash,
            payload
        )

        if (!result.success) {
            throw new Error(result.message || 'Failed to start OTP verification')
        }
    }

    /**
     * Set the user ID hash for recovery operations
     * This can be computed from Share A or C (both contain the same threshold/integrity)
     */
    setUserIdHash(userIdHash: string): void {
        this.userIdHash = userIdHash
    }

    /**
     * Recover wallet using Shares A and B (printed backup + server)
     * Requires OTP verification to retrieve Share B
     *
     * @param shareA The user's printed/file backup share
     * @param authPayload Contains OTP code and auth method data
     */
    async recoverWithSharesAB(
        shareA: string,
        authPayload: { phoneNumber?: string; email?: string; otp: string }
    ): Promise<PrivateKey> {
        // Validate share format
        this.validateShareFormat(shareA)

        // Compute user ID hash from share A integrity (requires knowing the structure)
        // For now, assume userIdHash is already set or passed
        if (!this.userIdHash) {
            throw new Error('User ID hash not set. Cannot retrieve Share B.')
        }

        // Retrieve Share B from server
        const retrieveResult = await this.wabClient.retrieveShare(
            this.config.authMethodType,
            authPayload,
            this.userIdHash
        )

        if (!retrieveResult.success || !retrieveResult.shareB) {
            throw new Error(retrieveResult.message || 'Failed to retrieve share from server')
        }

        // Reconstruct private key
        const privateKey = PrivateKey.fromBackupShares([shareA, retrieveResult.shareB])

        // Verify reconstruction by checking user ID hash
        const reconstructedHash = this.generateUserIdHash(privateKey)
        if (reconstructedHash !== this.userIdHash) {
            throw new Error('Share reconstruction failed: integrity check failed')
        }

        this.privateKey = privateKey
        return privateKey
    }

    /**
     * Recover wallet using Shares A and C (printed backup + password manager)
     * Does NOT require server interaction
     *
     * @param shareA The user's printed/file backup share
     * @param shareC The user's password manager share
     */
    async recoverWithSharesAC(shareA: string, shareC: string): Promise<PrivateKey> {
        // Validate share formats
        this.validateShareFormat(shareA)
        this.validateShareFormat(shareC)

        // Reconstruct private key
        const privateKey = PrivateKey.fromBackupShares([shareA, shareC])

        // Compute and store user ID hash
        this.userIdHash = this.generateUserIdHash(privateKey)
        this.privateKey = privateKey

        return privateKey
    }

    /**
     * Recover wallet using Shares B and C (server + password manager)
     * Requires OTP verification to retrieve Share B
     *
     * @param shareC The user's password manager share
     * @param authPayload Contains OTP code and auth method data
     */
    async recoverWithSharesBC(
        shareC: string,
        authPayload: { phoneNumber?: string; email?: string; otp: string }
    ): Promise<PrivateKey> {
        // Validate share format
        this.validateShareFormat(shareC)

        if (!this.userIdHash) {
            throw new Error('User ID hash not set. Call setUserIdHash first.')
        }

        // Retrieve Share B from server
        const retrieveResult = await this.wabClient.retrieveShare(
            this.config.authMethodType,
            authPayload,
            this.userIdHash
        )

        if (!retrieveResult.success || !retrieveResult.shareB) {
            throw new Error(retrieveResult.message || 'Failed to retrieve share from server')
        }

        // Reconstruct private key
        const privateKey = PrivateKey.fromBackupShares([retrieveResult.shareB, shareC])

        // Verify reconstruction
        const reconstructedHash = this.generateUserIdHash(privateKey)
        if (reconstructedHash !== this.userIdHash) {
            throw new Error('Share reconstruction failed: integrity check failed')
        }

        this.privateKey = privateKey
        return privateKey
    }

    /**
     * Build the underlying wallet after key recovery
     */
    async buildWallet(): Promise<WalletInterface> {
        if (!this.privateKey) {
            throw new Error('No private key available. Create or recover wallet first.')
        }

        // Create privileged key manager for secure key operations
        const privilegedKeyManager = new PrivilegedKeyManager(async () => this.privateKey!)

        // Build the wallet
        this.underlying = await this.config.walletBuilder(this.privateKey, privilegedKeyManager)
        return this.underlying
    }

    /**
     * Get the underlying wallet (must call buildWallet first)
     */
    getWallet(): WalletInterface {
        if (!this.underlying) {
            throw new Error('Wallet not built. Call buildWallet first.')
        }
        return this.underlying
    }

    /**
     * Rotate keys - generate new key and update Share B on server
     * User must save new Share A and C
     */
    async rotateKeys(
        authPayload: { phoneNumber?: string; email?: string; otp: string },
        callbacks: ShareStorageCallbacks
    ): Promise<CreateShamirWalletResult> {
        // Reset and collect new entropy
        this.entropyCollector.reset()

        // Require fresh entropy for key rotation
        if (!this.hasEnoughEntropy()) {
            throw new Error('Collect entropy before key rotation')
        }

        // Generate new private key
        const entropy = this.entropyCollector.generateEntropy()
        const newPrivateKey = new PrivateKey(Array.from(entropy))

        // Split into new Shamir shares
        const shares = newPrivateKey.toBackupShares(2, 3)
        const [shareA, shareB, shareC] = shares

        // Generate new user ID hash
        const newUserIdHash = this.generateUserIdHash(newPrivateKey)

        // Present Share A to user
        const shareASaved = await callbacks.onShareAReady(shareA)
        if (!shareASaved) {
            throw new Error('User did not confirm Share A was saved')
        }

        // Update Share B on server
        const updateResult = await this.wabClient.updateShare(
            this.config.authMethodType,
            authPayload,
            this.userIdHash!,
            shareB
        )

        if (!updateResult.success) {
            throw new Error(updateResult.message || 'Failed to update share on server')
        }

        // Present Share C to user
        await callbacks.onShareCReady(shareC)

        // Update state
        this.privateKey = newPrivateKey
        this.userIdHash = newUserIdHash

        return {
            shareA,
            shareC,
            userIdHash: newUserIdHash,
            privateKey: newPrivateKey
        }
    }

    /**
     * Validate Shamir share format
     * Expected format: x.y.threshold.integrity (4 dot-separated parts)
     */
    private validateShareFormat(share: string): void {
        const parts = share.split('.')
        if (parts.length !== 4) {
            throw new Error(
                `Invalid share format. Expected 4 dot-separated parts, got ${parts.length}`
            )
        }

        const threshold = parseInt(parts[2], 10)
        if (isNaN(threshold) || threshold < 2) {
            throw new Error('Invalid share: threshold must be at least 2')
        }
    }

    /**
     * Check if the manager has a loaded private key
     */
    hasPrivateKey(): boolean {
        return this.privateKey !== undefined
    }

    /**
     * Get the user ID hash (for display or storage)
     */
    getUserIdHash(): string | undefined {
        return this.userIdHash
    }

    /**
     * Delete the user's account and stored share from the WAB server
     * Requires OTP verification
     *
     * WARNING: This permanently deletes Share B from the server.
     * If the user loses Share A or Share C after this, they will lose access to their wallet.
     *
     * @param authPayload Contains OTP code and auth method data
     */
    async deleteAccount(
        authPayload: { phoneNumber?: string; email?: string; otp: string }
    ): Promise<void> {
        if (!this.userIdHash) {
            throw new Error('User ID hash not set. Cannot delete account.')
        }

        const result = await this.wabClient.deleteShamirUser(
            this.config.authMethodType,
            authPayload,
            this.userIdHash
        )

        if (!result.success) {
            throw new Error(result.message || 'Failed to delete account')
        }

        // Clear local state
        this.privateKey = undefined
        this.userIdHash = undefined
        this.underlying = undefined
    }
}
