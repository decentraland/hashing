/// <reference types="node" />

import * as crypto from "crypto"
import * as multiformats from "multiformats"
import { importer } from "ipfs-unixfs-importer"


/**
 * Calculates a Qm prefixed hash for Decentraland (NOT CIDv0) from a readable stream
 *
 * @public
 */
export async function hashV0(stream: AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array) {
  const hash = crypto.createHash("sha256")

  if (stream instanceof Uint8Array) {
    hash.update(stream)
  } else if (Symbol.asyncIterator in stream) {
    for await (const chunk of stream) {
      hash.update(chunk)
    }
  } else {
    throw new Error(
      "Invalid value provided to hashStreamV0. Expected AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array"
    )
  }

  return multiformats.CID.createV0(multiformats.digest.create(0x12, hash.digest())).toString()
}

/**
 * Calculates a CIDv1 from a readable stream
 * @public
 */
export async function hashV1(content: AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array) {
  const block = {
    get: (cid: any) => Promise.reject(new Error(`unexpected block API get for ${cid}`)),
    put: () => Promise.reject(new Error("unexpected block API put")),
  } as any

  let lastCid

  async function* wrap() {
    yield content as Uint8Array
  }

  if (content instanceof Uint8Array) {
    for await (const { cid } of importer([{ content: wrap() }], block, {
      cidVersion: 1,
      onlyHash: true,
      rawLeaves: true,
    })) {
      lastCid = cid
    }
  } else if (Symbol.asyncIterator in content) {
    for await (const { cid } of importer([{ content }], block, {
      cidVersion: 1,
      onlyHash: true,
      rawLeaves: true,
    })) {
      lastCid = cid
    }
  } else {
    throw new Error(
      "Invalid value provided to hashStreamV1. Expected AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array"
    )
  }

  return `${lastCid}`
}
