import {
  AbortActionArgs,
  AbortActionResult,
  AcquireCertificateArgs,
  AcquireCertificateResult,
  AuthenticatedResult,
  Beef,
  BeefParty,
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
  ProtoWallet,
  ProveCertificateArgs,
  ProveCertificateResult,
  PubKeyHex,
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
  Transaction as BsvTransaction,
  TrustSelf,
  Utils,
  VerifyHmacArgs,
  VerifyHmacResult,
  VerifySignatureArgs,
  VerifySignatureResult,
  WalletDecryptArgs,
  WalletDecryptResult,
  WalletEncryptArgs,
  WalletEncryptResult,
  WalletInterface,
  createNonce,
  AuthFetch,
  verifyNonce,
  MasterCertificate,
  Certificate,
  LookupResolver,
  AtomicBEEF,
  BEEF,
  KeyDeriverApi,
  Validation,
  WalletLoggerInterface,
  MakeWalletLogger
} from '@bsv/sdk'
import { acquireDirectCertificate } from './signer/methods/acquireDirectCertificate'
import { proveCertificate } from './signer/methods/proveCertificate'
import { createAction, CreateActionResultX } from './signer/methods/createAction'
import { signAction, SignActionResultX } from './signer/methods/signAction'
import { internalizeAction } from './signer/methods/internalizeAction'
import { WalletSettingsManager } from './WalletSettingsManager'
import { queryOverlay, transformVerifiableCertificatesWithTrust } from './utility/identityUtils'
import { maxPossibleSatoshis } from './storage/methods/generateChange'
import { WalletStorageManager } from './storage/WalletStorageManager'
import { Monitor } from './monitor/Monitor'
import { WalletSigner } from './signer/WalletSigner'
import { randomBytesBase64, toLookupNetworkPreset, toWalletNetwork } from './utility/utilityHelpers'
import { ScriptTemplateBRC29 } from './utility/ScriptTemplateBRC29'
import {
  Chain,
  KeyPair,
  specOpFailedActions,
  specOpInvalidChange,
  specOpNoSendActions,
  specOpSetWalletChangeParams,
  specOpThrowReviewActions,
  specOpWalletBalance,
  StorageIdentity,
  WalletBalance
} from './sdk/types'
import { WalletServices } from './sdk/WalletServices.interfaces'
import { PrivilegedKeyManager } from './sdk/PrivilegedKeyManager'
import { WERR_INTERNAL, WERR_INVALID_PARAMETER, WERR_NOT_IMPLEMENTED, WERR_REVIEW_ACTIONS } from './sdk/WERR_errors'
import { AuthId, StorageCreateActionResult, StorageInternalizeActionResult } from './sdk/WalletStorage.interfaces'
import { WalletError } from './sdk/WalletError'
import { asArray } from './utility/utilityHelpers.noBuffer'
import { ValidListOutputsArgs } from '@bsv/sdk/dist/types/src/wallet/validationHelpers'

/**
 * The preferred means of constructing a `Wallet` is with a `WalletArgs` instance.
 */
export interface WalletArgs {
  chain: Chain
  keyDeriver: KeyDeriverApi
  storage: WalletStorageManager
  services?: WalletServices
  monitor?: Monitor
  privilegedKeyManager?: PrivilegedKeyManager
  settingsManager?: WalletSettingsManager
  lookupResolver?: LookupResolver
  /**
   * Optional. Provide a function conforming to the `MakeWalletLogger` type to enable wallet request logging.
   *
   * For simple requests using `Console` may be adequate, initialize with
   * `() => Console`
   *
   * Aggregate tracing and control over capturing all logged output in one place:
   * `(log?: string | WalletLoggerInterface) => new WalletLogger(log)`
   */
  makeLogger?: MakeWalletLogger
}

function isWalletSigner(args: WalletArgs | WalletSigner): args is WalletSigner {
  return args['isWalletSigner']
}

export class Wallet implements WalletInterface, ProtoWallet {
  chain: Chain
  keyDeriver: KeyDeriverApi
  storage: WalletStorageManager
  settingsManager: WalletSettingsManager
  lookupResolver: LookupResolver

  services?: WalletServices
  monitor?: Monitor

  identityKey: string

  /**
   * The wallet creates a `BeefParty` when it is created.
   * All the Beefs that pass through the wallet are merged into this beef.
   * Thus what it contains at any time is the union of all transactions and proof data processed.
   * The class `BeefParty` derives from `Beef`, adding the ability to track the source of merged data.
   *
   * This allows it to generate beefs to send to a particular “party” (storage or the user)
   * that includes “txid only proofs” for transactions they already know about.
   * Over time, this allows an active wallet to drastically reduce the amount of data transmitted.
   */
  beef: BeefParty
  /**
   * If true, signableTransactions will include sourceTransaction for each input,
   * including those that do not require signature and those that were also contained
   * in the inputBEEF.
   */
  includeAllSourceTransactions: boolean = true
  /**
   * If true, txids that are known to the wallet's party beef do not need to be returned from storage.
   */
  autoKnownTxids: boolean = false
  /**
   * If true, beefs returned to the user may contain txidOnly transactions.
   */
  returnTxidOnly: boolean = false
  trustSelf?: TrustSelf
  userParty: string
  proto: ProtoWallet
  privilegedKeyManager?: PrivilegedKeyManager
  makeLogger?: MakeWalletLogger

