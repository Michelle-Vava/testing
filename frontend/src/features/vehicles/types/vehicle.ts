export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate: string;
  color: string;
  mileage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceType: string;
  description: string;
  cost: number;
  serviceDate: Date;
  providerId?: string;
  providerName?: string;
  mileage: number;
  notes?: string;
}
