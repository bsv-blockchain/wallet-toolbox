import { Beef, ListActionsResult, ListOutputsResult } from '@bsv/sdk'
import { WalletError } from '../../sdk/WalletError'
import { StorageAdminStats, StorageProvider } from '../StorageProvider'
import { Chain } from '../../sdk/types'
import { Services } from '../../services/Services'
import {
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
  TableUser
} from '../schema/tables'
import {
  AuthId,
  FindCertificateFieldsArgs,
  FindCertificatesArgs,
  FindCommissionsArgs,
  FindForUserSincePagedArgs,
  FindMonitorEventsArgs,
  FindOutputBasketsArgs,
  FindOutputsArgs,
  FindOutputTagMapsArgs,
  FindOutputTagsArgs,
  FindProvenTxReqsArgs,
  FindProvenTxsArgs,
  FindSyncStatesArgs,
  FindTransactionsArgs,
  FindTxLabelMapsArgs,
  FindTxLabelsArgs,
  FindUsersArgs,
  ProvenOrRawTx,
  PurgeParams,
  PurgeResults,
  StorageGetBeefOptions,
  TrxToken,
} from '../../sdk/WalletStorage.interfaces'
import {
  ValidListActionsArgs,
  ValidListOutputsArgs
} from '../../sdk/validationHelpers'

describe('getBeefForTransaction tests', () => {
  jest.setTimeout(99999999)

  test('0 ProtoStorage.getBeefForTxid', async () => {
    try {
      const ps = new ProtoStorage('main')
      const beef = await ps.getBeefForTxid('794f836052ad73732a550c38bea3697a722c6a1e54bcbe63735ba79e0d23f623')
      expect(beef.bumps.length > 0)
      {
        const beef = await ps.getBeefForTxid('53023657e79f446ca457040a0ab3b903000d7281a091397c7853f021726a560e')
        expect(beef.bumps.length > 0)
      }
    } catch (eu: unknown) {
      const e = WalletError.fromUnknown(eu)
      // If txids are not new, a throw will happen on attempt to look up header hash in chaintracks live headers.
      expect(e.message).toBe('Maximum BEEF depth exceeded. Limit is 2')
    }
  })
})

class ProtoStorage extends StorageProvider {
  gbo: StorageGetBeefOptions
  whatsOnChainApiKey?: string

  constructor(chain: Chain) {
    const o = StorageProvider.createStorageBaseOptions(chain)
    super(o)
    const so = Services.createDefaultOptions(chain)
    // so.whatsOnChainApiKey = 'my_api_key'
    const s = new Services(so)
    this.setServices(s)
    this.gbo = {
      ignoreNewProven: true,
      ignoreServices: false,
      ignoreStorage: true
    }
    this.maxRecursionDepth = 2
  }

  async getBeefForTxid(txid: string): Promise<Beef> {
    const beef = this.getBeefForTransaction(txid, this.gbo)
    return beef
  }

