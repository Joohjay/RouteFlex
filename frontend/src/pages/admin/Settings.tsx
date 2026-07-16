import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/common/Loading';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Settings } from '@/types';

export default function SettingsAdmin() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<Partial<Settings>>();

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      await api.put('/settings', data);
    },
    onSuccess: () => {
      toast.success('Settings saved');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Primary Color</label>
              <Input {...register('primaryColor')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Secondary Color</label>
              <Input {...register('secondaryColor')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Favicon URL</label>
              <Input {...register('faviconUrl')} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Support Email</label>
              <Input {...register('supportEmail')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Support Phone</label>
              <Input {...register('supportPhone')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Booking Email</label>
              <Input {...register('bookingEmail')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">WhatsApp Number</label>
              <Input {...register('whatsappNumber')} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Default Meta Title</label>
              <Input {...register('defaultMetaTitle')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Default Meta Description</label>
              <Textarea {...register('defaultMetaDescription')} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Google Analytics ID</label>
              <Input {...register('googleAnalyticsId')} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={mutation.isPending}>
          <Save size={18} className="mr-2" />
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
