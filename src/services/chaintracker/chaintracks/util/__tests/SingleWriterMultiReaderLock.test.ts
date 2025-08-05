import { SingleWriterMultiReaderLock } from '../SingleWriterMultiReaderLock'

class TestLock {
  private lock: SingleWriterMultiReaderLock = new SingleWriterMultiReaderLock()
  private value: number = 0

  async readValue(): Promise<number> {
    return this.lock.withReadLock(async () => {
      // Simulate some read delay
      await new Promise(resolve => setTimeout(resolve, 10))
      return this.value
    })
  }

  async writeValue(newValue: number): Promise<number> {
    return this.lock.withWriteLock(async () => {
      // Simulate some write delay
      await new Promise(resolve => setTimeout(resolve, 50))
      this.value = newValue
      return this.value
    })
  }

  async test(): Promise<number[]> {
    const promises: Promise<number>[] = []
    const readCount = 3
    for (let i = 0; i < readCount; i++) promises.push(this.readValue())
    promises.push(this.writeValue(42))
    promises.push(this.writeValue(43))
    promises.push(this.writeValue(47))
    for (let i = 0; i < readCount; i++) promises.push(this.readValue())
    promises.push(this.writeValue(44))
    promises.push(this.writeValue(45))
    promises.push(this.writeValue(46))
    for (let i = 0; i < readCount; i++) promises.push(this.readValue())
    const results = await Promise.all(promises)
    return results
  }
}

describe('SingleWriterMultiReaderLock tests', () => {
  jest.setTimeout(99999999)

  test('0_', async () => {
    const t = new TestLock()
    const r = await t.test()
    expect(r).toEqual([0, 0, 0, 42, 43, 47, 46, 46, 46, 44, 45, 46, 46, 46, 46])
  })
})
