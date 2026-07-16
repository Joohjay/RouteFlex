import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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
import type { Fleet } from '@/types';

const vehicleOptions = [
  { value: 'VAN', label: 'Cargo Van' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'TRUCK_1_TON', label: '1-Ton Truck' },
  { value: 'TRUCK_3_TON', label: '3-Ton Truck' },
  { value: 'TRUCK_5_TON', label: '5-Ton Truck' },
  { value: 'TRUCK_10_TON', label: '10-Ton Truck' },
  { value: 'TRUCK_20_TON', label: '20-Ton Truck' },
  { value: 'TRAILER', label: 'Trailer' },
  { value: 'REFRIGERATED', label: 'Refrigerated' },
  { value: 'TANKER', label: 'Tanker' },
  { value: 'FLATBED', label: 'Flatbed' },
  { value: 'LOWBED', label: 'Lowbed' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'RETIRED', label: 'Retired' },
];

export default function FleetAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    type: 'TRUCK_5_TON',
    capacityKg: 5000,
    status: 'ACTIVE',
    description: '',
    features: '',
  });

  const { data: fleet, isLoading } = useQuery<Fleet[]>({
    queryKey: ['admin', 'fleet'],
    queryFn: async () => {
      const response = await api.get('/fleet');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/fleet', {
        ...form,
        capacityKg: Number(form.capacityKg),
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      toast.success('Fleet vehicle added');
      setForm({ name: '', type: 'TRUCK_5_TON', capacityKg: 5000, status: 'ACTIVE', description: '', features: '' });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'fleet'] });
    },
    onError: () => {
      toast.error('Failed to add fleet vehicle');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/fleet/${id}`);
    },
    onSuccess: () => {
      toast.success('Fleet vehicle deleted');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'fleet'] });
    },
    onError: () => {
      toast.error('Failed to delete fleet vehicle');
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fleet</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fleet Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Vehicle name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Select
                value={form.type}
                options={vehicleOptions}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Capacity (kg)"
                value={form.capacityKg}
                onChange={(e) => setForm({ ...form, capacityKg: Number(e.target.value) })}
              />
              <Select
                value={form.status}
                options={statusOptions}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Input
                placeholder="Features (comma separated)"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Name</th>
                  <th className="py-3 text-left font-medium">Type</th>
                  <th className="py-3 text-left font-medium">Capacity</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(fleet ?? []).map((vehicle) => (
                  <tr key={vehicle.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{vehicle.name}</td>
                    <td className="py-3">{vehicle.type.replace(/_/g, ' ')}</td>
                    <td className="py-3">{vehicle.capacityKg.toLocaleString()} kg</td>
                    <td className="py-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(vehicle.id)}
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
