import { apiDelete, apiRequest } from './client';
import type {
  DeactivateEmployeeData,
  Employee,
  InviteEmployeePayload,
} from './types';

export function inviteEmployee(payload: InviteEmployeePayload) {
  return apiRequest<Employee>('/api/employees', {
    method: 'POST',
    body: payload,
  });
}

export function deactivateEmployee(id: string) {
  return apiDelete<DeactivateEmployeeData>(`/api/employees/${id}`);
}
