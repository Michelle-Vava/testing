import { ProvidersService } from './providers.service';
export declare class ProvidersController {
    private providersService;
    private readonly logger;
    constructor(providersService: ProvidersService);
    findFeatured(): Promise<{
        id: string;
        name: string;
        rating: number | import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
        isVerified: boolean;
        specialties: string[];
        distance: string;
        responseTime: string;
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
        certifications: string[];
        shopAddress: string | null;
        shopCity: string | null;
        shopState: string | null;
        shopZipCode: string | null;
        serviceArea: string[];
        isMobileService: boolean;
        isShopService: boolean;
        isVerified: boolean;
        rating: import("@prisma/client/runtime/library").Decimal | null;
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
        certifications: string[];
        shopAddress: string | null;
        shopCity: string | null;
        shopState: string | null;
        shopZipCode: string | null;
        serviceArea: string[];
        isMobileService: boolean;
        isShopService: boolean;
        isVerified: boolean;
        shopPhotos: string[];
        rating: import("@prisma/client/runtime/library").Decimal | null;
        reviewCount: number;
        _count: {
            providedQuotes: number;
            providerJobs: number;
        };
    }>;
}
