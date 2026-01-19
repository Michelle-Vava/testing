import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingDraft {
  businessName: string;
  city: string;
  province: string;
  serviceTypes: string[];
  serviceRadius: number;
}

interface OnboardingState {
  draft: OnboardingDraft | null;
  saveDraft: (draft: OnboardingDraft) => void;
  clearDraft: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'provider-onboarding-draft',
    }
  )
);
