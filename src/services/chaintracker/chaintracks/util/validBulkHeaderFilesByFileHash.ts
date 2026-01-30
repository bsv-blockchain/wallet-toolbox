import { BulkHeaderFileInfo } from './BulkHeaderFile'

/**
 * Compares meta data received for a bulk header file `vbf` to known
 * valid bulk header files based on their `fileHash`.
 *
 * Short circuits both the retreival and validation of individual headers,
 * only a single SHA256 hash of the aggregate data needs to be compared.
 *
 * The standard file size for historic block headers is 100,000 per file
 * which results in a many orders of magnitude initialization speedup.
 *
 * The following properties must match:
 * - `firstHeight`
 * - `count`
 * - `prevChainWork`
 * - `prevHash`
 * - `lastChainWork`
 * - `lastHash`
 * - `chain`
 *
 * @param vbf
 * @returns true iff bulk file meta data (excluding its source) matches a known file.
 *
 * @publicbody
 */
export function isKnownValidBulkHeaderFile(vbf: BulkHeaderFileInfo): boolean {
  if (!vbf || !vbf.fileHash) return false
  const bf = validBulkHeaderFilesByFileHash()[vbf.fileHash]
  if (
    !bf ||
    bf.firstHeight !== vbf.firstHeight ||
    bf.count !== vbf.count ||
    bf.prevChainWork !== vbf.prevChainWork ||
    bf.prevHash !== vbf.prevHash ||
    bf.lastChainWork !== vbf.lastChainWork ||
    bf.lastHash !== vbf.lastHash ||
    bf.chain !== vbf.chain
  ) {
    return false
  }
  return true
}

let _validBulkHeaderFilesByFileHash: Record<string, BulkHeaderFileInfo> | undefined

/**
 * Hash map of known valid bulk header files by their `fileHash`.
 * @returns object where keys are file hashes of known bulk header files.
 */
export function validBulkHeaderFilesByFileHash(): Record<string, BulkHeaderFileInfo> {
  if (!_validBulkHeaderFilesByFileHash) {
    _validBulkHeaderFilesByFileHash = {}
    for (const vbf of validBulkHeaderFiles) {
      if (vbf.fileHash) {
        _validBulkHeaderFilesByFileHash[vbf.fileHash] = vbf
      }
    }
  }
  return _validBulkHeaderFilesByFileHash
}

/**
 * Static array of known valid bulk header files.
 * `sourceUrl` is included only as a reference to the original certifying authority.
 */
