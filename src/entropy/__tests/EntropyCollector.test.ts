import { EntropyCollector } from '../EntropyCollector'

describe('EntropyCollector', () => {
    describe('Configuration', () => {
        it('should use default configuration', () => {
            const collector = new EntropyCollector()
            const progress = collector.getProgress()

            expect(progress.target).toBe(256)
            expect(progress.collected).toBe(0)
            expect(progress.percent).toBe(0)
        })

        it('should accept custom configuration', () => {
            const collector = new EntropyCollector({
                targetSamples: 100,
                minSampleInterval: 20
            })
            const progress = collector.getProgress()

            expect(progress.target).toBe(100)
        })
    })

    describe('Sample Collection', () => {
        it('should collect mouse samples', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 0 })

            const progress = collector.addMouseSample(100, 200)

            expect(progress).not.toBeNull()
            expect(progress!.collected).toBe(1)
        })

        it('should reject samples that are too close together', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 1000 })

            collector.addMouseSample(100, 200)
            const secondProgress = collector.addMouseSample(101, 201)

            expect(secondProgress).toBeNull()
        })

        it('should track progress percentage', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 0 })

            for (let i = 0; i < 5; i++) {
                collector.addMouseSample(i * 10, i * 20)
            }

            const progress = collector.getProgress()
            expect(progress.percent).toBe(50)
        })

        it('should cap percent at 100', () => {
            const collector = new EntropyCollector({ targetSamples: 5, minSampleInterval: 0 })

            for (let i = 0; i < 10; i++) {
                collector.addMouseSample(i * 10, i * 20)
            }

            const progress = collector.getProgress()
            expect(progress.percent).toBe(100)
        })
    })

    describe('Completion', () => {
        it('should report incomplete when not enough samples', () => {
            const collector = new EntropyCollector({ targetSamples: 100, minSampleInterval: 0 })

            for (let i = 0; i < 50; i++) {
                collector.addMouseSample(i, i)
            }

            expect(collector.isComplete()).toBe(false)
        })

        it('should report complete when enough samples collected', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 0 })

            for (let i = 0; i < 10; i++) {
                collector.addMouseSample(i * 5, i * 10)
            }

            expect(collector.isComplete()).toBe(true)
        })
    })

    describe('Reset', () => {
        it('should reset collected samples', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 0 })

            for (let i = 0; i < 5; i++) {
                collector.addMouseSample(i, i)
            }

            expect(collector.getProgress().collected).toBe(5)

            collector.reset()

            expect(collector.getProgress().collected).toBe(0)
            expect(collector.isComplete()).toBe(false)
        })
    })

    describe('Entropy Generation', () => {
        it('should generate 32 bytes of entropy', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 0 })

            for (let i = 0; i < 10; i++) {
                collector.addMouseSample(Math.random() * 1000, Math.random() * 1000)
            }

            const entropy = collector.generateEntropy()

            expect(entropy).toBeInstanceOf(Uint8Array)
            expect(entropy.length).toBe(32)
        })

        it('should generate entropy even with insufficient samples (with warning)', () => {
            const collector = new EntropyCollector({ targetSamples: 100, minSampleInterval: 0 })

            // Only add a few samples
            for (let i = 0; i < 5; i++) {
                collector.addMouseSample(i, i)
            }

            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

            const entropy = collector.generateEntropy()

            expect(entropy.length).toBe(32)
            expect(consoleSpy).toHaveBeenCalled()

            consoleSpy.mockRestore()
        })

        it('should generate different entropy on each call (due to CSPRNG mixing)', () => {
            const collector = new EntropyCollector({ targetSamples: 10, minSampleInterval: 0 })

            for (let i = 0; i < 10; i++) {
                collector.addMouseSample(i, i)
            }

            const entropy1 = collector.generateEntropy()
            const entropy2 = collector.generateEntropy()

            // They should be different due to CSPRNG mixing
            expect(Buffer.from(entropy1).toString('hex')).not.toBe(Buffer.from(entropy2).toString('hex'))
        })
    })

    describe('Entropy Estimation', () => {
        it('should estimate 0 bits with no samples', () => {
            const collector = new EntropyCollector()
            expect(collector.estimateEntropyBits()).toBe(0)
        })

        it('should estimate entropy based on sample count', () => {
            const collector = new EntropyCollector({ targetSamples: 100, minSampleInterval: 0 })

            for (let i = 0; i < 20; i++) {
                collector.addMouseSample(i, i)
            }

            const bits = collector.estimateEntropyBits()
            expect(bits).toBeGreaterThan(0)
            expect(bits).toBeLessThanOrEqual(256) // Capped at 256
        })

        it('should cap entropy estimate at 256 bits', () => {
            const collector = new EntropyCollector({ targetSamples: 1000, minSampleInterval: 0 })

            for (let i = 0; i < 500; i++) {
                collector.addMouseSample(i, i)
            }

            const bits = collector.estimateEntropyBits()
            expect(bits).toBe(256)
        })
    })
})
