/**
 * EntropyCollector
 *
 * Collects entropy from user interactions (mouse movements) and mixes it with
 * cryptographically secure random numbers to generate high-quality random seeds
 * for key generation.
 *
 * This provides defense-in-depth: even if the system's CSPRNG is compromised,
 * the user-provided entropy adds unpredictability. Conversely, if the user's
 * mouse movements are predictable, the CSPRNG ensures security.
 */

import { Random, Hash } from '@bsv/sdk'

export interface EntropyCollectorConfig {
    /** Target number of mouse samples to collect (default: 256) */
    targetSamples?: number
    /** Minimum time between samples in ms (default: 10) */
    minSampleInterval?: number
}

export interface EntropyProgress {
    /** Number of samples collected so far */
    collected: number
    /** Target number of samples */
    target: number
    /** Percentage complete (0-100) */
    percent: number
}

/**
 * Callback type for entropy collection progress updates
 */
export type EntropyProgressCallback = (progress: EntropyProgress) => void

/**
 * Collected entropy data before mixing
 */
interface RawEntropyData {
    mousePositions: Array<{ x: number; y: number; time: number }>
    timingDeltas: number[]
}

export class EntropyCollector {
    private config: Required<EntropyCollectorConfig>
    private rawEntropy: RawEntropyData = {
        mousePositions: [],
        timingDeltas: []
    }
    private lastSampleTime: number = 0

    constructor(config: EntropyCollectorConfig = {}) {
        this.config = {
            targetSamples: config.targetSamples ?? 256,
            minSampleInterval: config.minSampleInterval ?? 10
        }
    }

    /**
     * Reset collected entropy data
     */
    reset(): void {
        this.rawEntropy = {
            mousePositions: [],
            timingDeltas: []
        }
        this.lastSampleTime = 0
    }

    /**
     * Add a mouse movement sample
     * Call this from a mousemove event handler
     *
     * @returns Progress information, or null if sample was rejected (too soon)
     */
    addMouseSample(x: number, y: number): EntropyProgress | null {
        const now = performance.now()

        // Rate limit samples to reduce correlation
        if (now - this.lastSampleTime < this.config.minSampleInterval) {
            return null
        }

        // Record timing delta (high precision timing adds entropy)
        if (this.lastSampleTime > 0) {
            this.rawEntropy.timingDeltas.push(now - this.lastSampleTime)
        }
        this.lastSampleTime = now

        // Record position
        this.rawEntropy.mousePositions.push({ x, y, time: now })

        return this.getProgress()
    }

    /**
     * Get current collection progress
     */
    getProgress(): EntropyProgress {
        const collected = this.rawEntropy.mousePositions.length
        return {
            collected,
            target: this.config.targetSamples,
            percent: Math.min(100, Math.floor((collected / this.config.targetSamples) * 100))
        }
    }

    /**
     * Check if enough entropy has been collected
     */
    isComplete(): boolean {
        return this.rawEntropy.mousePositions.length >= this.config.targetSamples
    }

    /**
     * Extract entropy bytes from collected mouse data
     * Uses SHA-256 to compress and whiten the data
     */
    private extractRawEntropy(): Uint8Array {
        // Serialize all collected data
        const dataPoints: number[] = []

        // Add mouse positions
        for (const pos of this.rawEntropy.mousePositions) {
            // Use lower bits of coordinates (more random due to jitter)
            dataPoints.push(pos.x & 0xFF)
            dataPoints.push(pos.y & 0xFF)
            // Include fractional timing (microsecond precision)
            dataPoints.push(Math.floor(pos.time * 1000) & 0xFF)
            dataPoints.push(Math.floor(pos.time * 1000000) & 0xFF)
        }

        // Add timing deltas (high entropy source)
        for (const delta of this.rawEntropy.timingDeltas) {
            // Timing deltas converted to bytes
            dataPoints.push(Math.floor(delta * 1000) & 0xFF)
            dataPoints.push(Math.floor(delta * 1000000) & 0xFF)
        }

        // Hash to compress and whiten the entropy
        const hash = Hash.sha256(dataPoints)
        return new Uint8Array(hash)
    }

    /**
     * Mix user entropy with system CSPRNG for defense-in-depth
     *
     * @returns 32 bytes of high-quality random data suitable for key generation
     */
    mixWithCSPRNG(): Uint8Array {
        const userEntropy = this.extractRawEntropy()
        const systemEntropy = new Uint8Array(Random(32))

        // XOR user entropy with system entropy
        const mixed = new Uint8Array(32)
        for (let i = 0; i < 32; i++) {
            mixed[i] = userEntropy[i] ^ systemEntropy[i]
        }

        // Final hash to ensure uniform distribution
        const final = Hash.sha256(Array.from(mixed))
        return new Uint8Array(final)
    }

    /**
     * Generate entropy with automatic CSPRNG fallback
     *
     * If not enough user entropy has been collected, supplements with CSPRNG.
     * Always mixes with CSPRNG regardless.
     *
     * @returns 32 bytes suitable for private key generation
     */
    generateEntropy(): Uint8Array {
        if (!this.isComplete()) {
            console.warn(
                `EntropyCollector: Only ${this.rawEntropy.mousePositions.length}/${this.config.targetSamples} ` +
                `samples collected. Supplementing with additional CSPRNG entropy.`
            )
        }

        return this.mixWithCSPRNG()
    }

    /**
     * Convenience method for browser environments.
     * Creates event listeners and resolves when enough entropy is collected.
     *
     * @param element The HTML element to listen on (default: document)
     * @param onProgress Optional callback for progress updates
     * @returns Promise that resolves with 32 bytes of entropy
     */
    async collectFromBrowser(
        element: EventTarget = document,
        onProgress?: EntropyProgressCallback
    ): Promise<Uint8Array> {
        return new Promise((resolve) => {
            const handler = (event: Event) => {
                if (event instanceof MouseEvent) {
                    const progress = this.addMouseSample(event.clientX, event.clientY)
                    if (progress) {
                        onProgress?.(progress)

                        if (this.isComplete()) {
                            element.removeEventListener('mousemove', handler)
                            resolve(this.generateEntropy())
                        }
                    }
                }
            }

            element.addEventListener('mousemove', handler)
        })
    }

    /**
     * Estimate the quality of collected entropy in bits
     * This is a rough heuristic, not a cryptographic guarantee
     */
    estimateEntropyBits(): number {
        const samples = this.rawEntropy.mousePositions.length

        if (samples === 0) return 0

        // Assume roughly 4-6 bits per mouse position (jitter in lower bits)
        // Plus 2-4 bits from timing
        const bitsPerSample = 6

        // Cap at 256 bits (32 bytes) since that's our output size
        return Math.min(256, samples * bitsPerSample)
    }
}
