import { Account, Provider, RpcProvider } from 'starknet';

/**
 * Configuration required to initialize the core module.
 * This is passed from the consuming application.
 */
export interface CoreConfig {
  contractAddress: string;
  provider: RpcProvider | Provider;
}

/**
 * Represents an abstracted user session, containing the "invisible wallet".
 */
export interface UserSession {
  account: Account;
}

/**
 * Represents the data that can be submitted to the contract.
 */
export interface SubmissionData extends Record<string, any> {}

/**
 * Defines the main public API of the core package.
 */
export interface ICoreAPI {
  generateFingerprint(data: object): string;
  initializeSession(): Promise<UserSession>;
  storeFingerprint(session: UserSession, fingerprint: string): Promise<string>;
  verifyFingerprint(fingerprint: string): Promise<boolean>;
}
