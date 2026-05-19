'use client';
import { useState } from 'react';
import { Pencil, Trash2, Package } from 'lucide-react';
import { Ingredient } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
  onImport: () => void;
  isLoading?: boolean;
}

const PAGE_SIZE = 10;

export default function IngredientTable({
  ingredients,
  onEdit,
  onDelete,
  onImport,
  isLoading = false,
}: IngredientTableProps) {
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(ingredients.length / PAGE_SIZE));
  const paginated = ingredients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
    toast.success(`"${name}" deleted successfully`);
  };

  if (isLoading) return <Skeleton rows={10} />;

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center mb-4">
          <Package size={28} className="text-[#314f2d]" />
        </div>
        <p className="type-h3-18 text-[#0a0a0a]">No ingredients found</p>
        <p className="type-small-body text-[#555555] mt-1 max-w-xs">
          Try adjusting your search or import an ingredient file to get started.
        </p>
        <Button className="mt-4" onClick={onImport}>Import File</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
              {['S.No', 'Name', 'Unit', 'Price / 100 KG', 'Last Updated', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((ing, i) => (
              <tr
                key={ing.id}
                className={[
                  'group border-b border-[#e8ece5] transition-all duration-100',
                  i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]',
                  'hover:bg-[#f2f6ef]',
                ].join(' ')}
                style={{}}
              >
                <td className="px-4 py-3 text-[#555555] text-[12px] tabular-nums">
                  {(page - 1) * PAGE_SIZE + i + 1}
                </td>
                <td className="px-4 py-3 font-medium text-[#0a0a0a]">{ing.name}</td>
                <td className="px-4 py-3">
                  <Badge label={ing.unit} variant="neutral" />
                </td>
                <td className="px-4 py-3 text-right font-mono text-[#0a0a0a] whitespace-nowrap">
                  {formatCurrency(ing.pricePerHundredKg)}
                </td>
                <td className="px-4 py-3 text-[#555555] whitespace-nowrap">
                  {formatDate(ing.lastUpdated)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => onEdit(ing)}
                      className="p-1.5 rounded-lg text-[#555555] hover:text-[#314f2d] hover:bg-[#314f2d]/10 transition-colors cursor-pointer"
                      title="Edit ingredient"
                    >
                      <Pencil size={15} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setDeleteConfirmId(deleteConfirmId === ing.id ? null : ing.id)
                        }
                        className="p-1.5 rounded-lg text-[#555555] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete ingredient"
                      >
                        <Trash2 size={15} />
                      </button>
                      {deleteConfirmId === ing.id && (
                        <div className="absolute right-0 top-8 z-20 bg-white border border-[#c3c3c3] rounded-xl shadow-lg p-3 min-w-[220px]">
                          <p className="text-[13px] font-medium text-[#0a0a0a] mb-1">
                            Delete &ldquo;{ing.name}&rdquo;?
                          </p>
                          <p className="text-[12px] text-[#555555] mb-3">
                            This cannot be undone.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(ing.id, ing.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
