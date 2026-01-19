import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { NotificationsService } from '../../../src/modules/notifications/notifications.service';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('shanda');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    notificationsService = moduleFixture.get<NotificationsService>(NotificationsService);

    // Create user and login
    const email = `test-notif-${Date.now()}@example.com`;
    await request(app.getHttpServer())
      .post('/shanda/auth/signup')
      .send({
        email,
        password: 'Password123!',
        name: 'Test User',
        roles: ['owner'],
      });

    const loginRes = await request(app.getHttpServer())
      .post('/shanda/auth/login')
      .send({ email, password: 'Password123!' });

    authToken = loginRes.body.accessToken;
    userId = loginRes.body.user.id;
  });

  afterAll(async () => {
    if (userId) {
      await prismaService.user.delete({ where: { id: userId } });
    }
    await app.close();
  });

  it('/notifications (GET)', async () => {
    // Create a notification first
    await notificationsService.create(userId, 'test', 'Test Title', 'Test Message');

    const res = await request(app.getHttpServer())
      .get('/shanda/notifications')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBe('Test Title');
  });

  it('/notifications/unread-count (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/shanda/notifications/unread-count')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.unreadCount).toBeGreaterThan(0);
  });
});
