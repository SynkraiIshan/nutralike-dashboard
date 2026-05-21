import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE } from '@/lib/auth';
import { getDefaultHeaders } from '@/lib/api/config';
import type { LogoutApiResponse } from '@/lib/api/types';
import { getApiBaseUrl, getApiTimeoutMs } from '@/lib/env';

function applyClearedAuthCookies(response: NextResponse) {
  const clearOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    ...clearOptions,
    httpOnly: true,
  });
  response.cookies.set(AUTH_USER_COOKIE, '', {
    ...clearOptions,
    httpOnly: false,
  });
  return response;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  let message = 'Logged out successfully';

  if (token) {
    try {
      const baseUrl = getApiBaseUrl();
      const backendRes = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(getApiTimeoutMs()),
      });

      try {
        const payload = (await backendRes.json()) as LogoutApiResponse;
        if (payload.message) {
          message = payload.message;
        }
      } catch {
        /* still clear local session */
      }
    } catch {
      /* backend unreachable — still clear local session */
    }
  }

  const response = NextResponse.json({
    success: true,
    data: null,
    message,
  });

  return applyClearedAuthCookies(response);
}
