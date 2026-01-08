import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Shield } from 'lucide-react';
import { useProvidersControllerFindAll } from '@/api/generated/providers/providers';

export const Route = createFileRoute('/owner/_layout/providers/')({
  component: ProvidersBrowsePage,
});

interface Provider {
  id: string;
  name: string;
  businessName?: string;
  rating: number;
  reviewCount: number;
  serviceTypes: string[];
  city: string;
  state: string;
  certifications?: string[];
  isMobileService: boolean;
  isShopService: boolean;
}

function ProvidersBrowsePage() {
  const [serviceType, setServiceType] = useState<string>('');
  const [mobileService, setMobileService] = useState<boolean | null>(null);
  const [shopService, setShopService] = useState<boolean | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  const { data: providers = [], isLoading } = useProvidersControllerFindAll({
    params: {
      serviceType: serviceType || undefined,
      mobileService: mobileService ?? undefined,
      shopService: shopService ?? undefined,
      minRating: minRating > 0 ? minRating : undefined,
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Providers</h1>
        <p className="text-slate-600">Find trusted providers in your area</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Type
              </label>
              <select
                title="Service Type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Services</option>
                <option value="oil-change">Oil Change</option>
                <option value="brake-service">Brake Service</option>
                <option value="tire-service">Tire Service</option>
                <option value="engine-diagnostics">Engine Diagnostics</option>
                <option value="ac-service">A/C Service</option>
                <option value="general-maintenance">General Maintenance</option>
              </select>
            </div>

            {/* Mobile Service Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Service
              </label>
              <div className="flex gap-2">
                <Button
                  variant={mobileService === true ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setMobileService(mobileService === true ? null : true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={mobileService === false ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setMobileService(mobileService === false ? null : false)}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>

            {/* Shop Service Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Shop Service
              </label>
              <div className="flex gap-2">
                <Button
                  variant={shopService === true ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShopService(shopService === true ? null : true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={shopService === false ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShopService(shopService === false ? null : false)}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimum Rating
              </label>
              <select
                title="Minimum Rating"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 w-16 bg-slate-200 rounded-full mb-4" />
                <div className="h-6 bg-slate-200 rounded mb-2" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No providers found
            </h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setServiceType('');
                setMobileService(null);
                setShopService(null);
                setMinRating(0);
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider: any) => (
            <Link
              key={provider.id}
              to="/owner/providers/$providerId"
              params={{ providerId: provider.id }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border border-slate-200">
                <CardContent className="p-6">
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                      {provider.avatarUrl ? (
                        <img
                          src={provider.avatarUrl}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-slate-600">
                          {provider.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium text-slate-900">
                          {provider.rating ? Number(provider.rating).toFixed(1) : 'N/A'}
                        </span>
                        <span className="text-slate-500">
                          ({provider.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {provider.bio && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {provider.bio}
                    </p>
                  )}

                  {/* Location */}
                  {provider.city && provider.state && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {provider.city}, {provider.state}
                      </span>
                    </div>
                  )}

                  {/* Service Types */}
                  <div className="flex items-center gap-2 mb-4">
                    {provider.isMobileService && (
                      <Badge variant="info" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Mobile
                      </Badge>
                    )}
                    {provider.isShopService && (
                      <Badge variant="info" className="text-xs">
                        Shop
                      </Badge>
                    )}
                  </div>

                  {/* Certifications */}
                  {provider.certifications && provider.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {provider.certifications.slice(0, 3).map((cert: string) => (
                        <Badge
                          key={cert}
                          variant="default"
                          className="text-xs border-yellow-500 text-yellow-700 bg-white"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                      {provider.certifications.length > 3 && (
                        <Badge variant="default" className="text-xs bg-white text-slate-600 border border-slate-200">
                          +{provider.certifications.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button className="w-full" size="sm">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
