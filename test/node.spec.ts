import { hashV1, hashV0 } from '../src/node.js'
import * as fs from 'fs'

async function assertHash(filename: string, hash: string) {
  if (hash.startsWith('Qm')) {
    const file = fs.createReadStream(filename)
    try {
      const qmHash = await hashV0(file as any)
      if (qmHash != hash) {
        throw new Error(`hashes do not match(expected:${hash} != calculated:${qmHash}) for file ${filename}`)
      }
    } finally {
      file.close()
    }
  } else if (hash.startsWith('ba')) {
    const file = fs.createReadStream(filename)
    try {
      const baHash = await hashV1(file as any)
      if (baHash != hash) {
        throw new Error(`hashes do not match(expected:${hash} != calculated:${baHash}) for file ${filename}`)
      }
    } finally {
      file.close()
    }
  } else {
    throw new Error(`Unknown hashing algorithm for hash: ${hash}`)
  }
}

describe('hashing checks', () => {
  it('checks bafy', async () => {
    await assertHash(
      'test/fixtures/hashes/bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy',
      'bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy'
    )
  })

  it('checks Qm', async () => {
    await assertHash(
      'test/fixtures/hashes/QmSYpJEQLQc82USvtavzxEiBR57nyb5RdMzecBTR3Qg6qn',
      'QmSYpJEQLQc82USvtavzxEiBR57nyb5RdMzecBTR3Qg6qn'
    )
  })

  it('checks Qm failure', async () => {
    await expect(
      assertHash(
        'test/fixtures/hashes/QmSYpJEQLQc82USvtavzxEiBR57nyb5RdMzecBTR3Qg6qn',
        'QmSYpJEQLQc82USvtavzxEiBR57nyb5RdMzecBTR3QgAAA'
      )
    ).rejects.toThrow()
  })

  it('checks bafy failure', async () => {
    await expect(
      assertHash(
        'test/fixtures/hashes/bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy',
        'bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5aAAA'
      )
    ).rejects.toThrow()
  })

  it('v1 hashes the file correctly (buffer)', async () => {
    expect(
      await hashV1(fs.readFileSync('test/fixtures/hashes/bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy'))
    ).toEqual('bafybeibdik2ihfpcdi7aaaguptwcoc5msav7uhn5hu54xlq2pdwkh5arzy')
  })

  it('v0 hashes the file correctly (buffer)', async () => {
    expect(
      await hashV0(fs.readFileSync('test/fixtures/hashes/QmSYpJEQLQc82USvtavzxEiBR57nyb5RdMzecBTR3Qg6qn'))
    ).toEqual('QmSYpJEQLQc82USvtavzxEiBR57nyb5RdMzecBTR3Qg6qn')
  })
})
