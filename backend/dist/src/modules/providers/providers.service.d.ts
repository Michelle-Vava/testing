import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ProvidersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
    findAll(filters: {
        serviceType?: string;
        mobileService?: boolean;
        shopService?: boolean;
        minRating?: number;
        limit?: number;
    }): Promise<{
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
}
