/**
 * AuthMethodInteractor
 *
 * A base interface/class for client-side logic to interact with a server
 * for a specific Auth Method's flow (start, complete).
 */

export interface AuthPayload {
  [key: string]: any
}

export interface StartAuthResponse {
  success: boolean
  message?: string
  data?: any
}

export interface CompleteAuthResponse {
  success: boolean
  message?: string
  presentationKey?: string
}

/**
 * Abstract client-side interactor for an Auth Method.
 * Provides default implementations of startAuth and completeAuth that
 * call the WAB server's /auth/start and /auth/complete endpoints.
 * Subclasses only need to set `methodType`.
 */
export abstract class AuthMethodInteractor {
  public abstract methodType: string

  /**
   * Start the flow (e.g. request an OTP or create a session).
   */
  public async startAuth(
    serverUrl: string,
    presentationKey: string,
    payload: AuthPayload
  ): Promise<StartAuthResponse> {
    const res = await fetch(`${serverUrl}/auth/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: this.methodType,
        presentationKey,
        payload
      })
    })

    if (!res.ok) {
      return {
        success: false,
        message: `HTTP error ${res.status}`
      }
    }

    return res.json()
  }

  /**
   * Complete the flow (e.g. confirm OTP).
   */
  public async completeAuth(
    serverUrl: string,
    presentationKey: string,
    payload: AuthPayload
  ): Promise<CompleteAuthResponse> {
    const res = await fetch(`${serverUrl}/auth/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: this.methodType,
        presentationKey,
        payload
      })
    })

    if (!res.ok) {
      return {
        success: false,
        message: `HTTP error ${res.status}`
      }
    }

    return res.json()
  }
}
