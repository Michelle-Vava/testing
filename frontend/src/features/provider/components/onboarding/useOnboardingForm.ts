import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { validatePostalCode, validatePhoneNumber } from '../../utils/validation';
import type { OnboardingStep, ProviderProfile, FieldError } from './types';

export function useOnboardingForm() {
  const navigate = useNavigate();
  const { updateProfile, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FieldError>({});
  
  const [profile, setProfile] = useState<ProviderProfile>({
    businessName: '',
    phoneNumber: '',
    address: '',
    unit: '',
    city: '',
    province: '',
    postalCode: '',
    yearsInBusiness: 0,
    serviceTypes: [],
    mobileService: false,
    serviceRadius: 25,
  });

  // Autosave draft
  useEffect(() => {
    // Prevent autosaving empty state on initial mount
    const isDefaultState = !profile.businessName && !profile.address && profile.serviceTypes.length === 0;
    if (isDefaultState) return;

    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [profile]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('provider-onboarding-draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setProfile(parsed);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  const saveDraft = () => {
    localStorage.setItem('provider-onboarding-draft', JSON.stringify(profile));
    setLastSaved(new Date());
  };

  const validateBusinessInfo = (): boolean => {
    const newErrors: FieldError = {};

    if (!profile.businessName || profile.businessName.length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    if (!validatePhoneNumber(profile.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!profile.city) {
      newErrors.city = 'City is required';
    }

    if (!profile.province) {
      newErrors.province = 'Province is required';
    }

    if (profile.yearsInBusiness < 0 || profile.yearsInBusiness > 100) {
      newErrors.yearsInBusiness = 'Please enter a valid number of years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateServices = (): boolean => {
    const newErrors: FieldError = {};

    if (!profile.address) {
      newErrors.address = 'Address is required';
    }

    if (!validatePostalCode(profile.postalCode)) {
      newErrors.postalCode = 'Please enter a valid postal code (A1A 1A1)';
    }

    if (profile.serviceTypes.length === 0) {
      newErrors.serviceTypes = 'Please select at least one service';
    }

    if (profile.mobileService && (profile.serviceRadius < 1 || profile.serviceRadius > 500)) {
      newErrors.serviceRadius = 'Service radius must be between 1 and 500 km';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 'business') {
      if (validateBusinessInfo()) {
        setCurrentStep('services');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const firstErrorField = Object.keys(errors)[0];
        document.getElementById(firstErrorField)?.focus();
      }
    } else if (currentStep === 'services') {
      if (validateServices()) {
        setCurrentStep('review');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'services') {
      setCurrentStep('business');
    } else if (currentStep === 'review') {
      setCurrentStep('services');
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    
    try {
      const formattedAddress = `${profile.address}${profile.unit ? `, ${profile.unit}` : ''}`;
      
      await updateProfile({
        businessName: profile.businessName,
        phoneNumber: profile.phoneNumber,
        address: formattedAddress,
        city: profile.city,
        state: profile.province,
        zipCode: profile.postalCode,
        shopAddress: formattedAddress,
        shopCity: profile.city,
        shopState: profile.province,
        shopZipCode: profile.postalCode,
        serviceTypes: profile.serviceTypes,
        yearsInBusiness: profile.yearsInBusiness,
        onboardingComplete: true,
      });

      localStorage.removeItem('provider-onboarding-draft');
      await refreshUser();
      navigate({ to: '/provider/dashboard' });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleServiceType = (type: string) => {
    const updated = profile.serviceTypes.includes(type)
      ? profile.serviceTypes.filter(t => t !== type)
      : [...profile.serviceTypes, type];
    setProfile({ ...profile, serviceTypes: updated });
  };

  const updateField = (field: keyof ProviderProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return {
    currentStep,
    profile,
    errors,
    isSaving,
    lastSaved,
    handleContinue,
    handleBack,
    handleSubmit,
    toggleServiceType,
    updateField,
  };
}
