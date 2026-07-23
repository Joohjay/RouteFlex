import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Gallery } from '@/types';

export default function GalleryAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });

  const { data: gallery, isLoading, isError } = useQuery<Gallery[]>({
    queryKey: ['admin', 'gallery'],
    queryFn: async () => {
      const response = await api.get('/gallery');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/gallery', form);
    },
    onSuccess: () => {
      toast.success('Gallery image added');
      setForm({ title: '', description: '', imageUrl: '', category: '' });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
    },
    onError: () => {
      toast.error('Failed to add gallery image');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/gallery/${id}`);
    },
    onSuccess: () => {
      toast.success('Gallery image deleted');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
    },
    onError: () => {
      toast.error('Failed to delete gallery image');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <EmptyState
          icon={Image}
          title="Failed to load gallery"
          description="Could not connect to the server. Please try again later."
        />
      </div>
    );
  }

  const isEmpty = !gallery || gallery.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add Image'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={Image}
          title="No gallery images"
          description="Add your first gallery image to showcase your fleet, operations, and team."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery!.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title ?? 'Gallery image'}
                className="h-48 w-full object-cover"
              />
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    {item.title && <h3 className="font-semibold">{item.title}</h3>}
                    {item.category && (
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
