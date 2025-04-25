// file-logger.ts
import { format } from 'date-fns'
import * as fs from 'fs'
import * as path from 'path'

interface LogConfig {
  logDir: string
  logToConsole?: boolean
}

class FileLogger {
  private logDir: string
  private logToConsole: boolean
  private currentDate: string
  private logFilePath: string

  constructor(config: LogConfig) {
    this.logDir = config.logDir
    this.logToConsole = config.logToConsole ?? true
    this.currentDate = this.getCurrentDate()
    this.logFilePath = this.getLogFilePath()

    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  private getCurrentDate(): string {
    return format(new Date(), 'yyyy-MM-dd')
  }

  private getLogFilePath(): string {
    return path.join(this.logDir, `app-${this.getCurrentDate()}.log`)
  }

  private checkDateAndRotate(): void {
    const newDate = this.getCurrentDate()
    if (newDate !== this.currentDate) {
      this.currentDate = newDate
      this.logFilePath = this.getLogFilePath()
    }
  }

  private writeLog(level: string, message: string): void {
    this.checkDateAndRotate()

    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const logMessage = `[${timestamp}] ${level}: ${message}\n`

    // Write to file
    try {
      fs.appendFileSync(this.logFilePath, logMessage, 'utf8')
    } catch (err) {
      console.error('Failed to write to log file:', err)
    }

    // Optionally log to console
    if (this.logToConsole) {
      console.log(logMessage.trim())
    }
  }

  info(message: string): void {
    this.writeLog('INFO', message)
  }

  warn(message: string): void {
    this.writeLog('WARN', message)
  }

  error(message: string | Error): void {
    const msg = message instanceof Error ? message.stack || message.message : message
    this.writeLog('ERROR', msg)
  }
}

export default FileLogger
