"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProvidersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let ProvidersService = ProvidersService_1 = class ProvidersService {
    prisma;
    logger = new common_1.Logger(ProvidersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findFeatured() {
        this.logger.debug('Finding featured providers');
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
        return providers.map(provider => ({
            id: provider.id,
            name: provider.businessName || provider.name,
            rating: provider.rating || 4.8,
            reviewCount: provider.reviewCount || provider._count.providedQuotes + provider._count.providerJobs,
            isVerified: provider.isVerified,
            specialties: provider.serviceTypes.slice(0, 3),
            distance: `${(Math.random() * 5 + 1).toFixed(1)} miles`,
            responseTime: '< 2 hours',
            city: provider.city,
            state: provider.state,
        }));
    }
    async findAll(filters) {
        const where = {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Provider with ID ${id} not found`);
        }
        return provider;
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = ProvidersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map