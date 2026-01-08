"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_logging_interceptor_1 = require("./shared/interceptors/http-logging.interceptor");
const swagger_1 = require("@nestjs/swagger");
const nestjs_api_reference_1 = require("@scalar/nestjs-api-reference");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express = __importStar(require("express"));
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    const configService = app.get(config_1.ConfigService);
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('shanda');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "https://cdn.jsdelivr.net",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net",
                ],
                imgSrc: ["'self'", "data:", "https:"],
                fontSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
                connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
            },
        },
    }));
    app.use((0, compression_1.default)());
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.useGlobalInterceptors(new http_logging_interceptor_1.HttpLoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || 'http://localhost:5173',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Shanda Automotive API')
        .setDescription('Marketplace connecting vehicle owners with service providers')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('http://localhost:4201', 'Local Development')
        .addServer('https://api.shanda.com', 'Production')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('shanda/docs', app, document);
    const yamlSpec = yaml.dump(document);
    fs.writeFileSync('./openapi.yaml', yamlSpec, 'utf8');
    console.log('OpenAPI spec written to openapi.yaml');
    app.use('/shanda/scalar', (0, nestjs_api_reference_1.apiReference)({
        spec: {
            url: '/shanda/docs-json',
        },
        theme: 'purple',
    }));
    const port = process.env.PORT || 4201;
    const logger = app.get(nestjs_pino_1.Logger);
    await app.listen(port);
    logger.log(`Shanda API running on http://localhost:${port}/shanda`);
    logger.log(`API Documentation (Swagger): http://localhost:${port}/shanda/docs`);
    logger.log(`API Documentation (Scalar): http://localhost:${port}/shanda/scalar`);
}
bootstrap();
//# sourceMappingURL=main.js.map