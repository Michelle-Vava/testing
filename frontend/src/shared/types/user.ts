export type UserRole = 'owner' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole | null;
  onboardingComplete: boolean;
  providerOnboardingComplete?: boolean;
  providerStatus?: 'NONE' | 'DRAFT' | 'PENDING' | 'ACTIVE' | 'SUSPENDED';
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
