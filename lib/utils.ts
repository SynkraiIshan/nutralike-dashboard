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

export function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (diffMs < 0) return 'Just now';

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(dateStr);
}

export function formatPercentChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}% vs last month`;
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
