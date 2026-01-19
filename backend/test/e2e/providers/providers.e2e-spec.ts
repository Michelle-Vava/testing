import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';

jest.setTimeout(30000);

describe('Providers & Profile Management (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let providerToken: string;
  let providerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('shanda');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Create a provider user
    const email = `provider-profile-${Date.now()}@e2etest.com`;
    // Random 10-digit phone number
    const phone = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const res = await request(app.getHttpServer())
      .post('/shanda/auth/signup')
      .send({
        email,
        password: 'SecurePass123!',
        name: 'New Provider',
        phone,
        roles: ['provider'],
      })
      .expect(201);

    providerToken = res.body.accessToken;
    providerId = res.body.user.id;

    // Set up provider profile for search tests
    await prismaService.providerProfile.upsert({
      where: { userId: providerId },
      create: {
        userId: providerId,
        businessName: 'Test Provider Search',
        serviceTypes: ['oil_change', 'brakes'],
        status: 'ACTIVE',
      },
      update: {
        status: 'ACTIVE',
        serviceTypes: ['oil_change', 'brakes'],
      },
    });
  });

  afterAll(async () => {
    if (providerId) {
      await prismaService.user.delete({ where: { id: providerId } });
    }
    await app.close();
  });

  describe('Provider Profile Onboarding', () => {
    it('should update provider business details', () => {
      return request(app.getHttpServer())
        .put('/shanda/auth/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          businessName: 'Best Mechanics Inc.',
          shopCity: 'Motor City',
          shopState: 'MI',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.businessName).toBe('Best Mechanics Inc.');
          expect(res.body.shopCity).toBe('Motor City');
          expect(res.body.shopState).toBe('MI');
        });
    });

    it('should update service types', async () => {
      await request(app.getHttpServer())
        .put('/shanda/auth/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          serviceTypes: ['oil_change', 'brake_repair', 'diagnostics'],
          shopCity: 'Motor City',
          shopState: 'MI',
          onboardingComplete: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.serviceTypes).toContain('oil_change');
        });
    });

    it('should appear in public provider search', async () => {
      // Wait a bit for any indexing if necessary (though DB is immediate)
      
      return request(app.getHttpServer())
        .get('/shanda/providers')
        .query({ serviceType: 'oil_change' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const found = res.body.find((p: any) => p.id === providerId);
          expect(found).toBeDefined();
          expect(found.businessName).toBe('Best Mechanics Inc.');
        });
    });

    it('should return public profile details', () => {
      return request(app.getHttpServer())
        .get(`/shanda/providers/${providerId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(providerId);
          expect(res.body.businessName).toBe('Best Mechanics Inc.');
          // Should not expose sensitive data like email or phone if not intended
          // (Depending on privacy requirements, phone might be public for providers)
        });
    });
  });
});
