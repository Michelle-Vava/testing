import { PlatformService } from './platform.service';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    getStats(): Promise<{
        customers: number;
        providers: number;
        jobsCompleted: number;
        averageSavings: number;
    }>;
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
