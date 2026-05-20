export type Unit = 'g' | 'KG' | 'Ltr' | 'ml' | 'mg' | 'oz' | 'lb' | 'pcs';

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  pricePerHundredKg: number;
  lastUpdated: string;
}

export interface QuotationIngredientLine {
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  qtyUsed: number;
  pricePerHundredKg: number;
  totalPrice: number;
  source: 'database' | 'ai-estimated';
}

export type QuotationStatus = 'draft' | 'generated' | 'sent' | 'archived';

export interface Quotation {
  id: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  productDescription: string;
  ingredients: QuotationIngredientLine[];
  formulaBreakdown: string;
  totalCost: number;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  pdfUrl?: string;
}

export type UploadType = 'ingredient-file' | 'product-image' | 'product-doc';
export type UploadStatus = 'processing' | 'completed' | 'failed';

export interface Upload {
  id: string;
  fileName: string;
  fileType: string;
  uploadType: UploadType;
  status: UploadStatus;
  uploadedAt: string;
  processedRows?: number;
  linkedQuotationId?: string;
}

export interface DashboardStats {
  totalIngredients: number;
  quotationsThisMonth: number;
  completedUploads: number;
  pendingQuotations: number;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

export interface PackagingMaterialItem {
  id: string;
  itemName: string;
  minCost: number;
  maxCost: number;
}

export type PackagingType = 'jar' | 'sachet';
export type PackagingTier = 'min' | 'max';

export type PackagingMaterialsData = Record<
  PackagingType,
  Record<string, PackagingMaterialItem[]>
>;

export interface QuotationClientInfo {
  name: string;
  email: string;
  productName: string;
  description: string;
  packWeightG: string;
  packagingType: PackagingType | '';
  packagingTier: PackagingTier | '';
}
