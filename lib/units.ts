import type { Unit } from '@/types';

/** Values accepted by POST/GET /api/ingredients */
export const INGREDIENT_UNITS: readonly Unit[] = [
  'g',
  'KG',
  'Ltr',
  'ml',
  'mg',
  'oz',
  'lb',
  'pcs',
];

export const INGREDIENT_UNIT_OPTIONS: { value: Unit; label: string }[] = [
  { value: 'g', label: 'g - Gram' },
  { value: 'KG', label: 'KG - Kilogram' },
  { value: 'Ltr', label: 'Ltr - Litre' },
  { value: 'ml', label: 'ml - Millilitre' },
  { value: 'mg', label: 'mg - Milligram' },
  { value: 'oz', label: 'oz - Ounce' },
  { value: 'lb', label: 'lb - Pound' },
  { value: 'pcs', label: 'pcs - Pieces' },
];

export function isValidIngredientUnit(value: string): value is Unit {
  return (INGREDIENT_UNITS as readonly string[]).includes(value);
}
