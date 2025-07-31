import { poseidonHashMany } from '@scure/starknet'
import { shortString } from 'starknet'

/**
 * Generates a deterministic, Starknet-compatible fingerprint from any JSON object.
 * @param data The form data or any JSON object.
 * @returns A felt252 hash as a string.
 */
export function generateFingerprint(data: object): string {
  // 1. Deterministically stringify the object. Keys are sorted to ensure consistency.
  const stableString = JSON.stringify(data, Object.keys(data).sort())

  // 2. Convert the string to an array of felts.
  const felts = shortString.splitLongString(stableString)

  // 3. Encode each felt chunk into a hex string before converting to BigInt.
  const encodedFelts = felts.map((felt) => shortString.encodeShortString(felt))

  // 4. Hash the felts using Poseidon.
  const hashed = poseidonHashMany(encodedFelts.map((f) => BigInt(f)))

  return '0x' + hashed.toString(16)
}
