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
exports.CreateQuoteDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const add_quote_part_dto_1 = require("../../parts/dto/add-quote-part.dto");
class CreateQuoteDto {
    requestId;
    amount;
    laborCost;
    partsCost;
    estimatedDuration;
    description;
    includesWarranty;
    parts;
    static _OPENAPI_METADATA_FACTORY() {
        return { requestId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => String, pattern: "/^\\d+(\\.\\d{1,2})?$/" }, laborCost: { required: false, type: () => String, pattern: "/^\\d+(\\.\\d{1,2})?$/" }, partsCost: { required: false, type: () => String, pattern: "/^\\d+(\\.\\d{1,2})?$/" }, estimatedDuration: { required: true, type: () => String }, description: { required: false, type: () => String }, includesWarranty: { required: false, type: () => Boolean }, parts: { required: false, type: () => [require("../../parts/dto/add-quote-part.dto").AddQuotePartDto] } };
    }
}
exports.CreateQuoteDto = CreateQuoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID of the service request', format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total quote amount', example: '150.00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a positive number with up to 2 decimal places' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Labor cost portion', example: '100.00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d+(\.\d{1,2})?$/, { message: 'Labor cost must be a positive number with up to 2 decimal places' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "laborCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parts cost portion', example: '50.00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d+(\.\d{1,2})?$/, { message: 'Parts cost must be a positive number with up to 2 decimal places' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "partsCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated time to complete', example: '2 hours' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "estimatedDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed quote description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether warranty is included', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateQuoteDto.prototype, "includesWarranty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parts included in the quote', type: [add_quote_part_dto_1.AddQuotePartDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => add_quote_part_dto_1.AddQuotePartDto),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "parts", void 0);
//# sourceMappingURL=create-quote.dto.js.map