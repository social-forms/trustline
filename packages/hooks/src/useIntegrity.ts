'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { UseIntegrityConfig, UseIntegrityResponse } from './types'
import { createCore, ICoreAPI, UserSession, RelayerSession, SubmissionData } from '@trustline/core'
import { RpcProvider } from 'starknet'

export function useIntegrity(config: UseIntegrityConfig): UseIntegrityResponse {
  const { contractAddress, rpcUrl, relayerAddress, relayerPrivateKey, abi } = config

  const core = useMemo<ICoreAPI | null>(() => {
    if (!contractAddress || !rpcUrl || !abi) return null
    const provider = new RpcProvider({ nodeUrl: rpcUrl })
    return createCore({ contractAddress, provider, abi })
  }, [contractAddress, rpcUrl, abi])

  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [relayerSession, setRelayerSession] = useState<RelayerSession | null>(null)

  useEffect(() => {
    if (!core) {
      setUserSession(null)
      setRelayerSession(null)
      return
    }

    let isMounted = true
    const userSession = core.initializeUserSession()
    console.log('🔥 Burner Wallet PublicKey:', userSession.publicKey);
    if (isMounted) {
      setUserSession(userSession)
    }

    if (relayerAddress && relayerPrivateKey) {
      const relayerSession = core.initializeRelayerSession(relayerAddress, relayerPrivateKey)
      if (isMounted) {
        setRelayerSession(relayerSession)
      }
    }

    return () => {
      isMounted = false
    }
  }, [core, relayerAddress, relayerPrivateKey])

  const handleSubmit = useCallback(
    async (data: SubmissionData) => {
      if (!core || !userSession || !relayerSession) {
        throw new Error('handleSubmit was called unexpectedly. The hook is not yet initialized.')
      }
      const fingerprint = core.generateFingerprint(data)
      const transactionHash = await core.storeFingerprint(relayerSession, userSession, fingerprint)
      return {
        fingerprint,
        transactionHash
      }
    },
    [core, userSession, relayerSession]
  )

  const verifySubmission = useCallback(
    async (fingerprint: string) => {
      if (!core) {
        throw new Error('verifySubmission was called unexpectedly. The hook is not yet initialized.')
      }
      const isVerified = await core.verifyFingerprint(fingerprint)
      return {
        isVerified
      }
    },
    [core]
  )

  const isInitializing = !core || !userSession || !relayerSession

  if (isInitializing) {
    return {
      handleSubmit: undefined,
      verifySubmission: undefined,
      isInitializing: true
    }
  }

  return { handleSubmit, verifySubmission, isInitializing: false }
}
