import type { GeneratedQuotation } from '@/lib/api/types';

const STORAGE_PREFIX = 'nutralike_quotation_';

export function saveGeneratedQuotation(quotation: GeneratedQuotation): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${quotation.id}`,
      JSON.stringify(quotation)
    );
  } catch {
    /* quota or private mode — non-fatal */
  }
}

export function getStoredQuotation(id: string): GeneratedQuotation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedQuotation;
  } catch {
    return null;
  }
}
