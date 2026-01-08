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
  const [isEditing, setIsEditing] = useState(false);

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
        setIsEditing(false);
      },
      onError: () => {
        toast.error('Failed to update profile');
      }
    }
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map frontend fields to backend DTO
    // Exclude email as it cannot be updated via this endpoint
    const { email, phone, ...rest } = profileData;
    
    updateProfile({ 
      data: {
        ...rest,
        phoneNumber: phone,
      } 
    });
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
    setIsEditing(false);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const readOnlyClass = "w-full px-3 py-2 border border-transparent bg-gray-50 rounded-lg text-gray-700";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your contact details and public profile information.
            </p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={inputClass}
                  placeholder="John Doe"
                />
              ) : (
                <div className={readOnlyClass}>{profileData.name || '-'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className={readOnlyClass}>{profileData.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className={inputClass}
                  placeholder="(555) 123-4567"
                />
              ) : (
                <div className={readOnlyClass}>{profileData.phone || '-'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileData.avatarUrl}
                  onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://example.com/avatar.jpg"
                />
              ) : (
                <div className={readOnlyClass}>{profileData.avatarUrl || '-'}</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className={inputClass}
                placeholder="123 Main Street"
              />
            ) : (
              <div className={readOnlyClass}>{profileData.address || '-'}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className={inputClass}
                  placeholder="Halifax"
                />
              ) : (
                <div className={readOnlyClass}>{profileData.city || '-'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className={inputClass}
                  placeholder="NS"
                />
              ) : (
                <div className={readOnlyClass}>{profileData.state || '-'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.zipCode}
                  onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                  className={inputClass}
                  placeholder="B3H 0A1"
                />
              ) : (
                <div className={readOnlyClass}>{profileData.zipCode || '-'}</div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
