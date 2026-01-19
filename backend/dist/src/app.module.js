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
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const node_crypto_1 = require("node:crypto");
const database_module_1 = require("./infrastructure/database/database.module");
const shared_module_1 = require("./shared/shared.module");
const logger_user_interceptor_1 = require("./shared/interceptors/logger-user.interceptor");
const clerk_auth_module_1 = require("./modules/auth/clerk/clerk-auth.module");
const vehicles_module_1 = require("./modules/vehicles/vehicles.module");
const requests_module_1 = require("./modules/requests/requests.module");
const quotes_module_1 = require("./modules/quotes/quotes.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const providers_module_1 = require("./modules/providers/providers.module");
const services_module_1 = require("./modules/services/services.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const activities_module_1 = require("./modules/activities/activities.module");
const maintenance_module_1 = require("./modules/maintenance/maintenance.module");
const messages_module_1 = require("./modules/messages/messages.module");
const parts_module_1 = require("./modules/parts/parts.module");
const health_module_1 = require("./health/health.module");
const platform_module_1 = require("./platform/platform.module");
const env_validation_1 = require("./config/env.validation");
let AppModule = class AppModule {
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
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    genReqId: (req, res) => {
                        const existingID = req.id ?? req.headers['x-request-id'];
                        if (existingID)
                            return existingID;
                        const id = (0, node_crypto_1.randomUUID)();
                        res.setHeader('X-Request-Id', id);
                        return id;
                    },
                    transport: process.env.NODE_ENV !== 'production' ? {
                        target: 'pino-pretty',
                        options: {
                            colorize: true,
                            translateTime: 'SYS:HH:MM:ss',
                            ignore: 'pid,hostname,req,res',
                            singleLine: false,
                            messageFormat: '{context} - {msg}',
                        },
                    } : undefined,
                    level: process.env.LOG_LEVEL || 'info',
                    autoLogging: false,
                    serializers: {
                        req: (req) => ({
                            id: req.id,
                            method: req.method,
                            url: req.url,
                            headers: {
                                host: req.headers.host,
                                'user-agent': req.headers['user-agent'],
                                'content-type': req.headers['content-type'],
                            },
                            remoteAddress: req.remoteAddress,
                            remotePort: req.remotePort,
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                            headers: {
                                'content-type': res.headers['content-type'],
                                'x-request-id': res.headers['x-request-id'],
                            },
                        }),
                    },
                    customLogLevel: (req, res, err) => {
                        if (res.statusCode >= 500 || err) {
                            return 'error';
                        }
                        return 'info';
                    },
                },
            }),
            database_module_1.DatabaseModule,
            shared_module_1.SharedModule,
            clerk_auth_module_1.ClerkAuthModule,
            vehicles_module_1.VehiclesModule,
            requests_module_1.RequestsModule,
            quotes_module_1.QuotesModule,
            jobs_module_1.JobsModule,
            providers_module_1.ProvidersModule,
            services_module_1.ServicesModule,
            notifications_module_1.NotificationsModule,
            activities_module_1.ActivitiesModule,
            maintenance_module_1.MaintenanceModule,
            messages_module_1.MessagesModule,
            parts_module_1.PartsModule,
            health_module_1.HealthModule,
            platform_module_1.PlatformModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logger_user_interceptor_1.LoggerUserInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map