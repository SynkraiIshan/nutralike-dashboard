import { apiRequest } from './client';
import { ApiError } from './errors';
import type {
  ApiErrorBody,
  ApiResponse,
  ApiUploadHistoryItem,
  ParseUploadData,
  UploadHistoryListData,
} from './types';
import type { UploadHistoryRecord } from '@/types';

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function parseIngredientFile(
  file: File
): Promise<{ data: ParseUploadData; message?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/uploads/parse', {
    method: 'POST',
    credentials: 'include',
    body: formData,
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
    const envelope = parsed as ApiResponse<ParseUploadData>;
    if (!envelope.success) {
      throw new ApiError(envelope.message ?? 'Failed to process file', {
        status: response.status,
        body: parsed as ApiErrorBody,
      });
    }
    return { data: envelope.data, message: envelope.message };
  }

  throw new ApiError('Invalid response from upload server', { status: 502 });
}

export function mapUploadHistoryItem(item: ApiUploadHistoryItem): UploadHistoryRecord {
  return {
    id: item.id,
    fileName: item.fileName,
    fileType: item.fileType,
    uploadType: item.uploadType,
    status: item.status,
    rowsAffected: item.rowsAffected,
    errorMessage: item.errorMessage,
    driveViewLink: item.driveViewLink,
    uploadedByName: item.uploadedBy.name,
    uploadedByEmail: item.uploadedBy.email,
    createdAt: item.createdAt,
  };
}

export type FetchUploadHistoryParams = {
  page?: number;
  limit?: number;
};

export async function fetchUploadHistory(params: FetchUploadHistoryParams = {}) {
  const { page = 1, limit = 20 } = params;
  const data = await apiRequest<UploadHistoryListData>('/api/uploads/history', {
    params: { page, limit },
  });
  return {
    uploads: data.uploads.map(mapUploadHistoryItem),
    pagination: data.pagination,
  };
}
