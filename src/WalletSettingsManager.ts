import { LocalKVStore, PubKeyHex, WalletInterface } from '@bsv/sdk'

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

const SETTINGS_BASKET = 'wallet settings'

// Defaults can be overridden as needed
export const DEFAULT_SETTINGS = {
  trustSettings: {
    trustLevel: 2,
    trustedCertifiers: [
      {
        name: 'Metanet Trust Services',
        description: 'Registry for protocols, baskets, and certificates types',
        iconUrl: 'https://bsvblockchain.org/favicon.ico',
        identityKey: '03daf815fe38f83da0ad83b5bedc520aa488aef5cbc93a93c67a7fe60406cbffe8',
        trust: 4
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
  kv: LocalKVStore

  constructor(
    private wallet: WalletInterface,
    private config: WalletSettingsManagerConfig = {
      defaultSettings: DEFAULT_SETTINGS
    }
  ) {
    this.kv = new LocalKVStore(wallet, SETTINGS_BASKET, true)
  }

  /**
   * Returns a user's wallet settings
   *
   * @returns - Wallet settings object
   */
  async get(): Promise<WalletSettings> {
    return JSON.parse((await this.kv.get('settings', JSON.stringify(this.config.defaultSettings))) as string)
  }

  /**
   * Creates (or updates) the user's settings token.
   *
   * @param settings - The wallet settings to be stored.
   */
  async set(settings: WalletSettings): Promise<void> {
    await this.kv.set('settings', JSON.stringify(settings))
  }

  /**
   * Deletes the user's settings token.
   */
  async delete(): Promise<void> {
    await this.kv.remove('settings')
  }
}
