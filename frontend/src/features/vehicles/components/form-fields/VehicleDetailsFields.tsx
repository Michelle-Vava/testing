import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '../../schemas/vehicle-form.schema';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { COMMON_MAKES } from '../../utils/vin-decoder';

interface VehicleDetailsFieldsProps {
  form: UseFormReturn<VehicleFormData>;
}

/**
 * Vehicle Details Fields - Make, Model, Year, Color, License Plate, Mileage
 * 
 * Extracted from NewVehicleForm for better organization
 */
export function VehicleDetailsFields({ form }: VehicleDetailsFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const make = watch('make');

  return (
    <>
      {/* Make & Model */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">
            Make <span className="text-red-500">*</span>
          </Label>
          <select
            id="make"
            {...register('make')}
            className={`w-full px-4 py-3 border rounded-lg transition-all ${
              errors.make
                ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                : 'border-slate-300 focus:ring-2 focus:ring-yellow-500'
            }`}
          >
            <option value="">Select make...</option>
            {COMMON_MAKES.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
            <option value="other">Other (type below)</option>
          </select>
          {errors.make && (
            <p className="text-sm text-red-600">{errors.make.message}</p>
          )}
          
          {make === 'other' && (
            <Input
              placeholder="Enter make"
              className="mt-2"
              onChange={(e) => setValue('make', e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">
            Model <span className="text-red-500">*</span>
          </Label>
          <Input
            id="model"
            {...register('model')}
            placeholder="Camry"
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && (
            <p className="text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>
      </div>

      {/* Year & Color */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">
            Year <span className="text-red-500">*</span>
          </Label>
          <Input
            id="year"
            type="number"
            {...register('year')}
            placeholder="2020"
            className={errors.year ? 'border-red-500' : ''}
          />
          {errors.year && (
            <p className="text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">
            Color
          </Label>
          <Input
            id="color"
            {...register('color')}
            placeholder="Silver (optional)"
            className={errors.color ? 'border-red-500' : ''}
          />
          {errors.color && (
            <p className="text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>
      </div>

      {/* License Plate */}
      <div className="space-y-2">
        <Label htmlFor="licensePlate">
          License Plate
        </Label>
        <Input
          id="licensePlate"
          {...register('licensePlate', {
            onChange: (e) => {
              // Auto-format to uppercase
              e.target.value = e.target.value.toUpperCase();
            },
          })}
          placeholder="ABC 123 (optional)"
          className={errors.licensePlate ? 'border-red-500' : ''}
        />
        {!errors.licensePlate && (
          <p className="text-sm text-slate-500">
            Helps providers identify your vehicle (optional)
          </p>
        )}
        {errors.licensePlate && (
          <p className="text-sm text-red-600">{errors.licensePlate.message}</p>
        )}
      </div>

      {/* Mileage */}
      <div className="space-y-2">
        <Label htmlFor="mileage">
          Current Mileage (km)
        </Label>
        <Input
          id="mileage"
          type="text"
          inputMode="numeric"
          {...register('mileage', {
            onChange: (e) => {
              // Auto-format with commas
              const value = e.target.value.replace(/,/g, '');
              if (/^\d*$/.test(value)) {
                e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            },
          })}
          placeholder="50,000"
          className={errors.mileage ? 'border-red-500' : ''}
        />
        {!errors.mileage && (
          <p className="text-sm text-slate-500">
            Helps mechanics estimate service needs.
          </p>
        )}
        {errors.mileage && (
          <p className="text-sm text-red-600">{errors.mileage.message}</p>
        )}
      </div>
    </>
  );
}
