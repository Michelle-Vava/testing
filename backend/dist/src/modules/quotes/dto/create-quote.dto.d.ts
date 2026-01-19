import { AddQuotePartDto } from '../../parts/dto/add-quote-part.dto';
export declare class CreateQuoteDto {
    requestId: string;
    amount: string;
    laborCost?: string;
    partsCost?: string;
    estimatedDuration: string;
    description?: string;
    includesWarranty?: boolean;
    parts?: AddQuotePartDto[];
}
