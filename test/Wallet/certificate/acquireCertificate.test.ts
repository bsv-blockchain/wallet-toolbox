import { AcquireCertificateArgs, CompletedProtoWallet, ProveCertificateArgs } from '@bsv/sdk'
import { _tu, expectToThrowWERR } from "../../utils/TestUtilsWalletStorage"
import { sdk, Wallet } from '../../../src/index.all'

describe('acquireCertificate tests', () => {
  jest.setTimeout(99999999)

  const env = _tu.getEnv('test')

  beforeAll(async () => {
  })

  afterAll(async () => {
  })

  test('1 invalid params', async () => {
    const { wallet, storage } = await _tu.createLegacyWalletSQLiteCopy('acquireCertificate1')

    const invalidArgs: AcquireCertificateArgs[] = [
      {
        type: "",
        certifier: "",
        acquisitionProtocol: "direct",
        fields: {}
      }
      // Oh so many things to test...
    ]

    for (const args of invalidArgs) {
      await expectToThrowWERR(sdk.WERR_INVALID_PARAMETER, () => wallet.acquireCertificate(args))
    }

    await storage.destroy()
  })

  test('2 acquireCertificate listCertificate proveCertificate', async () => {
    const { wallet, storage } = await _tu.createSQLiteTestWallet({ databaseName: 'acquireCertificate2', dropAll: true })

    // Make a test certificate from a random certifier for the wallet's identityKey
    const subject = wallet.keyDeriver.identityKey
    const { cert, certifier } = _tu.makeSampleCert(subject)

    // Act as the certifier: create a wallet for them...
    const certifierWallet = new CompletedProtoWallet(certifier)
    // load the plaintext certificate into a CertOps object
    const co = new sdk.CertOps(certifierWallet, cert)
    // encrypt and sign the certificate
    await co.encryptAndSignNewCertificate()
    // export the signed certificate and a keyring for this wallet's identity as counterparty
    const { certificate: c, keyring: kr } = co.exportForSubject()

    // args object to create a new certificate via 'direct' protocol.
    const args: AcquireCertificateArgs = {
      serialNumber: c.serialNumber,
      signature: c.signature,
      privileged: false,
      privilegedReason: undefined,

      type: c.type,
      certifier: c.certifier,
      acquisitionProtocol: "direct",
      fields: c.fields,
      keyringForSubject: kr,
      keyringRevealer: 'certifier',
      revocationOutpoint: c.revocationOutpoint
    }
    // store the new signed certificate in user's wallet
    const r = await wallet.acquireCertificate(args)
    expect(r.serialNumber).toBe(c.serialNumber)

    // Attempt to retrieve it... since
    // the certifier is random this should
    // always be unique :-)
    const lcs = await wallet.listCertificates({
      certifiers: [cert.certifier],
      types: []
    })
    expect(lcs.certificates.length).toBe(1)
    const lc = lcs.certificates[0]
    // the result should be encrypted.
    expect(lc.fields['name']).not.toBe('Alice')

    // Use proveCertificate to obtain a decryption keyring:
    const pkrArgs: ProveCertificateArgs = {
      certificate: { serialNumber: lc.serialNumber },
      fieldsToReveal: ['name'],
      verifier: subject
    }
    const pkr = await wallet.proveCertificate(pkrArgs)
    const co2 = await sdk.CertOps.fromCounterparty(wallet, { certificate: lc, keyring: pkr.keyringForVerifier, counterparty: pkrArgs.verifier })
    expect(co2._decryptedFields!['name']).toBe('Alice')

    const certs = await wallet.listCertificates({ types: [], certifiers: [] })
    for (const cert of certs.certificates) {
      const rr = await wallet.relinquishCertificate({ type: cert.type, serialNumber: cert.serialNumber, certifier: cert.certifier })
      expect(rr.relinquished).toBe(true)
    }
    await storage.destroy()
  })

  test('3 privileged acquireCertificate listCertificate proveCertificate', async () => {
    const { wallet, storage } = await _tu.createSQLiteTestWallet({
      databaseName: 'acquireCertificate3',
      privKeyHex: '42'.repeat(32),
      dropAll: true
    })

    // Make a test certificate from a random certifier for the wallet's identityKey

    // Certificate issued to the privileged key must use the privilegedKeyManager's identityKey
    const subject = (await wallet.privilegedKeyManager!.getPublicKey({ identityKey: true })).publicKey
    const { cert, certifier } = _tu.makeSampleCert(subject)


    // Act as the certifier: create a wallet for them...
    const certifierWallet = new CompletedProtoWallet(certifier)
    // load the plaintext certificate into a CertOps object
    const co = new sdk.CertOps(certifierWallet, cert)
    // encrypt and sign the certificate
    await co.encryptAndSignNewCertificate()
    // export the signed certificate and a keyring for this wallet's identity as counterparty
    const { certificate: c, keyring: kr } = co.exportForSubject()

    // args object to create a new certificate via 'direct' protocol.
    const args: AcquireCertificateArgs = {
      serialNumber: c.serialNumber,
      signature: c.signature,
      privileged: true,
      privilegedReason: 'access to my penthouse',

      type: c.type,
      certifier: c.certifier,
      acquisitionProtocol: "direct",
      fields: c.fields,
      keyringForSubject: kr,
      keyringRevealer: 'certifier',
      revocationOutpoint: c.revocationOutpoint
    }
    // store the new signed certificate in user's wallet
    const r = await wallet.acquireCertificate(args)
    expect(r.serialNumber).toBe(c.serialNumber)

    // Attempt to retrieve it... since
    // the certifier is random this should
    // always be unique :-)
    const lcs = await wallet.listCertificates({
      certifiers: [cert.certifier],
      types: []
    })
    expect(lcs.certificates.length).toBe(1)
    const lc = lcs.certificates[0]
    // the result should be encrypted.
    expect(lc.fields['name']).not.toBe('Alice')

    // Use proveCertificate to obtain a decryption keyring:
    const pkrArgs: ProveCertificateArgs = {
      certificate: { serialNumber: lc.serialNumber },
      fieldsToReveal: ['name'],
      verifier: subject
    }
    const pkr = await wallet.proveCertificate(pkrArgs)
    const co2 = await sdk.CertOps.fromCounterparty(wallet.privilegedKeyManager!, { certificate: lc, keyring: pkr.keyringForVerifier, counterparty: pkrArgs.verifier })
    expect(co2._decryptedFields!['name']).toBe('Alice')

    const certs = await wallet.listCertificates({ types: [], certifiers: [] })
    for (const cert of certs.certificates) {
      const rr = await wallet.relinquishCertificate({ type: cert.type, serialNumber: cert.serialNumber, certifier: cert.certifier })
      expect(rr.relinquished).toBe(true)
    }

    // Also cleans up the privilegedKeyManager
    await wallet.destroy()
  })

  /**
   * NOTE: This test requires a generic-certifier-backend to be running
   * with the following configuration:
   * 
   *  type: 'h53Tvo8w3nqeF2cPyuRUc/B+gjPXJ3gPS2PKFBZfpDw=',
   *  certifierIdentityKey: '02be1093d98689b5a5bb49cefff5d98a390213cc5b0a5cd57459407f86a963325f',
   */
  test.skip('acquireCertificate via issuance', async () => {
    const { wallet, storage } = await _tu.createSQLiteTestWallet({ databaseName: 'acquireCertificate2', dropAll: true })
    // Attributes to get certified
    const fields = {
      name: 'Bob',
      email: 'bob@projectbabbage.com'
    }

    // args object to create a new certificate via 'issuance' protocol.
    const args: AcquireCertificateArgs = {
      type: 'h53Tvo8w3nqeF2cPyuRUc/B+gjPXJ3gPS2PKFBZfpDw=',
      certifier: '02be1093d98689b5a5bb49cefff5d98a390213cc5b0a5cd57459407f86a963325f',
      certifierUrl: 'http://localhost:3998',
      acquisitionProtocol: "issuance",
      fields: fields
    }
    // store the new signed certificate in user's wallet
    const r = await wallet.acquireCertificate(args)
    const certificatesFound = await wallet.listCertificates({
      certifiers: [args.certifier],
      types: []
    })
    expect(certificatesFound.certificates.length).toBe(1)
    const lc = certificatesFound.certificates[0]
    // the result should be encrypted.
    expect(lc.fields['name']).not.toBe('Alice')

    // const certs = await wallet.listCertificates({ types: [], certifiers: [] })
    for (const cert of certificatesFound.certificates) {
      const rr = await wallet.relinquishCertificate({ type: cert.type, serialNumber: cert.serialNumber, certifier: cert.certifier })
      expect(rr.relinquished).toBe(true)
    }
    await storage.destroy()
  })
})