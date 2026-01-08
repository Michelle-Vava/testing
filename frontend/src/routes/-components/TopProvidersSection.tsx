import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProviderProfileDrawer } from './ProviderProfileDrawer';

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  responseTime: string;
  specialties?: string[];
  email: string;
  isVerified: boolean;
}

interface TopProvidersSectionProps {
  providers: Provider[];
  handleRequestQuote: () => void;
  loading?: boolean;
}

export function TopProvidersSection({ providers, loading }: TopProvidersSectionProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const handleCardClick = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Top-Rated Providers Near You</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              All providers are verified, insured, and have passed background checks.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading providers...</p>
            </div>
          )}

          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={() => handleCardClick(provider)}
                  className="cursor-pointer"
                >
                  <Card hoverable>
                    <CardContent className="py-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700">
                          {provider.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{provider.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm text-slate-700">{Number(provider.rating).toFixed(1)} ({provider.reviewCount})</span>
                            </div>
                            {provider.isVerified && (
                              <span 
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 cursor-help"
                                title="Verified providers have passed background checks, provided proof of insurance and certifications, and maintain a minimum 4.0 rating."
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-600">{provider.distance} • {provider.responseTime}</div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {provider.specialties?.slice(0, 2).map((s) => (
                          <Badge key={s} className="text-xs">{s}</Badge>
                        ))}
                        {provider.specialties && provider.specialties.length > 2 && (
                          <Badge className="text-xs">+{provider.specialties.length - 2}</Badge>
                        )}
                      </div>
                      <motion.div whileHover={{ opacity: 1 }} initial={{ opacity: 0.9 }}>
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(provider);
                          }}
                        >
                          View Profile
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Provider Profile Drawer */}
      {selectedProvider && (
        <ProviderProfileDrawer
          isOpen={!!selectedProvider}
          onClose={() => setSelectedProvider(null)}
          provider={{
            ...selectedProvider,
            estimatedArrival: selectedProvider.responseTime,
            specializations: selectedProvider.specialties,
            verified: true,
            bio: `Experienced provider specializing in ${selectedProvider.specialties?.join(', ') || 'general auto repair'}. Committed to providing quality service with transparent pricing.`,
            shopType: 'Mobile Service',
            certifications: ['ASE Certified', 'Licensed & Insured'],
          }}
        />
      )}
    </>
  );
}
