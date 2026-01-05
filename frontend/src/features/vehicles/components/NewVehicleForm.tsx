import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { AlertCircle } from 'lucide-react';
import { decodeVIN, COMMON_MAKES, type VINDecodeResult } from '@/features/vehicles/utils/vin-decoder';
import { FormField } from '@/components/ui/form-field';
import { VINInput } from './VINInput';
import { VehiclePreview } from './VehiclePreview';
import { VehicleFormGuidance } from './VehicleFormGuidance';
import { validateField, validateAllFields, formatMileage, formatLicensePlate } from '../utils/vehicle-validation';

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  color?: string;
  mileage?: string;
  vin?: string;
}

export function NewVehicleForm() {
  const navigate = useNavigate();
  const { createVehicle, isCreating } = useVehicles();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
    mileage: '',
    vin: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDecodingVIN, setIsDecodingVIN] = useState(false);
  const [vinDecodeResult, setVinDecodeResult] = useState<VINDecodeResult | null>(null);

  // Track if form has any data
  useEffect(() => {
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    setIsDirty(hasData);
  }, [formData]);

  // VIN decode handler
  const handleVINDecode = useCallback(async () => {
    if (formData.vin.length !== 17) return;

    setIsDecodingVIN(true);
    setVinDecodeResult(null);
    
    try {
      const result = await decodeVIN(formData.vin);
      setVinDecodeResult(result);
      
      if (result.success) {
        // Normalize make to match dropdown options
        let normalizedMake = result.make;
        if (normalizedMake) {
          const matchedMake = COMMON_MAKES.find(
            m => m.toLowerCase() === normalizedMake!.toLowerCase()
          );
          normalizedMake = matchedMake || normalizedMake;
        }

        // Auto-populate from VIN
        setFormData(prev => ({
          ...prev,
          make: normalizedMake || prev.make,
          model: result.model || prev.model,
          year: result.year ? String(result.year) : prev.year,
        }));
        
        // Clear errors for auto-filled fields
        setErrors(prev => ({
          ...prev,
          make: undefined,
          model: undefined,
          year: undefined,
        }));
      }
    } catch (error) {
      console.error('VIN decode failed:', error);
    } finally {
      setIsDecodingVIN(false);
    }
  }, [formData.vin]);

  // Auto-decode when VIN is complete
  useEffect(() => {
    if (formData.vin.length === 17 && !errors.vin) {
      const timer = setTimeout(handleVINDecode, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.vin, errors.vin, handleVINDecode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Format specific fields
    if (name === 'licensePlate') {
      processedValue = formatLicensePlate(value);
    } else if (name === 'vin') {
      processedValue = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, '');
    }

    setFormData({ ...formData, [name]: processedValue });

    // Validate on change if already touched
    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateAllFields(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    
    try {
      await createVehicle({
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage.replace(/,/g, '')),
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
              <p className="text-slate-600">You have unsaved changes. Are you sure you want to leave?</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCancelConfirm(false)} fullWidth>
                  Keep editing
                </Button>
                <Button onClick={() => navigate({ to: '/owner/vehicles' })} fullWidth variant="danger">
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add Vehicle</h1>
        <p className="text-slate-600 text-sm mt-1">So you can request quotes and track service history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Preview */}
          <VehiclePreview
            make={formData.make || 'Your'}
            model={formData.model || 'Vehicle'}
            year={formData.year}
            color={formData.color}
            plate={formData.licensePlate}
            mileage={formData.mileage}
          />

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Enter VIN first to auto-fill vehicle details • Fields marked with * are required
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VIN Input */}
                <VINInput
                  value={formData.vin}
                  onChange={handleChange}
                  onBlur={() => handleBlur('vin')}
                  error={touched.vin ? errors.vin : undefined}
                  isDecoding={isDecodingVIN}
                  decodeResult={vinDecodeResult}
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

                {/* Make & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      label="Make"
                      name="make"
                      type="select"
                      value={formData.make}
                      onChange={handleChange}
                      onBlur={() => handleBlur('make')}
                      error={touched.make ? errors.make : undefined}
                      required
                      options={[
                        { value: '', label: 'Select make...' },
                        ...COMMON_MAKES.map(make => ({ value: make, label: make })),
                        { value: 'other', label: 'Other (type below)' },
                      ]}
                    />
                    {formData.make === 'other' && (
                      <input
                        type="text"
                        placeholder="Enter make"
                        className="mt-2 w-full px-4 py-2 border border-slate-300 rounded-lg"
                        onChange={(e) => setFormData({...formData, make: e.target.value})}
                      />
                    )}
                  </div>

                  <FormField
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    onBlur={() => handleBlur('model')}
                    error={touched.model ? errors.model : undefined}
                    placeholder="Camry"
                    required
                  />
                </div>

                {/* Year & Color */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    onBlur={() => handleBlur('year')}
                    error={touched.year ? errors.year : undefined}
                    placeholder="2020"
                    required
                  />

                  <FormField
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    onBlur={() => handleBlur('color')}
                    error={touched.color ? errors.color : undefined}
                    placeholder="Silver"
                    required
                  />
                </div>

                {/* License Plate */}
                <FormField
                  label="License Plate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  onBlur={() => handleBlur('licensePlate')}
                  error={touched.licensePlate ? errors.licensePlate : undefined}
                  placeholder="ABC 123"
                  helpText="Used to quickly identify your vehicle in bookings."
                  required
                />

                {/* Mileage */}
                <FormField
                  label="Current Mileage (km)"
                  name="mileage"
                  type="number"
                  value={formData.mileage ? formatMileage(formData.mileage) : ''}
                  onChange={handleChange}
                  onBlur={() => handleBlur('mileage')}
                  error={touched.mileage ? errors.mileage : undefined}
                  placeholder="50,000"
                  helpText="Helps mechanics estimate service needs."
                  required
                />
              </CardContent>

              {/* Form Footer */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isCreating || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
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
