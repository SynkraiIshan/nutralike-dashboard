'use client';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import { Quotation } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate, computeQuotationTotal } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'info' | 'warning' | 'danger'> = {
  generated: 'success', draft: 'neutral', sent: 'info', archived: 'neutral',
};

const MARKUP = 15;
const OVERHEAD = 5;

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quotation: Quotation | undefined = MOCK_QUOTATIONS.find((q) => q.id === id);

  if (!quotation) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="type-h3 text-[#0a0a0a] mb-2">Quotation Not Found</p>
        <p className="text-sm text-[#555555] mb-4">No quotation with ID &ldquo;{id}&rdquo; exists.</p>
        <Link href="/quotations"><Button variant="secondary">← Back to Quotations</Button></Link>
      </div>
    );
  }

  const ingredientTotal = quotation.ingredients.reduce((s, l) => s + l.totalPrice, 0);
  const markupAmt = ingredientTotal * (MARKUP / 100);
  const total = computeQuotationTotal(ingredientTotal, MARKUP, OVERHEAD);
  const aiCount = quotation.ingredients.filter((i) => i.source === 'ai-estimated').length;

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link href="/quotations">
          <Button variant="ghost" leftIcon={<ArrowLeft size={15} />}>Back to Quotations</Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<Share2 size={15} />}
            onClick={() => toast.success('Share link copied to clipboard')}>
            Share Link
          </Button>
          <Button leftIcon={<Download size={15} />}
            onClick={() => toast.success(`Quotation ${quotation.id.toUpperCase()} PDF downloaded`)}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Main card */}
      <Card padding={false} className="overflow-hidden">
        {/* Quotation header */}
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #314f2d, #3c5d39)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/70 text-[12px] uppercase tracking-widest font-medium">
                  Quotation #{quotation.id.toUpperCase()}
                </p>
                <Badge
                  label={quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                  variant={STATUS_VARIANTS[quotation.status]}
                />
              </div>
              <p className="type-h3-18 text-white">{quotation.productName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/60 text-[11px] uppercase">Created</p>
              <p className="text-white text-sm font-medium">{formatDate(quotation.createdAt)}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-[11px] uppercase">Client</p>
              <p className="text-white text-sm font-medium">{quotation.clientName}</p>
            </div>
            <div>
              <p className="text-white/60 text-[11px] uppercase">Email</p>
              <p className="text-white text-sm">{quotation.clientEmail}</p>
            </div>
            {quotation.productDescription && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-white/60 text-[11px] uppercase">Description</p>
                <p className="text-white text-sm leading-snug">{quotation.productDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ingredient breakdown */}
        <div className="px-6 pt-5 pb-1">
          <p className="text-[12px] font-semibold text-[#555555] uppercase tracking-widest mb-4">
            Ingredient Breakdown
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#c3c3c3]">
                  {['S.No', 'Ingredient', 'Unit', 'Qty', '₹/100KG', 'Total', 'Source'].map((h) => (
                    <th key={h} className="pb-2 pr-4 text-left text-[11px] font-semibold text-[#555555] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotation.ingredients.map((line, i) => (
                  <tr key={`${line.ingredientId}-${i}`} className="border-b border-[#f2f6ef]">
                    <td className="py-3 pr-4 text-[#555555] text-[12px]">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-[#0a0a0a]">
                      {line.ingredientName}
                      {line.source === 'ai-estimated' && <span className="ml-1">🤖</span>}
                    </td>
                    <td className="py-3 pr-4 text-[#555555]">{line.unit}</td>
                    <td className="py-3 pr-4 text-[#373737] tabular-nums">{line.qtyUsed}</td>
                    <td className="py-3 pr-4 font-mono text-[#373737] tabular-nums">
                      ₹ {line.pricePerHundredKg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 pr-4 font-mono font-medium text-[#0a0a0a] tabular-nums">
                      ₹ {line.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <Badge
                        label={line.source === 'ai-estimated' ? '🤖 AI' : 'DB'}
                        variant={line.source === 'ai-estimated' ? 'ai' : 'info'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula breakdown */}
        <div className="px-6 py-5">
          <div className="bg-[#f2f6ef] rounded-xl p-4">
            <p className="text-[12px] font-semibold text-[#555555] uppercase tracking-widest mb-3">Formula Applied</p>
            <p className="text-[12px] font-mono text-[#555555] mb-4">
              Total = (Ingredient Cost × {(1 + MARKUP / 100).toFixed(2)}) + ₹{OVERHEAD} Overhead
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#555555]">Ingredient Subtotal</span>
                <span className="font-mono">{formatCurrency(ingredientTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">Markup ({MARKUP}%)</span>
                <span className="font-mono">{formatCurrency(markupAmt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">Overhead</span>
                <span className="font-mono">{formatCurrency(OVERHEAD)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#c3c3c3] font-semibold text-[#0a0a0a]">
                <span>TOTAL</span>
                <span className="font-mono text-lg text-[#314f2d]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {aiCount > 0 && (
            <div className="mt-3 flex items-start gap-2 bg-[#7c9f43]/10 border border-[#7c9f43]/30 rounded-lg px-3 py-2">
              <span className="text-base leading-none mt-0.5">🤖</span>
              <p className="text-[12px] text-[#597a3e]">
                Note: {aiCount} ingredient price{aiCount > 1 ? 's' : ''} estimated by AI based on market data.
                Final prices may vary.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
