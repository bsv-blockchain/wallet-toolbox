import {
  AbortActionArgs,
  AcquireCertificateArgs,
  AcquisitionProtocol,
  AtomicBEEF,
  Base64String,
  BasketInsertion,
  BasketStringUnder300Bytes,
  Beef,
  BEEF,
  BooleanDefaultFalse,
  BooleanDefaultTrue,
  CertificateFieldNameUnder50Bytes,
  CreateActionArgs,
  CreateActionInput,
  CreateActionOptions,
  CreateActionOutput,
  DescriptionString5to50Bytes,
  DiscoverByAttributesArgs,
  DiscoverByIdentityKeyArgs,
  HexString,
  InternalizeActionArgs,
  InternalizeOutput,
  KeyringRevealer,
  LabelStringUnder300Bytes,
  ListActionsArgs,
  ListCertificatesArgs,
  ListOutputsArgs,
  OutpointString,
  OutputTagStringUnder300Bytes,
  PositiveInteger,
  PositiveIntegerDefault10Max10000,
  PositiveIntegerOrZero,
  ProveCertificateArgs,
  PubKeyHex,
  RelinquishCertificateArgs,
  RelinquishOutputArgs,
  SatoshiValue,
  SignActionArgs,
  SignActionOptions,
  SignActionSpend,
  TrustSelf,
  TXIDHexString,
  Utils,
  WalletPayment
} from '@bsv/sdk'
import { OutPoint } from './types'
import { WERR_INTERNAL, WERR_INVALID_PARAMETER } from './WERR_errors'

export function parseWalletOutpoint(outpoint: string): {
  txid: string
  vout: number
} {
  const [txid, vout] = outpoint.split('.')
  return { txid, vout: Number(vout) }
}

function defaultTrue(v?: boolean) {
  return v ?? true
}
function defaultFalse(v?: boolean) {
  return v ?? false
}
function defaultZero(v?: number) {
  return v ?? 0
}
function default0xffffffff(v?: number) {
  return v ?? 0xffffffff
}
function defaultOne(v?: number) {
  return v ?? 1
}
function defaultEmpty<T>(v?: T[]) {
  return v ?? []
}

function validateOptionalStringLength(
  s: string | undefined,
  name: string,
  min?: number,
  max?: number
): string | undefined {
  if (s === undefined) return undefined
  return validateStringLength(s, name, min, max)
}

export function validateSatoshis(v: number | undefined, name: string, min?: number): number {
  if (v === undefined || !Number.isInteger(v) || v < 0 || v > 21e14)
    throw new WERR_INVALID_PARAMETER(name, 'a valid number of satoshis')
  if (min !== undefined && v < min) throw new WERR_INVALID_PARAMETER(name, `at least ${min} satoshis.`)
  return v
}

export function validateOptionalInteger(
  v: number | undefined,
  name: string,
  min?: number,
  max?: number
): number | undefined {
  if (v === undefined) return undefined
  return validateInteger(v, name, undefined, min, max)
}

export function validateInteger(
  v: number | undefined,
  name: string,
  defaultValue?: number,
  min?: number,
  max?: number
): number {
  if (v === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new WERR_INVALID_PARAMETER(name, 'a valid integer')
  }
  if (!Number.isInteger(v)) throw new WERR_INVALID_PARAMETER(name, 'an integer')
  v = Number(v)
  if (min !== undefined && v < min) throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && v > max) throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)
  return v
}

export function validatePositiveIntegerOrZero(v: number, name: string): number {
  return validateInteger(v, name, 0, 0)
}

export function validateStringLength(s: string, name: string, min?: number, max?: number): string {
  const bytes = Utils.toArray(s, 'utf8').length
  if (min !== undefined && bytes < min) throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && bytes > max) throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)
  return s
}

function validateOptionalBasket(s?: string): string | undefined {
  if (s === undefined) return undefined
  return validateBasket(s)
}

function validateBasket(s: string): string {
  return validateIdentifier(s, 'basket', 1, 300)
}

function validateLabel(s: string): string {
  return validateIdentifier(s, 'label', 1, 300)
}

function validateTag(s: string): string {
  return validateIdentifier(s, 'tag', 1, 300)
}

function validateIdentifier(s: string, name: string, min?: number, max?: number): string {
  s = s.trim().toLowerCase()
  const bytes = Utils.toArray(s, 'utf8').length
  if (min !== undefined && bytes < min) throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && bytes > max) throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)
  return s
}

function validateOptionalBase64String(
  s: string | undefined,
  name: string,
  min?: number,
  max?: number
): string | undefined {
  if (s === undefined) return undefined
  return validateBase64String(s, name, min, max)
}

function validateBase64String(s: string, name: string, min?: number, max?: number): string {
  // Remove any whitespace and check if the string length is valid for Base64
  s = s.trim()
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  const paddingMatch = /=+$/.exec(s)
  const paddingCount = paddingMatch ? paddingMatch[0].length : 0

  if (paddingCount > 2 || (s.length % 4 !== 0 && paddingCount !== 0) || !base64Regex.test(s)) {
    throw new WERR_INVALID_PARAMETER(name, `balid base64 string`)
  }

  const bytes = Utils.toArray(s, 'base64').length
  if (min !== undefined && bytes < min) throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && bytes > max) throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)

  return s
}

