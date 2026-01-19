import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private readonly db: PrismaService) {}

  async getStats() {
    // Get real counts from database
    const [
      totalUsers,
      totalVehicles,
      activeJobs,
      completedJobs,
    ] = await Promise.all([
      this.db.user.count(),
      this.db.vehicle.count(),
      this.db.job.count({
        where: { status: 'in_progress' },
      }),
      this.db.job.count({
        where: { status: 'completed' },
      }),
    ]);

    // Phase 1: Revenue removed (no payments)
    const totalRevenue = 0;

    return {
      totalUsers,
      totalVehicles,
      activeJobs,
      totalRevenue,
      jobsCompleted: completedJobs,
    };
  }

  async getActivity() {
    return this.db.activity.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async getSettings() {
    // Platform settings - could be stored in database later
    // For now, return configuration that can be easily updated
    return {
      businessHours: {
        monday: { open: '09:00', close: '18:00', timezone: 'PST' },
        tuesday: { open: '09:00', close: '18:00', timezone: 'PST' },
        wednesday: { open: '09:00', close: '18:00', timezone: 'PST' },
        thursday: { open: '09:00', close: '18:00', timezone: 'PST' },
        friday: { open: '09:00', close: '18:00', timezone: 'PST' },
        saturday: { open: '10:00', close: '16:00', timezone: 'PST' },
        sunday: { open: null, close: null, closed: true },
      },
      supportEmail: 'support@shanda.com',
      socialMedia: {
        twitter: 'https://twitter.com/shanda',
        facebook: 'https://facebook.com/shanda',
        linkedin: 'https://linkedin.com/company/shanda',
      },
      features: {
        liveChatEnabled: false,
        phoneSupport: false,
      },
    };
  }
}
