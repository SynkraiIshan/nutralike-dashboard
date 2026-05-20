'use client';
import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Clock, Eye } from 'lucide-react';

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'info'> = {
  generated: 'success', draft: 'neutral', sent: 'info', archived: 'neutral',
};

const PRICE_HISTORY = [
  { ingredient: 'Whey Protein Concentrate', oldPrice: 820, newPrice: 890, changedBy: 'Kunal Nagani', changedAt: '2024-05-28' },
  { ingredient: 'Spirulina Powder',         oldPrice: 2600, newPrice: 2850, changedBy: 'Priya Desai', changedAt: '2024-05-10' },
  { ingredient: 'Vitamin C (Ascorbic Acid)', oldPrice: 1100, newPrice: 1200, changedBy: 'Kunal Nagani', changedAt: '2024-05-20' },
  { ingredient: 'Stevia Leaf Extract',      oldPrice: 3200, newPrice: 3400, changedBy: 'Kunal Nagani', changedAt: '2024-05-15' },
  { ingredient: 'Ashwagandha Extract (5%)', oldPrice: 1350, newPrice: 1480, changedBy: 'Priya Desai', changedAt: '2024-05-08' },
];

export default function ReportsPage() {
  const [tab, setTab] = useState('history');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const TABS = [
    { id: 'history',   label: 'Quotation History', icon: <FileText size={14} /> },
    { id: 'changes',   label: 'Ingredient Changes', icon: <Clock size={14} /> },
  ];

  const filteredQuotations = MOCK_QUOTATIONS.filter((q) => {
    const ms = q.clientName.toLowerCase().includes(search.toLowerCase()) ||
               q.productName.toLowerCase().includes(search.toLowerCase());
    const mStatus = !statusFilter || q.status === statusFilter;
    const mFrom = !fromDate || q.createdAt >= fromDate;
    const mTo   = !toDate   || q.createdAt <= toDate + 'T23:59:59';
    return ms && mStatus && mFrom && mTo;
  });

  return (
    <div className="flex flex-col gap-4 max-w-5xl">
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {/* QUOTATION HISTORY */}
      {tab === 'history' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by client or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] bg-white text-[#373737] placeholder:text-[#a3a29e] w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg bg-white text-[#373737] focus:outline-none focus:border-[#314f2d]"
            >
              <option value="">All Statuses</option>
              {['draft','generated','sent','archived'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg bg-white text-[#373737] focus:outline-none focus:border-[#314f2d]" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg bg-white text-[#373737] focus:outline-none focus:border-[#314f2d]" />
          </div>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
                    {['#', 'Client', 'Product', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotations.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-[#a3a29e] text-sm">No quotations match your filters.</td></tr>
                  ) : filteredQuotations.map((q, i) => (
                    <tr key={q.id} className={`border-b border-[#e8ece5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]'} hover:bg-[#f2f6ef]`}>
                      <td className="px-4 py-3 font-mono text-[#555555] text-xs uppercase">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-[#0a0a0a]">{q.clientName}</td>
                      <td className="px-4 py-3 text-[#373737] max-w-[180px] truncate">{q.productName}</td>
                      <td className="px-4 py-3 font-mono text-[#0a0a0a]">{formatCurrency(q.totalCost)}</td>
                      <td className="px-4 py-3">
                        <Badge label={q.status.charAt(0).toUpperCase()+q.status.slice(1)} variant={STATUS_VARIANTS[q.status] ?? 'neutral'} />
                      </td>
                      <td className="px-4 py-3 text-[#555555] whitespace-nowrap">{formatDate(q.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/quotations/${q.id}`}>
                          <Button size="sm" variant="secondary" leftIcon={<Eye size={13} />}>
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* INGREDIENT CHANGES */}
      {tab === 'changes' && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#c3c3c3]">
            <h2 className="type-h3-18 text-[#0a0a0a]">Ingredient Price History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
                  {['Ingredient', 'Old Price', 'New Price', 'Change', 'Changed By', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICE_HISTORY.map((row, i) => {
                  const diff = row.newPrice - row.oldPrice;
                  const pct = ((diff / row.oldPrice) * 100).toFixed(1);
                  return (
                    <tr key={i} className={`border-b border-[#e8ece5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]'}`}>
                      <td className="px-4 py-3 font-medium text-[#0a0a0a]">{row.ingredient}</td>
                      <td className="px-4 py-3 font-mono text-[#555555]">₹ {row.oldPrice.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-mono text-[#0a0a0a]">₹ {row.newPrice.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[12px] font-medium ${diff > 0 ? 'text-red-500' : 'text-[#25d366]'}`}>
                          {diff > 0 ? '+' : ''}{pct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#373737]">{row.changedBy}</td>
                      <td className="px-4 py-3 text-[#555555] whitespace-nowrap">{formatDate(row.changedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
