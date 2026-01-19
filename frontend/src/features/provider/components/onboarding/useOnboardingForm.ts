import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useOnboardingStore } from '@/lib/store';
import { validatePostalCode, validatePhoneNumber } from '../../utils/validation';
import type { OnboardingStep, ProviderProfile, FieldError } from './types';

export function useOnboardingForm() {
  const navigate = useNavigate();
  const { updateProfile, refreshUser } = useAuth();
  const { draft, saveDraft, clearDraft } = useOnboardingStore();
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

  // Autosave draft using Zustand
  useEffect(() => {
    // Prevent autosaving empty state on initial mount
    const isDefaultState = !profile.businessName && !profile.address && profile.serviceTypes.length === 0;
    if (isDefaultState) return;

    const timeoutId = setTimeout(() => {
      saveDraft({
        businessName: profile.businessName,
        city: profile.city,
        province: profile.province,
        serviceTypes: profile.serviceTypes,
        serviceRadius: profile.serviceRadius,
      });
      setLastSaved(new Date());
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [profile, saveDraft]);

  // Load draft on mount from Zustand store
  useEffect(() => {
    if (draft) {
      setProfile(prev => ({
        ...prev,
        businessName: draft.businessName || '',
        city: draft.city || '',
        province: draft.province || '',
        serviceTypes: draft.serviceTypes || [],
        serviceRadius: draft.serviceRadius || 25,
      }));
    }
  }, []);

  // Phase 1: Simplified validation - only check essential fields
  const validateBusinessInfo = (): boolean => {
    const newErrors: FieldError = {};

    if (!profile.businessName || profile.businessName.length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    if (!profile.city) {
      newErrors.city = 'City is required';
    }

    if (!profile.province) {
      newErrors.province = 'Province is required';
    }

    if (profile.serviceTypes.length === 0) {
      newErrors.serviceTypes = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateServices = (skipValidation = false): boolean => {
    if (skipValidation) return true;

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

  // Phase 1: Remove multi-step validation - single step only
  const handleContinue = () => {
    // Phase 1: Direct submission, no multi-step
    handleSubmit();
  };

  const handleSkipServices = () => {
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep === 'services') {
      setCurrentStep('business');
    } else if (currentStep === 'review') {
      setCurrentStep('services');
    }
  };

  const handleSubmit = async () => {
    // Phase 1: Validate before submission
    if (!validateBusinessInfo()) {
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSaving(true);
    
    try {
      // Phase 1: Minimal required fields
      await updateProfile({
        businessName: profile.businessName,
        city: profile.city,
        state: profile.province,
        shopCity: profile.city,
        shopState: profile.province,
        serviceTypes: profile.serviceTypes,
        // Optional fields
        ...(profile.serviceRadius && { serviceRadius: profile.serviceRadius }),
        onboardingComplete: true,
      });

      clearDraft();
      await refreshUser();
      navigate({ to: '/provider/dashboard' });
    } catch (error: any) {
      setErrors({ 
        ...errors, 
        submit: error.message || 'Failed to complete setup. Please try again.' 
      });
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
    handleSkipServices,
    handleBack,
    handleSubmit,
    toggleServiceType,
    updateField,
  };
}
