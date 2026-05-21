import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE, getTokenMaxAgeSeconds } from '@/lib/auth';
import { getDefaultHeaders } from '@/lib/api/config';
import type { LoginApiResponse } from '@/lib/api/types';
import { getApiBaseUrl, getApiTimeoutMs } from '@/lib/env';

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; rememberMe?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required' },
      { status: 400 }
    );
  }

  let baseUrl: string;
  try {
    baseUrl = getApiBaseUrl();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server is not configured for API access' },
      { status: 503 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to reach authentication server' },
      { status: 502 }
    );
  }

  let payload: LoginApiResponse;
  try {
    payload = (await backendRes.json()) as LoginApiResponse;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid response from authentication server' },
      { status: 502 }
    );
  }

  if (!backendRes.ok || !payload.success || !payload.data?.token) {
    return NextResponse.json(
      {
        success: false,
        message: payload.message ?? 'Invalid email or password',
      },
      { status: backendRes.status >= 400 ? backendRes.status : 401 }
    );
  }

  const { token, user } = payload.data;
  const rememberMe = body.rememberMe === true;
  const fallbackMaxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
  const maxAge = getTokenMaxAgeSeconds(token) ?? fallbackMaxAge;

  const response = NextResponse.json({
    success: true,
    data: { user },
    message: payload.message,
  });

  const cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };

  response.cookies.set(AUTH_TOKEN_COOKIE, token, {
    ...cookieOptions,
    httpOnly: true,
  });

  response.cookies.set(AUTH_USER_COOKIE, encodeURIComponent(JSON.stringify(user)), {
    ...cookieOptions,
    httpOnly: false,
  });

  return response;
}
