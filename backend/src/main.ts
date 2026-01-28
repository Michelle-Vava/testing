import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { HttpLoggingInterceptor } from './shared/interceptors/http-logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  // Use Pino logger
  app.useLogger(app.get(Logger));
  
  const configService = app.get(ConfigService);

  // Request body size limits (prevent DoS attacks)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Cookie parser middleware (required for reading cookies)
  app.use(cookieParser());

  // Set global API prefix
  app.setGlobalPrefix('service-connect');

  // Security Headers with CSP configuration for Scalar
  app.use(
    helmet({
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
    }),
  );

  // Compression
  app.use(compression());

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Serialization (Exclude passwords etc)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  // Custom HTTP Logging Interceptor
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS for frontend
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Service Connect Automotive API')
    .setDescription('Marketplace connecting vehicle owners with service providers')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:4201', 'Local Development')
    .addServer('https://api.serviceconnect.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger JSON at /service-connect/docs
  SwaggerModule.setup('service-connect/docs', app, document);

  // Write OpenAPI spec to YAML file for Orval
  const yamlSpec = yaml.dump(document);
  fs.writeFileSync('./openapi.yaml', yamlSpec, 'utf8');
  console.log('OpenAPI spec written to openapi.yaml');

  // Scalar API Documentation at /service-connect/scalar
  app.use(
    '/service-connect/scalar',
    apiReference({
      spec: {
        url: '/service-connect/docs-json',
      },
      theme: 'purple',
    })
  );

  const port = process.env.PORT || 4201;
  const logger = app.get(Logger);
  
  await app.listen(port);
  logger.log(`Service Connect API running on http://localhost:${port}/service-connect`);
  logger.log(`API Documentation (Swagger): http://localhost:${port}/service-connect/docs`);
  logger.log(`API Documentation (Scalar): http://localhost:${port}/service-connect/scalar`);
}

bootstrap();
