import { IsEnum } from 'class-validator';
import { QuoteStatus } from '../../../shared/enums';

export class UpdateQuoteStatusDto {
  @IsEnum(QuoteStatus)
  status: QuoteStatus;
}