function validateOptionalHexString(
  s: string | undefined,
  name: string,
  min?: number,
  max?: number
): string | undefined {
  if (s === undefined) return undefined
  return validateHexString(s, name, min, max)
}

/**
 * @param s
 * @param name
 * @param min if valid, string length minimum (not bytes)
 * @param max if valid, string length maximum (not bytes)
 * @returns
 */
function validateHexString(s: string, name: string, min?: number, max?: number): string {
  s = s.trim().toLowerCase()
  if (s.length % 2 === 1) throw new WERR_INVALID_PARAMETER(name, `even length, not ${s.length}.`)
  const hexRegex = /^[0-9A-Fa-f]+$/
  if (!hexRegex.test(s)) throw new WERR_INVALID_PARAMETER(name, `hexadecimal string.`)
  if (min !== undefined && s.length < min) throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && s.length > max) throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)
  return s
}

export function isHexString(s: string): boolean {
  s = s.trim()
  if (s.length % 2 === 1) return false
  const hexRegex = /^[0-9A-Fa-f]+$/
  if (!hexRegex.test(s)) return false
  return true
}

/**
 * @typedef {string & { minLength: 5, maxLength: 2000 }} DescriptionString5to2000Bytes
 * A string used for descriptions, with a length between 5 and 2000 characters.
 */
export type DescriptionString5to2000Bytes = string

export interface ValidWalletSignerArgs {}

export interface ValidCreateActionInput {
  outpoint: OutPoint
  inputDescription: DescriptionString5to2000Bytes
  sequenceNumber: PositiveIntegerOrZero
  unlockingScript?: HexString
  unlockingScriptLength: PositiveInteger
}

export function validateCreateActionInput(i: CreateActionInput): ValidCreateActionInput {
  if (i.unlockingScript === undefined && i.unlockingScriptLength === undefined)
    throw new WERR_INVALID_PARAMETER('unlockingScript, unlockingScriptLength', `at least one valid value.`)
  const unlockingScript = validateOptionalHexString(i.unlockingScript, 'unlockingScript')
  const unlockingScriptLength = i.unlockingScriptLength ?? unlockingScript!.length / 2
  if (unlockingScript && unlockingScriptLength !== unlockingScript.length / 2)
    throw new WERR_INVALID_PARAMETER('unlockingScriptLength', `length unlockingScript if both valid.`)
  const vi: ValidCreateActionInput = {
    outpoint: parseWalletOutpoint(i.outpoint),
    inputDescription: validateStringLength(i.inputDescription, 'inputDescription', 5, 2000),
    unlockingScript,
    unlockingScriptLength,
    sequenceNumber: default0xffffffff(i.sequenceNumber)
  }
  return vi
}

export interface ValidCreateActionOutput {
  lockingScript: HexString
  satoshis: SatoshiValue
  outputDescription: DescriptionString5to2000Bytes
  basket?: BasketStringUnder300Bytes
  customInstructions?: string
  tags: BasketStringUnder300Bytes[]
}

export function validateCreateActionOutput(o: CreateActionOutput): ValidCreateActionOutput {
  const vo: ValidCreateActionOutput = {
    lockingScript: validateHexString(o.lockingScript, 'lockingScript'),
    satoshis: validateSatoshis(o.satoshis, 'satoshis'),
    outputDescription: validateStringLength(o.outputDescription, 'outputDescription', 5, 2000),
    basket: validateOptionalBasket(o.basket),
    customInstructions: o.customInstructions,
    tags: defaultEmpty(o.tags).map(t => validateTag(t))
  }
  return vo
}

/**
 * Set all default true/false booleans to true or false if undefined.
 * Set all possibly undefined numbers to their default values.
 * Set all possibly undefined arrays to empty arrays.
 * Convert string outpoints to `{ txid: string, vout: number }`
 */
export function validateCreateActionOptions(options?: CreateActionOptions): ValidCreateActionOptions {
  const o = options || {}
  const vo: ValidCreateActionOptions = {
    signAndProcess: defaultTrue(o.signAndProcess),
    acceptDelayedBroadcast: defaultTrue(o.acceptDelayedBroadcast),
    knownTxids: defaultEmpty(o.knownTxids),
    returnTXIDOnly: defaultFalse(o.returnTXIDOnly),
    noSend: defaultFalse(o.noSend),
    noSendChange: defaultEmpty(o.noSendChange).map(nsc => parseWalletOutpoint(nsc)),
    sendWith: defaultEmpty(o.sendWith),
    randomizeOutputs: defaultTrue(o.randomizeOutputs)
  }
  return vo
}

export interface ValidProcessActionOptions {
  acceptDelayedBroadcast: BooleanDefaultTrue
  returnTXIDOnly: BooleanDefaultFalse
  noSend: BooleanDefaultFalse
  sendWith: TXIDHexString[]
}

