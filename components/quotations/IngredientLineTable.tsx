'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Ingredient, Unit } from '@/types';
import { fetchIngredients, mapIngredientFromApi } from '@/lib/api/ingredients';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { computeLineTotal } from '@/lib/utils';
import { INGREDIENT_UNITS } from '@/lib/units';

export interface LineItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  qtyUsed: number;
  pricePerHundredKg: number;
  totalPrice: number;
  source: 'database' | 'ai-estimated';
}

interface IngredientLineTableProps {
  lines: LineItem[];
  onChange: (lines: LineItem[]) => void;
}

const UNIT_OPTIONS: Unit[] = [...INGREDIENT_UNITS];

const AI_PRICES: Record<string, number> = {
  default: 850,
};

function getAiPrice(name: string): number {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round((hash % 3000) + 400);
}

function newLine(): LineItem {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ingredientId: '',
    ingredientName: '',
    unit: 'KG',
    qtyUsed: 1,
    pricePerHundredKg: 0,
    totalPrice: 0,
    source: 'database',
  };
}

export default function IngredientLineTable({ lines, onChange }: IngredientLineTableProps) {
  const [dropdowns, setDropdowns] = useState<Record<string, string>>({});
  const [inputVals, setInputVals] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, Ingredient[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const runningTotal = lines.reduce((sum, l) => sum + l.totalPrice, 0);

  const addRow = () => {
    const line = newLine();
    onChange([...lines, line]);
    setInputVals((p) => ({ ...p, [line.id]: '' }));
    setDropdowns((p) => ({ ...p, [line.id]: '' }));
  };

  const removeRow = (id: string) => {
    onChange(lines.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    onChange(
      lines.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...patch };
        updated.totalPrice = computeLineTotal(updated.qtyUsed, updated.pricePerHundredKg);
        return updated;
      })
    );
  };

  const loadSuggestions = (id: string, query: string) => {
    if (searchTimers.current[id]) clearTimeout(searchTimers.current[id]);

    if (!query.trim()) {
      setSuggestions((p) => ({ ...p, [id]: [] }));
      return;
    }

    searchTimers.current[id] = setTimeout(async () => {
      try {
        const data = await fetchIngredients({ search: query, page: 1, limit: 5 });
        setSuggestions((p) => ({
          ...p,
          [id]: data.ingredients.map(mapIngredientFromApi),
        }));
      } catch {
        setSuggestions((p) => ({ ...p, [id]: [] }));
      }
    }, 300);
  };

  const handleNameInput = (id: string, val: string) => {
    setInputVals((p) => ({ ...p, [id]: val }));
    setDropdowns((p) => ({ ...p, [id]: val }));
    updateLine(id, { ingredientName: val, ingredientId: '', source: 'database' });
    loadSuggestions(id, val);
  };

  const handleSelectIngredient = (id: string, ing: Ingredient) => {
    setInputVals((p) => ({ ...p, [id]: ing.name }));
    setDropdowns((p) => ({ ...p, [id]: '' }));
    updateLine(id, {
      ingredientId: ing.id,
      ingredientName: ing.name,
      unit: ing.unit,
      pricePerHundredKg: ing.pricePerHundredKg,
      source: 'database',
    });
  };

  const handleNameBlur = (id: string, name: string) => {
    setTimeout(async () => {
      setDropdowns((p) => ({ ...p, [id]: '' }));
      setSuggestions((p) => ({ ...p, [id]: [] }));

      const trimmed = name.trim();
      if (!trimmed) return;

      const cached = (suggestions[id] ?? []).find(
        (i) => i.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (cached) {
        handleSelectIngredient(id, cached);
        return;
      }

      try {
        const data = await fetchIngredients({ search: trimmed, page: 1, limit: 10 });
        const found = data.ingredients
          .map(mapIngredientFromApi)
          .find((i) => i.name.toLowerCase() === trimmed.toLowerCase());
        if (found) {
          handleSelectIngredient(id, found);
          return;
        }
      } catch {
        /* fall through to AI estimate */
      }

      updateLine(id, {
        ingredientName: trimmed,
        pricePerHundredKg: getAiPrice(trimmed),
        source: 'ai-estimated',
      });
    }, 200);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="type-h4 text-[#0a0a0a] uppercase tracking-wide">Ingredients</p>
        <Button size="sm" variant="secondary" leftIcon={<Plus size={13} />} onClick={addRow}>
          Add Row
        </Button>
      </div>

      {lines.length === 0 ? (
        <div className="border-2 border-dashed border-[#c3c3c3] rounded-xl p-8 text-center">
          <p className="text-sm text-[#555555]">No ingredients yet. Click &ldquo;Add Row&rdquo; or extract from a file above.</p>
        </div>
      ) : (
        <div className="border border-[#c3c3c3] rounded-xl overflow-hidden" ref={containerRef}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f6ef] border-b border-[#c3c3c3]">
                  {['Ingredient Name', 'Unit', 'Qty (KG)', '₹/100KG', 'Total', 'Source', ''].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => {
                  const lineSuggestions = suggestions[line.id] ?? [];
                  const displayVal = inputVals[line.id] ?? line.ingredientName;

                  return (
                    <tr key={line.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/50'}>
                      {/* Name autocomplete */}
                      <td className="px-3 py-2 relative min-w-[160px]">
                        <input
                          type="text"
                          value={displayVal}
                          onChange={(e) => handleNameInput(line.id, e.target.value)}
                          onBlur={(e) => handleNameBlur(line.id, e.target.value)}
                          placeholder="Type ingredient..."
                          className="w-full px-2 py-1.5 text-[13px] border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] focus:ring-1 focus:ring-[#314f2d]/20 bg-white"
                        />
                        {lineSuggestions.length > 0 && (
                          <div className="absolute left-3 top-full mt-1 z-30 bg-white border border-[#c3c3c3] rounded-lg shadow-lg overflow-hidden min-w-[200px]">
                            {lineSuggestions.map((sug) => (
                              <button
                                key={sug.id}
                                type="button"
                                onMouseDown={() => handleSelectIngredient(line.id, sug)}
                                className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#f2f6ef] transition-colors cursor-pointer"
                              >
                                <span className="font-medium text-[#0a0a0a]">{sug.name}</span>
                                <span className="text-[#555555] ml-2 text-[11px]">₹{sug.pricePerHundredKg}/100KG</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="px-3 py-2">
                        <select
                          value={line.unit}
                          onChange={(e) => updateLine(line.id, { unit: e.target.value as Unit })}
                          className="px-2 py-1.5 text-[13px] border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] bg-white cursor-pointer"
                        >
                          {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </td>

                      {/* Qty */}
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={line.qtyUsed}
                          onChange={(e) => updateLine(line.id, { qtyUsed: Number(e.target.value) })}
                          className="w-20 px-2 py-1.5 text-[13px] border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] bg-white text-right"
                        />
                      </td>

                      {/* Price */}
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[#555555] text-[12px]">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.pricePerHundredKg}
                            onChange={(e) =>
                              updateLine(line.id, { pricePerHundredKg: Number(e.target.value) })
                            }
                            className="w-24 px-2 py-1.5 text-[13px] border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] bg-white text-right"
                          />
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-3 py-2 font-mono text-[13px] text-[#0a0a0a] whitespace-nowrap">
                        ₹ {line.totalPrice.toFixed(2)}
                      </td>

                      {/* Source badge */}
                      <td className="px-3 py-2">
                        {line.source === 'ai-estimated' ? (
                          <span className="inline-flex items-center gap-1">
                            <Badge label="AI" variant="ai" />
                          </span>
                        ) : (
                          <Badge label="DB" variant="info" />
                        )}
                      </td>

                      {/* Remove */}
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeRow(line.id)}
                          className="p-1 rounded text-[#a3a29e] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end px-4 py-3 border-t border-[#c3c3c3] bg-[#f2f6ef]">
            <span className="text-sm text-[#555555] mr-2">Running Total:</span>
            <span className="font-semibold font-mono text-[#0a0a0a] text-base">
              ₹ {runningTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
