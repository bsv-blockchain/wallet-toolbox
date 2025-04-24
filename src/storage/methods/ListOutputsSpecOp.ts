import { ListOutputsResult } from '@bsv/sdk'
import { StorageProvider, TableOutput } from '../index.client'
import { asString, sdk, verifyId, verifyInteger, verifyOne } from '../../index.client'
import { ValidListOutputsArgs } from '../../sdk/validationHelpers'

export interface ListOutputsSpecOp {
  name: string
  useBasket?: string
  ignoreLimit?: boolean
  includeOutputScripts?: boolean
  includeSpent?: boolean
  resultFromTags?: (
    s: StorageProvider,
    auth: sdk.AuthId,
    vargs: ValidListOutputsArgs,
    specOpTags: string[]
  ) => Promise<ListOutputsResult>
  resultFromOutputs?: (
    s: StorageProvider,
    auth: sdk.AuthId,
    vargs: ValidListOutputsArgs,
    specOpTags: string[],
    outputs: TableOutput[]
  ) => Promise<ListOutputsResult>
  filterOutputs?: (
    s: StorageProvider,
    auth: sdk.AuthId,
    vargs: ValidListOutputsArgs,
    specOpTags: string[],
    outputs: TableOutput[]
  ) => Promise<TableOutput[]>
  /**
   * undefined to intercept no tags from vargs,
   * empty array to intercept all tags,
   * or an explicit array of tags to intercept.
   */
  tagsToIntercept?: string[]
  /**
   * How many positional tags to intercept.
   */
  tagsParamsCount?: number
}

export const getBasketToSpecOp: () => Record<string, ListOutputsSpecOp> = () => {
  return {
    [sdk.specOpWalletBalance]: {
      name: 'totalOutputsIsWalletBalance',
      useBasket: 'default',
      ignoreLimit: true,
      resultFromOutputs: async (
        s: StorageProvider,
        auth: sdk.AuthId,
        vargs: ValidListOutputsArgs,
        specOpTags: string[],
        outputs: TableOutput[]
      ): Promise<ListOutputsResult> => {
        let totalOutputs = 0
        for (const o of outputs) totalOutputs += o.satoshis
        return { totalOutputs, outputs: [] }
      }
    },
    [sdk.specOpInvalidChange]: {
      name: 'invalidChangeOutputs',
      useBasket: 'default',
      ignoreLimit: true,
      includeOutputScripts: true,
      includeSpent: false,
      tagsToIntercept: ['release', 'all'],
      filterOutputs: async (
        s: StorageProvider,
        auth: sdk.AuthId,
        vargs: ValidListOutputsArgs,
        specOpTags: string[],
        outputs: TableOutput[]
      ): Promise<TableOutput[]> => {
        const filteredOutputs: TableOutput[] = []
        const services = s.getServices()
        for (const o of outputs) {
          await s.validateOutputScript(o)
          let ok: boolean | undefined = false
          if (o.lockingScript && o.lockingScript.length > 0) {
            ok = await services.isUtxo(o)
          } else {
            ok = undefined
          }
          if (ok === false) {
            filteredOutputs.push(o)
          }
        }
        if (specOpTags.indexOf('release') >= 0) {
          for (const o of filteredOutputs) {
            await s.updateOutput(o.outputId, { spendable: false })
            o.spendable = false
          }
        }
        return filteredOutputs
      }
    },
    [sdk.specOpSetWalletChangeParams]: {
      name: 'setWalletChangeParams',
      tagsParamsCount: 2,
      resultFromTags: async (
        s: StorageProvider,
        auth: sdk.AuthId,
        vargs: ValidListOutputsArgs,
        specOpTags: string[]
      ): Promise<ListOutputsResult> => {
        if (specOpTags.length !== 2)
          throw new sdk.WERR_INVALID_PARAMETER('numberOfDesiredUTXOs and minimumDesiredUTXOValue', 'valid')
        const numberOfDesiredUTXOs: number = verifyInteger(Number(specOpTags[0]))
        const minimumDesiredUTXOValue: number = verifyInteger(Number(specOpTags[1]))
        const basket = verifyOne(
          await s.findOutputBaskets({
            partial: { userId: verifyId(auth.userId), name: 'default' }
          })
        )
        await s.updateOutputBasket(basket.basketId, {
          numberOfDesiredUTXOs,
          minimumDesiredUTXOValue
        })
        return { totalOutputs: 0, outputs: [] }
      }
    }
  }
}
