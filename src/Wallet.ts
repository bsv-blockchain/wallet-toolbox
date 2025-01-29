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
  Certificate
} from "@bsv/sdk";
import { sdk, toWalletNetwork, Monitor, WalletStorageManager, WalletSigner } from './index.client'
import { acquireDirectCertificate } from "./signer/methods/acquireDirectCertificate";
import { proveCertificate } from "./signer/methods/proveCertificate";
import { createAction } from "./signer/methods/createAction";
import { signAction } from "./signer/methods/signAction";
import { internalizeAction } from "./signer/methods/internalizeAction";
import { ValidAcquireDirectCertificateArgs } from "./sdk";

export interface WalletArgs {
  chain: sdk.Chain
  keyDeriver: KeyDeriver
  storage: WalletStorageManager
  services?: sdk.WalletServices
  monitor?: Monitor
  privilegedKeyManager?: sdk.PrivilegedKeyManager
}

function isWalletSigner(args: WalletArgs | WalletSigner): args is WalletSigner {
  return args["isWalletSigner"]
}

export class Wallet implements WalletInterface {
  chain: sdk.Chain
  keyDeriver: KeyDeriver
  storage: WalletStorageManager

  services?: sdk.WalletServices
  monitor?: Monitor

  identityKey: string

  beef: BeefParty
  trustSelf?: TrustSelf
  userParty: string
  proto: ProtoWallet
  privilegedKeyManager?: sdk.PrivilegedKeyManager

  pendingSignActions: Record<string, PendingSignAction>

