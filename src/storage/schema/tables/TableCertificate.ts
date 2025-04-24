import { Base64String, HexString, OutpointString, PubKeyHex } from '@bsv/sdk'
import { sdk, TableCertificateField } from '../../../index.client'

export interface TableCertificate extends sdk.EntityTimeStamp {
  created_at: Date
  updated_at: Date
  certificateId: number
  userId: number
  type: Base64String
  serialNumber: Base64String
  certifier: PubKeyHex
  subject: PubKeyHex
  verifier?: PubKeyHex
  revocationOutpoint: OutpointString
  signature: HexString
  isDeleted: boolean
}

export interface TableCertificateX extends TableCertificate {
  fields?: TableCertificateField[]
}
