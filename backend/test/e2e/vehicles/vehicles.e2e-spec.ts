import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { CreateVehicleDto } from '../../../src/modules/vehicles/dto/create-vehicle.dto';
import { v4 as uuidv4 } from 'uuid';

describe('VehiclesController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

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

    // Create a test user and get token
    const email = `vehicle-test-${Date.now()}-${Math.random()}@e2etest.com`;
    const password = 'SecurePass123!';
    
    const randomPhone = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    const signupResponse = await request(app.getHttpServer())
      .post('/shanda/auth/signup')
      .send({
        email,
        password,
        name: 'Vehicle Test User',
        phone: randomPhone,
        roles: ['owner'],
      })
      .expect(201);

    authToken = signupResponse.body.accessToken;
    userId = signupResponse.body.user.id;
  });

  afterAll(async () => {
    if (userId) {
      await prismaService.user.delete({ where: { id: userId } });
    }
    await app.close();
  });

  afterAll(async () => {
    // Cleanup
    if (userId) {
      // Delete vehicles first (cascade should handle it but being explicit is safer)
      await prismaService.vehicle.deleteMany({
        where: { ownerId: userId },
      });
      
      // Check if user exists before deleting to avoid "Record to delete does not exist" error
      const userExists = await prismaService.user.findUnique({ where: { id: userId } });
      if (userExists) {
        await prismaService.user.delete({
          where: { id: userId },
        });
      }
    }
    await app.close();
  });

  describe('/vehicles (POST)', () => {
    it('should create a new vehicle', () => {
      const vehicleData: CreateVehicleDto = {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'Silver',
        vin: `VIN${Date.now()}`,
        mileage: 10000
      };

      return request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vehicleData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.make).toBe(vehicleData.make);
          expect(res.body.model).toBe(vehicleData.model);
          expect(res.body.year).toBe(vehicleData.year);
        });
    });

    it('should fail to create vehicle without required fields', () => {
      return request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Honda',
          // Missing model and year
        })
        .expect(400);
    });
  });

  describe('/vehicles (GET)', () => {
    it('should return list of vehicles', () => {
      return request(app.getHttpServer())
        .get('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body).toHaveProperty('meta');
        });
    });
  });

  describe('/vehicles/:id (GET)', () => {
    let vehicleId: string;

    beforeAll(async () => {
      // Create a vehicle to fetch
      const res = await request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Ford',
          model: 'F-150',
          year: 2023,
        });
      vehicleId = res.body.id;
    });

    it('should return a specific vehicle', () => {
      return request(app.getHttpServer())
        .get(`/shanda/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(vehicleId);
          expect(res.body.make).toBe('Ford');
        });
    });

    it('should return 404 for non-existent vehicle', () => {
      const nonExistentId = uuidv4();
      return request(app.getHttpServer())
        .get(`/shanda/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/vehicles/:id (PUT)', () => {
    let vehicleId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          year: 2020,
        });
      vehicleId = res.body.id;
    });

    it('should update vehicle details', () => {
      return request(app.getHttpServer())
        .put(`/shanda/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          color: 'Red',
          licensePlate: 'UPDATED',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.color).toBe('Red');
          expect(res.body.licensePlate).toBe('UPDATED');
        });
    });
  });

  describe('/vehicles/:id/mileage (PATCH)', () => {
    let vehicleId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Tesla',
          model: 'Model 3',
          year: 2024,
          mileage: 1000,
        });
      vehicleId = res.body.id;
    });

    it('should update vehicle mileage', () => {
      return request(app.getHttpServer())
        .patch(`/shanda/vehicles/${vehicleId}/mileage`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          mileage: 1500,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.mileage).toBe(1500);
        });
    });
  });

  describe('/vehicles/:id (DELETE)', () => {
    let vehicleId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shanda/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Chevy',
          model: 'Bolt',
          year: 2019,
        });
      vehicleId = res.body.id;
    });

    it('should delete the vehicle', () => {
      return request(app.getHttpServer())
        .delete(`/shanda/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 when getting deleted vehicle', () => {
      return request(app.getHttpServer())
        .get(`/shanda/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
