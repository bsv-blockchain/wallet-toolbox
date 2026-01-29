/**
 * ShamirWalletManager
 *
 * A wallet manager that uses Shamir Secret Sharing for key recovery
 * instead of password-derived keys and on-chain UMP tokens.
 *
 * Security improvements over CWIStyleWalletManager:
 * - No password enumeration attacks possible (no password-derived keys)
 * - No encrypted key material stored on-chain
 * - Server only holds 1 share (cannot reconstruct alone)
 * - Defense-in-depth with mouse entropy + CSPRNG for key generation
 *
 * Default configuration (2-of-3):
 * - Share 1 (server): Stored on WAB server, released only after OTP verification
 * - Shares 2..n (user): Application decides how to store (print, password manager, etc.)
 *
 * The threshold and total shares are configurable. WAB always stores exactly one share.
 */

import { PrivateKey, WalletInterface, Hash, Utils } from '@bsv/sdk'
import { PrivilegedKeyManager } from './sdk/PrivilegedKeyManager'
import { WABClient } from './wab-client/WABClient'
import { EntropyCollector, EntropyProgressCallback } from './entropy/EntropyCollector'

/**
 * Result from creating a new Shamir-based wallet
 */
export interface CreateShamirWalletResult {
    /**
     * User shares to be stored by the application (excludes server share)
     * For 2-of-3: returns 2 shares, server holds 1
     * For 3-of-5: returns 4 shares, server holds 1
     */
    userShares: string[]
    /** Hash of the user's identity key (used for server lookup) */
    userIdHash: string
    /** The generated private key (for immediate wallet use) */
    privateKey: PrivateKey
    /** The threshold used (k shares needed to reconstruct) */
    threshold: number
    /** Total number of shares generated */
    totalShares: number
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
    /**
     * Number of shares required to reconstruct the key (default: 2)
     * Must be >= 2 and <= totalShares
     */
    threshold?: number
    /**
     * Total number of shares to generate (default: 3)
     * WAB server stores 1, application receives (totalShares - 1)
     */
    totalShares?: number
}

/**
 * Callback for handling user shares during wallet creation
 */
export type ShareStorageCallback = (shares: string[], threshold: number, totalShares: number) => Promise<boolean>

export class ShamirWalletManager {
    private config: ShamirWalletManagerConfig
    private wabClient: WABClient
    private entropyCollector: EntropyCollector
    private privateKey?: PrivateKey
    private underlying?: WalletInterface
    private userIdHash?: string
    private readonly threshold: number
    private readonly totalShares: number

    constructor(config: ShamirWalletManagerConfig) {
        this.config = config
        this.wabClient = new WABClient(config.wabServerUrl)
        this.entropyCollector = new EntropyCollector()

        // Set defaults and validate
        this.threshold = config.threshold ?? 2
        this.totalShares = config.totalShares ?? 3

        if (this.threshold < 2) {
            throw new Error('Threshold must be at least 2')
        }
        if (this.totalShares < 3) {
            throw new Error('Total shares must be at least 3')
        }
        // User must have at least threshold shares to recover independently
        // (server holds 1 share, user holds totalShares - 1)
        // This prevents WAB from becoming a custodian
        const userShareCount = this.totalShares - 1
        if (userShareCount < this.threshold) {
            throw new Error(
                `User must have at least ${this.threshold} shares to recover independently. ` +
                `With ${this.totalShares} total shares and server holding 1, user only gets ${userShareCount}. ` +
                `Increase totalShares to at least ${this.threshold + 1}.`
            )
        }
    }

    /**
     * Get the configured threshold
     */
    getThreshold(): number {
        return this.threshold
    }

