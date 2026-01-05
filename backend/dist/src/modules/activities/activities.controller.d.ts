import { ActivitiesService } from './activities.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    findAll(req: AuthenticatedRequest, limit?: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
    }[]>;
}
