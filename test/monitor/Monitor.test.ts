import { MerklePath } from '@bsv/sdk'
import { asArray, EntityProvenTxReq, sdk, verifyOne, verifyTruthy, wait } from '../../src/index.client'
import { TaskCheckForProofs } from '../../src/monitor/tasks/TaskCheckForProofs'
import { TaskClock } from '../../src/monitor/tasks/TaskClock'
import { TaskNewHeader } from '../../src/monitor/tasks/TaskNewHeader'
import { TaskPurge } from '../../src/monitor/tasks/TaskPurge'
import { TaskSendWaiting } from '../../src/monitor/tasks/TaskSendWaiting'
import { _tu, TestSetup1Wallet, TestWallet } from '../utils/TestUtilsWalletStorage'
import exp from 'constants'
import { TaskReviewStatus } from '../../src/monitor/tasks/TaskReviewStatus'

describe('Monitor tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('test')
  const ctxs: TestSetup1Wallet[] = []

  beforeAll(async () => {
    ctxs.push(
      await _tu.createSQLiteTestSetup1Wallet({
        databaseName: 'walletMonitorMain',
        chain: 'main',
        rootKeyHex: '3'.repeat(64)
      })
    )
    //ctxs.push(await _tu.createSQLiteTestSetup1Wallet({ databaseName: 'walletMonitorTest', chain: 'test', rootKeyHex: '3'.repeat(64)}))
  })

  afterAll(async () => {
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('0 TaskClock', async () => {
    if (!env.runSlowTests) return

    // This test takes a bit over a minute to run... un-skip it to work on it.
    for (const { chain, wallet, services, monitor } of ctxs) {
      if (!monitor) throw new sdk.WERR_INTERNAL('test requires setup with monitor')

      {
        // The clock attempts to update nextMinute to msecs for each minute.
        // Starting the clock and waiting a bit over a minute should see the value
        // increase by one minute's worth of msecs.
        const task = new TaskClock(monitor)
        monitor._tasks.push(task)
        const msecsFirst = task.nextMinute
        const startTasksPromise = monitor.startTasks()
        await wait(monitor.oneMinute * 1.1)
        const msecsNext = task.nextMinute
        monitor.stopTasks()
        const elapsed = (msecsNext - msecsFirst) / monitor.oneMinute
        expect(elapsed === 1 || elapsed === 2).toBe(true)
        await startTasksPromise
      }
    }
  })

  test('1 TaskNewHeader', async () => {
    if (!env.runSlowTests) return

    // This test takes 10+ seconds to run... un-skip it to work on it.
    for (const { chain, wallet, services, monitor } of ctxs) {
      if (!monitor) throw new sdk.WERR_INTERNAL('test requires setup with monitor')

      {
        // The new header task polls chaintracks for latest header and if new sets flag to check for proofs.
        // Starting the clock and waiting a bit should cause first header to be fetched and flag to be set.
        const task = new TaskNewHeader(monitor)
        monitor._tasks.push(task)
        expect(TaskCheckForProofs.checkNow).toBe(false)
        const startTasksPromise = monitor.startTasks()
        await wait(monitor.oneSecond * 10)
        expect(task.header).toBeTruthy()
        expect(TaskCheckForProofs.checkNow).toBe(true)
        monitor.stopTasks()
        await startTasksPromise
      }
    }
  })

  test.skip('2 TaskPurge', async () => {
    /*
        ** The following code is to test against un-purged data copied from staging-dojo:
        const ctxs: TestWallet<{}>[] = []
        const env = _tu.getEnv('test')
        const identityKeyTone = '03ac2d10bdb0023f4145cc2eba2fcd2ad3070cb2107b0b48170c46a9440e4cc3fe'
        const rootKeyHex = env.devKeys[identityKeyTone]
        ctxs.push(await _tu.createMySQLTestWallet({ databaseName: 'stagingdojotone', chain: 'test', rootKeyHex, dropAll: false }))
        */

    for (const { chain, wallet, services, monitor } of ctxs) {
      if (!monitor) throw new sdk.WERR_INTERNAL('test requires setup with monitor')

      {
        const task = new TaskPurge(monitor, {
          purgeCompleted: true,
          purgeFailed: true,
          purgeSpent: true,
          purgeCompletedAge: 1,
          purgeFailedAge: 1,
          purgeSpentAge: 1
        })
        TaskPurge.checkNow = true
        monitor._tasks.push(task)
        await monitor.runTask('Purge')
      }
    }
    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('3 TaskSendWaiting success', async () => {
    await runMockedSendWaiting('success', 'monitorTest3')
  })

  test.skip('4 TaskSendWaiting error', async () => {
    await runMockedSendWaiting('error', 'monitorTest4')
  })

  test('5 TaskCheckForProofs success', async () => {
    const ctxs: TestWallet<{}>[] = []
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy('monitorTest5'))
    let txidsPosted: string[] = []
    let mockResultIndex = 0

    const expectedTxids = [
      'c099c52277426abb863dc902d0389b008ddf2301d6b40ac718746ac16ca59136',
      '6935ce33b9e3b9ee60360ce0606aa0a0970b4840203f457b5559212676dc33ab',
      '67ca2475886b3fc2edd76a2eb8c32bd0bc308176c7dff463e0507942aeebcbec',
      '3fa94b62a3b10d8c18bada527a9b68c4e70db67140719df16c44fb0328782532',
      '519675259eff036c6597e4a497d37c132e718171dde4ea2257e84c947ecf656b'
    ]

    _tu.mockMerklePathServicesAsCallback(ctxs, async txid => {
      expect(expectedTxids).toContain(txid)
      const r = mockGetMerklePathResults[mockResultIndex++]
      return r
    })

    for (const { activeStorage: storage, monitor } of ctxs) {
      if (!monitor) throw new sdk.WERR_INTERNAL('test requires setup with monitor')

      monitor.lastNewHeader = {
        height: 999999999,
        hash: '',
        time: 0,
        version: 0,
        previousHash: '',
        merkleRoot: '',
        bits: 0,
        nonce: 0
      }

      {
        for (const txid of expectedTxids) {
          // no matching ProvenTx exists.
          expect((await storage.findProvenTxs({ partial: { txid } })).length).toBe(0)
          const req = verifyTruthy(await EntityProvenTxReq.fromStorageTxid(storage, txid))
          expect(req.status).toBe('unmined')
        }

        const task = new TaskCheckForProofs(monitor, 1)
        monitor._tasks.push(task)

        await monitor.runTask('CheckForProofs')

        for (const txid of expectedTxids) {
          const proven = verifyOne(await storage.findProvenTxs({ partial: { txid } }))
          expect(proven.merklePath).toBeTruthy()
          const req = verifyTruthy(await EntityProvenTxReq.fromStorageTxid(storage, txid))
          expect(req.status).toBe('completed')
          expect(req.provenTxId).toBe(proven.provenTxId)
        }
      }
    }

    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  test('6 TaskCheckForProofs fail', async () => {
    const ctxs: TestWallet<{}>[] = []
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy('monitorTest6'))
    let txidsPosted: string[] = []
    let mockResultIndex = 0

    const expectedTxids = [
      'c099c52277426abb863dc902d0389b008ddf2301d6b40ac718746ac16ca59136',
      '6935ce33b9e3b9ee60360ce0606aa0a0970b4840203f457b5559212676dc33ab',
      '67ca2475886b3fc2edd76a2eb8c32bd0bc308176c7dff463e0507942aeebcbec',
      '3fa94b62a3b10d8c18bada527a9b68c4e70db67140719df16c44fb0328782532',
      '519675259eff036c6597e4a497d37c132e718171dde4ea2257e84c947ecf656b'
    ]

    _tu.mockMerklePathServicesAsCallback(ctxs, async txid => {
      expect(expectedTxids).toContain(txid)
      const r = {}
      return r
    })

    for (const { activeStorage: storage, monitor } of ctxs) {
      if (!monitor) throw new sdk.WERR_INTERNAL('test requires setup with monitor')

      {
        const attempts: number[] = []

        for (const txid of expectedTxids) {
          // no matching ProvenTx exists.
          expect((await storage.findProvenTxs({ partial: { txid } })).length).toBe(0)
          const req = verifyTruthy(await EntityProvenTxReq.fromStorageTxid(storage, txid))
          expect(req.status).toBe('unmined')
          attempts.push(req.attempts)
        }

        const task = new TaskCheckForProofs(monitor, 1)
        monitor._tasks.push(task)

        await monitor.runTask('CheckForProofs')

        let i = -1
        for (const txid of expectedTxids) {
          i++
          // no matching ProvenTx exists.
          expect((await storage.findProvenTxs({ partial: { txid } })).length).toBe(0)
          const req = verifyTruthy(await EntityProvenTxReq.fromStorageTxid(storage, txid))
          expect(req.status).toBe('unmined')
          expect(req.attempts).toBeGreaterThanOrEqual(attempts[i])
        }
      }
    }

    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })

  const mockGetMerklePathResults: sdk.GetMerklePathResult[] = [
    {
      name: 'WoCTsc',
      merklePath: new MerklePath(1652142, [
        [
          {
            offset: 2,
            hash: '74c55a15a08ea491e02c41a6934c4177666c0dbda2781d0cf9743d3ad68a4623'
          },
          {
            offset: 3,
            hash: 'c099c52277426abb863dc902d0389b008ddf2301d6b40ac718746ac16ca59136',
            txid: true
          }
        ],
        [
          {
            offset: 0,
            hash: '2574544a253c91e69c7d5b4478af95d39420ad2c8e44c78b280f1bd5e7a11849'
          }
        ],
        [
          {
            offset: 1,
            hash: '8903289601da1910820c3471d41ae9187a7d46d6e39e636840b176519bdc5d00'
          }
        ]
      ]),
      header: {
        version: 536870912,
        previousHash: '0000000039f1c7dc943d50883e531022825bf5c15a40db2cedde7d203ca3d644',
        merkleRoot: '68bde58600fbd2c716871356cc2ad34b43ac67ac8d7a879dd966429d5a6935b2',
        time: 1734530373,
        bits: 474103450,
        nonce: 3894752803,
        height: 1652142,
        hash: '000000000d9419a409f83f16e2c162b4e44266986d6b9ee02d1b97d9556d9a3a'
      }
    },
    {
      name: 'WoCTsc',
      merklePath: new MerklePath(1652142, [
        [
          {
            offset: 4,
            hash: '6935ce33b9e3b9ee60360ce0606aa0a0970b4840203f457b5559212676dc33ab',
            txid: true
          },
          { offset: 5, duplicate: true }
        ],
        [
          {
            offset: 3,
            hash: '65b5a77f61ca87af5766546e4a22129da89f3378322ef29aac6cdc94c1f637f3'
          }
        ],
        [
          {
            offset: 0,
            hash: '0aeaa5c76cba5495f922ae0b52805c0d12c2ffa54d2829d250c958d67c7c5073'
          }
        ]
      ]),
      header: {
        version: 536870912,
        previousHash: '0000000039f1c7dc943d50883e531022825bf5c15a40db2cedde7d203ca3d644',
        merkleRoot: '68bde58600fbd2c716871356cc2ad34b43ac67ac8d7a879dd966429d5a6935b2',
        time: 1734530373,
        bits: 474103450,
        nonce: 3894752803,
        height: 1652142,
        hash: '000000000d9419a409f83f16e2c162b4e44266986d6b9ee02d1b97d9556d9a3a'
      }
    },
    {
      name: 'WoCTsc',
      merklePath: new MerklePath(1652145, [
        [
          {
            offset: 0,
            hash: 'c160acfce1c29c648614b722f1c490473fd7aea0c60d21be95ae981eb0c9c4f0'
          },
          {
            offset: 1,
            hash: '67ca2475886b3fc2edd76a2eb8c32bd0bc308176c7dff463e0507942aeebcbec',
            txid: true
          }
        ],
        [
          {
            offset: 1,
            hash: 'c0eb049e4d3872d63bd3402dd4d6bc8022a170155493a994e1da692f08b2f2d0'
          }
        ]
      ]),
      header: {
        version: 536870912,
        previousHash: '000000001888ff57f4848f181f9f69cab27f2388d7c2edd99b8c004ae482cca7',
        merkleRoot: 'f990936bc3267ba4911acc490107ed1841eedbd2c5017e1074891285df30f255',
        time: 1734532172,
        bits: 474081547,
        nonce: 740519774,
        height: 1652145,
        hash: '0000000003ea4ecae9254b992f292137fde1de66cc809d1a81cfd60cab4ba160'
      }
    },
    {
      name: 'WoCTsc',
      merklePath: new MerklePath(1652145, [
        [
          {
            offset: 2,
            hash: '3fa94b62a3b10d8c18bada527a9b68c4e70db67140719df16c44fb0328782532',
            txid: true
          },
          { offset: 3, duplicate: true }
        ],
        [
          {
            offset: 0,
            hash: '5eec838112f0eabc45e68c8ec14f76e74b0ea636180d91ccf034f5f3c5114edf'
          }
        ]
      ]),
      header: {
        version: 536870912,
        previousHash: '000000001888ff57f4848f181f9f69cab27f2388d7c2edd99b8c004ae482cca7',
        merkleRoot: 'f990936bc3267ba4911acc490107ed1841eedbd2c5017e1074891285df30f255',
        time: 1734532172,
        bits: 474081547,
        nonce: 740519774,
        height: 1652145,
        hash: '0000000003ea4ecae9254b992f292137fde1de66cc809d1a81cfd60cab4ba160'
      }
    },
    {
      name: 'WoCTsc',
      merklePath: new MerklePath(1652160, [
        [
          {
            offset: 0,
            hash: 'ee8d57d6c3f5be3238709f539dc224c44c2c848414cb5969bfa8c81c2768ad6b'
          },
          {
            offset: 1,
            hash: '519675259eff036c6597e4a497d37c132e718171dde4ea2257e84c947ecf656b',
            txid: true
          }
        ]
      ]),
      header: {
        version: 536870912,
        previousHash: '0000000012dbd406fef49503c545bafd940ba2f2c9b05ef351177b71fe96e7d8',
        merkleRoot: 'c2714feeccc7db8ea4235799e6490271867008dd39e3cf8a6e9aa20fd47f3222',
        time: 1734538772,
        bits: 474045917,
        nonce: 2431702809,
        height: 1652160,
        hash: '000000001c5d2b3beb2e1f1f21f69f77cb979ed92f99d2cdd1a2618349b575ca'
      }
    }
  ]

  async function runMockedSendWaiting(postBeefMockStatus, database: string) {
    const ctxs: TestWallet<{}>[] = []
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy(database))
    let txidsPosted: string[] = []
    _tu.mockPostServicesAsCallback(ctxs, (beef, txids) => {
      txidsPosted.push(...txids)
      return postBeefMockStatus as 'success' | 'error'
    })

    for (const { activeStorage: storage, monitor } of ctxs) {
      if (!monitor) throw new sdk.WERR_INTERNAL('test requires setup with monitor')

      {
        const task = new TaskSendWaiting(monitor, 1, 1)
        monitor._tasks.push(task)
        txidsPosted = []
        const expectedTxids = [
          'd9ec73b2e0f06e0f482d2d1db9ceccf2f212f0b24afbe10846ac907567be571f',
          'b7634f08d8c7f3c6244050bebf73a79f40e672aba7d5232663609a58b123b816',
          '3d2ea64ee584a1f6eb161dbedf3a8d299e3e4497ac7a203d23c044c998c6aa08',
          'a3a8fe7f541c1383ff7b975af49b27284ae720af5f2705d8409baaf519190d26',
          '6d68cc6fa7363e59aaccbaa65f0ca613a6ae8af718453ab5d3a2b022c59b5cc6'
        ]
        for (const txid of expectedTxids) {
          const req = verifyOne(await storage.findProvenTxReqs({ partial: { txid } }))
          expect(req.status).toBe('unsent')
          const notifyIds = new EntityProvenTxReq(req).notify.transactionIds || []
          for (const transactionId of notifyIds) {
            const tx = verifyTruthy(await storage.findTransactionById(transactionId))
            expect(['nosend', 'unprocessed', 'sending']).toContain(tx.status)
          }
        }

        await monitor.runTask('SendWaiting')

        expect(txidsPosted).toEqual(expectedTxids)
        for (const txid of expectedTxids) {
          const req = verifyOne(await storage.findProvenTxReqs({ partial: { txid } }))
          if (env.logTests) console.log(new EntityProvenTxReq(req).historyPretty())
          const notifyIds = new EntityProvenTxReq(req).notify.transactionIds || []
          switch (postBeefMockStatus) {
            case 'success':
              {
                expect(req.status).toBe('unmined')
                for (const transactionId of notifyIds) {
                  const tx = verifyTruthy(await storage.findTransactionById(transactionId))
                  expect(['unproven']).toContain(tx.status)
                }
              }
              break
            case 'error': {
              expect(req.status).toBe('unsent')
            }
          }
        }
      }
    }

    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  }

  test('7 TaskReviewStatus', async () => {
    const ctxs: TestWallet<{}>[] = []
    ctxs.push(await _tu.createLegacyWalletSQLiteCopy('monitorTest7'))
    //ctxs.push(await _tu.createLegacyWalletMySQLCopy('monitorTest7'))

    for (const { activeStorage: storage, monitor } of ctxs) {
      const reqs = await storage.findProvenTxReqs({
        partial: { status: 'unmined' }
      })
      const crus = await storage.updateProvenTxReq(reqs[0].provenTxReqId, {
        status: 'invalid'
      })
      const ctus = await storage.updateTransaction(23, {
        provenTxId: undefined
      })

      const task = new TaskReviewStatus(monitor, 1, 1000 * 5)
      monitor._tasks.push(task)
      const log = await monitor.runTask('ReviewStatus')
      //console.log(log)
    }

    for (const ctx of ctxs) {
      await ctx.storage.destroy()
    }
  })
})