export interface ValidCreateActionOptions extends ValidProcessActionOptions {
  signAndProcess: boolean
  trustSelf?: TrustSelf
  knownTxids: TXIDHexString[]
  noSendChange: OutPoint[]
  randomizeOutputs: boolean
}

export interface ValidSignActionOptions extends ValidProcessActionOptions {
  acceptDelayedBroadcast: boolean
  returnTXIDOnly: boolean
  noSend: boolean
  sendWith: TXIDHexString[]
}

export interface ValidProcessActionArgs extends ValidWalletSignerArgs {
  options: ValidProcessActionOptions
  // true if a batch of transactions is included for processing.
  isSendWith: boolean
  // true if there is a new transaction (not no inputs and no outputs)
  isNewTx: boolean
  // true if this is a request to remix change, `isNewTx` will also be true and `isSendWith` must be false
  isRemixChange: boolean
  // true if any new transaction should NOT be sent to the network
  isNoSend: boolean
  // true if options.acceptDelayedBroadcast is true
  isDelayed: boolean
}

export interface ValidCreateActionArgs extends ValidProcessActionArgs {
  description: DescriptionString5to2000Bytes
  inputBEEF?: BEEF
  inputs: ValidCreateActionInput[]
  outputs: ValidCreateActionOutput[]
  lockTime: number
  version: number
  labels: string[]

  options: ValidCreateActionOptions
  // true if transaction creation completion will require a `signAction` call.
  isSignAction: boolean
  randomVals?: number[]
  /**
   * If true, signableTransactions will include sourceTransaction for each input,
   * including those that do not require signature and those that were also contained
   * in the inputBEEF.
   */
  includeAllSourceTransactions: boolean
}

export interface ValidSignActionArgs extends ValidProcessActionArgs {
  spends: Record<PositiveIntegerOrZero, SignActionSpend>
  reference: Base64String

  options: ValidSignActionOptions
}

export function validateCreateActionArgs(args: CreateActionArgs): ValidCreateActionArgs {
  const vargs: ValidCreateActionArgs = {
    description: validateStringLength(args.description, 'description', 5, 2000),
    inputBEEF: args.inputBEEF,
    inputs: defaultEmpty(args.inputs).map(i => validateCreateActionInput(i)),
    outputs: defaultEmpty(args.outputs).map(o => validateCreateActionOutput(o)),
    lockTime: defaultZero(args.lockTime),
    version: defaultOne(args.version),
    labels: defaultEmpty(args.labels?.map(l => validateLabel(l))),
    options: validateCreateActionOptions(args.options),
    isSendWith: false,
    isDelayed: false,
    isNoSend: false,
    isNewTx: false,
    isRemixChange: false,
    isSignAction: false,
    randomVals: undefined,
    includeAllSourceTransactions: false
  }
  vargs.isSendWith = vargs.options.sendWith.length > 0
  vargs.isRemixChange = !vargs.isSendWith && vargs.inputs.length === 0 && vargs.outputs.length === 0
  vargs.isNewTx = vargs.isRemixChange || vargs.inputs.length > 0 || vargs.outputs.length > 0
  vargs.isSignAction =
    vargs.isNewTx && (vargs.options.signAndProcess === false || vargs.inputs.some(i => i.unlockingScript === undefined))
  vargs.isDelayed = vargs.options.acceptDelayedBroadcast
  vargs.isNoSend = vargs.options.noSend

  return vargs
}

/**
 * Set all default true/false booleans to true or false if undefined.
 * Set all possibly undefined numbers to their default values.
 * Set all possibly undefined arrays to empty arrays.
 * Convert string outpoints to `{ txid: string, vout: number }`
 */
export function validateSignActionOptions(options?: SignActionOptions): ValidSignActionOptions {
  const o = options || {}
  const vo: ValidSignActionOptions = {
    acceptDelayedBroadcast: defaultTrue(o.acceptDelayedBroadcast),
    returnTXIDOnly: defaultFalse(o.returnTXIDOnly),
    noSend: defaultFalse(o.noSend),
    sendWith: defaultEmpty(o.sendWith)
  }
  return vo
}

export function validateSignActionArgs(args: SignActionArgs): ValidSignActionArgs {
  const vargs: ValidSignActionArgs = {
    spends: args.spends,
    reference: args.reference,
    options: validateSignActionOptions(args.options),
    isSendWith: false,
    isDelayed: false,
    isNoSend: false,
    isNewTx: true,
    isRemixChange: false
  }
  vargs.isSendWith = vargs.options.sendWith.length > 0
  vargs.isDelayed = vargs.options.acceptDelayedBroadcast
  vargs.isNoSend = vargs.options.noSend

  return vargs
}

export interface ValidAbortActionArgs extends ValidWalletSignerArgs {
  reference: Base64String
}

export function validateAbortActionArgs(args: AbortActionArgs): ValidAbortActionArgs {
  const vargs: ValidAbortActionArgs = {
    reference: validateBase64String(args.reference, 'reference')
  }

  return vargs
}

export interface ValidWalletPayment {
  derivationPrefix: Base64String
  derivationSuffix: Base64String
  senderIdentityKey: PubKeyHex
}

