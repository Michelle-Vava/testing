import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private readonly db: PrismaService) {}

  async getStats() {
    // Get real counts from database
    const [
      totalCustomers,
      totalProviders,
      totalJobsCompleted,
      avgSavingsData,
    ] = await Promise.all([
      // Count users who are customers (have created requests or vehicles)
      this.db.user.count({
        where: {
          OR: [
            { ownedVehicles: { some: {} } },
            { serviceRequests: { some: {} } },
          ],
        },
      }),
      
      // Count users who are providers (have provider profiles)
      this.db.user.count({
        where: {
          roles: {
            has: 'provider',
          },
        },
      }),
      
      // Count completed jobs
      this.db.job.count({
        where: {
          status: 'COMPLETED',
        },
      }),
      
      // Calculate average savings
      // This is a placeholder - you'll need to define how savings are calculated
      // For now, we'll use the difference between highest and accepted quote per request
      this.db.serviceRequest.findMany({
        where: {
          quotes: {
            some: {
              status: 'ACCEPTED',
            },
          },
        },
        include: {
          quotes: {
            select: {
              amount: true,
              status: true,
            },
          },
        },
      }),
    ]);

    // Calculate average savings
    let totalSavings = 0;
    let requestsWithSavings = 0;

    for (const request of avgSavingsData) {
      const quotes = request.quotes;
      if (quotes.length > 1) {
        const acceptedQuote = quotes.find((q: any) => q.status === 'ACCEPTED');
        const allPrices = quotes.map((q: any) => parseFloat(q.amount.toString()));
        const maxPrice = Math.max(...allPrices);
        
        if (acceptedQuote) {
          const savings = maxPrice - parseFloat(acceptedQuote.amount.toString());
          if (savings > 0) {
            totalSavings += savings;
            requestsWithSavings++;
          }
        }
      }
    }

    const averageSavings = requestsWithSavings > 0 
      ? Math.round(totalSavings / requestsWithSavings) 
      : 0;

    return {
      customers: totalCustomers,
      providers: totalProviders,
      jobsCompleted: totalJobsCompleted,
      averageSavings,
    };
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
