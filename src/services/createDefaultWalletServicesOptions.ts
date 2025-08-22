import { Chain } from "../sdk/types"
import { WalletServicesOptions } from "../sdk/WalletServices.interfaces"
import { randomBytesHex } from "../utility/utilityHelpers"
import { ChaintracksServiceClient } from "./chaintracker/chaintracks/ChaintracksServiceClient"

export function createDefaultWalletServicesOptions(
  chain: Chain,
  arcCallbackUrl?: string,
  arcCallbackToken?: string,
  arcApiKey?: string
): WalletServicesOptions {
  const deploymentId = `wallet-toolbox-${randomBytesHex(16)}`
  const taalApiKey =
    arcApiKey || chain === 'main'
      ? 'mainnet_9596de07e92300c6287e4393594ae39c' // no plan
      : 'testnet_0e6cf72133b43ea2d7861da2a38684e3' // personal "starter" key

  const o: WalletServicesOptions = {
    chain,
    taalApiKey,
    bsvExchangeRate: {
      timestamp: new Date('2023-12-13'),
      base: 'USD',
      rate: 47.52
    },
    bsvUpdateMsecs: 1000 * 60 * 15, // 15 minutes
    fiatExchangeRates: {
      timestamp: new Date('2023-12-13'),
      base: 'USD',
      rates: {
        USD: 1,
        GBP: 0.8,
        EUR: 0.93
      }
    },
    fiatUpdateMsecs: 1000 * 60 * 60 * 24, // 24 hours
    disableMapiCallback: true, // Rely on WalletMonitor by default.
    exchangeratesapiKey: 'bd539d2ff492bcb5619d5f27726a766f',
    chaintracksFiatExchangeRatesUrl: `https://npm-registry.babbage.systems:${chain === 'main' ? 8084 : 8083}/getFiatExchangeRates`,
    chaintracks: new ChaintracksServiceClient(
      chain,
      `https://npm-registry.babbage.systems:${chain === 'main' ? 8084 : 8083}`
    ),
    arcUrl: arcDefaultUrl(chain),
    arcConfig: {
      apiKey: arcApiKey ?? undefined,
      deploymentId,
      callbackUrl: arcCallbackUrl ?? undefined,
      callbackToken: arcCallbackToken ?? undefined
    },
    arcGorillaPoolUrl: arcGorillaPoolUrl(chain),
    arcGorillaPoolConfig: {
      apiKey: arcApiKey ?? undefined,
      deploymentId,
      callbackUrl: arcCallbackUrl ?? undefined,
      callbackToken: arcCallbackToken ?? undefined
    }
  }
  return o
}

export function arcDefaultUrl(chain: Chain): string {
  const url = chain === 'main' ? 'https://arc.taal.com' : 'https://arc-test.taal.com'
  return url
}

export function arcGorillaPoolUrl(chain: Chain): string | undefined {
  const url = chain === 'main' ? 'https://arc.gorillapool.io' : undefined
  return url
}
