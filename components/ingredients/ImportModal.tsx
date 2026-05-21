'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import FileUploadZone from '@/components/ui/FileUploadZone';
import Button from '@/components/ui/Button';
import { ApiError } from '@/lib/api/errors';
import { mapIngredientFromApi } from '@/lib/api/ingredients';
import { parseIngredientFile } from '@/lib/api/uploads';
import type { ApiIngredient } from '@/lib/api/types';
import toast from 'react-hot-toast';

type ImportState = 'idle' | 'processing' | 'preview';

interface ExtractedRow {
  id: string;
  name: string;
  unit: string;
  pricePerHundredKg: number;
  checked: boolean;
}

function toExtractedRows(items: ApiIngredient[]): ExtractedRow[] {
  return items.map((item) => {
    const mapped = mapIngredientFromApi(item);
    return {
      id: mapped.id,
      name: mapped.name,
      unit: mapped.unit,
      pricePerHundredKg: mapped.pricePerHundredKg,
      checked: true,
    };
  });
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [state, setState] = useState<ImportState>('idle');
  const [rows, setRows] = useState<ExtractedRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [parseMessage, setParseMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = async (f: File) => {
    setFile(f);
    setState('processing');
    setParseMessage(null);

    try {
      const { data, message } = await parseIngredientFile(f);
      const combined = [...data.updated, ...data.added];
      setRows(toExtractedRows(combined));
      setParseMessage(message ?? null);
      setState('preview');
      toast.success(
        message ??
          `Fetched ${data.extracted} ingredient${data.extracted !== 1 ? 's' : ''} successfully`
      );
    } catch (error) {
      setState('idle');
      setFile(null);
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to process file. Please try again.';
      toast.error(msg);
    }
  };

  const toggleRow = (i: number) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, checked: !r.checked } : r)));
  };

  const handleSave = async () => {
    const selected = rows.filter((r) => r.checked);
    if (selected.length === 0) {
      toast.error('Select at least one ingredient to save');
      return;
    }

    setSaving(true);
    try {
      onImport();
      toast.success(
        parseMessage ??
          `${selected.length} ingredient${selected.length !== 1 ? 's' : ''} saved to database`
      );
      handleClose();
    } catch {
      toast.error('Failed to refresh ingredients list. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setState('idle');
    setRows([]);
    setFile(null);
    setParseMessage(null);
    setSaving(false);
    onClose();
  };

  const selectedCount = rows.filter((r) => r.checked).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Ingredient File" width="lg">
      {state === 'idle' && (
        <div className="space-y-4">
          <p className="text-sm text-[#555555]">
            Upload a spreadsheet or document with ingredient data (XLSX, DOCX, PDF, image, or text).
            Ingredients will be extracted and synced to your catalog.
          </p>
          <FileUploadZone
            onFileSelect={(f) => void handleFileSelect(f)}
            label="Click to upload or drag & drop"
            hint="Supports XLSX, DOCX, PDF, Image (JPG/PNG), TXT"
          />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center">
            <Loader2 size={28} className="text-[#314f2d] animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-medium text-[#0a0a0a]">Processing ingredient file...</p>
            <p className="text-sm text-[#555555] mt-1">Analyzing: {file?.name}</p>
          </div>
        </div>
      )}

      {state === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#0a0a0a]">
              Extracted Ingredients Preview
            </p>
            <span className="text-xs text-[#555555]">
              {selectedCount} of {rows.length} selected
            </span>
          </div>
          {rows.length === 0 ? (
            <p className="text-sm text-[#555555] py-6 text-center">
              No ingredients were extracted from this file.
            </p>
          ) : (
            <div className="border border-[#c3c3c3] rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#f2f6ef]">
                  <tr className="border-b border-[#c3c3c3]">
                    <th className="px-3 py-2 w-10 text-left">
                      <input
                        type="checkbox"
                        checked={rows.every((r) => r.checked)}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r) => ({ ...r, checked: e.target.checked }))
                          )
                        }
                        className="rounded"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-[12px] font-semibold text-[#555555] uppercase">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-[12px] font-semibold text-[#555555] uppercase">
                      Unit
                    </th>
                    <th className="px-3 py-2 text-right text-[12px] font-semibold text-[#555555] uppercase">
                      ₹/100KG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      onClick={() => toggleRow(i)}
                      className={`cursor-pointer border-b border-[#f2f6ef] last:border-0 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/50'
                      } hover:bg-[#f2f6ef]`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={() => toggleRow(i)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-[#0a0a0a]">{row.name}</td>
                      <td className="px-3 py-2 text-[#555555]">{row.unit}</td>
                      <td className="px-3 py-2 text-right font-mono text-[#0a0a0a]">
                        ₹{' '}
                        {row.pricePerHundredKg.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              loading={saving}
              disabled={selectedCount === 0 || rows.length === 0}
            >
              Save to Database ({selectedCount})
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
