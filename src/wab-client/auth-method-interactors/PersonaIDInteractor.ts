import { AuthMethodInteractor, AuthPayload, StartAuthResponse, CompleteAuthResponse } from './AuthMethodInteractor'

export class PersonaIDInteractor extends AuthMethodInteractor {
  public methodType = 'PersonaID'

  public override async startAuth(serverUrl: string, presentationKey: string, payload: AuthPayload): Promise<StartAuthResponse> {
    const res = await fetch(`${serverUrl}/auth/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        methodType: this.methodType,
        presentationKey,
        payload
      })
    })
    return res.json()
  }

  public override async completeAuth(
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
    return res.json()
  }
}
