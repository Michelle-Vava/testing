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
exports.MaintenanceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const maintenance_service_1 = require("./maintenance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_maintenance_record_dto_1 = require("./dto/create-maintenance-record.dto");
let MaintenanceController = class MaintenanceController {
    maintenanceService;
    constructor(maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    async findAll(req, vehicleId) {
        return this.maintenanceService.findAllForVehicle(vehicleId, req.user.sub);
    }
    async create(req, vehicleId, data) {
        return this.maintenanceService.create(vehicleId, req.user.sub, data);
    }
    async delete(req, id) {
        return this.maintenanceService.delete(id, req.user.sub);
    }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.Get)('vehicles/:vehicleId/maintenance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get maintenance history for a vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of maintenance records' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('vehicles/:vehicleId/maintenance'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a maintenance record to a vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Maintenance record created successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_maintenance_record_dto_1.CreateMaintenanceRecordDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('maintenance/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a maintenance record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Maintenance record deleted successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "delete", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, swagger_1.ApiTags)('maintenance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map