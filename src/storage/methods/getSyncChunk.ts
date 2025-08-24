import { StorageReader } from '../StorageReader'
import { TableProvenTx } from '../schema/tables/TableProvenTx'
import { TableProvenTxReq } from '../schema/tables/TableProvenTxReq'
import { TableCertificate } from '../schema/tables/TableCertificate'
import { TableCertificateField } from '../schema/tables/TableCertificateField'
import { TableOutputBasket } from '../schema/tables/TableOutputBasket'
import { TableTransaction } from '../schema/tables/TableTransaction'
import { TableOutput } from '../schema/tables/TableOutput'
import { TableOutputTag } from '../schema/tables/TableOutputTag'
import { TableOutputTagMap } from '../schema/tables/TableOutputTagMap'
import { TableTxLabel } from '../schema/tables/TableTxLabel'
import { TableTxLabelMap } from '../schema/tables/TableTxLabelMap'
import { TableCommission } from '../schema/tables/TableCommission'
import { FindForUserSincePagedArgs, RequestSyncChunkArgs, SyncChunk } from '../../sdk/WalletStorage.interfaces'
import { verifyTruthy } from '../../utility/utilityHelpers'
import { WERR_INVALID_OPERATION, WERR_INVALID_PARAMETER } from '../../sdk/WERR_errors'

/**
 * Gets the next sync chunk of updated data from un-remoted storage (could be using a remote DB connection).
 * @param storage
 * @param args
 * @returns
 */
export async function getSyncChunk(storage: StorageReader, args: RequestSyncChunkArgs): Promise<SyncChunk> {
  const r: SyncChunk = {
    fromStorageIdentityKey: args.fromStorageIdentityKey,
    toStorageIdentityKey: args.toStorageIdentityKey,
    userIdentityKey: args.identityKey
  }

  let itemCount = args.maxItems
  let roughSize = args.maxRoughSize
  let i = 0
  let done = false

  const user = verifyTruthy(await storage.findUserByIdentityKey(args.identityKey))
  if (!args.since || user.updated_at > new Date(args.since)) r.user = user

  const chunkers: ChunkerArgs[] = [
    {
      name: 'provenTx',
      maxDivider: 100,
      preAdd: () => {
        r.provenTxs = []
      },
      addItem: (i: TableProvenTx) => {
        r.provenTxs!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.getProvenTxsForUser(args)
      }
    },
    {
      name: 'outputBasket',
      maxDivider: 1,
      preAdd: () => {
        r.outputBaskets = []
      },
      addItem: (i: TableOutputBasket) => {
        r.outputBaskets!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findOutputBaskets({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'outputTag',
      maxDivider: 1,
      preAdd: () => {
        r.outputTags = []
      },
      addItem: (i: TableOutputTag) => {
        r.outputTags!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findOutputTags({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'txLabel',
      maxDivider: 1,
      preAdd: () => {
        r.txLabels = []
      },
      addItem: (i: TableTxLabel) => {
        r.txLabels!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findTxLabels({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'transaction',
      maxDivider: 25,
      preAdd: () => {
        r.transactions = []
      },
      addItem: (i: TableTransaction) => {
        r.transactions!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findTransactions({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'output',
      maxDivider: 25,
      preAdd: () => {
        r.outputs = []
      },
      addItem: (i: TableOutput) => {
        r.outputs!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findOutputs({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'txLabelMap',
      maxDivider: 1,
      preAdd: () => {
        r.txLabelMaps = []
      },
      addItem: (i: TableTxLabelMap) => {
        r.txLabelMaps!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.getTxLabelMapsForUser(args)
      }
    },
    {
      name: 'outputTagMap',
      maxDivider: 1,
      preAdd: () => {
        r.outputTagMaps = []
      },
      addItem: (i: TableOutputTagMap) => {
        r.outputTagMaps!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.getOutputTagMapsForUser(args)
      }
    },
    {
      name: 'certificate',
      maxDivider: 25,
      preAdd: () => {
        r.certificates = []
      },
      addItem: (i: TableCertificate) => {
        r.certificates!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findCertificates({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'certificateField',
      maxDivider: 25,
      preAdd: () => {
        r.certificateFields = []
      },
      addItem: (i: TableCertificateField) => {
        r.certificateFields!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findCertificateFields({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'commission',
      maxDivider: 25,
      preAdd: () => {
        r.commissions = []
      },
      addItem: (i: TableCommission) => {
        r.commissions!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.findCommissions({
          partial: { userId: args.userId },
          since: args.since,
          paged: args.paged
        })
      }
    },
    {
      name: 'provenTxReq',
      maxDivider: 100,
      preAdd: () => {
        r.provenTxReqs = []
      },
      addItem: (i: TableProvenTxReq) => {
        r.provenTxReqs!.push(i)
      },
      findItems: async (storage: StorageReader, args: FindForUserSincePagedArgs) => {
        return await storage.getProvenTxReqsForUser(args)
      }
    }
  ]

  const addItems = async (a: ChunkerArgs) => {
    if (i >= args.offsets.length) {
      done = true
      return
    }
    let { offset, name: oname } = args.offsets[i++]
    if (a.name !== oname)
      throw new WERR_INVALID_PARAMETER('offsets', `in dependency order. '${a.name}' expected, found ${oname}.`)
    let preAddCalled = false
    for (; !done; ) {
      const limit = Math.min(itemCount, Math.max(10, args.maxItems / a.maxDivider))
      if (limit <= 0) break
      const items = await a.findItems(storage, {
        userId: user.userId,
        since: args.since,
        paged: { limit, offset }
      })
      checkEntityValues(items)
      if (!preAddCalled) {
        a.preAdd()
        preAddCalled = true
      }
      if (items.length === 0) break
      for (const item of items) {
        offset++
        a.addItem(item)
        itemCount--
        roughSize -= JSON.stringify(item).length
        if (itemCount <= 0 || roughSize < 0) {
          done = true
          break
        }
      }
    }
  }

  for (; !done; ) {
    for (const c of chunkers) {
      await addItems(c)
    }
  }

  return r
}

type ChunkerArgs = {
  name: string
  maxDivider: number
  preAdd: () => void
  addItem: (i: any) => void
  findItems: (storage: StorageReader, args: FindForUserSincePagedArgs) => Promise<any[]>
}

function checkIsDate(v: any) {
  if (!(v instanceof Date)) throw new WERR_INVALID_OPERATION('bad date')
}

function checkEntityValues(es: object[]) {
  for (const e of es) {
    checkIsDate(e['created_at'])
    checkIsDate(e['updated_at'])
    for (const key of Object.keys(e)) if (e[key] === null) throw new WERR_INVALID_OPERATION()
  }
}
