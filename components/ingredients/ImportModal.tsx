'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Ingredient } from '@/types';
import Modal from '@/components/ui/Modal';
import FileUploadZone from '@/components/ui/FileUploadZone';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

type ImportState = 'idle' | 'processing' | 'preview' | 'saved';

interface ExtractedRow {
  name: string;
  unit: string;
  pricePerHundredKg: number;
  checked: boolean;
}

const MOCK_EXTRACTED: ExtractedRow[] = [
  { name: 'Collagen Peptides',          unit: 'KG',  pricePerHundredKg: 1650,  checked: true },
  { name: 'Hyaluronic Acid Powder',     unit: 'KG',  pricePerHundredKg: 8200,  checked: true },
  { name: 'Resveratrol 98%',            unit: 'KG',  pricePerHundredKg: 12500, checked: true },
  { name: 'Coenzyme Q10',               unit: 'KG',  pricePerHundredKg: 9400,  checked: true },
  { name: 'L-Carnitine Tartrate',       unit: 'KG',  pricePerHundredKg: 2100,  checked: true },
  { name: 'Alpha Lipoic Acid',          unit: 'KG',  pricePerHundredKg: 3750,  checked: true },
  { name: 'Biotin (Vitamin B7)',        unit: 'KG',  pricePerHundredKg: 6800,  checked: true },
  { name: 'Ribose',                     unit: 'KG',  pricePerHundredKg: 1280,  checked: true },
  { name: 'Taurine',                    unit: 'KG',  pricePerHundredKg: 540,   checked: true },
  { name: 'Melatonin 99%',             unit: 'KG',  pricePerHundredKg: 18000, checked: true },
  { name: 'Rhodiola Rosea Extract',     unit: 'KG',  pricePerHundredKg: 2850,  checked: true },
  { name: 'Phosphatidylserine 70%',     unit: 'KG',  pricePerHundredKg: 7200,  checked: true },
];

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (ingredients: Ingredient[]) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [state, setState] = useState<ImportState>('idle');
  const [rows, setRows] = useState<ExtractedRow[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setState('processing');
    setTimeout(() => {
      setRows(MOCK_EXTRACTED.map((r) => ({ ...r })));
      setState('preview');
    }, 2000);
  };

  const toggleRow = (i: number) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, checked: !r.checked } : r)));
  };

  const handleSave = () => {
    const selected = rows.filter((r) => r.checked);
    const now = new Date().toISOString().split('T')[0];
    const newIngredients: Ingredient[] = selected.map((r, i) => ({
      id: `import-${Date.now()}-${i}`,
      name: r.name,
      unit: r.unit as Ingredient['unit'],
      pricePerHundredKg: r.pricePerHundredKg,
      lastUpdated: now,
    }));
    onImport(newIngredients);
    toast.success(`${newIngredients.length} ingredients added to database`);
    handleClose();
  };

  const handleClose = () => {
    setState('idle');
    setRows([]);
    setFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Ingredient File" width="lg">
      {state === 'idle' && (
        <div className="space-y-4">
          <p className="text-sm text-[#555555]">
            Upload any file containing ingredient data - XLSX, DOCX, PDF, image, or plain text.
            Our AI will extract the ingredient names, units, and prices automatically.
          </p>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            label="Click to upload or drag & drop"
            hint="Supports XLSX, DOCX, PDF, Image (JPG/PNG), TXT"
          />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center">
            <Loader2 size={28} className="text-[#314f2d] animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-medium text-[#0a0a0a]">AI is extracting ingredient data...</p>
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
              {rows.filter((r) => r.checked).length} of {rows.length} selected
            </span>
          </div>
          <div className="border border-[#c3c3c3] rounded-xl overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#f2f6ef]">
                <tr className="border-b border-[#c3c3c3]">
                  <th className="px-3 py-2 w-10 text-left">
                    <input
                      type="checkbox"
                      checked={rows.every((r) => r.checked)}
                      onChange={(e) =>
                        setRows((prev) => prev.map((r) => ({ ...r, checked: e.target.checked })))
                      }
                      className="rounded"
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-[#555555] uppercase">Name</th>
                  <th className="px-3 py-2 text-left text-[12px] font-semibold text-[#555555] uppercase">Unit</th>
                  <th className="px-3 py-2 text-right text-[12px] font-semibold text-[#555555] uppercase">₹/100KG</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => toggleRow(i)}
                    className={`cursor-pointer border-b border-[#f2f6ef] last:border-0 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]/50'
                    } hover:bg-[#f2f6ef]`}
                  >
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={row.checked} onChange={() => toggleRow(i)} onClick={(e) => e.stopPropagation()} className="rounded" />
                    </td>
                    <td className="px-3 py-2 font-medium text-[#0a0a0a]">{row.name}</td>
                    <td className="px-3 py-2 text-[#555555]">{row.unit}</td>
                    <td className="px-3 py-2 text-right font-mono text-[#0a0a0a]">
                      ₹ {row.pricePerHundredKg.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={rows.filter((r) => r.checked).length === 0}>
              Save to Database ({rows.filter((r) => r.checked).length})
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
