import { useState } from 'react';

interface SubmissionFormProps {
  onSubmit: (data: { [key: string]: string | number | boolean }) => void;
}

export function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [data, setData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ data });
    setData('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Enter some data"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
