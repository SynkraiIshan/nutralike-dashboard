'use client';

import Link from 'next/link';
import type { DashboardTopIngredient } from '@/lib/api/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TopIngredientsProps {
  ingredients: DashboardTopIngredient[];
}

export default function TopIngredients({ ingredients }: TopIngredientsProps) {
  const maxPrice = Math.max(...ingredients.map((i) => i.pricePerUnit), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="type-h3-18 text-[#0a0a0a]">Top ingredients by price</h2>
        <Link href="/ingredients" className="text-xs text-[#314f2d] hover:underline font-medium">
          View all →
        </Link>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-sm text-[#555555] py-6 text-center">No ingredient data yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ingredients.map((ing, i) => {
            const widthPct = Math.round((ing.pricePerUnit / maxPrice) * 100);
            return (
              <li key={ing.id} className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#0a0a0a] truncate" title={ing.name}>
                      <span className="text-[#a3a29e] font-mono text-xs mr-2">#{i + 1}</span>
                      {ing.name}
                    </p>
                    <p className="text-[11px] text-[#a3a29e] mt-0.5">
                      {ing.unit.toUpperCase()} · updated {formatDate(ing.lastUpdated)}
                    </p>
                  </div>
                  <span className="font-mono text-[#314f2d] font-medium whitespace-nowrap shrink-0">
                    {formatCurrency(ing.pricePerUnit)}
                    <span className="text-[#555555] font-sans text-[11px]"> /{ing.unit}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#f2f6ef] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#314f2d]/70 transition-all"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
