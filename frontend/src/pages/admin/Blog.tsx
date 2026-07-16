import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
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
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { BlogPost } from '@/types';

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function BlogAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    tags: '',
  });

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const response = await api.get('/blog');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/blog', {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      toast.success('Blog post created');
      setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', status: 'DRAFT', tags: '' });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
    },
    onError: () => {
      toast.error('Failed to create blog post');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      toast.success('Blog post deleted');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
    },
    onError: () => {
      toast.error('Failed to delete blog post');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Blog Post</DialogTitle>
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
                placeholder="Cover Image URL"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              />
              <Textarea
                placeholder="Excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
              <Textarea
                placeholder="Content"
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <Select
                value={form.status}
                options={statusOptions}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' })}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Published</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(posts ?? []).map((post) => (
                  <tr key={post.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{post.title}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                            : post.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : '-'}
                    </td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(post.id)}
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
