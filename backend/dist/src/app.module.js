"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_module_1 = require("./infrastructure/database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const vehicles_module_1 = require("./modules/vehicles/vehicles.module");
const requests_module_1 = require("./modules/requests/requests.module");
const quotes_module_1 = require("./modules/quotes/quotes.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const payments_module_1 = require("./modules/payments/payments.module");
const providers_module_1 = require("./modules/providers/providers.module");
const services_module_1 = require("./modules/services/services.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const activities_module_1 = require("./modules/activities/activities.module");
const maintenance_module_1 = require("./modules/maintenance/maintenance.module");
const health_module_1 = require("./health/health.module");
const platform_module_1 = require("./platform/platform.module");
const logger_middleware_1 = require("./shared/middleware/logger.middleware");
const env_validation_1 = require("./config/env.validation");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: env_validation_1.envValidationSchema,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            vehicles_module_1.VehiclesModule,
            requests_module_1.RequestsModule,
            quotes_module_1.QuotesModule,
            jobs_module_1.JobsModule,
            payments_module_1.PaymentsModule,
            providers_module_1.ProvidersModule,
            services_module_1.ServicesModule,
            notifications_module_1.NotificationsModule,
            activities_module_1.ActivitiesModule,
            maintenance_module_1.MaintenanceModule,
            health_module_1.HealthModule,
            platform_module_1.PlatformModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map