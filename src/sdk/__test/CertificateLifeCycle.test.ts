import { Certificate as BsvCertificate, CompletedProtoWallet, KeyDeriver, MasterCertificate, PrivateKey, Utils, WalletCertificate } from "@bsv/sdk"
import { sdk } from '../../index.all'

describe('CertificateLifeCycle tests', () => {
  jest.setTimeout(99999999)


  test('0 encrypt decrypt sign verify', async () => {
    const subjectWallet = new CompletedProtoWallet(PrivateKey.fromRandom())
    const { cert, certifier, subject } = makeSampleCert(subjectWallet.keyDeriver.rootKey.toString())

    const c = new BsvCertificate(cert.type, cert.serialNumber, cert.subject, cert.certifier, cert.revocationOutpoint, cert.fields)

    const certifierWallet = new CompletedProtoWallet(certifier)

    const imc = await MasterCertificate.issueCertificateForSubject(certifierWallet, c.subject, c.fields, c.type, async () => c.revocationOutpoint)
    const imcSignature = imc.signature
    await expect(imc.sign(certifierWallet)).rejects.toThrow('Certificate has already been signed')
    expect(imcSignature).toBeTruthy()
    expect(imcSignature).toBe(imc.signature)
    const imcVerified = await imc.verify()
    expect(imcVerified).toBe(true)
    const dfs = await MasterCertificate.decryptFields(
      subjectWallet,
      imc.masterKeyring,
      imc.fields,
      (await certifierWallet.getPublicKey({ identityKey: true })).publicKey
    )
    for (const fn of Object.keys(cert.fields)) {
      // decrypted fields should be original un-encrypted fields
      expect(cert.fields[fn]).toBe(dfs[fn])
      // issued certificate fields should encrypted, not the original un-encrypted fields
      expect(cert.fields[fn]).not.toBe(imc.fields[fn])
    }

    await c.sign(certifierWallet)
    const verified = await c.verify()
    expect(verified).toBe(true)


    const co = new sdk.CertOps(certifierWallet, cert)

    expect(co.signature).toBe('')
    await expect(co.verify()).rejects.toThrow('Signature DER must start with 0x30')
    await co.sign(new CompletedProtoWallet(new KeyDeriver(certifier)))
    expect(await co.verify()).toBe(true)

    {
      await co.encryptFields(subject.toPublicKey().toString())
      await expect(co.verify()).rejects.toThrow('Signature is not valid')
      co.signature = undefined
      await co.sign(new CompletedProtoWallet(new KeyDeriver(certifier)))
      expect(await co.verify()).toBe(true)
    }


    await co.decryptFields()
    for (const n of Object.keys(co.fields)) {
      expect(co.fields[n]).toBe(co._decryptedFields![n])
    }

    {
      await co.encryptFields()
      const crypto2 = new CompletedProtoWallet(new KeyDeriver(PrivateKey.fromHex('2'.repeat(64))))
      const co2 = new sdk.CertOps(crypto2, co.toWalletCertificate())
      // even with the keyring, without the right crypto root key decryption will fail.
      co2._keyring = co._keyring
      await expect(co2.decryptFields()).rejects.toThrow('Decryption failed!')
    }
  })

  test('1 createKeyringForVerifier', async () => {
    const { cert, certifier, subject } = makeSampleCert()

    const crypto = new CompletedProtoWallet(subject)
    const co = new sdk.CertOps(crypto, cert)
  })

  test('2 complete flow', async () => {
    // Issuer beging with an un-encrypted (decrypted) raw certificate template:
    // The public keys of both the certifier (the authority issuing the certificate),
    // and the subject (who the certificate pertains to) are included in the certificate.
    const { cert, certifier, subject } = makeSampleCert()

    // Next the certifier must encrypt the field values for privacy and sign the certificate
    // such that the values it contains can be attributed to the certifier through its public key.
    // Encryption is done with random symmetric keys and the keys are then encrypted by the certifier
    // such that each key can also be decrypted by the subject:
    const certifierWallet = new CompletedProtoWallet(certifier)
    const co = new sdk.CertOps(certifierWallet, cert)

    await co.encryptAndSignNewCertificate()

    // Grab a copy of the certificate to send to the subject
    const exportForSubject = co.exportForSubject()

    // The subject imports their copy of the new certificate:
    const subjectWallet = new CompletedProtoWallet(subject)
    const cs = await sdk.CertOps.fromCertifier(subjectWallet, exportForSubject)

    // The subject's imported certificate should verify
    expect(await cs.verify()).toBe(true)

    // Confirm subject can decrypt the certifier's copy of the cert:
    await co.decryptFields(subject.toPublicKey().toString())

    // Confirm subject can decrypt their own copy of the cert:
    await cs.decryptFields(cs.certifier, co._keyring)

    // Restore the encrypted field values.
    cs.fields = cs._encryptedFields!

    // Prepare to send certificate to third party veifier of the 'name' and 'email' fields.
    // The verifier must be able to confirm the signature on the original certificate's encrypted values.
    // And then use a keyRing that their public key will work to reveal decrypted values for 'name' and 'email' only.
    const verifier = PrivateKey.fromRandom()
    // subject makes a keyring for the verifier
    const exportForVerifier = await cs.exportForCounterparty(verifier.toPublicKey().toString(), ['name', 'email'])

    // The verifier uses their own wallet to import the certificate, verify it, and decrypt their designated fields.
    const verifierWallet = new CompletedProtoWallet(verifier)
    const cv = await sdk.CertOps.fromCounterparty(verifierWallet, exportForVerifier)

    // verifier must check that the certifier's public key generates a matching signature over all the encrypted
    // certificate field values before using their keyring to decrypt the fields they've been authorized to see.
    expect(await cv.verify()).toBe(true)

    // The wallet's private key is the verifier's, so the counterparty is the certificate subject (who sent the cert to verifier).
    // This decrypt is using the keyring provided for verification by the subject.
    await cv.decryptFields()
    expect(cv.fields['name']).toBe('Alice')
    expect(cv.fields['email']).toBe('alice@example.com')
    expect(cv.fields['organization']).not.toBe('Example Corp')
  })

})

function makeSampleCert(subjectRootKeyHex?: string): { cert: WalletCertificate, subject: PrivateKey, certifier: PrivateKey } {
  const subject = subjectRootKeyHex ? PrivateKey.fromString(subjectRootKeyHex) : PrivateKey.fromRandom()
  const certifier = PrivateKey.fromRandom()
  const verifier = PrivateKey.fromRandom()
  const cert: WalletCertificate = {
    type: Utils.toBase64(new Array(32).fill(1)),
    serialNumber: Utils.toBase64(new Array(32).fill(2)),
    revocationOutpoint: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef.1',
    subject: subject.toPublicKey().toString(),
    certifier: certifier.toPublicKey().toString(),
    fields: {
      name: 'Alice',
      email: 'alice@example.com',
      organization: 'Example Corp'
    },
    signature: "",
  }
  return { cert, subject, certifier }
}
