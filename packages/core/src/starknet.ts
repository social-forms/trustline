import {
  Account,
  RpcProvider,
  CallData,
  Contract,
  ec,
  hash,
  stark,
  Signature,
  json,
  RawCalldata,
  shortString
} from 'starknet'
import { UserSession, RelayerSession } from './types'

export function initializeUserSession(): UserSession {
  const privateKey = stark.randomAddress()
  const publicKey = ec.starkCurve.getStarkKey(privateKey)
  return { privateKey, publicKey }
}

export function initializeRelayerSession(
  provider: RpcProvider,
  relayerAddress: string,
  relayerPrivateKey: string
): RelayerSession {
  const account = new Account(provider, relayerAddress, relayerPrivateKey)
  return { account }
}

export async function getNonce(
  provider: RpcProvider,
  contractAddress: string,
  userPublicKey: string,
  abi: any
): Promise<string> {
  const contract = new Contract(abi, contractAddress, provider)
  const nonce = await contract.get_nonce(userPublicKey)
  return nonce.toString()
}

export async function signFingerprint(
  provider: RpcProvider,
  userPrivateKey: string,
  fingerprint: string,
  nonce: string,
  userPublicKey: string,
  relayerAddress: string
): Promise<Signature> {
  const chainId = await provider.getChainId()

  // This hashing logic must match the Cairo contract's sequential Pedersen hash.
  const elementsToHash = [
    chainId,
    relayerAddress,
    shortString.encodeShortString('store_fingerprint'),
    userPublicKey,
    fingerprint,
    nonce
  ]

  const messageHash = elementsToHash.reduce((acc, element) => ec.starkCurve.pedersen(acc, element), '0x0')

  return ec.starkCurve.sign(messageHash, userPrivateKey)
}

export async function storeFingerprintRelayed(
  relayerSession: RelayerSession,
  contractAddress: string,
  userPublicKey: string,
  fingerprint: string,
  signature: Signature
): Promise<string> {
  // Convert signature to array format
  const sigArray = Array.isArray(signature) ? signature : [signature.r, signature.s]

  if (!sigArray[0] || !sigArray[1]) {
    throw new Error('Invalid signature format')
  }

  const { transaction_hash } = await relayerSession.account.execute({
    contractAddress,
    entrypoint: 'store_fingerprint_relayed',
    calldata: CallData.compile({
      signer_public_key: userPublicKey,
      fingerprint,
      signature: [sigArray[0].toString(), sigArray[1].toString()]
    })
  })
  return transaction_hash
}

export async function verifyFingerprint(
  provider: RpcProvider,
  contractAddress: string,
  fingerprint: string,
  abi: any
): Promise<boolean> {
  const contract = new Contract(abi, contractAddress, provider)
  const result = await contract.verify_fingerprint(fingerprint)
  return Boolean(result)
}
