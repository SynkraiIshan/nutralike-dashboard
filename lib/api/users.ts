import { apiRequest } from './client';
import type { ApiUser, UsersListData } from './types';

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
};

function mapApiUser(user: ApiUser): ManagedUser {
  return {
    id: user.id,
    name: user.name?.trim() || user.email,
    email: user.email,
    role: user.role,
    status: user.isActive ? 'Active' : 'Inactive',
  };
}

export async function fetchUsers() {
  const data = await apiRequest<UsersListData>('/api/users');
  return {
    users: data.users.map(mapApiUser),
    total: data.total,
  };
}
