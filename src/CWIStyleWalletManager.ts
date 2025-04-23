import {
  Hash,
  Utils,
  Random,
  SymmetricKey,
  AbortActionArgs,
  AbortActionResult,
  AcquireCertificateArgs,
  AcquireCertificateResult,
  AuthenticatedResult,
  CreateActionArgs,
  CreateActionResult,
  CreateHmacArgs,
  CreateHmacResult,
  CreateSignatureArgs,
  CreateSignatureResult,
  DiscoverByAttributesArgs,
  DiscoverByIdentityKeyArgs,
  DiscoverCertificatesResult,
  GetHeaderArgs,
  GetHeaderResult,
  GetHeightResult,
  GetNetworkResult,
  GetPublicKeyArgs,
  GetPublicKeyResult,
  GetVersionResult,
  InternalizeActionArgs,
  InternalizeActionResult,
  ListActionsArgs,
  ListActionsResult,
  ListCertificatesArgs,
  ListCertificatesResult,
  ListOutputsArgs,
  ListOutputsResult,
  OriginatorDomainNameStringUnder250Bytes,
  ProveCertificateArgs,
  ProveCertificateResult,
  RelinquishCertificateArgs,
  RelinquishCertificateResult,
  RelinquishOutputArgs,
  RelinquishOutputResult,
  RevealCounterpartyKeyLinkageArgs,
  RevealCounterpartyKeyLinkageResult,
  RevealSpecificKeyLinkageArgs,
  RevealSpecificKeyLinkageResult,
  SignActionArgs,
  SignActionResult,
  VerifyHmacArgs,
  VerifyHmacResult,
  VerifySignatureArgs,
  VerifySignatureResult,
  WalletDecryptArgs,
  WalletDecryptResult,
  WalletEncryptArgs,
  WalletEncryptResult,
  WalletInterface,
  OutpointString,
  PrivateKey,
  LookupResolver,
  LookupAnswer,
  Transaction,
  PushDrop,
  CreateActionInput,
  SHIPBroadcaster
} from '@bsv/sdk'
import { PrivilegedKeyManager } from './sdk/PrivilegedKeyManager'

/**
 * Number of rounds used in PBKDF2 for deriving password keys.
 */
export const PBKDF2_NUM_ROUNDS = 7777

/**
 * Unique Identifier for the default profile (16 zero bytes).
 */
export const DEFAULT_PROFILE_ID = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

/**
 * Describes the structure of a user profile within the wallet.
 */
export interface Profile {
  /**
   * User-defined name for the profile.
   */
  name: string

  /**
   * Unique 16-byte identifier for the profile.
   */
  id: number[]

  /**
   * 32-byte random pad XOR'd with the root primary key to derive the profile's primary key.
   */
  primaryPad: number[]

  /**
   * 32-byte random pad XOR'd with the root privileged key to derive the profile's privileged key.
   */
  privilegedPad: number[]

  /**
   * Timestamp (seconds since epoch) when the profile was created.
   */
  createdAt: number
}

/**
 * Describes the structure of a User Management Protocol (UMP) token.
 */
export interface UMPToken {
  /**
   * Root Primary key encrypted by the XOR of the password and presentation keys.
   */
  passwordPresentationPrimary: number[]

  /**
   * Root Primary key encrypted by the XOR of the password and recovery keys.
   */
  passwordRecoveryPrimary: number[]

  /**
   * Root Primary key encrypted by the XOR of the presentation and recovery keys.
   */
  presentationRecoveryPrimary: number[]

  /**
   * Root Privileged key encrypted by the XOR of the password and primary keys.
   */
  passwordPrimaryPrivileged: number[]

  /**
   * Root Privileged key encrypted by the XOR of the presentation and recovery keys.
   */
  presentationRecoveryPrivileged: number[]

  /**
   * Hash of the presentation key.
   */
  presentationHash: number[]

  /**
   * PBKDF2 salt used in conjunction with the password to derive the password key.
   */
  passwordSalt: number[]

  /**
   * Hash of the recovery key.
   */
  recoveryHash: number[]

  /**
   * A copy of the presentation key encrypted with the root privileged key.
   */
  presentationKeyEncrypted: number[]

  /**
   * A copy of the recovery key encrypted with the root privileged key.
   */
  recoveryKeyEncrypted: number[]

  /**
   * A copy of the password key encrypted with the root privileged key.
   */
  passwordKeyEncrypted: number[]

  /**
   * Optional field containing the encrypted profile data.
   * JSON string -> Encrypted Bytes using root privileged key.
   */
  profilesEncrypted?: number[]

  /**
   * Describes the token's location on-chain, if it's already been published.
   */
  currentOutpoint?: OutpointString
}

/**
 * Describes a system capable of finding and updating UMP tokens on the blockchain.
 */
export interface UMPTokenInteractor {
  /**
   * Locates the latest valid copy of a UMP token (including its outpoint)
   * based on the presentation key hash.
   *
   * @param hash The hash of the presentation key.
   * @returns The UMP token if found; otherwise, undefined.
   */
  findByPresentationKeyHash: (hash: number[]) => Promise<UMPToken | undefined>

  /**
   * Locates the latest valid copy of a UMP token (including its outpoint)
   * based on the recovery key hash.
   *
   * @param hash The hash of the recovery key.
   * @returns The UMP token if found; otherwise, undefined.
   */
  findByRecoveryKeyHash: (hash: number[]) => Promise<UMPToken | undefined>

  /**
   * Creates (and optionally consumes the previous version of) a UMP token on-chain.
   *
   * @param wallet            The wallet that might be used to create a new token (MUST be operating under the DEFAULT profile).
   * @param adminOriginator   The domain name of the administrative originator.
   * @param token             The new UMP token to create.
   * @param oldTokenToConsume If provided, the old token that must be consumed in the same transaction.
   * @returns                 The newly created outpoint.
   */
  buildAndSend: (
    wallet: WalletInterface, // This wallet MUST be the one built for the default profile
    adminOriginator: OriginatorDomainNameStringUnder250Bytes,
    token: UMPToken,
    oldTokenToConsume?: UMPToken
  ) => Promise<OutpointString>
}

/**
 * @class OverlayUMPTokenInteractor
 *
 * A concrete implementation of the UMPTokenInteractor interface that interacts
 * with Overlay Services and the UMP (User Management Protocol) topic. This class
 * is responsible for:
 *
 * 1) Locating UMP tokens via overlay lookups (ls_users).
 * 2) Creating and publishing new or updated UMP token outputs on-chain under
 *    the "tm_users" topic.
 * 3) Consuming (spending) an old token if provided.
 */
export class OverlayUMPTokenInteractor implements UMPTokenInteractor {
  /**
   * A `LookupResolver` instance used to query overlay networks.
   */
  private readonly resolver: LookupResolver

  /**
   * A SHIP broadcaster that can be used to publish updated UMP tokens
   * under the `tm_users` topic to overlay service peers.
   */
  private readonly broadcaster: SHIPBroadcaster

  /**
   * Construct a new OverlayUMPTokenInteractor.
   *
   * @param resolver     A LookupResolver instance for performing overlay queries (ls_users).
   * @param broadcaster  A SHIPBroadcaster instance for sharing new or updated tokens across the `tm_users` overlay.
   */
  constructor(
    resolver: LookupResolver = new LookupResolver(),
    broadcaster: SHIPBroadcaster = new SHIPBroadcaster(['tm_users'])
  ) {
    this.resolver = resolver
    this.broadcaster = broadcaster
  }

  /**
   * Finds a UMP token on-chain by the given presentation key hash, if it exists.
   * Uses the ls_users overlay service to perform the lookup.
   *
   * @param hash The 32-byte SHA-256 hash of the presentation key.
   * @returns A UMPToken object (including currentOutpoint) if found, otherwise undefined.
   */
  public async findByPresentationKeyHash(hash: number[]): Promise<UMPToken | undefined> {
    // Query ls_users for the given presentationHash
    const question = {
      service: 'ls_users',
      query: { presentationHash: Utils.toHex(hash) }
    }
    const answer = await this.resolver.query(question)
    return this.parseLookupAnswer(answer)
  }

