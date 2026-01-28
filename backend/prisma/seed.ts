import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in development)
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.service.deleteMany();
  
  // 1. CREATE SERVICES
  const services = await Promise.all([
    // Non-Mechanic Services (Detailing, Cosmetic)
    prisma.service.create({
      data: {
        name: 'Mobile Detailing',
        slug: 'mobile-detailing',
        description: 'Full interior and exterior detailing at your location',
        icon: '✨',
        isPopular: true,
        displayOrder: 1,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Car Wash',
        slug: 'car-wash',
        description: 'Exterior wash and dry',
        icon: '🚿',
        isPopular: true,
        displayOrder: 2,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Interior Cleaning',
        slug: 'interior-cleaning',
        description: 'Deep clean of upholstery, carpets, and surfaces',
        icon: '🧹',
        isPopular: false,
        displayOrder: 3,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Window Tinting',
        slug: 'window-tinting',
        description: 'Professional window tint installation',
        icon: '🕶️',
        isPopular: false,
        displayOrder: 4,
      },
    }),
    // Light Maintenance (Often allowed without full mech license)
    prisma.service.create({
      data: {
        name: 'Oil Change',
        slug: 'oil-change',
        description: 'Regular oil and filter replacement',
        icon: '🛢️',
        isPopular: true,
        displayOrder: 5,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Tire Service',
        slug: 'tire-service',
        description: 'Rotation, seasonal swap, or puncture repair',
        icon: '🛞',
        isPopular: true,
        displayOrder: 6,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Battery Replacement',
        slug: 'battery',
        description: 'Battery testing and replacement',
        icon: '🔋',
        isPopular: true,
        displayOrder: 7,
      },
    }),
    // Heavier stuff
    prisma.service.create({
      data: {
        name: 'Brake Service',
        slug: 'brake-service',
        description: 'Brake pad replacement, rotor resurfacing',
        icon: '🛑',
        isPopular: false,
        displayOrder: 8,
      },
    }),
  ]);

  console.log('✅ Created services');

  // 2. CREATE USERS WITH ENHANCED PROVIDER PROFILES
  // Note: With Clerk auth, users are created via Clerk webhooks
  // These seed users use externalAuthId for Clerk user IDs (placeholder values for dev)
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@serviceconnect.com' },
    update: {},
    create: {
      email: 'owner@serviceconnect.com',
      name: 'John Owner',
      externalAuthId: 'clerk_seed_owner_001',
      authProvider: 'clerk',
      phone: '+1 (902) 555-0100',
      roles: ['owner'],
      ownerProfile: {
        create: {
          city: 'Halifax',
          state: 'NS',
          address: '123 Spring Garden Road',
          zipCode: 'B3H 1Y6',
          onboardingComplete: true,
        }
      }
    },
  });

  const provider1 = await prisma.user.upsert({
    where: { email: 'provider@serviceconnect.com' },
    update: {},
    create: {
      email: 'provider@serviceconnect.com',
      name: 'Mike Thompson',
      externalAuthId: 'clerk_seed_provider_001',
      authProvider: 'clerk',
      phone: '+1 (902) 555-0101',
      roles: ['provider'],
      ownerProfile: {
        create: {
          city: 'Halifax',
          state: 'NS',
          onboardingComplete: true,
          bio: 'Family-owned shop serving Halifax for over 15 years. ASE certified mechanics specializing in all makes and models.',
        }
      },
      providerProfile: {
        create: {
          onboardingComplete: true, // Explicitly set to true for development
          businessName: 'Halifax Auto Care',
          serviceTypes: ['Oil Change', 'Brake Service', 'Diagnostics', 'Tire Service'],
          yearsInBusiness: 15,
          shopAddress: '1500 Bedford Highway',
          shopCity: 'Halifax',
          shopState: 'NS',
          shopZipCode: 'B3M 2K2',
          serviceArea: ['Halifax', 'Dartmouth', 'Bedford', 'Sackville'],
          isMobileService: false,
          isShopService: true,
          status: 'ACTIVE',
        }
      }
    },
  });

  const provider2 = await prisma.user.upsert({
    where: { email: 'mobile@serviceconnect.com' },
    update: {},
    create: {
      email: 'mobile@serviceconnect.com',
      name: 'Sarah Mobile',
      externalAuthId: 'clerk_seed_provider_002',
      authProvider: 'clerk',
      phone: '+1 (902) 555-0102',
      roles: ['provider'],
      ownerProfile: {
        create: {
          city: 'Halifax',
          state: 'NS',
          onboardingComplete: true,
          bio: 'Bringing the shop to you! Convenient mobile service for busy professionals. Available evenings and weekends.',
        }
      },
      providerProfile: {
        create: {
          businessName: 'Mobile Mechanic HFX',
          serviceTypes: ['Oil Change', 'Battery', 'Tire Service', 'Brake Service'],
          yearsInBusiness: 7,
          serviceArea: ['Halifax', 'Dartmouth', 'Bedford'],
          isMobileService: true,
          isShopService: false,
          status: 'ACTIVE',
        }
      }
    },
  });

  const provider3 = await prisma.user.upsert({
    where: { email: 'elite@serviceconnect.com' },
    update: {},
    create: {
      email: 'elite@serviceconnect.com',
      name: 'Tom Richardson',
      externalAuthId: 'clerk_seed_provider_003',
      authProvider: 'clerk',
      phone: '+1 (902) 555-0103',
      roles: ['provider'],
      ownerProfile: {
        create: {
          city: 'Halifax',
          state: 'NS',
          onboardingComplete: true,
          bio: 'Premium automotive service specializing in European and luxury vehicles. State-of-the-art diagnostic equipment.',
        }
      },
      providerProfile: {
        create: {
          businessName: 'Elite Motors Halifax',
          serviceTypes: ['Engine Repair', 'Transmission', 'AC Service', 'Diagnostics'],
          yearsInBusiness: 12,
          shopAddress: '2000 Robie Street',
          shopCity: 'Halifax',
          shopState: 'NS',
          shopZipCode: 'B3K 4N5',
          serviceArea: ['Halifax', 'Dartmouth'],
          isMobileService: false,
          isShopService: true,
          status: 'ACTIVE',
        }
      }
    },
  });

  const provider4 = await prisma.user.upsert({
    where: { email: 'quickfix@serviceconnect.com' },
    update: {},
    create: {
      email: 'quickfix@serviceconnect.com',
      name: 'David Quick',
      externalAuthId: 'clerk_seed_provider_004',
      authProvider: 'clerk',
      phone: '+1 (902) 555-0104',
      roles: ['provider'],
      ownerProfile: {
        create: {
          city: 'Dartmouth',
          state: 'NS',
          onboardingComplete: true,
          bio: 'Fastest service in town. No appointment needed for oil changes and basic maintenance.',
        }
      },
      providerProfile: {
        create: {
          businessName: 'Quick Fix Auto',
          serviceTypes: ['Oil Change', 'Tire Service', 'Inspection'],
          yearsInBusiness: 5,
          shopAddress: '55 Main Street',
          shopCity: 'Dartmouth',
          shopState: 'NS',
          shopZipCode: 'B2X 1R5',
          serviceArea: ['Dartmouth', 'Cole Harbour'],
          isMobileService: false,
          isShopService: true,
          status: 'ACTIVE',
        }
      }
    },
  });

  const provider5 = await prisma.user.upsert({
    where: { email: 'budget@serviceconnect.com' },
    update: {},
    create: {
      email: 'budget@serviceconnect.com',
      name: 'Bob Miller',
      externalAuthId: 'clerk_seed_provider_005',
      authProvider: 'clerk',
      phone: '+1 (902) 555-0105',
      roles: ['provider'],
      ownerProfile: {
        create: {
          city: 'Sackville',
          state: 'NS',
          onboardingComplete: true,
          bio: 'Affordable auto repair for everyone. We match any competitor price.',
        }
      },
      providerProfile: {
        create: {
          businessName: 'Budget Auto Repair',
          serviceTypes: ['General Repair', 'Brake Service', 'Suspension'],
          yearsInBusiness: 20,
          shopAddress: '100 Sackville Drive',
          shopCity: 'Lower Sackville',
          shopState: 'NS',
          shopZipCode: 'B4C 2R0',
          serviceArea: ['Sackville', 'Bedford'],
          isMobileService: false,
          isShopService: true,
          status: 'ACTIVE',
        }
      }
    },
  });

  console.log('✅ Created users and providers');

  // 3. CREATE SAMPLE VEHICLES FOR OWNER
  const vehicle1 = await prisma.vehicle.create({
    data: {
      ownerId: ownerUser.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      vin: '4T1B11HK1KU123456',
      licensePlate: 'ABC 123',
      color: 'Silver',
      mileage: 45000,
    },
  });

  console.log('✅ Created sample vehicle');

  // 4. CREATE SAMPLE ACTIVITIES FOR OWNER
  await Promise.all([
    prisma.activity.create({
      data: {
        userId: ownerUser.id,
        type: 'vehicle_added',
        description: 'Added 2019 Toyota Camry',
        metadata: { vehicleId: vehicle1.id },
      },
    }),
  ]);

  console.log('✅ Created sample activities');

  // 5. CREATE SAMPLE NOTIFICATIONS
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: ownerUser.id,
        type: 'setup_reminder',
        title: 'Complete your profile',
        message: 'Add your address to get accurate service quotes',
        link: '/owner/settings',
      },
    }),
  ]);

  console.log('✅ Created sample notifications');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
