import {
  WalletInterface,
  Utils,
  PushDrop,
  LockingScript,
  Transaction,
  WalletProtocol,
  Base64String,
  PubKeyHex
} from '@bsv/sdk'
import { validateCreateActionArgs } from './sdk'

////// TODO: ADD SUPPORT FOR ADMIN COUNTERPARTIES BASED ON WALLET STORAGE
//////       PROHIBITION OF SPECIAL OPERATIONS IS ALSO CRITICAL.
////// !!!!!!!! SECURITY-CRITICAL ADDITION — DO NOT USE UNTIL IMPLEMENTED.

function deepEqual(object1: any, object2: any): boolean {
  if (object1 === null || object1 === undefined || object2 === null || object2 === undefined) {
    return object1 === object2
  }
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false
    }
  }

  return true
}

function isObject(object: any): boolean {
  return object != null && typeof object === 'object'
}

/**
 * Describes a group of permissions that can be requested together.
 * This structure is based on BRC-73.
 */
export interface GroupedPermissions {
  description?: string
  spendingAuthorization?: {
    amount: number
    description: string
  }
  protocolPermissions?: Array<{
    protocolID: WalletProtocol
    counterparty?: string
    description: string
  }>
  basketAccess?: Array<{
    basket: string
    description: string
  }>
  certificateAccess?: Array<{
    type: string
    fields: string[]
    verifierPublicKey: string
    description: string
  }>
}

/**
 * The object passed to the UI when a grouped permission is requested.
 */
export interface GroupedPermissionRequest {
  originator: string
  requestID: string
  permissions: GroupedPermissions
}

/**
 * Signature for functions that handle a grouped permission request event.
 */
export type GroupedPermissionEventHandler = (request: GroupedPermissionRequest) => void | Promise<void>

/**
 * Describes a single requested permission that the user must either grant or deny.
 *
 * Four categories of permission are supported, each with a unique protocol:
 *  1) protocol - "DPACP" (Domain Protocol Access Control Protocol)
 *  2) basket   - "DBAP"  (Domain Basket Access Protocol)
 *  3) certificate - "DCAP" (Domain Certificate Access Protocol)
 *  4) spending - "DSAP"  (Domain Spending Authorization Protocol)
 *
 * This model underpins "requests" made to the user for permission, which the user can
 * either grant or deny. The manager can then create on-chain tokens (PushDrop outputs)
 * if permission is granted. Denying requests cause the underlying operation to throw,
 * and no token is created. An "ephemeral" grant is also possible, denoting a one-time
 * authorization without an associated persistent on-chain token.
 */
export interface PermissionRequest {
  type: 'protocol' | 'basket' | 'certificate' | 'spending'
  originator: string // The domain or FQDN of the requesting application
  privileged?: boolean // For "protocol" or "certificate" usage, indicating privileged key usage
  protocolID?: WalletProtocol // For type='protocol': BRC-43 style (securityLevel, protocolName)
  counterparty?: string // For type='protocol': e.g. target public key or "self"/"anyone"

  basket?: string // For type='basket': the basket name being requested

  certificate?: {
    // For type='certificate': details about the cert usage
    verifier: string
    certType: string
    fields: string[]
  }

  spending?: {
    // For type='spending': details about the requested spend
    satoshis: number
    lineItems?: Array<{
      type: 'input' | 'output' | 'fee'
      description: string
      satoshis: number
    }>
  }

  reason?: string // Human-readable explanation for requesting permission
  renewal?: boolean // Whether this request is for renewing an expired token
  previousToken?: PermissionToken // If renewing an expired permission, reference to the old token
}

/**
 * Signature for functions that handle a permission request event, e.g. "Please ask the user to allow basket X".
 */
export type PermissionEventHandler = (request: PermissionRequest & { requestID: string }) => void | Promise<void>

/**
 * Data structure representing an on-chain permission token.
 * It is typically stored as a single unspent PushDrop output in a special "internal" admin basket belonging to
 * the user, held in their underlying wallet.
 *
 * It can represent any of the four permission categories by having the relevant fields:
 *  - DPACP: originator, privileged, protocol, securityLevel, counterparty
 *  - DBAP:  originator, basketName
 *  - DCAP:  originator, privileged, verifier, certType, certFields
 *  - DSAP:  originator, authorizedAmount
 */
export interface PermissionToken {
  /** The transaction ID where this token resides. */
  txid: string

  /** The current transaction encapsulating the token. */
  tx: number[]

  /** The output index within that transaction. */
  outputIndex: number

  /** The exact script hex for the locking script. */
  outputScript: string

  /** The amount of satoshis assigned to the permission output (often 1). */
  satoshis: number

  /** The originator domain or FQDN that is allowed to use this permission. */
  originator: string

  /** The expiration time for this token in UNIX epoch seconds. (0 or omitted for spending authorizations, which are indefinite) */
  expiry: number

  /** Whether this token grants privileged usage (for protocol or certificate). */
  privileged?: boolean

  /** The protocol name, if this is a DPACP token. */
  protocol?: string

  /** The security level (0,1,2) for DPACP. */
  securityLevel?: 0 | 1 | 2

  /** The counterparty, for DPACP. */
  counterparty?: string

  /** The name of a basket, if this is a DBAP token. */
  basketName?: string

  /** The certificate type, if this is a DCAP token. */
  certType?: string

  /** The certificate fields that this token covers, if DCAP token. */
  certFields?: string[]

  /** The "verifier" public key string, if DCAP. */
  verifier?: string

  /** For DSAP, the maximum authorized spending for the month. */
  authorizedAmount?: number
}

/**
 * A map from each permission type to a special "admin basket" name used for storing
 * the tokens. The tokens themselves are unspent transaction outputs (UTXOs) with a
 * specialized PushDrop script that references the originator, expiry, etc.
 */
const BASKET_MAP = {
  protocol: 'admin protocol-permission',
  basket: 'admin basket-access',
  certificate: 'admin certificate-access',
  spending: 'admin spending-authorization'
}

/**
 * The set of callbacks that external code can bind to, e.g. to display UI prompts or logs
 * when a permission is requested.
 */
export interface WalletPermissionsManagerCallbacks {
  onProtocolPermissionRequested?: PermissionEventHandler[]
  onBasketAccessRequested?: PermissionEventHandler[]
  onCertificateAccessRequested?: PermissionEventHandler[]
  onSpendingAuthorizationRequested?: PermissionEventHandler[]
  onGroupedPermissionRequested?: GroupedPermissionEventHandler[]
}

/**
 * Configuration object for the WalletPermissionsManager. If a given option is `false`,
 * the manager will skip or alter certain permission checks or behaviors.
 *
 * By default, all of these are `true` unless specified otherwise. This is the most secure configuration.
 */
export interface PermissionsManagerConfig {
  /**
   * For `createSignature` and `verifySignature`,
   * require a "protocol usage" permission check?
   */
  seekProtocolPermissionsForSigning?: boolean

  /**
   * For methods that perform encryption (encrypt/decrypt), require
   * a "protocol usage" permission check?
   */
  seekProtocolPermissionsForEncrypting?: boolean

  /**
   * For methods that perform HMAC creation or verification (createHmac, verifyHmac),
   * require a "protocol usage" permission check?
   */
  seekProtocolPermissionsForHMAC?: boolean

  /**
   * For revealing counterparty-level or specific key linkage revelation information,
   * should we require permission?
   */
  seekPermissionsForKeyLinkageRevelation?: boolean

  /**
   * For revealing any user public key (getPublicKey) **other** than the identity key,
   * should we require permission?
   */
  seekPermissionsForPublicKeyRevelation?: boolean

  /**
   * If getPublicKey is requested with `identityKey=true`, do we require permission?
   */
  seekPermissionsForIdentityKeyRevelation?: boolean

  /**
   * If discoverByIdentityKey / discoverByAttributes are called, do we require permission
   * for "identity resolution" usage?
   */
  seekPermissionsForIdentityResolution?: boolean

  /**
   * When we do internalizeAction with `basket insertion`, or include outputs in baskets
   * with `createAction, do we ask for basket permission?
   */
  seekBasketInsertionPermissions?: boolean

  /**
   * When relinquishOutput is called, do we ask for basket permission?
   */
  seekBasketRemovalPermissions?: boolean

  /**
   * When listOutputs is called, do we ask for basket permission?
   */
  seekBasketListingPermissions?: boolean

  /**
   * When createAction is called with labels, do we ask for "label usage" permission?
   */
  seekPermissionWhenApplyingActionLabels?: boolean

  /**
   * When listActions is called with labels, do we ask for "label usage" permission?
   */
  seekPermissionWhenListingActionsByLabel?: boolean

  /**
   * If proving a certificate (proveCertificate) or revealing certificate fields,
   * do we require a "certificate access" permission?
   */
  seekCertificateDisclosurePermissions?: boolean

  /**
   * If acquiring a certificate (acquireCertificate), do we require a permission check?
   */
  seekCertificateAcquisitionPermissions?: boolean

  /**
   * If relinquishing a certificate (relinquishCertificate), do we require a permission check?
   */
  seekCertificateRelinquishmentPermissions?: boolean

  /**
   * If listing a user's certificates (listCertificates), do we require a permission check?
   */
  seekCertificateListingPermissions?: boolean

  /**
   * Should transaction descriptions, input descriptions, and output descriptions be encrypted
   * when before they are passed to the underlying wallet, and transparently decrypted when retrieved?
   */
  encryptWalletMetadata?: boolean

  /**
   * If the originator tries to spend wallet funds (netSpent > 0 in createAction),
   * do we seek spending authorization?
   */
  seekSpendingPermissions?: boolean

  /**
   * If true, triggers a grouped permission request flow based on the originator's `manifest.json`.
   */
  seekGroupedPermission?: boolean

  /**
   * If false, permissions are checked without regard for whether we are in
   * privileged mode. Privileged status is ignored with respect to whether
   * permissions are granted. Internally, they are always sought and checked
   * with privileged=false, regardless of the actual value.
   */
  differentiatePrivilegedOperations?: boolean
}

/**
 * @class WalletPermissionsManager
 *
 * Wraps an underlying BRC-100 `Wallet` implementation with permissions management capabilities.
 * The manager intercepts calls from external applications (identified by originators), checks if the request is allowed,
 * and if not, orchestrates user permission flows. It creates or renews on-chain tokens in special
 * admin baskets to track these authorizations. Finally, it proxies the actual call to the underlying wallet.
 *
 * ### Key Responsibilities:
 *  - **Permission Checking**: Before standard wallet operations (e.g. `encrypt`),
 *    the manager checks if a valid permission token exists. If not, it attempts to request permission from the user.
 *  - **On-Chain Tokens**: When permission is granted, the manager stores it as an unspent "PushDrop" output.
 *    This can be spent later to revoke or renew the permission.
 *  - **Callbacks**: The manager triggers user-defined callbacks on permission requests (to show a UI prompt),
 *    on grants/denials, and on internal processes.
 *
 * ### Implementation Notes:
 *  - The manager follows the BRC-100 `createAction` + `signAction` pattern for building or spending these tokens.
 *  - Token revocation or renewal uses standard BRC-100 flows: we build a transaction that consumes
 *    the old token UTXO and outputs a new one (or none, if fully revoked).
 */