  /**
   * Finds a UMP token on-chain by the given recovery key hash, if it exists.
   * Uses the ls_users overlay service to perform the lookup.
   *
   * @param hash The 32-byte SHA-256 hash of the recovery key.
   * @returns A UMPToken object (including currentOutpoint) if found, otherwise undefined.
   */
  public async findByRecoveryKeyHash(hash: number[]): Promise<UMPToken | undefined> {
    const question = {
      service: 'ls_users',
      query: { recoveryHash: Utils.toHex(hash) }
    }
    const answer = await this.resolver.query(question)
    return this.parseLookupAnswer(answer)
  }

  /**
   * Creates or updates (replaces) a UMP token on-chain. If `oldTokenToConsume` is provided,
   * it is spent in the same transaction that creates the new token output. The new token is
   * then broadcast and published under the `tm_users` topic using a SHIP broadcast, ensuring
   * overlay participants see the updated token.
   *
   * @param wallet            The wallet used to build and sign the transaction (MUST be operating under the DEFAULT profile).
   * @param adminOriginator   The domain/FQDN of the administrative originator (wallet operator).
   * @param token             The new UMPToken to create on-chain.
   * @param oldTokenToConsume Optionally, an existing token to consume/spend in the same transaction.
   * @returns The outpoint of the newly created UMP token (e.g. "abcd1234...ef.0").
   */
  public async buildAndSend(
    wallet: WalletInterface, // This wallet MUST be the one built for the default profile
    adminOriginator: OriginatorDomainNameStringUnder250Bytes,
    token: UMPToken,
    oldTokenToConsume?: UMPToken
  ): Promise<OutpointString> {
    // 1) Construct the data fields for the new UMP token.
    const fields: number[][] = []

    fields[0] = token.passwordSalt
    fields[1] = token.passwordPresentationPrimary
    fields[2] = token.passwordRecoveryPrimary
    fields[3] = token.presentationRecoveryPrimary
    fields[4] = token.passwordPrimaryPrivileged
    fields[5] = token.presentationRecoveryPrivileged
    fields[6] = token.presentationHash
    fields[7] = token.recoveryHash
    fields[8] = token.presentationKeyEncrypted
    fields[9] = token.passwordKeyEncrypted
    fields[10] = token.recoveryKeyEncrypted

    // Optional field (11) for encrypted profiles
    if (token.profilesEncrypted) {
      fields[11] = token.profilesEncrypted
    }

    // 2) Create a PushDrop script referencing these fields, locked with the admin key.
    const script = await new PushDrop(wallet, adminOriginator).lock(
      fields,
      [2, 'admin user management token'], // protocolID
      '1', // keyID
      'self', // counterparty
      /*forSelf=*/ true,
      /*includeSignature=*/ true
    )

    // 3) Prepare the createAction call. If oldTokenToConsume is provided, gather the outpoint.
    const inputs: CreateActionInput[] = []
    let inputToken: { beef: number[]; outputIndex: number } | undefined
    if (oldTokenToConsume?.currentOutpoint) {
      inputs.push({
        outpoint: oldTokenToConsume.currentOutpoint,
        unlockingScriptLength: 73, // typical signature length
        inputDescription: 'Consume old UMP token'
      })
      inputToken = await this.findByOutpoint(oldTokenToConsume.currentOutpoint)
    }

    const outputs = [
      {
        lockingScript: script.toHex(),
        satoshis: 1,
        outputDescription: 'New UMP token output'
      }
    ]

    // 4) Build the partial transaction via createAction.
    const createResult = await wallet.createAction(
      {
        description: oldTokenToConsume ? 'Renew UMP token (consume old, create new)' : 'Create new UMP token',
        inputs,
        outputs,
        inputBEEF: inputToken?.beef,
        options: {
          randomizeOutputs: false,
          acceptDelayedBroadcast: false
        }
      },
      adminOriginator
    )

    // If the transaction is fully processed by the wallet
    if (!createResult.signableTransaction) {
      const finalTxid =
        createResult.txid || (createResult.tx ? Transaction.fromAtomicBEEF(createResult.tx).id('hex') : undefined)
      if (!finalTxid) {
        throw new Error('No signableTransaction and no final TX found.')
      }
      // Now broadcast to `tm_users` using SHIP
      const broadcastTx = Transaction.fromAtomicBEEF(createResult.tx!)
      const result = await this.broadcaster.broadcast(broadcastTx)
      console.log('BROADCAST RESULT', result)
      return `${finalTxid}.0`
    }

    // 5) If oldTokenToConsume is present, we must sign the input referencing it.
    //    (If there's no old token, there's nothing to sign for the input.)
    let finalTxid = ''
    const reference = createResult.signableTransaction.reference
    const partialTx = Transaction.fromBEEF(createResult.signableTransaction.tx)

    if (oldTokenToConsume?.currentOutpoint) {
      // Unlock the old token with a matching PushDrop unlocker
      const unlocker = new PushDrop(wallet, adminOriginator).unlock([2, 'admin user management token'], '1', 'self')
      const unlockingScript = await unlocker.sign(partialTx, 0)

      // Provide it to the wallet
      const signResult = await wallet.signAction(
        {
          reference,
          spends: {
            0: {
              unlockingScript: unlockingScript.toHex()
            }
          }
        },
        adminOriginator
      )
      finalTxid = signResult.txid || (signResult.tx ? Transaction.fromAtomicBEEF(signResult.tx).id('hex') : '')
      if (!finalTxid) {
        throw new Error('Could not finalize transaction for renewed UMP token.')
      }
      // 6) Broadcast to `tm_users`
      const finalAtomicTx = signResult.tx
      if (!finalAtomicTx) {
        throw new Error('Final transaction data missing after signing renewed UMP token.')
      }
      const broadcastTx = Transaction.fromAtomicBEEF(finalAtomicTx)
      const result = await this.broadcaster.broadcast(broadcastTx)
      console.log('BROADCAST RESULT', result)
      return `${finalTxid}.0`
    } else {
      // Fallback for creating a new token (no input spending)
      const signResult = await wallet.signAction({ reference, spends: {} }, adminOriginator)
      finalTxid = signResult.txid || (signResult.tx ? Transaction.fromAtomicBEEF(signResult.tx).id('hex') : '')
      if (!finalTxid) {
        throw new Error('Failed to finalize new UMP token transaction.')
      }
      const finalAtomicTx = signResult.tx
      if (!finalAtomicTx) {
        throw new Error('Final transaction data missing after signing new UMP token.')
      }
      const broadcastTx = Transaction.fromAtomicBEEF(finalAtomicTx)
      const result = await this.broadcaster.broadcast(broadcastTx)
      console.log('BROADCAST RESULT', result)
      return `${finalTxid}.0`
    }
  }

  /**
   * Attempts to parse a LookupAnswer from the UMP lookup service. If successful,
   * extracts the token fields from the resulting transaction and constructs
   * a UMPToken object.
   *
   * @param answer The LookupAnswer returned by a query to ls_users.
   * @returns The parsed UMPToken or `undefined` if none found/decodable.
   */
  private parseLookupAnswer(answer: LookupAnswer): UMPToken | undefined {
    if (answer.type !== 'output-list') {
      return undefined
    }
    if (!answer.outputs || answer.outputs.length === 0) {
      return undefined
    }

    const { beef, outputIndex } = answer.outputs[0]
    try {
      const tx = Transaction.fromBEEF(beef)
      const outpoint = `${tx.id('hex')}.${outputIndex}`

      const decoded = PushDrop.decode(tx.outputs[outputIndex].lockingScript)

      // Expecting 11 or more fields for UMP
      if (!decoded.fields || decoded.fields.length < 11) {
        console.warn(`Unexpected number of fields in UMP token: ${decoded.fields?.length}`)
        return undefined
      }

      // Build the UMP token from these fields, preserving outpoint
      const t: UMPToken = {
        // Order matches buildAndSend and serialize/deserialize
        passwordSalt: decoded.fields[0],
        passwordPresentationPrimary: decoded.fields[1],
        passwordRecoveryPrimary: decoded.fields[2],
        presentationRecoveryPrimary: decoded.fields[3],
        passwordPrimaryPrivileged: decoded.fields[4],
        presentationRecoveryPrivileged: decoded.fields[5],
        presentationHash: decoded.fields[6],
        recoveryHash: decoded.fields[7],
        presentationKeyEncrypted: decoded.fields[8],
        passwordKeyEncrypted: decoded.fields[9],
        recoveryKeyEncrypted: decoded.fields[10],
        profilesEncrypted: decoded.fields[12] ? decoded.fields[11] : undefined, // If there's a signature in field 12, use field 11
        currentOutpoint: outpoint
      }
      return t
    } catch (e) {
      console.error('Failed to parse or decode UMP token:', e)
      return undefined
    }
  }

