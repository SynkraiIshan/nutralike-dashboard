import type { LineItem } from '@/components/quotations/IngredientLineTable';
import type { QuotationClientInfo } from '@/types';
import { parsePackWeightGrams } from '@/lib/packaging/constants';

export type BuildGenerateFormInput = {
  clientInfo: QuotationClientInfo;
  lines: LineItem[];
  file?: File | null;
};

export function buildGenerateQuotationFormData(input: BuildGenerateFormInput): FormData {
  const { clientInfo, lines, file } = input;
  const formData = new FormData();

  formData.append('clientName', clientInfo.name.trim());
  formData.append('productName', clientInfo.productName.trim());
  formData.append('packWeightG', String(parsePackWeightGrams(clientInfo.packWeightG)));
  formData.append('packagingType', clientInfo.packagingType);
  formData.append('packagingTier', clientInfo.packagingTier);

  const email = clientInfo.email.trim();
  if (email) formData.append('clientEmail', email);

  const description = clientInfo.description.trim();
  if (description) formData.append('productDescription', description);

  if (file) {
    formData.append('file', file, file.name);
  }

  const items = lines
    .filter((line) => line.ingredientName.trim())
    .map((line) => ({
      ingredientName: line.ingredientName.trim(),
      unit: line.unit,
      qtyUsed: line.qtyUsed,
      pricePerUnit: line.pricePerHundredKg,
      priceSource: line.source === 'database' ? 'database' : 'ai-estimated',
    }));

  if (items.length > 0) {
    formData.append('items', JSON.stringify(items));
  }

  return formData;
}
