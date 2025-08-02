import { Account, RpcProvider } from 'starknet'

export interface ICoreAPI {
  initializeUserSession(): UserSession
  initializeRelayerSession(relayerAddress: string, relayerPrivateKey: string): RelayerSession
  generateFingerprint(data: object): string
  storeFingerprint(
    relayerSession: RelayerSession,
    userSession: UserSession,
    fingerprint: string
  ): Promise<string>
  verifyFingerprint(fingerprint: string): Promise<boolean>
}

export type SubmissionData = { [key: string]: string | number | boolean }

export interface CoreConfig {
  contractAddress: string
  provider: RpcProvider
  abi: any
}

export interface UserSession {
  privateKey: string
  publicKey: string
}

export interface RelayerSession {
  account: Account
}
