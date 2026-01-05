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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMaintenanceRecordDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMaintenanceRecordDto {
    serviceType;
    serviceDate;
    mileage;
    cost;
    notes;
    performedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceType: { required: true, type: () => String }, serviceDate: { required: true, type: () => String }, mileage: { required: false, type: () => Number, minimum: 1 }, cost: { required: false, type: () => Number }, notes: { required: false, type: () => String }, performedBy: { required: false, type: () => String } };
    }
}
exports.CreateMaintenanceRecordDto = CreateMaintenanceRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of service performed', example: 'Oil Change' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceRecordDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when service was performed', example: '2026-01-04' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMaintenanceRecordDto.prototype, "serviceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mileage at time of service (km)', example: 50000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMaintenanceRecordDto.prototype, "mileage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost of service', example: 89.99 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaintenanceRecordDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the service' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceRecordDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of shop or mechanic who performed service' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceRecordDto.prototype, "performedBy", void 0);
//# sourceMappingURL=create-maintenance-record.dto.js.map