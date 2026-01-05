import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Shield, Phone, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { customInstance } from '@/lib/axios';

export const Route = createFileRoute('/owner/_layout/providers/$providerId')({
  component: ProviderProfilePage,
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
  zipCode?: string;
  certifications?: string[];
  isMobileService: boolean;
  isShopService: boolean;
  avatarUrl?: string;
  bio?: string;
  email?: string;
  phone?: string;
  address?: string;
  serviceArea?: string[];
  shopPhotos?: string[];
}

function useProvider(providerId: string) {
  return useQuery({
    queryKey: ['providers', providerId],
    queryFn: () => customInstance<Provider>({
      url: `/providers/${providerId}`,
      method: 'GET'
    }),
    enabled: !!providerId
  });
}

function ProviderProfilePage() {
  const { providerId } = Route.useParams();
  const { data: provider, isLoading } = useProvider(providerId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="animate-pulse">
          <CardContent className="p-8">
            <div className="h-24 w-24 bg-slate-200 rounded-full mb-4" />
            <div className="h-8 bg-slate-200 rounded mb-4 w-1/3" />
            <div className="h-4 bg-slate-200 rounded mb-2 w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Provider not found
            </h3>
            <p className="text-slate-600 mb-6">
              The provider you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/owner/providers">
              <Button>Browse All Providers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="shadow-md border border-slate-200">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {provider.avatarUrl ? (
                <img
                  src={provider.avatarUrl}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-slate-600">
                  {provider.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {provider.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-lg text-slate-900">
                    {provider.rating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-slate-500">
                    ({provider.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Service Types */}
              <div className="flex items-center gap-2 mb-4">
                {provider.isMobileService && (
                  <Badge variant="info" className="text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    Mobile Service Available
                  </Badge>
                )}
                {provider.isShopService && (
                  <Badge variant="info" className="text-sm">
                    Shop Service Available
                  </Badge>
                )}
              </div>

              {/* Bio */}
              {provider.bio && (
                <p className="text-slate-700 mb-4">{provider.bio}</p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mb-4">
                {provider.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4" />
                    <span>{provider.phone}</span>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4" />
                    <span>{provider.email}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              {provider.isShopService && provider.address && (
                <div className="flex items-start gap-2 text-slate-700 mb-4">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>{provider.address}</p>
                    <p>
                      {provider.city}, {provider.state} {provider.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col gap-2">
                <Link
                  to="/owner/requests/new"
                  search={{ providerId: provider.id, serviceType: undefined }}
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    Request Quote
                  </Button>
                </Link>
                <p className="text-xs text-slate-500">
                  Requesting a quote sends your job details to this provider only.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      {provider.certifications && provider.certifications.length > 0 && (
        <Card className="shadow-md border border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {provider.certifications.map((cert: string) => (
                <Badge
                  key={cert}
                  variant="warning"
                  className="text-sm border-yellow-500 text-yellow-700 px-3 py-1"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Offered */}
      {provider.serviceArea && provider.serviceArea.length > 0 && (
        <Card className="shadow-md border border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Services Offered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {provider.serviceArea.map((service: string) => (
                <div
                  key={service}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-slate-700 capitalize">
                    {service.replace(/-/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shop Photos */}
      {provider.shopPhotos && provider.shopPhotos.length > 0 && (
        <Card className="shadow-md border border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Shop Photos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {provider.shopPhotos.map((photo: string, index: number) => (
                <div
                  key={index}
                  className="aspect-video bg-slate-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Shop photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
