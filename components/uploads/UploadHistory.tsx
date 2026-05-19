'use client';
import { Upload as UploadType } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Upload } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const FILE_ICONS: Record<string, string> = {
  xlsx: '📊', pdf: '📄', docx: '📝', jpg: '🖼️', png: '🖼️', txt: '📃',
};

const TYPE_LABELS: Record<string, string> = {
  'ingredient-file': 'Ingredient File',
  'product-image': 'Product Image',
  'product-doc': 'Product Doc',
};

interface UploadHistoryProps {
  uploads: UploadType[];
  onRetry?: (id: string) => void;
}

export default function UploadHistory({ uploads, onRetry }: UploadHistoryProps) {
  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center mb-3">
          <Upload size={24} className="text-[#314f2d]" />
        </div>
        <p className="type-h3-18 text-[#0a0a0a]">No uploads yet</p>
        <p className="type-small-body text-[#555555] mt-1">Upload a file above to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
            {['File', 'Type', 'Upload Type', 'Status', 'Date', 'Rows', 'Action'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload, i) => (
            <tr
              key={upload.id}
              className={[
                'border-b border-[#e8ece5] transition-all duration-100',
                i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]',
                'hover:bg-[#f2f6ef]',
              ].join(' ')}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{FILE_ICONS[upload.fileType] ?? '📁'}</span>
                  <span className="font-medium text-[#0a0a0a] truncate max-w-[160px]">
                    {upload.fileName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="uppercase text-[11px] font-bold text-[#555555] bg-[#f2f6ef] px-2 py-0.5 rounded">
                  {upload.fileType}
                </span>
              </td>
              <td className="px-4 py-3 text-[#373737]">{TYPE_LABELS[upload.uploadType]}</td>
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
              </td>
              <td className="px-4 py-3 text-[#555555] whitespace-nowrap">
                {formatDate(upload.uploadedAt)}
              </td>
              <td className="px-4 py-3 text-[#373737]">
                {upload.processedRows != null ? (
                  <span className="font-mono">{upload.processedRows} rows</span>
                ) : (
                  <span className="text-[#a3a29e]">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                {upload.status === 'failed' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<RefreshCw size={12} />}
                    onClick={() => {
                      onRetry?.(upload.id);
                      toast.success('Retry queued: ' + upload.fileName);
                    }}
                  >
                    Retry
                  </Button>
                ) : upload.status === 'completed' ? (
                  <button
                    onClick={() => toast.success('Opening ' + upload.fileName)}
                    className="text-xs text-[#314f2d] hover:underline font-medium"
                  >
                    View
                  </button>
                ) : (
                  <span className="text-[#a3a29e] text-xs">Processing…</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
