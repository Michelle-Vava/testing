import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

describe('Complete User Flow E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let ownerToken: string;
  let providerToken: string;
  let vehicleId: string;
  let requestId: string;
  let quoteId: string;
  let jobId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['owner@test.com', 'provider@test.com'],
        },
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Owner Registration and Vehicle Setup', () => {
    it('should register a new owner', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test Owner',
          email: 'owner@test.com',
          password: 'Password123!',
          phone: '+1234567890',
          roles: ['owner'],
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('owner@test.com');
      ownerToken = response.body.token;
    });

    it('should create a vehicle', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          vin: '1HGBH41JXMN109186',
          licensePlate: 'ABC123',
          mileage: 45000,
        })
        .expect(201);

      expect(response.body.make).toBe('Toyota');
      vehicleId = response.body.id;
    });

    it('should create a service request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/requests')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          vehicleId,
          title: 'Oil Change',
          description: 'Need oil change and filter replacement',
          urgency: 'medium',
        })
        .expect(201);

      expect(response.body.title).toBe('Oil Change');
      requestId = response.body.id;
    });
  });

  describe('2. Provider Registration and Quote Submission', () => {
    it('should register a new provider', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test Provider',
          email: 'provider@test.com',
          password: 'Password123!',
          phone: '+0987654321',
          roles: ['provider'],
        })
        .expect(201);

      providerToken = response.body.token;
    });

    it('should complete provider onboarding', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/onboard-provider')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          businessName: 'Test Auto Shop',
          serviceTypes: ['oil_change', 'tire_rotation'],
          yearsInBusiness: 5,
          shopAddress: '123 Main St',
          shopCity: 'TestCity',
          shopState: 'CA',
          shopZipCode: '12345',
          serviceArea: ['TestCity'],
          isShopService: true,
        })
        .expect(200);
    });

    it('should submit a quote', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          requestId,
          amount: 75.00,
          estimatedDuration: '1-2 hours',
          description: 'Full synthetic oil change with filter replacement',
          includesWarranty: true,
        })
        .expect(201);

      expect(response.body.amount).toBe('75.00');
      quoteId = response.body.id;
    });
  });

  describe('3. Quote Acceptance and Job Creation', () => {
    it('should accept the quote', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/quotes/${quoteId}/accept`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.quote.status).toBe('accepted');
      jobId = response.body.job.id;
    });

    it('should create a payment for the job', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          jobId,
          amount: 75.00,
        })
        .expect(201);

      expect(response.body.amount).toBe('75.00');
    });
  });

  describe('4. Job Completion and Review', () => {
    it('should update job status to completed', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/jobs/${jobId}/status`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          status: 'completed',
        })
        .expect(200);
    });

    it('should create a review', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/reviews/${jobId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          rating: 5,
          comment: 'Excellent service!',
        })
        .expect(201);

      expect(response.body.rating).toBe(5);
    });

    it('should respond to review', async () => {
      const reviews = await request(app.getHttpServer())
        .get('/api/v1/reviews')
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      const reviewId = reviews.body.data[0].id;

      await request(app.getHttpServer())
        .patch(`/api/v1/reviews/${reviewId}/respond`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          response: 'Thank you for your business!',
        })
        .expect(200);
    });
  });

  describe('5. Soft Delete and Audit Trail', () => {
    it('should soft delete a vehicle', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      // Verify it's soft deleted
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
      expect(vehicle?.deletedAt).not.toBeNull();
    });

    it('should not show soft-deleted vehicles in list', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/vehicles')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      const deletedVehicle = response.body.data.find((v: any) => v.id === vehicleId);
      expect(deletedVehicle).toBeUndefined();
    });
  });
});
