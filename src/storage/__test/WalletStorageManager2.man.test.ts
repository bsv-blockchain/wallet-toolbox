//mport * as bsv from '@bsv/sdk'
import { TableTransaction, wait, WalletStorageManager } from '../..'
import {
  _tu,
  TestWalletNoSetup
} from '../../../test/utils/TestUtilsWalletStorage'

import * as dotenv from 'dotenv'
import { StorageProcessActionArgs } from '../../sdk'
import { createHash } from 'crypto'
import {
  Beef,
  CreateActionArgs,
  CreateActionResult,
  ListActionsArgs
} from '@bsv/sdk'

dotenv.config()
describe('WalletStorageManager tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('test')
  const ctxs: TestWalletNoSetup[] = []

  beforeAll(async () => {
    if (env.runMySQL)
      ctxs.push(
        await _tu.createLegacyWalletMySQLCopy('walletStorageManagerTestSource')
      )
    ctxs.push(
      await _tu.createLegacyWalletSQLiteCopy('walletStorageManagerTestSource')
    )
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.wallet.destroy()
    }
  })

  test('TODOTONE Throw error if rawTx is provided but is not a valid signed transaction with legacy DB', async () => {
    for (const { identityKey, wallet, activeStorage: storage } of ctxs) {
      const userId = 1
      const satoshis = 10
      const fundingLabel = 'funding'
      const fundingArgs: CreateActionArgs = {
        outputs: [
          {
            satoshis,
            lockingScript: '76a914abcdef0123456789abcdef0123456789abcdef88ac',
            outputDescription: 'Funding output'
          }
        ],
        labels: [fundingLabel],
        description: 'Funding transaction',
        options: { noSend: true, randomizeOutputs: false }
      }
      const fundingResult: CreateActionResult =
        await wallet.createAction(fundingArgs)
      expect(fundingResult.tx).toBeDefined()
      const fundingTxid = fundingResult.txid!
      console.log('fundingTxid:', fundingTxid)
      const listActionArgs: ListActionsArgs = {
        labels: [fundingLabel],
        includeOutputs: true
      }
      const ra = await wallet.listActions(listActionArgs)
      let fundingVout = 0
      if (ra.totalActions > 0) {
        const fundingVout = ra.actions[0].outputs!.findIndex(
          output => output.satoshis === satoshis
        )
        console.log('fundingVout:', fundingVout)
        if (fundingVout === -1) {
          throw new Error('Funding vout not found in transaction outputs')
        }
      }
      const fundingTxidLE = Buffer.from(fundingTxid, 'hex')
        .reverse()
        .toString('hex')
      const fundingVoutLE = fundingVout.toString(16).padStart(8, '0')
      const rawTxHex =
        //`0100000002${fundingTxidLE}${fundingVoutLE}0847304402207F2E9AFFFFFFFFEE4C2AF2D7A3E9A02F4E76FD112EEBCB7CBAF525BA3BB017817FE1D5C73936C5010000006B483045022100F885B21B5881E92F9E5291F407ADC52013B7127A2735D199258748D577E0BF15022027C0BF4B581C44F78A45B6A209C1E11E0753B7F8AE3DA5BAD5F4252E85E6F8EF4121030E4A23DE82977C42A03158D1E35B9EC23097EA8064E445D6EF7FBC516121FC7FFFFFFFFF02D1070000000000001976A914A7082E91EACA1D88D5D006CD95C3A9F5A0B6DE4988AC1A00000000000000FD0B032097DFD76851BF465E8F715593B217714858BBE9570FF3BD5E33840A34E20FF0262102BA79DF5F8AE7604A9830F03C7933028186AEDE0675A16F025DC4F8BE8EEC0382201008CE7480DA41702918D1EC8E6849BA32B4D65B1E40DC669C31A1E6306B266C0000000000143F26402F388FB0DAAA556B3522E8906153B0A269011A073136363233363878040065CD1D9F695279587A75577A577A577A577A577A577A577A78577A75567A567A567A567A567A567A76567A757171557A6D75587901C2785A795A79210AC407F0E4BD44BFC207355A778B046225A7068FC59EE7EDA43AD905AADBFFC800206C266B30E6A1319C66DC401E5BD6B432BA49688EECD118297041DA8074CE08105C7956795679AA7676517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E01007E817757795679567956795679537956795479577995939521414136D08C5ED2BF3BA048AFE6DCAEBAFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF006E6E9776009F636E936776687777777B757C6E5296A0636E7C947B757C6853798277527982775379012080517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E01205279947F77545379935279930130787E527E54797E58797E527E53797E52797E57797E6B6D6D6D6D6D6D6C765779AC6B6D6D6D6D6D6C77695879767682776E54947F757858947F7777777601007E8177777B757C5879767682776E0128947F7578012C947F7777777601007E8177777778040065CD1D9F697605FEFFFFFF009D785479A2695979A95579885A795A79AC6B6D6D6D6D6D6C7700000000`
        //`010000000238F4F99B993161A3003665D6BD1C6DCD4CC932DCAF44E1817C2D7AE6A4338348000000000847304402207F2E9AFFFFFFFFEE4C2AF2D7A3E9A02F4E76FD112EEBCB7CBAF525BA3BB017817FE1D5C73936C5010000006B483045022100F885B21B5881E92F9E5291F407ADC52013B7127A2735D199258748D577E0BF15022027C0BF4B581C44F78A45B6A209C1E11E0753B7F8AE3DA5BAD5F4252E85E6F8EF4121030E4A23DE82977C42A03158D1E35B9EC23097EA8064E445D6EF7FBC516121FC7FFFFFFFFF02D1070000000000001976A914A7082E91EACA1D88D5D006CD95C3A9F5A0B6DE4988AC1A00000000000000FD0B032097DFD76851BF465E8F715593B217714858BBE9570FF3BD5E33840A34E20FF0262102BA79DF5F8AE7604A9830F03C7933028186AEDE0675A16F025DC4F8BE8EEC0382201008CE7480DA41702918D1EC8E6849BA32B4D65B1E40DC669C31A1E6306B266C0000000000143F26402F388FB0DAAA556B3522E8906153B0A269011A073136363233363878040065CD1D9F695279587A75577A577A577A577A577A577A577A78577A75567A567A567A567A567A567A76567A757171557A6D75587901C2785A795A79210AC407F0E4BD44BFC207355A778B046225A7068FC59EE7EDA43AD905AADBFFC800206C266B30E6A1319C66DC401E5BD6B432BA49688EECD118297041DA8074CE08105C7956795679AA7676517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E01007E817757795679567956795679537956795479577995939521414136D08C5ED2BF3BA048AFE6DCAEBAFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF006E6E9776009F636E936776687777777B757C6E5296A0636E7C947B757C6853798277527982775379012080517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F517F7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E7C7E01205279947F77545379935279930130787E527E54797E58797E527E53797E52797E57797E6B6D6D6D6D6D6D6C765779AC6B6D6D6D6D6D6C77695879767682776E54947F757858947F7777777601007E8177777B757C5879767682776E0128947F7578012C947F7777777601007E8177777778040065CD1D9F697605FEFFFFFF009D785479A2695979A95579885A795A79AC6B6D6D6D6D6D6C7700000000`
        //`0100000001${fundingTxidLE}${fundingVoutLE}00FFFFFFFF01E7030000000000001976A914AD26AF50BF79A79437AB1D4FE1983C4BA356EDCE88AC00000000`
        //`0100000001714E0FD050382B72818B2BF9E5E7EDBCE9A168B58D80D2A25B54EACE6B57ED520000000000FFFFFFFF01E7030000000000001976A914AD26AF50BF79A79437AB1D4FE1983C4BA356EDCE88AC00000000`
        `0100000001${fundingTxidLE}${fundingVoutLE}00FFFFFFFF01E7030000000000001976A9146F7E1838868BCD8E4BE20B5E0364CA479C88D92A88AC00000000`
      //'0100000001714E0FD050382B72818B2BF9E5E7EDBCE9A168B58D80D2A25B54EACE6B57ED520000000000FFFFFFFF01E7030000000000001976A9146F7E1838868BCD8E4BE20B5E0364CA479C88D92A88AC00000000'
      console.log('rawTxHex:', rawTxHex)
      let txid = ''
      try {
        txid = getTxid(rawTxHex)
        console.log('txid:', txid)
        const vout = getVout(rawTxHex)
        console.log('vout:', vout)
      } catch (error) {
        console.error((error as Error).message)
      }
      const rawTx = Array.from(Buffer.from(rawTxHex, 'hex'))
      const beef = fundingResult.tx!
      console.log(`inputBEEF: ${Beef.fromBinary(beef).toLogString()}`)
      const reference = 'abNIGLF0qg=='
      console.log('Reference:', reference)
      const newTx: TableTransaction = {
        userId,
        txid,
        rawTx,
        reference,
        transactionId: 0,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'unprocessed',
        isOutgoing: true,
        satoshis,
        description: 'Transaction to test processAction',
        inputBEEF: beef
      }
      const rt = await storage.findOrInsertTransaction(newTx)
      //console.log('Stored Transaction:', rt)
      const args: StorageProcessActionArgs = {
        txid,
        reference,
        isNewTx: true,
        isSendWith: false,
        isNoSend: false,
        isDelayed: false,
        rawTx,
        sendWith: [],
        log: ''
      }
      const manager = new WalletStorageManager(identityKey, storage)
      await expect(manager.processAction(args)).rejects.toThrowError(
        'Raw transaction is not valid'
      )
    }
  })
})

