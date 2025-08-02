'use client'

import { useState } from 'react'
import { SubmissionForm } from './SubmissionForm'
import { Submission, SubmissionsList } from './SubmissionsList'
import { useIntegrity, UseIntegrityConfig } from '@trustline/hooks'

export default function IntegrityClient(props: UseIntegrityConfig) {
  const [submissions, setSubmissions] = useState<Array<Submission>>([])

  const { handleSubmit, verifySubmission, isInitializing } = useIntegrity(props)

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Initializing User Session...</div>
      </div>
    )
  }

  const onSubmit = async (data: { [key: string]: number | string | boolean }) => {
    if (!handleSubmit) {
      return
    }
    try {
      const { fingerprint, transactionHash } = await handleSubmit(data)
      console.log('✅ Transaction Sent! Hash:', transactionHash);
      const submission = { id: Date.now(), data, fingerprint, transactionHash }
      setSubmissions([...submissions, submission])
    } catch (error) {
      console.error(error)
      alert('An error occurred while submitting the transaction. Please check the console for more details.')
    }
  }

  const onVerify = async (fingerprint: string) => {
    if (!verifySubmission) {
      return
    }
    try {
      const { isVerified } = await verifySubmission(fingerprint)
      alert(isVerified ? 'Verified' : 'Not Verified')
    } catch (error) {
      console.error(error)
      alert('An error occurred while verifying the submission. Please check the console for more details.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">On-Chain Data Integrity</h1>
      </header>
      <main className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-center">Submit New Data</h2>
          <SubmissionForm onSubmit={onSubmit} />
        </section>
        <hr className="my-8 border-t border-gray-200 md:hidden" />
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-center">Submission History</h2>
          <SubmissionsList submissions={submissions} onVerify={onVerify} />
        </section>
      </main>
    </div>
  )
}
