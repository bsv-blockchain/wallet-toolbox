import { TableCertificate } from './schema/tables/TableCertificate'
import { TableCertificateField } from './schema/tables/TableCertificateField'
import { TableCommission } from './schema/tables/TableCommission'
import { TableMonitorEvent } from './schema/tables/TableMonitorEvent'
import { TableOutput } from './schema/tables/TableOutput'
import { TableOutputBasket } from './schema/tables/TableOutputBasket'
import { TableOutputTag } from './schema/tables/TableOutputTag'
import { TableOutputTagMap } from './schema/tables/TableOutputTagMap'
import { TableProvenTx } from './schema/tables/TableProvenTx'
import { TableProvenTxReq } from './schema/tables/TableProvenTxReq'
import { TableSyncState } from './schema/tables/TableSyncState'
import { TableTransaction } from './schema/tables/TableTransaction'
import { TableTxLabel } from './schema/tables/TableTxLabel'
import { TableTxLabelMap } from './schema/tables/TableTxLabelMap'
import { TableUser } from './schema/tables/TableUser'
import { randomBytesBase64, verifyOneOrNone, verifyId, verifyOne } from '../utility/utilityHelpers'
import { StorageReader, StorageReaderOptions } from './StorageReader'
import {
  AuthId,
  FindOutputTagMapsArgs,
  FindProvenTxReqsArgs,
  FindProvenTxsArgs,
  FindTxLabelMapsArgs,
  ProcessSyncChunkResult,
  RequestSyncChunkArgs,
  SyncChunk,
  TrxToken
} from '../sdk/WalletStorage.interfaces'
import { createSyncMap } from './schema/entities/EntityBase'

export abstract class StorageReaderWriter extends StorageReader {
  constructor(options: StorageReaderWriterOptions) {
    super(options)
  }

  abstract dropAllData(): Promise<void>
  abstract migrate(storageName: string, storageIdentityKey: string): Promise<string>

  abstract findOutputTagMaps(args: FindOutputTagMapsArgs): Promise<TableOutputTagMap[]>
  abstract findProvenTxReqs(args: FindProvenTxReqsArgs): Promise<TableProvenTxReq[]>
  abstract findProvenTxs(args: FindProvenTxsArgs): Promise<TableProvenTx[]>
  abstract findTxLabelMaps(args: FindTxLabelMapsArgs): Promise<TableTxLabelMap[]>

  abstract countOutputTagMaps(args: FindOutputTagMapsArgs): Promise<number>
  abstract countProvenTxReqs(args: FindProvenTxReqsArgs): Promise<number>
  abstract countProvenTxs(args: FindProvenTxsArgs): Promise<number>
  abstract countTxLabelMaps(args: FindTxLabelMapsArgs): Promise<number>

  abstract insertCertificate(certificate: TableCertificate, trx?: TrxToken): Promise<number>
  abstract insertCertificateField(certificateField: TableCertificateField, trx?: TrxToken): Promise<void>
  abstract insertCommission(commission: TableCommission, trx?: TrxToken): Promise<number>
  abstract insertMonitorEvent(event: TableMonitorEvent, trx?: TrxToken): Promise<number>
  abstract insertOutput(output: TableOutput, trx?: TrxToken): Promise<number>
  abstract insertOutputBasket(basket: TableOutputBasket, trx?: TrxToken): Promise<number>
  abstract insertOutputTag(tag: TableOutputTag, trx?: TrxToken): Promise<number>
  abstract insertOutputTagMap(tagMap: TableOutputTagMap, trx?: TrxToken): Promise<void>
  abstract insertProvenTx(tx: TableProvenTx, trx?: TrxToken): Promise<number>
  abstract insertProvenTxReq(tx: TableProvenTxReq, trx?: TrxToken): Promise<number>
  abstract insertSyncState(syncState: TableSyncState, trx?: TrxToken): Promise<number>
  abstract insertTransaction(tx: TableTransaction, trx?: TrxToken): Promise<number>
  abstract insertTxLabel(label: TableTxLabel, trx?: TrxToken): Promise<number>
  abstract insertTxLabelMap(labelMap: TableTxLabelMap, trx?: TrxToken): Promise<void>
  abstract insertUser(user: TableUser, trx?: TrxToken): Promise<number>

