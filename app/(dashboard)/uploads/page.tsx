'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { UploadHistoryRecord } from '@/types';
import { fetchUploadHistory } from '@/lib/api/uploads';
import { ApiError } from '@/lib/api/errors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UploadHistory from '@/components/uploads/UploadHistory';
import toast from 'react-hot-toast';

const PAGE_LIMIT = 20;

export default function UploadsPage() {
  const [uploads, setUploads] = useState<UploadHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadHistory = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const { uploads: rows, pagination } = await fetchUploadHistory({
        page: pageNum,
        limit: PAGE_LIMIT,
      });
      setUploads(rows);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotal(pagination.total);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load upload history. Please try again.';
      toast.error(msg);
      setUploads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory(page);
  }, [page, loadHistory]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <Card padding={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-[#c3c3c3]">
          <div>
            <h2 className="type-h3-18 text-[#0a0a0a]">Upload History</h2>
            <p className="text-sm text-[#555555] mt-0.5">
              {loading ? 'Loading…' : `${total} upload${total !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={() => void loadHistory(page)}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <UploadHistory uploads={uploads} loading={loading} />

        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#f2f6ef]">
            <p className="text-sm text-[#555555]">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ChevronLeft size={14} />}
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ChevronRight size={14} />}
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
