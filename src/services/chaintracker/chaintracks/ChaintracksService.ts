/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChaintracksSingletonClient } from './ChaintracksSingletonClient' 

import authrite from 'authrite-express'

import { IncomingMessage, Server, ServerResponse } from 'http'
import crypto from 'crypto'
import fs from 'fs'
import https from 'https'
import express from 'express'
import bodyParser from 'body-parser'
import { asBuffer, asString, BaseBlockHeaderHex, BlockHeaderHex, Chain, ChaintracksClientApi, ChaintracksInfoApi, toBaseBlockHeader, wait } from 'cwi-base'
import { CwiExternalServices, CwiExternalServicesOptions, FiatExchangeRatesApi } from 'cwi-external-services'

export interface AuthriteConfig {
    /**
     * 32 byte hex encoded private key
     */
    serverPrivateKey: string,

    /**
     * The base url where this authrite service can be reached.
     */
    baseUrl: string,

    requestedCertificates?: {
        /**
         * An object whose properties are certificate type strings
         * and the values are arrays of field names of interest.
         * 
         * Object.fromEntries([['<type1>', ['field1', 'field2', ...]], ... ])
         */
        types: Record<string, string[]>,

        /**
         * Certifier public keys. Hex encoded.
         */
        certifiers: string[]
    }
}

export interface ChaintracksServiceOptions {
    /**
     * prepended to the path of each registered service endpoint
     */
    routingPrefix: string,
    /**
     * if true, constructor calls `startJsonRpcServer`
     */
    startJsonRpcOnCreate: boolean,

    /**
     * To enable authrite, provide a valid configuration.
     */
    authriteConfig?: AuthriteConfig

    externalServicesOptions?: CwiExternalServicesOptions

    port?: number
    httpsPrivateKeyPath?: string
    httpsCertificatePath?: string
}

export class ChaintracksService {
  static createChaintracksServiceOptions(): ChaintracksServiceOptions {
    const options: ChaintracksServiceOptions = {
      routingPrefix: '',
      startJsonRpcOnCreate: true,
      externalServicesOptions: CwiExternalServices.createDefaultOptions()
    }
    return options
  }

  static createAuthriteChaintracksServiceOptions(baseUrl: string, serverPrivateKey?: string): ChaintracksServiceOptions {
    const options: ChaintracksServiceOptions = {
      routingPrefix: '',
      startJsonRpcOnCreate: true,
      authriteConfig: {
        serverPrivateKey: serverPrivateKey || crypto.randomBytes(32).toString('hex'),
        baseUrl,
      }
    }
    return options
  }

  options: ChaintracksServiceOptions
  chaintracks: ChaintracksClientApi
  services: CwiExternalServices
  server?: Server<typeof IncomingMessage, typeof ServerResponse>

  constructor(chaintracks: ChaintracksClientApi | Chain, public port: number, options?: ChaintracksServiceOptions) {
    if (chaintracks === undefined || port === undefined) throw new Error("Two arguments are required: ChaintracksClientApi | Chain, port.")
    this.options = options || ChaintracksService.createChaintracksServiceOptions()
    if (chaintracks && typeof chaintracks === "object")
      this.chaintracks = chaintracks
    else
      this.chaintracks = new ChaintracksSingletonClient(chaintracks)

    this.chaintracks.startListening()

    if (this.options.startJsonRpcOnCreate)
      this.startJsonRpcServer()

    this.services = new CwiExternalServices(this.options.externalServicesOptions)
    // Prevent recursion...
    this.services.updateFiatExchangeRateServices.remove('ChaintracksService')
  }

  stopJsonRpcServer() {
    this.server?.close()
  }

  async startJsonRpcServer(port?: number) {
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
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
        try {
          console.log(`request ${path}`)
          await action(req.query)
          res.status(200).json({ status: 'success' })
        } catch (err) { handleErr(err, res) }
      })
    }

    const appGet = <T>(path: string, action: (q: any) => Promise<T>, noCache = false) => {
      app['get'](this.options.routingPrefix + path, async (req, res) => {
        if (noCache) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
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
        } catch (err) { handleErr(err, res) }
      })
    }

    appGet<Chain>('/getChain', async () => await this.chaintracks.getChain())
    appGet<ChaintracksInfoApi>('/getInfo', async q => {
      if (q.wait)
        await wait(Number(q.wait))
      const r = await this.chaintracks.getInfo()
      if (q.wait)
        r["wait"] = q.wait
      return r
    }, true)

    appGet<FiatExchangeRatesApi>('/getFiatExchangeRates', async () => {
      // update if needed
      await this.services.getFiatExchangeRate('GBP')
      // return current values
      return this.services.options.fiatExchangeRates
    }, true)

    if (this.options.authriteConfig) {
      // Authrite is enforced from here forward
      app.use(authrite.middleware(this.options.authriteConfig))
    }

    appPostVoid('/addHeaderHex', async (header: BaseBlockHeaderHex) => { await this.chaintracks.addHeader(toBaseBlockHeader(header)) })

    appGetVoid('/startListening', async () => { this.chaintracks.startListening() }, true)
    appGetVoid('/listening', async () => { await this.chaintracks.listening() }, true)
    appGet<boolean>('/isSynchronized', async () => await this.chaintracks.isSynchronized(), true)
    appGet<boolean>('/isListening', async () => await this.chaintracks.isListening(), true)
    appGet<number>('/getPresentHeight', async () => await this.chaintracks.getPresentHeight(), true)
    appGet<string>('/findChainTipHashHex', async () => asString((await this.chaintracks.findChainTipHashHex()) || ''), true)
    appGet<BlockHeaderHex>('/findChainTipHeaderHex', async () => await this.chaintracks.findChainTipHeaderHex(), true)

    appGet<BlockHeaderHex | undefined>('/findHeaderHexForHeight', async q => {
      return await this.chaintracks.findHeaderHexForHeight(Number(q.height))
    })
    appGet<string | undefined>('/findChainWorkHexForBlockHash', async q => {
      return await this.chaintracks.findChainWorkHexForBlockHash(asBuffer(q.hash))
    })
    appGet<BlockHeaderHex | undefined>('/findHeaderHexForBlockHash', async q => {
      return await this.chaintracks.findHeaderHexForBlockHash(asBuffer(q.hash))
    })
    appGet<BlockHeaderHex | undefined>('/findHeaderHexForMerkleRoot', async q => {
      const height = !q.height || q.height === 'undefined' || !Number.isInteger(Number(q.height)) ? undefined : Number(q.height)
      if (q.wait)
        await wait(Number(q.wait))
      const r = await this.chaintracks.findHeaderHexForMerkleRoot(asBuffer(q.root), height)
      return r
    })

    appGet<string>('/getHeaders', async q => {
      return await this.chaintracks.getHeadersHex(Number(q.height), Number(q.count))
    })

    if (this.options.httpsCertificatePath && this.options.httpsPrivateKeyPath) {
      const options = {
        key: fs.readFileSync(this.options.httpsPrivateKeyPath),
        cert: fs.readFileSync(this.options.httpsCertificatePath)
      }
      this.server = https.createServer(options, app)
      this.server.listen(this.port, () => { console.log(`ChaintracksService listening for https on port ${this.port}`) })
    } else {
      this.server = app.listen(this.port, () => { console.log(`ChaintracksService listening on port ${this.port}`) })
    }
  }
}