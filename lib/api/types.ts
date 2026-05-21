export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  timeoutMs?: number;
  skipJsonContentType?: boolean;
  headers?: HeadersInit;
} & Omit<RequestInit, 'method' | 'body' | 'headers' | 'signal'>;

export type AuthUser = {  id: string;
  email: string;
  role: string;
  name: string;
  companyName: string | null;
  phone: string | null;
  isActive: boolean;
  invitedBy: string | null;
  createdAt: string;
};

export type LoginApiResponse = {
  success: boolean;
  data?: {
    token: string;
    user: AuthUser;
  };
  message?: string;
};

export type ForgotPasswordApiResponse = {
  success: boolean;
  data: null;
  message?: string;
};

export type LogoutApiResponse = {
  success: boolean;
  data: null;
  message?: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  isActive: boolean;
  invitedBy: string;
  createdAt: string;
  inviterName?: string;
};

export type DeactivateEmployeeData = {
  id: string;
  isActive: boolean;
};

export type InviteEmployeePayload = {
  name: string;
  email: string;
  phone: string;
};

export type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  invitedBy: string | null;
};

export type UsersListData = {
  users: ApiUser[];
  total: number;
};

export type ApiIngredient = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  lastUpdated: string;
  createdAt: string;
};

export type ApiPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type IngredientsListData = {
  ingredients: ApiIngredient[];
  pagination: ApiPagination;
};

export type CreateIngredientPayload = {
  name: string;
  unit: string;
  pricePerUnit: number;
};

export type UpdateIngredientPayload = CreateIngredientPayload;

export type DeleteIngredientData = {
  id: string;
};

export type ParseUploadSummary = {
  total_extracted: number;
  total_updated: number;
  total_added: number;
  total_skipped: number;
};

export type ExtractedQuotationIngredient = {
  name: string;
  unit: string;
  qtyUsed: number;
};

export type ExtractQuotationIngredientsData = {
  ingredients: ExtractedQuotationIngredient[];
  source: 'text' | 'file' | 'ai' | string;
  count: number;
};

export type GeneratedQuotationItem = {
  ingredientName: string;
  unit: string;
  qtyUsed: number;
  pricePerUnit: number;
  totalPrice: number;
  priceSource: string;
};

export type QuotationPackagingCosts = {
  pouchCost: number;
  boxCost: number;
  ccpcCost: number;
  otherCost: number;
  total: number;
  source?: string;
};

export type QuotationPriceBreakdown = {
  subtotal: number;
  wastage: number;
  totalPer100KG?: number;
  perKgPrice: number;
  perPackPrice: number;
  packagingTotal: number;
  rmTotal?: number;
  profit: number;
  finalPrice: number;
  packWeightG?: number;
  wastagePercent?: number;
  profitPercent?: number;
};

export type GeneratedQuotation = {
  id: string;
  quotationNumber: string;
  clientName: string;
  productName: string;
  packWeightG: number;
  productType?: string;
  items: GeneratedQuotationItem[];
  packaging: QuotationPackagingCosts;
  breakdown: QuotationPriceBreakdown;
  totalPrice: number;
  userId?: string;
  createdAt: string;
};

export type GenerateQuotationData = {
  quotation: GeneratedQuotation;
};

export type ParseUploadData = {
  extracted: number;
  updated: ApiIngredient[];
  added: ApiIngredient[];
  skipped: unknown[];
  summary: ParseUploadSummary;
};

export type ApiSystemSetting = {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
};

export type ApiPackagingItem = {
  id: string;
  itemName: string;
  minCost: number;
  maxCost: number;
};

/** Keys are packaging types (jar, sachet); values are weight → items */
export type PackagingMaterialsApiData = Record<
  string,
  Record<string, ApiPackagingItem[]>
>;

export type DashboardStatsApi = {
  totalIngredients: number;
  ingredientsThisMonth: number;
  totalQuotations: number;
  quotationsThisMonth: number;
  quotationsLastMonth: number;
  quotationsChange: number;
  activeEmployees: number;
  newEmployeesThisWeek: number;
};

export type DashboardRecentQuotation = {
  id: string;
  quotationNumber: string;
  clientName: string;
  productName: string;
  totalPrice: number;
  createdAt: string;
  packWeightG: number;
};

export type DashboardActivityType =
  | 'quotation_created'
  | 'ingredient_updated'
  | 'employee_added'
  | string;

export type DashboardActivity = {
  type: DashboardActivityType;
  message: string;
  detail: string | null;
  time: string;
};

export type DashboardTopIngredient = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  lastUpdated: string;
};

export type DashboardData = {
  stats: DashboardStatsApi;
  recentQuotations: DashboardRecentQuotation[];
  activityFeed: DashboardActivity[];
  topIngredients: DashboardTopIngredient[];
};

export type UploadHistoryUploader = {
  id: string;
  name: string | null;
  email: string;
};

export type ApiUploadHistoryItem = {
  id: string;
  fileName: string;
  fileType: string;
  uploadType: string;
  status: 'processing' | 'completed' | 'failed';
  rowsAffected: number | null;
  errorMessage: string | null;
  driveFileId: string | null;
  driveViewLink: string | null;
  uploadedBy: UploadHistoryUploader;
  createdAt: string;
};

export type UploadHistoryListData = {
  uploads: ApiUploadHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ReportQuotationUser = {
  id: string;
  name: string | null;
  email: string;
};

export type ApiReportQuotation = {
  id: string;
  quotationNumber: string;
  clientName: string;
  productName: string;
  totalPrice: number;
  packWeightG: number;
  createdAt: string;
  user: ReportQuotationUser;
};

export type ReportQuotationsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ReportQuotationsListData = {
  quotations: ApiReportQuotation[];
  pagination: ReportQuotationsPagination;
};

export type IngredientChangeType = 'created' | 'updated' | 'deleted' | string;

export type ApiReportIngredientChange = {
  id: string;
  ingredientName: string;
  oldPrice: number | null;
  newPrice: number | null;
  changePercent: number | null;
  changeType: IngredientChangeType;
  changedBy: ReportQuotationUser;
  createdAt: string;
};

export type ReportIngredientChangesListData = {
  changes: ApiReportIngredientChange[];
  pagination: ReportQuotationsPagination;
};
