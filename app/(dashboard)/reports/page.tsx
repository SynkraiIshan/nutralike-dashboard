'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import { MOCK_INGREDIENTS } from '@/lib/mock-data/ingredients';
import { MOCK_UPLOADS } from '@/lib/mock-data/uploads';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BarChart2, FileText, Clock, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'info'> = {
  generated: 'success', draft: 'neutral', sent: 'info', archived: 'neutral',
};

const TOP_INGREDIENTS = [
  { name: 'Whey Protein Concentrate', count: 12 },
  { name: 'Maltodextrin',             count: 9  },
  { name: 'Sugar',                    count: 7  },
  { name: 'Stevia Leaf Extract',      count: 5  },
  { name: 'Milk Powder',              count: 4  },
];

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
    { id: 'summary',   label: 'Usage Summary',      icon: <BarChart2 size={14} /> },
  ];

  const filteredQuotations = MOCK_QUOTATIONS.filter((q) => {
    const ms = q.clientName.toLowerCase().includes(search.toLowerCase()) ||
               q.productName.toLowerCase().includes(search.toLowerCase());
    const mStatus = !statusFilter || q.status === statusFilter;
    const mFrom = !fromDate || q.createdAt >= fromDate;
    const mTo   = !toDate   || q.createdAt <= toDate + 'T23:59:59';
    return ms && mStatus && mFrom && mTo;
  });

  const completedUploads = MOCK_UPLOADS.filter((u) => u.status === 'completed').length;

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
            <Button variant="secondary" leftIcon={<Download size={14} />}
              onClick={() => toast.success('Exporting quotations to Excel...')}>
              Export
            </Button>
          </div>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
                    {['#', 'Client', 'Product', 'Total', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotations.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-[#a3a29e] text-sm">No quotations match your filters.</td></tr>
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

      {/* USAGE SUMMARY */}
      {tab === 'summary' && (
        <div className="flex flex-col gap-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Quotations',     value: MOCK_QUOTATIONS.length },
              { label: 'Total Ingredients',    value: MOCK_INGREDIENTS.length },
              { label: 'Uploads This Month',   value: completedUploads },
              { label: 'Most Quoted Product',  value: '-' },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-[#314f2d]">{stat.value}</p>
                <p className="text-xs text-[#555555] mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Most quoted */}
          <Card>
            <p className="text-sm font-medium text-[#555555] mb-1">Most Quoted Product (All Time)</p>
            <p className="type-h3-18 text-[#0a0a0a]">Whey Protein Blend - 12 times</p>
          </Card>

          {/* CSS Bar chart */}
          <Card>
            <h2 className="type-h3-18 text-[#0a0a0a] mb-5">Top 5 Most Used Ingredients</h2>
            <div className="space-y-3">
              {TOP_INGREDIENTS.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-44 text-sm text-[#555555] text-right flex-shrink-0">{item.name}</span>
                  <div className="flex-1 bg-[#f2f6ef] rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(item.count / TOP_INGREDIENTS[0].count) * 100}%`,
                        background: 'linear-gradient(90deg, #7c9f43, #597a3e)',
                      }}
                    />
                  </div>
                  <span className="w-6 text-sm font-semibold text-[#314f2d] flex-shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
