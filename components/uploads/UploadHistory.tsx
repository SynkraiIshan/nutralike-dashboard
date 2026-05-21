'use client';

import type { UploadHistoryRecord } from '@/types';
import Badge from '@/components/ui/Badge';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Upload,
  FileSpreadsheet,
  FileText,
  FileEdit,
  Image as ImageIcon,
  File,
  Folder,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheet size={16} className="text-[#1a9e4a] flex-shrink-0" />;
    case 'pdf':
      return <FileText size={16} className="text-red-500 flex-shrink-0" />;
    case 'docx':
    case 'doc':
      return <FileEdit size={16} className="text-blue-500 flex-shrink-0" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <ImageIcon size={16} className="text-purple-500 flex-shrink-0" />;
    case 'txt':
      return <File size={16} className="text-gray-500 flex-shrink-0" />;
    default:
      return <Folder size={16} className="text-[#314f2d] flex-shrink-0" />;
  }
};

const UPLOAD_TYPE_LABELS: Record<string, string> = {
  ingredient_file: 'Ingredient file',
  'ingredient-file': 'Ingredient file',
  product_image: 'Product image',
  'product-image': 'Product image',
  product_doc: 'Product doc',
  'product-doc': 'Product doc',
};

function formatUploadType(type: string): string {
  return (
    UPLOAD_TYPE_LABELS[type] ??
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function uploaderLabel(upload: UploadHistoryRecord): string {
  if (upload.uploadedByName?.trim()) return upload.uploadedByName.trim();
  return upload.uploadedByEmail;
}

interface UploadHistoryProps {
  uploads: UploadHistoryRecord[];
  loading?: boolean;
}

export default function UploadHistory({ uploads, loading = false }: UploadHistoryProps) {
  if (loading) {
    return (
      <p className="px-6 py-12 text-sm text-[#555555] text-center">Loading upload history…</p>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center mb-3">
          <Upload size={24} className="text-[#314f2d]" />
        </div>
        <p className="type-h3-18 text-[#0a0a0a]">No upload history yet</p>
        <p className="type-small-body text-[#555555] mt-1 max-w-sm">
          Ingredient file imports from the Ingredients page will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
            {['File', 'Type', 'Upload type', 'Status', 'Uploaded by', 'Date', 'Rows', ''].map(
              (h) => (
                <th
                  key={h || 'action'}
                  className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload, i) => (
            <tr
              key={upload.id}
              className={[
                'border-b border-[#e8ece5] transition-colors',
                i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/60',
                'hover:bg-[#f2f6ef]',
              ].join(' ')}
              title={upload.errorMessage ?? undefined}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  {getFileIcon(upload.fileType)}
                  <span className="font-medium text-[#0a0a0a] truncate max-w-[200px]">
                    {upload.fileName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="uppercase text-[11px] font-bold text-[#555555] bg-[#f2f6ef] px-2 py-0.5 rounded">
                  {upload.fileType}
                </span>
              </td>
              <td className="px-4 py-3 text-[#373737] whitespace-nowrap">
                {formatUploadType(upload.uploadType)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {upload.status === 'processing' && (
                    <Loader2 size={13} className="text-[#ff8800] animate-spin flex-shrink-0" />
                  )}
                  {upload.status === 'completed' && (
                    <CheckCircle2 size={13} className="text-[#25d366] flex-shrink-0" />
                  )}
                  {upload.status === 'failed' && (
                    <XCircle size={13} className="text-red-500 flex-shrink-0" />
                  )}
                  <Badge
                    label={upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                    variant={
                      upload.status === 'completed'
                        ? 'success'
                        : upload.status === 'processing'
                          ? 'warning'
                          : 'danger'
                    }
                  />
                </div>
                {upload.errorMessage ? (
                  <p className="text-[11px] text-red-600 mt-1 max-w-[180px] truncate">
                    {upload.errorMessage}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[#373737]">
                <p className="font-medium text-[#0a0a0a] truncate max-w-[140px]">
                  {uploaderLabel(upload)}
                </p>
                {upload.uploadedByName ? (
                  <p className="text-[11px] text-[#a3a29e] truncate max-w-[140px]">
                    {upload.uploadedByEmail}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[#555555] whitespace-nowrap">
                {formatDate(upload.createdAt)}
              </td>
              <td className="px-4 py-3 text-[#373737] tabular-nums">
                {upload.rowsAffected != null ? (
                  <span className="font-mono">{upload.rowsAffected}</span>
                ) : (
                  <span className="text-[#a3a29e]">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {upload.driveViewLink ? (
                  <a
                    href={upload.driveViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#314f2d] hover:underline font-medium"
                  >
                    View
                    <ExternalLink size={12} />
                  </a>
                ) : upload.status === 'processing' ? (
                  <span className="text-[#a3a29e] text-xs">Processing…</span>
                ) : (
                  <span className="text-[#a3a29e] text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
