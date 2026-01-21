import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);

  constructor(private prisma: PrismaService) {}

  async findFeatured() {
    this.logger.debug('Finding featured providers');
    
    // Optimized query: single database call with minimal fields
    const providers = await this.prisma.user.findMany({
      where: {
        roles: { has: 'provider' },
        providerProfile: {
          isActive: true,
        },
      },
      take: 4,
      select: {
        id: true,
        name: true,
        providerProfile: {
          select: {
            businessName: true,
            serviceTypes: true,
            shopCity: true,
            shopState: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Lean transformation - no additional queries
    return providers.map(provider => ({
      id: provider.id,
      name: provider.providerProfile?.businessName || provider.name,
      specialties: provider.providerProfile?.serviceTypes?.slice(0, 3) || [],
      city: provider.providerProfile?.shopCity || '',
      state: provider.providerProfile?.shopState || '',
    }));
  }

  async findAll(filters: {
    serviceType?: string;
    limit?: number;
  }) {
    const providerProfileFilter: Prisma.ProviderProfileWhereInput = {
      isActive: true,
    };

    if (filters.serviceType) {
      providerProfileFilter.serviceTypes = { has: filters.serviceType };
    }

    const where: Prisma.UserWhereInput = {
      roles: { has: 'provider' },
      providerProfile: providerProfileFilter,
    };

    const providers = await this.prisma.user.findMany({
      where,
      take: filters.limit || 20,
      include: {
        providerProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return providers.map(p => {
      const pp = p.providerProfile || {} as any;
      
      return {
        id: p.id,
        name: p.name,
        businessName: pp.businessName,
        serviceTypes: pp.serviceTypes,
        shopCity: pp.shopCity,
        shopState: pp.shopState,
        serviceRadius: pp.serviceRadius,
      };
    });
  }

  async findOne(id: string) {
    const provider = await this.prisma.user.findUnique({
      where: { id },
      include: {
        providerProfile: true,
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
    
    const pp = provider.providerProfile || {} as any;

    return {
      id: provider.id,
      name: provider.name,
      businessName: pp.businessName,
      phone: provider.phone,
      email: provider.email,
      serviceTypes: pp.serviceTypes,
      shopCity: pp.shopCity,
      shopState: pp.shopState,
      serviceRadius: pp.serviceRadius,
      _count: provider._count,
    };
  }

  async updateProfile(userId: string, data: UpdateProviderProfileDto) {
    this.logger.log(`Updating provider profile for user ${userId}`);
    
    // Check if user has provider role? Assumed checked by controller/guard.

    return this.prisma.providerProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }
}
