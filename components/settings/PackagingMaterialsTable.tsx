'use client';
import { useEffect, useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import {
  PackagingMaterialItem,
  PackagingMaterialsData,
  PackagingType,
} from '@/types';
import {
  PACKAGING_TYPE_OPTIONS,
  getPackWeightOptions,
} from '@/lib/packaging/constants';
import { updatePackagingItem } from '@/lib/api/packaging';
import { ApiError } from '@/lib/api/errors';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface PackagingMaterialsTableProps {
  materials: PackagingMaterialsData;
  onChange: (materials: PackagingMaterialsData) => void;
  loading?: boolean;
  onPackagingTypeChange?: (type: PackagingType) => void;
}

export default function PackagingMaterialsTable({
  materials,
  onChange,
  loading = false,
  onPackagingTypeChange,
}: PackagingMaterialsTableProps) {
  const [packagingType, setPackagingType] = useState<PackagingType>('jar');
  const weightOptions = getPackWeightOptions(packagingType, materials);
  const [packWeight, setPackWeight] = useState(weightOptions[0]?.value ?? '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftMin, setDraftMin] = useState('');
  const [draftMax, setDraftMax] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const options = getPackWeightOptions(packagingType, materials);
    if (!options.some((o) => o.value === packWeight)) {
      setPackWeight(options[0]?.value ?? '');
    }
  }, [packagingType, packWeight, materials]);

  const handlePackagingTypeChange = (type: PackagingType) => {
    setPackagingType(type);
    onPackagingTypeChange?.(type);
  };

  const rows: PackagingMaterialItem[] =
    materials[packagingType]?.[packWeight] ?? [];

  const startEdit = (row: PackagingMaterialItem) => {
    setEditingId(row.id);
    setDraftMin(String(row.minCost));
    setDraftMax(String(row.maxCost));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftMin('');
    setDraftMax('');
  };

  const saveEdit = async (id: string) => {
    const min = parseFloat(draftMin);
    const max = parseFloat(draftMax);
    if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < 0) {
      toast.error('Enter valid cost values');
      return;
    }
    if (min > max) {
      toast.error('Min cost cannot exceed max cost');
      return;
    }

    setSavingId(id);
    try {
      const { item, message } = await updatePackagingItem(id, { minCost: min, maxCost: max });
      onChange({
        ...materials,
        [packagingType]: {
          ...materials[packagingType],
          [packWeight]: rows.map((r) => (r.id === id ? item : r)),
        },
      });
      toast.success(message ?? 'Packaging cost updated');
      cancelEdit();
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to update packaging cost. Please try again.';
      toast.error(msg);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          label="Packaging type"
          options={[...PACKAGING_TYPE_OPTIONS]}
          value={packagingType}
          onChange={(e) => handlePackagingTypeChange(e.target.value as PackagingType)}
          disabled={loading}
          className="w-full sm:w-48"
        />
        {weightOptions.length > 0 ? (
          <Select
            label="Pack weight"
            options={weightOptions}
            value={packWeight}
            onChange={(e) => setPackWeight(e.target.value)}
            className="w-full sm:w-40"
            disabled={loading}
          />
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-[#555555] py-8 text-center">Loading packaging materials…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-[#555555] py-8 text-center border border-dashed border-[#c3c3c3] rounded-xl">
          No packaging materials configured for {packagingType}
          {packWeight ? ` · ${packWeight}` : ''}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
                {['Item', 'Min cost (₹)', 'Max cost (₹)', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isEditing = editingId === row.id;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-[#f2f6ef] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/40'}`}
                  >
                    <td className="px-4 py-3 font-medium text-[#0a0a0a]">{row.itemName}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draftMin}
                          onChange={(e) => setDraftMin(e.target.value)}
                          className="max-w-[100px]"
                        />
                      ) : (
                        <span className="font-mono text-[#373737]">₹ {row.minCost}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draftMax}
                          onChange={(e) => setDraftMax(e.target.value)}
                          className="max-w-[100px]"
                        />
                      ) : (
                        <span className="font-mono text-[#373737]">₹ {row.maxCost}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            leftIcon={<Check size={13} />}
                            onClick={() => void saveEdit(row.id)}
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
      )}
    </div>
  );
}
