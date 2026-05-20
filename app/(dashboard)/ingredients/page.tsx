'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, FileUp } from 'lucide-react';
import { Ingredient } from '@/types';
import { ApiError } from '@/lib/api/errors';
import { fetchIngredients, mapIngredientFromApi } from '@/lib/api/ingredients';
import type { ApiPagination } from '@/lib/api/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import IngredientTable from '@/components/ingredients/IngredientTable';
import IngredientModal from '@/components/ingredients/IngredientModal';
import ImportModal from '@/components/ingredients/ImportModal';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadIngredients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchIngredients({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      setIngredients(data.ingredients.map(mapIngredientFromApi));
      setPagination(data.pagination);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to load ingredients. Please try again.';
      toast.error(message);
      setIngredients([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsAddEditOpen(true);
  };

  const handleAdd = () => {
    setEditingIngredient(null);
    setIsAddEditOpen(true);
  };

  const handleSave = () => {
    void loadIngredients();
  };

  const handleDelete = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    void loadIngredients();
  };

  const handleImport = (newIngredients: Ingredient[]) => {
    setIngredients((prev) => [...newIngredients, ...prev]);
    void loadIngredients();
  };

  const totalCount = pagination?.total ?? ingredients.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search ingredients..."
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#555555]">
            {totalCount} ingredient{totalCount !== 1 ? 's' : ''}
          </span>
          <Button variant="secondary" leftIcon={<FileUp size={15} />} onClick={() => setIsImportOpen(true)}>
            Import File
          </Button>
          <Button leftIcon={<Plus size={15} />} onClick={handleAdd}>
            Add Ingredient
          </Button>
        </div>
      </div>

      <Card padding={false}>
        <IngredientTable
          ingredients={ingredients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onImport={() => setIsImportOpen(true)}
          isLoading={isLoading}
          currentPage={pagination?.page ?? page}
          totalPages={pagination?.totalPages ?? 1}
          pageSize={pagination?.limit ?? PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>

      <IngredientModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        ingredient={editingIngredient}
        onSave={handleSave}
      />
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
