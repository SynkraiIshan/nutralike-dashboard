import { apiPut, apiRequest } from './client';
import type { ApiSystemSetting } from './types';
import type { SystemSetting } from '@/types';

export type UpdateSettingPayload = {
  value: string;
};

export function fetchSettings(): Promise<SystemSetting[]> {
  return apiRequest<ApiSystemSetting[]>('/api/settings');
}

export async function updateSetting(key: string, payload: UpdateSettingPayload) {
  const { data, message } = await apiPut<ApiSystemSetting>(
    `/api/settings/${encodeURIComponent(key)}`,
    payload
  );
  return { setting: data, message };
}
