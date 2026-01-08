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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProvidersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const providers_service_1 = require("./providers.service");
const provider_status_service_1 = require("./provider-status.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const provider_status_guard_1 = require("../../shared/guards/provider-status.guard");
const client_1 = require("@prisma/client");
let ProvidersController = ProvidersController_1 = class ProvidersController {
    providersService;
    providerStatusService;
    logger = new common_1.Logger(ProvidersController_1.name);
    constructor(providersService, providerStatusService) {
        this.providersService = providersService;
        this.providerStatusService = providerStatusService;
    }
    async findFeatured() {
        this.logger.log('Fetching featured providers for landing page');
        return this.providersService.findFeatured();
    }
    async findAll(serviceType, mobileService, shopService, minRating, limit) {
        const filters = {
            serviceType,
            mobileService: mobileService !== undefined ? mobileService === 'true' : undefined,
            shopService: shopService !== undefined ? shopService === 'true' : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        };
        return this.providersService.findAll(filters);
    }
    async findOne(id) {
        return this.providersService.findOne(id);
    }
    async getOnboardingStatus(req) {
        return this.providerStatusService.getOnboardingStatus(req.user.sub);
    }
    async completeOnboarding(req) {
        return this.providerStatusService.completeOnboarding(req.user.sub);
    }
    async startOnboarding(req) {
        return this.providerStatusService.updateStatus(req.user.sub, client_1.ProviderStatus.DRAFT, 'Started onboarding');
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Get)('public/featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured providers (no auth required)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return featured providers.' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all providers with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'serviceType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'mobileService', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'shopService', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'minRating', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('serviceType')),
    __param(1, (0, common_1.Query)('mobileService')),
    __param(2, (0, common_1.Query)('shopService')),
    __param(3, (0, common_1.Query)('minRating')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get provider by ID with full profile' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('onboarding/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get provider onboarding status and checklist' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Post)('onboarding/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, provider_status_guard_1.ProviderStatusGuard),
    (0, provider_status_guard_1.RequireProviderStatus)(client_1.ProviderStatus.DRAFT, client_1.ProviderStatus.NONE),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Complete provider onboarding' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.Put)('onboarding/start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start provider onboarding (NONE → DRAFT)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "startOnboarding", null);
exports.ProvidersController = ProvidersController = ProvidersController_1 = __decorate([
    (0, swagger_1.ApiTags)('providers'),
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService,
        provider_status_service_1.ProviderStatusService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map