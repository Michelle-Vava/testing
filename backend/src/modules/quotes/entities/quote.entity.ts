import { Expose, Transform } from 'class-transformer';

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

  estimatedDuration!: string;
  description?: string | null;
  includesWarranty!: boolean;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;

  provider?: any;

  constructor(partial: Partial<QuoteEntity> | any) {
    Object.assign(this, partial);
  }
}
