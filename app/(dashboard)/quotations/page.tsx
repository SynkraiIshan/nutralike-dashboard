'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Quotation, QuotationStatus } from '@/types';
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import Select from '@/components/ui/Select';
import QuotationTable from '@/components/quotations/QuotationTable';
import Pagination from '@/components/ui/Pagination';

const STATUS_OPTIONS = [
  { value: '',          label: 'All Statuses' },
  { value: 'draft',     label: 'Draft' },
  { value: 'generated', label: 'Generated' },
  { value: 'sent',      label: 'Sent' },
  { value: 'archived',  label: 'Archived' },
];

const PAGE_SIZE = 8;

export default function QuotationsPage() {
  const [quotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = quotations.filter((q) => {
    const matchSearch =
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || q.status === status;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search quotations..."
            className="w-full sm:w-60"
          />
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-36"
          />
        </div>
        <Link href="/quotations/new">
          <Button leftIcon={<Plus size={15} />}>Create Quotation</Button>
        </Link>
      </div>

      <div className="text-sm text-[#555555]">
        {filtered.length} quotation{filtered.length !== 1 ? 's' : ''} found
      </div>

      <Card padding={false}>
        <QuotationTable quotations={paginated} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
