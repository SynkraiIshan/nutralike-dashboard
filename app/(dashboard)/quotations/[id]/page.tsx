'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Bot } from 'lucide-react';
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import { Quotation } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import GeneratedQuotationBreakdown from '@/components/quotations/GeneratedQuotationBreakdown';
import { ApiError } from '@/lib/api/errors';
import {
  downloadQuotationPdf,
  openQuotationPdfInNewTab,
  verifyQuotationPdfAvailable,
} from '@/lib/api/quotations';
import type { GeneratedQuotation } from '@/lib/api/types';
import { getStoredQuotation } from '@/lib/quotations/quotation-storage';
import { formatCurrency, formatDate, computeQuotationTotal } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'info' | 'warning' | 'danger'> = {
  generated: 'success',
  draft: 'neutral',
  sent: 'info',
  archived: 'neutral',
};

const MARKUP = 15;
const OVERHEAD = 5;

function isLikelyApiQuotationId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [storedQuotation, setStoredQuotation] = useState<GeneratedQuotation | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    setStoredQuotation(getStoredQuotation(id));
  }, [id]);

  const mockQuotation: Quotation | undefined = MOCK_QUOTATIONS.find((q) => q.id === id);

  const pdfFilename = storedQuotation?.quotationNumber
    ? `${storedQuotation.quotationNumber}.pdf`
    : `quotation-${id}.pdf`;

  const handleDownloadPdf = useCallback(() => {
    setIsDownloadingPdf(true);
    void (async () => {
      try {
        await verifyQuotationPdfAvailable(id);
        downloadQuotationPdf(id, { filename: pdfFilename });
        toast.success('PDF download started');
      } catch (error) {
        const msg =
          error instanceof ApiError
            ? error.message
            : 'Failed to download PDF. Please try again.';
        toast.error(msg);
      } finally {
        setIsDownloadingPdf(false);
      }
    })();
  }, [id, pdfFilename]);

  const handleViewPdf = useCallback(() => {
    openQuotationPdfInNewTab(id);
  }, [id]);

  if (storedQuotation) {
    return (
      <div className="flex flex-col gap-5 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link href="/quotations">
            <Button variant="ghost" leftIcon={<ArrowLeft size={15} />}>
              Back to Quotations
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Share2 size={15} />}
              onClick={() => toast.success('Share link copied to clipboard')}
            >
              Share Link
            </Button>
            <Button variant="secondary" onClick={handleViewPdf}>
              View PDF
            </Button>
            <Button
              leftIcon={<Download size={15} />}
              loading={isDownloadingPdf}
              onClick={() => void handleDownloadPdf()}
            >
              Download PDF
            </Button>
          </div>
        </div>

        <Card padding={false} className="overflow-hidden">
          <GeneratedQuotationBreakdown quotation={storedQuotation} />
        </Card>
      </div>
    );
  }

  if (!mockQuotation) {
    const canTryPdf = isLikelyApiQuotationId(id);

    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
        <p className="type-h3 text-[#0a0a0a] mb-2">Quotation Not Found</p>
        <p className="text-sm text-[#555555] mb-4">
          {canTryPdf
            ? 'This quotation is not cached in your browser. You can still try downloading the PDF if it was generated on the server.'
            : `No quotation with ID "${id}" exists.`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link href="/quotations">
            <Button variant="secondary">← Back to Quotations</Button>
          </Link>
          {canTryPdf && (
            <Button loading={isDownloadingPdf} onClick={() => void handleDownloadPdf()}>
              Download PDF
            </Button>
          )}
        </div>
      </div>
    );
  }

  const ingredientTotal = mockQuotation.ingredients.reduce((s, l) => s + l.totalPrice, 0);
  const markupAmt = ingredientTotal * (MARKUP / 100);
  const total = computeQuotationTotal(ingredientTotal, MARKUP, OVERHEAD);
  const aiCount = mockQuotation.ingredients.filter((i) => i.source === 'ai-estimated').length;

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link href="/quotations">
          <Button variant="ghost" leftIcon={<ArrowLeft size={15} />}>Back to Quotations</Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<Share2 size={15} />}
            onClick={() => toast.success('Share link copied to clipboard')}>
            Share Link
          </Button>
          <Button
            leftIcon={<Download size={15} />}
            loading={isDownloadingPdf}
            onClick={() => void handleDownloadPdf()}
          >
            Download PDF
          </Button>
        </div>
      </div>

      <Card padding={false} className="overflow-hidden">
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #314f2d, #3c5d39)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/70 text-[12px] uppercase tracking-widest font-medium">
                  Quotation #{mockQuotation.id.toUpperCase()}
                </p>
                <Badge
                  label={mockQuotation.status.charAt(0).toUpperCase() + mockQuotation.status.slice(1)}
                  variant={STATUS_VARIANTS[mockQuotation.status]}
                />
              </div>
              <p className="type-h3-18 text-white">{mockQuotation.productName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/60 text-[11px] uppercase">Created</p>
              <p className="text-white text-sm font-medium">{formatDate(mockQuotation.createdAt)}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-white/60 text-[11px] uppercase">Client</p>
              <p className="text-white text-sm font-medium">{mockQuotation.clientName}</p>
            </div>
            <div>
              <p className="text-white/60 text-[11px] uppercase">Email</p>
              <p className="text-white text-sm">{mockQuotation.clientEmail}</p>
            </div>
            {mockQuotation.productDescription && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-white/60 text-[11px] uppercase">Description</p>
                <p className="text-white text-sm leading-snug">{mockQuotation.productDescription}</p>
              </div>
            )}
          </div>
        </div>

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
                {mockQuotation.ingredients.map((line, i) => (
                  <tr key={`${line.ingredientId}-${i}`} className="border-b border-[#f2f6ef]">
                    <td className="py-3 pr-4 text-[#555555] text-[12px]">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-[#0a0a0a] flex items-center gap-1.5">
                      <span>{line.ingredientName}</span>
                      {line.source === 'ai-estimated' && <Bot size={13} className="text-[#7c9f43] flex-shrink-0" />}
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
                        label={line.source === 'ai-estimated' ? 'AI' : 'DB'}
                        variant={line.source === 'ai-estimated' ? 'ai' : 'info'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
              <Bot size={14} className="text-[#7c9f43] mt-0.5 flex-shrink-0" />
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
