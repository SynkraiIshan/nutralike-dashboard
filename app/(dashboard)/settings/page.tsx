'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import SystemSettingsTable from '@/components/settings/SystemSettingsTable';
import PackagingMaterialsTable from '@/components/settings/PackagingMaterialsTable';
import { deactivateEmployee, inviteEmployee } from '@/lib/api/employees';
import { fetchPackagingMaterials } from '@/lib/api/packaging';
import { fetchSettings } from '@/lib/api/settings';
import { fetchUsers, type ManagedUser } from '@/lib/api/users';
import { ApiError } from '@/lib/api/errors';
import { formatRoleLabel, isAdminRole } from '@/lib/auth-roles';
import { getClientAuthUser } from '@/lib/auth/session-user';
import type { AuthUser } from '@/lib/api/types';
import { SystemSetting, PackagingMaterialsData, PackagingType } from '@/types';
import {
  Settings as SettingsIcon,
  Users,
  Sliders,
  Plus,
  UserCog,
  UserX,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCY_OPTIONS  = [{ value: 'INR', label: 'INR - Indian Rupee' }, { value: 'USD', label: 'USD - US Dollar' }];
const DATE_FORMAT_OPT   = [{ value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }];

const PHONE_DIGITS = 10;

function formatPhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, PHONE_DIGITS);
}

