import { ApiError } from '@/lib/api/errors';
import { extractPdfBuffer } from '@/lib/quotations/parse-pdf-buffer';

function buildPdfDownloadUrl(quotationId: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  return `${origin}/api/quotations/${encodeURIComponent(quotationId)}/pdf`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, '_');
}

/** Native browser download via same-origin API route (auth cookie). */
export function downloadQuotationPdf(
  quotationId: string,
  options?: { filename?: string }
): void {
  const anchor = document.createElement('a');
  anchor.href = buildPdfDownloadUrl(quotationId);
  anchor.download = sanitizeFilename(
    options?.filename ?? `quotation-${quotationId}.pdf`
  );
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** Opens the PDF in a new tab (Chrome PDF viewer). */
export function openQuotationPdfInNewTab(quotationId: string): void {
  window.open(buildPdfDownloadUrl(quotationId), '_blank', 'noopener,noreferrer');
}

/** Pre-flight check before download (validates %PDF header). */
export async function verifyQuotationPdfAvailable(
  quotationId: string
): Promise<void> {
  const response = await fetch(buildPdfDownloadUrl(quotationId), {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/pdf, application/octet-stream, */*' },
  });

  const buffer = await response.arrayBuffer();

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const parsed = JSON.parse(new TextDecoder().decode(buffer)) as {
        message?: string;
      };
      message = parsed.message ?? message;
    } catch {
      if (buffer.byteLength > 0) {
        const fail = extractPdfBuffer(buffer);
        if (!fail.ok) message = fail.message;
      }
    }
    throw new ApiError(message, { status: response.status });
  }

  const extracted = extractPdfBuffer(buffer);
  if (!extracted.ok) {
    throw new ApiError(extracted.message);
  }
}