export class WalletPermissionsManager implements WalletInterface {
  /** A reference to the BRC-100 wallet instance. */
  private underlying: WalletInterface

  /** The "admin" domain or FQDN that is implicitly allowed to do everything. */
  private adminOriginator: string

  /**
   * Event callbacks that external code can subscribe to, e.g. to show a UI prompt
   * or log events. Each event can have multiple handlers.
   */
  private callbacks: WalletPermissionsManagerCallbacks = {
    onProtocolPermissionRequested: [],
    onBasketAccessRequested: [],
    onCertificateAccessRequested: [],
    onSpendingAuthorizationRequested: [],
    onGroupedPermissionRequested: []
  }

  /**
   * We queue parallel requests for the same resource so that only one
   * user prompt is created for a single resource. If multiple calls come
   * in at once for the same "protocol:domain:privileged:counterparty" etc.,
   * they get merged.
   *
   * The key is a string derived from the operation; the value is an object with a reference to the
   * associated request and an array of pending promise resolve/reject pairs, one for each active
   * operation that's waiting on the particular resource described by the key.
   */
  private activeRequests: Map<
    string,
    {
      request: PermissionRequest | { originator: string; permissions: GroupedPermissions }
      pending: Array<{
        resolve: (val: any) => void
        reject: (err: any) => void
      }>
    }
  > = new Map()

  /** Cache recently confirmed permissions to avoid repeated lookups. */
  private permissionCache: Map<string, { expiry: number; cachedAt: number }> = new Map()

  /** How long a cached permission remains valid (5 minutes). */
  private static readonly CACHE_TTL_MS = 5 * 60 * 1000

  /**
   * Configuration that determines whether to skip or apply various checks and encryption.
   */
  private config: PermissionsManagerConfig

  /**
   * Constructs a new Permissions Manager instance.
   *
   * @param underlyingWallet           The underlying BRC-100 wallet, where requests are forwarded after permission is granted
   * @param adminOriginator            The domain or FQDN that is automatically allowed everything
   * @param config                     A set of boolean flags controlling how strictly permissions are enforced
   */
  constructor(underlyingWallet: WalletInterface, adminOriginator: string, config: PermissionsManagerConfig = {}) {
    this.underlying = underlyingWallet
    this.adminOriginator = adminOriginator

    // Default all config options to true unless specified
    this.config = {
      seekProtocolPermissionsForSigning: true,
      seekProtocolPermissionsForEncrypting: true,
      seekProtocolPermissionsForHMAC: true,
      seekPermissionsForKeyLinkageRevelation: true,
      seekPermissionsForPublicKeyRevelation: true,
      seekPermissionsForIdentityKeyRevelation: true,
      seekPermissionsForIdentityResolution: true,
      seekBasketInsertionPermissions: true,
      seekBasketRemovalPermissions: true,
      seekBasketListingPermissions: true,
      seekPermissionWhenApplyingActionLabels: true,
      seekPermissionWhenListingActionsByLabel: true,
      seekCertificateDisclosurePermissions: true,
      seekCertificateAcquisitionPermissions: true,
      seekCertificateRelinquishmentPermissions: true,
      seekCertificateListingPermissions: true,
      encryptWalletMetadata: true,
      seekSpendingPermissions: true,
      seekGroupedPermission: true,
      differentiatePrivilegedOperations: true,
      ...config // override with user-specified config
    }
  }

  /* ---------------------------------------------------------------------
   *  1) PUBLIC API FOR REGISTERING CALLBACKS (UI PROMPTS, LOGGING, ETC.)
   * --------------------------------------------------------------------- */

  /**
   * Binds a callback function to a named event, such as `onProtocolPermissionRequested`.
   *
   * @param eventName The name of the event to listen to
   * @param handler   A function that handles the event
   * @returns         A numeric ID you can use to unbind later
   */
  public bindCallback(
    eventName: keyof WalletPermissionsManagerCallbacks,
    handler: PermissionEventHandler | GroupedPermissionEventHandler
  ): number {
    const arr = this.callbacks[eventName]! as any[]
    arr.push(handler)
    return arr.length - 1
  }

  /**
   * Unbinds a previously registered callback by either its numeric ID (returned by `bindCallback`)
   * or by exact function reference.
   *
   * @param eventName  The event name, e.g. "onProtocolPermissionRequested"
   * @param reference  Either the numeric ID or the function reference
   * @returns          True if successfully unbound, false otherwise
   */
  public unbindCallback(eventName: keyof WalletPermissionsManagerCallbacks, reference: number | Function): boolean {
    if (!this.callbacks[eventName]) return false
    const arr = this.callbacks[eventName] as any[]
    if (typeof reference === 'number') {
      if (arr[reference]) {
        arr[reference] = null
        return true
      }
      return false
    } else {
      const index = arr.indexOf(reference)
      if (index !== -1) {
        arr[index] = null
        return true
      }
      return false
    }
  }

  /**
   * Internally triggers a named event, calling all subscribed listeners.
   * Each callback is awaited in turn (though errors are swallowed so that
   * one failing callback doesn't prevent the others).
   *
   * @param eventName The event name
   * @param param     The parameter object passed to all listeners
   */
  private async callEvent(eventName: keyof WalletPermissionsManagerCallbacks, param: any): Promise<void> {
    const arr = this.callbacks[eventName] || []
    for (const cb of arr) {
      if (typeof cb === 'function') {
        try {
          await cb(param)
        } catch (e) {
          // Intentionally swallow errors from user-provided callbacks
        }
      }
    }
  }

  /* ---------------------------------------------------------------------
   *  2) PERMISSION (GRANT / DENY) METHODS
   * --------------------------------------------------------------------- */

  /**
   * Grants a previously requested permission.
   * This method:
   *  1) Resolves all pending promise calls waiting on this request
   *  2) Optionally creates or renews an on-chain PushDrop token (unless `ephemeral===true`)
   *
   * @param params      requestID to identify which request is granted, plus optional expiry
   *                    or `ephemeral` usage, etc.
   */
  public async grantPermission(params: {
    requestID: string
    expiry?: number
    ephemeral?: boolean
    amount?: number
  }): Promise<void> {
    // 1) Identify the matching queued requests in `activeRequests`
    const matching = this.activeRequests.get(params.requestID)
    if (!matching) {
      throw new Error('Request ID not found.')
    }

    // 2) Mark all matching requests as resolved, deleting the entry
    for (const x of matching.pending) {
      x.resolve(true)
    }
    this.activeRequests.delete(params.requestID)

    // 3) If `ephemeral !== true`, we create or renew an on-chain token
    if (!params.ephemeral) {
      const request = matching.request as PermissionRequest
      if (!request.renewal) {
        // brand-new permission token
        await this.createPermissionOnChain(
          request,
          params.expiry || Math.floor(Date.now() / 1000) + 3600 * 24 * 30, // default 30-day expiry
          params.amount
        )
      } else {
        // renewal => spend the old token, produce a new one
        await this.renewPermissionOnChain(
          request.previousToken!,
          request,
          params.expiry || Math.floor(Date.now() / 1000) + 3600 * 24 * 30,
          params.amount
        )
      }
    }

    // Update the cache regardless of ephemeral status
    const expiry = params.expiry || Math.floor(Date.now() / 1000) + 3600 * 24 * 30
    const key = this.buildRequestKey(matching.request as PermissionRequest)
    this.cachePermission(key, expiry)
  }

  /**
   * Denies a previously requested permission.
   * This method rejects all pending promise calls waiting on that request
   *
   * @param requestID    requestID identifying which request to deny
   */
  public async denyPermission(requestID: string): Promise<void> {
    // 1) Identify the matching requests
    const matching = this.activeRequests.get(requestID)
    if (!matching) {
      throw new Error('Request ID not found.')
    }

    // 2) Reject all matching requests, deleting the entry
    for (const x of matching.pending) {
      x.reject(new Error('Permission denied.'))
    }
    this.activeRequests.delete(requestID)
  }

  /**
   * Grants a previously requested grouped permission.
   * @param params.requestID The ID of the request being granted.
   * @param params.granted A subset of the originally requested permissions that the user has granted.
   * @param params.expiry An optional expiry time (in seconds) for the new permission tokens.
   */
  public async grantGroupedPermission(params: {
    requestID: string
    granted: Partial<GroupedPermissions>
    expiry?: number
  }): Promise<void> {
    const matching = this.activeRequests.get(params.requestID)
    if (!matching) {
      throw new Error('Request ID not found.')
    }

    const originalRequest = matching.request as { originator: string; permissions: GroupedPermissions }
    const { originator, permissions: requestedPermissions } = originalRequest

    // --- Validation: Ensure granted permissions are a subset of what was requested ---
    if (
      params.granted.spendingAuthorization &&
      !deepEqual(params.granted.spendingAuthorization, requestedPermissions.spendingAuthorization)
    ) {
      throw new Error('Granted spending authorization does not match the original request.')
    }
    if (
      params.granted.protocolPermissions?.some(
        g => !requestedPermissions.protocolPermissions?.find(r => deepEqual(r, g))
      )
    ) {
      throw new Error('Granted protocol permissions are not a subset of the original request.')
    }
    if (params.granted.basketAccess?.some(g => !requestedPermissions.basketAccess?.find(r => deepEqual(r, g)))) {
      throw new Error('Granted basket access permissions are not a subset of the original request.')
    }
    if (
      params.granted.certificateAccess?.some(g => !requestedPermissions.certificateAccess?.find(r => deepEqual(r, g)))
    ) {
      throw new Error('Granted certificate access permissions are not a subset of the original request.')
    }
    // --- End Validation ---

    const expiry = params.expiry || Math.floor(Date.now() / 1000) + 3600 * 24 * 30 // 30-day default

    if (params.granted.spendingAuthorization) {
      await this.createPermissionOnChain(
        {
          type: 'spending',
          originator,
          spending: { satoshis: params.granted.spendingAuthorization.amount },
          reason: params.granted.spendingAuthorization.description
        },
        0, // No expiry for spending tokens
        params.granted.spendingAuthorization.amount
      )
    }
    for (const p of params.granted.protocolPermissions || []) {
      await this.createPermissionOnChain(
        {
          type: 'protocol',
          originator,
          privileged: false, // No privileged protocols allowed in groups for added security.
          protocolID: p.protocolID,
          counterparty: p.counterparty || 'self',
          reason: p.description
        },
        expiry
      )
    }
    for (const b of params.granted.basketAccess || []) {
      await this.createPermissionOnChain(
        { type: 'basket', originator, basket: b.basket, reason: b.description },
        expiry
      )
    }
    for (const c of params.granted.certificateAccess || []) {
      await this.createPermissionOnChain(
        {
          type: 'certificate',
          originator,
          privileged: false, // No certificates on the privileged identity are allowed as part of groups.
          certificate: {
            verifier: c.verifierPublicKey,
            certType: c.type,
            fields: c.fields
          },
          reason: c.description
        },
        expiry
      )
    }

    // Resolve all pending promises for this request
    for (const p of matching.pending) {
      p.resolve(true)
    }
    this.activeRequests.delete(params.requestID)
  }

