'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { UseIntegrityConfig, UseIntegrityResponse } from './types'
import {
  createCore,
  ICoreAPI,
  UserSession,
  SubmissionData,
  RpcProvider
} from '@trustline/core'

export function useIntegrity(
  config: UseIntegrityConfig
): UseIntegrityResponse {
  const { contractAddress, rpcUrl } = config

  const core = useMemo<ICoreAPI | null>(() => {
    if (!contractAddress || !rpcUrl) return null
    const provider = new RpcProvider({ nodeUrl: rpcUrl })
    return createCore({ contractAddress, provider })
  }, [contractAddress, rpcUrl])

  const [session, setSession] = useState<UserSession | null>(null)

  useEffect(() => {
    if (!core) {
      setSession(null)
      return
    }

    let isMounted = true
    core
      .initializeSession()
      .then((newSession) => {
        if (isMounted) {
          setSession(newSession)
        }
      })
      .catch((error) => {
        console.error('Failed to initialize session:', error)
        if (isMounted) {
          setSession(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [core])

  const handleSubmit = useCallback(
    async (data: SubmissionData) => {
      if (!core || !session) {
        throw new Error(
          'handleSubmit was called unexpectedly. The hook is not yet initialized.'
        )
      }
      const fingerprint = core.generateFingerprint(data)
      const transactionHash = await core.storeFingerprint(session, fingerprint)
      return {
        fingerprint,
        transactionHash
      }
    },
    [core, session]
  )

  const verifySubmission = useCallback(
    async (fingerprint: string) => {
      if (!core) {
        throw new Error(
          'verifySubmission was called unexpectedly. The hook is not yet initialized.'
        )
      }
      const isVerified = await core.verifyFingerprint(fingerprint)
      return {
        isVerified
      }
    },
    [core]
  )

  const isInitializing = !core || !session

  if (isInitializing) {
    return {
      handleSubmit: undefined,
      verifySubmission: undefined,
      isInitializing: true
    }
  }

  return { handleSubmit, verifySubmission, isInitializing: false }
}
