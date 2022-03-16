import { keccak256 } from "ethereum-cryptography/keccak"

/**
 * Calculates the metadata hash. Uses the keys to determine which fields of the metadata object will be used for the result.
 * @public
 */
function keccak256Hash(metadata: any, keys: string[]): string {
  const partialMetadata = JSON.stringify(pick(metadata, keys))
  const data = new TextEncoder().encode(partialMetadata)
  const hash = keccak256(data)
  return new TextDecoder().decode(hash)
}

const pick = (obj: { [x: string]: any }, ...keys: any[]) =>
  Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]))
