import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Loading } from '@/components/common/Loading';
import { api } from '@/lib/api';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import type { RequestStatus, TransportRequest } from '@/types';

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: 'REQUEST_SUBMITTED', label: 'Request Submitted' },
  { value: 'QUOTE_PREPARED', label: 'Quote Prepared' },
  { value: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
  { value: 'LOADING', label: 'Loading' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function Requests() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);

  const { data: requests, isLoading } = useQuery<TransportRequest[]>({
    queryKey: ['admin', 'requests'],
    queryFn: async () => {
      const response = await api.get('/transport-requests');
      return response.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      await api.put(`/transport-requests/${id}`, { status });
    },
    onSuccess: () => {
      toast.success('Request updated');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'requests'] });
    },
    onError: () => {
      toast.error('Failed to update request');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transport Requests</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Reference</th>
                  <th className="py-3 text-left font-medium">Customer</th>
                  <th className="py-3 text-left font-medium">Route</th>
                  <th className="py-3 text-left font-medium">Cargo</th>
                  <th className="py-3 text-left font-medium">Estimate</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Date</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(requests ?? []).map((request) => (
                  <tr key={request.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{request.referenceNumber}</td>
                    <td className="py-3">
                      <div>{request.name}</div>
                      <div className="text-xs text-muted-foreground">{request.email}</div>
                    </td>
                    <td className="py-3">
                      {request.pickupLocation} &rarr; {request.destination}
                    </td>
                    <td className="py-3">
                      {request.cargoType} ({request.weight} kg)
                    </td>
                    <td className="py-3">
                      {request.estimatedPrice ? formatCurrency(request.estimatedPrice) : '-'}
                    </td>
                    <td className="py-3">
                      <Select
                        value={request.status}
                        options={statusOptions}
                        onChange={(e) =>
                          updateMutation.mutate({ id: request.id, status: e.target.value as RequestStatus })
                        }
                        className="h-8 py-1"
                      />
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDateTime(request.createdAt)}</td>
                    <td className="py-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(request)}>
                            <Eye size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-3 text-sm">
                              <p>
                                <span className="font-medium">Reference:</span>{' '}
                                {selectedRequest.referenceNumber}
                              </p>
                              <p>
                                <span className="font-medium">Customer:</span> {selectedRequest.name} (
                                {selectedRequest.email}, {selectedRequest.phone})
                              </p>
                              <p>
                                <span className="font-medium">Route:</span>{' '}
                                {selectedRequest.pickupLocation} &rarr; {selectedRequest.destination}
                              </p>
                              <p>
                                <span className="font-medium">Cargo:</span> {selectedRequest.cargoType} -{' '}
                                {selectedRequest.weight} kg
                              </p>
                              <p>
                                <span className="font-medium">Vehicle:</span>{' '}
                                {selectedRequest.vehicleType.replace(/_/g, ' ')}
                              </p>
                              <p>
                                <span className="font-medium">Notes:</span>{' '}
                                {selectedRequest.notes || 'None'}
                              </p>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
