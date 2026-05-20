'use client';
import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { SystemSetting } from '@/types';
import { formatSettingKey } from '@/lib/mock-data/packaging-materials';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface SystemSettingsTableProps {
  settings: SystemSetting[];
  onChange: (settings: SystemSetting[]) => void;
}

export default function SystemSettingsTable({ settings, onChange }: SystemSettingsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');

  const startEdit = (row: SystemSetting) => {
    setEditingId(row.id);
    setDraftValue(row.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftValue('');
  };

  const saveEdit = (id: string) => {
    if (!draftValue.trim()) {
      toast.error('Value cannot be empty');
      return;
    }
    onChange(
      settings.map((s) =>
        s.id === id
          ? { ...s, value: draftValue.trim(), updatedAt: new Date().toISOString() }
          : s
      )
    );
    toast.success('Setting updated');
    cancelEdit();
  };

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
                        onClick={() => saveEdit(row.id)}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" leftIcon={<X size={13} />} onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Pencil size={13} />}
                      onClick={() => startEdit(row)}
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
