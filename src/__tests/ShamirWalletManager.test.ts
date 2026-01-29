import { PrivateKey, WalletInterface } from '@bsv/sdk'
import { ShamirWalletManager } from '../ShamirWalletManager'
import { PrivilegedKeyManager } from '../sdk/PrivilegedKeyManager'
import { jest } from '@jest/globals'

// Mock WABClient
const mockWABClient = {
    startShareAuth: jest.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: true }),
    storeShare: jest.fn<() => Promise<{ success: boolean; userId: number }>>().mockResolvedValue({ success: true, userId: 1 }),
    retrieveShare: jest.fn<() => Promise<{ success: boolean; shareB: string }>>().mockResolvedValue({
        success: true,
        shareB: '1.mockedserversharefromwab.2.test'
    }),
    updateShare: jest.fn<() => Promise<{ success: boolean; shareVersion: number }>>().mockResolvedValue({ success: true, shareVersion: 2 }),
    deleteShamirUser: jest.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: true })
}

jest.mock('../wab-client/WABClient', () => {
    return {
        WABClient: jest.fn().mockImplementation(() => mockWABClient)
    }
})

// Mock wallet builder
const mockWallet = {} as WalletInterface
const mockWalletBuilder = jest.fn(async (
    privateKey: PrivateKey,
    privilegedKeyManager: PrivilegedKeyManager
) => mockWallet)

