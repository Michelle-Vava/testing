import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useOnboardingStore } from '@/lib/store';
import { providerOnboardingSchema, type ProviderOnboardingFormData } from '@/lib/schemas/form-schemas';
import { useEffect } from 'react';
import { useClerkAuthControllerUpdateProfile } from '@/services/generated/auth/auth';

export function useProviderOnboarding() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { draft, saveDraft, clearDraft } = useOnboardingStore();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useClerkAuthControllerUpdateProfile();
  
  const form = useForm<ProviderOnboardingFormData>({
    resolver: zodResolver(providerOnboardingSchema),
    defaultValues: draft || {
      businessName: '',
      city: '',
      province: '',
      serviceTypes: [],
      serviceRadius: 25,
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const { watch, handleSubmit } = form;

  // Auto-save draft to Zustand store (debounced)
  useEffect(() => {
    const subscription = watch((value) => {
      const timer = setTimeout(() => {
        if (value.businessName || value.serviceTypes?.length) {
          saveDraft(value as ProviderOnboardingFormData);
        }
      }, 800);
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [watch, saveDraft]);

  const onSubmit = async (data: ProviderOnboardingFormData) => {
    try {
      await updateProfile({
        data: {
          businessName: data.businessName,
          city: data.city,
          state: data.province,
          shopCity: data.city,
          shopState: data.province,
          serviceTypes: data.serviceTypes,
          serviceArea: data.serviceRadius ? [`${data.serviceRadius}km`] : undefined,
          onboardingComplete: true,
        }
      });

      clearDraft();
      await refreshUser();
      navigate({ to: '/provider/dashboard' });
    } catch (error: any) {
      form.setError('root', { 
        message: error.message || 'Failed to complete setup. Please try again.' 
      });
    }
  };

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting: isUpdatingProfile,
    hasDraft: !!draft,
  };
}
