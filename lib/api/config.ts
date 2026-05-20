import { getApiBaseUrl, getApiTimeoutMs } from '@/lib/env';

export { getApiTimeoutMs };

/** Headers required for ngrok free tier + JSON APIs */
export function getDefaultHeaders(skipJsonContentType = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  if (!skipJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/** Browser auth uses httpOnly cookies + /api/backend proxy (no Authorization header in JS). */
export function getAuthHeaders(): HeadersInit {
  return {};
}

/**
 * Browser calls go through the Next.js proxy so the JWT stays in httpOnly cookies.
 * Server-side code uses the external API base URL directly.
 */
export function buildApiUrl(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  const isBrowser = typeof window !== 'undefined';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (isBrowser) {
    const proxyPath = normalizedPath.startsWith('/api/')
      ? `/api/backend${normalizedPath.slice(4)}`
      : `/api/backend${normalizedPath}`;
    const origin = window.location.origin;
    const url = new URL(proxyPath, origin);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === '') continue;
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  const base = getApiBaseUrl();
  const url = new URL(`${base}${normalizedPath}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}
