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
exports.PlatformController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_service_1 = require("./platform.service");
const jwt_auth_guard_1 = require("../modules/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../shared/guards/roles.guard");
const roles_decorator_1 = require("../shared/decorators/roles.decorator");
const user_role_enum_1 = require("../shared/enums/user-role.enum");
let PlatformController = class PlatformController {
    platformService;
    constructor(platformService) {
        this.platformService = platformService;
    }
    async getStats() {
        return this.platformService.getStats();
    }
    async getSettings() {
        return this.platformService.getSettings();
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform statistics (Admin only)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform settings (public)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getSettings", null);
exports.PlatformController = PlatformController = __decorate([
    (0, swagger_1.ApiTags)('platform'),
    (0, common_1.Controller)('platform'),
    __metadata("design:paramtypes", [platform_service_1.PlatformService])
], PlatformController);
//# sourceMappingURL=platform.controller.js.map