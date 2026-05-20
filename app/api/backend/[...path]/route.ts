import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, isTokenValid } from '@/lib/auth';
import { getDefaultHeaders } from '@/lib/api/config';
import { getApiBaseUrl } from '@/lib/env';


type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!isTokenValid(token)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { path } = await context.params;
  const backendPath = `/api/${path.join('/')}`;
  const search = request.nextUrl.search;
  const url = `${getApiBaseUrl()}${backendPath}${search}`;

  const headers = new Headers(getDefaultHeaders());
  headers.set('Authorization', `Bearer ${token}`);

  const contentType = request.headers.get('content-type');
  if (contentType?.includes('multipart/form-data')) {
    headers.delete('Content-Type');
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.arrayBuffer();
    if (body.byteLength > 0) init.body = body;
  }

  const backendRes = await fetch(url, init);
  const responseBody = await backendRes.arrayBuffer();

  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
