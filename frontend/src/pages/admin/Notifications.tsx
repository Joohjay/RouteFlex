import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/common/Loading';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';
  recipient: string;
  subject?: string;
  content: string;
  status: string;
  createdAt: string;
}

const channelOptions = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'PUSH', label: 'Push' },
  { value: 'IN_APP', label: 'In-App' },
];

export default function NotificationsAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    channel: 'EMAIL' as const,
    recipient: '',
    subject: '',
    content: '',
  });

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['admin', 'notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/notifications', form);
    },
    onSuccess: () => {
      toast.success('Notification created');
      setForm({ channel: 'EMAIL', recipient: '', subject: '', content: '' });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
    onError: () => {
      toast.error('Failed to create notification');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={form.channel}
              options={channelOptions}
              onChange={(e) => setForm({ ...form, channel: e.target.value as 'EMAIL' })}
            />
            <Input
              placeholder="Recipient"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
            <Input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Textarea
              placeholder="Message content"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              <Send size={18} className="mr-2" />
              {createMutation.isPending ? 'Sending...' : 'Send'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(notifications ?? []).map((notification) => (
                <div key={notification.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {notification.channel === 'EMAIL' ? <Mail size={16} /> : <MessageSquare size={16} />}
                      <span className="font-medium">{notification.channel}</span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        notification.status === 'SENT'
                          ? 'bg-green-100 text-green-700'
                          : notification.status === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {notification.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">To: {notification.recipient}</p>
                  <p className="mt-1 text-sm">{notification.subject}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
