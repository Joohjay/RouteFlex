import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface Quote {
  id: string;
  requestId: string;
  totalPrice: number;
  currency: string;
  isAccepted: boolean;
  createdAt: string;
  request: {
    referenceNumber: string;
    pickupLocation: string;
    destination: string;
  };
}

export default function Quotes() {
  const queryClient = useQueryClient();
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [quoteForm, setQuoteForm] = useState({
    basePrice: 0,
    distancePrice: 0,
    weightPrice: 0,
    vehiclePrice: 0,
    extrasPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    distanceKm: 0,
    notes: '',
  });

  const { data: quotes, isLoading } = useQuery<Quote[]>({
    queryKey: ['admin', 'quotes'],
    queryFn: async () => {
      const response = await api.get('/quotes');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/quotes', { requestId: selectedRequestId, ...quoteForm });
    },
    onSuccess: () => {
      toast.success('Quote created');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
    },
    onError: () => {
      toast.error('Failed to create quote');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/quotes/${id}/accept`);
    },
    onSuccess: () => {
      toast.success('Quote accepted');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
    },
    onError: () => {
      toast.error('Failed to accept quote');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" /> Create Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Quote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Request ID</label>
                <Input
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  placeholder="Transport request ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Base Price</label>
                  <Input
                    type="number"
                    value={quoteForm.basePrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, basePrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Distance Price</label>
                  <Input
                    type="number"
                    value={quoteForm.distancePrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, distancePrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Weight Price</label>
                  <Input
                    type="number"
                    value={quoteForm.weightPrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, weightPrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Vehicle Price</label>
                  <Input
                    type="number"
                    value={quoteForm.vehiclePrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, vehiclePrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Extras</label>
                  <Input
                    type="number"
                    value={quoteForm.extrasPrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, extrasPrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tax</label>
                  <Input
                    type="number"
                    value={quoteForm.taxPrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, taxPrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Total Price</label>
                <Input
                  type="number"
                  value={quoteForm.totalPrice}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, totalPrice: Number(e.target.value) })
                  }
                />
              </div>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Quote'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Request</th>
                  <th className="py-3 text-left font-medium">Route</th>
                  <th className="py-3 text-left font-medium">Total</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(quotes ?? []).map((quote) => (
                  <tr key={quote.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{quote.request.referenceNumber}</td>
                    <td className="py-3">
                      {quote.request.pickupLocation} &rarr; {quote.request.destination}
                    </td>
                    <td className="py-3">
                      {formatCurrency(quote.totalPrice, quote.currency)}
                    </td>
                    <td className="py-3">
                      {quote.isAccepted ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30">
                          Accepted
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {!quote.isAccepted && (
                        <Button
                          size="sm"
                          onClick={() => acceptMutation.mutate(quote.id)}
                          disabled={acceptMutation.isPending}
                        >
                          <Check size={14} className="mr-1" /> Accept
                        </Button>
                      )}
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
