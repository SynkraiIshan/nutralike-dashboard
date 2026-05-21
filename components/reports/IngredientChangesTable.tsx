'use client';

import type { ReportIngredientChangeRecord } from '@/types';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const CHANGE_TYPE_VARIANTS: Record<
  string,
  'success' | 'neutral' | 'info' | 'warning' | 'danger'
> = {
  created: 'success',
  updated: 'info',
  deleted: 'danger',
};

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return formatCurrency(price);
}

function formatChangePercent(percent: number | null, changeType: string): string {
  if (percent == null) {
    if (changeType === 'created' || changeType === 'deleted') return '—';
    return '0%';
  }
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent}%`;
}

function changePercentColor(percent: number | null, changeType: string): string {
  if (changeType === 'deleted') return 'text-[#555555]';
  if (percent == null || percent === 0) return 'text-[#555555]';
  return percent > 0 ? 'text-red-500' : 'text-[#25d366]';
}

function changedByLabel(row: ReportIngredientChangeRecord): string {
  if (row.changedByName?.trim()) return row.changedByName.trim();
  return row.changedByEmail;
}

interface IngredientChangesTableProps {
  changes: ReportIngredientChangeRecord[];
  loading?: boolean;
}

export default function IngredientChangesTable({
  changes,
  loading = false,
}: IngredientChangesTableProps) {
  if (loading) {
    return (
      <p className="px-4 py-12 text-sm text-[#555555] text-center">Loading ingredient changes…</p>
    );
  }

  if (changes.length === 0) {
    return (
      <p className="px-4 py-12 text-sm text-[#555555] text-center">No ingredient changes found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[760px]">
        <thead>
          <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
            {['Ingredient', 'Type', 'Old price', 'New price', 'Change', 'Changed by', 'Date'].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {changes.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-[#e8ece5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/60'}`}
            >
              <td className="px-4 py-3 font-medium text-[#0a0a0a] max-w-[200px] truncate">
                {row.ingredientName}
              </td>
              <td className="px-4 py-3">
                <Badge
                  label={row.changeType.charAt(0).toUpperCase() + row.changeType.slice(1)}
                  variant={CHANGE_TYPE_VARIANTS[row.changeType] ?? 'neutral'}
                />
              </td>
              <td className="px-4 py-3 font-mono text-[#555555] whitespace-nowrap">
                {formatPrice(row.oldPrice)}
              </td>
              <td className="px-4 py-3 font-mono text-[#0a0a0a] whitespace-nowrap">
                {formatPrice(row.newPrice)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-[12px] font-medium ${changePercentColor(row.changePercent, row.changeType)}`}
                >
                  {formatChangePercent(row.changePercent, row.changeType)}
                </span>
              </td>
              <td className="px-4 py-3 text-[#373737]">
                <p className="font-medium text-[#0a0a0a] truncate max-w-[140px]">
                  {changedByLabel(row)}
                </p>
                {row.changedByName ? (
                  <p className="text-[11px] text-[#a3a29e] truncate max-w-[140px]">
                    {row.changedByEmail}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-[#555555] whitespace-nowrap">
                {formatDate(row.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
