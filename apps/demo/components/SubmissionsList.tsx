export interface Submission {
  id: number
  data: { [key: string]: number | string | boolean }
  fingerprint: string
}

interface SubmissionsListProps {
  submissions: Submission[]
  onVerify: (fingerprint: string) => void
}

export function SubmissionsList({ submissions, onVerify }: SubmissionsListProps) {
  return (
    <ul>
      {submissions.map((submission) => (
        <li key={submission.id}>
          <p>Data: {JSON.stringify(submission.data)}</p>
          <p>Fingerprint: {submission.fingerprint}</p>
          <button onClick={() => onVerify(submission.fingerprint)}>Verify</button>
        </li>
      ))}
    </ul>
  )
}
