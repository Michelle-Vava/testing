export type RequestStatus = 'draft' | 'open' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export type ServiceType = 
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_service'
  | 'engine_diagnostic'
  | 'transmission_service'
  | 'battery_replacement'
  | 'air_conditioning'
  | 'general_maintenance'
  | 'other';

export interface ServiceRequest {
  id: string;
  ownerId: string;
  vehicleId: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: RequestStatus;
  preferredDate?: Date;
  locationPreference: 'mobile' | 'shop' | 'either';
  budget?: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate?: string;
    mileage?: number;
  };
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  amount: number;
  estimatedDuration: string;
  description: string;
  includesWarranty: boolean;
  validUntil: Date;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'rejected';
  provider?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    distance?: string;
  };
}
