import {
  HexString,
  KeyDeriverApi,
  WalletProtocol,
  ScriptTemplate,
  ScriptTemplateUnlock,
  LockingScript,
  P2PKH,
  PrivateKey,
  Script,
  CachedKeyDeriver
} from '@bsv/sdk'
import { asBsvSdkPrivateKey, verifyTruthy } from './utilityHelpers'

export const brc29ProtocolID: WalletProtocol = [2, '3241645161d8']

export interface ScriptTemplateParamsBRC29 {
  derivationPrefix?: string
  derivationSuffix?: string
  keyDeriver: KeyDeriverApi
}

/**
 * Simple Authenticated BSV P2PKH Payment Protocol
 * https://brc.dev/29
 */
export class ScriptTemplateBRC29 implements ScriptTemplate {
  p2pkh: P2PKH

  constructor(public params: ScriptTemplateParamsBRC29) {
    this.p2pkh = new P2PKH()

    verifyTruthy(params.derivationPrefix)
    verifyTruthy(params.derivationSuffix)
  }

  getKeyID() {
    return `${this.params.derivationPrefix} ${this.params.derivationSuffix}`
  }

  getKeyDeriver(privKey: PrivateKey | HexString): KeyDeriverApi {
    if (typeof privKey === 'string') privKey = PrivateKey.fromHex(privKey)
    if (!this.params.keyDeriver || this.params.keyDeriver.rootKey.toHex() !== privKey.toHex())
      return new CachedKeyDeriver(privKey)
    return this.params.keyDeriver
  }

  lock(lockerPrivKey: string, unlockerPubKey: string): LockingScript {
    const address = this.getKeyDeriver(lockerPrivKey)
      .derivePublicKey(brc29ProtocolID, this.getKeyID(), unlockerPubKey, false)
      .toAddress()
    const r = this.p2pkh.lock(address)
    return r
  }

  unlock(
    unlockerPrivKey: string,
    lockerPubKey: string,
    sourceSatoshis?: number,
    lockingScript?: Script
  ): ScriptTemplateUnlock {
    const derivedPrivateKey = this.getKeyDeriver(unlockerPrivKey)
      .derivePrivateKey(brc29ProtocolID, this.getKeyID(), lockerPubKey)
      .toHex()
    const r = this.p2pkh.unlock(asBsvSdkPrivateKey(derivedPrivateKey), 'all', false, sourceSatoshis, lockingScript)
    return r
  }

  /**
   * P2PKH unlock estimateLength is a constant
   */
  unlockLength = 108
}
