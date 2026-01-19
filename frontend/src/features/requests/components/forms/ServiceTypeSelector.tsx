import { ServiceType } from '@/features/requests/types/request';
import { useServicesControllerFindAll } from '@/services/generated/services/services';
import { Loader2 } from 'lucide-react';

/**
 * Props for the ServiceTypeSelector component.
 */
interface ServiceTypeSelectorProps {
  value: ServiceType;
  onChange: (serviceType: ServiceType) => void;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isPopular: boolean;
}

export function ServiceTypeSelector({ value, onChange }: ServiceTypeSelectorProps) {
  const { data: services, isLoading } = useServicesControllerFindAll();

  // Fallback if API fails or is loading
  if (isLoading) {
    return (
        <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
    );
  }

  const serviceList = (services as unknown as Service[]) || [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What service do you need? *
      </label>
      <p className="text-xs text-gray-600 mb-3">Select the type of service for your vehicle</p>
      <div className="grid grid-cols-2 gap-2">
        {serviceList.map((service) => (
          <button
            key={service.slug}
            type="button"
            onClick={() => onChange(service.slug as ServiceType)}
            className={`px-4 py-3 text-sm rounded-lg border-2 transition-all flex flex-col items-center gap-1 text-center h-24 justify-center ${
              value === service.slug
                ? 'border-yellow-500 bg-yellow-50 text-slate-900 font-medium shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{service.icon || '🔧'}</span>
            <span>{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
