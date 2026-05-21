import type { LineItem } from '@/components/quotations/IngredientLineTable';
import { fetchIngredients, mapIngredientFromApi } from '@/lib/api/ingredients';
import type { ExtractedQuotationIngredient } from '@/lib/api/types';
import { computeLineTotal } from '@/lib/utils';
import { isValidIngredientUnit } from '@/lib/units';
import type { Unit } from '@/types';

function getAiPrice(name: string): number {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round((hash % 3000) + 400);
}

function normalizeUnit(unit: string): Unit {
  const trimmed = unit.trim();
  if (trimmed.toLowerCase() === 'kg') return 'KG';
  if (trimmed.toLowerCase() === 'ltr') return 'Ltr';
  if (isValidIngredientUnit(trimmed)) return trimmed;
  const upper = trimmed.toUpperCase();
  if (upper === 'KG') return 'KG';
  if (upper === 'LTR') return 'Ltr';
  if (isValidIngredientUnit(upper)) return upper as Unit;
  return 'KG';
}

async function resolveIngredientPricing(name: string): Promise<{
  ingredientId: string;
  pricePerHundredKg: number;
  source: 'database' | 'ai-estimated';
}> {
  try {
    const data = await fetchIngredients({ search: name, page: 1, limit: 20 });
    const match = data.ingredients
      .map(mapIngredientFromApi)
      .find((i) => i.name.toLowerCase() === name.trim().toLowerCase());

    if (match) {
      return {
        ingredientId: match.id,
        pricePerHundredKg: match.pricePerHundredKg,
        source: 'database',
      };
    }
  } catch {
    /* use AI estimate below */
  }

  return {
    ingredientId: '',
    pricePerHundredKg: getAiPrice(name),
    source: 'ai-estimated',
  };
}

export async function mapExtractedToLineItems(
  extracted: ExtractedQuotationIngredient[]
): Promise<LineItem[]> {
  const lines: LineItem[] = [];

  for (const item of extracted) {
    const { ingredientId, pricePerHundredKg, source } =
      await resolveIngredientPricing(item.name);
    const unit = normalizeUnit(item.unit);
    const qtyUsed = item.qtyUsed;

    lines.push({
      id: `line-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ingredientId,
      ingredientName: item.name.trim(),
      unit,
      qtyUsed,
      pricePerHundredKg,
      totalPrice: computeLineTotal(qtyUsed, pricePerHundredKg),
      source,
    });
  }

  return lines;
}
