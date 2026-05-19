'use client';
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (client: Client) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export default function ClientModal({ isOpen, onClose, client, onSave }: ClientModalProps) {
  const isEdit = !!client;
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', company: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (client) {
        setForm({
          name: client.name,
          email: client.email,
          phone: client.phone ?? '',
          company: client.company ?? '',
        });
      } else {
        setForm({ name: '', email: '', phone: '', company: '' });
      }
      setErrors({});
    }
  }, [isOpen, client]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Client name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const saved: Client = {
        id: client?.id ?? `c-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        quotationCount: client?.quotationCount ?? 0,
        createdAt: client?.createdAt ?? new Date().toISOString().split('T')[0],
      };
      onSave(saved);
      setSaving(false);
      onClose();
      toast.success(`"${saved.name}" ${isEdit ? 'updated' : 'added'} successfully`);
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Client' : 'Add Client'} width="sm">
      <div className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Rajesh Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="e.g. rajesh@company.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Company Name"
          placeholder="e.g. Aryan Proteins Pvt. Ltd."
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <div className="flex items-center gap-3 pt-2 justify-end border-t border-[#f2f6ef] mt-1">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>
            {isEdit ? 'Save Changes' : 'Add Client'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
