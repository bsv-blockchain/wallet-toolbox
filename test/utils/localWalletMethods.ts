import {
  Beef,
  CreateActionArgs,
  CreateActionOptions,
  CreateActionResult,
  OutpointString,
  P2PKH,
  PublicKey,
  Script,
  SignActionArgs,
  SignActionOptions,
  SignActionResult
} from '@bsv/sdk'
import {
  EntityProvenTxReq,
  ScriptTemplateBRC29,
  sdk,
  Services,
  Setup,
  StorageKnex,
  verifyOne,
  verifyTruthy,
  wait
} from '../../src'
import { _tu, logger, TestWalletNoSetup, TuEnv } from './TestUtilsWalletStorage'
import { validateCreateActionArgs, ValidCreateActionArgs } from '../../src/sdk'
import { setDisableDoubleSpendCheckForTest } from '../../src/storage/methods/createAction'

export interface LocalWalletTestOptions {
  setActiveClient: boolean
  useMySQLConnectionForClient: boolean
  useTestIdentityKey: boolean
  useIdentityKey2: boolean
}

export interface LocalTestWalletSetup extends TestWalletNoSetup {
  setActiveClient: boolean
  useMySQLConnectionForClient: boolean
  useTestIdentityKey: boolean
  useIdentityKey2: boolean
}

export async function createSetup(chain: sdk.Chain, options: LocalWalletTestOptions): Promise<LocalTestWalletSetup> {
  const env = _tu.getEnv(chain)
  let identityKey: string | undefined
  let filePath: string | undefined
  if (options.useTestIdentityKey) {
    identityKey = env.testIdentityKey
    filePath = env.testFilePath
  } else {
    if (options.useIdentityKey2) {
      identityKey = env.identityKey2
    } else {
      identityKey = env.identityKey
      filePath = env.filePath
    }
  }
  if (!identityKey) throw new sdk.WERR_INVALID_PARAMETER('identityKey', 'valid')
  if (!filePath) filePath = `./backup-${chain}-${identityKey}.sqlite`

  const setup = {
    ...options,
    ...(await _tu.createTestWallet({
      chain,
      rootKeyHex: env.devKeys[identityKey],
      filePath,
      setActiveClient: options.setActiveClient,
      addLocalBackup: false,
      useMySQLConnectionForClient: options.useMySQLConnectionForClient
    }))
  }

  console.log(`ACTIVE STORAGE: ${setup.storage.getActiveStoreName()}`)

  return setup
}

export async function burnOneSatTestOutput(
  setup: LocalTestWalletSetup,
  options: CreateActionOptions = {},
  howMany: number = 1
): Promise<void> {
  const outputs = await setup.wallet.listOutputs({
    basket: 'test-output',
    include: 'entire transactions',
    limit: 1000
  })

  while (howMany-- > 0) {
    const o = outputs.outputs.find(o => o.satoshis === 1)
    if (!o) break
    console.log(`burning ${o.outpoint}`)
    const inputBEEF = outputs.BEEF

    const p2pkh = new P2PKH()
    const args: CreateActionArgs = {
      inputBEEF,
      inputs: [
        {
          unlockingScriptLength: 108,
          outpoint: o.outpoint,
          inputDescription: 'burn 1 sat output'
        }
      ],
      description: 'burn output'
    }
    const bcar = await setup.wallet.createAction(args)
    expect(bcar.signableTransaction)

    const st = bcar.signableTransaction!
    const beef = Beef.fromBinary(st.tx)
    const tx = beef.findAtomicTransaction(beef.txs.slice(-1)[0].txid)!
    const unlock = p2pkh.unlock(setup.keyDeriver.rootKey, 'all', false)
    const unlockingScript = (await unlock.sign(tx, 0)).toHex()
    const signArgs: SignActionArgs = {
      reference: st.reference,
      spends: { 0: { unlockingScript } }
    }
    const sar = await setup.wallet.signAction(signArgs)
    console.log(sar.txid)
    expect(sar.txid)
  }
}