export function validateWalletPayment(args?: WalletPayment): ValidWalletPayment | undefined {
  if (args === undefined) return undefined
  const v: ValidWalletPayment = {
    derivationPrefix: validateBase64String(args.derivationPrefix, 'derivationPrefix'),
    derivationSuffix: validateBase64String(args.derivationSuffix, 'derivationSuffix'),
    senderIdentityKey: validateHexString(args.senderIdentityKey, 'senderIdentityKey')
  }
  return v
}

export interface ValidBasketInsertion {
  basket: BasketStringUnder300Bytes
  customInstructions?: string
  tags: BasketStringUnder300Bytes[]
}

export function validateBasketInsertion(args?: BasketInsertion): ValidBasketInsertion | undefined {
  if (args === undefined) return undefined
  const v: ValidBasketInsertion = {
    basket: validateBasket(args.basket),
    customInstructions: validateOptionalStringLength(args.customInstructions, 'customInstructions', 0, 1000), // TODO: real max??
    tags: defaultEmpty(args.tags).map(t => validateTag(t))
  }
  return v
}

export interface ValidInternalizeOutput {
  outputIndex: PositiveIntegerOrZero
  protocol: 'wallet payment' | 'basket insertion'
  paymentRemittance?: ValidWalletPayment
  insertionRemittance?: ValidBasketInsertion
}

export function validateInternalizeOutput(args: InternalizeOutput): ValidInternalizeOutput {
  if (args.protocol !== 'basket insertion' && args.protocol !== 'wallet payment')
    throw new WERR_INVALID_PARAMETER('protocol', `'basket insertion' or 'wallet payment'`)
  const v: ValidInternalizeOutput = {
    outputIndex: validatePositiveIntegerOrZero(args.outputIndex, 'outputIndex'),
    protocol: args.protocol,
    paymentRemittance: validateWalletPayment(args.paymentRemittance),
    insertionRemittance: validateBasketInsertion(args.insertionRemittance)
  }
  return v
}

export interface ValidInternalizeActionArgs extends ValidWalletSignerArgs {
  tx: AtomicBEEF
  outputs: InternalizeOutput[]
  description: DescriptionString5to2000Bytes
  labels: LabelStringUnder300Bytes[]
  seekPermission: BooleanDefaultTrue
}

export function validateOriginator(s?: string): string | undefined {
  if (s === undefined) return undefined
  s = s.trim().toLowerCase()
  validateStringLength(s, 'originator', 1, 250)
  const sps = s.split('.')
  for (const sp of sps) {
    validateStringLength(sp, 'originator part', 1, 63)
  }
}

export function validateInternalizeActionArgs(args: InternalizeActionArgs): ValidInternalizeActionArgs {
  const vargs: ValidInternalizeActionArgs = {
    tx: args.tx,
    outputs: args.outputs.map(o => validateInternalizeOutput(o)),
    description: validateStringLength(args.description, 'description', 5, 2000),
    labels: (args.labels || []).map(t => validateLabel(t)),
    seekPermission: defaultTrue(args.seekPermission)
  }

  try {
    const beef = Beef.fromBinary(vargs.tx)
    if (beef.txs.length < 1)
      throw new WERR_INVALID_PARAMETER('tx', `at least one transaction to internalize an output from`)
  } catch {
    throw new WERR_INVALID_PARAMETER('tx', `valid with at least one transaction to internalize an output from`)
  }
  if (vargs.outputs.length < 1)
    throw new WERR_INVALID_PARAMETER('outputs', `at least one output to internalize from the transaction`)

  return vargs
}

export function validateOptionalOutpointString(outpoint: string | undefined, name: string): string | undefined {
  if (outpoint === undefined) return undefined
  return validateOutpointString(outpoint, name)
}

export function validateOutpointString(outpoint: string, name: string): string {
  const s = outpoint.split('.')
  if (s.length !== 2 || !Number.isInteger(Number(s[1])))
    throw new WERR_INVALID_PARAMETER(name, `txid as hex string and numeric output index joined with '.'`)
  const txid = validateHexString(s[0], `${name} txid`, undefined, 64)
  const vout = validatePositiveIntegerOrZero(Number(s[1]), `${name} vout`)
  return `${txid}.${vout}`
}

export interface ValidRelinquishOutputArgs extends ValidWalletSignerArgs {
  basket: BasketStringUnder300Bytes
  output: OutpointString
}

export function validateRelinquishOutputArgs(args: RelinquishOutputArgs): ValidRelinquishOutputArgs {
  const vargs: ValidRelinquishOutputArgs = {
    basket: validateBasket(args.basket),
    output: validateOutpointString(args.output, 'output')
  }

  return vargs
}

export interface ValidRelinquishCertificateArgs extends ValidWalletSignerArgs {
  type: Base64String
  serialNumber: Base64String
  certifier: PubKeyHex
}

export function validateRelinquishCertificateArgs(args: RelinquishCertificateArgs): ValidRelinquishCertificateArgs {
  const vargs: ValidRelinquishCertificateArgs = {
    type: validateBase64String(args.type, 'type'),
    serialNumber: validateBase64String(args.serialNumber, 'serialNumber'),
    certifier: validateHexString(args.certifier, 'certifier')
  }

  return vargs
}

