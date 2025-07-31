import { SubmissionData } from '@trustline/core'

/**
 * Configuration object for the useIntegrity hook.
 * @property contractAddress - The address of the smart contract to interact with.
 * @property rpcUrl - The RPC URL of the Starknet node.
 */
export interface UseIntegrityConfig {
  contractAddress: string
  rpcUrl: string
}

/**
 * The response returned by the handleSubmit function.
 * @property fingerprint - The generated fingerprint for the submitted data.
 * @property transactionHash - The transaction hash of the on-chain submission.
 */
export interface HandleSubmitResponse {
  fingerprint: string
  transactionHash: string
}

/**
 * The response returned by the verifySubmission function.
 * @property isVerified - Indicates whether the fingerprint exists on-chain.
 */
export interface VerifySubmissionResponse {
  isVerified: boolean
}

/**
 * Represents the loading state of the useIntegrity hook.
 * While initializing, handleSubmit and verifySubmission are not available.
 */
export interface LoadingState {
  isInitializing: true
  handleSubmit: undefined
  verifySubmission: undefined
}

/**
 * Represents the loaded state of the useIntegrity hook.
 * @property isInitializing - Indicates that initialization is complete.
 * @property handleSubmit - Function to submit data and store its fingerprint on-chain.
 * @property verifySubmission - Function to verify if a fingerprint exists on-chain.
 */
export interface LoadedState {
  isInitializing: false
  handleSubmit: (data: SubmissionData) => Promise<HandleSubmitResponse>
  verifySubmission: (fingerprint: string) => Promise<VerifySubmissionResponse>
}

/**
 * The return type of the useIntegrity hook.
 * It is either in a loading state or a loaded state.
 */
export type UseIntegrityResponse = LoadingState | LoadedState
