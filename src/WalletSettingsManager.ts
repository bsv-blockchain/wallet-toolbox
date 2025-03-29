import {
  CreateActionInput,
  LockingScript,
  PubKeyHex,
  PushDrop,
  Transaction,
  Utils,
  WalletInterface,
  WalletProtocol
} from '@bsv/sdk'

export interface Certifier {
  name: string
  description: string
  identityKey: PubKeyHex
  trust: number
  iconUrl?: string
  baseURL?: string // ?
}
export interface TrustSettings {
  trustLevel: number
  trustedCertifiers: Certifier[]
}
export interface WalletTheme {
  mode: string
}
export interface WalletSettings {
  trustSettings: TrustSettings
  theme?: WalletTheme
  currency?: string
}
export interface WalletSettingsManagerConfig {
  defaultSettings: WalletSettings
}

const PROTOCOL_ID: WalletProtocol = [2, 'wallet settings']
const KEY_ID = '1'
const SETTINGS_BASKET = 'wallet settings'
const TOKEN_AMOUNT = 1

// Defaults can be overridden as needed
export const DEFAULT_SETTINGS = {
  trustSettings: {
    trustLevel: 2,
    trustedCertifiers: [
      {
        name: 'Babbage Trust Services',
        description: 'Resolves identity information for Babbage-run APIs and Bitcoin infrastructure.',
        iconUrl: 'https://projectbabbage.com/favicon.ico',
        identityKey: '03daf815fe38f83da0ad83b5bedc520aa488aef5cbc93a93c67a7fe60406cbffe8',
        trust: 4
      },
      {
        name: 'IdentiCert',
        description: 'Certifies legal first and last name, and photos',
        iconUrl: 'https://identicert.me/favicon.ico',
        trust: 5,
        identityKey: '0295bf1c7842d14babf60daf2c733956c331f9dcb2c79e41f85fd1dda6a3fa4549'
      },
      {
        name: 'SocialCert',
        description: 'Certifies social media handles, phone numbers and emails',
        iconUrl: 'https://socialcert.net/favicon.ico',
        trust: 3,
        identityKey: '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17'
      }
    ]
  },
  theme: { mode: 'dark' }
} as WalletSettings

// Mapping of certifier names to their testnet identity keys
const TESTNET_IDENTITY_KEYS: Record<string, string> = {
  'Babbage Trust Services': '03d0b36b5c98b000ec9ffed9a2cf005e279244edf6a19cf90545cdebe873162761',
  IdentiCert: '036dc48522aba1705afbb43df3c04dbd1da373b6154341a875bceaa2a3e7f21528',
  SocialCert: '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17'
}

// Define defaults that can be imported for a testnet environment
export const TESTNET_DEFAULT_SETTINGS: WalletSettings = {
  ...DEFAULT_SETTINGS,
  trustSettings: {
    ...DEFAULT_SETTINGS.trustSettings,
    trustedCertifiers: DEFAULT_SETTINGS.trustSettings.trustedCertifiers.map(certifier => ({
      ...certifier,
      // Use the testnet key if provided, otherwise fallback to the default
      identityKey: TESTNET_IDENTITY_KEYS[certifier.name] || certifier.identityKey
    }))
  }
}

/**
 * Manages wallet settings
 */
export class WalletSettingsManager {
  constructor(
    private wallet: WalletInterface,
    private config: WalletSettingsManagerConfig = {
      defaultSettings: DEFAULT_SETTINGS
    }
  ) { }

  /**
   * Returns a user's wallet settings
   *
   * @returns - Wallet settings object
   */
  async get(): Promise<WalletSettings> {
    // List outputs in the 'wallet-settings' basket
    // There should only be one settings token
    const results = await this.wallet.listOutputs({
      basket: SETTINGS_BASKET,
      include: 'locking scripts'
    })

    // Return defaults if no settings token is found
    if (!results.outputs.length) {
      return this.config.defaultSettings
    }

    const { fields } = PushDrop.decode(LockingScript.fromHex(results.outputs[results.outputs.length - 1].lockingScript!))
    // Parse and return settings token
    return JSON.parse(Utils.toUTF8(fields[0]))
  }