  abstract updateCertificate(id: number, update: Partial<TableCertificate>, trx?: TrxToken): Promise<number>
  abstract updateCertificateField(
    certificateId: number,
    fieldName: string,
    update: Partial<TableCertificateField>,
    trx?: TrxToken
  ): Promise<number>
  abstract updateCommission(id: number, update: Partial<TableCommission>, trx?: TrxToken): Promise<number>
  abstract updateMonitorEvent(id: number, update: Partial<TableMonitorEvent>, trx?: TrxToken): Promise<number>
  abstract updateOutput(id: number, update: Partial<TableOutput>, trx?: TrxToken): Promise<number>
  abstract updateOutputBasket(id: number, update: Partial<TableOutputBasket>, trx?: TrxToken): Promise<number>
  abstract updateOutputTag(id: number, update: Partial<TableOutputTag>, trx?: TrxToken): Promise<number>
  abstract updateOutputTagMap(
    outputId: number,
    tagId: number,
    update: Partial<TableOutputTagMap>,
    trx?: TrxToken
  ): Promise<number>
  abstract updateProvenTx(id: number, update: Partial<TableProvenTx>, trx?: TrxToken): Promise<number>
  abstract updateProvenTxReq(id: number | number[], update: Partial<TableProvenTxReq>, trx?: TrxToken): Promise<number>
  abstract updateSyncState(id: number, update: Partial<TableSyncState>, trx?: TrxToken): Promise<number>
  abstract updateTransaction(id: number | number[], update: Partial<TableTransaction>, trx?: TrxToken): Promise<number>
  abstract updateTxLabel(id: number, update: Partial<TableTxLabel>, trx?: TrxToken): Promise<number>
  abstract updateTxLabelMap(
    transactionId: number,
    txLabelId: number,
    update: Partial<TableTxLabelMap>,
    trx?: TrxToken
  ): Promise<number>
  abstract updateUser(id: number, update: Partial<TableUser>, trx?: TrxToken): Promise<number>

  async setActive(auth: AuthId, newActiveStorageIdentityKey: string): Promise<number> {
    return await this.updateUser(verifyId(auth.userId), {
      activeStorage: newActiveStorageIdentityKey
    })
  }

  async findCertificateById(id: number, trx?: TrxToken): Promise<TableCertificate | undefined> {
    return verifyOneOrNone(await this.findCertificates({ partial: { certificateId: id }, trx }))
  }
  async findCommissionById(id: number, trx?: TrxToken): Promise<TableCommission | undefined> {
    return verifyOneOrNone(await this.findCommissions({ partial: { commissionId: id }, trx }))
  }
  async findOutputById(id: number, trx?: TrxToken, noScript?: boolean): Promise<TableOutput | undefined> {
    return verifyOneOrNone(await this.findOutputs({ partial: { outputId: id }, noScript, trx }))
  }
  async findOutputBasketById(id: number, trx?: TrxToken): Promise<TableOutputBasket | undefined> {
    return verifyOneOrNone(await this.findOutputBaskets({ partial: { basketId: id }, trx }))
  }
  async findProvenTxById(id: number, trx?: TrxToken | undefined): Promise<TableProvenTx | undefined> {
    return verifyOneOrNone(await this.findProvenTxs({ partial: { provenTxId: id }, trx }))
  }
  async findProvenTxReqById(id: number, trx?: TrxToken | undefined): Promise<TableProvenTxReq | undefined> {
    return verifyOneOrNone(await this.findProvenTxReqs({ partial: { provenTxReqId: id }, trx }))
  }
  async findSyncStateById(id: number, trx?: TrxToken): Promise<TableSyncState | undefined> {
    return verifyOneOrNone(await this.findSyncStates({ partial: { syncStateId: id }, trx }))
  }
  async findTransactionById(id: number, trx?: TrxToken, noRawTx?: boolean): Promise<TableTransaction | undefined> {
    return verifyOneOrNone(
      await this.findTransactions({
        partial: { transactionId: id },
        noRawTx,
        trx
      })
    )
  }
  async findTxLabelById(id: number, trx?: TrxToken): Promise<TableTxLabel | undefined> {
    return verifyOneOrNone(await this.findTxLabels({ partial: { txLabelId: id }, trx }))
  }
  async findOutputTagById(id: number, trx?: TrxToken): Promise<TableOutputTag | undefined> {
    return verifyOneOrNone(await this.findOutputTags({ partial: { outputTagId: id }, trx }))
  }
  async findUserById(id: number, trx?: TrxToken): Promise<TableUser | undefined> {
    return verifyOneOrNone(await this.findUsers({ partial: { userId: id }, trx }))
  }

