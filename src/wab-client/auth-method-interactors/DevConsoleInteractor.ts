import { AuthMethodInteractor } from './AuthMethodInteractor'

/**
 * DevConsoleInteractor
 *
 * A client-side class that knows how to call the WAB server for DevConsole-based authentication.
 * This is a development-only auth method that generates OTP codes and logs them to the console.
 */
export class DevConsoleInteractor extends AuthMethodInteractor {
  public methodType = 'DevConsole'
}
