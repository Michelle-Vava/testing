import { useNavigate } from '@tanstack/react-router';
import { Star, MapPin, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProvidersControllerFindFeatured } from '@/services/generated/providers/providers';

interface Provider {
  id: string;
  name: string;
  businessName?: string;
  rating: number;
  reviewCount: number;
  serviceTypes?: string[];
  specialties?: string[];
  city: string;
  state: string;
  certifications?: string[];
  isMobileService?: boolean;
  isShopService?: boolean;
}

export function ProviderPreview() {
  const navigate = useNavigate();
  const { data, isLoading } = useProvidersControllerFindFeatured();
  const providers = (data as unknown as Provider[]) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <GridSkeleton items={3} />
      </div>
    );
  }

  if (!providers || providers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Top-Rated Providers</h3>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/owner/providers' })}
          className="text-yellow-600 hover:text-yellow-700"
        >
          View All
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {providers.slice(0, 3).map((provider) => (
          <div
            key={provider.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate({ to: `/owner/providers/${provider.id}` })}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">
                  {provider.businessName || provider.name}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-900">
                    {provider.rating ? Number(provider.rating).toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({provider.reviewCount || 0})
                  </span>
                </div>
              </div>
              {provider.certifications && provider.certifications.length > 0 && (
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">
                  {provider.city}, {provider.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4" />
                <span>
                  {provider.isMobileService && provider.isShopService
                    ? 'Mobile & Shop'
                    : provider.isMobileService
                    ? 'Mobile Service'
                    : provider.isShopService
                    ? 'Shop Service'
                    : 'Available Now'}
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {(provider.specialties || provider.serviceTypes)?.slice(0, 2).map((service, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                >
                  {service}
                </span>
              ))}
              {(provider.specialties || provider.serviceTypes) && (provider.specialties || provider.serviceTypes)!.length > 2 && (
                <span className="text-xs text-slate-500 px-2 py-1">
                  +{(provider.specialties || provider.serviceTypes)!.length - 2} more
                </span>
              )}
            </div>

            <Button
              className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ 
                  to: '/owner/requests/new', 
                  search: { 
                    providerId: provider.id,
                    serviceType: undefined 
                  } 
                });
              }}
            >
              Request Quote
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
