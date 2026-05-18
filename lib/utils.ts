import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function computeLineTotal(qty: number, pricePerHundredKg: number): number {
  return (qty * pricePerHundredKg) / 100;
}

export function computeQuotationTotal(
  ingredientCost: number,
  markup = 15,
  overhead = 5
): number {
  return ingredientCost * (1 + markup / 100) + overhead;
}
