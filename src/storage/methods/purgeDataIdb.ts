import { Beef } from '@bsv/sdk'
import { Knex } from 'knex'
import { TableCommission, TableOutput, TableOutputTagMap, TableTransaction, TableTxLabelMap } from '../index.client'
import { sdk } from '../../index.client'
import { StorageIdb } from '../StorageIdb'

export async function purgeDataIdb(
  storage: StorageIdb,
  params: sdk.PurgeParams,
  trx?: sdk.TrxToken
): Promise<sdk.PurgeResults> {
  const r: sdk.PurgeResults = { count: 0, log: '' }
  // TODO: implement purgeDataIdb
  return r
}
