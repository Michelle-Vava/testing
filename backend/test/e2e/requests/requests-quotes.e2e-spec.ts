import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { CreateRequestDto, RequestUrgency } from '../../../src/modules/requests/dto/create-request.dto';
import { CreateQuoteDto } from '../../../src/modules/quotes/dto/create-quote.dto';

describe('Requests & Quotes Flow (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  
  // Owner Data
  let ownerToken: string;
  let ownerId: string;
  let vehicleId: string;
  let requestId: string;

  // Provider Data
  let providerToken: string;
  let providerId: string;
  let quoteId: string;

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

    // 1. Create Owner
    const ownerEmail = `owner-${Date.now()}@e2etest.com`;
    const ownerRes = await request(app.getHttpServer())
      .post('/shanda/auth/signup')
      .send({
        email: ownerEmail,
        password: 'SecurePass123!',
        name: 'Test Owner',
        phone: '1234567890',
        roles: ['owner'],
      })
      .expect(201);
    ownerToken = ownerRes.body.accessToken;
    ownerId = ownerRes.body.user.id;

    // 2. Create Provider
    const providerEmail = `provider-${Date.now()}@e2etest.com`;
    const providerRes = await request(app.getHttpServer())
      .post('/shanda/auth/signup')
      .send({
        email: providerEmail,
        password: 'SecurePass123!',
        name: 'Test Provider',
        phone: '0987654321',
        roles: ['provider'],
      })
      .expect(201);
    providerToken = providerRes.body.accessToken;
    providerId = providerRes.body.user.id;

    // Manually set provider status to ACTIVE for testing
    await prismaService.providerProfile.upsert({
      where: { userId: providerId },
      create: {
        userId: providerId,
        status: 'ACTIVE',
        businessName: 'Test Provider Business',
      },
      update: { status: 'ACTIVE' },
    });

    // 3. Create Vehicle for Owner
    const vehicleRes = await request(app.getHttpServer())
      .post('/shanda/vehicles')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        vin: `VIN${Date.now()}`,
      })
      .expect(201);
    vehicleId = vehicleRes.body.id;
  });

  afterAll(async () => {
    // Cleanup
    if (requestId) {
      await prismaService.quote.deleteMany({ where: { requestId } });
      await prismaService.serviceRequest.delete({ where: { id: requestId } });
    }
    if (vehicleId) {
      await prismaService.vehicle.delete({ where: { id: vehicleId } });
    }
    if (ownerId) await prismaService.user.delete({ where: { id: ownerId } });
    if (providerId) await prismaService.user.delete({ where: { id: providerId } });
    
    await app.close();
  });

  describe('Service Request Lifecycle', () => {
    it('Owner should create a service request', () => {
      const requestData: CreateRequestDto = {
        vehicleId,
        title: 'Oil Change Needed',
        description: 'Standard oil change and filter replacement',
        urgency: RequestUrgency.MEDIUM,
      };

      return request(app.getHttpServer())
        .post('/shanda/requests')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(requestData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(requestData.title);
          expect(res.body.status).toBe('open');
          requestId = res.body.id;
        });
    });

    it('Provider should see the open request', () => {
      return request(app.getHttpServer())
        .get('/shanda/requests')
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          const found = res.body.data.find((r: any) => r.id === requestId);
          expect(found).toBeDefined();
          expect(found.title).toBe('Oil Change Needed');
        });
    });

    it('Provider should submit a quote', () => {
      const quoteData: CreateQuoteDto = {
        requestId,
        amount: '50.00',
        estimatedDuration: '1 hour',
        description: 'Full synthetic oil change',
        includesWarranty: true,
      };

      return request(app.getHttpServer())
        .post('/shanda/quotes')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(quoteData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          // Decimal might return "50" instead of "50.00"
          expect(parseFloat(res.body.amount)).toBe(50.00);
          expect(res.body.providerId).toBe(providerId);
          quoteId = res.body.id;
        });
    });

    it('Owner should see the quote', () => {
      return request(app.getHttpServer())
        .get(`/shanda/quotes/request/${requestId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const quote = res.body.find((q: any) => q.id === quoteId);
          expect(quote).toBeDefined();
          expect(parseFloat(quote.amount)).toBe(50.00);
        });
    });

    it('Owner should accept the quote (creating a job)', () => {
      return request(app.getHttpServer())
        .post(`/shanda/quotes/${quoteId}/accept`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('job');
          expect(res.body.job).toHaveProperty('id');
          expect(res.body.job.status).toBe('pending');
          expect(res.body.job.quoteId).toBe(quoteId);
        });
    });

    it('Request status should be updated to in_progress/assigned', async () => {
      // Check request status after acceptance
      const res = await request(app.getHttpServer())
        .get(`/shanda/requests/${requestId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);
      
      // Status might be 'in_progress' or similar depending on logic
      // Based on controller comments: "Accepting a quote creates a job and changes request status."
      expect(['in_progress', 'assigned', 'closed']).toContain(res.body.status);
    });
  });
});