export interface ValidListCertificatesArgs extends ValidWalletSignerArgs {
  partial?: {
    type?: Base64String
    serialNumber?: Base64String
    certifier?: PubKeyHex
    subject?: PubKeyHex
    revocationOutpoint?: OutpointString
    signature?: HexString
  }
  certifiers: PubKeyHex[]
  types: Base64String[]
  limit: PositiveIntegerDefault10Max10000
  offset: PositiveIntegerOrZero
  privileged: BooleanDefaultFalse
  privilegedReason?: DescriptionString5to50Bytes
}

export function validateListCertificatesArgs(args: ListCertificatesArgs): ValidListCertificatesArgs {
  const vargs: ValidListCertificatesArgs = {
    certifiers: defaultEmpty(args.certifiers.map(c => validateHexString(c.trim(), 'certifiers'))),
    types: defaultEmpty(args.types.map(t => validateBase64String(t.trim(), 'types'))),
    limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
    offset: validatePositiveIntegerOrZero(defaultZero(args.offset), 'offset'),
    privileged: defaultFalse(args.privileged),
    privilegedReason: validateOptionalStringLength(args.privilegedReason, 'privilegedReason', 5, 50),
    partial: undefined
  }
  return vargs
}

export interface ValidAcquireCertificateArgs extends ValidWalletSignerArgs {
  acquisitionProtocol: AcquisitionProtocol

  type: Base64String
  serialNumber?: Base64String
  certifier: PubKeyHex
  revocationOutpoint?: OutpointString
  fields: Record<CertificateFieldNameUnder50Bytes, string>
  signature?: HexString

  certifierUrl?: string

  keyringRevealer?: KeyringRevealer
  keyringForSubject?: Record<CertificateFieldNameUnder50Bytes, Base64String>

  privileged: boolean
  privilegedReason?: DescriptionString5to50Bytes
}

function validateCertificateFields(
  fields: Record<CertificateFieldNameUnder50Bytes, string>
): Record<CertificateFieldNameUnder50Bytes, string> {
  for (const fieldName of Object.keys(fields)) {
    validateStringLength(fieldName, 'field name', 1, 50)
  }
  return fields
}

function validateKeyringRevealer(kr: KeyringRevealer, name: string): KeyringRevealer {
  if (kr === 'certifier') return kr
  return validateHexString(kr, name)
}

function validateOptionalKeyringRevealer(kr: KeyringRevealer | undefined, name: string): KeyringRevealer | undefined {
  if (kr === undefined) return undefined
  return validateKeyringRevealer(kr, name)
}

function validateKeyringForSubject(
  kr: Record<CertificateFieldNameUnder50Bytes, Base64String>,
  name: string
): Record<CertificateFieldNameUnder50Bytes, Base64String> {
  for (const fn of Object.keys(kr)) {
    validateStringLength(fn, `${name} field name`, 1, 50)
    validateBase64String(kr[fn], `${name} field value`)
  }
  return kr
}

function validateOptionalKeyringForSubject(
  kr: Record<CertificateFieldNameUnder50Bytes, Base64String> | undefined,
  name: string
): Record<CertificateFieldNameUnder50Bytes, Base64String> | undefined {
  if (kr === undefined) return undefined
  return validateKeyringForSubject(kr, name)
}

/**
 *
 * @param args
 * @param subject Must be valid for "direct" `acquisitionProtocol`. public key of the certificate subject.
 * @returns
 */
export async function validateAcquireCertificateArgs(
  args: AcquireCertificateArgs
): Promise<ValidAcquireCertificateArgs> {
  const vargs: ValidAcquireCertificateArgs = {
    acquisitionProtocol: args.acquisitionProtocol,
    type: validateBase64String(args.type, 'type'),
    serialNumber: validateOptionalBase64String(args.serialNumber, 'serialNumber'),
    certifier: validateHexString(args.certifier, 'certifier'),
    revocationOutpoint: validateOptionalOutpointString(args.revocationOutpoint, 'revocationOutpoint'),
    fields: validateCertificateFields(args.fields),
    signature: validateOptionalHexString(args.signature, 'signature'),
    certifierUrl: args.certifierUrl,
    keyringRevealer: validateOptionalKeyringRevealer(args.keyringRevealer, 'keyringRevealer'),
    keyringForSubject: validateOptionalKeyringForSubject(args.keyringForSubject, 'keyringForSubject'),
    privileged: defaultFalse(args.privileged),
    privilegedReason: validateOptionalStringLength(args.privilegedReason, 'privilegedReason', 5, 50)
  }
  if (vargs.privileged && !vargs.privilegedReason)
    throw new WERR_INVALID_PARAMETER('privilegedReason', `valid when 'privileged' is true `)
  if (vargs.acquisitionProtocol === 'direct') {
    if (!vargs.serialNumber)
      throw new WERR_INVALID_PARAMETER('serialNumber', 'valid when acquisitionProtocol is "direct"')
    if (!vargs.signature) throw new WERR_INVALID_PARAMETER('signature', 'valid when acquisitionProtocol is "direct"')
    if (!vargs.revocationOutpoint)
      throw new WERR_INVALID_PARAMETER('revocationOutpoint', 'valid when acquisitionProtocol is "direct"')
  }
  return vargs
}