  async findOrInsertUser(identityKey: string, trx?: TrxToken): Promise<{ user: TableUser; isNew: boolean }> {
    let user: TableUser | undefined
    let isNew = false
    for (let retry = 0; ; retry++) {
      try {
        user = verifyOneOrNone(await this.findUsers({ partial: { identityKey }, trx }))
        //console.log(`findOrInsertUser oneOrNone: ${JSON.stringify(user || 'none').slice(0,512)}`)
        if (user) break
        const now = new Date()
        user = {
          created_at: now,
          updated_at: new Date('1971-01-01'), // Default constructed user, sync will override with any updated user.
          userId: 0,
          identityKey,
          activeStorage: this.getSettings().storageIdentityKey
        }
        user.userId = await this.insertUser(user, trx)
        isNew = true
        // Add default change basket for new user.
        await this.insertOutputBasket({
          created_at: now,
          updated_at: new Date('1971-01-01'), // Default constructed basket, sync will override with any updated basket.
          basketId: 0,
          userId: user.userId,
          name: 'default',
          numberOfDesiredUTXOs: 144,
          minimumDesiredUTXOValue: 32,
          isDeleted: false
        })
        break
      } catch (eu: unknown) {
        console.log(`findOrInsertUser catch: ${JSON.stringify(eu).slice(0, 512)}`)
        if (retry > 0) throw eu
      }
    }
    return { user, isNew }
  }