  /**
   * Denies a previously requested grouped permission.
   * @param requestID The ID of the request being denied.
   */
  public async denyGroupedPermission(requestID: string): Promise<void> {
    const matching = this.activeRequests.get(requestID)
    if (!matching) {
      throw new Error('Request ID not found.')
    }
    const err = new Error('The user has denied the request for permission.')
    ;(err as any).code = 'ERR_PERMISSION_DENIED'
    for (const p of matching.pending) {
      p.reject(err)
    }
    this.activeRequests.delete(requestID)
  }

  /* ---------------------------------------------------------------------
   *  3) THE "ENSURE" METHODS: CHECK IF PERMISSION EXISTS, OTHERWISE PROMPT
   * --------------------------------------------------------------------- */

  /**
   * Ensures the originator has protocol usage permission.
   * If no valid (unexpired) permission token is found, triggers a permission request flow.
   */
  public async ensureProtocolPermission({
    originator,
    privileged,
    protocolID,
    counterparty,
    reason,
    seekPermission = true,
    usageType
  }: {
    originator: string
    privileged: boolean
    protocolID: WalletProtocol
    counterparty: string
    reason?: string
    seekPermission?: boolean
    usageType: 'signing' | 'encrypting' | 'hmac' | 'publicKey' | 'identityKey' | 'linkageRevelation' | 'generic'
  }): Promise<boolean> {
    // 1) adminOriginator can do anything
    if (this.isAdminOriginator(originator)) return true

    // 2) If security level=0, we consider it "open" usage
    const [level, protoName] = protocolID
    if (level === 0) return true

    // 3) If protocol is admin-reserved, block
    if (this.isAdminProtocol(protocolID)) {
      throw new Error(`Protocol “${protoName}” is admin-only.`)
    }

    // Allow the configured exceptions.
    if (usageType === 'signing' && !this.config.seekProtocolPermissionsForSigning) {
      return true
    }
    if (usageType === 'encrypting' && !this.config.seekProtocolPermissionsForEncrypting) {
      return true
    }
    if (usageType === 'hmac' && !this.config.seekProtocolPermissionsForHMAC) {
      return true
    }
    if (usageType === 'publicKey' && !this.config.seekPermissionsForPublicKeyRevelation) {
      return true
    }
    if (usageType === 'identityKey' && !this.config.seekPermissionsForIdentityKeyRevelation) {
      return true
    }
    if (usageType === 'linkageRevelation' && !this.config.seekPermissionsForKeyLinkageRevelation) {
      return true
    }
    if (!this.config.differentiatePrivilegedOperations) {
      privileged = false
    }

    const cacheKey = this.buildRequestKey({
      type: 'protocol',
      originator,
      privileged,
      protocolID,
      counterparty
    })
    if (this.isPermissionCached(cacheKey)) {
      return true
    }

    // 4) Attempt to find a valid token in the internal basket
    const token = await this.findProtocolToken(
      originator,
      privileged,
      protocolID,
      counterparty,
      /*includeExpired=*/ true
    )
    if (token) {
      if (!this.isTokenExpired(token.expiry)) {
        // valid and unexpired
        this.cachePermission(cacheKey, token.expiry)
        return true
      } else {
        // has a token but expired => request renewal if allowed
        if (!seekPermission) {
          throw new Error(`Protocol permission expired and no further user consent allowed (seekPermission=false).`)
        }
        return await this.requestPermissionFlow({
          type: 'protocol',
          originator,
          privileged,
          protocolID,
          counterparty,
          reason,
          renewal: true,
          previousToken: token
        })
      }
    } else {
      // No token found => request a new one if allowed
      if (!seekPermission) {
        throw new Error(`No protocol permission token found (seekPermission=false).`)
      }
      const granted = await this.requestPermissionFlow({
        type: 'protocol',
        originator,
        privileged,
        protocolID,
        counterparty,
        reason,
        renewal: false
      })
      if (granted) {
        // Unknown expiry until grantPermission() is called; cache for now with TTL only
        this.cachePermission(cacheKey, 0)
      }
      return granted
    }
  }

  /**
   * Ensures the originator has basket usage permission for the specified basket.
   * If not, triggers a permission request flow.
   */
  public async ensureBasketAccess({
    originator,
    basket,
    reason,
    seekPermission = true,
    usageType
  }: {
    originator: string
    basket: string
    reason?: string
    seekPermission?: boolean
    usageType: 'insertion' | 'removal' | 'listing'
  }): Promise<boolean> {
    if (this.isAdminOriginator(originator)) return true
    if (this.isAdminBasket(basket)) {
      throw new Error(`Basket “${basket}” is admin-only.`)
    }
    if (usageType === 'insertion' && !this.config.seekBasketInsertionPermissions) return true
    if (usageType === 'removal' && !this.config.seekBasketRemovalPermissions) return true
    if (usageType === 'listing' && !this.config.seekBasketListingPermissions) return true
    const cacheKey = this.buildRequestKey({ type: 'basket', originator, basket })
    if (this.isPermissionCached(cacheKey)) {
      return true
    }
    const token = await this.findBasketToken(originator, basket, true)
    if (token) {
      if (!this.isTokenExpired(token.expiry)) {
        this.cachePermission(cacheKey, token.expiry)
        return true
      } else {
        if (!seekPermission) {
          throw new Error(`Basket permission expired (seekPermission=false).`)
        }
        return await this.requestPermissionFlow({
          type: 'basket',
          originator,
          basket,
          reason,
          renewal: true,
          previousToken: token
        })
      }
    } else {
      // none
      if (!seekPermission) {
        throw new Error(`No basket permission found, and no user consent allowed (seekPermission=false).`)
      }
      const granted = await this.requestPermissionFlow({
        type: 'basket',
        originator,
        basket,
        reason,
        renewal: false
      })
      if (granted) {
        this.cachePermission(cacheKey, 0)
      }
      return granted
    }
  }

  /**
   * Ensures the originator has a valid certificate permission.
   * This is relevant when revealing certificate fields in DCAP contexts.
   */
  public async ensureCertificateAccess({
    originator,
    privileged,
    verifier,
    certType,
    fields,
    reason,
    seekPermission = true,
    usageType
  }: {
    originator: string
    privileged: boolean
    verifier: string
    certType: string
    fields: string[]
    reason?: string
    seekPermission?: boolean
    usageType: 'disclosure'
  }): Promise<boolean> {
    if (this.isAdminOriginator(originator)) return true
    if (usageType === 'disclosure' && !this.config.seekCertificateDisclosurePermissions) {
      return true
    }
    if (!this.config.differentiatePrivilegedOperations) {
      privileged = false
    }
    const cacheKey = this.buildRequestKey({
      type: 'certificate',
      originator,
      privileged,
      certificate: { verifier, certType, fields }
    })
    if (this.isPermissionCached(cacheKey)) {
      return true
    }
    const token = await this.findCertificateToken(
      originator,
      privileged,
      verifier,
      certType,
      fields,
      /*includeExpired=*/ true
    )
    if (token) {
      if (!this.isTokenExpired(token.expiry)) {
        this.cachePermission(cacheKey, token.expiry)
        return true
      } else {
        if (!seekPermission) {
          throw new Error(`Certificate permission expired (seekPermission=false).`)
        }
        return await this.requestPermissionFlow({
          type: 'certificate',
          originator,
          privileged,
          certificate: { verifier, certType, fields },
          reason,
          renewal: true,
          previousToken: token
        })
      }
    } else {
      if (!seekPermission) {
        throw new Error(`No certificate permission found (seekPermission=false).`)
      }
      const granted = await this.requestPermissionFlow({
        type: 'certificate',
        originator,
        privileged,
        certificate: { verifier, certType, fields },
        reason,
        renewal: false
      })
      if (granted) {
        this.cachePermission(cacheKey, 0)
      }
      return granted
    }
  }

  /**
   * Ensures the originator has spending authorization (DSAP) for a certain satoshi amount.
   * If the existing token limit is insufficient, attempts to renew. If no token, attempts to create one.
   */
  public async ensureSpendingAuthorization({
    originator,
    satoshis,
    lineItems,
    reason,
    seekPermission = true
  }: {
    originator: string
    satoshis: number
    lineItems?: Array<{
      type: 'input' | 'output' | 'fee'
      description: string
      satoshis: number
    }>
    reason?: string
    seekPermission?: boolean
  }): Promise<boolean> {
    if (this.isAdminOriginator(originator)) return true
    if (!this.config.seekSpendingPermissions) {
      // We skip spending permission entirely
      return true
    }
    const cacheKey = this.buildRequestKey({ type: 'spending', originator })
    if (this.isPermissionCached(cacheKey)) {
      return true
    }
    const token = await this.findSpendingToken(originator)
    if (token?.authorizedAmount) {
      // Check how much has been spent so far
      const spentSoFar = await this.querySpentSince(token)
      if (spentSoFar + satoshis <= token.authorizedAmount) {
        this.cachePermission(cacheKey, token.expiry)
        return true
      } else {
        // Renew if possible
        if (!seekPermission) {
          throw new Error(
            `Spending authorization insufficient for ${satoshis}, no user consent (seekPermission=false).`
          )
        }
        const granted = await this.requestPermissionFlow({
          type: 'spending',
          originator,
          spending: { satoshis, lineItems },
          reason,
          renewal: true,
          previousToken: token
        })
        if (granted) {
          this.cachePermission(cacheKey, 0)
        }
        return granted
      }
    } else {
      // no token
      if (!seekPermission) {
        throw new Error(`No spending authorization found, (seekPermission=false).`)
      }
      const granted = await this.requestPermissionFlow({
        type: 'spending',
        originator,
        spending: { satoshis, lineItems },
        reason,
        renewal: false
      })
      if (granted) {
        this.cachePermission(cacheKey, 0)
      }
      return granted
    }
  }

  /**
   * Ensures the originator has label usage permission.
   * If no valid (unexpired) permission token is found, triggers a permission request flow.
   */
  public async ensureLabelAccess({
    originator,
    label,
    reason,
    seekPermission = true,
    usageType
  }: {
    originator: string
    label: string
    reason?: string
    seekPermission?: boolean
    usageType: 'apply' | 'list'
  }): Promise<boolean> {
    // 1) adminOriginator can do anything
    if (this.isAdminOriginator(originator)) return true

    // 2) If label is admin-reserved, block
    if (this.isAdminLabel(label)) {
      throw new Error(`Label “${label}” is admin-only.`)
    }

    if (usageType === 'apply' && !this.config.seekPermissionWhenApplyingActionLabels) {
      return true
    }
    if (usageType === 'list' && !this.config.seekPermissionWhenListingActionsByLabel) {
      return true
    }

    const cacheKey = this.buildRequestKey({
      type: 'protocol',
      originator,
      privileged: false,
      protocolID: [1, `action label ${label}`],
      counterparty: 'self'
    })
    if (this.isPermissionCached(cacheKey)) {
      return true
    }

    // 3) Let ensureProtocolPermission handle the rest.
    const granted = await this.ensureProtocolPermission({
      originator,
      privileged: false,
      protocolID: [1, `action label ${label}`],
      counterparty: 'self',
      reason,
      seekPermission,
      usageType: 'generic'
    })
    if (granted) {
      this.cachePermission(cacheKey, 0)
    }
    return granted
  }

