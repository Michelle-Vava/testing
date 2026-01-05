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
exports.PaginatedResponseDto = exports.PaginationMetaDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class PaginationMetaDto {
    total;
    page;
    limit;
    totalPages;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of items', example: 100 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number', example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page', example: 20 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages', example: 5 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
class PaginatedResponseDto {
    data;
    meta;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true }, meta: { required: true, type: () => require("./paginated-response.dto").PaginationMetaDto } };
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of items', isArray: true }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagination metadata', type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=paginated-response.dto.js.map