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
const client_1 = require("@prisma/client");
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
                roles: { has: 'provider' },
                providerProfile: {
                    status: client_1.ProviderStatus.ACTIVE,
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
                        serviceRadius: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return providers.map(provider => ({
            id: provider.id,
            name: provider.providerProfile?.businessName || provider.name,
            specialties: provider.providerProfile?.serviceTypes?.slice(0, 3) || [],
            city: provider.providerProfile?.shopCity || '',
            state: provider.providerProfile?.shopState || '',
        }));
    }
    async findAll(filters) {
        const providerProfileFilter = {
            status: client_1.ProviderStatus.ACTIVE,
        };
        if (filters.serviceType) {
            providerProfileFilter.serviceTypes = { has: filters.serviceType };
        }
        const where = {
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
            const pp = p.providerProfile || {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Provider with ID ${id} not found`);
        }
        const pp = provider.providerProfile || {};
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
    async updateProfile(userId, data) {
        this.logger.log(`Updating provider profile for user ${userId}`);
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
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = ProvidersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map