/**
 * Computes the transaction ID (TXID) from a raw hex string.
 * @param hex - The raw transaction hex string.
 * @returns The computed TXID.
 * @throws Error if the hex string is invalid or computation fails.
 */
const getTxid = (hex: string): string => {
  if (!hex || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('Invalid hex string')
  }
  try {
    const buffer = Buffer.from(hex, 'hex')
    const hash1 = createHash('sha256').update(buffer).digest()
    const hash2 = createHash('sha256').update(hash1).digest()
    return hash2.reverse().toString('hex')
  } catch (error) {
    throw new Error(`Failed to compute TXID: ${(error as Error).message}`)
  }
}

/**
 * Extracts the vout (output index) from a raw transaction hex string.
 * @param rawTxHex - The raw transaction hex string.
 * @returns The extracted vout index.
 * @throws Error if the hex string is invalid or extraction fails.
 */
const getVout = (rawTxHex: string): number => {
  if (!rawTxHex || !/^[0-9a-fA-F]+$/.test(rawTxHex)) {
    throw new Error('Invalid hex string')
  }
  try {
    const buffer = Buffer.from(rawTxHex, 'hex')
    if (buffer.length < 5) {
      throw new Error('Transaction too short')
    }
    let offset = 4
    const inputCount = readVarInt(buffer, offset)
    offset += inputCount.size

    if (inputCount.value < 1 || offset + 36 > buffer.length) {
      throw new Error('Invalid or insufficient input data')
    }
    offset += 32
    const vout = buffer.readUInt32LE(offset)
    return vout
  } catch (error) {
    throw new Error(`Failed to extract vout: ${(error as Error).message}`)
  }
}

