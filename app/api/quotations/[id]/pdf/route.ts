import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, isTokenValid } from '@/lib/auth';
import { getApiBaseUrl } from '@/lib/env';
import {
  extractPdfBuffer,
  getPdfRequestTimeoutMs,
} from '@/lib/quotations/parse-pdf-buffer';

type RouteContext = { params: Promise<{ id: string }> };

function buildPdfResponseHeaders(
  backendRes: Response,
  quotationId: string,
  byteLength: number
): Headers {
  const headers = new Headers();
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Length', String(byteLength));
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');

  const disposition = backendRes.headers.get('Content-Disposition');
  if (disposition) {
    headers.set('Content-Disposition', disposition);
  } else {
    headers.set(
      'Content-Disposition',
      `attachment; filename="quotation-${quotationId}.pdf"`
    );
  }

  return headers;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!isTokenValid(token)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json(
      { success: false, message: 'Quotation id is required' },
      { status: 400 }
    );
  }

  let baseUrl: string;
  try {
    baseUrl = getApiBaseUrl();
  } catch {
    return NextResponse.json(
      { success: false, message: 'API base URL is not configured' },
      { status: 500 }
    );
  }

  const backendUrl = `${baseUrl}/api/quotations/${encodeURIComponent(id)}/pdf`;

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/pdf, application/octet-stream, */*',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(getPdfRequestTimeoutMs()),
    });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError');
    return NextResponse.json(
      {
        success: false,
        message: isTimeout
          ? 'PDF generation timed out. Try again in a moment.'
          : 'Could not reach quotation service',
      },
      { status: 504 }
    );
  }

  if (!backendRes.ok) {
    const errBody = await backendRes.arrayBuffer();
    const extracted = extractPdfBuffer(errBody);
    const message = extracted.ok ? 'PDF request failed' : extracted.message;
    return NextResponse.json(
      { success: false, message },
      { status: backendRes.status >= 400 ? backendRes.status : 502 }
    );
  }

  if (!backendRes.body) {
    return NextResponse.json(
      { success: false, message: 'PDF file is empty' },
      { status: 502 }
    );
  }

  const peek = await backendRes.clone().arrayBuffer();
  const extracted = extractPdfBuffer(peek);

  if (!extracted.ok) {
    return NextResponse.json(
      { success: false, message: extracted.message },
      { status: 502 }
    );
  }

  const headers = buildPdfResponseHeaders(
    backendRes,
    id,
    extracted.buffer.byteLength
  );

  const canStreamThrough =
    extracted.offset === 0 && extracted.buffer.byteLength === peek.byteLength;

  if (canStreamThrough) {
    return new NextResponse(backendRes.body, {
      status: 200,
      headers,
    });
  }

  return new NextResponse(extracted.buffer, {
    status: 200,
    headers,
  });
}
