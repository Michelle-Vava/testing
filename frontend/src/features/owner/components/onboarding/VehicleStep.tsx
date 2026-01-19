import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';

interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  mileage: number;
  mileageUnit: 'miles' | 'km';
  vin: string;
}

interface VehicleStepProps {
  vehicle: VehicleData;
  onVehicleChange: (vehicle: VehicleData) => void;
  carMakes: { value: string; label: string }[];
  carModels: { value: string; label: string }[];
  isLoadingMakes: boolean;
  isLoadingModels: boolean;
  isDecodingVin: boolean;
  onVinChange: (vin: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function VehicleStep({
  vehicle,
  onVehicleChange,
  carMakes,
  carModels,
  isLoadingMakes,
  isLoadingModels,
  isDecodingVin,
  onVinChange,
  onSubmit,
  onBack,
}: VehicleStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Your First Vehicle</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Enter your VIN to auto-fill details, or add manually
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* VIN Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VIN (Vehicle Identification Number){' '}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={vehicle.vin}
              onChange={(e) => onVinChange(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
              placeholder="1HGBH41JXMN109186"
              maxLength={17}
            />
            {isDecodingVin && (
              <p className="mt-1 text-sm text-primary-600">Decoding VIN...</p>
            )}
            {vehicle.vin && vehicle.vin.length !== 17 && (
              <p className="mt-1 text-sm text-gray-500">
                {17 - vehicle.vin.length} characters remaining
              </p>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Vehicle Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make <span className="text-red-500">*</span>
                </label>
                <Combobox
                  options={carMakes}
                  value={vehicle.make}
                  onChange={(value) => {
                    onVehicleChange({ ...vehicle, make: value, model: '' });
                  }}
                  placeholder="Select make"
                  searchPlaceholder="Search makes..."
                  loading={isLoadingMakes}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <Combobox
                  options={carModels}
                  value={vehicle.model}
                  onChange={(value) =>
                    onVehicleChange({ ...vehicle, model: value })
                  }
                  placeholder="Select model"
                  searchPlaceholder="Search models..."
                  disabled={!vehicle.make}
                  loading={isLoadingModels}
                  required
                />
              </div>
            </div>
          </div>

          {/* Year and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                required
                value={vehicle.year}
                onChange={(e) =>
                  onVehicleChange({
                    ...vehicle,
                    year: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                aria-label="Vehicle year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                required
                value={vehicle.color}
                onChange={(e) =>
                  onVehicleChange({ ...vehicle, color: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Silver"
              />
            </div>
          </div>

          {/* License Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate
            </label>
            <input
              type="text"
              required
              value={vehicle.licensePlate}
              onChange={(e) =>
                onVehicleChange({ ...vehicle, licensePlate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="ABC-1234"
            />
          </div>

          {/* Mileage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Mileage <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                value={vehicle.mileage}
                onChange={(e) =>
                  onVehicleChange({
                    ...vehicle,
                    mileage: parseInt(e.target.value) || 0,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="45000"
                min="0"
              />
              <select
                value={vehicle.mileageUnit}
                onChange={(e) =>
                  onVehicleChange({
                    ...vehicle,
                    mileageUnit: e.target.value as 'miles' | 'km',
                  })
                }
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                aria-label="Mileage unit"
              >
                <option value="miles">Miles</option>
                <option value="km">km</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} fullWidth>
              Back
            </Button>

            <Button type="submit" fullWidth>
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
