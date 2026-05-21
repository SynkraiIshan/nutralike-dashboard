import type { Unit } from '@/types';
import type { Ingredient } from '@/types';
import { apiDelete, apiPost, apiPut, apiRequest } from './client';
import type {
  ApiIngredient,
  CreateIngredientPayload,
  DeleteIngredientData,
  IngredientsListData,
  UpdateIngredientPayload,
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

export type IngredientSort =
  | 'price_desc'
  | 'price_asc'
  | 'name_asc'
  | 'name_desc'
  | 'updated_desc'
  | 'updated_asc';

export type FetchIngredientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: IngredientSort;
};

export const INGREDIENT_SORT_OPTIONS: { value: '' | IngredientSort; label: string }[] = [
  { value: '', label: 'Default order' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'updated_asc', label: 'Oldest updated' },
];

export function fetchIngredients(params: FetchIngredientsParams = {}) {
  const { page = 1, limit = 10, search, sort } = params;
  return apiRequest<IngredientsListData>('/api/ingredients', {
    method: 'GET',
    params: {
      page,
      limit,
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(sort ? { sort } : {}),
    },
  });
}

export function createIngredient(payload: CreateIngredientPayload) {
  return apiPost<ApiIngredient>('/api/ingredients', payload);
}

export function updateIngredient(id: string, payload: UpdateIngredientPayload) {
  return apiPut<ApiIngredient>(`/api/ingredients/${id}`, payload);
}

export function deleteIngredient(id: string) {
  return apiDelete<DeleteIngredientData>(`/api/ingredients/${id}`);
}
