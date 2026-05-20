'use client';
import { useState, useEffect } from 'react';
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
import { MOCK_SYSTEM_SETTINGS } from '@/lib/mock-data/system-settings';
import { MOCK_PACKAGING_MATERIALS } from '@/lib/mock-data/packaging-materials';
import { SystemSetting, PackagingMaterialsData } from '@/types';
import { Settings as SettingsIcon, Users, Sliders, Plus, UserCog, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_USERS = [
  { id: 'u1', name: 'Kunal Nagani', email: 'kunal@nutralike.com', role: 'Admin', status: 'Active' },
  { id: 'u2', name: 'Priya Desai',  email: 'priya@nutralike.com', role: 'Viewer', status: 'Active' },
  { id: 'u3', name: 'Ravi Kumar',   email: 'ravi@nutralike.com',  role: 'Viewer', status: 'Inactive' },
];

const CURRENCY_OPTIONS  = [{ value: 'INR', label: 'INR - Indian Rupee' }, { value: 'USD', label: 'USD - US Dollar' }];
const DATE_FORMAT_OPT   = [{ value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }];
const ROLE_OPTIONS      = [{ value: 'Admin', label: 'Admin' }, { value: 'Viewer', label: 'Viewer' }];

const SETTINGS_TABS = ['pricing', 'users', 'prefs'] as const;

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('pricing');

  useEffect(() => {
    const requested = searchParams.get('tab');
    if (requested === 'formula') {
      setTab('pricing');
      return;
    }
    if (requested && SETTINGS_TABS.includes(requested as (typeof SETTINGS_TABS)[number])) {
      setTab(requested);
    }
  }, [searchParams]);

  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>(MOCK_SYSTEM_SETTINGS);
  const [packagingMaterials, setPackagingMaterials] =
    useState<PackagingMaterialsData>(MOCK_PACKAGING_MATERIALS);

  const [currency, setCurrency]   = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]  = useState('Viewer');

  const TABS = [
    { id: 'pricing', label: 'Pricing & Packaging', icon: <Sliders size={14} /> },
    { id: 'users',   label: 'User Management',   icon: <Users size={14} /> },
    { id: 'prefs',   label: 'System Preferences', icon: <SettingsIcon size={14} /> },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-6xl">
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === 'pricing' && (
        <div className="flex flex-col gap-6">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-[#c3c3c3]">
              <h2 className="type-h3-18 text-[#0a0a0a]">Global pricing settings</h2>
              <p className="text-sm text-[#555555] mt-0.5">
                Default costs, margins, and pack defaults used in quotation calculations
              </p>
            </div>
            <SystemSettingsTable settings={systemSettings} onChange={setSystemSettings} />
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
              />
            </div>
          </Card>
        </div>
      )}

      {tab === 'users' && (
        <Card padding={false}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#c3c3c3]">
            <div>
              <h2 className="type-h3-18 text-[#0a0a0a]">User Management</h2>
              <p className="text-sm text-[#555555] mt-0.5">{ADMIN_USERS.length} users</p>
            </div>
            <Button leftIcon={<Plus size={14} />} onClick={() => setInviteOpen(true)}>
              Invite User
            </Button>
          </div>
          <table className="w-full text-sm">
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
              {ADMIN_USERS.map((u, i) => (
                <tr key={u.id} className={`border-b border-[#f2f6ef] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/40'}`}>
                  <td className="px-5 py-3 font-medium text-[#0a0a0a]">{u.name}</td>
                  <td className="px-5 py-3 text-[#373737]">{u.email}</td>
                  <td className="px-5 py-3">
                    <Badge label={u.role} variant={u.role === 'Admin' ? 'info' : 'neutral'} />
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
                      {u.status === 'Active' && (
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<UserX size={13} />}
                          onClick={() => toast.success(`${u.name} deactivated`)}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <Modal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite User" width="sm">
        <div className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          />
          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!inviteEmail) { toast.error('Email is required'); return; }
              toast.success(`Invitation sent to ${inviteEmail}`);
              setInviteOpen(false);
              setInviteEmail('');
            }}>
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