const SETTINGS_TABS = ['pricing', 'users', 'prefs'] as const;

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageFallback />}>
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageFallback() {
  return (
    <div className="flex flex-col gap-4 max-w-6xl animate-pulse">
      <div className="h-10 rounded-lg bg-[#f2f6ef]" />
      <div className="h-64 rounded-lg bg-[#f2f6ef]" />
    </div>
  );
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('pricing');
  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setSessionUser(getClientAuthUser());
  }, []);

  useEffect(() => {
    const requested = searchParams.get('tab');
    if (requested === 'formula') {
      setTab('pricing');
      return;
    }
    if (requested === 'users') {
      const sessionUser = getClientAuthUser();
      if (sessionUser && !isAdminRole(sessionUser.role)) {
        setTab('pricing');
        toast.error('Only admins can access user management');
        return;
      }
    }
    if (requested && SETTINGS_TABS.includes(requested as (typeof SETTINGS_TABS)[number])) {
      setTab(requested);
    }
  }, [searchParams]);

  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [packagingMaterials, setPackagingMaterials] = useState<PackagingMaterialsData>({
    jar: {},
    sachet: {},
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [packagingLoading, setPackagingLoading] = useState(false);
  const [pricingLoaded, setPricingLoaded] = useState(false);

  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const settings = await fetchSettings();
      setSystemSettings(settings);
      const currencySetting = settings.find((s) => s.key === 'default_currency');
      const dateSetting = settings.find((s) => s.key === 'date_format');
      if (currencySetting) setCurrency(currencySetting.value);
      if (dateSetting) setDateFormat(dateSetting.value);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load pricing settings. Please try again.';
      toast.error(msg);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingsChange = (settings: SystemSetting[]) => {
    setSystemSettings(settings);
    const currencySetting = settings.find((s) => s.key === 'default_currency');
    const dateSetting = settings.find((s) => s.key === 'date_format');
    if (currencySetting) setCurrency(currencySetting.value);
    if (dateSetting) setDateFormat(dateSetting.value);
  };

  const loadPackaging = async (type: PackagingType) => {
    setPackagingLoading(true);
    try {
      const data = await fetchPackagingMaterials(type);
      setPackagingMaterials((prev) => ({
        jar: { ...prev.jar, ...data.jar },
        sachet: { ...prev.sachet, ...data.sachet },
      }));
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load packaging materials. Please try again.';
      toast.error(msg);
    } finally {
      setPackagingLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== 'pricing' || pricingLoaded) return;
    setPricingLoaded(true);
    void loadSettings();
    void loadPackaging('jar');
  }, [tab, pricingLoaded]);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const { users: rows, total } = await fetchUsers();
      setUsers(rows);
      setUsersTotal(total);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to load users. Please try again.';
      toast.error(msg);
      setUsers([]);
      setUsersTotal(0);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== 'users') return;
    void loadUsers();
  }, [tab]);

  const resetInviteForm = () => {
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
  };

  const closeInviteModal = () => {
    setInviteOpen(false);
    resetInviteForm();
  };

  const handleInviteSubmit = async () => {
    const name = inviteName.trim();
    const email = inviteEmail.trim();
    const phone = invitePhone.trim();

    if (!name) {
      toast.error('Name is required');
      return;
    }
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }
    if (phone.length !== PHONE_DIGITS) {
      toast.error(`Phone number must be exactly ${PHONE_DIGITS} digits`);
      return;
    }

    setInviteSubmitting(true);
    try {
      const employee = await inviteEmployee({ name, email, phone });
      setUsers((prev) => [
        {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role ?? 'EMPLOYEE',
          status: employee.isActive ? 'Active' : 'Inactive',
        },
        ...prev,
      ]);
      setUsersTotal((t) => t + 1);
      toast.success(
        employee.inviterName
          ? `${employee.name} invited successfully by ${employee.inviterName}`
          : `${employee.name} invited successfully`
      );
      closeInviteModal();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to send invite. Please try again.';
      toast.error(message);
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleDeactivate = async (user: ManagedUser) => {
    if (isAdminRole(user.role)) {
      toast.error('Admin accounts cannot be deactivated');
      return;
    }

    setDeactivatingId(user.id);
    try {
      const { message } = await deactivateEmployee(user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: 'Inactive' } : u
        )
      );
      toast.success(message ?? `${user.name} deactivated`);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to deactivate user. Please try again.';
      toast.error(msg);
    } finally {
      setDeactivatingId(null);
    }
  };

  const isSessionAdmin = sessionUser ? isAdminRole(sessionUser.role) : false;

  const tabs = useMemo(() => {
    const all = [
      { id: 'pricing', label: 'Pricing & Packaging', icon: <Sliders size={14} /> },
      { id: 'users', label: 'User Management', icon: <Users size={14} /> },
      { id: 'prefs', label: 'System Preferences', icon: <SettingsIcon size={14} /> },
    ];
    if (isSessionAdmin) return all;
    return all.filter((t) => t.id !== 'users');
  }, [isSessionAdmin]);

  const handleTabChange = (nextTab: string) => {
    if (nextTab === 'users' && !isSessionAdmin) {
      toast.error('Only admins can access user management');
      return;
    }
    setTab(nextTab);
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl">
      <Tabs tabs={tabs} activeTab={tab} onChange={handleTabChange} />

      {tab === 'pricing' && (
        <div className="flex flex-col gap-6">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-[#c3c3c3]">
              <h2 className="type-h3-18 text-[#0a0a0a]">Global pricing settings</h2>
              <p className="text-sm text-[#555555] mt-0.5">
                Default costs, margins, and pack defaults used in quotation calculations
              </p>
            </div>
            <SystemSettingsTable
              settings={systemSettings}
              onChange={handleSettingsChange}
              loading={settingsLoading}
            />
          </Card>

          <Card padding={false}>
            <div className="px-6 py-4 border-b border-[#c3c3c3]">
              <h2 className="type-h3-18 text-[#0a0a0a]">Packaging material costs</h2>
              <p className="text-sm text-[#555555] mt-0.5">
                Min / max costs per item by packaging type and pack weight
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <PackagingMaterialsTable
                materials={packagingMaterials}
                onChange={setPackagingMaterials}
                loading={packagingLoading}
                onPackagingTypeChange={(type) => void loadPackaging(type)}
              />
            </div>
          </Card>
        </div>
      )}

      {tab === 'users' && (
        <Card padding={false}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-[#c3c3c3]">
            <div>
              <h2 className="type-h3-18 text-[#0a0a0a]">User Management</h2>
              <p className="text-sm text-[#555555] mt-0.5">
                {usersLoading
                  ? 'Loading…'
                  : `${usersTotal} user${usersTotal !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw size={14} />}
                onClick={() => void loadUsers()}
                loading={usersLoading}
              >
                Refresh
              </Button>
              <Button leftIcon={<Plus size={14} />} onClick={() => setInviteOpen(true)}>
                Invite User
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#555555]">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#555555]">
                    No users found.
                  </td>
                </tr>
              ) : (
              users.map((u, i) => (
                <tr key={u.id} className={`border-b border-[#f2f6ef] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/40'}`}>
                  <td className="px-5 py-3 font-medium text-[#0a0a0a]">
                    <div>{u.name}</div>
                  </td>
                  <td className="px-5 py-3 text-[#373737]">{u.email}</td>
                  <td className="px-5 py-3">
                    <Badge
                      label={formatRoleLabel(u.role)}
                      variant={isAdminRole(u.role) ? 'info' : 'neutral'}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Badge label={u.status} variant={u.status === 'Active' ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<UserCog size={13} />}
                        onClick={() => toast.success(`Role updated for ${u.name}`)}
                      >
                        Edit Role
                      </Button>
                      {u.status === 'Active' && !isAdminRole(u.role) && (
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<UserX size={13} />}
                          onClick={() => void handleDeactivate(u)}
                          loading={deactivatingId === u.id}
                          disabled={deactivatingId !== null}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
          </div>
        </Card>
      )}

      {tab === 'prefs' && (
        <Card>
          <h2 className="type-h3-18 text-[#0a0a0a] mb-5">System Preferences</h2>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Default Currency"
                options={CURRENCY_OPTIONS}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
              <Select
                label="Date Format"
                options={DATE_FORMAT_OPT}
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              />
            </div>
            <div>
              <Button onClick={() => toast.success('Preferences saved successfully')}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Modal isOpen={inviteOpen} onClose={closeInviteModal} title="Invite User" width="sm">
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Neel Sharma"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            required
            disabled={inviteSubmitting}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            disabled={inviteSubmitting}
          />
          <Input
            label="Phone Number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9999999999"
            value={invitePhone}
            onChange={(e) => setInvitePhone(formatPhoneInput(e.target.value))}
            maxLength={PHONE_DIGITS}
            required
            disabled={inviteSubmitting}
          />
          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={closeInviteModal} disabled={inviteSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleInviteSubmit} disabled={inviteSubmitting}>
              {inviteSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                'Send Invite'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
