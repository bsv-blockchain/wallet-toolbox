import {
  Beef,
  BigNumber,
  Hash,
  P2PKH,
  PublicKey,
  Signature,
  Transaction,
  TransactionSignature,
  UnlockingScript,
  Utils
} from '@bsv/sdk'
import { Setup, verifyInteger, verifyTruthy, Wallet } from '../../../src'
import { parseWalletOutpoint } from '../../../src/sdk'

describe('mountaintop tests', () => {
  jest.setTimeout(99999999)

  test('0 signature validity', async () => {
    // obtain the secrets environment for the testnet network.
    const env = Setup.getEnv('main')
    const setup = await Setup.createWalletClient({ env })

    const privKey = await setup.wallet.keyDeriver.derivePrivateKey([1, 'mountaintops'], '1', 'anyone')
    const a2 = privKey.toAddress()

    const { publicKey } = await setup.wallet.getPublicKey({
      protocolID: [1, 'mountaintops'],
      keyID: '1',
      counterparty: 'anyone',
      forSelf: true
    })
    const address = PublicKey.fromString(publicKey).toAddress()
    expect(address).toBe('1BSMQ1PxMbzMqjB47EYaSNBAD7Qme1dXuk')
    expect(a2).toBe(address)

    const msg = [
      111, 16, 29, 104, 166, 199, 108, 36, 242, 153, 242, 104, 10, 198, 151, 176, 170, 69, 98, 209, 88, 105, 113, 199,
      124, 56, 189, 3, 104, 214, 94, 76
    ]
    const msgHash = new BigNumber(msg, 16)
    const h1 = msgHash.toHex()
    const msgHash2 = new BigNumber(msg)
    const h2 = msgHash2.toHex()

    const beef = Beef.fromString(beef0, 'hex')
    const o = parseWalletOutpoint(outpoints[0])
    const tx = new Transaction()
    tx.addInput({
      sourceOutputIndex: o.vout,
      sourceTXID: o.txid,
      sourceTransaction: beef.findAtomicTransaction(o.txid)
    })

    const p2pkh = new P2PKH().unlock(privKey, 'all')
    tx.inputs[0].unlockingScript = await p2pkh.sign(tx, 0)
    const ok2 = await tx.verify('scripts only')
    expect(ok2).toBe(true)

    tx.inputs[0].unlockingScript = await sign(setup.wallet, tx, 0)
    const ok = await tx.verify('scripts only')
    expect(ok).toBe(true)
  })
})

const outpoints = [
  '30c83f8b84864fd4497414980faadf074192e7193602ef96ca18705876ce74b1.0',
  '797bd197f2328931231f2834c5dc8036fe9990981c368df27d3b55fa926863be.0',
  '08d47d844e81d751691f6b4a39ce378e9d0f70a3a0606c87995f0f28399552e2.0'
]
const beef0 =
  '0200beef01fe068d0d0008027a001b501758910c83d8e2c839cfc133245510f5ddbbd28202c331bb9feccc261c287b02b174ce76587018ca96ef023619e7924107dfaa0f98147449d44f86848b3fc830013c006174b69497f770d46604b177a98ff8b8a693a5cec19cd145b3b32abab71676f8011f001f86947779e8e749fd439f037d93733c2ea0734a17cdf1c32f87278b80c7ff72010e00161e280d8481978b9d2696c58d634beda36265ceef9faaa351566afc2c8ab2f0010600e250ce168ac74d432a14df5669f337cd44a8c2cfc8709b955174dd57e2354399010200fd976461d8c0ed097e32ae79afefb35e89daa7289daf7b01bde8bb1481762f590100005fb474d7ddaf5a299509a165cabfe0b6dbea56ed56d1f0d3acf1d3d89531a21e01010029f89d48414f66b9bfd8d711f51d6db0a712cfff2d641f66f83dd2e5e452e5c601010001000000014289ced528197deb6980d634200d333d9983c45ef46893affd027914fdc02cf7000000006a473044022019e70e4325f95b3d5f9f0569123b23c6bff7ef4197fcb15fa50ac3537b8546de0220100d181429245e0349903a0784ad61bfa022d864fca8ce6ba13b0de99fd39eb641210327c7cb8afcd1adce5b26055d70cad9fb1045976a6f99b2ee61ed36295d5802a7ffffffff020a000000000000001976a914727caee3e1178da2ca0b48786171f23695a4ccd088ac1d000000000000001976a9148419faaf7a5e97dcc62002e2415cb51bdb91937e88ac00000000'

async function sign(client: Wallet, tx: Transaction, inputIndex: number): Promise<UnlockingScript> {
  let signatureScope = TransactionSignature.SIGHASH_FORKID
  signatureScope |= TransactionSignature.SIGHASH_ALL
  const input = tx.inputs[inputIndex]
  const otherInputs = tx.inputs.filter((_, index) => index !== inputIndex)
  const sourceTXID = input.sourceTXID ?? input.sourceTransaction?.id('hex')
  if (sourceTXID == null || sourceTXID === undefined) {
    throw new Error('The input sourceTXID or sourceTransaction is required for transaction signing.')
  }
  if (sourceTXID === '') {
    throw new Error('The input sourceTXID or sourceTransaction is required for transaction signing.')
  }
  const sourceSatoshis = input.sourceTransaction?.outputs[input.sourceOutputIndex].satoshis
  if (sourceSatoshis == null || sourceSatoshis === undefined) {
    throw new Error('The sourceSatoshis or input sourceTransaction is required for transaction signing.')
  }
  const lockingScript = input.sourceTransaction?.outputs[input.sourceOutputIndex].lockingScript
  if (lockingScript == null) {
    throw new Error('The lockingScript or input sourceTransaction is required for transaction signing.')
  }

  const preimage = TransactionSignature.format({
    sourceTXID,
    sourceOutputIndex: verifyInteger(input.sourceOutputIndex),
    sourceSatoshis,
    transactionVersion: tx.version,
    otherInputs,
    inputIndex,
    outputs: tx.outputs,
    inputSequence: verifyTruthy(input.sequence),
    subscript: lockingScript,
    lockTime: tx.lockTime,
    scope: signatureScope
  })

  const { signature } = await client.createSignature({
    hashToDirectlySign: Hash.sha256(Hash.sha256(preimage)),
    protocolID: [1, 'mountaintops'],
    keyID: '1',
    counterparty: 'anyone'
  })
  const rawSignature = Signature.fromDER(signature)
  const sig = new TransactionSignature(rawSignature.r, rawSignature.s, signatureScope)
  const sigForScript = sig.toChecksigFormat()
  const { publicKey } = await client.getPublicKey({
    protocolID: [1, 'mountaintops'],
    keyID: '1',
    counterparty: 'anyone',
    forSelf: true
  })
  const pubkeyForScript = Utils.toArray(publicKey, 'hex')
  return new UnlockingScript([
    { op: sigForScript.length, data: sigForScript },
    { op: pubkeyForScript.length, data: pubkeyForScript }
  ])
}
