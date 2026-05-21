'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, FileText, Clock } from 'lucide-react';
import type { ReportIngredientChangeRecord, ReportQuotationRecord } from '@/types';
import { fetchReportIngredientChanges, fetchReportQuotations } from '@/lib/api/reports';
import { ApiError } from '@/lib/api/errors';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import QuotationHistoryTable from '@/components/reports/QuotationHistoryTable';
import IngredientChangesTable from '@/components/reports/IngredientChangesTable';
import toast from 'react-hot-toast';

const PAGE_LIMIT = 20;

const TABS = [
  { id: 'history', label: 'Quotation History', icon: <FileText size={14} /> },
  { id: 'changes', label: 'Ingredient Changes', icon: <Clock size={14} /> },
];

function PaginationBar({
  page,
  totalPages,
  loading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-[#f2f6ef]">
      <p className="text-sm text-[#555555]">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ChevronLeft size={14} />}
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          rightIcon={<ChevronRight size={14} />}
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState('history');

  const [search, setSearch] = useState('');
  const [quotations, setQuotations] = useState<ReportQuotationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);

  const [changesSearch, setChangesSearch] = useState('');
  const [changes, setChanges] = useState<ReportIngredientChangeRecord[]>([]);
  const [changesLoading, setChangesLoading] = useState(false);
  const [changesPage, setChangesPage] = useState(1);
  const [changesTotalPages, setChangesTotalPages] = useState(1);
  const [changesTotal, setChangesTotal] = useState(0);

  const loadQuotations = useCallback(async (pageNum: number) => {
    setHistoryLoading(true);
    try {
      const { quotations: rows, pagination } = await fetchReportQuotations({
        page: pageNum,
        limit: PAGE_LIMIT,
      });
      setQuotations(rows);
      setHistoryPage(pagination.page);
      setHistoryTotalPages(pagination.totalPages);
      setHistoryTotal(pagination.total);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load quotation history. Please try again.';
      toast.error(msg);
      setQuotations([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const loadIngredientChanges = useCallback(async (pageNum: number) => {
    setChangesLoading(true);
    try {
      const { changes: rows, pagination } = await fetchReportIngredientChanges({
        page: pageNum,
        limit: PAGE_LIMIT,
      });
      setChanges(rows);
      setChangesPage(pagination.page);
      setChangesTotalPages(pagination.totalPages);
      setChangesTotal(pagination.total);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load ingredient changes. Please try again.';
      toast.error(msg);
      setChanges([]);
    } finally {
      setChangesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab !== 'history') return;
    void loadQuotations(historyPage);
  }, [tab, historyPage, loadQuotations]);

  useEffect(() => {
    if (tab !== 'changes') return;
    void loadIngredientChanges(changesPage);
  }, [tab, changesPage, loadIngredientChanges]);

  const filteredQuotations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quotations;
    return quotations.filter(
      (row) =>
        row.clientName.toLowerCase().includes(q) ||
        row.productName.toLowerCase().includes(q) ||
        row.quotationNumber.toLowerCase().includes(q)
    );
  }, [quotations, search]);

  const filteredChanges = useMemo(() => {
    const q = changesSearch.trim().toLowerCase();
    if (!q) return changes;
    return changes.filter(
      (row) =>
        row.ingredientName.toLowerCase().includes(q) ||
        row.changedByEmail.toLowerCase().includes(q) ||
        (row.changedByName?.toLowerCase().includes(q) ?? false) ||
        row.changeType.toLowerCase().includes(q)
    );
  }, [changes, changesSearch]);

  return (
    <div className="flex flex-col gap-4 max-w-6xl">
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === 'history' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search quotation #, client, or product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] bg-white text-[#373737] placeholder:text-[#a3a29e] w-full sm:flex-1 sm:max-w-md"
            />
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={() => void loadQuotations(historyPage)}
              loading={historyLoading}
            >
              Refresh
            </Button>
            <p className="text-sm text-[#555555] sm:ml-auto">
              {historyLoading
                ? 'Loading…'
                : `${historyTotal} quotation${historyTotal !== 1 ? 's' : ''}`}
            </p>
          </div>

          <Card padding={false}>
            <QuotationHistoryTable quotations={filteredQuotations} loading={historyLoading} />
            <PaginationBar
              page={historyPage}
              totalPages={historyTotalPages}
              loading={historyLoading}
              onPageChange={setHistoryPage}
            />
          </Card>
        </div>
      )}

      {tab === 'changes' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search ingredient, user, or change type…"
              value={changesSearch}
              onChange={(e) => setChangesSearch(e.target.value)}
              className="px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] bg-white text-[#373737] placeholder:text-[#a3a29e] w-full sm:flex-1 sm:max-w-md"
            />
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={() => void loadIngredientChanges(changesPage)}
              loading={changesLoading}
            >
              Refresh
            </Button>
            <p className="text-sm text-[#555555] sm:ml-auto">
              {changesLoading
                ? 'Loading…'
                : `${changesTotal} change${changesTotal !== 1 ? 's' : ''}`}
            </p>
          </div>

          <Card padding={false}>
            <div className="px-5 py-4 border-b border-[#c3c3c3] sm:hidden">
              <h2 className="type-h3-18 text-[#0a0a0a]">Ingredient price history</h2>
            </div>
            <IngredientChangesTable changes={filteredChanges} loading={changesLoading} />
            <PaginationBar
              page={changesPage}
              totalPages={changesTotalPages}
              loading={changesLoading}
              onPageChange={setChangesPage}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
