import { Exclude, Expose, Transform } from 'class-transformer';
import { ProviderStatus } from '@prisma/client';

@Expose()
export class UserEntity {
  id!: string;
  email!: string;
  name!: string;
  phone?: string | null;
  roles!: string[];

  onboardingComplete!: boolean;
  providerOnboardingComplete!: boolean;
  providerStatus?: ProviderStatus;
  stripeAccountId?: string | null;

  avatarUrl?: string | null;
  bio?: string | null;
  
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  businessName?: string | null;
  serviceTypes!: string[];
  yearsInBusiness?: number | null;
  shopAddress?: string | null;
  shopCity?: string | null;
  shopState?: string | null;
  shopZipCode?: string | null;
  serviceArea?: string[];
  isMobileService!: boolean;
  isShopService!: boolean;
  shopPhotos!: string[];
  @Transform(({ value }) => value ? Number(value) : null)
  rating?: number | null;
  reviewCount!: number;
  createdAt!: Date;
  updatedAt!: Date;

  @Exclude()
  password!: string;

  constructor(partial: Partial<UserEntity> | any) {
    if (!partial) return;

    // Core User fields
    this.id = partial.id;
    this.email = partial.email;
    this.name = partial.name;
    this.phone = partial.phone;
    this.roles = partial.roles || [];
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;

    // Owner Profile Flattening
    const owner = partial.ownerProfile;
    if (owner) {
      this.onboardingComplete = owner.onboardingComplete;
      this.address = owner.address;
      this.city = owner.city;
      this.state = owner.state;
      this.zipCode = owner.zipCode;
      this.avatarUrl = owner.avatarUrl;
      this.bio = owner.bio;
    } else {
      // Logic: If no profile exists, defaults are null/false
      this.onboardingComplete = false;
    }

    // Provider Profile Flattening
    const provider = partial.providerProfile;
    if (provider) {
      this.providerOnboardingComplete = provider.onboardingComplete;
      this.providerStatus = provider.status;
      this.stripeAccountId = provider.stripeAccountId;
      this.businessName = provider.businessName;
      this.serviceTypes = provider.serviceTypes || [];
      this.yearsInBusiness = provider.yearsInBusiness;
      this.shopAddress = provider.shopAddress;
      this.shopCity = provider.shopCity;
      this.shopState = provider.shopState;
      this.shopZipCode = provider.shopZipCode;
      this.serviceArea = provider.serviceArea || [];
      this.isMobileService = provider.isMobileService || false;
      this.isShopService = provider.isShopService || false;
      this.shopPhotos = provider.shopPhotos || [];
      this.reviewCount = provider.reviewCount || 0;
      this.rating = provider.rating;
    } else {
      this.providerOnboardingComplete = false;
      this.serviceTypes = [];
      this.serviceArea = [];
      this.shopPhotos = [];
    }
    
    // Handle Decimal to number conversion for rating if needed
    if (this.rating && typeof this.rating === 'object' && 'toNumber' in (this.rating as any)) {
      this.rating = (this.rating as any).toNumber();
    }
  }
}
