import { Beef, ListOutputsResult, OriginatorDomainNameStringUnder250Bytes, WalletOutput } from '@bsv/sdk'
import { TableOutput, TableOutputBasket, TableOutputTag } from '../index.client'
import { asString, sdk, verifyId, verifyOne } from '../../index.client'
import { basketToSpecOp, ListOutputsSpecOp } from './ListOutputsSpecOp'
import { StorageIdb } from '../StorageIdb'
import { TransactionStatus } from '../../sdk'

export async function listOutputsIdb(
  storage: StorageIdb,
  auth: sdk.AuthId,
  vargs: sdk.ValidListOutputsArgs,
  originator?: OriginatorDomainNameStringUnder250Bytes
): Promise<ListOutputsResult> {
  const userId = verifyId(auth.userId)
  const limit = vargs.limit
  const offset = vargs.offset

  const r: ListOutputsResult = {
    totalOutputs: 0,
    outputs: []
  }

  /*
        ListOutputsArgs {
            basket: BasketStringUnder300Bytes

            tags?: OutputTagStringUnder300Bytes[]
            tagQueryMode?: 'all' | 'any' // default any

            limit?: PositiveIntegerDefault10Max10000
            offset?: PositiveIntegerOrZero
        }
    */

  let specOp: ListOutputsSpecOp | undefined = undefined
  let basketId: number | undefined = undefined
  const basketsById: Record<number, TableOutputBasket> = {}
  if (vargs.basket) {
    let b = vargs.basket
    specOp = basketToSpecOp[b]
    b = specOp ? (specOp.useBasket ? specOp.useBasket : '') : b
    if (b) {
      const baskets = await storage.findOutputBaskets({
        partial: { userId, name: b }
      })
      if (baskets.length !== 1) {
        // If basket does not exist, result is no outputs.
        return r
      }
      const basket = baskets[0]
      basketId = basket.basketId!
      basketsById[basketId!] = basket
    }
  }

  let tags = [...vargs.tags]
  const specOpTags: string[] = []
  if (specOp && specOp.tagsParamsCount) {
    specOpTags.push(...tags.splice(0, Math.min(tags.length, specOp.tagsParamsCount)))
  }
  if (specOp && specOp.tagsToIntercept) {
    // Pull out tags used by current specOp
    const ts = tags
    tags = []
    for (const t of ts) {
      if (specOp.tagsToIntercept.length === 0 || specOp.tagsToIntercept.indexOf(t) >= 0) {
        specOpTags.push(t)
        if (t === 'all') {
          basketId = undefined
        }
      } else {
        tags.push(t)
      }
    }
  }

  if (specOp && specOp.resultFromTags) {
    const r = await specOp.resultFromTags(storage, auth, vargs, specOpTags)
    return r
  }

  let tagIds: number[] = []
  if (tags && tags.length > 0) {
    await storage.filterOutputTags({ partial: { userId, isDeleted: false } }, ot => {
      if (tags.includes(ot.tag)) {
        tagIds.push(ot.outputTagId)
      }
    })
  }

  const isQueryModeAll = vargs.tagQueryMode === 'all'
  if (isQueryModeAll && tagIds.length < tags.length)
    // all the required tags don't exist, impossible to satisfy.
    return r

  if (!isQueryModeAll && tagIds.length === 0 && tags.length > 0)
    // any and only non-existing labels, impossible to satisfy.
    return r

  const noTags = tagIds.length === 0
  const includeSpent = false

  const stati: TransactionStatus[] = ['completed', 'unproven', 'nosend']

  const args: sdk.FindOutputsArgs = {
    partial: {
      userId,
      basketId,
      spendable: !includeSpent ? true : undefined
    },
    txStatus: stati,
    noScript: true
  }
  if (!specOp || !specOp.ignoreLimit) args.paged = { limit, offset }

  let outputs = await storage.findOutputs(args, tagIds, isQueryModeAll)
  if (outputs.length === vargs.limit) {
    args.paged = undefined
    r.totalOutputs = await storage.countOutputs(args, tagIds, isQueryModeAll)
  } else {
    r.totalOutputs = outputs.length
  }

  if (specOp) {
    if (specOp.filterOutputs) outputs = await specOp.filterOutputs(storage, auth, vargs, specOpTags, outputs)
    if (specOp.resultFromOutputs) {
      const r = await specOp.resultFromOutputs(storage, auth, vargs, specOpTags, outputs)
      return r
    }
  }

  /*
        ListOutputsArgs {
            include?: 'locking scripts' | 'entire transactions'
            includeCustomInstructions?: BooleanDefaultFalse
            includeTags?: BooleanDefaultFalse
            includeLabels?: BooleanDefaultFalse
        }

        ListOutputsResult {
            totalOutputs: PositiveIntegerOrZero
            BEEF?: BEEF
            outputs: Array<WalletOutput>
        }

        WalletOutput {
            satoshis: SatoshiValue
            spendable: boolean
            outpoint: OutpointString

            customInstructions?: string
            lockingScript?: HexString
            tags?: OutputTagStringUnder300Bytes[]
            labels?: LabelStringUnder300Bytes[]
        }
    */

  const labelsByTxid: Record<string, string[]> = {}

  const beef = new Beef()

  for (const o of outputs) {
    const wo: WalletOutput = {
      satoshis: Number(o.satoshis),
      spendable: !!o.spendable,
      outpoint: `${o.txid}.${o.vout}`
    }
    r.outputs.push(wo)
    //if (vargs.includeBasket && o.basketId) {
    //    if (!basketsById[o.basketId]) {
    //        basketsById[o.basketId] = verifyTruthy(await dsk.findOutputBasketId(o.basketId!, trx))
    //    }
    //    wo.basket = basketsById[o.basketId].name
    //}
    if (vargs.includeCustomInstructions && o.customInstructions) wo.customInstructions = o.customInstructions
    if (vargs.includeLabels && o.txid) {
      if (labelsByTxid[o.txid] === undefined) {
        labelsByTxid[o.txid] = (await storage.getLabelsForTransactionId(o.transactionId)).map(l => l.label)
      }
      wo.labels = labelsByTxid[o.txid]
    }
    if (vargs.includeTags) {
      wo.tags = (await storage.getTagsForOutputId(o.outputId)).map(t => t.tag)
    }
    if (vargs.includeLockingScripts) {
      await storage.validateOutputScript(o)
      if (o.lockingScript) wo.lockingScript = asString(o.lockingScript)
    }
    if (vargs.includeTransactions && !beef.findTxid(o.txid!)) {
      await storage.getValidBeefForKnownTxid(o.txid!, beef, undefined, vargs.knownTxids)
    }
  }

  if (vargs.includeTransactions) {
    r.BEEF = beef.toBinary()
  }

  return r
}
