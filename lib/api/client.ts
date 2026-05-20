import { buildApiUrl, getAuthHeaders, getDefaultHeaders } from './config';
import { ApiError } from './errors';
import type { ApiErrorBody, ApiResponse } from './types';

type ApiRequestInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
};

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestInit = {}
): Promise<T> {
  const { method = 'GET', body, params } = options;

  const response = await fetch(buildApiUrl(path, params), {
    method,
    headers: {
      ...getDefaultHeaders(),
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const parsed = await parseJson(response);

  if (!response.ok) {
    const message =
      parsed && typeof parsed === 'object' && 'message' in parsed
        ? String((parsed as ApiErrorBody).message)
        : `Request failed (${response.status})`;
    throw new ApiError(message, {
      status: response.status,
      body: parsed as ApiErrorBody,
    });
  }

  if (parsed && typeof parsed === 'object' && 'success' in parsed) {
    const envelope = parsed as ApiResponse<T>;
    if (!envelope.success) {
      throw new ApiError(envelope.message ?? 'Request was not successful', {
        status: response.status,
        body: parsed as ApiErrorBody,
      });
    }
    return envelope.data;
  }

  return parsed as T;
}

export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<{ data: T; message?: string }> {
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: {
      ...getDefaultHeaders(),
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const parsed = await parseJson(response);

  if (!response.ok) {
    const message =
      parsed && typeof parsed === 'object' && 'message' in parsed
        ? String((parsed as ApiErrorBody).message)
        : `Request failed (${response.status})`;
    throw new ApiError(message, {
      status: response.status,
      body: parsed as ApiErrorBody,
    });
  }

  if (parsed && typeof parsed === 'object' && 'success' in parsed) {
    const envelope = parsed as ApiResponse<T>;
    if (!envelope.success) {
      throw new ApiError(envelope.message ?? 'Request was not successful', {
        status: response.status,
        body: parsed as ApiErrorBody,
      });
    }
    return { data: envelope.data, message: envelope.message };
  }

  return { data: parsed as T };
}
