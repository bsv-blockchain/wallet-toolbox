import express from 'express'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import http from 'http'

export class LocalCdnServer {
  app: express.Application
  server?: http.Server

  constructor(
    public port: number,
    public folder: string
  ) {
    // Ensure the files directory exists
    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder)
    }
  }

  async start() {
    this.app = express()
    this.server = http.createServer(this.app)

    // Enable CORS for all routes
    this.app.use(cors())

    // Serve static files from the files directory
    this.app.use('/blockheaders', express.static(this.folder))

    // List all files in the directory
    this.app.get('/files', (req, res) => {
      fs.readdir(this.folder, (err, files) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to read directory' })
        }
        res.json({ files })
      })
    })

    // Download specific file
    this.app.get('/download/:filename', (req, res) => {
      const filePath = path.join(this.folder, req.params.filename)

      // Ensure filePath stays within the allowed folder (prevent directory traversal)
      const resolvedFolder = path.resolve(this.folder)
      const resolvedFilePath = path.resolve(filePath)
      if (!resolvedFilePath.startsWith(resolvedFolder + path.sep)) {
        // Prevent access to files outside the allowed directory
        return res.status(403).json({ error: 'Access denied' })
      }

      if (!fs.existsSync(resolvedFilePath)) {
        return res.status(404).json({ error: 'File not found' })
      }

      res.download(resolvedFilePath, err => {
        if (err) {
          res.status(500).json({ error: 'Error downloading file' })
        }
      })
    })

    this.server.listen(this.port, () => {
      //      console.log(`Server running at http://localhost:${this.port}`)
      //      console.log(`Serving files from: ${this.folder}`)
      //      console.log(`Access files at: http://localhost:${this.port}/blockheaders`)
      //      console.log(`List files at: http://localhost:${this.port}/files`)
    })
  }

  async stop() {
    await this.server?.close()
  }
}
