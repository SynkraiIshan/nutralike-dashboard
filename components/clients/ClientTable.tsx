'use client';
import { useState } from 'react';
import { Pencil, Trash2, Users } from 'lucide-react';
import { Client } from '@/types';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 10;

export default function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(clients.length / PAGE_SIZE));
  const paginated = clients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    setDeleteId(null);
    toast.success(`"${name}" removed successfully`);
  };

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#314f2d]/10 flex items-center justify-center mb-4">
          <Users size={28} className="text-[#314f2d]" />
        </div>
        <p className="type-h3-18 text-[#0a0a0a]">No clients found</p>
        <p className="type-small-body text-[#555555] mt-1">Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c3c3c3] bg-[#f2f6ef]">
              {['Name', 'Email', 'Phone', 'Company', 'Quotations', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[#555555] uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((client, i) => (
              <tr
                key={client.id}
                className={[
                  'group border-b border-[#e8ece5] transition-all duration-100',
                  i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]',
                  'hover:bg-[#f2f6ef] hover:border-l-4 hover:border-l-[#314f2d]',
                ].join(' ')}
              >
                <td className="px-4 py-3 font-medium text-[#0a0a0a]">{client.name}</td>
                <td className="px-4 py-3 text-[#373737]">{client.email}</td>
                <td className="px-4 py-3 text-[#555555]">{client.phone ?? '-'}</td>
                <td className="px-4 py-3 text-[#373737]">{client.company ?? '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#314f2d]/10 text-[#314f2d] text-[12px] font-semibold">
                    {client.quotationCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#555555] whitespace-nowrap">{formatDate(client.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => onEdit(client)}
                      className="p-1.5 rounded-lg text-[#555555] hover:text-[#314f2d] hover:bg-[#314f2d]/10 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setDeleteId(deleteId === client.id ? null : client.id)}
                        className="p-1.5 rounded-lg text-[#555555] hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                      {deleteId === client.id && (
                        <div className="absolute right-0 top-8 z-20 bg-white border border-[#c3c3c3] rounded-xl shadow-lg p-3 min-w-[200px]">
                          <p className="text-[13px] font-medium text-[#0a0a0a] mb-1">Delete &ldquo;{client.name}&rdquo;?</p>
                          <p className="text-[12px] text-[#555555] mb-3">This cannot be undone.</p>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(client.id, client.name)}>Delete</Button>
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
