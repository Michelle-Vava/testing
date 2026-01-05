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
exports.RequestResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class RequestResponseDto {
    id;
    ownerId;
    vehicleId;
    serviceType;
    description;
    urgency;
    preferredLocation;
    preferredDate;
    status;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, ownerId: { required: true, type: () => String }, vehicleId: { required: true, type: () => String }, serviceType: { required: true, type: () => String }, description: { required: true, type: () => String }, urgency: { required: true, type: () => String }, preferredLocation: { required: true, type: () => String, nullable: true }, preferredDate: { required: true, type: () => Date, nullable: true }, status: { required: true, enum: require("../../../shared/enums/request-status.enum").RequestStatus }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.RequestResponseDto = RequestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174002' }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'oil_change' }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Need oil change and filter replacement' }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'urgent'], example: 'medium' }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main St, City, State 12345', required: false, nullable: true }),
    __metadata("design:type", Object)
], RequestResponseDto.prototype, "preferredLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Object)
], RequestResponseDto.prototype, "preferredDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.RequestStatus, example: enums_1.RequestStatus.OPEN }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RequestResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RequestResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=request-response.dto.js.map