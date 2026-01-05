"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.activity.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.service.deleteMany();
    const services = await Promise.all([
        prisma.service.create({
            data: {
                name: 'Oil Change',
                slug: 'oil-change',
                description: 'Regular oil and filter replacement',
                icon: '🛢️',
                isPopular: true,
                displayOrder: 1,
            },
        }),
        prisma.service.create({
            data: {
                name: 'Brake Service',
                slug: 'brake-service',
                description: 'Brake pad replacement, rotor resurfacing',
                icon: '🛑',
                isPopular: true,
                displayOrder: 2,
            },
        }),
        prisma.service.create({
            data: {
                name: 'Battery Replacement',
                slug: 'battery',
                description: 'Battery testing and replacement',
                icon: '🔋',
                isPopular: true,
                displayOrder: 3,
            },
        }),
        prisma.service.create({
            data: {
                name: 'Tire Rotation',
                slug: 'tire-rotation',
                description: 'Tire rotation and balance',
                icon: '🔄',
                isPopular: true,
                displayOrder: 4,
            },
        }),
        prisma.service.create({
            data: {
                name: 'Engine Diagnostic',
                slug: 'engine-diagnostic',
                description: 'Computer diagnostics and error code reading',
                icon: '🔧',
                isPopular: false,
                displayOrder: 5,
            },
        }),
        prisma.service.create({
            data: {
                name: 'Inspection',
                slug: 'inspection',
                description: 'Safety and emissions inspection',
                icon: '✅',
                isPopular: true,
                displayOrder: 6,
            },
        }),
    ]);
    console.log('✅ Created services');
    const ownerUser = await prisma.user.upsert({
        where: { email: 'owner@shanda.com' },
        update: {},
        create: {
            email: 'owner@shanda.com',
            name: 'John Owner',
            password: await bcrypt.hash('password123', 10),
            phone: '+1 (902) 555-0100',
            roles: ['owner'],
            onboardingComplete: true,
            city: 'Halifax',
            state: 'NS',
            address: '123 Spring Garden Road',
            zipCode: 'B3H 1Y6',
        },
    });
    const provider1 = await prisma.user.upsert({
        where: { email: 'provider@shanda.com' },
        update: {},
        create: {
            email: 'provider@shanda.com',
            name: 'Mike Thompson',
            password: await bcrypt.hash('password123', 10),
            phone: '+1 (902) 555-0101',
            roles: ['provider'],
            onboardingComplete: true,
            providerOnboardingComplete: true,
            businessName: 'Halifax Auto Care',
            bio: 'Family-owned shop serving Halifax for over 15 years. ASE certified mechanics specializing in all makes and models.',
            serviceTypes: ['Oil Change', 'Brake Service', 'Diagnostics', 'Tire Service'],
            yearsInBusiness: 15,
            certifications: ['ASE Certified', 'Red Seal Certified', 'AAA Approved'],
            city: 'Halifax',
            state: 'NS',
            shopAddress: '1500 Bedford Highway',
            shopCity: 'Halifax',
            shopState: 'NS',
            shopZipCode: 'B3M 2K2',
            serviceArea: ['Halifax', 'Dartmouth', 'Bedford', 'Sackville'],
            isMobileService: false,
            isShopService: true,
            rating: 4.8,
            reviewCount: 124,
        },
    });
    const provider2 = await prisma.user.upsert({
        where: { email: 'mobile@shanda.com' },
        update: {},
        create: {
            email: 'mobile@shanda.com',
            name: 'Sarah Mobile',
            password: await bcrypt.hash('password123', 10),
            phone: '+1 (902) 555-0102',
            roles: ['provider'],
            onboardingComplete: true,
            providerOnboardingComplete: true,
            businessName: 'Mobile Mechanic HFX',
            bio: 'Bringing the shop to you! Convenient mobile service for busy professionals. Available evenings and weekends.',
            serviceTypes: ['Oil Change', 'Battery', 'Tire Service', 'Brake Service'],
            yearsInBusiness: 7,
            certifications: ['Red Seal Certified', 'Mobile Service Certified'],
            city: 'Halifax',
            state: 'NS',
            serviceArea: ['Halifax', 'Dartmouth', 'Bedford'],
            isMobileService: true,
            isShopService: false,
            rating: 4.9,
            reviewCount: 87,
        },
    });
    const provider3 = await prisma.user.upsert({
        where: { email: 'elite@shanda.com' },
        update: {},
        create: {
            email: 'elite@shanda.com',
            name: 'Tom Richardson',
            password: await bcrypt.hash('password123', 10),
            phone: '+1 (902) 555-0103',
            roles: ['provider'],
            onboardingComplete: true,
            providerOnboardingComplete: true,
            businessName: 'Elite Motors Halifax',
            bio: 'Premium automotive service specializing in European and luxury vehicles. State-of-the-art diagnostic equipment.',
            serviceTypes: ['Engine Repair', 'Transmission', 'AC Service', 'Diagnostics'],
            yearsInBusiness: 12,
            certifications: ['ASE Master Certified', 'BMW Certified', 'Mercedes Certified'],
            city: 'Halifax',
            state: 'NS',
            shopAddress: '2000 Robie Street',
            shopCity: 'Halifax',
            shopState: 'NS',
            shopZipCode: 'B3K 4N5',
            serviceArea: ['Halifax', 'Dartmouth'],
            isMobileService: false,
            isShopService: true,
            rating: 4.7,
            reviewCount: 56,
        },
    });
    console.log('✅ Created users and providers');
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
//# sourceMappingURL=seed-updated.js.map