  nip = new Error('Method not implemented.')
  override reviewStatus(args: { agedLimit: Date; trx?: TrxToken }): Promise<{ log: string }> {
    throw this.nip
  }
  override purgeData(params: PurgeParams, trx?: TrxToken): Promise<PurgeResults> {
    throw this.nip
  }
  override allocateChangeInput(
    userId: number,
    basketId: number,
    targetSatoshis: number,
    exactSatoshis: number | undefined,
    excludeSending: boolean,
    transactionId: number
  ): Promise<TableOutput | undefined> {
    throw this.nip
  }
  override getProvenOrRawTx(txid: string, trx?: TrxToken): Promise<ProvenOrRawTx> {
    throw this.nip
  }
  override getRawTxOfKnownValidTransaction(
    txid?: string,
    offset?: number,
    length?: number,
    trx?: TrxToken
  ): Promise<number[] | undefined> {
    throw this.nip
  }
  override getLabelsForTransactionId(transactionId?: number, trx?: TrxToken): Promise<TableTxLabel[]> {
    throw this.nip
  }
  override getTagsForOutputId(outputId: number, trx?: TrxToken): Promise<TableOutputTag[]> {
    throw this.nip
  }
  override listActions(auth: AuthId, args: ValidListActionsArgs): Promise<ListActionsResult> {
    throw this.nip
  }
  override listOutputs(auth: AuthId, args: ValidListOutputsArgs): Promise<ListOutputsResult> {
    throw this.nip
  }
  override countChangeInputs(userId: number, basketId: number, excludeSending: boolean): Promise<number> {
    throw this.nip
  }
  override findCertificatesAuth(auth: AuthId, args: FindCertificatesArgs): Promise<TableCertificateX[]> {
    throw this.nip
  }
  override findOutputBasketsAuth(auth: AuthId, args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    throw this.nip
  }
  override findOutputsAuth(auth: AuthId, args: FindOutputsArgs): Promise<TableOutput[]> {
    throw this.nip
  }
  override insertCertificateAuth(auth: AuthId, certificate: TableCertificateX): Promise<number> {
    throw this.nip
  }
  override dropAllData(): Promise<void> {
    throw this.nip
  }
  override migrate(storageName: string, storageIdentityKey: string): Promise<string> {
    throw this.nip
  }
  override findOutputTagMaps(args: FindOutputTagMapsArgs): Promise<TableOutputTagMap[]> {
    throw this.nip
  }
  override findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]> {
    throw this.nip
  }
  override findProvenTxs(args: FindProvenTxsArgs): Promise<TableProvenTx[]> {
    throw this.nip
  }
  override findTxLabelMaps(args: FindTxLabelMapsArgs): Promise<TableTxLabelMap[]> {
    throw this.nip
  }
  override countOutputTagMaps(args: FindOutputTagMapsArgs): Promise<number> {
    throw this.nip
  }
  override countProvenTxReqs(args: FindProvenTxReqsArgs): Promise<number> {
    throw this.nip
  }
  override countProvenTxs(args: FindProvenTxsArgs): Promise<number> {
    throw this.nip
  }
  override countTxLabelMaps(args: FindTxLabelMapsArgs): Promise<number> {
    throw this.nip
  }
  override insertCertificate(certificate: TableCertificate, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertCertificateField(certificateField: TableCertificateField, trx?: TrxToken): Promise<void> {
    throw this.nip
  }
  override insertCommission(commission: TableCommission, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertMonitorEvent(event: TableMonitorEvent, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertOutput(output: TableOutput, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertOutputBasket(basket: TableOutputBasket, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertOutputTag(tag: TableOutputTag, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertOutputTagMap(tagMap: TableOutputTagMap, trx?: TrxToken): Promise<void> {
    throw this.nip
  }
  override insertProvenTx(tx: TableProvenTx, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertProvenTxReq(tx: TableProvenTxReq, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertSyncState(syncState: TableSyncState, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertTransaction(tx: TableTransaction, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertTxLabel(label: TableTxLabel, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override insertTxLabelMap(labelMap: TableTxLabelMap, trx?: TrxToken): Promise<void> {
    throw this.nip
  }
  override insertUser(user: TableUser, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateCertificate(id: number, update: Partial<TableCertificate>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateCertificateField(
    certificateId: number,
    fieldName: string,
    update: Partial<TableCertificateField>,
    trx?: TrxToken
  ): Promise<number> {
    throw this.nip
  }
  override updateCommission(id: number, update: Partial<TableCommission>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateOutput(id: number, update: Partial<TableOutput>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateOutputTagMap(
    outputId: number,
    tagId: number,
    update: Partial<TableOutputTagMap>,
    trx?: TrxToken
  ): Promise<number> {
    throw this.nip
  }
  override updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateProvenTxReq(
    id: number | number[],
    update: Partial<TableProvenTxReq>,
    trx?: TrxToken
  ): Promise<number> {
    throw this.nip
  }
  override updateSyncState(id: number, update: Partial<TableSyncState>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateTransaction(
    id: number | number[],
    update: Partial<TableTransaction>,
    trx?: TrxToken
  ): Promise<number> {
    throw this.nip
  }
  override updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override updateTxLabelMap(
    transactionId: number,
    txLabelId: number,
    update: Partial<TableTxLabelMap>,
    trx?: TrxToken
  ): Promise<number> {
    throw this.nip
  }
  override updateUser(id: number, update: Partial<TableUser>, trx?: TrxToken): Promise<number> {
    throw this.nip
  }
  override destroy(): Promise<void> {
    throw this.nip
  }
  override transaction<T>(scope: (trx: TrxToken) => Promise<T>, trx?: TrxToken): Promise<T> {
    throw this.nip
  }
  override readSettings(trx?: TrxToken): Promise<TableSettings> {
    throw this.nip
  }
  override findCertificateFields(args: FindCertificateFieldsArgs): Promise<TableCertificateField[]> {
    throw this.nip
  }
  override findCertificates(args: FindCertificatesArgs): Promise<TableCertificateX[]> {
    throw this.nip
  }
  override findCommissions(args: FindCommissionsArgs): Promise<TableCommission[]> {
    throw this.nip
  }
  override findMonitorEvents(args: FindMonitorEventsArgs): Promise<TableMonitorEvent[]> {
    throw this.nip
  }
  override findOutputBaskets(args: FindOutputBasketsArgs): Promise<TableOutputBasket[]> {
    throw this.nip
  }
  override findOutputs(args: FindOutputsArgs): Promise<TableOutput[]> {
    throw this.nip
  }
  override findOutputTags(args: FindOutputTagsArgs): Promise<TableOutputTag[]> {
    throw this.nip
  }
  override findSyncStates(args: FindSyncStatesArgs): Promise<TableSyncState[]> {
    throw this.nip
  }
  override findTransactions(args: FindTransactionsArgs): Promise<TableTransaction[]> {
    throw this.nip
  }
  override findTxLabels(args: FindTxLabelsArgs): Promise<TableTxLabel[]> {
    throw this.nip
  }
  override findUsers(args: FindUsersArgs): Promise<TableUser[]> {
    throw this.nip
  }
  override countCertificateFields(args: FindCertificateFieldsArgs): Promise<number> {
    throw this.nip
  }
  override countCertificates(args: FindCertificatesArgs): Promise<number> {
    throw this.nip
  }
  override countCommissions(args: FindCommissionsArgs): Promise<number> {
    throw this.nip
  }
  override countMonitorEvents(args: FindMonitorEventsArgs): Promise<number> {
    throw this.nip
  }
  override countOutputBaskets(args: FindOutputBasketsArgs): Promise<number> {
    throw this.nip
  }
  override countOutputs(args: FindOutputsArgs): Promise<number> {
    throw this.nip
  }
  override countOutputTags(args: FindOutputTagsArgs): Promise<number> {
    throw this.nip
  }
  override countSyncStates(args: FindSyncStatesArgs): Promise<number> {
    throw this.nip
  }
  override countTransactions(args: FindTransactionsArgs): Promise<number> {
    throw this.nip
  }
  override countTxLabels(args: FindTxLabelsArgs): Promise<number> {
    throw this.nip
  }
  override countUsers(args: FindUsersArgs): Promise<number> {
    throw this.nip
  }
  override getProvenTxsForUser(args: FindForUserSincePagedArgs): Promise<TableProvenTx[]> {
    throw this.nip
  }
  override getProvenTxReqsForUser(args: FindForUserSincePagedArgs): Promise<TableProvenTxReq[]> {
    throw this.nip
  }
  override getTxLabelMapsForUser(args: FindForUserSincePagedArgs): Promise<TableTxLabelMap[]> {
    throw this.nip
  }
  override getOutputTagMapsForUser(args: FindForUserSincePagedArgs): Promise<TableOutputTagMap[]> {
    throw this.nip
  }
  override adminStats(adminIdentityKey: string): Promise<StorageAdminStats> {
    throw this.nip
  }
}
