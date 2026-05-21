import type { PackagingMaterialsData, PackagingType } from '@/types';

export const PACKAGING_TYPE_OPTIONS = [
  { value: 'jar', label: 'Jar' },
  { value: 'sachet', label: 'Sachet' },
] as const;

export const PACKAGING_TIER_OPTIONS = [
  { value: 'min', label: 'Minimum cost' },
  { value: 'max', label: 'Maximum cost' },
] as const;

export function parsePackWeightGrams(packWeight: string): number {
  return parseInt(packWeight.replace(/\D/g, ''), 10) || 0;
}

export function getPackWeightOptions(
  type: PackagingType,
  materials?: PackagingMaterialsData
): { value: string; label: string }[] {
  if (!materials) return [];

  const weights = Object.keys(materials[type] ?? {});
  return weights
    .sort((a, b) => parsePackWeightGrams(a) - parsePackWeightGrams(b))
    .map((w) => ({ value: w, label: w }));
}