  /**
   * Finds by outpoint for unlocking / spending previous tokens.
   * @param outpoint The outpoint we are searching by
   * @returns The result so that we can use it to unlock the transaction
   */
  private async findByOutpoint(outpoint: string): Promise<{ beef: number[]; outputIndex: number } | undefined> {
    const results = await this.resolver.query({
      service: 'ls_users',
      query: {
        outpoint
      }
    })
    if (results.type !== 'output-list') {
      return undefined
    }
    if (!results.outputs || !results.outputs.length) {
      return undefined
    }
    return results.outputs[0]
  }
}

/**
 * Manages a "CWI-style" wallet that uses a UMP token and a
 * multi-key authentication scheme (password, presentation key, and recovery key),
 * supporting multiple user profiles under a single account.
 */
export class CWIStyleWalletManager implements WalletInterface {
  /**
   * Whether the user is currently authenticated (i.e., root keys are available).
   */
  authenticated: boolean

  /**
   * The domain name of the administrative originator (wallet operator / vendor, or your own).
   */
  private adminOriginator: OriginatorDomainNameStringUnder250Bytes

  /**
   * The system that locates and publishes UMP tokens on-chain.
   */
  private UMPTokenInteractor: UMPTokenInteractor

  /**
   * A function called to persist the newly generated recovery key.
   * It should generally trigger a UI prompt where the user is asked to write it down.
   */
  private recoveryKeySaver: (key: number[]) => Promise<true>

  /**
   * Asks the user to enter their password, for a given reason.
   * The test function can be used to see if the password is correct before resolving.
   * Only resolve with the correct password or reject with an error.
   * Resolving with an incorrect password will throw an error.
   */
  private passwordRetriever: (reason: string, test: (passwordCandidate: string) => boolean) => Promise<string>

  /**
   * Optional function to fund a new Wallet after the new-user flow.
   */
  private newWalletFunder?: (
    presentationKey: number[],
    wallet: WalletInterface, // The default profile wallet
    adminOriginator: OriginatorDomainNameStringUnder250Bytes
  ) => Promise<void>

  /**
   * Builds the underlying wallet for a specific profile.
   */
  private walletBuilder: (
    profilePrimaryKey: number[],
    profilePrivilegedKeyManager: PrivilegedKeyManager,
    profileId: number[]
  ) => Promise<WalletInterface>

  /**
   * Current mode of authentication.
   */
  authenticationMode:
    | 'presentation-key-and-password'
    | 'presentation-key-and-recovery-key'
    | 'recovery-key-and-password' = 'presentation-key-and-password'

  /**
   * Indicates new user or existing user flow.
   */
  authenticationFlow: 'new-user' | 'existing-user' = 'new-user'

  /**
   * The current UMP token in use.
   */
  private currentUMPToken?: UMPToken

  /**
   * Temporarily retained presentation key.
   */
  private presentationKey?: number[]

  /**
   * Temporarily retained recovery key.
   */
  private recoveryKey?: number[]

  /**
   * The user's *root* primary key, derived from authentication factors.
   */
  private rootPrimaryKey?: number[]

  /**
   * The currently active profile ID (null or DEFAULT_PROFILE_ID means default profile).
   */
  private activeProfileId: number[] = DEFAULT_PROFILE_ID

  /**
   * List of loaded non-default profiles.
   */
  private profiles: Profile[] = []

  /**
   * The underlying wallet instance for the *active* profile.
   */
  private underlying?: WalletInterface

  /**
   * Privileged key manager associated with the *root* keys, aware of the active profile.
   */
  private rootPrivilegedKeyManager?: PrivilegedKeyManager

  /**
   * Constructs a new CWIStyleWalletManager.
   *
   * @param adminOriginator   The domain name of the administrative originator.
   * @param walletBuilder     A function that can build an underlying wallet instance for a profile.
   * @param interactor        An instance of UMPTokenInteractor.
   * @param recoveryKeySaver  A function to persist a new recovery key.
   * @param passwordRetriever A function to request the user's password.
   * @param newWalletFunder   Optional function to fund a new wallet.
   * @param stateSnapshot     Optional previously saved state snapshot.
   */
  constructor(
    adminOriginator: OriginatorDomainNameStringUnder250Bytes,
    walletBuilder: (
      profilePrimaryKey: number[],
      profilePrivilegedKeyManager: PrivilegedKeyManager,
      profileId: number[]
    ) => Promise<WalletInterface>,
    interactor: UMPTokenInteractor = new OverlayUMPTokenInteractor(),
    recoveryKeySaver: (key: number[]) => Promise<true>,
    passwordRetriever: (reason: string, test: (passwordCandidate: string) => boolean) => Promise<string>,
    newWalletFunder?: (
      presentationKey: number[],
      wallet: WalletInterface, // Default profile wallet
      adminOriginator: OriginatorDomainNameStringUnder250Bytes
    ) => Promise<void>,
    stateSnapshot?: number[]
  ) {
    this.adminOriginator = adminOriginator
    this.walletBuilder = walletBuilder
    this.UMPTokenInteractor = interactor
    this.recoveryKeySaver = recoveryKeySaver
    this.passwordRetriever = passwordRetriever
    this.authenticated = false
    this.newWalletFunder = newWalletFunder

    // If a saved snapshot is provided, attempt to load it.
    // Note: loadSnapshot now returns a promise. We don't await it here,
    // as the constructor must be synchronous. The caller should check
    // `this.authenticated` after construction if a snapshot was provided.
    if (stateSnapshot) {
      this.loadSnapshot(stateSnapshot).catch(err => {
        console.error('Failed to load snapshot during construction:', err)
        // Clear potentially partially loaded state
        this.destroy()
      })
    }
  }

  // --- Authentication Methods ---

  /**
   * Provides the presentation key.
   */
  async providePresentationKey(key: number[]): Promise<void> {
    if (this.authenticated) {
      throw new Error('User is already authenticated')
    }
    if (this.authenticationMode === 'recovery-key-and-password') {
      throw new Error('Presentation key is not needed in this mode')
    }

    const hash = Hash.sha256(key)
    const token = await this.UMPTokenInteractor.findByPresentationKeyHash(hash)

    if (!token) {
      // No token found -> New user
      this.authenticationFlow = 'new-user'
      this.presentationKey = key
    } else {
      // Found token -> existing user
      this.authenticationFlow = 'existing-user'
      this.presentationKey = key
      this.currentUMPToken = token
    }
  }

