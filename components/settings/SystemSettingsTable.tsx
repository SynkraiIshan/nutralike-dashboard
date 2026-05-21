'use client';
import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { SystemSetting } from '@/types';
import { updateSetting } from '@/lib/api/settings';
import { ApiError } from '@/lib/api/errors';
import { formatSettingKey } from '@/lib/settings/format';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface SystemSettingsTableProps {
  settings: SystemSetting[];
  onChange: (settings: SystemSetting[]) => void;
  loading?: boolean;
}

export default function SystemSettingsTable({
  settings,
  onChange,
  loading = false,
}: SystemSettingsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const startEdit = (row: SystemSetting) => {
    setEditingId(row.id);
    setDraftValue(row.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftValue('');
  };

  const saveEdit = async (row: SystemSetting) => {
    const value = draftValue.trim();
    if (!value) {
      toast.error('Value cannot be empty');
      return;
    }

    setSavingId(row.id);
    try {
      const { setting, message } = await updateSetting(row.key, { value });
      onChange(
        settings.map((s) =>
          s.id === row.id
            ? {
                id: setting.id,
                key: setting.key,
                value: setting.value,
                description: setting.description,
                updatedAt: setting.updatedAt,
              }
            : s
        )
      );
      toast.success(message ?? 'Setting updated');
      cancelEdit();
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to update setting. Please try again.';
      toast.error(msg);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <p className="px-6 py-10 text-sm text-[#555555] text-center">Loading settings…</p>
    );
  }

  if (settings.length === 0) {
    return (
      <p className="px-6 py-10 text-sm text-[#555555] text-center">No settings found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
            {['Setting', 'Value', 'Description', 'Last Updated', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {settings.map((row, i) => {
            const isEditing = editingId === row.id;
            return (
              <tr
                key={row.id}
                className={`border-b border-[#f2f6ef] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/40'}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-[#0a0a0a]">{formatSettingKey(row.key)}</p>
                  <p className="text-[11px] text-[#a3a29e] font-mono mt-0.5">{row.key}</p>
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <Input
                      value={draftValue}
                      onChange={(e) => setDraftValue(e.target.value)}
                      className="max-w-[140px]"
                    />
                  ) : (
                    <span className="font-mono font-medium text-[#314f2d]">{row.value}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#373737] max-w-[220px]">{row.description}</td>
                <td className="px-4 py-3 text-[#555555] whitespace-nowrap text-[12px]">
                  {formatDate(row.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Check size={13} />}
                        onClick={() => void saveEdit(row)}
                        loading={savingId === row.id}
                        disabled={savingId !== null}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<X size={13} />}
                        onClick={cancelEdit}
                        disabled={savingId !== null}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Pencil size={13} />}
                      onClick={() => startEdit(row)}
                      disabled={savingId !== null || editingId !== null}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
