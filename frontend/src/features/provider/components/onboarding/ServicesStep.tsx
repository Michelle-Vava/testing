import { formatPostalCode } from '../../utils/validation';
import type { ProviderProfile, FieldError } from './types';
import { FormField } from './FormField';

interface ServicesStepProps {
  profile: ProviderProfile;
  errors: FieldError;
  serviceTypes: string[];
  toggleServiceType: (type: string) => void;
  updateField: (field: keyof ProviderProfile, value: any) => void;
}

export function ServicesStep({ 
  profile, 
  errors, 
  serviceTypes, 
  toggleServiceType, 
  updateField 
}: ServicesStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Services & Coverage</h2>
        <p className="text-sm text-slate-600">What you offer and where you operate</p>
      </div>

      {/* Address Section */}
      <div className="bg-slate-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Business Location</h3>
        
        <FormField label="Street Address" error={errors.address} required>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => updateField('address', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.address ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="123 Main Street"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Unit / Suite">
            <input
              type="text"
              value={profile.unit}
              onChange={(e) => updateField('unit', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Unit 5"
            />
          </FormField>

          <FormField label="Postal Code" error={errors.postalCode} required>
            <input
              type="text"
              value={profile.postalCode}
              onChange={(e) => updateField('postalCode', formatPostalCode(e.target.value))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.postalCode ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="A1A 1A1"
              maxLength={7}
            />
          </FormField>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Services Offered *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceTypes.map((type: string) => (
            <label
              key={type}
              className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                profile.serviceTypes.includes(type)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={profile.serviceTypes.includes(type)}
                onChange={() => toggleServiceType(type)}
                className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.serviceTypes && (
          <p className="text-sm text-red-600 mt-2">{errors.serviceTypes}</p>
        )}
      </div>

      {/* Mobile Service Section */}
      <div className="border-t pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.mobileService}
            onChange={(e) => updateField('mobileService', e.target.checked)}
            className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-slate-900">I offer mobile service</span>
            <p className="text-xs text-slate-500">Travel to customer locations</p>
          </div>
        </label>
      </div>

      {profile.mobileService && (
        <FormField label="Service Radius (km)" error={errors.serviceRadius} required>
          <input
            type="number"
            value={profile.serviceRadius}
            onChange={(e) => updateField('serviceRadius', parseInt(e.target.value) || 0)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.serviceRadius ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="25"
            min="1"
            max="500"
          />
        </FormField>
      )}
    </div>
  );
}
