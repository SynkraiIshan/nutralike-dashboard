'use client';

import { Bot } from 'lucide-react';
import type { GeneratedQuotation } from '@/lib/api/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface GeneratedQuotationBreakdownProps {
  quotation: GeneratedQuotation;
}

export default function GeneratedQuotationBreakdown({
  quotation,
}: GeneratedQuotationBreakdownProps) {
  const { breakdown, packaging, items } = quotation;
  const aiCount = items.filter(
    (i) => i.priceSource !== 'database' && i.priceSource !== 'db'
  ).length;

  return (
    <div className="flex flex-col gap-0">
      <div
        className="px-6 py-5"
        style={{ background: 'linear-gradient(135deg, #314f2d, #3c5d39)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-white/70 text-[12px] uppercase tracking-widest font-medium">
                {quotation.quotationNumber}
              </p>
              <Badge label="Generated" variant="success" />
            </div>
            <p className="type-h3-18 text-white">{quotation.productName}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-white/60 text-[11px] uppercase">Created</p>
            <p className="text-white text-sm font-medium">
              {formatDate(quotation.createdAt)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-white/60 text-[11px] uppercase">Client</p>
            <p className="text-white text-sm font-medium">{quotation.clientName}</p>
          </div>
          <div>
            <p className="text-white/60 text-[11px] uppercase">Pack weight</p>
            <p className="text-white text-sm">{quotation.packWeightG}g</p>
          </div>
          {quotation.productType && (
            <div>
              <p className="text-white/60 text-[11px] uppercase">Product type</p>
              <p className="text-white text-sm capitalize">{quotation.productType}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pt-5 pb-1">
        <p className="text-[12px] font-semibold text-[#555555] uppercase tracking-widest mb-4">
          Ingredient Breakdown
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-[#c3c3c3]">
                {['S.No', 'Ingredient', 'Unit', 'Qty', 'Price/unit', 'Total', 'Source'].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-2 pr-4 text-left text-[11px] font-semibold text-[#555555] uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((line, i) => (
                <tr key={`${line.ingredientName}-${i}`} className="border-b border-[#f2f6ef]">
                  <td className="py-3 pr-4 text-[#555555] text-[12px]">{i + 1}</td>
                  <td className="py-3 pr-4 font-medium text-[#0a0a0a]">
                    <span className="inline-flex items-center gap-1.5">
                      {line.ingredientName}
                      {line.priceSource !== 'database' && (
                        <Bot size={13} className="text-[#7c9f43] flex-shrink-0" />
                      )}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#555555]">{line.unit}</td>
                  <td className="py-3 pr-4 text-[#373737] tabular-nums">{line.qtyUsed}</td>
                  <td className="py-3 pr-4 font-mono text-[#373737] tabular-nums">
                    {formatCurrency(line.pricePerUnit)}
                  </td>
                  <td className="py-3 pr-4 font-mono font-medium text-[#0a0a0a] tabular-nums">
                    {formatCurrency(line.totalPrice)}
                  </td>
                  <td className="py-3">
                    <Badge
                      label={line.priceSource === 'database' ? 'DB' : 'AI'}
                      variant={line.priceSource === 'database' ? 'info' : 'ai'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="bg-[#f2f6ef] rounded-xl p-4 space-y-4">
          <p className="text-[12px] font-semibold text-[#555555] uppercase tracking-widest">
            Price breakdown
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#555555]">Ingredient subtotal</span>
              <span className="font-mono">{formatCurrency(breakdown.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#555555]">
                Wastage ({breakdown.wastagePercent ?? 2}%)
              </span>
              <span className="font-mono">{formatCurrency(breakdown.wastage)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#555555]">Per kg price</span>
              <span className="font-mono">{formatCurrency(breakdown.perKgPrice)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#555555]">Per pack price ({breakdown.packWeightG ?? quotation.packWeightG}g)</span>
              <span className="font-mono">{formatCurrency(breakdown.perPackPrice)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#555555]">Packaging total</span>
              <span className="font-mono">{formatCurrency(breakdown.packagingTotal)}</span>
            </div>
            {packaging.total > 0 && (
              <p className="text-[11px] text-[#a3a29e] pl-2">
                Pouch {formatCurrency(packaging.pouchCost)} · Box {formatCurrency(packaging.boxCost)} ·
                CCPC {formatCurrency(packaging.ccpcCost)} · Other {formatCurrency(packaging.otherCost)}
              </p>
            )}
            {breakdown.rmTotal != null && (
              <div className="flex justify-between gap-4">
                <span className="text-[#555555]">RM total</span>
                <span className="font-mono">{formatCurrency(breakdown.rmTotal)}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-[#555555]">
                Profit ({breakdown.profitPercent ?? 15}%)
              </span>
              <span className="font-mono">{formatCurrency(breakdown.profit)}</span>
            </div>
            <div className="flex justify-between gap-4 pt-3 border-t border-[#c3c3c3] font-semibold text-[#0a0a0a]">
              <span>Final price (per pack)</span>
              <span className="font-mono text-lg text-[#314f2d]">
                {formatCurrency(breakdown.finalPrice)}
              </span>
            </div>
          </div>
        </div>

        {aiCount > 0 && (
          <div className="mt-3 flex items-start gap-2 bg-[#7c9f43]/10 border border-[#7c9f43]/30 rounded-lg px-3 py-2">
            <Bot size={14} className="text-[#7c9f43] mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-[#597a3e]">
              {aiCount} ingredient price{aiCount > 1 ? 's' : ''} estimated by AI. Review before
              sending to client.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