describe('ShamirWalletManager', () => {
    describe('Configuration', () => {
        it('should use default 2-of-3 configuration', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            expect(manager.getThreshold()).toBe(2)
            expect(manager.getTotalShares()).toBe(3)
        })

        it('should accept custom threshold configuration', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder,
                threshold: 3,
                totalShares: 5
            })

            expect(manager.getThreshold()).toBe(3)
            expect(manager.getTotalShares()).toBe(5)
        })

        it('should reject threshold less than 2', () => {
            expect(() => {
                new ShamirWalletManager({
                    wabServerUrl: 'https://test.example.com',
                    authMethodType: 'DevConsole',
                    walletBuilder: mockWalletBuilder,
                    threshold: 1,
                    totalShares: 3
                })
            }).toThrow('Threshold must be at least 2')
        })

        it('should reject totalShares less than 3', () => {
            expect(() => {
                new ShamirWalletManager({
                    wabServerUrl: 'https://test.example.com',
                    authMethodType: 'DevConsole',
                    walletBuilder: mockWalletBuilder,
                    threshold: 2,
                    totalShares: 2
                })
            }).toThrow('Total shares must be at least 3')
        })

        it('should reject configurations where user cannot recover independently (custodial)', () => {
            // 3-of-4 means user gets 3 shares (4-1), which equals threshold - OK
            expect(() => {
                new ShamirWalletManager({
                    wabServerUrl: 'https://test.example.com',
                    authMethodType: 'DevConsole',
                    walletBuilder: mockWalletBuilder,
                    threshold: 3,
                    totalShares: 4
                })
            }).not.toThrow()

            // 3-of-3 means user gets 2 shares (3-1), which is less than threshold 3 - NOT OK
            expect(() => {
                new ShamirWalletManager({
                    wabServerUrl: 'https://test.example.com',
                    authMethodType: 'DevConsole',
                    walletBuilder: mockWalletBuilder,
                    threshold: 3,
                    totalShares: 3
                })
            }).toThrow('User must have at least 3 shares to recover independently')
        })
    })

    describe('Entropy Collection', () => {
        it('should track entropy collection', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            expect(manager.hasEnoughEntropy()).toBe(false)

            // Add a sample
            const progress = manager.addMouseEntropy(100, 200)

            // First sample should be accepted
            expect(progress).not.toBeNull()
            expect(manager.getEntropyProgress().collected).toBeGreaterThan(0)
        })

        it('should reset entropy', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            // Add at least one sample
            manager.addMouseEntropy(100, 200)

            expect(manager.getEntropyProgress().collected).toBeGreaterThan(0)

            manager.resetEntropy()

            expect(manager.getEntropyProgress().collected).toBe(0)
        })
    })

    describe('User ID Hash', () => {
        it('should allow setting user ID hash', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            expect(manager.getUserIdHash()).toBeUndefined()

            manager.setUserIdHash('abc123')

            expect(manager.getUserIdHash()).toBe('abc123')
        })
    })

    describe('Share Validation', () => {
        it('should validate share format with 4 parts', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            // This should fail because the share format is invalid
            await expect(
                manager.recoverWithUserShares(['invalid-share', 'also-invalid'])
            ).rejects.toThrow('Invalid share format')
        })

        it('should reject shares with threshold less than 2', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            await expect(
                manager.recoverWithUserShares(['1.data.1.check', '2.data.1.check'])
            ).rejects.toThrow('Invalid share: threshold must be at least 2')
        })
    })

    describe('Recovery', () => {
        it('should require enough shares for recovery', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            // Only 1 share but threshold encoded in share is 2
            await expect(
                manager.recoverWithUserShares(['1.somedata.2.check'])
            ).rejects.toThrow('Need at least 2 shares to recover')
        })

        it('should require userIdHash for server share recovery', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            await expect(
                manager.recoverWithServerShare(
                    ['1.somedata.2.check'],
                    { otp: '123456' }
                )
            ).rejects.toThrow('User ID hash not set')
        })
    })

    describe('Wallet Building', () => {
        it('should fail to build wallet without private key', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            await expect(manager.buildWallet()).rejects.toThrow('No private key available')
        })

        it('should fail to get wallet without building', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            expect(() => manager.getWallet()).toThrow('Wallet not built')
        })

        it('should report no private key initially', () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            expect(manager.hasPrivateKey()).toBe(false)
        })
    })

    describe('Wallet Creation', () => {
        it('should create wallet and return correct number of user shares', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder,
                threshold: 2,
                totalShares: 3
            })

            // Collect enough entropy
            for (let i = 0; i < 256; i++) {
                manager.addMouseEntropy(Math.random() * 1000, Math.random() * 1000)
            }

            let capturedShares: string[] = []

            const result = await manager.createNewWallet(
                { otp: '123456' },
                async (userShares, threshold, totalShares) => {
                    capturedShares = userShares
                    expect(threshold).toBe(2)
                    expect(totalShares).toBe(3)
                    return true
                }
            )

            // Should get 2 user shares (totalShares - 1 for server)
            expect(result.userShares.length).toBe(2)
            expect(capturedShares.length).toBe(2)
            expect(result.threshold).toBe(2)
            expect(result.totalShares).toBe(3)
            expect(result.userIdHash).toBeDefined()
            expect(result.privateKey).toBeInstanceOf(PrivateKey)
            expect(manager.hasPrivateKey()).toBe(true)
        })

        it('should return more user shares for higher totalShares', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder,
                threshold: 3,
                totalShares: 5
            })

            for (let i = 0; i < 256; i++) {
                manager.addMouseEntropy(Math.random() * 1000, Math.random() * 1000)
            }

            const result = await manager.createNewWallet(
                { otp: '123456' },
                async (userShares) => {
                    expect(userShares.length).toBe(4) // 5 - 1 = 4 user shares
                    return true
                }
            )

            expect(result.userShares.length).toBe(4)
        })
    })

    describe('Account Deletion', () => {
        it('should require userIdHash for deletion', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            await expect(
                manager.deleteAccount({ otp: '123456' })
            ).rejects.toThrow('User ID hash not set')
        })

        it('should clear state after deletion', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            // Collect entropy and create wallet
            for (let i = 0; i < 256; i++) {
                manager.addMouseEntropy(Math.random() * 1000, Math.random() * 1000)
            }

            await manager.createNewWallet(
                { otp: '123456' },
                async () => true
            )

            expect(manager.hasPrivateKey()).toBe(true)
            expect(manager.getUserIdHash()).toBeDefined()

            // Delete
            await manager.deleteAccount({ otp: '654321' })

            expect(manager.hasPrivateKey()).toBe(false)
            expect(manager.getUserIdHash()).toBeUndefined()
        })
    })

    describe('Key Rotation', () => {
        it('should require userIdHash for rotation', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            // Collect entropy
            for (let i = 0; i < 256; i++) {
                manager.addMouseEntropy(Math.random() * 1000, Math.random() * 1000)
            }

            await expect(
                manager.rotateKeys({ otp: '123456' }, async () => true)
            ).rejects.toThrow('User ID hash not set')
        })

        it('should require entropy for rotation', async () => {
            const manager = new ShamirWalletManager({
                wabServerUrl: 'https://test.example.com',
                authMethodType: 'DevConsole',
                walletBuilder: mockWalletBuilder
            })

            manager.setUserIdHash('abc123')

            await expect(
                manager.rotateKeys({ otp: '123456' }, async () => true)
            ).rejects.toThrow('Collect entropy before key rotation')
        })
    })
})