export async function createOneSatTestOutput(
  setup: LocalTestWalletSetup,
  options: CreateActionOptions = {},
  howMany: number = 1
): Promise<CreateActionResult> {
  if (howMany < 1) throw new sdk.WERR_INVALID_PARAMETER('howMany', 'at least 1')

  let car: CreateActionResult = {}

  let noSendChange: OutpointString[] | undefined = undefined
  let txids: string[] = []
  let vargs: ValidCreateActionArgs

  for (let i = 0; i < howMany; i++) {
    const args: CreateActionArgs = {
      outputs: [
        {
          lockingScript: new P2PKH().lock(PublicKey.fromString(setup.identityKey).toAddress()).toHex(),
          satoshis: 1,
          outputDescription: 'test output',
          customInstructions: JSON.stringify({
            type: 'P2PKH',
            key: 'identity'
          }),
          basket: 'test-output'
        }
      ],
      description: 'create test output',
      options: {
        ...options,
        noSendChange
      }
    }
    vargs = validateCreateActionArgs(args)
    car = await setup.wallet.createAction(args)
    expect(car.txid)
    txids.push(car.txid!)
    noSendChange = car.noSendChange

    const req = await EntityProvenTxReq.fromStorageTxid(setup.activeStorage, car.txid!)
    expect(req !== undefined && req.history.notes !== undefined)
    if (req && req.history.notes) {
      if (vargs.isNoSend) {
        expect(req.status === 'nosend').toBe(true)
        expect(req.history.notes.length).toBe(1)
        const n = req.history.notes[0]
        expect(n.what === 'status' && n.status_now === 'nosend').toBe(true)
      } else {
        expect(req.status === 'unsent').toBe(true)
        expect(req.history.notes.length).toBe(1)
        const n = req.history.notes[0]
        expect(n.what === 'status' && n.status_now === 'unsent').toBe(true)
      }
    }
  }

  if (vargs!.isNoSend) {
    // Create final sending transaction
    const args: CreateActionArgs = {
      description: 'send batch',
      options: {
        ...options,
        sendWith: txids
      }
    }
    vargs = validateCreateActionArgs(args)
    car = await setup.wallet.createAction(args)
  }

  return car
}

export async function recoverOneSatTestOutputs(setup: LocalTestWalletSetup, testOptionsMode?: 1): Promise<void> {
  const outputs = await setup.wallet.listOutputs({
    basket: 'test-output',
    include: 'entire transactions',
    limit: 1000
  })

  if (outputs.outputs.length > 0) {
    const args: CreateActionArgs = {
      inputBEEF: outputs.BEEF!,
      inputs: [],
      description: 'recover test output'
    }
    if (testOptionsMode === 1) {
      args.options = {
        acceptDelayedBroadcast: false
      }
    }
    const p2pkh = new P2PKH()
    for (const o of outputs.outputs) {
      args.inputs!.push({
        unlockingScriptLength: 108,
        outpoint: o.outpoint,
        inputDescription: 'recovered test output'
      })
    }
    const car = await setup.wallet.createAction(args)
    expect(car.signableTransaction)

    const st = car.signableTransaction!
    const beef = Beef.fromBinary(st.tx)
    const tx = beef.findAtomicTransaction(beef.txs.slice(-1)[0].txid)!
    const signArgs: SignActionArgs = {
      reference: st.reference,
      spends: {} //  0: { unlockingScript } },
    }
    for (let i = 0; i < outputs.outputs.length; i++) {
      const o = outputs.outputs[i]
      const unlock = p2pkh.unlock(setup.keyDeriver.rootKey, 'all', false)
      const unlockingScript = (await unlock.sign(tx, i)).toHex()
      signArgs.spends[i] = { unlockingScript }
    }
    const sar = await setup.wallet.signAction(signArgs)
    expect(sar.txid)
  }
}

