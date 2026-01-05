import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);

  constructor(private prisma: PrismaService) {}

  async findFeatured() {
    this.logger.debug('Finding featured providers');
    
    // Get providers with provider role and completed onboarding
    const providers = await this.prisma.user.findMany({
      where: {
        roles: {
          has: 'provider',
        },
        providerOnboardingComplete: true,
      },
      take: 4,
      select: {
        id: true,
        name: true,
        businessName: true,
        serviceTypes: true,
        yearsInBusiness: true,
        city: true,
        state: true,
        rating: true,
        reviewCount: true,
        isVerified: true,
        _count: {
          select: {
            providedQuotes: true,
            providerJobs: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Transform to match frontend expectations
    return providers.map(provider => ({
      id: provider.id,
      name: provider.businessName || provider.name,
      rating: provider.rating || 4.8,
      reviewCount: provider.reviewCount || provider._count.providedQuotes + provider._count.providerJobs,
      isVerified: provider.isVerified,
      specialties: provider.serviceTypes.slice(0, 3),
      distance: `${(Math.random() * 5 + 1).toFixed(1)} miles`, // Mock distance for now
      responseTime: '< 2 hours', // Mock response time
      city: provider.city,
      state: provider.state,
    }));
  }

  async findAll(filters: {
    serviceType?: string;
    mobileService?: boolean;
    shopService?: boolean;
    minRating?: number;
    limit?: number;
  }) {
    const where: any = {
      roles: { has: 'provider' },
      providerOnboardingComplete: true,
    };

    if (filters.serviceType) {
      where.serviceTypes = { has: filters.serviceType };
    }

    if (filters.mobileService !== undefined) {
      where.isMobileService = filters.mobileService;
    }

    if (filters.shopService !== undefined) {
      where.isShopService = filters.shopService;
    }

    if (filters.minRating) {
      where.rating = { gte: filters.minRating };
    }

    const providers = await this.prisma.user.findMany({
      where,
      take: filters.limit || 20,
      select: {
        id: true,
        name: true,
        businessName: true,
        bio: true,
        serviceTypes: true,
        yearsInBusiness: true,
        certifications: true,
        city: true,
        state: true,
        serviceArea: true,
        isMobileService: true,
        isShopService: true,
        isVerified: true,
        rating: true,
        reviewCount: true,
        shopAddress: true,
        shopCity: true,
        shopState: true,
        shopZipCode: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return providers;
  }

  async findOne(id: string) {
    const provider = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        businessName: true,
        bio: true,
        avatarUrl: true,
        phone: true,
        email: true,
        serviceTypes: true,
        yearsInBusiness: true,
        certifications: true,
        city: true,
        state: true,
        serviceArea: true,
        isMobileService: true,
        isShopService: true,
        isVerified: true,
        rating: true,
        reviewCount: true,
        shopAddress: true,
        shopCity: true,
        shopState: true,
        shopZipCode: true,
        shopPhotos: true,
        _count: {
          select: {
            providedQuotes: true,
            providerJobs: true,
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }

    return provider;
  }
}
