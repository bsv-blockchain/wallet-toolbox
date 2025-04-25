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
  KeyDeriver,
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
  BEEF
} from '@bsv/sdk'
import * as sdk from './sdk'
import { acquireDirectCertificate } from './signer/methods/acquireDirectCertificate'
import { proveCertificate } from './signer/methods/proveCertificate'
import { createAction, CreateActionResultX } from './signer/methods/createAction'
import { signAction, SignActionResultX } from './signer/methods/signAction'
import { internalizeAction } from './signer/methods/internalizeAction'
import { WalletSettingsManager } from './WalletSettingsManager'
import { queryOverlay, transformVerifiableCertificatesWithTrust } from './utility/identityUtils'
import { maxPossibleSatoshis } from './storage/methods/generateChange'
import {
  specOpFailedActions,
  specOpInvalidChange,
  specOpNoSendActions,
  specOpSetWalletChangeParams,
  specOpThrowReviewActions,
  specOpWalletBalance
} from './sdk'
import { WalletStorageManager } from './storage/WalletStorageManager'
import { Monitor } from './monitor/Monitor'
import { WalletSigner } from './signer/WalletSigner'
import { randomBytesBase64, toWalletNetwork } from './utility/utilityHelpers'
import { ScriptTemplateBRC29 } from './utility/ScriptTemplateBRC29'

export interface WalletArgs {
  chain: sdk.Chain
  keyDeriver: KeyDeriver
  storage: WalletStorageManager
  services?: sdk.WalletServices
  monitor?: Monitor
  privilegedKeyManager?: sdk.PrivilegedKeyManager
  settingsManager?: WalletSettingsManager
  lookupResolver?: LookupResolver
}

function isWalletSigner(args: WalletArgs | WalletSigner): args is WalletSigner {
  return args['isWalletSigner']
}

export class Wallet implements WalletInterface, ProtoWallet {
  chain: sdk.Chain
  keyDeriver: KeyDeriver
  storage: WalletStorageManager
  settingsManager: WalletSettingsManager
  lookupResolver: LookupResolver

  services?: sdk.WalletServices
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
  privilegedKeyManager?: sdk.PrivilegedKeyManager

  pendingSignActions: Record<string, PendingSignAction>

  /**
   * For repeatability testing, set to an array of random numbers from [0..1).
   */
  randomVals?: number[] = undefined

  constructor(
    argsOrSigner: WalletArgs | WalletSigner,
    services?: sdk.WalletServices,
    monitor?: Monitor,
    privilegedKeyManager?: sdk.PrivilegedKeyManager
  ) {
    const args: WalletArgs = !isWalletSigner(argsOrSigner)
      ? argsOrSigner
      : {
          chain: argsOrSigner.chain,
          keyDeriver: argsOrSigner.keyDeriver,
          storage: argsOrSigner.storage,
          services,
          monitor,
          privilegedKeyManager
        }

    if (args.storage._authId.identityKey != args.keyDeriver.identityKey)
      throw new sdk.WERR_INVALID_PARAMETER(
        'storage',
        `authenticated as the same identityKey (${args.storage._authId.identityKey}) as the keyDeriver (${args.keyDeriver.identityKey}).`
      )

    this.settingsManager = args.settingsManager || new WalletSettingsManager(this)
    this.chain = args.chain
    this.lookupResolver =
      args.lookupResolver ||
      new LookupResolver({
        networkPreset: toWalletNetwork(this.chain)
      })
    this.keyDeriver = args.keyDeriver
    this.storage = args.storage
    this.proto = new ProtoWallet(args.keyDeriver)
    this.services = args.services
    this.monitor = args.monitor
    this.privilegedKeyManager = args.privilegedKeyManager

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

  getClientChangeKeyPair(): sdk.KeyPair {
    const kp: sdk.KeyPair = {
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

  getServices(): sdk.WalletServices {
    if (!this.services)
      throw new sdk.WERR_INVALID_PARAMETER('services', 'valid in constructor arguments to be retreived here.')
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

  getStorageIdentity(): sdk.StorageIdentity {
    const s = this.storage.getSettings()
    return {
      storageIdentityKey: s.storageIdentityKey,
      storageName: s.storageName
    }
  }

  private validateAuthAndArgs<A, T extends sdk.ValidWalletSignerArgs>(
    args: A,
    validate: (args: A) => T
  ): { vargs: T; auth: sdk.AuthId } {
    const vargs = validate(args)
    const auth: sdk.AuthId = { identityKey: this.identityKey }
    return { vargs, auth }
  }

  //////////////////
  // List Methods
  //////////////////

  async listActions(
    args: ListActionsArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListActionsResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListActionsArgs)
    const r = await this.storage.listActions(vargs)
    return r
  }

  get storageParty(): string {
    return `storage ${this.getStorageIdentity().storageIdentityKey}`
  }

  async listOutputs(
    args: ListOutputsArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListOutputsResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListOutputsArgs)
    if (this.autoKnownTxids && !vargs.knownTxids) {
      vargs.knownTxids = this.getKnownTxids()
    }
    const r = await this.storage.listOutputs(vargs)
    if (r.BEEF) {
      this.beef.mergeBeefFromParty(this.storageParty, r.BEEF)
      r.BEEF = this.verifyReturnedTxidOnlyBEEF(r.BEEF)
    }
    return r
  }

  async listCertificates(
    args: ListCertificatesArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ListCertificatesResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListCertificatesArgs)
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
    sdk.validateOriginator(originator)
    if (args.acquisitionProtocol === 'direct') {
      const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateAcquireDirectCertificateArgs)
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
        const e = sdk.WalletError.fromUnknown(eu)
        throw new sdk.WERR_INVALID_PARAMETER(
          'args',
          `valid encrypted and signed certificate and keyring from revealer. ${e.name}: ${e.message}`
        )
      }

      const r = await acquireDirectCertificate(this, auth, vargs)
      return r
    }

