'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Client } from '@/types';
import { MOCK_CLIENTS } from '@/lib/mock-data/clients';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import ClientTable from '@/components/clients/ClientTable';
import ClientModal from '@/components/clients/ClientModal';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleSave = (client: Client) => {
    setClients((prev) => {
      const exists = prev.find((c) => c.id === client.id);
      if (exists) return prev.map((c) => (c.id === client.id ? client : c));
      return [client, ...prev];
    });
  };

  const handleDelete = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search clients..."
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#555555]">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</span>
          <Button leftIcon={<Plus size={15} />} onClick={handleAdd}>
            Add Client
          </Button>
        </div>
      </div>

      <Card padding={false}>
        <ClientTable clients={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </Card>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editingClient}
        onSave={handleSave}
      />
    </div>
  );
}
