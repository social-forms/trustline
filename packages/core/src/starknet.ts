import { Account, RpcProvider, CallData, Contract } from 'starknet';
import { UserSession } from './types';
import { abi } from './abi';

/**
 * Initializes a user session.
 * For this implementation, it creates a new random burner wallet.
 */
export async function initializeSession(provider: RpcProvider): Promise<UserSession> {
  const privateKey = '0x' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex');
  // This uses a pre-funded devnet account address for demo purposes.
  // In a real application, this account would need to be funded.
  const address = "0x35b35af6150413cd9ed8bc36f2c2aa627edcb528b4d1c60b2b106c092123575";
  const account = new Account(provider, address, privateKey);

  return { account };
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
    calldata: CallData.compile({ fingerprint }),
  });
  return transaction_hash;
}

/**
 * Calls the `verify_fingerprint` view function on the smart contract.
 */
export async function verifyFingerprint(
  provider: RpcProvider,
  contractAddress: string,
  fingerprint: string
): Promise<boolean> {
  const contract = new Contract(abi, contractAddress, provider);
  const result = await contract.verify_fingerprint(fingerprint);
  return Boolean(result);
}
