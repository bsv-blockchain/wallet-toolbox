import { ListActionsResult, ListOutputsResult } from '@bsv/sdk'
import { sdk, verifyOne, verifyOneOrNone, verifyTruthy } from '../index.all'
import {
  outputColumnsWithoutLockingScript,
  TableCertificate,
  TableCertificateField,
  TableCertificateX,
  TableCommission,
  TableMonitorEvent,
  TableOutput,
  TableOutputBasket,
  TableOutputTag,
  TableOutputTagMap,
  TableProvenTx,
  TableProvenTxReq,
  TableSettings,
  TableSyncState,
  TableTransaction,
  TableTxLabel,
  TableTxLabelMap,
  TableUser,
  transactionColumnsWithoutRawTx
} from './schema/tables'
import { KnexMigrations } from './schema/KnexMigrations'
import { Knex } from 'knex'
import { StorageAdminStats, StorageProvider, StorageProviderOptions } from './StorageProvider'
import { purgeData } from './methods/purgeData'
import { listActions } from './methods/listActionsKnex'
import { listOutputs } from './methods/listOutputsKnex'
import { DBType } from './StorageReader'
import { reviewStatus } from './methods/reviewStatus'

export interface StorageKnexOptions extends StorageProviderOptions {
  /**
   * Knex database interface initialized with valid connection configuration.
   */
  knex: Knex
}

export class StorageKnex extends StorageProvider implements sdk.WalletStorageProvider {
  knex: Knex

  constructor(options: StorageKnexOptions) {
    super(options)
    if (!options.knex) throw new sdk.WERR_INVALID_PARAMETER('options.knex', `valid`)
    this.knex = options.knex
  }

  async readSettings(): Promise<TableSettings> {
    return this.validateEntity(verifyOne(await this.toDb(undefined)<TableSettings>('settings')))
  }

  override async getProvenOrRawTx(txid: string, trx?: sdk.TrxToken): Promise<sdk.ProvenOrRawTx> {
    const k = this.toDb(trx)
    const r: sdk.ProvenOrRawTx = {
      proven: undefined,
      rawTx: undefined,
      inputBEEF: undefined
    }

    r.proven = verifyOneOrNone(await this.findProvenTxs({ partial: { txid: txid } }))
    if (!r.proven) {
      const reqRawTx = verifyOneOrNone(
        await k('proven_tx_reqs')
          .where('txid', txid)
          .whereIn('status', ['unsent', 'unmined', 'unconfirmed', 'sending', 'nosend', 'completed'])
          .select('rawTx', 'inputBEEF')
      )
      if (reqRawTx) {
        r.rawTx = Array.from(reqRawTx.rawTx)
        r.inputBEEF = Array.from(reqRawTx.inputBEEF)
      }
    }
    return r
  }

  dbTypeSubstring(source: string, fromOffset: number, forLength?: number) {
    if (this.dbtype === 'MySQL') return `substring(${source} from ${fromOffset} for ${forLength!})`
    return `substr(${source}, ${fromOffset}, ${forLength})`
  }

  override async getRawTxOfKnownValidTransaction(
    txid?: string,
    offset?: number,
    length?: number,
    trx?: sdk.TrxToken
  ): Promise<number[] | undefined> {
    if (!txid) return undefined
    if (!this.isAvailable()) await this.makeAvailable()

    let rawTx: number[] | undefined = undefined
    if (Number.isInteger(offset) && Number.isInteger(length)) {
      let rs: { rawTx: Buffer | null }[] = await this.toDb(trx).raw(
        `select ${this.dbTypeSubstring('rawTx', offset! + 1, length)} as rawTx from proven_txs where txid = '${txid}'`
      )
      if (this.dbtype === 'MySQL') rs = (rs as unknown as { rawTx: Buffer | null }[][])[0]
      const r = verifyOneOrNone(rs)
      if (r && r.rawTx) {
        rawTx = Array.from(r.rawTx)
      } else {
        let rs: { rawTx: Buffer | null }[] = await this.toDb(trx).raw(
          `select ${this.dbTypeSubstring('rawTx', offset! + 1, length)} as rawTx from proven_tx_reqs where txid = '${txid}' and status in ('unsent', 'nosend', 'sending', 'unmined', 'completed', 'unfail')`
        )
        if (this.dbtype === 'MySQL') rs = (rs as unknown as { rawTx: Buffer | null }[][])[0]
        const r = verifyOneOrNone(rs)
        if (r && r.rawTx) {
          rawTx = Array.from(r.rawTx)
        }
      }
    } else {
      const r = await this.getProvenOrRawTx(txid, trx)
      if (r.proven) rawTx = r.proven.rawTx
      else rawTx = r.rawTx
    }
    return rawTx
  }

  getProvenTxsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder {
    const k = this.toDb(args.trx)
    let q = k('proven_txs').where(function () {
      this.whereExists(
        k
          .select('*')
          .from('transactions')
          .whereRaw(`proven_txs.provenTxId = transactions.provenTxId and transactions.userId = ${args.userId}`)
      )
    })
    if (args.paged) {
      q = q.limit(args.paged.limit)
      q = q.offset(args.paged.offset || 0)
    }
    if (args.since) q = q.where('updated_at', '>=', this.validateDateForWhere(args.since))
    return q
  }
  override async getProvenTxsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTx[]> {
    const q = this.getProvenTxsForUserQuery(args)
    const rs = await q
    return this.validateEntities(rs)
  }

  getProvenTxReqsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder {
    const k = this.toDb(args.trx)
    let q = k('proven_tx_reqs').where(function () {
      this.whereExists(
        k
          .select('*')
          .from('transactions')
          .whereRaw(`proven_tx_reqs.txid = transactions.txid and transactions.userId = ${args.userId}`)
      )
    })
    if (args.paged) {
      q = q.limit(args.paged.limit)
      q = q.offset(args.paged.offset || 0)
    }
    if (args.since) q = q.where('updated_at', '>=', this.validateDateForWhere(args.since))
    return q
  }
  override async getProvenTxReqsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> {
    const q = this.getProvenTxReqsForUserQuery(args)
    const rs = await q
    return this.validateEntities(rs, undefined, ['notified'])
  }

  getTxLabelMapsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder {
    const k = this.toDb(args.trx)
    let q = k('tx_labels_map').whereExists(
      k
        .select('*')
        .from('tx_labels')
        .whereRaw(`tx_labels.txLabelId = tx_labels_map.txLabelId and tx_labels.userId = ${args.userId}`)
    )
    if (args.since) q = q.where('updated_at', '>=', this.validateDateForWhere(args.since))
    if (args.paged) {
      q = q.limit(args.paged.limit)
      q = q.offset(args.paged.offset || 0)
    }
    return q
  }
  override async getTxLabelMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> {
    const q = this.getTxLabelMapsForUserQuery(args)
    const rs = await q
    return this.validateEntities(rs, undefined, ['isDeleted'])
  }

