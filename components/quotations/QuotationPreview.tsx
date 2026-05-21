import { LineItem } from './IngredientLineTable';
import { parsePackWeightGrams } from '@/lib/packaging/constants';
import { QuotationClientInfo } from '@/types';
import { Bot } from 'lucide-react';

interface QuotationPreviewProps {
  clientInfo: QuotationClientInfo;
  lines: LineItem[];
}

export default function QuotationPreview({ clientInfo, lines }: QuotationPreviewProps) {
  const aiCount = lines.filter((l) => l.source === 'ai-estimated').length;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white border border-[#c3c3c3] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#f2f6ef]" style={{ background: 'linear-gradient(135deg, #314f2d, #3c5d39)' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-[12px] uppercase tracking-widest font-medium">Quotation Preview</p>
            <p className="text-white type-h3-18 mt-1">{clientInfo.productName || 'Product Name'}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-[12px]">Date</p>
            <p className="text-white text-sm font-medium">{today}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <div>
            <p className="text-white/60 text-[11px] uppercase">Client</p>
            <p className="text-white text-sm font-medium">{clientInfo.name || '-'}</p>
          </div>
          {clientInfo.email && (
            <div>
              <p className="text-white/60 text-[11px] uppercase">Email</p>
              <p className="text-white text-sm">{clientInfo.email}</p>
            </div>
          )}
          {clientInfo.packagingType && (
            <div>
              <p className="text-white/60 text-[11px] uppercase">Packaging</p>
              <p className="text-white text-sm capitalize">
                {clientInfo.packagingType}
                {clientInfo.packWeightG
                  ? ` · ${parsePackWeightGrams(clientInfo.packWeightG)}g`
                  : ''}
                {clientInfo.packagingTier
                  ? ` · ${clientInfo.packagingTier === 'min' ? 'Min' : 'Max'} tier`
                  : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ingredient table */}
      <div className="px-6 pt-5 pb-5">
        <p className="text-[12px] font-semibold text-[#555555] uppercase tracking-widest mb-3">Ingredient Breakdown</p>
        {lines.length === 0 ? (
          <p className="text-sm text-[#a3a29e] py-4 text-center">No ingredients added yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c3c3c3]">
                {['S.No', 'Ingredient', 'Unit', 'Qty', '₹/100KG'].map((h) => (
                  <th key={h} className="py-2 pr-4 text-left text-[11px] font-semibold text-[#555555] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => (
                <tr key={line.id} className="border-b border-[#f2f6ef]">
                  <td className="py-2 pr-4 text-[#555555] text-[12px]">{i + 1}</td>
                  <td className="py-2 pr-4 font-medium text-[#0a0a0a] flex items-center gap-1.5">
                    <span>{line.ingredientName || '-'}</span>
                    {line.source === 'ai-estimated' && (
                      <Bot size={12} className="text-[#7c9f43] flex-shrink-0" />
                    )}
                  </td>
                  <td className="py-2 pr-4 text-[#555555]">{line.unit}</td>
                  <td className="py-2 pr-4 text-[#373737] tabular-nums">{line.qtyUsed}</td>
                  <td className="py-2 pr-4 font-mono text-[#373737] tabular-nums">
                    ₹ {line.pricePerHundredKg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {aiCount > 0 && (
          <div className="mt-4 mb-5 flex items-start gap-2 bg-[#7c9f43]/10 border border-[#7c9f43]/30 rounded-lg px-3 py-2">
            <Bot size={14} className="text-[#7c9f43] mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-[#597a3e]">
              {aiCount} ingredient price{aiCount > 1 ? 's' : ''} estimated by AI based on market data.
              Final prices may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
