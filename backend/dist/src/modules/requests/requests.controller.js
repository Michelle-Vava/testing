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
var RequestsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const requests_service_1 = require("./requests.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_request_dto_1 = require("./dto/create-request.dto");
const update_request_dto_1 = require("./dto/update-request.dto");
const request_response_dto_1 = require("./dto/request-response.dto");
const pagination_dto_1 = require("../../shared/dto/pagination.dto");
let RequestsController = RequestsController_1 = class RequestsController {
    requestsService;
    logger = new common_1.Logger(RequestsController_1.name);
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    async findPublicRecent() {
        this.logger.log('Fetching recent public requests for landing page');
        return this.requestsService.findPublicRecent();
    }
    async findAll(req, paginationDto) {
        this.logger.log(`User ${req.user.sub} fetching all requests`);
        return this.requestsService.findAll(req.user.sub, req.user.roles, paginationDto);
    }
    async create(req, requestData) {
        this.logger.log(`User ${req.user.sub} creating request`);
        return this.requestsService.create(req.user.sub, requestData);
    }
    async findOne(req, id) {
        this.logger.log(`User ${req.user.sub} fetching request ${id}`);
        return this.requestsService.findOne(id, req.user.sub, req.user.roles);
    }
    async update(req, id, updateData) {
        this.logger.log(`User ${req.user.sub} updating request ${id}`);
        return this.requestsService.update(id, req.user.sub, updateData);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Get)('public/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent public service requests (no auth required)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return recent public requests.' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findPublicRecent", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all service requests (owners see theirs, providers see all open)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of service requests',
        type: [request_response_dto_1.RequestResponseDto]
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new service request' }),
    (0, swagger_1.ApiBody)({ type: create_request_dto_1.CreateRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Service request created successfully', type: request_response_dto_1.RequestResponseDto }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific service request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service request details', type: request_response_dto_1.RequestResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a service request' }),
    (0, swagger_1.ApiBody)({ type: update_request_dto_1.UpdateRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service request updated successfully', type: request_response_dto_1.RequestResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Request not found.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_request_dto_1.UpdateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "update", null);
exports.RequestsController = RequestsController = RequestsController_1 = __decorate([
    (0, swagger_1.ApiTags)('requests'),
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map