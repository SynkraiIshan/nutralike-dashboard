import { apiPut, apiRequest } from './client';
import type { ApiPackagingItem, PackagingMaterialsApiData } from './types';
import type {
  PackagingMaterialItem,
  PackagingMaterialsData,
  PackagingType,
} from '@/types';

function mapPackagingData(data: PackagingMaterialsApiData): PackagingMaterialsData {
  const result: PackagingMaterialsData = { jar: {}, sachet: {} };

  for (const type of ['jar', 'sachet'] as PackagingType[]) {
    const byWeight = data[type];
    if (!byWeight) continue;

    result[type] = {};
    for (const [weight, items] of Object.entries(byWeight)) {
      result[type][weight] = items.map(
        (item): PackagingMaterialItem => ({
          id: item.id,
          itemName: item.itemName,
          minCost: item.minCost,
          maxCost: item.maxCost,
        })
      );
    }
  }

  return result;
}

export function fetchPackagingMaterials(type: PackagingType): Promise<PackagingMaterialsData> {
  return apiRequest<PackagingMaterialsApiData>('/api/packaging', {
    params: { type },
  }).then(mapPackagingData);
}

export type UpdatePackagingPayload = {
  minCost: number;
  maxCost: number;
};

export async function updatePackagingItem(id: string, payload: UpdatePackagingPayload) {
  const { data, message } = await apiPut<ApiPackagingItem>(`/api/packaging/${id}`, payload);
  return {
    item: {
      id: data.id,
      itemName: data.itemName,
      minCost: data.minCost,
      maxCost: data.maxCost,
    } satisfies PackagingMaterialItem,
    message,
  };
}
