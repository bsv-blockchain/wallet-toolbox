import { WalletClient } from '@bsv/sdk'
import { specOpThrowReviewActions } from '../../src/sdk/types'
import { WalletError } from '../../src/sdk/WalletError'
import { WERR_REVIEW_ACTIONS } from '../../src/sdk/WERR_errors'

test('0 WERR_REVIEW_ACTIONS', async () => {
  const wallet = new WalletClient(undefined, '0.WERR.man.test')

  try {
    const r = await wallet.createAction({
      labels: [specOpThrowReviewActions],
      description: 'must throw'
    })
    expect(true).toBe(false)
  } catch (eu: unknown) {
    const e = WalletError.fromUnknown(eu) as WERR_REVIEW_ACTIONS
    expect(e.code).toBe('WERR_REVIEW_ACTIONS')
    expect(e.reviewActionResults).toBeTruthy()
  }
})
