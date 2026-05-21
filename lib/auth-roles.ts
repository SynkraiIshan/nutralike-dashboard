/** Roles that cannot be deactivated from User Management */
export function isAdminRole(role: string): boolean {
  return role.trim().toUpperCase() === 'ADMIN';
}

export function formatRoleLabel(role: string): string {
  const normalized = role.trim().toUpperCase();
  if (normalized === 'ADMIN') return 'Admin';
  if (normalized === 'DEVELOPER') return 'Developer';
  if (normalized === 'EMPLOYEE') return 'Employee';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
