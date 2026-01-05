import { useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function ProviderSetup() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    businessName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    serviceTypes: [] as string[],
    yearsInBusiness: 0,
  });

  const serviceTypes = [
    'Oil Change',
    'Tire Service',
    'Brake Service',
    'Engine Diagnostic',
    'Transmission Service',
    'Battery Service',
    'Air Conditioning',
    'General Maintenance',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        businessName: profile.businessName,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        serviceTypes: profile.serviceTypes,
        yearsInBusiness: profile.yearsInBusiness,
        onboardingComplete: true,
      });

      navigate({ to: '/provider/dashboard' });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const toggleServiceType = (type: string) => {
    const current = profile.serviceTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setProfile({ ...profile, serviceTypes: updated });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Up Your Provider Profile
          </h1>
          <p className="text-gray-600">
            Complete your business information to start receiving job requests
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="ABC Auto Repair"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  required
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={profile.zipCode}
                  onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="94102"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business *
                </label>
                <input
                  type="number"
                  required
                  value={profile.yearsInBusiness}
                  onChange={(e) => setProfile({ ...profile, yearsInBusiness: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="5"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Services Offered *</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select all services you provide
              </p>
              <div className="grid grid-cols-2 gap-3">
                {serviceTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={profile.serviceTypes?.includes(type)}
                      onChange={() => toggleServiceType(type)}
                      className="rounded"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" fullWidth disabled={!profile.serviceTypes?.length}>
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  );
}