export async function trackReqByTxid(setup: LocalTestWalletSetup, txid: string): Promise<void> {
  const req = await EntityProvenTxReq.fromStorageTxid(setup.activeStorage, txid)

  expect(req !== undefined && req.history.notes !== undefined)
  if (!req || !req.history.notes) throw new sdk.WERR_INTERNAL()

  let newBlocks = 0
  let lastHeight: number | undefined
  for (; req.status !== 'completed'; ) {
    let height = setup.monitor.lastNewHeader?.height
    if (req.status === 'unsent') {
      // send it...
    }
    if (req.status === 'sending') {
      // send it...
    }
    if (req.status === 'unmined') {
      if (height && lastHeight) {
        if (height === lastHeight) {
          await wait(1000 * 60)
        } else {
          newBlocks++
          expect(newBlocks < 5)
        }
      }
    }

    await setup.monitor.runOnce()
    await req.refreshFromStorage(setup.activeStorage)
    lastHeight = height
  }
}

/**
 * This method will normally throw an error on the initial createAction call due to the output being doublespent
 * @param setup
 * @param options
 * @returns
 */
export async function doubleSpendOldChange(
  setup: LocalTestWalletSetup,
  options: SignActionOptions
): Promise<SignActionResult> {
  const auth = await setup.wallet.storage.getAuth(true)
  if (!auth.userId || !setup.wallet.storage.getActive().isStorageProvider)
    throw new Error('active must be StorageProvider')
  const s = setup.wallet.storage.getActive() as StorageKnex

  const o = verifyOne(
    await s.findOutputs({ partial: { userId: auth.userId!, spendable: false, change: true }, paged: { limit: 1 } })
  )
  await s.validateOutputScript(o)
  const lockingScript = Script.fromBinary(o.lockingScript!)
  const otx = verifyTruthy(await s.findTransactionById(o.transactionId))
  if (otx.status !== 'completed') throw new Error('output must be from completed transaction')
  const inputBEEF = (await s.getBeefForTransaction(o.txid!, {})).toBinary()

  logger(`spending ${o.txid} vout ${o.vout}`)

  const sabppp = new ScriptTemplateBRC29({
    derivationPrefix: o.derivationPrefix,
    derivationSuffix: o.derivationSuffix,
    keyDeriver: setup.wallet.keyDeriver
  })
  const args: CreateActionArgs = {
    inputBEEF,
    inputs: [
      {
        unlockingScriptLength: 108,
        outpoint: `${o.txid!}.${o.vout}`,
        inputDescription: 'spent change output'
      }
    ],
    description: 'intentional doublespend',
    options
  }
  let car: CreateActionResult
  try {
    setDisableDoubleSpendCheckForTest(true)
    car = await setup.wallet.createAction(args)
  } finally {
    setDisableDoubleSpendCheckForTest(false)
  }
  expect(car.signableTransaction)

  const st = car.signableTransaction!
  const beef = Beef.fromBinary(st.tx)
  const tx = beef.findAtomicTransaction(beef.txs.slice(-1)[0].txid)!
  const unlock = sabppp.unlock(setup.rootKey.toHex(), setup.identityKey, o.satoshis, lockingScript)
  const unlockingScript = (await unlock.sign(tx, 0)).toHex()
  const signArgs: SignActionArgs = {
    reference: st.reference,
    spends: { '0': { unlockingScript } },
    options
  }
  const sar = await setup.wallet.signAction(signArgs)
  return sar
}

export async function createMainReviewSetup(): Promise<{
  env: TuEnv
  storage: StorageKnex
  services: Services
}> {
  const env = _tu.getEnv('main')
  const knex = Setup.createMySQLKnex(process.env.MAIN_CLOUD_MYSQL_CONNECTION!)
  const storage = new StorageKnex({
    chain: env.chain,
    knex: knex,
    commissionSatoshis: 0,
    commissionPubKeyHex: undefined,
    feeModel: { model: 'sat/kb', value: 1 }
  })
  const servicesOptions = Services.createDefaultOptions(env.chain)
  if (env.whatsonchainApiKey) servicesOptions.whatsOnChainApiKey = env.whatsonchainApiKey
  const services = new Services(servicesOptions)
  storage.setServices(services)
  await storage.makeAvailable()
  return { env, storage, services }
}
