import { JobStatus } from '../../../shared/enums';
export declare class JobResponseDto {
    id: string;
    requestId: string;
    ownerId: string;
    ownerName: string;
    providerId: string;
    providerName: string;
    quoteId: string;
    agreedPrice: number;
    description: string;
    status: JobStatus;
    scheduledDate: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
