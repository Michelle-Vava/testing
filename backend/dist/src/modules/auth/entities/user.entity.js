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
exports.UserEntity = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let UserEntity = class UserEntity {
    id;
    email;
    name;
    phone;
    roles;
    onboardingComplete;
    providerOnboardingComplete;
    address;
    city;
    state;
    zipCode;
    businessName;
    serviceTypes;
    yearsInBusiness;
    certifications;
    shopAddress;
    shopCity;
    shopState;
    shopZipCode;
    serviceArea;
    isMobileService;
    isShopService;
    isVerified;
    shopPhotos;
    rating;
    reviewCount;
    createdAt;
    updatedAt;
    password;
    constructor(partial) {
        Object.assign(this, partial);
        if (this.rating && typeof this.rating === 'object' && 'toNumber' in this.rating) {
            this.rating = this.rating.toNumber();
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, phone: { required: false, type: () => String, nullable: true }, roles: { required: true, type: () => [String] }, onboardingComplete: { required: true, type: () => Boolean }, providerOnboardingComplete: { required: true, type: () => Boolean }, address: { required: false, type: () => String, nullable: true }, city: { required: false, type: () => String, nullable: true }, state: { required: false, type: () => String, nullable: true }, zipCode: { required: false, type: () => String, nullable: true }, businessName: { required: false, type: () => String, nullable: true }, serviceTypes: { required: true, type: () => [String] }, yearsInBusiness: { required: false, type: () => Number, nullable: true }, certifications: { required: false, type: () => [String] }, shopAddress: { required: false, type: () => String, nullable: true }, shopCity: { required: false, type: () => String, nullable: true }, shopState: { required: false, type: () => String, nullable: true }, shopZipCode: { required: false, type: () => String, nullable: true }, serviceArea: { required: false, type: () => [String] }, isMobileService: { required: true, type: () => Boolean }, isShopService: { required: true, type: () => Boolean }, isVerified: { required: true, type: () => Boolean }, shopPhotos: { required: true, type: () => [String] }, rating: { required: false, type: () => Number, nullable: true }, reviewCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, password: { required: true, type: () => String } };
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value ? Number(value) : null),
    __metadata("design:type", Object)
], UserEntity.prototype, "rating", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:paramtypes", [Object])
], UserEntity);
//# sourceMappingURL=user.entity.js.map