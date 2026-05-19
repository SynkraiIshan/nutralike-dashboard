'use client';
import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadZoneProps {
  accept?: string;
  onFileSelect?: (file: File) => void;
  label?: string;
  hint?: string;
  selectedFile?: File | null;
  onClear?: () => void;
}

export default function FileUploadZone({
  accept = '.xlsx,.docx,.pdf,.jpg,.jpeg,.png,.txt',
  onFileSelect,
  label = 'Click to upload or drag & drop',
  hint = 'Supports XLSX, DOCX, PDF, Image, TXT',
  selectedFile,
  onClear,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeFile = selectedFile !== undefined ? selectedFile : internalFile;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setInternalFile(file);
      onFileSelect?.(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInternalFile(file);
      onFileSelect?.(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setInternalFile(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !activeFile && inputRef.current?.click()}
      className={[
        'relative border-2 border-dashed rounded-xl p-8 text-center transition-all',
        !activeFile && 'cursor-pointer',
        isDragging
          ? 'border-[#7c9f43] bg-[#7c9f43]/5'
          : 'border-[#c3c3c3] bg-[#f2f6ef] hover:border-[#314f2d] hover:bg-white',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {activeFile ? (
        <div className="flex items-center justify-center gap-3">
          <File size={20} className="text-[#314f2d] flex-shrink-0" />
          <span className="text-sm font-medium text-[#314f2d] truncate max-w-xs">
            {activeFile.name}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#314f2d]/10 flex items-center justify-center">
            <Upload size={18} className="text-[#314f2d]" />
          </div>
          <p className="text-sm font-medium text-[#0a0a0a]">{label}</p>
          <p className="text-xs text-[#555555]">{hint}</p>
        </div>
      )}
    </div>
  );
}
