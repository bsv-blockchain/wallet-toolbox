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

  // ============================================================
  // Shamir Share Management (2-of-3 Key Recovery System)
  // ============================================================

  /**
   * Start OTP verification for share operations
   * This initiates the auth flow (e.g., sends SMS code via Twilio)
   *
   * @param methodType The auth method type (e.g., "TwilioPhone", "DevConsole")
   * @param userIdHash SHA256 hash of the user's identity key
   * @param payload Auth method specific data (e.g., { phoneNumber: "+1..." })
   */
  public async startShareAuth(
    methodType: string,
    userIdHash: string,
    payload: any
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.serverUrl}/auth/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType,
        presentationKey: userIdHash, // Reuse existing auth flow with userIdHash
        payload
      })
    })
    return res.json()
  }

  /**
   * Store a Shamir share (Share B) on the server
   * Requires prior OTP verification via startShareAuth
   *
   * @param methodType The auth method type used for verification
   * @param payload Contains the OTP code and auth method specific data
   * @param shareB The Shamir share to store (format: x.y.threshold.integrity)
   * @param userIdHash SHA256 hash of the user's identity key
   */
  public async storeShare(
    methodType: string,
    payload: any,
    shareB: string,
    userIdHash: string
  ): Promise<{ success: boolean; message: string; userId?: number }> {
    const res = await fetch(`${this.serverUrl}/share/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType,
        payload,
        shareB,
        userIdHash
      })
    })
    return res.json()
  }

  /**
   * Retrieve a Shamir share (Share B) from the server
   * Requires OTP verification
   *
   * @param methodType The auth method type used for verification
   * @param payload Contains the OTP code and auth method specific data
   * @param userIdHash SHA256 hash of the user's identity key
   */
  public async retrieveShare(
    methodType: string,
    payload: any,
    userIdHash: string
  ): Promise<{ success: boolean; shareB?: string; message: string }> {
    const res = await fetch(`${this.serverUrl}/share/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType,
        payload,
        userIdHash
      })
    })
    return res.json()
  }

  /**
   * Update a Shamir share (for key rotation)
   * Requires OTP verification
   *
   * @param methodType The auth method type used for verification
   * @param payload Contains the OTP code and auth method specific data
   * @param userIdHash SHA256 hash of the user's identity key
   * @param newShareB The new Shamir share to store
   */
  public async updateShare(
    methodType: string,
    payload: any,
    userIdHash: string,
    newShareB: string
  ): Promise<{ success: boolean; message: string; shareVersion?: number }> {
    const res = await fetch(`${this.serverUrl}/share/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType,
        payload,
        userIdHash,
        newShareB
      })
    })
    return res.json()
  }

  /**
   * Delete a Shamir user's account and stored share
   * Requires OTP verification
   *
   * @param methodType The auth method type used for verification
   * @param payload Contains the OTP code and auth method specific data
   * @param userIdHash SHA256 hash of the user's identity key
   */
  public async deleteShamirUser(
    methodType: string,
    payload: any,
    userIdHash: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.serverUrl}/share/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType,
        payload,
        userIdHash
      })
    })
    return res.json()
  }
}
