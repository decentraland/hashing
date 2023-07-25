/// <reference types="node" />

import crypto from 'crypto'
import { create } from 'multiformats/hashes/digest'
import { CID } from 'multiformats/cid'
import { importer } from 'ipfs-unixfs-importer'
import { MemoryBlockstore } from 'blockstore-core'

/**
 * Calculates a Qm prefixed hash for Decentraland (NOT CIDv0) from a readable stream
 *
 * @public
 * @deprecated use hashV1 instead, this function exists for backwards compatibility reasons.
 */
export async function hashV0(stream: AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array) {
  const hash = crypto.createHash('sha256')

  if (stream instanceof Uint8Array) {
    hash.update(stream)
  } else if (Symbol.asyncIterator in stream) {
    for await (const chunk of stream) {
      hash.update(chunk)
    }
  } else {
    throw new Error(
      'Invalid value provided to hashStreamV0. Expected AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array'
    )
  }

  return CID.createV0(create(0x12, hash.digest())).toString()
}

/**
 * Calculates a CIDv1 from a readable stream
 * @public
 */
export async function hashV1(content: AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array) {
  const blockstore = new MemoryBlockstore()

  let lastCid

  async function* wrap() {
    yield content as Uint8Array
  }

  if (content instanceof Uint8Array) {
    for await (const { cid } of importer([{ content: wrap() }], blockstore, {
      cidVersion: 1,
      rawLeaves: true
    })) {
      lastCid = cid
    }
  } else if (Symbol.asyncIterator in content) {
    for await (const { cid } of importer([{ content }], blockstore, {
      cidVersion: 1,
      rawLeaves: true
    })) {
      lastCid = cid
    }
  } else {
    throw new Error(
      'Invalid value provided to hashStreamV1. Expected AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array'
    )
  }

  return `${lastCid}`
}
