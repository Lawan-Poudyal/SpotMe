import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { fileUploads } from './api/fileUpload';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const eventId = '83e08a6a-7c12-451c-b341-266940e5ee39';

  const uploadSignatureMutation = useMutation({
    mutationFn: () => fileUploads.signRequest(eventId),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }
    const data = await uploadSignatureMutation.mutateAsync();
    console.log('Upload signature response:', data);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.apiKey);
    formData.append('timestamp', data.timestamp.toString());
    formData.append('signature', data.signature);
    formData.append('folder', data.folder);

    const uploadReponse = await fileUploads.uploadFile(formData, data.cloudName);
    console.log('Upload response:', uploadReponse);
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
      ></pre>
    </div>
  );
}
