'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, FileUp } from 'lucide-react';
import { Ingredient } from '@/types';
import { ApiError } from '@/lib/api/errors';
import {
  fetchIngredients,
  INGREDIENT_SORT_OPTIONS,
  mapIngredientFromApi,
  type IngredientSort,
} from '@/lib/api/ingredients';
import Select from '@/components/ui/Select';
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
  const [sort, setSort] = useState<'' | IngredientSort>('');
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
  }, [debouncedSearch, sort]);

  const loadIngredients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchIngredients({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        sort: sort || undefined,
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
  }, [page, debouncedSearch, sort]);

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

  const handleDelete = () => {
    void loadIngredients();
  };

  const handleImport = () => {
    void loadIngredients();
  };

  const totalCount = pagination?.total ?? ingredients.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-1 sm:max-w-2xl sm:items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search ingredients..."
            className="w-full sm:flex-1 min-w-0"
          />
          <Select
            label="Sort by"
            labelPosition="inline"
            options={INGREDIENT_SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value as '' | IngredientSort)}
            className="w-full sm:min-w-[11rem]"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dim-gray">
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
