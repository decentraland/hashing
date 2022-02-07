/// <reference types="node" />

import * as crypto from "crypto"
import * as miltiformats from "multiformats"
import { importer } from "ipfs-unixfs-importer"

/**
 * Calculates a Qm prefixed hash for Decentraland (NOT CIDv0) from a readable stream
 * @public
 */
export async function hashStreamV0(stream: AsyncGenerator<Uint8Array>) {
  const hash = crypto.createHash("sha256")
  for await (const chunk of stream) {
    hash.update(chunk)
  }

  const digest = miltiformats.digest.create(0x12, hash.digest())
  return miltiformats.CID.createV0(digest).toString()
}

/**
 * Calculates a CIDv1 from a readable stream
 * @public
 */
export async function hashStreamV1(content: AsyncGenerator<Uint8Array>) {
  const block = {
    get: (cid: any) => Promise.reject(new Error(`unexpected block API get for ${cid}`)),
    put: () => Promise.reject(new Error("unexpected block API put")),
  } as any

  let lastCid

  for await (const { cid } of importer([{ content }], block, {
    cidVersion: 1,
    onlyHash: true,
    rawLeaves: true,
  })) {
    lastCid = cid
  }

  return `${lastCid}`
}
