import { CANADIAN_PROVINCES, formatPhoneNumber } from '../../utils/validation';
import type { ProviderProfile, FieldError } from './types';
import { FormField } from './FormField';

interface BusinessInfoStepProps {
  profile: ProviderProfile;
  errors: FieldError;
  updateField: (field: keyof ProviderProfile, value: any) => void;
}

export function BusinessInfoStep({ profile, errors, updateField }: BusinessInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Business Information</h2>
        <p className="text-sm text-slate-600">Let's start with the basics</p>
      </div>

      <FormField label="Business Name" error={errors.businessName} required>
        <input
          id="businessName"
          type="text"
          value={profile.businessName}
          onChange={(e) => updateField('businessName', e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
            errors.businessName ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder="ABC Auto Repair"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Phone Number" error={errors.phoneNumber} required>
          <input
            id="phoneNumber"
            type="tel"
            value={profile.phoneNumber}
            onChange={(e) => updateField('phoneNumber', formatPhoneNumber(e.target.value))}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.phoneNumber ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="(555) 123-4567"
          />
        </FormField>

        <FormField label="Years in Business" error={errors.yearsInBusiness} required>
          <input
            id="yearsInBusiness"
            type="number"
            value={profile.yearsInBusiness || ''}
            onChange={(e) => updateField('yearsInBusiness', parseInt(e.target.value) || 0)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.yearsInBusiness ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="5"
            min="0"
            max="100"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="City" error={errors.city} required>
          <input
            id="city"
            type="text"
            value={profile.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.city ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Halifax"
          />
        </FormField>

        <FormField label="Province" error={errors.province} required>
          <select
            id="province"
            aria-label="Select province"
            value={profile.province}
            onChange={(e) => updateField('province', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.province ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select province</option>
            {CANADIAN_PROVINCES.map((prov) => (
              <option key={prov.code} value={prov.code}>
                {prov.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
}