  getOutputTagMapsForUserQuery(args: sdk.FindForUserSincePagedArgs): Knex.QueryBuilder {
    const k = this.toDb(args.trx)
    let q = k('output_tags_map').whereExists(
      k
        .select('*')
        .from('output_tags')
        .whereRaw(`output_tags.outputTagId = output_tags_map.outputTagId and output_tags.userId = ${args.userId}`)
    )
    if (args.since) q = q.where('updated_at', '>=', this.validateDateForWhere(args.since))
    if (args.paged) {
      q = q.limit(args.paged.limit)
      q = q.offset(args.paged.offset || 0)
    }
    return q
  }
  override async getOutputTagMapsForUser(args: sdk.FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> {
    const q = this.getOutputTagMapsForUserQuery(args)
    const rs = await q
    return this.validateEntities(rs, undefined, ['isDeleted'])
  }

  override async listActions(auth: sdk.AuthId, vargs: sdk.ValidListActionsArgs): Promise<ListActionsResult> {
    if (!auth.userId) throw new sdk.WERR_UNAUTHORIZED()
    return await listActions(this, auth, vargs)
  }
  override async listOutputs(auth: sdk.AuthId, vargs: sdk.ValidListOutputsArgs): Promise<ListOutputsResult> {
    if (!auth.userId) throw new sdk.WERR_UNAUTHORIZED()
    return await listOutputs(this, auth, vargs)
  }

  override async insertProvenTx(tx: TableProvenTx, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.provenTxId === 0) delete e.provenTxId
    const [id] = await this.toDb(trx)<TableProvenTx>('proven_txs').insert(e)
    tx.provenTxId = id
    return tx.provenTxId
  }