  pendingSignActions: Record<string, PendingSignAction>

  /**
   * For repeatability testing, set to an array of random numbers from [0..1).
   */
  randomVals?: number[] = undefined

  constructor(
    argsOrSigner: WalletArgs | WalletSigner,
    services?: WalletServices,
    monitor?: Monitor,
    privilegedKeyManager?: PrivilegedKeyManager,
    makeLogger?: MakeWalletLogger
  ) {
    const args: WalletArgs = !isWalletSigner(argsOrSigner)
      ? argsOrSigner
      : {
          chain: argsOrSigner.chain,
          keyDeriver: argsOrSigner.keyDeriver,
          storage: argsOrSigner.storage,
          services,
          monitor,
          privilegedKeyManager,
          makeLogger
        }

    if (args.storage._authId.identityKey != args.keyDeriver.identityKey)
      throw new WERR_INVALID_PARAMETER(
        'storage',
        `authenticated as the same identityKey (${args.storage._authId.identityKey}) as the keyDeriver (${args.keyDeriver.identityKey}).`
      )

    this.settingsManager = args.settingsManager || new WalletSettingsManager(this)
    this.chain = args.chain
    this.lookupResolver =
      args.lookupResolver ||
      new LookupResolver({
        networkPreset: toLookupNetworkPreset(this.chain)
      })
    this.keyDeriver = args.keyDeriver
    this.storage = args.storage
    this.proto = new ProtoWallet(args.keyDeriver)
    this.services = args.services
    this.monitor = args.monitor
    this.privilegedKeyManager = args.privilegedKeyManager
    this.makeLogger = args.makeLogger

    this.identityKey = this.keyDeriver.identityKey

    this.pendingSignActions = {}

    this.userParty = `user ${this.getClientChangeKeyPair().publicKey}`
    this.beef = new BeefParty([this.userParty])
    this.trustSelf = 'known'

    if (this.services) {
      this.storage.setServices(this.services)
    }
  }

  async destroy(): Promise<void> {
    await this.storage.destroy()
    if (this.privilegedKeyManager) await this.privilegedKeyManager.destroyKey()
  }

  getClientChangeKeyPair(): KeyPair {
    const kp: KeyPair = {
      privateKey: this.keyDeriver.rootKey.toString(),
      publicKey: this.keyDeriver.rootKey.toPublicKey().toString()
    }
    return kp
  }

  async getIdentityKey(): Promise<PubKeyHex> {
    return (await this.getPublicKey({ identityKey: true })).publicKey
  }

