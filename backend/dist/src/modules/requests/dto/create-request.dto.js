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
exports.CreateRequestDto = exports.RequestUrgency = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var RequestUrgency;
(function (RequestUrgency) {
    RequestUrgency["LOW"] = "low";
    RequestUrgency["MEDIUM"] = "medium";
    RequestUrgency["HIGH"] = "high";
    RequestUrgency["URGENT"] = "urgent";
})(RequestUrgency || (exports.RequestUrgency = RequestUrgency = {}));
class CreateRequestDto {
    vehicleId;
    make;
    model;
    year;
    title;
    description;
    urgency;
    static _OPENAPI_METADATA_FACTORY() {
        return { vehicleId: { required: false, type: () => String, format: "uuid" }, make: { required: false, type: () => String }, model: { required: false, type: () => String }, year: { required: false, type: () => Number, minimum: 1900, maximum: new Date().getFullYear() + 1 }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, urgency: { required: true, enum: require("./create-request.dto").RequestUrgency } };
    }
}
exports.CreateRequestDto = CreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the vehicle (optional - can create inline)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vehicle make (required if vehicleId not provided)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "make", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vehicle model (required if vehicleId not provided)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vehicle year (required if vehicleId not provided)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(new Date().getFullYear() + 1),
    __metadata("design:type", Number)
], CreateRequestDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the request' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the issue' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RequestUrgency, description: 'Urgency level' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(RequestUrgency),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "urgency", void 0);
//# sourceMappingURL=create-request.dto.js.map