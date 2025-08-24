import { FiatExchangeRates, WalletServicesOptions } from '../../sdk/WalletServices.interfaces'
import { WERR_BAD_REQUEST, WERR_MISSING_PARAMETER } from '../../sdk/WERR_errors'

export async function updateChaintracksFiatExchangeRates(
  targetCurrencies: string[],
  options: WalletServicesOptions
): Promise<FiatExchangeRates> {
  const url = options.chaintracksFiatExchangeRatesUrl

  if (!url) throw new WERR_MISSING_PARAMETER('options.chaintracksFiatExchangeRatesUrl')

  const response = await fetch(url)
  const data = await response.json()
  const r = { status: response.status, data }

  if (r.status !== 200 || !r.data || r.data.status != 'success') {
    throw new WERR_BAD_REQUEST(`${url} returned status ${r.status}`)
  }

  const rates = <FiatExchangeRates>r.data.value
  rates.timestamp = new Date(rates.timestamp)

  return rates
}

export async function updateExchangeratesapi(
  targetCurrencies: string[],
  options: WalletServicesOptions
): Promise<FiatExchangeRates> {
  if (!options.exchangeratesapiKey) throw new WERR_MISSING_PARAMETER('options.exchangeratesapiKey')

  const iorates = await getExchangeRatesIo(options.exchangeratesapiKey)

  if (!iorates.success) throw new WERR_BAD_REQUEST(`getExchangeRatesIo returned success ${iorates.success}`)

  if (!iorates.rates['USD'] || !iorates.rates[iorates.base])
    throw new WERR_BAD_REQUEST(`getExchangeRatesIo missing rates for 'USD' or base`)

  const r: FiatExchangeRates = {
    timestamp: new Date(iorates.timestamp * 1000),
    base: 'USD',
    rates: {}
  }

  const basePerUsd = iorates.rates[iorates.base] / iorates.rates['USD']

  let updates = 0
  for (const [key, value] of Object.entries(iorates.rates)) {
    if (targetCurrencies.indexOf(key) > -1) {
      r.rates[key] = value * basePerUsd
      updates++
    }
  }

  if (updates !== targetCurrencies.length)
    throw new WERR_BAD_REQUEST(`getExchangeRatesIo failed to update all target currencies`)

  //console.log(`new fiat rates=${JSON.stringify(r)}`)

  return r
}

export interface ExchangeRatesIoApi {
  success: boolean
  timestamp: number
  base: 'EUR' | 'USD'
  date: string
  rates: Record<string, number>
}

