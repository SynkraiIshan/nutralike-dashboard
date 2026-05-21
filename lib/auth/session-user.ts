import type { AuthUser } from '@/lib/api/types';
import { AUTH_USER_COOKIE } from '@/lib/auth';

export function getClientAuthUser(): AuthUser | null {
  if (typeof document === 'undefined') return null;

  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${AUTH_USER_COOKIE}=`)) continue;

    const encoded = trimmed.slice(AUTH_USER_COOKIE.length + 1);
    try {
      return JSON.parse(decodeURIComponent(encoded)) as AuthUser;
    } catch {
      return null;
    }
  }

  return null;
}

export function getDisplayName(user: AuthUser): string {
  return user.name?.trim() || user.email;
}

export function getUserInitials(user: AuthUser): string {
  const name = getDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