  /**
   * Provides the password.
   */
  async providePassword(password: string): Promise<void> {
    if (this.authenticated) {
      throw new Error('User is already authenticated')
    }
    if (this.authenticationMode === 'presentation-key-and-recovery-key') {
      throw new Error('Password is not needed in this mode')
    }

    if (this.authenticationFlow === 'existing-user') {
      // Existing user flow
      if (!this.currentUMPToken) {
        throw new Error('Provide presentation or recovery key first.')
      }
      const derivedPasswordKey = Hash.pbkdf2(
        Utils.toArray(password, 'utf8'),
        this.currentUMPToken.passwordSalt,
        PBKDF2_NUM_ROUNDS,
        32,
        'sha512'
      )

      let rootPrimaryKey: number[]
      let rootPrivilegedKey: number[] | undefined // Only needed for recovery mode

      if (this.authenticationMode === 'presentation-key-and-password') {
        if (!this.presentationKey) throw new Error('No presentation key found!')
        const xorKey = this.XOR(this.presentationKey, derivedPasswordKey)
        rootPrimaryKey = new SymmetricKey(xorKey).decrypt(this.currentUMPToken.passwordPresentationPrimary) as number[]
      } else {
        // 'recovery-key-and-password'
        if (!this.recoveryKey) throw new Error('No recovery key found!')
        const primaryDecryptionKey = this.XOR(this.recoveryKey, derivedPasswordKey)
        rootPrimaryKey = new SymmetricKey(primaryDecryptionKey).decrypt(
          this.currentUMPToken.passwordRecoveryPrimary
        ) as number[]
        const privilegedDecryptionKey = this.XOR(rootPrimaryKey, derivedPasswordKey)
        rootPrivilegedKey = new SymmetricKey(privilegedDecryptionKey).decrypt(
          this.currentUMPToken.passwordPrimaryPrivileged
        ) as number[]
      }
      // Build root infrastructure, load profiles, and switch to default profile initially
      await this.setupRootInfrastructure(rootPrimaryKey, rootPrivilegedKey)
      await this.switchProfile(this.activeProfileId)
    } else {
      // New user flow (only 'presentation-key-and-password')
      if (this.authenticationMode !== 'presentation-key-and-password') {
        throw new Error('New-user flow requires presentation key and password mode.')
      }
      if (!this.presentationKey) {
        throw new Error('No presentation key provided for new-user flow.')
      }

      // Generate new keys/salt
      const recoveryKey = Random(32)
      await this.recoveryKeySaver(recoveryKey)
      const passwordSalt = Random(32)
      const passwordKey = Hash.pbkdf2(Utils.toArray(password, 'utf8'), passwordSalt, PBKDF2_NUM_ROUNDS, 32, 'sha512')
      const rootPrimaryKey = Random(32)
      const rootPrivilegedKey = Random(32)

      // Build XOR keys
      const presentationPassword = new SymmetricKey(this.XOR(this.presentationKey, passwordKey))
      const presentationRecovery = new SymmetricKey(this.XOR(this.presentationKey, recoveryKey))
      const recoveryPassword = new SymmetricKey(this.XOR(recoveryKey, passwordKey))
      const primaryPassword = new SymmetricKey(this.XOR(rootPrimaryKey, passwordKey))

      // Temp manager for encryption
      const tempPrivilegedKeyManager = new PrivilegedKeyManager(async () => new PrivateKey(rootPrivilegedKey))

      // Build new UMP token (no profiles initially)
      const newToken: UMPToken = {
        passwordSalt,
        passwordPresentationPrimary: presentationPassword.encrypt(rootPrimaryKey) as number[],
        passwordRecoveryPrimary: recoveryPassword.encrypt(rootPrimaryKey) as number[],
        presentationRecoveryPrimary: presentationRecovery.encrypt(rootPrimaryKey) as number[],
        passwordPrimaryPrivileged: primaryPassword.encrypt(rootPrivilegedKey) as number[],
        presentationRecoveryPrivileged: presentationRecovery.encrypt(rootPrivilegedKey) as number[],
        presentationHash: Hash.sha256(this.presentationKey),
        recoveryHash: Hash.sha256(recoveryKey),
        presentationKeyEncrypted: (
          await tempPrivilegedKeyManager.encrypt({
            plaintext: this.presentationKey,
            protocolID: [2, 'admin key wrapping'],
            keyID: '1'
          })
        ).ciphertext,
        passwordKeyEncrypted: (
          await tempPrivilegedKeyManager.encrypt({
            plaintext: passwordKey,
            protocolID: [2, 'admin key wrapping'],
            keyID: '1'
          })
        ).ciphertext,
        recoveryKeyEncrypted: (
          await tempPrivilegedKeyManager.encrypt({
            plaintext: recoveryKey,
            protocolID: [2, 'admin key wrapping'],
            keyID: '1'
          })
        ).ciphertext,
        profilesEncrypted: undefined // No profiles yet
      }
      this.currentUMPToken = newToken

      // Setup root infrastructure and switch to default profile
      await this.setupRootInfrastructure(rootPrimaryKey)
      await this.switchProfile(DEFAULT_PROFILE_ID)

      // Fund the *default* wallet if funder provided
      if (this.newWalletFunder && this.underlying) {
        try {
          await this.newWalletFunder(this.presentationKey, this.underlying, this.adminOriginator)
        } catch (e) {
          console.error('Error funding new wallet:', e)
          // Decide if this should halt the process or just log
        }
      }

      // Publish the new UMP token *after* potentially funding
      // We need the default profile wallet to sign the UMP creation TX
      if (!this.underlying) {
        throw new Error('Default profile wallet not built before attempting to publish UMP token.')
      }
      this.currentUMPToken.currentOutpoint = await this.UMPTokenInteractor.buildAndSend(
        this.underlying, // Use the default profile wallet
        this.adminOriginator,
        newToken
      )
    }
  }

  /**
   * Provides the recovery key.
   */
  async provideRecoveryKey(recoveryKey: number[]): Promise<void> {
    if (this.authenticated) {
      throw new Error('Already authenticated')
    }
    if (this.authenticationFlow === 'new-user') {
      throw new Error('Do not submit recovery key in new-user flow')
    }

    if (this.authenticationMode === 'presentation-key-and-password') {
      throw new Error('No recovery key required in this mode')
    } else if (this.authenticationMode === 'recovery-key-and-password') {
      // Wait for password
      const hash = Hash.sha256(recoveryKey)
      const token = await this.UMPTokenInteractor.findByRecoveryKeyHash(hash)
      if (!token) throw new Error('No user found with this recovery key')
      this.recoveryKey = recoveryKey
      this.currentUMPToken = token
    } else {
      // 'presentation-key-and-recovery-key'
      if (!this.presentationKey) throw new Error('Provide the presentation key first')
      if (!this.currentUMPToken) throw new Error('Current UMP token not found')

      const xorKey = this.XOR(this.presentationKey, recoveryKey)
      const rootPrimaryKey = new SymmetricKey(xorKey).decrypt(
        this.currentUMPToken.presentationRecoveryPrimary
      ) as number[]
      const rootPrivilegedKey = new SymmetricKey(xorKey).decrypt(
        this.currentUMPToken.presentationRecoveryPrivileged
      ) as number[]

      // Build root infrastructure, load profiles, switch to default
      await this.setupRootInfrastructure(rootPrimaryKey, rootPrivilegedKey)
      await this.switchProfile(this.activeProfileId)
    }
  }

  // --- State Management Methods ---

  /**
   * Saves the current wallet state (root key, UMP token, active profile) into an encrypted snapshot.
   * Version 2 format: [1 byte version=2] + [32 byte snapshot key] + [16 byte activeProfileId] + [encrypted payload]
   * Encrypted Payload: [32 byte rootPrimaryKey] + [varint token length + serialized UMP token]
   *
   * @returns Encrypted snapshot bytes.
   */
  saveSnapshot(): number[] {
    if (!this.rootPrimaryKey || !this.currentUMPToken) {
      throw new Error('No root primary key or current UMP token set')
    }

    const snapshotKey = Random(32)
    const snapshotPreimageWriter = new Utils.Writer()

    // Write root primary key
    snapshotPreimageWriter.write(this.rootPrimaryKey)

    // Write serialized UMP token (must have outpoint)
    if (!this.currentUMPToken.currentOutpoint) {
      throw new Error('UMP token cannot be saved without a current outpoint.')
    }
    const serializedToken = this.serializeUMPToken(this.currentUMPToken)
    snapshotPreimageWriter.writeVarIntNum(serializedToken.length)
    snapshotPreimageWriter.write(serializedToken)

    // Encrypt the payload
    const snapshotPreimage = snapshotPreimageWriter.toArray()
    const snapshotPayload = new SymmetricKey(snapshotKey).encrypt(snapshotPreimage) as number[]

    // Build final snapshot (Version 2)
    const snapshotWriter = new Utils.Writer()
    snapshotWriter.writeUInt8(2) // Version
    snapshotWriter.write(snapshotKey)
    snapshotWriter.write(this.activeProfileId) // Active profile ID
    snapshotWriter.write(snapshotPayload) // Encrypted data

    return snapshotWriter.toArray()
  }

