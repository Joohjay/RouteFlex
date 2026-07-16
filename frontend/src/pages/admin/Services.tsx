import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Loading } from '@/components/common/Loading';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Service } from '@/types';

export default function ServicesAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    imageUrl: '',
  });

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/services', form);
    },
    onSuccess: () => {
      toast.success('Service created');
      setForm({ title: '', slug: '', summary: '', description: '', imageUrl: '' });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
    onError: () => {
      toast.error('Failed to create service');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`);
    },
    onSuccess: () => {
      toast.success('Service deleted');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
    onError: () => {
      toast.error('Failed to delete service');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <Input
                placeholder="Summary"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Input
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Slug</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(services ?? []).map((service) => (
                  <tr key={service.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{service.title}</td>
                    <td className="py-3 text-muted-foreground">{service.slug}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          service.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(service.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
