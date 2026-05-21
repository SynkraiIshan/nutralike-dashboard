import type { LogoutApiResponse } from './types';

export async function logoutSession(): Promise<string> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  let payload: LogoutApiResponse | null = null;
  try {
    payload = (await response.json()) as LogoutApiResponse;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? 'Logout failed');
  }

  return payload.message ?? 'Logged out successfully';
}

/** Calls Next logout route (backend + clears cookie), then redirects to login. */
export async function performLogout(): Promise<void> {
  try {
    await logoutSession();
  } finally {
    window.location.href = '/login';
  }
}
