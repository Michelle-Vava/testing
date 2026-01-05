export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  requestId: string;
  ownerId: string;
  providerId: string;
  quoteId: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  
  // Relations
  request: {
    id: string;
    title: string;
    description: string;
    urgency: string;
    status: string;
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: number;
      licensePlate?: string;
      color?: string;
      vin?: string;
    };
    owner?: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  quote: {
    id: string;
    amount: number;
    estimatedDuration: string;
    description: string;
    includesWarranty: boolean;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

