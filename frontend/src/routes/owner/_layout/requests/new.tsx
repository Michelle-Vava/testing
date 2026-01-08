import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ServiceTypeSelector } from '@/features/requests/components/ServiceTypeSelector';
import { AdvancedOptionsSection } from '@/features/requests/components/AdvancedOptionsSection';
import { EmptyVehicleState } from '@/features/requests/components/EmptyVehicleState';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useVehiclesControllerFindAll } from '@/api/generated/vehicles/vehicles';
import { useRequestsControllerCreate } from '@/api/generated/requests/requests';

export const Route = createFileRoute('/owner/_layout/requests/new')({
  component: NewRequestPage,
});

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
}

interface CreateRequestPayload {
  vehicleId: string;
  serviceType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  preferredDate?: string;
  budgetMin?: number;
  budgetMax?: number;
}

function NewRequestPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [preferredDate, setPreferredDate] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  // Fetch user's vehicles
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehiclesControllerFindAll();

  // Create request mutation
  const { mutate: createRequest } = useRequestsControllerCreate({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Request created',
          description: 'Your service request has been posted successfully.',
        });
        navigate({ to: '/owner/requests' });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create request. Please try again.',
          variant: 'destructive',
        });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      toast({
        title: 'Vehicle required',
        description: 'Please select a vehicle for this request.',
        variant: 'destructive',
      });
      return;
    }

    if (!serviceType) {
      toast({
        title: 'Service type required',
        description: 'Please select a service type.',
        variant: 'destructive',
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: 'Description required',
        description: 'Please describe the issue or service needed.',
        variant: 'destructive',
      });
      return;
    }

    const serviceLabel = serviceType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    let fullDescription = description;
    if (preferredDate) {
      fullDescription += `\n\nPreferred Date: ${preferredDate}`;
    }
    if (budgetMin || budgetMax) {
      fullDescription += `\nBudget: $${budgetMin || '0'} - $${budgetMax || 'Any'}`;
    }

    createRequest({
      data: {
        vehicleId: selectedVehicleId,
        title: serviceLabel,
        description: fullDescription,
        urgency,
      },
    });
  };

  if (isLoadingVehicles) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return <EmptyVehicleState />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/owner/requests' })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Service Request</h1>
          <p className="text-slate-500">Tell us what your vehicle needs</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Vehicle *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedVehicleId === vehicle.id
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-medium text-slate-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </div>
                    {vehicle.licensePlate && (
                      <div className="text-sm text-slate-500 mt-1">
                        {vehicle.licensePlate}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Type */}
            <ServiceTypeSelector
              value={serviceType as any}
              onChange={(val) => setServiceType(val)}
            />

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue or the service you need in detail..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            {/* Advanced Options */}
            <AdvancedOptionsSection
              urgency={urgency}
              preferredDate={preferredDate}
              budgetMin={budgetMin}
              budgetMax={budgetMax}
              onUrgencyChange={setUrgency}
              onPreferredDateChange={setPreferredDate}
              onBudgetMinChange={setBudgetMin}
              onBudgetMaxChange={setBudgetMax}
            />

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button 
                type="submit" 
                size="lg" 
                disabled={createRequest.isPending}
                className="w-full sm:w-auto"
              >
                {createRequest.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