  getPublicKey(
    args: GetPublicKeyArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<GetPublicKeyResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.getPublicKey(args)
    }
    return this.proto.getPublicKey(args)
  }
  revealCounterpartyKeyLinkage(
    args: RevealCounterpartyKeyLinkageArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RevealCounterpartyKeyLinkageResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.revealCounterpartyKeyLinkage(args)
    }
    return this.proto.revealCounterpartyKeyLinkage(args)
  }
  revealSpecificKeyLinkage(
    args: RevealSpecificKeyLinkageArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RevealSpecificKeyLinkageResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.revealSpecificKeyLinkage(args)
    }
    return this.proto.revealSpecificKeyLinkage(args)
  }
  encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.encrypt(args)
    }
    return this.proto.encrypt(args)
  }
  decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.decrypt(args)
    }
    return this.proto.decrypt(args)
  }
  createHmac(args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateHmacResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.createHmac(args)
    }
    return this.proto.createHmac(args)
  }
  verifyHmac(args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifyHmacResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.verifyHmac(args)
    }
    return this.proto.verifyHmac(args)
  }
  createSignature(
    args: CreateSignatureArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<CreateSignatureResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.createSignature(args)
    }
    return this.proto.createSignature(args)
  }
  verifySignature(
    args: VerifySignatureArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<VerifySignatureResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.verifySignature(args)
    }
    return this.proto.verifySignature(args)
  }

  getServices(): WalletServices {
    if (!this.services)
      throw new WERR_INVALID_PARAMETER('services', 'valid in constructor arguments to be retreived here.')
    return this.services
  }

  /**
   * @returns the full list of txids whose validity this wallet claims to know.
   *
   * @param newKnownTxids Optional. Additional new txids known to be valid by the caller to be merged.
   */
  getKnownTxids(newKnownTxids?: string[]): string[] {
    if (newKnownTxids) {
      for (const txid of newKnownTxids) this.beef.mergeTxidOnly(txid)
    }
    const r = this.beef.sortTxs()
    const knownTxids = r.valid
    return knownTxids
  }

  getStorageIdentity(): StorageIdentity {
    const s = this.storage.getSettings()
    return {
      storageIdentityKey: s.storageIdentityKey,
      storageName: s.storageName
    }
  }

  private validateAuthAndArgs<A, T extends Validation.ValidWalletSignerArgs>(
    args: A,
    validate: (args: A, logger?: WalletLoggerInterface) => T,
    logger?: WalletLoggerInterface
  ): { vargs: T; auth: AuthId } {
    const vargs = validate(args, logger)
    const auth: AuthId = { identityKey: this.identityKey }
    return { vargs, auth }
  }

  //////////////////
  // List Methods
  //////////////////

  async listActions(
    args: ListActionsArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListActionsResult> {
    Validation.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, Validation.validateListActionsArgs)
    const r = await this.storage.listActions(vargs)
    // Implement security policy to block customInstructions from output results.
    for (const action of r.actions) {
      if (action.outputs)
        for (const output of action.outputs) {
          output.customInstructions = undefined
        }
    }
    return r
  }

  get storageParty(): string {
    return `storage ${this.getStorageIdentity().storageIdentityKey}`
  }

  async listOutputs(
    args: ListOutputsArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListOutputsResult> {
    Validation.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, validateListOutputsArgs)
    if (this.autoKnownTxids && !vargs.knownTxids) {
      vargs.knownTxids = this.getKnownTxids()
    }
    const r = await this.storage.listOutputs(vargs)
    if (r.BEEF) {
      this.beef.mergeBeefFromParty(this.storageParty, asArray(r.BEEF))
      r.BEEF = this.verifyReturnedTxidOnlyBEEF(r.BEEF)
    }
    return r
  }

  async listCertificates(
    args: ListCertificatesArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListCertificatesResult> {
    Validation.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, Validation.validateListCertificatesArgs)
    const r = await this.storage.listCertificates(vargs)
    return r
  }

  //////////////////
  // Certificates
  //////////////////

  async acquireCertificate(
    args: AcquireCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AcquireCertificateResult> {
    Validation.validateOriginator(originator)
    if (args.acquisitionProtocol === 'direct') {
      const { auth, vargs } = this.validateAuthAndArgs(args, Validation.validateAcquireDirectCertificateArgs)
      vargs.subject = (
        await this.getPublicKey({
          identityKey: true,
          privileged: args.privileged,
          privilegedReason: args.privilegedReason
        })
      ).publicKey
      try {
        // Confirm that the information received adds up to a usable certificate...
        // TODO: Clean up MasterCertificate to support decrypt on instance
        const cert = new MasterCertificate(
          vargs.type,
          vargs.serialNumber,
          vargs.subject,
          vargs.certifier,
          vargs.revocationOutpoint,
          vargs.fields,
          vargs.keyringForSubject,
          vargs.signature
        )
        await cert.verify()

        // Verify certificate details
        await MasterCertificate.decryptFields(
          this,
          vargs.keyringForSubject,
          vargs.fields,
          vargs.certifier,
          vargs.privileged,
          vargs.privilegedReason
        )
      } catch (eu: unknown) {
        const e = WalletError.fromUnknown(eu)
        throw new WERR_INVALID_PARAMETER(
          'args',
          `valid encrypted and signed certificate and keyring from revealer. ${e.name}: ${e.message}`
        )
      }

      const r = await acquireDirectCertificate(this, auth, vargs)
      return r
    }

    if (args.acquisitionProtocol === 'issuance') {
      const { auth, vargs } = this.validateAuthAndArgs(args, Validation.validateAcquireIssuanceCertificateArgs)
      // Create a random nonce that the server can verify
      const clientNonce = await createNonce(this, vargs.certifier)
      // TODO: Consider adding support to request certificates from a certifier before acquiring a certificate.
      const authClient = new AuthFetch(this)

      // Create a certificate master keyring
      // The certifier is able to decrypt these fields as they are the counterparty
      const { certificateFields, masterKeyring } = await MasterCertificate.createCertificateFields(
        this,
        vargs.certifier,
        vargs.fields
      )

      // Make a Certificate Signing Request (CSR) to the certifier
      const response = await authClient.fetch(`${vargs.certifierUrl}/signCertificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientNonce,
          type: vargs.type,
          fields: certificateFields,
          masterKeyring
        })
      })

      if (response.headers.get('x-bsv-auth-identity-key') !== vargs.certifier) {
        throw new Error(
          `Invalid certifier! Expected: ${vargs.certifier}, Received: ${response.headers.get('x-bsv-auth-identity-key')}`
        )
      }

      const { certificate, serverNonce } = await response.json()

      // Validate the server response
      if (!certificate) {
        throw new Error('No certificate received from certifier!')
      }
      if (!serverNonce) {
        throw new Error('No serverNonce received from certifier!')
      }

      const signedCertificate = new Certificate(
        certificate.type,
        certificate.serialNumber,
        certificate.subject,
        certificate.certifier,
        certificate.revocationOutpoint,
        certificate.fields,
        certificate.signature
      )

      // Validate server nonce
      await verifyNonce(serverNonce, this, vargs.certifier)
      // Verify the server included our nonce
      const { valid } = await this.verifyHmac({
        hmac: Utils.toArray(signedCertificate.serialNumber, 'base64'),
        data: Utils.toArray(clientNonce + serverNonce, 'base64'),
        protocolID: [2, 'certificate issuance'],
        keyID: serverNonce + clientNonce,
        counterparty: vargs.certifier
      })
      if (!valid) throw new Error('Invalid serialNumber')

      // Validate the certificate received
      if (signedCertificate.type !== vargs.type) {
        throw new Error(`Invalid certificate type! Expected: ${vargs.type}, Received: ${signedCertificate.type}`)
      }
      if (signedCertificate.subject !== this.identityKey) {
        throw new Error(
          `Invalid certificate subject! Expected: ${this.identityKey}, Received: ${signedCertificate.subject}`
        )
      }
      if (signedCertificate.certifier !== vargs.certifier) {
        throw new Error(`Invalid certifier! Expected: ${vargs.certifier}, Received: ${signedCertificate.certifier}`)
      }
      if (!signedCertificate.revocationOutpoint) {
        throw new Error(`Invalid revocationOutpoint!`)
      }
      if (Object.keys(signedCertificate.fields).length !== Object.keys(certificateFields).length) {
        throw new Error(`Fields mismatch! Objects have different numbers of keys.`)
      }
      for (const field of Object.keys(certificateFields)) {
        if (!(field in signedCertificate.fields)) {
          throw new Error(`Missing field: ${field} in certificate.fields`)
        }
        if (signedCertificate.fields[field] !== certificateFields[field]) {
          throw new Error(
            `Invalid field! Expected: ${certificateFields[field]}, Received: ${signedCertificate.fields[field]}`
          )
        }
      }

      await signedCertificate.verify()

      // Test decryption works
      await MasterCertificate.decryptFields(this, masterKeyring, certificate.fields, vargs.certifier)

      // Store the newly issued certificate
      return await acquireDirectCertificate(this, auth, {
        ...certificate,
        keyringRevealer: 'certifier',
        keyringForSubject: masterKeyring,
        privileged: vargs.privileged
      })
    }

    throw new WERR_INVALID_PARAMETER('acquisitionProtocol', `valid.${args.acquisitionProtocol} is unrecognized.`)
  }

  async relinquishCertificate(
    args: RelinquishCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RelinquishCertificateResult> {
    Validation.validateOriginator(originator)
    this.validateAuthAndArgs(args, Validation.validateRelinquishCertificateArgs)
    const r = await this.storage.relinquishCertificate(args)
    return { relinquished: true }
  }

  async proveCertificate(
    args: ProveCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ProveCertificateResult> {
    originator = Validation.validateOriginator(originator)
    const { auth, vargs } = this.validateAuthAndArgs(args, Validation.validateProveCertificateArgs)
    const r = await proveCertificate(this, auth, vargs)
    return r
  }

  /** 2-minute cache of trust settings for identity resolution paths */
  private _trustSettingsCache?: {
    expiresAt: number
    trustSettings: Awaited<ReturnType<WalletSettingsManager['get']>>['trustSettings']
  }

  /** 2-minute cache of queryOverlay() results keyed by normalized query */
  private _overlayCache: Map<string, { expiresAt: number; value: unknown }> = new Map()

  async discoverByIdentityKey(
    args: DiscoverByIdentityKeyArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<DiscoverCertificatesResult> {
    Validation.validateOriginator(originator)
    this.validateAuthAndArgs(args, Validation.validateDiscoverByIdentityKeyArgs)

    const TTL_MS = 2 * 60 * 1000
    const now = Date.now()

    // --- trustSettings cache (2 minutes) ---
    let trustSettings =
      this._trustSettingsCache && this._trustSettingsCache.expiresAt > now
        ? this._trustSettingsCache.trustSettings
        : undefined

    if (!trustSettings) {
      const settings = await this.settingsManager.get()
      trustSettings = settings.trustSettings
      this._trustSettingsCache = { trustSettings, expiresAt: now + TTL_MS }
    }

    const certifiers = trustSettings.trustedCertifiers.map(c => c.identityKey).sort()

    // --- queryOverlay cache (2 minutes) ---
    const cacheKey = JSON.stringify({
      fn: 'discoverByIdentityKey',
      identityKey: args.identityKey,
      certifiers
    })

    let cached = this._overlayCache.get(cacheKey)
    if (!cached || cached.expiresAt <= now) {
      const value = await queryOverlay({ identityKey: args.identityKey, certifiers }, this.lookupResolver)
      cached = { value, expiresAt: now + TTL_MS }
      this._overlayCache.set(cacheKey, cached)
    }

    if (!cached.value) {
      return { totalCertificates: 0, certificates: [] }
    }

    return transformVerifiableCertificatesWithTrust(trustSettings, cached.value as any)
  }

  async discoverByAttributes(
    args: DiscoverByAttributesArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<DiscoverCertificatesResult> {
    Validation.validateOriginator(originator)
    this.validateAuthAndArgs(args, Validation.validateDiscoverByAttributesArgs)

    const TTL_MS = 2 * 60 * 1000
    const now = Date.now()

    // --- trustSettings cache (2 minutes) ---
    let trustSettings =
      this._trustSettingsCache && this._trustSettingsCache.expiresAt > now
        ? this._trustSettingsCache.trustSettings
        : undefined

    if (!trustSettings) {
      const settings = await this.settingsManager.get()
      trustSettings = settings.trustSettings
      this._trustSettingsCache = { trustSettings, expiresAt: now + TTL_MS }
    }

    const certifiers = trustSettings.trustedCertifiers.map(c => c.identityKey).sort()

    // Normalize attributes for a stable cache key.
    // If attributes is an object, sort its top-level keys; if it's an array, sort a shallow copy.
    let attributesKey: unknown = args.attributes
    if (args.attributes && typeof args.attributes === 'object') {
      const keys = Object.keys(args.attributes as Record<string, unknown>).sort()
      attributesKey = JSON.stringify(args.attributes, keys)
    }

    // --- queryOverlay cache (2 minutes) ---
    const cacheKey = JSON.stringify({
      fn: 'discoverByAttributes',
      attributes: attributesKey,
      certifiers
    })

    let cached = this._overlayCache.get(cacheKey)
    if (!cached || cached.expiresAt <= now) {
      const value = await queryOverlay({ attributes: args.attributes, certifiers }, this.lookupResolver)
      cached = { value, expiresAt: now + TTL_MS }
      this._overlayCache.set(cacheKey, cached)
    }

    if (!cached.value) {
      return { totalCertificates: 0, certificates: [] }
    }

    return transformVerifiableCertificatesWithTrust(trustSettings, cached.value as any)
  }

  verifyReturnedTxidOnly(beef: Beef, knownTxids?: string[]): Beef {
    if (this.returnTxidOnly) return beef
    const onlyTxids = beef.txs.filter(btx => btx.isTxidOnly).map(btx => btx.txid)
    for (const txid of onlyTxids) {
      if (knownTxids && knownTxids.indexOf(txid) >= 0) continue
      const btx = beef.findTxid(txid)
      const tx = this.beef.findAtomicTransaction(txid)
      if (!tx) throw new WERR_INTERNAL(`unable to merge txid ${txid} into beef`)
      beef.mergeTransaction(tx)
    }
    for (const btx of beef.txs) {
      if (knownTxids && knownTxids.indexOf(btx.txid) >= 0) continue
      if (btx.isTxidOnly) throw new WERR_INTERNAL(`remaining txidOnly ${btx.txid} is not known`)
    }
    return beef
  }

  verifyReturnedTxidOnlyAtomicBEEF(beef: AtomicBEEF, knownTxids?: string[]): AtomicBEEF {
    if (this.returnTxidOnly) return beef
    const b = Beef.fromBinary(beef)
    if (!b.atomicTxid) throw new WERR_INTERNAL()
    return this.verifyReturnedTxidOnly(b, knownTxids).toBinaryAtomic(b.atomicTxid!)
  }

  verifyReturnedTxidOnlyBEEF(beef: BEEF): BEEF {
    if (this.returnTxidOnly) return beef
    const b = Beef.fromBinary(beef)
    return this.verifyReturnedTxidOnly(b).toBinary()
  }

  logMakeLogger(method: string, args: any): WalletLoggerInterface | undefined {
    const logger = this.makeLogger?.(args['log'])
    this.logMethodStart(method, logger)
    return logger
  }

  logMethodStart(method: string, logger?: WalletLoggerInterface): void {
    logger?.group(`Wallet ${method}`)
  }

  logResult(r: any, logger?: WalletLoggerInterface): void {
    if (!logger) return
    logger.groupEnd()
    r['log'] = logger.flush?.()
  }

  logWalletError(eu: unknown, logger?: WalletLoggerInterface): void {
    if (!logger) return
    logger.error('WalletError:', WalletError.unknownToJson(eu))
    logger.flush?.()
  }

  //////////////////
  // Actions
  //////////////////

  async createAction(
    args: CreateActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<CreateActionResult> {
    const logger = this.logMakeLogger(`createAction`, args)
    try {
      Validation.validateOriginator(originator)

      if (!args.options) args.options = {}
      args.options.trustSelf ||= this.trustSelf
      if (this.autoKnownTxids && !args.options.knownTxids) {
        args.options.knownTxids = this.getKnownTxids(args.options.knownTxids)
      }

      const { auth, vargs } = this.validateAuthAndArgs(args, Validation.validateCreateActionArgs, logger)
      logger?.log('validated args')

      vargs.includeAllSourceTransactions = this.includeAllSourceTransactions
      if (this.randomVals && this.randomVals.length > 1) {
        vargs.randomVals = [...this.randomVals]
      }

      const r = await createAction(this, auth, vargs)
      logger?.log('action created')

      if (r.tx) {
        this.beef.mergeBeefFromParty(this.storageParty, asArray(r.tx))
      }

      if (r.tx) {
        r.tx = this.verifyReturnedTxidOnlyAtomicBEEF(r.tx, args.options?.knownTxids)
        logger?.log('verify returned AtomicBEEF')
      }

      if (!vargs.isDelayed) throwIfAnyUnsuccessfulCreateActions(r)

      this.logResult(r, logger)
      return r
    } catch (eu: unknown) {
      this.logWalletError(eu, logger)
      throw eu
    }
  }

  async signAction(
    args: SignActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<SignActionResult> {
    Validation.validateOriginator(originator)

    const { auth, vargs } = this.validateAuthAndArgs(args, Validation.validateSignActionArgs)
    // createAction options are merged with undefined signAction options before validation...
    const r = await signAction(this, auth, args)

    if (!vargs.isDelayed) throwIfAnyUnsuccessfulSignActions(r)

    const prior = this.pendingSignActions[args.reference]
    if (!prior)
      throw new WERR_NOT_IMPLEMENTED('recovery of out-of-session signAction reference data is not yet implemented.')
    if (r.tx) r.tx = this.verifyReturnedTxidOnlyAtomicBEEF(r.tx, prior.args.options?.knownTxids)

    return r
  }

  async internalizeAction(
    args: InternalizeActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<InternalizeActionResult> {
    Validation.validateOriginator(originator)
    const { auth, vargs } = this.validateAuthAndArgs(args, Validation.validateInternalizeActionArgs)

    if (vargs.labels.indexOf(specOpThrowReviewActions) >= 0) throwDummyReviewActions()

    const r = await internalizeAction(this, auth, args)

    throwIfUnsuccessfulInternalizeAction(r)

    return r
  }

  async abortAction(
    args: AbortActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AbortActionResult> {
    Validation.validateOriginator(originator)

    const { auth } = this.validateAuthAndArgs(args, Validation.validateAbortActionArgs)
    const r = await this.storage.abortAction(args)
    return r
  }

  async relinquishOutput(
    args: RelinquishOutputArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RelinquishOutputResult> {
    Validation.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, Validation.validateRelinquishOutputArgs)
    const r = await this.storage.relinquishOutput(args)
    return { relinquished: true }
  }

  async isAuthenticated(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> {
    Validation.validateOriginator(originator)
    const r: { authenticated: true } = {
      authenticated: true
    }
    return r
  }

  async waitForAuthentication(
    args: {},
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AuthenticatedResult> {
    Validation.validateOriginator(originator)
    return { authenticated: true }
  }

  async getHeight(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> {
    Validation.validateOriginator(originator)
    const height = await this.getServices().getHeight()
    return { height }
  }

  async getHeaderForHeight(
    args: GetHeaderArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<GetHeaderResult> {
    Validation.validateOriginator(originator)
    const serializedHeader = await this.getServices().getHeaderForHeight(args.height)
    return { header: Utils.toHex(serializedHeader) }
  }

  async getNetwork(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> {
    Validation.validateOriginator(originator)
    return { network: toWalletNetwork(this.chain) }
  }

  async getVersion(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> {
    Validation.validateOriginator(originator)
    return { version: 'wallet-brc100-1.0.0' }
  }

  /**
   * Transfer all possible satoshis held by this wallet to `toWallet`.
   *
   * @param toWallet wallet which will receive this wallet's satoshis.
   */
  async sweepTo(toWallet: Wallet): Promise<void> {
    const derivationPrefix = randomBytesBase64(8)
    const derivationSuffix = randomBytesBase64(8)
    const keyDeriver = this.keyDeriver

    const t = new ScriptTemplateBRC29({
      derivationPrefix,
      derivationSuffix,
      keyDeriver
    })

    const label = 'sweep'

    const satoshis = maxPossibleSatoshis

    const car = await this.createAction({
      outputs: [
        {
          lockingScript: t.lock(keyDeriver.rootKey.toString(), toWallet.identityKey).toHex(),
          satoshis,
          outputDescription: label,
          tags: ['relinquish'],
          customInstructions: JSON.stringify({
            derivationPrefix,
            derivationSuffix,
            type: 'BRC29'
          })
        }
      ],
      options: {
        randomizeOutputs: false,
        acceptDelayedBroadcast: false
      },
      labels: [label],
      description: label
    })

    const iar = await toWallet.internalizeAction({
      tx: car.tx!,
      outputs: [
        {
          outputIndex: 0,
          protocol: 'wallet payment',
          paymentRemittance: {
            derivationPrefix,
            derivationSuffix,
            senderIdentityKey: this.identityKey
          }
        }
      ],
      description: label,
      labels: [label]
    })
  }

  /**
   * Uses `listOutputs` to iterate over chunks of up to 1000 outputs to
   * compute the sum of output satoshis.
   *
   * @param {string} basket - Optional. Defaults to 'default', the wallet change basket.
   * @returns {WalletBalance} total sum of output satoshis and utxo details (satoshis and outpoints)
   */
  async balanceAndUtxos(basket: string = 'default'): Promise<WalletBalance> {
    const r: WalletBalance = { total: 0, utxos: [] }
    let offset = 0
    for (;;) {
      const change = await this.listOutputs({
        basket,
        limit: 1000,
        offset
      })
      if (change.totalOutputs === 0) break
      for (const o of change.outputs) {
        r.total += o.satoshis
        r.utxos.push({ satoshis: o.satoshis, outpoint: o.outpoint })
      }
      offset += change.outputs.length
    }
    return r
  }

  /**
   * Uses `listOutputs` special operation to compute the total value (of satoshis) for
   * all spendable outputs in the 'default' basket.
   *
   * @returns {number} sum of output satoshis
   */
  async balance(args?: ListOutputsArgs): Promise<number> {
    args ||= { basket: specOpWalletBalance }
    if (args.basket !== specOpWalletBalance) {
      args.tags = [...(args.tags || []), specOpWalletBalance]
    }
    const r = await this.listOutputs(args)
    return r.totalOutputs
  }

  /**
   * Uses `listOutputs` special operation to review the spendability via `Services` of
   * outputs currently considered spendable. Returns the outputs that fail to verify.
   *
   * Ignores the `limit` and `offset` properties.
   *
   * @param all Defaults to false. If false, only change outputs ('default' basket) are reviewed. If true, all spendable outputs are reviewed.
   * @param release Defaults to false. If true, sets outputs that fail to verify to un-spendable (spendable: false)
   * @param optionalArgs Optional. Additional tags will constrain the outputs processed.
   * @returns outputs which are/where considered spendable but currently fail to verify as spendable.
   */
  async reviewSpendableOutputs(
    all = false,
    release = false,
    optionalArgs?: Partial<ListOutputsArgs>
  ): Promise<ListOutputsResult> {
    const args: ListOutputsArgs = {
      ...(optionalArgs || {}),
      basket: specOpInvalidChange
    }
    args.tags ||= []
    if (all) args.tags.push('all')
    if (release) args.tags.push('release')
    const r = await this.listOutputs(args)
    return r
  }

  /**
   * Uses `listOutputs` special operation to update the 'default' basket's automatic
   * change generation parameters.
   *
   * @param count target number of change UTXOs to maintain.
   * @param satoshis target value for new change outputs.
   */
  async setWalletChangeParams(count: number, satoshis: number): Promise<void> {
    const args: ListOutputsArgs = {
      basket: specOpSetWalletChangeParams,
      tags: [count.toString(), satoshis.toString()]
    }
    await this.listOutputs(args)
  }

  /**
   * Uses `listActions` special operation to return only actions with status 'nosend'.
   *
   * @param abort Defaults to false. If true, runs `abortAction` on each 'nosend' action.
   * @returns {ListActionsResult} start `listActions` result restricted to 'nosend' (or 'failed' if aborted) actions.
   */
  async listNoSendActions(args: ListActionsArgs, abort = false): Promise<ListActionsResult> {
    const { vargs } = this.validateAuthAndArgs(args, Validation.validateListActionsArgs)
    vargs.labels.push(specOpNoSendActions)
    if (abort) vargs.labels.push('abort')
    const r = await this.storage.listActions(vargs)
    return r
  }

  /**
   * Uses `listActions` special operation to return only actions with status 'failed'.
   *
   * @param unfail Defaults to false. If true, queues the action for attempted recovery.
   * @returns {ListActionsResult} start `listActions` result restricted to 'failed' status actions.
   */
  async listFailedActions(args: ListActionsArgs, unfail = false): Promise<ListActionsResult> {
    const { vargs } = this.validateAuthAndArgs(args, Validation.validateListActionsArgs)
    vargs.labels.push(specOpFailedActions)
    if (unfail) vargs.labels.push('unfail')
    const r = await this.storage.listActions(vargs)
    return r
  }
}

export interface PendingStorageInput {
  vin: number
  derivationPrefix: string
  derivationSuffix: string
  unlockerPubKey?: string
  sourceSatoshis: number
  lockingScript: string
}

export interface PendingSignAction {
  reference: string
  dcr: StorageCreateActionResult
  args: Validation.ValidCreateActionArgs
  tx: BsvTransaction
  amount: number
  pdi: PendingStorageInput[]
}

function throwIfAnyUnsuccessfulCreateActions(r: CreateActionResultX) {
  const ndrs = r.notDelayedResults
  const swrs = r.sendWithResults

  if (!ndrs || !swrs || swrs.every(r => r.status === 'unproven')) return

  throw new WERR_REVIEW_ACTIONS(ndrs, swrs, r.txid, r.tx, r.noSendChange)
}

function throwIfAnyUnsuccessfulSignActions(r: SignActionResultX) {
  const ndrs = r.notDelayedResults
  const swrs = r.sendWithResults

  if (!ndrs || !swrs || swrs.every(r => r.status === 'unproven')) return

  throw new WERR_REVIEW_ACTIONS(ndrs, swrs, r.txid, r.tx)
}

function throwIfUnsuccessfulInternalizeAction(r: StorageInternalizeActionResult) {
  const ndrs = r.notDelayedResults
  const swrs = r.sendWithResults

  if (!ndrs || !swrs || swrs.every(r => r.status === 'unproven')) return

  throw new WERR_REVIEW_ACTIONS(ndrs, swrs, r.txid)
}

/**
 * Throws a WERR_REVIEW_ACTIONS with a full set of properties to test data formats and propagation.
 */
export function throwDummyReviewActions() {
  const b58Beef =
    'gno9MC7VXii1KoCkc2nsVyYJpqzN3dhBzYATETJcys62emMKfpBof4R7GozwYEaSapUtnNvqQ57aaYYjm3U2dv9eUJ1sV46boHkQgppYmAz9YH8FdZduV8aJayPViaKcyPmbDhEw6UW8TM5iFZLXNs7HBnJHUKCeTdNK4FUEL7vAugxAV9WUUZ43BZjJk2SmSeps9TCXjt1Ci9fKWp3d9QSoYvTpxwzyUFHjRKtbUgwq55ZfkBp5bV2Bpz9qSuKywKewW7Hh4S1nCUScwwzpKDozb3zic1V9p2k8rQxoPsRxjUJ8bjhNDdsN8d7KukFuc3n47fXzdWttvnxwsujLJRGnQbgJuknQqx3KLf5kJXHzwjG6TzigZk2t24qeB6d3hbYiaDr2fFkUJBL3tukTHhfNkQYRXuz3kucVDzvejHyqJaF51mXG8BjMN5aQj91ZJXCaPVqkMWCzmvyaqmXMdRiJdSAynhXbQK91xf6RwdNhz1tg5f9B6oJJMhsi9UYSVymmax8VLKD9AKzBCBDcfyD83m3jyS1VgKGZn3SkQmr6bsoWq88L3GsMnnmYUGogvdAYarTqg3pzkjCMxHzmJBMN6ofnUk8c1sRTXQue7BbyUaN5uZu3KW6CmFsEfpuqVvnqFW93TU1jrPP2S8yz8AexAnARPCKE8Yz7RfVaT6RCavwQKL3u5iookwRWEZXW1QWmM37yJWHD87SjVynyg327a1CLwcBxmE2CB48QeNVGyQki4CTQMqw2o8TMhDPJej1g68oniAjBcxBLSCs7KGvK3k7AfrHbCMULX9CTibYhCjdFjbsbBoocqJpxxcvkMo1fEEiAzZuiBVZQDYktDdTVbhKHvYkW25HcYX75NJrpNAhm7AjFeKLzEVxqAQkMfvTufpESNRZF4kQqg2Rg8h2ajcKTd5cpEPwXCrZLHm4EaZEmZVbg3QNfGhn7BJu1bHMtLqPD4y8eJxm2uGrW6saf6qKYmmu64F8A667NbD4yskPRQ1S863VzwGpxxmgLc1Ta3R46jEqsAoRDoZVUaCgBBZG3Yg1CTgi1EVBMXU7qvY4n3h8o2FLCEMWY4KadnV3iD4FbcdCmg4yxBosNAZgbPjhgGjCimjh4YsLd9zymGLmivmz2ZBg5m3xaiXT9NN81X9C1JUujd'
  const beef = Beef.fromBinary(Utils.fromBase58(b58Beef))
  const btx = beef.txs.slice(-1)[0]
  const txid = btx.txid

  console.log('Throwing dummy WERR_REVIEW_ACTIONS')

  throw new WERR_REVIEW_ACTIONS(
    [
      {
        txid, // only care that it is syntactically a txid
        status: 'doubleSpend',
        competingTxs: [txid], // a txid in the beef
        competingBeef: beef.toBinary()
      }
    ],
    [
      {
        txid,
        status: 'failed'
      }
    ],
    txid,
    beef.toBinaryAtomic(txid),
    [`${txid}.0`]
  )
}

/**
 * Implement BRC-112
 * @param vargs
 * @returns
 */
function validateListOutputsArgs(args: ListOutputsArgs): ValidListOutputsArgs {
  const vargs = Validation.validateListOutputsArgs(args)
  const balancePrefix = 'balance '
  if (vargs.basket.startsWith(balancePrefix)) {
    vargs.basket = vargs.basket.slice(balancePrefix.length)
    vargs.tags = [...vargs.tags, specOpWalletBalance]
  }
  return vargs
}
