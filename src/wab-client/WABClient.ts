/**
 * WABClient
 *
 * Provides high-level methods to:
 *  - Retrieve server info (supported auth methods, faucet info)
 *  - Generate a random presentation key
 *  - Start/Complete authentication with a chosen AuthMethodInteractor
 *  - Link/unlink methods
 *  - Request faucet
 *  - Delete user
 */
import { AuthMethodInteractor } from './auth-method-interactors/AuthMethodInteractor'
import { PrivateKey } from '@bsv/sdk'

export class WABClient {
  constructor(private serverUrl: string) {}

  /**
   * Return the WAB server info
   */
  public async getInfo() {
    const res = await fetch(`${this.serverUrl}/info`)
    return res.json()
  }

  /**
   * Generate a random 256-bit presentation key as a hex string (client side).
   */
  public generateRandomPresentationKey(): string {
    return PrivateKey.fromRandom().toHex()
  }

  /**
   * Start an Auth Method flow
   */
  public async startAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) {
    return authMethod.startAuth(this.serverUrl, presentationKey, payload)
  }

  /**
   * Complete an Auth Method flow
   */
  public async completeAuthMethod(authMethod: AuthMethodInteractor, presentationKey: string, payload: any) {
    return authMethod.completeAuth(this.serverUrl, presentationKey, payload)
  }

  /**
   * List user-linked methods
   */
  public async listLinkedMethods(presentationKey: string) {
    const res = await fetch(`${this.serverUrl}/user/linkedMethods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentationKey })
    })
    return res.json()
  }

  /**
   * Unlink a given Auth Method by ID
   */
  public async unlinkMethod(presentationKey: string, authMethodId: number) {
    const res = await fetch(`${this.serverUrl}/user/unlinkMethod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentationKey, authMethodId })
    })
    return res.json()
  }

  /**
   * Request faucet
   */
  public async requestFaucet(presentationKey: string) {
    const res = await fetch(`${this.serverUrl}/faucet/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentationKey })
    })
    return res.json()
  }

  /**
   * Delete user
   */
  public async deleteUser(presentationKey: string) {
    const res = await fetch(`${this.serverUrl}/user/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentationKey })
    })
    return res.json()
  }
}
