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
exports.JobResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class JobResponseDto {
    id;
    requestId;
    ownerId;
    ownerName;
    providerId;
    providerName;
    quoteId;
    agreedPrice;
    description;
    status;
    scheduledDate;
    completedAt;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, requestId: { required: true, type: () => String }, ownerId: { required: true, type: () => String }, ownerName: { required: true, type: () => String }, providerId: { required: true, type: () => String }, providerName: { required: true, type: () => String }, quoteId: { required: true, type: () => String }, agreedPrice: { required: true, type: () => Number }, description: { required: true, type: () => String }, status: { required: true, enum: require("../../../shared/enums/job-status.enum").JobStatus }, scheduledDate: { required: true, type: () => Date, nullable: true }, completedAt: { required: true, type: () => Date, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.JobResponseDto = JobResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174002' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "ownerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174003' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane Smith Auto Service' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174004' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "quoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.00 }),
    __metadata("design:type", Number)
], JobResponseDto.prototype, "agreedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Oil change and filter replacement' }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.JobStatus, example: enums_1.JobStatus.PENDING }),
    __metadata("design:type", String)
], JobResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Object)
], JobResponseDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Object)
], JobResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], JobResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], JobResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=job-response.dto.js.map