    /**
     * Get the configured total shares
     */
    getTotalShares(): number {
        return this.totalShares
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
     * Create a new wallet with Shamir key split
     *
     * Flow:
     * 1. Generate private key from entropy
     * 2. Split into Shamir shares (threshold-of-totalShares)
     * 3. Store first share on WAB server (requires OTP verification)
     * 4. Return remaining shares for application to handle
     *
     * @param authPayload Auth method specific payload (e.g., { phoneNumber: "+1...", otp: "123456" })
     * @param onUserSharesReady Callback when user shares are ready - return true to confirm saved
     * @returns Result containing user shares (server share already stored)
     */
    async createNewWallet(
        authPayload: { phoneNumber?: string; email?: string; otp: string },
        onUserSharesReady: ShareStorageCallback
    ): Promise<CreateShamirWalletResult> {
        // 1. Generate private key from entropy (mixed with CSPRNG)
        const entropy = this.entropyCollector.generateEntropy()
        const privateKey = new PrivateKey(Array.from(entropy))

        // 2. Split into Shamir shares
        const shares = privateKey.toBackupShares(this.threshold, this.totalShares)

        // First share goes to server, rest go to user
        const serverShare = shares[0]
        const userShares = shares.slice(1)

        // 3. Generate user ID hash for server identification
        const userIdHash = this.generateUserIdHash(privateKey)

        // 4. Store server share on WAB server (requires OTP verification)
        const storeResult = await this.wabClient.storeShare(
            this.config.authMethodType,
            authPayload,
            serverShare,
            userIdHash
        )

        if (!storeResult.success) {
            throw new Error(storeResult.message || 'Failed to store share on server')
        }

        // 5. Present user shares for application to handle
        const sharesSaved = await onUserSharesReady(userShares, this.threshold, this.totalShares)
        if (!sharesSaved) {
            console.warn('User shares may not have been saved. Recovery may be limited.')
        }

        // Store state
        this.privateKey = privateKey
        this.userIdHash = userIdHash

        return {
            userShares,
            userIdHash,
            privateKey,
            threshold: this.threshold,
            totalShares: this.totalShares
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
     * Recover wallet using user shares plus the server share
     * Requires OTP verification to retrieve the server share
     *
     * @param userShares Array of user-held shares (need threshold-1 shares)
     * @param authPayload Contains OTP code and auth method data
     */
    async recoverWithServerShare(
        userShares: string[],
        authPayload: { phoneNumber?: string; email?: string; otp: string }
    ): Promise<PrivateKey> {
        // Validate share formats
        for (const share of userShares) {
            this.validateShareFormat(share)
        }

        if (!this.userIdHash) {
            throw new Error('User ID hash not set. Call setUserIdHash first.')
        }

        // Need threshold-1 user shares (server provides 1)
        const threshold = this.getThresholdFromShare(userShares[0])
        if (userShares.length < threshold - 1) {
            throw new Error(
                `Need at least ${threshold - 1} user shares to recover with server share. Got ${userShares.length}.`
            )
        }

        // Retrieve server share
        const retrieveResult = await this.wabClient.retrieveShare(
            this.config.authMethodType,
            authPayload,
            this.userIdHash
        )

        if (!retrieveResult.success || !retrieveResult.shareB) {
            throw new Error(retrieveResult.message || 'Failed to retrieve share from server')
        }

        // Combine server share with user shares
        const allShares = [retrieveResult.shareB, ...userShares.slice(0, threshold - 1)]

        // Reconstruct private key
        const privateKey = PrivateKey.fromBackupShares(allShares)

        // Verify reconstruction by checking user ID hash
        const reconstructedHash = this.generateUserIdHash(privateKey)
        if (reconstructedHash !== this.userIdHash) {
            throw new Error('Share reconstruction failed: integrity check failed')
        }

        this.privateKey = privateKey
        return privateKey
    }

    /**
     * Recover wallet using only user-held shares (no server interaction)
     * Requires at least threshold shares
     *
     * @param userShares Array of user-held shares (need at least threshold shares)
     */
    async recoverWithUserShares(userShares: string[]): Promise<PrivateKey> {
        if (userShares.length < 2) {
            throw new Error('Need at least 2 shares to recover')
        }

        // Validate share formats
        for (const share of userShares) {
            this.validateShareFormat(share)
        }

        // Get threshold from share
        const threshold = this.getThresholdFromShare(userShares[0])
        if (userShares.length < threshold) {
            throw new Error(
                `Need at least ${threshold} shares to recover. Got ${userShares.length}.`
            )
        }

        // Reconstruct private key using threshold shares
        const privateKey = PrivateKey.fromBackupShares(userShares.slice(0, threshold))

        // Compute and store user ID hash
        this.userIdHash = this.generateUserIdHash(privateKey)
        this.privateKey = privateKey

        return privateKey
    }

    /**
     * Extract threshold from a share (format: x.y.threshold.integrity)
     */
    private getThresholdFromShare(share: string): number {
        const parts = share.split('.')
        if (parts.length !== 4) {
            throw new Error('Invalid share format')
        }
        const threshold = parseInt(parts[2], 10)
        if (isNaN(threshold) || threshold < 2) {
            throw new Error('Invalid threshold in share')
        }
        return threshold
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
     * Rotate keys - generate new key and update server share
     * User must save new user shares
     *
     * @param authPayload Contains OTP code and auth method data
     * @param onUserSharesReady Callback when new user shares are ready
     */
    async rotateKeys(
        authPayload: { phoneNumber?: string; email?: string; otp: string },
        onUserSharesReady: ShareStorageCallback
    ): Promise<CreateShamirWalletResult> {
        if (!this.userIdHash) {
            throw new Error('User ID hash not set. Cannot rotate keys.')
        }

        // Require fresh entropy for key rotation
        if (!this.hasEnoughEntropy()) {
            throw new Error('Collect entropy before key rotation')
        }

        // Generate new private key
        const entropy = this.entropyCollector.generateEntropy()
        const newPrivateKey = new PrivateKey(Array.from(entropy))

        // Split into new Shamir shares
        const shares = newPrivateKey.toBackupShares(this.threshold, this.totalShares)
        const serverShare = shares[0]
        const userShares = shares.slice(1)

        // Generate new user ID hash
        const newUserIdHash = this.generateUserIdHash(newPrivateKey)

        // Update server share
        const updateResult = await this.wabClient.updateShare(
            this.config.authMethodType,
            authPayload,
            this.userIdHash,
            serverShare
        )

        if (!updateResult.success) {
            throw new Error(updateResult.message || 'Failed to update share on server')
        }

        // Present user shares
        const sharesSaved = await onUserSharesReady(userShares, this.threshold, this.totalShares)
        if (!sharesSaved) {
            console.warn('User shares may not have been saved. Recovery may be limited.')
        }

        // Update state
        this.privateKey = newPrivateKey
        this.userIdHash = newUserIdHash

        return {
            userShares,
            userIdHash: newUserIdHash,
            privateKey: newPrivateKey,
            threshold: this.threshold,
            totalShares: this.totalShares
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
     * WARNING: This permanently deletes the server share.
     * User must have enough remaining shares to meet the threshold for recovery.
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
