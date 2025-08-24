import { ListOutputsResult } from '@bsv/sdk'
import { ValidListOutputsArgs } from '../../sdk/validationHelpers'
import { StorageProvider } from '../StorageProvider'
import { AuthId } from '../../sdk/WalletStorage.interfaces'
import { TableOutput } from '../schema/tables/TableOutput'
import { specOpInvalidChange, specOpSetWalletChangeParams, specOpWalletBalance } from '../../sdk/types'
import { verifyId, verifyInteger, verifyOne } from '../../utility/utilityHelpers'
import { WERR_INVALID_PARAMETER } from '../../sdk/WERR_errors'

export interface ListOutputsSpecOp {
  name: string
  useBasket?: string
  ignoreLimit?: boolean
  includeOutputScripts?: boolean
  includeSpent?: boolean
  resultFromTags?: (
    s: StorageProvider,
    auth: AuthId,
    vargs: ValidListOutputsArgs,
    specOpTags: string[]
  ) => Promise<ListOutputsResult>
  resultFromOutputs?: (
    s: StorageProvider,
    auth: AuthId,
    vargs: ValidListOutputsArgs,
    specOpTags: string[],
    outputs: TableOutput[]
  ) => Promise<ListOutputsResult>
  filterOutputs?: (
    s: StorageProvider,
    auth: AuthId,
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
    [specOpWalletBalance]: {
      name: 'totalOutputsIsWalletBalance',
      useBasket: 'default',
      ignoreLimit: true,
      resultFromOutputs: async (
        s: StorageProvider,
        auth: AuthId,
        vargs: ValidListOutputsArgs,
        specOpTags: string[],
        outputs: TableOutput[]
      ): Promise<ListOutputsResult> => {
        let totalOutputs = 0
        for (const o of outputs) totalOutputs += o.satoshis
        return { totalOutputs, outputs: [] }
      }
    },
    [specOpInvalidChange]: {
      name: 'invalidChangeOutputs',
      useBasket: 'default',
      ignoreLimit: true,
      includeOutputScripts: true,
      includeSpent: false,
      tagsToIntercept: ['release', 'all'],
      filterOutputs: async (
        s: StorageProvider,
        auth: AuthId,
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
    [specOpSetWalletChangeParams]: {
      name: 'setWalletChangeParams',
      tagsParamsCount: 2,
      resultFromTags: async (
        s: StorageProvider,
        auth: AuthId,
        vargs: ValidListOutputsArgs,
        specOpTags: string[]
      ): Promise<ListOutputsResult> => {
        if (specOpTags.length !== 2)
          throw new WERR_INVALID_PARAMETER('numberOfDesiredUTXOs and minimumDesiredUTXOValue', 'valid')
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
