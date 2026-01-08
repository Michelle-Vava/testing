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
  app.setGlobalPrefix('shanda');

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
    .setTitle('Shanda Automotive API')
    .setDescription('Marketplace connecting vehicle owners with service providers')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:4201', 'Local Development')
    .addServer('https://api.shanda.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger JSON at /shanda/docs
  SwaggerModule.setup('shanda/docs', app, document);

  // Write OpenAPI spec to YAML file for Orval
  const yamlSpec = yaml.dump(document);
  fs.writeFileSync('./openapi.yaml', yamlSpec, 'utf8');
  console.log('OpenAPI spec written to openapi.yaml');

  // Scalar API Documentation at /shanda/scalar
  app.use(
    '/shanda/scalar',
    apiReference({
      spec: {
        url: '/shanda/docs-json',
      },
      theme: 'purple',
    })
  );

  const port = process.env.PORT || 4201;
  const logger = app.get(Logger);
  
  await app.listen(port);
  logger.log(`Shanda API running on http://localhost:${port}/shanda`);
  logger.log(`API Documentation (Swagger): http://localhost:${port}/shanda/docs`);
  logger.log(`API Documentation (Scalar): http://localhost:${port}/shanda/scalar`);
}

bootstrap();
