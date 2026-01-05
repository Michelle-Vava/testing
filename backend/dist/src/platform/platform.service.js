"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/database/prisma.service");
let PlatformService = class PlatformService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getStats() {
        const [totalCustomers, totalProviders, totalJobsCompleted, avgSavingsData,] = await Promise.all([
            this.db.user.count({
                where: {
                    OR: [
                        { ownedVehicles: { some: {} } },
                        { serviceRequests: { some: {} } },
                    ],
                },
            }),
            this.db.user.count({
                where: {
                    roles: {
                        has: 'provider',
                    },
                },
            }),
            this.db.job.count({
                where: {
                    status: 'COMPLETED',
                },
            }),
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
        let totalSavings = 0;
        let requestsWithSavings = 0;
        for (const request of avgSavingsData) {
            const quotes = request.quotes;
            if (quotes.length > 1) {
                const acceptedQuote = quotes.find((q) => q.status === 'ACCEPTED');
                const allPrices = quotes.map((q) => parseFloat(q.amount.toString()));
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
};
exports.PlatformService = PlatformService;
exports.PlatformService = PlatformService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformService);
//# sourceMappingURL=platform.service.js.map