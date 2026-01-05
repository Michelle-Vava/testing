import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import * as express from 'express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Request body size limits (prevent DoS attacks)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Set global API prefix
  app.setGlobalPrefix('shanda');

  // Security Headers
 // app.use(helmet());

  // Compression
 // app.use(compression());

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Serialization (Exclude passwords etc)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });

  // Serve Swagger JSON at /shanda/docs-json
  SwaggerModule.setup('shanda/docs', app, document);

  // Write OpenAPI spec to YAML file for Orval
  const yamlSpec = yaml.dump(document);
  fs.writeFileSync('./openapi.yaml', yamlSpec, 'utf8');
  console.log('📄 OpenAPI spec written to openapi.yaml');

  // Scalar API Documentation at /scalar
  app.use(
    '/scalar',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
    })
  );

  const port = process.env.PORT || 4201;
  await app.listen(port);
  console.log(`🚀 Shanda API running on http://localhost:${port}/shanda`);
  console.log(`📚 API Documentation (Scalar): http://localhost:${port}/scalar`);
}

bootstrap();
