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
exports.VehicleResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class VehicleResponseDto {
    id;
    ownerId;
    make;
    model;
    year;
    vin;
    licensePlate;
    mileage;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, ownerId: { required: true, type: () => String }, make: { required: true, type: () => String }, model: { required: true, type: () => String }, year: { required: true, type: () => Number }, vin: { required: true, type: () => String }, licensePlate: { required: true, type: () => String, nullable: true }, mileage: { required: true, type: () => Number, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.VehicleResponseDto = VehicleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], VehicleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    __metadata("design:type", String)
], VehicleResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Toyota' }),
    __metadata("design:type", String)
], VehicleResponseDto.prototype, "make", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Camry' }),
    __metadata("design:type", String)
], VehicleResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2022 }),
    __metadata("design:type", Number)
], VehicleResponseDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1HGBH41JXMN109186' }),
    __metadata("design:type", String)
], VehicleResponseDto.prototype, "vin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC123', required: false, nullable: true }),
    __metadata("design:type", Object)
], VehicleResponseDto.prototype, "licensePlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45000, required: false, nullable: true }),
    __metadata("design:type", Object)
], VehicleResponseDto.prototype, "mileage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], VehicleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], VehicleResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=vehicle-response.dto.js.map