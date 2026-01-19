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
exports.VehiclesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const file_validation_pipe_1 = require("../../shared/pipes/file-validation.pipe");
const vehicles_service_1 = require("./vehicles.service");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("./dto/update-vehicle.dto");
const update_mileage_dto_1 = require("./dto/update-mileage.dto");
const vehicle_response_dto_1 = require("./dto/vehicle-response.dto");
const pagination_dto_1 = require("../../shared/dto/pagination.dto");
const upload_service_1 = require("../../shared/services/upload.service");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const user_role_enum_1 = require("../../shared/enums/user-role.enum");
let VehiclesController = class VehiclesController {
    vehiclesService;
    uploadService;
    constructor(vehiclesService, uploadService) {
        this.vehiclesService = vehiclesService;
        this.uploadService = uploadService;
    }
    async findAll(req, paginationDto) {
        return this.vehiclesService.findAll(req.user.id, paginationDto);
    }
    async create(req, vehicleData) {
        return this.vehiclesService.create(req.user.id, vehicleData);
    }
    async findOne(req, id) {
        return this.vehiclesService.findOne(id, req.user.id);
    }
    async update(req, id, vehicleData) {
        return this.vehiclesService.update(id, req.user.id, vehicleData);
    }
    async updateMileage(req, id, mileageData) {
        return this.vehiclesService.updateMileage(id, req.user.id, mileageData.mileage);
    }
    async delete(req, id) {
        return this.vehiclesService.delete(id, req.user.id);
    }
    async uploadImages(req, id, files) {
        await this.vehiclesService.findOne(id, req.user.id);
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No images provided');
        }
        const imageUrls = await this.uploadService.uploadImages(files, 'shanda/vehicles');
        return this.vehiclesService.addImages(id, imageUrls);
    }
    async deleteImage(req, id, imageUrl) {
        await this.vehiclesService.findOne(id, req.user.id);
        await this.uploadService.deleteImage(imageUrl);
        return this.vehiclesService.removeImage(id, imageUrl);
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vehicles for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of vehicles',
        type: [vehicle_response_dto_1.VehicleResponseDto]
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vehicle created successfully', type: vehicle_response_dto_1.VehicleResponseDto }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific vehicle by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle details', type: vehicle_response_dto_1.VehicleResponseDto }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle updated successfully', type: vehicle_response_dto_1.VehicleResponseDto }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_vehicle_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/mileage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle mileage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mileage updated successfully', type: vehicle_response_dto_1.VehicleResponseDto }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_mileage_dto_1.UpdateMileageDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "updateMileage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a vehicle' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload images for a vehicle' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10)),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images uploaded successfully', type: vehicle_response_dto_1.VehicleResponseDto }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)(new file_validation_pipe_1.FileValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Delete)(':id/images'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an image from a vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully', type: vehicle_response_dto_1.VehicleResponseDto }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('imageUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "deleteImage", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, swagger_1.ApiTags)('vehicles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('vehicles'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService,
        upload_service_1.UploadService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map