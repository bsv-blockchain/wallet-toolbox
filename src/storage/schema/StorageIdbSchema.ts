import { Base64String, PubKeyHex, HexString } from '@bsv/sdk'
import { ProvenTxReqStatus, SyncStatus, TransactionStatus } from '../../sdk'
import {
  TableCertificate,
  TableCertificateField,
  TableCommission,
  TableMonitorEvent,
  TableOutput,
  TableOutputBasket,
  TableOutputTag,
  TableOutputTagMap,
  TableProvenTx,
  TableProvenTxReq,
  TableSyncState,
  TableSettings,
  TableTransaction,
  TableTxLabel,
  TableTxLabelMap,
  TableUser
} from '../index.client'

export interface StorageIdbSchema {
  certificates: {
    key: number
    value: TableCertificate
    indexes: {
      userId: number
      userId_type_certifier_serialNumber: [number, Base64String, PubKeyHex, Base64String]
    }
  }
  certificateFields: {
    key: number
    value: TableCertificateField
    indexes: {
      userId: number
      certificateId: number
    }
  }
  commissions: {
    key: number
    value: TableCommission
    indexes: {
      userId: number
      transactionId: number
    }
  }
  monitorEvents: {
    key: number
    value: TableMonitorEvent
  }
  outputs: {
    key: number
    value: TableOutput
    indexes: {
      userId: number
      transactionId: number
      basketId: number
      spentBy: string
      transactionId_vout_userId: [number, number, number]
    }
  }
  outputBaskets: {
    key: number
    value: TableOutputBasket
    indexes: {
      userId: number
      name_userId: [string, number]
    }
  }
  outputTags: {
    key: number
    value: TableOutputTag
    indexes: {
      userId: number
      tag_userId: [string, number]
    }
  }
  outputTagMaps: {
    key: number
    value: TableOutputTagMap
    indexes: {
      outputTagId: number
      outputId: number
    }
  }
  provenTxs: {
    key: number
    value: TableProvenTx
    indexes: {
      txid: HexString
    }
  }
  provenTxReqs: {
    key: number
    value: TableProvenTxReq
    indexes: {
      provenTxId: number
      txid: HexString
      status: ProvenTxReqStatus
      batch: string
    }
  }
  syncStates: {
    key: number
    value: TableSyncState
    indexes: {
      userId: number
      refNum: string
      status: SyncStatus
    }
  }
  settings: {
    key: number
    value: TableSettings
    indexes: Record<string, never>
  }
  transactions: {
    key: number
    value: TableTransaction
    indexes: {
      userId: number
      provenTxId: number
      reference: string
      status: TransactionStatus
    }
  }
  txLabels: {
    key: number
    value: TableTxLabel
    indexes: {
      userId: number
      label_userId: [string, number]
    }
  }
  txLabelMaps: {
    key: number
    value: TableTxLabelMap
    indexes: {
      transactionId: number
      txLabelId: number
    }
  }
  users: {
    key: number
    value: TableUser
    indexes: {
      identityKey: string
    }
  }
}
