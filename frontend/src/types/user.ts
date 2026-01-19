import { UserRole, ProviderStatus } from './enums';

export { UserRole, ProviderStatus };

export interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[]; // Array of role strings from backend - SOURCE OF TRUTH
  onboardingComplete: boolean;
  providerOnboardingComplete?: boolean;
  providerStatus?: ProviderStatus;
  stripeAccountId?: string;
  createdAt: Date;
  // Optional profile fields populated from OwnerProfile/ProviderProfile
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  avatarUrl?: string;
  phone?: string; // Alias for phoneNumber if needed
}

export interface OwnerProfile {
  userId: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ProviderProfile {
  userId: string;
  businessName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceTypes: string[];
  yearsInBusiness: number;
}
