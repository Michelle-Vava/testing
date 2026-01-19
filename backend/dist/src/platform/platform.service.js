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
        const [totalUsers, totalVehicles, activeJobs, completedJobs,] = await Promise.all([
            this.db.user.count(),
            this.db.vehicle.count(),
            this.db.job.count({
                where: { status: 'in_progress' },
            }),
            this.db.job.count({
                where: { status: 'completed' },
            }),
        ]);
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