  /**
   * A central method that triggers the permission request flow.
   * - It checks if there's already an active request for the same key
   * - If so, we wait on that existing request rather than creating a duplicative one
   * - Otherwise we create a new request queue, call the relevant "onXXXRequested" event,
   *   and return a promise that resolves once permission is granted or rejects if denied.
   */
  private async requestPermissionFlow(r: PermissionRequest): Promise<boolean> {
    const key = this.buildRequestKey(r)

    // If there's already a queue for the same resource, we piggyback on it
    const existingQueue = this.activeRequests.get(key)
    if (existingQueue && existingQueue.pending.length > 0) {
      return new Promise<boolean>((resolve, reject) => {
        existingQueue.pending.push({ resolve, reject })
      })
    }

    // Otherwise, create a new queue with a single entry
    // Return a promise that resolves or rejects once the user grants/denies
    return new Promise<boolean>(async (resolve, reject) => {
      this.activeRequests.set(key, {
        request: r,
        pending: [{ resolve, reject }]
      })

      // Fire the relevant onXXXRequested event (which one depends on r.type)
      switch (r.type) {
        case 'protocol':
          await this.callEvent('onProtocolPermissionRequested', {
            ...r,
            requestID: key
          })
          break
        case 'basket':
          await this.callEvent('onBasketAccessRequested', {
            ...r,
            requestID: key
          })
          break
        case 'certificate':
          await this.callEvent('onCertificateAccessRequested', {
            ...r,
            requestID: key
          })
          break
        case 'spending':
          await this.callEvent('onSpendingAuthorizationRequested', {
            ...r,
            requestID: key
          })
          break
      }
    })
  }

  /* ---------------------------------------------------------------------
   *  4) SEARCH / DECODE / DECRYPT ON-CHAIN TOKENS (PushDrop Scripts)
   * --------------------------------------------------------------------- */

  /**
   * We will use a administrative "permission token encryption" protocol to store fields
   * in each permission's PushDrop script. This ensures that only the user's wallet
   * can decrypt them. In practice, this data is not super sensitive, but we still
   * follow the principle of least exposure.
   */
  private static readonly PERM_TOKEN_ENCRYPTION_PROTOCOL: [2, 'admin permission token encryption'] = [
    2,
    'admin permission token encryption'
  ]

  /**
   * Similarly, we will use a "metadata encryption" protocol to preserve the confidentiality
   * of transaction descriptions and input/output descriptions from lower storage layers.
   */
  private static readonly METADATA_ENCRYPTION_PROTOCOL: [2, 'admin metadata encryption'] = [
    2,
    'admin metadata encryption'
  ]

  /** We always use `keyID="1"` and `counterparty="self"` for these encryption ops. */
  private async encryptPermissionTokenField(plaintext: string | number[]): Promise<number[]> {
    const data = typeof plaintext === 'string' ? Utils.toArray(plaintext, 'utf8') : plaintext
    const { ciphertext } = await this.underlying.encrypt(
      {
        plaintext: data,
        protocolID: WalletPermissionsManager.PERM_TOKEN_ENCRYPTION_PROTOCOL,
        keyID: '1'
      },
      this.adminOriginator
    )
    return ciphertext
  }

  private async decryptPermissionTokenField(ciphertext: number[]): Promise<number[]> {
    try {
      const { plaintext } = await this.underlying.decrypt(
        {
          ciphertext,
          protocolID: WalletPermissionsManager.PERM_TOKEN_ENCRYPTION_PROTOCOL,
          keyID: '1'
        },
        this.adminOriginator
      )
      return plaintext
    } catch (e) {
      return ciphertext
    }
  }

  /**
   * Encrypts wallet metadata if configured to do so, otherwise returns the original plaintext for storage.
   * @param plaintext The metadata to encrypt if configured to do so
   * @returns The encrypted metadata, or the original value if encryption was disabled.
   */
  private async maybeEncryptMetadata(plaintext: string): Promise<Base64String> {
    if (!this.config.encryptWalletMetadata) {
      return plaintext
    }
    const { ciphertext } = await this.underlying.encrypt(
      {
        plaintext: Utils.toArray(plaintext, 'utf8'),
        protocolID: WalletPermissionsManager.METADATA_ENCRYPTION_PROTOCOL,
        keyID: '1'
      },
      this.adminOriginator
    )
    return Utils.toBase64(ciphertext)
  }

  /**
   * Attempts to decrypt metadata. if decryption fails, assumes the value is already plaintext and returns it.
   * @param ciphertext The metadata to attempt decryption for.
   * @returns The decrypted metadata. If decryption fails, returns the original value instead.
   */
  private async maybeDecryptMetadata(ciphertext: Base64String): Promise<string> {
    try {
      const { plaintext } = await this.underlying.decrypt(
        {
          ciphertext: Utils.toArray(ciphertext, 'base64'),
          protocolID: WalletPermissionsManager.METADATA_ENCRYPTION_PROTOCOL,
          keyID: '1'
        },
        this.adminOriginator
      )
      return Utils.toUTF8(plaintext)
    } catch (e) {
      return ciphertext
    }
  }

  /** Helper to see if a token's expiry is in the past. */
  private isTokenExpired(expiry: number): boolean {
    const now = Math.floor(Date.now() / 1000)
    return expiry > 0 && expiry < now
  }

