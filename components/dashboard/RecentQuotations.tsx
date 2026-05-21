'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DashboardRecentQuotation } from '@/lib/api/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface RecentQuotationsProps {
  quotations: DashboardRecentQuotation[];
}

export default function RecentQuotations({ quotations }: RecentQuotationsProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="type-h3-18 text-[#0a0a0a]">Recent Quotations</h2>
        <Link href="/quotations" className="text-xs text-[#314f2d] hover:underline font-medium">
          View all →
        </Link>
      </div>

      {quotations.length === 0 ? (
        <p className="text-sm text-[#555555] py-8 text-center border border-dashed border-[#c3c3c3] rounded-xl">
          No quotations yet.{' '}
          <Link href="/quotations/new" className="text-[#314f2d] font-medium hover:underline">
            Create one →
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c3c3c3]">
                {['Quotation', 'Client', 'Product', 'Pack', 'Total', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap"
                  >
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
                  <td className="px-4 py-3 font-mono text-xs text-[#314f2d] font-medium whitespace-nowrap">
                    {q.quotationNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0a0a0a] whitespace-nowrap">
                    {q.clientName}
                  </td>
                  <td className="px-4 py-3 text-[#373737] whitespace-nowrap max-w-[180px] truncate">
                    {q.productName}
                  </td>
                  <td className="px-4 py-3 text-[#555555] whitespace-nowrap tabular-nums">
                    {q.packWeightG}g
                  </td>
                  <td className="px-4 py-3 font-mono text-[#0a0a0a] whitespace-nowrap">
                    {formatCurrency(q.totalPrice)}
                  </td>
                  <td className="px-4 py-3 text-[#555555] whitespace-nowrap">
                    {formatDate(q.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
