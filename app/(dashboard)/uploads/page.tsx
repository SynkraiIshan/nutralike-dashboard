'use client';
import { useState } from 'react';
import { Upload } from '@/types';
import { MOCK_UPLOADS } from '@/lib/mock-data/uploads';
import Card from '@/components/ui/Card';
import UploadHistory from '@/components/uploads/UploadHistory';

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Upload[]>(MOCK_UPLOADS);

  const handleRetry = (id: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'processing' } : u))
    );
    setTimeout(() => {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'completed' } : u))
      );
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-[#c3c3c3]">
          <h2 className="type-h3-18 text-[#0a0a0a]">Upload History</h2>
          <p className="text-sm text-[#555555] mt-0.5">{uploads.length} uploads total</p>
        </div>
        <UploadHistory uploads={uploads} onRetry={handleRetry} />
      </Card>
    </div>
  );
}
