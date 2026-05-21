'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, RefreshCw } from 'lucide-react';
import type { ReportQuotationRecord } from '@/types';
import { fetchReportQuotations } from '@/lib/api/reports';
import { ApiError } from '@/lib/api/errors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import QuotationTable from '@/components/quotations/QuotationTable';
import Pagination from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

const PAGE_LIMIT = 20;

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<ReportQuotationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadQuotations = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const { quotations: rows, pagination } = await fetchReportQuotations({
        page: pageNum,
        limit: PAGE_LIMIT,
      });
      setQuotations(rows);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotal(pagination.total);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load quotations. Please try again.';
      toast.error(msg);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuotations(page);
  }, [page, loadQuotations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quotations;
    return quotations.filter(
      (row) =>
        row.clientName.toLowerCase().includes(q) ||
        row.productName.toLowerCase().includes(q) ||
        row.quotationNumber.toLowerCase().includes(q)
    );
  }, [quotations, search]);

  return (
    <div className="flex flex-col gap-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search quotation #, client, or product…"
            className="w-full sm:flex-1 sm:max-w-md"
          />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={() => void loadQuotations(page)}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
        <Link href="/quotations/new">
          <Button leftIcon={<Plus size={15} />}>Create Quotation</Button>
        </Link>
      </div>

      <p className="text-sm text-[#555555]">
        {loading
          ? 'Loading…'
          : search.trim()
            ? `${filtered.length} of ${total} on this page match your search`
            : `${total} quotation${total !== 1 ? 's' : ''}`}
      </p>

      <Card padding={false}>
        <QuotationTable quotations={filtered} loading={loading} />
        {!loading && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </Card>
    </div>
  );
}