  async findOrInsertTransaction(
    newTx: TableTransaction,
    trx?: TrxToken
  ): Promise<{ tx: TableTransaction; isNew: boolean }> {
    let tx: TableTransaction | undefined
    let isNew = false
    for (let retry = 0; ; retry++) {
      try {
        tx = verifyOneOrNone(
          await this.findTransactions({
            partial: { userId: newTx.userId, txid: newTx.txid },
            trx
          })
        )
        if (tx) break
        newTx.transactionId = await this.insertTransaction(newTx, trx)
        isNew = true
        tx = newTx
        break
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
    return { tx, isNew }
  }

  async findOrInsertOutputBasket(userId: number, name: string, trx?: TrxToken): Promise<TableOutputBasket> {
    const partial = { name, userId }
    for (let retry = 0; ; retry++) {
      try {
        const now = new Date()
        let basket = verifyOneOrNone(await this.findOutputBaskets({ partial, trx }))
        if (!basket) {
          basket = {
            ...partial,
            minimumDesiredUTXOValue: 0,
            numberOfDesiredUTXOs: 0,
            basketId: 0,
            created_at: now,
            updated_at: now,
            isDeleted: false
          }
          basket.basketId = await this.insertOutputBasket(basket, trx)
        }
        if (basket.isDeleted) {
          await this.updateOutputBasket(verifyId(basket.basketId), {
            isDeleted: false
          })
        }
        return basket
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
  }

  async findOrInsertTxLabel(userId: number, label: string, trx?: TrxToken): Promise<TableTxLabel> {
    const partial = { label, userId }
    for (let retry = 0; ; retry++) {
      try {
        const now = new Date()
        let txLabel = verifyOneOrNone(await this.findTxLabels({ partial, trx }))
        if (!txLabel) {
          txLabel = {
            ...partial,
            txLabelId: 0,
            created_at: now,
            updated_at: now,
            isDeleted: false
          }
          txLabel.txLabelId = await this.insertTxLabel(txLabel, trx)
        }
        if (txLabel.isDeleted) {
          await this.updateTxLabel(verifyId(txLabel.txLabelId), {
            isDeleted: false
          })
        }
        return txLabel
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
  }

  async findOrInsertTxLabelMap(transactionId: number, txLabelId: number, trx?: TrxToken): Promise<TableTxLabelMap> {
    const partial = { transactionId, txLabelId }
    for (let retry = 0; ; retry++) {
      try {
        const now = new Date()
        let txLabelMap = verifyOneOrNone(await this.findTxLabelMaps({ partial, trx }))
        if (!txLabelMap) {
          txLabelMap = {
            ...partial,
            created_at: now,
            updated_at: now,
            isDeleted: false
          }
          await this.insertTxLabelMap(txLabelMap, trx)
        }
        if (txLabelMap.isDeleted) {
          await this.updateTxLabelMap(transactionId, txLabelId, {
            isDeleted: false
          })
        }
        return txLabelMap
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
  }

  async findOrInsertOutputTag(userId: number, tag: string, trx?: TrxToken): Promise<TableOutputTag> {
    const partial = { tag, userId }
    for (let retry = 0; ; retry++) {
      try {
        const now = new Date()
        let outputTag = verifyOneOrNone(await this.findOutputTags({ partial, trx }))
        if (!outputTag) {
          outputTag = {
            ...partial,
            outputTagId: 0,
            created_at: now,
            updated_at: now,
            isDeleted: false
          }
          outputTag.outputTagId = await this.insertOutputTag(outputTag, trx)
        }
        if (outputTag.isDeleted) {
          await this.updateOutputTag(verifyId(outputTag.outputTagId), {
            isDeleted: false
          })
        }
        return outputTag
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
  }

  async findOrInsertOutputTagMap(outputId: number, outputTagId: number, trx?: TrxToken): Promise<TableOutputTagMap> {
    const partial = { outputId, outputTagId }
    for (let retry = 0; ; retry++) {
      try {
        const now = new Date()
        let outputTagMap = verifyOneOrNone(await this.findOutputTagMaps({ partial, trx }))
        if (!outputTagMap) {
          outputTagMap = {
            ...partial,
            created_at: now,
            updated_at: now,
            isDeleted: false
          }
          await this.insertOutputTagMap(outputTagMap, trx)
        }
        if (outputTagMap.isDeleted) {
          await this.updateOutputTagMap(outputId, outputTagId, {
            isDeleted: false
          })
        }
        return outputTagMap
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
  }

  async findOrInsertSyncStateAuth(
    auth: AuthId,
    storageIdentityKey: string,
    storageName: string
  ): Promise<{ syncState: TableSyncState; isNew: boolean }> {
    const partial = { userId: auth.userId!, storageIdentityKey, storageName }
    for (let retry = 0; ; retry++) {
      try {
        const now = new Date()
        let syncState = verifyOneOrNone(await this.findSyncStates({ partial }))
        if (!syncState) {
          syncState = {
            ...partial,
            created_at: now,
            updated_at: now,
            syncStateId: 0,
            status: 'unknown',
            init: false,
            refNum: randomBytesBase64(12),
            syncMap: JSON.stringify(createSyncMap())
          }
          await this.insertSyncState(syncState)
          return { syncState, isNew: true }
        }
        return { syncState, isNew: false }
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
  }

  async findOrInsertProvenTxReq(
    newReq: TableProvenTxReq,
    trx?: TrxToken
  ): Promise<{ req: TableProvenTxReq; isNew: boolean }> {
    let req: TableProvenTxReq | undefined
    let isNew = false
    for (let retry = 0; ; retry++) {
      try {
        req = verifyOneOrNone(await this.findProvenTxReqs({ partial: { txid: newReq.txid }, trx }))
        if (req) break
        newReq.provenTxReqId = await this.insertProvenTxReq(newReq, trx)
        isNew = true
        req = newReq
        break
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
    return { req, isNew }
  }

  async findOrInsertProvenTx(
    newProven: TableProvenTx,
    trx?: TrxToken
  ): Promise<{ proven: TableProvenTx; isNew: boolean }> {
    let proven: TableProvenTx | undefined
    let isNew = false
    for (let retry = 0; ; retry++) {
      try {
        proven = verifyOneOrNone(await this.findProvenTxs({ partial: { txid: newProven.txid }, trx }))
        if (proven) break
        newProven.provenTxId = await this.insertProvenTx(newProven, trx)
        isNew = true
        proven = newProven
        break
      } catch (eu: unknown) {
        if (retry > 0) throw eu
      }
    }
    return { proven, isNew }
  }

  abstract processSyncChunk(args: RequestSyncChunkArgs, chunk: SyncChunk): Promise<ProcessSyncChunkResult>

  async tagOutput(partial: Partial<TableOutput>, tag: string, trx?: TrxToken): Promise<void> {
    await this.transaction(async trx => {
      const o = verifyOne(await this.findOutputs({ partial, noScript: true, trx }))
      const outputTag = await this.findOrInsertOutputTag(o.userId, tag, trx)
      await this.findOrInsertOutputTagMap(verifyId(o.outputId), verifyId(outputTag.outputTagId), trx)
    }, trx)
  }
}

export interface StorageReaderWriterOptions extends StorageReaderOptions {
  /** */
}