export interface ValidAcquireDirectCertificateArgs extends ValidWalletSignerArgs {
  type: Base64String
  serialNumber: Base64String
  certifier: PubKeyHex
  revocationOutpoint: OutpointString
  fields: Record<CertificateFieldNameUnder50Bytes, string>
  signature: HexString

  /**
   * validated to an empty string, must be provided by wallet and must
   * match expectations of keyringForSubject
   */
  subject: PubKeyHex

  keyringRevealer: KeyringRevealer
  keyringForSubject: Record<CertificateFieldNameUnder50Bytes, Base64String>

  privileged: boolean
  privilegedReason?: DescriptionString5to50Bytes
}

export interface ValidAcquireIssuanceCertificateArgs extends ValidWalletSignerArgs {
  type: Base64String
  certifier: PubKeyHex
  certifierUrl: string
  fields: Record<CertificateFieldNameUnder50Bytes, string>

  /**
   * validated to an empty string, must be provided by wallet and must
   * match expectations of keyringForSubject
   */
  subject: PubKeyHex

  privileged: boolean
  privilegedReason?: DescriptionString5to50Bytes
}

export function validateAcquireIssuanceCertificateArgs(
  args: AcquireCertificateArgs
): ValidAcquireIssuanceCertificateArgs {
  if (args.acquisitionProtocol !== 'issuance')
    throw new WERR_INTERNAL('Only acquire certificate via issuance requests allowed here.')
  if (args.serialNumber) throw new WERR_INVALID_PARAMETER('serialNumber', 'valid when acquisitionProtocol is "direct"')
  if (args.signature) throw new WERR_INVALID_PARAMETER('signature', 'valid when acquisitionProtocol is "direct"')
  if (args.revocationOutpoint)
    throw new WERR_INVALID_PARAMETER('revocationOutpoint', 'valid when acquisitionProtocol is "direct"')
  if (args.keyringRevealer)
    throw new WERR_INVALID_PARAMETER('keyringRevealer', 'valid when acquisitionProtocol is "direct"')
  if (args.keyringForSubject)
    throw new WERR_INVALID_PARAMETER('keyringForSubject', 'valid when acquisitionProtocol is "direct"')
  if (!args.certifierUrl)
    throw new WERR_INVALID_PARAMETER('certifierUrl', 'valid when acquisitionProtocol is "issuance"')
  if (args.privileged && !args.privilegedReason)
    throw new WERR_INVALID_PARAMETER('privilegedReason', `valid when 'privileged' is true `)

  const vargs: ValidAcquireIssuanceCertificateArgs = {
    type: validateBase64String(args.type, 'type'),
    certifier: validateHexString(args.certifier, 'certifier'),
    certifierUrl: args.certifierUrl,
    fields: validateCertificateFields(args.fields),
    privileged: defaultFalse(args.privileged),
    privilegedReason: validateOptionalStringLength(args.privilegedReason, 'privilegedReason', 5, 50),
    subject: ''
  }
  return vargs
}
export function validateAcquireDirectCertificateArgs(args: AcquireCertificateArgs): ValidAcquireDirectCertificateArgs {
  if (args.acquisitionProtocol !== 'direct')
    throw new WERR_INTERNAL('Only acquire direct certificate requests allowed here.')
  if (!args.serialNumber) throw new WERR_INVALID_PARAMETER('serialNumber', 'valid when acquisitionProtocol is "direct"')
  if (!args.signature) throw new WERR_INVALID_PARAMETER('signature', 'valid when acquisitionProtocol is "direct"')
  if (!args.revocationOutpoint)
    throw new WERR_INVALID_PARAMETER('revocationOutpoint', 'valid when acquisitionProtocol is "direct"')
  if (!args.keyringRevealer)
    throw new WERR_INVALID_PARAMETER('keyringRevealer', 'valid when acquisitionProtocol is "direct"')
  if (!args.keyringForSubject)
    throw new WERR_INVALID_PARAMETER('keyringForSubject', 'valid when acquisitionProtocol is "direct"')
  if (args.privileged && !args.privilegedReason)
    throw new WERR_INVALID_PARAMETER('privilegedReason', `valid when 'privileged' is true `)

  const vargs: ValidAcquireDirectCertificateArgs = {
    type: validateBase64String(args.type, 'type'),
    serialNumber: validateBase64String(args.serialNumber, 'serialNumber'),
    certifier: validateHexString(args.certifier, 'certifier'),
    revocationOutpoint: validateOutpointString(args.revocationOutpoint, 'revocationOutpoint'),
    fields: validateCertificateFields(args.fields),
    signature: validateHexString(args.signature, 'signature'),
    keyringRevealer: validateKeyringRevealer(args.keyringRevealer, 'keyringRevealer'),
    keyringForSubject: validateKeyringForSubject(args.keyringForSubject, 'keyringForSubject'),
    privileged: defaultFalse(args.privileged),
    privilegedReason: validateOptionalStringLength(args.privilegedReason, 'privilegedReason', 5, 50),
    subject: ''
  }
  return vargs
}