    if (args.acquisitionProtocol === 'issuance') {
      const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateAcquireIssuanceCertificateArgs)
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

    throw new sdk.WERR_INVALID_PARAMETER('acquisitionProtocol', `valid.${args.acquisitionProtocol} is unrecognized.`)
  }

  async relinquishCertificate(
    args: RelinquishCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RelinquishCertificateResult> {
    sdk.validateOriginator(originator)
    this.validateAuthAndArgs(args, sdk.validateRelinquishCertificateArgs)
    const r = await this.storage.relinquishCertificate(args)
    return { relinquished: true }
  }

  async proveCertificate(
    args: ProveCertificateArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<ProveCertificateResult> {
    originator = sdk.validateOriginator(originator)
    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateProveCertificateArgs)
    const r = await proveCertificate(this, auth, vargs)
    return r
  }

  async discoverByIdentityKey(
    args: DiscoverByIdentityKeyArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<DiscoverCertificatesResult> {
    sdk.validateOriginator(originator)
    this.validateAuthAndArgs(args, sdk.validateDiscoverByIdentityKeyArgs)

    const trustSettings = (await this.settingsManager.get()).trustSettings
    const results = await queryOverlay(
      {
        identityKey: args.identityKey,
        certifiers: trustSettings.trustedCertifiers.map(certifier => certifier.identityKey)
      },
      this.lookupResolver
    )
    if (!results) {
      return {
        totalCertificates: 0,
        certificates: []
      }
    }
    return transformVerifiableCertificatesWithTrust(trustSettings, results)
  }

  async discoverByAttributes(
    args: DiscoverByAttributesArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<DiscoverCertificatesResult> {
    sdk.validateOriginator(originator)
    this.validateAuthAndArgs(args, sdk.validateDiscoverByAttributesArgs)

    const trustSettings = (await this.settingsManager.get()).trustSettings
    const results = await queryOverlay(
      {
        attributes: args.attributes,
        certifiers: trustSettings.trustedCertifiers.map(certifier => certifier.identityKey)
      },
      this.lookupResolver
    )
    if (!results) {
      return {
        totalCertificates: 0,
        certificates: []
      }
    }
    return transformVerifiableCertificatesWithTrust(trustSettings, results)
  }

  verifyReturnedTxidOnly(beef: Beef, knownTxids?: string[]): Beef {
    if (this.returnTxidOnly) return beef
    const onlyTxids = beef.txs.filter(btx => btx.isTxidOnly).map(btx => btx.txid)
    for (const txid of onlyTxids) {
      if (knownTxids && knownTxids.indexOf(txid) >= 0) continue;
      const btx = beef.findTxid(txid)
      const tx = this.beef.findAtomicTransaction(txid)
      if (!tx) throw new sdk.WERR_INTERNAL(`unable to merge txid ${txid} into beef`)
      beef.mergeTransaction(tx)
    }
    for (const btx of beef.txs) {
      if (knownTxids && knownTxids.indexOf(btx.txid) >= 0) continue;
      if (btx.isTxidOnly) throw new sdk.WERR_INTERNAL(`remaining txidOnly ${btx.txid} is not known`)
    }
    return beef
  }

  verifyReturnedTxidOnlyAtomicBEEF(beef: AtomicBEEF, knownTxids?: string[]): AtomicBEEF {
    if (this.returnTxidOnly) return beef
    const b = Beef.fromBinary(beef)
    if (!b.atomicTxid) throw new sdk.WERR_INTERNAL()
    return this.verifyReturnedTxidOnly(b, knownTxids).toBinaryAtomic(b.atomicTxid!)
  }

  verifyReturnedTxidOnlyBEEF(beef: BEEF): BEEF {
    if (this.returnTxidOnly) return beef
    const b = Beef.fromBinary(beef)
    return this.verifyReturnedTxidOnly(b).toBinary()
  }

  //////////////////
  // Actions
  //////////////////

  async createAction(
    args: CreateActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<CreateActionResult> {
    sdk.validateOriginator(originator)

    if (!args.options) args.options = {}
    args.options.trustSelf ||= this.trustSelf
    if (this.autoKnownTxids && !args.options.knownTxids) {
      args.options.knownTxids = this.getKnownTxids(args.options.knownTxids)
    }

    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateCreateActionArgs)

    if (vargs.labels.indexOf(specOpThrowReviewActions) >= 0) throwDummyReviewActions()

    vargs.includeAllSourceTransactions = this.includeAllSourceTransactions
    if (this.randomVals && this.randomVals.length > 1) {
      vargs.randomVals = [...this.randomVals]
    }

    const r = await createAction(this, auth, vargs)

    if (r.tx) {
      this.beef.mergeBeefFromParty(this.storageParty, r.tx)
    }

    if (r.tx) r.tx = this.verifyReturnedTxidOnlyAtomicBEEF(r.tx, args.options?.knownTxids)

    if (!vargs.isDelayed) throwIfAnyUnsuccessfulCreateActions(r)

    return r
  }

  async signAction(
    args: SignActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<SignActionResult> {
    sdk.validateOriginator(originator)

    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateSignActionArgs)
    // createAction options are merged with undefined signAction options before validation...
    const r = await signAction(this, auth, args)

    if (!vargs.isDelayed) throwIfAnyUnsuccessfulSignActions(r)

    const prior = this.pendingSignActions[args.reference]
    if (r.tx) r.tx = this.verifyReturnedTxidOnlyAtomicBEEF(r.tx, prior.args.options?.knownTxids)

    return r
  }

  async abortAction(
    args: AbortActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AbortActionResult> {
    sdk.validateOriginator(originator)

    const { auth } = this.validateAuthAndArgs(args, sdk.validateAbortActionArgs)
    const r = await this.storage.abortAction(args)
    return r
  }

  async internalizeAction(
    args: InternalizeActionArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<InternalizeActionResult> {
    sdk.validateOriginator(originator)
    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateInternalizeActionArgs)
    const r = await internalizeAction(this, auth, args)
    return r
  }

  async relinquishOutput(
    args: RelinquishOutputArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<RelinquishOutputResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateRelinquishOutputArgs)
    const r = await this.storage.relinquishOutput(args)
    return { relinquished: true }
  }

  async isAuthenticated(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<AuthenticatedResult> {
    sdk.validateOriginator(originator)
    const r: { authenticated: true } = {
      authenticated: true
    }
    return r
  }

  async waitForAuthentication(
    args: {},
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<AuthenticatedResult> {
    sdk.validateOriginator(originator)
    return { authenticated: true }
  }

  async getHeight(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetHeightResult> {
    sdk.validateOriginator(originator)
    const height = await this.getServices().getHeight()
    return { height }
  }

  async getHeaderForHeight(
    args: GetHeaderArgs,
    originator?: OriginatorDomainNameStringUnder250Bytes
  ): Promise<GetHeaderResult> {
    sdk.validateOriginator(originator)
    const serializedHeader = await this.getServices().getHeaderForHeight(args.height)
    return { header: Utils.toHex(serializedHeader) }
  }

  async getNetwork(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetNetworkResult> {
    sdk.validateOriginator(originator)
    return { network: toWalletNetwork(this.chain) }
  }

  async getVersion(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetVersionResult> {
    sdk.validateOriginator(originator)
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
   * @returns {sdk.WalletBalance} total sum of output satoshis and utxo details (satoshis and outpoints)
   */
  async balanceAndUtxos(basket: string = 'default'): Promise<sdk.WalletBalance> {
    const r: sdk.WalletBalance = { total: 0, utxos: [] }
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
  async balance(): Promise<number> {
    const args: ListOutputsArgs = {
      basket: specOpWalletBalance
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
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListActionsArgs)
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
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListActionsArgs)
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
  dcr: sdk.StorageCreateActionResult
  args: sdk.ValidCreateActionArgs
  tx: BsvTransaction
  amount: number
  pdi: PendingStorageInput[]
}

function throwIfAnyUnsuccessfulCreateActions(r: CreateActionResultX) {
  const ndrs = r.notDelayedResults
  const swrs = r.sendWithResults

  if (!ndrs || !swrs || swrs.every(r => r.status === 'unproven')) return

  throw new sdk.WERR_REVIEW_ACTIONS(ndrs, swrs, r.txid, r.tx, r.noSendChange)
}

function throwIfAnyUnsuccessfulSignActions(r: SignActionResultX) {
  const ndrs = r.notDelayedResults
  const swrs = r.sendWithResults

  if (!ndrs || !swrs || swrs.every(r => r.status === 'unproven')) return

  throw new sdk.WERR_REVIEW_ACTIONS(ndrs, swrs, r.txid, r.tx)
}

/**
 * Throws a WERR_REVIEW_ACTIONS with a full set of properties to test data formats and propagation.
 */
function throwDummyReviewActions() {
  const b58Beef =
    'gno9MC7VXii1KoCkc2nsVyYJpqzN3dhBzYATETJcys62emMKfpBof4R7GozwYEaSapUtnNvqQ57aaYYjm3U2dv9eUJ1sV46boHkQgppYmAz9YH8FdZduV8aJayPViaKcyPmbDhEw6UW8TM5iFZLXNs7HBnJHUKCeTdNK4FUEL7vAugxAV9WUUZ43BZjJk2SmSeps9TCXjt1Ci9fKWp3d9QSoYvTpxwzyUFHjRKtbUgwq55ZfkBp5bV2Bpz9qSuKywKewW7Hh4S1nCUScwwzpKDozb3zic1V9p2k8rQxoPsRxjUJ8bjhNDdsN8d7KukFuc3n47fXzdWttvnxwsujLJRGnQbgJuknQqx3KLf5kJXHzwjG6TzigZk2t24qeB6d3hbYiaDr2fFkUJBL3tukTHhfNkQYRXuz3kucVDzvejHyqJaF51mXG8BjMN5aQj91ZJXCaPVqkMWCzmvyaqmXMdRiJdSAynhXbQK91xf6RwdNhz1tg5f9B6oJJMhsi9UYSVymmax8VLKD9AKzBCBDcfyD83m3jyS1VgKGZn3SkQmr6bsoWq88L3GsMnnmYUGogvdAYarTqg3pzkjCMxHzmJBMN6ofnUk8c1sRTXQue7BbyUaN5uZu3KW6CmFsEfpuqVvnqFW93TU1jrPP2S8yz8AexAnARPCKE8Yz7RfVaT6RCavwQKL3u5iookwRWEZXW1QWmM37yJWHD87SjVynyg327a1CLwcBxmE2CB48QeNVGyQki4CTQMqw2o8TMhDPJej1g68oniAjBcxBLSCs7KGvK3k7AfrHbCMULX9CTibYhCjdFjbsbBoocqJpxxcvkMo1fEEiAzZuiBVZQDYktDdTVbhKHvYkW25HcYX75NJrpNAhm7AjFeKLzEVxqAQkMfvTufpESNRZF4kQqg2Rg8h2ajcKTd5cpEPwXCrZLHm4EaZEmZVbg3QNfGhn7BJu1bHMtLqPD4y8eJxm2uGrW6saf6qKYmmu64F8A667NbD4yskPRQ1S863VzwGpxxmgLc1Ta3R46jEqsAoRDoZVUaCgBBZG3Yg1CTgi1EVBMXU7qvY4n3h8o2FLCEMWY4KadnV3iD4FbcdCmg4yxBosNAZgbPjhgGjCimjh4YsLd9zymGLmivmz2ZBg5m3xaiXT9NN81X9C1JUujd'
  const beef = Beef.fromBinary(Utils.fromBase58(b58Beef))
  const btx = beef.txs.slice(-1)[0]
  const txid = btx.txid
  debugger
  throw new sdk.WERR_REVIEW_ACTIONS(
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
