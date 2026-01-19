import { Expose, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Provider summary for quote responses
 */
export interface ProviderSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  businessName?: string | null;
  providerProfile?: {
    businessName: string | null;
    avatarUrl?: string | null;
  } | null;
}

/**
 * Input type for QuoteEntity constructor - accepts Prisma Decimal types
 */
interface QuoteEntityInput {
  id: string;
  requestId: string;
  providerId: string;
  amount: string | Decimal;
  laborCost?: string | Decimal | null;
  partsCost?: string | Decimal | null;
  estimatedDuration: string;
  description?: string | null;
  includesWarranty: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  provider?: ProviderSummary;
}

@Expose()
export class QuoteEntity {
  id!: string;
  requestId!: string;
  providerId!: string;

  @Transform(({ value }) => {
    if (value && typeof value === 'object' && 'toString' in value) {
      return value.toString();
    }
    return value;
  })
  amount!: string;

  @Transform(({ value }) => {
    if (value && typeof value === 'object' && 'toString' in value) {
      return value.toString();
    }
    return value;
  })
  laborCost?: string | null;

  @Transform(({ value }) => {
    if (value && typeof value === 'object' && 'toString' in value) {
      return value.toString();
    }
    return value;
  })
  partsCost?: string | null;

  estimatedDuration!: string;
  description?: string | null;
  includesWarranty!: boolean;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;

  provider?: ProviderSummary;

  constructor(partial: QuoteEntityInput) {
    this.id = partial.id;
    this.requestId = partial.requestId;
    this.providerId = partial.providerId;
    this.amount = partial.amount?.toString() ?? '';
    this.laborCost = partial.laborCost?.toString() ?? null;
    this.partsCost = partial.partsCost?.toString() ?? null;
    this.estimatedDuration = partial.estimatedDuration;
    this.description = partial.description ?? null;
    this.includesWarranty = partial.includesWarranty;
    this.status = partial.status;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    this.provider = partial.provider;
  }
}