export interface ValidProveCertificateArgs extends ValidWalletSignerArgs {
  type?: Base64String
  serialNumber?: Base64String
  certifier?: PubKeyHex
  subject?: PubKeyHex
  revocationOutpoint?: OutpointString
  signature?: HexString

  fieldsToReveal: CertificateFieldNameUnder50Bytes[]
  verifier: PubKeyHex
  privileged: boolean
  privilegedReason?: DescriptionString5to50Bytes
}

export function validateProveCertificateArgs(args: ProveCertificateArgs): ValidProveCertificateArgs {
  if (args.privileged && !args.privilegedReason)
    throw new WERR_INVALID_PARAMETER('privilegedReason', `valid when 'privileged' is true `)

  const vargs: ValidProveCertificateArgs = {
    type: validateOptionalBase64String(args.certificate.type, 'certificate.type'),
    serialNumber: validateOptionalBase64String(args.certificate.serialNumber, 'certificate.serialNumber'),
    certifier: validateOptionalHexString(args.certificate.certifier, 'certificate.certifier'),
    subject: validateOptionalHexString(args.certificate.subject, 'certificate.subject'),
    revocationOutpoint: validateOptionalOutpointString(
      args.certificate.revocationOutpoint,
      'certificate.revocationOutpoint'
    ),
    signature: validateOptionalHexString(args.certificate.signature, 'certificate.signature'),
    fieldsToReveal: defaultEmpty(args.fieldsToReveal).map(fieldName =>
      validateStringLength(fieldName, `fieldsToReveal ${fieldName}`, 1, 50)
    ),
    verifier: validateHexString(args.verifier, 'verifier'),
    privileged: defaultFalse(args.privileged),
    privilegedReason: validateOptionalStringLength(args.privilegedReason, 'privilegedReason', 5, 50)
  }
  return vargs
}

export interface ValidDiscoverByIdentityKeyArgs extends ValidWalletSignerArgs {
  identityKey: PubKeyHex
  limit: PositiveIntegerDefault10Max10000
  offset: PositiveIntegerOrZero
  seekPermission: boolean
}

export function validateDiscoverByIdentityKeyArgs(args: DiscoverByIdentityKeyArgs): ValidDiscoverByIdentityKeyArgs {
  const vargs: ValidDiscoverByIdentityKeyArgs = {
    identityKey: validateHexString(args.identityKey, 'identityKey', 66, 66),
    limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
    offset: validatePositiveIntegerOrZero(defaultZero(args.offset), 'offset'),
    seekPermission: defaultFalse(args.seekPermission)
  }
  return vargs
}

export interface ValidDiscoverByAttributesArgs extends ValidWalletSignerArgs {
  attributes: Record<CertificateFieldNameUnder50Bytes, string>
  limit: PositiveIntegerDefault10Max10000
  offset: PositiveIntegerOrZero
  seekPermission: boolean
}

function validateAttributes(
  attributes: Record<CertificateFieldNameUnder50Bytes, string>
): Record<CertificateFieldNameUnder50Bytes, string> {
  for (const fieldName of Object.keys(attributes)) {
    validateStringLength(fieldName, `field name ${fieldName}`, 1, 50)
  }
  return attributes
}

export function validateDiscoverByAttributesArgs(args: DiscoverByAttributesArgs): ValidDiscoverByAttributesArgs {
  const vargs: ValidDiscoverByAttributesArgs = {
    attributes: validateAttributes(args.attributes),
    limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
    offset: validatePositiveIntegerOrZero(defaultZero(args.offset), 'offset'),
    seekPermission: defaultFalse(args.seekPermission)
  }
  return vargs
}

export interface ValidListOutputsArgs extends ValidWalletSignerArgs {
  basket: BasketStringUnder300Bytes
  tags: OutputTagStringUnder300Bytes[]
  tagQueryMode: 'all' | 'any'
  includeLockingScripts: boolean
  includeTransactions: boolean
  includeCustomInstructions: BooleanDefaultFalse
  includeTags: BooleanDefaultFalse
  includeLabels: BooleanDefaultFalse
  limit: PositiveIntegerDefault10Max10000
  offset: number
  seekPermission: BooleanDefaultTrue
  knownTxids: string[]
}

