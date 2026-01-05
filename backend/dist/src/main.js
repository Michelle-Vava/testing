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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_api_reference_1 = require("@scalar/nestjs-api-reference");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('shanda');
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
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
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        ignoreGlobalPrefix: true,
    });
    swagger_1.SwaggerModule.setup('shanda/docs', app, document);
    const yamlSpec = yaml.dump(document);
    fs.writeFileSync('./openapi.yaml', yamlSpec, 'utf8');
    console.log('📄 OpenAPI spec written to openapi.yaml');
    app.use('/scalar', (0, nestjs_api_reference_1.apiReference)({
        spec: {
            content: document,
        },
        theme: 'purple',
    }));
    const port = process.env.PORT || 4201;
    await app.listen(port);
    console.log(`🚀 Shanda API running on http://localhost:${port}/shanda`);
    console.log(`📚 API Documentation (Scalar): http://localhost:${port}/scalar`);
}
bootstrap();
//# sourceMappingURL=main.js.map