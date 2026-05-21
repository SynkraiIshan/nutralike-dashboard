import { apiRequest } from './client';
import type {
  ApiReportIngredientChange,
  ApiReportQuotation,
  ReportIngredientChangesListData,
  ReportQuotationsListData,
} from './types';
import type { ReportIngredientChangeRecord, ReportQuotationRecord } from '@/types';

export function mapReportQuotation(item: ApiReportQuotation): ReportQuotationRecord {
  return {
    id: item.id,
    quotationNumber: item.quotationNumber,
    clientName: item.clientName,
    productName: item.productName,
    totalPrice: item.totalPrice,
    packWeightG: item.packWeightG,
    createdAt: item.createdAt,
    userName: item.user.name,
    userEmail: item.user.email,
  };
}

export type FetchReportQuotationsParams = {
  page?: number;
  limit?: number;
};

export async function fetchReportQuotations(params: FetchReportQuotationsParams = {}) {
  const { page = 1, limit = 20 } = params;
  const data = await apiRequest<ReportQuotationsListData>('/api/reports/quotations', {
    params: { page, limit },
  });
  return {
    quotations: data.quotations.map(mapReportQuotation),
    pagination: data.pagination,
  };
}

export function mapReportIngredientChange(
  item: ApiReportIngredientChange
): ReportIngredientChangeRecord {
  return {
    id: item.id,
    ingredientName: item.ingredientName,
    oldPrice: item.oldPrice,
    newPrice: item.newPrice,
    changePercent: item.changePercent,
    changeType: item.changeType,
    changedByName: item.changedBy.name,
    changedByEmail: item.changedBy.email,
    createdAt: item.createdAt,
  };
}

export type FetchReportIngredientChangesParams = {
  page?: number;
  limit?: number;
};

export async function fetchReportIngredientChanges(
  params: FetchReportIngredientChangesParams = {}
) {
  const { page = 1, limit = 20 } = params;
  const data = await apiRequest<ReportIngredientChangesListData>('/api/reports/ingredients', {
    params: { page, limit },
  });
  return {
    changes: data.changes.map(mapReportIngredientChange),
    pagination: data.pagination,
  };
}
