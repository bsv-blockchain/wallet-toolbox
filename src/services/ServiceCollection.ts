import { WalletError } from "../sdk/WalletError";

export class ServiceCollection<T> {
  since: Date
  services: { name: string; service: T }[]
  _index: number

  _callHistory: Record<string, ServiceCallHistory> = {}

  constructor(services?: { name: string; service: T }[]) {
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

  get serviceToCall(): ServiceToCall<T> {
    const i = this._index
    const name = this.services[i].name
    const service = this.services[i].service
    const call = { name, when: new Date(), durationMsecs: 0, success: false, result: undefined, error: undefined }
    return { name, service, call }
  }

  get allServicesToCall(): ServiceToCall<T>[] {
    const all: ServiceToCall<T>[] = []
    for (let i = 0; i < this.services.length; i++) {
      all.push(this.serviceToCall)
      this.next()
    }
    return all
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
    return new ServiceCollection([...this.services])
  }

  _addServiceCall(name: string, call: ServiceCall): ServiceCallHistory {
    let h = this._callHistory[name]
    if (!h) {
      h = { name, calls: [], count: 0, countError: 0, countFailure: 0, countSuccess: 0, since: this.since }
      this._callHistory[name] = h
    }
    h.calls.push(call)
    h.count++
    h.calls = h.calls.slice(-32)
    return h
  }

  addServiceCallSuccess(stc: ServiceToCall<T>, result?: string): void {
    const call = stc.call
    call.success = true
    call.result = result
    call.error = undefined
    call.durationMsecs = new Date().getTime() - call.when.getTime()
    this._addServiceCall(this.name, call).countSuccess++
  }

  addServiceCallFailure(stc: ServiceToCall<T>, result?: string): void {
    const call = stc.call
    call.success = false
    call.result = result
    call.error = undefined
    call.durationMsecs = new Date().getTime() - call.when.getTime()
    this._addServiceCall(this.name, call).countFailure++
  }

  addServiceCallError(stc: ServiceToCall<T>, error: WalletError): void {
    const call = stc.call
    call.success = false
    call.result = undefined
    call.error = error
    call.durationMsecs = new Date().getTime() - call.when.getTime()
    this._addServiceCall(this.name, call).countError++
  }

  /**
   * @returns A copy of current service call history
   */
  getServiceCallHistory(reset?: boolean): Record<string, ServiceCallHistory> {
    const histories: Record<string, ServiceCallHistory> = {}
    for (const name of Object.keys(this._callHistory)) {
      const h = this._callHistory[name]
      histories[name] = {
        name: h.name,
        count: h.count,
        countError: h.countError,
        countFailure: h.countFailure,
        countSuccess: h.countSuccess,
        since: h.since,
        calls: h.calls.map(c => ({
          name: c.name,
          when: c.when,
          durationMsecs: c.durationMsecs,
          success: c.success,
          result: c.result,
          error: c.error ? { message: c.error.message, code: c.error.code } : undefined
        }))
      }
      if (reset) {
        h.count = 0
        h.countError = 0
        h.countFailure = 0
        h.countSuccess = 0
        h.since = new Date()
      }
    }
    return histories
  }
}

export interface ServiceCall {
  name: string
  when: Date
  durationMsecs: number
  success: boolean
  result?: string
  error?: { message: string, code: string }
}

export interface ServiceCallHistory {
  name: string
  calls: ServiceCall[]
  count: number
  countSuccess: number
  countFailure: number
  countError: number
  since: Date
}

export interface ServiceToCall<T> {
  name: string
  service: T
  call: ServiceCall
}