import {
  generateFingerprint as generateFingerprintInternal
} from './fingerprint';
import {
  initializeUserSession as initializeUserSessionInternal,
  initializeRelayerSession as initializeRelayerSessionInternal,
  storeFingerprintRelayed,
  verifyFingerprint as verifyFingerprintInternal,
  getNonce,
  signFingerprint,
} from './starknet';
import {
  CoreConfig,
  ICoreAPI,
  RelayerSession,
  UserSession,
} from './types';
import { RpcProvider } from 'starknet';

export * from './types';

class Core implements ICoreAPI {
  private contractAddress: string;
  private provider: RpcProvider;
  private abi: any;

  constructor(config: CoreConfig) {
    this.contractAddress = config.contractAddress;
    this.provider = config.provider;
    this.abi = config.abi;
  }

  public initializeUserSession(): UserSession {
    return initializeUserSessionInternal();
  }

  public initializeRelayerSession(
    relayerAddress: string,
    relayerPrivateKey: string
  ): RelayerSession {
    return initializeRelayerSessionInternal(
      this.provider,
      relayerAddress,
      relayerPrivateKey
    );
  }

  public generateFingerprint(data: object): string {
    return generateFingerprintInternal(data);
  }

  public async storeFingerprint(
    relayerSession: RelayerSession,
    userSession: UserSession,
    fingerprint: string
  ): Promise<string> {
    const nonce = await getNonce(
      this.provider,
      this.contractAddress,
      userSession.publicKey,
      this.abi
    );
    const signature = await signFingerprint(
      this.provider,
      userSession.privateKey,
      fingerprint,
      nonce,
      userSession.publicKey,
      relayerSession.account.address
    );

    return storeFingerprintRelayed(
      relayerSession,
      this.contractAddress,
      userSession.publicKey,
      fingerprint,
      signature
    );
  }

  public async verifyFingerprint(fingerprint: string): Promise<boolean> {
    return verifyFingerprintInternal(
      this.provider,
      this.contractAddress,
      fingerprint,
      this.abi
    );
  }
}

export function createCore(config: CoreConfig): ICoreAPI {
  return new Core(config);
}
