import type { ProvinceCode } from '../../utils/validation';

export type OnboardingStep = 'business' | 'services' | 'review';

export interface ProviderProfile {
  businessName: string;
  phoneNumber: string;
  address: string;
  unit: string;
  city: string;
  province: ProvinceCode | '';
  postalCode: string;
  yearsInBusiness: number;
  serviceTypes: string[];
  mobileService: boolean;
  serviceRadius: number;
}

export interface FieldError {
  [key: string]: string;
}
