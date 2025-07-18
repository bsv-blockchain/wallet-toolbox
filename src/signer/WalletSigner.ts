import { KeyDeriver, KeyDeriverApi } from '@bsv/sdk'
import { sdk } from '../index.client'
import { WalletStorageManager } from '../storage/WalletStorageManager'

export class WalletSigner {
  isWalletSigner: true = true

  chain: sdk.Chain
  keyDeriver: KeyDeriverApi
  storage: WalletStorageManager

  constructor(chain: sdk.Chain, keyDeriver: KeyDeriverApi, storage: WalletStorageManager) {
    this.chain = chain
    this.keyDeriver = keyDeriver
    this.storage = storage
  }
}
