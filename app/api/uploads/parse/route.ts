import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, isTokenValid } from '@/lib/auth';
import { getApiBaseUrl, getApiTimeoutMs } from '@/lib/env';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!isTokenValid(token)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid form data' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json(
      { success: false, message: 'No file provided' },
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

  const backendForm = new FormData();
  const fileName = file instanceof File ? file.name : 'upload';
  backendForm.append('file', file, fileName);

  try {
    const backendRes = await fetch(`${baseUrl}/api/uploads/parse`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
      body: backendForm,
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    });

    const body = await backendRes.text();

    return new NextResponse(body, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to reach upload server' },
      { status: 502 }
    );
  }
}
