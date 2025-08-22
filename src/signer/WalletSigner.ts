import { KeyDeriverApi } from '@bsv/sdk'
import { WalletStorageManager } from '../storage/WalletStorageManager'
import { Chain } from '../sdk/types'

export class WalletSigner {
  isWalletSigner: true = true

  chain: Chain
  keyDeriver: KeyDeriverApi
  storage: WalletStorageManager

  constructor(chain: Chain, keyDeriver: KeyDeriverApi, storage: WalletStorageManager) {
    this.chain = chain
    this.keyDeriver = keyDeriver
    this.storage = storage
  }
}
