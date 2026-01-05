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
let ProvidersController = ProvidersController_1 = class ProvidersController {
    providersService;
    logger = new common_1.Logger(ProvidersController_1.name);
    constructor(providersService) {
        this.providersService = providersService;
    }
    async findFeatured() {
        this.logger.log('Fetching featured providers for landing page');
        return this.providersService.findFeatured();
    }
    async findAll(serviceType, mobileService, shopService, minRating, limit) {
        const filters = {
            serviceType,
            mobileService: mobileService === 'true',
            shopService: shopService === 'true',
            minRating: minRating ? parseFloat(minRating) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        };
        return this.providersService.findAll(filters);
    }
    async findOne(id) {
        return this.providersService.findOne(id);
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
exports.ProvidersController = ProvidersController = ProvidersController_1 = __decorate([
    (0, swagger_1.ApiTags)('providers'),
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map