import { WalletError } from '../sdk/WalletError'
import { ProviderCallHistory, ServiceCallHistory } from '../sdk/WalletServices.interfaces'

const MAX_RESET_COUNTS = 32
const MAX_CALL_HISTORY = 32

export class ServiceCollection<T> {
  services: { name: string; service: T }[]
  _index: number

  /**
   * Start of currentCounts interval. Initially instance construction time.
   */
  readonly since: Date
  _historyByProvider: Record<string, ProviderCallHistory> = {}

  constructor(
    public serviceName: string,
    services?: { name: string; service: T }[]
  ) {
    this.services = services || []
    this._index = 0
    this.since = new Date()
  }

  add(s: { name: string; service: T }): ServiceCollection<T> {
    this.services.push(s)
    return this
  }

  remove(name: string): void {
    this.services = this.services.filter(s => s.name !== name)
  }

  get name() {
    return this.services[this._index].name
  }

  get service() {
    return this.services[this._index].service
  }

  getServiceToCall(i: number): ServiceToCall<T> {
    const name = this.services[i].name
    const service = this.services[i].service
    const call = { name, when: new Date(), msecs: 0, success: false, result: undefined, error: undefined }
    return { serviceName: this.serviceName, providerName: name, service, call }
  }

  get serviceToCall(): ServiceToCall<T> {
    return this.getServiceToCall(this._index)
  }

  get allServicesToCall(): ServiceToCall<T>[] {
    const all: ServiceToCall<T>[] = []
    for (let i = 0; i < this.services.length; i++) {
      all.push(this.getServiceToCall(i))
    }
    return all
  }

  /**
   * Used to de-prioritize a service call by moving it to the end of the list.
   * @param stc
   */
  moveServiceToLast(stc: ServiceToCall<T>) {
    const index = this.services.findIndex(s => s.name === stc.providerName)
    if (index !== -1) {
      const [service] = this.services.splice(index, 1)
      this.services.push(service)
    }
  }

  get allServices() {
    return this.services.map(x => x.service)
  }

  get count() {
    return this.services.length
  }
  get index() {
    return this._index
  }

  reset() {
    this._index = 0
  }

  next(): number {
    this._index = (this._index + 1) % this.count
    return this._index
  }

  clone(): ServiceCollection<T> {
    return new ServiceCollection(this.serviceName, [...this.services])
  }

  _addServiceCall(providerName: string, call: ServiceCall): ProviderCallHistory {
    const now = new Date()
    let h = this._historyByProvider[providerName]
    if (!h) {
      h = {
        serviceName: this.serviceName,
        providerName: providerName,
        calls: [],
        totalCounts: { success: 0, failure: 0, error: 0, since: this.since, until: now },
        resetCounts: [{ success: 0, failure: 0, error: 0, since: this.since, until: now }]
      }
      this._historyByProvider[providerName] = h
    }
    h.calls.unshift(call)
    h.calls = h.calls.slice(0, MAX_CALL_HISTORY)
    h.totalCounts.until = now
    h.resetCounts[0].until = now
    return h
  }

  getDuration(since: Date | string): number {
    const now = new Date()
    if (typeof since === 'string') since = new Date(since)
    return now.getTime() - since.getTime()
  }

  addServiceCallSuccess(stc: ServiceToCall<T>, result?: string): void {
    const call = stc.call
    call.success = true
    call.result = result
    call.error = undefined
    call.msecs = this.getDuration(call.when)
    const h = this._addServiceCall(stc.providerName, call)
    h.totalCounts.success++
    h.resetCounts[0].success++
  }

  addServiceCallFailure(stc: ServiceToCall<T>, result?: string): void {
    const call = stc.call
    call.success = false
    call.result = result
    call.error = undefined
    call.msecs = this.getDuration(call.when)
    const h = this._addServiceCall(this.name, call)
    h.totalCounts.failure++
    h.resetCounts[0].failure++
  }

  addServiceCallError(stc: ServiceToCall<T>, error: WalletError): void {
    const call = stc.call
    call.success = false
    call.result = undefined
    call.error = error
    call.msecs = this.getDuration(call.when)
    const h = this._addServiceCall(this.name, call)
    h.totalCounts.failure++
    h.totalCounts.error++
    h.resetCounts[0].failure++
    h.resetCounts[0].error++
  }

  /**
   * @returns A copy of current service call history
   */
  getServiceCallHistory(reset?: boolean): ServiceCallHistory {
    const now = new Date()
    const history: ServiceCallHistory = { serviceName: this.serviceName, historyByProvider: {} }
    for (const name of Object.keys(this._historyByProvider)) {
      const h = this._historyByProvider[name]
      const c: ProviderCallHistory = {
        serviceName: h.serviceName,
        providerName: h.providerName,
        calls: h.calls.map(c => ({
          when: dateToString(c.when),
          msecs: c.msecs,
          success: c.success,
          result: c.result,
          error: c.error ? { message: c.error.message, code: c.error.code } : undefined
        })),
        totalCounts: {
          success: h.totalCounts.success,
          failure: h.totalCounts.failure,
          error: h.totalCounts.error,
          since: dateToString(h.totalCounts.since),
          until: dateToString(h.totalCounts.until)
        },
        resetCounts: []
      }
      for (let i = 0; i < h.resetCounts.length; i++) {
        const r = h.resetCounts[i]
        c.resetCounts.push({
          success: r.success,
          failure: r.failure,
          error: r.error,
          since: dateToString(r.since),
          until: dateToString(r.until)
        })
      }
      history.historyByProvider[name] = c
      if (reset) {
        // Make sure intervals are continuous.
        h.resetCounts[0].until = now
        // insert a new resetCounts interval
        h.resetCounts.unshift({
          success: 0,
          failure: 0,
          error: 0,
          // start of new interval
          since: now,
          // end of new interval, gets bumped with each new call added
          until: now
        })
        // limit history to most recent intervals
        h.resetCounts = h.resetCounts.slice(0, MAX_CALL_HISTORY)
      }
    }
    return history

    function dateToString(d: Date | string): string {
      return typeof d === 'string' ? d : d.toISOString()
    }
  }
}

export interface ServiceCall {
  /**
   * string value must be Date's toISOString format.
   */
  when: Date | string
  msecs: number
  /**
   * true iff service provider successfully processed the request
   * false iff service provider failed to process the request which includes thrown errors.
   */
  success: boolean
  /**
   * Simple text summary of result. e.g. `not a valid utxo` or `valid utxo`
   */
  result?: string
  /**
   * Error code and message iff success is false and a exception was thrown.
   */
  error?: { message: string; code: string }
}

export interface ServiceToCall<T> {
  providerName: string
  serviceName: string
  service: T
  call: ServiceCall
}
