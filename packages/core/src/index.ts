import { generateFingerprint as generate } from './fingerprint'
import { initializeSession as init, storeFingerprint as store, verifyFingerprint as verify } from './starknet'
import { CoreConfig, ICoreAPI, UserSession } from './types'
import { RpcProvider } from 'starknet'

/**
 * Factory function to create an instance of the Core API.
 * @param config The configuration object with provider and contract address.
 * @returns An object conforming to the ICoreAPI interface.
 */
export function createCore(config: CoreConfig): ICoreAPI {
  return {
    generateFingerprint: (data: object) => generate(data),

    initializeSession: () => init(config.provider as RpcProvider),

    storeFingerprint: (session: UserSession, fingerprint: string) =>
      store(session, config.contractAddress, fingerprint),

    verifyFingerprint: (fingerprint: string) =>
      verify(config.provider as RpcProvider, config.contractAddress, fingerprint)
  }
}

export * from './types'
export { RpcProvider } from 'starknet'