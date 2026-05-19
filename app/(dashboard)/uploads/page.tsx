'use client';
import { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { Upload, UploadType } from '@/types';
import { MOCK_UPLOADS } from '@/lib/mock-data/uploads';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FileUploadZone from '@/components/ui/FileUploadZone';
import Select from '@/components/ui/Select';
import UploadHistory from '@/components/uploads/UploadHistory';
import toast from 'react-hot-toast';

const UPLOAD_TYPE_OPTIONS = [
  { value: 'ingredient-file', label: 'Ingredient File' },
  { value: 'product-image',   label: 'Product Image' },
  { value: 'product-doc',     label: 'Product Document' },
];

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Upload[]>(MOCK_UPLOADS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<UploadType>('ingredient-file');
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      const ext = selectedFile.name.split('.').pop() ?? 'txt';
      const newUpload: Upload = {
        id: `u-${Date.now()}`,
        fileName: selectedFile.name,
        fileType: ext,
        uploadType,
        status: 'processing',
        uploadedAt: new Date().toISOString(),
      };
      setUploads((prev) => [newUpload, ...prev]);
      setSelectedFile(null);
      setUploading(false);
      toast.success(`"${selectedFile.name}" uploaded and queued for processing`);

      // Auto complete after delay
      setTimeout(() => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === newUpload.id
              ? { ...u, status: 'completed', processedRows: uploadType === 'ingredient-file' ? Math.floor(Math.random() * 20) + 5 : undefined }
              : u
          )
        );
      }, 3000);
    }, 1000);
  };

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
      {/* Upload zone */}
      <Card>
        <h2 className="type-h3-18 text-[#0a0a0a] mb-4">Upload a File</h2>
        <FileUploadZone
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onClear={() => setSelectedFile(null)}
          label="Click to upload or drag & drop"
          hint="Supports XLSX, DOCX, PDF, JPG, PNG, TXT"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
          <Select
            options={UPLOAD_TYPE_OPTIONS}
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as UploadType)}
            className="w-full sm:w-52"
          />
          <Button
            leftIcon={<UploadIcon size={15} />}
            onClick={handleUpload}
            loading={uploading}
            disabled={!selectedFile}
          >
            Upload File
          </Button>
        </div>
      </Card>

      {/* History */}
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
