import { ServiceType } from '@/features/requests/types/request';

/**
 * Props for the ServiceTypeSelector component.
 */
interface ServiceTypeSelectorProps {
  value: ServiceType;
  onChange: (serviceType: ServiceType) => void;
}

const SERVICE_OPTIONS = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'engine_diagnostic', label: 'Engine Diagnostic' },
  { value: 'battery_replacement', label: 'Battery' },
  { value: 'general_maintenance', label: 'Maintenance' },
] as const;

export function ServiceTypeSelector({ value, onChange }: ServiceTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What service do you need? *
      </label>
      <p className="text-xs text-gray-600 mb-3">Select the type of service for your vehicle</p>
      <div className="grid grid-cols-2 gap-2">
        {SERVICE_OPTIONS.map((service) => (
          <button
            key={service.value}
            type="button"
            onClick={() => onChange(service.value as ServiceType)}
            className={`px-4 py-3 text-sm rounded-lg border-2 transition-all ${
              value === service.value
                ? 'border-yellow-500 bg-yellow-50 text-slate-900 font-medium shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {service.label}
          </button>
        ))}
      </div>
    </div>
  );
}
