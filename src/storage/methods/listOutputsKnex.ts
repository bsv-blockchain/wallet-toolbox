import { Beef, ListOutputsResult, OriginatorDomainNameStringUnder250Bytes, WalletOutput } from '@bsv/sdk'
import { TableOutput, TableOutputBasket, TableOutputTag } from '../index.client'
import { asString, sdk, verifyId, verifyInteger, verifyOne } from '../../index.client'
import { StorageKnex } from '../StorageKnex'
import { getBasketToSpecOp, ListOutputsSpecOp } from './ListOutputsSpecOp'

export async function listOutputs(
  dsk: StorageKnex,
  auth: sdk.AuthId,
  vargs: sdk.ValidListOutputsArgs,
  originator?: OriginatorDomainNameStringUnder250Bytes
): Promise<ListOutputsResult> {
  const trx: sdk.TrxToken | undefined = undefined
  const userId = verifyId(auth.userId)
  const limit = vargs.limit
  const offset = vargs.offset

  const k = dsk.toDb(trx)

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
    specOp = getBasketToSpecOp()[b]
    b = specOp ? (specOp.useBasket ? specOp.useBasket : '') : b
    if (b) {
      const baskets = await dsk.findOutputBaskets({
        partial: { userId, name: b },
        trx
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

  let tagIds: number[] = []
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
    const r = await specOp.resultFromTags(dsk, auth, vargs, specOpTags)
    return r
  }

  if (tags && tags.length > 0) {
    const q = k<TableOutputTag>('output_tags')
      .where({
        userId: userId,
        isDeleted: false
      })
      .whereNotNull('outputTagId')
      .whereIn('tag', tags)
      .select('outputTagId')
    const r = await q
    tagIds = r.map(r => r.outputTagId!)
  }

  const isQueryModeAll = vargs.tagQueryMode === 'all'
  if (isQueryModeAll && tagIds.length < tags.length)
    // all the required tags don't exist, impossible to satisfy.
    return r

  if (!isQueryModeAll && tagIds.length === 0 && tags.length > 0)
    // any and only non-existing labels, impossible to satisfy.
    return r

  const columns: string[] = [
    'outputId',
    'transactionId',
    'basketId',
    'spendable',
    'txid',
    'vout',
    'satoshis',
    'lockingScript',
    'customInstructions',
    'outputDescription',
    'spendingDescription',
    'scriptLength',
    'scriptOffset'
  ]

  const noTags = tagIds.length === 0
  const includeSpent = specOp && specOp.includeSpent ? specOp.includeSpent : false

  const txStatusOk = dsk.dbtype === 'PostgreSQL'
    ? `(select status as tstatus from transactions where transactions."transactionId" = outputs."transactionId") in ('completed', 'unproven', 'nosend')`
    : `(select status as tstatus from transactions where transactions.transactionId = outputs.transactionId) in ('completed', 'unproven', 'nosend')`
  const txStatusOkCteq = dsk.dbtype === 'PostgreSQL'
    ? `(select status as tstatus from transactions where transactions."transactionId" = o."transactionId") in ('completed', 'unproven', 'nosend')`
    : `(select status as tstatus from transactions where transactions.transactionId = o.transactionId) in ('completed', 'unproven', 'nosend')`

  const makeWithTagsQueries = () => {
    let cteqOptions = ''
    if (basketId) cteqOptions += ` AND o.basketId = ${basketId}`
    if (!includeSpent) cteqOptions += ` AND o.spendable`
    const cteq = k.raw(`
            SELECT ${columns.map(c => 'o.' + c).join(',')}, 
                    (SELECT COUNT(*) 
                    FROM output_tags_map AS m 
                    WHERE m.OutputId = o.OutputId 
                    AND m.outputTagId IN (${tagIds.join(',')}) 
                    ) AS tc
            FROM outputs AS o
            WHERE o.userId = ${userId} ${cteqOptions} AND ${txStatusOkCteq}
            `)

    const q = k.with('otc', cteq)
    q.from('otc')
    if (isQueryModeAll) q.where('tc', tagIds.length)
    else q.where('tc', '>', 0)
    const qcount = q.clone()
    q.select(columns)
    qcount.count('outputId as total')
    return { q, qcount }
  }

  const makeWithoutTagsQueries = () => {
    const where: Partial<TableOutput> = { userId }
    if (basketId) where.basketId = basketId
    if (!includeSpent) where.spendable = true
    const q = k('outputs').where(where).whereRaw(txStatusOk)
    const qcount = q.clone().count('outputId as total')
    return { q, qcount }
  }

  const { q, qcount } = noTags ? makeWithoutTagsQueries() : makeWithTagsQueries()

  // Sort order when limit and offset are possible must be ascending for determinism.
  if (!specOp || !specOp.ignoreLimit) q.limit(limit).offset(offset)

  q.orderBy('outputId', 'asc')

  let outputs: TableOutput[] = await q

  if (specOp) {
    if (specOp.filterOutputs) outputs = await specOp.filterOutputs(dsk, auth, vargs, specOpTags, outputs)
    if (specOp.resultFromOutputs) {
      const r = await specOp.resultFromOutputs(dsk, auth, vargs, specOpTags, outputs)
      return r
    }
  }

  if (!limit || outputs.length < limit) r.totalOutputs = outputs.length
  else {
    const total = verifyOne(await qcount)['total']
    r.totalOutputs = Number(total)
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
        labelsByTxid[o.txid] = (await dsk.getLabelsForTransactionId(o.transactionId, trx)).map(l => l.label)
      }
      wo.labels = labelsByTxid[o.txid]
    }
    if (vargs.includeTags) {
      wo.tags = (await dsk.getTagsForOutputId(o.outputId, trx)).map(t => t.tag)
    }
    if (vargs.includeLockingScripts) {
      await dsk.validateOutputScript(o, trx)
      if (o.lockingScript) wo.lockingScript = asString(o.lockingScript)
    }
    if (vargs.includeTransactions && !beef.findTxid(o.txid!)) {
      await dsk.getValidBeefForKnownTxid(o.txid!, beef, undefined, vargs.knownTxids, trx)
    }
  }

  if (vargs.includeTransactions) {
    r.BEEF = beef.toBinary()
  }

  return r
}
