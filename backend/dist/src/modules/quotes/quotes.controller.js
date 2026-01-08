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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quotes_service_1 = require("./quotes.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const provider_status_guard_1 = require("../../shared/guards/provider-status.guard");
const create_quote_dto_1 = require("./dto/create-quote.dto");
const client_1 = require("@prisma/client");
let QuotesController = class QuotesController {
    quotesService;
    constructor(quotesService) {
        this.quotesService = quotesService;
    }
    async findByRequest(req, requestId) {
        return this.quotesService.findByRequest(requestId, req.user.sub, req.user.roles);
    }
    async create(req, quoteData) {
        return this.quotesService.create(req.user.sub, req.user.roles, quoteData);
    }
    async accept(req, id) {
        return this.quotesService.accept(id, req.user.sub);
    }
    async reject(req, id) {
        return this.quotesService.reject(id, req.user.sub);
    }
};
exports.QuotesController = QuotesController;
__decorate([
    (0, common_1.Get)('request/:requestId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all quotes for a service request' }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/quote.entity").QuoteEntity] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "findByRequest", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(provider_status_guard_1.ProviderStatusGuard),
    (0, provider_status_guard_1.RequireProviderStatus)(client_1.ProviderStatus.ACTIVE),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new quote (active providers only)' }),
    openapi.ApiResponse({ status: 201, type: require("./entities/quote.entity").QuoteEntity }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_quote_dto_1.CreateQuoteDto]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a quote (creates a job)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a quote' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "reject", null);
exports.QuotesController = QuotesController = __decorate([
    (0, swagger_1.ApiTags)('quotes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('quotes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService])
], QuotesController);
//# sourceMappingURL=quotes.controller.js.map