/** PDF responses may be raw bytes, leading whitespace, or JSON/base64 wrappers. */

const PDF_TIMEOUT_MS = 120_000;

export function getPdfRequestTimeoutMs(): number {
  const parsed = Number(process.env.API_PDF_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : PDF_TIMEOUT_MS;
}

export function findPdfStartOffset(bytes: Uint8Array): number {
  const limit = Math.min(bytes.length - 4, 16384);
  for (let i = 0; i <= limit; i++) {
    if (
      bytes[i] === 0x25 &&
      bytes[i + 1] === 0x50 &&
      bytes[i + 2] === 0x44 &&
      bytes[i + 3] === 0x46
    ) {
      return i;
    }
  }
  return -1;
}

export function isPdfBuffer(buffer: ArrayBuffer): boolean {
  return findPdfStartOffset(new Uint8Array(buffer)) >= 0;
}

function slicePdfFromOffset(buffer: ArrayBuffer, offset: number): ArrayBuffer {
  return buffer.slice(offset);
}

function decodeBase64ToBuffer(base64: string): ArrayBuffer | null {
  const cleaned = base64
    .replace(/^data:application\/pdf;base64,/i, '')
    .replace(/\s/g, '');
  if (!cleaned || cleaned.length < 16) return null;

  try {
    if (typeof Buffer !== 'undefined') {
      const buf = Buffer.from(cleaned, 'base64');
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  } catch {
    return null;
  }
}

function tryDecodeEntireBodyAsBase64(buffer: ArrayBuffer): ArrayBuffer | null {
  const text = new TextDecoder().decode(buffer).trim();
  if (text.length < 100 || text.length > 50_000_000) return null;
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(text.slice(0, 200))) return null;
  const decoded = decodeBase64ToBuffer(text);
  if (!decoded || !isPdfBuffer(decoded)) return null;
  const offset = findPdfStartOffset(new Uint8Array(decoded));
  return offset > 0 ? slicePdfFromOffset(decoded, offset) : decoded;
}

function collectBase64Candidates(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    if (value.length > 100) out.push(value);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) collectBase64Candidates(item, out);
    return;
  }
  const record = value as Record<string, unknown>;
  const keys = ['pdf', 'file', 'data', 'content', 'buffer', 'base64', 'document', 'body'];
  for (const key of keys) {
    if (key in record) collectBase64Candidates(record[key], out);
  }
  if (record.data && typeof record.data === 'object') {
    collectBase64Candidates(record.data, out);
  }
}

/** Backend may return PDF bytes as JSON: {"0":37,"1":80,"2":68,"3":70,...} (%PDF...) */
function bufferFromIndexedByteMap(record: Record<string, unknown>): ArrayBuffer | null {
  const keys = Object.keys(record);
  if (keys.length < 4) return null;

  let maxIndex = -1;
  for (const key of keys) {
    if (!/^\d+$/.test(key)) return null;
    const idx = Number.parseInt(key, 10);
    const val = record[key];
    if (
      typeof val !== 'number' ||
      !Number.isInteger(val) ||
      val < 0 ||
      val > 255
    ) {
      return null;
    }
    if (idx > maxIndex) maxIndex = idx;
  }

  const bytes = new Uint8Array(maxIndex + 1);
  for (const key of keys) {
    bytes[Number.parseInt(key, 10)] = record[key] as number;
  }

  return bytes.buffer;
}

function isLikelyIndexedByteMap(record: Record<string, unknown>): boolean {
  const keys = Object.keys(record);
  if (keys.length < 4) return false;
  if ('success' in record && 'message' in record && keys.length < 50) return false;
  const sample = keys.slice(0, Math.min(12, keys.length));
  return sample.every((k) => /^\d+$/.test(k));
}

function tryMapIndexedByteObject(value: unknown): ArrayBuffer | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (!isLikelyIndexedByteMap(record)) return null;

  const buf = bufferFromIndexedByteMap(record);
  if (!buf || !isPdfBuffer(buf)) return null;

  const offset = findPdfStartOffset(new Uint8Array(buf));
  return offset > 0 ? slicePdfFromOffset(buf, offset) : buf;
}

function tryExtractFromIndexedByteMap(buffer: ArrayBuffer): ArrayBuffer | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    return null;
  }

  const direct = tryMapIndexedByteObject(parsed);
  if (direct) return direct;

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

  const envelope = parsed as Record<string, unknown>;
  for (const key of ['data', 'pdf', 'file', 'buffer', 'content', 'document']) {
    if (!(key in envelope)) continue;
    const nested = tryMapIndexedByteObject(envelope[key]);
    if (nested) return nested;
  }

  return null;
}

function tryExtractFromJson(buffer: ArrayBuffer): ArrayBuffer | null {
  let text: string;
  try {
    text = new TextDecoder().decode(buffer);
  } catch {
    return null;
  }

  const trimmed = text.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }

  const candidates: string[] = [];
  collectBase64Candidates(parsed, candidates);

  for (const candidate of candidates) {
    const decoded = decodeBase64ToBuffer(candidate);
    if (!decoded || !isPdfBuffer(decoded)) continue;
    const offset = findPdfStartOffset(new Uint8Array(decoded));
    return offset > 0 ? slicePdfFromOffset(decoded, offset) : decoded;
  }

  return null;
}

export type PdfExtractResult =
  | { ok: true; buffer: ArrayBuffer; offset: number }
  | { ok: false; message: string; hint?: string };

/**
 * Resolves a PDF byte buffer from a backend response.
 * Requires %PDF magic bytes after normalization.
 */
export function extractPdfBuffer(raw: ArrayBuffer): PdfExtractResult {
  if (raw.byteLength === 0) {
    return { ok: false, message: 'PDF file is empty' };
  }

  const offset = findPdfStartOffset(new Uint8Array(raw));
  if (offset >= 0) {
    return {
      ok: true,
      buffer: offset === 0 ? raw : slicePdfFromOffset(raw, offset),
      offset,
    };
  }

  const fromIndexedMap = tryExtractFromIndexedByteMap(raw);
  if (fromIndexedMap) {
    return { ok: true, buffer: fromIndexedMap, offset: 0 };
  }

  const fromJson = tryExtractFromJson(raw);
  if (fromJson) {
    return { ok: true, buffer: fromJson, offset: 0 };
  }

  const fromBase64 = tryDecodeEntireBodyAsBase64(raw);
  if (fromBase64) {
    return { ok: true, buffer: fromBase64, offset: 0 };
  }

  const preview = new TextDecoder().decode(raw.slice(0, 256)).trim();
  if (preview.startsWith('<!DOCTYPE') || preview.startsWith('<html')) {
    return {
      ok: false,
      message: 'Received HTML instead of a PDF (check API URL / ngrok)',
      hint: 'html',
    };
  }

  if (preview.startsWith('{')) {
    try {
      const json = JSON.parse(new TextDecoder().decode(raw)) as {
        success?: boolean;
        message?: string;
        error?: string;
      };
      if (json.success === false || json.message || json.error) {
        return {
          ok: false,
          message: json.message ?? json.error ?? 'API returned JSON, not a PDF file',
          hint: 'json',
        };
      }
    } catch {
      return { ok: false, message: 'API returned JSON, not a PDF file', hint: 'json' };
    }
  }

  return {
    ok: false,
    message: 'Server did not return a valid PDF file',
    hint: 'unknown',
  };
}
