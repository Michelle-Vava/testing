import { CANADIAN_PROVINCES } from '../../utils/validation';
import { FormFieldWrapper } from '@/components/ui/FormField';
import { UseFormReturn } from 'react-hook-form';
import { ProviderOnboardingFormData } from '@/lib/schemas/form-schemas';

interface BusinessInfoStepProps {
  form: UseFormReturn<ProviderOnboardingFormData>;
  serviceTypes: string[];
}

export function BusinessInfoStep({ form, serviceTypes }: BusinessInfoStepProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const selectedServiceTypes = watch('serviceTypes') || [];

  const toggleServiceType = (type: string) => {
    const current = selectedServiceTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setValue('serviceTypes', updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Quick Setup</h2>
        <p className="text-sm text-slate-600">Tell us about your business - just the basics</p>
      </div>

      <FormFieldWrapper label="Business Name" error={errors.businessName?.message} required>
        <input
          {...register('businessName')}
          type="text"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
            errors.businessName ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder="ABC Auto Repair"
        />
      </FormFieldWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldWrapper label="City" error={errors.city?.message} required>
          <input
            {...register('city')}
            type="text"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.city ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Toronto"
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Province" error={errors.province?.message} required>
          <select
            {...register('province')}
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
        </FormFieldWrapper>
      </div>

      {/* Service Types */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Services You Offer * 
          {errors.serviceTypes && (
            <span className="text-red-500 text-xs ml-2">{errors.serviceTypes.message}</span>
          )}
        </label>
        <p className="text-xs text-slate-500 mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleServiceType(type)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedServiceTypes.includes(type)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Service Radius - Optional */}
      <FormFieldWrapper 
        label="Service Radius (Optional)" 
        error={errors.serviceRadius?.message}
        helpText="How far will you travel for jobs?"
      >
        <div className="relative">
          <input
            {...register('serviceRadius', { 
              setValueAs: (v) => v === '' ? undefined : Number(v) 
            })}
            type="number"
            min="1"
            max="500"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.serviceRadius ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="25"
          />
          <span className="absolute right-3 top-2.5 text-slate-500">km</span>
        </div>
      </FormFieldWrapper>

      {/* Informational Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Quick start:</strong> You can add more details like phone number, address, and years in business later from your profile settings.
        </p>
      </div>
    </div>
  );
}
