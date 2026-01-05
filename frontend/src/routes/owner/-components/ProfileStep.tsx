import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneInput } from '@/components/ui/phone-input';
import { Combobox } from '@/components/ui/combobox';

interface ProfileData {
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ProfileStepProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
  onSubmit: () => void;
}

// Canadian provinces and territories
const canadianProvinces = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'YT', label: 'Yukon' },
];

export function ProfileStep({ profile, onProfileChange, onSubmit }: ProfileStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!profile.state) {
        setCities([]);
        return;
      }

      setIsLoadingCities(true);
      try {
        // Using GeoNames API for Canadian cities
        const provinceName = canadianProvinces.find(p => p.value === profile.state)?.label;
        if (!provinceName) return;

        const response = await fetch(
          `https://secure.geonames.org/searchJSON?country=CA&adminCode1=${profile.state}&featureClass=P&maxRows=100&username=demo&orderby=population`
        );
        const data = await response.json();
        
        const cityList = data.geonames
          ?.map((city: any) => ({
            value: city.name,
            label: city.name,
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label)) || [];
        
        setCities(cityList.length > 0 ? cityList : [
          { value: 'Other', label: 'Other - Type manually' }
        ]);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setCities([{ value: 'Other', label: 'Other - Type manually' }]);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, [profile.state]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'phoneNumber':
        if (!value) return 'Phone number is required';
        if (value.replace(/\D/g, '').length < 10) return 'Please enter a valid phone number';
        return '';
      case 'address':
        if (!value) return 'Address is required';
        if (value.length < 5) return 'Please enter a complete address';
        return '';
      case 'city':
        if (!value) return 'City is required';
        if (value.length < 2) return 'Please enter a valid city name';
        return '';
      case 'state':
        if (!value) return 'State/Province is required';
        return '';
      case 'zipCode':
        if (!value) return 'ZIP/Postal code is required';
        if (value.length < 3) return 'Please enter a valid postal code';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, profile[name as keyof ProfileData]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (name: string, value: string) => {
    onProfileChange({ ...profile, [name]: value });
    // Clear error on change for better UX
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(profile).forEach((key) => {
      const error = validateField(key, profile[key as keyof ProfileData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      phoneNumber: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
    });

    // If no errors, proceed
    if (Object.keys(newErrors).every((key) => !newErrors[key])) {
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Please provide your contact information</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              value={profile.phoneNumber}
              onChange={(value) => handleChange('phoneNumber', value)}
              required
              error={touched.phoneNumber ? errors.phoneNumber : undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Street address"
            />
            {touched.address && errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <Combobox
                options={canadianProvinces}
                value={profile.state}
                onChange={(value) => {
                  // Update both state and city in a single call to avoid race condition
                  onProfileChange({ ...profile, state: value, city: '' });
                  // Clear errors for both fields
                  const stateError = validateField('state', value);
                  const cityError = validateField('city', '');
                  setErrors({ ...errors, state: stateError, city: cityError });
                }}
                placeholder="Select province"
                searchPlaceholder="Search provinces..."
              />
              {touched.state && errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <Combobox
                options={cities}
                value={profile.city}
                onChange={(value) => handleChange('city', value)}
                placeholder="Select city"
                searchPlaceholder="Search cities..."
                disabled={!profile.state}
                loading={isLoadingCities}
              />
              {touched.city && errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
              {profile.city === 'Other' && (
                <input
                  type="text"
                  value={profile.city !== 'Other' ? profile.city : ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  className={`mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    touched.city && errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city name"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('zipCode')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                touched.zipCode && errors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Postal code"
              maxLength={7}
            />
            {touched.zipCode && errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
            )}
          </div>

          <Button type="submit" fullWidth>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
