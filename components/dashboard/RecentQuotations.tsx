'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Quotation } from '@/types';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'info' | 'warning' | 'danger'> = {
  generated: 'success',
  draft:     'neutral',
  sent:      'info',
  archived:  'neutral',
};

interface RecentQuotationsProps {
  quotations: Quotation[];
}

export default function RecentQuotations({ quotations }: RecentQuotationsProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="type-h3-18 text-[#0a0a0a]">Recent Quotations</h2>
        <Link href="/quotations" className="text-xs text-[#314f2d] hover:underline font-medium">View all →</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c3c3c3]">
              {['#', 'Client', 'Product', 'Total', 'Status', 'Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, i) => (
              <tr
                key={q.id}
                onClick={() => router.push(`/quotations/${q.id}`)}
                className={[
                  'group border-b border-l-4 border-l-transparent border-[#f2f6ef] transition-all cursor-pointer select-none',
                  i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]',
                  'hover:bg-[#7c9f43]/5 hover:border-l-[#314f2d]',
                ].join(' ')}
              >
                <td className="px-4 py-3 text-[#555555] font-mono text-xs">{q.id.toUpperCase()}</td>
                <td className="px-4 py-3 font-medium text-[#0a0a0a] whitespace-nowrap">{q.clientName}</td>
                <td className="px-4 py-3 text-[#373737] whitespace-nowrap max-w-[160px] truncate">{q.productName}</td>
                <td className="px-4 py-3 font-mono text-[#0a0a0a] whitespace-nowrap">{formatCurrency(q.totalCost)}</td>
                <td className="px-4 py-3">
                  <Badge label={q.status.charAt(0).toUpperCase() + q.status.slice(1)} variant={STATUS_VARIANTS[q.status]} />
                </td>
                <td className="px-4 py-3 text-[#555555] whitespace-nowrap">{formatDate(q.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
