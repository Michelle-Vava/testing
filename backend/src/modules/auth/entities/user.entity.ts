import { Exclude, Expose, Transform } from 'class-transformer';

@Expose()
export class UserEntity {
  id!: string;
  email!: string;
  name!: string;
  phone?: string | null;
  roles!: string[];

  providerIsActive?: boolean;
  avatarUrl?: string | null;
  
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
  hourlyRate?: number | null;
  website?: string | null;
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
    this.avatarUrl = partial.avatarUrl;
    this.address = partial.address;
    this.city = partial.city;
    this.state = partial.state;
    this.zipCode = partial.zipCode;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;

    // Provider Profile Flattening
    const provider = partial.providerProfile;
    if (provider) {
      this.providerIsActive = provider.isActive || false;
      this.businessName = provider.businessName;
      this.serviceTypes = provider.serviceTypes || [];
      this.yearsInBusiness = provider.yearsInBusiness;
      this.shopAddress = provider.shopAddress;
      this.shopCity = provider.shopCity;
      this.shopState = provider.shopState;
      this.shopZipCode = provider.shopZipCode;
      this.serviceArea = provider.serviceArea || [];
      this.hourlyRate = provider.hourlyRate ? Number(provider.hourlyRate) : null;
      this.website = provider.website;
    } else {
      this.providerIsActive = false;
      this.serviceTypes = [];
      this.serviceArea = [];
    }
  }
}
