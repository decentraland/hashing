/// <reference types="node" />

import * as crypto from "crypto"
import * as multiformats from "multiformats"
import { sha256 } from "multiformats/hashes/sha2"
import * as dagPb from "@ipld/dag-pb"

/**
 * Calculates a Qm prefixed hash for Decentraland (NOT CIDv0) from a readable stream
 *
 * @public
 * @deprecated use hashV1 instead, this function exists for backwards compatibility reasons.
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
  const cidVersion = 1

  let lastCid
  if (content instanceof Uint8Array) {
    const multihash = await sha256.digest(content)
    lastCid = multiformats.CID.create(cidVersion, dagPb.code, multihash)
  } else if (Symbol.asyncIterator in content) {
    for await (const aContent of content) {
      const multihash = await sha256.digest(aContent)
      const cid = multiformats.CID.create(cidVersion, dagPb.code, multihash)

      lastCid = cid
    }
  } else {
    throw new Error(
      "Invalid value provided to hashStreamV1. Expected AsyncGenerator<Uint8Array> | AsyncIterable<Uint8Array> | Uint8Array"
    )
  }

  return `${lastCid}`
}