  /**
   * Loads a previously saved state snapshot. Restores root key, UMP token, profiles, and active profile.
   * Handles Version 1 (legacy) and Version 2 formats.
   *
   * @param snapshot Encrypted snapshot bytes.
   */
  async loadSnapshot(snapshot: number[]): Promise<void> {
    try {
      const reader = new Utils.Reader(snapshot)
      const version = reader.readUInt8()

      let snapshotKey: number[]
      let encryptedPayload: number[]
      let activeProfileId = DEFAULT_PROFILE_ID // Default for V1

      if (version === 1) {
        snapshotKey = reader.read(32)
        encryptedPayload = reader.read()
      } else if (version === 2) {
        snapshotKey = reader.read(32)
        activeProfileId = reader.read(16) // Read active profile ID
        encryptedPayload = reader.read()
      } else {
        throw new Error(`Unsupported snapshot version: ${version}`)
      }

      // Decrypt payload
      const decryptedPayload = new SymmetricKey(snapshotKey).decrypt(encryptedPayload) as number[]
      const payloadReader = new Utils.Reader(decryptedPayload)

      // Read root primary key
      const rootPrimaryKey = payloadReader.read(32)

      // Read serialized UMP token
      const tokenLen = payloadReader.readVarIntNum()
      const tokenBytes = payloadReader.read(tokenLen)
      const token = this.deserializeUMPToken(tokenBytes)

      // Assign loaded data
      this.currentUMPToken = token

      // Setup root infrastructure, load profiles, and switch to the loaded active profile
      await this.setupRootInfrastructure(rootPrimaryKey) // Will automatically load profiles
      await this.switchProfile(activeProfileId) // Switch to the profile saved in the snapshot

      this.authenticationFlow = 'existing-user' // Loading implies existing user
    } catch (error) {
      this.destroy() // Clear state on error
      throw new Error(`Failed to load snapshot: ${(error as Error).message}`)
    }
  }

  /**
   * Destroys the wallet state, clearing keys, tokens, and profiles.
   */
  destroy(): void {
    this.underlying = undefined
    this.rootPrivilegedKeyManager = undefined
    this.authenticated = false
    this.rootPrimaryKey = undefined
    this.currentUMPToken = undefined
    this.presentationKey = undefined
    this.recoveryKey = undefined
    this.profiles = []
    this.activeProfileId = DEFAULT_PROFILE_ID
    this.authenticationMode = 'presentation-key-and-password'
    this.authenticationFlow = 'new-user'
  }

  // --- Profile Management Methods ---

