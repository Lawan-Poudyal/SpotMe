import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();

    // Replace "file" with the field name expected by multer
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Upload File</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />

        <button
          type="submit"
          style={{
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </form>

      <h3>Response</h3>

      <pre
        style={{
          background: '#f4f4f4',
          padding: '10px',
          overflowX: 'auto',
        }}
      >
        {response}
      </pre>
    </div>
  );
}
