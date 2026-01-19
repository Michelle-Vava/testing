import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

describe('Auth Integration Tests (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Creation & Role Management Flow', () => {
    it('should create user with default owner role', async () => {
      // Simulate webhook creating user
      const user = await prisma.user.create({
        data: {
          externalAuthId: `test_${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          name: 'Test User',
          authProvider: 'clerk',
          roles: ['owner'], // Default role
          ownerProfile: {
            create: {
              onboardingComplete: false,
            },
          },
        },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });

      expect(user.roles).toEqual(['owner']);
      expect(user.ownerProfile).toBeDefined();
      expect(user.providerProfile).toBeNull();
      
      userId = user.id;
    });

    it('should update roles to add provider', async () => {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          roles: ['owner', 'provider'],
          providerProfile: {
            create: {
              status: 'NONE',
              onboardingComplete: false,
            },
          },
        },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });

      expect(updatedUser.roles).toEqual(['owner', 'provider']);
      expect(updatedUser.providerProfile).toBeDefined();
      expect(updatedUser.providerProfile?.status).toBe('NONE');
    });

    it('should reorder roles to switch primary role', async () => {
      // Switch from owner primary to provider primary
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          roles: ['provider', 'owner'], // Provider first now
        },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });

      expect(updatedUser.roles[0]).toBe('provider');
      expect(updatedUser.roles).toContain('owner');
    });

    it('should not lose data when switching roles', async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });

      // Both profiles should still exist
      expect(user?.ownerProfile).toBeDefined();
      expect(user?.providerProfile).toBeDefined();
      expect(user?.roles).toHaveLength(2);
    });
  });

  describe('Provider Status Transitions', () => {
    let providerId: string;

    it('should create provider with NONE status', async () => {
      const user = await prisma.user.create({
        data: {
          externalAuthId: `provider_${Date.now()}`,
          email: `provider${Date.now()}@example.com`,
          name: 'Test Provider',
          authProvider: 'clerk',
          roles: ['owner', 'provider'],
          ownerProfile: {
            create: {
              onboardingComplete: true,
            },
          },
          providerProfile: {
            create: {
              status: 'NONE',
              onboardingComplete: false,
            },
          },
        },
        include: {
          providerProfile: true,
        },
      });

      expect(user.providerProfile?.status).toBe('NONE');
      providerId = user.id;
    });

    it('should transition NONE → DRAFT', async () => {
      await prisma.providerProfile.update({
        where: { userId: providerId },
        data: { status: 'DRAFT' },
      });

      const user = await prisma.user.findUnique({
        where: { id: providerId },
        include: { providerProfile: true },
      });

      expect(user?.providerProfile?.status).toBe('DRAFT');
    });

    it('should transition DRAFT → LIMITED', async () => {
      await prisma.providerProfile.update({
        where: { userId: providerId },
        data: {
          status: 'LIMITED',
          onboardingComplete: true,
        },
      });

      const user = await prisma.user.findUnique({
        where: { id: providerId },
        include: { providerProfile: true },
      });

      expect(user?.providerProfile?.status).toBe('LIMITED');
      expect(user?.providerProfile?.onboardingComplete).toBe(true);
    });

    it('should transition LIMITED → ACTIVE', async () => {
      await prisma.providerProfile.update({
        where: { userId: providerId },
        data: { status: 'ACTIVE' },
      });

      const user = await prisma.user.findUnique({
        where: { id: providerId },
        include: { providerProfile: true },
      });

      expect(user?.providerProfile?.status).toBe('ACTIVE');
    });

    it('should be able to SUSPEND active provider', async () => {
      await prisma.providerProfile.update({
        where: { userId: providerId },
        data: { status: 'SUSPENDED' },
      });

      const user = await prisma.user.findUnique({
        where: { id: providerId },
        include: { providerProfile: true },
      });

      expect(user?.providerProfile?.status).toBe('SUSPENDED');
    });

    it('should be able to REACTIVATE suspended provider', async () => {
      await prisma.providerProfile.update({
        where: { userId: providerId },
        data: { status: 'ACTIVE' },
      });

      const user = await prisma.user.findUnique({
        where: { id: providerId },
        include: { providerProfile: true },
      });

      expect(user?.providerProfile?.status).toBe('ACTIVE');
    });
  });

  describe('Multi-User Scenarios', () => {
    it('should handle multiple users with same roles differently', async () => {
      // Create two owner users
      const [user1, user2] = await Promise.all([
        prisma.user.create({
          data: {
            externalAuthId: `owner1_${Date.now()}`,
            email: `owner1${Date.now()}@example.com`,
            name: 'Owner One',
            authProvider: 'clerk',
            roles: ['owner'],
            ownerProfile: { create: { onboardingComplete: false } },
          },
        }),
        prisma.user.create({
          data: {
            externalAuthId: `owner2_${Date.now()}`,
            email: `owner2${Date.now()}@example.com`,
            name: 'Owner Two',
            authProvider: 'clerk',
            roles: ['owner'],
            ownerProfile: { create: { onboardingComplete: true } },
          },
        }),
      ]);

      expect(user1.roles).toEqual(['owner']);
      expect(user2.roles).toEqual(['owner']);
      expect(user1.id).not.toBe(user2.id);
    });

    it('should maintain role independence between users', async () => {
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: 'owner',
          },
        },
        take: 2,
      });

      // Each user should have independent roles
      expect(users).toHaveLength(2);
      expect(users[0].roles).toEqual(['owner']);
      expect(users[1].roles).toEqual(['owner']);
    });
  });

  describe('Data Integrity', () => {
    it('should cascade delete provider profile when user is deleted', async () => {
      const user = await prisma.user.create({
        data: {
          externalAuthId: `cascade_test_${Date.now()}`,
          email: `cascade${Date.now()}@example.com`,
          name: 'Cascade Test',
          authProvider: 'clerk',
          roles: ['owner', 'provider'],
          ownerProfile: { create: { onboardingComplete: false } },
          providerProfile: { create: { status: 'DRAFT', onboardingComplete: false } },
        },
        include: {
          ownerProfile: true,
          providerProfile: true,
        },
      });

      const profileId = user.providerProfile?.id;
      expect(profileId).toBeDefined();

      // Delete user
      await prisma.user.delete({
        where: { id: user.id },
      });

      // Provider profile should also be deleted
      const profile = await prisma.providerProfile.findUnique({
        where: { id: profileId },
      });

      expect(profile).toBeNull();
    });

    it('should not allow duplicate external auth IDs', async () => {
      const externalId = `duplicate_test_${Date.now()}`;
      
      await prisma.user.create({
        data: {
          externalAuthId: externalId,
          email: `dup1${Date.now()}@example.com`,
          name: 'First',
          authProvider: 'clerk',
          roles: ['owner'],
          ownerProfile: { create: { onboardingComplete: false } },
        },
      });

      // Try to create duplicate
      await expect(
        prisma.user.create({
          data: {
            externalAuthId: externalId, // Same ID
            email: `dup2${Date.now()}@example.com`,
            name: 'Second',
            authProvider: 'clerk',
            roles: ['owner'],
            ownerProfile: { create: { onboardingComplete: false } },
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with empty roles array', async () => {
      const user = await prisma.user.create({
        data: {
          externalAuthId: `empty_roles_${Date.now()}`,
          email: `empty${Date.now()}@example.com`,
          name: 'Empty Roles',
          authProvider: 'clerk',
          roles: [], // Empty roles
          ownerProfile: { create: { onboardingComplete: false } },
        },
      });

      expect(user.roles).toEqual([]);
    });

    it('should handle very long email addresses', async () => {
      const longEmail = `very.long.email.address.that.exceeds.normal.length${Date.now()}@example-domain-with-many-subdomains.co.uk`;
      
      const user = await prisma.user.create({
        data: {
          externalAuthId: `long_email_${Date.now()}`,
          email: longEmail,
          name: 'Long Email User',
          authProvider: 'clerk',
          roles: ['owner'],
          ownerProfile: { create: { onboardingComplete: false } },
        },
      });

      expect(user.email).toBe(longEmail);
    });

    it('should handle special characters in names', async () => {
      const specialName = "O'Connor-Smith (Jr.) 李明";
      
      const user = await prisma.user.create({
        data: {
          externalAuthId: `special_name_${Date.now()}`,
          email: `special${Date.now()}@example.com`,
          name: specialName,
          authProvider: 'clerk',
          roles: ['owner'],
          ownerProfile: { create: { onboardingComplete: false } },
        },
      });

      expect(user.name).toBe(specialName);
    });
  });
});
