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

export type UploadHistoryStatus = 'processing' | 'completed' | 'failed';

export type IngredientChangeType = 'created' | 'updated' | 'deleted' | string;

export interface ReportIngredientChangeRecord {
  id: string;
  ingredientName: string;
  oldPrice: number | null;
  newPrice: number | null;
  changePercent: number | null;
  changeType: IngredientChangeType;
  changedByName: string | null;
  changedByEmail: string;
  createdAt: string;
}

export interface ReportQuotationRecord {
  id: string;
  quotationNumber: string;
  clientName: string;
  productName: string;
  totalPrice: number;
  packWeightG: number;
  createdAt: string;
  userName: string | null;
  userEmail: string;
}

export interface UploadHistoryRecord {
  id: string;
  fileName: string;
  fileType: string;
  uploadType: string;
  status: UploadHistoryStatus;
  rowsAffected: number | null;
  errorMessage: string | null;
  driveViewLink: string | null;
  uploadedByName: string | null;
  uploadedByEmail: string;
  createdAt: string;
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
