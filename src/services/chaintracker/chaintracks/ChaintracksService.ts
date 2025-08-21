import { Chaintracks } from './Chaintracks'

import { IncomingMessage, Server, ServerResponse } from 'http'
import https from 'https'
import express from 'express'
import bodyParser from 'body-parser'
import { Chain } from '../../../sdk/types'
import { createNoDbChaintracksOptions } from './createDefaultChaintracksOptions'
import { Services } from '../../Services'
import { FiatExchangeRates, WERR_INVALID_PARAMETER } from '../../../sdk'
import { ChaintracksInfoApi } from './Api/ChaintracksClientApi'
import { wait } from '../../../utility/utilityHelpers'
import { BaseBlockHeader, BlockHeader } from './Api/BlockHeaderApi'
import { ChaintracksFsApi } from './Api/ChaintracksFsApi'
import { ChaintracksFs } from './util/ChaintracksFs'

export interface ChaintracksServiceOptions {
  chain: Chain
  /**
   * prepended to the path of each registered service endpoint
   */
  routingPrefix: string
  /**
   * Defaults to default configured Chaintracks instance with NoDb storage.
   */
  chaintracks?: Chaintracks
  services?: Services
  port?: number
}

export class ChaintracksService {
  static createChaintracksServiceOptions(chain: Chain): ChaintracksServiceOptions {
    const options: ChaintracksServiceOptions = {
      chain,
      routingPrefix: ''
    }
    return options
  }

  chain: Chain
  options: ChaintracksServiceOptions
  port?: number
  chaintracks: Chaintracks
  services: Services
  server?: Server<typeof IncomingMessage, typeof ServerResponse>

  constructor(options: ChaintracksServiceOptions) {
    this.options = { ...options }
    this.port = options.port
    this.chain = options.chain
    this.chaintracks = options.chaintracks || new Chaintracks(createNoDbChaintracksOptions(this.chain))
    this.services = options.services || new Services(this.chain)
    // Prevent recursion...
    this.services.updateFiatExchangeRateServices.remove('ChaintracksService')
    if (this.chaintracks.chain !== this.chain || this.services.chain !== this.chain) {
      throw new WERR_INVALID_PARAMETER(
        'chain',
        `All components (chaintracks and services) must be on chain ${this.chain}`
      )
    }
  }

  async stopJsonRpcServer(): Promise<void> {
    this.server?.close()
    await this.chaintracks?.destroy()
  }

  async startJsonRpcServer(port?: number): Promise<void> {
    await this.chaintracks.makeAvailable()

    port ||= this.port || 3011
    this.port = port

    const app = express()
    app.use(bodyParser.json())

    // This allows the API to be used when CORS is enforced
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Methods', '*')
      res.header('Access-Control-Expose-Headers', '*')
      res.header('Access-Control-Allow-Private-Network', 'true')
      if (req.method === 'OPTIONS') {
        res.sendStatus(200)
      } else {
        next()
      }
    })

    const handleErr = (err: any, res: any) => {
      res.status(500).json({
        status: 'error',
        code: 'ERR_INTERNAL',
        description: err?.message || 'An internal error has occurred.'
      })
    }

    const appGetVoid = (path: string, action: (q: any) => Promise<void>, noCache = false) => {
      app['get'](this.options.routingPrefix + path, async (req, res) => {
        if (noCache) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          res.setHeader('Pragma', 'no-cache')
          res.setHeader('Expires', '0')
        }
        try {
          console.log(`request ${path}`)
          await action(req.query)
          res.status(200).json({ status: 'success' })
        } catch (err) {
          handleErr(err, res)
        }
      })
    }

    const appGet = <T>(path: string, action: (q: any) => Promise<T>, noCache = false) => {
      app['get'](this.options.routingPrefix + path, async (req, res) => {
        if (noCache) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          res.setHeader('Pragma', 'no-cache')
          res.setHeader('Expires', '0')
        }
        try {
          const r = await action(req.query)
          console.log('request', path, JSON.stringify(req.query), '->', JSON.stringify(r))
          res.status(200).json({ status: 'success', value: r })
        } catch (err) {
          console.log(`request ${path} -> error`)
          handleErr(err, res)
        }
      })
    }

    const appPostVoid = <T>(path: string, action: (p: T) => Promise<void>) => {
      app['post'](this.options.routingPrefix + path, async (req, res) => {
        try {
          console.log(`request POST ${path}`)
          await action(<T>req.body)
          res.status(200).json({ status: 'success' })
        } catch (err) {
          handleErr(err, res)
        }
      })
    }

    appGet<Chain>('/getChain', async () => await this.chaintracks.getChain())
    appGet<ChaintracksInfoApi>(
      '/getInfo',
      async q => {
        if (q.wait) await wait(Number(q.wait))
        const r = await this.chaintracks.getInfo()
        if (q.wait) r['wait'] = q.wait
        return r
      },
      true
    )

    appGet<FiatExchangeRates>(
      '/getFiatExchangeRates',
      async () => {
        // update if needed
        await this.services.getFiatExchangeRate('GBP')
        // return current values
        return this.services.options.fiatExchangeRates
      },
      true
    )

    appPostVoid('/addHeaderHex', async (header: BaseBlockHeader) => {
      await this.chaintracks.addHeader(header)
    })

    appGet<number>('/getPresentHeight', async () => await this.chaintracks.getPresentHeight(), true)
    appGet<string>('/findChainTipHashHex', async () => (await this.chaintracks.findChainTipHash()) || '', true)
    appGet<BlockHeader>('/findChainTipHeaderHex', async () => await this.chaintracks.findChainTipHeader(), true)

    appGet<BlockHeader | undefined>('/findHeaderHexForHeight', async q => {
      return await this.chaintracks.findHeaderForHeight(Number(q.height))
    })
    appGet<BlockHeader | undefined>('/findHeaderHexForBlockHash', async q => {
      return await this.chaintracks.findLiveHeaderForBlockHash(q.hash)
    })

    appGet<string>('/getHeaders', async q => {
      return await this.chaintracks.getHeaders(Number(q.height), Number(q.count))
    })

    this.server = app.listen(this.port, () => {
      console.log(`ChaintracksService listening on port ${this.port}`)
    })
  }
}
