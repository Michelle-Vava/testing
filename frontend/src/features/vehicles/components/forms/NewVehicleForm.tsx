import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useVINDecoder } from '@/features/vehicles/hooks/use-vin-decoder';
import { vehicleFormSchema, type VehicleFormData } from '@/features/vehicles/schemas/vehicle-form.schema';
import { VINInput } from './VINInput';
import { VehiclePreview } from './VehiclePreview';
import { VehicleFormGuidance } from './VehicleFormGuidance';
import { VehicleDetailsFields } from '../form-fields/VehicleDetailsFields';

/**
 * Add vehicle form with VIN auto-decode using react-hook-form + Zod validation
 * 
 * FORM ARCHITECTURE:
 * ┌────────────────────────────────────┬──────────────┐
 * │ LIVE PREVIEW                       │ GUIDANCE     │
 * │ [🚗 Honda Civic 2020]              │ Why VIN?     │
 * ├────────────────────────────────────┤ - Accurate   │
 * │ VIN DECODER                        │ - Fast       │
 * │ [________________] 🔍 Decoding...  │              │
 * │ ✓ Found: 2020 Honda Civic          │ Need help?   │
 * ├────────────────────────────────────┤ Where's VIN? │
 * │ VEHICLE DETAILS (extracted)        │              │
 * │ <VehicleDetailsFields />           │              │
 * ├────────────────────────────────────┤              │
 * │ [Cancel] [Add Vehicle]             │              │
 * └────────────────────────────────────┴──────────────┘
 */
export function NewVehicleForm() {
  const navigate = useNavigate();
  const { createVehicle, isCreating } = useVehicles();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // React Hook Form with Zod validation
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vin: '',
      make: '',
      model: '',
      year: '',
      color: '',
      licensePlate: '',
      mileage: '',
    },
  });

  const { handleSubmit, formState: { errors, isDirty }, watch, setValue, clearErrors } = form;
  const vinValue = watch('vin');

  // VIN Decoder Hook (manual trigger)
  const { isDecoding: isDecodingVIN, result: vinDecodeResult, decode } = useVINDecoder();

  const handleDecodeVIN = async () => {
    const vin = vinValue || '';
    const data = await decode(vin);
    
    if (data) {
      // Auto-populate fields from VIN
      if (data.make) {
        setValue('make', data.make);
        clearErrors('make');
      }
      if (data.model) {
        setValue('model', data.model);
        clearErrors('model');
      }
      if (data.year) {
        setValue('year', data.year);
        clearErrors('year');
      }
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      await createVehicle({
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        color: data.color,
        licensePlate: data.licensePlate,
        mileage: parseInt(data.mileage.replace(/,/g, '')),
        vin: data.vin || undefined,
      });

      navigate({ to: '/owner/vehicles' });
    } catch (error) {
      console.error('Failed to create vehicle:', error);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      navigate({ to: '/owner/vehicles' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Discard changes?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                You have unsaved changes. Are you sure you want to leave?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1"
                >
                  Keep editing
                </Button>
                <Button
                  onClick={() => navigate({ to: '/owner/vehicles' })}
                  className="flex-1"
                  variant="danger"
                >
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add Vehicle</h1>
        <p className="text-slate-600 text-sm mt-1">
          VIN helps providers quote more accurately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Preview */}
          <VehiclePreview
            make={watch('make') || 'Your'}
            model={watch('model') || 'Vehicle'}
            year={watch('year')}
            color={watch('color')}
            plate={watch('licensePlate')}
            mileage={watch('mileage')}
          />

          {/* Form Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  VIN (Recommended) auto-fills details • Only Make, Model, Year required
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VIN Input */}
                <VINInput
                  value={vinValue || ''}
                  onChange={(e) => {
                    const formatted = e.target.value
                      .toUpperCase()
                      .replace(/[^A-HJ-NPR-Z0-9]/gi, '')
                      .slice(0, 17);
                    setValue('vin', formatted);
                  }}
                  onBlur={() => {}}
                  error={errors.vin?.message}
                  isDecoding={isDecodingVIN}
                  decodeResult={vinDecodeResult}
                  onDecode={handleDecodeVIN}
                />

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-slate-500">Vehicle Details</span>
                  </div>
                </div>

                {/* Vehicle Details Fields Component */}
                <VehicleDetailsFields form={form} />
              </CardContent>

              {/* Form Footer */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Adding Vehicle...' : 'Add Vehicle'}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>

        {/* Right Sidebar - Guidance (1/3) */}
        <VehicleFormGuidance />
      </div>
    </div>
  );
}
