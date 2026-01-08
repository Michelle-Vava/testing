import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

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
    const res = await request(app.getHttpServer())
      .post('/shanda/auth/signup')
      .send({
        email,
        password: 'SecurePass123!',
        name: 'New Provider',
        phone: '5551234567',
        roles: ['provider'],
      })
      .expect(201);

    providerToken = res.body.token;
    providerId = res.body.user.id;
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
          yearsInBusiness: 5,
          bio: 'Expert car repair services',
          isShopService: true,
          shopAddress: '123 Garage St',
          shopCity: 'Motor City',
          shopState: 'MI',
          shopZipCode: '48201',
          // Add required location fields for onboarding completion
          city: 'Motor City',
          state: 'MI',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.businessName).toBe('Best Mechanics Inc.');
          expect(res.body.yearsInBusiness).toBe(5);
          expect(res.body.isShopService).toBe(true);
          expect(res.body.city).toBe('Motor City');
        });
    });

    it('should update service types and area', async () => {
      await request(app.getHttpServer())
        .put('/shanda/auth/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          serviceTypes: ['oil_change', 'brake_repair', 'diagnostics'],
          serviceArea: ['Motor City', 'Detroit'],
          isMobileService: true,
          city: 'Motor City',
          state: 'MI',
          onboardingComplete: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.serviceTypes).toContain('oil_change');
          expect(res.body.serviceArea).toContain('Detroit');
          expect(res.body.isMobileService).toBe(true);
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
