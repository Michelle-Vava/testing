import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { customInstance } from '@/lib/axios';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

const usePopularServices = () => {
  return useQuery({
    queryKey: ['services', 'popular'],
    queryFn: () => customInstance<Service[]>({
      url: '/services/popular',
      method: 'GET'
    })
  });
};

export function PopularServices() {
  const navigate = useNavigate();
  const { data: services, isLoading } = usePopularServices();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  const handleServiceClick = (slug: string) => {
    navigate({ to: '/owner/requests/new', search: { serviceType: slug, providerId: undefined } });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Services</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceClick(service.slug)}
            className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
          >
            <span className="text-2xl">{service.icon}</span>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 group-hover:text-yellow-700">
                {service.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{service.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