  /**
   * Creates (or updates) the user's settings token.
   *
   * @param settings - The wallet settings to be stored.
   */
  async set(settings: WalletSettings): Promise<void> {
    const pushdrop = new PushDrop(this.wallet)

    // Build the new locking script with the updated settings JSON.
    const lockingScript = await pushdrop.lock(
      [Utils.toArray(JSON.stringify(settings), 'utf8')],
      PROTOCOL_ID,
      KEY_ID,
      'self'
    )

    // Consume any existing token and create a new one with the new locking script.
    await this.updateToken(lockingScript)
  }

  /**
   * Deletes the user's settings token.
   */
  async delete(): Promise<void> {
    // Consume the token; if none exists, consumeToken simply returns.
    await this.updateToken()
  }

  /**
   * Updates a settings token. Any previous token is consumed, and if a new locking script
   * is provided, it replaces what (if anything) was there before.
   *
   * @param newLockingScript - Optional locking script for replacing the settings token.
   * @returns {Promise<boolean>} - True if operation succeeded, throws an error otherwise.
   */
  private async updateToken(newLockingScript?: LockingScript): Promise<boolean> {
    const pushdrop = new PushDrop(this.wallet)

    // 1. List the existing token UTXO(s) for the settings basket.
    const existingUtxos = await this.wallet.listOutputs({
      basket: SETTINGS_BASKET,
      include: 'entire transactions'
    })

    // This is the "create a new token" path — no signAction, just a new locking script.
    if (!existingUtxos.outputs.length) {
      if (!newLockingScript) {
        return true
      }
      await this.wallet.createAction({
        description: 'Create a user settings token',
        outputs: [
          {
            satoshis: TOKEN_AMOUNT,
            lockingScript: newLockingScript.toHex(),
            outputDescription: 'Wallet settings token',
            basket: SETTINGS_BASKET
          }
        ],
        options: {
          randomizeOutputs: false,
          acceptDelayedBroadcast: false
        }
      })
      return true
    }

    // 2. Prepare the token UTXO for consumption.
    const tokenOutput = existingUtxos.outputs[existingUtxos.outputs.length - 1]
    const inputToConsume: CreateActionInput = {
      outpoint: tokenOutput.outpoint,
      unlockingScriptLength: 73,
      inputDescription: 'Consume old wallet settings token'
    }

    // 3. Build the outputs array: if a new locking script is provided, add an output.
    const outputs = newLockingScript
      ? [
        {
          satoshis: TOKEN_AMOUNT,
          lockingScript: newLockingScript.toHex(),
          outputDescription: 'Wallet settings token',
          basket: SETTINGS_BASKET
        }
      ]
      : []

    // 4. Create a signable transaction action using the inputs and (optionally) outputs.
    const { signableTransaction } = await this.wallet.createAction({
      description: `${newLockingScript ? 'Update' : 'Delete'} a user settings token`,
      inputBEEF: existingUtxos.BEEF!,
      inputs: [inputToConsume], // input index 0
      outputs,
      options: {
        randomizeOutputs: false,
        acceptDelayedBroadcast: false
      }
    })
    const tx = Transaction.fromBEEF(signableTransaction!.tx)

    // 5. Build and sign the unlocking script for the token being consumed.
    const unlocker = pushdrop.unlock(PROTOCOL_ID, KEY_ID, 'self')
    const unlockingScript = await unlocker.sign(tx, 0)

    // 6. Sign the transaction using our unlocking script.
    await this.wallet.signAction({
      reference: signableTransaction!.reference,
      spends: {
        0: {
          unlockingScript: unlockingScript.toHex()
        }
      }
    })

    return true
  }
}
