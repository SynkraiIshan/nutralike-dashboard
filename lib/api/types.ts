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

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  invitedBy: string;
  createdAt: string;
  inviterName?: string;
};

export type InviteEmployeePayload = {
  name: string;
  email: string;
  phone: string;
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