  /**
   * Lists all available profiles, including the default profile.
   * @returns Array of profile info objects, including an 'active' flag.
   */
  listProfiles(): Array<{ id: number[]; name: string; createdAt: number | null; active: boolean }> {
    if (!this.authenticated) {
      throw new Error('Not authenticated.')
    }
    const profileList = [
      // Default profile
      {
        id: DEFAULT_PROFILE_ID,
        name: 'default',
        createdAt: null, // Default profile doesn't have a creation timestamp in the same way
        active: this.activeProfileId.every(x => x === 0)
      },
      // Other profiles
      ...this.profiles.map(p => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
        active: this.activeProfileId.every((x, i) => x === p.id[i])
      }))
    ]
    return profileList
  }

  /**
   * Adds a new profile with the given name.
   * Generates necessary pads and updates the UMP token.
   * Does not switch to the new profile automatically.
   *
   * @param name The desired name for the new profile.
   * @returns The ID of the newly created profile.
   */
  async addProfile(name: string): Promise<number[]> {
    if (!this.authenticated || !this.rootPrimaryKey || !this.currentUMPToken || !this.rootPrivilegedKeyManager) {
      throw new Error('Wallet not fully initialized or authenticated.')
    }

    // Ensure name is unique (including 'default')
    if (name === 'default' || this.profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`Profile name "${name}" is already in use.`)
    }

    const newProfile: Profile = {
      name,
      id: Random(16),
      primaryPad: Random(32),
      privilegedPad: Random(32),
      createdAt: Math.floor(Date.now() / 1000)
    }

    this.profiles.push(newProfile)

    // Update the UMP token with the new profile list
    await this.updateAuthFactors(
      this.currentUMPToken.passwordSalt,
      // Need to re-derive/decrypt factors needed for re-encryption
      await this.getFactor('passwordKey'),
      await this.getFactor('presentationKey'),
      await this.getFactor('recoveryKey'),
      this.rootPrimaryKey,
      await this.getFactor('privilegedKey'), // Get ROOT privileged key
      this.profiles // Pass the updated profile list
    )

    return newProfile.id
  }

  /**
   * Deletes a profile by its ID.
   * Cannot delete the default profile. If the active profile is deleted,
   * it switches back to the default profile.
   *
   * @param profileId The 16-byte ID of the profile to delete.
   */
  async deleteProfile(profileId: number[]): Promise<void> {
    if (!this.authenticated || !this.rootPrimaryKey || !this.currentUMPToken || !this.rootPrivilegedKeyManager) {
      throw new Error('Wallet not fully initialized or authenticated.')
    }
    if (profileId.every(x => x === 0)) {
      throw new Error('Cannot delete the default profile.')
    }

    const profileIndex = this.profiles.findIndex(p => p.id.every((x, i) => x === profileId[i]))
    if (profileIndex === -1) {
      throw new Error('Profile not found.')
    }

    // Remove the profile
    this.profiles.splice(profileIndex, 1)

    // If the deleted profile was active, switch to default
    if (this.activeProfileId.every((x, i) => x === profileId[i])) {
      await this.switchProfile(DEFAULT_PROFILE_ID) // This rebuilds the wallet
    }

    // Update the UMP token
    await this.updateAuthFactors(
      this.currentUMPToken.passwordSalt,
      await this.getFactor('passwordKey'),
      await this.getFactor('presentationKey'),
      await this.getFactor('recoveryKey'),
      this.rootPrimaryKey,
      await this.getFactor('privilegedKey'), // Get ROOT privileged key
      this.profiles // Pass updated list
    )
  }

  /**
   * Switches the active profile. This re-derives keys and rebuilds the underlying wallet.
   *
   * @param profileId The 16-byte ID of the profile to switch to (use DEFAULT_PROFILE_ID for default).
   */
  async switchProfile(profileId: number[]): Promise<void> {
    if (!this.authenticated || !this.rootPrimaryKey || !this.rootPrivilegedKeyManager) {
      throw new Error('Cannot switch profile: Wallet not authenticated or root keys missing.')
    }

    let profilePrimaryKey: number[]
    let profilePrivilegedPad: number[] | undefined // Pad for the target profile

    if (profileId.every(x => x === 0)) {
      // Switching to default profile
      profilePrimaryKey = this.rootPrimaryKey
      profilePrivilegedPad = undefined // No pad for default
      this.activeProfileId = DEFAULT_PROFILE_ID
    } else {
      // Switching to a non-default profile
      const profile = this.profiles.find(p => p.id.every((x, i) => x === profileId[i]))
      if (!profile) {
        throw new Error('Profile not found.')
      }
      profilePrimaryKey = this.XOR(this.rootPrimaryKey, profile.primaryPad)
      profilePrivilegedPad = profile.privilegedPad
      this.activeProfileId = profileId
    }

    // Create a *profile-specific* PrivilegedKeyManager.
    // It uses the ROOT manager internally but applies the profile's pad.
    const profilePrivilegedKeyManager = new PrivilegedKeyManager(async (reason: string) => {
      // Request the ROOT privileged key using the root manager
      const rootPrivileged: PrivateKey = await (this.rootPrivilegedKeyManager as any).getPrivilegedKey(reason)
      const rootPrivilegedBytes = rootPrivileged.toArray()

      // Apply the profile's pad if applicable
      const profilePrivilegedBytes = profilePrivilegedPad
        ? this.XOR(rootPrivilegedBytes, profilePrivilegedPad)
        : rootPrivilegedBytes

      return new PrivateKey(profilePrivilegedBytes)
    })

    // Build the underlying wallet for the specific profile
    this.underlying = await this.walletBuilder(
      profilePrimaryKey,
      profilePrivilegedKeyManager, // Pass the profile-specific manager
      this.activeProfileId // Pass the ID of the profile being activated
    )
  }

  // --- Key Management Methods ---

  /**
   * Changes the user's password. Re-wraps keys and updates the UMP token.
   */
  async changePassword(newPassword: string): Promise<void> {
    if (!this.authenticated || !this.currentUMPToken || !this.rootPrimaryKey || !this.rootPrivilegedKeyManager) {
      throw new Error('Not authenticated or missing required data.')
    }

    const passwordSalt = Random(32)
    const newPasswordKey = Hash.pbkdf2(
      Utils.toArray(newPassword, 'utf8'),
      passwordSalt,
      PBKDF2_NUM_ROUNDS,
      32,
      'sha512'
    )

    // Decrypt existing factors needed for re-encryption, using the *root* privileged key manager
    const recoveryKey = await this.getFactor('recoveryKey')
    const presentationKey = await this.getFactor('presentationKey')
    const rootPrivilegedKey = await this.getFactor('privilegedKey') // Get ROOT privileged key

    await this.updateAuthFactors(
      passwordSalt,
      newPasswordKey,
      presentationKey,
      recoveryKey,
      this.rootPrimaryKey,
      rootPrivilegedKey, // Pass the explicitly fetched root key
      this.profiles // Preserve existing profiles
    )
  }

  /**
   * Retrieves the current recovery key. Requires privileged access.
   */
  async getRecoveryKey(): Promise<number[]> {
    if (!this.authenticated || !this.currentUMPToken || !this.rootPrivilegedKeyManager) {
      throw new Error('Not authenticated or missing required data.')
    }
    return this.getFactor('recoveryKey')
  }

  /**
   * Changes the user's recovery key. Prompts user to save the new key.
   */
  async changeRecoveryKey(): Promise<void> {
    if (!this.authenticated || !this.currentUMPToken || !this.rootPrimaryKey || !this.rootPrivilegedKeyManager) {
      throw new Error('Not authenticated or missing required data.')
    }

    // Decrypt existing factors needed
    const passwordKey = await this.getFactor('passwordKey')
    const presentationKey = await this.getFactor('presentationKey')
    const rootPrivilegedKey = await this.getFactor('privilegedKey') // Get ROOT privileged key

    // Generate and save new recovery key
    const newRecoveryKey = Random(32)
    await this.recoveryKeySaver(newRecoveryKey)

    await this.updateAuthFactors(
      this.currentUMPToken.passwordSalt,
      passwordKey,
      presentationKey,
      newRecoveryKey, // Use the new key
      this.rootPrimaryKey,
      rootPrivilegedKey,
      this.profiles // Preserve profiles
    )
  }

  /**
   * Changes the user's presentation key.
   */
  async changePresentationKey(newPresentationKey: number[]): Promise<void> {
    if (!this.authenticated || !this.currentUMPToken || !this.rootPrimaryKey || !this.rootPrivilegedKeyManager) {
      throw new Error('Not authenticated or missing required data.')
    }
    if (newPresentationKey.length !== 32) {
      throw new Error('Presentation key must be 32 bytes.')
    }

    // Decrypt existing factors
    const recoveryKey = await this.getFactor('recoveryKey')
    const passwordKey = await this.getFactor('passwordKey')
    const rootPrivilegedKey = await this.getFactor('privilegedKey') // Get ROOT privileged key

    await this.updateAuthFactors(
      this.currentUMPToken.passwordSalt,
      passwordKey,
      newPresentationKey, // Use the new key
      recoveryKey,
      this.rootPrimaryKey,
      rootPrivilegedKey,
      this.profiles // Preserve profiles
    )
    // Update the temporarily stored key if it was set
    if (this.presentationKey) {
      this.presentationKey = newPresentationKey
    }
  }

  // --- Internal Helper Methods ---

  /**
   * Performs XOR operation on two byte arrays.
   */
  private XOR(n1: number[], n2: number[]): number[] {
    if (n1.length !== n2.length) {
      // Provide more context in error
      throw new Error(`XOR length mismatch: ${n1.length} vs ${n2.length}`)
    }
    const r = new Array<number>(n1.length)
    for (let i = 0; i < n1.length; i++) {
      r[i] = n1[i] ^ n2[i]
    }
    return r
  }

  /**
   * Helper to decrypt a specific factor (key) stored encrypted in the UMP token.
   * Requires the root privileged key manager.
   * @param factorName Name of the factor to decrypt ('passwordKey', 'presentationKey', 'recoveryKey', 'privilegedKey').
   * @param getRoot If true and factorName is 'privilegedKey', returns the root privileged key bytes directly.
   * @returns The decrypted key bytes.
   */
  private async getFactor(
    factorName: 'passwordKey' | 'presentationKey' | 'recoveryKey' | 'privilegedKey'
  ): Promise<number[]> {
    if (!this.authenticated || !this.currentUMPToken || !this.rootPrivilegedKeyManager) {
      throw new Error(`Cannot get factor "${factorName}": Wallet not ready.`)
    }

    const protocolID: [0 | 1 | 2, string] = [2, 'admin key wrapping'] // Protocol used for encrypting factors
    const keyID = '1' // Key ID used

    try {
      switch (factorName) {
        case 'passwordKey':
          return (
            await this.rootPrivilegedKeyManager.decrypt({
              ciphertext: this.currentUMPToken.passwordKeyEncrypted,
              protocolID,
              keyID
            })
          ).plaintext
        case 'presentationKey':
          return (
            await this.rootPrivilegedKeyManager.decrypt({
              ciphertext: this.currentUMPToken.presentationKeyEncrypted,
              protocolID,
              keyID
            })
          ).plaintext
        case 'recoveryKey':
          return (
            await this.rootPrivilegedKeyManager.decrypt({
              ciphertext: this.currentUMPToken.recoveryKeyEncrypted,
              protocolID,
              keyID
            })
          ).plaintext
        case 'privilegedKey': {
          // This needs careful handling based on whether the ROOT or PROFILE key is needed.
          // This helper is mostly used for UMP updates, which need the ROOT key.
          // We retrieve the PrivateKey object first.
          const pk = await (this.rootPrivilegedKeyManager as any).getPrivilegedKey('UMP token update', true) // Force retrieval of root key
          return pk.toArray() // Return bytes
        }
        default:
          throw new Error(`Unknown factor name: ${factorName}`)
      }
    } catch (error) {
      console.error(`Error decrypting factor ${factorName}:`, error)
      throw new Error(`Failed to decrypt factor "${factorName}": ${(error as Error).message}`)
    }
  }

  /**
   * Recomputes UMP token fields with updated factors and profiles, then publishes the update.
   * This operation requires the *root* privileged key and the *default* profile wallet.
   */
  private async updateAuthFactors(
    passwordSalt: number[],
    passwordKey: number[],
    presentationKey: number[],
    recoveryKey: number[],
    rootPrimaryKey: number[],
    rootPrivilegedKey: number[], // Explicitly pass the root key bytes
    profiles?: Profile[] // Pass current/new profiles list
  ): Promise<void> {
    if (!this.authenticated || !this.rootPrimaryKey || !this.currentUMPToken) {
      throw new Error('Wallet is not properly authenticated or missing data for update.')
    }
    // Ensure we have the OLD token to consume
    const oldTokenToConsume = { ...this.currentUMPToken }
    if (!oldTokenToConsume.currentOutpoint) {
      throw new Error('Cannot update UMP token: Old token has no outpoint.')
    }

    // Derive symmetrical encryption keys using XOR for the *root* keys
    const presentationPassword = new SymmetricKey(this.XOR(presentationKey, passwordKey))
    const presentationRecovery = new SymmetricKey(this.XOR(presentationKey, recoveryKey))
    const recoveryPassword = new SymmetricKey(this.XOR(recoveryKey, passwordKey))
    const primaryPassword = new SymmetricKey(this.XOR(rootPrimaryKey, passwordKey)) // Use rootPrimaryKey

    // Build a temporary privileged key manager using the explicit ROOT privileged key
    const tempRootPrivilegedKeyManager = new PrivilegedKeyManager(async () => new PrivateKey(rootPrivilegedKey))

    // Encrypt profiles if provided
    let profilesEncrypted: number[] | undefined
    if (profiles && profiles.length > 0) {
      const profilesJson = JSON.stringify(profiles)
      const profilesBytes = Utils.toArray(profilesJson, 'utf8')
      profilesEncrypted = new SymmetricKey(rootPrimaryKey).encrypt(profilesBytes) as number[]
    }

    // Construct the new UMP token data
    const newTokenData: UMPToken = {
      passwordSalt,
      passwordPresentationPrimary: presentationPassword.encrypt(rootPrimaryKey) as number[],
      passwordRecoveryPrimary: recoveryPassword.encrypt(rootPrimaryKey) as number[],
      presentationRecoveryPrimary: presentationRecovery.encrypt(rootPrimaryKey) as number[],
      passwordPrimaryPrivileged: primaryPassword.encrypt(rootPrivilegedKey) as number[],
      presentationRecoveryPrivileged: presentationRecovery.encrypt(rootPrivilegedKey) as number[],
      presentationHash: Hash.sha256(presentationKey),
      recoveryHash: Hash.sha256(recoveryKey),
      presentationKeyEncrypted: (
        await tempRootPrivilegedKeyManager.encrypt({
          plaintext: presentationKey,
          protocolID: [2, 'admin key wrapping'],
          keyID: '1'
        })
      ).ciphertext,
      passwordKeyEncrypted: (
        await tempRootPrivilegedKeyManager.encrypt({
          plaintext: passwordKey,
          protocolID: [2, 'admin key wrapping'],
          keyID: '1'
        })
      ).ciphertext,
      recoveryKeyEncrypted: (
        await tempRootPrivilegedKeyManager.encrypt({
          plaintext: recoveryKey,
          protocolID: [2, 'admin key wrapping'],
          keyID: '1'
        })
      ).ciphertext,
      profilesEncrypted // Add encrypted profiles
      // currentOutpoint will be set after publishing
    }

    // We need the wallet built for the DEFAULT profile to publish the UMP token.
    // If the current active profile is not default, temporarily switch, publish, then switch back.
    const currentActiveId = this.activeProfileId
    let walletToUse: WalletInterface | undefined = this.underlying

    if (!currentActiveId.every(x => x === 0)) {
      console.log('Temporarily switching to default profile to update UMP token...')
      await this.switchProfile(DEFAULT_PROFILE_ID) // This rebuilds this.underlying
      walletToUse = this.underlying
    }

    if (!walletToUse) {
      throw new Error('Default profile wallet could not be activated for UMP token update.')
    }

    // Publish the new token on-chain, consuming the old one
    try {
      newTokenData.currentOutpoint = await this.UMPTokenInteractor.buildAndSend(
        walletToUse,
        this.adminOriginator,
        newTokenData,
        oldTokenToConsume // Consume the previous token
      )
      // Update the manager's state
      this.currentUMPToken = newTokenData
      // Profiles are already updated in this.profiles if they were passed in
    } finally {
      // Switch back if we temporarily switched
      if (!currentActiveId.every(x => x === 0)) {
        console.log('Switching back to original profile...')
        await this.switchProfile(currentActiveId)
      }
    }
  }

  /**
   * Serializes a UMP token to binary format (Version 2 with optional profiles).
   * Layout: [1 byte version=2] + [11 * (varint len + bytes) for standard fields] + [1 byte profile_flag] + [IF flag=1 THEN varint len + profile bytes] + [varint len + outpoint bytes]
   */
  private serializeUMPToken(token: UMPToken): number[] {
    if (!token.currentOutpoint) {
      throw new Error('Token must have outpoint for serialization')
    }

    const writer = new Utils.Writer()
    writer.writeUInt8(2) // Version 2

    const writeArray = (arr: number[]) => {
      writer.writeVarIntNum(arr.length)
      writer.write(arr)
    }

    // Write standard fields in specific order
    writeArray(token.passwordSalt) // 0
    writeArray(token.passwordPresentationPrimary) // 1
    writeArray(token.passwordRecoveryPrimary) // 2
    writeArray(token.presentationRecoveryPrimary) // 3
    writeArray(token.passwordPrimaryPrivileged) // 4
    writeArray(token.presentationRecoveryPrivileged) // 5
    writeArray(token.presentationHash) // 6
    writeArray(token.recoveryHash) // 7
    writeArray(token.presentationKeyEncrypted) // 8
    writeArray(token.passwordKeyEncrypted) // 9 - Swapped order vs original doc comment
    writeArray(token.recoveryKeyEncrypted) // 10

    // Write optional profiles field
    if (token.profilesEncrypted && token.profilesEncrypted.length > 0) {
      writer.writeUInt8(1) // Flag indicating profiles present
      writeArray(token.profilesEncrypted)
    } else {
      writer.writeUInt8(0) // Flag indicating no profiles
    }

    // Write outpoint string
    const outpointBytes = Utils.toArray(token.currentOutpoint, 'utf8')
    writer.writeVarIntNum(outpointBytes.length)
    writer.write(outpointBytes)

    return writer.toArray()
  }

  /**
   * Deserializes a UMP token from binary format (Handles Version 1 and 2).
   */
  private deserializeUMPToken(bin: number[]): UMPToken {
    const reader = new Utils.Reader(bin)
    const version = reader.readUInt8()

    if (version !== 1 && version !== 2) {
      throw new Error(`Unsupported UMP token serialization version: ${version}`)
    }

    const readArray = (): number[] => {
      const length = reader.readVarIntNum()
      return reader.read(length)
    }

    // Read standard fields (order matches serialization V2)
    const passwordSalt = readArray() // 0
    const passwordPresentationPrimary = readArray() // 1
    const passwordRecoveryPrimary = readArray() // 2
    const presentationRecoveryPrimary = readArray() // 3
    const passwordPrimaryPrivileged = readArray() // 4
    const presentationRecoveryPrivileged = readArray() // 5
    const presentationHash = readArray() // 6
    const recoveryHash = readArray() // 7
    const presentationKeyEncrypted = readArray() // 8
    const passwordKeyEncrypted = readArray() // 9
    const recoveryKeyEncrypted = readArray() // 10

    // Read optional profiles (only in V2)
    let profilesEncrypted: number[] | undefined
    if (version === 2) {
      const profilesFlag = reader.readUInt8()
      if (profilesFlag === 1) {
        profilesEncrypted = readArray()
      }
    }

    // Read outpoint string
    const outpointLen = reader.readVarIntNum()
    const outpointBytes = reader.read(outpointLen)
    const currentOutpoint = Utils.toUTF8(outpointBytes)

    const token: UMPToken = {
      passwordSalt,
      passwordPresentationPrimary,
      passwordRecoveryPrimary,
      presentationRecoveryPrimary,
      passwordPrimaryPrivileged,
      presentationRecoveryPrivileged,
      presentationHash,
      recoveryHash,
      presentationKeyEncrypted,
      passwordKeyEncrypted, // Corrected order
      recoveryKeyEncrypted,
      profilesEncrypted, // May be undefined
      currentOutpoint
    }

    return token
  }

  /**
   * Sets up the root key infrastructure after authentication or loading from snapshot.
   * Initializes the root primary key, root privileged key manager, loads profiles,
   * and sets the authenticated flag. Does NOT switch profile initially.
   *
   * @param rootPrimaryKey      The user's root primary key (32 bytes).
   * @param ephemeralRootPrivilegedKey Optional root privileged key (e.g., during recovery flows).
   */
  private async setupRootInfrastructure(
    rootPrimaryKey: number[],
    ephemeralRootPrivilegedKey?: number[]
  ): Promise<void> {
    if (!this.currentUMPToken) {
      throw new Error('A UMP token must exist before setting up root infrastructure!')
    }
    this.rootPrimaryKey = rootPrimaryKey

    // Store ephemeral key if provided, for one-time use by the manager
    let oneTimePrivilegedKey: PrivateKey | undefined = ephemeralRootPrivilegedKey
      ? new PrivateKey(ephemeralRootPrivilegedKey)
      : undefined

    // Create the ROOT PrivilegedKeyManager
    this.rootPrivilegedKeyManager = new PrivilegedKeyManager(async (reason: string) => {
      // 1. Use one-time key if available (for recovery)
      if (oneTimePrivilegedKey) {
        const tempKey = oneTimePrivilegedKey
        oneTimePrivilegedKey = undefined // Consume it
        return tempKey
      }

      // 2. Otherwise, derive from password
      const password = await this.passwordRetriever(reason, (passwordCandidate: string) => {
        try {
          const derivedPasswordKey = Hash.pbkdf2(
            Utils.toArray(passwordCandidate, 'utf8'),
            this.currentUMPToken!.passwordSalt,
            PBKDF2_NUM_ROUNDS,
            32,
            'sha512'
          )
          const privilegedDecryptor = this.XOR(this.rootPrimaryKey!, derivedPasswordKey)
          const decryptedPrivileged = new SymmetricKey(privilegedDecryptor).decrypt(
            this.currentUMPToken!.passwordPrimaryPrivileged
          ) as number[]
          return !!decryptedPrivileged // Test passes if decryption works
        } catch (e) {
          return false
        }
      })

      // Decrypt the root privileged key using the confirmed password
      const derivedPasswordKey = Hash.pbkdf2(
        Utils.toArray(password, 'utf8'),
        this.currentUMPToken!.passwordSalt,
        PBKDF2_NUM_ROUNDS,
        32,
        'sha512'
      )
      const privilegedDecryptor = this.XOR(this.rootPrimaryKey!, derivedPasswordKey)
      const rootPrivilegedBytes = new SymmetricKey(privilegedDecryptor).decrypt(
        this.currentUMPToken!.passwordPrimaryPrivileged
      ) as number[]

      return new PrivateKey(rootPrivilegedBytes) // Return the ROOT key object
    })

    // Decrypt and load profiles if present in the token
    this.profiles = [] // Clear existing profiles before loading
    if (this.currentUMPToken.profilesEncrypted && this.currentUMPToken.profilesEncrypted.length > 0) {
      try {
        const decryptedProfileBytes = new SymmetricKey(rootPrimaryKey).decrypt(
          this.currentUMPToken.profilesEncrypted
        ) as number[]
        const profilesJson = Utils.toUTF8(decryptedProfileBytes)
        this.profiles = JSON.parse(profilesJson) as Profile[]
      } catch (error) {
        console.error('Failed to decrypt or parse profiles:', error)
        // Decide if this should be fatal or just log and continue without profiles
        this.profiles = [] // Ensure profiles are empty on error
        // Optionally re-throw or handle more gracefully
        throw new Error(`Failed to load profiles: ${(error as Error).message}`)
      }
    }

    this.authenticated = true
    // Note: We don't call switchProfile here anymore.
    // It's called by the auth methods (providePassword/provideRecoveryKey) or loadSnapshot after this.
  }

  /*
   * ---------------------------------------------------------------------------------------
   * Standard WalletInterface methods proxying to the *active* underlying wallet.
   * Includes authentication checks and admin originator protection.
   * ---------------------------------------------------------------------------------------
   */

  private checkAuthAndUnderlying(originator?: string): void {
    if (!this.authenticated) {
      throw new Error('User is not authenticated.')
    }
    if (!this.underlying) {
      // This might happen if authentication succeeded but profile switching failed
      throw new Error('Underlying wallet for the active profile is not initialized.')
    }
    if (originator === this.adminOriginator) {
      throw new Error('External applications are not allowed to use the admin originator.')
    }
  }

  // Example proxy method (repeat pattern for all others)
  async getPublicKey(
    args: GetPublicKeyArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<GetPublicKeyResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.getPublicKey(args, originator)
  }

  async revealCounterpartyKeyLinkage(
    args: RevealCounterpartyKeyLinkageArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RevealCounterpartyKeyLinkageResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.revealCounterpartyKeyLinkage(args, originator)
  }

  async revealSpecificKeyLinkage(
    args: RevealSpecificKeyLinkageArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RevealSpecificKeyLinkageResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.revealSpecificKeyLinkage(args, originator)
  }

  async encrypt(
    args: WalletEncryptArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<WalletEncryptResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.encrypt(args, originator)
  }

  async decrypt(
    args: WalletDecryptArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<WalletDecryptResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.decrypt(args, originator)
  }

  async createHmac(
    args: CreateHmacArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<CreateHmacResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.createHmac(args, originator)
  }

  async verifyHmac(
    args: VerifyHmacArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<VerifyHmacResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.verifyHmac(args, originator)
  }

  async createSignature(
    args: CreateSignatureArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<CreateSignatureResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.createSignature(args, originator)
  }

  async verifySignature(
    args: VerifySignatureArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<VerifySignatureResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.verifySignature(args, originator)
  }

  async createAction(
    args: CreateActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<CreateActionResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.createAction(args, originator)
  }

  async signAction(
    args: SignActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<SignActionResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.signAction(args, originator)
  }

  async abortAction(
    args: AbortActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AbortActionResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.abortAction(args, originator)
  }

  async listActions(
    args: ListActionsArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListActionsResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.listActions(args, originator)
  }

  async internalizeAction(
    args: InternalizeActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<InternalizeActionResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.internalizeAction(args, originator)
  }

  async listOutputs(
    args: ListOutputsArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListOutputsResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.listOutputs(args, originator)
  }

  async relinquishOutput(
    args: RelinquishOutputArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RelinquishOutputResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.relinquishOutput(args, originator)
  }

  async acquireCertificate(
    args: AcquireCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AcquireCertificateResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.acquireCertificate(args, originator)
  }

  async listCertificates(
    args: ListCertificatesArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListCertificatesResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.listCertificates(args, originator)
  }

  async proveCertificate(
    args: ProveCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ProveCertificateResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.proveCertificate(args, originator)
  }

  async relinquishCertificate(
    args: RelinquishCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RelinquishCertificateResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.relinquishCertificate(args, originator)
  }

  async discoverByIdentityKey(
    args: DiscoverByIdentityKeyArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<DiscoverCertificatesResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.discoverByIdentityKey(args, originator)
  }

  async discoverByAttributes(
    args: DiscoverByAttributesArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<DiscoverCertificatesResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.discoverByAttributes(args, originator)
  }

  async isAuthenticated(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> {
    if (!this.authenticated) {
      throw new Error('User is not authenticated.')
    }
    if (originator === this.adminOriginator) {
      throw new Error('External applications are not allowed to use the admin originator.')
    }
    return { authenticated: true }
  }

  async waitForAuthentication(
    _: {},
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AuthenticatedResult> {
    if (originator === this.adminOriginator) {
      throw new Error('External applications are not allowed to use the admin originator.')
    }
    while (!this.authenticated || !this.underlying) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return { authenticated: true }
  }

  async getHeight(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.getHeight({}, originator)
  }

  async getHeaderForHeight(
    args: GetHeaderArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<GetHeaderResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.getHeaderForHeight(args, originator)
  }

  async getNetwork(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.getNetwork({}, originator)
  }

  async getVersion(_: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> {
    this.checkAuthAndUnderlying(originator)
    return this.underlying!.getVersion({}, originator)
  }
}
