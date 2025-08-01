import { Account, RpcProvider, CallData, Contract, ec, hash, stark } from 'starknet'
import { UserSession } from './types'
import { abi } from './abi'

/**
 * Creates and deploys a new burner account on the local devnet.
 * This function is designed for local development and testing purposes.
 * @param provider An RPC provider instance.
 * @returns A fully deployed and funded Account object.
 */
async function createBurnerAccount(provider: RpcProvider): Promise<Account> {
  const privateKey = stark.randomAddress()
  const publicKey = ec.starkCurve.getStarkKey(privateKey)
  // This is a Cairo 1 account class hash, compatible with V3 transactions.
  const accountClassHash = '0x05b4b537eaa2399e3aa99c4e2e0208ebd6c71bc1467938cd52c798c601e43564'

  const address = hash.calculateContractAddressFromHash(
    publicKey,
    accountClassHash,
    CallData.compile({ publicKey }),
    0
  )

  // Fund the account with 0.01 STRK. This amount is small enough to be a safe
  // JavaScript number, but more than enough to cover deployment fees.
  await fetch('http://127.0.0.1:5050/mint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      amount: 10000000000000000, // 0.01 STRK
      unit: 'FRI'
    })
  })

  const account = new Account(provider, address, privateKey, '1')

  await account.deployAccount({
    classHash: accountClassHash,
    constructorCalldata: CallData.compile({ publicKey }),
    addressSalt: publicKey
  })

  return account
}

/**
 * Initializes a user session by creating a new, temporary burner wallet.
 */
export async function initializeSession(provider: RpcProvider): Promise<UserSession> {
  const account = await createBurnerAccount(provider)
  return { account }
}

/**
 * Calls the `store_fingerprint` function on the smart contract.
 */
export async function storeFingerprint(
  session: UserSession,
  contractAddress: string,
  fingerprint: string
): Promise<string> {
  const { transaction_hash } = await session.account.execute({
    contractAddress,
    entrypoint: 'store_fingerprint',
    calldata: CallData.compile({ fingerprint })
  })
  return transaction_hash
}

/**
 * Calls the `verify_fingerprint` view function on the smart contract.
 */
export async function verifyFingerprint(
  provider: RpcProvider,
  contractAddress: string,
  fingerprint: string
): Promise<boolean> {
  const contract = new Contract(abi, contractAddress, provider)
  const result = await contract.verify_fingerprint(fingerprint)
  return Boolean(result)
}
