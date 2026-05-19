'use client';
import { useState } from 'react';
import { Plus, FileUp } from 'lucide-react';
import { Ingredient } from '@/types';
import { MOCK_INGREDIENTS } from '@/lib/mock-data/ingredients';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import IngredientTable from '@/components/ingredients/IngredientTable';
import IngredientModal from '@/components/ingredients/IngredientModal';
import ImportModal from '@/components/ingredients/ImportModal';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
  const [search, setSearch] = useState('');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsAddEditOpen(true);
  };

  const handleAdd = () => {
    setEditingIngredient(null);
    setIsAddEditOpen(true);
  };

  const handleSave = (ingredient: Ingredient) => {
    setIngredients((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      if (exists) return prev.map((i) => (i.id === ingredient.id ? ingredient : i));
      return [ingredient, ...prev];
    });
  };

  const handleDelete = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleImport = (newIngredients: Ingredient[]) => {
    setIngredients((prev) => [...newIngredients, ...prev]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); }}
          placeholder="Search ingredients..."
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#555555]">{filtered.length} ingredient{filtered.length !== 1 ? 's' : ''}</span>
          <Button variant="secondary" leftIcon={<FileUp size={15} />} onClick={() => setIsImportOpen(true)}>
            Import File
          </Button>
          <Button leftIcon={<Plus size={15} />} onClick={handleAdd}>
            Add Ingredient
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card padding={false}>
        <IngredientTable
          ingredients={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onImport={() => setIsImportOpen(true)}
        />
      </Card>

      {/* Modals */}
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
