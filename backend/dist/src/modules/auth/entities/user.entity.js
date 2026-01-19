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
    providerStatus;
    stripeAccountId;
    avatarUrl;
    bio;
    address;
    city;
    state;
    zipCode;
    businessName;
    serviceTypes;
    yearsInBusiness;
    shopAddress;
    shopCity;
    shopState;
    shopZipCode;
    serviceArea;
    isMobileService;
    isShopService;
    shopPhotos;
    rating;
    reviewCount;
    createdAt;
    updatedAt;
    password;
    constructor(partial) {
        if (!partial)
            return;
        this.id = partial.id;
        this.email = partial.email;
        this.name = partial.name;
        this.phone = partial.phone;
        this.roles = partial.roles || [];
        this.createdAt = partial.createdAt;
        this.updatedAt = partial.updatedAt;
        const owner = partial.ownerProfile;
        if (owner) {
            this.onboardingComplete = owner.onboardingComplete;
            this.address = owner.address;
            this.city = owner.city;
            this.state = owner.state;
            this.zipCode = owner.zipCode;
            this.avatarUrl = owner.avatarUrl;
            this.bio = owner.bio;
        }
        else {
            this.onboardingComplete = false;
        }
        const provider = partial.providerProfile;
        if (provider) {
            this.providerOnboardingComplete = provider.onboardingComplete;
            this.providerStatus = provider.status;
            this.stripeAccountId = provider.stripeAccountId;
            this.businessName = provider.businessName;
            this.serviceTypes = provider.serviceTypes || [];
            this.yearsInBusiness = provider.yearsInBusiness;
            this.shopAddress = provider.shopAddress;
            this.shopCity = provider.shopCity;
            this.shopState = provider.shopState;
            this.shopZipCode = provider.shopZipCode;
            this.serviceArea = provider.serviceArea || [];
            this.isMobileService = provider.isMobileService || false;
            this.isShopService = provider.isShopService || false;
            this.shopPhotos = provider.shopPhotos || [];
            this.reviewCount = provider.reviewCount || 0;
            this.rating = provider.rating;
        }
        else {
            this.providerOnboardingComplete = false;
            this.serviceTypes = [];
            this.serviceArea = [];
            this.shopPhotos = [];
        }
        if (this.rating && typeof this.rating === 'object' && 'toNumber' in this.rating) {
            this.rating = this.rating.toNumber();
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, phone: { required: false, type: () => String, nullable: true }, roles: { required: true, type: () => [String] }, onboardingComplete: { required: true, type: () => Boolean }, providerOnboardingComplete: { required: true, type: () => Boolean }, providerStatus: { required: false, type: () => Object }, stripeAccountId: { required: false, type: () => String, nullable: true }, avatarUrl: { required: false, type: () => String, nullable: true }, bio: { required: false, type: () => String, nullable: true }, address: { required: false, type: () => String, nullable: true }, city: { required: false, type: () => String, nullable: true }, state: { required: false, type: () => String, nullable: true }, zipCode: { required: false, type: () => String, nullable: true }, businessName: { required: false, type: () => String, nullable: true }, serviceTypes: { required: true, type: () => [String] }, yearsInBusiness: { required: false, type: () => Number, nullable: true }, shopAddress: { required: false, type: () => String, nullable: true }, shopCity: { required: false, type: () => String, nullable: true }, shopState: { required: false, type: () => String, nullable: true }, shopZipCode: { required: false, type: () => String, nullable: true }, serviceArea: { required: false, type: () => [String] }, isMobileService: { required: true, type: () => Boolean }, isShopService: { required: true, type: () => Boolean }, shopPhotos: { required: true, type: () => [String] }, rating: { required: false, type: () => Number, nullable: true }, reviewCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, password: { required: true, type: () => String } };
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