const DEFAULT_TIMEOUT_MS = 30_000;

export function getApiBaseUrl(): string {
  const url =
    process.env.API_BASE_URL?.trim() ??
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!url) {
    throw new Error(
      'Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL in .env.local'
    );
  }
  return url.replace(/\/$/, '');
}

export function getApiTimeoutMs(): number {
  const parsed = Number(process.env.API_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}
