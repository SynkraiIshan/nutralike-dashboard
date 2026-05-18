'use client';
import { useState, useEffect } from 'react';
import { Ingredient, Unit } from '@/types';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const UNIT_OPTIONS = [
  { value: 'KG', label: 'KG - Kilogram' },
  { value: 'LTR', label: 'LTR - Litre' },
  { value: 'GM', label: 'GM - Gram' },
  { value: 'ML', label: 'ML - Millilitre' },
  { value: 'PCS', label: 'PCS - Pieces' },
];

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
  onSave: (ingredient: Ingredient) => void;
}

interface FormState {
  name: string;
  unit: Unit;
  pricePerHundredKg: string;
}

interface FormErrors {
  name?: string;
  unit?: string;
  pricePerHundredKg?: string;
}

export default function IngredientModal({
  isOpen,
  onClose,
  ingredient,
  onSave,
}: IngredientModalProps) {
  const isEdit = !!ingredient;
  const [form, setForm] = useState<FormState>({ name: '', unit: 'KG', pricePerHundredKg: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        setForm({
          name: ingredient.name,
          unit: ingredient.unit,
          pricePerHundredKg: String(ingredient.pricePerHundredKg),
        });
      } else {
        setForm({ name: '', unit: 'KG', pricePerHundredKg: '' });
      }
      setErrors({});
    }
  }, [isOpen, ingredient]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Ingredient name is required';
    if (!form.pricePerHundredKg || Number(form.pricePerHundredKg) <= 0)
      e.pricePerHundredKg = 'Enter a valid price greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const saved: Ingredient = {
        id: ingredient?.id ?? `ing-${Date.now()}`,
        name: form.name.trim(),
        unit: form.unit,
        pricePerHundredKg: Number(form.pricePerHundredKg),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      onSave(saved);
      setSaving(false);
      onClose();
      toast.success(`"${saved.name}" ${isEdit ? 'updated' : 'added'} successfully`);
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Ingredient' : 'Add Ingredient'}
      width="sm"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Ingredient Name"
          placeholder="e.g. Whey Protein Concentrate"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
        <Select
          label="Unit"
          options={UNIT_OPTIONS}
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value as Unit })}
          required
        />
        <Input
          label="Price per 100 KG (₹)"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="e.g. 890.00"
          value={form.pricePerHundredKg}
          onChange={(e) => setForm({ ...form, pricePerHundredKg: e.target.value })}
          error={errors.pricePerHundredKg}
          leftAddon="₹"
          required
        />
        <div className="flex items-center gap-3 pt-2 justify-end border-t border-[#f2f6ef] mt-1">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>
            {isEdit ? 'Save Changes' : 'Add Ingredient'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
