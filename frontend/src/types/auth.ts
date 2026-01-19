import type { User } from './user';

// Auth response types from backend
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'provider';
}

export interface UpdateProfileDto {
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessName?: string;
  serviceTypes?: string[];
  onboardingComplete?: boolean;
  shopCity?: string;
  shopState?: string;
  serviceRadius?: number;
}

export interface OAuthCallbackDto {
  supabaseToken: string;
}
