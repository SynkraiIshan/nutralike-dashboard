import { buildGenerateQuotationFormData } from '@/lib/quotations/build-generate-form';
import type { BuildGenerateFormInput } from '@/lib/quotations/build-generate-form';
import { buildApiUrl } from './config';
import { ApiError } from './errors';
import type {
  ApiErrorBody,
  ApiResponse,
  ExtractQuotationIngredientsData,
  GenerateQuotationData,
  GeneratedQuotation,
} from './types';

export type { GeneratedQuotation } from './types';
export {
  downloadQuotationPdf,
  openQuotationPdfInNewTab,
  verifyQuotationPdfAvailable,
} from '@/lib/quotations/download-quotation-pdf';

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export type ExtractQuotationIngredientsInput =
  | { file: File }
  | { text: string }
  | { productName: string };

export async function extractQuotationIngredients(
  input: ExtractQuotationIngredientsInput
): Promise<{ data: ExtractQuotationIngredientsData; message?: string }> {
  const formData = new FormData();

  if ('file' in input) {
    formData.append('file', input.file, input.file.name);
  } else if ('productName' in input) {
    const productName = input.productName.trim();
    if (!productName) throw new ApiError('Product name is required');
    formData.append('productName', productName);
  } else if ('text' in input) {
    const text = input.text.trim();
    if (!text) throw new ApiError('Paste ingredient text or upload a file');
    formData.append('text', text);
  } else {
    throw new ApiError('Provide a file, ingredient text, or product name');
  }

  const response = await fetch(buildApiUrl('/api/quotations/extract-ingredients'), {
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
    const envelope = parsed as ApiResponse<ExtractQuotationIngredientsData>;
    if (!envelope.success) {
      throw new ApiError(envelope.message ?? 'Failed to extract ingredients', {
        status: response.status,
        body: parsed as ApiErrorBody,
      });
    }
    return { data: envelope.data, message: envelope.message };
  }

  throw new ApiError('Invalid response from extraction service', { status: 502 });
}

export async function generateQuotation(
  input: BuildGenerateFormInput
): Promise<{ quotation: GeneratedQuotation; message?: string }> {
  if (!input.lines.length) {
    throw new ApiError('Add at least one ingredient before generating');
  }

  const formData = buildGenerateQuotationFormData(input);

  const response = await fetch(buildApiUrl('/api/quotations/generate'), {
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
    const envelope = parsed as ApiResponse<GenerateQuotationData>;
    if (!envelope.success || !envelope.data?.quotation) {
      throw new ApiError(envelope.message ?? 'Failed to generate quotation', {
        status: response.status,
        body: parsed as ApiErrorBody,
      });
    }
    return { quotation: envelope.data.quotation, message: envelope.message };
  }

  throw new ApiError('Invalid response from quotation service', { status: 502 });
}
