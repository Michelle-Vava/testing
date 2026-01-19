import { PrismaService } from '../infrastructure/database/prisma.service';
export declare class PlatformService {
    private readonly db;
    constructor(db: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalVehicles: number;
        activeJobs: number;
        totalRevenue: number;
        jobsCompleted: number;
    }>;
    getActivity(): Promise<({
        user: {
            name: string;
            email: string;
        };
    } & {
        id: string;
        userId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        type: string;
        description: string;
    })[]>;
    getSettings(): Promise<{
        businessHours: {
            monday: {
                open: string;
                close: string;
                timezone: string;
            };
            tuesday: {
                open: string;
                close: string;
                timezone: string;
            };
            wednesday: {
                open: string;
                close: string;
                timezone: string;
            };
            thursday: {
                open: string;
                close: string;
                timezone: string;
            };
            friday: {
                open: string;
                close: string;
                timezone: string;
            };
            saturday: {
                open: string;
                close: string;
                timezone: string;
            };
            sunday: {
                open: null;
                close: null;
                closed: boolean;
            };
        };
        supportEmail: string;
        socialMedia: {
            twitter: string;
            facebook: string;
            linkedin: string;
        };
        features: {
            liveChatEnabled: boolean;
            phoneSupport: boolean;
        };
    }>;
}
