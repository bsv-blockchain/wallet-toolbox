import { KeyDeriverApi } from '@bsv/sdk'
import { Chain } from './types'

/**
 */
export interface WalletSigner {
  isWalletSigner: true

  chain: Chain
  keyDeriver: KeyDeriverApi
}
