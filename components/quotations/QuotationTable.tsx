import Link from 'next/link';
import { Quotation } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'info' | 'warning' | 'danger'> = {
  generated: 'success',
  draft:     'neutral',
  sent:      'info',
  archived:  'neutral',
};

interface QuotationTableProps {
  quotations: Quotation[];
}

export default function QuotationTable({ quotations }: QuotationTableProps) {
  if (quotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center mb-4">
          <FileText size={28} className="text-[#314f2d]" />
        </div>
        <p className="type-h3-18 text-[#0a0a0a]">No quotations found</p>
        <p className="type-small-body text-[#555555] mt-1">
          Adjust your filters or create a new quotation.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
            {['#', 'Client', 'Product', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
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
              className={[
                'group border-b border-[#e8ece5] transition-all duration-100',
                i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]',
                'hover:bg-[#f2f6ef] hover:border-l-4 hover:border-l-[#314f2d]',
              ].join(' ')}
            >
              <td className="px-4 py-3 text-[#555555] font-mono text-xs uppercase">{q.id}</td>
              <td className="px-4 py-3 font-medium text-[#0a0a0a] whitespace-nowrap">{q.clientName}</td>
              <td className="px-4 py-3 text-[#373737] max-w-[180px] truncate">{q.productName}</td>
              <td className="px-4 py-3 text-right font-mono text-[#0a0a0a] whitespace-nowrap">
                {formatCurrency(q.totalCost)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  label={q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                  variant={STATUS_VARIANTS[q.status]}
                />
              </td>
              <td className="px-4 py-3 text-[#555555] whitespace-nowrap">{formatDate(q.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Link href={`/quotations/${q.id}`}>
                    <Button size="sm" variant="secondary" leftIcon={<Eye size={13} />}>
                      View
                    </Button>
                  </Link>
                  <button
                    onClick={() => toast.success(`Quotation ${q.id.toUpperCase()} PDF downloaded`)}
                    className="p-1.5 rounded-lg text-[#555555] hover:text-[#314f2d] hover:bg-[#314f2d]/10 transition-colors"
                    title="Download PDF"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