/**
 * Reads a variable-length integer (varint) from a buffer at the specified offset.
 *
 * Bitcoin transactions use varints to encode values efficiently. The first byte
 * determines the length of the integer:
 * - If the first byte is less than `0xfd`, it represents the value directly (1 byte).
 * - If the first byte is `0xfd`, the next 2 bytes represent the value (3 bytes total).
 * - If the first byte is `0xfe`, the next 4 bytes represent the value (5 bytes total).
 * - If the first byte is `0xff`, the next 8 bytes represent the value (9 bytes total).
 *
 * @param buffer - The buffer containing the encoded varint.
 * @param offset - The offset in the buffer where the varint starts.
 * @returns An object containing:
 *  - `value`: The decoded integer value.
 *  - `size`: The number of bytes used to encode the varint.
 * @throws Will throw an error if the buffer does not contain enough bytes for decoding.
 */
const readVarInt = (
  buffer: Buffer,
  offset: number
): { value: number; size: number } => {
  const firstByte = buffer[offset]
  if (firstByte < 0xfd) {
    return { value: firstByte, size: 1 }
  } else if (firstByte === 0xfd) {
    return { value: buffer.readUInt16LE(offset + 1), size: 3 }
  } else if (firstByte === 0xfe) {
    return { value: buffer.readUInt32LE(offset + 1), size: 5 }
  } else {
    return { value: Number(buffer.readBigUInt64LE(offset + 1)), size: 9 }
  }
}
