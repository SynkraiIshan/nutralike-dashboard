import { apiRequest } from './client';
import type { DashboardData } from './types';

export function fetchDashboard(): Promise<DashboardData> {
  return apiRequest<DashboardData>('/api/dashboard');
}
