export type Unit = 'KG' | 'LTR' | 'GM' | 'ML' | 'PCS';

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

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  quotationCount: number;
  createdAt: string;
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
  activeClients: number;
  pendingQuotations: number;
}
