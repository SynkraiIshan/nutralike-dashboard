'use client';
import { useState, useEffect } from 'react';
import { Ingredient, Unit } from '@/types';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ApiError } from '@/lib/api/errors';
import { createIngredient, mapIngredientFromApi } from '@/lib/api/ingredients';
import { INGREDIENT_UNIT_OPTIONS } from '@/lib/units';
import toast from 'react-hot-toast';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
  onSave: () => void;
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

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      if (isEdit && ingredient) {
        const saved: Ingredient = {
          ...ingredient,
          name: form.name.trim(),
          unit: form.unit,
          pricePerHundredKg: Number(form.pricePerHundredKg),
          lastUpdated: new Date().toISOString(),
        };
        onSave();
        toast.success(`"${saved.name}" updated successfully`);
        onClose();
        return;
      }

      const { data: created, message } = await createIngredient({
        name: form.name.trim(),
        unit: form.unit,
        pricePerUnit: Number(form.pricePerHundredKg),
      });
      const saved = mapIngredientFromApi(created);
      onSave();
      toast.success(message ?? `"${saved.name}" added successfully`);
      onClose();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to add ingredient. Please try again.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
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
          options={INGREDIENT_UNIT_OPTIONS}
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
