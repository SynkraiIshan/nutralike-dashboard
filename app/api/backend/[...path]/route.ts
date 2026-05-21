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

  const contentType = request.headers.get('content-type');
  const isMultipart = contentType?.includes('multipart/form-data');
  const isPdfDownload = backendPath.endsWith('/pdf');

  const headers = new Headers();
  headers.set('ngrok-skip-browser-warning', 'true');
  headers.set('Authorization', `Bearer ${token}`);

  if (isPdfDownload) {
    headers.set('Accept', 'application/pdf, application/octet-stream, */*');
  } else {
    headers.set('Accept', 'application/json');
  }

  if (isMultipart && contentType) {
    headers.set('Content-Type', contentType);
  } else if (!isPdfDownload) {
    new Headers(getDefaultHeaders()).forEach((value, key) => {
      if (key.toLowerCase() !== 'authorization') headers.set(key, value);
    });
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

  const responseHeaders = new Headers();
  const backendContentType = backendRes.headers.get('Content-Type');
  if (backendContentType) {
    responseHeaders.set('Content-Type', backendContentType);
  } else if (isPdfDownload) {
    responseHeaders.set('Content-Type', 'application/pdf');
  } else {
    responseHeaders.set('Content-Type', 'application/json');
  }

  const disposition = backendRes.headers.get('Content-Disposition');
  if (disposition) responseHeaders.set('Content-Disposition', disposition);

  const contentLength = backendRes.headers.get('Content-Length');
  if (contentLength) responseHeaders.set('Content-Length', contentLength);

  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
