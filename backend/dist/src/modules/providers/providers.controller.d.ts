import { ProvidersService } from './providers.service';
import { ProviderStatusService } from './provider-status.service';
import { AuthenticatedRequest } from '../../shared/types/express-request.interface';
export declare class ProvidersController {
    private providersService;
    private providerStatusService;
    private readonly logger;
    constructor(providersService: ProvidersService, providerStatusService: ProviderStatusService);
    findFeatured(): Promise<{
        id: string;
        name: string;
        rating: number;
        reviewCount: number;
        isVerified: boolean;
        specialties: string[];
        city: string | null;
        state: string | null;
    }[]>;
    findAll(serviceType?: string, mobileService?: string, shopService?: string, minRating?: string, limit?: string): Promise<{
        id: string;
        name: string;
        city: string | null;
        state: string | null;
        bio: string | null;
        businessName: string | null;
        serviceTypes: string[];
        yearsInBusiness: number | null;
        shopAddress: string | null;
        shopCity: string | null;
        shopState: string | null;
        shopZipCode: string | null;
        serviceArea: string[];
        isMobileService: boolean;
        isShopService: boolean;
        certifications: string[];
        rating: import("@prisma/client/runtime/library").Decimal | null;
        isVerified: boolean;
        reviewCount: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        city: string | null;
        state: string | null;
        avatarUrl: string | null;
        bio: string | null;
        businessName: string | null;
        serviceTypes: string[];
        yearsInBusiness: number | null;
        shopAddress: string | null;
        shopCity: string | null;
        shopState: string | null;
        shopZipCode: string | null;
        serviceArea: string[];
        isMobileService: boolean;
        isShopService: boolean;
        certifications: string[];
        rating: import("@prisma/client/runtime/library").Decimal | null;
        isVerified: boolean;
        shopPhotos: string[];
        reviewCount: number;
        _count: {
            providedQuotes: number;
            providerJobs: number;
        };
    }>;
    getOnboardingStatus(req: AuthenticatedRequest): Promise<{
        status: import(".prisma/client").$Enums.ProviderStatus;
        completionPercent: number;
        checklist: {
            basicInfo: boolean;
            serviceTypes: boolean;
            location: boolean;
            serviceMethod: boolean;
            experience: boolean;
        };
        canSubmit: boolean;
    }>;
    completeOnboarding(req: AuthenticatedRequest): Promise<{
        id: string;
        providerStatus: import(".prisma/client").$Enums.ProviderStatus;
        providerStatusReason: string | null;
        providerStatusChangedAt: Date | null;
    }>;
    startOnboarding(req: AuthenticatedRequest): Promise<{
        id: string;
        providerStatus: import(".prisma/client").$Enums.ProviderStatus;
        providerStatusReason: string | null;
        providerStatusChangedAt: Date | null;
    }>;
}
