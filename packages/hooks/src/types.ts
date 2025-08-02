import { SubmissionData } from '@trustline/core'

export interface UseIntegrityConfig {
  contractAddress?: string
  rpcUrl?: string
  relayerAddress?: string
  relayerPrivateKey?: string
  abi?: any
}

export interface UseIntegrityResponse {
  handleSubmit?: (
    data: SubmissionData
  ) => Promise<{ fingerprint: string; transactionHash: string }>
  verifySubmission?: (
    fingerprint: string
  ) => Promise<{
    isVerified: boolean
  }>
  isInitializing: boolean
}