  /** Looks for a DPACP permission token matching origin/domain, privileged, protocol, cpty. */
  private async findProtocolToken(
    originator: string,
    privileged: boolean,
    protocolID: WalletProtocol,
    counterparty: string,
    includeExpired: boolean
  ): Promise<PermissionToken | undefined> {
    const [secLevel, protoName] = protocolID
    const result = await this.underlying.listOutputs(
      {
        basket: BASKET_MAP.protocol,
        tags: [
          `originator ${originator}`,
          `privileged ${!!privileged}`,
          `protocolName ${protoName}`,
          `protocolSecurityLevel ${secLevel}`,
          `counterparty ${counterparty}`
        ],
        tagQueryMode: 'all',
        include: 'entire transactions'
      },
      this.adminOriginator
    )

    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec || !dec.fields || dec.fields.length < 6) continue
      const domainRaw = dec.fields[0]
      const expiryRaw = dec.fields[1]
      const privRaw = dec.fields[2]
      const secLevelRaw = dec.fields[3]
      const protoNameRaw = dec.fields[4]
      const counterpartyRaw = dec.fields[5]

      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const expiryDecoded = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(expiryRaw)), 10)
      const privDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(privRaw)) === 'true'
      const secLevelDecoded = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(secLevelRaw)), 10) as
        | 0
        | 1
        | 2
      const protoNameDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(protoNameRaw))
      const cptyDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(counterpartyRaw))

      if (
        domainDecoded !== originator ||
        privDecoded !== !!privileged ||
        secLevelDecoded !== secLevel ||
        protoNameDecoded !== protoName ||
        cptyDecoded !== counterparty
      ) {
        continue
      }
      if (!includeExpired && this.isTokenExpired(expiryDecoded)) {
        continue
      }
      return {
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        satoshis: out.satoshis,
        originator,
        privileged,
        protocol: protoName,
        securityLevel: secLevel,
        expiry: expiryDecoded,
        counterparty: cptyDecoded
      }
    }
    return undefined
  }

  /** Looks for a DBAP token matching (originator, basket). */
  private async findBasketToken(
    originator: string,
    basket: string,
    includeExpired: boolean
  ): Promise<PermissionToken | undefined> {
    const result = await this.underlying.listOutputs(
      {
        basket: BASKET_MAP.basket,
        tags: [`originator ${originator}`, `basket ${basket}`],
        tagQueryMode: 'all',
        include: 'entire transactions'
      },
      this.adminOriginator
    )

    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 3) continue
      const domainRaw = dec.fields[0]
      const expiryRaw = dec.fields[1]
      const basketRaw = dec.fields[2]

      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const expiryDecoded = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(expiryRaw)), 10)
      const basketDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(basketRaw))
      if (domainDecoded !== originator || basketDecoded !== basket) continue
      if (!includeExpired && this.isTokenExpired(expiryDecoded)) continue

      return {
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        satoshis: out.satoshis,
        originator,
        basketName: basketDecoded,
        expiry: expiryDecoded
      }
    }
    return undefined
  }

  /** Looks for a DCAP token matching (origin, privileged, verifier, certType, fields subset). */
  private async findCertificateToken(
    originator: string,
    privileged: boolean,
    verifier: string,
    certType: string,
    fields: string[],
    includeExpired: boolean
  ): Promise<PermissionToken | undefined> {
    const result = await this.underlying.listOutputs(
      {
        basket: BASKET_MAP.certificate,
        tags: [`originator ${originator}`, `privileged ${!!privileged}`, `type ${certType}`, `verifier ${verifier}`],
        tagQueryMode: 'all',
        include: 'entire transactions'
      },
      this.adminOriginator
    )

    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 6) continue
      const [domainRaw, expiryRaw, privRaw, typeRaw, fieldsRaw, verifierRaw] = dec.fields

      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const expiryDecoded = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(expiryRaw)), 10)
      const privDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(privRaw)) === 'true'
      const typeDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(typeRaw))
      const verifierDec = Utils.toUTF8(await this.decryptPermissionTokenField(verifierRaw))

      const fieldsJson = await this.decryptPermissionTokenField(fieldsRaw)
      const allFields = JSON.parse(Utils.toUTF8(fieldsJson)) as string[]

      if (
        domainDecoded !== originator ||
        privDecoded !== !!privileged ||
        typeDecoded !== certType ||
        verifierDec !== verifier
      ) {
        continue
      }
      // Check if 'fields' is a subset of 'allFields'
      const setAll = new Set(allFields)
      if (fields.some(f => !setAll.has(f))) {
        continue
      }
      if (!includeExpired && this.isTokenExpired(expiryDecoded)) {
        continue
      }
      return {
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        satoshis: out.satoshis,
        originator,
        privileged,
        verifier: verifierDec,
        certType: typeDecoded,
        certFields: allFields,
        expiry: expiryDecoded
      }
    }
    return undefined
  }

  /** Looks for a DSAP token matching origin, returning the first one found. */
  private async findSpendingToken(originator: string): Promise<PermissionToken | undefined> {
    const result = await this.underlying.listOutputs(
      {
        basket: BASKET_MAP.spending,
        tags: [`originator ${originator}`],
        tagQueryMode: 'all',
        include: 'entire transactions'
      },
      this.adminOriginator
    )

    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 2) continue
      const domainRaw = dec.fields[0]
      const amtRaw = dec.fields[1]

      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      if (domainDecoded !== originator) continue
      const amtDecodedStr = Utils.toUTF8(await this.decryptPermissionTokenField(amtRaw))
      const authorizedAmount = parseInt(amtDecodedStr, 10)

      return {
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        satoshis: out.satoshis,
        originator,
        authorizedAmount,
        expiry: 0 // Not time-limited, monthly authorization
      }
    }
    return undefined
  }

  /**
   * Returns the current month and year in UTC as a string in the format "YYYY-MM".
   *
   * @returns {string} The current month and year in UTC.
   */
  private getCurrentMonthYearUTC(): string {
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0') // Ensure 2-digit month
    return `${year}-${month}`
  }

  /**
   * Returns spending for an originator in the current calendar month.
   */
  public async querySpentSince(token: PermissionToken): Promise<number> {
    const { actions } = await this.underlying.listActions(
      {
        labels: [`admin originator ${token.originator}`, `admin month ${this.getCurrentMonthYearUTC()}`],
        labelQueryMode: 'all'
      },
      this.adminOriginator
    )
    return actions.reduce((a, e) => a + e.satoshis, 0)
  }

  /* ---------------------------------------------------------------------
   *  5) CREATE / RENEW / REVOKE PERMISSION TOKENS ON CHAIN
   * --------------------------------------------------------------------- */

  /**
   * Creates a brand-new permission token as a single-output PushDrop script in the relevant admin basket.
   *
   * The main difference between each type of token is in the "fields" we store in the PushDrop script.
   *
   * @param r        The permission request
   * @param expiry   The expiry epoch time
   * @param amount   For DSAP, the authorized spending limit
   */
  private async createPermissionOnChain(r: PermissionRequest, expiry: number, amount?: number): Promise<void> {
    const basketName = BASKET_MAP[r.type]
    if (!basketName) return

    // Build the array of encrypted fields for the PushDrop script
    const fields: number[][] = await this.buildPushdropFields(r, expiry, amount)

    // Construct the script. We do a simple P2PK check. We ask `PushDrop.lock(...)`
    // to create a script with a single OP_CHECKSIG verifying ownership to redeem.
    const script = await new PushDrop(this.underlying).lock(
      fields,
      WalletPermissionsManager.PERM_TOKEN_ENCRYPTION_PROTOCOL,
      '1',
      'self',
      true,
      true
    )

    // Create tags
    const tags = this.buildTagsForRequest(r)

    // Build a transaction with exactly one output, no explicit inputs since the wallet
    // can internally fund it from its balance.
    await this.createAction(
      {
        description: `Grant ${r.type} permission`,
        outputs: [
          {
            lockingScript: script.toHex(),
            satoshis: 1,
            outputDescription: `${r.type} permission token`,
            basket: basketName,
            tags
          }
        ],
        options: {
          acceptDelayedBroadcast: false
        }
      },
      this.adminOriginator
    )
  }

  /**
   * Renews a permission token by spending the old token as input and creating a new token output.
   * This invalidates the old token and replaces it with a new one.
   *
   * @param oldToken The old token to consume
   * @param r        The permission request being renewed
   * @param newExpiry The new expiry epoch time
   * @param newAmount For DSAP, the new authorized amount
   */
  private async renewPermissionOnChain(
    oldToken: PermissionToken,
    r: PermissionRequest,
    newExpiry: number,
    newAmount?: number
  ): Promise<void> {
    // 1) build new fields
    const newFields = await this.buildPushdropFields(r, newExpiry, newAmount)

    // 2) new script
    const newScript = await new PushDrop(this.underlying).lock(
      newFields,
      WalletPermissionsManager.PERM_TOKEN_ENCRYPTION_PROTOCOL,
      '1',
      'self',
      true,
      true
    )

    const tags = this.buildTagsForRequest(r)

    // 3) For BRC-100, we do a "createAction" with a partial input referencing oldToken
    //    plus a single new output. We'll hydrate the template, then signAction for the wallet to finalize.
    const oldOutpoint = `${oldToken.txid}.${oldToken.outputIndex}`
    const { signableTransaction } = await this.createAction(
      {
        description: `Renew ${r.type} permission`,
        inputBEEF: oldToken.tx,
        inputs: [
          {
            outpoint: oldOutpoint,
            unlockingScriptLength: 73, // length of signature
            inputDescription: `Consume old ${r.type} token`
          }
        ],
        outputs: [
          {
            lockingScript: newScript.toHex(),
            satoshis: 1,
            outputDescription: `Renewed ${r.type} permission token`,
            basket: BASKET_MAP[r.type],
            tags
          }
        ],
        options: {
          acceptDelayedBroadcast: false
        }
      },
      this.adminOriginator
    )
    const tx = Transaction.fromBEEF(signableTransaction!.tx)
    const unlocker = new PushDrop(this.underlying).unlock(
      WalletPermissionsManager.PERM_TOKEN_ENCRYPTION_PROTOCOL,
      '1',
      'self',
      'all',
      false,
      1,
      LockingScript.fromHex(oldToken.outputScript)
    )
    const unlockingScript = await unlocker.sign(tx, 0)
    await this.underlying.signAction({
      reference: signableTransaction!.reference,
      spends: {
        0: {
          unlockingScript: unlockingScript.toHex()
        }
      }
    })
  }

  /**
   * Builds the encrypted array of fields for a PushDrop permission token
   * (protocol / basket / certificate / spending).
   */
  private async buildPushdropFields(r: PermissionRequest, expiry: number, amount?: number): Promise<number[][]> {
    switch (r.type) {
      case 'protocol': {
        const [secLevel, protoName] = r.protocolID!
        return [
          await this.encryptPermissionTokenField(r.originator), // domain
          await this.encryptPermissionTokenField(String(expiry)), // expiry
          await this.encryptPermissionTokenField(r.privileged === true ? 'true' : 'false'),
          await this.encryptPermissionTokenField(String(secLevel)),
          await this.encryptPermissionTokenField(protoName),
          await this.encryptPermissionTokenField(r.counterparty!)
        ]
      }
      case 'basket': {
        return [
          await this.encryptPermissionTokenField(r.originator),
          await this.encryptPermissionTokenField(String(expiry)),
          await this.encryptPermissionTokenField(r.basket!)
        ]
      }
      case 'certificate': {
        const { certType, fields, verifier } = r.certificate!
        return [
          await this.encryptPermissionTokenField(r.originator),
          await this.encryptPermissionTokenField(String(expiry)),
          await this.encryptPermissionTokenField(r.privileged ? 'true' : 'false'),
          await this.encryptPermissionTokenField(certType),
          await this.encryptPermissionTokenField(JSON.stringify(fields)),
          await this.encryptPermissionTokenField(verifier)
        ]
      }
      case 'spending': {
        // DSAP
        const authAmt = amount ?? (r.spending?.satoshis || 0)
        return [
          await this.encryptPermissionTokenField(r.originator),
          await this.encryptPermissionTokenField(String(authAmt))
        ]
      }
    }
  }

  /**
   * Helper to build an array of tags for the new output, matching the user request's
   * origin, basket, privileged, protocol name, etc.
   */
  private buildTagsForRequest(r: PermissionRequest): string[] {
    const tags: string[] = [`originator ${r.originator}`]
    switch (r.type) {
      case 'protocol': {
        tags.push(`privileged ${!!r.privileged}`)
        tags.push(`protocolName ${r.protocolID![1]}`)
        tags.push(`protocolSecurityLevel ${r.protocolID![0]}`)
        tags.push(`counterparty ${r.counterparty}`)
        break
      }
      case 'basket': {
        tags.push(`basket ${r.basket}`)
        break
      }
      case 'certificate': {
        tags.push(`privileged ${!!r.privileged}`)
        tags.push(`type ${r.certificate!.certType}`)
        tags.push(`verifier ${r.certificate!.verifier}`)
        break
      }
      case 'spending': {
        // Only 'originator' is strictly required as a tag.
        break
      }
    }
    return tags
  }

  /* ---------------------------------------------------------------------
   *  6) PUBLIC "LIST/HAS/REVOKE" METHODS
   * --------------------------------------------------------------------- */

  /**
   * Lists all protocol permission tokens (DPACP) with optional filters.
   * @param originator Optional originator domain to filter by
   * @param privileged Optional boolean to filter by privileged status
   * @param protocolName Optional protocol name to filter by
   * @param protocolSecurityLevel Optional protocol security level to filter by
   * @param counterparty Optional counterparty to filter by
   * @returns Array of permission tokens that match the filter criteria
   */
  public async listProtocolPermissions({
    originator,
    privileged,
    protocolName,
    protocolSecurityLevel,
    counterparty
  }: {
    originator?: string
    privileged?: boolean
    protocolName?: string
    protocolSecurityLevel?: number
    counterparty?: string
  } = {}): Promise<PermissionToken[]> {
    const basketName = BASKET_MAP.protocol
    const tags: string[] = []

    if (originator) {
      tags.push(`originator ${originator}`)
    }

    if (privileged !== undefined) {
      tags.push(`privileged ${!!privileged}`)
    }

    if (protocolName) {
      tags.push(`protocolName ${protocolName}`)
    }

    if (protocolSecurityLevel !== undefined) {
      tags.push(`protocolSecurityLevel ${protocolSecurityLevel}`)
    }

    if (counterparty) {
      tags.push(`counterparty ${counterparty}`)
    }
    const result = await this.underlying.listOutputs(
      {
        basket: basketName,
        tags,
        tagQueryMode: 'all',
        include: 'entire transactions',
        limit: 100
      },
      this.adminOriginator
    )

    const tokens: PermissionToken[] = []
    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 6) continue
      const [domainRaw, expiryRaw, privRaw, secRaw, protoRaw, cptyRaw] = dec.fields

      const domainDec = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const expiryDec = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(expiryRaw)), 10)
      const privDec = Utils.toUTF8(await this.decryptPermissionTokenField(privRaw)) === 'true'
      const secDec = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(secRaw)), 10) as 0 | 1 | 2
      const protoDec = Utils.toUTF8(await this.decryptPermissionTokenField(protoRaw))
      const cptyDec = Utils.toUTF8(await this.decryptPermissionTokenField(cptyRaw))

      tokens.push({
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        satoshis: out.satoshis,
        originator: domainDec,
        expiry: expiryDec,
        privileged: privDec,
        securityLevel: secDec,
        protocol: protoDec,
        counterparty: cptyDec
      })
    }
    return tokens
  }

  /**
   * Returns true if the originator already holds a valid unexpired protocol permission.
   * This calls `ensureProtocolPermission` with `seekPermission=false`, so it won't prompt.
   */
  public async hasProtocolPermission(params: {
    originator: string
    privileged: boolean
    protocolID: WalletProtocol
    counterparty: string
  }): Promise<boolean> {
    try {
      await this.ensureProtocolPermission({
        ...params,
        reason: 'hasProtocolPermission',
        seekPermission: false,
        usageType: 'generic'
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Lists basket permission tokens (DBAP) for a given originator or basket (or for all if not specified).
   * @param params.originator Optional originator to filter by
   * @param params.basket Optional basket name to filter by
   * @returns Array of permission tokens that match the filter criteria
   */
  public async listBasketAccess(params: { originator?: string; basket?: string } = {}): Promise<PermissionToken[]> {
    const basketName = BASKET_MAP.basket
    const tags: string[] = []

    if (params.originator) {
      tags.push(`originator ${params.originator}`)
    }

    if (params.basket) {
      tags.push(`basket ${params.basket}`)
    }
    const result = await this.underlying.listOutputs(
      {
        basket: basketName,
        tags,
        tagQueryMode: 'all',
        include: 'entire transactions',
        limit: 10000
      },
      this.adminOriginator
    )

    const tokens: PermissionToken[] = []
    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 3) continue
      const [domainRaw, expiryRaw, basketRaw] = dec.fields
      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const expiryDecoded = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(expiryRaw)), 10)
      const basketDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(basketRaw))
      tokens.push({
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        satoshis: out.satoshis,
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        originator: domainDecoded,
        basketName: basketDecoded,
        expiry: expiryDecoded
      })
    }
    return tokens
  }

  /**
   * Returns `true` if the originator already holds a valid unexpired basket permission for `basket`.
   */
  public async hasBasketAccess(params: { originator: string; basket: string }): Promise<boolean> {
    try {
      await this.ensureBasketAccess({
        originator: params.originator,
        basket: params.basket,
        seekPermission: false,
        usageType: 'insertion' // TODO: Consider a generic case for "has"
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Lists spending authorization tokens (DSAP) for a given originator (or all).
   */
  public async listSpendingAuthorizations(params: { originator?: string }): Promise<PermissionToken[]> {
    const basketName = BASKET_MAP.spending
    const tags: string[] = []
    if (params.originator) {
      tags.push(`originator ${params.originator}`)
    }
    const result = await this.underlying.listOutputs(
      {
        basket: basketName,
        tags,
        tagQueryMode: 'all',
        include: 'entire transactions',
        limit: 10000
      },
      this.adminOriginator
    )

    const tokens: PermissionToken[] = []
    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 2) continue
      const [domainRaw, amtRaw] = dec.fields
      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const amtDecodedStr = Utils.toUTF8(await this.decryptPermissionTokenField(amtRaw))
      const authorizedAmount = parseInt(amtDecodedStr, 10)
      tokens.push({
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        satoshis: out.satoshis,
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        originator: domainDecoded,
        authorizedAmount,
        expiry: 0
      })
    }
    return tokens
  }

  /**
   * Returns `true` if the originator already holds a valid spending authorization token
   * with enough available monthly spend. We do not prompt (seekPermission=false).
   */
  public async hasSpendingAuthorization(params: { originator: string; satoshis: number }): Promise<boolean> {
    try {
      await this.ensureSpendingAuthorization({
        originator: params.originator,
        satoshis: params.satoshis,
        seekPermission: false
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Lists certificate permission tokens (DCAP) with optional filters.
   * @param originator Optional originator domain to filter by
   * @param privileged Optional boolean to filter by privileged status
   * @param certType Optional certificate type to filter by
   * @param verifier Optional verifier to filter by
   * @returns Array of permission tokens that match the filter criteria
   */
  public async listCertificateAccess(
    params: {
      originator?: string
      privileged?: boolean
      certType?: Base64String
      verifier?: PubKeyHex
    } = {}
  ): Promise<PermissionToken[]> {
    const basketName = BASKET_MAP.certificate
    const tags: string[] = []

    if (params.originator) {
      tags.push(`originator ${params.originator}`)
    }

    if (params.privileged !== undefined) {
      tags.push(`privileged ${!!params.privileged}`)
    }

    if (params.certType) {
      tags.push(`type ${params.certType}`)
    }

    if (params.verifier) {
      tags.push(`verifier ${params.verifier}`)
    }
    const result = await this.underlying.listOutputs(
      {
        basket: basketName,
        tags,
        tagQueryMode: 'all',
        include: 'entire transactions',
        limit: 10000
      },
      this.adminOriginator
    )

    const tokens: PermissionToken[] = []
    for (const out of result.outputs) {
      const [txid, outputIndexStr] = out.outpoint.split('.')
      const tx = Transaction.fromBEEF(result.BEEF!, txid)
      const dec = PushDrop.decode(tx.outputs[Number(outputIndexStr)].lockingScript)
      if (!dec?.fields || dec.fields.length < 6) continue
      const [domainRaw, expiryRaw, privRaw, typeRaw, fieldsRaw, verifierRaw] = dec.fields
      const domainDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(domainRaw))
      const expiryDecoded = parseInt(Utils.toUTF8(await this.decryptPermissionTokenField(expiryRaw)), 10)
      const privDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(privRaw)) === 'true'
      const typeDecoded = Utils.toUTF8(await this.decryptPermissionTokenField(typeRaw))
      const verifierDec = Utils.toUTF8(await this.decryptPermissionTokenField(verifierRaw))
      const fieldsJson = await this.decryptPermissionTokenField(fieldsRaw)
      const allFields = JSON.parse(Utils.toUTF8(fieldsJson)) as string[]
      tokens.push({
        tx: tx.toBEEF(),
        txid: out.outpoint.split('.')[0],
        outputIndex: parseInt(out.outpoint.split('.')[1], 10),
        satoshis: out.satoshis,
        outputScript: tx.outputs[Number(outputIndexStr)].lockingScript.toHex(),
        originator: domainDecoded,
        privileged: privDecoded,
        certType: typeDecoded,
        certFields: allFields,
        verifier: verifierDec,
        expiry: expiryDecoded
      })
    }
    return tokens
  }

  /**
   * Returns `true` if the originator already holds a valid unexpired certificate access
   * for the given certType/fields. Does not prompt the user.
   */
  public async hasCertificateAccess(params: {
    originator: string
    privileged: boolean
    verifier: string
    certType: string
    fields: string[]
  }): Promise<boolean> {
    try {
      await this.ensureCertificateAccess({
        originator: params.originator,
        privileged: params.privileged,
        verifier: params.verifier,
        certType: params.certType,
        fields: params.fields,
        seekPermission: false,
        usageType: 'disclosure'
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Revokes a permission token by spending it with no replacement output.
   * The manager builds a BRC-100 transaction that consumes the token, effectively invalidating it.
   */
  public async revokePermission(oldToken: PermissionToken): Promise<void> {
    const oldOutpoint = `${oldToken.txid}.${oldToken.outputIndex}`
    const { signableTransaction } = await this.createAction(
      {
        description: `Revoke permission`,
        inputBEEF: oldToken.tx,
        inputs: [
          {
            outpoint: oldOutpoint,
            unlockingScriptLength: 73, // length of signature
            inputDescription: `Consume old permission token`
          }
        ],
        options: {
          acceptDelayedBroadcast: false
        }
      },
      this.adminOriginator
    )
    const tx = Transaction.fromBEEF(signableTransaction!.tx)
    const unlocker = new PushDrop(this.underlying).unlock(
      WalletPermissionsManager.PERM_TOKEN_ENCRYPTION_PROTOCOL,
      '1',
      'self',
      'all',
      false,
      1,
      LockingScript.fromHex(oldToken.outputScript)
    )
    const unlockingScript = await unlocker.sign(tx, 0)
    await this.underlying.signAction({
      reference: signableTransaction!.reference,
      spends: {
        0: {
          unlockingScript: unlockingScript.toHex()
        }
      }
    })
  }

  /* ---------------------------------------------------------------------
   *  7) BRC-100 WALLET INTERFACE FORWARDING WITH PERMISSION CHECKS
   * --------------------------------------------------------------------- */

  public async createAction(
    args: Parameters<WalletInterface['createAction']>[0],
    originator?: string
  ): ReturnType<WalletInterface['createAction']> {
    // 1) Ensure basket and label permissions
    if (args.outputs) {
      for (const out of args.outputs) {
        if (out.basket) {
          await this.ensureBasketAccess({
            originator: originator!,
            basket: out.basket,
            reason: args.description,
            usageType: 'insertion'
          })
        }
      }
    }
    if (args.labels) {
      for (const lbl of args.labels) {
        await this.ensureLabelAccess({
          originator: originator!,
          label: lbl,
          reason: args.description,
          usageType: 'apply'
        })
      }
    }

    /**
     * 2) Force signAndProcess=false unless the originator is admin and explicitly sets it to true.
     *    This ensures the underlying wallet returns a signableTransaction, letting us parse the transaction
     *    to determine net spending and request authorization if needed.
     */
    const modifiedOptions = { ...(args.options || {}) }
    if (modifiedOptions.signAndProcess !== true) {
      modifiedOptions.signAndProcess = false
    } else if (!this.isAdminOriginator(originator!)) {
      throw new Error('Only the admin originator can set signAndProcess=true explicitly.')
    }

    // 3) Encrypt transaction metadata, saving originals for use in permissions and line items.
    const originalDescription = args.description
    const originalInputDescriptions = {}
    const originalOutputDescriptions = {}
    args.description = await this.maybeEncryptMetadata(args.description)
    for (let i = 0; i < (args.inputs || []).length; i++) {
      if (args.inputs![i].inputDescription) {
        originalInputDescriptions[i] = args.inputs![i].inputDescription
        args.inputs![i].inputDescription = await this.maybeEncryptMetadata(args.inputs![i].inputDescription)
      }
    }
    for (let i = 0; i < (args.outputs || []).length; i++) {
      if (args.outputs![i].outputDescription) {
        originalOutputDescriptions[i] = args.outputs![i].outputDescription
        args.outputs![i].outputDescription = await this.maybeEncryptMetadata(args.outputs![i].outputDescription)
      }
      if (args.outputs![i].customInstructions) {
        args.outputs![i].customInstructions = await this.maybeEncryptMetadata(args.outputs![i].customInstructions!)
      }
    }

    /**
     * 4) Call the underlying wallet’s createAction. We add two “admin” labels:
     *    - "admin originator <domain>"
     *    - "admin month YYYY-MM"
     *    These labels help track the originator’s monthly spending.
     */
    const createResult = await this.underlying.createAction(
      {
        ...args,
        options: modifiedOptions,
        labels: [
          ...(args.labels || []),
          `admin originator ${originator}`,
          `admin month ${this.getCurrentMonthYearUTC()}`
        ]
      },
      originator
    )

    // If there's no signableTransaction, the underlying wallet must have fully finalized it. Return as is.
    if (!createResult.signableTransaction) {
      return createResult
    }

    /**
     * 5) We have a signable transaction. Parse it to determine how much the originator is actually spending.
     *    We only consider inputs the originator explicitly listed in args.inputs.
     *    netSpent = (sum of originator-requested outputs) - (sum of matching originator inputs).
     *    If netSpent > 0, we need spending authorization.
     */
    const tx = Transaction.fromAtomicBEEF(createResult.signableTransaction.tx)
    const reference = createResult.signableTransaction.reference

    let netSpent = 0
    const lineItems: Array<{
      type: 'input' | 'output' | 'fee'
      description: string
      satoshis: number
    }> = []

    // Sum originator-provided inputs:
    let totalInputSatoshis = 0
    for (const input of tx.inputs) {
      const outpoint = `${input.sourceTXID}.${input.sourceOutputIndex}`
      const matchingIndex = (args.inputs || []).findIndex(i => i.outpoint === outpoint)
      if (matchingIndex !== -1) {
        const satoshis = input.sourceTransaction!.outputs[input.sourceOutputIndex].satoshis
        totalInputSatoshis += satoshis!
        lineItems.push({
          type: 'input',
          description: originalInputDescriptions[matchingIndex] || 'No input description provided',
          satoshis: satoshis!
        })
      }
    }

    // Sum originator-requested outputs:
    const totalOutputSatoshis = (args.outputs || []).reduce((acc, out) => acc + out.satoshis, 0)
    for (const outIndex in args.outputs || []) {
      const out = args.outputs![outIndex]
      lineItems.push({
        type: 'output',
        satoshis: out.satoshis,
        description: originalOutputDescriptions[outIndex] || 'No output description provided'
      })
    }

    // Add an entry for the transaction fee:
    lineItems.push({
      type: 'fee',
      satoshis: tx.getFee(),
      description: 'Network fee'
    })

    /**
     * When it comes to spending authorizations, and the computation of net spend, there are
     * two types of inputs and two types of outputs:
     *
     * There are foreign (originator-requested) ones, and domestic (internally-provided) ones.
     * The net spend is always calculated from the domestic, internal perspective. Therefore, the
     * cost of funding the foreign outputs is the base cost to the domestic user, unless this is
     * somehow offset.
     *
     * The only way to offset this cost is when the foreign inputs help carry some of the burden.
     * This is why we can subtract the sum of the foreign inputs from the sum of foreign outputs,
     * to gague how much of that cost needs to be born domestically by the user.
     *
     * The logic does not need to account for whatever domestic inputs are provided, or whatever
     * domestic outputs are re-captured by the wallet back as change. The wallet could conceivably
     * provide 21e8 satoshis as input and re-capture the same amount as change, but the net effect
     * on actual spending would be zero. Therefore, we base net spend on total foreign outflows
     * minus total foreign inflows. Fees are also considered.
     */
    netSpent = totalOutputSatoshis + tx.getFee() - totalInputSatoshis

    // 6) If netSpent > 0, require spending authorization. Abort if denied.
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

    /**
     * 7) Decide whether to finalize the transaction automatically or return the signableTransaction:
     *    - If the user originally wanted signAndProcess (the default when undefined), we forcibly set it to false earlier, so check if we should now finalize it.
     *    - If the transaction still needs more signatures, we must return the signableTransaction.
     */
    const vargs = validateCreateActionArgs(args)
    if (vargs.isSignAction) {
      return createResult
    }

    const signResult = await this.underlying.signAction({ reference, spends: {}, options: args.options }, originator)
    // Merge signResult into createResult and remove signableTransaction:
    return {
      ...createResult,
      ...signResult,
      signableTransaction: undefined
    }
  }

  public async signAction(
    ...args: Parameters<WalletInterface['signAction']>
  ): ReturnType<WalletInterface['signAction']> {
    return this.underlying.signAction(...args)
  }

  public async abortAction(
    ...args: Parameters<WalletInterface['abortAction']>
  ): ReturnType<WalletInterface['abortAction']> {
    return this.underlying.abortAction(...args)
  }

  public async listActions(
    ...args: Parameters<WalletInterface['listActions']>
  ): ReturnType<WalletInterface['listActions']> {
    const [requestArgs, originator] = args
    // for each label, ensure label access
    if (requestArgs.labels) {
      for (const lbl of requestArgs.labels) {
        await this.ensureLabelAccess({
          originator: originator!,
          label: lbl,
          reason: 'listActions',
          usageType: 'list'
        })
      }
    }
    const results = await this.underlying.listActions(...args)
    // Transparently decrypt transaction metadata, if configured to do so.
    if (results.actions) {
      for (let i = 0; i < results.actions.length; i++) {
        if (results.actions[i].description) {
          results.actions[i].description = await this.maybeDecryptMetadata(results.actions[i].description)
        }
        if (results.actions[i].inputs) {
          for (let j = 0; j < results.actions[i].inputs!.length; j++) {
            if (results.actions[i].inputs![j].inputDescription) {
              results.actions[i].inputs![j].inputDescription = await this.maybeDecryptMetadata(
                results.actions[i].inputs![j].inputDescription
              )
            }
          }
        }
        if (results.actions[i].outputs) {
          for (let j = 0; j < results.actions[i].outputs!.length; j++) {
            if (results.actions[i].outputs![j].outputDescription) {
              results.actions[i].outputs![j].outputDescription = await this.maybeDecryptMetadata(
                results.actions[i].outputs![j].outputDescription
              )
            }
            if (results.actions[i].outputs![j].customInstructions) {
              results.actions[i].outputs![j].customInstructions = await this.maybeDecryptMetadata(
                results.actions[i].outputs![j].customInstructions!
              )
            }
          }
        }
      }
    }
    return results
  }

  public async internalizeAction(
    ...args: Parameters<WalletInterface['internalizeAction']>
  ): ReturnType<WalletInterface['internalizeAction']> {
    const [requestArgs, originator] = args
    // If the transaction is inserting outputs into baskets, we also ensure basket permission
    for (const outIndex in requestArgs.outputs) {
      const out = requestArgs.outputs[outIndex]
      if (out.protocol === 'basket insertion') {
        await this.ensureBasketAccess({
          originator: originator!,
          basket: out.insertionRemittance!.basket,
          reason: requestArgs.description,
          usageType: 'insertion'
        })
        if (out.insertionRemittance!.customInstructions) {
          requestArgs.outputs[outIndex].insertionRemittance!.customInstructions = await this.maybeEncryptMetadata(
            out.insertionRemittance!.customInstructions
          )
        }
      }
    }
    return this.underlying.internalizeAction(...args)
  }

  public async listOutputs(
    ...args: Parameters<WalletInterface['listOutputs']>
  ): ReturnType<WalletInterface['listOutputs']> {
    const [requestArgs, originator] = args
    // Ensure the originator has permission for the basket.
    await this.ensureBasketAccess({
      originator: originator!,
      basket: requestArgs.basket,
      reason: 'listOutputs',
      usageType: 'listing'
    })
    const results = await this.underlying.listOutputs(...args)
    // Transparently decrypt transaction metadata, if configured to do so.
    if (results.outputs) {
      for (let i = 0; i < results.outputs.length; i++) {
        if (results.outputs[i].customInstructions) {
          results.outputs[i].customInstructions = await this.maybeDecryptMetadata(
            results.outputs[i].customInstructions!
          )
        }
      }
    }
    return results
  }

  public async relinquishOutput(
    ...args: Parameters<WalletInterface['relinquishOutput']>
  ): ReturnType<WalletInterface['relinquishOutput']> {
    const [requestArgs, originator] = args
    await this.ensureBasketAccess({
      originator: originator!,
      basket: requestArgs.basket,
      reason: 'relinquishOutput',
      usageType: 'removal'
    })
    return this.underlying.relinquishOutput(...args)
  }

  public async getPublicKey(
    ...args: Parameters<WalletInterface['getPublicKey']>
  ): ReturnType<WalletInterface['getPublicKey']> {
    const [requestArgs, originator] = args
    if (requestArgs.protocolID) {
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: requestArgs.privileged!,
        protocolID: requestArgs.protocolID,
        counterparty: requestArgs.counterparty || 'self',
        reason: requestArgs.privilegedReason,
        usageType: 'publicKey'
      })
    }
    if (requestArgs.identityKey) {
      // We also require a minimal protocol permission to retrieve the user's identity key
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: requestArgs.privileged!,
        protocolID: [1, 'identity key retrieval'],
        counterparty: 'self',
        reason: requestArgs.privilegedReason,
        usageType: 'identityKey'
      })
    }
    return this.underlying.getPublicKey(...args)
  }

  public async revealCounterpartyKeyLinkage(
    ...args: Parameters<WalletInterface['revealCounterpartyKeyLinkage']>
  ): ReturnType<WalletInterface['revealCounterpartyKeyLinkage']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: [2, `counterparty key linkage revelation ${requestArgs.counterparty}`],
      counterparty: requestArgs.verifier,
      reason: requestArgs.privilegedReason,
      usageType: 'linkageRevelation'
    })
    return this.underlying.revealCounterpartyKeyLinkage(...args)
  }

  public async revealSpecificKeyLinkage(
    ...args: Parameters<WalletInterface['revealSpecificKeyLinkage']>
  ): ReturnType<WalletInterface['revealSpecificKeyLinkage']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: [
        2,
        `specific key linkage revelation ${requestArgs.protocolID[1]} ${requestArgs.protocolID[0] === 2 ? requestArgs.keyID : 'all'}`
      ],
      counterparty: requestArgs.verifier,
      reason: requestArgs.privilegedReason,
      usageType: 'linkageRevelation'
    })
    return this.underlying.revealSpecificKeyLinkage(...args)
  }

  public async encrypt(...args: Parameters<WalletInterface['encrypt']>): ReturnType<WalletInterface['encrypt']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      protocolID: requestArgs.protocolID,
      privileged: requestArgs.privileged!,
      counterparty: requestArgs.counterparty || 'self',
      reason: requestArgs.privilegedReason,
      usageType: 'encrypting'
    })
    return this.underlying.encrypt(...args)
  }

  public async decrypt(...args: Parameters<WalletInterface['decrypt']>): ReturnType<WalletInterface['decrypt']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: requestArgs.protocolID,
      counterparty: requestArgs.counterparty || 'self',
      reason: requestArgs.privilegedReason,
      usageType: 'encrypting'
    })
    return this.underlying.decrypt(...args)
  }

  public async createHmac(
    ...args: Parameters<WalletInterface['createHmac']>
  ): ReturnType<WalletInterface['createHmac']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: requestArgs.protocolID,
      counterparty: requestArgs.counterparty || 'self',
      reason: requestArgs.privilegedReason,
      usageType: 'hmac'
    })
    return this.underlying.createHmac(...args)
  }

  public async verifyHmac(
    ...args: Parameters<WalletInterface['verifyHmac']>
  ): ReturnType<WalletInterface['verifyHmac']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: requestArgs.protocolID,
      counterparty: requestArgs.counterparty || 'self',
      reason: requestArgs.privilegedReason,
      usageType: 'hmac'
    })
    return this.underlying.verifyHmac(...args)
  }

  public async createSignature(
    ...args: Parameters<WalletInterface['createSignature']>
  ): ReturnType<WalletInterface['createSignature']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: requestArgs.protocolID,
      counterparty: requestArgs.counterparty || 'self',
      reason: requestArgs.privilegedReason,
      usageType: 'signing'
    })
    return this.underlying.createSignature(...args)
  }

  public async verifySignature(
    ...args: Parameters<WalletInterface['verifySignature']>
  ): ReturnType<WalletInterface['verifySignature']> {
    const [requestArgs, originator] = args
    await this.ensureProtocolPermission({
      originator: originator!,
      privileged: requestArgs.privileged!,
      protocolID: requestArgs.protocolID,
      counterparty: requestArgs.counterparty || 'self',
      reason: requestArgs.privilegedReason,
      usageType: 'signing'
    })
    return this.underlying.verifySignature(...args)
  }

  public async acquireCertificate(
    ...args: Parameters<WalletInterface['acquireCertificate']>
  ): ReturnType<WalletInterface['acquireCertificate']> {
    const [requestArgs, originator] = args
    if (this.config.seekCertificateAcquisitionPermissions) {
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: requestArgs.privileged!,
        protocolID: [1, `certificate acquisition ${requestArgs.type}`],
        counterparty: 'self',
        reason: requestArgs.privilegedReason,
        usageType: 'generic'
      })
    }
    return this.underlying.acquireCertificate(...args)
  }

  public async listCertificates(
    ...args: Parameters<WalletInterface['listCertificates']>
  ): ReturnType<WalletInterface['listCertificates']> {
    const [requestArgs, originator] = args
    if (this.config.seekCertificateListingPermissions) {
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: requestArgs.privileged!,
        protocolID: [1, `certificate list`],
        counterparty: 'self',
        reason: requestArgs.privilegedReason,
        usageType: 'generic'
      })
    }
    return this.underlying.listCertificates(...args)
  }

  public async proveCertificate(
    ...args: Parameters<WalletInterface['proveCertificate']>
  ): ReturnType<WalletInterface['proveCertificate']> {
    const [requestArgs, originator] = args
    await this.ensureCertificateAccess({
      originator: originator!,
      privileged: requestArgs.privileged!,
      verifier: requestArgs.verifier,
      certType: requestArgs.certificate.type!,
      fields: requestArgs.fieldsToReveal,
      reason: 'proveCertificate',
      usageType: 'disclosure'
    })
    return this.underlying.proveCertificate(...args)
  }

  public async relinquishCertificate(
    ...args: Parameters<WalletInterface['relinquishCertificate']>
  ): ReturnType<WalletInterface['relinquishCertificate']> {
    const [requestArgs, originator] = args
    if (this.config.seekCertificateRelinquishmentPermissions) {
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: (requestArgs as any).privileged ? true : false,
        protocolID: [1, `certificate relinquishment ${requestArgs.type}`],
        counterparty: 'self',
        reason: (requestArgs as any).privilegedReason || 'relinquishCertificate',
        usageType: 'generic'
      })
    }
    return this.underlying.relinquishCertificate(...args)
  }

  public async discoverByIdentityKey(
    ...args: Parameters<WalletInterface['discoverByIdentityKey']>
  ): ReturnType<WalletInterface['discoverByIdentityKey']> {
    const [_, originator] = args
    if (this.config.seekPermissionsForIdentityResolution) {
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: false,
        protocolID: [1, `identity resolution`],
        counterparty: 'self',
        reason: 'discoverByIdentityKey',
        usageType: 'generic'
      })
    }
    return this.underlying.discoverByIdentityKey(...args)
  }

  public async discoverByAttributes(
    ...args: Parameters<WalletInterface['discoverByAttributes']>
  ): ReturnType<WalletInterface['discoverByAttributes']> {
    const [_, originator] = args
    if (this.config.seekPermissionsForIdentityResolution) {
      await this.ensureProtocolPermission({
        originator: originator!,
        privileged: false,
        protocolID: [1, `identity resolution`],
        counterparty: 'self',
        reason: 'discoverByAttributes',
        usageType: 'generic'
      })
    }
    return this.underlying.discoverByAttributes(...args)
  }

  public async isAuthenticated(
    ...args: Parameters<WalletInterface['isAuthenticated']>
  ): ReturnType<WalletInterface['isAuthenticated']> {
    return this.underlying.isAuthenticated(...args)
  }

  public async waitForAuthentication(
    ...args: Parameters<WalletInterface['waitForAuthentication']>
  ): ReturnType<WalletInterface['waitForAuthentication']> {
    const [_, originator] = args
    if (this.config.seekGroupedPermission && originator) {
      // 1. Fetch manifest.json from the originator
      let groupPermissions: GroupedPermissions | undefined
      try {
        const proto = originator.startsWith('localhost:') ? 'http' : 'https'
        const response = await fetch(`${proto}://${originator}/manifest.json`)
        if (response.ok) {
          const manifest = await response.json()
          if (manifest?.babbage?.groupPermissions) {
            groupPermissions = manifest.babbage.groupPermissions
          }
        }
      } catch (e) {
        // Ignore fetch/parse errors, just proceed without group permissions.
      }

      if (groupPermissions) {
        // 2. Filter out already-granted permissions
        const permissionsToRequest: GroupedPermissions = {
          protocolPermissions: [],
          basketAccess: [],
          certificateAccess: []
        }

        if (groupPermissions.spendingAuthorization) {
          const hasAuth = await this.hasSpendingAuthorization({
            originator,
            satoshis: groupPermissions.spendingAuthorization.amount
          })
          if (!hasAuth) {
            permissionsToRequest.spendingAuthorization = groupPermissions.spendingAuthorization
          }
        }

        for (const p of groupPermissions.protocolPermissions || []) {
          const hasPerm = await this.hasProtocolPermission({
            originator,
            privileged: false, // Privilege is never allowed here
            protocolID: p.protocolID,
            counterparty: p.counterparty || 'self'
          })
          if (!hasPerm) {
            permissionsToRequest.protocolPermissions!.push(p)
          }
        }

        for (const b of groupPermissions.basketAccess || []) {
          const hasAccess = await this.hasBasketAccess({
            originator,
            basket: b.basket
          })
          if (!hasAccess) {
            permissionsToRequest.basketAccess!.push(b)
          }
        }

        for (const c of groupPermissions.certificateAccess || []) {
          const hasAccess = await this.hasCertificateAccess({
            originator,
            privileged: false, // Privilege is never allowed here for security
            verifier: c.verifierPublicKey,
            certType: c.type,
            fields: c.fields
          })
          if (!hasAccess) {
            permissionsToRequest.certificateAccess!.push(c)
          }
        }

        // 3. If any permissions are left to request, start the flow
        const hasRequests =
          permissionsToRequest.spendingAuthorization ||
          (permissionsToRequest.protocolPermissions?.length ?? 0) > 0 ||
          (permissionsToRequest.basketAccess?.length ?? 0) > 0 ||
          (permissionsToRequest.certificateAccess?.length ?? 0) > 0

        if (hasRequests) {
          const key = `group:${originator}`
          if (this.activeRequests.has(key)) {
            // Another call is already waiting, piggyback on it
            await new Promise<boolean>((resolve, reject) => {
              this.activeRequests.get(key)!.pending.push({ resolve, reject })
            })
          } else {
            // This is the first call, create a new request
            try {
              await new Promise<boolean>(async (resolve, reject) => {
                this.activeRequests.set(key, {
                  request: { originator, permissions: permissionsToRequest },
                  pending: [{ resolve, reject }]
                })

                await this.callEvent('onGroupedPermissionRequested', {
                  requestID: key,
                  originator,
                  permissions: permissionsToRequest
                })
              })
            } catch (e) {
              // Permission was denied, re-throw to stop execution
              throw e
            }
          }
        }
      }
    }

    // Finally, after handling grouped permissions, call the underlying method.
    return this.underlying.waitForAuthentication(...args)
  }

  public async getHeight(...args: Parameters<WalletInterface['getHeight']>): ReturnType<WalletInterface['getHeight']> {
    return this.underlying.getHeight(...args)
  }

  public async getHeaderForHeight(
    ...args: Parameters<WalletInterface['getHeaderForHeight']>
  ): ReturnType<WalletInterface['getHeaderForHeight']> {
    return this.underlying.getHeaderForHeight(...args)
  }

  public async getNetwork(
    ...args: Parameters<WalletInterface['getNetwork']>
  ): ReturnType<WalletInterface['getNetwork']> {
    return this.underlying.getNetwork(...args)
  }

  public async getVersion(
    ...args: Parameters<WalletInterface['getVersion']>
  ): ReturnType<WalletInterface['getVersion']> {
    return this.underlying.getVersion(...args)
  }

  /* ---------------------------------------------------------------------
   *  8) INTERNAL HELPER UTILITIES
   * --------------------------------------------------------------------- */

  /** Returns true if the specified origin is the admin originator. */
  private isAdminOriginator(originator: string): boolean {
    return originator === this.adminOriginator
  }

  /**
   * Checks if the given protocol is admin-reserved per BRC-100 rules:
   *
   *  - Must not start with `admin` (admin-reserved)
   *  - Must not start with `p ` (allows for future specially permissioned protocols)
   *
   * If it violates these rules and the caller is not admin, we consider it "admin-only."
   */
  private isAdminProtocol(proto: WalletProtocol): boolean {
    const protocolName = proto[1]
    if (protocolName.startsWith('admin') || protocolName.startsWith('p ')) {
      return true
    }
    return false
  }

  /**
   * Checks if the given label is admin-reserved per BRC-100 rules:
   *
   *  - Must not start with `admin` (admin-reserved)
   *
   * If it violates these rules and the caller is not admin, we consider it "admin-only."
   */
  private isAdminLabel(label: string): boolean {
    if (label.startsWith('admin')) {
      return true
    }
    return false
  }

  /**
   * Checks if the given basket is admin-reserved per BRC-100 rules:
   *
   *  - Must not start with `admin`
   *  - Must not be `default` (some wallets use this for internal operations)
   *  - Must not start with `p ` (future specially permissioned baskets)
   */
  private isAdminBasket(basket: string): boolean {
    if (basket === 'default') return true
    if (basket.startsWith('admin')) return true
    if (basket.startsWith('p ')) return true
    return false
  }

  /**
   * Returns true if we have a cached record that the permission identified by
   * `key` is valid and unexpired.
   */
  private isPermissionCached(key: string): boolean {
    const entry = this.permissionCache.get(key)
    if (!entry) return false
    if (Date.now() - entry.cachedAt > WalletPermissionsManager.CACHE_TTL_MS) {
      this.permissionCache.delete(key)
      return false
    }
    if (this.isTokenExpired(entry.expiry)) {
      this.permissionCache.delete(key)
      return false
    }
    return true
  }

  /** Caches the fact that the permission for `key` is valid until `expiry`. */
  private cachePermission(key: string, expiry: number): void {
    this.permissionCache.set(key, { expiry, cachedAt: Date.now() })
  }

  /**
   * Builds a "map key" string so that identical requests (e.g. "protocol:domain:true:protoName:counterparty")
   * do not produce multiple user prompts.
   */
  private buildRequestKey(r: PermissionRequest): string {
    switch (r.type) {
      case 'protocol':
        return `proto:${r.originator}:${!!r.privileged}:${r.protocolID?.join(',')}:${r.counterparty}`
      case 'basket':
        return `basket:${r.originator}:${r.basket}`
      case 'certificate':
        return `cert:${r.originator}:${!!r.privileged}:${r.certificate?.verifier}:${r.certificate?.certType}:${r.certificate?.fields.join('|')}`
      case 'spending':
        return `spend:${r.originator}`
    }
  }
}
