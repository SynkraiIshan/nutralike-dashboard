import { apiRequest } from './client';
import type { Employee, InviteEmployeePayload } from './types';

export function inviteEmployee(payload: InviteEmployeePayload) {
  return apiRequest<Employee>('/api/employees', {
    method: 'POST',
    body: payload,
  });
}
