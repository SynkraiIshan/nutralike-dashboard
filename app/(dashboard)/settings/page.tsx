'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Settings as SettingsIcon, Users, Sliders, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_USERS = [
  { id: 'u1', name: 'Kunal Nagani', email: 'kunal@nutralike.com', role: 'Admin', status: 'Active' },
  { id: 'u2', name: 'Priya Desai',  email: 'priya@nutralike.com', role: 'Viewer', status: 'Active' },
  { id: 'u3', name: 'Ravi Kumar',   email: 'ravi@nutralike.com',  role: 'Viewer', status: 'Inactive' },
];

const CURRENCY_OPTIONS  = [{ value: 'INR', label: 'INR - Indian Rupee' }, { value: 'USD', label: 'USD - US Dollar' }];
const DATE_FORMAT_OPT   = [{ value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }];
const FORMULA_TYPE_OPT  = [{ value: 'simple', label: 'Simple Markup' }, { value: 'tiered', label: 'Tiered Markup' }];
const ROLE_OPTIONS      = [{ value: 'Admin', label: 'Admin' }, { value: 'Viewer', label: 'Viewer' }];

export default function SettingsPage() {
  const [tab, setTab] = useState('formula');

  // Formula tab
  const [markup, setMarkup]     = useState(15);
  const [overhead, setOverhead] = useState(5);
  const [minQuote, setMinQuote] = useState(500);

  // Prefs tab
  const [currency, setCurrency]   = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
  const [autoSave, setAutoSave]   = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]  = useState('Viewer');

  const TABS = [
    { id: 'formula', label: 'Quotation Formula', icon: <Sliders size={14} /> },
    { id: 'users',   label: 'User Management',   icon: <Users size={14} /> },
    { id: 'prefs',   label: 'System Preferences', icon: <SettingsIcon size={14} /> },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {/* FORMULA TAB */}
      {tab === 'formula' && (
        <Card>
          <h2 className="type-h3-18 text-[#0a0a0a] mb-5">Quotation Formula Configuration</h2>
          <div className="flex flex-col gap-5">
            <Select
              label="Formula Type"
              options={FORMULA_TYPE_OPT}
              defaultValue="simple"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Markup Percentage (%)"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={markup}
                onChange={(e) => setMarkup(Number(e.target.value))}
              />
              <Input
                label="Overhead (Fixed ₹)"
                type="number"
                min="0"
                step="0.01"
                value={overhead}
                onChange={(e) => setOverhead(Number(e.target.value))}
                leftAddon="₹"
              />
              <Input
                label="Minimum Quotation (₹)"
                type="number"
                min="0"
                value={minQuote}
                onChange={(e) => setMinQuote(Number(e.target.value))}
                leftAddon="₹"
              />
            </div>

            {/* Live preview */}
            <div className="bg-[#f2f6ef] rounded-xl p-4 border border-[#c3c3c3]">
              <p className="text-[12px] font-semibold text-[#555555] uppercase tracking-widest mb-2">Formula Preview</p>
              <p className="font-mono text-[#314f2d] text-sm font-medium">
                Total = (Ingredient Cost × {(1 + markup / 100).toFixed(2)}) + ₹{overhead.toFixed(2)}
              </p>
              <p className="text-[12px] text-[#555555] mt-1">
                Minimum quotation value: ₹{minQuote.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <Button onClick={() => toast.success('Formula settings saved successfully')}>
                Save Formula
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* USERS TAB */}
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toast.success(`Role updated for ${u.name}`)}
                        className="text-[12px] text-[#314f2d] hover:underline font-medium"
                      >
                        Edit Role
                      </button>
                      {u.status === 'Active' && (
                        <button
                          onClick={() => toast.success(`${u.name} deactivated`)}
                          className="text-[12px] text-red-500 hover:underline font-medium"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* PREFS TAB */}
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
            <div className="flex flex-col gap-4 py-2 border-t border-[#f2f6ef]">
              <Toggle
                label="Auto-save quotation drafts"
                description="Automatically save in-progress quotations every 2 minutes"
                checked={autoSave}
                onChange={setAutoSave}
                id="toggle-autosave"
              />
              <Toggle
                label="Email notifications on new quotation"
                description="Receive an email when a quotation is generated or sent"
                checked={emailNotif}
                onChange={setEmailNotif}
                id="toggle-email"
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

      {/* Invite User Modal */}
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
