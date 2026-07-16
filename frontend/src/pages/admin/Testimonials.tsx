import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
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
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Testimonial } from '@/types';

export default function TestimonialsAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    author: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
  });

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => {
      const response = await api.get('/testimonials');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/testimonials', form);
    },
    onSuccess: () => {
      toast.success('Testimonial added');
      setForm({ author: '', role: '', company: '', content: '', rating: 5 });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
    onError: () => {
      toast.error('Failed to add testimonial');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/testimonials/${id}`);
    },
    onSuccess: () => {
      toast.success('Testimonial deleted');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
    onError: () => {
      toast.error('Failed to delete testimonial');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" /> Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Testimonial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
              <Input
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <Input
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              <Textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <Input
                type="number"
                min={1}
                max={5}
                placeholder="Rating (1-5)"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              />
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add Testimonial'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(testimonials ?? []).map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-accent">★</span>
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(testimonial.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
