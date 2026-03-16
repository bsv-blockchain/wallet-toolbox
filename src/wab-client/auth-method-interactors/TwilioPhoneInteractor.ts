import { AuthMethodInteractor } from './AuthMethodInteractor'

/**
 * TwilioPhoneInteractor
 *
 * A client-side class that knows how to call the WAB server for Twilio-based phone verification.
 */
export class TwilioPhoneInteractor extends AuthMethodInteractor {
  public methodType = 'TwilioPhone'
}