export const validBulkHeaderFiles: BulkHeaderFileInfo[] = [
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_0.headers',
    firstHeight: 0,
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    count: 100000,
    lastHash: '000000004956cc2edd1a8caa05eacfa3c69f4c490bfc9ace820257834115ab35',
    fileHash: 'gAJPUfI2DfAabJTOBxT1rwy1cS4/QULaQHaQWa1RWNk=',
    lastChainWork: '000000000000000000000000000000000000000000000000004143c00b3d47b8',
    prevChainWork: '0000000000000000000000000000000000000000000000000000000000000000',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_1.headers',
    firstHeight: 100000,
    prevHash: '000000004956cc2edd1a8caa05eacfa3c69f4c490bfc9ace820257834115ab35',
    count: 100000,
    lastHash: '0000000000c470c4a573272aa4a680c93fc4c2f5df8ce9546441796f73277334',
    fileHash: 'OIJ010bnIbFobNppJzCNE9jFI1uANz0iNGvqpoG2xq4=',
    lastChainWork: '00000000000000000000000000000000000000000000000004504f3a4e71aa13',
    prevChainWork: '000000000000000000000000000000000000000000000000004143c00b3d47b8',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_2.headers',
    firstHeight: 200000,
    prevHash: '0000000000c470c4a573272aa4a680c93fc4c2f5df8ce9546441796f73277334',
    count: 100000,
    lastHash: '00000000dfe970844d1bf983d0745f709368b5c66224837a17ed633f0dabd300',
    fileHash: 'hZXE3im7V4tE0oROWM2mGB9xPXEcpVLRIYUPaYT3VV0=',
    lastChainWork: '00000000000000000000000000000000000000000000000062378b066f9fba96',
    prevChainWork: '00000000000000000000000000000000000000000000000004504f3a4e71aa13',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_3.headers',
    firstHeight: 300000,
    prevHash: '00000000dfe970844d1bf983d0745f709368b5c66224837a17ed633f0dabd300',
    count: 100000,
    lastHash: '0000000001127c76ac45f605f9300dfa96a8054533b96413883fdc4378aeb42d',
    fileHash: 'BGZxsk/Ooa4BOaoBEMOor+B8wL9ghW5A0We2G2fmyLE=',
    lastChainWork: '0000000000000000000000000000000000000000000000040da9d61d8e129a53',
    prevChainWork: '00000000000000000000000000000000000000000000000062378b066f9fba96',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_4.headers',
    firstHeight: 400000,
    prevHash: '0000000001127c76ac45f605f9300dfa96a8054533b96413883fdc4378aeb42d',
    count: 100000,
    lastHash: '0000000001965655a870175b510326e6393114d293896ddb237709eecb381ab8',
    fileHash: '3DjOpFnatZ0OKrpACATfAtBITX2s8JjfYTAnDHVkGuw=',
    lastChainWork: '00000000000000000000000000000000000000000000000461063a8389300d36',
    prevChainWork: '0000000000000000000000000000000000000000000000040da9d61d8e129a53',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_5.headers',
    firstHeight: 500000,
    prevHash: '0000000001965655a870175b510326e6393114d293896ddb237709eecb381ab8',
    count: 100000,
    lastHash: '000000000000bb1644b4d9a643b165a52b3ffba077f2a12b8bd1f0a6b6cc0fbc',
    fileHash: 'wF008GqnZzAYsOwnmyFzIOmrJthHE3bq6oUg1FvHG1Y=',
    lastChainWork: '0000000000000000000000000000000000000000000000067a8291cfec0aa549',
    prevChainWork: '00000000000000000000000000000000000000000000000461063a8389300d36',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_6.headers',
    firstHeight: 600000,
    prevHash: '000000000000bb1644b4d9a643b165a52b3ffba077f2a12b8bd1f0a6b6cc0fbc',
    count: 100000,
    lastHash: '0000000000003e784511e93aca014ecaa6d4ba3637cf373f4b84dcac7c70cca0',
    fileHash: 'uc7IW6NRXXtX3oGWwOYjtetTaZ+1zhvijNEwPbK+rAs=',
    lastChainWork: '0000000000000000000000000000000000000000000000078286c7f42f7ec693',
    prevChainWork: '0000000000000000000000000000000000000000000000067a8291cfec0aa549',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_7.headers',
    firstHeight: 700000,
    prevHash: '0000000000003e784511e93aca014ecaa6d4ba3637cf373f4b84dcac7c70cca0',
    count: 100000,
    lastHash: '0000000000068f8658ff71cbf8f5b31c837cc6df5bf53e40f05459d4267b53e6',
    fileHash: 'yfomaIGZyoW/m7YdpZYNozeNrUmJBwaF0PpLdSADWJE=',
    lastChainWork: '00000000000000000000000000000000000000000000000a551ea869597d2a74',
    prevChainWork: '0000000000000000000000000000000000000000000000078286c7f42f7ec693',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_8.headers',
    firstHeight: 800000,
    prevHash: '0000000000068f8658ff71cbf8f5b31c837cc6df5bf53e40f05459d4267b53e6',
    count: 100000,
    lastHash: '0000000000214fbb71abe4695d935b8e089d306899c4a90124b1bc6806e6e299',
    fileHash: '/AIS2PYHdMJBmRF9ECsZmCphoqhDyFWs+aO+3GIpPhg=',
    lastChainWork: '00000000000000000000000000000000000000000000000eb93c12a85efec237',
    prevChainWork: '00000000000000000000000000000000000000000000000a551ea869597d2a74',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_9.headers',
    firstHeight: 900000,
    prevHash: '0000000000214fbb71abe4695d935b8e089d306899c4a90124b1bc6806e6e299',
    count: 100000,
    lastHash: '00000000002208a5fee5b9baa4b5519d2cd8ab405754fca13704dc667448f21a',
    fileHash: 'lJtRGLYlMnHe6r0xuJJWauJA7DKL4ZYOqkYmUD2iwbM=',
    lastChainWork: '000000000000000000000000000000000000000000000017e96a5ada9f4a8bfb',
    prevChainWork: '00000000000000000000000000000000000000000000000eb93c12a85efec237',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_10.headers',
    firstHeight: 1000000,
    prevHash: '00000000002208a5fee5b9baa4b5519d2cd8ab405754fca13704dc667448f21a',
    count: 100000,
    lastHash: '000000000005bc8878ba47a47129c3e21f32f8c10b9658f9ee6db16a83870162',
    fileHash: 'tfWVFoIp4A6yXd2c0YietQ7hYlmLf7O884baego+D4E=',
    lastChainWork: '000000000000000000000000000000000000000000000021bf46518c698a4bc8',
    prevChainWork: '000000000000000000000000000000000000000000000017e96a5ada9f4a8bfb',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_11.headers',
    firstHeight: 1100000,
    prevHash: '000000000005bc8878ba47a47129c3e21f32f8c10b9658f9ee6db16a83870162',
    count: 100000,
    lastHash: '00000000f8bf61018ddd77d23c112e874682704a290252f635e7df06c8a317b8',
    fileHash: 'S0Y9WXGFFJLRsRkQRNvrtImOezjReEQ1eDdB2x5M6Mw=',
    lastChainWork: '0000000000000000000000000000000000000000000000288b285ca9b1bb8065',
    prevChainWork: '000000000000000000000000000000000000000000000021bf46518c698a4bc8',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_12.headers',
    firstHeight: 1200000,
    prevHash: '00000000f8bf61018ddd77d23c112e874682704a290252f635e7df06c8a317b8',
    count: 100000,
    lastHash: '0000000000000165e6678be46ec2b15c587611b86da7147f7069a0e7175d62da',
    fileHash: 'eFHQB8EaSfs4EKZxVsLhX8UA79kpOI4dR6j/z9P8frI=',
    lastChainWork: '0000000000000000000000000000000000000000000000542144c6af6e9258ea',
    prevChainWork: '0000000000000000000000000000000000000000000000288b285ca9b1bb8065',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_13.headers',
    firstHeight: 1300000,
    prevHash: '0000000000000165e6678be46ec2b15c587611b86da7147f7069a0e7175d62da',
    count: 100000,
    lastHash: '00000000000002ef0a47d0f242ab280bded8f4780bad506c71f2e1d2771becd4',
    fileHash: '2MFJLBjHOBnuaDAICQFCL3y+6ejj0k92gbcmLWa1/Xc=',
    lastChainWork: '0000000000000000000000000000000000000000000000dcc85f546d353f7b08',
    prevChainWork: '0000000000000000000000000000000000000000000000542144c6af6e9258ea',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_14.headers',
    firstHeight: 1400000,
    prevHash: '00000000000002ef0a47d0f242ab280bded8f4780bad506c71f2e1d2771becd4',
    count: 100000,
    lastHash: '0000000000000168de8736c8a424fd5ebe1dcf0a030ed5fa0699b8c0fafc0b5e',
    fileHash: 'lWmP/pOR5ciEnu5tjIrf7OTEaiaMcfqFZQQYT7QH6qg=',
    lastChainWork: '00000000000000000000000000000000000000000000011bed7ab81a56a65cbc',
    prevChainWork: '0000000000000000000000000000000000000000000000dcc85f546d353f7b08',
    chain: 'test',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'testNet_15.headers',
    firstHeight: 1500000,
    prevHash: '0000000000000168de8736c8a424fd5ebe1dcf0a030ed5fa0699b8c0fafc0b5e',
    count: 100000,
    lastHash: '00000000000005504bfd1a3ce4688c30c86740390102b6cd464a2fb5e0e3fed1',
    fileHash: '1bCf0R0RsoadANX+6H4NH1b3jNuTPyTayoS1SpQXa2Q=',
    lastChainWork: '000000000000000000000000000000000000000000000156c3b84396da4e60b9',
    prevChainWork: '00000000000000000000000000000000000000000000011bed7ab81a56a65cbc',
    chain: 'test',
    validated: true
  },
  {
    chain: 'test',
    count: 95262,
    fileHash: 'BvNO9eeMwCaN1Xsx8PQLMJ+YiqF9FrNe+9WnnEo9B44=',
    fileName: 'testNet_16.headers',
    firstHeight: 1600000,
    lastChainWork: '00000000000000000000000000000000000000000000015814b84c3f9834ef93',
    lastHash: '000000000ca922c841cb7fedd8f012ebc27b17991c9b00a8fb7ca4b1b2b648d3',
    prevChainWork: '000000000000000000000000000000000000000000000156c3b84396da4e60b9',
    prevHash: '00000000000005504bfd1a3ce4688c30c86740390102b6cd464a2fb5e0e3fed1',
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_0.headers',
    firstHeight: 0,
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    count: 100000,
    lastHash: '000000000002d01c1fccc21636b607dfd930d31d01c3a62104612a1719011250',
    fileHash: 'DMXYETHMphmYRh5y0+qsJhj67ML5Ui4LE1eEZDYbnZE=',
    lastChainWork: '000000000000000000000000000000000000000000000000064492eaf00f2520',
    prevChainWork: '0000000000000000000000000000000000000000000000000000000000000000',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_1.headers',
    firstHeight: 100000,
    prevHash: '000000000002d01c1fccc21636b607dfd930d31d01c3a62104612a1719011250',
    count: 100000,
    lastHash: '00000000000003a20def7a05a77361b9657ff954b2f2080e135ea6f5970da215',
    fileHash: 'IID8O84Uny22i10fWHTQr6f9+9eFZ8dhVyegYPGSg+Q=',
    lastChainWork: '00000000000000000000000000000000000000000000001ac0479f335782cb80',
    prevChainWork: '000000000000000000000000000000000000000000000000064492eaf00f2520',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_2.headers',
    firstHeight: 200000,
    prevHash: '00000000000003a20def7a05a77361b9657ff954b2f2080e135ea6f5970da215',
    count: 100000,
    lastHash: '000000000000000067ecc744b5ae34eebbde14d21ca4db51652e4d67e155f07e',
    fileHash: 'wbfV/ZuPvLKHtRJN4QlHiKlpNncuqWA1dMJ6O9mhisc=',
    lastChainWork: '000000000000000000000000000000000000000000005a795f5d6ede10bc6d60',
    prevChainWork: '00000000000000000000000000000000000000000000001ac0479f335782cb80',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_3.headers',
    firstHeight: 300000,
    prevHash: '000000000000000067ecc744b5ae34eebbde14d21ca4db51652e4d67e155f07e',
    count: 100000,
    lastHash: '0000000000000000030034b661aed920a9bdf6bbfa6d2e7a021f78481882fa39',
    fileHash: '5pklz64as2MG6y9lQiiClZaA82f6xoK1xdzkSqOZLsA=',
    lastChainWork: '0000000000000000000000000000000000000000001229fea679a4cdc26e7460',
    prevChainWork: '000000000000000000000000000000000000000000005a795f5d6ede10bc6d60',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_4.headers',
    firstHeight: 400000,
    prevHash: '0000000000000000030034b661aed920a9bdf6bbfa6d2e7a021f78481882fa39',
    count: 100000,
    lastHash: '0000000000000000043831d6ebb013716f0580287ee5e5687e27d0ed72e6e523',
    fileHash: '2X78/S+Z/h5ELA63aC3xt6/o4G8JMcAOEiZ00ycKHsM=',
    lastChainWork: '0000000000000000000000000000000000000000007ae4707601d47bc6695487',
    prevChainWork: '0000000000000000000000000000000000000000001229fea679a4cdc26e7460',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_5.headers',
    firstHeight: 500000,
    prevHash: '0000000000000000043831d6ebb013716f0580287ee5e5687e27d0ed72e6e523',
    count: 100000,
    lastHash: '0000000000000000078f57b9a986b53b73f007c6b27b6f16409ca4eda83034e8',
    fileHash: 'Tzm60n66tIuq7wNdP6M1BH77iFzGCPbOMIl6smJ/LRg=',
    lastChainWork: '000000000000000000000000000000000000000000e8f2ea21f069a214067ed7',
    prevChainWork: '0000000000000000000000000000000000000000007ae4707601d47bc6695487',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_6.headers',
    firstHeight: 600000,
    prevHash: '0000000000000000078f57b9a986b53b73f007c6b27b6f16409ca4eda83034e8',
    count: 100000,
    lastHash: '000000000000000013abf3ab026610ed70e023476db8ce96f68637acdcbcf3cb',
    fileHash: 'O7SoyIDxhejB0Qs4rBO4OkfBK2yVZKhxra6YxZMhiIk=',
    lastChainWork: '0000000000000000000000000000000000000000012f32fb33b26aa239be0fc3',
    prevChainWork: '000000000000000000000000000000000000000000e8f2ea21f069a214067ed7',
    chain: 'main',
    validated: true
  },
  {
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    fileName: 'mainNet_7.headers',
    firstHeight: 700000,
    prevHash: '000000000000000013abf3ab026610ed70e023476db8ce96f68637acdcbcf3cb',
    count: 100000,
    lastHash: '00000000000000000b6ae23bbe9f549844c20943d8c20b8ceedbae8aa1dde8e0',
    fileHash: '+0Wu2GrKgCv4o1yZfdWl60aAgvBj6Rt3xlWj8TQprUw=',
    lastChainWork: '000000000000000000000000000000000000000001483b2995af390c20b58320',
    prevChainWork: '0000000000000000000000000000000000000000012f32fb33b26aa239be0fc3',
    chain: 'main',
    validated: true
  },
  {
    chain: 'main',
    count: 100000,
    fileHash: 'xKYCsMzfbWdwq6RtEos4+4w7F3FroFMXb4tk4Z2gn5s=',
    fileName: 'mainNet_8.headers',
    firstHeight: 800000,
    lastChainWork: '000000000000000000000000000000000000000001664db1f2d50327928007e0',
    lastHash: '00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087',
    prevChainWork: '000000000000000000000000000000000000000001483b2995af390c20b58320',
    prevHash: '00000000000000000b6ae23bbe9f549844c20943d8c20b8ceedbae8aa1dde8e0',
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    validated: true
  },
  {
    chain: 'main',
    count: 7630,
    fileHash: 'R3JNRSzpFPvKXH2myRL+m420ycjrxRTcSI3aiMOJmfo=',
    fileName: 'mainNet_9.headers',
    firstHeight: 900000,
    lastChainWork: '00000000000000000000000000000000000000000167cca3f0721d58e023cf01',
    lastHash: '00000000000000000c119d65afcc66b640e98b839414c7e66d22b428ecb24a43',
    prevChainWork: '000000000000000000000000000000000000000001664db1f2d50327928007e0',
    prevHash: '00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087',
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    validated: true
  },
  {
    chain: 'main',
    count: 15512,
    fileHash: 'sbLY7ZiEWkdvgAbZlWxYJfd/CLxeYPtuwHrc4WZ0aL4=',
    fileName: 'mainNet_9.headers',
    firstHeight: 900000,
    lastChainWork: '00000000000000000000000000000000000000000168d586f9048fd69f17e1ca',
    lastHash: '000000000000000004c5e39626c72e67d669135a7c004ee86f7191e3ed01cdee',
    prevChainWork: '000000000000000000000000000000000000000001664db1f2d50327928007e0',
    prevHash: '00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087',
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders',
    validated: true
  },
  {
    chain: 'main',
    count: 31772,
    fileHash: 'NuVsRUrI5QnjILbYy4LS3A/Udl6PH/m8Y9uVguEsekM=',
    fileName: 'mainNet_9.headers',
    firstHeight: 900000,
    lastChainWork: '0000000000000000000000000000000000000000016ab16bb9b31430588788d3',
    lastHash: '0000000000000000024a2f1caef4b0ffdc1a036b09f9ed7f48b538f619f32ef2',
    prevChainWork: '000000000000000000000000000000000000000001664db1f2d50327928007e0',
    prevHash: '00000000000000000e7dcc27c06ee353bd37260b2e7e664314c204f0324a5087',
    sourceUrl: 'https://cdn.projectbabbage.com/blockheaders'
  }
]
