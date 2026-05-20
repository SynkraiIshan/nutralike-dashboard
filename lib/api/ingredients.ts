import type { Unit } from '@/types';
import type { Ingredient } from '@/types';
import { apiPost, apiRequest } from './client';
import type {
  ApiIngredient,
  CreateIngredientPayload,
  IngredientsListData,
} from './types';

export function mapIngredientFromApi(item: ApiIngredient): Ingredient {
  return {
    id: item.id,
    name: item.name,
    unit: item.unit as Unit,
    pricePerHundredKg: item.pricePerUnit,
    lastUpdated: item.lastUpdated,
  };
}

export type FetchIngredientsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export function fetchIngredients(params: FetchIngredientsParams = {}) {
  const { page = 1, limit = 10, search } = params;
  return apiRequest<IngredientsListData>('/api/ingredients', {
    method: 'GET',
    params: {
      page,
      limit,
      ...(search?.trim() ? { search: search.trim() } : {}),
    },
  });
}

export function createIngredient(payload: CreateIngredientPayload) {
  return apiPost<ApiIngredient>('/api/ingredients', payload);
}
