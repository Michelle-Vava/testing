import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';
export declare class ProvidersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findFeatured(): Promise<{
        id: string;
        name: string;
        specialties: string[];
        city: string;
        state: string;
    }[]>;
    findAll(filters: {
        serviceType?: string;
        limit?: number;
    }): Promise<{
        id: string;
        name: string;
        businessName: any;
        serviceTypes: any;
        shopCity: any;
        shopState: any;
        serviceRadius: any;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        businessName: any;
        phone: string | null;
        email: string;
        serviceTypes: any;
        shopCity: any;
        shopState: any;
        serviceRadius: any;
        _count: {
            providedQuotes: number;
            providerJobs: number;
        };
    }>;
    updateProfile(userId: string, data: UpdateProviderProfileDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        onboardingComplete: boolean;
        status: import(".prisma/client").$Enums.ProviderStatus;
        statusReason: string | null;
        statusChangedAt: Date | null;
        businessName: string | null;
        serviceTypes: string[];
        yearsInBusiness: number | null;
        website: string | null;
        hourlyRate: Prisma.Decimal | null;
        shopAddress: string | null;
        shopCity: string | null;
        shopState: string | null;
        shopZipCode: string | null;
        serviceArea: string[];
        serviceRadius: number | null;
        isMobileService: boolean;
        isShopService: boolean;
    }>;
}
