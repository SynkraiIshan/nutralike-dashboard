import { NextRequest, NextResponse } from 'next/server';
import { getDefaultHeaders } from '@/lib/api/config';
import type { ForgotPasswordApiResponse } from '@/lib/api/types';
import { getApiBaseUrl, getApiTimeoutMs } from '@/lib/env';

const FALLBACK_SUCCESS_MESSAGE =
  'If this email exists, reset link has been sent';

export async function POST(request: NextRequest) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email is required' },
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
    backendRes = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to reach authentication server' },
      { status: 502 }
    );
  }

  let payload: ForgotPasswordApiResponse;
  try {
    payload = (await backendRes.json()) as ForgotPasswordApiResponse;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid response from authentication server' },
      { status: 502 }
    );
  }

  if (!backendRes.ok || !payload.success) {
    return NextResponse.json(
      {
        success: false,
        message: payload.message ?? 'Unable to process request. Please try again.',
      },
      { status: backendRes.status >= 400 ? backendRes.status : 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: null,
    message: payload.message ?? FALLBACK_SUCCESS_MESSAGE,
  });
}