/**
 * @param {BasketStringUnder300Bytes} args.basket - Required. The associated basket name whose outputs should be listed.
 * @param {OutputTagStringUnder300Bytes[]} [args.tags] - Optional. Filter outputs based on these tags.
 * @param {'all' | 'any'} [args.tagQueryMode] - Optional. Filter mode, defining whether all or any of the tags must match. By default, any tag can match.
 * @param {'locking scripts' | 'entire transactions'} [args.include] - Optional. Whether to include locking scripts (with each output) or entire transactions (as aggregated BEEF, at the top level) in the result. By default, unless specified, neither are returned.
 * @param {BooleanDefaultFalse} [args.includeEntireTransactions] - Optional. Whether to include the entire transaction(s) in the result.
 * @param {BooleanDefaultFalse} [args.includeCustomInstructions] - Optional. Whether custom instructions should be returned in the result.
 * @param {BooleanDefaultFalse} [args.includeTags] - Optional. Whether the tags associated with the output should be returned.
 * @param {BooleanDefaultFalse} [args.includeLabels] - Optional. Whether the labels associated with the transaction containing the output should be returned.
 * @param {PositiveIntegerDefault10Max10000} [args.limit] - Optional limit on the number of outputs to return.
 * @param {number} [args.offset] - If positive or zero: Number of outputs to skip before starting to return results, oldest first.
 * If negative: Outputs are returned newest first and offset of -1 is the newest output.
 * When using negative offsets, caution is required as new outputs may be added between calls,
 * potentially causing outputs to be duplicated across calls.
 * @param {BooleanDefaultTrue} [args.seekPermission] — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export function validateListOutputsArgs(args: ListOutputsArgs): ValidListOutputsArgs {
  let tagQueryMode: 'any' | 'all'
  if (args.tagQueryMode === undefined || args.tagQueryMode === 'any') tagQueryMode = 'any'
  else if (args.tagQueryMode === 'all') tagQueryMode = 'all'
  else throw new WERR_INVALID_PARAMETER('tagQueryMode', `undefined, 'any', or 'all'`)

  const vargs: ValidListOutputsArgs = {
    basket: validateStringLength(args.basket, 'basket', 1, 300),
    tags: (args.tags || []).map(t => validateStringLength(t, 'tag', 1, 300)),
    tagQueryMode,
    includeLockingScripts: args.include === 'locking scripts',
    includeTransactions: args.include === 'entire transactions',
    includeCustomInstructions: defaultFalse(args.includeCustomInstructions),
    includeTags: defaultFalse(args.includeTags),
    includeLabels: defaultFalse(args.includeLabels),
    limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
    offset: validateInteger(args.offset, 'offset', 0, undefined, undefined),
    seekPermission: defaultTrue(args.seekPermission),
    knownTxids: []
  }

  return vargs
}

export interface ValidListActionsArgs extends ValidWalletSignerArgs {
  labels: LabelStringUnder300Bytes[]
  labelQueryMode: 'any' | 'all'
  includeLabels: BooleanDefaultFalse
  includeInputs: BooleanDefaultFalse
  includeInputSourceLockingScripts: BooleanDefaultFalse
  includeInputUnlockingScripts: BooleanDefaultFalse
  includeOutputs: BooleanDefaultFalse
  includeOutputLockingScripts: BooleanDefaultFalse
  limit: PositiveIntegerDefault10Max10000
  offset: PositiveIntegerOrZero
  seekPermission: BooleanDefaultTrue
}

/**
 * @param {LabelStringUnder300Bytes[]} args.labels - An array of labels used to filter actions.
 * @param {'any' | 'all'} [args.labelQueryMode] - Optional. Specifies how to match labels (default is any which matches any of the labels).
 * @param {BooleanDefaultFalse} [args.includeLabels] - Optional. Whether to include transaction labels in the result set.
 * @param {BooleanDefaultFalse} [args.includeInputs] - Optional. Whether to include input details in the result set.
 * @param {BooleanDefaultFalse} [args.includeInputSourceLockingScripts] - Optional. Whether to include input source locking scripts in the result set.
 * @param {BooleanDefaultFalse} [args.includeInputUnlockingScripts] - Optional. Whether to include input unlocking scripts in the result set.
 * @param {BooleanDefaultFalse} [args.includeOutputs] - Optional. Whether to include output details in the result set.
 * @param {BooleanDefaultFalse} [args.includeOutputLockingScripts] - Optional. Whether to include output locking scripts in the result set.
 * @param {PositiveIntegerDefault10Max10000} [args.limit] - Optional. The maximum number of transactions to retrieve.
 * @param {PositiveIntegerOrZero} [args.offset] - Optional. Number of transactions to skip before starting to return the results.
 * @param {BooleanDefaultTrue} [args.seekPermission] — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export function validateListActionsArgs(args: ListActionsArgs): ValidListActionsArgs {
  let labelQueryMode: 'any' | 'all'
  if (args.labelQueryMode === undefined || args.labelQueryMode === 'any') labelQueryMode = 'any'
  else if (args.labelQueryMode === 'all') labelQueryMode = 'all'
  else throw new WERR_INVALID_PARAMETER('labelQueryMode', `undefined, 'any', or 'all'`)

  const vargs: ValidListActionsArgs = {
    labels: (args.labels || []).map(t => validateLabel(t)),
    labelQueryMode,
    includeLabels: defaultFalse(args.includeLabels),
    includeInputs: defaultFalse(args.includeInputs),
    includeInputSourceLockingScripts: defaultFalse(args.includeInputSourceLockingScripts),
    includeInputUnlockingScripts: defaultFalse(args.includeInputUnlockingScripts),
    includeOutputs: defaultFalse(args.includeOutputs),
    includeOutputLockingScripts: defaultFalse(args.includeOutputLockingScripts),
    limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
    offset: validateInteger(args.offset, 'offset', 0, 0),
    seekPermission: defaultTrue(args.seekPermission)
  }

  return vargs
}
