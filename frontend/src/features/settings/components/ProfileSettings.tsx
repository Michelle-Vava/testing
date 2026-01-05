import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useToast } from '@/contexts/ToastContext';
import { useAuthControllerUpdateProfile } from '@/api/generated/auth/auth';

/**
 * Profile settings form component
 * Manages personal information including name, email, phone, address
 */
export function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const { mutate: updateProfile, isPending: isSaving } = useAuthControllerUpdateProfile({
    mutation: {
      onSuccess: async () => {
        toast.success('Profile updated successfully');
        await refreshUser();
      },
      onError: () => {
        toast.error('Failed to update profile');
      }
    }
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ data: profileData });
  };

  const handleReset = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      avatarUrl: user?.avatarUrl || '',
    });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your contact details and public profile information.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className={inputClass}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={profileData.avatarUrl}
                onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className={inputClass}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                className={inputClass}
                placeholder="Halifax"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                className={inputClass}
                placeholder="NS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={profileData.zipCode}
                onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                className={inputClass}
                placeholder="B3H 0A1"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
