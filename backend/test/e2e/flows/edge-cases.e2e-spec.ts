import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';

describe('Edge Cases and Failure Modes E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let ownerToken: string;
  let providerToken: string;
  let otherOwnerToken: string;
  let vehicleId: string;
  let requestId: string;

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
      }),
    );
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // Clean up
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['fail_owner@test.com', 'fail_provider@test.com', 'other_owner@test.com'],
        },
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Failures', () => {
    it('should fail to register with existing email', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/shanda/auth/signup')
        .send({
          name: 'Fail Owner',
          email: 'fail_owner@test.com',
          password: 'Password123!',
          phone: '+1111111111',
          roles: ['owner'],
        })
        .expect(201);

      // Second registration
      await request(app.getHttpServer())
        .post('/shanda/auth/signup')
        .send({
          name: 'Fail Owner Duplicate',
          email: 'fail_owner@test.com',
          password: 'Password123!',
          phone: '+2222222222',
          roles: ['owner'],
        })
        // Expect 409 Conflict or 400 Bad Request depending on implementation
        .expect((res) => {
           if (res.status !== 409 && res.status !== 400) throw new Error(`Expected 409 or 400, got ${res.status}`);
        });
    });

    it('should fail login with incorrect password', async () => {
      await request(app.getHttpServer())
        .post('/shanda/auth/login')
        .send({
          email: 'fail_owner@test.com',
          password: 'WrongPassword!',
        })
        .expect(401);
    });
  });

  describe('Authorization & Resource Access Failures', () => {
    beforeAll(async () => {
      // Login as owner
      const ownerRes = await request(app.getHttpServer())
        .post('/shanda/auth/login')
        .send({ email: 'fail_owner@test.com', password: 'Password123!' });
      ownerToken = ownerRes.body.accessToken;

      // Create vehicle
      const vehicleRes = await request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          year: 2020,
          vin: 'INVALIDVIN12345',
          licensePlate: 'FAIL123',
          mileage: 50000,
        });
      vehicleId = vehicleRes.body.id;

      // Setup other owner
      await request(app.getHttpServer())
        .post('/shanda/auth/signup')
        .send({
          name: 'Other Owner',
          email: 'other_owner@test.com',
          password: 'Password123!',
          phone: '+3333333333',
          roles: ['owner'],
        });
      const otherRes = await request(app.getHttpServer())
        .post('/shanda/auth/login')
        .send({ email: 'other_owner@test.com', password: 'Password123!' });
      otherOwnerToken = otherRes.body.accessToken;
      
      // Setup provider
      await request(app.getHttpServer())
        .post('/shanda/auth/signup')
        .send({
          name: 'Fail Provider',
          email: 'fail_provider@test.com',
          password: 'Password123!',
          phone: '+4444444444',
          roles: ['provider'],
        });
      
      // Manually activate provider
       const providerUser = await prisma.user.findUnique({where: {email: 'fail_provider@test.com'}});
        if(providerUser) {
            await prisma.providerProfile.upsert({
                where: {userId: providerUser.id},
                create: {userId: providerUser.id, status: 'ACTIVE'},
                update: {status: 'ACTIVE'}
            });
        }

      const providerRes = await request(app.getHttpServer())
        .post('/shanda/auth/login')
        .send({ email: 'fail_provider@test.com', password: 'Password123!' });
      providerToken = providerRes.body.accessToken;
    });

    it('should fail when other owner tries to access vehicle', async () => {
      await request(app.getHttpServer())
        .get(`/shanda/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${otherOwnerToken}`)
        .expect(403); // Forbidden
    });

    it('should fail when provider tries to create a vehicle (Role Guard)', async () => {
      await request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          make: 'Ford',
          model: 'F150',
          year: 2021,
          vin: 'FORDVIN12345',
        })
        .expect(403);
    });

    it('should fail when owner tries to submit a quote (Role Guard)', async () => {
      // Create request first
      const reqRes = await request(app.getHttpServer())
        .post('/shanda/requests')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          vehicleId,
          title: 'Break fix',
          description: 'Fix my breaks',
          urgency: 'high',
        });
      requestId = reqRes.body.id;

      await request(app.getHttpServer())
        .post('/shanda/quotes')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          requestId,
          amount: 100,
          description: 'I can fix it',
        })
        .expect(403);
    });
  });

  describe('Validation & Logic Failures', () => {
    it('should fail to create request for non-existent vehicle', async () => {
      const start = Date.now();
      await request(app.getHttpServer())
        .post('/shanda/requests')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          vehicleId: '00000000-0000-0000-0000-000000000000',
          title: 'Ghost Car Service',
          description: 'Fix ghost car',
          urgency: 'low',
        })
        .expect(404);
    });

    it('should fail to create quote for non-existent request', async () => {
      await request(app.getHttpServer())
        .post('/shanda/quotes')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          requestId: '00000000-0000-0000-0000-000000000000',
          amount: '50.00',
          estimatedDuration: '1h',
          description: 'Ghost quote',
        })
        .expect(404);
    });

    it('should fail to create quote with negative amount', async () => {
       await request(app.getHttpServer())
        .post('/shanda/quotes')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
            requestId,
            amount: '-100.00',
            estimatedDuration: '1h',
            description: 'Negative price',
            includesWarranty: false
        })
        // Expect 400 Bad Request due to validation pipe or service logic
        .expect(400); 
    });
  });

  describe('Soft Delete Integrity', () => {
    it('should fail to create request for soft-deleted vehicle', async () => {
       // Delete vehicle
       await request(app.getHttpServer())
         .delete(`/shanda/vehicles/${vehicleId}`)
         .set('Authorization', `Bearer ${ownerToken}`)
         .expect(200);

       // Try to create request
       await request(app.getHttpServer())
        .post('/shanda/requests')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          vehicleId,
          title: 'Zombie Car Service',
          description: 'Fix zombie car',
          urgency: 'low',
        })
        .expect(404); // Should act as if it doesn't exist
    });
  });
});