export async function getExchangeRatesIo(key: string): Promise<ExchangeRatesIoApi> {
  const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${key}`

  const response = await fetch(url)
  const data = await response.json()
  const r = { status: response.status, data }

  if (r.status !== 200 || !r.data) {
    throw new WERR_BAD_REQUEST(`getExchangeRatesIo returned status ${r.status}`)
  }

  const rates = <ExchangeRatesIoApi>r.data

  return rates
}

/*
{
    "success": true,
    "timestamp": 1702405384,
    "base": "EUR",
    "date": "2023-12-12",
    "rates": {
        "AED": 3.96261,
        "AFN": 74.453362,
        "ALL": 101.807155,
        "AMD": 435.489459,
        "ANG": 1.944069,
        "AOA": 897.226337,
        "ARS": 395.468082,
        "AUD": 1.646886,
        "AWG": 1.942271,
        "AZN": 1.832044,
        "BAM": 1.95407,
        "BBD": 2.177971,
        "BDT": 118.654929,
        "BGN": 1.956827,
        "BHD": 0.406753,
        "BIF": 3078.499675,
        "BMD": 1.079039,
        "BND": 1.446102,
        "BOB": 7.4534,
        "BRL": 5.35741,
        "BSD": 1.07874,
        "BTC": 0.000026145469,
        "BTN": 89.916078,
        "BWP": 14.715901,
        "BYN": 3.553337,
        "BYR": 21149.174075,
        "BZD": 2.174364,
        "CAD": 1.468287,
        "CDF": 2875.640503,
        "CHF": 0.945353,
        "CLF": 0.034313,
        "CLP": 948.09775,
        "CNY": 7.743512,
        "COP": 4307.525658,
        "CRC": 569.093422,
        "CUC": 1.079039,
        "CUP": 28.594547,
        "CVE": 110.978933,
        "CZK": 24.507795,
        "DJF": 191.766554,
        "DKK": 7.457544,
        "DOP": 61.505535,
        "DZD": 145.236415,
        "EGP": 33.367028,
        "ERN": 16.185592,
        "ETB": 60.199033,
        "EUR": 1,
        "FJD": 2.416779,
        "FKP": 0.859886,
        "GBP": 0.859574,
        "GEL": 2.880527,
        "GGP": 0.859886,
        "GHS": 12.980915,
        "GIP": 0.859886,
        "GMD": 72.726644,
        "GNF": 9285.134874,
        "GTQ": 8.443457,
        "GYD": 225.859997,
        "HKD": 8.426031,
        "HNL": 26.685156,
        "HRK": 7.598132,
        "HTG": 142.513142,
        "HUF": 382.707793,
        "IDR": 16801.292339,
        "ILS": 4.007585,
        "IMP": 0.859886,
        "INR": 89.987955,
        "IQD": 1414.081256,
        "IRR": 45602.907562,
        "ISK": 151.109018,
        "JEP": 0.859886,
        "JMD": 167.700721,
        "JOD": 0.765366,
        "JPY": 157.115675,
        "KES": 165.523229,
        "KGS": 96.379362,
        "KHR": 4440.24707,
        "KMF": 493.571281,
        "KPW": 971.097551,
        "KRW": 1417.685123,
        "KWD": 0.332733,
        "KYD": 0.8989,
        "KZT": 493.04112,
        "LAK": 22368.488843,
        "LBP": 16154.243871,
        "LKR": 352.747636,
        "LRD": 203.02122,
        "LSL": 20.582684,
        "LTL": 3.186123,
        "LVL": 0.6527,
        "LYD": 5.211954,
        "MAD": 10.976529,
        "MDL": 19.340873,
        "MGA": 4939.301335,
        "MKD": 61.507276,
        "MMK": 2265.283559,
        "MNT": 3705.780074,
        "MOP": 8.676817,
        "MRU": 42.727878,
        "MUR": 47.690625,
        "MVR": 16.584924,
        "MWK": 1816.023037,
        "MXN": 18.69803,
        "MYR": 5.052606,
        "MZN": 68.249194,
        "NAD": 20.588506,
        "NGN": 865.924709,
        "NIO": 39.6024,
        "NOK": 11.848426,
        "NPR": 143.865605,
        "NZD": 1.761931,
        "OMR": 0.415394,
        "PAB": 1.07864,
        "PEN": 4.073376,
        "PGK": 4.025102,
        "PHP": 59.974075,
        "PKR": 306.446851,
        "PLN": 4.334063,
        "PYG": 7963.910929,
        "QAR": 3.928776,
        "RON": 4.973399,
        "RSD": 117.196649,
        "RUB": 97.248412,
        "RWF": 1351.496966,
        "SAR": 4.047186,
        "SBD": 9.12268,
        "SCR": 14.561036,
        "SDG": 648.5028,
        "SEK": 11.285032,
        "SGD": 1.449037,
        "SHP": 1.312921,
        "SLE": 24.488188,
        "SLL": 21311.029931,
        "SOS": 616.131981,
        "SRD": 40.655509,
        "STD": 22333.938945,
        "SYP": 14029.21897,
        "SZL": 20.587826,
        "THB": 38.597298,
        "TJS": 11.757734,
        "TMT": 3.776638,
        "TND": 3.377493,
        "TOP": 2.551714,
        "TRY": 31.312865,
        "TTD": 7.321483,
        "TWD": 34.012943,
        "TZS": 2697.598652,
        "UAH": 39.917867,
        "UGX": 4102.367289,
        "USD": 1.079039,
        "UYU": 42.422631,
        "UZS": 13299.161683,
        "VEF": 3838024.202021,
        "VES": 38.392542,
        "VND": 26188.28851,
        "VUV": 129.693288,
        "WST": 2.964402,
        "XAF": 655.37362,
        "XAG": 0.047456,
        "XAU": 0.000545,
        "XCD": 2.916158,
        "XDR": 0.811478,
        "XOF": 657.134976,
        "XPF": 119.331742,
        "YER": 270.110528,
        "ZAR": 20.470755,
        "ZMK": 9712.646776,
        "ZMW": 26.319693,
        "ZWL": 347.450277
    }
}
*/