  constructor(argsOrSigner: WalletArgs | WalletSigner, services?: sdk.WalletServices, monitor?: Monitor, privilegedKeyManager?: sdk.PrivilegedKeyManager) {
    const args: WalletArgs = !isWalletSigner(argsOrSigner) ? argsOrSigner : {
      chain: argsOrSigner.chain,
      keyDeriver: argsOrSigner.keyDeriver,
      storage: argsOrSigner.storage,
      services,
      monitor,
      privilegedKeyManager
    }

    if (args.storage._authId.identityKey != args.keyDeriver.identityKey)
      throw new sdk.WERR_INVALID_PARAMETER('storage', `authenticated as the same identityKey (${args.storage._authId.identityKey}) as the keyDeriver (${args.keyDeriver.identityKey}).`);

    this.chain = args.chain
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

  getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<GetPublicKeyResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.getPublicKey(args)
    }
    return this.proto.getPublicKey(args)
  }
  revealCounterpartyKeyLinkage(args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealCounterpartyKeyLinkageResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.revealCounterpartyKeyLinkage(args)
    }
    return this.proto.revealCounterpartyKeyLinkage(args)
  }
  revealSpecificKeyLinkage(args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealSpecificKeyLinkageResult> {
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
  createSignature(args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateSignatureResult> {
    if (args.privileged) {
      if (!this.privilegedKeyManager) {
        throw new Error('Privileged operations require the Wallet to be configured with a privileged key manager.')
      }
      return this.privilegedKeyManager.createSignature(args)
    }
    return this.proto.createSignature(args)
  }
  verifySignature(args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifySignatureResult> {
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
    return { storageIdentityKey: s.storageIdentityKey, storageName: s.storageName }
  }

  private validateAuthAndArgs<A, T extends sdk.ValidWalletSignerArgs>(args: A, validate: (args: A) => T): { vargs: T, auth: sdk.AuthId } {
    const vargs = validate(args)
    const auth: sdk.AuthId = { identityKey: this.identityKey }
    return { vargs, auth }
  }

  //////////////////
  // List Methods
  //////////////////

  async listActions(args: ListActionsArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<ListActionsResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListActionsArgs)
    const r = await this.storage.listActions(vargs)
    return r
  }

  get storageParty(): string { return `storage ${this.getStorageIdentity().storageIdentityKey}` }

  async listOutputs(args: ListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<ListOutputsResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListOutputsArgs)
    vargs.knownTxids = this.getKnownTxids()
    const r = await this.storage.listOutputs(vargs)
    if (r.BEEF) {
      this.beef.mergeBeefFromParty(this.storageParty, r.BEEF)
    }
    return r
  }

  async listCertificates(args: ListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<ListCertificatesResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateListCertificatesArgs)
    const r = await this.storage.listCertificates(vargs)
    return r
  }

  //////////////////
  // Certificates
  //////////////////

  async acquireCertificate(args: AcquireCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<AcquireCertificateResult> {
    sdk.validateOriginator(originator)
    if (args.acquisitionProtocol === 'direct') {
      const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateAcquireDirectCertificateArgs)
      vargs.subject = (await this.getPublicKey({ identityKey: true, privileged: args.privileged, privilegedReason: args.privilegedReason })).publicKey
      try {
        // Confirm that the information received adds up to a usable certificate...
        await sdk.CertOps.fromCounterparty(vargs.privileged ? this.privilegedKeyManager! : this, {
          certificate: { ...vargs },
          keyring: vargs.keyringForSubject,
          counterparty: vargs.keyringRevealer === 'certifier' ? vargs.certifier : vargs.keyringRevealer
        })
      } catch (eu: unknown) {
        const e = sdk.WalletError.fromUnknown(eu)
        throw new sdk.WERR_INVALID_PARAMETER('args', `valid encrypted and signed certificate and keyring from revealer. ${e.name}: ${e.message}`);
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
        throw new Error(`Invalid certifier! Expected: ${vargs.certifier}, Received: ${response.headers.get('x-bsv-auth-identity-key')}`)
      }

      const {
        certificate,
        serverNonce
      } = await response.json()

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
        throw new Error(`Invalid certificate subject! Expected: ${this.identityKey}, Received: ${signedCertificate.subject}`)
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
          throw new Error(`Invalid field! Expected: ${certificateFields[field]}, Received: ${signedCertificate.fields[field]}`)
        }
      }

      await signedCertificate.verify()

      // Store the newly issued certificate
      return await acquireDirectCertificate(
        this,
        auth,
        {
          ...certificate,
          keyringRevealer: 'certifier',
          keyringForSubject: masterKeyring,
          privileged: vargs.privileged
        }
      )
    }

    throw new sdk.WERR_INVALID_PARAMETER('acquisitionProtocol', `valid.${args.acquisitionProtocol} is unrecognized.`)
  }

  async relinquishCertificate(args: RelinquishCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<RelinquishCertificateResult> {
    sdk.validateOriginator(originator)
    this.validateAuthAndArgs(args, sdk.validateRelinquishCertificateArgs)
    const r = await this.storage.relinquishCertificate(args)
    return { relinquished: true }
  }

  async proveCertificate(args: ProveCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<ProveCertificateResult> {
    originator = sdk.validateOriginator(originator)
    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateProveCertificateArgs)
    const r = await proveCertificate(this, auth, vargs)
    return r
  }

  async discoverByIdentityKey(args: DiscoverByIdentityKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<DiscoverCertificatesResult> {
    sdk.validateOriginator(originator)
    this.validateAuthAndArgs(args, sdk.validateDiscoverByIdentityKeyArgs)
    throw new Error("Method not implemented.");
  }

  async discoverByAttributes(args: DiscoverByAttributesArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<DiscoverCertificatesResult> {
    sdk.validateOriginator(originator)
    this.validateAuthAndArgs(args, sdk.validateDiscoverByAttributesArgs)
    throw new Error("Method not implemented.");
  }



  //////////////////
  // Actions
  //////////////////

  async createAction(args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<CreateActionResult> {
    sdk.validateOriginator(originator)

    if (!args.options) args.options = {}
    args.options.trustSelf ||= this.trustSelf
    args.options.knownTxids = this.getKnownTxids(args.options.knownTxids)

    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateCreateActionArgs)
    const r = await createAction(this, auth, vargs)

    if (r.signableTransaction) {
      const st = r.signableTransaction
      const ab = Beef.fromBinary(st.tx)
      if (!ab.atomicTxid)
        throw new sdk.WERR_INTERNAL('Missing atomicTxid in signableTransaction result')
      if (ab.txs.length < 1 || ab.txs[ab.txs.length - 1].txid !== ab.atomicTxid)
        throw new sdk.WERR_INTERNAL('atomicTxid does not match txid of last AtomicBEEF transaction')
      // Remove the new, partially constructed transaction from beef as it will never be a valid transaction.
      ab.txs.slice(ab.txs.length - 1)
      this.beef.mergeBeefFromParty(this.storageParty, ab)
    } else if (r.tx) {
      this.beef.mergeBeefFromParty(this.storageParty, r.tx)
    }

    return r
  }

  async signAction(args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<SignActionResult> {
    sdk.validateOriginator(originator)

    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateSignActionArgs)
    const r = await signAction(this, auth, vargs)
    return r
  }

  async abortAction(args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<AbortActionResult> {
    sdk.validateOriginator(originator)

    const { auth } = this.validateAuthAndArgs(args, sdk.validateAbortActionArgs)
    const r = await this.storage.abortAction(args)
    return r
  }

  async internalizeAction(args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<InternalizeActionResult> {
    sdk.validateOriginator(originator)
    const { auth, vargs } = this.validateAuthAndArgs(args, sdk.validateInternalizeActionArgs)
    const r = await internalizeAction(this, auth, args)
    return r
  }

  async relinquishOutput(args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<RelinquishOutputResult> {
    sdk.validateOriginator(originator)
    const { vargs } = this.validateAuthAndArgs(args, sdk.validateRelinquishOutputArgs)
    const r = await this.storage.relinquishOutput(args)
    return { relinquished: true }
  }

  async isAuthenticated(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<AuthenticatedResult> {
    sdk.validateOriginator(originator)
    const r: { authenticated: true; } = {
      authenticated: true
    }
    return r
  }

  async waitForAuthentication(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<AuthenticatedResult> {
    sdk.validateOriginator(originator)
    return { authenticated: true }
  }

  async getHeight(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<GetHeightResult> {
    sdk.validateOriginator(originator)
    const height = await this.getServices().getHeight()
    return { height }
  }

  async getHeaderForHeight(args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<GetHeaderResult> {
    sdk.validateOriginator(originator)
    const serializedHeader = await this.getServices().getHeaderForHeight(args.height)
    return { header: Utils.toHex(serializedHeader) }
  }

  async getNetwork(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<GetNetworkResult> {
    sdk.validateOriginator(originator)
    return { network: toWalletNetwork(this.chain) }
  }

  async getVersion(args: {}, originator?: OriginatorDomainNameStringUnder250Bytes)
    : Promise<GetVersionResult> {
    sdk.validateOriginator(originator)
    return { version: 'wallet-brc100-1.0.0' }
  }
}

export interface PendingStorageInput {
  vin: number,
  derivationPrefix: string,
  derivationSuffix: string,
  unlockerPubKey?: string,
  sourceSatoshis: number,
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