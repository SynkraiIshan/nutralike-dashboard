export const AUTH_TOKEN_COOKIE = 'nutralike_token';

/** Non-httpOnly cookie for displaying name/role in the UI (set at login). */
export const AUTH_USER_COOKIE = 'nutralike_user';

type JwtPayload = { exp?: number };

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function getTokenMaxAgeSeconds(token: string): number | undefined {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return undefined;
  const remaining = Math.floor(payload.exp - Date.now() / 1000);
  return remaining > 0 ? remaining : undefined;
}
