import { RequestStatus } from '../../../shared/enums';
export declare class RequestResponseDto {
    id: string;
    ownerId: string;
    vehicleId: string;
    serviceType: string;
    description: string;
    urgency: string;
    preferredLocation: string | null;
    preferredDate: Date | null;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
}