  override async insertProvenTxReq(tx: TableProvenTxReq, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.provenTxReqId === 0) delete e.provenTxReqId
    const [id] = await this.toDb(trx)<TableProvenTxReq>('proven_tx_reqs').insert(e)
    tx.provenTxReqId = id
    return tx.provenTxReqId
  }

  override async insertUser(user: TableUser, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(user, trx)
    if (e.userId === 0) delete e.userId
    const [id] = await this.toDb(trx)<TableUser>('users').insert(e)
    user.userId = id
    return user.userId
  }

  override async insertCertificateAuth(auth: sdk.AuthId, certificate: TableCertificateX): Promise<number> {
    if (!auth.userId || (certificate.userId && certificate.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    certificate.userId = auth.userId
    return await this.insertCertificate(certificate)
  }

  override async insertCertificate(certificate: TableCertificateX, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(certificate, trx, undefined, ['isDeleted'])
    const fields = e.fields
    if (e.fields) delete e.fields
    if (e.certificateId === 0) delete e.certificateId
    const [id] = await this.toDb(trx)<TableCertificate>('certificates').insert(e)
    certificate.certificateId = id

    if (fields) {
      for (const field of fields) {
        field.certificateId = id
        field.userId = certificate.userId
        await this.insertCertificateField(field, trx)
      }
    }

    return certificate.certificateId
  }

  override async insertCertificateField(certificateField: TableCertificateField, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(certificateField, trx)
    await this.toDb(trx)<TableCertificate>('certificate_fields').insert(e)
  }

  override async insertOutputBasket(basket: TableOutputBasket, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(basket, trx, undefined, ['isDeleted'])
    if (e.basketId === 0) delete e.basketId
    const [id] = await this.toDb(trx)<TableOutputBasket>('output_baskets').insert(e)
    basket.basketId = id
    return basket.basketId
  }

  override async insertTransaction(tx: TableTransaction, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tx, trx)
    if (e.transactionId === 0) delete e.transactionId
    const [id] = await this.toDb(trx)<TableTransaction>('transactions').insert(e)
    tx.transactionId = id
    return tx.transactionId
  }

  override async insertCommission(commission: TableCommission, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(commission, trx)
    if (e.commissionId === 0) delete e.commissionId
    const [id] = await this.toDb(trx)<TableCommission>('commissions').insert(e)
    commission.commissionId = id
    return commission.commissionId
  }

  override async insertOutput(output: TableOutput, trx?: sdk.TrxToken): Promise<number> {
    try {
      const e = await this.validateEntityForInsert(output, trx)
      if (e.outputId === 0) delete e.outputId
      const [id] = await this.toDb(trx)<TableOutput>('outputs').insert(e)
      output.outputId = id
      return output.outputId
    } catch (e) {
      throw e
    }
  }

  override async insertOutputTag(tag: TableOutputTag, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(tag, trx, undefined, ['isDeleted'])
    if (e.outputTagId === 0) delete e.outputTagId
    const [id] = await this.toDb(trx)<TableOutputTag>('output_tags').insert(e)
    tag.outputTagId = id
    return tag.outputTagId
  }

  override async insertOutputTagMap(tagMap: TableOutputTagMap, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(tagMap, trx, undefined, ['isDeleted'])
    const [id] = await this.toDb(trx)<TableOutputTagMap>('output_tags_map').insert(e)
  }

  override async insertTxLabel(label: TableTxLabel, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(label, trx, undefined, ['isDeleted'])
    if (e.txLabelId === 0) delete e.txLabelId
    const [id] = await this.toDb(trx)<TableTxLabel>('tx_labels').insert(e)
    label.txLabelId = id
    return label.txLabelId
  }

  override async insertTxLabelMap(labelMap: TableTxLabelMap, trx?: sdk.TrxToken): Promise<void> {
    const e = await this.validateEntityForInsert(labelMap, trx, undefined, ['isDeleted'])
    const [id] = await this.toDb(trx)<TableTxLabelMap>('tx_labels_map').insert(e)
  }

  override async insertMonitorEvent(event: TableMonitorEvent, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(event, trx)
    if (e.id === 0) delete e.id
    const [id] = await this.toDb(trx)<TableMonitorEvent>('monitor_events').insert(e)
    event.id = id
    return event.id
  }

  override async insertSyncState(syncState: TableSyncState, trx?: sdk.TrxToken): Promise<number> {
    const e = await this.validateEntityForInsert(syncState, trx, ['when'], ['init'])
    if (e.syncStateId === 0) delete e.syncStateId
    const [id] = await this.toDb(trx)<TableSyncState>('sync_states').insert(e)
    syncState.syncStateId = id
    return syncState.syncStateId
  }

  override async updateCertificateField(
    certificateId: number,
    fieldName: string,
    update: Partial<TableCertificateField>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableCertificateField>('certificate_fields')
      .where({ certificateId, fieldName })
      .update(this.validatePartialForUpdate(update))
  }
  override async updateCertificate(id: number, update: Partial<TableCertificate>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableCertificate>('certificates')
      .where({ certificateId: id })
      .update(this.validatePartialForUpdate(update, undefined, ['isDeleted']))
  }
  override async updateCommission(id: number, update: Partial<TableCommission>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableCommission>('commissions')
      .where({ commissionId: id })
      .update(this.validatePartialForUpdate(update))
  }
  override async updateOutputBasket(
    id: number,
    update: Partial<TableOutputBasket>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableOutputBasket>('output_baskets')
      .where({ basketId: id })
      .update(this.validatePartialForUpdate(update, undefined, ['isDeleted']))
  }
  override async updateOutput(id: number, update: Partial<TableOutput>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableOutput>('outputs')
      .where({ outputId: id })
      .update(this.validatePartialForUpdate(update))
  }
  override async updateOutputTagMap(
    outputId: number,
    tagId: number,
    update: Partial<TableOutputTagMap>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableOutputTagMap>('output_tags_map')
      .where({ outputId, outputTagId: tagId })
      .update(this.validatePartialForUpdate(update, undefined, ['isDeleted']))
  }
  override async updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableOutputTag>('output_tags')
      .where({ outputTagId: id })
      .update(this.validatePartialForUpdate(update, undefined, ['isDeleted']))
  }
  override async updateProvenTxReq(
    id: number | number[],
    update: Partial<TableProvenTxReq>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    let r: number
    if (Array.isArray(id)) {
      r = await this.toDb(trx)<TableProvenTxReq>('proven_tx_reqs')
        .whereIn('provenTxReqId', id)
        .update(this.validatePartialForUpdate(update))
    } else if (Number.isInteger(id)) {
      r = await this.toDb(trx)<TableProvenTxReq>('proven_tx_reqs')
        .where({ provenTxReqId: id })
        .update(this.validatePartialForUpdate(update))
    } else {
      throw new sdk.WERR_INVALID_PARAMETER('id', 'transactionId or array of transactionId')
    }
    return r
  }
  override async updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableProvenTx>('proven_txs')
      .where({ provenTxId: id })
      .update(this.validatePartialForUpdate(update))
  }
  override async updateSyncState(id: number, update: Partial<TableSyncState>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableSyncState>('sync_states')
      .where({ syncStateId: id })
      .update(this.validatePartialForUpdate(update, ['when'], ['init']))
  }
  override async updateTransaction(
    id: number | number[],
    update: Partial<TableTransaction>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    let r: number
    if (Array.isArray(id)) {
      r = await this.toDb(trx)<TableTransaction>('transactions')
        .whereIn('transactionId', id)
        .update(await this.validatePartialForUpdate(update))
    } else if (Number.isInteger(id)) {
      r = await this.toDb(trx)<TableTransaction>('transactions')
        .where({ transactionId: id })
        .update(await this.validatePartialForUpdate(update))
    } else {
      throw new sdk.WERR_INVALID_PARAMETER('id', 'transactionId or array of transactionId')
    }
    return r
  }
  override async updateTxLabelMap(
    transactionId: number,
    txLabelId: number,
    update: Partial<TableTxLabelMap>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableTxLabelMap>('tx_labels_map')
      .where({ transactionId, txLabelId })
      .update(this.validatePartialForUpdate(update, undefined, ['isDeleted']))
  }
  override async updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableTxLabel>('tx_labels')
      .where({ txLabelId: id })
      .update(this.validatePartialForUpdate(update, undefined, ['isDeleted']))
  }
  override async updateUser(id: number, update: Partial<TableUser>, trx?: sdk.TrxToken): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableUser>('users').where({ userId: id }).update(this.validatePartialForUpdate(update))
  }
  override async updateMonitorEvent(
    id: number,
    update: Partial<TableMonitorEvent>,
    trx?: sdk.TrxToken
  ): Promise<number> {
    await this.verifyReadyForDatabaseAccess(trx)
    return await this.toDb(trx)<TableMonitorEvent>('monitor_events')
      .where({ id })
      .update(this.validatePartialForUpdate(update))
  }

  setupQuery<T extends object>(table: string, args: sdk.FindPartialSincePagedArgs<T>): Knex.QueryBuilder {
    let q = this.toDb(args.trx)<T>(table)
    if (args.partial && Object.keys(args.partial).length > 0) q.where(args.partial)
    if (args.since) q.where('updated_at', '>=', this.validateDateForWhere(args.since))
    if (args.orderDescending) {
      let sortColumn = ''
      switch (table) {
        case 'certificates': sortColumn = 'certificateId'; break
        case 'commissions': sortColumn = 'commissionId'; break
        case 'output_baskets': sortColumn = 'basketId'; break
        case 'outputs': sortColumn = 'outputId'; break
        case 'output_tags': sortColumn = 'outputTagId'; break
        case 'proven_tx_reqs': sortColumn = 'provenTxReqId'; break
        case 'proven_txs': sortColumn = 'provenTxId'; break
        case 'sync_states': sortColumn = 'syncStateId'; break
        case 'transactions': sortColumn = 'transactionId'; break
        case 'tx_labels': sortColumn = 'txLabelId'; break
        case 'users': sortColumn = 'userId'; break
        case 'monitor_events': sortColumn = 'id'; break
        default: break;
      }
      if (sortColumn !== '') {
        q.orderBy(sortColumn, 'desc')
      }
    }
    if (args.paged) {
      q.limit(args.paged.limit)
      q.offset(args.paged.offset || 0)
    }
    return q
  }

  findCertificateFieldsQuery(args: sdk.FindCertificateFieldsArgs): Knex.QueryBuilder {
    return this.setupQuery('certificate_fields', args)
  }
  findCertificatesQuery(args: sdk.FindCertificatesArgs): Knex.QueryBuilder {
    const q = this.setupQuery('certificates', args)
    if (args.certifiers && args.certifiers.length > 0) q.whereIn('certifier', args.certifiers)
    if (args.types && args.types.length > 0) q.whereIn('type', args.types)
    return q
  }
  findCommissionsQuery(args: sdk.FindCommissionsArgs): Knex.QueryBuilder {
    if (args.partial.lockingScript)
      throw new sdk.WERR_INVALID_PARAMETER(
        'partial.lockingScript',
        `undefined. Commissions may not be found by lockingScript value.`
      )
    return this.setupQuery('commissions', args)
  }
  findOutputBasketsQuery(args: sdk.FindOutputBasketsArgs): Knex.QueryBuilder {
    return this.setupQuery('output_baskets', args)
  }
  findOutputsQuery(args: sdk.FindOutputsArgs, count?: boolean): Knex.QueryBuilder {
    if (args.partial.lockingScript)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.lockingScript',
        `undefined. Outputs may not be found by lockingScript value.`
      )
    const q = this.setupQuery('outputs', args)
    if (args.txStatus && args.txStatus.length > 0) {
      q.whereRaw(
        `(select status from transactions where transactions.transactionId = outputs.transactionId) in (${args.txStatus.map(s => `'${s}'`).join(',')})`
      )
    }
    if (args.noScript && !count) {
      const columns = outputColumnsWithoutLockingScript.map(c => `outputs.${c}`)
      q.select(columns)
    }
    return q
  }
  findOutputTagMapsQuery(args: sdk.FindOutputTagMapsArgs): Knex.QueryBuilder {
    const q = this.setupQuery('output_tags_map', args)
    if (args.tagIds && args.tagIds.length > 0) q.whereIn('outputTagId', args.tagIds)
    return q
  }
  findOutputTagsQuery(args: sdk.FindOutputTagsArgs): Knex.QueryBuilder {
    return this.setupQuery('output_tags', args)
  }
  findProvenTxReqsQuery(args: sdk.FindProvenTxReqsArgs): Knex.QueryBuilder {
    if (args.partial.rawTx)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.rawTx',
        `undefined. ProvenTxReqs may not be found by rawTx value.`
      )
    if (args.partial.inputBEEF)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.inputBEEF',
        `undefined. ProvenTxReqs may not be found by inputBEEF value.`
      )
    const q = this.setupQuery('proven_tx_reqs', args)
    if (args.status && args.status.length > 0) q.whereIn('status', args.status)
    if (args.txids) {
      const txids = args.txids.filter(txid => txid !== undefined)
      if (txids.length > 0) q.whereIn('txid', txids)
    }
    return q
  }
  findProvenTxsQuery(args: sdk.FindProvenTxsArgs): Knex.QueryBuilder {
    if (args.partial.rawTx)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.rawTx',
        `undefined. ProvenTxs may not be found by rawTx value.`
      )
    if (args.partial.merklePath)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.merklePath',
        `undefined. ProvenTxs may not be found by merklePath value.`
      )
    return this.setupQuery('proven_txs', args)
  }
  findSyncStatesQuery(args: sdk.FindSyncStatesArgs): Knex.QueryBuilder {
    return this.setupQuery('sync_states', args)
  }
  findTransactionsQuery(args: sdk.FindTransactionsArgs, count?: boolean): Knex.QueryBuilder {
    if (args.partial.rawTx)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.rawTx',
        `undefined. Transactions may not be found by rawTx value.`
      )
    if (args.partial.inputBEEF)
      throw new sdk.WERR_INVALID_PARAMETER(
        'args.partial.inputBEEF',
        `undefined. Transactions may not be found by inputBEEF value.`
      )
    const q = this.setupQuery('transactions', args)
    if (args.status && args.status.length > 0) q.whereIn('status', args.status)
    if (args.noRawTx && !count) {
      const columns = transactionColumnsWithoutRawTx.map(c => `transactions.${c}`)
      q.select(columns)
    }
    return q
  }
  findTxLabelMapsQuery(args: sdk.FindTxLabelMapsArgs): Knex.QueryBuilder {
    const q = this.setupQuery('tx_labels_map', args)
    if (args.labelIds && args.labelIds.length > 0) q.whereIn('txLabelId', args.labelIds)
    return q
  }
  findTxLabelsQuery(args: sdk.FindTxLabelsArgs): Knex.QueryBuilder {
    return this.setupQuery('tx_labels', args)
  }
  findUsersQuery(args: sdk.FindUsersArgs): Knex.QueryBuilder {
    return this.setupQuery('users', args)
  }
  findMonitorEventsQuery(args: sdk.FindMonitorEventsArgs): Knex.QueryBuilder {
    return this.setupQuery('monitor_events', args)
  }

  override async findCertificatesAuth(auth: sdk.AuthId, args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    if (!auth.userId || (args.partial.userId && args.partial.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    args.partial.userId = auth.userId
    return await this.findCertificates(args)
  }
  override async findOutputBasketsAuth(
    auth: sdk.AuthId,
    args: sdk.FindOutputBasketsArgs
  ): Promise<TableOutputBasket[]> {
    if (!auth.userId || (args.partial.userId && args.partial.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    args.partial.userId = auth.userId
    return await this.findOutputBaskets(args)
  }
  override async findOutputsAuth(auth: sdk.AuthId, args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    if (!auth.userId || (args.partial.userId && args.partial.userId !== auth.userId)) throw new sdk.WERR_UNAUTHORIZED()
    args.partial.userId = auth.userId
    return await this.findOutputs(args)
  }

  override async findCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<TableCertificateField[]> {
    return this.validateEntities(await this.findCertificateFieldsQuery(args))
  }
  override async findCertificates(args: sdk.FindCertificatesArgs): Promise<TableCertificateX[]> {
    const q = this.findCertificatesQuery(args)
    let r: TableCertificateX[] = await q
    r = this.validateEntities(r, undefined, ['isDeleted'])
    if (args.includeFields) {
      for (const c of r) {
        c.fields = this.validateEntities(
          await this.findCertificateFields({
            partial: { certificateId: c.certificateId, userId: c.userId },
            trx: args.trx
          })
        )
      }
    }
    return r
  }
  override async findCommissions(args: sdk.FindCommissionsArgs): Promise<TableCommission[]> {
    const q = this.findCommissionsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['isRedeemed'])
  }
  override async findOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    const q = this.findOutputBasketsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['isDeleted'])
  }
  override async findOutputs(args: sdk.FindOutputsArgs): Promise<TableOutput[]> {
    const q = this.findOutputsQuery(args)
    const r = await q
    if (!args.noScript) {
      for (const o of r) {
        await this.validateOutputScript(o, args.trx)
      }
    }
    return this.validateEntities(r, undefined, ['spendable', 'change'])
  }
  override async findOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> {
    const q = this.findOutputTagMapsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['isDeleted'])
  }
  override async findOutputTags(args: sdk.FindOutputTagsArgs): Promise<TableOutputTag[]> {
    const q = this.findOutputTagsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['isDeleted'])
  }
  override async findProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> {
    const q = this.findProvenTxReqsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['notified'])
  }
  override async findProvenTxs(args: sdk.FindProvenTxsArgs): Promise<TableProvenTx[]> {
    const q = this.findProvenTxsQuery(args)
    const r = await q
    return this.validateEntities(r)
  }
  override async findSyncStates(args: sdk.FindSyncStatesArgs): Promise<TableSyncState[]> {
    const q = this.findSyncStatesQuery(args)
    const r = await q
    return this.validateEntities(r, ['when'], ['init'])
  }
  override async findTransactions(args: sdk.FindTransactionsArgs): Promise<TableTransaction[]> {
    const q = this.findTransactionsQuery(args)
    const r = await q
    if (!args.noRawTx) {
      for (const t of r) {
        await this.validateRawTransaction(t, args.trx)
      }
    }
    return this.validateEntities(r, undefined, ['isOutgoing'])
  }
  override async findTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> {
    const q = this.findTxLabelMapsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['isDeleted'])
  }
  override async findTxLabels(args: sdk.FindTxLabelsArgs): Promise<TableTxLabel[]> {
    const q = this.findTxLabelsQuery(args)
    const r = await q
    return this.validateEntities(r, undefined, ['isDeleted'])
  }
  override async findUsers(args: sdk.FindUsersArgs): Promise<TableUser[]> {
    const q = this.findUsersQuery(args)
    const r = await q
    return this.validateEntities(r)
  }
  override async findMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<TableMonitorEvent[]> {
    const q = this.findMonitorEventsQuery(args)
    const r = await q
    return this.validateEntities(r, ['when'], undefined)
  }

  async getCount<T extends object>(q: Knex.QueryBuilder<T, T[]>): Promise<number> {
    q.count()
    const r = await q
    return r[0]['count(*)']
  }

  override async countCertificateFields(args: sdk.FindCertificateFieldsArgs): Promise<number> {
    return await this.getCount(this.findCertificateFieldsQuery(args))
  }
  override async countCertificates(args: sdk.FindCertificatesArgs): Promise<number> {
    return await this.getCount(this.findCertificatesQuery(args))
  }
  override async countCommissions(args: sdk.FindCommissionsArgs): Promise<number> {
    return await this.getCount(this.findCommissionsQuery(args))
  }
  override async countOutputBaskets(args: sdk.FindOutputBasketsArgs): Promise<number> {
    return await this.getCount(this.findOutputBasketsQuery(args))
  }
  override async countOutputs(args: sdk.FindOutputsArgs): Promise<number> {
    return await this.getCount(this.findOutputsQuery(args, true))
  }
  override async countOutputTagMaps(args: sdk.FindOutputTagMapsArgs): Promise<number> {
    return await this.getCount(this.findOutputTagMapsQuery(args))
  }
  override async countOutputTags(args: sdk.FindOutputTagsArgs): Promise<number> {
    return await this.getCount(this.findOutputTagsQuery(args))
  }
  override async countProvenTxReqs(args: sdk.FindProvenTxReqsArgs): Promise<number> {
    return await this.getCount(this.findProvenTxReqsQuery(args))
  }
  override async countProvenTxs(args: sdk.FindProvenTxsArgs): Promise<number> {
    return await this.getCount(this.findProvenTxsQuery(args))
  }
  override async countSyncStates(args: sdk.FindSyncStatesArgs): Promise<number> {
    return await this.getCount(this.findSyncStatesQuery(args))
  }
  override async countTransactions(args: sdk.FindTransactionsArgs): Promise<number> {
    return await this.getCount(this.findTransactionsQuery(args, true))
  }
  override async countTxLabelMaps(args: sdk.FindTxLabelMapsArgs): Promise<number> {
    return await this.getCount(this.findTxLabelMapsQuery(args))
  }
  override async countTxLabels(args: sdk.FindTxLabelsArgs): Promise<number> {
    return await this.getCount(this.findTxLabelsQuery(args))
  }
  override async countUsers(args: sdk.FindUsersArgs): Promise<number> {
    return await this.getCount(this.findUsersQuery(args))
  }
  override async countMonitorEvents(args: sdk.FindMonitorEventsArgs): Promise<number> {
    return await this.getCount(this.findMonitorEventsQuery(args))
  }

  override async destroy(): Promise<void> {
    await this.knex?.destroy()
  }

  override async migrate(storageName: string, storageIdentityKey: string): Promise<string> {
    const config = {
      migrationSource: new KnexMigrations(this.chain, storageName, storageIdentityKey, 1024)
    }
    await this.knex.migrate.latest(config)
    const version = await this.knex.migrate.currentVersion(config)
    return version
  }

  override async dropAllData(): Promise<void> {
    // Only using migrations to migrate down, don't need valid properties for settings table.
    const config = {
      migrationSource: new KnexMigrations('test', '', '', 1024)
    }
    const count = Object.keys(config.migrationSource.migrations).length
    for (let i = 0; i < count; i++) {
      try {
        const r = await this.knex.migrate.down(config)
        if (!r) {
          console.error(`Migration returned falsy result await this.knex.migrate.down(config)`)
          break
        }
      } catch (eu: unknown) {
        break
      }
    }
  }

  override async transaction<T>(scope: (trx: sdk.TrxToken) => Promise<T>, trx?: sdk.TrxToken): Promise<T> {
    if (trx) return await scope(trx)

    return await this.knex.transaction<T>(async knextrx => {
      const trx = knextrx as sdk.TrxToken
      return await scope(trx)
    })
  }

  /**
   * Convert the standard optional `TrxToken` parameter into either a direct knex database instance,
   * or a Knex.Transaction as appropriate.
   */
  toDb(trx?: sdk.TrxToken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = !trx ? this.knex : <Knex.Transaction<any, any[]>>trx
    this.whenLastAccess = new Date()
    return db
  }

  async validateRawTransaction(t: TableTransaction, trx?: sdk.TrxToken): Promise<void> {
    // if there is no txid or there is a rawTransaction return what we have.
    if (t.rawTx || !t.txid) return

    // rawTransaction is missing, see if we moved it ...

    const rawTx = await this.getRawTxOfKnownValidTransaction(t.txid, undefined, undefined, trx)
    if (!rawTx) return
    t.rawTx = rawTx
  }

  _verifiedReadyForDatabaseAccess: boolean = false

  /**
   * Make sure database is ready for access:
   *
   * - dateScheme is known
   * - foreign key constraints are enabled
   *
   * @param trx
   */
  async verifyReadyForDatabaseAccess(trx?: sdk.TrxToken): Promise<DBType> {
    if (!this._settings) {
      this._settings = await this.readSettings()
    }

    if (!this._verifiedReadyForDatabaseAccess) {
      // Make sure foreign key constraint checking is turned on in SQLite.
      if (this._settings.dbtype === 'SQLite') {
        await this.toDb(trx).raw('PRAGMA foreign_keys = ON;')
      }

      this._verifiedReadyForDatabaseAccess = true
    }

    return this._settings.dbtype
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process the update template for entities being updated.
   */
  validatePartialForUpdate<T extends sdk.EntityTimeStamp>(
    update: Partial<T>,
    dateFields?: string[],
    booleanFields?: string[]
  ): Partial<T> {
    if (!this.dbtype) throw new sdk.WERR_INTERNAL('must call verifyReadyForDatabaseAccess first')
    const v: any = update
    if (v.created_at) v.created_at = this.validateEntityDate(v.created_at)
    if (v.updated_at) v.updated_at = this.validateEntityDate(v.updated_at)
    if (!v.created_at) delete v.created_at
    if (!v.updated_at) v.updated_at = this.validateEntityDate(new Date())

    if (dateFields) {
      for (const df of dateFields) {
        if (v[df]) v[df] = this.validateOptionalEntityDate(v[df])
      }
    }
    if (booleanFields) {
      for (const df of booleanFields) {
        if (update[df] !== undefined) update[df] = !!update[df] ? 1 : 0
      }
    }
    for (const key of Object.keys(v)) {
      const val = v[key]
      if (Array.isArray(val) && (val.length === 0 || typeof val[0] === 'number')) {
        v[key] = Buffer.from(val)
      } else if (val === undefined) {
        v[key] = null
      }
    }
    this.isDirty = true
    return v
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process new entities being inserted into the database.
   */
  async validateEntityForInsert<T extends sdk.EntityTimeStamp>(
    entity: T,
    trx?: sdk.TrxToken,
    dateFields?: string[],
    booleanFields?: string[]
  ): Promise<any> {
    await this.verifyReadyForDatabaseAccess(trx)
    const v: any = { ...entity }
    v.created_at = this.validateOptionalEntityDate(v.created_at, true)!
    v.updated_at = this.validateOptionalEntityDate(v.updated_at, true)!
    if (!v.created_at) delete v.created_at
    if (!v.updated_at) delete v.updated_at
    if (dateFields) {
      for (const df of dateFields) {
        if (v[df]) v[df] = this.validateOptionalEntityDate(v[df])
      }
    }
    if (booleanFields) {
      for (const df of booleanFields) {
        if (entity[df] !== undefined) entity[df] = !!entity[df] ? 1 : 0
      }
    }
    for (const key of Object.keys(v)) {
      const val = v[key]
      if (Array.isArray(val) && (val.length === 0 || typeof val[0] === 'number')) {
        v[key] = Buffer.from(val)
      } else if (val === undefined) {
        v[key] = null
      }
    }
    this.isDirty = true
    return v
  }

  override async getLabelsForTransactionId(transactionId?: number, trx?: sdk.TrxToken): Promise<TableTxLabel[]> {
    if (transactionId === undefined) return []
    const labels = await this.toDb(trx)<TableTxLabel>('tx_labels')
      .join('tx_labels_map', 'tx_labels_map.txLabelId', 'tx_labels.txLabelId')
      .where('tx_labels_map.transactionId', transactionId)
      .whereNot('tx_labels_map.isDeleted', true)
      .whereNot('tx_labels.isDeleted', true)
    return this.validateEntities(labels, undefined, ['isDeleted'])
  }

  override async getTagsForOutputId(outputId: number, trx?: sdk.TrxToken): Promise<TableOutputTag[]> {
    const tags = await this.toDb(trx)<TableOutputTag>('output_tags')
      .join('output_tags_map', 'output_tags_map.outputTagId', 'output_tags.outputTagId')
      .where('output_tags_map.outputId', outputId)
      .whereNot('output_tags_map.isDeleted', true)
      .whereNot('output_tags.isDeleted', true)
    return this.validateEntities(tags, undefined, ['isDeleted'])
  }

  override async purgeData(params: sdk.PurgeParams, trx?: sdk.TrxToken): Promise<sdk.PurgeResults> {
    return await purgeData(this, params, trx)
  }

  override async reviewStatus(args: { agedLimit: Date; trx?: sdk.TrxToken }): Promise<{ log: string }> {
    return await reviewStatus(this, args)
  }

  /**
   * Counts the outputs for userId in basketId that are spendable: true
   * AND whose transaction status is one of:
   * - completed
   * - unproven
   * - sending (if excludeSending is false)
   */
  async countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> {
    const status: sdk.TransactionStatus[] = ['completed', 'unproven']
    if (!excludeSending) status.push('sending')
    const statusText = status.map(s => `'${s}'`).join(',')
    const txStatusCondition = `(SELECT status FROM transactions WHERE outputs.transactionId = transactions.transactionId) in (${statusText})`
    let q = this.knex<TableOutput>('outputs').where({ userId, spendable: true, basketId }).whereRaw(txStatusCondition)
    const count = await this.getCount(q)
    return count
  }

  /**
   *  Finds closest matching available change output to use as input for new transaction.
   *
   * Transactionally allocate the output such that
   */
  async allocateChangeInput(
    userId: number,
    basketId: number,
    targetSatoshis: number,
    exactSatoshis: number | undefined,
    excludeSending: boolean,
    transactionId: number
  ): Promise<TableOutput | undefined> {
    const status: sdk.TransactionStatus[] = ['completed', 'unproven']
    if (!excludeSending) status.push('sending')
    const statusText = status.map(s => `'${s}'`).join(',')

    const r: TableOutput | undefined = await this.knex.transaction(async trx => {
      const txStatusCondition = `AND (SELECT status FROM transactions WHERE outputs.transactionId = transactions.transactionId) in (${statusText})`

      let outputId: number | undefined
      const setOutputId = async (rawQuery: string): Promise<void> => {
        let oidr = await trx.raw(rawQuery)
        outputId = undefined
        if (!oidr['outputId'] && oidr.length > 0) oidr = oidr[0]
        if (!oidr['outputId'] && oidr.length > 0) oidr = oidr[0]
        if (oidr['outputId']) outputId = Number(oidr['outputId'])
      }

      if (exactSatoshis !== undefined) {
        // Find outputId of output that with exactSatoshis
        await setOutputId(`
                SELECT outputId 
                FROM outputs
                WHERE userId = ${userId} 
                    AND spendable = 1 
                    AND basketId = ${basketId}
                    ${txStatusCondition}
                    AND satoshis = ${exactSatoshis}
                LIMIT 1;
                `)
      }

      if (outputId === undefined) {
        // Find outputId of output that would at least fund targetSatoshis
        await setOutputId(`
                    SELECT outputId 
                    FROM outputs
                    WHERE userId = ${userId} 
                        AND spendable = 1 
                        AND basketId = ${basketId}
                        ${txStatusCondition}
                        AND satoshis - ${targetSatoshis} = (
                            SELECT MIN(satoshis - ${targetSatoshis}) 
                            FROM outputs 
                            WHERE userId = ${userId} 
                            AND spendable = 1 
                            AND basketId = ${basketId}
                            ${txStatusCondition}
                            AND satoshis - ${targetSatoshis} >= 0
                        )
                    LIMIT 1;
                    `)
      }

      if (outputId === undefined) {
        // Find outputId of output that would add the most fund targetSatoshis
        await setOutputId(`
                    SELECT outputId 
                    FROM outputs
                    WHERE userId = ${userId} 
                        AND spendable = 1 
                        AND basketId = ${basketId}
                        ${txStatusCondition}
                        AND satoshis - ${targetSatoshis} = (
                            SELECT MAX(satoshis - ${targetSatoshis}) 
                            FROM outputs 
                            WHERE userId = ${userId} 
                            AND spendable = 1 
                            AND basketId = ${basketId}
                            ${txStatusCondition}
                            AND satoshis - ${targetSatoshis} < 0
                        )
                    LIMIT 1;
                    `)
      }

      if (outputId === undefined) return undefined

      await this.updateOutput(
        outputId,
        {
          spendable: false,
          spentBy: transactionId
        },
        trx
      )

      const r = verifyTruthy(await this.findOutputById(outputId, trx))
      return r
    })

    return r
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process all individual records with time stamps retreived from database.
   */
  validateEntity<T extends sdk.EntityTimeStamp>(entity: T, dateFields?: string[], booleanFields?: string[]): T {
    entity.created_at = this.validateDate(entity.created_at)
    entity.updated_at = this.validateDate(entity.updated_at)
    if (dateFields) {
      for (const df of dateFields) {
        if (entity[df]) entity[df] = this.validateDate(entity[df])
      }
    }
    if (booleanFields) {
      for (const df of booleanFields) {
        if (entity[df] !== undefined) entity[df] = !!entity[df]
      }
    }
    for (const key of Object.keys(entity)) {
      const val = entity[key]
      if (val === null) {
        entity[key] = undefined
      } else if (Buffer.isBuffer(val)) {
        entity[key] = Array.from(val)
      }
    }
    return entity
  }

  /**
   * Helper to force uniform behavior across database engines.
   * Use to process all arrays of records with time stamps retreived from database.
   * @returns input `entities` array with contained values validated.
   */
  validateEntities<T extends sdk.EntityTimeStamp>(entities: T[], dateFields?: string[], booleanFields?: string[]): T[] {
    for (let i = 0; i < entities.length; i++) {
      entities[i] = this.validateEntity(entities[i], dateFields, booleanFields)
    }
    return entities
  }

  async adminStats(adminIdentityKey: string): Promise<StorageAdminStats> {
    if (this.dbtype !== 'MySQL') throw new sdk.WERR_NOT_IMPLEMENTED('adminStats, only MySQL is supported')

    const one_day_ago = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const one_week_ago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const one_month_ago = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [
      [
        {
          usersDay,
          usersMonth,
          usersWeek,
          usersTotal,
          transactionsDay,
          transactionsMonth,
          transactionsWeek,
          transactionsTotal,
          txCompletedDay,
          txCompletedMonth,
          txCompletedWeek,
          txCompletedTotal,
          txFailedDay,
          txFailedMonth,
          txFailedWeek,
          txFailedTotal,
          txUnprocessedDay,
          txUnprocessedMonth,
          txUnprocessedWeek,
          txUnprocessedTotal,
          txSendingDay,
          txSendingMonth,
          txSendingWeek,
          txSendingTotal,
          txUnprovenDay,
          txUnprovenMonth,
          txUnprovenWeek,
          txUnprovenTotal,
          txUnsignedDay,
          txUnsignedMonth,
          txUnsignedWeek,
          txUnsignedTotal,
          txNosendDay,
          txNosendMonth,
          txNosendWeek,
          txNosendTotal,
          txNonfinalDay,
          txNonfinalMonth,
          txNonfinalWeek,
          txNonfinalTotal,
          txUnfailDay,
          txUnfailMonth,
          txUnfailWeek,
          txUnfailTotal,
          satoshisDefaultDay,
          satoshisDefaultMonth,
          satoshisDefaultWeek,
          satoshisDefaultTotal,
          satoshisOtherDay,
          satoshisOtherMonth,
          satoshisOtherWeek,
          satoshisOtherTotal,
          basketsDay,
          basketsMonth,
          basketsWeek,
          basketsTotal,
          labelsDay,
          labelsMonth,
          labelsWeek,
          labelsTotal,
          tagsDay,
          tagsMonth,
          tagsWeek,
          tagsTotal
        }
      ]
    ] = await this.knex.raw(`
select
    (select count(*) from users where created_at > '${one_day_ago}') as usersDay,
    (select count(*) from users where created_at > '${one_week_ago}') as usersWeek,
    (select count(*) from users where created_at > '${one_month_ago}') as usersMonth,
	  (select count(*) from users) as usersTotal,
    (select count(*) from transactions where created_at > '${one_day_ago}') as transactionsDay,
    (select count(*) from transactions where created_at > '${one_week_ago}') as transactionsWeek,
    (select count(*) from transactions where created_at > '${one_month_ago}') as transactionsMonth,
	  (select count(*) from transactions) as transactionsTotal,
    (select count(*) from transactions where status = 'completed' and created_at > '${one_day_ago}') as txCompletedDay,
    (select count(*) from transactions where status = 'completed' and created_at > '${one_week_ago}') as txCompletedWeek,
    (select count(*) from transactions where status = 'completed' and created_at > '${one_month_ago}') as txCompletedMonth,
	  (select count(*) from transactions where status = 'completed') as txCompletedTotal,
    (select count(*) from transactions where status = 'failed' and created_at > '${one_day_ago}') as txFailedDay,
    (select count(*) from transactions where status = 'failed' and created_at > '${one_week_ago}') as txFailedWeek,
    (select count(*) from transactions where status = 'failed' and created_at > '${one_month_ago}') as txFailedMonth,
	  (select count(*) from transactions where status = 'failed') as txFailedTotal,
    (select count(*) from transactions where status = 'unprocessed' and created_at > '${one_day_ago}') as txUnprocessedDay,
    (select count(*) from transactions where status = 'unprocessed' and created_at > '${one_week_ago}') as txUnprocessedWeek,
    (select count(*) from transactions where status = 'unprocessed' and created_at > '${one_month_ago}') as txUnprocessedMonth,
	  (select count(*) from transactions where status = 'unprocessed') as txUnprocessedTotal,
    (select count(*) from transactions where status = 'sending' and created_at > '${one_day_ago}') as txSendingDay,
    (select count(*) from transactions where status = 'sending' and created_at > '${one_week_ago}') as txSendingWeek,
    (select count(*) from transactions where status = 'sending' and created_at > '${one_month_ago}') as txSendingMonth,
	  (select count(*) from transactions where status = 'sending') as txSendingTotal,
    (select count(*) from transactions where status = 'unproven' and created_at > '${one_day_ago}') as txUnprovenDay,
    (select count(*) from transactions where status = 'unproven' and created_at > '${one_week_ago}') as txUnprovenWeek,
    (select count(*) from transactions where status = 'unproven' and created_at > '${one_month_ago}') as txUnprovenMonth,
	  (select count(*) from transactions where status = 'unproven') as txUnprovenTotal,
    (select count(*) from transactions where status = 'unsigned' and created_at > '${one_day_ago}') as txUnsignedDay,
    (select count(*) from transactions where status = 'unsigned' and created_at > '${one_week_ago}') as txUnsignedWeek,
    (select count(*) from transactions where status = 'unsigned' and created_at > '${one_month_ago}') as txUnsignedMonth,
	  (select count(*) from transactions where status = 'unsigned') as txUnsignedTotal,
    (select count(*) from transactions where status = 'nosend' and created_at > '${one_day_ago}') as txNosendDay,
    (select count(*) from transactions where status = 'nosend' and created_at > '${one_week_ago}') as txNosendWeek,
    (select count(*) from transactions where status = 'nosend' and created_at > '${one_month_ago}') as txNosendMonth,
	  (select count(*) from transactions where status = 'nosend') as txNosendTotal,
    (select count(*) from transactions where status = 'nonfinal' and created_at > '${one_day_ago}') as txNonfinalDay,
    (select count(*) from transactions where status = 'nonfinal' and created_at > '${one_week_ago}') as txNonfinalWeek,
    (select count(*) from transactions where status = 'nonfinal' and created_at > '${one_month_ago}') as txNonfinalMonth,
	  (select count(*) from transactions where status = 'nonfinal') as txNonfinalTotal,
    (select count(*) from transactions where status = 'unfail' and created_at > '${one_day_ago}') as txUnfailDay,
    (select count(*) from transactions where status = 'unfail' and created_at > '${one_week_ago}') as txUnfailWeek,
    (select count(*) from transactions where status = 'unfail' and created_at > '${one_month_ago}') as txUnfailMonth,
	  (select count(*) from transactions where status = 'unfail') as txUnfailTotal,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1 and created_at > '${one_day_ago}') as satoshisDefaultDay,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1 and created_at > '${one_week_ago}') as satoshisDefaultWeek,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1 and created_at > '${one_month_ago}') as satoshisDefaultMonth,
	  (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 1) as satoshisDefaultTotal,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null and created_at > '${one_day_ago}') as satoshisOtherDay,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null and created_at > '${one_week_ago}') as satoshisOtherWeek,
    (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null and created_at > '${one_month_ago}') as satoshisOtherMonth,
	  (select sum(satoshis) from outputs where spendable = 1 and \`change\` = 0 and not basketId is null) as satoshisOtherTotal,
    (select count(*) from output_baskets where created_at > '${one_day_ago}') as basketsDay,
    (select count(*) from output_baskets where created_at > '${one_week_ago}') as basketsWeek,
    (select count(*) from output_baskets where created_at > '${one_month_ago}') as basketsMonth,
	  (select count(*) from output_baskets) as basketsTotal,
    (select count(*) from tx_labels where created_at > '${one_day_ago}') as labelsDay,
    (select count(*) from tx_labels where created_at > '${one_week_ago}') as labelsWeek,
    (select count(*) from tx_labels where created_at > '${one_month_ago}') as labelsMonth,
	  (select count(*) from tx_labels) as labelsTotal,
    (select count(*) from output_tags where created_at > '${one_day_ago}') as tagsDay,
    (select count(*) from output_tags where created_at > '${one_week_ago}') as tagsWeek,
    (select count(*) from output_tags where created_at > '${one_month_ago}') as tagsMonth,
	  (select count(*) from output_tags) as tagsTotal
      `)
    const r: StorageAdminStats = {
      requestedBy: adminIdentityKey,
      when: new Date().toISOString(),
      usersDay,
      usersWeek,
      usersMonth,
      usersTotal,
      transactionsDay,
      transactionsWeek,
      transactionsMonth,
      transactionsTotal,
      txCompletedDay,
      txCompletedWeek,
      txCompletedMonth,
      txCompletedTotal,
      txFailedDay,
      txFailedWeek,
      txFailedMonth,
      txFailedTotal,
      txUnprocessedDay,
      txUnprocessedWeek,
      txUnprocessedMonth,
      txUnprocessedTotal,
      txSendingDay,
      txSendingWeek,
      txSendingMonth,
      txSendingTotal,
      txUnprovenDay,
      txUnprovenWeek,
      txUnprovenMonth,
      txUnprovenTotal,
      txUnsignedDay,
      txUnsignedWeek,
      txUnsignedMonth,
      txUnsignedTotal,
      txNosendDay,
      txNosendWeek,
      txNosendMonth,
      txNosendTotal,
      txNonfinalDay,
      txNonfinalWeek,
      txNonfinalMonth,
      txNonfinalTotal,
      txUnfailDay,
      txUnfailWeek,
      txUnfailMonth,
      txUnfailTotal,
      satoshisDefaultDay: Number(satoshisDefaultDay),
      satoshisDefaultWeek: Number(satoshisDefaultWeek),
      satoshisDefaultMonth: Number(satoshisDefaultMonth),
      satoshisDefaultTotal: Number(satoshisDefaultTotal),
      satoshisOtherDay: Number(satoshisOtherDay),
      satoshisOtherWeek: Number(satoshisOtherWeek),
      satoshisOtherMonth: Number(satoshisOtherMonth),
      satoshisOtherTotal: Number(satoshisOtherTotal),
      basketsDay,
      basketsWeek,
      basketsMonth,
      basketsTotal,
      labelsDay,
      labelsWeek,
      labelsMonth,
      labelsTotal,
      tagsDay,
      tagsWeek,
      tagsMonth,
      tagsTotal
    }
    return r
  }
}
